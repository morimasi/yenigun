
import { FormStep } from './types';

export const FORM_STEPS: FormStep[] = [
  { 
    id: 'personal', 
    title: 'Akademik Kimlik', 
    description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz. Lütfen sadece klinik deneyimlerinize odaklanın.' 
  },
  { 
    id: 'academic_proficiency', 
    title: 'Klinik Uygulama Profili', 
    description: 'Müfredat bilgisinin özel eğitim müdahale teknikleriyle sentezi: Yüksek zorluk seviyeli uygulama senaryoları.' 
  },
  { id: 'logic_literacy', title: 'Operasyonel Zeka', description: 'Karmaşık kriz anlarında mantıksal önceliklendirme kapasitesi.' },
  { id: 'professional_cases', title: 'Etik İkilemler', description: 'Profesyonel ahlak ile kurumsal gerçeklik arasındaki denge.' },
  { id: 'psychological_integrity', title: 'Psikolojik Sınırlar', description: 'Tükenmişlik ve duygusal düzenleme analizi.' },
  { id: 'development', title: 'Özeleştiri & Vizyon', description: 'Mesleki hataların analizi ve gelişim dürüstlüğü.' }
];

export const TURKISH_UNIVERSITIES = [
  "Abant İzzet Baysal Üniversitesi", "Acıbadem Üniversitesi", "Adıyaman Üniversitesi", "Adnan Menderes Üniversitesi",
  "Afyon Kocatepe Üniversitesi", "Ağrı İbrahim Çeçen Üniversitesi", "Akdeniz Üniversitesi", "Aksaray Üniversitesi",
  "Alanya Alaaddin Keykubat Üniversitesi", "Altınbaş Üniversitesi", "Amasya Üniversitesi", "Anadolu Üniversitesi",
  "Anka Teknoloji Üniversitesi", "Ankara Üniversitesi", "Ankara Bilim Üniversitesi", "Ankara Hacı Bayram Veli Üniversitesi",
  "Ankara Medipol Üniversitesi", "Ankara Müzik ve Güzel Sanatlar Üniversitesi", "Ankara Sosyal Bilimler Üniversitesi",
  "Ankara Yıldırım Beyazıt Üniversitesi", "Antalya Bilim Üniversitesi", "Antalya Akev Üniversitesi",
  "Ardahan Üniversitesi", "Artvin Çoruh Üniversitesi", "Atatürk Üniversitesi", "Atılım Üniversitesi",
  "Avrasya Üniversitesi", "Bahçeşehir Üniversitesi", "Balıkesir Üniversitesi", "Bandırma Onyedi Eylül Üniversitesi",
  "Bartın Üniversitesi", "Başkent Üniversitesi", "Batman Üniversitesi", "Bayburt Üniversitesi",
  "Beykent Üniversitesi", "Beykoz Üniversitesi", "Bezm-i Alem Vakıf Üniversitesi", "Bilecik Şeyh Edebali Üniversitesi",
  "Bingöl Üniversitesi", "Biruni Üniversitesi", "Bitlis Eren Üniversitesi", "Boğaziçi Üniversitesi",
  "Bozok Üniversitesi", "Bursa Teknik Üniversitesi", "Bursa Uludağ Üniversitesi", "Bezmiâlem Vakıf Üniversitesi",
  "Celal Bayar Üniversitesi", "Cumhuriyet Üniversitesi", "Çağ Üniversitesi", "Çanakkale Onsekiz Mart Üniversitesi",
  "Çankaya Üniversitesi", "Çankırı Karatekin Üniversitesi", "Çukurova Üniversitesi", "Dicle Üniversitesi",
  "Doğuş Üniversitesi", "Dokuz Eylül Üniversitesi", "Dumlupınar Üniversitesi", "Düzce Üniversitesi",
  "Ege Üniversitesi", "Erciyes Üniversitesi", "Erzincan Binali Yıldırım Üniversitesi", "Erzurum Teknik Üniversitesi",
  "Eskişehir Osmangazi Üniversitesi", "Eskişehir Teknik Üniversitesi", "Fatih Sultan Mehmet Vakıf Üniversitesi",
  "Fırat Üniversitesi", "Galatasaray Üniversitesi", "Gazi Üniversitesi", "Gaziantep Üniversitesi",
  "Gaziantep İslam Bilim ve Teknoloji Üniversitesi", "Gebze Teknik Üniversitesi", "Giresun Üniversitesi",
  "Gümüşhane Üniversitesi", "Hacettepe Üniversitesi", "Hakkari Üniversitesi", "Haliç Üniversitesi",
  "Harran Üniversitesi", "Hasan Kalyoncu Üniversitesi", "Hatay Mustafa Kemal Üniversitesi", "Hitit Üniversitesi",
  "Iğdır Üniversitesi", "Işık Üniversitesi", "İbn Haldun Üniversitesi", "İhsan Doğramacı Bilkent Üniversitesi",
  "İnönü Üniversitesi", "İskenderun Teknik Üniversitesi", "İstanbul Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa",
  "İstanbul Atlas Üniversitesi", "İstanbul Aydın Üniversitesi", "İstanbul Ayvansaray Üniversitesi",
  "İstanbul Bilgi Üniversitesi", "İstanbul Galata Üniversitesi", "İstanbul Gedik Üniversitesi",
  "İstanbul Gelişim Üniversitesi", "İstanbul Kent Üniversitesi", "İstanbul Kültür Üniversitesi",
  "İstanbul Medeniyet Üniversitesi", "İstanbul Medipol Üniversitesi", "İstanbul Okan Üniversitesi",
  "İstanbul Sabahattin Zaim Üniversitesi", "İstanbul Sağlık ve Sosyal Bilimler Meslek Yüksekokulu",
  "İstanbul Sağlık ve Teknoloji Üniversitesi", "İstanbul Teknik Üniversitesi", "İstanbul Ticaret Üniversitesi",
  "İstanbul Yeni Yüzyıl Üniversitesi", "İstanbul Esenyurt Üniversitesi", "İstanbul Rumeli Üniversitesi",
  "İstinye Üniversitesi", "İzmir Bakırçay Üniversitesi", "İzmir Demokrasi Üniversitesi", "İzmir Ekonomi Üniversitesi",
  "İzmir Katip Çelebi Üniversitesi", "İzmir Tınaztepe Üniversitesi", "İzmir Yüksek Teknoloji Enstitüsü",
  "Kadir Has Üniversitesi", "Kafkas Üniversitesi", "Kahramanmaraş Sütçü İmam Üniversitesi", "Kapadokya Üniversitesi",
  "Karabük Üniversitesi", "Karadeniz Teknik Üniversitesi", "Karamanoğlu Mehmetbey Üniversitesi", "Kastamonu Üniversitesi",
  "Kayseri Üniversitesi", "Kırıkkale Üniversitesi", "Kırklareli Üniversitesi", "Kırşehir Ahi Evran Üniversitesi",
  "Kilis 7 Aralık Üniversitesi", "Kocaeli Üniversitesi", "Kocaeli Sağlık ve Teknoloji Üniversitesi", "Koç Üniversitesi",
  "Konya Gıda ve Tarım Üniversitesi", "Konya Teknik Üniversitesi", "KTO Karatay Üniversitesi", "Kütahya Dumlupınar Üniversitesi",
  "Kütahya Sağlık Bilimleri Üniversitesi", "Lefke Avrupa Üniversitesi", "Malatya Turgut Özal Üniversitesi",
  "Maltepe Üniversitesi", "Manisa Celal Bayar Üniversitesi", "Mardin Artuklu Üniversitesi", "Marmara Üniversitesi",
  "MEF Üniversitesi", "Mersin Üniversitesi", "Mimar Sinan Güzel Sanatlar Üniversitesi", "Muğla Sıtkı Koçman Üniversitesi",
  "Munzur Üniversitesi", "Muş Alparslan Üniversitesi", "Niğde Ömer Halisdemir Üniversitesi", "Nişantaşı Üniversitesi",
  "Nuh Naci Yazgan Üniversitesi", "Ondokuz Mayıs Üniversitesi", "Ordu Üniversitesi", "Orta Doğu Teknik Üniversitesi",
  "Osmaniye Korkut Ata Üniversitesi", "Ostim Teknik Üniversitesi", "Özyeğin Üniversitesi", "Pamukkale Üniversitesi",
  "Piri Reis Üniversitesi", "Recep Tayyip Erdoğan Üniversitesi", "Sabancı Üniversitesi", "Sağlık Bilimleri Üniversitesi",
  "Sakarya Üniversitesi", "Sakarya Uygulamalı Bilimler Üniversitesi", "Samsun Üniversitesi", "Sanko Üniversitesi",
  "Selçuk Üniversitesi", "Siirt Üniversitesi", "Sinop Üniversitesi", "Sivas Cumhuriyet Üniversitesi",
  "Sivas Bilim ve Teknoloji Üniversitesi", "Süleyman Demirel Üniversitesi", "Şırnak Üniversitesi", "Tarsus Üniversitesi",
  "TED Üniversitesi", "Tekirdağ Namık Kemal Üniversitesi", "TOBB Ekonomi ve Teknoloji Üniversitesi", "Toros Üniversitesi",
  "Trakya Üniversitesi", "Türk-Alman Üniversitesi", "Türk-Japon Bilim ve Teknoloji Üniversitesi",
  "Türk Hava Kurumu Üniversitesi", "Türkiye Uluslararası İslam, Bilim ve Teknoloji Üniversitesi",
  "Uşak Üniversitesi", "Üsküdar Üniversitesi", "Yalova Üniversitesi", "Yaşar Üniversitesi", "Yeditepe Üniversitesi",
  "Yıldız Teknik Üniversitesi", "Yüksek İhtisas Üniversitesi", "Yüzüncü Yıl Üniversitesi", "Zonguldak Bülent Ecevit Üniversitesi"
];

