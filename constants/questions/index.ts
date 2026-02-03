
import { specialEducationQuestions } from './specialEducation';
import { languageSpeechQuestions } from './languageSpeech';
import { occupationalTherapyQuestions } from './occupationalTherapy';
import { pedagogyQuestions } from './pedagogy';
import { ethicsQuestions } from './ethics'; // Mevcut etik soruları korunuyor
import { resilienceQuestions } from './resilience'; // Mevcut direnç soruları korunuyor
import { visionQuestions } from './vision'; // Mevcut vizyon soruları korunuyor
import { Question } from '../../types';

/**
 * YENİ GÜN AKADEMİ | AKADEMİK SORU BANKASI v15.0
 * Branş bazlı modüler mimari ile optimize edilmiştir.
 */
export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  // ANA AKADEMİK ETAPLAR
  clinical_logic: [
    ...pedagogyQuestions,
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
  pedagogyQuestions
};
