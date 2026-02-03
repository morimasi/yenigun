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

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Denetçi ve Strateji Uzmanı.
    GÖREV: Personelin 80 soruluk "Liyakat Matrisi" cevaplarını analiz et.
    MODEL: Gemini 3 Flash Multimodal Thinking.
    
    ANALİZ KRİTERLERİ:
    1. aiTag SEMANTİĞİ: Cevaplardaki etiketleri (Örn: radical_honesty, flexible_pedagogy) personelin mesleki kimliğini tanımlamak için kullan.
    2. KLİNİK KORELASYON: ABA cevapları ile Akademik cevaplar arasındaki metodolojik tutarlılığı sorgula.
    3. EKİP UYUMU: Team ve Crisis modüllerindeki cevaplara göre adayın "Mentor" mu yoksa "Bireysel Uzman" mı olduğunu belirle.
    4. PROJEKSİYON: 24 aylık bir gelişim ivmesi ve burnout riski hesapla.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ text: `PERSONEL DOSYASI: ${JSON.stringify(candidate)}` }], 
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
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
                workEthics: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } }, required: ["score", "reasoning"] },
                technicalExpertise: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } }, required: ["score", "reasoning"] },
                pedagogicalAnalysis: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } }, required: ["score", "reasoning"] },
                leadership: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } }, required: ["score", "reasoning"] }
             },
             required: ["workEthics", "technicalExpertise", "pedagogicalAnalysis", "leadership"]
          }
        }
      }
    }
  });

  const parsed = extractPureJSON(response.text);
  if (!parsed) throw new Error("AI_ENGINE_JSON_FAIL");
  return parsed;
};