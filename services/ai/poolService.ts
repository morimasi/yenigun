
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, GlobalConfig } from "../../types";

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
    console.error("MIA AI Engine Error", e);
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
    candidate1: { name: c1.name, branch: c1.branch, report: c1.report, experience: c1.experienceYears, university: c1.university },
    candidate2: { name: c2.name, branch: c2.branch, report: c2.report, experience: c2.experienceYears, university: c2.university },
    weights: config.weightMatrix
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `KIYASLAMA VERİSİ (H2H DELTA): ${JSON.stringify(payload)}`,
    config: {
      systemInstruction: `
        ROL: Yeni Gün Akademi Baş Stratejisti. 
        GÖREV: İki uzman adayı arasındaki klinik, etik ve nöral farkları "Delta Analizi" yöntemiyle karşılaştır.
        KRİTERLER:
        - Yüzeysel övgü yapma, keskin farkları tespit et.
        - Hangisinin kurumun vizyonuna (inovasyon, sadakat) daha yakın olduğunu belirt.
        - Kritik risk alanlarını (etik sınırlar, tükenmişlik riski) çapraz sorgula.
        FORMAT: Sadece JSON döndür.
      `,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "İki aday arasındaki temel ayrışmanın 50 kelimelik özeti." },
          winnerAdvantage: { type: Type.STRING, description: "Öne çıkan adayın diğerine göre sahip olduğu benzersiz klinik üstünlük." },
          criticalRisk: { type: Type.STRING, description: "Seçilecek adayda dikkat edilmesi gereken en büyük kognitif bariyer." },
          clinicalDNAComparison: { type: Type.STRING, description: "Metodolojik sadakat (ABA, Floortime vb.) açısından karşılaştırma." },
          onboardingRecommendation: { type: Type.STRING, description: "Kimin oryantasyonunun daha kısa süreceğine dair öngörü." }
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
