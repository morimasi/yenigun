
import { Question } from '../../types';

export const resilienceQuestions: Question[] = [
  {
    id: 'res_shadow_1', category: 'sustainability', type: 'radio',
    text: 'Partner öğretmeniniz (eküri) derse sürekli geç geliyor ve bu yüzden sizin seanslarınız sarkıyor. Yönetim bunu fark etmiyor. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Olgun İletişim (Assertiveness): Onu kenara çeker, "Geç kalman benim planımı bozuyor ve beni zor durumda bırakıyor, buna bir çözüm bulalım" diyerek "Ben Dili" ile konuşurum. Düzelmezse o zaman yönetime giderim.', weights: { sustainability: 1.0, fit: 1.0, personality: 0.9 }, analysisInsight: 'Olgun İletişim: Sorunu kaynağında, çatışma yaratmadan çözme girişimi.' },
      { label: 'Hiyerarşik Çözüm (İspiyon): Onu hemen müdüre şikayet ederim. Herkes işini düzgün yapsın, ben mağdur olamam.', weights: { sustainability: 0.3, fit: -0.6 }, analysisInsight: 'İspiyonculuk/Çatışma: Takım içi güveni zedeleme ve sorunu birebir çözme yetisinden yoksunluk.' },
      { label: 'Pasif Agresyon: Küserek konuşmam, ben de onun işlerini aksatırım, belki anlar.', weights: { sustainability: -0.6, personality: -0.7 }, analysisInsight: 'Pasif Agresyon: Profesyonellik dışı çocuksu tepki.' }
    ]
  },
  {
    id: 'res_new_add_1', category: 'sustainability', type: 'radio',
    text: 'Yöneticinizden herkesin içinde haksız olduğunu düşündüğünüz sert bir eleştiri aldınız. Tepkiniz ne olur?',
    weightedOptions: [
      { label: 'Profesyonel Bekleme ve Yüzleşme: O an saygımı bozmadan dinlerim (Poker Face). Sakinleşince odasına gidip "Eleştirinizi duydum ancak kendimi ifade etmek istiyorum" diyerek verilerle durumu açıklarım.', weights: { sustainability: 1.0, institutionalLoyalty: 0.8 }, analysisInsight: 'Kriz İletişimi: Dürtü kontrolü ve profesyonel yüzleşme.' },
      { label: 'Anlık Savunma (Reaktif): "Hayır öyle değil!" diye herkesin içinde tartışmaya girerim.', weights: { sustainability: -0.5 }, analysisInsight: 'Dürtüsellik: Otoriteyle çatışma.' },
      { label: 'Küsme (Pasif): İşleri yavaşlatırım, motivasyonumu düşürürüm.', weights: { sustainability: -0.6 }, analysisInsight: 'Pasif Agresif Direnç.' },
      { label: 'Dedikodu: Arkadaşlarıma yöneticinin ne kadar kötü olduğunu anlatırım.', weights: { sustainability: -0.8 }, analysisInsight: 'Toksik Kültür Yayma.' }
    ]
  }
];
