import { Question, Branch } from '../../types';

export const occupationalTherapyQuestions: Question[] = [
  {
    id: 'ot_1', category: 'technicalExpertise', type: 'radio',
    text: 'Duyusal profili "aşırı duyarlı" olan bir çocukta duyu bütünleme seansına nereden başlarsınız?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Çocuğun en güvende hissettiği propriyoseptif (derin bası) aktivitelerle başlar, sinir sistemini regüle ettikten sonra yeni duyusal uyaranları çok yavaş enjekte ederim.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Güvenli ve Hiyerarşik Müdahale.' },
      { label: 'Çocuğun liderliğini takip ederim. Terapi odasındaki materyallere kendi hızıyla yaklaşmasına izin verir, keşifsel bir oyun içinde toleransını artırmaya odaklanırım.', weights: { clinical: 0.8, empathy: 1.0 }, analysisInsight: 'İlişkisel ve Keşif Odaklı.' }
    ]
  },
  {
    id: 'ot_2', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'İnce motor becerilerde zorlanan bir çocukta önceliğiniz nedir?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Proksimal stabiliteye (gövde ve omuz kontrolü) bakarım. Merkez sağlam değilse parmakların düzgün çalışamayacağını bildiğim için kaba motordan inceye giden bir yol izlerimin.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Gelişimsel Hiyerarşi Bilinci.' },
      { label: 'Günlük yaşam aktivitelerine (yemek yeme, düğmeleme) doğrudan odaklanırım. Çocuğun başarma hissini tatması için aparatlar ve adaptif araçlarla işlevselliği hemen artırırım.', weights: { clinical: 0.7, pedagogicalAnalysis: 0.9 }, analysisInsight: 'İşlevsel ve Adaptif Çözüm Odaklı.' }
    ]
  },
  {
    id: 'ot_3', category: 'technicalExpertise', type: 'radio',
    text: 'Vaka seans sırasında "vestibüler girdi" (sallanma vb.) sırasında aniden solgunlaşıyor. Reaksiyonunuz?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Hemen aktiviteyi keser ve çocuğu yere alırım. Otonomik bir yanıt olduğunu fark eder, sistemi sakinleştirmek için derhal propriyoseptif girdi uygularım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Yüksek Klinik Güvenlik Bilinci.' },
      { label: 'Girdinin şiddetini azaltır ama çocuğu durdurmam. Sistemin bu uyaranla başa çıkmayı öğrenmesi için düşük tempoda süreci izlemeye devam ederim.', weights: { clinical: 0.3, sustainability: 0.5 }, analysisInsight: 'Risk Toleransı Yüksek / Deneysel.' }
    ]
  },
  {
    id: 'ot_4', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Öğrenci günlük hayatta "praksis" (motor planlama) sorunu yaşıyorsa, müdahaleniz hangisine yakındır?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Karmaşık hareketleri görsel ipuçları ve küçük basamaklarla dökümante ederim. Çocuğun zihninde bir "hareket haritası" oluşturması için bilişsel stratejiler sunarım.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Bilişsel-Motor Strateji Uzmanı.' },
      { label: 'Daha çok serbest parkur ve engelli oyunları kurgularım. Çocuğun bedensel farkındalığını doğal hareket döngüleri içinde, deneyimleyerek artırmasını sağlarım.', weights: { clinical: 0.8, developmentOpenness: 0.9 }, analysisInsight: 'Deneyimsel ve Doğal Öğrenme Dostu.' }
    ]
  },
  {
    id: 'ot_5', category: 'technicalExpertise', type: 'radio',
    text: 'Kurumda ergoterapi ünitesine yeni ve çok modern bir cihaz alındı ama siz eski yöntemlerinize daha çok güveniyorsunuz. Ne yaparsınız?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Yeni teknolojinin literatürünü hemen araştırırım. Mevcut vaka portföyümde hangi çocuklarda "fark yaratabileceğini" analiz eder ve denemelere başlarım.', weights: { clinical: 0.9, developmentOpenness: 1.0 }, analysisInsight: 'İnovatif ve Araştırmacı.' },
      { label: 'Eski yöntemlerimle aldığım sonuçlara güvenirim. Yeni cihazı ancak kurum zorunlu tutarsa veya klasik yöntemler tıkandığında bir alternatif olarak değerlendiririm.', weights: { clinical: 0.6, sustainability: 0.8 }, analysisInsight: 'Tutucu ve Tecrübe Odaklı.' }
    ]
  }
];