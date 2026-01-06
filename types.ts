
export enum Branch {
  OzelEgitim = 'Özel Eğitim Öğretmeni',
  Psikolog = 'Psikolog',
  Fizyoterapist = 'Fizyoterapist',
  Ergoterapist = 'Ergoterapist',
  DilKonusma = 'Dil ve Konuşma Terapisti',
  OkulOncesi = 'Okul Öncesi Öğretmeni'
}

export type UserRole = 'superadmin' | 'hr' | 'specialist' | 'viewer';

export interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  branch: Branch;
  experienceYears: number;
  answers: Record<string, string | string[]>;
  timestamp: number;
  status: 'pending' | 'scheduled' | 'rejected' | 'completed';
  interviewSchedule?: {
    date: string;
    time: string;
    location: string;
    method: 'Yüz Yüze' | 'Google Meet' | 'Zoom' | 'Telefon';
    notes?: string;
  };
  report?: AIReport;
  cvData?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
}

export interface AIReport {
  score: number;
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
  summary: string;
  cvSummary?: string;
  recommendation: string;
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  isActive?: boolean;
}

export interface AdminConfig {
  activeModules: string[];
  admins: AdminUser[];
  systemStatus: 'online' | 'maintenance';
}
