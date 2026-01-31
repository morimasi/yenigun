
import { Question } from '../../types';

export const resilienceQuestions: Question[] = [
  {
    id: 'res_adv_1', category: 'sustainability', type: 'radio',
    text: 'Kurumda herkesin çok gergin olduğu ve yoğun mobbing hissedilen bir dönemden geçiliyor. Sizin enerjiniz nasıl etkilenir?',
    weightedOptions: [
      { label: 'Ayrıştırma ve Odak: Dışsal gürültüyü filtreler, sadece odamdaki öğrenciye ve klinik veriye kilitlenerek profesyonelliğimi korurum.', weights: { sustainability: 1.0, personality: 0.9 }, analysisInsight: 'Yüksek Duygusal Regülasyon.' },
      { label: 'Empatik Etkilenme: Çok üzülürüm, eve gidince ağlarım ama işimi yapmaya çalışırım.', weights: { sustainability: 0.3, empathy: 1.0 }, analysisInsight: 'Duygusal Kırılganlık.' },
      { label: 'Çatışma Çözücü: Ortamı yumuşatmak için komiklikler yapar veya arabuluculuk rolü üstlenirim.', weights: { sustainability: 0.6, fit: 1.0 }, analysisInsight: 'Sosyal Arabulucu.' },
      { label: 'Reaktif: Ben de herkese ters davranmaya başlarım.', weights: { sustainability: -0.5, fit: -1.0 }, analysisInsight: 'Düşük Stres Toleransı.' }
    ]
  },
  {
    id: 'res_adv_2', category: 'sustainability', type: 'radio',
    text: 'Bir vakanızda 1 yılın sonunda hiçbir ilerleme kaydedilemedi. Kendinize ne dersiniz?',
    weightedOptions: [
      { label: 'Analitik Özeleştiri: "Metodolojim bu çocuğun nöral yapısına uygun değildi, nerede hata yaptığımı bulmak için dış süpervizyon almalıyım."', weights: { sustainability: 0.9, developmentOpenness: 1.0 }, analysisInsight: 'Gelişim Odaklılık.' },
      { label: 'Dışsallaştırma: "Çocuğun kapasitesi bu kadar, mucize beklememek lazım."', weights: { sustainability: 0.5, clinical: -0.8 }, analysisInsight: 'Savunmacı Kaçınma.' },
      { label: 'Yetersizlik Hissi: "Ben bu işi beceremiyorum, galiba mesleği bırakmalıyım."', weights: { sustainability: -1.0 }, analysisInsight: 'Ağır Tükenmişlik Riski.' },
      { label: 'İnatçı Sabır: "Bir gün elbet açılacak, aynı yoldan devam etmeliyim."', weights: { sustainability: 0.7, clinical: 0.3 }, analysisInsight: 'Statüko Koruyucu.' }
    ]
  },
  {
    id: 'res_adv_3', category: 'sustainability', type: 'radio',
    text: 'Maaş ödemeniz teknik bir sebeple 1 hafta gecikecek. İlk düşünceniz?',
    weightedOptions: [
      { label: 'Rasyonel Güven: "Olabilir, kurum bugüne kadar hep ödedi, işime odaklanmaya devam ederim."', weights: { sustainability: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Güven ve Sabır.' },
      { label: 'Kaygı: "Ya hiç yatmazsa? Faturalarımı nasıl ödeyeceğim?" diyerek paniklerim.', weights: { sustainability: 0.2 }, analysisInsight: 'Finansal Kırılganlık.' },
      { label: 'Reaktif: "Yatana kadar seansları gevşetirim, motivasyonum kalmadı" derim.', weights: { workEthics: -1.0, institutionalLoyalty: -0.5 }, analysisInsight: 'Düşük Meslek Etiği.' },
      { label: 'Sorgulayıcı: Hemen gidip müdürün kapısında beklerim.', weights: { sustainability: 0.4, fit: -0.5 }, analysisInsight: 'Agresif Hak Arayışı.' }
    ]
  },
  {
    id: 'res_adv_4', category: 'sustainability', type: 'radio',
    text: 'Aynı odada çalıştığınız arkadaşınız çok dağınık ve materyalleri bozuyor. Yaklaşımınız?',
    weightedOptions: [
      { label: 'Doğrudan ve Yapıcı: "Materyal düzenimiz seans verimini etkiliyor, gel beraber bir sistem kuralım" teklifinde bulunurum.', weights: { fit: 1.0, leadership: 0.8 }, analysisInsight: 'Çözüm Odaklı Takım Arkadaşı.' },
      { label: 'Pasif Agresif: Ben de onun materyallerini karıştırırım.', weights: { fit: -0.8 }, analysisInsight: 'Toksik Davranış.' },
      { label: 'Şikayet: Gidip müdüre anlatırım.', weights: { fit: 0.2, personality: -0.5 }, analysisInsight: 'Düşük İletişim Becerisi.' },
      { label: 'Fedakarlık: Sessizce arkasını toplarım ama içten içe sinirlenirim.', weights: { sustainability: 0.4, personality: 0.5 }, analysisInsight: 'Burnout Adayı.' }
    ]
  },
  {
    id: 'res_adv_5', category: 'sustainability', type: 'radio',
    text: 'Bir seans sırasında çocuk üzerinize kustu. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Sakinlik ve Hijyen: Çocuğu temizler, regüle eder, sakinleşince seansı toparlar veya güvenli şekilde bitiririm. Bu işin doğası budur.', weights: { sustainability: 1.0, clinical: 0.9 }, analysisInsight: 'Profesyonel Soğukkanlılık.' },
      { label: 'Tiksinme: Öğürürüm ve odayı terk ederim.', weights: { sustainability: -0.5, personality: -0.8 }, analysisInsight: 'Düşük Saha Dayanıklılığı.' },
      { label: 'Öfke: Veliye "Niye yedirip getirdiniz?" diye bağırırım.', weights: { empathy: -1.0, personality: -1.0 }, analysisInsight: 'Saldırgan Reaksiyon.' },
      { label: 'Donma: Hiçbir şey yapamam, yardım beklerim.', weights: { sustainability: 0.0 }, analysisInsight: 'Kriz Yönetimi Zayıf.' }
    ]
  },
  {
    id: 'res_adv_6', category: 'sustainability', type: 'radio',
    text: 'Çok sevdiğiniz bir iş arkadaşınız haksız yere işten çıkarıldı. Tavrınız?',
    weightedOptions: [
      { label: 'Dengeli Duruş: Üzülürüm ama kurumun karar mekanizmasına saygı duyar, işime zarar vermeden desteğimi kurum dışında sürdürürüm.', weights: { institutionalLoyalty: 1.0, sustainability: 0.8 }, analysisInsight: 'Duygusal Olgunluk.' },
      { label: 'İsyan: "O gidiyorsa ben de giderim" deyip istifa resti çekerim.', weights: { sustainability: -0.5, institutionalLoyalty: -0.5 }, analysisInsight: 'Reaktif Bağımlılık.' },
      { label: 'Kulis: Diğer arkadaşlarımı yönetime karşı örgütlerim.', weights: { institutionalLoyalty: -2.0, fit: -1.5 }, analysisInsight: 'Yıkıcı Profil.' },
      { label: 'Kayıtsızlık: "Bana dokunmayan yılan bin yaşasın" derim.', weights: { fit: 0.2 }, analysisInsight: 'Düşük Empati.' }
    ]
  },
  {
    id: 'res_adv_7', category: 'sustainability', type: 'radio',
    text: 'Mesai bitti ama acil bir vaka için 1 saat kalmanız rica edildi. Yanıtınız?',
    weightedOptions: [
      { label: 'Gönüllü Katılım: "Tabii ki, akademik bir ihtiyaç varsa buradayım" der, seve seve kalırım.', weights: { institutionalLoyalty: 1.0, fit: 1.0 }, analysisInsight: 'Yüksek Motivasyon.' },
      { label: 'Pazarlık: "Yarın 1 saat erken çıkarsam kalırım" derim.', weights: { fit: 0.4 }, analysisInsight: 'Transaksiyonel İlişki.' },
      { label: 'Red: "Hayır, planım var" deyip çıkarım.', weights: { institutionalLoyalty: 0.2, sustainability: 0.9 }, analysisInsight: 'Sınır Koruma (Sağlıklı ama düşük fedakarlık).' },
      { label: 'Şikayet: Kalarım ama bütün akşam surat asarım.', weights: { fit: -0.5 }, analysisInsight: 'Negatif Rezonans.' }
    ]
  },
  {
    id: 'res_adv_8', category: 'sustainability', type: 'radio',
    text: 'Kurumda yeni bir teknolojik sisteme geçildi ve çok karmaşık. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Öncü Adaptasyon: Hemen kurcalar, videolar izler ve ekibe "öğreten" kişi olmaya çalışırım.', weights: { developmentOpenness: 1.0, leadership: 1.0 }, analysisInsight: 'Erken Adaptör ve Lider.' },
      { label: 'Direnç: "Eski usul daha iyiydi, bu iş yükü getiriyor" derim.', weights: { developmentOpenness: -1.0 }, analysisInsight: 'Değişime Kapalı.' },
      { label: 'Yardım Arayışı: Birinin bana öğretmesini beklerim.', weights: { fit: 0.5 }, analysisInsight: 'Takipçi Profil.' },
      { label: 'Kaçınma: Sistemi hiç kullanmamaya çalışırım.', weights: { developmentOpenness: -0.8, workEthics: -0.5 }, analysisInsight: 'Gelişimsel Atalet.' }
    ]
  },
  {
    id: 'res_adv_9', category: 'sustainability', type: 'radio',
    text: 'Bir vaka sırasında tırmalandınız ve kanadı. Çocuğa bakışınız değişir mi?',
    weightedOptions: [
      { label: 'Klinik Nesnellik: Hayır, bu bir saldırı değil, "iletişimsel bir patlamadır". Davranışın sebebine odaklanırım.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Usta Terapist.' },
      { label: 'Korku: Ondan korkmaya başlarım ve seanslarda çekingen davranırım.', weights: { sustainability: -0.5, personality: -1.0 }, analysisInsight: 'Güven Kaybı.' },
      { label: 'Ceza: Canım yandığı için ben de onun canını yakarım.', weights: { workEthics: -5.0, clinical: -5.0 }, analysisInsight: 'Kritik İstismar Riski.' },
      { label: 'Mesafe: Artık onu sevmiyorum, sadece görevimi yapıyorum.', weights: { empathy: -0.8 }, analysisInsight: 'Duygusal Kopuş.' }
    ]
  },
  {
    id: 'res_adv_10', category: 'sustainability', type: 'radio',
    text: 'En büyük mesleki hayaliniz nedir?',
    weightedOptions: [
      { label: 'Uzmanlaşma ve Ekol Kurma: Bir alanda (örn: OSB) dünya çapında bir otorite olup kurumuma değer katmak.', weights: { leadership: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Vizyoner ve Sadık.' },
      { label: 'Rahatlık: Az çalışıp çok kazanacağım bir düzen kurmak.', weights: { sustainability: -0.5, fit: -1.0 }, analysisInsight: 'Düşük Tutku.' },
      { label: 'Kaçış: Bu mesleği bırakıp ticaret yapmak.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Mesleki Aidiyetsizlik.' },
      { label: 'Hizmet: Sadece çocuklara faydalı olmak, gerisi mühim değil.', weights: { empathy: 1.0, leadership: 0.2 }, analysisInsight: 'Saf Terapist.' }
    ]
  }
];
