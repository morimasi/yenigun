
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Klinik Direktörü ve Baş Denetçi.
    GÖREV: Adayın branş (${candidate.branch}) yetkinliğini ve ETİK BÜTÜNLÜĞÜNÜ analiz et.
    
    FAZ 3 - ETİK VE DÜRÜSTLÜK DENETİMİ:
    1. SOSYAL MASKE TESPİTİ: Aday "Hediye kabulü" veya "Gizlilik" gibi sorularda sadece "kitabi doğruyu" mu söylüyor? Cevaplarındaki samimiyeti kelime seçimlerinden analiz et.
    2. INTEGRITY INDEX: Adayın hata itirafı (dev_failure_honesty) ile profesyonel sınır cevapları arasındaki tutarlılığı ölç. (0-100 arası bir puan ver).
    3. RED FLAGS: Özel eğitimde çocuk güvenliğini veya kurumsal imajı riske atacak en ufak emareyi "interviewGuidance.answerAnomalies" kısmında belirt.
    
    DİL: Türkçe. FORMAT: JSON.
  `;

  try {
    const parts: any[] = [
      { text: `Aday Verileri: ${JSON.stringify({
          name: candidate.name,
          branch: candidate.branch,
          university: candidate.university,
          experience: candidate.experienceYears,
          allTrainings: candidate.allTrainings,
          answers: candidate.answers
        })}` }
    ];

    if (candidate.cvData && candidate.cvData.base64) {
      parts.push({
        inlineData: {
          data: candidate.cvData.base64,
          mimeType: candidate.cvData.mimeType || 'image/jpeg'
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            integrityIndex: { type: Type.NUMBER },
            socialMaskingScore: { type: Type.NUMBER },
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
            interviewGuidance: {
              type: Type.OBJECT,
              properties: {
                strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
                answerAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } }
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
          required: ["score", "integrityIndex", "socialMaskingScore", "summary", "recommendation", "detailedAnalysis", "interviewGuidance", "swot", "competencies"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini Multi-Modal Analysis Error:", error);
    throw error;
  }
};
