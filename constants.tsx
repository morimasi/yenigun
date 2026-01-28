
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const CERTIFICATION_CATEGORIES = [
  { id: 'AUTISM_SPECTRUM', label: 'Otizm Spektrum Bozukluğu (OSB)' },
  { id: 'LEARNING_DISABILITIES', label: 'Özel Öğrenme Güçlüğü (ÖÖG)' },
  { id: 'INTELLECTUAL_DISABILITIES', label: 'Zihin Engelliler & Bilişsel' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi' }
];

export const CERTIFICATIONS: Certification[] = [
  // ==========================================
  // OTİZM SPEKTRUM BOZUKLUĞU (OSB)
  // ==========================================
  {
    id: 'aba_bacb',
    label: 'Applied Behavior Analysis (BACB/QABA)',
    description: 'Uluslararası davranış analizi standartları.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestion: {
      id: 'vq_aba_tech',
      category: 'technicalExpertise',
      text: 'Bir vakada "Differential Reinforcement of Alternative Behavior" (DRA) uygularken, hedef davranışın sönmeye (extinction) girmesi için kilit şart nedir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Uygunsuz davranışın tamamen görmezden gelinip alternatifin pekiştirilmesi.', weights: { technical: 1.0, clinical: 0.9 }, analysisInsight: 'Standart protokol hakimiyeti.' },
        { label: 'Sadece uygunsuz davranışın cezalandırılması.', weights: { technical: 0.1, ethics: 0.3 }, analysisInsight: 'Metodolojik hata.' }
      ]
    }
  },
  {
    id: 'etekom_tr',
    label: 'ETEÇOM (Etkileşim Temelli Erken Çocukluk Müdahale)',
    description: 'Türkiye yerel, duyarlı etkileşim temelli otizm programı.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestion: {
      id: 'vq_etekom',
      category: 'technicalExpertise',
      text: 'ETEÇOM stratejilerinde "Çocuğun Liderliğini Takip Etmek" tam olarak neyi ifade eder?',
      type: 'radio',
      weightedOptions: [
        { label: 'Çocuğun ilgilendiği nesne üzerinden etkileşimi genişletmek.', weights: { technical: 1.0, pedagogy: 0.8 }, analysisInsight: 'Model felsefesine tam uyum.' },
        { label: 'Çocuğun serbest oyun oynamasına izin verip müdahale etmemek.', weights: { technical: 0.3 }, analysisInsight: 'Klinik pasiflik yanılgısı.' }
      ]
    }
  },
  {
    id: 'pcdi_autism',
    label: 'PCDI (Princeton Child Dev. Inst.) Müfredatı',
    description: 'Veri odaklı yoğun davranışsal eğitim modeli.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestion: {
      id: 'vq_pcdi',
      category: 'technicalExpertise',
      text: 'PCDI yaklaşımında "Script-Fading" (İpucunu Silikleştirme) hangi temel beceriyi geliştirmek için kullanılır?',
      type: 'radio',
      weightedOptions: [
        { label: 'Sosyal etkileşim ve başlatma becerilerini bağımsızlaştırmak için.', weights: { technical: 1.0 }, analysisInsight: 'İleri düzey OSB müdahale bilgisi.' },
        { label: 'Sadece motor becerileri öğretmek için.', weights: { technical: 0.2 }, analysisInsight: 'Eksik kavram bilgisi.' }
      ]
    }
  },
  {
    id: 'gobdo_2',
    label: 'GOBDO-2 (Gilliam Otizm Derecelendirme Ölçeği)',
    description: 'Otizm tarama ve derecelendirme aracı (Türkiye Adaptasyonu).',
    category: 'AUTISM_SPECTRUM',
    verificationQuestion: {
      id: 'vq_gobdo',
      category: 'technicalExpertise',
      text: 'GOBDO-2 puanlamasında "Otizm İndeksi" hangi alt testlerin birleşimiyle hesaplanır?',
      type: 'radio',
      weightedOptions: [
        { label: 'Kısıtlı-Yineleyici Davranışlar, Sosyal Etkileşim ve Duygusal Tepkiler.', weights: { technical: 1.0 }, analysisInsight: 'Değerlendirme aracı hakimiyeti.' },
        { label: 'Sadece konuşma hızı ve akademik başarı.', weights: { technical: 0.2 }, analysisInsight: 'Ölçek parametre hatası.' }
      ]
    }
  },

  // ==========================================
  // ÖZEL ÖĞRENME GÜÇLÜĞÜ (ÖÖG)
  // ==========================================
  {
    id: 'prep_pass',
    label: 'PREP (PASS Reading Enhancement Program)',
    description: 'PASS teorisine dayalı disleksi müdahale programı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_prep',
      category: 'technicalExpertise',
      text: 'PREP programında "Ardıl İşlem" (Successive Processing) zorluğu çeken bir çocukta hangi okuma hatası belirgindir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Harf-ses dizilimini karıştırma ve kelimeyi sentezleyememe.', weights: { technical: 1.0, clinical: 0.9 }, analysisInsight: 'Nöropsikolojik temel hakimiyeti.' },
        { label: 'Metnin genel ana fikrini anlayamama.', weights: { technical: 0.4 }, analysisInsight: 'Yanlış işlemleme alanı.' }
      ]
    }
  },
  {
    id: 'tog_disleksi',
    label: 'TÖG Disleksi Müdahale Programı',
    description: 'Türkiye yerel öğrenme güçlüğü akademik müfredatı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_tog',
      category: 'technicalExpertise',
      text: 'TÖG müfredatında "Fonolojik Farkındalık" aşaması neden okuma öncesi kritik kabul edilir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Dili oluşturan ses birimlerinin manipüle edilmesini sağladığı için.', weights: { technical: 1.0 }, analysisInsight: 'Metodolojik netlik.' },
        { label: 'Çocuğun hızlı okumasını sağladığı için.', weights: { technical: 0.3 }, analysisInsight: 'Yüzeysel yaklaşım.' }
      ]
    }
  },
  {
    id: 'cogent_cog',
    label: 'COGENT (Bilişsel Gelişim Programı)',
    description: 'Erken çocuklukta bilişsel süreçleri güçlendirme (PASS temelli).',
    category: 'LEARNING_DISABILITIES',
    verificationQuestion: {
      id: 'vq_cogent',
      category: 'technicalExpertise',
      text: 'COGENT müdahalesinin PREP\'ten temel farkı nedir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Okuma-yazma öncesi temel bilişsel yapıları (0-7 yaş) hedeflemesi.', weights: { technical: 1.0 }, analysisInsight: 'Program hiyerarşisi bilgisi.' },
        { label: 'Sadece yetişkin disleksisi ile çalışması.', weights: { technical: 0.1 }, analysisInsight: 'Kritik bilgi eksikliği.' }
      ]
    }
  },

  // ==========================================
  // ZİHİN ENGELLİLER & BİLİŞSEL ÖLÇÜM
  // ==========================================
  {
    id: 'portage_tr',
    label: 'Portage Erken Eğitim Programı',
    description: 'Zihin engelli ve gelişim geriliği olan çocuklar için müfredat.',
    category: 'INTELLECTUAL_DISABILITIES',
    verificationQuestion: {
      id: 'vq_portage',
      category: 'technicalExpertise',
      text: 'Portage gelişim ölçeğinde "Bilişsel Gelişim" kartlarında hangi beceri grubu önceliklidir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Sınıflama, eşleştirme ve neden-sonuç ilişkileri.', weights: { technical: 1.0, pedagogy: 0.9 }, analysisInsight: 'Müfredat derinliği.' },
        { label: 'Sadece kaba motor yürüme becerileri.', weights: { technical: 0.2 }, analysisInsight: 'Alan karmaşası.' }
      ]
    }
  },
  {
    id: 'stanford_binet_5',
    label: 'Stanford-Binet Zeka Ölçeği (SB-5)',
    description: 'Uluslararası standart zeka ölçüm aracı.',
    category: 'INTELLECTUAL_DISABILITIES',
    verificationQuestion: {
      id: 'vq_sb5',
      category: 'technicalExpertise',
      text: 'SB-5 testinde "Sözel Olmayan Akıl Yürütme" nasıl ölçülür?',
      type: 'radio',
      weightedOptions: [
        { label: 'Görsel matrisler ve nesne montajı görevleri ile.', weights: { technical: 1.0 }, analysisInsight: 'Psikometrik yetkinlik.' },
        { label: 'Sadece atasözü açıklamaları ile.', weights: { technical: 0.2 }, analysisInsight: 'Ölçek hatası.' }
      ]
    }
  },
  {
    id: 'leiter_3_nonverbal',
    label: 'Leiter-3 Performans Ölçeği',
    description: 'Tamamen sözel olmayan zeka ölçümü (Örn: Ağır OSB vakaları).',
    category: 'INTELLECTUAL_DISABILITIES',
    verificationQuestion: {
      id: 'vq_leiter',
      category: 'technicalExpertise',
      text: 'Leiter-3 testi hangi vaka grupları için "Altın Standart" kabul edilir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Konuşma engeli, ağır OSB veya dil bilmeyen vakalar.', weights: { technical: 1.0, clinical: 1.0 }, analysisInsight: 'Klinik karar verme becerisi.' },
        { label: 'Sadece üstün zekalı çocuklar.', weights: { technical: 0.3 }, analysisInsight: 'Yanlış endikasyon.' }
      ]
    }
  },

  // ==========================================
  // DİL KONUŞMA & DİĞER (YEREL & GLOBAL)
  // ==========================================
  {
    id: 'prompt_level1',
    label: 'PROMPT Level 1',
    description: 'Artikülasyon müdahalesi için taktil-kinestetik model.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestion: {
      id: 'vq_prompt_tech',
      category: 'technicalExpertise',
      text: 'PROMPT hiyerarşisinde "Dikey Çene Kontrolü" hangi aşamanın temelidir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Mandibular Seviye (Mandibular Stage).', weights: { technical: 1.0 }, analysisInsight: 'Hiyerarşik tam hakimiyet.' },
        { label: 'Sadece dil ucu sesleri.', weights: { technical: 0.4 }, analysisInsight: 'Teknik eksiklik.' }
      ]
    }
  },
  {
    id: 'metropolitan_school',
    label: 'Metropolitan Okul Olgunluğu Testi',
    description: 'Okul öncesi akademik hazırlık ölçümü.',
    category: 'INTELLECTUAL_DISABILITIES',
    verificationQuestion: {
      id: 'vq_metro',
      category: 'technicalExpertise',
      text: 'Metropolitan testinde "Kelimeleri Anlama" alt testi neyi ölçmeyi amaçlar?',
      type: 'radio',
      weightedOptions: [
        { label: 'Dilsel yönergeleri anlama ve kavram bilgisini.', weights: { technical: 1.0 }, analysisInsight: 'Test uygulama yeterliliği.' },
        { label: 'Sadece çocuğun kalem tutma becerisini.', weights: { technical: 0.2 }, analysisInsight: 'Yanlış parametre.' }
      ]
    }
  }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'cl_1',
      category: 'technicalExpertise',
      text: 'Çok ağır problem davranış (self-injury) sergileyen bir vakada, müdahale planınızdaki "Öncül Kontrolü" ile "Sonuç Yönetimi" dengesini klinik olarak nasıl kurarsınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Önce davranışı durdurmak için sonuç odaklı (ceza/mola) çalışırım.', weights: { technical: 0.4, clinical: 0.3, ethics: 0.5 }, analysisInsight: 'Geleneksel/Davranışçı katı tutum.' },
        { label: 'İşlevsel analiz yapar, öncülleri düzenleyerek alternatif davranış öğretirim.', weights: { technical: 1.0, clinical: 1.0, development: 0.9 }, analysisInsight: 'Modern kanıta dayalı klinik muhakeme.' }
      ]
    },
    {
      id: 'ped_1',
      category: 'pedagogicalAnalysis',
      text: 'Ebeveyn katılımı düşük olan bir vakada, ev programının sürdürülebilirliğini sağlamak için yaklaşımınız ne olur?',
      type: 'radio',
      weightedOptions: [
        { label: 'Programı basitleştirir ve ebeveynin küçük başarılarını pekiştiririm.', weights: { pedagogy: 1.0, development: 0.9, personality: 0.8 }, analysisInsight: 'Aile merkezli empatik yaklaşım.' },
        { label: 'Veliyi uyarır ve kurum disiplinine uyması gerektiğini hatırlatırım.', weights: { pedagogy: 0.3, formality: 1.0, personality: 0.4 }, analysisInsight: 'Otoriter ve düşük empatik bağ.' }
      ]
    }
  ],
  ethics_parent: [
    {
      id: 'eth_1',
      category: 'workEthics',
      text: 'Veli, kurum prosedürleri dışında size "özel bir hediye" veya "ekstra ödeme" teklif ettiğinde profesyonel sınırınızı nasıl korursunuz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Nazikçe reddeder ve kurumun etik ilkelerini veliye açıklarım.', weights: { ethics: 1.0, formality: 1.0, loyalty: 1.0 }, analysisInsight: 'Yüksek profesyonel bütünlük.' },
        { label: 'Güven ilişkisinin bozulmaması için bir defaya mahsus kabul ederim.', weights: { ethics: 0.1, formality: 0.2, institutionalLoyalty: 0.1 }, analysisInsight: 'Kritik sınır ihlali riski.' }
      ]
    }
  ],
  resilience_team: [
    {
      id: 'res_1',
      category: 'sustainability',
      text: 'Multidisipliner toplantıda bir meslektaşınız sizin klinik kararınıza sert ve haksız bir eleştiri getirdiğinde tepkiniz ne olur?',
      type: 'radio',
      weightedOptions: [
        { label: 'Eleştirinin teknik dayanağını sorar ve verilerimle açıklama yaparım.', weights: { sustainability: 1.0, criticismTolerance: 1.0, personality: 0.9 }, analysisInsight: 'Yüksek kognitif esneklik ve direnç.' },
        { label: 'Kişisel saldırı olarak algılar ve toplantıyı terk ederim.', weights: { sustainability: 0.2, criticismTolerance: 0.1, personality: 0.2 }, analysisInsight: 'Düşük stres toleransı.' }
      ]
    }
  ],
  vision_loyalty: [
    {
      id: 'vis_1',
      category: 'institutionalLoyalty',
      text: 'Kurumun yeni uygulamaya koyduğu bir metodun verimsiz olduğunu düşünüyorsanız nasıl aksiyon alırsınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Alternatif verileri sunarak idare ile yapıcı bir toplantı talep ederim.', weights: { institutionalLoyalty: 1.0, formality: 0.9, development: 0.8 }, analysisInsight: 'Sorumlu kurumsal aidiyet.' },
        { label: 'Metodu uygulamayı bırakır ve diğer öğretmenlerle şikayetimi paylaşırım.', weights: { institutionalLoyalty: 0.2, personality: 0.3, ethics: 0.4 }, analysisInsight: 'Kurumsal huzuru bozma potansiyeli.' }
      ]
    }
  ]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
