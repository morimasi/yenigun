
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractPureJSON = (text: string): any => {
  try {
    // Düşünme balonlarını ve markdown bloklarını temizle
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1) throw new Error("JSON Yapısı Bulunamadı");
    
    let jsonStr = cleanText.substring(firstBrace, lastBrace + 1);

    // Kapanmamış parantezleri onar
    const openCount = (jsonStr.match(/\{/g) || []).length;
    const closeCount = (jsonStr.match(/\}/g) || []).length;
    if (openCount > closeCount) jsonStr += "}".repeat(openCount - closeCount);

    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Neural Extraction Failure. Raw text length:", text.length);
    return null;
  }
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
    ROL: Yeni Gün Akademi Baş Klinik Denetçisi.
    GÖREV: Adayın liyakat dosyasını DERİN AKADEMİK MUHAKEME ile analiz et.
    KURAL: Yanıtın sonunda KESİNLİKLE sadece geçerli bir JSON objesi döndür. Düşüncelerini 'Thinking' aşamasında tut.
    ŞEMA: workEthics, technicalExpertise, pedagogicalAnalysis, parentStudentRelations, sustainability, institutionalLoyalty, developmentOpenness anahtarlarını KESİNLİKLE kullan.
  `;

  try {
    const { cvData, report, algoReport, ...candidateData } = candidate;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ text: `ANALİZ VERİSİ: ${JSON.stringify(candidateData)}` }], 
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // OPTİMİZE BÜTÇE: 8k düşünme (muhakeme için yeterli), 30k+ çıktı (JSON için güvenli)
        thinkingConfig: { thinkingBudget: 8000 }, 
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
                evolutionPath: { type: Type.STRING }
              },
              required: ["retentionProbability", "burnoutRisk", "learningVelocity", "leadershipPotential", "evolutionPath"]
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
                strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
                simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["strategicQuestions", "criticalObservations", "simulationTasks"]
            }
          },
          required: ["score", "integrityIndex", "socialMaskingScore", "summary", "detailedAnalysisNarrative", "recommendation", "predictiveMetrics", "deepAnalysis", "swot", "interviewGuidance"]
        }
      }
    });

    const parsedData = extractPureJSON(response.text);
    if (!parsedData) throw new Error("JSON Deşifre Edilemedi");
    return parsedData;
  } catch (error) {
    console.error("AI Nöral Analiz Hatası:", error);
    throw error;
  }
};
