
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Klinik Direktörü ve Baş Denetçi.
    GÖREV: Adayın branş (${candidate.branch}), akademik geçmişi ve beyan ettiği sertifikalar üzerindeki yetkinliğini "Acımasızca" ama "Adil" şekilde analiz et.
    
    MULTIMODAL / CV DENETİM PROTOKOLÜ:
    1. Ekteki CV (Görsel/PDF) içeriğini bizzat tara.
    2. FORMDA BEYAN EDİLEN: ${candidate.experienceYears} yıl deneyim ve ${candidate.allTrainings.join(', ')} eğitimlerini CV'deki verilerle kıyasla.
    3. TUTARSIZLIK TESPİTİ (Fraud Check): Eğer CV'de bahsedilmeyen bir eğitim formda "var" gibi gösterilmişse veya tarihler çelişiyorsa "reliabilityIndex" puanını düşür ve "interviewGuidance" kısmında bunu sorgulat.
    
    KLİNİK DERİN DALISH (Deep Dive) ANALİZİ:
    - Adayın sertifika bazlı sorulara (${candidate.answers}) verdiği cevapların teknik doğruluğunu branş spesifik literatür (ABA, Bobath, Sensory Integration vb.) üzerinden puanla.
    - Sığ veya jenerik cevapları ("Çocuğun iyiliği için yaparım" gibi) düşük puanla.
    
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

    // CV VARSA MULTIMODAL ANALİZ
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
