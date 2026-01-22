import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi Akademik Denetleme Kurulu Başkanı ve Baş Mülakatçı.
    GÖREV: Adayın klinik senaryo yanıtlarını, akademik geçmişini ve deneyimlerini analiz et. Mülakatçı için "Hile Saptama" ve "Derinlemesine Sorgulama" rehberi oluştur.
    DİL: Türkçe.
    
    ANALİZ KRİTERLERİ:
    1. YANIT ÇAPRAZ DENETİMİ: Adayın verdiği spesifik cevapları (answers) incele. Sertifika listesiyle yanıtlarındaki teknik derinlik uyuşuyor mu? Örn: ABA eğitimi olduğunu söyleyip ceza odaklı bir yanıt seçmişse bunu belirt.
    2. MÜLAKAT REHBERİ: Adayın "en zayıf" veya "en kaçamak" yanıt verdiği sorulardan yola çıkarak mülakatta sorulması gereken 3 kritik soru üret.
    3. DİKKAT EDİLECEK NOKTALAR: Adayın kişilik testindeki veya klinik senaryolardaki riskli eğilimlerini (aşırı otoriterlik, tükenmişlik sinyali, etik esneklik) "Kritik Gözlemler" olarak raporla.
    4. RİSK TESPİTİ: Çocuğun güvenliğini riske atan veya etik sınırları zorlayan yanıtları "Tehdit" olarak işaretle.
    
    FORMAT: JSON.
  `;

  try {
    const contents: any = { 
      parts: [
        { text: `Aday Verileri ve Yanıtları: ${JSON.stringify({
            name: candidate.name,
            branch: candidate.branch,
            education: {
              university: candidate.university,
              department: candidate.department
            },
            experience: candidate.experienceYears,
            allTrainings: candidate.allTrainings,
            answers: candidate.answers // Yanıtlar mülakat rehberi için kritik
          })}` }
      ] 
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
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
              },
              required: ["strategicQuestions", "criticalObservations", "answerAnomalies"]
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
    console.error("Gemini Flash Error:", error);
    throw error;
  }
};