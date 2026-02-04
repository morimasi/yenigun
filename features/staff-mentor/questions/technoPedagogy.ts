import { AssessmentQuestion } from '../../../types';

export const technoPedagogyQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_tech_v2_1',
    text: 'Bir vaka için tablet tabanlı bir eğitim uygulaması (örn: Otsimo, Tolkido) kullanmaya karar verildi. Entegrasyon stratejiniz nedir?',
    options: [
      { 
        label: 'Hibrit Model: Uygulamayı vakanın zayıf yönlerini "destekleyen" bir asistan gibi kullanırım; teknolojiyi pedagojimin merkezine değil, insan etkileşiminin yanına koyarım.', 
        clinicalValue: 100, 
        aiTag: 'balanced_tech_integration' 
      },
      { 
        label: 'Ödül Odaklı: Tableti eğitimden ziyade, zorlu görevlerin ardından çocuğa sunulan "yüksek değerli bir pekiştireç" (R+) olarak kullanmayı tercih ederim.', 
        clinicalValue: 75, 
        aiTag: 'pragmatic_tech_use' 
      },
      { 
        label: 'Şüpheci Yaklaşım: Teknolojinin dopamin etkisinden çekinirim; klasik kartların ve fiziksel temasın yerini tutamayacağını düşünür, kullanımı minimumda tutarım.', 
        clinicalValue: 60, 
        aiTag: 'conservative_humanist' 
      },
      { 
        label: 'Pasif Kullanım: Çocuk tabletle meşgulken ben de veri girişlerini tamamlarım; teknoloji çocuğun dikkatini tutarken bana nefes alma alanı açar.', 
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
        label: 'Veri Odaklılık: Algoritmanın uyarısını ciddiye alırım. İnsan gözünün kaçırdığı mikro-desenleri yapay zekanın yakalayabileceğini kabul eder, planımı revize ederim.', 
        clinicalValue: 100, 
        aiTag: 'data_driven_agile' 
      },
      { 
        label: 'Sezgisel Güven: Kendi klinik gözlemime daha çok güvenirim; bir yazılımın vakanın o günkü ruh halini veya fiziksel durumunu anlamayacağını düşünerek planımı değiştirmem.', 
        clinicalValue: 70, 
        aiTag: 'intuition_over_algorithm' 
      },
      { 
        label: 'Çift Kontrol: Hem kendi verilerimi hem de AI raporunu süpervizörümle paylaşır, kararı üçüncü bir gözün hakemliğine bırakırım.', 
        clinicalValue: 85, 
        aiTag: 'cautious_collaborator' 
      },
      { 
        label: 'Reddediş: Teknolojik ölçümlerin özel eğitimdeki insani nüansları ölçemeyeceğini savunur, sistemi hatalı varsayarak görmezden gelirim.', 
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
        label: 'Sistemik Liderlik: Cihazı sadece çocuğa değil, aileye ve tüm personele öğreterek 24 saatlik yaşam döngüsüne entegre ederim.', 
        clinicalValue: 100, 
        aiTag: 'systemic_tech_leader' 
      },
      { 
        label: 'Korumacı Yaklaşım: Cihazı sadece kendi seanslarımda kontrollü kullandırırım; vakanın cihazı bozmasından veya cihaza bağımlı olmasından çekinirim.', 
        clinicalValue: 60, 
        aiTag: 'protective_barrier' 
      },
      { 
        label: 'Pragmatik Deneme: Cihazı deneme sürecine alırım ancak çocuk direnç gösterirse hemen eski yöntemlere (resimli kartlar vb.) dönerim.', 
        clinicalValue: 75, 
        aiTag: 'quick_pivot' 
      },
      { 
        label: 'Teknoloji Karşıtlığı: Çocuğun "kendi sesini" bulması gerektiğini, cihazın tembellik yaratacağını savunarak doğal konuşma terapisinde ısrar ederim.', 
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
        label: 'Dijital Yerli: Tablet; verilerin anlık analizi, grafiklere dökülmesi ve geçmişe dönük kıyas yapılması kurumsal hafıza için şarttır.', 
        clinicalValue: 100, 
        aiTag: 'digital_native_archivist' 
      },
      { 
        label: 'Analog Romantik: Kağıt; o anki gözlemlerimi oklar çıkararak ve karalayarak not almanın, klinik hislerimi kağıda dökmenin daha gerçekçi olduğuna inanırım.', 
        clinicalValue: 70, 
        aiTag: 'analog_romantic' 
      },
      { 
        label: 'Hibrit Güvenlik: Önce kağıda not alırım, gün sonunda sisteme girerim. Teknolojiye güvenmem, verinin kaybolma riskine karşı çift iş yapmayı göze alırım.', 
        clinicalValue: 80, 
        aiTag: 'anxious_perfectionist' 
      },
      { 
        label: 'Minimalist: Veri tutmak yerine çocuğa odaklanmayı tercih ederim. Haftalık kısa özetler yazarım, anlık veri girişinin akışı bozduğunu düşünürüm.', 
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
        label: 'Erken Benimseyen: Heyecan verici; market, okul gibi sosyal ortamları güvenli bir simülasyonda denemek, vaka için gerçek hayata geçişte büyük bir sıçrama tahtası olabilir.', 
        clinicalValue: 100, 
        aiTag: 'innovation_early_adopter' 
      },
      { 
        label: 'Duyusal Muhafazakar: Riskli; duyusal hassasiyetleri tetikleyebilir ve çocuğu gerçek dünyadan koparabilir. Yüz yüze etkileşimin yerini sanal dünya almamalı.', 
        clinicalValue: 60, 
        aiTag: 'sensory_conservative' 
      },
      { 
        label: 'Pazarlama Odaklı: Kurumun reklamı için iyi olacağını düşünürüm, velilerin hoşuna gider ama klinik faydasından çok emin değilim.', 
        clinicalValue: 50, 
        aiTag: 'marketing_oriented' 
      },
      { 
        label: 'Seçici Kullanım: Sadece yüksek işlevli ve duyusal sorunu olmayan çocuklarda, kısıtlı süreyle denenmesi taraftarıyım.', 
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
        label: 'Koçluk Modeli: Veliyi bir "ko-terapist" gibi eğitir, ekran karşısında benim komutlarımla fiziksel uygulamayı evde ebeveynin yapmasını sağlayarak aileyi yetkinleştiririm.', 
        clinicalValue: 100, 
        aiTag: 'remote_coaching_expert' 
      },
      { 
        label: 'Bakıcı Modeli: Sadece çocuğun ekran karşısında oturmasını sağlar, dikkatini çekmek için dijital oyunlar ve animasyonlar kullanarak dersi "oyalamaca" ile geçiştiririm.', 
        clinicalValue: 40, 
        aiTag: 'passive_screen_user' 
      },
      { 
        label: 'Teorik Model: Çocuğa uygulama yaptırmak yerine, veliye o hafta yapması gerekenleri anlatan teorik bir seminer veririm.', 
        clinicalValue: 70, 
        aiTag: 'theoretical_instructor' 
      },
      { 
        label: 'Reddediş: Özel eğitimin uzaktan olamayacağını savunur, süreç bitene kadar eğitimi dondurmayı teklif ederim.', 
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
        label: 'Yatırımcı Zihniyet: Evet; kendi entelektüel sermayem kurumdan bağımsızdır. En güncel bilgiye erişmek için kişisel yatırım yapmaktan çekinmem.', 
        clinicalValue: 100, 
        aiTag: 'self_investor_growth' 
      },
      { 
        label: 'Kurumsal Bağımlılık: Hayır; bu bir iş gerekliliğiyse kurum personeline bu imkanları sağlamalıdır. Cebimden mesleki yatırım yapmayı profesyonel bulmam.', 
        clinicalValue: 60, 
        aiTag: 'corporate_dependency' 
      },
      { 
        label: 'Fırsatçı: Üye olan bir arkadaşımdan şifresini isterim veya ortak kullanmayı teklif ederim. Bilgiye ulaşmak isterim ama bedel ödemek istemem.', 
        clinicalValue: 50, 
        aiTag: 'opportunistic_access' 
      },
      { 
        label: 'İlgisiz: Mevcut bilgilerimin yeterli olduğunu düşünürüm, yeni portallara ihtiyacım yok.', 
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
        label: 'Oyunlaştırma Stratejisti: Evet; oyun içindeki mekanikleri matematik, planlama veya iletişim hedefleri için bir "laboratuvar" gibi kullanır, ilgiyi akademik yakıta çeviririm.', 
        clinicalValue: 100, 
        aiTag: 'gamification_strategist' 
      },
      { 
        label: 'Katı Sınırlar: Hayır; oyunları sadece ders sonu ödülü olarak saklarım. Eğitim ciddiyeti ile eğlenceyi karıştırmam, sınırların net kalmasını tercih ederim.', 
        clinicalValue: 65, 
        aiTag: 'strict_compartmentalization' 
      },
      { 
        label: 'Rüşvet Odaklı: Çocuk derse katılsın diye oyun oynamasına izin veririm, akademik hedef gütmem, sadece uyumlu durmasını sağlarım.', 
        clinicalValue: 40, 
        aiTag: 'compliance_bribe' 
      },
      { 
        label: 'Yasakçı: Kurum içinde video oyunlarının tamamen yasaklanması gerektiğini düşünürüm, bu takıntıları beslememek gerekir.', 
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
        label: 'Bilişsel Mimar: Harika bir planlama becerisi kazandırır; vakanın bilişsel esnekliğini ve problem çözme yeteneğini artırmak için (ekransız kodlama dahil) müfredata alırım.', 
        clinicalValue: 100, 
        aiTag: 'cognitive_architect' 
      },
      { 
        label: 'Pragmatik Gelenekçi: Gereksiz; temel okuma-yazma ve özbakım becerileri bile tam değilken vakanın vaktini bu tarz popüler ama karmaşık işlerle harcamamalıyız.', 
        clinicalValue: 60, 
        aiTag: 'pragmatic_traditionalist' 
      },
      { 
        label: 'Görsel Vitrin: Velilere "kodlama öğretiyoruz" diyebilmek için basit tablet uygulamaları açarım ama derinlemesine bir mantık eğitimi vermem.', 
        clinicalValue: 45, 
        aiTag: 'showcase_oriented' 
      },
      { 
        label: 'Yetersizlik Hissi: Bu konuda bilgim yok ve öğrenmek de zor geliyor, o yüzden klasik yöntemlerle devam etmeyi tercih ederim.', 
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
        label: 'Verimlilik Uzmanı: Büyük bir zaman kazancı olarak görürüm; angarya işleri AI\'ya devredip, kalan vakti vaka analizine ve yeni materyal tasarlamaya ayırırım.', 
        clinicalValue: 100, 
        aiTag: 'efficiency_maximizer' 
      },
      { 
        label: 'Şüpheci Pürist: Raporun "insani ruhunu" ve klinik nüansları öldürdüğünü düşünür, sisteme uysam da gizlice kendi manuel notlarımı tutmaya devam ederim.', 
        clinicalValue: 80, 
        aiTag: 'skeptical_purist' 
      },
      { 
        label: 'Tembellik Fırsatı: Harika olur, artık rapor yazmakla uğraşmam. AI ne verirse kopyalar yapıştırırım, içeriği çok da kontrol etmem.', 
        clinicalValue: 20, 
        aiTag: 'lazy_adopter' 
      },
      { 
        label: 'Gizlilik Endişesi: Vaka verilerinin yapay zeka ile paylaşılmasını etik bulmam, bu sisteme direnç gösteririm.', 
        clinicalValue: 60, 
        aiTag: 'privacy_advocate' 
      }
    ]
  }
];
