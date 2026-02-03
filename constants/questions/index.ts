
import { specialEducationQuestions } from './specialEducation';
import { languageSpeechQuestions } from './languageSpeech';
import { occupationalTherapyQuestions } from './occupationalTherapy';
import { pedagogyQuestions } from './pedagogy';
import { academicSkillsQuestions } from './academicSkills';
import { ethicsQuestions } from './ethics';
import { resilienceQuestions } from './resilience';
import { visionQuestions } from './vision';
import { Question } from '../../types';

/**
 * YENİ GÜN AKADEMİ | AKADEMİK SORU BANKASI v15.5
 * Branş bazlı modüler mimari ile optimize edilmiştir.
 * Temel Akademik Beceriler (Türkçe & Matematik) modülü eklendi.
 */
export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  // ANA AKADEMİK ETAPLAR (Clinical Logic altında toplanır)
  clinical_logic: [
    ...pedagogyQuestions,
    ...academicSkillsQuestions, // Türkçe & Matematik ekleme noktası
    ...specialEducationQuestions,
    ...languageSpeechQuestions,
    ...occupationalTherapyQuestions
  ],
  
  // KURUMSAL VE ETİK ETAPLAR
  ethics_parent: ethicsQuestions,
  resilience_team: resilienceQuestions,
  vision_loyalty: visionQuestions
};

export {
  specialEducationQuestions,
  languageSpeechQuestions,
  occupationalTherapyQuestions,
  pedagogyQuestions,
  academicSkillsQuestions
};
