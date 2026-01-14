
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v22.0 (ENHANCED ACADEMIC ANALYSIS)
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
      baseInstruction: "TON: RIJIT, SORGULAYICI, AKADEMIK DENETÇI. PERSPEKTİF: Müfredat bilgisindeki ve uygulama stratejisindeki en ufak tutarsızlığı yakala."
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
    GÖREV: Adayın akademik yetkinliğini, pedagojik uygulama becerilerini ve sahip olduğu teknik sertifikaların kalitesini analiz et.
    DİL: Türkçe.
    
    ANALİZ KRİTERLERİ (KRİTİK):
    1. AKADEMİK UYGULAMA ANALİZİ: Adayın Matematik, Türkçe, Sosyal ve Dil alanlarındaki 'answers' verisini derinlemesine incele. Doğru şıkkın yanı sıra seçilen yanlış şıkların (çeldiricilerin) niteliğini de analiz et. Yüzeysel veya kuralcı (ezberci) yaklaşımları tespit et.
    2. SERTİFİKA VE TEKNİK DONANIM: Adayın seçtiği 'allTrainings' listesindeki tekniklerin branşıyla uyumunu değerlendir. 
    3. PEDAGOJİK SOMUTLAŞTIRMA: Soyut kavramları özel gereksinimli çocuklara aktarma metodolojisindeki yaratıcılığı ve bilimsel dayanağı ölç.
    4. KLİNİK MUHAKEME: Kriz anları ve etik ikilemlerdeki soğukkanlı ve çocuk merkezli duruşu puanla.

    Özellikle akademik sorularda "uygulama odaklı" şıkların seçilip seçilmediği liyakat puanının temelidir.

    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const contents: any = { 
      parts: [
        { text: `Aday Verileri: ${JSON.stringify({
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
            summary: { type: Type.STRING, description: "Stratejik akademik ve teknik özet" },
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
    console.error("AI Engine Analysis Error:", error);
    throw error;
  }
};
