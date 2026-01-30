
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * NÖRAL VERİ AYIKLAYICI (V3)
 * AI çıktısındaki gürültüyü temizler ve en derin JSON objesini kurtarır.
 */
const extractPureJSON = (text: string): any => {
  try {
    // 1. Standart temizlik
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 2. İlk parantez ve son parantez arasını bul (Thinking metni dışarıda kalsın)
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) throw new Error("JSON Yapısı Bulunamadı");
    
    let jsonCandidate = cleanText.substring(firstBrace, lastBrace + 1);

    // 3. Eksik parantez tamamlama (Klinik Kurtarma)
    const opens = (jsonCandidate.match(/\{/g) || []).length;
    const closes = (jsonCandidate.match(/\}/g) || []).length;
    if (opens > closes) jsonCandidate += "}".repeat(opens - closes);

    return JSON.parse(jsonCandidate);
  } catch (e) {
    console.error("Neural Extraction Failure:", text);
    throw new Error("AI veri akışı deşifre edilemedi.");
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
    MODEL: Gemini-3-Flash (Thinking Mode Activated).
    GÖREV: Adayın beyanlarını ve mülakat reflekslerini parçala. 
    STRATEJİ: Düşünme aşamasında (Thinking Phase) adayın her cevabını literatürle (ABA, Floortime, BEP) karşılaştır. Sonuç aşamasında KESİNLİKLE sadece saf JSON döndür.
    DİL: Akademik Türkçe.
  `;

  try {
    const { cvData, ...candidateData } = candidate;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ text: `ANALİZ EDİLECEK ADAY VERİSİ: ${JSON.stringify(candidateData)}` }], 
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }, // MAKSİMUM MUHAKEME GÜCÜ
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
                developmentOpenness: SEGMENT_SCHEMA,
                formality: SEGMENT_SCHEMA,
                criticismTolerance: SEGMENT_SCHEMA,
                personality: SEGMENT_SCHEMA
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

    return extractPureJSON(response.text);
  } catch (error) {
    console.error("AI Nöral Hata:", error);
    throw error;
  }
};