export const TURKISH_DEPARTMENTS = [
  "Özel Eğitim Öğretmenliği", "Zihin Engelliler Öğretmenliği", "Görme Engelliler Öğretmenliği", 
  "İşitme Engelliler Öğretmenliği", "Üstün Zekalılar Öğretmenliği", "Psikoloji", 
  "Psikolojik Danışmanlık ve Rehberlik (PDR)", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", 
  "Fizyoterapi ve Rehabilitasyon", "Ergoterapi", "Dil ve Konuşma Terapisi", "Odyoloji", 
  "Sosyal Hizmet", "Hemşirelik", "Sınıf Öğretmenliği", "Beden Eğitimi ve Spor Öğretmenliği",
  "Müzik Öğretmenliği", "Görsel Sanatlar Öğretmenliği", "Felsefe", "Sosyoloji", "Sağlık Yönetimi"
];

export const CERTIFICATION_LIST = [
  "ABA (Uygulamalı Davranış Analizi) - Uygulayıcı Sertifikası",
  "PECS (Resim Değiş Tokuşuna Dayalı İletişim Sistemi)",
  "ETEÇOM (Etkileşim Temelli Erken Çocuklukta Müdahale Programı)",
  "OÇİDE (Otizmli Çocuklar İçin Davranışsal Eğitim)",
  "PCDI (Otizm Müdahale Modeli) Eğitimi",
  "GOBDO-2-TV (Otistik Bozukluk Derecelendirme Ölçeği)",
  "TÖSİ (Türkçe Öğrenci Sosyal İletişim Ölçeği)",
  "GİS (Gelişimsel İzleme ve Destekleme Rehberi)",
  "PREP (Disleksi Bilişsel Müdahale Programı)",
  "COGENT (Bilişsel Gelişim Programı)",
  "DMP (Disleksi Müdahale Programı)",
  "ODEM (Okuma Yazma Değerlendirme ve Müdahale)",
  "PASS Teorisi ve Bilişsel Müdahale Stratejileri",
  "DİSKALKULİ (Matematik Öğrenme Güçlüğü) Müdahale Programı",
  "TİLLS (Test of Integrated Language and Literacy Skills)",
  "Okuma Yazma Öğretimi Stratejileri Sertifikası",
  "Touch Math (Dokunmatik Matematik Öğretim Sistemi)",
  "Özel Eğitimde Somut Materyallerle Matematik Öğretimi",
  "Singapore Maths (Özel Eğitim Adaptasyonu)",
  "Dis-Mat (Diskalkuli Müdahale Seti) Kullanıcı Eğitimi",
  "WISC-V Zeka Testi Uygulayıcı Sertifikası",
  "CAS (Cognitive Assessment System) Uygulayıcı",
  "Denver II Gelişimsel Tarama Testi",
  "MOXO Çeldiricili Dikkat Testi Uygulayıcı",
  "AGTE (Ankara Gelişim Tarama Envanteri)",
  "Stanford-Binet Zeka Testi Uygulayıcı",
  "Frostig Görsel Algı Testi",
  "Metropolitan Okul Olgunluğu Testi",
  "DIR Floortime (101 / 201 Seviye Sertifikası)",
  "Duyu Bütünleme (Sensory Integration) Eğitimi",
  "PADAD (Pragmatik Dil Analizi ve Değerlendirmesi)",
  "Artikülasyon ve Fonolojik Bozukluklar Müdahale Eğitimi",
  "Oral Motor Terapi Teknikleri",
  "GOPÖ (Gecikmiş Konuşma Programı)",
  "Oyun Terapisi (Deneyimsel veya Bilişsel Davranışçı)",
  "Filial Terapi (Ebeveyn-Çocuk İlişkisi Terapisi)",
  "Montessori Eğitmenliği (Özel Eğitim Uyarlamalı)",
  "Özel Eğitimde Drama Eğitmenliği",
  "Akıl ve Zeka Oyunları Eğitmenliği",
  "Robotik Kodlama (Erişilebilirlik ve Özel Eğitim)",
  "Özel Eğitimde Masal Terapisi ve Sosyal Öykü Yazımı"
];

