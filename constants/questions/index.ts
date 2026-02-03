
import { specialEducationQuestions } from './specialEducation';
import { languageSpeechQuestions } from './languageSpeech';
import { occupationalTherapyQuestions } from './occupationalTherapy';
import { pedagogyQuestions } from './pedagogy';
import { academicSkillsQuestions } from './academicSkills';
import { technoPedagogyQuestions } from './technoPedagogy';
import { teamMentorshipQuestions } from './teamMentorship'; // Yeni import
import { ethicsQuestions } from './ethics';
import { resilienceQuestions } from './resilience';
import { visionQuestions } from './vision';
import { Question } from '../../types';

/**
 * YENİ GÜN AKADEMİ | AKADEMİK SORU BANKASI v15.7
 * Branş bazlı modüler mimari ile optimize edilmiştir.
 */
export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  // ANA AKADEMİK ETAPLAR (Clinical Logic altında toplanır)
  clinical_logic: [
    ...pedagogyQuestions,
    ...academicSkillsQuestions,
    ...technoPedagogyQuestions,
    ...specialEducationQuestions,
    ...languageSpeechQuestions,
    ...occupationalTherapyQuestions
  ],
  
  // KURUMSAL VE ETİK ETAPLAR
  ethics_parent: ethicsQuestions,
  resilience_team: [
    ...resilienceQuestions,
    ...teamMentorshipQuestions // Takım ve Mentorluk ekleme noktası
  ],
  vision_loyalty: visionQuestions
};

export {
  specialEducationQuestions,
  languageSpeechQuestions,
  occupationalTherapyQuestions,
  pedagogyQuestions,
  academicSkillsQuestions,
  technoPedagogyQuestions,
  teamMentorshipQuestions
};
