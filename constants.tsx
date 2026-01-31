
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Klinik Muhakeme & Kriz Yönetimi', description: 'Kaotik senaryolarda metodolojik sadakat testi.' },
  { id: 'ethics_parent', title: 'Etik Sınırlar & Veli Diplomasisi', description: 'Profesyonel mesafe ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Psikolojik Dayanıklılık & Takım', description: 'Stres altında karar alma ve ekip sinerjisi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Kurumsal Aidiyet', description: 'Uzun vadeli stratejik uyum analizi.' }
];

export const CERTIFICATION_CATEGORIES = [
  { id: 'AUTISM_SPECTRUM', label: 'Otizm Spektrum Bozukluğu', icon: '🧩' },
  { id: 'LEARNING_DISABILITIES', label: 'Özel Öğrenme Güçlüğü', icon: '📖' },
  { id: 'INTELLECTUAL_COGNITIVE', label: 'Zihin & Bilişsel', icon: '🧠' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi', icon: '🗣️' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi', icon: '🏃' },
  { id: 'ACADEMIC_SKILLS', label: 'Okuma Yazma & Matematik', icon: '📐' },
  { id: 'PSYCHOLOGY_GUIDANCE', label: 'Rehberlik & Psikoloji', icon: '🤝' }
];

export const CERTIFICATIONS: Certification[] = [
  // ---🧩 OTİZM SPEKTRUM BOZUKLUĞU ---
  {
    id: 'aba_intl',
    label: 'ABA (Applied Behavior Analysis) - BCBA/RBT',
    description: 'Uluslararası Uygulamalı Davranış Analizi Akreditasyonu.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'technicalExpertise', type: 'radio',
        text: 'Bir problem davranışın işlevi "Kaçma/Kaçınma" (Escape) olarak belirlendi ve sönme prosedürü uygulanıyor. Ancak çocuk o gün fizyolojik olarak hasta görünüyor (Grip belirtileri). "Talep Gönderme" (Demanding) konusunda o günkü stratejiniz ne olur?',
        weightedOptions: [
          { label: 'Klinik Esneklik (Demand Fading): Fizyolojik bariyer (hastalık) performansı etkiler; kaçınma davranışını pekiştirmemek için talebi tamamen kaldırmam (çünkü çocuk hastalığı kaçış için kullanmayı öğrenebilir), ancak zorluk derecesini %80 düşürerek "başarı momentumunu" ve işbirliğini korurum.', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Usta Klinisyen: Prosedürü bozmadan insani uyarlama yapabilme.' },
          { label: 'Şefkat Önceliği (Non-Contingent Reinforcement): Çocuk hasta olduğu için kortizol seviyesi yüksektir. Tüm akademik talepleri o gün için kaldırır, günü tamamen serbest oyun ve eşleşme (Pairing) ile geçirerek çocuğun kuruma olan güvenini tazelerim.', weights: { clinical: -0.5, empathy: 1.0 }, analysisInsight: 'Şefkat Tuzağı: Hastalığı, kaçınma davranışı için meşru bir araç haline getirme riski (İyi niyetli ama teknik hata).' },
          { label: 'Prosedürel Sadakat (Strict Adherence): Hastalık bir değişkendir ancak davranış planı tutarlılık gerektirir. Eğer çocuk okula geldiyse, belirlenen programı aynen uygularım; aksi takdirde "hastayım" taklidi yapmayı (malingering) öğrenebilir.', weights: { clinical: 0.2, empathy: -1.0 }, analysisInsight: 'Mekanik Uygulama: Fizyolojik durumu ihmal eden, ilişkiyi zedeleyebilecek katı yaklaşım.' },
          { label: 'Risk Yönetimi ve Devir: Çocuğun sağlık durumu bulaş riski veya kriz tetikleyicisi olabileceğinden, riske girmemek adına seansı iptal eder veya çocuğu dinlenmesi için ailesine teslim ederim.', weights: { clinical: -0.8, institutionalLoyalty: -0.5 }, analysisInsight: 'Sorumluluktan Kaçış: Kurumsal süreci yönetmek yerine pasifize olma.' }
        ]
      }
    ]
  },
  {
    id: 'dir_floortime_intl',
    label: 'DIR Floortime (ICDL 201/202)',
    description: 'İlişki temelli nöro-gelişimsel müdahale sertifikası.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_dir_1', category: 'technicalExpertise', type: 'radio',
        text: 'Çocuk "Shared Attention" (Ortak Dikkat) kuramıyor ve sürekli kendi etrafında dönüyor (Vestibüler Arayış). Floortime yaklaşımına göre ilk hamle ne olmalıdır?',
        weightedOptions: [
          { label: 'Regülasyon ve Yönlendirme: Dönmesini fiziksel olarak durdurup, yüzünü bana çevirmesini sağlayarak dikkatini regüle ederim ve sakinleşene kadar "Deep Pressure" (Derin Bası) uygularım.', weights: { clinical: -0.5, pedagogicalAnalysis: -0.3 }, analysisInsight: 'Model Karmaşası: İlişki temelli modele davranışçı/duyusal bütünleme müdahalesi karıştırma.' },
          { label: 'Aynalama ve Katılım (Join-in): Onunla birlikte, aynı yöne ve aynı hızda dönerek onun dünyasına girer, vestibüler girdiyi paylaşarak ilişki kapısını aralarım ve sonrasında oyunu çeşitlendiririm (Expand).', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Klinik Rezonans: Çocuğun ilgisi üzerinden ilişki başlatma ustalığı.' },
          { label: 'Pasif Gözlem ve Bekleme: Müdahale etmeden dönmesinin bitmesini bekler, bitince ilgisini çekecek oyuncaklar sunarak "Kendiliğinden Başlatma" (Initiation) yapmasını umarım.', weights: { clinical: 0.2 }, analysisInsight: 'Pasif Terapist: Çocuğun dünyasına girmek yerine dışarıda bekleyen yaklaşım.' },
          { label: 'Güvenlik Odaklı Masa Başı: Başının dönüp düşmemesi için onu sandalyeye oturtur ve masa başı etkinliğe geçirerek dikkatini daha yapılandırılmış bir alana çekerim.', weights: { clinical: -0.2, empathy: 0.5 }, analysisInsight: 'Koruyucu Refleks (Aşırı Kontrol): Gelişimsel fırsatı güvenlik kaygısıyla kaçırma.' }
        ]
      }
    ]
  },
  { id: 'etecom_national', label: 'ETEÇOM (Etkileşim Temelli Erken Müdahale)', description: 'Yerel ve bilimsel kanıta dayalı etkileşim programı.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'pecs_intl', label: 'PECS (Picture Exchange Communication System)', description: 'Resim Değişimiyle İletişim Sistemi resmi eğitimi.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'gobdo_national', label: 'GOBDÖ-2-TV (Otizm Derecelendirme Ölçeği)', description: 'Otizm tarama ve değerlendirme yerel akreditasyonu.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'ods_national', label: 'ODS (Otizm Değerlendirme Seti)', description: 'Milli eğitim ve klinik temelli otizm değerlendirme envanteri.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },

  // ---📖 ÖZEL ÖĞRENME GÜÇLÜĞÜ ---
  {
    id: 'cas_intl',
    label: 'CAS (Cognitive Assessment System) Uygulayıcı',
    description: 'PASS Teorisi temelli bilişsel değerlendirme uzmanlığı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_cas_1', category: 'technicalExpertise', type: 'radio',
        text: 'PASS teorisine göre "Eşzamanlı İşlemleme" (Simultaneous Processing) zayıflığı olan bir öğrenciye okuma-yazma öğretirken hangi yöntem en yüksek riski taşır?',
        weightedOptions: [
          { label: 'Bütüncül (Global) Yöntemler: Kelimeyi bir bütün resim gibi algılamayı gerektiren, parçalar arası ilişkiyi aynı anda görmeyi zorunlu kılan karmaşık görsel matrisler.', weights: { clinical: 1.0 }, analysisInsight: 'Bilişsel Eşleştirme Doğruluğu: Zayıf alanın üzerine yüklenen yanlış yöntem tespiti.' },
          { label: 'Ses Temelli Cümle Yöntemi: Harfleri tek tek (Ardıl) birleştirerek hece ve kelimeye ulaşan, sıralı işlemleme becerisini kullanan yöntemler.', weights: { clinical: 0.3 }, analysisInsight: 'Nötr Tercih: Genellikle ardıl işlemlemeyi kullanır, eşzamanlı zayıflıkta işe yarayabilir.' },
          { label: 'Ardıl İşlemleme Oyunları: Birbirini takip eden olayları sıralama, hafızada tutma ve yönerge takip etme çalışmaları.', weights: { clinical: -0.5 }, analysisInsight: 'Kavram Karmaşası: Bu yöntem çocuğun güçlü yanına hitap edebilir, riskli değildir.' },
          { label: 'Çoktan Seçmeli Testler: Görsel tarama gerektirse de okuma öğretim yöntemi değildir.', weights: { clinical: 0.0 }, analysisInsight: 'İlişkisiz Cevap.' }
        ]
      }
    ]
  },
  { id: 'disrek_national', label: 'DİSREK (Ulusal Disleksi Programı)', description: 'Türkiye Disleksi Vakfı onaylı müdahale sertifikası.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'prep_intl', label: 'PREP (PASS Reading Enhancement Program)', description: 'Bilişsel süreçler odaklı okuma iyileştirme eğitimi.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'cogent_intl', label: 'COGENT (PASS Bilişsel Gelişim Programı)', description: 'Okul öncesi dönem bilişsel destek programı.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'moxo_intl', label: 'MOXO Dikkat Testi Uygulayıcı', description: 'Objektif dikkat ve performans ölçümleme uzmanlığı.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'orton_gillingham', label: 'Orton-Gillingham Metodu', description: 'Çok duyulu dil öğretimi yaklaşımı.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },

  // ---🧠 ZİHİN & BİLİŞSEL ---
  {
    id: 'wisc_v_intl',
    label: 'WISC-V Uygulayıcı Sertifikası',
    description: 'Wechsler Çocuklar İçin Zeka Ölçeği - 5. Sürüm.',
    category: 'INTELLECTUAL_COGNITIVE',
    verificationQuestions: [
      {
        id: 'vq_wisc_1', category: 'technicalExpertise', type: 'radio',
        text: 'WISC-V profilinde "Çalışma Belleği" (Working Memory) indeksi düşük, buna karşın "Sözel Kavrama"sı (VCI) çok yüksek çıkan bir öğrenciye akademik yönerge verirken nasıl bir strateji izlenmelidir?',
        weightedOptions: [
          { label: 'Sözel Kapasiteyi Kullanma: Sözel zekası güçlü olduğu için, detaylı, zengin ve bağlamsal açıklamalar yaparak konuyu derinlemesine anlatır ve dil becerisini aktif kullanmasını sağlarım.', weights: { clinical: -0.8 }, analysisInsight: 'Klinik Hata: Bellek darboğazını (bottleneck) görmezden gelip güçlü alana aşırı yüklenme.' },
          { label: 'Bilişsel İskele (Scaffolding): Yönergeleri parçalara böler (Chunking), her adımı görsel ipuçlarıyla destekler ve sözel açıklamayı minimumda tutarak bellek yükünü azaltırım.', weights: { clinical: 1.0 }, analysisInsight: 'Bilişsel Profil Adaptasyonu: Zayıf alanı protezleyerek güçlü alanı devreye sokma.' },
          { label: 'Kayıt ve Tekrar Stratejisi: Çocuğa her söylediğimi not aldırır veya ses kaydı yapmasına izin veririm, böylece unuttuğunda tekrar dinleyebilir.', weights: { clinical: 0.4 }, analysisInsight: 'Kısmen Doğru: Telafi edici bir stratejidir ancak öğretim anındaki işlemleme sorununu çözmez.' },
          { label: 'Çevresel Düzenleme: Dikkatini toplaması için onu sınıfın en ön sırasına, öğretmenin tam karşısına oturtur ve göz teması kurarım.', weights: { clinical: 0.2 }, analysisInsight: 'Klasik Yöntem: Dikkat eksikliği için geçerlidir ancak bellek kapasitesi sorununu doğrudan çözmez.' }
        ]
      }
    ]
  },
  { id: 'asis_national', label: 'ASİS (Anadolu-Sak Zeka Ölçeği)', description: 'İlk yerli ve milli zeka ölçeği uygulayıcı sertifikası.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'leiter_3_intl', label: 'Leiter-3 Performans Ölçeği', description: 'Sözel olmayan zeka ölçümleme uzmanlığı.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'stanford_binet_sb5', label: 'Stanford-Binet (SB5) Uygulayıcı', description: 'Geleneksel ve güncel zeka değerlendirme uzmanlığı.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'metropolitan_national', label: 'Metropolitan Okul Olgunluğu Testi', description: 'Okula hazırlık düzeyi belirleme akreditasyonu.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },

  // ---🗣️ DİL VE KONUŞMA TERAPİSİ ---
  {
    id: 'prompt_intl',
    label: 'PROMPT (Level 1/2) Technique',
    description: 'Motor-konuşma bozuklukları için taktil-kinestetik girdi metodu.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: [
      {
        id: 'vq_prompt_1', category: 'technicalExpertise', type: 'radio',
        text: 'Apraksili bir çocukta "Motor Planlama" (Motor Planning) üzerinde çalışırken, terapist neden geleneksel "işitsel ipucu" (Benim dediğimi tekrar et) yerine "taktil-kinestetik" (dokunsal) ipucunu önceler?',
        weightedOptions: [
          { label: 'İşitsel İşlemleme Bozukluğu: Apraksili çocukların çoğu aynı zamanda işitme sorunu yaşadığı için görsel/dokunsal kanal daha etkilidir.', weights: { clinical: -0.5 }, analysisInsight: 'Yanlış Tanı: Apraksi bir motor planlama sorunudur, duyusal girdi sorunu değildir.' },
          { label: 'Nöro-Motor Haritalama: İşitsel girdi motor planlamayı tetiklemekte yetersiz kalırken, çene/dudak kaslarına verilen dokunsal girdi beyne doğrudan propriyoseptif geri bildirim göndererek yeni nöral yollar (Muscle Memory) oluşturur.', weights: { clinical: 1.0 }, analysisInsight: 'Nöro-Motor Hakimiyet: Tekniğin nörofizyolojik temelini kavrama.' },
          { label: 'Dikkat ve Odaklanma: Çocuğun yüzüne dokunmak, dikkatini terapiste vermesini sağlar ve göz temasını artırarak iletişimi başlatır.', weights: { clinical: 0.3 }, analysisInsight: 'İkincil Fayda: Bu bir sonuçtur, tekniğin asıl amacı değildir.' },
          { label: 'Dudak Okuma Desteği: Çocuğun terapistin ağız hareketlerini daha iyi görmesini ve taklit etmesini sağlamak için.', weights: { clinical: 0.0 }, analysisInsight: 'Yöntem Dışı: Bu görsel modellemedir, PROMPT tekniği değildir.' }
        ]
      }
    ]
  },
  { id: 'tedil_national', label: 'TEDİL (Türkçe Erken Dil Gelişimi Testi)', description: 'Dil gelişimi yerel ölçümleme ve normlandırma uzmanlığı.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'todil_national', label: 'TODİL (Türkçe Okul Çağı Dil Gelişimi)', description: 'Okul dönemi dil bozuklukları analiz sertifikası.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'lidcombe_intl', label: 'Lidcombe Programı (Kekemelik)', description: 'Okul öncesi kekemelik müdahale global sertifikası.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'talktools_opt_intl', label: 'TalkTools Oral Placement Therapy', description: 'Oral motor terapi ve beslenme destek teknikleri.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'hanen_intl', label: 'Hanen - It Takes Two to Talk', description: 'Aile odaklı dil müdahale programı sertifikası.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },

  // ---🏃 ERGOTERAPİ & FİZYOTERAPİ ---
  {
    id: 'ayres_si_intl',
    label: 'Ayres Duyu Bütünleme (CLASI/SIPT)',
    description: 'Duyusal işlemleme bozuklukları uluslararası akreditasyonu.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_si_1', category: 'technicalExpertise', type: 'radio',
        text: '"Vestibüler Güvensizlik" (Gravitational Insecurity) yaşayan bir çocuk, ayağının yerden kesildiği aktivitelerde (Salıncak, Tırmanma) yoğun korku ve ağlama tepkisi veriyor. Terapötik yaklaşım ne olmalıdır?',
        weightedOptions: [
          { label: 'Duyarsızlaştırma (Flooding): "Korkacak bir şey yok" diyerek harekete devam etmek, çocuğu güvenli bir şekilde tutarak bu hisse maruz bırakmak ve alışmasını sağlamak.', weights: { clinical: -0.8, empathy: -0.5 }, analysisInsight: 'Travmatize Etme Riski: Güvensizlik yaşayan bir çocuğu zorlamak korkuyu pekiştirir.' },
          { label: 'Dereceli ve Kontrollü Maruz Bırakma: Çocuğun kontrolünde olan, ayaklarının yere değebileceği, öngörülebilir ve alçak seviyeli doğrusal (lineer) hareketlerle başlayıp, güven inşa ettikçe yoğunluğu artırmak.', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Klinik Ustalık: Nörolojik adaptasyon ve güven ilişkisi.' },
          { label: 'Kaçınma ve Alternatif Arayışı: Vestibüler sistem çocuğu çok zorladığı için bu alanı pas geçip, daha çok masa başı ince motor veya taktil çalışmalara odaklanmak.', weights: { clinical: 0.0 }, analysisInsight: 'Sorundan Kaçınma: Çocuğun gelişimsel ihtiyacını görmezden gelme.' },
          { label: 'Görsel Blokaj: Gözlerini kapatmasını söyleyerek görsel uyaranı kesmek, böylece yükseklik algısını azaltıp vestibüler girdiye odaklanmasını sağlamak.', weights: { clinical: -0.5 }, analysisInsight: 'Güvensizliği Artırma: Görsel referansın kaybı kaygıyı daha da artırabilir.' }
        ]
      }
    ]
  },
  { id: 'bobath_ndt_intl', label: 'Bobath / NDT Concept', description: 'Nöro-gelişimsel tedavi (Serebral Palsi odaklı) eğitimi.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'therasuit_intl', label: 'TheraSuit Method / Uzay Terapisi', description: 'Yoğun nöro-rehabilitasyon ve askı sistemleri uzmanlığı.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'halliwick_intl', label: 'Halliwick Hidroterapi', description: 'Su içi rehabilitasyon ve yüzme uzmanlık sertifikası.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'schroth_intl', label: 'Schroth Scoliosis Method', description: 'Skolyoz rehabilitasyonu spesifik klinik eğitimi.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },

  // ---📐 OKUMA YAZMA & MATEMATİK ---
  { id: 'singapore_math_intl', label: 'Singapur Matematiği (CPA Approach)', description: 'Somut-Görsel-Soyut matematik öğretimi metodu.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'diskalkuli_national', label: 'Diskalkuli Müdahale Sertifikası', description: 'Matematik öğrenme güçlüğü klinik müdahale eğitimi.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'ses_temelli_national', label: 'Ses Temelli Cümle Yöntemi (MEB)', description: 'Milli eğitim müfredatı okuma yazma uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'montessori_academic', label: 'Montessori Pedagojisi (Akademik)', description: 'Yapılandırılmış materyallerle akademik beceri eğitimi.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'tobi_national', label: 'TOBİ (Türkiye Okuma Becerileri İstifleme)', description: 'Akıcı okuma ve anlama yerel değerlendirme uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },

  // ---🤝 REHBERLİK & PSİKOLOJİ ---
  {
    id: 'cbt_children_intl',
    label: 'Çocuk ve Ergenlerde BDT (CBT)',
    description: 'Bilişsel Davranışçı Terapi uygulayıcı sertifikası.',
    category: 'PSYCHOLOGY_GUIDANCE',
    verificationQuestions: [
      {
        id: 'vq_cbt_1', category: 'technicalExpertise', type: 'radio',
        text: 'OKB tanılı bir çocukta "Maruz Bırakma ve Tepki Önleme" (ERP) çalışırken, çocuk kirlendiğini düşündüğü için ellerini yıkamak istiyor (Ritüel) ve yoğun anksiyete yaşıyor. Terapist o an ne yapmalıdır?',
        weightedOptions: [
          { label: 'Kademeli İzin (Anksiyete Azaltma): Anksiyete krize dönüşmemesi için ritüeli yapmasına (ellerini yıkamasına) kısa süreli izin veririm, ancak bir dahaki sefere süreyi uzatacağımıza dair anlaşma yaparım.', weights: { clinical: -0.5, empathy: 0.5 }, analysisInsight: 'Döngüyü Besleme: Anksiyeteyi geçici düşürürken obsesyonu güçlendirme hatası.' },
          { label: 'Dürtü Sörfü (Surfing the Urge): Anksiyete seviyesini (SUDs) derecelendirmesini isterim. Ritüeli engellerim ancak çocukla o duygu içinde kalarak, anksiyetenin tepe noktasına ulaşıp kendiliğinden sönümleneceğini (Habituation) deneyimlemesine eşlik ederim.', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Klinik Ustalık: Terapötik pencerede kalma ve nöral yeniden öğrenme.' },
          { label: 'Dikkat Dağıtma (Distraction): Hemen dikkatini sevdiği bir oyuna veya konuya çekerek o anki kirlilik düşüncesinden uzaklaşmasını sağlarım.', weights: { clinical: 0.2 }, analysisInsight: 'Geçici Çözüm: Bilişsel kaçınmayı pekiştirir, kalıcı iyileşme sağlamaz.' },
          { label: 'Bilişsel İkna (Cognitive Restructuring): Ellerinin aslında kirli olmadığını, mikroskopla baksak bile mikrop göremeyeceğimizi mantıklı argümanlarla anlatırım.', weights: { clinical: -1.0 }, analysisInsight: 'Bilişsel Hata: OKB mantıkla çalışmaz, "güvence arama" davranışını besleyebilir.' }
        ]
      }
    ]
  },
  { id: 'play_therapy_apt', label: 'Deneyimsel Oyun Terapisi (APT Onaylı)', description: 'Oyun yoluyla terapötik müdahale uzmanlığı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'agte_national', label: 'AGTE (Ankara Gelişim Tarama Envanteri)', description: 'Bebek ve çocuklarda yerel gelişim taraması uzmanlığı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'frostig_intl', label: 'Frostig Görsel Algı Testi', description: 'Görsel algı ve el-göz koordinasyonu analiz sertifikası.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'solution_focused_intl', label: 'Çözüm Odaklı Kısa Süreli Terapi', description: 'Okul ve rehberlik temelli hızlı çözüm yaklaşımı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'mmp_psych_intl', label: 'MMPI (Minnesota Çok Yönlü Kişilik Envanteri)', description: 'Klinik kişilik değerlendirme uzmanlık sertifikası.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  
  // ============================================================
  // KATMAN 1: KLİNİK MUHAKEME & KRİZ YÖNETİMİ (SHADOW PLAY)
  // Kapsam: Klinik Yeterlilik + Pedagojik Altyapı
  // ============================================================
  clinical_logic: [
    {
      id: 'clin_shadow_1', category: 'technicalExpertise', type: 'radio',
      text: 'Yoğun bir "Problem Davranış" (Örn: Kafasını masaya vurma) anında, çocuğun burnunun aktığını ve salyasının aktığını fark ettiniz. Bu durum çocuğun dikkatini de dağıtıyor. Saniyelik kararınız?',
      weightedOptions: [
        { label: 'Hijyen ve Şefkat Odaklı Müdahale: Öncelik çocuğun konforu ve hijyenidir. Davranışı durdurmaya çalışırken aynı zamanda cebimden peçete çıkarıp yüzünü silerim, böylece rahatlayıp sakinleşmesine yardımcı olurum.', weights: { clinical: -0.6, empathy: 1.0, sustainability: -0.2 }, analysisInsight: 'Şefkat Tuzağı: Davranış anında fiziksel temas ve bakım vererek (reinforcement), problem davranışın işlevini "ilgi" veya "rahatlama" ile farkında olmadan pekiştirme riski.' },
        { label: 'Klinik Sadakat ve Planlı Görmezden Gelme: Kafasını korumak için el yastığı yaparım (güvenlik) ancak göz teması kurmadan, nötr bir yüzle krizin sönmesini beklerim. Temizlik, kriz tamamen bitip çocuk regüle olduktan sonra yapılır.', weights: { clinical: 1.0, empathy: 0.2, sustainability: 0.8 }, analysisInsight: 'Klinik Disiplin: Güvenliği sağlarken davranışı beslememe (Extinction) becerisi.' },
        { label: 'Sözel Yönerge ve Kontrol: Çocuğun ellerini tutarak "Yapma, burnunu silelim" derim ve sakinleşmesi için sözel telkinlerde bulunurum.', weights: { clinical: -0.8, empathy: 0.2, sustainability: -0.5 }, analysisInsight: 'Veri Kirliliği: Kriz anında verilen sözel uyaranlar ve temas, davranışı besleyen "sosyal dikkat" (Social Attention) hatasına dönüşebilir.' },
        { label: 'Seans İptali ve Aileye Devir: Hijyen sorunu ve kendine zarar verme riski birleştiğinde ders işlenemez. Seansı sonlandırır, çocuğu temizlemesi ve sakinleştirmesi için veliye teslim ederim.', weights: { clinical: -1.0, empathy: -0.5, institutionalLoyalty: -0.5 }, analysisInsight: 'Mesleki Kaçınma: Terapistin kriz anında otoriteyi ve sorumluluğu terk etmesi.' }
      ]
    },
    {
      id: 'clin_shadow_2', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk aylar sonra ilk kez hedeflediğiniz kelimeyi (örn: "Su") söyledi ancak o sırada sandalyede tehlikeli bir şekilde, tek ayak üzerinde dengede duruyor. Pekiştireci (Çikolata) nasıl sunarsınız?',
      weightedOptions: [
        { label: 'Güvenlik Öncelikli Zincirleme: Güvenlik her şeyden önemlidir. Önce "Otur" komutu verip güvenli pozisyona geçmesini sağlarım, oturduktan sonra "Aferin" diyerek ödülü veririm.', weights: { clinical: -0.4, pedagogicalAnalysis: -0.5, sustainability: 0.5 }, analysisInsight: 'Bloklama Etkisi (Blocking): Hedef davranış (Konuşma) ile pekiştireç arasına "Oturma" talebi sokarak dil öğrenimini geciktirme veya yanlış davranışı (oturmayı) pekiştirme riski.' },
        { label: 'Anlık Fırsat Yakalama (Catching the Moment): Hiç beklemeden büyük bir coşkuyla ödülü veririm; o an düşme riskini göze alırım (veya elimle desteklerim) çünkü "Su" demesi benim için altın değerindedir ve anında pekiştirilmelidir.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0, formality: -0.3 }, analysisInsight: 'Öncelik Yönetimi: Kritik beceriyi yakalamak için ikincil riskleri (kontrollü şekilde) yönetme zekası.' },
        { label: 'Mükemmeliyetçi Yaklaşım (Shaping): Görmezden gelirim. Hem oturuş hem konuşma aynı anda düzgün olmadan ödül verilirse, çocuk "tehlikeli hareket ederek ödül almayı" öğrenebilir.', weights: { clinical: -0.7, empathy: -0.5, pedagogicalAnalysis: -0.8 }, analysisInsight: 'Sönme Riski: Fırsat öğretimini kaçırma ve çocuğun motivasyonunu kırma.' }
      ]
    },
    {
      id: 'clin_shadow_3', category: 'technicalExpertise', type: 'radio',
      text: 'Seansın bitmesine 2 dakika var ve çocuk nihayet derse odaklandı, çok verimli bir akış ("Flow") yakaladınız. Ancak kapıda bir sonraki öğrenci ve velisi bekliyor. Kararınız?',
      weightedOptions: [
        { label: 'Pedagojik Esneklik: Akışı bozmam, seansı 5-10 dakika uzatırım. Eğitimdeki bu "altın an", dışarıdaki velinin beklemesinden daha değerlidir ve durumu sonra izah edebilirim.', weights: { clinical: 0.6, ethics: -0.4, institutionalLoyalty: -0.5 }, analysisInsight: 'Sınır İhlali (Time Boundary): İyi niyetli ama kurumsal zaman yönetimini ve diğer ailenin hakkını ihlal eden eylem.' },
        { label: 'Katı Kurumsal Sadakat: Tam dakikasında keserim. Kurallar kuraldır, diğer öğrencinin hakkına giremem ve kurumun zaman çizelgesini bozamam.', weights: { clinical: -0.3, formality: 1.0, empathy: -0.2 }, analysisInsight: 'Mekanik Uygulama: Pedagojik kazancı prosedüre kurban etme, "öğrenme aşkını" söndürme riski.' },
        { label: 'Peak-End Kuralı (Zirvede Bırakma): Mevcut akışı "en yüksek noktada" ve coşkuyla sonlandırıp, çocuğun "başarma hissiyle" ve tadı damağında kalarak çıkmasını sağlarım. Bu, bir sonraki derse motivasyonla gelmesini sağlar.', weights: { clinical: 1.0, pedagogicalAnalysis: 0.8, institutionalLoyalty: 0.8 }, analysisInsight: 'Pedagojik Ustalık: Kısıtlılığı avantaja çevirme ve kurumsal düzene uyum.' }
      ]
    },
    {
      id: 'clin_shadow_4', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuğun sevdiği oyuncağı kullanarak çalışıyorsunuz. Çocuk oyuncağı elinizden hışımla çekip aldı ve vermiyor. Güç mücadelesine girmeden kontrolü nasıl geri alırsınız?',
      weightedOptions: [
        { label: 'Otoriter Sınır Koyma: "Ver onu bana, yoksa ders biter!" diyerek net bir sınır koyarım ve gerekirse fiziksel olarak elinden alırım. Liderin kim olduğunu bilmeli.', weights: { pedagogicalAnalysis: -0.4, empathy: -0.6, clinical: -0.2 }, analysisInsight: 'Güç Savaşı (Power Struggle): Çocuğu savunmaya iten ve ilişkiyi zedeleyen eski ekol yaklaşımı.' },
        { label: 'Çevresel Kontrol (Environmental Control): Oyuncağı almasına izin veririm ama o oyuncağın çalışması için gereken "eksik parçayı" (pil, anahtar, diğer parça) elimde tutarım. Böylece oyunu devam ettirmek için bana muhtaç olmasını (Motivasyonel Operasyon) sağlarım.', weights: { pedagogicalAnalysis: 1.0, clinical: 0.9, empathy: 0.5 }, analysisInsight: 'Klinik Zeka: Fiziksel güç yerine motivasyonel kontrol ve ortam düzenlemesi.' },
        { label: 'Pasif Uyum ve İkna: Oynamasına izin veririm, yeter ki ağlamasın. Bir süre sonra sıkılınca "Hadi şimdi bana ver" diyerek ikna etmeye çalışırım.', weights: { clinical: -0.6, sustainability: -0.4, workEthics: -0.3 }, analysisInsight: 'Liderlik Kaybı: Terapötik liderliğin kaybı ve çocuğa kontrolü verme.' }
      ]
    },
    {
      id: 'clin_shadow_5', category: 'technicalExpertise', type: 'radio',
      text: 'Veri toplama kağıdınız (Data Sheet) o gün kaybolmuş veya unutulmuş. Seansa girdiniz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Hafıza Güveni: O gün veri tutmam, çocuğa odaklanırım. Seanstan çıktıktan sonra aklımda kalanları tahmini olarak sisteme girerim.', weights: { clinical: -0.6, workEthics: -0.4 }, analysisInsight: 'Hafıza Yanılgısı: Subjektif veri riski ve profesyonel ihmal.' },
        { label: 'Operasyonel İptal: Seansı iptal eder veya çocuğu yardımcı ablaya bırakıp kağıdı/tableti aramaya giderim. Verisiz seans yapılamaz.', weights: { clinical: -0.3, institutionalLoyalty: -0.5 }, analysisInsight: 'Operasyonel Aksama: Çözüm odaklı olmama ve zaman kaybı.' },
        { label: 'Doğaçlama Kayıt Sistemi: Hemen bir boş kağıda, peçeteye veya elime basit bir "Tally" (çentik) sistemi kurarak o anki hedef davranışları kaydederim. Format önemli değildir, verinin varlığı esastır.', weights: { clinical: 1.0, sustainability: 0.8, workEthics: 0.9 }, analysisInsight: 'Klinik Refleks: Şartlar ne olursa olsun veriye sadakat ve çözüm üretme.' }
      ]
    },
    // YENİ EKLENEN: KLİNİK YETERLİLİK & PEDAGOJİK ALTYAPI (10+10 = 20 SORU)
    {
      id: 'clin_new_1', category: 'technicalExpertise', type: 'radio',
      text: 'Otizmli bir öğrenci sürekli reklam jeneriklerini tekrar ediyor (Sözel Stereotipi / Ekolali). Veli bunu "konuşuyor" sanıp seviniyor. Veliye durumu nasıl izah edersiniz?',
      weightedOptions: [
        { label: 'Radikal Gerçekçilik: "Hanımefendi bu konuşma değil, anlamsız papağan tekrarı. Beyninde bir kısa devre gibi düşünün, buna sevinmeyin." diyerek aileyi sarsarım.', weights: { clinical: 0.5, empathy: -0.8 }, analysisInsight: 'Kaba Gerçekçilik: Aileyi demoralize etme ve işbirliğini kaybetme riski.' },
        { label: 'Yatıştırıcı Yaklaşım (Pembe Tablo): "Evet, harika! Konuşması açılıyor, zamanla düzelecek merak etmeyin." diyerek ailenin moralini bozmam.', weights: { clinical: -1.0, ethics: -0.8 }, analysisInsight: 'Profesyonel Yalan: Gelişimi sabote eden yanıltıcı bilgi.' },
        { label: 'Fonksiyonel Dönüşüm Çerçevesi: "Ses çıkarması harika bir başlangıç motoru. Ancak şu an bu sesler \'iletişim amaçlı\' değil. Bizim hedefimiz bu potansiyeli alıp, \'istek bildiren\' (fonksiyonel) dile dönüştürmek." diyerek ailenin umudunu teknik bir hedefe kanalize ederim.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Klinik Diplomasisi: Pozitifi koruyarak bilimsel hedefe yönlendirme.' }
      ]
    },
    {
      id: 'clin_new_2', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuk masadaki materyalleri sürekli yere atıyor. Bu davranışı "Duyusal Arayış" mı yoksa "Dikkat Çekme" mi olduğunu anlamak için yapacağınız ilk test nedir?',
      weightedOptions: [
        { label: 'Sözel Sorgulama: Çocuğa "Neden atıyorsun? Ses mi istiyorsun yoksa bana mı kızdın?" diye sorarım.', weights: { clinical: -0.5 }, analysisInsight: 'Bilişsel Hata: Sözel olmayan veya ifade edici dili zayıf çocuktan içgörü bekleme.' },
        { label: 'İşlevsel Analiz (A/B Testi): Ona kızdığımda (dikkat verdiğimde) artıyor mu, yoksa ben odayı terk ettiğimde veya ilgilenmediğimde de (sesi duymak için) atmaya devam ediyor mu diye test ederim.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Bilimsel Gözlem: Davranışın işlevini manipüle ederek test etme yetisi.' },
        { label: 'Standart Engelleme: Farketmez, her türlü engellerim ve "Atma" derim. Önemli olan davranışın durmasıdır.', weights: { clinical: -0.2, pedagogicalAnalysis: -0.5 }, analysisInsight: 'Yüzeysel Müdahale: İşlevi anlamadan yapılan müdahale davranışı söndürmez.' }
      ]
    },
    {
      id: 'clin_new_3', category: 'technicalExpertise', type: 'radio',
      text: 'Öğrenciniz derste uyuyor. Veli "Gece uyumadı, lütfen onu zorlamayın, bırakın uyusun" dedi. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Veli Talebine İtaat: Veliye saygı duyar, çocuğun üzerini örter ve uyumasına izin veririm. Dinlenmiş çocuk daha iyi öğrenir.', weights: { clinical: -0.8, institutionalLoyalty: -0.5 }, analysisInsight: 'Pasif Bakıcılık: Kurumun eğitim misyonunu ve profesyonel sınırları ihlal (Okul, otel değildir).' },
        { label: 'Eğitim Disiplini ve Aktivasyon: Çocuğun yüzünü yıkar, hareketli aktivitelerle, müzikle veya duyusal uyaranlarla uyarılmasını sağlarım. Burası okul, uyuma yeri değil; uykusu varsa evde kalmalıydı.', weights: { clinical: 1.0, sustainability: 0.5 }, analysisInsight: 'Profesyonel Duruş: Eğitimin sürekliliğini sağlama ve ortamın amacını koruma.' },
        { label: 'İdari İptal: "Uyuyan çocukla ders işleyemem" diyerek dersi iptal eder, çocuğu veliye teslim ederim.', weights: { clinical: -0.5 }, analysisInsight: 'Kolaycılık/Kaçış: Çözüm üretmek yerine süreci sonlandırma.' }
      ]
    },
    {
      id: 'clin_new_4', category: 'pedagogicalAnalysis', type: 'radio',
      text: 'Çocuğa "Kırmızı" kavramını öğretiyorsunuz. Masada sadece Kırmızı Kart var. "Kırmızıyı ver" dediniz ve çocuk verdi. Bu öğretim yeterli midir?',
      weightedOptions: [
        { label: 'Yeterlidir (Başarı): Evet, yönergeyi aldı ve doğru kartı verdi. Pekiştiririm.', weights: { pedagogicalAnalysis: -0.8 }, analysisInsight: 'Hatalı Öğretim: Şans faktörünü (50/50 bile değil, %100 şans) eleyememe. Masada başka seçenek yokken bilmesi anlamsızdır.' },
        { label: 'Ayırt Etme (Discrimination Training): Hayır, masaya "Mavi" veya başka bir çeldirici (distractor) koyup, ikisi arasından doğru olanı ayırt etmesini sağlamadan öğrenme gerçekleşmiş sayılmaz.', weights: { pedagogicalAnalysis: 1.0, clinical: 0.8 }, analysisInsight: 'Ayırt Etme Öğretimi: Gerçek öğrenme kriteri.' },
        { label: 'Genelleme Eksikliği: Hayır, kırmızı elma ve kırmızı araba da göstermeliyim.', weights: { pedagogicalAnalysis: 0.2 }, analysisInsight: 'Genelleme (Doğru bir adım ama öncelik ayırt etmedir).' }
      ]
    },
    {
      id: 'clin_new_5', category: 'technicalExpertise', type: 'radio',
      text: 'Koridorda, bir çocuğun ağladığını ve ebeveyninin sussun diye ona telefon verdiğini gördünüz. Tepkiniz?',
      weightedOptions: [
        { label: 'Kayıtsızlık: Benim öğrencim değil, karışmam. Her ailenin yoğurt yiyişi farklıdır.', weights: { clinical: -0.5, ethics: -0.2 }, analysisInsight: 'Kurumsal Sorumsuzluk.' },
        { label: 'Korku Kültürü: Gidip "Sakın vermeyin, otizm yapar, beyni erir!" diye korkutarak telefonu elinden alırım.', weights: { clinical: -0.2, empathy: -0.8 }, analysisInsight: 'Bilimsel Olmayan Korkutma ve Sınır İhlali.' },
        { label: 'Fırsat Eğitimi (Teachable Moment): Uygun bir zamanda (kriz anında değil), bu eylemin ağlamayı nasıl "ödüllendirdiğini" ve gelecekte ağlama krizlerini artıracağını ABC döngüsüyle, suçlamadan açıklarım.', weights: { clinical: 1.0, parentStudentRelations: 0.8 }, analysisInsight: 'Psiko-Eğitim: Ebeveyni suçlamadan mekanizmayı öğretme.' }
      ]
    }
  ],

  // ============================================================
  // KATMAN 2: ETİK SINIRLAR & VELİ DİPLOMASİSİ (SHADOW PLAY)
  // Kapsam: İş Etiği + Sınır Yönetimi
  // ============================================================
  ethics_parent: [
    {
      id: 'eth_shadow_1', category: 'workEthics', type: 'radio',
      text: 'Kurumun "Veliyle Şahsi Telefonlaşma Yasak" kuralı var. Ancak bir veli, çocuğunun gece geçirdiği nöbetin videosunu atmak için, panik halinde şahsi numaranızı istiyor. Tavrınız?',
      weightedOptions: [
        { label: 'İnsani İhlal (Savior Complex): Veririm, sağlık söz konusu, o an kural düşünülmez. Vicdanım prosedürden önce gelir.', weights: { workEthics: -0.5, empathy: 0.8, institutionalLoyalty: -0.6 }, analysisInsight: 'Sınır İhlali (Boundary Violation): İyi niyetli ama yönetilemez bir iletişim kapısı açma ve kurumsal protokolü delme riski.' },
        { label: 'Profesyonel Sınır ve Yönlendirme: Numaramı vermem. "Sizi çok iyi anlıyorum, lütfen videoyu Kurumsal WhatsApp hattına atın, ben şu an oradan takip ediyorum" diyerek hem erişilebilir olurum hem de sınırı korurum.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0, empathy: 0.3 }, analysisInsight: 'Profesyonel Sınır: Kriz anında bile kurumsal kanalı koruma ve veliyi regüle etme.' },
        { label: 'Gizli Anlaşma: Numaramı veririm ama "Sakın beni aramayın, sadece videoyu atın ve sonra silin, yönetim duymasın" derim.', weights: { workEthics: -0.3, sustainability: -0.5 }, analysisInsight: 'Naiflik ve Güvenilirlik Sorunu: Sınırın delineceğini öngörememe ve kurumdan gizli iş yapma.' }
      ]
    },
    {
      id: 'eth_shadow_2', category: 'parentStudentRelations', type: 'radio',
      text: 'Çocuğun 6 aydır yerinde saydığını (Plato) görüyorsunuz ama Koordinatör veliye "Her şey harika gidiyor" diyor. Veli size dönüp "Hocam sizce de öyle mi, ben ilerleme göremiyorum?" diye sordu. Cevabınız?',
      weightedOptions: [
        { label: 'Bürokratik Sığınma: "Müdürüm ne diyorsa doğrudur, ben yorum yapamam, yetkim yok." derim.', weights: { workEthics: -0.6, institutionalLoyalty: 0.4, personality: -0.4 }, analysisInsight: 'Bürokratik Sığınma: Pasif suç ortaklığı ve mesleki kimliksizlik.' },
        { label: 'Yıkıcı Dürüstlük: "Hayır, çocuğunuz hiç ilerlemiyor, sizi oyalıyorlar. Bence başka yer bakın." derim.', weights: { institutionalLoyalty: -1.0, workEthics: 0.3, personality: -0.6 }, analysisInsight: 'Kurumsal Sabotaj: Doğruyu söylerken kurumu yıkma ve ekip içi güveni bitirme.' },
        { label: 'Diplomatik ve Analitik Dürüstlük: "Bazı alanlarda (örn: uyum) güzel çabaları var ancak X konusunda haklısınız, bir duraksama var. Bunu aşmak için strateji değişikliği planlıyoruz, detayları toplantıda konuşalım." diyerek gerçeği yumuşatmadan ama profesyonelce sunarım.', weights: { workEthics: 1.0, parentStudentRelations: 1.0, institutionalLoyalty: 0.6 }, analysisInsight: 'Diplomatik Dürüstlük: Kurumu korurken gerçeği manipüle etmeme, veliyi bilgilendirme ve çözüm odaklılık.' }
      ]
    },
    {
      id: 'eth_shadow_3', category: 'workEthics', type: 'radio',
      text: 'Seans sırasında çocuğun vücudunda bir morluk gördünüz. Veliye sordunuz, "Düştü" dedi ama çocuk tedirgin. (İstismar şüphesi). Ne yaparsınız?',
      weightedOptions: [
        { label: 'İnkar ve Güven: Veliye inandığımı söylerim, aile işine karışmak haddim değil. Yanlış anlaşılırsam başım belaya girer.', weights: { workEthics: -1.0, clinical: -0.8 }, analysisInsight: 'İhmal: Çocuğun güvenliğini riske atma ve yasal sorumluluğu yok sayma.' },
        { label: 'Dürtüsel Eylem: Hemen polisi veya sosyal hizmetleri ararım. Çocuğu o aileye teslim etmem.', weights: { workEthics: 0.6, institutionalLoyalty: -0.4, sustainability: -0.3 }, analysisInsight: 'Dürtüsel Eylem: Kurumsal protokolü ve silsileyi atlayarak, kanıt olmadan kriz yaratma riski.' },
        { label: 'Prosedürel Yetkinlik ve Kayıt: Vücut haritasına (Body Chart) morluğu işler, tutanak tutar ve derhal Kurum Müdürü/Psikoloğu ile "Kritik Vaka Toplantısı" talep ederim. Süreci kurumla birlikte yönetirim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0, clinical: 0.9 }, analysisInsight: 'Prosedürel Yetkinlik: Yasal ve kurumsal silsileyi doğru işletme, veriyi kaydetme.' }
      ]
    },
    {
      id: 'eth_new_1', category: 'workEthics', type: 'radio',
      text: 'Veli size zarf içinde "Hocam bu ekstradan sizin emeğiniz için, lütfen kabul edin, yoksa kırılırım" diyerek para uzattı. Odada kamera yok.',
      weightedOptions: [
        { label: 'Kabul ve Rasyonalizasyon: Alırım, sonuçta çok emek veriyorum ve maaşım düşük. Bu bir hediye, rüşvet değil.', weights: { workEthics: -1.0, integrity: -1.0 }, analysisInsight: 'Etik İhlal: Profesyonel ilişkinin ticari ilişkiye dönüşmesi.' },
        { label: 'Etik ve Nazik Red: "Düşünmeniz beni çok mutlu etti ancak prensiplerim ve kurum kuralları gereği bunu kabul edemem. Benim en büyük ödülüm çocuğun başarısıdır." diyerek kesin bir dille reddederim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Etik Duruş: Saygılı ama net sınır.' },
        { label: 'Gizli İttifak: Alırım ama "Aramızda kalsın, kimseye söylemeyin" derim.', weights: { workEthics: -1.0 }, analysisInsight: 'Gizli İttifak: Veli ile suç ortaklığı kurma.' }
      ]
    },
    {
      id: 'eth_new_5', category: 'workEthics', type: 'radio',
      text: 'Veli, "Hocam hafta sonu evde 2 saat özel ders verir misiniz? Kurumun haberi olmasın, daha iyi ücret öderim." teklifinde bulundu.',
      weightedOptions: [
        { label: 'Fırsatçı Yaklaşım: Kabul ederim, ek gelir olur. Kurum benim hafta sonuma karışamaz.', weights: { workEthics: -1.0, institutionalLoyalty: -1.0 }, analysisInsight: 'Etik Dışı / Sadakatsizlik: Kurumun öğrencisini çalma (poaching) ve rekabet yasağını ihlal.' },
        { label: 'Yetersiz Red: "Kurumda çalışmam daha verimli oluyor" diyerek geçiştiririm ama kapıyı tam kapatmam.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Yetersiz Red: Veliye tekrar teklif etme cesareti verme.' },
        { label: 'Tam Sadakat ve Raporlama: "Kurum sözleşmem ve meslek etiği gereği dışarıda ders veremem. Bu eğitimlerin kurum çatısı altında sürmesi çocuğun yararınadır." derim ve durumu yönetime raporlarım.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Tam Etik Sadakat ve Şeffaflık.' }
      ]
    }
  ],

  // ============================================================
  // KATMAN 3: PSİKOLOJİK DAYANIKLILIK & TAKIM (SHADOW PLAY)
  // Kapsam: Resilians (Direnç)
  // ============================================================
  resilience_team: [
    {
      id: 'res_shadow_1', category: 'sustainability', type: 'radio',
      text: 'Partner öğretmeniniz (eküri) derse sürekli geç geliyor ve bu yüzden sizin seanslarınız sarkıyor. Yönetim bunu fark etmiyor. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Hiyerarşik Çözüm (İspiyon): Onu hemen müdüre şikayet ederim. Herkes işini düzgün yapsın, ben mağdur olamam.', weights: { sustainability: 0.3, fit: -0.6 }, analysisInsight: 'İspiyonculuk/Çatışma: Takım içi güveni zedeleme ve sorunu birebir çözme yetisinden yoksunluk.' },
        { label: 'Pasif Agresyon: Küserek konuşmam, ben de onun işlerini aksatırım, belki anlar.', weights: { sustainability: -0.6, personality: -0.7 }, analysisInsight: 'Pasif Agresyon: Profesyonellik dışı çocuksu tepki.' },
        { label: 'Olgun İletişim (Assertiveness): Onu kenara çeker, "Geç kalman benim planımı bozuyor ve beni zor durumda bırakıyor, buna bir çözüm bulalım" diyerek "Ben Dili" ile konuşurum. Düzelmezse o zaman yönetime giderim.', weights: { sustainability: 1.0, fit: 1.0, personality: 0.9 }, analysisInsight: 'Olgun İletişim: Sorunu kaynağında, çatışma yaratmadan çözme girişimi.' }
      ]
    },
    {
      id: 'res_shadow_2', category: 'sustainability', type: 'radio',
      text: 'Çok emek verdiğiniz bir öğrenci, 3 ayın sonunda size vurdu ve yüzünüze tükürdü. O an hissettiğiniz duygu ve eyleminiz?',
      weightedOptions: [
        { label: 'Duygusal Çöküş ve Tepki: Öfkelenirim ve "Terbiyesiz, bir daha yapma!" diye bağırırım. İnsanım sonuçta, benim de bir onurum var.', weights: { sustainability: -1.0, clinical: -1.0 }, analysisInsight: 'Duygusal Çöküş: Davranışı kişiselleştirme ve profesyonel maskeyi düşürme.' },
        { label: 'İçselleştirme ve Kırılganlık: Çok üzülürüm, "Demek ki ben başarısızım, bana saygısı yok, beni sevmiyor" diye düşünürüm.', weights: { sustainability: -0.6, personality: -0.4 }, analysisInsight: 'Kırılganlık: Özgüven kaybı ve tükenmişlik (Burnout) sinyali.' },
        { label: 'Profesyonel Zırh (Depersonalization): Duygusal olarak etkilenmemeye çalışırım. "Bu şahsıma değil, otoriteye veya talebe verilen bir tepki" derim ve ABC kaydına "Saldırganlık" olarak nötr şekilde işlerim.', weights: { sustainability: 1.0, clinical: 1.0, workEthics: 0.8 }, analysisInsight: 'Profesyonel Zırh: Davranışı klinik bir veri olarak görme ve soğukkanlılık.' }
      ]
    },
    {
      id: 'res_new_1', category: 'sustainability', type: 'radio',
      text: 'Gün sonunda çok yorgunsunuz, son seansın öğrencisi ise çok hiperaktif ve zorlayıcı. İçinizden "Keşke gelmese" diye geçirdiniz ve öğrenci geldi. Tavrınız?',
      weightedOptions: [
        { label: 'Yansıtma ve Sitem: Çocuğa "Bugün uslu dur, başım ağrıyor, beni yorma" derim ve günü pasif geçiririm.', weights: { sustainability: -0.5 }, analysisInsight: 'Profesyonellik Dışı: Kendi sorununu çocuğa yükleme.' },
        { label: 'Profesyonel Dayanıklılık (Stamina): Enerjimi toplamak için bir kahve içer, yüzümü yıkar ve "Sahneye Çıkış" moduna geçerim. Benim yorgunluğum çocuğun eğitim hakkını etkilememeli.', weights: { sustainability: 1.0, workEthics: 1.0 }, analysisInsight: 'Profesyonel Dayanıklılık: Duygusal durumu yöneterek performansı koruma.' },
        { label: 'Tükenmişlik (Burnout): Çocuğu serbest bırakır, eline tablet verir, ben de masada dinlenirim.', weights: { sustainability: -1.0, workEthics: -1.0 }, analysisInsight: 'Mesleki Tükenmişlik ve İhmal.' }
      ]
    }
  ],

  // ============================================================
  // KATMAN 4: VİZYON & KURUMSAL AİDİYET (SHADOW PLAY)
  // Kapsam: Kurumsal Sadakat + Gelişime Açıklık
  // ============================================================
  vision_loyalty: [
    {
      id: 'vis_shadow_1', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurum size pahalı bir eğitim olan "X Yöntemi"ni finanse edecek ama karşılığında 2 yıl kurumdan ayrılmama taahhüdü (sözleşme) istiyor. İmzalar mısınız?',
      weightedOptions: [
        { label: 'Özgürlükçü Yaklaşım: Asla imzalamam, özgürlüğüm kısıtlanamaz. Geleceğin ne getireceği belli olmaz, ben eğitimi kendim alırım.', weights: { institutionalLoyalty: -0.6, developmentOpenness: 0.2 }, analysisInsight: 'Bağlılık Sorunu: Yatırıma ve uzun vadeli işbirliğine kapalı profil.' },
        { label: 'Stratejik/Fırsatçı Yaklaşım: İmzalarım ama daha iyi teklif gelirse tazminatı öder kaçarım. Önemli olan sertifikayı almaktır.', weights: { institutionalLoyalty: -0.8, workEthics: -0.6 }, analysisInsight: 'Etik Risk: Güvenilmez ve fırsatçı profil.' },
        { label: 'Kariyer Ortaklığı: Memnuniyetle imzalarım. Kurumun bana yatırım yapması, bana değer verdiğini gösterir. 2 yıl zaten uzmanlaşmak için gereken süredir.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Kariyer Ortaklığı: Kurumla büyüme vizyonu ve karşılıklı güven.' }
      ]
    },
    {
      id: 'vis_shadow_2', category: 'developmentOpenness', type: 'radio',
      text: 'Yönetim, Yapay Zeka (AI) destekli, çok detaylı ama öğrenmesi zor yeni bir raporlama sistemine geçiyor. İlk tepkiniz?',
      weightedOptions: [
        { label: 'Değişim Direnci: "Eski usül kağıt kalem daha iyiydi, ne gerek var bu kadar teknolojiye? Bizim işimiz çocukla, bilgisayarla değil." diye direnç gösteririm.', weights: { developmentOpenness: -0.7, institutionalLoyalty: -0.3 }, analysisInsight: 'Değişim Direnci (Resistance to Change): Statükocu ve yeniliğe kapalı.' },
        { label: 'Pasif Direniş (Uyumsuzluk): "Tamam" derim ama kullanmam, başkasına yaptırırım veya eksik yaparım. Zamanla vazgeçerler.', weights: { workEthics: -0.6, developmentOpenness: -0.4 }, analysisInsight: 'Pasif Direniş: Sinsi uyumsuzluk ve sistem sabotajı.' },
        { label: 'Gelişim Zihniyeti (Growth Mindset): Zor olsa da öğrenmek için ekstra mesai harcarım. Teknoloji mesleğimizin geleceğidir ve buna adapte olmalıyım.', weights: { developmentOpenness: 1.0, sustainability: 0.6 }, analysisInsight: 'Gelişim Zihniyeti: Yeniliğe adaptasyon ve öğrenme hevesi.' }
      ]
    },
    {
      id: 'vis_new_1', category: 'institutionalLoyalty', type: 'radio',
      text: 'Rakip bir kurum size mevcut maaşınızın %20 fazlasını teklif etti. Tepkiniz ne olur?',
      weightedOptions: [
        { label: 'Finansal Odak: Hemen kabul eder, istifa ederim. Profesyonellik paradır, kim çok verirse oraya giderim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Fırsatçı (Mercenary) Profil: Sadece paraya odaklı.' },
        { label: 'Şantaj/Pazarlık: Teklifi mevcut kurumumla paylaşır, "Bakın bana ne veriyorlar, siz de verin yoksa giderim" diye pazarlık yaparım.', weights: { institutionalLoyalty: -0.5, negotiation: 0.5 }, analysisInsight: 'Riskli Pazarlık: Sadakati silah olarak kullanma.' },
        { label: 'Bütüncül Değerlendirme: Sadece paraya bakmam. Mevcut kurumumdaki huzurum, ekibim, aldığım eğitimler ve manevi tatminim %20 farktan daha değerliyse reddederim. Sadakat bir bütündür.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Derin Bağlılık: Kurum kültürünü ve manevi tatmini önemseme.' }
      ]
    }
  ]
};

