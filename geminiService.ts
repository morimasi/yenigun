
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Klinik Direktörü ve Baş Denetçi.
    GÖREV: Adayın branş (${candidate.branch}), akademik geçmişi ve beyan ettiği sertifikalar üzerindeki yetkinliğini analiz et.
    
    FAZ 1 - KARAKTER VE SOSYAL MASKE DENETİMİ:
    - Adayın gri alan senaryolarına (veli ilişkileri, kriz yönetimi) verdiği cevapları incele.
    - "Sosyal Maske" tespiti yap: Aday sadece kurumu memnun etmek için mi "ideal" olanı seçmiş yoksa gerçekten profesyonel sınırı koruyor mu?
    - "reliabilityIndex" analizinde adayın tutarlılığını sorgula.
    
    MULTIMODAL / CV DENETİM PROTOKOLÜ:
    1. CV içeriğini tara.
    2. Beyan edilen deneyim ve eğitimleri CV ile kıyasla.
    3. Tutarsızlıkları "answerAnomalies" kısmında belirt.
    
    KLİNİK DERİN DALISH:
    - Branş spesifik literatür üzerinden puanla.
    
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
          required: ["score", "summary", "recommendation", "detailedAnalysis", "interviewGuidance", "swot", "competencies"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini Multi-Modal Analysis Error:", error);
    throw error;
  }
};
