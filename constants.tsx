
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
        'Somutlaştırma: Sepetleri ve elmaları fiziksel nesnelerle modelleyip "grup-adet" eşlemesini dokunsal (Touch-Math) olarak yapmak.',
        'Sözel İpucu: Çarpma kelimesini duyduğunda her zaman "kere" veya "tane" demesi gerektiğini hatırlatıp işlemi yaptırmak.',
        'Görsel İşlemleme: Sayı doğrusu üzerinde beşer beşer atlayarak geldiği noktanın sonucunu işlem kağıdıyla eşleştirmek.',
        'Hata-Sız Öğretim: Çarpım tablosunu ritmik sayma ile pekiştirip hızlandırma çalışmaları (Fluency) yapmak.'
      ]
    },
    {
      id: 'math_adv_place_value',
      text: 'Onluk bozarak çıkarma işleminde (örn: 52-27) sürekli "üsttekinden alttakini çıkarma" hatası (sonuç: 35 yerine 35 bulma - küçükten büyüğü çıkarma) yapan öğrenciye yaklaşımınız ne olur?',
      type: 'radio',
      options: [
        'Basamak Değeri Analizi: Onluk ve birlikleri fiziksel bloklarla ayırıp, "yeterli birlik yoksa bir onluğu bozup birliğe ekleme" sürecini somutlaştırmak.',
        'Algoritma Tekrarı: İşlem sırasını (1. Birler basamağına bak, 2. Komşuya git) içeren bir akış şeması (Visual Schedule) sunmak.',
        'Zihinden Strateji: Çıkan sayıyı önce onluğa tamamlayıp aradaki farkı ekletmek (Upward Counting).',
        'Kural Hatırlatıcı: "Küçükten büyük çıkmaz" cümlesini her işlemde sesli tekrar ettirip (Self-Monitoring) yaptırmak.'
      ]
    },
    {
      id: 'math_adv_spatial',
      text: 'Geometri: Uzamsal algı (Spatial Processing) güçlüğü olan bir öğrenci, 3D şekillerin açınımını kağıt üzerinde canlandıramıyor. Müdahalede "en etkili" teknoloji/yöntem kombinasyonunuz nedir?',
      type: 'radio',
      options: [
        'Dokunsal-Kinestetik: Şekilleri fiziksel olarak kartonlardan kestirip birleştirme-açma egzersizlerini eşzamanlı sözel betimleme ile yapmak.',
        'Dijital Modelleme: Tablet üzerinden 3D modelleri 360 derece döndürerek izletmek ve zihinsel rotasyon testi yapmak.',
        'Görsel İpucu: Şeklin her yüzünü farklı renge boyayıp sadece renkler üzerinden eşleştirme yaptırmak.',
        'Ezber Stratejisi: Küpün 6 yüzü, silindirin 3 yüzü olduğu bilgisini ritmik olarak tekrarlatıp tanımasını sağlamak.'
      ]
    },
    {
      id: 'math_adv_logic_ef',
      text: 'Yürütücü İşlev (Executive Function) bozukluğu olan öğrenci, çok adımlı matematik problemlerinde "gereksiz bilgiyi" (distractor info) ayıklayamıyor. Sistematik çözüm stratejiniz?',
      type: 'radio',
      options: [
        'Veri Ayıklama: Metni bölümlere ayırıp sadece "sayısal verileri" yuvarlak içine aldırarak "İşlem kutusuna" taşıma algoritmasını öğretmek.',
        'Metni Basitleştirme: Problemi siz okuyup gereksiz kısımları atarak sadece çözmesi gereken rakamları sunmak.',
        'Görsel İşaretleme: Önemli kelimelerin (toplam, fark, her biri) altını çizdirip işlem sembolüyle eşleştirtmek.',
        'Hızlandırma: Problem çözme süresini kısıtlayarak öğrencinin sezgisel olarak sonuca odaklanmasını sağlamak.'
      ]
    },
    {
      id: 'turk_adv_decoding',
      text: 'Disleksi müdahalesinde öğrenci "B-D-P" harflerini karıştırıyor ve akıcı okumada "uydurarak okuma" (Metnin bağlamından tahmin etme) yapıyor. Bu "tahmin stratejisini" nasıl kırırsınız?',
      type: 'radio',
      options: [
        'Bilişsel Ketleme (Inhibition): Tahmin etmeyi engellemek için metindeki resimleri kapatıp, kelimeleri anlamsız hecelere bölerek (Pseudo-words) sadece sesletim odaklı çalışmak.',
        'Görsel Hafıza: Harflerin yönünü belirten görsel ipuçlarını (örn: B\'nin karnı sağda) masaya yapıştırıp her takıldığında kontrol ettirmek.',
        'Multi-Sensory: Harfleri kum tepsisine yazdırırken aynı anda sesini çıkarttırıp (VAK - Visual Auditory Kinesthetic) derin iz bırakmak.',
        'Akıcılık Çalışması: Aynı metni kronometre ile defalarca okutup hata sayısını azaltmaya odaklanmak.'
      ]
    },
    {
      id: 'turk_adv_comprehension',
      text: 'Hiperleksi (Mekanik okuma çok iyi, anlamlandırma yok) eğilimli bir öğrencide, okuduğu paragrafın "ana fikrini" bulması için hangi "üst-bilişsel" aracı devreye sokarsınız?',
      type: 'radio',
      options: [
        'Görsel Haritalama (Story Mapping): Metindeki karakter, olay ve yer ilişkisini bir diyagramda çizdirip "Burası neden önemli?" sorusunu görselleştirmek.',
        'Soru-Cevap: Metinle ilgili "Kim, Nerede, Ne zaman" gibi 5N1K sorularını içeren standart bir test uygulamak.',
        'Özetleme: Metni kendi cümleleriyle 3 cümlede anlatmasını isteyip anahtar kelimelerin altını çizdirmek.',
        'Semantik Analiz: Metindeki bilinmeyen kelimeleri bulup sözlükten anlamlarını eşleştirerek kelime hazinesini genişletmek.'
      ]
    },
    {
      id: 'turk_adv_phonology',
      text: 'Fonolojik Farkındalık: "Kelime içinden ses çıkarma/ekleme" (Phoneme Elision) aşamasında takılan ağır disleksi tanılı öğrenciye "K-İ-T-A-P" kelimesinden "K" sesini attığınızda ne kalır sorusuna doğru yanıt veremiyor. Müdahale basamağınız?',
      type: 'radio',
      options: [
        'Görsel Bloklama: Her sesi bir renkli blokla temsil edip, baştaki bloğu fiziksel olarak masadan çekerek kalan sesleri sesletmesini istemek.',
        'Sözel Tekrar: Kelimeyi defalarca heceleyerek "Kitap, İtap, İtap" diye doğruyu duyana kadar tekrar etmek.',
        'Analoji: Benzer kelimelerle (Kap-Ap, Kas-As) bir tekerleme oluşturup işitsel aşinalık kazandırmak.',
        'Yazılı Destek: Kelimeyi tahtaya yazıp ilk harfinin üzerini çarpı ile kapatarak okumasını söylemek.'
      ]
    },
    {
      id: 'turk_adv_graphomotor',
      text: 'Yazı-Motor Entegrasyonu: Harfleri ters yazma veya satır çizgisini takip edememe (Dysgraphia) durumunda, görsel geri bildirim yerine "proprioseptif" (vücut pozisyon duyusu) geri bildirimi nasıl önceliklendirirsiniz?',
      type: 'radio',
      options: [
        'Ağırlaştırılmış Kalem/Bileklik: Yazım sırasında elin ve bileğin konumunu daha net hissettirecek materyaller kullanarak motor planlamayı desteklemek.',
        'Işıklı Tahta: Işıkla parlayan bir yüzeyde harflerin üzerinden geçerek görsel odaklanmayı en üst seviyeye çıkarmak.',
        'Kopyalama: İyi yazılmış bir metnin üzerinden defalarca "iz sürme" (tracing) yaptırarak kas hafızası oluşturmak.',
        'Sözlü Komut: Harfin her hamlesini (Yukarı çık, aşağı in, yuvarla) yüksek sesle söyleyerek yazdırmak.'
      ]
    },
    {
      id: 'lang_adv_pragmatic',
      text: 'Yüksek işlevli otizm (Asperger profili) olan öğrenci, mülahaza (muhabere) sırasında sadece kendi ilgisini çeken "Trenler" hakkında konuşuyor ve karşısındakinin "sıkılma" vücut dilini (bakış kaçırma, saat kontrolü) okuyamıyor. Müdahaleniz?',
      type: 'radio',
      options: [
        'Sosyal Beceri Eğitimi: "Duygu Okuma" kartları ve video modelleme ile mikro-ifadeleri (sıkılma, şaşkınlık) analiz edip "Diyalog Durdurma" sinyallerini öğretmek.',
        'Sınır Koyma: Öğrenciye trenler hakkında konuşması için sadece 5 dakika izin verip, sonra konuyu zorla değiştirmek.',
        'Görsel Destek: Masaya "Dinleme" ve "Konuşma" kartları koyup sırası geldiğinde konuşmasını, bitince dinlemesini sağlamak.',
        'Davranışsal Söndürme: Trenler hakkında konuştuğunda tepkisiz kalıp (Göz teması kesme), başka konuya geçtiğinde pekiştirmek.'
      ]
    },
    {
      id: 'lang_adv_functional',
      text: 'Non-verbal (konuşmayan) bir öğrenci, istediği bir nesneye ulaşamadığında kendine zarar verme (başını vurma) davranışı sergiliyor. "Alternatif İletişim" (AAC) önceliğiniz nedir?',
      type: 'radio',
      options: [
        'FCT (İşlevsel İletişim Eğitimi): Zarar verme davranışı başlamadan hemen önce, öğrenciye "İste" veya "Yardım et" kartını/işaretini kullandırmayı hata-sız bir şekilde öğretmek.',
        'Duyusal Diyet: Çocuğun kendine vurmasını engellemek için koruyucu kask takmak ve ağır yelek gibi propriyoseptif girdiler sunmak.',
        'Mand Eğitimi: Sadece en sevdiği oyuncakları kullanarak "ses çıkartması" için baskı (Time Delay) uygulamak.',
        'Sakinleştirme: Davranış başladığında çocuğu güvenli bir alana alıp sakinleşene kadar beklemek (Time-out).'
      ]
    },
    {
      id: 'lang_adv_receptive',
      text: 'Alıcı Dil: Karmaşık yönergeleri ("Montunu asmadan önce ellerini yıka ve sonra kitabını al") yerine getiremeyen bir öğrenciye yönergeyi nasıl "modifiye" edersiniz?',
      type: 'radio',
      options: [
        'Parçalara Bölme ve Görselleştirme: Yönergeyi 3 ayrı kısa cümleye bölüp, her adım tamamlandığında bir sonraki basamağa geçmek ve görsel akış şeması kullanmak.',
        'Tekrar Ettirme: Yönergeyi verdikten sonra öğrencinin aynısını sesli olarak tekrar etmesini isteyip (Echolalic check) yaptırmak.',
        'Fiziksel Yardım: Yönergeyi söylerken öğrenciyi kollarından tutup doğru yöne yönlendirerek (Physical Prompting) yaptırmak.',
        'Kısa Form: Sadece "Yıka, As, Al" diyerek fiil odaklı, bağlamsız komutlar vermek.'
      ]
    },
    {
      id: 'lang_adv_echolalia',
      text: 'Ekolali Yönetimi: Öğrenci sorulan her soruya soruyu aynen tekrarlayarak cevap veriyor (Anında ekolali). Bu tekrarları "işlevsel iletişime" dönüştürme stratejiniz?',
      type: 'radio',
      options: [
        'İpucu Silikleştirme: Soruyu sorduktan hemen sonra cevabın baş harfini veya ilk hecesini fısıldayarak (Phonemic Prompt) doğru cevabı tetiklemek.',
        'Görmezden Gelme: Tekrar ettiğinde tepki vermeyip, sadece doğru kelimeyi söylediğinde pekiştireç sunmak.',
        'Ketleme: Tekrar etmeye başladığı an elinizle "dur" işareti yapıp sessiz kalmasını sağlamak.',
        'Eşleme: Sorduğunuz sorunun resimli kartını gösterip, kartı eline verdiğinde cevaplamasını beklemek.'
      ]
    },
    {
      id: 'soc_adv_empathy',
      text: 'Sosyal Bilgiler: "Başkalarının duygularını anlama" (Zihin Kuramı - Theory of Mind) kazanımında zorlanan bir öğrenciye, bir arkadaşının neden üzgün olduğunu anlatırken hangi teknik "kanıtlanmış" en yüksek başarıyı sağlar?',
      type: 'radio',
      options: [
        'Sosyal Öyküler (Social Stories): Durumu öğrencinin bakış açısıyla yazılmış, net kuralları ve sosyal ipuçlarını içeren kısa bir öykü ile açıklamak.',
        'Mantıksal Çıkarım: "Senin oyuncağın kırılsaydı sen de üzülürdün" diyerek empatiyi kendi üzerinden kurmasını istemek.',
        'Drama: Sınıf içinde olayı canlandırıp öğrenciye "Üzgün" rolünü vererek hissetmesini sağlamak.',
        'Görsel Semboller: Arkadaşının yanına bir "Üzgün Surat" emojisi koyup nedenini sözlü olarak açıklamak.'
      ]
    },
    {
      id: 'soc_adv_regulation',
      text: 'Duygu Düzenleme: Bir hayal kırıklığı anında (örn: oyunu kaybetmek) ağlama krizine giren bir öğrenciye "Bilişsel Yeniden Yapılandırma" (Cognitive Reappraisal) nasıl öğretilir?',
      type: 'radio',
      options: [
        'Duygu Termometresi: Kayıp anındaki öfkesini 1-10 arası puanlatıp, "Bu olay gerçekten 10 puanlık mı?" sorgusuyla durumun vahametini yeniden değerlendirtmek.',
        'Sakinleşme Köşesi: Hiç konuşmadan çocuğu minderli bir alana alıp kendi kendine sakinleşene kadar (Self-regulation) bekletmek.',
        'Ödül Sistemi: Ağlamadığı her kayıp anı için "yıldız" verip, yıldızlar birikince ödül sunmak.',
        'Dikkat Dağıtma: Ağlamaya başladığı an sevdiği bir videoyu açıp odağını başka yöne kaydırmak.'
      ]
    },
    {
      id: 'soc_adv_authority',
      text: 'Sosyal Hiyerarşi: Öğrenci, okul müdürü ile sınıf arkadaşına aynı (laubali) üslupla hitap ediyor. "Sosyal Bağlam" farkındalığını geliştirmek için en "yapılandırılmış" müdahale hangisidir?',
      type: 'radio',
      options: [
        'Video Modelleme: Farklı otoritelerle yapılan doğru ve yanlış iletişim örneklerini izletip, aradaki farkları (ses tonu, kelime seçimi) tabloya döktürmek.',
        'Sözel Uyarı: Müdürün yanına her gittiğinde "Lütfen kibar konuş" diye önceden hatırlatma yapmak.',
        'Cezalandırma: Yanlış hitap ettiğinde müdürün odasından çıkartıp "Doğru söyleyene kadar giremezsin" demek.',
        'Sosyal Beceri Grubu: Arkadaşlarıyla drama yaparken birinin müdür rolüne girmesini sağlayıp prova yaptırmak.'
      ]
    }
  ],
  logic_literacy: [
    { 
      id: 'prioritization_1', 
      text: 'Aynı anda gelişen üç olayda önceliğiniz: 1) Nöbet geçiren öğrenci, 2) Kurum müdürünün acil rapor talebi, 3) Seans saati gelen ama ağlayan bir başka öğrenci.', 
      type: 'radio', 
      options: [
        'Önce tıbbi aciliyet (Nöbet), sonra sınıf güvenliği (Ağlayan öğrenci), en son idari süreçler.',
        'Hızla idari raporu verip, nöbet geçiren öğrenciye müdahale ederken diğer öğrenciyi sakinleştiririm.',
        'Nöbeti hemşireye bırakır, ağlayan öğrenciyi seansa alır, raporu sonra yazarım.',
        'Hepsi kritiktir, personelden yardım isteyip koordinasyon kurarım.'
      ] 
    },
    {
      id: 'method_clash',
      text: 'Uyguladığınız teknik çocukta fiziksel bir tepki (kusma/bayılma) değil ama şiddetli bir ağlama krizi yarattı. Veli "Bırakın ağlasın, alışsın" diyor. Tavrınız?',
      type: 'radio',
      options: [
        'Etik Değerlendirme: Davranışın işlevini analiz etmek için seansı durdurur, ağlamanın "kaçma" mı yoksa "duyusal aşırı yüklenme" mi olduğunu belirlemeden devam etmem.',
        'Veli İradesi: Velinin talebine uyarım, sönme patlaması (extinction burst) yaşıyor olabiliriz.',
        'Duygusal Yaklaşım: Hemen seansı bitirip çocuğu oyun odasına götürürüm, güven bağı sarsılmamalı.',
        'Uzlaşma: 5 dakika daha devam eder, ağlama dinmezse ara veririm.'
      ]
    },
    {
      id: 'logic_resource',
      text: 'Kısıtlı Kaynak: Seans için gereken kritik bir materyali başka bir öğretmen almış ve seansınızın başlamasına 1 dakika var. Öğrenciniz ise materyal değişikliğine karşı aşırı dirençli (Otistik şemalar). Çözümünüz?',
      type: 'radio',
      options: [
        'Görsel Hazırlık: Öğrenciye materyalin "mola" verdiğini gösteren bir kart sunup, alternatif (ikinci en sevdiği) materyale geçişi yapılandırılmış bir "bekleme" egzersiziyle yönetmek.',
        'Hızlı Müdahale: Diğer öğretmenin odasına gidip materyali zorla geri almak, seans akışını bozmamak.',
        'Serbest Zaman: Materyal gelene kadar öğrenciyi serbest bırakıp odada kendi kendine vakit geçirmesini izlemek.',
        'Rüşvet: Materyal yokluğunu telafi etmek için normalde vermediğiniz bir yiyecek pekiştireci sunmak.'
      ]
    },
    {
      id: 'logic_policy',
      text: 'Veli Talebi: Bir veli, BEP (Bireyselleştirilmiş Eğitim Planı) dışına çıkmanızı ve çocuğuna okul ödevlerini yaptırmanızı istiyor. Aksi takdirde şikayet edeceğini söylüyor. Profesyonel duruşunuz?',
      type: 'radio',
      options: [
        'Eğitsel Savunuculuk: Veliyi görüşmeye alıp BEP hedeflerinin hayati önemini verilerle açıklamak, akademik ödevlerin seansın terapötik amacını nasıl zedeleyeceğini net bir dille belirtmek.',
        'Esneklik: Velinin gönlünü almak için seansın son 10 dakikasını ödevlere ayırmayı teklif etmek.',
        'Yönetime Sevk: Hiç muhatap olmadan veliyi kurum müdürüne yönlendirip kararı onlara bırakmak.',
        'Gizli Kabul: Kimseye söylemeden ödevleri yaptırıp veliyle arayı iyi tutmak.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'clinical_error',
      text: 'Müdahale planında bir hata yaptığınızı ve öğrencinin 3 aydır yanlış beceri üzerinde çalıştığını fark ettiniz. Kimse fark etmedi. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Radikal Şeffaflık: Hatayı verilerle birlikte yönetime ve aileye açıklar, telafi planı (Mastery check) oluştururum.',
        'Sessiz Düzeltme: Planı hemen günceller ve öğrenciyi doğru beceriye yönlendiririm, vakit kaybetmem.',
        'Sorumluluk Paylaşımı: Diğer uzmanların da kontrol etmediğini belirterek ortak bir hata analizi toplantısı isterim.',
        'Görmezden Gelme: Zaten öğrenci bir şeyler öğrenmiştir, yeni hedeflere odaklanırım.'
      ]
    },
    {
      id: 'peer_review',
      text: 'Bir meslektaşınızın seans sırasında öğrenciye karşı bilimsel dayanağı olmayan (örn: bağırma, korkutma) bir yöntem uyguladığını gördünüz. İlk adımınız?',
      type: 'radio',
      options: [
        'Doğrudan İletişim: Meslektaşınızı seans sonrası uygun bir dille duruma dair gözleminizle yüzleştirmek ve kurumun bilimsel standartlarını hatırlatmak.',
        'Gizli Rapor: Hemen kurum müdürüne gidip durumu anlatmak ve meslektaşınızın uyarılmasını sağlamak.',
        'Sosyal Medya/Gıybet: Diğer öğretmenlerle bu durumu paylaşıp bir kamuoyu oluşturmak.',
        'Müdahale Etmeme: "Her yiğidin bir yoğurt yiyişi vardır" deyip kendi işine bakmak.'
      ]
    },
    {
      id: 'confidentiality_issue',
      text: 'Gizlilik: Bir öğrencinin yakın bir akrabası (örn: teyzesi), ailenin haberi olmadan sizi arayıp çocuğun gelişimi ve tanısı hakkında bilgi istiyor. Yanıtınız?',
      type: 'radio',
      options: [
        'Etik Sınır: Bilgi paylaşımının sadece yasal velilerle yapılabileceğini kibarca belirtip, ailenin onayı olmadan hiçbir veri aktarmamak.',
        'Kısa Bilgi: "Genel olarak iyi gidiyor" diyerek detay vermeden merakını gidermek.',
        'Tam Şeffaflık: Akraba olduğu için güvenip tüm raporları ve gözlemleri anlatmak.',
        'Geri Arama: Aileyi arayıp "Teyzeniz aradı, anlatayım mı?" diye sormak.'
      ]
    }
  ],
  professional_cases_extra: [
    {
      id: 'dual_relationship',
      text: 'Çift Taraflı İlişki: Bir veliniz, size kendi iş yerinde bir indirim veya özel bir avantaj teklif etti. Bu durumun seans tarafsızlığını bozmaması için ne yaparsınız?',
      type: 'radio',
      options: [
        'Red ve Açıklama: Teklifi profesyonel sınırlar gereği kabul edemeyeceğinizi belirterek, bunun etik bir gereklilik olduğunu veliye izah etmek.',
        'Kabul ve Gizlilik: Teklifi kabul edip seanslarda bu durumu hiç açmamak.',
        'Hediye Olarak Görme: Küçük bir jest olarak görüp teşekkür ederek kabul etmek.',
        'Takas: Siz de ona ek bir seans vererek durumu eşitlemek.'
      ]
    }
  ],
  psychological_integrity: [
    {
      id: 'aggression_response',
      text: 'Ağır düzeyde otizmli bir öğrenciden fiziksel bir saldırı aldınız ve canınız yandı. Seansın kalan 20 dakikasını nasıl yönetirsiniz?',
      type: 'radio',
      options: [
        'Klinik Mesafe: Duygularımı regüle etmek için 2 dakika ara verir, saldırının tetikleyicisini not eder ve güvenli bir mesafeden hedeflere devam ederim.',
        'Dayanıklılık: Hiçbir şey olmamış gibi devam ederim, zayıflık gösterirsem öğrenci bunu pekiştirebilir.',
        'Cezalandırma: Seansı hemen bitirir ve "Bunu yaptığın için ders bitti" diyerek odadan çıkarım.',
        'Duygusal Tepki: Ağladığımı gösteririm ki arkadaşının canının yandığını (Empati) fark etsin.'
      ]
    },
    {
      id: 'failure_burnout',
      text: 'Tükenmişlik: 1 yıldır çalıştığınız bir öğrenci hiçbir hedefi geçemedi ve her seansta aynı döngüyü yaşıyorsunuz. Motivasyonunuzu nasıl korursunuz?',
      type: 'radio',
      options: [
        'Süpervizyon Almak: Kendi yetersizlik hissimi ve vaka analizini bir üst uzmanla/psikologla paylaşıp müdahale planını radikal bir şekilde revize etmek.',
        'Kabullenme: "Bu çocuğun kapasitesi bu kadar" diyerek beklentilerimi en dibe çekmek.',
        'Vaka Değişimi: Kurumdan bu öğrenciyi bırakıp daha "kolay" bir öğrenci vermelerini istemek.',
        'Suçlama: Sorunun ailede veya çocukta olduğunu düşünerek vicdanımı rahatlatmak.'
      ]
    },
    {
      id: 'work_life_boundary',
      text: 'İş-Özel Hayat Dengi: Bir veli, gece saat 23:00\'te size WhatsApp üzerinden uzun bir ses kaydı atarak çocuğunun o anki bir davranış problemine müdahale etmenizi istiyor. Tepkiniz?',
      type: 'radio',
      options: [
        'Sınır Belirleme: Mesajı o an görmezden gelip, sabah mesai saatinde "Acil durumlar için şu protokolü izleyelim, akşam 19:00 sonrası iletişim kuramıyorum" diyerek sınır çizmek.',
        'Anında Yanıt: Veli mağdur olmasın diye hemen cevap verip yarım saat telefonda destek olmak.',
        'Kısa Cevap: "Yarın konuşuruz" diyip geçiştirmek.',
        'Görüldü Atma: Mesajı okuyup hiç cevap vermemek ve mülakatta bu durumu şikayet etmek.'
      ]
    }
  ],
  development: [
    {
      id: 'failure_analysis_multi',
      text: 'Öğrenci 6 aydır "Renkleri Ayırt Etme" hedefini geçemedi. Müdahale metodolojinizdeki revizyon önceliğiniz nedir?',
      type: 'radio',
      options: [
        'Veri Temelli Değişiklik: Sunum şeklini (Görselden-Görsele eşleme), pekiştireç tarifesini veya ipucu hiyerarşisini (Most-to-Least) analiz edip değiştiririm.',
        'Kapasite Kabulü: Öğrencinin bilişsel kapasitesinin bu hedef için henüz erken olduğunu varsayıp hedefi askıya alırım.',
        'Materyal Değişimi: Kullandığım kartların rengini veya boyutunu değiştirip tekrar denerim.',
        'Ev Programı: Sorunun evdeki genelleyici eksikliğinden kaynaklandığını düşünür, aileye ödev veririm.'
      ]
    },
    {
      id: 'supervision_feedback',
      text: 'Geri Bildirim: Akademik kurul, bir seansınızı izledi ve uyguladığınız yöntemin (örn: pekiştirme zamanlaması) hatalı olduğuna dair sert bir eleştiri yaptı. Reaksiyonunuz?',
      type: 'radio',
      options: [
        'Gelişim Odaklılık: Eleştiriyi verilerle analiz eder, hatamı kabul edip kurulun önerdiği protokolü bir sonraki seansta uygulamak için rehberlik isterim.',
        'Savunma: Eleştirinin haksız olduğunu, öğrenciyi en iyi sizin tanıdığınızı ve yöntemin doğru olduğunu iddia etmek.',
        'Pasif Agresif: "Tamam" diyip yine bildiğini okumak.',
        'Duygusal Kırılma: Eleştiriyi kişisel bir saldırı olarak görüp meslekten soğumak.'
      ]
    },
    {
      id: 'lifelong_learning_ai',
      text: 'Teknoloji: Özel eğitimde Yapay Zeka (AI) destekli analiz araçlarının kullanımı hakkında ne düşünüyorsunuz?',
      type: 'radio',
      options: [
        'Entegrasyon: İnsan dokunuşunu ve klinik sağduyuyu koruyarak, verilerin objektif analizi ve hata payının düşürülmesi için bu araçları bir "asistan" olarak kullanmaya hazırım.',
        'Reddetme: Yapay zeka bu çocukların ruhundan anlamaz, tamamen mekanik bir süreçtir, karşıyım.',
        'Korku: Yakında öğretmenlerin yerini alacağını düşünüp bu teknolojilerden uzak durmayı tercih ederim.',
        'Kaygısızlık: Benim için fark etmez, kurum ne derse onu yaparım.'
      ]
    }
  ]
};
