
import { GoogleGenAI, Type } from "@google/genai";
import { 
  IDP, TrainingSlide, CustomTrainingPlan, 
  TrainingGenerationConfig, TrainingQuiz, Branch, PresentationConfig
} from "../../types";

const extractPureJSON = (text: string): any => {
  if (!text) return null;
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanText.search(/[{\[]/);
    const lastBrace = Math.max(cleanText.lastIndexOf('}'), cleanText.lastIndexOf(']'));
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) return null;
    const jsonString = cleanText.substring(firstBrace, lastBrace + 1);
    const sanitizedString = jsonString.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    return JSON.parse(sanitizedString);
  } catch (e) { 
    console.error("MIA ARMS JSON Engine Error:", e);
    return null; 
  }
};

export const armsService = {
  async generateUniversalCurriculum(plan: CustomTrainingPlan, config: TrainingGenerationConfig): Promise<{ slides: TrainingSlide[], quiz?: TrainingQuiz }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      ROL: Yeni Gün Akademi Baş Müfredat Tasarımcısı ve Klinik Süpervizör.
      GÖREV: "${plan.title}" konusu üzerine profesyonel bir hizmet içi eğitim sunumu üret.
      
      KRİTİK İÇERİK KURALLARI (İHLAL EDİLEMEZ):
      1. SLAYT İÇERİĞİ (content): Her slayt mutlaka en az 5 adet, her biri en az 15 kelimelik YOĞUN AKADEMİK BİLGİ içeren maddeden oluşmalıdır. Sadece başlık atmak disiplin suçudur.
      2. TEKNİK DERİNLİK: İçerik "Hoşgeldiniz", "Eğitimin Amacı" gibi sığ ifadeler yerine; direkt klinik metodoloji, uygulama protokolleri, risk analizleri ve literatür referansları içermelidir.
      3. MULTIMODAL ELEMENTS: Her slayta mutlaka o konuyla ilgili bir ikon (symbol), bir veri grafiği mantığı (graph_logic) veya bir vaka çalışması (interactive_case) ekle.
      4. SPEAKER NOTES: Eğitmenin o slaytta anlatması gereken derin detayları (en az 150 kelime) buraya ekle.
      5. DİL: Kesinlikle profesyonel, keskin ve akademik Türkçe.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `EĞİTİM PLANI: ${JSON.stringify(plan)} | KONFİGÜRASYON: ${JSON.stringify(config)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.ARRAY, items: { type: Type.STRING }, description: "En az 5 adet 15+ kelimelik teknik madde." },
                  speakerNotes: { type: Type.STRING, description: "Eğitmen için 150+ kelimelik derinlemesine teknik anlatım rehberi." },
                  elements: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ["text", "symbol", "graph_logic", "interactive_case"] },
                        content: { type: Type.OBJECT }
                      }
                    }
                  }
                },
                required: ["id", "title", "content", "speakerNotes", "elements"]
              }
            },
            quiz: {
               type: Type.OBJECT,
               properties: {
                 questions: {
                   type: Type.ARRAY,
                   items: {
                     type: Type.OBJECT,
                     properties: {
                       id: { type: Type.STRING },
                       text: { type: Type.STRING },
                       options: {
                         type: Type.ARRAY,
                         items: {
                           type: Type.OBJECT,
                           properties: {
                             label: { type: Type.STRING },
                             isCorrect: { type: Type.BOOLEAN },
                             feedback: { type: Type.STRING }
                           }
                         }
                       }
                     }
                   }
                 }
               }
            }
          },
          required: ["slides"]
        }
      }
    });

    const result = extractPureJSON(response.text);
    if (!result) throw new Error("AI Yanıt Sentezi Başarısız.");
    return result;
  },

  async generateCurriculumTraining(plan: any): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `KURUMSAL KATALOG PLANI: ${JSON.stringify(plan)}`,
      config: {
        systemInstruction: `
          ROL: Akademi Eğitmen Robotu. 
          GÖREV: Katalogdaki konuyu derinlemesine bir eğitime dönüştür. 
          HER SLAYT: En az 6 madde, teknik detaylar, literatür bilgisi ve uygulama protokolleri içermelidir. 
          Boş slayt üretmek kurumsal bir hatadır. Maddeler açıklayıcı ve uzun olmalıdır.`,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  },

  async generateIDP(entity: any, assessmentHistory: any[] = []): Promise<IDP> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `UZMAN VERİLERİ: ${JSON.stringify({ name: entity.name, branch: entity.branch, report: entity.report })}`,
      config: {
        systemInstruction: "Kıdemli Gelişim Stratejisti. Adayın zayıf noktalarını onaracak derinlikte 90 günlük gelişim planı üret. Her modül zengin bir içerik havuzuna sahip olmalı.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const result = extractPureJSON(response.text);
    if (!result) throw new Error("IDP Sentez Hatası.");
    return {
        id: `IDP-${Date.now().toString().slice(-6)}`,
        ...result,
        status: 'active',
        createdAt: Date.now()
    };
  },

  async generateTrainingSlides(idp: IDP, branch: Branch): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `GELİŞİM PLANI (IDP): ${JSON.stringify(idp)} | BRANŞ: ${branch}`,
      config: {
        systemInstruction: "Kıdemli Eğitim Tasarımcısı. IDP modüllerini profesyonel sunum slaytlarına dönüştür. Her slayt yoğun akademik içerik, maddeleme ve detaylı eğitmen notu içermelidir.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  },

  async generateCustomPresentation(config: PresentationConfig): Promise<TrainingSlide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SUNUM KONFİGÜRASYONU: ${JSON.stringify(config)}`,
      config: {
        systemInstruction: "Akademi Eğitim Robotu. Belirtilen konuda profesyonel bir eğitim sunumu üret. Her slayt en az 6 madde, teknik detaylar ve uygulama protokolleri içermelidir.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const res = extractPureJSON(response.text);
    return Array.isArray(res?.slides) ? res.slides : [];
  }
};
