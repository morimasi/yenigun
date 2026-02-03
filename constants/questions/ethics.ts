import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  {
    id: 'eth_1', category: 'workEthics', type: 'radio',
    text: 'Veli, kurum dışındaki "özel seans" talebiyle size geldi ve kurumdan çok daha yüksek bir ücret teklif etti. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Talebi derhal reddederim ve durumu etik gereği kurum yönetimine raporlarım; kurumsal sadakatin mesleki onurumun parçası olduğunu bilirim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Kurumsal Entegrite.' },
      { label: 'Reddederim ancak veliyi kırmamak ve güvenini kaybetmemek için yönetime bildirmem, aramızda bir sır olarak kalmasını sağlarım.', weights: { workEthics: 0.6, empathy: 0.8 }, analysisInsight: 'İlişki Odaklı ama Riskli Şeffaflık.' }
    ]
  },
  {
    id: 'eth_2', category: 'workEthics', type: 'radio',
    text: 'Vaka seans sırasında vücudunda "şüpheli bir morluk" fark ettiniz. Veli "parkta düştü" diyor ama sezgileriniz farklı söylüyor. Yol haritanız?',
    weightedOptions: [
      { label: 'Hiç tereddüt etmeden kurumun "Çocuk Koruma" protokolünü işletir, resmi bildirimleri başlatırım; çocuğun güvenliği veli ile aramdaki bağdan daha kutsaldır.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Klinik Cesaret ve Hukuki Bilinç.' },
      { label: 'Veli ile aramdaki bağı korumak için bir süre daha gözlemlerim. Eğer bildirim yaparsam velinin çocuğu kurumdan alacağını ve eğitimin aksayacağını düşünerek sessiz kalırım.', weights: { workEthics: 0.1, sustainability: 0.4 }, analysisInsight: 'Kritik Etik İhmal Riski.' }
    ]
  },
  {
    id: 'eth_3', category: 'workEthics', type: 'radio',
    text: 'Kurumda çok yakın bir arkadaşınızın vaka başında sürekli telefonla oynadığını (seans süresini gasp ettiğini) gördünüz. Kararınız?',
    weightedOptions: [
      { label: 'Önce arkadaşımı uyarırım, davranış devam ederse kurumun kalite standartlarını korumak adına durumu yönetime "Akademik Denetim" kapsamında bildiririm.', weights: { workEthics: 1.0, leadership: 0.9 }, analysisInsight: 'Kalite ve Denetim Odaklı.' },
      { label: 'Arkadaşımı zor durumda bırakmam; hepimiz yorulabiliyoruz diyerek durumu görmezden gelirim. "İspiyoncu" damgası yemenin çalışma barışını bozacağını düşünürüm.', weights: { workEthics: 0.3, team_player: 0.6 }, analysisInsight: 'Gevşek Etik Çerçeve.' }
    ]
  },
  {
    id: 'eth_4', category: 'workEthics', type: 'radio',
    text: 'Veli, size kurum müdürü hakkında gizli bir şikayette bulunuyor ve "aramızda kalsın" diyor. Tavrınız?',
    weightedOptions: [
      { label: 'Veliye, kurumumuzda şeffaflığın esas olduğunu hatırlatırım ve "Bunu duyduğuma üzüldüm ancak müdürümüzle doğrudan görüşmeniz sorunların çözümü için tek yoldur" diyerek sınır çizerim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Diplomat.' },
      { label: 'Veliyle aramdaki güveni korumak için onu aktif dinlerim ve "haklısınız" diyerek konuyu geçiştiririm; velinin duygusal boşalımına izin vererek ilişkiyi sıcak tutarım.', weights: { workEthics: 0.4, empathy: 0.8 }, analysisInsight: 'Sınır İhlali ve Manipülasyona Açıklık.' }
    ]
  },
  {
    id: 'eth_5', category: 'workEthics', type: 'radio',
    text: 'Bir vakanızın gelişimi durdu ama yönetim "veliyi kaybetmemek için" raporda sanki büyük bir ilerleme varmış gibi (sahte veri) yazmanızı istiyor. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Asla kabul etmem. Bilimsel veriyi manipüle etmenin mesleki bir intihar olduğunu savunur, gerekirse bu baskı nedeniyle istifayı göze alırım; akademik dürüstlük pazarlık konusu değildir.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Sarsılmaz Akademik Kimlik.' },
      { label: 'Kurumun ekonomik dengelerini ve personelin maaşlarını düşünerek bu "beyaz yalanı" kabul ederim. Veli mutlu olursa eğitim için daha çok bütçe ayıracağını, bunun çocuğun lehine olacağını varsayarım.', weights: { workEthics: 0.2, institutionalLoyalty: 0.7 }, analysisInsight: 'Faydacı ama Etik Dışı.' }
    ]
  },
  {
    id: 'eth_6', category: 'workEthics', type: 'radio',
    text: 'Veli size çok pahalı bir hediye (örn: marka bir saat) getirdi ve "emekleriniz için bir teşekkür" dedi. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Hediyeyi kesinlikle kabul etmem. Profesyonel mesafenin ve tarafsızlığın bozulabileceğini veliye nazikçe açıklar, kurum politikamızı hatırlatırım.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Maddi Manipülasyona Kapalı.' },
      { label: 'Veliyi kırmamak ve emeğimin değerini bildiğini göstermek için bu seferlik kabul ederim; ancak bunu kimseye söylememesini rica ederek durumu kişisel bir jest seviyesinde tutarım.', weights: { workEthics: 0.1, integrity: 0.3 }, analysisInsight: 'Maddi Manipülasyona Açık.' }
    ]
  },
  {
    id: 'eth_7', category: 'workEthics', type: 'radio',
    text: 'Kurumdan ayrılmaya karar verdiniz. Mevcut vakalarınızın dosyalarını ve veli numaralarını, yeni gideceğiniz kurumda kullanmak için gizlice kopyaladınız. Bu durumun liyakat karşılığı nedir?',
    weightedOptions: [
      { label: 'Bu bir "Veri Hırsızlığı"dır. Kuruma ait her türlü bilginin kurumsal mülkiyet olduğunu, vakaların kişisel mal varlığı gibi taşınamayacağını kabul ederim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Hukuki ve Ahlaki Bilinç.' },
      { label: 'Vakalar bana güvendiği için geldiler, dolayısıyla onları takip etme hakkım var. Kurumun emeğimi sömürdüğünü düşünerek bunu bir tür "hak arama" olarak görürüm.', weights: { workEthics: -1.0, integrity: 0.2 }, analysisInsight: 'Patolojik Haklılık ve Güven İhlali.' }
    ]
  },
  {
    id: 'eth_8', category: 'workEthics', type: 'radio',
    text: 'Bekar bir öğretmensiniz ve bir vaka velisi size duygusal/romantik bir yakınlık gösterdi. İlk adımınız?',
    weightedOptions: [
      { label: 'Durumu derhal yönetime bildiririm ve vakanın başka bir öğretmene nakledilmesini sağlarım; terapötik ilişkinin "romantik" bir zemine kaymasının klinik olarak yıkıcı olduğunu bilirim.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Kritik Duygusal Sınır Yönetimi.' },
      { label: 'Önce veliyi birebirde uyarırım, eğer devam ederse yönetime söylerim; durumu kendi başıma çözmeye çalışarak olayı gizli tutmayı tercih ederim.', weights: { workEthics: 0.5, formal_distance: 0.4 }, analysisInsight: 'Risk Gizleme Eğilimi.' }
    ]
  },
  {
    id: 'eth_9', category: 'workEthics', type: 'radio',
    text: 'Bir ilaç firması, ürünlerini velilere önermeniz karşılığında size her satıştan komisyon teklif etti. Kararınız?',
    weightedOptions: [
      { label: 'Teklifi reddederim ve firmayı kara listeye alırım. Bir uzmanın ticari çıkar için tıbbi öneride bulunmasının "Mesleki İhanet" olduğunu savunurum.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Bilimsel Bağımsızlık.' },
      { label: 'Eğer ürünün gerçekten faydalı olduğuna inanıyorsam kabul edebilirim; hem aileye yardım etmiş hem de ek gelir elde etmiş olurum diye düşünürüm.', weights: { workEthics: -1.0, clinical: 0.5 }, analysisInsight: 'Yozlaşmaya Açık Profil.' }
    ]
  },
  {
    id: 'eth_10', category: 'workEthics', type: 'radio',
    text: 'Kurumda kullanılan ve sizin de geliştirdiğiniz "Özel Bir Müfredat" var. Ayrılırken bu müfredatı yanınızda götürüp başka bir kurumda "benim eserim" diye kullanabilir misiniz?',
    weightedOptions: [
      { label: 'Hayır. Kurum çatısı altında geliştirilen her türlü materyalin kurumsal mülkiyet (IP) olduğunu ve izinsiz kullanımın hırsızlık olduğunu bilirim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Fikri Mülkiyet Bilinci.' },
      { label: 'Fikir bana ait olduğu için emeğimi koruma hakkım olduğunu düşünür ve materyali yeni iş yerimde kullanmaya devam ederim.', weights: { workEthics: 0.2, integrity: 0.3 }, analysisInsight: 'Profesyonel Hırsızlık Riski.' }
    ]
  }
];