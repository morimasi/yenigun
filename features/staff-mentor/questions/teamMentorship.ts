import { AssessmentQuestion } from '../../../types';

export const teamMentorshipQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_tm_v2_1',
    text: 'Başka bir branş uzmanının (örn: Ergoterapist) sizin hedeflerinizle çelişen bir müdahale yaptığını gördünüz. Yol haritanız?',
    options: [
      { label: 'Bunu bir çatışma değil "Vaka Konseyi" fırsatı olarak görürüm. Ortak bir hibrit protokol oluşturmak için liderlik üstlenirim.', clinicalValue: 100, aiTag: 'multidisciplinary_leader' },
      { label: 'Branş sınırlarını hatılatırım; her uzmanın kendi teknik sahasında tam yetkiye sahip olması gerektiğini net bir dille belirtirim.', clinicalValue: 90, aiTag: 'expertise_border_patrol' }
    ]
  },
  {
    id: 'stf_tm_v2_2',
    text: 'Sizin geliştirdiğiniz çok etkili bir vaka takip formunu tüm ekiple paylaşmanız istendi. Hisleriniz?',
    options: [
      { label: 'Kolektif zekaya inanırım. Kurum içi standardizasyonun vaka başarısını çarpan etkisiyle artıracağını bilerek eğitimini veririm.', clinicalValue: 100, aiTag: 'knowledge_sharer' },
      { label: 'Bu formun benim kişisel liyakatimin bir simgesi olduğunu düşünürüm. Sadece çok güvendiğim kısıtlı bir çevreyle paylaşırım.', clinicalValue: 85, aiTag: 'competitive_expert' }
    ]
  }
];
