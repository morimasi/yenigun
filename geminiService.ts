
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v21.0 (ACADEMIC & PEDAGOGY FOCUS)
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
      baseInstruction: "TON: RIJIT, SORGULAYICI, AKADEMIK DENETÇI. PERSPEKTİF: Müfredat bilgisindeki en ufak tutarsızlığı yakala."
    },
    balanced: {
      budget: 16384,
      baseInstruction: "TON: PROFESYONEL, DENGELİ. PERSPEKTİF: Akademik donanım ve klinik sağduyuyu tart."
    },
    empathetic: {
      budget: 8192,
      baseInstruction: "TON: GELİŞİM ODAKLI. PERSPEKTİF: Potansiyele odaklan."
    }
  };

  const selectedTone = toneSettings[config.aiTone] || toneSettings.balanced;

  const systemInstruction = `
    ROL: Yeni Gün Akademi Akademik Denetleme Kurulu Başkanı.
    GÖREV: Adayın 1-4. sınıf seviyesindeki müfredat hakimiyetini, ders sunum becerilerini (pedagoji) ve özel eğitim uyarlama (modifikasyon) kabiliyetini analiz et.
    DİL: Türkçe.
    
    ANALİZ KRİTERLERİ (KRİTİK):
    1. AKADEMİK DOĞRULUK: Matematik, Türkçe ve Hayat Bilgisi sorularına verdiği yanıtların bilimsel ve müfredat doğruluğunu kontrol et.
    2. PEDAGOJİK SUNUM: Karmaşık konuları (Kesirler, Eş Sesli Kelimeler vb.) somutlaştırma ve öğrenciye aktarma becerisini puanla. 
    3. ÖZEL EĞİTİM UYARLAMASI: VAKT, CRA, Hata Ayıklama gibi teknikleri doğru bağlamda kullanıp kullanmadığını denetle.
    4. ETİK & PROFESYONELLİK: Klinik vakalardaki etik duruşunu ölç.

    Adayın 'academic_proficiency' altındaki yanıtları, liyakat skorunun en az %40'ını belirlemelidir. Hatalı pedagojik yaklaşım sergileyen adayları 'Red' tavsiyesiyle işaretle.

    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const contents: any = { 
      parts: [
        { text: `Aday Verileri ve Akademik Yanıtlar: ${JSON.stringify({
            name: candidate.name,
            branch: candidate.branch,
            answers: candidate.answers, // Burası tüm yeni akademik soruları içerir
            experience: candidate.experienceYears,
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
            score: { type: Type.NUMBER, description: "Genel liyakat puanı (0-100)" },
            summary: { type: Type.STRING, description: "Stratejik akademik özet" },
            recommendation: { type: Type.STRING, description: "Karar ve geliştirme önerisi" },
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

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Engine Academic Analysis Error:", error);
    throw error;
  }
};
