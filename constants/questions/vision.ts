import { Question } from '../../types';

export const visionQuestions: Question[] = [
  {
    id: 'vis_1', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumda 5 yıl sonra kendinizi nerede görüyorsunuz?',
    weightedOptions: [
      { label: 'Kurumun akademik standartlarını belirleyen bir "Klinik Süpervizör" veya "Metot Kurucu" olarak; bu markanın bir parçası kalmak isterim.', weights: { institutionalLoyalty: 1.0, leadership: 1.0 }, analysisInsight: 'Yüksek Aidiyet ve Liderlik Hedefi.' },
      { label: 'Kendi merkezimi açmış veya bağımsız bir danışman olarak; buradan aldığım tecrübeyi kendi markama taşımayı hedeflerim.', weights: { institutionalLoyalty: 0.2, developmentOpenness: 0.8 }, analysisInsight: 'Bireysel Kariyer / Geçici Personel Riski.' }
    ]
  },
  {
    id: 'vis_2', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumun marka itibarını zedeleyecek bir hata yapıldığını fark ettiniz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Durumu derhal iç kanallarda (yönetimde) çözer, dışarı sızmasını engellerim. "Kol kırılır yen içinde kalır" prensibiyle kurumu korurum.', weights: { institutionalLoyalty: 1.0, workEthics: 0.9 }, analysisInsight: 'Kurum Muhafızı.' },
      { label: 'Dürüstlük gereği bu hatayı sosyal medyada veya velilerle paylaşırım; gerçeğin kurumsal çıkarlardan üstün olduğuna inanırım.', weights: { institutionalLoyalty: -0.5, integrity: 1.0 }, analysisInsight: 'Yıkıcı Dürüstlük / Kurumsal Risk.' }
    ]
  },
  {
    id: 'vis_3', category: 'developmentOpenness', type: 'radio',
    text: 'Maaşınızın piyasa ortalamasında olduğu bir durumda, başka bir kurum %30 daha fazla teklif etti ama "akademik kalitesi düşük". Ne yaparsınız?',
    weightedOptions: [
      { label: 'Teklifi reddederim; düşük standartlı bir kurumda çalışmanın liyakatimi körelteceğini ve mesleki vizyonuma zarar vereceğini bilirim.', weights: { developmentOpenness: 1.0, integrity: 1.0 }, analysisInsight: 'İlkesel ve Akademik Odaklı.' },
      { label: 'Kabul ederim; profesyonel hayatın maddi bir karşılığı olmalıdır. Oraya gidip o kurumu da iyileştirebileceğimi düşünerek risk alırım.', weights: { institutionalLoyalty: 0.2, personality: 0.6 }, analysisInsight: 'Pragmatist / Mobil Profil.' }
    ]
  },
  {
    id: 'vis_4', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumun belirlediği "Kurumsal Dil" ve "Kıyafet Kodu" size ne hissettirir?',
    weightedOptions: [
      { label: 'Profesyonel bir disiplin; kurumsal bir kimliğin parçası olduğumu hissettirir ve bu düzene seve seve uyarım.', weights: { institutionalLoyalty: 1.0, sustainability: 0.8 }, analysisInsight: 'Disiplinli ve Uyumlu.' },
      { label: 'Kısıtlayıcı bir şekilcilik; benim performansımın dış görünüşümle değil klinik başarım ile ölçülmesi gerektiğini savunurum.', weights: { institutionalLoyalty: 0.3, personality: 0.9 }, analysisInsight: 'Bireyselci / Kurumsal Direnç.' }
    ]
  },
  {
    id: 'vis_5', category: 'developmentOpenness', type: 'radio',
    text: 'Bir uzman olarak dünyadaki en büyük hayaliniz nedir?',
    weightedOptions: [
      { label: 'Alanımda referans gösterilen bilimsel bir kitap yazmak veya bir metot geliştirmek.', weights: { developmentOpenness: 1.0, clinical: 1.0 }, analysisInsight: 'Akademik Yıldız Adayı.' },
      { label: 'En çok vaka alan ve en yüksek maddi kazancı elde eden "aranan uzman" olmak.', weights: { developmentOpenness: 0.5, technicalExpertise: 0.7 }, analysisInsight: 'Başarı ve Finans Odaklı.' }
    ]
  },
  {
    id: 'vis_6', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumun çok yoğun olduğu bir dönemde karşılıksız "ekstra mesai" talebine yanıtınız nedir?',
    weightedOptions: [
      { label: 'Kurumsal zorluk dönemlerinde gemiyi beraber yürütürüz; üzerime düşen desteği verir ve bunu sadakat borcum sayarım.', weights: { institutionalLoyalty: 1.0, team_player: 0.9 }, analysisInsight: 'Fedakar ve Aidiyeti Yüksek.' },
      { label: 'Sadece sözleşmemdeki saatlere uyarım; emeğimin karşılığı yoksa fazlasını yapmam, bunun sömürüye açık bir kapı olduğunu düşünürüm.', weights: { institutionalLoyalty: 0.2, sustainability: 0.8 }, analysisInsight: 'Keskin Sınırlı ve Hak Odaklı.' }
    ]
  },
  {
    id: 'vis_7', category: 'developmentOpenness', type: 'radio',
    text: 'Süpervizyon almayı (başkası tarafından denetlenmeyi) ne olarak görürsünüz?',
    weightedOptions: [
      { label: 'Güçlenme; dışarıdan bir gözün eksiklerimi bulup beni daha iyiye taşıyacağı için minnet duyarım.', weights: { developmentOpenness: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Öğrenmeye ve Denetime Açık.' },
      { label: 'Yetersizlik; bir uzman her vakanın çözümünü kendi içinde bulabilmelidir, denetlenmek özgüvenimi kırar.', weights: { developmentOpenness: 0.1, personality: 0.4 }, analysisInsight: 'Mesleki Narsisizm / Hata Gizleme Riski.' }
    ]
  },
  {
    id: 'vis_8', category: 'institutionalLoyalty', type: 'radio',
    text: 'Yeni Gün Akademi\'yi 3 kelimeyle tanımlasanız hangilerini seçerdiniz?',
    weightedOptions: [
      { label: 'Liyakat, Bilimsellik, Gelecek.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'Kurumsal Değerlerle Tam Uyum.' },
      { label: 'İş, Disiplin, Maaş.', weights: { institutionalLoyalty: 0.4, personality: 0.5 }, analysisInsight: 'Sığ ve Mekanik İlişki.' }
    ]
  },
  {
    id: 'vis_9', category: 'developmentOpenness', type: 'radio',
    text: 'Klinik bir tartışmada haksız olduğunuzu anladığınızda ne yaparsınız?',
    weightedOptions: [
      { label: 'Derhal hatamı kabul eder, doğru bilgiyi savunan kişiye teşekkür ederim; bilgi ego yapmaktan değerlidir.', weights: { developmentOpenness: 1.0, integrity: 1.0 }, analysisInsight: 'Yüksek Bilişsel Esneklik.' },
      { label: 'Kendi fikrimin bir kısmını hala savunur, konuyu "herkesin fikri kendine" diyerek kapatırım; otoritemin sarsılmasını istemem.', weights: { developmentOpenness: 0.2, personality: 0.7 }, analysisInsight: 'Düşük Esneklik / Otorite Odaklı.' }
    ]
  },
  {
    id: 'vis_10', category: 'institutionalLoyalty', type: 'radio',
    text: 'Sizin için "ideal kurum" hangisidir?',
    weightedOptions: [
      { label: 'Beni akademik olarak sürekli zorlayan, yeni eğitimler veren ve liyakatimi artıran kurum.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Akademik Motivasyonu Birincil.' },
      { label: 'Maddi şartları en iyi olan, rahat çalışma saatleri sunan ve huzurlu olan kurum.', weights: { institutionalLoyalty: 0.5, sustainability: 1.0 }, analysisInsight: 'Konfor ve Finans Motivasyonu Birincil.' }
    ]
  }
];