
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // Talimat gereği: Anahtar EXCLUSIVELY process.env.API_KEY'den alınır.
  // Not: Platform anahtarı bu değişkene enjekte eder.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("SDK Error: process.env.API_KEY is currently empty.");
    throw new Error("API_KEY_MISSING");
  }

  // Her çağrıda taze instance (En güncel process.env.API_KEY için)
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için Üst Düzey Klinik İK ve Teknik Değerlendirme Uzmanısın. 
    Özel eğitim ve rehabilitasyon alanında (Otizm, ABA, Dil Konuşma, Fizyoterapi) derin uzmanlığa sahipsin.

    GÖREVİN:
    Adayın sunduğu verileri ve (varsa) CV dokümanını multimodal bir yaklaşımla analiz et. 
    Keskin, tutarlı ve profesyonel bir rapor oluştur.

    KATEGORİK ANALİZ (0-100 Puan):
    1. Mantıksal Keskinlik (Logic): Analitik düşünme.
    2. Klinik Etik (Ethics): Mesleki etik duruş.
    3. Psikolojik Bütünlük (Psychology): Stres yönetimi ve empati.
    4. Sosyal Diplomasi (Diplomacy): Veli ve ekip iletişimi.
    5. Gelişim Çevikliği (Development): Öğrenmeye açıklık.
  `;

  const textPrompt = `
    ADAY VERİLERİ:
    İsim: ${candidate.name}
    Branş: ${candidate.branch}
    Deneyim: ${candidate.experienceYears} yıl
    Eğitimler: ${candidate.allTrainings}
    Kurumlar: ${candidate.previousInstitutions}
    
    CEVAPLAR:
    ${JSON.stringify(candidate.answers)}
    
    Analizini sadece JSON formatında döndür.
  `;

  const contents: any[] = [{ text: textPrompt }];

  if (candidate.cvData) {
    contents.push({
      inlineData: {
        data: candidate.cvData.base64,
        mimeType: candidate.cvData.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
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
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["score", "swot", "competencies", "categoricalScores", "summary", "recommendation"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as AIReport;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_INVALID");
    }
    throw error;
  }
};
