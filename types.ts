
export type TrainingTheme = 'ACADEMIC_COLD' | 'CREATIVE_WARM' | 'MINIMAL_TECH' | 'OFFICIAL_MEB' | 'GOLDEN_ACADEMY';
export type TargetAudience = 'YENI_EGITMENLER' | 'KIDEMLI_UZMANLAR' | 'VELILER' | 'AKADEMIK_KURUL' | 'YARDIMCI_PERSONEL';

export enum PedagogicalSchool {
  ABA = 'Uygulamalı Davranış Analizi (ABA)',
  Floortime = 'DIR Floortime',
  ETECOM = 'ETEÇOM (Etkileşim Temelli Müdahale)',
  Montessori = 'Özel Eğitimde Montessori',
  Waldorf = 'Waldorf Yaklaşımı',
  ECSE = 'Erken Çocuklukta Özel Eğitim',
  NeuralPedagogy = 'Nöro-Pedagojik Yaklaşım',
  Traditional = 'Geleneksel / MEB Müfredatı',
  TEACCH = 'TEACCH Programı',
  PEC = 'PECS / Alternatif İletişim'
}

export enum CognitiveLoad {
  Junior = 'Başlangıç (Junior) - Temel Kavramlar',
  Pro = 'İleri Düzey (Pro) - Klinik Uygulama',
  Supervisor = 'Denetçi (Supervisor) - Muhakeme ve Strateji'
}

export interface AcademicSealConfig {
  institutionName: string;
  headerAntet: boolean;
  signatureTitles: string[];
  footerNote: string;
  showWatermark: boolean;
  officialSeal: boolean; // Resmi Mühür
}

export interface TrainingGenerationConfig {
  pedagogicalBias: PedagogicalSchool;
  cognitiveLoad: CognitiveLoad;
  audience: TargetAudience;
  theme: TrainingTheme;
  slideCount: number;
  includeVisuals: boolean;
  hasEvaluation: boolean; // Eğitim sonu sınavı
  tone: 'academic' | 'inspirational' | 'warning' | 'analytical' | 'formal';
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
  status: 'active' | 'archived' | 'published';
}

export interface MultimodalElement {
  id: string;
  type: 'text' | 'image_prompt' | 'symbol' | 'graph_logic' | 'interactive_case' | 'quiz_block' | 'official_stamp';
  content: any;
}

export interface TrainingSlide {
  id: string;
  type: 'title' | 'content' | 'interactive' | 'visual_split' | 'signature_page' | 'official_header';
  title: string;
  content: string[];
  elements?: MultimodalElement[];
  speakerNotes: string;
  visualPrompt: string;
  interactiveElement?: {
    question: string;
  };
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

export enum StaffRole { Admin = 'admin', Staff = 'staff', Mentor = 'mentor' }
export type Gender = 'Erkek' | 'Kadın' | 'Belirtilmemiş';
export type MaritalStatus = 'Bekar' | 'Evli' | 'Diğer';

// @fix: Added TrainingUnit interface which was missing and used in StaffProfileView.tsx and DevelopmentRouteView.tsx.
export interface TrainingUnit {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'simulation' | 'assignment' | 'supervision' | 'workshop';
  content: string;
  durationMinutes: number;
  isCompleted: boolean;
  status: 'pending' | 'completed';
  aiRationale: string;
}

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

// @fix: Enhanced IDP interface with missing fields used in DevelopmentRouteView.tsx.
export interface IDP {
  id: string;
  staffId?: string;
  focusArea: string;
  curriculum: TrainingModule[];
  updatedAt?: number;
  status?: 'active' | 'archived';
  createdAt?: number;
  roadmap?: {
    shortTerm: string;
    midTerm: string;
    longTerm: string;
  };
}

// @fix: Refined StaffMember to use AIReport type and added onboarding_complete field.
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
  onboarding_complete?: boolean;
}

