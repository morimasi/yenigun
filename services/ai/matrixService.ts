
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    status: { type: Type.STRING },
    reasoning: { type: Type.STRING, description: "Bu skorun adayın hangi spesifik cevaplarına dayandığının klinik analizi. Neden bu puan verildi?" },
    behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cevaplarda saptanan mikrodavranış ve tutum emareleri." },
    institutionalImpact: { type: Type.STRING, description: "Bu yetkinlik düzeyinin kurum kültürü ve operasyonel verimlilik üzerindeki 12 aylık somut etkisi." },
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    risks: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["score", "status", "reasoning", "behavioralIndicators", "institutionalImpact", "pros", "cons", "risks"]
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Karar Destek Uzmanı.
    MODEL: Gemini 3 Flash Thinking Mode.
    GÖREV: Adayın liyakat matrisini "Açıklamalı, Nedensel ve Prediktif Analiz" yöntemiyle işle.
    
    YÖNERGE:
    1. SADECE SKOR VERME: Skorun ARKASINDAKİ mantığı (neden?) pedagojik literatüre dayandırarak açıkla.
    2. CEVAPLARA ATIF YAP: "Adayın X sorusuna verdiği Y cevabı, Z riskini taşımaktadır" şeklinde direkt analiz yap.
    3. KURUMSAL ETKİ: Adayın 1 yıl sonra kurumda neyi iyileştireceğini veya hangi krizlere yol açacağını net belirt.
    4. DİL: Akademik, sert, analitik ve kesin hüküm içeren bir üslup kullan.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      integrityIndex: { type: Type.NUMBER },
      socialMaskingScore: { type: Type.NUMBER },
      summary: { type: Type.STRING },
      detailedAnalysisNarrative: { type: Type.STRING, description: "Adayın genel akademik ve klinik karakterinin 300 kelimelik derin analizi." },
      recommendation: { type: Type.STRING },
      predictiveMetrics: {
        type: Type.OBJECT,
        properties: {
          retentionProbability: { type: Type.NUMBER },
          burnoutRisk: { type: Type.NUMBER },
          learningVelocity: { type: Type.NUMBER },
          leadershipPotential: { type: Type.NUMBER },
          evolutionPath: { type: Type.STRING, description: "Adayın kurumdaki 2. yılında geleceği muhtemel profesyonel seviye tahmini." }
        },
        required: ["retentionProbability", "burnoutRisk", "learningVelocity", "leadershipPotential", "evolutionPath"]
      },
      deepAnalysis: {
        type: Type.OBJECT,
        properties: {
          workEthics: SEGMENT_SCHEMA,
          pedagogicalAnalysis: SEGMENT_SCHEMA,
          parentStudentRelations: SEGMENT_SCHEMA,
          formality: SEGMENT_SCHEMA,
          developmentOpenness: SEGMENT_SCHEMA,
          sustainability: SEGMENT_SCHEMA,
          technicalExpertise: SEGMENT_SCHEMA,
          criticismTolerance: SEGMENT_SCHEMA,
          personality: SEGMENT_SCHEMA,
          institutionalLoyalty: SEGMENT_SCHEMA
        },
        required: ["workEthics", "pedagogicalAnalysis", "parentStudentRelations", "formality", "developmentOpenness", "sustainability", "technicalExpertise", "criticismTolerance", "personality", "institutionalLoyalty"]
      },
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
      interviewGuidance: {
        type: Type.OBJECT,
        properties: {
          strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
          simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["strategicQuestions", "criticalObservations", "simulationTasks"]
      }
    },
    required: ["score", "integrityIndex", "socialMaskingScore", "summary", "detailedAnalysisNarrative", "recommendation", "predictiveMetrics", "deepAnalysis", "swot", "interviewGuidance"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAY VERİLERİ VE KLİNİK YANITLAR: ${JSON.stringify(candidate)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 }, // Flash için max bütçe
      responseSchema: responseSchema
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("AI Rapor Parse Hatası:", e);
    throw new Error("Analiz raporu oluşturulurken yapısal bir hata oluştu.");
  }
};
