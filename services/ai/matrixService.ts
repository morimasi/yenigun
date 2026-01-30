
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractPureJSON = (text: string): any => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace === -1) return null;
    let jsonStr = lastBrace > firstBrace ? cleanText.substring(firstBrace, lastBrace + 1) : cleanText.substring(firstBrace);
    let openCount = (jsonStr.match(/\{/g) || []).length;
    let closeCount = (jsonStr.match(/\}/g) || []).length;
    while (openCount > closeCount) { jsonStr += "}"; closeCount++; }
    jsonStr = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    return JSON.parse(jsonStr);
  } catch (e) { return null; }
};

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    status: { type: Type.STRING },
    reasoning: { type: Type.STRING },
    behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
    institutionalImpact: { type: Type.STRING },
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    risks: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["score", "status", "reasoning", "behavioralIndicators", "institutionalImpact", "pros", "cons", "risks"]
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const systemInstruction = `
    ROL: Yeni Gün Akademi Klinik Projeksiyon Laboratuvarı.
    GÖREV: Adayın 24 aylık kurumsal evrimini simüle et.
    
    PROJEKSİYON KURALLARI:
    1. Adayın "Klinik Olgunlaşma Eğrisi"ni (Growth Forecast) ay bazında (0, 3, 6, 12, 18, 24) puanla.
    2. Zaman çizelgesini (Evolution Timeline) 3 ana faza ayır: Oryantasyon, Stabilizasyon, Otorite.
    3. Her faz için beklenen somut davranışları ve yöneticiye kritik tavsiyeleri üret.
    4. Analiz dili: Gelecek odaklı, olasılık temelli ama kesin klinik gözlemler içeren.
    
    ÇIKTI: Saf JSON.
  `;

  try {
    const { cvData, report, algoReport, ...candidateData } = candidate;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ text: `ADAY ANALİZ VERİSİ: ${JSON.stringify(candidateData)}` }], 
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 12000 }, 
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            integrityIndex: { type: Type.NUMBER },
            socialMaskingScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            detailedAnalysisNarrative: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            predictiveMetrics: {
              type: Type.OBJECT,
              properties: {
                retentionProbability: { type: Type.NUMBER },
                burnoutRisk: { type: Type.NUMBER },
                learningVelocity: { type: Type.NUMBER },
                leadershipPotential: { type: Type.NUMBER },
                evolutionPath: { type: Type.STRING },
                evolutionTimeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phase: { type: Type.STRING },
                      timeframe: { type: Type.STRING },
                      expectedBehaviors: { type: Type.ARRAY, items: { type: Type.STRING } },
                      clinicalGrowth: { type: Type.STRING },
                      managementAdvice: { type: Type.STRING }
                    },
                    required: ["phase", "timeframe", "expectedBehaviors", "clinicalGrowth", "managementAdvice"]
                  }
                },
                growthForecast: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.NUMBER },
                      score: { type: Type.NUMBER }
                    },
                    required: ["month", "score"]
                  }
                },
                riskMitigation: {
                  type: Type.OBJECT,
                  properties: {
                    primaryRisk: { type: Type.STRING },
                    preventionStrategy: { type: Type.STRING }
                  },
                  required: ["primaryRisk", "preventionStrategy"]
                }
              },
              required: ["retentionProbability", "burnoutRisk", "learningVelocity", "leadershipPotential", "evolutionPath", "evolutionTimeline", "growthForecast", "riskMitigation"]
            },
            deepAnalysis: {
              type: Type.OBJECT,
              properties: {
                workEthics: SEGMENT_SCHEMA,
                technicalExpertise: SEGMENT_SCHEMA,
                pedagogicalAnalysis: SEGMENT_SCHEMA,
                parentStudentRelations: SEGMENT_SCHEMA,
                sustainability: SEGMENT_SCHEMA,
                institutionalLoyalty: SEGMENT_SCHEMA,
                developmentOpenness: SEGMENT_SCHEMA
              },
              required: ["workEthics", "technicalExpertise", "pedagogicalAnalysis", "parentStudentRelations", "sustainability", "institutionalLoyalty", "developmentOpenness"]
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
                phases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      title: { type: Type.STRING },
                      goal: { type: Type.STRING },
                      questions: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            text: { type: Type.STRING },
                            why: { type: Type.STRING },
                            lookFor: { type: Type.STRING }
                          },
                          required: ["text", "why", "lookFor"]
                        }
                      },
                      redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                      subliminalCues: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["id", "title", "goal", "questions", "redFlags", "subliminalCues"]
                  }
                },
                criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
                simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["phases", "criticalObservations", "simulationTasks"]
            }
          },
          required: ["score", "integrityIndex", "socialMaskingScore", "summary", "detailedAnalysisNarrative", "recommendation", "predictiveMetrics", "deepAnalysis", "swot", "interviewGuidance"]
        }
      }
    });

    const parsedData = extractPureJSON(response.text);
    if (!parsedData) throw new Error("JSON_RECOVERY_FAILED");
    return parsedData;
  } catch (error) {
    console.error("AI_STRATEGY_ENGINE_ERROR:", error);
    throw error;
  }
};
