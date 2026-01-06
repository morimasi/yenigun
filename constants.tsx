
import { FormStep } from './types';

export const FORM_STEPS: FormStep[] = [
  { 
    id: 'personal', 
    title: 'Profesyonel Kimlik & Geçmiş', 
    description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz. Lütfen sadece gerçek deneyimlerinize odaklanın.' 
  },
  { id: 'logic_literacy', title: 'Bilişsel Esneklik', description: 'Karmaşık durumlarda mantıksal önceliklendirme kapasitesi.' },
  { id: 'professional_cases', title: 'Klinik Etik İkilemler', description: 'Doğru cevabın olmadığı, seçim yapmanız gereken gerçek saha vakaları.' },
  { id: 'psychological_integrity', title: 'Stres & Otantisite', description: 'Tükenmişlik ve anlık duygusal tepki analizi.' },
  { id: 'social_diplomacy', title: 'Kurumsal Realite', description: 'Veli, kurum ve çocuk üçgenindeki çıkar çatışmaları.' },
  { id: 'development', title: 'Özeleştiri Kapasitesi', description: 'Hata ve gelişim alanı itirafı.' }
];

export const MOCK_QUESTIONS = {
  logic_literacy: [
    { 
      id: 'prioritization_1', 
      text: 'Aynı anda: 1) Bir öğrenci ağlama krizine girdi, 2) Bir veli kapıda öfkeyle sizi bekliyor, 3) Müdürünüz acil bir evrak imzalatmak istiyor. Sadece birine yönelebilirsiniz. Diğer ikisi bir süre ihmal edilecek. İlk kimi feda edersiniz?', 
      type: 'radio', 
      options: [
        'Öğrenciyi (Sınıfta güvenli bir yere alıp bırakarak)', 
        'Veliyi (Bekletilmeye devam ederek)', 
        'Müdürü (Tepki almayı göze alarak)', 
        'Bu durumu yönetemem, yardım çağırırım (Yetersizlik itirafı)'
      ] 
    },
    {
      id: 'resource_scarcity',
      text: 'Kurumda eğitim materyalleri çok kısıtlı ve yeni bütçe yok. Diğer öğretmen arkadaşınız kendi öğrencisi için sizin dolabınızdaki tek set materyali izinsiz almış. Tepkiniz ne olur?',
      type: 'radio',
      options: [
        'Anlayışla karşılar, materyali ona bırakırım (Pasif karakter olasılığı).',
        'Gidip sertçe geri alırım; benim öğrencimin hakkı önceliklidir.',
        'Durumu müdüre raporlayarak profesyonel bir sınır çizilmesini isterim.',
        'Kendi cebimden yeni bir materyal alır, sorunu kimseyle muhatap olmadan çözerim.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'case_grey_1',
      text: 'Çocuğun gelişiminde hiçbir ilerleme yok, ancak aile kuruma yüklü bir ödeme yapmaya devam ediyor. Kurum sahibi "ilerleme var" demenizi istiyor. Vicdanınız ve iş güvenliğiniz arasında kaldınız. Hangisine daha yakınsınız?',
      type: 'radio',
      options: [
        'Müdürün dediğini yaparım; kurumun sürekliliği çocuğun tekil eğitiminden daha kritiktir.',
        'Veliye gerçeği söylerim; ertesi gün işten çıkarılmayı göze alırım.',
        'İlerlemeyi "abartmadan" anlatır, durumu zamana yayarak kendimi korurum.',
        'Veliye çaktırmadan başka bir kurum bulmasını tavsiye ederim.'
      ]
    },
    {
      id: 'case_grey_2',
      text: 'Sizin yöntemlerinizle çok başarılı olan bir çocuğun seansı, sizinle kişisel sorun yaşayan kıdemli bir öğretmene "idari bir kararla" verildi. Tavrınız ne olur?',
      type: 'radio',
      options: [
        'Karara uyarım, profesyonellik bunu gerektirir (Bastırılmış öfke olasılığı).',
        'Öğretmen arkadaşıma çocuğun eksiklerini söylemeyerek başarısız olmasını izlerim.',
        'Veliye bu değişikliğin çocuk için kötü olacağını fısıldarım.',
        'Kurumdan ayrılma planı yapmaya başlarım.'
      ]
    }
  ],
  psychological_integrity: [
    {
      id: 'shadow_1',
      text: 'Bir seansın son 10 dakikasında çocuğun kaka yapması ve temizlenmesi gerektiği anlaşıldı. Bir sonraki seansınız çok önemli bir yeni değerlendirme. Ne hissedersiniz?',
      type: 'radio',
      options: [
        'Derin bir öfke ve bıkkınlık; bu işin en nefret ettiğim kısmı budur.',
        'Hiçbir şey hissetmem, rutin bir iştir (Sosyal beğenirlik uyarısı - Muhtemel yalan).',
        'Suçu veliye veya yardımcı personele atma eğilimi hissederim.',
        'Kendimi "sabırlı olmalısın" diye telkin ederken aşırı yorulduğumu fark ederim.'
      ]
    },
    {
      id: 'shadow_2',
      text: 'Öğrencinize karşı anlık bir öfke patlaması yaşadınız ve sesinizi yükselttiniz. Kimse görmedi. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Kimseden bahsetmem, insani bir durumdur unutur giderim.',
        'Vicdan azabı çekerim ama işimi kaybetmemek için gizli tutarım.',
        'Hemen amirime gidip raporlarım; etik hatamı kabul ederim.',
        'O gün o çocukla çalışmayı bırakıp yerime birini isterim.'
      ]
    }
  ],
  social_diplomacy: [
    {
      id: 'diplomacy_1',
      text: 'Bir meslektaşınızın çocuğa fiziksel olarak "biraz sert" (tokat değil ama sarsma) müdahale ettiğini gördünüz. Arkadaşınız çok eski ve sevilen biri. Tepkiniz?',
      type: 'radio',
      options: [
        'Görmezden gelirim, hepimiz bazen sınırı aşabiliriz.',
        'Kendisini uyarırım ama kuruma bildirmem.',
        'Anında yönetime bildiririm; meslektaşlık çocuktan önce gelmez.',
        'Durumu veliye anonim bir şekilde sızdırırım.'
      ]
    }
  ],
  development: [
    {
      id: 'failure_1',
      text: 'Mesleki hayatınızda bir çocuğun gelişimine "zarar verdiğiniz" veya "hiçbir katkı sağlayamadığınız" bir anı dürüstçe anlatın. Eğer yok derseniz, bu değerlendirme geçersiz sayılacaktır.',
      type: 'textarea'
    }
  ]
};
