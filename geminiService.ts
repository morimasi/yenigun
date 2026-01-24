
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

export const generateNeuralProjection = async (candidate: Candidate): Promise<any> => {
  const modelName = "gemini-3-flash-preview";
  const systemInstruction = `
    ROL: Yeni Gün Akademi Nöral Projeksiyon Ünitesi.
    GÖREV: Adayın 12 aylık profesyonel gelişimini analiz et.
    KURAL: Yanıt sadece geçerli bir JSON olmalıdır. Metin içinde çift tırnak kullanma.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `PROJEKSIYON: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, report: candidate.report })}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingBudget: 1024 }
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
    
    ANALİZ KATMANLARI:
    1. Senaryo: Çok katmanlı, etik ikilem içeren kriz.
    2. Nöral Diverjans: Adayın mülakat verileriyle bu krizdeki tepkisi arasındaki çelişkiyi (Contradiction Index) hesapla.
    3. Mikro-Davranışlar: Adayın o anki sanal "Ses Tonu", "Göz Kontrolü" ve "Sessizlik Eşiği" tahminlerini yap.
    
    KURAL: 
    - Yanıt SADECE JSON olmalıdır. 
    - Metin içinde çift tırnak (") kullanma, gerekirse (') kullan. 
    - clinicalTruths ve criticalMistakes alanları EN AZ 3'er adet derinlemesine betimsel cümle içermelidir.
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

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const modelName = "gemini-3-flash-preview";
  const systemInstruction = `ROL: Yeni Gün Akademi Baş Analisti. JSON döndür.`;
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `ADAY: ${JSON.stringify(candidate)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return cleanAndParseJSON(response.text);
  } catch (error: any) { throw error; }
};
