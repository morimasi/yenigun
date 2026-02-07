
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig, ClinicalTestType, SimulationResult } from "../types";

const cleanAndParseJSON = (rawText: string) => {
  try {
    let cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("MIA AI Engine: JSON Parse Hatası", e);
    throw new Error("Stratejik veri formatı bozuldu.");
  }
};

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    status: { type: Type.STRING },
    reasoning: { type: Type.STRING, description: "Bu puanın adayın hangi cevaplarına ve hangi klinik literatüre dayandığının derin analizi." },
    behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cevaplarda saptanan somut tutum emareleri." },
    institutionalImpact: { type: Type.STRING, description: "Bu aday kurumda çalışırsa 1 yıl içinde klinik kaliteyi nasıl etkiler?" },
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    risks: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["score", "status", "reasoning", "behavioralIndicators", "institutionalImpact", "pros", "cons", "risks"]
};

export const aiService = {
  async analyzeCandidate(candidate: Candidate, config: GlobalConfig): Promise<AIReport> {
    // @fix: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      ROL: Yeni Gün Akademi Kıdemli Klinik Karar Destek Uzmanı.
      GÖREV: Adayın liyakat matrisini "Açıklamalı ve Nedensel Analiz" yöntemiyle işle.
      MODEL: Gemini 3 Flash Multimodal Thinking.
      
      KRİTİK TALİMATLAR:
      1. Sadece sayısal veri verme; skorun ARKASINDAKİ klinik mantığı açıkla.
      2. 'Reasoning' kısmında adayın verdiği spesifik cevaplara atıfta bulun.
      3. 'Institutional Impact' kısmında, bu adayın kurumda neyi iyileştireceğini veya hangi krizlere yol açabileceğini açıkça yaz.
      4. Dil: Profesyonel, analitik ve akademik.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        integrityIndex: { type: Type.NUMBER },
        socialMaskingScore: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        detailedAnalysisNarrative: { type: Type.STRING, description: "Genel akademik portrenin 200 kelimelik klinik yorumu." },
        recommendation: { type: Type.STRING },
        predictiveMetrics: {
          type: Type.OBJECT,
          properties: {
            retentionProbability: { type: Type.NUMBER },
            burnoutRisk: { type: Type.NUMBER },
            learningVelocity: { type: Type.NUMBER },
            leadershipPotential: { type: Type.NUMBER },
            evolutionPath: { type: Type.STRING, description: "Adayın 2. yılındaki muhtemel profesyonel konumu." }
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
      contents: `ADAY VERİLERİ: ${JSON.stringify(candidate)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: responseSchema
      }
    });

    return cleanAndParseJSON(response.text);
  },

  async simulateCrisis(candidate: Candidate, testType: ClinicalTestType): Promise<SimulationResult> {
    // @fix: Create a new GoogleGenAI instance right before making an API call.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ADAY: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, answers: candidate.answers, testType })}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Klinik Laboratuvarı. Adayın kriz anındaki nöral sapmalarını ve etik sınırlarını test eden bir simülasyon üret. Yanıtı sadece JSON formatında ver.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    return cleanAndParseJSON(response.text);
  }
};
