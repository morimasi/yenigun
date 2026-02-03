
import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  // --- İŞ ETİĞİ & SINIR (10 ADET) ---
  {
    id: 'eth_new_1', category: 'workEthics', type: 'radio',
    text: 'Veli, size kurum müdürü hakkında gizli bir şikayette bulunuyor ve "aramızda kalsın" diyor. Tavrınız?',
    weightedOptions: [
      { label: 'Güven İnşası: Dinler ve "anlıyorum" diyerek geçiştiririm; veliyle bağı koparmamak için yönetime yansıtmam.', weights: { workEthics: 0.4, institutionalLoyalty: 0.3 }, analysisInsight: 'Riskli / Sınır İhlali Eğilimi.' },
      { label: 'Kurumsal Hiyerarşi: "Bunu duyduğuma üzüldüm ama bu konuyu müdürümüzle doğrudan çözmeniz kurum politikamızdır" diyerek şeffaf bir sınır çizerim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Kurumsal Bütünlük.' }
    ]
  },
  {
    id: 'eth_new_2', category: 'workEthics', type: 'radio',
    text: 'Bir vakanızın raporunda, kurumun vergi/SGK muafiyeti için "olmadığı kadar ağır" bir engel oranı yazılmasını talep ediyorlar. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Etik Red: Asla kabul etmem. Yanlış beyan hem suçtur hem de vakanın klinik geleceğini bozar.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Kaya Gibi Etik.' },
      { label: 'Kurumsal Esneklik: Kurumun menfaati ve vakanın devamlılığı için risk almadan onay veririm.', weights: { workEthics: 0.2, institutionalLoyalty: 0.5 }, analysisInsight: 'Yüksek Risk / Düşük İlke.' }
    ]
  },
  {
    id: 'eth_new_3', category: 'workEthics', type: 'radio',
    text: 'Başka bir kurumun sizin metodunuzu "çalmaya" çalıştığını duydunuz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Fikri Mülkiyet Savunması: Durumu yönetime bildirir ve kurumsal koruma talep ederim.', weights: { workEthics: 0.9, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Muhafız.' },
      { label: 'Bilgi Paylaşımı: "Bilgi evrenseldir" diyerek sessiz kalırım veya paylaşımı teşvik ederim.', weights: { workEthics: 0.7, personality: 0.8 }, analysisInsight: 'İdealist / Dağınık.' }
    ]
  },
  {
    id: 'eth_new_4', category: 'workEthics', type: 'radio',
    text: 'Eski çalıştığınız kurumdaki bir veli sizi aradı ve şimdiki kurumunuza gelmek istediğini söyledi. Tavrınız?',
    weightedOptions: [
      { label: 'Etik Filtre: Mevcut kurumuma haber verir ve etik bir geçiş süreci (poaching suçlaması olmadan) planlarım.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Şeffaf Profesyonel.' },
      { label: 'Hızlı Kayıt: Veliyi hemen yeni kuruma kaydettirir ve "müşteri getirdiğim için" prim talep ederim.', weights: { workEthics: 0.3, sustainability: 0.5 }, analysisInsight: 'Ticari Odaklı.' }
    ]
  },
  {
    id: 'eth_new_5', category: 'workEthics', type: 'radio',
    text: 'Kurumda bir arkadaşınızın vaka üzerinde fiziksel "kaba kuvvet" (istismar sınırı) kullandığını gördünüz. İlk adımınız?',
    weightedOptions: [
      { label: 'Resmi Rapor: Hiç beklemeden koordinatörlüğe veya disiplin kuruluna yazılı bildirim yaparım.', weights: { workEthics: 1.0, clinical: 0.9 }, analysisInsight: 'Sıfır Tolerans.' },
      { label: 'Dostane Uyarı: Önce arkadaşımla konuşur, hatasını düzeltmesini sağlarım. Arkadaşımı satmam.', weights: { workEthics: 0.5, empathy: 0.6 }, analysisInsight: 'Omerta Kültürü / Riskli.' }
    ]
  },
  {
    id: 'eth_new_6', category: 'workEthics', type: 'radio',
    text: 'Sosyal medyada bir öğrencimizin videosunu çekmek istiyorsunuz. Veli "tabii ki" dedi ama kurum yasaklamıştı. Paylaşır mısınız?',
    weightedOptions: [
      { label: 'Prosedür Sadakati: Hayır. Kurum onayı yoksa veli onayı geçersizdir.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Sistem Uyumlu.' },
      { label: 'Kişisel Marka: Paylaşırım; veli izin verdikten sonra kurum karışamaz.', weights: { workEthics: 0.4, personality: 0.7 }, analysisInsight: 'Bireysel Odaklı.' }
    ]
  },
  {
    id: 'eth_new_7', category: 'workEthics', type: 'radio',
    text: 'Kurumdaki bir seansın iptal olması sonucu oluşan boşlukta ne yaparsınız?',
    weightedOptions: [
      { label: 'Akademik Katkı: Materyal hazırlar, arşiv düzenler veya meslektaşlarıma gözlem desteği veririm.', weights: { workEthics: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Yüksek Proaktiflik.' },
      { label: 'Dinlenme: Mola hakkım olarak görür, sosyal alanlarda vakit geçiririm.', weights: { workEthics: 0.6, sustainability: 0.8 }, analysisInsight: 'Denge Odaklı.' }
    ]
  },
  {
    id: 'eth_new_8', category: 'workEthics', type: 'radio',
    text: 'Bir vakada hata yaptınız ve vaka geriledi. Veliye bunu nasıl açıklarsınız?',
    weightedOptions: [
      { label: 'Radikal Şeffaflık: Hatamı kabul eder, nedenlerini ve telafi planımı net şekilde sunarım.', weights: { workEthics: 1.0, clinical: 1.0 }, analysisInsight: 'Güven Veren Lider.' },
      { label: 'Algı Yönetimi: Gerilemeyi çocuğun biyolojik durumuna veya evdeki eksikliklere bağlar, üzerimdeki baskıyı azaltırım.', weights: { workEthics: 0.2, technicalExpertise: 0.5 }, analysisInsight: 'Defansif / Riskli.' }
    ]
  },
  {
    id: 'eth_new_9', category: 'workEthics', type: 'radio',
    text: 'Kurum dışında bir meslektaşınız kurumunuzu kötülüyor. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Kurumsal Defans: Kurumumu savunur ve eleştirilerinin haksız olduğunu profesyonel bir dille açıklarım.', weights: { workEthics: 0.9, institutionalLoyalty: 1.0 }, analysisInsight: 'Sadakat Testi Başarılı.' },
      { label: 'Objektif Katılım: Eğer haklı olduğu noktalar varsa sessiz kalır veya onaylarım.', weights: { workEthics: 0.6, personality: 0.8 }, analysisInsight: 'Bağımsız / Zayıf Sadakat.' }
    ]
  },
  {
    id: 'eth_new_10', category: 'workEthics', type: 'radio',
    text: 'Veli, seans çıkışında şahsi numaranızı "acil bir durum olabilir" diyerek ısrarla istiyor. Verir misiniz?',
    weightedOptions: [
      { label: 'Profesyonel Mesafe: Hayır; kurumsal hattı verir ve mesai dışı iletişimin klinik tarafsızlığı bozacağını açıklarım.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Çelik Sınırlar.' },
      { label: 'Kontrollü Taviz: Numarayı veririm ama sadece SMS üzerinden ulaşmasını rica ederim.', weights: { workEthics: 0.4, empathy: 0.8 }, analysisInsight: 'Sınır İhlali Riski.' }
    ]
  },

  // --- KURUMSAL SADAKAT (10 ADET) ---
  {
    id: 'loy_new_1', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumda çok sevdiğiniz bir iş arkadaşınız haksız yere işten çıkarıldı. Kuruma tepkiniz ne olur?',
    weightedOptions: [
      { label: 'Pasif Direnç: Motivasyonum düşer, sadece zorunlu işleri yaparım ve yeni iş bakmaya başlarım.', weights: { institutionalLoyalty: 0.2, sustainability: 0.4 }, analysisInsight: 'Duygusal Karar Verici.' },
      { label: 'Profesyonel Ayrıştırma: Üzüntümü arkadaşımla özelde paylaşırım ama kurumdaki performansımı ve vakalarımı bu durumdan etkiletmem.', weights: { institutionalLoyalty: 1.0, sustainability: 1.0 }, analysisInsight: 'Yüksek Profesyonel Olgunluk.' }
    ]
  },
  {
    id: 'loy_new_2', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumun bir politikasını (örn: kılık kıyafet, raporlama hızı) saçma buluyorsunuz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Kurumsal Uyum: Kurallara uyarım, uygun bir zamanda yönetime öneri dosyası sunarım.', weights: { institutionalLoyalty: 1.0, workEthics: 0.9 }, analysisInsight: 'Disiplinli / Yapıcı.' },
      { label: 'Mikro İsyan: Gizlice uymam veya uymayanları desteklerim.', weights: { institutionalLoyalty: 0.1, personality: 0.6 }, analysisInsight: 'Pasif-Agresif.' }
    ]
  },
  {
    id: 'loy_new_3', category: 'institutionalLoyalty', type: 'radio',
    text: 'Dışarıdan bir kurum size %20 daha fazla maaş teklif etti. Karar kriteriniz ne olur?',
    weightedOptions: [
      { label: 'Klinik İtibar: Mevcut kurumumun akademik kalitesi yüksekse kalırım. Para uzmanlığımı geliştirmez.', weights: { institutionalLoyalty: 1.0, clinical: 1.0 }, analysisInsight: 'İlkesel Sadakat.' },
      { label: 'Ekonomik Rasyonalizm: Koşullar daha iyiyse hemen geçerim. Profesyonel hayat rasyoneldir.', weights: { institutionalLoyalty: -1.0, sustainability: 0.8 }, analysisInsight: 'Mobil Realist.' }
    ]
  },
  {
    id: 'loy_new_4', category: 'institutionalLoyalty', type: 'radio',
    text: 'Yönetim sizden pazar günü yapılacak bir seminere "gönüllü" katılmanızı istedi. Tavrınız?',
    weightedOptions: [
      { label: 'Kurumsal Yatırım: Katılırım; kurumun büyümesi benim vizyonumun bir parçasıdır.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Gelecek Lider Adayı.' },
      { label: 'Sınır Koruma: "Özel zamanım" diyerek reddederim. İş iştir.', weights: { institutionalLoyalty: 0.5, sustainability: 0.9 }, analysisInsight: 'Memur Zihniyeti.' }
    ]
  },
  {
    id: 'loy_new_5', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumdaki bir sorunu önce kime söylersiniz?',
    weightedOptions: [
      { label: 'Doğrudan Çözüm: Hemen bağlı olduğum koordinatöre veya müdüre giderim.', weights: { institutionalLoyalty: 1.0, workEthics: 1.0 }, analysisInsight: 'Sistem Dostu.' },
      { label: 'Yatay Güven: Önce arkadaşlarımla konuşur, ortak bir tepki örgütlerim.', weights: { institutionalLoyalty: 0.4, leadership: 0.7 }, analysisInsight: 'Sendikal / Potansiyel Muhalif.' }
    ]
  },
  {
    id: 'loy_new_6', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumun vizyonunu 1 cümlede nasıl tanımlarsınız?',
    weightedOptions: [
      { label: 'Sahiplenici: "Biz burada sadece çocuk değil, gelecek inşa ediyoruz."', weights: { institutionalLoyalty: 1.0, personality: 0.9 }, analysisInsight: 'Misyoner Profil.' },
      { label: 'Pragmatik: "Burası bölgenin en çok vaka gören ve disiplinli kurumu."', weights: { institutionalLoyalty: 0.7, technicalExpertise: 0.8 }, analysisInsight: 'Sonuç Odaklı Profesyonel.' }
    ]
  },
  {
    id: 'loy_new_7', category: 'institutionalLoyalty', type: 'radio',
    text: 'Bir hata sonucu kurum zarar gördü (örn: bir cihaz kırıldı). Kimse bilmiyor.',
    weightedOptions: [
      { label: 'Sorumluluk Alımı: Ben yaptım der, gerekirse maaşımdan kesilmesini isterim.', weights: { institutionalLoyalty: 1.0, workEthics: 1.0 }, analysisInsight: 'Aşırı Dürüstlük.' },
      { label: 'Sessiz Onarım: Kendi imkanlarımla tamir ettirir veya yerine koyarım, olayı büyütmem.', weights: { institutionalLoyalty: 0.8, sustainability: 0.9 }, analysisInsight: 'Çözüm Odaklı Gizlilik.' }
    ]
  },
  {
    id: 'loy_new_8', category: 'institutionalLoyalty', type: 'radio',
    text: 'Yeni bir personel geldi ve çok yetenekli. Onu "rakip" mi görürsünüz "yük hafifletici" mi?',
    weightedOptions: [
      { label: 'Mentorluk: Ona kurum kültürünü öğretir ve işbirliği yaparım. Kurum kazanırsa ben de kazanırım.', weights: { institutionalLoyalty: 1.0, leadership: 1.0 }, analysisInsight: 'Liderlik Kumaşı.' },
      { label: 'Savunma: Kendi vakalarımı ve otoritemi korurum; yeni gelenin parlaması beni gölgeler.', weights: { institutionalLoyalty: 0.3, personality: 0.4 }, analysisInsight: 'Kırılgan Ego.' }
    ]
  },
  {
    id: 'loy_new_9', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumdaki "Maaş Gizliliği" kuralı hakkında ne düşünüyorsunuz?',
    weightedOptions: [
      { label: 'Destekliyorum: Kaosu önler ve odak noktasını paradan liyakate çeker.', weights: { institutionalLoyalty: 1.0, technicalExpertise: 0.8 }, analysisInsight: 'Kurumsal Disiplin.' },
      { label: 'Şeffaflık İstiyorum: Emek sömürüsünü gizlediğini düşünüyorum.', weights: { institutionalLoyalty: 0.2, personality: 0.9 }, analysisInsight: 'Hak Odaklı Aktivist.' }
    ]
  },
  {
    id: 'loy_new_10', category: 'institutionalLoyalty', type: 'radio',
    text: 'Burada 5 yıl sonra kendinizi nerede görüyorsunuz?',
    weightedOptions: [
      { label: 'Kurumsal Yükseliş: Bölüm başkanı veya kurumun akademik direktörü olarak.', weights: { institutionalLoyalty: 1.0, leadership: 1.0 }, analysisInsight: 'Uzun Vadeli Yatırım.' },
      { label: 'Bireysel Ustalık: Çok aranan, en zor vakaları çözen bağımsız bir uzman olarak.', weights: { institutionalLoyalty: 0.6, technicalExpertise: 1.0 }, analysisInsight: 'Bireysel Yıldız.' }
    ]
  }
];
