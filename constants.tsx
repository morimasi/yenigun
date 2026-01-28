
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const CERTIFICATION_CATEGORIES = [
  { id: 'AUTISM_SPECTRUM', label: 'Otizm Spektrum Bozukluğu', icon: '🧩' },
  { id: 'LEARNING_DISABILITIES', label: 'Özel Öğrenme Güçlüğü', icon: '📖' },
  { id: 'INTELLECTUAL_COGNITIVE', label: 'Zihin & Bilişsel', icon: '🧠' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi', icon: '🗣️' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi', icon: '🏃' },
  { id: 'ACADEMIC_SKILLS', label: 'Okuma Yazma & Matematik', icon: '📐' },
  { id: 'PSYCHOLOGY_GUIDANCE', label: 'Rehberlik & Psikoloji', icon: '🤝' }
];

export const CERTIFICATIONS: Certification[] = [
  // --- OSB: OTİZM SPEKTRUM BOZUKLUĞU ---
  {
    id: 'aba_intl',
    label: 'ABA (Applied Behavior Analysis) - BCBA/RBT',
    description: 'Uluslararası Uygulamalı Davranış Analizi Akreditasyonu.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'technicalExpertise', type: 'radio',
        text: 'Bir problem davranışın işlevi "Dikkat Çekme" ise, sönme (extinction) sırasında hangisi yapılır?',
        weightedOptions: [
          { label: 'Davranış oluştuğunda sözel/göz teması dahil tüm etkileşimi kesmek.', weights: { clinical: 1.0 }, analysisInsight: 'Teknik sadakat.' },
          { label: 'Çocuğa "Yapma" demek.', weights: { clinical: 0.0 }, analysisInsight: 'Tepki pekiştirmesi.' },
          { label: 'Mola odasına çıkarmak.', weights: { clinical: 0.3 }, analysisInsight: 'Ceza odaklı.' }
        ]
      }
    ]
  },
  { id: 'dir_floortime', label: 'DIR Floortime (ICDL Certified)', description: 'İlişki temelli nöro-gelişimsel müdahale (201/202+).', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'pecs_pyramid', label: 'PECS (Picture Exchange Communication System)', description: 'Resim Değişimiyle İletişim Sistemi resmi eğitimi.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'etecom', label: 'ETEÇOM (Etkileşim Temelli Erken Müdahale)', description: 'Yerel ve bilimsel kanıta dayalı etkileşim programı.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'teacch', label: 'TEACCH (Structured Teaching)', description: 'Yapılandırılmış eğitim ve görsel destekleme metodu.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'gars_2', label: 'GARS-2 (Gilliam Otizm Derecelendirme Ölçeği)', description: 'Otizm tanısal tarama ve şiddet belirleme testi.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'denver_ii', label: 'Denver II Gelişimsel Tarama Testi', description: '0-6 yaş gelişimsel risk belirleme sertifikası.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },

  // --- ÖÖG: ÖZEL ÖĞRENME GÜÇLÜĞÜ ---
  {
    id: 'cas_pass',
    label: 'CAS (Cognitive Assessment System) Uygulayıcı',
    description: 'PASS teorisi temelli bilişsel değerlendirme uzmanlığı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_cas_1', category: 'technicalExpertise', type: 'radio',
        text: 'CAS testinde "Planlama" ölçeği düşük bir öğrencide hangi müdahale önceliklidir?',
        weightedOptions: [
          { label: 'Bilişsel öz-izleme ve strateji üretme çalışmaları.', weights: { clinical: 1.0 }, analysisInsight: 'Müdahale doğruluğu.' },
          { label: 'Daha çok ezber yaptırmak.', weights: { clinical: 0.0 }, analysisInsight: 'Temel hata.' }
        ]
      }
    ]
  },
  { id: 'orton_gillingham', label: 'Orton-Gillingham Approach', description: 'Disleksi için çok duyulu (multisensory) dil eğitimi.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'disrek_national', label: 'DİSREK (Ulusal Disleksi Programı)', description: 'Türkiye Disleksi Vakfı akreditasyonlu müdahale.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'prep_cogent', label: 'PREP & COGENT (PASS Intervention)', description: 'Bilişsel süreçleri iyileştirme ve okuma programları.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'moxo_attention', label: 'MOXO Dikkat Testi Uygulayıcı', description: 'Objektif dikkat ölçümleme sistemleri uzmanlığı.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'tobi_reading', label: 'TOBİ (Türkiye Okuma Becerileri İstifleme)', description: 'Okuma hızı ve kalitesi yerel değerlendirme.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },

  // --- ZİHİN ENGELİ & BİLİŞSEL ---
  { id: 'wisc_v', label: 'WISC-V (Wechsler Zeka Ölçeği - 5. Sürüm)', description: 'Bilişsel yetenek değerlendirme resmi akreditasyonu.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'leiter_3', label: 'Leiter-3 Performans Ölçeği', description: 'Sözel olmayan zeka ve dikkat ölçümleme uzmanlığı.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'stanford_binet', label: 'Stanford-Binet Zeka Testi (SB5)', description: 'Geleneksel ve güncel zeka değerlendirme uzmanlığı.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'asis_national', label: 'ASİS (Anadolu-Sak Zeka Ölçeği)', description: 'Yerel normlara sahip ilk Türk zeka ölçeği.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'metropolitan', label: 'Metropolitan Okul Olgunluğu Testi', description: 'Okula hazırlık düzeyi belirleme sertifikası.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },

  // --- DİL VE KONUŞMA TERAPİSİ (DKT) ---
  { id: 'prompt_technique', label: 'PROMPT (Level 1/2) Technique', description: 'Motor-konuşma bozuklukları için taktil girdi metodu.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'lidcombe_stuttering', label: 'Lidcombe Programı (Kekemelik)', description: 'Okul öncesi kekemelik müdahale uzmanlığı.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'hanen_more_than_words', label: 'Hanen - More Than Words', description: 'OSB ve dil gecikmesinde aile odaklı müdahale.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'talktools_opt', label: 'TalkTools Oral Placement Therapy', description: 'Oral motor terapi ve yerleşim teknikleri.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'tedil_local', label: 'TEDİL (Türkçe Erken Dil Gelişimi Testi)', description: 'Dil gelişim düzeyi yerel ölçümleme uzmanlığı.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'todil_local', label: 'TODİL (Türkçe Okul Çağı Dil Gelişimi)', description: 'Okul dönemi dil bozuklukları analizi.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },

  // --- ERGOTERAPİ & FİZYOTERAPİ (OT/PT) ---
  { id: 'ayres_si_intl', label: 'Ayres Duyu Bütünleme (SIPT/EASI)', description: 'Duyusal işlemleme bozuklukları global akreditasyonu.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'bobath_ndt', label: 'Bobath / NDT (Neuro-Developmental Treatment)', description: 'Nöro-gelişimsel tedavi (Serebral Palsi odaklı).', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'therasuit_method', label: 'TheraSuit Method / Uzay Terapisi', description: 'Yoğun nöro-rehabilitasyon ve askı sistemleri.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'halliwick_aquatic', label: 'Halliwick Hidroterapi Konsepti', description: 'Su içi rehabilitasyon ve yüzme uzmanlığı.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'schroth_scoliosis', label: 'Schroth Scoliosis Method', description: 'Skolyoz rehabilitasyonu spesifik eğitimi.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'gmfm_assessment', label: 'GMFM (Kaba Motor Fonksiyon Ölçütü)', description: 'Serebral palsili çocuklarda motor analiz uzmanlığı.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },

  // --- OKUMA YAZMA & MATEMATİK ---
  { id: 'singapore_math', label: 'Singapur Matematiği (CPA Approach)', description: 'Somut-Görsel-Soyut matematik öğretimi metodu.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'diskalkuli_cert', label: 'Diskalkuli Müdahale Eğitimi', description: 'Matematik öğrenme güçlüğü klinik uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'ses_temelli_meb', label: 'Ses Temelli Cümle Yöntemi (MEB)', description: 'İlkokul okuma yazma öğretim uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'speed_reading', label: 'Anlayarak Hızlı Okuma Eğitmenliği', description: 'Bilişsel okuma hızı ve anlama optimizasyonu.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'montessori_acad', label: 'Montessori Pedagojisi (Akademik)', description: 'Yapılandırılmış materyal ve özgür öğrenme uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },

  // --- REHBERLİK & PSİKOLOJİ ---
  { id: 'cbt_children', label: 'Çocuk ve Ergenlerde BDT (CBT)', description: 'Bilişsel Davranışçı Terapi uygulayıcı sertifikası.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'play_therapy_apt', label: 'Deneyimsel Oyun Terapisi (APT Onaylı)', description: 'Oyun yoluyla terapötik müdahale uzmanlığı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'solution_focused', label: 'Çözüm Odaklı Kısa Süreli Terapi', description: 'Okul ve rehberlik temelli hızlı çözüm yaklaşımı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'agte_national', label: 'AGTE (Ankara Gelişim Tarama Envanteri)', description: 'Bebek ve çocuklarda yerel gelişim taraması.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'frostig_visual', label: 'Frostig Görsel Algı Testi', description: 'Görsel algı ve el-göz koordinasyonu analizi.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'mmp_psych', label: 'MMPI (Minnesota Çok Yönlü Kişilik Envanteri)', description: 'Klinik kişilik değerlendirme (Yetişkin/Ergen).', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'gen_1', category: 'technicalExpertise', type: 'radio',
      text: 'Karmaşık bir vakada (Örn: OSB + ADHD) seans önceliği nasıl belirlenmelidir?',
      weightedOptions: [
        { label: 'Önce duyusal regülasyon ve bariyer davranışların analizi yapılır.', weights: { clinical: 1.0 }, analysisInsight: 'Sistemik bakış.' },
        { label: 'Doğrudan akademik (okuma-yazma) hedeflere odaklanılır.', weights: { clinical: 0.0 }, analysisInsight: 'Pedagojik hata.' },
        { label: 'Velinin en çok şikayet ettiği konudan başlanır.', weights: { clinical: 0.5 }, analysisInsight: 'Veli odaklılık.' }
      ]
    }
  ],
  ethics_parent: [
    {
       id: 'eth_1', category: 'workEthics', type: 'radio',
       text: 'Bir veli, kurum dışı özel ders talebiyle size ulaştığında kurumsal etik gereği ilk aksiyonunuz ne olur?',
       weightedOptions: [
          { label: 'Talebi reddeder ve yönetimi şeffaf bir şekilde bilgilendiririm.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek dürüstlük.' },
          { label: 'Sadece "Hayır" derim, kuruma bilgi vermem.', weights: { ethics: 0.7, institutionalLoyalty: 0.4 }, analysisInsight: 'Gizli bilgi.' },
          { label: 'Kabul ederim.', weights: { ethics: -1.0, institutionalLoyalty: -1.0 }, analysisInsight: 'Kritik etik ihlal.' }
       ]
    }
  ],
  resilience_team: [
    {
       id: 'res_1', category: 'sustainability', type: 'radio',
       text: 'Ağır bir nöbet (seizure) veya kriz anında ekip içi koordinasyon nasıl olmalıdır?',
       weightedOptions: [
          { label: 'Belirlenmiş güvenlik protokolünü uygular ve liderlik hiyerarşisine uyarım.', weights: { clinical: 1.0, resilience: 1.0 }, analysisInsight: 'Kriz yönetimi.' },
          { label: 'Kendi başıma müdahale ederim.', weights: { resilience: 0.3 }, analysisInsight: 'Bireysel risk.' }
       ]
    }
  ],
  vision_loyalty: [
    {
       id: 'vis_1', category: 'developmentOpenness', type: 'radio',
       text: 'Kurumun size bir eğitim aldırıp 2 yıl çalışma taahhüdü istemesi karşısındaki tutumunuz?',
       weightedOptions: [
          { label: 'Gelişimi ve aidiyeti önemserim, bu yatırımın karşılığını kurumda veririm.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Aidiyet.' },
          { label: 'Eğitimi alırım ama daha iyi bir teklif gelirse giderim.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Sadakat riski.' }
       ]
    }
  ]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Biruni Üniversitesi", "Üsküdar Üniversitesi", "Bezmialem Vakıf Üniversitesi", "Medipol Üniversitesi", "Bahçeşehir Üniversitesi", "Kültür Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
