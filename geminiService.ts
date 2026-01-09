
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Gelişmiş AI Analiz Motoru v7.0 (Production Ready)
 * "ozel" mod: Hata yakalama ve anahtar doğrulama katmanları güçlendirildi.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // Global API Key kontrolü - process.env bazen build sırasında boş kalabilir
  const apiKey = (process.env.API_KEY as string) || (window as any)._AI_STUDIO_KEY_;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API_KEY_NOT_READY: API anahtarı sistem tarafından henüz tanımlanmadı. Lütfen sağ üstteki 'Anahtar Seç' butonunu kullanarak anahtarınızı doğrulayın.");
  }

  // Her çağrıda taze bir instance oluşturarak stale key riskini sıfırlıyoruz
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Sen Yeni Gün Akademi için çalışan kıdemli bir İK ve Psikometri uzmanısın.
    Adayın branş yetkinliğini (${candidate.branch}) ve etik duruşunu analiz et.
    Yanıtı SADECE geçerli bir JSON objesi olarak döndür. 
    Lütfen summary kısmını çok dürüst ve vurucu tut.
  `;

  const promptText = `
    ADAY VERİSİ:
    - İsim: ${candidate.name}
    - Branş: ${candidate.branch}
    - Deneyim: ${candidate.experienceYears} Yıl
    - CV Özet/Eğitim: ${candidate.allTrainings}
    - Senaryo Yanıtları: ${JSON.stringify(candidate.answers)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: promptText }] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 8000,
        thinkingConfig: { thinkingBudget: 2000 },
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

    const outputText = response.text;
    if (!outputText) throw new Error("Modelden geçerli bir veri alınamadı.");
    
    return JSON.parse(outputText) as AIReport;
  } catch (error: any) {
    console.error("Akademi Motoru Teknik Detay:", error);
    if (error.message?.includes("403") || error.message?.includes("key")) {
      throw new Error("YETKİLENDİRME_HATASI: Mevcut API anahtarınız bu modeli çalıştırmak için yeterli yetkiye sahip değil veya süresi dolmuş.");
    }
    throw error;
  }
};
