
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig, ClinicalTestType, SimulationResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Adayın liyakat profilini analiz eden ana motor.
 * responseSchema 10 segmentin tamamını kapsayacak şekilde genişletildi.
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const modelName = "gemini-3-flash-preview";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti ve Liyakat Müfettişi.
    HEDEF: Adayın profesyonel DNA'sını 10 KRİTİK BOYUT üzerinden analiz et.
    
    ANALİZ EDİLECEK 10 BOYUT:
    1. workEthics (İş Ahlakı): Sınır ihlalleri ve etik duruş.
    2. pedagogicalAnalysis (Pedagoji): Çocukla kurulan bağın bilimsel derinliği.
    3. parentStudentRelations (Veli Dinamiği): Veli manipülasyonuna karşı direnç.
    4. formality (Resmiyet): Kurumsal hiyerarşi ve raporlama disiplini.
    5. developmentOpenness (Gelişim): Süpervizyon ve yeni metotlara açıklık.
    6. sustainability (Direnç): Tükenmişlik riski ve stres yönetimi.
    7. technicalExpertise (Alan Yeterliliği): Branş bilgisi ve uygulama kalitesi.
    8. criticismTolerance (Eleştiri): Geri bildirimi alma ve uygulama hızı.
    9. personality (Karakter): Takım çalışması ve duygusal regülasyon.
    10. institutionalLoyalty (Sadakat): Kurumsal vizyona bağlılık düzeyi.

    DİSİPLİN: Her boyut için mutlaka 0-100 arası bir puan, en az bir güçlü yön (pros) ve bir risk (risks) üretilmelidir.
    Eğer veri kısıtlıysa, mevcut cevaplardan projeksiyon yaparak (inferring) mantıklı bir analiz sun.
  `;

  try {
    const parts: any[] = [{ text: `ADAY VERİLERİ VE CEVAPLARI: ${JSON.stringify(candidate)}` }];
    if (candidate.cvData?.base64) {
      parts.push({ 
        inlineData: { 
          data: candidate.cvData.base64, 
          mimeType: candidate.cvData.mimeType || 'image/jpeg' 
        } 
      });
    }

    // Ortak segment şeması tanımı
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
              required: [
                "workEthics", "pedagogicalAnalysis", "parentStudentRelations", 
                "formality", "developmentOpenness", "sustainability", 
                "technicalExpertise", "criticismTolerance", "personality", "institutionalLoyalty"
              ]
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
    
    const text = response.text;
    if (!text) throw new Error("AI yanıtı boş döndü.");
    return JSON.parse(text);
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
    HEDEF: Adayın geçmiş cevaplarını analiz ederek, onu en çok zorlayacak etik/klinik kriz senaryosunu üret ve muhtemel cevabını simüle et.
    ÇIKTI FORMATI: JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `ADAY VERİLERİ: ${JSON.stringify(candidate)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 2048 },
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

    const text = response.text;
    if (!text) throw new Error("Simülasyon yanıtı boş döndü.");
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Simülasyon Hatası:", error);
    throw error;
  }
};
