
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig, ClinicalTestType, SimulationResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Adayın liyakat profilini analiz eden ana motor.
 * 6 Yeni Derin Klinik Test Boyutu sistem talimatlarına eklendi.
 */
export const generateCandidateAnalysis = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const modelName = "gemini-3-flash-preview";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Analisti ve Liyakat Müfettişi.
    HEDEF: Adayın profesyonel DNA'sını 16 boyutlu bir matris üzerinden analiz et.
    
    6 KRİTİK KLİNİK BOYUT (ÖNCELİKLİ):
    1. BEP/IEP Adaptasyonu: Beklenmedik durumlarda planı revize etme hızı.
    2. DMP Stres: Kriz anında (ısırma, kendine zarar verme) etik sınırları koruma.
    3. Multidisipliner Çatışma: Farklı branşlarla (örn: Ergoterapist-Psikolog) liyakatli işbirliği.
    4. Veri Okuryazarlığı: Gelişim tablolarındaki anomalileri ve sahte ilerlemeyi yakalama.
    5. Sınır İhlali: Veli ile profesyonel mesafeyi (hediye, özel ders teklifi) koruma.
    6. Metot Esnekliği: En sevdiği metodun başarısız olduğu vaka karşısındaki klinik esnekliği.

    DİSİPLİN: Dahili muhakeme kullanarak adayın "Social Masking" (kendini iyi gösterme) oranını % olarak hesapla.
    Cevaplardaki mikro-çelişkileri yakala.
  `;

  try {
    const parts: any[] = [{ text: `ADAY VERİLERİ VE CEVAPLARI: ${JSON.stringify(candidate)}` }];
    if (candidate.cvData?.base64) {
      parts.push({ inlineData: { data: candidate.cvData.base64, mimeType: candidate.cvData.mimeType || 'image/jpeg' } });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }, // Akıllı derin muhakeme aktif
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            integrityIndex: { type: Type.NUMBER },
            socialMaskingScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            deepAnalysis: { type: Type.OBJECT },
            clinicalTests: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  testType: { type: Type.STRING },
                  scenario: { type: Type.STRING },
                  evaluation: {
                    type: Type.OBJECT,
                    properties: {
                      logicScore: { type: Type.NUMBER },
                      scientificAccuracy: { type: Type.NUMBER },
                      criticalNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                }
              }
            },
            predictiveMetrics: { type: Type.OBJECT },
            interviewGuidance: { type: Type.OBJECT },
            swot: { type: Type.OBJECT }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) { throw error; }
};

/**
 * Adayın kriz anındaki reflekslerini simüle eden motor.
 */
export const runStresSimulation = async (candidate: Candidate): Promise<SimulationResult> => {
  const modelName = "gemini-3-flash-preview";

  const systemInstruction = `
    ROL: Yeni Gün Akademi Kriz Simülatörü.
    HEDEF: Adayın geçmiş cevaplarını analiz ederek, onu en çok zorlayacak etik/klinik kriz senaryosunu üret ve muhtemel cevabını simüle et.
    
    ÇIKTI FORMATI: JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `ADAY VERİLERİ: ${JSON.stringify(candidate)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            parentPersona: { type: Type.STRING },
            candidateResponse: { type: Type.STRING },
            stressLevel: { type: Type.NUMBER },
            aiEvaluation: {
              type: Type.OBJECT,
              properties: {
                ethicalBoundaryScore: { type: Type.NUMBER },
                empathyCalibration: { type: Type.NUMBER },
                professionalDistance: { type: Type.NUMBER },
                crisisResolutionEfficiency: { type: Type.NUMBER },
                criticalMistakes: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    throw error;
  }
};
