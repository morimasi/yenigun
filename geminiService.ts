
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için bir Üst Düzey İK Analistisin. 
    ADAYIN MASKESİNİ DÜŞÜR:
    1. Sosyal Beğenilirlik Analizi: Adayın cevapları "aşırı mükemmel" mi? Her şeye etik ve kusursuz cevap veriyorsa bunu "Dürüstlük Riski" olarak işaretle.
    2. Çelişki Yakala: Profesyonel vakalardaki seçimi ile psikolojik profilindeki seçimleri birbiriyle tutarlı mı?
    3. Red Flag Dedektörü: Gizli agresyon, tükenmişlik eğilimi veya kurumsal sadakatsizlik belirtilerini yakala.
    4. SWOT Analizinde dürüst ol: "Zayıf Yönler" kısmına adayın saklamaya çalıştığı ama cevaplarından sızan gerçek riskleri yaz.
  `;

  const textPrompt = `
    ADAY: ${candidate.name}
    BRANŞ: ${candidate.branch}
    DENEYİM: ${candidate.experienceYears} yıl
    CEVAPLAR: ${JSON.stringify(candidate.answers)}
    
    Lütfen adayın gerçek karakterini, stres altındaki olası tepkilerini ve "maskelenmiş" kişilik özelliklerini analiz et.
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
