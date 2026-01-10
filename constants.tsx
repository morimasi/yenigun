
import { FormStep } from './types';

export const FORM_STEPS: FormStep[] = [
  { 
    id: 'personal', 
    title: 'Akademik Kimlik', 
    description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz. Lütfen sadece klinik deneyimlerinize odaklanın.' 
  },
  { 
    id: 'academic_proficiency', 
    title: 'İlkokul Akademik Yetkinlik', 
    description: '1-4. Sınıf seviyesindeki temel müfredat bilgisi ve bu bilginin özel eğitimde aktarım stratejileri.' 
  },
  { id: 'logic_literacy', title: 'Operasyonel Zeka', description: 'Karmaşık kriz anlarında mantıksal önceliklendirme kapasitesi.' },
  { id: 'professional_cases', title: 'Etik İkilemler', description: 'Profesyonel ahlak ile kurumsal gerçeklik arasındaki denge.' },
  { id: 'psychological_integrity', title: 'Psikolojik Sınırlar', description: 'Tükenmişlik ve duygusal düzenleme analizi.' },
  { id: 'development', title: 'Özeleştiri & Vizyon', description: 'Mesleki hataların analizi ve gelişim dürüstlüğü.' }
];

export const CERTIFICATION_LIST = [
  "ABA (Uygulamalı Davranış Analizi)",
  "PECS (Resim Değiş Tokuşuna Dayalı İletişim Sistemi)",
  "DIR Floortime",
  "Denver II Gelişimsel Tarama Testi",
  "WISC-IV / WISC-V Zeka Testleri",
  "ETEÇOM (Etkileşim Temelli Erken Çocuklukta Müdahale)",
  "Prep (Disleksi Müdahale Programı)",
  "GOBDO-2-TV (Otistik Bozukluk Derecelendirme Ölçeği)",
  "Pass Teorisi ve CAS Testi",
  "Duyu Bütünleme Eğitimi (Sensory Integration)",
  "Artikülasyon ve Fonolojik Bozukluklar Eğitimi",
  "Disleksi Eğitmenliği Sertifikası",
  "Akıl ve Zeka Oyunları Eğitmenliği",
  "Robotik Kodlama (Özel Eğitim Uyarlamalı)",
  "Özel Eğitimde Drama Eğitmenliği",
  "Montessori Eğitmenliği",
  "Oyun Terapisi"
];

