
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, Candidate, TrainingUnit, CustomTrainingPlan, TrainingGenerationConfig, TrainingQuiz } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractPureJSON = (text: string): any => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace === -1) return JSON.parse(cleanText);
    let jsonStr = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonStr);
  } catch (e) { return null; }
};

export const armsService = {
  // --- KRİTİK: NÖRAL MÜFREDAT FABRİKASI ---
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz: TrainingQuiz }> {
    const systemInstruction = config.customSystemPrompt || `
      ROL: Yeni Gün Akademi Kıdemli Eğitim Teknoloğu ve Müfredat Mimarı.
      HEDEF: "${plan.title}" konulu, ultra-profesyonel bir hizmet içi eğitim materyali tasarla.
      PEDAGOJİK ODAK: ${config.pedagogicalBias} ekolü prensipleri %100 baskın olmalı.
      BİLİŞSEL YÜK: ${config.cognitiveLoad} seviyesinde bir uzman kitlesi hedefleniyor.
      ÜSLUP: ${config.tone} ve akademik.
      
      FORMAT KURALLARI:
      1. Slaytlar sadece metin değil, "Speaker Notes" (Eğitmen için derin klinik bilgiler) içermeli.
      2. Her slayt için "Visual Prompt" (AI görsel üretim komutu) üret.
      3. Sonunda en az 5 soruluk, bu eğitimi ölçen bir "Liyakat Sınavı" oluştur.
      FORMAT: Kesinlikle JSON.
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
                }
              }
            },
            required: ["id", "type", "title", "content", "speakerNotes", "visualPrompt"]
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
                      }
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
      model: 'gemini-3-pro-preview', // Muhakeme için Pro model
      contents: `MÜFREDAT TANIMI: ${plan.description} | HEDEF BRANŞLAR: ${JSON.stringify(plan.targetBranches)} | MODÜLLER: ${JSON.stringify(plan.curriculum.map(m => m.title))}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: config.thinkingBudget },
        temperature: config.temperature,
        responseSchema
      }
    });

    const parsed = extractPureJSON(response.text);
    if (!parsed) throw new Error("AI_ENGINE_FORMAT_ERROR");
    return parsed;
  },

  // @fix: Implemented generateTrainingSlides to resolve error in DecisionSupportView.tsx
  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP: ${JSON.stringify(idp)} | BRANCH: ${branch}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Eğitim Geliştirme. Verilen IDP'ye göre personelin gelişimi için 5-7 slaytlık profesyonel bir eğitim sunumu hazırla. JSON formatında 'slides' dizisi döndür.",
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
                  type: { type: Type.STRING, enum: ['title', 'content', 'interactive'] },
                  title: { type: Type.STRING },
                  content: { type: Type.ARRAY, items: { type: Type.STRING } },
                  speakerNotes: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING }
                },
                required: ["id", "type", "title", "content", "speakerNotes", "visualPrompt"]
              }
            }
          },
          required: ["slides"]
        }
      }
    });
    const parsed = extractPureJSON(response.text);
    return parsed?.slides || [];
  },

  // @fix: Implemented generateCustomPresentation to resolve error in PresentationStudio.tsx
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CONFIG: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Sunum Stüdyosu. Verilen konfigürasyona uygun profesyonel bir sunum taslağı hazırla. JSON formatında 'slides' dizisi döndür.",
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
                  type: { type: Type.STRING, enum: ['title', 'content', 'interactive'] },
                  title: { type: Type.STRING },
                  content: { type: Type.ARRAY, items: { type: Type.STRING } },
                  speakerNotes: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING }
                },
                required: ["id", "type", "title", "content", "speakerNotes", "visualPrompt"]
              }
            }
          },
          required: ["slides"]
        }
      }
    });
    const parsed = extractPureJSON(response.text);
    return parsed?.slides || [];
  },

  // @fix: Implemented generateCurriculumTraining to resolve error in CurriculumManager.tsx
  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PLAN: ${JSON.stringify(plan)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Müfredat Fabrikası. Verilen eğitim planına uygun olarak personelin klinik derinliğini artıracak detaylı bir sunum hazırla. JSON formatında 'slides' dizisi döndür.",
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
                  type: { type: Type.STRING, enum: ['title', 'content', 'interactive'] },
                  title: { type: Type.STRING },
                  content: { type: Type.ARRAY, items: { type: Type.STRING } },
                  speakerNotes: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING }
                },
                required: ["id", "type", "title", "content", "speakerNotes", "visualPrompt"]
              }
            }
          },
          required: ["slides"]
        }
      }
    });
    const parsed = extractPureJSON(response.text);
    return parsed?.slides || [];
  },

  async generateIDP(entity: StaffMember | Candidate, assessmentHistory: any[] = []): Promise<IDP> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Gelişim Stratejisti.
      GÖREV: Personelin mevcut yetkinlik setini ve hata geçmişini analiz ederek 90 günlük bir Bireysel Gelişim Planı (IDP) ve Müfredat oluştur.
      MODEL: Gemini 3 Flash Thinking.
      FORMAT: Sadece JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ENTITY: ${JSON.stringify(entity)} | HISTORY: ${JSON.stringify(assessmentHistory)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            staffId: { type: Type.STRING },
            focusArea: { type: Type.STRING },
            identifiedGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            roadmap: {
              type: Type.OBJECT,
              properties: {
                shortTerm: { type: Type.STRING },
                midTerm: { type: Type.STRING },
                longTerm: { type: Type.STRING }
              },
              required: ["shortTerm", "midTerm", "longTerm"]
            },
            curriculum: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  focusArea: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  status: { type: Type.STRING },
                  units: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        type: { type: Type.STRING },
                        content: { type: Type.STRING },
                        durationMinutes: { type: Type.NUMBER },
                        isCompleted: { type: Type.BOOLEAN },
                        aiRationale: { type: Type.STRING },
                        status: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          },
          required: ["id", "focusArea", "roadmap", "curriculum"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }
};
