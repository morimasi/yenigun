
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig, ClinicalTestType, SimulationResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanAndParseJSON = (rawText: string) => {
  try {
    let cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    if (cleanText.endsWith(',') || cleanText.endsWith('.')) {
      cleanText = cleanText.slice(0, -1);
    }
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Hatası:", e, "Ham Metin:", rawText);
    throw new Error("Stratejik veri formatı bozuldu.");
  }
};

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const modelName = "gemini-3-flash-preview";
  
  // Algoritmik veriyi AI'ya rehber olarak gönderiyoruz (Cross-Check yeteneği için)
  const algoContext = candidate.algoReport ? `
    ALGORİTMİK ÖN-SKORLAR:
    - Genel Matematiksel Skor: %${candidate.algoReport.overallScore}
    - Etik Puanı: %${candidate.algoReport.ethicsScore}
    - Sadakat Tahmini: %${candidate.algoReport.retentionScore}
  ` : '';

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti.
    GÖREV: Adayın liyakat, etik ve klinik derinliğini analiz ederek 10 boyutlu matris raporu üret.
    
    ÖNEMLİ: Sana sağlanan 'ALGORİTMİK ÖN-SKORLAR' ile kendi klinik analizini karşılaştır. 
    Eğer senin analizin matematiksel skordan %20'den fazla sapıyorsa, bunun nedenini 'summary' kısmında mutlaka rasyonel verilerle açıkla.
    
    KURAL: 
    - Yanıt SADECE geçerli bir JSON olmalıdır.
    - Dürüstlük endeksi (integrityIndex) ve maskeleme skoru (socialMaskingScore) arasındaki korelasyona dikkat et.
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
        }
      },
      deepAnalysis: {
        type: Type.OBJECT,
        properties: {
          workEthics: { $ref: "#/definitions/segment" },
          pedagogicalAnalysis: { $ref: "#/definitions/segment" },
          parentStudentRelations: { $ref: "#/definitions/segment" },
          formality: { $ref: "#/definitions/segment" },
          developmentOpenness: { $ref: "#/definitions/segment" },
          sustainability: { $ref: "#/definitions/segment" },
          technicalExpertise: { $ref: "#/definitions/segment" },
          criticismTolerance: { $ref: "#/definitions/segment" },
          personality: { $ref: "#/definitions/segment" },
          institutionalLoyalty: { $ref: "#/definitions/segment" }
        }
      },
      swot: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          threats: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      interviewGuidance: {
        type: Type.OBJECT,
        properties: {
          strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
          simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    required: ["score", "integrityIndex", "socialMaskingScore", "summary", "recommendation", "predictiveMetrics", "deepAnalysis", "swot", "interviewGuidance"],
    definitions: {
      segment: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          status: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `ADAY VERILERI: ${JSON.stringify(candidate)} \n ${algoContext}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 4096 },
        responseSchema: responseSchema
      }
    });
    return cleanAndParseJSON(response.text);
  } catch (error: any) { throw error; }
};

export const generateNeuralProjection = async (candidate: Candidate): Promise<any> => {
  const modelName = "gemini-3-flash-preview";
  const systemInstruction = `
    ROL: Yeni Gün Akademi Nöral Projeksiyon Ünitesi.
    GÖREV: Adayın 12 aylık profesyonel gelişimini analiz et. Yanıt sadece JSON olmalıdır.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `PROJEKSIYON: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, report: candidate.report })}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingBudget: 1024 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quarters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: { type: Type.STRING },
                  performanceScore: { type: Type.NUMBER },
                  clinicalStability: { type: Type.NUMBER },
                  insight: { type: Type.STRING },
                  risks: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            finalPrediction: {
              type: Type.OBJECT,
              properties: {
                retentionProbability: { type: Type.NUMBER },
                burnoutRiskPoint: { type: Type.STRING },
                suggestedRole: { type: Type.STRING },
                strategicAdvice: { type: Type.STRING }
              }
            }
          }
        }
      }
    });
    return cleanAndParseJSON(response.text);
  } catch (error) { throw error; }
};

export const runStresSimulation = async (candidate: Candidate, testType: ClinicalTestType = ClinicalTestType.DMP_STRESS): Promise<SimulationResult> => {
  const modelName = "gemini-3-flash-preview";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Klinik Laboratuvarı - Deep Reasoning Modu.
    HEDEF: Adayın bilişsel ve etik sınırlarını sarsacak ultra-detaylı bir stres simülasyonu üret.
    KURAL: Yanıt SADECE JSON olmalıdır. 
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `ADAY PROFILI: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, answers: candidate.answers, testType })}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
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
                    decisionPath: { type: Type.STRING },
                    contradictionIndex: { type: Type.NUMBER },
                    dominantEmotion: { type: Type.STRING },
                    alternativeOutcome: { type: Type.STRING }
                  }
                },
                microBehaviors: {
                  type: Type.OBJECT,
                  properties: {
                    toneAnalysis: { type: Type.STRING },
                    nonVerbalPrediction: { type: Type.STRING },
                    silenceTolerance: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    return cleanAndParseJSON(response.text);
  } catch (error: any) {
    throw error;
  }
};
