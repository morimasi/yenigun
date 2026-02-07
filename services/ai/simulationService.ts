
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, ClinicalTestType, SimulationResult } from "../../types";

export const simulateCrisis = async (candidate: Candidate, testType: ClinicalTestType): Promise<SimulationResult> => {
  // @fix: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const candidateSnapshot = {
    personal: { name: candidate.name, branch: candidate.branch },
    coreAnswers: candidate.answers
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KRİTİK TEST: ${testType} | ADAY: ${JSON.stringify(candidateSnapshot)}`,
      config: {
        systemInstruction: `
          ROL: Yeni Gün Akademi Nöro-Psikolojik Test Laboratuvarı.
          GÖREV: Adayı en zayıf etik sınırında yakalayacak bir vaka kurgula ve 'Think' katmanında adayın nöral tepkisini simüle et.
          ÇIKTI: Saf JSON olmalı.
        `,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            parentPersona: { type: Type.STRING },
            candidateResponse: { type: Type.STRING },
            stressLevel: { type: Type.NUMBER },
            aiEvaluation: {
              type: Type.OBJECT,
              properties: {
                ethicalBoundaryScore: { type: Type.NUMBER },
                empathyCalibration: { type: Type.NUMBER },
                professionalDistance: { type: Type.NUMBER },
                crisisResolutionEfficiency: { type: Type.NUMBER },
                clinicalTruths: { type: Type.ARRAY, items: { type: Type.STRING } },
                criticalMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
                neuralDivergence: {
                  type: Type.OBJECT,
                  properties: {
                    contradictionIndex: { type: Type.NUMBER },
                    decisionPath: { type: Type.STRING },
                    alternativeOutcome: { type: Type.STRING },
                    dominantEmotion: { type: Type.STRING }
                  },
                  required: ["contradictionIndex", "decisionPath", "alternativeOutcome", "dominantEmotion"]
                },
                microBehaviors: {
                  type: Type.OBJECT,
                  properties: {
                    toneAnalysis: { type: Type.STRING },
                    nonVerbalPrediction: { type: Type.STRING },
                    silenceTolerance: { type: Type.STRING }
                  },
                  required: ["toneAnalysis", "nonVerbalPrediction", "silenceTolerance"]
                }
              },
              required: ["ethicalBoundaryScore", "empathyCalibration", "professionalDistance", "crisisResolutionEfficiency", "clinicalTruths", "criticalMistakes", "neuralDivergence", "microBehaviors"]
            }
          },
          required: ["scenario", "parentPersona", "candidateResponse", "stressLevel", "aiEvaluation"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Simulation AI Error:", e);
    throw e;
  }
};
