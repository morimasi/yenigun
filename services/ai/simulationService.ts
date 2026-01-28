
import { GoogleGenAI } from "@google/genai";
import { Candidate, ClinicalTestType, SimulationResult } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateCrisis = async (candidate: Candidate, testType: ClinicalTestType): Promise<SimulationResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAY PROFILI: ${JSON.stringify({ name: candidate.name, branch: candidate.branch, answers: candidate.answers, testType })}`,
    config: {
      systemInstruction: `
        ROL: Yeni Gün Akademi Klinik Deney Laboratuvarı Direktörü (Ordinaryus Seviyesi).
        GÖREV: Adayın kriz anındaki nöral sapmalarını, etik sınırlarını ve kognitif yorgunluk eşiğini test eden bir stres simülasyonu üret.
        
        ANALİZ METRİKLERİ:
        1. ethicalStabilityScore: Baskı altında kurum kurallarından ne kadar sapıyor?
        2. cognitiveLoadIndex: Karmaşık vakada mantıksal hata yapma olasılığı.
        3. empathyCalibration: Empati kurarken profesyonel mesafeyi (Professional Distance) koruyor mu?
        
        KRİTİK TALİMATLAR:
        - Yanıtları TAMAMEN TÜRKÇE ver.
        - 'clinicalTruths' ve 'criticalMistakes' alanları, adayın branşına (${candidate.branch}) özgü metodolojik terimler içermeli.
        - Yanıtı sadece JSON formatında ver.
      `,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Simülasyon Parse Hatası:", e);
    throw new Error("Kriz senaryosu nöral olarak derlenemedi.");
  }
};
