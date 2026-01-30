
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * NÖRAL JSON KURTARICI (V5) - HEURISTIC RECOVERY
 * AI yanıtı token limitine takılsa bile mevcut veriyi geçerli bir JSON'a dönüştürür.
 */
const extractPureJSON = (text: string): any => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1) return null;
    
    let jsonStr = lastBrace > firstBrace 
      ? cleanText.substring(firstBrace, lastBrace + 1)
      : cleanText.substring(firstBrace);

    // Otomatik Kapatma Döngüsü (Eksik parantezleri tamamla)
    let openCount = (jsonStr.match(/\{/g) || []).length;
    let closeCount = (jsonStr.match(/\}/g) || []).length;
    while (openCount > closeCount) {
      jsonStr += "}";
      closeCount++;
    }

    // Yarım kalan array/string hatalarını temizle
    jsonStr = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Parse Error. Raw text head:", text.substring(0, 100));
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
    GÖREV: Adayın dosyasını PARÇALA ve liyakat matrisine dönüştür.
    KURAL 1: Sadece JSON döndür. 
    KURAL 2: 'workEthics', 'technicalExpertise', 'pedagogicalAnalysis', 'parentStudentRelations', 'sustainability', 'institutionalLoyalty', 'developmentOpenness' anahtarlarını KESİNLİKLE doldur.
    KURAL 3: Düşüncelerini 'Think' katmanında tut, JSON içinde asla yorum yapma.
  `;

  try {
    const { cvData, report, algoReport, ...candidateData } = candidate;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ text: `VERİ PAKETİ: ${JSON.stringify(candidateData)}` }], 
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // IQ-DENGESİ: 5k düşünme (yeterli), 35k cevap (JSON güvenliği için geniş)
        thinkingConfig: { thinkingBudget: 5000 }, 
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
    if (!parsedData) throw new Error("ANALİZ MOTORU VERİYİ MÜHÜRLEYEMEDİ.");
    return parsedData;
  } catch (error) {
    console.error("AI Matrix Engine Crash:", error);
    throw error;
  }
};
