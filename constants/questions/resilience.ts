
import { Question } from '../../types';

export const resilienceQuestions: Question[] = [
  // --- RESİLİANS / DİRENÇ ---
  {
    id: 'res_new_1', category: 'sustainability', type: 'radio',
    text: '6 aydır üzerinde çalıştığınız vaka ilerlemiyor ve veli kurumun ortasında sizi yetersizlikle suçluyor. O anki içsel muhakemeniz ne olur?',
    weightedOptions: [
      { label: '"Nöral bir bariyer mi var? Verileri süpervizörle tekrar modellemeliyim."', weights: { sustainability: 1.0, clinical: 1.0 }, analysisInsight: 'Yüksek Resilians (Analitik).' },
      { label: '"Ailenin hayal kırıklığını anlıyorum, beklenti yönetimi toplantısı yapmalıyım."', weights: { sustainability: 0.8, empathy: 1.0 }, analysisInsight: 'Duygusal Zeka.' }
    ]
  },
  {
    id: 'res_new_2', category: 'sustainability', type: 'radio',
    text: 'Aynı gün içinde 3 farklı çocuk size fiziksel zarar verdi (Isırma/Vurma). Akşam işten çıkarken modunuz nedir?',
    weightedOptions: [
      { label: '"İşimin doğası bu, bu bir davranış verisidir" der, akşamımı etkiletmem.', weights: { sustainability: 1.0, personality: 0.9 }, analysisInsight: 'Çelik Sinirler.' },
      { label: '"Neyi yanlış yapıyorum? Çocuklar neden bu kadar agresifleşti?" diye sorgular, üzülürüm.', weights: { sustainability: 0.6, empathy: 0.9 }, analysisInsight: 'Kırılgan / Sorgulayıcı.' }
    ]
  },
  {
    id: 'res_new_3', category: 'sustainability', type: 'radio',
    text: 'Kurumda herkesin stresli olduğu bir "Kriz Dönemi"ndesiniz. Sizin ortamdaki rolünüz nedir?',
    weightedOptions: [
      { label: 'Sakın kalır, işime odaklanır ve panik yapmadan diğerlerini yatıştırırım.', weights: { sustainability: 1.0, leadership: 0.9 }, analysisInsight: 'Gizli Lider.' },
      { label: 'Kaygılarımı arkadaşlarla paylaşır, ortak dertleşme ile rahatlarım.', weights: { sustainability: 0.4, empathy: 0.8 }, analysisInsight: 'Kaygı Duyarlı.' }
    ]
  },
  {
    id: 'res_new_4', category: 'sustainability', type: 'radio',
    text: 'Çok güvendiğiniz bir metodun vaka üzerinde başarısız olması sizi nasıl etkiler?',
    weightedOptions: [
      { label: 'Metodu değil, vakayı daha derin inceleme isteği duyarım.', weights: { sustainability: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Klinik İştah.' },
      { label: 'Yetkinliğimi sorgular, başarısızlık hissine kapılırım.', weights: { sustainability: 0.3, personality: 0.4 }, analysisInsight: 'Düşük Dayanıklılık.' }
    ]
  },
  {
    id: 'res_new_5', category: 'sustainability', type: 'radio',
    text: 'Üst üste 5 seans boyunca "hiç ilerleme kaydedemediğiniz" bir günde performansınızı nasıl korursunuz?',
    weightedOptions: [
      { label: 'Duygularımı bir kenara bırakır, protokolü milimetrik uygulamaya devam ederim. Başarı disiplinin sonucudur.', weights: { sustainability: 1.0, workEthics: 0.9 }, analysisInsight: 'Disiplinli Savaşçı.' },
      { label: 'Seans akışını tamamen değiştirir, oyun ve eğlenceye dönerim; enerji tazelerim.', weights: { sustainability: 0.7, empathy: 1.0 }, analysisInsight: 'Sezgisel Regülatör.' }
    ]
  },
  {
    id: 'res_new_6', category: 'sustainability', type: 'radio',
    text: 'Kurum müdürü size haksız bir eleştiride bulundu. O anki reaksiyonunuz?',
    weightedOptions: [
      { label: 'Dinler, not alır ve 1 gün sonra verilerle savunma yaparım.', weights: { sustainability: 1.0, institutionalLoyalty: 0.9 }, analysisInsight: 'Üst Düzey Öz-Denetim.' },
      { label: '"Haksızsınız" diyerek o an itiraz eder, sınırlarımı korurum.', weights: { sustainability: 0.5, personality: 0.8 }, analysisInsight: 'Reaktif / Savunmacı.' }
    ]
  },
  {
    id: 'res_new_7', category: 'sustainability', type: 'radio',
    text: 'İş yerinde bir vaka için "Süpervizyon" talep etmeniz zayıflık mıdır?',
    weightedOptions: [
      { label: 'Hayır; yardım istemek klinik sorumluluktur ve profesyonel olgunluktur.', weights: { sustainability: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Bilge Klinisyen.' },
      { label: 'Kendi başıma çözemezsem yetersiz olduğumu düşünürüm.', weights: { sustainability: 0.2, personality: 0.3 }, analysisInsight: 'Yetersizlik Şeması.' }
    ]
  },
  {
    id: 'res_new_8', category: 'sustainability', type: 'radio',
    text: 'İş-Yaşam dengeniz bozulduğunda ilk neyi feda edersiniz?',
    weightedOptions: [
      { label: 'Eve iş götürmem, seans kalitemden az miktar feragat ederim ama tükenmem.', weights: { sustainability: 1.0, workEthics: 0.6 }, analysisInsight: 'Sürdürülebilir Profesyonel.' },
      { label: 'Ne gerekiyorsa yaparım, gece gündüz vaka çalışırım.', weights: { sustainability: 0.4, institutionalLoyalty: 1.0 }, analysisInsight: 'Burnout Adayı.' }
    ]
  },
  {
    id: 'res_new_9', category: 'sustainability', type: 'radio',
    text: 'Zor bir günün ardından eve gittiğinizde aklınız vakalarda kalıyor mu?',
    weightedOptions: [
      { label: 'Hayır; kapıdan çıkınca öğretmen kimliğimi asarım.', weights: { sustainability: 1.0, personality: 1.0 }, analysisInsight: 'Güçlü Ego Sınırları.' },
      { label: 'Evet; sürekli çözüm ararım, rüyalarıma girer.', weights: { sustainability: 0.6, technicalExpertise: 0.8 }, analysisInsight: 'Aşırı Özdeşim / Riskli.' }
    ]
  },
  {
    id: 'res_new_10', category: 'sustainability', type: 'radio',
    text: 'Kurumda fiziksel imkanların (klima bozuk vb.) kötüleşmesi sizi nasıl etkiler?',
    weightedOptions: [
      { label: 'Şartlar ne olursa olsun çocuğa odaklanırım; materyal kalptedir.', weights: { sustainability: 1.0, workEthics: 1.0 }, analysisInsight: 'Stoik / Dayanıklı.' },
      { label: 'Fiziksel konforum yoksa klinik kalitem %50 düşer.', weights: { sustainability: 0.2, personality: 0.5 }, analysisInsight: 'Düşük Stres Eşiği.' }
    ]
  },

  // --- GELİŞİME AÇIKLIK ---
  {
    id: 'dev_new_1', category: 'developmentOpenness', type: 'radio',
    text: 'Yıllardır uyguladığınız bir metodun "hatalı" olduğunu kanıtlayan yeni bir araştırma çıktı. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Eski yöntemi derhal terk eder, yeni protokol üzerine yoğun bir eğitime girerim.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Öğrenme Çevikliği.' },
      { label: 'Araştırmayı derinlemesine inceler, kendi başarılı sonuçlarımla karşılaştırıp kademeli geçiş yaparım.', weights: { developmentOpenness: 0.8, technicalExpertise: 0.9 }, analysisInsight: 'Eleştirel Düşünür.' }
    ]
  },
  {
    id: 'dev_new_2', category: 'developmentOpenness', type: 'radio',
    text: 'Sizin branşınız dışındaki bir eğitim (örn: yapay zeka, drama) kurumda zorunlu tutuldu. Tavrınız?',
    weightedOptions: [
      { label: 'Heyecanla katılırım; her farklı bilgi klinik bakış açımı zenginleştirir.', weights: { developmentOpenness: 1.0, personality: 1.0 }, analysisInsight: 'Meraklı Zihin.' },
      { label: 'Zaman kaybı olarak görürüm. Branşımda derinleşmek varken buna ayıracak vaktim yok.', weights: { developmentOpenness: 0.4, technicalExpertise: 0.8 }, analysisInsight: 'Tünel Vizyon.' }
    ]
  },
  {
    id: 'dev_new_3', category: 'developmentOpenness', type: 'radio',
    text: 'Kurum içi "Akademik Sunum" yapmanız istendi. Duygunuz?',
    weightedOptions: [
      { label: 'Bilgiyi paylaşmak öğretmektir. Büyük bir keyifle hazırlarım.', weights: { developmentOpenness: 1.0, leadership: 1.0 }, analysisInsight: 'Eğitici Lider.' },
      { label: 'Gerilirim. Ben sadece çocukla çalışmak istiyorum, sahne bana göre değil.', weights: { developmentOpenness: 0.6, personality: 0.5 }, analysisInsight: 'Uygulayıcı / Sosyal Kaygı.' }
    ]
  },
  {
    id: 'dev_new_4', category: 'developmentOpenness', type: 'radio',
    text: 'Klinik verilerinizi "Yapay Zeka" raporlamaya başlarsa ne düşünürsünüz?',
    weightedOptions: [
      { label: 'Harika! Angaryadan kurtulur, klinik analize daha çok vakit ayırırım.', weights: { developmentOpenness: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Dijital Yerli.' },
      { label: 'Yapay zeka benim kurduğum bağı anlayamaz; raporlarımı kendim yazmalıyım.', weights: { developmentOpenness: 0.5, clinical: 0.8 }, analysisInsight: 'Gelenekselci / Duygu Odaklı.' }
    ]
  },
  {
    id: 'dev_new_5', category: 'developmentOpenness', type: 'radio',
    text: 'Hangi sıklıkla yabancı literatür / güncel makale okuyorsunuz?',
    weightedOptions: [
      { label: 'Haftada az en 1 günümü akademik yeniliklere ayırırım.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Akademik Disiplin.' },
      { label: 'Sadece tıkandığım bir vaka olduğunda araştırma yaparım.', weights: { developmentOpenness: 0.6, technicalExpertise: 0.7 }, analysisInsight: 'Reaktif Öğrenen.' }
    ]
  },
  {
    id: 'dev_new_6', category: 'developmentOpenness', type: 'radio',
    text: 'Kendi cebinizden (kurum ödemeden) pahalı bir eğitime katılır mısınız?',
    weightedOptions: [
      { label: 'Evet; kendime yaptığım yatırım ömür boyu benimledir.', weights: { developmentOpenness: 1.0, personality: 1.0 }, analysisInsight: 'Öz-Yatırımcı.' },
      { label: 'Hayır; kurum beni geliştirmek istiyorsa maliyeti üstlenmeli.', weights: { developmentOpenness: 0.4, institutionalLoyalty: 0.6 }, analysisInsight: 'Dışsal Beklentili.' }
    ]
  },
  {
    id: 'dev_new_7', category: 'developmentOpenness', type: 'radio',
    text: 'Sizden yaşça küçük ve daha az deneyimli bir koordinatörden eğitim almak size ne hissettirir?',
    weightedOptions: [
      { label: 'Yaş ve kıdem değil, bilgi esastır. Ondan öğreneceğim çok şey vardır.', weights: { developmentOpenness: 1.0, leadership: 0.9 }, analysisInsight: 'Egosuz Öğrenen.' },
      { label: 'Tecrübesiz birinin bana akıl vermesi klinik motivasyonumu düşürür.', weights: { developmentOpenness: 0.2, personality: 0.4 }, analysisInsight: 'Kıdem Odaklı / Rijit.' }
    ]
  },
  {
    id: 'dev_new_8', category: 'developmentOpenness', type: 'radio',
    text: 'Klinik başarısızlığın ana sebebi nedir?',
    weightedOptions: [
      { label: 'Yanlış teşhis veya yetersiz teknik bilgi.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Analitik / Gelişime Açık.' },
      { label: 'Çocuğun biyolojik bariyeri veya velinin ilgisizliği.', weights: { developmentOpenness: 0.4, sustainability: 0.7 }, analysisInsight: 'Dışsallaştıran / Statükocu.' }
    ]
  },
  {
    id: 'dev_new_9', category: 'developmentOpenness', type: 'radio',
    text: 'Yeni bir fikir sundunuz ve yönetim "şimdi sırası değil" dedi. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Fikrimi küçük bir vakada kanıtlar, sonuçlarla tekrar giderim.', weights: { developmentOpenness: 1.0, leadership: 1.0 }, analysisInsight: 'Değişim Öncüsü.' },
      { label: '"Peki" der, standart işime devam ederim. Fikir üretmeyi bırakırım.', weights: { developmentOpenness: 0.4, institutionalLoyalty: 0.8 }, analysisInsight: 'Yaratıcılığı Körelen.' }
    ]
  },
  {
    id: 'dev_new_10', category: 'developmentOpenness', type: 'radio',
    text: 'Sizin için "Usta" olmak ne demektir?',
    weightedOptions: [
      { label: 'Her çocuktan yeni bir şey öğrendiğim bitmeyen bir yolculuk.', weights: { developmentOpenness: 1.0, personality: 1.0 }, analysisInsight: 'Sonsuz Gelişim.' },
      { label: 'Mevcut tüm literatürü hatasız uygulayabilme yetkinliği.', weights: { developmentOpenness: 0.7, technicalExpertise: 1.0 }, analysisInsight: 'Kusursuz Teknisyen.' }
    ]
  }
];
