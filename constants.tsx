
import { FormStep, Question, Branch } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Akademik Kimlik', description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz.' },
  { id: 'academic_proficiency', title: 'Klinik Uygulama Profili', description: 'Branşınıza özel derinlikli vaka analizleri.' },
  { id: 'technical_deep_dive', title: 'Akreditasyon Doğrulama', description: 'Beyan ettiğiniz eğitimlere dair teknik yetkinlik denetimi.' },
  { id: 'logic_literacy', title: 'Operasyonel Zeka', description: 'Karmaşık kriz anlarında mantıksal önceliklendirme.' },
  { id: 'professional_cases', title: 'Etik İkilemler', description: 'Profesyonel ahlak ile kurumsal gerçeklik dengesi.' },
  { id: 'development', title: 'Özeleştiri & Vizyon', description: 'Mesleki gelişim dürüstlüğü.' }
];

export const CERTIFICATION_CATEGORIES = {
  LANGUAGE_SPEECH: ["PROMPT", "LSVT Loud", "Vital-Stim", "Hanen Programı", "ETÖOM", "TEDİL", "GOPAS", "E-YÖS"],
  OCCUPATIONAL_THERAPY: ["Ayres Duyu Bütünleme", "SIPT/EASI", "DIR Floortime 101/201", "Bobath (EBTA)", "Kinesiotaping", "CO-OP"],
  PHYSIOTHERAPY: ["Uzay Terapi", "Vojta", "Schroth", "Manuel Terapi", "Pediatrik Rehabilitasyon", "Therasuit"],
  SPECIAL_ED_ABA: ["ABA Uygulayıcı (BCBA Onaylı)", "PECS Faz 1-6", "ETEÇOM", "PREP", "PASS Teorisi", "GOPDÖ-2-TV"],
  ASSESSMENT: ["WISC-V", "MOXO", "Denver II", "CAS", "Stanford-Binet", "Metropolitan"]
};

export const CERTIFICATION_LIST = [
  ...CERTIFICATION_CATEGORIES.LANGUAGE_SPEECH,
  ...CERTIFICATION_CATEGORIES.OCCUPATIONAL_THERAPY,
  ...CERTIFICATION_CATEGORIES.PHYSIOTHERAPY,
  ...CERTIFICATION_CATEGORIES.SPECIAL_ED_ABA,
  ...CERTIFICATION_CATEGORIES.ASSESSMENT
];

// EĞİTİM SPESİFİK DOĞRULAMA SORULARI (Domain-Specific Verification)
export const TRAINING_VERIFICATION_QUESTIONS: Record<string, Question> = {
  "PROMPT": {
    id: 'v_prompt',
    text: 'PROMPT tekniğinde "Parameter" ile "Surface" dokunsal ipuçları arasındaki farkı, artikülasyon bozukluğu olan bir çocukta nasıl önceliklendirirsiniz?',
    type: 'text'
  },
  "Ayres Duyu Bütünleme": {
    id: 'v_sensory',
    text: 'Duyu bütünleme seansında "Just Right Challenge" (Tam Kararında Zorluk) ilkesini, graviteye karşı güvensizliği (gravitational insecurity) olan bir çocukta nasıl modüle edersiniz?',
    type: 'text'
  },
  "Vojta": {
    id: 'v_vojta',
    text: 'Vojta terapisinde "Refleks Sürünme" aktivasyonunda, göğüs zonu ve kalkaneus noktası arasındaki koordinasyonu bozan en yaygın kompanse hareket nedir?',
    type: 'text'
  },
  "BCBA Onaylı ABA": {
    id: 'v_aba',
    text: 'ABA uygulamasında "Extinction Burst" (Sönme Patlaması) sırasında ailenin müdahaleyi kesme eğilimine karşı klinik argümanınız ve veri toplama stratejiniz ne olur?',
    type: 'text'
  },
  "DIR Floortime 201": {
    id: 'v_floortime',
    text: 'Floortime basamaklarından "Representational Capacity" seviyesinde olan bir çocukta, oyunun akışını bozmadan "Circles of Communication" sayısını nasıl artırırsınız?',
    type: 'text'
  },
  "WISC-V": {
    id: 'v_wisc',
    text: 'WISC-V profilinde "Görsel Mekansal" skorun "Akıcı Akıl Yürütme"den 1.5 standart sapma düşük olması durumunda, öğrencinin akademik kurgusunda ne tür bir modifikasyon önerirsiniz?',
    type: 'text'
  }
};

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  academic_proficiency: [
    {
      id: 'dkt_stuttering_vaca',
      text: 'Okul öncesi dönemde (4 yaş) kekemelik semptomları gösteren bir çocukta Lidcombe Programı mı yoksa Dolaylı Terapi mi tercih edersiniz? Gerekçelendirin.',
      type: 'text',
      requiredBranch: [Branch.DilKonusma]
    },
    {
      id: 'ft_cp_posture',
      text: 'GMFCS Seviye III olan bir CP tanılı çocukta, kaba motor fonksiyonları korurken skolyoz riskini minimize etmek için gece pozisyonlaması stratejiniz nedir?',
      type: 'text',
      requiredBranch: [Branch.Fizyoterapist]
    }
  ],
  logic_literacy: [
    {
      id: 'crisis_behavior_safety',
      text: 'Seans sırasında kendine zarar verme (self-injury) davranışı gösteren bir öğrencide, "A-B-C Verisi" toplarken o anki fiziksel güvenliği nasıl sağlarsınız?',
      type: 'radio',
      options: [
        'Davranışın bitmesini beklerim, sonra müdahale ederim.',
        'Antisepatif müdahale ile çevre güvenliğini sağlar, fiziksel kısıtlama yerine yönlendirme yaparım.',
        'Hemen odayı terk edip yardım çağırırım.',
        'Ödül vererek davranışı durdurmaya çalışırım.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'ethics_confidentiality',
      text: 'Başka bir kurumda görevli bir uzman, sizin öğrenciniz hakkında bilgi istiyor. Veli izni olmadan yaklaşımınız?',
      type: 'radio',
      options: [
        'Meslektaşım olduğu için tüm bilgileri paylaşırım.',
        'Sadece genel gelişimini anlatırım.',
        'Yazılı veli onayı olmadan bilgi paylaşımını reddederim.',
        'Yöneticime sorarım.'
      ]
    }
  ],
  development: [
    {
      id: 'dev_future_tech',
      text: 'Yapay zekanın kendi branşınızdaki (rehabilitasyon) rolünü 5 yıl sonra nerede görüyorsunuz?',
      type: 'text'
    }
  ]
};

export const TURKISH_UNIVERSITIES = [
  "Abant İzzet Baysal Üniversitesi", "Hacettepe Üniversitesi", "İstanbul Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Ankara Üniversitesi", "Dokuz Eylül Üniversitesi", "Gazi Üniversitesi", "Bezmialem Vakıf Üniversitesi"
];

export const TURKISH_DEPARTMENTS = [
  "Özel Eğitim Öğretmenliği", "Psikoloji", "PDR", "Ergoterapi", "Dil ve Konuşma Terapisi", "Fizyoterapi ve Rehabilitasyon", "Odyoloji", "Okul Öncesi Öğretmenliği"
];
