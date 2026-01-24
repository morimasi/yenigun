
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
      risks: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["score", "status", "pros", "cons", "risks"]
  };

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti ve Davranış Bilimci.
    GÖREV: Adayın liyakat profilini 10 Boyutlu Matris (The Decagonal Matrix) üzerinden analiz et.
    
    ANALİZ MATRİSİ BOYUTLARI:
    1. personality (Karakter)
    2. formality (Resmiyet)
    3. parentStudentRelations (Veli-Öğrenci)
    4. sustainability (Tükenmişlik Direnci)
    5. developmentOpenness (Gelişim)
    6. criticismTolerance (Eleştiri)
    7. workEthics (Etik)
    8. pedagogicalAnalysis (Pedagoji)
    9. technicalExpertise (Teknik)
    10. institutionalLoyalty (Sadakat)

    ANALİZ PROTOKOLÜ:
    - Cevaplar arasındaki mikro-çelişkileri (Anomaliler) tespit et.
    - Seçilen şıkların ağırlık vektörlerini göz önüne al ama metin cevaplarındaki samimiyeti ölç.
    - Adayın 'Sosyal Maske' (Dürüstlük) katsayısını % üzerinden hesapla.
    
    DÜŞÜNME TALİMATI: Cevabı üretmeden önce adayın tüm cevaplarını bir "Klinik Karakter" olarak simüle et. Adayın stres anındaki muhtemel tepkilerini düşün.
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
