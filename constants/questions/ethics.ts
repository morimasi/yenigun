
import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  {
    id: 'eth_adv_1', category: 'workEthics', type: 'radio',
    text: 'Veli, kurum müdüründen gizli olarak size "Siz çok özelsiniz, diğer hocalar anlamıyor. Lütfen bize haftada 2 akşam özel gelin, kimse duymasın" dedi. Tepkiniz?',
    weightedOptions: [
      { label: 'Etik Duvar: "Güveniniz için teşekkürler ancak mesleki etik ve kurumsal sadakat gereği kurum dışı hizmet vermem mümkün değil. Bu talebinizi yönetimle paylaşmalıyım" diyerek sınırı çizerim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Bütünlük: Manipülasyona karşı sarsılmaz duruş.' },
      { label: 'Esnek Red: "Şu an vaktim yok ama ileride bakarız" diyerek veliyi kırmadan reddederim.', weights: { workEthics: 0.4, empathy: 0.7 }, analysisInsight: 'Gri Alan: Kapıyı açık bırakma riski.' },
      { label: 'Gizli Kabul: Kurumun haberi olmayacaksa ve çocuk fayda görecekse kabul ederim.', weights: { workEthics: -2.0, institutionalLoyalty: -1.5 }, analysisInsight: 'Kritik İhlal: Kurumsal ihanet ve düşük etik.' },
      { label: 'Müdüre İspiyon: Hemen gidip müdüre veliyi kötülerim.', weights: { workEthics: 0.6, fit: -0.5 }, analysisInsight: 'Çatışmacı Sadakat.' }
    ]
  },
  {
    id: 'eth_adv_2', category: 'parentStudentRelations', type: 'radio',
    text: 'Veli seansın ortasında içeri girip çocuğuna sert bir tokat attı. O saniyedeki profesyonel aksiyonunuz?',
    weightedOptions: [
      { label: 'Kriz Müdahale ve Güvenlik: Çocuğu güvenli alana alır, veliyi dışarı davet eder ve durumu "İstismar ve İhmal" protokolü kapsamında derhal raporlarım.', weights: { workEthics: 1.0, clinical: 0.9 }, analysisInsight: 'Hukuki ve Etik Bilinç.' },
      { label: 'Eğitimsel Müdahale: Veliye sinir yönetimi konusunda o an nasihat veririm.', weights: { workEthics: 0.3, empathy: 0.5 }, analysisInsight: 'Yetki Aşımı ve Yetersiz Koruma.' },
      { label: 'Duygusal Tepki: Ben de veliye bağırırım.', weights: { workEthics: -0.5, personality: -1.0 }, analysisInsight: 'Profesyonellik Kaybı.' },
      { label: 'Görmezden Gelme: Ailenin kendi disiplin yöntemidir, karışmam seansa devam ederim.', weights: { workEthics: -1.0, empathy: -1.0 }, analysisInsight: 'İhmale Ortaklık.' }
    ]
  },
  {
    id: 'eth_adv_3', category: 'workEthics', type: 'radio',
    text: 'Kurumun sosyal medya hesabında sizin isminiz geçmeden sizin bir vakanız paylaşıldı. Ne hissedersiniz?',
    weightedOptions: [
      { label: 'Kurumsal Aidiyet: Önemli olan kurumun başarısı ve markanın güçlenmesidir, gurur duyarım.', weights: { institutionalLoyalty: 1.0, fit: 0.9 }, analysisInsight: 'Egosuz Profesyonellik.' },
      { label: 'Hak Arayışı: Emeğimin çalındığını düşünür, ismimin eklenmesi için talepte bulunurum.', weights: { institutionalLoyalty: 0.2, personality: 0.8 }, analysisInsight: 'Bireysel Odaklılık.' },
      { label: 'Pasif Agresif: Paylaşımı beğenmem ve işimi yavaşlatırım.', weights: { institutionalLoyalty: -0.8 }, analysisInsight: 'Düşük Sadakat.' },
      { label: 'Kayıtsızlık: Sosyal medya ile ilgilenmiyorum.', weights: { fit: 0.5 }, analysisInsight: 'Düşük Enerji.' }
    ]
  },
  {
    id: 'eth_adv_4', category: 'parentStudentRelations', type: 'radio',
    text: 'Veli, diğer bir öğretmeni size kötülüyor ve "O çok beceriksiz, keşke hepsi sizin gibi olsa" diyor. Yanıtınız?',
    weightedOptions: [
      { label: 'Meslektaş Savunması: "Her uzman farklı bir perspektif sunar ve biz bir ekibiz. Bu konudaki endişenizi koordinatörümüzle çözmenizi öneririm" diyerek konuyu kapatırım.', weights: { workEthics: 1.0, fit: 1.0 }, analysisInsight: 'Takım Oyuncusu: Dedikodu ve nifak bariyeri.' },
      { label: 'Narsistik Beslenme: "Teşekkürler, ben de elimden geleni yapıyorum" diyerek dolaylı yoldan onaylarım.', weights: { workEthics: -0.2, personality: 1.0 }, analysisInsight: 'Gizli Rekabet ve Ego.' },
      { label: 'Sessiz Onay: Sadece gülümserim.', weights: { workEthics: 0.0, fit: 0.0 }, analysisInsight: 'Pasif Onay.' },
      { label: 'Toksik Katılım: "Aslında haklısınız, o konuda ben de rahatsızım" derim.', weights: { workEthics: -1.0, institutionalLoyalty: -1.0 }, analysisInsight: 'Kurumsal Sabotaj.' }
    ]
  },
  {
    id: 'eth_adv_5', category: 'workEthics', type: 'radio',
    text: 'Bir vaka hakkında akademik bir makale yazmak istiyorsunuz. Verileri nasıl kullanırsınız?',
    weightedOptions: [
      { label: 'Resmi İzin ve De-identifikasyon: Kurumdan yazılı izin alır, veliden onam formu imzalatır ve tüm kişisel verileri anonimleştirerek akademik etik kurallara uyarım.', weights: { workEthics: 1.0, clinical: 0.8 }, analysisInsight: 'Akademik Dürüstlük.' },
      { label: 'Gizli Çalışma: Kimseye söylemeden verileri evde işlerim.', weights: { workEthics: -0.8, institutionalLoyalty: -0.5 }, analysisInsight: 'Veri Hırsızlığı Riski.' },
      { label: 'Sözlü İzin: Müdürle kahve içerken söylerim, "tamam" derse yazarım.', weights: { workEthics: 0.4 }, analysisInsight: 'Gayriresmi ve Riskli.' },
      { label: 'Veli Odaklılık: Sadece veliyle konuşurum, kurumun bilmesine gerek yok.', weights: { workEthics: -0.5, institutionalLoyalty: -1.0 }, analysisInsight: 'Hiyerarşi İhlali.' }
    ]
  },
  {
    id: 'eth_adv_6', category: 'parentStudentRelations', type: 'radio',
    text: 'Veli seans sonunda size "Hocam maaşınız yetiyor mu? Bizim bir şirketimiz var, size ek iş verelim" dedi.',
    weightedOptions: [
      { label: 'Net Sınır: "Nazik teklifiniz için teşekkürler ancak profesyonel odak noktam sadece öğrencinin gelişimidir. Kurumsal sınırlarım gereği bu tür bir ilişki kuramam."', weights: { workEthics: 1.0, personality: 0.9 }, analysisInsight: 'Profesyonel Mesafe Ustası.' },
      { label: 'Fırsatçılık: "Ne işi acaba? Bir konuşalım" derim.', weights: { workEthics: -1.5, institutionalLoyalty: -1.0 }, analysisInsight: 'Yüksek Churn Riski.' },
      { label: 'Utangaçlık: "Yok sağolun" deyip kaçarım.', weights: { personality: 0.3 }, analysisInsight: 'Düşük Özgüven.' },
      { label: 'Yönetime Sevk: "Bunu müdürümüzle konuşun, o onaylarsa olur" derim.', weights: { workEthics: 0.2, fit: 0.8 }, analysisInsight: 'Sorumluluk Transferi.' }
    ]
  },
  {
    id: 'eth_adv_7', category: 'workEthics', type: 'radio',
    text: 'Kurumun bir sırrını (Örn: Finansal zorluk veya yeni proje) dışarıdan biriyle paylaştığınızda kendinizi nasıl hissedersiniz?',
    weightedOptions: [
      { label: 'İhanet Hissi: Bu benim mesleki namusumdur, asla paylaşmam, paylaşanla da çalışmam.', weights: { institutionalLoyalty: 1.0, workEthics: 1.0 }, analysisInsight: 'Sarsılmaz Sadakat.' },
      { label: 'Normalleştirme: "Herkes konuşuyor zaten, bir şey olmaz" derim.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'Düşük Aidiyet.' },
      { label: 'Kaza: "Ağzımdan kaçtı" diyerek kendimi suçlarım.', weights: { fit: 0.2, personality: 0.4 }, analysisInsight: 'Düşük Kontrol.' },
      { label: 'Stratejik Sızıntı: Kurumu zora sokmak için bilerek yaparım.', weights: { institutionalLoyalty: -2.0 }, analysisInsight: 'Aktif Düşmanlık.' }
    ]
  },
  {
    id: 'eth_adv_8', category: 'parentStudentRelations', type: 'radio',
    text: 'Veli, çocuğuna sizin tarafınızdan "Tanı Konulmasını" istiyor (Örn: Hocam bu çocuk OSB mi?). Yetkiniz dışındaki bu talebe yanıtınız?',
    weightedOptions: [
      { label: 'Yetki Sınırı: "Tanı koyma yetkisi sadece tıp doktorlarına aittir. Ben size sadece mevcut performans verilerini ve gözlemlerimi sunabilir, sizi doğru hekime yönlendirebilirim."', weights: { workEthics: 1.0, clinical: 1.0 }, analysisInsight: 'Klinik Mütevazılık ve Doğruluk.' },
      { label: 'Tahmin: "Bence OSB ama siz yine de doktora gidin" derim.', weights: { workEthics: -0.5, clinical: 0.2 }, analysisInsight: 'Spekülatif Risk.' },
      { label: 'Onay: "Evet kesinlikle öyle, boşuna doktora para vermeyin" derim.', weights: { workEthics: -1.5, clinical: -1.0 }, analysisInsight: 'Ağır Teknik Hata.' },
      { label: 'Kaçış: "Ben anlamam o işlerden" derim.', weights: { clinical: -0.5 }, analysisInsight: 'Yetersizlik Maskeleme.' }
    ]
  },
  {
    id: 'eth_adv_9', category: 'workEthics', type: 'radio',
    text: 'Kurumda yapılan bir toplantıda etik dışı bir karar alındığını düşünüyorsunuz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Entelektüel Dürüstlük: Toplantıda söz alır, gerekçelerimi medenice açıklar ve şerh koyarım.', weights: { workEthics: 1.0, leadership: 0.9 }, analysisInsight: 'Dürüst Muhalif.' },
      { label: 'Sessiz Uyum: "Patronun bir bildiği vardır" deyip susarım.', weights: { fit: 0.7, institutionalLoyalty: 0.5 }, analysisInsight: 'Pasif Uyumcu.' },
      { label: 'Toplantı Sonrası Gıybet: Odadan çıkınca arkadaşlarımla kararı eleştiririm.', weights: { fit: -0.5, personality: -0.5 }, analysisInsight: 'Toksik Davranış.' },
      { label: 'İstifa: Hemen istifamı veririm.', weights: { sustainability: -0.8 }, analysisInsight: 'Düşük Çözüm Odaklılık.' }
    ]
  },
  {
    id: 'eth_adv_10', category: 'parentStudentRelations', type: 'radio',
    text: 'Veli size "X öğretmen çocuğu hırpalıyor" diye bir ihbarda bulundu. İlk adımınız?',
    weightedOptions: [
      { label: 'Prosedürel Raporlama: "Bunu duyduğuma üzüldüm, kurumsal politikamız gereği bu iddiayı hemen üst yönetime ve etik kurula bildirmem gerekiyor" diyerek süreci resmileştiririm.', weights: { workEthics: 1.0, institutionalLoyalty: 0.9 }, analysisInsight: 'Sistem Koruyucu.' },
      { label: 'Araştırmacı: "Gerçekten mi?" deyip gidip o öğretmeni gizlice izlerim.', weights: { fit: -0.4, leadership: 0.2 }, analysisInsight: 'Yetersiz Sınır Yönetimi.' },
      { label: 'Savunmacı: "O öyle biri değildir, yanlış görmüşsünüzdür" deyip arkadaşımı korurum.', weights: { workEthics: 0.2, fit: 0.8 }, analysisInsight: 'Kör Sadakat.' },
      { label: 'Kışkırtıcı: "Evet ben de görmüştüm zaten" deyip veliyi onaylarım.', weights: { institutionalLoyalty: -1.5, fit: -1.0 }, analysisInsight: 'Kurumsal İhanet.' }
    ]
  }
];
