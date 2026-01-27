
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig, ClinicalTestType, SimulationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanAndParseJSON = (rawText: string) => {
  try {
    let cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    if (cleanText.endsWith(',') || cleanText.endsWith('.')) {
      cleanText = cleanText.slice(0, -1);
    }
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
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    risks: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["score", "status", "pros", "cons", "risks"]
};

export const aiService = {
  /**
   * Liyakat Matrisi Analizi
   */
  async analyzeCandidate(candidate: Candidate, config: GlobalConfig): Promise<AIReport> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Klinik Analisti.
      GÖREV: Adayın liyakat, etik ve klinik derinliğini analiz ederek 10 boyutlu matris raporu üret.
      KRİTER: Sertifika-Cevap uyumu, liyakat dürüstlüğü ve teknik derinlik.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        integrityIndex: { type: Type.NUMBER },
        socialMaskingScore: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        recommendation: { type: Type.STRING },
        predictiveMetrics: {
          type: Type.OBJECT,
          properties: {
            retentionProbability: { type: Type.NUMBER },
            burnoutRisk: { type: Type.NUMBER },
            learningVelocity: { type: Type.NUMBER },
            leadershipPotential: { type: Type.NUMBER }
          },
          required: ["retentionProbability", "burnoutRisk", "learningVelocity", "leadershipPotential"]
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
      required: ["score", "integrityIndex", "socialMaskingScore", "summary", "recommendation", "predictiveMetrics", "deepAnalysis", "swot", "interviewGuidance"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ADAY VERILERI: ${JSON.stringify(candidate)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 12000,
        thinkingConfig: { thinkingBudget: 4096 },
        responseSchema: responseSchema
      }
    });

    return cleanAndParseJSON(response.text);
  },

  /**
   * Nöral Projeksiyon
   */
  async predictFuture(candidate: Candidate): Promise<any> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PROJEKSIYON: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, report: candidate.report })}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Nöral Projeksiyon Ünitesi. Adayın 12 aylık gelişimini analiz et.",
        responseMimeType: "application/json",
        maxOutputTokens: 4000,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    return cleanAndParseJSON(response.text);
  },

  /**
   * Stres Simülasyonu
   */
  async simulateCrisis(candidate: Candidate, testType: ClinicalTestType): Promise<SimulationResult> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ADAY PROFILI: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, answers: candidate.answers, testType })}`,
      config: {
        systemInstruction: "Yeni Gün Akademi Klinik Laboratuvarı. Adayın etik sınırlarını sarsacak stres simülasyonu üret.",
        responseMimeType: "application/json",
        maxOutputTokens: 30000,
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    return cleanAndParseJSON(response.text);
  }
};
