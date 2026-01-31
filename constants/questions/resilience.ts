
import { Question } from '../../types';

export const resilienceQuestions: Question[] = [
  {
    id: 'res_p1_1', category: 'sustainability', type: 'radio',
    text: 'Çok emek verdiğiniz bir vaka 6 aydır "Plato" çiziyor (ilerlemiyor) ve veli sizi yetersizlikle suçluyor. Akşam eve gittiğinizde zihninizdeki ilk cümle?',
    weightedOptions: [
      { label: 'Klinik Merak ve Revizyon: "Vakanın öğrenme bariyeri nerede? Mevcut metodolojimi (ABA/DIR) değiştirmeli ve acilen dış süpervizyon alarak yeni bir eylem planı kurgulamalıyım." (Teknik Odak).', weights: { sustainability: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Yüksek Resilians: Başarısızlığı kişisel bir yetersizlik değil, çözülmesi gereken teknik bir bulmaca olarak görme.' },
      { label: 'Profesyonel Öz-Sorgulama: "Galiba bu vaka için doğru uzman ben değilim, velinin eleştirisinde haklılık payı olabilir." diyerek yetkinliklerimi ve mesleki uygunluğumu derinlemesine sorgularım.', weights: { sustainability: 0.4, personality: -0.5 }, analysisInsight: 'Kırılgan Profil: Dışsal eleştiriyi filtrelemeden kabul eden ve egosal direnci düşük profil.' },
      { label: 'Dışsal Faktör Analizi: "Çocuğun nörolojik kapasitesi ve ailenin evdeki istikrarsızlığı bu sonucu doğuruyor, ben elimden gelenin en iyisini yapıyorum." diyerek vicdani rahatlama sağlarım.', weights: { sustainability: 0.6, clinical: -0.8 }, analysisInsight: 'Savunmacı Kaçınma: Sorumluluğu dış değişkenlere aktararak mesleki gelişimi durdurma riski.' },
      { label: 'Sabır ve Süreç Sadakati: "Her çiçeğin açma zamanı farklıdır, klinik süreçlerde bu duraksamalar doğaldır. Mevcut programın tutarlılığını bozmadan sabırla uygulamaya devam etmeliyim."', weights: { sustainability: 0.8, empathy: 0.9 }, analysisInsight: 'Pasif Direnç: Metodolojik yenilik yapmak yerine statükoyu "sabır" maskesiyle koruma eğilimi.' }
    ]
  },
  {
    id: 'res_p1_3', category: 'sustainability', type: 'radio',
    text: 'Ağır bir seans sonrası (ısırma, tükürme krizleri) bir sonraki seansa girmek için sadece 5 dakikanız var. Kendinizi nasıl "Reset"lersiniz?',
    weightedOptions: [
      { label: 'Somatik Regülasyon (Grounding): 2 dakikalık kontrollü nefes egzersizi yapar, ekstremitelerimi soğuk suyla uyarır ve "Bu benim değil, çocuğun kriziydi" diyerek bilişsel-duygusal ayrışma sağlarım.', weights: { sustainability: 1.0, personality: 0.9 }, analysisInsight: 'Öz-Regülasyon Ustalığı: Duygusal yükü seanslar arası transfer etmeme ve sistemi hızlı soğutma becerisi.' },
      { label: 'Bilişsel Odak Kaydırma: Hemen bir sonraki öğrencinin ham verilerine (Data Sheets) odaklanır, planımı revize ederim; zihni "İş" bağlamına zorlayarak duygusal tortuyu maskelerim.', weights: { sustainability: 0.9, clinical: 0.8 }, analysisInsight: 'Mekanik Dayanıklılık: Duyguyu teknik bilgiyle baskılama ve kontrolü rasyonel alanda tutma.' },
      { label: 'Sosyal Deşarj ve Onay: Bir meslektaşıma "Çok zordu" diyerek kısa bir özet geçer, bir kahve alır ve sosyal destek mekanizmasını aktive ederek motivasyonumu tazelemeye çalışırım.', weights: { sustainability: 0.7, fit: 0.9 }, analysisInsight: 'Dışsal Destek İhtiyacı: Regülasyon için sosyal onay ve paylaşıma bağımlı profil.' },
      { label: 'Emosyonel Blokaj (Numbing): Hiçbir şey olmamış gibi davranır, kendimi duygusal olarak dondururum. Profesyonel maskemi takıp, mekanik bir disiplinle içeri girer ve görevimi yaparım.', weights: { sustainability: 0.5, workEthics: 0.8 }, analysisInsight: 'Riskli Dayanıklılık: Duyguyu bastırarak ilerleme (Uzun vadede aniden patlak verebilecek burnout riski).' }
    ]
  }
];
