
import { AssessmentBattery } from '../../types';

export const MODULAR_BATTERIES: AssessmentBattery[] = [
  // --- 1. KATEGORİ: İLERİ ABA & DAVRANIŞ ---
  {
    id: 'aba_advanced',
    title: 'İleri ABA ve Klinik Kriz Yönetimi',
    description: 'Davranışsal analiz, veri sadakati ve kriz anında metodolojik refleks.',
    icon: '📊',
    category: 'clinical',
    questions: [
      {
        id: 'aba_1',
        text: 'Bir davranış müdahale planında "Sönme Patlaması" (Extinction Burst) esnasında veli odaya girip "Çocuğa eziyet ediyorsunuz, durun!" diye bağırırsa, personelin klinik refleksi ne olmalıdır?',
        options: [
          { label: '"Haklısınız, çocuk çok stres oldu" diyerek seansı o an durdurur, pekiştireç vererek çocuğu regüle eder ve veliyi sakinleştiririm.', clinicalValue: 20, aiTag: 'protocol_breach_safety_bias' },
          { label: 'Veliyi içeri davet edip sürece dahil ederim; annenin varlığı çocuğun kortizol seviyesini düşüreceği için sönme daha hızlı gerçekleşir.', clinicalValue: 30, aiTag: 'reinforcement_error' },
          { label: 'Göz temasını ve kontrolü asla çocuktan çekmeden, nötr bir ses tonuyla veliyi dışarı davet ederim. O an müdahaleyi kesmek, problem davranışı "veli kurtarması" ile pekiştirmek (Intermittent Reinforcement) anlamına gelir.', clinicalValue: 100, aiTag: 'high_clinical_discipline' },
          { label: 'Çocuğu susturmak için hızlıca "Sabit Oranlı" (FR1) pekiştirmeye geçer, kriz bittikten sonra durumu veliye izah ederim.', clinicalValue: 10, aiTag: 'methodological_collapse' }
        ]
      },
      {
        id: 'aba_2',
        text: 'Öğrenci "İpucu Bağımlılığı" (Prompt Dependency) geliştirmiş. "Most-to-Least" yerine "Least-to-Most" geçişi için hangi veri sinyali beklenmelidir?',
        options: [
          { label: 'Öğrencinin derse girmeden önceki genel uyarılmışlık halinin yüksek olması ve materyallere spontane ilgi göstermesi.', clinicalValue: 10, aiTag: 'subjective_observation' },
          { label: 'Evdeki çalışmalarda çocuğun ipucu almadan yönergeleri yaptığının video ile kanıtlanması.', clinicalValue: 0, aiTag: 'unverified_data' },
          { label: 'Bağımsız denemelerde (Probe Data) ardışık 3 oturumda %80 üzeri başarı sağlanması ve tepki bekleme süresinin (Latency) 3 saniyenin altına düşmesi.', clinicalValue: 100, aiTag: 'data_driven_decision' },
          { label: 'Çocuğun aynı beceriyi farklı materyallerle, ipucu verildiğinde hatasız yapabilmesi.', clinicalValue: 40, aiTag: 'generalization_confusion' }
        ]
      },
      {
        id: 'aba_3',
        text: 'Bir beceri öğretiminde "Veri Kararlılığı" (Data Stability) sağlanamıyor ve grafik testere dişi (zig-zag) çiziyorsa, ilk şüphelenilmesi gereken değişken nedir?',
        options: [
          { label: 'Farklı uygulayıcıların yönergeyi, ipucunu veya pekiştireci sunma zamanlamasındaki milisaniyelik tutarsızlıklar.', clinicalValue: 100, aiTag: 'methodological_depth' },
          { label: 'Çocuğun uyku düzeni, beslenme saati veya ilaç kullanımındaki düzensizlikler.', clinicalValue: 40, aiTag: 'external_attribution_bias' },
          { label: 'Kullanılan ödülün çocuk için artık motive edici özelliğini kaybetmiş olması.', clinicalValue: 50, aiTag: 'reinforcement_focus' },
          { label: 'Öğretilen becerinin çocuğun proksimal gelişim alanının (ZPD) çok üzerinde olması.', clinicalValue: 30, aiTag: 'developmental_mismatch' }
        ]
      },
      {
        id: 'aba_4',
        text: 'İşlevsel Analiz sonucunda "Elde Etme" (Tangible) işlevi saptanan bir davranış için, çocuk ağladığında tablet verilmemesi kararı alınmıştır. Ancak çocuk kafasını vurmaya başlarsa ne yapılır?',
        options: [
          { label: 'Kendine zarar verme davranışı (SIB) başladığı an prosedür iptal edilir; tablet verilir çünkü fiziksel bütünlük her türlü öğretimden önceliklidir.', clinicalValue: 10, aiTag: 'accidental_reinforcement' },
          { label: 'Kask/Yastık ile fiziksel koruma sağlanır ancak tablet ASLA verilmez. Çocuk sakinleşip alternatif bir iletişim (FCT) kurana kadar talep nötr şekilde askıda tutulur.', clinicalValue: 100, aiTag: 'expert_crisis_management' },
          { label: 'Tablet verilmez ama çocuğa sıkıca sarılarak (Deep Pressure) sakinleşmesi sağlanır, sonra derse dönülür.', clinicalValue: 20, aiTag: 'sensory_confused' },
          { label: 'Odayı terk ederek çocuğun davranışının işlevsiz olduğunu görmesi sağlanır (Planned Ignoring).', clinicalValue: 0, aiTag: 'negligence_risk' }
        ]
      },
      {
        id: 'aba_5',
        text: '"Pekiştirme İnceliği" (Ratio Strain) yaşandığında (çocuk ödül almak zorlaştığı için vazgeçtiğinde) doğru klinik manevra nedir?',
        options: [
          { label: '"Sen artık abisin/ablasın, ödülsüz de yapabilirsin" diyerek içsel motivasyonu tetiklemek.', clinicalValue: 0, aiTag: 'developmental_error' },
          { label: 'Pekiştirecin miktarını veya niteliğini artırarak (Magnitude Change) çocuğun ilgisini yeniden çekmek.', clinicalValue: 40, aiTag: 'bribing_risk' },
          { label: 'Geçici olarak "Yoğun Pekiştirme" (Dense Schedule / FR1) evresine geri dönüp "Davranış Momentumunu" tekrar inşa etmek.', clinicalValue: 100, aiTag: 'precision_clinician' },
          { label: 'Ödül tarifesini değiştirmeden, fiziksel ve sözel ipuçlarını artırarak hatasız öğretim yapmak.', clinicalValue: 20, aiTag: 'ineffective_support' }
        ]
      },
      {
        id: 'aba_6',
        text: 'ABC kaydında "Consequence" (Sonuç) kısmına "Çocuğu uyardım" yazan bir personelin temel hatası nedir?',
        options: [
          { label: 'Uyarının ses tonunu (sert/yumuşak) ve tam cümlesini yazmamıştır.', clinicalValue: 40, aiTag: 'descriptive_error' },
          { label: '"Uyarı"nın davranışı artırıp artırmadığını (Pekiştireç etkisi) belirtmemiştir. Davranışçı dilde uyarı bir sonuç değil, potansiyel bir ilgidir.', clinicalValue: 100, aiTag: 'functional_insight' },
          { label: 'ABC kaydına personelin davranışı değil, sadece çocuğun tepkisi yazılmalıdır.', clinicalValue: 20, aiTag: 'theoretical_gap' },
          { label: 'Uyarının süresini belirtmemiştir.', clinicalValue: 0, aiTag: 'irrelevant' }
        ]
      },
      {
        id: 'aba_7',
        text: 'Genelleme (Generalization) çalışmasında "Loose Training" (Gevşek Öğretim) tekniği neyi ifade eder?',
        options: [
          { label: 'Kuralların katı uygulanmaması, çocuğun derste daha özgür bırakılması.', clinicalValue: 10, aiTag: 'permissive_bias' },
          { label: 'Çocuğun liderliğinde, plansız ve yapılandırılmamış oyun öğretimi.', clinicalValue: 0, aiTag: 'unstructured_risk' },
          { label: 'Öğretim dışı değişkenlerin (oda ısısı, gürültü, kıyafet, farklı yönergeler) sistematik olarak değiştirilerek, becerinin tek bir uyarana bağımlı kalmasının önlenmesi.', clinicalValue: 100, aiTag: 'generalization_mastery' },
          { label: 'Ders sürelerinin kısa tutularak dikkatin dağılmasının önlenmesi.', clinicalValue: 20, aiTag: 'time_management_error' }
        ]
      },
      {
        id: 'aba_8',
        text: 'Token Economy (Sembol Pekiştirme) sisteminde çocuk kazandığı sembolleri harcamak istemiyor, sadece biriktiriyorsa sorun nerededir?',
        options: [
          { label: 'Çocuk obsesif-kompulsif (OKB) eğilimler veya istifçilik özelliği gösteriyordur.', clinicalValue: 10, aiTag: 'diagnostic_overshadowing' },
          { label: '"Koşullu Pekiştireç" (Token) ile "Yedek Pekiştireç" (Back-up) arasındaki takas değeri veya zamanlaması, çocuğun "yoksunluk" (deprivation) seviyesine uygun kurgulanmamıştır.', clinicalValue: 100, aiTag: 'system_design_flaw' },
          { label: 'Sembol sistemi çocuğa çok soyut gelmiştir, somut ödüllere dönülmelidir.', clinicalValue: 30, aiTag: 'premature_giveup' },
          { label: 'Semboller (yıldız, sticker) çocuğun görsel ilgisini çekmemiştir.', clinicalValue: 40, aiTag: 'surface_level_analysis' }
        ]
      },
      {
        id: 'aba_9',
        text: 'Ayrımlı Pekiştirme (DRO - Diğer Davranışları Pekiştirme) uygularken yapılan en kritik "Teknik Hata" nedir?',
        options: [
          { label: 'Seçilen ödülün çocuğun ilgisini çekmemesi.', clinicalValue: 30, aiTag: 'general_error' },
          { label: 'Hedef davranışın hemen azalmaması durumunda personelin pes edip cezaya başvurması.', clinicalValue: 20, aiTag: 'outcome_focus' },
          { label: 'Çocuğun o an "uygun" bir davranış sergilemesine bakmaksızın, sadece "problem davranış yok" diye (çocuk boş dursa bile) pekiştireç verilmesi.', clinicalValue: 100, aiTag: 'dro_blind_spot' },
          { label: 'DRO süresinin (Interval) çok uzun tutulması.', clinicalValue: 40, aiTag: 'timing_error' }
        ]
      },
      {
        id: 'aba_10',
        text: '"Pairing" (Eşleşme) aşamasında çocuk öğretmenden kaçıyorsa, öğretmen neyi yanlış yapıyordur?',
        options: [
          { label: 'Çocuğa yeterince sevgi diliyle yaklaşmıyor, çok mesafeli duruyordur.', clinicalValue: 10, aiTag: 'emotional_bias' },
          { label: 'Henüz "Talep" (Demand) göndermemeliyken; "gel", "bak", "otur" gibi mikro yönergelerle ilişkiyi "iş/görev" bağlamına sokuyordur.', clinicalValue: 100, aiTag: 'pairing_demand_conflict' },
          { label: 'Oda çok sıcak, gürültülü veya çocuk için duyusal olarak rahatsız edicidir.', clinicalValue: 0, aiTag: 'environmental_excuse' },
          { label: 'Pekiştireçleri serbest bırakmıştır, oysa kontrolü elinde tutmalıdır.', clinicalValue: 40, aiTag: 'control_bias' }
        ]
      },
      {
        id: 'aba_11',
        text: 'Shaping (Biçimlendirme) sürecinde bir basamakta çocuk takıldı ve ilerlemiyor. Ne yaparsınız?',
        options: [
          { label: 'O basamağı pas geçip, bir sonraki basamağın ipucuyla yaptırılması.', clinicalValue: 0, aiTag: 'methodological_breach' },
          { label: 'Bir önceki başarılan basamağa dönerim, pekiştireci yoğunlaştırırım ve tıkandığı basamak ile önceki arasına bir "ara basamak" (micro-step) eklerim.', clinicalValue: 100, aiTag: 'shaping_refinement' },
          { label: 'Çocuğa fiziksel yardımla (Full Physical) yaptırarak kas hafızası oluştururum, sonra silikleştiririm.', clinicalValue: 30, aiTag: 'prompt_dependency_risk' },
          { label: 'Bu beceri çocuğun kapasitesine uygun değil diyerek programdan çıkarırım.', clinicalValue: 20, aiTag: 'potential_denial' }
        ]
      },
      {
        id: 'aba_12',
        text: 'Otizmli bir çocukta "Ekolali" (Tekrar) var. Bunu söndürmeli miyiz?',
        options: [
          { label: 'Evet, anlamsız konuşmadır ve fonksiyonel iletişimi bloke eder; hemen susturulmalı veya mola verilmelidir.', clinicalValue: 10, aiTag: 'old_school_error' },
          { label: 'Hayır; ekolali çoğu zaman iletişimsel bir işleve (Talep, Onay, Regülasyon) sahiptir. Söndürmek yerine işlevini bulup "amaca uygun dile" şekillendiririm.', clinicalValue: 100, aiTag: 'modern_aba_insight' },
          { label: 'İlgi göstermezsem kendiliğinden söner.', clinicalValue: 40, aiTag: 'blanket_approach' },
          { label: 'Çocuğun kendini ifade etme biçimidir, karışılmamalıdır.', clinicalValue: 0, aiTag: 'passive_observation' }
        ]
      },
      {
        id: 'aba_13',
        text: 'Bir becerinin "Kalıcılık" (Maintenance) aşamasında pekiştireç nasıl verilmelidir?',
        options: [
          { label: 'Davranışın unutulmaması için her doğru tepkide ödül verilmeye devam edilmelidir.', clinicalValue: 20, aiTag: 'satiation_risk' },
          { label: 'Pekiştireç tamamen kesilmeli, çocuğun içsel motivasyonla yapması beklenmelidir.', clinicalValue: 30, aiTag: 'extinction_risk' },
          { label: 'Yapay ödüller (çikolata, jeton) sistematik olarak çekilmeli; doğal ortam pekiştireçlerine (Aferin, gülümseme, işin bitmesi) ve "Değişken Oranlı" tarifeye geçilmelidir.', clinicalValue: 100, aiTag: 'natural_environment_training' },
          { label: 'Sadece somut ödüller verilmeli, sözel ödüller (Aferin) kesilmelidir.', clinicalValue: 10, aiTag: 'materialism' }
        ]
      },
      {
        id: 'aba_14',
        text: 'Premack İlkesi (Büyükanne Kuralı) kriz anında nasıl uygulanır?',
        options: [
          { label: '"Eğer şimdi ağlamayı kesersen sana tablet veririm" diyerek pazarlık yapmak.', clinicalValue: 20, aiTag: 'bribing_confusion' },
          { label: '"Önce şu yap-bozu bitir (Düşük olasılıklı davranış), SONRA bahçeye çık (Yüksek olasılıklı davranış)" diyerek davranışı yönetmek.', clinicalValue: 100, aiTag: 'premack_application' },
          { label: '"Bak arkadaşın ne güzel oturuyor, sen de oturursan sana da şeker var" demek.', clinicalValue: 10, aiTag: 'social_comparison' },
          { label: '"Bunu yapmazsan oyun saati iptal" demek.', clinicalValue: 0, aiTag: 'threat_based' }
        ]
      },
      {
        id: 'aba_15',
        text: '"Çoklu Örnekle Öğretim" (Multiple Exemplar Training) neden kritiktir?',
        options: [
          { label: 'Çocuğun sıkılmasını önlemek ve materyal zenginliği sağlamak için.', clinicalValue: 20, aiTag: 'shallow_reasoning' },
          { label: 'Uyaran kontrolünün tek bir özellik (örn: sadece kırmızı elma) üzerine kurulmasını önleyip, kavramın (ELMA) tüm varyasyonlarıyla öğrenilmesini sağlamak için.', clinicalValue: 100, aiTag: 'concept_formation' },
          { label: 'Veliye kurumun materyal açısından zengin olduğunu göstermek için.', clinicalValue: 0, aiTag: 'showmanship' },
          { label: 'Çocuğun daha çok kelime ezberleyerek zeka puanını artırmak için.', clinicalValue: 10, aiTag: 'rote_memory_focus' }
        ]
      }
    ]
  },

  // --- 2. KATEGORİ: AKADEMİK & BİLİŞSEL ---
  {
    id: 'academic_interventions',
    title: 'Akademik Müdahale & Bilişsel Stratejiler',
    description: 'Özel öğrenme güçlüğü, disleksi ve matematiksel muhakeme.',
    icon: '📐',
    category: 'clinical',
    questions: [
      {
        id: 'acad_1',
        text: 'Ses Temelli Cümle Yöntemi ile okuma öğretirken, "Hece Birleştirme" aşamasında takılan (örn: "K-A" diyor ama "KA" diyemiyor) bir çocuk için hangi teknik uygulanır?',
        options: [
          { label: 'Ezberleyene kadar defalarca okutmak ve ev ödevi ile pekiştirmek.', clinicalValue: 0, aiTag: 'rote_learning_trap' },
          { label: 'Sessiz harfi uzatarak (singing/stretching) sesli harfe bağlama tekniğini uygulamak (mmmmaaaa -> ma).', clinicalValue: 100, aiTag: 'phonological_mastery' },
          { label: 'Harfleri bırakıp, görsel kartlarla kelimeyi bütün olarak (Global) öğretmek.', clinicalValue: 40, aiTag: 'global_method_confusion' },
          { label: 'Okumaya ara verip sadece dinleme çalışmaları yaptırmak.', clinicalValue: 20, aiTag: 'passive_avoidance' }
        ]
      },
      {
        id: 'acad_2',
        text: 'Matematikte "Eldeli Toplama" yapamayan bir çocukta CRA (Somut-Temsili-Soyut) hiyerarşisine göre ilk adım ne olmalıdır?',
        options: [
          { label: 'Onluk bozma ve gruplama mantığını fiziksel bloklarla (Base-ten blocks) somutlaştırarak öğretmek.', clinicalValue: 100, aiTag: 'cra_hierarchy_expert' },
          { label: 'Deftere basamak tablosu çizdirmek ve boyatmak (Temsili Aşama).', clinicalValue: 40, aiTag: 'representational_premature' },
          { label: 'Daha çok işlem çözdürerek prosedürü otomatiğe bağlamak.', clinicalValue: 10, aiTag: 'drill_and_kill' },
          { label: '"Büyük sayıyı aklında tut, küçüğü üzerine say" stratejisini vermek.', clinicalValue: 0, aiTag: 'cognitive_overload' }
        ]
      },
      {
        id: 'acad_3',
        text: 'Okurken satır atlayan ve kelime sonlarını uyduran bir öğrencide "Hızlı İsimlendirme" (RAN) zayıflığı tespit ettiniz. Müdahale planı ne olmalıdır?',
        options: [
          { label: 'Çocuğa "Daha yavaş ve dikkatli oku" telkininde bulunmak.', clinicalValue: 20, aiTag: 'ineffective_instruction' },
          { label: 'Göz doktoruna yönlendirmek, göz kaslarında sorun olabilir.', clinicalValue: 30, aiTag: 'medical_referral_only' },
          { label: 'Otomatikleşme çalışmaları (Sık kullanılan kelimeler, renk/nesne isimlendirme drilleri) ve "Okuma Penceresi" materyali ile görsel taramayı desteklemek.', clinicalValue: 100, aiTag: 'fluency_intervention' },
          { label: 'Metin puntolarını büyütmek ve satır aralarını açmak.', clinicalValue: 40, aiTag: 'accommodation_only' }
        ]
      },
      {
        id: 'acad_4',
        text: 'Yazılı anlatımda fikir üretmekte zorlanan (Bilişsel kilitlenme) bir öğrenciye "Grafik Düzenleyiciler" (Graphic Organizers) kullandırmanın nöropsikolojik amacı nedir?',
        options: [
          { label: 'Sayfanın dolu ve renkli görünmesini sağlayarak yazma isteğini artırmak.', clinicalValue: 10, aiTag: 'visual_filler' },
          { label: 'Çocuğun resim yaparak derste sıkılmasını önlemek.', clinicalValue: 0, aiTag: 'time_filling' },
          { label: 'Organizasyon yükünü kağıda aktararak Çalışma Belleğini (Working Memory) serbest bırakmak ve planlamayı somutlaştırmak.', clinicalValue: 100, aiTag: 'executive_function_support' },
          { label: 'Yazı yazmadan önce el kaslarını ısıtmak.', clinicalValue: 20, aiTag: 'wrong_domain' }
        ]
      },
      {
        id: 'acad_5',
        text: 'Diskalkuli şüphesi olan bir çocuk "5 tane elma" dendiğinde parmakla saymadan 5 olduğunu bilemiyor (Subitizing eksikliği). Ne çalışılmalı?',
        options: [
          { label: 'Çarpım tablosunu ezberleterek sayı hafızasını geliştirmek.', clinicalValue: 0, aiTag: 'advanced_error' },
          { label: 'Sayı Hissi (Number Sense): Nokta kartları (Dot cards), zar oyunları ve domino ile şipşak sayı algılama çalışmaları yapmak.', clinicalValue: 100, aiTag: 'number_sense_building' },
          { label: '100\'e kadar ritmik sayma çalışmaları ile sıralamayı öğretmek.', clinicalValue: 40, aiTag: 'rote_counting_confusion' },
          { label: 'Rakam yazma çalışmaları ile sembolleri pekiştirmek.', clinicalValue: 20, aiTag: 'motor_focus' }
        ]
      },
      {
        id: 'acad_6',
        text: 'Okuduğunu anlama sorunu yaşayan bir çocuk, metni "Kodlama" (Decoding) yapabiliyor ama "Anlamlandırma" yapamıyor. Sorun nerede olabilir?',
        options: [
          { label: 'Göz kasları satır takibinde yoruluyor olabilir.', clinicalValue: 10, aiTag: 'medical_bias' },
          { label: 'Çocuğun IQ seviyesi düşüktür, soyut düşünemiyordur.', clinicalValue: 20, aiTag: 'labeling_bias' },
          { label: 'Sözcük dağarcığı (Vocabulary) kısıtlılığı veya çalışma belleği (cümlenin sonuna gelince başını unutma) yetersizliği.', clinicalValue: 100, aiTag: 'comprehension_components' },
          { label: 'Çocuk metni sıkıcı bulduğu için odaklanmıyordur.', clinicalValue: 0, aiTag: 'motivation_blame' }
        ]
      },
      {
        id: 'acad_7',
        text: '"b" ve "d" harflerini karıştıran (Reversal) 3. sınıf öğrencisine "Görsel hafızan zayıf" demek neden yetersiz bir tanımdır?',
        options: [
          { label: 'Sorun sadece hafıza değil; fonolojik farkındalık, görsel-uzamsal yönelim (Orientation) veya lateralizasyon eksikliği olabilir.', clinicalValue: 100, aiTag: 'differential_diagnosis' },
          { label: 'Bu ifade çocuğu etiketler ve akademik özgüvenini kırar.', clinicalValue: 10, aiTag: 'emotional_focus' },
          { label: 'Bu tanım aslında doğrudur, görsel hafıza egzersizleri verilmelidir.', clinicalValue: 0, aiTag: 'clinical_ignorance' },
          { label: 'Bu durum tipik bir DEHB belirtisidir, ilaçla düzelir.', clinicalValue: 30, aiTag: 'attention_bias' }
        ]
      },
      {
        id: 'acad_8',
        text: 'Problem çözme becerisinde "Anahtar Kelime Stratejisi" (Örn: Toplam kelimesini görünce topla) neden tehlikelidir?',
        options: [
          { label: 'Tehlikeli değildir, çocuğa hız kazandırır ve sınav başarısını artırır.', clinicalValue: 0, aiTag: 'traditional_error' },
          { label: 'Çocuk okuma bilmiyorsa bu strateji işe yaramaz.', clinicalValue: 20, aiTag: 'practical_issue' },
          { label: 'Çocuğu problemi anlamaktan alıkoyar ve şaşırtmacalı sorularda (Örn: "Toplam kaç eksiği var?") hataya sürükler. Şema temelli yaklaşım (Schema-based) tercih edilmelidir.', clinicalValue: 100, aiTag: 'metacognitive_awareness' },
          { label: 'Bu stratejinin öğretimi çok zaman alır.', clinicalValue: 10, aiTag: 'efficiency_bias' }
        ]
      },
      {
        id: 'acad_9',
        text: 'Yazısı okunaksız (Disgrafi) olan bir öğrenciye sürekli "Güzel yaz" uyarısı yapmak neden işe yaramaz?',
        options: [
          { label: 'Çocuk bilerek kötü yazıyordur, davranışsal müdahale gerekir.', clinicalValue: 0, aiTag: 'behavioral_attribution' },
          { label: 'Sorun motivasyon değil; ince motor beceri, el-göz koordinasyonu veya propriyoseptif duyum (kalemi ne kadar sıkacağını bilememe) eksikliğidir. Ergonomik müdahale gerekir.', clinicalValue: 100, aiTag: 'occupational_insight' },
          { label: 'Kalemi veya silgisi kalitesizdir, değiştirmek gerekir.', clinicalValue: 10, aiTag: 'material_blame' },
          { label: 'Daha çok ev ödevi verilerek el kasları güçlendirilmelidir.', clinicalValue: 20, aiTag: 'repetition_fallacy' }
        ]
      },
      {
        id: 'acad_10',
        text: '"Çalışma Belleği" (Working Memory) düşük bir öğrenciye çok basamaklı bir yönerge verirseniz ne olur?',
        options: [
          { label: 'Yapar ama çok yavaş yapar, sabırlı olmak gerekir.', clinicalValue: 30, aiTag: 'optimistic_bias' },
          { label: 'Sadece ilk veya son basamağı hatırlar (Primacy/Recency Effect), aradaki bilgiler kaybolur ve görevi tamamlayamaz.', clinicalValue: 100, aiTag: 'cognitive_load_theory' },
          { label: 'Sinirler, ağlar ve dersten soğur.', clinicalValue: 20, aiTag: 'emotional_outcome' },
          { label: 'Zorlandıkça bellek kapasitesi artar, bu iyi bir egzersizdir.', clinicalValue: 0, aiTag: 'ignorance' }
        ]
      },
      {
        id: 'acad_11',
        text: 'Metakognisyon (Üstbiliş) eğitimi akademik başarıyı nasıl artırır?',
        options: [
          { label: 'Çocuğun IQ puanını doğrudan yükselterek.', clinicalValue: 10, aiTag: 'iq_myth' },
          { label: 'Öğrencinin "Nasıl öğrendiğini", nerede hata yaptığını ve hangi stratejiyi kullanması gerektiğini fark etmesini (Self-Monitoring) sağlayarak.', clinicalValue: 100, aiTag: 'metacognitive_mastery' },
          { label: 'Daha çok test çözdürerek soru kalıplarını ezberletir.', clinicalValue: 20, aiTag: 'quantitative_focus' },
          { label: 'Öğretmene olan ihtiyacı artırarak hatasız öğrenmeyi sağlar.', clinicalValue: 0, aiTag: 'dependency_error' }
        ]
      },
      {
        id: 'acad_12',
        text: 'Bir öğrenci okurken sürekli parmakla takip ediyorsa ne yapılmalı?',
        options: [
          { label: 'Gözle okumaya zorlanmalı, parmak kullanımı okuma hızını düşürür.', clinicalValue: 30, aiTag: 'speed_reading_myth' },
          { label: 'Okuma hızı ve doğruluğu yerleşene kadar desteklenmeli, çünkü bu bir "dikkat çapası" görevi görür. Hazır olduğunda kademeli silikleştirilmelidir.', clinicalValue: 100, aiTag: 'scaffolding_approach' },
          { label: 'Parmak yerine cetvel kullandırılmalı.', clinicalValue: 40, aiTag: 'tool_substitution' },
          { label: 'Zamanla kendiliğinden geçer, müdahale edilmemeli.', clinicalValue: 20, aiTag: 'passive_observation' }
        ]
      },
      {
        id: 'acad_13',
        text: 'Matematik kaygısı (Math Anxiety) yaşayan bir öğrenci işlem sırasında donup kalıyorsa (Freezing) öncelikli yaklaşım ne olmalıdır?',
        options: [
          { label: '"Yapabilirsin, çok basit bir işlem" diyerek cesaretlendirmek.', clinicalValue: 10, aiTag: 'toxic_positivity' },
          { label: 'Süreyi başlatıp "Hadi" diyerek odaklanmasını sağlamak.', clinicalValue: 0, aiTag: 'anxiety_trigger' },
          { label: 'İşlemi basitleştirmek, süresiz çalışma ortamı sağlamak ve başarı hissini (Dopamin) küçük adımlarla geri kazandırarak amigdalayı sakinleştirmek.', clinicalValue: 100, aiTag: 'anxiety_regulation' },
          { label: 'Matematiği bırakıp, sevdiği bir dersle (örn: resim) devam etmek.', clinicalValue: 20, aiTag: 'avoidance' }
        ]
      },
      {
        id: 'acad_14',
        text: 'Akıcı okuma (Fluency) çalışmasında "Koro Halinde Okuma" (Choral Reading) tekniği neye yarar?',
        options: [
          { label: 'Sınıfın sessizliğini ve düzenini sağlar.', clinicalValue: 10, aiTag: 'discipline_focus' },
          { label: 'Modelin (öğretmenin) vurgu ve hızını taklit ederek, çocuğun "tek başına okuma stresi" olmadan akıcılık pratiği yapmasını sağlar.', clinicalValue: 100, aiTag: 'modeling_strategy' },
          { label: 'Metni ezberlemeyi kolaylaştırır.', clinicalValue: 30, aiTag: 'rote_memory' },
          { label: 'Çocuğun hatalarının öğretmen tarafından duyulmasını engeller.', clinicalValue: 20, aiTag: 'negative_view' }
        ]
      },
      {
        id: 'acad_15',
        text: 'Özel Öğrenme Güçlüğü olan bir çocuğa sınavda "Ek Süre" verilmesi bir "Ayrıcalık" mıdır?',
        options: [
          { label: 'Evet, diğer çocuklara haksızlıktır.', clinicalValue: 0, aiTag: 'fairness_fallacy' },
          { label: 'Hayır. Çocuğun işlemleme hızı dezavantajını eşitleyerek, bilgisini adil ölçmeyi sağlayan bir haktır.', clinicalValue: 100, aiTag: 'equity_understanding' },
          { label: 'Bazen ayrıcalıktır, bazen haktır.', clinicalValue: 30, aiTag: 'uncertainty' },
          { label: 'Sadece raporu varsa verilir, yoksa verilmez.', clinicalValue: 40, aiTag: 'bureaucratic_truth' }
        ]
      }
    ]
  },

  // --- 3. KATEGORİ: NÖRO-İLİŞKİSEL (DIR/FLOORTIME) ---
  {
    id: 'neuro_relational',
    title: 'Nöro-İlişkisel & Regülasyon (DIR)',
    description: 'Duyusal profiller, ko-regülasyon ve ilişki temelli müdahale.',
    icon: '🧠',
    category: 'clinical',
    questions: [
      {
        id: 'nr_1',
        text: 'Çocuğun odadaki ışıkları sürekli açıp kapattığı bir "Duyusal Kapanma" (Shutdown) anında Floortime önceliği nedir?',
        options: [
          { label: 'Işık açıp kapama eylemine duygusal bir anlam katarak (örn: "Işık uyuyor-uyanıyor" diyerek) çocuğun dünyasına sızmak.', clinicalValue: 100, aiTag: 'relational_flow' },
          { label: 'Işığı söndürüp, akademik görevi hatırlatmak ve derse döndürmek.', clinicalValue: 0, aiTag: 'authoritarian_rigidity' },
          { label: 'Görmezden gelip çocuğun sıkılmasını beklemek.', clinicalValue: 20, aiTag: 'passive_avoidance' },
          { label: 'Elini tutup "Hayır" diyerek davranışı durdurmak.', clinicalValue: 10, aiTag: 'behavioral_blocking' }
        ]
      },
      {
        id: 'nr_2',
        text: 'Düşük Eşikli (Hyper-reactive) bir childta ani yüksek sesli bir gülüşe verilen ağlama tepkisi neyi ifade eder?',
        options: [
          { label: 'İşitsel hassasiyet ve sinir sistemi aşırı uyarımı (Fight/Flight tepkisi).', clinicalValue: 100, aiTag: 'neuro_sensory_literacy' },
          { label: 'Şımarıklık ve ilgi çekme isteği.', clinicalValue: 0, aiTag: 'behavioral_misinterpretation' },
          { label: 'Çocuğun sese odaklanamama sorunu.', clinicalValue: 10, aiTag: 'shallow_analysis' },
          { label: 'Çocuğun doğuştan gelen korkak yapısı.', clinicalValue: 20, aiTag: 'labeling' }
        ]
      },
      {
        id: 'nr_3',
        text: 'FEDL 3 (İki Yönlü İletişim) basamağında "Sürekli Etkileşim Döngüsü" (Continuous Circles) kurmanın temel amacı nedir?',
        options: [
          { label: 'Çocuğa yeni kelimeler öğretmek.', clinicalValue: 30, aiTag: 'linguistic_bias' },
          { label: 'Duygusal rezonansı sürdürüp, "ben yaparım, sen tepki verirsin" bilincini (karşılıklılık/reciprocity) sinir sistemine mühürlemek.', clinicalValue: 100, aiTag: 'advanced_neuro_relational' },
          { label: 'Çocuğun yerinde durmasını sağlamak.', clinicalValue: 10, aiTag: 'compliance_focus' },
          { label: 'Sadece oyun oynamak.', clinicalValue: 20, aiTag: 'simplification' }
        ]
      },
      {
        id: 'nr_4',
        text: 'Bir seansın "Klinik Rezonans" kalitesini en iyi hangi metrik ölçer?',
        options: [
          { label: 'Çocuğun seansta kaç kelime konuştuğu.', clinicalValue: 10, aiTag: 'quantitative_bias' },
          { label: 'Açılan ve kapanan "İletişim Döngülerinin" (Circles of Communication) sayısı ve akıcılığı.', clinicalValue: 100, aiTag: 'qualitative_mastery' },
          { label: 'Çocuğun hiç hata yapmaması.', clinicalValue: 0, aiTag: 'rigid_success_bias' },
          { label: 'Velinin seanstan mutlu ayrılması.', clinicalValue: 20, aiTag: 'external_validation' }
        ]
      },
      {
        id: 'nr_5',
        text: 'Regülasyon (Self-Regulation) bozukluğu olan bir çocukta "Ko-Regülasyon" (Co-Regulation) neden önce gelir?',
        options: [
          { label: 'Çocuk henüz kendi sistemini düzenleyemez; yetişkinin sakin sinir sistemini "ödünç alarak" (borrowing) regüle olur.', clinicalValue: 100, aiTag: 'polyvagal_theory' },
          { label: 'Çocuk kuralları bilmediği için.', clinicalValue: 10, aiTag: 'cognitive_error' },
          { label: 'Yetişkin lider olduğu için.', clinicalValue: 20, aiTag: 'hierarchy_bias' },
          { label: 'Çocuğu sakinleştirmek daha kolay olduğu için.', clinicalValue: 0, aiTag: 'laziness' }
        ]
      },
      {
        id: 'nr_6',
        text: '"Affect" (Duygu/Coşku) kullanımı DIR Floortime ekolünde neden bir "Motor" görevi görür?',
        options: [
          { label: 'Limbik sistemi aktive ederek dopaminerjik öğrenme yollarını ve dikkati tetiklediği için.', clinicalValue: 100, aiTag: 'neuro_pedagogical_depth' },
          { label: 'Sadece çocuğu derste tutmak için.', clinicalValue: 10, aiTag: 'shallow_affect' },
          { label: 'Öğretmenin enerjisini göstermek için.', clinicalValue: 20, aiTag: 'performative_bias' },
          { label: 'Çocuğu korkutmamak için.', clinicalValue: 0, aiTag: 'irrelevant' }
        ]
      },
      {
        id: 'nr_7',
        text: 'Praksis (Motor Planlama) bozukluğu olan bir çocukta "İdeasyon" (Ideation) eksikliği ne anlama gelir?',
        options: [
          { label: 'Hareketi yapacak kas gücünün olmaması.', clinicalValue: 10, aiTag: 'anatomical_error' },
          { label: 'Nesneyle ne yapacağına dair bir plan veya oyun fikri üretememe hali.', clinicalValue: 100, aiTag: 'praxis_analysis' },
          { label: 'Yürürken düşmesi.', clinicalValue: 30, aiTag: 'ataxia_confused' },
          { label: 'Oynamak istememesi.', clinicalValue: 20, aiTag: 'motivation_error' }
        ]
      },
      {
        id: 'nr_8',
        text: 'Propriyoseptif Girdi (Derin Bası) ihtiyacı olan bir çocuk seans sırasında ne yapar?',
        options: [
          { label: 'Minderlerin arasına girmeye, sertçe zıplamaya, kendini yere atmaya veya sıkıştırılmaya çalışır.', clinicalValue: 100, aiTag: 'sensory_profile_expert' },
          { label: 'Sürekli kulaklarını kapatır.', clinicalValue: 0, aiTag: 'auditory_mismatch' },
          { label: 'Işıklara bakar.', clinicalValue: 10, aiTag: 'visual_bias' },
          { label: 'Yemek yemeyi reddeder.', clinicalValue: 20, aiTag: 'oral_motor_confused' }
        ]
      },
      {
        id: 'nr_9',
        text: 'FEDL 4 (Karmaşık Problem Çözme) basamağında personelin "Sessizlik Eşiği" (Waiting time) neden artmalıdır?',
        options: [
          { label: 'Çocuğun kendi stratejisini üretmesi ve nöral işlemleme (processing) süresi tanıması için.', clinicalValue: 100, aiTag: 'strategic_patience' },
          { label: 'Öğretmenin yorulmaması için.', clinicalValue: 0, aiTag: 'poor_ethics' },
          { label: 'Veliye "bakın kendi yapıyor" demek için.', clinicalValue: 30, aiTag: 'social_masking' },
          { label: 'Çocuğun bilgisini ölçmek için.', clinicalValue: 20, aiTag: 'testing_bias' }
        ]
      },
      {
        id: 'nr_10',
        text: '"Follow the Lead" (Lideri Takip Et) prensibini "Çocuk ne istiyorsa sadece onu yapalım" şeklinde yorumlayan birine ne dersiniz?',
        options: [
          { label: 'Çocuğun ilgisine ortak olup, ona "Klinik Meydan Okuma" (Challenge) ekleyerek gelişimsel itki sağlamalıyız (Expand the interaction).', clinicalValue: 100, aiTag: 'expert_interactor' },
          { label: 'Çocuğun mutluluğu esastır, özgür olmalı.', clinicalValue: 10, aiTag: 'permissive_trap' },
          { label: 'Bazen öyle, bazen değil.', clinicalValue: 30, aiTag: 'vague_professionalism' },
          { label: 'O zaman terapi olmaz, oyun ablalığı olur.', clinicalValue: 50, aiTag: 'dismissive_truth' }
        ]
      },
      {
        id: 'nr_11',
        text: 'Vestibüler sistemi hassas (Gravitational Insecurity) olan bir çocuğu salıncakta sertçe sallamak neye yol açar?',
        options: [
          { label: 'Duyarsızlaştırma sağlamaz; aksine çocuğu korkutur.', clinicalValue: 0, aiTag: 'trauma_risk' },
          { label: 'Kortizol (Stres) seviyesini artırarak çocuğu ilkel beyin moduna sokar ve öğrenmeyi kapatır.', clinicalValue: 100, aiTag: 'neuro_safety_first' },
          { label: 'Çocuğu heyecanlandırır, iyi gelir.', clinicalValue: 10, aiTag: 'misobservation' },
          { label: 'Vestibüler sistemi güçlendirir.', clinicalValue: 20, aiTag: 'mechanical_view' }
        ]
      },
      {
        id: 'nr_12',
        text: 'Sembolik Oyun (Pretend Play) aşamasına geçemeyen bir çocukta eksik olan temel nedir?',
        options: [
          { label: 'Yaratıcılık yeteneği.', clinicalValue: 20, aiTag: 'abstract_answer' },
          { label: 'Bir nesnenin başka bir şeyi temsil edebileceği (Muz = Telefon) bilişsel esnekliği.', clinicalValue: 100, aiTag: 'cognitive_milestone' },
          { label: 'Yeterince çeşitli oyuncak olmaması.', clinicalValue: 0, aiTag: 'material_blame' },
          { label: 'Konuşma becerisi.', clinicalValue: 30, aiTag: 'language_dependency' }
        ]
      },
      {
        id: 'nr_13',
        text: 'Otizmli bir çocuk sürekli kendi etrafında dönüyorsa (Stimming), bunu durdurmalı mıyız?',
        options: [
          { label: 'Evet, hemen durdurulmalı, toplum içinde garip görünür.', clinicalValue: 10, aiTag: 'normalization_bias' },
          { label: 'Hayır, bu bir regülasyon arayışıdır. Güvenliyse, eşlik ederek (Join-in) ilişkiye dönüştürülmeli ve yavaşça modüle edilmelidir.', clinicalValue: 100, aiTag: 'stimming_management' },
          { label: 'Görmezden gelinmelidir, kendi kendine bırakılmalıdır.', clinicalValue: 30, aiTag: 'passive_error' },
          { label: 'Ceza verilerek söndürülmelidir.', clinicalValue: 0, aiTag: 'abusive' }
        ]
      },
      {
        id: 'nr_14',
        text: '"Duygusal Sinyalleri Okuma" (Social Referencing) eksikliği olan bir çocuk ne yapar?',
        options: [
          { label: 'Düştüğünde veya korktuğunda ebeveyninin yüzüne bakıp "Güvende miyim?" teyidi almaz.', clinicalValue: 100, aiTag: 'social_referencing_sign' },
          { label: 'Harfleri tanıyamaz.', clinicalValue: 0, aiTag: 'term_confusion' },
          { label: 'Genel olarak göz teması kurmaz.', clinicalValue: 40, aiTag: 'partial_truth' },
          { label: 'İletişim başlatmaz.', clinicalValue: 20, aiTag: 'speech_bias' }
        ]
      },
      {
        id: 'nr_15',
        text: 'Bir terapistin "Terapötik Benlik" (Therapeutic Self) kullanımı ne demektir?',
        options: [
          { label: 'Kendi ses tonunu, jestlerini, enerjisini ve duygulanımını çocuğun sinir sistemine göre anlık bir enstrüman gibi ayarlayabilmesi.', clinicalValue: 100, aiTag: 'self_use_mastery' },
          { label: 'Kendini çocuğa tanıtması.', clinicalValue: 0, aiTag: 'literal_interpretation' },
          { label: 'Sınıfta otorite figürü olması.', clinicalValue: 10, aiTag: 'authority_bias' },
          { label: 'Teorik bilgisini göstermesi.', clinicalValue: 20, aiTag: 'knowledge_bias' }
        ]
      }
    ]
  },

  // --- 4. KATEGORİ: VELİ & SINIR ---
  {
    id: 'parent_boundary_management',
    title: 'Veli İlişkileri & Sınır Diplomasisi',
    description: 'Manipülasyon, profesyonel mesafe ve beklenti yönetimi.',
    icon: '🗣️',
    category: 'parent',
    questions: [
      {
        id: 'pb_1',
        text: 'Veli, seansın 20. dakikasında kapıyı çalıp ağlayarak "Hocam eşimle kavga ettik, seansı erken bitirip dertleşebilir miyiz?" dediğinde kurumsal cevabınız ne olur?',
        options: [
          { label: 'İnsani bir krizdir, kabul eder ve dinlerim.', clinicalValue: 10, aiTag: 'boundary_dissolution' },
          { label: 'Kapıyı kapatır, cevap vermem.', clinicalValue: 20, aiTag: 'aggressive_avoidance' },
          { label: 'Üzüntüsünü paylaştığımı belirtirim ancak seans süresinin çocuğun hakkı olduğunu vurgulayıp, seans sonrasında 5 dakika ayırabileceğimi veya psikoloğa yönlendireceğimi söylerim.', clinicalValue: 100, aiTag: 'immaculate_boundary' },
          { label: 'Müdüre şikayet ederim.', clinicalValue: 30, aiTag: 'escalation_bias' }
        ]
      },
      {
        id: 'pb_2',
        text: 'Mülakat sonrası bir veli size WhatsApp üzerinden "Özel dersi kurum dışı, evimizde yapabilir miyiz? Daha iyi ücret veririz." yazdığında aksiyonunuz?',
        options: [
          { label: 'Mesajın ekran görüntüsünü alıp yönetime raporlarım ve etik gereği vaka devri (transfer) talep ederim.', clinicalValue: 100, aiTag: 'high_integrity' },
          { label: 'Sadece "hayır" diyerek konuyu kapatırım.', clinicalValue: 40, aiTag: 'hidden_loyalty' },
          { label: 'Kabul ederim ama gizli tutulmasını isterim.', clinicalValue: -200, aiTag: 'ethical_black_list' },
          { label: '"Kurumda kalmam lazım" derim.', clinicalValue: 60, aiTag: 'weak_refusal' }
        ]
      },
      {
        id: 'pb_3',
        text: 'Veli, başka bir kurumdaki öğretmenin sizin yöntemlerinizin "yetersiz ve yanlış" olduğunu söylediğini iletiyor. Refleksiniz?',
        options: [
          { label: 'O öğretmenin yetkinliğini sorgulayan sert bir cevap veririm.', clinicalValue: 0, aiTag: 'unprofessional_rivalry' },
          { label: '"Her yiğidin bir yoğurt yiyişi vardır" derim.', clinicalValue: 30, aiTag: 'shallow_professionalism' },
          { label: 'Kendi klinik verilerimi, ilerleme grafiklerimi ve video kayıtlarımı masaya koyarak odağı polemikten alıp çocuğun somut başarısına kilitlerim.', clinicalValue: 100, aiTag: 'clinical_confidence' },
          { label: 'Veliye küserim.', clinicalValue: 10, aiTag: 'emotional_immaturity' }
        ]
      },
      {
        id: 'pb_4',
        text: 'Veli size pahalı bir hediye (Örn: Altın kolye) getirdiğinde profesyonel tutumunuz?',
        options: [
          { label: 'Geri çevirmek hakaret olur, alırım.', clinicalValue: 0, aiTag: 'ethical_blindness' },
          { label: 'Maaşımın bir kısmı olarak görürüm.', clinicalValue: -50, aiTag: 'moral_failure' },
          { label: 'Kurum politikası ve mesleki etik gereği maddi değeri olan hediyeleri kabul edemeyeceğimi nazikçe açıklar, manevi desteği (teşekkür kartı vb.) için minnettar olduğumu belirtirim.', clinicalValue: 100, aiTag: 'professional_distance' },
          { label: 'Alıp başkasına veririm.', clinicalValue: 20, aiTag: 'covert_acceptance' }
        ]
      },
      {
        id: 'pb_5',
        text: 'Veli, çocuğunun evde saldırganlaştığını söyleyerek gece 23:00\'te sizi arıyor. Telefonu açar mısınız?',
        options: [
          { label: 'Evet, her an ulaşılabilir olmalıyım.', clinicalValue: 10, aiTag: 'savior_complex' },
          { label: 'Hayır, açmam. Sabah mesai saatinde geri döner, acil durum protokollerini hatırlatırım.', clinicalValue: 100, aiTag: 'healthy_boundaries' },
          { label: 'Açarım ama azarlarım.', clinicalValue: 0, aiTag: 'aggressive_response' },
          { label: 'Telefonu komple kapatırım.', clinicalValue: 30, aiTag: 'avoidance' }
        ]
      },
      {
        id: 'pb_6',
        text: 'Yeni tanı almış ve "İnkar" (Denial) aşamasındaki bir aileye "Çocuğunuz otizmli, bunu kabullenin" demek doğru mudur?',
        options: [
          { label: 'Doğrudur, şok etkisi yaratmak gerekir.', clinicalValue: 10, aiTag: 'empathy_failure' },
          { label: 'Yanlıştır; duygularını valide eder (Active Listening), etiket kullanmadan somut gelişim hedeflerine odaklanarak onları sürece yavaşça dahil ederim.', clinicalValue: 100, aiTag: 'psych_diplomacy' },
          { label: '"Zamanla geçer" diyerek yalan söylerim.', clinicalValue: -50, aiTag: 'false_hope_ethics' },
          { label: 'Konuyu hiç açmam.', clinicalValue: 20, aiTag: 'passive_avoidance' }
        ]
      },
      {
        id: 'pb_7',
        text: 'Veli seans sırasında sürekli camdan müdahale ediyor ve "Öyle yapma, böyle yap" diye bağırıyorsa?',
        options: [
          { label: 'Veliye izleme protokolünü hatırlatır, müdahalenin çocuğun dikkatini dağıttığını açıklar ve gerekirse perdeyi kapatırım.', clinicalValue: 100, aiTag: 'environmental_control' },
          { label: 'Müdüre şikayet ederim.', clinicalValue: 40, aiTag: 'low_initiative' },
          { label: 'Velinin dediğini yaparım.', clinicalValue: 0, aiTag: 'authority_surrender' },
          { label: 'Veliyi içeri alırım.', clinicalValue: 20, aiTag: 'boundary_collapse' }
        ]
      },
      {
        id: 'pb_8',
        text: 'Boşanmış bir ailenin ebeveynleri birbirini kötülüyor ve sizden taraf olmanızı istiyor. Tavrınız?',
        options: [
          { label: 'Anneyi haklı bulurum, çünkü çocuk onda kalıyor.', clinicalValue: 10, aiTag: 'bias_error' },
          { label: 'İkisini de dinlerim ama yorum yapmam.', clinicalValue: 40, aiTag: 'passive_listener' },
          { label: '"Ben çocuğun tarafındayım" diyerek odağı sadece çocuğun eğitimine ve iyilik haline çeker, ailevi konulara girmeyi kesin bir dille reddederim.', clinicalValue: 100, aiTag: 'child_centric_neutrality' },
          { label: 'Mahkemede şahitlik yaparım.', clinicalValue: 0, aiTag: 'role_confusion' }
        ]
      },
      {
        id: 'pb_9',
        text: 'Veli "Çocuğumun videosunu Instagram\'da paylaşabilir miyim?" diye soruyor. Videoda siz de varsınız.',
        options: [
          { label: 'Tabii, reklamım olur.', clinicalValue: 10, aiTag: 'narcissistic_tendency' },
          { label: 'Kurumsal KVKK politikası ve kişisel gizlilik hakkım gereği, seans videolarının sosyal medyada paylaşılmasına izin veremem.', clinicalValue: 100, aiTag: 'privacy_adherence' },
          { label: 'Yüzümü kapatırsanız olur.', clinicalValue: 40, aiTag: 'compromise_risk' },
          { label: 'Farketmez.', clinicalValue: 20, aiTag: 'low_awareness' }
        ]
      },
      {
        id: 'pb_10',
        text: 'Veli seans sonunda "Hiç ilerleme yok, paramız boşa gidiyor" dediğinde tepkiniz?',
        options: [
          { label: 'Sinirlenip savunmaya geçerim.', clinicalValue: 0, aiTag: 'defensive_reaction' },
          { label: 'Önceden hazırladığım "Veri Grafikleri"ni (Data Charts) açarak, milimetrik ilerlemeleri somut kanıtlarla gösterir ve algısını yönetirim.', clinicalValue: 100, aiTag: 'data_defense' },
          { label: '"Haklısınız" diyerek özür dilerim.', clinicalValue: 20, aiTag: 'professional_collapse' },
          { label: 'Yönetime yönlendiririm.', clinicalValue: 40, aiTag: 'responsibility_shift' }
        ]
      },
      {
        id: 'pb_11',
        text: 'Çok sevdiğiniz bir öğrencinin velisi sizi kahve içmeye davet etti. Gider misiniz?',
        options: [
          { label: 'Evet, arkadaş oluruz.', clinicalValue: 0, aiTag: 'dual_relationship' },
          { label: 'Hayır, "Çoklu İlişki" (Dual Relationship) etik ilkesi gereği, profesyonel ilişki dışında sosyal ilişki kurmamız doğru olmaz.', clinicalValue: 100, aiTag: 'ethical_standard' },
          { label: 'Giderim ama kimseye söylemem.', clinicalValue: 10, aiTag: 'secretive_behavior' },
          { label: 'Bahane uydururum.', clinicalValue: 40, aiTag: 'dishonesty' }
        ]
      },
      {
        id: 'pb_12',
        text: 'Veli, çocuğun ilacını (Ritalin vb.) vermeyi unuttuğunu söyledi ve "Siz verir misiniz?" diye ilacı uzattı.',
        options: [
          { label: 'Alıp veririm, çocuk mağdur olmasın.', clinicalValue: 0, aiTag: 'legal_violation' },
          { label: 'Yasal olarak öğretmenlerin ilaç verme yetkisi yoktur. İlacı velinin vermesi gerektiğini veya kurum hemşiresine teslim etmesi gerektiğini belirtirim.', clinicalValue: 100, aiTag: 'legal_compliance' },
          { label: 'Çocuğun çantasına koyarım.', clinicalValue: 20, aiTag: 'risk_taking' },
          { label: 'Görmezden gelirim.', clinicalValue: 10, aiTag: 'negligence' }
        ]
      },
      {
        id: 'pb_13',
        text: 'Veli sürekli seanslara geç kalıyor ve "Trafik vardı" diyor. Seans süresi kısalıyor.',
        options: [
          { label: 'Seansı uzatırım, çocuk eksik kalmasın.', clinicalValue: 30, aiTag: 'time_boundary_violation' },
          { label: 'Seansı tam vaktinde bitiririm. Kaybedilen sürenin telafisi olmadığını, bunun çocuğun eğitim hakkından gittiğini net bir dille ifade ederim.', clinicalValue: 100, aiTag: 'accountability_enforcement' },
          { label: 'Bir şey demem, idare ederim.', clinicalValue: 10, aiTag: 'passive_enabling' },
          { label: 'Surat asarım.', clinicalValue: 0, aiTag: 'unprofessional_attitude' }
        ]
      },
      {
        id: 'pb_14',
        text: 'Veli "Hocam bizim çocuktan adam olur mu?" diye umutsuz bir soru sordu.',
        options: [
          { label: '"Tabii ki olur, çok zeki" diyerek yalan söylerim.', clinicalValue: 10, aiTag: 'false_hope' },
          { label: '"Potansiyeli var ancak bu bir maraton. Biz şu anki hedefimiz olan X becerisine odaklanalım." diyerek gerçekçi ve süreç odaklı bir cevap veririm.', clinicalValue: 100, aiTag: 'professional_hope' },
          { label: '"Bilmem, zor görünüyor" derim.', clinicalValue: 0, aiTag: 'demoralization' },
          { label: '"Allah bilir" derim.', clinicalValue: 20, aiTag: 'fatalism' }
        ]
      },
      {
        id: 'pb_15',
        text: 'Veli, diğer velilerle dedikodu yapıyor ve sizi çekiştiriyor. Bunu duydunuz.',
        options: [
          { label: 'Gidip hesap sorarım.', clinicalValue: 0, aiTag: 'conflict_trigger' },
          { label: 'Duymazdan gelirim, işimi en iyi şekilde yapmaya devam ederim. Profesyonelliğim en büyük cevaptır.', clinicalValue: 100, aiTag: 'high_road' },
          { label: 'Ben de onu başkalarına kötülerim.', clinicalValue: -20, aiTag: 'toxic_retaliation' },
          { label: 'Ağlarım.', clinicalValue: 10, aiTag: 'fragility' }
        ]
      }
    ]
  },

  // --- 5. KATEGORİ: ETİK & SADAKAT ---
  {
    id: 'institutional_ethics_loyalty',
    title: 'Kurumsal Etik & Sadakat Otopsisi',
    description: 'Fikri mülkiyet, meslektaş toksisitesi ve kurumsal güvenlik.',
    icon: '⚖️',
    category: 'ethics',
    questions: [
      {
        id: 'iel_1',
        text: 'Bir meslektaşınızın, kurumun dijital arşivindeki verileri (Materyaller, Veli Listesi) şahsi USB belleğine yedeklediğini fark ettiniz. Aksiyonunuz?',
        options: [
          { label: 'Durumu KVKK ve kurumsal güvenlik politikası gereği derhal yönetime raporlarım.', clinicalValue: 100, aiTag: 'data_sentinel' },
          { label: 'Beni ilgilendirmez, görmezden gelirim.', clinicalValue: 0, aiTag: 'zero_loyalty' },
          { label: 'Onu uyarırım ama şikayet etmem.', clinicalValue: 30, aiTag: 'peer_collusion' },
          { label: '"Bana da kopyalar mısın?" derim.', clinicalValue: -100, aiTag: 'criminal_complicity' }
        ]
      },
      {
        id: 'iel_2',
        text: 'Kurumda maaşların 3 gün gecikeceği duyuruldu. Öğretmenler odasında "Burası batıyor galiba" diye negatif konuşmalar başladı. Tavrınız?',
        options: [
          { label: 'Rasyonel kalmaya çalışır, motivasyonu korur ve endişemi sadece doğrudan yönetimle paylaşırım.', clinicalValue: 100, aiTag: 'professional_resilience' },
          { label: 'Ben de en yüksek sesle şikayet ederim.', clinicalValue: 10, aiTag: 'toxic_spiral_trigger' },
          { label: 'Odadan çıkarım.', clinicalValue: 50, aiTag: 'isolationist' },
          { label: 'Hemen iş aramaya başlarım.', clinicalValue: 20, aiTag: 'flight_risk' }
        ]
      },
      {
        id: 'iel_3',
        text: 'Kendi özel danışmanlık merkezinizi açma planınız var. Bunu yönetimden saklar mısınız?',
        options: [
          { label: 'Hayır, kariyer vizyonumu şeffafça paylaşır ve kurumdaki süreci bir "uzmanlık yatırımı" olarak karşılıklı güvenle yürütürüm.', clinicalValue: 100, aiTag: 'radical_transparency' },
          { label: 'Evet, söylersem işten çıkarırlar veya mobbing yaparlar.', clinicalValue: 20, aiTag: 'hidden_agenda' },
          { label: 'Öyle bir hayalim yokmuş gibi davranırım.', clinicalValue: 10, aiTag: 'masked_compliance' },
          { label: 'Velileri çaktırmadan kendi tarafıma çekerim.', clinicalValue: -200, aiTag: 'active_sabotage' }
        ]
      },
      {
        id: 'iel_4',
        text: 'Kurum müdürünün bir seansla ilgili verdiği teknik talimatın bilimsel olarak hatalı olduğunu düşünüyorsunuz. Yol haritanız?',
        options: [
          { label: 'Bilimsel literatürü (Makale vb.) yanıma alarak müdürle birebir, yapıcı ve profesyonel bir toplantı talep ederim.', clinicalValue: 100, aiTag: 'constructive_challenge' },
          { label: 'Hiyerarşi esastır, söyleneni yaparım.', clinicalValue: 20, aiTag: 'passive_subservience' },
          { label: 'Diğer öğretmenlere anlatıp yönetimi eleştiririm.', clinicalValue: 0, aiTag: 'toxic_disloyalty' },
          { label: 'Gizlice kendi bildiğimi yaparım.', clinicalValue: 30, aiTag: 'insubordination' }
        ]
      },
      {
        id: 'iel_5',
        text: 'Mesleki bir hata yaptınız (Örn: Çocuğun diyetini bozdunuz) ve kimse fark etmedi. Ne yaparsınız?',
        options: [
          { label: 'Koordinatörümle paylaşır, hatamı kabul eder ve düzeltici önlem talep ederim.', clinicalValue: 100, aiTag: 'radical_honesty' },
          { label: 'Bir daha yapmam, kimseye söylemem.', clinicalValue: 20, aiTag: 'low_transparency' },
          { label: 'Cihazları veya başkasını suçlarım.', clinicalValue: -50, aiTag: 'character_risk' },
          { label: 'Unutmaya çalışırım.', clinicalValue: 10, aiTag: 'denial' }
        ]
      },
      {
        id: 'iel_6',
        text: 'Kurumun geliştirdiği özgün bir materyali "Kendi tasarımımmış" gibi sosyal medyada paylaştınız. Bu durumun etik karşılığı nedir?',
        options: [
          { label: 'Fikri mülkiyet hırsızlığı (Plagiarism) ve kurumsal güven ihlalidir.', clinicalValue: 100, aiTag: 'ethics_awareness' },
          { label: 'Bir sorun yoktur, reklamdır.', clinicalValue: 10, aiTag: 'unprofessional' },
          { label: 'Kimse anlamaz.', clinicalValue: 0, aiTag: 'untrustworthy' },
          { label: 'Kurumun reklamını yapmış olurum.', clinicalValue: 20, aiTag: 'rationalization' }
        ]
      },
      {
        id: 'iel_7',
        text: 'Mesai saatleri içinde başka bir işten (Freelance vb.) teklif aldınız ve telefon görüşmesi yapmanız gerekiyor. Ne yaparsınız?',
        options: [
          { label: 'Mesai saatleri içinde yapmam, öğle arasını veya çıkışı beklerim.', clinicalValue: 100, aiTag: 'time_theft_prevention' },
          { label: 'Tuvalete gidip konuşurum.', clinicalValue: 20, aiTag: 'time_theft' },
          { label: 'Seans aralarında konuşurum.', clinicalValue: 30, aiTag: 'distracted_focus' },
          { label: 'Çocuğu yardımcı ablaya bırakıp konuşurum.', clinicalValue: 0, aiTag: 'negligence' }
        ]
      },
      {
        id: 'iel_8',
        text: 'Bir veli kurumdan ayrılmak istiyor ve size "Hangi kurumu önerirsiniz?" diye soruyor. Rakip kurumları önerir misiniz?',
        options: [
          { label: 'Kurumsal sadakat gereği rakip önermem, sorunu çözmek için yönetimle görüştürürüm.', clinicalValue: 100, aiTag: 'loyalty_check' },
          { label: 'Evet, şu kurum çok iyi derim.', clinicalValue: 0, aiTag: 'business_damage' },
          { label: 'Bilmiyorum derim.', clinicalValue: 40, aiTag: 'neutral_avoidance' },
          { label: 'Kendi evime gelin derim.', clinicalValue: -100, aiTag: 'poaching' }
        ]
      },
      {
        id: 'iel_9',
        text: 'Sosyal medyada kurumunuz hakkında yalan bir haber/karalama gördünüz. Tepkiniz?',
        options: [
          { label: 'Kurumsal iletişim departmanına bildirir ve kurumu savunan bir duruş sergilerim.', clinicalValue: 100, aiTag: 'brand_ambassador' },
          { label: 'Beğenirim.', clinicalValue: -50, aiTag: 'active_hostility' },
          { label: 'Görmezden gelirim.', clinicalValue: 30, aiTag: 'passive_loyalty' },
          { label: 'Altına "Ateş olmayan yerden duman çıkmaz" yazarım.', clinicalValue: -100, aiTag: 'public_betrayal' }
        ]
      },
      {
        id: 'iel_10',
        text: 'Kurum içi eğitim toplantılarına katılımınız nasıldır?',
        options: [
          { label: 'Zorunluysa katılırım, yoksa işim var derim.', clinicalValue: 20, aiTag: 'low_engagement' },
          { label: 'Aktif katılırım, not alırım ve öğrendiklerimi sahada uygularım. Gelişim, kuruma olan borcumdur.', clinicalValue: 100, aiTag: 'growth_mindset' },
          { label: 'Arkada oturur telefonla oynarım.', clinicalValue: 0, aiTag: 'disrespect' },
          { label: 'Toplantıyı sabote ederim.', clinicalValue: -50, aiTag: 'toxic_behavior' }
        ]
      },
      {
        id: 'iel_11',
        text: 'Koordinatörünüz size haksız bir eleştiride bulundu. Ne yaparsınız?',
        options: [
          { label: 'Sakinleşince randevu alıp, durumu verilerle ve "Ben Dili" ile açıklarım.', clinicalValue: 100, aiTag: 'conflict_resolution' },
          { label: 'Ona bağırırım.', clinicalValue: 0, aiTag: 'emotional_outburst' },
          { label: 'İstifa ederim.', clinicalValue: 10, aiTag: 'low_resilience' },
          { label: 'Dedikodusunu yaparım.', clinicalValue: -20, aiTag: 'toxic_response' }
        ]
      },
      {
        id: 'iel_12',
        text: 'Çocuğun gelişim raporunu yazarken "biraz abartmanız" istendi. Yapar mısınız?',
        options: [
          { label: 'Asla. Mesleki onurum ve etik değerlerim gereği sadece gerçeği yazarım.', clinicalValue: 100, aiTag: 'integrity_test' },
          { label: 'Müdür istediyse yaparım.', clinicalValue: 20, aiTag: 'blind_obedience' },
          { label: 'Veliyi mutlu etmek için yaparım.', clinicalValue: 10, aiTag: 'pleasing_bias' },
          { label: 'Biraz süslerim.', clinicalValue: 30, aiTag: 'minor_violation' }
        ]
      },
      {
        id: 'iel_13',
        text: 'Kurumun fiziksel imkanlarının (materyal, oda) yetersiz olduğunu düşünüyorsunuz. Ne yaparsınız?',
        options: [
          { label: 'Yaratıcı çözümler üretir, kendi materyalimi tasarlar ve yönetimden destek isterim.', clinicalValue: 100, aiTag: 'solution_oriented' },
          { label: 'Sürekli şikayet ederim.', clinicalValue: 10, aiTag: 'complainer_profile' },
          { label: 'Dersleri boş geçiririm.', clinicalValue: 0, aiTag: 'sabotage' },
          { label: 'Veliye şikayet ederim.', clinicalValue: -50, aiTag: 'triangulation' }
        ]
      },
      {
        id: 'iel_14',
        text: 'Mesai bitiminde bilgisayarınızı açık bırakıp gittiniz. Bu bir risk midir?',
        options: [
          { label: 'Evet, veri güvenliği ihlalidir.', clinicalValue: 100, aiTag: 'security_awareness' },
          { label: 'Hayır, biz bizeyiz.', clinicalValue: 10, aiTag: 'naive_trust' },
          { label: 'Şifrem zaten yok.', clinicalValue: 0, aiTag: 'gross_negligence' },
          { label: 'Temizlikçi kapatır.', clinicalValue: 20, aiTag: 'irresponsibility' }
        ]
      },
      {
        id: 'iel_15',
        text: 'Başka bir kurumdan gelen ve bizim etik standartlarımıza uymayan bir öğretmeni uyarır mısınız?',
        options: [
          { label: 'Evet, kurum kültürünü korumak adına nazikçe uyarır ve doğrusunu gösteririm.', clinicalValue: 100, aiTag: 'culture_guardian' },
          { label: 'Bana ne.', clinicalValue: 20, aiTag: 'indifference' },
          { label: 'Yönetime ispiyonlarım.', clinicalValue: 40, aiTag: 'tattling' },
          { label: 'Onunla dalga geçerim.', clinicalValue: 0, aiTag: 'bullying' }
        ]
      },
      {
        id: 'iel_16',
        text: 'Veli size "Bu kurumda en iyi hoca sizsiniz, diğerleri beş para etmez" dedi. Cevabınız?',
        options: [
          { label: '"Teşekkür ederim, ekip arkadaşlarım da alanında çok yetkindir, biz bir takımız" diyerek arkadaşlarımı onore ederim.', clinicalValue: 100, aiTag: 'team_spirit' },
          { label: '"Teşekkürler, biliyorum" derim.', clinicalValue: 10, aiTag: 'arrogance' },
          { label: '"Evet, maalesef öyle" derim.', clinicalValue: -20, aiTag: 'team_betrayal' },
          { label: 'Sessiz kalırım.', clinicalValue: 30, aiTag: 'passive_approval' }
        ]
      },
      {
        id: 'iel_17',
        text: 'Kurumun "Veliyle şahsi numara paylaşımı yasaktır" kuralını delmek için veli çok ısrar ediyor. Ne yaparsınız?',
        options: [
          { label: 'Kuralı hatırlatır, kurumsal hattı verir ve sınırı korurum.', clinicalValue: 100, aiTag: 'rule_adherence' },
          { label: 'Veririm, kim bilecek.', clinicalValue: 0, aiTag: 'violation' },
          { label: 'Veririm ama aramayın derim.', clinicalValue: 20, aiTag: 'weak_boundary' },
          { label: 'Yalan numara veririm.', clinicalValue: 10, aiTag: 'dishonesty' }
        ]
      },
      {
        id: 'iel_18',
        text: 'İş yerinde bir hırsızlık olayı oldu ve arkadaşınızdan şüpheleniyorsunuz. Ne yaparsınız?',
        options: [
          { label: 'Somut kanıtım olmadan kimseyi suçlamam, durumu yönetime bildiririm.', clinicalValue: 100, aiTag: 'fairness' },
          { label: 'Dedikodu yayarım.', clinicalValue: -20, aiTag: 'toxic_gossip' },
          { label: 'Ona tuzak kurarım.', clinicalValue: 0, aiTag: 'vigilante' },
          { label: 'Korkup susarım.', clinicalValue: 20, aiTag: 'passive_fear' }
        ]
      },
      {
        id: 'iel_19',
        text: 'Kurum sahibi eğitmen değildir ve pedagojik olmayan bir talepte bulundu. Tepkiniz?',
        options: [
          { label: 'Pedagojik doğruları ve riskleri profesyonelce izah ederek kararı revize etmesini sağlarım.', clinicalValue: 100, aiTag: 'expert_guidance' },
          { label: '"Patron ne derse o" derim.', clinicalValue: 20, aiTag: 'unquestioning' },
          { label: 'İstifa tehdidi savururum.', clinicalValue: 10, aiTag: 'ultimatum' },
          { label: 'Arkadan konuşurum.', clinicalValue: 0, aiTag: 'duplicity' }
        ]
      },
      {
        id: 'iel_20',
        text: 'Çok yoğun bir günün sonunda veli raporu yazmayı unuttunuz. Ne yaparsınız?',
        options: [
          { label: 'Ertesi sabah ilk iş olarak yazar ve gecikme için özür dilerim.', clinicalValue: 100, aiTag: 'responsibility' },
          { label: 'Yazmam, fark etmezler.', clinicalValue: 0, aiTag: 'negligence' },
          { label: 'Yalan yanlış bir şeyler doldururum.', clinicalValue: -50, aiTag: 'falsification' },
          { label: 'Sistemi suçlarım.', clinicalValue: 20, aiTag: 'blame_shifting' }
        ]
      }
    ]
  },

  // --- 6. KATEGORİ: RESİLİANS (DAYANIKLILIK) ---
  {
    id: 'burnout_resilience_set',
    title: 'Psikolojik Dayanıklılık & Resilians',
    description: 'Stres altında regülasyon ve tükenmişlik önleme.',
    icon: '🕯️',
    category: 'team',
    questions: [
      {
        id: 'br_1',
        text: 'Üst üste 4 seans boyunca "Ağır Problem Davranış" (Isırma, Kendine Zarar) ile karşılaştınız. Seans çıkışı zihninizden geçen ilk sağlıklı düşünce ne olmalıdır?',
        options: [
          { label: '"Bu davranışın işlevi ne? Veri toplarken nerede eksik kaldım?" (Analitik Bakış).', clinicalValue: 100, aiTag: 'resilient_clinician' },
          { label: '"Neden ben? Artık dayanamıyorum."', clinicalValue: 10, aiTag: 'burnout_alert' },
          { label: '"Keşke masa başı bir işim olsaydı."', clinicalValue: 0, aiTag: 'career_regret' },
          { label: '"Bu çocuk düzelmez."', clinicalValue: 20, aiTag: 'hopelessness' }
        ]
      },
      {
        id: 'br_2',
        text: 'Eleştiriye tahammül seviyeniz nedir? Bir süpervizör seansınızı izleyip "Yetersiz" buldu.',
        options: [
          { label: 'Eleştiriyi "Klinik Süpervizyon" olarak görür, egomu kenara bırakır ve bir büyüme yakıtı olarak kullanırım.', clinicalValue: 100, aiTag: 'growth_mindset' },
          { label: 'Hemen savunmaya geçer, mazeret üretirim.', clinicalValue: 0, aiTag: 'ego_rigidity' },
          { label: 'Dinlerim ama bildiğimi okurum.', clinicalValue: 20, aiTag: 'passive_resistance' },
          { label: 'Motivasyonum çöker, istifayı düşünürüm.', clinicalValue: 10, aiTag: 'fragility' }
        ]
      },
      {
        id: 'br_3',
        text: 'İş yerindeki şiddetli bir çatışma sonrası eve gittiğinizde ne yaparsınız?',
        options: [
          { label: 'Olayı analiz eder, dersimi çıkarır ve profesyonel sınırı evde kapatıp dinlenirim.', clinicalValue: 100, aiTag: 'high_self_regulation' },
          { label: 'Sabah kadar düşünür ve uyuyamam.', clinicalValue: 10, aiTag: 'emotional_rumination' },
          { label: 'Ertesi gün rapor alıp işe gitmem.', clinicalValue: 0, aiTag: 'avoidant_personality' },
          { label: 'Evdekilerle kavga ederim.', clinicalValue: 0, aiTag: 'displacement' }
        ]
      },
      {
        id: 'br_4',
        text: 'Yavaş ilerleyen (Plato çizen) bir vakada motivasyonunuzu ne sağlar?',
        options: [
          { label: 'Küçük veri artışlarını (Successive Approximations) görme yetim.', clinicalValue: 100, aiTag: 'micro_victory_expert' },
          { label: 'Maaşımın yatması.', clinicalValue: 10, aiTag: 'extrinsic_only' },
          { label: 'Veliye verdiğim söz.', clinicalValue: 40, aiTag: 'pressure_motivation' },
          { label: 'Hiçbir şey, sıkılırım.', clinicalValue: 0, aiTag: 'boredom_intolerance' }
        ]
      },
      {
        id: 'br_5',
        text: 'Kurumda kendinizi en çok ne zaman "tükenmiş" hissediyorsunuz?',
        options: [
          { label: 'Akademik gelişimimin durduğunu ve rutine bindiğimi hissettiğimde.', clinicalValue: 100, aiTag: 'ambition_burnout' },
          { label: 'Veli ile çatıştığımda.', clinicalValue: 40, aiTag: 'conflict_sensitive' },
          { label: 'Çok fazla evrak olduğunda.', clinicalValue: 30, aiTag: 'bureaucracy_low_tolerance' },
          { label: 'Sabah erken kalktığımda.', clinicalValue: 10, aiTag: 'low_stamina' }
        ]
      },
      {
        id: 'br_6',
        text: 'İş arkadaşlarınızın sürekli dert yandığı (Negatif Rezonans) bir ortamda tutumunuz?',
        options: [
          { label: 'Pozitif bir gündem yaratmaya çalışır veya sessizce kendi akademik işlerime odaklanarak o enerjiyi kabul etmem.', clinicalValue: 100, aiTag: 'culture_shaper' },
          { label: 'Ben de onlara katılırım, rahatlarım.', clinicalValue: 0, aiTag: 'negative_spiral_risk' },
          { label: 'Onları yönetime şikayet ederim.', clinicalValue: 40, aiTag: 'low_interpersonal' },
          { label: 'Kulaklık takarım.', clinicalValue: 50, aiTag: 'isolation' }
        ]
      },
      {
        id: 'br_7',
        text: 'Duygusal öz-bakım (Self-care) rutinleriniz var mı?',
        options: [
          { label: 'Evet; düzenli spor, sanat veya hobi gibi profesyonel kimliğimden sıyrıldığım alanlarım var.', clinicalValue: 100, aiTag: 'balanced_life' },
          { label: 'Hayır, gerek yok, işim hayatımdır.', clinicalValue: 10, aiTag: 'high_burnout_risk' },
          { label: 'Sadece uyuyorum.', clinicalValue: 30, aiTag: 'low_energy' },
          { label: 'Alışveriş yapıyorum.', clinicalValue: 40, aiTag: 'short_term_dopamine' }
        ]
      },
      {
        id: 'br_8',
        text: 'Kurumda 2. yılınızdasınız ve her şey rutinleşti. Aksiyonunuz?',
        options: [
          { label: 'Kurum içi yeni bir proje (materyal geliştirme, seminer vb.) veya ileri düzey bir eğitim talep ederek sistemimi güncellerim.', clinicalValue: 100, aiTag: 'internal_innovator' },
          { label: 'İş değiştiririm.', clinicalValue: 10, aiTag: 'job_hopper' },
          { label: 'Rutin iyidir der, devam ederim.', clinicalValue: 30, aiTag: 'stagnation_risk' },
          { label: 'Daha az çalışırım.', clinicalValue: 0, aiTag: 'quiet_quitting' }
        ]
      },
      {
        id: 'br_9',
        text: 'Bir vaka çıkmaza girdiğinde (Stuck) ve ilerlemediğinde ne yaparsınız?',
        options: [
          { label: 'Verileri tekrar analiz eder, literatür tarar ve süpervizörden "Bakış Açısı" desteği isterim.', clinicalValue: 100, aiTag: 'analytical_flexibility' },
          { label: 'Aynı şeyi yapmaya devam ederim, elbet açılır.', clinicalValue: 10, aiTag: 'rigid_methodology' },
          { label: 'Vakayı bırakmak isterim.', clinicalValue: 0, aiTag: 'surrender_tendency' },
          { label: 'Çocuğun kapasitesi bu kadar derim.', clinicalValue: 20, aiTag: 'labeling_limit' }
        ]
      },
      {
        id: 'br_10',
        text: 'Yoğun bir günün ortasında enerjiniz bitti. Kalan 2 seansı nasıl çıkarırsınız?',
        options: [
          { label: 'Kısa bir nefes egzersizi (Grounding) yapar, kahvemi içer ve "Sahneye Çıkış" modumu açarım. Çocuk benim yorgunluğumu hak etmez.', clinicalValue: 100, aiTag: 'professional_stamina' },
          { label: 'Çocukları serbest bırakır, otururum.', clinicalValue: 0, aiTag: 'negligence' },
          { label: 'Sürekli saate bakarım.', clinicalValue: 20, aiTag: 'disengagement' },
          { label: 'Hastayım diyip giderim.', clinicalValue: 10, aiTag: 'avoidance' }
        ]
      },
      {
        id: 'br_11',
        text: 'Başarısız hissettiğiniz bir günın akşamında kendinize ne söylersiniz?',
        options: [
          { label: '"Bugün zor bir gündü ama ben yetersiz değilim. Yarın yeni bir strateji deneyeceğim."', clinicalValue: 100, aiTag: 'self_compassion' },
          { label: '"Ben bu işi yapamıyorum."', clinicalValue: 10, aiTag: 'imposter_syndrome' },
          { label: '"Herkes suçlu, ben haklıyım."', clinicalValue: 0, aiTag: 'externalization' },
          { label: 'Hiçbir şey düşünmem, uyurum.', clinicalValue: 40, aiTag: 'repression' }
        ]
      },
      {
        id: 'br_12',
        text: 'Çoklu görev (Multitasking) ve zaman baskısı altında performansınız nasıldır?',
        options: [
          { label: 'En kritikten başlayarak sakin ve metodik ilerlerim.', clinicalValue: 100, aiTag: 'executive_function' },
          { label: 'Elim ayağıma dolaşır.', clinicalValue: 10, aiTag: 'low_stress_threshold' },
          { label: 'Her şeyi yarım yaparım.', clinicalValue: 20, aiTag: 'quality_compromise' },
          { label: 'Hiçbir şey yapamam.', clinicalValue: 0, aiTag: 'freeze_response' }
        ]
      },
      {
        id: 'br_13',
        text: 'Uzun süredir emek verdiğiniz çocuk başka kuruma gitti. Ne hissedersiniz?',
        options: [
          { label: 'Üzülür bir ama onun için en iyisini dilerim. Bu mesleğin doğasıdır.', clinicalValue: 100, aiTag: 'professional_detachment' },
          { label: 'İhanete uğramış hissederim.', clinicalValue: 10, aiTag: 'personalization' },
          { label: 'Veliye beddua ederim.', clinicalValue: 0, aiTag: 'toxic_emotion' },
          { label: 'Umrumda olmaz.', clinicalValue: 30, aiTag: 'emotional_numbness' }
        ]
      },
      {
        id: 'br_14',
        text: 'Takım arkadaşınızın başarısını kıskanır mısınız?',
        options: [
          { label: 'Hayır, onun başarısı kurumun başarısıdır. Ondan ne öğrenebilirim diye bakarım.', clinicalValue: 100, aiTag: 'abundance_mindset' },
          { label: 'Evet, içten içe bozulurum.', clinicalValue: 20, aiTag: 'scarcity_mindset' },
          { label: 'Onun açığını ararım.', clinicalValue: 0, aiTag: 'sabotage' },
          { label: 'Kendimi kötü hissederim.', clinicalValue: 10, aiTag: 'low_self_esteem' }
        ]
      },
      {
        id: 'br_15',
        text: 'Kurumda "Değişim" (Yeni sistem, yeni müdür vb.) olduğunda tepkiniz?',
        options: [
          { label: 'Değişim sürecine liderlik eder, fırsatları ararım.', clinicalValue: 100, aiTag: 'adaptability' },
          { label: 'Eski düzen iyiydi der direnirim.', clinicalValue: 20, aiTag: 'resistance_to_change' },
          { label: 'Paniklerim.', clinicalValue: 10, aiTag: 'anxiety' },
          { label: 'Beklerim.', clinicalValue: 40, aiTag: 'follower' }
        ]
      },
      {
        id: 'br_16',
        text: 'Veli size "Çocuğumu sevmiyorsunuz" dedi (Manipülasyon). Ne yaparsınız?',
        options: [
          { label: 'Sınırlarınızı koruyarak, sevgimi değil "klinik ilgimi ve emeğimi" verilerle kanıtlarım. Duygusal tuzağa düşmem.', clinicalValue: 100, aiTag: 'manipulation_resistance' },
          { label: '"Olur mu öyle şey, çok seviyorum" diye ispatlamaya çalışırım.', clinicalValue: 20, aiTag: 'defensive' },
          { label: 'Sinirlenirim.', clinicalValue: 0, aiTag: 'trigger' },
          { label: 'Ağlarım.', clinicalValue: 10, aiTag: 'fragility' }
        ]
      },
      {
        id: 'br_17',
        text: 'Sürekli ağlayan bir çocukla çalışırken kulaklarınız ve sinirleriniz yıprandı. Ne yaparsınız?',
        options: [
          { label: 'Gürültü önleyici kulaklık (Loop vb.) takar, kendi regülasyonumu korur ve çocuğa sakin model olmaya devam ederim.', clinicalValue: 100, aiTag: 'sensory_management' },
          { label: 'Çocuğa bağırırım.', clinicalValue: 0, aiTag: 'abuse' },
          { label: 'Odadan çıkarım.', clinicalValue: 10, aiTag: 'abandonment' },
          { label: 'Ben de ağlarım.', clinicalValue: 20, aiTag: 'breakdown' }
        ]
      },
      {
        id: 'br_18',
        text: 'Mesleki heyecanınızı kaybettiğinizi hissettiniz. İlk adım?',
        options: [
          { label: 'Mentörümle konuşup "Kariyer Zenginleştirme" (Job Crafting) yolları ararım.', clinicalValue: 100, aiTag: 'proactive_renewal' },
          { label: 'İş ararım.', clinicalValue: 20, aiTag: 'flight' },
          { label: 'Rapor alırım.', clinicalValue: 10, aiTag: 'avoidance' },
          { label: 'Öylesine gider gelirim.', clinicalValue: 0, aiTag: 'stagnation' }
        ]
      },
      {
        id: 'br_19',
        text: 'Hata yaptığınızda özür diler misiniz?',
        options: [
          { label: 'Evet, özür dilemek güçsüzlük değil, profesyonel olgunluk ve güven inşa etme aracıdır.', clinicalValue: 100, aiTag: 'accountability' },
          { label: 'Hayır, otoritem sarsılır.', clinicalValue: 0, aiTag: 'ego_error' },
          { label: 'Mazeret uydururum.', clinicalValue: 20, aiTag: 'deflection' },
          { label: 'Sessiz kalırım.', clinicalValue: 30, aiTag: 'passive' }
        ]
      },
      {
        id: 'br_20',
        text: 'Yıllık izin zamanınız geldi ama kritik bir vaka var. Ne yaparsınız?',
        options: [
          { label: 'İznimi kullanırım ama vaka için detaylı bir "Yönerge ve Devir Dosyası" hazırlayıp yerine bakacak arkadaşı brife ederim.', clinicalValue: 100, aiTag: 'responsible_autonomy' },
          { label: 'İzne gitmem, ben olmazsam çocuk geriler.', clinicalValue: 20, aiTag: 'indispensable_complex' },
          { label: 'Giderim, ne halleri varsa görsünler.', clinicalValue: 0, aiTag: 'carelessness' },
          { label: 'Veliye "ben yokum gelmeyin" derim.', clinicalValue: 10, aiTag: 'sabotage' }
        ]
      }
    ]
  }
];
