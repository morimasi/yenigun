
import { Question, Branch } from '../../types';

export const languageSpeechQuestions: Question[] = [
  {
    id: 'slp_artic_1',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Artikülasyon terapisinde "Motor Öğrenme" prensiplerine göre geri bildirim sıklığı nasıl ayarlanmalıdır?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { 
        label: 'Edinim aşamasında %100, kalıcılık aşamasında ise azalan geri bildirim veririm.', 
        weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 },
        analysisInsight: 'Motor öğrenme teorisine hakim.'
      },
      { 
        label: 'Çocuğun motivasyonunu korumak için her doğru tepkide coşkulu ödül veririm.', 
        weights: { clinical: 0.5, empathy: 1.0 },
        analysisInsight: 'Pedagojik motivasyon odaklı, teknik derinlik kısıtlı.'
      }
    ]
  },
  {
    id: 'slp_2',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Hızlı-Bozuk Konuşma (Cluttering) ile Kekemelik (Stuttering) arasındaki en temel ayırıcı tanı nedir?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Cluttering vakasında farkındalık düşüktür ve konuşma hızı anormalliği baskındır.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Ayırıcı tanı yetisi yüksek.' },
      { label: 'Kekemelik vakasında çocuk konuşmaktan korkmaz, Cluttering vakasında korkar.', weights: { clinical: 0.2, technicalExpertise: 0.3 }, analysisInsight: 'Temel klinik bilgi hatası.' }
    ]
  },
  {
    id: 'slp_3',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Sözel olmayan (non-verbal) bir otizm vakasında PECS (Resim Değiş Tokuşuna Dayalı İletişim Sistemi) 1. evre hedefi nedir?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Resmi uzatıp partnerine vererek "İletişim Başlatma" (Initiation) becerisini kazanmak.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Fonksiyonel iletişim protokollerine hakim.' },
      { label: 'İstediği nesnenin resmini göstererek isimlendirme (labeling) yapmak.', weights: { clinical: 0.6, pedagogicalAnalysis: 0.7 }, analysisInsight: 'Evreler arası metodolojik karışıklık.' }
    ]
  },
  {
    id: 'slp_4',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Gecikmiş Dil ve Konuşma vakasında "Genişletme" (Extension) stratejisi nasıl uygulanır?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Çocuğun "Araba" demesi üzerine "Evet, kırmızı araba gidiyor" diyerek yeni bilgi eklemek.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Dil edinim stratejilerini doğru uyguluyor.' },
      { label: 'Çocuğun "Araba" demesi üzerine "Hadi kamyon da de" diyerek yeni kelime talep etmek.', weights: { clinical: 0.4, empathy: 0.6 }, analysisInsight: 'Zorlayıcı ve talepkar müdahale.' }
    ]
  },
  {
    id: 'slp_5',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Apraksi (CAS) şüphesi olan bir çocukta artikülasyon terapisinden farklı olarak neye odaklanılmalıdır?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Seslerin tek tek üretiminden ziyade, hece geçişleri ve motor planlama (sequencing) çalışmalarına.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Nörojenik konuşma bozuklukları bilgisi tam.' },
      { label: 'Ağız kaslarını güçlendirmek için bol bol üfleme ve dil egzersizlerine.', weights: { clinical: 0.1, integrity: 0.4 }, analysisInsight: 'Bilimsel olmayan (NSOME) yaklaşımlara eğilimli.' }
    ]
  },
  {
    id: 'slp_6',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Vaka seans sırasında sürekli eko (Ekolali) yapıyorsa, bu durumu iletişime nasıl çevirirsiniz?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Ekolaliyi bir iletişim işlevi olarak görür, "Mitigation" (yumuşatma) yöntemiyle anlamlı cümlelere dönüştürürüm.', weights: { clinical: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Modern ve kabul edici klinik duruş.' },
      { label: 'Çocuğu susturur ve "beni dinle" diyerek doğru cümleyi tekrar etmesini beklerim.', weights: { clinical: 0.3, personality: 0.5 }, analysisInsight: 'Davranışçı ama esnek olmayan yaklaşım.' }
    ]
  },
  {
    id: 'slp_7',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Afazi vakasında "Melodik İntonasyon Terapisi" hangi durumlarda önceliklidir?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Sol hemisfer hasarı ağır olan, anlaması iyi ama üretimi çok kısıtlı vakalarda.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Nöro-dilbilimsel haritalama yetisi.' },
      { label: 'Kelime hazinesini geliştirmek ve yeni nesne isimleri öğretmek için.', weights: { clinical: 0.5, technicalExpertise: 0.4 }, analysisInsight: 'Yöntem-amaç eşleşmesi zayıf.' }
    ]
  },
  {
    id: 'slp_8',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Ses terapisinde (Voice Therapy) "Hijyen Eğitimi" ilk adım mıdır?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Evet; ses kısıklığına neden olan çevresel ve davranışsal faktörler düzelmeden egzersiz başarılı olmaz.', weights: { clinical: 1.0, sustainability: 0.9 }, analysisInsight: 'Sistemik vaka yönetimi.' },
      { label: 'Hayır; doğrudan ses tellerini güçlendiren egzersizlerle başlanmalıdır.', weights: { clinical: 0.4, technicalExpertise: 0.6 }, analysisInsight: 'Etyolojiye değil semptoma odaklı.' }
    ]
  },
  {
    id: 'slp_9',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Anlamlı konuşması olmayan 4 yaşındaki bir vakada, önce "İsteme" (Manding) mi yoksa "İsimlendirme" (Tacting) mi çalışılır?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'İsteme (Mand); çünkü çocuğun kendi ihtiyacı için dili kullanması en güçlü pekiştireçtir.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'İşlevsel dil edinim sırasını biliyor.' },
      { label: 'İsimlendirme (Tact); çünkü kelime hazinesi olmadan bir şey isteyemez.', weights: { clinical: 0.4, pedagogicalAnalysis: 0.5 }, analysisInsight: 'Akademik ama işlevsiz pedagoji.' }
    ]
  },
  {
    id: 'slp_10',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Pragmatik (Sosyal İletişim) bozukluğu olan bir çocukta "Göz Kontağı" kurdurmak birincil hedef mi olmalıdır?',
    requiredBranch: [Branch.DilKonusma],
    weightedOptions: [
      { label: 'Hayır; iletişim niyeti ve ortak dikkat göz kontağından daha değerlidir, göz kontağı doğal bir sonuçtur.', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Vaka merkezli ve hümanist yaklaşım.' },
      { label: 'Evet; göz kontağı kurmayan çocukla hiçbir akademik ders işlenemez.', weights: { clinical: 0.5, personality: 0.8 }, analysisInsight: 'Otoriter ve şekilci eğitim anlayışı.' }
    ]
  }
];
