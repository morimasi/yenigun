
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const armsService = {
  async generateIDP(staff: any): Promise<IDP> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PERSONEL DATA: ${JSON.stringify(staff)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Baş Mentor. Personelin klinik gelişim planını 'Think' katmanında analiz ederek en zayıf halkaya odaklanan bir roadmap oluştur. JSON formatında yanıt ver.",
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
            recommendedTrainings: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["focusArea", "identifiedGaps", "roadmap", "recommendedTrainings"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: Math.random().toString(36).substr(2, 9),
      staffId: staff.id,
      createdAt: Date.now(),
      ...data
    };
  },

  /**
   * @fix Added missing generateTrainingSlides method to resolve property access error in StaffProfileView.tsx.
   * This method generates specialized training slides based on a staff member's Individual Development Plan (IDP).
   */
  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `GELİŞİM PLANI: ${JSON.stringify(idp)} | BRANŞ: ${branch}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Akademik Tasarımcı. Personelin bireysel gelişim planı (IDP) temelinde, eksik olduğu klinik alanları kapatmaya yönelik eğitim slaytları tasarla. JSON Array formatında yanıt ver.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['title', 'content', 'case', 'interaction'] },
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

  async generateCustomPresentation(config: PresentationConfig, contextData?: any): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SUNUM KONFİGÜRASYONU: ${JSON.stringify(config)} | BAĞLAM: ${JSON.stringify(contextData)}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Akademik Tasarımcı. Klinik derinliği olan eğitim slaytları tasarla. Her slayt bir vaka veya interaktif tartışma içermeli. JSON Array formatında yanıt ver.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['title', 'content', 'case', 'interaction'] },
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
