
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v13.0)
 * Güncelleme: Tüm modüller "Uygulayıcı Dostu" ve "Arketip Odaklı" dile geçirilmiştir.
 */
export const MODULAR_BATTERIES: AssessmentBattery[] = [
  // --- 1. İLERİ ABA VE KLİNİK KARAR MEKANİZMALARI ---
  {
    id: 'aba_advanced_mastery',
    title: 'İleri ABA ve Klinik Karar Mekanizmaları',
    description: 'Veri sadakati, sönme prosedürleri ve kompleks davranış yönetimi.',
    icon: '📊',
    category: 'clinical',
    questions: [
      {
        id: 'stf_aba_1',
        text: 'Öğrenci seans sırasında çok şiddetli bir ağlama/bağırma nöbeti geçiriyor. Ortam güvenli ancak kurum yönetimi sesten rahatsız olup seansı bitirmenizi istiyor. Kararınız?',
        options: [
          { label: 'Eğer bu aşamada pes edip seansı bitirirsek, çocuğun bu davranışı "istediğimi yaptırabiliyorum" diye öğreneceğini açıklarım. Sabırla devam etmemiz gerektiğini, aksi halde tüm emeklerin boşa gideceğini nazikçe söylerim.', clinicalValue: 100, aiTag: 'clinical_integrity' },
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

  // --- 2. ETİK TAHKİM VE PROFESYONEL MESAFE (SADELEŞTİRİLMİŞ) ---
  {
    id: 'ethics_and_boundaries',
    title: 'Etik Tahkim ve Profesyonel Mesafe',
    description: 'Veli ile aradaki mesafe, gizlilik ve meslek etiği kararları.',
    icon: '⚖️',
    category: 'ethics',
    questions: [
      {
        id: 'stf_eth_1',
        text: 'Veli sizi "aileden biri" gibi gördüğünü söyleyerek evdeki özel bir akşam yemeğine davet etti. Bu samimi teklif karşısındaki duruşunuz ne olur?',
        options: [
          { label: 'Kurum kuralları ve mesleki sınırlarım gereği, ailelerle ders saatleri dışında sosyal görüşme yapmamın ileride vereceğim eğitim kararlarını etkileyebileceğini nazikçe anlatır ve daveti kibarca reddederim. Aramızdaki saygın mesafeyi korumayı seçerim.', clinicalValue: 100, aiTag: 'formal_purist' },
          { label: 'Aile ile kurulan güven bağını (ittifakı) güçlendirmek ve çocuğu kendi doğal ev ortamında gözlemleme şansı bulmak adına bu davete bir kereliğine katılırım. Ancak bunun bir alışkanlığa dönüşmemesi için sonraki süreçte sınırlarıma çok daha dikkat ederim.', clinicalValue: 90, aiTag: 'relational_empathetic' },
          { label: 'Bu tarz bireysel davetleri kabul etmem ancak aileyi kırmamak için kurumun düzenlediği genel toplantı, piknik veya çay saatleri gibi kontrollü ortamlarda daha fazla vakit geçirmeyi teklif ederim. İlişkiyi kişisel değil, kurumsal bir düzlemde tutmaya çalışırım.', clinicalValue: 95, aiTag: 'strategic_mediator' }
        ]
      },
      {
        id: 'stf_eth_2',
        text: 'Çok sevdiğiniz bir veli, "Kurumun haberi olmasın, bize evde gizlice özel ders ver, sana iki katı ödeme yapalım" dedi. Nasıl bir yol izlersiniz?',
        options: [
          { label: 'Bu teklifi kesinlikle kabul etmem. Bir vaka ile hem kurumda hem de dışarıda para ilişkisi kurmanın (çiftli ilişki) dürüstlüğümü bozacağını, bunun meslek ahlakına sığmayacağını aileye net bir şekilde söylerim. Güvenlerini sarsmadan bu konuyu kapatırım.', clinicalValue: 100, aiTag: 'uncompromising_ethics' },
          { label: 'Hemen kurum yönetimine bilgi veririm. Eğer vakanın gerçekten ek ders alması gerekiyorsa, bunu kurum çatısı altında ve resmi bir şekilde yapmayı öneririm. Her şeyin şeffaf ve denetlenebilir olduğu bir sistemde çalışmayı şart koşarım.', clinicalValue: 95, aiTag: 'transparent_institutionalist' },
          { label: 'Teklifi doğrudan reddetmem ancak veliye "Önce müdürümüzle görüşüp izin almam gerekir, kurumun onayı olmadan böyle bir şey yapamam" diyerek topu yönetime atarım. Kendi başıma etik bir sorumluluk almaktan kaçınır, kurumsal kararı beklerim.', clinicalValue: 85, aiTag: 'pragmatic_clinical_advocate' }
        ]
      },
      {
        id: 'stf_eth_3',
        text: 'Ders sırasında çocuğun vücudunda bir morluk/yara gördünüz. Veli "evde çarptı" diyor ama siz emin değilsiniz. İlk adımınız?',
        options: [
          { label: 'Durumu hiç vakit kaybetmeden kurum müdürüne ve çocuk koruma birimlerine raporlarım. Çocuğun güvenliği, aile ile olan aramdaki dostluktan çok daha önemlidir. Risk varsa bunu bildirmek benim yasal ve ahlaki görevimdir, gerekirse aile ile aramın bozulmasını göze alırım.', clinicalValue: 100, aiTag: 'legal_watchdog' },
          { label: 'Önce aileyi sakin bir köşeye çeker ve olayın nasıl olduğunu detaylıca, yargılamadan sormaya çalışırım. Eğer gerçekten bir destek ihtiyacı sezersem veya ailede bir kriz varsa, onlara yardım etmek için kurumun rehberlik birimini devreye sokarım. Hemen suçlamak yerine anlamayı seçerim.', clinicalValue: 90, aiTag: 'supportive_counselor' },
          { label: 'Gördüğüm yarayı objektif bir şekilde fotoğraflayıp vaka dosyasına not alırım. Sonraki birkaç ders boyunca çocuğu ve aileyi çok yakından izlerim. Aceleci bir karar verip aileyi ürkütmektense, elimde daha somut bir kanıt olana kadar gözlem yapmaya ve veri toplamaya devam ederim.', clinicalValue: 95, aiTag: 'methodical_observer' }
        ]
      },
      {
        id: 'stf_eth_4',
        text: 'Sosyal medya hesabınızda, vakanızın başarısını ve size olan sevgisini gösteren bir fotoğrafı (ailenin sözlü izniyle) paylaşmaya nasıl bakarsınız?',
        options: [
          { label: 'Asla paylaşmam. Çocuğun gelecekteki mahremiyetini ve dijital haklarını korumak, ailenin o anki duygusal izninden daha önemlidir. Uzman kimliğim ile sosyal medya kimliğim arasına kesin bir sınır çekerim; vakalarım benim reklam aracım olamaz.', clinicalValue: 100, aiTag: 'privacy_purist' },
          { label: 'Eğitimin faydalarını ve kurumumuzun başarısını göstermek için, çocuğun yüzünü net göstermeyecek şekilde (arkadan veya emojiyle) paylaşabilirim. Bunu yaparken kendimi değil, özel eğitimin çocuklara neler kattığını anlatmaya odaklanan bir dil kullanırım.', clinicalValue: 90, aiTag: 'awareness_advocate' },
          { label: 'Bu tarz bir paylaşımı ancak kurumun resmi hesabı üzerinden yapılmasını desteklerim. Kendi hesabımdan paylaşmak yerine, içeriği kurumun medya birimine gönderirim. Böylece paylaşım bireysel bir hareketten çıkıp kurumsal bir başarı hikayesine dönüşür.', clinicalValue: 95, aiTag: 'corporate_safety_expert' }
        ]
      },
      {
        id: 'stf_eth_5',
        text: 'Bir mesai arkadaşınızın derslere sürekli geç girdiğini ama raporlara tam süre yazdığını fark ettiniz. Ne yaparsınız?',
        options: [
          { label: 'Arkadaşımı bir kenara çekip bu durumun hem çocukların hakkını yemek olduğunu hem de kendi profesyonelliğine zarar verdiğini açıkça söylerim. Eğer uyarıma rağmen düzelmezse, çocukların eğitim hakkını korumak için durumu yönetime rapor etmekten çekinmem.', clinicalValue: 100, aiTag: 'peer_supervisor' },
          { label: 'Durumu isim vermeden genel bir ekip toplantısında gündeme getiririm. "Ders saatlerine uyum ve rapor dürüstlüğü" üzerine bir konuşma başlatarak, herkesin kendi hatasını fark etmesini sağlarım. Sorunu kişiselleştirmeden kurum içinde bir oto-kontrol mekanizması kurmaya çalışırım.', clinicalValue: 95, aiTag: 'systemic_regulator' },
          { label: 'Arkadaşımın bir sorun yaşayıp yaşamadığını anlamaya çalışırım. Belki bir tükenmişlik yaşıyordur diyerek ona destek teklif ederim. Onu şikayet etmek yerine, bu durumu nasıl telafi edebileceğine (ek çalışmalar vb.) dair ona rehberlik ederek sorunu dostane bir yolla çözerim.', clinicalValue: 85, aiTag: 'empathetic_leader' }
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
        text: 'Yapay zeka sistemi (MIA), sizin yıllardır bildiğiniz bir yöntem yerine, bu vaka için çok farklı ve modern bir teknik önerdi. Ne yaparsınız?',
        options: [
          { label: 'Yapay zekanın geniş veri havuzundan gelen bu öneriyi merakla incelerim. Önerilen yöntemin bilimsel altyapısını hemen araştırıp, çocuğun güvenliğini riske atmadan küçük denemelerle süreci test ederim.', clinicalValue: 100, aiTag: 'innovative_synthesizer' },
          { label: 'Teknolojinin önerisini sadece bir fikir olarak görürüm ama kendi tecrübeme daha çok güvenirim. Eğer içimdeki öğretmen hissi bu yeni yöntemi onaylamıyorsa, sistemi kapatır ve kendi bildiğim yoldan şaşmam.', clinicalValue: 85, aiTag: 'pedagogical_guardian' },
          { label: 'Bu modern fikri hemen ekip arkadaşlarımla paylaşırım. Hep beraber bir toplantı yapıp, bu yeni tekniği uygulamanın risklerini ve faydalarını tartışmadan tek başıma karar verip uygulamam.', clinicalValue: 95, aiTag: 'collaborative_technologist' }
        ]
      },
      {
        id: 'stf_inn_2',
        text: 'Derste veri girişi için tablet kullanmanın, çocukla aranızdaki o "sıcak bağı" ve göz temasını azalttığını fark ettiniz. Çözümünüz?',
        options: [
          { label: 'Ders sırasında tableti tamamen ortadan kaldırırım; çocukla olan duygusal etkileşim her şeyden önemlidir. Verileri ders bittikten sonra, hafızamdaki taze bilgilerle sisteme eksiksiz girmeyi tercih ederim.', clinicalValue: 90, aiTag: 'human_centric_purist' },
          { label: 'Tableti dersin bir parçası yaparım. Veri girerken bunu çocuğa bir "puan kazanma oyunu" gibi gösterip, teknolojiyi aramızdaki bağı koparan bir engel değil, bizi birleştiren bir araç haline getiririm.', clinicalValue: 100, aiTag: 'adaptive_digital_coach' },
          { label: 'Sistemin hatasız çalışması için tableti kullanmaya devam ederim. Zamanla elim alışacağı için veri girişini hızlandırır, çocukla olan göz temasımı minimum düzeyde kesmeye çalışarak sürece uyum sağlarım.', clinicalValue: 80, aiTag: 'efficiency_focused_expert' }
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
        text: 'Bir vakanızın davranışına, başka branştan (örn: Ergoterapi) bir arkadaşınızın sizin tekniklerinize tamamen ters bir şekilde müdahale ettiğini gördünüz. İlk adımınız?',
        options: [
          { label: 'Bunu bir kavga sebebi değil, bir işbirliği fırsatı olarak görürüm. Hemen arkadaşımı bir kahve içmeye davet edip, iki yöntemin de verilerini masaya yatırarak çocuk için en doğru orta yolu bulmaya çalışırım.', clinicalValue: 100, aiTag: 'systemic_integrator' },
          { label: 'Arkadaşıma bu müdahalenin benim seans verilerimi bozduğunu nazikçe ama açıkça söylerim. Herkesin uzmanlık alanına saygı duyması gerektiğini ve davranış konusundaki sorumluluğun bende olduğunu hatırlatırım.', clinicalValue: 90, aiTag: 'boundary_guardian' },
          { label: 'Müdahalenin sonuçlarını bir süre izlerim. Eğer çocukta bir rahatlama ve iyileşme varsa, kendi yöntemlerimi sorgular ve arkadaştan neler öğrenebileceğime bakarım; hiyerarşiden çok çocuğun faydasını düşünürüm.', clinicalValue: 85, aiTag: 'pragmatic_collaborator' }
        ]
      },
      {
        id: 'stf_team_2',
        text: 'Yanınızdaki stajyer, verdiğiniz bir talimatın "gereksiz" olduğunu söyleyerek sizinle tartışmaya başladı. Tavrınız ne olur?',
        options: [
          { label: 'Stajyerin sorgulamasını gelişim isteği olarak görürüm. Onu yanıma alıp çocuk üzerindeki etkisini beraber gözlemlemeyi teklif ederim; neden bu kararı verdiğimi ona uygulamalı olarak gösterip bilgisini pekiştiririm.', clinicalValue: 100, aiTag: 'growth_oriented_mentor' },
          { label: 'Ona burada bir öğrenme sürecinde olduğunu ve kararların sorumluluğunun bende olduğunu hatırlatırım. Akademik tartışmaları seans içinde değil, ders sonrasındaki değerlendirme saatinde yapmamız gerektiğini belirtirim.', clinicalValue: 90, aiTag: 'hierarchical_leader' },
          { label: 'Eğer argümanı mantıklı geliyorsa hatamı kabul etmekten çekinmem. Stajyerin önünde "haklısın" diyerek kurum içinde dürüstlüğün ve hatadan öğrenmenin en büyük profesyonellik olduğunu ona bizzat gösteririm.', clinicalValue: 95, aiTag: 'intellectually_honest_mentor' }
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
          { label: 'Veliyi hemen sakinleşebileceği kapalı bir odaya davet ederim. Duygularını anladığımı belirttikten sonra, çocuğun ilk günkü haliyle bugünkü halini rakamlarla ve grafiklerle önüne koyarak durumu rasyonel bir şekilde yatıştırırım.', clinicalValue: 100, aiTag: 'rational_deescalator' },
          { label: 'Ailenin yaşadığı hayal kırıklığını ve yorgunluğu gerçekten hissettiğimi gösteririm. Önce sadece dinlerim ve "Haklısınız, çok yoruldunuz" diyerek rahatlamasını sağlarım; aramızdaki güven bağını onarmaya odaklanırım.', clinicalValue: 95, aiTag: 'empathetic_connector' },
          { label: 'Kurumun imajını korumak için veliyi idari ofise yönlendiririm. Bu tarz bir bağırmanın kurallarımıza aykırı olduğunu hatırlatır ve ancak sakinleştiği zaman profesyonel bir görüşme yapabileceğimizi net bir dille belirtirim.', clinicalValue: 85, aiTag: 'institutional_enforcer' }
        ]
      }
    ]
  }
];
