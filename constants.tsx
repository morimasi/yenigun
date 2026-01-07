
import { FormStep } from './types';

export const FORM_STEPS: FormStep[] = [
  { 
    id: 'personal', 
    title: 'Profesyonel Kimlik & Geçmiş', 
    description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz. Lütfen sadece gerçek deneyimlerinize odaklanın.' 
  },
  { id: 'logic_literacy', title: 'Bilişsel Esneklik & Kriz', description: 'Karmaşık kriz anlarında mantıksal önceliklendirme ve kaynak yönetimi.' },
  { id: 'professional_cases', title: 'Klinik Etik İkilemler', description: 'İdari zorunluluklar ile profesyonel ahlak arasındaki ince çizgi.' },
  { id: 'psychological_integrity', title: 'Stres & Öz-Farkındalık', description: 'Tükenmişlik belirtileri ve fiziksel sınır ihlalleri analizi.' },
  { id: 'social_diplomacy', title: 'Kurumsal Realite', description: 'Veli, kurum ve iş arkadaşı üçgenindeki stratejik iletişim.' },
  { id: 'development', title: 'Gelişimsel Dürüstlük', description: 'Hata kabulü ve mesleki özeleştiri kapasitesi.' }
];

export const MOCK_QUESTIONS = {
  logic_literacy: [
    { 
      id: 'prioritization_1', 
      text: 'Aynı anda: 1) Bir öğrenci ağlama krizine girdi, 2) Bir veli kapıda öfkeyle sizi bekliyor, 3) Müdürünüz acil bir evrak imzalatmak istiyor. Sadece birine yönelebilirsiniz. İlk kimi "ihmal" edersiniz?', 
      type: 'radio', 
      options: [
        'Öğrenciyi (Güvenli bir alandaysa kısa süre kendi haline bırakarak).', 
        'Veliyi (Bekletilmeye devam ederek, kurumsal imajı riske atarak).', 
        'Müdürü (Otorite ile çatışmayı ve idari aksamayı göze alarak).', 
        'Hiçbirini ihmal etmem; hepsini aynı anda idare ederim (Gerçekçi olmayan maskeleme).'
      ] 
    },
    {
      id: 'resource_conflict',
      text: 'Seans başlamak üzereyken, kullanacağınız tek materyalin başka bir uzman tarafından odasına götürüldüğünü fark ettiniz. Materyal sizin seans akışınız için hayati önemde. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Hemen odasına gidip materyali geri alırım; seans verimliliği her şeyden önce gelir.',
        'Materyalsiz devam ederim ve seansı doğaçlama yönetirim (Adaptasyon odaklı pasiflik).',
        'Yönetime durumu bildirerek materyal takibi için kesin kurallar konmasını isterim.',
        'Arkadaşımla seans sonrası konuşurum, bu seansı alternatif bir materyalle idare ederim.'
      ]
    },
    {
      id: 'emergency_order',
      text: 'Müdürünüz, teknik olarak hatalı olduğunu bildiğiniz bir BEP (Bireyselleştirilmiş Eğitim Programı) modülünü, veliyi memnun etmek adına "başarıldı" olarak işaretlemenizi istiyor. Tavrınız?',
      type: 'radio',
      options: [
        'Emre uyarım; kurumun yönetim politikası benim profesyonel yorumumdan üstündür.',
        'Veliye gerçeği söylerim; etik ilkelerim iş güvenliğimden önce gelir.',
        'Müdürle odasında teknik verilerle tartışır, ikna edemezsem "ortak bir dilde" gerçeği yumuşatarak sunarım.',
        'Durumu belgelendirir, veliye sadece teknik verileri gösterip yorumu ona bırakırım.'
      ]
    },
    {
      id: 'assessment_clash',
      text: 'Bir öğrencinin değerlendirme sonucunda gelişim göstermediğini fark ettiniz, ancak kurum bu öğrencinin seans sayısını artırmak için veliye "çok az kaldı, destek seans şart" demenizi istiyor. Yaklaşımınız?',
      type: 'radio',
      options: [
        'Kurumsal süreklilik için denileni yaparım, seanslarda daha çok çalışırım.',
        'Gerçek durumu açıklarım ve seans sayısının artmasının bir fayda sağlamayacağını belirtirim.',
        'Seans artışını kabul ederim ama bunun "garanti olmadığını" veliye fısıldarım.',
        'Yönetime etik çekincelerimi bildirip, sorumluluğun onlarda olduğunu belirten bir rapor hazırlarım.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'parent_bribe',
      text: 'Varlıklı bir veli, çocuğuna daha fazla odaklanmanız için size kurum dışı özel bir "danışmanlık" ücreti teklif etti. Bu miktar maaşınızın oldukça üzerinde. Ne hissedersiniz?',
      type: 'radio',
      options: [
        'Mesleki bilgimin bir bedeli vardır; kurum dışı saatlerde bunu yapmamda sakınca görmem.',
        'Teklifi reddederim ama veliyle olan samimiyetimi ve ilgimi korumaya devam ederim.',
        'Durumu derhal yönetime bildiririm; bu durum hem etik hem de kurumsal güvenlik ihlalidir.',
        'Veliyi kırmadan reddederim ama bu yakınlığın eğitim sürecine pozitif katkısını kullanırım.'
      ]
    },
    {
      id: 'diagnosis_hiding',
      text: 'Öğrencinizde belirgin bir ek tanı şüphesi (Örn: Epilepsi veya Otizm) seziyorsunuz ama aile bunu reddediyor. Kurum ise aileyi ürkütmemek için bu konuyu açmamanızı emretti. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Ailenin hazır olmasını beklerim; erkenden söylemek aileyi eğitimden koparabilir.',
        'Açıkça şüphemi söylerim; erken tanı hakkı kurumun ticari kaygısından üstündür.',
        'Veliye doğrudan söylemek yerine onları dolaylı yoldan bir doktora yönlendiririm.',
        'Kurumun stratejisine uyarım, zamanla ailenin kendisinin fark etmesini sağlarım.'
      ]
    },
    {
      id: 'colleague_error',
      text: 'Çok sevilen ve kıdemli bir meslektaşınızın seans sırasında çocuğa karşı hafif de olsa fiziksel bir sınır ihlali (Örn: Sertçe sarsma) yaptığını gördünüz. İlk adımınız?',
      type: 'radio',
      options: [
        'Görmezden gelirim; herkesin bazen sabrı taşabilir, aramızı bozmam.',
        'Kendisiyle dostane bir şekilde konuşup uyarırım, bir daha yapmamasını rica ederim.',
        'Kurum yönetimine resmi olarak bildiririm; çocuk güvenliği arkadaşlıktan öndedir.',
        'Durumu çocuğun ailesine fısıldayarak onların müdahale etmesini sağlarım.'
      ]
    },
    {
      id: 'clinical_integrity_2',
      text: 'Uyguladığınız yöntemin çocukta davranış problemlerini artırdığını gözlemlediniz, ancak bu yöntem kurumun "marka" haline getirdiği ve her çocukta zorunlu tuttuğu bir ekol. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Kurum ekolüne sadık kalırım; uzun vadede sonuç vereceğine inanırım.',
        'Yöntemi gizlice değiştiririm ve çocuğun ihtiyacına göre davranırım.',
        'Yönetime vaka bazlı istisna talep ederim, reddedilirse etik olarak istifa ederim.',
        'Veliye yöntemin bu çocukta çalışmadığını dürüstçe söylerim.'
      ]
    }
  ],
  psychological_integrity: [
    {
      id: 'physical_aggression',
      text: 'Bir seans sırasında öğrenciniz size fiziksel olarak ciddi şekilde zarar verdi (ısırık, tırnaklama vb.). O anki ilk içsel düşünceniz hangisine daha yakın olur?',
      type: 'radio',
      options: [
        '"Bu çocukla artık çalışmak istemiyorum, sınırı aştı."',
        '"Nerede hata yaptım da onu bu krize soktum?" (Aşırı sorumluluk yüklenimi).',
        '"Bunun için yeterli maaş almıyorum, bu iş çekilmez."',
        '"Profesyonel bir risk, sakince seansı bitirmeliyim" (Duygu bastırma).'
      ]
    },
    {
      id: 'burnout_shadow',
      text: 'Akşam son seansınızdasınız, aşırı yorgunsunuz ve veli kapıda 20 dakika boyunca kendi kişisel sorunlarını anlatmak istiyor. Tepkiniz?',
      type: 'radio',
      options: [
        'Sabırla dinlerim; veliyle bağ kurmak çocuğun eğitiminin bir parçasıdır.',
        'Çok acil bir işim olduğunu nazikçe söyleyip hemen ayrılırım (Sınır çizme).',
        'Dinliyormuş gibi yapıp zihnimde akşam planlarımı yaparım.',
        'Veliyi kurum müdürüne yönlendirerek kurumsal bir kaçış yolu bulurum.'
      ]
    },
    {
      id: 'error_hiding',
      text: 'Öğrencinizle çalışırken bir güvenlik ihmali yaptınız (Örn: Sandalyeden düştü ama yaralanmadı). Kimse görmedi. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Yaralanma olmadığı için kimseye söylemem, boşuna panik yaratmaya gerek yok.',
        'Hemen veliye ve yönetime anlatırım; dürüstlük her türlü riskten üstündür.',
        'Sadece yönetime söylerim, veliyle olan güven ilişkimi bozmak istemem.',
        'Çocuğun sakar olduğunu veliye fısıldayarak olası bir morluk için önlem alırım.'
      ]
    },
    {
      id: 'emotional_attachment',
      text: 'Bir öğrencimize karşı aşırı bir duygusal bağ (Örn: Kendi çocuğunuz gibi görme) hissetmeye başladınız. Bu durum kararlarınızı etkiliyor mu?',
      type: 'radio',
      options: [
        'Evet, bu bağ sayesinde ona daha iyi eğitim verdiğimi düşünüyorum.',
        'Hayır, profesyonel sınırlarımı her zaman koruyabilirim (İnkar/Maskeleme).',
        'Bu durumu fark ettiğim an süpervizyon alırım veya vaka devri isterim.',
        'Duygusallık bu mesleğin doğasında var, bunu bir motivasyon aracı olarak kullanırım.'
      ]
    }
  ],
  social_diplomacy: [
    {
      id: 'peer_neglect',
      text: 'Kurumda herkesin çok saygı duyduğu bir öğretmenin seanslarda telefonla oynadığını ve çocukları boş bıraktığını fark ettiniz. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Görmezden gelirim; herkesin bazen motivasyonu düşebilir.',
        'Kendisiyle uygun bir dille konuşup uyarırım.',
        'Yönetime anonim bir şikayette bulunurum; çocukların hakkı her şeyden önemlidir.',
        'Ben de kendi seanslarımda biraz daha esnek davranmaya başlarım.'
      ]
    },
    {
      id: 'manager_mistake',
      text: 'Müdürünüz, bir veli toplantısında sizin uzmanlık alanınızla ilgili teknik bir hata yaptı. Veliler müdürün doğru söylediğine inanıyor. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Sessiz kalırım, müdürü velinin önünde küçük düşüremem.',
        'Hemen söze girip nazikçe bilgiyi düzeltirim; yanlış bilgi veliye zarar verebilir.',
        'Toplantı bitince müdürü uyarırım, veliye düzeltme maili atmasını öneririm.',
        'Söylediğini destekler gibi yapıp konuyu hızlıca değiştiririm.'
      ]
    },
    {
      id: 'parent_gossip',
      text: 'Bir veli, başka bir öğretmenin yetersiz olduğunu ve sizinle devam etmek istediğini söyleyerek o öğretmeni kötülüyor. Tavrınız?',
      type: 'radio',
      options: [
        'Meslektaşımı savunurum ve kurumun her öğretmenine güvendiğimi söylerim.',
        'Veliyi dinlerim ve "maalesef bazen öyle durumlar olabiliyor" derim.',
        'Veliyi yönetime yönlendiririm, meslektaşım hakkında yorum yapmam.',
        'Velinin haklı olabileceğini düşünüp durumu meslektaşımla paylaşırım.'
      ]
    }
  ],
  development: [
    {
      id: 'failure_report',
      text: 'Meslek hayatınızda "başarısız olduğunuzu" hissettiğiniz, bir çocuğa fayda sağlayamadığınız bir vakayı ve bu süreçteki hatalarınızı dürüstçe analiz edin.',
      type: 'textarea'
    },
    {
      id: 'feedback_reception',
      text: 'Yönetimden veya bir veliden aldığınız "ağır ve haksız" bulduğunuz bir eleştiri karşısında verdiğiniz en somut tepkiyi anlatın.',
      type: 'textarea'
    }
  ]
};
