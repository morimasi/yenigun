
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTalentPool = async (candidates: Candidate[], config: GlobalConfig) => {
  const poolSnapshot = candidates.map(c => ({
    branch: c.branch,
    score: c.report?.score || 0,
    masking: c.report?.socialMaskingScore || 0,
    experience: c.experienceYears
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `HAVUZ VERİSİ: ${JSON.stringify(poolSnapshot)}`,
    config: {
      systemInstruction: "Yeni Gün Akademi Stratejik Planlama. Havuzdaki liyakat yoğunluğunu ve gelecekteki branş açıklarını 'Think' katmanında analiz et.",
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 16000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          topPerformingBranch: { type: Type.STRING },
          criticalRiskArea: { type: Type.STRING },
          recommendedAction: { type: Type.STRING },
          marketPrediction: { type: Type.STRING }
        },
        required: ["executiveSummary", "topPerformingBranch", "criticalRiskArea", "recommendedAction", "marketPrediction"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
