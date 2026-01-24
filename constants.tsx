
import { FormStep, Question, Branch } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Akademik Kimlik', description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    // --- 1. TECHNICAL EXPERTISE (ALAN YETERLİLİĞİ) ---
    {
      id: 'te_1',
      category: 'technicalExpertise',
      text: 'Seans esnasında uyguladığınız metodun o anki vaka için riskli olabileceğine dair bir emare sezdiniz. Literatür bilgisi ile o anki gözleminiz çelişiyor. Kararınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Literatürü baz alır, seansı planlandığı gibi tamamlarım.', weights: { technical: 0.6, clinical: 0.5, resilience: 0.8 }, analysisInsight: 'Kuralcı akademik yaklaşım.' },
        { label: 'Seansı durdurur, risk analizi yapıp metodu modifiye ederim.', weights: { technical: 1.0, clinical: 1.0, development: 0.9 }, analysisInsight: 'Yüksek klinik muhakeme.' }
      ]
    },
    {
      id: 'te_2',
      category: 'technicalExpertise',
      text: 'Yeni bir vaka aldınız ve tanı dosyası ile sizin ilk gözleminiz arasında ciddi bir uçurum var. Nasıl ilerlersiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Tanı dosyasını kabul eder, programı ona göre hazırlarım.', weights: { technical: 0.4, formality: 1.0, clinical: 0.3 }, analysisInsight: 'Düşük inisiyatif, yüksek hiyerarşi uyumu.' },
        { label: 'Kendi değerlendirme araçlarımı kullanır, tanıyı sorgulayan bir rapor hazırlarım.', weights: { technical: 1.0, criticism: 0.8, clinical: 0.9 }, analysisInsight: 'Eleştirel klinik düşünme.' }
      ]
    },
    // --- 2. PEDAGOGICAL ANALYSIS (PEDAGOJİ) ---
    {
      id: 'pa_1',
      category: 'pedagogicalAnalysis',
      text: 'Çocuğun seansta sergilediği problem davranışın (örn: kendine zarar verme) fonksiyonunu belirleyemediniz. Stratejiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Davranışı o an söndürmeye odaklanırım, analizi sonra yaparım.', weights: { pedagogy: 0.5, technical: 0.4, clinical: 0.4 }, analysisInsight: 'Müdahale odaklı, analiz zayıf.' },
        { label: 'ABC (Öncül-Davranış-Sonuç) kaydı tutmaya başlar, süpervizyon talep ederim.', weights: { pedagogy: 1.0, technical: 0.9, development: 1.0 }, analysisInsight: 'Bilimsel metodolojiye bağlılık.' }
      ]
    },
    {
      id: 'pa_2',
      category: 'pedagogicalAnalysis',
      text: 'Öğrencinin motivasyonu tamamen düştüğünde ve seans "oyun" dışına çıkamadığında yaklaşımınız ne olur?',
      type: 'radio',
      weightedOptions: [
        { label: 'Oyunun içine akademik hedefleri gizleyerek süreci yönetirim.', weights: { pedagogy: 1.0, technical: 0.8, clinical: 0.9 }, analysisInsight: 'Yüksek pedagojik esneklik.' },
        { label: 'Çocuğun hazırbulunuşluğu artana kadar seansı serbest oyuna bırakırım.', weights: { pedagogy: 0.4, clinical: 0.2, resilience: 0.3 }, analysisInsight: 'Düşük hedef odaklılık.' }
      ]
    },
    // --- 3. CLINICAL LOGIC (KRİZ) ---
    {
      id: 'cl_1',
      category: 'technicalExpertise',
      text: 'Seans sırasında çocuğun nörolojik bir atak geçirdiğinden şüphelendiniz. Ne yaparsınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Derhal güvenli alanı sağlar ve sağlık personeline haber veririm.', weights: { technical: 1.0, ethics: 1.0, formality: 1.0 }, analysisInsight: 'Kriz anında net önceliklendirme.' },
        { label: 'Atağın bitmesini bekler, sonrasında veliye bilgi veririm.', weights: { technical: 0.2, ethics: 0.1, risk: 1.0 }, analysisInsight: 'Kritik risk yönetim hatası.' }
      ]
    }
  ],
  ethics_parent: [
    // --- 4. WORK ETHICS (İŞ AHLAKI) ---
    {
      id: 'we_1',
      category: 'workEthics',
      text: 'Bir meslektaşınızın etik kuralları esnettiğini (örn: raporlarda manipülasyon) fark ettiniz. İlk adımınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Durumu doğrudan yönetime raporlarım.', weights: { ethics: 1.0, formality: 1.0, loyalty: 0.6 }, analysisInsight: 'Radikal kuralcılık.' },
        { label: 'Önce meslektaşımla konuşur, hatasını fark etmesini sağlarım.', weights: { ethics: 0.7, personality: 1.0, fit: 0.9 }, analysisInsight: 'Yapıcı takım oyuncusu.' }
      ]
    },
    {
      id: 'we_2',
      category: 'workEthics',
      text: 'Kurum dışı bir kaynaktan aday bir veli size ulaştı ve "özel seans" talep etti. Yanıtınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Nazikçe reddeder, kurumsal seans sistemini anlatırım.', weights: { ethics: 1.0, loyalty: 1.0, formality: 1.0 }, analysisInsight: 'Çelik gibi etik sınırlar.' },
        { label: 'Kurumun haberi olmadan, değerlendirme amaçlı bir seans yapabilirim.', weights: { ethics: 0.1, loyalty: 0.1, formality: 0.1 }, analysisInsight: 'Kritik sadakat ve etik ihlali.' }
      ]
    },
    // --- 5. PARENT RELATIONS (VELİ DİNAMİĞİ) ---
    {
      id: 'pr_1',
      category: 'parentStudentRelations',
      text: 'Veli, sosyal medyada sizinle arkadaşlık isteği gönderdi ve oradan çocuğun durumuyla ilgili sorular sormaya başladı.',
      type: 'radio',
      weightedOptions: [
        { label: 'İsteği kabul etmem, iletişim için kurumsal kanalları hatırlatırım.', weights: { parentRelations: 1.0, formality: 1.0, workEthics: 0.9 }, analysisInsight: 'Profesyonel mesafe koruma.' },
        { label: 'Kabul ederim ama sadece genel konularda konuşurum.', weights: { parentRelations: 0.4, formality: 0.5, workEthics: 0.3 }, analysisInsight: 'Sınır aşımı riski.' }
      ]
    },
    {
      id: 'pr_2',
      category: 'parentStudentRelations',
      text: 'Veli, kurumun başka bir uzmanını size kötülüyor ve sizin daha iyi olduğunuzu söylüyor. Tepkiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Meslektaşımı savunur ve ekip olarak çalıştığımızı vurgularım.', weights: { parentRelations: 1.0, personality: 1.0, loyalty: 1.0 }, analysisInsight: 'Yüksek kurumsal aidiyet ve ekip ruhu.' },
        { label: 'Sessiz kalır, sadece kendi çalışmama odaklanırım.', weights: { parentRelations: 0.6, personality: 0.5, loyalty: 0.4 }, analysisInsight: 'Pasif tutum, düşük ekip savunması.' }
      ]
    },
    {
      id: 'pr_3',
      category: 'parentStudentRelations',
      text: 'Veli, çocuğun raporunda bazı iyileşme verilerinin "abartılmasını" istiyor (örn: okul kaydı için).',
      type: 'radio',
      weightedOptions: [
        { label: 'Objektif verileri açıklar, yanıltıcı raporun çocuğa zarar vereceğini belirtirim.', weights: { parentRelations: 1.0, workEthics: 1.0, technical: 0.9 }, analysisInsight: 'Bilimsel dürüstlük.' },
        { label: 'Velinin mağduriyetini anlar, raporda küçük oynamalar yapabilirim.', weights: { parentRelations: 0.2, workEthics: 0.1, technical: 0.3 }, analysisInsight: 'Manipülasyona açık yapı.' }
      ]
    }
  ],
  resilience_team: [
    // --- 6. SUSTAINABILITY (DİRENÇ) ---
    {
      id: 'su_1',
      category: 'sustainability',
      text: 'Ağır vakalarla dolu bir haftada kendinizi tükenmiş hissediyorsunuz. Cumartesi sabahı önemli bir toplantı var. Ne yaparsınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Toplantıya katılır, sonrasında yönetimden bir süpervizyon veya dinlenme talep ederim.', weights: { sustainability: 0.8, formality: 1.0, resilience: 0.9 }, analysisInsight: 'Sorumluluk sahibi stres yönetimi.' },
        { label: 'Sağlık raporu alarak toplantıya katılmaz, hafta sonunu dinlenerek geçiririm.', weights: { sustainability: 1.0, formality: 0.3, loyalty: 0.4 }, analysisInsight: 'Kaçınmacı başa çıkma.' }
      ]
    },
    {
      id: 'su_2',
      category: 'sustainability',
      text: 'Seansta çocuk size fiziksel zarar verdi ve ciddi bir acı hissediyorsunuz. Refleksiniz ne olur?',
      type: 'radio',
      weightedOptions: [
        { label: 'Duygusal nötrlüğümü korur, seans güvenliğini sağlar ve devam ederim.', weights: { sustainability: 1.0, pedagogy: 0.9, resilience: 1.0 }, analysisInsight: 'Yüksek duygusal regülasyon.' },
        { label: 'Çocuğa sesimi yükseltir veya seansı o an bitirip odadan çıkarım.', weights: { sustainability: 0.2, pedagogy: 0.1, resilience: 0.1 }, analysisInsight: 'Düşük stres tavanı.' }
      ]
    },
    // --- 7. FORMALITY (RESMİYET) ---
    {
      id: 'fo_1',
      category: 'formality',
      text: 'Kurumun yeni getirdiği raporlama sistemini çok karmaşık ve gereksiz buldunuz.',
      type: 'radio',
      weightedOptions: [
        { label: 'Sistemi kurallarına göre uygular, iyileştirme önerilerimi resmi kanaldan iletirim.', weights: { formality: 1.0, criticism: 0.9, development: 0.8 }, analysisInsight: 'Olgun kurumsal duruş.' },
        { label: 'Kendi bildiğim eski sistemle devam eder, sadece istendiğinde yeni sisteme geçerim.', weights: { formality: 0.2, loyalty: 0.4, fit: 0.3 }, analysisInsight: 'Hiyerarşi direnci.' }
      ]
    },
    {
      id: 'fo_2',
      category: 'formality',
      text: 'Müdürünüzün verdiği bir talimat, sizin klinik görüşünüze aykırı. Nasıl davranırsınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Görüşümü kanıtlarıyla sunar, ortak bir yol bulunana kadar talimata uyarım.', weights: { formality: 1.0, criticism: 0.8, technical: 0.9 }, analysisInsight: 'Yüksek hiyerarşik zeka.' },
        { label: 'Talimatı görmezden gelir, kendi klinik doğrumu uygularım.', weights: { formality: 0.1, personality: 0.4, fit: 0.2 }, analysisInsight: 'Riskli özerklik eğilimi.' }
      ]
    },
    // --- 8. PERSONALITY (KARAKTER/TAKIM) ---
    {
      id: 'pe_1',
      category: 'personality',
      text: 'Bir ekip toplantısında projeniz sert şekilde eleştirildi. Tepkiniz ne olur?',
      type: 'radio',
      weightedOptions: [
        { label: 'Eleştirileri not alır, projenin eksiklerini düzeltmek için fırsat olarak görürüm.', weights: { personality: 1.0, criticism: 1.0, development: 1.0 }, analysisInsight: 'Gelişime açık karakter.' },
        { label: 'Savunmaya geçer ve eleştirenlerin niyetini sorgularım.', weights: { personality: 0.3, criticism: 0.2, fit: 0.4 }, analysisInsight: 'Defansif yapı.' }
      ]
    }
  ],
  vision_loyalty: [
    // --- 9. DEVELOPMENT (GELİŞİM) ---
    {
      id: 'de_1',
      category: 'developmentOpenness',
      text: 'Kullandığınız metodun artık literatürde eskidiği ve yeni bir metodun daha etkili olduğu kanıtlandı.',
      type: 'radio',
      weightedOptions: [
        { label: 'Hemen yeni metodun eğitimini araştırır ve uygulama planı yaparım.', weights: { development: 1.0, technical: 0.9, sustainability: 0.8 }, analysisInsight: 'Akademik çeviklik.' },
        { label: 'Eski metodun tecrübesine güvenir, yeni metodun yaygınlaşmasını beklerim.', weights: { development: 0.4, technical: 0.5, resilience: 0.6 }, analysisInsight: 'Statükocu yaklaşım.' }
      ]
    },
    {
      id: 'de_2',
      category: 'developmentOpenness',
      text: 'Süpervizörünüz seans kayıtlarınızı izledi ve performansınızı yetersiz buldu.',
      type: 'radio',
      weightedOptions: [
        { label: 'Detaylı geri bildirim ister ve mentorluk talep ederim.', weights: { development: 1.0, criticism: 1.0, personality: 0.9 }, analysisInsight: 'Öğrenen organizasyon uyumu.' },
        { label: 'Süpervizörün o günkü vakanın zorluğunu anlamadığını düşünürüm.', weights: { development: 0.3, criticism: 0.1, resilience: 0.4 }, analysisInsight: 'Düşük gelişim potansiyeli.' }
      ]
    },
    // --- 10. LOYALTY (SADAKAT) ---
    {
      id: 'lo_1',
      category: 'institutionalLoyalty',
      text: 'Kurum zor bir finansal dönemden geçiyor ve yan haklarda geçici kısıtlama yapıldı.',
      type: 'radio',
      weightedOptions: [
        { label: 'Kurumun yanında durur, bu dönemi el birliğiyle aşmaya odaklanırım.', weights: { loyalty: 1.0, sustainability: 0.9, fit: 1.0 }, analysisInsight: 'Yüksek kurumsal sadakat.' },
        { label: 'Hemen alternatif iş ilanlarını incelemeye başlarım.', weights: { loyalty: 0.2, sustainability: 0.4, fit: 0.3 }, analysisInsight: 'Düşük bağlılık katsayısı.' }
      ]
    },
    {
      id: 'lo_2',
      category: 'institutionalLoyalty',
      text: 'Başka bir uzman arkadaşınız kurumdan ayrılırken sizi de beraberinde götürmek istiyor.',
      type: 'radio',
      weightedOptions: [
        { label: 'Buradaki misyonumu ve öğrencilerimi bırakmayacağımı belirtir, reddederim.', weights: { loyalty: 1.0, workEthics: 0.9, fit: 1.0 }, analysisInsight: 'Misyon odaklı sadakat.' },
        { label: 'Teklifi değerlendiririm, sonuçta her koyun kendi bacağından asılır.', weights: { loyalty: 0.3, workEthics: 0.4, personality: 0.5 }, analysisInsight: 'Bireysel çıkar odaklılık.' }
      ]
    },
    // --- 11. CRITICISM TOLERANCE (ELEŞTİRİ) ---
    {
      id: 'ct_1',
      category: 'criticismTolerance',
      text: 'Bir veli, seansınızdan memnun kalmadığını doğrudan yüzünüze söyledi.',
      type: 'radio',
      weightedOptions: [
        { label: 'Nedenlerini sorar, hatam varsa özür diler ve telafi planı yaparım.', weights: { criticism: 1.0, parentRelations: 0.9, personality: 1.0 }, analysisInsight: 'Çözüm odaklı eleştiri yönetimi.' },
        { label: 'Velinin beklentilerinin gerçekçi olmadığını belirterek kendimi savunurum.', weights: { criticism: 0.2, parentRelations: 0.3, personality: 0.4 }, analysisInsight: 'Düşük eleştiri toleransı.' }
      ]
    }
  ]
};

