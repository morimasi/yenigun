
export enum StaffRole {
  Admin = 'admin',
  Staff = 'staff',
  Mentor = 'mentor'
}

// @fix: Added performance and status tracking fields to StaffMember
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  branch: Branch;
  experience_years: number;
  university?: string;
  department?: string;
  onboarding_complete?: boolean;
  status?: string;
  phone?: string;
  report?: AIReport;
  last_score?: number;
  last_activity_date?: string;
}

export interface AssessmentOption {
  label: string;
  clinicalValue: number;
  aiTag: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: AssessmentOption[];
}

export interface AssessmentBattery {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  questions: AssessmentQuestion[];
}

// @fix: Defined core enums and interfaces used across the MIA system
export enum Branch {
  OzelEgitim = 'Özel Eğitim Öğretmenliği',
  DilKonusma = 'Dil ve Konuşma Terapisi',
  Ergoterapi = 'Ergoterapi',
  Fizyoterapi = 'Fizyoterapi ve Rehabilitasyon',
  Psikoloji = 'Psikoloji',
  PDR = 'Rehberlik ve Psikolojik Danışmanlık',
  ÇocukGelişimi = 'Çocuk Gelişimi',
  OkulOncesi = 'Okul Öncesi Öğretmenliği',
  SinifOgretmenligi = 'Sınıf Öğretmenliği',
  Odyoloji = 'Odyoloji',
  OyunTerapisi = 'Oyun Terapisi'
}

export enum Gender {
  Erkek = 'Erkek',
  Kadin = 'Kadın',
  Belirtilmemis = 'Belirtilmemiş'
}

export enum MaritalStatus {
  Bekar = 'Bekar',
  Evli = 'Evli'
}

export interface Question {
  id: string;
  category: string;
  type: 'radio' | 'text';
  text: string;
  requiredBranch?: Branch[];
  weightedOptions?: Array<{
    label: string;
    weights: Record<string, number>;
    analysisInsight?: string;
    branchOverrides?: Record<string, Record<string, number>>;
  }>;
  options?: string[];
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
  maritalStatus?: MaritalStatus;
  branch: Branch;
  university: string;
  department: string;
  experienceYears: number;
  previousInstitutions?: string;
  allTrainings: string[];
  cvData?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
  answers: Record<string, string | string[]>;
  status: 'pending' | 'interview_scheduled' | 'rejected' | 'hired' | 'withdrawn' | 'archived';
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  archiveCategory?: ArchiveCategory;
  archiveNote?: string;
  adminNotes?: string;
  reminderNote?: string;
  interviewSchedule?: {
    date: string;
    time: string;
  };
  timestamp: number;
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

export enum ArchiveCategory {
  TALENT_POOL = 'TALENT_POOL',
  FUTURE_REFERENCE = 'FUTURE_REFERENCE',
  DISQUALIFIED = 'DISQUALIFIED',
  BLACK_LIST = 'BLACK_LIST',
  HIRED_CONTRACTED = 'HIRED_CONTRACTED',
  PRESENTATION_LIBRARY = 'PRESENTATION_LIBRARY',
  STAFF_HISTORY = 'STAFF_HISTORY',
  PERFORMANCE_SNAPSHOT = 'PERFORMANCE_SNAPSHOT',
  TALENT_POOL_ANALYTICS = 'TALENT_POOL_ANALYTICS'
}

export interface GlobalConfig {
  institutionName: string;
  lastUpdated: number;
  weightMatrix: {
    clinicalExpertise: number;
    ethicalIntegrity: number;
    emotionalResilience: number;
    institutionalLoyalty: number;
    learningAgility: number;
    academicPedagogy: number;
  };
  riskEngine: {
    criticalEthicalViolationPenalty: number;
    inconsistentAnswerPenalty: number;
    lowExperienceDiscountFactor: number;
    jobHoppingPenalty: number;
  };
  aiPersona: {
    skepticismLevel: number;
    innovationBias: number;
    stressTestIntensity: number;
    detailedReporting: boolean;
  };
  systemSettings: {
    minHiringScore: number;
    highPotentialCutoff: number;
    interviewDurationMinutes: number;
    autoRejectBelowScore: number;
    defaultMeetingLink: string;
  };
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
    status: string;
    reasoning: string;
    behavioralIndicators: string[];
    institutionalImpact: string;
    pros: string[];
    cons: string[];
    risks: string[];
    clinicalNuances?: string;
    literatureReference?: string;
    teamImpact?: string;
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

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  branch: Branch;
}

export enum ClinicalTestType {
  DMP_STRESS = 'DMP_STRESS',
  ETHICAL_DILEMMA = 'ETHICAL_DILEMMA',
  PARENT_CRISIS = 'PARENT_CRISIS',
  CLINICAL_RIGOR = 'CLINICAL_RIGOR'
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

export interface IDP {
  id: string;
  staffId: string;
  focusArea: string;
  identifiedGaps: string[];
  roadmap: {
    shortTerm: string;
    midTerm: string;
    longTerm: string;
  };
  curriculum: TrainingModule[];
  updatedAt?: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  focusArea: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'archived';
  units: TrainingUnit[];
}

export interface TrainingUnit {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'simulation' | 'assignment' | 'supervision' | 'workshop';
  content: string;
  durationMinutes: number;
  isCompleted: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  aiRationale: string;
  successCriteria?: string;
  resources?: Array<{ title: string; type: string }>;
}

export interface TrainingSlide {
  id: string;
  type: 'title' | 'content' | 'interactive';
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

export interface ExportConfig {
  title: string;
  showWatermark: boolean;
  signatureRequired: boolean;
  theme: 'corporate' | 'modern';
  sections: {
    cover: boolean;
    executiveSummary: boolean;
    competencyMatrix: boolean;
    behavioralDNA: boolean;
    swotAnalysis: boolean;
    futureProjection: boolean;
    interviewGuide: boolean;
    clinicalSimulation: boolean;
  };
}

export interface UniversalExportData {
  type: string;
  entityName: string;
  referenceId: string;
  payload: any;
  config?: Partial<ExportConfig>;
}

export interface PresentationConfig {
  topic: string;
  targetAudience: 'team' | 'individual' | 'parents';
  tone: 'academic' | 'inspirational' | 'corrective';
  depth: 'beginner' | 'intermediate' | 'advanced';
  slideCount: number;
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

export interface CustomTrainingPlan {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  targetBranches: Branch[] | 'ALL';
  slides: CustomTrainingSlide[];
  createdBy: string;
  createdAt: number;
  finalQuiz: TrainingQuiz;
}

export interface CustomTrainingSlide {
  id: string;
  title: string;
  elements: MultimodalElement[];
  speakerNotes: string;
}

export interface MultimodalElement {
  id: string;
  type: 'text' | 'image_prompt' | 'symbol' | 'interactive_case';
  content: any;
  metadata?: any;
}

export interface TrainingQuiz {
  questions: Array<{
    id: string;
    text: string;
    options: Array<{ label: string; isCorrect: boolean; feedback?: string }>;
  }>;
}
