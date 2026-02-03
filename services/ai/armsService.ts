
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, AIReport, Candidate } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const armsService = {
  /**
   * Personelin klinik profili ve test sonuçları temelinde 90 günlük IDP üretir.
   * @fix: Made assessmentHistory optional and updated staff type to support Candidate evaluation during hiring.
   */
  async generateIDP(staff: StaffMember | Candidate, assessmentHistory: any[] = []): Promise<IDP> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `STAFF: ${JSON.stringify(staff)} | HISTORY: ${JSON.stringify(assessmentHistory)}`,
      config: {
        systemInstruction: `
          ROL: Yeni Gün Akademi Baş Klinik Mentor. 
          GÖREV: Personelin test geçmişindeki metodolojik sapmaları analiz et ve 90 günlük, somut, bilimsel (EBP) bir gelişim planı oluştur.
          ÇIKTI: Saf JSON formatında roadmap ve milestones içermeli.
        `,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 20000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
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
            recommendedTrainings: { type: Type.ARRAY, items: { type: Type.STRING } },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  dueDate: { type: Type.STRING }
                },
                required: ["title", "dueDate"]
              }
            }
          },
          required: ["focusArea", "identifiedGaps", "roadmap", "recommendedTrainings", "milestones"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: `IDP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      staffId: staff.id,
      createdAt: Date.now(),
      ...data,
      milestones: data.milestones.map((m: any) => ({ ...m, isCompleted: false }))
    };
  },

  /**
   * Personelin IDP'sine özel eğitim slaytları tasarlar.
   */
  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP: ${JSON.stringify(idp)} | BRANCH: ${branch}`,
      config: {
        systemInstruction: `
          ROL: Akademik Müfredat Tasarımcısı. 
          GÖREV: Personelin gelişim planındaki zayıf noktaları kapatacak, vaka temelli interaktif bir eğitim seti tasarla.
        `,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24000 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
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

  /**
   * @fix: Added missing 'generateCustomPresentation' method to armsService.
   */
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SUNUM KONFİGÜRASYONU: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: `
          ROL: Kıdemli Akademik Müfredat Tasarımcısı. 
          GÖREV: Verilen konfigürasyona uygun, akademik derinliği olan bir eğitim sunumu tasarla.
        `,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 20000 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
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
  }
};
