
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, Candidate, TrainingUnit, CustomTrainingPlan, TrainingGenerationConfig, TrainingQuiz } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractPureJSON = (text: string): any => {
  if (!text) return null;
  try {
    // 1. Markdown bloklarını ve gereksiz boşlukları temizle
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 2. JSON başlangıç ve bitişini bul
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
       // Array kontrolü
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

    // 3. Kontrol karakterlerini (line breaks inside strings vb.) temizle
    // Bu adım AI'nın bazen string içine eklediği enter tuşu hatalarını onarır
    cleanText = cleanText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    return JSON.parse(cleanText);
  } catch (e) { 
    console.error("MIA Engine: JSON Parse Crash ->", e, "Raw Segment:", text.substring(0, 100) + "...");
    return null; 
  }
};

export const armsService = {
  // --- KRİTİK: NÖRAL MÜFREDAT FABRİKASI (v4.3 - Strict Format) ---
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz: TrainingQuiz }> {
    const systemInstruction = config.customSystemPrompt || `
      ROL: Yeni Gün Akademi Kıdemli Müfredat Mimarı.
      HEDEF: "${plan.title}" konulu profesyonel materyal üret.
      
      KRİTİK FORMAT KURALLARI:
      1. Sadece saf JSON döndür. 
      2. JSON alanlarının (title, content, speakerNotes, text vb.) içine asla "Şöyle düşündüm", "Lütfen şıkları düzenle" gibi meta-konuşmalar ekleme. 
      3. Her alan sadece hedef bilgiyi içermeli.
      4. Quiz soruları kısa, net ve akademik olmalı.
      5. Slayt içerikleri (content) liste şeklinde olmalı.
      6. Cevap şıklarında "A)", "B)" gibi harfler kullanma, sadece label içeriğini yaz.
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
              speakerNotes: { type: Type.STRING },
              visualPrompt: { type: Type.STRING }
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
                      },
                      required: ["label", "isCorrect", "feedback"]
                    }
                  }
                },
                required: ["id", "text", "options"]
              }
            }
          },
          required: ["questions"]
        }
      },
      required: ["slides", "quiz"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `MÜFREDAT TANIMI: ${plan.description} | MODÜLLER: ${JSON.stringify(plan.curriculum.map(m => m.title))}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: config.thinkingBudget > 0 ? config.thinkingBudget : 12000 },
        temperature: 0.4, // Daha tutarlı çıktı için düşürüldü
        responseSchema
      }
    });

    const parsed = extractPureJSON(response.text);
    if (!parsed || !parsed.slides || !parsed.quiz) {
       console.error("AI Output Format Mismatch:", response.text);
       throw new Error("AI_ENGINE_FORMAT_ERROR");
    }
    return parsed;
  },

  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP: ${JSON.stringify(idp)} | BRANCH: ${branch}`,
      config: {
        systemInstruction: "Yeni Gün Akademi. 5-7 slaytlık sunum üret. Sadece saf JSON döndür.",
        responseMimeType: "application/json",
        temperature: 0.4,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.ARRAY, items: { type: Type.STRING } },
                  speakerNotes: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    const parsed = extractPureJSON(response.text);
    return parsed?.slides || [];
  },

  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CONFIG: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Sunum Stüdyosu. Sadece saf JSON 'slides' döndür.",
        responseMimeType: "application/json",
        temperature: 0.5,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.ARRAY, items: { type: Type.STRING } },
                  speakerNotes: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    const parsed = extractPureJSON(response.text);
    return parsed?.slides || [];
  },

  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PLAN: ${JSON.stringify(plan)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Müfredat Fabrikası. Sadece saf JSON 'slides' döndür.",
        responseMimeType: "application/json",
        temperature: 0.4,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.ARRAY, items: { type: Type.STRING } },
                  speakerNotes: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    const parsed = extractPureJSON(response.text);
    return parsed?.slides || [];
  },

  async generateIDP(entity: StaffMember | Candidate, assessmentHistory: any[] = []): Promise<IDP> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ENTITY: ${JSON.stringify(entity)} | HISTORY: ${JSON.stringify(assessmentHistory)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Baş Gelişim Stratejisti. Personel için 90 günlük IDP oluştur. Sadece saf JSON.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 12000 },
        temperature: 0.4,
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
              }
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
          }
        }
      }
    });

    return extractPureJSON(response.text) || {};
  }
};
