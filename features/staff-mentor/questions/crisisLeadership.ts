import { AssessmentQuestion } from '../../../types';

export const crisisLeadershipQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_cp_v2_1',
    text: 'Veli seans kapısında bağırarak "Çocuğun bugün neden uykulu olduğunu" agresif bir tonda sorguluyor. İlk 10 saniyeniz?',
    options: [
      { label: 'Soğukkanlı bir "Klinik Lider" duruşu sergilerim. Duyguyu aynalayarak onu sakinleştirir ve rasyonel veriyi (uyku/ilaç takibi) sunarım.', clinicalValue: 100, aiTag: 'crisis_commander' },
      { label: 'Kurum müdürünü çağırırım; bu tarz krizlerin profesyonel odağımı bozmasına izin vermeden güvenli alana çekilmeyi tercih ederim.', clinicalValue: 88, aiTag: 'formal_escalator' }
    ]
  },
  {
    id: 'stf_cp_v2_2',
    text: 'Olumsuz bir değerlendirme raporunu veliye sunarken "Umut" mu "Gerçek" mi dengesini nasıl kurarsınız?',
    options: [
      { label: 'Bilimsel gerçeği radikal bir dürüstlükle sunarım; sahte umudun gerçekçi bir müdahale planının önündeki en büyük engel olduğuna inanırım.', clinicalValue: 100, aiTag: 'radical_honesty' },
      { label: 'Umut köprüsü kurmayı öncelerim. Gerçeklerin ağırlığını zamanla, ailenin psikolojik dayanıklılığını artırarak kademeli olarak veririm.', clinicalValue: 95, aiTag: 'empathetic_diplomat' }
    ]
  }
];
