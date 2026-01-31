
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
  
  clinical_logic: [
    {
      id: 'clin_shadow_1', category: 'technicalExpertise', type: 'radio',
      text: 'Yoğun bir "Problem Davranış" (Örn: Kafasını masaya vurma) anında, çocuğun burnunun aktığını ve salyasının aktığını fark ettiniz. Bu durum çocuğun dikkatini de dağıtıyor. Saniyelik kararınız?',
      weightedOptions: [
        { label: 'Hijyen ve Şefkat Odaklı Müdahale: Öncelik çocuğun konforu ve hijyenidir. Davranışı durdurmaya çalışırken aynı zamanda cebimden peçete çıkarıp yüzünü silerim, böylece rahatlayıp sakinleşmesine yardımcı olurum.', weights: { clinical: -0.6, empathy: 1.0, sustainability: -0.2 }, analysisInsight: 'Şefkat Tuzağı: Davranış anında fiziksel temas ve bakım vererek, problem davranışın işlevini "ilgi" veya "rahatlama" ile farkında olmadan pekiştirme riski.' },
        { label: 'Klinik Sadakat ve Planlı Görmezden Gelme: Kafasını korumak için el yastığı yaparım (güvenlik) ancak göz teması kurmadan, nötr bir yüzle krizin sönmesini beklerim. Temizlik, kriz tamamen bitip çocuk regüle olduktan sonra yapılır.', weights: { clinical: 1.0, empathy: 0.2, sustainability: 0.8 }, analysisInsight: 'Klinik Disiplin: Güvenliği sağlarken davranışı beslememe (Extinction) becerisi.' },
        { label: 'Sözel Yönerge ve Kontrol: Çocuğun ellerini tutarak "Yapma, burnunu silelim" derim ve sakinleşmesi için sözel telkinlerde bulunurum.', weights: { clinical: -0.8, empathy: 0.2, sustainability: -0.5 }, analysisInsight: 'Veri Kirliliği: Kriz anında verilen sözel uyaranlar ve temas, davranışı besleyen "sosyal dikkat" hatasına dönüşebilir.' },
        { label: 'Seans İptali ve Aileye Devir: Hijyen sorunu ve kendine zarar verme riski birleştiğinde ders işlenemez. Seansı sonlandırır, çocuğu temizlemesi ve sakinleştirmesi için veliye teslim ederim.', weights: { clinical: -1.0, empathy: -0.5, institutionalLoyalty: -0.5 }, analysisInsight: 'Mesleki Kaçınma: Terapistin kriz anında otoriteyi ve sorumluluğu terk etmesi.' }
      ]
    },
    // YENİ SORULAR (KLİNİK MUHAKEME - Toplam 10 Adet Eklendi)
    {
      id: 'clin_new_add_1', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuğa "Bardak" kavramını öğretirken sadece "kırmızı plastik bir bardak" kullanılarak öğretim yapılmış. Çocuk başka hiçbir bardağı tanımıyor. Bu durumun klinik adı nedir ve nasıl düzeltilir?',
      weightedOptions: [
        { label: 'Uyaran Kontrolü Hatası: Öğretim "Çoklu Örnekler" (Multiple Exemplars) ile yapılmamış. Hemen cam, kağıt, kulplu, büyük, küçük farklı bardaklarla çalışarak genelleme sağlanmalı.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Genelleme Hatası Tespiti: Kavram öğretiminin temel prensibi.' },
        { label: 'Zeka Geriliği: Çocuk soyutlama yapamıyor, zeka seviyesi buna uygun değil. Daha basit kavramlara dönülmeli.', weights: { clinical: -0.5 }, analysisInsight: 'Yanlış Etiketleme: Öğretim hatasını çocuğun kapasitesine bağlama.' },
        { label: 'Dikkat Eksikliği: Çocuk bardağın rengine odaklanmış, şekline değil. Kırmızı olan her şeye bardak diyebilir.', weights: { clinical: 0.2 }, analysisInsight: 'Kısmen Doğru ama Yetersiz: Sorun dikkat değil, öğretim tasarımıdır.' },
        { label: 'Unutma: Çocuk öğrenmiş ama unutmuş. Tekrar edilmeli.', weights: { clinical: -0.2 }, analysisInsight: 'Hatalı Tespit: Yanlış öğrenme, unutma değildir.' }
      ]
    },
    {
      id: 'clin_new_add_2', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk masadaki materyalleri sürekli yere atıyor. Bu davranışı "Duyusal Arayış" mı yoksa "Dikkat Çekme" mi olduğunu anlamak için yapacağınız ilk test nedir?',
      weightedOptions: [
        { label: 'Sözel Sorgulama: Çocuğa "Neden atıyorsun? Ses mi istiyorsun yoksa bana mı kızdın?" diye sorarım.', weights: { clinical: -0.5 }, analysisInsight: 'Bilişsel Hata: Sözel olmayan veya ifade edici dili zayıf çocuktan içgörü bekleme.' },
        { label: 'İşlevsel Analiz (A/B Testi): Ona kızdığımda (dikkat verdiğimde) artıyor mu, yoksa ben odayı terk ettiğimde veya ilgilenmediğimde de (sesi duymak için) atmaya devam ediyor mu diye test ederim.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Bilimsel Gözlem: Davranışın işlevini manipüle ederek test etme yetisi.' },
        { label: 'Standart Engelleme: Farketmez, her türlü engellerim ve "Atma" derim. Önemli olan davranışın durmasıdır.', weights: { clinical: -0.2, pedagogicalAnalysis: -0.5 }, analysisInsight: 'Yüzeysel Müdahale: İşlevi anlamadan yapılan müdahale davranışı söndürmez.' },
        { label: 'Ceza Yöntemi: Her attığında eline hafifçe vururum.', weights: { clinical: -1.0, ethics: -1.0 }, analysisInsight: 'Etik İhlal ve Yanlış Yöntem.' }
      ]
    },
    {
      id: 'clin_new_add_3', category: 'technicalExpertise', type: 'radio',
      text: '"İpucu Bağımlılığı" (Prompt Dependency) geliştiren bir öğrenci, siz "hadi" demeden veya parmağınızla göstermeden asla harekete geçmiyor. Hata nerede yapılmıştır?',
      weightedOptions: [
        { label: 'İpucu Silikleştirme Hatası: İpuçları zamanında ve sistematik olarak azaltılmamış (Fading), sürekli tam destek verilmiş.', weights: { clinical: 1.0 }, analysisInsight: 'Öğretim Hatası Tespiti: Bağımsızlık kazandırmada başarısızlık.' },
        { label: 'Çocuğun İnatçılığı: Çocuk tembellik yapıyor, aslında biliyor.', weights: { clinical: -0.5 }, analysisInsight: 'Çocuğu Suçlama: Davranışsal prensipleri göz ardı etme.' },
        { label: 'Pekiştireç Yetersizliği: Ödül az geliyordur, daha büyük ödül verilmeli.', weights: { clinical: 0.3 }, analysisInsight: 'Kısmen İlgili: Motivasyon bir faktördür ama teknik hata ipucundadır.' },
        { label: 'Zorluk Seviyesi: Beceri çocuğa ağır gelmiştir.', weights: { clinical: 0.0 }, analysisInsight: 'İlgisiz: Beceri ağır olsa yanlış yapar, beklemez.' }
      ]
    },
    {
      id: 'clin_new_add_4', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk derste sürekli "kıkırdıyor" ve kendi kendine konuşuyor (Vokal Stereotipi). Bu durum dersi bölüyor. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Uyaran Kontrolü (RIRD): Kıkırdama başladığı an, çocuğa ardışık 3 basit vokal yönerge (Adın ne? Bu ne renk? Say bakalım) vererek o davranışı kesintiye uğratır ve uygun davranışı pekiştiririm.', weights: { clinical: 1.0, pedagogicalAnalysis: 0.8 }, analysisInsight: 'Aktif Müdahale: Stereotipiyi işleve uygun şekilde kesme ve yönlendirme.' },
        { label: 'Sürekli Uyarı: "Sus, sessiz ol, gülme" diyerek sürekli uyarırım.', weights: { clinical: -0.5 }, analysisInsight: 'Sosyal Pekiştirme Hatası: Uyarılar davranışı besleyebilir.' },
        { label: 'Görmezden Gelme: Hiç tepki vermem, kendi kendine susmasını beklerim.', weights: { clinical: 0.2 }, analysisInsight: 'Pasif Yaklaşım: Bazen işe yarar ama otostimülasyon (haz) varsa sönmez.' },
        { label: 'Kızma: Sert bir bakış atarım.', weights: { clinical: -0.3 }, analysisInsight: 'Yetersiz Müdahale.' }
      ]
    },
    {
      id: 'clin_new_add_5', category: 'technicalExpertise', type: 'radio',
      text: 'Bir beceriyi öğretirken "Hatasız Öğretim" (Errorless Teaching) tekniği kullanıyorsunuz. Çocuk yanlış yapmaya yeltendiği an ne yaparsınız?',
      weightedOptions: [
        { label: 'Anında Müdahale (Block & Prompt): Yanlış yapmasına fırsat vermeden, hemen fiziksel veya sözel ipucu vererek doğruyu yapmasını sağlarım. Yanlışın pekişmesini engellerim.', weights: { clinical: 1.0 }, analysisInsight: 'Teknik Doğruluk: Yanlış öğrenmeyi engelleme.' },
        { label: 'Deneme Yanılma: Yanlış yapsın, "Hayır" diyerek doğrusunu gösteririm. Hata yaparak öğrenir.', weights: { clinical: -0.8 }, analysisInsight: 'Yöntem İhlali: Hatasız öğretim prensibine aykırı.' },
        { label: 'Bekleme: Belki düzeltir diye beklerim.', weights: { clinical: -0.5 }, analysisInsight: 'Zaman Kaybı ve Hata Riski.' },
        { label: 'İpucunu Kaldırma: Kendi başına yapması için geri çekilirim.', weights: { clinical: -1.0 }, analysisInsight: 'Tam Hata: Çocuk zaten yapamıyor, destek çekilmemeli.' }
      ]
    },
    {
      id: 'clin_new_add_6', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk "Değişken Oranlı" (VR) pekiştirme tarifesinde. Yani bazen 3, bazen 5 doğru tepkide ödül alıyor. Bugün çok isteksiz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Tarife Yoğunlaştırma (Thickening): Motivasyonu artırmak için geçici olarak "Sürekli Pekiştirme" (FR1) tarifesine döner, her doğruyu ödüllendirir, momentum kazanınca tekrar seyreltirim.', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Klinik Esneklik: Çocuğun anlık durumuna göre tarifeyi ayarlama.' },
        { label: 'Israr: Tarifeyi bozmam, çocuk kurallara uymalıdır. Yoksa şımarır.', weights: { clinical: -0.5, empathy: -0.5 }, analysisInsight: 'Katılık: Performans kaybına yol açar.' },
        { label: 'Ceza: Yapmazsan teneffüs yok derim.', weights: { clinical: -0.8 }, analysisInsight: 'Tehdit Odaklılık.' },
        { label: 'Dersi Bitirme: Bugün havasında değil diyerek dersi bitiririm.', weights: { clinical: -0.5 }, analysisInsight: 'Kaçış.' }
      ]
    },
    {
      id: 'clin_new_add_7', category: 'technicalExpertise', type: 'radio',
      text: '"Sönme Patlaması" (Extinction Burst) nedir ve bu durumda ne yapılır?',
      weightedOptions: [
        { label: 'Kriz Zirvesi: Davranışın sönmeden hemen önce şiddetlenmesidir. Asla geri adım atılmamalı, kararlılıkla devam edilmelidir. Bu, yöntemin işe yaradığının kanıtıdır.', weights: { clinical: 1.0 }, analysisInsight: 'Teorik Hakimiyet: Sürecin doğasını bilme ve paniklememe.' },
        { label: 'Yöntem Hatası: Davranış arttığına göre yöntem yanlıştır, hemen bırakılmalıdır.', weights: { clinical: -1.0 }, analysisInsight: 'Kritik Hata: Tedaviyi en kritik anda kesme.' },
        { label: 'Çocuğun Tepkisi: Çocuğun bize küstüğünü gösterir, gönlü alınmalıdır.', weights: { clinical: -0.5 }, analysisInsight: 'Duygusal Yorumlama.' },
        { label: 'Yorgunluk: Çocuk yorulduğu için hırçınlaşmıştır.', weights: { clinical: 0.0 }, analysisInsight: 'Yanlış Nedenleme.' }
      ]
    },
    {
      id: 'clin_new_add_8', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuğun "Göz Teması" kurması için "Bak" komutu vermek doğru mudur?',
      weightedOptions: [
        { label: 'Doğal Fırsat: Hayır, "Bak" demek yapaydır. Çocuğun sevdiği bir nesneyi göz hizama getirerek doğal göz teması yakalamalı ve o anı pekiştirmeliyim.', weights: { clinical: 1.0 }, analysisInsight: 'Doğal Öğretim: Yapay komutlar yerine çevresel düzenleme.' },
        { label: 'Komut Şart: Evet, çocuk komut almayı öğrenmelidir.', weights: { clinical: 0.3 }, analysisInsight: 'Geleneksel Yaklaşım: Mekanik ve genellenmesi zordur.' },
        { label: 'Fiziksel Yönlendirme: Çenesinden tutup bana bakmasını sağlamalıyım.', weights: { clinical: -0.5, empathy: -0.5 }, analysisInsight: 'İnvazif Yöntem: Çocuğu rahatsız eder.' },
        { label: 'Önemsiz: Göz teması şart değil, beni duysun yeter.', weights: { clinical: 0.0 }, analysisInsight: 'Temel Eksikliği: Otizmde ortak dikkat kritiktir.' }
      ]
    },
    {
      id: 'clin_new_add_9', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuk her dersin sonunda "Bitti mi?" diye soruyor. Bu kaygıyı nasıl yönetirsiniz?',
      weightedOptions: [
        { label: 'Görsel Destek (Timer/Token): Somut bir zamanlayıcı veya etkinlik çizelgesi kullanarak ne kadar kaldığını görselleştirmesini sağlarım. Belirsizliği ortadan kaldırırım.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Bilişsel Destek: Soyut zaman kavramını somutlaştırma.' },
        { label: 'Sözel Teselli: "Az kaldı, sabret" derim.', weights: { clinical: 0.2 }, analysisInsight: 'Yetersiz: Çocuk için "az" kavramı belirsizdir.' },
        { label: 'Yasaklama: "Sürekli sorma" diye kızarım.', weights: { clinical: -0.5 }, analysisInsight: 'Kaygıyı Artırma.' },
        { label: 'Gizleme: Saati saklarım.', weights: { clinical: -0.2 }, analysisInsight: 'Çözümsüzlük.' }
      ]
    },
    {
      id: 'clin_new_add_10', category: 'technicalExpertise', type: 'radio',
      text: 'Otizmli bir çocukta "Parmak Ucunda Yürüme" gözlemliyorsunuz. İlk adım ne olmalıdır?',
      weightedOptions: [
        { label: 'Fizyolojik Kontrol: Önce Aşil tendonu kısalığı gibi fiziksel bir sorun olup olmadığını anlamak için fizyoterapist/doktor yönlendirmesi yaparım. Fiziksel değilse duyusal/davranışsal müdahaleye başlarım.', weights: { clinical: 1.0, institutionalLoyalty: 0.5 }, analysisInsight: 'Multidisipliner Bakış: Tıbbi nedeni elemeden davranışsal çalışmama.' },
        { label: 'Sözel Uyarı: Sürekli "Düz bas" derim.', weights: { clinical: 0.0 }, analysisInsight: 'Etkisiz.' },
        { label: 'Ağırlık Takma: Ayak bileklerine ağırlık takarım.', weights: { clinical: 0.2 }, analysisInsight: 'Riskli: Uzman onayı olmadan yapılmamalı.' },
        { label: 'Önemsememe: Zamanla düzelir.', weights: { clinical: -0.5 }, analysisInsight: 'İhmal.' }
      ]
    }
  ],

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
      id: 'eth_new_add_1', category: 'workEthics', type: 'radio',
      text: 'Boşanma aşamasındaki bir veli, diğer eş hakkında size sürekli kötü şeyler anlatıyor ve taraf olmanızı istiyor. Tepkiniz?',
      weightedOptions: [
        { label: 'Çocuk Odaklı Nötr Duruş: "Sizi dinliyorum ve zor bir süreç olduğunu anlıyorum. Ancak benim görevim çocuğunuzun eğitimine odaklanmak. Bu konuları aile terapistinizle görüşmeniz daha sağlıklı olur." diyerek sınırı çizerim.', weights: { workEthics: 1.0, parentStudentRelations: 1.0 }, analysisInsight: 'Profesyonel Mesafe: Aile içi dinamiklere girmeden çocuğu merkeze alma.' },
        { label: 'Sempatik Katılım: Onu dinler ve hak veririm, rahatlamasını sağlarım. Veliyle iyi geçinmek önemlidir.', weights: { workEthics: -0.5 }, analysisInsight: 'Sınır İhlali: Terapist rolüne soyunma ve taraf olma riski.' },
        { label: 'Sert Reddetme: "Bana bunları anlatmayın, işim değil" diyerek konuyu kapatırım.', weights: { workEthics: 0.2, empathy: -0.8 }, analysisInsight: 'İletişim Kazası: Veliyi kırma ve işbirliğini zedeleme.' },
        { label: 'Dedikodu: Duyduklarımı diğer öğretmenlere anlatırım.', weights: { workEthics: -1.0, integrity: -1.0 }, analysisInsight: 'Etik Dışı: Mahremiyet ihlali.' }
      ]
    },
    {
      id: 'eth_new_add_2', category: 'workEthics', type: 'radio',
      text: 'Sosyal medyada (Instagram) bir veliniz size arkadaşlık isteği gönderdi. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Profesyonel Mesafe: İsteği kabul etmem. Veli ile sosyal medya arkadaşlığı "Çoklu İlişki" (Dual Relationship) riskidir. Kurumsal hesaplar üzerinden takipleşmeyi öneririm.', weights: { workEthics: 1.0, institutionalLoyalty: 0.8 }, analysisInsight: 'Etik Standart: Özel hayat ile iş hayatını ayırma.' },
        { label: 'Kabul: Kabul ederim, ne var ki bunda? Paylaşımlarımı görsün, samimiyet artar.', weights: { workEthics: -0.5 }, analysisInsight: 'Risk: Özel hayatın ifşası ve profesyonel otorite kaybı.' },
        { label: 'Filtreli Kabul: Kabul ederim ama paylaşımlarımı gizlerim.', weights: { workEthics: -0.2 }, analysisInsight: 'Gereksiz Efor: Sınırı baştan çizememe.' },
        { label: 'Görmezden Gelme: İsteği bekletirim, sora sora unutur.', weights: { workEthics: 0.0 }, analysisInsight: 'Pasif Tavır.' }
      ]
    },
    {
      id: 'eth_new_add_3', category: 'workEthics', type: 'radio',
      text: 'Veli, çocuğuna doktorun verdiği ilacın (Ritalin vb.) dozunu değiştirip değiştirmemesi gerektiğini size soruyor. "Hocam sizce işe yarıyor mu, arttıralım mı?"',
      weightedOptions: [
        { label: 'Yetki Sınırı (Scope of Practice): "Okulda gözlemlediğim davranış değişikliklerini raporlayabilirim, ancak dozaj ve ilaç kararı tamamen doktorunuzun uzmanlık alanıdır. Gözlem raporumu doktorunuzla paylaşmanız en doğrusu." derim.', weights: { workEthics: 1.0, clinical: 0.8 }, analysisInsight: 'Yetki Bilinci: Tıbbi tavsiye vermeden veri desteği sağlama.' },
        { label: 'Kişisel Görüş: "Bence arttırın, çocuk hala çok hareketli" derim.', weights: { workEthics: -1.0, clinical: -1.0 }, analysisInsight: 'Suç ve İhlal: Tıbbi tavsiye verme yetkisi gaspı.' },
        { label: 'İlaç Karşıtlığı: "İlaç vermeyin, doğal yollarla halledelim" derim.', weights: { workEthics: -0.8 }, analysisInsight: 'Bilim Dışı Yönlendirme.' },
        { label: 'Geçiştirme: "Bilmiyorum" derim.', weights: { workEthics: 0.2 }, analysisInsight: 'Yetersiz Destek: Gözlem verisi sunmaktan kaçınma.' }
      ]
    },
    {
      id: 'eth_new_add_4', category: 'parentStudentRelations', type: 'radio',
      text: 'Veli "Çocuğum 3 ayda konuşacak mı, garanti veriyor musunuz?" diye baskı yapıyor.',
      weightedOptions: [
        { label: 'Etik Gerçekçilik: "Gelişim bireyseldir ve garanti verilemez. Ancak biz bilimsel yöntemlerle potansiyelini en üst düzeye çıkarmak için çalışıyoruz. Hedefimiz 3 ayda şu şu becerileri kazandırmak." diyerek dürüst ve süreç odaklı konuşurum.', weights: { workEthics: 1.0, parentStudentRelations: 1.0 }, analysisInsight: 'Dürüst Yönetim: Umut tacirliği yapmadan güven verme.' },
        { label: 'Ticari Yaklaşım: "Tabii ki, bize güvenin, kesin konuşur" derim. Veliyi kaybetmemek lazım.', weights: { workEthics: -1.0, integrity: -1.0 }, analysisInsight: 'Etik İhlal: Gerçekçi olmayan vaat (Umut Tacirliği).' },
        { label: 'Savunma: "Bunu Allah bilir, biz bilemeyiz" derim.', weights: { parentStudentRelations: -0.5 }, analysisInsight: 'Profesyonellikten Uzak Üslup.' },
        { label: 'Şartlı Cevap: "Evde dediklerimi yaparsanız konuşur" diyerek topu aileye atarım.', weights: { workEthics: -0.2 }, analysisInsight: 'Sorumluluk Transferi.' }
      ]
    },
    {
      id: 'eth_new_add_5', category: 'workEthics', type: 'radio',
      text: 'Meslektaşınızın bir çocuğa seans sırasında bağırdığını ve sert davrandığını duydunuz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Kurumsal Koruma ve Raporlama: Çocuğun güvenliği önceliklidir. Durumu hemen disiplin kuruluna/yönetime, tanık olduğum saat ve detaylarla raporlarım. Bu ispiyon değil, mesleki sorumluluktur.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0, clinical: 1.0 }, analysisInsight: 'Etik Cesaret: Yanlışa göz yummama.' },
        { label: 'Kol Kırılır Yen İçinde: Arkadaşımla konuşur, bir daha yapmamasını söylerim ama yönetime bildirmem. Ekip arkadaşımı satmam.', weights: { workEthics: -0.8, institutionalLoyalty: -0.5 }, analysisInsight: 'Suç Ortaklığı: Çocuğun güvenliğini riske atma.' },
        { label: 'Kayıtsızlık: Bana ne, herkesin kendi tarzı.', weights: { workEthics: -1.0 }, analysisInsight: 'Ağır İhmal.' },
        { label: 'Dedikodu: Diğer hocalara "Duydunuz mu?" diye anlatırım.', weights: { workEthics: -0.5 }, analysisInsight: 'Toksik Davranış.' }
      ]
    },
    {
      id: 'eth_new_add_6', category: 'workEthics', type: 'radio',
      text: 'Veli, kurumdan ayrılıp kendi açacağınız özel ofise gelmesi için size teklifte bulundu (Ayartma).',
      weightedOptions: [
        { label: 'Sadakat ve Red: Teklifi kesin dille reddeder, şu anki kurumumda mutlu olduğumu belirtir ve bu konuşmayı yönetime bildiririm. Öğrenci çalmak (Poaching) etik dışıdır.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Tam Sadakat: Rekabet yasağına ve iş etiğine uyum.' },
        { label: 'Açık Kapı: "Şimdilik buradayım ama ilerde bakarız" diyerek kartımı veririm.', weights: { workEthics: -0.5, institutionalLoyalty: -0.8 }, analysisInsight: 'Potansiyel İhanet.' },
        { label: 'Kabul: "Harika olur, zaten buradan ayrılacağım" derim.', weights: { workEthics: -1.0, institutionalLoyalty: -1.0 }, analysisInsight: 'Doğrudan İhanet.' },
        { label: 'Pazarlık: "Şartları konuşalım" derim.', weights: { workEthics: -0.8 }, analysisInsight: 'Fırsatçılık.' }
      ]
    },
    {
      id: 'eth_new_add_7', category: 'parentStudentRelations', type: 'radio',
      text: 'Çocuğun gelişim raporunu yazarken, veli mutlu olsun diye yapamadığı bir beceriyi "yapıyor" gibi göstermeniz istendi (Yönetim veya Veli tarafından).',
      weightedOptions: [
        { label: 'Veri Doğruluğu: Asla kabul etmem. Rapor çocuğun yasal belgesidir ve gelişim planını etkiler. Sadece gerçek veriyi yazarım, ancak ilerlemeyi vurgulayan bir dil kullanırım.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Mesleki Onur: Resmi evrakta sahteciliğe ve yanıltmaya direnç.' },
        { label: 'Uyum: "Peki, küçük bir beyaz yalan" diyerek yazarım. Herkes mutlu olsun.', weights: { workEthics: -1.0, integrity: -1.0 }, analysisInsight: 'Etik Çöküş: Güvenilirliğin kaybı.' },
        { label: 'Orta Yol: "Kısmen yapıyor" yazarım.', weights: { workEthics: -0.3 }, analysisInsight: 'Gerçeği Bükme.' },
        { label: 'Red ve İstifa: Kavga çıkarırım.', weights: { workEthics: 0.5, institutionalLoyalty: -0.2 }, analysisInsight: 'Doğru Duruş ama Yönetim Şekli Hatalı.' }
      ]
    },
    {
      id: 'eth_new_add_8', category: 'workEthics', type: 'radio',
      text: 'Bir erkek öğretmen olarak, kız öğrenciye tuvalet eğitimi verilmesi gerekiyor. Prosedür ne olmalıdır?',
      weightedOptions: [
        { label: 'Kurumsal Protokol: Mahremiyet ve güvenlik protokolleri gereği, bu eğitimi kadın bir personel (gölge öğretmen/yardımcı) eşliğinde veya gözetiminde planlarım. Tek başıma kapalı alanda bulunmam.', weights: { workEthics: 1.0, institutionalLoyalty: 0.8 }, analysisInsight: 'Risk Yönetimi: Kendini ve çocuğu koruma bilinci.' },
        { label: 'Normalleştirme: "Ben öğretmenim, cinsiyet fark etmez" diyerek tek başıma yaptırırım.', weights: { workEthics: -0.5 }, analysisInsight: 'Risk Alma: Yanlış anlaşılmalara ve istismar iddialarına açık kapı.' },
        { label: 'Red: "Ben yapmam" diyerek anneyi çağırırım.', weights: { clinical: -0.2 }, analysisInsight: 'Sorumluluktan Kaçış.' },
        { label: 'Gizlilik: Kimseye söylemeden hallederim.', weights: { workEthics: -0.8 }, analysisInsight: 'Şüphe Uyandırıcı Davranış.' }
      ]
    },
    {
      id: 'eth_new_add_9', category: 'workEthics', type: 'radio',
      text: 'Veli size sürekli pahalı hediyeler (Marka çanta, altın vb.) getirmeye çalışıyor.',
      weightedOptions: [
        { label: 'İlkesel Red: Teşekkür ederek, kurum politikası gereği maddi değeri olan hediyeleri kabul edemeyeceğimi, en büyük hediyenin çocuğun başarısı olduğunu nazikçe belirtirim. Sadece el yapımı/manevi hediyeleri kabul ederim.', weights: { workEthics: 1.0 }, analysisInsight: 'Sınır Koruma: Profesyonel ilişkinin ticari ilişkiye dönmesini engelleme.' },
        { label: 'Kabul: "Ayıp olur" diyerek alırım.', weights: { workEthics: -0.5 }, analysisInsight: 'Borçluluk Hissi: Hediye karşılığı veliye imtiyaz tanıma riski.' },
        { label: 'Gizli Kabul: Kurumda değil, dışarıda verin derim.', weights: { workEthics: -1.0 }, analysisInsight: 'Rüşvet Algısı.' },
        { label: 'Paylaşım: Alıp diğer öğretmenlere dağıtırım.', weights: { workEthics: -0.2 }, analysisInsight: 'Etik Sorunu Çözmez.' }
      ]
    },
    {
      id: 'eth_new_add_10', category: 'parentStudentRelations', type: 'radio',
      text: 'Çocuğun evdeki videosunda babanın çocuğa vurduğunu gördünüz. (İstismar Şüphesi).',
      weightedOptions: [
        { label: 'Yasal Zorunluluk: Durumu kurum müdürü ve psikoloğu ile değerlendirip, yasal bildirim (Sosyal Hizmetler/Polis) sürecini başlatırım. Çocuğun güvenliği her şeyden üstündür.', weights: { workEthics: 1.0, clinical: 1.0 }, analysisInsight: 'Hayat Kurtarıcı Refleks: Yasal ve vicdani sorumluluğu yerine getirme.' },
        { label: 'Görmezden Gelme: Aile işlerine karışmam, başım belaya girer.', weights: { workEthics: -1.0, empathy: -1.0 }, analysisInsight: 'Suç Ortaklığı: İstismarı bildirmemek suçtur.' },
        { label: 'Veliyle Konuşma: Babayı arayıp "Niye vurdunuz?" diye hesap sorarım.', weights: { workEthics: -0.5 }, analysisInsight: 'Riskli Müdahale: Çocuğu daha büyük tehlikeye atabilir.' },
        { label: 'Örtbas: Videoyu silerim.', weights: { workEthics: -1.0 }, analysisInsight: 'Ağır İhmal.' }
      ]
    }
  ],

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
    // YENİ SORULAR (RESILIENCE & TEAM - Toplam 10 Adet Eklendi)
    {
      id: 'res_new_add_1', category: 'sustainability', type: 'radio',
      text: 'Ağır bir davranış problemi olan çocuk, seans sırasında size fiziksel olarak saldırdı, gözlüğünüzü kırdı ve canınızı yaktı. Seans sonrası ilk tepkiniz?',
      weightedOptions: [
        { label: 'Profesyonel Regülasyon: Odayı güvenli hale getirip çıktıktan sonra, derin nefes alıp sakinleşirim. Olayı şahsıma yapılmış bir saldırı değil, "davranışsal bir kriz" olarak raporlarım.', weights: { sustainability: 1.0, clinical: 0.8 }, analysisInsight: 'Duygusal Dayanıklılık: Olayı kişiselleştirmeme.' },
        { label: 'Duygusal Çöküş: Ağlayarak "Ben bu çocuğu istemiyorum" diye bağırırım.', weights: { sustainability: -0.5 }, analysisInsight: 'Tükenmişlik Sinyali.' },
        { label: 'Öfke Yansıtma: Çocuğa veya veliye bağırırım.', weights: { sustainability: -1.0, workEthics: -1.0 }, analysisInsight: 'Profesyonel İflas.' },
        { label: 'Bastırma: Hiçbir şey olmamış gibi devam ederim.', weights: { sustainability: -0.2 }, analysisInsight: 'Riskli: Bastırılan duygu sonra patlar.' }
      ]
    },
    {
      id: 'res_new_add_2', category: 'sustainability', type: 'radio',
      text: 'Yöneticinizden herkesin içinde haksız olduğunu düşündüğünüz sert bir eleştiri aldınız. Tepkiniz?',
      weightedOptions: [
        { label: 'Profesyonel Bekleme: O an saygımı bozmadan dinlerim. Sakinleşince odasına gidip "Eleştirinizi duydum ancak kendimi ifade etmek istiyorum" diyerek verilerle durumu açıklarım.', weights: { sustainability: 1.0, institutionalLoyalty: 0.8 }, analysisInsight: 'Kriz İletişimi: Dürtü kontrolü ve profesyonel yüzleşme.' },
        { label: 'Anlık Savunma: "Hayır öyle değil!" diye herkesin içinde tartışmaya girerim.', weights: { sustainability: -0.5 }, analysisInsight: 'Dürtüsellik: Otoriteyle çatışma.' },
        { label: 'Küsme: İşleri yavaşlatırım, motivasyonumu düşürürüm.', weights: { sustainability: -0.6 }, analysisInsight: 'Pasif Agresif Direnç.' },
        { label: 'Dedikodu: Arkadaşlarıma yöneticinin ne kadar kötü olduğunu anlatırım.', weights: { sustainability: -0.8 }, analysisInsight: 'Toksik Kültür Yayma.' }
      ]
    },
    {
      id: 'res_new_add_3', category: 'sustainability', type: 'radio',
      text: 'Öğretmenler odasında sürekli "Bu kurum batıyor, maaşlar düşük, veliler kötü" diye konuşan (Toksik) bir grup var. Tavrınız?',
      weightedOptions: [
        { label: 'Mesafe ve Odak: Bu konuşmalara dahil olmam, negatif enerjinin beni etkilemesine izin vermeden işime odaklanırım. Gerekirse odayı terk ederim.', weights: { sustainability: 1.0, fit: 0.8 }, analysisInsight: 'Kültürel Bağışıklık: Kendi motivasyonunu koruma.' },
        { label: 'Katılım: Ben de şikayetlerimi eklerim, deşarj oluruz.', weights: { sustainability: -0.5, institutionalLoyalty: -0.5 }, analysisInsight: 'Negatif Sarmal: Kurum kültürünü zehirleme.' },
        { label: 'Çatışma: "Beğenmiyorsanız gidin" diye sert çıkarım.', weights: { sustainability: 0.2 }, analysisInsight: 'Gereksiz Çatışma.' },
        { label: 'İspiyon: Yönetime isim veririm.', weights: { fit: -0.5 }, analysisInsight: 'Güven Zedeleme.' }
      ]
    },
    {
      id: 'res_new_add_4', category: 'sustainability', type: 'radio',
      text: 'Çok emek verdiğiniz bir öğrenci 6 aydır yerinde sayıyor (Plato Çiziyor). Hissiyatınız ve aksiyonunuz?',
      weightedOptions: [
        { label: 'Analitik Çözüm Arayışı: Kendimi yetersiz hissetmek yerine, "Yöntemi değiştirmeliyim" diyerek süpervizyon isterim. Plato, öğrenmenin bir parçasıdır.', weights: { sustainability: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Gelişim Zihniyeti: Sorunu kişisel değil teknik görme.' },
        { label: 'Umutsuzluk: "Bu çocuk öğrenemiyor" diyerek motivasyonumu kaybederim.', weights: { sustainability: -0.5 }, analysisInsight: 'Öğrenilmiş Çaresizlik.' },
        { label: 'Suçlama: "Ailesi ilgilenmiyor ondan böyle" derim.', weights: { sustainability: -0.3 }, analysisInsight: 'Dışsallaştırma.' },
        { label: 'Görmezden Gelme: Öylece devam ederim, elbet açılır.', weights: { sustainability: -0.2 }, analysisInsight: 'Eylemsizlik.' }
      ]
    },
    {
      id: 'res_new_add_5', category: 'sustainability', type: 'radio',
      text: 'İş arkadaşınızın yanlış bir yöntem uyguladığını (örn: Çocuğa yanlış ipucu veriyor) gördünüz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Yapıcı Geri Bildirim: Uygun bir zamanda, kimsenin olmadığı bir yerde "Gözlemlediğim kadarıyla X yöntemini denesen daha iyi sonuç alabilirsin, ben öyle çözmüştüm" diyerek deneyim paylaşırım.', weights: { sustainability: 1.0, fit: 1.0 }, analysisInsight: 'Akran Mentörlüğü: Yargılamadan destek olma.' },
        { label: 'Müdahale: Dersin ortasında girip "Yanlış yapıyorsun" derim.', weights: { sustainability: -0.5 }, analysisInsight: 'Saygısızlık: Arkadaşın otoritesini sarsma.' },
        { label: 'Umursamazlık: Herkesin kendi sınıfı, karışmam.', weights: { sustainability: 0.0 }, analysisInsight: 'Takım Ruhu Eksikliği.' },
        { label: 'Şikayet: Koordinatöre "Bu hoca bilmiyor" derim.', weights: { sustainability: -0.3 }, analysisInsight: 'Arkadan İş Çevirme.' }
      ]
    },
    {
      id: 'res_new_add_6', category: 'sustainability', type: 'radio',
      text: 'Özel hayatınızda çok zor bir dönemden (Boşanma, yas vb.) geçiyorsunuz. İş hayatınıza yansıması nasıl olur?',
      weightedOptions: [
        { label: 'Kompartmanizasyon: Zor olsa da kapıdan girerken "Öğretmen Kimliğimi" giyerim. Çocuklar benim hüznümü taşımak zorunda değil. Gerekirse destek alırım.', weights: { sustainability: 1.0, emotionalResilience: 1.0 }, analysisInsight: 'Profesyonel Olgunluk: Duygusal ayrıştırma.' },
        { label: 'Yansıtma: Tahammülüm azalır, çocuklara çabuk kızarım.', weights: { sustainability: -0.8 }, analysisInsight: 'Profesyonel Risk.' },
        { label: 'Talep: Sürekli izin isterim, işleri aksatırım.', weights: { sustainability: -0.5 }, analysisInsight: 'Performans Düşüklüğü.' },
        { label: 'Paylaşım: Veliye ve çocuklara dert yanarım.', weights: { sustainability: -1.0 }, analysisInsight: 'Sınır İhlali.' }
      ]
    },
    {
      id: 'res_new_add_7', category: 'sustainability', type: 'radio',
      text: 'Kurumda yeni bir "Veri Takip Sistemi"ne geçiliyor ve öğrenmesi çok zor görünüyor. İlk düşünceniz?',
      weightedOptions: [
        { label: 'Adaptasyon Çabası: "Zorlanacağım ama mesleki gelişimim için öğrenmeliyim. Kurum bunu istiyorsa bir bildikleri vardır." diyerek eğitim talep ederim.', weights: { sustainability: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Değişime Uyum.' },
        { label: 'Direnç: "Eski köye yeni adet, kağıt kalem neyimize yetmiyor" diye söylenirim.', weights: { sustainability: -0.5 }, analysisInsight: 'Yeniliğe Kapalılık.' },
        { label: 'Red: "Ben anlamam teknolojiden" diyerek kullanmam.', weights: { sustainability: -0.8 }, analysisInsight: 'Öğrenilmiş Yetersizlik.' },
        { label: 'Mış Gibi Yapma: Kullanıyormuş gibi yapıp verileri sallarım.', weights: { sustainability: -1.0, integrity: -1.0 }, analysisInsight: 'Sistemi Sabotaj.' }
      ]
    },
    {
      id: 'res_new_add_8', category: 'sustainability', type: 'radio',
      text: 'Bir ekip arkadaşınız hasta olduğu için onun seanslarına girmeniz (Cover) istendi. Bu ekstra bir yük.',
      weightedOptions: [
        { label: 'Takım Dayanışması: "Tabii ki, zor günde birbirimize destek olmalıyız. Yarın benim de ihtiyacım olabilir." diyerek kabul ederim.', weights: { sustainability: 1.0, fit: 1.0 }, analysisInsight: 'Özveri ve Takım Ruhu.' },
        { label: 'Pazarlık: "Ekstra ücret alacaksam girerim" derim.', weights: { sustainability: -0.2 }, analysisInsight: 'Sadece Çıkar Odaklılık.' },
        { label: 'Red: "Benim görev tanımımda yok" derim.', weights: { sustainability: -0.5 }, analysisInsight: 'Katı Sınırlar (Takım oyununa aykırı).' },
        { label: 'Gönülsüzlük: Girerim ama çocukla ilgilenmem, vakit öldürürüm.', weights: { sustainability: -0.8 }, analysisInsight: 'Etik Dışı.' }
      ]
    },
    {
      id: 'res_new_add_9', category: 'sustainability', type: 'radio',
      text: 'Yıl sonu gösterisinde görev size verildi ama sahne korkunuz var. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Meydan Okuma: Korkuma rağmen sorumluluk alır, gerekirse prova yaparak kendimi geliştiririm. Kurum beni layık gördüyse yaparım.', weights: { sustainability: 1.0, developmentOpenness: 0.8 }, analysisInsight: 'Konfor Alanından Çıkış.' },
        { label: 'Kaçış: "Hastayım" diyip gelmem.', weights: { sustainability: -0.5 }, analysisInsight: 'Güvenilmezlik.' },
        { label: 'Red: "Ben yapamam, başkası yapsın" derim.', weights: { sustainability: -0.2 }, analysisInsight: 'Özgüven Eksikliği.' },
        { label: 'Sabotaj: İstemeye istemeye yapar, işi batırırım.', weights: { sustainability: -0.8 }, analysisInsight: 'Pasif Agresyon.' }
      ]
    },
    {
      id: 'res_new_add_10', category: 'sustainability', type: 'radio',
      text: 'Çok yoğun bir gün, yemek yemeye bile vaktiniz kalmadı. Son seansa girerken ruh haliniz?',
      weightedOptions: [
        { label: 'Profesyonel Maske: Açlığımı ve yorgunluğumu kapıda bırakır, çocuğa güleryüzle "Merhaba" derim. O çocuğun suçu yok.', weights: { sustainability: 1.0, workEthics: 1.0 }, analysisInsight: 'Yüksek Profesyonellik.' },
        { label: 'Tahammülsüzlük: Çocuğa "Bugün beni yorma" derim.', weights: { sustainability: -0.5 }, analysisInsight: 'Duygu Kontrolsüzlüğü.' },
        { label: 'Dersi Kaynatma: Dersin yarısında tost yemeye giderim.', weights: { sustainability: -0.8 }, analysisInsight: 'İş Etiği İhlali.' },
        { label: 'Yansıtma: Sinirimi materyallerden çıkarırım.', weights: { sustainability: -0.6 }, analysisInsight: 'Öfke Kontrol Sorunu.' }
      ]
    }
  ],

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
    // YENİ SORULAR (VIZYON & SADAKAT - Toplam 10 Adet Eklendi)
    {
      id: 'vis_new_add_1', category: 'institutionalLoyalty', type: 'radio',
      text: '5 yıl sonra kendinizi nerede görüyorsunuz?',
      weightedOptions: [
        { label: 'Kurumsal Büyüme: Bu kurumda "Koordinatör" veya "Eğitim Lideri" olarak, sistem kuran ve yeni uzmanlar yetiştiren bir pozisyonda görüyorum.', weights: { institutionalLoyalty: 1.0, leadership: 1.0 }, analysisInsight: 'İçerden Yükselme Vizyonu.' },
        { label: 'Girişimcilik: Kendi rehabilitasyon merkezimi açmış olurum.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Potansiyel Rakip: Kurumu basamak olarak kullanma ihtimali.' },
        { label: 'Belirsizlik: Bilmiyorum, akışına bıraktım.', weights: { institutionalLoyalty: 0.0, developmentOpenness: -0.5 }, analysisInsight: 'Vizyonsuzluk.' },
        { label: 'Sektör Değişimi: Bu iş çok zor, belki memur olurum.', weights: { institutionalLoyalty: -0.8 }, analysisInsight: 'Kısa Vadeli İstihdam Riski.' }
      ]
    },
    {
      id: 'vis_new_add_2', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumun sosyal sorumluluk projesi için pazar günü gönüllü çalışmanız istendi. (Ücretsiz). Tavrınız?',
      weightedOptions: [
        { label: 'Gönüllülük: Katılırım. Kurumun marka değeri ve topluma katkısı benim için önemlidir, bu bir aidiyet göstergesidir.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Aidiyet.' },
        { label: 'Ticari: Paramı verirseniz gelirim, yoksa gelmem.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'Sadece Finansal Bağ.' },
        { label: 'Bahane: İşim var derim.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Düşük Motivasyon.' },
        { label: 'Zorunluluk: İstemeye istemeye gelirim.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Gönülsüz Uyum.' }
      ]
    },
    {
      id: 'vis_new_add_3', category: 'institutionalLoyalty', type: 'radio',
      text: 'Rakip kurumdan %20 daha yüksek maaş teklifi aldınız. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Sadakat ve Görüşme: Gitmem. Mevcut kurumumdaki huzurum, eğitim imkanlarım ve ekibim %20\'den değerlidir. Ancak şartlarımın iyileştirilmesini talep ederim.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Bütüncül Değerlendirme.' },
        { label: 'Fırsatçılık: Hemen kabul eder giderim. Profesyonellik paradır.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Paralı Asker (Mercenary) Zihniyeti.' },
        { label: 'Şantaj: Teklifi gösterip "Ya zam yapın ya giderim" derim.', weights: { institutionalLoyalty: -0.8 }, analysisInsight: 'Tehditkar Pazarlık.' },
        { label: 'Gizli Arayış: Teklifi bekletir, başka yerlerle de görüşürüm.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'Güvenilmez.' }
      ]
    },
    {
      id: 'vis_new_add_4', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumun geliştirdiği özgün bir eğitim materyalini (PDF, Kitapçık) ayrılırken yanınızda götürür müsünüz?',
      weightedOptions: [
        { label: 'Fikri Mülkiyet: Hayır, o materyaller kurumun malıdır ve telif hakkı kuruma aittir. İzinsiz kopyalamak hırsızlıktır.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'Yüksek Etik Standart.' },
        { label: 'Hak Görme: Götürürüm, sonuçta ben de kullandım, benim de hakkım.', weights: { integrity: -0.8 }, analysisInsight: 'Mülkiyet Bilinci Eksikliği.' },
        { label: 'Gizlilik: Kopyalarım ama kimseye söylemem.', weights: { integrity: -1.0 }, analysisInsight: 'Hırsızlık.' },
        { label: 'Takas: Başka arkadaşlarımla değiş tokuş yaparım.', weights: { integrity: -0.8 }, analysisInsight: 'Etik İhlal.' }
      ]
    },
    {
      id: 'vis_new_add_5', category: 'institutionalLoyalty', type: 'radio',
      text: 'Mesai saatleri dışında (Akşam/Hafta sonu) işle ilgili acil bir telefon gelse açar mısınız?',
      weightedOptions: [
        { label: 'Durumsal Esneklik: Acilse açarım. Kurumun menfaati söz konusuysa fedakarlık yaparım, ancak bunun suistimal edilmemesini beklerim.', weights: { institutionalLoyalty: 1.0, sustainability: 0.8 }, analysisInsight: 'Sorumluluk Bilinci.' },
        { label: 'Katı Sınır: Asla açmam, mesai bitmiştir.', weights: { institutionalLoyalty: 0.0, sustainability: 1.0 }, analysisInsight: 'Memur Zihniyeti.' },
        { label: 'Açarım ama Şikayet Ederim: "Yine ne var" diye açarım.', weights: { institutionalLoyalty: -0.2 }, analysisInsight: 'Negatif Tavır.' },
        { label: 'Görmezden Gelme: Meşgule atarım.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'İlgisizlik.' }
      ]
    },
    {
      id: 'vis_new_add_6', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumun "Marka Elçisi" (Brand Ambassador) olmak sizin için ne ifade eder?',
      weightedOptions: [
        { label: 'Temsil Sorumluluğu: Sadece derste değil, sosyal hayatımda ve sosyal medyada da kurumun itibarını koruyacak, değerlerini yansıtacak şekilde davranmayı ifade eder.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Tam Temsiliyet.' },
        { label: 'Reklam: Kurumun reklamını yapıp prim almak demektir.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Sığ Bakış.' },
        { label: 'Yük: Ekstra iş yüküdür, beni ilgilendirmez.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'Aidiyetsizlik.' },
        { label: 'Forma: Sadece iş yerinde önlük giymektir.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Şekilcilik.' }
      ]
    },
    {
      id: 'vis_new_add_7', category: 'institutionalLoyalty', type: 'radio',
      text: 'Yönetim, kurumda radikal bir sistem değişikliği (Yeni yazılım, yeni yöntem vb.) yapacağını duyurdu. Tepkiniz?',
      weightedOptions: [
        { label: 'Öncülük: Değişimin sancılı olacağını bilsem de kurumu ileri taşıyacaksa destekler, öğrenir ve ekibe örnek olurum.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Değişim Ajanı.' },
        { label: 'Şüphecilik: "Eski köye yeni adet" derim, beklerim.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'Statükocu.' },
        { label: 'Direniş: Karşı çıkarım, eski sistem daha iyiydi.', weights: { developmentOpenness: -0.8 }, analysisInsight: 'Gelişim Engeli.' },
        { label: 'Sabotaj: Uygulamam, eski usül devam ederim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Uyumsuzluk.' }
      ]
    },
    {
      id: 'vis_new_add_8', category: 'institutionalLoyalty', type: 'radio',
      text: 'Hafta sonları "Özel Ders" (Merdiven altı) veriyor musunuz?',
      weightedOptions: [
        { label: 'Kurumsal Etik: Hayır vermiyorum. Bu hem yasal değil, hem de çalıştığım kuruma haksız rekabettir. Enerjimi kurumdaki öğrencilerime saklarım.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'Dürüstlük ve Yasal Uyum.' },
        { label: 'Ek Gelir: Evet veriyorum, geçinmek zorundayım. Kurum karışamaz.', weights: { institutionalLoyalty: -1.0, integrity: -0.5 }, analysisInsight: 'Etik Dışı ve Riskli.' },
        { label: 'Gizli: Veriyorum ama kurumun haberi yok.', weights: { integrity: -1.0 }, analysisInsight: 'Güvenilmezlik.' },
        { label: 'Fırsat: Veli isterse veririm.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'Oportünizm.' }
      ]
    },
    {
      id: 'vis_new_add_9', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumda bir arkadaşınızın sürekli işten kaytardığını ve bunu sizin üzerinize yıktığını fark ettiniz. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Kurumsal Düzeltme: Önce kendisiyle konuşurum. Düzelmezse, işleyişin bozulmaması için durumu verilerle (yapılan/yapılmayan işler) yönetime bildiririm. Bu ispiyon değil, adalettir.', weights: { institutionalLoyalty: 1.0, leadership: 0.8 }, analysisInsight: 'Adalet ve İşleyişi Koruma.' },
        { label: 'Sessizlik: İdare ederim, huzursuzluk çıkmasın.', weights: { leadership: -0.5 }, analysisInsight: 'Pasif Kurban Rolü.' },
        { label: 'Misilleme: Ben de onun işini yapmam.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'İşi Aksatma.' },
        { label: 'Kavga: Herkesin içinde bağırırım.', weights: { personality: -0.5 }, analysisInsight: 'Profesyonellik Dışı.' }
      ]
    },
    {
      id: 'vis_new_add_10', category: 'institutionalLoyalty', type: 'radio',
      text: 'Neden "Yeni Gün Akademi"?',
      weightedOptions: [
        { label: 'Vizyon Uyumu: Kurumunuzun vizyonunu ve eğitim kalitesini inceledim. Kendi kariyer hedeflerimle kurumun hedeflerinin örtüştüğünü görüyorum. Burada kendimi gerçekleştirebilirim.', weights: { institutionalLoyalty: 1.0, motivation: 1.0 }, analysisInsight: 'Bilinçli Tercih.' },
        { label: 'Konum: Evime yakın olduğu için.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Lojistik Tercih (Düşük Bağlılık).' },
        { label: 'Maaş: Şartlarınız iyi dediler.', weights: { institutionalLoyalty: 0.3 }, analysisInsight: 'Sadece Maddi Motivasyon.' },
        { label: 'Tesadüf: İş arıyordum, denk geldi.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Rastgelelik.' }
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
