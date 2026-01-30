
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Sabit Klinik Katman', description: 'Evrensel uygulama sadakati ve metodolojik temel.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Profesyonel sınırlar ve etik refleks analizi.' },
  { id: 'resilience_team', title: 'Resilians & Takım Uyumu', description: 'Kriz yönetimi ve psikolojik dayanıklılık.' },
  { id: 'vision_loyalty', title: 'Vizyon & Sadakat', description: 'Kurumsal aidiyet ve akademik büyüme projeksiyonu.' }
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
  // --- KATMAN 1: SABİT KLİNİK KATMAN (5 SORU) ---
  clinical_logic: [
    {
      id: 'clin_1', category: 'technicalExpertise', type: 'radio',
      text: 'BEP (Bireyselleştirilmiş Eğitim Programı) hazırlarken hedeflerin belirlenmesinde "SMART" kriterleri neyi ifade eder?',
      weightedOptions: [
        { label: 'Öğrencinin tüm yaşamı boyunca öğrenmesi gereken genel becerileri.', weights: { clinical: 0.4 }, analysisInsight: 'Yüzeysel planlama.' },
        { label: 'Sadece akademik (okuma-yazma) becerilerin önceliklendirilmesini.', weights: { clinical: 0.1 }, analysisInsight: 'Pedagojik kısıtlılık.' },
        { label: 'Ölçülebilir, gözlenebilir ve gerçekçi hedeflerin spesifik bir zaman diliminde planlanmasını.', weights: { clinical: 1.0 }, analysisInsight: 'Metodik doğruluk.' },
        { label: 'Velinin en çok talep ettiği becerilerin listelenmesini.', weights: { clinical: 0.3 }, analysisInsight: 'Veli odaklı sapma.' }
      ]
    },
    {
      id: 'clin_2', category: 'technicalExpertise', type: 'radio',
      text: 'Bilimsel dayanaklı uygulamalarda "Veri Toplama" (Data Collection) seans başarısı için neden kritiktir?',
      weightedOptions: [
        { label: 'Dosyalama ve resmi denetimlerde eksik bırakmamak için.', weights: { clinical: 0.4 }, analysisInsight: 'Bürokratik odak.' },
        { label: 'Veliye ne kadar çok çalıştığımızı göstermek için.', weights: { clinical: 0.2 }, analysisInsight: 'Sosyal maskeleme.' },
        { label: 'Müdahalenin etkinliğini nesnel olarak kanıtlamak ve rotayı veriye göre belirlemek için.', weights: { clinical: 1.0 }, analysisInsight: 'Analitik zihin.' },
        { label: 'Sadece öğrencinin ne kadar hata yaptığını saymak için.', weights: { clinical: 0.5 }, analysisInsight: 'Eksik veri vizyonu.' }
      ]
    },
    {
      id: 'clin_3', category: 'technicalExpertise', type: 'radio',
      text: 'Genelleme (Generalization) aşaması tam olarak ne zaman başlar?',
      weightedOptions: [
        { label: 'Beceri tamamen öğrenildikten sonra seansın sonunda.', weights: { clinical: 0.5 }, analysisInsight: 'Geleneksel hata.' },
        { label: 'Öğretim aşamasıyla eş zamanlı olarak, farklı materyal ve kişilerle en baştan kurgulanmalıdır.', weights: { clinical: 1.0 }, analysisInsight: 'İleri klinik vizyon.' },
        { label: 'Sadece veli evde "yapmıyor" dediği zaman.', weights: { clinical: 0.3 }, analysisInsight: 'Reaktif tutum.' },
        { label: 'Müfredat bittiğinde, bir sonraki yıla hazırlık olarak.', weights: { clinical: 0.1 }, analysisInsight: 'Zamanlama hatası.' }
      ]
    },
    {
      id: 'clin_4', category: 'technicalExpertise', type: 'radio',
      text: '"Hata Üretmeden Öğretim" (Errorless Teaching) tekniğinde temel amaç nedir?',
      weightedOptions: [
        { label: 'Çocuğun hiç yorulmamasını sağlamak.', weights: { clinical: 0.2 }, analysisInsight: 'Pedagojik yanılgı.' },
        { label: 'İpucu silikleştirme ile çocuğun yanlış yapma ve motivasyon kaybetme riskini minimize etmek.', weights: { clinical: 1.0 }, analysisInsight: 'Doğru metodoloji.' },
        { label: 'İpucunu sürekli vererek çocuğun doğruyu her zaman yapmasını sağlamak.', weights: { clinical: 0.4 }, analysisInsight: 'İpucu bağımlılığı riski.' },
        { label: 'Dersi daha hızlı bitirebilmek.', weights: { clinical: 0.0 }, analysisInsight: 'Mesleki etik zayıflığı.' }
      ]
    },
    {
      id: 'clin_5', category: 'technicalExpertise', type: 'radio',
      text: 'Multidisipliner bir ekipte (OT, DKT, ÖE) seans çakışması durumunda öncelik nasıl belirlenir?',
      weightedOptions: [
        { label: 'Kurumda en uzun süre çalışan öğretmenin dediği olur.', weights: { fit: 0.2 }, analysisInsight: 'Hiyerarşik katılık.' },
        { label: 'Çocuğun o anki regülasyon ve temel bariyer ihtiyacına göre ortak karar alınır.', weights: { clinical: 1.0, fit: 1.0 }, analysisInsight: 'Sistemik çözüm.' },
        { label: 'Veli hangi derse girmek istiyorsa o tercih edilir.', weights: { fit: 0.4, clinical: 0.3 }, analysisInsight: 'Veli manipülasyonu.' },
        { label: 'Sadece akademik (derste başarılı olma) odaklı branş öncelenir.', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış öncelik.' }
      ]
    }
  ],

  // --- KATMAN 2: ETİK VE VELİ YÖNETİMİ (5 SORU) ---
  ethics_parent: [
    {
      id: 'eth_1', category: 'workEthics', type: 'radio',
      text: 'Bir veli, mülakat sonrası size özelden ulaşarak kurum dışı "Siyah Randevu" (Özel Ders) teklif ederse tutumunuz?',
      weightedOptions: [
        { label: 'Sadece hayır derim, yönetime bilgi verip veliyi zor durumda bırakmam.', weights: { ethics: 0.7, institutionalLoyalty: 0.5 }, analysisInsight: 'Gizli sadakat.' },
        { label: 'Kabul ederim ama seansları kurum saatleri dışında yaparım.', weights: { ethics: -1.0, institutionalLoyalty: -1.0 }, analysisInsight: 'Ağır ihlal.' },
        { label: 'Kurum etik kurallarını hatırlatıp reddeder ve yönetimi şeffafça bilgilendiririm.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek dürüstlük.' },
        { label: 'Haftada bir gün ise bir şey olmayacağını düşünürüm.', weights: { ethics: -0.5, institutionalLoyalty: -0.5 }, analysisInsight: 'Sınır aşımı.' }
      ]
    },
    {
      id: 'eth_2', category: 'workEthics', type: 'radio',
      text: 'Seans sırasında çocuğun vücudunda açıklanamayan bir morluk/iz gördünüz. İlk adımınız ne olur?',
      weightedOptions: [
        { label: 'Veliye "Bu nedir?" diye sorar, tatmin edici cevap alırsam konuyu kapatırım.', weights: { ethics: 0.4 }, analysisInsight: 'Risk yönetimi hatası.' },
        { label: 'Protokol gereği durumu derhal klinik koordinatöre/yönetime raporlarım ve kayıt altına alırım.', weights: { ethics: 1.0, technicalExpertise: 0.8 }, analysisInsight: 'Profesyonel koruma.' },
        { label: 'Bir sonraki seansı bekleyip iz artıyor mu diye bakarım.', weights: { ethics: 0.1 }, analysisInsight: 'İhmal potansiyeli.' },
        { label: 'Kendi kendime not alır, kimseye söylemem.', weights: { ethics: 0.0 }, analysisInsight: 'Kritik sessizlik.' }
      ]
    },
    {
      id: 'eth_3', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli, diğer bir öğretmenin mülakat performansı veya kişiliği hakkında sizinle dedikodu yapmaya çalışırsa?',
      weightedOptions: [
        { label: 'Dinlerim ama yorum yapmam.', weights: { parentStudentRelations: 0.5, fit: 0.3 }, analysisInsight: 'Pasif onay.' },
        { label: 'Benim de benzer şikayetlerim olduğunu belirtip dertleşirim.', weights: { parentStudentRelations: -0.5, fit: -1.0 }, analysisInsight: 'Takım yıkıcılığı.' },
        { label: 'Nazikçe profesyonel sınırları çizer ve konuyu öğrencinin gelişimine geri getiririm.', weights: { parentStudentRelations: 1.0, fit: 1.0 }, analysisInsight: 'Sınır koruma.' },
        { label: 'Veliye hak verir ama "öğretmen arkadaşımdır" diyerek savunurum.', weights: { parentStudentRelations: 0.3, fit: 0.4 }, analysisInsight: 'Çatışmalı duruş.' }
      ]
    },
    {
      id: 'eth_4', category: 'workEthics', type: 'radio',
      text: '"İkili İlişkiler" (Dual Relationships) kapsamında sosyal medyada velilerle arkadaşlık kurmayı nasıl değerlendirirsiniz?',
      weightedOptions: [
        { label: 'Sadece çok samimi olduğum ve güvendiğim velileri eklerim.', weights: { ethics: 0.2 }, analysisInsight: 'Öznel sınır yönetimi.' },
        { label: 'Eklerim ama paylaşımlarımı kısıtlarım.', weights: { ethics: 0.4 }, analysisInsight: 'Gri alan tercihi.' },
        { label: 'Klinik objektifliği ve profesyonel mesafeyi korumak adına kesinlikle kaçınırım.', weights: { ethics: 1.0 }, analysisInsight: 'Etik olgunluk.' },
        { label: 'Modern dünyada bir sakıncası yoktur, iletişimi artırır.', weights: { ethics: 0.0 }, analysisInsight: 'Etik körlük.' }
      ]
    },
    {
      id: 'eth_5', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli, kurumun/koordinatörün belirlediği yöntemin (örn: ABA) yanlış olduğunu ve başka bir şey (örn: Montessori) istediğini söylüyor.',
      weightedOptions: [
        { label: 'Veli haklıdır, gizlice onun istediği gibi çalışırım.', weights: { ethics: -0.8, institutionalLoyalty: -1.0 }, analysisInsight: 'Gizli ajanda.' },
        { label: 'Yöntemin bilimsel dayanağını açıklar, koordinatörü sürece dahil ederek ortak dil kurarım.', weights: { parentStudentRelations: 1.0, clinical: 0.8 }, analysisInsight: 'Arabulucu uzman.' },
        { label: 'Sert bir dille "uzman benim" diyerek veliyi sustururum.', weights: { parentStudentRelations: 0.2 }, analysisInsight: 'İletişim hatası.' },
        { label: 'Kararı tamamen yönetime bırakır, sorumluluk almam.', weights: { fit: 0.4 }, analysisInsight: 'Zayıf inisiyatif.' }
      ]
    }
  ],

  // --- KATMAN 3: RESİLİANS VE TAKIM UYUMU (5 SORU) ---
  resilience_team: [
    {
      id: 'res_1', category: 'sustainability', type: 'radio',
      text: 'Üst üste 3 seans boyunca ağır bir davranış problemi (ısırma, kendine zarar) ile karşılaştınız ve yoruldunuz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Kimseye belli etmeden devam ederim, tükenene kadar dayanırım.', weights: { sustainability: 0.3 }, analysisInsight: 'Burnout riski.' },
        { label: 'Durumu süpervizörümle paylaşır, teknik destek veya kısa bir mola talep ederek strateji güncellerim.', weights: { sustainability: 1.0 }, analysisInsight: 'Öz-farkındalık.' },
        { label: 'O öğrencinin seanslarından çekilmek istediğimi söylerim.', weights: { sustainability: 0.1 }, analysisInsight: 'Düşük direnç.' },
        { label: 'Çocuğa gegen sesimi yükseltir veya sertleşirim.', weights: { sustainability: -1.0, ethics: -1.0 }, analysisInsight: 'Kritik tehlike.' }
      ]
    },
    {
      id: 'res_2', category: 'fit', type: 'radio',
      text: 'Takım toplantısında yaptığınız bir uygulama koordinatör tarafından sertçe eleştirildiğinde tepkiniz?',
      weightedOptions: [
        { label: 'Kişisel algılar ve toplantı sonrası modumu düşürürüm.', weights: { fit: 0.4 }, analysisInsight: 'Duygusal kırılganlık.' },
        { label: 'Eleştiriyi gelişim fırsatı olarak görür, dayanaklarımı sunar ve ortak noktada kendimi güncellerim.', weights: { fit: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Yüksek uyum.' },
        { label: 'Hatalı olduğumu düşünmesem de tartışmamak için "tamam" derim.', weights: { fit: 0.5 }, analysisInsight: 'Pasif-agresif.' },
        { label: 'Onun da hatalarını herkesin içinde yüzüne vururum.', weights: { fit: -0.8 }, analysisInsight: 'Toksik tutum.' }
      ]
    },
    {
      id: 'res_3', category: 'sustainability', type: 'radio',
      text: 'Kurumda iş yükünün aniden arttığı (ek seanslar, raporlama dönemi) stresli bir haftayı nasıl yönetirsiniz?',
      weightedOptions: [
        { label: 'Hepsini yetiştirmeye çalışırken hata yaparım.', weights: { sustainability: 0.4 }, analysisInsight: 'Yüksek kaygı.' },
        { label: 'Öncelik matrisi hazırlar, zaman yönetimi teknikleriyle iş akışını organize ederim.', weights: { sustainability: 1.0 }, analysisInsight: 'Planlama gücü.' },
        { label: 'Yöneticilere bu kadar işin yapılamayacağını söyleyip şikayet ederim.', weights: { sustainability: 0.2, fit: 0.1 }, analysisInsight: 'Düşük motivasyon.' },
        { label: 'Bazı raporları kopyala-yapıştır ile hızlıca geçerim.', weights: { ethics: -0.7, clinical: -0.5 }, analysisInsight: 'Liyakat kaybı.' }
      ]
    },
    {
      id: 'res_4', category: 'fit', type: 'radio',
      text: 'Yeni işe başlayan bir iş arkadaşınızın klinik bir hata yaptığını fark ettiniz. Aksiyonunuz?',
      weightedOptions: [
        { label: 'Diğer arkadaşlarıma anlatıp "bakın ne yapmış" derim.', weights: { fit: -0.5 }, analysisInsight: 'Dedikodu/Toksik.' },
        { label: 'Kendisiyle yapıcı bir dille birebir konuşur, gerekirse üst yönetimi doğru kanaldan bilgilendiririm.', weights: { fit: 1.0, ethics: 0.8 }, analysisInsight: 'Yapıcı denetçi.' },
        { label: 'Beni ilgilendirmediğini düşünüp sessiz kalırım.', weights: { fit: 0.3, clinical: -0.2 }, analysisInsight: 'Sorumluluktan kaçınma.' },
        { label: 'Derhal koordinatöre şikayet ederim.', weights: { fit: 0.6 }, analysisInsight: 'Sert hiyerarşi.' }
      ]
    },
    {
      id: 'res_5', category: 'sustainability', type: 'radio',
      text: 'Özel eğitimde "Küçük Adımlar" prensibi bazen çok yavaş ilerler. Aylarca ilerleme kaydedemediğiniz bir vakada motivasyonunuzu ne sağlar?',
      weightedOptions: [
        { label: 'Çocuğun potansiyelinin bu kadar olduğuna inanırım.', weights: { sustainability: 0.2 }, analysisInsight: 'Düşük beklenti hatası.' },
        { label: 'Verileri tekrar analiz eder, küçük başarıları (successive approximations) bulur ve metodumu sorgularım.', weights: { sustainability: 1.0, clinical: 0.9 }, analysisInsight: 'Bilimsel azim.' },
        { label: 'Veliye "bu çocuktan bir şey olmaz" mesajı veririm.', weights: { ethics: -1.0, parentStudentRelations: -1.0 }, analysisInsight: 'Ağır pedagojik risk.' },
        { label: 'Kendi başarısızlığım olarak görüp moralimi bozarım.', weights: { sustainability: 0.4 }, analysisInsight: 'Kaygı odaklı.' }
      ]
    }
  ],

  // --- KATMAN 4: VİZYON VE SADAKAT (5 SORU) ---
  vision_loyalty: [
    {
      id: 'vis_1', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumun size 2 yıllık bir gelişim planı ve eğitim yatırım taahhüdü sunmasını nasıl karşılarsınız?',
      weightedOptions: [
        { label: 'Sertifikayı alana kadar kalır, sonra daha iyi bir teklifi değerlendiririm.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Fırsatçı risk.' },
        { label: 'Bu yatırımı kariyerim için büyük fırsat görür, kurumsal aidiyetimi pekiştiririm.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Aidiyet.' },
        { label: '2 yıl çok uzun bir süre, özgürlüğümün kısıtlanmasını istemem.', weights: { institutionalLoyalty: -0.3 }, analysisInsight: 'Düşük bağlılık.' },
        { label: 'Sadece maaş artışı eşlik ederse kabul ederim.', weights: { institutionalLoyalty: 0.4 }, analysisInsight: 'Materyalist odak.' }
      ]
    },
    {
      id: 'vis_2', category: 'developmentOpenness', type: 'radio',
      text: 'Akademik bir makaleyi veya yeni bir müdahale yöntemini öğrenip takıma sunmanız istendiğinde?',
      weightedOptions: [
        { label: 'İş tanımımda "sunum yapmak" olmadığını belirtirim.', weights: { developmentOpenness: -0.5, fit: -0.5 }, analysisInsight: 'Gelişime kapalılık.' },
        { label: 'Zevkle araştırır, literatürü tarar ve en güncel bilgiyi ekibe aktarırım.', weights: { developmentOpenness: 1.0, fit: 0.8 }, analysisInsight: 'Akademik liderlik.' },
        { label: 'Vaktim olursa yaparım.', weights: { developmentOpenness: 0.3 }, analysisInsight: 'Düşük öncelik.' },
        { label: 'Hazır bir sunumu internetten bulur, üzerinde durmam.', weights: { developmentOpenness: 0.1, ethics: -0.2 }, analysisInsight: 'Zayıf emek.' }
      ]
    },
    {
      id: 'vis_3', category: 'institutionalLoyalty', type: 'radio',
      text: 'Mesleki hayaliniz/hedefiniz nedir?',
      weightedOptions: [
        { label: 'Kendi merkezimi açmak.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Potansiyel rakip.' },
        { label: 'Alanında otorite bir akademisyen/uzman olup bu kurumu bir mükemmeliyet merkezi yapmak.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Vizyoner.' },
        { label: 'Daha az çalışıp daha çok kazanabileceğim bir düzen kurmak.', weights: { sustainability: 0.0 }, analysisInsight: 'Düşük enerji.' },
        { label: 'Şu anki durumumu korumak, huzurlu çalışmak.', weights: { fit: 0.7 }, analysisInsight: 'Stabil personel.' }
      ]
    },
    {
      id: 'vis_4', category: 'developmentOpenness', type: 'radio',
      text: 'Mevcut bildiğiniz bir yöntemin (örn: Geleneksel) kurum tarafından "artık kullanılmayacağı" söylendiğinde?',
      weightedOptions: [
        { label: 'Eski yöntemin daha iyi olduğunu savunur, direnç gösteririm.', weights: { fit: 0.2 }, analysisInsight: 'Statükocu.' },
        { label: 'Nedenini sorgular, bilimsel gerekçeleri anlar ve yeni yönteme hızla adapte olurum.', weights: { developmentOpenness: 1.0, fit: 1.0 }, analysisInsight: 'Bilişsel esneklik.' },
        { label: 'Öğrenmiş gibi yapar, bildiğimi okumaya devam ederim.', weights: { ethics: -0.8, fit: -0.5 }, analysisInsight: 'Gizli direnç.' },
        { label: 'Yyenisini de öğrenir ama ikisini karıştırırım.', weights: { clinical: 0.4 }, analysisInsight: 'Metodik karmaşa.' }
      ]
    },
    {
      id: 'vis_5', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumun itibarını zedeleyecek bir durumla (örn: bir iş arkadaşının uygunsuz paylaşımı) karşılaştınız. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Beni ilgilendirmez, görmezden gelirim.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Aidiyet eksikliği.' },
        { label: 'Kurumu korumak adına durumu derhal üst yönetime resmi kanallardan iletirim.', weights: { institutionalLoyalty: 1.0, ethics: 1.0 }, analysisInsight: 'Kurumsal muhafız.' },
        { label: 'Arkadaşımı uyarırım ama kuruma söylemem.', weights: { institutionalLoyalty: 0.5 }, analysisInsight: 'Kişisel sadakat önceliği.' },
        { label: 'Ben de sosyal medyada benzer paylaşımlar yaparım.', weights: { fit: -1.0 }, analysisInsight: 'Kültürel uyumsuzluk.' }
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
