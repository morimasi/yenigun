
import { Certification } from '../types';

export const CERTIFICATIONS: Certification[] = [
  // 🧩 OTİZM SPEKTRUM BOZUKLUĞU
  {
    id: 'aba_bcba',
    label: 'Applied Behavior Analysis (ABA) - BCBA/UKBA',
    description: 'Uluslararası Davranış Analisti Akreditasyonu.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_intl', category: 'clinical', type: 'radio',
        text: 'Bir vaka analizinde "Aralıklı Pekiştirme" (Intermittent Reinforcement) tuzağına düşen bir veliyi nasıl yönetirsiniz?',
        weightedOptions: [
          { label: 'Veri Temelli Yüzleşme: Velinin "bazen" verdiği tavizlerin davranışı nasıl ölümsüzleştirdiğini grafiklerle gösterir, protokol sadakati için etik sözleşmeyi hatırlatırım.', weights: { clinical: 1.0, workEthics: 0.9 }, analysisInsight: 'Teknik Otorite: Veriyi ikna aracı olarak kullanan profil.' },
          { label: 'Davranışsal Koçluk: Veliyi suçlamadan, bu durumun insani bir "duygusal sızıntı" olduğunu kabul eder ve sönme prosedürünü velinin uygulayabileceği mikro adımlara bölerim.', weights: { clinical: 0.8, empathy: 1.0 }, analysisInsight: 'Sistemik Esneklik: Aileyi sürece dahil eden pragmatist.' }
        ]
      }
    ]
  },
  {
    id: 'dir_floortime_prof',
    label: 'DIR Floortime (201/202/Expert)',
    description: 'İlişki Temelli Nörogelişimsel Müdahale (ICDL).',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_dir_adv', category: 'clinical', type: 'radio',
        text: 'Çocuk FEDL 4 (Karmaşık Problem Çözme) aşamasında ama duyusal olarak "Aşırı Uyarılmış" (Hyper-aroused). Müdahaleniz ne olur?',
        weightedOptions: [
          { label: 'Aşağıdan Yukarıya (Bottom-up): Önce duyusal regülasyonu (ko-regülasyon) sağlar, çocuk sakinleşene kadar etkileşimi en düşük bilişsel yükte tutarım.', weights: { clinical: 1.0, sustainability: 0.9 }, analysisInsight: 'Biyolojik Öncelik: Sinir sistemi hiyerarşisini bilen klinisyen.' },
          { label: 'Duygusal Genişletme: Bu uyarılmışlığı oyunun bir parçası yaparak (Örn: Heyecanlı bir kovalamaca) etkileşim döngülerini (Circles) sürdürmeye çalışırım.', weights: { clinical: 0.7, developmentOpenness: 1.0 }, analysisInsight: 'Yaratıcı Terapist: Krizi fırsata çeviren ilişkisel profil.' }
        ]
      }
    ]
  },
  { id: 'etekom_autism', label: 'ETEÇOM (Etkileşim Temelli Erken Çocuklukta Müdahale)', description: '0-6 yaş etkileşimsel stratejiler.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'pecs_intl', label: 'PECS (Picture Exchange Communication System)', description: 'Resim Değişiş Yoluyla İletişim.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },
  { id: 'gobdo_2', label: 'GOBDÖ-2-TV (Gilliam Otizm Derecelendirme Ölçeği)', description: 'Otizm tanı ve şiddet belirleme standardı.', category: 'AUTISM_SPECTRUM', verificationQuestions: [] },

  // 📖 ÖZEL ÖĞRENME GÜÇLÜĞÜ
  {
    id: 'dmp_disleksi',
    label: 'Disleksi Müdahale Programı (DMP)',
    description: 'Ses temelli fonolojik farkındalık uzmanlığı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_dmp_1', category: 'clinical', type: 'radio',
        text: 'Okuma akıcılığı zayıf olan öğrencide "Tahmin Ederek Okuma" (Visual Guessing) hatasını nasıl kırarsınız?',
        weightedOptions: [
          { label: 'Fonolojik Tahkimat: Kelimeyi parçalarına ayırarak (Decodable Text) ve her sesin karşılığını parmakla takip ederek "ortografik haritalama" yaparım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Metodolojik Sadakat: Kanıta dayalı yöntemden sapmayan profil.' },
          { label: 'Bilişsel Strateji: Cümlenin bağlamından yola çıkarak "anlamsal ipuçları" kullanmasını öğretir, hızı artırmak için hata payını kabul ederim.', weights: { clinical: 0.5, empathy: 0.8 }, analysisInsight: 'Sonuç Odaklı: Akademik kaygıyı önceliklendiren profil.' }
        ]
      }
    ]
  },
  { id: 'ivek_disleksi', label: 'İVEK (İşitsel-Görsel Eğitim Kompleksi)', description: 'Çok duyulu öğrenme yaklaşımı.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'tobi_okuma', label: 'TÖBİ (Temel Okuma Becerileri Envanteri)', description: 'Performans analizi ve BEP hazırlama.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },
  { id: 'prep_pass', label: 'PREP (PASS Reading Enhancement Program)', description: 'Ardıl ve eşzamanlı işlemleme temelli okuma.', category: 'LEARNING_DISABILITIES', verificationQuestions: [] },

  // 🧠 ZİHİN & BİLİŞSEL
  {
    id: 'cas_cog',
    label: 'Cognitive Assessment System (CAS)',
    description: 'PASS Teorisi Bilişsel Değerlendirme Uzmanlığı.',
    category: 'INTELLECTUAL_COGNITIVE',
    verificationQuestions: [
      {
        id: 'vq_cas_1', category: 'clinical', type: 'radio',
        text: 'Öğrencinin "Ardıl İşlemleme" (Successive) skoru çok düşükse, yönerge verirken stratejiniz ne olur?',
        weightedOptions: [
          { label: 'Görselleştirme ve Eşzamanlılık: Sözel yönergeyi tekli komutlara böler ve mutlaka görsel bir şema veya akış kartıyla desteklerim.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Bilişsel Mimari: Profil zayıflığını telafi stratejisiyle çözen profil.' },
          { label: 'Hafıza Egzersizi: Yönergeyi bilerek uzun tutar ve tekrar etmesini isteyerek ardıl işlemleme kaslarını seansta zorlarım.', weights: { clinical: 0.6, sustainability: 0.7 }, analysisInsight: 'Zorlayıcı Eğitmen: Kapasite artırımına odaklı profil.' }
        ]
      }
    ]
  },
  { id: 'wisc_4_intl', label: 'WISC-IV (Wechsler Çocuklar İçin Zeka Ölçeği)', description: 'Uluslararası zeka değerlendirme standardı.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'attentioner_program', label: 'Attentioner (Dikkatimi Topluyorum)', description: '7-18 yaş nöropsikolojik tabanlı dikkat eğitimi.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'moxo_test', label: 'MOXO Dikkat Testi Uygulayıcısı', description: 'Objektif DEHB ve dikkat ölçümü.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },
  { id: 'cogmed_training', label: 'Cogmed Çalışma Belleği Eğitimi', description: 'Working Memory güçlendirme akreditasyonu.', category: 'INTELLECTUAL_COGNITIVE', verificationQuestions: [] },

  // 🗣️ DİL VE KONUŞMA TERAPİSİ
  {
    id: 'prompt_speech',
    label: 'PROMPT (Restructuring Oral Muscular Phonetic Targets)',
    description: 'Dokunsal-Kinestetik konuşma terapisi.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: [
      {
        id: 'vq_prompt_1', category: 'clinical', type: 'radio',
        text: 'Çocukta şiddetli "Konuşma Apraksisi" var. İlk aşamada dokunsal ipucu (input) derinliğiniz ne olmalıdır?',
        weightedOptions: [
          { label: 'Parametre Kontrolü: Çene stabilizasyonuna ve yüz kaslarının tonusuna odaklanan temel seviye dokunuşlarla motor planlamayı başlatırım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Uzman Klinisyen: Temel motor kontrolü önceliklendirme.' },
          { label: 'Yüzeyel Uyarım: Sadece ses çıkışını tetiklemek için dudak çevresi hızlı uyarıcılar veririm.', weights: { clinical: 0.6, personality: 0.8 }, analysisInsight: 'Hız Odaklı: Sonuç almak için yüzeyel kalan profil.' }
        ]
      }
    ]
  },
  { id: 'lidcombe_stuttering', label: 'Lidcombe Kekemelik Programı', description: 'Okul öncesi kekemelik müdahalesi.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'hanen_intl', label: 'Hanen (It Takes Two to Talk)', description: 'Aile odaklı dil geliştirme programı.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'tedil_test', label: 'TEDİL (Türkçe Erken Dil Gelişimi Testi)', description: 'TEMA-3 standardı yerel adaptasyon.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },
  { id: 'sos_feeding', label: 'SOS Approach to Feeding', description: 'Seçici yeme ve beslenme bozuklukları terapisi.', category: 'LANGUAGE_SPEECH', verificationQuestions: [] },

  // 🏃 ERGOTERAPİ & FİZYOTERAPİ
  {
    id: 'ayres_si',
    label: 'Ayres Sensory Integration (ASI)',
    description: 'Uluslararası Duyu Bütünleme Akreditasyonu (CLASI/SIE).',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_si_1', category: 'clinical', type: 'radio',
        text: 'Vesitbüler arayışı olan bir çocuk seansın ortasında "Kusma" belirtisi (Nausea) gösterirse aksiyonunuz ne olur?',
        weightedOptions: [
          { label: 'Otonom Güvenlik: Aktiviteyi derhal keser, çocuğu dik pozisyonda sabitler ve propriyoseptif (derin bası) girdi vererek parasempatik sistemi aktive ederim.', weights: { clinical: 1.0, sustainability: 1.0 }, analysisInsight: 'Klinik Refleks: Nörolojik tehlike sinyalini doğru okuma.' },
          { label: 'Duyarsızlaştırma: Belirtinin psikolojik olduğunu varsayar, yavaşlayarak ama aktiviteyi bitirmeden devam ederim.', weights: { clinical: 0.3, workEthics: 0.5 }, analysisInsight: 'Riskli Yaklaşım: Fizyolojik sınırı ihlal etme eğilimi.' }
        ]
      }
    ]
  },
  { id: 'bobath_ndt', label: 'Bobath (NDT) Sertifikalı Terapist', description: 'Nörogelişimsel Tedavi yaklaşımı.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'schroth_scoliosis', label: 'Schroth Metodu (Skolyoz)', description: '3 boyutlu skolyoz egzersizleri uzmanlığı.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'therasuit_method', label: 'Therasuit Method', description: 'Yoğun fizyoterapi ve uzay terapi sistemi.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },
  { id: 'co_op_approach', label: 'CO-OP (Cognitive Orientation to Occupational Performance)', description: 'Bilişsel yönelimli motor beceri eğitimi.', category: 'OCCUPATIONAL_PHYSIO', verificationQuestions: [] },

  // 📐 OKUMA YAZMA & MATEMATİK
  { id: 'dis_math', label: 'DIS-MATH (Diskalkuli Müdahale Seti)', description: 'Matematik öğrenme güçlüğü uzmanlığı.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'pass_math_prep', label: 'PASS Matematik Stratejileri', description: 'Bilişsel fonksiyonlar temelli matematik.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },
  { id: 'akil_oyunlari', label: 'Zeka ve Akıl Oyunları Eğitmenliği', description: 'Strateji ve mantık yürütme geliştirme.', category: 'ACADEMIC_SKILLS', verificationQuestions: [] },

  // 🤝 REHBERLİK & PSİKOLOJİ
  {
    id: 'emdr_intl',
    label: 'EMDR (1. ve 2. Düzey) Uygulayıcısı',
    description: 'Göz Hareketleriyle Duyarsızlaştırma ve Yeniden İşleme.',
    category: 'PSYCHOLOGY_GUIDANCE',
    verificationQuestions: [
      {
        id: 'vq_emdr_1', category: 'clinical', type: 'radio',
        text: 'İşleme (Processing) sırasında danışan "Disosiye" (Kopma) olursa ne yaparsınız?',
        weightedOptions: [
          { label: 'Topraklama (Grounding): Çift yönlü uyarımı durdurur, "Burada ve Şimdi" egzersizlerine geçer ve pencereyi daraltırım.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Klinik Güvenlik: Danışanı regüle etme ustalığı.' },
          { label: 'İşlemeye Devam: Travmanın boşalması için güvenli alanda kalarak uyarımı hızlandırırım.', weights: { clinical: 0.4, personality: 0.6 }, analysisInsight: 'Agresif Terapist: Risk yönetimi zayıf profil.' }
        ]
      }
    ]
  },
  { id: 'bdt_cbt_intl', label: 'Bilişsel Davranışçı Terapi (BDT) - Academy of CT', description: 'Kanıta dayalı psikoterapi akreditasyonu.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'play_therapy_adler', label: 'Adlerian / Çocuk Merkezli Oyun Terapisi', description: 'İlişki odaklı oyun terapisi uzmanlığı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'filial_therapy', label: 'Filial Terapi Eğitmenliği', description: 'Ebeveyn-çocuk ilişkisi güçlendirme.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] },
  { id: 'gottman_method', label: 'Gottman Çift Terapisi (Düzey 1-2)', description: 'Bilimsel temelli aile danışmanlığı.', category: 'PSYCHOLOGY_GUIDANCE', verificationQuestions: [] }
];
