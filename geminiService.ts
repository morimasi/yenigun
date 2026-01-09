
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Gelişmiş AI Analiz Motoru v6.0 (Academic Flash Stabilized)
 * "ozel" mod: Gemini 3 Flash Preview ile multimodal analiz.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // Not: process.env.API_KEY kontrolü runtime'da bazen yanıltıcı olduğu için 
  // doğrudan SDK constructor'ına paslıyoruz.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için tasarlanmış, Gemini 3.0 Flash mimarisiyle çalışan Üst Düzey Akademik Değerlendirme Uzmanısın.
    
    ANALİZ PROTOKOLÜ:
    1. Adayın beyanlarını (${candidate.branch}) ve psikometrik yanıtlarını analiz et.
    2. "Thinking Budget" kullanarak adayın dürüstlük ve kriz yönetimi kapasitesini ölç.
    3. Yanıtı SADECE saf JSON formatında döndür.
  `;

  const promptText = `
    ADAY VERİ SETİ:
    - İsim: ${candidate.name}
    - Branş: ${candidate.branch}
    - Deneyim: ${candidate.experienceYears} Yıl
    - Yanıtlar: ${JSON.stringify(candidate.answers)}
  `;

  const parts: any[] = [{ text: promptText }];
  if (candidate.cvData?.base64) {
    parts.push({
      inlineData: {
        data: candidate.cvData.base64,
        mimeType: candidate.cvData.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 12000,
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

    const outputText = response.text?.trim();
    if (!outputText) throw new Error("AI Motoru boş bir yanıt döndürdü.");
    
    return JSON.parse(outputText) as AIReport;
  } catch (error: any) {
    console.error("Gemini Akademi Teknik Hata:", error);
    // Hatanın ham halini fırlatıyoruz ki UI'da teşhis edilebilsin
    throw error;
  }
};
