import { AssessmentQuestion } from '../../../types';

export const technoPedagogyQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_tech_v2_1',
    text: 'Yapay zeka tabanlı bir veri takip sistemi (MIA) size vakanızın durakladığını raporladı. Kararınız?',
    options: [
      { label: 'Algoritmanın uyarısını bir "nöral ikaz" olarak kabul eder, metodolojimi veriye dayalı olarak hemen revize ederim.', clinicalValue: 100, aiTag: 'digital_native_specialist' },
      { label: 'Kendi klinik gözlemime öncelik veririm; bir yazılımın seanstaki insani ve duyusal nüansları yakalayamayacağını düşünürüm.', clinicalValue: 80, aiTag: 'traditional_humanist' }
    ]
  },
  {
    id: 'stf_tech_v2_2',
    text: 'Sözel olmayan bir vaka için yüksek teknolojili bir AAC (Alternatif İletişim) cihazı önerildi. İlk hamleniz?',
    options: [
      { label: 'Cihazın tüm teknik detaylarını 48 saat içinde öğrenir ve tüm personeli bu sisteme entegre edecek bir eğitim planlarım.', clinicalValue: 100, aiTag: 'rapid_tech_adapter' },
      { label: 'Önce klasik yöntemlerle (PECS/Kart) devam ederim; teknolojinin çocuk üzerinde bir "ekran bağımlılığı" yaratmasından çekinirim.', clinicalValue: 75, aiTag: 'conservative_tech_barrier' }
    ]
  }
];
