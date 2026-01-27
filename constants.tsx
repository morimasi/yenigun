
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Akademik Kimlik', description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'gen_1',
      category: 'technicalExpertise',
      text: 'Çok ağır problem davranış (self-injury) sergileyen bir vakada, müdahale planınızdaki "Öncül Kontrolü" (Antecedent Control) ile "Sonuç Yönetimi" arasındaki dengeyi klinik olarak nasıl kurarsınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Önce davranışı durdurmak için sonuç odaklı (ceza/mola) çalışırım.', weights: { technical: 0.4, clinical: 0.3, ethics: 0.5 }, analysisInsight: 'Geleneksel/Davranışçı katı tutum.' },
        { label: 'İşlevsel analiz yapar, öncülleri düzenleyerek alternatif davranış öğretirim.', weights: { technical: 1.0, clinical: 1.0, development: 0.9 }, analysisInsight: 'Modern kanıta dayalı klinik muhakeme.' }
      ]
    },
    {
      id: 'gen_2',
      category: 'pedagogicalAnalysis',
      text: 'Vakanın kronolojik yaşı 10, ancak gelişimsel yaşı 3. Akademik beceri mi yoksa özbakım/sosyal beceri mi önceliklendirilmelidir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Yaşıtlarını yakalaması için yoğun akademik program uygularım.', weights: { pedagogy: 0.4, fit: 0.5 }, analysisInsight: 'Sonuç odaklı ama gelişimsel gerçeklikten uzak.' },
        { label: 'Bağımsız yaşam için işlevsel becerileri ve özbakımı merkeze alırım.', weights: { pedagogy: 1.0, clinical: 0.9, ethics: 1.0 }, analysisInsight: 'İşlevsel ve vaka odaklı pedagoji.' }
      ]
    }
  ],
  ethics_parent: [
    {
      id: 'we_1',
      category: 'workEthics',
      text: 'Veli, kurum dışı özel ders talebinde bulundu ve etik sınırları zorluyor. Tepkiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Kurum prosedürlerini hatırlatır ve talebi net bir dille reddederim.', weights: { ethics: 1.0, formality: 1.0, loyalty: 1.0 }, analysisInsight: 'Yüksek profesyonel bütünlük.' },
        { label: 'Veliyle aramdaki güvenin sarsılmaması için durumu geçiştiririm.', weights: { ethics: 0.2, formality: 0.3, personality: 0.5 }, analysisInsight: 'Sınır aşımı ve manipülasyon riski.' }
      ]
    }
  ],
  resilience_team: [],
  vision_loyalty: []
};

