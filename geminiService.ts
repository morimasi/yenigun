
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v19.0 (ACADEMIC FOCUS)
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("AUTH_MISSING: Analiz motoru için geçerli bir anahtar bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const toneSettings = {
    strict: {
      budget: 24576,
      baseInstruction: "TON: RIJIT, SORGULAYICI, SÜPER-DENETÇİ. PERSPEKTİF: CV şişirme ve müfredat bilgisindeki yüzeyselliği yakala."
    },
    balanced: {
      budget: 16384,
      baseInstruction: "TON: DENGELİ, PROFESYONEL, OBJEKTİF. PERSPEKTİF: Akademik donanım ve klinik sağduyuyu dengeli tart."
    },
    empathetic: {
      budget: 8192,
      baseInstruction: "TON: GELİŞİM ODAKLI, EMPATİK. PERSPEKTİF: Potansiyel ve öğretme heyecanına odaklan."
    }
  };

  const selectedTone = toneSettings[config.aiTone] || toneSettings.balanced;
  const persona = config.aiPersona || { skepticism: 50, empathy: 50, formality: 70 };

  const systemInstruction = `
    ROL: Yeni Gün Akademi Üst Kurul Bilimsel Süpervizörü ve Müfredat Denetçisi.
    GÖREV: Adayın akademik liyakatini (özellikle 1-4. sınıf müfredat bilgisini), klinik derinliğini ve profesyonel kimliğini analiz et.
    DİL: Türkçe.
    
    ÖZEL KRİTER: Adayın Türkçe, Matematik ve Hayat Bilgisi konularındaki basitleştirme (özel eğitime uyarlama) becerisini titizlikle değerlendir. Hatalı akademik bilgi içeren veya öğretim stratejisi zayıf olan adayları puanlamada cezalandır.

    PERSONA KALİBRASYONU (0-100 Ölçeğinde):
    - Şüphecilik Seviyesi: %${persona.skepticism}
    - Empati Derinliği: %${persona.empathy}
    - Resmiyet Ölçeği: %${persona.formality}

    STRATEJİK AĞIRLIKLAR:
    - Etik Bütünlük: %${config.aiWeights.ethics}
    - Klinik Muhakeme ve Müfredat Bilgisi: %${config.aiWeights.clinical}
    - Deneyim/Donanım: %${config.aiWeights.experience}
    - Kurumsal Uyum: %${config.aiWeights.fit}

    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const contents: any = { 
      parts: [
        { text: `Aday Profili ve Yanıtları (Müfredat Soruları Dahil): ${JSON.stringify({
            name: candidate.name,
            branch: candidate.branch,
            experience: candidate.experienceYears,
            trainings: candidate.allTrainings,
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
      model: "gemini-3-flash-preview",
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
            recommendation: { type: Type.STRING, description: "Mülakat kararı ve akademik yetkinlik notu" },
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
    console.error("Flash Academic Engine Hatası:", error);
    throw error;
  }
};
