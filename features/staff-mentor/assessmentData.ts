
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v16.0)
 * Güncelleme: Tüm cevaplar akademik dilden arındırılarak "Saha ve Uygulayıcı Odaklı" hale getirilmiştir.
 * Arka plandaki klinik puanlama (clinicalValue) ve AI analiz mantığı (aiTag) korunmuştur.
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
      },
      {
        id: 'stf_aba_3',
        text: 'Vaka "İlgi çekmek" için bir davranış sergilerken, yanınızdaki stajyerin yanlışlıkla çocuğa gülümsediğini gördünüz. Aksiyonunuz?',
        options: [
          { label: 'Hiç bozuntuya vermeden, o an stajyere değil çocuğa bakmayarak "görmezden gelme" örneği olurum; yanlış davranışın ödüllenmesini engellemeye çalışırım.', clinicalValue: 100, aiTag: 'immediate_modeling' },
          { label: 'Seans sonunda stajyeri kenara çeker ve hatasını söylerim; bu gülümsemenin çocuğun krizini nasıl uzattığını not olarak dosyasına eklerim.', clinicalValue: 60, aiTag: 'delayed_correction' },
          { label: 'Gülümsemenin çocukla bağ kurmak için iyi olduğunu düşünürüm, araya girmem ve dersin akışına devam ederim.', clinicalValue: 10, aiTag: 'clinical_laxity' }
        ]
      },
      {
        id: 'stf_aba_4',
        text: 'Ders ödülü olarak kullanılan oyuncağın artık çocuk için ilgi çekici olmadığını fark ettiniz. Yeni hamleniz?',
        options: [
          { label: 'Önce çocuğun sevdiği sosyal oyunlarla bu oyuncağı beraber kullanırım; benim ilgimle oyuncağın tekrar değer kazanmasına odaklanırım.', clinicalValue: 100, aiTag: 'advanced_pairing_skill' },
          { label: 'Oyuncağı bir süre ortadan kaldırırım; çocuk onu özleyince tekrar ortaya çıkarıp ilgisini çekmeye çalışırım.', clinicalValue: 50, aiTag: 'manipulative_aba' },
          { label: 'Hemen oyuncak kutusuna giderim ve çocuğun önüne denerken sevebileceği başka bir şey koyarım.', clinicalValue: 70, aiTag: 'standard_substitution' }
        ]
      },
      {
        id: 'stf_aba_5',
        text: 'Öğrenci bir çalışmada 5 kere üst üste hata yaptı. Yardımı nasıl ayarlarsınız?',
        options: [
          { label: 'En yoğun yardıma (elinden tutma gibi) geri dönerim ve hata yapmasına izin vermeden doğruyu yaptırırım; çocuğun "ben yapamıyorum" demesine izin vermem.', clinicalValue: 100, aiTag: 'prompt_fidelity' },
          { label: 'Dersi o an keserim ve çocuğun çok iyi yaptığı başka bir konuya geçerek dersi keyifli bitirmeye çalışırım.', clinicalValue: 40, aiTag: 'avoidance_strategy' },
          { label: 'Aynı yardım seviyesinde devam ederim; çocuk kendi kendine doğruyu bulana kadar pes etmeden beklerim.', clinicalValue: 10, aiTag: 'instructional_rigidity' }
        ]
      },
      {
        id: 'stf_aba_6',
        text: 'Adım adım öğretilen bir beceride (örn: El yıkama) çocuk tam ortada takılıyor. Kararınız?',
        options: [
          { label: 'Eğer çocuk başarmanın tadını seviyorsa, en son adımı ona yaptırıp geri kalanları ben tamamlarım; "başardım" hissiyle mutlu ayrılmasını sağlarım.', clinicalValue: 100, aiTag: 'clinical_functional_logic' },
          { label: 'Tüm aşamaları her seferinde beraber yaparak genel bir alışkanlık kazanmasını beklerim.', clinicalValue: 70, aiTag: 'generalist_approach' },
          { label: 'Beceriyi en ince detayına kadar çok küçük parçalara bölerim ve her günü tek bir parmak hareketine ayırırım.', clinicalValue: 50, aiTag: 'extreme_task_analysis' }
        ]
      },
      {
        id: 'stf_aba_7',
        text: 'Aile, çocuğun yapamadığı bir şeyi "yaptı" olarak işaretlemenizi, morallerinin çok bozuk olduğunu söyledi. Kararınız?',
        options: [
          { label: 'Nazikçe reddederim; yanlış bilginin ileride bizi tıkayacağını, aileye gerçek ilerlemeyi göstererek daha sağlam yol alacağımızı anlatırım.', clinicalValue: 100, aiTag: 'ethical_fortress' },
          { label: 'Ailenin gönlü olsun diye işaretlerim ama derste o konuyu gizlice çalışmaya devam ederim; şimdilik durumu idare ederim.', clinicalValue: 20, aiTag: 'dishonest_clinical_management' },
          { label: 'Yönetime sorarım, kurumun genel kararı neyse "evet" veya "hayır" derim; sorumluluğu üzerime almam.', clinicalValue: 40, aiTag: 'responsibility_abdication' }
        ]
      },
      {
        id: 'stf_aba_8',
        text: 'Yeni bir vakada neden "hata yapmasına izin vermeden öğretme" yolunu seçersiniz?',
        options: [
          { label: 'Hata yapmasını engelleyerek çocuğun dersten soğumasını önlemek ve öğrenme sürecini moralini bozmadan hızlandırmak için.', clinicalValue: 100, aiTag: 'pedagogical_foresight' },
          { label: 'Dersin daha hızlı bitmesini ve ailenin hemen "çocuğum öğrendi" diye mutlu olmasını sağlamak için.', clinicalValue: 20, aiTag: 'performance_bias' },
          { label: 'Hazırlık yapması daha kolay olduğu ve daha az materyalle günü kurtarabildiğimiz için.', clinicalValue: 10, aiTag: 'resource_saving_focus' }
        ]
      },
      {
        id: 'stf_aba_9',
        text: 'Çocuk oyun sırasında derste çalıştığımız bir kelimeyi aniden söyledi. Ne yaparsınız?',
        options: [
          { label: 'Hemen o an çok büyük bir sevinçle (veya sevdiği bir ödülle) bunu kutlarım; "kendi başına yapması"nın en değerli şey olduğunu ona hissettiririm.', clinicalValue: 100, aiTag: 'capture_incidental_teaching' },
          { label: 'Sadece "aferin" derim ve oyunun bozulmaması için çok üzerinde durmadan oynamaya devam ederim.', clinicalValue: 50, aiTag: 'low_magnitude_reinforcement' },
          { label: 'Hemen oyunu durdurur ve kelimeyi 5 kere daha tekrar ettiririm; hazır söylemişken iyice ezberlemesini sağlarım.', clinicalValue: 20, aiTag: 'over_correction_risk' }
        ]
      },
      {
        id: 'stf_aba_10',
        text: 'BEP toplantısında bir hedefin "çok zor" olduğunu düşündünüz ama diğer herkes "kalsın" diyor. Tavrınız?',
        options: [
          { label: 'Elimdeki verileri göstererek çocuğun şu anki kapasitesiyle bu hedefin onu sadece yoracağını anlatırım; gerçekçi ve başarabileceği hedeflere odaklanmayı savunurum.', clinicalValue: 100, aiTag: 'data_driven_advocacy' },
          { label: 'Çoğunluğa uyarım; "herkes diyorsa bir bildikleri vardır" diyerek o hedefi de programa eklerim ama çok üzerinde durmam.', clinicalValue: 60, aiTag: 'passive_compliance' },
          { label: 'Hedef kalsın derim ama derste bu zor hedefi hiç çalışmayarak kendi bildiğim kolay konularla vakit geçiririm.', clinicalValue: 30, aiTag: 'covert_resistance' }
        ]
      }
    ]
  },

  // --- 2. ETİK TAHKİM VE PROFESYONEL MESAFE ---
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
      },
      {
        id: 'stf_eth_2',
        text: 'Veli, "Kurumun haberi olmasın, bize evde gizlice özel ders ver, sana iki katı ödeme yapalım" dedi. Ne yaparsınız?',
        options: [
          { label: 'Bu teklifi kesinlikle kabul etmem. Bir vaka ile hem kurumda hem de dışarıda para ilişkisi kurmanın dürüstlüğümü bozacağını aileye net bir şekilde söylerim.', clinicalValue: 100, aiTag: 'uncompromising_ethics' },
          { label: 'Hemen yönetime bilgi veririm. Eğer vakanın gerçekten ek ders alması gerekiyorsa, bunu kurum çatısı altında şeffaf bir şekilde yapmayı öneririm.', clinicalValue: 95, aiTag: 'transparent_institutionalist' },
          { label: 'Doğrudan reddetmem ama "Müdürümüzle görüşüp izin almam lazım" diyerek kararı yönetime bırakırım. Tek başıma bu etik sorumluluğu üstlenmekten kaçınırım.', clinicalValue: 85, aiTag: 'pragmatic_clinical_advocate' }
        ]
      },
      {
        id: 'stf_eth_3',
        text: 'Ders sırasında çocuğun vücudunda bir morluk gördünüz. Veli "evde çarptı" diyor ama siz şüphelisiniz. İlk adımınız?',
        options: [
          { label: 'Durumu hiç vakit kaybetmeden yönetime ve gerekli birimlere raporlarım. Çocuğun güvenliği, aileyle aramın bozulmasından çok daha önemlidir.', clinicalValue: 100, aiTag: 'legal_watchdog' },
          { label: 'Önce aileyi sakin bir köşeye çeker ve yargılamadan olayı sormaya çalışırım. Eğer ailede bir kriz varsa yardım etmek için kurum rehberliğini devreye sokarım.', clinicalValue: 90, aiTag: 'supportive_counselor' },
          { label: 'Gördüğüm izi dosyaya not alırım. Sonraki birkaç ders boyunca çocuğu ve aileyi çok yakından izlerim. Somut kanıt olana kadar bekleyip veri toplarım.', clinicalValue: 95, aiTag: 'methodical_observer' }
        ]
      },
      {
        id: 'stf_eth_4',
        text: 'Sosyal medya hesabınızda, çocuğun başarısını gösteren bir fotoğrafı (ailenin izniyle) paylaşmaya nasıl bakarsınız?',
        options: [
          { label: 'Asla paylaşmam. Çocuğun gelecekteki mahremiyetini korumak, ailenin o anki izninden daha önemlidir. Uzman kimliğim ile sosyal medya kimliğimi bir tutmam.', clinicalValue: 100, aiTag: 'privacy_purist' },
          { label: 'Eğitimin faydasını göstermek için, çocuğun yüzünü göstermeyecek şekilde (arkadan veya emojiyle) paylaşabilirim. Odağı kendime değil eğitime veririm.', clinicalValue: 90, aiTag: 'awareness_advocate' },
          { label: 'Bu tarz bir paylaşımın sadece kurumun resmi sayfası üzerinden yapılmasını desteklerim. İçeriği kurumsal hesaba gönderir, kendimden paylaşmam.', clinicalValue: 95, aiTag: 'corporate_safety_expert' }
        ]
      },
      {
        id: 'stf_eth_5',
        text: 'Bir mesai arkadaşınızın derslere sürekli geç girdiğini ama raporlara tam süre yazdığını fark ettiniz. Ne yaparsınız?',
        options: [
          { label: 'Arkadaşımı kenara çekip bu durumun çocukların hakkını yemek olduğunu söylerim. Eğer düzelmezse, çocukların eğitim hakkı için durumu yönetime rapor ederim.', clinicalValue: 100, aiTag: 'peer_supervisor' },
          { label: 'Durumu isim vermeden genel bir toplantıda gündeme getiririm. "Ders saatlerine uyum" üzerine konuşma başlatarak herkesin kendi hatasını fark etmesini sağlarım.', clinicalValue: 95, aiTag: 'systemic_regulator' },
          { label: 'Arkadaşımın bir sorun yaşayıp yaşamadığını anlamaya çalışırım. Belki bir tükenmişlik yaşıyordur diyerek ona destek teklif ederim. Dostane bir yolla çözerim.', clinicalValue: 85, aiTag: 'empathetic_leader' }
        ]
      }
    ]
  },

  // --- 3. TEKNO-PEDAGOJİK ADAPTASYON ---
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
      },
      {
        id: 'stf_inn_2',
        text: 'Derste veri girişi için tablet kullanmanın, çocukla aranızdaki o sıcak bağı azalttığını fark ettiniz. Çözümünüz?',
        options: [
          { label: 'Ders sırasında tableti tamamen kaldırırım; çocukla kurulan bağ her şeyden önemlidir. Verileri ders bittikten sonra hafızam taze iken sisteme eksiksiz girerim.', clinicalValue: 90, aiTag: 'human_centric_purist' },
          { label: 'Tableti dersin bir parçası yaparım. Veri girerken bunu çocuğa bir oyun gibi gösterip, teknolojiyi aramıza giren bir engel değil, bizi birleştiren bir araç haline getiririm.', clinicalValue: 100, aiTag: 'adaptive_digital_coach' },
          { label: 'Sistemin hatasız çalışması için tableti kullanmaya devam ederim. Zamanla elim alışacağı için veri girişini hızlandırır, bağı minimum düzeyde kesmeye çalışırım.', clinicalValue: 80, aiTag: 'efficiency_focused_expert' }
        ]
      }
    ]
  },

  // --- 4. MULTİDİSİPLİNER TAKIM VE MENTORLUK ---
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
      },
      {
        id: 'stf_team_2',
        text: 'Sorumluluğunuzdaki bir stajyer, verdiğiniz bir talimatın "gereksiz veya yanlış" olduğunu söyleyerek sizinle tartışmaya girdi. Tavrınız nedir?',
        options: [
          { label: 'Stajyerin bu merakını ve sorgulamasını hoş karşılarım. Onu yanıma alıp çocuk üzerindeki etkisini beraber izlemeyi teklif ederim; neden bu kararı verdiğimi ona uygulamalı gösteririm.', clinicalValue: 100, aiTag: 'growth_oriented_mentor' },
          { label: 'Ona burada bir öğrenme sürecinde olduğunu, kararların sorumluluğunun bende olduğunu hatırlatırım. Bu tarz tartışmaların seans içinde değil, ders sonrasında olması gerektiğini belirtirim.', clinicalValue: 90, aiTag: 'hierarchical_leader' },
          { label: 'Eğer sunduğu fikir mantıklıysa hatamı kabul etmekten çekinmem. Stajyerin önünde bile olsa hatamı kabul ederek, dürüstlüğün en büyük profesyonellik olduğunu ona yaşatırım.', clinicalValue: 95, aiTag: 'intellectually_honest_mentor' }
        ]
      },
      {
        id: 'stf_team_3',
        text: 'Bir toplantıda tüm ekip başarısız giden bir süreçten dolayı sizi suçluyor. Kendinizi nasıl regüle edersiniz?',
        options: [
          { label: 'Eleştirileri kişisel almam; "Demek ki göremediğim bir yer var" diye düşünürüm. Arkadaşlarıma "Siz benim yerimde olsanız bu tıkanıklığı aşmak için ne yapardınız?" diye sorarım.', clinicalValue: 100, aiTag: 'resilient_professional' },
          { label: 'Hemen savunmaya geçmem; elimdeki seans kayıtlarını ve gelişim grafiklerini göstererek kararlarımın nedenlerini ispatlarım. Duygularla değil, verilerle konuşmaya odaklanırım.', clinicalValue: 90, aiTag: 'analytical_defender' },
          { label: 'Önce ekibin bu stresli halini anladığımı söylerim; "Hepimiz çocuk için endişeliyiz, haklısınız" diyerek ortamı yumuşatırım. Ardından sorumluluğu paylaşmayı teklif ederim.', clinicalValue: 95, aiTag: 'harmonizing_stabilizer' }
        ]
      }
    ]
  },

  // --- 5. KRİZ LİDERLİĞİ VE VELİ DİPLOMASİSİ ---
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
      },
      {
        id: 'stf_cri_2',
        text: 'Derste çocuk size veya kendisine zarar vermeye başladı. İlk fiziksel hamleniz?',
        options: [
          { label: 'Hiç panik yapmadan önce çevredeki tüm materyalleri uzaklaştırırım. Çocuğun kendine zarar vermesini engelleyecek en hafif güvenli tutuşu uygular ve sakinleşmesi için sessizce beklerim.', clinicalValue: 100, aiTag: 'clinical_safety_expert' },
          { label: 'Hemen yardım çağırmak için kapıya yönelirim; seansı o an kesip güvenlik personelinin müdahale etmesini beklerim. Kendi güvenliğimi ve çocuğun o anki krizini profesyonel desteğe bırakırım.', clinicalValue: 80, aiTag: 'safety_first_pragmatist' },
          { label: 'Çocuğu kucaklayarak sevmeye ve "tamam geçti" diyerek sakinleştirmeye çalışırım; krizi duygusal bir yakınlıkla ve şefkatle çözmeye odaklanırım.', clinicalValue: 40, aiTag: 'emotionally_reactive_care' }
        ]
      }
    ]
  }
];
