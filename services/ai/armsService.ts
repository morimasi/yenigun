
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const armsService = {
  async generateIDP(staff: any): Promise<IDP> {
    // Personelin test geçmişini ve ai_tag'lerini konsolide et
    const assessmentSummary = staff.assessments?.map((a: any) => ({
      battery: a.battery_id,
      score: a.score,
      tags: a.ai_tags,
      timestamp: a.timestamp
    })) || [];

    const systemInstruction = `
      ROL: Yeni Gün Akademi Kıdemli Akademik Mentor ve Nöral Gelişim Stratejisti.
      GÖREV: Personelin değerlendirme verilerini analiz et ve 12 aylık Bireysel Gelişim Planı (IDP) oluştur.
      
      ANALİZ PROTOKOLÜ:
      1. Veri Madenciliği: Personelin düşük skor aldığı (özellikle %50 altı) testlerdeki "ai_tags"leri odak noktası yap.
      2. Klinik Tahkim: Eğer personel sürekli "boundary_failure" veya "low_stress_tolerance" etiketleri alıyorsa, etik ve kriz yönetimi odaklı bir roadmap kur.
      3. Uzmanlık Yörüngesi: Branşına (${staff.branch}) özel en güncel metodolojileri (örn: DIR-202, ABA-Advanced Data) roadmap'e ekle.
      
      TON: Otoriter, akademik, teşvik edici ve derinlemesine klinik.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `PERSONEL PROFİLİ: ${JSON.stringify(staff.profile)}
                 TEST GEÇMİŞİ VE ETİKETLER: ${JSON.stringify(assessmentSummary)}
                 GÖREV: Bu verileri çapraz sorgulayarak "Nöral Gelişim Planı"nı JSON olarak üret.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusArea: { type: Type.STRING, description: "Personelin en kritik zayıf halkası üzerine kurulu ana odak alanı." },
            identifiedGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Saptanan somut klinik boşluklar." },
            roadmap: {
              type: Type.OBJECT,
              properties: {
                shortTerm: { type: Type.STRING, description: "İlk 3 ayda yapılması gereken acil müdahaleler." },
                midTerm: { type: Type.STRING, description: "3-6 ay arası uzmanlık derinleşmesi." },
                longTerm: { type: Type.STRING, description: "12 ay sonundaki akademik hedef." }
              },
              required: ["shortTerm", "midTerm", "longTerm"]
            },
            recommendedTrainings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Okunması gereken literatür veya alınması gereken akreditasyonlar." }
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

  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `GELİŞİM PLANI ANALİZİ: ${JSON.stringify(idp)}, BRANŞ: ${branch}. 
                 Bu personel için personelin özellikle "Identified Gaps" kısmındaki eksikliklerini kapatacak 5 slaytlık, profesyonel, interaktif ve klinik derinliği olan bir hizmet-içi sunum seti hazırla.`,
      config: {
        systemInstruction: `
           ROL: Yeni Gün Akademi Akademik Müfredat Direktörü.
           AMAÇ: Personeli teorik bilgiden ziyade "Klinik Muhakeme" yapmaya zorlayacak vaka odaklı slaytlar üretmek.
           DİL: Tamamen Türkçe.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Slayt başlığı (Çarpıcı ve akademik)." },
              content: { type: Type.STRING, description: "Slaytın ana felsefesi ve teknik içeriği." },
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uygulamada dikkat edilecek 3 kritik nokta." },
              clinicalCase: { type: Type.STRING, description: "Bu konuyla ilgili gerçekçi bir klinik senaryo/vaka." },
              discussionQuestion: { type: Type.STRING, description: "Personelin cevaplaması gereken derin mülakat sorusu." }
            },
            required: ["title", "content", "keyPoints", "discussionQuestion"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  }
};
