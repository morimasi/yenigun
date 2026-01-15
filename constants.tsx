
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
    // --- MATEMATİK (CLINICAL LEVEL) ---
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

    // --- TÜRKÇE / OKUMA-YAZMA (CLINICAL LEVEL) ---
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

    // --- DİL VE İLETİŞİM (CLINICAL LEVEL) ---
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

    // --- SOSYAL / HAYAT BİLGİSİ (CLINICAL LEVEL) ---
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
    }
  ]
};
