
import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember, IDP, TrainingSlide, PresentationConfig, TrainingModule } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const armsService = {
  async generateIDP(staff: StaffMember, assessmentHistory: any[] = []): Promise<IDP> {
    
    const systemInstruction = `
      ROL: Yeni Gün Akademi "Nöral Eğitim Mimarı" ve "Klinik Süpervizör".
      GÖREV: Personelin değerlendirme geçmişindeki (assessmentHistory) düşük puanlı alanları ve "aiTags" verilerini analiz et.
      ÇIKTI: Kişiye özel, yüksek çözünürlüklü bir Hizmet İçi Eğitim Müfredatı (Curriculum) oluştur.
      MODEL: Gemini 3 Flash Thinking Mode.
      
      PRENSİPLER:
      1. TANISAL EŞLEŞTİRME: Eğer personel "etik" konusunda düşük puan aldıysa, müfredata "Klinik Sınırlar ve Etik" modülü ekle.
      2. MODÜLER YAPI: Eğitimi 3-4 ana modüle böl. Her modülün altında somut görevler (üniteler) olsun.
      3. ÇEŞİTLİLİK: Üniteler sadece "okuma" olmasın; "Vaka Analizi", "Süpervizyon", "Simülasyon", "Makale Kritik" gibi aktif görevler içersin.
      4. NEDENSELLİK (RATIONALE): Her ünite için AI, neden bu görevi atadığını (hangi test hatasına dayandığını) "aiRationale" alanında belirtmeli.
      5. KAYNAKLAR: Her ünite için gerçekçi kitap, makale veya video başlıkları öner.
    `;

    // Robust Schema for Curriculum
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
      contents: `STAFF PROFILE: ${JSON.stringify({ name: staff.name, branch: staff.branch, exp: staff.experience_years })} | ASSESSMENT DATA: ${JSON.stringify(assessmentHistory)}`,
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
                properties: {
                  shortTerm: { type: Type.STRING },
                  midTerm: { type: Type.STRING },
                  longTerm: { type: Type.STRING }
                }
            },
            recommendedTrainings: { type: Type.ARRAY, items: { type: Type.STRING } },
            milestones: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { title: {type: Type.STRING}, dueDate: {type: Type.STRING} }
                }
            }
          },
          required: ["focusArea", "identifiedGaps", "aiAnalysisSummary", "curriculum", "roadmap", "recommendedTrainings", "milestones"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    // Post-processing to ensure IDs are unique
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

  async generateTrainingSlides(idp: IDP, branch: string): Promise<TrainingSlide[]> {
    // Existing function logic maintained
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `IDP: ${JSON.stringify(idp)} | BRANCH: ${branch}`,
      config: {
        systemInstruction: `ROL: Akademik Müfredat Tasarımcısı. GÖREV: Vaka temelli interaktif bir eğitim seti tasarla.`,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              speakerNotes: { type: Type.STRING },
              visualPrompt: { type: Type.STRING },
              interactiveElement: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  expectedAnswer: { type: Type.STRING },
                  misconception: { type: Type.STRING }
                }
              }
            },
            required: ["id", "type", "title", "content", "speakerNotes", "visualPrompt"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  },

  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    // Existing function logic maintained
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SUNUM KONFİGÜRASYONU: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: `ROL: Kıdemli Akademik Müfredat Tasarımcısı. GÖREV: Akademik derinliği olan bir eğitim sunumu tasarla.`,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              speakerNotes: { type: Type.STRING },
              visualPrompt: { type: Type.STRING },
              interactiveElement: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  expectedAnswer: { type: Type.STRING },
                  misconception: { type: Type.STRING }
                }
              }
            },
            required: ["id", "type", "title", "content", "speakerNotes", "visualPrompt"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  }
};
