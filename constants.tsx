
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Akademik Kimlik', description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'te_1',
      category: 'technicalExpertise',
      text: 'Seans esnasında uyguladığınız metodun o anki vaka için riskli olabileceğine dair bir emare sezdiniz. Literatür bilgisi ile o anki gözleminiz çelişiyor. Kararınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Literatürü baz alır, seansı planlandığı gibi tamamlarım.', weights: { technical: 0.6, clinical: 0.5, resilience: 0.8 }, analysisInsight: 'Kuralcı akademik yaklaşım.' },
        { label: 'Seansı durdurur, risk analizi yapıp metodu modifiye ederim.', weights: { technical: 1.0, clinical: 1.0, development: 0.9 }, analysisInsight: 'Yüksek klinik muhakeme.' }
      ]
    },
    {
      id: 'te_2',
      category: 'technicalExpertise',
      text: 'Yeni bir vaka aldınız ve tanı dosyası ile sizin ilk gözleminiz arasında ciddi bir uçurum var. Nasıl ilerlersiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Tanı dosyasını kabul eder, programı ona göre hazırlarım.', weights: { technical: 0.4, formality: 1.0, clinical: 0.3 }, analysisInsight: 'Düşük inisiyatif, yüksek hiyerarşi uyumu.' },
        { label: 'Kendi değerlendirme araçlarımı kullanır, tanıyı sorgulayan bir rapor hazırlarım.', weights: { technical: 1.0, criticism: 0.8, clinical: 0.9 }, analysisInsight: 'Eleştirel klinik düşünme.' }
      ]
    },
    {
      id: 'pa_1',
      category: 'pedagogicalAnalysis',
      text: 'Çocuğun seansta sergilediği problem davranışın fonksiyonunu belirleyemediniz. Stratejiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Davranışı o an söndürmeye odaklanırım, analizi sonra yaparım.', weights: { pedagogy: 0.5, technical: 0.4, clinical: 0.4 }, analysisInsight: 'Müdahale odaklı, analiz zayıf.' },
        { label: 'ABC (Öncül-Davranış-Sonuç) kaydı tutmaya başlar, süpervizyon talep ederim.', weights: { pedagogy: 1.0, technical: 0.9, development: 1.0 }, analysisInsight: 'Bilimsel metodolojiye bağlılık.' }
      ]
    }
  ],
  ethics_parent: [
    {
      id: 'we_1',
      category: 'workEthics',
      text: 'Bir meslektaşınızın etik kuralları esnettiğini fark ettiniz. İlk adımınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Durumu doğrudan yönetime raporlarım.', weights: { ethics: 1.0, formality: 1.0, loyalty: 0.6 }, analysisInsight: 'Radikal kuralcılık.' },
        { label: 'Önce meslektaşımla konuşur, hatasını fark etmesini sağlarım.', weights: { ethics: 0.7, personality: 1.0, fit: 0.9 }, analysisInsight: 'Yapıcı takım oyuncusu.' }
      ]
    },
    {
      id: 'pr_1',
      category: 'parentStudentRelations',
      text: 'Veli, sosyal medyada sizinle arkadaşlık isteği gönderdi ve oradan çocuğun durumuyla ilgili sorular sormaya başladı.',
      type: 'radio',
      weightedOptions: [
        { label: 'İsteği kabul etmem, iletişim için kurumsal kanalları hatırlatırım.', weights: { parentRelations: 1.0, formality: 1.0, workEthics: 0.9 }, analysisInsight: 'Profesyonel mesafe koruma.' },
        { label: 'Kabul ederim ama sadece genel konularda konuşurum.', weights: { parentRelations: 0.4, formality: 0.5, workEthics: 0.3 }, analysisInsight: 'Sınır aşımı riski.' }
      ]
    }
  ],
  resilience_team: [],
  vision_loyalty: []
};

