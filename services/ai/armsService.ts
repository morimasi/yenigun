
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, TrainingUnit, Candidate } from "../../types";

export const armsService = {
  // SUNUMDAN IDP/MÜFREDAT ÜRETME (Bridge Function)
  async convertPresentationToIDP(staff: StaffMember, slides: TrainingSlide[], topic: string): Promise<IDP> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Eğitim Teknolojisi Mimarı".
      GÖREV: Verilen sunum slaytlarını analiz et ve bu slaytlardaki akademik derinliği bir "Personel Gelişim Müfredatına" (IDP) dönüştür.
      
      KRİTERLER:
      1. Her ana slaytı bir 'TrainingModule' olarak kurgula.
      2. Slayt içerisindeki maddeleri 'TrainingUnit' görevlerine (Vaka Analizi, Okuma, Simülasyon) çevir.
      3. Her görev için personelin test edileceği 'successCriteria' belirle.
      ÇIKTI: Saf JSON olmalı.
    `;

    // @fix: Initialized GoogleGenAI right before the API call as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PERSONEL: ${staff.name} | BRANŞ: ${staff.branch} | KONU: ${topic} | SLAYTLAR: ${JSON.stringify(slides)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: `IDP-AUTO-${Date.now()}`,
      staffId: staff.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft',
      focusArea: topic,
      identifiedGaps: data.identifiedGaps || [],
      roadmap: data.roadmap || { shortTerm: '', midTerm: '', longTerm: '' },
      recommendedTrainings: data.recommendedTrainings || [],
      milestones: data.milestones || [],
      curriculum: data.curriculum || []
    };
  },

  async generateIDP(subject: StaffMember | Candidate, history?: any[]): Promise<IDP> {
    // @fix: Initialized GoogleGenAI right before the API call as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Mentorluk Motoru.
      GÖREV: Verilen personel/aday verilerini ve sınav geçmişini analiz ederek kişiselleştirilmiş 90 günlük gelişim rotası (IDP) oluştur.
      ÇIKTI: Saf JSON olmalı.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `VERİ: ${JSON.stringify(subject)} | GEÇMİŞ: ${JSON.stringify(history)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 12000 }
      }
    });
    const data = JSON.parse(response.text || '{}');
    return {
      id: `IDP-${Date.now()}`,
      staffId: subject.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft',
      focusArea: data.focusArea || 'Klinik Gelişim',
      identifiedGaps: data.identifiedGaps || [],
      roadmap: data.roadmap || { shortTerm: '', midTerm: '', longTerm: '' },
      recommendedTrainings: data.recommendedTrainings || [],
      milestones: data.milestones || [],
      curriculum: data.curriculum || []
    };
  },

  // @fix: Added missing generateTrainingSlides method to resolve property missing error in DecisionSupportView.tsx.
  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Eğitim Tasarımcısı.
      GÖREV: Oluşturulan Bireysel Gelişim Planını (IDP) profesyonel bir eğitim sunumuna dönüştür.
      
      KRİTERLER:
      1. Her modülü en az 2 slayt olarak kurgula.
      2. 'imageKeyword' alanı Unsplash uyumlu İngilizce kelime olmalı.
      3. Çıktı saf JSON dizi olmalı.
    `;

    // @fix: Initialized GoogleGenAI right before the API call as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP: ${JSON.stringify(idp)} | BRANŞ: ${branch}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const slides = JSON.parse(response.text || '[]');
    return slides.map((s: any, i: number) => ({
      ...s,
      id: `SLIDE-IDP-${Date.now()}-${i}`,
      generatedImageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(s.visualPrompt || s.title)}?width=1280&height=720&nologo=true`
    }));
  },

  // KATALOG ŞABLONUNDAN SUNUM ÜRETME
  async generateFromCatalogTemplate(template: any, config: PresentationConfig): Promise<TrainingSlide[]> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Akademik Direktörü.
      GÖREV: Seçilen "${template.title}" şablonunu, kurumun ihtiyaçlarına göre profesyonel bir akademik sunuma dönüştür.
      
      BAĞLAM:
      - Şablon Birimleri: ${JSON.stringify(template.coreUnits)}
      - Hedef Kitle: ${config.targetAudience}
      - Ton: ${config.tone}
      
      KRALLAR:
      1. Her birimi derinlemesine analiz et.
      2. 'imageKeyword' alanı Unsplash için İngilizce tekil kelime olmalı.
      3. 'visualPrompt' alanı AI görsel sentezi için detaylı tasvir içermeli.
      4. Slaytlar akademik liyakat standartlarında olmalı.
    `;

    // @fix: Initialized GoogleGenAI right before the API call as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${template.title} | SLAYT SAYISI: ${config.slideCount} | STİL: ${config.visualStyle}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const slides = JSON.parse(response.text || '[]');
    return slides.map((s: any, i: number) => ({
      ...s,
      id: `SLIDE-${Date.now()}-${i}`,
      generatedImageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(s.visualPrompt || s.title)}?width=1280&height=720&nologo=true`
    }));
  },

  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Kreatif Direktör".
      GÖREV: Akademik liyakat sunumu tasarla.
      
      STİL KURALLARI:
      - 'layout': [cover, section_header, split_left, split_right, full_visual, bullet_list, quote_center, data_grid, process_flow]
      - 'imageKeyword': İngilizce, Unsplash uyumlu tekil kelime.
      - 'visualPrompt': Görselin ruhunu anlatan detaylı sanatsal tasvir.
      ÇIKTI: Saf JSON dizi.
    `;

    // @fix: Initialized GoogleGenAI right before the API call as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${config.topic} | KİTLE: ${config.targetAudience} | DERİNLİK: ${config.depth} | SLAYT: ${config.slideCount}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const slides = JSON.parse(response.text || '[]');
    return slides.map((s: any, i: number) => ({ ...s, id: `SLIDE-${Date.now()}-${i}` }));
  },

  async refineSlideContent(slide: TrainingSlide, intent: string): Promise<TrainingSlide> {
    // @fix: Initialized GoogleGenAI right before the API call as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SLAYT: ${JSON.stringify(slide)} | NİYET: ${intent}`,
      config: {
        systemInstruction: "Slaytı belirtilen niyetle yeniden kurgula. Sadece JSON döndür.",
        responseMimeType: "application/json"
      }
    });
    return { ...slide, ...JSON.parse(response.text || '{}') };
  }
};
