
import { GoogleGenAI, Type } from "@google/genai";
import { 
  IDP, TrainingSlide, CustomTrainingPlan, 
  TrainingGenerationConfig, TrainingQuiz, Branch, PresentationConfig
} from "../../types";

const extractPureJSON = (text: string): any => {
  if (!text) return null;
  let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBrace = cleanText.indexOf('{');
  const firstBracket = cleanText.indexOf('[');
  let startIdx = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) startIdx = firstBrace;
  else if (firstBracket !== -1) startIdx = firstBracket;
  if (startIdx === -1) return null;

  let jsonPart = cleanText.substring(startIdx);
  let openBraces = 0, openBrackets = 0, inString = false, escaped = false, lastGoodIdx = 0;

  for (let i = 0; i < jsonPart.length; i++) {
    const char = jsonPart[i];
    if (char === '"' && !escaped) inString = !inString;
    if (!inString) {
      if (char === '{') openBraces++; else if (char === '}') openBraces--;
      else if (char === '[') openBrackets++; else if (char === ']') openBrackets--;
      if (openBraces === 0 && openBrackets === 0 && i > 0) { lastGoodIdx = i; break; }
    }
    escaped = (char === '\\' && !escaped);
  }

  if (openBraces > 0 || openBrackets > 0 || inString) {
    if (inString) jsonPart += '"';
    while (openBraces > 0) { jsonPart += '}'; openBraces--; }
    while (openBrackets > 0) { jsonPart += ']'; openBrackets--; }
  } else if (lastGoodIdx > 0) jsonPart = jsonPart.substring(0, lastGoodIdx + 1);

  try { return JSON.parse(jsonPart.replace(/[\x00-\x1F\x7F-\x9F]/g, "")); } 
  catch { return null; }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const safeSlideCount = Math.min(config.slideCount || 10, 20);

    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı.
      GÖREV: "${plan.title}" üzerine yüksek lisans seviyesinde AKADEMİK sunum üret.
      EKOL: ${config.pedagogicalBias}
      ZORLUK: ${config.cognitiveLoad}
      ÜSLUP: ${config.tone}
      FORMAT: JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `BAŞLIK: ${plan.title} | ÖZET: ${plan.description} | SLAYT SAYISI: ${safeSlideCount}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 12000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.ARRAY, items: { type: Type.STRING } },
                  speakerNotes: { type: Type.STRING }
                },
                required: ["id", "title", "content", "speakerNotes"]
              }
            }
          },
          required: ["slides"]
        }
      }
    });

    const result = extractPureJSON(response.text);
    if (!result || !result.slides) throw new Error("AI_DATA_VOID");
    return result;
  },

  async generateIDP(entity: any, history?: any[]): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Mentor ve Klinik Süpervizör.
      GÖREV: Adayın/Personelin liyakat profilini analiz et ve 90 günlük "Klinik Onarım ve Adaptasyon" planı üret.
      KRİTER: Zayıf olan klinik kasları güçlendirmeye odaklan.
      FORMAT: JSON döndür. Alanlar: focusArea, roadmap (shortTerm, midTerm, longTerm), curriculum (Modüller ve Üniteler).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KİŞİ: ${entity.name}. BRANŞ: ${entity.branch}. ANALİZ VERİSİ: ${JSON.stringify(entity.report || {})}. GEÇMİŞ: ${JSON.stringify(history || [])}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const result = extractPureJSON(response.text);
    return { 
      id: `IDP-${Date.now()}`, 
      ...result, 
      status: 'active', 
      createdAt: Date.now() 
    };
  },

  // @fix: Added missing generateTrainingSlides method required by DecisionSupportView.
  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP PLANI: ${JSON.stringify(idp)} | BRANŞ: ${branch}`,
      config: {
        systemInstruction: "Verilen IDP planı ve branş detaylarına göre profesyonel eğitim slaytları oluştur. Yanıtı sadece JSON formatında 'slides' anahtarı altında döndür.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 12000 }
      }
    });
    const result = extractPureJSON(response.text);
    return result?.slides || [];
  },

  // @fix: Added missing generateCustomPresentation method required by PresentationStudio.
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SUNUM KONUSU: ${config.topic} | HEDEF: ${config.targetAudience} | DERİNLİK: ${config.depth} | SAYFA: ${config.slideCount}`,
      config: {
        systemInstruction: "Belirtilen parametreler doğrultusunda akademik bir eğitim sunumu tasarla. Yanıtı sadece JSON formatında 'slides' anahtarı altında döndür.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 12000 }
      }
    });
    const result = extractPureJSON(response.text);
    return result?.slides || [];
  },

  // @fix: Added missing enhancePresentationPrompt method required by CurriculumManager.
  async enhancePresentationPrompt(title: string, currentDirectives: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `EĞİTİM BAŞLIĞI: ${title} | MEVCUT DİREKTİF: ${currentDirectives}`,
      config: {
        systemInstruction: "Mevcut eğitim direktifini daha teknik, literatür odaklı ve kapsamlı hale getir. Sadece iyileştirilmiş direktif metnini döndür.",
      }
    });
    return response.text || currentDirectives;
  }
};
