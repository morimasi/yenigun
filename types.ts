
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
  tags?: string[];
}

export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'text' | 'checkbox';
  options?: string[];
  weightedOptions?: WeightedOption[];
  requiredBranch?: Branch[];
}

export interface IntelligenceSegment {
  score: number;
  status: 'optimal' | 'warning' | 'critical';
  pros: string[];
  cons: string[];
  risks: string[];
  contradictions: string[]; // Beyan ile uygulama arasındaki çelişkiler
  competencyLevel: 'Junior' | 'Mid' | 'Senior' | 'Expert';
}

export interface AIReport {
  score: number;
  integrityIndex: number; // Dürüstlük ve Tutarlılık (0-100)
  socialMaskingScore: number; // Kendini saklama eğilimi (0-100)
  summary: string;
  recommendation: string;
  
  // 10 Boyutlu Derin Analiz (Faz 1 - Intelligence Layer)
  deepAnalysis: {
    personality: IntelligenceSegment;        // Kişilik & Mizaç
    formality: IntelligenceSegment;          // Resmiyet & Kurumsallık
    parentStudentRelations: IntelligenceSegment; // Veli-Öğrenci İlişkileri
    sustainability: IntelligenceSegment;     // Sürdürülebilirlik & Burnout
    developmentOpenness: IntelligenceSegment; // Gelişime Açıklık
    criticismTolerance: IntelligenceSegment;  // Eleştiriye Açıklık
    workEthics: IntelligenceSegment;         // İş Ahlakı & Etik
    pedagogicalAnalysis: IntelligenceSegment; // Pedagojik Analiz
    technicalExpertise: IntelligenceSegment;  // Alan Yeterliliği
    institutionalLoyalty: IntelligenceSegment; // Kurumsallık & Sadakat
  };

  predictiveMetrics: {
    retentionProbability: number;
    burnoutRisk: number;
    learningVelocity: number;
    leadershipPotential: number;
  };

  interviewGuidance: {
    strategicQuestions: string[];
    criticalObservations: string[];
    answerAnomalies: string[];
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
