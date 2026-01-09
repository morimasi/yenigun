
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Gelişmiş AI Analiz Motoru v8.1 (Production/Safe Mode)
 * "ozel" mod: Hata yakalama ve yetkilendirme katmanları stabilize edildi.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // 1. Dinamik Anahtar Yakalama (Priority: Process Env -> AI Studio Window -> LocalStorage)
  let apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined") {
    // @ts-ignore
    const aiStudioKey = typeof window !== 'undefined' ? (window as any)._AI_STUDIO_KEY_ : null;
    apiKey = aiStudioKey || localStorage.getItem('AISTUDIO_LAST_KEY');
  }

  // ÖNEMLİ: Eğer anahtar hala yoksa, sistemi çökertmek yerine kullanıcıyı bilgilendir
  if (!apiKey || apiKey === "selected") {
    throw new Error("AUTH_MISSING: Sistem geçerli bir API anahtarı bulamadı. Vercel üzerindeyseniz Settings -> Environment Variables kısmına API_KEY eklediğinizden emin olun.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Yeni Gün Akademi - Kıdemli Akademik Kurul Üyesi Rolündesin.
    ADAY ANALİZ PROTOKOLÜ:
    - Adayın beyan ettiği branş (${candidate.branch}) üzerindeki teknik hakimiyetini ölç.
    - Senaryo sorularına verdiği yanıtların psikometrik tutarlılığını denetle.
    - Dürüstlük ve kurumsal aidiyet skorlarını belirle.
    - ÇIKTI: Sadece JSON formatında, teknik ve vurucu bir analiz.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          { text: `Aday Verileri: ${JSON.stringify({
              name: candidate.name,
              exp: candidate.experienceYears,
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

    if (!response.text) throw new Error("EMPTY_RESPONSE: Model yanıt vermedi.");
    
    return JSON.parse(response.text) as AIReport;
  } catch (error: any) {
    console.error("Gemini Engine Error:", error);
    
    if (error.message?.includes("403") || error.message?.includes("API key not valid")) {
      throw new Error("YETKİSİZ_ANAHTAR: Girdiğiniz API anahtarı geçersiz veya kısıtlı. Lütfen Google AI Studio'dan 'Paid Service' aktif bir anahtar alın.");
    }
    throw error;
  }
};
