
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig, ClinicalTestType, SimulationResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Adayın liyakat profilini analiz eden ana motor.
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const modelName = "gemini-3-flash-preview";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti ve Liyakat Müfettişi.
    HEDEF: Adayın profesyonel DNA'sını 10 KRİTİK BOYUT üzerinden analiz et.
    
    ANALİZ EDİLECEK 10 BOYUT:
    1. workEthics, 2. pedagogicalAnalysis, 3. parentStudentRelations, 4. formality, 5. developmentOpenness,
    6. sustainability, 7. technicalExpertise, 8. criticismTolerance, 9. personality, 10. institutionalLoyalty.

    DİSİPLİN: JSON formatında çıktı ver. Tırnak işaretlerini ve yeni satırları JSON standartlarına uygun şekilde kaçış karakterleri (escape) ile kullan.
  `;

  try {
    // Sadece gerekli verileri gönder (Context tasarrufu)
    const leanCandidate = {
      name: candidate.name,
      branch: candidate.branch,
      experienceYears: candidate.experienceYears,
      university: candidate.university,
      department: candidate.department,
      answers: candidate.answers,
      allTrainings: candidate.allTrainings
    };

    const parts: any[] = [{ text: `ADAY VERİLERİ: ${JSON.stringify(leanCandidate)}` }];
    if (candidate.cvData?.base64) {
      parts.push({ 
        inlineData: { 
          data: candidate.cvData.base64, 
          mimeType: candidate.cvData.mimeType || 'image/jpeg' 
        } 
      });
    }

    const segmentSchema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
        risks: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["score", "pros", "risks"]
    };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 4096 },
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
                workEthics: segmentSchema,
                pedagogicalAnalysis: segmentSchema,
                parentStudentRelations: segmentSchema,
                formality: segmentSchema,
                developmentOpenness: segmentSchema,
                sustainability: segmentSchema,
                technicalExpertise: segmentSchema,
                criticismTolerance: segmentSchema,
                personality: segmentSchema,
                institutionalLoyalty: segmentSchema
              },
              required: ["workEthics", "pedagogicalAnalysis", "parentStudentRelations", "formality", "developmentOpenness", "sustainability", "technicalExpertise", "criticismTolerance", "personality", "institutionalLoyalty"]
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
    
    return JSON.parse(response.text.trim());
  } catch (error: any) { 
    console.error("Analiz Hatası:", error);
    throw error; 
  }
};

/**
 * Adayın kriz anındaki reflekslerini simüle eden motor.
 */
export const runStresSimulation = async (candidate: Candidate): Promise<SimulationResult> => {
  const modelName = "gemini-3-flash-preview";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Kriz Simülatörü.
    HEDEF: Adayın zayıf yönlerini zorlayacak bir etik/klinik kriz senaryosu üret.
    KURAL: Yanıt kesinlikle geçerli bir JSON olmalıdır. Metin içindeki çift tırnaklar (\") şeklinde kaçırılmalıdır.
    KAPSAM: Senaryo adayın branşına (${candidate.branch}) ve verdiği cevaplara uygun olmalıdır.
  `;

  try {
    // CV verisi gibi ağır verileri simülasyondan çıkarıyoruz (Sadece cevaplar yeterli)
    const simulationInput = {
      name: candidate.name,
      branch: candidate.branch,
      experience: candidate.experienceYears,
      answers: candidate.answers
    };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `SIMULASYON GIRDISI: ${JSON.stringify(simulationInput)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 1536 },
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
                criticalMistakes: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    });

    // Ham metni temizle (markdown taglarını temizle)
    const cleanText = response.text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(cleanText);
  } catch (error: any) {
    console.error("Simülasyon Hatası:", error);
    throw error;
  }
};
