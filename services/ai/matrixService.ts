
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    status: { type: Type.STRING },
    reasoning: { type: Type.STRING, description: "Bu skorun adayın hangi spesifik metodolojik cevaplarına dayandığının klinik analizi. Neden bu puan verildi?" },
    behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cevaplarda saptanan mikrodavranış ve metodolojik tutum emareleri." },
    institutionalImpact: { type: Type.STRING, description: "Bu yetkinlik düzeyinin kurum kültürü ve vaka başarı oranları üzerindeki 12 aylık somut etkisi." },
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    risks: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["score", "status", "reasoning", "behavioralIndicators", "institutionalImpact", "pros", "cons", "risks"]
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Karar Destek Uzmanı.
    MODEL: Gemini 3 Flash Thinking Mode.
    
    ANALİZ KRİTERLERİ (GENİŞLETİLMİŞ):
    1. KLİNİK ÇAPRAZ SORGULAMA: Adayın iddia ettiği sertifikalar ile doğrulama sorularına (vq_*) verdiği "radio" yanıtlarını karşılaştır.
    2. DEMOGRAFİK RİSK ANALİZİ: Adayın yaşı, medeni durumu ve deneyim yılı verilerini "Kurumsal Stabilite" (Retention) açısından değerlendir.
       - Bekar ve çok genç adaylar için eğitim hızı vs. sirkülasyon riski.
       - Evli ve deneyimli adaylar için uzun vadeli sadakat vs. tükenmişlik direnci.
    3. METODOLOJİK TUTARLILIK: ABA, Floortime veya WISC gibi ekoller arasındaki teorik çelişkileri denetle.
    
    VERİ GİRİŞİ: ${JSON.stringify(candidate)}
    
    DİL: Akademik, sert, analitik ve kesin hüküm içeren bir üslup kullan.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      integrityIndex: { type: Type.NUMBER },
      socialMaskingScore: { type: Type.NUMBER },
      summary: { type: Type.STRING },
      detailedAnalysisNarrative: { type: Type.STRING, description: "Adayın genel akademik ve klinik karakterinin 300 kelimelik derin analizi." },
      recommendation: { type: Type.STRING },
      predictiveMetrics: {
        type: Type.OBJECT,
        properties: {
          retentionProbability: { type: Type.NUMBER },
          burnoutRisk: { type: Type.NUMBER },
          learningVelocity: { type: Type.NUMBER },
          leadershipPotential: { type: Type.NUMBER },
          evolutionPath: { type: Type.STRING, description: "Adayın kurumdaki 2. yılında geleceği muhtemel profesyonel seviye tahmini." }
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
          // Fixed invalid items schema for weaknesses
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
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAY VERİLERİ VE KLİNİK YANITLAR: ${JSON.stringify(candidate)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: responseSchema
    }
  });

  return JSON.parse(response.text || '{}');
};
