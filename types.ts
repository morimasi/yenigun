
export type NotificationType = 'NEW_CANDIDATE' | 'INTERVIEW_DUE' | 'CONFIG_CHANGE' | 'SYSTEM_ALERT' | 'STAFF_ACTION';
export type NotificationSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';

export interface SystemNotification {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: any;
  createdAt: number;
}

export interface MultimodalElement {
  id: string;
  type: 'text' | 'image_prompt' | 'symbol' | 'graph_logic' | 'interactive_case';
  content: any;
  metadata?: {
    animation?: 'fade' | 'slide' | 'zoom';
    importance?: 'normal' | 'critical';
    layout?: 'full' | 'half' | 'quarter';
  };
}

export interface TrainingQuiz {
  questions: {
    id: string;
    text: string;
    options: { label: string; isCorrect: boolean; feedback: string }[];
  }[];
}

export interface CustomTrainingSlide {
  id: string;
  title: string;
  elements: MultimodalElement[];
  speakerNotes: string;
  aiAdvice?: string;
  quiz?: TrainingQuiz; 
}

export interface CustomTrainingPlan {
  id: string;
  title: string;
  category: 'ORIENTATION' | 'CLINICAL' | 'ETHICS' | 'MANAGEMENT';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  targetBranches: Branch[] | 'ALL';
  slides: CustomTrainingSlide[];
  createdBy: string;
  createdAt: number;
  finalQuiz?: TrainingQuiz;
}

export enum Branch {
  OzelEgitim = 'Özel Eğitim',
  DilKonusma = 'Dil ve Konuşma Terapisi',
  Psikoloji = 'Psikoloji',
  Ergoterapi = 'Ergoterapi',
  Fizyoterapi = 'Fizyoterapi',
  PDR = 'PDR',
  OkulOncesi = 'Okul Öncesi',
  SinifOgretmenligi = 'Sınıf Öğretmenliği',
  Odyoloji = 'Odyoloji',
  OyunTerapisi = 'Oyun Terapisi'
}

export enum StaffRole {
  Admin = 'admin',
  Staff = 'staff',
  Mentor = 'mentor'
}

export type Gender = 'Erkek' | 'Kadın' | 'Belirtilmemiş';
export type MaritalStatus = 'Bekar' | 'Evli' | 'Diğer';

export interface Question {
  id: string;
  category: string;
  type: 'radio' | 'text' | 'checkbox';
  text: string;
  requiredBranch?: Branch[];
  weightedOptions?: {
    label: string;
    weights: Record<string, number>;
    analysisInsight: string;
    branchOverrides?: Record<string, Record<string, number>>;
  }[];
  options?: string[];
}

export interface AIReport {
  score: number;
  integrityIndex: number;
  socialMaskingScore: number;
  summary: string;
  detailedAnalysisNarrative: string;
  recommendation: string;
  predictiveMetrics?: {
    retentionProbability: number;
    burnoutRisk: number;
    learningVelocity: number;
    leadershipPotential: number;
    evolutionPath: string;
    trajectory?: any[];
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
    teamImpact?: string;
    literatureReference?: string;
  }>;
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  interviewGuidance?: {
    strategicQuestions?: string[];
    criticalObservations?: string[];
    simulationTasks?: string[];
    phases?: { questions: { text: string }[] }[];
  };
  presentationSlides?: TrainingSlide[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: Gender;
  maritalStatus: MaritalStatus;
  branch: Branch;
  university: string;
  department: string;
  experienceYears: number;
  previousInstitutions: string;
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
  timestamp: number;
  archiveCategory?: ArchiveCategory;
  archiveNote?: string;
  admin_notes?: string;
  interviewSchedule?: { date: string; time: string };
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

export type ArchiveCategory = 
  | 'TALENT_POOL' 
  | 'FUTURE_REFERENCE' 
  | 'DISQUALIFIED' 
  | 'BLACK_LIST' 
  | 'HIRED_CONTRACTED' 
  | 'PRESENTATION_LIBRARY'
  | 'STAFF_HISTORY'
  | 'PERFORMANCE_SNAPSHOT'
  | 'TALENT_POOL_ANALYTICS';

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
  report?: any;
  last_score?: number;
}

export interface Certification {
  id: string;
  label: string;
  description: string;
  category: string;
  verificationQuestions: Question[];
}

export interface ExportConfig {
  title: string;
  showWatermark: boolean;
  signatureRequired: boolean;
  theme: 'corporate' | 'modern' | 'minimal';
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

export interface UniversalExportData {
  type: string;
  entityName: string;
  referenceId: string;
  payload: any;
  config?: {
    title?: string;
  };
}

export enum ClinicalTestType {
  DMP_STRESS = 'DMP_STRESS_V4',
  ETHICAL_CONFLICT = 'ETHICAL_CONFLICT',
  PARENT_MANIPULATION = 'PARENT_MANIPULATION',
  CLINICAL_SKEPTICISM = 'CLINICAL_SKEPTICISM'
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
  staffId?: string;
  focusArea: string;
  identifiedGaps?: string[];
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
  aiRationale?: string;
  successCriteria?: string;
  resources?: { title: string; type: string }[];
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

export interface PresentationConfig {
  topic: string;
  targetAudience: 'team' | 'individual' | 'parents';
  tone: 'academic' | 'inspirational' | 'warning';
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
  status: 'sent' | 'failed' | 'pending';
  timestamp: number;
  errorMessage?: string;
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
}
