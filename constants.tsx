
import { FormStep } from './types';

export const FORM_STEPS: FormStep[] = [
  { 
    id: 'personal', 
    title: 'Profesyonel Kimlik & Geçmiş', 
    description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz. Lütfen sadece gerçek deneyimlerinize odaklanın.' 
  },
  { id: 'logic_literacy', title: 'Bilişsel Esneklik', description: 'Karmaşık kriz anlarında mantıksal önceliklendirme ve kaynak yönetimi.' },
  { id: 'professional_cases', title: 'Klinik Etik İkilemler', description: 'İdari zorunluluklar ile profesyonel ahlak arasındaki ince çizgi.' },
  { id: 'psychological_integrity', title: 'Stres & Öz-Farkındalık', description: 'Tükenmişlik belirtileri ve fiziksel sınır ihlalleri analizi.' },
  { id: 'social_diplomacy', title: 'Kurumsal Realite', description: 'Veli, kurum ve iş arkadaşı üçgenindeki stratejik iletişim.' },
  { id: 'development', title: 'Gelişimsel Dürüstlük', description: 'Hata kabulü ve mesleki özeleştiri kapasitesi.' }
];

export const MOCK_QUESTIONS = {
  logic_literacy: [
    { 
      id: 'prioritization_1', 
      text: 'Aynı anda: 1) Bir öğrenci ağlama krizine girdi, 2) Bir veli kapıda öfkeyle sizi bekliyor, 3) Müdürünüz acil bir evrak imzalatmak istiyor. Sadece birine yönelebilirsiniz. Diğer ikisi bir süre ihmal edilecek. İlk kimi "ihmal" edersiniz?', 
      type: 'radio', 
      options: [
        'Öğrenciyi (Zarar vermeyeceği bir alanda kısa süre yalnız bırakarak).', 
        'Veliyi (Bekletilmeye devam ederek, kurumsal imajı riske atarak).', 
        'Müdürü (Otorite ile çatışmayı ve idari aksamayı göze alarak).', 
        'Hiçbirini ihmal etmem; hepsini aynı anda idare ederim (Gerçekçi olmayan kahramanlık/maskeleme).'
      ] 
    },
    {
      id: 'resource_conflict',
      text: 'Öğrenciniz için hayati bir eğitim materyali kurumda tek adet var ve başka bir öğretmen arkadaşınız onu "etiketlemeden" almış. Seansınız başlamak üzere. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Arkadaşımdan materyali hemen talep ederim; öğrencimin seansı her şeyden önceliklidir.',
        'O seansı materyalsiz idare ederim, çıkışta arkadaşımı uyarırım (Pasif uyum).',
        'Yönetime durumu bildirerek materyal takibi için kesin kurallar konmasını isterim.',
        'Kendi imkanlarımla benzer bir materyal üretir/hazırlarım (Sorumluluğu tekil üstlenme).'
      ]
    },
    {
      id: 'emergency_order',
      text: 'Kurum müdürü, teknik olarak yanlış olduğunu bildiğiniz bir değerlendirme yöntemini (Örn: Çocuğun hazır olmadığı bir modül) veliye "başarı" olarak sunmanızı emretti. Tavrınız?',
      type: 'radio',
      options: [
        'Emre uyarım; kurumun yönetim politikası benim profesyonel yorumumdan üstündür.',
        'Veliye gerçeği söylerim; etik ilkelerim iş güvenliğimden önce gelir.',
        'Müdürle odasında tartışır, ikna edemezsem "ortak bir dilde" gerçeği yumuşatarak sunarım.',
        'Durumu belgelendirir, veliye sadece teknik verileri gösterip yorumu ona bırakırım.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'parent_bribe',
      text: 'Varlıklı bir veli, çocuğuna daha fazla vakit ayırmanız veya seans dışında destek olmanız için size kurumun bilgisi dışında "danışmanlık" adı altında ödeme teklif etti. Bu ödeme maaşınızın iki katı. Ne hissedersiniz?',
      type: 'radio',
      options: [
        'Mesleki bilgimin bir bedeli vardır; kurum dışı saatlerde bunu yapmamda sakınca görmem.',
        'Teklifi sertçe reddederim ve veliyle olan profesyonel sınırımı kalınlaştırırım.',
        'Durumu kurum sahibine anlatır, bu paranın kuruma bağışlanması şartıyla kabul ederim.',
        'Veliyi kırmadan reddederim ama bu yakınlığın eğitim sürecine katkısını kullanırım.'
      ]
    },
    {
      id: 'diagnosis_hiding',
      text: 'Bir öğrencinizde otizm şüphesi görüyorsunuz ancak aile bunu kesinlikle reddediyor ve sadece "geç konuşma" olduğunu duymak istiyor. Kurum, veliyi kaçırmamak için teşhis telaffuz etmemenizi istiyor. Yaklaşımınız?',
      type: 'radio',
      options: [
        'Ailenin hazır olmasını beklerim; erkenden söylemek aileyi kurumdan ve eğitimden uzaklaştırabilir.',
        'Açıkça otizm şüphesini söylerim; erken tanı hakkını kimseden saklayamam.',
        'Veliye doğrudan söylemek yerine onları bir doktora yönlendirerek sorumluluğu devrederim.',
        'Kurumun stratejisine uyarım, zamanla ailenin kendisinin fark etmesini sağlarım.'
      ]
    },
    {
      id: 'clinical_discrepancy',
      text: 'Çocuğun gelişiminde 6 aydır hiçbir ilerleme yok. Veli çok memnun ama siz vaktin boşa gittiğini biliyorsunuz. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Veliye seansları sonlandırmayı veya başka bir uzmana gitmeyi teklif ederim.',
        'Veli memnun olduğu sürece devam ederim; psikolojik destek de eğitimin parçasıdır.',
        'Yöntemimi kökten değiştiririm ama veliye "duraklama dönemi normaldir" derim.',
        'Kurum yönetimine bildirip etik bir kurul kararı alınmasını isterim.'
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
        '"Nerede hata yaptım da onu bu krize soktum?" (Aşırı suçluluk/Süper ego).',
        '"Bunun için yeterli maaş almıyorum, bu iş çekilmez."',
        '"Profesyonel bir risk, sakince seansı bitirmeliyim" (Duygu bastırma).'
      ]
    },
    {
      id: 'burnout_shadow',
      text: 'Akşam son seansınızdasınız, çok yorgunsunuz ve veli kapıda 20 dakika "havadan sudan" konuşmak istiyor. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Sabırla dinlerim; veliyle bağ kurmak eğitimin bir parçasıdır.',
        'Çok acil bir işim olduğunu nazikçe söyleyip hemen ayrılırım (Sınır çizme).',
        'Dinliyormuş gibi yapıp zihnimde eve gidince ne yapacağımı planlarım.',
        'Veliyi kurum müdürüne yönlendirerek kurumsal bir kaçış yolu bulurum.'
      ]
    },
    {
      id: 'error_hiding',
      text: 'Öğrencinizle çalışırken bir güvenlik ihmali yaptınız (Örn: Sandalyeden düştü ama yaralanmadı). Kimse görmedi. Tavrınız?',
      type: 'radio',
      options: [
        'Yaralanma olmadığı için kimseye söylemem, boşuna panik yaratmaya gerek yok.',
        'Hemen veliye ve yönetime anlatırım; dürüstlük her türlü riskten üstündür.',
        'Sadece yönetime söylerim, veliyle olan güven ilişkimi bozmak istemem.',
        'Çocuğun sakar olduğunu veliye fısıldayarak olası bir morluk için önlem alırım.'
      ]
    }
  ],
  social_diplomacy: [
    {
      id: 'peer_neglect',
      text: 'Çok sevilen ve kıdemli bir meslektaşınızın seanslarda telefonla oynadığını ve çocuğu ihmal ettiğini fark ettiniz. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Görmezden gelirim; herkesin bazen motivasyonu düşebilir, aramızı bozmam.',
        'Kendisiyle dostane bir şekilde konuşup uyarırım.',
        'Kurum yönetimine anonim olarak bildiririm; çocukların hakkı arkadaşlıktan öndedir.',
        'Ben de kendi seanslarımda biraz daha esnek davranmaya başlarım (Grup normuna uyum).'
      ]
    },
    {
      id: 'manager_mistake',
      text: 'Müdürünüz, bir veli toplantısında sizin uzmanlık alanınızla ilgili teknik bir hata yaptı ve yanlış bilgi verdi. Toplantı devam ediyor. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Sessiz kalırım, müdürü velinin önünde küçük düşüremem.',
        'Hemen söze girip nazikçe bilgiyi düzeltirim; yanlış bilgi veliye zarar verebilir.',
        'Toplantı bitince müdürü uyarırım, veliye düzeltme maili atmasını öneririm.',
        'Söylediğini destekler gibi yapıp konuyu değiştiririm (Manipülatif uyum).'
      ]
    }
  ],
  development: [
    {
      id: 'failure_report',
      text: 'Meslek hayatınızda "başarısız olduğunuzu" hissettiğiniz, bir çocuğa fayda sağlayamadığınız bir vakayı ve bu başarısızlıktaki kendi payınızı dürüstçe analiz edin.',
      type: 'textarea'
    }
  ]
};
