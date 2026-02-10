
import { GoogleGenAI, Type } from "@google/genai";
import { 
  IDP, TrainingSlide, CustomTrainingPlan, 
  TrainingGenerationConfig, TrainingQuiz, Branch, PresentationConfig
} from "../../types";

/**
 * MIA Nöral JSON Ayrıştırma Motoru v3.0 (JS-Safe Edition)
 */
const extractPureJSON = (text: string): any => {
  if (!text) return null;
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.indexOf('{');
    const firstBracket = cleanText.indexOf('[');
    let startIdx = -1;
    
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
    }

    if (startIdx === -1) return null;

    const lastBrace = cleanText.lastIndexOf('}');
    const lastBracket = cleanText.lastIndexOf(']');
    let endIdx = -1;

    if (lastBrace !== -1 && (lastBracket === -1 || lastBrace > lastBracket)) {
      endIdx = lastBrace;
    } else if (lastBracket !== -1) {
      endIdx = lastBracket;
    }

    if (endIdx === -1 || endIdx <= startIdx) return null;
    const jsonString = cleanText.substring(startIdx, endIdx + 1);
    const sanitizedJson = jsonString.replace(/[\x00-\x1F\x7F-\x9F]/g, "").replace(/,\s*([}\]])/g, '$1'); 

    return JSON.parse(sanitizedJson);
  } catch (e) { 
    console.error("MIA ARMS Nöral Parse Hatası:", e);
    return null; 
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı.
      GÖREV: "${plan.title}" konusu üzerine yüksek lisans seviyesinde AKADEMİK sunum üret.
      KRİTİK: Her slayt en az 5 teknik madde içermeli. 
      ELEMENTS: Sunumun zenginleşmesi için her slayda uygun 'symbol', 'graph_logic' veya 'interactive_case' tiplerinden birini ekle.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `EĞİTİM PLANI: ${JSON.stringify(plan)} | KONFİGÜRASYON: ${JSON.stringify(config)}`,
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
                          description: "Element içeriği. Tipine göre uygun alanları doldur.",
                          properties: {
                            icon: { type: Type.STRING, description: "Sembol için emoji." },
                            label: { type: Type.STRING, description: "Sembol etiketi." },
                            title: { type: Type.STRING, description: "Grafik başlığı." },
                            dataPoints: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Grafik için 5 adet sayısal veri noktası." },
                            scenario: { type: Type.STRING, description: "Vaka senaryosu metni." },
                            resolution: { type: Type.STRING, description: "Vaka çözüm önerisi." }
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
    if (!result || !result.slides) throw new Error("AI_DATA_VOID");
    return result;
  },

  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${plan.title}. Lütfen bu katalog konusu üzerine en az 8 slaytlık, her slaytı 5+ madde içeren, eğitmen notlu profesyonel bir sunum üret.`,
      config: {
        systemInstruction: "Akademi Robotu. Sadece saf JSON döndür. Slaytlar hiyerarşisi bozulmamalıdır.",
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

    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  },

  async generateIDP(entity: any, history?: any[]): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const context = history ? { entity, history } : entity;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `UZMAN VERİLERİ: ${JSON.stringify(context)}`,
      config: {
        systemInstruction: "90 günlük gelişim planı (IDP) üreticisi. JSON formatında 'focusArea', 'roadmap' ve 'curriculum' (modules) alanlarını doldur.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 15000 }
      }
    });
    const result = extractPureJSON(response.text);
    return { id: `IDP-${Date.now()}`, ...result, status: 'active', createdAt: Date.now() };
  },

  async generateTrainingSlides(idp: IDP, branch: Branch): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP Verisi: ${JSON.stringify(idp)}`,
      config: {
        systemInstruction: "Sunum Tasarımcısı. IDP'yi eğitim slaytlarına dönüştür. JSON döndür.",
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
        systemInstruction: "Akademi Eğitmeni. Profesyonel sunum üret. JSON döndür.",
        responseMimeType: "application/json"
      }
    });
    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  }
};
