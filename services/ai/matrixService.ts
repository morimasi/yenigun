
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
    MODEL: Gemini 3 Flash Deep Analysis.
    
    GENİŞLETİLMİŞ KURUMSAL BİLGİ TABANI VE ANALİZ PROTOKOLÜ:
    Adayın 'allTrainings' listesinde beyan ettiği sertifikalar ile mülakat sorularındaki 'vq_' kodlu teknik doğrulama yanıtlarını aşağıdaki "Akademik Çapraz Sorgu" protokolüne göre işle:

    1. ABA DİKEYİ (5 KRİTER):
       - ABC: C, gelecekteki davranış olasılığını etkiler.
       - Negatif Pekiştirme: Davranışı ARTIRIR (itici uyaran çekilir). Ceza DEĞİLDİR.
       - Prompt Fading: Bağımlılığı önlemek için zorunludur.
       - Extinction Burst: Sönme öncesi şiddet artışıdır, sürecin parçasıdır.
       - Generalization: Sürecin sonu değil, başından itibaren planlanmalıdır.

    2. ETEÇOM DİKEYİ (5 KRİTER):
       - Temel: Ebeveyn-çocuk etkileşimi, akademik masa başı değil.
       - Ortak Dikkat: Dil ve sosyal gelişimin temelidir.
       - Uzman Rolü: Sadece eğitmen değil, "Ebeveyn Koçu"dur.
       - Karşılıklılık: Sıra alma ve etkileşim döngüleriyle ölçülür.
       - Yaş: 0-6 yaş erken müdahale merkezlidir.

    3. DIR FLOORTIME DİKEYİ (5 KRİTER):
       - FEDL: Duygusal gelişim basamaklarıdır.
       - Bireysel Farklılık: Duyusal profil ve motor planlamadır.
       - Liderliği Takip: Ortak dünya kurma stratejisidir.
       - İletişim Döngüleri: Jeste jestle karşılık vererek açılır.
       - Regülasyon: Duyusal profilin bilinmesi regülasyonun ilk adımıdır.

    4. PREP & PASS DİKEYİ (10 KRİTER):
       - Ardıl İşlem (Successive): Ses-harf ve kodlama ile ilgilidir.
       - Eşzamanlı İşlem (Simultaneous): Sentez ve anlamlandırma ile ilgilidir.
       - Planlama: Metabilişsel strateji ve hata kontrolüdür.
       - Dikkat: Seçici odaklanma ve dirençtir.
       - Bilişsel Zayıflık: Tek bir işlemleme sürecinin düşüklüğüdür (IQ düşüklüğü değil).

    5. TEDİL & DUYU BÜTÜNLEME (10 KRİTER):
       - Alıcı vs İfade Edici: Anlama ve üretim farkı.
       - Norm Tabloları: Kronolojik yaşa göre standart puan dönüşümü.
       - Propriosepsiyon: Kas, eklem ve bağ doku girdisi.
       - Praksis: İdeasyon, planlama ve uygulama üçlüsüdür.

    ANALİZ KURALLARI:
    - Sertifikası olup 'vq_' sorusuna yanlış cevap veren adayda 'socialMaskingScore' %30 artmalı.
    - 'detailedAnalysisNarrative' içinde spesifik kodlarla eleştiri yap (Örn: "vq_aba_2 sorusunda pekiştirme ve cezayı karıştıran aday klinik risk taşımaktadır").
    - Dil: Tamamen Türkçe, sert, akademik ve veri odaklı.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      integrityIndex: { type: Type.NUMBER },
      socialMaskingScore: { type: Type.NUMBER },
      summary: { type: Type.STRING },
      detailedAnalysisNarrative: { type: Type.STRING },
      recommendation: { type: Type.STRING },
      predictiveMetrics: {
        type: Type.OBJECT,
        properties: {
          retentionProbability: { type: Type.NUMBER },
          burnoutRisk: { type: Type.NUMBER },
          learningVelocity: { type: Type.NUMBER },
          leadershipPotential: { type: Type.NUMBER },
          evolutionPath: { type: Type.STRING }
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
