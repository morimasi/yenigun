
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  // Her çağrıda yeni instance oluşturulması en güvenli yöntemdir (Sistem Kuralı)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const textPrompt = `
    Sen, Yeni Gün Özel Eğitim ve Rehabilitasyon Merkezi için özel olarak konfigüre edilmiş bir Yapay Zeka Yetenek Mimarı'sın.
    ANALİZ DERİNLİĞİ:
    - KRİTİK EŞİK (Red Flags): Adayın etik, çocuk güvenliği veya profesyonel sınırlar konusundaki cevaplarını mikroskobik düzeyde incele. 
    - KÜLTÜREL DNA: Kurumun "şefkat, veri odaklılık ve sürekli gelişim" ilkelerine uyumu 0-100 arası puanla.
    - SİNERJİ TAHMİNİ: Bu adayın ekibe katılması durumunda mevcut ekibi nasıl etkileyeceğini analiz et.
    ADAY VERİLERİ:
    - İsim: ${candidate.name}
    - Branş: ${candidate.branch}
    - Form Cevapları: ${JSON.stringify(candidate.answers)}
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

  return JSON.parse(response.text || '{}') as AIReport;
};

export const generatePersonalizedInvite = async (candidate: Candidate): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const prompt = `
    Yeni Gün Özel Eğitim Merkezi adına ${candidate.name} isimli adaya bir mülakat davet metni yaz.
    Adayın branşı: ${candidate.branch}
    AI Analiz özeti: ${candidate.report?.summary}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "Davet metni oluşturulamadı.";
};
