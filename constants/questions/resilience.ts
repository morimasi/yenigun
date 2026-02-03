
import { Question } from '../../types';

export const resilienceQuestions: Question[] = [
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
      { label: 'İşimin doğasının bu olduğunu kabul ederek durumu normalleştiririm; "Bu sadece bir davranış verisidir, child beni değil öğretmenlik rolümü hedef aldı" diyerek mesleki mesafemi korur ve akşamımı bu durumdan etkiletmem.', weights: { sustainability: 1.0, personality: 0.9 }, analysisInsight: 'Güçlü Ego Sınırı.' },
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
  },
  {
    id: 'res_6',
    category: 'sustainability',
    type: 'radio',
    text: 'Ciddi bir Burnout (tükenmişlik) hissettiğinizde ilk hamleniz ne olur?',
    weightedOptions: [
      { label: 'Kurum yönetimiyle şeffafça konuşur, vaka yükümü geçici olarak optimize eder ve profesyonel destek alırım.', weights: { sustainability: 1.0, integrity: 1.0 }, analysisInsight: 'Kendi sınırlarını koruyan, sürdürülebilir profil.' },
      { label: 'Hissedilen yorgunluğu gizler, seanslarda daha az efor sarf ederek dinlenmeye çalışırım.', weights: { sustainability: 0.2, clinical: 0.3 }, analysisInsight: 'Gizli klinik risk faktörü.' }
    ]
  },
  {
    id: 'res_7',
    category: 'sustainability',
    type: 'radio',
    text: 'Yeni bir vakanın agresyonu size eski bir travmanızı hatırlattı. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Durumu etik bir dille koordinatöre bildirir, tarafsızlığıma zarar gelmemesi için vakanın devrini veya süpervizyon desteği isterim.', weights: { sustainability: 1.0, ethics: 1.0 }, analysisInsight: 'Duygusal farkındalık ve profesyonel sınır bilinci tam.' },
      { label: 'Güçlü görünmeye çalışır ve travmamı işe yansıtmamaya zorlarım.', weights: { sustainability: 0.4, clinical: 0.6 }, analysisInsight: 'Duygusal patlama riski taşıyan profil.' }
    ]
  },
  {
    id: 'res_8',
    category: 'developmentOpenness',
    type: 'radio',
    text: 'Maaşınızın artmadığı bir dönemde kurum size ücretsiz ama çok prestijli bir eğitim teklif etti. Tavrınız?',
    weightedOptions: [
      { label: 'Eğitimi büyük bir şans olarak görürüm; liyakatimin artmasının uzun vadede her türlü maddi kazançtan daha değerli olduğunu bilirim.', weights: { developmentOpenness: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Vizyoner ve kariyere odaklı.' },
      { label: 'Maddi karşılığı olmayan bir eğitime vakit ayırmayı reddederim.', weights: { developmentOpenness: 0.1, institutionalLoyalty: 0.2 }, analysisInsight: 'Kısa vadeli ve pragmatik odaklı.' }
    ]
  },
  {
    id: 'res_9',
    category: 'sustainability',
    type: 'radio',
    text: 'Bir meslektaşınız sizin hakkınızda asılsız bir dedikodu çıkardı. Tepkiniz?',
    weightedOptions: [
      { label: 'Kişiyle profesyonel bir zeminde yüzleşir, sonuç alamazsam kurumsal disiplin kanallarını işletir ve işime odaklanmaya devam ederim.', weights: { sustainability: 1.0, leadership: 0.9 }, analysisInsight: 'Duygusal dayanıklılığı ve profesyonel olgunluğu yüksek.' },
      { label: 'Ben de onun hakkında konuşarak karşılık veririm veya kuruma küserim.', weights: { sustainability: 0.2, personality: 0.3 }, analysisInsight: 'Kurumsal barışı bozma potansiyeli.' }
    ]
  },
  {
    id: 'res_10',
    category: 'developmentOpenness',
    type: 'radio',
    text: 'Aynı vaka üzerinde 3 yıl çalışmak mı, her yıl farklı vakalarla karşılaşmak mı sizi daha çok geliştirir?',
    weightedOptions: [
      { label: 'Farklı vakalar; konfor alanımdan çıkmak ve yeni klinik bariyerleri aşmak benim için asıl gelişim motorudur.', weights: { developmentOpenness: 1.0, sustainability: 0.9 }, analysisInsight: 'Yüksek adaptasyon ve gelişim açlığı.' },
      { label: 'Aynı vaka; vakanın her evresine hakim olmak bana huzur ve güven verir.', weights: { developmentOpenness: 0.4, sustainability: 0.7 }, analysisInsight: 'Statükocu ve stabilite odaklı.' }
    ]
  }
];
