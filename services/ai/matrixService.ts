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
    
    // Fail-safe default objects
    if (!parsed.deepAnalysis) parsed.deepAnalysis = {};
    if (!parsed.predictiveMetrics) parsed.predictiveMetrics = {};
    if (!parsed.interviewGuidance) parsed.interviewGuidance = {};
    
    return parsed;
  } catch (e) { 
    console.error("JSON Extraction Error:", e);
    return null; 
  }
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Denetçi ve Strateji Uzmanı.
    GÖREV: Adayın 80+ soruluk mülakat verilerini 4 ana boyutta (MATRIX, DNA, PREDICTIONS, STRATEGY) derinlemesine analiz et.
    
    ANALİZ PROTOKOLLERİ:
    1. MATRIX: Her klinik boyutu (Etik, ABA, Pedagoji vb.) "Nedensellik" ilkesiyle açıkla. Adayın hangi cevabı neden kritik bir risk veya artı değer taşıyor?
    2. DNA: Sosyal Maskeleme skoru yüksekse (her şeye "ideal" cevap vermişse), dürüstlük endeksini düşür ve karakterindeki "pasif-agresif" veya "otorite bağımlısı" emareleri yakala.
    3. PREDICTIONS: 24 aylık bir simülasyon yap. İlk 6 ay (Adaptasyon), 12. ay (Plato), 24. ay (Kıdem). Burnout riski nerede yükseliyor?
    4. STRATEGY: Mülakatta adayı terletecek 5 "Taktik Soru" üret. Bu sorular adayın en zayıf bulduğun noktasına (örn: etik esneklik) odaklanmalı.
    
    DİL: Akademik, sert, direkt ve sonuç odaklı.
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
          workEthics: { 
            type: Type.OBJECT, 
            properties: { 
              score: { type: Type.NUMBER }, 
              status: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "status", "reasoning", "pros", "risks", "behavioralIndicators"]
          },
          technicalExpertise: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
          pedagogicalAnalysis: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
          institutionalLoyalty: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
          sustainability: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, risks: { type: Type.ARRAY, items: { type: Type.STRING } } } }
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
    required: ["score", "integrityIndex", "socialMaskingScore", "summary", "predictiveMetrics"]
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
  if (!parsed) throw new Error("AI_JSON_PARSE_FAILED");
  return parsed;
};