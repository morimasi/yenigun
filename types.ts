
export enum ClinicalTestType {
  BEP_ADAPTATION = 'BEP/IEP Dinamik Adaptasyon',
  DMP_STRESS = 'DMP Stres Simülatörü',
  CONFLICT_MANAGEMENT = 'Multidisipliner Çatışma',
  DATA_LITERACY = 'Klinik Veri Okuryazarlığı',
  BOUNDARY_INTEGRITY = 'Veli-Öğretmen Sınır İhlali',
  COGNITIVE_FLEXIBILITY = 'Metot Değişimi ve Esneklik'
}

// Branch enum'ı eklendi
export enum Branch {
  OzelEgitim = 'Özel Eğitim',
  DilKonusma = 'Dil ve Konuşma Terapisi',
  Ergoterapi = 'Ergoterapi',
  Fizyoterapi = 'Fizyoterapi',
  Psikoloji = 'Psikoloji',
  OkulOncesi = 'Okul Öncesi',
  SinifOgretmenligi = 'Sınıf Öğretmenliği'
}

// Gender tipi eklendi
export type Gender = 'Kadın' | 'Erkek' | 'Belirtilmemiş';

export interface IntelligenceSegment {
  score: number;
  status: 'optimal' | 'warning' | 'critical';
  reasoning: string; // Skorun neden verildiğinin klinik açıklaması
  behavioralIndicators: string[]; // Cevaplardan saptanan somut davranışlar
  institutionalImpact: string; // Bu özelliğin kuruma uzun vadeli etkisi
  pros: string[];
  cons: string[];
  risks: string[];
}

export interface AIReport {
  score: number;
  integrityIndex: number;
  socialMaskingScore: number;
  summary: string;
  detailedAnalysisNarrative: string; // Genel akademik portre yorumu
  recommendation: string;
  deepAnalysis: Record<string, IntelligenceSegment>;
  predictiveMetrics: {
    retentionProbability: number;
    burnoutRisk: number;
    learningVelocity: number;
    leadershipPotential: number;
    evolutionPath: string; // Adayın 2 yıl sonraki muhtemel konumu
  };
  interviewGuidance: {
    strategicQuestions: string[];
    criticalObservations: string[];
    simulationTasks: string[];
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

// AlgorithmicReport arayüzü eklendi
export interface AlgorithmicReport {
  overallScore: number;
  reliabilityIndex: number;
  ethicsScore: number;
  experienceWeight: number;
  retentionScore: number;
  burnoutResistance: number;
  fitScore: number;
  riskFlags: string[];
}

// Question arayüzü eklendi
export interface Question {
  id: string;
  category: string;
  text: string;
  type: 'radio' | 'text' | 'checkbox';
  options?: string[];
  weightedOptions?: Array<{
    label: string;
    weights: Record<string, number | string>;
    analysisInsight: string;
  }>;
  requiredBranch?: string[];
}

// FormStep arayüzü eklendi
export interface FormStep {
  id: string;
  title: string;
  description: string;
}

// Certification arayüzü eklendi
export interface Certification {
  id: string;
  label: string;
  description: string;
  category: string;
  verificationQuestion: Question;
}

// SimulationResult arayüzü eklendi
export interface SimulationResult {
  scenario: string;
  parentPersona: string;
  candidateResponse: string;
  stressLevel: number;
  aiEvaluation: {
    ethicalBoundaryScore: number;
    empathyCalibration: number;
    professionalDistance: number;
    crisisResolutionEfficiency: number;
    criticalMistakes: string[];
    clinicalTruths: string[];
    neuralDivergence: {
      contradictionIndex: number;
      decisionPath: string;
      alternativeOutcome: string;
      dominantEmotion: string;
    };
    microBehaviors: {
      toneAnalysis: string;
      nonVerbalPrediction: string;
      silenceTolerance: string;
    };
  };
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  gender: Gender;
  branch: string;
  university: string;
  department: string;
  experienceYears: number;
  previousInstitutions: string;
  allTrainings: string[];
  answers: Record<string, string | string[]>;
  timestamp: number;
  status: 'pending' | 'interview_scheduled' | 'rejected' | 'hired' | 'withdrawn';
  adminNotes?: string;
  reminderNote?: string;
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  interviewSchedule?: {
    date: string;
    time: string;
    method: string;
    location: string;
  };
  cvData?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
}

export interface GlobalConfig {
  institutionName: string;
  primaryColor: string;
  accentColor: string;
  aiTone: 'strict' | 'balanced' | 'empathetic';
  aiWeights: { ethics: number; clinical: number; experience: number; fit: number; };
  aiPersona: { skepticism: number; empathy: number; formality: number; };
  automation: { autoEmailOnSchedule: boolean; requireCvUpload: boolean; allowMultipleApplications: boolean; };
  interviewSettings: { defaultDuration: number; bufferTime: number; autoStatusAfterInterview: boolean; defaultMeetingLink: string; };
  notificationEmail: string;
  lastUpdated: number;
}
