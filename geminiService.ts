
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v14.0 (OZEL - High Distractor Sensitivity)
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("AUTH_MISSING: Analiz motoru için geçerli bir anahtar bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Yüksek Kurul Üyesi ve Kıdemli Klinik Süpervizör.
    GÖREV: Adayın "Liyakat, Pedagojik Derinlik ve Etik Bütünlüğünü" analiz et.
    DİL: Türkçe.
    
    ÖZEL TALİMAT:
    Sorular "Yüksek Çeldiricili" (High Distractor) olarak kurgulanmıştır. Adayın cevaplarında şu 3 kritik unsuru ara:
    1. Sosyal Beğenirlik Sapması: Aday sadece "duymak istediğimiz" ideal cevapları mı veriyor (maske)? 
    2. Klinik Soğukkanlılık: Kriz ve kısıtlı kaynak anlarında rasyonel kalabiliyor mu?
    3. Etik Katılık vs. Esneklik: Kurum kuralları ile çocuk menfaati arasındaki ince çizgiyi nasıl yönetiyor?

    ANALİZ MATRİSİ (8 TEMEL BOYUT):
    - Klinik Muhakeme: Gri alanlardaki vaka yönetimi.
    - Etik Bütünlük: Hediye, kurum dışı ders ve veri dürüstlüğü.
    - Pedagojik Derinlik: Bilimsel güncelliği takip etme.
    - Duygusal Dayanıklılık: İkincil travma ve tahammül sınırları.
    - Kriz Yönetimi: Acil durum ve saldırganlık anlarındaki refleks.
    - Veli İletişimi: Sınır ihlallerine karşı profesyonel duruş.
    - Kurumsal Aidiyet: Hiyerarşi ve raporlama dürüstlüğü.
    - Öğrenme Çevikliği: Özeleştiri kapasitesi ve süpervizyon açıklığı.

    FORMAT: Kesinlikle geçerli JSON. Puanlamayı yaparken çeldirici cevaplara düşen adayların puanını kır.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          { text: `Aday Profili ve Cevapları: ${JSON.stringify({
              name: candidate.name,
              branch: candidate.branch,
              experience: candidate.experienceYears,
              trainings: candidate.allTrainings,
              answers: candidate.answers
            })}` }
        ] 
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Genel liyakat skoru" },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            detailedAnalysis: {
              type: Type.OBJECT,
              properties: {
                ethics: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                pedagogy: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                clinicalWisdom: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                emotionalResilience: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                institutionalFit: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                stressResponse: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } }
              }
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            competencies: {
              type: Type.ARRAY,
              description: "8 Boyutlu Yetkinlik Matrisi",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ["score", "summary", "recommendation", "detailedAnalysis", "swot", "competencies"]
        }
      }
    });

    if (!response.text) throw new Error("Motor yanıt veremedi.");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analiz Hatası:", error);
    throw error;
  }
};
