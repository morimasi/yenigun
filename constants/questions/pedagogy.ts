
import { Question } from '../../types';

export const pedagogyQuestions: Question[] = [
  {
    id: 'acad_ped_1',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Bilimsel olarak kanıtlanmış bir metodun (EBP), vaka üzerinde 3 aydır etkisiz olduğunu verilerle saptadınız. Tavrınız?',
    weightedOptions: [
      { 
        label: 'Metodun uygulanış hassasiyetini sorgular, süpervizyon talep ederim.', 
        weights: { developmentOpenness: 1.0, clinical: 0.9 },
        analysisInsight: 'Özeleştiri ve akademik dürüstlük sahibi.'
      },
      { 
        label: 'Vakanın nöral bariyerleri olduğunu veliye raporlar, beklentiyi düşürürüm.', 
        weights: { clinical: 0.3, personality: 0.5 },
        analysisInsight: 'Dışsal atıf eğilimi, çözüm üretme direnci düşük.'
      }
    ]
  },
  {
    id: 'ped_2',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Vygotsky\'nin "Yakınsal Gelişim Alanı" (ZPD) kavramı özel eğitimde nasıl uygulanmalıdır?',
    weightedOptions: [
      { label: 'Çocuğun tek başına yapabildiği ile yardım alarak yapabildiği o kritik bölgede (scaffolding) kalarak.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Eğitim psikolojisi temelleri sağlam.' },
      { label: 'Çocuğa her zaman yapamayacağı çok zor görevler vererek onu zorlayarak.', weights: { clinical: 0.2, sustainability: 0.3 }, analysisInsight: 'Pedagojik hata riski.' }
    ]
  },
  {
    id: 'ped_3',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Bir öğrenciye "Geri Bildirim" verirken hangisi kalıcı öğrenmeyi sağlar?',
    weightedOptions: [
      { label: 'Sonuca değil, sürece ve stratejiye yönelik (örn: "Bu problemde tablo çizmen harikaydı") spesifik geri bildirim.', weights: { pedagogicalAnalysis: 1.0, empathy: 0.9 }, analysisInsight: 'Gelişim zihniyeti (Growth Mindset) destekçisi.' },
      { label: 'Genel ve kişiliğe yönelik (örn: "Çok akıllısın, harika bir çocuksun") övgüler.', weights: { pedagogicalAnalysis: 0.4, sustainability: 0.5 }, analysisInsight: 'Yanlış pekiştirme alışkanlığı.' }
    ]
  },
  {
    id: 'ped_4',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Bloom Taksonomisine göre, "Analiz" basamağındaki bir öğrenci neyi yapabiliyor olmalıdır?',
    weightedOptions: [
      { label: 'Bilgiyi parçalarına ayırıp aralarındaki ilişkiyi görebiliyor olmalıdır.', weights: { technicalExpertise: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Bilişsel hiyerarşiyi biliyor.' },
      { label: 'Kendisine söylenenleri aynen tekrar edebiliyor olmalıdır.', weights: { technicalExpertise: 0.2, clinical: 0.1 }, analysisInsight: 'Temel pedagojik bilgi eksikliği.' }
    ]
  },
  {
    id: 'ped_5',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Sınıf yönetiminde "Proaktif" yaklaşım neyi ifade eder?',
    weightedOptions: [
      { label: 'Problem davranış çıkmadan önce ortamı ve kuralları düzenleyerek önleyici tedbir almayı.', weights: { clinical: 1.0, leadership: 0.9 }, analysisInsight: 'Kriz öncesi yönetim yeteneği yüksek.' },
      { label: 'Problem çıktıktan sonra en hızlı ve sert şekilde müdahale etmeyi.', weights: { clinical: 0.3, integrity: 0.5 }, analysisInsight: 'Reaktif ve gergin profil.' }
    ]
  },
  {
    id: 'ped_6',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Öğrenci bir konuyu öğrenmekte çok dirençliyse "Uyumlu Müfredat" (Adaptive Curriculum) nasıl devreye girer?',
    weightedOptions: [
      { label: 'Konuyu çocuğun ilgisini çeken bir bağlama (context) oturtarak ve çoklu temsil yolları kullanarak.', weights: { pedagogicalAnalysis: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Yaratıcı eğitimci profili.' },
      { label: 'Konuyu daha basitleştirerek ve öğrenene kadar her gün aynı kağıdı vererek.', weights: { pedagogicalAnalysis: 0.4, clinical: 0.6 }, analysisInsight: 'Tekdüze ve sıkıcı pedagoji.' }
    ]
  },
  {
    id: 'ped_7',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Metabilişsel (Metacognitive) becerileri desteklemek için öğrencide hangi alışkanlığı başlatırsınız?',
    weightedOptions: [
      { label: 'Bir görevi bitirdiğinde "Nasıl yaptım? Nerede zorlandım?" diye kendi kendini sorgulamasını.', weights: { pedagogicalAnalysis: 1.0, clinical: 0.9 }, analysisInsight: 'Öğrenmeyi öğreten (mentor) kimlik.' },
      { label: 'Hata yaptığında hemen silip doğrusunu öğretmenden istemesini.', weights: { pedagogicalAnalysis: 0.2, sustainability: 0.4 }, analysisInsight: 'Bağımlı öğrenci yetiştirme riski.' }
    ]
  },
  {
    id: 'ped_8',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Gardner\'ın "Çoklu Zeka" kuramına göre, Bedensel-Kinestetik zekası yüksek bir çocuğa okuma nasıl öğretilir?',
    weightedOptions: [
      { label: 'Harfleri vücuduyla yapmasını isteyerek veya havada/yerde devasa harfler çizdirerek.', weights: { pedagogicalAnalysis: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Bireysel farkları pedagojiye yansıtıyor.' },
      { label: 'Ona bol bol kitap okuyarak ve resimlerini göstererek.', weights: { pedagogicalAnalysis: 0.4, empathy: 0.6 }, analysisInsight: 'Metodolojik uyum zayıf.' }
    ]
  },
  {
    id: 'ped_9',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Pozitif Eğitim Ortamı (Positive Climate) kurmak için hangisi en kritiktir?',
    weightedOptions: [
      { label: 'Hata yapmanın korkulacak bir şey değil, öğrenme fırsatı olduğu bir kültür yaratmak.', weights: { pedagogicalAnalysis: 1.0, sustainability: 1.0 }, analysisInsight: 'Güvenli öğrenme alanı mimarı.' },
      { label: 'Sınıfta sessizliği ve mutlak disiplini her ne pahasına olursa olsun korumak.', weights: { pedagogicalAnalysis: 0.3, personality: 0.7 }, analysisInsight: 'Baskıcı eğitim anlayışı.' }
    ]
  },
  {
    id: 'ped_10',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Bir dersin "Kapanış" (Closing) aşamasında öğretmen neyi hedeflemelidir?',
    weightedOptions: [
      { label: 'Öğrenilenlerin sentezini yapmayı ve bir sonraki dersle olan köprüyü kurmayı.', weights: { pedagogicalAnalysis: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Planlama ve organizasyon yetisi yüksek.' },
      { label: 'Ödevleri verip sınıfı bir an önce toparlayıp boşaltmayı.', weights: { pedagogicalAnalysis: 0.2, sustainability: 0.4 }, analysisInsight: 'Motivasyonu düşük, görev odaklı.' }
    ]
  }
];
