import { AssessmentQuestion } from '../../../types';

export const technoPedagogyQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_tech_v2_1',
    text: 'Bir vaka için tablet tabanlı bir eğitim uygulaması (örn: Otsimo, Tolkido) kullanmaya karar verildi. Entegrasyon stratejiniz nedir?',
    options: [
      { 
        label: 'Uygulamayı vakanın zayıf yönlerini "destekleyen" bir asistan gibi kullanırım; ancak teknolojiyi pedagojimin merkezine değil, her zaman insan etkileşiminin yanına koyarım.', 
        clinicalValue: 100, 
        aiTag: 'balanced_tech_integration' 
      },
      { 
        label: 'Teknolojinin çocuk üzerindeki dopamin etkisinden çekinirim; klasik kartların ve fiziksel temasın yerini asla tutamayacağını düşünür, tableti sadece çok kısıtlı bir "ödül" olarak kullanırım.', 
        clinicalValue: 80, 
        aiTag: 'conservative_humanist' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_2',
    text: 'Yapay zeka tabanlı bir veri takip sistemi (örn: MIA) size vakanızın durakladığını raporladı ancak siz sınıfta ilerleme görüyorsunuz. Kararınız?',
    options: [
      { 
        label: 'Algoritmanın uyarısını ciddiye alırım. İnsan gözünün kaçırdığı mikro-desenleri yapay zekanın yakalayabileceğini kabul eder, müdahale planımı veriye dayalı revize ederim.', 
        clinicalValue: 100, 
        aiTag: 'data_driven_agile' 
      },
      { 
        label: 'Kendi klinik gözlemime ve sezgilerime daha çok güvenirim; bir yazılımın vakanın o günkü ruh halini veya fiziksel durumunu anlamayacağını düşünerek planımı değiştirmem.', 
        clinicalValue: 70, 
        aiTag: 'intuition_over_algorithm' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_3',
    text: 'Sözel olmayan bir vaka için yüksek teknolojili bir AAC (Alternatif İletişim) cihazı önerildi. İlk haftanız nasıl geçer?',
    options: [
      { 
        label: 'Cihazın tüm teknik detaylarını öğrenir, aileye ve tüm personele eğitim vererek sistemi sadece sınıfta değil, çocuğun 24 saatlik yaşam döngüsüne entegre ederim.', 
        clinicalValue: 100, 
        aiTag: 'systemic_tech_leader' 
      },
      { 
        label: 'Cihazı sadece kendi seanslarımda kontrollü kullandırırım; vakanın cihazı bozmasından veya cihaza bağımlı olup insan sesinden kopmasından çekinerek süreci yavaşlatırım.', 
        clinicalValue: 60, 
        aiTag: 'protective_barrier' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_4',
    text: 'Bir vakanın gelişimini kaydetmek için "Kağıt Form" mu yoksa "Tablet Veri Girişi" mi tercih edersiniz?',
    options: [
      { 
        label: 'Tablet; verilerin anlık analiz edilmesi, grafiklere dökülmesi ve geçmişe dönük kıyas yapılması liyakatim ve kurum hafızası için şarttır.', 
        clinicalValue: 100, 
        aiTag: 'digital_native_archivist' 
      },
      { 
        label: 'Kağıt; o anki gözlemlerimi, oklar çıkararak ve karalayarak not almanın, "klinik hislerimi" kağıda dökmenin daha gerçekçi ve samimi olduğuna inanırım.', 
        clinicalValue: 75, 
        aiTag: 'analog_romantic' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_5',
    text: 'Otizm seanslarında VR (Sanal Gerçeklik) gözlüğü kullanımı ile sosyal beceri çalışılması hakkında ne düşünürsünüz?',
    options: [
      { 
        label: 'Heyecan verici; market, okul gibi sosyal ortamları güvenli bir simülasyonda denemek, vaka için gerçek hayata geçişte büyük bir sıçrama tahtası olabilir.', 
        clinicalValue: 100, 
        aiTag: 'innovation_early_adopter' 
      },
      { 
        label: 'Riskli; duyusal hassasiyetleri tetikleyebilir ve çocuğu gerçek dünyadan daha çok koparabilir. Yüz yüze etkileşimin yerini sanal bir dünyanın almasına karşı çıkarım.', 
        clinicalValue: 65, 
        aiTag: 'sensory_conservative' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_6',
    text: 'Zorunlu bir uzaktan eğitim (Tele-rehabilitasyon) sürecinde veliye nasıl rehberlik edersiniz?',
    options: [
      { 
        label: 'Veliyi bir "ko-terapist" gibi eğitir, ekran karşısında benim komutlarımla fiziksel uygulamayı evde ebeveynin yapmasını sağlayarak aileyi yetkinleştiririm.', 
        clinicalValue: 100, 
        aiTag: 'remote_coaching_expert' 
      },
      { 
        label: 'Sadece çocuğun ekran karşısında oturmasını sağlar, dikkatini çekmek için dijital oyunlar ve animasyonlar kullanarak dersi "oyalamaca" ile geçiştiririm.', 
        clinicalValue: 40, 
        aiTag: 'passive_screen_user' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_7',
    text: 'Uluslararası bir bilimsel eğitim portalı açıldı ve üyeliği ücretli. Kurumun karşılamasını beklemeden üye olur musunuz?',
    options: [
      { 
        label: 'Evet; kendi entelektüel sermayem ve gelişimim kurumun bütçesinden bağımsızdır. En güncel bilgiye erişmek için kişisel yatırım yapmaktan çekinmem.', 
        clinicalValue: 100, 
        aiTag: 'self_investor_growth' 
      },
      { 
        label: 'Hayır; bu bir iş gerekliliğiyse kurum personeline bu imkanları sağlamalıdır. Cebimden mesleki yatırım yapmayı profesyonel bulmam.', 
        clinicalValue: 60, 
        aiTag: 'corporate_dependency' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_8',
    text: 'Çocuğun takıntılı olduğu bir video oyununu (örn: Minecraft) dersin içine entegre eder misiniz?',
    options: [
      { 
        label: 'Evet; oyun içindeki mekanikleri matematik, planlama veya iletişim hedefleri için bir "laboratuvar" gibi kullanır, çocuğun ilgisini akademik yakıta çeviririm.', 
        clinicalValue: 100, 
        aiTag: 'gamification_strategist' 
      },
      { 
        label: 'Hayır; oyunları sadece ders sonu ödülü olarak saklarım. Eğitim ciddiyeti ile eğlenceyi karıştırmam, sınırların net kalmasını tercih ederim.', 
        clinicalValue: 70, 
        aiTag: 'strict_compartmentalization' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_9',
    text: 'Eğitimde "Algoritmik Düşünme" ve "Kodlama" mantığının özel gereksinimli çocuklara öğretilmesi hakkında fikriniz?',
    options: [
      { 
        label: 'Harika bir planlama becerisi kazandırır; vakanın bilişsel esnekliğini ve problem çözme yeteneğini artırmak için (ekransız kodlama dahil) müfredata alırım.', 
        clinicalValue: 100, 
        aiTag: 'cognitive_architect' 
      },
      { 
        label: 'Gereksiz; temel okuma-yazma ve özbakım becerileri bile tam değilken vakanın vaktini bu tarz popüler ama karmaşık işlerle harcamamalıyız.', 
        clinicalValue: 60, 
        aiTag: 'pragmatic_traditionalist' 
      }
    ]
  },
  {
    id: 'stf_tech_v2_10',
    text: 'Kurum genelinde tüm vaka raporlarının "AI Destekli" (Yapay Zeka ile özetlenerek) yazılmasına karar verildi. Tepkiniz?',
    options: [
      { 
        label: 'Büyük bir zaman kazancı olarak görürüm; angarya işleri AI\'ya devredip, kalan vakti vaka analizine ve yeni materyal tasarlamaya ayırırım.', 
        clinicalValue: 100, 
        aiTag: 'efficiency_maximizer' 
      },
      { 
        label: 'Raporun "insani ruhunu" ve klinik nüansları öldürdüğünü düşünür, sisteme uysam da gizlice kendi manuel notlarımı tutmaya devam ederim.', 
        clinicalValue: 80, 
        aiTag: 'skeptical_purist' 
      }
    ]
  }
];
