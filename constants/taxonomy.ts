
import { Branch } from '../types';

export const CERTIFICATION_CATEGORIES = [
  { id: 'AUTISM_SPECTRUM', label: 'Otizm Spektrum Bozukluğu', icon: '🧩' },
  { id: 'LEARNING_DISABILITIES', label: 'Özel Öğrenme Güçlüğü', icon: '📖' },
  { id: 'INTELLECTUAL_COGNITIVE', label: 'Zihin & Bilişsel', icon: '🧠' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi', icon: '🗣️' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi', icon: '🏃' },
  { id: 'ACADEMIC_SKILLS', label: 'Okuma Yazma & Matematik', icon: '📐' },
  { id: 'PSYCHOLOGY_GUIDANCE', label: 'Rehberlik & Psikoloji', icon: '🤝' }
];

/**
 * Branş Bazlı Kategori Ağırlık Çarpanları
 * Hangi branş için hangi analiz kategorisi daha 'kritik'?
 */
export const BRANCH_CATEGORY_MULTIPLIERS: Record<string, Record<string, number>> = {
  [Branch.OzelEgitim]: { clinical: 1.25, ethics: 1.1, sustainability: 1.15, empathy: 0.9 },
  [Branch.DilKonusma]: { clinical: 1.35, pedagogicalAnalysis: 1.2, technicalExpertise: 1.2, ethics: 1.0 },
  [Branch.Psikoloji]: { ethics: 1.6, empathy: 1.4, institutionalLoyalty: 1.2, clinical: 0.8 },
  [Branch.Ergoterapi]: { clinical: 1.2, sustainability: 1.4, technicalExpertise: 1.3, empathy: 1.0 },
  [Branch.Fizyoterapi]: { clinical: 1.1, sustainability: 1.5, ethics: 0.8, technicalExpertise: 1.4 },
  [Branch.PDR]: { ethics: 1.4, empathy: 1.5, pedagogicalAnalysis: 1.3, institutionalLoyalty: 1.1 }
};

export const TURKISH_UNIVERSITIES = [ /* ... (existing data) */ ];
export const TURKISH_DEPARTMENTS = [ /* ... (existing data) */ ];
