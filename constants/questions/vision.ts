
import { Question } from '../../types';

export const visionQuestions: Question[] = [
  {
    id: 'vis_adv_1', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumumuzun akademik vizyonunu 1 cümlede nasıl tanımlarsınız (İş görüşmesinden sonraki algınız)?',
    weightedOptions: [
      { label: 'Bilimsel Disiplin ve Yenilik: Veri temelli ilerleyen, klinik kaliteden ödün vermeyen bir akademi.', weights: { institutionalLoyalty: 1.0, fit: 1.0 }, analysisInsight: 'Kurumsal DNA Uyumu.' },
      { label: 'Güvenli Liman: Çocukların ve öğretmenlerin mutlu olduğu bir yuva.', weights: { empathy: 0.8, fit: 0.6 }, analysisInsight: 'Duygusal Odaklılık.' },
      { label: 'Ticari Başarı: Sektörde büyüyen ve kar eden bir işletme.', weights: { institutionalLoyalty: 0.2, personality: 1.0 }, analysisInsight: 'Pragmatik Bakış.' },
      { label: 'Belirsizlik: Henüz vizyonu tam anlayamadım.', weights: { fit: 0.0 }, analysisInsight: 'Düşük Gözlem Gücü.' }
    ]
  },
  {
    id: 'vis_adv_2', category: 'institutionalLoyalty', type: 'radio',
    text: 'Eski kurumunuzdan bir veli sizi aradı ve "Siz nereye biz oraya, oradaki kaydımızı silelim" dedi. Yanıtınız?',
    weightedOptions: [
      { label: 'Kurumsal Etik: "Güveniniz için teşekkürler ancak eski kurumunuzla olan bağınızı koparmanız etik olmaz. Mevcut kurumumun kayıt prosedürlerini takip edebilirsiniz" diyerek yönlendiririm.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Hukuki ve Etik Olgunluk.' },
      { label: 'Müşteri Kazanımı: "Hemen gelin, burası çok daha iyi" derim.', weights: { institutionalLoyalty: 0.5, fit: -0.8 }, analysisInsight: 'Sektörel Etik Zayıflığı.' },
      { label: 'Pasif: "Siz bilirsiniz" derim.', weights: { workEthics: 0.2 }, analysisInsight: 'Sorumluluktan Kaçınma.' },
      { label: 'Pazarlık: "Eski kurumda ne ödüyordunuz? Burada indirim yaptırırım" derim.', weights: { institutionalLoyalty: -1.0 }, analysisInsight: 'Ticari Odaklılık.' }
    ]
  },
  {
    id: 'vis_adv_3', category: 'institutionalLoyalty', type: 'radio',
    text: 'Sektördeki diğer kurumları nasıl takip edersiniz?',
    weightedOptions: [
      { label: 'Klinik Benchmark: Onların kullandığı yöntemleri bilimsel olarak analiz eder, bizden iyi oldukları yanları öğrenip kurumuma entegre etmeye çalışırım.', weights: { developmentOpenness: 1.0, leadership: 0.9 }, analysisInsight: 'Stratejik Zeka.' },
      { label: 'Rekabetçi: Onları kötüleyen açıklar ararım.', weights: { fit: -1.0 }, analysisInsight: 'Toksik Rekabet.' },
      { label: 'Sosyal Medya: Sadece Instagram hesaplarına bakarım.', weights: { developmentOpenness: 0.2 }, analysisInsight: 'Yüzeysel Gözlem.' },
      { label: 'İlgisizlik: Sadece kendi işime bakarım, başkası beni ilgilendirmez.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'Kapalı Zihin.' }
    ]
  },
  {
    id: 'vis_adv_4', category: 'institutionalLoyalty', type: 'radio',
    text: 'Bir eğitim seminerinde kurumunuzu temsil ederken nasıl davranırsınız?',
    weightedOptions: [
      { label: 'Marka Elçisi: Kurumun başarı hikayelerini ve bilimsel metodolojisini gururla anlatır, profesyonel bir imaj çizerim.', weights: { institutionalLoyalty: 1.0, fit: 1.0 }, analysisInsight: 'Sadık Temsilci.' },
      { label: 'Bireysel Reklam: Kendi kartvizitimi dağıtır, şahsi profilimi öne çıkarırım.', weights: { institutionalLoyalty: -1.0, personality: 1.5 }, analysisInsight: 'Narsistik Risk.' },
      { label: 'Sessiz: Arkada oturur, kimseyle konuşmam.', weights: { fit: 0.2 }, analysisInsight: 'Düşük Network Gücü.' },
      { label: 'Eleştirel: "Bizim kurumda aslında işler öyle yürümüyor" diyerek dert yanarım.', weights: { institutionalLoyalty: -2.0 }, analysisInsight: 'Aktif Sabotaj.' }
    ]
  },
  {
    id: 'vis_adv_5', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumda 5 yıl sonra kendinizi nerede görüyorsunuz?',
    weightedOptions: [
      { label: 'Akademik Direktör: Sistemin başında, yeni öğretmenleri eğiten ve kaliteyi denetleyen bir lider.', weights: { leadership: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek Potansiyel.' },
      { label: 'Uzman Terapist: Odamda çocuklarla sakin bir hayat.', weights: { sustainability: 0.9, leadership: 0.2 }, analysisInsight: 'Kararlı Uygulayıcı.' },
      { label: 'Kendi Ofisinde: Ayrılmış ve kendi işini kurmuş.', weights: { institutionalLoyalty: -2.0 }, analysisInsight: 'Kısa Vadeli Aday.' },
      { label: 'Belirsiz: "Kader ne gösterirse."', weights: { personality: 0.0 }, analysisInsight: 'Hedefsiz Profil.' }
    ]
  },
  {
    id: 'vis_adv_6', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurum müdürü size bir görev verdi ama çok saçma buldunuz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Profesyonel İtiraz: Gerekçelerimi özelde anlatır, ortak bir akıl ararım. Karar değişmezse kurumsal disipline uyarım.', weights: { institutionalLoyalty: 1.0, leadership: 0.8 }, analysisInsight: 'Yapıcı Disiplin.' },
      { label: 'Körü körüne itaat: "Müdür dediyse doğrudur" deyip sorgulamam.', weights: { fit: 0.7, leadership: -0.5 }, analysisInsight: 'Bireysel İnisiyatif Yoksunluğu.' },
      { label: 'Sabotaj: Yapıyormuş gibi yapıp yapmam.', weights: { workEthics: -2.0, institutionalLoyalty: -1.0 }, analysisInsight: 'Sinsi İhlal.' },
      { label: 'Tepki: "Ben bunu yapmam" deyip kapıyı çarparım.', weights: { personality: -1.0, fit: -1.0 }, analysisInsight: 'Düşük EQ.' }
    ]
  },
  {
    id: 'vis_adv_7', category: 'institutionalLoyalty', type: 'radio',
    text: 'Sizce bir rehabilitasyon merkezinin en büyük düşmanı nedir?',
    weightedOptions: [
      { label: 'Akademik Statüko: Kendini yenilemeyen, bilimsellikten uzaklaşan hantal yapı.', weights: { developmentOpenness: 1.0, clinical: 0.9 }, analysisInsight: 'İnovatif Bakış.' },
      { label: 'Ekonomik Kriz: Maddi yetersizlik.', weights: { personality: 0.6 }, analysisInsight: 'Realist.' },
      { label: 'Veli Şikayeti: Ailelerin memnuniyetsizliği.', weights: { fit: 0.8 }, analysisInsight: 'Müşteri Odaklı.' },
      { label: 'Rakipler: Diğer kurumların bizi geçmesi.', weights: { personality: 0.4 }, analysisInsight: 'Rekabetçi.' }
    ]
  },
  {
    id: 'vis_adv_8', category: 'institutionalLoyalty', type: 'radio',
    text: 'Kurumda bir yolsuzluk (Örn: Seans sayıları ile oynanması) fark ettiniz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Üst Kurul Bildirimi: Kurum sahibine veya en üst otoriteye durumu belgeleriyle raporlarım. Mesleki onurum her şeyden üstündür.', weights: { workEthics: 1.0, institutionalLoyalty: 0.8 }, analysisInsight: 'Yüksek Etik Standart.' },
      { label: 'Ortaklık: "Bana da pay düşer mi?" diye bakarım.', weights: { workEthics: -10.0 }, analysisInsight: 'Kritik Güvenlik Riski.' },
      { label: 'Korku: "Beni de yakarlar" deyip susarım.', weights: { fit: 0.2, sustainability: -0.5 }, analysisInsight: 'Pasif Korkak.' },
      { label: 'İstifa: Sessizce ayrılırım.', weights: { institutionalLoyalty: -0.5 }, analysisInsight: 'Düşük Sorumluluk.' }
    ]
  },
  {
    id: 'vis_adv_9', category: 'institutionalLoyalty', type: 'radio',
    text: 'Eğitimde teknoloji (Yapay Zeka, VR) kullanımı hakkında ne düşünüyorsunuz?',
    weightedOptions: [
      { label: 'Stratejik Araç: İnsan dokunuşunu destekleyen, veri analizini hızlandıran kritik bir kaldıraç olarak görüyorum.', weights: { developmentOpenness: 1.0, leadership: 0.9 }, analysisInsight: 'Geleceğin Uzmanı.' },
      { label: 'Tehdit: Öğretmenin yerini alacağını düşünüp korkuyorum.', weights: { developmentOpenness: -0.5 }, analysisInsight: 'Teknofobik.' },
      { label: 'Oyuncak: Sadece çocukları eğlendirmek için kullanılır.', weights: { clinical: 0.2 }, analysisInsight: 'Sığ Bakış.' },
      { label: 'Gereksiz: Özel eğitimde sadece fiziksel temas yeterlidir.', weights: { developmentOpenness: -1.0 }, analysisInsight: 'Gelenekselci Direnç.' }
    ]
  },
  {
    id: 'vis_adv_10', category: 'institutionalLoyalty', type: 'radio',
    text: 'Bu mülakatın sonunda kuruma ne katacağınızı düşünüyorsunuz?',
    weightedOptions: [
      { label: 'Sistemik Değer: Sadece bir öğretmen değil, kurumun klinik kalitesini ve bilimsel itibarını yükseltecek bir ortak.', weights: { leadership: 1.0, fit: 1.0 }, analysisInsight: 'Yüksek Özgüven ve Aidiyet.' },
      { label: 'Emek: Çok çalışıp çocuklara faydalı olacağım.', weights: { empathy: 0.9, fit: 0.7 }, analysisInsight: 'Çalışkan Uygulayıcı.' },
      { label: 'Uyum: Hiç sorun çıkarmadan söyleneni yaparım.', weights: { fit: 1.0 }, analysisInsight: 'Uyumlu Personel.' },
      { label: 'Para: Kuruma çok veli kazandırırım.', weights: { institutionalLoyalty: 0.1 }, analysisInsight: 'Ticari Odak.' }
    ]
  }
];
