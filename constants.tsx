
import { FormStep, Question, Branch } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Akademik Kimlik', description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz.' },
  { id: 'clinical_logic', title: 'Klinik Muhakeme Matrisi', description: 'Bilginin uygulamadaki yansımaları.' },
  { id: 'ethical_boundaries', title: 'Sınırlar ve Etik', description: 'Profesyonel mahremiyet ve hiyerarşi testi.' },
  { id: 'stress_resilience', title: 'Direnç ve Kriz', description: 'Tükenmişlik ve kriz yönetimi projeksiyonu.' },
  { id: 'vision_loyalty', title: 'Vizyon ve Sadakat', description: 'Kurumsal aidiyet ve gelecek planlama.' }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'cl_1',
      category: 'pedagogicalAnalysis',
      text: 'Uyguladığınız bilimsel metodun çocukta kısa vadeli bir gerileme (regresyon) yarattığını fark ettiniz. Veli ise "Hani düzelecekti, çocuk daha kötü oldu" diyerek kurumda sesini yükseltiyor. İlk refleksiniz?',
      type: 'radio',
      weightedOptions: [
        { 
          label: 'Verileri sakinlikle önüne koyar, bu regresyonun öğrenme sürecinin doğal bir parçası olduğunu literatürle açıklarım.', 
          weights: { clinical: 1.0, crisis: 0.9, pedagogy: 1.0 },
          analysisInsight: 'Bilimsel dürüstlük ve yüksek özgüven.'
        },
        { 
          label: 'Veliyi teskin etmek için yöntemde küçük bir değişiklik yapacağımı söyler, süreci zamana yayarım.', 
          weights: { clinical: 0.5, crisis: 0.7, fit: 0.8 },
          analysisInsight: 'Popülist yaklaşım, çatışmadan kaçınma.'
        },
        { 
          label: 'Durumu derhal koordinatöre bildirir, veli görüşmesini onun yapmasını isterim.', 
          weights: { formality: 1.0, resilience: 0.4, clinical: 0.3 },
          analysisInsight: 'Sorumluluk transferi, düşük stres toleransı.'
        }
      ]
    },
    {
      id: 'cl_2',
      category: 'technicalExpertise',
      text: 'Seans esnasında çocuğun tıbbi/nörolojik bir risk taşıdığını (örn: nöbet başlangıcı şüphesi) hissettiniz ancak bu alan sizin yetkinliğiniz dışı. Ne yaparsınız?',
      type: 'radio',
      weightedOptions: [
        { 
          label: 'Seansı durdurur, kurum doktoru/psikoloğu ile çapraz konsültasyon isterim.', 
          weights: { clinical: 1.0, ethics: 1.0, formality: 0.9 },
          analysisInsight: 'Multidisipliner bilinç ve etik sınır tanıma.'
        },
        { 
          label: 'Gözlemimi seans sonuna kadar sürdürür, notlarıma ekleyip sonraki toplantıda paylaşırım.', 
          weights: { clinical: 0.4, ethics: 0.2, risk: 1.0 },
          analysisInsight: 'Yüksek risk toleransı, geç müdahale.'
        }
      ]
    }
  ],
  ethical_boundaries: [
    {
      id: 'eb_1',
      category: 'workEthics',
      text: 'Ağır bir vakanın velisi, çocuğundaki gelişimden dolayı size çok minnettar olduğunu söyleyip, pahalı bir hediye veya "özel ders" teklifiyle geldi. Tavrınız?',
      type: 'radio',
      weightedOptions: [
        { 
          label: 'Hediyeyi kurumsal kurallar gereği nazikçe reddeder, mülkiyetin çocukta kalması gerektiğini (eğitim materyali ise) belirtirim.', 
          weights: { ethics: 1.0, formality: 1.0, loyalty: 1.0 },
          analysisInsight: 'Çelik gibi sınırlar, yüksek kurumsal sadakat.'
        },
        { 
          label: 'Veliyi kırmamak için hediyeyi kabul eder ama kurumun haberi olması için yönetime bildiririm.', 
          weights: { ethics: 0.3, formality: 0.6, fit: 0.5 },
          analysisInsight: 'Esnek sınırlar, onaylanma ihtiyacı.'
        }
      ]
    },
    {
      id: 'eb_2',
      category: 'parentStudentRelations',
      text: 'Bir meslektaşınızın, seansında etik olmayan bir davranışına (örn: çocuğa sert mizaç) şahit oldunuz. Ne yaparsınız?',
      type: 'radio',
      weightedOptions: [
        { 
          label: 'Önce meslektaşımla baş başa durumu konuşur, hatasını düzeltmesi için uyarırım; düzelmezse raporlarım.', 
          weights: { ethics: 0.8, fit: 1.0, loyalty: 0.7 },
          analysisInsight: 'Kolektif koruma içgüdüsü.'
        },
        { 
          label: 'Hiç vakit kaybetmeden kurumsal disiplin mekanizmasını çalıştırır ve yönetime raporlarım.', 
          weights: { ethics: 1.0, formality: 1.0, fit: 0.4 },
          analysisInsight: 'Katı kuralcı, düşük tolerans.'
        }
      ]
    }
  ],
  stress_resilience: [
    {
      id: 'sr_1',
      category: 'sustainability',
      text: 'Aynı gün içinde arka arkaya krizli seanslar geçirdiniz ve son seansta çocuk size fiziksel olarak zarar verdi (ısırma/vurma). O anki duygusal durumunuzu nasıl yönetirsiniz?',
      type: 'radio',
      weightedOptions: [
        { 
          label: 'Bunun çocuğun engel grubuna ait bir davranış olduğunu bilir, duygusal nötrlüğümü koruyarak seansa devam ederim.', 
          weights: { resilience: 1.0, clinical: 0.9, pedagogy: 0.8 },
          analysisInsight: 'Yüksek duygusal regülasyon (Optimal Burnout Resistance).'
        },
        { 
          label: 'Seansı o an sonlandırır, sakinleşmek için kısa bir mola isterim.', 
          weights: { resilience: 0.6, formality: 0.8, fit: 0.7 },
          analysisInsight: 'Kendini tanıma, ancak düşük stres tavanı.'
        }
      ]
    }
  ],
  vision_loyalty: [
    {
      id: 'vl_1',
      category: 'institutionalLoyalty',
      text: 'Rakip bir kurumdan, şu anki maaşınızın %40 fazlası ve daha az çalışma saati ile teklif aldınız. Karar verme süreciniz nasıl işler?',
      type: 'radio',
      weightedOptions: [
        { 
          label: 'Mevcut öğrencilerimin gelişim evresini ve kurumun bana sağladığı akademik vizyonu ön planda tutar, teklifi reddederim.', 
          weights: { loyalty: 1.0, ethics: 0.9, fit: 1.0 },
          analysisInsight: 'Vizyoner bağlılık (Mission-driven).'
        },
        { 
          label: 'Teklifi mevcut yönetimle paylaşır, şartlarımın iyileştirilmesini talep ederim.', 
          weights: { loyalty: 0.4, fit: 0.7, ethics: 0.5 },
          analysisInsight: 'Pazarlıkçı sadakat (Mercenary-leaning).'
        }
      ]
    }
  ]
};

