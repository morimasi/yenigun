
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
          { label: 'Göz temasını ve kontrolü asla çocuktan çekmeden, nötr bir ses tonuyla veliyi dışarı davet ederim. O an müdahaleyi kesmek, problem davranışı "veli kurtarması" ile pekiştirmek anlamına gelir.', clinicalValue: 100, aiTag: 'high_clinical_discipline' },
          { label: 'Çocuğu susturmak için hızlıca "Sabit Oranlı" pekiştirmeye geçer, kriz bittikten sonra durumu veliye izah ederim.', clinicalValue: 10, aiTag: 'methodological_collapse' }
        ]
      },
      {
        id: 'aba_2',
        text: 'Öğrenci "İpucu Bağımlılığı" geliştirmiş. "Most-to-Least" yerine "Least-to-Most" geçişi için hangi veri sinyali beklenmelidir?',
        options: [
          { label: 'Öğrencinin derse girmeden önceki genel uyarılmışlık halinin yüksek olması ve materyallere spontane ilgi göstermesi.', clinicalValue: 10, aiTag: 'subjective_observation' },
          { label: 'Evdeki çalışmalarda çocuğun ipucu almadan yönergeleri yaptığının video ile kanıtlanması.', clinicalValue: 0, aiTag: 'unverified_data' },
          { label: 'Bağımsız denemelerde ardışık 3 oturumda %80 üzeri başarı sağlanması ve tepki bekleme süresinin 3 saniyenin altına düşmesi.', clinicalValue: 100, aiTag: 'data_driven_decision' },
          { label: 'Çocuğun aynı beceriyi farklı materyallerle, ipucu verildiğinde hatasız yapabilmesi.', clinicalValue: 40, aiTag: 'generalization_confusion' }
        ]
      },
      {
        id: 'aba_3',
        text: 'Bir beceri öğretiminde "Veri Kararlılığı" sağlanamıyor ve grafik testere dişi çiziyorsa, ilk şüphelenilmesi gereken değişken nedir?',
        options: [
          { label: 'Farklı uygulayıcıların yönergeyi, ipucunu veya pekiştireci sunma zamanlamasındaki milisaniyelik tutarsızlıklar.', clinicalValue: 100, aiTag: 'methodological_depth' },
          { label: 'Çocuğun uyku düzeni, beslenme saati veya ilaç kullanımındaki düzensizlikler.', clinicalValue: 40, aiTag: 'external_attribution_bias' },
          { label: 'Kullanılan ödülün çocuk için artık motive edici özelliğini kaybetmiş olması.', clinicalValue: 50, aiTag: 'reinforcement_focus' },
          { label: 'Öğretilen becerinin çocuğun proksimal gelişim alanının çok üzerinde olması.', clinicalValue: 30, aiTag: 'developmental_mismatch' }
        ]
      },
      {
        id: 'aba_4',
        text: 'İşlevsel Analiz sonucunda "Elde Etme" işlevi saptanan bir davranış için, çocuk ağladığında tablet verilmemesi kararı alınmıştır. Ancak çocuk kafasını vurmaya başlarsa ne yapılır?',
        options: [
          { label: 'Kendine zarar verme davranışı başladığı an prosedür iptal edilir; tablet verilir çünkü fiziksel bütünlük her türlü öğretimden önceliklidir.', clinicalValue: 10, aiTag: 'accidental_reinforcement' },
          { label: 'Kask/Yastık ile fiziksel koruma sağlanır ancak tablet ASLA verilmez. Çocuk sakinleşip alternatif bir iletişim kurana kadar talep nötr şekilde askıda tutulur.', clinicalValue: 100, aiTag: 'expert_crisis_management' },
          { label: 'Tablet verilmez ama çocuğa sıkıca sarılarak sakinleşmesi sağlanır, sonra derse dönülür.', clinicalValue: 20, aiTag: 'sensory_confused' },
          { label: 'Odayı terk ederek çocuğun davranışının işlevsiz olduğunu görmesi sağlanır.', clinicalValue: 0, aiTag: 'negligence_risk' }
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
        text: 'Ses Temelli Cümle Yöntemi ile okuma öğretirken, "Hece Birleştirme" aşamasında takılan bir çocuk için hangi teknik uygulanır?',
        options: [
          { label: 'Ezberleyene kadar defalarca okutmak ve ev ödevi ile pekiştirmek.', clinicalValue: 0, aiTag: 'rote_learning_trap' },
          { label: 'Sessiz harfi uzatarak sesli harfe bağlama tekniğini uygulamak (mmmmaaaa -> ma).', clinicalValue: 100, aiTag: 'phonological_mastery' },
          { label: 'Harfleri bırakıp, görsel kartlarla kelimeyi bütün olarak öğretmek.', clinicalValue: 40, aiTag: 'global_method_confusion' },
          { label: 'Okumaya ara verip sadece dinleme çalışmaları yaptırmak.', clinicalValue: 20, aiTag: 'passive_avoidance' }
        ]
      },
      {
        id: 'acad_2',
        text: 'Matematikte "Eldeli Toplama" yapamayan bir çocukta CRA hiyerarşisine göre ilk adım ne olmalıdır?',
        options: [
          { label: 'Onluk bozma ve gruplama mantığını fiziksel bloklarla somutlaştırarak öğretmek.', clinicalValue: 100, aiTag: 'cra_hierarchy_expert' },
          { label: 'Deftere basamak tablosu çizdirmek ve boyatmak.', clinicalValue: 40, aiTag: 'representational_premature' },
          { label: 'Daha çok işlem çözdürerek prosedürü otomatiğe bağlamak.', clinicalValue: 10, aiTag: 'drill_and_kill' },
          { label: '"Büyük sayıyı aklında tut, küçüğü üzerine say" stratejisini vermek.', clinicalValue: 0, aiTag: 'cognitive_overload' }
        ]
      }
    ]
  },

  // --- 3. KATEGORİ: VELİ & SINIR ---
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
          { label: 'Mesajın ekran görüntüsünü alıp yönetime raporlarım ve etik gereği vaka devri talep ederim.', clinicalValue: 100, aiTag: 'high_integrity' },
          { label: 'Sadece "hayır" diyerek konuyu kapatırım.', clinicalValue: 40, aiTag: 'hidden_loyalty' },
          { label: 'Kabul ederim ama gizli tutulmasını isterim.', clinicalValue: -200, aiTag: 'ethical_black_list' },
          { label: '"Kurumda kalmam lazım" derim.', clinicalValue: 60, aiTag: 'weak_refusal' }
        ]
      }
    ]
  }
];
