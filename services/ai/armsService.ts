
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const armsService = {
  // 1. MÜFREDAT OLUŞTURMA (Aynen kalır)
  async generateIDP(staff: StaffMember, assessmentHistory: any[] = []): Promise<IDP> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Nöral Eğitim Mimarı".
      GÖREV: Personelin eksiklerini (assessmentHistory) analiz et ve "Kişiye Özel Gelişim Müfredatı" oluştur.
    `;
    const curriculumSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          focusArea: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ['basic', 'intermediate', 'advanced'] },
          status: { type: Type.STRING, enum: ['active'] },
          units: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['video', 'reading', 'simulation', 'assignment', 'supervision', 'workshop'] },
                content: { type: Type.STRING },
                durationMinutes: { type: Type.NUMBER },
                aiRationale: { type: Type.STRING },
                successCriteria: { type: Type.STRING },
                isCompleted: { type: Type.BOOLEAN }
              }
            }
          }
        }
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `STAFF: ${JSON.stringify(staff)} | HISTORY: ${JSON.stringify(assessmentHistory)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusArea: { type: Type.STRING },
            identifiedGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            curriculum: curriculumSchema,
            roadmap: { type: Type.OBJECT, properties: { shortTerm: {type:Type.STRING}, midTerm: {type:Type.STRING}, longTerm: {type:Type.STRING} } },
            milestones: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, dueDate: {type: Type.STRING} } } }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: `IDP-${Date.now()}`,
      staffId: staff.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft',
      ...data
    };
  },

  // 2. ULTRA-PRO SUNUM OLUŞTURMA
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Kreatif Yönetmen".
      GÖREV: Akademik bir konuyu, görsel olarak zengin ve pedagojik olarak etkili bir slayt setine dönüştür.
      
      KRİTİK KURALLAR:
      1. STORYTELLING: Sunum bir giriş, gelişme ve etkileşimli finalden oluşmalı.
      2. LAYOUT ZEKA: Her slaytın içeriğine göre en iyi yerleşimi (layout) seç. 
         - Örn: Karşılaştırma için 'split_left', büyük bir vaka görseli için 'full_visual'.
      3. GÖRSEL SEMANTİK: 'imageKeyword' alanı için, slaytın RUHUNU simgeleyen detaylı bir İngilizce prompt yaz. (Örn: "High-contrast cinematic shot of a neural network glowing with blue energy").
      4. ETKİLEŞİM: En az bir slaytta 'interactiveElement' (soru veya tartışma) ekle.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KONU: ${config.topic} | KİTLE: ${config.targetAudience} | TON: ${config.tone} | SLAYT: ${config.slideCount}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              layout: { type: Type.STRING, enum: ['cover', 'section_header', 'split_left', 'split_right', 'full_visual', 'bullet_list', 'quote_center', 'process_flow'] },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              speakerNotes: { type: Type.STRING },
              imageKeyword: { type: Type.STRING },
              interactiveElement: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['quiz', 'reflection', 'poll'] },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING }
                }
              }
            },
            required: ["layout", "title", "content", "imageKeyword"]
          }
        }
      }
    });

    const slides = JSON.parse(response.text || '[]');
    return slides.map((s: any, i: number) => ({ ...s, id: `S-${Date.now()}-${i}` }));
  },

  // 3. SLAYT RAFİNE ETME (REWRITE)
  async refineSlideContent(slide: TrainingSlide, intent: string): Promise<TrainingSlide> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `MEVCUT SLAYT: ${JSON.stringify(slide)} | NİYET: ${intent}`,
      config: {
        systemInstruction: "Verilen slaytı belirtilen niyet (örn: 'daha sade yap', 'veli diline çevir', 'akademik jargon ekle') doğrultusunda yeniden kurgula. Sadece güncellenmiş JSON döndür.",
        responseMimeType: "application/json"
      }
    });
    return { ...slide, ...JSON.parse(response.text || '{}') };
  }
};
