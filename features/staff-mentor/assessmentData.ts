
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v10.0)
 * Güncelleme: Multidisipliner Takım ve Mentorluk modülü "Profesyonel Kimlik Analizi" formatına geçirilmiştir.
 */
export const MODULAR_BATTERIES: AssessmentBattery[] = [
  // --- 1. İLERİ ABA VE KLİNİK KARAR MEKANİZMALARI ---
  {
    id: 'aba_advanced_mastery',
    title: 'İleri ABA ve Klinik Karar Mechanismaları',
    description: 'Veri sadakati, sönme prosedürleri ve kompleks davranış manipülasyonu.',
    icon: '📊',
    category: 'clinical',
    questions: [
      {
        id: 'stf_aba_1',
        text: 'Öğrenci seans sırasında çok şiddetli bir sönme patlaması (burst) yaşıyor. Ortam güvenli ancak kurum müdürü gürültü nedeniyle seansı sonlandırmanızı istiyor. Kararınız?',
        options: [
          { label: 'Sönme prosedürünün bu aşamada kesilmesinin davranışı daha dirençli hale getireceğini, emeği boşa çıkaracağını nazikçe açıklar ve seansa devam ederim.', clinicalValue: 100, aiTag: 'clinical_integrity' },
          { label: 'Kurum müdürünün talimatına uyar seansı bitiririm; kurumsal hiyerarşi ve diğer sınıfların huzuru klinik süreçten daha önceliklidir.', clinicalValue: 30, aiTag: 'hierarchical_compliance' },
          { label: 'Sessiz kalması için çocuğa o an talep etmediği bir ödül vererek sakinleştiririm ve seansı kontrol altında bitiririm.', clinicalValue: 0, aiTag: 'unintentional_reinforcement' }
        ]
      },
      {
        id: 'stf_aba_2',
        text: 'Grafik analizinde verilerin çok değişken (Variable) olduğunu gördünüz. Bu durumun arkasındaki ana klinik şüpheniz nedir?',
        options: [
          { label: 'Uygulayıcılar arası güvenirlik (IOA) düşüktür; her öğretmen farklı puanladığı için veri setinde teknik sapma oluşmuştur.', clinicalValue: 100, aiTag: 'ioa_audit_focus' },
          { label: 'Çocuğun nörolojik dalgalanması veya o günkü motivasyonel durumu (MO) veriyi doğrudan etkilemiştir.', clinicalValue: 50, aiTag: 'biological_attribution' },
          { label: 'Eğitim materyalleri çocuk için çekiciliğini yitirmiştir, pekiştireç havuzunun güncellenmesi gerekir.', clinicalValue: 40, aiTag: 'environmental_fix' }
        ]
      },
      {
        id: 'stf_aba_3',
        text: 'Vaka "İlgi EldE Etme" işlevli bir davranış sergilerken, stajyerin yanlışlıkla çocuğa gülümsediğini fark ettiniz. Aksiyonunuz?',
        options: [
          { label: 'Hemen o an stajyere bakmayarak "görmezden gelme" modellemesi yapar, pekiştirmeyi nötralize etmeye çalışırım.', clinicalValue: 100, aiTag: 'immediate_modeling' },
          { label: 'Seans sonu stajyeri sertçe uyarırım ve raporuna bu hatayı teknik bir not olarak geçerim.', clinicalValue: 60, aiTag: 'delayed_correction' },
          { label: 'Gülümsemenin terapötik bağı güçlendirdiğini düşünerek müdahale etmem, seansı akışına bırakırım.', clinicalValue: 10, aiTag: 'clinical_laxity' }
        ]
      },
      {
        id: 'stf_aba_4',
        text: 'Pekiştireç olarak kullanılan materyalin çocukta doygunluk (Satiation) yarattığını gördünüz. Alternatif hamleniz?',
        options: [
          { label: 'Pekiştireç eşlemesi (Reinforcer Pairing) yaparak sosyal pekiştireçlerin değerini artırmaya odaklanırım.', clinicalValue: 100, aiTag: 'advanced_pairing_skill' },
          { label: 'Deprivasyon (yoksunluk) stratejisi uygulayarak aynı materyalin değerini yapay olarak artırmaya çalışırım.', clinicalValue: 50, aiTag: 'manipulative_aba' },
          { label: 'Yeni bir somut pekiştireç arayışına girerim, çocuğu farklı oyuncaklarla denerim.', clinicalValue: 70, aiTag: 'standard_substitution' }
        ]
      },
      {
        id: 'stf_aba_5',
        text: 'DTT (Ayrık Denemelerle Öğretim) oturumunda öğrenci 5 deneme üst üste başarısız oldu. İpucu hiyerarşisinde hamleniz?',
        options: [
          { label: 'En yoğun ipucuna (Full Physical) geri dönüp başarıyı garantiler, hata deseninin (error pattern) yerleşmesini engellerim.', clinicalValue: 100, aiTag: 'prompt_fidelity' },
          { label: 'Denemeyi sonlandırıp çocuğun daha iyi olduğu farklı bir beceriye geçerek motivasyonu korurum.', clinicalValue: 40, aiTag: 'avoidance_strategy' },
          { label: 'Aynı ipucu seviyesinde ısrar ederim, öğrencinin deneme-yanılma yoluyla bulmasını beklerim.', clinicalValue: 10, aiTag: 'instructional_rigidity' }
        ]
      },
      {
        id: 'stf_aba_6',
        text: 'Karmaşık bir zincirleme beceride (örn: El yıkama) çocuk orta aşamada takılıyor. Kararınız?',
        options: [
          { label: 'Öğrenci başarı odaklıysa ve son adımı yapınca pekişiyorsa Geriye Zincirleme (Backward) modelini seçerim.', clinicalValue: 100, aiTag: 'clinical_functional_logic' },
          { label: 'Tüm aşamaları aynı anda çalışarak (Total Task) genel bir aşinalık inşa etmeye odaklanırım.', clinicalValue: 70, aiTag: 'generalist_approach' },
          { label: 'Beceriyi küçük parçalara böler, her parçayı ayrı birer hedef olarak çalışırım.', clinicalValue: 50, aiTag: 'extreme_task_analysis' }
        ]
      },
      {
        id: 'stf_aba_7',
        text: 'VB-MAPP verilerini girerken, vakanın aslında yapamadığı bir maddeyi ailenin ısrarıyla "yaptı" olarak işaretleme talebi geldi. Kararınız?',
        options: [
          { label: 'Reddederim; yanlış veri üzerine inşa edilen eğitim planının vaka geleceğini karartacak bir klinik suç olduğunu açıklarım.', clinicalValue: 100, aiTag: 'ethical_fortress' },
          { label: 'Ailenin motivasyonunu bozmamak için o maddeyi "geçti" sayar, ancak seanslarda gizlice o konuyu çalışmaya devam ederim.', clinicalValue: 20, aiTag: 'dishonest_clinical_management' },
          { label: 'Müdüre danışırım, kurumsal karara göre hareket ederim.', clinicalValue: 40, aiTag: 'responsibility_abdication' }
        ]
      },
      {
        id: 'stf_aba_8',
        text: 'Yeni başlayan bir vakada "Hatalı Öğretim" yerine neden "Hatasız Öğretim" (Errorless) tercih edilmelidir?',
        options: [
          { label: 'Hata birikimini engelleyerek öğrencinin motivasyonel direncini kırmamak ve öğrenme hızını maksimize etmek için.', clinicalValue: 100, aiTag: 'pedagogical_foresight' },
          { label: 'Dersin daha hızlı bitmesini ve velinin anlık başarı görmesini sağlamak için.', clinicalValue: 20, aiTag: 'performance_bias' },
          { label: 'Daha az öğretim materyali ve ipucu gerektirdiği için.', clinicalValue: 10, aiTag: 'resource_saving_focus' }
        ]
      },
      {
        id: 'stf_aba_9',
        text: 'Öğrencinin serbest zaman oyununda, seans hedeflerinden birini kendiligün sergilediğini gördünüz. Ne yaparsınız?',
        options: [
          { label: 'Hemen bir kağıda not alıp daha sonra "Fırsat Öğretimi" (NET) verisi olarak sisteme mühürlerim.', clinicalValue: 100, aiTag: 'clinical_vigilance' },
          { label: 'Müdahale etmem, sadece izlerim; yapılandırılmış seans dışındaki veriler güvenilir değildir.', clinicalValue: 30, aiTag: 'bureaucratic_rigidity' },
          { label: 'Ailesine anlatırım ama veriyi sisteme girmem.', clinicalValue: 50, aiTag: 'informal_reporting' }
        ]
      },
      {
        id: 'stf_aba_10',
        text: 'Bir davranışın işlevini belirlemek için ABC kaydı tutarken "Sonuç" kısmına ne yazarsınız?',
        options: [
          { label: 'Davranıştan hemen sonra çevrede değişen somut durumu (örn: oyuncak verildi, kaçmasına izin verildi).', clinicalValue: 100, aiTag: 'objective_observation_mastery' },
          { label: 'Çocuğun o anki içsel niyetini ve ne hissettiğine dair kendi yorumumu.', clinicalValue: 10, aiTag: 'subjective_inference' },
          { label: 'Öğretmenin o an çocuğa verdiği öğüdü veya yaptığı uyarıyı.', clinicalValue: 40, aiTag: 'instructional_bias' }
        ]
      }
    ]
  },

  // --- 2. ETİK TAHKİM VE PROFESYONEL MESAFE ---
  {
    id: 'ethics_and_boundaries',
    title: 'Etik Tahkim ve Profesyonel Mesafe',
    description: 'Çıkar çatışmaları, gizlilik ve profesyonel sınır diplomasisi.',
    icon: '⚖️',
    category: 'ethics',
    questions: [
      {
        id: 'stf_eth_1',
        text: 'Veli, size özel bir akşam yemeği daveti gönderdi ve bu daveti "aile içi bir dayanışma yemeği" olarak tanımladı. Uzman kimliğinizle bu sınıra yaklaşımınız ne olur?',
        options: [
          { label: 'Kurum politikası ve klinik etik kuralları gereği, vaka sahipleriyle profesyonel saatler dışında sosyal ilişki kurmamın, gelecekteki klinik kararlarımın tarafsızlığını zedeleyebileceğini nazikçe açıklar ve daveti kesinlikle reddederim.', clinicalValue: 100, aiTag: 'formal_purist' },
          { label: 'Terapötik ittifakı (therapeutic alliance) güçlendirmek ve vakanın ev içindeki doğal dinamiklerini gözlemlemek adına, bir kereliğine ve sadece sınırlı bir süre için katılırım; ancak bu durumun bir alışkanlığa dönüşmemesi için sonraki süreçte net sınırlar koyarım.', clinicalValue: 85, aiTag: 'relational_empathetic' },
          { label: 'Daveti nezaketen kabul etmem ancak aileyi kırmadan, kurumun düzenlediği genel veli toplantıları veya piknikler gibi "yarı-sosyal" ama kontrollü ortamlarda daha fazla vakit geçirmeyi teklif ederek ilişkiyi profesyonel bir zeminde tutmaya çalışırım.', clinicalValue: 90, aiTag: 'strategic_mediator' }
        ]
      },
      {
        id: 'stf_eth_2',
        text: 'Çok güvendiğiniz bir veli, kurumun maaş politikasından şikayet ederek çocuğuna gizlice evde özel ders vermeniz için size oldukça yüksek bir meblağ teklif etti. Karar mekanizmanız nasıl işler?',
        options: [
          { label: 'Bu teklifi doğrudan reddederim; aynı vaka üzerinde hem kurumsal hem de bireysel çıkar ilişkisi kurmanın (Dual Relationship), klinik öncelikleri ve etik sadakati bozacağını, bunun meslek onurumla bağdaşmayacağını aileye net bir dille belirtirim.', clinicalValue: 100, aiTag: 'uncompromising_ethics' },
          { label: 'Durumu derhal kurum yönetimine bildiririm; eğer kurumun bu konuda bir esnekliği varsa veya bu hizmet kurum çatısı altında "ek seans" olarak verilebiliyorsa, süreci tamamen şeffaf ve kurumsal bir denetim mekanizması dahilinde yürütmeyi şart koşarım.', clinicalValue: 95, aiTag: 'transparent_institutionalist' },
          { label: 'Teklifi kurumun bilgisi dışında değerlendirmem ancak vakanın yoğunlaştırılmış eğitime ihtiyacı olduğu kanısındaysam, yönetime vaka için ek seanslar veya farklı bir uzman desteği önererek ailenin talebini yasal ve akademik bir çözüme yönlendiririm.', clinicalValue: 80, aiTag: 'pragmatic_clinical_advocate' }
        ]
      },
      {
        id: 'stf_eth_3',
        text: 'Seans esnasında vakanın vücudunda fiziksel bir travma emaresi gördünüz; veli "ev kazası" olduğunu söylüyor ancak klinik sezgileriniz sizi şüphelendiriyor. Adımınız ne olur?',
        options: [
          { label: 'Şüphemi bir kenara bırakmadan, child koruma kanunları ve etik sorumluluğum gereği durumu derhal klinik direktöre ve ilgili yasal birimlere raporlarım; vaka güvenliğini korumanın, aileyle olan güven ilişkisinden daha kutsal olduğunu savunurum.', clinicalValue: 100, aiTag: 'legal_watchdog' },
          { label: 'Öncelikle aileyi sakin bir odaya alır ve empatik bir sorgulama ile olayın detaylarını öğrenmeye çalışırım; eğer ailenin desteğe ihtiyacı olduğunu veya bir kaza olduğunu hissedersem, durumu kurumsal bir "sosyal hizmet takibi" dosyasına alarak aileye rehberlik ederim.', clinicalValue: 85, aiTag: 'supportive_counselor' },
          { label: 'Bulguları objektif bir şekilde fotoğraflayıp vaka dosyasına mühürlü not olarak geçerim ve sonraki 3 seans boyunca vakanın fiziksel ve duygusal durumunu yakından izleyerek "kanıt toplama" sürecine girerim; aceleci bir suçlama yerine emin olmayı beklerim.', clinicalValue: 90, aiTag: 'methodical_observer' }
        ]
      },
      {
        id: 'stf_eth_4',
        text: 'Kişisel sosyal medya hesabınızda, vakanın başarısını ve size olan sevgisini gösteren bir fotoğrafı (ailenin sözlü onayıyla) paylaşma konusundaki duruşunuz nedir?',
        options: [
          { label: 'Paylaşım yapmayı meslek etiğine aykırı bulurum; çocuğun dijital ayak izini ve gelecekteki mahremiyetini korumak, ailenin o anki duygusal onayından daha önemlidir; profesyonel kimliğim ile dijital kimliğimin arasına kesin bir duvar örerim.', clinicalValue: 100, aiTag: 'privacy_purist' },
          { label: 'Eğitimin etkisini ve özel eğitimin toplumsal farkındalığını artırmak amacıyla, vakanın yüzünü net göstermeden ve ailenin yazılı onayıyla paylaşabilirim; ancak bu paylaşımı kendimi öne çıkarmak için değil, akademik bir başarı hikayesi olarak kurgularım.', clinicalValue: 85, aiTag: 'awareness_advocate' },
          { label: 'Ailenin rızası varsa ve bu paylaşım ailenin kuruma olan aidiyetini artırıyorsa, kurumun resmi sosyal medya birimine bu içeriği gönderir ve sadece kurumsal hesap üzerinden, profesyonel bir editoryal süreçle paylaşılmasını desteklerim.', clinicalValue: 95, aiTag: 'corporate_safety_expert' }
        ]
      },
      {
        id: 'stf_eth_5',
        text: 'Çok yakın bir meslektaşınızın seanslara sürekli 5-10 dakika geç girdiğini ancak raporlarda süreyi tam gösterdiğini fark ettiniz. Bu durumu nasıl yönetirsiniz?',
        options: [
          { label: 'Durumu bir ekip toplantısında isim vermeden genel bir "etik ihlal uyarısı" olarak gündeme getiririm ve kurumsal raporlama sadakatinin, çocukların hak kaybı olduğunu vurgulayarak sistemin oto-kontrol mekanizmasını tetiklerim.', clinicalValue: 90, aiTag: 'systemic_regulator' },
          { label: 'Arkadaşımla birebirde ve dostane bir dille konuşarak, bu durumun hem kendi profesyonelliğine hem de çocukların gelişimine zarar verdiğini söylerim; eğer davranış devam ederse kurumun etik kuruluna veya direktörüne durumu yazılı raporlarım.', clinicalValue: 100, aiTag: 'peer_supervisor' },
          { label: 'Arkadaşımın yaşadığı olası tükenmişliği veya özel hayatındaki sorunları analiz ederim; ona iş yükünü yönetmesi için destek teklif ederken, seans sürelerini kompanse etmesi için akademik bir program revizyonu yapması konusunda rehberlik ederim.', clinicalValue: 85, aiTag: 'empathetic_leader' }
        ]
      },
      {
        id: 'stf_eth_6',
        text: 'Veli, başka bir merkezde çalışan bir meslektaşınız hakkında olumsuz ve etik olmayan iddialarda bulunuyor. Tavrınız?',
        options: [
          { label: 'Meslek etiği gereği, meslektaşlarım hakkında veli önünde asla olumlu ya da olumsuz bir yorum yapmam; veliye sadece bizim merkezimizdeki klinik süreçlere odaklanmamız gerektiğini söyleyerek konuyu profesyonelce kapatırım.', clinicalValue: 100, aiTag: 'ethical_neutralist' },
          { label: 'İddialar vahimse (örn: istismar), meslek örgütlerini korumak adına iddiaları dikkatle dinler ancak yorum yapmaz, veliyi ilgili meslek kuruluşuna şikayet etmesi için yönlendiririm; etik bir duruşun sadece kendi kurumumu değil, tüm mesleği korumak olduğuna inanırım.', clinicalValue: 95, aiTag: 'professional_guild_protector' },
          { label: 'Velinin bu şikayetini, o meslektaşla yaşadığı "iletişim kazası" üzerinden analiz eder ve bizdeki süreçte benzer bir sorun yaşamamak için neye ihtiyaç duyduğunu sorgularım; şikayeti vaka yönetim stratejim için bir veri olarak kullanırım.', clinicalValue: 85, aiTag: 'analytical_clinical_manager' }
        ]
      },
      {
        id: 'stf_eth_7',
        text: 'Eski bir iş arkadaşınız, mevcut kurumunuzdaki kritik vaka verilerini ve metodolojisini, yeni açacağı merkezi için sizden rica etti. Kararınız?',
        options: [
          { label: 'Bu talebi bir "endüstriyel casusluk" ve kurumsal sadakatsizlik olarak görür ve kesinlikle reddederim; kurumun fikri mülkiyetini korumanın mesleki ahlakın temel bir parçası olduğunu bilir ve gerekirse bu durumu yönetime raporlarım.', clinicalValue: 100, aiTag: 'institutional_loyalist' },
          { label: 'Paylaşılan verinin çocuklara faydalı olacağını düşünsem dahi, yasal ve sözleşmesel engelleri hatırlatarak arkadaşımı kurumsal bir işbirliği protokolüne yönlendiririm; bilginin paylaşımını ancak yasal ve şeffaf bir zeminde kabul ederim.', clinicalValue: 90, aiTag: 'procedural_integrity' },
          { label: 'Kişisel olarak geliştirdiğim ve kurumun malı olmayan genel metodolojik bilgileri paylaşmakta sakınca görmem ancak kuruma ait vaka listesi veya gizli veri setlerini asla paylaşmam; kişisel bilgi ile kurumsal veriyi birbirinden keskin hatlarla ayırırım.', clinicalValue: 80, aiTag: 'balanced_individualist' }
        ]
      },
      {
        id: 'stf_eth_8',
        text: 'Vakanın gelişimi durma noktasına geldiği halde, yönetimin size "veliyi kurumda tutmak için raporu daha pozitif gösterin" dediği bir senaryoda tavrınız?',
        options: [
          { label: 'Akademik raporun bir "bilimsel döküman" olduğunu ve gerçeğe aykırı her beyanın vakaya zaman kaybettirdiğini savunarak bu talebi reddederim; liyakatimin kurumun ticari çıkarlarından daha üstün olduğunu açıkça ifade ederim.', clinicalValue: 100, aiTag: 'academic_realist' },
          { label: 'Mevcut durumu (plato dönemini) tüm çıplaklığıyla yazarım ancak rapora bu durumun aşılması için gereken yeni bir "müdahale ve yatırım planı" ekleyerek yönetimin ticari kaygısını, klinik bir gelişim fırsatına dönüştürmeye çalışırım.', clinicalValue: 95, aiTag: 'innovative_strategist' },
          { label: 'Raporu teknik verilerle mühürlerim ancak veliye yapılacak sözlü sunumda "umut vadeden" kısımları öne çıkararak velinin motivasyonunu ve kurumda kalma isteğini korurum; yazılı veride dürüst, sözlü iletişimde politik bir yol izlerim.', clinicalValue: 85, aiTag: 'pragmatic_communicator' }
        ]
      },
      {
        id: 'stf_eth_9',
        text: 'Bir uzman arkadaşınızın seans esnasında gizlice telefon kullandığını fark ettiniz. Müdahale metodunuz?',
        options: [
          { label: 'Hemen seans sonrası kendisini odaya çeker ve bu durumun çocuk için hak kaybı olduğu kadar kurumun klinik imajını da zedelediğini, bir daha görürsem rapor etmek zorunda kalacağımı net bir dille söylerim.', clinicalValue: 100, aiTag: 'clinical_policeman' },
          { label: 'Durumu doğrudan görmezden gelmem; arkadaşımın seanstaki kurgusunda bir hata yapıp yapmadığını gözlemler, hata yapıyorsa "bak şurayı kaçırdın galiba" diyerek teknik bir bahane ile telefonun dikkat dağıttığını dolaylı yoldan hissettiririm.', clinicalValue: 85, aiTag: 'indirect_supervision' },
          { label: 'Kurumda seans güvenliği ve odaklanma üzerine genel bir eğitim/toplantı düzenlenmesini talep eder, sorunu kişiselleştirmeden kurumsal bir standart (kırmızı çizgi) haline getirilmesini sağlarım.', clinicalValue: 90, aiTag: 'standard_setter' }
        ]
      },
      {
        id: 'stf_eth_10',
        text: 'Kurum dışından bir alternatif tıp uygulayıcısı, vakanıza bilimsel temeli olmayan bir yöntem önerdi ve veli buna inanmış durumda. Nasıl bir bariyer kurarsınız?',
        options: [
          { label: 'Veliye metodun bilimsel (Kanıta Dayalı Uygulamalar - EBP) karşılığının olmadığını gösteren literatür özetleri sunar ve bizim kurumumuzda sadece bilimin referans alındığını belirterek bu yöntemin eğitimimize entegre edilmesini kesinlikle reddederim.', clinicalValue: 100, aiTag: 'scientific_gatekeeper' },
          { label: 'Velinin umut arayışına saygı duyarım ancak bu yöntemin vakanın mevcut nöral gelişim seyrini bozabileceğini, odak kaybı yaratacağını anlatarak, veliyi önce bir çocuk nöroloğundan bilimsel görüş almaya ikna etmeye odaklanırım.', clinicalValue: 90, aiTag: 'empathetic_rationalist' },
          { label: 'Eğer yöntem çocuğa fiziksel zarar vermiyorsa, veliyi tamamen karşımıza almak yerine "bizim programımızla çakışmadığı sürece" yapabileceklerini ama bizim sorumluluğumuz dışında kalacağını belirten bir etik taahhütname imzalatırım.', clinicalValue: 80, aiTag: 'risk_minimizer' }
        ]
      }
    ]
  },

  // --- 3. TEKNO-PEDAGOJİK ADAPTASYON ---
  {
    id: 'academic_innovation',
    title: 'Tekno-Pedagojik Adaptasyon',
    description: 'Yapay zeka, dijital veri analitiği ve modern klinik araçların hibrit kullanımı.',
    icon: '🚀',
    category: 'clinical',
    questions: [
      {
        id: 'stf_inn_1',
        text: 'Yapay zeka (MIA) tarafından hazırlanan bir BEP taslağında, sizin "geleneksel" bulduğunuz bir yönteme alternatif, modern ama riskli bir teknik önerildiğini gördünüz. Refleksiniz?',
        options: [
          { label: 'Yapay zekanın milyonlarca vaka verisinden süzülen bu önerisini akademik bir fırsat olarak görür, yöntemin bilimsel dayanaklarını (EBP) hızla tarar ve vakanın güvenliğini riske atmadan kontrollü bir "A/B Testi" süreci başlatırım.', clinicalValue: 100, aiTag: 'innovative_synthesizer' },
          { label: 'Makinelerin sunduğu algoritmik mantığı sadece bir "taslak" olarak tutar, önerilen modern tekniği kendi klinik süzgecimden geçiririm; eğer insani sezgilerim ve vaka geçmişim bu yöntemi onaylamıyorsa, sistemi tamamen devre dışı bırakarak bildiğim yoldan devam ederim.', clinicalValue: 85, aiTag: 'pedagogical_guardian' },
          { label: 'Teknolojinin sunduğu bu "yeni nesil" bakış açısını kurum içi bir vaka toplantısına taşırım; multidisipliner bir kurul onayı almadan ne eski alışkanlıklarımdan vazgeçerim ne de yeni yöntemi sorgusuz kabul ederim.', clinicalValue: 95, aiTag: 'collaborative_technologist' }
        ]
      },
      {
        id: 'stf_inn_2',
        text: 'Dijital veri takip sistemi (tablet kullanımı) seans sırasındaki "göz teması ve duygusal akışınızı" kestiğini hissediyorsunuz. Çözüm stratejiniz?',
        options: [
          { label: 'Seansın "Digital-Free" (teknolojisiz) geçmesini sağlar, göz kontağını ve insani bağı en yüksek seviyede tutarım; verileri seans bittikten sonra "geriye dönük nöral hatırlama" yöntemiyle sisteme hatasız bir şekilde mühürlemeyi tercih ederim.', clinicalValue: 90, aiTag: 'human_centric_purist' },
          { label: 'Tableti seansın içine bir "eğitim aracı" olarak entegre ederim; veriyi kaydederken bunu çocukla bir "başarı grafiği" paylaşımı gibi kurgulayarak, teknolojiyi bağ kurmanın bir parçası haline getiren hibrit bir model geliştiririm.', clinicalValue: 100, aiTag: 'adaptive_digital_coach' },
          { label: 'Veri hızı ve anlık analizin hata payını minimize ettiğini bildiğim için teknolojiye uyum sağlarım; duygusal akışın bu küçük kesintiden zarar görmeyeceği kadar ustalaşana dek dijital giriş pratiğimi artırırım.', clinicalValue: 80, aiTag: 'efficiency_focused_expert' }
        ]
      },
      {
        id: 'stf_inn_3',
        text: 'Veli, evde çocukla "eğitici" olduğu iddia edilen bir mobil oyun oynamak istediklerini sordu. Bu dijital müdahaleye bakış açınız nedir?',
        options: [
          { label: 'Ekranın nöro-plastisite üzerindeki potansiyel risklerini anlatarak, özellikle erken çocuklukta tamamen "ekransız" bir ev programı öneririm; dijital dünyanın suni pekiştireçlerinin gerçek hayat motivasyonunu öldürdüğünü savunurum.', clinicalValue: 85, aiTag: 'sensory_protective_purist' },
          { label: 'Sadece "Ortak Dikkat" ve "Karşılıklı Etkileşim" (Joint Attention) odaklı olanları, veliyle beraber oynanması ve günde 15 dakikayı geçmemesi şartıyla bir "geçiş materyali" olarak kabul eder, gelişim verilerini takip ederim.', clinicalValue: 100, aiTag: 'balanced_pedagogue' },
          { label: 'Eğer oyun çocuğun seanstaki bir hedefini (örn: eşleme) hızlandırıyorsa, teknolojiyi bir "hızlandırıcı" olarak görür ve desteklerim; dijital dünyanın yasaklanmak yerine doğru kanalla yönetilmesi gerektiğine inanırım.', clinicalValue: 75, aiTag: 'pragmatic_utilitarian' }
        ]
      },
      {
        id: 'stf_inn_4',
        text: 'Yeni bir bilimsel makale, yıllardır başarıyla uyguladığınız bir metodun "bazı nöral profillerde ters tepki" verdiğini açıkladı. Bu bilgi karşısındaki duruşunuz?',
        options: [
          { label: 'Makaleyi eleştirel bir süzgeçten geçirir, kendi vaka setlerimle karşılaştırır ve eğer bir korelasyon sezersem metodumu derhal "Dinamik Revizyon"a sokarak daha güvenli bir protokol inşa ederim; akademik dürüstlüğü konforumdan üstün tutarım.', clinicalValue: 100, aiTag: 'academic_agility_expert' },
          { label: 'Yılların saha tecrübesine ve vaka sonuçlarıma güvenirim; kağıt üzerindeki bir araştırmanın benim "dokunuşumla" aldığım sonuçları yansıtamayacağını düşünür, yöntemi uygulamaya ancak daha dikkatli gözlem yaparak devam ederim.', clinicalValue: 70, aiTag: 'traditional_expert_rigidity' },
          { label: 'Bu araştırmayı kurumun akademik kuruluna sunar ve bu makale doğrultusunda kurum içi yeni bir "standart uygulama rehberi" oluşturulması için liderlik yaparım; bireysel değişim yerine sistemik dönüşümü hedeflerim.', clinicalValue: 95, aiTag: 'institutional_standard_setter' }
        ]
      },
      {
        id: 'stf_inn_5',
        text: 'Seans sırasında internet/tablet sistemi tamamen çöktü ve tüm materyalleriniz dijitalde kilitli kaldı. O anki kriz refleksiniz?',
        options: [
          { label: 'Hemen çevredeki somut nesneleri (kaşık, bardak, minder) kullanarak hedefleri anında "Duyusal-Motor" bir kurguya çeviririm; klinik hedeflerimin teknolojiye değil, benim pedagojik yaratıcılığıma bağlı olduğunu kanıtlarım.', clinicalValue: 100, aiTag: 'resilient_innovator' },
          { label: 'Sistemin gelmesini beklerken bu süreyi "Vaka Gözlemi ve Serbest Etkileşim" olarak kullanırım; planlı ders akışının bozulmasının yarattığı stresi çocuğa yansıtmadan, doğal akışta bağ kurmaya odaklanırım.', clinicalValue: 85, aiTag: 'flexible_stabilizer' },
          { label: 'Kriz anını yönetime bildirir ve telafi seansı planlanmasını isterim; yanlış veya eksik materyalle yapılacak bir seansın klinik verimliliğinin düşük olacağını, metodolojik kusur işlemektense durmayı tercih ederim.', clinicalValue: 60, aiTag: 'procedural_integrity_focused' }
        ]
      },
      {
        id: 'stf_inn_6',
        text: 'Kurumda kullanılan "Digital Twin" (Dijital İkiz) analiz modeli, vakanızın ilerlemesini durdurduğunuzu ve başarısız olduğunuzu projekte ediyor. Bu analize cevabınız?',
        options: [
          { label: 'Verilerdeki sapmaları kabul eder ve yapay zekanın göremediği "niteliksel" (duygusal, ailesel) değişkenleri rapora ekleyerek sistemle bir "diyaloğa" girerim; veriyi reddetmek yerine onu daha derin bir klinik yorumla zenginleştiririm.', clinicalValue: 100, aiTag: 'data_informed_clinician' },
          { label: 'Algoritmaların vakanın o günkü "ruh halini" veya "insani sıçramalarını" ölçemeyeceğini savunur, projeksiyonu reddederim; başarının excel tablolarıyla değil, çocuğun gözündeki parıltıyla ölçüleceğine olan inancımı korurum.', clinicalValue: 80, aiTag: 'intuitive_humanist' },
          { label: 'Sistemin uyarılarını bir "Acil Durum" olarak görür, hemen süpervizörle bir "Klinik Otopsi" toplantısı planlarım; veri bir hata sinyali veriyorsa, orada mutlaka profesyonel bir kör nokta olduğunu düşünürüm.', clinicalValue: 95, aiTag: 'systemic_optimizer' }
        ]
      },
      {
        id: 'stf_inn_7',
        text: 'Karmaşık bir davranışın fonksiyonunu analiz etmek için AI destekli bir yazılım kullanırken yazılımın "hata yaptığını" sezerseniz hamleniz ne olur?',
        options: [
          { label: 'AI analizini bir kenara iter, manuel ABC kayıtlarıma ve klinik sezgilerime sadık kalarak seansı yönetirim; yazılıma bu hatayı geri bildirim olarak girer ve "İnsan Kontrolü" mekanizmasını asla terk etmem.', clinicalValue: 100, aiTag: 'clinical_sovereignty_master' },
          { label: 'Yazılımın benden çok daha fazla veri işlediğini varsayarak kendi sezgilerimi sorgularım; eğer teknoloji bir desen görüyorsa, benim göremediğim gizli bir değişken olabileceğini düşünerek sistemi takip etmeye devam ederim.', clinicalValue: 60, aiTag: 'technology_dependent_follower' },
          { label: 'Sistem hatasını bir "vaka tartışması" konusu yaparak meslektaşlarımla paylaşırım; teknolojinin yanılma payını ekipçe analiz ederek, "Hibrit Karar Mekanizması"nı nasıl daha sağlam kurabileceğimizi tartışırım.', clinicalValue: 90, aiTag: 'collaborative_analytical' }
        ]
      },
      {
        id: 'stf_inn_8',
        text: 'Uzaktan eğitim (Tele-health) seansı yaparken vaka ekran başında regüle olamıyor ve veli panik halinde. İlk stratejik hamleniz?',
        options: [
          { label: 'Anında kamerayı kendime değil veliye odaklatırım; seansı o an "Veli Koçluğu" (Parent Coaching) seansına çevirir, velinin fiziksel müdahale ve ses tonunu regüle ederek çocuğu yerinde sakinleştirmesi için ona uzaktan rehberlik ederim.', clinicalValue: 100, aiTag: 'master_telehealth_coach' },
          { label: 'Ekranda çocuğun çok sevdiği bir dijital pekiştireci (video, müzik) açarak dikkatini dağıtmaya ve sakinleştirmeye çalışırım; teknolojiyi anlık bir "duygusal susturucu" olarak kullanarak krizi kontrol altına alırım.', clinicalValue: 70, aiTag: 'distraction_technologist' },
          { label: 'Veliden seansı sonlandırmasını ve çocuğu güvenli bir alana almasını isterim; ekran başındaki bir krizin travmatikleşme riski olduğunu, regülasyonun dijital ortamda yapılamayacak kadar "dokunsal" bir süreç olduğunu savunurum.', clinicalValue: 85, aiTag: 'clinical_safety_purist' }
        ]
      },
      {
        id: 'stf_inn_9',
        text: 'Vakanın gelişimi için "Göz Takip" (Eye tracking) cihazı gerektiğini düşünüyorsunuz ama kurumun bu yatırımı yapma bütçesi yok. Çözümünüz?',
        options: [
          { label: 'Düşük maliyetli muadil yöntemler geliştiririm; örneğin ayna çalışmaları veya video kayıtlarını kare kare manuel analiz ederek aynı veriyi "emek yoğun" bir süreçle toplarım; teknolojinin yokluğunu klinik adanmışlıkla kapatırım.', clinicalValue: 100, aiTag: 'resourceful_pragmatist' },
          { label: 'Bu cihazın eksikliğinin vakaya zaman kaybettirdiğini belirten "Klinik Risk Raporu" hazırlarım; teknolojik yatırımın bir lüks değil, akademik bir hak olduğunu savunarak yönetimi ikna etme sürecine liderlik ederim.', clinicalValue: 90, aiTag: 'advocacy_leader' },
          { label: 'Bu teknoloji olmadan vakanın gerçek potansiyelini ölçemeyeceğimize inanır, veliyi bu cihazın olduğu üniversite hastanelerine veya dış birimlere yönlendirerek seanslarımızı o veriler gelene kadar dondururum.', clinicalValue: 50, aiTag: 'procedural_perfectionist' }
        ]
      },
      {
        id: 'stf_inn_10',
        text: 'BEP hazırlarken kopyala-yapıştır yerine AI (Gemini) ile "Vakaya Özel Nöral İçerik" üretmek size ne hissettiriyor?',
        options: [
          { label: 'Her vakanın tekil ve eşsiz bir "nöral parmak izi" olduğunu kanıtlama fırsatı; teknolojinin sunduğu bu kişiselleştirme gücünü mesleki bir devrim olarak görüyor ve tüm gücümle kullanıyorum.', clinicalValue: 100, aiTag: 'high_individualization_expert' },
          { label: 'İşimdeki "yazı işleri" yükünü azaltan bir konfor alanı; akademik derinlikten ziyade zaman kazandırmasını önemsiyor, bu sayede childla geçirdiğim fiziksel vaktin artmasından memnuniyet duyuyorum.', clinicalValue: 80, aiTag: 'efficiency_utilizer' },
          { label: 'Kendi kalemimle yazmadığım bir planın "ruhu" olmadığını düşünüyorum; teknolojinin sunduğu taslağı sadece bir referans olarak alıp, her cümleyi kendi klinik gözlemimle yeniden inşa etmeden asla mühürlemiyorum.', clinicalValue: 95, aiTag: 'pedagogical_artisan' }
        ]
      }
    ]
  },

  // --- 4. MULTİDİSİPLİNER TAKIM VE MENTORLUK (YENİLENMİŞ - TEK DOĞRUSU OLMAYAN MODEL) ---
  {
    id: 'team_and_mentorship',
    title: 'Multidisipliner Takım ve Mentorluk',
    description: 'Ekip içi geri bildirim, disiplinlerarası koordinasyon ve mentorluk liderliği.',
    icon: '🤝',
    category: 'team',
    questions: [
      {
        id: 'stf_team_1',
        text: 'Ergoterapist meslektaşınızın, sizin ABA odaklı yönettiğiniz vakanın problem davranışına "farklı ve sizin tekniklerinize aykırı" müdahale ettiğini gördünüz. İlk adımınız ne olur?',
        options: [
          { label: 'Vakanın nöral bütünlüğünü korumak adına, durumu bir "Klinik Çatışma" olarak değil, bir "Sentez Fırsatı" olarak görürüm; derhal disiplinlerarası bir vaka toplantısı talep eder, her iki metodun vaka üzerindeki deltalara dayalı verilerini masaya yatırarak ortak bir hibrit protokol oluşturulmasına liderlik ederim.', clinicalValue: 100, aiTag: 'systemic_integrator' },
          { label: 'Meslektaşımın müdahalesinin benim disiplinimdeki verileri bozduğunu nazikçe ama net bir dille kendisine birebirde iletirim; uzmanlık alanlarının sınırlarına saygı duyulması gerektiğini, vakanın davranış kontrolü sorumluluğunun ana yürütücüsü olarak bu konuda teknik otoriteyi korumam gerektiğini savunurum.', clinicalValue: 90, aiTag: 'boundary_guardian' },
          { label: 'Müdahalenin kısa vadeli sonuçlarını gözlemlerim; eğer vaka regülasyonunda bir iyileşme varsa, meslektaşımın yönteminden kendi disiplinime neler katabileceğimi sorgular, hiyerarşiden ziyade vaka çıktısını merkeze alan pragmatik bir işbirliği zemini ararım.', clinicalValue: 85, aiTag: 'pragmatic_collaborator' }
        ]
      },
      {
        id: 'stf_team_2',
        text: 'Sorumluluğunuzdaki bir stajyer, verdiğiniz kritik bir klinik talimatın "literatüre aykırı" veya "gereksiz" olduğunu iddia ederek sizinle tartışmaya girdi. Mentorluk duruşunuz nedir?',
        options: [
          { label: 'Stajyerin bu sorgulayıcı tavrını akademik bir gelişim emaresi olarak görür, onu yanıma alarak ilgili vaka üzerinde bir "Kanıta Dayalı Gözlem" (EBP) seansı yaparım; talimatımın klinik nedenlerini saha sonuçlarıyla ona bizzat deneyimletir, otoritemi bilgiyle perçinlerim.', clinicalValue: 100, aiTag: 'growth_oriented_mentor' },
          { label: 'Kurumsal hiyerarşinin ve klinik sorumluluğun bende olduğunu hatırlatırım; staj döneminin "uygulama sadakati" kazanma dönemi olduğunu, akademik tartışmaların vaka seansı sırasında değil, süpervizyon saatinde yapılması gerektiğini net bir dille belirtirim.', clinicalValue: 90, aiTag: 'hierarchical_leader' },
          { label: 'Stajyerin sunduğu argümanın güncel literatürdeki karşılığını hızla tararım; eğer haklılık payı varsa kendi hatamı onun önünde kabul etmekten çekinmez, böylece kurum içinde "hatadan beslenen akademik dürüstlük" modellemesi yaparım.', clinicalValue: 95, aiTag: 'intellectually_honest_mentor' }
        ]
      },
      {
        id: 'stf_team_3',
        text: 'Ekip içi bir vaka toplantısında, başarısız giden bir süreçten dolayı tüm oklar size çevrildi ve sertçe eleştiriliyorsunuz. Duygusal regülasyonunuz nasıl işler?',
        options: [
          { label: 'Eleştirileri kişisel bir saldırı olarak değil, vaka yönetimi için bir "Dış Denetim" verisi olarak kabul ederim; savunmaya geçmek yerine, eleştiri yapan arkadaşlarıma "Benim göremediğim hangi kör noktayı fark ettiniz?" sorusunu sorarak odağı vakaya geri döndürürüm.', clinicalValue: 100, aiTag: 'resilient_professional' },
          { label: 'Verilere dayalı rasyonel bir savunma dosyası sunarım; duygusal tartışmalara girmeden, seans kayıtlarımı ve grafiklerimi göstererek kararlarımın teknik nedenselliğini ispatlarım; profesyonel itibarımı bilimsel kanıtlarla korurum.', clinicalValue: 90, aiTag: 'analytical_defender' },
          { label: 'Toplantıdaki gerilimi düşürmek için empatik bir dil kullanırım; ekibin stresini valide eder, sorumluluğu paylaşmayı teklif eder ve "Bunu bir suçlama seansından çıkarıp yeni bir yol haritası seansına nasıl çevirebiliriz?" diyerek moderatör rolü üstlenirim.', clinicalValue: 95, aiTag: 'harmonizing_stabilizer' }
        ]
      },
      {
        id: 'stf_team_4',
        text: 'Kuruma yeni katılan ve sizden daha deneyimli olan bir uzmanın, sizin vaka takip sisteminizi "yavaş ve demode" bulduğunu fark ettiniz. Aksiyonunuz?',
        options: [
          { label: 'Deneyimine saygı duyarak kendisinden bir "Mikro-Eğitim" talep ederim; onun getirdiği yeni sistemi mevcut kurumsal hafızaya nasıl entegre edebileceğimizi tartışır, öğrenme çevikliğimi (learning agility) bir fırsata çeviririm.', clinicalValue: 100, aiTag: 'lifelong_learner' },
          { label: 'Kurumun mevcut sisteminin bir standardı olduğunu ve bu standardın veri güvenliği/takibi için mühürlendiğini anlatırım; yeni fikirleri kurumun akademik kuruluna sunması gerektiğini belirterek sistemik disiplini korurum.', clinicalValue: 85, aiTag: 'standard_guardian' },
          { label: 'Kendi sistemimin vaka çıktılarındaki başarısını rakamlarla gösteririm; yeni uzmanın önerisini ancak benim sistemimden daha yüksek bir "vaka verimliliği" vaat ediyorsa pilot bir uygulama ile denemeye gönüllü olurum.', clinicalValue: 90, aiTag: 'efficiency_focused' }
        ]
      },
      {
        id: 'stf_team_5',
        text: 'Çok yakın bir mesai arkadaşınızın tükenmişlik (burnout) yaşadığını ve bunun vakalara karşı "soğuk/mekanik" davranmasına neden olduğunu sezdiniz. Sorumluluğunuz nerede başlar?',
        options: [
          { label: 'Arkadaşımı kurum dışı bir kahveye davet eder, hissettiklerimi bir "ayna" gibi ona yansıtırım; ona klinik bir süpervizyon desteği veya iş yükü rotasyonu konusunda yönetimle aracı olmayı teklif ederek ekip dayanışmasını önceliklendiririm.', clinicalValue: 100, aiTag: 'empathetic_ally' },
          { label: 'Vaka güvenliği ve seans kalitesinin her türlü dostluğun üstünde olduğuna inanırım; durumu isim vermeden klinik direktöre "kadro genelinde bir motivasyonel düşüş" olarak raporlar ve acil bir "Klinik Hijyen" toplantısı yapılmasını sağlarım.', clinicalValue: 90, aiTag: 'clinical_watchdog' },
          { label: 'Kendi seanslarımdaki enerjiyi artırarak ona dolaylı yoldan model olmaya çalışırım; profesyonel sınırları bozmadan, onun vakaları üzerindeki etkisini izlemeye devam eder, sadece etik bir ihlal görürsem müdahil olurum.', clinicalValue: 80, aiTag: 'non_interventive_observer' }
        ]
      },
      {
        id: 'stf_team_6',
        text: 'Disiplinlerarası bir projede (Örn: Kurumun yeni müfredat tasarımı) liderlik size verildi ancak ekip üyeleri pasif direnç gösteriyor. Liderlik refleksiniz?',
        options: [
          { label: 'Ekip üyelerinin pasif direncini, projedeki "aidiyet eksikliğine" bağlarım; her birine kendi uzmanlık alanlarında tam yetki ve sorumluluk vererek onları "projenin sahibi" haline getirir, katılımcı bir liderlik modeli uygularım.', clinicalValue: 100, aiTag: 'inclusive_leader' },
          { label: 'Projenin takvimini ve kurumsal hedeflerini net bir şekilde hatırlatırım; beklentileri yazılı hale getirir ve performans çıktılarını somutlaştırarak disiplini önceliklendiririm; projenin selameti için gerekiyorsa direktif temelli bir yol izleim.', clinicalValue: 85, aiTag: 'direct_task_master' },
          { label: 'Direnç gösteren üyelerle birebir görüşmeler yaparak bariyerleri analiz ederim; kişisel sorunları veya metodolojik kaygıları çözümleyerek ekibi ikna yoluyla tekrar konsolide etmeye odaklanırım.', clinicalValue: 95, aiTag: 'diplomatic_negotiator' }
        ]
      },
      {
        id: 'stf_team_7',
        text: 'Bir stajyerin, veliyle kurum dışında (etik sınırı aşan) bir yazışma yaptığını tesadüfen öğrendiniz. Müdahale metodunuz?',
        options: [
          { label: 'Durumu derhal staj koordinatörüne ve yönetime mühürlü bir notla raporlarım; etik sınırların esnetilmesinin kurumun akademik imajına ve vakanın terapötik çerçevesine kalıcı zarar vereceğini savunurum.', clinicalValue: 100, aiTag: 'uncompromising_ethics_advocate' },
          { label: 'Stajyeri odaya çeker ve bu eylemin neden "mesleki bir intihar" olduğunu pedagojik bir dille anlatırım; veli-uzman ilişkisinin nöro-dinamiklerini ona analiz ettirerek hatasından bir ders çıkarmasını sağlar, ardından kontrollü bir raporlama yaparım.', clinicalValue: 95, aiTag: 'transformative_mentor' },
          { label: 'Durumu görmezden gelmem ama stajyeri korkutmak yerine, bir sonraki genel toplantıda "Dijital Etik ve Profesyonel Mesafe" konusunu genel bir başlık olarak açtırıp stajyerin kendi hatasını fark etmesini sağlayan bir dolaylı müdahale kurgularım.', clinicalValue: 85, aiTag: 'indirect_stabilizer' }
        ]
      },
      {
        id: 'stf_team_8',
        text: 'Vaka toplantısında vakanın gelişimi için çok pahalı bir teknolojik yatırım önerdiniz ama yönetim "maliyet" gerekçesiyle reddetti. Takımın motivasyonunu nasıl korursunuz?',
        options: [
          { label: 'Reddedilen teknolojinin sağladığı veriyi "manuel ve düşük maliyetli" yöntemlerle nasıl toplayabileceğimize dair ekipçe bir "Bilişsel Fırtına" (Brainstorming) başlatırım; imkansızlığı yaratıcılığa yakıt olarak kullanırım.', clinicalValue: 100, aiTag: 'resourceful_optimist' },
          { label: 'Yönetimin bu kararının uzun vadeli akademik risklerini içeren bir "Klinik Kayıp Projeksiyonu" hazırlarım; ekibime bu mücadelenin bir parçası olmaları için çağrıda bulunur, haklı talebimizi verilerle tekrar sunmak için destek toplarım.', clinicalValue: 90, aiTag: 'strategic_advocate' },
          { label: 'Yönetimin ticari gerçeklerini ekibe rasyonel bir dille açıklarım; mevcut şartlarda "en iyiye" nasıl ulaşacağımıza odaklanmamız gerektiğini söyleyerek odağı hayal kırıklığından uygulama kalitesine çekerim.', clinicalValue: 85, aiTag: 'institutional_realist' }
        ]
      },
      {
        id: 'stf_team_9',
        text: 'Bir ekip arkadaşınızın sizin bir vaka üzerindeki "başarınızı" kendisine mal ettiğini (sunumda kendi fikriymiş gibi anlattığını) duydunuz. Tepkiniz?',
        options: [
          { label: 'Bunu bir "kişisel ego" meselesi yerine "bilimsel atıf etiği" ihlali olarak görürüm; arkadaşımla yalnızken konuşur ve bilginin kaynağının doğru belirtilmesinin akademik güvenirlik için şart olduğunu hatırlatırım; egomu değil meslek ahlakını savunurum.', clinicalValue: 100, aiTag: 'ethical_purist' },
          { label: 'Başarının vakada kalmış olmasını yeterli bulurum; kimin anlattığından ziyade vakanın ilerlemesine odaklanırım; ancak bir sonraki projede veri güvenliğimi ve "akademik imzamı" daha sıkı mühürleyen bir çalışma metodu geliştiririm.', clinicalValue: 80, aiTag: 'detached_pragmatist' },
          { label: 'Toplantı sonrasında herkesin içindeyken "X arkadaşımızın anlattığı o metodun gelişim sürecindeki Y detayını ben şöyle kurgulamıştım..." diyerek, arkadaşımı bozmadan ama gerçeği de nazikçe herkesin önüne koyarak pozisyonumu korurum.', clinicalValue: 90, aiTag: 'socially_intelligent_competitor' }
        ]
      },
      {
        id: 'stf_team_10',
        text: 'Mentorluk yaptığınız bir uzmanın başarısı sizin başarılarınızı gölgede bırakmaya başladı. İçsel ve profesyonel duruşunuz?',
        options: [
          { label: 'Bu durumun benim "mentorluk kalitemin" en büyük kanıtı olduğunu düşünür ve gurur duyarım; onu kurum içinde daha üst pozisyonlara (Örn: Süpervizörlük) taşıması için yönetime bizzat referans olur, yerimi devretmeye hazır bir liderlik sergilerim.', clinicalValue: 100, aiTag: 'master_mentor' },
          { label: 'Kurum içindeki rekabetin akademik kaliteyi artıracağına inanırım; onun başarısından ilham alarak kendi metodolojimi günceller, "usta-çırak" ilişkisini "iki usta arasındaki verimli bir rekabete" dönüştürürüm.', clinicalValue: 95, aiTag: 'growth_mindset_professional' },
          { label: 'Onun başarısını kurumsal bir başarı hikayesi olarak paketler, dış dünyaya pazarlarım; bireysel rekabetten ziyade kurumun liyakat markasını büyütmeye odaklanan bir yönetici zihniyetiyle hareket ederim.', clinicalValue: 90, aiTag: 'corporate_strategist' }
        ]
      }
    ]
  },

  // --- 5. KRİZ LİDERLİĞİ VE VELİ DİPLOMASİSİ (Eskisiyle devam eder...) ---
  {
    id: 'crisis_leadership',
    title: 'Kriz Liderliği ve Veli Diplomasisi',
    description: 'Yüksek stresli veli toplantıları, fiziksel agresyon ve beklenti yönetimi.',
    icon: '🔥',
    category: 'parent',
    questions: [
      {
        id: 'stf_cri_1',
        text: 'Veli, kurumun bahçesinde "6 aydır bir arpa boyu yol gidemedik!" diye bağırıyor. İlk kriz refleksiniz?',
        options: [
          { label: 'Veliyi hızla kapalı bir odaya davet eder, duygusunu valide edip "Pre-test vs Güncel Veri" kıyaslamasını önüne koyarım.', clinicalValue: 100, aiTag: 'expert_deescalation' },
          { label: 'Güvenliği çağırırım.', clinicalValue: 20, aiTag: 'extreme_avoidance' },
          { label: 'Ben de ona bağırırım.', clinicalValue: -100, aiTag: 'aggression_reciprocity' }
        ]
      },
      {
        id: 'stf_cri_2',
        text: 'Öğrenci aniden kendine zarar verme (SIB) davranışına başladı ve parmağını ısırıyor. O saniyedeki önceliğiniz?',
        options: [
          { label: 'En az kısıtlayıcı fiziksel müdahale (Last Restrictive) ile çocuğu ve kendimi güvenliğe alırım.', clinicalValue: 100, aiTag: 'clinical_safety_reflex' },
          { label: 'Davranışın nedenini analiz etmek için defterimi alırım.', clinicalValue: 40, aiTag: 'over_analysis_in_danger' },
          { label: 'Odadan çıkar, yardım çağırırım.', clinicalValue: 0, aiTag: 'abandonment_in_crisis' }
        ]
      },
      {
        id: 'stf_cri_3',
        text: 'Veli seansın ortasında içeri girip "Hocam yanlış tutuyorsunuz, öyle değil böyle yapın" dedi. Müdahaleniz?',
        options: [
          { label: 'Seansı o an "Veli Eğitimi" seansına çevirir, neden öyle tuttuğumu bilimsel olarak gösterip denemesini isterim.', clinicalValue: 100, aiTag: 'educational_diplomacy' },
          { label: 'Öfkelenir ve veliyi dışarı çıkarırım.', clinicalValue: 30, aiTag: 'ego_fragility' },
          { label: 'Veli ne diyorsa öyle yaparım.', clinicalValue: 10, aiTag: 'clinical_surrender' }
        ]
      },
      {
        id: 'stf_cri_4',
        text: 'Bir vakanın gelişiminde "Plato" (ilerleme yok) dönemindesiniz. Veliye durumu nasıl açıklarsınız?',
        options: [
          { label: 'Sinir sisteminin bir konsolidasyon aşamasında olduğunu, verileri analiz ettiğimizi ve strateji değişikliği yapacağımızı anlatırım.', clinicalValue: 100, aiTag: 'strategic_transparency' },
          { label: '"Çocuk artık öğrenemiyor" derim.', clinicalValue: 10, aiTag: 'diagnostic_pessimism' },
          { label: 'Biraz yalan söyler, "çok iyi gidiyor" derim.', clinicalValue: 0, aiTag: 'unethical_reassurance' }
        ]
      },
      {
        id: 'stf_cri_5',
        text: 'Kriz anında bir meslektaşınızın donup kaldığını (freeze) gördünüz. Rolünüz?',
        options: [
          { label: 'Vakayı devralır, arkadaşıma güvenli bir alan açar ve kriz sonrası debrifing yaparım.', clinicalValue: 100, aiTag: 'crisis_leadership_mastery' },
          { label: 'Onu izlerim.', clinicalValue: 20, aiTag: 'passive_observation' },
          { label: '"Neden duruyorsun?" diye bağırırım.', clinicalValue: 0, aiTag: 'hostile_intervention' }
        ]
      },
      {
        id: 'stf_cri_6',
        text: 'Veli, kurum müdürüne sizin hakkınızda yalan bir şikayette bulundu. Reaksiyonunuz?',
        options: [
          { label: 'Yönetime seans kayıtlarımı ve objektif ilerleme verilerimi sunarak rasyonel bir savunma yaparım.', clinicalValue: 100, aiTag: 'professional_fortress' },
          { label: 'Veliyle kavga ederim.', clinicalValue: 10, aiTag: 'lack_of_restraint' },
          { label: 'Vakayı hemen bırakırım.', clinicalValue: 30, aiTag: 'reactive_termination' }
        ]
      },
      {
        id: 'stf_cri_7',
        text: 'Çocuğun ilaç dozajının değiştirildiğini ve seans performansının çöktüğünü fark ettiniz. Velinin tavrı "bunu hocaya söylemeyelim" olmuş. Ne yaparsınız?',
        options: [
          { label: 'Verilerdeki ani değişimi göstererek veliyi açık uçlu sorularla gerçeğe davet ederim; sağlığın eğitimden önce geldiğini vurgularım.', clinicalValue: 100, aiTag: 'diagnostic_detective' },
          { label: 'Sormam, kendileri bilir.', clinicalValue: 40, aiTag: 'clinical_indifference' },
          { label: 'İlacı eski doza dönmelerini söylerim.', clinicalValue: -50, aiTag: 'illegal_medical_advice' }
        ]
      },
      {
        id: 'stf_cri_8',
        text: 'Kurumda yangın alarmı çaldı ve vakanız "sensory overload" nedeniyle yere kapandı. Ne yaparsınız?',
        options: [
          { label: 'Çocuğu kucaklar (güvenli taşıma) ve dışarıdaki güvenli toplanma alanına kadar regüle ederek tahliye ederim.', clinicalValue: 100, aiTag: 'emergency_heroism' },
          { label: 'Çocuğu orada bırakıp kaçarım.', clinicalValue: -200, aiTag: 'desertion' },
          { label: 'Alarmın susmasını beklerim.', clinicalValue: 10, aiTag: 'crisis_denial' }
        ]
      },
      {
        id: 'stf_cri_9',
        text: 'Veli seans sonunda "Hocam biz ayrılıyoruz, çocuk çok etkilenir mi?" dedi. Etik yanıtınız?',
        options: [
          { label: 'Çocuğun rutininin bozulacağını, bu sürecin profesyonel bir destekle yönetilmesi gerektiğini bilimsel olarak açıklarım.', clinicalValue: 100, aiTag: 'family_consultancy_mastery' },
          { label: '"Hayır, bir şey olmaz" der geçerim.', clinicalValue: 30, aiTag: 'emotional_belittling' },
          { label: '"Gitmeyin, çocuk mahvolur" diyerek korkuturum.', clinicalValue: 40, aiTag: 'manipulative_retention' }
        ]
      },
      {
        id: 'stf_cri_10',
        text: 'Vakanın ilerlemesi için velinin evdeki "şımartma" tutumunu değiştirmesi şart. Veliyi kırmadan nasıl söylersiniz?',
        options: [
          { label: '"Evdeki tutarlılık, kurumdaki emeği 4 kat hızlandırır" diyerek kazanç odaklı bir işbirliği modeli sunarım.', clinicalValue: 100, aiTag: 'strategic_alignment' },
          { label: '"Çocuğu mahvediyorsunuz" derim.', clinicalValue: 20, aiTag: 'direct_attack' },
          { label: 'Söyleyemem, veli paradır.', clinicalValue: 0, aiTag: 'commercial_fear' }
        ]
      }
    ]
  },

  // --- 6. AKADEMİK MÜDAHALE VE NÖRO-PEDAGOJİK ÇÖZÜMLER (Eskisiyle devam eder...) ---
  {
    id: 'academic_neuro_pedagogy',
    title: 'Akademik Müdahale ve Nöro-Pedagojik Çözümler',
    description: 'Türkçe ve Matematik öğretiminde yaşanan kronik tıkanıklıklara bilimsel yaklaşımlar.',
    icon: '📝',
    category: 'clinical',
    questions: [
      {
        id: 'stf_acad_1',
        text: 'Öğrenci harfleri tanıyor ancak "Grafem-Fonem" eşlemesinde (sesleri birleştirme) sürekli takılıyor. Tıkanıklığı nasıl aşarsınız?',
        options: [
          { label: 'Süreci "Fonolojik Farkındalık" aşamasına geri çekerim; kağıt kalem kullanmadan sadece seslerle (uyak bulma, ses eksiltme) kısa süreli belleği güçlendiririm.', clinicalValue: 100, aiTag: 'phonological_remediation' },
          { label: 'Harfleri somut nesnelerle eşleyip "bilişsel resimleme" yoluyla birleştirme aşamasını tamamen görselleştiririm.', clinicalValue: 60, aiTag: 'compensatory_visual_coding' },
          { label: 'Pekiştirme tarifesini yoğunlaştırarak her doğru ses birleştirmede ödül veririm.', clinicalValue: 40, aiTag: 'behavioral_drill' }
        ]
      },
      {
        id: 'stf_acad_2',
        text: 'Matematikte "Sayı Hissi" (Number Sense) olmayan bir çocukta, toplama işlemine rağmen hala parmakla sayma görülüyor. Çözümünüz?',
        options: [
          { label: 'Çocuğa sayıyı gördüğü an değerini tanıması için "Subitizing" (bak-söyle) kartlarıyla hızlı tanıma egzersizleri uygularım.', clinicalValue: 100, aiTag: 'cognitive_arithmetic_mastery' },
          { label: 'Sayı doğrusu ve abaküs gibi somut araçları sürekli kullanırım; zihinden işlem yapması için baskı kurmam.', clinicalValue: 80, aiTag: 'concrete_representation' },
          { label: 'Toplama öğretimini askıya alır, 3 ay boyunca sadece eşleme ve gruplama becerilerine geri dönerim.', clinicalValue: 50, aiTag: 'pedagogical_regression' }
        ]
      },
      {
        id: 'stf_acad_3',
        text: 'Disleksi tanılı öğrenci "b-d" ve "p-q" gibi harfleri karıştırıyor. Nörolojik düzeyde hamleniz?',
        options: [
          { label: 'Harfleri "Vücut Alfabesi" ile çocuğun kendi gövdesi üzerinde deneyimlemesini sağlar, propriyoseptif girdiyle yön bilgisini mühürlerim.', clinicalValue: 100, aiTag: 'multisensory_integration' },
          { label: 'Harflerin üzerine görsel ipuçları (örn: b\'ye göbek çizmek) ekleyerek ayırt ediciliği artırırım.', clinicalValue: 70, aiTag: 'visual_cueing' },
          { label: 'Karıştırılan harfleri içeren kelimeleri defalarca yazdırarak görsel şablon oluşana kadar devam ederim.', clinicalValue: 40, aiTag: 'rote_memory_focus' }
        ]
      },
      {
        id: 'stf_acad_4',
        text: 'Öğrenci okuyor ancak okuduğunu asla anlamıyor (Hyperlexia emaresi). Müdahaleniz ne olur?',
        options: [
          { label: 'Okuma hızını yavaşlatırım; her cümleden sonra "Görselleştirme" (Visualizing and Verbalizing) tekniği ile okuduğunu zihninde çizmesini isterim.', clinicalValue: 100, aiTag: 'metacognitive_comprehension' },
          { label: 'Okuma bittikten sonra metinle ilgili 5N1K soruları sorarım; doğru cevaplarda pekiştireç veririm.', clinicalValue: 50, aiTag: 'behavioral_testing_model' },
          { label: 'Metinleri 2 cümleye indirir, başarısını garantileyerek metin boyunu kademeli artırırım.', clinicalValue: 60, aiTag: 'stimulus_control' }
        ]
      },
      {
        id: 'stf_acad_5',
        text: 'Matematiksel problem çözmede çocuk işlemleri biliyor ama "problemi kuramıyor". Hangi bilişsel alana müdahale edersiniz?',
        options: [
          { label: 'Ardıl işlemlemeyi hedef alırım; problemi "adım adım yönerge" haline getiren algoritmik bir akış şeması (Flowchart) kullanırım.', clinicalValue: 100, aiTag: 'executive_function_support' },
          { label: 'Problemi sadece resimlerle anlatır, dili devreden çıkarıp mantıksal kurguyu görsel-uzamsal temsil üzerinden kurarım.', clinicalValue: 80, aiTag: 'non_verbal_logic' },
          { label: 'Problemin içindeki "ipucu kelimeleri" (örn: "Daha fazla" görünce topla) ezberletirim.', clinicalValue: 30, aiTag: 'keyword_strategy' }
        ]
      },
      {
        id: 'stf_acad_6',
        text: 'Yazı yazarken aşırı yavaş olan ve harf formları çok bozuk (Dysgraphia) bir öğrencide önceliğiniz?',
        options: [
          { label: 'Yazma eylemini duyusal bir deneyime dönüştürür; kum havuzu veya tıraş köpüğü üzerinde büyük formlarla harf çalışırım.', clinicalValue: 100, aiTag: 'sensory_motor_remediation' },
          { label: 'İnce motoru beklemek yerine "Klavye veya Tabletle Yazma" gibi alternatif çıktı yöntemlerini devreye alırım.', clinicalValue: 80, aiTag: 'adaptive_technology' },
          { label: 'Çizgi çalışmalarına geri döner; dikey-yatay formlar mükemmelleşene kadar harfe geçmem.', clinicalValue: 50, aiTag: 'rigid_prerequisite' }
        ]
      },
      {
        id: 'stf_acad_7',
        text: 'Ritmik saymalarda çocuk hep aynı yerde takılıyor. Bu "Ardıl İşlemleme" sorununa çözümünüz?',
        options: [
          { label: 'Sayıları ritmik bir müzik veya tempo (metronom) eşliğinde öğretir; sayma eylemini bir melodiye dönüştürürüm.', clinicalValue: 100, aiTag: 'auditory_rhythmic_scaffolding' },
          { label: 'Yüzlük tablo üzerinde sayıları görsel işaretler; bellek yükünü görsel kanala transfer ederim.', clinicalValue: 80, aiTag: 'visual_spatial_mapping' },
          { label: 'Ritmik saymayı ezberleyene kadar her seans başında 10 dakika yüksek sesle tekrar ettiririm.', clinicalValue: 30, aiTag: 'mechanical_rote_memory' }
        ]
      },
      {
        id: 'stf_acad_8',
        text: 'Öğrenci çarpma işlemini yapıyor ancak "çarpmanın mantığını" anlamıyor. Risk analizi ve hamleniz?',
        options: [
          { label: 'Bölme işlemi ve problem çözmede "mantıksal çöküş" yaşayacağını bildiğim için hızı durdurur, alan modelleri ile kavramsal derinlik çalışırım.', clinicalValue: 100, aiTag: 'conceptual_integrity' },
          { label: 'Hızı önceliklendirir, çarpım tablosunu ezberletirim; mantık zamanla oturabilir.', clinicalValue: 40, aiTag: 'performance_over_concept' },
          { label: 'Hesap makinesi kullanımına yönlendirir, işlemsel yükü teknolojiye devrederim.', clinicalValue: 60, aiTag: 'compensation_strategy' }
        ]
      },
      {
        id: 'stf_acad_9',
        text: 'Dil bilgisi öğretirken çocuk ekleri hep yanlış yere koyuyor (örn: "Ev gittime"). Sentaks hatasını nasıl düzeltirsiniz?',
        options: [
          { label: '"Doğal Dil Sağaltımı" (Recasting) yaparım; çocuk hatalı söylediğinde doğruyu vurgulu şekilde modele dönüştürürüm ama düzeltmesini istemem.', clinicalValue: 100, aiTag: 'naturalistic_intervention' },
          { label: 'Görsel kartlarla cümleyi fiziksel olarak dizmesini ister; dilin matematiksel yapısını somutlaştırırım.', clinicalValue: 80, aiTag: 'visual_syntax_scaffolding' },
          { label: 'Hata yaptığında cümleyi durdurur ve "Yanlış söyledin, doğrusunu söyle" diyerek farkındalık zorunluluğu kurarım.', clinicalValue: 30, aiTag: 'direct_correction' }
        ]
      },
      {
        id: 'stf_acad_10',
        text: 'Para kavramı çalışırken çocuk 10 TL ile 100 TL arasındaki farkı anlayamıyor. Fonksiyonel çözümünüz?',
        options: [
          { label: 'Sayısal değerden vazgeçip "Renk ve Boyut" üzerinden sembolleştirme yapar, market simülasyonu ile ihtiyacı öğretirim.', clinicalValue: 100, aiTag: 'functional_pragmatism' },
          { label: 'Onluk taban bloklarıyla her bir paranın içindeki "birim" sayısını fiziksel olarak yan yana dizdiririm.', clinicalValue: 80, aiTag: 'volume_mapping' },
          { label: 'Paraları sadece birer "kart" gibi eşletirim; sayıları doğru okuduğu sürece değerini anlamasını erteleyebilirim.', clinicalValue: 40, aiTag: 'low_cognitive_engagement' }
        ]
      }
    ]
  }
];
