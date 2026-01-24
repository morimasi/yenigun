
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Nöral Muhakeme ve Klinik Analiz Servisi
 * Model: Gemini-3-Flash-Preview (Deep Thinking Mode)
 * Budget: 24,576 Tokens (Flash için maksimum muhakeme sınırı)
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY_MISSING");
  const ai = new GoogleGenAI({ apiKey });
  
  const modelName = "gemini-3-flash-preview";

  const segmentSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      status: { type: Type.STRING },
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      cons: { type: Type.ARRAY, items: { type: Type.STRING } },
      risks: { type: Type.ARRAY, items: { type: Type.STRING } },
      competencyLevel: { type: Type.STRING }
    }
  };

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti ve Davranış Bilimci.
    GÖREV: Adayın liyakat profilini derinlemesine muhakeme ederek analiz et.
    
    ANALİZ PROTOKOLÜ:
    - Yanıtlar arasındaki mikro-çelişkileri (Anomaliler) tespit et.
    - Adayın akademik dürüstlüğünü ve "sosyal maske" kullanımını ölç.
    - CV'deki tasarım disiplinini multimodal olarak değerlendir (eğer varsa).
    - 10 boyutlu matrisi (Personality, Formality, Ethics vs.) nöral simülasyonla puanla.
    
    DÜŞÜNME TALİMATI: Cevabı üretmeden önce adayın klinik karakterini bir bütün olarak "düşün". Teorik bilgisi ile pratik etik yaklaşımları uyuşuyor mu? Riskleri asla yüzeysel geçme.

    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const parts: any[] = [{ text: `ADAY VERİLERİ VE KLİNİK CEVAPLAR: ${JSON.stringify(candidate)}` }];
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
                personality: segmentSchema,
                formality: segmentSchema,
                parentStudentRelations: segmentSchema,
                sustainability: segmentSchema,
                developmentOpenness: segmentSchema,
                criticismTolerance: segmentSchema,
                workEthics: segmentSchema,
                pedagogicalAnalysis: segmentSchema,
                technicalExpertise: segmentSchema,
                institutionalLoyalty: segmentSchema
              }
            },
            predictiveMetrics: {
              type: Type.OBJECT,
              properties: {
                retentionProbability: { type: Type.NUMBER },
                burnoutRisk: { type: Type.NUMBER },
                learningVelocity: { type: Type.NUMBER },
                leadershipPotential: { type: Type.NUMBER }
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
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) { throw error; }
};
