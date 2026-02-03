import { Question } from '../../types';

export const technoPedagogyQuestions: Question[] = [
  {
    id: 'tech_1', category: 'developmentOpenness', type: 'radio',
    text: 'Bir vaka için tablet tabanlı bir eğitim uygulaması kullanmaya karar verildi. Tavrınız?',
    weightedOptions: [
      { label: 'Uygulamayı vakanın zayıf yönlerini "destekleyen" bir asistan gibi kullanırım; teknolojiyi pedagojimin merkezine değil, yanına koyarım.', weights: { developmentOpenness: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Bilinçli Teknoloji Entegrasyonu.' },
      { label: 'Teknolojinin çocuk üzerindeki etkisinden çekinirim; klasik kartların ve fiziksel temasın yerini asla tutamayacağını düşünür, çok kısıtlı kullanırım.', weights: { developmentOpenness: 0.3, clinical: 0.8 }, analysisInsight: 'Gelenekselci / Teknoloji Mesafeli.' }
    ]
  },
  {
    id: 'tech_2', category: 'technicalExpertise', type: 'radio',
    text: 'Yapay zeka tabanlı bir veri takip sistemi (örn: MIA) size vakanızın durakladığını raporladı. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Algoritmanın uyarısını ciddiye alırım, müdahale planımı hemen revize eder ve yeni stratejiler geliştiririm.', weights: { technicalExpertise: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Veri Odaklı ve Çevik Uzman.' },
      { label: 'Kendi gözlemlerime daha çok güvenirim; yazılımın vakanın o günkü ruh halini veya fiziksel durumunu anlamayacağını düşünerek planımı değiştirmem.', weights: { technicalExpertise: 0.4, personality: 0.7 }, analysisInsight: 'Sezgisel / Yazılım Dirençli.' }
    ]
  },
  {
    id: 'tech_3', category: 'developmentOpenness', type: 'radio',
    text: 'Sözel olmayan bir vaka için yüksek teknolojili bir AAC (Alternatif İletişim) cihazı önerildi. İlk haftanız nasıl geçer?',
    weightedOptions: [
      { label: 'Cihazın tüm teknik detaylarını öğrenir, aileye ve tüm personele eğitim vererek sistemi 24 saatlik bir yaşam modeline çeviririm.', weights: { developmentOpenness: 1.0, leadership: 1.0 }, analysisInsight: 'Sistem Kurucu ve Adaptör.' },
      { label: 'Cihazı sadece seanslarımda denetirim; vakanın cihazı bozmasından veya bağımlı olmasından çekinerek süreci yavaşlatırım.', weights: { developmentOpenness: 0.2, sustainability: 0.6 }, analysisInsight: 'Korumacı ve Düşük Adaptasyon.' }
    ]
  },
  {
    id: 'tech_4', category: 'technicalExpertise', type: 'radio',
    text: 'Bir vakanın gelişimini kaydetmek için kağıt mı yoksa dijital form mu tercih edersiniz?',
    weightedOptions: [
      { label: 'Dijital; verilerin analiz edilmesi, grafiklere dökülmesi ve geçmişe dönük kıyas yapılması liyakatim için şarttır.', weights: { technicalExpertise: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Modern ve Arşivci.' },
      { label: 'Kağıt; o anki gözlemlerimi ve "klinik hislerimi" kağıda dökmenin daha gerçekçi ve samimi olduğuna inanırım.', weights: { technicalExpertise: 0.5, personality: 0.8 }, analysisInsight: 'Klasik ve Romantik Profesyonel.' }
    ]
  },
  {
    id: 'tech_5', category: 'developmentOpenness', type: 'radio',
    text: 'Otizm seanslarında VR (Sanal Gerçeklik) gözlüğü kullanımı hakkında ne düşünürsünüz?',
    weightedOptions: [
      { label: 'Heyecan verici; sosyal becerileri (market, okul vb.) güvenli bir simülasyonda denemek vaka için büyük bir sıçrama olabilir.', weights: { developmentOpenness: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'İnovasyon Dostu.' },
      { label: 'Riskli; duyusal hassasiyetleri tetikleyebilir ve çocuğu gerçek dünyadan daha çok koparabilir, kesinlikle karşı çıkarım.', weights: { developmentOpenness: 0.1, clinical: 0.6 }, analysisInsight: 'Kritikçi ve Bariyer Odaklı.' }
    ]
  },
  {
    id: 'tech_6', category: 'technicalExpertise', type: 'radio',
    text: 'Uzaktan eğitim (Tele-rehabilitasyon) sürecinde veliye nasıl rehberlik edersiniz?',
    weightedOptions: [
      { label: 'Veliyi bir "terapist yardımcısı" gibi eğitir, ekran karşısında benim komutlarımla uygulamayı ona yaptırarak yetkinleştiririm.', weights: { technicalExpertise: 1.0, leadership: 0.9 }, analysisInsight: 'Süreç Yöneticisi ve Eğitmen.' },
      { label: 'Sadece çocuğun ekran karşısında oturmasını sağlar, dikkatini çekmek için dijital oyunlar ve animasyonlar kullanırım.', weights: { technicalExpertise: 0.4, pedagogicalAnalysis: 0.6 }, analysisInsight: 'Kısıtlı ve Araç Odaklı.' }
    ]
  },
  {
    id: 'tech_7', category: 'developmentOpenness', type: 'radio',
    text: 'Yeni bir bilimsel eğitim portalı açıldı ve ücretli. Kurumun karşılamasını beklemeden üye olur musunuz?',
    weightedOptions: [
      { label: 'Evet; kendi gelişimim kurumun bütçesinden bağımsızdır, en güncel bilgiyi ilk ben öğrenmeliyim.', weights: { developmentOpenness: 1.0, integrity: 1.0 }, analysisInsight: 'Öz-Gelişim Motivasyonu Yüksek.' },
      { label: 'Hayır; kurum personeline bu imkanları sağlamalıdır, cebimden yatırım yapmayı profesyonel bulmam.', weights: { developmentOpenness: 0.3, institutionalLoyalty: 0.4 }, analysisInsight: 'Sınırları Belirli ve Beklentili.' }
    ]
  },
  {
    id: 'tech_8', category: 'technicalExpertise', type: 'radio',
    text: 'Çocuğun takıntılı olduğu bir video oyununu dersin içine entegre eder misiniz?',
    weightedOptions: [
      { label: 'Evet; oyun içindeki mekanikleri matematik veya iletişim hedefleri için bir "laboratuvar" gibi kullanırım.', weights: { technicalExpertise: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Yaratıcı Tekno-Pedagog.' },
      { label: 'Hayır; oyunları sadece ders sonu ödülü olarak saklarım, eğitim ciddiyeti ile eğlenceyi karıştırmam.', weights: { technicalExpertise: 0.5, clinical: 0.6 }, analysisInsight: 'Geleneksel Metotçu.' }
    ]
  },
  {
    id: 'tech_9', category: 'developmentOpenness', type: 'radio',
    text: 'Eğitimde "Kodlama" mantığının özel gereksinimli çocuklara öğretilmesi hakkında fikriniz?',
    weightedOptions: [
      { label: 'Harika bir planlama ve algoritma becerisi kazandırır; vakanın bilişsel esnekliğini artırmak için şarttır.', weights: { developmentOpenness: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Kognitif Mimar.' },
      { label: 'Gereksiz; temel okuma-yazma bile tam değilken vakanın vaktini bu tarz karmaşık işlerle harcamamalıyız.', weights: { developmentOpenness: 0.2, sustainability: 0.5 }, analysisInsight: 'Mevcut Durum Odaklı / Pragmatik.' }
    ]
  },
  {
    id: 'tech_10', category: 'technicalExpertise', type: 'radio',
    text: 'Kurum genelinde tüm raporların AI desteğiyle yazılmasına karar verildi. Tepkiniz?',
    weightedOptions: [
      { label: 'Büyük bir zaman kazancı olarak görürüm; kalan vakti vaka analizine ve yeni materyallere ayırırım.', weights: { technicalExpertise: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Verimlilik Odaklı Dijital Yerli.' },
      { label: 'Raporun "insani ruhunu" öldürdüğünü düşünür, gizlice kendi manuel notlarımı tutmaya devam ederim.', weights: { technicalExpertise: 0.3, personality: 0.7 }, analysisInsight: 'Gelenekselci / Güven Odaklı.' }
    ]
  }
];