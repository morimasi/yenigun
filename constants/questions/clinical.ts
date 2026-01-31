
import { Question, Branch } from '../../types';

export const clinicalQuestions: Question[] = [
  {
    id: 'clin_adv_1', category: 'technicalExpertise', type: 'radio',
    text: 'Öğrencinin veri toplama sürecinde "Gözlemciler Arası Güvenirlik" (IOA) %70\'in altına düştü. Hangi aksiyon metodolojik olarak önceliklidir?',
    weightedOptions: [
      { label: 'Operasyonel Tanım Revizyonu: Hedef davranışın tanımını daha gözlenebilir ve ölçülebilir hale getirip ekibi yeniden kalibre ederim.', weights: { clinical: 1.0, leadership: 0.8 }, analysisInsight: 'Usta Analist: Sistemsel hatayı saptama becerisi.' },
      { label: 'Yoğunlaştırılmış Eğitim: Veri toplayan personeli cezalandırmadan, hatasız veri toplama konusunda tekrar eğitime alırım.', weights: { clinical: 0.7, fit: 0.9 }, analysisInsight: 'Eğitimci Formasyonu.' },
      { label: 'Ortalama Alma: Verileri harmanlayarak genel bir ilerleme raporu hazırlar, süreci aksatmam.', weights: { clinical: -1.0, workEthics: -0.5 }, analysisInsight: 'Bilimsel İhmal: Veri manipülasyon riski.' },
      { label: 'Veli Bilgilendirme: Veri uyumsuzluğunu aileye dürüstçe açıklayıp onlardan ev verisi talep ederim.', weights: { clinical: 0.4, empathy: 0.8 }, analysisInsight: 'Şeffaf ama teknik olarak yetersiz yaklaşım.' }
    ]
  },
  {
    id: 'clin_adv_2', category: 'technicalExpertise', type: 'radio',
    text: 'Duyusal işlemleme bozukluğu olan bir çocukta "Aşırı Uyarılmışlık" (Hyper-arousal) anında akademik talebi nasıl yönetirsiniz?',
    weightedOptions: [
      { label: 'Talebi Silikleştirme ve Regülasyon: Akademik materyalleri ortamdan çeker, propriyoseptif girdi sağlar ve çocuk "Sakin-Uyanık" moda dönene kadar beklerim.', weights: { clinical: 1.0, pedagogicalAnalysis: 0.9 }, branchOverrides: { [Branch.Ergoterapi]: { clinical: 1.5 } }, analysisInsight: 'Nöro-Gelişimsel Öncelik.' },
      { label: 'Hiyerarşik İpucu: Çocuğun dikkatini dağıtmadan fiziksel ipucuyla görevi hızlıca bitirip sonra mola veririm.', weights: { clinical: 0.5, sustainability: 0.7 }, analysisInsight: 'Görev Odaklılık: Kriz anında düşük verim.' },
      { label: 'Ayrımlı Pekiştirme: Çocuk uyarılmış haldeyken bile koltukta oturduğu her 10 saniye için yüksek değerli ödül veririm.', weights: { clinical: 0.4, personality: 0.6 }, analysisInsight: 'Mekanik Davranışçılık.' },
      { label: 'Seansı Sonlandırma: Güvenlik riski oluşmaması için seansı o an bitirip veliye teslim ederim.', weights: { clinical: -0.5, sustainability: -0.8 }, analysisInsight: 'Düşük Tolerans: Zor vakadan kaçınma eğilimi.' }
    ]
  },
  {
    id: 'clin_adv_3', category: 'technicalExpertise', type: 'radio',
    text: '"Genellenmiş Taklit" (Generalized Imitation) becerisi olmayan bir çocukta hangi dil kazanımı en yüksek dirençle karşılaşır?',
    weightedOptions: [
      { label: 'Artikülasyon ve Ses Taklidi: Motor taklit temeli olmadan seslerin kopyalanması ve fonetik farkındalık inşa edilemez.', weights: { clinical: 1.0, pedagogicalAnalysis: 0.8 }, branchOverrides: { [Branch.DilKonusma]: { clinical: 1.3 } }, analysisInsight: 'Dil Gelişim Hiyerarşisi Hakimiyeti.' },
      { label: 'Resim İsmi Söyleme (Tacting): Görsel-isitsel eşleme olduğu için taklit olmadan da gelişebilir.', weights: { clinical: -0.2 }, analysisInsight: 'Hatalı Analiz.' },
      { label: 'Alıcı Dil Becerileri: Yönerge takip taklit gerektirmediği için daha kolay ilerler.', weights: { clinical: 0.3 }, analysisInsight: 'Temel Bilgi.' },
      { label: 'Okuma-Yazma: Sembolik bir süreç olduğu için taklitle ilişkisi ikincildir.', weights: { clinical: 0.1 }, analysisInsight: 'Akademik Odak.' }
    ]
  },
  {
    id: 'clin_adv_4', category: 'technicalExpertise', type: 'radio',
    text: 'Bir vaka analizinde "Pekiştireç Değerinin Kaybolması" (Satiation) saptandı. Teknik çözümünüz nedir?',
    weightedOptions: [
      { label: 'Yoksunluk (Deprivation) Protokolü: İlgili pekiştireci seans dışı zamanlarda ulaşılamaz hale getirip "Motivasyonel Operasyonu" (MO) güçlendiririm.', weights: { clinical: 1.0, sustainability: 0.6 }, analysisInsight: 'Davranışsal Ekonomi Hakimiyeti.' },
      { label: 'Çeşitlendirme: Pekiştireç menüsünü genişletir ve "Değişken Oranlı" (VR) tarifeye geçerim.', weights: { clinical: 0.9, pedagogicalAnalysis: 0.7 }, analysisInsight: 'Esnek Klinisyen.' },
      { label: 'Miktar Artışı: Daha çok ödül vererek ilgisini çekmeye çalışırım.', weights: { clinical: -0.5, workEthics: -0.2 }, analysisInsight: 'Hatalı Uygulama: Doygunluğu artırır.' },
      { label: 'Mola: Çocuğun sıkıldığını kabul edip dersi serbest oyuna çeviririm.', weights: { clinical: 0.2, empathy: 0.9 }, analysisInsight: 'Pedagojik Teslimiyet.' }
    ]
  },
  {
    id: 'clin_adv_5', category: 'technicalExpertise', type: 'radio',
    text: 'Öğrenme güçlüğü olan bir çocukta "Hızlı İsimlendirme" (RAN) zayıflığı varsa, akıcı okuma için ilk adım ne olmalıdır?',
    weightedOptions: [
      { label: 'Otomatikleşme Egzersizleri: Harf, rakam ve renkleri saniyeler içinde isimlendirme drilleriyle "Görsel İşlemleme Hızını" artırırım.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Nöro-Bilişsel Müdahale.' },
      { label: 'Metin Okuma: Daha çok kitap okutarak pratiği artırırım.', weights: { clinical: 0.2 }, analysisInsight: 'Yüzeysel Yaklaşım.' },
      { label: 'Anlamlandırma: Kelimelerin anlamını sözlükten buldururum.', weights: { clinical: 0.0 }, analysisInsight: 'Kategori Hatası.' },
      { label: 'Göz Egzersizi: Kalem takibi yaparak göz kaslarını güçlendiririm.', weights: { clinical: -0.5 }, analysisInsight: 'Bilimsel Olmayan Yaklaşım.' }
    ]
  },
  {
    id: 'clin_adv_6', category: 'technicalExpertise', type: 'radio',
    text: 'DIR Floortime ekolünde "Gelişimsel Merdivenin" 5. basamağında (Sembolik Düşünme) takılan bir çocuk için oyun kurgunuz ne olur?',
    weightedOptions: [
      { label: 'Gölge Oyun ve Dramatizasyon: Nesneleri fonksiyonları dışında kullanarak (örn: fırça yerine mikrofon) soyutlama ve "mış gibi" yapma becerisini tetiklerim.', weights: { clinical: 1.0, empathy: 0.9 }, analysisInsight: 'Sembolik Kapasite Geliştirici.' },
      { label: 'Eşleme: Benzer oyuncakları bir araya getirme çalışmaları yaparım.', weights: { clinical: 0.0 }, analysisInsight: 'Alt Seviye Müdahale.' },
      { label: 'Duyusal Oyun: Sadece köpük ve su ile duyusal girdi sağlarım.', weights: { clinical: 0.4 }, analysisInsight: 'Regülasyon Odaklılık.' },
      { label: 'Kural Takibi: Masa başı kutu oyunları ile kuralları öğretirim.', weights: { clinical: 0.2 }, analysisInsight: 'Prematüre Akademik Yaklaşım.' }
    ]
  },
  {
    id: 'clin_adv_7', category: 'technicalExpertise', type: 'radio',
    text: 'Ağır zihinsel engeli olan bir bireyde "Fonksiyonel İletişim Eğitimi" (FCT) başlatırken ilk hedef davranış ne seçilmelidir?',
    weightedOptions: [
      { label: 'Yardım İsteme veya Mola Talebi: Problem davranışın yerine geçebilecek en temel "İhtiyaç Bildirimi" refleksini inşa ederim.', weights: { clinical: 1.0, integrity: 0.8 }, analysisInsight: 'Etik ve Fonksiyonel Öncelik.' },
      { label: 'Selamlaşma: Sosyal uyum için "Merhaba" demeyi öğretirim.', weights: { clinical: 0.1 }, analysisInsight: 'Kozmetik Öncelik.' },
      { label: 'Renkleri Ayırt Etme: Bilişsel temel için renklerden başlarım.', weights: { clinical: -0.5 }, analysisInsight: 'Hatalı Hiyerarşi.' },
      { label: 'İsmini Yazma: Özbakım ve kimlik için ismini yazdırırım.', weights: { clinical: 0.0 }, analysisInsight: 'Uygulanamaz Hedef.' }
    ]
  },
  {
    id: 'clin_adv_8', category: 'technicalExpertise', type: 'radio',
    text: 'CRA (Somut-Temsili-Soyut) stratejisinde "Onluk Bozma" mantığı nasıl öğretilir?',
    weightedOptions: [
      { label: 'Fiziksel Bloklar: 10\'luk çubukları tek tek "bozup" birliklere ayırarak niceliksel değişimi somut olarak gösteririm.', weights: { clinical: 1.0, pedagogicalAnalysis: 0.9 }, analysisInsight: 'Matematiksel Muhakeme Ustalığı.' },
      { label: 'Ezber: "Komşuya gidip bir onluk alırız" tekerlemesini ezberletirim.', weights: { clinical: -0.8 }, analysisInsight: 'Mekanik ve Hatalı Kavramsallaştırma.' },
      { label: 'Kağıt-Kalem: Alt alta toplama-çıkarma drilleri yaparım.', weights: { clinical: 0.2 }, analysisInsight: 'Soyut Evreye Erken Geçiş.' },
      { label: 'Parmakla Sayma: Geriye doğru sayarak sonuca ulaştırırım.', weights: { clinical: 0.0 }, analysisInsight: 'İlkel Strateji.' }
    ]
  },
  {
    id: 'clin_adv_9', category: 'technicalExpertise', type: 'radio',
    text: 'Öğrenci bir beceriyi seansta yapıyor ama evde yapmıyor. "Genelleme" hatası nerede olabilir?',
    weightedOptions: [
      { label: 'Uyaran Kontrolü (Stimulus Control): Beceri, sadece benim ses tonuma veya odadaki belirli bir uyarana bağımlı kalmış olabilir; uyaran çeşitlendirme protokolü uygularım.', weights: { clinical: 1.0, leadership: 0.7 }, analysisInsight: 'Derin Metodolojik Analiz.' },
      { label: 'Veli Hatası: Aile evde yanlış pekiştiriyor veya baskı yapıyordur.', weights: { clinical: 0.4, empathy: -0.5 }, analysisInsight: 'Suçlayıcı Yaklaşım.' },
      { label: 'Zeka Seviyesi: Çocuğun genelleme kapasitesi düşüktür.', weights: { clinical: -1.0 }, analysisInsight: 'Klinik Etiketleme ve Teslimiyet.' },
      { label: 'Ev Ödevi: Yeterince ödev verilmemiştir.', weights: { clinical: 0.1 }, analysisInsight: 'Yüzeysel Çözüm.' }
    ]
  },
  {
    id: 'clin_adv_10', category: 'technicalExpertise', type: 'radio',
    text: 'Klinik bir seansın "Etki Büyüklüğünü" (Effect Size) en iyi ne kanıtlar?',
    weightedOptions: [
      { label: 'Bağımsız Veri Trendi: Yardımlı denemelerden bağımsız denemelere geçişteki eğimin dikliği ve kalıcılık verisi.', weights: { clinical: 1.0, leadership: 0.9 }, analysisInsight: 'Veri Odaklı Profesyonellik.' },
      { label: 'Veli Mutluluğu: Ailenin "Hocam çok memnunuz" demesi.', weights: { clinical: 0.2, fit: 0.8 }, analysisInsight: 'Sosyal Onay Odaklılık.' },
      { label: 'Çocuğun Sevgisi: Çocuğun seansa koşa koşa gelmesi.', weights: { clinical: 0.4, empathy: 1.0 }, analysisInsight: 'İlişki Odaklılık.' },
      { label: 'Ders Sayısı: Ayda kaç seans yapıldığı.', weights: { clinical: -1.0 }, analysisInsight: 'Ticari Bakış Açısı.' }
    ]
  }
];
