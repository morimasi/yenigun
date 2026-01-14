
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v23.0 (PRO REASONING ENGINE)
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("AUTH_MISSING: Analiz motoru için geçerli bir API anahtarı bulunamadı.");
  }

  // Aday analizleri karmaşık muhakeme gerektirdiği için gemini-3-pro-preview kullanılması uygundur.
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
    1. AKADEMİK DERİNLİK: Matematik, Türkçe, Sosyal ve Dil alanlarındaki 'answers' verisini klinik düzeyde incele. Yanlış şıklardaki çeldiriciler üzerinden adayın "ezberci" mi yoksa "kavramsal" mı düşündüğünü belirle.
    2. SERTİFİKA VALIDASYONU: 'allTrainings' listesindeki eğitimlerin branşla uyumunu denetle (Örn: Bir Psikoloğun ABA bilmesi değerlidir, ancak temel test eğitimlerinin eksikliği risktir).
    3. KRİZ VE ETİK: Senaryolara verilen cevaplardaki "soğukkanlılık" ve "kurum aidiyeti" düzeyini ölç.
    4. GELİŞİM ÖNERİSİ: Aday işe alınırsa hangi alanlarda "supervision" alması gerektiğini belirt.

    ${selectedTone.baseInstruction}
    
    FORMAT: Kesinlikle geçerli JSON döndür.
  `;

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

    // CV verisi varsa analiz kapsamına ekle
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
            score: { type: Type.NUMBER, description: "0-100 arası liyakat puanı" },
            summary: { type: Type.STRING, description: "Yönetici özeti (Kompakt ve profesyonel)" },
            recommendation: { type: Type.STRING, description: "Nihai karar tavsiyesi" },
            detailedAnalysis: {
              type: Type.OBJECT,
              properties: {
                ethics: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                pedagogy: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                clinicalWisdom: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                emotionalResilience: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                institutionalFit: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                stressResponse: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } } }
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

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error: any) {
    console.error("AI Engine Error:", error);
    throw new Error(`AI_ANALYSIS_FAILED: ${error.message}`);
  }
};
