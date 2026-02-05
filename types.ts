
// ... (Mevcut tipler korunur)

// GELİŞMİŞ SUNUM MİMARİSİ
export type SlideLayout = 
  | 'cover'           // Başlık ve Büyük Görsel
  | 'section_header'  // Bölüm Geçişi (Renkli)
  | 'split_left'      // Sol Metin, Sağ Görsel
  | 'split_right'     // Sağ Metin, Sol Görsel
  | 'full_visual'     // Tam Ekran Görsel + Overlay Metin
  | 'bullet_list'     // Klasik Maddeler
  | 'quote_center'    // Çarpıcı Alıntı
  | 'data_grid';      // İstatistiksel Veri

export type AnimationType = 'fade' | 'slide_up' | 'zoom_in' | 'pan_right' | 'blur_reveal' | 'none';
export type VisualStyle = 'minimalist' | 'corporate' | 'playful' | 'dark_mode' | 'academic' | 'warm_serenity';

export interface TrainingSlide {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  content?: string[];     // Bullet points veya paragraf
  speakerNotes?: string;  // Sunumu yapacak kişiye özel notlar
  
  // NÖRAL GÖRSEL KATMANI
  visualPrompt?: string;  // AI'ın görseli neden seçtiğine dair açıklaması
  imageKeyword?: string;  // Unsplash vb. için arama terimi (İngilizce)
  
  // ETKİLEŞİM KATMANI
  interactiveElement?: {
    type: 'quiz' | 'reflection' | 'poll';
    question: string;
    options?: string[];
    correctAnswer?: string;
  };
  
  durationSeconds?: number; // Otomatik oynatma için
}

export interface PresentationConfig {
  topic: string;
  contextData?: string; // Personelin eksik olduğu alanlar
  targetAudience: 'individual' | 'team' | 'parents' | 'management';
  tone: 'academic' | 'motivational' | 'strict' | 'workshop';
  depth: 'beginner' | 'intermediate' | 'expert';
  slideCount: number;
  visualStyle: VisualStyle;
  includeAnimations: boolean;
}

// Added missing ExportConfig interface
export interface ExportConfig {
  title: string;
  showWatermark: boolean;
  signatureRequired: boolean;
  theme: 'corporate' | 'modern' | 'minimalist';
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

// Added missing UniversalExportData interface
export interface UniversalExportData {
  type: string;
  entityName: string;
  referenceId: string;
  payload: any;
  config?: Partial<ExportConfig>;
}

export type ExportType = 'CANDIDATE_REPORT' | 'TALENT_POOL_ANALYTICS' | 'CLINICAL_SIMULATION' | 'STAFF_PERFORMANCE_DOSSIER' | 'TRAINING_CURRICULUM';

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

export type Gender = 'Erkek' | 'Kadın' | 'Belirtilmemiş';
export type MaritalStatus = 'Evli' | 'Bekar' | 'Belirtilmemiş';

export interface FormStep {
  id: string;
  title: string;
  description: string;
}

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
  uniqueKey?: string; 
}

export interface Certification {
  id: string;
  label: string;
  description: string;
  category: string;
  verificationQuestions: Question[];
}

export interface DeepAnalysisSegment {
  score: number;
  status: string;
  reasoning: string;
  clinicalNuances?: string;
  literatureReference?: string;
  teamImpact?: string;
  pros?: string[];
  cons?: string[];
  risks?: string[];
  behavioralIndicators?: string[];
}

export interface AIReport {
  score: number;
  integrityIndex: number;
  socialMaskingScore: number;
  summary: string;
  detailedAnalysisNarrative?: string;
  recommendation?: string;
  predictiveMetrics?: {
    retentionProbability: number;
    burnoutRisk: number;
    learningVelocity: number;
    leadershipPotential: number;
    evolutionPath: string;
    trajectory?: {
        month: number;
        meritScore: number;
        burnoutRisk: number;
        competencyLevel: string;
        strategicAdvice: string;
    }[];
  };
  deepAnalysis?: {
    [key: string]: DeepAnalysisSegment | undefined;
    workEthics?: DeepAnalysisSegment;
    technicalExpertise?: DeepAnalysisSegment;
    pedagogicalAnalysis?: DeepAnalysisSegment;
    parentStudentRelations?: DeepAnalysisSegment;
    sustainability?: DeepAnalysisSegment;
    institutionalLoyalty?: DeepAnalysisSegment;
    developmentOpenness?: DeepAnalysisSegment;
    formality?: DeepAnalysisSegment;
    criticismTolerance?: DeepAnalysisSegment;
    personality?: DeepAnalysisSegment;
    pedagogicalAgility?: DeepAnalysisSegment;
    parentalDiplomacy?: DeepAnalysisSegment;
    cognitiveAgility?: DeepAnalysisSegment;
    stabilityFactor?: DeepAnalysisSegment;
  };
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
    phases?: {
        questions: {text: string}[];
    }[];
  };
  presentationSlides?: TrainingSlide[];
  presentationConfig?: PresentationConfig;
  comparisonSnapshot?: any;
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

export type ArchiveCategory = 'TALENT_POOL' | 'FUTURE_REFERENCE' | 'DISQUALIFIED' | 'BLACK_LIST' | 'HIRED_CONTRACTED' | 'PRESENTATION_LIBRARY' | 'STAFF_HISTORY' | 'PERFORMANCE_SNAPSHOT' | 'TALENT_POOL_ANALYTICS';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  branch: string;
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
  answers: Record<string, string | number | string[]>;
  status: 'pending' | 'interview_scheduled' | 'hired' | 'rejected' | 'archived' | 'withdrawn';
  timestamp: number;
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
  assessmentHistory?: any[]; 
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

export enum ClinicalTestType {
  DMP_STRESS = 'DMP_STRESS',
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

export enum StaffRole {
  Admin = 'admin',
  Staff = 'staff',
  Mentor = 'mentor'
}

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
  completedBatteries?: string[];
  last_score?: number;
  all_trainings?: string[];
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
  status: 'sent' | 'failed' | 'pending';
  timestamp: number;
  errorMessage?: string;
}

export interface TrainingResource {
  type: 'pdf' | 'video' | 'article' | 'book';
  title: string;
  url?: string;
}

export interface TrainingUnit {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'simulation' | 'assignment' | 'supervision' | 'workshop';
  content: string; // Açıklama veya Link
  durationMinutes: number;
  isCompleted: boolean;
  aiRationale?: string; // AI bu üniteyi neden atadı?
  resources?: TrainingResource[]; // Ek kaynaklar
  successCriteria?: string; // Başarı ölçütü (Örn: %80 Quiz Puanı)
  status: 'pending' | 'in_progress' | 'completed';
  
  // YENİ: Her ünitenin kendi sunumu olabilir
  generatedPresentation?: TrainingSlide[]; 
}

export interface TrainingModule {
  id: string;
  title: string;
  focusArea: string; // Hangi yetkinliği hedefliyor? (Örn: Etik, Klinik)
  difficulty: 'basic' | 'intermediate' | 'advanced';
  units: TrainingUnit[];
  status: 'locked' | 'active' | 'completed';
  dueDate?: string;
  instructor?: string; // Eğitmen adı (Opsiyonel)
}

export interface IDP {
  id: string;
  staffId: string;
  createdAt: number;
  updatedAt: number;
  // Eski alanlar (Legacy Support)
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
  aiAnalysisSummary?: string;
  status: 'draft' | 'published' | 'archived';
}
