
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    status: { type: Type.STRING },
    reasoning: { type: Type.STRING, description: "Bu puanın adayın hangi metodolojik yanıtlarına ve klinik literatüre dayandığının analizi." },
    behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cevaplarda saptanan mikrodavranış ve metodolojik tutum emareleri." },
    institutionalImpact: { type: Type.STRING, description: "Bu adayın kurumda çalışması durumunda vaka başarı oranları ve klinik kalite üzerindeki 12 aylık etkisi." },
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    risks: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["score", "status", "reasoning", "behavioralIndicators", "institutionalImpact", "pros", "cons", "risks"]
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Karar Destek Uzmanı ve Akademik Akreditasyon Denetçisi.
    MODEL: Gemini 3 Flash Deep Analysis Engine.
    
    ANALİZ PROTOKOLÜ (KLİNİK OTOPSİ):
    1. SERTİFİKA DOĞRULAMA (Kritik): Adayın 'allTrainings' listesindeki her sertifika için 'answers' içindeki 'vq_' ile başlayan soruları çapraz sorgula. 
       - Sertifikası olup 'vq_' sorusunda hatalı veya yüzeysel yanıt veren adayda 'socialMaskingScore' (Maskeleme) katsayısını %30 artır.
       - Sertifika beyanına rağmen temel terminolojiyi yanlış kullanan adayları 'Kritik Risk' olarak işaretle.

    2. DİKEY ALAN ANALİZİ:
       - OSB: ABA, ESDM, ETEÇOM bilgisi.
       - ÖÖG: PASS, DISREK, PREP bilgisi.
       - AKADEMİK: Okuma-yazma müdahalesi (Orton-Gillingham vb.) ve Diskalkuli bilgisi.
       - PSİKOLOJİ: Oyun terapisi ve BDT temelli sınırlar.

    3. YARGI TONU: Sert, akademik, kanıta dayalı ve prediktif. Sadece mevcut hali değil, kurumdaki 2. yılını tahmin et.

    DİL: Tamamen Türkçe.
  `;

  const responseSchema = {
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
          evolutionPath: { type: Type.STRING, description: "Adayın 2 yıl sonraki akademik yetkinlik projeksiyonu." }
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
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAY VERİLERİ (BEYANLAR VE YANITLAR): ${JSON.stringify(candidate)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 },
      responseSchema: responseSchema
    }
  });

  return JSON.parse(response.text || '{}');
};
