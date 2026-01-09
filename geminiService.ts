
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

/**
 * Yeni Gün Akademi - Stratejik Liyakat Analiz Motoru v16.0 (OZEL - Deep Tone Sensitivity)
 * Gemini 3 Pro Preview kullanarak karmaşık muhakeme ve dinamik düşünme bütçesi uygular.
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("AUTH_MISSING: Analiz motoru için geçerli bir anahtar bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // AI Tonuna göre dinamik Düşünme Bütçesi ve Talimat Seti
  const toneSettings = {
    strict: {
      budget: 32768, // Maksimum derinlik
      instruction: `
        TON: RIJIT, SORGULAYICI, SÜPER-DENETÇİ.
        PERSPEKTİF: Adayın her cümlesinde bir tutarsızlık, "CV şişirme" veya "sosyal beğenirlik maskesi" ara. 
        KARAKTER: Bir adli tıp uzmanı titizliğiyle, adayın etik boşluklarını ve klinik yetersizliklerini raporla. 
        KURAL: Merhamet gösterme; sadece ham liyakat, veri tutarlılığı ve kusursuz profesyonel ahlak odaklı ol.
        HEDEF: Kurumu en küçük riskten korumak için en sert filtreyi uygula.
      `
    },
    balanced: {
      budget: 24576,
      instruction: `
        TON: DENGELİ, PROFESYONEL, OBJEKTİF.
        PERSPEKTİF: Adayın güçlü yanlarını ve risklerini eşit ağırlıkta tart. 
        KARAKTER: Objektif bir bilim insanı yaklaşımıyla, cevapları mesleki standartlar ve Yeni Gün Akademi kültürüyle kıyasla.
        KURAL: Kanıta dayalı analiz yap. Adayın "gerçek" yetkinliği ile "algılanan" yetkinliği arasındaki farkı raporla.
        HEDEF: Kurumun ihtiyacı olan ideal uzman profilini rasyonel verilerle tespit et.
      `
    },
    empathetic: {
      budget: 16384,
      instruction: `
        TON: GELİŞİM ODAKLI, EMPATİK, KOÇLUK YAKLAŞIMI.
        PERSPEKTİF: Adayın potansiyeline, öğrenme çevikliğine ve "işlenmemiş elmas" olup olmadığına odaklan.
        KARAKTER: Bir mentor gözüyle, adayın eksiklerini "geliştirilebilir alanlar" olarak kodla ve kuruma katacağı kültürel değeri analiz et.
        KURAL: Duygusal zekayı (EQ) ve uzun vadeli bağlılık potansiyelini ön planda tut.
        HEDEF: Gelişime açık, kurum vizyonuna tutkuyla bağlanacak adayları tespit et.
      `
    }
  };

  const selectedTone = toneSettings[config.aiTone] || toneSettings.balanced;

  const systemInstruction = `
    ROL: Yeni Gün Akademi Üst Kurul Bilimsel Süpervizörü.
    GÖREV: Adayın akademik liyakatini, klinik derinliğini ve profesyonel kimliğini analiz et.
    DİL: Türkçe.
    
    ${selectedTone.instruction}

    STRATEJİK AĞIRLIKLAR (Bu oranlara göre skorlama yap):
    - Etik Bütünlük (Sınırlar ve Dürüstlük): %${config.aiWeights.ethics}
    - Klinik Muhakeme (Vaka Yönetimi): %${config.aiWeights.clinical}
    - Deneyim/Donanım (Geçmiş ve Sertifikasyon): %${config.aiWeights.experience}
    - Kurumsal Uyum (Kültür ve Hiyerarşi): %${config.aiWeights.fit}

    ANALİZ MATRİSİ:
    1. Sosyal Beğenirlik Denetimi: Aday "mükemmel" görünmeye mi çalışıyor? İdealize edilmiş cevaplardaki mantık hatalarını bul.
    2. Klinik Derinlik Analizi: Metodoloji bilgisi (ABA, Denver, Floortime vb.) sadece terimsel mi yoksa uygulama tecrübesi mi içeriyor?
    3. Stres ve Kriz Refleksi: Baskı altındaki önceliklendirme kapasitesi kurum güvenliğiyle örtüşüyor mu?

    FORMAT: Kesinlikle geçerli JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { 
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
      },
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
    console.error("Dinamik Ton Analiz Hatası:", error);
    throw error;
  }
};
