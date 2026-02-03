
import { Question } from '../../types';

export const pedagogyQuestions: Question[] = [
  {
    id: 'acad_ped_1',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Bilimsel olarak kanıtlanmış bir metodun (EBP), vaka üzerinde 3 aydır etkisiz olduğunu verilerle saptadınız. Tavrınız?',
    weightedOptions: [
      { 
        label: 'Metodun uygulanış hassasiyetini sorgular, süpervizyon talep ederim.', 
        weights: { developmentOpenness: 1.0, clinical: 0.9 },
        analysisInsight: 'Özeleştiri ve akademik dürüstlük sahibi.'
      },
      { 
        label: 'Vakanın nöral bariyerleri olduğunu veliye raporlar, beklentiyi düşürürüm.', 
        weights: { clinical: 0.3, personality: 0.5 },
        analysisInsight: 'Dışsal atıf eğilimi, çözüm üretme direnci düşük.'
      }
    ]
  }
];