export const TURKISH_UNIVERSITIES = [
  "Abdullah Gül Üniversitesi", "Acıbadem Mehmet Ali Aydınlar Üniversitesi", "Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi",
  "Adıyaman Üniversitesi", "Afyon Kocatepe Üniversitesi", "Afyonkarahisar Sağlık Bilimleri Üniversitesi", "Ağrı İbrahim Çeçen Üniversitesi",
  "Akdeniz Üniversitesi", "Aksaray Üniversitesi", "Alanya Alaaddin Keykubat Üniversitesi", "Alanya Üniversitesi", "Altınbaş Üniversitesi",
  "Amasya Üniversitesi", "Anadolu Üniversitesi", "Anka Teknoloji Üniversitesi", "Ankara Bilim Üniversitesi", "Ankara Hacı Bayram Veli Üniversitesi",
  "Ankara Medipol Üniversitesi", "Ankara Müzik ve Güzel Sanatlar Üniversitesi", "Ankara Sosyal Bilimler Üniversitesi", "Ankara Üniversitesi",
  "Ankara Yıldırım Beyazıt Üniversitesi", "Antalya Belek Üniversitesi", "Antalya Bilim Üniversitesi", "Ardahan Üniversitesi", "Artvin Çoruh Üniversitesi",
  "Ataşehir Adıgüzel Meslek Yüksekokulu", "Atatürk Üniversitesi", "Atılım Üniversitesi", "Avrasya Üniversitesi", "Aydın Adnan Menderes Üniversitesi",
  "Bahçeşehir Üniversitesi", "Balıkesir Üniversitesi", "Bandırma Onyedi Eylül Üniversitesi", "Bartın Üniversitesi", "Başkent Üniversitesi",
  "Batman Üniversitesi", "Bayburt Üniversitesi", "Beykent Üniversitesi", "Beykoz Üniversitesi", "Bezmialem Vakıf Üniversitesi",
  "Bilecik Şeyh Edebali Üniversitesi", "Bingöl Üniversitesi", "Biruni Üniversitesi", "Bitlis Eren Üniversitesi", "Boğaziçi Üniversitesi",
  "Bolu Abant İzzet Baysal Üniversitesi", "Burdur Mehmet Akif Ersoy Üniversitesi", "Bursa Teknik Üniversitesi", "Bursa Uludağ Üniversitesi",
  "Çağ Üniversitesi", "Çanakkale Onsekiz Mart Üniversitesi", "Çankaya Üniversitesi", "Çankırı Karatekin Üniversitesi", "Çukurova Üniversitesi",
  "Demiroğlu Bilim Üniversitesi", "Dicle Üniversitesi", "Doğuş Üniversitesi", "Dokuz Eylül Üniversitesi", "Düzce Üniversitesi", "Ege Üniversitesi",
  "Erciyes Üniversitesi", "Erzincan Binali Yıldırım Üniversitesi", "Erzurum Teknik Üniversitesi", "Eskişehir Osmangazi Üniversitesi",
  "Eskişehir Teknik Üniversitesi", "Fatih Sultan Mehmet Vakıf Üniversitesi", "Fenerbahçe Üniversitesi", "Fırat Üniversitesi", "Galatasaray Üniversitesi",
  "Gazi Üniversitesi", "Gaziantep İslam Bilim ve Teknoloji Üniversitesi", "Gaziantep Üniversitesi", "Gebze Teknik Üniversitesi", "Giresun Üniversitesi",
  "Gümüşhane Üniversitesi", "Hacettepe Üniversitesi", "Hakkari Üniversitesi", "Haliç Üniversitesi", "Harran Üniversitesi", "Hasan Kalyoncu Üniversitesi",
  "Hatay Mustafa Kemal Üniversitesi", "Hitit Üniversitesi", "Iğdır Üniversitesi", "Isparta Uygulamalı Bilimler Üniversitesi", "Işık Üniversitesi",
  "İbn Haldun Üniversitesi", "İhsan Doğramacı Bilkent Üniversitesi", "İnönü Üniversitesi", "İskenderun Teknik Üniversitesi", "İstanbul 29 Mayıs Üniversitesi",
  "İstanbul Arel Üniversitesi", "İstanbul Atlas Üniversitesi", "İstanbul Aydın Üniversitesi", "İstanbul Ayvansaray Üniversitesi", "İstanbul Bilgi Üniversitesi",
  "İstanbul Galata Üniversitesi", "İstanbul Gelişim Üniversitesi", "İstanbul Gedik Üniversitesi", "İstanbul Kent Üniversitesi", "İstanbul Kültür Üniversitesi",
  "İstanbul Medeniyet Üniversitesi", "İstanbul Medipol Üniversitesi", "İstanbul Okan Üniversitesi", "İstanbul Rumeli Üniversitesi", "İstanbul Sabahattin Zaim Üniversitesi",
  "İstanbul Sağlık ve Teknoloji Üniversitesi", "İstanbul Şişli Meslek Yüksekokulu", "İstanbul Teknik Üniversitesi", "İstanbul Ticaret Üniversitesi",
  "İstanbul Topkapı Üniversitesi", "İstanbul Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "İstanbul Yeni Yüzyıl Üniversitesi", "İstinye Üniversitesi",
  "İzmir Bakırçay Üniversitesi", "İzmir Demokrasi Üniversitesi", "İzmir Ekonomi Üniversitesi", "İzmir Katip Çelebi Üniversitesi",
  "İzmir Kavram Meslek Yüksekokulu", "İzmir Tınaztepe Üniversitesi", "İzmir Yüksek Teknoloji Enstitüsü", "Kadir Has Üniversitesi",
  "Kafkas Üniversitesi", "Kahramanmaraş İstiklal Üniversitesi", "Kahramanmaraş Sütçü İmam Üniversitesi", "Kapadokya Üniversitesi",
  "Karabük Üniversitesi", "Karadeniz Teknik Üniversitesi", "Karamanoğlu Mehmetbey Üniversitesi", "Kastamonu Üniversitesi", "Kayseri Üniversitesi",
  "Kırıkkale Üniversitesi", "Kırklareli Üniversitesi", "Kırşehir Ahi Evran Üniversitesi", "Kilis 7 Aralık Üniversitesi", "Kocaeli Sağlık ve Teknoloji Üniversitesi",
  "Kocaeli Üniversitesi", "Koç Üniversitesi", "Konya Gıda ve Tarım Üniversitesi", "Konya Teknik Üniversitesi", "KTO Karatay Üniversitesi",
  "Kütahya Dumlupınar Üniversitesi", "Kütahya Sağlık Bilimleri Üniversitesi", "Lokman Hekim Üniversitesi", "Malatya Turgut Özal Üniversitesi",
  "Manisa Celal Bayar Üniversitesi", "Mardin Artuklu Üniversitesi", "Marmara Üniversitesi", "MEF Üniversitesi", "Mersin Üniversitesi",
  "Mimar Sinan Güzel Sanatlar Üniversitesi", "Mudanya Üniversitesi", "Muğla Sıtkı Koçman Üniversitesi", "Munzur Üniversitesi", "Muş Alparslan Üniversitesi",
  "Necmettin Erbakan Üniversitesi", "Nevşehir Hacı Bektaş Veli Üniversitesi", "Niğde Ömer Halisdemir Üniversitesi", "Nişantaşı Üniversitesi",
  "Nuh Naci Yazgan Üniversitesi", "Ondokuz Mayıs Üniversitesi", "Ordu Üniversitesi", "Orta Doğu Teknik Üniversitesi", "Osmaniye Korkut Ata Üniversitesi",
  "Ostim Teknik Üniversitesi", "Özyeğin Üniversitesi", "Pamukkale Üniversitesi", "Piri Reis Üniversitesi", "Recep Tayyip Erdoğan Üniversitesi",
  "Sabancı Üniversitesi", "Sakarya Uygulamalı Bilimler Üniversitesi", "Sakarya Üniversitesi", "Sanko Üniversitesi", "Sağlık Bilimleri Üniversitesi",
  "Selçuk Üniversitesi", "Siirt Üniversitesi", "Sinop Üniversitesi", "Sivas Bilim ve Teknoloji Üniversitesi", "Sivas Cumhuriyet Üniversitesi",
  "Süleyman Demirel Üniversitesi", "Şırnak Üniversitesi", "Tarsus Üniversitesi", "TED Üniversitesi", "Tekirdağ Namık Kemal Üniversitesi",
  "TOBB Ekonomi ve Teknoloji Üniversitesi", "Tokat Gaziosmanpaşa Üniversitesi", "Toros Üniversitesi", "Trabzon Üniversitesi", "Trakya Üniversitesi",
  "Türk Hava Kurumu Üniversitesi", "Türk-Alman Üniversitesi", "Türkiye Uluslararası İslam, Bilim ve Teknoloji Üniversitesi", "Türk-Japon Bilim ve Teknoloji Üniversitesi",
  "Ufuk Üniversitesi", "Uşak Üniversitesi", "Üsküdar Üniversitesi", "Van Yüzüncü Yıl Üniversitesi", "Yalova Üniversitesi", "Yaşar Üniversitesi",
  "Yeditepe Üniversitesi", "Yıldız Teknik Üniversitesi", "Yozgat Bozok Üniversitesi", "Yüksek İhtisas Üniversitesi", "Zonguldak Bülent Ecevit Üniversitesi"
];

