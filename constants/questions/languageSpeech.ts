import { Question, Branch } from '../../types';

export const languageSpeechQuestions: Question[] = [
  {
    id: 'slp_1', category: 'technicalExpertise', type: 'radio',
    text: 'Artikülasyon terapisinde çocuğun bir sesi üretiminde zorlanması durumunda metodolojik tercihiniz nedir?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Hiyerarşik bir sıra izlerim; sesin izolasyon aşamasında tam kontrol sağlanmadan hece veya kelime düzeyine geçmem, motor öğrenme prensiplerine sıkı sıkıya bağlı kalırım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Motor Öğrenme Disiplini.' },
      { label: 'Çocuğun günlük hayatında en çok kullandığı kelimelere odaklanırım. Sesin tam mükemmelliği yerine fonksiyonelliği ve anlaşılırlığı önceler, motivasyonu diri tutarım.', weights: { clinical: 0.8, empathy: 0.9 }, analysisInsight: 'İşlevsel ve İletişim Odaklı.' }
    ]
  },
  {
    id: 'slp_2', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Ekolalisi yoğun olan bir vaka ile çalışırken tutumunuz nasıldır?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Ekolaliyi bir iletişim girişimi olarak kabul ederim. Çocuğun tekrarlarını anlamlı hale getirmek için "genişletme" (mitigation) yapar ve bu durumu doğal bir köprü olarak kullanırım.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Modern Dil Edinim Yaklaşımı.' },
      { label: 'Ekolalinin işlevsel olmayan bir taklit olduğunu varsayar, doğru cevabı modelleyerek çocuğun anlamsız tekrarlarını söndürmeye ve direkt iletişime yönlendirmeye odaklanırım.', weights: { clinical: 0.7, technicalExpertise: 0.9 }, analysisInsight: 'Davranışçı Müdahale Odaklı.' }
    ]
  },
  {
    id: 'slp_3', category: 'technicalExpertise', type: 'radio',
    text: 'Kekemelik (akıcılık bozukluğu) olan bir çocukta ilk hedefiniz nedir?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Çocuğun konuşmaya karşı geliştirdiği ikincil davranışları ve kaygıyı azaltmaya odaklanırım; kekemelikle barışık, "rahat kekeleme" stratejilerini öncelerim.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Psikososyal ve Duyarlı Yaklaşım.' },
      { label: 'Doğrudan akıcılığı artıracak teknikleri (nefes kontrolü, yumuşak başlangıç vb.) öğretirim; akıcılık arttıkça kaygının zaten kendiliğinden azalacağına inanırım.', weights: { clinical: 0.8, technicalExpertise: 1.0 }, analysisInsight: 'Teknik ve Beceri Odaklı Yaklaşım.' }
    ]
  },
  {
    id: 'slp_4', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Sözel olmayan (non-verbal) bir vaka için iletişim sistemi seçerken hangisine öncelik verirsiniz?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Vakanın bilişsel yükünü azaltacak ve hızlı sonuç verecek Resim Değiş Tokuşu (PECS) gibi sistemleri önceler, çocuğun "isteme" becerisini hemen aktive ederim.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Hızlı ve Somut Sonuç Odaklı.' },
      { label: 'Eğer motor potansiyeli varsa işaret dili veya yüksek teknolojili AAC cihazlarını zorlarım; daha geniş bir ifade alanı açmanın uzun vadedeki kognitif faydasını önemserim.', weights: { clinical: 0.9, developmentOpenness: 1.0 }, analysisInsight: 'Vizyoner ve Genişletici Yaklaşım.' }
    ]
  },
  {
    id: 'slp_5', category: 'technicalExpertise', type: 'radio',
    text: 'Vaka seans sırasında çok yorulduğunu ve artık konuşmak istemediğini belli ediyor. Nasıl bir karar alırsınız?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Oyun bazlı bir geçiş yaparak sözel talepleri gizli bir şekilde sürdürürüm. "Zorlanmadan öğrenme" (implicit learning) moduna geçerek seansı akademik olarak kurtarmaya çalışırım.', weights: { clinical: 1.0, sustainability: 1.0 }, analysisInsight: 'Yaratıcı ve Sürdürülebilir Strateji.' },
      { label: 'Çocuğun sınırına saygı duyarak seansı bitiririm veya dinlenmesine izin veririm. Zorlamanın çocukta "iletişim kaçınması" yaratabileceği riskini her zaman göz önünde bulundururum.', weights: { clinical: 0.8, empathy: 1.0 }, analysisInsight: 'Vaka Güvenliği ve Saygı Odaklı.' }
    ]
  }
];