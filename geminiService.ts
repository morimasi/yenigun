
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için Üst Düzey Klinik İK ve Teknik Değerlendirme Uzmanısın. 
    Özel eğitim ve rehabilitasyon alanında derin uzmanlığa sahipsin.

    KATEGORİK ANALİZ ZORUNLULUĞU:
    Adayın performansını şu 5 ana kategoride (0-100 arası) mutlaka puanlamalısın:
    1. Mantıksal Keskinlik (Logic)
    2. Klinik Etik (Ethics)
    3. Psikolojik Bütünlük (Psychology)
    4. Sosyal Diplomasi (Diplomacy)
    5. Gelişim Çevikliği (Development)

    Her kategori için "Akademi Ortalaması" (Average) değerini Yeni Gün Akademi'nin yüksek standartlarını baz alarak (genelde 70-80 arası) sen belirle.

    ADAYIN MASKESİNİ DÜŞÜR VE DERİN ANALİZ YAP:
    1. ÖZEL EĞİTİM YETKİNLİK ANALİZİ: CV'deki metodolojileri ve sertifikaları süz.
    2. CV RED FLAG DEDEKTÖRÜ: Çelişkileri ve riskleri bul.
    3. SOSYAL BEĞENİLİRLİK: Cevaplar yapay mı gerçekçi mi?
    4. SWOT: Tehditler kısmında acımasız ve dürüst ol.
  `;

  const textPrompt = `
    ADAY PROFİLİ:
    İsim: ${candidate.name}
    Branş: ${candidate.branch}
    Deneyim: ${candidate.experienceYears} yıl
    
    CEVAPLAR:
    ${JSON.stringify(candidate.answers, null, 2)}
    
    Lütfen bu verileri analiz et ve Yeni Gün Akademi kriterlerine göre kategorik puanları da içeren detaylı raporu JSON formatında döndür.
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

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { parts: contents },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          swat: {
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
