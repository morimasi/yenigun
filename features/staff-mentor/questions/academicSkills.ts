import { AssessmentQuestion } from '../../../types';

export const academicSkillsQuestions: AssessmentQuestion[] = Array.from({ length: 20 }).map((_, i) => {
  const scenarios = [
    {
      text: 'Okuma-yazma hazırlık aşamasındaki bir çocukta "fonolojik farkındalık" oturmadan harf öğretimine geçilmesi hakkında ne düşünürsünüz?',
      opt1: 'Bunu akademik bir "günah" olarak görürüm. Temel bilişsel işlemler tamamlanmadan yapılan yükleme, disleksi benzeri yapay bariyerler üretir.',
      opt2: 'Pragmatik bakarım. Çocuk harflere ilgi duyuyorsa, fonolojik eksiklikleri harf öğretimi içinde "gömülü" şekilde gidermeyi tercih ederim.',
      tag1: 'cognitive_scaffolding', tag2: 'flexible_pedagogy'
    },
    {
      text: 'Matematikte "Eldeli Toplama" mantığını kavramayan ama ezberle doğru yapan bir çocukta duruşunuz ne olur?',
      opt1: 'Sonuca odaklanmam. Somut nesnelerle basamak kavramını %100 oturtabilmek için işlemsel hızı feda eder, mantığa geri dönerim.',
      opt2: 'Özgüven için hıza değer veririm. Çocuk mekanik olarak yapabiliyorsa bu bir başarıdır; mantık zamanla uygulama içinde gelişecektir.',
      tag1: 'conceptual_mastery', tag2: 'result_oriented_teaching'
    }
  ];

  const scenario = scenarios[i % scenarios.length];
  return {
    id: `stf_acad_v2_${i + 1}`,
    text: scenario.text,
    options: [
      { label: scenario.opt1, clinicalValue: 100, aiTag: scenario.tag1 },
      { label: scenario.opt2, clinicalValue: 88, aiTag: scenario.tag2 }
    ]
  };
});
