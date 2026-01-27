
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
      id: 'sld_eval_1',
      category: 'technicalExpertise',
      text: 'Okuma akıcılığı (fluency) düşük bir vakada, müdahale planında "Fonolojik Farkındalık" mı yoksa "Hızlı İsimlendirme" (RAN) çalışmaları mı önceliklendirilmelidir? Neden?',
      type: 'radio',
      weightedOptions: [
        { label: 'Fonolojik farkındalık, okumanın temelidir; RAN ise süreçtir.', weights: { technical: 0.7, clinical: 0.6, pedagogy: 0.9 }, analysisInsight: 'Geleneksel akademik bakış.' },
        { label: 'Vakanın profiline göre (çift açık teorisi); RAN zayıfsa hız, fonoloji zayıfsa kodlama önceliklendirilir.', weights: { technical: 1.0, clinical: 1.0, development: 1.0 }, analysisInsight: 'Üst düzey klinik muhakeme.' }
      ]
    },
    {
      id: 'sld_eval_2',
      category: 'technicalExpertise',
      text: 'Diskalkuli vakalarında CRA hiyerarşisinde "Temsili" (Representational) aşamayı atlayıp doğrudan "Soyut" (Abstract) işleme geçmenin nörobilişsel maliyeti nedir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Öğrenci sayı kavramını somutlaştıramaz, ezberci işlem yapar.', weights: { technical: 1.0, clinical: 0.9, pedagogy: 0.8 }, analysisInsight: 'Bilişsel gelişim basamaklarına hakim.' },
        { label: 'Ödevleri yapmakta zorlanır ve matematikten soğur.', weights: { technical: 0.3, clinical: 0.2, formality: 0.5 }, analysisInsight: 'Yüzeysel pedagojik yaklaşım.' }
      ]
    }
  ],
  ethics_parent: [
    {
      id: 'we_1',
      category: 'workEthics',
      text: 'Veli, sosyal medya üzerinden mülakat dosyanıza girmeyen ama öğrenciyi ilgilendiren özel bir durum paylaştı. Yaklaşımınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Durumu mülahaza ederek profesyonel çerçevede kurumsal kanala taşırım.', weights: { ethics: 1.0, formality: 1.0, loyalty: 0.8 }, analysisInsight: 'Yüksek etik bütünlük.' },
        { label: 'Veliyle samimiyeti artırıp güven kazanmak için oradan devam ederim.', weights: { ethics: 0.3, formality: 0.2, personality: 0.6 }, analysisInsight: 'Sınır ihlali riski.' }
      ]
    }
  ],
  resilience_team: [],
  vision_loyalty: []
};

export const CERTIFICATIONS: Certification[] = [
  // SPECIAL LEARNING DISABILITIES (SLD) - OKUMA / YAZMA / MATEMATİK
  {
    id: 'orton_gillingham',
    label: 'Orton-Gillingham (Disleksi)',
    description: 'Çok duyulu (VAKT), yapılandırılmış ve sıralı okuma-yazma öğretim protokolü.',
    category: 'SPECIAL_LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_orton',
      category: 'technicalExpertise',
      text: 'Orton-Gillingham sisteminde "Simultane Çok Duyulu Girdi"nin disleksi vakalarındaki nöral yollar üzerindeki etkisini klinik olarak açıklayınız.',
      type: 'text'
    }
  },
  {
    id: 'prep_pass',
    label: 'PREP (PASS Teorisi)',
    description: 'Okumayı geliştirme ve bilişsel süreçleri (ardıl/eş zamanlı) iyileştirme programı.',
    category: 'SPECIAL_LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_prep',
      category: 'technicalExpertise',
      text: 'PASS teorisindeki "Ardıl İşlemleme" zayıflığı, disleksi vakasının "Kod Çözme" (Decoding) performansını nasıl etkiler?',
      type: 'text'
    }
  },
  {
    id: 'cra_math',
    label: 'CRA (Diskalkuli)',
    description: 'Matematiksel kavramları somuttan soyuta aktaran kanıta dayalı öğretim stratejisi.',
    category: 'SPECIAL_LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_cra',
      category: 'technicalExpertise',
      text: 'CRA modelinde "Temsili" (Representational) aşamanın "Sayı Hissi" (Number Sense) oluşumundaki kritik rolünü belirtiniz.',
      type: 'text'
    }
  },
  {
    id: 'touch_math',
    label: 'TouchMath',
    description: 'Diskalkuli ve öğrenme güçlüğü için görsel/dokunsal matematik öğretim sistemi.',
    category: 'SPECIAL_LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_touch',
      category: 'technicalExpertise',
      text: 'TouchMath noktalarının (TouchPoints) sayı-miktar ilişkisi kurmadaki "Bilişsel Çapa" etkisini açıklayınız.',
      type: 'text'
    }
  },
  {
    id: 'srsd_writing',
    label: 'SRSD (Disgrafi & Yazma)',
    description: 'Yazılı anlatım bozuklukları için öz-düzenleme ve strateji geliştirme modeli.',
    category: 'SPECIAL_LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_srsd',
      category: 'technicalExpertise',
      text: 'SRSD modelinde "Self-Monitoring" (Öz-İzleme) basamağının öğrencinin "Metin Planlama" becerisine katkısı nedir?',
      type: 'text'
    }
  },
  {
    id: 'wj4_eval',
    label: 'Woodcock-Johnson IV',
    description: 'Bilişsel yetenekler ve akademik başarı ölçümü için altın standart batarya.',
    category: 'SPECIAL_LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_wj4',
      category: 'technicalExpertise',
      text: 'WJ-IV raporunda "İşlemleme Hızı" ile "Başarı" arasındaki anlamlı farkın disleksi alt tipi belirlemedeki rolü nedir?',
      type: 'text'
    }
  }
];

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Psikoloji", "PDR", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
