
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    status: { type: Type.STRING },
    reasoning: { type: Type.STRING, description: "Seçilen 4 seçenekli cevapların hangisinin klinik/etik olarak 'altın standart' olduğunu ve adayın neden bu tercihi yaptığının analizi." },
    behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cevap örüntülerinden saptanan mikro-davranışsal eğilimler." },
    institutionalImpact: { type: Type.STRING, description: "Adayın bu boyuttaki yetkinliğinin kurumun operasyonel verimliliği üzerindeki net etkisi." },
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
    
    ANALİZ PROTOKOLÜ (MİA V5):
    Adayın 4 seçenek arasından yaptığı seçimleri aşağıdaki akademik filtrelerden geçirerek liyakat matrisini oluştur:

    1. ETİK & VELİ YÖNETİMİ (Kritik Sınır Analizi):
       - Veli ile sosyal medya iletişimi, kurum dışı seans teklifi ve meslektaş eleştirisi sorularına verilen yanıtları "Sınır Koruma" (Boundary Protection) ölçeğinde değerlendir.
       - "Profesyonel Mesafe"yi koruyamayan adaylar için 'Integrity Index' puanını düşür.

    2. DİRENÇ & TAKIM UYUMU (Psikolojik Dayanıklılık):
       - Krizli seans yönetimi, eleştiriye tolerans ve çatışma yönetimi yanıtlarını "Burnout Resistance" (Tükenmişlik Direnci) ekseninde işle.
       - Eleştiriyi "Kişisel Saldırı" olarak gören veya krizden kaçınan adaylarda 'Sustainability' puanını düşük tut.

    3. VİZYON & SADAKAT (Gelişim Potansiyeli):
       - Akademik literatür takibi, teknoloji adaptasyonu ve 3 yıllık kariyer planı yanıtlarını "Learning Velocity" (Öğrenme Hızı) olarak etiketle.
       - Kendi merkezini açma planı olan veya statükocu adaylarda 'Institutional Loyalty' riskini raporla.

    4. KLİNİK TEKNİK (ABA & ETEÇOM):
       - 4 seçenekli sorularda en doğru (Golden) cevabı seçip seçmediğini denetle.
       - Yanlış teknik terim kullanımı 'Social Masking' (Maskeleme) skorunu %40 artırır.

    DİL VE ÜSLUP:
    - Analitik, akademik, sert ve veri odaklı ol. 
    - Varsayımlar üzerinden değil, adayın 'answers' verisindeki somut tercihler üzerinden nedensellik kur.
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
    contents: `ADAYIN TÜM CEVAPLARI VE PROFİLİ: ${JSON.stringify(candidate)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: responseSchema
    }
  });

  return JSON.parse(response.text || '{}');
};
