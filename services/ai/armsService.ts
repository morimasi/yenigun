
import { GoogleGenAI, Type } from "@google/genai";
import { 
  StaffMember, IDP, TrainingSlide, CustomTrainingPlan, 
  TrainingGenerationConfig, TrainingQuiz, Branch,
  PedagogicalSchool, CognitiveLoad, TrainingModule,
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
    console.error("MIA ARMS JSON Engine Error:", e);
    return null; 
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `EĞİTİM KONUSU: ${plan.title} | KAPSAM: ${plan.description} | KONFİG: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Baş Müfredat Tasarımcısı. Profesyonel, akademik ve görsel odaklı eğitim üret. Slides bir dizi olmalı.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const result = extractPureJSON(response.text);
    if (!result) throw new Error("AI Yanıt Üretemedi.");
    return {
        slides: Array.isArray(result.slides) ? result.slides : [],
        quiz: result.quiz
    };
  },

  async generateIDP(entity: any, assessmentHistory: any[] = []): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PERSONEL VERİLERİ: ${JSON.stringify({ name: entity.name, branch: entity.branch, report: entity.report })} | GEÇMİŞ: ${JSON.stringify(assessmentHistory)}`,
      config: {
        systemInstruction: "Kıdemli Gelişim Stratejisti. Adayın zayıf noktalarını onaracak 90 günlük 'Nöral Adaptasyon Planı' üret. Curriculum ve roadmap mutlaka olmalı.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const result = extractPureJSON(response.text);
    if (!result) throw new Error("IDP Sentez Hatası.");
    return {
        id: `IDP-${Date.now().toString().slice(-6)}`,
        focusArea: result.focusArea || "Genel Gelişim",
        roadmap: result.roadmap || { shortTerm: "Planlanıyor", midTerm: "Planlanıyor", longTerm: "Planlanıyor" },
        curriculum: Array.isArray(result.curriculum) ? result.curriculum : [],
        status: 'active',
        createdAt: Date.now()
    };
  },

  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PLANA ÖZEL EĞİTİM ÜRET: ${JSON.stringify(plan)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Eğitmen Robotu. Planı interaktif slaytlara dönüştür. JSON döndür. 'slides' adında bir dizi içermeli.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  },

  async generateTrainingSlides(plan: IDP, branch: Branch): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP PLANI: ${JSON.stringify(plan)} | BRANŞ: ${branch}`,
      config: {
        systemInstruction: "IDP planını görsel odaklı eğitim slaytlarına dönüştür. JSON formatında 'slides' dizisi döndür.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const result = extractPureJSON(response.text);
    return Array.isArray(result?.slides) ? result.slides : [];
  },

  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SUNUM KONFİGÜRASYONU: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: "Belirlenen konfigürasyona göre akademik bir sunum yapısı oluştur. JSON formatında 'slides' dizisi döndür.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const result = extractPureJSON(response.text);
    return Array.isArray(result?.slides) ? result.slides : [];
  }
};
