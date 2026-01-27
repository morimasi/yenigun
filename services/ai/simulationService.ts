
import { GoogleGenAI } from "@google/genai";
import { Candidate, ClinicalTestType, SimulationResult } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateCrisis = async (candidate: Candidate, testType: ClinicalTestType): Promise<SimulationResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAY PROFILI: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, testType })}`,
    config: {
      systemInstruction: "Yeni Gün Akademi Klinik Laboratuvarı. Adayın etik sınırlarını sarsacak stres simülasyonu üret. Yanıtı sadece JSON formatında ver.",
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 16000 }
    }
  });
  return JSON.parse(response.text || '{}');
};
