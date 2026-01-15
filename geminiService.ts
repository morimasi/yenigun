
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v25.0 (CLINICAL REASONING FOCUS)
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
      baseInstruction: `TON: RİJİT, SORGULAYICI, AKADEMİK DENETÇİ. 
        PERSPEKTİF: Adayın seçenekler arasındaki 'yüzeysel' (textbook) olanı mı yoksa 'klinik olarak doğru' olanı mı seçtiğini analiz et. 
        Müfredat bilgisini özel eğitim teknikleriyle sentezleyemeyen adaylara tolerans gösterme. 
        Çeldiricilere düşen adayları 'Kritik Risk' olarak işaretle.`
    },
    balanced: {
      budget: 32768,
      baseInstruction: `TON: PROFESYONEL, DENGELİ, NESNEL. 
        PERSPEKTİF: Akademik donanım ve klinik sağduyuyu objektif verilerle tart. 
        Adayın yanlış seçeneklerdeki 'yaygın pedagojik hataları' benimseyip benimsemediğini kontrol et.`
    },
    empathetic: {
      budget: 24576,
      baseInstruction: `TON: GELİŞİM ODAKLI, YAPICI. 
        PERSPEKTİF: Adayın mevcut klinik eksiğinden ziyade, doğru muhakeme yolundaki çabasını ve kurumsal kültüre uyum potansiyelini değerlendir.`
    }
  };

  const selectedTone = toneSettings[config.aiTone] || toneSettings.balanced;

  const systemInstruction = `
    ROL: Yeni Gün Akademi Akademik Denetleme ve Liyakat Kurulu Başkanı.
    GÖREV: Adayın 'academic_proficiency' bölümündeki yüksek zorluk seviyeli klinik senaryolara verdiği yanıtları analiz et.
    DİL: Türkçe.
    
    ÖZEL TALİMAT:
    1. KLİNİK MUHAKEME ANALİZİ: Sorular 'yaygın ama hatalı uygulama' çeldiricileri içerir. Adayın bu çeldiricilere yönelmesi, teorik bilgisinin pratikle uyuşmadığını gösterir.
    2. RED FLAG TESPİTİ: Davranışçı yaklaşımlarda (ABA) 'söndürme' yerine 'ceza' eğilimi gösteren, akademik problemlerde 'somutlaştırma' yerine 'ezber' öneren adayları düşük puanla değerlendir.
    3. SERTİFİKA VE YANIT TUTARLILIĞI: Aday 'ABA Sertifikası' beyan edip ilgili soruda 'Davranışsal Söndürme' yerine 'Sakinleştirme/Bekleme' seçmişse bunu 'Liyakat Tutarsızlığı' olarak rapora ekle.
    4. ETKİ ANALİZİ: Her değerlendirme alanı için adayın bu özelliğinin kurum üzerindeki "Kısa Vadeli Etki" ve "Uzun Vadeli Sonuç" tahminlerini yap.

    ${selectedTone.baseInstruction}
    
    FORMAT: Kesinlikle geçerli JSON döndür.
  `;

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
