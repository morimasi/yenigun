
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * HEURISTIC JSON RECOVERY (V4)
 * AI yanıtı kesilse veya kirlense bile veriyi kurtarır.
 */
const extractPureJSON = (text: string): any => {
  try {
    // 1. Temizlik: Markdown ve Monologları ayıkla
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 2. İlk '{' ve son '}' arasını bul
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1) throw new Error("Başlangıç parantezi yok.");
    
    let jsonCandidate = lastBrace !== -1 
      ? cleanText.substring(firstBrace, lastBrace + 1)
      : cleanText.substring(firstBrace); // Kesilmişse sonuna kadar al

    // 3. Otomatik Kapatma (Kesilmiş JSON'lar için)
    let openBraces = (jsonCandidate.match(/\{/g) || []).length;
    let closeBraces = (jsonCandidate.match(/\}/g) || []).length;
    
    while (openBraces > closeBraces) {
      jsonCandidate += "}";
      closeBraces++;
    }

    // 4. JSON Temizliği (Hatalı virgüller vb.)
    jsonCandidate = jsonCandidate.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    return JSON.parse(jsonCandidate);
  } catch (e) {
    console.error("Critical Neural Parse Error:", text);
    // UI'ın çökmemesi için boş ama yapısal bir fallback dön
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
    GÖREV: Adayın liyakat dosyasını DERİN MUHAKEME ile analiz et.
    DİL: Akademik Türkçe.
    FORMAT: Sadece JSON döndür. 
    STRATEJİ: Her analizi somut bir klinik nedene bağla.
  `;

  try {
    const { cvData, report, algoReport, ...candidateData } = candidate;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ text: `VERİ: ${JSON.stringify(candidateData)}` }], 
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // BÜTÇE OPTİMİZASYONU: 12k düşünme, 20k cevap alanı bırakır.
        thinkingConfig: { thinkingBudget: 12000 }, 
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
    if (!parsedData) throw new Error("JSON Kurtarılamadı");
    return parsedData;
  } catch (error) {
    console.error("AI Nöral Analiz Hatası:", error);
    throw error;
  }
};
