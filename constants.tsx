
import { FormStep, Question, Branch } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Akademik Kimlik', description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz.' },
  { id: 'academic_proficiency', title: 'Klinik Uygulama Profili', description: 'Branşınıza özel derinlikli vaka analizleri.' },
  { id: 'technical_deep_dive', title: 'Akreditasyon Doğrulama', description: 'Beyan ettiğiniz eğitimlere dair teknik yetkinlik denetimi.' },
  { id: 'character_projection', title: 'Klinik Karakter Projeksiyonu', description: 'Gri alan senaryoları ile profesyonel sınır ve etik refleksi ölçümü.' },
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

// EĞİTİM SPESİFİK DOĞRULAMA SORULARI
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
  character_projection: [
    {
      id: 'parent_boundary_scenario',
      text: 'Seans sonunda bir veli ağlayarak özel ailevi sorunlarını anlatmaya başladı ve bir sonraki seansınızın süresinden çalıyor. Yaklaşımınız?',
      type: 'radio',
      options: [
        'Veliyi dinlerim, terapötik bağ kurmak mülga bir seans yapmaktan daha önceliklidir.',
        'Nazikçe mola verir, durumun profesyonel destek gerektirdiğini belirterek kurumsal psikoloğa yönlendiririm ve seansımı başlatırım.',
        'Veliyi dinlerken bir yandan diğer öğrenciyi içeri alırım.',
        'Süre bittiği için dinleyemeyeceğimi sertçe belirtirim.'
      ]
    },
    {
      id: 'peer_conflict_method',
      text: 'Aynı çocukla çalışan bir meslektaşınızın yöntemi, sizin seans verimliliğinizi bilimsel olarak düşürüyor. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Seans sırasında odaya girip yanlışını düzeltirim.',
        'Haftalık vaka toplantısında (Case Study) literatür eşliğinde konuyu tartışmaya açar, ortak protokol öneririm.',
        'Yönetime şikayet ederim.',
        'Kendi yöntemimi veliye övüp meslektaşımın yöntemini eleştiririm.'
      ]
    },
    {
      id: 'stress_resilience_crisis',
      text: 'Seans odasında çocuk kontrolsüz bir öfke nöbeti geçiriyor ve çevreye zarar veriyor. İlk önceliğiniz nedir?',
      type: 'radio',
      options: [
        'Çocuğu fiziksel olarak kısıtlayıp (restraint) cezalandırırım.',
        'Çevre güvenliğini sağlar, "Antisipatif" yaklaşımla çocuğun kendine zarar vermesini önler ve sakinleşmesi için güvenli alan yaratırım.',
        'Derhal odayı terk edip güvenliği çağırırım.',
        'Dikkatini dağıtmak için sevdiği bir yiyeceği veririm.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'ethics_confidentiality_v2',
      text: 'Bir kurum dışı uzman, vaka hakkında bilgi istiyor. Veli onayı "sözlü" var ama "yazılı" yok. Tutumunuz?',
      type: 'radio',
      options: [
        'Sözlü beyan yeterlidir, bilgiyi paylaşırım.',
        'Yazılı onay ve resmi protokol olmadan hiçbir klinik veriyi kurum dışına çıkarmam.',
        'Sadece yüzeysel bilgi veririm.',
        'Arkadaşımsa paylaşırım.'
      ]
    }
  ],
  development: [
    {
      id: 'dev_self_critique',
      text: 'Klinik pratiğinizde en çok zorlandığınız vaka tipi nedir ve bu eksikliği nasıl kapatmayı planlıyorsunuz?',
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
