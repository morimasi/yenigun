
import { FormStep } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Temel Bilgiler', description: 'Aday kimlik ve branş verileri' },
  { id: 'primary_competency', title: 'İlkokul Temel Yetkinlikler', description: '1-4. Sınıf seviyesinde temel matematik, mantık ve anlama becerileri (10 Soru)' },
  { id: 'logic_literacy', title: 'Akademik Keskinlik', description: 'İleri düzey mantık ve metin analizi' },
  { id: 'general_culture', title: 'Genel Kültür & Farkındalık', description: 'Entelektüel birikim ve sosyal bilinç' },
  { id: 'psychological', title: 'Psikolojik Profil', description: 'Stres yönetimi ve kriz anı refleksleri' },
  { id: 'professional', title: 'Mesleki Yetkinlik', description: 'Vaka analizi ve teknik müdahale becerisi' },
  { id: 'social', title: 'Veli İletişimi', description: 'Zorlu veli senaryoları ve çözüm odaklılık' },
  { id: 'development', title: 'Gelişim Alanları', description: 'Öğrenme çevikliği ve geri bildirim olgunluğu' },
  { id: 'ethics', title: 'Etik & Değerler', description: 'Mesleki dürüstlük ve kurumsal sadakat' }
];

export const MOCK_QUESTIONS = {
  primary_competency: [
    { 
      id: 'p_math_1', 
      text: '3 onluk ve 7 birlikten oluşan sayının 15 fazlası kaçtır?', 
      type: 'radio', 
      options: ['37', '42', '52', '60'] 
    },
    { 
      id: 'p_logic_1', 
      text: '"Dün günlerden Pazartesi ise, yarın hangi gündür?"', 
      type: 'radio', 
      options: ['Salı', 'Çarşamba', 'Perşembe', 'Pazar'] 
    },
    { 
      id: 'p_read_1', 
      text: '"Ayşe, okuldan eve gelince ellerini yıkadı ve mutfağa geçti. Masanın üzerindeki elmayı alıp yedi." Ayşe mutfakta ne yaptı?', 
      type: 'radio', 
      options: ['Ders çalıştı', 'Elma yedi', 'Ellerini yıkadı', 'Uyudu'] 
    },
    { 
      id: 'p_math_2', 
      text: 'Hangi geometrik şeklin köşesi yoktur?', 
      type: 'radio', 
      options: ['Kare', 'Üçgen', 'Daire', 'Dikdörtgen'] 
    },
    { 
      id: 'p_logic_2', 
      text: '2, 5, 8, 11, ? Örüntüde soru işareti yerine hangi sayı gelmelidir?', 
      type: 'radio', 
      options: ['13', '14', '15', '16'] 
    },
    { 
      id: 'p_math_3', 
      text: 'Bir bakkalda 48 yumurta vardır. Yumurtaların yarısı satıldığına göre geriye kaç yumurta kalmıştır?', 
      type: 'radio', 
      options: ['24', '12', '20', '30'] 
    },
    { 
      id: 'p_read_2', 
      text: '"Isınmak" kelimesinin zıt anlamlısı aşağıdakilerden hangisidir?', 
      type: 'radio', 
      options: ['Sıcak', 'Soğumak', 'Yanmak', 'Ilık'] 
    },
    { 
      id: 'p_reason_1', 
      text: 'Ali, Can\'dan uzundur. Can, Berk\'ten uzundur. Bu durumda en kısa boylu kimdir?', 
      type: 'radio', 
      options: ['Ali', 'Can', 'Berk', 'Hepsi aynı'] 
    },
    { 
      id: 'p_math_4', 
      text: '56 sayısında "5" rakamının basamak değeri kaçtır?', 
      type: 'radio', 
      options: ['5', '50', '56', '500'] 
    },
    { 
      id: 'p_logic_3', 
      text: 'Hangi seçenek bir meyve grubuna ait değildir?', 
      type: 'radio', 
      options: ['Elma', 'Armut', 'Pırasa', 'Çilek'] 
    }
  ],
  logic_literacy: [
    { 
      id: 'math1', 
      text: 'Bir okulun kütüphanesindeki kitapların %40\'ı hikaye kitabıdır. 80 tane hikaye kitabı olduğuna göre kütüphanede toplam kaç kitap vardır?', 
      type: 'radio', 
      options: ['160', '200', '240', '320'] 
    },
    { 
      id: 'math2', 
      text: '1, 3, 6, 10, 15, ? dizisindeki bir sonraki sayı nedir?', 
      type: 'radio', 
      options: ['19', '20', '21', '22'] 
    },
    { 
      id: 'read1', 
      text: '"Eğitimde fırsat eşitliği, her öğrenciye aynı yöntemi uygulamak değil, her öğrencinin ihtiyacı olan kaynağa erişimini sağlamaktır." Bu cümleden çıkarılabilecek en doğru yargı nedir?', 
      type: 'radio', 
      options: [
        'Eşitlik için herkese aynı materyal verilmelidir.', 
        'Adalet, ihtiyaç temelli bir yaklaşımı gerektirir.', 
        'Kaynaklar her zaman kısıtlıdır.', 
        'Yöntemler öğrenciye göre değişmez.'
      ] 
    },
    { 
      id: 'logic2', 
      text: 'A kenti B\'nin doğusunda, C kenti ise A\'nın kuzeyindedir. Buna göre B kenti C\'nin hangi yönündedir?', 
      type: 'radio', 
      options: ['Kuzeydoğu', 'Güneybatı', 'Güneydoğu', 'Kuzeybatı'] 
    }
  ],
  general_culture: [
    { 
      id: 'gc1', 
      text: 'UNESCO tarafından "Dünya Kültür Mirası" listesinde yer alan, Şanlıurfa\'daki en eski tapınak yerleşkesi hangisidir?', 
      type: 'radio', 
      options: ['Çatalhöyük', 'Göbeklitepe', 'Efes', 'Nemrut'] 
    },
    { 
      id: 'gc2', 
      text: 'Otizm spektrum bozukluğu farkındalık günü hangi aydadır?', 
      type: 'radio', 
      options: ['Ocak', 'Nisan', 'Ekim', 'Aralık'] 
    }
  ],
  psychological: [
    { 
      id: 'q1', 
      text: 'Bir seans sırasında öğrenciniz aniden fiziksel agresyon gösterdi ve size vurdu. İlk refleksiniz ne olur?', 
      type: 'radio', 
      options: [
        'Hemen seansı sonlandırıp öğrenciyi sınıftan çıkarırım.', 
        'Güvenli bir mesafe alıp sakinleşmesini bekler, kendimi ve onu korumaya alırım.', 
        'Yaptığının yanlış olduğunu sert bir ses tonuyla ifade ederim.', 
        'Hemen veliyi arayıp durumu bildiririm.'
      ] 
    },
    { 
      id: 'q2', 
      text: 'Çok yoğun bir günün sonunda, seans raporlarını yazarken bir hata yaptınız ve yönetimden sert bir uyarı aldınız. Tepkiniz ne olur?', 
      type: 'radio', 
      options: [
        'Yorgunluğumu bahane ederek hatayı savunurum.', 
        'Hatayı kabul eder, düzeltir ve süreci nasıl iyileştirebileceğimi düşünürüm.', 
        'Hata yapan tek kişinin ben olmadığımı belirtirim.', 
        'Demoralize olur ve iş motivasyonumu kaybederim.'
      ] 
    }
  ],
  professional: [
    { 
      id: 'q3', 
      text: 'Bir öğrencide gözlemlediğiniz "el çırpma" davranışının duyusal bir ihtiyaç mı yoksa ilgi çekmek için mi olduğunu anlamak için ne yaparsınız?', 
      type: 'radio', 
      options: [
        'Davranışın hemen öncesinde ve sonrasında ne olduğunu (ABC kaydı) analiz ederim.', 
        'Öğrenciye elini çırpmamasını söyler, tepkisini ölçerim.', 
        'Bunun her zaman duyusal bir ihtiyaç olduğunu varsayarım.', 
        'Velisinden evdeki durumu sormakla yetinirim.'
      ] 
    },
    { 
      id: 'q4', 
      text: 'Uzmanlık alanınızda en yetkin olduğunuz yöntemleri seçiniz (Birden fazla seçilebilir):', 
      type: 'checkbox', 
      options: ['ABA (UBA)', 'Floortime', 'Duyu Bütünleme', 'PECS', 'TEACCH', 'Etkileşimli Okuma'] 
    }
  ],
  social: [
    { 
      id: 'q5', 
      text: 'Veli, çocuğunun gelişim göstermediğini iddia ederek size öfkeyle bağırıyor. Yaklaşımınız hangisi olur?', 
      type: 'radio', 
      options: [
        'Ona bağırmaması gerektiğini, aksi takdirde görüşmeyi bitireceğimi söylerim.', 
        'Sakin kalıp dinler, somut veriler ve grafiklerle gelişim sürecini sakinlikle açıklarım.', 
        'Hatanın evdeki tutarsız eğitimden kaynaklandığını belirtirim.', 
        'Durumu hemen yönetime devredip odadan çıkarım.'
      ] 
    }
  ],
  development: [
    { 
      id: 'd1', 
      text: 'Kurumda yeni bir eğitim metodolojisi uygulanmaya başlandı ancak siz bu yöntemin eski yönteminiz kadar etkili olmadığını düşünüyorsunuz. Ne yaparsınız?', 
      type: 'radio', 
      options: [
        'Kendi bildiğim yöntemi seanslarda uygulamaya devam ederim.', 
        'Yeni yöntemi öğrenip uygular, sonuçları verilerle yönetimle paylaşırım.', 
        'Diğer meslektaşlarıma yöntemin verimsiz olduğunu anlatırım.', 
        'Yeni yöntemi hiç denemeden reddederim.'
      ] 
    },
    { 
      id: 'd2', 
      text: 'Mesleki gelişiminiz için önceliğiniz hangisidir?', 
      type: 'radio', 
      options: [
        'Sadece kurumun zorunlu tuttuğu eğitimlere katılmak.', 
        'Alanımla ilgili güncel makaleleri takip etmek ve yeni sertifikalar almak.', 
        'Yıllardır uyguladığım yöntemleri mükemmelleştirmek.', 
        'Daha çok idari konularda kendimi geliştirmek.'
      ] 
    },
    {
      id: 'd3',
      text: 'Bir mülakat veya süpervizyon sonucunda aldığınız yapıcı bir eleştiri sonrası gelişim planınızı nasıl oluşturursunuz?',
      type: 'radio',
      options: [
        'Geri bildirimi profesyonel bir gelişim fırsatı olarak görür, zayıf yanlarım üzerine somut bir eylem planı hazırlarım.',
        'Eleştirinin haksız olduğunu düşündüğüm noktaları ispatlamak için vakit kaybetmeden savunma yaparım.',
        'Geri bildirimi dinlerim ancak mevcut çalışma stilimi değiştirmekte genellikle zorlanırım.',
        'Moralim bozulur ve bu durumun iş performansıma olumsuz yansımasına engel olamam.'
      ]
    },
    {
      id: 'd4',
      text: 'Kendi öğrenme stilinizi (görsel, işitsel, deneyimsel vb.) nasıl tanımlarsınız ve yeni bir bilimsel tekniği öğrenirken bu farkındalığınızı süreci hızlandırmak için nasıl kullanırsınız?',
      type: 'textarea'
    },
    {
      id: 'd5',
      text: 'Son 6 ay içerisinde, kurumun zorunlu tuttuğu eğitimler dışında kendi inisiyatifinizle gerçekleştirdiğiniz bir mesleki gelişim faaliyetini (makale okuma, seminer, yeni bir araç öğrenme vb.) detaylandırınız.',
      type: 'textarea'
    }
  ],
  ethics: [
    { 
      id: 'e1', 
      text: 'Bir veli, gelişim raporundan "agresif davranışlar" kısmını silmenizi istiyor (yoksa kurumdan ayrılacak). Ne yaparsınız?', 
      type: 'radio', 
      options: [
        'Kurumun finansal çıkarları için raporu velinin istediği gibi düzenlerim.', 
        'Mesleki dürüstlük gereği raporu değiştirmem, nedenini veliye açıklarım.', 
        'Sadece o seferlik silerim ama bir daha yapmamasını söylerim.', 
        'Topu yönetime atar, kararı onlara bırakırım.'
      ] 
    },
    { 
      id: 'e2', 
      text: 'Çok yakın bir iş arkadaşınızın bir öğrenciye sabırsız ve aşağılayıcı davrandığını gördünüz. İlk adımınız nedir?', 
      type: 'radio', 
      options: [
        'Arkadaşlığımız bozulmasın diye görmezden gelirim.', 
        'Arkadaşımla uygun bir dille konuşur, davranışının sakıncalarını anlatırım.', 
        'Hiç konuşmadan direkt yönetime şikayet ederim.', 
        'Durumu başka arkadaşlarımla paylaşıp fikir alırım.'
      ] 
    },
    { 
      id: 'e3', 
      text: 'Sosyo-ekonomik durumu kısıtlı bir veli, size maddi değeri yüksek bir hediye getirdi ve almazsanız çok üzüleceğini söyledi.', 
      type: 'radio', 
      options: [
        'Hediyeyi kabul eder, veliye teşekkür ederim.', 
        'Kurumsal etik kuralları nazikçe açıklar, hediyeyi kabul edemeyeceğimi söylerim.', 
        'Hediyeyi alır, sonra gizlice kuruma bağışlarım.', 
        'Hediyeyi sert bir dille geri çeviririm.'
      ] 
    },
    { 
      id: 'e4', 
      text: 'Kurumun yeni bir politikası öğrencilerin seans kalitesini düşürüyor. Hiyerarşik süreçte nasıl ilerlersiniz?', 
      type: 'radio', 
      options: [
        'Sessiz kalır, işimi yapmaya devam ederim.', 
        'Somut gözlemlerimi ve çözüm önerilerimi içeren bir raporla amirime başvururum.', 
        'Veli grubunda bu durumu eleştirerek baskı oluştururum.', 
        'Hemen istifa etmeyi düşünürüm.'
      ] 
    }
  ]
};
