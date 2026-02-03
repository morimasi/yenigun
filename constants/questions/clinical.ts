
import { Question, Branch } from '../../types';

export const clinicalQuestions: Question[] = [
  // --- KLİNİK YETERLİLİK ---
  {
    id: 'clin_new_1', category: 'technicalExpertise', type: 'radio',
    text: 'Çok yoğun bir "Sönme Patlaması" (Burst) yaşayan çocukta, güvenlik riski yoksa ancak diğer sınıflar sesten rahatsız oluyorsa ne yaparsınız?',
    weightedOptions: [
      { label: 'Diğer sınıflardan ve meslektaşlarımdan özür dilerim ancak klinik prosedürü o an bozmanın, problem davranışı çok daha dirençli hale getireceğini bildiğim için müdahaleye sadık kalırım; sönme patlamasında geri adım atmak uzun vadede vaka başarısını imkansız kılar.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Yüksek Metodolojik Sadakat.' },
      { label: 'Çocuğu hemen kurum dışına veya ses yalıtımlı bir odaya çıkararak ortamı regüle ederim; kurumun genel huzuru ve diğer öğrencilerin eğitim hakkının, o anki tekil seans veriminden daha öncelikli olduğunu savunurum.', weights: { clinical: 0.6, institutionalLoyalty: 0.8 }, analysisInsight: 'Kurumsal Uyum Odaklı.' }
    ]
  },
  {
    id: 'clin_new_2', category: 'technicalExpertise', type: 'radio',
    text: 'Vakanın gelişimi için çok kritik ama ailenin maddi olarak zorlanacağı bir ek materyal/cihaz önerisi yapmanız gerekiyor. Tavrınız?',
    weightedOptions: [
      { label: 'Ailenin ekonomik durumunu bir kenara bırakarak, vaka için bilimsel olarak kanıtlanmış en etkili yolu önerir ve kararı profesyonel bir dille onlara bırakırım; klinik doğru, bütçe kısıtlamalarına göre esnetilebilecek bir unsur değildir.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Klinik Realist.' },
      { label: 'Ailenin bütçesini sarsmayacak, belki biraz daha az etkili olsa da erişilebilir muadil yollar veya alternatif çözüm önerileri ararım; sürdürülebilir bir eğitim planının, ulaşılamayan "mükemmel" bir cihazdan daha faydalı olduğuna inanırım.', weights: { clinical: 0.5, empathy: 1.0 }, analysisInsight: 'Empatik Pragmatist.' }
    ]
  },
  {
    id: 'clin_new_3', category: 'technicalExpertise', type: 'radio',
    text: 'Bir beceri öğretiminde "Hatasız Öğretim" mi yoksa "Doğal Deneme" mi? Çocuk hata yaptığında çok çabuk pes ediyorsa?',
    weightedOptions: [
      { label: 'Çocuğun hata yapmasına asla izin vermem, ipucunu en baştan en yoğun seviyede vererek (Most-to-Least) ilerlerim; hata biriktirmek öğrencinin motivasyonunu kalıcı olarak düşüreceği için başarı hissini garantileyen bir yol izlerim.', weights: { clinical: 0.9, technicalExpertise: 1.0 }, analysisInsight: 'Hatasız Öğretim Disiplini.' },
      { label: 'Kontrollü bir şekilde hata yapmasına izin veririm ve ardından hata düzeltme prosedürü uygularım; öğrencinin hatadan öğrenmesini ve akademik dayanıklılık (resilience) kazanmasını sağlamanın, yapay bir başarıdan daha kalıcı olduğunu düşünürüm.', weights: { clinical: 0.7, sustainability: 0.9 }, analysisInsight: 'Direnç Odaklı Yaklaşım.' }
    ]
  },
  {
    id: 'clin_new_4', category: 'technicalExpertise', type: 'radio',
    text: 'VB-MAPP değerlendirmesinde bir alanın şişirildiğini (gerçekten yüksek olmadığını) fark ettiniz ama veli bu skora çok sevinmiş. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Veliyi derhal bilgilendirerek gerçekçi skoru açıklar ve raporu aşağı çekerim; yanlış veri üzerine inşa edilen bir eğitim planının vakitte kayba ve ileride hayal kırıklığına yol açacağını, akademik dürüstlüğün öncelikli olduğunu vurgularım.', weights: { clinical: 1.0, workEthics: 1.0 }, analysisInsight: 'Etik Dürüstlük.' },
      { label: 'Veliye moralini bozmadan planı içten içe basitleştirir, verileri zamanla ve kademeli olarak gerçeğe yaklaştırırım; aile motivasyonunun bir terapötik ittifakın en önemli yakıtı olduğunu, bu bağı koparmadan süreci yönetmeyi tercih ederim.', weights: { clinical: 0.6, empathy: 0.9 }, analysisInsight: 'İlişki Yönetimi Stratejisi.' }
    ]
  },
  {
    id: 'clin_new_5', category: 'technicalExpertise', type: 'radio',
    text: 'Çalıştığınız yöntemin vaka üzerinde etkisiz kaldığını 4 ay sonra kanıtlarla gördünüz. İlk refleksiniz?',
    weightedOptions: [
      { label: 'Önce kendi uygulama tekniğimi ve veri toplama hassasiyetimi sorgular, kurum içi süpervizyon talep ederek aynı yöntemde daha fazla derinleşmeye çalışırım; sorunun metotta değil, uygulama kalitesinde olma ihtimaline odaklanırım.', weights: { clinical: 0.8, developmentOpenness: 0.9 }, analysisInsight: 'İçsel Denetim Eğilimi.' },
      { label: 'Uygulanan metodun bu öğrencinin nöral profiline uygun olmadığını objektif verilerle kabul eder, vakit kaybetmeden farklı bir bilimsel ekole (Örn: ABA\'dan DIR\'a) geçiş yaparım; vaka başarısı için metot sadakatinden vazgeçebilirim.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Metodolojik Esneklik.' }
    ]
  },
  {
    id: 'clin_new_6', category: 'technicalExpertise', type: 'radio',
    text: 'Seansın en verimli yerinde çocuk "Tuvaletim geldi" dedi ama bunun bir "kaçınma davranışı" olduğundan %100 eminsiniz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Hiçbir risk almadan hemen tuvalete götürürüm; fizyolojik bir ihtiyacın klinik hedeften her zaman üstün olduğunu, olası bir kazanın çocuktaki mahremiyet ve güven duygusunu zedeleyebileceğini savunurum.', weights: { clinical: 0.7, workEthics: 0.8 }, analysisInsight: 'Güvenli Alan Önceliği.' },
      { label: '"Şu küçük görevi bitirelim, hemen sonra gideceğiz" diyerek talebi kontrollü bir şekilde geciktiririm; kaçınma davranışının pekişmesine izin vermeden, seans otoritesini ve çalışma düzenini korumaya odaklanırım.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Davranış Kontrolü Hakimiyeti.' }
    ]
  },
  {
    id: 'clin_new_7', category: 'technicalExpertise', type: 'radio',
    text: 'Ağır bir vaka için kurum dışından bir "Gölge Öğretmen" önerilmesi gerekiyor ama kurum müdürü buna karşı çıkıyor. Kararınız?',
    weightedOptions: [
      { label: 'Müdürle profesyonel bir çatışmayı göze alarak, vakanın başarısı ve eğitimin niteliği için bir gölge öğretmenin neden şart olduğunu bilimsel verilerle savunmaya devam ederim; çocuğun üstün yararını kurumsal politikanın önünde tutarım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Vaka Avukatlığı.' },
      { label: 'Müdürün kurumsal vizyonuna ve yönetim kararına saygı duyarak mevcut şartları kabul ederim; bir gölge öğretmen olmadan da vakanın gelişimini mevcut personelle nasıl maksimize edebileceğimize dair yeni bir strateji geliştiririm.', weights: { clinical: 0.5, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Hiyerarşik Uyum.' }
    ]
  },
  {
    id: 'clin_new_8', category: 'technicalExpertise', type: 'radio',
    text: 'Öğrenci bir "Stereotipi" (Sallanma vb.) sergiliyor ve bu durum ders odağını bozmuyor ama veli bunu "çirkin" buluyor. Müdahale eder misiniz?',
    weightedOptions: [
      { label: 'Ders odağını veya güvenliği tehdit etmediği sürece bu davranışın çocuğun bir regülasyon aracı olduğunu kabul eder ve müdahale etmem; veliye de bu davranışın işlevini ve nöro-çeşitlilikteki yerini detaylıca anlatırım.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Modern Pedagojik Duruş.' },
      { label: 'Çocuğun toplum içinde dışlanmaması ve sosyal uyum becerilerinin artması için bu davranışı yavaşça azaltmaya çalışırım; stereotipiyi daha sosyal olarak kabul edilebilir bir davranışla değiştirmek için alternatif bir plan oluştururum.', weights: { clinical: 0.8, pedagogicalAnalysis: 0.9 }, analysisInsight: 'Sosyal Normalizasyon Odaklı.' }
    ]
  },
  {
    id: 'clin_new_9', category: 'technicalExpertise', type: 'radio',
    text: 'Seans videosu izlerken kendi hatanızı fark ettiniz ama vaka raporu çoktan "başarılı" olarak girildi. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Hiyerarşik onayı beklemeksizin raporu derhal "geçersiz" olarak işaretler, hatamı raporun notlar kısmına açıkça yazar ve seansın telafisini planlarım; akademik dürüstlüğün kişisel performanstan daha önemli olduğunu savunurum.', weights: { clinical: 1.0, workEthics: 1.0 }, analysisInsight: 'Radikal Dürüstlük.' },
      { label: 'Raporu değiştirip kurumun genel verimlilik puanını düşürmem ancak yaptığım hatayı not alarak bir sonraki seansta bu eksikliği gidermek için iki kat daha fazla efor sarf ederim; pragmatik bir yaklaşımla telafi yoluna giderim.', weights: { clinical: 0.7, institutionalLoyalty: 0.8 }, analysisInsight: 'Sonuç Odaklı Profesyonellik.' }
    ]
  },
  {
    id: 'clin_new_10', category: 'technicalExpertise', type: 'radio',
    text: 'Çoklu yetersizliği olan bir vakanın BEP toplantısında diğer uzmanlar (Ergoterapist, Dil Terapisti) sizin branşınıza müdahale ederse tepkiniz?',
    weightedOptions: [
      { label: 'Mesleki sınırlarımı ve uzmanlık alanımın kırmızı çizgilerini net bir dille belirtirim; multidisipliner çalışmanın önemli olduğunu ancak her uzmanın kendi teknik sahasında tam yetkiye sahip olması gerektiğini savunurum.', weights: { clinical: 0.9, personality: 1.0 }, analysisInsight: 'Otoriter Uzmanlık.' },
      { label: 'Diğer branşların önerilerini birer geri bildirim olarak dinler, kendi klinik mantığımla süzdükten sonra ortak bir hedef belirlemeye çalışırım; vaka başarısı için disiplinlerarası bir "hibrit" modelin daha güçlü sonuçlar vereceğine inanırım.', weights: { clinical: 1.0, sustainability: 1.0 }, analysisInsight: 'Bütüncül Takım Oyuncusu.' }
    ]
  },

  // --- PEDAGOJİK ALTYAPI ---
  {
    id: 'ped_new_1', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Çocuk yeni öğrendiği bir kelimeyi sadece sizinle kullanıyor, evde kullanmıyor. Sorun nerededir?',
    weightedOptions: [
      { label: 'Genelleme (Generalization) sürecinde eksiklik bıraktığımı kabul ederim; uyaran kontrolü bende kilitli kaldığı için aileye yeterli "ev programı" eğitimi vermemiş veya farklı ortam denemelerini ihmal etmiş olduğumu düşünürüm.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Analitik Pedagojik Farkındalık.' },
      { label: 'Ailenin evdeki pekiştirme süreçlerinde motivasyonunun düşük olduğunu ve eğitim yükünü tamamen kuruma bıraktıklarını düşünürüm; sorunun uygulama aşamasında değil, veli işbirliğinin zayıflığında olduğunu varsayarım.', weights: { clinical: 0.4, sustainability: 0.6 }, analysisInsight: 'Dışsal Atıf Eğilimi.' }
    ]
  },
  {
    id: 'ped_new_2', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Okuma yazma aşamasındaki bir disleksi vakasında "Hız" mı "Doğruluk" mu?',
    weightedOptions: [
      { label: 'Adayın hata biriktirmemesi ve yanlış okuma alışkanlığı geliştirmemesi için okuma hızı çok düşük olsa bile tam doğruluğu (Accuracy) hedeflerim; temel ne kadar kusursuz atılırsa hızın zamanla kendiliğinden geleceğini savunurum.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Derinlik ve Kalite Odaklı.' },
      { label: 'Öğrencinin akademik motivasyonunun kırılmaması için bazı küçük hataları görmezden gelerek akıcılığı (Fluency) teşvik ederim; hızlı okumanın vereceği başarma hissinin, hatasız ama sıkıcı bir süreçten daha önemli olduğunu düşünürüm.', weights: { clinical: 0.6, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Motivasyon ve Süreç Odaklı.' }
    ]
  },
  {
    id: 'ped_new_3', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Bir beceriyi öğretirken çocuğun "İlgi Odağı" (örn: dinozorlar) programda yok ama çocuk sadece onunla etkileşim kuruyor. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Mevcut programı derhal esnetir ve tüm akademik hedefleri dinozorlar üzerinden "Gömülü Öğretim" (Embedded Teaching) tekniği ile vermeye başlarım; öğrencinin motivasyonunu bir fırsat penceresi olarak kullanmayı tercih ederim.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Esnek Müfredat Yönetimi.' },
      { label: 'Dinozorları "yüksek değerli bir pekiştireç" olarak saklar, ancak önce asıl müfredattaki görevleri bitirmesini talep ederim; çocuğa yapılandırılmış bir düzende çalışmanın ve görev bilincinin önemini öğretmeye odaklanırım.', weights: { clinical: 0.8, technicalExpertise: 0.9 }, analysisInsight: 'Yapılandırılmış Disiplin.' }
    ]
  },
  {
    id: 'ped_new_4', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Çocuk masaya oturmayı reddediyor ve sürekli yerde oynamak istiyor. Akademik dersi nasıl işlersiniz?',
    weightedOptions: [
      { label: 'Masayı geçici olarak tamamen kaldırırım; öğrencinin kendini güvende ve lider hissettiği yerde akademik hedefleri oyunlaştırarak çalışırım; fiziksel konumun klinik çıktıdan daha önemsiz olduğunu savunurum.', weights: { clinical: 1.0, empathy: 0.9 }, analysisInsight: 'İlişki ve Bağ Odaklı.' },
      { label: 'Öncelikle masaya oturma ve yönerge takip (Compliance) becerileri üzerinde dururum; akademik dersi ancak masaya oturduğunda bir ödül gibi sunarak öğrenciye sınıftaki sınırları ve hiyerarşiyi kabul ettirmeyi hedeflerim.', weights: { clinical: 0.7, technicalExpertise: 1.0 }, analysisInsight: 'Davranışsal Sınır İnşası.' }
    ]
  },
  {
    id: 'ped_new_5', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Geleneksel "Kartla Eğitim" mi yoksa "Doğal Ortamda (NET)" eğitim mi? Hangisi daha sürdürülebilirdir?',
    weightedOptions: [
      { label: 'Kesinlikle Doğal Ortam; hayatın içine entegre edilmemiş ve fonksiyonel bir karşılığı olmayan hiçbir akademik bilginin kalıcı ve genellenebilir olmayacağını, çocuğun yaşamsal becerilere ihtiyacı olduğunu savunurum.', weights: { clinical: 1.0, sustainability: 1.0 }, analysisInsight: 'Fonksiyonel Pedagoji Hakimiyeti.' },
      { label: 'Öncelikle Yapılandırılmış Masa Başı; temel bilişsel becerilerin ve dikkatin önce sessiz, steril bir odada inşa edilmesi gerektiğini, bu temel sağlam atıldıktan sonra doğal ortama geçişin daha güvenli olduğunu düşünürüm.', weights: { clinical: 0.8, technicalExpertise: 0.9 }, analysisInsight: 'Sistematik Gelişim Takibi.' }
    ]
  }
];
