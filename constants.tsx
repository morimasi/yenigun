
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const CERTIFICATION_CATEGORIES = [
  { id: 'AUTISM_SPECTRUM', label: 'Otizm Spektrum Bozukluğu (OSB)' },
  { id: 'LEARNING_DISABILITIES', label: 'Özel Öğrenme Güçlüğü (ÖÖG)' },
  { id: 'INTELLECTUAL_COGNITIVE', label: 'Zihin Engelliler & Bilişsel' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi' },
  { id: 'ACADEMIC_SKILLS', label: 'Okuma Yazma & Matematik' },
  { id: 'PSYCHOLOGY_GUIDANCE', label: 'Rehberlik & Psikoloji' }
];

export const CERTIFICATIONS: Certification[] = [
  // --- OTİZM SPEKTRUM BOZUKLUĞU (OSB) ---
  {
    id: 'dir_floortime',
    label: 'DIR Floortime (201/202/203)',
    description: 'İlişki Temelli Nöro-gelişimsel Müdahale Modeli.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_dir_1', category: 'technicalExpertise', type: 'radio',
        text: 'DIR Floortime modelinde "D" (Developmental) bileşenindeki 4. basamak nedir?',
        weightedOptions: [
          { label: 'Sosyal problem çözme ve ortak dikkat.', weights: { clinical: 1.0 }, analysisInsight: 'Kavramsal doğruluk.' },
          { label: 'Sadece motor planlama.', weights: { clinical: 0.2 }, analysisInsight: 'Dar kapsamlı bilgi.' },
          { label: 'Akademik becerilerin öğretilmesi.', weights: { clinical: 0.0 }, analysisInsight: 'Model dışı yaklaşım.' },
          { label: 'Öfke kontrolü.', weights: { clinical: 0.3 }, analysisInsight: 'Yüzeysel yorum.' }
        ]
      },
      {
        id: 'vq_dir_2', category: 'technicalExpertise', type: 'radio',
        text: 'DIR modelinde "Bireysel Farklılıklar" (I) kapsamında hangisi birincil önceliktir?',
        weightedOptions: [
          { label: 'Çocuğun duyusal profilinin ve işlemleme süreçlerinin analizi.', weights: { clinical: 1.0 }, analysisInsight: 'Derin analiz.' },
          { label: 'Çocuğun IQ skorunun belirlenmesi.', weights: { clinical: 0.1 }, analysisInsight: 'Tanısal yanılgı.' },
          { label: 'Çocuğun kaç kelime konuştuğu.', weights: { clinical: 0.4 }, analysisInsight: 'Sığ değerlendirme.' },
          { label: 'Ailenin ekonomik durumu.', weights: { clinical: 0.0 }, analysisInsight: 'İlgisiz veri.' }
        ]
      },
      {
        id: 'vq_dir_3', category: 'technicalExpertise', type: 'radio',
        text: 'Seans sırasında çocuğun stereotipik davranışına (örn: el çırpma) Floortime yaklaşımı ne olmalıdır?',
        weightedOptions: [
          { label: 'Davranışa bir anlam yükleyip etkileşim döngüsüne (Circle of Communication) dahil etmek.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik ustalık.' },
          { label: 'Davranışı derhal söndürmek (Extinction).', weights: { clinical: 0.0 }, analysisInsight: 'Zıt ekol (Davranışçı) hatası.' },
          { label: 'Görmezden gelip masa başına çağırmak.', weights: { clinical: 0.1 }, analysisInsight: 'İlişkisel kopukluk.' },
          { label: 'Eline bir nesne vererek durdurmak.', weights: { clinical: 0.3 }, analysisInsight: 'Oyalama odaklı.' }
        ]
      },
      {
        id: 'vq_dir_4', category: 'technicalExpertise', type: 'radio',
        text: 'Floortime\'da "Liderliği Takip Etmek" (Following the Lead) ne anlama gelir?',
        weightedOptions: [
          { label: 'Çocuğun ilgisini kullanarak duygusal bir bağ ve etkileşim köprüsü kurmak.', weights: { clinical: 1.0 }, analysisInsight: 'Metodik sadakat.' },
          { label: 'Çocuğun her istediğini sınırsızca yapmasına izin vermek.', weights: { clinical: 0.2 }, analysisInsight: 'Disiplin hatası.' },
          { label: 'Çocuğun arkasından yürümek.', weights: { clinical: 0.0 }, analysisInsight: 'Sözlük anlamı hatası.' },
          { label: 'Sadece çocuğun seçtiği oyuncağı kullanmak.', weights: { clinical: 0.5 }, analysisInsight: 'Kısıtlı yorum.' }
        ]
      },
      {
        id: 'vq_dir_5', category: 'technicalExpertise', type: 'radio',
        text: 'Kritik Seviye: Duyusal olarak "Hipo-reaktif" olan bir çocukla Floortime seansı nasıl bir enerji gerektirir?',
        weightedOptions: [
          { label: 'Yüksek enerjili, duyusal uyaranı artıran ve dikkat çekici bir stil.', weights: { clinical: 1.0 }, analysisInsight: 'Duyusal regülasyon bilgisi.' },
          { label: 'Çok sessiz ve sakin bir stil.', weights: { clinical: 0.0 }, analysisInsight: 'Zıt müdahale hatası.' },
          { label: 'Sadece fiziksel temas içeren bir stil.', weights: { clinical: 0.4 }, analysisInsight: 'Tek boyutlu bakış.' },
          { label: 'Standart akademik bir stil.', weights: { clinical: 0.1 }, analysisInsight: 'Uyumsuz yaklaşım.' }
        ]
      }
    ]
  },
  {
    id: 'pecs_pyramid',
    label: 'PECS (Pyramid Educational Consultants)',
    description: 'Resim Değişimiyle İletişim Sistemi resmi eğitimi.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_pecs_1', category: 'technicalExpertise', type: 'radio',
        text: 'PECS Faz 1\'in birincil amacı nedir?',
        weightedOptions: [
          { label: 'Fiziksel olarak bir resmi uzatarak iletişim başlatmayı öğretmek.', weights: { clinical: 1.0 }, analysisInsight: 'Temel bilgi.' },
          { label: 'Resimler arasından ayrım (discrimination) yapmak.', weights: { clinical: 0.1 }, analysisInsight: 'Faz hatası (Faz 3 konusudur).' },
          { label: 'Cümle kurmayı öğretmek.', weights: { clinical: 0.0 }, analysisInsight: 'Hiyerarşik hata.' },
          { label: 'Konuşmaya başlamasını sağlamak.', weights: { clinical: 0.3 }, analysisInsight: 'Yanlış hedefleme.' }
        ]
      },
      {
        id: 'vq_pecs_2', category: 'technicalExpertise', type: 'radio',
        text: 'Faz 3A ve 3B arasındaki temel fark nedir?',
        weightedOptions: [
          { label: 'Yüksek tercih edilen nesne ile nötr nesne arasındaki ayrım (3A) vs. İki tercih edilen nesne (3B).', weights: { clinical: 1.0 }, analysisInsight: 'İleri düzey uygulama bilgisi.' },
          { label: '3A tek resim, 3B çift resimdir.', weights: { clinical: 0.4 }, analysisInsight: 'Yüzeysel bilgi.' },
          { label: 'Biri evde, biri okulda yapılır.', weights: { clinical: 0.0 }, analysisInsight: 'Yanlış yorum.' },
          { label: '3B\'de sadece sözel ipucu verilir.', weights: { clinical: 0.2 }, analysisInsight: 'Metodik hata.' }
        ]
      },
      {
        id: 'vq_pecs_3', category: 'technicalExpertise', type: 'radio',
        text: 'PECS uygulamasında "İletişim Ortağı"nın (Communication Partner) çocuk resim uzattığındaki ilk tepkisi ne olmalıdır?',
        weightedOptions: [
          { label: 'Anında nesneyi teslim etmek ve pekiştirmek.', weights: { clinical: 1.0 }, analysisInsight: 'Hızlı pekiştirme.' },
          { label: '"Aferin" diyerek 5 saniye beklemek.', weights: { clinical: 0.1 }, analysisInsight: 'Gecikmiş pekiştirme riski.' },
          { label: '"Bunu mu istiyorsun?" diye sormak.', weights: { clinical: 0.0 }, analysisInsight: 'Gereksiz sözel yük.' },
          { label: 'Resmin adını söylemesini beklemek.', weights: { clinical: 0.3 }, analysisInsight: 'Metot dışı zorlama.' }
        ]
      },
      {
        id: 'vq_pecs_4', category: 'technicalExpertise', type: 'radio',
        text: 'PECS Faz 4\'te kullanılan "Cümle Çubuğu" (Sentence Strip) ne işe yarar?',
        weightedOptions: [
          { label: '"İstiyorum" gibi kalıplarla çoklu sembol kullanımını sağlar.', weights: { clinical: 1.0 }, analysisInsight: 'Yapısal hakimiyet.' },
          { label: 'Sadece resimlerin kaybolmasını önler.', weights: { clinical: 0.0 }, analysisInsight: 'Yanlış yorum.' },
          { label: 'Çocuğun okuma yazma öğrenmesini sağlar.', weights: { clinical: 0.2 }, analysisInsight: 'Abartılı beklenti.' },
          { label: 'Öğretmenin not alması içindir.', weights: { clinical: 0.1 }, analysisInsight: 'Absürt cevap.' }
        ]
      },
      {
        id: 'vq_pecs_5', category: 'technicalExpertise', type: 'radio',
        text: 'PECS\'in çocukta konuşmayı engellediği yönündeki iddialara bilimsel yanıtınız nedir?',
        weightedOptions: [
          { label: 'Literatür, PECS\'in sözel üretimi desteklediğini ve fonksiyonel iletişimi artırdığını gösterir.', weights: { clinical: 1.0 }, analysisInsight: 'Bilimsel dürüstlük.' },
          { label: 'Evet, maalesef konuşmayı tembelleştirir.', weights: { clinical: -1.0 }, analysisInsight: 'Kritik bilgi eksikliği.' },
          { label: 'Sadece zihin engelli olmayanlarda konuşmayı artırır.', weights: { clinical: 0.2 }, analysisInsight: 'Ayrımcı/Hatalı.' },
          { label: 'Konuşmak önemli değildir, resim yeterlidir.', weights: { clinical: 0.0 }, analysisInsight: 'Klinik vizyon hatası.' }
        ]
      }
    ]
  },

  // --- ÖZEL ÖĞRENME GÜÇLÜĞÜ (ÖÖG) ---
  {
    id: 'orton_gillingham',
    label: 'Orton-Gillingham Approach',
    description: 'Disleksi için Çok Duyulu (Multisensory) Dil Eğitimi.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_og_1', category: 'technicalExpertise', type: 'radio',
        text: 'Orton-Gillingham yaklaşımının temel sac ayağı nedir?',
        weightedOptions: [
          { label: 'Çok duyulu (Görsel-İşitsel-Kinestetik-Dokunsal) ve yapılandırılmış olması.', weights: { clinical: 1.0 }, analysisInsight: 'Temel prensip hakimiyeti.' },
          { label: 'Sadece hızlı okumaya odaklanması.', weights: { clinical: 0.1 }, analysisInsight: 'Dar bakış.' },
          { label: 'Tamamen bilgisayar tabanlı olması.', weights: { clinical: 0.0 }, analysisInsight: 'Teknik hata.' },
          { label: 'Öğrencinin serbest okuma yapması.', weights: { clinical: 0.2 }, analysisInsight: 'Yapılandırılmamış hata.' }
        ]
      },
      {
        id: 'vq_og_2', category: 'technicalExpertise', type: 'radio',
        text: 'Bu yaklaşımda "Fonemik Farkındalık" neden en baştadır?',
        weightedOptions: [
          { label: 'Dildeki sesleri ayırt etme yetisinin okumanın ön koşulu olduğu için.', weights: { clinical: 1.0 }, analysisInsight: 'Dilbilimsel bilinç.' },
          { label: 'Harflerin şekillerini ezberletmek için.', weights: { clinical: 0.1 }, analysisInsight: 'Kavram hatası.' },
          { label: 'Çocuğun güzel yazması için.', weights: { clinical: 0.0 }, analysisInsight: 'İlgisiz alan.' },
          { label: 'Kelime anlamını bilmek için.', weights: { clinical: 0.4 }, analysisInsight: 'Semantik-Fonetik karışıklığı.' }
        ]
      }
    ]
  },
  {
    id: 'disrek_national',
    label: 'DİSREK (Ulusal Disleksi Programı)',
    description: 'Türkiye Disleksi Vakfı ve yerel akreditasyon standartları.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_disrek_1', category: 'technicalExpertise', type: 'radio',
        text: 'DİSREK müdahale programında "Görsel İşlemleme" çalışmaları hangisini kapsar?',
        weightedOptions: [
          { label: 'Harf karıştırmayı önlemek için şekil-zemin ve görsel hafıza egzersizlerini.', weights: { clinical: 1.0 }, analysisInsight: 'Program bilgisi.' },
          { label: 'Sadece gözlük kullanımını.', weights: { clinical: 0.0 }, analysisInsight: 'Tıbbi yanılgı.' },
          { label: 'Resim çizdirme tekniklerini.', weights: { clinical: 0.2 }, analysisInsight: 'Sığ yaklaşım.' },
          { label: 'Sadece renkli cam kullanımı.', weights: { clinical: 0.1 }, analysisInsight: 'Tartışmalı metot.' }
        ]
      }
    ]
  },

  // --- BİLİŞSEL VE ZİHİNSEL (COGNITIVE) ---
  {
    id: 'wisc_v_test',
    label: 'WISC-V Uygulayıcı (Türk Psikologlar Derneği)',
    description: 'Wechsler Çocuklar için Zeka Ölçeği - 5. Sürüm.',
    category: 'INTELLECTUAL_COGNITIVE',
    verificationQuestions: [
      {
        id: 'vq_wisc_1', category: 'technicalExpertise', type: 'radio',
        text: 'WISC-V\'de "Akıcı Akıl Yürütme" (Fluid Reasoning) endeksi neyi ölçer?',
        weightedOptions: [
          { label: 'Soyut problemleri çözme ve kavramlar arası ilişki kurma yetisini.', weights: { clinical: 1.0 }, analysisInsight: 'Test terminolojisi.' },
          { label: 'Sadece kelime dağarcığını.', weights: { clinical: 0.1 }, analysisInsight: 'VCI ile karıştırma.' },
          { label: 'Elin ne kadar hızlı çalıştığını.', weights: { clinical: 0.1 }, analysisInsight: 'PSI ile karıştırma.' },
          { label: 'Duyulanları akılda tutmayı.', weights: { clinical: 0.2 }, analysisInsight: 'WMI ile karıştırma.' }
        ]
      },
      {
        id: 'vq_wisc_2', category: 'technicalExpertise', type: 'radio',
        text: 'Test sırasında çocuk "Ben bunu yapamam" diyerek reddederse standart prosedür nedir?',
        weightedOptions: [
          { label: 'Teşvik et (prompt), ancak yönerge dışına çıkmadan bir sonraki maddeye geç veya testi durdur (kurallara göre).', weights: { clinical: 1.0 }, analysisInsight: 'Etik/Teknik uygulama.' },
          { label: 'Cevabı kulağına fısılda.', weights: { clinical: -1.0 }, analysisInsight: 'Kritik test ihlali.' },
          { label: 'Çocuğa kız ve yapması için zorla.', weights: { clinical: 0.0 }, analysisInsight: 'Pedagojik risk.' },
          { label: 'Veliyi içeri çağırıp yardım iste.', weights: { clinical: 0.0 }, analysisInsight: 'Standart dışı uygulama.' }
        ]
      }
    ]
  },

  // --- DİL VE KONUŞMA (DKT) ---
  {
    id: 'prompt_technique',
    label: 'PROMPT (Level 1/2)',
    description: 'Oral Müsküler Fonetik Hedeflerin Yeniden Yapılandırılması.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: [
      {
        id: 'vq_prompt_1', category: 'technicalExpertise', type: 'radio',
        text: 'PROMPT tekniğinde "Taktil-Kinestetik" girdinin temel amacı nedir?',
        weightedOptions: [
          { label: 'Artikülatörlerin (dil, dudak vb.) motor kontrolünü ve yerleşimini fiziksel olarak desteklemek.', weights: { clinical: 1.0 }, analysisInsight: 'Metot hakimiyeti.' },
          { label: 'Çocuğun boğazını rahatlatmak.', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış tanım.' },
          { label: 'Konuşma yerine masaj yapmak.', weights: { clinical: 0.1 }, analysisInsight: 'Hatalı uygulama.' },
          { label: 'Çocuğu susturmak.', weights: { clinical: 0.0 }, analysisInsight: 'Absürt cevap.' }
        ]
      }
    ]
  },

  // --- ERGOTERAPİ & FİZYOTERAPİ (OT/PT) ---
  {
    id: 'bobath_ndt',
    label: 'Bobath / NDT (Neuro-Developmental Treatment)',
    description: 'Serebral Palsi ve Nörolojik Bozukluklar için Sertifikalı Eğitim.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_bobath_1', category: 'technicalExpertise', type: 'radio',
        text: 'Bobath konseptinde "Key Points of Control" (Kontrolün Kilit Noktaları) neyi hedefler?',
        weightedOptions: [
          { label: 'Anormal tonusu inhibe edip normal hareket paternlerini fasilite etmeyi.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik uzmanlık.' },
          { label: 'Çocuğu masaya bağlamayı.', weights: { clinical: 0.0 }, analysisInsight: 'Etik hata.' },
          { label: 'Sadece kas gücünü artırmayı.', weights: { clinical: 0.4 }, analysisInsight: 'Eksik bakış.' },
          { label: 'Kemik kırıklarını iyileştirmeyi.', weights: { clinical: 0.0 }, analysisInsight: 'Tıbbi bilgi hatası.' }
        ]
      }
    ]
  },
  {
    id: 'therasuit_cert',
    label: 'TheraSuit Method / Uzay Terapisi',
    description: 'Yoğun nöro-rehabilitasyon ve askı sistemleri eğitimi.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_thera_1', category: 'technicalExpertise', type: 'radio',
        text: 'TheraSuit elbisesinin propriyoseptif sistem üzerindeki birincil etkisi nedir?',
        weightedOptions: [
          { label: 'Eklemlere dikey kompresyon yaparak vücut farkındalığını ve hizalanmayı artırmak.', weights: { clinical: 1.0 }, analysisInsight: 'Mekanik/Biyolojik bilgi.' },
          { label: 'Sadece çocuğun dik durmasını sağlamak.', weights: { clinical: 0.5 }, analysisInsight: 'Yüzeysel.' },
          { label: 'Çocuğu terleterek zayıflatmak.', weights: { clinical: 0.0 }, analysisInsight: 'Bilim dışı.' },
          { label: 'Kasları dondurmak.', weights: { clinical: 0.1 }, analysisInsight: 'Tehlikeli yanılgı.' }
        ]
      }
    ]
  },

  // --- PSİKOLOJİ & REHBERLİK ---
  {
    id: 'cbt_children',
    label: 'Bilişsel Davranışçı Terapi (BDT) - Çocuk ve Ergen',
    description: 'Akademik akreditasyonlu uygulayıcı sertifikası.',
    category: 'PSYCHOLOGY_GUIDANCE',
    verificationQuestions: [
      {
        id: 'vq_cbt_1', category: 'technicalExpertise', type: 'radio',
        text: 'BDT\'de "Bilişsel Yeniden Yapılandırma" (Cognitive Restructuring) çocuklarda nasıl uygulanır?',
        weightedOptions: [
          { label: 'Olumsuz otomatik düşünceleri yakalayıp daha işlevsel olanlarla değiştirmeyi öğreterek.', weights: { clinical: 1.0 }, analysisInsight: 'Terapi ekolü hakimiyeti.' },
          { label: 'Çocuğa sürekli "olumlu düşün" diyerek.', weights: { clinical: 0.2 }, analysisInsight: 'Toksik pozitiflik/Ekol dışı.' },
          { label: 'Sadece resim çizdirerek.', weights: { clinical: 0.3 }, analysisInsight: 'Yetersiz müdahale.' },
          { label: 'İlaç tedavisini savunarak.', weights: { clinical: 0.0 }, analysisInsight: 'Yetki aşımı.' }
        ]
      }
    ]
  }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'gen_1', category: 'technicalExpertise', type: 'radio',
      text: 'Karmaşık bir vaka (Örn: OSB + ADHD + Duyusal İşlemleme Bozukluğu) için ilk önceliğiniz ne olur?',
      weightedOptions: [
        { label: 'Multidisipliner bir değerlendirme ile en yüksek engel teşkil eden "bariyer davranışı" veya "duyusal ihtiyacı" belirlemek.', weights: { clinical: 1.0, fit: 1.0 }, analysisInsight: 'Sistemik bakış.' },
        { label: 'Hemen okuma yazma öğretmeye başlamak.', weights: { clinical: 0.0 }, analysisInsight: 'Akademik acelecilik.' },
        { label: 'Sadece velinin en çok şikayet ettiği konuya odaklanmak.', weights: { clinical: 0.5 }, analysisInsight: 'Veli odaklılık riski.' },
        { label: 'Vakayı "zor" olarak etiketleyip başka kuruma yönlendirmek.', weights: { resilience: 0.0 }, analysisInsight: 'Kaçınmacı profil.' }
      ]
    }
  ],
  ethics_parent: [
    {
       id: 'eth_1', category: 'workEthics', type: 'radio',
       text: 'Bir veli, mülakat sonrası size özelden ulaşarak "Ekstra ücretle evde çalışır mısınız?" derse?',
       weightedOptions: [
          { label: 'Kurum etik kurallarını hatırlatıp nazikçe reddeder ve yönetimi bilgilendiririm.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek dürüstlük.' },
          { label: 'Sadece "Hayır" derim, kuruma söylemem.', weights: { ethics: 0.7, institutionalLoyalty: 0.4 }, analysisInsight: 'Gizli bilgi tutma.' },
          { label: 'Kurumun haberi olmadan gizlice kabul ederim.', weights: { ethics: -1.0, institutionalLoyalty: -1.0 }, analysisInsight: 'İhanet/Hırsızlık.' },
          { label: 'Kurumdan ayrılınca yapabileceğimi söylerim.', weights: { institutionalLoyalty: 0.1 }, analysisInsight: 'Fırsatçı.' }
       ]
    }
  ],
  resilience_team: [
    {
       id: 'res_1', category: 'sustainability', type: 'radio',
       text: 'Meslektaşınızın seans sırasında bir çocuğa sesini yükselttiğini duydunuz, ne yaparsınız?',
       weightedOptions: [
          { label: 'Uygun bir zamanda arkadaşımı uyarır, tekrarı halinde etik kurullar gereği raporlarım.', weights: { clinical: 1.0, ethics: 1.0 }, analysisInsight: 'Profesyonel denetim.' },
          { label: 'Duymamazlıktan gelirim, aram bozulsun istemem.', weights: { ethics: 0.2 }, analysisInsight: 'Sorumluluktan kaçma.' },
          { label: 'Ben de başkasına anlatıp dedikodu yaparım.', weights: { fit: 0.0 }, analysisInsight: 'Toksik tutum.' },
          { label: 'Derhal odaya dalarak ona bağırırım.', weights: { fit: 0.1 }, analysisInsight: 'Düşük dürtü kontrolü.' }
       ]
    }
  ],
  vision_loyalty: [
    {
       id: 'vis_1', category: 'developmentOpenness', type: 'radio',
       text: 'Kurumun size bir eğitim aldırıp 2 yıl çalışma taahhüdü istemesi karşısındaki tutumunuz?',
       weightedOptions: [
          { label: 'Gelişimi ve aidiyeti önemserim, bu yatırımın karşılığını kurumda veririm.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Aidiyet.' },
          { label: 'Eğitimi alırım ama daha iyi bir teklif gelirse giderim.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Sadakat riski.' },
          { label: 'Kendi paramla alırım, taahhüt vermem.', weights: { institutionalLoyalty: 0.5 }, analysisInsight: 'Bağımsız/Mesafeli.' },
          { label: 'Eğitimi gereksiz bulurum.', weights: { developmentOpenness: 0.0 }, analysisInsight: 'Gelişime kapalı.' }
       ]
    }
  ]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Biruni Üniversitesi", "Üsküdar Üniversitesi", "Bezmialem Vakıf Üniversitesi", "Medipol Üniversitesi", "Bahçeşehir Üniversitesi", "Kültür Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
