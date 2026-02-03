
import { Certification } from '../types';

export const CERTIFICATIONS: Certification[] = [
  // 🧩 OTİZM SPEKTRUM BOZUKLUĞU (AUTISM_SPECTRUM)
  {
    id: 'aba_bcba',
    label: 'Applied Behavior Analysis (ABA) - BCBA/UKBA',
    description: 'Uluslararası Davranış Analisti Akreditasyonu (BACB).',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'clinical', type: 'radio',
        text: 'Bir vaka analizinde "Aralıklı Pekiştirme" (Intermittent Reinforcement) tuzağına düşen bir veliyi nasıl yönetirsiniz?',
        weightedOptions: [
          { label: 'Protokol sadakatinin bir seçenek değil, etik bir zorunluluk olduğunu somut veri trendleriyle gösteririm.', weights: { clinical: 1.0, workEthics: 0.9 }, analysisInsight: 'Teknik Otorite ve Veri Odaklılık.' },
          { label: 'Sönme prosedürünü velinin günlük hayatında gerçekten uygulayabileceği mikro-adımlara bölerek onun için süreci basitleştiririm.', weights: { clinical: 0.8, empathy: 1.0 }, analysisInsight: 'Sistemik Esneklik ve Veli Koçluğu.' }
        ]
      }
    ]
  },
  {
    id: 'dir_floortime_202',
    label: 'DIR Floortime (201/202 Proficient)',
    description: 'İlişki Temelli Nörogelişimsel Müdahale (ICDL).',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_dir_1', category: 'clinical', type: 'radio',
        text: 'Çocuk FEDL 4 (Karmaşık Problem Çözme) aşamasında ama duyusal olarak aşırı uyarılmışsa (Hyper-aroused) yaklaşımınız?',
        weightedOptions: [
          { label: 'Bilişsel zorlamayı hemen durdurarak duyusal regülasyonu (ko-regülasyon) önceliklendiririm.', weights: { clinical: 1.0, sustainability: 0.9 }, analysisInsight: 'Biyolojik Hiyerarşi Bilinci.' },
          { label: 'Bu uyarılmışlık halini oyunun içine "yüksek enerjili bir afet" gibi yedirerek etkileşim döngülerini sürdürürüm.', weights: { clinical: 0.7, developmentOpenness: 1.0 }, analysisInsight: 'Yaratıcı ve İlişkisel Müdahale.' }
        ]
      }
    ]
  },
  {
    id: 'etecom_tr',
    label: 'ETEÇOM (Etkileşim Temelli Erken Çocuklukta Müdahale)',
    description: 'Türkiye uyarlamalı, 0-6 yaş etkileşim programı.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_etecom_1', category: 'clinical', type: 'radio',
        text: 'ETEÇOM stratejilerinden "Aynalama" ve "Genişletme" arasındaki farkı uygulamada nasıl korursunuz?',
        weightedOptions: [
          { label: 'Çocuğun eylemini birebir taklit ederek güven alanı kurar (Aynalama), ardından yeni bir öğe ekleyerek bilişsel itki sağlarım (Genişletme).', weights: { clinical: 1.0, pedagogicalAnalysis: 0.9 }, analysisInsight: 'Metodik Uygulama Hassasiyeti.' },
          { label: 'Çocuğun liderliğini takip ederek sadece onun ürettiği ses ve hareketleri taklit etmeyi yeterli bulurum.', weights: { clinical: 0.5, empathy: 0.8 }, analysisInsight: 'Pasif Takip Eğilimi.' }
        ]
      }
    ]
  },
  {
    id: 'esdm_toddler',
    label: 'Early Start Denver Model (ESDM)',
    description: 'Erken çocukluk dönemi otizm müdahale programı.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: []
  },

  // 📖 ÖZEL ÖĞRENME GÜÇLÜĞÜ (LEARNING_DISABILITIES)
  {
    id: 'prep_disleksi',
    label: 'PREP (Pass Reading Enhancement Program)',
    description: 'PASS Teorisi temelli okumayı iyileştirme programı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_prep_1', category: 'clinical', type: 'radio',
        text: 'PREP uygularken "Ardıl İşlemleme" zayıflığı olan bir çocukta okuma akıcılığını nasıl desteklersiniz?',
        weightedOptions: [
          { label: 'Sözcükleri parçalamak yerine, hızlı isimlendirme (RAN) egzersizleri ve ritmik gruplamalar kullanırım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Nöro-Kognitif Strateji Hakimiyeti.' },
          { label: 'Heceleme çalışmalarına ağırlık vererek eksik harfleri defalarca yazdırırım.', weights: { clinical: 0.3, pedagogicalAnalysis: 0.5 }, analysisInsight: 'Gelenekselci / Düşük Kognitif Derinlik.' }
        ]
      }
    ]
  },
  {
    id: 'tills_assess',
    label: 'TILLS (Test of Integrated Language & Literacy Skills)',
    description: 'Bütünleşik Dil ve Okuryazarlık Değerlendirmesi.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: []
  },
  {
    id: 'cogent_tr',
    label: 'COGENT (Bilişsel Geliştirme Programı)',
    description: 'Okul öncesi dönem bilişsel hazırlık sistemi.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: []
  },

  // 🧠 ZİHİN & BİLİŞSEL (INTELLECTUAL_COGNITIVE)
  {
    id: 'cas_cognitive',
    label: 'CAS (Cognitive Assessment System)',
    description: 'PASS Teorisi tabanlı zeka ve bilişsel değerlendirme testi.',
    category: 'INTELLECTUAL_COGNITIVE',
    verificationQuestions: [
      {
        id: 'vq_cas_1', category: 'clinical', type: 'radio',
        text: 'CAS profilinde "Planlama" puanı çok düşük, "Eşzamanlı İşlem" puanı yüksek bir vaka için eğitim planı nasıl olmalı?',
        weightedOptions: [
          { label: 'Bütünsel/Görsel materyallerle (Eşzamanlı) bilgi sunar, görevi küçük organizasyonel parçalara (Planlama Desteği) bölerim.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Üst Düzey Klinik Muhakeme.' },
          { label: 'Zayıf olan planlama alanını güçlendirmek için sürekli tekrarlı organizasyon ödevleri veririm.', weights: { clinical: 0.6, sustainability: 0.7 }, analysisInsight: 'Yükleme Odaklı Yaklaşım.' }
        ]
      }
    ]
  },
  {
    id: 'wisc_iv_tr',
    label: 'WISC-IV (Wechsler Intelligence Scale for Children)',
    description: 'Türk Psikologlar Derneği onaylı zeka ölçeği.',
    category: 'INTELLECTUAL_COGNITIVE',
    verificationQuestions: []
  },
  {
    id: 'moxo_dhk',
    label: 'MOXO Dikkat Testi',
    description: 'Dijital tabanlı dikkat ve hiperaktivite performans ölçümü.',
    category: 'INTELLECTUAL_COGNITIVE',
    verificationQuestions: []
  },
  {
    id: 'asis_intel',
    label: 'ASIS (Anadolu-Sak Zeka Ölçeği)',
    description: 'Yerli ve milli zeka değerlendirme bataryası.',
    category: 'INTELLECTUAL_COGNITIVE',
    verificationQuestions: []
  },

  // 🗣️ DİL VE KONUŞMA TERAPİSİ (LANGUAGE_SPEECH)
  {
    id: 'prompt_therapy',
    label: 'PROMPT (Restructuring Oral Muscular Phonetic Targets)',
    description: 'Konuşma sesleri için dokunsal-kinestetik müdahale.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: [
      {
        id: 'vq_prompt_1', category: 'clinical', type: 'radio',
        text: 'Artikülasyon terapisinde dokunsal ipucu (input) verirken çocuğun kaçınma tepkisi (Aversion) durumunda tavrınız?',
        weightedOptions: [
          { label: 'Dokunsal girdiyi hemen keser, duyusal hassasiyeti regüle ettikten sonra daha düşük bir hiyerarşiden tekrar denerim.', weights: { clinical: 1.0, empathy: 0.9 }, analysisInsight: 'Duyusal Hassasiyet Bilinci.' },
          { label: 'Motor öğrenmenin tamamlanması için hafif direnç gösterse de uygulamayı bitirmeye odaklanırım.', weights: { clinical: 0.4, workEthics: 0.6 }, analysisInsight: 'Zorlayıcı Uygulama Riski.' }
        ]
      }
    ]
  },
  {
    id: 'lidcombe_stutter',
    label: 'Lidcombe Programı (Kekemelik)',
    description: 'Okul öncesi kekemelik müdahalesi (Davranışçı model).',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: []
  },
  {
    id: 'sst_articulation',
    label: 'SST (Sesletim ve Sesbilgisi Testi)',
    description: 'Ulusal artikülasyon değerlendirme standardı.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: []
  },

  // 🏃 ERGOTERAPİ & FİZYOTERAPİ (OCCUPATIONAL_PHYSIO)
  {
    id: 'ayres_si',
    label: 'Ayres Sensory Integration (ASI)',
    description: 'Duyu Bütünleme müdahalesi (CLASI/EBTA).',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_si_1', category: 'clinical', type: 'radio',
        text: 'Vestibüler girdi arayışındaki bir çocukta "Otonomik Tepki" (solgunluk, terleme) fark ettiğinizde ne yaparsınız?',
        weightedOptions: [
          { label: 'Tüm vestibüler girdiyi derhal durdurur, çocuğu yere (statik zemin) alır ve propriyoseptif (derin bası) girdiyle sistemi sakinleştiririm.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Kritik Klinik Güvenlik.' },
          { label: 'Çocuğu yavaşlatır ama aktiviteyi bitirmem; alışması için süreci zamana yayarım.', weights: { clinical: 0.3, sustainability: 0.5 }, analysisInsight: 'Fizyolojik Risk İhmali.' }
        ]
      }
    ]
  },
  {
    id: 'bobath_ndt',
    label: 'Bobath (NDT) Sertifikalı Uygulayıcı',
    description: 'Nörogelişimsel Tedavi yaklaşımı (Serebral Palsi vb.).',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: []
  },
  {
    id: 'halliwick_aqua',
    label: 'Halliwick Konsepti (Hidroterapi)',
    description: 'Su içi rehabilitasyon ve 10 nokta programı.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: []
  },

  // 📐 OKUMA YAZMA & MATEMATİK (ACADEMIC_SKILLS)
  {
    id: 'disleksi_mudahale_meb',
    label: 'MEB Onaylı Disleksi Eğitici Eğitimi',
    description: 'Ulusal eğitim standartlarında öğrenme güçlüğü müdahalesi.',
    category: 'ACADEMIC_SKILLS',
    verificationQuestions: []
  },
  {
    id: 'math_recovery',
    label: 'Math Recovery Program',
    description: 'Erken çocuklukta matematiksel muhakeme ve müdahale.',
    category: 'ACADEMIC_SKILLS',
    verificationQuestions: []
  },
  {
    id: 'touch_math_tr',
    label: 'TouchMath (Dokunsal Matematik)',
    description: 'Görsel ve dokunsal sayı algısı sistemi.',
    category: 'ACADEMIC_SKILLS',
    verificationQuestions: []
  },

  // 🤝 REHBERLIK & PSİKOLOJİ (PSYCHOLOGY_GUIDANCE)
  {
    id: 'cbt_bde_turk',
    label: 'Bilişsel Davranışçı Terapi (BDE)',
    description: 'TPD veya BDPD onaylı teorik ve süpervizyon eğitimi.',
    category: 'PSYCHOLOGY_GUIDANCE',
    verificationQuestions: [
      {
        id: 'vq_cbt_1', category: 'clinical', type: 'radio',
        text: 'Veli ile yapılan "Sokratik Sorgulama" seansında ailenin aşırı direnç göstermesi durumunda BDE stratejiniz nedir?',
        weightedOptions: [
          { label: 'İnanç sistemini (Core Beliefs) doğrudan sorgulamak yerine, ara inançlar üzerinden davranışsal deneyler planlarım.', weights: { clinical: 1.0, technicalExpertise: 0.9 }, analysisInsight: 'Klinik Esneklik ve Strateji.' },
          { label: 'Direncin nedenlerini analiz etmek için psikanalitik bir geçmişe dönerim.', weights: { clinical: 0.4, pedagogicalAnalysis: 0.5 }, analysisInsight: 'Ekol Kayması / Metodolojik Sapma.' }
        ]
      }
    ]
  },
  {
    id: 'play_therapy_apt',
    label: 'Oyun Terapisi (APT Onaylı / Deneyimsel)',
    description: 'Association for Play Therapy standartlarında uygulayıcılık.',
    category: 'PSYCHOLOGY_GUIDANCE',
    verificationQuestions: []
  },
  {
    id: 'emdr_child',
    label: 'EMDR Çocuk ve Ergen 1. Düzey',
    description: 'Göz hareketleriyle duyarsızlaştırma ve yeniden işleme.',
    category: 'PSYCHOLOGY_GUIDANCE',
    verificationQuestions: []
  },
  {
    id: 'family_counseling_meb',
    label: 'MEB 464 Saatlik Aile Danışmanlığı',
    description: 'Yasal aile danışmanı ünvanı veren sertifika programı.',
    category: 'PSYCHOLOGY_GUIDANCE',
    verificationQuestions: []
  }
];
