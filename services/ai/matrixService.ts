
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
    return JSON.parse(jsonStr);
  } catch (e) { return null; }
};

const DEEP_SEGMENT_SCHEMA = {
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
    ROL: Yeni Gün Akademi Kıdemli Klinik Karar Destek Uzmanı.
    GÖREV: Adayın liyakat matrisini ve sertifikasyon derinliğini analiz et.
    
    KRİTİK ANALİZ PARAMETRELERİ (REASONING MODE):
    1. AKREDİTASYON TUTARLILIĞI: Adayın seçtiği sertifikalar (Örn: BCBA, CAS, PROMPT, Ayres SI) ile doğrulama sorularına verdiği yanıtlar arasındaki teknik uyumu ölç. Sertifika var ama soru cevabı sığ ise 'Sosyal Maskeleme' puanını yükselt.
    2. METODOLOJİK SPEKTRUM: ABA (Davranışçı) ve DIR (İlişki Temelli) gibi zıt felsefeleri aynı anda savunan adaylarda 'Bilişsel Esneklik' mi yoksa 'Metodolojik Karmaşa' mı olduğunu tespit et.
    3. EBP (KANITA DAYALI UYGULAMA): Adayın cevaplarında bilimsel literatüre (Örn: PASS Teorisi, Polivagal Teori, Motor Öğrenme İlkeleri) ne kadar atıf yaptığını analiz et.
    4. YEREL VS GLOBAL: MEB onaylı programlar ile uluslararası akreditasyonlar arasındaki yetkinlik hiyerarşisini değerlendir.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ text: `ADAY VERİLERİ: ${JSON.stringify(candidate)}` }], 
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24000 }, 
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
              workEthics: DEEP_SEGMENT_SCHEMA,
              technicalExpertise: DEEP_SEGMENT_SCHEMA,
              pedagogicalAnalysis: DEEP_SEGMENT_SCHEMA,
              parentStudentRelations: DEEP_SEGMENT_SCHEMA,
              sustainability: DEEP_SEGMENT_SCHEMA,
              institutionalLoyalty: DEEP_SEGMENT_SCHEMA,
              developmentOpenness: DEEP_SEGMENT_SCHEMA
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
        }
      }
    }
  });

  const parsed = extractPureJSON(response.text);
  if (!parsed) throw new Error("AI_ENGINE_JSON_FAIL");
  return parsed;
};
