
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
    
    ÖZEL EĞİTİM ANALİZ HAVUZU: 
    - Davranışçı: ABA, BCBA, ESDM, OÇİDEP, PECS.
    - İlişki/Gelişimsel: DIR Floortime, ETEÇOM, Etkileşim Temelli Müdahale.
    - Bilişsel/Akademik: PASS Teorisi (CAS, PREP), Orton-Gillingham, Disleksi/Diskalkuli Protokolleri.
    - Ölçme: WISC-IV, MOXO, WJ-IV.
    
    ANALİZ PROTOKOLÜ:
    1. KLİNİK ÇAPRAZ SORGULAMA: Adayın sahip olduğunu iddia ettiği sertifikalar ile "Klinik Doğrulama Soruları"na (vq_*) verdiği metin yanıtlarını karşılaştır.
    2. METODOLOJİK TUTARLILIK: Aday hem ABA (katı davranışçı) hem Floortime (ilişki temelli) iddia ediyorsa, bu iki ekolü sentezleme yeteneğini veya çelişkisini ölç.
    3. MASKELENMİŞ CEHALET TESPİTİ: Sertifikası olan ancak teknik soruda yüzeysel/pedagojik klişe cevaplar veren adayları "Düşük Klinik Derinlik" olarak işaretle.
    4. KURUMSAL KPI TAHMİNİ: Adayın bu uzmanlık setiyle kurumdaki vaka progresini (ilerlemesini) nasıl hızlandıracağını net belirt.
    
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

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("AI Analysis Engine: Structural Parse Failure", e);
    throw new Error("Analiz raporu nöral olarak derlenemedi.");
  }
};
