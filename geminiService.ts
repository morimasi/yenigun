
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // Always use process.env.API_KEY directly in the constructor as per guidelines.
  if (!process.env.API_KEY) {
    throw new Error("MISSING_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için Üst Düzey Psikometrik Analiz ve İK Strateji Uzmanısın.
    
    ÖZEL GÖREVİN:
    Adayın cevaplarındaki "Sosyal Beğenirlik Sapmasını" tespit et. 
    Aday kendini kusursuz gösteriyorsa bunu RED FLAG olarak işaretle.
    
    ANALİZ KRİTERLERİ:
    1. Otantisite: Cevaplar insani zaafları kabul ediyor mu?
    2. Stres Altında Karar: Çocuk-Kurum-Çıkar dengesi.
    3. Red Flag Tespiti: Agresyon, tükenmişlik veya dürüstlük maskesi.
    4. Gelişim Alanı: Özeleştiri kapasitesi.
  `;

  const textPrompt = `
    ADAY: ${candidate.name}
    BRANŞ: ${candidate.branch}
    DENEYİM: ${candidate.experienceYears} yıl
    EĞİTİMLER: ${candidate.allTrainings}
    CEVAPLAR: ${JSON.stringify(candidate.answers)}
  `;

  const contents: any[] = [{ text: textPrompt }];

  if (candidate.cvData) {
    contents.push({
      inlineData: {
        data: candidate.cvData.base64,
        mimeType: candidate.cvData.mimeType
      }
    });
  }

  try {
    // Upgraded to gemini-3-pro-preview for complex psychometric analysis tasks.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
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

    // Directly accessing .text property as per guidelines.
    return JSON.parse(response.text || '{}') as AIReport;
  } catch (error: any) {
    if (error.message?.includes("entity was not found") || error.message?.includes("API key")) {
      throw new Error("INVALID_API_KEY");
    }
    throw error;
  }
};
