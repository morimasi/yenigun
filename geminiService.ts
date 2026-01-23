
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY_MISSING");
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti ve Liyakat Müfettişi.
    HEDEF: Adayın 10 boyutlu profesyonel profilini cerrahi bir titizlikle çıkar.
    
    ANALİZ BOYUTLARI (FAZ 1 - Intelligence Layer):
    1. Kişilik/Mizaç, 2. Resmiyet/Kurumsallık, 3. Veli-Öğrenci İlişkileri, 4. Sürdürülebilirlik/Burnout, 
    5. Gelişime Açıklık, 6. Eleştiriye Açıklık, 7. İş Ahlakı, 8. Pedagojik Analiz, 
    9. Alan Yeterliliği, 10. Kurumsal Sadakat.

    KRİTİK GÖREV: Semantik Çapraz Sorgu. 
    Adayın "Personal" kısmındaki iddiaları ile "Vaka Analizleri" ve "Ethics" sorularındaki gerçek uygulamaları arasındaki mikro-çelişkileri yakala. 
    Örn: "Sabırlıyım" diyip kriz anında "otoriter" çözüm üreteni deşifre et.

    DÜRÜSTLÜK ENDEKSİ (IntegrityIndex): Sosyal maske takıp takmadığını ölç.
    
    DİL: Akademik, resmi, sert ama yapıcı bir Türkçe.
    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const parts: any[] = [{ text: `ADAY VERİLERİ VE CEVAPLARI: ${JSON.stringify(candidate)}` }];
    if (candidate.cvData?.base64) {
      parts.push({ inlineData: { data: candidate.cvData.base64, mimeType: candidate.cvData.mimeType || 'image/jpeg' } });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
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
            recommendation: { type: Type.STRING },
            deepAnalysis: {
              type: Type.OBJECT,
              properties: {
                personality: { $ref: "#/definitions/segment" },
                formality: { $ref: "#/definitions/segment" },
                parentStudentRelations: { $ref: "#/definitions/segment" },
                sustainability: { $ref: "#/definitions/segment" },
                developmentOpenness: { $ref: "#/definitions/segment" },
                criticismTolerance: { $ref: "#/definitions/segment" },
                workEthics: { $ref: "#/definitions/segment" },
                pedagogicalAnalysis: { $ref: "#/definitions/segment" },
                technicalExpertise: { $ref: "#/definitions/segment" },
                institutionalLoyalty: { $ref: "#/definitions/segment" }
              }
            },
            predictiveMetrics: {
              type: Type.OBJECT,
              properties: {
                retentionProbability: { type: Type.NUMBER },
                burnoutRisk: { type: Type.NUMBER },
                learningVelocity: { type: Type.NUMBER },
                leadershipPotential: { type: Type.NUMBER }
              }
            },
            interviewGuidance: {
              type: Type.OBJECT,
              properties: {
                strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
                answerAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
                simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
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
            }
          },
          // Schema helper for segments
          definitions: {
            segment: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                status: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                contradictions: { type: Type.ARRAY, items: { type: Type.STRING } },
                competencyLevel: { type: Type.STRING }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) { throw error; }
};
