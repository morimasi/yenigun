
import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  {
    id: 'eth_p1_1', category: 'workEthics', type: 'radio',
    text: 'Ağır bir ihmal şüpheniz var ancak kanıtınız yetersiz. Veli ise kuruma yüksek finansal katkı sağlayan ve nüfuzlu bir figür. Yol haritanız ne olur?',
    weightedOptions: [
      { label: 'Yasal Bildirim Yükümlülüğü (Mandatory Reporting): Maddi veya kurumsal sürdürülebilirlik kaygılarını tamamen dışlayarak, yasal prosedür uyarınca durumu "Çocuk Koruma" birimlerine objektif verilerle derhal raporlarım.', weights: { workEthics: 1.0, clinical: 0.9 }, analysisInsight: 'Etik Cesaret: Çocuğun üstün yararını her türlü kurumsal/finansal gücün önünde tutma.' },
      { label: 'Kurumsal Hiyerarşik Filtreleme: Durumu öncelikle kurum yönetimi ve kurum psikoloğu ile paylaşır, kurumsal bir kriz stratejisi belirlenmesini beklerim; bireysel inisiyatifle kurumu yasal risklere açık bırakmam.', weights: { workEthics: 0.7, institutionalLoyalty: 1.0 }, analysisInsight: 'Sistem Uyumu: Profesyonel sorumluluğu ekip bilinciyle paylaşma ve kurumsal zırhı kullanma.' },
      { label: 'Klinik Veri Toplama Süreci: Şüpheyi kesin kanıta dönüştürmek amacıyla 2 haftalık yoğun vaka analizi ve fiziksel izlem süreci başlatırım; dosyayı tam netleştirmeden yapılacak bir bildirimin etik risklerini gözetirim.', weights: { workEthics: 0.6, sustainability: 0.8 }, analysisInsight: 'Klinik Titizlik: Hatalı suçlama riskine karşı veri odaklı hareket etme tercihi.' },
      { label: 'Terapötik Müdahale ve Onarım: Veliyi yargılamadan görüşmeye davet eder, ev içi dinamikleri "aile desteği" bağlamında sorgular ve aileyi psikolojik destek sürecine ikna ederek sorunu içeriden çözmeye çalışırım.', weights: { workEthics: 0.5, empathy: 1.0 }, analysisInsight: 'Diplomatik Uzlaşma: Bildirimden önce "onarım ve ikna" yoluyla koruyucu çevre oluşturma eğilimi.' }
    ]
  },
  {
    id: 'eth_p1_5', category: 'workEthics', type: 'radio',
    text: 'Veli, çocuğuna hekim tarafından reçete edilen bir ilacı (Örn: Risperdal) kendi inisiyatifiyle kestiğini size gururla anlattı. Tavrınız?',
    weightedOptions: [
      { label: 'Tıbbi Sınır Koruma (Liability Management): "Ben bir tıp doktoru değilim ve bu karar hayati riskler barındırır. Bu durumu derhal hekiminizle paylaşmalısınız, aksi takdirde etik olarak eğitim sürecini askıya alabiliriz" uyarısını yaparım.', weights: { workEthics: 1.0, sustainability: 0.7 }, analysisInsight: 'Hukuki Bilinç: Yetki sınırlarını net çizme ve kurumu/çocuğu tıbbi riskten koruma.' },
      { label: 'Veri Odaklı İkna Stratejisi: Veliyi doğrudan yargılamam; ancak "İlaç değişikliği sonrası davranış verilerindeki X oranındaki artışı" grafiklerle sunarak, kararın klinik zararlarını velinin kendi gözlemiyle keşfetmesini sağlarım.', weights: { workEthics: 0.8, clinical: 1.0 }, analysisInsight: 'Klinik Diplomasi: Veriyi veliyi manipüle etmek yerine rasyonel bir ikna aracına dönüştürme.' },
      { label: 'Empatik Dinleme ve Destek: Velinin ilaca karşı olan kaygılarını ve yan etki endişelerini dinler, "Sizi anlıyorum, doğal yöntemler ve yoğun eğitim bazen daha kalıcı olabilir" diyerek velinin kararıyla terapötik ittifak kurarım.', weights: { workEthics: -0.5, empathy: 0.9 }, analysisInsight: 'Riskli İttifak: Uzmanlık alanını aşarak hekim kararını veli lehine esnetme eğilimi.' },
      { label: 'Hiyerarşik Raporlama: Durumu kurum psikoloğuna ve yönetimine "Tıbbi İhmal/Risk" notuyla bildirir, veliyle bu konuda kişisel bir tartışmaya girmeden kurumsal bir bildirim yapılmasını sağlarım.', weights: { workEthics: 0.9, institutionalLoyalty: 1.0 }, analysisInsight: 'Kurumsal Disiplin: Sorunu hiyerarşik kanallar üzerinden çözme ve kişisel çatışmadan kaçınma.' }
    ]
  }
];
