

export type SlideLayout = 
  | 'cover'           // Başlık ve Büyük Görsel
  | 'section_header'  // Bölüm Geçişi (Renkli)
  | 'split_left'      // Sol Metin, Sağ Görsel
  | 'split_right'     // Sağ Metin, Sol Görsel
  | 'full_visual'     // Tam Ekran Görsel + Overlay Metin
  | 'bullet_list'     // Klasik Maddeler
  | 'quote_center'    // Çarpıcı Alıntı
  | 'data_grid'       // İstatistiksel Veri
  | 'process_flow';   // Süreç Akışı

export type VisualStyle = 
  | 'minimalist' 
  | 'corporate' 
  | 'playful' 
  | 'dark_mode' 
  | 'academic' 
  | 'warm_serenity' 
  | 'neuro_divergent';

export interface PresentationTheme {
  id: string;
  name: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundImageStyle: string; // CSS Filter / Style
}

export interface TrainingSlide {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  content?: string[];     
  speakerNotes?: string;  
  visualPrompt?: string;  
  imageKeyword?: string;  
  generatedImageUrl?: string; 
  animation?: 'fade' | 'slide_up' | 'zoom_in' | 'none';
  interactiveElement?: {
    type: 'quiz' | 'reflection' | 'poll';
    question: string;
    options?: string[];
    correctAnswer?: string;
  };
  // @fix: Added type property for presentation slide discrimination (title vs content)
  type?: 'title' | 'content';
}

export interface PresentationConfig {
  topic: string;
  contextData?: string; 
  targetAudience: 'individual' | 'team' | 'parents' | 'management';
  tone: 'academic' | 'motivational' | 'strict' | 'workshop' | 'empathetic';
  depth: 'beginner' | 'intermediate' | 'expert';
  slideCount: number;
  visualStyle: VisualStyle;
  includeAnimations: boolean;
  institutionName?: string;
}

export type ExportType = 'CANDIDATE_REPORT' | 'TALENT_POOL_ANALYTICS' | 'CLINICAL_SIMULATION' | 'STAFF_PERFORMANCE_DOSSIER' | 'TRAINING_CURRICULUM' | 'PRESENTATION_DOSSIER';

export interface UniversalExportData {
  type: ExportType | string;
  entityName: string;
  referenceId: string;
  payload: any;
  config?: any;
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

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  // @fix: Added phone property to StaffMember interface
  phone?: string;
  role: StaffRole;
  branch: Branch;
  experience_years: number;
  university?: string;
  department?: string;
  onboarding_complete?: boolean;
  status?: string;
  report?: any;
  last_score?: number;
}

export interface TrainingUnit {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'simulation' | 'assignment' | 'supervision' | 'workshop';
  content: string; 
  durationMinutes: number;
  isCompleted: boolean;
  aiRationale?: string; 
  successCriteria?: string; 
  status: 'pending' | 'in_progress' | 'completed';
  // @fix: Added resources property to TrainingUnit interface
  resources?: { title: string; type: string }[];
}

export interface TrainingModule {
  id: string;
  title: string;
  focusArea: string; 
  difficulty: 'basic' | 'intermediate' | 'advanced';
  units: TrainingUnit[];
  status: 'locked' | 'active' | 'completed';
}

export interface IDP {
  id: string;
  staffId: string;
  createdAt: number;
  updatedAt: number;
  focusArea: string;
  identifiedGaps: string[];
  roadmap: {
    shortTerm: string;
    midTerm: string;
    longTerm: string;
  };
  recommendedTrainings: string[];
  milestones: {
    title: string;
    dueDate: string;
    isCompleted: boolean;
  }[];
  curriculum?: TrainingModule[];
  status: 'draft' | 'published' | 'archived';
}

// --- MISSING TYPES ADDED BELOW ---

export type Gender = 'Erkek' | 'Kadın' | 'Belirtilmemiş';
export type MaritalStatus = 'Bekar' | 'Evli';

export interface Question {
  id: string;
  text: string;
  category: string;
  type: 'radio' | 'text';
  options?: string[];
  weightedOptions?: {
    label: string;
    weights: Record<string, number>;
    analysisInsight?: string;
    branchOverrides?: Record<string, Record<string, number>>;
  }[];
  requiredBranch?: Branch[];
}

export interface Certification {
  id: string;
  label: string;
  description: string;
  category: string;
  verificationQuestions: Question[];
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
    trajectory?: { month: number; meritScore: number }[];
  };
  deepAnalysis: Record<string, any>;
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
    phases?: { title: string; questions: { text: string }[] }[];
  };
  presentationSlides?: any[];
}

export interface ExportConfig {
  title: string;
  showWatermark: boolean;
  signatureRequired: boolean;
  theme: VisualStyle;
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
  aiTone?: string;
  aiWeights?: any;
  automation?: any;
  interviewSettings?: any;
  advancedAnalytics?: any;
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
  timestamp: number;
  archiveCategory?: ArchiveCategory;
  archiveNote?: string;
  admin_notes?: string;
  reminder_note?: string;
  interview_schedule?: {
    date: string;
    time: string;
  };
  interviewSchedule?: { // for compatibility
    date: string;
    time: string;
  };
}

export enum ClinicalTestType {
  DMP_STRESS = 'DMP_STRESS',
  ETHICAL_DILEMMA = 'ETHICAL_DILEMMA',
  PARENT_MANIPULATION = 'PARENT_MANIPULATION',
  CLINICAL_EMERGENCY = 'CLINICAL_EMERGENCY'
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

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: {
    label: string;
    clinicalValue: number;
    aiTag: string;
  }[];
}

export interface AssessmentBattery {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  questions: AssessmentQuestion[];
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
