
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Stratejik AI Analiz Motoru v8.6 (Environment First)
 * "ozel" mod: Vercel ortam değişkenleri ve DB senkronizasyonu öncelikli.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // 1. Dinamik Anahtar Keşfi
  // Vercel Panelindeki API_KEY en yüksek önceliğe sahiptir.
  let apiKey = process.env.API_KEY;
  let source = "ENVIRONMENT";

  if (!apiKey || apiKey === "undefined") {
    // @ts-ignore - LocalStorage Fallback (Mülakatçı anahtarı)
    apiKey = localStorage.getItem('AISTUDIO_LAST_KEY');
    source = "LOCAL_STORAGE";
  }

  if (!apiKey || apiKey === "selected") {
    // @ts-ignore - Window Injection (AI Studio Sandbox)
    apiKey = typeof window !== 'undefined' ? (window as any)._AI_STUDIO_KEY_ : null;
    source = "WINDOW_INJECT";
  }

  // ÖNEMLİ: Anahtar yoksa mülakat sürecini durdur ve açık hata ver
  if (!apiKey) {
    throw new Error(`ANALİZ_DURDU: Gemini API Anahtarı bulunamadı. Lütfen Vercel panelinde 'API_KEY' değişkenini tanımlayın veya AI Studio üzerinden anahtar seçin.`);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi - Kıdemli Akademik Kurul Üyesi.
    GÖREV: Adayın branşı (${candidate.branch}) ve beyanları üzerinden %100 tarafsız analiz yap.
    ANALİZ PROTOKOLÜ:
    - Yanıtlardaki etik açıkları ve profesyonel riskleri tespit et.
    - SWOT analizi oluştur.
    - Mülakatçı için 2 adet 'stres test' sorusu hazırla.
    ÇIKTI: Sadece teknik JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          { text: `Aday Veri Paketi [Analiz Başlat]: ${JSON.stringify({
              name: candidate.name,
              branch: candidate.branch,
              exp: candidate.experienceYears,
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

    if (!response.text) throw new Error("API_NO_TEXT: Yanıt metni alınamadı.");
    
    return JSON.parse(response.text) as AIReport;
  } catch (error: any) {
    console.error(`Gemini Engine Failure [Source: ${source}]:`, error);
    
    if (error.message?.includes("403")) {
      throw new Error(`YETKİ_RETTİ: '${source}' anahtarı bu işlem için yetkisiz. Lütfen faturalandırması aktif bir anahtar kullanın.`);
    }
    throw error;
  }
};
