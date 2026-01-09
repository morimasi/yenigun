
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Stratejik AI Analiz Motoru v9.0
 * SDK Kuralları Gereği: API Key 'process.env.API_KEY' üzerinden alınmalıdır.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // Sistem talimatlarına göre doğrudan erişim
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("ANALİZ DURDURULDU: Environment üzerinde API_KEY eksik.");
    throw new Error("AUTH_MISSING: API Anahtarı sistemde tanımlı değil.");
  }

  // SDK Başlatma (Named Parameter kullanımı zorunludur)
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi - Kıdemli Akademik Kurul Üyesi.
    ANALİZ KRİTERLERİ:
    - Adayın uzmanlık alanı: ${candidate.branch}
    - Deneyim: ${candidate.experienceYears} yıl.
    - Görev: Yanıtlardaki etik ve profesyonel tutarlılığı ölç, SWOT çıkar ve bir tavsiye yaz.
    ÇIKTI: Sadece teknik JSON formatında olmalıdır.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          { text: `Aday Verileri: ${JSON.stringify({
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

    if (!response.text) throw new Error("API_ERROR: Model boş yanıt döndü.");
    
    return JSON.parse(response.text) as AIReport;
  } catch (error: any) {
    // SDK'dan gelen asıl hatayı fırlatıyoruz (maskeleme yapmadan)
    console.error("Gemini Engine Error Details:", error);
    throw error;
  }
};
