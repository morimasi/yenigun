
export type TrainingTheme = 'ACADEMIC_COLD' | 'CREATIVE_WARM' | 'MINIMAL_TECH' | 'OFFICIAL_MEB';
export type TargetAudience = 'STAFF_JUNIOR' | 'STAFF_SENIOR' | 'PARENTS' | 'ACADEMIC_BOARD';

export interface AcademicSealConfig {
  institutionName: string;
  headerAntet: boolean;
  signatureTitles: string[]; // ["Klinik Direktör", "Kurucu", "Psikolog"]
  footerNote: string;
  showWatermark: boolean;
}

export interface TrainingGenerationConfig {
  pedagogicalBias: 'ABA' | 'FLOORTIME' | 'ECSE' | 'NEURAL' | 'TRADITIONAL' | 'MONTESSORI';
  cognitiveLoad: 'JUNIOR' | 'PRO' | 'SUPERVISOR';
  audience: TargetAudience;
  theme: TrainingTheme;
  slideCount: number;
  includeVisuals: boolean;
  tone: 'academic' | 'inspirational' | 'warning' | 'analytical';
  academicConfig: AcademicSealConfig;
  temperature: number;
  thinkingBudget: number;
}

export interface CustomTrainingPlan {
  id: string;
  title: string;
  category: 'ORIENTATION' | 'CLINICAL' | 'ETHICS' | 'MANAGEMENT';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  targetBranches: Branch[] | 'ALL';
  curriculum: TrainingModule[];
  slides?: TrainingSlide[];
  finalQuiz?: TrainingQuiz;
  aiConfig?: TrainingGenerationConfig;
  createdBy: string;
  createdAt: number;
  updatedAt?: number;
}

export interface MultimodalElement {
  id: string;
  type: 'text' | 'image_prompt' | 'symbol' | 'graph_logic' | 'interactive_case' | 'quiz_block';
  content: any;
}

export interface TrainingSlide {
  id: string;
  type: 'title' | 'content' | 'interactive' | 'visual_split' | 'signature_page';
  title: string;
  content: string[];
  elements?: MultimodalElement[];
  speakerNotes: string;
  visualPrompt: string;
  // Added missing property used in PresentationStudio
  interactiveElement?: { question: string };
}

// @fix: Converted Branch to enum to fix 'Branch' only refers to a type errors.
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

export enum StaffRole { Admin = 'admin', Staff = 'staff', Mentor = 'mentor' }
export type Gender = 'Erkek' | 'Kadın' | 'Belirtilmemiş';
export type MaritalStatus = 'Bekar' | 'Evli' | 'Diğer';

export interface TrainingModule {
  id: string;
  title: string;
  focusArea: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'archived';
  units: TrainingUnit[];
}

export interface TrainingQuiz {
  questions: {
    id: string;
    text: string;
    options: { label: string; isCorrect: boolean; feedback: string }[];
  }[];
}

export interface IDP {
  id: string;
  staffId?: string;
  focusArea: string;
  curriculum: TrainingModule[];
  updatedAt?: number;
  // Added missing property used in DecisionSupportView
  roadmap?: {
    shortTerm: string;
    midTerm: string;
    longTerm: string;
  };
}

export interface PresentationConfig {
  topic: string;
  targetAudience: 'team' | 'individual' | 'parents';
  tone: 'academic' | 'inspirational' | 'warning';
  depth: 'beginner' | 'intermediate' | 'advanced';
  slideCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  experienceYears: number;
  university: string;
  department: string;
  status: 'pending' | 'interview_scheduled' | 'rejected' | 'hired' | 'withdrawn' | 'archived';
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  timestamp: number;
  answers: any;
  archiveCategory?: ArchiveCategory;
  archiveNote?: string;
  // @fix: Added missing properties used across the app
  age?: number;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  previousInstitutions?: string;
  allTrainings?: string[];
  cvData?: { base64: string; mimeType: string; fileName: string };
  adminNotes?: string;
  reminderNote?: string;
  interviewSchedule?: {
    date: string;
    time: string;
    location?: string;
  };
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

export interface UniversalExportData {
  type: string;
  entityName: string;
  referenceId: string;
  payload: any;
  config?: { title?: string };
}

export enum ClinicalTestType { DMP_STRESS = 'DMP_STRESS_V4' }

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

export interface TrainingUnit {
  id: string;
  title: string;
  type: string;
  content: string;
  durationMinutes: number;
  isCompleted: boolean;
  status: string;
  aiRationale?: string;
}

export interface FormStep { id: string; title: string; description: string; }

export interface SystemNotification {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: number;
}

// @fix: Added missing AIReport interface
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
    trajectory?: { month: string; meritScore: number }[];
  };
  deepAnalysis: Record<string, {
    score: number;
    status: string;
    reasoning: string;
    clinicalNuances: string;
    literatureReference: string;
    teamImpact: string;
    pros: string[];
    risks: string[];
    behavioralIndicators: string[];
    institutionalImpact?: string;
    label?: string;
  }>;
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  interviewGuidance?: {
    strategicQuestions: string[];
    criticalObservations: string[];
    simulationTasks: string[];
    phases?: { questions: { text: string }[] }[];
  };
}

// @fix: Added missing ExportConfig interface
export interface ExportConfig {
  title: string;
  showWatermark: boolean;
  signatureRequired: boolean;
  theme: 'corporate' | 'creative' | 'minimal';
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

// @fix: Added missing AlgorithmicReport interface
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

// @fix: Added missing ArchiveCategory type
export type ArchiveCategory = 
  | 'CANDIDATE_POOL' 
  | 'HIRED_CONTRACTED' 
  | 'DISQUALIFIED' 
  | 'BLACK_LIST' 
  | 'STAFF_HISTORY' 
  | 'TALENT_POOL_ANALYTICS' 
  | 'TRAINING_LIBRARY' 
  | 'PERFORMANCE_SNAPSHOT' 
  | 'STRATEGIC_PLAN' 
  | 'CLINICAL_CASE_STUDY';

// @fix: Added missing Question interface
export interface Question {
  id: string;
  category: string;
  type: 'radio' | 'textarea';
  text: string;
  options?: string[];
  weightedOptions?: {
    label: string;
    weights: Record<string, number>;
    analysisInsight: string;
    branchOverrides?: Record<string, Record<string, number>>;
  }[];
  requiredBranch?: Branch[];
}

// @fix: Added missing Certification interface
export interface Certification {
  id: string;
  label: string;
  description: string;
  category: string;
  verificationQuestions: Question[];
}

// @fix: Added missing AssessmentBattery interface
export interface AssessmentBattery {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  questions: AssessmentQuestion[];
}

// @fix: Added missing AssessmentQuestion interface
export interface AssessmentQuestion {
  id: string;
  text: string;
  options: {
    label: string;
    clinicalValue: number;
    aiTag: string;
  }[];
}

// @fix: Added missing StaffMember interface
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  branch: Branch;
  experience_years: number;
  status: 'active' | 'archived';
  phone?: string;
  university?: string;
  department?: string;
  report?: AIReport;
  last_score?: number;
  last_activity_date?: string;
  onboarding_complete?: boolean;
}

// @fix: Added missing Communication Center types
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
