
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
  }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'data_1',
      category: 'technicalExpertise',
      text: 'Son 3 aydır "Göz Kontrolü" hedefinde %10 başarı gösteren bir vakanın verilerini incelerken klinik kararınız ne olur?',
      type: 'radio',
      weightedOptions: [
        { label: 'Metodu değiştirir, önkoşul becerileri (joint attention vb.) tekrar analiz ederim.', weights: { technical: 1.0, clinical: 1.0, development: 0.9 }, analysisInsight: 'Veri odaklı profesyonel revizyon.' },
        { label: 'Aynı metotla devam eder, pekiştireç yoğunluğunu artırırım.', weights: { technical: 0.3, clinical: 0.4 }, analysisInsight: 'Metodolojik tutuculuk / Veri körlüğü.' }
      ]
    },
    {
      id: 'cl_1',
      category: 'technicalExpertise',
      text: 'Çok ağır problem davranış (self-injury) sergileyen bir vakada, müdahale planınızdaki "Öncül Kontrolü" ile "Sonuç Yönetimi" dengesini klinik olarak nasıl kurarsınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Önce davranışı durdurmak için sonuç odaklı (ceza/mola) çalışırım.', weights: { technical: 0.4, clinical: 0.3 }, analysisInsight: 'Geleneksel katı tutum.' },
        { label: 'İşlevsel analiz yapar, öncülleri düzenleyerek alternatif davranış öğretirim.', weights: { technical: 1.0, clinical: 1.0 }, analysisInsight: 'Bilimsel klinik muhakeme.' }
      ]
    }
  ],
  ethics_parent: [
    {
      id: 'parent_1',
      category: 'parentStudentRelations',
      text: 'Veli, bilimsel olarak kanıtlanmamış bir "alternatif tedavi" (Örn: Ağır diyetler) için sizden destek istediğinde duruşunuz ne olur?',
      type: 'radio',
      weightedOptions: [
        { label: 'Bilimsel literatürü açıklar, kurumun kanıta dayalı ilkesini korurum.', weights: { ethics: 1.0, formality: 1.0, loyalty: 1.0 }, analysisInsight: 'Yüksek etik dürüstlük.' },
        { label: 'Veliyi kırmamak adına denemesine izin verir, takip ederim.', weights: { ethics: 0.2, clinical: 0.1 }, analysisInsight: 'Klinik taviz ve etik zafiyet.' }
      ]
    }
  ],
  resilience_team: [
    {
      id: 'burnout_1',
      category: 'sustainability',
      text: 'Ardışık 4 seans boyunca vakanın yoğun ağlama krizlerine maruz kaldınız. Seans çıkışında zihinsel durumunuzu nasıl yönetirsiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Vakanın fonksiyonunu hatırlar, duygularımdan arınıp nesnel rapor yazarım.', weights: { sustainability: 1.0, personality: 1.0 }, analysisInsight: 'Yüksek duygusal regülasyon.' },
        { label: 'O günkü yorgunlukla seansı erken bitirmeyi veya raporu ertelemeyi düşünürüm.', weights: { sustainability: 0.2, institutionalLoyalty: 0.3 }, analysisInsight: 'Düşük direnç ve burnout riski.' }
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
        { label: 'Alternatif verileri sunarak idare ile yapıcı bir toplantı talep ederim.', weights: { institutionalLoyalty: 1.0, formality: 0.9 }, analysisInsight: 'Sorumlu kurumsal aidiyet.' },
        { label: 'Metodu uygulamayı bırakır ve diğer öğretmenlerle şikayetimi paylaşırım.', weights: { institutionalLoyalty: 0.2, personality: 0.3 }, analysisInsight: 'Kurumsal huzuru bozma riski.' }
      ]
    }
  ]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
