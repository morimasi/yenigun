
import { GoogleGenAI, Type } from "@google/genai";
import { 
  IDP, TrainingSlide, CustomTrainingPlan, 
  TrainingGenerationConfig, TrainingQuiz, Branch, PresentationConfig
} from "../../types";

const extractPureJSON = (text: string): any => {
  if (!text) return null;
  try {
    // Markdown bloklarını temizle
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // JSON başlangıç ve bitişini bul (Hata toleransı için)
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) return null;
    
    const jsonString = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonString);
  } catch (e) { 
    console.error("MIA ARMS JSON Engine Error:", e);
    return null; 
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı.
      GÖREV: "${plan.title}" konusu üzerine yüksek lisans seviyesinde AKADEMİK sunum üret.
      
      KRİTİK TALİMATLAR:
      1. Her slayt (content) en az 5 madde içermeli. Her madde "Açıklayıcı, Teknik ve Klinik" olmalı. Sığ başlıklardan kaçın.
      2. Speaker Notes: Eğitmen için en az 150 kelimelik profesyonel anlatım rehberi.
      3. Elements: Slayta mutlaka bir 'symbol' veya 'interactive_case' ekle.
      4. HIZ: JSON yapısını bozmadan hızlıca yanıtla.
    `;

    // Multimodal elementler için basitleştirilmiş nesne yapısı
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `EĞİTİM PLANI: ${JSON.stringify(plan)} | KONFİGÜRASYON: ${JSON.stringify(config)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 12000 }, // Hız için düşünme bütçesi optimize edildi
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
                            scenario: { type: Type.STRING },
                            resolution: { type: Type.STRING }
                          }
                        }
                      }
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
      contents: `Katalog Konusu: ${plan.title}. Lütfen bu konuda en az 8 slaytlık, her slaytı akademik derinliğe sahip bir eğitim üret.`,
      config: {
        systemInstruction: "Akademi Robotu. Sadece saf JSON döndür. Slaytlar: title, content (array), speakerNotes alanlarını içermelidir.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 8000 }
      }
    });
    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  },

  // @fix: Updated signature to accept optional history argument to resolve the argument mismatch error in DevelopmentRouteView.tsx (line 34).
  async generateIDP(entity: any, history?: any[]): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // @fix: Wrap entity and history in a context object if history is provided
    const context = history ? { entity, history } : entity;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `UZMAN: ${JSON.stringify(context)}`,
      config: {
        systemInstruction: "90 günlük gelişim planı (IDP) üreticisi. JSON formatında 'focusArea', 'roadmap' (shortTerm, midTerm, longTerm) ve 'curriculum' (modules) alanlarını doldur.",
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
