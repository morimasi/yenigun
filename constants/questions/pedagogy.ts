import { Question } from '../../types';

export const pedagogyQuestions: Question[] = [
  {
    id: 'ped_1', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Öğrenci bir konuyu öğrenmekte çok zorlanıyor ve pes etme eğiliminde. Tavrınız hangisidir?',
    weightedOptions: [
      { label: 'Konuyu çocuğun en sevdiği oyunun içine "fark ettirmeden" yediririm. Başarı hissini yapay yollarla olsa da tattırıp motivasyonunu geri kazanmasını sağlarım.', weights: { pedagogicalAnalysis: 1.0, empathy: 1.0 }, analysisInsight: 'Esnek ve Motivasyon Odaklı.' },
      { label: 'Öğrenme hedefini daha küçük parçalara böler, her doğru adımda pekiştireç veririm. Çocuğa zorluklarla sistematik bir şekilde başa çıkma disiplini kazandırmayı öncelerim.', weights: { pedagogicalAnalysis: 0.9, technicalExpertise: 1.0 }, analysisInsight: 'Sistematik ve Disiplinli.' }
    ]
  },
  {
    id: 'ped_2', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Sınıf yönetiminde "kurallar" sizin için ne ifade eder?',
    weightedOptions: [
      { label: 'Kurallar esnektir; vakanın o günkü duyusal durumuna, uykusuna veya moraline göre yeniden şekillenebilir. Önemli olan çocuğun sınıfta "mutlu" kalmasıdır.', weights: { pedagogicalAnalysis: 1.0, empathy: 1.0 }, analysisInsight: 'Hümanist ve Esnek Yönetici.' },
      { label: 'Kurallar güven verir; her vaka sınıfa girdiğinde ne ile karşılaşacağını ve sınırlarını net bilmelidir. Tutarlılık, uzun vadeli akademik başarının temel anahtarıdır.', weights: { pedagogicalAnalysis: 0.8, technicalExpertise: 1.0 }, analysisInsight: 'Kuralcı ve Stabil Yönetici.' }
    ]
  },
  {
    id: 'ped_3', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Bir öğrenciye "geribildirim" verirken hangisini daha sık kullanırsınız?',
    weightedOptions: [
      { label: 'Sürece odaklanırım: "Bu problemi çözerken kullandığın yöntem harikaydı, ne kadar çok uğraştığını gördüm."', weights: { pedagogicalAnalysis: 1.0, sustainability: 1.0 }, analysisInsight: 'Gelişim Zihniyeti (Growth Mindset) Destekçisi.' },
      { label: 'Sonuca odaklanırım: "Harikasın, bu testi hatasız bitirdin, sen gerçekten çok akıllı bir çocuksun."', weights: { pedagogicalAnalysis: 0.4, clinical: 0.5 }, analysisInsight: 'Sabit Zihniyet (Fixed Mindset) Eğilimi.' }
    ]
  },
  {
    id: 'ped_4', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Vygotsky\'nin "ZPD" (Yakınsal Gelişim Alanı) kavramını seansınızda nasıl yaşatırsınız?',
    weightedOptions: [
      { label: 'Çocuğun zorlandığı yerde desteği (scaffolding) hemen veririm, başarma hızını artırarak hüsran yaşamasını engellerim.', weights: { pedagogicalAnalysis: 0.9, empathy: 0.8 }, analysisInsight: 'Destekleyici ve Koruyucu.' },
      { label: 'Çocuğun biraz "zorlanmasına" ve çözüm ararken terlemesine izin veririm. Yardımı sadece tıkandığı son noktada vererek bilişsel kaslarını güçlendiririm.', weights: { pedagogicalAnalysis: 1.0, clinical: 1.0 }, analysisInsight: 'Kognitif Gelişimi Zorlayan Mentor.' }
    ]
  },
  {
    id: 'ped_5', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Ders sırasında kontrolünüz dışındaki bir dış uyaran (yüksek ses, elektrik kesintisi vb.) öğrenciyi korkuttu. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Dersi hemen durdurur, çocuğun duygusunu regüle etmesine odaklanırım. Akademik hedefi o gün için feda edebilirim.', weights: { pedagogicalAnalysis: 1.0, empathy: 1.0 }, analysisInsight: 'Ko-Regülasyon ve Güven Odaklı.' },
      { label: 'Kısa bir sakinleşme sonrası "bak bir şey olmadı" diyerek dikkati hemen işe geri çekerim. Akademik rutinin korunmasının çocuğu daha hızlı normale döndüreceğine inanırım.', weights: { pedagogicalAnalysis: 0.6, sustainability: 0.9 }, analysisInsight: 'Rutin ve Görev Odaklı.' }
    ]
  },
  {
    id: 'ped_6', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Bloom Taksonomisine göre, özel eğitimde "yaratıcılık" seviyesine çıkmak mümkün müdür?',
    weightedOptions: [
      { label: 'Evet; vakanın tanısı ne olursa olsun, öğrendiği bir beceriyi yeni bir duruma uyarlaması (genelleme) en üst düzey yaratıcılıktır ve ana hedefimdir.', weights: { pedagogicalAnalysis: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Yüksek Beklenti ve Vizyoner.' },
      { label: 'Zordur; vakalarımızın çoğu "hatırlama ve uygulama" düzeyinde güvenli kalmalıdır. Temel becerilerin otomatiğe bağlanması yaratıcılıktan daha önceliklidir.', weights: { pedagogicalAnalysis: 0.4, clinical: 0.7 }, analysisInsight: 'Realist ve Kısıtlı Hedef Odaklı.' }
    ]
  },
  {
    id: 'ped_7', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Gardner\'ın Çoklu Zeka kuramını derslerinizde nasıl kullanırsınız?',
    weightedOptions: [
      { label: 'Her vakanın baskın zekasını (müzik, doğa, görsel vb.) tespit eder ve akademik konuyu o kapıdan içeri sokarım.', weights: { pedagogicalAnalysis: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Bireyselleştirilmiş Eğitim Mimarı.' },
      { label: 'Çocuğun zayıf olduğu zeka alanlarını güçlendirmeye çalışırım; eksik olan tarafı onarmak benim birincil görevimdir.', weights: { pedagogicalAnalysis: 0.7, sustainability: 0.8 }, analysisInsight: 'Onarım ve Telafi Odaklı.' }
    ]
  },
  {
    id: 'ped_8', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Öğrenci bir hatasını kendi fark edip düzelttiğinde reaksiyonunuz ne olur?',
    weightedOptions: [
      { label: 'Çok büyük bir coşkuyla pekiştiririm. "Öz-denetim" (self-monitoring) becerisini en üst düzey akademik başarı olarak görürüm.', weights: { pedagogicalAnalysis: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Üst-Bilişsel Gelişim Destekçisi.' },
      { label: 'Sadece "Aferin, doğrusu buydu" der ve devam ederim. Hata yapmaması zaten asıl hedefimdir, düzeltmesini normalleştiririm.', weights: { pedagogicalAnalysis: 0.4, clinical: 0.5 }, analysisInsight: 'Sonuç ve Hatasızlık Odaklı.' }
    ]
  },
  {
    id: 'ped_9', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Ders materyallerini hazırlarken hangisi sizi daha çok heyecanlandırır?',
    weightedOptions: [
      { label: 'Çocuğun elinden bırakmak istemeyeceği kadar eğlenceli ve oyunsu bir materyal tasarlamak.', weights: { pedagogicalAnalysis: 1.0, empathy: 0.9 }, analysisInsight: 'Yaratıcı ve Motivasyon Ustası.' },
      { label: 'Bilimsel verileri en net şekilde toplamamı sağlayacak, ölçülebilir ve sade bir materyal hazırlamak.', weights: { pedagogicalAnalysis: 0.8, technicalExpertise: 1.0 }, analysisInsight: 'Analitik ve Veri Mühendisi.' }
    ]
  },
  {
    id: 'ped_10', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Mezun ettiğiniz bir öğrencinin ardından hissettiğiniz en güçlü duygu hangisidir?',
    weightedOptions: [
      { label: 'Onunla kurduğum o derin insani bağın eksikliğini hissetmek; bir çocuğun hayatına dokunmuş olmanın huzuru.', weights: { pedagogicalAnalysis: 0.9, empathy: 1.0 }, analysisInsight: 'Duygusal ve İnsan Odaklı.' },
      { label: 'Vakayı "bilimsel bir başarı hikayesi" olarak arşive eklemenin ve liyakatimi kanıtlamış olmanın gururu.', weights: { pedagogicalAnalysis: 1.0, integrity: 0.9 }, analysisInsight: 'Profesyonel ve Başarı Odaklı.' }
    ]
  }
];