export const TRAINING_VERIFICATION_QUESTIONS: Record<string, Question> = {};

export const CERTIFICATION_CATEGORIES = {
  LANGUAGE_SPEECH: ["PROMPT", "LSVT Loud", "Vital-Stim", "Hanen Programı", "ETÖOM", "TEDİL", "GOPAS", "E-YÖS"],
  OCCUPATIONAL_THERAPY: ["Ayres Duyu Bütünleme", "SIPT/EASI", "DIR Floortime 101/201", "Bobath (EBTA)", "Kinesiotaping", "CO-OP"],
  PHYSIOTHERAPY: ["Uzay Terapi", "Vojta", "Schroth", "Manuel Terapi", "Pediatrik Rehabilitasyon", "Therasuit"],
  SPECIAL_ED_ABA: ["ABA Uygulayıcı (BCBA Onaylı)", "PECS Faz 1-6", "ETEÇOM", "PREP", "PASS Teorisi", "GOPDÖ-2-TV"],
  ASSESSMENT: ["WISC-V", "MOXO", "Denver II", "CAS", "Stanford-Binet", "Metropolitan"]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "İstanbul Üniversitesi", "Ankara Üniversitesi", "Gazi Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Ergoterapi", "Dil ve Konuşma Terapisi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Okul Öncesi Öğretmenliği"];
