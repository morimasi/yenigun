
import { GoogleGenAI } from "@google/genai";
import { Candidate, ClinicalTestType, SimulationResult } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateCrisis = async (candidate: Candidate, testType: ClinicalTestType): Promise<SimulationResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAY PROFILI VE GEÇMİŞ YANITLARI: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, answers: candidate.answers, testType })}`,
    config: {
      systemInstruction: "Yeni Gün Akademi Klinik Laboratuvarı. Adayın dürüstlüğünü ve etik sınırlarını sarsacak, mülakat cevaplarıyla çelişen bir stres simülasyonu üret. Yanıtı sadece JSON formatında ver.",
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 16000 }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Simülasyon Parse Hatası:", e);
    throw new Error("Kriz senaryosu nöral olarak derlenemedi.");
  }
};
