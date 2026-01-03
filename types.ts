
export enum Branch {
  OzelEgitim = 'Özel Eğitim Öğretmeni',
  Psikolog = 'Psikolog',
  Fizyoterapist = 'Fizyoterapist',
  Ergoterapist = 'Ergoterapist',
  DilKonusma = 'Dil ve Konuşma Terapisti',
  OkulOncesi = 'Okul Öncesi Öğretmeni'
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  branch: Branch;
  experienceYears: number;
  answers: Record<string, string | number>;
  timestamp: number;
  status: 'pending' | 'scheduled' | 'rejected';
  interviewSchedule?: {
    date: string;
    time: string;
    location: string;
    method: 'Yüz Yüze' | 'Online (Google Meet)' | 'Online (Zoom)';
  };
  cvData?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
  report?: AIReport;
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
}
