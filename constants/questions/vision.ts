
import { Question } from '../../types';

export const visionQuestions: Question[] = [
  {
    id: 'vis_shadow_1', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurum size pahalı bir eğitim olan "X Yöntemi"ni finanse edecek ama karşılığında 2 yıl kurumdan ayrılmama taahhüdü (sözleşme) istiyor. İmzalar mısınız?',
    weightedOptions: [
      { label: 'Kariyer Ortaklığı: Memnuniyetle imzalarım. Kurumun bana yatırım yapması, bana değer verdiğini gösterir. 2 yıl zaten uzmanlaşmak için gereken süredir.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Kariyer Ortaklığı: Kurumla büyüme vizyonu ve karşılıklı güven.' },
      { label: 'Özgürlükçü Yaklaşım: Asla imzalamam, özgürlüğüm kısıtlanamaz. Geleceğin ne getireceği belli olmaz, ben eğitimi kendim alırım.', weights: { institutionalLoyalty: -0.6, developmentOpenness: 0.2 }, analysisInsight: 'Bağlılık Sorunu: Yatırıma ve uzun vadeli işbirliğine kapalı profil.' },
      { label: 'Stratejik/Fırsatçı Yaklaşım: İmzalarım ama daha iyi teklif gelirse tazminatı öder kaçarım. Önemli olan sertifikayı almaktır.', weights: { institutionalLoyalty: -0.8, workEthics: -0.6 }, analysisInsight: 'Etik Risk: Güvenilmez ve fırsatçı profil.' }
    ]
  },
  {
    id: 'vis_new_add_4', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumun geliştirdiği özgün bir eğitim materyalini (PDF, Kitapçık) ayrılırken yanınızda götürür müsünüz?',
    weightedOptions: [
      { label: 'Fikri Mülkiyet: Hayır, o materyaller kurumun malıdır ve telif hakkı kuruma aittir. İzinsiz kopyalamak hırsızlıktır.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'Yüksek Etik Standart.' },
      { label: 'Hak Görme: Götürürüm, sonuçta ben de kullandım, benim de hakkım.', weights: { integrity: -0.8 }, analysisInsight: 'Mülkiyet Bilinci Eksikliği.' },
      { label: 'Gizlilik: Kopyalarım ama kimseye söylemem.', weights: { integrity: -1.0 }, analysisInsight: 'Hırsızlık.' },
      { label: 'Takas: Başka arkadaşlarımla değiş tokuş yaparım.', weights: { integrity: -0.8 }, analysisInsight: 'Etik İhlal.' }
    ]
  }
];
