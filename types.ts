
// Added to fix constants.tsx import error
export interface FormStep {
  id: string;
  title: string;
  description: string;
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

export interface WeightedOption {
  label: string;
  weight: number; 
  category: 'ethics' | 'pedagogy' | 'clinical' | 'crisis' | 'resilience' | 'fit';
  tags?: string[]; // Faz 3: "red-flag", "social-mask" vb. etiketler
}

export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'text' | 'checkbox';
  options?: string[];
  weightedOptions?: WeightedOption[];
  requiredBranch?: Branch[];
}

export interface AIReport {
  score: number;
  integrityIndex: number; // Faz 3: Cevap tutarlılığı (0-100)
  socialMaskingScore: number; // Faz 3: Kendini iyi gösterme eğilimi (0-100)
  summary: string;
  recommendation: string;
  detailedAnalysis: {
    ethics: AnalysisSegment;
    pedagogy: AnalysisSegment;
    clinicalWisdom: AnalysisSegment;
    emotionalResilience: AnalysisSegment;
    institutionalFit: AnalysisSegment;
    stressResponse: AnalysisSegment;
  };
  interviewGuidance: {
    strategicQuestions: string[];
    criticalObservations: string[];
    answerAnomalies: string[];
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competencies: {
    name: string;
    value: number;
  }[];
}

export interface AlgorithmicReport {
  overallScore: number;
  reliabilityIndex: number;
  ethicsScore: number; // Added to fix analysisUtils.ts error
  experienceWeight: number; // Added to fix analysisUtils.ts error
  ethicsBreakdown: {
    confidentiality: number;
    boundaries: number;
    loyalty: number;
    peerSupport: number;
  };
  crisisManagementScore: number;
  pedagogyScore: number;
  clinicalScore: number;
  resilienceScore: number;
  fitScore: number;
  detectedPatterns: string[];
  riskFlags: string[];
}

export interface AnalysisSegment {
  score: number;
  comment: string;
  keyPoints: string[];
  shortTermImpact: string;
  longTermImplication: string;
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
