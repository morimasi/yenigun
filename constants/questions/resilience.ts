
import { Question } from '../../types';

export const resilienceQuestions: Question[] = [
  {
    id: 'res_p1_1', category: 'sustainability', type: 'radio',
    text: '6 aydır üzerinde çalıştığınız vaka ilerlemiyor ve veli kurumun ortasında sizi "boşa zaman harcamakla" suçluyor. O anki içsel tepkiniz ne olur?',
    weightedOptions: [
      { label: 'Klinik Metodolojik Sorgulama: "Nöral bir bariyerle mi karşı karşıyayız? Hemen programı dondurup dış süpervizyon desteğiyle verileri tekrar modellemeliyim; velinin öfkesi teknik bir aksaklığın sinyali olabilir."', weights: { sustainability: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Yüksek Resilians: Eleştiriyi duygusal değil, teknik bir veri (feedback) olarak işleme becerisi.' },
      { label: 'Empatik Regülasyon: "Ailenin yaşadığı hayal kırıklığını anlıyorum ve bu baskı altında hissettiklerim insani. Onlarla birlikte bir "Beklenti Yönetimi" toplantısı yaparak hedefleri mikro adımlara bölmeliyim."', weights: { sustainability: 0.8, empathy: 1.0 }, analysisInsight: 'Duygusal Zeka: Çatışmayı ilişkiyi onarmak ve süreci şeffaflaştırmak için bir fırsat olarak kullanma.' },
      { label: 'Mesleki Mesafe ve Sınır Koruması: "Veriler ilerlemenin biyolojik sınırlarda olduğunu gösteriyor. Velinin kişisel saldırısını profesyonel kimliğimden ayrıştırır, durumu kurumsal raporlarla yönetime devrederim."', weights: { sustainability: 0.9, workEthics: 0.8 }, analysisInsight: 'Duygusal Dayanıklılık: Kendini koruma mekanizması gelişmiş, iş-özel hayat sınırı net profil.' },
      { label: 'İstatistiksel Kabulleniş: "Her vaka her zaman ilerlemez. Kendi yetkinliğimden eminim; bu durumu vaka-uzman uyumsuzluğu olarak değerlendirip rotasyon talep etmek hem çocuk hem benim için en sağlıklısıdır."', weights: { sustainability: 0.6, personality: 0.5 }, analysisInsight: 'Pragmatik Kaçınma: Kaynaklarını verimli kullanmak adına zorlu vakayı devretme eğilimi.' }
    ]
  }
];
