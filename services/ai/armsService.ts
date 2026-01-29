
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const armsService = {
  async generateIDP(staff: any): Promise<IDP> {
    // Personelin test geçmişini ve ai_tag'lerini konsolide et
    const assessmentSummary = staff.assessments?.map((a: any) => ({
      battery: a.battery_id,
      score: a.score,
      tags: a.ai_tags,
      timestamp: a.timestamp
    })) || [];

    const systemInstruction = `
      ROL: Yeni Gün Akademi Kıdemli Akademik Mentor ve Nöral Gelişim Stratejisti.
      GÖREV: Personelin değerlendirme verilerini analiz et ve 12 aylık Bireysel Gelişim Planı (IDP) oluştur.
      
      ANALİZ PROTOKOLÜ:
      1. Veri Madenciliği: Personelin düşük skor aldığı (özellikle %50 altı) testlerdeki "ai_tags"leri odak noktası yap.
      2. Klinik Tahkim: Eğer personel sürekli "boundary_failure" veya "low_stress_tolerance" etiketleri alıyorsa, etik ve kriz yönetimi odaklı bir roadmap kur.
      3. Uzmanlık Yörüngesi: Branşına (${staff.branch}) özel en güncel metodolojileri (örn: DIR-202, ABA-Advanced Data) roadmap'e ekle.
      
      TON: Otoriter, akademik, teşvik edici ve derinlemesine klinik.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `PERSONEL PROFİLİ: ${JSON.stringify(staff.profile)}
                 TEST GEÇMİŞİ VE ETİKETLER: ${JSON.stringify(assessmentSummary)}
                 GÖREV: Bu verileri çapraz sorgulayarak "Nöral Gelişim Planı"nı JSON olarak üret.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusArea: { type: Type.STRING, description: "Personelin en kritik zayıf halkası üzerine kurulu ana odak alanı." },
            identifiedGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Saptanan somut klinik boşluklar." },
            roadmap: {
              type: Type.OBJECT,
              properties: {
                shortTerm: { type: Type.STRING, description: "İlk 3 ayda yapılması gereken acil müdahaleler." },
                midTerm: { type: Type.STRING, description: "3-6 ay arası uzmanlık derinleşmesi." },
                longTerm: { type: Type.STRING, description: "12 ay sonundaki akademik hedef." }
              },
              required: ["shortTerm", "midTerm", "longTerm"]
            },
            recommendedTrainings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Okunması gereken literatür veya alınması gereken akreditasyonlar." }
          },
          required: ["focusArea", "identifiedGaps", "roadmap", "recommendedTrainings"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: Math.random().toString(36).substr(2, 9),
      staffId: staff.id,
      createdAt: Date.now(),
      ...data
    };
  },

  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    // Legacy support for older IDP calls
    const config: PresentationConfig = {
        topic: `Bireysel Gelişim: ${idp.focusArea}`,
        targetAudience: 'individual',
        tone: 'academic',
        depth: 'intermediate',
        slideCount: 5
    };
    return this.generateCustomPresentation(config, { idpData: idp, branch });
  },

  /**
   * YENİ NESİL SUNUM MOTORU (NEURAL PRESENTATION ENGINE)
   * Tamamen özelleştirilebilir, derinlikli ve interaktif sunumlar üretir.
   */
  async generateCustomPresentation(config: PresentationConfig, contextData?: any): Promise<TrainingSlide[]> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi Akademik Direktörü ve Eğitim Teknoloğu.
      GÖREV: Verilen parametrelere göre üst düzey, modern ve klinik derinliği olan bir eğitim sunumu hazırla.
      
      SUNUM KONFİGÜRASYONU:
      - KONU: ${config.topic}
      - HEDEF KİTLE: ${config.targetAudience} (Dil ve üslubu buna göre ayarla. Veli ise empatik ve net, Ekip ise teknik ve motive edici).
      - TON: ${config.tone}
      - DERİNLİK: ${config.depth} (Expert ise temel tanımları geç, vaka analizine odaklan).
      - SLAYT SAYISI: ${config.slideCount}
      
      BAĞLAM VERİSİ (Varsa): ${JSON.stringify(contextData || {})}
      
      TALİMATLAR:
      1. Her slayt bir amaca hizmet etmeli. Boş laf yok.
      2. 'speakerNotes': Sunumu yapan yöneticiye, slaytı anlatırken kullanacağı "içgörü" ve "anekdot" notları ver.
      3. 'interactiveElement': Slaytı pasiflikten çıkaracak bir soru, tartışma veya rol yapma görevi ekle.
      4. DİL: Kusursuz Türkçe, akademik terminolojiye hakim.
    `;

    const slideSchema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['title', 'content', 'case', 'interaction'] },
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        content: { type: Type.ARRAY, items: { type: Type.STRING } },
        speakerNotes: { type: Type.STRING, description: "Sunucunun ekrana bakmadan söyleyeceği derinlikli notlar." },
        visualPrompt: { type: Type.STRING, description: "Bu slayt için oluşturulabilecek görselin kısa betimlemesi (örn: 'Brain scan showing amygdala activity')." },
        interactiveElement: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            expectedAnswer: { type: Type.STRING },
            misconception: { type: Type.STRING, description: "Bu konuda sık yapılan yanlış inanç." }
          },
          nullable: true
        }
      },
      required: ["id", "type", "title", "content", "speakerNotes", "visualPrompt"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Yukarıdaki konfigürasyona uygun ${config.slideCount} adet slayt üret. Çıktı bir JSON Array olsun.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 28000 },
        responseSchema: {
          type: Type.ARRAY,
          items: slideSchema
        }
      }
    });

    return JSON.parse(response.text || '[]');
  }
};
