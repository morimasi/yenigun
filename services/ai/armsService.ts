
import { GoogleGenAI, Type } from "@google/genai";
import { 
  StaffMember, IDP, TrainingSlide, CustomTrainingPlan, 
  TrainingGenerationConfig, TrainingQuiz, Branch,
  PedagogicalSchool, CognitiveLoad
} from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractPureJSON = (text: string): any => {
  if (!text) return null;
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace === -1) return null;
    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(cleanText);
  } catch (e) { 
    console.error("MIA AI Engine Crash:", e);
    return null; 
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı ve Klinik Psikolog.
      GÖREV: "${plan.title}" konusu üzerine ${config.slideCount} slaytlık ultra-profesyonel bir eğitim üret.
      
      PARAMETRELER:
      1. Ekol: ${config.pedagogicalBias} (İçerik ve terminoloji tamamen bu ekole sadık kalmalı).
      2. Bilişsel Yük: ${config.cognitiveLoad}.
      3. Hedef Kitle: ${config.audience}.
      4. Görselleştirme: ${config.includeVisuals ? 'Her slayt için profesyonel visualPrompt üret' : 'Görsel kullanılmayacak'}.
      5. Değerlendirme: ${config.hasEvaluation ? 'Eğitim sonunda 5 soruluk bir quiz üret' : 'Quiz üretilmeyecek'}.
      
      SLAYT YAPISI: 
      - Elements dizisi içinde 'symbol', 'graph_logic', 'interactive_case' enjekte et.
      - Ton: ${config.tone}.
      - 'speakerNotes' alanına bu slaytın eğitmene vereceği klinik direktifi yaz.
      
      ÇIKTI: Kesinlikle saf JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `EĞİTİM TANIMI: ${plan.description}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: config.thinkingBudget || 24576 }
      }
    });

    const result = extractPureJSON(response.text);
    if (!result) throw new Error("AI Yanıt Sentezi Başarısız.");
    return result;
  },

  async generateIDP(entity: StaffMember | any, assessmentHistory: any[] = []): Promise<IDP> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PERSONEL: ${JSON.stringify(entity)}`,
      config: {
        systemInstruction: "Gelişim Stratejisti. Personelin zayıf yönlerini onaracak 90 günlük IDP üret. JSON.",
        responseMimeType: "application/json"
      }
    });
    return extractPureJSON(response.text);
  },

  async generateTrainingSlides(idp: IDP, branch: Branch): Promise<TrainingSlide[]> { return []; },
  async generateCustomPresentation(config: any): Promise<TrainingSlide[]> { return []; },
  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> { return []; }
};
