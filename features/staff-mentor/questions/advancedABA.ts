import { AssessmentQuestion } from '../../../types';

export const advancedABAQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_aba_v2_1',
    text: 'Seansın en yoğun yerinde öğrenci "Sönme Patlaması" (Burst) yaşıyor. Güvenlik riski yok ancak yan odadaki uzmanlar ve veliler gürültüden rahatsız. Tavrınız?',
    options: [
      { 
        label: 'Klinik protokolün bozulmasının davranışı daha dirençli kılacağını bildiğim için müdahaleye tavizsiz devam ederim; bilimsel sadakatin kurum huzurundan ve anlık konfordan daha öncelikli olduğunu savunurum.', 
        clinicalValue: 100, 
        aiTag: 'methodological_purity' 
      },
      { 
        label: 'Kurumun genel işleyişini ve diğer öğrencilerin haklarını gözeterek, seansı o an için regüle edecek yumuşatılmış bir geçiş planı uygularım; dengeli bir kurumsal uyumu klinik doğruların önüne koyarım.', 
        clinicalValue: 70, 
        aiTag: 'institutional_harmony' 
      },
      { 
        label: 'Çocuğun kulağına fısıldayarak veya dikkatini dağıtacak bir oyuncak vererek davranışı durdurmaya çalışırım; yeter ki ses kesilsin ve çevre rahatsız olmasın diye anlık semptom baskılamayı seçerim.', 
        clinicalValue: 40, 
        aiTag: 'symptom_suppression' 
      },
      { 
        label: 'Seansı o anlık sonlandırıp çocuğu dışarı çıkarırım; kriz anında eğitim yapılamayacağını düşünür ve kriz yönetimini bir sonraki seansa erteleyerek ortamdan kaçınma refleksi gösteririm.', 
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
        label: 'Sezgileri tamamen devre dışı bırakır, veriye sadık kalırım; müdahale planını derhal revize eder ve farklı bir uyaran kontrolü denemek için bilimsel metodolojiyi en baştan işletirim.', 
        clinicalValue: 100, 
        aiTag: 'data_driven_rigor' 
      },
      { 
        label: 'Verilerin henüz ölçemediği niteliksel değişimleri gözlemlerim; mevcut metoda bir süre daha şans verir ve çocukla kurulan bağın derinleşmesinin veriye yansımasını sabırla beklemeyi tercih ederim.', 
        clinicalValue: 60, 
        aiTag: 'clinical_intuition' 
      },
      { 
        label: 'Süpervizörüme danışırım ama içten içe çocuğun kapasitesinin bu kadar olduğunu düşünmeye başlarım; başarısızlığı vakanın sınırlarına atfederek kendi yöntemimi sorgulamaktan kaçınırım.', 
        clinicalValue: 40, 
        aiTag: 'low_expectation' 
      },
      { 
        label: 'Veri tutmayı bir süreliğine bırakıp tamamen oyun terapisine dönerim; çocuğun sıkıldığını varsayarak klinik hedeflerden vazgeçer ve süreci tamamen serbest zaman akışına bırakırım.', 
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
        label: 'Hata payını göze alarak ipuçlarını agresif bir şekilde silikleştiririm; başarısızlık hissinin öğrenme için gerekli bir kamçı olduğuna inanarak vakanın bağımsızlık sınırlarını zorlarım.', 
        clinicalValue: 100, 
        aiTag: 'risk_tolerant_expert' 
      },
      { 
        label: 'İpucu silikleştirmeyi mikroskobik adımlarla yaparım; hata biriktirmenin çocukta kalıcı bir kaçınma yaratmasından çekinerek çok daha güvenli ve yavaş bir ilerleme rotası izlerim.', 
        clinicalValue: 80, 
        aiTag: 'protective_methodology' 
      },
      { 
        label: 'Çocuk bağımsız yapana kadar tam fiziksel ipucu vermeye devam ederim; acele etmenin süreci bozacağını varsayarak vakanın hazır olmasını belirsiz bir süre boyunca beklemeyi seçerim.', 
        clinicalValue: 50, 
        aiTag: 'stagnation_risk' 
      },
      { 
        label: 'İpucunu tamamen keserim ve yapamazsa ödül vermem; çocuğun çaresiz kalınca yapmak zorunda kalacağını düşünerek klinik şefkatten uzak ve riskli bir cezalandırma modeline geçerim.', 
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
        label: 'Mevcut pekiştireçleri ortamdan tamamen kaldırır ve yoksunluk süreci başlatırım; envanter değerlendirmesi yaparak vaka için yeni ve daha güçlü motivasyon kaynakları inşa ederim.', 
        clinicalValue: 100, 
        aiTag: 'motivation_architect' 
      },
      { 
        label: 'Ödül miktarını artırırım; bir tane kraker yerine tüm paketi vererek ilgisini çekmeye çalışırım ancak bunun doyum sorununu daha da derinleştireceğini göz ardı ederek günü kurtarırım.', 
        clinicalValue: 40, 
        aiTag: 'bribing_tendency' 
      },
      { 
        label: 'Sosyal pekiştireçlere (Aferin, Harikasın) ağırlık veririm; maddi ödüllere çok alışmasını istemediğim için motivasyon düşse de öğretimi sözel övgülerle sürdürmeye gayret ederim.', 
        clinicalValue: 70, 
        aiTag: 'social_transition' 
      },
      { 
        label: 'Dersi o anlık bitiririm; çocuk istekli değilse zorla öğretim yapılamayacağını savunarak seans verimliliğini tamamen vakanın o anki ruh haline ve kaprisine endekslerim.', 
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
        label: 'Görevi geri çekmem ve masanın altına girip orada çalışmaya devam ederim; kaçma davranışının işlevsel amacına ulaşmasını engelleyerek sınırların korunmasını birincil hedef yaparım.', 
        clinicalValue: 100, 
        aiTag: 'function_based_persistence' 
      },
      { 
        label: 'Çocuğu fiziksel güçle masada tutmaya çalışırım; otoritenin fiziksel hakimiyetten geçtiğini düşünerek vaka ile aramdaki güven bağını zedeleyecek bir baskı uygulama yolunu seçerim.', 
        clinicalValue: 30, 
        aiTag: 'physical_coercion' 
      },
      { 
        label: '"Tamam, biraz mola verelim" diyerek çocuğu rahat bırakırım; sakinleşince tekrar deneriz diyerek aslında kaçma davranışını yanlışlıkla pekiştirmiş ve süreci sabote etmiş olurum.', 
        clinicalValue: 20, 
        aiTag: 'negative_reinforcement_trap' 
      },
      { 
        label: 'Masadaki görevi hemen kolaylaştırırım; belki zor geldiği için kaçıyordur diye varsayarak hedeflerimi vakanın konfor alanına göre aşağı çeker ve akademik ilerlemeyi yavaşlatırım.', 
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
        label: 'Elimin üzerindeki deriye veya bulduğum bir peçeteye sembollerle not alır ve seans bitimi sisteme işlerim; verisiz geçen bir seansın klinik olarak yok hükmünde olduğunu savunurum.', 
        clinicalValue: 100, 
        aiTag: 'data_obsessed' 
      },
      { 
        label: 'Bu seanslık verileri hafızamda tutarım ve gün sonunda aklımda kalanlarla genel bir özet yazarım; tam doğruluktan ödün vererek yaklaşık bir gelişim tahmini üzerinden ilerlerim.', 
        clinicalValue: 50, 
        aiTag: 'memory_reliance_risk' 
      },
      { 
        label: 'Veri tutmak yerine vaka ile bağ kurmaya odaklanırım; bazen kağıt kalem olmadan çocukla kurulan etkileşimin mekanik veri takibinden daha iyileştirici olduğunu rasyonalize ederim.', 
        clinicalValue: 40, 
        aiTag: 'clinical_rationalization' 
      },
      { 
        label: 'Seansı durdurup formun çıktısını almaya giderim; 5-10 dakika kaybetmenin verisiz kalmaktan daha iyi olduğunu düşünerek seans bütünlüğünü teknik bir detay için bozarım.', 
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
        label: 'Oyunun akışını bozmadan, hedef beceriyi çocuğun kurgusu içine sinsice yerleştiririm; öğretimi oyunun doğal bir uzantısı haline getirerek vakanın ilgisini akademik yakıta çeviririm.', 
        clinicalValue: 100, 
        aiTag: 'naturalistic_mastery' 
      },
      { 
        label: 'Oyunu durdurup "Önce şu kartları bilelim, sonra oynayacağız" diyerek yapılandırılmış düzene çekerim; kontrolü geri almak için seansın doğallığını feda etmeyi tercih ederim.', 
        clinicalValue: 60, 
        aiTag: 'structure_dependency' 
      },
      { 
        label: 'Çocuğun keyfi bozulmasın diye akademik hedefleri bir kenara bırakır ve sadece oyun eşlikçisi olurum; öğretici rolümden sıyrılıp vakanın pasif bir oyun arkadaşına dönüşürüm.', 
        clinicalValue: 30, 
        aiTag: 'goal_abandonment' 
      },
      { 
        label: 'Liderliği geri almak için elimdeki pekiştireci gösterir ve kontrolün bende olduğunu hatırlatırım; motivasyonu bir rüşvet gibi kullanarak çocuğun ilgisini zorla kendime yönlendiririm.', 
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
        label: 'Sadece gözlemlenebilir ve ölçülebilir fiziksel olayları yazarım; davranıştan hemen önce ortamda değişen her şeyi yorum katmadan saf bir veri olarak dökümante ederim.', 
        clinicalValue: 100, 
        aiTag: 'objective_observer' 
      },
      { 
        label: 'Çocuğun o an hissettiğini varsaydığım duyguyu yazarım; "Çocuk sinirlendi" gibi öznel ifadelerle davranışın kökenini tahminlere dayalı bir şekilde raporlamayı seçerim.', 
        clinicalValue: 40, 
        aiTag: 'subjective_interpretation' 
      },
      { 
        label: 'Olayın nedenini sonuçla birleştirerek yazarım; "Çocuk tableti istediği için ağladı" diyerek analiz yapmadan peşin bir hükümle veri alanını kirletmiş olurum.', 
        clinicalValue: 50, 
        aiTag: 'premature_conclusion' 
      },
      { 
        label: 'Sadece genel zaman dilimini yazarım; "Sabah saatleriydi" veya "Dersin sonuydu" gibi vakanın tepkisini tetikleyen asıl uyaranı ıskalayan muğlak ifadeler kullanırım.', 
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
        label: 'Yeterince farklı ortamda ve materyalle çalışmadığım için sorumluluğu üstlenirim; eğitim planına varyasyonlar ekleyerek beceriyi yaşamın her alanına yaymaya odaklanırım.', 
        clinicalValue: 100, 
        aiTag: 'self_critical_planner' 
      },
      { 
        label: 'Ailenin evde yeterince tekrar yapmadığını düşünür ve sorumluluğu tamamen dışsal faktörlere atarım; kendi öğretim sürecimin eksiksiz olduğunu varsayarak topu aileye atarım.', 
        clinicalValue: 40, 
        aiTag: 'external_blame' 
      },
      { 
        label: 'Çocuğun zihinsel kapasitesinin buna yetmediğini varsayar ve beklentilerimi düşürürüm; başarısızlığı nörolojik bir engele bağlayarak çözüm aramaktan vazgeçme eğilimi gösteririm.', 
        clinicalValue: 30, 
        aiTag: 'capacity_limiting' 
      },
      { 
        label: 'Evde de aynı materyallerin kullanılmasını şart koşarım; ortamları yapay bir şekilde benzeştirerek çocuğun beceriyi esnek bir şekilde kullanmasını öğrenmesini engellerim.', 
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
        label: 'Verinin çocuğun gelişim dili olduğunu şefkatle anlatırım; vakanın geleceğini tahminlere bırakamayacak kadar çok önemsediğimi belirterek bilimsel duruşumu insancıl bir temele oturturum.', 
        clinicalValue: 100, 
        aiTag: 'compassionate_scientist' 
      },
      { 
        label: 'Haklı olduklarını söyleyerek onların yanında veri tutmayı bırakırım; aileyle aramın bozulmaması için klinik kalitemden ödün verir ve verileri seans sonrası hayali olarak doldururum.', 
        clinicalValue: 20, 
        aiTag: 'people_pleaser' 
      },
      { 
        label: 'Bunun kurum kuralı olduğunu ve yapmak zorunda olduğumu söylerim; sorumluluğu yönetime atarak profesyonel kimliğimdeki inisiyatifi ve yetkinliği reddetmiş olurum.', 
        clinicalValue: 50, 
        aiTag: 'bureaucratic_shield' 
      },
      { 
        label: 'Veri tutmazsam ilerlemeyi göremeyiz diyerek sert ve teknik bir açıklama yaparım; ailenin duygusal kaygılarını tamamen görmezden gelerek mekanik bir uzman imajı çizerim.', 
        clinicalValue: 80, 
        aiTag: 'cold_professional' 
      }
    ]
  }
];
