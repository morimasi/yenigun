import { AssessmentQuestion } from '../../../types';

/**
 * YENİ GÜN AKADEMİ | ETİK TAHKİM VE PROFESYONEL MESAFE (v24.0)
 * 10 SORULUK MÜHÜRLÜ SET
 */

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
        label: 'Veliyle kurulan terapötik bağı zedelememek adına durumu nazikçe açıklar, kurum politikalarını hatırlatarak talebi geri çeviririm; ancak ailenin güvenini sarsmamak için konuyu kurum içinde bir krize dönüştürmeden, kendi içimde çözmeyi tercih ederim.', 
        clinicalValue: 85, 
        aiTag: 'soft_boundary_risk' 
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
        label: 'Durumdan emin olmak için önce kurum içi klinik süpervizörle verileri paylaşır, aileyi savunma moduna sokmadan durumu anlamaya yönelik kontrollü bir görüşme planlarım; kurumu ve kendimi büyük bir krizin içine atmadan önce kanıt toplama sürecini öncelerim.', 
        clinicalValue: 75, 
        aiTag: 'risk_aversion_tendency' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_3',
    text: 'Çok sevdiğiniz bir vakanın velisi size maddi değeri yüksek bir hediye getirdi ve "reddederseniz çok üzüleceğini" söylüyor. Tavrınız?',
    options: [
      { 
        label: 'Hediye kabul etmenin terapötik ilişkiyi "borçluluk" zeminine çekeceğini bildiğim için radikal bir kararlılıkla reddederim; etik sınırların esnetilmesinin uzun vadede klinik tarafsızlığımı yok edeceğini veliye profesyonel bir dille anlatırım.', 
        clinicalValue: 100, 
        aiTag: 'strict_boundary_guardian' 
      },
      { 
        label: 'Ailenin kültürel kodlarını ve iyi niyetini gözeterek, hediyeyi şahsım adına değil "kurum adına" kabul edebileceğimi, tüm personelin faydalanacağı bir materyal olarak sınıfa katacağımı belirterek durumu eğitici bir fırsata çeviririm.', 
        clinicalValue: 92, 
        aiTag: 'balanced_diplomacy' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_4',
    text: 'Kurumda bir arkadaşınızın vaka başında sürekli telefonla oynadığını (seans süresini verimsiz kullandığını) gördünüz. Profesyonel sorumluluğunuz?',
    options: [
      { 
        label: 'Bunu kişisel bir çatışma değil, vakanın hakkının gasp edilmesi olarak görürüm. Önce meslektaşımı doğrudan uyarırım, davranışın devam etmesi halinde kurumsal kalite standartlarını korumak adına durumu yönetime resmi olarak bildiririm.', 
        clinicalValue: 100, 
        aiTag: 'quality_advocate' 
      },
      { 
        label: 'Çalışma barışını ve ekip içindeki huzuru bozmamak adına arkadaşımla daha dolaylı, şaka yollu veya empati kuran bir dille konuşmayı denerim; hatayı sisteme raporlamak yerine arkadaşlık ilişkisi üzerinden iyileştirmeyi tercih ederim.', 
        clinicalValue: 70, 
        aiTag: 'peer_loyalty_bias' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_5',
    text: 'Veli, kurum müdürü veya başka bir öğretmen hakkında size dert yanıyor ve "aramızda kalsın" diyor. Sınırınızı nasıl çizersiniz?',
    options: [
      { 
        label: 'Veliye, kurumun bir parçası olduğumu ve gizli şikayetlerin çözüm üretmeyeceğini hatırlatırım. "Bunu duyduğuma üzüldüm ancak şeffaflık adına müdürümüzle doğrudan görüşmeniz daha sağlıklı olacaktır" diyerek mesafemi anında korurum.', 
        clinicalValue: 100, 
        aiTag: 'institutional_loyalist' 
      },
      { 
        label: 'Veliyi etkin bir şekilde dinleyerek duygusunu boşaltmasına izin veririm, ardından sorunu çözmek için perde arkasından (veliyi deşifre etmeden) gerekli düzenlemeleri yapmaya çalışırım; veliyle aramdaki "özel sırdaş" bağını korumayı önemserim.', 
        clinicalValue: 60, 
        aiTag: 'triangulation_risk' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_6',
    text: 'Sosyal medyada bir velinin sizi takip etme isteğini nasıl yönetirsiniz?',
    options: [
      { 
        label: 'Özel hayatımla profesyonel kimliğim arasındaki duvarın yıkılmaması için isteği kabul etmem. Veliye bir sonraki seans öncesinde bunun kurumsal bir prensip olduğunu nazikçe açıklar ve dijital sınırımı korurum.', 
        clinicalValue: 100, 
        aiTag: 'digital_formality' 
      },
      { 
        label: 'Veliyi kırmamak ve sosyal desteğimi hissettirmek için isteği kabul ederim ancak paylaşımlarımı kısıtlı bir listede tutarım; samimiyetin ve ulaşılabilirliğin aile üzerindeki terapötik etkiyi güçlendirdiğine inanırım.', 
        clinicalValue: 80, 
        aiTag: 'relational_proximity' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_7',
    text: 'Vakanın dosyasını veya veli bilgilerini başka bir kuruma giderken yanınızda kopyalamak sizin için ne ifade eder?',
    options: [
      { 
        label: 'Bunun bir "Kurumsal Veri Hırsızlığı" ve "Kişisel Verilerin Korunması (KVKK)" ihlali olduğunu kabul ederim. Kurum çatısı altında üretilen her türlü bilginin kurumsal mülkiyet olduğunu bilir, etik olarak buna asla tevessül etmem.', 
        clinicalValue: 100, 
        aiTag: 'legal_integrity' 
      },
      { 
        label: 'Vakayı ben geliştirdiğim ve aileyle bağı ben kurduğum için, gelişim sürecinin takibi adına bu bilgilerin bende de olmasını bir "hak" olarak görürüm; vakanın yararını kurumsal mülkiyet tartışmalarının önünde tutarım.', 
        clinicalValue: 40, 
        aiTag: 'proprietary_narcissism' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_8',
    text: 'Bir vaka velisi size duygusal/romantik bir ilgi gösterdiğinde ilk adımınız ne olur?',
    options: [
      { 
        label: 'Durumu tek başıma çözmeye çalışmadan derhal yönetime ve süpervizörüme bildiririm; vakanın başka bir uzmana naklini talep eder, etik bir skandala veya klinik sapmaya yol açmadan profesyonel alanı terk ederim.', 
        clinicalValue: 100, 
        aiTag: 'proactive_escalation' 
      },
      { 
        label: 'Önce veliyi birebirde çok sert ve net bir şekilde uyarırım. Eğer devam ederse yönetime bildiririm; durumu kendi başıma, kurumsal huzuru kaçırmadan sessizce çözmeyi denemenin daha liyakatli bir kriz yönetimi olduğunu düşünürüm.', 
        clinicalValue: 70, 
        aiTag: 'secretive_risk_management' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_9',
    text: 'Kurumun bilimsel çizgisine uymayan bir yöntemi aile çok istiyorsa ve kurumun ekonomik menfaati söz konusuysa, "müşteri memnuniyeti" adına uygular mısınız?',
    options: [
      { 
        label: 'Kesinlikle hayır. Klinik liyakatimin ve kurumun bilimsel onurunun her türlü maddi kazançtan üstün olduğunu savunur, gerekirse aileyle yolları ayırmayı göze alarak bilimsel doğrudan taviz vermem.', 
        clinicalValue: 100, 
        aiTag: 'scientific_purity' 
      },
      { 
        label: 'Ailenin isteğini "plasebo etkisi" yaratabileceği veya motivasyonlarını artırabileceği düşüncesiyle sınırlı bir şekilde denemeye açarım; kurumun finansal sürdürülebilirliğini ve aile mutluluğunu klinik esneklikle dengelemeyi tercih ederim.', 
        clinicalValue: 65, 
        aiTag: 'pragmatic_dilution' 
      }
    ]
  },
  {
    id: 'stf_eth_v2_10',
    text: 'Meslektaşınızın etik bir hata yaptığını (örn: seans ücretini elden alması) saptadığınızda ilk reaksiyonunuz?',
    options: [
      { 
        label: 'Hatanın kurumsal güveni ve meslek onurunu zedelediğini bilerek, kişisel dostlukları bir kenara bırakır ve durumu resmi denetim kanallarına bildiririm; liyakatli bir kurumun otokontrol mekanizmasının parçası olmayı görev sayarım.', 
        clinicalValue: 100, 
        aiTag: 'uncompromising_ethics' 
      },
      { 
        label: 'Arkadaşımı yanıma çeker ve bu hatanın kariyerine vereceği zararı anlatarak onu uyarırım. Hatasını düzeltmesi için bir şans tanır, ancak tekrarlarsa bildireceğimi söyleyerek bir "ara formül" uygularım.', 
        clinicalValue: 80, 
        aiTag: 'empathetic_arbitration' 
      }
    ]
  }
];