export const MOCK_QUESTIONS = {
  academic_proficiency: [
    {
      id: 'math_adv_abstract',
      text: 'Diskalkuli tanılı 3. sınıf öğrencisi "çarpma" işlemini ezberlemiş görünmesine rağmen, problem içinde (örn: "Her birinde 5 elma olan 3 sepet") toplamayı çarpma ile ilişkilendiremiyor. En "derin" müdahale basamağınız hangisidir?',
      type: 'radio',
      options: [
        'Sepetleri ve elmaları fiziksel nesnelerle modelleyip "grup-adet" eşlemesini dokunsal olarak yapmak.',
        'Çarpma kelimesini duyduğunda her zaman "kere" veya "tane" demesi gerektiğini hatırlatıp işlemi yaptırmak.',
        'Sayı doğrusu üzerinde beşer beşer atlayarak geldiği noktanın sonucunu işlem kağıdıyla eşleştirmek.',
        'Çarpım tablosunu ritmik sayma ile pekiştirip hızlandırma çalışmaları yapmak.'
      ]
    },
    {
      id: 'math_adv_place_value',
      text: 'Onluk bozarak çıkarma işleminde (örn: 52-27) sürekli "üsttekinden alttakini çıkarma" hatası (sonuç: 35 yerine 35 bulma - küçükten büyüğü çıkarma) yapan öğrenciye yaklaşımınız ne olur?',
      type: 'radio',
      options: [
        'Onluk ve birlikleri fiziksel bloklarla ayırıp, "yeterli birlik yoksa bir onluğu bozup birliğe ekleme" sürecini somutlaştırmak.',
        'İşlem sırasını içeren bir akış şeması sunarak adımları takip ettirmek.',
        'Çıkan sayıyı önce onluğa tamamlayıp aradaki farkı ekletmek.',
        '"Küçükten büyük çıkmaz" cümlesini her işlemde sesli tekrar ettirip öz-denetim sağlamak.'
      ]
    },
    {
      id: 'math_adv_spatial',
      text: 'Geometri: Uzamsal algı güçlüğü olan bir öğrenci, 3D şekillerin açınımını kağıt üzerinde canlandıramıyor. Müdahalede "en etkili" teknoloji/yöntem kombinasyonunuz nedir?',
      type: 'radio',
      options: [
        'Şekilleri fiziksel olarak kartonlardan kestirip birleştirme-açma egzersizlerini eşzamanlı sözel betimleme ile yapmak.',
        'Tablet üzerinden 3D modelleri 360 derece döndürerek izletmek ve zihinsel rotasyon testi yapmak.',
        'Şeklin her yüzünü farklı renge boyayıp sadece renkler üzerinden eşleştirme yaptırmak.',
        'Küpün 6 yüzü, silindirin 3 yüzü olduğu bilgisini ritmik olarak tekrarlatıp tanımasını sağlamak.'
      ]
    },
    {
      id: 'math_adv_logic_ef',
      text: 'Yürütücü İşlev bozukluğu olan öğrenci, çok adımlı matematik problemlerinde "gereksiz bilgiyi" ayıklayamıyor. Sistematik çözüm stratejiniz?',
      type: 'radio',
      options: [
        'Metni bölümlere ayırıp sadece "sayısal verileri" yuvarlak içine aldırarak "İşlem kutusuna" taşıma algoritmasını öğretmek.',
        'Problemi siz okuyup gereksiz kısımları atarak sadece çözmesi gereken rakamları sunmak.',
        'Önemli kelimelerin altını çizdirip işlem sembolüyle eşleştirtmek.',
        'Problem çözme süresini kısıtlayarak öğrencinin sezgisel olarak sonuca odaklanmasını sağlamak.'
      ]
    },
    {
      id: 'turk_adv_decoding',
      text: 'Disleksi müdahalesinde öğrenci "B-D-P" harflerini karıştırıyor ve akıcı okumada "uydurarak okuma" yapıyor. Bu "tahmin stratejisini" nasıl kırırsınız?',
      type: 'radio',
      options: [
        'Tahmin etmeyi engellemek için metindeki resimleri kapatıp, kelimeleri anlamsız hecelere bölerek sadece sesletim odaklı çalışmak.',
        'Harflerin yönünü belirten görsel ipuçlarını masaya yapıştırıp her takıldığında kontrol ettirmek.',
        'Harfleri kum tepsisine yazdırırken aynı anda sesini çıkarttırıp kalıcı öğrenme sağlamak.',
        'Aynı metni kronometre ile defalarca okutup hata sayısını azaltmaya odaklanmak.'
      ]
    },
    {
      id: 'turk_adv_comprehension',
      text: 'Hiperleksi eğilimli bir öğrencide, okuduğu paragrafın "ana fikrini" bulması için hangi "üst-bilişsel" aracı devreye sokarsınız?',
      type: 'radio',
      options: [
        'Metindeki karakter, olay ve yer ilişkisini bir diyagramda çizdirip "Burası neden önemli?" sorusunu görselleştirmek.',
        'Metinle ilgili "Kim, Nerede, Ne zaman" gibi 5N1K sorularını içeren standart bir test uygulamak.',
        'Metni kendi cümleleriyle 3 cümlede anlatmasını isteyip anahtar kelimelerin altını çizdirmek.',
        'Metindeki bilinmeyen kelimeleri bulup sözlükten anlamlarını eşleştirerek kelime hazinesini genişletmek.'
      ]
    },
    {
      id: 'turk_adv_phonology',
      text: 'Fonolojik Farkındalık: "Kelime içinden ses çıkarma/ekleme" aşamasında takılan ağır disleksi tanılı öğrenciye "K-İ-T-A-P" kelimesinden "K" sesini attığınızda ne kalır sorusuna doğru yanıt veremiyor. Müdahale basamağınız?',
      type: 'radio',
      options: [
        'Her sesi bir renkli blokla temsil edip, baştaki bloğu fiziksel olarak masadan çekerek kalan sesleri sesletmesini istemek.',
        'Kelimeyi defalarca heceleyerek doğruyu duyana kadar tekrar etmek.',
        'Benzer kelimelerle bir tekerleme oluşturup işitsel aşinalık kazandırmak.',
        'Kelimeyi tahtaya yazıp ilk harfinin üzerini çarpı ile kapatarak okumasını söylemek.'
      ]
    },
    {
      id: 'turk_adv_graphomotor',
      text: 'Yazı-Motor Entegrasyonu: Harfleri ters yazma veya satır çizgisini takip edememe durumunda, görsel geri bildirim yerine "proprioseptif" geri bildirimi nasıl önceliklendirirsiniz?',
      type: 'radio',
      options: [
        'Yazım sırasında elin ve bileğin konumunu daha net hissettirecek materyaller kullanarak motor planlamayı desteklemek.',
        'Işıklı bir yüzeyde harflerin üzerinden geçerek görsel odaklanmayı en üst seviyeye çıkarmak.',
        'İyi yazılmış bir metnin üzerinden defalarca iz sürme yaptırarak kas hafızası oluşturmak.',
        'Harfin her hamlesini yüksek sesle söyleyerek yazdırmak.'
      ]
    },
    {
      id: 'lang_adv_pragmatic',
      text: 'Yüksek işlevli otizm olan öğrenci, mülahaza sırasında sadece kendi ilgisini çeken "Trenler" hakkında konuşuyor ve karşısındakinin "sıkılma" vücut dilini okuyamıyor. Müdahaleniz?',
      type: 'radio',
      options: [
        'Duygu kartları ve video modelleme ile mikro-ifadeleri analiz edip iletişim durdurma sinyallerini öğretmek.',
        'Öğrenciye trenler hakkında konuşması için kısıtlı bir süre izin verip konuyu kademeli olarak değiştirmek.',
        'Masaya dinleme ve konuşma kartları koyup sırası geldiğinde konuşmasını sağlamak.',
        'Trenler hakkında konuştuğunda tepkisiz kalıp başka konuya geçtiğinde pekiştirmek.'
      ]
    },
    {
      id: 'lang_adv_functional',
      text: 'Konuşmayan bir öğrenci, istediği bir nesneye ulaşamadığında kendine zarar verme davranışı sergiliyor. Önceliğiniz nedir?',
      type: 'radio',
      options: [
        'Zarar verme davranışı başlamadan hemen önce, öğrenciye "İste" veya "Yardım et" kartını kullandırmayı öğretmek.',
        'Çocuğun kendine vurmasını engellemek için koruyucu donanım kullanmak ve duyusal girdiler sunmak.',
        'Sadece en sevdiği oyuncakları kullanarak ses çıkartması için yapılandırılmış bekleme süreleri uygulamak.',
        'Davranış başladığında çocuğu güvenli bir alana alıp sakinleşene kadar beklemek.'
      ]
    },
    {
      id: 'lang_adv_receptive',
      text: 'Alıcı Dil: Karmaşık yönergeleri yerine getiremeyen bir öğrenciye yönergeyi nasıl modifiye edersiniz?',
      type: 'radio',
      options: [
        'Yönergeyi kısa cümlelere bölüp her adım tamamlandığında bir sonrakine geçmek ve görsel akış şeması kullanmak.',
        'Yönergeyi verdikten sonra öğrencinin aynısını sesli olarak tekrar etmesini isteyerek kontrol etmek.',
        'Yönergeyi söylerken öğrenciyi doğru yöne yönlendirerek eşzamanlı yardım sunmak.',
        'Sadece eylem odaklı, bağlamdan bağımsız komutlar vermek.'
      ]
    },
    {
      id: 'lang_adv_echolalia',
      text: 'Ekolali Yönetimi: Öğrenci sorulan her soruya soruyu aynen tekrarlayarak cevap veriyor. Bu tekrarları işlevsel iletişime dönüştürme stratejiniz?',
      type: 'radio',
      options: [
        'Soruyu sorduktan hemen sonra cevabın baş harfini veya ilk hecesini fısıldayarak doğru cevabı tetiklemek.',
        'Tekrar ettiğinde tepki vermeyip, sadece doğru kelimeyi söylediğinde pekiştireç sunmak.',
        'Tekrar etmeye başladığı an el işaretiyle durdurup sessiz kalmasını sağlamak.',
        'Sorduğunuz sorunun resimli kartını gösterip kartı eline verdiğinde cevaplamasını beklemek.'
      ]
    },
    {
      id: 'soc_adv_empathy',
      text: 'Sosyal Bilgiler: "Başkalarının duygularını anlama" kazanımında zorlanan bir öğrenciye, bir arkadaşının neden üzgün olduğunu anlatırken hangi teknik en yüksek başarıyı sağlar?',
      type: 'radio',
      options: [
        'Durumu öğrencinin bakış açısıyla yazılmış, net kuralları ve sosyal ipuçlarını içeren kısa bir öykü ile açıklamak.',
        'Kendi deneyimleri üzerinden "Senin oyuncağın kırılsaydı üzülürdün" diyerek empati kurmasını istemek.',
        'Sınıf içinde olayı canlandırıp öğrenciye üzgün karakter rolünü vererek deneyimletmek.',
        'Arkadaşının yanına bir duygu emojisi koyup nedenini sözlü olarak açıklamak.'
      ]
    },
    {
      id: 'soc_adv_regulation',
      text: 'Duygu Düzenleme: Bir hayal kırıklığı anında ağlama krizine giren bir öğrenciye duygu yönetimi nasıl öğretilir?',
      type: 'radio',
      options: [
        'Öfkesini puanlatıp durumun vahametini bilişsel olarak yeniden değerlendirmesini sağlamak.',
        'Hiç konuşmadan çocuğu sakinleşeceği bir alana alıp kendi kendini regüle etmesini beklemek.',
        'Ağlamadığı her zorlayıcı an için görsel pekiştireçler vererek süreci ödüllendirmek.',
        'Ağlamaya başladığı an sevdiği bir etkinliği sunarak odağını hızla değiştirmek.'
      ]
    },
    {
      id: 'soc_adv_authority',
      text: 'Sosyal Hiyerarşi: Öğrenci, okul müdürü ile sınıf arkadaşına aynı üslupla hitap ediyor. Farkındalık geliştirmek için en yapılandırılmış müdahale hangisidir?',
      type: 'radio',
      options: [
        'Farklı otoritelerle yapılan iletişim örneklerini izletip aradaki farkları tabloya döktürmek.',
        'Müdürün yanına her gittiğinde önceden hatırlatma yaparak rehberlik etmek.',
        'Yanlış hitap ettiğinde ortamdan uzaklaştırıp doğruyu bulana kadar geri almamak.',
        'Arkadaşlarıyla canlandırma yaparken otorite rollerini kullanarak prova yaptırmak.'
      ]
    }
  ],
  logic_literacy: [
    { 
      id: 'prioritization_1', 
      text: 'Aynı anda gelişen üç olayda önceliğiniz: 1) Nöbet geçiren öğrenci, 2) Kurum müdürünün acil rapor talebi, 3) Seans saati gelen ama ağlayan bir başka öğrenci.', 
      type: 'radio', 
      options: [
        'Önce tıbbi aciliyet, sonra sınıf güvenliği, en son idari süreçler.',
        'Hızla idari raporu verip, nöbet geçiren öğrenciye müdahale ederken diğer öğrenciyi sakinleştiririm.',
        'Nöbeti hemşireye bırakır, ağlayan öğrenciyi seansa alır, raporu sonra yazarım.',
        'Hepsi kritiktir, personelden yardım isteyip koordinasyon kurarım.'
      ] 
    },
    {
      id: 'method_clash',
      text: 'Uyguladığınız teknik çocukta fiziksel bir tepki değil ama şiddetli bir ağlama krizi yarattı. Veli "Bırakın ağlasın, alışsın" diyor. Tavrınız?',
      type: 'radio',
      options: [
        'Davranışın işlevini analiz etmek için seansı durdurur, ağlamanın nedenini belirlemeden devam etmem.',
        'Velinin talebine uyarım, sürecin bir parçası olarak değerlendiririm.',
        'Hemen seansı bitirip çocuğu oyun odasına götürürüm, güven bağı korunmalı.',
        '5 dakika daha devam eder, ağlama dinmezse ara veririm.'
      ]
    },
    {
      id: 'logic_resource',
      text: 'Kısıtlı Kaynak: Seans için gereken kritik bir materyali başka bir öğretmen almış ve seansınızın başlamasına 1 dakika var. Öğrenciniz ise materyal değişikliğine karşı aşırı dirençli. Çözümünüz?',
      type: 'radio',
      options: [
        'Materyalin mola verdiğini gösteren bir kart sunup alternatif materyale geçişi bekleme egzersiziyle yönetmek.',
        'Diğer öğretmenin odasına gidip materyali geri almak, seans akışını bozmamak.',
        'Materyal gelene kadar öğrenciyi serbest bırakıp odada kendi kendine vakit geçirmesini izlemek.',
        'Materyal yokluğunu telafi etmek için normalde kullanılmayan bir ödül sunmak.'
      ]
    },
    {
      id: 'logic_policy',
      text: 'Veli Talebi: Bir veli, BEP dışına çıkmanızı ve çocuğuna okul ödevlerini yaptırmanızı istiyor. Aksi takdirde şikayet edeceğini söylüyor. Profesyonel duruşunuz?',
      type: 'radio',
      options: [
        'Veliyi görüşmeye alıp BEP hedeflerinin hayati önemini verilerle açıklamak ve mülakatın terapötik amacını korumak.',
        'Velinin gönlünü almak için seansın son 10 dakikasını ödevlere ayırmayı teklif etmek.',
        'Veliyi kurum müdürüne yönlendirip kararı onlara bırakmak.',
        'Gizli bir şekilde ödevleri yaptırıp veliyle arayı iyi tutmak.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'clinical_error',
      text: 'Müdahale planında bir hata yaptığınızı ve öğrencinin 3 aydır yanlış beceri üzerinde çalıştığını fark ettiniz. Kimse fark etmedi. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Hatayı verilerle birlikte yönetime ve aileye açıklar, telafi planı oluştururum.',
        'Planı hemen günceller ve öğrenciyi doğru beceriye yönlendiririm.',
        'Diğer uzmanların da kontrol etmediğini belirterek ortak bir hata analizi toplantısı isterim.',
        'Hali hazırda öğrenilenlere odaklanıp yeni hedeflere geçerim.'
      ]
    },
    {
      id: 'peer_review',
      text: 'Bir meslektaşınızın seans sırasında öğrenciye karşı bilimsel dayanağı olmayan bir yöntem uyguladığını gördünüz. İlk adımınız?',
      type: 'radio',
      options: [
        'Meslektaşınızı seans sonrası uygun bir dille bilgilendirmek ve kurumun bilimsel standartlarını hatırlatmak.',
        'Kurum müdürüne gidip durumu anlatmak ve müdahale edilmesini sağlamak.',
        'Diğer öğretmenlerle bu durumu paylaşıp görüşlerini almak.',
        'Kendi işime odaklanıp meslektaşımın yöntemine karışmamak.'
      ]
    },
    {
      id: 'confidentiality_issue',
      text: 'Gizlilik: Bir öğrencinin yakın bir akrabası, ailenin haberi olmadan sizi arayıp çocuğun gelişimi hakkında bilgi istiyor. Yanıtınız?',
      type: 'radio',
      options: [
        'Bilgi paylaşımının sadece yasal velilerle yapılabileceğini belirtip veri aktarmamak.',
        'Genel olarak iyi gittiğini söyleyip detay vermeden merakını gidermek.',
        'Akraba olduğu için güvenip genel gözlemleri paylaşmak.',
        'Aileyi arayıp akrabalarının aradığını bildirip onaylarını istemek.'
      ]
    }
  ],
  professional_cases_extra: [
    {
      id: 'dual_relationship',
      text: 'Çift Taraflı İlişki: Bir veliniz, size kendi iş yerinde bir indirim veya avantaj teklif etti. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Teklifi profesyonel sınırlar gereği kabul edemeyeceğinizi belirterek etik gerekliliği izah etmek.',
        'Teklifi kabul edip seanslarda bu konuyu hiç açmamak.',
        'Küçük bir jest olarak görüp teşekkür ederek kabul etmek.',
        'Eşitlik sağlamak adına siz de ona ek destek sunmayı teklif etmek.'
      ]
    }
  ],
  psychological_integrity: [
    {
      id: 'aggression_response',
      text: 'Ağır düzeyde otizmli bir öğrenciden fiziksel bir saldırı aldınız ve canınız yandı. Seansın kalan 20 dakikasını nasıl yönetirsiniz?',
      type: 'radio',
      options: [
        'Duygularımı regüle etmek için kısa bir ara verir ve güvenli bir mesafeden devam ederim.',
        'Hiçbir şey olmamış gibi devam ederek sürecin pekişmesini önlerim.',
        'Seansı hemen bitirip odadan çıkarak durumun sonucunu gösteririm.',
        'Üzüldüğümü göstererek öğrencinin empati kurmasını beklerim.'
      ]
    },
    {
      id: 'failure_burnout',
      text: 'Tükenmişlik: 1 yıldır çalıştığınız bir öğrenci hiçbir hedefi geçemedi ve her seansta aynı döngüyü yaşıyorsunuz. Motivasyonunuzu nasıl korursunuz?',
      type: 'radio',
      options: [
        'Vaka analizini bir üst uzmanla paylaşıp müdahale planını radikal bir şekilde revize etmek.',
        'Beklentileri minimize ederek mevcut durumu kabullenmek.',
        'Kurumdan bu öğrenci yerine başka bir öğrenci talep etmek.',
        'Sorunun çevre kaynaklı olduğunu varsayarak odağımı değiştirmek.'
      ]
    },
    {
      id: 'work_life_boundary',
      text: 'İş-Özel Hayat Dengesi: Bir veli, gece saat 23:00\'te size mesaj atarak acil bir davranış problemi için yardım istiyor. Tepkiniz?',
      type: 'radio',
      options: [
        'Mesajı o an yanıtlamayıp mesai saatinde acil durum protokollerini hatırlatarak sınır çizmek.',
        'Veliye yardımcı olmak adına hemen telefonda destek sunmak.',
        'Kısa bir cevap verip yarın görüşmeyi teklif etmek.',
        'Yanıt vermeyip durumu idari yönetime şikayet etmek.'
      ]
    }
  ],
  development: [
    {
      id: 'failure_analysis_multi',
      text: 'Öğrenci 6 aydır "Renkleri Ayırt Etme" hedefini geçemedi. Müdahale metodolojinizdeki revizyon önceliğiniz nedir?',
      type: 'radio',
      options: [
        'Sunum şeklini, pekiştireç tarifesini veya yardım hiyerarşisini analiz edip değiştirmek.',
        'Bilişsel kapasitesinin yetersiz olduğunu varsayıp hedefi askıya almak.',
        'Kullanılan materyallerin fiziksel özelliklerini değiştirip tekrar denemek.',
        'Ailenin evdeki desteğini artırması için ev programı hazırlamak.'
      ]
    },
    {
      id: 'supervision_feedback',
      text: 'Geri Bildirim: Akademik kurul, uyguladığınız yöntemin hatalı olduğuna dair sert bir eleştiri yaptı. Reaksiyonunuz?',
      type: 'radio',
      options: [
        'Eleştiriyi verilerle analiz edip hatayı kabul ederek önerilen protokolü uygulamak.',
        'Öğrenciyi en iyi tanıyanın kendiniz olduğunu belirterek yöntemi savunmak.',
        'Eleştiriyi kabul etmiş gibi görünüp mevcut yönteme devam etmek.',
        'Eleştiriyi kişisel algılayıp motivasyon kaybı yaşamak.'
      ]
    },
    {
      id: 'lifelong_learning_ai',
      text: 'Teknoloji: Özel eğitimde Yapay Zeka destekli analiz araçlarının kullanımı hakkında ne düşünüyorsunuz?',
      type: 'radio',
      options: [
        'Klinik sağduyuyu koruyarak verilerin objektif analizi için bu araçları asistan olarak kullanmaya hazırım.',
        'Süreci mekanikleştireceğini düşünerek bu tür teknolojilere karşı durmayı tercih ederim.',
        'Öğretmenlerin yerini almasından kaygı duyarak uzak durmayı tercih ederim.',
        'Kurumsal bir talep olursa kullanırım, bireysel bir tercihim bulunmuyor.'
      ]
    }
  ]
};
