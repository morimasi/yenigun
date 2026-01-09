
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Stratejik AI Analiz Motoru v9.5
 * KRİTİK: API anahtarı sadece 'process.env.API_KEY' üzerinden okunur.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // Sistem talimatları gereği zorunlu anahtar erişimi
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("ANALİZ_KRİZİ: API_KEY ortam değişkeni boş. Lütfen platform ayarlarını kontrol edin.");
    throw new Error("AUTH_MISSING: API Anahtarı bulunamadı.");
  }

  // Yeni bir GoogleGenAI örneği (Her çağrıda güncel anahtarı kullanmak için)
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi - Kıdemli Akademik Kurul Üyesi.
    GÖREV: Adayın profesyonel yetkinliğini analiz et.
    DİL: Türkçe.
    FORMAT: Sadece teknik JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          { text: `Aday Analiz Talebi: ${JSON.stringify({
              name: candidate.name,
              branch: candidate.branch,
              answers: candidate.answers
            })}` }
        ] 
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"]
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
            },
            categoricalScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  average: { type: Type.NUMBER },
                  label: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["score", "swot", "competencies", "categoricalScores", "summary", "recommendation"]
        }
      }
    });

    if (!response.text) throw new Error("API_ERROR: Model yanıtı alınamadı.");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("AI Servis Hatası:", error);
    throw error;
  }
};
