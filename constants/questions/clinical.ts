
import { Question } from '../../types';

export const clinicalQuestions: Question[] = [
  {
    id: 'clin_shadow_1', category: 'technicalExpertise', type: 'radio',
    text: 'Yoğun bir "Kendine Zarar Verme" (SIB) krizinde, çocuğun burnunun aktığını ve salyasının aktığını fark ettiniz. Saniyelik "ABC" kararınız ne olur?',
    weightedOptions: [
      { label: 'Klinik Disiplin ve Sönme (Extinction): Kafasını korumak için el yastığı yaparım (güvenlik) ancak göz teması kurmadan, nötr bir yüzle krizin sönmesini beklerim. Temizlik, kriz tamamen bitip çocuk regüle olduktan sonra yapılır.', weights: { clinical: 1.0, empathy: 0.2, sustainability: 0.8 }, analysisInsight: 'Klinik Disiplin: Güvenliği sağlarken davranışı beslememe (Extinction) becerisi.' },
      { label: 'Bakım ve Şefkat Odaklı Müdahale: Öncelik çocuğun konforu ve hijyenidir. Davranışı durdurmaya çalışırken aynı zamanda cebimden peçete çıkarıp yüzünü silerim, böylece rahatlayıp sakinleşmesine yardımcı olurum.', weights: { clinical: -0.6, empathy: 1.0, sustainability: -0.2 }, analysisInsight: 'Şefkat Tuzağı: Davranış anında fiziksel temas ve bakım vererek, problem davranışın işlevini "ilgi" veya "rahatlama" ile farkında olmadan pekiştirme (Accidental Reinforcement) riski.' },
      { label: 'Sözel Yönerge ve Kontrol: Çocuğun ellerini tutarak "Yapma, burnunu silelim" derim ve sakinleşmesi için sözel telkinlerde bulunurum.', weights: { clinical: -0.8, empathy: 0.2, sustainability: -0.5 }, analysisInsight: 'Veri Kirliliği: Kriz anında verilen sözel uyaranlar ve temas, davranışı besleyen "sosyal dikkat" hatasına dönüşebilir.' },
      { label: 'Seans İptali ve Aileye Devir: Hijyen sorunu ve kendine zarar verme riski birleştiğinde ders işlenemez. Seansı sonlandırır, çocuğu temizlemesi ve sakinleştirmesi için veliye teslim ederim.', weights: { clinical: -1.0, empathy: -0.5, institutionalLoyalty: -0.5 }, analysisInsight: 'Mesleki Kaçınma: Terapistin kriz anında otoriteyi ve sorumluluğu terk etmesi.' }
    ]
  },
  {
    id: 'clin_new_add_1', category: 'technicalExpertise', type: 'radio',
    text: 'Çocuğa "Bardak" kavramını öğretirken sadece "kırmızı plastik bir bardak" kullanılarak öğretim yapılmış ve çocuk başka hiçbir bardağı tanımıyor. Bu durumun klinik adı nedir ve nasıl düzeltilir?',
    weightedOptions: [
      { label: 'Hatalı Uyaran Kontrolü (Faulty Stimulus Control): Öğretim "Çoklu Örnekler" (Multiple Exemplars) ile yapılmadığı için çocuk kavramı (şekil) değil, ilgisiz bir özelliği (renk/materyal) öğrenmiştir. Hemen cam, kağıt, kulplu, farklı renklerde bardaklarla "Yeterli Örneklem" seti çalışılarak genelleme sağlanmalıdır.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Genelleme Hatası Tespiti: Kavram öğretiminin temel prensibi olan "Stimulus Generalization" hakimiyeti.' },
      { label: 'Zeka Geriliği ve Soyutlama Eksikliği: Çocuk soyutlama yapamıyor, zeka seviyesi buna uygun değil. Daha basit (Somut) kavramlara dönülmeli ve görsel destek azaltılmalıdır.', weights: { clinical: -0.5 }, analysisInsight: 'Yanlış Etiketleme: Öğretim hatasını çocuğun kapasitesine bağlama (Fundamental Attribution Error).' },
      { label: 'Seçici Dikkat (Selective Attention): Çocuk bardağın rengine odaklanmış, şekline değil. Kırmızı olan her şeye bardak diyebilir. Kırmızı rengi ortamdan tamamen kaldırarak çalışılmalıdır.', weights: { clinical: 0.2 }, analysisInsight: 'Kısmen Doğru ama Yetersiz: Sorun dikkat değil, öğretim tasarımıdır (Instructional Design).' },
      { label: 'Sönme (Extinction): Çocuk öğrenmiş ama pekiştireç yetersizliğinden unutmuş. Tekrar edilmeli.', weights: { clinical: -0.2 }, analysisInsight: 'Hatalı Tespit: Yanlış öğrenme (Over-selectivity), unutma değildir.' }
    ]
  }
];
