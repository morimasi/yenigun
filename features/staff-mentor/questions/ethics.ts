import { AssessmentQuestion } from '../../../types';

export const ethicsQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_eth_v2_1',
    text: 'Veli, kurum dışındaki "özel seans" talebiyle size geldi ve mevcut maaşınızdan çok daha yüksek bir ücret teklif etti. Tavrınız?',
    options: [
      { 
        label: 'Profesyonel mesafenin ve kurumsal sadakatin mesleki onurun bir parçası olduğunu kabul ederim; etik manipülasyonlara kapalı, net ve şeffaf bir reddetme dili kullanarak durumu yönetime raporlarım.', 
        clinicalValue: 100, 
        aiTag: 'unshakeable_integrity' 
      },
      { 
        label: 'Veliyle kurulan terapötik bağı zedelememek adına durumu nazikçe açıklar ve kurum politikalarını hatırlatırım; ancak ailenin güvenini sarsmamak için bu girişimi yönetime bildirmeyi tercih etmem.', 
        clinicalValue: 70, 
        aiTag: 'soft_boundary_risk' 
      },
      { 
        label: 'Teklifi kabul ederim ama kurumun haberi olmasın diye gizli tutarım; ekonomik şartların zorluğunu ve emeğimin karşılığını alma hakkımı düşünerek kurumsal etik kurallarını geçici olarak esnetirim.', 
        clinicalValue: 20, 
        aiTag: 'ethical_violation' 
      },
      { 
        label: 'Veliye "kurumdan ayrılırsam size haber veririm" diyerek açık kapı bırakırım; gelecekteki potansiyel müşterimi kaybetmemek adına etik gri bir bölgede kalarak kurumun müşteri portföyünü riske atarım.', 
        clinicalValue: 40, 
        aiTag: 'opportunistic_delay' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_2',
    text: 'Seans sırasında çocuğun vücudunda "şüpheli bir iz" gördünüz ancak vaka çok "hassas" bir aileye sahip. Bildirim protokolünüz?',
    options: [
      { 
        label: 'Ailenin kimliğine veya sosyal konumuna bakmaksızın Çocuk Koruma protokolünü saniyeler içinde işletirim; hukuki ve etik sorumluluğun, kurumsal veya sosyal risklerden her zaman daha üstün olduğuna inanırım.', 
        clinicalValue: 100, 
        aiTag: 'legal_courage' 
      },
      { 
        label: 'Durumdan emin olmak için önce kurum içi klinik süpervizörle verileri paylaşırım; aileyi savunma moduna sokmadan durumu anlamaya yönelik çok kontrollü ve ihtiyatlı bir görüşme planlayarak süreci uzatırım.', 
        clinicalValue: 80, 
        aiTag: 'cautious_protocol' 
      },
      { 
        label: 'Aileyle aram bozulmasın diye görmezden gelirim; vakanın parkta düşmüş olabileceğine dair kendimi ikna ederek olası bir ihmal veya istismar ihtimalini profesyonel bir körlükle tamamen reddederim.', 
        clinicalValue: 20, 
        aiTag: 'negligence_risk' 
      },
      { 
        label: 'Çocuğa "bunu kim yaptı?" diye sorarım; alacağım cevaba göre hareket etmeye karar vererek, vakanın manipülatif veya sınırlı dil becerileri üzerinden profesyonel bir soruşturma yürütmeye çalışırım.', 
        clinicalValue: 50, 
        aiTag: 'unprofessional_investigation' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_3',
    text: 'Çok sevdiğiniz bir vakanın velisi size maddi değeri yüksek bir hediye getirdi ve "reddederseniz çok üzüleceğini" söylüyor. Tavrınız?',
    options: [
      { 
        label: 'Hediye kabul etmenin terapötik ilişkiyi borçluluk zeminine çekeceğini bildiğim için reddederim; etik sınırların esnetilmesinin uzun vadede klinik tarafsızlığımı tamamen yok edeceğini aileye profesyonelce anlatırım.', 
        clinicalValue: 100, 
        aiTag: 'strict_boundary_guardian' 
      },
      { 
        label: 'Ailenin kültürel iyi niyetini gözeterek hediyeyi şahsım adına değil kurum adına kabul edebileceğimi söylerim; materyali sınıfta kullanacağımızı belirterek hediyeyi kamusallaştırıp etik riski azaltmaya çalışırım.', 
        clinicalValue: 90, 
        aiTag: 'balanced_diplomacy' 
      },
      { 
        label: 'Kabul ederim ama kimseye söylememesini rica ederim; reddetmenin kabalık olacağını ve veliyle kurulan samimiyetin eğitim başarısını artıracağını düşünerek kişisel bir menfaat alanı yaratırım.', 
        clinicalValue: 40, 
        aiTag: 'secretive_acceptance' 
      },
      { 
        label: 'Sadece bu seferlik kabul ederim ve bir daha olmamasını tembihlerim; kuralı bir defaya mahsus bozmanın büyük bir sorun yaratmayacağını varsayarak etik sınırımı ailenin duygusal baskısına teslim ederim.', 
        clinicalValue: 60, 
        aiTag: 'weak_boundary' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_4',
    text: 'Kurumda bir arkadaşınızın vaka başında sürekli telefonla oynadığını (seans süresini verimsiz kullandığını) gördünüz. Profesyonel sorumluluğunuz?',
    options: [
      { 
        label: 'Bunu kişisel bir çatışma değil vakanın hakkının gasp edilmesi olarak görürüm; önce arkadaşımı uyarır ve devam ederse kurumsal kalite standartlarını korumak adına durumu resmi kanallardan raporlarım.', 
        clinicalValue: 100, 
        aiTag: 'quality_advocate' 
      },
      { 
        label: 'Çalışma barışını bozmamak adına arkadaşımla şaka yollu konuşurum; "müdür görürse kızar" diyerek dolaylı uyarılarda bulunur ancak konuyu asla resmiyet kazandırıp yönetime taşımayı tercih etmem.', 
        clinicalValue: 70, 
        aiTag: 'peer_loyalty_bias' 
      },
      { 
        label: 'Beni ilgilendirmez diyerek herkesin kendi işine bakması gerektiğini savunurum; meslektaşımın yaptığı etik hatanın benim kariyerimi veya vaka başarısını doğrudan etkilemeyeceğini varsayarak duyarsız kalırım.', 
        clinicalValue: 40, 
        aiTag: 'bystander_apathy' 
      },
      { 
        label: 'Ben de bazen telefonuma bakıyorum bu yüzden bir şey deme hakkım olmadığını düşünürüm; karşılıklı bir etik esneklik alanı yaratarak kurumdaki verimsizliği ve kural ihlallerini meşrulaştıran bir tavır takınırım.', 
        clinicalValue: 30, 
        aiTag: 'mutual_corruption' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_5',
    text: 'Veli, kurum müdürü veya başka bir öğretmen hakkında size dert yanıyor ve "aramızda kalsın" diyor. Sınırınızı nasıl çizersiniz?',
    options: [
      { 
        label: 'Veliye kurumun bir parçası olduğumu hatırlatırım; bu durumu duymaktan üzüldüğümü ama şeffaflık adına müdürümüzle doğrudan görüşmesinin en sağlıklı yol olacağını belirterek dedikoduya net bir set çekerim.', 
        clinicalValue: 100, 
        aiTag: 'institutional_loyalist' 
      },
      { 
        label: 'Veliyi etkin bir şekilde dinleyerek duygusunu boşaltmasına izin veririm; "haklısınız" diyerek gazını alır ancak konuyu kimseye taşımayarak sessiz bir dinleyici kalmayı ve ailenin tarafında görünmeyi seçerim.', 
        clinicalValue: 60, 
        aiTag: 'passive_listener' 
      },
      { 
        label: 'Ben de o kişi hakkındaki olumsuz düşüncelerimi paylaşarak veliyle bir ittifak kurarım; kurumsal aidiyeti hiçe sayarak aile ile olan kişisel bağımı diğer personeli kötüleyerek güçlendirmeye çalışırım.', 
        clinicalValue: 20, 
        aiTag: 'toxic_alliance' 
      },
      { 
        label: 'Konuyu hemen değiştiririm ve cevap vermem; sorunu çözmek yerine görmezden gelerek velinin şikayetini havada bırakır ve profesyonel olmayan bir kaçınma stratejisi izleyerek seansı sürdürürüm.', 
        clinicalValue: 80, 
        aiTag: 'avoidant_neutrality' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_6',
    text: 'Sosyal medyada bir velinin sizi takip etme isteğini nasıl yönetirsiniz?',
    options: [
      { 
        label: 'Özel hayatımla profesyonel kimliğim arasındaki duvarın yıkılmaması için isteği reddederim; bunun kurumsal bir prensip olduğunu nazikçe açıklar ve dijital sınırlarımı mesleki onurumla korurum.', 
        clinicalValue: 100, 
        aiTag: 'digital_formality' 
      },
      { 
        label: 'Veliyi kırmamak için isteği kabul ederim ancak paylaşımlarımı kısıtlı bir listede tutarım; mesafeyi sosyal medya üzerinden de olsa korumaya çalışarak yarı-geçirgen bir sınır politikası izlerim.', 
        clinicalValue: 70, 
        aiTag: 'relational_proximity' 
      },
      { 
        label: 'Kabul ederim ve ben de onu takip etmeye başlarım; samimiyetin güveni artıracağına inanarak aile ile olan profesyonel ilişkimi kişisel bir dostluk seviyesine taşımaktan çekinmem.', 
        clinicalValue: 40, 
        aiTag: 'boundary_erosion' 
      },
      { 
        label: 'Sadece iş amaçlı bir hesabım varsa oradan kabul ederim; şahsi hesabımı ise veliye hiç bildirmeden tamamen gizli tutarak kendimi sadece profesyonel bir dijital kimlik üzerinden tanımlarım.', 
        clinicalValue: 90, 
        aiTag: 'professional_account_user' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_7',
    text: 'Vakanın dosyasını veya veli bilgilerini başka bir kuruma giderken yanınızda kopyalamak sizin için ne ifade eder?',
    options: [
      { 
        label: 'Bunu bir kurumsal veri hırsızlığı ve KVKK ihlali olarak görürüm; kurum çatısı altında üretilen her bilginin kurumsal mülkiyet olduğunu ve asla kopyalanamayacağını etik bir imanla savunurum.', 
        clinicalValue: 100, 
        aiTag: 'legal_integrity' 
      },
      { 
        label: 'Vakayı ben geliştirdiğim için gelişim sürecinin takibi adına bu bilgilerin bende de olması gerektiğini bir hak olarak görürüm; emeğimi kurumsal kuralların üstünde tutan narsistik bir yaklaşım sergilerim.', 
        clinicalValue: 40, 
        aiTag: 'proprietary_narcissism' 
      },
      { 
        label: 'Sadece çok sevdiğim birkaç ailenin numarasını alırım; vedalaşmak veya helalleşmek gibi duygusal gerekçelerle kurumsal gizlilik kurallarını kişisel hassasiyetlerim için delmeyi tercih ederim.', 
        clinicalValue: 60, 
        aiTag: 'emotional_justification' 
      },
      { 
        label: 'Herkesin yaptığını düşünerek ben de kopyalarım; yeni iş yerimde güçlü bir portföyüm olsun diye kurumun ticari ve akademik sırlarını mesleki bir sermaye gibi yanımda taşımayı doğal bulurum.', 
        clinicalValue: 20, 
        aiTag: 'unethical_opportunism' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_8',
    text: 'Bir vaka velisi size duygusal/romantik bir ilgi gösterdiğinde ilk adımınız ne olur?',
    options: [
      { 
        label: 'Durumu tek başıma çözmeye çalışmadan derhal yönetime bildiririm; vakanın başka bir uzmana naklini talep eder ve profesyonel alanı derhal terk ederek etik güvenliği garantilerim.', 
        clinicalValue: 100, 
        aiTag: 'proactive_escalation' 
      },
      { 
        label: 'Önce veliyi birebirde sertçe uyarırım; eğer ilgi devam ederse yönetime bildirmeyi düşünürüm ancak olayı büyümeden ve kimse duymadan kapatmaya yönelik riskli bir kriz yönetimi izlerim.', 
        clinicalValue: 70, 
        aiTag: 'secretive_risk_management' 
      },
      { 
        label: 'Bu ilgi hoşuma gitse de karşılık vermem ama durumu da bozmam; velinin motivasyonunun artması için sessiz bir flört alanı bırakarak süreci profesyonelliğe aykırı bir pasiflikle izlerim.', 
        clinicalValue: 30, 
        aiTag: 'passive_enjoyment' 
      },
      { 
        label: 'İşten ayrılmayı düşünürüm; üzerimdeki bu duygusal baskıyla çalışamayacağımı varsayarak sorunu bildirmek yerine kaçmayı ve profesyonel sorumluluklarımdan vazgeçmeyi tek yol olarak görürüm.', 
        clinicalValue: 50, 
        aiTag: 'avoidant_flight' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_9',
    text: 'Kurumun bilimsel çizgisine uymayan bir yöntemi aile çok istiyorsa ve kurumun ekonomik menfaati söz konusuysa uygular mısınız?',
    options: [
      { 
        label: 'Kesinlikle hayır; klinik liyakatimin ve bilimsel onurun her türlü maddi kazançtan üstün olduğunu savunur ve gerekirse vaka ile yolların ayrılmasını resmi bir raporla talep ederim.', 
        clinicalValue: 100, 
        aiTag: 'scientific_purity' 
      },
      { 
        label: 'Ailenin isteğini plasebo etkisi yaratabileceği düşüncesiyle sınırlı şekilde denerim; vaka zarar görmeyecekse ailenin kendini anlaşılmış hissetmesi için bilimsel çizgimi biraz esnetmeyi kabul ederim.', 
        clinicalValue: 60, 
        aiTag: 'pragmatic_dilution' 
      },
      { 
        label: 'Yönetim "yap" derse yaparım; ben sadece bir çalışanım ve kararın sorumluluğunu üst mercilere atarak etik sorgulamayı tamamen devre dışı bırakan bir itaat kültürü sergilerim.', 
        clinicalValue: 40, 
        aiTag: 'blind_obedience' 
      },
      { 
        label: 'Aileye yapıyormuş gibi gösteririm ama seansta kendi bildiğimi okurum; şeffaflıktan uzak ve aldatıcı bir profesyonel duruş sergileyerek vaka yönetiminde dürüstlük ilkesini tamamen çiğnerim.', 
        clinicalValue: 30, 
        aiTag: 'deceptive_practice' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_10',
    text: 'Meslektaşınızın etik bir hata yaptığını (örn: seans ücretini elden alması) saptadığınızda ilk reaksiyonunuz?',
    options: [
      { 
        label: 'Hatanın kurumsal güveni zedelediğini bilerek kişisel dostlukları bir kenara bırakırım; durumu resmi kanallara bildirerek meslek onurunu korumayı tek önceliğim haline getiririm.', 
        clinicalValue: 100, 
        aiTag: 'uncompromising_ethics' 
      },
      { 
        label: 'Arkadaşımı yanıma çeker ve bu hatanın kariyerine vereceği zararı anlatarak onu uyarırım; hatasını düzeltmesi için ona son bir şans tanır ve kurumsal denetimden durumu gizlerim.', 
        clinicalValue: 80, 
        aiTag: 'empathetic_arbitration' 
      },
      { 
        label: 'Görmemiş gibi yaparım; ispiyoncu damgası yiyerek çalışma barışını bozmak istemem ve meslektaşımın yolsuzluğunu sessiz bir suç ortaklığı ile onaylayan bir pasiflik sergilerim.', 
        clinicalValue: 30, 
        aiTag: 'complicit_silence' 
      },
      { 
        label: 'Yönetime anonim bir not bırakırım; sorumluluk almadan ve kimliğimi açık etmeden durumu ihbar ederek dolaylı bir müdahale yolu seçer ve kurumsal cesaretten yoksun bir duruş sergilerim.', 
        clinicalValue: 60, 
        aiTag: 'indirect_action' 
      }
    ]
  }
];
