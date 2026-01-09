
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Gelişmiş AI Analiz Motoru v8.0 (Self-Healing)
 * "ozel" mod: Çok katmanlı yetkilendirme ve hata teşhis katmanı.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // 1. Dinamik Anahtar Yakalama (Runtime Key Discovery)
  let apiKey = process.env.API_KEY;

  // Eğer process.env boşsa, AI Studio ortamındaki aktif anahtarı zorla çek
  if (!apiKey || apiKey === "undefined") {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.aistudio) {
       // Bu noktada API_KEY enjeksiyonu bekleniyor.
       apiKey = (window as any)._AI_STUDIO_KEY_ || localStorage.getItem('AISTUDIO_LAST_KEY');
    }
  }

  if (!apiKey) {
    throw new Error("AUTH_MISSING: Sistem geçerli bir API anahtarı bulamadı. Lütfen sağ üstteki 'Anahtar Seç' diyaloğunu kullanın.");
  }

  // 2. AI Instance Kurulumu
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

    if (!response.text) throw new Error("EMPTY_RESPONSE: Model boş yanıt döndürdü.");
    
    return JSON.parse(response.text) as AIReport;
  } catch (error: any) {
    console.error("Gemini Teknik Arıza:", error);
    
    // Vercel/Edge Hata Teşhis Mesajları
    if (error.message?.includes("Safety")) throw new Error("SAFETY_BLOCK: Adayın yanıtları güvenlik filtresine takıldı.");
    if (error.message?.includes("403") || error.message?.includes("key")) {
      throw new Error("KEY_EXPIRED: Mevcut API Anahtarı yetkisiz veya süresi dolmuş. Lütfen mülakatçı anahtarını yenileyin.");
    }
    throw error;
  }
};
