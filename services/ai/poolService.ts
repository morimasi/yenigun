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
         GÖREV: Mevcut aday havuzunu kurumun hedefleriyle kıyasla. 
         MODEL: Gemini 3 Flash Thinking.
      `,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          topPerformingBranch: { type: Type.STRING },
          criticalRiskArea: { type: Type.STRING },
          recommendedAction: { type: Type.STRING },
          marketPrediction: { type: Type.STRING },
          highPotentialCandidates: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["executiveSummary", "topPerformingBranch", "criticalRiskArea", "recommendedAction", "marketPrediction", "highPotentialCandidates"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};