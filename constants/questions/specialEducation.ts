import { Question, Branch } from '../../types';

export const specialEducationQuestions: Question[] = [
  {
    id: 'sped_1', category: 'technicalExpertise', type: 'radio',
    text: 'Yeni başladığınız bir vakada çocuk yönergelere aşırı direnç gösteriyor ve sürekli kaçma davranışı sergiliyor. Sizin "seans otoritesi" kurma yönteminiz hangisine yakındır?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Önce çocuğun motivasyonel dünyasına girer, taleplerimi minimuma indirerek bir güven bağı (pairing) inşa ederim; otoriteyi bu bağın üzerine doğal bir sonuç olarak kurmayı tercih ederim.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'İlişki ve Bağ Odaklı Yaklaşım.' },
      { label: 'Sınırları en baştan net çizerim. Çocuğun kaçma davranışının pekişmemesi için yapılandırılmış bir düzende, düşük seviyeli ama tutarlı görevlerle seans kontrolünü ele alırım.', weights: { clinical: 0.9, technicalExpertise: 1.0 }, analysisInsight: 'Yapılandırılmış ve Sınır Odaklı Yaklaşım.' }
    ]
  },
  {
    id: 'sped_2', category: 'technicalExpertise', type: 'radio',
    text: 'Bir davranışın "sönme patlaması" (extinction burst) aşamasında olduğunu fark ettiniz. Aile ise çocuğun daha kötüye gittiğini düşünerek müdahaleyi kesmek istiyor. Tavrınız?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Aileye bilimsel verileri ve grafiklerdeki tipik yükselişi gösteririm. Bu aşamanın başarının eşiği olduğunu anlatarak onları ikna eder ve protokolün bozulmaması için otoritemi kullanırım.', weights: { clinical: 1.0, workEthics: 0.9 }, analysisInsight: 'Bilimsel Kanıt ve Veri Sadakati.' },
      { label: 'Ailenin duygusal yükünü anladığımı hissettiririm. Müdahaleyi biraz esnetip aile için daha uygulanabilir bir "yumuşatılmış plan" sunarak işbirliğini korumayı, sert bir dirençle veliyi kaybetmeye tercih ederim.', weights: { clinical: 0.7, empathy: 1.0 }, analysisInsight: 'Sistemik Esneklik ve Veli Koçluğu.' }
    ]
  },
  {
    id: 'sped_3', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'BEP (Bireyselleştirilmiş Eğitim Programı) hazırlarken önceliğiniz genellikle hangisidir?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Çocuğun toplumsal entegrasyonu için en kritik olan "bağımsız yaşam" ve "özbakım" becerilerini merkeze alırım; akademik başarının bu temel üzerine kendiliğinden inşa edileceğine inanırım.', weights: { pedagogicalAnalysis: 1.0, sustainability: 1.0 }, analysisInsight: 'Fonksiyonel ve Yaşamsal Odak.' },
      { label: 'Çocuğun bilişsel potansiyelini zorlayacak "akademik ve kavramsal" hedefleri öncelerim; kognitif gelişim ne kadar yukarı çekilirse çocuğun dünyayı anlama ve adaptasyon hızının o kadar artacağını savunurum.', weights: { pedagogicalAnalysis: 0.9, technicalExpertise: 1.0 }, analysisInsight: 'Bilişsel Kapasite ve Potansiyel Odaklı.' }
    ]
  },
  {
    id: 'sped_4', category: 'technicalExpertise', type: 'radio',
    text: 'Seans sırasında öğrenci aniden kendine zarar verme (self-injury) davranışı başlattı. O anki klinik refleksi nasıl yönetirsiniz?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Hemen fiziksel bloklama yaparak güvenliği sağlarım ve bu davranışın fonksiyonunu (dikkat mi, kaçma mı?) analiz etmek için ABC verisi tutmaya başlarım; duyguya değil davranışın mekaniğine odaklanırım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Soğukkanlı Davranış Analisti.' },
      { label: 'Çocuğun o anki duyusal veya emosyonel ihtiyacını fark etmeye çalışırım. Onu sakinleştirecek ko-regülasyon araçlarını devreye sokar, davranışı bastırmak yerine kökündeki tetikleyiciyi anlamaya çalışırım.', weights: { clinical: 0.8, empathy: 1.0 }, analysisInsight: 'Duyusal ve Emosyonel Destek Uzmanı.' }
    ]
  },
  {
    id: 'sped_5', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Zor bir vaka ile çalışırken "küçük adımlar" (task analysis) prensibini nasıl uygularsınız?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Hedefi mikroskobik parçalara bölerim. Çocuk %100 başarı göstermeden bir sonraki aşamaya geçmem; hata biriktirmemek benim için en önemli klinik kuraldır.', weights: { pedagogicalAnalysis: 1.0, clinical: 0.9 }, analysisInsight: 'Hatasız Öğretim Disiplini.' },
      { label: 'Çocuğun doğal akışını bozmamak için daha geniş adımlarla ilerlerim. Hata yapmasına izin vererek "deneme-yanılma" yoluyla öğrenmesini, kognitif bir esneklik kazanmasını desteklerim.', weights: { pedagogicalAnalysis: 0.8, sustainability: 1.0 }, analysisInsight: 'Deneyimsel ve Akışkan Pedagoji.' }
    ]
  }
];