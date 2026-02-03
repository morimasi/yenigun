
import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  {
    id: 'eth_p1_1', category: 'workEthics', type: 'radio',
    text: 'Veli, seans çıkışında ağlayarak "Eşimle çok kötü kavga ettik, seansı erken bitirip dertleşebilir miyiz?" dediğinde kurumsal refleksiniz ne olur?',
    weightedOptions: [
      { label: 'Klinik Sınır: "Çocuğun gelişim hakkını bölemem, çıkışta rehberliğe yönlendireyim."', weights: { workEthics: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Çelik Sınırlar.' },
      { label: 'Sistemik Yaklaşım: "Ebeveyn regülasyonu çocuğu etkiler, kısa bir kriz müdahalesi yaparım."', weights: { workEthics: 0.7, empathy: 1.0 }, analysisInsight: 'Terapötik Esneklik.' },
      { label: 'Kurumsal Hiyerarşi: "Hemen koordinatöre yönlendiriyorum."', weights: { workEthics: 0.8, institutionalLoyalty: 1.0 }, analysisInsight: 'Sistem Uyumu.' },
      { label: 'Pragmatik: "Lütfen ofiste bekleyin, mülakat notlarımı paylaşacağım."', weights: { workEthics: 0.9, sustainability: 0.8 }, analysisInsight: 'Tarafsız Profesyonellik.' }
    ]
  },
  {
    id: 'eth_p2_1', category: 'workEthics', type: 'radio',
    text: 'Kurumun "Veli ile şahsi numara paylaşımı yasaktır" kuralına rağmen veli, çocuğun evdeki nöbet/kriz riski nedeniyle numaranızı ısrarla istiyor. Tavrınız?',
    weightedOptions: [
      { label: 'İlkesel Red: Kurumsal hattı verir, mesai dışı iletişimin klinik tarafsızlığı bozacağını açıklarım.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Sadakat ve Profesyonel Mesafe.' },
      { label: 'Risk Odaklı Taviz: Numarayı verir ama sadece acil tıbbi durumlar için kayıt düşerim.', weights: { workEthics: 0.4, empathy: 0.8 }, analysisInsight: 'Kural Esnetme Eğilimi.' }
    ]
  }
];