// @fix: Added Candidate interface used extensively for recruitment and initial intake.
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: Gender;
  branch: Branch;
  university: string;
  department: string;
  experienceYears: number;
  previousInstitutions: string;
  allTrainings: string[];
  cvData?: { base64: string; mimeType: string; fileName: string };
  answers: Record<string, string | string[]>;
  status: 'pending' | 'interview_scheduled' | 'rejected' | 'hired' | 'withdrawn' | 'archived';
  timestamp: number;
  report?: AIReport;
  algoReport?: AlgorithmicReport;
  archiveCategory?: ArchiveCategory;
  archiveNote?: string;
  admin_notes?: string;
  reminder_note?: string;
  interviewSchedule?: { date: string; time: string };
  maritalStatus?: MaritalStatus;
}

// @fix: Added Question interface for the modular question bank system.
export interface Question {
  id: string;
  category: string;
  type: 'radio' | 'text';
  text: string;
  requiredBranch?: Branch[];
  options?: string[];
  weightedOptions?: {
    label: string;
    weights: Record<string, number>;
    analysisInsight: string;
    branchOverrides?: Record<string, Record<string, number>>;
  }[];
  verificationQuestions?: Question[];
}

// @fix: Added Certification interface for methodological accreditation tracking.
export interface Certification {
  id: string;
  label: string;
  description: string;
  category: string;
  verificationQuestions: Question[];
}

// @fix: Added AIReport interface for the output of the Gemini analysis engine.
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
    trajectory?: { month: string; meritScore: number }[];
  };
  deepAnalysis: Record<string, {
    score: number;
    status: string;
    reasoning: string;
    clinicalNuances: string;
    literatureReference?: string;
    teamImpact?: string;
    institutionalImpact?: string;
    behavioralIndicators: string[];
    pros: string[];
    cons?: string[];
    risks: string[];
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
    criticalObservations?: string[];
    simulationTasks?: string[];
    phases?: { title: string; questions: { text: string }[] }[];
  };
}

// @fix: Added ExportConfig interface for the PDF/Print export customization.
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

// @fix: Added GlobalConfig interface for system-wide calibration and risk engine settings.
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

// @fix: Added AlgorithmicReport interface for raw data processing results.
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

// @fix: Added ArchiveCategory type for digital vault classification.
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

// @fix: Added UniversalExportData interface for the multi-module export studio.
export interface UniversalExportData {
  type: string;
  entityName: string;
  referenceId: string;
  payload: any;
  config?: { title: string };
}

// @fix: Added SimulationResult interface for the Clinical Lab stress test output.
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

// @fix: Added ClinicalTestType enum for the lab simulation protocols.
export enum ClinicalTestType {
  DMP_STRESS = 'DMP_STRESS',
  BOUNDARY_VIOLATION = 'BOUNDARY_VIOLATION',
  CLINICAL_ERROR_ADMISSION = 'CLINICAL_ERROR_ADMISSION',
  ETHICAL_DILEMMA = 'ETHICAL_DILEMMA'
}

// @fix: Added AssessmentBattery interface for staff competence testing.
export interface AssessmentBattery {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  questions: AssessmentQuestion[];
}

// @fix: Added AssessmentQuestion interface for staff batteries.
export interface AssessmentQuestion {
  id: string;
  text: string;
  options: {
    label: string;
    clinicalValue: number;
    aiTag: string;
  }[];
}

// @fix: Added PresentationConfig interface for the AI-driven slide generator.
export interface PresentationConfig {
  topic: string;
  targetAudience: string;
  tone: string;
  depth: string;
  slideCount: number;
}

// @fix: Added communication-related types (CommChannel, CommTemplate, NotificationLog).
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

// @fix: Added FormStep interface for intake flow management.
export interface FormStep {
  id: string;
  title: string;
  description: string;
}

// @fix: Added SystemNotification interface for the admin signaling center.
export interface SystemNotification {
  id: string;
  type: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: number;
  metadata?: any;
}
