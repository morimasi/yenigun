
export enum Branch {
  OzelEgitim = 'Özel Eğitim Öğretmenliği',
  DilKonusma = 'Dil ve Konuşma Terapisi',
  Ergoterapi = 'Ergoterapi',
  Fizyoterapi = 'Fizyoterapi ve Rehabilitasyon',
  Psikoloji = 'Psikoloji',
  PDR = 'Rehberlik ve Psikolojik Danışmanlık (PDR)',
  OkulOncesi = 'Okul Öncesi Öğretmenliği',
  SinifOgretmenligi = 'Sınıf Öğretmenliği',
  Odyoloji = 'Odyoloji',
  OyunTerapisi = 'Oyun Terapisi'
}

export type Gender = 'Erkek' | 'Kadın' | 'Belirtilmemiş';
export type MaritalStatus = 'Evli' | 'Bekar';

export enum ClinicalTestType {
  DMP_STRESS = 'DMP_STRESS',
  ETHICAL_DILEMMA = 'ETHICAL_DILEMMA',
  PARENT_MANIPULATION = 'PARENT_MANIPULATION'
}

export interface Question {
  id: string;
  text: string;
  category: string;
  type: 'radio' | 'text';
  options?: string[];
  requiredBranch?: Branch[];
  weightedOptions?: Array<{
    label: string;
    weights: Record<string, number>;
    analysisInsight?: string;
    branchOverrides?: Record<string, Record<string, number>>;
  }>;
}

export interface Certification {
  id: string;
  label: string;
  description: string;
  category: string;
  verificationQuestions: Question[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: Gender;
  branch: Branch | string;
  university: string;
  department: string;
  experienceYears: number;
  status: 'pending' | 'interview_scheduled' | 'rejected' | 'hired' | 'withdrawn' | 'archived';
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  archiveCategory?: ArchiveCategory;
  archiveNote?: string;
  timestamp: number;
  answers: Record<string, string | string[]>;
  cvData?: { base64: string; mimeType: string; fileName: string };
  interviewSchedule?: { date: string; time: string };
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
  branchComplianceScore: number;
}

export interface AIReport {
  score: number;
  integrityIndex: number;
  socialMaskingScore: number;
  summary: string;
  detailedAnalysisNarrative: string;
  recommendation: string;
  predictiveMetrics: {
    retentionProbability: number;
    burnoutRisk: number;
    learningVelocity: number;
    leadershipPotential: number;
    evolutionPath: string;
    trajectory?: Array<{
      month: number;
      meritScore: number;
      burnoutRisk: number;
      competencyLevel: string;
      strategicAdvice: string;
    }>;
  };
  deepAnalysis: Record<string, {
    score: number;
    status: 'OPTIMAL' | 'RISK' | 'BORDERLINE' | 'EXCEPTIONAL';
    reasoning: string;
    clinicalNuances: string;
    literatureReference: string;
    teamImpact: string;
    pros: string[];
    risks: string[];
    behavioralIndicators: string[];
  }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  interviewGuidance: {
    strategicQuestions: string[];
    criticalObservations: string[];
    simulationTasks: string[];
    phases?: Array<{
      title: string;
      questions: Array<{ text: string }>;
    }>;
  };
  presentationSlides?: TrainingSlide[];
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  branch: Branch;
  experience_years: number;
  last_score?: number;
  onboarding_complete: boolean;
  report?: AIReport;
  created_at: string;
  updated_at: string;
  university?: string;
  department?: string;
  all_trainings?: string[];
  phone?: string;
  status: 'active' | 'archived' | 'on_leave';
  assessment_count?: number;
}

export enum StaffRole {
  Admin = 'admin',
  Staff = 'staff',
  Mentor = 'mentor'
}

export interface IDP {
  id: string;
  staffId: string;
  createdAt: number;
  focusArea: string;
  identifiedGaps: string[];
  roadmap: {
    shortTerm: string;
    midTerm: string;
    longTerm: string;
  };
  recommendedTrainings: string[];
  milestones: Array<{
    title: string;
    isCompleted: boolean;
    dueDate: string;
  }>;
}

export interface TrainingSlide {
  id: string;
  type: 'title' | 'content' | 'case' | 'interaction';
  title: string;
  subtitle?: string;
  content: string[];
  speakerNotes: string;
  visualPrompt: string;
  interactiveElement?: {
    question: string;
    expectedAnswer: string;
    misconception: string;
  };
}

export interface PresentationConfig {
  topic: string;
  targetAudience: 'individual' | 'team' | 'parents' | 'management';
  tone: 'academic' | 'motivational' | 'strict' | 'workshop';
  depth: 'beginner' | 'intermediate' | 'expert';
  slideCount: number;
}

export type ArchiveCategory = 'TALENT_POOL' | 'FUTURE_REFERENCE' | 'DISQUALIFIED' | 'BLACK_LIST' | 'HIRED_CONTRACTED' | 'PRESENTATION_LIBRARY' | 'STAFF_HISTORY' | 'PERFORMANCE_SNAPSHOT';

export interface GlobalConfig {
  institutionName: string;
  primaryColor: string;
  accentColor: string;
  aiTone: string;
  aiPersona: { skepticism: number; empathy: number; formality: number };
  aiWeights: { ethics: number; clinical: number; experience: number; fit: number };
  automation: { autoEmailOnSchedule: boolean; requireCvUpload: boolean; allowMultipleApplications: boolean };
  interviewSettings: { defaultDuration: number; bufferTime: number; autoStatusAfterInterview: boolean; defaultMeetingLink: string };
  notificationEmail: string;
  lastUpdated: number;
  advancedAnalytics?: AdvancedAnalyticsConfig;
}

export interface AdvancedAnalyticsConfig {
  weights: {
    clinicalDepth: number;
    ethicalIntegrity: number;
    emotionalResilience: number;
    institutionalLoyalty: number;
    learningAgility: number;
    academicPedagogy?: number;
  };
  penalties: {
    criticalEthicalViolation: number;
    inconsistentAnswers: number;
    lowExperienceDiscount: number;
  };
  thresholds: {
    minHiringScore: number;
    highPotentialCutoff: number;
  };
  aiCognition: {
    skepticismLevel: number;
    innovationBias: number;
    stressTestIntensity: number;
  };
}

export type ExportType = 'CANDIDATE_REPORT' | 'STAFF_IDP' | 'METHODOLOGY_DOC' | 'TALENT_POOL_ANALYTICS' | 'CLINICAL_SIMULATION' | 'STAFF_PERFORMANCE_DOSSIER' | 'MENTOR_REPORT';

export interface ExportConfig {
  title: string;
  showWatermark: boolean;
  sections: Array<{ id: string; label: string; active: boolean }>;
  theme: 'corporate' | 'modern' | 'minimal';
  includeCharts: boolean;
  includeAiNarrative: boolean;
  signatureRequired: boolean;
}

export interface UniversalExportData {
  type: ExportType;
  entityName: string;
  referenceId: string;
  payload: any;
  config?: Partial<ExportConfig>;
}

export interface AssessmentBattery {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: Array<{
    label: string;
    clinicalValue: number;
    aiTag: string;
  }>;
}

export type CommChannel = 'email' | 'whatsapp' | 'sms';

export interface CommTemplate {
  id: string;
  name: string;
  subject?: string;
  body: string;
  channels: CommChannel[];
}

export interface NotificationLog {
  id: string;
  targetId: string;
  targetName: string;
  channel: CommChannel;
  status: 'sent' | 'failed';
  timestamp: number;
  errorMessage?: string;
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
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
