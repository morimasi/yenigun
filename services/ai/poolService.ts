
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, GlobalConfig } from "../../types";

// @fix: Implemented helper to safely extract and parse JSON from model responses.
const cleanJSON = (text: string | undefined) => {
  if (!text) return null;
  try {
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start === -1 || end === -1) return JSON.parse(clean);
    return JSON.parse(clean.substring(start, end + 1));
  } catch (e) { return null; }
};

// @fix: Added named export analyzeTalentPool to resolve import error in AnalyticsView.tsx and moved initialization inside function.
export const analyzeTalentPool = async (candidates: Candidate[], config: GlobalConfig) => {
  // @fix: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
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
      systemInstruction: "Yeni Gün Akademi Stratejik İK Analisti. Havuzu kurum hedefleriyle kıyasla. JSON döndür.",
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 }
    }
  });

  return cleanJSON(response.text) || {};
};

// @fix: Added named export and moved initialization inside function.
export const compareTwoCandidates = async (c1: Candidate, c2: Candidate, config: GlobalConfig) => {
  // @fix: Create a new GoogleGenAI instance right before making an API call.
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
        KRİTERLER: 1. Kim daha stabil? 2. Kimin kognitif esnekliği daha yüksek? 3. Hangisi ekip için daha az riskli?
        FORMAT: Saf JSON.
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
