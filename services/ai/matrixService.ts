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
    
    // Eksik alanlar için polifill
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
    GÖREV: Adayın liyakat matrisini "Klinik Otopsi" derinliğinde, sebep-sonuç ilişkili analiz et.
    
    ANALİZ BOYUTLARI (BU ID'LERİ KULLAN):
    1. technicalExpertise (Klinik Derinlik): ABA/DIR/PASS hakimiyeti ve bilimsel uygulama titizliği.
    2. pedagogicalAgility (Pedagojik Çeviklik): Öğretim stratejilerini kriz anında değiştirme hızı.
    3. crisisResilience (Kriz Direnci): Kaotik anlardaki nöral stabilite ve duygusal dayanıklılık.
    4. parentalDiplomacy (Veli Diplomasisi): Manipülatif velilere karşı sınır koruma ve ikna gücü.
    5. clinicalDocumentation (Bilimsel Kayıt): Veri tutma disiplini ve raporlama hassasiyeti.
    6. workEthics (Etik & Sınırlar): Profesyonel mesafe, dürüstlük ve kurumsal sadakat.
    7. metacognitiveAwareness (Öz-Denetim): Kendi hatalarını fark etme ve süpervizyona açıklık.
    8. cognitiveAgility (Bilişsel Adaptasyon): Yeni bilimsel metodolojilere adaptasyon kapasitesi.
    9. institutionalLoyalty (Sadakat & Uyum): Kurum vizyonuyla uzun vadeli simetrik uyum.
    10. stabilityFactor (Tükenmişlik Eşiği): Psikolojik dayanıklılık ve mesleki tükenmişlik direnci.

    HER KATEGORİ İÇİN ÜRETİLECEK VERİLER:
    - 'score': 0-100 arası liyakat puanı.
    - 'status': OPTIMAL, EXCEPTIONAL, RISK, BORDERLINE.
    - 'reasoning': Bu puanın adayın hangi cevabına ve hangi bilimsel gerçeğe dayandığı.
    - 'clinicalNuances': Cevaplardaki satır araları; aday neyi gizlemeye çalışıyor veya neyi çok iyi biliyor?
    - 'literatureReference': Yaklaşımı hangi ekol (ABA, DIR vb.) destekliyor veya yalanlıyor?
    - 'teamImpact': Bu özelliğin mevcut ekip dinamiklerine moleküler etkisi ne olur?
  `;

  const segmentSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      status: { type: Type.STRING },
      reasoning: { type: Type.STRING },
      clinicalNuances: { type: Type.STRING },
      literatureReference: { type: Type.STRING },
      teamImpact: { type: Type.STRING },
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      risks: { type: Type.ARRAY, items: { type: Type.STRING } },
      behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["score", "status", "reasoning", "clinicalNuances", "literatureReference", "teamImpact"]
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
          pedagogicalAgility: segmentSchema,
          crisisResilience: segmentSchema,
          parentalDiplomacy: segmentSchema,
          clinicalDocumentation: segmentSchema,
          workEthics: segmentSchema,
          metacognitiveAwareness: segmentSchema,
          cognitiveAgility: segmentSchema,
          institutionalLoyalty: segmentSchema,
          stabilityFactor: segmentSchema
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
    contents: [{ text: `ADAY AKADEMİK VERİ SETİ: ${JSON.stringify(candidate)}` }],
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