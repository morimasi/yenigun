
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

// Helper to create common weights
const w = (cat: string, val: number) => ({ [cat]: val });

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'aba_bacb',
    label: 'Applied Behavior Analysis (BACB/QABA)',
    description: 'Uluslararası davranış analizi standartları.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'technicalExpertise', type: 'radio',
        text: 'Bir vaka "Satiation" (Doygunluk) durumundaysa pekiştireç etkinliği nasıl etkilenir?',
        weightedOptions: [
          { label: 'Pekiştirecin motive edici değeri azalır.', weights: { technical: 1.0 }, analysisInsight: 'Temel kavram hakimiyeti.' },
          { label: 'Pekiştireç daha etkili hale gelir.', weights: { technical: 0.1 }, analysisInsight: 'Metodolojik hata.' }
        ]
      },
      {
        id: 'vq_aba_2', category: 'technicalExpertise', type: 'radio',
        text: 'Negatif Pekiştirme (Negative Reinforcement) ile Ceza arasındaki temel fark nedir?',
        weightedOptions: [
          { label: 'Negatif pekiştirme davranışı artırırken, ceza azaltır.', weights: { technical: 1.0 }, analysisInsight: 'Operant koşullanma derinliği.' },
          { label: 'İkisi de davranışı azaltır.', weights: { technical: 0.2 }, analysisInsight: 'Kritik kavram karmaşası.' }
        ]
      },
      {
        id: 'vq_aba_3', category: 'technicalExpertise', type: 'radio',
        text: '"Extinction Burst" (Sönme Patlaması) anında terapistin yapması gereken en doğru hamle nedir?',
        weightedOptions: [
          { label: 'Protokolü bozmadan sönme sürecine devam etmek.', weights: { technical: 1.0, resilience: 0.9 }, analysisInsight: 'Saha uygulama yetkinliği.' },
          { label: 'Çocuğu sakinleştirmek için pekiştireç vermek.', weights: { technical: 0.1, clinical: 0.2 }, analysisInsight: 'Pekiştirme hatası.' }
        ]
      },
      {
        id: 'vq_aba_4', category: 'technicalExpertise', type: 'radio',
        text: 'Ayrımcı Uyaran (Discriminative Stimulus - Sd) tam olarak neyi sinyal eder?',
        weightedOptions: [
          { label: 'Pekiştirecin ulaşılabilir olduğunu.', weights: { technical: 1.0 }, analysisInsight: 'Teknik netlik.' },
          { label: 'Davranışın durması gerektiğini.', weights: { technical: 0.3 }, analysisInsight: 'Yanlış uyaran tanımı.' }
        ]
      },
      {
        id: 'vq_aba_5', category: 'technicalExpertise', type: 'radio',
        text: 'PCDI modellerinde kullanılan "Incidental Teaching" hangi ortamda gerçekleşmelidir?',
        weightedOptions: [
          { label: 'Doğal çevre ve çocuğun ilgi anında.', weights: { technical: 1.0 }, analysisInsight: 'Model sadakati.' },
          { label: 'Masa başında yapılandırılmış seansta.', weights: { technical: 0.4 }, analysisInsight: 'Metot karmaşası.' }
        ]
      }
    ]
  },
  // Diğer sertifikalar benzer şekilde 5'er soruyla beslenebilir...
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    // PEDAGOGICAL ANALYSIS / TEACHER SKILLS (7 Soru)
    {
      id: 'ped_1', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Bireyselleştirilmiş Eğitim Programı (BEP) hazırlarken "İşlevsel Hedef" seçiminde önceliğiniz nedir?',
      weightedOptions: [
        { label: 'Çocuğun günlük yaşam bağımsızlığını en hızlı artıracak beceri.', weights: { pedagogy: 1.0, technical: 0.9 }, analysisInsight: 'Öğrenci merkezli vizyon.' },
        { label: 'Ailenin en çok istediği akademik beceri (Örn: okuma-yazma).', weights: { pedagogy: 0.5, ethics: 0.6 }, analysisInsight: 'Veli odaklı, klinik riskli.' }
      ]
    },
    {
      id: 'ped_2', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Bir beceri öğretiminde "Hata Düzeltme" (Error Correction) prosedürünü ne zaman devreye alırsınız?',
      weightedOptions: [
        { label: 'Hata yapıldığı anda veya hemen sonrasında en az ipucu ile.', weights: { pedagogy: 1.0 }, analysisInsight: 'Hatasız öğrenme prensibi.' },
        { label: 'Çocuk 3 kez üst üste hata yapınca.', weights: { pedagogy: 0.4 }, analysisInsight: 'Gecikmiş müdahale.' }
      ]
    },
    {
      id: 'ped_3', category: 'pedagogicalAnalysis', type: 'radio',
      text: '"Genelleme" (Generalization) sürecini eğitimin hangi aşamasında başlatırsınız?',
      weightedOptions: [
        { label: 'Eğitimin en başından itibaren farklı ortam ve kişilerle.', weights: { pedagogy: 1.0, technical: 1.0 }, analysisInsight: 'Profesyonel uygulama.' },
        { label: 'Beceri masa başında %100 öğrenildikten sonra.', weights: { pedagogy: 0.3 }, analysisInsight: 'Geleneksel, riskli yaklaşım.' }
      ]
    },
    {
      id: 'ped_4', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Grup dersinde bir öğrencinin problem davranışı tüm grubu etkiliyorsa ilk aksiyonunuz ne olur?',
      weightedOptions: [
        { label: 'Grubun geri kalanını meşgul edip öğrenciyi bireysel regüle etmek.', weights: { pedagogy: 1.0, resilience: 0.8 }, analysisInsight: 'Sınıf yönetimi becerisi.' },
        { label: 'Dersi durdurup tüm grubu öğrenciye odaklamak.', weights: { pedagogy: 0.2 }, analysisInsight: 'Yönetim zafiyeti.' }
      ]
    },
    {
      id: 'ped_5', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Pekiştireç tarifelerinde "Değişken Aralıklı" (Variable Ratio) kullanımının temel amacı nedir?',
      weightedOptions: [
        { label: 'Davranışın sönmeye karşı direncini artırmak ve kalıcılık.', weights: { pedagogy: 1.0, technical: 0.9 }, analysisInsight: 'Bilimsel derinlik.' },
        { label: 'Çocuğun sıkılmasını engellemek.', weights: { pedagogy: 0.4 }, analysisInsight: 'Yüzeysel bilgi.' }
      ]
    },
    {
      id: 'ped_6', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'BEP hedeflerine ulaşılamadığında "Veri Analizi" (Data Plotting) size neyi söyler?',
      weightedOptions: [
        { label: 'Öğretim yönteminin veya ipucu hiyerarşisinin değişmesi gerektiğini.', weights: { pedagogy: 1.0, technical: 1.0 }, analysisInsight: 'Veri okuryazarlığı.' },
        { label: 'Çocuğun o günkü modunun düşük olduğunu.', weights: { pedagogy: 0.2 }, analysisInsight: 'Sorumluluktan kaçınma.' }
      ]
    },
    {
      id: 'ped_7', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Kaynaştırma/Bütünleştirme öğrencisi için sınıf öğretmenine vereceğiniz en kritik destek nedir?',
      weightedOptions: [
        { label: 'Müfredat uyarlaması ve davranışsal destek planı sunmak.', weights: { pedagogy: 1.0, institutionalLoyalty: 0.9 }, analysisInsight: 'Liderlik ve rehberlik.' },
        { label: 'Çocuğun tüm ders boyunca sessiz kalmasını sağlamak.', weights: { pedagogy: 0.1 }, analysisInsight: 'Yanlış eğitim felsefesi.' }
      ]
    },

    // TECHNICAL EXPERTISE (5 Soru)
    {
      id: 'tech_1', category: 'technicalExpertise', type: 'radio',
      text: '"Prompt Fading" (İpucu Silikleştirme) yapılmamasının en büyük klinik riski nedir?',
      weightedOptions: [
        { label: 'İpucu bağımlılığı ve bağımsız beceri kazanamama.', weights: { technical: 1.0 }, analysisInsight: 'Klinik öngörü.' },
        { label: 'Çocuğun dersten sıkılması.', weights: { technical: 0.3 }, analysisInsight: 'Yanlış teşhis.' }
      ]
    },
    {
        id: 'tech_2', category: 'technicalExpertise', type: 'radio',
        text: 'İşlevsel Davranış Analizinde (FBA) "Kaçma" (Escape) fonksiyonu olan bir davranışa "Mola" (Time-out) vermek neden yanlıştır?',
        weightedOptions: [
          { label: 'Davranışı yanlışlıkla pekiştirdiği için.', weights: { technical: 1.0, pedagogy: 0.9 }, analysisInsight: 'Analitik muhakeme.' },
          { label: 'Çocuğu üzeceği için.', weights: { technical: 0.1 }, analysisInsight: 'Duygusal/Amatör yaklaşım.' }
        ]
    },
    { id: 'tech_3', category: 'technicalExpertise', type: 'radio', text: 'ABC kaydında "A" (Antecedent) tam olarak neyi kapsar?', weightedOptions: [{ label: 'Davranıştan hemen önceki çevresel olayları.', weights: { technical: 1.0 }, analysisInsight: 'Teknik bilgi.' }, { label: 'Çocuğun sabah ne yediğini.', weights: { technical: 0.2 }, analysisInsight: 'Eksik bilgi.' }] },
    { id: 'tech_4', category: 'technicalExpertise', type: 'radio', text: 'Sembol Pekiştirme (Token Economy) sisteminde en önemli kural nedir?', weightedOptions: [{ label: 'Sembollerin hemen ardından yedek pekiştirece erişim hızı.', weights: { technical: 1.0 }, analysisInsight: 'Uygulama becerisi.' }, { label: 'Sembollerin çok güzel görünmesi.', weights: { technical: 0.1 }, analysisInsight: 'Yüzeysel tutum.' }] },
    { id: 'tech_5', category: 'technicalExpertise', type: 'radio', text: 'Şekil Verme (Shaping) ile Zincirleme (Chaining) arasındaki fark nedir?', weightedOptions: [{ label: 'Shaping yeni bir davranış formu üretir, Chaining var olanları birleştirir.', weights: { technical: 1.0 }, analysisInsight: 'Ordinaryus seviyesi teknik ayrım.' }, { label: 'İkisi de aynı şeydir.', weights: { technical: 0.0 }, analysisInsight: 'Cahil cesareti.' }] }
  ],
  ethics_parent: [
    // WORK ETHICS (5 Soru)
    {
        id: 'eth_1', category: 'workEthics', type: 'radio',
        text: 'Veli size seans dışında "özel ders" teklif ettiğinde kurumsal duruşunuz ne olur?',
        weightedOptions: [
          { label: 'Reddedip kurumun etik ilkelerini ve mülkiyet haklarını hatılatırım.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek kurumsal aidiyet.' },
          { label: 'Kurumun haberi olmayacaksa kabul edebilirim.', weights: { ethics: 0.0, institutionalLoyalty: 0.0 }, analysisInsight: 'Kritik güven ihlali.' }
        ]
    },
    { id: 'eth_2', category: 'workEthics', type: 'radio', text: 'İş arkadaşınızın öğrenciye kaba davrandığını gördünüz. İlk adımınız nedir?', weightedOptions: [{ label: 'Durumu derhal bir üst amire raporlarım.', weights: { ethics: 1.0, formality: 1.0 }, analysisInsight: 'Profesyonel dürüstlük.' }, { label: 'Görmezden gelirim, aram bozulmasın.', weights: { ethics: 0.1 }, analysisInsight: 'Etik zafiyet.' }] },
    { id: 'eth_3', category: 'workEthics', type: 'radio', text: 'Kurumdan ayrılan bir arkadaşınızın öğrencilerini beraberinde götürme teklifine ne dersiniz?', weightedOptions: [{ label: 'Kesinlikle reddeder ve yönetimi uyarırım.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal koruma.' }, { label: 'Öğrenci için iyiyse desteklerim.', weights: { ethics: 0.3 }, analysisInsight: 'Sadakat sorunu.' }] },
    { id: 'eth_4', category: 'workEthics', type: 'radio', text: 'Veli, sosyal medyada kurum aleyhine yalan bir paylaşım yaptı. Tepkiniz ne olur?', weightedOptions: [{ label: 'Yorum yapmaz, yönetimi ve hukuk birimini bilgilendiririm.', weights: { ethics: 1.0, formality: 1.0 }, analysisInsight: 'Resmiyet bilinci.' }, { label: 'Tartışmaya girip kurumu savunurum.', weights: { ethics: 0.4, personality: 0.3 }, analysisInsight: 'Duygusal kontrol sorunu.' }] },
    { id: 'eth_5', category: 'workEthics', type: 'radio', text: 'BEP hedeflerinde sahte veri (data fudging) yaparak çocuğu başarılı göstermek hakkında ne düşünürsünüz?', weightedOptions: [{ label: 'Bilimsel bir suçtur ve asla kabul edilemez.', weights: { ethics: 1.0, technical: 1.0 }, analysisInsight: 'Bilimsel namus.' }, { label: 'Veliyi mutlu etmek için bazen gereklidir.', weights: { ethics: 0.0, technical: 0.0 }, analysisInsight: 'Mesleki intihar.' }] },

    // PARENT DYNAMICS (5 Soru)
    {
        id: 'par_1', category: 'parentStudentRelations', type: 'radio',
        text: 'Veli seansın son 10 dakikasında sürekli "çocuğum ne zaman iyileşecek?" diye soruyorsa cevabınız ne olur?',
        weightedOptions: [
          { label: 'Verileri sunarak somut ilerlemeleri ve gerçekçi hedefleri açıklarım.', weights: { parentStudentRelations: 1.0, formality: 0.9 }, analysisInsight: 'Profesyonel sınır yönetimi.' },
          { label: '"Çok yakında düzelecek" diyerek umut veririm.', weights: { parentStudentRelations: 0.2, ethics: 0.3 }, analysisInsight: 'Manipülatif/Gerçek dışı vaat.' }
        ]
    },
    { id: 'par_2', category: 'parentStudentRelations', type: 'radio', text: 'Veli, seans esnasında müdahalenize müdahale ediyorsa ne yaparsınız?', weightedOptions: [{ label: 'Gözlem yapmasını rica edip görüşmeyi seans sonuna bırakırım.', weights: { parentStudentRelations: 1.0, personality: 0.9 }, analysisInsight: 'Süreç yönetimi.' }, { label: 'Sertçe dışarı çıkmasını isterim.', weights: { parentStudentRelations: 0.3 }, analysisInsight: 'Öfke kontrol sorunu.' }] },
    { id: 'par_3', category: 'parentStudentRelations', type: 'radio', text: 'Veli, WhatsApp üzerinden saat 22:00\'de soru sorarsa tepkiniz nedir?', weightedOptions: [{ label: 'Mesai saatleri içinde dönüş yapacağımı bildiren bir sınır çizerim.', weights: { parentStudentRelations: 1.0, formality: 1.0, sustainability: 1.0 }, analysisInsight: 'Burnout koruması.' }, { label: 'Hemen cevap veririm, veli velinimetimizdir.', weights: { parentStudentRelations: 0.4, sustainability: 0.2 }, analysisInsight: 'Sınır ihlali/Tükenmişlik adayı.' }] },
    { id: 'par_4', category: 'parentStudentRelations', type: 'radio', text: 'Veli, alternatif (bilim dışı) bir diyet denemek istediğini söylediğinde?', weightedOptions: [{ label: 'Bilimsel kanıtları sunar ve sorumluluk almayacağımı belirtirim.', weights: { parentStudentRelations: 1.0, technical: 0.9, ethics: 1.0 }, analysisInsight: 'Klinik dürüstlük.' }, { label: '"Deneyin, zararı olmaz" derim.', weights: { parentStudentRelations: 0.1, ethics: 0.1 }, analysisInsight: 'Malpraktis riski.' }] },
    { id: 'par_5', category: 'parentStudentRelations', type: 'radio', text: 'Veli sizinle çok samimi olup özel hayatına dair dertleşmeye başlarsa?', weightedOptions: [{ label: 'Nazikçe klinik odağa geri döner ve profesyonel mesafeyi korurum.', weights: { parentStudentRelations: 1.0, personality: 1.0 }, analysisInsight: 'Profesyonel olgunluk.' }, { label: 'Onunla beraber ağlar ve dertleşirim.', weights: { parentStudentRelations: 0.2, sustainability: 0.3 }, analysisInsight: 'Düşük sınır bilinci.' }] }
  ],
  resilience_team: [
    // RESILIENCE / SUSTAINABILITY (5 Soru)
    { id: 'res_1', category: 'sustainability', type: 'radio', text: 'Arka arkaya 4 seans boyunca ağır problem davranışla çalıştınız. Zihinsel sağlığınızı nasıl korursunuz?', weightedOptions: [{ label: 'Kısa bir nefes egzersizi ve vaka fonksiyonuna odaklanarak nesnel kalırım.', weights: { sustainability: 1.0, personality: 1.0 }, analysisInsight: 'Yüksek regülasyon.' }, { label: 'O günkü seansları erken bitirir veya raporları yazmam.', weights: { sustainability: 0.1, institutionalLoyalty: 0.2 }, analysisInsight: 'Düşük direnç.' }] },
    { id: 'res_2', category: 'sustainability', type: 'radio', text: 'Öğrenci size fiziksel olarak zarar verdiğinde (ısırma/vurma) ilk tepkiniz?', weightedOptions: [{ label: 'Güvenli alanı sağlar ve sakinliğimi koruyarak protokolü uygularım.', weights: { sustainability: 1.0, technical: 0.9 }, analysisInsight: 'Kriz uzmanlığı.' }, { label: 'Ağlayarak seansı terk ederim.', weights: { sustainability: 0.1 }, analysisInsight: 'Alan uygunsuzluğu.' }] },
    { id: 'res_3', category: 'sustainability', type: 'radio', text: 'Maaş ödemelerinde bir gecikme yaşandığında tutumunuz ne olur?', weightedOptions: [{ label: 'İdare ile profesyonelce görüşür ama seans kalitemi bozmam.', weights: { sustainability: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal olgunluk.' }, { label: 'İş yavaşlatırım veya öğrencilere yansıtırım.', weights: { sustainability: 0.0, ethics: 0.0 }, analysisInsight: 'Tehlikeli profil.' }] },
    { id: 'res_4', category: 'sustainability', type: 'radio', text: 'BEP hedefleri 6 aydır ilerlemiyorsa ne hissedersiniz?', weightedOptions: [{ label: 'Kendi yöntemimi sorgular ve süpervizyon talep ederim.', weights: { sustainability: 1.0, development: 1.0 }, analysisInsight: 'Gelişim odaklılık.' }, { label: 'Çocuğun kapasitesinin bu olduğunu düşünürüm.', weights: { sustainability: 0.2, pedagogy: 0.1 }, analysisInsight: 'Tükenmişlik başlangıcı.' }] },
    { id: 'res_5', category: 'sustainability', type: 'radio', text: 'Mesai bittiğinde işinizi kafanızda eve götürür müsünüz?', weightedOptions: [{ label: 'Hayır, profesyonel ayrışma yapar ve kendimi yenilerim.', weights: { sustainability: 1.0, personality: 0.9 }, analysisInsight: 'Sürdürülebilir uzman.' }, { label: 'Sürekli vaka düşünür ve uyuyamam.', weights: { sustainability: 0.4 }, analysisInsight: 'Yüksek burnout riski.' }] },

    // CRITICISM TOLERANCE (5 Soru)
    { id: 'crit_1', category: 'criticismTolerance', type: 'radio', text: 'Süpervizörünüz seans esnasında bir hatanızı tüm ekibin önünde düzeltti. Tepkiniz?', weightedOptions: [{ label: 'Eleştiriyi teknik olarak değerlendirir ve not alırım.', weights: { criticismTolerance: 1.0, development: 1.0 }, analysisInsight: 'Akademik olgunluk.' }, { label: 'Kişisel saldırı olarak görüp kendimi savunurum.', weights: { criticismTolerance: 0.2, personality: 0.3 }, analysisInsight: 'Düşük egoluluk.' }] },
    { id: 'crit_2', category: 'criticismTolerance', type: 'radio', text: 'Veli, seansınızın verimsiz olduğunu iddia ederek şikayetçi oldu. Yaklaşımınız?', weightedOptions: [{ label: 'Veliyle verileri paylaşır ve endişelerini anlamaya çalışırım.', weights: { criticismTolerance: 1.0, parentStudentRelations: 1.0 }, analysisInsight: 'Kriz yönetimi.' }, { label: 'Veliye "siz ne anlarsınız" derim.', weights: { criticismTolerance: 0.0, ethics: 0.0 }, analysisInsight: 'İletişim faciası.' }] },
    { id: 'crit_3', category: 'criticismTolerance', type: 'radio', text: 'Genç bir meslektaşınız sizin bir hatanızı buldu ve uyardı. Ne yaparsınız?', weightedOptions: [{ label: 'Teşekkür eder ve hatayı derhal düzeltirim.', weights: { criticismTolerance: 1.0, institutionalLoyalty: 0.9 }, analysisInsight: 'Liyakat odaklılık.' }, { label: '"Sen kimsin beni uyarıyorsun" derim.', weights: { criticismTolerance: 0.1, personality: 0.1 }, analysisInsight: 'Kibirli profil.' }] },
    { id: 'crit_4', category: 'criticismTolerance', type: 'radio', text: 'Yönetim tarafından "performansınız düşük" uyarısı aldınız. İlk aksiyonunuz?', weightedOptions: [{ label: 'Hangi alanlarda eksik olduğumu sorar ve gelişim planı isterim.', weights: { criticismTolerance: 1.0, development: 1.0 }, analysisInsight: 'Sorumluluk bilinci.' }, { label: 'Derhal istifa ederim.', weights: { criticismTolerance: 0.1, sustainability: 0.1 }, analysisInsight: 'Dürtüsel davranış.' }] },
    { id: 'crit_5', category: 'criticismTolerance', type: 'radio', text: 'Meslektaşlarınız arasında "en zayıf halka" olduğunuz iması yapılırsa?', weightedOptions: [{ label: 'Gelişmek için daha çok çalışır ve yardım isterim.', weights: { criticismTolerance: 1.0, personality: 1.0 }, analysisInsight: 'Yüksek karakter gücü.' }, { label: 'Küser ve ekipten uzaklaşırım.', weights: { criticismTolerance: 0.3 }, analysisInsight: 'Düşük grup uyumu.' }] }
  ],
  vision_loyalty: [
    // INSTITUTIONAL LOYALTY (5 Soru)
    { id: 'loy_1', category: 'institutionalLoyalty', type: 'radio', text: 'Rakip kurumdan %20 daha yüksek maaş teklifi aldınız. Ne yaparsınız?', weightedOptions: [{ label: 'Önce mevcut kurumumla konuşur, aidiyetimi ve projelerimi hatırlarım.', weights: { institutionalLoyalty: 1.0, ethics: 0.9 }, analysisInsight: 'Yüksek sadakat.' }, { label: 'Derhal kabul eder ve istifa ederim.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Fırsatçı yaklaşım.' }] },
    { id: 'loy_2', category: 'institutionalLoyalty', type: 'radio', text: 'Kurumun bir sırrını (Örn: özel bir müfredat) dışarı sızdırmanız karşılığında bir menfaat teklif edildi?', weightedOptions: [{ label: 'Kesinlikle reddeder ve yönetime bildiririm.', weights: { institutionalLoyalty: 1.0, ethics: 1.0 }, analysisInsight: 'Tam dürüstlük.' }, { label: 'Düşünürüm.', weights: { institutionalLoyalty: 0.1 }, analysisInsight: 'Casusluk riski.' }] },
    { id: 'loy_3', category: 'institutionalLoyalty', type: 'radio', text: 'Kurumda işler çok yoğunlaştı ve kriz yaşanıyor. Ekstra mesai teklifine yanıtınız?', weightedOptions: [{ label: 'Kurumu ayağa kaldırmak için gönüllü olurum.', weights: { institutionalLoyalty: 1.0, resilience: 0.9 }, analysisInsight: 'Savaşçı ruh.' }, { label: '"Benim saatim bitti" der çıkarım.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Düşük aidiyet.' }] },
    { id: 'loy_4', category: 'institutionalLoyalty', type: 'radio', text: 'Yönetimin aldığı bir karara (Örn: yeni bir kıyafet kuralı) katılmıyorsunuz. Tutumunuz?', weightedOptions: [{ label: 'Uygun bir dille itirazımı söyler ama kurala uyarım.', weights: { institutionalLoyalty: 1.0, formality: 1.0 }, analysisInsight: 'Kurumsal disiplin.' }, { label: 'Gizlice kuralları delerim.', weights: { institutionalLoyalty: 0.0, ethics: 0.0 }, analysisInsight: 'Pasif-agresif profil.' }] },
    { id: 'loy_5', category: 'institutionalLoyalty', type: 'radio', text: 'Kurumun adının bir skandala (haksız yere) karıştığını duydunuz. Sosyal çevrenize ne dersiniz?', weightedOptions: [{ label: 'Kurumun arkasında durur ve doğruları anlatırım.', weights: { institutionalLoyalty: 1.0, personality: 1.0 }, analysisInsight: 'Marka elçisi.' }, { label: 'Sessiz kalır veya "ben de ayrılmayı düşünüyordum" derim.', weights: { institutionalLoyalty: 0.1 }, analysisInsight: 'Zayıf bağ.' }] },

    // DEVELOPMENT / PERSONALITY (5+5 Soru)
    { id: 'dev_1', category: 'developmentOpenness', type: 'radio', text: 'Yeni bir teknoloji (Örn: Göz takip cihazı) kuruma geldi. Nasıl yaklaşırsınız?', weightedOptions: [{ label: 'Derhal eğitimini ister ve ilk uygulayan olmak isterim.', weights: { development: 1.0 }, analysisInsight: 'Teknoloji dostu.' }, { label: 'Geleneksel yöntemler daha iyi derim.', weights: { development: 0.2 }, analysisInsight: 'Değişim direnci.' }] },
    { id: 'dev_2', category: 'developmentOpenness', type: 'radio', text: 'Yıllık eğitim bütçesi olsa ne öğrenmek isterdiniz?', weightedOptions: [{ label: 'Alanımla ilgili uluslararası bir sertifika.', weights: { development: 1.0 }, analysisInsight: 'Vizyoner.' }, { label: 'Hobi amaçlı bir kurs.', weights: { development: 0.4 }, analysisInsight: 'Kariyer odağı düşük.' }] },
    { id: 'dev_3', category: 'developmentOpenness', type: 'radio', text: 'Kendi seanslarınızı videoya çekip analiz eder misiniz?', weightedOptions: [{ label: 'Evet, hatalarımı görmek için düzenli yaparım.', weights: { development: 1.0, criticismTolerance: 1.0 }, analysisInsight: 'Oto-kritik becerisi.' }, { label: 'Hayır, kendimi izlemekten rahatsız olurum.', weights: { development: 0.3 }, analysisInsight: 'Kendi körlüğü.' }] },
    { id: 'dev_4', category: 'developmentOpenness', type: 'radio', text: 'Bir vakada takıldığınızda kime danışırsınız?', weightedOptions: [{ label: 'Benden daha tecrübeli birine veya literatüre.', weights: { development: 1.0, technical: 0.9 }, analysisInsight: 'Bilimsel alçakgönüllülük.' }, { label: 'Kimseye sormam, kendim çözerim.', weights: { development: 0.1 }, analysisInsight: 'Tehlikeli bireysellik.' }] },
    { id: 'dev_5', category: 'developmentOpenness', type: 'radio', text: 'İş tanımınız dışında bir görev (Örn: bahçedeki bir çocuğa yardım) verildiğinde?', weightedOptions: [{ label: 'Kurum faydası için seve seve yaparım.', weights: { development: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Proaktif.' }, { label: '"Görev tanımımda yok" derim.', weights: { development: 0.1 }, analysisInsight: 'Bürokratik engelci.' }] }
  ]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
