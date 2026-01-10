
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

export const MOCK_QUESTIONS = {
  academic_proficiency: [
    // --- AKADEMİK İÇERİK SORULARI (1-4 SINIF) ---
    {
      id: 'math_logic_1',
      text: 'Matematik (1-2. Sınıf): "15 - 7 = ?" işlemini parmak hesabı dışında yapamayan ve onluk bozma mantığını kavrayamayan bir öğrenciye "Onluk Bloklar" dışında hangi somutlaştırma tekniğini kullanırsınız?',
      type: 'textarea'
    },
    {
      id: 'turkish_literacy_1',
      text: 'Türkçe (2-3. Sınıf): Bir metnin "Ana Fikri" ile "Konusu" arasındaki farkı anlamakta zorlanan dislektik bir öğrenciye bu ayrımı en basit hangi görselleştirme tekniğiyle anlatırsınız?',
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
      text: 'Hayat Bilgisi (1-4. Sınıf): Geri dönüşüm (Cam, Kağıt, Plastik) kavramını zihinsel yetersizliği olan bir öğrenciye öğretirken hangi duyusal yöntemi önceliklendirirsiniz?',
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
      text: 'Matematik (3. Sınıf): 348 sayısında 4 rakamının "basamak değeri" ile "sayı değeri" arasındaki farkı anlamayan öğrenciye "para modelleri" (100 TL, 10 TL, 1 TL) üzerinden nasıl bir müdahale yaparsınız?',
      type: 'textarea'
    },
    {
      id: 'turkish_context_clues',
      text: 'Türkçe (4. Sınıf): "Yüz" kelimesinin eş sesli (sayı, çehre, yüzmek) anlamlarını ayıramayan bir öğrenciye "Bağlamdan Anlam Çıkarma" becerisini kazandırmak için hangi yöntemi seçersiniz?',
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
      text: 'Hayat Bilgisi (2-3. Sınıf): "İstek" ve "İhtiyaç" kavramlarını sürekli karıştıran ve dürtü kontrolü zayıf bir öğrenciye "Alışveriş Listesi" oyununu nasıl adapte edersiniz?',
      type: 'textarea'
    },
    {
      id: 'general_culture_ataturk',
      text: 'Genel Kültür / Sosyal Bilgiler: Kurtuluş Savaşı ve Atatürk İlkeleri gibi soyut tarihsel kavramları, zaman algısı gelişmemiş bir öğrenciye "Zaman Şeridi" (Timeline) üzerinde nasıl somutlaştırırsınız?',
      type: 'textarea'
    },
    
    // --- ÖĞRETİM METODOLOJİSİ VE SUNUM BECERİLERİ SORULARI ---
    {
      id: 'pedagogy_scaffolding',
      text: 'Dersi Sunma: Karmaşık bir yönergeyi (Örn: "Kitabının 25. sayfasını aç, 3. soruyu oku ve altını çiz") işlemleme hızı düşük bir öğrenciye sunarken izleyeceğiniz "Yönerge Analizi" basamakları nelerdir?',
      type: 'textarea'
    },
    {
      id: 'pedagogy_multisensory',
      text: 'Öğretim Stratejisi: "Okuma-Yazmaya Hazırlık" aşamasında sesleri (fonemleri) hissettirirken "VAKT" (Görsel-İşitsel-Kinestetik-Dokunsal) yöntemini bir ders saati içinde nasıl kurgularsınız?',
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
      text: 'Hata Ayıklama: Bir matematik kavramını (Örn: Ritmik sayma) "Hatasız Öğretim" (Errorless Learning) yöntemiyle sunarken, öğrencinin yanlış yapmasına fırsat vermeden nasıl bir ipucu (Prompt) hiyerarşisi izlersiniz?',
      type: 'textarea'
    },
    {
      id: 'pedagogy_abstraction',
      text: 'Somuttan Soyuta Geçiş: Kesirler (1/2, 1/4) konusunu anlatırken; nesne (elma), resim (daire grafiği) ve sembol (1/2 yazısı) arasındaki geçişte öğrencinin takılmaması için hangi "köprü kurma" stratejisini kullanırsınız?',
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
      text: 'Dersi Başlatma ve Dikkat: Akademik olarak zorlandığı için dersi reddeden bir öğrenciye, 4. sınıf sosyal bilgiler konusunu "İlgi Temelli Öğretim" ile nasıl cazip hale getirirsiniz?',
      type: 'textarea'
    }
  ],
  logic_literacy: [
    { 
      id: 'prioritization_1', 
      text: 'Yoğun bir günde: 1) Bir öğrenci krizde, 2) Bir veli odanızda ağlıyor, 3) Kurum müdürü acil rapor bekliyor. Sadece birine tam odaklanabilirsiniz. Hangi sırayla "ihmal" edersiniz?', 
      type: 'radio', 
      options: [
        'Müdürü (İdari iş bekleyebilir).', 
        'Veliyi (Duygusal destek ertelenebilir).', 
        'Öğrenciyi (Güvenliyse kısa süre bekletilebilir).', 
        'Hepsini aynı anda yönetirim (Performans maskesi)'
      ] 
    },
    {
      id: 'method_clash',
      text: 'Uyguladığınız teknik (ör: ABA) çocukta direnç yarattı ama aile bu tekniği kesin istiyor. Yaklaşımınız?',
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
      text: 'Seans sırasında çocuğun güvenliğini (hafifçe) riske atan bir hata yaptınız ama kimse görmedi. Tavrınız?',
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
      text: 'Bir öğrenci size fiziksel zarar verdi (ısırık/tekme). O anki ilk iç sesiniz hangisi olur?',
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
      text: 'Meslek hayatınızda "başarısız oldum" dediğiniz bir vakayı ve bu süreçteki hatalarınızı dürüstçe analiz edin.',
      type: 'textarea'
    },
    {
      id: 'scientific_update',
      text: 'Son bir yıl içerisinde kendi branşınızda okuduğunuz en önemli bilimsel makale veya teknik gelişme nedir? Pratiğinizi nasıl değiştirdi?',
      type: 'textarea'
    }
  ]
};
