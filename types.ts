

export type SlideLayout = 
  | 'cover' | 'section_header' | 'split_left' | 'split_right' 
  | 'full_visual' | 'bullet_list' | 'quote_center' | 'data_grid' | 'process_flow'
  | 'decision_node'; // FAZ 3: Karar Noktası Layoutu

export type VisualStyle = 
  | 'minimalist' | 'corporate' | 'playful' | 'dark_mode' 
  | 'academic' | 'warm_serenity' | 'neuro_divergent';

// @fix: Added PresentationTheme interface to support theme definitions in PresentationStudio.
export interface PresentationTheme {
  id: string;
  name: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundImageStyle: string;
}

export type PersonaType = 'academic' | 'operational' | 'parent';

// FAZ 3: Dallanma Mantığı
export interface SlideConnection {
  targetId: string;
  condition: string; // AI tarafından kontrol edilecek sözel koşul
  label: string;    // Buton metni veya yol ismi
  probabilityScore?: number; // AI'nın adayın bu yolu seçme ihtimali tahmini
}

export interface TrainingSlide {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  content?: string[];     
  speakerNotes?: string;  
  visualPrompt?: string;  
  generatedImageUrl?: string; 
  type?: 'title' | 'content';
  internalReasoning?: string;
  
  // @fix: Added interactiveElement to support discussion questions in slides.
  interactiveElement?: {
    question: string;
  };
  
  // FAZ 3: Bağlantılar
  connections?: SlideConnection[]; 
  isRoot?: boolean;
  metadata?: {
    stressTrigger?: boolean;
    ethicsCheck?: boolean;
    clinicalDepth?: number;
  };
}

export interface HistoryState {
  past: TrainingSlide[][];
  present: TrainingSlide[];
  future: TrainingSlide[][];
}

