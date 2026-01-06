
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY_NOT_FOUND_IN_ENVIRONMENT");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için Üst Düzey Psikometrik Analiz ve İK Strateji Uzmanısın.
    
    ÖZEL GÖREVİN:
    Adayın cevaplarındaki "Sosyal Beğenirlik Sapmasını" (Social Desirability Bias) tespit et. 
    Aday kendini "kusursuz, hiç öfkelenmeyen, her zaman etik olan bir melek" gibi gösteriyorsa, bu bir 'RED FLAG' (Tehlike İşareti) olarak değerlendirilmelidir.
    
    ANALİZ KRİTERLERİ:
    1. Otantisite: Cevaplar insani zaafları (öfke, yorgunluk, hata yapma) kabul ediyor mu yoksa ezberlenmiş "doğru" cevaplar mı?
    2. Stres Altında Karar: Çocuk-Kurum-Kendi çıkarı çatıştığında hangisini gerçekçi bir şekilde seçiyor?
    3. Red Flag Tespiti: Agresyon potansiyeli, gizli tükenmişlik (burnout) veya kurumsal sadakat maskesi altında etik ihlal eğilimi var mı?
    4. Gelişim Alanı: Aday hatasını itiraf edebiliyor mu? Hata itiraf etmeyen adayı "Narsisistik Eğilim" veya "Dürüstlük Eksikliği" ile işaretle.
    
    RAPORLAMA:
    - Skor verirken "fazla mükemmel" cevap verenlerin puanını kır.
    - SWOT kısmındaki "Threats" bölümüne adayın muhtemel maskelerini yaz.
    - Summary kısmında adayın profesyonel duruşu ile gerçek kişiliği arasındaki muhtemel boşluğu (gap) analiz et.
  `;

  const textPrompt = `
    ADAY PROFİLİ:
    İsim: ${candidate.name}
    Branş: ${candidate.branch}
    Deneyim: ${candidate.experienceYears} yıl
    Eğitimler: ${candidate.allTrainings}
    Cevaplar: ${JSON.stringify(candidate.answers)}
    
    Lütfen bu verileri analiz et ve profesyonel bir Akademi Değerlendirme Raporu oluştur.
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
            score: { type: Type.NUMBER, description: "Genel uygunluk skoru (0-100)" },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Manipülasyon veya karakter riskleri" }
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
            summary: { type: Type.STRING, description: "Adayın maskesini düşüren kısa klinik özet" },
            recommendation: { type: Type.STRING, description: "Mülakatta üzerine gidilmesi gereken zayıf noktalar dahil tavsiye" }
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
