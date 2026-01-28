
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
        text: 'Bir davranışın "işlevi" belirlenirken ABC kaydında "C" (Consequence) neyi temsil eder?',
        weightedOptions: [
          { label: 'Davranıştan hemen sonra gerçekleşen ve davranışın gelecekteki olasılığını etkileyen olay.', weights: { clinical: 1.0 }, analysisInsight: 'Temel prensip hakimiyeti.' },
          { label: 'Çocuğun davranışı yapma nedeni olan içsel motivasyon.', weights: { clinical: 0.2 }, analysisInsight: 'Metodolojik hata.' },
          { label: 'Davranışın süresi ve şiddetinin toplam puanı.', weights: { clinical: 0.1 }, analysisInsight: 'Kavramsal karmaşa.' },
          { label: 'Öğretmenin davranışa verdiği ceza puanı.', weights: { clinical: 0.0 }, analysisInsight: 'Yanlış uygulama refleksi.' }
        ]
      },
      {
        id: 'vq_aba_2', category: 'technicalExpertise', type: 'radio',
        text: '"Negative Reinforcement" (Olumsuz Pekiştirme) uygulamasının temel amacı nedir?',
        weightedOptions: [
          { label: 'İtici bir uyaranı ortamdan çekerek hedef davranışın sıklığını artırmak.', weights: { clinical: 1.0 }, analysisInsight: 'Kritik teknik ayrım.' },
          { label: 'İstenmeyen davranışı azaltmak için çocuğa sevmediği bir ödev vermek.', weights: { clinical: 0.0 }, analysisInsight: 'Ceza ile karıştırma.' },
          { label: 'Çocuğun yaptığı hatayı görmezden gelerek sönmesini sağlamak.', weights: { clinical: 0.3 }, analysisInsight: 'Sönme ile karıştırma.' },
          { label: 'Pekiştireçleri azaltarak çocuğun bağımsızlaşmasını sağlamak.', weights: { clinical: 0.2 }, analysisInsight: 'Eksik bilgi.' }
        ]
      },
      {
        id: 'vq_aba_3', category: 'technicalExpertise', type: 'radio',
        text: 'Beceri öğretiminde "Hata Düzeltme" (Error Correction) ne zaman uygulanmalıdır?',
        weightedOptions: [
          { label: 'Hata gerçekleştikten hemen sonra, öğrenciye doğru tepkiyi modelleyerek.', weights: { clinical: 1.0 }, analysisInsight: 'Doğru zamanlama.' },
          { label: 'Seansın sonunda tüm hataları toplu olarak anlatarak.', weights: { clinical: 0.1 }, analysisInsight: 'Gecikmiş müdahale.' },
          { label: 'Öğrenci 3 kez üst üste hata yapana kadar bekleyerek.', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış protokol.' },
          { label: 'Hata yapıldığında seansı durdurup mola vererek.', weights: { clinical: 0.0 }, analysisInsight: 'Klinik risk.' }
        ]
      },
      {
        id: 'vq_aba_4', category: 'technicalExpertise', type: 'radio',
        text: '"Discrete Trial Training" (DTT) ve "Natural Environment Training" (NET) arasındaki temel fark?',
        weightedOptions: [
          { label: 'DTT yapılandırılmış ve masa başı iken, NET doğal bağlamda motivasyon temellidir.', weights: { clinical: 1.0 }, analysisInsight: 'Uygulama çeşitliliği.' },
          { label: 'DTT sadece ağır otizmliler içindir, NET ise hafif vakalar içindir.', weights: { clinical: 0.1 }, analysisInsight: 'Klinik önyargı.' },
          { label: 'NET sadece oyun oynamaktır, DTT ise gerçek derstir.', weights: { clinical: 0.2 }, analysisInsight: 'Sığ yaklaşım.' },
          { label: 'Her iki metot da aynıdır, sadece isimleri farklıdır.', weights: { clinical: 0.0 }, analysisInsight: 'Teorik yetersizlik.' }
        ]
      },
      {
        id: 'vq_aba_5', category: 'technicalExpertise', type: 'radio',
        text: 'Bir davranışın "Sönmesi" (Extinction) sürecinde izlenmesi gereken en kritik adım?',
        weightedOptions: [
          { label: 'Daha önce pekiştirilen davranışın pekiştirilmesine tamamen son verilmesi.', weights: { clinical: 1.0 }, analysisInsight: 'Süreç hakimiyeti.' },
          { label: 'Çocuğa neden pekiştirilmediğinin her seferinde açıklanması.', weights: { clinical: 0.3 }, analysisInsight: 'Sözel uyaran hatası.' },
          { label: 'Davranış şiddetlenirse (burst) hemen pekiştireç verilmesi.', weights: { clinical: 0.0 }, analysisInsight: 'Uygulama fiyaskosu.' },
          { label: 'Davranış sırasında çocukla göz teması kurup uyarılması.', weights: { clinical: 0.1 }, analysisInsight: 'İlgi pekiştireci hatası.' }
        ]
      }
    ]
  },
  {
    id: 'etecom',
    label: 'ETEÇOM',
    description: 'Etkileşim Temelli Erken Çocuklukta Müdahale Programı.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_etc_1', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM\'da "Duyarlı Öğretmen" profili neyi ifade eder?',
        weightedOptions: [
          { label: 'Çocuğun ipuçlarını doğru okuyan ve etkileşimi onun liderliğinde sürdüren.', weights: { clinical: 1.0 }, analysisInsight: 'Model felsefesi.' },
          { label: 'Çocuğun her ağlamasında ona sarılan ve teselli eden.', weights: { clinical: 0.2 }, analysisInsight: 'Duygusal aşırılık.' },
          { label: 'Seans boyunca hiç konuşmadan çocuğu izleyen.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış yorum.' },
          { label: 'Disiplini en üst düzeyde tutan ve kuralları uygulatan.', weights: { clinical: 0.0 }, analysisInsight: 'Model dışı tutum.' }
        ]
      },
      {
        id: 'vq_etc_2', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM uygulamasında "Sıra Alma" (Turn-taking) neden kritiktir?',
        weightedOptions: [
          { label: 'Karşılıklı iletişimin ve sosyal etkileşim döngülerinin temeli olduğu için.', weights: { clinical: 1.0 }, analysisInsight: 'Gelişimsel bakış.' },
          { label: 'Çocuğun sadece bekleme becerisini geliştirmek için.', weights: { clinical: 0.3 }, analysisInsight: 'Eksik analiz.' },
          { label: 'Öğretmenin seansı kontrol etmesini kolaylaştırdığı için.', weights: { clinical: 0.1 }, analysisInsight: 'Otoriter odak.' },
          { label: 'Akademik becerilere hazırlık aşaması olduğu için.', weights: { clinical: 0.4 }, analysisInsight: 'Kısmi doğruluk.' }
        ]
      },
      {
        id: 'vq_etc_3', category: 'technicalExpertise', type: 'radio',
        text: 'Etkileşimsel stratejilerden "Genişletme" ne anlama gelir?',
        weightedOptions: [
          { label: 'Çocuğun tepkisine bir üst düzeyde anlamlı bir öğe ekleyerek karşılık vermek.', weights: { clinical: 1.0 }, analysisInsight: 'Dil stratejisi.' },
          { label: 'Seans süresini çocuğun isteğine göre uzatmak.', weights: { clinical: 0.0 }, analysisInsight: 'Kavramsal hata.' },
          { label: 'Aynı oyuncağı farklı odalarda oynamak.', weights: { clinical: 0.1 }, analysisInsight: 'Zayıf teknik.' },
          { label: 'Çocuğun yanına daha fazla oyuncak getirmek.', weights: { clinical: 0.1 }, analysisInsight: 'Materyal odaklı hata.' }
        ]
      },
      {
        id: 'vq_etc_4', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM müdahalesi hangi gelişim kuramına dayanır?',
        weightedOptions: [
          { label: 'Sosyal İnşacı Kuram (Vygotsky) ve İlişkisel Müdahale.', weights: { clinical: 1.0 }, analysisInsight: 'Teorik altyapı.' },
          { label: 'Klasik Koşullanma (Pavlov).', weights: { clinical: 0.0 }, analysisInsight: 'Temel hata.' },
          { label: 'Bilişsel Gelişim (Piaget) - Bireysel Odak.', weights: { clinical: 0.4 }, analysisInsight: 'Eksik eşleşme.' },
          { label: 'Psikanalitik Yaklaşım.', weights: { clinical: 0.0 }, analysisInsight: 'Alakasız.' }
        ]
      },
      {
        id: 'vq_etc_5', category: 'technicalExpertise', type: 'radio',
        text: 'Ebeveyn katılımı ETEÇOM\'da nasıl konumlandırılır?',
        weightedOptions: [
          { label: 'Ebeveyn, çocuğun birincil etkileşim ortağı ve müdahalenin uygulayıcısıdır.', weights: { clinical: 1.0 }, analysisInsight: 'Sistemik yaklaşım.' },
          { label: 'Ebeveyn sadece seansları kapıdan izleyen gözlemcidir.', weights: { clinical: 0.0 }, analysisInsight: 'Hatalı uygulama.' },
          { label: 'Ebeveyn sadece ev ödevlerini kontrol eden denetçidir.', weights: { clinical: 0.2 }, analysisInsight: 'Eksik rol.' },
          { label: 'Ebeveyn seans dışında çocukla çalışmamalıdır.', weights: { clinical: 0.0 }, analysisInsight: 'Kritik metodolojik hata.' }
        ]
      }
    ]
  }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  ethics_parent: [
    {
      id: 'ep_1', category: 'workEthics', type: 'radio',
      text: 'Bir veli, seans sırasında diğer öğretmenlerin veya yönetimin "yetersiz" olduğunu iddia ederse tutumunuz ne olur?',
      weightedOptions: [
        { label: 'Kurumsal aidiyet gereği meslektaşlarımı savunur ve konuyu yönetime yönlendiririm.', weights: { institutionalLoyalty: 1.0, formality: 1.0 }, analysisInsight: 'Yüksek profesyonellik.' },
        { label: 'Veliyi haklı bulduğumu hissettirip kendi başarılarımı anlatırım.', weights: { personality: 0.2, ethics: 0.0 }, analysisInsight: 'Narsistik/Etik risk.' },
        { label: 'Sessiz kalıp sadece kendi işime odaklanırım.', weights: { institutionalLoyalty: 0.4 }, analysisInsight: 'Pasif tutum.' },
        { label: 'Velinin bu eleştirilerini mülahaza edip rapor haline getiririm.', weights: { formality: 0.7 }, analysisInsight: 'Bürokratik yaklaşım.' }
      ]
    },
    {
      id: 'ep_2', category: 'workEthics', type: 'radio',
      text: 'Seans dışında bir veli size sosyal medya üzerinden kişisel mesaj gönderdiğinde?',
      weightedOptions: [
        { label: 'Kurumsal iletişim kanallarını hatırlatarak profesyonel sınırı korurum.', weights: { workEthics: 1.0, formality: 1.0 }, analysisInsight: 'Sınır disiplini.' },
        { label: 'Veli mağdur olmasın diye hemen yanıt veririm.', weights: { workEthics: 0.2 }, analysisInsight: 'Sınır ihlali eğilimi.' },
        { label: 'Mesajı görüp hiç cevap vermem.', weights: { parentStudentRelations: 0.3 }, analysisInsight: 'Zayıf kriz yönetimi.' },
        { label: 'Sadece acil durumlarda yanıt verebileceğimi söylerim.', weights: { workEthics: 0.5 }, analysisInsight: 'Esnek sınır riski.' }
      ]
    },
    {
      id: 'ep_3', category: 'workEthics', type: 'radio',
      text: 'Veli, çocuğun gelişiminin yavaş olduğunu söyleyip sizi suçladığında?',
      weightedOptions: [
        { label: 'Veriye dayalı grafiklerle gelişim basamaklarını ve süreci sakince açıklarım.', weights: { technicalExpertise: 1.0, criticismTolerance: 1.0 }, analysisInsight: 'Klinik özgüven.' },
        { label: 'Kendi yetkinliğimi sorgulayıp moralimi bozarım.', weights: { sustainability: 0.2 }, analysisInsight: 'Burnout riski.' },
        { label: 'Çocuğun evdeki performansının yetersiz olduğunu söyleyerek veliyi suçlarım.', weights: { parentStudentRelations: 0.0 }, analysisInsight: 'Agresif savunma.' },
        { label: 'Konuyu hemen koordinatöre aktarırım.', weights: { resilience: 0.5 }, analysisInsight: 'Sorumluluk transferi.' }
      ]
    },
    {
      id: 'ep_4', category: 'workEthics', type: 'radio',
      text: 'Velinin mülkiyetine/özel hayatına dair bir sır öğrendiğinizde?',
      weightedOptions: [
        { label: 'Gizlilik ilkeleri gereği sadece çocukla ilgili olan kısımları klinik ekipte tutarım.', weights: { workEthics: 1.0 }, analysisInsight: 'Etik dürüstlük.' },
        { label: 'Diğer öğretmenlerle paylaşarak durumu değerlendiririm.', weights: { workEthics: 0.1 }, analysisInsight: 'Gizlilik ihlali.' },
        { label: 'Veliye akıl vererek kişisel hayatına müdahale ederim.', weights: { formality: 0.0 }, analysisInsight: 'Rol karmaşası.' },
        { label: 'Sisteme not düşerim ama kimseye söylemem.', weights: { formality: 0.8 }, analysisInsight: 'Güvenli yaklaşım.' }
      ]
    },
    {
      id: 'ep_5', category: 'workEthics', type: 'radio',
      text: 'Veli, kurum dışı (evde) özel ders teklif ettiğinde?',
      weightedOptions: [
        { label: 'Etik kurallar ve kurumsal anlaşmam gereği bu teklifi net bir dille reddederim.', weights: { institutionalLoyalty: 1.0, ethics: 1.0 }, analysisInsight: 'Tam sadakat.' },
        { label: 'Kurumun haberi olmazsa yapabileceğimi söylerim.', weights: { ethics: 0.0, institutionalLoyalty: 0.0 }, analysisInsight: 'Kritik güven kaybı.' },
        { label: 'Ücreti düşük bulduğum için reddederim.', weights: { personality: 0.1 }, analysisInsight: 'Yanlış motivasyon.' },
        { label: 'Sadece ücretsiz destek olabileceğimi belirtirim.', weights: { ethics: 0.3 }, analysisInsight: 'Yanıltıcı iyi niyet.' }
      ]
    }
  ],
  resilience_team: [
    {
      id: 'rt_1', category: 'sustainability', type: 'radio',
      text: 'Arka arkaya 4 saat boyunca krizli (problem davranışlı) seans yönettiğinizde?',
      weightedOptions: [
        { label: 'Profesyonel bir rutin olarak görür, seans sonrası regüle olup devam ederim.', weights: { sustainability: 1.0, resilience: 1.0 }, analysisInsight: 'Yüksek direnç.' },
        { label: 'O günkü verimim düşer ve işten soğurum.', weights: { sustainability: 0.2 }, analysisInsight: 'Düşük tolerans.' },
        { label: 'Seansları kısa kesmeye başlarım.', weights: { workEthics: 0.0 }, analysisInsight: 'Uygulama riski.' },
        { label: 'Bir sonraki gün için rapor almayı düşünürüm.', weights: { sustainability: 0.0 }, analysisInsight: 'Kaçınma davranışı.' }
      ]
    },
    {
      id: 'rt_2', category: 'institutionalLoyalty', type: 'radio',
      text: 'Takım arkadaşınızın bir seans hatasını fark ettiğinizde?',
      weightedOptions: [
        { label: 'Uygun bir dille kendisiyle paylaşır, çözüm bulamazsak koordinatöre danışırım.', weights: { institutionalLoyalty: 1.0, personality: 0.8 }, analysisInsight: 'Yapıcı işbirliği.' },
        { label: 'Hemen yönetime şikayet ederim.', weights: { personality: 0.3 }, analysisInsight: 'Rekabetçi/Agresif.' },
        { label: 'Beni ilgilendirmediği için görmezden gelirim.', weights: { institutionalLoyalty: 0.1 }, analysisInsight: 'Zayıf aidiyet.' },
        { label: 'Veliye bu durumu hissettiririm.', weights: { ethics: 0.0 }, analysisInsight: 'Ağır etik kusur.' }
      ]
    },
    {
      id: 'rt_3', category: 'criticismTolerance', type: 'radio',
      text: 'Koordinatörünüz seans yönetiminizle ilgili sert bir eleştiri getirdiğinde?',
      weightedOptions: [
        { label: 'Gelişim fırsatı olarak görür, metodolojik hatalarımı düzeltmeye odaklanırım.', weights: { developmentOpenness: 1.0, criticismTolerance: 1.0 }, analysisInsight: 'Gelişime açık.' },
        { label: 'Kişisel saldırı olarak algılar ve savunmaya geçerim.', weights: { criticismTolerance: 0.1 }, analysisInsight: 'Kırılgan ego.' },
        { label: 'Motivasyonum çöker ve istifa etmeyi düşünürüm.', weights: { sustainability: 0.0 }, analysisInsight: 'Duygusal dayanıksızlık.' },
        { label: 'Haklı olduğunu söyler ama bildiğimi yapmaya devam ederim.', weights: { formality: 0.2 }, analysisInsight: 'Pasif-agresif.' }
      ]
    },
    {
      id: 'rt_4', category: 'sustainability', type: 'radio',
      text: 'Kurumda yoğun bir etkinlik dönemi ve mesai artışı olduğunda?',
      weightedOptions: [
        { label: 'Kurumsal başarının parçası olarak görür, enerjimi planlı kullanırım.', weights: { institutionalLoyalty: 1.0, sustainability: 0.8 }, analysisInsight: 'Sorumluluk bilinci.' },
        { label: 'Sadece zorunlu olduğum kadarını yaparım.', weights: { institutionalLoyalty: 0.3 }, analysisInsight: 'Düşük motivasyon.' },
        { label: 'Sürekli şikayet ederek çalışma ortamını etkilerim.', weights: { personality: 0.0 }, analysisInsight: 'Toksik eğilim.' },
        { label: 'Ek ücret almazsam çalışmam.', weights: { institutionalLoyalty: 0.1 }, analysisInsight: 'Materyalist odak.' }
      ]
    },
    {
      id: 'rt_5', category: 'personality', type: 'radio',
      text: 'Multidisipliner bir vaka toplantısında kendi branşınızın görüşü reddedildiğinde?',
      weightedOptions: [
        { label: 'Bilimsel kanıtlarımı sunarım ama ekibin ortak kararına saygı duyarım.', weights: { personality: 1.0, formality: 0.9 }, analysisInsight: 'Takım oyuncusu.' },
        { label: 'Toplantıyı terk ederim.', weights: { personality: 0.0 }, analysisInsight: 'Zayıf regülasyon.' },
        { label: 'Karara uyarım ama uygulamada kendi bildiğimi yaparım.', weights: { formality: 0.0 }, analysisInsight: 'Gizli direnç.' },
        { label: 'Bir daha o ekip toplantılarına katılmam.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'İzolasyon eğilimi.' }
      ]
    }
  ],
  vision_loyalty: [
    {
      id: 'vl_1', category: 'developmentOpenness', type: 'radio',
      text: 'Yeni bir bilimsel makale veya metot yayınlandığında ilk refleksiniz?',
      weightedOptions: [
        { label: 'Hemen okur, mevcut uygulamalarımı nasıl geliştirebileceğimi analiz ederim.', weights: { developmentOpenness: 1.0 }, analysisInsight: 'Akademik iştah.' },
        { label: 'Eski yöntemlerin her zaman daha güvenli olduğunu düşünürüm.', weights: { developmentOpenness: 0.2 }, analysisInsight: 'Gelenekçi direnç.' },
        { label: 'Kurum eğitim verirse öğrenirim.', weights: { developmentOpenness: 0.4 }, analysisInsight: 'Reaktif gelişim.' },
        { label: 'Sadece sınavda çıkacaksa çalışırım.', weights: { developmentOpenness: 0.1 }, analysisInsight: 'Amaca yönelik öğrenme.' }
      ]
    },
    {
      id: 'vl_2', category: 'institutionalLoyalty', type: 'radio',
      text: 'Bu kurumda 3 yıl sonra kendinizi nerede görüyorsunuz?',
      weightedOptions: [
        { label: 'Klinik derinliği artmış, kurumda mentorluk yapan bir uzman olarak.', weights: { institutionalLoyalty: 1.0, leadershipPotential: 0.9 }, analysisInsight: 'Vizyoner sadakat.' },
        { label: 'Kendi merkezimi açmış olarak.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Geçici aday.' },
        { label: 'Aynı pozisyonda ama daha az yorularak.', weights: { sustainability: 0.3 }, analysisInsight: 'Durgunluk eğilimi.' },
        { label: 'Başka bir sektörde çalışıyor olarak.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Sektörel aidiyetsizlik.' }
      ]
    },
    {
      id: 'vl_3', category: 'developmentOpenness', type: 'radio',
      text: 'Teknoloji tabanlı bir takip sistemi (CRM/ERP) getirilirse?',
      weightedOptions: [
        { label: 'Hızla adapte olur, veri odaklı çalışmanın avantajlarını kullanırım.', weights: { formality: 1.0, developmentOpenness: 0.9 }, analysisInsight: 'Dijital yetkinlik.' },
        { label: 'Kağıt-kalem sisteminin daha "samimi" olduğunu savunup direnirim.', weights: { formality: 0.1 }, analysisInsight: 'Teknolojik direnç.' },
        { label: 'Zorunlu olduğu için yarım yamalak kullanırım.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Düşük uyum.' },
        { label: 'Ek iş yükü olduğu için reddederim.', weights: { sustainability: 0.1 }, analysisInsight: 'Yük odaklı bakış.' }
      ]
    },
    {
      id: 'vl_4', category: 'leadershipPotential', type: 'radio',
      text: 'Kurumda bir "problem" fark ettiğinizde çözüm yolunuz?',
      weightedOptions: [
        { label: 'Çözüm önerimle birlikte yönetime yazılı ve sözlü bildirim yaparım.', weights: { leadershipPotential: 1.0, institutionalLoyalty: 0.8 }, analysisInsight: 'Proaktif liderlik.' },
        { label: 'Arkadaşlarımla kulis yapıp sorunu büyütürüm.', weights: { personality: 0.0 }, analysisInsight: 'Manipülatif.' },
        { label: 'Başkası çözer diye beklerim.', weights: { leadershipPotential: 0.1 }, analysisInsight: 'Pasif izleyici.' },
        { label: 'Sorun beni etkilemiyorsa ilgilenmem.', weights: { institutionalLoyalty: 0.1 }, analysisInsight: 'Bireysel odak.' }
      ]
    },
    {
      id: 'vl_5', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurumun bir sosyal sorumluluk projesine hafta sonu katılmanız istendiğinde?',
      weightedOptions: [
        { label: 'Kurumsal marka değerine katkı sunmak için gönüllü katılırım.', weights: { institutionalLoyalty: 1.0 }, analysisInsight: 'Marka elçisi.' },
        { label: 'Hafta sonu benim özel zamanım, asla katılmam.', weights: { institutionalLoyalty: 0.2 }, analysisInsight: 'Zayıf aidiyet.' },
        { label: 'Sadece mazeret bulamazsam katılırım.', weights: { formality: 0.4 }, analysisInsight: 'Mecburi uyum.' },
        { label: 'Kurumun reklam yaptığını düşünüp eleştiririm.', weights: { personality: 0.0 }, analysisInsight: 'Negatif/Şüpheci.' }
      ]
    }
  ]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Biruni Üniversitesi", "Üsküdar Üniversitesi", "Bezmialem Vakıf Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
