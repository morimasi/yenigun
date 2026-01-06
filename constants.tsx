
import { FormStep } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Kimlik Katmanı', description: 'Profesyonel kimlik ve branş verileri' },
  { id: 'logic_literacy', title: 'Akademik Keskinlik', description: 'İleri düzey mantık ve metin analizi' },
  { id: 'professional_cases', title: 'Klinik Karar Mekanizması', description: 'Etik ikilemler ve kriz anı yönetimi (Gerçekçi vakalar)' },
  { id: 'psychological_integrity', title: 'Psikolojik Bütünlük', description: 'Stres altında otantik tepkiler ve sınır yönetimi' },
  { id: 'social_diplomacy', title: 'Kurumsal Diplomasi', description: 'Zorlu veli ve ekip içi çatışma senaryoları' },
  { id: 'development', title: 'Öğrenme Çevikliği', description: 'Hata kabulü ve gelişim kapasitesi' }
];

export const MOCK_QUESTIONS = {
  logic_literacy: [
    { 
      id: 'math2', 
      text: '1, 3, 6, 10, 15, ? dizisindeki bir sonraki sayı nedir?', 
      type: 'radio', 
      options: ['19', '20', '21', '22'] 
    },
    { 
      id: 'read1', 
      text: '"Eğitimde adalet, herkese aynı şeyi vermek değil, herkese ihtiyacı olanı vermektir." Bu ilkeye göre; 3 öğrenciden biri ağır düzey, biri orta, biri hafif düzey OSB ise ve elinizde sadece 1 adet tablet varsa, en verimli kullanım hangisidir?', 
      type: 'radio', 
      options: [
        'Sırayla eşit sürelerle kullandırmak (Eşitlikçi)', 
        'En ağır düzeydeki çocuğa beceri öğretimi için ayırmak (İhtiyaç odaklı)', 
        'Tableti hiç kullanmayıp diğer materyallere odaklanmak (Çatışmadan kaçınma)', 
        'Ödül olarak en başarılı olana vermek (Motivasyon odaklı)'
      ] 
    }
  ],
  professional_cases: [
    {
      id: 'case_1',
      text: 'Seans sırasında öğrenciniz size sert bir şekilde vurdu ve kolunuzda morluk oluştu. O sırada camdan sizi izleyen veli panikle içeri girmeye çalışıyor. İlk hamleniz ne olur?',
      type: 'radio',
      options: [
        'Veliyi hemen içeri alıp sakinleştiririm ve durumu anlatırım.',
        'Kapıyı kilitleyip öğrenciyle güvenli mesafeye geçer, veliye "her şey yolunda" işareti yapıp seansı bitirmeyi beklerim.',
        'Seansı hemen sonlandırıp öğrenciyi veliye teslim eder, yaralandığımı gösteririm.',
        'Öğrenciye davranışın yanlış olduğunu o an fiziksel bir müdahaleyle (elini tutarak) gösteririm.'
      ]
    },
    {
      id: 'case_2',
      text: 'Müdürünüz, etik olarak uygun bulmadığınız ama kurumun kar etmesini sağlayacak bir eğitim paketini veliye "şiddetle tavsiye etmenizi" istedi. Tavrınız hangisi olur?',
      type: 'radio',
      options: [
        'Müdürümün talimatını uygularım, sorumluluk ondadır.',
        'Velinin bütçesini sarsmayacaksa tavsiye ederim.',
        'Veliye paketin artılarını ve eksilerini dürüstçe anlatır, kararı ona bırakırım (Müdürün isteğini tam yapmamış olurum).',
        'Bu durumu kabul edemeyeceğimi belirterek istifamı değerlendiririm.'
      ]
    }
  ],
  psychological_integrity: [
    {
      id: 'stress_1',
      text: 'Hangi durum sizi daha çok demoralize eder?',
      type: 'radio',
      options: [
        'Çok emek verdiğim bir öğrencinin gerileme göstermesi.',
        'Velinin yaptığım işi değersizleştiren bir yorum yapması.',
        'Yönetimin emeğimi görmezden gelip sadece hatalarıma odaklanması.',
        'Meslektaşlarımın benden daha başarılı görünmesi.'
      ]
    },
    {
      id: 'stress_2',
      text: 'Kendinizi en yakın hissettiğiniz çalışma stili hangisidir?',
      type: 'radio',
      options: [
        'Kurallara ve protokollere sıkı sıkıya bağlı, risk almayan.',
        'Sonuç odaklı, bazen kuralları esnetebilen ama başarı getiren.',
        'Empati odaklı, öğrencinin duygusal durumunu her şeyin önüne koyan.',
        'Analitik, sürekli veri tutan ve bilimsel makalelere göre hareket eden.'
      ]
    }
  ],
  social_diplomacy: [
    {
      id: 'parent_1',
      text: 'Bir veli, başka bir öğretmenin seansını kötüleyerek sizin çok daha iyi olduğunuzu söylüyor. Tepkiniz ne olur?',
      type: 'radio',
      options: [
        'Teşekkür eder, diğer arkadaşımın da elinden geleni yaptığını söylerim.',
        'Kurumun genel kalitesinden bahsederek konuyu profesyonel bir zemine çekerim.',
        'Duymazdan gelir, sadece kendi öğrencimin gelişimine odaklanırım.',
        'Durumu nazikçe amirime bildiririm ki diğer arkadaşım zor durumda kalmasın.'
      ]
    }
  ],
  development: [
    {
      id: 'feedback_1',
      text: 'Size yapılan hangi eleştiri "haksızlık" gibi gelir?',
      type: 'textarea'
    }
  ]
};
