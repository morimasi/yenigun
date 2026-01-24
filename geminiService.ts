
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig, ClinicalTestType, SimulationResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Adayın 12 aylık profesyonel projeksiyonunu üreten nöral motor.
 */
export const generateNeuralProjection = async (candidate: Candidate): Promise<any> => {
  const modelName = "gemini-3-flash-preview";
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Nöral Projeksiyon ve Gelecek Tahminleme Ünitesi.
    HEDEF: Adayın liyakat verilerinden yola çıkarak 12 aylık profesyonel yörüngesini çiz.
    DİSİPLİN: Tamamen TÜRKÇE, analitik ve klinik bir dil kullan.
    
    PARAMETRELER:
    1. 1-3 Ay: Oryantasyon ve Kurumsal Uyum.
    2. 3-9 Ay: Klinik Derinleşme ve Veli Güven İnşası.
    3. 9-12 Ay: Kurumsal Katma Değer ve Liderlik Potansiyeli.
    
    ÇIKTI: JSON formatında, her dönem için skorlar ve betimsel "Nöral İçgörüler" üret.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `PROJEKSIYON TALEBI: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, report: candidate.report })}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 2048 },
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
                  parentTrustIndex: { type: Type.NUMBER },
                  insight: { type: Type.STRING },
                  risks: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            finalPrediction: {
              type: Type.OBJECT,
              properties: {
                retentionProbability: { type: Type.NUMBER },
                burnoutRiskPoint: { type: Type.STRING, description: "Tükenmişlik riski olan ay" },
                suggestedRole: { type: Type.STRING },
                strategicAdvice: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Projeksiyon Hatası:", error);
    return null;
  }
};

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const modelName = "gemini-3-flash-preview";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti ve Liyakat Müfettişi.
    HEDEF: Adayın profesyonel DNA'sını 10 KRİTİK BOYUT üzerinden analiz et.
    DİSİPLİN: Çıktı tamamen TÜRKÇE, resmi ve akademik olmalıdır. JSON formatında yanıt ver.
  `;

  try {
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

export const runStresSimulation = async (candidate: Candidate, testType: ClinicalTestType = ClinicalTestType.DMP_STRESS): Promise<SimulationResult> => {
  const modelName = "gemini-3-flash-preview";

  const testPrompts: Record<string, string> = {
    [ClinicalTestType.BEP_ADAPTATION]: "Vaka BEP/İEP hazırlama, dinamik hedefleri revize etme ve akademik dürüstlük üzerine olmalı.",
    [ClinicalTestType.BOUNDARY_INTEGRITY]: "Vaka öğretmen-veli arasındaki sınır ihlalleri, duygusal manipülasyon ve profesyonel mesafe üzerine olmalı.",
    [ClinicalTestType.CONFLICT_MANAGEMENT]: "Vaka multidisipliner ekip içindeki (fizyoterapist-psikolog vb.) görüş ayrılıkları ve çözümleme üzerine olmalı.",
    [ClinicalTestType.DATA_LITERACY]: "Vaka klinik raporların yanlış yorumlanması veya veri temelli olmayan kararların riskleri üzerine olmalı.",
    [ClinicalTestType.COGNITIVE_FLEXIBILITY]: "Vaka seans sırasında beklenmedik bir kriz karşısında metodolojiyi saniyeler içinde değiştirme yetisi üzerine olmalı.",
    [ClinicalTestType.DMP_STRESS]: "Vaka doğrudan seans içi fiziksel kriz veya ağır agresyon yönetimi üzerine olmalı."
  };

  const systemInstruction = `
    ROL: Yeni Gün Akademi Klinik Süpervizörü ve Stres Testi Mimarı.
    HEDEF: Adayın zayıf yönlerini sarsacak, etik ikilemler içeren bir TÜRKÇE kriz senaryosu üret.
    
    KURAL: 
    - Yanıt kesinlikle TÜRKÇE olmalıdır.
    - 'clinicalTruths' ve 'criticalMistakes' alanları, 2-3 cümlelik, neden-sonuç odaklı betimsel paragraflar olmalıdır. Sadece madde işareti kullanma.
    - JSON formatını asla bozma.
    - Test Türü: ${testType}.
    - Senaryo Odağı: ${testPrompts[testType] || testPrompts[ClinicalTestType.DMP_STRESS]}
  `;

  try {
    const simulationInput = {
      name: candidate.name,
      branch: candidate.branch,
      experience: candidate.experienceYears,
      answers: candidate.answers,
      allTrainings: candidate.allTrainings
    };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `ADAY PROFILI VE TEST TIPI: ${JSON.stringify({ input: simulationInput, testType })}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 2048 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING, description: "Krizin detaylı betimlemesi" },
            parentPersona: { type: Type.STRING, description: "Velinin veya vakanın psikolojik profili" },
            candidateResponse: { type: Type.STRING, description: "Adayın göstermesi beklenen olası nöral tepki" },
            stressLevel: { type: Type.NUMBER },
            aiEvaluation: {
              type: Type.OBJECT,
              properties: {
                ethicalBoundaryScore: { type: Type.NUMBER },
                empathyCalibration: { type: Type.NUMBER },
                professionalDistance: { type: Type.NUMBER },
                crisisResolutionEfficiency: { type: Type.NUMBER },
                clinicalTruths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Adayın sergilediği profesyonel doğruların açıklamalı anlatımı" },
                criticalMistakes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Adayın düştüğü riskli tuzakların açıklamalı anlatımı" }
              }
            }
          }
        }
      }
    });

    const cleanText = response.text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(cleanText);
  } catch (error: any) {
    console.error("Klinik Lab Hatası:", error);
    throw error;
  }
};
