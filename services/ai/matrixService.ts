
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    status: { type: Type.STRING },
    reasoning: { type: Type.STRING, description: "Bu puanın adayın hangi metodolojik yanıtlarına (özellikle 20 soruluk fundamental set ve dikey VQ-X soruları) dayandığının analizi." },
    behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cevaplarda saptanan mikrodavranış ve teknik tutum emareleri." },
    institutionalImpact: { type: Type.STRING, description: "Bu adayın kurumda çalışması durumunda klinik kalite ve vaka yönetimi üzerindeki 12 aylık etkisi." },
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
    
    ANALİZ PROTOKOLÜ:
    1. AKREDİTASYON DOĞRULAMA (VQ-X CHECK): Adayın 'allTrainings' listesindeki sertifikalar (ABA, CAS, WISC-V, PROMPT, Ayres SI vb.) ile mülakat sorularına verdiği yanıtları çapraz sorgula. 
       - Sertifika beyanına rağmen temel teknik terminolojiyi (Örn: ABA'da işlevsel analiz, CAS'ta PASS teorisi) yanlış işaretleyen adayların 'integrityIndex' puanını %50 düşür.
       - Bu adayları "Kâğıt Üstü Uzman" riskiyle işaretle.

    2. DİKEY ALAN YETKİNLİĞİ:
       - OSB: ABA ve DIR Floortime arasındaki ekol farkını yönetebiliyor mu?
       - ÖÖG: Akademik hedefler ile bilişsel süreçleri (PASS) entegre edebiliyor mu?
       - DKT/OT: Anatomi ve nöro-müsküler hiyerarşi bilgisi ne düzeyde?

    3. PERFORMANS PROJEKSİYONU: Adayın 2 yıllık süreçte kuruma sağlayacağı akademik katma değeri ve 'Burnout' (tükenmişlik) riskini 'resilience_team' yanıtlarına dayanarak tahmin et.

    YARGI TONU: Sert, akademik, kanıta dayalı ve prediktif. 
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
    contents: `ADAY VERİLERİ (BEYANLAR + FUNDAMENTAL 20 SORU + VQ-X YANITLARI): ${JSON.stringify(candidate)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 },
      responseSchema: responseSchema
    }
  });

  return JSON.parse(response.text || '{}');
};
