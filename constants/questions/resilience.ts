import { Question } from '../../types';

export const resilienceQuestions: Question[] = [
  {
    id: 'res_1', category: 'sustainability', type: 'radio',
    text: 'Aynı gün içinde 3 farklı çocuk size fiziksel zarar verdi (Isırma/Vurma). Akşam işten çıkarken modunuz nedir?',
    weightedOptions: [
      { label: 'İşimin doğasının bu olduğunu kabul ederim; "Bu sadece bir davranış verisidir, çocuk beni değil rolümü hedef aldı" diyerek mesleki mesafemi korur, akşamımı etkiletmem.', weights: { sustainability: 1.0, clinical: 0.9 }, analysisInsight: 'Güçlü Ego Sınırı ve Dayanıklılık.' },
      { label: 'Kendi yetkinliğimi sorgularım; "Neyi yanlış yaptım da çocuklar bu kadar reaktifleşti?" diyerek yaşadığım yorgunluğun ve üzüntünün mesai dışına taşmasına engel olamam.', weights: { sustainability: 0.5, empathy: 0.9 }, analysisInsight: 'Düşük Duygusal Regülasyon.' }
    ]
  },
  {
    id: 'res_2', category: 'sustainability', type: 'radio',
    text: '6 aydır üzerinde çalıştığınız vaka ilerlemiyor ve veli sizi "yetersizlikle" suçluyor. İçsel muhakemeniz ne olur?',
    weightedOptions: [
      { label: 'Veli suçlamalarına değil verilere bakarım; "Vakanın nöral profilinde bir bariyer mi var?" diyerek rasyonel bir özeleştiri sürecine girerim.', weights: { sustainability: 1.0, clinical: 1.0 }, analysisInsight: 'Analitik Direnç.' },
      { label: 'Velinin hayal kırıklığını derinlemesine anlarım; onlarla derhal bir "duygusal onarım" toplantısı yapar, bağı güçlendirmeye öncelik veririm.', weights: { sustainability: 0.8, empathy: 1.0 }, analysisInsight: 'Yüksek Duygusal Zeka.' }
    ]
  },
  {
    id: 'res_3', category: 'sustainability', type: 'radio',
    text: 'Kurumda herkesin stresli olduğu bir kriz dönemindesiniz. Sizin ortamdaki rolünüz nedir?',
    weightedOptions: [
      { label: 'Sessiz ve stabil kalırım; kendi işlerime odaklanarak paniği yaymam, arkadaşlarımın da sakin kalması için profesyonel bir model sergilerim.', weights: { sustainability: 1.0, leadership: 0.9 }, analysisInsight: 'Stabil Liderlik Potansiyeli.' },
      { label: 'Kaygılarımı arkadaşlarımla paylaşırım; "Birlikte dertleşmek bizi rahatlatır" diyerek emosyonel bir paylaşım grubu oluşturur ve stresin deşarj edilmesini sağlarım.', weights: { sustainability: 0.4, empathy: 0.8 }, analysisInsight: 'Kaygıya Duyarlı Profil.' }
    ]
  },
  {
    id: 'res_4', category: 'sustainability', type: 'radio',
    text: 'Ciddi bir "Burnout" (tükenmişlik) hissettiğinizde ilk hamleniz ne olur?',
    weightedOptions: [
      { label: 'Yönetimle şeffafça konuşur, vaka yükümü geçici olarak optimize eder ve profesyonel destek alırım; sürdürülebilirliğimi öncelerim.', weights: { sustainability: 1.0, integrity: 1.0 }, analysisInsight: 'Sınırlarını Koruyan / Sürdürülebilir.' },
      { label: 'Hissedilen yorgunluğu gizler, seanslarda daha az efor sarf ederek dinlenmeye çalışırım; kurumun benim "zayıf" olduğumu düşünmesini istemem.', weights: { sustainability: 0.2, clinical: 0.3 }, analysisInsight: 'Gizli Klinik Risk Faktörü.' }
    ]
  },
  {
    id: 'res_5', category: 'sustainability', type: 'radio',
    text: 'Bir vakanızın beklenmedik vefatı veya ağır bir kaza geçirmesi durumunda profesyonel duruşunuz ne olur?',
    weightedOptions: [
      { label: 'Yasta olan aileye klinik mesafe içinde destek veririm ancak kendi duygusal sınırlarımı korumak için süpervizyon alarak işime devam ederim.', weights: { sustainability: 1.0, workEthics: 1.0 }, analysisInsight: 'Profesyonel Metanet.' },
      { label: 'Olaydan o kadar çok etkilenirim ki bir süre hiçbir vakaya odaklanamam; bu kaybı kişisel bir kayıp gibi derinden yaşarım.', weights: { sustainability: 0.3, empathy: 1.0 }, analysisInsight: 'Aşırı Duyarlı / Travmaya Açık.' }
    ]
  },
  {
    id: 'res_6', category: 'sustainability', type: 'radio',
    text: 'Maaşınızın artmadığı bir dönemde kurum size ücretsiz ama prestijli bir eğitim teklif etti. Tavrınız?',
    weightedOptions: [
      { label: 'Eğitimi büyük bir şans olarak görürüm; liyakatimin artmasının uzun vadede her türlü kazançtan değerli olduğunu bilirim.', weights: { sustainability: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Vizyoner ve Kariyere Odaklı.' },
      { label: 'Maddi karşılığı olmayan bir eğitime vakit ayırmayı reddederim; kurumun emeğimi bedavaya kullanmaya çalıştığını düşünürüm.', weights: { sustainability: 0.2, institutionalLoyalty: 0.1 }, analysisInsight: 'Kısa Vadeli ve Pragmatist.' }
    ]
  },
  {
    id: 'res_7', category: 'sustainability', type: 'radio',
    text: 'Çok ağır ve agresif vakaların olduğu bir branşa atanmak size ne hissettirir?',
    weightedOptions: [
      { label: 'Heyecan ve meydan okuma hissi; bu tarz vakaların klinik kaslarımı en çok geliştiren alan olduğunu düşünürüm.', weights: { sustainability: 1.0, developmentOpenness: 0.9 }, analysisInsight: 'Yüksek Gelişim Açlığı.' },
      { label: 'Kaygı ve tükenmişlik korkusu; daha stabil ve sakin vakalarla çalışarak meslek hayatımı uzun tutmayı tercih ederim.', weights: { sustainability: 0.6, personality: 0.8 }, analysisInsight: 'Konfor Alanı ve İstikrar Odaklı.' }
    ]
  },
  {
    id: 'res_8', category: 'sustainability', type: 'radio',
    text: 'Sınıfta büyük bir "temizlik kazası" veya vakanın yarattığı bir karmaşa oldu. İlk tepkiniz?',
    weightedOptions: [
      { label: 'Hiç gocunmadan vaka ile birlikte ortalığı toparlarım; bu durumu bile bir "özbakım dersi" ve "sorumluluk kazanımı" fırsatına çeviririm.', weights: { sustainability: 1.0, pedagogicalAnalysis: 0.9 }, analysisInsight: 'Çözümcü ve Fırsatçı Eğitimci.' },
      { label: 'Yardımcı personeli çağırırım ve temizlik bitene kadar vaka ile koridora çıkarım; benim görevimin sadece eğitim olduğunu ve bu tarz işlerin odağımı bozduğunu düşünürüm.', weights: { sustainability: 0.4, institutionalLoyalty: 0.5 }, analysisInsight: 'Kuralcı ve Hiyerarşik.' }
    ]
  },
  {
    id: 'res_9', category: 'sustainability', type: 'radio',
    text: 'Bir meslektaşınız sizin hakkınızda asılsız bir dedikodu çıkardı. Tepkiniz?',
    weightedOptions: [
      { label: 'Kişiyle profesyonel bir zeminde yüzleşir, sonuç alamazsam disiplin kanallarını işletir ve işime sükunetle devam ederim.', weights: { sustainability: 1.0, leadership: 0.9 }, analysisInsight: 'Duygusal Dayanıklılığı Yüksek.' },
      { label: 'Ben de onun hakkında konuşarak karşılık veririm veya kuruma küserim; haksızlığa uğradığım bir yerde verimli olamam.', weights: { sustainability: 0.2, personality: 0.4 }, analysisInsight: 'Tepkisel ve Uyumsuz.' }
    ]
  },
  {
    id: 'res_10', category: 'sustainability', type: 'radio',
    text: 'Aynı vaka üzerinde 3 yıl çalışmak mı, her yıl farklı vakalarla karşılaşmak mı sizi diri tutar?',
    weightedOptions: [
      { label: 'Farklı vakalar; konfor alanımdan çıkmak ve yeni klinik bariyerleri aşmak benim gelişim motorumdur.', weights: { sustainability: 0.9, developmentOpenness: 1.0 }, analysisInsight: 'Yüksek Adaptasyon ve Çeviklik.' },
      { label: 'Aynı vaka; vakanın her evresine hakim olmak ve derinleşmek bana huzur ve güven verir.', weights: { sustainability: 1.0, technicalExpertise: 0.8 }, analysisInsight: 'Derinleşme ve Sabır Odaklı.' }
    ]
  }
];