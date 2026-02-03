
import { Question } from '../../types';

export const visionQuestions: Question[] = [
  {
    id: 'vis_p1_5', category: 'institutionalLoyalty', type: 'radio',
    text: 'Dışarıdan bir kurum size %30 daha fazla maaş ama "daha düşük akademik kalite" teklif etti. Karar kriteriniz ne olur?',
    weightedOptions: [
      { label: 'Teklifi reddederim. Standart altı bir kurum klinik kaslarımı köreltir.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'İlkesel Sadakat.' },
      { label: 'Eğer o kurumda "Sistem Kurucu" olacaksam değerlendiririm.', weights: { institutionalLoyalty: 0.6, leadership: 0.9 }, analysisInsight: 'Güç Odaklı Profil.' },
      { label: 'Mevcut kurumuma durumu açar, şartların iyileştirilmesini isterim.', weights: { institutionalLoyalty: 0.8, fit: 0.7 }, analysisInsight: 'Şeffaf Pragmatist.' },
      { label: 'Kabul ederim. Profesyonel hayat bir emek-sermaye dengesidir.', weights: { institutionalLoyalty: -1.0, personality: 0.8 }, analysisInsight: 'Mobil Realist.' }
    ]
  },
  {
    id: 'vis_p2_1', category: 'developmentOpenness', type: 'radio',
    text: 'Yeni bir bilimsel araştırma, yıllardır uyguladığınız bir metodun "etkisiz" olduğunu kanıtladı. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Eski yöntemi derhal terk eder, yeni protokol üzerine yoğun bir eğitim sürecine girerim.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Yüksek Öğrenme Çevikliği.' },
      { label: 'Araştırmayı derinlemesine inceler, kendi vaka sonuçlarımla karşılaştırıp kademeli geçiş yaparım.', weights: { developmentOpenness: 0.8, technicalExpertise: 0.9 }, analysisInsight: 'Analitik Tutuculuk.' }
    ]
  },
  {
    id: 'vis_3',
    category: 'institutionalLoyalty',
    type: 'radio',
    text: 'Kurumda 5 yıl sonra kendinizi hangi pozisyonda görüyorsunuz?',
    weightedOptions: [
      { label: 'Kurumun akademik standartlarını belirleyen bir "Klinik Süpervizör" veya "Mentor" olarak.', weights: { institutionalLoyalty: 1.0, leadership: 1.0 }, analysisInsight: 'Yüksek aidiyet ve liderlik vizyonu.' },
      { label: 'Kendi merkezini açmış veya bağımsız danışmanlık veren bir uzman olarak.', weights: { institutionalLoyalty: 0.2, sustainability: 0.6 }, analysisInsight: 'Bireysel kariyer odaklı, geçici personel riski.' }
    ]
  },
  {
    id: 'vis_4',
    category: 'institutionalLoyalty',
    type: 'radio',
    text: 'Kurumun marka itibarını zedeleyecek bir "hata" yapıldığını gördünüz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Sorunu hemen iç kanallarda çözmek için çözüm odaklı bir rapor sunar, kurum dışına sızmasını engellerim.', weights: { institutionalLoyalty: 1.0, integrity: 0.9 }, analysisInsight: 'Koruyucu ve sadık personel.' },
      { label: 'Dürüstlük gereği bu hatayı sosyal medyada veya diğer velilerle paylaşırım.', weights: { institutionalLoyalty: -0.5, integrity: 1.0 }, analysisInsight: 'Yıkıcı dürüstlük, kurumsal risk.' }
    ]
  },
  {
    id: 'vis_5',
    category: 'developmentOpenness',
    type: 'radio',
    text: 'Uzmanlık alanınızda "yıldız" bir isim olmak mı, "en çok kazanan" isim olmak mı önceliğinizdir?',
    weightedOptions: [
      { label: 'Akademik olarak referans gösterilen bir "yıldız" olmak; başarı beraberinde maddi getiriyi zaten getirir.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Akademik motivasyonu yüksek.' },
      { label: 'Maddi olarak en üst seviyeye ulaşmak; iş hayatının asıl amacı budur.', weights: { developmentOpenness: 0.4, institutionalLoyalty: 0.3 }, analysisInsight: 'Finansal odaklı, teknik derinlik ikincil olabilir.' }
    ]
  },
  {
    id: 'vis_6',
    category: 'institutionalLoyalty',
    type: 'radio',
    text: 'Kurumun belirlediği "Kıyafet Kodu" veya "Kurumsal Dil" size kısıtlayıcı geliyor mu?',
    weightedOptions: [
      { label: 'Hayır; kurumsal kimliğin bir parçası olduğunu kabul eder ve profesyonel disiplinle uygularım.', weights: { institutionalLoyalty: 1.0, workEthics: 1.0 }, analysisInsight: 'Disiplinli ve kurallara uyumlu.' },
      { label: 'Evet; bu tarz şekilci kuralların yaratıcılığımı ve klinik özgürlüğümü kısıtladığını düşünürüm.', weights: { institutionalLoyalty: 0.3, personality: 0.8 }, analysisInsight: 'Bireyselci ve kurumsal direnç potansiyeli.' }
    ]
  },
  {
    id: 'vis_7',
    category: 'developmentOpenness',
    type: 'radio',
    text: 'Süpervizyon almayı "yetersizlik" mi yoksa "güçlenme" mi olarak görürsünüz?',
    weightedOptions: [
      // @fix: Removed duplicate developmentOpenness key and added clinical to maintain weighting logic and resolve syntax error.
      { label: 'Güçlenme; en iyi uzmanların bile dışarıdan bir göze (peer-review) ihtiyacı olduğunu bilirim.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Öğrenmeye ve denetime açık.' },
      { label: 'Zayıflık; bir uzman her vakanın çözümünü kendi içinde bulabilmelidir.', weights: { developmentOpenness: 0.2, clinical: 0.5 }, analysisInsight: 'Mesleki narsisizm ve hata gizleme riski.' }
    ]
  },
  {
    id: 'vis_8',
    category: 'institutionalLoyalty',
    type: 'radio',
    text: 'Kurumun çok yoğun olduğu bir dönemde, karşılıksız "ekstra mesai" talebine yanıtınız?',
    weightedOptions: [
      { label: 'Kurumsal zorluk dönemlerinde elimden gelen desteği veririm; geminin yürümesi benim sorumluluğumdur.', weights: { institutionalLoyalty: 1.0, sustainability: 0.8 }, analysisInsight: 'Yüksek fedakarlık ve kurum aidiyeti.' },
      { label: 'Sadece sözleşmemdeki saatlere uyarım; emeğimin karşılığı yoksa fazlasını yapmam.', weights: { institutionalLoyalty: 0.3, sustainability: 1.0 }, analysisInsight: 'Sınırları keskin, düşük aidiyet.' }
    ]
  },
  {
    id: 'vis_9',
    category: 'developmentOpenness',
    type: 'radio',
    text: 'Bir vakanın ilerlemesi için branşınız dışındaki bir eğitimi (örn: Oyun Terapisi) kendi cebinden alır mısınız?',
    weightedOptions: [
      { label: 'Evet; eğer vaka başarısı için şartsa kendimi her alanda donatmak görevimdir.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Aşırı özverili ve gelişim odaklı.' },
      { label: 'Hayır; kurum bu eğitimi karşılamıyorsa almamı beklemeleri haksızlıktır.', weights: { developmentOpenness: 0.4, institutionalLoyalty: 0.5 }, analysisInsight: 'Koşullu gelişim eğilimi.' }
    ]
  },
  {
    id: 'vis_10',
    category: 'institutionalLoyalty',
    type: 'radio',
    text: 'Yeni Gün Akademi\'yi 3 kelimeyle tanımlasanız hangilerini seçerdiniz?',
    weightedOptions: [
      { label: 'Liyakat, Bilimsellik, Gelecek.', weights: { institutionalLoyalty: 1.0, vision: 1.0 }, analysisInsight: 'Kurumsal değerlerle tam uyum.' },
      { label: 'İş, Maaş, Disiplin.', weights: { institutionalLoyalty: 0.4, personality: 0.6 }, analysisInsight: 'Sığ ve mekanik ilişki.' }
    ]
  }
];
