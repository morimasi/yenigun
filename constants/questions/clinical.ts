
import { Question, Branch } from '../../types';

export const clinicalQuestions: Question[] = [
  // --- KLİNİK YETERLİLİK ---
  {
    id: 'clin_new_1', category: 'technicalExpertise', type: 'radio',
    text: 'Çok yoğun bir "Sönme Patlaması" (Burst) yaşayan çocukta, güvenlik riski yoksa ancak diğer sınıflar sesten rahatsız oluyorsa ne yaparsınız?',
    weightedOptions: [
      { label: 'Diğer sınıflardan özür dilerim ama prosedürü bozmam; sönme patlamasında geri adım atmak davranışı daha da güçlendirir.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Katı Klinik Disiplin.' },
      { label: 'Çocuğu hemen kurum dışına veya ses yalıtımlı odaya çıkarırım; kurum huzuru seans veriminden öncedir.', weights: { clinical: 0.6, institutionalLoyalty: 0.8 }, analysisInsight: 'Kurum Odaklı Yaklaşım.' }
    ]
  },
  {
    id: 'clin_new_2', category: 'technicalExpertise', type: 'radio',
    text: 'Vakanın gelişimi için çok kritik ama ailenin maddi olarak zorlanacağı bir ek materyal/cihaz önerisi yapmanız gerekiyor. Tavrınız?',
    weightedOptions: [
      { label: 'Ailenin bütçesini düşünmeden en etkili bilimsel yolu önerir, kararı onlara bırakırım. Klinik doğru esnetilemez.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Saf Klinisyen.' },
      { label: 'Daha az etkili olsa da ailenin alabileceği muadil yollar ararım; sürdürülebilirlik kaliteden önemlidir.', weights: { clinical: 0.5, empathy: 1.0 }, analysisInsight: 'Empatik Pragmatist.' }
    ]
  },
  {
    id: 'clin_new_3', category: 'technicalExpertise', type: 'radio',
    text: 'Bir beceri öğretiminde "Hatasız Öğretim" mi yoksa "Doğal Deneme" mi? Çocuk hata yaptığında çok çabuk pes ediyorsa?',
    weightedOptions: [
      { label: 'Hata yapmasına asla izin vermem, ipucunu en baştan en yoğun seviyede veririm (Most-to-Least).', weights: { clinical: 0.9, technicalExpertise: 1.0 }, analysisInsight: 'Başarı Odaklılık.' },
      { label: 'Hata yapmasına izin verir, hatadan öğrenmesini sağlarım; bu dayanıklılığını artırır.', weights: { clinical: 0.7, sustainability: 0.9 }, analysisInsight: 'Direnç Odaklılık.' }
    ]
  },
  {
    id: 'clin_new_4', category: 'technicalExpertise', type: 'radio',
    text: 'VB-MAPP değerlendirmesinde bir alanın şişirildiğini (gerçekten yüksek olmadığını) fark ettiniz ama veli bu skora çok sevinmiş. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Veliyi hemen bilgilendirir ve skoru aşağı çekerim. Yanlış veri üzerine plan kurulamaz.', weights: { clinical: 1.0, workEthics: 1.0 }, analysisInsight: 'Yüksek Etik Bütünlük.' },
      { label: 'Veliye çaktırmadan planı basitleştirir, verileri zamanla gerçeğe yaklaştırırım; aile motivasyonunu korurum.', weights: { clinical: 0.6, empathy: 0.9 }, analysisInsight: 'İlişki Odaklı Stratejist.' }
    ]
  },
  {
    id: 'clin_new_5', category: 'technicalExpertise', type: 'radio',
    text: 'Çalıştığınız yöntemin vaka üzerinde etkisiz kaldığını 4 ay sonra kanıtlarla gördünüz. İlk refleksiniz?',
    weightedOptions: [
      { label: 'Kendi uygulama tekniğimi sorgular, süpervizyon alır ve aynı yöntemde derinleşmeye çalışırım.', weights: { clinical: 0.8, developmentOpenness: 0.9 }, analysisInsight: 'İçsel Denetimli.' },
      { label: 'Bu yöntemin bu çocuğun nöral profiline uygun olmadığını kabul eder, derhal farklı bir ekole (örn: ABA\'dan DIR\'a) geçerim.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Esnek Klinisyen.' }
    ]
  },
  {
    id: 'clin_new_6', category: 'technicalExpertise', type: 'radio',
    text: 'Seansın en verimli yerinde çocuk "Tuvaletim geldi" dedi ama bunun bir "kaçınma davranışı" olduğundan %100 eminsiniz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Risk almam, hemen tuvalete götürürüm. Fizyolojik ihtiyaç klinik hedeften üstündür.', weights: { clinical: 0.7, workEthics: 0.8 }, analysisInsight: 'Güvenli Alan Terapisti.' },
      { label: '"Şu görevi bitirelim sonra" diyerek talebi geciktiririm; kaçınma davranışını pekiştirmem.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Operant Koşullama Uzmanı.' }
    ]
  },
  {
    id: 'clin_new_7', category: 'technicalExpertise', type: 'radio',
    text: 'Ağır bir vaka için kurum dışından bir "Gölge Öğretmen" önerilmesi gerekiyor ama kurum müdürü buna karşı çıkıyor. Kararınız?',
    weightedOptions: [
      { label: 'Müdürle çatışmayı göze alır, vaka başarısı için gölge öğretmenin şart olduğunu bilimsel verilerle savunurum.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Vaka Avukatı.' },
      { label: 'Müdürün kararını uygular, mevcut şartlarda en iyisini yapmaya çalışırım.', weights: { clinical: 0.5, institutionalLoyalty: 1.0 }, analysisInsight: 'Hiyerarşik Uyum.' }
    ]
  },
  {
    id: 'clin_new_8', category: 'technicalExpertise', type: 'radio',
    text: 'Öğrenci bir "Stereotipi" (Sallanma vb.) sergiliyor ve bu durum ders odağını bozmuyor ama veli bunu "çirkin" buluyor. Müdahale eder misiniz?',
    weightedOptions: [
      { label: 'Hayır; çocuğun regülasyon aracıdır, odağı bozmuyorsa dokunmam. Veliye bunun işlevini anlatırım.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Modern Pedagoji.' },
      { label: 'Evet; toplum içinde dışlanmaması için o davranışı sosyal olarak kabul edilebilir bir davranışla yer değiştiririm.', weights: { clinical: 0.8, pedagogicalAnalysis: 0.9 }, analysisInsight: 'Normalizasyon Odaklı.' }
    ]
  },
  {
    id: 'clin_new_9', category: 'technicalExpertise', type: 'radio',
    text: 'Seans videosu izlerken kendi hatanızı fark ettiniz ama vaka raporu çoktan "başarılı" olarak girildi. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Raporu iptal eder, hatamı yazar ve seansı tekrar planlarım.', weights: { clinical: 1.0, workEthics: 1.0 }, analysisInsight: 'Dürüstlük Abidesi.' },
      { label: 'Raporu değiştirip kurumun verimlilik puanını düşürmem ama bir sonraki seansta hatamı telafi ederim.', weights: { clinical: 0.7, institutionalLoyalty: 0.8 }, analysisInsight: 'Pragmatik Profesyonel.' }
    ]
  },
  {
    id: 'clin_new_10', category: 'technicalExpertise', type: 'radio',
    text: 'Çoklu yetersizliği olan bir vakanın BEP toplantısında diğer uzmanlar (Ergoterapist, Dil Terapisti) sizin branşınıza müdahale ederse tepkiniz?',
    weightedOptions: [
      { label: '"Bu alan benim uzmanlığım" diyerek teknik sınırımı net çizerim.', weights: { clinical: 0.9, personality: 1.0 }, analysisInsight: 'Otoriter Uzman.' },
      { label: 'Önerilerini dinler, kendi klinik mantığımla süzüp ortak bir hedef belirlerim.', weights: { clinical: 1.0, sustainability: 1.0 }, analysisInsight: 'Takım Oyuncusu.' }
    ]
  },

  // --- PEDAGOJİK ALTYAPI ---
  {
    id: 'ped_new_1', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Çocuk yeni öğrendiği bir kelimeyi sadece sizinle kullanıyor, evde kullanmıyor. Sorun nerededir?',
    weightedOptions: [
      { label: 'Uyaran kontrolü bende kalmış; aileye yanlış eğitim veriyorum veya farklı ortam denemesi yapmadım.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Analitik Pedagoji.' },
      { label: 'Aile evde çocuğu pekiştirmiyor, tüm yük bende kalıyor.', weights: { clinical: 0.4, sustainability: 0.6 }, analysisInsight: 'Dışsal Suçlama Eğilimi.' }
    ]
  },
  {
    id: 'ped_new_2', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Okuma yazma aşamasındaki bir disleksi vakasında "Hız" mı "Doğruluk" mu?',
    weightedOptions: [
      { label: 'Hata biriktirmemesi için yavaş ama kusursuz gitmeyi tercih ederim.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Derinlik Odaklı.' },
      { label: 'Yanlış okusa da akıcılığı teşvik ederim; motivasyon kırılmamalı.', weights: { clinical: 0.6, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Motivasyon Odaklı.' }
    ]
  },
  {
    id: 'ped_new_3', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Bir beceriyi öğretirken çocuğun "İlgi Odağı" (örn: dinozorlar) programda yok ama çocuk sadece onunla etkileşim kuruyor. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Programı esnetir, tüm hedefleri dinozorlar üzerinden "Gömülü Öğretim" (Embedded) ile veririm.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Esnek Müfredat Yönetimi.' },
      { label: 'Dinozorları "Pekiştireç" olarak saklar, önce asıl müfredatı bitirmesini isterim.', weights: { clinical: 0.8, technicalExpertise: 0.9 }, analysisInsight: 'Geleneksel Disiplin.' }
    ]
  },
  {
    id: 'ped_new_4', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Çocuk masaya oturmayı reddediyor and sürekli yerde oynamak istiyor. Akademik dersi nasıl işlersiniz?',
    weightedOptions: [
      { label: 'Masayı kaldırırım. Yerde, onun seviyesinde akademik hedefleri oyunlaştırarak çalışırım.', weights: { clinical: 1.0, empathy: 0.9 }, analysisInsight: 'İlişki Odaklı.' },
      { label: 'Önce masaya oturma (Compliance) çalışır, akademik dersi ödül olarak masada veririm.', weights: { clinical: 0.7, technicalExpertise: 1.0 }, analysisInsight: 'Davranış Kontrolü.' }
    ]
  },
  {
    id: 'ped_new_5', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Geleneksel "Kartla Eğitim" mi yoksa "Doğal Ortamda (NET)" eğitim mi? Hangisi daha sürdürülebilirdir?',
    weightedOptions: [
      { label: 'Hayatın içinde öğretilmeyen hiçbir bilgi kalıcı değildir.', weights: { clinical: 1.0, sustainability: 1.0 }, analysisInsight: 'Fonksiyonel Pedagoji.' },
      { label: 'Önce temel beceriler sessiz ve steril bir odada kazanılmalı, sonra dışarı çıkarılmalı.', weights: { clinical: 0.8, technicalExpertise: 0.9 }, analysisInsight: 'Adım Adım Gelişim.' }
    ]
  },
  {
    id: 'ped_new_6', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Çocuğun "Öğrenme Hızı" (Learning Rate) beklentinizin çok altında kaldı. Kararınız?',
    weightedOptions: [
      { label: 'Basamağı daha küçük mikro-adımlara böler, başarı hissini artırırım.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Metodolojik Esneklik.' },
      { label: 'Aynı yöntemde ısrar eder, "geç öğrenme" periyodu olduğunu varsayarım.', weights: { clinical: 0.5, technicalExpertise: 0.6 }, analysisInsight: 'Sabırlı Ama Verimsiz.' }
    ]
  },
  {
    id: 'ped_new_7', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Görsel destekli bir "Sosyal Öykü" hazırladınız ama çocuk sadece resimlere bakıp gülüyor, metni anlamıyor. Çözümünüz?',
    weightedOptions: [
      { label: 'Resimleri gerçek fotoğraflarla değiştirir veya uyaran fazlalığını azaltırım.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Duyusal Analiz.' },
      { label: 'Hikayeyi videoya çeker, kendisini izlemesini sağlarım.', weights: { clinical: 0.9, developmentOpenness: 1.0 }, analysisInsight: 'Teknoloji Adaptasyonu.' }
    ]
  },
  {
    id: 'ped_new_8', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Çocuğun "Dili Anlama" kapasitesi "İfade Etme" kapasitesinden çok düşükse hangisine odaklanırsınız?',
    weightedOptions: [
      { label: 'Anlamadığı bir şeyi söylemesi mekaniktir; önce kavramları anlamasına yatırım yaparım.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Bilişsel Öncelik.' },
      { label: 'İletişim başlatması için kelime öğretimine (Mand) ağırlık veririm.', weights: { clinical: 0.7, technicalExpertise: 0.8 }, analysisInsight: 'Fonksiyonel Öncelik.' }
    ]
  },
  {
    id: 'ped_new_9', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Bir öğrencide "Taklit Becerileri" (Imitation) yoksa konuşma hedefine geçer misiniz?',
    weightedOptions: [
      { label: 'Hayır; taklit (motor ve oral) olmadan konuşma öğretmek temelsiz binadır. Taklit çalışırım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Gelişimsel Hiyerarşi Uzmanı.' },
      { label: 'Evet; hem taklit hem ses üretimi hedeflerini aynı anda yürütürüm.', weights: { clinical: 0.8, pedagogicalAnalysis: 0.9 }, analysisInsight: 'Dinamik Eğitmen.' }
    ]
  },
  {
    id: 'ped_new_10', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Grup dersinde bir çocuk kriz geçirirse, grubun kalanını nasıl yönetirsiniz?',
    weightedOptions: [
      { label: 'Krizdeki çocuğu yardımcıyla dışarı çıkarır, kalanlarla dersi "normal" devam ettiririm.', weights: { clinical: 0.7, institutionalLoyalty: 0.9 }, analysisInsight: 'Verimlilik Odaklı.' },
      { label: 'Durumu diğer çocuklara uygun dille açıklar, "arkadaşımıza destek" veya "bekleme" becerisi olarak seansa yediririm.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'İnsani Pedagoji.' }
    ]
  }
];
