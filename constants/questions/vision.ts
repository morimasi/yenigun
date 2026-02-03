
import { Question } from '../../types';

export const visionQuestions: Question[] = [
  {
    id: 'vis_p1_5', category: 'institutionalLoyalty', type: 'radio',
    text: 'Dışarıdan bir kurum size %30 daha fazla maaş ama "daha düşük akademik kalite" teklif etti. Karar kriteriniz ne olur?',
    weightedOptions: [
      { label: 'Klinik İtibar: Teklifi reddederim. Standart altı bir kurum klinik kaslarımı köreltir.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'İlkesel Sadakat.' },
      { label: 'Liderlik Fırsatı: Eğer o kurumda "Sistem Kurucu" olacaksam değerlendiririm.', weights: { institutionalLoyalty: 0.6, leadership: 0.9 }, analysisInsight: 'Güç Odaklı Profil.' },
      { label: 'Şeffaf Müzakere: Mevcut kurumuma durumu açar, şartların iyileştirilmesini isterim.', weights: { institutionalLoyalty: 0.8, fit: 0.7 }, analysisInsight: 'Şeffaf Pragmatist.' },
      { label: 'Finansal Realizm: Kabul ederim. Profesyonel hayat bir emek-sermaye dengesidir.', weights: { institutionalLoyalty: -1.0, personality: 0.8 }, analysisInsight: 'Mobil Realist.' }
    ]
  },
  {
    id: 'vis_p2_1', category: 'developmentOpenness', type: 'radio',
    text: 'Yeni bir bilimsel araştırma, yıllardır uyguladığınız bir metodun "etkisiz" olduğunu kanıtladı. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Hızlı Adaptasyon: Eski yöntemi derhal terk eder, yeni protokol üzerine yoğun bir eğitim sürecine girerim.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Yüksek Öğrenme Çevikliği.' },
      { label: 'Eleştirel Şüphecilik: Araştırmayı derinlemesine inceler, kendi vaka sonuçlarımla karşılaştırıp kademeli geçiş yaparım.', weights: { developmentOpenness: 0.8, technicalExpertise: 0.9 }, analysisInsight: 'Analitik Tutuculuk.' }
    ]
  }
];
