
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Klinik Muhakeme & Kriz Yönetimi', description: 'Kaotik senaryolarda metodolojik sadakat testi.' },
  { id: 'ethics_parent', title: 'Etik Sınırlar & Veli Diplomasisi', description: 'Profesyonel mesafe ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Psikolojik Dayanıklılık & Takım', description: 'Stres altında karar alma ve ekip sinerjisi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Kurumsal Aidiyet', description: 'Uzun vadeli stratejik uyum analizi.' }
];

export const CERTIFICATION_CATEGORIES = [
  { id: 'AUTISM_SPECTRUM', label: 'Otizm Spektrum Bozukluğu', icon: '🧩' },
  { id: 'LEARNING_DISABILITIES', label: 'Özel Öğrenme Güçlüğü', icon: '📖' },
  { id: 'INTELLECTUAL_COGNITIVE', label: 'Zihin & Bilişsel', icon: '🧠' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi', icon: '🗣️' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi', icon: '🏃' },
  { id: 'ACADEMIC_SKILLS', label: 'Okuma Yazma & Matematik', icon: '📐' },
  { id: 'PSYCHOLOGY_GUIDANCE', label: 'Rehberlik & Psikoloji', icon: '🤝' }
];

export const CERTIFICATIONS: Certification[] = [
  // ---🧩 OTİZM SPEKTRUM BOZUKLUĞU ---
  {
    id: 'aba_intl',
    label: 'ABA (Applied Behavior Analysis) - BCBA/RBT',
    description: 'Uluslararası Uygulamalı Davranış Analizi Akreditasyonu.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'technicalExpertise', type: 'radio',
        text: 'Bir problem davranışın işlevi "Kaçma/Kaçınma" (Escape) olarak belirlendi. Ancak çocuk o gün hasta görünüyor. "Talep Gönderme" (Demanding) konusunda stratejiniz ne olur?',
        weightedOptions: [
          { label: 'Hastalık bir değişkendir ancak kaçınma davranışını pekiştirmemek için talebi düşürerek (Demand Fading) devam ederim.', weights: { clinical: 1.0, empathy: 0.5 }, analysisInsight: 'Klinik Esneklik: Davranışsal ilkeyi fizyolojik duruma uyarlama.' },
          { label: 'Çocuk hasta olduğu için tüm talepleri kaldırır, günü serbest oyunla (Pairing) geçiririm.', weights: { clinical: -0.5, empathy: 1.0 }, analysisInsight: 'Aşırı Şefkat Tuzağı: Kaçınma davranışını hastalık bahanesiyle pekiştirme riski.' },
          { label: 'Prosedür neyse onu uygularım, hastalık davranışı etkilemez.', weights: { clinical: 0.2, empathy: -1.0 }, analysisInsight: 'Robotik Uygulama: Fizyolojik bariyeri görmezden gelme.' },
          { label: 'Talebi annesine iletirim, o yaptırsın.', weights: { clinical: -0.8, institutionalLoyalty: -0.5 }, analysisInsight: 'Sorumluluk Devri.' }
        ]
      }
    ]
  },
  {
    id: 'dir_floortime_intl',
    label: 'DIR Floortime (ICDL 201/202)',
    description: 'İlişki temelli nöro-gelişimsel müdahale sertifikası.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_dir_1', category: 'technicalExpertise', type: 'radio',
        text: 'Çocuk "Shared Attention" (Ortak Dikkat) kuramıyor ve sürekli kendi etrafında dönüyor (Vestibüler Arayış). Floortime yaklaşımına göre ilk hamle ne olmalıdır?',
        weightedOptions: [
          { label: 'Dönmesini engeller, yüzünü bana çevirmesini sağlarım.', weights: { clinical: -0.5, pedagogicalAnalysis: -0.3 }, analysisInsight: 'Davranışçı Müdahale: İlişki temelli modelle uyumsuz.' },
          { label: 'Onunla birlikte, aynı yöne ve aynı hızda dönerek onun dünyasına girer ve regülasyonu paylaşırım.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Aynalama (Join in): İlişkiyi çocuğun ilgisi üzerinden başlatma.' },
          { label: 'Dönmesi bitene kadar bekler, sonra oyuncak gösteririm.', weights: { clinical: 0.2 }, analysisInsight: 'Pasif Gözlem.' },
          { label: 'Başının dönmemesi için onu sandalyeye oturturum.', weights: { clinical: -0.2, empathy: 0.5 }, analysisInsight: 'Koruyucu Ebeveyn Refleksi.' }
        ]
      }
    ]
  },
  { id: 'etecom_national', label: 'ETEÇOM (Etkileşim Temelli Erken Müdahale)', description: 'Yerel ve bilimsel kanıta dayalı etkileşim programı.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'pecs_intl', label: 'PECS (Picture Exchange Communication System)', description: 'Resim Değişimiyle İletişim Sistemi resmi eğitimi.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'gobdo_national', label: 'GOBDÖ-2-TV (Otizm Derecelendirme Ölçeği)', description: 'Otizm tarama ve değerlendirme yerel akreditasyonu.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'ods_national', label: 'ODS (Otizm Değerlendirme Seti)', description: 'Milli eğitim ve klinik temelli otizm değerlendirme envanteri.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },

  // ---📖 ÖZEL ÖĞRENME GÜÇLÜĞÜ ---
  {
    id: 'cas_intl',
    label: 'CAS (Cognitive Assessment System) Uygulayıcı',
    description: 'PASS Teorisi temelli bilişsel değerlendirme uzmanlığı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_cas_1', category: 'technicalExpertise', type: 'radio',
        text: 'PASS teorisine göre "Eşzamanlı İşlemleme" (Simultaneous Processing) zayıflığı olan bir öğrenciye okuma-yazma öğretirken hangi yöntemden kaçınılmalıdır?',
        weightedOptions: [
          { label: 'Bütüncül (Global) okuma yöntemleri ve karmaşık görsel matrisler.', weights: { clinical: 1.0 }, analysisInsight: 'Bilişsel Eşleştirme Doğruluğu.' },
          { label: 'Ses temelli cümle yöntemi.', weights: { clinical: 0.3 }, analysisInsight: 'Nötr tercih.' },
          { label: 'Sıralı işlemleme (Ardıl) gerektiren hafıza oyunları.', weights: { clinical: -0.5 }, analysisInsight: 'Kavram Karmaşası.' },
          { label: 'Çoktan seçmeli testler.', weights: { clinical: 0.0 }, analysisInsight: 'İlişkisiz cevap.' }
        ]
      }
    ]
  },
  { id: 'disrek_national', label: 'DİSREK (Ulusal Disleksi Programı)', description: 'Türkiye Disleksi Vakfı onaylı müdahale sertifikası.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'prep_intl', label: 'PREP (PASS Reading Enhancement Program)', description: 'Bilişsel süreçler odaklı okuma iyileştirme eğitimi.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'cogent_intl', label: 'COGENT (PASS Bilişsel Gelişim Programı)', description: 'Okul öncesi dönem bilişsel destek programı.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'moxo_intl', label: 'MOXO Dikkat Testi Uygulayıcı', description: 'Objektif dikkat ve performans ölçümleme uzmanlığı.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'orton_gillingham', label: 'Orton-Gillingham Metodu', description: 'Çok duyulu dil öğretimi yaklaşımı.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },

  // ---🧠 ZİHİN & BİLİŞSEL ---
  {
    id: 'wisc_v_intl',
    label: 'WISC-V Uygulayıcı Sertifikası',
    description: 'Wechsler Çocuklar İçin Zeka Ölçeği - 5. Sürüm.',
    category: 'INTELLECTUAL_COGNITIVE',
    verificationQuestions: [
      {
        id: 'vq_wisc_1', category: 'technicalExpertise', type: 'radio',
        text: 'Çocuğun "Çalışma Belleği" (Working Memory) indeksi düşük, "Sözel Kavrama"sı çok yüksek. Bu profildeki bir öğrenciye yönerge verirken neye dikkat edersiniz?',
        weightedOptions: [
          { label: 'Yönergeleri uzun ve detaylı cümlelerle veririm, çünkü sözel zekası bunu kaldırır.', weights: { clinical: -0.8 }, analysisInsight: 'Klinik Hata: Bellek kapasitesini sözel zeka ile karıştırma.' },
          { label: 'Yönergeleri parçalara böler, görsel ipuçlarıyla destekler ve tekrar ettiririm.', weights: { clinical: 1.0 }, analysisInsight: 'Bilişsel Profil Adaptasyonu.' },
          { label: 'Sürekli not almasını isterim.', weights: { clinical: 0.4 }, analysisInsight: 'Kısmen doğru ama yetersiz.' },
          { label: 'Onu ön sıraya oturturum.', weights: { clinical: 0.2 }, analysisInsight: 'Klasik ama sığ yaklaşım.' }
        ]
      }
    ]
  },
  { id: 'asis_national', label: 'ASİS (Anadolu-Sak Zeka Ölçeği)', description: 'İlk yerli ve milli zeka ölçeği uygulayıcı sertifikası.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'leiter_3_intl', label: 'Leiter-3 Performans Ölçeği', description: 'Sözel olmayan zeka ölçümleme uzmanlığı.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'stanford_binet_sb5', label: 'Stanford-Binet (SB5) Uygulayıcı', description: 'Geleneksel ve güncel zeka değerlendirme uzmanlığı.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'metropolitan_national', label: 'Metropolitan Okul Olgunluğu Testi', description: 'Okula hazırlık düzeyi belirleme akreditasyonu.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },

  // ---🗣️ DİL VE KONUŞMA TERAPİSİ ---
  {
    id: 'prompt_intl',
    label: 'PROMPT (Level 1/2) Technique',
    description: 'Motor-konuşma bozuklukları için taktil-kinestetik girdi metodu.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: [
      {
        id: 'vq_prompt_1', category: 'technicalExpertise', type: 'radio',
        text: 'Apraksili bir çocukta "Motor Planlama" (Motor Planning) üzerinde çalışırken, terapist neden işitsel ipucu yerine taktil (dokunsal) ipucunu önceler?',
        weightedOptions: [
          { label: 'Çocuk duymadığı için.', weights: { clinical: -0.5 }, analysisInsight: 'Yanlış Tanı: Apraksi işitme sorunu değildir.' },
          { label: 'Beyne giden propriyoseptif geri bildirimi artırıp kas hafızasını (Muscle Memory) yeniden kodlamak için.', weights: { clinical: 1.0 }, analysisInsight: 'Nöro-Motor Hakimiyet.' },
          { label: 'Çocuğun dikkatini yüze çekmek için.', weights: { clinical: 0.3 }, analysisInsight: 'İkincil fayda.' },
          { label: 'Dudak okumayı öğretmek için.', weights: { clinical: 0.0 }, analysisInsight: 'Yöntem dışı.' }
        ]
      }
    ]
  },
  { id: 'tedil_national', label: 'TEDİL (Türkçe Erken Dil Gelişimi Testi)', description: 'Dil gelişimi yerel ölçümleme ve normlandırma uzmanlığı.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'todil_national', label: 'TODİL (Türkçe Okul Çağı Dil Gelişimi)', description: 'Okul dönemi dil bozuklukları analiz sertifikası.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'lidcombe_intl', label: 'Lidcombe Programı (Kekemelik)', description: 'Okul öncesi kekemelik müdahale global sertifikası.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'talktools_opt_intl', label: 'TalkTools Oral Placement Therapy', description: 'Oral motor terapi ve beslenme destek teknikleri.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'hanen_intl', label: 'Hanen - It Takes Two to Talk', description: 'Aile odaklı dil müdahale programı sertifikası.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },

  // ---🏃 ERGOTERAPİ & FİZYOTERAPİ ---
  {
    id: 'ayres_si_intl',
    label: 'Ayres Duyu Bütünleme (CLASI/SIPT)',
    description: 'Duyusal işlemleme bozuklukları uluslararası akreditasyonu.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_si_1', category: 'technicalExpertise', type: 'radio',
        text: '"Vestibüler Güvensizlik" (Gravitational Insecurity) yaşayan bir çocuk, ayağının yerden kesildiği aktivitelerde ağlıyor. Terapötik yaklaşım ne olmalıdır?',
        weightedOptions: [
          { label: '"Korkacak bir şey yok" diyerek harekete devam etmek ve duyarsızlaştırmak.', weights: { clinical: -0.8, empathy: -0.5 }, analysisInsight: 'Travmatize Etme Riski.' },
          { label: 'Çocuğun kontrolünde, ayaklarının yere değebileceği alçak seviyeli doğrusal (lineer) hareketlerle güven inşa etmek.', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Dereceli Maruz Bırakma ve Güven.' },
          { label: 'Sadece masa başı ince motor çalışmak.', weights: { clinical: 0.0 }, analysisInsight: 'Sorundan kaçınma.' },
          { label: 'Gözlerini kapatmasını söylemek.', weights: { clinical: -0.5 }, analysisInsight: 'Güvensizliği artırma.' }
        ]
      }
    ]
  },
  { id: 'bobath_ndt_intl', label: 'Bobath / NDT Concept', description: 'Nöro-gelişimsel tedavi (Serebral Palsi odaklı) eğitimi.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'therasuit_intl', label: 'TheraSuit Method / Uzay Terapisi', description: 'Yoğun nöro-rehabilitasyon ve askı sistemleri uzmanlığı.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'halliwick_intl', label: 'Halliwick Hidroterapi', description: 'Su içi rehabilitasyon ve yüzme uzmanlık sertifikası.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'schroth_intl', label: 'Schroth Scoliosis Method', description: 'Skolyoz rehabilitasyonu spesifik klinik eğitimi.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },

  // ---📐 OKUMA YAZMA & MATEMATİK ---
  { id: 'singapore_math_intl', label: 'Singapur Matematiği (CPA Approach)', description: 'Somut-Görsel-Soyut matematik öğretimi metodu.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'diskalkuli_national', label: 'Diskalkuli Müdahale Sertifikası', description: 'Matematik öğrenme güçlüğü klinik müdahale eğitimi.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'ses_temelli_national', label: 'Ses Temelli Cümle Yöntemi (MEB)', description: 'Milli eğitim müfredatı okuma yazma uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'montessori_academic', label: 'Montessori Pedagojisi (Akademik)', description: 'Yapılandırılmış materyallerle akademik beceri eğitimi.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'tobi_national', label: 'TOBİ (Türkiye Okuma Becerileri İstifleme)', description: 'Akıcı okuma ve anlama yerel değerlendirme uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },

  // ---🤝 REHBERLİK & PSİKOLOJİ ---
  {
    id: 'cbt_children_intl',
    label: 'Çocuk ve Ergenlerde BDT (CBT)',
    description: 'Bilişsel Davranışçı Terapi uygulayıcı sertifikası.',
    category: 'PSYCHOLOGY_GUIDANCE',
    verificationQuestions: [
      {
        id: 'vq_cbt_1', category: 'technicalExpertise', type: 'radio',
        text: 'OKB tanılı bir çocukta "Maruz Bırakma ve Tepki Önleme" (ERP) çalışırken, çocuk ritüelini yapamadığı için yoğun anksiyete yaşıyor. Ne yaparsınız?',
        weightedOptions: [
          { label: 'Ritüeli yapmasına izin veririm, rahatlasın.', weights: { clinical: -0.5, empathy: 0.5 }, analysisInsight: 'Döngüyü Besleme: Anksiyeteyi geçici düşürüp OKB\'yi güçlendirme.' },
          { label: 'Anksiyete seviyesini (SUDs) derecelendirmesini ister, o duyguyla kalabilmesi için eşlik ederim (Surfing the urge).', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Klinik Ustalık: Terapötik pencerede kalma.' },
          { label: 'Dikkatini başka yöne çekerim.', weights: { clinical: 0.2 }, analysisInsight: 'Geçici Çözüm.' },
          { label: 'Bunun saçma olduğunu anlatırım.', weights: { clinical: -1.0 }, analysisInsight: 'Bilişsel Hata.' }
        ]
      }
    ]
  },
  { id: 'play_therapy_apt', label: 'Deneyimsel Oyun Terapisi (APT Onaylı)', description: 'Oyun yoluyla terapötik müdahale uzmanlığı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'agte_national', label: 'AGTE (Ankara Gelişim Tarama Envanteri)', description: 'Bebek ve çocuklarda yerel gelişim taraması uzmanlığı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'frostig_intl', label: 'Frostig Görsel Algı Testi', description: 'Görsel algı ve el-göz koordinasyonu analiz sertifikası.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'solution_focused_intl', label: 'Çözüm Odaklı Kısa Süreli Terapi', description: 'Okul ve rehberlik temelli hızlı çözüm yaklaşımı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'mmp_psych_intl', label: 'MMPI (Minnesota Çok Yönlü Kişilik Envanteri)', description: 'Klinik kişilik değerlendirme uzmanlık sertifikası.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  // --- KATMAN 1: KLİNİK MUHAKEME & KRİZ YÖNETİMİ (SHADOW PLAY) ---
  clinical_logic: [
    {
      id: 'clin_shadow_1', category: 'technicalExpertise', type: 'radio',
      text: 'Yoğun bir "Problem Davranış" (Örn: Kafasını masaya vurma) anında, çocuğun burnunun aktığını ve salyasının aktığını fark ettiniz. Bu durum çocuğun dikkatini de dağıtıyor. Saniyelik kararınız?',
      weightedOptions: [
        { 
          label: 'Hijyen ve konfor önceliklidir; hemen müdahale eder, çocuğun yüzünü temizler ve sakinleşince derse dönerim.', 
          weights: { clinical: -0.6, empathy: 1.0, sustainability: -0.2 }, 
          analysisInsight: 'Şefkat Tuzağı: Davranış anında fiziksel temas ve ilgi (temizlik) sağlayarak problem davranışı yanlışlıkla pekiştirme (Accidental Reinforcement) riski.' 
        },
        { 
          label: 'Kafasını korumak için el yastığı yaparım ama göz teması kurmadan, nötr bir yüzle krizin sönmesini bekler, temizliği kriz tamamen bitince yaparım.', 
          weights: { clinical: 1.0, empathy: 0.2, sustainability: 0.8 }, 
          analysisInsight: 'Klinik Sadakat: Güvenliği sağlarken "İlgi Çekme" veya "Kaçış" işlevini beslememe disiplini. (Planned Ignoring + Safety).' 
        },
        { 
          label: '"Yapma oğlum" diyerek çocuğu tutarım ve sakinleştirmeye çalışırım.', 
          weights: { clinical: -0.8, empathy: 0.2, sustainability: -0.5 }, 
          analysisInsight: 'Veri Kirliliği: Sözel uyaran vererek davranışı besleme (Social Attention) hatası.' 
        },
        { 
          label: 'Dersi o an sonlandırır, veliye çocuğu temizlemesi için teslim ederim.', 
          weights: { clinical: -1.0, empathy: -0.5, institutionalLoyalty: -0.5 }, 
          analysisInsight: 'Kaçınma Davranışı: Terapistin kriz anında otoriteyi ve sorumluluğu terk etmesi.' 
        }
      ]
    },
    {
      id: 'clin_shadow_2', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk aylar sonra ilk kez hedeflediğiniz kelimeyi (örn: "Su") söyledi ancak o sırada sandalyede tehlikeli bir şekilde, tek ayak üzerinde dengede duruyor. Pekiştireci (Çikolata) nasıl sunarsınız?',
      weightedOptions: [
        { 
          label: 'Güvenlik her şeyden önemlidir. Önce "Otur" derim, düzgün oturunca "Aferin" der ve ödülü veririm.', 
          weights: { clinical: -0.4, pedagogicalAnalysis: -0.5, sustainability: 0.5 }, 
          analysisInsight: 'Zamanlama Hatası: Hedef davranış (Konuşma) ile pekiştireç arasına "Oturma" talebi sokarak öğrenmeyi bozma (Blocking Effect).' 
        },
        { 
          label: 'Hiç beklemeden coşkuyla ödülü veririm; o an düşme riskini göze alırım çünkü "Su" demesi benim için altın değerindedir.', 
          weights: { clinical: 1.0, pedagogicalAnalysis: 1.0, formality: -0.3 }, 
          analysisInsight: 'Öncelik Yönetimi: Kritik beceriyi yakalamak için ikincil riskleri (kontrollü şekilde) yönetme zekası. (Catching the moment).' 
        },
        { 
          label: 'Görmezden gelirim, her şey mükemmel olmadan (hem oturuş hem konuşma) ödül verilirse yanlış davranış pekişir.', 
          weights: { clinical: -0.7, empathy: -0.5, pedagogicalAnalysis: -0.8 }, 
          analysisInsight: 'Mükemmeliyetçilik Tuzağı: Fırsat öğretimini kaçırma ve sönmeye sebep olma.' 
        }
      ]
    },
    {
      id: 'clin_shadow_3', category: 'technicalExpertise', type: 'radio',
      text: 'Seansın bitmesine 2 dakika var ve çocuk nihayet derse odaklandı, çok verimli bir akış ("Flow") yakaladınız. Ancak kapıda bir sonraki öğrenci ve velisi bekliyor. Kararınız?',
      weightedOptions: [
        { 
          label: 'Akışı bozmam, 5-10 dakika uzatırım. Eğitimdeki bu an, dışarıdaki velinin beklemesinden daha değerlidir.', 
          weights: { clinical: 0.6, ethics: -0.4, institutionalLoyalty: -0.5 }, 
          analysisInsight: 'Sınır İhlali (Time Boundary): İyi niyetli ama kurumsal zaman yönetimini ve diğer ailenin hakkını ihlal eden eylem.' 
        },
        { 
          label: 'Tam dakikasında keserim. Kurallar kuraldır, diğer öğrencinin hakkına giremem.', 
          weights: { clinical: -0.3, formality: 1.0, empathy: -0.2 }, 
          analysisInsight: 'Mekanik Uygulama: Pedagojik kazancı prosedüre kurban etme.' 
        },
        { 
          label: 'Mevcut akışı "en yüksek noktada" (Peak) sonlandırıp, çocuğun "başarma hissiyle" ve tadı damağında kalarak çıkmasını sağlarım.', 
          weights: { clinical: 1.0, pedagogicalAnalysis: 0.8, institutionalLoyalty: 0.8 }, 
          analysisInsight: 'Pedagojik Ustalık: Kısıtlılığı avantaja çevirme (Leave them wanting more) ve kurumsal düzene uyum.' 
        }
      ]
    },
    {
      id: 'clin_shadow_4', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuğun sevdiği oyuncağı kullanarak çalışıyorsunuz. Çocuk oyuncağı elinizden hışımla çekip aldı ve vermiyor. Güç mücadelesine girmeden kontrolü nasıl geri alırsınız?',
      weightedOptions: [
        { 
          label: '"Ver onu bana, yoksa ders biter!" diye net bir sınır koyarım.', 
          weights: { pedagogicalAnalysis: -0.4, empathy: -0.6, clinical: -0.2 }, 
          analysisInsight: 'Güç Savaşı (Power Struggle): Çocuğu savunmaya iten ve ilişkiyi zedeleyen eski ekol yaklaşımı.' 
        },
        { 
          label: 'Elindeki oyuncağın "eksik parçasını" (örn: arabanın yolu, bebeğin biberonu) elimde tutup, oyunu devam ettirmek için bana muhtaç olmasını (Motivasyonel Operasyon) sağlarım.', 
          weights: { pedagogicalAnalysis: 1.0, clinical: 0.9, empathy: 0.5 }, 
          analysisInsight: 'Ortam Kontrolü (Environmental Control): Fiziksel güç yerine motivasyonel kontrol ve zeka kullanımı.' 
        },
        { 
          label: 'Bırakırım oynasın, yeter ki ağlamasın, sonra ikna ederim.', 
          weights: { clinical: -0.6, sustainability: -0.4, workEthics: -0.3 }, 
          analysisInsight: 'Teslimiyet: Terapötik liderliğin kaybı ve çocuğa kontrolü verme.' 
        }
      ]
    },
    {
      id: 'clin_shadow_5', category: 'technicalExpertise', type: 'radio',
      text: 'Veri toplama kağıdınız (Data Sheet) o gün kaybolmuş veya unutulmuş. Seansa girdiniz. Ne yaparsınız?',
      weightedOptions: [
        { 
          label: 'Veri tutmam, aklımda tutarım, seanstan sonra hatırlar yazarım.', 
          weights: { clinical: -0.6, workEthics: -0.4 }, 
          analysisInsight: 'Hafıza Yanılgısı: Subjektif veri riski ve profesyonel ihmal.' 
        },
        { 
          label: 'Seansı iptal eder veya çocuğu bırakıp kağıdı aramaya giderim.', 
          weights: { clinical: -0.3, institutionalLoyalty: -0.5 }, 
          analysisInsight: 'Operasyonel Aksama: Çözüm odaklı olmama ve zaman kaybı.' 
        },
        { 
          label: 'Hemen bir boş kağıda, peçeteye veya elime "Tally" (çentik) atarak geçici bir kayıt sistemi kurarım. Verisiz seans olmaz.', 
          weights: { clinical: 1.0, sustainability: 0.8, workEthics: 0.9 }, 
          analysisInsight: 'Klinik Refleks: Şartlar ne olursa olsun veriye sadakat ve çözüm üretme.' 
        }
      ]
    }
  ],

  // --- KATMAN 2: ETİK SINIRLAR & VELİ DİPLOMASİSİ (SHADOW PLAY) ---
  ethics_parent: [
    {
      id: 'eth_shadow_1', category: 'workEthics', type: 'radio',
      text: 'Kurumun "Veliyle Şahsi Telefonlaşma Yasak" kuralı var. Ancak bir veli, çocuğunun gece geçirdiği nöbetin videosunu atmak için, panik halinde şahsi numaranızı istiyor. Tavrınız?',
      weightedOptions: [
        { 
          label: 'Veririm, sağlık söz konusu, o an kural düşünülmez.', 
          weights: { workEthics: -0.5, empathy: 0.8, institutionalLoyalty: -0.6 }, 
          analysisInsight: 'Sınır İhlali (Boundary Violation): İyi niyetli ama yönetilemez bir iletişim kapısı açma ve kurumsal protokolü delme riski.' 
        },
        { 
          label: 'Numaramı vermem, kurumsal hattan atmasını isterim. O an atamıyorsa "Sakin olun, sabah ilk iş izleyeceğim" derim.', 
          weights: { workEthics: 1.0, institutionalLoyalty: 1.0, empathy: 0.3 }, 
          analysisInsight: 'Profesyonel Sınır: Kriz anında bile kurumsal kanalı koruma ve veliyi regüle etme.' 
        },
        { 
          label: 'Numaramı veririm ama "Sakın beni aramayın, sadece videoyu atın ve sonra silin" derim.', 
          weights: { workEthics: -0.3, sustainability: -0.5 }, 
          analysisInsight: 'Naiflik: Sınırın delineceğini öngörememe ve gizli anlaşma yapma.' 
        }
      ]
    },
    {
      id: 'eth_shadow_2', category: 'parentStudentRelations', type: 'radio',
      text: 'Çocuğun 6 aydır yerinde saydığını (Plato) görüyorsunuz ama Koordinatör veliye "Her şey harika gidiyor" diyor. Veli size dönüp "Hocam sizce de öyle mi, ben ilerleme göremiyorum?" diye sordu. Cevabınız?',
      weightedOptions: [
        { 
          label: '"Müdürüm ne diyorsa doğrudur, ben yorum yapamam." derim.', 
          weights: { workEthics: -0.6, institutionalLoyalty: 0.4, personality: -0.4 }, 
          analysisInsight: 'Bürokratik Sığınma: Pasif suç ortaklığı ve mesleki kimliksizlik.' 
        },
        { 
          label: '"Hayır, çocuğunuz hiç ilerlemiyor, sizi oyalıyorlar." derim.', 
          weights: { institutionalLoyalty: -1.0, workEthics: 0.3, personality: -0.6 }, 
          analysisInsight: 'Kurumsal Sabotaj: Doğruyu söylerken kurumu yıkma (Yıkıcı Dürüstlük) ve ekip içi güveni bitirme.' 
        },
        { 
          label: '"Bazı alanlarda güzel çabaları var ancak X ve Y konularında (yerinde saydığı alanlar) daha yoğun çalışmamız ve strateji değiştirmemiz gerekiyor." diyerek gerçeği yumuşatmadan ama profesyonelce sunarım.', 
          weights: { workEthics: 1.0, parentStudentRelations: 1.0, institutionalLoyalty: 0.6 }, 
          analysisInsight: 'Diplomatik Dürüstlük: Kurumu korurken gerçeği manipüle etmeme, veliyi bilgilendirme ve çözüm odaklılık.' 
        }
      ]
    },
    {
      id: 'eth_shadow_3', category: 'workEthics', type: 'radio',
      text: 'Seans sırasında çocuğun vücudunda bir morluk gördünüz. Veliye sordunuz, "Düştü" dedi ama çocuk tedirgin. (İstismar şüphesi). Ne yaparsınız?',
      weightedOptions: [
        { 
          label: 'Veliye inandığımı söylerim, aile işine karışmak haddim değil.', 
          weights: { workEthics: -1.0, clinical: -0.8 }, 
          analysisInsight: 'İhmal: Çocuğun güvenliğini riske atma ve yasal sorumluluğu yok sayma.' 
        },
        { 
          label: 'Hemen polisi veya sosyal hizmetleri ararım.', 
          weights: { workEthics: 0.6, institutionalLoyalty: -0.4, sustainability: -0.3 }, 
          analysisInsight: 'Dürtüsel Eylem: Kurumsal protokolü ve silsileyi atlayarak kriz yaratma riski.' 
        },
        { 
          label: 'Vücut haritasına (Body Chart) morluğu işler, tutanak tutar ve derhal Kurum Müdürü/Psikoloğu ile "Kritik Vaka Toplantısı" talep ederim.', 
          weights: { workEthics: 1.0, institutionalLoyalty: 1.0, clinical: 0.9 }, 
          analysisInsight: 'Prosedürel Yetkinlik: Yasal ve kurumsal silsileyi doğru işletme, veriyi kaydetme.' 
        }
      ]
    },
    {
      id: 'eth_shadow_4', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli size çok umutsuz bir tonda "Hocam dürüst olun, bizim çocuktan adam olur mu, boşuna mı uğraşıyoruz?" diye sordu. Yanıtınız?',
      weightedOptions: [
        { 
          label: '"Tabii ki olur, o çok zeki bir çocuk, merak etmeyin, zamanla hepsi düzelecek." (Yalan bile olsa).', 
          weights: { workEthics: -0.5, parentStudentRelations: 0.4 }, 
          analysisInsight: 'Pembe Tablo: Etik olmayan sahte umut satışı ve profesyonel olmayan güvence.' 
        },
        { 
          label: '"Geleceği bilemeyiz, biz işimizi yapıyoruz." (Kaçamak).', 
          weights: { parentStudentRelations: -0.3, personality: -0.2 }, 
          analysisInsight: 'Soğukluk: Veliyi duygusal boşlukta bırakma ve empatik bağ kuramama.' 
        },
        { 
          label: '"Potansiyeli var ancak bu bir maraton. Biz şu anki hedefimiz olan X becerisine odaklanalım, orayı aştıkça önümüzü daha net göreceğiz." (Realist & Yönlendirici).', 
          weights: { parentStudentRelations: 1.0, workEthics: 1.0, clinical: 0.6 }, 
          analysisInsight: 'Profesyonel Umut: Gerçekçi, sürece odaklayan, ne aşırı vaat veren ne de umut kıran dengeli liderlik.' 
        }
      ]
    }
  ],

  // --- KATMAN 3: PSİKOLOJİK DAYANIKLILIK & TAKIM (SHADOW PLAY) ---
  resilience_team: [
    {
      id: 'res_shadow_1', category: 'sustainability', type: 'radio',
      text: 'Partner öğretmeniniz (eküri) derse sürekli geç geliyor ve bu yüzden sizin seanslarınız sarkıyor. Yönetim bunu fark etmiyor. Ne yaparsınız?',
      weightedOptions: [
        { 
          label: 'Onu hemen müdüre şikayet ederim, işini düzgün yapsın.', 
          weights: { sustainability: 0.3, fit: -0.6 }, 
          analysisInsight: 'İspiyonculuk/Çatışma: Takım içi güveni zedeleme ve sorunu birebir çözme yetisinden yoksunluk.' 
        },
        { 
          label: 'Küserek konuşmam, trip atarım, anlasın.', 
          weights: { sustainability: -0.6, personality: -0.7 }, 
          analysisInsight: 'Pasif Agresyon: Profesyonellik dışı çocuksu tepki.' 
        },
        { 
          label: 'Onu kenara çeker, "Geç kalman benim planımı bozuyor ve beni zor durumda bırakıyor, buna bir çözüm bulalım" diyerek "Ben Dili" ile konuşurum.', 
          weights: { sustainability: 1.0, fit: 1.0, personality: 0.9 }, 
          analysisInsight: 'Olgun İletişim (Assertiveness): Sorunu kaynağında, çatışma yaratmadan ve yönetimi meşgul etmeden çözme.' 
        }
      ]
    },
    {
      id: 'res_shadow_2', category: 'sustainability', type: 'radio',
      text: 'Çok emek verdiğiniz bir öğrenci, 3 ayın sonunda size vurdu ve yüzünüze tükürdü. O an hissettiğiniz duygu ve eyleminiz?',
      weightedOptions: [
        { 
          label: 'Öfkelenirim ve "Terbiyesiz, bir daha yapma!" diye bağırırım.', 
          weights: { sustainability: -1.0, clinical: -1.0 }, 
          analysisInsight: 'Duygusal Çöküş: Davranışı kişiselleştirme ve profesyonel maskeyi düşürme.' 
        },
        { 
          label: 'Çok üzülürüm, demek ki ben başarısızım, bana saygısı yok diye düşünürüm.', 
          weights: { sustainability: -0.6, personality: -0.4 }, 
          analysisInsight: 'Kırılganlık: Özgüven kaybı ve tükenmişlik sinyali.' 
        },
        { 
          label: 'Duygusal olarak etkilenmemeye çalışırım. "Bu bir davranış, şahsıma değil" derim ve ABC kaydına "Saldırganlık" olarak nötr şekilde işlerim.', 
          weights: { sustainability: 1.0, clinical: 1.0, workEthics: 0.8 }, 
          analysisInsight: 'Profesyonel Zırh (Depersonalization): Davranışı klinik bir veri olarak görme ve soğukkanlılık.' 
        }
      ]
    },
    {
      id: 'res_shadow_3', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumda o gün herkesin katıldığı bir doğum günü kutlaması var ama sizin yetiştirmeniz gereken çok acil raporlar var. Ne yaparsınız?',
      weightedOptions: [
        { 
          label: 'Gitmem, işim daha önemli, sosyalleşmek zorunda değilim.', 
          weights: { institutionalLoyalty: 0.3, fit: -0.5 }, 
          analysisInsight: 'Sosyal İzolasyon: Takım ruhunu önemsememe ve yabancılaşma.' 
        },
        { 
          label: 'İşleri bırakır tüm gün kutlamada otururum, ayıp olmasın.', 
          weights: { workEthics: -0.4, fit: 0.3 }, 
          analysisInsight: 'İş Disiplini Zafiyeti: Sosyal onayı işin önüne koyma.' 
        },
        { 
          label: '5-10 dakika uğrar, görünür, tebrik eder ve "Yetiştirmem gereken raporlar var, size iyi eğlenceler" diyerek nazikçe ayrılırım.', 
          weights: { institutionalLoyalty: 1.0, fit: 1.0, sustainability: 0.7 }, 
          analysisInsight: 'Sosyal Zeka ve Denge: Hem takıma aidiyet gösterme hem de sorumluluğu yerine getirme.' 
        }
      ]
    }
  ],

  // --- KATMAN 4: VİZYON & KURUMSAL AİDİYET (SHADOW PLAY) ---
  vision_loyalty: [
    {
      id: 'vis_shadow_1', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurum size pahalı bir eğitim olan "X Yöntemi"ni finanse edecek ama karşılığında 2 yıl kurumdan ayrılmama taahhüdü (sözleşme) istiyor. İmzalar mısınız?',
      weightedOptions: [
        { 
          label: 'Asla imzalamam, özgürlüğüm kısıtlanamaz, ben eğitimi kendim alırım.', 
          weights: { institutionalLoyalty: -0.6, developmentOpenness: 0.2 }, 
          analysisInsight: 'Bağlılık Sorunu: Yatırıma ve uzun vadeli işbirliğine kapalı profil.' 
        },
        { 
          label: 'İmzalarım ama daha iyi teklif gelirse tazminatı öder kaçarım.', 
          weights: { institutionalLoyalty: -0.8, workEthics: -0.6 }, 
          analysisInsight: 'Etik Risk: Güvenilmez ve fırsatçı profil.' 
        },
        { 
          label: 'Memnuniyetle imzalarım. Kurumun bana yatırım yapması, bana değer verdiğini gösterir ve kariyerim için bir fırsattır.', 
          weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, 
          analysisInsight: 'Kariyer Ortaklığı: Kurumla büyüme vizyonu ve karşılıklı güven.' 
        }
      ]
    },
    {
      id: 'vis_shadow_2', category: 'developmentOpenness', type: 'radio',
      text: 'Yönetim, Yapay Zeka (AI) destekli, çok detaylı ama öğrenmesi zor yeni bir raporlama sistemine geçiyor. İlk tepkiniz?',
      weightedOptions: [
        { 
          label: '"Eski usül kağıt kalem daha iyiydi, ne gerek var bu kadar teknolojiye?" diye direnç gösteririm.', 
          weights: { developmentOpenness: -0.7, institutionalLoyalty: -0.3 }, 
          analysisInsight: 'Değişim Direnci (Resistance to Change): Statükocu ve yeniliğe kapalı.' 
        },
        { 
          label: '"Tamam" derim ama kullanmam, başkasına yaptırırım veya eksik yaparım.', 
          weights: { workEthics: -0.6, developmentOpenness: -0.4 }, 
          analysisInsight: 'Pasif Direniş: Sinsi uyumsuzluk.' 
        },
        { 
          label: 'Zor olsa da öğrenmek için ekstra mesai harcarım. Teknoloji mesleğimizin geleceğidir ve buna adapte olmalıyım.', 
          weights: { developmentOpenness: 1.0, sustainability: 0.6 }, 
          analysisInsight: 'Gelişim Zihniyeti (Growth Mindset): Yeniliğe adaptasyon ve öğrenme hevesi.' 
        }
      ]
    }
  ]
};

export const TURKISH_UNIVERSITIES = [
  "Abdullah Gül Üniversitesi", "Acıbadem Mehmet Ali Aydınlar Üniversitesi", "Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi",
  "Adıyaman Üniversitesi", "Afyon Kocatepe Üniversitesi", "Afyonkarahisar Sağlık Bilimleri Üniversitesi", "Ağrı İbrahim Çeçen Üniversitesi",
  "Akdeniz Üniversitesi", "Aksaray Üniversitesi", "Alanya Alaaddin Keykubat Üniversitesi", "Alanya Üniversitesi", "Altınbaş Üniversitesi",
  "Amasya Üniversitesi", "Anadolu Üniversitesi", "Anka Teknoloji Üniversitesi", "Ankara Bilim Üniversitesi", "Ankara Hacı Bayram Veli Üniversitesi",
  "Ankara Medipol Üniversitesi", "Ankara Müzik ve Güzel Sanatlar Üniversitesi", "Ankara Sosyal Bilimler Üniversitesi", "Ankara Üniversitesi",
  "Ankara Yıldırım Beyazıt Üniversitesi", "Antalya Belek Üniversitesi", "Antalya Bilim Üniversitesi", "Ardahan Üniversitesi", "Artvin Çoruh Üniversitesi",
  "Ataşehir Adıgüzel Meslek Yüksekokulu", "Atatürk Üniversitesi", "Atılım Üniversitesi", "Avrasya Üniversitesi", "Aydın Adnan Menderes Üniversitesi",
  "Bahçeşehir Üniversitesi", "Balıkesir Üniversitesi", "Bandırma Onyedi Eylül Üniversitesi", "Bartın Üniversitesi", "Başkent Üniversitesi",
  "Batman Üniversitesi", "Bayburt Üniversitesi", "Beykent Üniversitesi", "Beykoz Üniversitesi", "Bezmialem Vakıf Üniversitesi",
  "Bilecik Şeyh Edebali Üniversitesi", "Bingöl Üniversitesi", "Biruni Üniversitesi", "Bitlis Eren Üniversitesi", "Boğaziçi Üniversitesi",
  "Bolu Abant İzzet Baysal Üniversitesi", "Burdur Mehmet Akif Ersoy Üniversitesi", "Bursa Teknik Üniversitesi", "Bursa Uludağ Üniversitesi",
  "Çağ Üniversitesi", "Çanakkale Onsekiz Mart Üniversitesi", "Çankaya Üniversitesi", "Çankırı Karatekin Üniversitesi", "Çukurova Üniversitesi",
  "Demiroğlu Bilim Üniversitesi", "Dicle Üniversitesi", "Doğuş Üniversitesi", "Dokuz Eylül Üniversitesi", "Düzce Üniversitesi", "Ege Üniversitesi",
  "Erciyes Üniversitesi", "Erzincan Binali Yıldırım Üniversitesi", "Erzurum Teknik Üniversitesi", "Eskişehir Osmangazi Üniversitesi",
  "Eskişehir Teknik Üniversitesi", "Fatih Sultan Mehmet Vakıf Üniversitesi", "Fenerbahçe Üniversitesi", "Fırat Üniversitesi", "Galatasaray Üniversitesi",
  "Gazi Üniversitesi", "Gaziantep İslam Bilim ve Teknoloji Üniversitesi", "Gaziantep Üniversitesi", "Gebze Teknik Üniversitesi", "Giresun Üniversitesi",
  "Gümüşhane Üniversitesi", "Hacettepe Üniversitesi", "Hakkari Üniversitesi", "Haliç Üniversitesi", "Harran Üniversitesi", "Hasan Kalyoncu Üniversitesi",
  "Hatay Mustafa Kemal Üniversitesi", "Hitit Üniversitesi", "Iğdır Üniversitesi", "Isparta Uygulamalı Bilimler Üniversitesi", "Işık Üniversitesi",
  "İbn Haldun Üniversitesi", "İhsan Doğramacı Bilkent Üniversitesi", "İnönü Üniversitesi", "İskenderun Teknik Üniversitesi", "İstanbul 29 Mayıs Üniversitesi",
  "İstanbul Arel Üniversitesi", "İstanbul Atlas Üniversitesi", "İstanbul Aydın Üniversitesi", "İstanbul Ayvansaray Üniversitesi", "İstanbul Bilgi Üniversitesi",
  "İstanbul Galata Üniversitesi", "İstanbul Gelişim Üniversitesi", "İstanbul Gedik Üniversitesi", "İstanbul Kent Üniversitesi", "İstanbul Kültür Üniversitesi",
  "İstanbul Medeniyet Üniversitesi", "İstanbul Medipol Üniversitesi", "İstanbul Okan Üniversitesi", "İstanbul Rumeli Üniversitesi", "İstanbul Sabahattin Zaim Üniversitesi",
  "İstanbul Sağlık ve Teknoloji Üniversitesi", "İstanbul Şişli Meslek Yüksekokulu", "İstanbul Teknik Üniversitesi", "İstanbul Ticaret Üniversitesi",
  "İstanbul Topkapı Üniversitesi", "İstanbul Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "İstanbul Yeni Yüzyıl Üniversitesi", "İstinye Üniversitesi",
  "İzmir Bakırçay Üniversitesi", "İzmir Demokrasi Üniversitesi", "İzmir Ekonomi Üniversitesi", "İzmir Katip Çelebi Üniversitesi",
  "İzmir Kavram Meslek Yüksekokulu", "İzmir Tınaztepe Üniversitesi", "İzmir Yüksek Teknoloji Enstitüsü", "Kadir Has Üniversitesi",
  "Kafkas Üniversitesi", "Kahramanmaraş İstiklal Üniversitesi", "Kahramanmaraş Sütçü İmam Üniversitesi", "Kapadokya Üniversitesi",
  "Karabük Üniversitesi", "Karadeniz Teknik Üniversitesi", "Karamanoğlu Mehmetbey Üniversitesi", "Kastamonu Üniversitesi", "Kayseri Üniversitesi",
  "Kırıkkale Üniversitesi", "Kırklareli Üniversitesi", "Kırşehir Ahi Evran Üniversitesi", "Kilis 7 Aralık Üniversitesi", "Kocaeli Sağlık ve Teknoloji Üniversitesi",
  "Kocaeli Üniversitesi", "Koç Üniversitesi", "Konya Gıda ve Tarım Üniversitesi", "Konya Teknik Üniversitesi", "KTO Karatay Üniversitesi",
  "Kütahya Dumlupınar Üniversitesi", "Kütahya Sağlık Bilimleri Üniversitesi", "Lokman Hekim Üniversitesi", "Malatya Turgut Özal Üniversitesi",
  "Manisa Celal Bayar Üniversitesi", "Mardin Artuklu Üniversitesi", "Marmara Üniversitesi", "MEF Üniversitesi", "Mersin Üniversitesi",
  "Mimar Sinan Güzel Sanatlar Üniversitesi", "Mudanya Üniversitesi", "Muğla Sıtkı Koçman Üniversitesi", "Munzur Üniversitesi", "Muş Alparslan Üniversitesi",
  "Necmettin Erbakan Üniversitesi", "Nevşehir Hacı Bektaş Veli Üniversitesi", "Niğde Ömer Halisdemir Üniversitesi", "Nişantaşı Üniversitesi",
  "Nuh Naci Yazgan Üniversitesi", "Ondokuz Mayıs Üniversitesi", "Ordu Üniversitesi", "Orta Doğu Teknik Üniversitesi", "Osmaniye Korkut Ata Üniversitesi",
  "Ostim Teknik Üniversitesi", "Özyeğin Üniversitesi", "Pamukkale Üniversitesi", "Piri Reis Üniversitesi", "Recep Tayyip Erdoğan Üniversitesi",
  "Sabancı Üniversitesi", "Sakarya Uygulamalı Bilimler Üniversitesi", "Sakarya Üniversitesi", "Sanko Üniversitesi", "Sağlık Bilimleri Üniversitesi",
  "Selçuk Üniversitesi", "Siirt Üniversitesi", "Sinop Üniversitesi", "Sivas Bilim ve Teknoloji Üniversitesi", "Sivas Cumhuriyet Üniversitesi",
  "Süleyman Demirel Üniversitesi", "Şırnak Üniversitesi", "Tarsus Üniversitesi", "TED Üniversitesi", "Tekirdağ Namık Kemal Üniversitesi",
  "TOBB Ekonomi ve Teknoloji Üniversitesi", "Tokat Gaziosmanpaşa Üniversitesi", "Toros Üniversitesi", "Trabzon Üniversitesi", "Trakya Üniversitesi",
  "Türk Hava Kurumu Üniversitesi", "Türk-Alman Üniversitesi", "Türkiye Uluslararası İslam, Bilim ve Teknoloji Üniversitesi", "Türk-Japon Bilim ve Teknoloji Üniversitesi",
  "Ufuk Üniversitesi", "Uşak Üniversitesi", "Üsküdar Üniversitesi", "Van Yüzüncü Yıl Üniversitesi", "Yalova Üniversitesi", "Yaşar Üniversitesi",
  "Yeditepe Üniversitesi", "Yıldız Teknik Üniversitesi", "Yozgat Bozok Üniversitesi", "Yüksek İhtisas Üniversitesi", "Zonguldak Bülent Ecevit Üniversitesi"
];

export const TURKISH_DEPARTMENTS = [
  "Özel Eğitim Öğretmenliği",
  "Zihin Engelliler Öğretmenliği",
  "İşitme Engelliler Öğretmenliği",
  "Görme Engelliler Öğretmenliği",
  "Üstün Zekalılar Öğretmenliği",
  "Okul Öncesi Öğretmenliği",
  "Sınıf Öğretmenliği",
  "Rehberlik ve Psikolojik Danışmanlık (PDR)",
  "Psikoloji",
  "Çocuk Gelişimi (Lisans)",
  "Çocuk Gelişimi (Önlisans)",
  "Dil ve Konuşma Terapisi",
  "Ergoterapi",
  "Fizyoterapi ve Rehabilitasyon",
  "Odyoloji",
  "Sosyal Hizmet",
  "İngilizce Öğretmenliği",
  "Türkçe Öğretmenliği",
  "Matematik Öğretmenliği (İlköğretim)",
  "Fen Bilgisi Öğretmenliği",
  "Sosyal Bilgiler Öğretmenliği",
  "Beden Eğitimi ve Spor Öğretmenliği",
  "Müzik Öğretmenliği",
  "Görsel Sanatlar / Resim-İş Öğretmenliği",
  "Türk Dili ve Edebiyatı Öğretmenliği",
  "Tarih Öğretmenliği",
  "Coğrafya Öğretmenliği",
  "Felsefe Grubu Öğretmenliği",
  "Matematik Öğretmenliği (Lise)",
  "Fizik Öğretmenliği",
  "Kimya Öğretmenliği",
  "Biyoloji Öğretmenliği",
  "Almanca Öğretmenliği",
  "Fransızca Öğretmenliği",
  "Arapça Öğretmenliği",
  "Bilgisayar ve Öğretim Teknolojileri Öğretmenliği (BÖTE)",
  "Teknoloji ve Tasarım Öğretmenliği"
];
