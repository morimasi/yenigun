
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport, GlobalConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    status: { type: Type.STRING },
    reasoning: { type: Type.STRING, description: "BU ALAN ÇOK ÖNEMLİ: Adayın verdiği spesifik cevaplardan yola çıkarak, bu puanı almasının KÖK NEDENİNİ (Root Cause) açıkla. Sebep-Sonuç ilişkisi kur. Örn: 'Adayın X sorusunda Y yanıtını vermesi, kriz anında donup kalacağını gösteriyor.'" },
    behavioralIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Adayın cevaplarında tespit edilen somut 'mikro-davranış' kanıtları." },
    institutionalImpact: { type: Type.STRING, description: "SEBEP-SONUÇ ANALİZİ: Bu aday işe alınırsa 6 ay içinde kurumda somut olarak ne değişir? Pozitif ve negatif etkileri net bir dille yaz." },
    pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Adayın kuruma katacağı net katma değerler." },
    cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Adayın yaratabileceği operasyonel yükler." },
    risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Dikkat edilmesi gereken kırmızı çizgiler ve potansiyel kriz noktaları." }
  },
  required: ["score", "status", "reasoning", "behavioralIndicators", "institutionalImpact", "pros", "cons", "risks"]
};

export const analyzeCandidate = async (candidate: Candidate, config: GlobalConfig): Promise<AIReport> => {
  const systemInstruction = `
    ROL: Yeni Gün Akademi Baş Klinik Denetçisi ve Stratejik İK Danışmanı.
    GÖREV: Adayın verilerini "Derinlemesine Akademik Otopsi" protokolü ile analiz et.
    
    ANALİZ PRENSİPLERİ (ÇOK ÖNEMLİ):
    1. YÜZEYSELLİK YASAKTIR: "Aday iyidir" gibi cümleler kurma. "Adayın 3. soruda ABC kaydı yerine sezgisel yanıt vermesi, veri temelli çalışmadığını ve metodolojik körlük yaşadığını kanıtlar" gibi sebep-sonuç odaklı konuş.
    2. SEBEP & SONUÇ ZİNCİRİ: Her tespiti bir kanıta dayandır ve sonucunu kurumsal etkiyle bağla. (Kanıt -> Analiz -> Kurumsal Sonuç).
    3. RİSK VE TAVSİYE: Sadece durumu tespit etme, ne yapılması gerektiğini de söyle. "Bu adayı işe alırsanız, ilk 2 ay yoğun süpervizyon gerekir" gibi.
    4. DİL VE TON: Üst düzey akademik, profesyonel, net, süslü kelimelerden arındırılmış, analitik Türkçe.

    ÖZEL İNCELEME ALANLARI:
    - CV vs BEYAN: Yüklenen CV (varsa) ile adayın verdiği cevaplar arasındaki tutarsızlıkları (örn: 5 yıl deneyim deyip temel terimleri bilmemesi) acımasızca raporla.
    - ETİK DİRENÇ: Adayın "özel ders", "hediye kabulü" gibi tuzak sorulara verdiği yanıtları ahlaki ve kurumsal güvenlik açısından parçala.
    - KLİNİK DERİNLİK: Aday teoriyi mi ezberlemiş yoksa sahada mı pişmiş? Bunu cevapların detayından çıkar.

    ÇIKTI FORMATI:
    - Tüm analizler, yöneticinin tek okuyuşta karar verebileceği netlikte ve derinlikte olmalı.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      integrityIndex: { type: Type.NUMBER },
      socialMaskingScore: { type: Type.NUMBER },
      summary: { type: Type.STRING, description: "Adayın genel profilinin, artı ve eksileriyle birlikte 3 cümlelik yönetici özeti." },
      detailedAnalysisNarrative: { type: Type.STRING, description: "Adayın zihinsel haritasını, metodolojik yaklaşımını ve kişilik özelliklerini birleştiren 300 kelimelik, detaylı, sebep-sonuç ilişkili kompozisyon." },
      recommendation: { type: Type.STRING, description: "NET KARAR TAVSİYESİ: İşe Al / Reddet / Havuza Al. Ve bunun tek cümlelik en güçlü gerekçesi." },
      predictiveMetrics: {
        type: Type.OBJECT,
        properties: {
          retentionProbability: { type: Type.NUMBER },
          burnoutRisk: { type: Type.NUMBER },
          learningVelocity: { type: Type.NUMBER },
          leadershipPotential: { type: Type.NUMBER },
          evolutionPath: { type: Type.STRING, description: "Gelecek Projeksiyonu: Aday 24 ay sonra nerede olacak? Lider mi, tükenmiş mi, stabil mi? Sebepleriyle anlat." }
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
          strategicQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Adayın zayıf noktalarını hedefleyen ve 'Neden bu soruyu soruyoruz?' bilgisini içeren stratejik mülakat soruları." },
          criticalObservations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Mülakatçının adayın beden dilinde veya ses tonunda özellikle dikkat etmesi gereken uyarılar." },
          simulationTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["strategicQuestions", "criticalObservations", "simulationTasks"]
      }
    },
    required: ["score", "integrityIndex", "socialMaskingScore", "summary", "detailedAnalysisNarrative", "recommendation", "predictiveMetrics", "deepAnalysis", "swot", "interviewGuidance"]
  };

  // CV verisini JSON string'den ayırarak Token tasarrufu yapalım ve temiz bir JSON gönderelim.
  const { cvData, ...candidateWithoutCV } = candidate;
  
  const contents: any[] = [
    { text: `ADAY BEYAN VE YANITLARI: ${JSON.stringify(candidateWithoutCV)}` }
  ];

  // Eğer CV varsa, onu MULTIMODAL olarak ekle (Metin değil, doğrudan dosya verisi)
  if (cvData && cvData.base64) {
    contents.push({
      inlineData: {
        mimeType: cvData.mimeType,
        data: cvData.base64
      }
    });
    contents.push({ text: "Ekli belge adayın CV'sidir. Lütfen bu belgeyi adayın yukarıdaki beyanlarıyla (deneyim yılı, mezuniyet, sertifikalar) karşılaştır ve tutarlılık analizi yap." });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: contents, 
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 },
      responseSchema: responseSchema
    }
  });

  return JSON.parse(response.text || '{}');
};
