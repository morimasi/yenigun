
import { Question, Branch } from '../../types';

export const languageSpeechQuestions: Question[] = [
  {
    id: 'slp_artic_1',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Artikülasyon terapisinde "Motor Öğrenme" prensiplerine göre geri bildirim sıklığı nasıl ayarlanmalıdır?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { 
        label: 'Edinim aşamasında %100, kalıcılık aşamasında ise azalan geri bildirim veririm.', 
        weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 },
        analysisInsight: 'Motor öğrenme teorisine hakim.'
      },
      { 
        label: 'Çocuğun motivasyonunu korumak için her doğru tepkide coşkulu ödül veririm.', 
        weights: { clinical: 0.5, empathy: 1.0 },
        analysisInsight: 'Pedagojik motivasyon odaklı, teknik derinlik kısıtlı.'
      }
    ]
  }
];
