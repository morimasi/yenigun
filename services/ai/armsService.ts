
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const armsService = {
  async generateIDP(staff: StaffMember): Promise<IDP> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Kıdemli Akademik Mentor ve Stratejist.
      GÖREV: Personelin değerlendirme geçmişine dayanarak 1 yıllık IDP (Bireysel Gelişim Planı) oluştur.
      
      ANALİZ KRİTERLERİ:
      1. Klinik Eksiklikler: Teknik becerilerdeki zayıf noktalar.
      2. Sosyal Rezonans: Veli ve iş arkadaşları ile olan iletişim boşlukları.
      3. Kurumsal Adaptasyon: Kurum kültürüne uyum seviyesi.
      
      DİL: Teşvik edici ama klinik olarak net.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `PERSONEL VERİLERİ: ${JSON.stringify(staff)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
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

    const data = JSON.parse(response.text);
    return {
      id: Math.random().toString(36).substr(2, 9),
      staffId: staff.id,
      createdAt: Date.now(),
      ...data
    };
  },

  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `GELİŞİM PLANI: ${JSON.stringify(idp)}, BRANŞ: ${branch}. 
                 Bu personel için 5 slaytlık, interaktif bir hizmet-içi eğitim sunusu hazırla.`,
      config: {
        systemInstruction: "Eğitim sunusu JSON formatında olmalı. Her slayt başlık, içerik, anahtar noktalar, vaka ve tartışma sorusu içermeli.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              clinicalCase: { type: Type.STRING },
              discussionQuestion: { type: Type.STRING }
            },
            required: ["title", "content", "keyPoints", "discussionQuestion"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  }
};
