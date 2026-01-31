
import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  {
    id: 'eth_p1_1', category: 'workEthics', type: 'radio',
    text: 'Kurum dışı özel ders talebiyle gelen bir veli, ekonomik zorluklarını anlatıp "Siz bize yardım edin, kurumun haberi olmasın, biz aramızda hallederiz" dediğinde ilk düşünceniz ne olur?',
    weightedOptions: [
      { 
        label: 'Kurumsal Bütünlük ve Şeffaflık: "Talebinizdeki insani durumu anlıyorum ancak kurumsal kontratım ve etik ilkelerim şeffaflığı gerektirir. Bu durumu ancak yönetime bildirip bir burs veya indirim imkanı sorgulayarak çözebiliriz."', 
        weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, 
        analysisInsight: 'Kaya Gibi Sadakat: Kurumsal yapıyı ve kendi etikliğini finansal talepten üstün tutma.' 
      },
      { 
        label: 'Klinik Sınır ve Çoklu İlişki: "Özel ders talebinizi kabul etmem, çocukla olan mevcut terapötik ilişkimizi "maddi alışveriş" zeminine çekecek ve klinik tarafsızlığımı bozacaktır. Bu risk çocuğun gelişimine zarar verir."', 
        weights: { workEthics: 1.0, clinical: 0.8 }, 
        analysisInsight: 'Klinik Etik: Durumu sadakatten ziyade "terapi verimliliği" ve "sınır ihlali" üzerinden rasyonalize etme.' 
      },
      { 
        label: 'Alternatif Yönlendirme ve Dayanışma: "Size bu şartlarda kurum dışı destek veremem ancak durumunuza uygun devlet destekli veya vakıf tabanlı ek kaynaklara ulaşmanız için size bir yol haritası sunabilirim."', 
        weights: { workEthics: 0.7, empathy: 1.0 }, 
        analysisInsight: 'Yardımsever Sınır: Kuralı delmeyen ama velinin çaresizliğine çözüm üreten empatik profil.' 
      },
      { 
        label: 'Profesyonel Koruma ve Raporlama: "Bu teklifiniz kurumsal güvenlik prosedürlerimize aykırıdır ve mesleki itibarımı riske atar. Konunun takibini kurum koordinatörlüğü üzerinden resmi kanallarla yapmanız en doğrusudur."', 
        weights: { workEthics: 0.9, sustainability: 0.7 }, 
        analysisInsight: 'Defansif Profesyonellik: Kuralları bir kalkan olarak kullanan ve riskten kaçınan profil.' 
      }
    ]
  }
];