export const TRAINING_VERIFICATION_QUESTIONS: Record<string, Question> = {};

export const CERTIFICATION_CATEGORIES = {
  LANGUAGE_SPEECH: ["PROMPT", "LSVT Loud", "Vital-Stim", "Hanen Programı", "ETÖOM", "TEDİL", "GOPAS", "E-YÖS"],
  OCCUPATIONAL_THERAPY: ["Ayres Duyu Bütünleme", "SIPT/EASI", "DIR Floortime 101/201", "Bobath (EBTA)", "Kinesiotaping", "CO-OP"],
  PHYSIOTHERAPY: ["Uzay Terapi", "Vojta", "Schroth", "Manuel Terapi", "Pediatrik Rehabilitasyon", "Therasuit"],
  SPECIAL_ED_ABA: ["ABA Uygulayıcı (BCBA Onaylı)", "PECS Faz 1-6", "ETEÇOM", "PREP", "PASS Teorisi", "GOPDÖ-2-TV"],
  ASSESSMENT: ["WISC-V", "MOXO", "Denver II", "CAS", "Stanford-Binet", "Metropolitan"]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "İstanbul Üniversitesi", "Ankara Üniversitesi", "Gazi Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Ergoterapi", "Dil ve Konuşma Terapisi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Okul Öncesi Öğretmenliği"];
