
export interface SimulationResult {
  scenario: string;
  parentPersona: string;
  stressLevel: number;
  candidateResponse: string;
  aiEvaluation: {
    ethicalBoundaryScore: number;
    empathyCalibration: number;
    professionalDistance: number;
    crisisResolutionEfficiency: number;
    criticalMistakes: string[];
  };
}

export interface NeuralPrediction {
  oneYearOutcome: 'Promotion' | 'Stability' | 'Burnout' | 'Turnover';
  predictionConfidence: number;
  behavioralPatterns: string[];
  suggestedMentorType: string;
  longTermCompatibilityScore: number;
}

export interface AIReport {
  score: number;
  integrityIndex: number;
  socialMaskingScore: number;
  summary: string;
  recommendation: string;
  deepAnalysis: Record<string, IntelligenceSegment>;
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
  simulation?: SimulationResult;
  neuralPrediction?: NeuralPrediction;
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

// Added FormStep interface to satisfy constants.tsx imports
export interface FormStep {
  id: string;
  title: string;
  description: string;
}

export interface WeightedOption {
  label: string;
  weights: {
    ethics?: number;
    pedagogy?: number;
    clinical?: number;
    crisis?: number;
    resilience?: number;
    fit?: number;
    formality?: number;
    loyalty?: number;
    // Added risk property to allow specific weighting in clinical logic questions
    risk?: number;
  };
  analysisInsight: string; // AI'ya bu seçeneğin neden seçilmiş olabileceğine dair ipucu
}

export interface Question {
  id: string;
  category: keyof AIReport['deepAnalysis'] | 'general';
  text: string;
  type: 'radio' | 'text';
  weightedOptions?: WeightedOption[];
  requiredBranch?: Branch[];
}

export interface IntelligenceSegment {
  score: number;
  status: 'optimal' | 'warning' | 'critical';
  pros: string[];
  cons: string[];
  risks: string[];
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
  aiPersona: { skepticism: number; empathy: number; formality: number; };
  aiWeights: { ethics: number; clinical: number; experience: number; fit: number; };
  automation: { autoEmailOnSchedule: boolean; requireCvUpload: boolean; allowMultipleApplications: boolean; };
  interviewSettings: { defaultDuration: number; bufferTime: number; autoStatusAfterInterview: boolean; defaultMeetingLink: string; };
  notificationEmail: string;
  lastUpdated: number;
}
