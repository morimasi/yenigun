
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, Candidate, TrainingUnit, CustomTrainingPlan, TrainingGenerationConfig, TrainingQuiz, Branch } from "../../types";

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
    return JSON.parse(cleanText);
  } catch (e) { 
    console.error("MIA Engine: JSON Parse Crash ->", e);
    return null; 
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz: TrainingQuiz }> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Nöral Tasarımcı ve Pedagoji Uzmanı.
      GÖREV: "${plan.title}" için MULTIMODAL bir eğitim sunumu oluştur.
      
      MULTIMODAL KURALLAR:
      1. Slaytlar sadece metin içermemeli. 'elements' dizisi içinde 'symbol' (SVG/Emoji önerisi), 'graph_logic' (X ve Y eksenli veri trendi), 'image_prompt' (DALL-E promptu) ve 'interactive_case' içermeli.
      2. 'visualPrompt' alanı her slayt için Midjourney seviyesinde detaylı bir görsel betimleme içermeli.
      3. Ton: ${config.tone}. Pedagojik Bias: ${config.pedagogicalBias}.
      4. ÇIKTI: Sadece saf JSON.
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
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              visualPrompt: { type: Type.STRING },
              speakerNotes: { type: Type.STRING },
              elements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, enum: ['text', 'image_prompt', 'symbol', 'graph_logic', 'interactive_case'] },
                    content: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, text: { type: Type.STRING }, icon: { type: Type.STRING }, dataPoints: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }
                  }
                }
              }
            },
            required: ["id", "type", "title", "elements", "visualPrompt"]
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
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `MÜFREDAT DETAYI: ${plan.description} | MODÜLLER: ${JSON.stringify(plan.curriculum.map(m => m.title))}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema
      }
    });

    return extractPureJSON(response.text);
  },

  // @fix: Implemented generateTrainingSlides for Decision Support Module.
  async generateTrainingSlides(idp: IDP, branch: Branch): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP ODAK ALANI: ${idp.focusArea} | BRANŞ: ${branch}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Eğitim Tasarımcısı. IDP hedeflerine yönelik 5 slaytlık bir eğitim sunumu üret. Saf JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              visualPrompt: { type: Type.STRING },
              speakerNotes: { type: Type.STRING }
            },
            required: ["id", "type", "title", "content", "visualPrompt"]
          }
        }
      }
    });
    return extractPureJSON(response.text);
  },

  // @fix: Implemented generateCustomPresentation for Presentation Studio.
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${config.topic} | HEDEF KİTLE: ${config.targetAudience} | DERİNLİK: ${config.depth}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Sunum Stüdyosu. Akademik bir sunum hazırla. Saf JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              visualPrompt: { type: Type.STRING },
              speakerNotes: { type: Type.STRING }
            },
            required: ["id", "type", "title", "content", "visualPrompt"]
          }
        }
      }
    });
    return extractPureJSON(response.text);
  },

  // @fix: Implemented generateCurriculumTraining for Curriculum Manager.
  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `MÜFREDAT: ${plan.title} | AÇIKLAMA: ${plan.description}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Eğitim Fabrikası. Müfredat içeriğine uygun pedagojik sunum üret. Saf JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              visualPrompt: { type: Type.STRING },
              speakerNotes: { type: Type.STRING }
            },
            required: ["id", "type", "title", "content", "visualPrompt"]
          }
        }
      }
    });
    return extractPureJSON(response.text);
  },

  async generateIDP(entity: StaffMember | Candidate, assessmentHistory: any[] = []): Promise<IDP> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PERSONEL: ${JSON.stringify(entity)} | TEST GEÇMİŞİ: ${JSON.stringify(assessmentHistory)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Gelişim Stratejisti. Personelin zayıf olduğu alanları onaracak 90 günlük IDP ve müfredat üret. Sadece saf JSON.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 15000 }
      }
    });
    return extractPureJSON(response.text);
  }
};
