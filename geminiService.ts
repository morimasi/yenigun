
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Multimodal Persepsiyon ve Nöral Muhakeme Servisi
 * Flash: Multimodal & Hızlı Algı
 * Pro: Derin Karar Mekanizması & Psikolojik Modelleme
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY_MISSING");
  const ai = new GoogleGenAI({ apiKey });
  
  // Doküman varsa Multimodal yetenekleri için Flash kullanıyoruz
  const hasMultimodal = !!candidate.cvData?.base64;
  const modelName = "gemini-3-pro-preview"; // Liyakat analizi yüksek muhakeme gerektirir

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti ve Liyakat Müfettişi.
    HEDEF: Adayın 10 boyutlu profesyonel profilini cerrahi bir titizlikle çıkar.
    
    ANALİZ BOYUTLARI:
    1. Kişilik/Mizaç, 2. Resmiyet/Kurumsallık, 3. Veli-Öğrenci İlişkileri, 4. Sürdürülebilirlik/Burnout, 
    5. Gelişime Açıklık, 6. Eleştiriye Açıklık, 7. İş Ahlakı, 8. Pedagojik Analiz, 
    9. Alan Yeterliliği, 10. Kurumsal Sadakat.

    MULTIMODAL GÖREV: Eğer aday CV/Belge yüklediyse, belgenin tasarım disiplinini, organizasyon şemasını ve görsel profesyonelliğini "Kişilik" ve "Resmiyet" skorlarına dahil et.
    
    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const parts: any[] = [{ text: `ADAY VERİLERİ: ${JSON.stringify(candidate)}` }];
    if (candidate.cvData?.base64) {
      parts.push({ 
        inlineData: { 
          data: candidate.cvData.base64, 
          mimeType: candidate.cvData.mimeType || 'image/jpeg' 
        } 
      });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // Pro modelde yüksek muhakeme için thinking bütçesi ayrılıyor
        thinkingConfig: { thinkingBudget: 30000 },
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
          definitions: {
            segment: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                status: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                risks: { type: Type.ARRAY, items: { type: Type.STRING } },
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
