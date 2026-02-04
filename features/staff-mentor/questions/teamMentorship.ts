import { AssessmentQuestion } from '../../../types';

export const teamMentorshipQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_tm_v2_1',
    text: 'Başka bir branş uzmanının (örn: Ergoterapist) sizin hedeflerinizle çelişen bir müdahale yaptığını gördünüz. Yol haritanız?',
    options: [
      { 
        label: 'Entegratör Lider: Bunu bir çatışma değil "Vaka Konseyi" fırsatı olarak görürüm. Arkadaşımı davet edip "ortak bir hibrit protokol" oluşturmak için liderlik üstlenirim.', 
        clinicalValue: 100, 
        aiTag: 'multidisciplinary_integrator' 
      },
      { 
        label: 'Sınır Bekçisi: Branş sınırlarını hatırlatırım; her uzmanın kendi teknik sahasında tam yetkiye sahip olması gerektiğini, müdahalenin benim alanımı sabote ettiğini net bir dille belirtirim.', 
        clinicalValue: 75, 
        aiTag: 'expertise_border_patrol' 
      },
      { 
        label: 'Pasif Uyumcu: Çatışma çıkmasın diye sesimi çıkarmam, kendi seansımda bildiğimi okurum ama diğer uzmana karışmam.', 
        clinicalValue: 50, 
        aiTag: 'conflict_avoidant' 
      },
      { 
        label: 'Şikayetçi: Durumu doğrudan arkadaşımla konuşmak yerine yönetime "yanlış tedavi uygulanıyor" diye rapor ederim.', 
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
        label: 'Bilgi Paylaşımcısı: Kolektif zekaya inanırım. Kurum içi standardizasyonun vaka başarısını çarpan etkisiyle artıracağını bilerek eğitimini tüm ekibe veririm.', 
        clinicalValue: 100, 
        aiTag: 'knowledge_sharer' 
      },
      { 
        label: 'Rekabetçi: Bu formun benim kişisel liyakatimin ve emeğimin bir simgesi olduğunu düşünürüm. Sadece çok güvendiğim kısıtlı bir çevreyle paylaşmayı tercih ederim.', 
        clinicalValue: 60, 
        aiTag: 'competitive_gatekeeper' 
      },
      { 
        label: 'Takasçı: Paylaşırım ama karşılığında ben de onlardan materyal veya imtiyaz beklerim. Bilgi alışverişi ticari olmalıdır.', 
        clinicalValue: 70, 
        aiTag: 'transactional_colleague' 
      },
      { 
        label: 'Gizli Tutucu: Paylaşmış gibi yaparım ama formun en kritik (püf noktası) kısımlarını kendime saklarım.', 
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
        label: 'Hizmetkar Liderlik: Bunu bir angarya değil, "liderlik provası" olarak görürüm. Onun hatalarını klinik bir laboratuvar gibi analiz eder, aktif geri bildirimle kuruma kazandırırım.', 
        clinicalValue: 100, 
        aiTag: 'servant_leadership' 
      },
      { 
        label: 'Bireysel Performans: Kendi vaka yükümün zaten ağır olduğunu belirtirim. Junior uzmanın sadece beni izleyerek (pasif gözlem) öğrenmesini isterim, aktif eğitim verecek vaktim yoktur.', 
        clinicalValue: 60, 
        aiTag: 'individual_performer' 
      },
      { 
        label: 'Üstten Bakış: Mentorluğu kabul ederim ama ona sürekli yetersizliğini hissettirerek hiyerarşiyi dayatırım.', 
        clinicalValue: 40, 
        aiTag: 'hierarchical_bully' 
      },
      { 
        label: 'Görevi İade: "Bunun için ekstra ücret alacak mıyım?" diye sorarım, yoksa görevi reddederim.', 
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
        label: 'Demokratik Olgunluk: Demokratik sürece ve ekibin ortak aklına saygı duyarım; "belki göremediğim bir kör nokta vardır" diyerek geri çekilir, alınan kararı desteklerim.', 
        clinicalValue: 100, 
        aiTag: 'collaborative_humility' 
      },
      { 
        label: 'Entelektüel İnat: Bilimsel doğruluğundan eminsem fikrimin arkasında sonuna kadar dururum. Yanlış karar uygulanıp başarısız olunduğunda "kayıtlara geçsin" tavrını takınırım.', 
        clinicalValue: 80, 
        aiTag: 'intellectual_obstinacy' 
      },
      { 
        label: 'Küsme: Fikrim değer görmediği için motivasyonum düşer, toplantının geri kalanında sessiz kalırım ve katkı vermem.', 
        clinicalValue: 40, 
        aiTag: 'emotional_withdrawal' 
      },
      { 
        label: 'Politik Uyum: Fikrimi hemen değiştirip çoğunluğun fikrini savunmaya başlarım, güçlünün yanında olmayı severim.', 
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
        label: 'Kurumsal Muhafız: Hatanın kurumsal risk yaratmaması için derhal resmi kanallardan raporlarım; liyakatli bir kurumda "arkadaş koruma" refleksi, kaliteyi çürüten bir virüstür.', 
        clinicalValue: 100, 
        aiTag: 'institutional_guardian' 
      },
      { 
        label: 'Koruyucu Yoldaş: Kişiyi kenara çeker ve hatayı birlikte, sessizce düzeltmeyi teklif ederim. Durumu "öğrenme fırsatı" olarak kendi aramızda saklar, yönetime yansıtmam.', 
        clinicalValue: 70, 
        aiTag: 'protective_camaraderie' 
      },
      { 
        label: 'Görmezden Gelme: Bana dokunmayan yılan bin yaşasın derim, başkasının hatası yüzünden başımı ağrıtmam.', 
        clinicalValue: 40, 
        aiTag: 'passive_negligence' 
      },
      { 
        label: 'Dedikodu Malzemesi: Hatayı düzeltmem veya raporlamam ama diğer arkadaşlara anlatarak kişinin itibarını zedelerim.', 
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
        label: 'Kapsayıcı Lider: En sessiz personelin bile fikrini alarak demokratik bir plan yaparım, sürecin kendisi bile bağ kurmak için bir araçtır.', 
        clinicalValue: 100, 
        aiTag: 'democratic_facilitator' 
      },
      { 
        label: 'Otoriter Pragmatist: Hızlıca en verimli planı yapar ve görev dağılımı tebliğ ederim. Vaktimizi organizasyon tartışmalarıyla kaybetmeyiz.', 
        clinicalValue: 75, 
        aiTag: 'autocratic_efficiency' 
      },
      { 
        label: 'Popülist: Sadece popüler ve sesi çok çıkan grubun istediği bir etkinlik yaparım, diğerlerini önemsemem.', 
        clinicalValue: 50, 
        aiTag: 'populist_exclusion' 
      },
      { 
        label: 'Delegasyoncu: İşi başkasına yıkarım, "ben yoğunum siz halledin" diyerek sorumluluktan kaçarım.', 
        clinicalValue: 30, 
        aiTag: 'responsibility_avoidance' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_7',
    text: 'Bir BEP toplantısında sizden çok daha genç bir uzman (yeni mezun) sizin görüşünüze zıt, modern bir teori sundu. Tepkiniz?',
    options: [
      { 
        label: 'Gelişim Zihniyeti: Merakla dinlerim; akademik literatürün hızla değiştiğini bilir, "tersine mentorluk" (Reverse Mentoring) ile ondan bir şeyler öğrenmeye açık olurum.', 
        clinicalValue: 100, 
        aiTag: 'growth_mindset_senior' 
      },
      { 
        label: 'Tecrübe Hiyerarşisi: Tecrübemle fikrini nazikçe çürütürüm; vakanın "deneme tahtası" olmadığını ve sahada yılların getirdiği pratiğin kitabi bilgiden üstün olduğunu hatırlatırım.', 
        clinicalValue: 60, 
        aiTag: 'experience_hierarchy' 
      },
      { 
        label: 'Saldırgan Savunma: Topluluk içinde onu bozarak otoritemi sarsmasına izin vermem, "daha yolun başındasın" diyerek sustururum.', 
        clinicalValue: 30, 
        aiTag: 'ego_defense' 
      },
      { 
        label: 'İroni: "Kitapta öyle yazıyor olabilir ama burası gerçek dünya" diyerek alaycı bir tavırla fikri geçiştiririm.', 
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
        label: 'Sonuç Odaklı Fedakar: Vaka/proje zarar görmesin diye onun açığını da kapatır, işi bitiririm. Başarıyı kişisel egolardan üstün tutarım.', 
        clinicalValue: 100, 
        aiTag: 'mission_focused_altruist' 
      },
      { 
        label: 'Adalet Savaşçısı: Kişiyi gruptan izole eder veya yönetime raporlarım. Emek sömürüsüne göz yummak, profesyonelliğe hakarettir.', 
        clinicalValue: 80, 
        aiTag: 'justice_warrior' 
      },
      { 
        label: 'Misilleme: Ben de işi bırakırım, proje batarsa batsın, kimse beni enayi yerine koyamaz.', 
        clinicalValue: 30, 
        aiTag: 'retaliatory_sabotage' 
      },
      { 
        label: 'Pasif Kabulleniş: Sesimi çıkarmam, durumu idare ederim ama içten içe öfke biriktiririm.', 
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
        label: 'Organik Dayanışma: Birbirinin açığını kapatan, duygusal bağları kuvvetli, kriz anında kenetlenen "organik bir aile" yapısı.', 
        clinicalValue: 100, 
        aiTag: 'organic_solidarity' 
      },
      { 
        label: 'Mekanik İşlevsellik: Herkesin kendi görev tanımını (Job Description) kusursuz yaptığı, duygusallıktan uzak, yüksek verimli profesyonel bir makine.', 
        clinicalValue: 90, 
        aiTag: 'functional_machinery' 
      },
      { 
        label: 'Lidersiz Yapı: Kimsenin kimseye karışmadığı, herkesin kendi odasında özgür olduğu, hiyerarşisiz bir yapı.', 
        clinicalValue: 60, 
        aiTag: 'anarchic_autonomy' 
      },
      { 
        label: 'Rekabetçi Arena: Herkesin birbirini geçmeye çalıştığı, rekabetin performansı artırdığı bir yapı.', 
        clinicalValue: 50, 
        aiTag: 'competitive_toxicity' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_10',
    text: 'Kurumda bir arkadaşınızın veli ile "profesyonel sınırı aşan" (örn: özel hayatını anlatan) bir samimiyet kurduğunu gördünüz. Müdahaleniz?',
    options: [
      { 
        label: 'Sınır Koruyucu: Önce arkadaşımı uyarırım, davranış devam ederse bunun "kurumsal imajı" zedelediğini belirterek süpervizöre durumu iletirim.', 
        clinicalValue: 100, 
        aiTag: 'boundary_enforcer' 
      },
      { 
        label: 'Pasif Gözlemci: Veli şikayet etmediği sürece karışmam; her uzmanın yoğurt yiyişi farklıdır, müdahale etmek dedikoduya girer.', 
        clinicalValue: 50, 
        aiTag: 'passive_observer' 
      },
      { 
        label: 'Onaylayıcı: Ben de velilerle samimi olmayı severim, arkadaşımı desteklerim, bu durumun müşteri sadakatini artırdığını düşünürüm.', 
        clinicalValue: 40, 
        aiTag: 'boundary_violator' 
      },
      { 
        label: 'Fırsatçı: Bu durumu not ederim, ileride bir açık yakalamam gerekirse aleyhine kullanırım.', 
        clinicalValue: 20, 
        aiTag: 'machiavellian_opportunist' 
      }
    ]
  }
];
