
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
  /**
   * Kullanıcının girdiği basit direktifleri akademik bir dev prompta dönüştürür.
   */
  async enhancePresentationPrompt(topic: string, currentDirectives: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${topic} | KULLANICI DİREKTİFİ: ${currentDirectives}. Bu direktifleri yüksek lisans seviyesinde, akademik terminoloji ve klinik vaka derinliği içerecek şekilde genişlet. Sadece genişletilmiş metni döndür.`,
      config: { systemInstruction: "Akademik Prompt Mühendisi." }
    });
    return response.text || currentDirectives;
  },

  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const safeSlideCount = Math.min(config.slideCount || 10, 20);

    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı.
      GÖREV: "${plan.title}" üzerine yüksek lisans seviyesinde AKADEMİK sunum üret.
      EKOL: ${config.pedagogicalBias}
      ZORLUK: ${config.cognitiveLoad}
      ÜSLUP: ${config.tone}
      EK DİREKTİFLER: ${config.customDirectives || 'Yok.'}
      KRİTİK: Her slaytta tam olarak 1 adet multimodal element (symbol, interactive_case veya graph_logic) olmalı.
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
    if (!result || !result.slides) throw new Error("AI_DATA_VOID");
    return result;
  },

  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
      // Geriye dönük uyumluluk için basitleştirilmiş üretim
      return this.generateUniversalCurriculum(plan, {
          slideCount: 8, theme: 'ACADEMIC_COLD', tone: 'academic'
      } as any).then(res => res.slides);
  },

  // @fix: Added generateTrainingSlides to fix property missing error in components/admin/DecisionSupportView.tsx.
  async generateTrainingSlides(idp: any, branch?: string): Promise<TrainingSlide[]> {
      return this.generateCurriculumTraining(idp);
  },

  // @fix: Added generateCustomPresentation to fix property missing error in features/staff-mentor/PresentationStudio.tsx.
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `ROL: Akademi Eğitmen Asistanı. KONU: ${config.topic}. ÜSLUP: ${config.tone}. DERİNLİK: ${config.depth}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gündem: ${config.topic} için ${config.slideCount} slaytlık akademik sunum planı üret.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
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
    return result?.slides || [];
  },

  // @fix: Updated generateIDP signature to accept two arguments (entity and history) to fix argument count error in features/staff-mentor/DevelopmentRouteView.tsx.
  async generateIDP(entity: any, history?: any[]): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `UZMAN: ${entity.name}. ANALİZ GEÇMİŞİ: ${JSON.stringify(history || [])}`,
      config: {
        systemInstruction: "90 günlük gelişim planı üret. JSON formatında 'focusArea', 'roadmap' ve 'curriculum' alanlarını doldur.",
        responseMimeType: "application/json"
      }
    });
    const result = extractPureJSON(response.text);
    return { id: `IDP-${Date.now()}`, ...result, status: 'active', createdAt: Date.now() };
  }
};
