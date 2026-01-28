
// Types definition for Yeni Gün Akademi MIA (Modular Intelligence Architecture)
export enum ClinicalTestType {
  BEP_ADAPTATION = 'BEP/IEP Dinamik Adaptasyon',
  DMP_STRESS = 'DMP Stres Simülatörü',
  CONFLICT_MANAGEMENT = 'Multidisipliner Çatışma',
  DATA_LITERACY = 'Klinik Veri Okuryazarlığı',
  BOUNDARY_INTEGRITY = 'Veli-Öğretmen Sınır İhlali',
  COGNITIVE_FLEXIBILITY = 'Metot Değişimi ve Esneklik',
  DE_ESCALATION_REFLEX = 'Kriz ve Güvenlik Yönetimi',
  PARENT_MANIPULATION = 'Veli Sınır Testi'
}

export enum Branch {
  OzelEgitim = 'Özel Eğitim',
  DilKonusma = 'Dil ve Konuşma Terapisi',
  Ergoterapi = 'Ergoterapi',
  Fizyoterapi = 'Fizyoterapi',
  Psikoloji = 'Psikoloji',
  PDR = 'PDR',
  CocukGelimi = 'Çocuk Gelişimi',
  OkulOncesi = 'Okul Öncesi',
  SinifOgretmenligi = 'Sınıf Öğretmenliği'
}

export type Gender = 'Kadın' | 'Erkek' | 'Belirtilmemiş';
export type MaritalStatus = 'Bekar' | 'Evli' | 'Diğer';

/**
 * @fix Added FormStep interface to resolve import error in constants.tsx
 */
export interface FormStep {
  id: string;
  title: string;
  description: string;
}

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

export interface Certification {
  id: string;
  label: string;
  description: string;
  category: string;
  verificationQuestions: Question[]; // YENİ: Tek soru yerine 5'li test seti
}

/**
 * @fix Added SimulationResult interface to resolve missing type errors in multiple components
 */
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

export interface IntelligenceSegment {
  score: number;
  status: 'optimal' | 'warning' | 'critical';
  reasoning: string;
  behavioralIndicators: string[];
  institutionalImpact: string;
  pros: string[];
  cons: string[];
  risks: string[];
}

export interface AIReport {
  score: number;
  integrityIndex: number;
  socialMaskingScore: number;
  summary: string;
  detailedAnalysisNarrative: string;
  recommendation: string;
  deepAnalysis: Record<string, IntelligenceSegment>;
  predictiveMetrics: {
    retentionProbability: number;
    burnoutRisk: number;
    learningVelocity: number;
    leadershipPotential: number;
    evolutionPath: string;
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

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: Gender;
  maritalStatus: MaritalStatus;
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
