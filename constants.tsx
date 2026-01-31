
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
        text: 'Bir problem davranışın işlevi "Kaçma/Kaçınma" (Escape) olarak belirlendi. Ancak çocuk o gün hasta görünüyor (Grip). "Talep Gönderme" (Demanding) konusunda stratejiniz ne olur?',
        weightedOptions: [
          { label: 'Klinik Esneklik (Demand Fading): Fizyolojik bariyer (hastalık) kritiktir; kaçınmayı pekiştirmemek için talebi tamamen kaldırmam, ancak zorluk derecesini %80 düşürerek "başarı momentumunu" korurum.', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Usta Klinisyen: Prosedürü bozmadan insani uyarlama yapabilme.' },
          { label: 'Şefkat Önceliği: Çocuk hasta olduğu için tüm akademik talepleri kaldırır, günü serbest oyun ve eşleşme (Pairing) ile geçirerek konforunu sağlarım.', weights: { clinical: -0.5, empathy: 1.0 }, analysisInsight: 'Şefkat Tuzağı: Hastalığı, kaçınma davranışı için meşru bir araç haline getirme riski.' },
          { label: 'Prosedürel Sadakat: Hastalık davranışı etkilemez; tutarlılık adına belirlenen programı aynen uygularım, taviz verirsem davranış artar.', weights: { clinical: 0.2, empathy: -1.0 }, analysisInsight: 'Mekanik Uygulama: Fizyolojik durumu ihmal eden katı yaklaşım.' },
          { label: 'Sorumluluk Devri: Sağlık durumu nedeniyle riske girmemek adına seansı iptal eder veya ebeveyne devrederim.', weights: { clinical: -0.8, institutionalLoyalty: -0.5 }, analysisInsight: 'Sorumluluktan Kaçış.' }
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
          { label: 'Davranışsal Müdahale: Dönmesini fiziksel olarak durdurup, yüzünü bana çevirmesini sağlayarak dikkatini regüle ederim.', weights: { clinical: -0.5, pedagogicalAnalysis: -0.3 }, analysisInsight: 'Model Karmaşası: İlişki temelli modele davranışçı (kontrolcü) müdahale.' },
          { label: 'Aynalama (Join-in): Onunla birlikte, aynı yöne ve aynı hızda dönerek onun dünyasına girer, vestibüler girdiyi paylaşarak ilişki kapısını aralarım.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Klinik Rezonans: Çocuğun ilgisi üzerinden ilişki başlatma ustalığı.' },
          { label: 'Gözlem: Müdahale etmeden dönmesinin bitmesini bekler, bitince ilgisini çekecek oyuncaklar sunarım.', weights: { clinical: 0.2 }, analysisInsight: 'Pasif Terapist.' },
          { label: 'Güvenlik: Başının dönüp düşmemesi için onu sandalyeye oturtur ve masa başı etkinliğe geçerim.', weights: { clinical: -0.2, empathy: 0.5 }, analysisInsight: 'Koruyucu Refleks (Aşırı Kontrol).' }
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
          { label: 'Kapasite Kullanımı: Sözel zekası yüksek olduğu için detaylı, uzun ve zengin içerikli yönergeler vererek dil becerisini kullanmasını sağlarım.', weights: { clinical: -0.8 }, analysisInsight: 'Klinik Hata: Bellek kapasitesini sözel zeka ile karıştırma.' },
          { label: 'Adaptasyon: Yönergeleri parçalara böler, "chunking" tekniği uygular ve görsel ipuçlarıyla destekleyerek bellek yükünü azaltırım.', weights: { clinical: 1.0 }, analysisInsight: 'Bilişsel Profil Adaptasyonu.' },
          { label: 'Not Alma: Her söylediğimi not almasını isterim, böylece unutmaz.', weights: { clinical: 0.4 }, analysisInsight: 'Kısmen doğru ama her yaşa uygun değil.' },
          { label: 'Fiziksel Düzenleme: Dikkatini toplaması için onu en ön sıraya ve öğretmene yakın oturturum.', weights: { clinical: 0.2 }, analysisInsight: 'Klasik ama sığ yaklaşım.' }
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
          { label: 'Duyarsızlaştırma: "Korkacak bir şey yok" diyerek harekete devam etmek ve çocuğun bu hisse alışmasını sağlamak.', weights: { clinical: -0.8, empathy: -0.5 }, analysisInsight: 'Travmatize Etme Riski.' },
          { label: 'Dereceli Maruz Bırakma: Çocuğun kontrolünde, ayaklarının yere değebileceği alçak seviyeli doğrusal (lineer) hareketlerle güven inşa etmek.', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Klinik Ustalık: Güven ve nörolojik adaptasyon.' },
          { label: 'Masa Başı: Vestibüler sistemden kaçınarak sadece masa başı ince motor çalışmak.', weights: { clinical: 0.0 }, analysisInsight: 'Sorundan kaçınma.' },
          { label: 'Görsel Blokaj: Gözlerini kapatmasını söyleyerek görsel uyaranı kesmek.', weights: { clinical: -0.5 }, analysisInsight: 'Güvensizliği artırma.' }
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
          { label: 'Anksiyete Azaltma: Ritüeli yapmasına izin veririm, önemli olan çocuğun sakinleşmesidir.', weights: { clinical: -0.5, empathy: 0.5 }, analysisInsight: 'Döngüyü Besleme: Anksiyeteyi geçici düşürüp OKB\'yi güçlendirme.' },
          { label: 'Surfing the Urge: Anksiyete seviyesini (SUDs) derecelendirmesini ister, o duyguyla kalabilmesi için eşlik ederim. Anksiyetenin tepe yapıp kendiliğinden düşmesini bekleriz.', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Klinik Ustalık: Terapötik pencerede kalma.' },
          { label: 'Dikkat Dağıtma: Dikkatini hemen sevdiği bir oyuna çekerim.', weights: { clinical: 0.2 }, analysisInsight: 'Geçici Çözüm.' },
          { label: 'Bilişsel İkna: Bunun saçma olduğunu mantıklı argümanlarla anlatırım.', weights: { clinical: -1.0 }, analysisInsight: 'Bilişsel Hata.' }
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
  
  // ============================================================
  // KATMAN 1: KLİNİK MUHAKEME & KRİZ YÖNETİMİ (SHADOW PLAY)
  // Kapsam: Klinik Yeterlilik + Pedagojik Altyapı
  // ============================================================
  clinical_logic: [
    {
      id: 'clin_shadow_1', category: 'technicalExpertise', type: 'radio',
      text: 'Yoğun bir "Problem Davranış" (Örn: Kafasını masaya vurma) anında, çocuğun burnunun aktığını ve salyasının aktığını fark ettiniz. Bu durum çocuğun dikkatini de dağıtıyor. Saniyelik kararınız?',
      weightedOptions: [
        { label: 'Hijyen ve Şefkat (Temas): Hijyen ve konfor önceliklidir; hemen müdahale eder, çocuğun yüzünü temizler ve sakinleşince derse dönerim.', weights: { clinical: -0.6, empathy: 1.0, sustainability: -0.2 }, analysisInsight: 'Şefkat Tuzağı: Davranış anında fiziksel temas ve ilgi (temizlik) sağlayarak problem davranışı yanlışlıkla pekiştirme (Accidental Reinforcement) riski.' },
        { label: 'Klinik Sadakat (Planned Ignoring): Kafasını korumak için el yastığı yaparım ama göz teması kurmadan, nötr bir yüzle krizin sönmesini bekler, temizliği kriz tamamen bitince yaparım.', weights: { clinical: 1.0, empathy: 0.2, sustainability: 0.8 }, analysisInsight: 'Klinik Sadakat: Güvenliği sağlarken "İlgi Çekme" veya "Kaçış" işlevini beslememe disiplini. (Planned Ignoring + Safety).' },
        { label: 'Sözel Uyarı: "Yapma oğlum" diyerek çocuğu tutarım ve sakinleştirmeye çalışırım.', weights: { clinical: -0.8, empathy: 0.2, sustainability: -0.5 }, analysisInsight: 'Veri Kirliliği: Sözel uyaran vererek davranışı besleme (Social Attention) hatası.' },
        { label: 'Seans İptali: Dersi o an sonlandırır, veliye çocuğu temizlemesi için teslim ederim.', weights: { clinical: -1.0, empathy: -0.5, institutionalLoyalty: -0.5 }, analysisInsight: 'Kaçınma Davranışı: Terapistin kriz anında otoriteyi ve sorumluluğu terk etmesi.' }
      ]
    },
    {
      id: 'clin_shadow_2', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk aylar sonra ilk kez hedeflediğiniz kelimeyi (örn: "Su") söyledi ancak o sırada sandalyede tehlikeli bir şekilde, tek ayak üzerinde dengede duruyor. Pekiştireci (Çikolata) nasıl sunarsınız?',
      weightedOptions: [
        { label: 'Önce Güvenlik: Güvenlik her şeyden önemlidir. Önce "Otur" derim, düzgün oturunca "Aferin" der ve ödülü veririm.', weights: { clinical: -0.4, pedagogicalAnalysis: -0.5, sustainability: 0.5 }, analysisInsight: 'Zamanlama Hatası (Blocking): Hedef davranış (Konuşma) ile pekiştireç arasına "Oturma" talebi sokarak öğrenmeyi bozma.' },
        { label: 'Fırsat Yakalama (Catching the Moment): Hiç beklemeden coşkuyla ödülü veririm; o an düşme riskini göze alırım çünkü "Su" demesi benim için altın değerindedir.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0, formality: -0.3 }, analysisInsight: 'Öncelik Yönetimi: Kritik beceriyi yakalamak için ikincil riskleri (kontrollü şekilde) yönetme zekası.' },
        { label: 'Mükemmeliyetçilik: Görmezden gelirim, her şey mükemmel olmadan (hem oturuş hem konuşma) ödül verilirse yanlış davranış pekişir.', weights: { clinical: -0.7, empathy: -0.5, pedagogicalAnalysis: -0.8 }, analysisInsight: 'Mükemmeliyetçilik Tuzağı: Fırsat öğretimini kaçırma ve sönmeye sebep olma.' }
      ]
    },
    {
      id: 'clin_shadow_3', category: 'technicalExpertise', type: 'radio',
      text: 'Seansın bitmesine 2 dakika var ve çocuk nihayet derse odaklandı, çok verimli bir akış ("Flow") yakaladınız. Ancak kapıda bir sonraki öğrenci ve velisi bekliyor. Kararınız?',
      weightedOptions: [
        { label: 'Esneklik: Akışı bozmam, 5-10 dakika uzatırım. Eğitimdeki bu an, dışarıdaki velinin beklemesinden daha değerlidir.', weights: { clinical: 0.6, ethics: -0.4, institutionalLoyalty: -0.5 }, analysisInsight: 'Sınır İhlali (Time Boundary): İyi niyetli ama kurumsal zaman yönetimini ve diğer ailenin hakkını ihlal eden eylem.' },
        { label: 'Katı Kuralcılık: Tam dakikasında keserim. Kurallar kuraldır, diğer öğrencinin hakkına giremem.', weights: { clinical: -0.3, formality: 1.0, empathy: -0.2 }, analysisInsight: 'Mekanik Uygulama: Pedagojik kazancı prosedüre kurban etme.' },
        { label: 'Pedagojik Final (Peak-End): Mevcut akışı "en yüksek noktada" (Peak) sonlandırıp, çocuğun "başarma hissiyle" ve tadı damağında kalarak çıkmasını sağlarım.', weights: { clinical: 1.0, pedagogicalAnalysis: 0.8, institutionalLoyalty: 0.8 }, analysisInsight: 'Pedagojik Ustalık: Kısıtlılığı avantaja çevirme (Leave them wanting more) ve kurumsal düzene uyum.' }
      ]
    },
    {
      id: 'clin_shadow_4', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuğun sevdiği oyuncağı kullanarak çalışıyorsunuz. Çocuk oyuncağı elinizden hışımla çekip aldı ve vermiyor. Güç mücadelesine girmeden kontrolü nasıl geri alırsınız?',
      weightedOptions: [
        { label: 'Otorite: "Ver onu bana, yoksa ders biter!" diye net bir sınır koyarım.', weights: { pedagogicalAnalysis: -0.4, empathy: -0.6, clinical: -0.2 }, analysisInsight: 'Güç Savaşı (Power Struggle): Çocuğu savunmaya iten ve ilişkiyi zedeleyen eski ekol yaklaşımı.' },
        { label: 'Motivasyonel Kontrol (Environmental Control): Elindeki oyuncağın "eksik parçasını" (örn: arabanın yolu, bebeğin biberonu) elimde tutup, oyunu devam ettirmek için bana muhtaç olmasını (Motivasyonel Operasyon) sağlarım.', weights: { pedagogicalAnalysis: 1.0, clinical: 0.9, empathy: 0.5 }, analysisInsight: 'Ortam Kontrolü: Fiziksel güç yerine motivasyonel kontrol ve zeka kullanımı.' },
        { label: 'Teslimiyet: Bırakırım oynasın, yeter ki ağlamasın, sonra ikna ederim.', weights: { clinical: -0.6, sustainability: -0.4, workEthics: -0.3 }, analysisInsight: 'Liderlik Kaybı: Terapötik liderliğin kaybı ve çocuğa kontrolü verme.' }
      ]
    },
    {
      id: 'clin_shadow_5', category: 'technicalExpertise', type: 'radio',
      text: 'Veri toplama kağıdınız (Data Sheet) o gün kaybolmuş veya unutulmuş. Seansa girdiniz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Hafıza Güveni: Veri tutmam, aklımda tutarım, seanstan sonra hatırlar yazarım.', weights: { clinical: -0.6, workEthics: -0.4 }, analysisInsight: 'Hafıza Yanılgısı: Subjektif veri riski ve profesyonel ihmal.' },
        { label: 'İptal: Seansı iptal eder veya çocuğu bırakıp kağıdı aramaya giderim.', weights: { clinical: -0.3, institutionalLoyalty: -0.5 }, analysisInsight: 'Operasyonel Aksama: Çözüm odaklı olmama ve zaman kaybı.' },
        { label: 'Doğaçlama Kayıt: Hemen bir boş kağıda, peçeteye veya elime "Tally" (çentik) atarak geçici bir kayıt sistemi kurarım. Verisiz seans olmaz.', weights: { clinical: 1.0, sustainability: 0.8, workEthics: 0.9 }, analysisInsight: 'Klinik Refleks: Şartlar ne olursa olsun veriye sadakat ve çözüm üretme.' }
      ]
    },
    // YENİ EKLENEN: KLİNİK YETERLİLİK & PEDAGOJİK ALTYAPI (10+10 = 20 SORU)
    {
      id: 'clin_new_1', category: 'technicalExpertise', type: 'radio',
      text: 'Otizmli bir öğrenci "Sözel Stereotipi" (Ekolali) yapıyor. Veli bunu "konuşuyor" sanıp seviniyor. Veliye gerçeği nasıl aktarırsınız?',
      weightedOptions: [
        { label: 'Gerçekçi Yaklaşım: "Bu konuşma değil, anlamsız papağan tekrarı" diyerek net konuşurum, aileyi boş yere umutlandırmam.', weights: { clinical: 0.5, empathy: -0.8 }, analysisInsight: 'Kaba Gerçekçilik: Aileyi demoralize etme riski.' },
        { label: 'Pembe Yalan: "Evet, konuşması harika!" diyerek ailenin moralini bozmam.', weights: { clinical: -1.0, ethics: -0.8 }, analysisInsight: 'Profesyonel Yalan: Gelişimi sabote eden yanıltıcı bilgi.' },
        { label: 'Fonksiyonel Dönüşüm: "Ses çıkarması harika bir başlangıç. Şimdi bu sesleri "iletişimsel amaca" (fonksiyonel) dönüştürmek için çalışacağız" diyerek çerçeveyi değiştiririm.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Klinik Diplomasisi: Pozitifi koruyarak bilimsel hedefe yönlendirme.' }
      ]
    },
    {
      id: 'clin_new_2', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuk masadaki materyalleri sürekli yere atıyor. Bu davranışı "Duyusal Arayış" mı yoksa "Dikkat Çekme" mi olduğunu nasıl anlarsınız?',
      weightedOptions: [
        { label: 'Sözel Sorgu: Çocuğa "Neden atıyorsun?" diye sorarım.', weights: { clinical: -0.5 }, analysisInsight: 'Bilişsel Hata: Sözel olmayan çocuktan içgörü bekleme.' },
        { label: 'İşlevsel Analiz (Test): Ona kızdığımda (dikkat verdiğimde) artıyor mu, yoksa ben yokken de (sesi duymak için) atıyor mu diye test ederim.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Bilimsel Gözlem: Davranışın işlevini test etme yetisi.' },
        { label: 'Genel Müdahale: Farketmez, her türlü engellerim.', weights: { clinical: -0.2, pedagogicalAnalysis: -0.5 }, analysisInsight: 'Yüzeysel Müdahale.' }
      ]
    },
    {
      id: 'clin_new_3', category: 'technicalExpertise', type: 'radio',
      text: 'Öğrenciniz derste uyuyor. Veli "Gece uyumadı, lütfen onu zorlamayın, uyusun" dedi. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Veli Talebi: Veliye saygı duyar, çocuğu uyuturum.', weights: { clinical: -0.8, institutionalLoyalty: -0.5 }, analysisInsight: 'Pasif Bakıcılık: Kurumun eğitim misyonunu ihlal.' },
        { label: 'Eğitim Disiplini: Çocuğun yüzünü yıkar, hareketli aktivitelerle uyarılmasını sağlarım. Burası okul, uyuma yeri değil.', weights: { clinical: 1.0, sustainability: 0.5 }, analysisInsight: 'Profesyonel Duruş: Eğitimin sürekliliğini sağlama.' },
        { label: 'İptal: Dersi iptal eder, veliye teslim ederim.', weights: { clinical: -0.5 }, analysisInsight: 'Kaçış.' }
      ]
    },
    {
      id: 'clin_new_4', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuğa "Kırmızı"yı öğretiyorsunuz. Masada sadece Kırmızı Kart var. Çocuk doğru gösterdi. Bu öğretim yeterli midir?',
      weightedOptions: [
        { label: 'Yeterli: Evet, bildi.', weights: { pedagogicalAnalysis: -0.8 }, analysisInsight: 'Hatalı Öğretim: Şans faktörünü (50/50 bile değil, %100) eleyememe.' },
        { label: 'Ayırt Etme (Discrimination): Hayır, masaya "Mavi" (Çeldirici) koyup ayırt etmesini (Discrimination) sağlamadan öğrenme gerçekleşmiş sayılmaz.', weights: { pedagogicalAnalysis: 1.0, clinical: 0.8 }, analysisInsight: 'Ayırt Etme Öğretimi: Gerçek öğrenme kriteri.' },
        { label: 'Genelleme: Kırmızı elma da göstermeliyim.', weights: { pedagogicalAnalysis: 0.2 }, analysisInsight: 'Genelleme (Doğru ama öncelik ayırt etme).' }
      ]
    },
    {
      id: 'clin_new_5', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk ağladığında susması için ona telefon veren bir ebeveyn gördüğünüzde tepkiniz?',
      weightedOptions: [
        { label: 'Kayıtsızlık: Karışmam, ebeveynin tercihi.', weights: { clinical: -0.5, ethics: -0.2 }, analysisInsight: 'Sorumsuzluk.' },
        { label: 'Korkutma: "Sakın vermeyin, otizm yapar!" diye korkuturum.', weights: { clinical: -0.2, empathy: -0.8 }, analysisInsight: 'Bilimsel Olmayan Korkutma.' },
        { label: 'Psiko-Eğitim: Uygun bir zamanda, bu eylemin ağlamayı nasıl "ödüllendirdiğini" ve gelecekte ağlama krizlerini artıracağını ABC döngüsüyle açıklarım.', weights: { clinical: 1.0, parentStudentRelations: 0.8 }, analysisInsight: 'Psiko-Eğitim: Ebeveyni suçlamadan mekanizmayı öğretme.' }
      ]
    },
    {
      id: 'clin_new_6', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Grup dersinde bir öğrenci diğerine vurdu. İlk müdahale kime yapılmalı?',
      weightedOptions: [
        { label: 'Ceza: Vurana kızılmalı ve mola (time-out) verilmeli.', weights: { pedagogicalAnalysis: -0.2 }, analysisInsight: 'Cezalandırıcı Yaklaşım.' },
        { label: 'Mağdur Onarımı: Vurulan çocuğa ilgi gösterilmeli ki vuran çocuk "ilgi çekmek için vurma" davranışının işe yaramadığını görsün.', weights: { pedagogicalAnalysis: 1.0, clinical: 0.9 }, analysisInsight: 'Stratejik İhmal: Zorbalığı beslemeyen sosyal mühendislik.' },
        { label: 'Nötr: İkisi de ayrılmalı.', weights: { pedagogicalAnalysis: 0.0 }, analysisInsight: 'Nötr.' }
      ]
    },
    {
      id: 'clin_new_7', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk derste sürekli "Tuvaletim geldi" diyerek dersten kaçıyor (Escape). Gerçekten tuvaleti olup olmadığını bilmiyorsunuz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Yasaklama: İzin vermem, altına yapsa da derste kalacak.', weights: { clinical: -0.5, ethics: -1.0 }, analysisInsight: 'İnsan Hakları İhlali Riski.' },
        { label: 'İzin Verme: Her seferinde gönderirim, fizyolojik ihtiyaçtır.', weights: { clinical: -0.5 }, analysisInsight: 'Davranışsal Manipülasyona Teslimiyet.' },
        { label: 'Kaçınmayı Söndürme: Tuvalete götürürüm ama orada "bekleme süresi" ekleyerek veya tuvaleti "sıkıcı" hale getirerek (nötr kalarak) kaçışın ödül değerini düşürürüm.', weights: { clinical: 1.0 }, analysisInsight: 'Kaçınmayı Söndürme: Fizyolojik ihtiyacı reddetmeden motivasyonu kırma.' }
      ]
    },
    {
      id: 'clin_new_8', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Okuma yazma öğretiminde çocuk "b" ve "d" harflerini karıştırıyor. En etkili strateji nedir?',
      weightedOptions: [
        { label: 'Tekrar: Yüz kere yazdırırım.', weights: { pedagogicalAnalysis: -0.5 }, analysisInsight: 'Ezberci Ceza.' },
        { label: 'Çok Duyulu Öğretim: Görsel ipuçları (Örn: "b" baba, "d" dede göbeği) ve çok duyulu (kumda yazma) yöntemlerle bedensel hafızayı devreye sokarım.', weights: { pedagogicalAnalysis: 1.0 }, analysisInsight: 'Multisensory Öğretim.' },
        { label: 'Punto: Daha büyük punto ile yazarım.', weights: { pedagogicalAnalysis: 0.2 }, analysisInsight: 'Yetersiz Uyarlama.' }
      ]
    },
    {
      id: 'clin_new_9', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuğun gelişim raporunda "Göz teması kurar" yazıyor ama çocuk sadece siz elinizde şeker varken bakıyor. Bu beceri kazanılmış mıdır?',
      weightedOptions: [
        { label: 'Kazanılmış: Evet, sonuçta bakıyor.', weights: { clinical: -0.8 }, analysisInsight: 'Klinik Körlük: Koşullu bakışı genellenmiş beceri sanma.' },
        { label: 'Kazanılmamış: Hayır, bu "Pekiştireç Odaklı" bakıştır. Sosyal amaçlı spontane bakış olmadan beceri kazanılmış sayılmaz.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik Doğruluk.' },
        { label: 'Kısmen: Bazen kuruyor.', weights: { clinical: 0.0 }, analysisInsight: 'Belirsiz.' }
      ]
    },
    {
      id: 'clin_new_10', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuk seansta size tükürdü. Duygusal tepkiniz ne olmalıdır?',
      weightedOptions: [
        { label: 'Duygusal Tepki: "Terbiyesiz!" diye bağırıp otorite kurmak.', weights: { pedagogicalAnalysis: -0.8, clinical: -0.5 }, analysisInsight: 'Duygusal Kontrol Kaybı.' },
        { label: 'Nötr Yüz (Poker Face): Tamamen nötr kalarak, tükürmenin bende bir duygu (öfke/üzüntü) yaratmadığını gösterip davranışın "güç/kontrol" işlevini boşa çıkarmak.', weights: { pedagogicalAnalysis: 1.0, clinical: 1.0 }, analysisInsight: 'Profesyonel Sönümleme: Davranışı besleyen duygusal yakıtı kesmek.' },
        { label: 'İğrenme: İğrenmiş bir yüz ifadesiyle silmek.', weights: { pedagogicalAnalysis: -0.4 }, analysisInsight: 'Sosyal Ceza (Bazen işe yarar ama riskli).' }
      ]
    },
    // PEDAGOJİK EKLEMELER
    {
      id: 'clin_new_11', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Otizmli bir öğrenciye "Soyut Kavramları" (Örn: Mutluluk, Hüzün) öğretirken nasıl bir yol izlersiniz?',
      weightedOptions: [
        { label: 'Sözlük Tanımı: Sözlük anlamını anlatırım.', weights: { pedagogicalAnalysis: -0.5 }, analysisInsight: 'Soyut Hata: Otizmde sözel açıklama yetersizdir.' },
        { label: 'Deneyimsel Etiketleme: O an yaşadığı deneyimle (örn: salıncakta gülerken) "Bak şu an mutlusun" diyerek etiketi o duyguya anlık yapıştırırım (Labeling Live).', weights: { pedagogicalAnalysis: 1.0 }, analysisInsight: 'Deneyimsel Öğretim.' },
        { label: 'Görsel Kart: Sadece emoji kartları gösteririm.', weights: { pedagogicalAnalysis: 0.2 }, analysisInsight: 'Sığ Görselleştirme.' }
      ]
    },
    {
      id: 'clin_new_12', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuğun takıntısı (Obsesyon) ders işlemenize engel oluyor (Örn: Sürekli arabaları diziyor). Ne yaparsınız?',
      weightedOptions: [
        { label: 'Engelleme: Arabaları saklarım.', weights: { clinical: -0.5 }, analysisInsight: 'Kriz Tetikleme.' },
        { label: 'İlgi Alanını Kullanma: Arabaları dizme eylemini dersin içine katarım (Örn: "Kırmızı arabayı diz", "İki araba diz") ve takıntıyı öğretim aracına dönüştürürüm.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'İlgi Alanını Kullanma (Using Special Interests).' },
        { label: 'Serbest Bırakma: Takıntısına izin veririm, mutlu olsun.', weights: { clinical: -0.5 }, analysisInsight: 'Amaçsız Vakit Geçirme.' }
      ]
    },
    {
      id: 'clin_new_13', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çok hareketli (Hiperaktif) bir çocukla masa başı çalışması nasıl başlatılır?',
      weightedOptions: [
        { label: 'Fiziksel Zorlama: Zorla oturtup "Kalkmak yasak" diyerek.', weights: { pedagogicalAnalysis: -0.6 }, analysisInsight: 'Fiziksel Zorlama.' },
        { label: 'Premack & Shaping: Önce 1 dakika otur, sonra 5 dakika zıpla (Premack) şeklinde başlayıp, oturma süresini kademeli artırarak (Shaping).', weights: { pedagogicalAnalysis: 1.0, clinical: 0.8 }, analysisInsight: 'Kademeli Şekillendirme.' },
        { label: 'Yer Çalışması: Masa başı çalışmam, hep yerde oynarım.', weights: { pedagogicalAnalysis: 0.0 }, analysisInsight: 'Okula Hazırlık Eksikliği.' }
      ]
    },
    {
      id: 'clin_new_14', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk "Ben yapamam" diyerek (Öğrenilmiş Çaresizlik) görevi reddediyor. Yaklaşımınız?',
      weightedOptions: [
        { label: 'Motivasyon: "Yaparsın aslanım" diye gaz veririm.', weights: { clinical: 0.0 }, analysisInsight: 'Boş Motivasyon.' },
        { label: 'Hatasız Öğretim: Görevi, çocuğun "Hata yapmasının imkansız olduğu" kadar küçük parçalara bölerek (Errorless Learning) ona başarı hissini tattırırım.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Hatasız Öğretim ve Başarı Zinciri.' },
        { label: 'Tehdit: Yapmazsan teneffüs yok derim.', weights: { clinical: -0.8 }, analysisInsight: 'Tehdit.' }
      ]
    },
    {
      id: 'clin_new_15', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Kaynaştırma öğrencisi olan bir çocuk sınıfta dışlanıyor. Öğretmen olarak rolünüz?',
      weightedOptions: [
        { label: 'Emir: Diğer çocuklara "Onunla oynayın" diye emrederim.', weights: { pedagogicalAnalysis: -0.5 }, analysisInsight: 'Zoraki Sosyalleşme.' },
        { label: 'Sosyal Mühendislik: Çocuğun en iyi yaptığı şeyi (örn: iyi resim çiziyor) ön plana çıkararak sınıfta "doğal bir hayranlık ve statü" kazanmasını sağlarım.', weights: { pedagogicalAnalysis: 1.0, empathy: 0.8 }, analysisInsight: 'Sosyal Mühendislik ve Güçlendirme.' },
        { label: 'İhmal: Kendi haline bırakırım.', weights: { pedagogicalAnalysis: -1.0 }, analysisInsight: 'İhmal.' }
      ]
    },
    {
      id: 'clin_new_16', category: 'technicalExpertise', type: 'radio',
      text: 'Otizmli çocuk size sarılmak istiyor. Sınırınız ne olmalı?',
      weightedOptions: [
        { label: 'Sınırsızlık: Ben de sarılır öperim, sevgi iyileştirir.', weights: { clinical: -0.5, ethics: -0.3 }, analysisInsight: 'Profesyonel Sınır İhlali.' },
        { label: 'Sosyal Beceri: Sarılma ihtiyacını nazikçe "Çak bir beşlik" veya "Tokalaşma" gibi sosyal olarak daha uygun bir selamlaşmaya dönüştürürüm.', weights: { clinical: 1.0, socialSkills: 1.0 }, analysisInsight: 'Sosyal Beceri Öğretimi.' },
        { label: 'Red: İterim, bana dokunma derim.', weights: { clinical: -1.0, empathy: -1.0 }, analysisInsight: 'Reddedilme Travması.' }
      ]
    },
    {
      id: 'clin_new_17', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuğun dikkati 10 saniye sürüyor. 40 dakikalık dersi nasıl işlersiniz?',
      weightedOptions: [
        { label: 'Zorlama: 40 dakika boyunca oturması için zorlarım.', weights: { pedagogicalAnalysis: -0.8 }, analysisInsight: 'İşkence.' },
        { label: 'Mikro-Dersler: Dersi "Mikro-Derslere" bölerim. 2 dakika ders, 1 dakika hareket molası şeklinde yoğunlaştırılmış kısa intervaller uygularım.', weights: { pedagogicalAnalysis: 1.0, clinical: 0.9 }, analysisInsight: 'Interval Eğitim ve Dikkat Yönetimi.' },
        { label: 'Serbest: Sadece oyun oynarım.', weights: { pedagogicalAnalysis: -0.4 }, analysisInsight: 'Hedefsizlik.' }
      ]
    },
    {
      id: 'clin_new_18', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk her soruya "Evet" diyor (Uyumlu görünme stratejisi). Gerçekten anlayıp anlamadığını nasıl test edersiniz?',
      weightedOptions: [
        { label: 'Sözel Teyit: "Emin misin?" diye sorarım.', weights: { clinical: 0.2 }, analysisInsight: 'Yetersiz Kontrol.' },
        { label: 'Çeldirici Soru: Cevabı "Hayır" olan absürt sorular (Örn: "İnekler uçar mı?") sorarak otomatikleştirdiği "Evet" cevabını kırmasını sağlarım.', weights: { clinical: 1.0, pedagogicalAnalysis: 0.8 }, analysisInsight: 'Çeldirici Soru Tekniği.' },
        { label: 'Kızma: Kızarım.', weights: { clinical: -0.5 }, analysisInsight: 'Gereksiz.' }
      ]
    },
    {
      id: 'clin_new_19', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Materyal kullanırken çocuk materyali amacından saptırıyor (Örn: Legoları üst üste takmak yerine fırlatıyor).',
      weightedOptions: [
        { label: 'Kaldırma: Materyali kaldırırım.', weights: { pedagogicalAnalysis: -0.5 }, analysisInsight: 'Fırsatı Kaçırma.' },
        { label: 'Hata Düzeltme: Elini tutup (Fiziksel İpucu) doğru yapmasını sağlar, yapar yapmaz ödüllendiririm.', weights: { pedagogicalAnalysis: 1.0 }, analysisInsight: 'Hata Düzeltme (Correction) ve İpucu.' },
        { label: 'Sözel Uyarı: Sözlü olarak uyarırım.', weights: { pedagogicalAnalysis: 0.0 }, analysisInsight: 'Etkisiz Uyaran.' }
      ]
    },
    {
      id: 'clin_new_20', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk "Alıcı Dil"de (Komut alma) iyi ama "İfade Edici Dil"de (Konuşma) yok. Veli "Konuşsun" diye baskı yapıyor. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Yalan: "Konuşur merak etmeyin" derim.', weights: { clinical: -0.5, ethics: -0.5 }, analysisInsight: 'Yalan.' },
        { label: 'Süreç Bilgilendirmesi: Alıcı dil deposu dolmadan ifade edici dilin başlamayacağını, şu an "Sözcük dağarcığını" doldurduğumuzu, konuşmanın bunun doğal sonucu olacağını anlatırım.', weights: { clinical: 1.0, parentStudentRelations: 1.0 }, analysisInsight: 'Gelişimsel Süreç Bilgilendirmesi.' },
        { label: 'Baskı: Çocuğu konuşmaya zorlarım.', weights: { clinical: -0.8 }, analysisInsight: 'Travma Riski.' }
      ]
    }
  ],

  // ============================================================
  // KATMAN 2: ETİK SINIRLAR & VELİ DİPLOMASİSİ (SHADOW PLAY)
  // Kapsam: İş Etiği + Sınır Yönetimi
  // ============================================================
  ethics_parent: [
    {
      id: 'eth_shadow_1', category: 'workEthics', type: 'radio',
      text: 'Kurumun "Veliyle Şahsi Telefonlaşma Yasak" kuralı var. Ancak bir veli, çocuğunun gece geçirdiği nöbetin videosunu atmak için, panik halinde şahsi numaranızı istiyor. Tavrınız?',
      weightedOptions: [
        { label: 'İnsani İhlal: Veririm, sağlık söz konusu, o an kural düşünülmez.', weights: { workEthics: -0.5, empathy: 0.8, institutionalLoyalty: -0.6 }, analysisInsight: 'Sınır İhlali (Boundary Violation): İyi niyetli ama yönetilemez bir iletişim kapısı açma ve kurumsal protokolü delme riski.' },
        { label: 'Profesyonel Sınır: Numaramı vermem, kurumsal hattan atmasını isterim. O an atamıyorsa "Sakin olun, sabah ilk iş izleyeceğim" derim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0, empathy: 0.3 }, analysisInsight: 'Profesyonel Sınır: Kriz anında bile kurumsal kanalı koruma ve veliyi regüle etme.' },
        { label: 'Gizli Anlaşma: Numaramı veririm ama "Sakın beni aramayın, sadece videoyu atın ve sonra silin" derim.', weights: { workEthics: -0.3, sustainability: -0.5 }, analysisInsight: 'Naiflik: Sınırın delineceğini öngörememe ve gizli anlaşma yapma.' }
      ]
    },
    {
      id: 'eth_shadow_2', category: 'parentStudentRelations', type: 'radio',
      text: 'Çocuğun 6 aydır yerinde saydığını (Plato) görüyorsunuz ama Koordinatör veliye "Her şey harika gidiyor" diyor. Veli size dönüp "Hocam sizce de öyle mi, ben ilerleme göremiyorum?" diye sordu. Cevabınız?',
      weightedOptions: [
        { label: 'Bürokratik Sığınma: "Müdürüm ne diyorsa doğrudur, ben yorum yapamam." derim.', weights: { workEthics: -0.6, institutionalLoyalty: 0.4, personality: -0.4 }, analysisInsight: 'Bürokratik Sığınma: Pasif suç ortaklığı ve mesleki kimliksizlik.' },
        { label: 'Yıkıcı Dürüstlük: "Hayır, çocuğunuz hiç ilerlemiyor, sizi oyalıyorlar." derim.', weights: { institutionalLoyalty: -1.0, workEthics: 0.3, personality: -0.6 }, analysisInsight: 'Kurumsal Sabotaj: Doğruyu söylerken kurumu yıkma (Yıkıcı Dürüstlük) ve ekip içi güveni bitirme.' },
        { label: 'Diplomatik Dürüstlük: "Bazı alanlarda güzel çabaları var ancak X ve Y konularında (yerinde saydığı alanlar) daha yoğun çalışmamız ve strateji değiştirmemiz gerekiyor." diyerek gerçeği yumuşatmadan ama profesyonelce sunarım.', weights: { workEthics: 1.0, parentStudentRelations: 1.0, institutionalLoyalty: 0.6 }, analysisInsight: 'Diplomatik Dürüstlük: Kurumu korurken gerçeği manipüle etmeme, veliyi bilgilendirme ve çözüm odaklılık.' }
      ]
    },
    {
      id: 'eth_shadow_3', category: 'workEthics', type: 'radio',
      text: 'Seans sırasında çocuğun vücudunda bir morluk gördünüz. Veliye sordunuz, "Düştü" dedi ama çocuk tedirgin. (İstismar şüphesi). Ne yaparsınız?',
      weightedOptions: [
        { label: 'İhmal: Veliye inandığımı söylerim, aile işine karışmak haddim değil.', weights: { workEthics: -1.0, clinical: -0.8 }, analysisInsight: 'İhmal: Çocuğun güvenliğini riske atma ve yasal sorumluluğu yok sayma.' },
        { label: 'Dürtüsel Eylem: Hemen polisi veya sosyal hizmetleri ararım.', weights: { workEthics: 0.6, institutionalLoyalty: -0.4, sustainability: -0.3 }, analysisInsight: 'Dürtüsel Eylem: Kurumsal protokolü ve silsileyi atlayarak kriz yaratma riski.' },
        { label: 'Prosedürel Yetkinlik: Vücut haritasına (Body Chart) morluğu işler, tutanak tutar ve derhal Kurum Müdürü/Psikoloğu ile "Kritik Vaka Toplantısı" talep ederim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0, clinical: 0.9 }, analysisInsight: 'Prosedürel Yetkinlik: Yasal ve kurumsal silsileyi doğru işletme, veriyi kaydetme.' }
      ]
    },
    {
      id: 'eth_shadow_4', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli size çok umutsuz bir tonda "Hocam dürüst olun, bizim çocuktan adam olur mu, boşuna mı uğraşıyoruz?" diye sordu. Yanıtınız?',
      weightedOptions: [
        { label: 'Pembe Tablo: "Tabii ki olur, o çok zeki bir çocuk, merak etmeyin, zamanla hepsi düzelecek." (Yalan bile olsa).', weights: { workEthics: -0.5, parentStudentRelations: 0.4 }, analysisInsight: 'Pembe Tablo: Etik olmayan sahte umut satışı ve profesyonel olmayan güvence.' },
        { label: 'Soğuk Mesafe: "Geleceği bilemeyiz, biz işimizi yapıyoruz." (Kaçamak).', weights: { parentStudentRelations: -0.3, personality: -0.2 }, analysisInsight: 'Soğukluk: Veliyi duygusal boşlukta bırakma ve empatik bağ kuramama.' },
        { label: 'Profesyonel Umut: "Potansiyeli var ancak bu bir maraton. Biz şu anki hedefimiz olan X becerisine odaklanalım, orayı aştıkça önümüzü daha net göreceğiz." (Realist & Yönlendirici).', weights: { parentStudentRelations: 1.0, workEthics: 1.0, clinical: 0.6 }, analysisInsight: 'Profesyonel Umut: Gerçekçi, sürece odaklayan, ne aşırı vaat veren ne de umut kıran dengeli liderlik.' }
      ]
    },
    // YENİ EKLENEN: İŞ ETİĞİ & SINIR (10 SORU)
    {
      id: 'eth_new_1', category: 'workEthics', type: 'radio',
      text: 'Veli size zarf içinde "Hocam bu ekstradan sizin emeğiniz için" diyerek para uzattı. Odada kamera yok.',
      weightedOptions: [
        { label: 'Kabul: Alırım, sonuçta çok emek veriyorum ve maaşım düşük.', weights: { workEthics: -1.0, integrity: -1.0 }, analysisInsight: 'Rüşvet/Etik İhlal.' },
        { label: 'Etik Red: Nazikçe reddederim, "Benim ödülüm çocuğun başarısıdır, kurum prensipleri gereği alamam" derim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Etik Duruş.' },
        { label: 'Gizli İttifak: Alırım ama "Aramızda kalsın" derim.', weights: { workEthics: -1.0 }, analysisInsight: 'Gizli İttifak.' }
      ]
    },
    {
      id: 'eth_new_2', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli sizi Instagram\'dan ekledi ve DM\'den çocuğun evdeki videosunu attı. Cevabınız?',
      weightedOptions: [
        { label: 'Sosyal Sınır İhlali: İsteği kabul ederim, DM\'den cevap yazarım.', weights: { workEthics: -0.5, boundary: -0.5 }, analysisInsight: 'Sosyal Sınır İhlali.' },
        { label: 'İletişim Kopukluğu: İsteği reddederim, videoyu görmezden gelirim.', weights: { parentStudentRelations: -0.3 }, analysisInsight: 'İletişim Kopukluğu.' },
        { label: 'Profesyonel Kanal: Sosyal medyadan eklemem (mesafeyi korurum) ama DM\'e resmi bir dille "Videoyu kurumsal hattımızdan atarsanız dosrasına ekleyip inceleyebilirim" yazarım.', weights: { workEthics: 1.0, boundary: 1.0 }, analysisInsight: 'Profesyonel Kanal Yönetimi.' }
      ]
    },
    {
      id: 'eth_new_3', category: 'workEthics', type: 'radio',
      text: 'Veli, boşanma aşamasında olduğunu ve eşinin çocukla ilgili bilgi almasını istemediğini söyledi (Velayet ortak). Ne yaparsınız?',
      weightedOptions: [
        { label: 'Yasal Risk: "Tamam, babaya bilgi vermem" derim.', weights: { workEthics: -0.5, legal: -0.8 }, analysisInsight: 'Yasal Risk: Ortak velayette iki tarafın da bilgi alma hakkı vardır.' },
        { label: 'Yasal Prosedür: Kurum müdürüne ve avukatına danışmadan karar vermem, mahkeme kararını (velayet belgesini) isterim. Resmi belge gelene kadar standart prosedürü uygularım.', weights: { workEthics: 1.0, legal: 1.0 }, analysisInsight: 'Yasal Prosedüre Uygunluk.' },
        { label: 'Duygusal Tarafgirlik: Anneyi desteklerim, üzgün görünüyor.', weights: { workEthics: -0.2, empathy: 0.5 }, analysisInsight: 'Duygusal Tarafgirlik.' }
      ]
    },
    {
      id: 'eth_new_4', category: 'parentStudentRelations', type: 'radio',
      text: 'Çok sevdiğiniz bir öğrencinizin velisi sizi düğününe davet etti. Gider misiniz?',
      weightedOptions: [
        { label: 'Çoklu İlişki: Giderim, aile gibi olduk.', weights: { workEthics: -0.4, boundary: -0.6 }, analysisInsight: 'Çoklu İlişki Riski (Dual Relationship).' },
        { label: 'Sosyal Nezaket: Gitmem ama çiçek veya tebrik kartı göndererek nazikçe mesafemi korurum.', weights: { workEthics: 1.0, socialSkills: 0.8 }, analysisInsight: 'Sosyal Nezaket ve Sınır.' },
        { label: 'Kabalık: Gitmem, işim olmaz.', weights: { parentStudentRelations: -0.5 }, analysisInsight: 'Kabalık.' }
      ]
    },
    {
      id: 'eth_new_5', category: 'workEthics', type: 'radio',
      text: 'Veli, "Hocam hafta sonu evde 2 saat özel ders verir misiniz? Kurumun haberi olmasın." teklifinde bulundu.',
      weightedOptions: [
        { label: 'Etik Dışı: Kabul ederim, ek gelir olur.', weights: { workEthics: -1.0, institutionalLoyalty: -1.0 }, analysisInsight: 'Etik Dışı / Sadakatsizlik.' },
        { label: 'Yetersiz Red: "Kurumda çalışmam daha verimli oluyor" diyerek geçiştiririm.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Yetersiz Red.' },
        { label: 'Tam Sadakat: Kurum sözleşmem gereği dışarıda ders veremeyeceğimi net bir dille belirtir ve durumu yönetime raporlarım.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Tam Etik Sadakat.' }
      ]
    },
    {
      id: 'eth_new_6', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli, başka bir öğretmenin yetersiz olduğunu söyleyip dedikodu yapmaya başladı. Tavrınız?',
      weightedOptions: [
        { label: 'Dedikoduya İştirak: "Evet, maalesef biraz tecrübesiz" diyerek onaylarım.', weights: { workEthics: -0.8, team: -1.0 }, analysisInsight: 'Meslektaşı Satış / Dedikoduya İştirak.' },
        { label: 'Pasif Onay: Sessiz kalırım.', weights: { workEthics: 0.0 }, analysisInsight: 'Pasif Onay.' },
        { label: 'Mesleki Sınır: "Meslektaşım hakkında konuşmam etik değil, dilerseniz endişelerinizi idare ile görüşebilirsiniz" diyerek konuyu kapatırım.', weights: { workEthics: 1.0, team: 1.0 }, analysisInsight: 'Mesleki Dayanışma ve Sınır.' }
      ]
    },
    {
      id: 'eth_new_7', category: 'workEthics', type: 'radio',
      text: 'Çocuğa yanlışlıkla yasaklı bir yiyecek (alerjen) verdiniz ama çocukta reaksiyon olmadı. Veliye söyler misiniz?',
      weightedOptions: [
        { label: 'Güven İhlali: Söylemem, boşuna panik yapmasınlar.', weights: { workEthics: -1.0, trust: -1.0 }, analysisInsight: 'Güven İhlali ve Risk Gizleme.' },
        { label: 'Yarım Sorumluluk: Sadece müdüre söylerim.', weights: { workEthics: 0.5 }, analysisInsight: 'Yarım Sorumluluk.' },
        { label: 'Radikal Dürüstlük: Dürüstçe veliyi arar, hatamı kabul eder ve çocuğu gözlemlemesi için uyarırım. Güven, dürüstlükle inşa edilir.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Radikal Dürüstlük ve Sorumluluk.' }
      ]
    },
    {
      id: 'eth_new_8', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli seanstan 15 dakika geç geldi. "Trafik vardı, lütfen süreyi tamamlayalım, paramız boşa gitmesin" dedi. Bir sonraki öğrenci kapıda.',
      weightedOptions: [
        { label: 'Hak Gaspı: Tamamlarım, dışarıdaki beklesin.', weights: { workEthics: -0.5, justice: -1.0 }, analysisInsight: 'Diğer Öğrencinin Hakkını Gasp.' },
        { label: 'Empatisiz Red: "Maalesef süreniz doldu" der kestirip atarım.', weights: { parentStudentRelations: -0.5 }, analysisInsight: 'Empatisiz Red.' },
        { label: 'Adaletli Sınır: Kalan süreyi en verimli şekilde kullanırım ama seansı vaktinde bitiririm. "Diğer öğrencinin hakkına giremem, telafi için başka bir boşluk bakalım" derim.', weights: { workEthics: 1.0, justice: 1.0 }, analysisInsight: 'Adaletli Sınır Yönetimi.' }
      ]
    },
    {
      id: 'eth_new_9', category: 'workEthics', type: 'radio',
      text: 'Kurumun belirlediği bir materyalin (örn: tablet) çocuk için zararlı olduğuna inanıyorsunuz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Gizli İsyankar: Gizlice kullanmam.', weights: { institutionalLoyalty: -0.2, transparency: -0.5 }, analysisInsight: 'Gizli İsyankar.' },
        { label: 'Sorgusuz İtaat: Kullanırım, emir demiri keser.', weights: { clinical: -0.5 }, analysisInsight: 'Sorgusuz İtaat.' },
        { label: 'Yapıcı Eleştiri: Bilimsel dayanaklarıyla (makale vs.) yönetime sunum yapar ve bu materyalin neden değiştirilmesi gerektiğini savunurum.', weights: { workEthics: 1.0, initiative: 1.0 }, analysisInsight: 'Yapıcı Eleştiri ve Gelişim.' }
      ]
    },
    {
      id: 'eth_new_10', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli "Hocam sizce çocuğum normal okula gidebilecek mi?" diye sordu. Çocuk ağır otizmli.',
      weightedOptions: [
        { label: 'Umut Tacirliği: "Tabii ki, çok akıllı çocuk" derim.', weights: { ethics: -0.8 }, analysisInsight: 'Umut Tacirliği.' },
        { label: 'Yıkıcı Gerçekçilik: "Zor, bence gidemez" derim.', weights: { empathy: -0.8 }, analysisInsight: 'Yıkıcı Gerçekçilik.' },
        { label: 'Süreç Odaklılık: "Şu anki hedefimiz bağımsız yaşam becerileri. Geleceği bugünkü çalışmalarımız şekillendirecek, adım adım gidelim" diyerek odağı bugüne çekerim.', weights: { ethics: 1.0, communication: 1.0 }, analysisInsight: 'Profesyonel Gerçekçilik ve Süreç Odaklılık.' }
      ]
    }
  ],

  // ============================================================
  // KATMAN 3: PSİKOLOJİK DAYANIKLILIK & TAKIM (SHADOW PLAY)
  // Kapsam: Resilians (Direnç)
  // ============================================================
  resilience_team: [
    {
      id: 'res_shadow_1', category: 'sustainability', type: 'radio',
      text: 'Partner öğretmeniniz (eküri) derse sürekli geç geliyor ve bu yüzden sizin seanslarınız sarkıyor. Yönetim bunu fark etmiyor. Ne yaparsınız?',
      weightedOptions: [
        { label: 'İspiyon: Onu hemen müdüre şikayet ederim, işini düzgün yapsın.', weights: { sustainability: 0.3, fit: -0.6 }, analysisInsight: 'İspiyonculuk/Çatışma: Takım içi güveni zedeleme ve sorunu birebir çözme yetisinden yoksunluk.' },
        { label: 'Pasif Agresyon: Küserek konuşmam, trip atarım, anlasın.', weights: { sustainability: -0.6, personality: -0.7 }, analysisInsight: 'Pasif Agresyon: Profesyonellik dışı çocuksu tepki.' },
        { label: 'Olgun İletişim: Onu kenara çeker, "Geç kalman benim planımı bozuyor ve beni zor durumda bırakıyor, buna bir çözüm bulalım" diyerek "Ben Dili" ile konuşurum.', weights: { sustainability: 1.0, fit: 1.0, personality: 0.9 }, analysisInsight: 'Olgun İletişim (Assertiveness): Sorunu kaynağında, çatışma yaratmadan ve yönetimi meşgul etmeden çözme.' }
      ]
    },
    {
      id: 'res_shadow_2', category: 'sustainability', type: 'radio',
      text: 'Çok emek verdiğiniz bir öğrenci, 3 ayın sonunda size vurdu ve yüzünüze tükürdü. O an hissettiğiniz duygu ve eyleminiz?',
      weightedOptions: [
        { label: 'Duygusal Çöküş: Öfkelenirim ve "Terbiyesiz, bir daha yapma!" diye bağırırım.', weights: { sustainability: -1.0, clinical: -1.0 }, analysisInsight: 'Duygusal Çöküş: Davranışı kişiselleştirme ve profesyonel maskeyi düşürme.' },
        { label: 'Kırılganlık: Çok üzülürüm, demek ki ben başarısızım, bana saygısı yok diye düşünürüm.', weights: { sustainability: -0.6, personality: -0.4 }, analysisInsight: 'Kırılganlık: Özgüven kaybı ve tükenmişlik sinyali.' },
        { label: 'Profesyonel Zırh: Duygusal olarak etkilenmemeye çalışırım. "Bu bir davranış, şahsıma değil" derim ve ABC kaydına "Saldırganlık" olarak nötr şekilde işlerim.', weights: { sustainability: 1.0, clinical: 1.0, workEthics: 0.8 }, analysisInsight: 'Profesyonel Zırh (Depersonalization): Davranışı klinik bir veri olarak görme ve soğukkanlılık.' }
      ]
    },
    {
      id: 'res_shadow_3', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumda o gün herkesin katıldığı bir doğum günü kutlaması var ama sizin yetiştirmeniz gereken çok acil raporlar var. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Sosyal İzolasyon: Gitmem, işim daha önemli, sosyalleşmek zorunda değilim.', weights: { institutionalLoyalty: 0.3, fit: -0.5 }, analysisInsight: 'Sosyal İzolasyon: Takım ruhunu önemsememe ve yabancılaşma.' },
        { label: 'İş Disiplini Zafiyeti: İşleri bırakır tüm gün kutlamada otururum, ayıp olmasın.', weights: { workEthics: -0.4, fit: 0.3 }, analysisInsight: 'İş Disiplini Zafiyeti: Sosyal onayı işin önüne koyma.' },
        { label: 'Sosyal Zeka: 5-10 dakika uğrar, görünür, tebrik eder ve "Yetiştirmem gereken raporlar var, size iyi eğlenceler" diyerek nazikçe ayrılırım.', weights: { institutionalLoyalty: 1.0, fit: 1.0, sustainability: 0.7 }, analysisInsight: 'Sosyal Zeka ve Denge: Hem takıma aidiyet gösterme hem de sorumluluğu yerine getirme.' }
      ]
    },
    // YENİ EKLENEN: RESİLİANS (DİRENÇ) (10 SORU)
    {
      id: 'res_new_1', category: 'sustainability', type: 'radio',
      text: 'Gün sonunda çok yorgunsunuz, son seansın öğrencisi ise çok hiperaktif. İçinizden "Keşke gelmese" diye geçirdiniz ve öğrenci geldi. Tavrınız?',
      weightedOptions: [
        { label: 'Yansıtma: Çocuğa "Bugün uslu dur, başım ağrıyor" derim.', weights: { sustainability: -0.5 }, analysisInsight: 'Profesyonellik Dışı: Kendi sorununu çocuğa yükleme.' },
        { label: 'Profesyonel Dayanıklılık: Enerjimi toplamak için bir kahve içer, "Sahneye Çıkış" moduna geçerim. Benim yorgunluğum çocuğun eğitim hakkını etkilememeli.', weights: { sustainability: 1.0, workEthics: 1.0 }, analysisInsight: 'Profesyonel Dayanıklılık (Professional Stamina).' },
        { label: 'Mesleki Tükenmişlik: Çocuğu serbest bırakır, dinlenirim.', weights: { sustainability: -1.0, workEthics: -1.0 }, analysisInsight: 'Mesleki Tükenmişlik.' }
      ]
    },
    {
      id: 'res_new_2', category: 'sustainability', type: 'radio',
      text: 'Koordinatörünüz hazırladığınız BEP planını beğenmedi ve sert bir dille eleştirdi ("Bu olmamış, baştan yaz"). Tepkiniz?',
      weightedOptions: [
        { label: 'Duygusal Kırılganlık: Moralim bozulur, ağlarım veya küserim.', weights: { sustainability: -0.5, personality: -0.5 }, analysisInsight: 'Duygusal Kırılganlık.' },
        { label: 'Savunma: Sinirlenirim, "Siz daha iyisini yapın o zaman" derim.', weights: { sustainability: -0.5, fit: -0.8 }, analysisInsight: 'Eleştiriye Kapalılık.' },
        { label: 'Gelişim Odaklılık: Eleştiriyi şahsıma değil işime yapılmış sayarım. "Neleri düzeltmemi önerirsiniz?" diye sorarak geri bildirimi gelişim fırsatına çeviririm.', weights: { sustainability: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Gelişim Odaklılık (Growth Mindset).' }
      ]
    },
    {
      id: 'res_new_3', category: 'sustainability', type: 'radio',
      text: 'Bir öğrencide 6 aydır yoğun çalışmanıza rağmen "sıfır ilerleme" var. Kendinizi nasıl hissedersiniz?',
      weightedOptions: [
        { label: 'Yetersizlik: "Ben yetersizim" diye düşünür, mesleği sorgularım.', weights: { sustainability: -0.5 }, analysisInsight: 'Yetersizlik Hissi.' },
        { label: 'Dışsallaştırma: "Çocukta iş yok" derim.', weights: { sustainability: -0.2, empathy: -0.5 }, analysisInsight: 'Suçu Dışsallaştırma.' },
        { label: 'Çözüm Odaklılık: Yöntemimi sorgularım. "Demek ki bu yol çalışmıyor, başka ne deneyebilirim?" diyerek süpervizörden destek isterim.', weights: { sustainability: 1.0, problemSolving: 1.0 }, analysisInsight: 'Çözüm Odaklı Direnç.' }
      ]
    },
    {
      id: 'res_new_4', category: 'institutionalLoyalty', type: 'radio',
      text: 'Ekip arkadaşınızın özel hayatındaki bir sorun işine yansıyor ve sürekli hata yapıyor. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Kurtarıcı Rolü: Onun açıklarını ben kapatırım, idare ederim.', weights: { sustainability: 0.5, boundary: -0.5 }, analysisInsight: 'Kurtarıcı Rolü (Sürdürülemez).' },
        { label: 'Şikayet: Yönetime şikayet ederim.', weights: { fit: -0.5 }, analysisInsight: 'Destek Eksikliği.' },
        { label: 'Dengeli Destek: Onunla konuşur, destek olabileceğimi ama işlerin aksadığını, gerekirse izin alması gerektiğini dostça belirtirim.', weights: { fit: 1.0, sustainability: 1.0 }, analysisInsight: 'Dengeli Takım Arkadaşlığı.' }
      ]
    },
    {
      id: 'res_new_5', category: 'sustainability', type: 'radio',
      text: 'Üst üste 3 seans boyunca çocuklardan fiziksel şiddet (ısırma, vurma) gördünüz. Akşam eve gidince ne düşünürsünüz?',
      weightedOptions: [
        { label: 'Tükenmişlik: "Bu iş yapılmaz, delireceğim."', weights: { sustainability: -1.0 }, analysisInsight: 'Tükenmişlik Sinyali.' },
        { label: 'Kurban Psikolojisi: "Neden ben? Hep bana zor çocuklar veriyorlar."', weights: { sustainability: -0.5 }, analysisInsight: 'Kurban Psikolojisi.' },
        { label: 'Sağlamlık: "Bugün zordu. Yarın güvenlik önlemlerimi artırmalı ve davranış planını gözden geçirmeliyim." der, işi kapıda bırakır dinlenirim.', weights: { sustainability: 1.0, selfRegulation: 1.0 }, analysisInsight: 'Psikolojik Sağlamlık.' }
      ]
    },
    {
      id: 'res_new_6', category: 'sustainability', type: 'radio',
      text: 'Kurumda maaşlar 2 gün gecikti. Tepkiniz?',
      weightedOptions: [
        { label: 'Kaos Yaratma: Hemen dedikoduya başlar, "Batıyoruz galiba" derim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Kaos Yaratma.' },
        { label: 'Motivasyon Kaybı: Motivasyonum düşer, derslere isteksiz girerim.', weights: { workEthics: -0.5 }, analysisInsight: 'Profesyonellik Kaybı.' },
        { label: 'Olgunluk: Sakin kalırım, yönetime durumu sorarım ama işime yansıtmam. Profesyonellik bunu gerektirir.', weights: { sustainability: 1.0, institutionalLoyalty: 0.8 }, analysisInsight: 'Olgunluk.' }
      ]
    },
    {
      id: 'res_new_7', category: 'institutionalLoyalty', type: 'radio',
      text: 'Çok başarılı bir projeniz var ama yönetici "Şu an bütçemiz yok" diyerek reddetti. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Pasif Agresyon: Küserim, bir daha fikir sunmam.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'Pasif Agresyon.' },
        { label: 'Azim: Projeyi daha düşük maliyetle nasıl yapabileceğimi araştırır, tekrar sunarım.', weights: { sustainability: 1.0, creativity: 1.0 }, analysisInsight: 'Azim ve Yaratıcılık.' },
        { label: 'Sadakatsizlik: Başka kurumlara fikrimi satmaya çalışırım.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Sadakatsizlik.' }
      ]
    },
    {
      id: 'res_new_8', category: 'sustainability', type: 'radio',
      text: 'Veli size haksız yere bağırdı ve hakaret etti. O an ne yaparsınız?',
      weightedOptions: [
        { label: 'Öfke Kontrolsüzlüğü: Ben de ona bağırırım, kendimi ezdirmem.', weights: { sustainability: -1.0, professionalDistance: -1.0 }, analysisInsight: 'Öfke Kontrolsüzlüğü.' },
        { label: 'Çöküş: Ağlayarak odayı terk ederim.', weights: { sustainability: -0.5 }, analysisInsight: 'Yetersiz Kriz Yönetimi.' },
        { label: 'Soğukkanlılık: Sakinliğimi korur, "Şu an gerginsiniz, sakinleşince konuşalım" diyerek sınırı çizer ve tartışmaya girmem.', weights: { sustainability: 1.0, professionalDistance: 1.0 }, analysisInsight: 'Profesyonel Soğukkanlılık.' }
      ]
    },
    {
      id: 'res_new_9', category: 'sustainability', type: 'radio',
      text: 'Yıllık izniniz iptal edildi çünkü kurumun size ihtiyacı var. Tepkiniz?',
      weightedOptions: [
        { label: 'İş Ahlakı Sorunu: Rapor alır gelmem.', weights: { workEthics: -1.0 }, analysisInsight: 'İş Ahlakı Sorunu.' },
        { label: 'Dürtüsellik: İstifa tehdidi savururum.', weights: { sustainability: -0.5 }, analysisInsight: 'Dürtüsellik.' },
        { label: 'Sorumluluk Bilinci: Durumu anlarım ama telafisinin ne zaman olacağını netleştiririm. Kurumu yarı yolda bırakmam.', weights: { sustainability: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Sorumluluk Bilinci.' }
      ]
    },
    {
      id: 'res_new_10', category: 'institutionalLoyalty', type: 'radio',
      text: 'Ekipte herkesin "Bu çocuktan bir şey olmaz" dediği bir öğrenci size verildi. Yaklaşımınız?',
      weightedOptions: [
        { label: 'Negatif Bakış: "Bana ceza verdiler" diye düşünürüm.', weights: { sustainability: -0.5 }, analysisInsight: 'Negatif Bakış.' },
        { label: 'Meydan Okuma: "Herkesin yanıldığını kanıtlayacağım" diyerek hırslanırım.', weights: { sustainability: 0.8, motivation: 1.0 }, analysisInsight: 'Meydan Okuma (Challenge) Motivasyonu.' },
        { label: 'İhanet: Ben de uğraşmam, vakit doldururum.', weights: { workEthics: -1.0 }, analysisInsight: 'Mesleki İhanet.' }
      ]
    }
  ],

  // ============================================================
  // KATMAN 4: VİZYON & KURUMSAL AİDİYET (SHADOW PLAY)
  // Kapsam: Kurumsal Sadakat + Gelişime Açıklık
  // ============================================================
  vision_loyalty: [
    {
      id: 'vis_shadow_1', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurum size pahalı bir eğitim olan "X Yöntemi"ni finanse edecek ama karşılığında 2 yıl kurumdan ayrılmama taahhüdü (sözleşme) istiyor. İmzalar mısınız?',
      weightedOptions: [
        { label: 'Bağlılık Sorunu: Asla imzalamam, özgürlüğüm kısıtlanamaz, ben eğitimi kendim alırım.', weights: { institutionalLoyalty: -0.6, developmentOpenness: 0.2 }, analysisInsight: 'Bağlılık Sorunu: Yatırıma ve uzun vadeli işbirliğine kapalı profil.' },
        { label: 'Etik Risk: İmzalarım ama daha iyi teklif gelirse tazminatı öder kaçarım.', weights: { institutionalLoyalty: -0.8, workEthics: -0.6 }, analysisInsight: 'Etik Risk: Güvenilmez ve fırsatçı profil.' },
        { label: 'Kariyer Ortaklığı: Memnuniyetle imzalarım. Kurumun bana yatırım yapması, bana değer verdiğini gösterir ve kariyerim için bir fırsattır.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Kariyer Ortaklığı: Kurumla büyüme vizyonu ve karşılıklı güven.' }
      ]
    },
    {
      id: 'vis_shadow_2', category: 'developmentOpenness', type: 'radio',
      text: 'Yönetim, Yapay Zeka (AI) destekli, çok detaylı ama öğrenmesi zor yeni bir raporlama sistemine geçiyor. İlk tepkiniz?',
      weightedOptions: [
        { label: 'Değişim Direnci: "Eski usül kağıt kalem daha iyiydi, ne gerek var bu kadar teknolojiye?" diye direnç gösteririm.', weights: { developmentOpenness: -0.7, institutionalLoyalty: -0.3 }, analysisInsight: 'Değişim Direnci (Resistance to Change): Statükocu ve yeniliğe kapalı.' },
        { label: 'Pasif Direniş: "Tamam" derim ama kullanmam, başkasına yaptırırım veya eksik yaparım.', weights: { workEthics: -0.6, developmentOpenness: -0.4 }, analysisInsight: 'Pasif Direniş: Sinsi uyumsuzluk.' },
        { label: 'Gelişim Zihniyeti: Zor olsa da öğrenmek için ekstra mesai harcarım. Teknoloji mesleğimizin geleceğidir ve buna adapte olmalıyım.', weights: { developmentOpenness: 1.0, sustainability: 0.6 }, analysisInsight: 'Gelişim Zihniyeti (Growth Mindset): Yeniliğe adaptasyon ve öğrenme hevesi.' }
      ]
    },
    // YENİ EKLENEN: KURUMSAL SADAKAT & GELİŞİME AÇIKLIK (10+10 = 20 SORU)
    {
      id: 'vis_new_1', category: 'institutionalLoyalty', type: 'radio',
      text: 'Rakip bir kurum size mevcut maaşınızın %20 fazlasını teklif etti. Tepkiniz ne olur?',
      weightedOptions: [
        { label: 'Fırsatçı: Hemen kabul eder, istifa ederim. Profesyonellik paradır.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Fırsatçı (Mercenary) Profil.' },
        { label: 'Pazarlıkçı: Teklifi mevcut kurumumla paylaşır, "Bakın bana ne veriyorlar" diye pazarlık yaparım.', weights: { institutionalLoyalty: -0.5, negotiation: 0.5 }, analysisInsight: 'Riskli Pazarlık.' },
        { label: 'Derin Bağlılık: Mevcut kurumumdaki huzurum, ekibim ve manevi tatminim %20 farktan daha değerliyse reddederim. Sadakat sadece para değildir.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Derin Bağlılık.' }
      ]
    },
    {
      id: 'vis_new_2', category: 'developmentOpenness', type: 'radio',
      text: 'Süpervizörünüz seansınızı izledi ve "Bu yöntem artık eskidi, şunu dene" dedi. Ama siz eski yönteme alışkınsınız.',
      weightedOptions: [
        { label: 'Tutuculuk: "Ben böyle alıştım, sonuç da alıyorum" der, değişmem.', weights: { developmentOpenness: -0.8 }, analysisInsight: 'Mesleki Tutuculuk.' },
        { label: 'Gizli Direniş: "Tamam" derim ama o gidince bildiğimi okurum.', weights: { integrity: -0.5, developmentOpenness: -0.5 }, analysisInsight: 'Gizli Direniş.' },
        { label: 'Öğrenme Çevikliği: Konfor alanımdan çıkmak zor olsa da yeni yöntemi denerim. Bilim sürekli güncelleniyor, ben de güncellenmeliyim.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Öğrenme Çevikliği (Learning Agility).' }
      ]
    },
    {
      id: 'vis_new_3', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumun sosyal medya hesabında paylaşılması için sizden bir blog yazısı veya video istendi (Ekstra ücret yok).',
      weightedOptions: [
        { label: 'Görev Odaklı: "Ekstra para almadan yapmam, görev tanımımda yok" derim.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'Sadece Görev Odaklı (Jobsworth).' },
        { label: 'Kazan-Kazan: Yaparım, bu hem kurumun hem de benim kişisel markamın tanınması için bir fırsattır.', weights: { institutionalLoyalty: 1.0, branding: 1.0 }, analysisInsight: 'Kazan-Kazan Vizyonu.' },
        { label: 'Kalitesizlik: Baştan savma bir şey yaparım.', weights: { workEthics: -0.5 }, analysisInsight: 'Kalitesizlik.' }
      ]
    },
    {
      id: 'vis_new_4', category: 'developmentOpenness', type: 'radio',
      text: 'Hafta sonu kendi alanınızla ilgili çok önemli bir seminer var ama katılım ücretli ve hafta sonunuz gidecek. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Düşük Hırs: Gitmem, hafta sonu benim dinlenme zamanım.', weights: { developmentOpenness: -0.2 }, analysisInsight: 'Düşük Kariyer Hırsı.' },
        { label: 'Dışsal Motivasyon: Kurum öderse giderim, yoksa gitmem.', weights: { developmentOpenness: 0.2, passive: 0.5 }, analysisInsight: 'Dışsal Motivasyonlu.' },
        { label: 'Kariyer Yatırımı: Kendi cebimden öder giderim. Bilgiye yapılan yatırım en büyük yatırımdır.', weights: { developmentOpenness: 1.0, ambition: 1.0 }, analysisInsight: 'İçsel Motivasyon ve Kariyer Yatırımı.' }
      ]
    },
    {
      id: 'vis_new_5', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumda işlerin kötü gittiğine dair dedikodular dönüyor. Tavrınız?',
      weightedOptions: [
        { label: 'Toksik Etki: Ben de dedikoduya katılır, "Burası batıyor" derim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Toksik Etki.' },
        { label: 'Sessiz Terk: Sessizce CV\'mi güncellerim.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Sessiz Terk (Quiet Quitting).' },
        { label: 'Krizde Sadakat: Dedikodulara kulak tıkar, işime odaklanırım. Kurumun bana ihtiyacı varken gemiyi terk etmem.', weights: { institutionalLoyalty: 1.0, resilience: 0.8 }, analysisInsight: 'Krizde Sadakat.' }
      ]
    },
    {
      id: 'vis_new_6', category: 'developmentOpenness', type: 'radio',
      text: 'İngilizce makale okuma konusunda seviyeniz nedir? Bir literatür taraması yapmanız istendi.',
      weightedOptions: [
        { label: 'Öğrenilmiş Çaresizlik: İngilizcem yok, yapamam.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'Öğrenilmiş Çaresizlik.' },
        { label: 'Kaynak Yaratıcılığı: Translate kullanarak da olsa o makaleyi çözerim. Dil bariyeri beni durduramaz.', weights: { developmentOpenness: 1.0, resourcefulness: 1.0 }, analysisInsight: 'Kaynak Yaratıcılığı.' },
        { label: 'Hazırcılık: Başkasına yaptırırım.', weights: { workEthics: -0.2 }, analysisInsight: 'Hazırcılık.' }
      ]
    },
    {
      id: 'vis_new_7', category: 'institutionalLoyalty', type: 'radio',
      text: 'Eski çalıştığınız kurumdan bir veli sizi aradı ve "Sizin olduğunuz yere gelmek istiyoruz" dedi. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Etik Gri Alan: Hemen kabul ederim, öğrenci getirmiş olurum.', weights: { ethics: -0.2 }, analysisInsight: 'Etik Gri Alan (Eski kurumla sözleşmeye bağlı).' },
        { label: 'Marka Değeri: Memnuniyetle yönlendiririm, bu benim değil kurumumun kalitesinin bir sonucudur.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Marka Değeri Transferi.' },
        { label: 'Kötüleme: "Gelmeyin, burası da kötü" derim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Kurumu Kötüleme.' }
      ]
    },
    {
      id: 'vis_new_8', category: 'developmentOpenness', type: 'radio',
      text: 'Kurum içi eğitimde sunum yapmanız istendi ama topluluk önünde konuşmaktan çekiniyorsunuz.',
      weightedOptions: [
        { label: 'Fırsat Tepme: Reddederim, yapamam.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'Fırsat Tepme.' },
        { label: 'Kaçış: Hasta numarası yaparım.', weights: { integrity: -0.8 }, analysisInsight: 'Kaçış.' },
        { label: 'Cesaret: Korksam da kabul ederim. Bu korkuyu yenmek için bir fırsattır.', weights: { developmentOpenness: 1.0, courage: 1.0 }, analysisInsight: 'Cesaret ve Gelişim.' }
      ]
    },
    {
      id: 'vis_new_9', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kuruma ait özel bir materyalin fotoğrafını çekip kendi sosyal medyanızda "Kendi materyalim" gibi paylaşır mısınız?',
      weightedOptions: [
        { label: 'Fikri Mülkiyet İhlali: Evet, reklam olur.', weights: { integrity: -0.8, institutionalLoyalty: -0.5 }, analysisInsight: 'Fikri Mülkiyet İhlali.' },
        { label: 'Etik Sahiplenme: Hayır, bu kurumun malıdır. Paylaşırsam kurumu etiketleyerek paylaşırım.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'Etik Sahiplenme.' },
        { label: 'Karakter Zafiyeti: Kimse anlamazsa paylaşırım.', weights: { integrity: -1.0 }, analysisInsight: 'Karakter Zafiyeti.' }
      ]
    },
    {
      id: 'vis_new_10', category: 'developmentOpenness', type: 'radio',
      text: '5 yıl sonra kendinizi nerede görüyorsunuz?',
      weightedOptions: [
        { label: 'Girişimci: Kendi yerimi açmış olurum.', weights: { institutionalLoyalty: 0.2, ambition: 1.0 }, analysisInsight: 'Girişimci (Kurum için riskli olabilir ama vizyoner).' },
        { label: 'İçeride Büyüme: Bu kurumda yönetici veya koordinatör olarak daha fazla sorumluluk almış halde.', weights: { institutionalLoyalty: 1.0, stability: 1.0 }, analysisInsight: 'İçeride Büyüme (Intrapreneur).' },
        { label: 'Vizyonsuzluk: Bilmiyorum, akışına bıraktım.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'Vizyonsuzluk.' }
      ]
    },
    {
      id: 'vis_new_11', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumun logosunu veya renklerini beğenmiyorsunuz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Marka Zararı: Her yerde kötülerim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Marka Zararı.' },
        { label: 'Nötr: Umursamam, işime bakarım.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Nötr.' },
        { label: 'Sahiplenme: Daha iyi bir öneriyle yönetime giderim, kurumsal kimliğe katkı sağlamaya çalışırım.', weights: { institutionalLoyalty: 1.0, creativity: 0.8 }, analysisInsight: 'Sahiplenme.' }
      ]
    },
    {
      id: 'vis_new_12', category: 'developmentOpenness', type: 'radio',
      text: 'Alanınız dışı bir konuda (Örn: İlk Yardım) eğitim verilecek. Katılır mısınız?',
      weightedOptions: [
        { label: 'Dar Bakış: Hayır, benim alanım değil.', weights: { developmentOpenness: -0.3 }, analysisInsight: 'Dar Bakış Açısı.' },
        { label: 'Çok Yönlülük: Katılırım, bir gün lazım olabilir. Bilgi bilgidir.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Çok Yönlülük.' },
        { label: 'Zaman Kaybı: Zorunluysa gider uyurum.', weights: { workEthics: -0.5 }, analysisInsight: 'Zaman Kaybı.' }
      ]
    },
    {
      id: 'vis_new_13', category: 'institutionalLoyalty', type: 'radio',
      text: 'Mesai saatleri dışında kurumun bir etkinliği (Kermes, Piknik) var. Katılır mısınız?',
      weightedOptions: [
        { label: 'Memur Zihniyeti: Hayır, mesaim bitti.', weights: { institutionalLoyalty: -0.2 }, analysisInsight: 'Memur Zihniyeti.' },
        { label: 'Kurumsal Vatandaşlık: Gönüllü olarak katılır ve destek olurum. Kurum kültürü mesai ile sınırlı değildir.', weights: { institutionalLoyalty: 1.0, team: 1.0 }, analysisInsight: 'Kurumsal Vatandaşlık.' },
        { label: 'Parasal Odak: Ek mesai ücreti verirlerse gelirim.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Parasal Odak.' }
      ]
    },
    {
      id: 'vis_new_14', category: 'developmentOpenness', type: 'radio',
      text: 'Kullandığınız bir materyalin daha iyisini bir stajyer önerdi. Tepkiniz?',
      weightedOptions: [
        { label: 'Egoist Kapalılık: "Sen daha dünküsün" diye bozarım.', weights: { developmentOpenness: -1.0, ego: -1.0 }, analysisInsight: 'Egoist Kapalılık.' },
        { label: 'Alçakgönüllü Öğrenme: Önerisini denerim, iyiyse kullanır ve ona teşekkür ederim. Akıl yaşta değil baştadır.', weights: { developmentOpenness: 1.0, humility: 1.0 }, analysisInsight: 'Alçakgönüllü Öğrenme.' },
        { label: 'İletişimsizlik: Dinlemem.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'İletişimsizlik.' }
      ]
    },
    {
      id: 'vis_new_15', category: 'institutionalLoyalty', type: 'radio',
      text: 'Bir veli kurumdan şikayetçi ve ayrılmak üzere. Onu ikna etmeye çalışır mısınız?',
      weightedOptions: [
        { label: 'İçeriden Yıkım: "Burası böyle maalesef" der yangına körükle giderim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'İçeriden Yıkım.' },
        { label: 'Pasiflik: Beni ilgilendirmez, yönetim halletsin.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Pasiflik.' },
        { label: 'Marka Elçiliği: Sorunu dinler, çözebileceğim bir şeyse çözer, değilse yönetime köprü olurum. Her öğrenci kaybı benim de kaybımdır.', weights: { institutionalLoyalty: 1.0, problemSolving: 1.0 }, analysisInsight: 'Marka Elçiliği.' }
      ]
    },
    {
      id: 'vis_new_16', category: 'developmentOpenness', type: 'radio',
      text: 'Okuduğunuz son mesleki kitap ne zaman?',
      weightedOptions: [
        { label: 'Akademik Paslanma: Üniversitede okumuştum.', weights: { developmentOpenness: -0.8 }, analysisInsight: 'Akademik Paslanma.' },
        { label: 'Aktif Gelişim: Geçen ay. Sürekli okurum.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Aktif Gelişim.' },
        { label: 'Yüzeysel Bilgi: Kitap okumam, internetten bakarım.', weights: { developmentOpenness: 0.2 }, analysisInsight: 'Yüzeysel Bilgi.' }
      ]
    },
    {
      id: 'vis_new_17', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumun temizlik personeli o gün gelmedi ve sınıf çok kirli. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Katılık: Dersi yapmam, temizlenmesini beklerim.', weights: { flexibility: -0.5 }, analysisInsight: 'Katılık.' },
        { label: 'Agresyon: Müdüre bağırırım.', weights: { fit: -0.8 }, analysisInsight: 'Agresyon.' },
        { label: 'Egosuz Sahiplenme: Hemen bir süpürge alıp kabaca temizler dersime başlarım. Çocuğun eğitimi, benim "temizlik yapmamamdan" daha önemlidir.', weights: { institutionalLoyalty: 1.0, humility: 1.0 }, analysisInsight: 'Egosuz Sahiplenme.' }
      ]
    },
    {
      id: 'vis_new_18', category: 'developmentOpenness', type: 'radio',
      text: 'Eleştirel düşünme beceriniz nasıldır?',
      weightedOptions: [
        { label: 'Saflık: Her şeye inanırım.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'Saflık.' },
        { label: 'Bilimsel Şüphecilik: Duyduğum her bilgiyi sorgular, kaynağına bakarım.', weights: { developmentOpenness: 1.0, analytical: 1.0 }, analysisInsight: 'Bilimsel Şüphecilik.' },
        { label: 'Bilişsel Kapalılık: Sadece kendi bildiğime inanırım.', weights: { developmentOpenness: -0.8 }, analysisInsight: 'Bilişsel Kapalılık.' }
      ]
    },
    {
      id: 'vis_new_19', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurum sahibi size güvendiği için kasanın anahtarını teslim etmek istedi.',
      weightedOptions: [
        { label: 'Riskten Kaçınma: Kabul etmem, sorumluluk alamam.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Riskten Kaçınma.' },
        { label: 'Yüksek Güvenilirlik: Kabul ederim, bu güvene layık olmaya çalışırım.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'Yüksek Güvenilirlik.' },
        { label: 'Tehlike: Kabul ederim (aklımda başka şeyler var).', weights: { integrity: -1.0 }, analysisInsight: 'Tehlike.' }
      ]
    },
    {
      id: 'vis_new_20', category: 'developmentOpenness', type: 'radio',
      text: 'Mesleğinizle ilgili bir belgesel izlerken uykunuz gelir mi?',
      weightedOptions: [
        { label: 'İlgisizlik: Evet, çok sıkıcı.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'İlgisizlik.' },
        { label: 'Tutku: Hayır, not alarak izlerim.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Tutku.' },
        { label: 'Ortalama İlgi: Bazen.', weights: { developmentOpenness: 0.0 }, analysisInsight: 'Ortalama İlgi.' }
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
