
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractPureJSON = (text: string): any => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace === -1) return null;
    let jsonStr = lastBrace > firstBrace ? cleanText.substring(firstBrace, lastBrace + 1) : cleanText.substring(firstBrace);
    const parsed = JSON.parse(jsonStr);
    if (!parsed.deepAnalysis) parsed.deepAnalysis = {};
    return parsed;
  } catch (e) { 
    console.error("MIA Matrix Engine Error:", e);
    return null; 
  }
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  // AI PERSONALITY INJECTION: ULTRA-CLINICAL MODE
  const persona = config.aiPersona || { skepticismLevel: 50, innovationBias: 50, detailedReporting: true };
  
  const systemInstruction = `
    ROL: Yeni Gün Akademi "Baş Klinik Denetçi" ve "Akademik Kurul Başkanı".
    GÖREV: Adayın verdiği cevapları bir mülakatçı gibi değil, bir "Klinik Dedektif" gibi analiz et. Yüzeysel yorumları yasaklıyorum.
    
    ANALİZ BOYUTLARI (DERİN MUHAKEME GEREKLİDİR):
    
    1. REASONING (NEDENSELLİK):
       - Aday neden A şıkkını değil de B şıkkını seçti? 
       - Bu seçimin arkasındaki nöral ve bilişsel süreç nedir?
       - Cevap, adayın hangi klinik açığını veya ustalığını ifşa ediyor?
       - "İyi cevap verdi" deme. "Adayın X duruma yaklaşımı, Y teorisindeki Z prensibiyle örtüşmektedir" şeklinde analiz et.

    2. CLINICAL NUANCES (KLİNİK NÜANSLAR & GİZLİ VERİ):
       - Satır aralarını oku. Adayın cevabında gizli bir "Tükenmişlik", "Ego", "Ezbercilik" veya "Sorumluluktan Kaçış" emaresi var mı?
       - Mikro-davranış tahmini yap. Bu aday kriz anında donar mı, savaşır mı?

    3. LITERATURE REFERENCE (LİTERATÜR & TEORİ):
       - Adayın yaklaşımını akademik bir temele oturt. (Örn: Skinner'ın Pekiştirme Tarifesi, Piaget'nin Bilişsel Şemaları, Vygotsky'nin ZPD'si, Bowlby'nin Bağlanma Teorisi).
       - Bu cevap hangi ekole (Davranışçı, Hümanist, Nörogelişimsel) daha yakın?

    4. TEAM IMPACT (MOLEKÜLER EKİP ETKİSİ):
       - Bu kişi ekibe girerse "Kanserleşen Hücre" mi olur yoksa "İyileştirici Antikor" mu?
       - Junior uzmanları eğitir mi yoksa onları ezer mi?
       - Kurumsal kültürü bozar mı yoksa güçlendirir mi? Fütüristik bir tahmin yap.

    ÇIKTI FORMATI:
    - Kesinlikle saf JSON formatında olmalı.
    - Dil: Akademik, Keskin, Analitik Türkçe.
    - Asla "Genel olarak iyi" gibi yuvarlak laflar etme. Veriye ve teoriye dayan.
  `;

  // --- SCHEMA DEFINITION (ENFORCED DEPTH) ---
  const segmentSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      status: { type: Type.STRING, enum: ["OPTIMAL", "EXCEPTIONAL", "RISK", "BORDERLINE"] },
      reasoning: { 
        type: Type.STRING, 
        description: "En az 3 cümlelik, sebep-sonuç ilişkisi kuran derin klinik gerekçelendirme." 
      },
      clinicalNuances: { 
        type: Type.STRING, 
        description: "Adayın cevabından çıkarılan gizli psikolojik ve mesleki profil analizi." 
      },
      literatureReference: { 
        type: Type.STRING, 
        description: "Adayın yaklaşımının dayandığı spesifik akademik teori veya kuram (Örn: Bandura Sosyal Öğrenme)." 
      },
      teamImpact: { 
        type: Type.STRING, 
        description: "Adayın kurum kültürüne ve ekip dinamiğine olası pozitif/negatif etkisinin simülasyonu." 
      },
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      risks: { type: Type.ARRAY, items: { type: Type.STRING } },
      behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["score", "status", "reasoning", "clinicalNuances", "literatureReference", "teamImpact", "pros", "risks", "behavioralIndicators"]
  };

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
          evolutionPath: { type: Type.STRING },
          trajectory: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.NUMBER },
                meritScore: { type: Type.NUMBER },
                burnoutRisk: { type: Type.NUMBER },
                competencyLevel: { type: Type.STRING },
                strategicAdvice: { type: Type.STRING }
              }
            }
          }
        }
      },
      deepAnalysis: {
        type: Type.OBJECT,
        properties: {
          technicalExpertise: segmentSchema,
          pedagogicalAnalysis: segmentSchema,
          crisisResilience: segmentSchema,
          parentStudentRelations: segmentSchema,
          workEthics: segmentSchema,
          institutionalLoyalty: segmentSchema,
          developmentOpenness: segmentSchema,
          sustainability: segmentSchema,
          cognitiveAgility: segmentSchema,
          metacognitiveAwareness: segmentSchema
        },
        // Tüm kategorilerin eksiksiz doldurulmasını zorunlu kılıyoruz
        required: [
            "technicalExpertise", "pedagogicalAnalysis", "crisisResilience", 
            "parentStudentRelations", "workEthics", "institutionalLoyalty", 
            "developmentOpenness", "sustainability", "cognitiveAgility", "metacognitiveAwareness"
        ]
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
      interviewGuidance: {
        type: Type.OBJECT,
        properties: {
          strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
          simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    required: ["score", "integrityIndex", "summary", "deepAnalysis", "predictiveMetrics"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ text: `ADAY VERİLERİ (DETAYLI ANALİZ İÇİN): ${JSON.stringify(candidate)}` }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 }, // Maksimum düşünme bütçesi ile derinlik artırılır
      responseSchema: responseSchema
    }
  });

  const parsed = extractPureJSON(response.text);
  if (!parsed) throw new Error("MIA_AI_SCHEMA_FAILURE");
  
  // Mapping Corrections (Eğer model farklı isimlendirme yaparsa düzeltecek haritalama)
  if(parsed.deepAnalysis) {
      // Ensure specific keys are mapped correctly if the AI uses synonyms
      const da = parsed.deepAnalysis;
      if(!da.pedagogicalAnalysis && da.pedagogicalAgility) da.pedagogicalAnalysis = da.pedagogicalAgility;
      if(!da.parentStudentRelations && da.parentalDiplomacy) da.parentStudentRelations = da.parentalDiplomacy;
      if(!da.developmentOpenness && da.cognitiveAgility) da.developmentOpenness = da.cognitiveAgility;
      if(!da.sustainability && da.stabilityFactor) da.sustainability = da.stabilityFactor;
  }

  return parsed;
};
