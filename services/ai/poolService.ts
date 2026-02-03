
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTalentPool = async (candidates: Candidate[], config: GlobalConfig) => {
  const poolSnapshot = candidates.map(c => ({
    branch: c.branch,
    score: c.report?.score || 0,
    masking: c.report?.socialMaskingScore || 0,
    integrity: c.report?.integrityIndex || 0,
    experience: c.experienceYears,
    name: c.name
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `HAVUZ VERİSİ: ${JSON.stringify(poolSnapshot)}`,
    config: {
      systemInstruction: `
         ROL: Yeni Gün Akademi Stratejik İK Analisti.
         GÖREV: Mevcut aday havuzunu kurumun 12 aylık akademik hedefleriyle kıyasla. 
         ANALİZ: 
         1. Hangi branşta liyakat krizi var? 
         2. Hangi adaylar "Geleceğin Lideri" (HiPo) adayıdır? 
         3. Pazar trendlerine göre hangi uzmanlık alanı daha kritik hale gelecek?
      `,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 20000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          topPerformingBranch: { type: Type.STRING },
          criticalRiskArea: { type: Type.STRING },
          recommendedAction: { type: Type.STRING },
          marketPrediction: { type: Type.STRING },
          highPotentialCandidates: { type: Type.ARRAY, items: { type: Type.STRING }, description: "En yüksek liyakat ve dürüstlük korelasyonuna sahip 3 isim." }
        },
        required: ["executiveSummary", "topPerformingBranch", "criticalRiskArea", "recommendedAction", "marketPrediction", "highPotentialCandidates"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
