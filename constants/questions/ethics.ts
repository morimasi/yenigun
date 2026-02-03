
import { Question } from '../../types';

export const ethicsQuestions: Question[] = [
  // --- İŞ ETİĞİ & SINIR ---
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

  // --- KURUMSAL SADAKAT ---
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
