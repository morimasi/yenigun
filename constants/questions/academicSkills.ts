
import { Question } from '../../types';

export const academicSkillsQuestions: Question[] = [
  {
    id: 'acad_skill_1',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Öğrenci okuma sırasında kelimelerin sonundaki ekleri sürekli yutuyor veya uyduruyorsa, bu durumun nöro-dilbilimsel karşılığı nedir?',
    weightedOptions: [
      { 
        label: 'Görsel işlemleme hızı, işitsel işlemlemeden daha öndedir; tahmin ederek okuma (guessing) eğilimi vardır.', 
        weights: { technicalExpertise: 1.0, clinical: 0.9 },
        analysisInsight: 'Klinik hata analizi yeteneği yüksek.'
      },
      { 
        label: 'Öğrencinin genel bir dikkat eksikliği vardır, kelimenin sonuna kadar odaklanamıyordur.', 
        weights: { technicalExpertise: 0.4, pedagogicalAnalysis: 0.6 },
        analysisInsight: 'Basit ve genel bir açıklama tercihi.'
      }
    ]
  },
  {
    id: 'acad_skill_2',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Matematiksel muhakemede "Sayı Hissi" (Number Sense) zayıf olan bir çocukta işlem öğretimine nereden başlanmalıdır?',
    weightedOptions: [
      { 
        label: 'Sembolik sayılardan önce, nesne grupları üzerinden "Subitizing" (şipşak sayılama) çalışmalarıyla başlarım.', 
        weights: { technicalExpertise: 1.0, pedagogicalAnalysis: 1.0 },
        analysisInsight: 'Bilimsel hiyerarşi odaklı.'
      },
      { 
        label: 'Ritmik saymaları ezberleterek işlem hızı kazanmasını sağlarım.', 
        weights: { technicalExpertise: 0.2, clinical: 0.3 },
        analysisInsight: 'Ezberci ve geleneksel yöntem eğilimi.'
      }
    ]
  },
  {
    id: 'acad_skill_3',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Disleksi müdahalesinde "Orton-Gillingham" yaklaşımının temel prensibi olan "Çok Duyulu Eğitim" (Multisensory) pratikte nasıl uygulanır?',
    weightedOptions: [
      { 
        label: 'Ses-harf ilişkisini aynı anda görerek, duyarak ve havada/kumda yazarak (VAKT) eşleştiririm.', 
        weights: { technicalExpertise: 1.0, clinical: 1.0 },
        analysisInsight: 'EBP (Evidence Based Practice) hakimiyeti.'
      },
      { 
        label: 'Aynı kelimeyi farklı renkli kalemlerle defalarca yazdırarak görsel hafızayı güçlendiririm.', 
        weights: { technicalExpertise: 0.5, pedagogicalAnalysis: 0.7 },
        analysisInsight: 'Yüzeysel çok duyulu uygulama bilgisi.'
      }
    ]
  },
  {
    id: 'acad_skill_4',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Öğrenci 2 basamaklı sayılarda eldeli toplamayı kağıtta yapıyor ama zihinden yapamıyorsa hangi bilişsel alan desteklenmelidir?',
    weightedOptions: [
      { 
        label: 'Çalışma Belleği (Working Memory) ve sayısal manipülasyon becerileri.', 
        weights: { technicalExpertise: 1.0, clinical: 0.9 },
        analysisInsight: 'Nöro-kognitif süreç analizi.'
      },
      { 
        label: 'Onluk bozma kurallarının daha fazla tekrar edilmesi.', 
        weights: { technicalExpertise: 0.3, pedagogicalAnalysis: 0.4 },
        analysisInsight: 'Kural odaklı, kognitif süreçten uzak.'
      }
    ]
  },
  {
    id: 'acad_skill_5',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Okuduğunu anlama çalışmalarında "SQ3R" veya benzeri stratejilerin kullanım amacı nedir?',
    weightedOptions: [
      { 
        label: 'Metni mekanik okumadan çıkarıp, aktif bir sorgulama ve yapılandırma sürecine dönüştürmek.', 
        weights: { pedagogicalAnalysis: 1.0, technicalExpertise: 0.9 },
        analysisInsight: 'Üst-bilişsel strateji bilinci.'
      },
      { 
        label: 'Öğrencinin okuma hızını artırarak metni daha kısa sürede bitirmesini sağlamak.', 
        weights: { pedagogicalAnalysis: 0.2, clinical: 0.1 },
        analysisInsight: 'Hatalı pedagojik hedefleme.'
      }
    ]
  },
  {
    id: 'acad_skill_6',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Diskalkuli tanısı olan bir vakanın saatleri öğrenememesi durumunda izlenecek en efektif yol hangisidir?',
    weightedOptions: [
      { 
        label: 'Zaman kavramını lineer bir sayı doğrusuna dökerek (Linear Time) somutlaştırmak.', 
        weights: { technicalExpertise: 1.0, clinical: 1.0 },
        analysisInsight: 'Görsel-uzamsal somutlaştırma uzmanlığı.'
      },
      { 
        label: 'Dijital saatleri ezberleterek analog saatleri zamana bırakmak.', 
        weights: { technicalExpertise: 0.4, sustainability: 0.6 },
        analysisInsight: 'Pragmatik ama kökten çözüm sunmayan yaklaşım.'
      }
    ]
  },
  {
    id: 'acad_skill_7',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Fonolojik farkındalıkta "Ses Birleştirme" (Blending) becerisi "Ses Analizi" (Segmenting) becerisinden neden önce çalışılmalıdır?',
    weightedOptions: [
      { 
        label: 'Birleştirme, okumanın; analiz ise yazmanın temelidir ve sentez yeteneği bilişsel olarak analize zemin hazırlar.', 
        weights: { technicalExpertise: 1.0, pedagogicalAnalysis: 0.9 },
        analysisInsight: 'Gelişimsel hiyerarşi bilgisi.'
      },
      { 
        label: 'Ses birleştirme oyunları daha eğlenceli olduğu için çocuğun motivasyonu yükselir.', 
        weights: { technicalExpertise: 0.3, empathy: 0.8 },
        analysisInsight: 'Duygusal önceliklendirme, teknik eksiklik.'
      }
    ]
  },
  {
    id: 'acad_skill_8',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Yazılı anlatımda "Zihin Haritalama" (Mind Mapping) tekniğinin özel öğrenme güçlüğünde temel işlevi nedir?',
    weightedOptions: [
      { 
        label: 'Ardıl işlemleme zayıflığını, eşzamanlı görselleştirme ile kompanse etmek.', 
        weights: { technicalExpertise: 1.0, clinical: 0.9 },
        analysisInsight: 'Kompansatuar strateji hakimiyeti.'
      },
      { 
        label: 'Yazım kuralları ve imla hatalarını minimize etmek.', 
        weights: { technicalExpertise: 0.2, pedagogicalAnalysis: 0.4 },
        analysisInsight: 'Yanlış fonksiyonel atıf.'
      }
    ]
  },
  {
    id: 'acad_skill_9',
    category: 'pedagogicalAnalysis',
    type: 'radio',
    text: 'Matematik problemlerini okuyan ama çözemeyen bir öğrencide "Dilsel Karmaşıklık" mı yoksa "Sayısal Mantık" mı sorundur? Nasıl ayrıştırırsınız?',
    weightedOptions: [
      { 
        label: 'Aynı problemi sadece sayısal ifadelerle (denklem olarak) sunarım; yapabiliyorsa sorun dilsel/semantiktir.', 
        weights: { technicalExpertise: 1.0, pedagogicalAnalysis: 1.0 },
        analysisInsight: 'Diferansiyel tanı ve değerlendirme becerisi.'
      },
      { 
        label: 'Öğrenciye problemi yüksek sesle okuturum, hata yapmıyorsa mantık problemi olduğunu varsayarım.', 
        weights: { technicalExpertise: 0.5, clinical: 0.4 },
        analysisInsight: 'Yetersiz değerlendirme protokolü.'
      }
    ]
  },
  {
    id: 'acad_skill_10',
    category: 'technicalExpertise',
    type: 'radio',
    text: 'Okuma akıcılığını (Fluency) ölçerken sadece "Doğru Kelime Sayısı"na mı bakılmalıdır?',
    weightedOptions: [
      { 
        label: 'Hayır; prosodi (vurgu/tonlama) ve anlama düzeyi de akıcılığın ayrılmaz parçasıdır.', 
        weights: { technicalExpertise: 1.0, clinical: 1.0 },
        analysisInsight: 'Bütüncül değerlendirme vizyonu.'
      },
      { 
        label: 'Evet; hız ve doğruluk oranı klinik raporlama için yeterli bir veridir.', 
        weights: { technicalExpertise: 0.3, pedagogicalAnalysis: 0.5 },
        analysisInsight: 'Mekanik ve kısıtlı bakış açısı.'
      }
    ]
  }
];
