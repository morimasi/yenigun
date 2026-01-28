
import { GoogleGenAI } from "@google/genai";
import { Candidate, ClinicalTestType, SimulationResult } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateCrisis = async (candidate: Candidate, testType: ClinicalTestType): Promise<SimulationResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAY PROFILI VE GEÇMİŞ YANITLARI: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, answers: candidate.answers, testType })}`,
    config: {
      systemInstruction: `
        ROL: Yeni Gün Akademi Klinik Deney Laboratuvarı Direktörü.
        GÖREV: Adayın kriz anındaki nöral sapmalarını ve etik sınırlarını test eden bir stres simülasyonu üret.
        
        KRİTİK TALİMATLAR:
        1. Yanıtları TAMAMEN TÜRKÇE ver.
        2. 'clinicalTruths' ve 'criticalMistakes' alanları sadece kısa madde değil, nedenini açıklayan betimleyici cümleler olsun.
        3. Adayın uzmanlık branşına (${candidate.branch}) uygun, spesifik bir vaka kurgula.
        4. Farazi örnekler vererek yöneticiyi adayın gizli zafiyetleri konusunda uyar.
        5. Yanıtı sadece JSON formatında ver.
      `,
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
