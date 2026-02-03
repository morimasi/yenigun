
import { Question } from '../../types';

export const technoPedagogyQuestions: Question[] = [
  {
    id: 'tech_ped_1',
    category: 'developmentOpenness',
    type: 'radio',
    text: 'Sözel iletişimi kısıtlı bir vaka için tablet tabanlı bir AAC (Alternatif İletişim) uygulamasına geçilmesine karar verildi. İlk hafta tepkiniz nedir?',
    weightedOptions: [
      { 
        label: 'Uygulamanın arayüzünü vakanın kognitif seviyesine göre kişiselleştirir, tüm ekibin ve ailenin aynı sembol setini kullanması için bir "Dijital İletişim Protokolü" hazırlarım.', 
        weights: { developmentOpenness: 1.0, technicalExpertise: 1.0, clinical: 0.9 },
        analysisInsight: 'Sistemik teknoloji entegrasyonu becerisi yüksek.'
      },
      { 
        label: 'Çocuğun tablete bağımlı hale gelip gelmeyeceğini gözlemler, sadece seansın belirli kısımlarında kontrollü bir şekilde denemeler yaparım.', 
        weights: { developmentOpenness: 0.4, clinical: 0.7 },
        analysisInsight: 'Teknolojiye karşı temkinli/geleneksel yaklaşım.'
      }
    ]
  },
  {
    id: 'tech_ped_2',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Kurumda kullanılan veri takip yazılımında (örn: MIA), bir vakanın gelişim grafiğinin AI tarafından "kritik düşüş" uyarısı verdiğini gördünüz. Ne yaparsınız?',
    weightedOptions: [
      { 
        label: 'AI uyarısını ham verilerle karşılaştırır, çevresel değişkenleri (ilaç değişimi, ailevi durum vb.) analiz ederek müdahale planını acilen revize ederim.', 
        weights: { technicalExpertise: 1.0, clinical: 1.0, pedagogicalAnalysis: 0.9 },
        analysisInsight: 'Veri odaklı klinik karar verme yetisi.'
      },
      { 
        label: 'Yazılımın hata payı olabileceğini düşünerek 1-2 hafta daha kendi gözlemlerime devam eder, manuel tuttuğum notlara güvenirim.', 
        weights: { technicalExpertise: 0.3, developmentOpenness: 0.2 },
        analysisInsight: 'Algoritmik veriye direnç eğilimi.'
      }
    ]
  },
  {
    id: 'tech_ped_3',
    category: 'developmentOpenness',
    type: 'radio',
    text: 'Otizmli bir vakanın sosyal becerilerini geliştirmek için VR (Sanal Gerçeklik) gözlüğü ile "Market Alışverişi" simülasyonu önerildi. Tavrınız?',
    weightedOptions: [
      { 
        label: 'Vakanın duyusal hassasiyetlerini (vestibüler/görsel) check eder, VR seanslarını ko-regülasyon desteğiyle minimum süreden başlatarak aşamalı olarak artırırım.', 
        weights: { developmentOpenness: 1.0, clinical: 1.0, technicalExpertise: 0.8 },
        analysisInsight: 'İnovasyonu klinik güvenlik filtresiyle harmanlıyor.'
      },
      { 
        label: 'VR teknolojisinin özel eğitimde henüz deneysel olduğunu savunur, gerçek market gezilerinin yerini tutamayacağını belirterek reddederim.', 
        weights: { developmentOpenness: 0.1, sustainability: 0.6 },
        analysisInsight: 'Değişim direnci yüksek, gelenekselci profil.'
      }
    ]
  },
  {
    id: 'tech_ped_4',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'KVKK ve veri güvenliği açısından, bir vakanın seans videosunu analiz için kendi kişisel telefonunuzla çekip kurumun ortak WhatsApp grubuna atar mısınız?',
    weightedOptions: [
      { 
        label: 'Asla. Bu durumun ciddi bir güvenlik ihlali olduğunu bilirim; görüntüleri sadece kurumun onaylı bulut sistemine, uçtan uca şifreli ve vaka koduyla yüklerim.', 
        weights: { technicalExpertise: 1.0, workEthics: 1.0 },
        analysisInsight: 'Dijital etik ve veri güvenliği bilinci tam.'
      },
      { 
        label: 'Ekip içi hızlı çözüm üretmek adına, videoyu analiz ettikten hemen sonra sileceksem sakınca görmem.', 
        weights: { technicalExpertise: 0.2, workEthics: 0.1 },
        analysisInsight: 'Kritik dijital güvenlik riski.'
      }
    ]
  },
  {
    id: 'tech_ped_5',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Göz takip (Eye-tracking) teknolojisi kullanan ağır fiziksel engelli bir öğrencide, sistem sürekli kalibrasyon hatası veriyorsa pedagojik b planınız nedir?',
    weightedOptions: [
      { 
        label: 'Bilişsel yorgunluğu azaltmak için düşük teknolojili (low-tech) göz kontağı tahtalarına (E-Tran) döner, donanımsal sorunu teknik ekibe bildirirken eğitimi kesmem.', 
        weights: { pedagogicalAnalysis: 1.0, technicalExpertise: 0.9, clinical: 1.0 },
        analysisInsight: 'Teknoloji krizinde yüksek adaptasyon yeteneği.'
      },
      { 
        label: 'Sistem düzelene kadar seansı "dinlenme" veya "pasif egzersiz" moduna çeker, cihazın tamir edilmesini beklerim.', 
        weights: { pedagogicalAnalysis: 0.3, sustainability: 0.4 },
        analysisInsight: 'Donanım bağımlılığı, süreç yönetimi zayıf.'
      }
    ]
  },
  {
    id: 'tech_ped_6',
    category: 'developmentOpenness',
    type: 'radio',
    text: 'Yapay zeka tabanlı bir sistem (örn: Gemini), vakanızın BEP hedeflerinde sizin fark etmediğiniz bir metodolojik hatayı tespit etti. Reaksiyonunuz?',
    weightedOptions: [
      { 
        label: 'Uyarının teknik gerekçesini akademik literatürle kıyaslar, eğer bilimsel bir temeli varsa hatamı kabul eder ve planı "Sürekli Gelişim" ilkesiyle güncellerim.', 
        weights: { developmentOpenness: 1.0, technicalExpertise: 1.0, pedagogicalAnalysis: 0.9 },
        analysisInsight: 'Açık fikirli ve analitik akademik kimlik.'
      },
      { 
        label: 'Vakayı bizzat görenin ben olduğumu, algoritmanın klinik sezgilere sahip olamayacağını savunarak AI önerisini devre dışı bırakırım.', 
        weights: { developmentOpenness: 0.2, personality: 0.6 },
        analysisInsight: 'Mesleki narsisizm ve teknolojik bariyer.'
      }
    ]
  },
  {
    id: 'tech_ped_7',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Görüntülü tele-rehabilitasyon seansında vakanın dikkati çok çabuk dağılıyorsa, hangi dijital stratejiyi önceliklendirirsiniz?',
    weightedOptions: [
      { 
        label: 'Ekranda dinamik ve interaktif "gamification" (oyunlaştırma) araçlarını kullanır, seans süresini kısaltıp frekansını artırarak bilişsel yükü yönetirim.', 
        weights: { technicalExpertise: 1.0, pedagogicalAnalysis: 1.0, developmentOpenness: 0.9 },
        analysisInsight: 'Uzaktan eğitim metodolojisi hakimiyeti.'
      },
      { 
        label: 'Ekrana daha çok odaklanması için veliye çocuğun arkasında durup fiziksel yönlendirme (prompt) yapmasını söylerim.', 
        weights: { technicalExpertise: 0.4, clinical: 0.5 },
        analysisInsight: 'Geleneksel yöntemi dijitale zorlama eğilimi.'
      }
    ]
  },
  {
    id: 'tech_ped_8',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Bir öğrencinin takıntılı olduğu bir video oyununu (örn: Minecraft), matematik hedeflerine ulaşmak için bir "Eğitim Alanı" olarak kullanır mısınız?',
    weightedOptions: [
      { 
        label: 'Evet; oyun içi mekanikleri (blok sayma, alan hesaplama) BEP hedefleriyle eşleştirir, "Doğal Öğretim"i dijital dünyaya taşırım.', 
        weights: { pedagogicalAnalysis: 1.0, developmentOpenness: 1.0, clinical: 0.9 },
        analysisInsight: 'Yaratıcı tekno-pedagojik vizyon.'
      },
      { 
        label: 'Hayır; oyunları sadece ders sonu ödülü olarak saklarım, eğitim ve eğlence sınırlarının karışmasının odağı bozacağını düşünürüm.', 
        weights: { pedagogicalAnalysis: 0.5, clinical: 0.6 },
        analysisInsight: 'Geleneksel pekiştireç yönetimi.'
      }
    ]
  },
  {
    id: 'tech_ped_9',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Vakanın evdeki davranışlarını takip etmek için kullanılan bir "Giyilebilir Teknoloji" (örn: akıllı bileklik) çocukta duyusal rahatsızlık yarattı. Kararınız?',
    weightedOptions: [
      { 
        label: 'Duyusal bütünleme ilkeleri gereği cihazı hemen çıkarırım; verinin, çocuğun duyusal regülasyonundan daha değerli olmadığını bilirim ve temassız takip yöntemleri ararım.', 
        weights: { clinical: 1.0, technicalExpertise: 1.0, workEthics: 0.9 },
        analysisInsight: 'Klinik önceliklendirme dengesi mükemmel.'
      },
      { 
        label: 'Alışması için desensitizasyon çalışması yapar, veri akışının kesilmemesi için bilekliği takması konusunda ısrarcı olurum.', 
        weights: { clinical: 0.3, technicalExpertise: 0.5 },
        analysisInsight: 'Teknoloji odaklı klinik ihmal riski.'
      }
    ]
  },
  {
    id: 'tech_ped_10',
    category: 'developmentOpenness',
    type: 'radio',
    text: 'Kurum genelinde "Kağıtsız Ofis" ve tamamen dijital raporlama sistemine geçildi. Bu değişime karşı tutumunuz nedir?',
    weightedOptions: [
      { 
        label: 'Hızla adapte olur, dijital raporlamanın sağladığı "Geriye Dönük Veri Analizi" imkanını vaka başarı oranlarımı artırmak için bir avantaja dönüştürürüm.', 
        weights: { developmentOpenness: 1.0, technicalExpertise: 0.9, institutionalLoyalty: 1.0 },
        analysisInsight: 'Yüksek kurumsal ve teknolojik uyum.'
      },
      { 
        label: 'Kağıt üzerindeki notların klinik ruhu daha iyi yansıttığını savunur, dijital sistemin iş yükümü artırdığını düşünerek eski sisteme direnç gösteririm.', 
        weights: { developmentOpenness: 0.1, institutionalLoyalty: 0.3 },
        analysisInsight: 'Kurumsal inovasyona direnç.'
      }
    ]
  }
];
