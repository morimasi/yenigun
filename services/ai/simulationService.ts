
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, ClinicalTestType, SimulationResult } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateCrisis = async (candidate: Candidate, testType: ClinicalTestType): Promise<SimulationResult> => {
  // Adayın tüm dikey verilerini konsolide et
  const candidateSnapshot = {
    personal: { name: candidate.name, exp: candidate.experienceYears, branch: candidate.branch },
    trainings: candidate.allTrainings,
    clinicalCoreAnswers: candidate.answers
  };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      scenario: { type: Type.STRING, description: "Adayın branşına ve uzmanlıklarına özel kurgulanmış, yüksek etik risk içeren kriz anı." },
      parentPersona: { type: Type.STRING, description: "Kriz anındaki dış faktörün (Veli/Yönetici) psikolojik profili." },
      candidateResponse: { type: Type.STRING, description: "Adayın nöral profiline göre sergileyeceği en muhtemel davranış." },
      stressLevel: { type: Type.NUMBER },
      aiEvaluation: {
        type: Type.OBJECT,
        properties: {
          ethicalBoundaryScore: { type: Type.NUMBER },
          empathyCalibration: { type: Type.NUMBER },
          professionalDistance: { type: Type.NUMBER },
          crisisResolutionEfficiency: { type: Type.NUMBER },
          clinicalTruths: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          neuralDivergence: {
            type: Type.OBJECT,
            properties: {
              contradictionIndex: { type: Type.NUMBER, description: "Adayın mülakat cevapları ile kriz anındaki refleksi arasındaki çelişki yüzdesi." },
              decisionPath: { type: Type.STRING, description: "Karar verirken izlediği mantıksal rota (Duygusal mı, Metodolojik mi?)" },
              alternativeOutcome: { type: Type.STRING, description: "Adayın baskı altında yapabileceği 'Gölge' (Shadow) hata tahmini." },
              dominantEmotion: { type: Type.STRING, description: "Karar anında baskılanan birincil duygu." }
            },
            required: ["contradictionIndex", "decisionPath", "alternativeOutcome", "dominantEmotion"]
          },
          microBehaviors: {
            type: Type.OBJECT,
            properties: {
              toneAnalysis: { type: Type.STRING },
              nonVerbalPrediction: { type: Type.STRING },
              silenceTolerance: { type: Type.STRING }
            },
            required: ["toneAnalysis", "nonVerbalPrediction", "silenceTolerance"]
          }
        },
        required: ["ethicalBoundaryScore", "empathyCalibration", "professionalDistance", "crisisResolutionEfficiency", "clinicalTruths", "criticalMistakes", "neuralDivergence", "microBehaviors"]
      }
    },
    required: ["scenario", "parentPersona", "candidateResponse", "stressLevel", "aiEvaluation"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAYIN TAM KLİNİK PROFİLİ: ${JSON.stringify(candidateSnapshot)}
               UYGULANACAK TEST: ${testType}
               
               TALİMAT: Adayın 'clinicalCoreAnswers' içindeki etik duruşu ile beyan ettiği 'trainings' (sertifikalar) arasındaki metodolojik tutarlılığı mülakatın en stresli anında test et.`,
    config: {
      systemInstruction: `
        ROL: Yeni Gün Akademi Nöro-Psikolojik Test Laboratuvarı Direktörü.
        GÖREV: Adayın "Mülakat Maskesi"ni düşüren, adayı en zayıf olduğu etik sınırda yakalayan bir simülasyon üret.
        ANALİZ DİLİ: Keskin, klinik, kanıta dayalı ve tamamen Türkçe.
      `,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: responseSchema
    }
  });
  
  return JSON.parse(response.text || '{}');
};
