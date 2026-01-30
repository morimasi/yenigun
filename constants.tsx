
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Sabit Klinik & Pedagojik Katman', description: 'Evrensel uygulama sadakati ve metodolojik temel.' },
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
  // --- KATMAN 1: SABİT KLİNİK KATMAN (+20 YENİ SORU: 10 Klinik + 10 Pedagojik) ---
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
    // ... [KLİNİK YETERLİLİK - YENİ SORULAR - PART 1] ...
    {
      id: 'clin_ext_1', category: 'technicalExpertise', type: 'radio',
      text: '"Pekiştirme Tarifesi" (Reinforcement Schedule) geçişlerinde, Sürekli Pekiştirmeden (FR1) Aralıklı Pekiştirmeye (VR) erken geçilirse ne risk oluşur?',
      weightedOptions: [
        { label: 'Çocuk beceriyi daha hızlı öğrenir.', weights: { clinical: 0.2 }, analysisInsight: 'Metodolojik yanılgı.' },
        { label: 'Sönme (Extinction) benzeri bir etki oluşarak davranışta bozulma ve motivasyon kaybı yaşanır.', weights: { clinical: 1.0 }, analysisInsight: 'Derin teknik bilgi.' },
        { label: 'Çocuk ödüle bağımlı hale gelir.', weights: { clinical: 0.3 }, analysisInsight: 'Yanlış kavram eşleşmesi.' },
        { label: 'Hiçbir risk yoktur, pekiştireç tasarrufu sağlanır.', weights: { clinical: 0.0 }, analysisInsight: 'Pedagojik körlük.' }
      ]
    },
    {
      id: 'clin_ext_2', category: 'technicalExpertise', type: 'radio',
      text: 'İpucu Silikleştirme (Prompt Fading) sürecinde "Gecikmeli İpucu" (Time Delay) yöntemi hangi durumda en etkilidir?',
      weightedOptions: [
        { label: 'Çocuk beceriyi hiç bilmiyorsa.', weights: { clinical: 0.2 }, analysisInsight: 'Hata riski yüksek.' },
        { label: 'Çocuk beceriyi kazanmış ancak bağımsız başlatmada (initiation) sorun yaşıyorsa.', weights: { clinical: 1.0 }, analysisInsight: 'Doğru strateji.' },
        { label: 'Problem davranış anında.', weights: { clinical: 0.0 }, analysisInsight: 'Kriz yönetimi hatası.' },
        { label: 'Veli odadayken.', weights: { clinical: 0.1 }, analysisInsight: 'İlgisiz bağlam.' }
      ]
    },
    {
      id: 'clin_ext_3', category: 'technicalExpertise', type: 'radio',
      text: 'ABC kaydında, davranışın hemen öncesinde (Antecedent) "Yönerge verilmesi" ve hemen sonrasında (Consequence) "Çocuğun masadan kalkması" varsa, davranışın muhtemel işlevi nedir?',
      weightedOptions: [
        { label: 'Dikkat çekme (Attention).', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış analiz.' },
        { label: 'Kaçma/Kaçınma (Escape/Avoidance).', weights: { clinical: 1.0 }, analysisInsight: 'Fonksiyonel analiz yetkinliği.' },
        { label: 'Duyusal uyaran elde etme (Sensory).', weights: { clinical: 0.3 }, analysisInsight: 'Eksik veri.' },
        { label: 'Nesne elde etme (Tangible).', weights: { clinical: 0.1 }, analysisInsight: 'Bağlam hatası.' }
      ]
    },
    {
      id: 'clin_ext_4', category: 'technicalExpertise', type: 'radio',
      text: 'Duyusal Regülasyon bozukluğu (Meltdown) ile Davranışsal Öfke Nöbeti (Tantrum) arasındaki kritik fark nedir?',
      weightedOptions: [
        { label: 'Tantrumda çocuk bir amaç (nesne/ilgi) güder ve seyirciye bakar; Meltdown nörolojik bir aşırı yüklenmedir ve amaçsızdır.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik ayrım uzmanlığı.' },
        { label: 'Meltdown daha kısa sürer.', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış bilgi.' },
        { label: 'İkisi de aynı şeydir, sadece isimleri farklıdır.', weights: { clinical: 0.0 }, analysisInsight: 'Temel bilgi eksikliği.' },
        { label: 'Tantrum sadece evde olur.', weights: { clinical: 0.1 }, analysisInsight: 'Genelleme hatası.' }
      ]
    },
    {
      id: 'clin_ext_5', category: 'technicalExpertise', type: 'radio',
      text: 'Şekil Verme (Shaping) tekniği uygulanırken "Ardışık Yaklaşıklıklar" (Successive Approximations) nasıl pekiştirilmelidir?',
      weightedOptions: [
        { label: 'Sadece en son, mükemmel davranış pekiştirilir.', weights: { clinical: 0.3 }, analysisInsight: 'Süreç hatası.' },
        { label: 'Her aşama pekiştirilir ve bir önceki aşama sönmeye bırakılarak davranış hedefe yaklaştırılır.', weights: { clinical: 1.0 }, analysisInsight: 'Davranış mühendisliği.' },
        { label: 'Çocuk yorulmasın diye sürekli yardım edilir.', weights: { clinical: 0.1 }, analysisInsight: 'İpucu bağımlılığı.' },
        { label: 'Rastgele pekiştirme yapılır.', weights: { clinical: 0.0 }, analysisInsight: 'Verisiz işlem.' }
      ]
    },
    // ... [PEDAGOJİK ALTYAPI - YENİ SORULAR - PART 2] ...
    {
      id: 'ped_ext_1', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Vygotsky\'nin "Yakınsal Gelişim Alanı" (Zone of Proximal Development) kavramı özel eğitimde nasıl uygulanır?',
      weightedOptions: [
        { label: 'Çocuğun tek başına yapabildiği becerileri tekrar ettirerek.', weights: { clinical: 0.2 }, analysisInsight: 'Gelişim duraklaması.' },
        { label: 'Çocuğun henüz yapamadığı ama destekle yapabileceği becerilere "İskele" (Scaffolding) kurarak.', weights: { clinical: 1.0 }, analysisInsight: 'Pedagojik derinlik.' },
        { label: 'Çocuğun yaşının çok üzerindeki hedefleri çalışarak.', weights: { clinical: 0.1 }, analysisInsight: 'Frustrasyon riski.' },
        { label: 'Sınıfın ortalamasına göre ders anlatarak.', weights: { clinical: 0.0 }, analysisInsight: 'Bireysellik ihlali.' }
      ]
    },
    {
      id: 'ped_ext_2', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Grupta farklı seviyelerde (heterojen) öğrenciler varsa "Farklılaştırılmış Öğretim" (Differentiated Instruction) nasıl kurgulanır?',
      weightedOptions: [
        { label: 'Herkes aynı etkinliği yapar, hızlı bitiren bekler.', weights: { clinical: 0.1 }, analysisInsight: 'Geleneksel hata.' },
        { label: 'Zayıf öğrencilere daha kolay sorular, ileri öğrencilere zenginleştirilmiş materyaller sunarak süreç ve ürün farklılaştırılır.', weights: { clinical: 1.0 }, analysisInsight: 'Modern pedagoji.' },
        { label: 'Sınıf ikiye bölünür, sadece iyilerle ders işlenir.', weights: { ethics: -1.0, clinical: 0.0 }, analysisInsight: 'Etik ihlal.' },
        { label: 'Veliye özel ders alması söylenir.', weights: { clinical: 0.2 }, analysisInsight: 'Sorumluluk devri.' }
      ]
    },
    {
      id: 'ped_ext_3', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Soyut kavramların öğretiminde "Somut-Yarı Somut-Soyut" (CRA) döngüsü neden atlanmamalıdır?',
      weightedOptions: [
        { label: 'Çünkü çocuklar oyuncakları sever.', weights: { clinical: 0.2 }, analysisInsight: 'Yüzeysel yorum.' },
        { label: 'Nöral bağlantıların kalıcı olması ve kavramın içselleştirilmesi için fiziksel manipülasyon şarttır.', weights: { clinical: 1.0 }, analysisInsight: 'Bilişsel gelişim uzmanlığı.' },
        { label: 'Materyal kullanmak zaman kaybıdır, direkt karta geçilmelidir.', weights: { clinical: 0.0 }, analysisInsight: 'Ezberci yaklaşım.' },
        { label: 'Veliler materyal görünce mutlu olur.', weights: { clinical: 0.1 }, analysisInsight: 'Maskeleme.' }
      ]
    },
    {
      id: 'ped_ext_4', category: 'pedagogicalAnalysis', type: 'radio',
      text: '"Aktif Katılım" (Active Responding) oranı düşük olan bir derste öğrenme hızı neden düşer?',
      weightedOptions: [
        { label: 'Çocuk sıkıldığı için.', weights: { clinical: 0.3 }, analysisInsight: 'Basit açıklama.' },
        { label: 'Öğrenme nöral yolların ateşlenmesiyle olur; pasif dinleme sinaptik bağlantı kurmaz.', weights: { clinical: 1.0 }, analysisInsight: 'Nöro-pedagoji.' },
        { label: 'Öğretmen çok konuştuğu için.', weights: { clinical: 0.4 }, analysisInsight: 'Kısmen doğru ama eksik.' },
        { label: 'Sınıf çok sıcak olduğu için.', weights: { clinical: 0.1 }, analysisInsight: 'Çevresel bahane.' }
      ]
    },
    {
      id: 'ped_ext_5', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'İçsel Motivasyon (Intrinsic) oluşturmak için "Dışsal Ödüller" (Extrinsic) nasıl yönetilmelidir?',
      weightedOptions: [
        { label: 'Sürekli şeker/çikolata verilmeli.', weights: { clinical: 0.1 }, analysisInsight: 'Bağımlılık riski.' },
        { label: 'Ödüller zamanla sosyal onaya ve başarma hissine dönüştürülerek (silikleştirilerek) içselleştirilmelidir.', weights: { clinical: 1.0 }, analysisInsight: 'Motivasyon yönetimi.' },
        { label: 'Hiç ödül verilmemeli, çocuk kendi öğrenmeli.', weights: { clinical: 0.2 }, analysisInsight: 'Gerçekçi olmayan beklenti.' },
        { label: 'Sadece veli ödül vermeli.', weights: { clinical: 0.0 }, analysisInsight: 'Rol karmaşası.' }
      ]
    }
  ],

  // --- KATMAN 2: ETİK VE VELİ YÖNETİMİ (+10 YENİ SORU) ---
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
    // ... [İŞ ETİĞİ & SINIR - YENİ SORULAR] ...
    {
      id: 'eth_ext_1', category: 'workEthics', type: 'radio',
      text: 'Bir veli sizi akşam yemeğine ailesiyle tanışmak üzere ısrarla davet ediyor. Yanıtınız?',
      weightedOptions: [
        { label: 'Kırmamak için kabul ederim.', weights: { ethics: 0.2 }, analysisInsight: 'Profesyonel sınır ihlali.' },
        { label: 'Nazikçe teşekkür eder, kurum politikası ve terapötik sınır gereği dışarıda görüşemeyeceğimizi belirtirim.', weights: { ethics: 1.0 }, analysisInsight: 'Sınır koruma.' },
        { label: 'Müdürden izin alıp giderim.', weights: { ethics: 0.5 }, analysisInsight: 'Sorumluluk devri.' },
        { label: 'Sadece kahve içmeye giderim.', weights: { ethics: 0.3 }, analysisInsight: 'Gri alan riski.' }
      ]
    },
    {
      id: 'eth_ext_2', category: 'workEthics', type: 'radio',
      text: 'Öğretmenler odasında bir meslektaşınızın, bir velinin özel hayatı hakkında dedikodu yaptığını duydunuz. Tepkiniz?',
      weightedOptions: [
        { label: 'Dinlerim ama yorum yapmam.', weights: { ethics: 0.4 }, analysisInsight: 'Pasif suç ortaklığı.' },
        { label: 'Ben de bildiğim bir şeyi anlatırım.', weights: { ethics: -1.0 }, analysisInsight: 'Aktif ihlal.' },
        { label: 'Konuyu değiştirir veya ortamı terk eder, devam ederse uyarırım.', weights: { ethics: 1.0 }, analysisInsight: 'Etik duruş.' },
        { label: 'Hemen veliye söylerim.', weights: { ethics: 0.2 }, analysisInsight: 'Kaos yaratma.' }
      ]
    },
    {
      id: 'eth_ext_3', category: 'workEthics', type: 'radio',
      text: 'Öğrencinizle çok başarılı bir seans geçirdiniz. Fotoğrafını çekip kişisel Instagram hesabınızda paylaşır mısınız?',
      weightedOptions: [
        { label: 'Evet, veliden sözlü izin alarak paylaşırım.', weights: { ethics: 0.3 }, analysisInsight: 'Yasal risk.' },
        { label: 'Yüzünü emojiyle kapatıp paylaşırım.', weights: { ethics: 0.5 }, analysisInsight: 'Yetersiz önlem.' },
        { label: 'Hayır, KVKK ve çocuk hakları gereği kişisel hesabımdan asla öğrenci paylaşımı yapmam.', weights: { ethics: 1.0 }, analysisInsight: 'Hukuki ve etik bilinç.' },
        { label: 'Sadece "Hikaye" (Story) olarak atarım, 24 saatte silinir.', weights: { ethics: 0.1 }, analysisInsight: 'Etik körlük.' }
      ]
    },
    {
      id: 'eth_ext_4', category: 'workEthics', type: 'radio',
      text: 'Veli, "Acil durumlar için" diyerek şahsi cep telefonu numaranızı ısrarla istiyor. Verir misiniz?',
      weightedOptions: [
        { label: 'Veririm, iletişim önemlidir.', weights: { ethics: 0.2 }, analysisInsight: 'Sınır kaybı.' },
        { label: 'Veririm ama "sadece mesaj atın" derim.', weights: { ethics: 0.4 }, analysisInsight: 'Yönetilemez risk.' },
        { label: 'Kurumsal hattı veya ofis numarasını vererek, iletişimin resmi kanaldan yürümesi gerektiğini belirtirim.', weights: { ethics: 1.0 }, analysisInsight: 'Profesyonel kanal.' },
        { label: 'Numaramı verip sonra engellerim.', weights: { ethics: 0.0 }, analysisInsight: 'Olgunluk dışı.' }
      ]
    },
    {
      id: 'eth_ext_5', category: 'workEthics', type: 'radio',
      text: 'Koridorda bir meslektaşınızın çocuğa bağırdığını ve sertçe kolundan tuttuğunu gördünüz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Görmezden gelirim, herkesin tarzı farklıdır.', weights: { ethics: -1.0 }, analysisInsight: 'İhmal suçu.' },
        { label: 'O an müdahale eder, çocuğu güvenliğe alır ve derhal tutanakla yönetime bildiririm.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Çocuk güvenliği önceliği.' },
        { label: 'Arkadaşımı kenara çeker "dikkat et, biri görür" derim.', weights: { ethics: -0.5 }, analysisInsight: 'Suç ortaklığı.' },
        { label: 'Velisine söylerim.', weights: { ethics: 0.5 }, analysisInsight: 'Prosedür dışı kriz.' }
      ]
    },
    {
      id: 'eth_ext_6', category: 'workEthics', type: 'radio',
      text: 'Veli, seans ücreti haricinde size zarf içinde nakit para (bahşiş) uzatıyor. Tepkiniz?',
      weightedOptions: [
        { label: 'Teşekkür edip alırım.', weights: { ethics: -0.8 }, analysisInsight: 'Etik ihlal.' },
        { label: 'Kızarım ve parayı yere atarım.', weights: { ethics: 0.1 }, analysisInsight: 'Duygusal tepki.' },
        { label: 'Nazikçe ama kesin bir dille meslek etiğine aykırı olduğunu belirtip iade ederim.', weights: { ethics: 1.0 }, analysisInsight: 'Profesyonel onur.' },
        { label: 'Alıp kurum bağış kutusuna atarım.', weights: { ethics: 0.6 }, analysisInsight: 'İnisiyatif (riskli).' }
      ]
    },
    {
      id: 'eth_ext_7', category: 'workEthics', type: 'radio',
      text: 'Boşanmış bir veli (bekar baba/anne) size duygusal ilgi gösteriyor ve kahve içmeye davet ediyor.',
      weightedOptions: [
        { label: 'Kabul ederim, özel hayatımdır.', weights: { ethics: -1.0 }, analysisInsight: 'Dual relationship ihlali.' },
        { label: 'Terapötik ilişkinin zedeleneceğini ve bunun etik olmadığını net bir dille ifade edip mesafe koyarım.', weights: { ethics: 1.0 }, analysisInsight: 'Sınır yönetimi.' },
        { label: 'Görmezden gelip seanslara devam ederim.', weights: { ethics: 0.4 }, analysisInsight: 'Pasif risk.' },
        { label: 'Yönetimden habersiz flört ederim.', weights: { ethics: -2.0 }, analysisInsight: 'Meslekten men sebebi.' }
      ]
    },
    {
      id: 'eth_ext_8', category: 'workEthics', type: 'radio',
      text: 'Veli, kurumun fiziki şartlarını eleştiriyor ve "Sizce de burası çok havasız değil mi?" diye onay istiyor.',
      weightedOptions: [
        { label: '"Evet, maalesef çok kötü" diyerek katılırım.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'Kurum karalama.' },
        { label: '"Bu konuyu yönetimle görüşmeniz daha sağlıklı olur, ben eğitime odaklanıyorum" diyerek topu doğru yere atarım.', weights: { institutionalLoyalty: 1.0, ethics: 0.8 }, analysisInsight: 'Kurumsal duruş.' },
        { label: 'Yalan söyleyip "Burası harika" derim.', weights: { ethics: 0.4 }, analysisInsight: 'Samimiyetsizlik.' },
        { label: '"Başka kurumlara bakın" derim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Sabotaj.' }
      ]
    },
    {
      id: 'eth_ext_9', category: 'workEthics', type: 'radio',
      text: 'Kurumun hazırladığı özgün bir materyal setini fotokopi çekip evdeki arşivinize aldınız. Bu durum nedir?',
      weightedOptions: [
        { label: 'Kendimi geliştirmek içindir, sorun yok.', weights: { ethics: 0.3 }, analysisInsight: 'Fikri mülkiyet bilinci zayıf.' },
        { label: 'Kurumun fikri mülkiyetini izinsiz kopyalamak hırsızlıktır.', weights: { ethics: 1.0 }, analysisInsight: 'Yüksek etik bilinç.' },
        { label: 'Herkes yapıyor.', weights: { ethics: 0.1 }, analysisInsight: 'Toplumsal yozlaşma.' },
        { label: 'Sadece bir kopyadan bir şey olmaz.', weights: { ethics: 0.2 }, analysisInsight: 'Minimalizasyon.' }
      ]
    },
    {
      id: 'eth_ext_10', category: 'workEthics', type: 'radio',
      text: 'Akşam ofisten çıkarken masanızın üzerinde öğrenci dosyalarını açık unuttuğunuzu fark ettiniz. Geri döner misiniz?',
      weightedOptions: [
        { label: 'Hayır, sabah toplarım. Temizlikçi dışında kimse görmez.', weights: { ethics: 0.0 }, analysisInsight: 'Gizlilik ihlali.' },
        { label: 'Evet, üşenmeden döner ve dosyaları kilitli dolaba kaldırırım. (KVKK/Gizlilik)', weights: { ethics: 1.0 }, analysisInsight: 'Sorumluluk bilinci.' },
        { label: 'Sabah erken gidip toplarım.', weights: { ethics: 0.5 }, analysisInsight: 'Risk alma.' },
        { label: 'Önemli değil.', weights: { ethics: -0.5 }, analysisInsight: 'İhmalkarlık.' }
      ]
    }
  ],

  // --- KATMAN 3: RESİLİANS VE TAKIM UYUMU (+10 YENİ SORU) ---
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
    // ... [RESİLİANS - YENİ SORULAR] ...
    {
      id: 'res_ext_1', category: 'sustainability', type: 'radio',
      text: 'Ders sırasında öğrenci aniden size saldırdı ve canınız yandı. İlk tepkiniz?',
      weightedOptions: [
        { label: 'Refleks olarak çocuğu itmek.', weights: { ethics: -1.0, sustainability: 0.0 }, analysisInsight: 'Fiziksel risk.' },
        { label: 'Odayı terk edip ağlamak.', weights: { sustainability: 0.2 }, analysisInsight: 'Duygusal çöküş.' },
        { label: 'Güvenli duruş pozisyonuna geçmek, duygusal nötr kalarak krizi yönetmek ve seans sonrası pansuman yapmak.', weights: { sustainability: 1.0, technicalExpertise: 0.8 }, analysisInsight: 'Profesyonel soğukkanlılık.' },
        { label: 'Veliye bağırarak durumu anlatmak.', weights: { sustainability: 0.1 }, analysisInsight: 'Profesyonellik kaybı.' }
      ]
    },
    {
      id: 'res_ext_2', category: 'sustainability', type: 'radio',
      text: 'Veli telefonda size hakaret vari konuşuyor ve suçluyor. Dayanıklılığınızı nasıl korursunuz?',
      weightedOptions: [
        { label: 'Telefonu yüzüne kapatırım.', weights: { sustainability: 0.3 }, analysisInsight: 'İletişim kopukluğu.' },
        { label: 'Aynı tonda karşılık veririm.', weights: { sustainability: 0.0, ethics: -0.5 }, analysisInsight: 'Ego savaşı.' },
        { label: 'Sakinliğimi koruyarak "Şu an sağlıklı iletişim kuramıyoruz, daha sonra görüşelim" diyerek sınır çizerim.', weights: { sustainability: 1.0 }, analysisInsight: 'Sınır koyma becerisi.' },
        { label: 'Kendimi yetersiz hissedip depresyona girerim.', weights: { sustainability: 0.1 }, analysisInsight: 'Kırılgan özsaygı.' }
      ]
    },
    {
      id: 'res_ext_3', category: 'sustainability', type: 'radio',
      text: 'Aynı gün içinde 8 seans ve 3 raporlama yapmanız gerekiyor. Enerjinizi nasıl yönetirsiniz?',
      weightedOptions: [
        { label: 'Hepsini baştan savma yaparım.', weights: { ethics: -0.5 }, analysisInsight: 'Kalite kaybı.' },
        { label: 'Sürekli kahve içerek ayakta durmaya çalışırım.', weights: { sustainability: 0.4 }, analysisInsight: 'Geçici çözüm.' },
        { label: 'Seans aralarında mikro-molalar vererek nefes egzersizi yapar, raporları gün içine yayarım.', weights: { sustainability: 1.0 }, analysisInsight: 'Enerji yönetimi.' },
        { label: 'Yönetime hasta olduğumu söylerim.', weights: { ethics: -0.8 }, analysisInsight: 'Kaçış.' }
      ]
    },
    {
      id: 'res_ext_4', category: 'sustainability', type: 'radio',
      text: '6 aydır takip ettiğiniz bir öğrencide beklenen ilerleme gerçekleşmedi. Hissettiğiniz duygu?',
      weightedOptions: [
        { label: 'Çaresizlik ve mesleği bırakma isteği.', weights: { sustainability: 0.1 }, analysisInsight: 'Tükenmişlik.' },
        { label: 'Suçu aileye atma rahatlığı.', weights: { ethics: 0.3 }, analysisInsight: 'Dışsallaştırma.' },
        { label: 'Merak ve analiz isteği; "Neyi değiştirmeliyim?" sorusuna odaklanma.', weights: { sustainability: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Gelişim odaklı direnç.' },
        { label: 'Umursamazlık.', weights: { sustainability: 0.0 }, analysisInsight: 'Mesleki körlük.' }
      ]
    },
    {
      id: 'res_ext_5', category: 'sustainability', type: 'radio',
      text: 'Kişisel hayatınızda (boşanma, kayıp vb.) büyük bir kriz varken seansa nasıl girersiniz?',
      weightedOptions: [
        { label: 'Suratım asık girerim, çocuk anlar.', weights: { sustainability: 0.2 }, analysisInsight: 'Profesyonellik ihlali.' },
        { label: 'Veliye durumumu anlatıp anlayış beklerim.', weights: { ethics: 0.4 }, analysisInsight: 'Sınır ihlali.' },
        { label: '"Kapı Eşiği" tekniğiyle kişisel dertlerimi dışarıda bırakır, tamamen çocuğa odaklanırım (Kompartmantalizasyon).', weights: { sustainability: 1.0 }, analysisInsight: 'Duygusal regülasyon.' },
        { label: 'Rapor alıp gelmem.', weights: { sustainability: 0.5 }, analysisInsight: 'Kaçınma (bazen gereklidir ama süreklilik arz etmemeli).' }
      ]
    },
    {
      id: 'res_ext_6', category: 'fit', type: 'radio',
      text: 'Koordinatörünüz sizinle aynı fikirde değil ve uygulamanızı değiştirmenizi istiyor. Tepkiniz?',
      weightedOptions: [
        { label: '"Tamam" deyip bildiğimi okurum.', weights: { fit: -0.5 }, analysisInsight: 'Pasif direniş.' },
        { label: 'Tartışıp istifa ederim.', weights: { sustainability: 0.0 }, analysisInsight: 'Dürtüsel kopuş.' },
        { label: 'Geri bildirimi dinler, mantığını sorgular ve profesyonel gelişimin bir parçası olarak uyum sağlarım.', weights: { fit: 1.0 }, analysisInsight: 'Takım uyumu.' },
        { label: 'Arkadaşlarıma dert yanarım.', weights: { fit: 0.2 }, analysisInsight: 'Dedikodu.' }
      ]
    },
    {
      id: 'res_ext_7', category: 'sustainability', type: 'radio',
      text: '"Merhamet Yorgunluğu" (Compassion Fatigue) belirtileri (sürekli yorgunluk, hissizleşme) hissettiğinizde ne yaparsınız?',
      weightedOptions: [
        { label: 'Daha çok çalışarak unutmaya çalışırım.', weights: { sustainability: 0.2 }, analysisInsight: 'Riskli başa çıkma.' },
        { label: 'Profesyonel destek alır ve öz-bakım (self-care) rutinlerimi artırırım.', weights: { sustainability: 1.0 }, analysisInsight: 'Bilinçli iyileşme.' },
        { label: 'Çocuklara karşı sertleşirim.', weights: { ethics: -1.0 }, analysisInsight: 'Klinik tehlike.' },
        { label: 'İşi bırakırım.', weights: { sustainability: 0.1 }, analysisInsight: 'Pes etme.' }
      ]
    },
    {
      id: 'res_ext_8', category: 'sustainability', type: 'radio',
      text: 'Son dakika program değişikliği oldu ve hazırlıksız olduğunuz zor bir öğrenci size verildi.',
      weightedOptions: [
        { label: 'Panik yapıp itiraz ederim.', weights: { sustainability: 0.2 }, analysisInsight: 'Esneklik yok.' },
        { label: 'Doğaçlama yapar, günü kurtarırım.', weights: { sustainability: 0.5 }, analysisInsight: 'Orta seviye uyum.' },
        { label: 'Hızlıca öğrenci dosyasını (IDP) inceler, temel materyalleri alır ve adaptasyon yeteneğimi kullanırım.', weights: { sustainability: 1.0 }, analysisInsight: 'Bilişsel esneklik.' },
        { label: 'Seansı boş geçiririm.', weights: { ethics: 0.0 }, analysisInsight: 'Etik ihlal.' }
      ]
    },
    {
      id: 'res_ext_9', category: 'fit', type: 'radio',
      text: 'Ekip arkadaşınızın "toksik" ve sürekli negatif konuştuğu bir ortamda nasıl barınırsınız?',
      weightedOptions: [
        { label: 'Ondan etkilenip ben de negatifleşirim.', weights: { fit: 0.2 }, analysisInsight: 'Düşük bağışıklık.' },
        { label: 'Onu dışlar ve küserim.', weights: { fit: 0.3 }, analysisInsight: 'Çocuksu tepki.' },
        { label: 'Mesafemi korur, profesyonel ilişkiyi sürdürür ama duygusal alanıma girmesine izin vermem.', weights: { fit: 1.0 }, analysisInsight: 'Olgunluk.' },
        { label: 'Yönetime ispiyonlarım.', weights: { fit: 0.4 }, analysisInsight: 'Güven kaybı.' }
      ]
    },
    {
      id: 'res_ext_10', category: 'sustainability', type: 'radio',
      text: 'Büyük bir kriz (çocuğun kendine zarar vermesi) sonrası "Adrenalin Çöküşü" (Post-crisis crash) yaşıyorsunuz. Toparlanma stratejiniz?',
      weightedOptions: [
        { label: 'Sigara/kahve ile geçiştiririm.', weights: { sustainability: 0.4 }, analysisInsight: 'Kısa vadeli çözüm.' },
        { label: 'Olayı zihnimde sürekli tekrar yaşarım (Rumination).', weights: { sustainability: 0.1 }, analysisInsight: 'Travmatizasyon.' },
        { label: 'Debriefing (Olay sonu değerlendirme) yaparak duyguyu boşaltır ve mantıksal zemine oturttuktan sonra devam ederim.', weights: { sustainability: 1.0 }, analysisInsight: 'Profesyonel onarım.' },
        { label: 'Eve gidip uyurum.', weights: { sustainability: 0.3 }, analysisInsight: 'Kaçış.' }
      ]
    }
  ],

  // --- KATMAN 4: VİZYON VE SADAKAT (+20 YENİ SORU: 10 Sadakat + 10 Gelişim) ---
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
    // ... [KURUMSAL SADAKAT - YENİ SORULAR] ...
    {
      id: 'loy_ext_1', category: 'institutionalLoyalty', type: 'radio',
      text: 'Rakip bir kurumdan %20 daha yüksek maaş teklifi aldınız. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Hemen kabul eder, istifa ederim.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Parasal odak.' },
        { label: 'Mevcut kurumumla görüşür, kariyer hedeflerim ve huzurumla birlikte maddi şartları teraziye koyarım.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Dengeli sadakat.' },
        { label: 'Teklifi mevcut kuruma şantaj olarak kullanırım.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'Manipülatif.' },
        { label: 'Reddederim, para önemli değil.', weights: { institutionalLoyalty: 0.8 }, analysisInsight: 'Fazla idealist (Gerçekçi değil).' }
      ]
    },
    {
      id: 'loy_ext_2', category: 'institutionalLoyalty', type: 'radio',
      text: 'Sosyal bir ortamda kurumunuz hakkında asılsız ve kötüleyici konuşulduğuna şahit oldunuz.',
      weightedOptions: [
        { label: 'Sessiz kalırım, bulaşmam.', weights: { institutionalLoyalty: 0.3 }, analysisInsight: 'Pasiflik.' },
        { label: 'Ben de bir iki eleştiri eklerim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'İhanet.' },
        { label: 'Kurumun itibarını profesyonelce savunur ve yanlış bilgiyi düzeltirim.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Marka elçisi.' },
        { label: 'Kavga çıkarırım.', weights: { institutionalLoyalty: 0.5, fit: -0.5 }, analysisInsight: 'Agresif savunma.' }
      ]
    },
    {
      id: 'loy_ext_3', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurum tasarruf tedbirleri kapsamında bazı pahalı materyalleri almanızı kısıtladı. Tepkiniz?',
      weightedOptions: [
        { label: 'Eğitim bitti, böyle çalışılmaz derim.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Yıkıcı eleştiri.' },
        { label: 'Mevcut materyallerle yaratıcı çözümler üretir (DIY) ve kurumsal kaynakları verimli kullanırım.', weights: { institutionalLoyalty: 1.0, sustainability: 1.0 }, analysisInsight: 'Kaynak yönetimi.' },
        { label: 'Veliye materyalleri aldırmaya çalışırım.', weights: { ethics: -0.5 }, analysisInsight: 'Etik ihlal.' },
        { label: 'Gizlice kendim alıp faturasını kuruma kesmeye çalışırım.', weights: { ethics: -1.0 }, analysisInsight: 'Dolandırıcılık.' }
      ]
    },
    {
      id: 'loy_ext_4', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurum içinde yayılan ve motivasyonu düşüren bir dedikodu zinciri (Rumor Mill) var. Duruşunuz?',
      weightedOptions: [
        { label: 'Merak edip dinlerim.', weights: { institutionalLoyalty: 0.4 }, analysisInsight: 'Pasif katılım.' },
        { label: 'Zinciri kırarım; dedikoduya dahil olmaz ve gerekirse pozitif gündem yaratırım.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Kültür koruyucusu.' },
        { label: 'Kaynağı bulup kavga ederim.', weights: { fit: -0.5 }, analysisInsight: 'Çatışma.' },
        { label: 'Dedikoduyu ben yayarım.', weights: { institutionalLoyalty: -2.0 }, analysisInsight: 'Toksik eleman.' }
      ]
    },
    {
      id: 'loy_ext_5', category: 'institutionalLoyalty', type: 'radio',
      text: 'Hafta sonu kurumun düzenlediği gönüllü bir etkinliğe (Piknik/Kermes) katılım durumunuz?',
      weightedOptions: [
        { label: 'Asla gelmem, hafta sonu benimdir.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Sadece iş odaklı.' },
        { label: 'Ekip ruhunu desteklemek için katılır ve aktif rol alırım.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Takım oyuncusu.' },
        { label: 'Zorla gelirim, kenarda otururum.', weights: { institutionalLoyalty: 0.4 }, analysisInsight: 'Gönülsüz uyum.' },
        { label: 'Ekstra ücret isterim.', weights: { institutionalLoyalty: 0.3 }, analysisInsight: 'Ticari bakış.' }
      ]
    },
    {
      id: 'loy_ext_6', category: 'institutionalLoyalty', type: 'radio',
      text: 'Yeni başlayan tecrübesiz bir öğretmene mentorluk yapmanız istendi (Ek ücret yok).',
      weightedOptions: [
        { label: 'Kabul etmem, benim işim değil.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Bencillik.' },
        { label: 'Kabul ederim ama baştan savma yaparım.', weights: { institutionalLoyalty: 0.4 }, analysisInsight: 'Kalite riski.' },
        { label: 'Kurumun kalitesinin artması için bilgimi cömertçe paylaşır ve bundan gurur duyarım.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Liderlik potansiyeli.' },
        { label: 'Ona yanlış şeyler öğretirim.', weights: { ethics: -2.0 }, analysisInsight: 'Sabotaj.' }
      ]
    },
    {
      id: 'loy_ext_7', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kişisel kariyer hedeflerinizle kurumun hedefleri ne kadar örtüşüyor?',
      weightedOptions: [
        { label: 'Örtüşmüyor, burası geçici bir durak.', weights: { institutionalLoyalty: 0.1 }, analysisInsight: 'Kısa vadeli.' },
        { label: 'Kurum büyüdükçe ben de büyümek istiyorum, vizyonumuz ortak.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Stratejik ortaklık.' },
        { label: 'Sadece maaşımı almak istiyorum.', weights: { institutionalLoyalty: 0.5 }, analysisInsight: 'Memur zihniyeti.' },
        { label: 'Kurumun hedeflerini bilmiyorum.', weights: { institutionalLoyalty: 0.3 }, analysisInsight: 'İlgisizlik.' }
      ]
    },
    {
      id: 'loy_ext_8', category: 'institutionalLoyalty', type: 'radio',
      text: 'Yönetim ani bir kararla "Kıyafet Yönetmeliği"ni değiştirdi ve daha resmi olmanızı istedi.',
      weightedOptions: [
        { label: 'İtiraz eder, giymem.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Uyumsuzluk.' },
        { label: 'Kurumsal imajın bir parçası olduğu için uyum sağlarım.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Profesyonellik.' },
        { label: 'Arkadan söylenerek giyerim.', weights: { institutionalLoyalty: 0.5 }, analysisInsight: 'Pasif agresyon.' },
        { label: 'Eski kıyafetlerle gelip "unuttum" derim.', weights: { institutionalLoyalty: 0.3 }, analysisInsight: 'Çocuksu direnç.' }
      ]
    },
    {
      id: 'loy_ext_9', category: 'institutionalLoyalty', type: 'radio',
      text: 'Koridorda yerde bir çöp gördünüz ama temizlik görevlisi ortada yok.',
      weightedOptions: [
        { label: 'Benim işim değil, basıp geçerim.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Sahiplenmeme.' },
        { label: 'Temizlikçiyi arayıp azarlarım.', weights: { fit: 0.3 }, analysisInsight: 'Kibir.' },
        { label: 'Eğilip alırım; burası benim evim gibidir.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek aidiyet.' },
        { label: 'Görevliye haber veririm.', weights: { institutionalLoyalty: 0.7 }, analysisInsight: 'Standart prosedür.' }
      ]
    },
    {
      id: 'loy_ext_10', category: 'institutionalLoyalty', type: 'radio',
      text: 'Gelecek 5 yıl içinde kendinizi bu kurumda nerede görüyorsunuz?',
      weightedOptions: [
        { label: 'Burada olacağımı sanmıyorum.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Ayrılık sinyali.' },
        { label: 'Birim koordinatörü veya eğitim direktörü olarak.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Kariyer hedefi.' },
        { label: 'Aynı pozisyonda, düzenim bozulmadan.', weights: { institutionalLoyalty: 0.6 }, analysisInsight: 'Stabilite.' },
        { label: 'Kendi yerimi açmış olarak.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Rakip.' }
      ]
    },
    // ... [GELİŞİME AÇIKLIK - YENİ SORULAR] ...
    {
      id: 'dev_ext_1', category: 'developmentOpenness', type: 'radio',
      text: 'En son ne zaman alanınızla ilgili akademik bir makale okudunuz?',
      weightedOptions: [
        { label: 'Üniversitede okumuştum.', weights: { developmentOpenness: 0.1 }, analysisInsight: 'Bilgi eskimesi.' },
        { label: 'Geçen ay, güncel bir araştırma üzerine inceleme yaptım.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Akademik takip.' },
        { label: 'Instagram\'dan takip ediyorum, o yeterli.', weights: { developmentOpenness: 0.3 }, analysisInsight: 'Popüler bilim yüzeyselliği.' },
        { label: 'Vaktim yok.', weights: { developmentOpenness: 0.0 }, analysisInsight: 'Gelişime kapalılık.' }
      ]
    },
    {
      id: 'dev_ext_2', category: 'developmentOpenness', type: 'radio',
      text: 'Hiç bilmediğiniz bir konuda (örn: Odyoloji) bir öğrenci geldi. Ne yaparsınız?',
      weightedOptions: [
        { label: '"Ben bakamam" deyip reddederim.', weights: { developmentOpenness: 0.2 }, analysisInsight: 'Konfor alanı.' },
        { label: 'Biliyormuş gibi yaparım.', weights: { ethics: -1.0 }, analysisInsight: 'Tehlikeli özgüven.' },
        { label: 'Dürüstçe bilmediğimi belirtir, süpervizyon ve eğitim talep ederek öğrenmeye başlarım.', weights: { developmentOpenness: 1.0, ethics: 1.0 }, analysisInsight: 'Öğrenme iştahı.' },
        { label: 'İnternetten bakıp bir şeyler denerim.', weights: { developmentOpenness: 0.5 }, analysisInsight: 'Riskli deneme.' }
      ]
    },
    {
      id: 'dev_ext_3', category: 'developmentOpenness', type: 'radio',
      text: 'Yapay Zeka (AI) teknolojilerinin özel eğitimde kullanımı hakkında ne düşünüyorsunuz?',
      weightedOptions: [
        { label: 'Gereksiz icatlar, insan yerini tutmaz.', weights: { developmentOpenness: 0.2 }, analysisInsight: 'Teknofobi/Direnç.' },
        { label: 'Veri analizi ve materyal üretiminde büyük bir yardımcıdır, kullanmayı öğreniyorum.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Vizyoner bakış.' },
        { label: 'Sadece ödev yaptırmak için kullanırım.', weights: { developmentOpenness: 0.4 }, analysisInsight: 'Kısıtlı vizyon.' },
        { label: 'Hiç duymadım.', weights: { developmentOpenness: 0.1 }, analysisInsight: 'Çağ dışı.' }
      ]
    },
    {
      id: 'dev_ext_4', category: 'developmentOpenness', type: 'radio',
      text: 'Bir eğitim seminerine "Hafta sonu" gitmeniz önerildi (Ücreti kurum karşılıyor).',
      weightedOptions: [
        { label: 'Hafta sonumu feda edemem.', weights: { developmentOpenness: 0.2 }, analysisInsight: 'Düşük motivasyon.' },
        { label: 'Büyük bir hevesle giderim, öğrenmek dinlenmekten değerlidir.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Yüksek motivasyon.' },
        { label: 'Mesai ücreti verilirse giderim.', weights: { developmentOpenness: 0.5 }, analysisInsight: 'Ticari bakış.' },
        { label: 'Giderim ama erken çıkarım.', weights: { developmentOpenness: 0.3 }, analysisInsight: 'Yarım gönüllülük.' }
      ]
    },
    {
      id: 'dev_ext_5', category: 'developmentOpenness', type: 'radio',
      text: 'Kullandığınız bir öğretim yönteminin artık "bilimsel geçerliliği olmadığı" kanıtlandı. Tepkiniz?',
      weightedOptions: [
        { label: '"Ben yıllardır böyle yapıyorum, işe yarıyor" derim.', weights: { developmentOpenness: 0.0 }, analysisInsight: 'Dogmatik direnç.' },
        { label: 'Hemen terk eder ve kanıta dayalı yeni yöntemi öğrenirim.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Bilimsel sadakat.' },
        { label: 'Gizlice eski yöntemi kullanmaya devam ederim.', weights: { ethics: -0.8 }, analysisInsight: 'Etik ihlal.' },
        { label: 'Moralim bozulur.', weights: { developmentOpenness: 0.4 }, analysisInsight: 'Duygusal tepki.' }
      ]
    },
    {
      id: 'dev_ext_6', category: 'developmentOpenness', type: 'radio',
      text: 'Kendi seans videonuzu izleyip analiz etmeniz (Video Modeling) istendi.',
      weightedOptions: [
        { label: 'Utanırım, izleyemem.', weights: { developmentOpenness: 0.3 }, analysisInsight: 'Özgüven eksikliği.' },
        { label: 'Hatalarımı görmek istemem.', weights: { developmentOpenness: 0.1 }, analysisInsight: 'Ego koruması.' },
        { label: 'Harika bir fırsat; dış gözle kendimi eleştirir ve düzeltirim.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Öz-denetim.' },
        { label: 'Sadece iyi kısımları izlerim.', weights: { developmentOpenness: 0.4 }, analysisInsight: 'Filtreli bakış.' }
      ]
    },
    {
      id: 'dev_ext_7', category: 'developmentOpenness', type: 'radio',
      text: 'Farklı bir branştan (örn: Fizyoterapist) arkadaşınız size bir teknik öğretmek istiyor.',
      weightedOptions: [
        { label: '"Benim alanım değil" derim.', weights: { developmentOpenness: 0.2 }, analysisInsight: 'Silo mentalitesi.' },
        { label: 'İlgiyle öğrenirim; transdisipliner çalışmak vizyonumu açar.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Bütüncül bakış.' },
        { label: 'Dinler gibi yaparım.', weights: { developmentOpenness: 0.3 }, analysisInsight: 'Saygısızlık.' },
        { label: 'Ona kendi işine bakmasını söylerim.', weights: { fit: -0.5 }, analysisInsight: 'Çatışma.' }
      ]
    },
    {
      id: 'dev_ext_8', category: 'developmentOpenness', type: 'radio',
      text: 'Yıl sonunda kendinize bir "Beceri Karnesi" çıkarsanız ne dersiniz?',
      weightedOptions: [
        { label: '"Mükemmelim, eksiğim yok."', weights: { developmentOpenness: 0.1 }, analysisInsight: 'Dunning-Kruger etkisi.' },
        { label: '"Hala öğrenmem gereken çok şey var."', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Büyüme zihniyeti (Growth Mindset).' },
        { label: '"Yeterince iyiyim."', weights: { developmentOpenness: 0.5 }, analysisInsight: 'Ortalama tuzağı.' },
        { label: '"Çok kötüyüm."', weights: { developmentOpenness: 0.3 }, analysisInsight: 'Aşırı öz-eleştiri.' }
      ]
    },
    {
      id: 'dev_ext_9', category: 'developmentOpenness', type: 'radio',
      text: 'Kurumda İngilizce makale çeviri saati başlatıldı. İngilizceniz zayıfsa ne yaparsınız?',
      weightedOptions: [
        { label: 'Katılmam.', weights: { developmentOpenness: 0.1 }, analysisInsight: 'Kaçış.' },
        { label: 'Çeviri araçlarını kullanarak çabalar ve dilimi geliştirmeye çalışırım.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Çaba ve azim.' },
        { label: 'Türkçe kaynaklar yetmiyor mu diye sorarım.', weights: { developmentOpenness: 0.2 }, analysisInsight: 'Vizyonsuzluk.' },
        { label: 'Başkasına çevirtirim.', weights: { ethics: -0.5 }, analysisInsight: 'Hile.' }
      ]
    },
    {
      id: 'dev_ext_10', category: 'developmentOpenness', type: 'radio',
      text: 'Bir uzmanlık sertifikası (örn: DIR Floortime 201) almanız için maaşınızdan kesinti yapılacak ama kariyeriniz parlayacak.',
      weightedOptions: [
        { label: 'Kabul etmem, eğitim bedava olmalı.', weights: { developmentOpenness: 0.3 }, analysisInsight: 'Beklentili tutum.' },
        { label: 'Kabul ederim; bu bir harcama değil, kendime yatırımdır.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Yatırımcı zihniyeti.' },
        { label: 'Düşünürüm.', weights: { developmentOpenness: 0.5 }, analysisInsight: 'Kararsızlık.' },
        { label: 'Kurum ödemezse gitmem.', weights: { developmentOpenness: 0.4 }, analysisInsight: 'Şartlı gelişim.' }
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
