import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Akademik Denetleme Kurulu Başkanı.
    GÖREV: Adayın klinik senaryo yanıtlarını, akademik geçmişini ve deneyimlerini analiz et.
    DİL: Türkçe.
    
    ANALİZ KRİTERLERİ:
    1. AKADEMİK KÖKEN: Adayın mezun olduğu üniversite ve bölüm, seçtiği branşla ne kadar uyumlu? Üniversitenin eğitim ekolü, adayın metodolojik yaklaşımını nasıl etkilemiş olabilir?
    2. KLİNİK MUHAKEME: Aday çeldirici seçeneklerdeki "yaygın ama bilimsellikten uzak" yöntemlere mi düşmüş yoksa "kanıta dayalı" (ABA, Floortime vb.) yöntemleri mi seçmiş?
    3. RİSK TESPİTİ: Çocuğun güvenliğini riske atan veya etik sınırları zorlayan yanıtları "Tehdit" olarak işaretle.
    4. SERTİFİKA TUTARLILIĞI: Adayın sahip olduğu sertifikalarla yanıtlarındaki profesyonellik uyuşuyor mu?
    
    FORMAT: JSON.
  `;

  try {
    const contents: any = { 
      parts: [
        { text: `Aday Verileri: ${JSON.stringify({
            name: candidate.name,
            branch: candidate.branch,
            education: {
              university: candidate.university,
              department: candidate.department
            },
            experience: candidate.experienceYears,
            allTrainings: candidate.allTrainings,
            answers: candidate.answers
          })}` }
      ] 
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            detailedAnalysis: {
              type: Type.OBJECT,
              properties: {
                ethics: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, shortTermImpact: { type: Type.STRING }, longTermImplication: { type: Type.STRING } } },
                pedagogy: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, shortTermImpact: { type: Type.STRING }, longTermImplication: { type: Type.STRING } } },
                clinicalWisdom: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, shortTermImpact: { type: Type.STRING }, longTermImplication: { type: Type.STRING } } },
                stressResponse: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, shortTermImpact: { type: Type.STRING }, longTermImplication: { type: Type.STRING } } },
                emotionalResilience: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, shortTermImpact: { type: Type.STRING }, longTermImplication: { type: Type.STRING } } },
                institutionalFit: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING }, shortTermImpact: { type: Type.STRING }, longTermImplication: { type: Type.STRING } } }
              }
            },
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
              items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } } }
            }
          },
          required: ["score", "summary", "recommendation", "detailedAnalysis", "swot", "competencies"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};