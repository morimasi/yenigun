
import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  {
    id: 'eth_new_1', category: 'workEthics', type: 'radio',
    text: 'Veli, size kurum müdürü hakkında gizli bir şikayette bulunuyor ve "aramızda kalsın" diyor. Tavrınız?',
    weightedOptions: [
      { label: 'Veliye kurumda şeffaflığın esas olduğunu hatırlatır ve konuyu müdürle doğrudan görüşmesini isterim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Kurumsal Bütünlük.' },
      { label: 'Veliyle aramdaki güveni korumak için onu aktif dinlerim ve konuyu yönetime yansıtmam.', weights: { workEthics: 0.4, institutionalLoyalty: 0.3 }, analysisInsight: 'Sınır İhlali Riski.' }
    ]
  },
  {
    id: 'eth_new_2', category: 'workEthics', type: 'radio',
    text: 'Raporunda vergi muafiyeti için "olmadığı kadar ağır" bir engel oranı yazılmasını talep ediyorlar. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Talebi kesinlikle reddederim; yanlış beyanın çocuğun klinik geleceğini bozacak bir yıkım olduğunu açıklarım.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Kaya Gibi Etik Duruş.' },
      { label: 'Kurumun ekonomik bekası için yönetimin çizdiği çerçeveye uyar, risk almadan onay veririm.', weights: { workEthics: 0.2, institutionalLoyalty: 0.5 }, analysisInsight: 'Düşük Etik Direnç.' }
    ]
  },
  {
    id: 'eth_new_3', category: 'workEthics', type: 'radio',
    text: 'Başka bir kurumun sizin metodunuzu "çalmaya" çalıştığını duydunuz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Kurumsal mülkiyet haklarını savunarak yönetimi bilgilendirir ve koruma yolları için rapor hazırlarım.', weights: { workEthics: 0.9, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Koruma İçgüdüsü.' },
      { label: 'Bilginin evrensel olduğuna inanırım; diğer kurumun da çocuklara faydalı olması için sessiz kalırım.', weights: { workEthics: 0.7, personality: 0.8 }, analysisInsight: 'İdealist Profil.' }
    ]
  },
  {
    id: 'eth_new_4', category: 'workEthics', type: 'radio',
    text: 'Eski kurumunuzdaki bir veli sizi aradı ve şimdiki kurumunuza gelmek istediğini söyledi. Tavrınız?',
    weightedOptions: [
      { label: 'Durumu derhal mevcut kurumuma haber verir ve etik filtreyle mülakat sürecini yönetirim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Şeffaf Profesyonellik.' },
      { label: 'Veliyi bir an önce yeni kurumuma kaydettirmek için süreci hızlandırır, bunu bir başarı olarak sunarım.', weights: { workEthics: 0.3, sustainability: 0.5 }, analysisInsight: 'Ticari Yaklaşım.' }
    ]
  },
  {
    id: 'eth_new_5', category: 'workEthics', type: 'radio',
    text: 'Kurumda bir arkadaşınızın vaka üzerinde "kaba kuvvet" kullandığını gördünüz. İlk adımınız?',
    weightedOptions: [
      { label: 'Duygusal tereddüt yaşamadan disiplin kuruluna yazılı bildirim yaparım; vaka güvenliği her şeyden kutsaldır.', weights: { workEthics: 1.0, clinical: 1.0 }, analysisInsight: 'Sıfır Tolerans Disiplini.' },
      { label: 'Önce arkadaşımı uyarır ve düzeltmesini isterim; aksi takdirde şikayet edeceğimi söylerim.', weights: { workEthics: 0.5, empathy: 0.6 }, analysisInsight: 'Meslektaş Koruma Refleksi.' }
    ]
  },
  {
    id: 'eth_new_6', category: 'workEthics', type: 'radio',
    text: 'Veli sosyal medyadan arkadaşlık isteği gönderdi ve özel sorular sordu. Kararınız?',
    weightedOptions: [
      { label: 'İsteği kabul etmem, nazikçe profesyonel sınırlarımı ve sosyal medya politikamı açıklarım.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Sağlıklı Sınır Bilinci.' },
      { label: 'Güven bağını bozmamak için kabul ederim ancak paylaşımlarımı kısıtlarım.', weights: { workEthics: 0.3, empathy: 0.7 }, analysisInsight: 'Rol Çatışması Riski.' }
    ]
  },
  {
    id: 'eth_new_7', category: 'workEthics', type: 'radio',
    text: 'Veli size çok pahalı bir hediye getirdi ve "emekleriniz için" dedi. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Hediyeyi reddederim. Maddi hediyelerin tarafsızlığı bozabileceğini profesyonel dille açıklarım.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Yüksek Etik Tahkim.' },
      { label: 'Veliyi kırmamak için kabul ederim; kimseye söylememesini rica ederek durumu kişisel tutarım.', weights: { workEthics: 0.1, institutionalLoyalty: 0.2 }, analysisInsight: 'Maddi Manipülasyona Açık.' }
    ]
  },
  {
    id: 'eth_new_8', category: 'workEthics', type: 'radio',
    text: 'Veli, kurum dışındaki "özel seans" talebiyle size geldi. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Reddederim ve yönetime raporlarım. Kurum vakasına dışarıda hizmet vermenin etik dışı olduğunu bilirim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Sadakat.' },
      { label: 'Yönetime söylemeden değerlendiririm. Maaşın yetersizliği durumunda bunu bir hak sayarım.', weights: { workEthics: -1.0, integrity: 0.3 }, analysisInsight: 'Güven İhlali.' }
    ]
  },
  {
    id: 'eth_new_9', category: 'workEthics', type: 'radio',
    text: 'Vakanın vücudunda şüpheli bir morluk fark ettiniz. Veli "düştü" diyor ama şüpheniz var. Yol haritanız?',
    weightedOptions: [
      { label: 'Tereddüt etmeden "Çocuk Koruma" protokolünü işletir, adli bildirim için yönetimi zorlarım.', weights: { workEthics: 1.0, clinical: 1.0 }, analysisInsight: 'Klinik Cesaret.' },
      { label: 'Veli beyanına güvenirim. Bildirim yaparsam velinin çocuğu kurumdan alacağını düşünür, izlerim.', weights: { workEthics: 0.2, empathy: 0.5 }, analysisInsight: 'Risk İhmali.' }
    ]
  },
  {
    id: 'eth_new_10', category: 'workEthics', type: 'radio',
    text: 'Yönetim "veliyi kaybetmemek için" raporda sahte ilerleme yazmanızı istedi. Tavrınız?',
    weightedOptions: [
      { label: 'Asla kabul etmem. Bilimsel veriyi manipüle etmenin mesleki intihar olduğunu savunurum.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Sarsılmaz Akademik Kimlik.' },
      { label: 'Ticari geleceği düşünerek bu yalanı kabul ederim. Veli mutlu olursa çocuk için iyi olacağını varsayarım.', weights: { workEthics: 0.2, institutionalLoyalty: 0.6 }, analysisInsight: 'Etik Dışı Faydacılık.' }
    ]
  },
  {
    id: 'eth_new_11', category: 'workEthics', type: 'radio',
    text: 'İş arkadaşınızın seans süresini telefonla oynayarak gasp ettiğini gördünüz. Kararınız?',
    weightedOptions: [
      { label: 'Önce arkadaşımı uyarırım, devam ederse kalite standartları gereği yönetime bildiririm.', weights: { workEthics: 1.0, clinical: 0.8 }, analysisInsight: 'Kalite Denetim Bilinci.' },
      { label: 'Arkadaşımı zor durumda bırakmam; hepimiz yorulabiliyoruz diyerek görmezden gelirim.', weights: { workEthics: 0.4, team_player: 0.6 }, analysisInsight: 'İhmali Tolere Etme.' }
    ]
  },
  {
    id: 'eth_new_12', category: 'workEthics', type: 'radio',
    text: 'Seans sonunda veli sizi arabasıyla eve bırakmayı teklif etti. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Nazikçe reddederim. Samimiyetin ileride klinik kararlarımı etkileyebileceğini bilirim.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Rol Karmaşasını Önleme.' },
      { label: 'Yolumuzun üzeri ise kabul ederim; bu tarz jestlerin işbirliğini ısıtacağını düşünürüm.', weights: { workEthics: 0.5, empathy: 0.8 }, analysisInsight: 'Sınır Belirsizliği.' }
    ]
  },
  {
    id: 'eth_new_13', category: 'workEthics', type: 'radio',
    text: 'Kantinde, bir öğrencinin "komik ama mahrem" durumunu konuşup gülüyorsunuz. Analiziniz?',
    weightedOptions: [
      { label: 'Bu durumun mahremiyet ihlali olduğunu saptarım ve konuşmayı hemen sonlandırırım.', weights: { workEthics: 1.0, clinical: 0.9 }, analysisInsight: 'Vaka Onuruna Saygı.' },
      { label: 'Stres atmak için yapılan masum bir konuşma olarak görürüm; isim verilmedikçe normaldir.', weights: { workEthics: 0.3, sustainability: 0.5 }, analysisInsight: 'Düşük Mesleki Olgunluk.' }
    ]
  },
  {
    id: 'eth_new_14', category: 'workEthics', type: 'radio',
    text: 'Psikoloğun önerdiği ilacı, branşınız dışı olmasına rağmen veliye "kullanmayın" dediniz. Analiziniz?',
    weightedOptions: [
      { label: 'Bunu yetki aşımı olarak görürüm. Tıbbi konularda görüş bildirmemin vaka güvenliğini riske atacağını bilirim.', weights: { workEthics: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Yetki Bilinci.' },
      { label: 'Aileyi korumak için kendi tecrübemden uyardığımı savunurum. Yanlışa sessiz kalmam.', weights: { workEthics: 0.4, personality: 0.7 }, analysisInsight: 'Mesleki Narsisizm.' }
    ]
  },
  {
    id: 'eth_new_15', category: 'workEthics', type: 'radio',
    text: 'Ayrılırken vaka dosyalarını ve veli numaralarını yeni yeriniz için gizlice kopyaladınız. Karşılığı nedir?',
    weightedOptions: [
      { label: 'Bu veri hırsızlığıdır. Kurumsal bilginin şahsa değil kuruma ait olduğunu kabul ederim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Hukuki Bilinç.' },
      { label: 'Vakalar bana güvendiği için geldiler. Bunu bir "hak arama" olarak görürüm.', weights: { workEthics: -1.0, integrity: 0.2 }, analysisInsight: 'Güvenilmez Profil.' }
    ]
  },
  {
    id: 'eth_new_16', category: 'workEthics', type: 'radio',
    text: 'Yakın akrabanızın çocuğu kuruma vaka olarak başladı. Etik protokolünüz nedir?',
    weightedOptions: [
      { label: 'Tarafsızlığımın bozulabileceğini bildirerek vakanın bir başka meslektaşıma devrini talep ederim.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Kritik Sınır Yönetimi.' },
      { label: 'Çocuğu en iyi ben tanıdığım için seanslarına benim girmemin daha verimli olacağını savunurum.', weights: { workEthics: 0.3, clinical: 0.6 }, analysisInsight: 'Nesnellik Kaybı.' }
    ]
  },
  {
    id: 'eth_new_17', category: 'workEthics', type: 'radio',
    text: 'Veli, diğer bir öğretmenin "yetersiz" olduğunu iddia etti. Yanıtınız?',
    weightedOptions: [
      { label: 'Meslektaşım hakkında yorum yapmam. Endişelerinizi koordinatörümüze iletebilirsiniz derim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Diplomat.' },
      { label: 'Veliye hak vererek kendi yöntemlerimin daha üstün olduğunu hissettiririm.', weights: { workEthics: 0.2, personality: 0.4 }, analysisInsight: 'Narsistik Rekabet.' }
    ]
  },
  {
    id: 'eth_new_18', category: 'workEthics', type: 'radio',
    text: 'Müdür, hazır olan bir vaka için "ticari nedenlerle" seansları 6 ay daha uzatmanızı istedi. Tavrınız?',
    weightedOptions: [
      { label: 'Vakanın hazır olduğunu bilimsel verilerle kanıtlar ve gereksiz seansa karşı direnirim.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Klinik Radikalizm.' },
      { label: 'Kurumun dengelerini gözeterek onay veririm; "zararı olmaz pekiştirme yaparız" derim.', weights: { workEthics: 0.3, institutionalLoyalty: 0.7 }, analysisInsight: 'Etik Esneme.' }
    ]
  },
  {
    id: 'eth_new_19', category: 'workEthics', type: 'radio',
    text: 'Bir veli, yakınınızın iş aradığını bilip ona kendi şirketinde yüksek maaşlı iş teklif etti. Kararınız?',
    weightedOptions: [
      { label: 'Bu teklifi "Menfaat Çatışması" riski görür ve reddetmesini isterim; otoritem sarsılmamalı.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Çıkar Çatışması Yönetimi.' },
      { label: 'Özel hayatın farklı olduğunu, seans kalitemi etkilemeyeceğini düşünerek kabulde sakınca görmem.', weights: { workEthics: 0.4, sustainability: 0.6 }, analysisInsight: 'Zayıf Etik Öngörü.' }
    ]
  },
  {
    id: 'eth_new_20', category: 'workEthics', type: 'radio',
    text: 'Kurum materyallerini gizlice eve götürüp hafta sonu özel derslerinizde kullandınız. Tanımı nedir?',
    weightedOptions: [
      { label: 'Bu bir "Kurumsal Kaynak Gaspı"dır. Mülkiyetin sadece kurum içinde kullanılması gerektiğini bilirim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Mülkiyet Bilinci.' },
      { label: 'Zaten personel olduğumu, başka bir çocuğa faydalı olmasının daha insani olduğunu savunurum.', weights: { workEthics: -0.5, integrity: 0.4 }, analysisInsight: 'Rasyonalize Edilmiş Hırsızlık.' }
    ]
  },
  {
    id: 'eth_new_21', category: 'workEthics', type: 'radio',
    text: 'Resmi bir kurum vaka hakkında bilgi istedi ama müdür "olumsuzlukları gizle" dedi. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Sadece gerçek ve objektif verileri sunarım. Yalan beyanın mesleki suç olduğunu savunurum.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Hukuki Bütünlük.' },
      { label: 'Yönetimin talimatına uyarım; "kurumumu korumak görevimdir" diyerek verileri filtrelerim.', weights: { workEthics: 0.2, institutionalLoyalty: 0.8 }, analysisInsight: 'Kör Sadakat.' }
    ]
  },
  {
    id: 'eth_new_22', category: 'workEthics', type: 'radio',
    text: 'Veli, seans bitiminde size nakit para zarfı uzattı. Tepkiniz?',
    weightedOptions: [
      { label: 'Zarfı kesinlikle almam. Bu durumun sınır ihlali olduğunu ve bedelin kuruma ödendiğini hatılatırım.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Parasal Sınır Tahkimatı.' },
      { label: 'Kültürel gelenek olduğunu düşünerek kabul eder ve sınıfa materyal almak için kullanırım.', weights: { workEthics: 0.4, empathy: 0.7 }, analysisInsight: 'Gevşek Etik Çerçeve.' }
    ]
  },
  {
    id: 'eth_new_23', category: 'workEthics', type: 'radio',
    text: 'Veli size romantik bir yakınlık gösterdi. İlk adımınız?',
    weightedOptions: [
      { label: 'Durumu derhal yönetime bildirir ve vakanın nakledilmesini sağlarım; bu klinik olarak yıkıcıdır.', weights: { workEthics: 1.0, formal_distance: 1.0 }, analysisInsight: 'Duygusal Sınır Yönetimi.' },
      { label: 'Önce veliyi uyarırım, devam ederse söylerim; durumu kendi başıma çözmeye çalışırım.', weights: { workEthics: 0.6, formal_distance: 0.5 }, analysisInsight: 'Risk Gizleme.' }
    ]
  },
  {
    id: 'eth_new_24', category: 'workEthics', type: 'radio',
    text: 'İlaç firması ürün öneriniz karşılığında komisyon teklif etti. Kararınız?',
    weightedOptions: [
      { label: 'Teklifi reddederim. Ticari çıkar için tıbbi öneride bulunmanın mesleki ihanet olduğunu savunurum.', weights: { workEthics: 1.0, integrity: 1.0 }, analysisInsight: 'Bilimsel Bağımsızlık.' },
      { label: 'Ürün faydalıysa kabul edebilirim; hem aileye yardım etmiş hem ek gelir elde ederim.', weights: { workEthics: -1.0, clinical: 0.5 }, analysisInsight: 'Yozlaşmaya Açık.' }
    ]
  },
  {
    id: 'eth_new_25', category: 'workEthics', type: 'radio',
    text: 'Geliştirdiğiniz müfredatı ayrılırken başka kurumda "benim eserim" diye kullanabilir misiniz?',
    weightedOptions: [
      { label: 'Hayır. Kurum kaynaklarıyla geliştirilen materyalin kurumsal mülkiyet olduğunu bilirim.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Fikri Mülkiyet Bilinci.' },
      { label: 'Fikir bana ait olduğu için emeğimi koruma hakkım olduğunu düşünür ve kullanırım.', weights: { workEthics: 0.2, integrity: 0.3 }, analysisInsight: 'Profesyonel Hırsızlık Riski.' }
    ]
  }
];
