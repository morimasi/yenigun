
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v14.0)
 * Güncelleme: Multidisipliner Takım ve Mentorluk modülü "İnsan Odaklı ve Sade" dile geçirilmiştir.
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
        text: 'Veli sizi "aileden biri" gibi gördüğünü söyleyerek evdeki özel bir akşam yemeğine davet etti. Bu samimi teklif karşısındaki duruşunuz ne olur?',
        options: [
          { label: 'Kurum kuralları ve mesleki sınırlarım gereği, ailelerle ders saatleri dışında sosyal görüşme yapmamın ileride vereceğim eğitim kararlarını etkileyebileceğini nazikçe anlatır ve daveti kibarca reddederim. Aramızdaki saygın mesafeyi korumayı seçerim.', clinicalValue: 100, aiTag: 'formal_purist' },
          { label: 'Aile ile kurulan güven bağını güçlendirmek ve çocuğu kendi doğal ev ortamında gözlemleme şansı bulmak adına bu davete bir kereliğine katılırım. Ancak bunun bir alışkanlığa dönüşmemesi için sonraki süreçte sınırlarıma çok daha dikkat ederim.', clinicalValue: 90, aiTag: 'relational_empathetic' },
          { label: 'Bu tarz bireysel davetleri kabul etmem ancak aileyi kırmamak için kurumun düzenlediği genel toplantı, piknik veya çay saatleri gibi kontrollü ortamlarda daha fazla vakit geçirmeyi teklif ederim. İlişkiyi kişisel değil, kurumsal bir düzlemde tutmaya çalışırım.', clinicalValue: 95, aiTag: 'strategic_mediator' }
        ]
      }
    ]
  },

  // --- 4. MULTİDİSİPLİNER TAKIM VE MENTORLUK (SADELEŞTİRİLMİŞ) ---
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
          { label: 'Bunu bir tartışma konusu değil, çocuk için yeni bir fırsat olarak görürüm. Hemen arkadaşımı çaya davet edip, "ikimiz de farklı bir şey yapıyoruz, gel çocuk için en iyi orta yolu bulalım" diyerek ortak bir plan yapmaya çalışırım.', clinicalValue: 100, aiTag: 'systemic_integrator' },
          { label: 'Arkadaşıma bu müdahalenin benim seanslarımı zora soktuğunu nazikçe ama net bir şekilde söylerim. Herkesin uzmanlık alanına saygı duyması gerektiğini, vakanın davranış takibi sorumluluğunun bende olduğunu hatırlatırım.', clinicalValue: 90, aiTag: 'boundary_guardian' },
          { label: 'Bir süre müdahalenin sonucunu izlerim; eğer çocuk daha iyiye gidiyorsa hiyerarşiyi bir kenara bırakır ve arkadaşın yönteminden ne öğrenebileceğime bakarım. Benim haklı çıkmamdan çok çocuğun gelişmesi önemlidir.', clinicalValue: 85, aiTag: 'pragmatic_collaborator' }
        ]
      },
      {
        id: 'stf_team_2',
        text: 'Sorumluluğunuzdaki bir stajyer, verdiğiniz bir talimatın "gereksiz veya yanlış" olduğunu söyleyerek sizinle tartışmaya girdi. Tavrınız nedir?',
        options: [
          { label: 'Stajyerin bu merakını ve sorgulamasını hoş karşılarım. Onu yanıma alıp çocuk üzerindeki etkisini beraber izlemeyi teklif ederim; neden bu kararı verdiğimi ona uygulamalı göstererek ikna ederim.', clinicalValue: 100, aiTag: 'growth_oriented_mentor' },
          { label: 'Ona burada bir öğrenme sürecinde olduğunu, kararların sorumluluğunun bende olduğunu tatlı-sert bir dille hatırlatırım. Bu tarz tartışmaların seans içinde değil, ders sonrasındaki değerlendirme saatinde olması gerektiğini belirtirim.', clinicalValue: 90, aiTag: 'hierarchical_leader' },
          { label: 'Eğer sunduğu fikir mantıklıysa "haklısın" demekten çekinmem. Stajyerin önünde bile olsa hatamı kabul ederek, kurum içinde dürüstlüğün ve hatadan öğrenmenin en büyük profesyonellik olduğunu ona bizzat yaşatırım.', clinicalValue: 95, aiTag: 'intellectually_honest_mentor' }
        ]
      },
      {
        id: 'stf_team_3',
        text: 'Bir vaka toplantısında tüm ekip başarısız giden bir süreçten dolayı sizi suçluyor. Kendinizi nasıl regüle edersiniz?',
        options: [
          { label: 'Eleştirileri kişisel bir saldırı gibi almam; "Demek ki göremediğim bir kör nokta var" diye düşünürüm. Suçlayan arkadaşlarıma "Siz benim yerimde olsanız bu tıkanıklığı aşmak için ne yapardınız?" diye sorarak odağı çözüme çekerim.', clinicalValue: 100, aiTag: 'resilient_professional' },
          { label: 'Hemen savunmaya geçmem; elimdeki seans kayıtlarını ve gelişim grafiklerini göstererek kararlarımın nedenlerini ispatlarım. Duygularla değil, verilerle konuşarak mesleki itibarımı korumaya odaklanırım.', clinicalValue: 90, aiTag: 'analytical_defender' },
          { label: 'Önce ekibin bu stresli halini anladığımı söylerim; "Hepimiz çocuk için endişeliyiz, haklısınız" diyerek ortamı yumuşatırım. Ardından sorumluluğu paylaşmayı ve yeni bir yol haritası çizmeyi teklif ederim.', clinicalValue: 95, aiTag: 'harmonizing_stabilizer' }
        ]
      },
      {
        id: 'stf_team_4',
        text: 'Kuruma yeni gelen ve sizden daha kıdemli birinin, sizin çalışma sisteminizi "eski ve yavaş" bulduğunu fark ettiniz. Aksiyonunuz?',
        options: [
          { label: 'Tecrübesine saygı duyarım ve "Bana bu yeni sistemi öğretir misiniz?" diye sorarım. Onun getirdiği yeniliği kurumun hafızasıyla birleştirip kendimi geliştirmek için bir fırsat olarak kullanırım.', clinicalValue: 100, aiTag: 'lifelong_learner' },
          { label: 'Kurumumuzun belli bir çalışma standardı olduğunu ve bu düzenin güvenli olduğunu anlatırım. Yeni fikirlerini önce akademik kurulda paylaşması gerektiğini söyleyerek kurulu düzenin bozulmasını engellerim.', clinicalValue: 85, aiTag: 'standard_guardian' },
          { label: 'Kendi sistemimin başarılarını rakamlarla ortaya koyarım; yeni gelen arkadaşın önerisi ancak benimkinden daha hızlı sonuç veriyorsa denemeye açık olduğumu belirterek verimlilik üzerinden konuşurum.', clinicalValue: 90, aiTag: 'efficiency_focused' }
        ]
      },
      {
        id: 'stf_team_5',
        text: 'Çok yakın bir mesai arkadaşınızın tükenmişlik (burnout) yaşadığını ve çocuklara karşı çok "mekanik" davrandığını gördünüz. Ne yaparsınız?',
        options: [
          { label: 'Arkadaşımı akşam bir kahveye davet ederim; "Seni son zamanlarda biraz yorgun görüyorum, bir sorun mu var?" diyerek dertleşirim. Ona destek olmaya ve gerekirse yönetimle iş yükü hakkında konuşmaya teşvik ederim.', clinicalValue: 100, aiTag: 'empathetic_ally' },
          { label: 'Çocukların eğitim kalitesinin her şeyden önemli olduğuna inanırım. Durumu isim vermeden yönetime "ekip genelinde bir enerji düşüklüğü var" diye raporlarım ve acilen motivasyon odaklı bir toplantı yapılmasını sağlarım.', clinicalValue: 90, aiTag: 'clinical_watchdog' },
          { label: 'Arkadaşıma işiyle ilgili doğrudan karışmam ama kendi seanslarımdaki enerjiyi artırarak ona örnek olmaya çalışırım. Onu izlemeye devam ederim, sadece çocukların güvenliğini tehlikeye sokacak bir şey görürsem müdahale ederim.', clinicalValue: 80, aiTag: 'non_interventive_observer' }
        ]
      },
      {
        id: 'stf_team_6',
        text: 'Bir projede liderlik size verildi ama diğer arkadaşlar size destek vermiyor, işten kaçıyorlar. Liderlik tarzınız ne olur?',
        options: [
          { label: 'Arkadaşların neden soğuk davrandığını anlamaya çalışırım. Her birine en iyi yaptıkları işi görev olarak verir ve onları "projenin ortağı" olduklarına ikna ederek takımı tekrar bir araya getiririm.', clinicalValue: 100, aiTag: 'inclusive_leader' },
          { label: 'Projenin takvimini ve kurumun beklentilerini herkese yazılı olarak hatırlatırım. Kimin neyi yapacağını netleştirip disiplini elden bırakmam; projenin selameti için gerekirse otoritemi kullanırım.', clinicalValue: 85, aiTag: 'direct_task_master' },
          { label: 'İşten kaçanlarla tek tek konuşurum. Kişisel sorunları mı var yoksa projeye mi inanmıyorlar analiz ederim. Sorunları tek tek çözerek ekibi ikna yoluyla arkama almaya odaklanırım.', clinicalValue: 95, aiTag: 'diplomatic_negotiator' }
        ]
      },
      {
        id: 'stf_team_7',
        text: 'Bir stajyerin, veliyle kurum dışında gizli yazışmalar yaptığını (etik sınırı aştığını) tesadüfen duydunuz. Tepkiniz?',
        options: [
          { label: 'Hemen durumu staj koordinatörüne ve yönetime bildiririm. Bu tarz samimiyetlerin hem kurumun imajına hem de çocuğun eğitimine zarar vereceğini bildiğim için etik sınırları asla esnetmem.', clinicalValue: 100, aiTag: 'uncompromising_ethics_advocate' },
          { label: 'Stajyeri odaya çekip bunun neden çok tehlikeli olduğunu abi/abla tavrıyla anlatırım. Veli ile aradaki mesafenin neden korunması gerektiğini ona uzun uzun açıklar, hatasından ders çıkarmasını sağladıktan sonra durumu kontrollü raporlarım.', clinicalValue: 95, aiTag: 'transformative_mentor' },
          { label: 'Stajyeri korkutmak yerine bir sonraki genel toplantıda "Sosyal Medya ve Veli Mesafesi" konusunu genel bir madde olarak açtırırım. Stajyerin kendi hatasını kimse rezil olmadan anlamasını sağlar, durumu dolaylı yoldan çözerim.', clinicalValue: 85, aiTag: 'indirect_stabilizer' }
        ]
      },
      {
        id: 'stf_team_8',
        text: 'Yönetim, vakanın gelişimi için istediğiniz o "pahalı" materyali almadı. Ekibi bu moral bozukluğundan nasıl çıkarırsınız?',
        options: [
          { label: '"Materyal yoksa yaratıcılık var" diyerek ekibi toplarım. O pahalı aletin yapacağı işi evdeki malzemelerle nasıl simüle edebileceğimize dair bir beyin fırtınası yapar, imkansızlığı bir oyuna çeviririm.', clinicalValue: 100, aiTag: 'resourceful_optimist' },
          { label: 'Yönetimin bu kararının çocuklara ne kaybettireceğine dair verilerle dolu sert bir "Klinik Risk Raporu" hazırlarım. Ekibime "bu bizim hakkımız" diyerek talebimizi kabul ettirene kadar mücadele etmeyi öneririm.', clinicalValue: 90, aiTag: 'strategic_advocate' },
          { label: 'Ekibe kurumun ekonomik durumunu mantıklı bir dille anlatırım; "Şu an şartlar bu, elimizdekilerle en iyisini yapalım" diyerek odağı moral bozukluğundan mevcut seansların kalitesine çekmeye çalışırım.', clinicalValue: 85, aiTag: 'institutional_realist' }
        ]
      },
      {
        id: 'stf_team_9',
        text: 'Bir arkadaşınızın sizin bir vaka üzerindeki fikrinizi toplantıda "kendi fikriymiş gibi" anlattığını duydunuz. Tavrınız?',
        options: [
          { label: 'Bunu bir "ego" meselesi değil, "akademik dürüstlük" sorunu olarak görürüm. Arkadaşımla baş başa konuşur ve bilgiyi paylaşırken kaynağını belirtmenin ekip güveni için ne kadar önemli olduğunu tatlı dille söylerim.', clinicalValue: 100, aiTag: 'ethical_purist' },
          { label: 'Fikrin benden çıkmış olmasından ziyade çocuğa faydalı olmasına bakarım. Eğer yöntem uygulanıyor ve çocuk ilerliyorsa sessiz kalırım; ancak bir dahaki sefere fikirlerimi daha resmi kanallarla paylaşmayı seçerim.', clinicalValue: 80, aiTag: 'detached_pragmatist' },
          { label: 'Toplantı bitmeden hemen araya girip "Evet, X arkadaşımızın dediği bu fikri daha önce beraber konuşurken şu detayını da eklemiştik..." diyerek hem arkadaşı bozmadan hem de fikrin ortağı olduğumu herkese hissettiririm.', clinicalValue: 90, aiTag: 'socially_intelligent_competitor' }
        ]
      },
      {
        id: 'stf_team_10',
        text: 'Eğittiğiniz bir uzmanın başarısı, sizi gölgede bırakmaya başladı. İçinizden ne geçer?',
        options: [
          { label: 'Bu durumun benim "iyi bir mentor" olduğumun en büyük kanıtı olduğunu düşünür ve gurur duyarım. Onu daha üst pozisyonlara taşıması için yönetime bizzat referans olur, koltuğumu devretmeye hazır bir lider gibi davranırım.', clinicalValue: 100, aiTag: 'master_mentor' },
          { label: 'Kurum içindeki bu rekabetin kaliteyi artıracağını düşünürüm. Onun başarısından ilham alarak kendi eksiklerimi kapatır ve "usta ile usta" arasındaki o verimli yarışa ben de katılırım.', clinicalValue: 95, aiTag: 'growth_mindset_professional' },
          { label: 'Onun başarısını kurumun bir reklam yüzü haline getirir ve dış dünyaya pazarlarım. Kişisel rekabetten ziyade kurumun ismini ve kalitesini büyütmeye odaklanan bir yönetici kafasıyla hareket ederim.', clinicalValue: 90, aiTag: 'corporate_strategist' }
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
          { label: 'Kurumun imajını korumak için veliyi idari ofise yönlendiririm. Bu tarz bir bağırmanın kurallarımıza aykırı olduğunu hatırlatır ve ancak sakinleştiği zaman profesyonel bir görüşme yapabilecelerimizi belirtirim.', clinicalValue: 85, aiTag: 'institutional_enforcer' }
        ]
      }
    ]
  }
];
