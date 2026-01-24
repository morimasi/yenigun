
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig, ClinicalTestType, SimulationResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * LLM tarafından üretilen kirli JSON çıktılarını temizleyen yardımcı fonksiyon.
 */
const cleanAndParseJSON = (rawText: string) => {
  try {
    // Markdown bloklarını temizle
    let cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // JSON içindeki kontrol karakterlerini ve muhtemel yarım kalmış yapıları temizle
    // (Bazı durumlarda model sondaki parantezi unutabiliyor)
    if (cleanText.endsWith(',') || cleanText.endsWith('.')) {
      cleanText = cleanText.slice(0, -1);
    }
    
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Hatası Denetimi:", e, "Ham Metin:", rawText);
    throw new Error("Sistem çıktısı yapısal olarak bozuk.");
  }
};

/**
 * Adayın 12 aylık profesyonel projeksiyonunu üreten nöral motor.
 */
export const generateNeuralProjection = async (candidate: Candidate): Promise<any> => {
  const modelName = "gemini-3-flash-preview";
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Nöral Projeksiyon Ünitesi.
    GÖREV: Adayın 12 aylık profesyonel gelişimini analiz et.
    KURAL: Yanıt sadece geçerli bir JSON olmalıdır. Metinler içinde çift tırnak (") kullanmaktan kaçın, gerekirse tek tırnak (') kullan. 
    JSON içinde asla yeni satır karakteri (\n) olmasın, tüm metni tek satırda tut.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `PROJEKSIYON TALEBI: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, report: candidate.report })}`,
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
                strategicAdvice: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    return cleanAndParseJSON(response.text);
  } catch (error) {
    console.error("Projeksiyon Hatası:", error);
    throw error;
  }
};

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const modelName = "gemini-3-flash-preview";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Analisti.
    HEDEF: Adayı 10 boyutta analiz et. 
    KURAL: Kesinlikle geçerli JSON döndür. JSON içinde escape edilmemiş karakter kalmasın.
  `;

  try {
    const leanCandidate = {
      name: candidate.name,
      branch: candidate.branch,
      experienceYears: candidate.experienceYears,
      answers: candidate.answers
    };

    const parts: any[] = [{ text: `ADAY: ${JSON.stringify(leanCandidate)}` }];
    if (candidate.cvData?.base64) {
      parts.push({ 
        inlineData: { 
          data: candidate.cvData.base64, 
          mimeType: candidate.cvData.mimeType || 'image/jpeg' 
        } 
      });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 2048 },
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
                workEthics: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                technicalExpertise: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                pedagogicalAnalysis: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                parentStudentRelations: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                formality: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                developmentOpenness: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                sustainability: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                criticismTolerance: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                personality: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                institutionalLoyalty: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } }
              }
            },
            predictiveMetrics: { type: Type.OBJECT, properties: { retentionProbability: { type: Type.NUMBER }, burnoutRisk: { type: Type.NUMBER }, learningVelocity: { type: Type.NUMBER }, leadershipPotential: { type: Type.NUMBER } } },
            interviewGuidance: { type: Type.OBJECT, properties: { strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }, criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } } } },
            swot: { type: Type.OBJECT, properties: { strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }, threats: { type: Type.ARRAY, items: { type: Type.STRING } } } }
          }
        }
      }
    });
    
    return cleanAndParseJSON(response.text);
  } catch (error: any) { 
    throw error; 
  }
};

export const runStresSimulation = async (candidate: Candidate, testType: ClinicalTestType = ClinicalTestType.DMP_STRESS): Promise<SimulationResult> => {
  const modelName = "gemini-3-flash-preview";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Klinik Laboratuvarı.
    HEDEF: Stres testi simülasyonu üret.
    KURAL: Yanıt sadece JSON olmalıdır. Metin içinde çift tırnak kullanma. Tüm metni tek satıra yay (no newlines).
    JSON formatını bozacak karakterlerden kaçın.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `SIMULASYON: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, testType })}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingBudget: 1024 },
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
                criticalMistakes: { type: Type.ARRAY, items: { type: Type.STRING } }
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
