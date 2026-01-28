
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    status: { type: Type.STRING },
    reasoning: { type: Type.STRING, description: "Bu skorun adayın hangi spesifik metodolojik cevaplarına dayandığının klinik analizi. Neden bu puan verildi?" },
    behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cevaplarda saptanan mikrodavranış ve metodolojik tutum emareleri." },
    institutionalImpact: { type: Type.STRING, description: "Bu yetkinlik düzeyinin kurum kültürü ve vaka başarı oranları üzerindeki 12 aylık somut etkisi." },
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    risks: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["score", "status", "reasoning", "behavioralIndicators", "institutionalImpact", "pros", "cons", "risks"]
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Karar Destek Uzmanı.
    MODEL: Gemini 3 Flash Thinking Mode.
    
    KURUMSAL BİLGİ TABANI VE ANALİZ PROTOKOLÜ:
    Adayın beyan ettiği sertifikalar ile mülakat sorularındaki yanıtlarını aşağıdaki "Altın Standart" kriterlerine göre kıyasla:

    1. OTİZM (OSB) DİKEYİ:
       - ABA/BACB: ABC kaydında 'C' (Sonuç) davranışın gelecekteki olasılığını etkileyen olaydır. Olumsuz pekiştirme (Negative Reinforcement) itici uyaranın çekilmesidir, ceza DEĞİLDİR.
       - ETEÇOM: İlişkisel stratejiler ebeveyn-çocuk etkileşimini hedefler, masa başı akademik öğretimi değil.
       - DIR FLOORTIME: FEDL basamakları çocuğun duygusal ve iletişimsel kapasitesini ölçer.

    2. ÖĞRENME GÜÇLÜĞÜ (ÖÖG) DİKEYİ:
       - PREP/PASS: Ardıl işlem ses-harf eşlemesiyle; planlama ise strateji geliştirmeyle ilgilidir.
       - DMP: Fonolojik farkındalık okumanın nöral temelidir.

    3. DİL VE KONUŞMA DİKEYİ:
       - TEDİL: Alıcı dil (anlama) ile İfade edici dil (üretim) farkı kritiktir.
       - LIDCOMBE: Sözel tepkiler ebeveyn tarafından akıcı konuşmaları pekiştirmek için uygulanır.

    4. FİZİKSEL / DUYUSAL DİKEY:
       - AYRES S.I.: Proprioseptif sistem kas ve eklemlerden bilgi alır. Duyusal savunmacılık aşırı kaçınma tepkisidir.
       - BOBATH/NDT: Kontrol noktaları anormal tonusu inhibe etmek, normali fasilite etmek içindir.

    KRİTİK GÖREV:
    - Adayın 'allTrainings' listesinde olan bir eğitim için sorulan 'vq_' kodlu soruda hata yapması, 'socialMaskingScore'u (Sosyal Maskeleme) %30 artırmalı ve 'integrityIndex'i düşürmelidir.
    - 'detailedAnalysisNarrative' kısmında spesifik olarak: "Aday ABA uzmanı olduğunu belirtmiş ancak vq_aba_2 sorusunda olumsuz pekiştirmeyi yanlış tanımlayarak teorik bir risk teşkil etmiştir" gibi net kanıtlar sun.
    
    DİL: Tamamen Türkçe, akademik, sert ve analitik.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      integrityIndex: { type: Type.NUMBER },
      socialMaskingScore: { type: Type.NUMBER },
      summary: { type: Type.STRING },
      detailedAnalysisNarrative: { type: Type.STRING, description: "Adayın beyan ettiği sertifikalar ile teknik doğruluğu arasındaki korelasyonu içeren 300 kelimelik analiz." },
      recommendation: { type: Type.STRING },
      predictiveMetrics: {
        type: Type.OBJECT,
        properties: {
          retentionProbability: { type: Type.NUMBER },
          burnoutRisk: { type: Type.NUMBER },
          learningVelocity: { type: Type.NUMBER },
          leadershipPotential: { type: Type.NUMBER },
          evolutionPath: { type: Type.STRING, description: "Adayın kurumdaki 2. yılında geleceği muhtemel profesyonel seviye tahmini." }
        },
        required: ["retentionProbability", "burnoutRisk", "learningVelocity", "leadershipPotential", "evolutionPath"]
      },
      deepAnalysis: {
        type: Type.OBJECT,
        properties: {
          workEthics: SEGMENT_SCHEMA,
          pedagogicalAnalysis: SEGMENT_SCHEMA,
          parentStudentRelations: SEGMENT_SCHEMA,
          formality: SEGMENT_SCHEMA,
          developmentOpenness: SEGMENT_SCHEMA,
          sustainability: SEGMENT_SCHEMA,
          technicalExpertise: SEGMENT_SCHEMA,
          criticismTolerance: SEGMENT_SCHEMA,
          personality: SEGMENT_SCHEMA,
          institutionalLoyalty: SEGMENT_SCHEMA
        },
        required: ["workEthics", "pedagogicalAnalysis", "parentStudentRelations", "formality", "developmentOpenness", "sustainability", "technicalExpertise", "criticismTolerance", "personality", "institutionalLoyalty"]
      },
      swot: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          threats: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["strengths", "weaknesses", "opportunities", "threats"]
      },
      interviewGuidance: {
        type: Type.OBJECT,
        properties: {
          strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
          simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["strategicQuestions", "criticalObservations", "simulationTasks"]
      }
    },
    required: ["score", "integrityIndex", "socialMaskingScore", "summary", "detailedAnalysisNarrative", "recommendation", "predictiveMetrics", "deepAnalysis", "swot", "interviewGuidance"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ADAY VERİLERİ VE TEKNİK DOĞRULAMA YANITLARI: ${JSON.stringify(candidate)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: responseSchema
    }
  });

  return JSON.parse(response.text || '{}');
};
