
import { FormStep } from './types';

export const FORM_STEPS: FormStep[] = [
  { 
    id: 'personal', 
    title: 'Akademik Kimlik', 
    description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz. Lütfen sadece klinik deneyimlerinize odaklanın.' 
  },
  { 
    id: 'academic_proficiency', 
    title: 'İlkokul Akademik Yetkinlik', 
    description: '1-4. Sınıf seviyesindeki temel müfredat bilgisi ve bu bilginin özel eğitimde aktarım stratejileri.' 
  },
  { id: 'logic_literacy', title: 'Operasyonel Zeka', description: 'Karmaşık kriz anlarında mantıksal önceliklendirme kapasitesi.' },
  { id: 'professional_cases', title: 'Etik İkilemler', description: 'Profesyonel ahlak ile kurumsal gerçeklik arasındaki denge.' },
  { id: 'psychological_integrity', title: 'Psikolojik Sınırlar', description: 'Tükenmişlik ve duygusal düzenleme analizi.' },
  { id: 'development', title: 'Özeleştiri & Vizyon', description: 'Mesleki hataların analizi ve gelişim dürüstlüğü.' }
];

export const CERTIFICATION_LIST = [
  // --- OTİZM VE DAVRANIŞSAL MÜDAHALE ---
  "ABA (Uygulamalı Davranış Analizi) - Uygulayıcı Sertifikası",
  "PECS (Resim Değiş Tokuşuna Dayalı İletişim Sistemi)",
  "ETEÇOM (Etkileşim Temelli Erken Çocuklukta Müdahale Programı)",
  "OÇİDE (Otizmli Çocuklar İçin Davranışsal Eğitim)",
  "PCDI (Otizm Müdahale Modeli) Eğitimi",
  "GOBDO-2-TV (Otistik Bozukluk Derecelendirme Ölçeği)",
  "TÖSİ (Türkçe Öğrenci Sosyal İletişim Ölçeği)",
  "GİS (Gelişimsel İzleme ve Destekleme Rehberi)",
  
  // --- ÖĞRENME GÜÇLÜĞÜ (DİSLEKSİ / DİSKALKULİ) ---
  "PREP (Disleksi Bilişsel Müdahale Programı)",
  "COGENT (Bilişsel Gelişim Programı)",
  "DMP (Disleksi Müdahale Programı)",
  "ODEM (Okuma Yazma Değerlendirme ve Müdahale)",
  "PASS Teorisi ve Bilişsel Müdahale Stratejileri",
  "DİSKALKULİ (Matematik Öğrenme Güçlüğü) Müdahale Programı",
  "TİLLS (Test of Integrated Language and Literacy Skills)",
  "Okuma Yazma Öğretimi Stratejileri Sertifikası",
  
  // --- MATEMATİK ÖĞRETİMİ ---
  "Touch Math (Dokunmatik Matematik Öğretim Sistemi)",
  "Özel Eğitimde Somut Materyallerle Matematik Öğretimi",
  "Singapore Maths (Özel Eğitim Adaptasyonu)",
  "Dis-Mat (Diskalkuli Müdahale Seti) Kullanıcı Eğitimi",
  
  // --- GELİŞİMSEL VE PSİKOMETRİK TESTLER ---
  "WISC-V Zeka Testi Uygulayıcı Sertifikası",
  "CAS (Cognitive Assessment System) Uygulayıcı",
  "Denver II Gelişimsel Tarama Testi",
  "MOXO Çeldiricili Dikkat Testi Uygulayıcı",
  "AGTE (Ankara Gelişim Tarama Envanteri)",
  "Stanford-Binet Zeka Testi Uygulayıcı",
  "Frostig Görsel Algı Testi",
  "Metropolitan Okul Olgunluğu Testi",
  
  // --- DİL, KONUŞMA VE DUYUSAL YAKLAŞIMLAR ---
  "DIR Floortime (101 / 201 Seviye Sertifikası)",
  "Duyu Bütünleme (Sensory Integration) Eğitimi",
  "PADAD (Pragmatik Dil Analizi ve Değerlendirmesi)",
  "Artikülasyon ve Fonolojik Bozukluklar Müdahale Eğitimi",
  "Oral Motor Terapi Teknikleri",
  "GOPÖ (Gecikmiş Konuşma Programı)",
  
  // --- TERAPÖTİK VE DİĞER YAKLAŞIMLAR ---
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
    // --- MATEMATİK ---
    {
      id: 'math_app_multiplication',
      text: 'Matematik (2. Sınıf): Çarpma işlemini sadece "ardışık toplama" (2+2+2=6) olarak gören ama 2x3 sembolizasyonuna geçemeyen öğrenciye nasıl bir "köprü" kurarsınız?',
      type: 'radio',
      options: [
        'Sayı doğrusunda ileriye doğru ikişer zıplayarak ritmik sayma yaptırmak.',
        'Nesne gruplarını (örn: her tabakta 2 elma) önce fiziksel, sonra "grup sayısı x gruptaki nesne" şeklinde etiketleyerek somutlaştırmak.',
        'Çarpım tablosunu tekerleme şeklinde ezberleterek dile yerleştirmek.',
        'Sadece işlem kağıtları üzerinden bol tekrar yaptırmak.'
      ]
    },
    {
      id: 'math_app_money',
      text: 'Matematik (3. Sınıf): "100 TL ile markete giden biri 35 TL\'lik ürün alırsa kaç TL kalır?" sorusunda zihinden çıkarma yapamayan öğrenciye hangi "stratejik parça" yöntemini sunarsınız?',
      type: 'radio',
      options: [
        'Alt alta yazıp komşudan onluk bozma kuralını hatırlatmak.',
        'Önce 30 TL çıkarıp 70\'e ulaşmak, sonra 5 TL daha çıkarıp 65 sonucuna "atlamalı" ulaşmak.',
        'Bozuk paraları (10, 5, 1 TL) kullanarak masada fiziksel eksiltme yapmak.',
        'Parmaklarıyla 35 saydırarak geriye doğru tek tek saydırmak.'
      ]
    },
    {
      id: 'math_app_fractions',
      text: 'Matematik (4. Sınıf): Kesirlerde 1/2\'nin 1/4\'ten büyük olduğunu anlamayan ("4 sayısı 2\'den büyüktür" diyen) öğrenciye kavramsal yanılgıyı nasıl giderirsiniz?',
      type: 'radio',
      options: [
        'Payda büyüdükçe parçanın küçüldüğü kuralını defterine 10 kez yazdırmak.',
        'Aynı boyuttaki iki somut bütünün (örn: oyun hamuru) birini 2, diğerini 4 parçaya bölüp parçaları fiziksel üst üste koymak.',
        'Sayı doğrusunda 1/2 ve 1/4 noktalarını işaretleyip sıfıra yakınlığı ölçmek.',
        'Pasta grafiklerini boyatarak görsel farkı izletmek.'
      ]
    },

    // --- TÜRKÇE ---
    {
      id: 'turk_app_phonics',
      text: 'Türkçe (1. Sınıf): "K-A-L-E-M" seslerini ayrı ayrı tanıyan ama birleştirip "KALEM" diyemeyen (blending sorunu) öğrenciye müdahale basamağınız ne olur?',
      type: 'radio',
      options: [
        'Sesi uzatarak söylemek: "KKKAAAAALLLLEEEEMMMM" şeklinde sesleri birbirine akıtarak model olmak.',
        'Hece tablosundan "KA-LE" hecesini 20 kez tekrarlatmak.',
        'Harf kartlarını masaya dizip her harfe dokunarak ses çıkarmasını istemek.',
        'Kelimenin resmini gösterip harfleri bakarak yazmasını sağlamak.'
      ]
    },
    {
      id: 'turk_app_semantics',
      text: 'Türkçe (3. Sınıf): Metindeki "Neden-Sonuç" ilişkisini (örn: "Yağmur yağdığı için ıslandı") kuramayan öğrenciye hangi görsel ipucunu (visual prompt) verirsiniz?',
      type: 'radio',
      options: [
        '"Çünkü" ve "Bu yüzden" kelimelerini farklı renklerle boyatıp bağlaç bulmacası çözdürmek.',
        '"Olay ne?" ve "Sebebi ne?" sorularını içeren bir ok diyagramı (Görsel Akış Şeması) üzerinden çalışmak.',
        'Metni beş kez yüksek sesle okutup nedenini sormak.',
        'Metni özetletip ana fikri bulmasını istemek.'
      ]
    },
    {
      id: 'turk_app_fluency',
      text: 'Türkçe (4. Sınıf): Okuma hızı normal olmasına rağmen okuduğunu anlamayan (hiperleksi eğilimli) öğrenciye seans içinde hangi "aktif izleme" stratejisini uygularsınız?',
      type: 'radio',
      options: [
        'Her cümle sonunda "Burada kim, ne yaptı?" diye durup kısa notlar (SQ3R modifiyeli) aldırmak.',
        'Okuma hızını kasten yavaşlatıp heceletmek.',
        'Metindeki bilinmeyen kelimelerin altını çizdirip sözlük çalışması yapmak.',
        'Okuma bittikten sonra 10 soruluk bir test çözdürmek.'
      ]
    },

    // --- SOSYAL / HAYAT BİLGİSİ ---
    {
      id: 'soc_app_spatial',
      text: 'Hayat Bilgisi (1-2. Sınıf): "Kroki" kavramını (kuş bakışı görünüm) anlayamayan öğrenciye "somutlaştırma merdiveni" basamağınız ne olur?',
      type: 'radio',
      options: [
        'Lego veya oyuncak kutularla masada sınıfın maketini yapıp, yukarıdan fotoğrafını çekerek krokisiyle eşleştirmek.',
        'Kurşun kalemle deftere bir dikdörtgen çizip içine "Sıra, Masa" yazdırmak.',
        'Sınıfın krokisini hazır kağıtta boyatmak.',
        'Okulun bahçesine çıkıp binaları uzaktan izletmek.'
      ]
    },
    {
      id: 'soc_app_rights',
      text: 'Hayat Bilgisi (3. Sınıf): "Sorumluluk" ve "Hak" ayrımını yapamayan ("Odamı toplamak benim hakkım" diyen) öğrenciye davranışçı bir yaklaşımla nasıl farkındalık kazandırırsınız?',
      type: 'radio',
      options: [
        'Hakları (Alınanlar) ve Sorumlulukları (Verilenler) olarak iki sepete kart eşleme oyunu kurgulamak.',
        'Sorumluluklarını yerine getirmediğinde haklarından mahrum bırakma (Token Economy) uygulamak.',
        'Çocuk Hakları Sözleşmesi maddelerini okuyup tartıştırmak.',
        'Anne ve babasının görevlerini listelemesini istemek.'
      ]
    },
    {
      id: 'soc_app_environment',
      text: 'Sosyal Bilgiler (4. Sınıf): "Doğal Afetler" (Deprem/Sel) konusunu kaygı düzeyi yüksek (DEHB/Otizm) bir öğrenciye güvenli bir şekilde nasıl sunarsınız?',
      type: 'radio',
      options: [
        'Korkutucu videolar yerine, sadece "Çök-Kapan-Tutun" gibi fiziksel rutinleri oyunlaştırarak ve sosyal öykü kullanarak.',
        'Deprem anı simülasyon videolarını izleterek ciddiyeti kavramasını sağlamak.',
        'Konuyu hiç işlemeyip sadece test çözdürerek geçiştirmek.',
        'Afet çantasındaki malzemeleri ezberleterek.'
      ]
    },

    // --- DİL VE İLETİŞİM ---
    {
      id: 'lang_app_pragmatics',
      text: 'Dil ve İletişim: Bir öğrenci sosyal ortamda sürekli "Lafı ağzından alıyor" veya "Sırasını beklemeden konuşuyor" ise hangi pragmatik beceri çalışmasını önceliklendirirsiniz?',
      type: 'radio',
      options: [
        '"Sıra bende / Sıra sende" görsel kartlarını kullanarak karşılıklı sohbet oyunları (Turn-taking).',
        'Konuştuğunda ağzını kapatması için fiziksel ipucu vermek.',
        'Sessiz durduğu her dakika için ödül vermek.',
        'Grup derslerinde en sona bırakarak beklemesini öğretmek.'
      ]
    },
    {
      id: 'lang_app_receptive',
      text: 'Dil ve İletişim: Alıcı dili zayıf olan bir öğrenciye "Masadaki kırmızı kalemi al ve çantana koy" yönergesini verirken hangisini yaparsınız?',
      type: 'radio',
      options: [
        'Yönergeyi parçalara bölüp ("Kalemi al" -> Bekle -> "Çantaya koy") her adımda görsel destek sunmak.',
        'Yönergeyi daha yavaş ve tane tane 3 kez tekrarlamak.',
        'Kalemi gösterip "Bunu koy" diyerek tek aşamaya indirmek.',
        'Öğrencinin elinden tutup işlemi fiziksel yardım ile (Full Physical Prompt) yaptırmak.'
      ]
    },
    {
      id: 'lang_app_aac',
      text: 'Dil ve İletişim: Hiç konuşmayan (non-verbal) 5 yaşındaki bir öğrenci için ilk iletişim hedefiniz ne olmalıdır?',
      type: 'radio',
      options: [
        'İsteklerini ifade edebilmesi için "İşaret etme" veya "PECS/Görsel Takas" gibi fonksiyonel bir sistem kurmak.',
        'Zorlayarak "Anne, Su" gibi kelimeleri söyletmeye çalışmak.',
        'Sadece ses taklitleri (Oral Motor) üzerine yoğunlaşmak.',
        'Öğrencinin ne istediğini tahmin ederek her şeyi önüne koymak.'
      ]
    }
  ],
  logic_literacy: [
    { 
      id: 'prioritization_1', 
      text: 'Yoğun bir günde öncelik sıralamanız nasıl olur?', 
      type: 'radio', 
      options: [
        '1) Krizdeki öğrenci, 2) Veli desteği, 3) İdari raporlar.', 
        '1) İdari raporlar, 2) Krizdeki öğrenci, 3) Veli desteği.', 
        '1) Veli desteği, 2) İdari raporlar, 3) Krizdeki öğrenci.', 
        'Hepsini aynı anda hatasüz yönetirim.'
      ] 
    },
    {
      id: 'method_clash',
      text: 'Uyguladığınız teknik çocukta direnç yarattı ama aile kesin istiyor. Yaklaşımınız?',
      type: 'radio',
      options: [
        'Ailenin isteğine uyarım; sonuçta ödemeyi onlar yapıyor.',
        'Tekniği bırakırım ve bildiğim gibi yaparım (Gizli inisiyatif).',
        'Aileye verilerle tekniğin zararlarını anlatır, alternatif bir yol haritası sunarım.',
        'Kurum yönetimine durumu bildirip onların karar vermesini beklerim.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'clinical_error',
      text: 'Seans sırasında çocuğun güvenliğini hafifçe riske atan bir hata yaptınız. Tavrınız?',
      type: 'radio',
      options: [
        'Gelecekte daha dikkatli olurum, bir kerelik hatayı büyütmeye gerek yok.',
        'Sadece kurum müdürüne söylerim, veliyle güvenim bozulmasın.',
        'Derhal hem aileye hem yönetime raporlarım; etik dürüstlük her şeydir.',
        'Çocuğun o günkü huysuzluğunu bahane ederek olayı yumuşatırım.'
      ]
    }
  ],
  psychological_integrity: [
    {
      id: 'aggression_response',
      text: 'Bir öğrenci size fiziksel zarar verdi. O anki ilk iç sesiniz hangisi olur?',
      type: 'radio',
      options: [
        '"Neden daha iyi önlem alamadım?" (Aşırı suçluluk).',
        '"Bu iş için yeterli maaş almıyorum" (Tükenmişlik belirtisi).',
        '"Bu çocukla bağım koptu, bir başkası devralmalı" (Kaçınma).',
        '"Bu davranışın işlevini bulup müdahale planımı güncellemeliyim" (Klinik soğukkanlılık).'
      ]
    }
  ],
  development: [
    {
      id: 'failure_analysis_multi',
      text: 'Öğrenci başarısızlığında kendi metodolojinizi nasıl revize edersiniz?',
      type: 'radio',
      options: [
        'Veri toplama formlarımı (ABC kaydı vb.) analiz edip, öğretim basamaklarını küçülterek yeniden planlarım.',
        'Öğrencinin potansiyelinin bu kadar olduğuna kanaat getirip mevcut seviyeyi korumaya çalışırım.',
        'Kullandığım tekniği tamamen değiştirip popüler başka bir yönteme geçerim.',
        'Ailenin evde çalışmadığını varsayarak sorumluluğu onlara aktarırım.'
      ]
    },
    {
      id: 'scientific_update',
      text: 'Bilimsel gelişmeleri takip etme yönteminiz hangisidir?',
      type: 'radio',
      options: [
        'Hakemli dergilerdeki (JABA, Autism Research vb.) makaleleri düzenli okumak.',
        'Sadece sosyal medyadaki popüler eğitimci videolarını izlemek.',
        'Sadece kurum içi zorunlu eğitimlere katılmak.',
        'Üniversite bilgilerimin yeterli olduğunu düşünüyorum.'
      ]
    }
  ]
};
