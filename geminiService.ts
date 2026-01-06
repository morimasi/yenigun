
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIReport } from "./types";

export const generateCandidateAnalysis = async (candidate: Candidate): Promise<AIReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Sen "Yeni Gün Akademi" için Üst Düzey Klinik İK ve Teknik Değerlendirme Uzmanısın. 
    Özel eğitim ve rehabilitasyon alanında derin uzmanlığa sahipsin.

    ADAYIN MASKESİNİ DÜŞÜR VE DERİN ANALİZ YAP:

    1. ÖZEL EĞİTİM YETKİNLİK ANALİZİ:
       - CV'de şu kritik sertifikaları ve metotları ara: ABA (Uygulamalı Davranış Analizi), PECS, Floortime, Duyu Bütünleme, ETEÇOM, Denver II, vb.
       - Adayın çalıştığı tanı gruplarını (OSB, Down Sendromu, CP, Özgül Öğrenme Güçlüğü) ve bu gruplardaki vaka deneyimini süz.
       - Bilimsel veri temelli eğitim (grafik tutma, veri analizi) konusundaki disiplinini ölç.

    2. CV "RED FLAG" (KRİTİK RİSK) DEDEKTÖRÜ:
       - Kariyer boşluklarını, çok sık iş değiştirmeyi (kurumsal aidiyet sorunu) ve jenerik/kopyala-yapıştır görev tanımlarını yakala.
       - CV'deki iddialı yetkinlikler ile "Profesyonel Vakalar" bölümündeki pratik cevaplar arasındaki çelişkileri bul.
       - Eğitimin sürekliliğine (sürekli gelişim) dair bir iz yoksa bunu zayıf yön olarak işaretle.

    3. SOSYAL BEĞENİLİRLİK (MASKELENME) ANALİZİ:
       - Adayın cevapları "teorik olarak mükemmel" mi yoksa "otantik ve gerçekçi" mi? 
       - Eğer cevaplar bir kitaptan alınmış gibi kusursuzsa, adayın stres altında gerçek kişiliğini saklama eğiliminde olduğunu belirt.

    4. PSİKOLOJİK DAYANIKLILIK VE ETİK:
       - Özel eğitimde tükenmişlik riski yüksektir. Adayın sabır, empati ve sınır yönetimi kapasitesini verilen cevaplardan çıkar.
       - Kurumsal hiyerarşi ve etik ikilemlere verdiği tepkileri "Yeni Gün Akademi"nin yüksek standartlarıyla (dürüstlük, şeffaflık, çocuk odaklılık) kıyasla.

    SWOT ANALİZİNDE ACIMASIZ VE DÜRÜST OL:
    - "Tehditler" kısmına adayın kuruma verebileceği olası zararları (veliye yanlış yaklaşım, ekip içi uyumsuzluk, düşük klinik performans) açıkça yaz.
  `;

  const textPrompt = `
    ADAY PROFİLİ:
    İsim: ${candidate.name}
    Branş: ${candidate.branch}
    Deneyim: ${candidate.experienceYears} yıl
    
    ADAYIN VERDİĞİ CEVAPLAR (Vaka Analizleri ve Etik İkilemler):
    ${JSON.stringify(candidate.answers, null, 2)}
    
    GÖREV:
    Yukarıdaki verileri ve (varsa) ekteki CV dosyasını analiz ederek; adayın klinik becerisini, özel eğitim vizyonunu ve karakter bütünlüğünü raporla. 
    CV'deki teknik terimleri, sertifikaları ve geçmiş iş tecrübelerini, verdiği vaka cevaplarıyla harmanla.
  `;

  const contents: any[] = [{ text: textPrompt }];

  if (candidate.cvData) {
    contents.push({
      inlineData: {
        data: candidate.cvData.base64,
        mimeType: candidate.cvData.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { parts: contents },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "100 üzerinden genel profesyonel uygunluk puanı" },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Klinik ve karakter güçleri" },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Gelişim alanları ve kısıtlı yetkinlikler" },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Kuruma katabileceği değerler" },
              threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Kritik riskler, davranışsal zaaflar ve red flag'ler" }
            }
          },
          competencies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Yetkinlik adı (örn: Klinik Analiz, Sabır, Kurumsal Sadakat)" },
                value: { type: Type.NUMBER, description: "100 üzerinden değer" }
              }
            }
          },
          summary: { type: Type.STRING, description: "Adayın profesyonel özeti" },
          cvSummary: { type: Type.STRING, description: "CV'deki teknik detayların, sertifikaların ve deneyim süresinin analizi" },
          recommendation: { type: Type.STRING, description: "İşe alım komisyonuna nihai, net ve dürüst tavsiye" }
        },
        required: ["score", "swot", "competencies", "summary", "recommendation"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as AIReport;
};
