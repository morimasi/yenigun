
import { Question } from '../../types';

export const visionQuestions: Question[] = [
  {
    id: 'vis_p1_5', category: 'institutionalLoyalty', type: 'radio',
    text: 'Bir başka kurumdan %30 daha yüksek maaş teklifi aldınız ancak oradaki klinik kalite standartlarının düşük olduğunu biliyorsunuz. Karar sürecinizi ne yönetir?',
    weightedOptions: [
      { label: 'Akademik İtibar ve Uzmanlık Gelişimi: Teklifi reddederim. Standart altı bir kurumda çalışmak klinik kaslarımı köreltir ve özgeçmişimdeki akademik imajımı zedeler. Uzun vadeli uzmanlık, kısa vadeli kazançtan değerlidir.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 0.8 }, analysisInsight: 'Vizyoner İdealist: Kariyerini "para" değil "kalite" üzerine inşa etme stratejisi.' },
      { label: 'Sistemik Dönüşüm ve Liderlik Fırsatı: Eğer o kurumda "Klinik Direktör" veya "Sistem Kurucu" olarak gideceksem ve kaliteyi yükseltme yetkisi bana verilecekse değerlendiririm. Bu benim için bir meydan okumadır.', weights: { institutionalLoyalty: 0.5, leadershipPotential: 1.0 }, analysisInsight: 'Liderlik Odaklı: Maaşı değil, "etki gücünü" ve statüyü rasyonalize eden profil.' },
      { label: 'Şeffaf Müzakere ve Mevcut Aidiyet: Mevcut kurumumun bana sağladığı huzurun farkındayım. Bu teklifi yönetime dürüstçe açar, "Ekonomik şartlarımın iyileştirilmesi durumunda burada kalıp büyümek istiyorum" diyerek bir orta yol ararım.', weights: { institutionalLoyalty: 0.8, fitScore: 0.9 }, analysisInsight: 'Şeffaf Sadakat: Bağlılığını kurumsal gelişim ve dürüstlükle dengeleyen pragmatist.' },
      { label: 'Sürdürülebilirlik ve Finansal Gerçekçilik: Teklifi değerlendiririm. Profesyonel hayat bir emek-sermaye dengesidir; yaşam kalitemin artması, iş yerindeki klinik motivasyonumu da dolaylı olarak pozitif etkileyecektir.', weights: { institutionalLoyalty: -0.5, resilience: 0.8 }, analysisInsight: 'Rasyonel Realist: İşi duygusal bir aidiyetten ziyade profesyonel bir kontrat olarak gören mobil aday.' }
    ]
  }
];
