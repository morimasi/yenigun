
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
    if (!parsed.deepAnalysis) parsed.deepAnalysis = {};
    return parsed;
  } catch (e) { 
    console.error("MIA Matrix Engine Error:", e);
    return null; 
  }
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  // AI PERSONALITY INJECTION
  const persona = config.aiPersona || { skepticismLevel: 50, innovationBias: 50, detailedReporting: true };
  
  let skepticismPrompt = "";
  if (persona.skepticismLevel > 80) {
      skepticismPrompt = "MOD: AŞIRI ŞÜPHECİ (PARANOID AUDITOR). Adayın her beyanını sorgula, çelişkileri acımasızca ara ve kanıt yoksa puan kırma eğiliminde ol.";
  } else if (persona.skepticismLevel > 50) {
      skepticismPrompt = "MOD: DENGELİ DENETÇİ. Beyanları klinik mantıkla tart, tutarsızlık varsa belirt.";
  } else {
      skepticismPrompt = "MOD: DESTEKLEYİCİ MENTOR. Adayın potansiyeline odaklan, eksiklikleri gelişim alanı olarak gör.";
  }

  let innovationPrompt = "";
  if (persona.innovationBias > 70) {
      innovationPrompt = "YENİLİKÇİLİK ÖNCELİKLİ: Geleneksel yöntemler yerine modern/teknolojik yaklaşımları kullanan adaylara bonus puan ver.";
  }

  const detailLevel = persona.detailedReporting ? "Her analiz maddesi için en az 3 cümlelik, akademik terminoloji içeren, derinlemesine gerekçeler yaz." : "Özet ve net gerekçeler yaz.";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Denetçi (AI Supervisor).
    ${skepticismPrompt}
    ${innovationPrompt}
    ${detailLevel}
    
    ANALİZ PROTOKOLÜ (MİA MATRİSİ):
    1. KLİNİK DERİNLİK: Metodolojik sadakat ve veri disiplini.
    2. PEDAGOJİK ÇEVİKLİK: B Planı üretme ve kognitif esneklik.
    3. KRİZ DİRENCİ: Duygusal regülasyon ve profesyonel mesafe.
    4. VELİ DİPLOMASİSİ: Sınır koruma ve terapötik ittifak.
    5. ETİK & SINIRLAR: Çıkar çatışması yönetimi ve entegrite.
    6. KURUMSAL SADAKAT: Vizyon uyumu ve uzun vadeli bağlılık.
    
    Adayın cevaplarını bu lenslerden geçir ve JSON formatında raporla.
  `;

  // ... (Schema definitions remain same, ensuring strict JSON output)
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
    required: ["score", "status", "reasoning", "clinicalNuances", "literatureReference", "teamImpact", "pros", "risks"]
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
          evolutionPath: { type: Type.STRING },
          trajectory: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.NUMBER },
                meritScore: { type: Type.NUMBER },
                burnoutRisk: { type: Type.NUMBER },
                competencyLevel: { type: Type.STRING },
                strategicAdvice: { type: Type.STRING }
              }
            }
          }
        }
      },
      deepAnalysis: {
        type: Type.OBJECT,
        properties: {
          technicalExpertise: segmentSchema,
          pedagogicalAnalysis: segmentSchema, // Mapped from pedagogicalAgility
          crisisResilience: segmentSchema,
          parentStudentRelations: segmentSchema, // Mapped from parentalDiplomacy
          workEthics: segmentSchema,
          institutionalLoyalty: segmentSchema,
          developmentOpenness: segmentSchema, // Mapped from cognitiveAgility
          sustainability: segmentSchema // Mapped from stabilityFactor
        }
      },
      swot: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          threats: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      interviewGuidance: {
        type: Type.OBJECT,
        properties: {
          strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
          simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    required: ["score", "integrityIndex", "summary", "deepAnalysis", "predictiveMetrics"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ text: `ADAY VERİLERİ: ${JSON.stringify(candidate)}` }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: responseSchema
    }
  });

  const parsed = extractPureJSON(response.text);
  if (!parsed) throw new Error("MIA_AI_SCHEMA_FAILURE");
  
  // Mapping Fixes (AI returns keys that might slightly differ from UI expectations)
  if(parsed.deepAnalysis) {
      if(!parsed.deepAnalysis.pedagogicalAnalysis && parsed.deepAnalysis.pedagogicalAgility) parsed.deepAnalysis.pedagogicalAnalysis = parsed.deepAnalysis.pedagogicalAgility;
      if(!parsed.deepAnalysis.parentStudentRelations && parsed.deepAnalysis.parentalDiplomacy) parsed.deepAnalysis.parentStudentRelations = parsed.deepAnalysis.parentalDiplomacy;
      if(!parsed.deepAnalysis.developmentOpenness && parsed.deepAnalysis.cognitiveAgility) parsed.deepAnalysis.developmentOpenness = parsed.deepAnalysis.cognitiveAgility;
      if(!parsed.deepAnalysis.sustainability && parsed.deepAnalysis.stabilityFactor) parsed.deepAnalysis.sustainability = parsed.deepAnalysis.stabilityFactor;
  }

  return parsed;
};
