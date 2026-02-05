
import { Branch } from '../../types';

export interface CurriculumUnit {
  id: string;
  title: string;
  duration: string;
  content: string;
  type: 'video' | 'reading' | 'workshop' | 'case_study';
}

export interface CurriculumModule {
  id: string;
  title: string;
  units: CurriculumUnit[];
}

export interface TrainingPlan {
  id: string;
  title: string;
  category: 'ORIENTATION' | 'CLINICAL' | 'ETHICS' | 'MANAGEMENT';
  targetBranches: Branch[] | 'ALL';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  badge: string;
  modules: CurriculumModule[];
}

export const GLOBAL_CURRICULA: TrainingPlan[] = [
  // ==========================================
  // 1. KATEGORİ: ORYANTASYON (ORIENTATION) - 10 İÇERİK
  // ==========================================
  {
    id: 'ory_01',
    title: 'Yeni Gün Akademi Anayasası ve Kültürü',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-01',
    description: 'Kurumsal vizyon, liyakat esasları ve profesyonel kimlik inşası.',
    modules: [
      {
        id: 'm1', title: 'Kurumsal DNA',
        units: [
          { id: 'u1', title: 'Misyon ve Vizyon Analizi', duration: '30dk', type: 'reading', content: 'Yeni Gün Akademi\'nin özel eğitimdeki devrimci vizyonu.' },
          { id: 'u2', title: 'Hiyerarşik İletişim Kanalları', duration: '20dk', type: 'video', content: 'Kiminle, ne zaman, nasıl iletişim kurulur?' }
        ]
      }
    ]
  },
  {
    id: 'ory_02',
    title: 'MIA AI Raporlama Sistemi Eğitimi',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-02',
    description: 'Yapay zeka destekli veri giriş ve analiz platformunun kullanımı.',
    modules: [
      {
        id: 'm1', title: 'Veri Giriş Disiplini',
        units: [
          { id: 'u1', title: 'Günlük Seans Notu Standartları', duration: '45dk', type: 'workshop', content: 'Objektif ve ölçülebilir veri girişi pratikleri.' }
        ]
      }
    ]
  },
  {
    id: 'ory_03',
    title: 'Acil Durum ve Klinik Güvenlik',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-03',
    description: 'Nöbet, yaralanma ve reaktif kriz anlarında saniyeler içinde karar alma.',
    modules: [{ id: 'm1', title: 'Hayat Kurtaran Refleksler', units: [{ id: 'u1', title: 'Epilepsi ve Nöbet Müdahalesi', duration: '60dk', type: 'video', content: 'Klinik güvenliği tehlikeye atmadan müdahale.' }] }]
  },
  {
    id: 'ory_04',
    title: 'Sınıf Ergonomisi ve Duyusal Tasarım',
    category: 'ORIENTATION',
    targetBranches: [Branch.OzelEgitim, Branch.Ergoterapi, Branch.OkulOncesi],
    level: 'Beginner',
    badge: 'MÜHÜR-04',
    description: 'Öğrenme ortamının duyusal hassasiyetlere göre optimize edilmesi.',
    modules: [{ id: 'm1', title: 'Mekanik Hazırlık', units: [{ id: 'u1', title: 'Materyal Düzeni ve Görsel Destekler', duration: '40dk', type: 'workshop', content: 'Minimalist ve odak odaklı sınıf tasarımı.' }] }]
  },
  {
    id: 'ory_05',
    title: 'İlk Veli Kabul ve Beklenti Yönetimi',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-05',
    description: 'İlk tanışmada kurumsal ciddiyet ve empatik duruş dengesi.',
    modules: [{ id: 'm1', title: 'Diplomasi', units: [{ id: 'u1', title: 'Profesyonel Tanışma Senaryoları', duration: '50dk', type: 'case_study', content: 'Veli kaygısını rasyonalize etme teknikleri.' }] }]
  },
  {
    id: 'ory_06',
    title: 'Multidisipliner Vaka Konseyi Kültürü',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-06',
    description: 'Ekip toplantılarında teknik dil kullanımı ve ortak akıl inşası.',
    modules: [{ id: 'm1', title: 'Kolektif Zeka', units: [{ id: 'u1', title: 'BEP Toplantı Dinamikleri', duration: '45dk', type: 'reading', content: 'Disiplinlerarası veri paylaşım protokolleri.' }] }]
  },
  {
    id: 'ory_07',
    title: 'Mesai Sonrası Deşarj ve Mental Hijyen',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-07',
    description: 'Tükenmişliği önlemek için iş-yaşam dengesi ve psikolojik sınırlar.',
    modules: [{ id: 'm1', title: 'Self-Care', units: [{ id: 'u1', title: 'Duygusal Bulaşmayı Yönetmek', duration: '30dk', type: 'reading', content: 'Vaka stresini eve taşımama stratejileri.' }] }]
  },
  {
    id: 'ory_08',
    title: 'Kurumsal Giyim ve Temsil Standartları',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-08',
    description: 'Görsel kimlik, temizlik ve profesyonel duruşun klinik etkisi.',
    modules: [{ id: 'm1', title: 'Prestij', units: [{ id: 'u1', title: 'Non-Verbal İletişimde İmaj', duration: '20dk', type: 'video', content: 'Kıyafetin vaka üzerindeki otorite etkisi.' }] }]
  },
  {
    id: 'ory_09',
    title: 'Hukuki Sorumluluklar ve İmza Yetkisi',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-09',
    description: 'Resmi evrak yönetimi ve hukuki sınırların korunması.',
    modules: [{ id: 'm1', title: 'Legalite', units: [{ id: 'u1', title: 'MEB ve Sağlık Bakanlığı Standartları', duration: '60dk', type: 'reading', content: 'Yasal yükümlülükler ve imza sorumluluğu.' }] }]
  },
  {
    id: 'ory_10',
    title: 'Akademik Arşiv ve Veri Güvenliği',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-10',
    description: 'Fiziksel ve dijital dosyaların korunması ve gizlilik.',
    modules: [{ id: 'm1', title: 'Güvenlik', units: [{ id: 'u1', title: 'Şifreleme ve Fiziksel Arşivleme', duration: '30dk', type: 'reading', content: 'Hassas verilerin manipülasyondan korunması.' }] }]
  },

  // ==========================================
  // 2. KATEGORİ: KLİNİK (CLINICAL) - 10 İÇERİK
  // ==========================================
  {
    id: 'clin_01',
    title: 'İleri ABA: Fonksiyonel Analiz Derinliği',
    category: 'CLINICAL',
    targetBranches: [Branch.OzelEgitim, Branch.Psikoloji],
    level: 'Advanced',
    badge: 'USTALIK-01',
    description: 'Problem davranışların kök nedenlerini mikro düzeyde tespit etme.',
    modules: [{ id: 'm1', title: 'Kök Analizi', units: [{ id: 'u1', title: 'ABC Kayıtlarında Nüanslar', duration: '90dk', type: 'workshop', content: 'Öncül-Davranış-Sonuç ilişkisinde gizli tetikleyiciler.' }] }]
  },
  {
    id: 'clin_02',
    title: 'DIR Floortime: FEDL 1-6 Masterclass',
    category: 'CLINICAL',
    targetBranches: [Branch.Ergoterapi, Branch.DilKonusma, Branch.Psikoloji],
    level: 'Intermediate',
    badge: 'USTALIK-02',
    description: 'Fonksiyonel Duyusal Gelişim Basamaklarında ustalığa geçiş.',
    modules: [{ id: 'm1', title: 'Gelişimsel Merdiven', units: [{ id: 'u1', title: 'Karmaşık Problem Çözme (FEDL 4)', duration: '75dk', type: 'video', content: 'Etkileşim döngülerini akademik hedeflere bağlama.' }] }]
  },
  {
    id: 'clin_03',
    title: 'Okuma-Yazma Hiyerarşisinde Nöral Modeller',
    category: 'CLINICAL',
    targetBranches: [Branch.OzelEgitim, Branch.SinifOgretmenligi],
    level: 'Advanced',
    badge: 'USTALIK-03',
    description: 'Disleksi ve öğrenme güçlüğünde kanıta dayalı yeni nesil yaklaşımlar.',
    modules: [{ id: 'm1', title: 'Leksikal İşlemleme', units: [{ id: 'u1', title: 'PREP ve COGENT Uygulamaları', duration: '120dk', type: 'workshop', content: 'Bilişsel işlemlerin akademik çıktıya dönüştürülmesi.' }] }]
  },
  {
    id: 'clin_04',
    title: 'DKT: Motor Konuşma Bozuklukları',
    category: 'CLINICAL',
    targetBranches: [Branch.DilKonusma, Branch.Odyoloji],
    level: 'Advanced',
    badge: 'USTALIK-04',
    description: 'Apraksi ve Dizartri vakalarında motor öğrenme stratejileri.',
    modules: [{ id: 'm1', title: 'Oral-Motor Kontrol', units: [{ id: 'u1', title: 'PROMPT Tekniği Giriş', duration: '100dk', type: 'video', content: 'Konuşma sesleri için dokunsal girdilerin kullanımı.' }] }]
  },
  {
    id: 'clin_05',
    title: 'Serebral Palsi ve NDT Prensipleri',
    category: 'CLINICAL',
    targetBranches: [Branch.Fizyoterapi, Branch.Ergoterapi],
    level: 'Intermediate',
    badge: 'USTALIK-05',
    description: 'Nörogelişimsel Tedavi ekolünde pozisyonlama ve mobilizasyon.',
    modules: [{ id: 'm1', title: 'Biyomekanik', units: [{ id: 'u1', title: 'Postüral Kontrol Analizi', duration: '90dk', type: 'workshop', content: 'Gövde stabilitesinin üst ekstremiteye etkisi.' }] }]
  },
  {
    id: 'clin_06',
    title: 'Duyu Bütünleme ve Ayres Teorisi',
    category: 'CLINICAL',
    targetBranches: [Branch.Ergoterapi, Branch.Fizyoterapi],
    level: 'Advanced',
    badge: 'USTALIK-06',
    description: 'Vestibüler, propriyoseptif ve taktil sistemlerde modülasyon.',
    modules: [{ id: 'm1', title: 'Nöral Adaptasyon', units: [{ id: 'u1', title: 'Duyusal Diyet Tasarımı', duration: '80dk', type: 'case_study', content: 'Ev ve okul için kişiselleştirilmiş duyusal reçeteler.' }] }]
  },
  {
    id: 'clin_07',
    title: 'AAC: Alternatif ve Destekleyici İletişim',
    category: 'CLINICAL',
    targetBranches: [Branch.OzelEgitim, Branch.DilKonusma],
    level: 'Intermediate',
    badge: 'USTALIK-07',
    description: 'Sözel olmayan çocuklarda teknolojik ve düşük teknolojili sistemler.',
    modules: [{ id: 'm1', title: 'Ses Olmak', units: [{ id: 'u1', title: 'PECS 6 Evre Uygulama', duration: '70dk', type: 'video', content: 'İsteme davranışından sosyal paylaşıma geçiş.' }] }]
  },
  {
    id: 'clin_08',
    title: 'Yönetici İşlevler ve DEHB Stratejileri',
    category: 'CLINICAL',
    targetBranches: [Branch.Psikoloji, Branch.PDR],
    level: 'Intermediate',
    badge: 'USTALIK-08',
    description: 'Planlama, organizasyon ve dürtü kontrolü eğitimleri.',
    modules: [{ id: 'm1', title: 'Kognitif Fren', units: [{ id: 'u1', title: 'Zaman Yönetimi Oyunları', duration: '50dk', type: 'workshop', content: 'Bilişsel esnekliği artıran akademik müdahaleler.' }] }]
  },
  {
    id: 'clin_09',
    title: 'Oyun Terapisi: Deneyimsel Yaklaşım',
    category: 'CLINICAL',
    targetBranches: [Branch.Psikoloji, Branch.OyunTerapisi],
    level: 'Advanced',
    badge: 'USTALIK-09',
    description: 'Terapötik oyun yoluyla travma ve kaygı yönetimi.',
    modules: [{ id: 'm1', title: 'Metaforik Dil', units: [{ id: 'u1', title: 'Oyun Odasında Sınır Koyma', duration: '60dk', type: 'case_study', content: 'Güvenli alanı bozmadan klinik yönlendirme.' }] }]
  },
  {
    id: 'clin_10',
    title: 'ETEÇOM ve Etkileşim Temelli Müdahale',
    category: 'CLINICAL',
    targetBranches: [Branch.OzelEgitim, Branch.OkulOncesi],
    level: 'Beginner',
    badge: 'USTALIK-10',
    description: 'İlişki temelli erken çocuklukta müdahale programı.',
    modules: [{ id: 'm1', title: 'Erken Müdahale', units: [{ id: 'u1', title: 'Fırsat Öğretimi Teknikleri', duration: '40dk', type: 'video', content: 'Doğal ortamda akademik hedefleri gizleme.' }] }]
  },

  // ==========================================
  // 3. KATEGORİ: ETİK (ETHICS) - 10 İÇERİK
  // ==========================================
  {
    id: 'eth_01',
    title: 'Profesyonel Sınırlar ve Veli İlişkileri',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'HAYSİYET-01',
    description: 'Terapötik ilişkinin "sosyalleşme" tuzağına düşmesini engelleme.',
    modules: [{ id: 'm1', title: 'Dinamik Mesafe', units: [{ id: 'u1', title: 'Hediye ve Teklif Reddetme Sanatı', duration: '45dk', type: 'case_study', content: 'Nezaketi bozmadan etik sınırı çizme simülasyonu.' }] }]
  },
  {
    id: 'eth_02',
    title: 'Gizlilik ve Dijital Mahremiyet (KVKK)',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'HAYSİYET-02',
    description: 'Vaka verilerinin korunması ve yasal sorumluluklar.',
    modules: [{ id: 'm1', title: 'Veri Namusu', units: [{ id: 'u1', title: 'Sosyal Medyada Paylaşım Etiği', duration: '30dk', type: 'reading', content: 'Çocukların dijital ayak izini koruma zorunluluğu.' }] }]
  },
  {
    id: 'eth_03',
    title: 'Hekimlik ve Teşhis Sınırları',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Intermediate',
    badge: 'HAYSİYET-03',
    description: 'Terapist olarak "ilaç" veya "tanı" yorumu yapmanın tehlikeleri.',
    modules: [{ id: 'm1', title: 'Uzmanlık Alanı', units: [{ id: 'u1', title: 'Tıbbi Sınırlara Saygı', duration: '40dk', type: 'video', content: 'Veliye "bu ilaç ağır değil mi?" sorusuna verilecek etik cevap.' }] }]
  },
  {
    id: 'eth_04',
    title: 'İhmal ve İstismar Bildirim Protokolü',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'HAYSİYET-04',
    description: 'Şüpheli durumlarda hukuki ve ahlaki eylem planı.',
    modules: [{ id: 'm1', title: 'Vicdani Sorumluluk', units: [{ id: 'u1', title: 'Kritik Emareleri Tanıma', duration: '90dk', type: 'workshop', content: 'Morluk, davranış değişikliği ve travma dedektörlüğü.' }] }]
  },
  {
    id: 'eth_05',
    title: 'Maddi Çıkar Çatışması ve Rüşvet Direnci',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'HAYSİYET-05',
    description: 'Ekipman satışı veya özel ders yönlendirmelerinde etik duruş.',
    modules: [{ id: 'm1', title: 'Entegrite', units: [{ id: 'u1', title: 'Komisyon Tekliflerine Cevap', duration: '30dk', type: 'case_study', content: 'Bilimsel bağımsızlığın korunması.' }] }]
  },
  {
    id: 'eth_06',
    title: 'Klinik Kayıtların Dürüstlüğü',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Intermediate',
    badge: 'HAYSİYET-06',
    description: 'Raporlarda "olmayan ilerlemeyi" yazmama disiplini.',
    modules: [{ id: 'm1', title: 'Akademik Doğruluk', units: [{ id: 'u1', title: 'Veri Manipülasyonunun Zararları', duration: '40dk', type: 'reading', content: 'Yanlış raporun vaka geleceğine etkisi.' }] }]
  },
  {
    id: 'eth_07',
    title: 'Meslektaşlar Arası Etik ve Dayanışma',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Intermediate',
    badge: 'HAYSİYET-07',
    description: 'Diğer uzmanları vaka yanında kötülememe kültürü.',
    modules: [{ id: 'm1', title: 'Ekip Etiği', units: [{ id: 'u1', title: 'Geri Bildirim mi Dedikodu mu?', duration: '35dk', type: 'workshop', content: 'Klinik eleştiri ile kişisel saldırı farkı.' }] }]
  },
  {
    id: 'eth_08',
    title: 'Araştırma ve Yayın Etiği',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'HAYSİYET-08',
    description: 'Vaka verilerini makale veya sunumda kullanma izni.',
    modules: [{ id: 'm1', title: 'Bilimsel Onur', units: [{ id: 'u1', title: 'Aydınlatılmış Onam Formları', duration: '30dk', type: 'reading', content: 'Veliden alınan iznin kapsamı ve yasal niteliği.' }] }]
  },
  {
    id: 'eth_09',
    title: 'Yapay Zeka ve Otomasyon Etiği',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'HAYSİYET-09',
    description: 'AI tarafından yazılan raporların denetim sorumluluğu.',
    modules: [{ id: 'm1', title: 'Algoritmik Vicdan', units: [{ id: 'u1', title: 'AI Yanılgılarını (Hallucination) Tespit', duration: '45dk', type: 'workshop', content: 'Teknolojinin insani sorumluluğu devralamadığı noktalar.' }] }]
  },
  {
    id: 'eth_10',
    title: 'İstifa ve Vaka Devir Etiği',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Intermediate',
    badge: 'HAYSİYET-10',
    description: 'Kurumdan ayrılırken vaka dosyasını temiz bırakma.',
    modules: [{ id: 'm1', title: 'Süreklilik', units: [{ id: 'u1', title: 'Veda ve Devir Protokolü', duration: '30dk', type: 'reading', content: 'Vakayı yarı yolda bırakmadan yeni uzmana hazırlama.' }] }]
  },

  // ==========================================
  // 4. KATEGORİ: YÖNETİM (MANAGEMENT) - 10 İÇERİK
  // ==========================================
  {
    id: 'man_01',
    title: 'Liderlik: Ekip Dinamiği ve Motivasyon',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'KOMUTA-01',
    description: 'Akademik kadronun liyakat odaklı yönetimi.',
    modules: [{ id: 'm1', title: 'İnsan Sermayesi', units: [{ id: 'u1', title: 'Geri Bildirim Verme Sanatı', duration: '60dk', type: 'workshop', content: 'Sandviç tekniği ve gelişim odaklı eleştiri.' }] }]
  },
  {
    id: 'man_02',
    title: 'Finansal Okuryazarlık ve Kurumsal Verimlilik',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Intermediate',
    badge: 'KOMUTA-02',
    description: 'Rehabilitasyon merkezinin ekonomik sürdürülebilirliği.',
    modules: [{ id: 'm1', title: 'İşletme Mantığı', units: [{ id: 'u1', title: 'Maliyet ve Fayda Analizi', duration: '45dk', type: 'reading', content: 'Cihaz yatırımı mı personel eğitimi mi?' }] }]
  },
  {
    id: 'man_03',
    title: 'Pazarlama ve Kurumsal İtibar Yönetimi',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'KOMUTA-03',
    description: 'Bilimsel başarıyı markalaştırma stratejileri.',
    modules: [{ id: 'm1', title: 'Vitrindeki Bilim', units: [{ id: 'u1', title: 'Sosyal Medyada Otorite İnşası', duration: '40dk', type: 'video', content: 'Uzmanlığın halka anlatılması teknikleri.' }] }]
  },
  {
    id: 'man_04',
    title: 'Kriz Yönetimi: Kurumsal Felaket Senaryoları',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'KOMUTA-04',
    description: 'Hukuki baskı, skandal veya fiziksel kaza anlarında yönetim.',
    modules: [{ id: 'm1', title: 'Fırtına Kontrolü', units: [{ id: 'u1', title: 'Basın ve Veli İletişimi', duration: '70dk', type: 'case_study', content: 'Negatif algıyı profesyonelce yönetme.' }] }]
  },
  {
    id: 'man_05',
    title: 'İç Denetim ve Kalite Güvence Sistemleri',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Intermediate',
    badge: 'KOMUTA-05',
    description: 'Seansların ve raporların sistematik denetimi.',
    modules: [{ id: 'm1', title: 'Standartlar', units: [{ id: 'u1', title: 'Klinik Check-list Oluşturma', duration: '50dk', type: 'workshop', content: 'Hataları ortaya çıkmadan yakalama mekanizmaları.' }] }]
  },
  {
    id: 'man_06',
    title: 'Stratejik Planlama: 12 Aylık Akademik Yol Haritası',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'KOMUTA-06',
    description: 'Kurumun yıllık gelişim hedeflerini belirleme.',
    modules: [{ id: 'm1', title: 'Vizyoner Yönetim', units: [{ id: 'u1', title: 'Yıllık Eğitim Takvimi Tasarımı', duration: '45dk', type: 'reading', content: 'Hangi ay hangi branş eğitilecek?' }] }]
  },
  {
    id: 'man_07',
    title: 'Çatışma Çözümü: Ekip İçi Arabuluculuk',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Intermediate',
    badge: 'KOMUTA-07',
    description: 'Uzmanlar arasındaki ego savaşlarını bitirme teknikleri.',
    modules: [{ id: 'm1', title: 'Barış Diplomasisi', units: [{ id: 'u1', title: 'Müzakere ve Uzlaşma Kültürü', duration: '40dk', type: 'workshop', content: 'Klinik çatışmaları gelişim fırsatına çevirme.' }] }]
  },
  {
    id: 'man_08',
    title: 'Mevzuat Hakimiyeti ve MEB İlişkileri',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'KOMUTA-08',
    description: 'Yönetmelik değişiklikleri ve resmi kurum denetimleri.',
    modules: [{ id: 'm1', title: 'Bürokrasi', units: [{ id: 'u1', title: 'Denetim Dosyası Hazırlama', duration: '30dk', type: 'reading', content: 'Eksiksiz ve mevzuata uygun kurumsal arşiv.' }] }]
  },
  {
    id: 'man_09',
    title: 'Dijital Dönüşüm Liderliği',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'KOMUTA-09',
    description: 'Kurumda teknoloji direncini kırma ve adaptasyon.',
    modules: [{ id: 'm1', title: 'Tekno-Yönetim', units: [{ id: 'u1', title: 'Paperless (Kağıtsız) Ofis Geçişi', duration: '40dk', type: 'workshop', content: 'Dijital verimlilik araçlarının personelleştirilmesi.' }] }]
  },
  {
    id: 'man_10',
    title: 'Halkla İlişkiler: Sosyal Sorumluluk Projeleri',
    category: 'MANAGEMENT',
    targetBranches: 'ALL',
    level: 'Intermediate',
    badge: 'KOMUTA-10',
    description: 'Kurumun toplumsal algısını güçlendiren projeler.',
    modules: [{ id: 'm1', title: 'Sosyal Etki', units: [{ id: 'u1', title: 'Ücretsiz Tarama ve Seminer Organizasyonu', duration: '35dk', type: 'case_study', content: 'Akademik bilgiyi toplumla paylaşma planları.' }] }]
  }
];