export const CERTIFICATIONS: Certification[] = [
  // OTİZM VE DAVRANIŞ ANALİZİ (ABA & BEHAVIORAL)
  {
    id: 'aba_bcba',
    label: 'ABA (Uygulamalı Davranış Analizi)',
    description: 'BCBA/QBA standartlarında bilimsel davranış müdahale protokolü.',
    category: 'SPECIAL_ED_ABA',
    verificationQuestion: {
      id: 'vq_aba',
      category: 'technicalExpertise',
      text: 'Davranışın "İşlevsel Analizi"nde (Functional Analysis) elde edilen verinin, "Müdahale Planı"na (BIP) transformasyon sürecini vaka bazlı açıklayınız.',
      type: 'text'
    }
  },
  {
    id: 'esdm_denver',
    label: 'ESDM (Early Start Denver Model)',
    description: 'Erken çocukluk otizm müdahalesinde gelişimsel-davranışçı model.',
    category: 'SPECIAL_ED_ABA',
    verificationQuestion: {
      id: 'vq_esdm',
      category: 'technicalExpertise',
      text: 'ESDM müfredatında "Ortak İlgi" (Joint Attention) basamaklarının, dil öncesi iletişimdeki stratejik rolünü belirtiniz.',
      type: 'text'
    }
  },
  {
    id: 'ocidep',
    label: 'OÇİDEP / GOBİ',
    description: 'Otistik çocuklar için bireyselleştirilmiş eğitim ve doğal öğretim programları.',
    category: 'SPECIAL_ED_ABA',
    verificationQuestion: {
      id: 'vq_ocidep',
      category: 'technicalExpertise',
      text: 'OÇİDEP kapsamında "Doğal Öğretim" tekniklerinin "Genelleme" (Generalization) fazındaki avantajlarını literatürle açıklayınız.',
      type: 'text'
    }
  },
  {
    id: 'pecs_pyramid',
    label: 'PECS (Resim Değiş Tokuşuna Dayalı İletişim)',
    description: 'Alternatif ve Destekleyici İletişim (ADİ) protokolü.',
    category: 'SPECIAL_ED_ABA',
    verificationQuestion: {
      id: 'vq_pecs',
      category: 'technicalExpertise',
      text: 'PECS 4. Aşamada (Cümle Kurma) öğrencinin "İstem" (Mand) becerisinin "Niteleyiciler" ile zenginleştirilmesindeki kritik hata paylarını yazınız.',
      type: 'text'
    }
  },

  // GELİŞİMSEL VE İLİŞKİ TEMELLİ (DEVELOPMENTAL)
  {
    id: 'dir_floortime',
    label: 'DIR Floortime (101/201+)',
    description: 'İlişki temelli, gelişimsel ve bireysel farklılıklara dayalı müdahale modeli.',
    category: 'OCCUPATIONAL_THERAPY',
    verificationQuestion: {
      id: 'vq_floortime',
      category: 'technicalExpertise',
      text: 'FEDL 3 (Karşılıklı İletişim) basamağında takılı kalan bir vakada, "Daireleri Kapatmak" için kullanılan duyusal-regülatif stratejileri açıklayınız.',
      type: 'text'
    }
  },
  {
    id: 'etecom',
    label: 'ETEÇOM (Etkileşim Temelli Erken Çocuklukta Müdahale)',
    description: 'Ebeveyn ve uzman odaklı etkileşimsel gelişim programı.',
    category: 'OCCUPATIONAL_THERAPY',
    verificationQuestion: {
      id: 'vq_etecom',
      category: 'technicalExpertise',
      text: 'ETEÇOM protokolündeki "Cevaplayıcılık" (Responsiveness) kavramının, çocuğun bilişsel yürütücü işlevleri üzerindeki etkisini tanımlayınız.',
      type: 'text'
    }
  },

  // ÖĞRENME GÜÇLÜĞÜ & AKADEMİK (ACADEMIC)
  {
    id: 'orton_gillingham',
    label: 'Orton-Gillingham (Disleksi)',
    description: 'Çok duyulu, yapılandırılmış okuma-yazma öğretim sistemi.',
    category: 'SPECIAL_LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_orton',
      category: 'technicalExpertise',
      text: 'Orton-Gillingham "Simultane Çok Duyulu Girdi" prensibinin nöroplastisite üzerindeki kanıta dayalı etkisini açıklayınız.',
      type: 'text'
    }
  },
  {
    id: 'prep_pass',
    label: 'PREP / COGENT (PASS Teorisi)',
    description: 'PASS Teorisi tabanlı okuma ve bilişsel işlemleme programı.',
    category: 'SPECIAL_LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_prep',
      category: 'technicalExpertise',
      text: 'Ardıl İşlemleme (Successive Processing) zayıflığı olan bir vakada, PREP stratejilerinin kod çözme üzerindeki etkisini örneklendiriniz.',
      type: 'text'
    }
  },
  {
    id: 'tovari_diskalkuli',
    label: 'TOVARİ / Diskalkuli Müdahalesi',
    description: 'Matematik öğrenme güçlüğü değerlendirme ve müdahale bataryası.',
    category: 'SPECIAL_LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_tovari',
      category: 'technicalExpertise',
      text: 'CRA (Somut-Temsili-Soyut) hiyerarşisinde "Temsili" aşamanın sayı hissi (Number Sense) oluşumundaki rolünü belirtiniz.',
      type: 'text'
    }
  },

  // ÖLÇME VE DEĞERLENDİRME (ASSESSMENT)
  {
    id: 'wisc_4',
    label: 'WISC-IV Uygulayıcısı',
    description: 'Wechsler Çocuklar için Zeka Ölçeği 4. Versiyon.',
    category: 'PSYCHOLOGY_PEDAGOGY',
    verificationQuestion: {
      id: 'vq_wisc',
      category: 'technicalExpertise',
      text: 'WISC-IV profil analizinde "Çalışma Belleği" ile "İşlemleme Hızı" arasındaki anlamlı farkın öğrenme stili üzerindeki klinik yorumunu yapınız.',
      type: 'text'
    }
  },
  {
    id: 'cas_assessment',
    label: 'CAS (Cognitive Assessment System)',
    description: 'Bilişsel Değerlendirme Sistemi (PASS Modeli).',
    category: 'PSYCHOLOGY_PEDAGOGY',
    verificationQuestion: {
      id: 'vq_cas',
      category: 'technicalExpertise',
      text: 'CAS raporunda "Planlama" ölçeğindeki düşüklüğün, çocuğun serbest zaman yönetimindeki davranışsal yansımasını açıklayınız.',
      type: 'text'
    }
  },
  {
    id: 'moxo_test',
    label: 'MOXO Dikkat Testi',
    description: 'Objektif dikkat, zamanlama, dürtüsellik ve hiperaktivite ölçümü.',
    category: 'PSYCHOLOGY_PEDAGOGY',
    verificationQuestion: {
      id: 'vq_moxo',
      category: 'technicalExpertise',
      text: 'MOXO profilindeki "Görsel Çeldirici" hassasiyetinin, sınıf içi akademik performansa etkisini klinik olarak analiz ediniz.',
      type: 'text'
    }
  }
];

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
