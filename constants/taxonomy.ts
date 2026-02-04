
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
 * Her branşın kendi "Kritik Yetkinlik" alanını belirler.
 */
export const BRANCH_CATEGORY_MULTIPLIERS: Record<string, Record<string, number>> = {
  [Branch.OzelEgitim]: { clinical: 1.2, ethics: 1.1, sustainability: 1.1, pedagogicalAnalysis: 1.2 },
  [Branch.DilKonusma]: { clinical: 1.3, technicalExpertise: 1.2, pedagogicalAnalysis: 1.1, ethics: 1.0 },
  [Branch.Psikoloji]: { ethics: 1.5, empathy: 1.4, institutionalLoyalty: 1.2, clinical: 0.8 },
  [Branch.Ergoterapi]: { clinical: 1.1, sustainability: 1.4, technicalExpertise: 1.3, empathy: 1.1 },
  [Branch.Fizyoterapi]: { clinical: 1.0, sustainability: 1.5, technicalExpertise: 1.4, ethics: 0.8 },
  [Branch.PDR]: { ethics: 1.3, empathy: 1.4, pedagogicalAnalysis: 1.3, institutionalLoyalty: 1.2 },
  // YENİ EKLENEN BRANŞLAR İÇİN AI KATSAYILARI
  [Branch.OkulOncesi]: { pedagogicalAnalysis: 1.4, sustainability: 1.2, empathy: 1.3, technicalExpertise: 0.9 },
  [Branch.SinifOgretmenligi]: { pedagogicalAnalysis: 1.3, academicSkills: 1.4, institutionalLoyalty: 1.1, clinical: 0.8 },
  [Branch.Odyoloji]: { technicalExpertise: 1.4, clinical: 1.3, empathy: 1.0, pedagogicalAnalysis: 0.8 },
  [Branch.OyunTerapisi]: { empathy: 1.5, clinical: 1.2, pedagogicalAnalysis: 1.1, sustainability: 1.0 }
};

export const TURKISH_UNIVERSITIES = [ "Hacettepe Üniversitesi", "Anadolu Üniversitesi", "İstanbul Üniversitesi", "Gazi Üniversitesi", "Marmara Üniversitesi", "Ankara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Orta Doğu Teknik Üniversitesi", "Boğaziçi Üniversitesi", "Bahçeşehir Üniversitesi", "Üsküdar Üniversitesi", "Bezmiâlem Vakıf Üniversitesi", "Biruni Üniversitesi" ];
export const TURKISH_DEPARTMENTS = [ "Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "Rehberlik ve Psikolojik Danışmanlık", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği", "Odyoloji", "Tıp Fakültesi (Çocuk Psikiyatrisi)" ];
