
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
        text: 'Bir problem davranışın "işlevi" belirlenirken hangisi birincil veri kaynağıdır?',
        weightedOptions: [
          { label: 'Velinin çocuk hakkındaki genel şikayetleri.', weights: { clinical: 0.2 }, analysisInsight: 'Subjektif hata.' },
          { label: 'ABC (Antecedent-Behavior-Consequence) kayıtları ve işlevsel analiz.', weights: { clinical: 1.0 }, analysisInsight: 'Teknik doğruluk.' },
          { label: 'Çocuğun tıbbi tanılama raporu.', weights: { clinical: 0.4 }, analysisInsight: 'Eksik veri kullanımı.' },
          { label: 'Öğretmenin o anki sezgisel tahmini.', weights: { clinical: 0.0 }, analysisInsight: 'Bilimsel dışı.' }
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
        text: 'FEDL 3 (İki Yönlü İletişim) aşamasında temel hedef hangisidir?',
        weightedOptions: [
          { label: 'Çocuğa sayıları öğretmek.', weights: { clinical: 0.0 }, analysisInsight: 'Yanlış etap.' },
          { label: 'Sürekli etkileşim döngüleri (circles of communication) kurmak.', weights: { clinical: 1.0 }, analysisInsight: 'Hiyerarşik bilgi.' },
          { label: 'Sadece göz kontağı kurmasını sağlamak.', weights: { clinical: 0.3 }, analysisInsight: 'Davranışçı ile karıştırma.' },
          { label: 'Karmaşık cümleler kurdurmak.', weights: { clinical: 0.1 }, analysisInsight: 'Üst basamak hatası.' }
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
        text: 'CAS testinde "Planlama" ölçeği düşük çıkan bir öğrencide hangisi birincil müdahaledir?',
        weightedOptions: [
          { label: 'Hızlı okuma çalışmaları.', weights: { clinical: 0.2 }, analysisInsight: 'Alakasız müdahale.' },
          { label: 'Ezber kapasitesini artırıcı ödevler.', weights: { clinical: 0.0 }, analysisInsight: 'Pedagojik risk.' },
          { label: 'Bilişsel strateji geliştirme ve öz-izleme çalışmaları.', weights: { clinical: 1.0 }, analysisInsight: 'Metodik uyum.' },
          { label: 'Daha çok matematik testi çözdürmek.', weights: { clinical: 0.1 }, analysisInsight: 'Sığ yaklaşım.' }
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
        text: 'WISC-V raporunda "Görsel Uzamsal" ve "Akıcı Akıl Yürütme" arasındaki belirgin fark neyi gösterir?',
        weightedOptions: [
          { label: 'Çocuğun zekasının çok yüksek olduğunu.', weights: { clinical: 0.2 }, analysisInsight: 'Popülist yorum.' },
          { label: 'Adayın görsel algı ile soyut mantık yürütme arasındaki bilişsel ayrışmasını.', weights: { clinical: 1.0 }, analysisInsight: 'Üst düzey yorum kabiliyeti.' },
          { label: 'Testin hatalı yapıldığını.', weights: { clinical: 0.0 }, analysisInsight: 'Yetersiz teknik bilgi.' },
          { label: 'Çocuğun gözlük kullanması gerektiğini.', weights: { clinical: 0.1 }, analysisInsight: 'Absürt yorum.' }
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
        text: 'PROMPT hiyerarşisinde "Mandibular (Çene) Kontrolü" neden ilk sırada yer alır?',
        weightedOptions: [
          { label: 'Öğretmesi en kolay hareket olduğu için.', weights: { clinical: 0.2 }, analysisInsight: 'Sığ bilgi.' },
          { label: 'Daha karmaşık labial ve lingual hareketler için stabil bir temel oluşturduğu için.', weights: { clinical: 1.0 }, analysisInsight: 'Anatomik derinlik.' },
          { label: 'Seslerin çoğu çene hareketiyle çıktığı için.', weights: { clinical: 0.4 }, analysisInsight: 'Eksik tanımlama.' },
          { label: 'Veli çene hareketini daha rahat gördüğü için.', weights: { clinical: 0.0 }, analysisInsight: 'Klinik dışı odak.' }
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
        text: '"Propriyoseptif Sistem" arayışı olan bir çocukta seansta hangisi gözlemlenir?',
        weightedOptions: [
          { label: 'Sürekli kulaklarını kapatma ve sesten kaçma.', weights: { clinical: 0.1 }, analysisInsight: 'İşitsel savunma ile karıştırma.' },
          { label: 'Derin bası ihtiyacı, eklemleri sıkıştırma ve sert hareketlere eğilim.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik profil bilgisi.' },
          { label: 'Sadece parlak ışıklardan rahatsız olma.', weights: { clinical: 0.1 }, analysisInsight: 'Görsel hassasiyet hatası.' },
          { label: 'Dengesini kaybedip sürekli düşme.', weights: { clinical: 0.4 }, analysisInsight: 'Vestibüler ile karıştırma.' }
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
        text: 'BDT seansında "Bilişsel Yeniden Yapılandırma"nın temel amacı nedir?',
        weightedOptions: [
          { label: 'Çocuğun geçmiş travmalarını saatlerce anlattırmak.', weights: { clinical: 0.2 }, analysisInsight: 'Ekol karışıklığı.' },
          { label: 'İşlevsel olmayan otomatik düşünceleri saptayıp rasyonel olanlarla değiştirmek.', weights: { clinical: 1.0 }, analysisInsight: 'Metodik hakimiyet.' },
          { label: 'Sadece güzel düşünmesini sağlamak.', weights: { clinical: 0.1 }, analysisInsight: 'Yüzeysel yorum.' },
          { label: 'Çocuğa seans sırasında ödül vermek.', weights: { clinical: 0.3 }, analysisInsight: 'Davranışçı odak.' }
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
      text: 'Yoğun bir "Problem Davranış" (Örn: Kafasını masaya vurma) anında, çocuğun burnunun aktığını ve çok rahatsız olduğunu fark ettiniz. İlk saliselik refleksiniz ne olur?',
      weightedOptions: [
        { 
          label: 'Mendil alıp burnunu silerim, çocuk rahatlamadan eğitime devam edilmez.', 
          weights: { clinical: -0.4, empathy: 1.0, sustainability: -0.2 }, 
          analysisInsight: 'Şefkat Tuzağı: Davranış anında ilgi göstererek problem davranışı pekiştirme riski (Reinforcement of Maladaptive Behavior).' 
        },
        { 
          label: 'Kafasını korumak için el yastığı yaparım ama göz teması kurmadan, nötr bir yüzle krizin sönmesini bekler, burnunu kriz bitince silerim.', 
          weights: { clinical: 1.0, empathy: -0.1, sustainability: 0.8 }, 
          analysisInsight: 'Klinik Sadakat: Güvenliği sağlarken davranışsal ilkeden taviz vermeme (Planned Ignoring + Safety).' 
        },
        { 
          label: '"Yapma" diyerek çocuğu tutarım ve sakinleştirmeye çalışırım.', 
          weights: { clinical: -0.6, empathy: 0.2, sustainability: -0.5 }, 
          analysisInsight: 'Veri Kirliliği: Sözel uyaran vererek davranışı besleme hatası.' 
        },
        { 
          label: 'Dersi bitirir, veliye çocuğu temizlemesini söylerim.', 
          weights: { clinical: -0.8, empathy: -0.5, institutionalLoyalty: -0.5 }, 
          analysisInsight: 'Kaçınma Davranışı: Kriz anında sorumluluk reddi.' 
        }
      ]
    },
    {
      id: 'clin_shadow_2', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk çok kritik bir beceriyi (örn: ilk kez "Anne" deme) gerçekleştirdi ancak o sırada sandalyede uygunsuz oturuyor (ayağını altına almış). Pekiştireci (Ödülü) nasıl sunarsınız?',
      weightedOptions: [
        { 
          label: 'Önce "ayağını düzelt" derim, düzeltince ödülü veririm.', 
          weights: { clinical: -0.5, pedagogicalAnalysis: -0.5 }, 
          analysisInsight: 'Zamanlama Hatası: Hedef davranış ile pekiştireç arasına başka talep sokarak öğrenmeyi bozma.' 
        },
        { 
          label: 'Hiç beklemeden coşkuyla ödülü veririm; oturuş şekli şu anki hedefim değil, o "Anne" dedi!', 
          weights: { clinical: 1.0, pedagogicalAnalysis: 1.0, formality: -0.2 }, 
          analysisInsight: 'Öncelik Yönetimi: Kritik beceriyi yakalamak için ikincil kuralları esnetme zekası.' 
        },
        { 
          label: 'Görmezden gelirim, her şey mükemmel olmadan ödül verilmez.', 
          weights: { clinical: -0.8, empathy: -0.5 }, 
          analysisInsight: 'Mükemmeliyetçilik Tuzağı: Fırsat öğretimini kaçırma.' 
        }
      ]
    },
    {
      id: 'clin_shadow_3', category: 'technicalExpertise', type: 'radio',
      text: 'Seansın bitmesine 2 dakika var ve çocuk nihayet derse odaklandı, çok verimli bir akış yakaladınız. Ancak kapıda bir sonraki öğrenci bekliyor. Kararınız?',
      weightedOptions: [
        { 
          label: 'Akışı bozmam, 5-10 dakika uzatırım. Diğer veli idare eder.', 
          weights: { clinical: 0.5, ethics: -0.6, institutionalLoyalty: -0.4 }, 
          analysisInsight: 'Sınır İhlali: İyi niyetli ama kurumsal zaman yönetimini bozan eylem.' 
        },
        { 
          label: 'Tam dakikasında keserim. Kurallar kuraldır.', 
          weights: { clinical: -0.2, formality: 1.0, empathy: -0.3 }, 
          analysisInsight: 'Mekanik Uygulama: Pedagojik kazancı prosedüre kurban etme.' 
        },
        { 
          label: 'Mevcut akışı "en yüksek noktada" (Peak) sonlandırıp, çocuğun "başarma hissiyle" ve tadı damağında kalarak çıkmasını sağlarım.', 
          weights: { clinical: 1.0, pedagogicalAnalysis: 0.8, institutionalLoyalty: 0.8 }, 
          analysisInsight: 'Ustalık: Kısıtlılığı pedagojik bir avantaja çevirme (Leave them wanting more).' 
        }
      ]
    },
    {
      id: 'clin_shadow_4', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuğun sevdiği oyuncağı kullanarak çalışıyorsunuz. Çocuk oyuncağı elinizden hışımla çekip aldı ve vermiyor. Güç mücadelesine girmeden kontrolü nasıl geri alırsınız?',
      weightedOptions: [
        { 
          label: '"Ver onu bana!" diye sertçe isterim, otorite bende olmalı.', 
          weights: { pedagogicalAnalysis: -0.5, empathy: -0.5 }, 
          analysisInsight: 'Güç Savaşı: Çocuğu savunmaya iten eski ekol yaklaşımı.' 
        },
        { 
          label: 'Elindeki oyuncağın "eksik parçasını" (örn: arabanın yolu, bebeğin biberonu) elinde tutup, oyunu devam ettirmek için bana muhtaç olmasını sağlarım.', 
          weights: { pedagogicalAnalysis: 1.0, clinical: 0.8 }, 
          analysisInsight: 'Ortam Kontrolü (Environmental Control): Fiziksel güç yerine motivasyonel kontrol.' 
        },
        { 
          label: 'Bırakırım oynasın, ağlamasın.', 
          weights: { clinical: -0.6, sustainability: -0.4 }, 
          analysisInsight: 'Teslimiyet: Terapötik liderliğin kaybı.' 
        }
      ]
    },
    {
      id: 'clin_shadow_5', category: 'technicalExpertise', type: 'radio',
      text: 'Veri toplama kağıdınız (Data Sheet) o gün kaybolmuş. Seansa girdiniz. Ne yaparsınız?',
      weightedOptions: [
        { 
          label: 'Veri tutmam, aklımda tutarım, çıkışta yazarım.', 
          weights: { clinical: -0.5, workEthics: -0.3 }, 
          analysisInsight: 'Hafıza Yanılgısı: Subjektif veri riski.' 
        },
        { 
          label: 'Seansı iptal eder, kağıdı aramaya giderim.', 
          weights: { clinical: -0.2, institutionalLoyalty: -0.4 }, 
          analysisInsight: 'Operasyonel Aksama: Çözüm odaklı olmama.' 
        },
        { 
          label: 'Hemen bir boş kağıda veya elime "Tally" (çentik) atarak geçici bir kayıt sistemi kurarım. Verisiz seans olmaz.', 
          weights: { clinical: 1.0, sustainability: 0.8 }, 
          analysisInsight: 'Klinik Refleks: Şartlar ne olursa olsun veriye sadakat.' 
        }
      ]
    }
  ],

  // --- KATMAN 2: ETİK SINIRLAR & VELİ DİPLOMASİSİ (SHADOW PLAY) ---
  ethics_parent: [
    {
      id: 'eth_shadow_1', category: 'workEthics', type: 'radio',
      text: 'Kurumun "Veliyle Şahsi Telefonlaşma Yasak" kuralı var. Ancak bir veli, çocuğunun gece geçirdiği nöbetin videosunu atmak için numaranızı istiyor. Tavrınız?',
      weightedOptions: [
        { 
          label: 'Veririm, sağlık söz konusu, kural dinlemem.', 
          weights: { workEthics: -0.4, empathy: 0.8, institutionalLoyalty: -0.5 }, 
          analysisInsight: 'Sınır İhlali: İyi niyetli ama yönetilemez bir iletişim kapısı açma riski.' 
        },
        { 
          label: 'Numaramı vermem, kurumsal hattan atmasını isterim. O an atamıyorsa videoyu sabah izleyeceğimi söylerim.', 
          weights: { workEthics: 1.0, institutionalLoyalty: 1.0, empathy: 0.2 }, 
          analysisInsight: 'Profesyonel Sınır: Kriz anında bile kurumsal kanalı koruma.' 
        },
        { 
          label: 'Numaramı veririm ama "sakın beni arama sadece video at" derim.', 
          weights: { workEthics: -0.2, sustainability: -0.4 }, 
          analysisInsight: 'Naiflik: Sınırın delineceğini öngörememe.' 
        }
      ]
    },
    {
      id: 'eth_shadow_2', category: 'parentStudentRelations', type: 'radio',
      text: 'Çocuğun 6 aydır yerinde saydığını görüyorsunuz ama Koordinatör veliye "Her şey harika gidiyor" diyor. Veli size dönüp "Hocam sizce de öyle mi?" diye sordu. Cevabınız?',
      weightedOptions: [
        { 
          label: '"Müdürüm ne diyorsa doğrudur" derim.', 
          weights: { workEthics: -0.5, institutionalLoyalty: 0.5, personality: -0.3 }, 
          analysisInsight: 'Bürokratik Sığınma: Pasif suç ortaklığı.' 
        },
        { 
          label: '"Hayır, çocuğunuz hiç ilerlemiyor, sizi kandırıyorlar" derim.', 
          weights: { institutionalLoyalty: -1.0, workEthics: 0.2, personality: -0.5 }, 
          analysisInsight: 'Kurumsal Sabotaj: Doğruyu söylerken kurumu yıkma (Yıkıcı Dürüstlük).' 
        },
        { 
          label: '"Bazı alanlarda güzel çabaları var ancak X ve Y konularında (yerinde saydığı alanlar) daha yoğun çalışmamız ve strateji değiştirmemiz gerekiyor." diyerek gerçeği yumuşatmadan ama profesyonelce sunarım.', 
          weights: { workEthics: 1.0, parentStudentRelations: 1.0, institutionalLoyalty: 0.5 }, 
          analysisInsight: 'Diplomatik Dürüstlük: Kurumu korurken gerçeği manipüle etmeme sanatı.' 
        }
      ]
    },
    {
      id: 'eth_shadow_3', category: 'workEthics', type: 'radio',
      text: 'Seans sırasında çocuğun vücudunda bir morluk gördünüz. Veliye sordunuz, "Düştü" dedi ama şüphelendiniz. (İstismar şüphesi). Ne yaparsınız?',
      weightedOptions: [
        { 
          label: 'Veliye inandığımı söylerim, aile işine karışmam.', 
          weights: { workEthics: -1.0, clinical: -0.5 }, 
          analysisInsight: 'İhmal: Çocuğun güvenliğini riske atma.' 
        },
        { 
          label: 'Hemen polisi veya sosyal hizmetleri ararım.', 
          weights: { workEthics: 0.5, institutionalLoyalty: -0.5, sustainability: -0.2 }, 
          analysisInsight: 'Dürtüsel Eylem: Kurumsal protokolü atlayarak kriz yaratma riski.' 
        },
        { 
          label: 'Vücut haritasına (Body Chart) morluğu işler, tutanak tutar ve derhal Kurum Müdürü/Psikoloğu ile "Kritik Vaka Toplantısı" talep ederim.', 
          weights: { workEthics: 1.0, institutionalLoyalty: 1.0, clinical: 0.8 }, 
          analysisInsight: 'Prosedürel Yetkinlik: Yasal ve kurumsal silsileyi doğru işletme.' 
        }
      ]
    },
    {
      id: 'eth_shadow_4', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli size "Hocam bizim çocuktan adam olur mu, boşuna mı uğraşıyoruz?" diye çok umutsuz bir soru sordu. Yanıtınız?',
      weightedOptions: [
        { 
          label: '"Tabii ki olur, o çok zeki bir çocuk, merak etmeyin." (Yalan bile olsa).', 
          weights: { workEthics: -0.3, parentStudentRelations: 0.5 }, 
          analysisInsight: 'Pembe Tablo: Etik olmayan sahte umut satışı.' 
        },
        { 
          label: '"Geleceği bilemeyiz, elimizden geleni yapıyoruz." (Kaçamak).', 
          weights: { parentStudentRelations: -0.2, personality: -0.2 }, 
          analysisInsight: 'Soğukluk: Veliyi duygusal boşlukta bırakma.' 
        },
        { 
          label: '"Potansiyeli var ancak bu bir maraton. Biz şu anki hedefimiz olan X becerisine odaklanalım, orayı aştıkça önümüzü daha net göreceğiz." (Realist & Yönlendirici).', 
          weights: { parentStudentRelations: 1.0, workEthics: 1.0, clinical: 0.5 }, 
          analysisInsight: 'Profesyonel Umut: Gerçekçi, sürece odaklayan liderlik.' 
        }
      ]
    }
  ],

  // --- KATMAN 3: PSİKOLOJİK DAYANIKLILIK & TAKIM (SHADOW PLAY) ---
  resilience_team: [
    {
      id: 'res_shadow_1', category: 'sustainability', type: 'radio',
      text: 'Partner öğretmeniniz (eküri) derse sürekli geç geliyor ve bu yüzden sizin seanslarınız sarkıyor. Onu nasıl uyarırsınız?',
      weightedOptions: [
        { 
          label: 'Onu müdüre şikayet ederim.', 
          weights: { sustainability: 0.2, fit: -0.5 }, 
          analysisInsight: 'İspiyonculuk: Takım içi güveni zedeleme.' 
        },
        { 
          label: 'Küserek konuşmam.', 
          weights: { sustainability: -0.5, personality: -0.5 }, 
          analysisInsight: 'Pasif Agresyon: Profesyonellik dışı çocuksu tepki.' 
        },
        { 
          label: 'Onu kenara çeker, "Geç kalman benim planımı bozuyor ve beni zor durumda bırakıyor, buna bir çözüm bulalım" diyerek "Ben Dili" ile konuşurum.', 
          weights: { sustainability: 1.0, fit: 1.0, personality: 0.8 }, 
          analysisInsight: 'Olgun İletişim: Sorunu kaynağında, çatışma yaratmadan çözme.' 
        }
      ]
    },
    {
      id: 'res_shadow_2', category: 'sustainability', type: 'radio',
      text: 'Çok emek verdiğiniz bir öğrenci, 3 ayın sonunda size vurdu ve tükürdü. O an hissettiğiniz duygu ve eyleminiz?',
      weightedOptions: [
        { 
          label: 'Öfkelenirim ve "Terbiyesiz" diye bağırırım.', 
          weights: { sustainability: -1.0, clinical: -1.0 }, 
          analysisInsight: 'Duygusal Çöküş: Kişiselleştirme hatası.' 
        },
        { 
          label: 'Çok üzülürüm, demek ki ben başarısızım diye düşünürüm.', 
          weights: { sustainability: -0.5, personality: -0.3 }, 
          analysisInsight: 'Kırılganlık: Özgüven kaybı.' 
        },
        { 
          label: 'Duygusal olarak etkilenmem. "Bu bir davranış, şahsıma değil" derim ve ABC kaydına "Saldırganlık" olarak nötr şekilde işlerim.', 
          weights: { sustainability: 1.0, clinical: 1.0, workEthics: 0.8 }, 
          analysisInsight: 'Profesyonel Zırh: Davranışı kişiselleştirmeme (Depersonalization).' 
        }
      ]
    },
    {
      id: 'res_shadow_3', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumda herkesin katıldığı bir doğum günü kutlaması var ama sizin çok işiniz var. Ne yaparsınız?',
      weightedOptions: [
        { 
          label: 'Gitmem, işim daha önemli.', 
          weights: { institutionalLoyalty: 0.2, fit: -0.4 }, 
          analysisInsight: 'Sosyal İzolasyon: Takım ruhunu önemsememe.' 
        },
        { 
          label: 'İşleri bırakır tüm gün kutlamada otururum.', 
          weights: { workEthics: -0.3, fit: 0.2 }, 
          analysisInsight: 'İş Disiplini Zafiyeti.' 
        },
        { 
          label: '5-10 dakika uğrar, görünür, tebrik eder ve "Yetiştirmem gereken raporlar var" diyerek nazikçe ayrılırım.', 
          weights: { institutionalLoyalty: 1.0, fit: 1.0, sustainability: 0.5 }, 
          analysisInsight: 'Sosyal Zeka: Dengeyi koruma.' 
        }
      ]
    }
  ],

  // --- KATMAN 4: VİZYON & KURUMSAL AİDİYET (SHADOW PLAY) ---
  vision_loyalty: [
    {
      id: 'vis_shadow_1', category: 'institutionalLoyalty', type: 'radio',
      text: 'Size "X Yöntemi"nin eğitimi verilecek ama karşılığında 1 yıl kurumdan ayrılmama taahhüdü (sözleşme) isteniyor. İmzalar mısınız?',
      weightedOptions: [
        { 
          label: 'Asla imzalamam, özgürlüğüm kısıtlanamaz.', 
          weights: { institutionalLoyalty: -0.5, developmentOpenness: -0.2 }, 
          analysisInsight: 'Bağlılık Sorunu: Yatırıma kapalı profil.' 
        },
        { 
          label: 'İmzalarım ama fırsat bulursam tazminatı öder kaçarım.', 
          weights: { institutionalLoyalty: -0.8, workEthics: -0.5 }, 
          analysisInsight: 'Etik Risk: Güvenilmez profil.' 
        },
        { 
          label: 'Memnuniyetle imzalarım. Kurumun bana yatırım yapması, değer verdiğini gösterir ve kariyerim için bir fırsattır.', 
          weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, 
          analysisInsight: 'Kariyer Ortaklığı: Kurumla büyüme vizyonu.' 
        }
      ]
    },
    {
      id: 'vis_shadow_2', category: 'developmentOpenness', type: 'radio',
      text: 'Yapay Zeka (AI) destekli raporlama sistemine geçiyoruz. Ancak sistemi öğrenmek biraz zor. Tepkiniz?',
      weightedOptions: [
        { 
          label: '"Eski usül kağıt kalem daha iyiydi, ne gerek var?" diye direnç gösteririm.', 
          weights: { developmentOpenness: -0.5, institutionalLoyalty: -0.2 }, 
          analysisInsight: 'Değişim Direnci (Resistance to Change): Statükocu.' 
        },
        { 
          label: '"Tamam" derim ama kullanmam, başkasına yaptırırım.', 
          weights: { workEthics: -0.5, developmentOpenness: -0.3 }, 
          analysisInsight: 'Pasif Direniş.' 
        },
        { 
          label: 'Zor olsa da öğrenmek için ekstra mesai harcarım. Teknoloji mesleğimizin geleceğidir.', 
          weights: { developmentOpenness: 1.0, sustainability: 0.5 }, 
          analysisInsight: 'Gelişim Zihniyeti (Growth Mindset): Yeniliğe adaptasyon.' 
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
