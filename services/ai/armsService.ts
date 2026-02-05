
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const armsService = {
  // 1. MÜFREDAT OLUŞTURMA (IDP)
  async generateIDP(staff: StaffMember, assessmentHistory: any[] = []): Promise<IDP> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Nöral Eğitim Mimarı".
      GÖREV: Personelin eksiklerini (assessmentHistory) analiz et ve "Kişiye Özel Gelişim Müfredatı" (Curriculum) oluştur.
      MODEL: Gemini 3 Flash Thinking.
      PRENSİPLER: Tanısal, Modüler, Çeşitli ve Kaynak Destekli.
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
                isCompleted: { type: Type.BOOLEAN },
                resources: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['pdf', 'video', 'article', 'book'] },
                            title: { type: Type.STRING },
                            url: { type: Type.STRING }
                        }
                    }
                }
              },
              required: ["id", "title", "type", "content", "durationMinutes", "aiRationale", "isCompleted", "successCriteria"]
            }
          }
        },
        required: ["id", "title", "focusArea", "difficulty", "status", "units"]
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `STAFF: ${JSON.stringify({ name: staff.name, branch: staff.branch, exp: staff.experience_years })} | HISTORY: ${JSON.stringify(assessmentHistory)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusArea: { type: Type.STRING },
            identifiedGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiAnalysisSummary: { type: Type.STRING },
            curriculum: curriculumSchema,
            roadmap: {
                type: Type.OBJECT,
                properties: { shortTerm: {type:Type.STRING}, midTerm: {type:Type.STRING}, longTerm: {type:Type.STRING} }
            },
            recommendedTrainings: { type: Type.ARRAY, items: { type: Type.STRING } },
            milestones: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, dueDate: {type: Type.STRING} } }
            }
          },
          required: ["focusArea", "identifiedGaps", "aiAnalysisSummary", "curriculum", "roadmap", "recommendedTrainings", "milestones"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    // ID Sanitization
    if(data.curriculum) {
        data.curriculum.forEach((mod: any, i: number) => {
            mod.id = `MOD-${Date.now()}-${i}`;
            mod.units.forEach((u: any, j: number) => {
                u.id = `UNIT-${Date.now()}-${i}-${j}`;
                u.isCompleted = false;
                u.status = 'pending';
            });
        });
    }

    return {
      id: `IDP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      staffId: staff.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft',
      ...data,
      milestones: data.milestones?.map((m: any) => ({ ...m, isCompleted: false })) || []
    };
  },

  // 2. SUNUM OLUŞTURMA (GELİŞMİŞ)
  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Kreatif Direktörü" ve "Öğretim Tasarımcısı".
      GÖREV: Verilen konuyu, belirtilen hedef kitle ve ton için ultra profesyonel bir sunuma dönüştür.
      MODEL: Gemini 3 Flash Multimodal.
      
      TASARIM FELSEFESİ:
      1. AKIŞ (FLOW): Sunum bir hikaye gibi akmalı. Giriş (Hook), Gelişme (Konsept), Örnek (Case), Sonuç (Call to Action).
      2. GÖRSEL ZEKA: 'imageKeyword' alanı için, slaytın içeriğini en iyi simgeleyen, soyut ve sanatsal bir İngilizce "Prompt" oluştur. Bu prompt, AI Image Generator için kullanılacak.
         Örnek: "Cinematic shot of a glowing brain neural network, blue and orange lighting, high detail, 8k" veya "Minimalist vector art of a teacher helping a child, warm colors".
      3. PEDAGOJİ: Slaytlar sadece bilgi vermesin, soru sorsun (Interactive) ve düşündürsün.
      
      LAYOUT KURALLARI:
      - 'cover': Sadece başlık ve çok güçlü bir görsel.
      - 'split_left/right': Konsept ve görsel dengesi.
      - 'full_visual': Duygusal etki için.
      - 'quote_center': Otorite vurgusu için.
      - 'data_grid': Kanıt sunmak için.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        KONU: ${config.topic}
        BAĞLAM (NEDEN BU EĞİTİM?): ${config.contextData || 'Genel yetkinlik artırımı.'}
        HEDEF KİTLE: ${config.targetAudience}
        TON: ${config.tone}
        DERİNLİK: ${config.depth}
        SLAYT SAYISI: ${config.slideCount}
        STİL: ${config.visualStyle}
      `,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              layout: { type: Type.STRING, enum: ['cover', 'section_header', 'split_left', 'split_right', 'full_visual', 'bullet_list', 'quote_center', 'data_grid', 'process_flow'] },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              speakerNotes: { type: Type.STRING, description: "Sunumu yapacak kişi için 'gizli' ipuçları ve anekdotlar." },
              visualPrompt: { type: Type.STRING, description: "Görselin konsept açıklaması." },
              imageKeyword: { type: Type.STRING, description: "AI Image Gen için detaylı İngilizce Prompt." },
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
            required: ["id", "layout", "title", "content", "speakerNotes", "visualPrompt", "imageKeyword"]
          }
        }
      }
    });

    const slides = JSON.parse(response.text || '[]');
    
    // Post-Process: Unique IDs
    return slides.map((s: any, i: number) => ({
        ...s,
        id: `SLIDE-${Date.now()}-${i}`
    }));
  },

  // 3. GENERATE TRAINING SLIDES
  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    const config: PresentationConfig = {
      topic: `Gelişim Planı: ${idp.focusArea}`,
      contextData: `Bu sunum, ${branch} branşındaki bir uzman için hazırlanan IDP (Bireysel Gelişim Planı) özetidir. Eksik alanlar: ${idp.identifiedGaps?.join(', ') || 'Genel yetkinlik'}.`,
      targetAudience: 'individual',
      tone: 'motivational',
      depth: 'intermediate',
      slideCount: 5,
      visualStyle: 'minimalist',
      includeAnimations: true
    };
    return this.generateCustomPresentation(config);
  },

  // 4. SLAYT RAFİNE ETME (REWRITE)
  async refineSlideContent(slide: TrainingSlide, intent: string): Promise<TrainingSlide> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `MEVCUT SLAYT: ${JSON.stringify(slide)} | NİYET (INTENT): ${intent}`,
      config: {
        systemInstruction: "Sen bir 'Slayt Doktoru'sun. Verilen slayt içeriğini, belirtilen niyete (örn: 'daha basit yap', 'daha akademik yap', 'veli diline çevir') göre yeniden yaz. Sadece güncellenmiş slayt objesini JSON olarak döndür.",
        responseMimeType: "application/json"
      }
    });
    
    const refined = JSON.parse(response.text || '{}');
    return { ...slide, ...refined }; // ID ve diğerlerini koru, gelenleri üzerine yaz
  }
};
