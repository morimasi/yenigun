import { AssessmentQuestion } from '../../../types';

export const crisisLeadershipQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_cp_v2_1',
    text: 'Veli seans kapısında bağırarak "Çocuğun bugün neden uykulu olduğunu" agresif bir tonda sorguluyor ve diğer veliler izliyor. İlk 10 saniyeniz?',
    options: [
      { 
        label: 'Kriz Komutanı: Soğukkanlı bir duruşla asla savunmaya geçmem; duyguyu değil veriyi (uyku/ilaç takibi) konuşmak üzere veliyi sessiz bir odaya davet ederek krizi izole ederim.', 
        clinicalValue: 100, 
        aiTag: 'crisis_commander' 
      },
      { 
        label: 'Hiyerarşik Kaçış: Kurum müdürünü veya koordinatörü çağırırım; bu tarz krizlerin profesyonel odağımı bozmasına izin vermeden, çatışmayı yetkili mercie devrederim.', 
        clinicalValue: 70, 
        aiTag: 'hierarchical_delegation' 
      },
      { 
        label: 'Alttan Alan: Veliyi sakinleştirmek için hemen özür dilerim ve hatalı olmasam bile suyuna giderim, ortamın gerilmesinden çok korkarım.', 
        clinicalValue: 50, 
        aiTag: 'submissive_appeasement' 
      },
      { 
        label: 'Reaktif Savunma: Ben de sesimi yükselterek bunun benim suçum olmadığını, evdeki düzeni onların bozduğunu herkesin içinde söylerim.', 
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
        label: 'Radikal Dürüstlük: Bilimsel gerçeği net sunarım; sahte umudun (toksik pozitivizm) ailenin yas sürecini uzattığını ve gerçekçi planlamayı engellediğini bilirim.', 
        clinicalValue: 100, 
        aiTag: 'radical_honesty' 
      },
      { 
        label: 'Empatik Diplomat: Umut köprüsü kurmayı öncelerim. Gerçeklerin ağırlığını tek seferde yüklemek yerine, ailenin psikolojik dayanıklılığını artırarak kademeli veririm.', 
        clinicalValue: 85, 
        aiTag: 'empathetic_diplomat' 
      },
      { 
        label: 'Umut Taciri: Aile üzülmesin diye raporu olduğundan iyi gösteririm, "çok iyi gidiyoruz" diyerek gerçeği manipüle ederim.', 
        clinicalValue: 40, 
        aiTag: 'hope_manipulation' 
      },
      { 
        label: 'Mesafeli Tekniker: Raporu eline veririm, teknik terimlerle açıklar ve duygusal tepkilerine girmeden toplantıyı bitiririm.', 
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
        label: 'Çocuk Avukatı: Çocuğun üstün yararını gözeterek, yasal velayet belgesi gelene kadar eğitimi sürdürme eğiliminde olurum; aile içi savaşın eğitimi gasp etmesine direnirim.', 
        clinicalValue: 100, 
        aiTag: 'child_advocate_warrior' 
      },
      { 
        label: 'Riskten Kaçınan: Kurumu hukuki riske atmamak için "Yasal durum netleşene kadar hizmeti dondurma" kararı alırım; nötr kalmak en güvenli yoldur.', 
        clinicalValue: 70, 
        aiTag: 'risk_averse_neutrality' 
      },
      { 
        label: 'Taraf Tutan: Hangi veliyle aram daha iyiyse onun dediğini yaparım, diğeriyle iletişimi keserim.', 
        clinicalValue: 40, 
        aiTag: 'biased_involvement' 
      },
      { 
        label: 'Bürokrat: "Bu benim işim değil, yönetim karar versin" diyerek topu taca atarım ve hiçbir inisiyatif almam.', 
        clinicalValue: 50, 
        aiTag: 'bureaucratic_detachment' 
      }
    ]
  },
  {
    id: 'stf_cp_v2_4',
    text: 'Veli, internetten okuduğu bilimselliği kanıtlanmamış "mucizevi" bir yöntemi (örn: ağır metal diyeti) uygulamanız için baskı yapıyor. Yanıtınız?',
    options: [
      { 
        label: 'Bilimsel Bekçi: Bilimsel sınırlarımdan taviz vermem. Bu yöntemin kanıta dayalı olmadığını net belirtir, gerekirse vaka ile yolları ayırmayı göze alırım.', 
        clinicalValue: 100, 
        aiTag: 'scientific_gatekeeper' 
      },
      { 
        label: 'Toleranslı Esneklik: Aileyi kaybetmemek için "zararsızsa deneyebiliriz" diyerek esneklik gösteririm; ailenin kendini anlaşılmış hissetmesi önemlidir.', 
        clinicalValue: 60, 
        aiTag: 'pseudo_science_tolerance' 
      },
      { 
        label: 'Ticari Yaklaşım: "O yöntem bizde yok ama isterseniz ek ücretle o cihazı/materyali getirtiriz" diyerek talebi kazanca çeviririm.', 
        clinicalValue: 20, 
        aiTag: 'unethical_commercialism' 
      },
      { 
        label: 'Geçiştirici: "Bakarız, araştırırız" diyerek aileyi oyalarım, ne evet ne hayır derim.', 
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
        label: 'Şeffaf Özgüven: "Endişenizi anlıyorum, hemen kamera kayıtlarını ve vücut kontrol formlarını birlikte inceleyelim" diyerek kendimden emin, kanıt odaklı bir duruş sergilerim.', 
        clinicalValue: 100, 
        aiTag: 'transparent_confidence' 
      },
      { 
        label: 'Özür Dileyen: Ortamı yumuşatmak için "Çok üzgünüm, belki fark etmeden çarpmıştır" gibi alttan alan cümleler kurarım (Risk: Zımni kabul).', 
        clinicalValue: 40, 
        aiTag: 'apologetic_risk' 
      },
      { 
        label: 'Karşı Suçlama: "Evde düşmüştür, siz bize iftira atıyorsunuz" diyerek saldırgan bir savunmaya geçerim.', 
        clinicalValue: 30, 
        aiTag: 'defensive_hostility' 
      },
      { 
        label: 'Panik: Ne diyeceğimi bilemem, susup kalırım veya ağlarım, profesyonel duruşumu kaybederim.', 
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
        label: 'Profesyonel Gerçekçi: Duygusal sömürüye kapılmadan sınırları korurum. Yönetimin burs prosedürlerine yönlendiririm; "bedelsiz hizmetin değersizleşeceği" gerçeğini bilirim.', 
        clinicalValue: 100, 
        aiTag: 'business_reality_awareness' 
      },
      { 
        label: 'Duygusal Fedakar: Yönetimle gizlice konuşup, gerekirse kendi maaşımdan fedakarlık ederek çocuğun eğitimde kalması için şahsi inisiyatif kullanırım.', 
        clinicalValue: 70, 
        aiTag: 'emotional_martyr' 
      },
      { 
        label: 'Kuralcı Red: "Paranız yoksa eğitim yok" diyerek kapıyı kapatırım, empati kurmam.', 
        clinicalValue: 40, 
        aiTag: 'rigid_materialist' 
      },
      { 
        label: 'Gizli Taviz: "Siz yönetime çaktırmadan getirin, ben arada derse alırım" diyerek kurumsal kuralları çiğnerim.', 
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
        label: 'İtibar Yöneticisi: Veliyle yüz yüze görüşüp sorunun köküne inerim, yorumu kaldırması için profesyonel bir müzakere yürütürüm; kurumun marka değeri benim değerimdir.', 
        clinicalValue: 100, 
        aiTag: 'reputation_manager' 
      },
      { 
        label: 'Pasif Kaçınma: Kişisel algılamam ve cevap vermem. "Meyve veren ağaç taşlanır" diyerek işime odaklanırım, sosyal medyadaki kaosa dahil olmam.', 
        clinicalValue: 60, 
        aiTag: 'passive_avoidance' 
      },
      { 
        label: 'Dijital Kavga: Yorumun altına hemen cevap yazar, doğruları anlatarak veliyi yalanlarım ve kendimi savunurum.', 
        clinicalValue: 40, 
        aiTag: 'public_confrontation' 
      },
      { 
        label: 'Hukuki Tehdit: Veliye hemen avukat aracılığıyla ihtarname gönderirim, uzlaşma yolu aramam.', 
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
        label: 'Otoriter Güvenlik: Ses tonumu yükselterek (kontrollü bağırış) veliye "Geri çekilin ve bana alan açın!" komutunu veririm. Çocuğun hayati güvenliği için nezaketi askıya alırım.', 
        clinicalValue: 100, 
        aiTag: 'authoritative_safety_first' 
      },
      { 
        label: 'Kararsız Yumuşaklık: Veliyi sakinleştirmeye çalışırken bir yandan çocuğa müdahale etmeye çalışırım; panik halindeki ebeveyni korkutmamak için yumuşak davranırım.', 
        clinicalValue: 50, 
        aiTag: 'indecisive_softness' 
      },
      { 
        label: 'Donup Kalma: Panik ortamından etkilenir, ne yapacağımı şaşırır ve yardım çağırmak için dışarı koşarım, çocuğu yalnız bırakırım.', 
        clinicalValue: 20, 
        aiTag: 'freeze_response' 
      },
      { 
        label: 'Teslimiyet: Veli ne diyorsa onu yaparım, sorumluluğu tamamen ona bırakırım.', 
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
        label: 'Mesleki Dayanışma: Bu konuşmaya set çekerim. "Diğer uzmanlar hakkında yorum yapmamız etik olmaz, biz kendi yolumuza odaklanalım" diyerek dedikoduyu reddederim.', 
        clinicalValue: 100, 
        aiTag: 'professional_solidarity' 
      },
      { 
        label: 'Narsisistik Onay: Velinin güvenini kazanmak için onu onaylarım; "Evet, maalesef piyasada çok yetersiz uzman var" diyerek kendi liyakatimi o kıyasla parlatırım.', 
        clinicalValue: 40, 
        aiTag: 'narcissistic_validation' 
      },
      { 
        label: 'Meraklı Dinleyici: Dedikoduyu dinlerim, diğer kurumun ne yaptığını öğrenmek için veliyi konuştururum.', 
        clinicalValue: 50, 
        aiTag: 'gossip_curiosity' 
      },
      { 
        label: 'Kayıtsız: Hiç tepki vermem, konuştukça dinler gibi yaparım ama konuyu değiştirmem.', 
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
        label: 'Beklenti Yöneticisi: Garanti vermenin etik dışı olduğunu anlatırım. "Potansiyelini maksimize etmek için buradayız ama sonucu nörolojik sınırlar belirler" diyerek gerçekçi konuşurum.', 
        clinicalValue: 100, 
        aiTag: 'expectation_manager' 
      },
      { 
        label: 'Umut Taciri: "Çok çalışırsak neden olmasın?" diyerek ucu açık, umut dolu bir cevap veririm; motivasyonu düşürmemek için kesin konuşmaktan kaçınırım.', 
        clinicalValue: 60, 
        aiTag: 'hope_merchant' 
      },
      { 
        label: 'Katı Realist: "Hayır, bu tanıyla normal okul imkansız" diyerek ailenin tüm umudunu sert bir şekilde kırarım.', 
        clinicalValue: 50, 
        aiTag: 'blunt_pessimist' 
      },
      { 
        label: 'Kaçamak Cevap: "Zaman gösterir, şu an bunu konuşmak için erken" diyerek soruyu geçiştiririm.', 
        clinicalValue: 70, 
        aiTag: 'evasive_answering' 
      }
    ]
  }
];