export const CERTIFICATIONS: Certification[] = [
  // LANGUAGE & SPEECH
  {
    id: 'prompt',
    label: 'PROMPT',
    description: 'Motor konuşma bozuklukları için dokunsal-kinestetik girdi sistemi.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestion: {
      id: 'vq_prompt',
      category: 'technicalExpertise',
      text: 'PROMPT uygulamasında "Parametre İstemi" ile "Yüzey İstemi" arasındaki temel ayrım klinik pratikte neyi belirler?',
      type: 'text'
    }
  },
  {
    id: 'lsvt',
    label: 'LSVT Loud',
    description: 'Parkinson ve nörolojik vakalar için yüksek yoğunluklu ses terapisi.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestion: {
      id: 'vq_lsvt',
      category: 'technicalExpertise',
      text: 'LSVT Loud protokolünün "tek hedef" (Single Focus) prensibi nöroplastisite açısından nasıl açıklanır?',
      type: 'text'
    }
  },
  {
    id: 'etecom',
    label: 'ETEÇOM',
    description: 'Etkileşim Temelli Erken Çocuklukta Müdahale Programı.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestion: {
      id: 'vq_etecom',
      category: 'technicalExpertise',
      text: 'ETEÇOM seansında "karşılıklı etkileşim" döngüsünün kırıldığı bir anda uzmanın birincil stratejisi ne olmalıdır?',
      type: 'text'
    }
  },
  // OCCUPATIONAL THERAPY
  {
    id: 'ayres',
    label: 'Ayres Duyu Bütünleme',
    description: 'Nörobiyolojik temelli duyusal işlemleme müdahalesi.',
    category: 'OCCUPATIONAL_THERAPY',
    verificationQuestion: {
      id: 'vq_ayres',
      category: 'technicalExpertise',
      text: 'Vestibüler ve Proprioseptif girdilerin "adaptif yanıt" üzerindeki modülatör etkisi klinik olarak nasıl gözlemlenir?',
      type: 'text'
    }
  },
  {
    id: 'floortime',
    label: 'DIR Floortime',
    description: 'Gelişimsel, bireysel farklılıklara dayalı ilişki temelli model.',
    category: 'OCCUPATIONAL_THERAPY',
    verificationQuestion: {
      id: 'vq_floortime',
      category: 'technicalExpertise',
      text: 'Adayın "Duygusal Gelişim Basamakları"nda (FEDL) 4. basamaktan 5. basamağa geçişte sembolik oyunun rolü nedir?',
      type: 'text'
    }
  },
  // PHYSIOTHERAPY
  {
    id: 'vojta',
    label: 'Vojta',
    description: 'Refleks lokomosyon temelli nörofizyolojik tedavi.',
    category: 'PHYSIOTHERAPY',
    verificationQuestion: {
      id: 'vq_vojta',
      category: 'technicalExpertise',
      text: 'Vojta terapisinde tetikleme noktalarına uygulanan basıncın MSS üzerindeki otomatik yanıt mekanizmasını açıklayınız.',
      type: 'text'
    }
  },
  {
    id: 'schroth',
    label: 'Schroth',
    description: 'Skolyoz için üç boyutlu egzersiz ve solunum terapisi.',
    category: 'PHYSIOTHERAPY',
    verificationQuestion: {
      id: 'vq_schroth',
      category: 'technicalExpertise',
      text: 'Schroth metodunda "rotasyonel solunum" tekniğinin kavisli segmentlerdeki düzeltici etkisi nedir?',
      type: 'text'
    }
  },
  // SPECIAL ED / ABA
  {
    id: 'aba_bcba',
    label: 'ABA (BCBA Onaylı)',
    description: 'Uygulamalı Davranış Analizi - Bilimsel davranış müdahalesi.',
    category: 'SPECIAL_ED_ABA',
    verificationQuestion: {
      id: 'vq_aba',
      category: 'technicalExpertise',
      text: 'Ayrı Denemelerle Öğretim (DTT) ile Doğal Öğretim Süreçleri (NET) arasındaki genelleme farkını klinik bir örnekle açıklayınız.',
      type: 'text'
    }
  },
  {
    id: 'pecs',
    label: 'PECS (Faz 1-6)',
    description: 'Resim Değiş Tokuşuna Dayalı İletişim Sistemi.',
    category: 'SPECIAL_ED_ABA',
    verificationQuestion: {
      id: 'vq_pecs',
      category: 'technicalExpertise',
      text: 'PECS 4. Fazda "Cümle Şeridi" kullanımı ile 5. Fazdaki "Sorulara Yanıt Verme" arasındaki bilişsel eşik nedir?',
      type: 'text'
    }
  }
];

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "İstanbul Üniversitesi", "Ankara Üniversitesi", "Gazi Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Ergoterapi", "Dil ve Konuşma Terapisi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji"];
