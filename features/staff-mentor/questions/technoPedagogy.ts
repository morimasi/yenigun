import { AssessmentQuestion } from '../../../types';

export const technoPedagogyQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_tech_v2_1',
    text: 'Bir vaka için tablet tabanlı bir eğitim uygulaması (örn: Otsimo, Tolkido) kullanmaya karar verildi. Entegrasyon stratejiniz nedir?',
    options: [
      { 
        label: 'Uygulamayı vakanın zayıf yönlerini destekleyen bir asistan gibi kullanırım; teknolojiyi pedagojimin merkezine değil insan etkileşiminin yanına kontrollü bir araç olarak koyarım.', 
        clinicalValue: 100, 
        aiTag: 'balanced_tech_integration' 
      },
      { 
        label: 'Tableti eğitimden ziyade zorlu görevlerin ardından sunulan yüksek değerli bir pekiştireç olarak kullanırım; teknolojiyi akademik bir amaçtan çok bir rüşvet mekanizmasına çevirmeyi seçerim.', 
        clinicalValue: 75, 
        aiTag: 'pragmatic_tech_use' 
      },
      { 
        label: 'Teknolojinin dopamin etkisinden çekinirim; klasik kartların ve fiziksel temasın yerini tutamayacağına inanarak uygulama kullanımını minimumda tutan muhafazakar bir tutum sergilerim.', 
        clinicalValue: 60, 
        aiTag: 'conservative_humanist' 
      },
      { 
        label: 'Çocuk tabletle meşgulken ben de veri girişlerini tamamlarım; teknoloji çocuğun dikkatini tutarken kendime seans içinde nefes alma alanı açan pasif bir öğretim modeli benimserim.', 
        clinicalValue: 40, 
        aiTag: 'passive_reliance' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_2',
    text: 'Yapay zeka tabanlı bir veri takip sistemi (örn: MIA) size vakanızın durakladığını raporladı ancak siz sınıfta ilerleme görüyorsunuz. Kararınız?',
    options: [
      { 
        label: 'Algoritmanın uyarısını ciddiye alırım; insan gözünün kaçırdığı mikro-desenleri yapay zekanın yakalayabileceğini kabul eder ve müdahale planımı veriye dayalı olarak revize ederim.', 
        clinicalValue: 100, 
        aiTag: 'data_driven_agile' 
      },
      { 
        label: 'Kendi klinik gözlemime daha çok güvenirim; bir yazılımın vakanın o günkü ruh halini veya fiziksel durumunu asla anlayamayacağını düşünerek mevcut planımı değiştirmemeyi seçerim.', 
        clinicalValue: 70, 
        aiTag: 'intuition_over_algorithm' 
      },
      { 
        label: 'Hem kendi verilerimi hem de yapay zeka raporunu süpervizörümle paylaşırım; kararı üçüncü bir gözün hakemliğine bırakarak sorumluluğu paylaştıran ve beklemeyi seçen bir yol izlerim.', 
        clinicalValue: 85, 
        aiTag: 'cautious_collaborator' 
      },
      { 
        label: 'Teknolojik ölçümlerin özel eğitimdeki insani nüansları ölçemeyeceğini savunurum; sistemi hatalı varsayarak verileri tamamen görmezden gelen teknoloji karşıtı bir direnç gösteririm.', 
        clinicalValue: 50, 
        aiTag: 'tech_skeptic' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_3',
    text: 'Sözel olmayan bir vaka için yüksek teknolojili bir AAC (Alternatif İletişim) cihazı önerildi. İlk haftanız nasıl geçer?',
    options: [
      { 
        label: 'Cihazı sadece çocuğa değil aileye ve tüm personele öğreterek 24 saatlik yaşam döngüsüne entegre ederim; teknolojiyi vakanın yeni sesi olarak merkeze alan bir liderlik üstlenirim.', 
        clinicalValue: 100, 
        aiTag: 'systemic_tech_leader' 
      },
      { 
        label: 'Cihazı sadece kendi seanslarımda kontrollü kullandırırım; vakanın cihazı bozmasından veya cihaza bağımlı olmasından çekinerek kullanım alanını daraltan bir korumacılık sergilerim.', 
        clinicalValue: 60, 
        aiTag: 'protective_barrier' 
      },
      { 
        label: 'Cihazı deneme sürecine alırım ancak çocuk en küçük direnç gösterirse hemen eski yöntemlere dönerim; yenilik karşısında sabır göstermek yerine hızlıca konfor alanıma kaçma eğilimi gösteririm.', 
        clinicalValue: 75, 
        aiTag: 'quick_pivot' 
      },
      { 
        label: 'Çocuğun kendi sesini bulması gerektiğini ve cihazın tembellik yaratacağını savunurum; teknolojiyi bir engel olarak görüp doğal konuşma terapisinde ısrar eden gelenekçi bir yol izlerim.', 
        clinicalValue: 50, 
        aiTag: 'resistance_to_innovation' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_4',
    text: 'Bir vakanın gelişimini kaydetmek için "Kağıt Form" mu yoksa "Tablet Veri Girişi" mi tercih edersiniz?',
    options: [
      { 
        label: 'Tablet; verilerin anlık analizi ve grafiklere dökülerek geçmişe dönük kıyas yapılması kurumsal hafıza için şarttır; dijital arşivleme becerimi klinik bir zorunluluk olarak görürüm.', 
        clinicalValue: 100, 
        aiTag: 'digital_native_archivist' 
      },
      { 
        label: 'Kağıt; o anki gözlemlerimi oklar çıkararak ve karalayarak not almanın klinik hislerimi kağıda dökmenin daha gerçekçi ve samimi olduğuna inanarak dijitalleşmeyi reddederim.', 
        clinicalValue: 70, 
        aiTag: 'analog_romantic' 
      },
      { 
        label: 'Önce kağıda not alır ve gün sonunda sisteme girerim; teknolojiye tam güvenmem ve verinin kaybolma riskine karşı çift iş yükünü göze alan obsesif bir veri güvenliği modeli uygularım.', 
        clinicalValue: 80, 
        aiTag: 'anxious_perfectionist' 
      },
      { 
        label: 'Veri tutmak yerine çocuğa odaklanmayı tercih ederim; haftalık kısa özetler yazarım ve anlık veri girişinin seans akışını mekanikleştirerek bozduğunu iddia eden bir ihmalkarlık yaparım.', 
        clinicalValue: 50, 
        aiTag: 'data_negligence' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_5',
    text: 'Otizm seanslarında VR (Sanal Gerçeklik) gözlüğü kullanımı ile sosyal beceri çalışılması hakkında ne düşünürsünüz?',
    options: [
      { 
        label: 'Heyecan verici bir gelişme; market veya okul gibi sosyal ortamları güvenli bir simülasyonda denemek vaka için gerçek hayata geçişte büyük bir sıçrama tahtası olabilir diye düşünürüm.', 
        clinicalValue: 100, 
        aiTag: 'innovation_early_adopter' 
      },
      { 
        label: 'Çok riskli bulurum; duyusal hassasiyetleri tetikleyebilir ve çocuğu gerçek dünyadan koparabilir diye korkarak yüz yüze etkileşimin yerini hiçbir sanal dünyanın almaması gerektiğini savunurum.', 
        clinicalValue: 60, 
        aiTag: 'sensory_conservative' 
      },
      { 
        label: 'Kurumun reklamı için iyi olacağını düşünürüm; velilerin hoşuna gider ama klinik faydasından emin olmayarak teknolojiyi sadece bir pazarlama aracı olarak kullanmaya sıcak bakarım.', 
        clinicalValue: 50, 
        aiTag: 'marketing_oriented' 
      },
      { 
        label: 'Sadece çok yüksek işlevli vakalarda denenmesi taraftarıyım; teknolojiyi sadece sorunsuz çocuklarda kullanıp asıl ihtiyacı olan zor vakalardan bu imkanı esirgeyen seçici bir yol izlerim.', 
        clinicalValue: 85, 
        aiTag: 'selective_pragmatist' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_6',
    text: 'Zorunlu bir uzaktan eğitim (Tele-rehabilitasyon) sürecinde veliye nasıl rehberlik edersiniz?',
    options: [
      { 
        label: 'Veliyi bir ko-terapist gibi eğitirim; ekran karşısında benim komutlarımla uygulamayı evde ebeveynin yapmasını sağlayarak aileyi yetkinleştiren bütüncül bir model inşa ederim.', 
        clinicalValue: 100, 
        aiTag: 'remote_coaching_expert' 
      },
      { 
        label: 'Sadece çocuğun ekran karşısında oturmasını sağlarım; dikkatini çekmek için dijital oyunlar ve animasyonlar kullanarak dersi akademik verimden uzak bir oyalamaca ile geçiştiririm.', 
        clinicalValue: 40, 
        aiTag: 'passive_screen_user' 
      },
      { 
        label: 'Çocuğa uygulama yaptırmak yerine veliye teorik seminerler veririm; pratik eğitimi tamamen durdurarak ebeveynin sadece bilgi düzeyini artıran ama beceri kazandırmayan bir yol izlerim.', 
        clinicalValue: 70, 
        aiTag: 'theoretical_instructor' 
      },
      { 
        label: 'Özel eğitimin uzaktan olamayacağını savunurum; süreç bitene kadar eğitimi tamamen dondurmayı teklif ederek teknolojik alternatifleri denemeyi reddeden katı bir gelenekçilik sergilerim.', 
        clinicalValue: 50, 
        aiTag: 'rigid_traditionalist' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_7',
    text: 'Uluslararası bir bilimsel eğitim portalı açıldı ve üyeliği ücretli. Kurumun karşılamasını beklemeden üye olur musunuz?',
    options: [
      { 
        label: 'Kesinlikle evet; kendi entelektüel sermayem kurumdan bağımsızdır ve en güncel bilgiye erişmek için kişisel yatırım yapmaktan asla çekinmeyen gelişim odaklı bir profil çizerim.', 
        clinicalValue: 100, 
        aiTag: 'self_investor_growth' 
      },
      { 
        label: 'Hayır; bu bir iş gerekliliğiyse kurumun personeline bu imkanları sağlaması gerektiğini savunurum; cebimden mesleki yatırım yapmayı profesyonel bulmayan kurumsal bir bağımlılık sergilerim.', 
        clinicalValue: 60, 
        aiTag: 'corporate_dependency' 
      },
      { 
        label: 'Üye olan bir arkadaşımdan şifresini isterim; bilgiye ulaşmak isterim ama bedel ödemek istemeyen etik açıdan sorunlu ve fırsatçı bir yaklaşım sergileyerek kurumsal hakları çiğnerim.', 
        clinicalValue: 50, 
        aiTag: 'opportunistic_access' 
      },
      { 
        label: 'Mevcut bilgilerimin yeterli olduğunu düşünürüm; yeni portallara ihtiyacım olmadığını varsayarak bilimsel literatürün değişimine gözlerimi kapatan statik bir zihniyet içinde kalırım.', 
        clinicalValue: 30, 
        aiTag: 'stagnant_mindset' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_8',
    text: 'Çocuğun takıntılı olduğu bir video oyununu (örn: Minecraft) dersin içine entegre eder misiniz?',
    options: [
      { 
        label: 'Evet; oyun içindeki mekanikleri matematik veya iletişim hedefleri için bir laboratuvar gibi kullanırım; ilgiyi akademik yakıta çeviren ileri düzey bir oyunlaştırma stratejisi kurarım.', 
        clinicalValue: 100, 
        aiTag: 'gamification_strategist' 
      },
      { 
        label: 'Hayır; oyunları sadece ders sonu ödülü olarak saklarım; eğitim ciddiyeti ile eğlenceyi birbirine karıştırmayan ve sınırların net kalmasını tercih eden geleneksel bir bölümlendirme yaparım.', 
        clinicalValue: 65, 
        aiTag: 'strict_compartmentalization' 
      },
      { 
        label: 'Çocuk derse katılsın diye oyun oynamasına izin veririm; akademik hedef gütmeden sadece vakanın uyumlu durmasını sağlamak için pekiştireci rüşvet gibi kullanan bir taviz verme yoluna giderim.', 
        clinicalValue: 40, 
        aiTag: 'compliance_bribe' 
      },
      { 
        label: 'Kurum içinde video oyunlarının tamamen yasaklanmasını savunurum; vakanın takıntılarını beslemekten korkan ve teknolojiyi tamamen dışlayan korumacı ama engelleyici bir tutum sergilerim.', 
        clinicalValue: 50, 
        aiTag: 'prohibitive_educator' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_9',
    text: 'Eğitimde "Algoritmik Düşünme" ve "Kodlama" mantığının özel gereksinimli çocuklara öğretilmesi hakkında fikriniz?',
    options: [
      { 
        label: 'Harika bir planlama becerisi kazandırır; vakanın bilişsel esnekliğini ve problem çözme yeteneğini artırmak için ekransız kodlama araçlarını müfredata alan vizyoner bir yaklaşım izlerim.', 
        clinicalValue: 100, 
        aiTag: 'cognitive_architect' 
      },
      { 
        label: 'Gereksiz bulurum; temel okuma-yazma ve özbakım becerileri bile tam değilken vakanın vaktini bu tarz karmaşık işlerle harcamamayı savunan faydacı ve geleneksel bir yol izlerim.', 
        clinicalValue: 60, 
        aiTag: 'pragmatic_traditionalist' 
      },
      { 
        label: 'Velilere "kodlama öğretiyoruz" diyebilmek için basit tablet uygulamaları açarım; derinlemesine bir mantık eğitimi vermeden sadece popüler bir imaj yaratan vitrin odaklı bir yaklaşım sergilerim.', 
        clinicalValue: 45, 
        aiTag: 'showcase_oriented' 
      },
      { 
        label: 'Bu konuda bilgim yok ve öğrenmek de zor geliyor; bu yüzden klasik yöntemlerle devam etmeyi tercih ederek kendi yetkinlik açığımı vaka için bir engel haline getiren bir tutum izlerim.', 
        clinicalValue: 30, 
        aiTag: 'incompetence_avoidance' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_10',
    text: 'Kurum genelinde tüm vaka raporlarının "AI Destekli" (Yapay Zeka ile özetlenerek) yazılmasına karar verildi. Tepkiniz?',
    options: [
      { 
        label: 'Büyük bir zaman kazancı olarak görürüm; angarya işleri yapay zekaya devredip kalan vaktimi vaka analizine ve yeni materyallere ayıran bir verimlilik maksimizasyonu modeli benimserim.', 
        clinicalValue: 100, 
        aiTag: 'efficiency_maximizer' 
      },
      { 
        label: 'Raporun insani ruhunu öldürdüğünü düşünürüm; sisteme uysam da gizlice kendi manuel notlarımı tutmaya devam eden ve teknolojik dönüşüme içten içe direnen bir gelenekçilik sergilerim.', 
        clinicalValue: 80, 
        aiTag: 'skeptical_purist' 
      },
      { 
        label: 'Harika olur artık rapor yazmakla uğraşmam; yapay zekanın ürettiği metinleri hiç kontrol etmeden kopyalayıp yapıştıran ve profesyonel sorumluluğu tamamen algoritmaya yıkan bir tembellik yaparım.', 
        clinicalValue: 20, 
        aiTag: 'lazy_adopter' 
      },
      { 
        label: 'Vaka verilerinin yapay zeka ile paylaşılmasını etik bulmam; bu sisteme karşı çıkarak kurumun dijitalleşme politikalarına engel olan ve gizlilik hassasiyetini aşırıya kaçıran bir direnç gösteririm.', 
        clinicalValue: 60, 
        aiTag: 'privacy_advocate' 
      }
    ]
  }
];
