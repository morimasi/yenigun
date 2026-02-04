import { AssessmentQuestion } from '../../../types';

export const advancedABAQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_aba_v2_1',
    text: 'Seansın en yoğun yerinde öğrenci "Sönme Patlaması" (Burst) yaşıyor. Güvenlik riski yok ancak yan odadaki uzmanlar ve veliler gürültüden rahatsız. Tavrınız?',
    options: [
      { 
        label: 'Klinik protokolün bozulmasının davranışı daha dirençli kılacağını bildiğim için müdahaleye tavizsiz devam ederim; bilimsel sadakat kurum huzurundan önce gelir.', 
        clinicalValue: 100, 
        aiTag: 'methodological_purity' 
      },
      { 
        label: 'Kurumun genel işleyişini ve diğer öğrencilerin haklarını gözeterek, seansı o an için regüle edecek "yumuşatılmış" bir geçiş planı uygularım.', 
        clinicalValue: 70, 
        aiTag: 'institutional_harmony' 
      },
      { 
        label: 'Çocuğun kulağına fısıldayarak veya dikkatini dağıtacak bir oyuncak vererek davranışı durdurmaya çalışırım, yeter ki ses kesilsin.', 
        clinicalValue: 40, 
        aiTag: 'symptom_suppression' 
      },
      { 
        label: 'Seansı o anlık sonlandırıp çocuğu dışarı çıkarırım; kriz anında eğitim yapılamayacağını düşünürüm.', 
        clinicalValue: 20, 
        aiTag: 'avoidance_behavior' 
      }
    ]
  },
  {
    id: 'stf_aba_v2_2',
    text: 'Vaka üzerinde uyguladığınız yöntem 3 aydır verilerde "plato" çiziyor. Veriler ilerleme yok diyor ama sezgileriniz çocuğun hazır olduğunu söylüyor. Kararınız?',
    options: [
      { 
        label: 'Sezgileri devre dışı bırakır, veriye sadık kalırım. Müdahale planını derhal revize eder ve farklı bir uyaran kontrolü denemeye başlarım.', 
        clinicalValue: 100, 
        aiTag: 'data_driven_rigor' 
      },
      { 
        label: 'Verilerin henüz ölçemediği niteliksel değişimleri gözlemlerim. Mevcut metoda bir süre daha şans verir, bağın derinleşmesini beklerim.', 
        clinicalValue: 60, 
        aiTag: 'clinical_intuition' 
      },
      { 
        label: 'Süpervizörüme danışırım ama içten içe çocuğun kapasitesinin bu kadar olduğunu düşünmeye başlarım.', 
        clinicalValue: 40, 
        aiTag: 'low_expectation' 
      },
      { 
        label: 'Veri tutmayı bırakıp tamamen oyun terapisine dönerim, belki çocuk sıkılmıştır.', 
        clinicalValue: 30, 
        aiTag: 'methodological_drift' 
      }
    ]
  },
  {
    id: 'stf_aba_v2_3',
    text: 'Yeni başladığınız bir vakada "Hatasız Öğretim" protokolü çocukta ipucu bağımlılığı (Prompt Dependency) yarattı. Desteği çekme (fading) hızınız nedir?',
    options: [
      { 
        label: 'Hata payını göze alarak ipuçlarını agresif bir şekilde silikleştiririm; başarısızlık hissinin öğrenme için gerekli bir kamçı olduğuna inanırım.', 
        clinicalValue: 100, 
        aiTag: 'risk_tolerant_expert' 
      },
      { 
        label: 'İpucu silikleştirmeyi mikroskobik adımlarla yaparım; hata biriktirmenin çocukta kalıcı bir kaçınma yaratmasından çekinirim.', 
        clinicalValue: 80, 
        aiTag: 'protective_methodology' 
      },
      { 
        label: 'Çocuk bağımsız yapana kadar tam fiziksel ipucu vermeye devam ederim, acele etmeye gerek yok.', 
        clinicalValue: 50, 
        aiTag: 'stagnation_risk' 
      },
      { 
        label: 'İpucunu tamamen keserim, yapamazsa ödül vermem. Çocuk çaresiz kalınca yapmak zorunda kalır.', 
        clinicalValue: 60, 
        aiTag: 'tough_love_approach' 
      }
    ]
  },
  {
    id: 'stf_aba_v2_4',
    text: 'Pekiştireç (Ödül) kullanımında çocuk doyuma ulaştı (satiation) ve artık tepki vermiyor. İlk hamleniz?',
    options: [
      { 
        label: 'Mevcut pekiştireçleri ortamdan tamamen kaldırır (deprivation), envanter değerlendirmesi yaparak yeni ve daha güçlü motivasyon kaynakları bulurum.', 
        clinicalValue: 100, 
        aiTag: 'motivation_architect' 
      },
      { 
        label: 'Ödül miktarını artırırım; bir tane kraker yerine paketi vererek ilgisini çekmeye çalışırım.', 
        clinicalValue: 40, 
        aiTag: 'bribing_tendency' 
      },
      { 
        label: 'Sosyal pekiştirece (Aferin, Harikasın) ağırlık veririm, maddi ödüle çok alışmasını istemem.', 
        clinicalValue: 70, 
        aiTag: 'social_transition' 
      },
      { 
        label: 'Dersi bitiririm, çocuk istekli değilse öğretim yapılamaz.', 
        clinicalValue: 20, 
        aiTag: 'passive_resignation' 
      }
    ]
  },
  {
    id: 'stf_aba_v2_5',
    text: 'Ayrık Denemelerle Öğretim (DTT) sırasında çocuk sürekli masanın altına kaçıyor. Davranışın işlevi "Kaçma/Kaçınma". Ne yaparsınız?',
    options: [
      { 
        label: 'Görevi (demand) geri çekmem. Masanın altına girip orada çalışmaya devam ederim; kaçma davranışının işlevsel amacına ulaşmasını engellerim.', 
        clinicalValue: 100, 
        aiTag: 'function_based_persistence' 
      },
      { 
        label: 'Çocuğu zorla sandalyeye oturtur ve fiziksel güçle masada tutarım.', 
        clinicalValue: 30, 
        aiTag: 'physical_coercion' 
      },
      { 
        label: '"Tamam, biraz mola verelim" diyerek çocuğu rahat bırakırım, sakinleşince tekrar deneriz.', 
        clinicalValue: 20, 
        aiTag: 'negative_reinforcement_trap' 
      },
      { 
        label: 'Masadaki görevi kolaylaştırırım, belki zor geldiği için kaçıyordur.', 
        clinicalValue: 80, 
        aiTag: 'task_modification' 
      }
    ]
  },
  {
    id: 'stf_aba_v2_6',
    text: 'Veri toplama kağıdını evde unuttunuz ve seans başladı. Verileri nasıl tutarsınız?',
    options: [
      { 
        label: 'Elimin üzerindeki deriye veya bulduğum bir peçeteye sembollerle not alır, seans bitimi sisteme işlerim. Verisiz seans, seans değildir.', 
        clinicalValue: 100, 
        aiTag: 'data_obsessed' 
      },
      { 
        label: 'Bu seanslık hafızamda tutarım, gün sonunda aklımda kalanlarla genel bir özet yazarım.', 
        clinicalValue: 50, 
        aiTag: 'memory_reliance_risk' 
      },
      { 
        label: 'Veri tutmak yerine gözleme odaklanırım, bazen kağıt kalem olmadan çocukla bağ kurmak daha iyidir.', 
        clinicalValue: 40, 
        aiTag: 'clinical_rationalization' 
      },
      { 
        label: 'Seansı durdurup formun çıktısını almaya giderim, 5 dakika kaybetmek verisiz kalmaktan iyidir.', 
        clinicalValue: 80, 
        aiTag: 'protocol_adherence' 
      }
    ]
  },
  {
    id: 'stf_aba_v2_7',
    text: 'Doğal Öğretim (NET) sırasında çocuk oyunun liderliğini tamamen ele geçirdi ve akademik hedeften saptı. Müdahaleniz?',
    options: [
      { 
        label: 'Oyunun akışını bozmadan, hedef beceriyi (örn: renkler) çocuğun kurgusu içine sinsice yerleştiririm (Embedded Teaching).', 
        clinicalValue: 100, 
        aiTag: 'naturalistic_mastery' 
      },
      { 
        label: 'Oyunu durdurup "Önce şu kartları bilelim, sonra oynayacağız" diyerek yapılandırılmış düzene çekerim.', 
        clinicalValue: 60, 
        aiTag: 'structure_dependency' 
      },
      { 
        label: 'Çocuğun keyfi bozulmasın diye hedefleri bir kenara bırakır, sadece oyun abisi/ablası gibi eşlik ederim.', 
        clinicalValue: 30, 
        aiTag: 'goal_abandonment' 
      },
      { 
        label: 'Liderliği geri almak için elimdeki pekiştireci gösterir, kontrolün bende olduğunu hatırlatırım.', 
        clinicalValue: 70, 
        aiTag: 'control_reassertion' 
      }
    ]
  },
  {
    id: 'stf_aba_v2_8',
    text: 'Problem davranış analizinde ABC kaydı tutarken, "Öncül" (Antecedent) kısmına ne yazarsınız?',
    options: [
      { 
        label: 'Sadece gözlemlenebilir ve ölçülebilir fiziksel olayları yazarım (örn: "Işık açıldı", "Yönerge verildi"). Yorum katmam.', 
        clinicalValue: 100, 
        aiTag: 'objective_observer' 
      },
      { 
        label: 'Çocuğun hissettiği duyguyu yazarım (örn: "Çocuk sinirlendi", "Çocuk üzüldü").', 
        clinicalValue: 40, 
        aiTag: 'subjective_interpretation' 
      },
      { 
        label: 'Olayın nedenini yazarım (örn: "Çocuk tableti istediği için ağladı").', 
        clinicalValue: 50, 
        aiTag: 'premature_conclusion' 
      },
      { 
        label: 'Genel durumu yazarım (örn: "Sabah saatleriydi").', 
        clinicalValue: 60, 
        aiTag: 'vague_reporting' 
      }
    ]
  },
  {
    id: 'stf_aba_v2_9',
    text: 'Çocuğun genelleme (Generalization) sorunu var. Okulda öğrendiğini evde yapmıyor. Hata nerededir?',
    options: [
      { 
        label: 'Yeterince farklı ortamda, farklı materyallerle ve farklı kişilerle öğretim yapmadığım için hata bendedir. Eğitim planına varyasyon eklerim.', 
        clinicalValue: 100, 
        aiTag: 'self_critical_planner' 
      },
      { 
        label: 'Ailenin evde yeterince tekrar yapmadığını düşünürüm, topu aileye atarım.', 
        clinicalValue: 40, 
        aiTag: 'external_blame' 
      },
      { 
        label: 'Çocuğun zihinsel kapasitesinin buna yetmediğini, zamanla olacağını varsayarım.', 
        clinicalValue: 30, 
        aiTag: 'capacity_limiting' 
      },
      { 
        label: 'Evde de aynı materyallerin kullanılmasını isterim, ortamları benzeştirmeye çalışırım.', 
        clinicalValue: 70, 
        aiTag: 'environmental_control' 
      }
    ]
  },
  {
    id: 'stf_aba_v2_10',
    text: 'Bakım veren (Anne/Baba) seansta veri tutmanızı "soğuk ve mekanik" bulduğunu söyledi. Cevabınız?',
    options: [
      { 
        label: 'Verinin çocuğun "sesi" olduğunu anlatırım. "Onun gelişimini şansa veya tahminlere bırakamayacak kadar çok önemsiyorum" diyerek bilimsel duruşumu şefkatle çerçevelerim.', 
        clinicalValue: 100, 
        aiTag: 'compassionate_scientist' 
      },
      { 
        label: 'Haklı olduklarını söyleyerek onların yanında veri tutmayı bırakır, seans sonrası hatırladığım kadarıyla doldururum.', 
        clinicalValue: 20, 
        aiTag: 'people_pleaser' 
      },
      { 
        label: 'Bunun kurum kuralı olduğunu, yapmak zorunda olduğumu söylerim. Sorumluluğu yönetime atarım.', 
        clinicalValue: 50, 
        aiTag: 'bureaucratic_shield' 
      },
      { 
        label: 'Veri tutmazsam ilerlemeyi göremeyiz diyerek sert ve teknik bir açıklama yaparım.', 
        clinicalValue: 80, 
        aiTag: 'cold_professional' 
      }
    ]
  }
];
