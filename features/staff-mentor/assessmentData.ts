
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v17.0)
 * Güncelleme: Matematik ve Türkçe (Akademik Beceriler) modülü uygulayıcı diliyle eklenmiştir.
 */
export const MODULAR_BATTERIES: AssessmentBattery[] = [
  // --- 1. İLERİ ABA VE KLİNİK KARAR MEKANİZMALARI ---
  {
    id: 'aba_advanced_mastery',
    title: 'İleri ABA ve Klinik Karar Mekanizmaları',
    description: 'Veri takibi, kriz anındaki kararlar ve kompleks davranış yönetimi.',
    icon: '📊',
    category: 'clinical',
    questions: [
      {
        id: 'stf_aba_1',
        text: 'Öğrenci seans sırasında çok şiddetli bir ağlama/bağırma nöbeti geçiriyor. Ortam güvenli ancak yönetim sesten rahatsız olup seansı bitirmenizi istiyor. Kararınız?',
        options: [
          { label: 'Eğer bu aşamada pes edersek, çocuğun bu davranışı "istediğimi yaptırabiliyorum" diye öğreneceğini açıklarım. Sabırla devam etmemiz gerektiğini, aksi halde tüm emeklerin boşa gideceğini nazikçe söylerim.', clinicalValue: 100, aiTag: 'clinical_integrity' },
          { label: 'Yönetimin talimatına uyarım ve seansı sonlandırırım. Kurumun genel huzuru ve diğer sınıfların ders işleyebilmesi, tek bir çocuğun o anki eğitim sürecinden daha önceliklidir.', clinicalValue: 30, aiTag: 'hierarchical_compliance' },
          { label: 'Çocuğu susturmak için o an aslında hak etmediği bir ödülü (oyuncak, şeker vb.) vererek sakinleştiririm ve seansı kontrol altında erkenden bitiririm.', clinicalValue: 0, aiTag: 'unintentional_reinforcement' }
        ]
      },
      {
        id: 'stf_aba_2',
        text: 'Grafik analizinde verilerin çok inişli çıkışlı olduğunu gördünüz. Bu durumda ilk olarak neyden şüphelenirsiniz?',
        options: [
          { label: 'Her öğretmenin çocuğu farklı değerlendirdiğini, puanlama kriterlerimizde bir standart olmadığını ve bu yüzden verilerin yanıltıcı olduğunu düşünürüm.', clinicalValue: 100, aiTag: 'ioa_audit_focus' },
          { label: 'Çocuğun o günkü uykusuzluğu, hastalığı veya ruhsal durumu gibi biyolojik nedenlerin veriyi doğrudan bozduğunu varsayarım.', clinicalValue: 50, aiTag: 'biological_attribution' },
          { label: 'Eğitim materyallerinin çocuk için artık sıkıcı hale geldiğini, ödül listemizi acilen yenilememiz gerektiğini düşünürüm.', clinicalValue: 40, aiTag: 'environmental_fix' }
        ]
      }
    ]
  },

  // --- 2. TEMEL AKADEMİK BECERİLER (TÜRKÇE & MATEMATİK) ---
  {
    id: 'academic_skills_mastery',
    title: 'Temel Akademik Beceriler (Türkçe & Matematik)',
    description: 'Okuma-yazma hazırlık, harf-ses farkındalığı ve temel matematiksel muhakeme.',
    icon: '📖',
    category: 'clinical',
    questions: [
      {
        id: 'stf_acad_1',
        text: 'Çocuk okumaya geçiş aşamasında harfleri tek tek tanıyor ama yan yana getirip kelimeyi (örn: "AL") bir türlü söyleyemiyor. Yol haritanız ne olur?',
        options: [
          { label: 'Acele etmem, harfleri birbirine "uzatarak" bağlamayı (aaaa-llll gibi) oyunlaştırırım. Sadece harf öğretmek yerine seslerin nasıl birleştiğini hissetmesi için daha somut ve eğlenceli çalışmalar yaparım.', clinicalValue: 100, aiTag: 'phonological_blending_expert' },
          { label: 'Harfleri daha çok tekrar ettiririm. Ezberleyene kadar her gün aynı kelimeleri yazdırırım ve görsel hafızasına güvenerek kelimeyi bir bütün olarak ezberlemesini beklerim.', clinicalValue: 60, aiTag: 'rote_learning_focus' },
          { label: 'Bu aşamada zorlandığı için okuma çalışmasına ara veririm. Çocuğun hazır olmadığını düşünür, daha kolay olan boyama veya çizgi çalışmalarına geri dönerim.', clinicalValue: 30, aiTag: 'avoidance_pedagogy' }
        ]
      },
      {
        id: 'stf_acad_2',
        text: 'Matematik dersinde çocuk 10\'a kadar ritmik sayıyor ama önüne 5 tane kalem koyup "kaç tane?" dediğinizde yine 10 diyor. Sorunu nasıl çözersiniz?',
        options: [
          { label: 'Çocuğun "ezbere" saydığını, miktar kavramını anlamadığını fark ederim. Her sayı söylediğinde bir nesneye dokunmasını (birebir eşleme) sağlarım; matematiği sayılardan değil nesnelerden başlatırım.', clinicalValue: 100, aiTag: 'conceptual_math_logic' },
          { label: 'Sayıları daha büyük ve renkli kartonlara yazarım. Görsel olarak sayıları tanıması için sınıfın her yerine sayılar asarım ve sayma şarkılarıyla süreci hızlandırmaya çalışırım.', clinicalValue: 70, aiTag: 'visual_memorization' },
          { label: 'Ailesine evde sürekli sayma alıştırması yaptırmasını söylerim. Tekrar sayısı arttıkça zamanla nesnelerle sayıları kendi kendine eşleştireceğini varsayarım.', clinicalValue: 40, aiTag: 'transfer_of_responsibility' }
        ]
      },
      {
        id: 'stf_acad_3',
        text: 'Yazı yazarken harfleri ters yazan (örn: b yerine d) bir öğrencide ilk hamleniz ne olur?',
        options: [
          { label: 'Hemen kızmam veya silmem. Harfin yönünü hatırlatacak somut bir ipucu (örn: "b"nin karnı sağa bakar, elini koy gibi) bulurum. Harfi havada, kumda veya oyun hamuruyla büyükçe yaparak kas hafızasını düzeltirim.', clinicalValue: 100, aiTag: 'kinesthetic_correction' },
          { label: 'Ters yazdığı her seferde "yanlış yaptın" diyerek sildirir ve doğrusunu 10 kere yan yana yazmasını isterim. Hata yaptıkça doğrusunu görmesinin yeterli olacağını düşünürüm.', clinicalValue: 50, aiTag: 'repetition_over_insight' },
          { label: 'Bunun bir gelişim aşaması olduğunu düşünür, müdahale etmem. Okuması geliştikçe yazısının da zamanla kendi kendine düzeleceğine inanırım.', clinicalValue: 40, aiTag: 'passive_observation' }
        ]
      },
      {
        id: 'stf_acad_4',
        text: 'Akademik görevlerde (masa başı ders) çocuk çok çabuk sıkılıyor ve kaçmak istiyor. Dersi nasıl kurtarırsınız?',
        options: [
          { label: 'Görevi çok küçük parçalara bölerim (örn: sadece 1 satır yaz, sonra 1 dakika oyun). Masadaki o "sıkıcı" havayı dağıtmak için akademik hedefi çocuğun sevdiği bir oyunun içine gizleyerek fark ettirmeden öğretirim.', clinicalValue: 100, aiTag: 'task_segmentation' },
          { label: 'Kurallarımızı hatırlatırım. "Ders bitmeden kalkmak yok" diyerek disiplini korurum. Ders bittiğinde büyük bir ödül vereceğimi söyleyerek çocuğu masada tutmaya çalışırım.', clinicalValue: 70, aiTag: 'extrinsic_motivation' },
          { label: 'Dersi o gün için bitiririm. Çocuğun morali bozukken bir şey öğretemeyeceğimi düşünür, serbest oyun zamanına geçerim.', clinicalValue: 20, aiTag: 'instructional_collapse' }
        ]
      },
      {
        id: 'stf_acad_5',
        text: 'Toplama işlemini kağıt üzerinde yapabilen bir çocuğun, markette "2 elma, 1 elma daha kaç eder?" sorusuna cevap verememesi size neyi anlatır?',
        options: [
          { label: 'Bilginin hayatla birleşmediğini (genellenemediğini) anlarım. Bundan sonraki tüm matematik derslerini kağıt üzerinde değil, gerçek nesnelerle ve hayat senaryolarıyla işlemeye karar veririm.', clinicalValue: 100, aiTag: 'functional_generalization' },
          { label: 'Çocuğun market ortamında dikkatinin dağıldığını düşünürüm. Okulda kağıt üzerinde daha çok pratik yaptırarak işlem hızını artırmaya odaklanırım.', clinicalValue: 60, aiTag: 'environmental_misattribution' },
          { label: 'Çocuğun sözel yönergeleri anlamakta güçlük çektiğini varsayarım. Soruyu kağıda yazıp markette önüne koyarsam yapabileceğini düşünürüm.', clinicalValue: 50, aiTag: 'rigid_pedagogy' }
        ]
      }
    ]
  },

  // --- 3. ETİK TAHKİM VE PROFESYONEL MESAFE ---
  {
    id: 'ethics_and_boundaries',
    title: 'Etik Tahkim ve Profesyonel Mesafe',
    description: 'Veli ile aradaki mesafe, gizlilik ve meslek etiği kararları.',
    icon: '⚖️',
    category: 'ethics',
    questions: [
      {
        id: 'stf_eth_1',
        text: 'Veli sizi "aileden biri" gibi gördüğünü söyleyerek akşam yemeğine davet etti. Kararınız ne olur?',
        options: [
          { label: 'Kurum kuralları ve profesyonel sınırlarım nedeniyle ailelerle özel hayatımda görüşmediğimi nazikçe açıklarım. Aramızdaki saygın mesafeyi korumayı seçerim.', clinicalValue: 100, aiTag: 'formal_purist' },
          { label: 'Aileyle güven bağını güçlendirmek ve çocuğu ev ortamında görmek için bu seferlik giderim. Ama bunun tekrarlanmaması için sonraki süreçte çok dikkatli olurum.', clinicalValue: 90, aiTag: 'relational_empathetic' },
          { label: 'Kendi başıma karar vermem; durumu kurumun düzenlediği genel etkinliklerde (piknik vb.) vakit geçirmeyi teklif ederek kişisel değil, kurumsal düzeyde tutarım.', clinicalValue: 95, aiTag: 'strategic_mediator' }
        ]
      }
    ]
  },

  // --- 4. TEKNO-PEDAGOJİK ADAPTASYON ---
  {
    id: 'academic_innovation',
    title: 'Tekno-Pedagojik Adaptasyon',
    description: 'Teknolojiyi eğitimde yardımcı bir güç olarak kullanma becerisi.',
    icon: '🚀',
    category: 'clinical',
    questions: [
      {
        id: 'stf_inn_1',
        text: 'Yapay zeka sistemi, sizin yıllardır bildiğiniz bir yöntem yerine bu çocuk için çok farklı bir teknik önerdi. Ne yaparsınız?',
        options: [
          { label: 'Sistemin geniş verisinden gelen bu öneriyi merakla incelerim. Bilimsel altyapısını hemen araştırıp, çocuğun güvenliğini riske atmadan küçük denemelerle test ederim.', clinicalValue: 100, aiTag: 'innovative_synthesizer' },
          { label: 'Teknolojinin önerisini sadece bir fikir olarak görürüm ama kendi tecrübeme daha çok güvenirim. Öğretmenlik hissim onaylamıyorsa kendi bildiğimden şaşmam.', clinicalValue: 85, aiTag: 'pedagogical_guardian' },
          { label: 'Bu modern fikri hemen ekip arkadaşlarımla paylaşırım. Hep beraber bir toplantı yapıp, riskleri ve faydaları tartışmadan tek başıma karar vermem.', clinicalValue: 95, aiTag: 'collaborative_technologist' }
        ]
      }
    ]
  },

  // --- 5. MULTİDİSİPLİNER TAKIM VE MENTORLUK ---
  {
    id: 'team_and_mentorship',
    title: 'Multidisipliner Takım ve Mentorluk',
    description: 'İş arkadaşlarıyla uyum, stajyer rehberliği ve ekip içi iletişim.',
    icon: '🤝',
    category: 'team',
    questions: [
      {
        id: 'stf_team_1',
        text: 'Başka branştan bir arkadaşınızın (örn: Ergoterapist), sizin çocuğa uyguladığınız yönteme tam zıt bir müdahale yaptığını gördünüz. O an ne yaparsınız?',
        options: [
          { label: 'Bunu bir tartışma konusu değil, çocuk için yeni bir fırsat olarak görürüm. Hemen arkadaşımı çaya davet edip, "gel çocuk için en iyi orta yolu bulalım" diyerek ortak plan yaparım.', clinicalValue: 100, aiTag: 'systemic_integrator' },
          { label: 'Arkadaşıma bu müdahalenin benim seanslarımı zora soktuğunu nazikçe ama net bir şekilde söylerim. Vaka üzerindeki davranış takibi sorumluluğunun bende olduğunu hatırlatırım.', clinicalValue: 90, aiTag: 'boundary_guardian' },
          { label: 'Bir süre müdahalenin sonucunu izlerim; eğer çocuk daha iyiye gidiyorsa hiyerarşiyi bir kenara bırakır ve arkadaştan neler öğrenebileceğime bakarım. Gelişim her şeyden önceliklidir.', clinicalValue: 85, aiTag: 'pragmatic_collaborator' }
        ]
      }
    ]
  },

  // --- 6. KRİZ LİDERLİĞİ VE VELİ DİPLOMASİSİ ---
  {
    id: 'crisis_leadership',
    title: 'Kriz Liderliği ve Veli Diplomasisi',
    description: 'Zorlu veli görüşmeleri ve sınıftaki kriz anlarını yönetme becerisi.',
    icon: '🔥',
    category: 'parent',
    questions: [
      {
        id: 'stf_cri_1',
        text: 'Veli, kurumun bahçesinde diğer ailelerin önünde "6 aydır hiçbir ilerleme yok, paramızı çöpe atıyoruz!" diye bağırıyor. Ne yaparsınız?',
        options: [
          { label: 'Veliyi hemen sakinleşebileceği kapalı bir odaya davet ederim. Duygularını anladığımı belirttikten sonra, çocuğun bugünkü halini rakamlarla önüne koyarak durumu rasyonel bir şekilde yatıştırırım.', clinicalValue: 100, aiTag: 'rational_deescalator' },
          { label: 'Ailenin yaşadığı hayal kırıklığını ve yorgunluğu gerçekten hissettiğimi gösteririm. Önce sadece dinlerim ve "Haklısınız, çok yoruldunuz" diyerek rahatlamasını sağlarım; güveni onarmaya odaklanırım.', clinicalValue: 95, aiTag: 'empathetic_connector' },
          { label: 'Kurum imajını korumak için veliyi idari ofise yönlendiririm. Bu tarz bir bağırmanın kurallara aykırı olduğunu hatırlatır ve ancak sakinleştiği zaman profesyonel bir görüşme yapabileceğimizi belirtirim.', clinicalValue: 85, aiTag: 'institutional_enforcer' }
        ]
      }
    ]
  }
];
