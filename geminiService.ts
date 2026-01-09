
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Gelişmiş AI Analiz Motoru v4.0 (Academic Flash Edition)
 * Gemini 3 Flash Preview kullanarak multimodal karakter ve yetkinlik analizi yapar.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY_MISSING: Sistem yapılandırmasında API anahtarı bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Akademik derinlik için optimize edilmiş sistem talimatı
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için tasarlanmış, Gemini 3.0 Flash mimarisiyle çalışan Üst Düzey Akademik Değerlendirme Uzmanısın.
    
    GÖREVİN:
    Adayın profesyonel geçmişini, etik senaryolara verdiği yanıtları ve (varsa) CV'sini multimodal olarak analiz et.
    
    ANALİZ KRİTERLERİ:
    1. AKADEMİK DERİNLİK: Verilen cevaplar branşın (${candidate.branch}) bilimsel temellerine ne kadar uygun?
    2. KARAKTER ANALİZİ: Kriz anlarında (thinking budget kullanarak) adayın gerçek psikolojik tepkisini modelle.
    3. TUTARLILIK: Deneyim süresi ile cevaplardaki terminoloji kullanımı örtüşüyor mu?
    4. STRATEJİK TAVSİYE: Bu adayı işe alırsak ilk 3 ay hangi alanda "süpervizyon" almalı?
    
    ÖNEMLİ: Sadece geçerli bir JSON objesi döndür. Başka hiçbir metin ekleme.
  `;

  const promptText = `
    ADAY DOSYASI:
    - İsim: ${candidate.name}
    - Uzmanlık: ${candidate.branch}
    - Kıdem: ${candidate.experienceYears} Yıl
    - Eğitimler: ${candidate.allTrainings}
    - Geçmiş: ${candidate.previousInstitutions}
    - Test Yanıtları: ${JSON.stringify(candidate.answers)}
  `;

  const parts: any[] = [{ text: promptText }];

  // Multimodal destek: CV verisi varsa ekle
  if (candidate.cvData && candidate.cvData.base64) {
    parts.push({
      inlineData: {
        data: candidate.cvData.base64,
        mimeType: candidate.cvData.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // Akademi Seviyesinde Derinlik İçin Jeton Yönetimi
        maxOutputTokens: 12288,
        thinkingConfig: { thinkingBudget: 4096 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Genel uygunluk skoru 0-100" },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"]
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
            },
            categoricalScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  average: { type: Type.NUMBER },
                  label: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING, description: "Adayın profesyonel özeti" },
            recommendation: { type: Type.STRING, description: "Vurucu mülakat tavsiyesi" }
          },
          required: ["score", "swot", "competencies", "categoricalScores", "summary", "recommendation"]
        }
      }
    });

    if (!response.text) {
      throw new Error("EMPTY_AI_RESPONSE: Model yanıt üretmedi.");
    }

    return JSON.parse(response.text.trim()) as AIReport;
  } catch (error: any) {
    console.error("Gemini Akademi Motoru Hatası:", error);
    
    if (error.message?.includes("API_KEY")) {
      throw new Error("Lütfen API anahtarınızı (process.env.API_KEY) kontrol edin.");
    }
    
    if (error.message?.includes("JSON")) {
      throw new Error("AI Analizi tamamlandı ancak veri formatı akademik standartlara uygun ayrıştırılamadı.");
    }

    throw new Error(`Analiz Motoru Hatası: ${error.message || "Bağlantı kesildi."}`);
  }
};
