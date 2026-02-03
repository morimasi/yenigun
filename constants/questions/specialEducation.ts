
import { Question, Branch } from '../../types';

export const specialEducationQuestions: Question[] = [
  {
    id: 'sp_ed_aba_1',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Öğrenci "Sönme Patlaması" (Extinction Burst) halindeyken veli müdahaleyi durdurmanızı isterse klinik tavrınız ne olur?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { 
        label: 'Klinik veri grafiğini göstererek sürecin normal olduğunu açıklar ve seansa devam ederim.', 
        weights: { clinical: 1.0, ethics: 1.0 },
        analysisInsight: 'Metodolojik sadakat ve veri odaklılık yüksek.'
      },
      { 
        label: 'Velinin kaygısını önceliklendirip seansı o anlık daha sakin bir aktiviteye çekerim.', 
        weights: { clinical: 0.6, empathy: 0.9 },
        analysisInsight: 'Müşteri memnuniyeti odaklı, klinik risk toleransı düşük.'
      }
    ]
  },
  {
    id: 'sp_ed_bep_1',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'BEP (Bireyselleştirilmiş Eğitim Programı) hazırlarken "Fonksiyonel Analiz" verisi eksikse nasıl ilerlersiniz?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { 
        label: 'Hedefleri yazmayı durdurur, 1 hafta boyunca ABC kaydı tutulmasını talep ederim.', 
        weights: { clinical: 1.0, technicalExpertise: 1.0 },
        analysisInsight: 'Bilimsel temel arayışı üst düzey.'
      },
      { 
        label: 'Geçmiş raporlara dayanarak tahmini hedefler yazar, uygulama sırasında revize ederim.', 
        weights: { clinical: 0.4, sustainability: 0.7 },
        analysisInsight: 'Pragmatik ama klinik risk barındıran yaklaşım.'
      }
    ]
  },
  {
    id: 'sp_ed_3',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'FCT (İşlevsel İletişim Eğitimi) sırasında çocuğun vurduğu an "hayır vurma" derseniz hangi teknik hatayı yapmış olursunuz?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'İstenmeyen davranışı sözel olarak pekiştirmiş (attention) ve sönme prosedürünü bozmuş olurum.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Davranış analizi mekanizmalarına tam hakim.' },
      { label: 'Çocuğun özgüvenini kırmış ve terapötik bağı zedelemiş olurum.', weights: { clinical: 0.4, empathy: 0.8 }, analysisInsight: 'Klinik veri yerine duygusal yorumlama eğilimi.' }
    ]
  },
  {
    id: 'sp_ed_4',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'DTT (Ayrık Denemelerle Öğretim) sırasında öğrenci 3 kez üst üste yanlış tepki verirse ne yaparsınız?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Hemen hata düzeltme (Error Correction) ve daha yoğun bir ipucu (Prompt) seviyesine geçerim.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Hatasız öğretim protokolü bilgisi yüksek.' },
      { label: 'Öğrencinin yorulduğunu düşünüp ara verir, başka bir beceriye geçerim.', weights: { clinical: 0.5, sustainability: 0.6 }, analysisInsight: 'Yönetimsel kaçınma stratejisi.' }
    ]
  },
  {
    id: 'sp_ed_5',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Bir davranışın "işlevini" belirlemek için kullanılan en güvenilir yöntem hangisidir?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Doğrudan gözlem ve ABC (A-B-C) verilerinin sistematik analizi.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Veri odaklı karar verme mekanizması güçlü.' },
      { label: 'Veli ile yapılan mülakat ve çocuğun geçmiş hikayesi.', weights: { clinical: 0.6, empathy: 0.7 }, analysisInsight: 'Sezgisel ve dolaylı veri tercihi.' }
    ]
  },
  {
    id: 'sp_ed_6',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Öğrenci bir beceriyi sınıfta yapıyor ama bahçede yapamıyor. Bu durum hangi sürecin eksikliğidir?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Genelleme (Generalization) eğitiminin programlanmamış olması.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Klinik süreçlerin bütünlüğünü kavrıyor.' },
      { label: 'Bahçedeki dış uyaranların çocuğun dikkatini dağıtması.', weights: { clinical: 0.4, sustainability: 0.5 }, analysisInsight: 'Dışsal faktörlere odaklı, metodolojik eksikliği görmüyor.' }
    ]
  },
  {
    id: 'sp_ed_7',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Pekiştirme tarifelerinde "Değişken Aralıklı" (Variable Interval) tarifeyi neden kullanırız?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Davranışın kalıcılığını (Maintenance) artırmak ve sönmeye karşı direnç oluşturmak için.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'İleri düzey ABA bilgisi.' },
      { label: 'Çocuğun ne zaman ödül alacağını bilmemesi ve sürekli heyecanlı kalması için.', weights: { clinical: 0.5, empathy: 0.6 }, analysisInsight: 'Düşük teknik terminoloji kullanımı.' }
    ]
  },
  {
    id: 'sp_ed_8',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Ağır düzeyde otizmi olan bir vakanın seansında "Gömülü Öğretim" (Embedded Teaching) ne zaman tercih edilmelidir?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Çocuğun doğal motivasyonunu kullanmak ve sosyal etkileşim başlatmak istendiğinde.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Doğal öğretim yaklaşımlarına hakim.' },
      { label: 'Masa başı eğitimde çocuk çok ağladığı ve tepki gösterdiği zamanlarda.', weights: { clinical: 0.6, sustainability: 0.8 }, analysisInsight: 'Kaçınma temelli pedagoji.' }
    ]
  },
  {
    id: 'sp_ed_9',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Öğrenciye bir özbakım becerisi öğretirken (örn: El yıkama) hangi zincirleme (Chaining) yöntemi daha hızlı sonuç verir?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Vakanın performans kaydına göre İleriye veya Geriye Zincirleme kararı verilmeli, tek bir standart yoktur.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Bireyselleştirilmiş müdahale vizyonu.' },
      { label: 'Tüm adımlar aynı anda öğretilmeli (Total Task Presentation).', weights: { clinical: 0.7, sustainability: 0.7 }, analysisInsight: 'Genellemeci yaklaşım.' }
    ]
  },
  {
    id: 'sp_ed_10',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Veri toplarken "Süre Kaydı" (Duration Recording) yerine "Fırsat Temelli" (Trial-by-trial) veri ne zaman alınır?',
    requiredBranch: [Branch.OzelEgitim],
    weightedOptions: [
      { label: 'Davranışın başlangıcı ve bitişi netse ve belirli bir uyaran sonrası gerçekleşiyorsa.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Ölçme ve değerlendirme hassasiyeti tam.' },
      { label: 'Öğretmenin seans sırasında çok yoğun olduğu ve detaylı not tutamadığı durumlarda.', weights: { clinical: 0.3, integrity: 0.2 }, analysisInsight: 'Operasyonel kolaylığı klinik doğrunun önüne koyuyor.' }
    ]
  }
];
