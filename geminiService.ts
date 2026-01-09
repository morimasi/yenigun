
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Gemini 3.0 Flash Preview Multimodal Analiz Motoru.
 * Adayın CV görsel verilerini ve senaryo cevaplarını kurumsal etik filtresinden geçirir.
 * Yüksek hız ve multimodal performans avantajı nedeniyle Gemini 3 Flash tercih edilmiştir.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  if (!process.env.API_KEY) {
    throw new Error("MISSING_API_KEY");
  }

  // En güncel API anahtarı kullanımı için yeni bir instance oluşturulur
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için tasarlanmış, Gemini 3.0 Flash mimarisiyle çalışan bir Multimodal Psikometrik Analiz Uzmanısın.
    
    ANALİZ GÖREVİN:
    1. GÖRSEL ANALİZ: Ekteki CV dosyasının (eğer varsa) profesyonelliğini, titizliğini ve yapısal düzenini incele.
    2. METİNSEL ANALİZ: Adayın senaryo sorularına verdiği yanıtları; "Yüksek Çeldiricilik", "Klinik Etik", "Kurumsal Diplomasi" ve "Stres Toleransı" açılarından puanla.
    3. ÇAPRAZ SORGU (Cross-Check): CV'de iddia edilen deneyim süresi ile sorulardaki "olgunluk" seviyesi uyuşuyor mu?
    4. MASKE TESPİTİ: Aday sadece kitabi bilgi mi sunuyor yoksa sahada uygulanabilir çözümler mi üretiyor?
    
    KRİTİK STANDARTLAR:
    - Kurum, sadece teknik beceriyi değil, duygusal bütünlüğü ve dürüstlüğü arar.
    - SWOT analizinde "Threats" kısmına mutlaka adayın multimodal çelişkilerini ekle.
  `;

  const textPart = {
    text: `
      ADAY PROFİLİ VE VERİLERİ:
      - Branş: ${candidate.branch}
      - Deneyim: ${candidate.experienceYears} Yıl
      - Önceki Kurumlar: ${candidate.previousInstitutions}
      - Test Yanıtları (JSON): ${JSON.stringify(candidate.answers, null, 2)}
      
      Adayın beyan ettiği yetkinlikler: ${candidate.allTrainings}
    `
  };

  const parts: any[] = [textPart];

  // Multimodal destek: CV görseli varsa analiz parçasına ekle
  if (candidate.cvData) {
    parts.push({
      inlineData: {
        data: candidate.cvData.base64,
        mimeType: candidate.cvData.mimeType
      }
    });
  }

  try {
    // Gemini 3.0 Flash Preview kullanımı
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // Hızlı ve derinlemesine karakter analizi için thinking budget aktif
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "0-100 arası genel uygunluk puanı" },
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
            summary: { type: Type.STRING, description: "Dürüstlük ve yetkinlik sentezi" },
            recommendation: { type: Type.STRING, description: "Stratejik mülakat tavsiyesi" }
          },
          required: ["score", "swot", "competencies", "categoricalScores", "summary", "recommendation"]
        }
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    return JSON.parse(jsonStr) as AIReport;
  } catch (error: any) {
    console.error("Gemini 3.0 Flash Error:", error);
    if (error.message?.includes("API key")) throw new Error("INVALID_API_KEY");
    throw error;
  }
};
