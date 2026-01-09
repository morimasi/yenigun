
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v15.0 (OZEL - Deep Tone Sensitivity)
 * Gemini 3 Pro Preview kullanarak karmaşık muhakeme ve dinamik düşünme bütçesi uygular.
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("AUTH_MISSING: Analiz motoru için geçerli bir anahtar bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // AI Tonuna göre dinamik Düşünme Bütçesi (Thinking Budget) belirleme
  const toneSettings = {
    strict: {
      budget: 32768,
      instruction: `
        TON: RIJIT, SORGULAYICI, SÜPER-DENETÇİ.
        PERSPEKTİF: Adayın her kelimesinde bir tutarsızlık, "CV şişirme" veya "sosyal beğenirlik maskesi" ara. 
        KURAL: En küçük etik şüpheyi devasa bir risk olarak raporla. Merhamet gösterme; sadece ham liyakat ve kusursuz tutarlılık odaklı ol.
        HEDEF: Kurumu korumak için en zorlu filtreyi uygula.
      `
    },
    balanced: {
      budget: 24576,
      instruction: `
        TON: DENGELİ, PROFESYONEL, OBJEKTİF.
        PERSPEKTİF: Adayın güçlü yanlarını ve risklerini eşit ağırlıkta tart. 
        KURAL: Kanıta dayalı analiz yap. Verilen cevapları mesleki standartlarla kıyasla.
        HEDEF: Kurumun ihtiyacı olan ideal uzman profilini rasyonel verilerle tespit et.
      `
    },
    empathetic: {
      budget: 16384,
      instruction: `
        TON: GELİŞİM ODAKLI, EMPATİK, KOÇLUK YAKLAŞIMI.
        PERSPEKTİF: Adayın potansiyeline, öğrenme çevikliğine ve "işlenmemiş elmas" olup olmadığına bak.
        KURAL: Eksikleri "geliştirilebilir alanlar" olarak kodla. Adayın kuruma katacağı kültürel değeri ve vizyonu ön plana çıkar.
        HEDEF: Uzun vadeli bağlılık ve gelişim potansiyeli yüksek adayları bul.
      `
    }
  };

  const selectedTone = toneSettings[config.aiTone] || toneSettings.balanced;

  const systemInstruction = `
    ROL: Yeni Gün Akademi Üst Kurul Bilimsel Süpervizörü.
    GÖREV: Adayın akademik liyakatini ve profesyonel kimliğini analiz et.
    DİL: Türkçe.
    
    ${selectedTone.instruction}

    STRATEJİK AĞIRLIKLAR (Bu oranlara göre skorlama yap):
    - Etik Bütünlük: %${config.aiWeights.ethics}
    - Klinik Muhakeme: %${config.aiWeights.clinical}
    - Deneyim/Donanım: %${config.aiWeights.experience}
    - Kurumsal Uyum: %${config.aiWeights.fit}

    ANALİZ MATRİSİ:
    1. Sosyal Beğenirlik Analizi: Aday idealize edilmiş cevaplar mı veriyor? (Ör: "Hiçbirini ihmal etmem" diyenlerin puanını kır).
    2. Klinik Derinlik: Spesifik metodoloji (ABA, Denver vb.) bilgisi yüzeysel mi yoksa pratik mi?
    3. Etik Katılık: Kurum etiği ile veli memnuniyeti arasındaki çatışmayı nasıl çözüyor?

    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { 
        parts: [
          { text: `Aday Profili: ${JSON.stringify({
              name: candidate.name,
              branch: candidate.branch,
              experience: candidate.experienceYears,
              trainings: candidate.allTrainings,
              answers: candidate.answers,
              weights: config.aiWeights
            })}` }
        ] 
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: selectedTone.budget },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Genel liyakat skoru (0-100)" },
            summary: { type: Type.STRING, description: "Kritik icra özeti" },
            recommendation: { type: Type.STRING, description: "Mülakat kararı ve temel tavsiye" },
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

    if (!response.text) throw new Error("Motor yanıt veremedi.");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analiz Hatası (Dinamik Ton):", error);
    throw error;
  }
};
