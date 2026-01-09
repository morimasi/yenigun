
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v13.0 (OZEL)
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
    
    ANALİZ MATRİSİ (8 TEMEL BOYUT):
    1. Klinik Muhakeme: Vaka analiz etme ve doğru müdahale seçme yetisi.
    2. Etik Bütünlük: Mesleki sınırları koruma ve dürüstlük.
    3. Pedagojik Derinlik: Bilimsel metodoloji hakimiyeti (ABA, Gelişimsel Yaklaşımlar vb.).
    4. Duygusal Dayanıklılık: Zorlayıcı vakalar karşısında sükunet ve psikolojik sağlamlık.
    5. Kriz Yönetimi: Fiziksel saldırı veya ani olaylar karşısındaki refleksler.
    6. Veli İletişimi: Profesyonel sınırları koruyarak aileyle sağlıklı işbirliği kurma.
    7. Kurumsal Aidiyet: Kurum kültürü, hiyerarşi ve takım çalışmasına yatkınlık.
    8. Öğrenme Çevikliği: Özeleştiri yapabilme ve yeni tekniklere adaptasyon hızı.

    ÖNEMLİ: Adayın verdiği cevaplardaki "sosyal beğenirlik" (kendini olduğundan iyi gösterme) sapmalarını analiz et. 
    Yetkinlik skorlarını (0-100) bu 8 boyut için kesinlikle sağla.
    FORMAT: Kesinlikle geçerli JSON.
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
        thinkingConfig: { thinkingBudget: 20000 },
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
