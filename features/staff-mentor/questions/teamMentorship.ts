import { AssessmentQuestion } from '../../../types';

export const teamMentorshipQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_tm_v2_1',
    text: 'Başka bir branş uzmanının (örn: Ergoterapist) sizin hedeflerinizle çelişen bir müdahale yaptığını gördünüz. Yol haritanız?',
    options: [
      { 
        label: 'Bunu bir çatışma değil vaka konseyi fırsatı olarak görürüm; arkadaşımı davet edip ortak bir hibrit protokol oluşturmak için yapıcı bir multidispliner liderlik üstlenirim.', 
        clinicalValue: 100, 
        aiTag: 'multidisciplinary_integrator' 
      },
      { 
        label: 'Branş sınırlarını hatırlatırım; her uzmanın kendi teknik sahasında tam yetkiye sahip olması gerektiğini savunarak müdahalenin alanımı sabote ettiğini belirten bir sınır koruma duruşu sergilerim.', 
        clinicalValue: 75, 
        aiTag: 'expertise_border_patrol' 
      },
      { 
        label: 'Çatışma çıkmasın diye sesimi çıkarmam; kendi seansımda bildiğimi okurum ancak diğer uzmanın hatasını vaka üzerinden izleyerek kurumsal bir sessizliği ve çatışma kaçınmasını tercih ederim.', 
        clinicalValue: 50, 
        aiTag: 'conflict_avoidant' 
      },
      { 
        label: 'Durumu doğrudan arkadaşımla konuşmak yerine yönetime rapor ederim; "yanlış tedavi uygulanıyor" diyerek çalışma barışını bozan ve ekip içi güveni sarsan bir ihbarcı refleks sergilerim.', 
        clinicalValue: 40, 
        aiTag: 'toxic_escalation' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_2',
    text: 'Sizin geliştirdiğiniz çok etkili bir "vaka takip formunu" tüm ekiple paylaşmanız istendi. Hisleriniz?',
    options: [
      { 
        label: 'Kolektif zekaya inanırım; kurum içi standardizasyonun vaka başarısını çarpan etkisiyle artıracağını bilerek formun eğitimini tüm ekibe vermeyi büyük bir mutlulukla kabul ederim.', 
        clinicalValue: 100, 
        aiTag: 'knowledge_sharer' 
      },
      { 
        label: 'Bu formun benim kişisel liyakatimin ve emeğimin bir simgesi olduğunu düşünürüm; sadece çok güvendiğim kısıtlı bir çevreyle paylaşarak kendi liyakat alanımı koruyan bir rekabetçilik sergilerim.', 
        clinicalValue: 60, 
        aiTag: 'competitive_gatekeeper' 
      },
      { 
        label: 'Paylaşırım ama karşılığında ben de onlardan materyal veya imtiyaz beklerim; bilgi alışverişini profesyonel bir yardımlaşma değil ticari bir takas alanı olarak gören pragmatik bir tavır takınırım.', 
        clinicalValue: 70, 
        aiTag: 'transactional_colleague' 
      },
      { 
        label: 'Paylaşmış gibi yaparım ama formun en kritik püf noktalarını kendime saklarım; ekibi eksik veriyle yönlendirerek kendi vazgeçilmezliğimi korumaya çalışan manipülatif bir istifçilik yaparım.', 
        clinicalValue: 40, 
        aiTag: 'manipulative_hoarder' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_3',
    text: 'Kuruma yeni başlayan tecrübesiz bir uzmana (Junior) mentorluk yapmanız istendi. Yaklaşımınız?',
    options: [
      { 
        label: 'Bunu bir angarya değil liderlik provası olarak görürüm; onun hatalarını klinik bir laboratuvar gibi analiz eder ve aktif geri bildirimle onu kuruma hızla kazandıran bir hizmetkar liderlik yaparım.', 
        clinicalValue: 100, 
        aiTag: 'servant_leadership' 
      },
      { 
        label: 'Kendi vaka yükümün ağır olduğunu belirtirim; junior uzmanın sadece beni izleyerek öğrenmesini isterim ve aktif eğitim verecek vaktim olmadığını savunan bireysel bir performans odağı benimserim.', 
        clinicalValue: 60, 
        aiTag: 'individual_performer' 
      },
      { 
        label: 'Mentorluğu kabul ederim ama ona sürekli yetersizliğini hissettiririm; otoritemi junior personelin hataları üzerinden inşa ederek hiyerarşiyi dayatan baskıcı bir kıdemlilik duruşu sergilerim.', 
        clinicalValue: 40, 
        aiTag: 'hierarchical_bully' 
      },
      { 
        label: 'Bu görev için ekstra ücret alıp almayacağımı sorarım; mentorluğu bir kurumsal sorumluluk değil sadece maddi bir kazanç kapısı olarak gören paralı asker zihniyetini mesleğe yansıtırım.', 
        clinicalValue: 50, 
        aiTag: 'mercenary_attitude' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_4',
    text: 'Ekip toplantısında sunduğunuz bilimsel bir fikre çoğunluk karşı çıktı. Reaksiyonunuz?',
    options: [
      { 
        label: 'Demokratik sürece ve ekibin ortak aklına saygı duyarım; göremediğim bir kör nokta olabileceğini kabul ederek geri çekilir ve alınan ortak kararı en iyi şekilde uygulamaya odaklanırım.', 
        clinicalValue: 100, 
        aiTag: 'collaborative_humility' 
      },
      { 
        label: 'Bilimsel doğruluğundan eminsem fikrimin arkasında sonuna kadar dururum; yanlış karar uygulanıp başarısız olunduğunda "ben söylemiştim" diyerek kayıtlara geçmeyi bir dürüstlük borcu bilirim.', 
        clinicalValue: 80, 
        aiTag: 'intellectual_obstinacy' 
      },
      { 
        label: 'Fikrim değer görmediği için motivasyonum düşer ve toplantının kalanında sessiz kalırım; ekibe olan aidiyetimi anlık bir fikir reddi üzerinden sıfırlayan duygusal bir içe çekilme refleksi gösteririm.', 
        clinicalValue: 40, 
        aiTag: 'emotional_withdrawal' 
      },
      { 
        label: 'Fikrimi hemen değiştirip çoğunluğun fikrini savunmaya başlarım; her zaman güçlünün ve kalabalığın tarafında olmayı seçerek kendi bilimsel kanaatlerinden vazgeçen politik bir bukalemunluk yaparım.', 
        clinicalValue: 50, 
        aiTag: 'political_chameleon' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_5',
    text: 'Ekibinizden birinin çok büyük bir klinik hata yaptığını fark ettiniz ama kimse görmedi. Ne yaparsınız?',
    options: [
      { 
        label: 'Hatanın kurumsal risk yaratmaması için derhal resmi kanallardan raporlarım; liyakatli bir kurumda arkadaş koruma refleksinin kaliteyi çürüten bir virüs olduğuna ve etik sadakatin her şeyden üstün olduğuna inanırım.', 
        clinicalValue: 100, 
        aiTag: 'institutional_guardian' 
      },
      { 
        label: 'Kişiyi kenara çeker ve hatayı birlikte sessizce düzeltmeyi teklif ederim; durumu bir öğrenme fırsatı olarak sadece ikimiz arasında saklar ve yönetime yansıtmayarak hatayı gizli tutmayı seçerim.', 
        clinicalValue: 70, 
        aiTag: 'protective_camaraderie' 
      },
      { 
        label: 'Bana dokunmayan yılan bin yaşasın derim; başkasının hatası yüzünden aramı bozmak istemeyerek kurumsal verimliliği ve vaka güvenliğini tehlikeye atan pasif bir ihmalkarlık sergilerim.', 
        clinicalValue: 40, 
        aiTag: 'passive_negligence' 
      },
      { 
        label: 'Hatayı düzeltmem veya raporlamam ama diğer arkadaşlara anlatarak o kişinin itibarını sarsarım; kurumsal kanalları kullanmak yerine toksik dedikodu üzerinden ekip içi bir güç savaşı başlatırım.', 
        clinicalValue: 20, 
        aiTag: 'toxic_gossip' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_6',
    text: 'Müdürünüz size tüm ekibin moralini yükseltmek için bir organizasyon yapmanızı söyledi. Liderlik tarzınız?',
    options: [
      { 
        label: 'En sessiz personelin bile fikrini alarak demokratik bir plan yaparım; sürecin kendisinin bile bağ kurmak için bir araç olduğunu bilir ve katılımı en üst düzeyde tutan kapsayıcı bir facilitate tarzı benimserim.', 
        clinicalValue: 100, 
        aiTag: 'democratic_facilitator' 
      },
      { 
        label: 'Hızlıca en verimli planı yapar ve görev dağılımı tebliğ ederim; vaktimizi organizasyon tartışmalarıyla kaybetmeyerek sonuca en kısa yoldan gitmeyi hedefleyen otokratik bir verimlilik modeli uygularım.', 
        clinicalValue: 75, 
        aiTag: 'autocratic_efficiency' 
      },
      { 
        label: 'Sadece popüler ve sesi çok çıkan grubun istediği bir etkinlik yaparım; kurumdaki klikleşmeleri besleyen ve çoğunluğun talebi üzerinden diğer personeli dışlayan popülist bir dışlayıcılık sergilerim.', 
        clinicalValue: 50, 
        aiTag: 'populist_exclusion' 
      },
      { 
        label: 'İşi bir başkasına yıkarım ve "ben yoğunum siz halledin" derim; liderlik sorumluluğundan kaçarak ekip motivasyonunu başkasının üzerine yıkan ve otoritesini devreden bir sorumsuzluk refleksi gösteririm.', 
        clinicalValue: 30, 
        aiTag: 'responsibility_avoidance' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_7',
    text: 'Bir BEP toplantısında sizden çok daha genç bir uzman (yeni mezun) sizin görüşünüze zıt modern bir teori sundu. Tepkiniz?',
    options: [
      { 
        label: 'Merakla dinlerim; akademik literatürün hızla değiştiğini bilir ve tersine mentorluk ile ondan yeni şeyler öğrenmeye açık olan gelişim odaklı bir kıdemlilik sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'growth_mindset_senior' 
      },
      { 
        label: 'Tecrübemle fikrini nazikçe çürütürüm; vakanın bir deneme tahtası olmadığını ve sahada yılların getirdiği pratiğin kitabi bilgiden üstün olduğunu hatırlatan hiyerarşik bir duruş sergilerim.', 
        clinicalValue: 60, 
        aiTag: 'experience_hierarchy' 
      },
      { 
        label: 'Topluluk içinde onu bozarak otoritemi sarsmasına izin vermem; "daha yolun başındasın" diyerek susturan ve genç uzmanların fikirlerini sistematik olarak baskılayan bir ego savunması içine girerim.', 
        clinicalValue: 30, 
        aiTag: 'ego_defense' 
      },
      { 
        label: '"Kitapta öyle yazıyor olabilir ama burası gerçek dünya" diyerek alay ederim; teorik bilgiyi küçümseyen ve değişime kapalı olan alaycı bir statüko muhafızlığı modeli benimserim.', 
        clinicalValue: 40, 
        aiTag: 'cynical_dismissal' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_8',
    text: 'Zorunlu bir ortak çalışma projesinde grubunuzdaki birinin hiç iş yapmadığını (Free-Rider) gördünüz. Tavrınız?',
    options: [
      { 
        label: 'Vaka veya proje zarar görmesin diye onun açığını da kapatır ve işi bitiririm; kurumsal başarıyı ve vaka başarısını kişisel egolardan üstün tutan misyon odaklı bir özveri sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'mission_focused_altruist' 
      },
      { 
        label: 'Kişiyi gruptan izole eder veya yönetime raporlarım; emek sömürüsüne göz yummanın profesyonelliğe hakaret olduğunu savunarak adalet odaklı ve keskin bir sınır koruma politikası izlerim.', 
        clinicalValue: 80, 
        aiTag: 'justice_warrior' 
      },
      { 
        label: 'Ben de işi bırakırım ve proje batarsa batsın derim; kimsenin beni enayi yerine koyamayacağını düşünerek kurumsal hedefleri kişisel bir misilleme uğruna sabote eden bir sabotajcı refleks gösteririm.', 
        clinicalValue: 30, 
        aiTag: 'retaliatory_sabotage' 
      },
      { 
        label: 'Sesimi çıkarmam ve durumu idare ederim ama içten içe büyük bir öfke biriktiririm; yüzleşmekten korkan ve toksik duyguları ekip içinde pasif bir şekilde yaymaya devam eden bir küskünlük sergilerim.', 
        clinicalValue: 50, 
        aiTag: 'passive_resentment' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_9',
    text: 'Sizin için "İdeal Takım"ın tanımı nedir?',
    options: [
      { 
        label: 'Birbirinin açığını kapatan ve duygusal bağları kuvvetli olan organik bir aile yapısı; kriz anında kenetlenen ve akademik başarıyı kolektif bir ruhla inşa eden bir dayanışma topluluğu.', 
        clinicalValue: 100, 
        aiTag: 'organic_solidarity' 
      },
      { 
        label: 'Herkesin kendi görev tanımını kusursuz yaptığı ve duygusallıktan uzak yüksek verimli profesyonel bir makine; hatasızlık ve liyakat odaklı ancak insani bağları zayıf bir fonksiyonellik.', 
        clinicalValue: 90, 
        aiTag: 'functional_machinery' 
      },
      { 
        label: 'Kimsenin kimseye karışmadığı ve herkesin kendi odasında özgür olduğu hiyerarşisiz bir yapı; kurumsal standartlar yerine bireysel özerkliği öncelikli kılan anarşik bir çalışma modeli.', 
        clinicalValue: 60, 
        aiTag: 'anarchic_autonomy' 
      },
      { 
        label: 'Herkesin birbirini geçmeye çalıştığı ve rekabetin performansı artırdığı bir yapı; liyakati bir yarış olarak gören ve ekip üyelerini birbirinin rakibi haline getiren toksik bir rekabet iklimi.', 
        clinicalValue: 50, 
        aiTag: 'competitive_toxicity' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_10',
    text: 'Kurumda bir arkadaşınızın veli ile "profesyonel sınırı aşan" bir samimiyet kurduğunu gördünüz. Müdahaleniz?',
    options: [
      { 
        label: 'Önce arkadaşımı uyarırım ve davranış devam ederse bunun kurumsal imajı zedelediğini belirterek süpervizöre durumu iletirim; profesyonel sınır koruyuculuğunu ekip sadakatinin önünde tutarım.', 
        clinicalValue: 100, 
        aiTag: 'boundary_enforcer' 
      },
      { 
        label: 'Veli şikayet etmediği sürece karışmam; her uzmanın yoğurt yiyişi farklıdır diye varsayarak müdahale etmenin dedikoduya gireceğini iddia eden pasif bir gözlemcilik sergilerim.', 
        clinicalValue: 50, 
        aiTag: 'passive_observer' 
      },
      { 
        label: 'Ben de velilerle samimi olmayı severim ve arkadaşımı desteklerim; bu durumun müşteri sadakatini artırdığına inanarak profesyonel mesafe kuralını sistematik olarak ihlal eden bir ittifak kurarım.', 
        clinicalValue: 40, 
        aiTag: 'boundary_violator' 
      },
      { 
        label: 'Bu durumu not ederim ve ileride bir açık yakalamam gerekirse aleyhine kullanırım; arkadaşımın etik hatasını kendi kariyer çıkarlarım için bir koz olarak saklayan Makyavelist bir fırsatçılık yaparım.', 
        clinicalValue: 20, 
        aiTag: 'machiavellian_opportunist' 
      }
    ]
  }
];
