
import { Question, Branch } from '../../types';

export const specialEducationQuestions: Question[] = [
  {
    id: 'sp_ed_aba_1',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Öğrenci "Sönme Patlaması" (Extinction Burst) halindeyken veli müdahaleyi durdurmanızı isterse klinik tavrınız ne olur?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { 
        label: 'Klinik veri grafiğini göstererek sürecin normal olduğunu açıklar ve seansa devam ederim.', 
        weights: { clinical: 1.0, ethics: 1.0 },
        analysisInsight: 'Metodolojik sadakat ve veri odaklılık yüksek.'
      },
      { 
        label: 'Velinin kaygısını önceliklendirip seansı o anlık daha sakin bir aktiviteye çekerim.', 
        weights: { clinical: 0.6, empathy: 0.9 },
        analysisInsight: 'Müşteri memnuniyeti odaklı, klinik risk toleransı düşük.'
      }
    ]
  },
  {
    id: 'sp_ed_bep_1',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'BEP (Bireyselleştirilmiş Eğitim Programı) hazırlarken "Fonksiyonel Analiz" verisi eksikse nasıl ilerlersiniz?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { 
        label: 'Hedefleri yazmayı durdurur, 1 hafta boyunca ABC kaydı tutulmasını talep ederim.', 
        weights: { clinical: 1.0, technicalExpertise: 1.0 },
        analysisInsight: 'Bilimsel temel arayışı üst düzey.'
      },
      { 
        label: 'Geçmiş raporlara dayanarak tahmini hedefler yazar, uygulama sırasında revize ederim.', 
        weights: { clinical: 0.4, sustainability: 0.7 },
        analysisInsight: 'Pragmatik ama klinik risk barındıran yaklaşım.'
      }
    ]
  }
];
