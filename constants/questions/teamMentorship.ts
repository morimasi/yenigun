
import { Question } from '../../types';

export const teamMentorshipQuestions: Question[] = [
  {
    id: 'team_ment_1', category: 'team_player', type: 'radio',
    text: 'Aynı vaka üzerinde çalıştığınız başka branştan bir meslektaşınızın hedeflerinizi sabote ettiğini fark ettiniz. İlk hamleniz?',
    weightedOptions: [
      { label: 'Koordinatör eşliğinde "Vaka Konseyi" toplanmasını talep eder, ortak bir "Hibrit Müdahale Planı" öneririm.', weights: { team_player: 1.0, leadership: 0.8 }, analysisInsight: 'Sistemik çözüm odaklı.' },
      { label: 'Meslektaşımı uyarırım; tavrını değiştirmezse sorumluluk almayacağımı yönetime bildiririm.', weights: { team_player: 0.3, personality: 0.7 }, analysisInsight: 'Defansif ve çatışmacı profil.' }
    ]
  },
  {
    id: 'team_ment_2', category: 'leadership', type: 'radio',
    text: 'Yeni başlayan bir junior uzmana mentorluk yapmanız istendi ama iş yükünüz çok yoğun. Yaklaşımınız?',
    weightedOptions: [
      { label: 'Mentorluğu "Kurumsal Hafıza" aktarımı olarak görürüm; iş yükümü optimize eder, junioru sisteme kazandırırım.', weights: { leadership: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek liderlik potansiyeli.' },
      { label: 'Junior uzmanın sadece beni izlemesini isterim; vakit ayırıp seans kalitemi düşürmem.', weights: { leadership: 0.4, sustainability: 0.7 }, analysisInsight: 'Korumacı ama gelişime kapalı.' }
    ]
  },
  {
    id: 'team_ment_3', category: 'team_player', type: 'radio',
    text: 'Ekip toplantısında çoğunluk (haksız olduklarını düşünseniz de) fikrinizi reddetti. Tavrınız?',
    weightedOptions: [
      { label: 'Karara kurumsal disiplin gereği uyarım ancak çekincelerimi "Bilimsel Şerh" olarak tutanağa geçirtirim.', weights: { team_player: 1.0, integrity: 1.0 }, analysisInsight: 'Demokratik ama ilkeli.' },
      { label: 'Fikrimde ısrarcı olurum; karara pasif direnç gösterir, kendi bildiğim yoldan giderim.', weights: { team_player: 0.2, personality: 0.8 }, analysisInsight: 'Uyumsuz ve direnç odağı.' }
    ]
  },
  {
    id: 'team_ment_4', category: 'leadership', type: 'radio',
    text: 'Geliştirdiğiniz etkili bir "Değerlendirme Formu"nu diğer branşlarla paylaşır mısınız?',
    weightedOptions: [
      { label: 'Kesinlikle; kurum içi standardizasyonun vaka başarısını artıracağını bilir ve eğitim vermeyi teklif ederim.', weights: { leadership: 1.0, team_player: 1.0 }, analysisInsight: 'Kolektif zeka destekçisi.' },
      { label: 'Sadece kendi branşımdakilerle paylaşırım; diğerlerinin yanlış yorumlamasından çekinirim.', weights: { leadership: 0.5, clinical: 0.7 }, analysisInsight: 'Silo odaklı uzmanlık.' }
    ]
  },
  {
    id: 'team_ment_5', category: 'team_player', type: 'radio',
    text: 'Dışarıdan bir uzmanın vakanıza "Süpervizör" olarak bakması istendi. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Bunu kendimi geliştirmek için şans görür, eleştirileri klinik bir reçete gibi uygularım.', weights: { developmentOpenness: 1.0, team_player: 1.0 }, analysisInsight: 'Profesyonel olgunluk.' },
      { label: 'Vakayı en iyi benim tanıdığımı savunur, dışarıdan müdahaleyi özerkliğime saldırı sayarım.', weights: { developmentOpenness: 0.2, personality: 0.8 }, analysisInsight: 'Yüksek mesleki narsisizm.' }
    ]
  },
  {
    id: 'team_ment_6', category: 'leadership', type: 'radio',
    text: 'Ekibinizden birinin ciddi bir "Burnout" yaşadığını gördünüz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Onunla profesyonel bir kahve sohbeti yapar, vaka yükünün paylaşılması için yönetime rapor sunarım.', weights: { leadership: 1.0, empathy: 1.0 }, analysisInsight: 'İnsan odaklı liderlik.' },
      { label: 'Vaka güvenliğini riske attığını düşünerek durumu hemen yönetime şikayet ederim.', weights: { leadership: 0.4, integrity: 0.8 }, analysisInsight: 'Kuralcı ama empati yoksunu.' }
    ]
  },
  {
    id: 'team_ment_7', category: 'team_player', type: 'radio',
    text: 'Kurumda branşlar arası bir vaka sunumu günü düzenlenecek. Rolünüz nedir?',
    weightedOptions: [
      { label: 'Aktif sorumluluk alır, karmaşık vakalarımı bilimsel bir dille sunar ve tartışmayı körüklerim.', weights: { team_player: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Akademik katalizör.' },
      { label: 'Zorunlu değilse katılmam; seanslarıma odaklanmanın daha profesyonel olduğunu savunurum.', weights: { team_player: 0.3, sustainability: 0.6 }, analysisInsight: 'Sosyal izolasyon eğilimi.' }
    ]
  },
  {
    id: 'team_ment_8', category: 'leadership', type: 'radio',
    text: 'Junior bir meslektaşınızın veli önünde yanlış bilgi verdiğini gördünüz. O an müdahaleniz?',
    weightedOptions: [
      { label: 'Veliye hissettirmeden söze girer, teknik hatayı düzelten bir ekleme yapar, sonra birebirde konuşurum.', weights: { leadership: 1.0, team_player: 1.0 }, analysisInsight: 'Usta mentorluk.' },
      { label: 'Velinin önünde hatayı düzeltirim; doğruluğun meslektaş korumaktan önemli olduğunu düşünürim.', weights: { leadership: 0.5, integrity: 1.0 }, analysisInsight: 'Hiyerarşik ego.' }
    ]
  },
  {
    id: 'team_ment_9', category: 'team_player', type: 'radio',
    text: 'Ortak kullanılan materyal odasında birinin materyalleri bozduğunu gördünüz. Tavrınız?',
    weightedOptions: [
      { label: 'Ortak alan kullanımı için bir "Etik Protokol" hazırlar ve sistemik iyileştirme önerisi sunarım.', weights: { team_player: 1.0, leadership: 0.8 }, analysisInsight: 'Kurumsal tasarımcı.' },
      { label: 'Kişiyi herkesin içinde uyarırım; materyallerin vaka hakkı olduğunu savunurum.', weights: { team_player: 0.4, integrity: 0.7 }, analysisInsight: 'Reaktif ekip dinamiği.' }
    ]
  },
  {
    id: 'team_ment_10', category: 'leadership', type: 'radio',
    text: 'Kurumda bir "Klinik Arşiv" oluşturulması fikri çıktı. Katkınız ne olur?',
    weightedOptions: [
      { label: 'Zorlu vaka süreçlerimi "Fallback" stratejileriyle dökümante eder, gelecek nesle rehber yaparım.', weights: { leadership: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Vizyoner kurumsal miras.' },
      { label: 'Vaka gizliliği nedeniyle paylaşımların riskli olduğunu savunur, kendime saklarım.', weights: { leadership: 0.2, workEthics: 0.9 }, analysisInsight: 'Aşırı korumacı profil.' }
    ]
  }
];
