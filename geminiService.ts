
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Gemini 3.0 Pro Preview Multimodal Analiz Motoru.
 * Adayın CV görsel verilerini ve senaryo cevaplarını kurumsal etik filtresinden geçirir.
 * Psikometrik analiz karmaşık bir akıl yürütme görevi olduğu için Gemini 3 Pro tercih edilmiştir.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  if (!process.env.API_KEY) {
    throw new Error("MISSING_API_KEY");
  }

  // Yeni bir GoogleGenAI örneği oluşturuluyor (En güncel API anahtarı kullanımı için)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için tasarlanmış, Gemini 3.0 Pro mimarisiyle çalışan bir Multimodal Psikometrik Analiz Uzmanısın.
    
    ANALİZ GÖREVİN:
    1. GÖRSEL ANALİZ: Ekteki CV dosyasının (eğer varsa) profesyonelliğini, titizliğini ve yapısal düzenini incele.
    2. METİNSEL ANALİZ: Adayın senaryo sorularına verdiği yanıtları; "Yüksek Çeldiricilik", "Klinik Etik", "Kurumsal Diplomasi" ve "Stres Toleransı" açılarından puanla.
    3. ÇAPRAZ SORGU (Cross-Check): CV'de iddia edilen deneyim süresi ile sorulardaki "olgunluk" seviyesi uyuşuyor mu? (Örn: 10 yıllık bir uzman kriz anında panik cevabı veriyorsa tutarlılık düşüktür).
    4. MASKE TESPİTİ: Aday sadece "doğru olanı" mı söylüyor (kitabi bilgi) yoksa sahada "uygulanabilir ve etik" bir çözüm mü sunuyor?
    
    KRİTİK STANDARTLAR:
    - Kurum, sadece teknik beceriyi değil, duygusal bütünlüğü ve dürüstlüğü arar.
    - %100 "mükemmel" görünen adayları, "Maskeleme" riski açısından derinlemesine sorgula.
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

  // Multimodal destek: Eğer CV görseli/PDF'i varsa analiz parçasına ekle
  if (candidate.cvData) {
    parts.push({
      inlineData: {
        data: candidate.cvData.base64,
        mimeType: candidate.cvData.mimeType
      }
    });
  }

  try {
    // Karmaşık analiz görevleri için Pro model kullanımı tercih edilir.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // Derinlemesine karakter ve etik analizi için thinking budget kullanıyoruz.
        thinkingConfig: { thinkingBudget: 32768 },
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
                threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Multimodal riskler ve etik açmazlar" }
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
            summary: { type: Type.STRING, description: "Adayın CV ve test karakterinin dürüstlük sentezi" },
            recommendation: { type: Type.STRING, description: "Mülakat ekibi için stratejik tavsiye" }
          },
          required: ["score", "swot", "competencies", "categoricalScores", "summary", "recommendation"]
        }
      }
    });

    // response.text property access (metot değildir)
    const jsonStr = response.text?.trim() || '{}';
    return JSON.parse(jsonStr) as AIReport;
  } catch (error: any) {
    console.error("Gemini 3.0 Pro Error:", error);
    if (error.message?.includes("API key")) throw new Error("INVALID_API_KEY");
    throw error;
  }
};
