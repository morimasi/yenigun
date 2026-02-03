
import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  // --- MEVCUT SORULAR (1-15) ---
  {
    id: 'eth_new_1', category: 'workEthics', type: 'radio',
    text: 'Veli, size kurum müdürü hakkında gizli bir şikayette bulunuyor ve "aramızda kalsın" diyor. Tavrınız?',
    weightedOptions: [
      { label: 'Veliyle aramdaki güven bağını korumak için onu aktif bir şekilde dinlerim ve "anlıyorum" diyerek konuyu geçiştiririm; velinin duygusal boşalımına izin vererek ilişkinin kopmaması için bu konuşmayı yönetime yansıtmam.', weights: { workEthics: 0.4, institutionalLoyalty: 0.3 }, analysisInsight: 'Sınır İhlali Riski.' },
      { label: 'Veliye, kurumumuzda şeffaflığın esas olduğunu hatırlatırım ve "Bunu duyduğuma üzüldüm ancak bu konuyu müdürümüzle doğrudan görüşmeniz sorunların çözümü için tek yoldur" diyerek hem profesyonel hem de kurumsal bir sınır çizerim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Kurumsal Bütünlük.' }
    ]
  },
  {
    id: 'eth_new_2', category: 'workEthics', type: 'radio',
    text: 'Bir vakanızın raporunda, kurumun vergi muafiyeti için "olmadığı kadar ağır" bir engel oranı yazılmasını talep ediyorlar. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Bu talebi meslek onuruma bir saldırı olarak görür ve kesinlikle reddederim; yanlış beyanın sadece bir suç değil, aynı zamanda çocuğun klinik geleceğini ve haklarını tamamen bozacak bir etik yıkım olduğunu açıkça ifade ederim.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Kaya Gibi Etik Duruş.' },
      { label: 'Kurumun ekonomik bekasını ve vakanın devamlılığını sağlamak için yönetimin çizdiği çerçeveye uyarım; teknik raporun bir araç olduğunu, asıl önemli olanın verdiğimiz seans kalitesi olduğunu düşünerek risk almadan onay veririm.', weights: { workEthics: 0.2, institutionalLoyalty: 0.5 }, analysisInsight: 'Düşük Etik Direnç.' }
    ]
  },
  {
    id: 'eth_new_3', category: 'workEthics', type: 'radio',
    text: 'Başka bir kurumun sizin metodunuzu "çalmaya" çalıştığını duydunuz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Bu durumun kurumsal fikri mülkiyet haklarını ihlal ettiğini savunarak derhal yönetimi bilgilendiririm ve hukuki/kurumsal koruma yollarının devreye sokulması için proaktif bir rapor hazırlarım.', weights: { workEthics: 0.9, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Koruma İçgüdüsü.' },
      { label: 'Bilginin evrensel olduğuna ve paylaştıkça değer kazandığına inanırım; bu durumu büyütmek yerine, diğer kurumun da çocuklara faydalı olması için sessiz kalırım veya gerekirse onlarla metodun detaylarını paylaşmayı teklif ederim.', weights: { workEthics: 0.7, personality: 0.8 }, analysisInsight: 'İdealist ve Bağımsız Profil.' }
    ]
  },
  {
    id: 'eth_new_4', category: 'workEthics', type: 'radio',
    text: 'Eski çalıştığınız kurumdaki bir veli sizi aradı ve şimdiki kurumunuza gelmek istediğini söyledi. Tavrınız?',
    weightedOptions: [
      { label: 'Durumu derhal mevcut kurumuma haber veririm ve veliyle olan iletişimi kurumsal bir etik filtreyle (kurumlar arası rekabet kurallarını ihlal etmeden) yönetirim; profesyonel etik gereği "veli transferi" suçlaması almamayı önceliklendiririm.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Şeffaf Profesyonellik.' },
      { label: 'Veliyi bir an önce yeni kurumuma kaydettirmek için süreci hızlandırırım; kurumuma yeni bir vaka kazandırmanın kurumsal bir başarı olduğunu düşünerek bu referansı yönetime bir prim veya liyakat artışı aracı olarak sunarım.', weights: { workEthics: 0.3, sustainability: 0.5 }, analysisInsight: 'Ticari ve Sonuç Odaklı Yaklaşım.' }
    ]
  },
  {
    id: 'eth_new_5', category: 'workEthics', type: 'radio',
    text: 'Kurumda bir arkadaşınızın vaka üzerinde fiziksel "kaba kuvvet" (istismar sınırı) kullandığını gördünüz. İlk adımınız?',
    weightedOptions: [
      { label: 'Hiç beklemeden ve duygusal bir tereddüt yaşamadan koordinatörlüğe veya disiplin kuruluna yazılı bildirim yaparım; bir çocuğun fiziksel bütünlüğünün, meslektaş dayanışmasından sonsuz kat daha kutsal olduğunu savunurum.', weights: { workEthics: 1.0, clinical: 0.9 }, analysisInsight: 'Sıfır Tolerans Disiplini.' },
      { label: 'Önce arkadaşımı birebirde sertçe uyarır ve yaptığı hatayı düzeltmesini, aksi takdirde şikayet edeceğimi söylerim; mesai arkadaşımı doğrudan feda etmek yerine, ona kendisini düzeltmesi için bir şans tanıyarak "omerta" kültürüne yakın dururum.', weights: { workEthics: 0.5, empathy: 0.6 }, analysisInsight: 'Meslektaş Koruma Refleksi.' }
    ]
  },
  {
    id: 'eth_new_6', category: 'workEthics', type: 'radio',
    text: 'Veli, çocuğun seansları dışında size sosyal medyadan (Instagram/Facebook) arkadaşlık isteği gönderdi ve DM üzerinden özel hayatınızla ilgili sorular sordu. Kararınız?',
    weightedOptions: [
      { label: 'İsteği kabul etmem, bir sonraki seansta veliye profesyonel sınırlarımı ve sosyal medya politikamı nazikçe açıklarım; kişisel alanımı korumanın seans verimi için şart olduğunu belirtirim.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Sağlıklı Profesyonel Sınır Bilinci.' },
      { label: 'Güven bağını bozmamak için kabul ederim ancak paylaşımlarımı kısıtlarım; veliyle "arkadaş" olmanın ev programlarına katılımı artırabileceğini düşünürüm.', weights: { workEthics: 0.3, empathy: 0.7 }, analysisInsight: 'Sınır Karmaşası ve Rol Çatışması Riski.' }
    ]
  },
  {
    id: 'eth_new_7', category: 'workEthics', type: 'radio',
    text: 'Ekonomik durumu çok iyi olan bir veli, size çok pahalı bir hediye (örn: marka bir saat veya telefon) getirdi ve "emekleriniz için bir teşekkür" dedi. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Hediyeyi kesinlikle kabul etmem. Kurum politikası ve mesleki etik gereği maddi değeri olan hediyelerin "terapötik tarafsızlığı" bozabileceğini veliye profesyonel bir dille açıklarım.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Yüksek Etik Tahkim.' },
      { label: 'Veliyi kırmamak ve emeğimin değerini bildiğini göstermek için bu seferlik kabul ederim; ancak bunu kimseye söylememesini rica ederek durumu kişisel bir jest seviyesinde tutarım.', weights: { workEthics: 0.1, institutionalLoyalty: 0.2 }, analysisInsight: 'Maddi Manipülasyona Açık Profil.' }
    ]
  },
  {
    id: 'eth_new_8', category: 'workEthics', type: 'radio',
    text: 'Veli, kurum dışındaki "özel seans" (ev dersi) talebiyle size geldi ve kurumdan çok daha yüksek bir ücret teklif etti. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Talebi derhal reddederim ve durumu etik gereği kurum yönetimine raporlarım. Kurumda kayıtlı olan bir vakaya dışarıda hizmet vermenin hem hukuki hem de ahlaki bir sadakatsizlik olduğunu savunurum.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Sadakat ve Sözleşme Etiği.' },
      { label: 'Kurumun haberi olmadan, mesai saatlerim dışında olduğu için değerlendirebileceğimi düşünürüm. Personel maaşlarının yetersizliği durumunda bunun bir "ek gelir hakkı" olduğuna inanırım.', weights: { workEthics: -1.0, integrity: 0.3 }, analysisInsight: 'Gizli Ajanda ve Güven İhlali.' }
    ]
  },
  {
    id: 'eth_new_9', category: 'workEthics', type: 'radio',
    text: 'Seans sırasında çocuğun vücudunda "şüpheli bir morluk" fark ettiniz. Veli "oyun oynarken düştü" diyor ama sezgileriniz istismardan şüpheleniyor. Yol haritanız?',
    weightedOptions: [
      { label: 'Hiç tereddüt etmeden kurumun "Çocuk Koruma" protokolünü işletirim. Gerekli tüm tıbbi ve adli bildirimlerin yapılması için yönetimi zorlar ve vakanın güvenliğini profesyonel önceliğim yaparım.', weights: { workEthics: 1.0, clinical: 1.0 }, analysisInsight: 'Klinik Cesaret ve Hukuki Bilinç.' },
      { label: 'Veli ile aramdaki bağı korumak için onun beyanına güvenirim. Eğer bildirim yaparsam velinin çocuğu kurumdan alacağını ve eğitimin aksayacağını düşünerek sessiz kalıp durumu izlemeyi seçerim.', weights: { workEthics: 0.2, empathy: 0.5 }, analysisInsight: 'Risk İhmali ve Yanlış Önceliklendirme.' }
    ]
  },
  {
    id: 'eth_new_10', category: 'workEthics', type: 'radio',
    text: 'Bir vakanızın gelişimi durdu ama yönetim "veliyi kaybetmemek için" raporda sanki büyük bir ilerleme varmış gibi (sahte veri) yazmanızı istiyor. Tavrınız?',
    weightedOptions: [
      { label: 'Asla kabul etmem. Bilimsel veriyi manipüle etmenin mesleki bir intihar olduğunu savunur, gerekirse bu baskı nedeniyle istifa etmeyi bile göze alırım; akademik dürüstlük pazarlık konusu değildir.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Sarsılmaz Akademik Kimlik.' },
      { label: 'Kurumun ticari geleceğini ve personelin maaşlarını düşünerek bu "beyaz yalanı" kabul ederim. Veli mutlu olursa eğitim için daha çok bütçe ayıracağını, bunun çocuğun lehine olabileceğini varsayarım.', weights: { workEthics: 0.2, institutionalLoyalty: 0.6 }, analysisInsight: 'Faydacı ama Etik Dışı Yaklaşım.' }
    ]
  },
  {
    id: 'eth_new_11', category: 'workEthics', type: 'radio',
    text: 'İş arkadaşınızın vaka başında uyuduğunu veya sürekli telefonla oynadığını (seans süresini gasp ettiğini) gördünüz. Kararınız?',
    weightedOptions: [
      { label: 'Önce arkadaşımı uyarırım, davranış devam ederse kurumun kalite standartlarını ve öğrencilerin hakkını korumak adına durumu üst yönetime "Akademik Denetim" kapsamında bildiririm.', weights: { workEthics: 1.0, clinical: 0.8 }, analysisInsight: 'Kalite Odaklı Denetim Bilinci.' },
      { label: 'Arkadaşımı zor durumda bırakmam; hepimiz yorulabiliyoruz diyerek durumu görmezden gelirim. "İspiyoncu" damgası yemenin çalışma barışını daha çok bozacağını düşünürüm.', weights: { workEthics: 0.4, team_player: 0.6 }, analysisInsight: 'Klinik İhmali Tolere Etme Eğilimi.' }
    ]
  },
  {
    id: 'eth_new_12', category: 'workEthics', type: 'radio',
    text: 'Bir seansın sonunda veli sizi arabasıyla eve bırakmayı teklif etti. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Nazikçe reddederim. Profesyonel mesafenin korunması gerektiğini, veli ile kurulan "samimiyetin" ileride klinik kararlarımı etkileyebileceğini (duygusal borçluluk) bilirim.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Rol Karmaşasını Önleme Yetisi.' },
      { label: 'Yolumuzun üzeri ise kabul ederim; bu tarz küçük iyiliklerin veli ile olan işbirliğini ısıtacağını ve insani bir bağ kuracağını düşünürüm.', weights: { workEthics: 0.5, empathy: 0.8 }, analysisInsight: 'Sınır Belirsizliği.' }
    ]
  },
  {
    id: 'eth_new_13', category: 'workEthics', type: 'radio',
    text: 'Kurumun tuvaletinde veya kantininde, diğer personellerle bir öğrencinin "komik ama mahrem" bir durumunu konuşup gülüyorsunuz. Bu durumun etik boyutu nedir?',
    weightedOptions: [
      { label: 'Bu durumun "Gizlilik Sözleşmesi" ve vaka onuru ihlali olduğunu saptarım. Çocuğun mahremiyetinin kurumun her köşesinde (koridor dahil) korunması gerektiğini hatırlatır, konuşmayı sonlandırırım.', weights: { workEthics: 1.0, clinical: 0.9 }, analysisInsight: 'Vaka Onuruna Saygı.' },
      { label: 'Sadece stres atmak için yapılan masum bir konuşma olarak görürüm. İsim verilmediği sürece personelin kendi arasında vakalarla ilgili şakalaşmasının normal ve insani olduğunu savunurum.', weights: { workEthics: 0.3, sustainability: 0.5 }, analysisInsight: 'Düşük Mesleki Olgunluk.' }
    ]
  },
  {
    id: 'eth_new_14', category: 'workEthics', type: 'radio',
    text: 'Başka bir uzmanın (örn: Psikolog) vakanız için önerdiği bir ilacı veya takviyeyi, sizin branşınız dışı olmasına rağmen veliye "kullanmayın, zararlı" diye yorumladınız. Tavrınızın analizi?',
    weightedOptions: [
      { label: 'Bunu büyük bir yetki aşımı ve etik ihlal olarak görürüm. Uzmanlık alanım dışındaki konularda (tıp/eczacılık vb.) görüş bildirmemin vaka güvenliğini riske atacağını bilirim ve sorumluluğu uzmana bırakırım.', weights: { workEthics: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Sınır ve Yetki Bilinci.' },
      { label: 'Aileyi korumak için kendi tecrübemden yola çıkarak uyardığımı savunurum. Gördüğüm yanlış bir şeye sessiz kalmanın daha büyük bir etik hata olduğunu düşünürüm.', weights: { workEthics: 0.4, personality: 0.7 }, analysisInsight: 'Mesleki Narsisizm Riski.' }
    ]
  },
  {
    id: 'eth_new_15', category: 'workEthics', type: 'radio',
    text: 'Kurumdan ayrılmaya karar verdiniz. Mevcut vakalarınızın dosyalarını ve veli numaralarını, yeni gideceğiniz kurumda kullanmak için gizlice kopyaladınız. Bu reaksiyonun liyakat karşılığı nedir?',
    weightedOptions: [
      { label: 'Bu bir "Veri Hırsızlığı" ve "Mesleki İhanet"tir. Kuruma ait her türlü bilginin kurumsal mülkiyet olduğunu, vakaların kişisel mal varlığı gibi taşınamayacağını kabul ederim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Hukuki ve Ahlaki Bilinç.' },
      { label: 'Vakalar bana güvendiği için geldiler, dolayısıyla onları takip etme hakkım var. Kurumun emeğimi sömürdüğünü düşünerek bu durumu bir tür "hak arama" olarak görürüm.', weights: { workEthics: -1.0, integrity: 0.2 }, analysisInsight: 'Patolojik Haklılık ve Güvenilmez Profil.' }
    ]
  },

  // --- 10 YENİ ETİK VE PROFESYONEL MESAFE SORUSU (16-25) ---
  {
    id: 'eth_new_16', category: 'workEthics', type: 'radio',
    text: 'Yakın bir akrabanızın çocuğu sizin çalıştığınız kuruma vaka olarak başladı. Etik protokolünüz ne olur?',
    weightedOptions: [
      { label: 'Akraba bağım nedeniyle tarafsızlığımın bozulabileceğini (Dual Relationship) bildirerek vakanın bir başka meslektaşıma devredilmesini talep ederim; sadece bir "gözlemci" olarak kalmayı seçerim.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Kritik Sınır Bilinci.' },
      { label: 'Çocuğu en iyi ben tanıdığım için seanslarına benim girmemin daha verimli olacağını savunurum; akrabalık bağını klinik bir avantaj olarak kullanmaya çalışırım.', weights: { workEthics: 0.3, clinical: 0.6 }, analysisInsight: 'Nesnellik Kaybı ve Rol Çatışması.' }
    ]
  },
  {
    id: 'eth_new_17', category: 'workEthics', type: 'radio',
    text: 'Veli, seans sırasında diğer bir öğretmenin "yetersiz" olduğunu iddia ederek sizin fikrinizi sordu. Yanıtınız?',
    weightedOptions: [
      { label: 'Meslektaşım hakkında yorum yapmaktan kaçınırım. "Tüm öğretmenlerimiz akademik kurulumuzca denetlenmektedir, endişelerinizi koordinatörümüze iletebilirsiniz" diyerek profesyonel dayanışmayı ve hiyerarşiyi korurum.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Diplomat.' },
      { label: 'Veliye hak vererek kendi yöntemlerimin daha üstün olduğunu hissettiririm; velinin güvenini kazanmak için diğer öğretmeni zayıf göstermekten çekinmem.', weights: { workEthics: 0.2, personality: 0.4 }, analysisInsight: 'Narsistik Rekabet Eğilimi.' }
    ]
  },
  {
    id: 'eth_new_18', category: 'workEthics', type: 'radio',
    text: 'Kurum müdürü, vaka sayısı azaldığı için "henüz hazır olmayan" bir çocuğu mezun etmek yerine 6 ay daha sistemde tutmanızı (gereksiz seans) istedi. Tavrınız?',
    weightedOptions: [
      { label: 'Vakanın akademik olarak hazır olduğunu bilimsel verilerle kanıtlar ve gereksiz seansın "Etik Sömürü" olduğunu savunarak müdürün talebine direnirim; vaka yararı her türlü ticari kârdan üstündür.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Klinik Radikalizm.' },
      { label: 'Kurumun ekonomik dengelerini gözeterek çocuğun planda kalmasına onay veririm; "Zararı olmaz, pekiştirme yapmış oluruz" diyerek vicdani yükü hafifletmeye çalışırım.', weights: { workEthics: 0.3, institutionalLoyalty: 0.7 }, analysisInsight: 'Ticari Uyum ve Etik Esneme.' }
    ]
  },
  {
    id: 'eth_new_19', category: 'workEthics', type: 'radio',
    text: 'Bir veli, eşinizin/yakınınızın iş aradığını bildiği için ona kendi şirketinde yüksek maaşlı bir iş teklif etti. Kararınız?',
    weightedOptions: [
      { label: 'Bu teklifi bir "Menfaat Çatışması" (Conflict of Interest) riski olarak görür ve nazikçe reddetmesini isterim; aksi halde veli ile aramdaki terapötik otoritenin sarsılacağını bilirim.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Üst Düzey Çıkar Çatışması Yönetimi.' },
      { label: 'İş hayatı ile özel hayatın farklı olduğunu, bu teklifin benim seans kalitemi etkilemeyeceğini düşünerek kabul edilmesinde bir sakınca görmem.', weights: { workEthics: 0.4, sustainability: 0.6 }, analysisInsight: 'Zayıf Etik Öngörü.' }
    ]
  },
  {
    id: 'eth_new_20', category: 'workEthics', type: 'radio',
    text: 'Kurumun "Özel Materyalleri"ni veya "Ölçme Araçları"nı hafta sonu verdiğiniz özel derslerde kullanmak için gizlice eve götürdünüz. Bu durumun tanımı nedir?',
    weightedOptions: [
      { label: 'Bu bir "Kurumsal Kaynak Gaspı" ve "Güven İhlali"dir. Kuruma ait her türlü mülkiyetin sadece kurum sınırları içinde ve kayıtlı vakalar için kullanılması gerektiğini kabul ederim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Mülkiyet Bilinci.' },
      { label: 'Zaten kurumun personeli olduğumu, materyallerin boş durmasındansa başka bir çocuğa faydalı olmasının daha insani bir tercih olduğunu savunurum.', weights: { workEthics: -0.5, integrity: 0.4 }, analysisInsight: 'Rasyonalize Edilmiş Hırsızlık.' }
    ]
  },
  {
    id: 'eth_new_21', category: 'workEthics', type: 'radio',
    text: 'Resmi bir kurum (örn: RAM veya Mahkeme) vakanız hakkında bilgi istedi ancak kurum yönetimi "bazı olumsuzlukları gizle" dedi. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Resmi makamlara sadece gerçek ve objektif verileri sunarım. Yalan beyanın mesleki suç olduğunu, kurum hiyerarşisinin yasal yükümlülüklerin önüne geçemeyeceğini açıkça belirtirim.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Hukuki Bütünlük.' },
      { label: 'Kurum yönetiminin talimatına uyarım; "Kurumumu korumak görevimdir" diyerek verileri filtrelerim ve riskleri minimize ederim.', weights: { workEthics: 0.2, institutionalLoyalty: 0.8 }, analysisInsight: 'Kör Sadakat ve Yasal Risk.' }
    ]
  },
  {
    id: 'eth_new_22', category: 'workEthics', type: 'radio',
    text: 'Veli, seans bitiminde size "Bayram harçlığı" adı altında bir miktar nakit para zarfı uzattı. Tepkiniz?',
    weightedOptions: [
      { label: 'Zarfı kesinlikle almam. Bu durumun "Rüşvet" veya "Sınır İhlali" kapsamına girdiğini, profesyonel hizmet bedelinin sadece kuruma ödendiğini hatırlatırım.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Parasal Sınır Tahkimatı.' },
      { label: 'Kültürel bir gelenek olduğunu düşünerek, veliyi rencide etmemek adına kabul ederim ve bu parayı sınıfa yeni materyaller almak için kullanacağımı söyleyerek vicdanımı rahatlatırım.', weights: { workEthics: 0.4, empathy: 0.7 }, analysisInsight: 'Gevşek Etik Çerçeve.' }
    ]
  },
  {
    id: 'eth_new_23', category: 'workEthics', type: 'radio',
    text: 'Bekar bir öğretmensiniz ve bir vaka velisi size duygusal/romantik bir yakınlık gösterdi. İlk adımınız?',
    weightedOptions: [
      { label: 'Durumu derhal yönetime bildiririm ve vakanın başka bir öğretmene nakledilmesini sağlarım; terapötik ilişkinin "romantik" bir zemine kaymasının klinik olarak yıkıcı olduğunu bilirim.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Kritik Duygusal Sınır Yönetimi.' },
      { label: 'Önce veliyi birebirde uyarırım, eğer devam ederse yönetime söylerim; durumu kendi başıma çözmeye çalışarak olayı gizli tutmayı tercih ederim.', weights: { workEthics: 0.6, formal_distance: 0.5 }, analysisInsight: 'Risk Gizleme Eğilimi.' }
    ]
  },
  {
    id: 'eth_new_24', category: 'workEthics', type: 'radio',
    text: 'Bir ilaç veya takviye gıda firması, ürünlerini velilere önermeniz karşılığında size her satıştan komisyon teklif etti. Kararınız?',
    weightedOptions: [
      { label: 'Teklifi reddederim ve firmayı kara listeye alırım. Bir uzmanın ticari çıkar için tıbbi öneride bulunmasının "Mesleki İhanet" olduğunu savunurum.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Bilimsel Bağımsızlık.' },
      { label: 'Eğer ürünün gerçekten faydalı olduğuna inanıyorsam kabul edebilirim; hem aileye yardım etmiş hem de ek gelir elde etmiş olurum diye düşünürüm.', weights: { workEthics: -1.0, clinical: 0.5 }, analysisInsight: 'Yozlaşmaya Açık Profil.' }
    ]
  },
  {
    id: 'eth_new_25', category: 'workEthics', type: 'radio',
    text: 'Kurumda kullanılan ve sizin de geliştirdiğiniz "Özel Bir Müfredat" var. Ayrılırken bu müfredatı yanınızda götürüp başka bir kurumda "benim eserim" diye kullanabilir misiniz?',
    weightedOptions: [
      { label: 'Hayır. Kurum çatısı altında, kurum kaynaklarıyla geliştirilen her türlü materyalin kurumsal mülkiyet (IP) olduğunu ve izinsiz kullanımın hırsızlık olduğunu bilirim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Fikri Mülkiyet Bilinci.' },
      { label: 'Fikir bana ait olduğu için emeğimi koruma hakkım olduğunu düşünür ve materyali yeni iş yerimde kullanmaya devam ederim.', weights: { workEthics: 0.2, integrity: 0.3 }, analysisInsight: 'Profesyonel Hırsızlık Riski.' }
    ]
  },

  // --- KURUMSAL SADAKAT (Loyalty) ---
  {
    id: 'loy_new_1', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumda çok sevdiğiniz bir iş arkadaşınız haksız yere işten çıkarıldı. Kuruma tepkiniz ne olur?',
    weightedOptions: [
      { label: 'Kurumsal adalete olan inancım zayıflar ve motivasyonum ciddi şekilde düşer; işe sadece zorunlu olduğu için gider ve sessizce yeni bir iş bakma sürecine girerim; duygularımın profesyonel performansımı etkilemesine engel olamam.', weights: { institutionalLoyalty: 0.2, sustainability: 0.4 }, analysisInsight: 'Duygusal ve Tepkisel Karar Verici.' },
      { label: 'Yaşanan üzücü olayı iş arkadaşımla özel hayatımda paylaşırım ancak kurum içindeki performansımı, seans kalitemi ve diğer vaka sorumluluklarımı bu durumdan tamamen ayrıştırırım; kurumun tüzel kişiliği ile kişisel olayları birbirine karıştırmam.', weights: { institutionalLoyalty: 1.0, sustainability: 1.0 }, analysisInsight: 'Yüksek Profesyonel Olgunluk.' }
    ]
  },
  {
    id: 'loy_new_2', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumun bir politikasını (örn: kılık kıyafet, raporlama hızı) saçma buluyorsunuz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'İmzalamış olduğum sözleşme gereği kurallara tam uyum gösteririm; sistemin işlemesi için kuralların sorgulanmadan uygulanması gerektiğini bilirim ancak uygun bir zamanda yönetime yapıcı ve analitik bir öneri dosyası sunarım.', weights: { institutionalLoyalty: 1.0, workEthics: 0.9 }, analysisInsight: 'Disiplinli ve Yapıcı Muhalif.' },
      { label: 'Bu kuralları içselleştiremediğim için gizlice uymamayı tercih ederim veya uymayan iş arkadaşlarımı destekleyerek kurumsal bir mikro-direnç alanı oluştururum; kişisel özgürlüğümün ve mantığımın kurallardan üstün olduğunu düşünürüm.', weights: { institutionalLoyalty: 0.1, personality: 0.6 }, analysisInsight: 'Pasif-Agresif Tutum.' }
    ]
  }
];
