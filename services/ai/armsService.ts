
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, Candidate, TrainingUnit, CustomTrainingPlan, TrainingGenerationConfig, TrainingQuiz } from "../../types";

// @fix: Removed global instance and moved to per-method initialization for latest API key injection adherence.
const extractPureJSON = (text: string): any => {
  if (!text) return null;
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
       const firstBracket = cleanText.indexOf('[');
       const lastBracket = cleanText.lastIndexOf(']');
       if (firstBracket !== -1 && lastBracket !== -1) {
         cleanText = cleanText.substring(firstBracket, lastBracket + 1);
       } else {
         return null;
       }
    } else {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }
    cleanText = cleanText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    return JSON.parse(cleanText);
  } catch (e) { 
    console.error("MIA Engine: JSON Parse Crash ->", e);
    return null; 
  }
};

// @fix: Defining reusable slide schema for consistent AI generation.
const SLIDE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    type: { type: Type.STRING, enum: ['title', 'content', 'interactive'] },
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    content: { type: Type.ARRAY, items: { type: Type.STRING } },
    speakerNotes: { type: Type.STRING },
    visualPrompt: { type: Type.STRING },
    interactiveElement: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        expectedAnswer: { type: Type.STRING },
        misconception: { type: Type.STRING }
      },
      required: ["question", "expectedAnswer", "misconception"]
    }
  },
  required: ["id", "type", "title", "content", "speakerNotes", "visualPrompt"]
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz: TrainingQuiz }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı ve Multimodal İçerik Üreticisi.
      GÖREV: "${plan.title}" konulu akademik düzeyi yüksek bir sunum ve sınav seti üret.
      
      STİL KURALLARI:
      1. Sadece saf JSON döndür.
      2. Slaytlar MULTIMODAL olmalı. 'elements' dizisini mutlaka doldur.
      3. Her slaytta farklı tipte multimodal elementler (image_prompt, symbol, interactive_case, graph_logic) kullan.
      4. 'image_prompt' alanına Gemini/DALL-E için yüksek detaylı, pedagojik ve sanatsal görsel tarifleri yaz.
      5. 'symbol' alanına o slaytın ana temasını anlatan emoji ve kısa etiket ekle.
      6. 'interactive_case' alanına sınıf içi bir kriz veya tartışma sorusu ekle.
      7. Dil: Akademik, keskin ve profesyonel Türkçe.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        slides: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['title', 'content', 'interactive'] },
              title: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              elements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['text', 'image_prompt', 'symbol', 'graph_logic', 'interactive_case'] },
                    content: { type: Type.OBJECT, description: "Element tipine göre veri (örn: prompt stringi veya {icon, label} objesi)" }
                  }
                }
              },
              speakerNotes: { type: Type.STRING },
              visualPrompt: { type: Type.STRING }
            },
            required: ["id", "type", "title", "elements", "speakerNotes"]
          }
        },
        quiz: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        isCorrect: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING }
                      },
                      required: ["label", "isCorrect", "feedback"]
                    }
                  }
                }
              }
            }
          }
        }
      },
      required: ["slides", "quiz"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PLAN: ${plan.description} | HEDEF: ${JSON.stringify(plan.curriculum.map(m => m.title))}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24000 },
        temperature: 0.4,
        responseSchema
      }
    });

    return extractPureJSON(response.text);
  },

  async generateIDP(entity: StaffMember | Candidate, assessmentHistory: any[] = []): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ENTITY: ${JSON.stringify(entity)} | HISTORY: ${JSON.stringify(assessmentHistory)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Gelişim Stratejisti. Personel için 90 günlük IDP oluştur. Sadece saf JSON.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 12000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            staffId: { type: Type.STRING },
            focusArea: { type: Type.STRING },
            roadmap: {
              type: Type.OBJECT,
              properties: { shortTerm: { type: Type.STRING }, midTerm: { type: Type.STRING }, longTerm: { type: Type.STRING } }
            },
            curriculum: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
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
          }
        }
      }
    });
    return extractPureJSON(response.text);
  },

  // @fix: Implemented missing method generateTrainingSlides for DecisionSupportView compatibility.
  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP: ${JSON.stringify(idp)} | BRANŞ: ${branch}`,
      config: {
        systemInstruction: "IDP (Kişisel Gelişim Planı) bazlı, personelin eksiklerini kapatmaya yönelik 8-10 slaytlık profesyonel bir eğitim sunumu üret. Saf JSON.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24000 },
        responseSchema: {
          type: Type.ARRAY,
          items: SLIDE_SCHEMA
        }
      }
    });
    return extractPureJSON(response.text) || [];
  },

  // @fix: Implemented missing method generateCustomPresentation for PresentationStudio compatibility.
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONFİGÜRASYON: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: `Konu: ${config.topic}. Hedef Kitle: ${config.targetAudience}. Ton: ${config.tone}. Slayt Sayısı: ${config.slideCount}. Bu parametrelere göre üst düzey akademik bir sunum üret. Saf JSON.`,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24000 },
        responseSchema: {
          type: Type.ARRAY,
          items: SLIDE_SCHEMA
        }
      }
    });
    return extractPureJSON(response.text) || [];
  },

  // @fix: Implemented missing method generateCurriculumTraining for CurriculumManager compatibility.
  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `EĞİTİM PLANI: ${JSON.stringify(plan)}`,
      config: {
        systemInstruction: "Katalogdaki sabit bir eğitim planını canlandıracak, klinik derinliği olan bir sunum seti üret. Saf JSON.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24000 },
        responseSchema: {
          type: Type.ARRAY,
          items: SLIDE_SCHEMA
        }
      }
    });
    return extractPureJSON(response.text) || [];
  }
};
