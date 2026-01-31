
import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  {
    id: 'eth_shadow_1', category: 'workEthics', type: 'radio',
    text: 'Kurumun "Veliyle Şahsi Telefonlaşma Yasak" kuralı var. Ancak bir veli, çocuğunun gece geçirdiği nöbetin videosunu atmak için, panik halinde şahsi numaranızı istiyor. Tavrınız?',
    weightedOptions: [
      { label: 'Profesyonel Sınır ve Yönlendirme: Numaramı vermem. "Sizi çok iyi anlıyorum, lütfen videoyu Kurumsal WhatsApp hattına atın, ben şu an oradan takip ediyorum" diyerek hem erişilebilir olurum hem de sınırı korurum.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0, empathy: 0.3 }, analysisInsight: 'Profesyonel Sınır: Kriz anında bile kurumsal kanalı koruma ve veliyi regüle etme.' },
      { label: 'İnsani İhlal (Savior Complex): Veririm, sağlık söz konusu, o an kural düşünülmez. Vicdanım prosedürden önce gelir.', weights: { workEthics: -0.5, empathy: 0.8, institutionalLoyalty: -0.6 }, analysisInsight: 'Sınır İhlali (Boundary Violation): İyi niyetli ama yönetilemez bir iletişim kapısı açma ve kurumsal protokolü delme riski.' },
      { label: 'Gizli Anlaşma: Numaramı veririm ama "Sakın beni aramayın, sadece videoyu atın ve sonra silin, yönetim duymasın" derim.', weights: { workEthics: -0.3, sustainability: -0.5 }, analysisInsight: 'Naiflik ve Güvenilirlik Sorunu: Sınırın delineceğini öngörememe ve kurumdan gizli iş yapma.' }
    ]
  },
  {
    id: 'eth_new_add_1', category: 'workEthics', type: 'radio',
    text: 'Sosyal medyada (Instagram) bir veliniz size arkadaşlık isteği gönderdi. Kurumsal politikanız ne olmalıdır?',
    weightedOptions: [
      { label: 'Profesyonel Mesafe (Digital Boundaries): İsteği kabul etmem. Veli ile sosyal medya arkadaşlığı "Çoklu İlişki" (Dual Relationship) riskidir ve profesyonel otoriteyi zedeler. Kurumsal hesaplar üzerinden takipleşmeyi öneririm.', weights: { workEthics: 1.0, institutionalLoyalty: 0.8 }, analysisInsight: 'Etik Standart: Özel hayat ile iş hayatını ayırma.' },
      { label: 'Kabul ve Filtreleme: Kabul ederim, ne var ki bunda? Paylaşımlarımı görsün, samimiyet artar. Sadece hikayelerimi gizlerim.', weights: { workEthics: -0.5 }, analysisInsight: 'Risk: Özel hayatın ifşası ve profesyonel otorite kaybı.' },
      { label: 'Seçici Geçirgenlik: Sadece sevdiğim velileri kabul ederim, sorunlu olanları etmem.', weights: { workEthics: -0.8 }, analysisInsight: 'Ayrımcılık ve Tutarsızlık.' },
      { label: 'Görmezden Gelme: İsteği bekletirim, sora sora unutur.', weights: { workEthics: 0.0 }, analysisInsight: 'Pasif Tavır.' }
    ]
  }
];
