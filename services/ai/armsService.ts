
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, Candidate, TrainingUnit, CustomTrainingPlan, TrainingGenerationConfig, TrainingQuiz } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractPureJSON = (text: string): any => {
  if (!text) return null;
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
       const firstBracket = cleanText.indexOf('[');
       const lastBracket = cleanText.lastIndexOf(']');
       if (firstBracket !== -1 && lastBracket !== -1) cleanText = cleanText.substring(firstBracket, lastBracket + 1);
       else return null;
    } else {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }
    cleanText = cleanText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    return JSON.parse(cleanText);
  } catch (e) { 
    console.error("MIA Engine: JSON Parse Crash ->", e, "Raw Segment:", text.substring(0, 100) + "...");
    return null; 
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz: TrainingQuiz }> {
    const systemInstruction = config.customSystemPrompt || `
      ROL: Yeni Gün Akademi Nöral Tasarımcı ve Pedagoji Uzmanı.
      GÖREV: "${plan.title}" için multimodal bir eğitim sunumu oluştur.
      
      KRİTİK GÖRSEL KURALLAR:
      1. Her slayt için 'visualPrompt' oluştur. Bu prompt, bir yapay zeka resim üreticisinin (Midjourney/DALL-E) kullanabileceği kadar detaylı ve eğitimin konusunu soyut/somut anlatan bir betimleme olmalı.
      2. 'elements' dizisi içinde slayt içeriğini yapılandır. Sadece düz metin değil, 'symbol' (ikon önerisi), 'image_prompt' (görsel yer tutucu) ve 'interactive_case' (vaka sorusu) kullan.
      3. Dil: Akademik Türkçe.
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
              type: { type: Type.STRING, enum: ['title', 'content', 'interactive', 'visual_split'] },
              title: { type: Type.STRING },
              visualPrompt: { type: Type.STRING, description: "Bu slayt için AI görsel üretim promptu. Örn: 'A serene therapy room with soft lighting, minimalist style, 4k render'" },
              speakerNotes: { type: Type.STRING },
              elements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['text', 'image_prompt', 'symbol', 'interactive_case'] },
                    content: { 
                        type: Type.OBJECT,
                        properties: {
                            label: { type: Type.STRING },
                            icon: { type: Type.STRING },
                            question: { type: Type.STRING },
                            text: { type: Type.STRING } // For text type
                        }
                    }
                  }
                }
              }
            },
            required: ["id", "type", "title", "visualPrompt", "speakerNotes", "elements"]
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
      contents: `MÜFREDAT: ${plan.description} | MODÜLLER: ${JSON.stringify(plan.curriculum.map(m => m.title))} | DOKU: ${config.tone}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: config.thinkingBudget > 0 ? config.thinkingBudget : 12000 },
        temperature: 0.5,
        responseSchema
      }
    });

    const parsed = extractPureJSON(response.text);
    
    // Fallback normalization for older schema compatibility or strict type mapping
    if (parsed && parsed.slides) {
        parsed.slides = parsed.slides.map((s: any) => ({
            ...s,
            // Map simple content array to elements if needed, or normalize elements
            content: s.elements ? s.elements.map((e: any) => e.content?.text || e.content?.label || JSON.stringify(e.content)) : []
        }));
    }

    if (!parsed || !parsed.slides || !parsed.quiz) {
       console.error("AI Output Format Mismatch:", response.text);
       throw new Error("AI_ENGINE_FORMAT_ERROR");
    }
    return parsed;
  },

  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    // Simplified for quick generation, keeping consistent with new Multimodal structure
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CONFIG: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Sunum Stüdyosu. Multimodal yapı (elements array) kullan. Sadece saf JSON 'slides' döndür.",
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
                  visualPrompt: { type: Type.STRING },
                  speakerNotes: { type: Type.STRING },
                  elements: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, enum: ['text', 'image_prompt', 'symbol'] },
                        content: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, label: { type: Type.STRING }, icon: { type: Type.STRING } } }
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
    const parsed = extractPureJSON(response.text);
    
    // Normalize content field for legacy components
    if(parsed?.slides) {
        parsed.slides.forEach((s:any) => {
            s.content = s.elements?.map((e:any) => e.content.text || e.content.label) || [];
        });
    }
    
    return parsed?.slides || [];
  },

  // Legacy support for simple string arrays
  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    return this.generateCustomPresentation({ topic: idp.focusArea, targetAudience: 'individual', tone: 'academic', depth: 'intermediate', slideCount: 5 });
  },
  
  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
      return this.generateCustomPresentation({ topic: plan.title, targetAudience: 'team', tone: 'academic', depth: 'advanced', slideCount: 8 });
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
