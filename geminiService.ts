
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v24.0 (DEEP INSIGHT ENGINE)
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("AUTH_MISSING: Analiz motoru için geçerli bir API anahtarı bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const toneSettings = {
    strict: {
      budget: 32768,
      baseInstruction: "TON: RİJİT, SORGULAYICI, AKADEMİK DENETÇİ. PERSPEKTİF: Müfredat bilgisindeki ve uygulama stratejisindeki en ufak tutarsızlığı yakala. Standartların altındaysa tolerans gösterme."
    },
    balanced: {
      budget: 32768,
      baseInstruction: "TON: PROFESYONEL, DENGELİ, NESNEL. PERSPEKTİF: Akademik donanım ve klinik sağduyuyu objektif verilerle tart."
    },
    empathetic: {
      budget: 24576,
      baseInstruction: "TON: GELİŞİM ODAKLI, YAPICI. PERSPEKTİF: Mevcut eksiğinden ziyade gelişim potansiyeline ve kurum kültürüne uyumuna odaklan."
    }
  };

  const selectedTone = toneSettings[config.aiTone] || toneSettings.balanced;

  const systemInstruction = `
    ROL: Yeni Gün Akademi Akademik Denetleme ve Liyakat Kurulu Başkanı.
    GÖREV: Adayın akademik yetkinliğini, pedagojik uygulama becerilerini ve sahip olduğu teknik sertifikaların kalitesini analiz et.
    DİL: Türkçe.
    
    ANALİZ KURALLARI:
    1. AKADEMİK DERİNLİK: Matematik, Türkçe, Sosyal ve Dil alanlarındaki 'answers' verisini klinik düzeyde incele.
    2. ETKİ ANALİZİ: Her değerlendirme alanı için adayın bu özelliğinin kurum üzerindeki "Kısa Vadeli Etki" (shortTermImpact) ve "Uzun Vadeli Sonuç" (longTermImplication) tahminlerini yap.
    3. SERTİFİKA VALIDASYONU: 'allTrainings' listesindeki eğitimlerin branşla uyumunu denetle.
    4. GELİŞİM ÖNERİSİ: Aday işe alınırsa hangi alanlarda "supervision" alması gerektiğini belirt.

    ${selectedTone.baseInstruction}
    
    FORMAT: Kesinlikle geçerli JSON döndür.
  `;

  // Segment şeması tanımı (Tekrarı önlemek için)
  const segmentSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      comment: { type: Type.STRING },
      keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
      shortTermImpact: { type: Type.STRING, description: "İlk 3 ayda sınıfa ve kuruma yansıyacak doğrudan etki." },
      longTermImplication: { type: Type.STRING, description: "1 yıl sonunda adayın mesleki evrimi ve kurumsal risk/fayda projeksiyonu." }
    },
    required: ["score", "comment", "keyPoints", "shortTermImpact", "longTermImplication"]
  };

  try {
    const contents: any = { 
      parts: [
        { text: `Aday Profili ve Verileri: ${JSON.stringify({
            name: candidate.name,
            branch: candidate.branch,
            experience: candidate.experienceYears,
            allTrainings: candidate.allTrainings,
            answers: candidate.answers,
            weights: config.aiWeights
          })}` }
      ] 
    };

    if (candidate.cvData) {
      contents.parts.push({
        inlineData: {
          mimeType: candidate.cvData.mimeType,
          data: candidate.cvData.base64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: selectedTone.budget },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            detailedAnalysis: {
              type: Type.OBJECT,
              properties: {
                ethics: segmentSchema,
                pedagogy: segmentSchema,
                clinicalWisdom: segmentSchema,
                emotionalResilience: segmentSchema,
                institutionalFit: segmentSchema,
                stressResponse: segmentSchema
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
            competencies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ["score", "summary", "recommendation", "detailedAnalysis", "swot", "competencies"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("AI Engine Error:", error);
    throw new Error(`AI_ANALYSIS_FAILED: ${error.message}`);
  }
};
