
import { GoogleGenAI, Type } from "@google/genai";
import { 
  StaffMember, IDP, TrainingSlide, CustomTrainingPlan, 
  TrainingGenerationConfig, TrainingQuiz, Branch,
  PedagogicalSchool, CognitiveLoad, TrainingModule,
  // @fix: Added missing PresentationConfig import from types.ts
  PresentationConfig
} from "../../types";

const extractPureJSON = (text: string): any => {
  if (!text) return null;
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.search(/[{\[]/);
    const lastBrace = Math.max(cleanText.lastIndexOf('}'), cleanText.lastIndexOf(']'));
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) return null;
    const jsonString = cleanText.substring(firstBrace, lastBrace + 1);
    const sanitizedString = jsonString.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    return JSON.parse(sanitizedString);
  } catch (e) { 
    console.error("MIA AI Engine Error", e);
    return null; 
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    // @fix: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı.
      GÖREV: "${plan.title}" konusu üzerine profesyonel bir eğitim üret.
      FORMAT: JSON. { "slides": [...], "quiz": { "questions": [...] } }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `EĞİTİM TANIMI: ${plan.description} | KONFİG: ${JSON.stringify(config)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const result = extractPureJSON(response.text);
    if (!result) throw new Error("AI Yanıt Sentezi Başarısız.");
    return result;
  },

  async generateIDP(entity: StaffMember | any, assessmentHistory: any[] = []): Promise<IDP> {
    // @fix: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const profileSnapshot = {
        name: entity.name,
        branch: entity.branch,
        report: entity.report,
        experience: entity.experience_years || entity.experienceYears
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PERSONEL PROFIİL VE ANALİZ: ${JSON.stringify({ profileSnapshot, assessmentHistory })}`,
      config: {
        systemInstruction: `
          ROL: Kıdemli Gelişim Stratejisti. 
          GÖREV: Adayın/Personelin zayıf noktalarını (AI raporuna göre) onaracak 90 günlük "Nöral Adaptasyon ve Gelişim Planı" (IDP) üret.
          KRİTER: 
          - Roadmap 3 aşamalı olmalı: 30-60-90 gün.
          - Curriculum içinde en az 4 teknik modül olmalı.
          ÇIKTI: Kesinlikle JSON döndür.
        `,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusArea: { type: Type.STRING },
            roadmap: {
              type: Type.OBJECT,
              properties: {
                shortTerm: { type: Type.STRING },
                midTerm: { type: Type.STRING },
                longTerm: { type: Type.STRING }
              },
              required: ["shortTerm", "midTerm", "longTerm"]
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
                  units: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        type: { type: Type.STRING },
                        content: { type: Type.STRING },
                        aiRationale: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          },
          required: ["focusArea", "roadmap", "curriculum"]
        }
      }
    });

    const result = extractPureJSON(response.text);
    if (!result) throw new Error("IDP Sentezi Başarısız.");
    return {
        id: `IDP-${Date.now().toString().slice(-6)}`,
        ...result,
        status: 'active',
        createdAt: Date.now()
    };
  },

  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
    // @fix: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PLANA ÖZEL EĞİTİM ÜRET: ${JSON.stringify(plan)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Eğitmen Robotu. Planı interaktif slaytlara dönüştür. JSON döndür.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const res = extractPureJSON(response.text);
    return res?.slides || [];
  },

  // @fix: Added generateTrainingSlides to fulfill the contract required by DecisionSupportView.tsx
  async generateTrainingSlides(plan: IDP, branch: Branch): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP PLANI: ${JSON.stringify(plan)} | BRANŞ: ${branch}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Eğitim Geliştirme. IDP planını görsel odaklı, profesyonel eğitim slaytlarına dönüştür. JSON formatında 'slides' dizisi döndür.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const result = extractPureJSON(response.text);
    return result?.slides || [];
  },

  // @fix: Added generateCustomPresentation to fulfill the contract required by PresentationStudio.tsx
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SUNUM KONFİGÜRASYONU: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Sunum Stüdyosu. Belirlenen konfigürasyona göre akademik bir sunum yapısı oluştur. JSON formatında 'slides' dizisi döndür.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const result = extractPureJSON(response.text);
    return result?.slides || [];
  }
};
