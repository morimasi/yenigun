
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, GlobalConfig } from "../../types";

/**
 * MIA AI Engine - Standardized JSON Cleaner
 */
const cleanJSON = (text: string | undefined) => {
  if (!text) return null;
  try {
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = clean.search(/[{\[]/);
    const end = Math.max(clean.lastIndexOf('}'), clean.lastIndexOf(']'));
    
    if (start === -1 || end === -1 || end < start) return JSON.parse(clean);
    
    const jsonStr = clean.substring(start, end + 1).replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    return JSON.parse(jsonStr);
  } catch (e) { 
    console.error("MIA AI Engine: JSON Sanitization Error", e);
    return null; 
  }
};

export const analyzeTalentPool = async (candidates: Candidate[], config: GlobalConfig) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      systemInstruction: "Yeni Gün Akademi Stratejik İK Analisti. Havuzu kurum hedefleriyle kıyasla. Kesinlikle sadece JSON döndür.",
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 }
    }
  });

  return cleanJSON(response.text) || {};
};

export const compareTwoCandidates = async (c1: Candidate, c2: Candidate, config: GlobalConfig) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const payload = {
    candidate1: { name: c1.name, branch: c1.branch, report: c1.report },
    candidate2: { name: c2.name, branch: c2.branch, report: c2.report },
    config: config
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `KIYASLAMA VERİSİ: ${JSON.stringify(payload)}`,
    config: {
      systemInstruction: `
        ROL: Yeni Gün Akademi Baş Stratejisti. 
        GÖREV: İki aday arasındaki nöral ve klinik farkları "Delta Analizi" yöntemiyle karşılaştır.
        FORMAT: Sadece JSON döndür.
      `,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          winnerAdvantage: { type: Type.STRING },
          criticalRisk: { type: Type.STRING },
          clinicalDNAComparison: { type: Type.STRING },
          onboardingRecommendation: { type: Type.STRING }
        },
        required: ["summary", "winnerAdvantage", "criticalRisk", "clinicalDNAComparison", "onboardingRecommendation"]
      }
    }
  });

  return cleanJSON(response.text);
};

export const poolService = {
  analyzeTalentPool,
  compareTwoCandidates
};
