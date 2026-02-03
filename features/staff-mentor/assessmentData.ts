
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v5.0 - DEVASAL GÜNCELLEME)
 * Bu veri seti, personelin kurum içindeki evrimini, etik/teknik reflekslerini ve stres toleransını ölçer.
 */
export const MODULAR_BATTERIES: AssessmentBattery[] = [
  // --- 1. KATEGORİ: İLERİ ABA VE KLİNİK KARAR MEKANİZMALARI (10 SORU) ---
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
          { label: 'Müdürün talimatına uyar seansı bitiririm; kurumsal hiyerarşi klinik süreçten önceliklidir.', clinicalValue: 30, aiTag: 'hierarchical_compliance' },
          { label: 'Sönme prosedürünün bu aşamada kesilmesinin davranışı daha dirençli hale getireceğini nazikçe açıklar ve devam ederim.', clinicalValue: 100, aiTag: 'clinical_integrity' },
          { label: 'Müdürü odaya davet edip süreci yönetmesini isterim.', clinicalValue: 10, aiTag: 'responsibility_shift' },
          { label: 'Sessiz kalması için çocuğa o an talep etmediği bir ödül vererek sakinleştiririm.', clinicalValue: 0, aiTag: 'unintentional_reinforcement' }
        ]
      },
      {
        id: 'stf_aba_2',
        text: 'Veri formunda 3 hafta boyunca "Beceriyi Tamamladı" görünen bir vakanın, genelleme oturumunda beceriyi sergileyemediğini gördünüz. İlk analiziniz?',
        options: [
          { label: 'Önceki verilerin yanlış girildiğinden veya şişirildiğinden şüphelenirim; veri sadakati denetimi başlatırım.', clinicalValue: 90, aiTag: 'skepticism_and_audit' },
          { label: 'Çocuğun o günkü duyusal durumunun veya motivasyonunun (MO) düşük olduğunu varsayarım.', clinicalValue: 40, aiTag: 'external_attribution' },
          { label: 'Genelleme planının en baştan yanlış kurgulandığını kabul eder, müdahale protokolünü revize ederim.', clinicalValue: 100, aiTag: 'systemic_thinking' },
          { label: 'Beceriyi tekrar öğretim aşamasına (Acquisition) geri çekerim.', clinicalValue: 60, aiTag: 'safe_regression' }
        ]
      },
      {
        id: 'stf_aba_3',
        text: 'Vaka "İlgi Elde Etme" işlevli bir davranış sergilerken, yanlışlıkla bir stajyerin çocuğa gülümsediğini fark ettiniz. Aksiyonunuz?',
        options: [
          { label: 'Seans sonu stajyeri sertçe uyarırım.', clinicalValue: 20, aiTag: 'reactive_mentorship' },
          { label: 'Hemen o an stajyere bakmayarak "görmezden gelme" modellemesi yapar, pekiştirmeyi nötralize ederim.', clinicalValue: 100, aiTag: 'immediate_modeling' },
          { label: 'Davranışı "Kaçınma" olarak yeniden tanımlarım.', clinicalValue: 0, aiTag: 'diagnostic_error' },
          { label: 'Gülümsemenin terapötik bağı güçlendirdiğini düşünerek müdahale etmem.', clinicalValue: 10, aiTag: 'clinical_laxity' }
        ]
      },
      {
        id: 'stf_aba_4',
        text: 'Pekiştireç olarak kullanılan çikolatanın çocukta doygunluk (Satiation) yarattığını fark ettiniz ama başka bir uyaran ilgisini çekmiyor. Ne yaparsınız?',
        options: [
          { label: 'Çikolata vermeye devam ederim ancak miktarı azaltırım.', clinicalValue: 30, aiTag: 'low_innovation' },
          { label: 'Deprivasyon (yoksunluk) stratejisi uygulayarak pekiştirecin değerini artırmaya çalışırım.', clinicalValue: 60, aiTag: 'behavioral_manipulation' },
          { label: 'Pekiştireç eşlemesi (Reinforcer Pairing) yaparak sosyal pekiştireçlerin değerini artırmaya odaklanırım.', clinicalValue: 100, aiTag: 'advanced_aba_pairing' },
          { label: 'Seansı o gün için oyun odaklı sürdürürüm.', clinicalValue: 20, aiTag: 'session_dilution' }
        ]
      },
      {
        id: 'stf_aba_5',
        text: 'Grafik analizinde verilerin çok değişken (Variable) olduğunu gördünüz. Bu değişkenliğin ana sebebi ne olabilir?',
        options: [
          { label: 'Uygulayıcılar arası güvenirlik (IOA) düşüktür; her öğretmen farklı puanlıyordur.', clinicalValue: 100, aiTag: 'ioa_alert' },
          { label: 'Çocukta nörolojik bir dalgalanma vardır.', clinicalValue: 40, aiTag: 'biological_bias' },
          { label: 'Materyaller çocuk için sıkıcı hale gelmiştir.', clinicalValue: 50, aiTag: 'stimulus_fatigue' },
          { label: 'Hafta sonu tatili genellemeyi bozmuştur.', clinicalValue: 30, aiTag: 'environmental_noise' }
        ]
      },
      {
        id: 'stf_aba_6',
        text: 'Yeni başlayan bir vakada "Hatalı Öğretim" yerine "Hatasız Öğretim" (Errorless) seçmenizin en temel klinik gerekçesi ne olabilir?',
        options: [
          { label: 'Dersin daha hızlı bitmesini sağlamak.', clinicalValue: 0, aiTag: 'efficiency_bias' },
          { label: 'Hata birikimini (Error patterns) engelleyerek öğrencinin motivasyonel direncini kırmamak.', clinicalValue: 100, aiTag: 'pedagogical_foresight' },
          { label: 'Ailenin başarı görmesini sağlamak.', clinicalValue: 20, aiTag: 'parent_pleasing' },
          { label: 'Daha az materyal kullanmak.', clinicalValue: 0, aiTag: 'resource_saving' }
        ]
      },
      {
        id: 'stf_aba_7',
        text: 'DTT (Ayrık Denemelerle Öğretim) oturumunda öğrenci 5 deneme üst üste başarısız oldu. İpucu hiyerarşisinde hamleniz?',
        options: [
          { label: 'Denemeyi sonlandırıp farklı bir beceriye geçerim.', clinicalValue: 20, aiTag: 'avoidance' },
          { label: 'En yoğun ipucuna (Full Physical) geri dönüp başarıyı garantilerim.', clinicalValue: 100, aiTag: 'correct_prompt_hierarchy' },
          { label: 'Öğrenciye "hayır" diyerek hatasını bildiririm.', clinicalValue: 10, aiTag: 'punishment_bias' },
          { label: 'Aynı ipucu seviyesinde ısrar ederim.', clinicalValue: 0, aiTag: 'instructional_rigidity' }
        ]
      },
      {
        id: 'stf_aba_8',
        text: 'Öğrencinin serbest zaman oyununda, seans hedeflerinden biri olan "Göz Kontağı" kurduğunu gördünüz ancak yanınızda veri formu yok. Ne yaparsınız?',
        options: [
          { label: 'Veriyi girmem, sadece kayıtlı oturumlar geçerlidir.', clinicalValue: 20, aiTag: 'bureaucratic_rigidity' },
          { label: 'Olayı zihnime not eder, seans sonu "tahmini" bir veri girerim.', clinicalValue: 40, aiTag: 'low_data_fidelity' },
          { label: 'Hemen bir kağıda not alıp daha sonra "Fırsat Öğretimi" (NET) verisi olarak sisteme mühürlerim.', clinicalValue: 100, aiTag: 'high_clinical_vigilance' },
          { label: 'Ailesine anlatırım ama sisteme girmem.', clinicalValue: 50, aiTag: 'informal_communication' }
        ]
      },
      {
        id: 'stf_aba_9',
        text: 'Karmaşık bir zincirleme beceride (örn: El yıkama) çocuk orta aşamada takılıyor. Geriye Zincirleme mi, İleriye mi?',
        options: [
          { label: 'Her zaman ileriye zincirleme en doğrusudur.', clinicalValue: 30, aiTag: 'theoretical_dogmatism' },
          { label: 'Öğrenci başarı odaklıysa ve son adımı yapınca pekişiyorsa Geriye Zincirleme seçerim.', clinicalValue: 100, aiTag: 'functional_logic' },
          { label: 'Tüm aşamaları aynı anda çalışırım (Total Task).', clinicalValue: 70, aiTag: 'generalist_approach' },
          { label: 'Beceriyi rafa kaldırırım.', clinicalValue: 0, aiTag: 'pedagogical_surrender' }
        ]
      },
      {
        id: 'stf_aba_10',
        text: 'Bir davranışın işlevini belirlemek için ABC kaydı tutarken "Sonuç" (Consequence) kısmına ne yazılmalıdır?',
        options: [
          { label: 'Çocuğun o anki duygusal durumu.', clinicalValue: 10, aiTag: 'subjective_bias' },
          { label: 'Davranıştan hemen sonra çevrede değişen somut durum (örn: oyuncak verildi).', clinicalValue: 100, aiTag: 'objective_observation' },
          { label: 'Öğretmenin niyet ve düşüncesi.', clinicalValue: 0, aiTag: 'introspective_error' },
          { label: 'Veliye verilen geri bildirim.', clinicalValue: 20, aiTag: 'process_confusion' }
        ]
      }
    ]
  },

  // --- 2. KATEGORİ: ETİK TAHKİM VE PROFESYONEL MESAFE (10 SORU) ---
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
          { label: 'Terapötik bağı güçlendirmek için bir kez giderim.', clinicalValue: 20, aiTag: 'dual_relationship_risk' },
          { label: 'Nazikçe teşekkür eder, kurum politikası gereği ailelerle sosyal ilişki kuramadığımı net bir dille açıklarım.', clinicalValue: 100, aiTag: 'ethical_boundaries' },
          { label: 'Giderim ama işle ilgili konuşmam.', clinicalValue: 10, aiTag: 'boundary_erosion' },
          { label: 'Müdüre sorup onay verirse giderim.', clinicalValue: 40, aiTag: 'responsibility_avoidance' }
        ]
      },
      {
        id: 'stf_eth_2',
        text: 'Sosyal medyada bir vakanızın fotoğrafını (ailesi izin vermiş olsa bile) kendi kişisel hesabınızda paylaşmak istiyorsunuz. Etik duruşunuz?',
        options: [
          { label: 'Ailesi izin verdiyse sorun yoktur, paylaşırım.', clinicalValue: 30, aiTag: 'legal_but_unethical' },
          { label: 'Kendi profesyonel gelişimim ve reklamım için önemlidir, paylaşırım.', clinicalValue: 10, aiTag: 'narcissistic_bias' },
          { label: 'Vakanın gelecekteki onurunu ve mahremiyetini düşünerek, izin olsa dahi kişisel hesapta paylaşımı reddederim.', clinicalValue: 100, aiTag: 'supreme_confidentiality' },
          { label: 'Yüzünü kapatarak paylaşırım.', clinicalValue: 50, aiTag: 'grey_zone_ethics' }
        ]
      },
      {
        id: 'stf_eth_3',
        text: 'Bir vaka hakkında başka bir uzmanla (kurum dışı) telefonda konuşurken yanınızda başka bir velinin olduğunu fark ettiniz. Ne yaparsınız?',
        options: [
          { label: 'İsim vermediğim sürece konuşmaya devam ederim.', clinicalValue: 40, aiTag: 'risky_confidentiality' },
          { label: 'Konuşmayı hemen sonlandırır, gizli bilgilerin duyulmadığından emin olurum.', clinicalValue: 100, aiTag: 'privacy_first' },
          { label: 'Kısık sesle konuşurum.', clinicalValue: 20, aiTag: 'negligent_boundary' },
          { label: 'Veliden uzaklaşarak devam ederim.', clinicalValue: 70, aiTag: 'reactive_privacy' }
        ]
      },
      {
        id: 'stf_eth_4',
        text: 'Kurumda bir arkadaşınızın seanslara sürekli geç girdiğini ama raporları tam süreli girdiğini gördünüz. Aksiyonunuz?',
        options: [
          { label: 'Onu korumak için susarım, hepimiz bazen geç kalırız.', clinicalValue: 0, aiTag: 'unethical_loyalty' },
          { label: 'Önce kendisini uyarırım, düzelmezse akademik direktöre mühürlü bir rapor sunarım.', clinicalValue: 100, aiTag: 'whistleblowing_integrity' },
          { label: 'Ben de geç girmeye başlarım.', clinicalValue: -50, aiTag: 'toxic_emulation' },
          { label: 'Velilere bu durumu hissettiririm.', clinicalValue: -20, aiTag: 'passive_aggressive' }
        ]
      },
      {
        id: 'stf_eth_5',
        text: 'Veli, çocuğuna özel ders vermeniz için size kurumun verdiği maaşın 3 katını teklif etti. Kararınız?',
        options: [
          { label: 'Kurumun haberi olmadan gizlice kabul ederim.', clinicalValue: -200, aiTag: 'severe_ethical_violation' },
          { label: 'Kuruma durumu bildirir, istifa ederek devam ederim.', clinicalValue: 30, aiTag: 'mercenary_mindset' },
          { label: 'Teklifi reddederim; aynı vakaya hem kurumda hem özelde bakmanın çıkar çatışması (Conflict of Interest) yarattığını açıklarım.', clinicalValue: 100, aiTag: 'immaculate_integrity' },
          { label: 'Ücreti kurum üzerinden geçirmeyi teklif ederim.', clinicalValue: 60, aiTag: 'procedural_solution' }
        ]
      },
      {
        id: 'stf_eth_6',
        text: 'Bir vakanın ilerlemediğini biliyorsunuz ancak yönetim veliyi tutmak için raporda "harika gidiyor" yazmanızı istiyor. Ne yaparsınız?',
        options: [
          { label: 'Yönetime uyarım, sonuçta kurumun geliri vakanın devamına bağlıdır.', clinicalValue: 0, aiTag: 'corporate_servitude' },
          { label: 'Sadece nesnel verileri yazarım, yorum yapmaktan kaçınırım.', clinicalValue: 70, aiTag: 'neutral_avoidance' },
          { label: 'Gerçek verileri yazar ve gerekçelendiririm; akademik yalanın klinik bir suç olduğunu savunurum.', clinicalValue: 100, aiTag: 'academic_honesty' },
          { label: 'Raporu yazmayı reddedip başka bir hocaya devrederim.', clinicalValue: 20, aiTag: 'conflict_avoidance' }
        ]
      },
      {
        id: 'stf_eth_7',
        text: 'Eski bir iş arkadaşınız, kurumun "Vaka Listesi"ni kendi yeni açacağı merkez için istedi. Tavrınız?',
        options: [
          { label: 'Dostluk hatırına en azından iletişim bilgilerini veririm.', clinicalValue: -100, aiTag: 'data_theft_complicity' },
          { label: 'Durumu anında bilişim güvenliği birimine ve yönetime raporlarım; veri mahremiyeti her şeyin üstündedir.', clinicalValue: 100, aiTag: 'institutional_guardian' },
          { label: 'Vermem ama durumu kimseye de söylemem.', clinicalValue: 40, aiTag: 'passive_protection' },
          { label: 'Sadece kendi vakalarımı veririm.', clinicalValue: -50, aiTag: 'limited_violation' }
        ]
      },
      {
        id: 'stf_eth_8',
        text: 'Seans esnasında vakanın vücudunda şüpheli morluklar gördünüz ve veli "yataktan düştü" dedi ama şüpheniz var. İlk adım?',
        options: [
          { label: 'Velinin beyanına güvenirim, aile içi meseledir.', clinicalValue: 0, aiTag: 'neglect_of_duty' },
          { label: 'Morlukların fotoğrafını çeker ve durumu derhal "Çocuk Koruma Protokolü" kapsamında yönetime ve sosyal hizmetlere bildiririm.', clinicalValue: 100, aiTag: 'high_legal_responsibility' },
          { label: 'Bir sonraki seansı bekleyip takip ederim.', clinicalValue: 20, aiTag: 'unjustified_delay' },
          { label: 'Hastaneye götürmelerini öneririm.', clinicalValue: 40, aiTag: 'vague_intervention' }
        ]
      },
      {
        id: 'stf_eth_9',
        text: 'Bir uzman arkadaşınızın seans sırasında telefonla oynadığını gördünüz. Tepkiniz?',
        options: [
          { label: 'Görmezden gelirim, yorulmuş olabilir.', clinicalValue: 10, aiTag: 'low_standard_acceptance' },
          { label: 'Uygun bir dille seans kalitesinin düştüğünü ve bu durumun çocuk için hak kaybı olduğunu kendisine söylerim.', clinicalValue: 100, aiTag: 'peer_supervision' },
          { label: 'Ben de telefona bakmaya başlarım.', clinicalValue: -50, aiTag: 'toxic_normalization' },
          { label: 'Veliye şikayet ederim.', clinicalValue: -20, aiTag: 'unprofessional_escalation' }
        ]
      },
      {
        id: 'stf_eth_10',
        text: 'Kurum dışından bir doktor, sizin vakanıza uygun olmayan bir ilaç veya diyet önerdiğini veliden duydunuz. Ne yaparsınız?',
        options: [
          { label: 'Tıbbi bir konu olduğu için karışmam.', clinicalValue: 30, aiTag: 'excessive_caution' },
          { label: 'Veliye kendi branşım dahilindeki bilimsel kanıtları sunar, doktorla iletişime geçip multidisipliner bir görüş talep ederim.', clinicalValue: 100, aiTag: 'active_advocacy' },
          { label: '"Doktor yanılıyor" diyerek veliyi yönlendiririm.', clinicalValue: 10, aiTag: 'overstepping_boundaries' },
          { label: 'İlacı bırakmalarını söylerim.', clinicalValue: 0, aiTag: 'malpractice_risk' }
        ]
      }
    ]
  },

  // --- 3. KATEGORİ: TEKNO-PEDAGOJİK ADAPTASYON (10 SORU) ---
  {
    id: 'academic_innovation',
    title: 'Tekno-Pedagojik Adaptasyon',
    description: 'Yapay zeka kullanımı, dijital veri takibi ve modern literatür entegrasyonu.',
    icon: '🚀',
    category: 'clinical',
    questions: [
      {
        id: 'stf_inn_1',
        text: 'Yapay zekanın hazırladığı bir BEP taslağında sizin düşünmediğiniz bir yöntem önerildiğini gördünüz. Yaklaşımınız?',
        options: [
          { label: 'Makineler insan tecrübesinin yerini tutamaz, doğrudan silerim.', clinicalValue: 10, aiTag: 'cognitive_rigidity' },
          { label: 'Yöntemin bilimsel dayanağını (EBP) araştırır, vaka profiliyle eşleşiyorsa deneme oturumları başlatırım.', clinicalValue: 100, aiTag: 'innovative_expert' },
          { label: 'Sorgulamadan plana dahil ederim, AI her zaman haklıdır.', clinicalValue: 30, aiTag: 'blind_acceptance' },
          { label: 'Sadece sunum amaçlı raporda tutarım.', clinicalValue: 0, aiTag: 'dishonest_reporting' }
        ]
      },
      {
        id: 'stf_inn_2',
        text: 'Dijital veri takip sisteminin (tablet) seans hızınızı kestiğini düşünüyorsunuz. Tavrınız?',
        options: [
          { label: 'Eski usul kağıda devam ederim, akşam sisteme toplu girerim.', clinicalValue: 30, aiTag: 'resistance_to_tech' },
          { label: 'Dijitalleşmenin anlık analiz için şart olduğunu kabul eder, sistemin geliştirilmesi için BT birimine analitik geri bildirim veririm.', clinicalValue: 100, aiTag: 'proactive_tech_user' },
          { label: 'Hiç veri tutmam, zaten seansı biliyorum.', clinicalValue: -50, aiTag: 'clinical_arrogance' },
          { label: 'Sistemi sadece göstermelik kullanırım.', clinicalValue: 10, aiTag: 'passive_resistance' }
        ]
      },
      {
        id: 'stf_inn_3',
        text: 'Bir vakanın ailesi, evde çocuk için "eğitici bir mobil oyun" kullanmak istediklerini sordu. Öneriniz?',
        options: [
          { label: 'Ekran her zaman zararlıdır, asla kullanmayın.', clinicalValue: 20, aiTag: 'traditional_bias' },
          { label: 'Sadece "Ortak Dikkat" veya "Sıra Alma" odaklı olanları, kısıtlı sürede ve eşlik ederek kullanmalarını öneririm.', clinicalValue: 100, aiTag: 'balanced_pedagogy' },
          { label: 'İstediğiniz kadar kullanabilir, çocuk en azından sessiz kalıyor.', clinicalValue: 0, aiTag: 'parent_appeasement' },
          { label: 'Kurumun kendi oyunlarını kullanın.', clinicalValue: 60, aiTag: 'institutional_bias' }
        ]
      },
      {
        id: 'stf_inn_4',
        text: 'Yeni bir bilimsel makalede yıllardır doğru bildiğiniz bir tekniğin "yanlış" olduğu açıklandı. Refleksiniz?',
        options: [
          { label: 'Benim saha tecrübem akademik makaleden daha üstündür.', clinicalValue: 10, aiTag: 'expert_rigidity' },
          { label: 'Makaleyi detaylıca analiz eder, literatürdeki diğer kanıtlarla kıyaslar ve gerekirse tekniğimi derhal güncellerim.', clinicalValue: 100, aiTag: 'high_learning_agility' },
          { label: 'Üzülürüm ama değişemem.', clinicalValue: 20, aiTag: 'emotional_attachment' },
          { label: 'Sadece müdür zorlarsa değişirim.', clinicalValue: 30, aiTag: 'external_control' }
        ]
      },
      {
        id: 'stf_inn_5',
        text: 'Seans sırasında internet kesildi ve dijital materyallere ulaşamıyorsunuz. Ne yaparsınız?',
        options: [
          { label: 'Seansı bitirir, telafi yazarım.', clinicalValue: 0, aiTag: 'tech_dependency' },
          { label: 'Hemen çevredeki somut nesneleri (kaşık, kalem, minder) kullanarak hedefleri oyunlaştırıp sürdürürüm.', clinicalValue: 100, aiTag: 'resourceful_creativity' },
          { label: 'İnternetin gelmesini beklerken serbest zaman veririm.', clinicalValue: 20, aiTag: 'time_waste' },
          { label: 'Veliye şikayet ederim.', clinicalValue: 10, aiTag: 'blaming_environment' }
        ]
      },
      {
        id: 'stf_inn_6',
        text: 'Kurumda kullanılan "Digital Twin" analiz modelinin sonuçlarına ne kadar güveniyorsunuz?',
        options: [
          { label: '%100 güvenirim, teknoloji hata yapmaz.', clinicalValue: 40, aiTag: 'over_reliance' },
          { label: 'Bir veri seti olarak kabul eder, kendi klinik gözlemimle sentezleyerek kullanırım.', clinicalValue: 100, aiTag: 'critical_thinking' },
          { label: 'Hiç güvenmem, saçmalık.', clinicalValue: 10, aiTag: 'luddite_tendency' },
          { label: 'Sadece yüksek skor verirse inanırım.', clinicalValue: 20, aiTag: 'confirmation_bias' }
        ]
      },
      {
        id: 'stf_inn_7',
        text: 'Karmaşık bir davranışın fonksiyonunu analiz etmek için AI destekli bir yazılım kullanırken yazılımın hatasını fark ettiniz. Ne yaparsınız?',
        options: [
          { label: 'Yazılımı takip ederim, o benden akıllıdır.', clinicalValue: 10, aiTag: 'loss_of_agency' },
          { label: 'Hatayı rapor eder ve manuel analizime sadık kalarak seansı yönetirim.', clinicalValue: 100, aiTag: 'clinical_sovereignty' },
          { label: 'Analiz yapmaktan vazgeçerim.', clinicalValue: 0, aiTag: 'frustration_intolerance' },
          { label: 'Yazılımı silerim.', clinicalValue: 20, aiTag: 'reactive_behavior' }
        ]
      },
      {
        id: 'stf_inn_8',
        text: 'Uzaktan eğitim (Tele-health) seansı yaparken ekran başındaki vaka agresifleşti. İlk hamleniz?',
        options: [
          { label: 'Bilgisayarı kapatırım.', clinicalValue: 0, aiTag: 'panic_response' },
          { label: 'Ekranda pekiştireç göstererek sakinleştirmeye çalışırım.', clinicalValue: 50, aiTag: 'distraction_method' },
          { label: 'Anında veliye koçluk yaparak (Parent coaching) fiziksel güvenliği sağlaması için yönerge veririm.', clinicalValue: 100, aiTag: 'crisis_telehealth_mastery' },
          { label: 'Kamerasını kapatmalarını söylerim.', clinicalValue: 10, aiTag: 'visual_denial' }
        ]
      },
      {
        id: 'stf_inn_9',
        text: 'Vakanın gelişimi için "Göz Takip" (Eye tracking) cihazı kullanılması gerektiğini düşünüyorsunuz ama kurumda yok. Çözümünüz?',
        options: [
          { label: 'Olsaydı yapardım der, vazgeçerim.', clinicalValue: 20, aiTag: 'passive_limit' },
          { label: 'Düşük maliyetli muadil bir manuel yöntem geliştirip verileri o şekilde toplamaya başlarım.', clinicalValue: 100, aiTag: 'pragmatic_innovation' },
          { label: 'Kuruma zorla aldırmaya çalışırım.', clinicalValue: 40, aiTag: 'aggressive_advocacy' },
          { label: 'Cihazı velinin almasını şart koşarım.', clinicalValue: 10, aiTag: 'financial_pressure_on_parent' }
        ]
      },
      {
        id: 'stf_inn_10',
        text: 'BEP hazırlarken kopyala-yapıştır yerine AI ile "Vakaya Özel" içerik üretmek size ne hissettiriyor?',
        options: [
          { label: 'Zaman kaybı, eski taslaklar yeterli.', clinicalValue: 10, aiTag: 'low_professional_effort' },
          { label: 'Her vakanın tekil bir nöral profil olduğunu kanıtlama fırsatı olarak görürüm.', clinicalValue: 100, aiTag: 'high_individualization' },
          { label: 'Teknolojiye ayak uydurma zorunluluğu.', clinicalValue: 50, aiTag: 'duty_compliance' },
          { label: 'Karmaşık ve yorucu.', clinicalValue: 20, aiTag: 'low_stamina' }
        ]
      }
    ]
  },

  // --- 4. KATEGORİ: MULTİDİSİPLİNER TAKIM VE MENTORLUK (10 SORU) ---
  {
    id: 'team_and_mentorship',
    title: 'Multidisipliner Takım ve Mentorluk',
    description: 'Ekip içi geri bildirim, stajyer yönetimi ve kriz anında liderlik.',
    icon: '🤝',
    category: 'team',
    questions: [
      {
        id: 'stf_team_1',
        text: 'Başka bir branştan (örn: Ergoterapist) meslektaşınız sizin vakanızın davranışına yanlış müdahale ettiğini gördünüz. Tavrınız?',
        options: [
          { label: 'Herkes kendi işine baksın, karışmam.', clinicalValue: 10, aiTag: 'silo_mentality' },
          { label: 'Bir vaka toplantısı talep eder ve bilimsel verilerle "Davranış Analitik" bakış açısını ekipçe tartışmaya açarım.', clinicalValue: 100, aiTag: 'collaborative_leadership' },
          { label: 'Veliye "o hoca yanlış yapıyor" derim.', clinicalValue: -50, aiTag: 'unprofessional_sabotage' },
          { label: 'Özelde kendisine gülerek hatasını söylerim.', clinicalValue: 40, aiTag: 'informal_correction' }
        ]
      },
      {
        id: 'stf_team_2',
        text: 'Altınızda çalışan bir stajyer, verdiğiniz bir klinik talimatın "gereksiz" olduğunu iddia ediyor. Nasıl yönetirsiniz?',
        options: [
          { label: '"Ben ne diyorsam o" diyerek otoritemi kurarım.', clinicalValue: 10, aiTag: 'authoritarian_bias' },
          { label: 'Talimatın klinik nedenselliğini (literatür desteğini) açıklar ve sonucunu veriyle görmesi için bir şans tanırım.', clinicalValue: 100, aiTag: 'mentorship_excellence' },
          { label: 'Görmezden gelirim.', clinicalValue: 20, aiTag: 'avoidance' },
          { label: 'Stajını sonlandırırım.', clinicalValue: 0, aiTag: 'ego_driven_decision' }
        ]
      },
      {
        id: 'stf_team_3',
        text: 'Ekip içi bir toplantıda fikriniz sertçe eleştirildi. Duygusal regülasyonunuz?',
        options: [
          { label: 'Savunmaya geçer ve karşılık veririm.', clinicalValue: 20, aiTag: 'defensive_mechanism' },
          { label: 'Eleştiriyi teknik bir geri bildirim olarak not alır, rasyonel kısımları planıma entegre ederim.', clinicalValue: 100, aiTag: 'high_emotional_intelligence' },
          { label: 'Küserim ve toplantıyı terk ederim.', clinicalValue: 0, aiTag: 'emotional_instability' },
          { label: 'Sessiz kalıp intikam planlarım.', clinicalValue: -20, aiTag: 'passive_aggressive' }
        ]
      },
      {
        id: 'stf_team_4',
        text: 'Kuruma yeni katılan bir uzman, vakaların yarısını "elinden aldığını" hissediyor ve size soğuk davranıyor. Aksiyonunuz?',
        options: [
          { label: 'Rekabete hazırım, ben daha iyiyim.', clinicalValue: 10, aiTag: 'toxic_competitiveness' },
          { label: 'Kendisine vaka devir süreçlerini şeffaflıkla anlatır, mentorluk yapmayı ve iş yükünü paylaşmayı teklif ederim.', clinicalValue: 100, aiTag: 'team_stabilizer' },
          { label: 'Ben de ona soğuk davranırım.', clinicalValue: 20, aiTag: 'reactive_empathy' },
          { label: 'Müdüre şikayet ederim.', clinicalValue: 30, aiTag: 'escalation_bias' }
        ]
      },
      {
        id: 'stf_team_5',
        text: 'Vaka toplantısında vakanın ilerlemediği konuşuluyor ve sorumluluk size atılmak isteniyor. Savunmanız?',
        options: [
          { label: '"Çocukta iş yok" derim.', clinicalValue: 0, aiTag: 'blaming_victim' },
          { label: 'Tüm seans verilerimi, video kayıtlarımı ve çevresel değişkenleri masaya yatırıp analiz talep ederim.', clinicalValue: 100, aiTag: 'evidence_based_defense' },
          { label: 'Başka hocaların hatalarını anlatırım.', clinicalValue: 10, aiTag: 'diversion_tactic' },
          { label: 'Özür diler, hatamı kabul ederim (hata yapmamış olsam bile).', clinicalValue: 30, aiTag: 'excessive_submissiveness' }
        ]
      },
      {
        id: 'stf_team_6',
        text: 'Kurumda herkesin stresli olduğu bir dönemde, bir arkadaşınızın ağladığını gördünüz. Ne yaparsınız?',
        options: [
          { label: 'Seansım var, geçer giderim.', clinicalValue: 20, aiTag: 'clinical_detachment' },
          { label: 'Kısa bir mola alır, aktif dinleme yapar ve gerekiyorsa yönetimle "iş yükü optimizasyonu" konuşurum.', clinicalValue: 100, aiTag: 'empathetic_colleague' },
          { label: 'Beraber ağlarız.', clinicalValue: 30, aiTag: 'emotional_contagion' },
          { label: 'Neden ağladığını herkese anlatırım.', clinicalValue: -50, aiTag: 'toxic_gossip' }
        ]
      },
      {
        id: 'stf_team_7',
        text: 'Akademik kurul bir metodun değişmesine karar verdi ama siz bu değişimin yanlış olduğunu düşünüyorsunuz. Ne yaparsınız?',
        options: [
          { label: 'Gizlice eski yöntemi uygulamaya devam ederim.', clinicalValue: 10, aiTag: 'procedural_subversion' },
          { label: 'Karara saygı duyup uygularım ancak karşıt görüşümü "veriye dayalı bir raporla" kurula sunarım.', clinicalValue: 100, aiTag: 'constructive_dissent' },
          { label: 'İstifa ederim.', clinicalValue: 20, aiTag: 'extreme_rigidity' },
          { label: 'Sorgulamadan "emredersiniz" derim.', clinicalValue: 40, aiTag: 'blind_compliance' }
        ]
      },
      {
        id: 'stf_team_8',
        text: 'Bir stajyerin, veliyle aşırı samimi (sınırı aşan) konuştuğunu duydunuz. Mentörlük hamleniz?',
        options: [
          { label: 'Veliye çaktırmadan stajyeri odaya çeker ve "Profesyonel Mesafe" protokolünü hatırlatırım.', clinicalValue: 100, aiTag: 'clinical_boundary_mentor' },
          { label: 'Önemsemem, sonuçta stajyer.', clinicalValue: 20, aiTag: 'supervisory_neglect' },
          { label: 'Herkesin önünde azarlarım.', clinicalValue: 10, aiTag: 'public_humiliation_bias' },
          { label: 'Veliyi uyarırım.', clinicalValue: 30, aiTag: 'parental_misalignment' }
        ]
      },
      {
        id: 'stf_team_9',
        text: 'Ekibe yeni katılan bir uzmana ilk tavsiyeniz ne olur?',
        options: [
          { label: '"Burada çok yorulursun, dikkat et."', clinicalValue: 10, aiTag: 'pessimistic_onboarding' },
          { label: '"Veri her şeydir, çocukla bağ kur ama veriye sadık kal."', clinicalValue: 100, aiTag: 'high_standard_transfer' },
          { label: '"Müdürle aranı iyi tut."', clinicalValue: 20, aiTag: 'political_survivalism' },
          { label: '"Kendi bildiğini yap."', clinicalValue: 0, aiTag: 'clinical_anarchy' }
        ]
      },
      {
        id: 'stf_team_10',
        text: 'Başarılı bir seans sonrası ekip arkadaşınızın başarısını nasıl kutlarsınız?',
        options: [
          { label: 'Kıskanırım ve sessiz kalırım.', clinicalValue: 10, aiTag: 'covert_hostility' },
          { label: 'Ekip içinde başarısını takdir eder, hangi tekniği kullandığını öğrenip kendime katmaya çalışırım.', clinicalValue: 100, aiTag: 'growth_mindset_colleague' },
          { label: '"Şanslıydın" derim.', clinicalValue: 0, aiTag: 'belittling_bias' },
          { label: 'Müdüre "aslında ben yardım ettim" derim.', clinicalValue: -20, aiTag: 'credit_theft' }
        ]
      }
    ]
  },

  // --- 5. KATEGORİ: KRİZ YÖNETİMİ VE VELİ DİPLOMASİSİ (10 SORU) ---
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
          { label: 'Güvenliği çağırırım.', clinicalValue: 10, aiTag: 'extreme_avoidance' },
          { label: 'Veliyi hızla kapalı bir odaya davet eder, duygusunu valide edip "Pre-test vs Güncel Veri" kıyaslamasını önüne koyarım.', clinicalValue: 100, aiTag: 'expert_deescalation' },
          { label: 'Ben de ona bağırırım.', clinicalValue: -50, aiTag: 'aggression_reciprocity' },
          { label: 'Ücretsiz seans teklif ederim.', clinicalValue: 0, aiTag: 'professional_capitulation' }
        ]
      },
      {
        id: 'stf_cri_2',
        text: 'Öğrenci aniden kendine zarar verme (SIB) davranışına başladı ve parmağını ısırıyor. O saniyedeki önceliğiniz?',
        options: [
          { label: 'Davranışın nedenini analiz etmek için defterimi alırım.', clinicalValue: 20, aiTag: 'over_analysis_in_danger' },
          { label: 'En az kısıtlayıcı fiziksel müdahale (Last Restrictive) ile çocuğu ve kendimi güvenliğe alırım.', clinicalValue: 100, aiTag: 'clinical_safety_reflex' },
          { label: 'Odadan çıkar, yardım çağırırım.', clinicalValue: 0, aiTag: 'abandonment_in_crisis' },
          { label: 'Veliyi içeri çağırırım.', clinicalValue: 10, aiTag: 'transference_of_risk' }
        ]
      },
      {
        id: 'stf_cri_3',
        text: 'Veli seansın ortasında içeri girip "Hocam yanlış tutuyorsunuz, öyle değil böyle yapın" dedi. Müdahaleniz?',
        options: [
          { label: 'Öfkelenir ve veliyi dışarı çıkarırım.', clinicalValue: 20, aiTag: 'ego_fragility' },
          { label: 'Seansı o an "Veli Eğitimi" seansına çevirir, neden öyle tuttuğumu bilimsel olarak gösterip denemesini isterim.', clinicalValue: 100, aiTag: 'educational_diplomacy' },
          { label: 'Veli ne diyorsa öyle yaparım.', clinicalValue: 10, aiTag: 'clinical_surrender' },
          { label: 'Cevap vermem, devam ederim.', clinicalValue: 40, aiTag: 'silent_tension' }
        ]
      },
      {
        id: 'stf_cri_4',
        text: 'Bir vakanın gelişiminde "Plato" (ilerleme yok) dönemindesiniz. Veliye durumu nasıl açıklarsınız?',
        options: [
          { label: '"Çocuk artık öğrenemiyor" derim.', clinicalValue: 0, aiTag: 'diagnostic_pessimism' },
          { label: 'Sinir sisteminin bir konsolidasyon aşamasında olduğunu, verileri analiz ettiğimizi ve strateji değişikliği yapacağımızı anlatırım.', clinicalValue: 100, aiTag: 'strategic_transparency' },
          { label: 'Biraz yalan söyler, "çok iyi gidiyor" derim.', clinicalValue: 0, aiTag: 'unethical_reassurance' },
          { label: 'Suçu ailenin evdeki tutumuna atarım.', clinicalValue: 20, aiTag: 'scapegoating_parent' }
        ]
      },
      {
        id: 'stf_cri_5',
        text: 'Kriz anında bir meslektaşınızın donup kaldığını (freeze) gördünüz. Rolünüz?',
        options: [
          { label: 'Onu izlerim.', clinicalValue: 10, aiTag: 'passive_observation' },
          { label: 'Vakayı devralır, arkadaşıma güvenli bir alan açar ve kriz sonrası debrifing yaparım.', clinicalValue: 100, aiTag: 'crisis_leadership' },
          { label: 'Gidip başkasına haber veririm.', clinicalValue: 30, aiTag: 'inefficient_escalation' },
          { label: '"Neden duruyorsun?" diye bağırırım.', clinicalValue: 0, aiTag: 'hostile_intervention' }
        ]
      },
      {
        id: 'stf_cri_6',
        text: 'Veli, kurum müdürüne sizin hakkınızda yalan bir şikayette bulundu. Reaksiyonunuz?',
        options: [
          { label: 'Veliyle kavga ederim.', clinicalValue: 0, aiTag: 'lack_of_restraint' },
          { label: 'Yönetime seans kayıtlarımı ve objektif ilerleme verilerimi sunarak rasyonel bir savunma yaparım.', clinicalValue: 100, aiTag: 'professional_fortress' },
          { label: 'Vakayı hemen bırakırım.', clinicalValue: 10, aiTag: 'reactive_termination' },
          { label: 'Sessiz kalıp haksızlığı kabul ederim.', clinicalValue: 30, aiTag: 'self_defeating_loyalty' }
        ]
      },
      {
        id: 'stf_cri_7',
        text: 'Çocuğun ilaç dozajının değiştirildiğini ve seans performansının çöktüğünü fark ettiniz. Velinin tavrı "bunu hocaya söylemeyelim" olmuş. Ne yaparsınız?',
        options: [
          { label: 'Sormam, kendileri bilir.', clinicalValue: 20, aiTag: 'clinical_indifference' },
          { label: 'Verilerdeki ani değişimi göstererek veliyi açık uçlu sorularla gerçeğe davet ederim; sağlığın eğitimden önce geldiğini vurgularım.', clinicalValue: 100, aiTag: 'diagnostic_detective' },
          { label: 'Kızarım.', clinicalValue: 10, aiTag: 'hostile_mentality' },
          { label: 'İlacı eski doza dönmelerini söylerim.', clinicalValue: -50, aiTag: 'illegal_medical_advice' }
        ]
      },
      {
        id: 'stf_cri_8',
        text: 'Kurumda yangın alarmı çaldı ve vakanız "sensory overload" (duyusal aşırı yükleme) nedeniyle yere kapandı. Ne yaparsınız?',
        options: [
          { label: 'Çocuğu orada bırakıp kaçarım.', clinicalValue: -200, aiTag: 'desertion' },
          { label: 'Çocuğu kucaklar (güvenli taşıma) ve dışarıdaki güvenli toplanma alanına kadar regüle ederek tahliye ederim.', clinicalValue: 100, aiTag: 'emergency_heroism' },
          { label: 'Alarmın susmasını beklerim.', clinicalValue: 0, aiTag: 'crisis_denial' },
          { label: 'Velinin gelmesini beklerim.', clinicalValue: 10, aiTag: 'responsibility_abdication' }
        ]
      },
      {
        id: 'stf_cri_9',
        text: 'Veli seans sonunda "Hocam biz ayrılıyoruz, çocuk çok etkilenir mi?" dedi. Etik yanıtınız?',
        options: [
          { label: '"Hayır, bir şey olmaz" der geçerim.', clinicalValue: 20, aiTag: 'emotional_belittling' },
          { label: 'Çocuğun rutininin bozulacağını, bu sürecin profesyonel bir destekle yönetilmesi gerektiğini bilimsel olarak açıklarım.', clinicalValue: 100, aiTag: 'family_consultancy_mastery' },
          { label: '"Gitmeyin, çocuk mahvolur" diyerek korkuturum.', clinicalValue: 30, aiTag: 'manipulative_retention' },
          { label: '"Bana ne" derim.', clinicalValue: 0, aiTag: 'extreme_unprofessionalism' }
        ]
      },
      {
        id: 'stf_cri_10',
        text: 'Vakanın ilerlemesi için velinin evdeki "şımartma" tutumunu değiştirmesi şart. Veliyi kırmadan nasıl söylersiniz?',
        options: [
          { label: '"Çocuğu mahvediyorsunuz" derim.', clinicalValue: 10, aiTag: 'direct_attack' },
          { label: '"Evdeki tutarlılık, kurumdaki emeği 4 kat hızlandırır" diyerek kazanç odaklı bir işbirliği modeli sunarım.', clinicalValue: 100, aiTag: 'strategic_alignment' },
          { label: 'Söyleyemem, veli paradır.', clinicalValue: 0, aiTag: 'commercial_fear' },
          { label: 'Müdüre söyletirim.', clinicalValue: 30, aiTag: 'cowardice_bias' }
        ]
      }
    ]
  }
];
