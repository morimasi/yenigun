
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanAndParseJSON = (rawText: string | undefined): any => {
  if (!rawText) throw new Error("AI yanıtı boş.");
  let cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch (inner) {
        let fixed = jsonMatch[0];
        const opens = (fixed.match(/\{/g) || []).length;
        const closes = (fixed.match(/\}/g) || []).length;
        if (opens > closes) fixed += "}".repeat(opens - closes);
        return JSON.parse(fixed);
      }
    }
    throw e;
  }
};

const FALLBACK_REPORT: AIReport = {
  score: 1,
  integrityIndex: 50,
  socialMaskingScore: 50,
  summary: "Nöral analiz motoru zaman aşımına uğradı. Lütfen tekrar deneyiniz.",
  detailedAnalysisNarrative: "Düşünme süreci beklenenden uzun sürdü.",
  recommendation: "Tekrar Analiz Et",
  predictiveMetrics: { retentionProbability: 0, burnoutRisk: 0, learningVelocity: 0, leadershipPotential: 0, evolutionPath: "Veri Hatası" },
  deepAnalysis: {
    workEthics: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] },
    technicalExpertise: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] },
    pedagogicalAnalysis: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] },
    parentStudentRelations: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] },
    sustainability: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] },
    institutionalLoyalty: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] },
    developmentOpenness: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] },
    formality: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] },
    criticismTolerance: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] },
    personality: { score: 0, status: 'critical', reasoning: 'Hata', behavioralIndicators: [], institutionalImpact: '', pros: [], cons: [], risks: [] }
  },
  swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
  interviewGuidance: { strategicQuestions: ["Sistem hatası, lütfen yeniden başlatın."], criticalObservations: [], simulationTasks: [] }
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
    ROL: Yeni Gün Akademi Klinik Baş Denetçisi (Deep Reasoning Mode).
    GÖREV: Aday verilerini nöro-psikolojik ve klinik düzeyde analiz et. 
    STRATEJİ: Adayın mülakat maskesini düşür, cevaplarındaki metodolojik açıkları 'Think' katmanında parçala.
    DİL: Üst düzey akademik Türkçe.
  `;

  try {
    const { cvData, ...candidateClean } = candidate;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ text: `ADAY DOSYASI: ${JSON.stringify(candidateClean)}` }], 
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }, // MAKSİMUM AKILLI DÜŞÜNME
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
                pedagogicalAnalysis: SEGMENT_SCHEMA,
                parentStudentRelations: SEGMENT_SCHEMA,
                formality: SEGMENT_SCHEMA,
                developmentOpenness: SEGMENT_SCHEMA,
                sustainability: SEGMENT_SCHEMA,
                technicalExpertise: SEGMENT_SCHEMA,
                criticismTolerance: SEGMENT_SCHEMA,
                personality: SEGMENT_SCHEMA,
                institutionalLoyalty: SEGMENT_SCHEMA
              },
              required: ["workEthics", "pedagogicalAnalysis", "parentStudentRelations", "formality", "developmentOpenness", "sustainability", "technicalExpertise", "criticismTolerance", "personality", "institutionalLoyalty"]
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

    return cleanAndParseJSON(response.text);
  } catch (error) {
    console.error("AI Matrix Error:", error);
    return FALLBACK_REPORT;
  }
};