export const MOCK_QUESTIONS = {
  academic_proficiency: [
    {
      id: 'math_logic_1',
      text: 'Matematik (1-2. Sınıf): "15 - 7 = ?" işlemini onluk bozma mantığını kavrayamayan bir öğrenciye hangi stratejiyle öğretirsiniz?',
      type: 'radio',
      options: [
        'Geriye ritmik sayma yaptırarak (Parmak hesabı pekiştirme).',
        '10\'a tamamlama stratejisi: "7\'yi 10\'a tamamlamak için kaç lazım? 15\'ten önce 5 çıkarıp 10\'a ulaşalım" (Parçalama yöntemi).',
        'Sadece sayı doğrusu üzerinde zıplayarak (Görsel ezber).',
        'İşlemi alt alta yazıp onluk bozmayı kural olarak ezberleterek.'
      ]
    },
    {
      id: 'turkish_literacy_1',
      text: 'Türkçe (2-3. Sınıf): Bir metnin "Ana Fikri" ile "Konusu" arasındaki farkı anlamakta zorlanan dislektik bir öğrenciye bu ayrımı nasıl anlatırsınız?',
      type: 'radio',
      options: [
        'Zihin haritası kullanarak (Merkez: Konu, Oklar: Detaylar).',
        'Tanım ezberleterek (Sürekli tekrar yöntemi).',
        'Metni beş kez yüksek sesle okutarak.',
        'Önceki yılların sınav sorularını çözdürerek.'
      ]
    },
    {
      id: 'social_science_1',
      text: 'Hayat Bilgisi (1-4. Sınıf): Geri dönüşüm kavramını zihinsel yetersizliği olan bir öğrenciye öğretirken hangi duyusal yöntemi önceliklendirirsiniz?',
      type: 'radio',
      options: [
        'Sadece video izleterek görsel pekiştirme.',
        'Dokunarak ayrıştırma (Gerçek materyallerle istasyon çalışması).',
        'Konuyla ilgili şarkı besteleyerek işitsel bellek oluşturma.',
        'Ders kitabındaki boyama etkinliklerini yaparak.'
      ]
    },
    {
      id: 'math_place_value',
      text: 'Matematik (3. Sınıf): 348 sayısında 4 rakamının "basamak değeri" (40) ile "sayı değeri" (4) arasındaki farkı en iyi nasıl somutlaştırırsınız?',
      type: 'radio',
      options: [
        'Para modelleri (4 tane 10 TL ile 4 tane 1 TL karşılaştırması).',
        'Rakamların altına ok çıkarıp değerlerini yazdırarak.',
        'Abaküs üzerinde boncuk saydırarak.',
        'Sayıyı defalarca basamak tablosuna yerleştirerek.'
      ]
    },
    {
      id: 'turkish_context_clues',
      text: 'Türkçe (4. Sınıf): "Yüz" kelimesinin eş sesli anlamlarını ayıramayan bir öğrenciye hangi yöntemi seçersiniz?',
      type: 'radio',
      options: [
        'Cümle kartları ve görsel eşleme (Görsel Destekli Bağlam).',
        'Sözlükten tanımları defterine yazdırma.',
        'Kelimeleri onar kez cümle içinde kullandırtma.',
        'Sadece test soruları üzerinden pekiştirme.'
      ]
    },
    {
      id: 'social_economic_literacy',
      text: 'Hayat Bilgisi (2-3. Sınıf): "İstek" ve "İhtiyaç" kavramlarını sürekli karıştıran bir öğrenciye "Alışveriş Listesi" oyununu nasıl adapte edersiniz?',
      type: 'radio',
      options: [
        'Önce hayatta kalmak için gerekenleri (Su, yemek) işaretleyip geri kalanları eleyerek.',
        'İstediği her şeyi sepete attırıp sonra parası yetmeyince çıkarttırarak.',
        'Kavramların sözlük anlamlarını ezberleterek.',
        'Market broşürlerinden beğendiklerini kestirerek.'
      ]
    },
    {
      id: 'general_culture_ataturk',
      text: 'Genel Kültür / Sosyal Bilgiler: Zaman algısı gelişmemiş bir öğrenciye tarihsel olayları nasıl somutlaştırırsınız?',
      type: 'radio',
      options: [
        'Olayları resimli kartlarla bir ipin üzerine kronolojik asarak (Zaman Şeridi).',
        'Sadece tarihleri ezberletip sınav yaparak.',
        'Olayların uzun metinlerini okutarak.',
        'Konuyla ilgili belgesel izleterek.'
      ]
    },
    {
      id: 'pedagogy_scaffolding',
      text: 'Dersi Sunma: Karmaşık bir yönergeyi ("Kitabının 25. sayfasını aç, 3. soruyu oku") işlemleme hızı düşük bir öğrenciye sunarken hangisini yaparsınız?',
      type: 'radio',
      options: [
        'Yönergeyi tek tek parçalara bölüp her adım sonrası onay alarak (Chaining).',
        'Yönergeyi daha yüksek sesle tekrarlayarak.',
        'Yönergeyi tahtaya yazıp beklemesini isteyerek.',
        'Öğrencinin yerine işlemi yaparak zaman kazanmak.'
      ]
    },
    {
      id: 'pedagogy_multisensory',
      text: 'Öğretim Stratejisi: "Okuma-Yazmaya Hazırlık" aşamasında "VAKT" yöntemini nasıl kurgularsınız?',
      type: 'radio',
      options: [
        'Sesi kum havuzunda yazdırma ve eş zamanlı telaffuz (Çok duyulu yaklaşım).',
        'Sadece akıllı tahtadan harfin yazılışını izletme.',
        'Harfin çalışma sayfasındaki noktalarını birleştirme.',
        'Harfi bakarak deftere beş satır kopyalama.'
      ]
    },
    {
      id: 'pedagogy_errorless',
      text: 'Hata Ayıklama: Bir matematik kavramını "Hatasız Öğretim" (Errorless Learning) ile sunarken ipucu (Prompt) hiyerarşiniz nasıl olmalıdır?',
      type: 'radio',
      options: [
        'En yoğun ipucundan (Fiziksel) başlayıp ipucunu kademeli olarak silikleştirerek (Most-to-Least).',
        'Öğrencinin hata yapmasını bekleyip sonra düzeltme vererek.',
        'Hiç ipucu vermeden öğrencinin kendi kendine bulmasını sağlayarak.',
        'Sadece sözel ipucu kullanarak.'
      ]
    },
    {
      id: 'pedagogy_abstraction',
      text: 'Somuttan Soyuta Geçiş: Kesirler (1/2, 1/4) konusunu anlatırken hangi köprü stratejisini kullanırsınız?',
      type: 'radio',
      options: [
        'CRA (Concrete-Representational-Abstract) modelini sırasıyla uygulama.',
        'Önce sembolü ezberletip sonra somut örneğe geçme.',
        'Sadece somut materyalde kalıp sembole hiç geçmeme.',
        'Doğrudan test çözdürerek pratik yapma.'
      ]
    },
    {
      id: 'pedagogy_motivation',
      text: 'Dersi Başlatma ve Dikkat: Akademik olarak zorlandığı için dersi reddeden bir öğrenciye nasıl yaklaşırsınız?',
      type: 'radio',
      options: [
        'Öğrencinin özel ilgisini (örn: arabalar) akademik konuya (örn: matematik) entegre ederek.',
        'Dersi yapmazsa molaya çıkamayacağını söyleyerek (Ceza odaklı).',
        'Öğrenci hazır olana kadar dersi iptal ederek.',
        'Zorla masada oturtup otorite kurarak.'
      ]
    }
  ],
  logic_literacy: [
    { 
      id: 'prioritization_1', 
      text: 'Yoğun bir günde öncelik sıralamanız nasıl olur?', 
      type: 'radio', 
      options: [
        '1) Krizdeki öğrenci, 2) Veli desteği, 3) İdari raporlar.', 
        '1) İdari raporlar, 2) Krizdeki öğrenci, 3) Veli desteği.', 
        '1) Veli desteği, 2) İdari raporlar, 3) Krizdeki öğrenci.', 
        'Hepsini aynı anda hatasız yönetirim.'
      ] 
    },
    {
      id: 'method_clash',
      text: 'Uyguladığınız teknik çocukta direnç yarattı ama aile kesin istiyor. Yaklaşımınız?',
      type: 'radio',
      options: [
        'Ailenin isteğine uyarım; sonuçta ödemeyi onlar yapıyor.',
        'Tekniği bırakırım ve bildiğim gibi yaparım (Gizli inisiyatif).',
        'Aileye verilerle tekniğin zararlarını anlatır, alternatif bir yol haritası sunarım.',
        'Kurum yönetimine durumu bildirip onların karar vermesini beklerim.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'clinical_error',
      text: 'Seans sırasında çocuğun güvenliğini hafifçe riske atan bir hata yaptınız. Tavrınız?',
      type: 'radio',
      options: [
        'Gelecekte daha dikkatli olurum, bir kerelik hatayı büyütmeye gerek yok.',
        'Sadece kurum müdürüne söylerim, veliyle güvenim bozulmasın.',
        'Derhal hem aileye hem yönetime raporlarım; etik dürüstlük her şeydir.',
        'Çocuğun o günkü huysuzluğunu bahane ederek olayı yumuşatırım.'
      ]
    }
  ],
  psychological_integrity: [
    {
      id: 'aggression_response',
      text: 'Bir öğrenci size fiziksel zarar verdi. O anki ilk iç sesiniz hangisi olur?',
      type: 'radio',
      options: [
        '"Neden daha iyi önlem alamadım?" (Aşırı suçluluk).',
        '"Bu iş için yeterli maaş almıyorum" (Tükenmişlik belirtisi).',
        '"Bu çocukla bağım koptu, bir başkası devralmalı" (Kaçınma).',
        '"Bu davranışın işlevini bulup müdahale planımı güncellemeliyim" (Klinik soğukkanlılık).'
      ]
    }
  ],
  development: [
    {
      id: 'failure_analysis',
      text: 'Meslek hayatınızda "başarısız oldum" dediğiniz bir vakada temel hatanız neydi?',
      type: 'radio',
      options: [
        'Yanlış değerlendirme/tanılama sonucu yanlış hedef seçimi.',
        'Aile ile iş birliği kuramamış olmak.',
        'Kendi duygusal sınırlarımı koruyamayıp vaka ile aşırı özdeşim kurmak.',
        'Hata yapmadım, sistem/şartlar başarısızlığa neden oldu.'
      ]
    },
    {
      id: 'scientific_update',
      text: 'Bilimsel gelişmeleri takip etme yönteminiz hangisidir?',
      type: 'radio',
      options: [
        'Hakemli dergilerdeki (JABA, Autism Research vb.) makaleleri düzenli okumak.',
        'Sadece sosyal medyadaki popüler eğitimci videolarını izlemek.',
        'Sadece kurum içi zorunlu eğitimlere katılmak.',
        'Üniversite bilgilerimin yeterli olduğunu düşünüyorum.'
      ]
    }
  ]
};
