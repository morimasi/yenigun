
import { Certification } from '../types';

export const CERTIFICATIONS: Certification[] = [
  // 🧩 OTİZM SPEKTRUM BOZUKLUĞU
  {
    id: 'aba_bcba',
    label: 'Applied Behavior Analysis (ABA) - BCBA/UKBA',
    description: 'Uluslararası Davranış Analisti Akreditasyonu.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_intl', category: 'clinical', type: 'radio',
        text: 'Bir vaka analizinde "Aralıklı Pekiştirme" (Intermittent Reinforcement) tuzağına düşen bir veliyi nasıl yönetirsiniz?',
        weightedOptions: [
          { label: 'Velinin "bazen" verdiği küçük tavizlerin o davranışı nasıl ölümsüzleştirdiğini grafiklerle ve somut veri trendleriyle gösteririm; protokol sadakatinin bir seçenek değil, etik bir zorunluluk olduğunu kesin bir dille hatırlatırım.', weights: { clinical: 1.0, workEthics: 0.9 }, analysisInsight: 'Teknik Otorite ve Veri Odaklılık.' },
          { label: 'Veliyi yargılamadan, bu durumun insani ve duygusal bir "yorulma" sonucu olduğunu kabul ederim; sönme prosedürünü velinin günlük hayatında gerçekten uygulayabileceği mikro-adımlara bölerek onun için süreci basitleştiririm.', weights: { clinical: 0.8, empathy: 1.0 }, analysisInsight: 'Sistemik Esneklik ve Veli Koçluğu.' }
        ]
      }
    ]
  },
  {
    id: 'dir_floortime_prof',
    label: 'DIR Floortime (201/202/Expert)',
    description: 'İlişki Temelli Nörogelişimsel Müdahale (ICDL).',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_dir_adv', category: 'clinical', type: 'radio',
        text: 'Çocuk FEDL 4 (Karmaşık Problem Çözme) aşamasında ama duyusal olarak "Aşırı Uyarılmış" (Hyper-aroused). Müdahaleniz ne olur?',
        weightedOptions: [
          { label: 'Bilişsel zorlamayı hemen durdurarak duyusal regülasyonu (ko-regülasyon) önceliklendiririm; çocuk nörolojik olarak sakinleşene ve güven alanına dönene kadar etkileşimi en düşük bilişsel yükte ve en yüksek duygusal destekte tutarım.', weights: { clinical: 1.0, sustainability: 0.9 }, analysisInsight: 'Biyolojik Hiyerarşi Bilinci.' },
          { label: 'Bu uyarılmışlık halini oyunun içine "yüksek enerjili bir afet" gibi yedirmeye çalışırım; çocuğun yüksek uyarımını regüle etmek yerine bu enerjiyi kullanarak etkileşim döngülerinin (circles) devamını ve duygusal genişlemeyi hedeflerim.', weights: { clinical: 0.7, developmentOpenness: 1.0 }, analysisInsight: 'Yaratıcı ve İlişkisel Müdahale.' }
        ]
      }
    ]
  }
];
