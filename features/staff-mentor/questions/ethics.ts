import { AssessmentQuestion } from '../../../types';

export const ethicsQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_eth_v2_1',
    text: 'Veli, kurum dışındaki "özel seans" talebiyle size geldi ve mevcut maaşınızdan çok daha yüksek bir ücret teklif etti. Tavrınız?',
    options: [
      { 
        label: 'Profesyonel mesafenin ve kurumsal sadakatin mesleki onurun bir parçası olduğunu kabul eder; duygusal manipülasyonlara kapalı, net ve şeffaf bir reddetme dili kullanarak durumu derhal yönetime raporlarım.', 
        clinicalValue: 100, 
        aiTag: 'unshakeable_integrity' 
      },
      { 
        label: 'Veliyle kurulan terapötik bağı zedelememek adına durumu nazikçe açıklar, kurum politikalarını hatırlatarak talebi geri çeviririm; ancak ailenin güvenini sarsmamak için konuyu yönetime bildirmem.', 
        clinicalValue: 70, 
        aiTag: 'soft_boundary_risk' 
      },
      { 
        label: 'Teklifi kabul ederim ama kurumun haberi olmasın diye gizli tutarım. Sonuçta ekonomik şartlar zor ve bu benim emeğimin karşılığı.', 
        clinicalValue: 20, 
        aiTag: 'ethical_violation' 
      },
      { 
        label: 'Veliye "kurumdan ayrılırsam size haber veririm" diyerek açık kapı bırakırım, gelecekteki potansiyel müşteriyi kaybetmek istemem.', 
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
        label: 'Ailenin kimliğine veya sosyal konumuna bakmaksızın Çocuk Koruma protokolünü saniyeler içinde işletirim; hukuki ve etik sorumluluğun, kurumsal veya sosyal risklerden her zaman daha büyük olduğuna inanırım.', 
        clinicalValue: 100, 
        aiTag: 'legal_courage' 
      },
      { 
        label: 'Durumdan emin olmak için önce kurum içi klinik süpervizörle verileri paylaşır, aileyi savunma moduna sokmadan durumu anlamaya yönelik kontrollü bir görüşme planlarım.', 
        clinicalValue: 80, 
        aiTag: 'cautious_protocol' 
      },
      { 
        label: 'Aileyle aram bozulmasın diye görmezden gelirim, belki parkta düşmüştür diye kendimi ikna ederim.', 
        clinicalValue: 20, 
        aiTag: 'negligence_risk' 
      },
      { 
        label: 'Çocuğa "bunu kim yaptı?" diye sorarım, alacağım cevaba göre hareket ederim.', 
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
        label: 'Hediye kabul etmenin terapötik ilişkiyi "borçluluk" zeminine çekeceğini bildiğim için radikal bir kararlılıkla reddederim; etik sınırların esnetilmesinin uzun vadede klinik tarafsızlığımı yok edeceğini anlatırım.', 
        clinicalValue: 100, 
        aiTag: 'strict_boundary_guardian' 
      },
      { 
        label: 'Ailenin kültürel kodlarını ve iyi niyetini gözeterek, hediyeyi şahsım adına değil "kurum adına" kabul edebileceğimi, sınıfta materyal olarak kullanacağımızı belirtirim.', 
        clinicalValue: 90, 
        aiTag: 'balanced_diplomacy' 
      },
      { 
        label: 'Kabul ederim ama kimseye söylememesini rica ederim. Reddetmek kabalık olur.', 
        clinicalValue: 40, 
        aiTag: 'secretive_acceptance' 
      },
      { 
        label: 'Sadece bu seferlik kabul ederim, bir daha olmamasını söylerim.', 
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
        label: 'Bunu kişisel bir çatışma değil, vakanın hakkının gasp edilmesi olarak görürüm. Önce uyarırım, devam ederse kurumsal kalite standartlarını korumak adına yönetime bildiririm.', 
        clinicalValue: 100, 
        aiTag: 'quality_advocate' 
      },
      { 
        label: 'Çalışma barışını bozmamak adına arkadaşımla şaka yollu konuşur, "müdür görürse kızar" diyerek dolaylı uyarırım. Yönetime bildirmem.', 
        clinicalValue: 70, 
        aiTag: 'peer_loyalty_bias' 
      },
      { 
        label: 'Beni ilgilendirmez, herkes kendi işine baksın derim.', 
        clinicalValue: 40, 
        aiTag: 'bystander_apathy' 
      },
      { 
        label: 'Ben de bazen telefona bakıyorum, o yüzden bir şey deme hakkım yok.', 
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
        label: 'Veliye, kurumun bir parçası olduğumu hatırlatırım. "Bunu duyduğuma üzüldüm ancak şeffaflık adına müdürümüzle doğrudan görüşmeniz daha sağlıklı olacaktır" diyerek dedikoduya set çekerim.', 
        clinicalValue: 100, 
        aiTag: 'institutional_loyalist' 
      },
      { 
        label: 'Veliyi etkin bir şekilde dinleyerek duygusunu boşaltmasına izin veririm, "haklısınız" diyerek gazını alırım ama konuyu kimseye taşımam.', 
        clinicalValue: 60, 
        aiTag: 'passive_listener' 
      },
      { 
        label: 'Ben de o kişi hakkındaki olumsuz düşüncelerimi paylaşır, veliyle ittifak kurarım.', 
        clinicalValue: 20, 
        aiTag: 'toxic_alliance' 
      },
      { 
        label: 'Konuyu hemen değiştiririm, cevap vermem.', 
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
        label: 'Özel hayatımla profesyonel kimliğim arasındaki duvarın yıkılmaması için isteği kabul etmem. Veliye bunun kurumsal bir prensip olduğunu nazikçe açıklar ve dijital sınırımı korurum.', 
        clinicalValue: 100, 
        aiTag: 'digital_formality' 
      },
      { 
        label: 'Veliyi kırmamak için kabul ederim ancak paylaşımlarımı kısıtlı bir listede tutarım.', 
        clinicalValue: 70, 
        aiTag: 'relational_proximity' 
      },
      { 
        label: 'Kabul ederim, hatta ben de onu takip ederim. Samimiyet güveni artırır.', 
        clinicalValue: 40, 
        aiTag: 'boundary_erosion' 
      },
      { 
        label: 'Sadece iş hesabım varsa oradan kabul ederim, şahsi hesabımdan engellerim.', 
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
        label: 'Bunun bir "Kurumsal Veri Hırsızlığı" ve KVKK ihlali olduğunu kabul ederim. Kurum çatısı altında üretilen her bilgi kurumsal mülkiyettir, asla kopyalamam.', 
        clinicalValue: 100, 
        aiTag: 'legal_integrity' 
      },
      { 
        label: 'Vakayı ben geliştirdiğim için, gelişim sürecinin takibi adına bu bilgilerin bende de olması bir "haktır".', 
        clinicalValue: 40, 
        aiTag: 'proprietary_narcissism' 
      },
      { 
        label: 'Sadece çok sevdiğim birkaç ailenin numarasını alırım, helalleşmek için.', 
        clinicalValue: 60, 
        aiTag: 'emotional_justification' 
      },
      { 
        label: 'Herkes yapıyor, ben de yaparım. Yeni iş yerimde portföyüm olsun isterim.', 
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
        label: 'Durumu tek başıma çözmeye çalışmadan derhal yönetime ve süpervizörüme bildiririm; vakanın başka bir uzmana naklini talep eder, profesyonel alanı terk ederim.', 
        clinicalValue: 100, 
        aiTag: 'proactive_escalation' 
      },
      { 
        label: 'Önce veliyi birebirde sertçe uyarırım. Eğer devam ederse yönetime bildiririm; olayı büyütmeden çözmeye çalışırım.', 
        clinicalValue: 70, 
        aiTag: 'secretive_risk_management' 
      },
      { 
        label: 'İlgi hoşuma giderse karşılık vermem ama durumu da bozmam, görmezden gelirim.', 
        clinicalValue: 30, 
        aiTag: 'passive_enjoyment' 
      },
      { 
        label: 'İşten ayrılmayı düşünürüm, bu baskıyla çalışamam.', 
        clinicalValue: 50, 
        aiTag: 'avoidant_flight' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_9',
    text: 'Kurumun bilimsel çizgisine uymayan bir yöntemi aile çok istiyorsa ve kurumun ekonomik menfaati söz konusuysa, uygular mısınız?',
    options: [
      { 
        label: 'Kesinlikle hayır. Klinik liyakatimin ve bilimsel onurun her türlü maddi kazançtan üstün olduğunu savunur, gerekirse aileyle yolları ayırmayı göze alırım.', 
        clinicalValue: 100, 
        aiTag: 'scientific_purity' 
      },
      { 
        label: 'Ailenin isteğini "plasebo etkisi" yaratabileceği düşüncesiyle sınırlı bir şekilde, zarar vermeyecekse denerim.', 
        clinicalValue: 60, 
        aiTag: 'pragmatic_dilution' 
      },
      { 
        label: 'Yönetim "yap" derse yaparım, ben çalışanım kararı ben vermem.', 
        clinicalValue: 40, 
        aiTag: 'blind_obedience' 
      },
      { 
        label: 'Aileye yapıyormuş gibi gösteririm ama seansta bildiğimi okurum.', 
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
        label: 'Hatanın kurumsal güveni ve meslek onurunu zedelediğini bilerek, kişisel dostlukları bir kenara bırakır ve durumu resmi kanallara bildiririm.', 
        clinicalValue: 100, 
        aiTag: 'uncompromising_ethics' 
      },
      { 
        label: 'Arkadaşımı yanıma çeker ve bu hatanın kariyerine vereceği zararı anlatarak onu uyarırım. Hatasını düzeltmesi için şans tanırım.', 
        clinicalValue: 80, 
        aiTag: 'empathetic_arbitration' 
      },
      { 
        label: 'Görmemiş gibi yaparım, ispiyoncu olmak istemem.', 
        clinicalValue: 30, 
        aiTag: 'complicit_silence' 
      },
      { 
        label: 'Yönetime anonim bir not bırakırım.', 
        clinicalValue: 60, 
        aiTag: 'indirect_action' 
      }
    ]
  }
];
