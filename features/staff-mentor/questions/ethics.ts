import { AssessmentQuestion } from '../../../types';

export const ethicsQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_eth_v2_1',
    text: 'Veli, kurum dışındaki "özel seans" talebiyle size geldi ve kurumdan çok daha yüksek bir ücret teklif etti. Tavrınız?',
    options: [
      { label: 'Talebi derhal reddeder ve durumu kurumsal şeffaflık gereği yönetime raporlarım; etik sınırlar liyakatimin sarsılmaz parçasıdır.', clinicalValue: 100, aiTag: 'unshakeable_integrity' },
      { label: 'Reddederim ancak veliyi kırmamak için yönetime bildirmem. Durumu aramızda bir güven sırrı olarak kalmasını sağlarım.', clinicalValue: 70, aiTag: 'soft_boundary_risk' }
    ]
  },
  {
    id: 'stf_eth_v2_2',
    text: 'Seans sırasında çocuğun vücudunda "şüpheli bir iz" gördünüz ancak vaka çok hassas bir siyasi/sosyal profildeki bir aileye ait. Protokolünüz?',
    options: [
      { label: 'Ailenin kimliğine bakmaksızın Çocuk Koruma protokolünü saniyeler içinde işletirim. Hukuki sorumluluk, sosyal riskten büyüktür.', clinicalValue: 100, aiTag: 'legal_courage' },
      { label: 'Önce aileyle birebir görüşür, durumu anlamaya çalışırım. Kurumu ve kendimi büyük bir krizin içine atmadan önce emin olmak isterim.', clinicalValue: 65, aiTag: 'risk_aversion_tendency' }
    ]
  }
  // ... Diğer 8 soru benzer derinlikte
];
