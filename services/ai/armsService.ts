
import { GoogleGenAI, Type } from "@google/genai";
import { 
  StaffMember, IDP, TrainingSlide, CustomTrainingPlan, 
  TrainingGenerationConfig, TrainingQuiz, Branch,
  PedagogicalSchool, CognitiveLoad
} from "../../types";

/**
 * MIA AI Engine - Robust JSON Extractor
 * Metin içindeki geçerli JSON bloğunu (Object veya Array) izole eder.
 */
const extractPureJSON = (text: string): any => {
  if (!text) return null;
  try {
    // 1. Markdown kod bloklarını temizle
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 2. İlk parantez ve son parantezi bul (Hem { } hem [ ] destekler)
    const firstBrace = cleanText.search(/[{\[]/);
    const lastBrace = Math.max(cleanText.lastIndexOf('}'), cleanText.lastIndexOf(']'));
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      console.error("MIA AI Engine: Geçerli bir JSON yapısı bulunamadı.");
      return null;
    }
    
    // 3. Sadece JSON bloğunu kes ve al
    const jsonString = cleanText.substring(firstBrace, lastBrace + 1);
    
    // 4. Görünmez kontrol karakterlerini temizle
    const sanitizedString = jsonString.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    
    return JSON.parse(sanitizedString);
  } catch (e) { 
    console.error("MIA AI Engine Crash (JSON Parse Error):", e);
    // Hata durumunda ham metni logla (debug için)
    console.debug("Raw Response from AI:", text);
    return null; 
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı ve Klinik Psikolog.
      GÖREV: "${plan.title}" konusu üzerine ${config.slideCount} slaytlık ultra-profesyonel bir eğitim üret.
      
      PARAMETRELER:
      1. Ekol: ${config.pedagogicalBias}
      2. Bilişsel Yük: ${config.cognitiveLoad}
      3. Hedef Kitle: ${config.audience}
      4. Görselleştirme: ${config.includeVisuals ? 'Her slayt için profesyonel visualPrompt üret' : 'Görsel kullanılmayacak'}
      5. Değerlendirme: ${config.hasEvaluation ? 'Eğitim sonunda 5 soruluk bir quiz üret' : 'Quiz üretilmeyecek'}
      
      ÇIKTI FORMATI:
      Kesinlikle sadece JSON döndür. Başka hiçbir açıklama metni ekleme.
      Yapı: { "slides": [...], "quiz": { "questions": [...] } }
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
    if (!result) throw new Error("AI Yanıt Sentezi Başarısız: JSON formatı doğrulanamadı.");
    return result;
  },

  async generateIDP(entity: StaffMember | any, assessmentHistory: any[] = []): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PERSONEL VE GEÇMİŞ: ${JSON.stringify({ entity, assessmentHistory })}`,
      config: {
        systemInstruction: "Gelişim Stratejisti. Personelin zayıf yönlerini onaracak 90 günlük IDP üret. Sadece JSON döndür.",
        responseMimeType: "application/json"
      }
    });
    const result = extractPureJSON(response.text);
    if (!result) throw new Error("IDP Sentezi Başarısız.");
    return result;
  },

  // ... Diğer metodlar için de benzer iyileştirmeler (Gerekirse)
  async generateTrainingSlides(idp: IDP, branch: Branch): Promise<TrainingSlide[]> { return []; },
  async generateCustomPresentation(config: any): Promise<TrainingSlide[]> { return []; },
  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> { return []; }
};
