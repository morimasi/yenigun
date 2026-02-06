
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule, Candidate, TrainingUnit } from "../../types";
import { TrainingPlan } from "../../features/training/curriculumData";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const armsService = {
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
  },

  async generateUnitContent(unitTitle: string, focusArea: string): Promise<Partial<TrainingUnit>> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `UNIT_TITLE: ${unitTitle} | FOCUS: ${focusArea}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Klinik Müfredat Yazarı. Ünite için derin akademik içerik ve AI gerekçesi oluştur.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            aiRationale: { type: Type.STRING },
            durationMinutes: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Kıdemli Eğitim Tasarımcısı.
      GÖREV: Belirtilen konu ve hedef kitleye uygun, akademik derinliği olan bir eğitim sunumu tasarla.
      FORMAT: Sadece JSON listesi.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PRESENTATION_CONFIG: ${JSON.stringify(config)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
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
        }
      }
    });

    return JSON.parse(response.text || '[]');
  },

  async generateCurriculumTraining(plan: TrainingPlan): Promise<TrainingSlide[]> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı ve Kıdemli Eğitim Teknoloğu.
      GÖREV: Verilen müfredat planı başlığı ve açıklamasına dayanarak eğitim sunumu tasarla.
      FORMAT: Sadece JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `MÜFREDAT KONUSU: ${plan.title}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
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
    });

    return JSON.parse(response.text || '[]');
  },

  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı.
      GÖREV: Belirtilen Gelişim Planı (IDP) odak alanına göre branş bazlı eğitim slaytları oluştur.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP: ${JSON.stringify(idp)} | BRANCH: ${branch}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
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
    });

    return JSON.parse(response.text || '[]');
  }
};
