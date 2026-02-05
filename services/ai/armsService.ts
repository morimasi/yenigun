
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, TrainingUnit, Candidate, PersonaType, SlideConnection } from "../../types";

const safeParseArray = (raw: string, fallback: any[] = []): any[] => {
    try {
        const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object') {
            const key = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
            if (key) return parsed[key];
        }
        return fallback;
    } catch (e) {
        console.warn("AI JSON Parse Warning:", e);
        return fallback;
    }
};

export const armsService = {
  // FAZ 3: SIMULATION GRAPH ENGINE
  async generateBranchedSimulation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Stratejik Simülasyon Mimarı".
      GÖREV: Statik bir sunum değil, kararlara dayalı "Dallanan bir Klinik Simülasyon" (Branched Graph) oluştur.
      
      YAPI:
      1. Slaytlar arasında 'connections' alanı ile köprü kur.
      2. En az 2 ana Karar Noktası (Decision Node) ekle.
      3. Her karar noktasından en az 2 farklı yola (targetId) ayrıl.
      4. Adayın bir hatası, ileriki slaytlarda daha zor bir vaka (Stress Trigger) olarak karşısına çıkmalı.
      
      ÇIKTI: JSON dizisi. Her nesne 'id', 'layout', 'title', 'content' (dizi), 'connections' (SlideConnection dizisi) içermeli.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Dallanma mantığı için Pro model şart
      contents: `KONU: ${config.topic} | DERİNLİK: ${config.depth} | ADAY TİPİ: ${config.targetAudience}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32000 }
      }
    });

    const slides = safeParseArray(response.text || '[]');
    return slides.map((s, i) => ({
        ...s,
        id: s.id || `NODE-${i}`,
        isRoot: i === 0
    }));
  },

  async evaluateNextNode(currentSlide: TrainingSlide, candidateResponse: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Simülasyon Hakemi.
      GÖREV: Adayın "${candidateResponse}" cevabını analiz et ve mevcut slaytın bağlantılarından (connections) hangisine gitmesi gerektiğine karar ver.
      BAĞLANTILAR: ${JSON.stringify(currentSlide.connections)}
      ÇIKTI: Sadece hedef slaytın 'targetId' değerini döndür.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Karar ver.",
      config: { systemInstruction }
    });

    return response.text?.trim() || (currentSlide.connections?.[0]?.targetId || '');
  },

  async refineAtomicContent(slide: TrainingSlide, targetField: 'title' | 'content' | 'subtitle', intent: string, itemIndex?: number): Promise<TrainingSlide> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SLAYT: ${JSON.stringify(slide)} | HEDEF: ${targetField} | NİYET: ${intent}`,
      config: { systemInstruction: "Hassas İçerik Editörü. Çıktı JSON.", responseMimeType: "application/json" }
    });
    try {
        const delta = JSON.parse(response.text || '{}');
        const next = { ...slide };
        if (targetField === 'content' && typeof itemIndex === 'number') {
            const c = [...(next.content || [])];
            c[itemIndex] = delta.value || delta.content || delta;
            next.content = c;
        } else { (next as any)[targetField] = delta.value || delta[targetField] || delta; }
        return next;
    } catch { return slide; }
  },

  async morphPresentation(slides: TrainingSlide[], targetPersona: PersonaType): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SLAYTLAR: ${JSON.stringify(slides)}`,
      config: { systemInstruction: "Adaptif İçerik Mimarı. Çıktı JSON.", responseMimeType: "application/json" }
    });
    const morphed = safeParseArray(response.text || '[]');
    return slides.map(o => ({ ...o, ...(morphed.find((m: any) => m.id === o.id) || {}) }));
  },

  async generateFromCatalogTemplate(template: any, config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${template.title}`,
      config: { systemInstruction: "Eğitim Tasarımcısı. Çıktı JSON.", responseMimeType: "application/json" }
    });
    return safeParseArray(response.text || '[]');
  },

  async generateIDP(subject: StaffMember | Candidate, assessmentHistory: any[] = []): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `SUBJECT: ${JSON.stringify(subject)}`,
      config: { systemInstruction: "Gelişim Planı Motoru. Çıktı JSON.", responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  },

  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `IDP: ${JSON.stringify(idp)}`,
      config: { systemInstruction: "Eğitim Tasarımcısı. Çıktı JSON.", responseMimeType: "application/json" }
    });
    return safeParseArray(response.text || '[]');
  },

  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `CONFIG: ${JSON.stringify(config)}`,
      config: { systemInstruction: "Eğitim Tasarımcısı. Çıktı JSON.", responseMimeType: "application/json" }
    });
    return safeParseArray(response.text || '[]');
  },

  async refineSlideContent(slide: TrainingSlide, intent: string): Promise<TrainingSlide> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SLAYT: ${JSON.stringify(slide)} | NİYET: ${intent}`,
      config: { systemInstruction: "Slaytı geliştir. Çıktı JSON.", responseMimeType: "application/json" }
    });
    return { ...slide, ...JSON.parse(response.text || '{}') };
  }
};
