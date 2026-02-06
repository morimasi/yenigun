
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, Candidate, TrainingUnit, CustomTrainingPlan, TrainingGenerationConfig, TrainingQuiz, Branch } from "../../types";

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
  } catch (e) { return null; }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz: TrainingQuiz }> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı.
      GÖREV: "${plan.title}" için ${config.slideCount} slaytlık ultra-profesyonel bir eğitim üret.
      
      KONFİGÜRASYON PROTOKOLÜ:
      1. Ekol Bias: ${config.pedagogicalBias} (İçerik tamamen bu ekolün terminolojisiyle örülmeli).
      2. Kognitif Yük: ${config.cognitiveLoad} (${config.cognitiveLoad === 'SUPERVISOR' ? 'Derin vaka muhakemesi ve strateji' : 'Temel uygulama teknikleri'}).
      3. Hedef Kitle: ${config.audience}.
      4. Görselleştirme: ${config.includeVisuals ? 'Her slayt için detaylı visualPrompt üret' : 'Görsel kullanılmayacak'}.
      5. Tema: ${config.theme}. Ton: ${config.tone}.
      
      MULTIMODAL ELEMANLAR: 'symbol', 'graph_logic', 'interactive_case' enjekte et.
      ÇIKTI: Saf JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `MÜFREDAT DETAYI: ${plan.description}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: config.thinkingBudget || 24576 }
      }
    });

    return extractPureJSON(response.text);
  },

  async generateIDP(entity: StaffMember | Candidate, assessmentHistory: any[] = []): Promise<IDP> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PERSONEL: ${JSON.stringify(entity)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Gelişim Stratejisti. Personelin zayıf olduğu alanları onaracak 90 günlük IDP üret. Sadece JSON.",
        responseMimeType: "application/json"
      }
    });
    return extractPureJSON(response.text);
  },

  async generateTrainingSlides(idp: IDP, branch: Branch): Promise<TrainingSlide[]> { return []; },
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> { return []; },
  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> { return []; }
};
