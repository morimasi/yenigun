
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractPureJSON = (text: string): any => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace === -1) return null;
    let jsonStr = lastBrace > firstBrace ? cleanText.substring(firstBrace, lastBrace + 1) : cleanText.substring(firstBrace);
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (e) { 
    console.error("MIA AI Engine Failure:", e);
    return null; 
  }
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  // PARAMETRİK PERSONA ENJEKSİYONU
  const persona = config.aiPersona || { skepticismLevel: 50, innovationBias: 50, detailedReporting: true };
  // @fix: Provided a complete default weightMatrix object to resolve TypeScript "property does not exist" error on line 36.
  const weights = config.weightMatrix || { 
    clinicalExpertise: 30, 
    ethicalIntegrity: 30, 
    emotionalResilience: 15,
    institutionalLoyalty: 10,
    learningAgility: 10,
    academicPedagogy: 5
  };

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Denetçisi. 
    MİZAÇ KALİBRASYONU (PARAMETRİK): 
    - Şüphecilik Seviyesi: %${persona.skepticismLevel} (Adayın her beyanını bu oranda sorgula ve kanıt ara).
    - İnovasyon Bias: %${persona.innovationBias} (Modern/Dijital metotları savunan adaylara bu oranda ekstra liyakat tanı).
    
    ANALİZ KRİTERLERİ VE AĞIRLIKLARI:
    - Klinik Uzmanlık Önceliği: %${weights.clinicalExpertise}
    - Etik Bütünlük Hassasiyeti: %${weights.ethicalIntegrity}
    - Duygusal Dayanıklılık Beklentisi: %${weights.emotionalResilience}
    
    GÖREV: Aday verilerini bir "Klinik Dedektif" titizliğiyle işle. Yüzeysel övgüleri yasaklıyorum.
    
    KLİNİK OTOPSİ BOYUTLARI:
    1. REASONING: Aday neden bu cevabı seçti? Arkasındaki kognitif süreç nedir?
    2. CLINICAL NUANCES: Cevaptaki gizli "Tükenmişlik", "Narsisizm" veya "Ezber" emarelerini oku.
    3. TEAM IMPACT: Ekip dinamiğine "İyileştirici Antikor" mu yoksa "Zararlı Hücre" mi olarak girer?
    
    FORMAT: Kesinlikle saf JSON. Dil: Profesyonel, Keskin, Analitik Türkçe.
  `;

  const segmentSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      status: { type: Type.STRING, enum: ["OPTIMAL", "EXCEPTIONAL", "RISK", "BORDERLINE"] },
      reasoning: { type: Type.STRING },
      clinicalNuances: { type: Type.STRING },
      literatureReference: { type: Type.STRING },
      teamImpact: { type: Type.STRING },
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      risks: { type: Type.ARRAY, items: { type: Type.STRING } },
      behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["score", "status", "reasoning", "clinicalNuances", "literatureReference", "teamImpact", "pros", "risks", "behavioralIndicators"]
  };

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
          evolutionPath: { type: Type.STRING }
        }
      },
      deepAnalysis: {
        type: Type.OBJECT,
        properties: {
          technicalExpertise: segmentSchema,
          pedagogicalAnalysis: segmentSchema,
          crisisResilience: segmentSchema,
          parentStudentRelations: segmentSchema,
          workEthics: segmentSchema,
          institutionalLoyalty: segmentSchema,
          developmentOpenness: segmentSchema,
          sustainability: segmentSchema,
          cognitiveAgility: segmentSchema,
          metacognitiveAwareness: segmentSchema
        }
      }
    },
    required: ["score", "integrityIndex", "summary", "deepAnalysis"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ text: `ADAY ANALİZ DOSYASI: ${JSON.stringify(candidate)}` }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: responseSchema
    }
  });

  const parsed = extractPureJSON(response.text);
  if (!parsed) throw new Error("AI_ENGINE_PARSE_ERROR");
  return parsed;
};