
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v18.0 (MULTIMODAL FLASH ENGINE)
 * Sadece Gemini 3 Flash Preview kullanarak hızlı ve derinlemesine multimodal analiz sağlar.
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("AUTH_MISSING: Analiz motoru için geçerli bir anahtar bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Gemini 3 Flash için optimize edilmiş düşünme bütçeleri (Max: 24576)
  const toneSettings = {
    strict: {
      budget: 24576,
      baseInstruction: "TON: RIJIT, SORGULAYICI, SÜPER-DENETÇİ. PERSPEKTİF: CV şişirme ve maskeleme belirtilerini bir dedektif titizliğiyle yakala."
    },
    balanced: {
      budget: 16384,
      baseInstruction: "TON: DENGELİ, PROFESYONEL, OBJEKTİF. PERSPEKTİF: Güçlü yanlar ve riskleri bilimsel bir objektiflikle tart."
    },
    empathetic: {
      budget: 8192,
      baseInstruction: "TON: GELİŞİM ODAKLI, EMPATİK. PERSPEKTİF: Potansiyel, öğrenme çevikliği ve kültürel değerlere odaklan."
    }
  };

  const selectedTone = toneSettings[config.aiTone] || toneSettings.balanced;
  const persona = config.aiPersona || { skepticism: 50, empathy: 50, formality: 70 };

  const systemInstruction = `
    ROL: Yeni Gün Akademi Üst Kurul Bilimsel Süpervizörü.
    GÖREV: Adayın akademik liyakatini, klinik derinliğini ve profesyonel kimliğini analiz et.
    DİL: Türkçe.
    MODEL KARAKTERİ: Multimodal Flash (Hızlı, Çevik, Korelasyonel).
    
    ${selectedTone.baseInstruction}

    PERSONA KALİBRASYONU (0-100 Ölçeğinde):
    - Şüphecilik Seviyesi: %${persona.skepticism} (Cevaplardaki tutarsızlıklara odaklanma şiddeti)
    - Empati Derinliği: %${persona.empathy} (Adayın insani ve duygusal potansiyelini değerlendirme hassasiyeti)
    - Resmiyet Ölçeği: %${persona.formality} (Raporun dilindeki akademik ve kurumsal ciddiyet seviyesi)

    STRATEJİK AĞIRLIKLAR:
    - Etik Bütünlük: %${config.aiWeights.ethics}
    - Klinik Muhakeme: %${config.aiWeights.clinical}
    - Deneyim/Donanım: %${config.aiWeights.experience}
    - Kurumsal Uyum: %${config.aiWeights.fit}

    ÖNEMLİ: Analiz dilini seçilen persona metriklerine göre şekillendir. Gemini 3 Flash multimodal yeteneklerini kullanarak hem CV verilerini hem de senaryo yanıtlarını çapraz kontrol et.

    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const contents: any = { 
      parts: [
        { text: `Aday Profili ve Yanıtları: ${JSON.stringify({
            name: candidate.name,
            branch: candidate.branch,
            experience: candidate.experienceYears,
            trainings: candidate.allTrainings,
            answers: candidate.answers,
            weights: config.aiWeights
          })}` }
      ] 
    };

    // Eğer CV verisi varsa multimodal olarak ekle
    if (candidate.cvData) {
      contents.parts.push({
        inlineData: {
          mimeType: candidate.cvData.mimeType,
          data: candidate.cvData.base64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Kullanıcı talebi üzerine sadece Flash modeli
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: selectedTone.budget },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Genel liyakat katsayısı (0-100)" },
            summary: { type: Type.STRING, description: "Kritik stratejik icra özeti" },
            recommendation: { type: Type.STRING, description: "Mülakat kararı ve temel yönetim tavsiyesi" },
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

    if (!response.text) throw new Error("AI Engine yanıt üretemedi.");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Flash Persona Analiz Hatası:", error);
    throw error;
  }
};
