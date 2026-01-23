
import { FormStep, Question, Branch } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Akademik Kimlik', description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz.' },
  { id: 'academic_proficiency', title: 'Klinik Uygulama Profili', description: 'Branşınıza özel derinlikli vaka analizleri.' },
  { id: 'technical_deep_dive', title: 'Akreditasyon Doğrulama', description: 'Beyan ettiğiniz eğitimlere dair teknik yetkinlik denetimi.' },
  { id: 'character_projection', title: 'Klinik Karakter Projeksiyonu', description: 'Gri alan senaryoları ile profesyonel sınır ve etik refleksi ölçümü.' },
  { id: 'professional_cases', title: 'Kurumsal Etik ve Ahlak', description: 'Kurum içi gizlilik, hediye kabulü ve profesyonel sınırlar.' },
  { id: 'development', title: 'Özeleştiri & Vizyon', description: 'Mesleki gelişim dürüstlüğü.' }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  academic_proficiency: [
    {
      id: 'clinical_method_integrity',
      text: 'Seans sırasında çocuğun ilerlemesi durdu ve yönteminizin işe yaramadığını fark ettiniz. Velinin ve yönetimin beklentisi yüksek. Tutumunuz ne olur?',
      type: 'text'
    }
  ],
  character_projection: [
    {
      id: 'gift_ethics_scenario',
      text: 'Bir veli, çocuğuna gösterdiğiniz ilgiden dolayı size maddi değeri yüksek bir hediye/para teklif ediyor ve bunu kimseye söylememenizi rica ediyor. Yaklaşımınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Veliyi kırmamak için kabul ederim ama eğitime yansıtmam.', weight: 0.1, category: 'ethics' },
        { label: 'Nazikçe reddeder, bunun etik kurallarımıza aykırı olduğunu belirtir ve durumu yönetime raporlarım.', weight: 1.0, category: 'ethics' },
        { label: 'Kabul ederim ama tutarı kurumun bağış kumbarasına atarım.', weight: 0.4, category: 'fit' },
        { label: 'Sadece bir kezlik, özel bir durum olduğu için kabul ederim.', weight: 0.0, category: 'ethics' }
      ]
    }
  ],
  professional_cases: [
    {
      id: 'confidentiality_leak_scenario',
      text: 'Eski çalıştığınız kurumdan bir veli sizi aradı ve şu anki kurumunuzdaki bir öğrenci hakkında "kritik" bir bilgi sordu. Bilgiyi paylaşırsanız kendi seans başarınız artabilir. Ne yaparsınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Öğrencinin iyiliği için bilgiyi sınırlı şekilde paylaşırım.', weight: 0.3, category: 'ethics' },
        { label: 'Kurumsal gizlilik protokolü gereği hiçbir bilgi paylaşmam ve aramayı raporlarım.', weight: 1.0, category: 'ethics' },
        { label: 'Bilgiyi alırım ama karşılığında bilgi vermem.', weight: 0.5, category: 'fit' },
        { label: 'Kişisel dostluğumuz varsa paylaşırım.', weight: 0.0, category: 'ethics' }
      ]
    }
  ],
  development: [
    {
      id: 'dev_failure_honesty',
      text: 'Meslek hayatınızda yaptığınız en büyük klinik hatayı ve bundan ne öğrendiğinizi anlatınız.',
      type: 'text'
    }
  ]
};

// Added to fix import error in CandidateForm.tsx
export const TRAINING_VERIFICATION_QUESTIONS: Record<string, Question> = {};

export const CERTIFICATION_CATEGORIES = {
  LANGUAGE_SPEECH: ["PROMPT", "LSVT Loud", "Vital-Stim", "Hanen Programı", "ETÖOM", "TEDİL", "GOPAS", "E-YÖS"],
  OCCUPATIONAL_THERAPY: ["Ayres Duyu Bütünleme", "SIPT/EASI", "DIR Floortime 101/201", "Bobath (EBTA)", "Kinesiotaping", "CO-OP"],
  PHYSIOTHERAPY: ["Uzay Terapi", "Vojta", "Schroth", "Manuel Terapi", "Pediatrik Rehabilitasyon", "Therasuit"],
  SPECIAL_ED_ABA: ["ABA Uygulayıcı (BCBA Onaylı)", "PECS Faz 1-6", "ETEÇOM", "PREP", "PASS Teorisi", "GOPDÖ-2-TV"],
  ASSESSMENT: ["WISC-V", "MOXO", "Denver II", "CAS", "Stanford-Binet", "Metropolitan"]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "İstanbul Üniversitesi", "Ankara Üniversitesi", "Gazi Üniversitesi", "Marmara Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Ergoterapi", "Dil ve Konuşma Terapisi", "Fizyoterapi ve Rehabilitasyon"];