export interface PresentationConfig {
  topic: string;
  slideCount: number;
  visualStyle: VisualStyle;
  targetAudience: string;
  depth: string;
  isSimulated?: boolean; // Dallanma aktif mi?
  // @fix: Added tone and includeAnimations to match component state requirements.
  tone?: string;
  includeAnimations?: boolean;
}
// ... (Diğer tipler korunur)
export type ExportType = 'CANDIDATE_REPORT' | 'TALENT_POOL_ANALYTICS' | 'CLINICAL_SIMULATION' | 'STAFF_PERFORMANCE_DOSSIER' | 'TRAINING_CURRICULUM' | 'PRESENTATION_DOSSIER';
export interface UniversalExportData { type: ExportType | string; entityName: string; referenceId: string; payload: any; config?: any; }
export enum Branch { OzelEgitim = 'Özel Eğitim', DilKonusma = 'Dil ve Konuşma Terapisi', Psikoloji = 'Psikoloji', Ergoterapi = 'Ergoterapi', Fizyoterapi = 'Fizyoterapi', PDR = 'PDR', OkulOncesi = 'Okul Öncesi', SinifOgretmenligi = 'Sınıf Öğretmenliği', Odyoloji = 'Odyoloji', OyunTerapisi = 'Oyun Terapisi' }
export enum StaffRole { Admin = 'admin', Staff = 'staff', Mentor = 'mentor' }
export interface StaffMember { id: string; name: string; email: string; phone?: string; role: StaffRole; branch: Branch; experience_years: number; university?: string; department?: string; onboarding_complete?: boolean; status?: string; report?: any; last_score?: number; all_trainings?: string[]; }
export interface TrainingUnit { id: string; title: string; type: 'video' | 'reading' | 'simulation' | 'assignment' | 'supervision' | 'workshop'; content: string; durationMinutes: number; isCompleted: boolean; aiRationale?: string; successCriteria?: string; status: 'pending' | 'in_progress' | 'completed'; resources?: { title: string; type: string }[]; }
export interface TrainingModule { id: string; title: string; focusArea: string; difficulty: 'basic' | 'intermediate' | 'advanced'; units: TrainingUnit[]; status: 'locked' | 'active' | 'completed'; }
export interface IDP { id: string; staffId: string; createdAt: number; updatedAt: number; focusArea: string; identifiedGaps: string[]; roadmap: { shortTerm: string; midTerm: string; longTerm: string; }; recommendedTrainings: string[]; milestones: { title: string; dueDate: string; isCompleted: boolean; }[]; curriculum?: TrainingModule[]; status: 'draft' | 'published' | 'archived'; }
export type Gender = 'Erkek' | 'Kadın' | 'Belirtilmemiş';
export type MaritalStatus = 'Bekar' | 'Evli';
export type ArchiveCategory = 'TALENT_POOL' | 'FUTURE_REFERENCE' | 'DISQUALIFIED' | 'BLACK_LIST' | 'HIRED_CONTRACTED' | 'PRESENTATION_LIBRARY' | 'STAFF_HISTORY' | 'PERFORMANCE_SNAPSHOT' | 'TALENT_POOL_ANALYTICS';
export interface AIReport { score: number; integrityIndex: number; socialMaskingScore: number; summary: string; detailedAnalysisNarrative: string; recommendation: string; predictiveMetrics: { retentionProbability: number; burnoutRisk: number; learningVelocity: number; leadershipPotential: number; evolutionPath: string; trajectory?: { month: number; meritScore: number; burnoutRisk: number; competencyLevel: string; strategicAdvice: string; }[]; }; deepAnalysis: Record<string, { score: number; status: string; reasoning: string; behavioralIndicators: string[]; institutionalImpact?: string; teamImpact?: string; clinicalNuances?: string; literatureReference?: string; pros: string[]; cons?: string[]; risks: string[]; }>; swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[]; }; interviewGuidance: { strategicQuestions: string[]; criticalObservations: string[]; simulationTasks: string[]; phases?: { questions: { text: string }[]; }[]; }; presentationSlides?: TrainingSlide[]; }
export interface AlgorithmicReport { overallScore: number; reliabilityIndex: number; ethicsScore: number; experienceWeight: number; retentionScore: number; burnoutResistance: number; fitScore: number; riskFlags: string[]; branchComplianceScore: number; }
export interface Candidate { id: string; name: string; email: string; phone: string; age: number; gender: Gender; maritalStatus?: MaritalStatus; branch: Branch; university: string; department: string; experienceYears: number; previousInstitutions?: string; allTrainings: string[]; cvData?: { base64: string; mimeType: string; fileName: string; }; answers: Record<string, string | string[]>; status: 'pending' | 'interview_scheduled' | 'rejected' | 'hired' | 'withdrawn' | 'archived'; report?: AIReport; algoReport?: AlgorithmicReport; timestamp: number; archiveCategory?: ArchiveCategory; archiveNote?: string; adminNotes?: string; reminderNote?: string; interviewSchedule?: { date: string; time: string; }; }
export interface GlobalConfig { institutionName: string; lastUpdated: number; weightMatrix: { clinicalExpertise: number; ethicalIntegrity: number; emotionalResilience: number; institutionalLoyalty: number; learningAgility: number; academicPedagogy: number; }; riskEngine: { criticalEthicalViolationPenalty: number; inconsistentAnswerPenalty: number; lowExperienceDiscountFactor: number; jobHoppingPenalty: number; }; aiPersona: { skepticismLevel: number; innovationBias: number; stressTestIntensity: number; detailedReporting: boolean; }; systemSettings: { minHiringScore: number; highPotentialCutoff: number; interviewDurationMinutes: number; autoRejectBelowScore: number; defaultMeetingLink: string; }; aiTone?: string; aiWeights?: any; automation?: any; interviewSettings?: any; advancedAnalytics?: any; }
export enum Branch { OzelEgitim = 'Özel Eğitim', DilKonusma = 'Dil ve Konuşma Terapisi', Psikoloji = 'Psikoloji', Ergoterapi = 'Ergoterapi', Fizyoterapi = 'Fizyoterapi', PDR = 'PDR', OkulOncesi = 'Okul Öncesi', SinifOgretmenligi = 'Sınıf Öğretmenliği', Odyoloji = 'Odyoloji', OyunTerapisi = 'Oyun Terapisi' }
export enum StaffRole { Admin = 'admin', Staff = 'staff', Mentor = 'mentor' }
export interface StaffMember { id: string; name: string; email: string; phone?: string; role: StaffRole; branch: Branch; experience_years: number; university?: string; department?: string; onboarding_complete?: boolean; status?: string; report?: any; last_score?: number; all_trainings?: string[]; }
export interface SimulationResult { scenario: string; parentPersona: string; candidateResponse: string; stressLevel: number; aiEvaluation: { ethicalBoundaryScore: number; empathyCalibration: number; professionalDistance: number; crisisResolutionEfficiency: number; clinicalTruths: string[]; criticalMistakes: string[]; neuralDivergence: { contradictionIndex: number; decisionPath: string; alternativeOutcome: string; dominantEmotion: string; }; microBehaviors: { toneAnalysis: string; nonVerbalPrediction: string; silenceTolerance: string; }; }; }
export interface AssessmentQuestion { id: string; text: string; options: { label: string; clinicalValue: number; aiTag: string; }[]; }
export interface AssessmentBattery { id: string; title: string; description: string; icon: string; category: string; questions: AssessmentQuestion[]; }
export type CommChannel = 'email' | 'sms' | 'whatsapp';
export interface CommTemplate { id: string; name: string; subject?: string; body: string; channels: CommChannel[]; }
export interface NotificationLog { id: string; targetId: string; targetName: string; channel: CommChannel; status: 'sent' | 'failed' | 'pending'; timestamp: number; errorMessage?: string; }
export interface FormStep { id: string; title: string; description: string; }
export interface Question { id: string; category: string; type: 'radio' | 'checkbox' | 'text'; text: string; options?: string[]; requiredBranch?: Branch[]; weightedOptions?: { label: string; weights: Record<string, number>; analysisInsight?: string; branchOverrides?: Record<string, Record<string, number>>; }[]; uniqueKey?: string; }
export interface Certification { id: string; label: string; description: string; category: string; verificationQuestions: Question[]; }
export interface ExportConfig { title: string; showWatermark: boolean; signatureRequired: boolean; theme: VisualStyle; sections: { cover: boolean; executiveSummary: boolean; competencyMatrix: boolean; behavioralDNA: boolean; swotAnalysis: boolean; futureProjection: boolean; interviewGuide: boolean; clinicalSimulation: boolean; }; }
