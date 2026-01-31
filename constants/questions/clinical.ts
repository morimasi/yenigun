
import { Question, Branch } from '../../types';

export const clinicalQuestions: Question[] = [
  {
    id: 'clin_p1_1', category: 'technicalExpertise', type: 'radio',
    text: 'Bir beceri öğretimi sırasında çocuk "Hatasız Öğretim" (Errorless) protokolüne rağmen ısrarla yanlış karta uzanıyor. "Prompt Fading" sürecindeki stratejik hatanız ne olabilir?',
    weightedOptions: [
      { 
        label: 'Latens (Bekleme Süresi) Kalibrasyon Hatası: İpucunu silikleştirirken uygulanan zaman gecikmesi (0 sn -> 4 sn), öğrencinin nöral işlemleme hızından daha agresif bir ivmeyle artırılmış olabilir.', 
        weights: { clinical: 1.0, pedagogicalAnalysis: 0.8 },
        branchOverrides: {
          [Branch.DilKonusma]: { clinical: 1.2, pedagogicalAnalysis: 1.0 }
        },
        analysisInsight: 'Teknik Derinlik: Metodolojik ince ayarların senkronizasyonu.' 
      },
      { label: 'Pekiştirme Tarifesi Kararsızlığı: Yanlış tepki anında uygulanan nötr geri bildirim prosedürü, "Eşleşme Yasası" uyarınca rastgele deneme stratejisini pekiştirmiş olabilir.', weights: { clinical: 0.6, personality: -0.3 }, analysisInsight: 'Davranışçı Mühendislik: Olasılık hesabı.' },
      { label: 'Motivasyonel Operasyon (MO) Deformasyonu: Çocuğun o andaki pekiştireç değeri bozulmuş olabilir; "Pairing" sürecini tazelemek gerekir.', weights: { clinical: 0.8, empathy: 0.9 }, analysisInsight: 'Holistik Yaklaşım: Biyolojik motivasyon.' },
      { label: 'Diskriminatif Uyaran (Sd) Yerleşimi: Kartların mekansal dizilimi "Pozisyon Bağımlılığı" yaratmış olabilir; sunum matrisini randomize etmek önceliklidir.', weights: { clinical: 0.9, pedagogicalAnalysis: 0.6 }, analysisInsight: 'Operasyonel Dikkat.' }
    ]
  }
];
