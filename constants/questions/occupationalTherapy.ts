
import { Question, Branch } from '../../types';

export const occupationalTherapyQuestions: Question[] = [
  {
    id: 'ot_sensory_1',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Vestibüler girdi sırasında öğrencide "Otonomik Reaksiyon" (solgunluk, terleme) başlarsa ne yaparsınız?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { 
        label: 'Derhal aktiviteyi keser, propriyoseptif derin bası (çömelme, itme) uygularım.', 
        weights: { clinical: 1.0, technicalExpertise: 1.0 },
        analysisInsight: 'Kritik klinik güvenlik bilinci yüksek.'
      },
      { 
        label: 'Girdinin şiddetini azaltır ama alışması için aktiviteyi tamamlamaya çalışırım.', 
        weights: { clinical: 0.2, ethics: 0.4 },
        analysisInsight: 'Fizyolojik riskleri göz ardı eden yaklaşım.'
      }
    ]
  },
  {
    id: 'ot_2',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Duyusal profili "Arayışçı" (Seeker) olan bir çocukta propriyoseptif girdi neden sakinleştiricidir?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Derin duyu girdisi merkezi sinir sistemini (modülasyon) regüle ederek vücut farkındalığını artırır.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Nöro-fizyolojik temelleri biliyor.' },
      { label: 'Çocuk çok hareketli olduğu için onu fiziksel olarak yormak sakinleşmesini sağlar.', weights: { clinical: 0.3, pedagogicalAnalysis: 0.4 }, analysisInsight: 'Sığ ve mekanik bakış açısı.' }
    ]
  },
  {
    id: 'ot_3',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'İnce motor becerilerde zorlanan (örn: kalem tutamayan) bir çocukta öncelikle hangi alan değerlendirilmelidir?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Proksimal stabilite (omuz ve gövde kontrolü); merkez sağlam değilse uçlar çalışamaz.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Gelişimsel hiyerarşiye hakim.' },
      { label: 'Parmak kaslarının gücü ve kavrama (grip) kuvveti.', weights: { clinical: 0.5, technicalExpertise: 0.6 }, analysisInsight: 'Lokal ve kısıtlı değerlendirme.' }
    ]
  },
  {
    id: 'ot_4',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Taktil (dokunsal) savunmacılığı olan bir çocukta "Wilbarger Fırçalama Protokolü" uygulanırken dikkat edilecek en kritik nokta nedir?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Fırçalama sonrası mutlaka eklemlere derin kompresyon (propriyosepsiyon) uygulanmalıdır.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Spesifik protokol disiplini yüksek.' },
      { label: 'Çocuğun fırçayı eline alıp kendisinin sürmesi beklenmelidir.', weights: { clinical: 0.4, empathy: 0.7 }, analysisInsight: 'Protokol hatası riski.' }
    ]
  },
  {
    id: 'ot_5',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Öğrenci günlük yaşam becerilerinde (örn: giyinme) "Motor Planlama" (Praksis) sorunu yaşıyorsa, müdahaleniz ne olur?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Görevi analiz ederek basamaklara ayırır (Task Analysis) ve görsel ipuçlarıyla desteklerim.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Yapılandırılmış ve işlevsel müdahale.' },
      { label: 'Çocuğun kaslarını güçlendiren genel egzersizler yaptırırım.', weights: { clinical: 0.3, technicalExpertise: 0.4 }, analysisInsight: 'Problemin kaynağını yanlış saptama.' }
    ]
  },
  {
    id: 'ot_6',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Hiperaktif bir vakanın seansında "Ağırlaştırılmış Yelek" kullanımı hangi mekanizmayla fayda sağlar?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Derin bası yoluyla parasempatik sistemi aktive ederek regülasyonu destekler.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Biyolojik mekanizma bilgisi yüksek.' },
      { label: 'Çocuğun ağırlığını artırarak onun daha az hareket etmesini zorunlu kılar.', weights: { clinical: 0.1, integrity: 0.2 }, analysisInsight: 'Etik olmayan ve yanlış yorumlama.' }
    ]
  },
  {
    id: 'ot_7',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Dispraksisi olan bir öğrencide okul başarısını artırmak için sınıfta yapılacak ilk adaptasyon nedir?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Oturma dengesini destekleyen ergonomik araçlar ve yazma yükünü azaltan teknolojik destekler.', weights: { clinical: 1.0, sustainability: 1.0 }, analysisInsight: 'Çevresel modifikasyon uzmanlığı.' },
      { label: 'Çocuğa daha çok yazı ödevi vererek pratik yapmasını sağlamak.', weights: { clinical: 0.2, empathy: 0.4 }, analysisInsight: 'Vaka tükenmişliğini tetikleyen yaklaşım.' }
    ]
  },
  {
    id: 'ot_8',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Okülomotor (göz hareketleri) kontrolü zayıf olan bir çocukta akademik derslerde ne gibi sorunlar beklenir?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Satır takibi yapamama, kelime atlama ve tahtadakini deftere geçirememe.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Akademik-klinik korelasyon bilgisi tam.' },
      { label: 'Sadece genel bir dikkat dağınıklığı ve hiperaktivite.', weights: { clinical: 0.4, pedagogicalAnalysis: 0.5 }, analysisInsight: 'Yüzeysel semptom analizi.' }
    ]
  },
  {
    id: 'ot_9',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Bir çocuğun "Vücut Farkındalığı" (Body Scheme) zayıfsa, sosyal hayatta ne gibi riskler oluşur?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Kişisel alan (personal space) sınırlarını koruyamama ve sakarlık nedeniyle dışlanma.', weights: { clinical: 1.0, empathy: 0.9 }, analysisInsight: 'Sosyal-duygusal ergoterapi vizyonu.' },
      { label: 'Sadece kıyafetlerini ters giyme ve düğmeleyememe gibi fiziksel sorunlar.', weights: { clinical: 0.5, technicalExpertise: 0.6 }, analysisInsight: 'Kısıtlı vaka projeksiyonu.' }
    ]
  },
  {
    id: 'ot_10',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Eğitimde "Çok Duyulu" (Multisensory) yaklaşım, duyusal işlemleme bozukluğu olan çocuklarda neden her zaman başarılı olmaz?',
    requiredBranch: [Branch.Ergoterapi],
    weightedOptions: [
      { label: 'Aynı anda gelen çok fazla girdi (overload), duyusal eşiği aşarak çocuğu "shutdown" moduna sokabilir.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'İleri düzey modülasyon bilgisi.' },
      { label: 'Çocuğun dikkati çok çabuk dağıldığı için materyalleri oyun zanneder.', weights: { clinical: 0.4, pedagogicalAnalysis: 0.5 }, analysisInsight: 'Pedagojik indirgemecilik.' }
    ]
  }
];
