
import { Question } from '../../types';

export const resilienceQuestions: Question[] = [
  // --- RESİLİANS / DİRENÇ ---
  {
    id: 'res_new_1', category: 'sustainability', type: 'radio',
    text: '6 aydır üzerinde çalıştığınız vaka ilerlemiyor ve veli kurumun ortasında sizi yetersizlikle suçluyor. O anki içsel muhakemeniz ne olur?',
    weightedOptions: [
      { label: 'Veli suçlamalarına değil, verilere odaklanırım; "Vakanın nöral profilinde tespit edemediğim bir bariyer mi var? Klinik verileri süpervizörle tekrar modellemeli miyim?" diyerek rasyonel bir özeleştiri sürecine girerim.', weights: { sustainability: 1.0, clinical: 1.0 }, analysisInsight: 'Yüksek Analitik Direnç.' },
      { label: 'Ailenin yaşadığı büyük hayal kırıklığını ve tükenmişliği derinlemesine anlarım; onlarla derhal bir "beklenti yönetimi" toplantısı yaparak duygusal bir onarım süreci başlatır ve terapötik bağı güçlendirmeye öncelik veririm.', weights: { sustainability: 0.8, empathy: 1.0 }, analysisInsight: 'Yüksek Duygusal Zeka.' }
    ]
  },
  {
    id: 'res_new_2', category: 'sustainability', type: 'radio',
    text: 'Aynı gün içinde 3 farklı çocuk size fiziksel zarar verdi (Isırma/Vurma). Akşam işten çıkarken modunuz nedir?',
    weightedOptions: [
      { label: 'İşimin doğasının bu olduğunu kabul ederek durumu normalleştiririm; "Bu sadece bir davranış verisidir, çocuk beni değil öğretmenlik rolümü hedef aldı" diyerek mesleki mesafemi korur ve akşamımı bu durumdan etkiletmem.', weights: { sustainability: 1.0, personality: 0.9 }, analysisInsight: 'Güçlü Ego Sınırı.' },
      { label: 'Kendi yetkinliğimi ve uygulama tekniğimi sertçe sorgularım; "Çocuklar neden bu kadar reaktifleşti? Neyi yanlış yönettim?" diyerek olayı kişiselleştiririm ve yaşadığım duygusal yorgunluğun mesai dışına taşmasına engel olamam.', weights: { sustainability: 0.6, empathy: 0.9 }, analysisInsight: 'Düşük Duygusal Regülasyon.' }
    ]
  },
  {
    id: 'res_new_3', category: 'sustainability', type: 'radio',
    text: 'Kurumda herkesin stresli olduğu bir "Kriz Dönemi"ndesiniz. Sizin ortamdaki rolünüz nedir?',
    weightedOptions: [
      { label: 'Ortamda bir "stabilizör" görevi görürüm; kendi işlerime sükunetle odaklanarak paniği yaymam ve diğer çalışma arkadaşlarımın da sakin kalması için sessiz bir profesyonellik sergilerim; kriz anında mantığı önceliklendiririm.', weights: { sustainability: 1.0, leadership: 0.9 }, analysisInsight: 'Stabil Liderlik Potansiyeli.' },
      { label: 'Yaşadığım kaygıları ve belirsizlikleri arkadaşlarımla samimiyetle paylaşırım; "Birlikte dertleşmek ve duyguları açığa vurmak bizi rahatlatır" diyerek emosyonel bir paylaşım grubu oluşturur ve stresin topluca deşarj edilmesini sağlarım.', weights: { sustainability: 0.4, empathy: 0.8 }, analysisInsight: 'Kaygıya Duyarlı Profil.' }
    ]
  },

  // --- GELİŞİME AÇIKLIK ---
  {
    id: 'dev_new_1', category: 'developmentOpenness', type: 'radio',
    text: 'Yıllardır uyguladığınız bir metodun "hatalı" olduğunu kanıtlayan yeni bir araştırma çıktı. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Kendi geçmiş başarılarıma saplanıp kalmadan, bilimsel verilere tam güven gösteririm; eski yöntemimi derhal terk ederek yeni protokol üzerine yoğun bir eğitime girer ve uygulamalarımı güncel literatüre göre hızla revize ederim.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Yüksek Öğrenme Çevikliği.' },
      { label: 'Araştırmayı çok detaylı ve eleştirel bir süzgeçten geçiririm; kendi saha sonuçlarımla bu araştırmanın sonuçlarını karşılaştırırım ve ancak ikna olduktan sonra yöntemimi kademeli bir geçişle yenilemeyi tercih ederim.', weights: { developmentOpenness: 0.8, technicalExpertise: 0.9 }, analysisInsight: 'Eleştirel ve Analitik Tutuculuk.' }
    ]
  },
  {
    id: 'dev_new_4', category: 'developmentOpenness', type: 'radio',
    text: 'Klinik verilerinizi "Yapay Zeka" raporlamaya başlarsa ne düşünürsünüz?',
    weightedOptions: [
      { label: 'Bu teknolojik sıçramayı büyük bir heyecanla karşılarım; angarya olarak gördüğüm raporlama yükünden kurtularak, kalan vaktimin tamamını daha derin klinik analizlere ve çocuklarla olan doğrudan etkileşime ayırmayı hedeflerim.', weights: { developmentOpenness: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Dijital Yerli ve İnovasyon Dostu.' },
      { label: 'Yapay zekanın benim öğrenciyle kurduğum o derin ve insani bağı asla tam olarak raporlayamayacağını düşünürüm; klinik sezgilerimin makineler tarafından standartlaştırılmasına karşı çıkar ve kendi raporlarımı yazmaya devam etmek isterim.', weights: { developmentOpenness: 0.5, clinical: 0.8 }, analysisInsight: 'Gelenekselci ve Sezgisel Profil.' }
    ]
  }
];
