
export enum Branch {
  OzelEgitim = 'Özel Eğitim Öğretmeni',
  Psikolog = 'Psikolog',
  Fizyoterapist = 'Fizyoterapist',
  Ergoterapist = 'Ergoterapist',
  DilKonusma = 'Dil ve Konuşma Terapisti',
  OkulOncesi = 'Okul Öncesi Öğretmeni'
}

export type UserRole = 'superadmin' | 'hr' | 'specialist' | 'viewer';

export interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface GlobalConfig {
  institutionName: string;
  primaryColor: string;
  aiTone: 'strict' | 'balanced' | 'empathetic';
  notificationEmail: string;
  lastUpdated: number;
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

export interface InterviewFocusQuestion {
  question: string;
  targetCompetency: string;
  reason: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  branch: Branch;
  experienceYears: number;
  previousInstitutions: string;
  allTrainings: string;
  answers: Record<string, string | string[]>;
  timestamp: number;
  status: 'pending' | 'interview_scheduled' | 'rejected' | 'hired' | 'withdrawn';
  adminNotes?: string;
  interviewSchedule?: {
    date: string;
    time: string;
    location: string;
    method: 'Yüz Yüze' | 'Google Meet' | 'Zoom' | 'Telefon';
    notes?: string;
    isNotificationSent: boolean;
    aiFocusQuestions?: InterviewFocusQuestion[];
  };
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  cvData?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
}

export interface AIReport {
  score: number;
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
  categoricalScores: {
    category: string;
    score: number;
    average: number;
    label: string;
  }[];
  summary: string;
  recommendation: string;
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  isActive?: boolean;
}
