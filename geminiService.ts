
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Gemini 3 Flash için optimize edilmiş sistem talimatı
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için Üst Düzey Klinik İK ve Teknik Değerlendirme Uzmanısın. 
    Özel eğitim ve rehabilitasyon alanında (Otizm, ABA, Dil Konuşma, Fizyoterapi) derin uzmanlığa sahipsin.

    GÖREVİN:
    Adayın sunduğu verileri ve (varsa) CV dokümanını multimodal bir yaklaşımla analiz et. 
    Flash modelinin hızını kullanarak keskin, tutarlı ve profesyonel bir rapor oluştur.

    KATEGORİK ANALİZ (0-100 Puan):
    1. Mantıksal Keskinlik (Logic): Analitik düşünme.
    2. Klinik Etik (Ethics): Mesleki etik duruş.
    3. Psikolojik Bütünlük (Psychology): Stres yönetimi ve empati.
    4. Sosyal Diplomasi (Diplomacy): Veli ve ekip iletişimi.
    5. Gelişim Çevikliği (Development): Öğrenmeye açıklık.

    MULTIMODAL DOKÜMAN ANALİZİ:
    Eğer bir CV dosyası (görsel/PDF) sağlandıysa, formdaki cevaplarla CV'deki tarihleri, sertifikaları ve deneyimleri karşılaştır. 
    Abartılı veya çelişkili ifadeleri "Tehditler" (Red Flags) kısmında mutlaka belirt.
  `;

  const textPrompt = `
    ADAY VERİLERİ:
    İsim: ${candidate.name}
    Branş: ${candidate.branch}
    Yaş: ${candidate.age}
    Deneyim: ${candidate.experienceYears} yıl
    Eğitimler: ${candidate.allTrainings}
    Kurumlar: ${candidate.previousInstitutions}
    
    SENARYO CEVAPLARI:
    ${JSON.stringify(candidate.answers, null, 2)}
    
    Lütfen bu multimodal veriyi analiz et ve Yeni Gün Akademi standartlarında detaylı bir JSON rapor döndür.
  `;

  const contents: any[] = [{ text: textPrompt }];

  // Multimodal destek: Doküman verisi ekleniyor
  if (candidate.cvData) {
    contents.push({
      inlineData: {
        data: candidate.cvData.base64,
        mimeType: candidate.cvData.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Kullanıcı isteği üzerine Flash modeline geçildi
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
          cvSummary: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ["score", "swot", "competencies", "categoricalScores", "summary", "recommendation"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as AIReport;
};
