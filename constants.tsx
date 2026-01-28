
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const CERTIFICATION_CATEGORIES = [
  { id: 'AUTISM_SPECTRUM', label: 'Otizm Spektrum Bozukluğu (OSB)' },
  { id: 'LEARNING_DISABILITIES', label: 'Özel Öğrenme Güçlüğü (ÖÖG)' },
  { id: 'INTELLECTUAL_COGNITIVE', label: 'Zihin Engelliler & Bilişsel' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi' },
  { id: 'ACADEMIC_SKILLS', label: 'Okuma Yazma & Matematik' },
  { id: 'PSYCHOLOGY_GUIDANCE', label: 'Rehberlik & Psikoloji' }
];

export const CERTIFICATIONS: Certification[] = [
  // --- OTİZM SPEKTRUM BOZUKLUĞU (OSB) ---
  {
    id: 'aba_bacb',
    label: 'ABA (Applied Behavior Analysis) - BACB/QABA',
    description: 'Uygulamalı Davranış Analizi (BCBA/RBT Düzeyinde).',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'technicalExpertise', type: 'radio',
        text: 'Bir davranışın "işlevsel analizi" sırasında "Kaçınma (Escape)" işlevi saptandıysa, sönme (extinction) nasıl uygulanır?',
        weightedOptions: [
          { label: 'Görev talebi sürdürülür, çocuk görevden fiziksel olarak kaçamaz.', weights: { clinical: 1.0 }, analysisInsight: 'Teknik doğruluk.' },
          { label: 'Çocuk sakinleşene kadar mola verilir.', weights: { clinical: 0.0 }, analysisInsight: 'Pekiştirme hatası.' },
          { label: 'Mola kartı kullanması teşvik edilir.', weights: { clinical: 0.4 }, analysisInsight: 'Alternatif davranış.' }
        ]
      },
      {
        id: 'vq_aba_2', category: 'technicalExpertise', type: 'radio',
        text: 'DTT (Ayrık Denemelerle Öğretim) seansında "Hata Düzeltme" (Error Correction) protokolü ne zaman devreye girer?',
        weightedOptions: [
          { label: 'Hatalı yanıttan hemen sonra, en az yardım seviyesiyle tekrar deneme yapılarak.', weights: { clinical: 1.0 }, analysisInsight: 'Metodik sadakat.' },
          { label: '3 kez yanlış yaptıktan sonra.', weights: { clinical: 0.1 }, analysisInsight: 'Yanılgı.' }
        ]
      }
    ]
  },
  {
    id: 'dir_floortime_full',
    label: 'DIR Floortime (201/202/203) - ICDL',
    description: 'İlişki Temelli Nöro-gelişimsel Müdahale Modeli.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_dir_1', category: 'technicalExpertise', type: 'radio',
        text: 'FEDL 4 (Sosyal Problem Çözme) aşamasındaki bir çocukta seans odağı ne olmalıdır?',
        weightedOptions: [
          { label: 'Ardışık ve karmaşık etkileşim döngüleri (circles of communication) kurmak.', weights: { clinical: 1.0 }, analysisInsight: 'Gelişimsel basamak bilgisi.' },
          { label: 'Göz kontağı kurmasını sağlamak.', weights: { clinical: 0.2 }, analysisInsight: 'Alt basamak odağı.' }
        ]
      }
    ]
  },
  { id: 'etecom_local', label: 'ETEÇOM (Etkileşim Temelli Erken Çocuklukta Müdahale)', description: 'Türkiye uyarlamalı erken müdahale programı.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'pecs_pyramid', label: 'PECS (Picture Exchange Communication System)', description: 'Resim Değişimiyle İletişim Sistemi.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'teacch_method', label: 'TEACCH (Structured Teaching)', description: 'Yapılandırılmış eğitim ve görsel destekleme.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'gobdo_local', label: 'GOBDÖ-2-TV (Otizm Derecelendirme Ölçeği)', description: 'Yerel otizm tanı ve derecelendirme akreditasyonu.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'denver_ii', label: 'Denver II Gelişimsel Tarama Testi', description: '0-6 yaş gelişim takibi sertifikası.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },

  // --- ÖZEL ÖĞRENME GÜÇLÜĞÜ (ÖÖG) ---
  {
    id: 'cas_pass',
    label: 'CAS (Cognitive Assessment System) & PASS Teorisi',
    description: 'Bilişsel değerlendirme ve müdahale uzmanlığı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_cas_1', category: 'technicalExpertise', type: 'radio',
        text: '"Ardıl İşlem" (Successive Processing) puanı düşük bir disleksi vakasında hangi çalışma önceliklidir?',
        weightedOptions: [
          { label: 'Harf-ses eşleme ve kelime sentezleme çalışmaları.', weights: { clinical: 1.0 }, analysisInsight: 'Teorik uygulama.' },
          { label: 'Görsel algı ve kopya etme çalışmaları.', weights: { clinical: 0.2 }, analysisInsight: 'Eşzamanlı işlem odağı.' }
        ]
      }
    ]
  },
  { id: 'orton_gillingham_intl', label: 'Orton-Gillingham Multisensory Approach', description: 'Uluslararası disleksi müdahale standardı.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'disrek_local', label: 'DİSREK (Disleksi Müdahale Programı)', description: 'Türkiye Disleksi Vakfı akreditasyonu.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'prep_cogent', label: 'PREP & COGENT (PASS Müdahale)', description: 'Bilişsel süreçleri iyileştirme programları.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'moxo_attention', label: 'MOXO Dikkat Testi Uygulayıcısı', description: 'Objektif dikkat ölçümleme akreditasyonu.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'tobi_attention', label: 'TOBİ (Türkiye Okuma Becerileri İstifleme)', description: 'Yerel okuma hızı ve kalitesi ölçümü.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },

  // --- DİL VE KONUŞMA TERAPİSİ (DKT) ---
  { id: 'prompt_level1', label: 'PROMPT (Level 1/2) Technique', description: 'Motor-Konuşma bozuklukları için taktil girdi metodu.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'lidcombe_stuttering', label: 'Lidcombe Programı (Kekemelik)', description: 'Okul öncesi kekemelik müdahale sertifikası.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'more_than_words', label: 'Hanen - More Than Words', description: 'OSB ve Dil Gecikmesi aile eğitimi sertifikası.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'talktools_opt', label: 'TalkTools Oral Placement Therapy', description: 'Oral motor terapi teknikleri.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'tedil_local', label: 'TEDİL (Türkçe Erken Dil Gelişimi Testi)', description: 'Dil gelişim düzeyi yerel ölçümleme.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'tkt_local', label: 'TKT (Türkçe Konuşma Testi)', description: 'Artikülasyon ve fonoloji analizi.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },

  // --- ERGOTERAPİ & FİZYOTERAPİ (OT/PT) ---
  { id: 'ayres_si', label: 'Ayres Duyu Bütünleme (SIPT/EASI)', description: 'Uluslararası Duyu Bütünleme akreditasyonu.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'bobath_ndt_cert', label: 'Bobath / NDT (Neuro-Developmental Treatment)', description: 'Nöro-gelişimsel tedavi uzmanlık sertifikası.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'therasuit_method', label: 'TheraSuit Method / Uzay Terapisi', description: 'Yoğun nöro-rehabilitasyon tekniği.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'halliwick_hydro', label: 'Halliwick Aquaterapi / Hidroterapi', description: 'Su içi rehabilitasyon uzmanlığı.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'schroth_scoliosis', label: 'Schroth Scoliosis Method', description: 'Skolyoz rehabilitasyon sertifikası.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },

  // --- OKUMA YAZMA & MATEMATİK ---
  { id: 'singapore_math', label: 'Singapur Matematiği (CPA Approach)', description: 'Somut-Görsel-Soyut matematik öğretimi.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'diskalkuli_cert', label: 'Diskalkuli Müdahale Eğitimi', description: 'Matematik öğrenme güçlüğü uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'ses_temelli_yontem', label: 'Ses Temelli Cümle Yöntemi (MEB Standart)', description: 'İlk okuma-yazma öğretimi uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'speed_reading_acad', label: 'Anlayarak Hızlı Okuma Eğitmenliği', description: 'Akademik okuma hızı optimizasyonu.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },

  // --- PSİKOLOJİ & REHBERLİK ---
  { id: 'wisc_v_tpd', label: 'WISC-V Uygulayıcı (Türk Psikologlar Derneği)', description: 'Zeka ölçeği resmi uygulayıcı akreditasyonu.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'cbt_child_adolescent', label: 'Çocuk ve Ergenlerde BDT (Bilişsel Davranışçı)', description: 'Klinik terapi sertifika programı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'play_therapy_apt', label: 'Deneyimsel Oyun Terapisi (APT Onaylı)', description: 'Oyun yoluyla terapötik müdahale uzmanlığı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'solution_focused', label: 'Çözüm Odaklı Kısa Süreli Terapi', description: 'Okul ve rehberlik temelli terapi yaklaşımı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'metropolitan_school', label: 'Metropolitan Okul Olgunluğu Testi', description: 'Okula hazırlık değerlendirme sertifikası.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] }
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
