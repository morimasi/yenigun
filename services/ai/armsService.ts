
import { GoogleGenAI, Type } from "@google/genai";
import { 
  IDP, TrainingSlide, CustomTrainingPlan, 
  TrainingGenerationConfig, TrainingQuiz, Branch, PresentationConfig
} from "../../types";

/**
 * MIA Nöral JSON Ayrıştırma ve Onarım Motoru v4.0 (Self-Healing Edition)
 * Yarım kalmış veya kesilmiş JSON çıktılarını kurtarmak için tasarlandı.
 */
const extractPureJSON = (text: string): any => {
  if (!text) return null;
  
  let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  
  // 1. Başlangıç noktasını bul
  const firstBrace = cleanText.indexOf('{');
  const firstBracket = cleanText.indexOf('[');
  let startIdx = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) startIdx = firstBrace;
  else if (firstBracket !== -1) startIdx = firstBracket;
  if (startIdx === -1) return null;

  // 2. Truncation (Kesilme) Tespiti ve Onarımı
  let jsonPart = cleanText.substring(startIdx);
  
  // Basit bir parantez sayma algoritması ile eksikleri tamamla
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escaped = false;
  let lastGoodIdx = 0;

  for (let i = 0; i < jsonPart.length; i++) {
    const char = jsonPart[i];
    if (char === '"' && !escaped) inString = !inString;
    if (!inString) {
      if (char === '{') openBraces++;
      else if (char === '}') openBraces--;
      else if (char === '[') openBrackets++;
      else if (char === ']') openBrackets--;
      
      if (openBraces === 0 && openBrackets === 0 && i > 0) {
        lastGoodIdx = i;
        break;
      }
    }
    escaped = (char === '\\' && !escaped);
  }

  // Eğer JSON tam kapanmamışsa (kesilmişse)
  if (openBraces > 0 || openBrackets > 0 || inString) {
    console.warn("MIA AI: Kesilmiş JSON tespit edildi, onarılıyor...");
    if (inString) jsonPart += '"';
    while (openBraces > 0) { jsonPart += '}'; openBraces--; }
    while (openBrackets > 0) { jsonPart += ']'; openBrackets--; }
  } else if (lastGoodIdx > 0) {
    jsonPart = jsonPart.substring(0, lastGoodIdx + 1);
  }

  try {
    // Görünmez karakterleri ve tehlikeli boşlukları temizle
    const sanitized = jsonPart.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    return JSON.parse(sanitized);
  } catch (e) { 
    console.error("MIA ARMS Kritik Parse Hatası:", e);
    // Manuel kurtarma denemesi (Çok ağır kesilmeler için)
    try {
        const fallback = jsonPart.substring(0, jsonPart.lastIndexOf('}')) + '}]}';
        return JSON.parse(fallback);
    } catch { return null; }
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Slide sayısını sınırla (92KB hatasını önlemek için)
    const safeSlideCount = Math.min(config.slideCount || 10, 15);

    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı.
      GÖREV: "${plan.title}" üzerine yüksek lisans seviyesinde, AKADEMİK ve ÖZ (Concise) bir sunum üret.
      KRİTİK: JSON boyutu sınırı nedeniyle metinleri çok uzun tutma. Nokta atışı teknik bilgi ver.
      SLAYT SAYISI: Kesinlikle ${safeSlideCount} adet.
      ŞEMA: Her slaytta tam olarak 1 adet multimodal element olmalı.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `EĞİTİM PLANI: ${plan.title} | KAPSAM: ${plan.description.substring(0, 500)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 8000 }, // Thinking bütçesini düşürerek output için alan açıyoruz
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
                  speakerNotes: { type: Type.STRING },
                  elements: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ["symbol", "interactive_case", "graph_logic"] },
                        content: { 
                          type: Type.OBJECT,
                          properties: {
                            icon: { type: Type.STRING },
                            label: { type: Type.STRING },
                            title: { type: Type.STRING },
                            dataPoints: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                            scenario: { type: Type.STRING },
                            resolution: { type: Type.STRING }
                          }
                        }
                      },
                      required: ["id", "type", "content"]
                    }
                  }
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
    if (!result || !result.slides || result.slides.length === 0) {
        throw new Error("AI_DATA_VOID: Onarım başarısız veya veri gelmedi.");
    }
    return result;
  },

  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${plan.title}. Kısa ve öz 8 slaytlık JSON üret.`,
      config: {
        systemInstruction: "Akademi Robotu. Sadece saf JSON döndür.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 },
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

    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  },

  async generateIDP(entity: any, history?: any[]): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `UZMAN: ${entity.name}`,
      config: {
        systemInstruction: "90 günlük gelişim planı üret. JSON döndür.",
        responseMimeType: "application/json"
      }
    });
    const result = extractPureJSON(response.text);
    return { id: `IDP-${Date.now()}`, ...result, status: 'active', createdAt: Date.now() };
  },

  async generateTrainingSlides(idp: IDP, branch: Branch): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP: ${idp.focusArea}`,
      config: {
        systemInstruction: "IDP'yi eğitim slaytlarına dönüştür. JSON döndür.",
        responseMimeType: "application/json"
      }
    });
    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  },

  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${config.topic}`,
      config: {
        systemInstruction: "Akademi Eğitmeni. Sunum üret. JSON döndür.",
        responseMimeType: "application/json"
      }
    });
    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  }
};
