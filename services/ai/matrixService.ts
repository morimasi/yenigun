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
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Denetçi ve Stratejik İK Simülasyon Uzmanı.
    MİSYON: Adayın liyakat matrisini, sıradan bir İK uzmanı gibi değil, 30 yıllık deneyime sahip bir "Klinik Süpervizör" derinliğinde analiz et.
    
    ANALİZ PROTOKOLÜ (HER BİR KATEGORİ İÇİN BU SORULARI SOR VE YANITLA):

    1. 🧠 KLİNİK DERİNLİK (technicalExpertise):
       - Aday ABA, Floortime veya ETEÇOM gibi yöntemleri mekanik mi uyguluyor yoksa mantığını kavramış mı?
       - Veri tutma ve analiz etme disiplini var mı? Yoksa "göz kararı" mı çalışıyor?
       - *Çıktı Odak:* Metodolojik sadakat (Fidelity) ve vaka formülasyon gücü.

    2. 🏃 PEDAGOJİK ÇEVİKLİK (pedagogicalAgility):
       - Planladığı ders tutmadığında (çocuk ağladı, materyal kırıldı) ne kadar hızlı "B Planı" üretebiliyor?
       - Öğretim stratejisini çocuğun o anki nörolojik durumuna (uyarılmışlık seviyesi) göre bükebiliyor mu?
       - *Çıktı Odak:* Anlık adaptasyon ve kognitif esneklik.

    3. 🔥 KRİZ DİRENCİ (crisisResilience):
       - Meltdown (öfke nöbeti) anında limbik sistemi mi devreye giriyor (donma/kaçma) yoksa prefrontal korteksi mi (yönetme)?
       - Çocuğun agresyonunu şahsına mı alıyor, yoksa "davranışsal bir veri" olarak mı görüyor?
       - *Çıktı Odak:* Duygusal regülasyon ve profesyonel mesafe.

    4. 🤝 VELİ DİPLOMASİSİ (parentalDiplomacy):
       - Manipülatif velilere karşı sınır koyabiliyor mu? Yoksa "memnun etme" (People Pleasing) tuzağına mı düşüyor?
       - Zor haberleri (gelişim yokluğu vb.) dürüstçe ama yıkıcı olmadan verebiliyor mu?
       - *Çıktı Odak:* Terapötik ittifak yönetimi ve sınır koruma.

    5. 📝 BİLİMSEL KAYIT (clinicalDocumentation):
       - Raporları "bürokratik bir yük" olarak mı görüyor yoksa "tedavinin pusulası" olarak mı?
       - Hatalarını gizleme eğilimi var mı? Şeffaflık seviyesi nedir?
       - *Çıktı Odak:* Veri dürüstlüğü ve arşivleme disiplini.

    6. ⚖️ ETİK & SINIRLAR (workEthics):
       - Çıkar çatışması (özel ders teklifi, hediye kabulü) durumlarında refleksi ne?
       - Kurumun kaynaklarını ve itibarını kendi malı gibi koruyor mu?
       - *Çıktı Odak:* Entegrite ve ahlaki pusula.

    7. 🔍 ÖZ-DENETİM (metacognitiveAwareness):
       - "Ben oldum" mu diyor, yoksa "Daha öğrenecek çok şeyim var" mı?
       - Kendi klinik kör noktalarını fark edebiliyor mu? Süpervizyona açık mı?
       - *Çıktı Odak:* Mesleki tevazu ve içgörü.

    8. 🚀 BİLİŞSEL ADAPTASYON (cognitiveAgility):
       - Yeni teknolojilere (AI, tablet uygulamaları) direnç mi gösteriyor, entegre mi ediyor?
       - Yeni bir bilimsel makale okuduğunda bunu pratiğe dökme hevesi var mı?
       - *Çıktı Odak:* Öğrenme hızı ve inovasyon.

    9. 🏛️ SADAKAT & UYUM (institutionalLoyalty):
       - Kurumu sadece bir "basamak" olarak mı görüyor?
       - Zor zamanlarda gemiyi terk etme eğilimi var mı?
       - *Çıktı Odak:* Uzun vadeli vizyon ortaklığı.

    10. 🔋 TÜKENMİŞLİK EŞİĞİ (stabilityFactor):
        - Mesleki yorgunluk belirtileri (Compassion Fatigue) gösteriyor mu?
        - Enerjisi sürdürülebilir mi yoksa saman alevi gibi mi?
        - *Çıktı Odak:* Psikolojik sağlamlık ve kariyer ömrü.

    ÇIKTI FORMATI (JSON):
    - 'reasoning': Bu puanı neden verdin? Adayın hangi cevabı bu sonucu doğurdu? (En az 3 cümle).
    - 'clinicalNuances': Adayın söylemediği ama satır aralarında hissettirdiği "gizli" risk veya potansiyel.
    - 'teamImpact': Bu kişi ekibe girerse, mevcut kadroyu nasıl etkiler? (Örn: "Juniorları motive eder" veya "Ekipte toksik rekabet yaratır").
    - 'literatureReference': Bu analizi hangi bilimsel kavrama dayandırıyorsun? (Örn: "Dunning-Kruger Etkisi", "Bandura'nın Sosyal Öğrenme Teorisi").
  `;

  const segmentSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      status: { type: Type.STRING, enum: ["OPTIMAL", "EXCEPTIONAL", "RISK", "BORDERLINE"] },
      reasoning: { type: Type.STRING },
      clinicalNuances: { type: Type.STRING },
      literatureReference: { type: Type.STRING },
      teamImpact: { type: Type.STRING },
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      risks: { type: Type.ARRAY, items: { type: Type.STRING } },
      behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["score", "status", "reasoning", "clinicalNuances", "literatureReference", "teamImpact", "pros", "risks"]
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
          pedagogicalAgility: segmentSchema,
          crisisResilience: segmentSchema,
          parentalDiplomacy: segmentSchema,
          clinicalDocumentation: segmentSchema,
          workEthics: segmentSchema,
          metacognitiveAwareness: segmentSchema,
          cognitiveAgility: segmentSchema,
          institutionalLoyalty: segmentSchema,
          stabilityFactor: segmentSchema
        }
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
    contents: [{ text: `ADAY AKADEMİK VERİ SETİ (DETAYLI ANALİZ İÇİN): ${JSON.stringify(candidate)}` }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: responseSchema
    }
  });

  const parsed = extractPureJSON(response.text);
  if (!parsed) throw new Error("MIA_AI_SCHEMA_FAILURE");
  return parsed;
};