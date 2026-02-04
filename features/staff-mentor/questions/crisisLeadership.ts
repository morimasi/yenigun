import { AssessmentQuestion } from '../../../types';

export const crisisLeadershipQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_cp_v2_1',
    text: 'Veli seans kapısında bağırarak "Çocuğun bugün neden uykulu olduğunu" agresif bir tonda sorguluyor ve diğer veliler izliyor. İlk 10 saniyeniz?',
    options: [
      { 
        label: 'Soğukkanlı bir duruşla asla savunmaya geçmem; duyguyu değil veriyi konuşmak üzere veliyi sessiz bir odaya davet ederek krizi izole eden bir liderlik sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'crisis_commander' 
      },
      { 
        label: 'Kurum müdürünü veya koordinatörü çağırırım; bu tarz krizlerin profesyonel odağımı bozmasına izin vermeden çatışmayı yetkili mercie devreden bir hiyerarşik kaçınma yolu izlerim.', 
        clinicalValue: 70, 
        aiTag: 'hierarchical_delegation' 
      },
      { 
        label: 'Veliyi sakinleştirmek için hemen özür dilerim ve hatalı olmasam bile suyuna giderim; ortamın gerilmesinden korktuğum için profesyonel otoritemi teslim eden bir uysallık gösteririm.', 
        clinicalValue: 50, 
        aiTag: 'submissive_appeasement' 
      },
      { 
        label: 'Ben de sesimi yükselterek bunun benim suçum olmadığını ve evdeki düzeni onların bozduğunu söylerim; krizi herkesin içinde bir kavgaya dönüştürerek kurum itibarını sarsan reaktif bir saldırganlık yaparım.', 
        clinicalValue: 30, 
        aiTag: 'reactive_aggression' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_2',
    text: 'Olumsuz bir değerlendirme raporunu (gelişim yok) veliye sunarken "Umut" mu "Gerçek" mi dengesini nasıl kurarsınız?',
    options: [
      { 
        label: 'Bilimsel gerçeği net sunarım; sahte umudun ailenin yas sürecini uzattığını bilerek toksik pozitivizmden kaçınır ve liyakatimi dürüstlük üzerinden tanımlayan radikal bir samimiyet sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'radical_honesty' 
      },
      { 
        label: 'Umut köprüsü kurmayı öncelerim; gerçeklerin ağırlığını tek seferde yüklemek yerine ailenin psikolojik dayanıklılığını kademeli olarak artırmayı hedefleyen empatik bir diplomat rolü üstlenirim.', 
        clinicalValue: 85, 
        aiTag: 'empathetic_diplomat' 
      },
      { 
        label: 'Aile üzülmesin diye raporu olduğundan iyi gösteririm; "çok iyi gidiyoruz" diyerek gerçeği manipüle eder ve aileyi kuruma bağlamak için bilimsel doğruları feda eden bir umut tacirliği yaparım.', 
        clinicalValue: 40, 
        aiTag: 'hope_manipulation' 
      },
      { 
        label: 'Raporu eline veririm ve teknik terimlerle açıklarım; duygusal tepkilere girmeden toplantıyı hızlıca bitirerek vaka yönetimindeki insani boyutu tamamen reddeden soğuk bir teknisyen duruşu sergilerim.', 
        clinicalValue: 60, 
        aiTag: 'cold_technician' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_3',
    text: 'Boşanma aşamasındaki ebeveynlerden biri eğitimin devamını isterken diğeri "kuruma gelmesini yasakladığını" söylüyor. Tavrınız?',
    options: [
      { 
        label: 'Çocuğun üstün yararını gözeterek yasal velayet belgesi gelene kadar eğitimi sürdürme eğiliminde olurum; aile içi savaşın vaka hakkını gasp etmesine direnen bir çocuk avukatı gibi davranırım.', 
        clinicalValue: 100, 
        aiTag: 'child_advocate_warrior' 
      },
      { 
        label: 'Kurumu hukuki riske atmamak için yasal durum netleşene kadar hizmeti dondurma kararı alırım; nötr kalmanın en güvenli yol olduğunu varsayarak vakanın eğitim hakkını bürokratik bir garantörlükle askıya alırım.', 
        clinicalValue: 70, 
        aiTag: 'risk_averse_neutrality' 
      },
      { 
        label: 'Hangi veliyle aram daha iyiyse onun dediğini yaparım; kişisel sempatilerim üzerinden taraf tutarak profesyonel tarafsızlığımı bozan ve aile içi çatışmaya dahil olan riskli bir duruş sergilerim.', 
        clinicalValue: 40, 
        aiTag: 'biased_involvement' 
      },
      { 
        label: 'Bu benim işim değil yönetim karar versin diyerek hiçbir inisiyatif almam; sorunu halı altına süpüren ve klinik liderlikten tamamen yoksun bir bürokratik kopuş refleksi gösteririm.', 
        clinicalValue: 50, 
        aiTag: 'bureaucratic_detachment' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_4',
    text: 'Veli, internetten okuduğu bilimselliği kanıtlanmamış "mucizevi" bir yöntemi uygulamanız için baskı yapıyor. Yanıtınız?',
    options: [
      { 
        label: 'Bilimsel sınırlarımdan taviz vermem; bu yöntemin kanıta dayalı olmadığını net belirtir ve gerekirse vaka ile yolları ayırmayı göze alan sarsılmaz bir bilimsel muhafızlık sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'scientific_gatekeeper' 
      },
      { 
        label: 'Aileyi kaybetmemek için "zararsızsa deneyebiliriz" diyerek esneklik gösteririm; ailenin kendini anlaşılmış hissetmesinin klinik doğrulardan daha önemli olduğuna inanan pragmatik bir sahte bilim toleransı sergilerim.', 
        clinicalValue: 60, 
        aiTag: 'pseudo_science_tolerance' 
      },
      { 
        label: '"O yöntem bizde yok ama isterseniz ek ücretle getirtiriz" diyerek talebi kazanca çeviririm; bilimsel geçerliliği olmayan bir şeyi kuruma maddi kaynak yaratmak için kullanan etik dışı bir tüccar zihniyeti gösteririm.', 
        clinicalValue: 20, 
        aiTag: 'unethical_commercialism' 
      },
      { 
        label: '"Bakarız araştırırız" diyerek aileyi oyalarım; ne evet ne hayır diyerek vaka yönetiminde net bir duruş sergilemekten kaçan ve zaman kazanmaya çalışan bir ertelemeci rolü üstlenirim.', 
        clinicalValue: 50, 
        aiTag: 'procrastinator' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_5',
    text: 'Çocuğun vücudunda bir morluk var ve veli sizi suçluyor ("Siz yaptınız!"). Ancak siz yapmadığınızdan eminsiniz. Savunma stratejiniz?',
    options: [
      { 
        label: 'Endişenizi anlıyorum hemen kamera kayıtlarını ve vücut kontrol formlarını inceleyelim derim; kendinden emin ve kanıt odaklı bir duruş sergileyerek şeffaflığı bir kalkan gibi kullanan profesyonel bir özgüven sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'transparent_confidence' 
      },
      { 
        label: 'Ortamı yumuşatmak için "Çok üzgünüm, fark etmeden çarpmış olabilir" derim; suçsuz olduğum halde alttan alarak aslında suçu zımnen kabul eden ve kurumu yasal risk altına sokan bir özür dileme hatası yaparım.', 
        clinicalValue: 40, 
        aiTag: 'apologetic_risk' 
      },
      { 
        label: '"Evde düşmüştür, siz bize iftira atıyorsunuz" diyerek saldırganlaşırım; vaka velisini bir düşman olarak görüp reaktif bir savunma duvarı örerek terapötik ilişkiyi kalıcı olarak yıkan bir düşmanlık sergilerim.', 
        clinicalValue: 30, 
        aiTag: 'defensive_hostility' 
      },
      { 
        label: 'Ne diyeceğimi bilemem ve susup kalırım; profesyonel duruşumu kaybedip duygusal bir çöküş yaşayarak krizi yönetmek yerine vakanın karşısında otoritesini yitiren bir çaresizlik içine girerim.', 
        clinicalValue: 20, 
        aiTag: 'emotional_collapse' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_6',
    text: 'Ekonomik kriz yaşayan bir aile, "Ödemeyi yapamıyoruz ama çocuğun eğitimi aksamasın, bizi idare edin" diyor. Kurumsal duruşunuz?',
    options: [
      { 
        label: 'Duygusal sömürüye kapılmadan sınırları korurum; yönetimin burs prosedürlerine yönlendirerek bedelsiz hizmetin liyakati değersizleştireceği gerçeğini aileye profesyonel bir dille açıklarım.', 
        clinicalValue: 100, 
        aiTag: 'business_reality_awareness' 
      },
      { 
        label: 'Yönetimle gizlice konuşup kendi maaşımdan fedakarlık etmeyi teklif ederim; çocuğun eğitimde kalması için kendimi feda eden bir "duygusal şehitlik" yaparak kurumsal sürdürülebilirliği tehlikeye atarım.', 
        clinicalValue: 70, 
        aiTag: 'emotional_martyr' 
      },
      { 
        label: '"Paranız yoksa eğitim de yok" diyerek kapıyı kapatırım; empati kurmayı tamamen reddeden ve kurumu sadece mekanik bir ticarethane olarak gören katı ve materyalist bir profesyonellik sergilerim.', 
        clinicalValue: 40, 
        aiTag: 'rigid_materialist' 
      },
      { 
        label: '"Siz yönetime çaktırmadan getirin, ben arada derse alırım" diyerek kuralları çiğnerim; kurumsal sadakati hiçe sayan ve kaçak eğitim modelini meşrulaştıran bir kural bozucu profil çizerim.', 
        clinicalValue: 30, 
        aiTag: 'rule_breaker' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_7',
    text: 'Veli sosyal medyada kurum ve sizin hakkınızda "İlgilenmiyorlar, para tuzağı" gibi haksız bir yorum yapmış. Tepkiniz?',
    options: [
      { 
        label: 'Veliyle yüz yüze görüşüp sorunun köküne inerim; yorumu kaldırması için profesyonel bir müzakere yürütür ve kurumun marka değerini kendi değerim gibi koruyan bir itibar yöneticisi gibi davranırım.', 
        clinicalValue: 100, 
        aiTag: 'reputation_manager' 
      },
      { 
        label: 'Kişisel algılamam ve cevap vermem; "meyve veren ağaç taşlanır" diyerek sessiz kalmayı tercih eder ancak sosyal medyadaki bu karalamanın kurumun akademik prestijine zarar vermesini pasiflikle izlerim.', 
        clinicalValue: 60, 
        aiTag: 'passive_avoidance' 
      },
      { 
        label: 'Yorumun altına hemen cevap yazar ve doğruları anlatarak veliyi yalanlarım; krizi kamusallaştırıp veliyle sosyal medyada tartışmaya girerek profesyonel imajımı sarsan bir reaksiyon gösteririm.', 
        clinicalValue: 40, 
        aiTag: 'public_confrontation' 
      },
      { 
        label: 'Veliye hemen avukat aracılığıyla ihtarname gönderirim; uzlaşma yolu aramak yerine hukuk kanallarını bir saldırı aracı gibi kullanarak aileyle olan tüm bağları koparan bir dava meraklılığı sergilerim.', 
        clinicalValue: 50, 
        aiTag: 'litigious_aggression' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_8',
    text: 'Seans sırasında çocuk nöbet (epileptik vb.) geçiriyor, veli ise panik halinde odaya dalıp müdahalenizi engelliyor. Kriz anı liderliğiniz?',
    options: [
      { 
        label: 'Ses tonumu yükselterek veliye "Geri çekilin ve bana alan açın!" komutunu veririm; çocuğun hayati güvenliği için anlık nezaketi askıya alan otoriter ve kararlı bir kriz liderliği sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'authoritative_safety_first' 
      },
      { 
        label: 'Veliyi sakinleştirmeye çalışırken bir yandan çocuğa müdahale ederim; panik halindeki ebeveyni korkutmamak için yumuşak davranır ancak bu esnekliğin hayati müdahale süresinden çaldığını göremeyen bir kararsızlık yaşarım.', 
        clinicalValue: 50, 
        aiTag: 'indecisive_softness' 
      },
      { 
        label: 'Panik ortamından etkilenir ve ne yapacağımı şaşırarak yardım çağırmaya koşarım; çocuğu o kritik anda yalnız bırakarak kriz anında donup kalan ve profesyonel soğukkanlılığını yitiren bir şok tepkisi veririm.', 
        clinicalValue: 20, 
        aiTag: 'freeze_response' 
      },
      { 
        label: 'Veli ne diyorsa onu yaparım ve sorumluluğu tamamen ona bırakırım; "benim çocuğum en iyisini ben bilirim" diyen ebeveyne klinik yetkilerimi devreden ve vaka güvenliğini tehlikeye atan bir teslimiyetçilik sergilerim.', 
        clinicalValue: 30, 
        aiTag: 'responsibility_surrender' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_9',
    text: 'Başka bir kurumdan gelen veli, önceki öğretmenini ve kurumunu size sürekli kötülüyor. Tutumunuz?',
    options: [
      { 
        label: 'Bu konuşmaya hemen set çekerim; "Diğer uzmanlar hakkında yorum yapmamız etik olmaz" diyerek dedikoduyu reddeder ve profesyonel dayanışmayı her türlü veli sempatisinden üstün tutan bir duruş sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'professional_solidarity' 
      },
      { 
        label: 'Velinin güvenini kazanmak için onu onaylarım; "Evet maalesef piyasada çok yetersiz uzman var" diyerek kendi liyakatimi bir başkasının yetersizliği üzerinden parlatmaya çalışan narsistik bir onaylama yaparım.', 
        clinicalValue: 40, 
        aiTag: 'narcissistic_validation' 
      },
      { 
        label: 'Dedikoduyu ilgiyle dinlerim; diğer kurumun ne yaptığını ve hangi hataları işlediğini öğrenmek için veliyi konuşturarak bilgi toplamaya çalışan meraklı ve etik dışı bir gözlemcilik yaparım.', 
        clinicalValue: 50, 
        aiTag: 'gossip_curiosity' 
      },
      { 
        label: 'Hiç tepki vermem ve konuşmasını bitirmesini beklerim; sessiz kalarak aslında bu karalamaya rıza gösteren ve vaka yönetiminde net bir etik sınır çizmekten aciz olan indifferent bir tutum sergilerim.', 
        clinicalValue: 60, 
        aiTag: 'indifferent_listener' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_10',
    text: 'Veli, çocuğunun "Normal yaşıtları gibi okula gidebileceği" konusunda garanti istiyor. Ne dersiniz?',
    options: [
      { 
        label: 'Garanti vermenin etik dışı olduğunu anlatırım; "Potansiyelini maksimize etmek için buradayız ama sonucu nörolojik sınırlar belirler" diyerek gerçekçi bir beklenti yöneticisi rolü üstlenirim.', 
        clinicalValue: 100, 
        aiTag: 'expectation_manager' 
      },
      { 
        label: '"Çok çalışırsak neden olmasın?" diyerek ucu açık cevap veririm; motivasyonu düşürmemek için kesin konuşmaktan kaçınan ve aileyi boş bir beklenti içine sokan politik bir umut tüccarlığı yaparım.', 
        clinicalValue: 60, 
        aiTag: 'hope_merchant' 
      },
      { 
        label: '"Hayır, bu tanıyla normal okul imkansız" diyerek ailenin tüm umudunu kırarım; bilimsel gerçeği bir balyoz gibi kullanarak vakanın duygusal dayanıklılığını yok eden kaba bir kötümserlik sergilerim.', 
        clinicalValue: 50, 
        aiTag: 'blunt_pessimist' 
      },
      { 
        label: '"Zaman gösterir şu an bunu konuşmak için erken" diyerek soruyu geçiştiririm; vaka yönetimindeki kritik kararları belirsizliğe iterek ailenin stratejik bir yol haritası çizmesini engelleyen kaçamak bir cevap veririm.', 
        clinicalValue: 70, 
        aiTag: 'evasive_answering' 
      }
    ]
  }
];
