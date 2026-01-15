
export enum Branch {
  OzelEgitim = 'Özel Eğitim Öğretmeni',
  Psikolog = 'Psikolog',
  Fizyoterapist = 'Fizyoterapist',
  Ergoterapist = 'Ergoterapist',
  DilKonusma = 'Dil ve Konuşma Terapisti',
  OkulOncesi = 'Okul Öncesi Öğretmeni',
  Odyolog = 'Odyolog'
}

export type Gender = 'Kadın' | 'Erkek' | 'Belirtilmemiş';

export interface FormStep {
  id: string;
  title: string;
  description: string;
}

export interface AIReport {
  score: number;
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
  ethicsScore: number;
  crisisManagementScore: number;
  experienceWeight: number;
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
  experienceYears: number;
  previousInstitutions: string;
  allTrainings: string[];
  answers: Record<string, string | string[]>;
  timestamp: number;
  status: 'pending' | 'interview_scheduled' | 'rejected' | 'hired' | 'withdrawn';
  adminNotes?: string;
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  cvData?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
  interviewSchedule?: {
    date: string;
    time: string;
    method: string;
    location: string;
    isNotificationSent: boolean;
  };
}

export interface GlobalConfig {
  institutionName: string;
  primaryColor: string;
  accentColor: string;
  aiTone: 'strict' | 'balanced' | 'empathetic';
  aiPersona: {
    skepticism: number; // 0-100
    empathy: number;    // 0-100
    formality: number;  // 0-100
  };
  aiWeights: {
    ethics: number;
    clinical: number;
    experience: number;
    fit: number;
  };
  automation: {
    autoEmailOnSchedule: boolean;
    requireCvUpload: boolean;
    allowMultipleApplications: boolean;
  };
  interviewSettings: {
    defaultDuration: number; // minutes
    bufferTime: number; // minutes
    autoStatusAfterInterview: boolean;
    defaultMeetingLink: string;
  };
  notificationEmail: string;
  lastUpdated: number;
}
