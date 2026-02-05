
import { Candidate, Branch, StaffMember, StaffRole, ClinicalTestType } from '../types';

export const MOCK_DATA = {
  // 1. STRATEJİK ADAY PROFİLLERİ
  candidates: [
    {
      id: 'CAND-7721',
      name: 'Uzm. Selin Demir',
      email: 'selin.demir@akademi.com',
      phone: '0532 000 11 22',
      branch: Branch.OzelEgitim,
      university: 'Ankara Üniversitesi',
      department: 'Özel Eğitim Öğretmenliği',
      experienceYears: 8,
      status: 'interview_scheduled',
      timestamp: Date.now() - 172800000,
      answers: { 
        clin_new_1: 'Diğer sınıflardan ve meslektaşlarımdan özür dilerim ancak klinik prosedürü o an bozmanın...', 
        eth_1: 'Talebi derhal reddederim ve durumu etik gereği kurum yönetimine raporlarım...' 
      },
      report: {
        score: 88,
        integrityIndex: 94,
        socialMaskingScore: 12,
        summary: "Selin Hanım, metodolojik sadakati sarsılmaz, veriye dayalı müdahale disiplini üst düzeyde olan 'Klinik Otorite' profilidir. ABA protokollerinde hatasız uygulama potansiyeli yüksektir.",
        detailedAnalysisNarrative: "Adayın kognitif esnekliği, zorlu vaka yönetiminde nöral stabiliteyi koruyabildiğini göstermektedir. Özellikle otizm spektrumundaki ağır davranış problemlerinde süpervizörlük yapabilecek derinliğe sahiptir.",
        predictiveMetrics: {
          retentionProbability: 92,
          burnoutRisk: 15,
          learningVelocity: 80,
          leadershipPotential: 85,
          evolutionPath: "2. yılında Kıdemli Klinik Süpervizör ve BEP Koordinatörü."
        },
        deepAnalysis: {
          technicalExpertise: { score: 95, status: 'EXCEPTIONAL', reasoning: 'Skinner prensiplerine tam hakimiyet.', clinicalNuances: 'Otoriter ama empatik sınır.', literatureReference: 'Lovaas & Bear (1987) ekolüne yakın.', teamImpact: 'Ekipte standartları yükseltir.', pros: ['Yüksek sadakat', 'Veri analizi'], risks: ['Aşırı kuralcılık'], behavioralIndicators: ['Net komutlar'] }
        },
        swot: { strengths: ['Metot Sadakati', 'BEP Tasarımı'], weaknesses: ['Esneklik Direnci'], opportunities: ['Mentorluk Rolü'], threats: ['Kurumsal Değişim Hızı'] },
        interviewGuidance: { strategicQuestions: ['Klinik bir hatanızı nasıl raporlarsınız?'], criticalObservations: ['Mimik kontrolü mükemmel.'], simulationTasks: ['Veli saldırganlığı simülasyonu.'] }
      }
    },
    {
        id: 'CAND-9910',
        name: 'Arda Yılmaz',
        email: 'arda.yilmaz@mail.com',
        phone: '0544 111 22 33',
        branch: Branch.DilKonusma,
        university: 'Hacettepe Üniversitesi',
        department: 'Dil ve Konuşma Terapisi',
        experienceYears: 1,
        status: 'pending',
        timestamp: Date.now() - 86400000,
        report: {
            score: 72,
            integrityIndex: 98,
            socialMaskingScore: 5,
            summary: "Gelecek vaat eden 'HiPo' (High Potential) adayı. Deneyimi az olmasına rağmen dürüstlük endeksi ve öğrenme hızı sistemdeki en yüksek %2'lik dilimdedir.",
            predictiveMetrics: { retentionProbability: 85, burnoutRisk: 40, learningVelocity: 95, leadershipPotential: 60, evolutionPath: "Hızlandırılmış mentorlukla 6 ayda bağımsız vaka yönetimi." }
        }
    }
  ],

  // 2. STAFF & ARMS VERİLERİ
  staff: [
    {
      id: 'STF-DEMO-1',
      name: 'Mentor Uzm. Caner Işık',
      email: 'caner.isik@yenigun.com',
      role: StaffRole.Mentor,
      branch: Branch.OzelEgitim,
      experience_years: 12,
      last_score: 94,
      onboarding_complete: true,
      report: { 
          summary: "Kurumsal hafızanın koruyucusu. Klinik denetim ve personel eğitimi konularında stratejik değer.",
          deepAnalysis: { technicalExpertise: { score: 98, status: 'EXCEPTIONAL' } }
      }
    }
  ],

  // 3. IDP / MÜFREDAT ÖRNEĞİ
  idp: {
    id: 'IDP-SAMPLE-001',
    staffId: 'STF-DEMO-1',
    focusArea: 'İleri Kriz Yönetimi ve Veli Psikopatolojisi',
    aiAnalysisSummary: "Personelin son 3 aylık stres testlerinde 'Veli Manipülasyonu' karşısında %15'lik bir klinik sapma gözlemlenmiştir. Bu müfredat, nöral stabilizasyon ve diplomatik dil inşası üzerine kurgulanmıştır.",
    curriculum: [
      {
        id: 'MOD-1',
        title: 'Bilişsel Çelişki ve Veli İkna Stratejileri',
        focusArea: 'Diplomasi',
        difficulty: 'advanced',
        status: 'active',
        units: [
          {
            id: 'UNIT-1',
            title: 'Sokratik Sorgulama ile Veli Direncini Kırma',
            type: 'simulation',
            content: 'Agresif veli profilinin 48 saatlik nöral modelleme üzerinden simüle edilmesi ve adayın 10 kritik noktada karar vermesi.',
            durationMinutes: 120,
            isCompleted: false,
            aiRationale: 'Son mülakatında veli suçlamalarına karşı savunmacı refleks gösterdiği saptanmıştır.',
            successCriteria: '%90 Empati Kalibrasyonu skoru.'
          }
        ]
      }
    ],
    roadmap: {
        shortTerm: "Kriz anı stabilizasyon teknikleri (Breathing & Logic).",
        midTerm: "Vaka konseylerinde moderatörlük rolü üstlenme.",
        longTerm: "Kurum içi Klinik Etik Kurulu başkanlığı."
      },
    milestones: [
        { title: 'Klinik Denetim Sertifikası', dueDate: '2024-06-30', isCompleted: true },
        { title: 'Makale Yayını (Otizm & Teknoloji)', dueDate: '2024-12-15', isCompleted: false }
    ]
  },

  // 4. KLİNİK LAB SİMÜLASYONU
  simulation: {
    test_type: 'DMP_STRESS',
    scenario: "Veli, çocuğun ders sırasında ağlamasını 'istismar' olarak nitelendirip sosyal medyada canlı yayın açmakla tehdit ediyor.",
    stress_level: 85,
    result_data: {
      parentPersona: "Yüksek kaygılı, kontrolcü ve tehditkar (Manipülatör).",
      candidateResponse: "Aday sakinliğini koruyarak veliyi kapalı bir odaya davet etti, kamera kayıtlarını izlemeyi teklif etti ancak ses tonundaki titreme %20'lik bir kognitif sızıntı işaret etti.",
      aiEvaluation: {
        ethicalBoundaryScore: 92,
        empathyCalibration: 65,
        professionalDistance: 88,
        crisisResolutionEfficiency: 70,
        clinicalTruths: ["Kamera şeffaflığı önerisi doğru hamle.", "Fiziksel temas kurmaması riski önledi."],
        criticalMistakes: ["Veliye çok fazla açıklama yaparak otoriteyi zayıflattı."],
        neuralDivergence: { contradictionIndex: 15, decisionPath: "Analitik -> Savunmacı (Hibrit)", alternativeOutcome: "Eğer özür dileseydi, suçu zımnen kabul etmiş sayılacaktı.", dominantEmotion: "Baskılanmış Kaygı" },
        microBehaviors: { toneAnalysis: "Tizleşme eğilimi", nonVerbalPrediction: "Göz temasından kaçınma", silenceTolerance: "Düşük (Boşluğu doldurmaya çalışıyor)" }
      }
    }
  }
};
