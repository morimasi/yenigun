
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
  // --- OTİZM SPEKTRUM BOZUKLUĞU (OSB) ---
  {
    id: 'aba_bacb',
    label: 'Applied Behavior Analysis (ABA / BACB)',
    description: 'Uluslararası Uygulamalı Davranış Analizi Standartları.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'technicalExpertise', type: 'radio',
        text: 'Bir davranışın "işlevi" belirlenirken ABC kaydında "C" (Consequence) tam olarak neyi temsil eder?',
        weightedOptions: [
          { label: 'Davranıştan hemen sonra gerçekleşen ve davranışın gelecekteki olasılığını etkileyen olay.', weights: { technical: 1.0 }, analysisInsight: 'Temel prensip hakimiyeti.' },
          { label: 'Çocuğun davranışı yapma nedeni olan içsel motivasyon.', weights: { technical: 0.1 }, analysisInsight: 'Metodolojik hata.' }
        ]
      },
      {
        id: 'vq_aba_2', category: 'technicalExpertise', type: 'radio',
        text: '"Negative Reinforcement" (Olumsuz Pekiştirme) tam olarak ne yapar?',
        weightedOptions: [
          { label: 'İtici bir uyaranın ortamdan çekilmesiyle hedef davranışın artmasını sağlar.', weights: { technical: 1.0 }, analysisInsight: 'Doğru kavram bilgisi.' },
          { label: 'Yanlış bir davranıştan sonra çocuğa ceza verilmesidir.', weights: { technical: 0.0 }, analysisInsight: 'Kritik kavram karmaşası.' }
        ]
      }
    ]
  },
  {
    id: 'etecom',
    label: 'ETEÇOM (Etkileşim Temelli Erken Çocuklukta Müdahale)',
    description: 'Türkiye merkezli etkileşim temelli müdahale programı.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_etecom_1', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM modelinde "İlişkisel Stratejiler"in birincil amacı nedir?',
        weightedOptions: [
          { label: 'Ebeveyn-çocuk etkileşiminin niteliğini artırarak gelişimsel çıktıları desteklemek.', weights: { technical: 1.0, pedagogy: 0.9 }, analysisInsight: 'Model felsefesi uyumu.' },
          { label: 'Çocuğun akademik becerilerini masa başında öğretmek.', weights: { technical: 0.2 }, analysisInsight: 'Model dışı yaklaşım.' }
        ]
      }
    ]
  },
  {
    id: 'floortime_dir',
    label: 'DIR Floortime (201/202)',
    description: 'Gelişimsel, Bireysel Farklılıklara Dayalı, İlişki Temelli Model.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_floor_1', category: 'technicalExpertise', type: 'radio',
        text: 'DIR modelinde "FEDL" (Fonksiyonel Duygusal Gelişim Basamakları) neyi ifade eder?',
        weightedOptions: [
          { label: 'Çocuğun etkileşim ve iletişim kurma kapasitesinin hiyerarşik aşamalarını.', weights: { technical: 1.0 }, analysisInsight: 'Terminoloji hakimiyeti.' },
          { label: 'Duyu bütünleme seansında kullanılan fiziksel materyalleri.', weights: { technical: 0.1 }, analysisInsight: 'Yanlış branş eşleşmesi.' }
        ]
      }
    ]
  },
  {
    id: 'gobdo',
    label: 'GOBDÖ-2-TV (Gilliam Otizm Derecelendirme Ölçeği)',
    description: 'Otizm tarama ve derecelendirme standardı.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_gobdo_1', category: 'technicalExpertise', type: 'radio',
        text: 'GOBDÖ-2 ölçeğinde değerlendirme yapılırken hangi veri kaynağı esastır?',
        weightedOptions: [
          { label: 'Çocuğu en az 6 aydır tanıyan bir yetişkinin gözlemleri.', weights: { technical: 1.0 }, analysisInsight: 'Uygulama standardı bilgisi.' },
          { label: 'Sadece uzman doktorun o andaki klinik muayenesi.', weights: { technical: 0.4 }, analysisInsight: 'Ölçek prosedür hatası.' }
        ]
      }
    ]
  },

  // --- ÖZEL ÖĞRENME GÜÇLÜĞÜ (ÖÖG) ---
  {
    id: 'prep_disleksi',
    label: 'PREP (Pass Reading Enhancement Program)',
    description: 'PASS Teorisi tabanlı okumayı iyileştirme programı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_prep_1', category: 'technicalExpertise', type: 'radio',
        text: 'PREP müdahalesinde "Ardıl İşlem" (Successive Processing) hangi beceriyle doğrudan ilişkilidir?',
        weightedOptions: [
          { label: 'Ses-harf eşlemesi ve kelime çözümleme.', weights: { technical: 1.0 }, analysisInsight: 'Teorik derinlik.' },
          { label: 'Görsel şekilleri ayırt etme ve boyama.', weights: { technical: 0.2 }, analysisInsight: 'Yüzeysel bilgi.' }
        ]
      }
    ]
  },
  {
    id: 'pass_theory',
    label: 'PASS Teorisi Bilişsel Müdahale',
    description: 'Planlama, Dikkat, Eşzamanlı ve Ardıl İşlem temelli yaklaşım.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_pass_1', category: 'technicalExpertise', type: 'radio',
        text: 'CAS testinde düşük puan alan bir öğrenci için "Planlama" becerisini geliştirmek neyi sağlar?',
        weightedOptions: [
          { label: 'Strateji geliştirme ve kendi hatalarını kontrol etme yetisi.', weights: { technical: 1.0 }, analysisInsight: 'Analitik muhakeme.' },
          { label: 'Daha hızlı koşma ve fiziksel koordinasyon.', weights: { technical: 0.0 }, analysisInsight: 'Alakasız yanıt.' }
        ]
      }
    ]
  },
  {
    id: 'dmp_disleksi',
    label: 'DMP (Disleksi Müdahale Programı)',
    description: 'Ulusal disleksi eğitim ve müdahale protokolü.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_dmp_1', category: 'technicalExpertise', type: 'radio',
        text: 'DMP protokolünde "Fonolojik Farkındalık" neden mülakatın merkezindedir?',
        weightedOptions: [
          { label: 'Okumanın temelini oluşturan ses birimlerini tanıma ve manipüle etme becerisidir.', weights: { technical: 1.0 }, analysisInsight: 'Klinik dürüstlük.' },
          { label: 'Çocuğun güzel yazı yazmasını sağladığı için.', weights: { technical: 0.3 }, analysisInsight: 'Yanlış odak noktası.' }
        ]
      }
    ]
  },

  // --- ZİHİN ENGELLİLER & BİLİŞSEL ---
  {
    id: 'kucuk_adimlar',
    label: 'Küçük Adımlar Erken Eğitim Programı',
    description: 'Gelişimsel geriliği olan çocuklar için aile merkezli eğitim.',
    category: 'INTELLECTUAL_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_ka_1', category: 'technicalExpertise', type: 'radio',
        text: 'Küçük Adımlar programında "Gelişimsel Envanter" ne amaçla kullanılır?',
        weightedOptions: [
          { label: 'Çocuğun mevcut becerilerini belirleyip bireysel müfredat oluşturmak için.', weights: { technical: 1.0, pedagogy: 0.9 }, analysisInsight: 'Uygulama yetkinliği.' },
          { label: 'Çocuğun IQ skorunu hesaplamak için.', weights: { technical: 0.2 }, analysisInsight: 'Yanlış kullanım.' }
        ]
      }
    ]
  },
  {
    id: 'zihin_kurami',
    label: 'Theory of Mind (Zihin Kuramı) Eğitimi',
    description: 'Sosyal biliş ve zihinselleştirme becerileri müdahalesi.',
    category: 'INTELLECTUAL_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_tom_1', category: 'technicalExpertise', type: 'radio',
        text: '"Yanlış İnanç" (False Belief) testi neyi ölçer?',
        weightedOptions: [
          { label: 'Bir başkasının kendisininkinden farklı bir bilgiye sahip olabileceğini anlama yetisini.', weights: { technical: 1.0 }, analysisInsight: 'Bilişsel psikoloji derinliği.' },
          { label: 'Çocuğun yalan söyleyip söylemediğini.', weights: { technical: 0.1 }, analysisInsight: 'Halk ağzı yorum.' }
        ]
      }
    ]
  },

  // --- DİL VE KONUŞMA TERAPİSİ ---
  {
    id: 'tedil',
    label: 'TEDİL (Türkçe Erken Dil Gelişimi Testi)',
    description: 'TEMA-3 standardında ulusal dil değerlendirme ölçeği.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: [
      {
        id: 'vq_tedil_1', category: 'technicalExpertise', type: 'radio',
        text: 'TEDİL testinde "Alıcı Dil" ve "İfade Edici Dil" arasındaki temel fark nedir?',
        weightedOptions: [
          { label: 'Alıcı dil anlamayı, ifade edici dil sözel üretimi temsil eder.', weights: { technical: 1.0 }, analysisInsight: 'Mesleki temel.' },
          { label: 'Alıcı dil duymayı, ifade edici dil ise bağırmayı temsil eder.', weights: { technical: 0.0 }, analysisInsight: 'Cahil cesareti.' }
        ]
      }
    ]
  },
  {
    id: 'lidcombe',
    label: 'Lidcombe Kekemelik Programı',
    description: 'Okul öncesi kekemelik müdahalesinde davranışsal yaklaşım.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: [
      {
        id: 'vq_lid_1', category: 'technicalExpertise', type: 'radio',
        text: 'Lidcombe programında "Sözel Tepkiler" (Verbal Contingencies) kime uygulanır?',
        weightedOptions: [
          { label: 'Ebeveyn tarafından çocuğun akıcı konuşmalarını pekiştirmek için.', weights: { technical: 1.0 }, analysisInsight: 'Protokol bilgisi.' },
          { label: 'Terapist tarafından sadece klinikte uygulanır.', weights: { technical: 0.3 }, analysisInsight: 'Eksik uygulama bilgisi.' }
        ]
      }
    ]
  },

  // --- ERGOTERAPİ & FİZYOTERAPİ ---
  {
    id: 'ayres_si',
    label: 'Ayres Duyu Bütünleme (Sensory Integration)',
    description: 'Nörobiyolojik temelli duyusal işlemleme müdahalesi.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_si_1', category: 'technicalExpertise', type: 'radio',
        text: '"Proprioseptif" sistem birincil olarak nereden bilgi alır?',
        weightedOptions: [
          { label: 'Kaslar, eklemler ve bağ dokulardan.', weights: { technical: 1.0 }, analysisInsight: 'Anatomi/Fizyoloji hakimiyeti.' },
          { label: 'Sadece kulaktaki denge merkezinden.', weights: { technical: 0.4 }, analysisInsight: 'Eksik bilgi (Vestibüler ile karışıklık).' }
        ]
      },
      {
        id: 'vq_si_2', category: 'technicalExpertise', type: 'radio',
        text: 'Duyusal savunmacılığı (Sensory Defensiveness) olan bir çocukta ilk gözlenen tepki nedir?',
        weightedOptions: [
          { label: 'Zararsız duyusal uyaranlara karşı aşırı kaçınma veya korku tepkisi.', weights: { technical: 1.0 }, analysisInsight: 'Klinik gözlem gücü.' },
          { label: 'Çocuğun sürekli uyumak istemesi.', weights: { technical: 0.1 }, analysisInsight: 'Yanlış klinik tanım.' }
        ]
      }
    ]
  },
  {
    id: 'bobath_ndt',
    label: 'Bobath / NDT (Neuro-Developmental Treatment)',
    description: 'Serebral Palsi ve nörolojik vakalarda fizik tedavi standardı.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_ndt_1', category: 'technicalExpertise', type: 'radio',
        text: 'NDT yaklaşımında "Key Points of Control" (Kontrol Noktaları) neden kullanılır?',
        weightedOptions: [
          { label: 'Anormal tonusu inhibe etmek ve normal hareketi fasilite etmek için.', weights: { technical: 1.0 }, analysisInsight: 'Metodolojik derinlik.' },
          { label: 'Çocuğun düşmesini engellemek için sadece tutmak amacıyla.', weights: { technical: 0.2 }, analysisInsight: 'Yüzeysel yaklaşım.' }
        ]
      }
    ]
  },
  {
    id: 'schrott',
    label: 'Schrott Scoliosis Müdahalesi',
    description: 'Skolyoz vakalarında üç boyutlu egzersiz protokolü.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_sch_1', category: 'technicalExpertise', type: 'radio',
        text: 'Schrott yönteminde "Rotasyonel Solunum"un temel amacı nedir?',
        weightedOptions: [
          { label: 'Konkav bölgelerin genişletilmesi ve göğüs kafesi mobilizasyonu.', weights: { technical: 1.0 }, analysisInsight: 'Uzmanlık seviyesi.' },
          { label: 'Sadece akciğer kapasitesini artırmak.', weights: { technical: 0.5 }, analysisInsight: 'Eksik tanım.' }
        ]
      }
    ]
  }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    // GENEL KLİNİK MUHAKEME (TÜM BRANŞLAR İÇİN)
    {
      id: 'gen_1', category: 'technicalExpertise', type: 'radio',
      text: 'Multidisipliner bir toplantıda farklı branştan bir arkadaşınızın görüşüne katılmadığınızda tutumunuz ne olur?',
      weightedOptions: [
        { label: 'Veriye dayalı klinik kanıtlarımı sunar ve ortak paydada buluşmayı öneririm.', weights: { institutionalLoyalty: 1.0, formality: 1.0 }, analysisInsight: 'Profesyonel işbirliği.' },
        { label: 'Kendi seansımdan ben sorumluyum diyerek tartışmayı kapatırım.', weights: { institutionalLoyalty: 0.0, personality: 0.2 }, analysisInsight: 'Zayıf takım uyumu.' }
      ]
    }
  ],
  ethics_parent: [
    {
        id: 'eth_1', category: 'workEthics', type: 'radio',
        text: 'Kurum dışı bir velinin size "kurumdan habersiz seans" teklif etmesi durumunda ilk refleksiniz?',
        weightedOptions: [
          { label: 'Etik kurallar gereği reddeder ve kurumu bilgilendiririm.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek sadakat.' },
          { label: 'Veli mağdur olmasın diye kabul edebilirim.', weights: { ethics: 0.0, institutionalLoyalty: 0.0 }, analysisInsight: 'Kritik güven ihlali.' }
        ]
    }
  ],
  resilience_team: [],
  vision_loyalty: []
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Biruni Üniversitesi", "Üsküdar Üniversitesi", "Bezmialem Vakıf Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
