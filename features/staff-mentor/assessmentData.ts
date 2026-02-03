
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v7.0)
 * Toplam 6 Kategori x 10 Soru = 60 Kritik İkilem.
 */
export const MODULAR_BATTERIES: AssessmentBattery[] = [
  // --- 1. İLERİ ABA VE KLİNİK KARAR MEKANİZMALARI ---
  {
    id: 'aba_advanced_mastery',
    title: 'İleri ABA ve Klinik Karar Mekanizmaları',
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
        text: 'Vaka "İlgi Elde Etme" işlevli bir davranış sergilerken, stajyerin yanlışlıkla çocuğa gülümsediğini fark ettiniz. Aksiyonunuz?',
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
        text: 'Öğrencinin serbest zaman oyununda, seans hedeflerinden birini kendiliğinden sergilediğini gördünüz. Ne yaparsınız?',
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
        text: 'Veli, özel bir akşam yemeğine davet etti ve "Bize bir hoca gibi değil, bir aile dostu gibi gelin" dedi. Tavrınız?',
        options: [
          { label: 'Nazikçe teşekkür eder, kurum politikası ve terapötik sürecin selameti gereği ailelerle sosyal ilişki kuramadığımı net bir dille açıklarım.', clinicalValue: 100, aiTag: 'immaculate_boundaries' },
          { label: 'Terapötik bağı güçlendirmek ve aileyi yakından tanımak için bir kez giderim.', clinicalValue: 20, aiTag: 'dual_relationship_risk' },
          { label: 'Giderim ama işle ilgili konuşmayacağımı peşinen belirtirim.', clinicalValue: 40, aiTag: 'boundary_erosion' }
        ]
      },
      {
        id: 'stf_eth_2',
        text: 'Veli, çocuğuna özel ders vermeniz için size kurumun verdiği maaşın 3 katını teklif etti. Kararınız?',
        options: [
          { label: 'Teklifi reddederim; aynı vakaya hem kurumda hem özelde bakmanın etik bir çıkar çatışması (Conflict of Interest) olduğunu açıklarım.', clinicalValue: 100, aiTag: 'ethical_integrity' },
          { label: 'Kuruma durumu bildirir, istifa ederek vaka ile dışarıda devam ederim.', clinicalValue: 30, aiTag: 'mercenary_mindset' },
          { label: 'Ücreti kurum üzerinden geçirmeyi veya kurumun bu hizmeti ek paket olarak sunmasını öneririm.', clinicalValue: 70, aiTag: 'procedural_integrity' }
        ]
      },
      {
        id: 'stf_eth_3',
        text: 'Seans esnasında vakanın vücudunda şüpheli morluklar gördünüz ve veli "yataktan düştü" dedi ama şüpheniz var. İlk adım?',
        options: [
          { label: 'Morlukların fotoğrafını çeker ve durumu derhal "Çocuk Koruma Protokolü" kapsamında yönetime ve sosyal hizmetlere bildiririm.', clinicalValue: 100, aiTag: 'supreme_responsibility' },
          { label: 'Velinin beyanına güvenirim, aile içi meselelere karışmamayı tercih ederim.', clinicalValue: 0, aiTag: 'neglect_of_duty' },
          { label: 'Bir sonraki seansı bekleyip morlukların geçip geçmediğini takip ederim.', clinicalValue: 20, aiTag: 'unjustified_delay' }
        ]
      },
      {
        id: 'stf_eth_4',
        text: 'Sosyal medyada vakanın fotoğrafını (ailesi izin vermiş olsa bile) kendi kişisel hesabınızda paylaşmak istiyorsunuz. Etik duruşunuz?',
        options: [
          { label: 'Vakanın gelecekteki mahremiyetini ve onurunu düşünerek, izin olsa dahi kişisel hesapta paylaşımı reddederim.', clinicalValue: 100, aiTag: 'privacy_first' },
          { label: 'Ailesi izin verdiyse profesyonel gelişimim için paylaşırım.', clinicalValue: 30, aiTag: 'legal_but_unethical' },
          { label: 'Yüzünü kapatarak veya arkadan paylaşırım.', clinicalValue: 60, aiTag: 'grey_zone_ethics' }
        ]
      },
      {
        id: 'stf_eth_5',
        text: 'Kurumda bir arkadaşınızın seanslara sürekli geç girdiğini ama raporları tam süreli girdiğini gördünüz. Aksiyonunuz?',
        options: [
          { label: 'Önce kendisini uyarırım, düzelmezse akademik direktöre mühürlü bir rapor sunarım; çocukların hak kaybı kabul edilemez.', clinicalValue: 100, aiTag: 'whistleblowing_integrity' },
          { label: 'Onu korumak için susarım, ekip içi dayanışma her şeyden önemlidir.', clinicalValue: 0, aiTag: 'toxic_loyalty' },
          { label: 'Ben de seanslarımı esnetmeye başlarım.', clinicalValue: -50, aiTag: 'moral_disengagement' }
        ]
      },
      {
        id: 'stf_eth_6',
        text: 'Vaka hakkında kurum dışı bir uzmanla telefonda konuşurken yanınızda başka bir velinin olduğunu fark ettiniz. Ne yaparsınız?',
        options: [
          { label: 'Konuşmayı hemen sonlandırır, gizli bilgilerin duyulmadığından emin olur ve güvenli bir alana geçerim.', clinicalValue: 100, aiTag: 'privacy_mastery' },
          { label: 'İsim vermediğim sürece konuşmaya devam ederim.', clinicalValue: 40, aiTag: 'risky_confidentiality' },
          { label: 'Kısık sesle konuşarak devam ederim.', clinicalValue: 20, aiTag: 'negligent_boundary' }
        ]
      },
      {
        id: 'stf_eth_7',
        text: 'Eski bir iş arkadaşınız, kurumun vaka listesini kendi yeni merkezi için istedi. Tavrınız?',
        options: [
          { label: 'Durumu anında bilişim güvenliği birimine ve yönetime raporlarım; veri mahremiyeti kurumsal namustur.', clinicalValue: 100, aiTag: 'institutional_guardian' },
          { label: 'Dostluk hatırına en azından iletişim bilgilerini gizlice veririm.', clinicalValue: -100, aiTag: 'data_theft_complicity' },
          { label: 'Vermem ama durumu kimseye de söylemem.', clinicalValue: 50, aiTag: 'passive_protection' }
        ]
      },
      {
        id: 'stf_eth_8',
        text: 'Vakanın ilerlemediğini biliyorsunuz ancak yönetim veliyi tutmak için raporda "harika gidiyor" yazmanızı istiyor. Ne yaparsınız?',
        options: [
          { label: 'Gerçek verileri yazar ve gerekçelendiririm; akademik yalanın klinik bir suç olduğunu savunurum.', clinicalValue: 100, aiTag: 'academic_honesty' },
          { label: 'Yönetime uyarım, kurumun geliri vakanın devamına bağlıdır.', clinicalValue: 0, aiTag: 'corporate_servitude' },
          { label: 'Sadece nesnel rakamları yazar, yorum yapmaktan kaçınırım.', clinicalValue: 70, aiTag: 'neutral_avoidance' }
        ]
      },
      {
        id: 'stf_eth_9',
        text: 'Bir uzman arkadaşınızın seans sırasında telefonla oynadığını gördünüz. Tepkiniz?',
        options: [
          { label: 'Uygun bir dille seans kalitesinin düştüğünü ve bu durumun çocuk için hak kaybı olduğunu kendisine söylerim.', clinicalValue: 100, aiTag: 'peer_supervision' },
          { label: 'Görmezden gelirim, yorulmuş olabilir.', clinicalValue: 10, aiTag: 'low_standard_acceptance' },
          { label: 'Veliye bu durumu hissettiririm.', clinicalValue: -20, aiTag: 'unprofessional_escalation' }
        ]
      },
      {
        id: 'stf_eth_10',
        text: 'Kurum dışından bir doktor, vakanıza bilimsel olmayan bir diyet veya ilaç önerdiğini veliden duydunuz. Ne yaparsınız?',
        options: [
          { label: 'Veliye kendi branşım dahilindeki bilimsel kanıtları sunar, doktorla iletişime geçip multidisipliner bir görüş talep ederim.', clinicalValue: 100, aiTag: 'active_advocacy' },
          { label: 'Tıbbi bir konu olduğu için asla karışmam.', clinicalValue: 30, aiTag: 'excessive_caution' },
          { label: '"Doktor yanılıyor" diyerek veliyi sertçe yönlendiririm.', clinicalValue: 40, aiTag: 'boundary_overstep' }
        ]
      }
    ]
  },

  // --- 3. TEKNO-PEDAGOJİK ADAPTASYON ---
  {
    id: 'academic_innovation',
    title: 'Tekno-Pedagojik Adaptasyon',
    description: 'Yapay zeka kullanımı, dijital veri takibi ve modern literatür entegrasyonu.',
    icon: '🚀',
    category: 'clinical',
    questions: [
      {
        id: 'stf_inn_1',
        text: 'AI tarafından hazırlanan bir BEP taslağında sizin düşünmediğiniz bir yöntem önerildiğini gördünüz. Yaklaşımınız?',
        options: [
          { label: 'Yöntemin bilimsel dayanağını (EBP) araştırır, vaka profiliyle eşleşiyorsa deneme oturumları başlatırım.', clinicalValue: 100, aiTag: 'innovative_expert' },
          { label: 'Makineler insan tecrübesinin yerini tutamaz, doğrudan silerim.', clinicalValue: 20, aiTag: 'cognitive_rigidity' },
          { label: 'Sorgulamadan plana dahil ederim, teknoloji her zaman haklıdır.', clinicalValue: 40, aiTag: 'loss_of_agency' }
        ]
      },
      {
        id: 'stf_inn_2',
        text: 'Dijital veri takip sisteminin (tablet) seans hızınızı kestiğini düşünüyorsunuz. Tavrınız?',
        options: [
          { label: 'Dijitalleşmenin anlık analiz için şart olduğunu kabul eder, sistemin geliştirilmesi için teknik birime geri bildirim veririm.', clinicalValue: 100, aiTag: 'proactive_tech_user' },
          { label: 'Eski usul kağıda devam eder, akşam sisteme toplu girerim.', clinicalValue: 50, aiTag: 'resistance_to_tech' },
          { label: 'Hiç veri tutmam, seansı zaten zihnimde tutuyorum.', clinicalValue: -50, aiTag: 'clinical_arrogance' }
        ]
      },
      {
        id: 'stf_inn_3',
        text: 'Veli, evde çocuk için "eğitici bir mobil oyun" kullanmak istediklerini sordu. Öneriniz?',
        options: [
          { label: 'Sadece "Ortak Dikkat" odaklı olanları, kısıtlı sürede ve veli eşliğinde kullanmalarını öneririm.', clinicalValue: 100, aiTag: 'balanced_pedagogy' },
          { label: 'Ekran her zaman zararlıdır, kesinlikle yasaklarım.', clinicalValue: 40, aiTag: 'traditional_bias' },
          { label: 'İstediğiniz kadar kullanabilir, çocuk en azından sessiz kalıyor.', clinicalValue: 0, aiTag: 'parent_appeasement' }
        ]
      },
      {
        id: 'stf_inn_4',
        text: 'Yeni bir bilimsel makalede yıllardır doğru bildiğiniz bir tekniğin "yanlış" olduğu açıklandı. Refleksiniz?',
        options: [
          { label: 'Makaleyi detaylıca analiz eder, literatürdeki diğer kanıtlarla kıyaslar ve gerekirse tekniğimi derhal güncellerim.', clinicalValue: 100, aiTag: 'high_learning_agility' },
          { label: 'Saha tecrübem akademik makaleden üstündür, bildiğimden şaşmam.', clinicalValue: 10, aiTag: 'expert_rigidity' },
          { label: 'Üzülürüm ama değişmem mümkün değil.', clinicalValue: 20, aiTag: 'emotional_fixation' }
        ]
      },
      {
        id: 'stf_inn_5',
        text: 'Seans sırasında internet kesildi ve dijital materyallere ulaşamıyorsunuz. Ne yaparsınız?',
        options: [
          { label: 'Hemen çevredeki somut nesneleri (kaşık, kalem, minder) kullanarak hedefleri oyunlaştırıp seansı sürdürürüm.', clinicalValue: 100, aiTag: 'resourceful_creativity' },
          { label: 'Seansı bitirir, telafi yazarım.', clinicalValue: 10, aiTag: 'tech_dependency' },
          { label: 'İnternetin gelmesini beklerken serbest zaman veririm.', clinicalValue: 30, aiTag: 'time_waste' }
        ]
      },
      {
        id: 'stf_inn_6',
        text: 'Kurumda kullanılan "Digital Twin" analiz modelinin sonuçlarına ne kadar güveniyorsunuz?',
        options: [
          { label: 'Bir veri seti olarak kabul eder, kendi klinik gözlemimle sentezleyerek kullanırım.', clinicalValue: 100, aiTag: 'critical_thinking' },
          { label: '%100 güvenirim, teknoloji hata yapmaz.', clinicalValue: 50, aiTag: 'over_reliance' },
          { label: 'Hiç güvenmem, tamamen gereksiz.', clinicalValue: 10, aiTag: 'luddite_tendency' }
        ]
      },
      {
        id: 'stf_inn_7',
        text: 'Karmaşık bir davranışın fonksiyonunu analiz etmek için AI destekli bir yazılım kullanırken yazılımın bariz bir hatasını fark ettiniz. Ne yaparsınız?',
        options: [
          { label: 'Hatayı rapor eder ve manuel analizime sadık kalarak seansı yönetirim.', clinicalValue: 100, aiTag: 'clinical_sovereignty' },
          { label: 'Yazılımı takip ederim, o benden akıllıdır.', clinicalValue: 20, aiTag: 'loss_of_agency' },
          { label: 'Analiz yapmaktan tamamen vazgeçerim.', clinicalValue: 0, aiTag: 'frustration_intolerance' }
        ]
      },
      {
        id: 'stf_inn_8',
        text: 'Uzaktan eğitim (Tele-health) seansı yaparken ekran başındaki vaka agresifleşti. İlk hamleniz?',
        options: [
          { label: 'Anında veliye koçluk yaparak fiziksel güvenliği sağlaması için net yönerge veririm.', clinicalValue: 100, aiTag: 'crisis_telehealth_mastery' },
          { label: 'Ekranda pekiştireç göstererek sakinleştirmeye çalışırım.', clinicalValue: 50, aiTag: 'distraction_logic' },
          { label: 'Kamerasını kapatmalarını söyler, seansı bitiririm.', clinicalValue: 10, aiTag: 'panic_response' }
        ]
      },
      {
        id: 'stf_inn_9',
        text: 'Vakanın gelişimi için "Göz Takip" (Eye tracking) cihazı gerektiğini düşünüyorsunuz ama kurumda yok. Çözümünüz?',
        options: [
          { label: 'Düşük maliyetli muadil bir manuel yöntem geliştirip verileri o şekilde toplamaya başlarım.', clinicalValue: 100, aiTag: 'pragmatic_innovation' },
          { label: 'Olsaydı yapardım der, vazgeçerim.', clinicalValue: 20, aiTag: 'passive_resignation' },
          { label: 'Kuruma zorla aldırmaya çalışırım.', clinicalValue: 40, aiTag: 'aggressive_advocacy' }
        ]
      },
      {
        id: 'stf_inn_10',
        text: 'BEP hazırlarken kopyala-yapıştır yerine AI ile "Vakaya Özel" içerik üretmek size ne hissettiriyor?',
        options: [
          { label: 'Her vakanın tekil bir nöral profil olduğunu kanıtlama fırsatı olarak görürüm.', clinicalValue: 100, aiTag: 'high_individualization' },
          { label: 'Zaman kaybı, eski taslaklar yeterliydi.', clinicalValue: 10, aiTag: 'low_professional_effort' },
          { label: 'Teknolojiye ayak uydurma zorunluluğu.', clinicalValue: 50, aiTag: 'duty_compliance' }
        ]
      }
    ]
  },

  // --- 4. MULTİDİSİPLİNER TAKIM VE MENTORLUK ---
  {
    id: 'team_and_mentorship',
    title: 'Multidisipliner Takım ve Mentorluk',
    description: 'Ekip içi geri bildirim, stajyer yönetimi ve kriz anında liderlik.',
    icon: '🤝',
    category: 'team',
    questions: [
      {
        id: 'stf_team_1',
        text: 'Ergoterapist meslektaşınız sizin vakanızın davranışına yanlış müdahale ettiğini gördünüz. Tavrınız?',
        options: [
          { label: 'Bir vaka toplantısı talep eder ve bilimsel verilerle "Davranış Analitik" bakış açısını ekipçe tartışmaya açarım.', clinicalValue: 100, aiTag: 'collaborative_leadership' },
          { label: 'Herkes kendi işine baksın, karışmam.', clinicalValue: 20, aiTag: 'silo_mentality' },
          { label: 'Veliye "o hoca yanlış yapıyor" derim.', clinicalValue: -100, aiTag: 'unprofessional_sabotage' }
        ]
      },
      {
        id: 'stf_team_2',
        text: 'Altınızda çalışan bir stajyer, verdiğiniz bir klinik talimatın "gereksiz" olduğunu iddia ediyor. Nasıl yönetirsiniz?',
        options: [
          { label: 'Talimatın klinik nedenselliğini (literatür desteğini) açıklar ve sonucunu veriyle görmesi için bir şans tanırım.', clinicalValue: 100, aiTag: 'mentorship_excellence' },
          { label: '"Ben ne diyorsam o" diyerek otoritemi kurarım.', clinicalValue: 20, aiTag: 'authoritarian_bias' },
          { label: 'Gidip staj koordinatörüne şikayet ederim.', clinicalValue: 40, aiTag: 'responsibility_shift' }
        ]
      },
      {
        id: 'stf_team_3',
        text: 'Ekip içi bir toplantıda fikriniz sertçe eleştirildi. Duygusal regülasyonunuz?',
        options: [
          { label: 'Eleştiriyi teknik bir geri bildirim olarak not alır, rasyonel kısımları planıma entegre ederim.', clinicalValue: 100, aiTag: 'high_emotional_intelligence' },
          { label: 'Savunmaya geçer ve karşılık veririm.', clinicalValue: 30, aiTag: 'defensive_mechanism' },
          { label: 'Sessiz kalıp toplantı sonrası küserim.', clinicalValue: 10, aiTag: 'passive_aggressive' }
        ]
      },
      {
        id: 'stf_team_4',
        text: 'Kuruma yeni katılan bir uzman, vakaların yarısını "elinden aldığınızı" hissediyor ve size soğuk davranıyor. Aksiyonunuz?',
        options: [
          { label: 'Kendisine vaka devir süreçlerini şeffaflıkla anlatır, mentorluk yapmayı ve iş yükünü paylaşmayı teklif ederim.', clinicalValue: 100, aiTag: 'team_stabilizer' },
          { label: 'Rekabete hazırım, ben daha iyiyim.', clinicalValue: 20, aiTag: 'toxic_competitiveness' },
          { label: 'Ben de ona soğuk davranırım.', clinicalValue: 10, aiTag: 'emotional_instability' }
        ]
      },
      {
        id: 'stf_team_5',
        text: 'Vaka toplantısında vakanın ilerlemediği konuşuluyor ve sorumluluk size atılmak isteniyor. Savunmanız?',
        options: [
          { label: 'Tüm seans verilerimi, video kayıtlarımı ve çevresel değişkenleri masaya yatırıp analiz talep ederim.', clinicalValue: 100, aiTag: 'evidence_based_defense' },
          { label: '"Çocuk artık öğrenemiyor" diyerek vakanın üzerine atarım.', clinicalValue: 0, aiTag: 'blaming_victim' },
          { label: 'Başka hocaların hatalarını anlatmaya başlarım.', clinicalValue: 20, aiTag: 'diversion_tactic' }
        ]
      },
      {
        id: 'stf_team_6',
        text: 'Kurumda herkesin stresli olduğu bir dönemde, bir arkadaşınızın seans arası ağladığını gördünüz. Ne yaparsınız?',
        options: [
          { label: 'Kısa bir mola alır, aktif dinleme yapar ve gerekiyorsa yönetimle "iş yükü optimizasyonu" konuşurum.', clinicalValue: 100, aiTag: 'empathetic_colleague' },
          { label: 'Seansım var, geçer giderim.', clinicalValue: 30, aiTag: 'clinical_detachment' },
          { label: 'Neden ağladığını hemen herkese anlatırım.', clinicalValue: -50, aiTag: 'toxic_gossip' }
        ]
      },
      {
        id: 'stf_team_7',
        text: 'Akademik kurul bir metodun değişmesine karar verdi ama siz bu değişimin yanlış olduğunu düşünüyorsunuz. Ne yaparsınız?',
        options: [
          { label: 'Karara saygı duyup uygularım ancak karşıt görüşümü veriye dayalı bir raporla kurula sunarım.', clinicalValue: 100, aiTag: 'constructive_dissent' },
          { label: 'Gizlice eski yöntemi uygulamaya devam ederim.', clinicalValue: 10, aiTag: 'procedural_subversion' },
          { label: 'Sorgulamadan "emredersiniz" derim.', clinicalValue: 50, aiTag: 'blind_compliance' }
        ]
      },
      {
        id: 'stf_team_8',
        text: 'Bir stajyerin, veliyle aşırı samimi (sınırı aşan) konuştuğunu duydunuz. Mentörlük hamleniz?',
        options: [
          { label: 'Veliye çaktırmadan stajyeri odaya çeker ve "Profesyonel Mesafe" protokolünü hatırlatırım.', clinicalValue: 100, aiTag: 'clinical_boundary_mentor' },
          { label: 'Herkesin önünde azarlarım.', clinicalValue: 10, aiTag: 'public_humiliation_bias' },
          { label: 'Önemsemem, sonuçta stajyer.', clinicalValue: 20, aiTag: 'supervisory_neglect' }
        ]
      },
      {
        id: 'stf_team_9',
        text: 'Ekibe yeni katılan bir uzmana ilk tavsiyeniz ne olur?',
        options: [
          { label: '"Veri her şeydir, çocukla bağ kur ama veriye sadık kal."', clinicalValue: 100, aiTag: 'high_standard_transfer' },
          { label: '"Burada çok yorulursun, dikkat et."', clinicalValue: 20, aiTag: 'pessimistic_onboarding' },
          { label: '"Müdürle aranı iyi tut."', clinicalValue: 40, aiTag: 'political_survivalism' }
        ]
      },
      {
        id: 'stf_team_10',
        text: 'Başarılı bir seans sonrası ekip arkadaşınızın başarısını nasıl kutlarsınız?',
        options: [
          { label: 'Ekip içinde başarısını takdir eder, hangi tekniği kullandığını öğrenip kendime katmaya çalışırım.', clinicalValue: 100, aiTag: 'growth_mindset_colleague' },
          { label: 'Kıskanırım ve sessiz kalırım.', clinicalValue: 10, aiTag: 'covert_hostility' },
          { label: '"Şanslıydın" der geçerim.', clinicalValue: 0, aiTag: 'belittling_bias' }
        ]
      }
    ]
  },

  // --- 5. KRİZ LİDERLİĞİ VE VELİ DİPLOMASİSİ ---
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

  // --- 6. AKADEMİK MÜDAHALE VE NÖRO-PEDAGOJİK ÇÖZÜMLER (TÜRKÇE & MATEMATİK) ---
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
