
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig, SimulationResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Adayın liyakat profilini analiz eden ana motor.
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const modelName = "gemini-3-flash-preview";

  const segmentSchema = {
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

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti.
    GÖREV: Adayı 10 Boyutlu Matris üzerinden analiz et.
    ÖZEL TALİMAT: Adayın mülakat sırasında "idealize" bir profil çizip çizmediğini (Social Masking) anla. 
    Cevaplardaki mikro-çelişkileri yakala.
  `;

  try {
    const parts: any[] = [{ text: `ADAY VERİLERİ: ${JSON.stringify(candidate)}` }];
    if (candidate.cvData?.base64) {
      parts.push({ inlineData: { data: candidate.cvData.base64, mimeType: candidate.cvData.mimeType || 'image/jpeg' } });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            integrityIndex: { type: Type.NUMBER },
            socialMaskingScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            deepAnalysis: {
              type: Type.OBJECT,
              properties: {
                personality: segmentSchema, formality: segmentSchema, parentStudentRelations: segmentSchema,
                sustainability: segmentSchema, developmentOpenness: segmentSchema, criticismTolerance: segmentSchema,
                workEthics: segmentSchema, pedagogicalAnalysis: segmentSchema, technicalExpertise: segmentSchema,
                institutionalLoyalty: segmentSchema
              }
            },
            predictiveMetrics: {
              type: Type.OBJECT,
              properties: {
                retentionProbability: { type: Type.NUMBER }, burnoutRisk: { type: Type.NUMBER },
                learningVelocity: { type: Type.NUMBER }, leadershipPotential: { type: Type.NUMBER }
              }
            },
            interviewGuidance: {
              type: Type.OBJECT,
              properties: {
                strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
                simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) { throw error; }
};

/**
 * Faz 4: Klinik Stres Testi Üreticisi
 * Model: Gemini 3 Pro (Complex Reasoning)
 */
export const runStresSimulation = async (candidate: Candidate): Promise<SimulationResult> => {
  const modelName = "gemini-3-pro-preview";

  const systemInstruction = `
    ROL: Cerrahi Hassasiyette Klinik Simülatör.
    AMAC: Adayın etik sınırlarını ve stres toleransını gerçek bir vaka üzerinden test et.
    
    SENARYO ÜRETİM MANTIĞI:
    - Adayın cevaplarında en çok "güvende" hissettiği alanı bul ve oraya saldır.
    - Örn: "Etik kurallarım çok katıdır" diyen birine, etik dışı davranmaya zorlayan ama haklı görünen (duygusal manipülasyon içeren) bir veli vakası kurgula.
    
    ÇIKTI: Simülasyonun sonucunda adayın vereceği muhtemel tepkiyi ve bunun liyakat skoruna etkisini analiz et.
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: `ADAY PROFİLİ VE CEVAPLARI: ${JSON.stringify(candidate)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scenario: { type: Type.STRING },
          parentPersona: { type: Type.STRING },
          stressLevel: { type: Type.NUMBER },
          candidateResponse: { type: Type.STRING },
          aiEvaluation: {
            type: Type.OBJECT,
            properties: {
              ethicalBoundaryScore: { type: Type.NUMBER },
              empathyCalibration: { type: Type.NUMBER },
              professionalDistance: { type: Type.NUMBER },
              crisisResolutionEfficiency: { type: Type.NUMBER },
              criticalMistakes: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
