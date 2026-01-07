
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  if (!process.env.API_KEY) {
    throw new Error("MISSING_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için Üst Düzey Psikometrik Analiz Uzmanısın.
    
    ANALİZ MANTIĞI:
    - Adayın cevaplarındaki "Aşırı Profesyonellik" maskesini düşür. 
    - Sorular gri alan sorularıdır. "Her şeyi mükemmel yaparım" diyen adayları "Güvenilmez/Maskelenmiş" olarak puanla.
    - Duygu bastırma, pasif-agresyon ve kurumsal körlük belirtilerini ara.
    - Aday insani zaaflarını (yorulma, hata yapma, öfke hissetme) kabul ediyorsa bu "Otantisite" puanını artırır.
    
    PUANLAMA:
    - Score: 0-100 (Kurumsal uyum ve etik olgunluk).
    - SWOT: Gerçekçi riskleri (Threats) açıkça belirt.
    - CategoricalScores: 'Bilişsel Esneklik', 'Klinik Etik', 'Stres Yönetimi', 'Diplomasi' kategorilerinde puanla.
    
    ÖZEL TALİMAT:
    Adayın CV'si ile test cevapları arasındaki çelişkileri (Örn: 10 yıl deneyimli ama temel etik hatayı kabul ediyor) yakala.
  `;

  const textPrompt = `
    ADAY PROFİLİ:
    İsim: ${candidate.name}
    Branş: ${candidate.branch}
    Deneyim: ${candidate.experienceYears} yıl
    
    TEST CEVAPLARI:
    ${JSON.stringify(candidate.answers)}
    
    EĞİTİM GEÇMİŞİ:
    ${candidate.allTrainings}
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

    return JSON.parse(response.text || '{}') as AIReport;
  } catch (error: any) {
    if (error.message?.includes("entity was not found") || error.message?.includes("API key")) {
      throw new Error("INVALID_API_KEY");
    }
    throw error;
  }
};
