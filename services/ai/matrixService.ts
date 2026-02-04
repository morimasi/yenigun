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
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Denetçi ve Stratejik İK Simülasyon Uzmanı.
    GÖREV: Adayın liyakat matrisini "Klinik Otopsi" derinliğinde analiz et.
    
    ANALİZ MATRİSİ KATEGORİLERİ:
    1. workEthics: Profesyonel sınırlar ve kurumsal sadakat.
    2. technicalExpertise: Branş hakimiyeti ve metodolojik tutarlılık.
    3. pedagogicalAgility: Öğretim stratejilerini vaka anında değiştirme hızı.
    4. crisisResilience: Beklenmedik krizlerdeki nöral stabilite.
    5. parentalDiplomacy: Manipülatif veli profillerine karşı direnç.
    6. metacognitiveAwareness: Kendi klinik hatalarını fark etme ve düzeltme yetisi.
    7. clinicalDocumentation: Veri tutma disiplini ve bilimsel raporlama dili.
    8. cognitiveAgility: Yeni bilimsel metodolojilere adaptasyon kapasitesi.
    9. institutionalLoyalty: Kurum vizyonuyla uzun vadeli simetrik uyum.
    10. stabilityFactor: Psikolojik tükenmişlik eşiği ve mesleki dayanıklılık.

    HER KATEGORİ İÇİN:
    - 'clinicalNuances': Adayın cevaplarındaki satır aralarını oku. Gizli tutumları deşifre et.
    - 'literatureReference': Adayın yaklaşımını hangi klinik ekol (ABA, DIR, PASS vb.) destekliyor veya yalanlıyor?
    - 'teamImpact': Bu özelliğin ekip dinamiklerine pozitif/negatif etkisi nedir?
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
              },
              required: ["month", "meritScore", "burnoutRisk", "competencyLevel", "strategicAdvice"]
            }
          }
        },
        required: ["retentionProbability", "burnoutRisk", "learningVelocity", "leadershipPotential", "evolutionPath", "trajectory"]
      },
      deepAnalysis: {
        type: Type.OBJECT,
        properties: {
          workEthics: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } }, behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["score", "status", "reasoning", "clinicalNuances", "literatureReference", "teamImpact"] },
          technicalExpertise: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
          pedagogicalAgility: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING } } },
          crisisResilience: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING } } },
          parentalDiplomacy: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING } } },
          metacognitiveAwareness: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING } } },
          clinicalDocumentation: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING } } },
          cognitiveAgility: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING } } },
          institutionalLoyalty: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING } } },
          stabilityFactor: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING }, clinicalNuances: { type: Type.STRING }, literatureReference: { type: Type.STRING }, teamImpact: { type: Type.STRING } } }
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
    required: ["score", "integrityIndex", "socialMaskingScore", "summary", "predictiveMetrics", "deepAnalysis"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ text: `AKADEMİK ADAY DOSYASI: ${JSON.stringify(candidate)}` }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: responseSchema
    }
  });

  const parsed = extractPureJSON(response.text);
  if (!parsed) throw new Error("MIA_AI_SCHEMA_FAILURE");
  return parsed;
};