
export enum ClinicalTestType {
  BEP_ADAPTATION = 'BEP/IEP Dinamik Adaptasyon',
  DMP_STRESS = 'DMP Stres Simülatörü',
  CONFLICT_MANAGEMENT = 'Multidisipliner Çatışma',
  DATA_LITERACY = 'Klinik Veri Okuryazarlığı',
  BOUNDARY_INTEGRITY = 'Veli-Öğretmen Sınır İhlali',
  COGNITIVE_FLEXIBILITY = 'Metot Değişimi ve Esneklik'
}

export interface Certification {
  id: string;
  label: string;
  description: string;
  category: string;
  verificationQuestion: Question;
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  type: 'radio' | 'text';
  weightedOptions?: {
    label: string;
    weights: Record<string, number>;
    analysisInsight?: string;
  }[];
  options?: string[];
  requiredBranch?: Branch[];
}

export interface ClinicalTestResult {
  testType: ClinicalTestType;
  scenario: string;
  candidateResponse: string;
  evaluation: {
    logicScore: number;
    empathyScore: number;
    professionalismScore: number;
    scientificAccuracy: number;
    criticalNotes: string[];
  };
}

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
    clinicalTruths: string[];
    criticalMistakes: string[];
    neuralDivergence: {
      decisionPath: string;
      contradictionIndex: number;
      dominantEmotion: string;
      alternativeOutcome: string;
    };
    microBehaviors: {
      toneAnalysis: string;
      nonVerbalPrediction: string;
      silenceTolerance: string;
    };
  };
}

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

export interface AIReport {
  score: number;
  integrityIndex: number;
  socialMaskingScore: number;
  summary: string;
  recommendation: string;
  deepAnalysis: Record<string, IntelligenceSegment>;
  clinicalTests?: ClinicalTestResult[];
  predictiveMetrics: {
    retentionProbability: number;
    burnoutRisk: number;
    learningVelocity: number;
    leadershipPotential: number;
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

export interface IntelligenceSegment {
  score: number;
  status: 'optimal' | 'warning' | 'critical';
  pros: string[];
  cons: string[];
  risks: string[];
}

export enum Branch {
  OzelEgitim = 'Özel Eğitim Öğretmeni',
  Psikolog = 'Psikolog',
  Fizyoterapist = 'Fizyoterapist',
  Ergoterapist = 'Ergoterapist',
  DilKonusma = 'Dil ve Konuşma Terapisti',
  OkulOncesi = 'Okul Öncesi Öğretmeni',
  Odyolog = 'Odyolog',
  SinifOgretmeni = 'Sınıf Öğretmeni'
}

export type Gender = 'Kadın' | 'Erkek' | 'Belirtilmemiş';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  gender: Gender;
  branch: Branch;
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
