
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v12.0)
 * Güncelleme: Cevap dilleri, akademik jargondan arındırılarak "Uygulayıcı Dostu" hale getirilmiştir.
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

  // --- 3. TEKNO-PEDAGOJİK ADAPTASYON (DOĞALLAŞTIRILMIŞ) ---
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
      },
      {
        id: 'stf_inn_3',
        text: 'Seansın en önemli yerinde sistem çöktü ve tüm materyalleriniz tablette kilitli kaldı. O an ne yaparsınız?',
        options: [
          { label: 'Hiç panik yapmam; sınıftaki bardak, minder veya kağıt gibi basit nesnelerle hedeflerime uygun yeni bir oyun kurarım. İyi bir öğretmenin materyali teknolojide değil, kendi yaratıcılığındadır.', clinicalValue: 100, aiTag: 'resilient_innovator' },
          { label: 'Sistem düzelene kadar dersin akışını durdururum. Bu süreyi çocukla serbestçe oyun oynayıp bağ kurarak değerlendiririm; planlı dersin bozulmasının yarattığı gerginliği çocuğa hissettirmem.', clinicalValue: 85, aiTag: 'flexible_stabilizer' },
          { label: 'Hemen yönetime haber veririm. Yanlış veya eksik materyalle yapılacak bir dersin verimli olmayacağını, hata yapmaktansa dersin telafisinin yapılmasının daha profesyonelce olduğunu savunurum.', clinicalValue: 60, aiTag: 'procedural_integrity_focused' }
        ]
      }
    ]
  },

  // --- 4. MULTİDİSİPLİNER TAKIM VE MENTORLUK (DOĞALLAŞTIRILMIŞ) ---
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

  // --- 5. KRİZ LİDERLİĞİ VE VELİ DİPLOMASİSİ (DOĞALLAŞTIRILMIŞ) ---
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
      },
      {
        id: 'stf_cri_2',
        text: 'Öğrenci sınıfta aniden kendine zarar vermeye başladı (parmağını ısırıyor). O saniyedeki önceliğiniz?',
        options: [
          { label: 'En güvenli ve nazik tutuş tekniklerini kullanarak çocuğu ve kendimi korumaya alırım. Bu sırada hiçbir duygusal tepki vermem ki çocuk bu eylemi ilgi çekmek için kullanmasın; krizi teknik bir süreç gibi yönetirim.', clinicalValue: 100, aiTag: 'clinical_safety_expert' },
          { label: 'Çocuğu hemen yumuşak bir mindere alırım ve yumuşak bir ses tonuyla onu sakinleştirmeye çalışırım. Acısını anladığımı hissettiren hafif bir temasla sinir sistemini yatıştırıp güven vermeye odaklanırım.', clinicalValue: 90, aiTag: 'sensory_stabilizer' },
          { label: 'Odadaki uyaranları azaltır (ışığı kısmak vb.) ve gerekirse yardım çağırırım. Çocuğun kendine fiziksel bir hasar vermesini engelledikten sonra, bu olayın neden kaynaklandığını detaylıca not alıp ekipçe incelerim.', clinicalValue: 95, aiTag: 'procedural_crisis_manager' }
        ]
      },
      {
        id: 'stf_cri_3',
        text: 'Veli, çocuğun derslerdeki gelişiminin yavaşladığını görüp pes etmek üzere. Bu umutsuzluk krizini nasıl aşarsınız?',
        options: [
          { label: 'Çocuğun öğrenme sürecinde bazen "duraklama dönemleri" olabileceğini, bunun aslında bir sıçrama öncesi hazırlık olduğunu anlatırım. Planı yenileyerek aileye "çok küçük ama hızlı" başarılar yaşatacak yeni hedefler belirlerim.', clinicalValue: 100, aiTag: 'strategic_optimist' },
          { label: 'Durumu tüm çıplaklığıyla paylaşırım. Boş umut vermek yerine gerçekleri söylerim ve "belki akademik değil, yaşam kalitesini artıracak öz bakım becerilerine mi odaklansak?" diyerek dürüst bir yol ayrımı teklif ederim.', clinicalValue: 85, aiTag: 'transparent_realist' },
          { label: 'Başka bir uzmandan veya süpervizörden görüş isterim. Velinin önünde bu görüşü paylaşarak sisteme "üçüncü bir gözün" dahil olmasının güven tazeleyeceğine inanırım; süreci kurumsal bir dayanışma ile aşmaya çalışırım.', clinicalValue: 95, aiTag: 'collaborative_solutionist' }
        ]
      }
    ]
  },

  // --- 6. AKADEMİK MÜDAHALE VE ÇÖZÜMLER (Eskisiyle devam eder...) ---
  {
    id: 'academic_neuro_pedagogy',
    title: 'Akademik Müdahale ve Çözümler',
    description: 'Okuma-yazma ve matematik öğretiminde yaşanan tıkanıklıklara yaklaşımlar.',
    icon: '📝',
    category: 'clinical',
    questions: [
      {
        id: 'stf_acad_1',
        text: 'Öğrenci harfleri tanıyor ama sesleri birleştirip hece yapamıyor. Ne yaparsınız?',
        options: [
          { label: 'Kağıt kalemi bir kenara bırakırım. Sadece seslerle kafiyeli oyunlar oynatıp, seslerin birleşme mantığını oyun üzerinden çocuğun zihnine yerleştirmeye çalışırım.', clinicalValue: 100, aiTag: 'phonological_remediation' },
          { label: 'Harfleri somut nesnelere benzetirim (örn: S harfi yılan gibi). Bu görsel resimler üzerinden birleştirme aşamasını tamamen görsel bir hafıza oyununa çeviririm.', clinicalValue: 60, aiTag: 'compensatory_visual_coding' },
          { label: 'Her doğru birleştirmede sevdiği bir ödülü vererek deneme sayısını artırırım. Çok pratik yaparak bu tıkanıklığı zamanla aşacağına inanırım.', clinicalValue: 40, aiTag: 'behavioral_drill' }
        ]
      }
    ]
  }
];
