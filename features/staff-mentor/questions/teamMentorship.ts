import { AssessmentQuestion } from '../../../types';

export const teamMentorshipQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_tm_v2_1',
    text: 'Başka bir branş uzmanının (örn: Ergoterapist) sizin hedeflerinizle çelişen bir müdahale yaptığını gördünüz. Yol haritanız?',
    options: [
      { 
        label: 'Bunu bir çatışma değil "Vaka Konseyi" fırsatı olarak görürüm. Arkadaşımı davet edip "ortak bir hibrit protokol" oluşturmak için liderlik üstlenirim.', 
        clinicalValue: 100, 
        aiTag: 'multidisciplinary_integrator' 
      },
      { 
        label: 'Branş sınırlarını hatırlatırım; her uzmanın kendi teknik sahasında tam yetkiye sahip olması gerektiğini, müdahalenin benim alanımı sabote ettiğini net bir dille belirtirim.', 
        clinicalValue: 80, 
        aiTag: 'expertise_border_patrol' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_2',
    text: 'Sizin geliştirdiğiniz çok etkili bir "vaka takip formunu" tüm ekiple paylaşmanız istendi. Hisleriniz?',
    options: [
      { 
        label: 'Kolektif zekaya inanırım. Kurum içi standardizasyonun vaka başarısını çarpan etkisiyle artıracağını bilerek eğitimini tüm ekibe veririm.', 
        clinicalValue: 100, 
        aiTag: 'knowledge_sharer' 
      },
      { 
        label: 'Bu formun benim kişisel liyakatimin ve emeğimin bir simgesi olduğunu düşünürüm. Sadece çok güvendiğim kısıtlı bir çevreyle paylaşmayı tercih ederim.', 
        clinicalValue: 60, 
        aiTag: 'competitive_gatekeeper' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_3',
    text: 'Kuruma yeni başlayan tecrübesiz bir uzmana (Junior) mentorluk yapmanız istendi. Yaklaşımınız?',
    options: [
      { 
        label: 'Bunu bir angarya değil, "liderlik provası" olarak görürüm. Onun hatalarını klinik bir laboratuvar gibi analiz eder, aktif geri bildirimle kuruma kazandırırım.', 
        clinicalValue: 100, 
        aiTag: 'servant_leadership' 
      },
      { 
        label: 'Kendi vaka yükümün zaten ağır olduğunu belirtirim. Junior uzmanın sadece beni izleyerek (pasif gözlem) öğrenmesini isterim, aktif eğitim verecek vaktim yoktur.', 
        clinicalValue: 50, 
        aiTag: 'individual_performer' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_4',
    text: 'Ekip toplantısında sunduğunuz bilimsel bir fikre çoğunluk karşı çıktı. Reaksiyonunuz?',
    options: [
      { 
        label: 'Demokratik sürece ve ekibin ortak aklına saygı duyarım; "belki göremediğim bir kör nokta vardır" diyerek geri çekilir, alınan kararı desteklerim.', 
        clinicalValue: 100, 
        aiTag: 'collaborative_humility' 
      },
      { 
        label: 'Bilimsel doğruluğundan eminsem fikrimin arkasında sonuna kadar dururum. Yanlış karar uygulanıp başarısız olunduğunda "kayıtlara geçsin" tavrını takınırım.', 
        clinicalValue: 85, 
        aiTag: 'intellectual_obstinacy' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_5',
    text: 'Ekibinizden birinin çok büyük bir klinik hata yaptığını fark ettiniz ama kimse görmedi. Ne yaparsınız?',
    options: [
      { 
        label: 'Hatanın kurumsal risk yaratmaması için derhal resmi kanallardan raporlarım; liyakatli bir kurumda "arkadaş koruma" refleksi, kaliteyi çürüten bir virüstür.', 
        clinicalValue: 100, 
        aiTag: 'institutional_guardian' 
      },
      { 
        label: 'Kişiyi kenara çeker ve hatayı birlikte, sessizce düzeltmeyi teklif ederim. Durumu "öğrenme fırsatı" olarak kendi aramızda saklar, yönetime yansıtmam.', 
        clinicalValue: 70, 
        aiTag: 'protective_camaraderie' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_6',
    text: 'Müdürünüz size tüm ekibin moralini yükseltmek için bir organizasyon yapmanızı söyledi. Liderlik tarzınız?',
    options: [
      { 
        label: 'Kapsayıcı Liderlik; en sessiz personelin bile fikrini alarak demokratik bir plan yaparım, sürecin kendisi bile bağ kurmak için bir araçtır.', 
        clinicalValue: 100, 
        aiTag: 'democratic_facilitator' 
      },
      { 
        label: 'Pragmatik Liderlik; hızlıca en verimli planı yapar ve görev dağılımı tebliğ ederim. Vaktimizi organizasyon tartışmalarıyla kaybetmeyiz.', 
        clinicalValue: 80, 
        aiTag: 'autocratic_efficiency' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_7',
    text: 'Bir BEP toplantısında sizden çok daha genç bir uzman (yeni mezun) sizin görüşünüze zıt, modern bir teori sundu. Tepkiniz?',
    options: [
      { 
        label: 'Merakla dinlerim; akademik literatürün hızla değiştiğini bilir, "tersine mentorluk" (Reverse Mentoring) ile ondan bir şeyler öğrenmeye açık olurum.', 
        clinicalValue: 100, 
        aiTag: 'growth_mindset_senior' 
      },
      { 
        label: 'Tecrübemle fikrini nazikçe çürütürüm; vakanın "deneme tahtası" olmadığını ve sahada yılların getirdiği pratiğin kitabi bilgiden üstün olduğunu hatırlatırım.', 
        clinicalValue: 60, 
        aiTag: 'experience_hierarchy' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_8',
    text: 'Zorunlu bir ortak çalışma projesinde grubunuzdaki birinin hiç iş yapmadığını (Free-Rider) gördünüz. Tavrınız?',
    options: [
      { 
        label: 'Sonuç odaklıyım; vaka/proje zarar görmesin diye onun açığını da kapatır, işi bitiririm. Başarıyı kişisel egolardan üstün tutarım.', 
        clinicalValue: 100, 
        aiTag: 'mission_focused_altruist' 
      },
      { 
        label: 'Adalet odaklıyım; kişiyi gruptan izole eder veya yönetime raporlarım. Emek sömürüsüne göz yummak, profesyonelliğe hakarettir.', 
        clinicalValue: 85, 
        aiTag: 'justice_warrior' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_9',
    text: 'Sizin için "İdeal Takım"ın tanımı nedir?',
    options: [
      { 
        label: 'Herkesin kendi görev tanımını (Job Description) kusursuz yaptığı, duygusallıktan uzak, yüksek verimli profesyonel bir makine.', 
        clinicalValue: 95, 
        aiTag: 'functional_machinery' 
      },
      { 
        label: 'Birbirinin açığını kapatan, duygusal bağları kuvvetli, kriz anında kenetlenen "organik bir aile" yapısı.', 
        clinicalValue: 100, 
        aiTag: 'organic_solidarity' 
      }
    ]
  },
  {
    id: 'stf_tm_v2_10',
    text: 'Kurumda bir arkadaşınızın veli ile "profesyonel sınırı aşan" (örn: özel hayatını anlatan) bir samimiyet kurduğunu gördünüz. Müdahaleniz?',
    options: [
      { 
        label: 'Önce arkadaşımı uyarırım, davranış devam ederse bunun "kurumsal imajı" zedelediğini belirterek süpervizöre durumu iletirim.', 
        clinicalValue: 100, 
        aiTag: 'boundary_enforcer' 
      },
      { 
        label: 'Veli şikayet etmediği sürece karışmam; her uzmanın yoğurt yiyişi farklıdır, müdahale etmek dedikoduya girer.', 
        clinicalValue: 50, 
        aiTag: 'passive_observer' 
      }
    ]
  }
];