export const TURKISH_DEPARTMENTS = [
  "Özel Eğitim Öğretmenliği",
  "Zihin Engelliler Öğretmenliği",
  "İşitme Engelliler Öğretmenliği",
  "Görme Engelliler Öğretmenliği",
  "Üstün Zekalılar Öğretmenliği",
  "Okul Öncesi Öğretmenliği",
  "Sınıf Öğretmenliği",
  "Rehberlik ve Psikolojik Danışmanlık (PDR)",
  "Psikoloji",
  "Çocuk Gelişimi (Lisans)",
  "Çocuk Gelişimi (Önlisans)",
  "Dil ve Konuşma Terapisi",
  "Ergoterapi",
  "Fizyoterapi ve Rehabilitasyon",
  "Odyoloji",
  "Sosyal Hizmet",
  "İngilizce Öğretmenliği",
  "Türkçe Öğretmenliği",
  "Matematik Öğretmenliği (İlköğretim)",
  "Fen Bilgisi Öğretmenliği",
  "Sosyal Bilgiler Öğretmenliği",
  "Beden Eğitimi ve Spor Öğretmenliği",
  "Müzik Öğretmenliği",
  "Görsel Sanatlar / Resim-İş Öğretmenliği",
  "Türk Dili ve Edebiyatı Öğretmenliği",
  "Tarih Öğretmenliği",
  "Coğrafya Öğretmenliği",
  "Felsefe Grubu Öğretmenliği",
  "Matematik Öğretmenliği (Lise)",
  "Fizik Öğretmenliği",
  "Kimya Öğretmenliği",
  "Biyoloji Öğretmenliği",
  "Almanca Öğretmenliği",
  "Fransızca Öğretmenliği",
  "Arapça Öğretmenliği",
  "Bilgisayar ve Öğretim Teknolojileri Öğretmenliği (BÖTE)",
  "Teknoloji ve Tasarım Öğretmenliği"
];
