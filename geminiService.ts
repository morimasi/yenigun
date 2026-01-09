
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

/**
 * Yeni Gün Akademi - Gelişmiş AI Analiz Motoru v5.0 (Academic Flash Edition)
 * "ozel" mod: Gemini 3 Flash Preview ile multimodal akademik ve karakter analizi.
 */
export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY_MISSING: Sistem yapılandırmasında geçerli bir API anahtarı bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için tasarlanmış, Gemini 3.0 Flash mimarisiyle çalışan Üst Düzey Akademik Değerlendirme Uzmanısın.
    
    ANALİZ PROTOKOLÜ (AKADEMİ DERİNLİĞİ):
    1. MULTIMODAL MUAYENE: Adayın beyan ettiği eğitimler (${candidate.allTrainings}) ile CV dosyasındaki (varsa) görsel düzeni ve profesyonellik seviyesini karşılaştır.
    2. BİLİŞSEL ANALİZ: Test yanıtlarını, özel eğitim branşının (${candidate.branch}) gerektirdiği etik ve klinik standartlar çerçevesinde değerlendir.
    3. DÜŞÜNCE BÜTÇESİ KULLANIMI: Adayın yanıtlarında "mükemmeliyetçi maskeleme" yapıp yapmadığını, kriz sorularındaki (prioritization_1 vb.) önceliklendirme mantığını analiz et.
    4. STRATEJİK ÇIKTI: Adayın sadece zayıf yönlerini değil, kurumun kültürüne katabileceği "fırsatları" da tanımla.
    
    ÖNEMLİ: Yanıtın sadece geçerli bir JSON objesi olmalıdır. Jeton sınırlarını (maxOutputTokens) aşmadan kapsamlı bir rapor sun.
  `;

  const promptText = `
    ADAY VERİ SETİ:
    - İsim: ${candidate.name}
    - Uzmanlık: ${candidate.branch}
    - Deneyim: ${candidate.experienceYears} Yıl
    - Sertifikalar/Eğitimler: ${candidate.allTrainings}
    - Kariyer Geçmişi: ${candidate.previousInstitutions}
    - Psikometrik Senaryo Yanıtları: ${JSON.stringify(candidate.answers)}
  `;

  const parts: any[] = [{ text: promptText }];

  // Multimodal CV Desteği
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
        // Jeton Yönetimi (Akademik Güvenlik Paketi)
        maxOutputTokens: 15000,
        thinkingConfig: { thinkingBudget: 5000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
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
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["score", "swot", "competencies", "categoricalScores", "summary", "recommendation"]
        }
      }
    });

    const outputText = response.text?.trim();
    if (!outputText) throw new Error("AI_ENGINE_FAILURE: Model boş yanıt döndürdü.");
    
    return JSON.parse(outputText) as AIReport;
  } catch (error: any) {
    console.error("Gemini Akademi Analiz Hatası:", error);
    if (error.message?.includes("fetch")) throw new Error("Gemini API Bağlantı Hatası: Ağ isteği başarısız oldu.");
    if (error.message?.includes("JSON")) throw new Error("Analiz Motoru Ayrıştırma Hatası: AI çıktısı geçersiz formatta.");
    throw new Error(`Akademi Analiz Hatası: ${error.message}`);
  }
};
