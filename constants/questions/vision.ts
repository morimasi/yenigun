
import { Question } from '../../types';

export const visionQuestions: Question[] = [
  {
    id: 'vis_p1_5', category: 'institutionalLoyalty', type: 'radio',
    text: 'Dışarıdan bir kurum size %30 daha fazla maaş ama "daha düşük akademik kalite" teklif etti. Karar kriteriniz ne olur?',
    weightedOptions: [
      { label: 'Teklifi reddederim. Standart altı bir kurum klinik kaslarımı köreltir.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'İlkesel Sadakat.' },
      { label: 'Eğer o kurumda "Sistem Kurucu" olacaksam değerlendiririm.', weights: { institutionalLoyalty: 0.6, leadership: 0.9 }, analysisInsight: 'Güç Odaklı Profil.' },
      { label: 'Mevcut kurumuma durumu açar, şartların iyileştirilmesini isterim.', weights: { institutionalLoyalty: 0.8, fit: 0.7 }, analysisInsight: 'Şeffaf Pragmatist.' },
      { label: 'Kabul ederim. Profesyonel hayat bir emek-sermaye dengesidir.', weights: { institutionalLoyalty: -1.0, personality: 0.8 }, analysisInsight: 'Mobil Realist.' }
    ]
  },
  {
    id: 'vis_p2_1', category: 'developmentOpenness', type: 'radio',
    text: 'Yeni bir bilimsel araştırma, yıllardır uyguladığınız bir metodun "etkisiz" olduğunu kanıtladı. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Eski yöntemi derhal terk eder, yeni protokol üzerine yoğun bir eğitim sürecine girerim.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Yüksek Öğrenme Çevikliği.' },
      { label: 'Araştırmayı derinlemesine inceler, kendi vaka sonuçlarımla karşılaştırıp kademeli geçiş yaparım.', weights: { developmentOpenness: 0.8, technicalExpertise: 0.9 }, analysisInsight: 'Analitik Tutuculuk.' }
    ]
  }
];
