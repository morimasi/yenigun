
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTalentPool = async (candidates: Candidate[], config: GlobalConfig) => {
  const poolSnapshot = candidates.map(c => ({
    branch: c.branch,
    score: c.report?.score || 0,
    integrity: c.report?.integrityIndex || 0,
    experience: c.experienceYears,
    university: c.university,
    masking: c.report?.socialMaskingScore || 0
  }));

  const systemInstruction = `
    ROL: Yeni Gün Akademi Stratejik İK ve Klinik Veri Bilimcisi.
    GÖREV: Aday havuzunu analiz et ve kurumun 'Akademik Sağlık Raporu'nu oluştur.
    
    ANALİZ KRİTERLERİ:
    1. Talent Density: Hangi branşlarda liyakat yoğunluğu var?
    2. Educational ROI: Hangi üniversitelerden gelen adaylar daha yüksek klinik skor alıyor?
    3. Ethical Risk Map: Havuzda sosyal maskeleme eğilimi hangi alanlarda artış gösteriyor?
    4. Strategic Gap: Kurumun gelecekte hangi branşta uzman bulmakta zorlanacağını tahmin et.
    
    DİL: Üst düzey yönetici özeti, analitik, keskin.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAY HAVUZU VERİ SETİ: ${JSON.stringify(poolSnapshot)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 16000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          topPerformingBranch: { type: Type.STRING },
          criticalRiskArea: { type: Type.STRING },
          recommendedAction: { type: Type.STRING },
          marketPrediction: { type: Type.STRING, description: "Önümüzdeki 6 ay için işe alım piyasası tahmini." }
        },
        required: ["executiveSummary", "topPerformingBranch", "criticalRiskArea", "recommendedAction", "marketPrediction"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
