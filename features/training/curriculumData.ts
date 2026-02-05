
import { Branch } from '../../types';

export interface CurriculumUnit {
  id: string;
  title: string;
  duration: string;
  content: string;
  type: 'video' | 'reading' | 'workshop' | 'case_study' | 'simulation';
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

// YARDIMCI: Kategori bazlı 20'şer adet derinlemesine plan
export const GLOBAL_CURRICULA: TrainingPlan[] = [
  // --- 1. ORYANTASYON (20 İÇERİK) ---
  { id: 'ory_01', title: 'Kurumsal DNA ve Vizyon', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-01', description: 'Kurumun liyakat esasları ve profesyonel kimlik inşası.', modules: [] },
  { id: 'ory_02', title: 'MIA AI Veri Giriş Standartları', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-02', description: 'Yapay zeka raporlama sisteminin teknik kullanımı.', modules: [] },
  { id: 'ory_03', title: 'Klinik Güvenlik ve Acil Müdahale', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-03', description: 'Nöbet ve reaktif kriz yönetimi.', modules: [] },
  { id: 'ory_04', title: 'Multidisipliner Çalışma Etiği', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-04', description: 'Branşlar arası iletişim dili.', modules: [] },
  { id: 'ory_05', title: 'BEP Hazırlama ve Hedef Belirleme', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-05', description: 'Bireyselleştirilmiş planların standardizasyonu.', modules: [] },
  { id: 'ory_06', title: 'Materyal Yönetimi ve Sınıf Düzeni', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-06', description: 'Duyusal sınıf tasarımı.', modules: [] },
  { id: 'ory_07', title: 'Veli İlk Kabul Protokolü', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-07', description: 'Beklenti yönetimi ve güven inşası.', modules: [] },
  { id: 'ory_08', title: 'KVKK ve Veri Mahremiyeti', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-08', description: 'Dijital arşiv güvenliği.', modules: [] },
  { id: 'ory_09', title: 'MEB Mevzuat ve Denetim Dosyası', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-09', description: 'Resmi evrak hiyerarşisi.', modules: [] },
  { id: 'ory_10', title: 'Profesyonel Giyim ve Temsil', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-10', description: 'Kurumsal imaj disiplini.', modules: [] },
  { id: 'ory_11', title: 'Zaman Yönetimi ve Seans Verimi', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-11', description: '40 dakikanın mikro-planlaması.', modules: [] },
  { id: 'ory_12', title: 'Personel Hakları ve Sorumlulukları', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-12', description: 'İş akdi ve kurumsal anayasa.', modules: [] },
  { id: 'ory_13', title: 'Hizmet İçi Eğitim Kültürü', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-13', description: 'Sürekli gelişimin önemi.', modules: [] },
  { id: 'ory_14', title: 'Dijital İletişim Kanalları', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-14', description: 'Kurum içi mesajlaşma etiği.', modules: [] },
  { id: 'ory_15', title: 'Kriz Anı Tahliye Planı', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-15', description: 'Afet ve risk yönetimi.', modules: [] },
  { id: 'ory_16', title: 'Öğle Arası ve Sosyal Alan Etiği', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-16', description: 'Ortak alan kullanımı.', modules: [] },
  { id: 'ory_17', title: 'Vaka Transfer Protokolü', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-17', description: 'Ayrılan uzmandan devir alma.', modules: [] },
  { id: 'ory_18', title: 'Performans Ölçüm Kriterleri', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-18', description: 'Liyakat puanlama sistemi.', modules: [] },
  { id: 'ory_19', title: 'Akademik Kurul İşleyişi', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-19', description: 'Üst denetim mekanizması.', modules: [] },
  { id: 'ory_20', title: 'Veda ve İstifa Etiği', category: 'ORIENTATION', targetBranches: 'ALL', level: 'Beginner', badge: 'MÜHÜR-20', description: 'Profesyonel ayrılış süreci.', modules: [] },

  // --- 2. KLİNİK (20 İÇERİK) ---
  { id: 'clin_01', title: 'İleri ABA: Fonksiyonel Analiz', category: 'CLINICAL', targetBranches: [Branch.OzelEgitim], level: 'Advanced', badge: 'USTALIK-01', description: 'Problem davranışların kök analizi.', modules: [] },
  { id: 'clin_02', title: 'DIR Floortime: FEDL 1-6 Masterclass', category: 'CLINICAL', targetBranches: [Branch.Ergoterapi, Branch.Psikoloji], level: 'Advanced', badge: 'USTALIK-02', description: 'Etkileşim temelli müdahale.', modules: [] },
  { id: 'clin_03', title: 'Disleksi: Nöral Okuma Stratejileri', category: 'CLINICAL', targetBranches: [Branch.OzelEgitim, Branch.SinifOgretmenligi], level: 'Advanced', badge: 'USTALIK-03', description: 'Leksikal işlemleme derinliği.', modules: [] },
  { id: 'clin_04', title: 'ASI: Duyu Bütünleme Prensipleri', category: 'CLINICAL', targetBranches: [Branch.Ergoterapi], level: 'Advanced', badge: 'USTALIK-04', description: 'Nöral modülasyon ve adaptasyon.', modules: [] },
  { id: 'clin_05', title: 'DKT: Motor Konuşma Bozuklukları', category: 'CLINICAL', targetBranches: [Branch.DilKonusma], level: 'Advanced', badge: 'USTALIK-05', description: 'PROMPT ve sözel motor kontrol.', modules: [] },
  { id: 'clin_06', title: 'ETEÇOM: Etkileşim Temelli Erken Eğitim', category: 'CLINICAL', targetBranches: [Branch.OzelEgitim, Branch.OkulOncesi], level: 'Intermediate', badge: 'USTALIK-06', description: 'İlişki odaklı gelişim.', modules: [] },
  { id: 'clin_07', title: 'AAC: Yüksek Teknolojik İletişim', category: 'CLINICAL', targetBranches: [Branch.DilKonusma], level: 'Intermediate', badge: 'USTALIK-07', description: 'Tabletle ses olma stratejileri.', modules: [] },
  { id: 'clin_08', title: 'Yönetici İşlevler ve DEHB', category: 'CLINICAL', targetBranches: [Branch.Psikoloji], level: 'Advanced', badge: 'USTALIK-08', description: 'Kognitif kontrol ve planlama.', modules: [] },
  { id: 'clin_09', title: 'Oyun Terapisi: Deneyimsel Yaklaşım', category: 'CLINICAL', targetBranches: [Branch.Psikoloji, Branch.OyunTerapisi], level: 'Advanced', badge: 'USTALIK-09', description: 'Metaforik iyileşme süreci.', modules: [] },
  { id: 'clin_10', title: 'CP ve NDT: Fizyoterapi Yaklaşımları', category: 'CLINICAL', targetBranches: [Branch.Fizyoterapi], level: 'Advanced', badge: 'USTALIK-10', description: 'Nörogelişimsel tedavi prensipleri.', modules: [] },
  { id: 'clin_11', title: 'PEC-S 6 Evre Uygulama', category: 'CLINICAL', targetBranches: [Branch.OzelEgitim], level: 'Intermediate', badge: 'USTALIK-11', description: 'Görsel iletişim sistemleri.', modules: [] },
  { id: 'clin_12', title: 'Otizmde Cinsel Eğitim Protokolü', category: 'CLINICAL', targetBranches: 'ALL', level: 'Advanced', badge: 'USTALIK-12', description: 'Ergenlik dönemi rehberliği.', modules: [] },
  { id: 'clin_13', title: 'Özbakım Becerileri Analizi', category: 'CLINICAL', targetBranches: [Branch.OzelEgitim], level: 'Beginner', badge: 'USTALIK-13', description: 'Tuvalet ve yemek yeme eğitimi.', modules: [] },
  { id: 'clin_14', title: 'Akademik Matematik Muhakemesi', category: 'CLINICAL', targetBranches: [Branch.SinifOgretmenligi], level: 'Intermediate', badge: 'USTALIK-14', description: 'Discalculi ve sayı algısı.', modules: [] },
  { id: 'clin_15', title: 'Beslenme ve Duyusal Seçicilik', category: 'CLINICAL', targetBranches: [Branch.Ergoterapi, Branch.DilKonusma], level: 'Intermediate', badge: 'USTALIK-15', description: 'Feeding terapi yaklaşımları.', modules: [] },
  { id: 'clin_16', title: 'Klinik Gözlem ve Rapor Yazımı', category: 'CLINICAL', targetBranches: 'ALL', level: 'Intermediate', badge: 'USTALIK-16', description: 'Objektif veri dökümantasyonu.', modules: [] },
  { id: 'clin_17', title: 'Artikülasyon ve Fonoloji', category: 'CLINICAL', targetBranches: [Branch.DilKonusma], level: 'Intermediate', badge: 'USTALIK-17', description: 'Ses bilgisel müdahale.', modules: [] },
  { id: 'clin_18', title: 'İnce Motor ve El Becerileri', category: 'CLINICAL', targetBranches: [Branch.Ergoterapi], level: 'Beginner', badge: 'USTALIK-18', description: 'Yazı yazmaya hazırlık.', modules: [] },
  { id: 'clin_19', title: 'Sosyal Beceri Grupları Yönetimi', category: 'CLINICAL', targetBranches: [Branch.Psikoloji, Branch.OzelEgitim], level: 'Advanced', badge: 'USTALIK-19', description: 'Grup dinamiği ve akran etkileşimi.', modules: [] },
  { id: 'clin_20', title: 'Travma Odaklı Özel Eğitim', category: 'CLINICAL', targetBranches: [Branch.Psikoloji], level: 'Advanced', badge: 'USTALIK-20', description: 'Duygusal regülasyon desteği.', modules: [] },

  // --- 3. ETİK (20 İÇERİK) ---
  { id: 'eth_01', title: 'Profesyonel Sınırlar ve Veli İlişkileri', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-01', description: 'Mesafe ve terapötik ittifak dengesi.', modules: [] },
  { id: 'eth_02', title: 'İhmal ve İstismar Bildirim Sorumluluğu', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-02', description: 'Hukuki ve vicdani protokol.', modules: [] },
  { id: 'eth_03', title: 'Sosyal Medya ve Dijital Etik', category: 'ETHICS', targetBranches: 'ALL', level: 'Intermediate', badge: 'HAYSİYET-03', description: 'Vaka mahremiyeti ve kişisel paylaşım.', modules: [] },
  { id: 'eth_04', title: 'Maddi Çıkar Çatışması Yönetimi', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-04', description: 'Hediye ve komisyon reddi.', modules: [] },
  { id: 'eth_05', title: 'Klinik Kayıtların Dürüstlüğü', category: 'ETHICS', targetBranches: 'ALL', level: 'Intermediate', badge: 'HAYSİYET-05', description: 'Veri manipülasyonu riski.', modules: [] },
  { id: 'eth_06', title: 'Tıbbi Sınırlar ve Teşhis Yetkisi', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-06', description: 'Doktor-Terapist ayrımı.', modules: [] },
  { id: 'eth_07', title: 'İş Arkadaşlığı ve Profesyonel Mesafe', category: 'ETHICS', targetBranches: 'ALL', level: 'Intermediate', badge: 'HAYSİYET-07', description: 'Kurum içi toksikleşmeyi önleme.', modules: [] },
  { id: 'eth_08', title: 'Ekol Kayması ve Metodolojik Sadakat', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-08', description: 'Bilimsel bağımsızlık.', modules: [] },
  { id: 'eth_09', title: 'Aydınlatılmış Onam ve Şeffaflık', category: 'ETHICS', targetBranches: 'ALL', level: 'Beginner', badge: 'HAYSİYET-09', description: 'Veli rızası ve yasal formlar.', modules: [] },
  { id: 'eth_10', title: 'Engelli Hakları ve Savunuculuk', category: 'ETHICS', targetBranches: 'ALL', level: 'Intermediate', badge: 'HAYSİYET-10', description: 'Vakanın üstün yararını koruma.', modules: [] },
  { id: 'eth_11', title: 'Din, Dil ve Irk Ayrımcılığı Yasağı', category: 'ETHICS', targetBranches: 'ALL', level: 'Beginner', badge: 'HAYSİYET-11', description: 'Kapsayıcı eğitim vizyonu.', modules: [] },
  { id: 'eth_12', title: 'Özel Ders ve Haksız Rekabet', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-12', description: 'Kurumsal aidiyet ve sadakat.', modules: [] },
  { id: 'eth_13', title: 'Bilimsel Olmayan Yöntemlere Karşı Duruş', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-13', description: 'Sahte bilim direnci.', modules: [] },
  { id: 'eth_14', title: 'Raporlarda Şiddet İçermeyen Dil', category: 'ETHICS', targetBranches: 'ALL', level: 'Intermediate', badge: 'HAYSİYET-14', description: 'Pedagojik üslup disiplini.', modules: [] },
  { id: 'eth_15', title: 'Ayrılan Personelin Etik Sorumluluğu', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-15', description: 'Bilgi çalma ve vaka taşıma.', modules: [] },
  { id: 'eth_16', title: 'Süpervizyon Almanın Etik Boyutu', category: 'ETHICS', targetBranches: 'ALL', level: 'Intermediate', badge: 'HAYSİYET-16', description: 'Denetime açıklık ve dürüstlük.', modules: [] },
  { id: 'eth_17', title: 'Yapay Zeka ve Otomasyon Etiği', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-17', description: 'Algoritmik vicdan.', modules: [] },
  { id: 'eth_18', title: 'Kurum İtibarı ve PR Etiği', category: 'ETHICS', targetBranches: 'ALL', level: 'Intermediate', badge: 'HAYSİYET-18', description: 'Bilginin doğru pazarlanması.', modules: [] },
  { id: 'eth_19', title: 'Vaka Sırrı ve Üçüncü Şahıslar', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-19', description: 'Okul ve aile dışı sızıntılar.', modules: [] },
  { id: 'eth_20', title: 'Etik Tahkim Kurulu Başvurusu', category: 'ETHICS', targetBranches: 'ALL', level: 'Advanced', badge: 'HAYSİYET-20', description: 'İhlal bildirim mekanizması.', modules: [] },

  // --- 4. YÖNETİM (21 İÇERİK) ---
  { id: 'man_01', title: 'Stratejik İK ve Liyakat Yönetimi', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-01', description: 'Ekip seçme ve yerleştirme.', modules: [] },
  { id: 'man_02', title: 'Finansal Verimlilik ve Burs Kontenjanı', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-02', description: 'Rehabilitasyon işletme mantığı.', modules: [] },
  { id: 'man_03', title: 'Kriz Diplomasisi ve PR Yönetimi', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-03', description: 'Skandal ve kaza yönetimi.', modules: [] },
  { id: 'man_04', title: 'İç Denetim ve Kalite Standartları', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Intermediate', badge: 'KOMUTA-04', description: 'Klinik denetim mekanizmaları.', modules: [] },
  { id: 'man_05', title: 'Personel Motivasyonu ve Burnout Engelleme', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-05', description: 'Mental hijyen politikaları.', modules: [] },
  { id: 'man_06', title: 'Liderlik: Ekip Dinamiği ve Arabuluculuk', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-06', description: 'Çatışma çözümü teknikleri.', modules: [] },
  { id: 'man_07', title: 'Dijital Dönüşüm ve Kağıtsız Ofis', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Intermediate', badge: 'KOMUTA-07', description: 'Teknolojik adaptasyon liderliği.', modules: [] },
  { id: 'man_08', title: 'Halkla İlişkiler ve Sosyal Sorumluluk', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Intermediate', badge: 'KOMUTA-08', description: 'Toplumsal algı ve taramalar.', modules: [] },
  { id: 'man_09', title: 'Pazarlama: Bilimsel Başarıyı Temsil', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-09', description: 'Etik reklam ve otorite inşası.', modules: [] },
  { id: 'man_10', title: 'Veli Eğitim Akademisi Tasarımı', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-10', description: 'Kurumsal seminer organizasyonu.', modules: [] },
  { id: 'man_11', title: 'Ölçeklenebilir Eğitim Modelleri', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-11', description: 'Şubeleşme ve standardizasyon.', modules: [] },
  { id: 'man_12', title: 'Hukuki Risk Analizi ve Sözleşmeler', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-12', description: 'Kurumsal zırh inşası.', modules: [] },
  { id: 'man_13', title: 'Ücret Politikası ve Bonus Sistemi', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-13', description: 'Liyakata dayalı teşvik.', modules: [] },
  { id: 'man_14', title: 'Yönetim Kurulu ve Karar Alma Hızı', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Intermediate', badge: 'KOMUTA-14', description: 'Hiyerarşik çeviklik.', modules: [] },
  { id: 'man_15', title: 'Tedarik Zinciri ve Materyal İnovasyonu', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Beginner', badge: 'KOMUTA-15', description: 'Klinik araç seçimi.', modules: [] },
  { id: 'man_16', title: 'Fiziksel Mekan Güvenliği ve Ergonomi', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Beginner', badge: 'KOMUTA-16', description: 'Bina akreditasyonu.', modules: [] },
  { id: 'man_17', title: 'Marka Elçisi Olarak Uzman Personel', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Intermediate', badge: 'KOMUTA-17', description: 'Dış iletişim dili.', modules: [] },
  { id: 'man_18', title: 'Veri Madenciliği ve İstatistiksel Tahmin', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-18', description: 'Gelecek öngörüleri.', modules: [] },
  { id: 'man_19', title: 'Zorlu Personel Yönetimi', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Advanced', badge: 'KOMUTA-19', description: 'Disiplin ve geri bildirim.', modules: [] },
  { id: 'man_20', title: 'Kurumsal Hafıza ve Arşivleme', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Intermediate', badge: 'KOMUTA-20', description: 'Bilgi sürekliliği.', modules: [] },
  { id: 'man_21', title: 'Liderlik ve Yönetim Becerileri', category: 'MANAGEMENT', targetBranches: 'ALL', level: 'Intermediate', badge: 'KOMUTA-21', description: 'Ekip yönetimi ve performans optimizasyonu.', modules: [] },
];
