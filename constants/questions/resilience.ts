
import { Question } from '../../types';

export const resilienceQuestions: Question[] = [
  {
    id: 'res_p1_1', category: 'sustainability', type: 'radio',
    text: '6 aydır üzerinde çalıştığınız vaka ilerlemiyor ve veli kurumun ortasında sizi yetersizlikle suçluyor. O anki içsel muhakemeniz ne olur?',
    weightedOptions: [
      { label: 'Teknik Özdüzenleme: "Nöral bir bariyer mi var? Verileri süpervizörle tekrar modellemeliyim."', weights: { sustainability: 1.0, clinical: 1.0 }, analysisInsight: 'Yüksek Resilians (Analitik).' },
      { label: 'Empatik Onarım: "Ailenin hayal kırıklığını anlıyorum, beklenti yönetimi toplantısı yapmalıyım."', weights: { sustainability: 0.8, empathy: 1.0 }, analysisInsight: 'Duygusal Zeka.' },
      { label: 'Mesleki Mesafe: "Veriler biyolojik sınırda, durumu resmi raporla yönetime devrederim."', weights: { sustainability: 0.9, institutionalLoyalty: 0.8 }, analysisInsight: 'Defansif Profesyonellik.' },
      { label: 'Pragmatik: "Vaka-uzman uyumsuzluğu olabilir, rotasyon talep ederim."', weights: { sustainability: 0.7, developmentOpenness: 0.6 }, analysisInsight: 'Rasyonel Vazgeçiş.' }
    ]
  },
  {
    id: 'res_p2_1', category: 'sustainability', type: 'radio',
    text: 'Yoğun bir günün sonunda, en ağır vakanızdan önce fiziksel olarak tükendiğinizi hissettiniz. O seansa giriş stratejiniz nedir?',
    weightedOptions: [
      { label: 'Grounding (Topraklama): 2 dakika nefes egzersizi yapıp profesyonel "Persona"mı giyerim, çocuk yorgunluğumu hak etmez.', weights: { sustainability: 1.0, workEthics: 1.0 }, analysisInsight: 'Üst Düzey Öz-Regülasyon.' },
      { label: 'Enerji Koruma: Seansı daha düşük tempoda, masa başı ve bilişsel yükü az materyallerle tamamlarım.', weights: { sustainability: 0.6, clinical: 0.5 }, analysisInsight: 'Pragmatik Enerji Yönetimi.' }
    ]
  }
];
