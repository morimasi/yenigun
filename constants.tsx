
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const CERTIFICATION_CATEGORIES = [
  { id: 'SPECIAL_ED_ABA', label: 'Özel Eğitim & ABA' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi' },
  { id: 'OCCUPATIONAL_THERAPY', label: 'Ergoterapi & Gelişim' },
  { id: 'PHYSIOTHERAPY', label: 'Fizyoterapi' },
  { id: 'PSYCHOLOGY_PEDAGOGY', label: 'Psikoloji & Pedagoji' }
];

export const CERTIFICATIONS: Certification[] = [
  // --- ÖZEL EĞİTİM & ABA ---
  {
    id: 'aba_bcba',
    label: 'ABA (BCBA/QBA Standartları)',
    description: 'Bilimsel davranış analizi ve müdahale protokolleri.',
    category: 'SPECIAL_ED_ABA',
    verificationQuestion: {
      id: 'vq_aba',
      category: 'technicalExpertise',
      text: 'Ağır problem davranış sergileyen bir vakada "Extinction" (Sönme) protokolü uygulanırken "Extinction Burst" (Sönme Patlaması) gözlemlendiğinde klinik önceliğiniz ne olmalıdır?',
      type: 'radio',
      weightedOptions: [
        { label: 'Protokolü derhal durdurup mola yöntemine geçmek.', weights: { clinical: 0.1, technical: 0.2 }, analysisInsight: 'Teknik yetersizlik.' },
        { label: 'Güvenlik önlemlerini artırarak protokole kararlılıkla devam etmek.', weights: { clinical: 1.0, technical: 1.0 }, analysisInsight: 'Uzman seviye klinik sebat.' }
      ]
    }
  },
  {
    id: 'etekom',
    label: 'ETEÇOM Uygulayıcısı',
    description: 'Etkileşim temelli erken çocuklukta müdahale.',
    category: 'SPECIAL_ED_ABA',
    verificationQuestion: {
      id: 'vq_etekom',
      category: 'technicalExpertise',
      text: 'ETEÇOM stratejilerinde "Karşılıklı Sosyal Etkileşim"in temel taşı hangisidir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Çocuğun komutları harfiyen yerine getirmesi.', weights: { technical: 0.2 }, analysisInsight: 'Davranışçı kalıp.' },
        { label: 'Ebeveyn ve çocuk arasındaki sosyal-duygusal alışverişin niteliği.', weights: { technical: 1.0 }, analysisInsight: 'Doğru metodolojik bilgi.' }
      ]
    }
  },
  // --- DİL VE KONUŞMA ---
  {
    id: 'prompt',
    label: 'PROMPT Tekniği',
    description: 'Artikülasyon ve motor konuşma bozuklukları müdahalesi.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestion: {
      id: 'vq_prompt',
      category: 'technicalExpertise',
      text: 'PROMPT hiyerarşisinde "Surface" (Yüzey) seviyesi neyi hedefler?',
      type: 'radio',
      weightedOptions: [
        { label: 'Konuşmanın prosodik özelliklerini düzenlemeyi.', weights: { technical: 1.0 }, analysisInsight: 'İleri seviye teknik bilgi.' },
        { label: 'Sadece sesletimi (fonem) düzeltmeyi.', weights: { technical: 0.4 }, analysisInsight: 'Eksik teknik tanım.' }
      ]
    }
  },
  {
    id: 'lidcombe',
    label: 'Lidcombe Programı',
    description: 'Okul öncesi kekemelik müdahale programı.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestion: {
      id: 'vq_lidcombe',
      category: 'technicalExpertise',
      text: 'Lidcombe Programında "Sözlü Tepki" (Verbal Contingency) ne zaman verilir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Sadece takılmalar olduğunda uyarmak için.', weights: { technical: 0.2 }, analysisInsight: 'Hatalı uygulama riski.' },
        { label: 'Akıcı konuşma sergilendiğinde pekiştirmek için.', weights: { technical: 1.0 }, analysisInsight: 'Doğru metodolojik refleks.' }
      ]
    }
  },
  // --- ERGOTERAPİ & GELİŞİM ---
  {
    id: 'sensory_integration',
    label: 'Duyu Bütünleme (Ayres)',
    description: 'Duyusal işlemleme bozuklukları analizi.',
    category: 'OCCUPATIONAL_THERAPY',
    verificationQuestion: {
      id: 'vq_si',
      category: 'technicalExpertise',
      text: 'Vestibüler hiporeaktif bir çocukta mülakat esnasında hangi davranışı gözlemlemeyi beklersiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Hareketsizlik ve uyuşukluk.', weights: { technical: 1.0 }, analysisInsight: 'Klinik gözlem derinliği.' },
        { label: 'Seslere karşı aşırı duyarlılık.', weights: { technical: 0.3 }, analysisInsight: 'Kavram karmaşası.' }
      ]
    }
  },
  {
    id: 'dir_floortime_cert',
    label: 'DIR Floortime (ICDL)',
    description: 'Gelişimsel, bireysel farklılıklara dayalı model.',
    category: 'OCCUPATIONAL_THERAPY',
    verificationQuestion: {
      id: 'vq_ft',
      category: 'technicalExpertise',
      text: 'DIR modelinde "Kendi Kendini Düzenleme" (Self-Regulation) hangi gelişim basamağının temelidir?',
      type: 'radio',
      weightedOptions: [
        { label: 'FEDL 1', weights: { technical: 1.0 }, analysisInsight: 'Temel teorik hakimiyet.' },
        { label: 'FEDL 4', weights: { technical: 0.4 }, analysisInsight: 'Hatalı hiyerarşi bilgisi.' }
      ]
    }
  },
  // --- PSİKOLOJİ & PEDAGOJİ ---
  {
    id: 'wisc_4_psk',
    label: 'WISC-IV Uygulayıcısı',
    description: 'Bilişsel yetenek ve zeka ölçeği.',
    category: 'PSYCHOLOGY_PEDAGOGY',
    verificationQuestion: {
      id: 'vq_wisc4',
      category: 'technicalExpertise',
      text: 'WISC-IV\'te "Genel Yetenek İndeksi" (GYİ) hangi durumlarda hesaplanır?',
      type: 'radio',
      weightedOptions: [
        { label: 'Tüm alt testlerde puanlar birbirine çok yakınsa.', weights: { technical: 0.3 }, analysisInsight: 'Yanlış istatistiksel yorum.' },
        { label: 'Sözel Bilgi ve Algısal Akıl Yürütme arasında anlamlı fark olup diğer alanlar (Bİ, ÇB) düşükse.', weights: { technical: 1.0 }, analysisInsight: 'Doğru psikometrik uzmanlık.' }
      ]
    }
  },
  {
    id: 'moxo',
    label: 'MOXO Dikkat Testi',
    description: 'DEHB tanısı destekleyici performans testi.',
    category: 'PSYCHOLOGY_PEDAGOGY',
    verificationQuestion: {
      id: 'vq_moxo',
      category: 'technicalExpertise',
      text: 'MOXO testinde "Zamanlama" parametresi neyi ölçer?',
      type: 'radio',
      weightedOptions: [
        { label: 'Dikkat süresini.', weights: { technical: 0.5 }, analysisInsight: 'Yüzeysel bilgi.' },
        { label: 'Uyaranlara verilen tepkinin doğruluğunu ve hızını.', weights: { technical: 1.0 }, analysisInsight: 'Parametrik hakimiyet.' }
      ]
    }
  }
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

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
