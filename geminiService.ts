
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // Vercel veya çalışma ortamındaki API anahtarını al
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY_NOT_FOUND_IN_ENVIRONMENT");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için Üst Düzey Klinik İK ve Teknik Değerlendirme Uzmanısın. 
    Özel eğitim ve rehabilitasyon alanında (Otizm, ABA, Dil Konuşma, Fizyoterapi) derin uzmanlığa sahipsin.

    GÖREVİN:
    Adayın sunduğu verileri ve (varsa) CV dokümanını analiz et. 
    Keskin, tutarlı ve profesyonel bir rapor oluştur.

    KATEGORİK ANALİZ (0-100 Puan):
    1. Mantıksal Keskinlik (Logic)
    2. Klinik Etik (Ethics)
    3. Psikolojik Bütünlük (Psychology)
    4. Sosyal Diplomasi (Diplomacy)
    5. Gelişim Çevikliği (Development)
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
    console.error("Gemini API Hatası:", error);
    throw error;
  }
};
