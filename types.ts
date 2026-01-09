
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

/**
 * Form adımları için gerekli tip tanımı (constants.tsx içindeki hata için eklendi)
 */
export interface FormStep {
  id: string;
  title: string;
  description: string;
}

export interface AIReport {
  score: number; // 0-100 Liyakat Skoru
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

/**
 * Algoritmik analiz sonuçları için gerekli tip tanımı (analysisUtils.ts ve components/CandidateReport.tsx içindeki hatalar için eklendi)
 */
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
  allTrainings: string;
  answers: Record<string, string | string[]>;
  timestamp: number;
  status: 'pending' | 'interview_scheduled' | 'rejected' | 'hired' | 'withdrawn';
  adminNotes?: string;
  report?: AIReport;
  // Algoritmik raporu adaya bağlamak için eklendi
  algoReport?: AlgorithmicReport;
  cvData?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
  // Mülakat takvimi yönetimi için eklendi
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
  aiTone: 'strict' | 'balanced' | 'empathetic';
  // App.tsx içindeki DEFAULT_CONFIG uyumluluğu için eklendi
  notificationEmail: string;
  lastUpdated: number;
}
