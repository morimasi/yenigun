import { Question } from '../../types';

export const academicSkillsQuestions: Question[] = [
  {
    id: 'acad_1', category: 'technicalExpertise', type: 'radio',
    text: 'Disleksi şüphesi olan bir çocukta okuma hızını artırmak için hangi yolu seçersiniz?',
    weightedOptions: [
      { label: 'Metni hecelere bölerek mekanik okumayı mükemmelleştiririm; önce hatasızlık, sonra hız gelir.', weights: { clinical: 0.8, technicalExpertise: 1.0 }, analysisInsight: 'Teknik ve Adım Adım Yaklaşım.' },
      { label: 'Bütünsel okuma stratejileri ve tekerlemelerle akıcılığı (fluency) teşvik ederim; önce okumayı sevdirmek, sonra teknik gelir.', weights: { clinical: 1.0, pedagogicalAnalysis: 0.9 }, analysisInsight: 'Akışkan ve Süreç Odaklı Yaklaşım.' }
    ]
  },
  {
    id: 'acad_2', category: 'technicalExpertise', type: 'radio',
    text: 'Matematiksel muhakemede (problem çözme) zorlanan bir öğrencide ilk hamleniz nedir?',
    weightedOptions: [
      { label: 'Problemi resmetmesini (visual representation) isterim. Soyut sayıları somut nesnelere çevirerek zihnindeki haritayı görmeye çalışırım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Somutlaştırıcı ve Analitik.' },
      { label: 'Anahtar kelimeleri ezberletirim (örn: "toplam" kelimesi toplama yapılacağını anlatır). Formül bazlı bir çözüm yolu öğretirim.', weights: { clinical: 0.4, pedagogicalAnalysis: 0.5 }, analysisInsight: 'Geleneksel ve Ezber Odaklı.' }
    ]
  },
  {
    id: 'acad_3', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Öğrenci okuma-yazma ödevlerini yaparken çok yavaş ve sürekli silgi kullanıyor. Nasıl müdahale edersiniz?',
    weightedOptions: [
      { label: 'Hata yapmanın öğrenmenin bir parçası olduğunu anlatır, silgisini masadan kaldırırım. Süreçteki çabayı ödüllendiririm.', weights: { pedagogicalAnalysis: 1.0, sustainability: 1.0 }, analysisInsight: 'Hata Dostu ve Dayanıklılık Geliştirici.' },
      { label: 'Daha az ve daha kolay ödevler vererek başarı oranını artırırım. Özgüvenini kazanana kadar onu zorlamaktan kaçınırım.', weights: { pedagogicalAnalysis: 0.6, empathy: 0.9 }, analysisInsight: 'Koruyucu ve Kolaylaştırıcı.' }
    ]
  },
  {
    id: 'acad_4', category: 'technicalExpertise', type: 'radio',
    text: 'Sayı hissi (number sense) zayıf bir çocukta eldeli toplama öğretirken ne yaparsınız?',
    weightedOptions: [
      { label: 'Basamak tablosu ve onluk bloklarla "eldeyi" fiziksel olarak bir üst basamağa taşıtırım; olayın mantığını elleriyle hissettiririm.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Konsept ve Mantık Odaklı.' },
      { label: 'Kuralları tekerleme gibi öğretirim: "Sağdakini yaz, soldakini komşuya gönder." Kurallar oturdukça mantığın gelişeceğine inanırım.', weights: { clinical: 0.6, pedagogicalAnalysis: 0.7 }, analysisInsight: 'Prosedürel ve Kural Odaklı.' }
    ]
  },
  {
    id: 'acad_5', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Öğrenci bir metni okuyor ama "ne anladın?" dediğinizde cevap veremiyor. Stratejiniz nedir?',
    weightedOptions: [
      { label: 'Okuma sırasında ara sorular sorarak metni "parçalara" bölerim. Aktif okumayı ve tahmin etme becerisini geliştirmeye çalışırım.', weights: { pedagogicalAnalysis: 1.0, clinical: 0.9 }, analysisInsight: 'Metabilişsel Strateji Uzmanı.' },
      { label: 'Metni ben ona yüksek sesle okurum veya resimlerini gösteririm. İşitsel ve görsel hafızasını kullanarak anlamayı desteklerim.', weights: { pedagogicalAnalysis: 0.7, empathy: 0.8 }, analysisInsight: 'Destekleyici ve Telafi Edici.' }
    ]
  },
  {
    id: 'acad_6', category: 'technicalExpertise', type: 'radio',
    text: 'Yazı yazarken harfleri ters yazan (b/d karıştıran) bir vakada yaklaşımınız?',
    weightedOptions: [
      { label: 'Fiziksel ipuçları veririm (örn: "b" harfi karınlıdır, karnına dokun). Kinestetik hafızayı kullanarak farkı somutlaştırırım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Çok Duyulu Eğitim Uygulayıcısı.' },
      { label: 'Hatalı yazdığı harfi 20 kere yazdırarak görsel hafızasını zorlarım. Tekrarın yanlışı düzelteceğine inanırım.', weights: { clinical: 0.2, pedagogicalAnalysis: 0.3 }, analysisInsight: 'Yükleme Odaklı / Mekanik.' }
    ]
  },
  {
    id: 'acad_7', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Öğrenci çarpım tablosunu bir türlü ezberleyemiyor. Kararınız nedir?',
    weightedOptions: [
      { label: 'Ezberlemek yerine "sayıların dansını" (örüntüleri) öğretirim. Toplama ile çarpma arasındaki mantığı kurması için oyunlar tasarlarım.', weights: { pedagogicalAnalysis: 1.0, developmentOpenness: 0.9 }, analysisInsight: 'Mantıksal-Matematiksel Tasarımcı.' },
      { label: 'Ezberleyene kadar her gün bir kısmını sorarım, başaramazsa akademik seviyesinin bu olduğu kabul eder, hesap makinesi kullanmasına izin veririm.', weights: { pedagogicalAnalysis: 0.5, clinical: 0.4 }, analysisInsight: 'Pragmatist ama Teslimiyetçi.' }
    ]
  },
  {
    id: 'acad_8', category: 'technicalExpertise', type: 'radio',
    text: 'Fonolojik farkındalık çalışmasında (ses birleştirme) zorlanan çocukta ne yaparsınız?',
    weightedOptions: [
      { label: 'Sesleri "uzatarak" bağlarım (Aaaaa-Llll-Aaaaa gibi). Seslerin fiziksel olarak nasıl birleştiğini hissetmesi için model olurum.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Teknik Derinliği Yüksek Akışkan Uygulayıcı.' },
      { label: 'Harf kartlarını yan yana koyar ve isimlerini söylemesini isterim. Görsel bütünlüğe güvenerek sesleri birleştirmesini beklerim.', weights: { clinical: 0.5, pedagogicalAnalysis: 0.6 }, analysisInsight: 'Görsel Odaklı / Mekanik.' }
    ]
  },
  {
    id: 'acad_9', category: 'pedagogicalAnalysis', type: 'radio',
    text: 'Öğrenci akademik derslerde sürekli "bu ne işe yarayacak?" diye soruyor. Yanıtınız?',
    weightedOptions: [
      { label: 'Dersi hemen durdurur, o bilginin markette, sokakta veya evde nasıl hayat kurtaracağını simüle ederim. Fonksiyonelliği ispatlarım.', weights: { pedagogicalAnalysis: 1.0, sustainability: 0.9 }, analysisInsight: 'Hayat Odaklı ve Motivasyonel.' },
      { label: '"Sınavlarda ve okulda başarılı olmak için lazım" diyerek sistemi hatırlatırım ve müfredata sadık kalarak devam ederim.', weights: { pedagogicalAnalysis: 0.3, integrity: 0.5 }, analysisInsight: 'Sistemik ama Geleneksel.' }
    ]
  },
  {
    id: 'acad_10', category: 'technicalExpertise', type: 'radio',
    text: 'Sınıfta akademik bir materyal tasarlarken önceliğiniz nedir?',
    weightedOptions: [
      { label: 'Çocuğun tek başına kurcalayıp keşfedebileceği kadar basit ve estetik bir materyal olması.', weights: { clinical: 0.9, developmentOpenness: 1.0 }, analysisInsight: 'Keşif ve Otonomi Destekçisi.' },
      { label: 'Hata payını sıfıra indiren ve benim kontrolümde kullanılan çok yapılandırılmış bir materyal olması.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Kontrol ve Yapılandırma Odaklı.' }
    ]
  }
];