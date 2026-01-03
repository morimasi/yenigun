
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  const textPrompt = `
    Sen, Yeni Gün Özel Eğitim ve Rehabilitasyon Merkezi için özel olarak konfigüre edilmiş bir Yapay Zeka Yetenek Mimarı'sın.
    
    ANALİZ DERİNLİĞİ:
    - KRİTİK EŞİK (Red Flags): Adayın etik, çocuk güvenliği veya profesyonel sınırlar konusundaki cevaplarını mikroskobik düzeyde incele. 
    - KÜLTÜREL DNA: Kurumun "şefkat, veri odaklılık ve sürekli gelişim" ilkelerine uyumu 0-100 arası puanla.
    - SİNERJİ TAHMİNİ: Bu adayın ekibe katılması durumunda mevcut ekibi nasıl etkileyeceğini analiz et.

    ADAY VERİLERİ:
    - İsim: ${candidate.name}
    - Branş: ${candidate.branch}
    - Deneyim: ${candidate.experienceYears} yıl
    - Form Cevapları: ${JSON.stringify(candidate.answers)}

    ÇIKTI KURALLARI:
    - Mutlaka JSON formatında yanıt ver.
    - summary alanını profesyonel bir profil özeti olarak kurgula.
    - recommendation alanında "KESİNLİKLE ALINMALI", "MÜLAKATA ÇAĞRILMALI" veya "UYGUN DEĞİL" şeklinde net bir giriş yap.
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
    model: "gemini-3-flash-preview",
    contents: { parts: contents },
    config: {
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
          summary: { type: Type.STRING },
          cvSummary: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ["score", "swot", "competencies", "summary", "recommendation"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as AIReport;
  } catch (e) {
    console.error("JSON Parse Error", e);
    throw new Error("Analiz raporu oluşturulurken teknik bir hata oluştu.");
  }
};

export const generatePersonalizedInvite = async (candidate: Candidate): Promise<string> => {
  const prompt = `
    Yeni Gün Özel Eğitim Merkezi adına ${candidate.name} isimli adaya bir mülakat davet metni yaz.
    Adayın branşı: ${candidate.branch}
    AI Analiz özeti: ${candidate.report?.summary}
    
    KURALLAR:
    - Çok nazik, profesyonel ve sıcak bir dil kullan.
    - Raporundaki şu güçlü yönüne atıfta bulun: ${candidate.report?.swot.strengths[0]}
    - Metin, kurumun vizyonuna (şefkat ve bilim) vurgu yapmalı.
    - E-posta konusu ve gövdesini içeren bir taslak sun.
    - [Tarih], [Saat] ve [Konum] gibi yer tutucuları kullan.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "Davet metni oluşturulamadı.";
};
