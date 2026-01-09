
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v12.0 (OZEL)
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("AUTH_MISSING: Analiz motoru için geçerli bir anahtar bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Yüksek Kurul Üyesi ve Klinik Süpervizör.
    GÖREV: Adayın "Liyakat, Pedagojik Derinlik ve Etik Bütünlüğünü" analiz et.
    DİL: Türkçe.
    
    ANALİZ MATRİSİ:
    1. Etik Değerler: Mesleki sınırlar ve veli/kurum çıkarları arasındaki denge.
    2. Pedagoji: Metodolojik hakimiyet (ABA, Floortime vb.) ve çocuk odaklılık.
    3. Klinik Bilgelik: Kriz anlarında ezberci değil, durumsal çözümler üretme kapasitesi.
    4. Duygusal Dayanıklılık: Tükenmişlik riski ve öfke kontrolü analizi.
    5. Kurumsal Uyum: Hiyerarşiye bakış açısı ve profesyonel disiplin.
    6. Stres Yanıtı: Fiziksel saldırı veya yoğun baskı altındaki refleksler.

    ÖNEMLİ: Adayın verdiği cevaplardaki "performans kaygısı" (kendini iyi gösterme çabası) ve "gerçek niyet" arasındaki boşluğu yakala.
    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          { text: `Aday Profili: ${JSON.stringify({
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
        thinkingConfig: { thinkingBudget: 15000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "0-100 arası liyakat puanı" },
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
