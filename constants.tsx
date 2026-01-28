
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
  { id: 'INTELLECTUAL_DISABILITIES', label: 'Zihin Engelliler & Bilişsel' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi' }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'aba_bacb',
    label: 'Applied Behavior Analysis (ABA / BACB)',
    description: 'Uluslararası Uygulamalı Davranış Analizi Standartları.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'technicalExpertise', type: 'radio',
        text: 'Bir davranışın işlevi belirlenirken kullanılan ABC kaydında "C" (Sonuç) için en doğru klinik yaklaşım nedir?',
        weightedOptions: [
          { label: 'Davranışın hemen sonrasında gerçekleşen ve gelecekteki olasılığı değiştiren olaydır.', weights: { clinical: 1.0 }, analysisInsight: 'Kavramsal netlik.' },
          { label: 'Çocuğun davranışı yapma amacı ve içsel duygusudur.', weights: { clinical: 0.1 }, analysisInsight: 'Zihinselleştirme hatası.' },
          { label: 'Davranıştan önce çocuğu tetikleyen çevresel uyarandır.', weights: { clinical: 0.0 }, analysisInsight: 'Temel kavram hatası.' },
          { label: 'Davranış sırasında öğretmenin verdiği yönergedir.', weights: { clinical: 0.3 }, analysisInsight: 'Eksik bilgi.' }
        ]
      },
      {
        id: 'vq_aba_2', category: 'technicalExpertise', type: 'radio',
        text: 'Negatif Pekiştirme (Negative Reinforcement) süreci aşağıdakilerden hangisini hedefler?',
        weightedOptions: [
          { label: 'İtici bir uyaranın ortamdan çekilmesiyle hedef davranışın artırılmasını.', weights: { clinical: 1.0 }, analysisInsight: 'Metot hakimiyeti.' },
          { label: 'İstenmeyen bir davranışın ceza yöntemiyle azaltılmasını.', weights: { clinical: 0.0 }, analysisInsight: 'Kritik metodolojik yanılgı.' },
          { label: 'Çocuğun sevdiği bir nesnenin elinden alınarak davranışın söndürülmesini.', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış tanımlama.' },
          { label: 'Davranışın ardından olumlu bir sosyal pekiştireç sunulmasını.', weights: { clinical: 0.4 }, analysisInsight: 'Pozitif-Negatif ayrım hatası.' }
        ]
      },
      {
        id: 'vq_aba_3', category: 'technicalExpertise', type: 'radio',
        text: 'İpucu Silikleştirme (Prompt Fading) uygulamasında "İpucu Bağımlılığı" nasıl önlenir?',
        weightedOptions: [
          { label: 'Sistematik olarak en azdan en çoğa veya tersi bir sıra ile desteğin çekilmesiyle.', weights: { clinical: 1.0 }, analysisInsight: 'Uygulama hassasiyeti.' },
          { label: 'İpucunun çocuk tam öğrendikten sonra aniden kesilmesiyle.', weights: { clinical: 0.2 }, analysisInsight: 'Pedagojik sertlik.' },
          { label: 'İpucunun sadece çocuk talep ettiğinde verilmesiyle.', weights: { clinical: 0.4 }, analysisInsight: 'Yapılandırılmamış süreç.' },
          { label: 'İpucu yerine sürekli sözel uyarılar kullanarak.', weights: { clinical: 0.1 }, analysisInsight: 'Sözel bağımlılık riski.' }
        ]
      },
      {
        id: 'vq_aba_4', category: 'technicalExpertise', type: 'radio',
        text: 'Extinction (Sönme) uygulamasında "Extinction Burst" (Sönme Patlaması) sırasında tutum ne olmalıdır?',
        weightedOptions: [
          { label: 'Pekiştirilmeme süreci istikrarlı devam ettirilmeli ve güvenlik önlemleri artırılmalıdır.', weights: { clinical: 1.0 }, analysisInsight: 'Kriz yönetimi yetkinliği.' },
          { label: 'Çocuk çok zorlandığı için hafif bir pekiştirme ile sakinleştirilmelidir.', weights: { clinical: 0.0 }, analysisInsight: 'Gecikmiş pekiştirme hatası.' },
          { label: 'Davranışın şiddeti arttığı için uygulama derhal durdurulmalıdır.', weights: { clinical: 0.1 }, analysisInsight: 'Metodik istikrarsızlık.' },
          { label: 'Çocukla göz teması kurularak neden yaptığı sorgulanmalıdır.', weights: { clinical: 0.3 }, analysisInsight: 'İşlev dışı müdahale.' }
        ]
      },
      {
        id: 'vq_aba_5', category: 'technicalExpertise', type: 'radio',
        text: 'Genelleme (Generalization) çalışmaları programın hangi aşamasında planlanmalıdır?',
        weightedOptions: [
          { label: 'Eş zamanlı olarak; öğretimin en başından itibaren farklı kişi ve ortamlarda.', weights: { clinical: 1.0 }, analysisInsight: 'Modern klinik vizyon.' },
          { label: 'Beceri klinikte %100 bağımsız sergilendikten hemen sonra.', weights: { clinical: 0.6 }, analysisInsight: 'Gecikmeli yaklaşım.' },
          { label: 'Aile eğitimine geçildiğinde, sadece ev ortamı için.', weights: { clinical: 0.3 }, analysisInsight: 'Kısıtlı genelleme.' },
          { label: 'Öğrenci beceriyi unuttuğunda tekrar çalışmak için.', weights: { clinical: 0.0 }, analysisInsight: 'Temel mantık hatası.' }
        ]
      }
    ]
  },
  {
    id: 'etecom',
    label: 'ETEÇOM',
    description: 'Etkileşim Temelli Erken Çocuklukta Müdahale.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_ete_1', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM modelinde "İlişkisel Stratejiler"in uygulanmasında uzmanın temel rolü nedir?',
        weightedOptions: [
          { label: 'Ebeveyne çocukla etkileşim sırasında rehberlik eden bir "Koç" olmak.', weights: { clinical: 1.0 }, analysisInsight: 'Model sadakati.' },
          { label: 'Çocuğa masa başında doğrudan akademik beceri öğretmek.', weights: { clinical: 0.0 }, analysisInsight: 'Modele tamamen aykırı.' },
          { label: 'Seans sırasında ebeveyni dışarıda bekletip rapor vermek.', weights: { clinical: 0.1 }, analysisInsight: 'İzolasyon hatası.' },
          { label: 'Sadece çocuğun motor gelişimine odaklanmak.', weights: { clinical: 0.2 }, analysisInsight: 'Sığ yaklaşım.' }
        ]
      },
      {
        id: 'vq_ete_2', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM\'da kullanılan "Genişletme" (Expansion) tekniği neyi amaçlar?',
        weightedOptions: [
          { label: 'Çocuğun ilgisini bozmadan onun etkileşim döngüsünü bir adım ileri taşımayı.', weights: { clinical: 1.0 }, analysisInsight: 'Uygulama kalitesi.' },
          { label: 'Çocuğun konuştuğu kelime sayısını zorla artırmayı.', weights: { clinical: 0.3 }, analysisInsight: 'Zorlayıcı yaklaşım.' },
          { label: 'Çocuğun fiziksel oyun alanını büyütmeyi.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış yorum.' },
          { label: 'Seans süresini verim için uzatmayı.', weights: { clinical: 0.0 }, analysisInsight: 'Metin dışı cevap.' }
        ]
      },
      {
        id: 'vq_ete_3', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM programı hangi gelişimsel kuramı temel alır?',
        weightedOptions: [
          { label: 'Sosyal-İnşacı ve Etkileşimci kuramları.', weights: { clinical: 1.0 }, analysisInsight: 'Teorik derinlik.' },
          { label: 'Sadece Klasik Koşullanma kuramını.', weights: { clinical: 0.2 }, analysisInsight: 'Eksik altyapı.' },
          { label: 'Davranışçı modelin sert disiplin kurallarını.', weights: { clinical: 0.1 }, analysisInsight: 'Kuramsal hata.' },
          { label: 'Geleneksel eğitim metotlarını.', weights: { clinical: 0.3 }, analysisInsight: 'Genelleyici cevap.' }
        ]
      },
      {
        id: 'vq_ete_4', category: 'technicalExpertise', type: 'radio',
        text: 'Modelde "Ebeveyn Duyarlılığı" nasıl tanımlanır?',
        weightedOptions: [
          { label: 'Ebeveynin çocuğun ipuçlarını doğru okuyup, uygun ve zamanında yanıt vermesi.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik farkındalık.' },
          { label: 'Ebeveynin çocuğun her istediği oyuncağı hemen alması.', weights: { clinical: 0.0 }, analysisInsight: 'Veli yönetimi hatası.' },
          { label: 'Ebeveynin çocuk ağladığında seansı durdurması.', weights: { clinical: 0.2 }, analysisInsight: 'Sınır problemi.' },
          { label: 'Ebeveynin uzmanın tüm dediklerini not alması.', weights: { clinical: 0.5 }, analysisInsight: 'Yüzeysel katılım.' }
        ]
      },
      {
        id: 'vq_ete_5', category: 'technicalExpertise', type: 'radio',
        text: 'Ortak Dikkat (Joint Attention) ETEÇOM\'da neden önceliklidir?',
        weightedOptions: [
          { label: 'Dil gelişimi ve sosyal öğrenmenin temel ön koşulu olduğu için.', weights: { clinical: 1.0 }, analysisInsight: 'Gelişimsel bilinç.' },
          { label: 'Çocuğun sadece göz teması kurmasını sağlamak için.', weights: { clinical: 0.4 }, analysisInsight: 'Dar kapsamlı bakış.' },
          { label: 'Akademik becerilere daha hızlı geçmek için.', weights: { clinical: 0.2 }, analysisInsight: 'Hız odaklı hata.' },
          { label: 'Veliye çocuğun otizmli olmadığını kanıtlamak için.', weights: { clinical: 0.0 }, analysisInsight: 'Etik/Klinik hata.' }
        ]
      }
    ]
  }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'gen_1', category: 'technicalExpertise', type: 'radio',
      text: 'Farklı branştan bir meslektaşınızın raporuna katılmadığınızda profesyonel tutumunuz ne olur?',
      weightedOptions: [
        { label: 'Klinik verilerimi ve gözlemlerimi bir toplantıda bilimsel temelli sunarım.', weights: { institutionalLoyalty: 1.0, clinical: 0.8 }, analysisInsight: 'İşbirliğine açık.' },
        { label: 'Kendi seanslarımda bildiğimi okur, diğer branşı dikkate almam.', weights: { institutionalLoyalty: 0.0, clinical: 0.1 }, analysisInsight: 'İzolasyonist risk.' },
        { label: 'Konuyu veliye açarak hangi görüşün doğru olduğunu ona sorarım.', weights: { clinical: 0.0, ethics: 0.0 }, analysisInsight: 'Etik sınır ihlali.' },
        { label: 'Durumu doğrudan kurum müdürüne şikayet ederek çözüm ararım.', weights: { institutionalLoyalty: 0.4, clinical: 0.3 }, analysisInsight: 'Hiyerarşik sığınma.' }
      ]
    },
    {
        id: 'gen_2', category: 'technicalExpertise', type: 'radio',
        text: 'Bilimsel geçerliliği tartışmalı bir yöntemi (Örn: Ağır Metal Detoksu) savunan bir veliye yaklaşımınız?',
        weightedOptions: [
          { label: 'Yöntemin bilimsel kanıt yetersizliğini literatürle nazikçe açıklar, kanıta dayalı rotayı korurum.', weights: { clinical: 1.0, ethics: 1.0 }, analysisInsight: 'Bilimsel dürüstlük.' },
          { label: 'Veli istiyorsa sakıncası olmadığını söyler, süreci desteklerim.', weights: { clinical: 0.0, ethics: 0.0 }, analysisInsight: 'Klinik taviz.' },
          { label: 'Sorumluluk kabul etmediğime dair bir kağıt imzalatıp izin veririm.', weights: { ethics: 0.3 }, analysisInsight: 'Yasal savunmacılık.' },
          { label: 'Veliyle bu konuda asla tartışmaya girmem, konuyu kapatırım.', weights: { clinical: 0.5 }, analysisInsight: 'Kaçınmacı tutum.' }
        ]
    },
    {
        id: 'gen_3', category: 'technicalExpertise', type: 'radio',
        text: 'Bir seansın başarısını ölçerken hangi metriği en güvenilir bulursunuz?',
        weightedOptions: [
          { label: 'Hedef davranışın genelleme ve kalıcılık verilerini.', weights: { clinical: 1.0 }, analysisInsight: 'Analitik derinlik.' },
          { label: 'Velinin seans sonundaki mutluluk düzeyini.', weights: { clinical: 0.2, fit: 0.6 }, analysisInsight: 'Müşteri memnuniyeti odağı.' },
          { label: 'Çocuğun seans boyunca hiç ağlamamış olmasını.', weights: { clinical: 0.3 }, analysisInsight: 'Sığ gözlem.' },
          { label: 'Doldurulan formlardaki artı (+) sayısını.', weights: { clinical: 0.5 }, analysisInsight: 'Biçimsel değerlendirme.' }
        ]
    },
    {
        id: 'gen_4', category: 'technicalExpertise', type: 'radio',
        text: 'Gelişimi duraklayan bir vaka için ilk adımınız ne olur?',
        weightedOptions: [
          { label: 'Verileri yeniden analiz eder, uygulama sadakatini (Fidelity) ve pekiştireçleri sorgularım.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik öz-denetim.' },
          { label: 'Çocuğun artık gelişim potansiyelinin sınıra ulaştığını aileye bildiririm.', weights: { clinical: 0.0 }, analysisInsight: 'Mesleki pesimizm.' },
          { label: 'Farklı bir tanı olasılığı için derhal psikiyatriste yönlendiririm.', weights: { clinical: 0.5 }, analysisInsight: 'Sorumluluk devri.' },
          { label: 'Aynı programa daha yoğun ve baskılı şekilde devam ederim.', weights: { clinical: 0.1 }, analysisInsight: 'Uygulama hatası.' }
        ]
    },
    {
        id: 'gen_5', category: 'technicalExpertise', type: 'radio',
        text: 'Multidisipliner çalışmada "Rol Karmaşası" yaşandığında tutumunuz?',
        weightedOptions: [
          { label: 'Branş sınırlarını vaka toplantısında netleştirip ortak bir iş akışı öneririm.', weights: { institutionalLoyalty: 1.0, fit: 0.9 }, analysisInsight: 'Sistem kurucu.' },
          { label: 'Kendi alanıma girilmediği sürece sessiz kalırım.', weights: { fit: 0.4 }, analysisInsight: 'Pasif uyum.' },
          { label: 'O meslektaşla kişisel olarak konuşup uyarırım.', weights: { fit: 0.5 }, analysisInsight: 'Bireysel çözüm.' },
          { label: 'Branşımın üstünlüğünü kanıtlamak için daha agresif çalışırım.', weights: { fit: 0.0 }, analysisInsight: 'Rekabetçi risk.' }
        ]
    }
  ],
  ethics_parent: [
    {
        id: 'eth_1', category: 'workEthics', type: 'radio',
        text: 'Bir velinin size kurumdan habersiz, evde özel ders/seans teklif etmesine ilk refleksiniz?',
        weightedOptions: [
          { label: 'Etik kuralları hatırlatıp reddeder ve kurumu bilgilendiririm.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek sadakat.' },
          { label: 'Sadece veliyi kırmadan reddeder, kuruma söylemeye gerek duymam.', weights: { ethics: 0.7, institutionalLoyalty: 0.4 }, analysisInsight: 'Gizlilik riski.' },
          { label: 'Kurumun yoğunluğu bittiğinde değerlendirebileceğimi söylerim.', weights: { ethics: 0.0, institutionalLoyalty: 0.0 }, analysisInsight: 'Açık sadakatsizlik.' },
          { label: 'Ücret kurumdan daha yüksekse kabul edebilirim.', weights: { ethics: -0.5, institutionalLoyalty: -1.0 }, analysisInsight: 'Kritik etik ihlali.' }
        ]
    },
    {
        id: 'eth_2', category: 'workEthics', type: 'radio',
        text: 'Veli, kurumdaki başka bir öğretmeni size şikayet ederse ne yaparsınız?',
        weightedOptions: [
          { label: 'Dinler ama yorum yapmam, meslektaşımı korur ve şikayeti yönetime iletirim.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Profesyonel duruş.' },
          { label: 'Veliye hak verip meslektaşımın hatalarını ben de teyit ederim.', weights: { ethics: 0.0, institutionalLoyalty: 0.0 }, analysisInsight: 'Takım birliği ihlali.' },
          { label: 'Konuyu duymamış gibi davranıp sohbeti değiştiririm.', weights: { ethics: 0.5 }, analysisInsight: 'Kaçınmacı.' },
          { label: 'Veliyi bu şekilde konuştuğu için sertçe azarlarım.', weights: { ethics: 0.2, fit: 0.0 }, analysisInsight: 'Agresif tutum.' }
        ]
    },
    {
        id: 'eth_3', category: 'workEthics', type: 'radio',
        text: 'Bir öğrencinin vücudunda açıklanamayan bir morluk gördünüz, ilk adımınız?',
        weightedOptions: [
          { label: 'Kurum yönetimi ve varsa sosyal hizmet birimiyle durumu ivedilikle paylaşırım.', weights: { ethics: 1.0, clinical: 1.0 }, analysisInsight: 'Çocuk koruma bilinci.' },
          { label: 'Bir sonraki seansa kadar bekleyip morluğun geçip geçmediğine bakarım.', weights: { ethics: 0.0 }, analysisInsight: 'İhmal riski.' },
          { label: 'Veliye nedenini sorar, cevabı yeterli bulursam not alırım.', weights: { ethics: 0.4 }, analysisInsight: 'Yetersiz sorgulama.' },
          { label: 'Sadece fotoğrafını çeker, kimseye söylemem.', weights: { ethics: -0.5 }, analysisInsight: 'Yasal/Etik suç.' }
        ]
    },
    {
        id: 'eth_4', category: 'workEthics', type: 'radio',
        text: 'Velinin mülakat sırasında size pahalı bir hediye vermesi durumunda?',
        weightedOptions: [
          { label: 'Kurum politikası gereği kabul edemeyeceğimi nazikçe açıklar, hediyeyi iade ederim.', weights: { ethics: 1.0, formality: 1.0 }, analysisInsight: 'Sınır bütünlüğü.' },
          { label: 'Kırmamak için alır, sonra çekmeceme koyarım.', weights: { ethics: 0.3 }, analysisInsight: 'Zayıf sınır.' },
          { label: 'Kurum müdürüne danışıp öyle karar vereceğimi söylerim.', weights: { ethics: 0.6 }, analysisInsight: 'Sorumluluk devri.' },
          { label: 'Çok teşekkür ederek kabul ederim.', weights: { ethics: 0.0 }, analysisInsight: 'Etik zafiyet.' }
        ]
    },
    {
        id: 'eth_5', category: 'workEthics', type: 'radio',
        text: 'Bir meslektaşınızın etik dışı bir uygulamasını (Örn: Şiddet/İstismar) fark ettiğinizde?',
        weightedOptions: [
          { label: 'Hiç bekletmeden, hiyerarşiyi gözeterek durumu yönetime ve gerekirse mercilere bildiririm.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Maksimum liyakat.' },
          { label: 'Önce arkadaşımı uyarır, tekrar ederse bildireceğimi söylerim.', weights: { ethics: 0.2 }, analysisInsight: 'Suça ortaklık riski.' },
          { label: 'Başıma iş almamak için görmezden gelirim.', weights: { ethics: -1.0 }, analysisInsight: 'Kritik risk.' },
          { label: 'Sadece dedikodu olarak diğer arkadaşlarıma anlatırım.', weights: { ethics: -0.5, institutionalLoyalty: 0.0 }, analysisInsight: 'Toksik tutum.' }
        ]
    }
  ],
  resilience_team: [
    {
        id: 'res_1', category: 'sustainability', type: 'radio',
        text: 'Çok yoğun ve krizli geçen bir seans sonrası nasıl toparlanırsınız?',
        weightedOptions: [
          { label: 'Kısa bir öz-denetim molası verir, verileri not eder ve bir sonraki seansa odaklanırım.', weights: { resilience: 1.0 }, analysisInsight: 'Yüksek direnç.' },
          { label: 'O günkü diğer tüm seanslarımı moralim bozuk olduğu için verimsiz geçiririm.', weights: { resilience: 0.0 }, analysisInsight: 'Hızlı tükenmişlik.' },
          { label: 'Ağlayarak durumu meslektaşlarıma anlatırım.', weights: { resilience: 0.3 }, analysisInsight: 'Düşük regülasyon.' },
          { label: 'Akşam eve gidince veliye mesaj atıp dertleşirim.', weights: { resilience: 0.1, ethics: 0.0 }, analysisInsight: 'Profesyonel mesafe ihlali.' }
        ]
    },
    {
        id: 'res_2', category: 'sustainability', type: 'radio',
        text: 'Üst üste aldığınız olumsuz geri bildirimler karşısındaki refleksiniz?',
        weightedOptions: [
          { label: 'Eleştirileri gelişim fırsatı olarak görür, gelişim planımı güncellerim.', weights: { resilience: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Öğrenen organizasyon uyumu.' },
          { label: 'Kasıtlı yapıldığını düşünür, savunmaya geçerim.', weights: { resilience: 0.2, developmentOpenness: 0.0 }, analysisInsight: 'Gelişime kapalı.' },
          { label: 'Motivasyonum tamamen düşer ve istifayı düşünürüm.', weights: { resilience: 0.1 }, analysisInsight: 'Kırılgan profil.' },
          { label: 'Hatalı olduğumu bilsem de kabul etmem, tartışırım.', weights: { resilience: 0.0 }, analysisInsight: 'Narsistik savunma.' }
        ]
    },
    {
        id: 'res_3', category: 'sustainability', type: 'radio',
        text: 'Kurum içi yoğun bir etkinlikte ek görevler verilirse?',
        weightedOptions: [
          { label: 'Ekip ruhuyla üstlenir, zaman yönetimimi buna göre optimize ederim.', weights: { resilience: 1.0, fit: 1.0 }, analysisInsight: 'Takım oyuncusu.' },
          { label: 'Sadece kendi görev tanımımdaki işleri yaparım.', weights: { resilience: 0.4, fit: 0.2 }, analysisInsight: 'Bireyselci.' },
          { label: 'Yapıyormuş gibi görünür ama yapmam.', weights: { resilience: 0.0, ethics: 0.0 }, analysisInsight: 'Manipülatif.' },
          { label: 'Sürekli şikayet ederek ekibin enerjisini düşürürüm.', weights: { resilience: 0.1, fit: 0.0 }, analysisInsight: 'Toksik direnç.' }
        ]
    },
    {
        id: 'res_4', category: 'sustainability', type: 'radio',
        text: 'Fiziksel şiddet içeren bir vaka ile çalışırken tükenmişlik hissettiğinizde?',
        weightedOptions: [
          { label: 'Süpervizyon talep eder, metot değişikliği ve mola stratejilerini tartışırım.', weights: { resilience: 1.0, clinical: 0.9 }, analysisInsight: 'Profesyonel destek bilinci.' },
          { label: 'Çocuğa karşı ben de sertleşirim.', weights: { resilience: -1.0, ethics: -1.0 }, analysisInsight: 'Kritik tehlike.' },
          { label: 'Sessizce istifa ederim.', weights: { resilience: 0.2 }, analysisInsight: 'Düşük mücadele.' },
          { label: 'Veliye "çocuğunuz çok fena" diyerek sitem ederim.', weights: { resilience: 0.1, ethics: 0.2 }, analysisInsight: 'Zayıf iletişim.' }
        ]
    },
    {
        id: 'res_5', category: 'sustainability', type: 'radio',
        text: 'Kurumda alınan bir karara şahsen katılmıyorsunuz, tutumunuz?',
        weightedOptions: [
          { label: 'Uygun bir dille çekincelerimi sunar, karar kesinleşirse kurumsal sadakatle uygularım.', weights: { resilience: 0.9, institutionalLoyalty: 1.0 }, analysisInsight: 'Olgun profesyonellik.' },
          { label: 'Kararı arkadan eleştirmeye ve uygulamamaya çalışırım.', weights: { institutionalLoyalty: 0.0, fit: 0.0 }, analysisInsight: 'Gizli direnç.' },
          { label: 'Hemen bir grup kurup karara karşı ayaklanma başlatırım.', weights: { institutionalLoyalty: -0.5, fit: -0.5 }, analysisInsight: 'Yıkıcı tutum.' },
          { label: 'Hiçbir şey demem ama işten soğurum.', weights: { resilience: 0.3 }, analysisInsight: 'İçsel çekilme.' }
        ]
    }
  ],
  vision_loyalty: [
    {
        id: 'vis_1', category: 'developmentOpenness', type: 'radio',
        text: 'Önümüzdeki 5 yıl içinde kendinizi mesleki olarak nerede görüyorsunuz?',
        weightedOptions: [
          { label: 'Alanında uzmanlaşmış, vaka başarısı yüksek ve mentorluk yapabilen bir noktada.', weights: { developmentOpenness: 1.0, leadershipPotential: 0.9 }, analysisInsight: 'Vizyoner.' },
          { label: 'Mümkünse kendi merkezini açmış veya başka sektöre geçmiş.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Düşük bağlılık.' },
          { label: 'Aynı pozisyonda, düzenimi bozmadan devam ederken.', weights: { developmentOpenness: 0.3 }, analysisInsight: 'Statükocu.' },
          { label: 'Akademisyenlik için istifa etmiş.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Geçici aday.' }
        ]
    },
    {
        id: 'vis_2', category: 'developmentOpenness', type: 'radio',
        text: 'Yapay zeka ve teknolojinin özel eğitimdeki yeri sizce ne olmalıdır?',
        weightedOptions: [
          { label: 'Veri takibi ve kişiselleştirilmiş programlar için kritik bir destekçi.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Yenilikçi.' },
          { label: 'Geleneksel yöntemler her zaman en iyisidir, teknolojiye gerek yok.', weights: { developmentOpenness: 0.0 }, analysisInsight: 'Tutucu.' },
          { label: 'Sadece reklam amaçlı kullanılabilir.', weights: { developmentOpenness: 0.2 }, analysisInsight: 'Yüzeysel.' },
          { label: 'İşlerimizi elimizden alacağı için mesafeli durulmalı.', weights: { developmentOpenness: 0.1 }, analysisInsight: 'Teknofobik.' }
        ]
    },
    {
        id: 'vis_3', category: 'developmentOpenness', type: 'radio',
        text: 'Kurum size pahalı bir eğitim aldırsa karşılığındaki taahhüdünüz ne olur?',
        weightedOptions: [
          { label: 'Eğitimi kurum pratiğine döker ve uzun süre kurumda kalarak bilgiyi transfer ederim.', weights: { institutionalLoyalty: 1.0, ethics: 0.9 }, analysisInsight: 'Etik sadakat.' },
          { label: 'Sertifikayı alır almaz daha yüksek ücretli bir yere geçerim.', weights: { institutionalLoyalty: -1.0, ethics: 0.0 }, analysisInsight: 'Fırsatçı risk.' },
          { label: 'Eğitime giderim ama uygulayıp uygulamayacağımı zaman gösterir.', weights: { developmentOpenness: 0.4 }, analysisInsight: 'Zayıf motivasyon.' },
          { label: 'Sadece CV\'mde dursun diye katılırım.', weights: { developmentOpenness: 0.1 }, analysisInsight: 'Amaçsız gelişim.' }
        ]
    },
    {
        id: 'vis_4', category: 'developmentOpenness', type: 'radio',
        text: 'Yeni bir vaka aldığınızda hazırlık süreciniz nasıldır?',
        weightedOptions: [
          { label: 'Güncel makaleleri tarar, vaka geçmişini inceler ve multidisipliner görüş alırım.', weights: { clinical: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Bilimsel titizlik.' },
          { label: 'Yılların tecrübesiyle ilk seansta doğaçlama başlarım.', weights: { clinical: 0.3 }, analysisInsight: 'Deneyim tuzağı.' },
          { label: 'Eski hocalarımın notlarına bakarım.', weights: { clinical: 0.6 }, analysisInsight: 'Gelenekçi.' },
          { label: 'Sadece velinin anlattıklarına göre program yaparım.', weights: { clinical: 0.1 }, analysisInsight: 'Sığ hazırlık.' }
        ]
    },
    {
        id: 'vis_5', category: 'developmentOpenness', type: 'radio',
        text: 'Kurumun sosyal sorumluluk projelerinde gönüllü olur musunuz?',
        weightedOptions: [
          { label: 'Evet, kurumsal aidiyet ve toplumsal fayda için aktif rol alırım.', weights: { institutionalLoyalty: 1.0, fit: 1.0 }, analysisInsight: 'Toplumsal vizyon.' },
          { label: 'Ekstra ücret verilirse katılırım.', weights: { fit: 0.2 }, analysisInsight: 'Maddi odaklı.' },
          { label: 'Sadece zorunlu tutulursam katılırım.', weights: { fit: 0.3 }, analysisInsight: 'Düşük angajman.' },
          { label: 'Bu tarz işleri gereksiz bulurum.', weights: { fit: 0.0 }, analysisInsight: 'Uyumsuz.' }
        ]
    }
  ]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Biruni Üniversitesi", "Üsküdar Üniversitesi", "Bezmialem Vakıf Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
