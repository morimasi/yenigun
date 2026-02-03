
import { Question } from '../../types';

export const technoPedagogyQuestions: Question[] = [
  {
    id: 'tech_ped_1', category: 'developmentOpenness', type: 'radio',
    text: 'Sözel iletişimi kısıtlı bir vaka için tablet tabanlı bir AAC (Alternatif İletişim) uygulamasına geçilmesine karar verildi. İlk hafta tepkiniz nedir?',
    weightedOptions: [
      { label: 'Uygulamanın arayüzünü vakanın kognitif seviyesine göre kişiselleştirir, tüm ekibin ve ailenin aynı sembol setini kullanması için bir "Dijital İletişim Protokolü" hazırlarım.', weights: { developmentOpenness: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Sistemik teknoloji entegrasyonu becerisi yüksek.' },
      { label: 'Çocuğun tablete bağımlı hale gelip gelmeyeceğini gözlemler, sadece seansın belirli kısımlarında kontrollü denemeler yaparım.', weights: { developmentOpenness: 0.4, clinical: 0.7 }, analysisInsight: 'Teknolojiye karşı temkinli/geleneksel yaklaşım.' }
    ]
  },
  {
    id: 'tech_ped_2', category: 'technicalExpertise', type: 'radio',
    text: 'Kurumda kullanılan veri takip yazılımında, bir vakanın gelişim grafiğinin AI tarafından "kritik düşüş" uyarısı verdiğini gördünüz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'AI uyarısını ham verilerle karşılaştırır, çevresel değişkenleri analiz ederek müdahale planını acilen revize ederim.', weights: { technicalExpertise: 1.0, clinical: 1.0 }, analysisInsight: 'Veri odaklı klinik karar verme yetisi.' },
      { label: 'Yazılımın hata payı olabileceğini düşünerek manuel tuttuğum notlara güvenirim.', weights: { technicalExpertise: 0.3, developmentOpenness: 0.2 }, analysisInsight: 'Algoritmik veriye direnç eğilimi.' }
    ]
  },
  {
    id: 'tech_ped_3', category: 'developmentOpenness', type: 'radio',
    text: 'Vakanın sosyal becerileri için VR (Sanal Gerçeklik) simülasyonu önerildi. Tavrınız?',
    weightedOptions: [
      { label: 'Vakanın duyusal hassasiyetlerini check eder, VR seanslarını ko-regülasyon desteğiyle minimum süreden başlatırım.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'İnovasyonu klinik güvenlik filtresiyle harmanlıyor.' },
      { label: 'VR teknolojisinin özel eğitimde henüz deneysel olduğunu savunur ve reddederim.', weights: { developmentOpenness: 0.1, sustainability: 0.6 }, analysisInsight: 'Değişim direnci yüksek.' }
    ]
  },
  {
    id: 'tech_ped_4', category: 'technicalExpertise', type: 'radio',
    text: 'Bir vakanın seans videosunu analiz için kendi kişisel telefonunuzla çekip WhatsApp grubuna atar mısınız?',
    weightedOptions: [
      { label: 'Asla. Görüntüleri sadece kurumun onaylı ve şifreli bulut sistemine vaka koduyla yüklerim.', weights: { technicalExpertise: 1.0, workEthics: 1.0 }, analysisInsight: 'Dijital etik ve veri güvenliği bilinci tam.' },
      { label: 'Ekip içi hızlı çözüm üretmek adına, analizden sonra sileceksem sakınca görmem.', weights: { technicalExpertise: 0.2, workEthics: 0.1 }, analysisInsight: 'Kritik dijital güvenlik riski.' }
    ]
  },
  {
    id: 'tech_ped_5', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Göz takip (Eye-tracking) teknolojisi kullanan öğrencide sistem hata veriyorsa b planınız nedir?',
    weightedOptions: [
      { label: 'Bilişsel yorgunluğu azaltmak için düşük teknolojili göz kontağı tahtalarına döner, eğitimi kesmem.', weights: { pedagogicalAnalysis: 1.0, clinical: 1.0 }, analysisInsight: 'Teknoloji krizinde yüksek adaptasyon.' },
      { label: 'Sistem düzelene kadar seansı pasif egzersiz moduna çeker, tamir beklerim.', weights: { pedagogicalAnalysis: 0.3, sustainability: 0.4 }, analysisInsight: 'Donanım bağımlılığı.' }
    ]
  },
  {
    id: 'tech_ped_6', category: 'developmentOpenness', type: 'radio',
    text: 'AI, vakanızın BEP hedeflerinde bir metodolojik hata tespit etti. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Teknik gerekçeyi literatürle kıyaslar, bilimsel temeli varsa hatamı kabul edip planı güncellerim.', weights: { developmentOpenness: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Açık fikirli akademik kimlik.' },
      { label: 'Vakayı bizzat görenin ben olduğumu savunarak AI önerisini reddederim.', weights: { developmentOpenness: 0.2, personality: 0.6 }, analysisInsight: 'Mesleki narsisizm bariyeri.' }
    ]
  },
  {
    id: 'tech_ped_7', category: 'technicalExpertise', type: 'radio',
    text: 'Tele-rehabilitasyon seansında vakanın dikkati çabuk dağılıyorsa stratejiniz ne olur?',
    weightedOptions: [
      { label: 'İnteraktif gamification araçlarını kullanır, seans süresini kısaltıp frekansını artırırım.', weights: { technicalExpertise: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Uzaktan eğitim metodolojisi hakimiyeti.' },
      { label: 'Veliye çocuğun arkasında durup fiziksel yönlendirme yapmasını söylerim.', weights: { technicalExpertise: 0.4, clinical: 0.5 }, analysisInsight: 'Geleneksel yöntemi dijitale zorlama.' }
    ]
  },
  {
    id: 'tech_ped_8', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Öğrencinin takıntılı olduğu video oyununu (örn: Minecraft) eğitim alanı olarak kullanır mısınız?',
    weightedOptions: [
      { label: 'Evet; oyun içi mekanikleri BEP hedefleriyle eşleştirir, "Doğal Öğretim"i dijital dünyaya taşırım.', weights: { pedagogicalAnalysis: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Yaratıcı tekno-pedagojik vizyon.' },
      { label: 'Hayır; oyunları sadece ders sonu ödülü olarak saklarım, odağı bozacağını düşünürüm.', weights: { pedagogicalAnalysis: 0.5, clinical: 0.6 }, analysisInsight: 'Geleneksel pekiştireç yönetimi.' }
    ]
  },
  {
    id: 'tech_ped_9', category: 'technicalExpertise', type: 'radio',
    text: 'Vakanın takibinde kullanılan giyilebilir teknoloji çocukta duyusal rahatsızlık yarattı. Kararınız?',
    weightedOptions: [
      { label: 'Cihazı hemen çıkarırım; veri, çocuğun duyusal regülasyonundan daha değerli değildir.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Klinik önceliklendirme dengesi mükemmel.' },
      { label: 'Alışması için desensitizasyon çalışması yapar, takması konusunda ısrarcı olurum.', weights: { clinical: 0.3, technicalExpertise: 0.5 }, analysisInsight: 'Teknoloji odaklı klinik ihmal.' }
    ]
  },
  {
    id: 'tech_ped_10', category: 'developmentOpenness', type: 'radio',
    text: 'Kurum tamamen dijital raporlama sistemine geçti. Tutumunuz?',
    weightedOptions: [
      { label: 'Hızla adapte olur, dijital verinin sağladığı geriye dönük analiz imkanını avantaja dönüştürürüm.', weights: { developmentOpenness: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek kurumsal ve teknolojik uyum.' },
      { label: 'Kağıt üzerindeki notların ruhu daha iyi yansıttığını savunur, direnç gösteririm.', weights: { developmentOpenness: 0.1, institutionalLoyalty: 0.3 }, analysisInsight: 'Kurumsal inovasyona direnç.' }
    ]
  }
];
