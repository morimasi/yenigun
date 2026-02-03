
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v18.5)
 * Güncelleme: Akademik Beceriler modülü 15 soruya çıkarıldı.
 * Derin Muhakeme ve Bilimsel Müdahale (EBP) odaklı seçenekler eklendi.
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
        text: 'Grafik analizinde verilerin çok inişli çıkışli olduğunu gördünüz. Bu durumda ilk olarak neyden şüphelenirsiniz?',
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
      },
      {
        id: 'stf_acad_6',
        text: 'Okuduğunu anlama çalışmasında çocuk metni hatasız okuyor ama "Nerede geçti?" sorusuna cevap veremiyor. Müdahaleniz ne olur?',
        options: [
          { label: 'Çocuğun mekanik okuduğunu, yani anlamı kaçırdığını saptarım. Metni okumadan önce görsel ipuçları sunar ve okuma sırasında metindeki yer bildiren ifadelerin altını çizmesini sağlayarak görselleştiririm.', clinicalValue: 100, aiTag: 'meaning_focused_reading' },
          { label: 'Metni tekrar okuturum. "Daha dikkatli oku" diyerek uyarıda bulunur ve her cümleden sonra ne anladığını sorarak bir nevi sorgulama yaparım.', clinicalValue: 60, aiTag: 'repetition_logic' },
          { label: 'Soruyu çocuğa değil, ben söylerim. "Bak burada ağaç altında diyor" diyerek cevabı gösterir, onun da bu cevabı bir yere yazmasını sağlayarak pekiştiririm.', clinicalValue: 30, aiTag: 'passive_learning' }
        ]
      },
      {
        id: 'stf_acad_7',
        text: 'İki basamaklı sayılarda toplama yaparken çocuk sürekli birler basamağından başlamak yerine onlar basamağından başlıyor. Nasıl bir yöntem izlersiniz?',
        options: [
          { label: 'Basamak tablosu ve onluk-birlik blokları kullanırım. Toplama işleminin neden en küçük birimden başlaması gerektiğini (elde durumu) somut olarak hissettiren "Basamak Evi" oyununu kurarım.', clinicalValue: 100, aiTag: 'concrete_operational_logic' },
          { label: 'Kuralı ezberletirim. Kağıdın üzerine büyük bir ok çizerek "Buradan başla" derim. Yanlış başladığı her an işlemi durdurup başa döndürürüm.', clinicalValue: 70, aiTag: 'visual_cueing' },
          { label: 'Eğer sonuç doğru çıkıyorsa müdahale etmem. İşlem sırasının çocuğun kendi bilişsel tarzı olduğunu düşünür, zamanla kendisinin keşfedeceğine inanırım.', clinicalValue: 40, aiTag: 'error_negligence' }
        ]
      },
      {
        id: 'stf_acad_8',
        text: 'Fonolojik farkındalık çalışmasında çocuk "K-A-P-I" diye kodladığınız kelimeyi "KAPI" olarak birleştiremiyor. Neyi eksik bırakmış olabilirsiniz?',
        options: [
          { label: 'Harf seslerinin süresini çok uzun tutmuş veya sesleri kopuk vermiş olabilirim. Sesleri birbirine "lehimler" gibi (kkkaaaapppiii) akıcı bir şekilde söylemeyi modeller ve tempoyu ayarlarım.', clinicalValue: 100, aiTag: 'fluid_blending_mastery' },
          { label: 'Çocuğun harf-ses bilgisinin tam olmadığını varsayarım. Birleştirme çalışmasını durdurur, harf kartlarını çıkarıp tek tek sesleri tekrar çalıştırırım.', clinicalValue: 60, aiTag: 'component_regression' },
          { label: 'Çocuğun işitsel hafızasının zayıf olduğunu düşünür, bu hedefi bir süreliğine beklemeye alır ve görsel eşleme çalışmalarına ağırlık veririm.', clinicalValue: 40, aiTag: 'avoidant_strategy' }
        ]
      },
      {
        id: 'stf_acad_9',
        text: 'Bir metni sıralama (önce-sonra-en son) çalışmasında öğrenci olayları sürekli birbirine karıştırıyor. İlk hamleniz nedir?',
        options: [
          { label: 'Görsel bir akış şeması (Story Map) oluştururum. Olayları temsil eden resimleri masaya koyar ve önce fiziksel olarak yerlerini değiştirmesini, sonra anlatmasını sağlarım; somutlaştırma önceliklidir.', clinicalValue: 100, aiTag: 'visual_sequencing_support' },
          { label: 'Metni tekrar yüksek sesle okurum. Her olaydan sonra "Şimdi ne oldu?" diye sorarak hafızasını zorlamaya çalışırım.', clinicalValue: 70, aiTag: 'auditory_memory_loading' },
          { label: 'Olayların altına "1, 2, 3" yazdırırım. Numaralandırma yaparak ezberlemesini sağlarım.', clinicalValue: 50, aiTag: 'numeric_memorization' }
        ]
      },
      {
        id: 'stf_acad_10',
        text: 'Çıkarma işleminde (örn: 42-15) "komşudan onluk almayı" çocuk bir türlü içselleştiremiyor. Sadece "2\'den 5 çıkmaz 12 olur" diyor ama nedenini bilmiyor. Ne yaparsınız?',
        options: [
          { label: 'Abaküs veya gerçek para (10 TL ve 1 TL\'ler) kullanırım. 10 TL\'yi bozup 10 tane 1 TL yapmanın (unbundling) mantığını yaşatarak anlatırım; matematiği "bozdurma" eylemiyle somutlaştırırım.', clinicalValue: 100, aiTag: 'unbundling_concept_expert' },
          { label: 'Kuralı şarkı haline getiririm. "Küçükten büyük çıkmazsa komşuya git kapıyı çal" tekerlemesini ezberletirim ve işlem adımlarını şablon olarak sunarım.', clinicalValue: 70, aiTag: 'mnemonic_pedagogy' },
          { label: 'Basit çıkarma işlemlerine geri dönerim. (örn: 9-5) Onluk bozma gerektirmeyen işlemlerde hızlanmasını sağlar, büyüyünce anlayacağını varsayarım.', clinicalValue: 30, aiTag: 'regression_error' }
        ]
      },
      {
        id: 'stf_acad_11',
        text: 'Disleksi olan bir öğrencide kelime okuma hızı (fluency) çok düşükse, akıcılığı artırmak için hangi tekniği önceliklendirirsiniz?',
        options: [
          { label: 'Tekrarlı Okuma (Repeated Reading) ve Eşli Okuma yaparım. Aynı kısa metni farklı amaçlarla (örn: duygu katarak, yarışarak) okutarak kelime tanıma hızını (sight word recognition) artırırım.', clinicalValue: 100, aiTag: 'evidence_based_fluency' },
          { label: 'Metni hecelere böldürürüm. Her kelimeyi "da-kı-ka" diye heceleterek hatasız okumasını sağlarım; yavaş ama hatasız okumayı hedeflerim.', clinicalValue: 60, aiTag: 'syllabic_fixation' },
          { label: 'Göz egzersizleri yaptırırım. Göz kaslarını güçlendirmenin okuma hızını doğrudan artıracağına inanarak dersin bir kısmını buna ayırırım.', clinicalValue: 20, aiTag: 'pseudo_scientific_approach' }
        ]
      },
      {
        id: 'stf_acad_12',
        text: 'Öğrenci ritmik saymayı biliyor ama "Aradan sayma" (Örn: 4\'ten başla) dendiğinde donup kalıyor. Bu durum hangi eksikliğe işaret eder?',
        options: [
          { label: 'Sayılar arasındaki ilişkinin (Numerical Order) mantığını kavramadığını, saymayı sadece bir tekerleme gibi ezberlediğini anlarım. Sayı doğrusu üzerinde ileri-geri atlamalar yaparak sayıların konumunu çalışırım.', clinicalValue: 100, aiTag: 'number_line_logic' },
          { label: 'Dikkat eksikliği olduğunu düşünürüm. Odaklanamadığı için nerede kaldığını unuttuğunu varsayar ve dikkati artırıcı ilaç veya takviye önerisi için yönlendirme yaparım.', clinicalValue: 40, aiTag: 'over_diagnosis_bias' },
          { label: 'Çocuğun yorgun olduğunu düşünür, çalışmaya ara veririm. Moralini bozmamak için başarabileceği bir görev olan "1\'den başlayarak sayma"ya geri dönerim.', clinicalValue: 20, aiTag: 'instructional_avoidance' }
        ]
      },
      {
        id: 'stf_acad_13',
        text: 'Yazılı anlatımda (kompozisyon) öğrenci sadece tek kelimelik cevaplar veriyor. Cümle kurmasını nasıl teşvik edersiniz?',
        options: [
          { label: '"Genişletilmiş Soru" tekniğini kullanırım. Verdiği kelimeye "kim, ne zaman, nasıl?" ekleri getirerek cümle iskeletini birlikte kurar ve "Scaffolding" (Yapı iskelesi) yöntemiyle yavaşça desteğimi çekerim.', clinicalValue: 100, aiTag: 'scaffolding_technique' },
          { label: 'Yazacağı cümleleri ben önceden tahtaya yazarım. O cümleleri defterine 5\'er kez yazarak cümle yapısına elinin ve gözünün alışmasını sağlarım.', clinicalValue: 50, aiTag: 'copy_paste_pedagogy' },
          { label: 'Doğru cümleyi kurana kadar yeni soru sormam. "Cümle kurmazsan ödül yok" diyerek motivasyonunu zorlarım.', clinicalValue: 30, aiTag: 'aversive_conditioning' }
        ]
      },
      {
        id: 'stf_acad_14',
        text: 'Problemi okuyan ama "Hangi işlemi yapacağımı bilmiyorum (Toplama mı Çıkarma mı?)" diyen bir öğrencide eksik olan nedir?',
        options: [
          { label: 'Matematiksel dildeki "Anahtar Kelimeler"i (örn: arttı, eksildi, toplamda, geriye) ve problemin senaryosunu zihninde canlandıramadığını anlarım. Problemi resmetmesini (Visual Representation) isteyerek somut bir strateji geliştiririm.', clinicalValue: 100, aiTag: 'mathematical_schema_training' },
          { label: 'Çocuğun işlem becerisinin zayıf olduğunu varsayarım. Bol bol alt alta toplama-çıkarma sayfası vererek otomatikleşmesini beklerim.', clinicalValue: 50, aiTag: 'procedural_reductionism' },
          { label: 'Okuma-yazma seviyesine geri dönerim. Kelimeleri anlayamadığı için işlemi seçemediğini düşünür, okuma çalışmaları yaparım.', clinicalValue: 40, aiTag: 'misaligned_intervention' }
        ]
      },
      {
        id: 'stf_acad_15',
        text: 'Öğrenci okul ödevlerini yaparken çok yavaş ve sürekli silgi kullanıyor. Mükemmeliyetçi bir kaygısı olduğunu fark ettiniz. Tavrınız?',
        options: [
          { label: 'Hata yapmanın öğrenmenin bir parçası olduğunu vurgulamak için kasıtlı olarak ben de hatalar yaparım. Silgiyi masadan kaldırıp "Renkli Hatalar" günü yaparız ve sürecin sonuca odaklı değil çabaya odaklı olmasını sağlarım.', clinicalValue: 100, aiTag: 'perfectionism_desensitization' },
          { label: 'Daha düzgün yazması için teşvik ederim. "Güzel yazarsan yıldız alırsın" diyerek dışsal motivasyonu artırırım ve her hatasında nazikçe uyarırım.', clinicalValue: 60, aiTag: 'reinforcing_anxiety' },
          { label: 'Ödevleri azaltırım. Çocuğun zorlandığını gördüğüm için ödev yapmamasını, sadece okuma yapmasının yeterli olacağını aileye bildiririm.', clinicalValue: 30, aiTag: 'standard_lowering' }
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
