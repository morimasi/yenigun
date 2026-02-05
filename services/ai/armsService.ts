import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, TrainingUnit, Candidate, PersonaType } from "../../types";

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

/**
 * Yeni Gün Akademi ARMS AI Service
 * @fix: Implemented missing methods generateIDP, generateTrainingSlides, and generateCustomPresentation to resolve compilation errors.
 */
export const armsService = {
  // FAZ 2: ATOMIC REFINEMENT ENGINE
  async refineAtomicContent(
    slide: TrainingSlide, 
    targetField: 'title' | 'content' | 'subtitle', 
    intent: string,
    itemIndex?: number
  ): Promise<TrainingSlide> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Hassas İçerik Editörü".
      GÖREV: Verilen slaytın SADECE belirtilen '${targetField}' alanını, kullanıcının '${intent}' niyetiyle yeniden kurgula.
      
      KRİTERLER:
      1. Diğer alanlara ASLA DOKUNMA.
      2. Eğer hedef 'content' ve bir 'itemIndex' verilmişse, sadece o dizindeki maddeyi değiştir.
      3. Anlamsal bütünlüğü (context) koru.
      
      ÇIKTI: Sadece güncellenmiş alanın değerini içeren bir JSON objesi döndür.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SLAYT: ${JSON.stringify(slide)} | HEDEF: ${targetField} | İNDİS: ${itemIndex ?? 'n/a'} | NİYET: ${intent}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    try {
        const delta = JSON.parse(response.text || '{}');
        const nextSlide = { ...slide };
        
        if (targetField === 'content' && typeof itemIndex === 'number' && nextSlide.content) {
            const newContent = [...nextSlide.content];
            newContent[itemIndex] = delta.value || delta.content || delta;
            nextSlide.content = newContent;
        } else {
            (nextSlide as any)[targetField] = delta.value || delta[targetField] || delta;
        }
        
        return nextSlide;
    } catch (e) {
        return slide;
    }
  },

  async morphPresentation(slides: TrainingSlide[], targetPersona: PersonaType): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Adaptif İçerik Mimarı".
      GÖREV: Slaytları ${targetPersona.toUpperCase()} personasına göre yeniden sentezle.
      ÇIKTI: JSON dizisi.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SLAYTLAR: ${JSON.stringify(slides)}`,
      config: { systemInstruction, responseMimeType: "application/json" }
    });
    const morphedBase = safeParseArray(response.text || '[]');
    return slides.map(original => {
        const morphed = morphedBase.find(m => m.id === original.id);
        return morphed ? { ...original, ...morphed } : original;
    });
  },

  async generateFromCatalogTemplate(template: any, config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${template.title} | ŞABLON: ${JSON.stringify(template.coreUnits)}`,
      config: { 
          systemInstruction: "Akademik Eğitim Tasarımcısı olarak sunum üret. Çıktı JSON dizisi.",
          responseMimeType: "application/json" 
      }
    });
    const slides = safeParseArray(response.text || '[]');
    return slides.map((s: any, i: number) => ({ ...s, id: `SLIDE-${Date.now()}-${i}` }));
  },

  async refineSlideContent(slide: TrainingSlide, intent: string): Promise<TrainingSlide> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SLAYT: ${JSON.stringify(slide)} | NİYET: ${intent}`,
      config: { systemInstruction: "Slaytı geliştir. Çıktı JSON.", responseMimeType: "application/json" }
    });
    return { ...slide, ...JSON.parse(response.text || '{}') };
  },

  // @fix: Implemented generateIDP method to resolve errors in DevelopmentRouteView and DecisionSupportView.
  async generateIDP(subject: StaffMember | Candidate, assessmentHistory: any[] = []): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `SUBJECT: ${JSON.stringify(subject)} | HISTORY: ${JSON.stringify(assessmentHistory)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Klinik Mentorluk Sistemi. Personelin yetkinlik açıklarını analiz et ve 90 günlük gelişim planı (IDP) üret. Saf JSON döndür.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            staffId: { type: Type.STRING },
            createdAt: { type: Type.NUMBER },
            updatedAt: { type: Type.NUMBER },
            focusArea: { type: Type.STRING },
            identifiedGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            roadmap: {
              type: Type.OBJECT,
              properties: {
                shortTerm: { type: Type.STRING },
                midTerm: { type: Type.STRING },
                longTerm: { type: Type.STRING }
              },
              required: ["shortTerm", "midTerm", "longTerm"]
            },
            recommendedTrainings: { type: Type.ARRAY, items: { type: Type.STRING } },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  dueDate: { type: Type.STRING },
                  isCompleted: { type: Type.BOOLEAN }
                }
              }
            },
            curriculum: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  focusArea: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  status: { type: Type.STRING },
                  units: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        type: { type: Type.STRING },
                        content: { type: Type.STRING },
                        durationMinutes: { type: Type.NUMBER },
                        isCompleted: { type: Type.BOOLEAN },
                        aiRationale: { type: Type.STRING },
                        successCriteria: { type: Type.STRING },
                        status: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            status: { type: Type.STRING }
          },
          required: ["focusArea", "identifiedGaps", "roadmap", "curriculum"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  // @fix: Implemented generateTrainingSlides method to resolve error in DecisionSupportView.
  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `IDP: ${JSON.stringify(idp)} | BRANCH: ${branch}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Eğitim Tasarımcısı. Verilen IDP ve branş bilgisine göre 8-12 slaytlık bir eğitim destesi oluştur. Saf JSON dizisi döndür. Her nesne TrainingSlide yapısında olmalı.",
        responseMimeType: "application/json"
      }
    });
    const slides = safeParseArray(response.text || '[]');
    return slides.map((s: any, i: number) => ({ 
      ...s, 
      id: s.id || `SLD-${Date.now()}-${i}`,
      layout: s.layout || 'bullet_list'
    }));
  },

  // @fix: Implemented generateCustomPresentation method to resolve error in PresentationStudio.
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `CONFIG: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Eğitim Tasarımcısı. Belirtilen konuya ve hedef kitleye uygun profesyonel slaytlar üret. Saf JSON dizisi döndür. Her nesne TrainingSlide yapısında olmalı.",
        responseMimeType: "application/json"
      }
    });
    const slides = safeParseArray(response.text || '[]');
    return slides.map((s: any, i: number) => ({ 
      ...s, 
      id: s.id || `CSP-${Date.now()}-${i}`,
      layout: s.layout || 'bullet_list'
    }));
  }
};