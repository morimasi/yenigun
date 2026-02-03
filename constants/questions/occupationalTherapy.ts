
import { Question, Branch } from '../../types';

export const occupationalTherapyQuestions: Question[] = [
  {
    id: 'ot_sensory_1',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Vestibüler girdi sırasında öğrencide "Otonomik Reaksiyon" (solgunluk, terleme) başlarsa ne yaparsınız?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { 
        label: 'Derhal aktiviteyi keser, propriyoseptif derin bası (çömelme, itme) uygularım.', 
        weights: { clinical: 1.0, technicalExpertise: 1.0 },
        analysisInsight: 'Kritik klinik güvenlik bilinci yüksek.'
      },
      { 
        label: 'Girdinin şiddetini azaltır ama alışması için aktiviteyi tamamlamaya çalışırım.', 
        weights: { clinical: 0.2, ethics: 0.4 },
        analysisInsight: 'Fizyolojik riskleri göz ardı eden yaklaşım.'
      }
    ]
  }
];
