import { AssessmentQuestion } from '../../../types';

export const crisisLeadershipQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_cp_v2_1',
    text: 'Veli seans kapısında bağırarak "Çocuğun bugün neden uykulu olduğunu" agresif bir tonda sorguluyor ve diğer veliler izliyor. İlk 10 saniyeniz?',
    options: [
      { 
        label: 'Soğukkanlı bir "Klinik Lider" duruşu sergilerim. Asla savunmaya geçmem; duyguyu değil veriyi (uyku/ilaç takibi) konuşmak üzere veliyi sessiz bir odaya davet ederek krizi izole ederim.', 
        clinicalValue: 100, 
        aiTag: 'crisis_commander' 
      },
      { 
        label: 'Kurum müdürünü veya koordinatörü çağırırım; bu tarz krizlerin profesyonel odağımı bozmasına izin vermeden, çatışmayı yetkili mercie devrederek güvenli alana çekilmeyi tercih ederim.', 
        clinicalValue: 75, 
        aiTag: 'hierarchical_delegation' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_2',
    text: 'Olumsuz bir değerlendirme raporunu (gelişim yok) veliye sunarken "Umut" mu "Gerçek" mi dengesini nasıl kurarsınız?',
    options: [
      { 
        label: 'Bilimsel gerçeği radikal bir dürüstlükle sunarım; sahte umudun (toksik pozitivizm) ailenin yas sürecini uzattığını ve gerçekçi bir müdahale planının önündeki en büyük engel olduğunu bilirim.', 
        clinicalValue: 100, 
        aiTag: 'radical_honesty' 
      },
      { 
        label: 'Umut köprüsü kurmayı öncelerim. Gerçeklerin ağırlığını tek seferde yüklemek yerine, ailenin psikolojik dayanıklılığını artırarak kademeli (sandviç tekniği) olarak veririm.', 
        clinicalValue: 90, 
        aiTag: 'empathetic_diplomat' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_3',
    text: 'Boşanma aşamasındaki ebeveynlerden biri eğitimin devamını isterken diğeri "kuruma gelmesini yasakladığını" söylüyor. Tavrınız?',
    options: [
      { 
        label: 'Çocuğun üstün yararını gözeterek, yasal velayet belgesi gelene kadar eğitimi sürdürme eğiliminde olurum; aile içi savaşın çocuğun eğitim hakkını gasp etmesine karşı "Çocuk Avukatı" gibi davranırım.', 
        clinicalValue: 100, 
        aiTag: 'child_advocate_warrior' 
      },
      { 
        label: 'Kurumu hukuki riske atmamak için "Yasal durum netleşene kadar hizmeti dondurma" kararı alırım; nötr kalmanın en güvenli profesyonel duruş olduğunu savunurum.', 
        clinicalValue: 60, 
        aiTag: 'risk_averse_neutrality' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_4',
    text: 'Veli, internetten okuduğu bilimselliği kanıtlanmamış "mucizevi" bir yöntemi (örn: ağır metal diyeti) uygulamanız için baskı yapıyor. Yanıtınız?',
    options: [
      { 
        label: 'Bilimsel sınırlarımdan asla taviz vermem. Bu yöntemin kanıta dayalı olmadığını, kurum çatısı altında uygulayamayacağımı net bir dille belirtir, gerekirse vaka ile yolları ayırmayı göze alırım.', 
        clinicalValue: 100, 
        aiTag: 'scientific_gatekeeper' 
      },
      { 
        label: 'Aileyi kaybetmemek ve süreci kontrol altında tutmak için "zararsızsa deneyebiliriz" diyerek esneklik gösteririm; ailenin kendini anlaşılmış hissetmesinin terapötik ittifak için önemli olduğunu düşünürüm.', 
        clinicalValue: 50, 
        aiTag: 'pseudo_science_tolerance' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_5',
    text: 'Çocuğun vücudunda bir morluk var ve veli sizi suçluyor ("Siz yaptınız!"). Ancak siz yapmadığınızdan eminsiniz. Savunma stratejiniz?',
    options: [
      { 
        label: 'Şeffaflık zırhını giyerim. "Endişenizi anlıyorum, hemen kamera kayıtlarını ve vücut kontrol formlarını birlikte inceleyelim" diyerek kendimden emin, kanıt odaklı ve defansif olmayan bir duruş sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'transparent_confidence' 
      },
      { 
        label: 'Veliyle empati kurarak ortamı yumuşatmaya çalışırım; "Çok üzgünüm, belki fark etmeden çarpmıştır" gibi alttan alan cümlelerle öfkeyi dindirmeyi denerim (Risk: Zımni kabul).', 
        clinicalValue: 40, 
        aiTag: 'apologetic_risk' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_6',
    text: 'Ekonomik kriz yaşayan bir aile, "Ödemeyi yapamıyoruz ama çocuğun eğitimi aksamasın, bizi idare edin" diyor. Kurumsal duruşunuz?',
    options: [
      { 
        label: 'Duygusal sömürüye kapılmadan profesyonel sınırları korurum. Yönetimin belirlediği burs prosedürlerine yönlendiririm; "bedelsiz hizmetin değersizleşeceği" gerçeğini göz ardı etmem.', 
        clinicalValue: 100, 
        aiTag: 'business_reality_awareness' 
      },
      { 
        label: 'Yönetimle gizlice konuşup, gerekirse kendi maaşımdan fedakarlık ederek veya ek ders yaparak çocuğun eğitimde kalması için şahsi inisiyatif kullanırım.', 
        clinicalValue: 75, 
        aiTag: 'emotional_martyr' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_7',
    text: 'Veli sosyal medyada kurum ve sizin hakkınızda "İlgilenmiyorlar, para tuzağı" gibi haksız bir yorum yapmış. Tepkiniz?',
    options: [
      { 
        label: 'Dijital itibar yönetimini devreye sokarım. Veliyle yüz yüze görüşüp sorunun köküne inerim ancak yorumu kaldırması için profesyonel bir müzakere yürütürüm; kurumun marka değeri benim değerimdir.', 
        clinicalValue: 100, 
        aiTag: 'reputation_manager' 
      },
      { 
        label: 'Kişisel algılamam ve cevap vermem. "Meyve veren ağaç taşlanır" diyerek işime odaklanırım, sosyal medyadaki kaosa dahil olmayı profesyonel bulmam.', 
        clinicalValue: 60, 
        aiTag: 'passive_avoidance' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_8',
    text: 'Seans sırasında çocuk nöbet (epileptik vb.) geçiriyor, veli ise panik halinde odaya dalıp müdahalenizi engelliyor. Kriz anı liderliğiniz?',
    options: [
      { 
        label: 'Otoriter Liderlik; ses tonumu yükselterek (kontrollü bağırış) veliye "Geri çekilin ve bana alan açın!" komutunu veririm. Çocuğun hayati güvenliği için nezaketi o anlık askıya alırım.', 
        clinicalValue: 100, 
        aiTag: 'authoritative_safety_first' 
      },
      { 
        label: 'Veliyi sakinleştirmeye çalışırken bir yandan çocuğa müdahale etmeye çalışırım; panik halindeki bir ebeveyni daha da korkutmamak için yumuşak davranırım.', 
        clinicalValue: 50, 
        aiTag: 'indecisive_softness' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_9',
    text: 'Başka bir kurumdan gelen veli, önceki öğretmenini ve kurumunu size sürekli kötülüyor. Tutumunuz?',
    options: [
      { 
        label: 'Meslek etiği gereği bu konuşmaya set çekerim. "Diğer uzmanlar hakkında yorum yapmamız doğru olmaz, biz kendi yol haritamıza odaklanalım" diyerek dedikodu zeminini reddederim.', 
        clinicalValue: 100, 
        aiTag: 'professional_solidarity' 
      },
      { 
        label: 'Velinin güvenini kazanmak için onu onaylarım; "Evet, maalesef piyasada çok yetersiz uzman var" diyerek kendi liyakatimi o kıyas üzerinden parlatırım.', 
        clinicalValue: 30, 
        aiTag: 'narcissistic_validation' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_10',
    text: 'Veli, çocuğunun "Normal yaşıtları gibi okula gidebileceği" konusunda garanti istiyor. Ne dersiniz?',
    options: [
      { 
        label: 'Garanti vermenin etik dışı olduğunu anlatırım. "Potansiyelini maksimize etmek için buradayız ama sonucu çocuğun nörolojik sınırları belirler" diyerek gerçekçi beklenti yönetimi yaparım.', 
        clinicalValue: 100, 
        aiTag: 'expectation_manager' 
      },
      { 
        label: '"Çok çalışırsak neden olmasın?" diyerek ucu açık, umut dolu bir cevap veririm; motivasyonu düşürmemek için kesin konuşmaktan kaçınırım.', 
        clinicalValue: 60, 
        aiTag: 'hope_merchant' 
      }
    ]
  }
];
