
import { specialEducationQuestions } from './specialEducation';
import { languageSpeechQuestions } from './languageSpeech';
import { occupationalTherapyQuestions } from './occupationalTherapy';
import { pedagogyQuestions } from './pedagogy';
import { academicSkillsQuestions } from './academicSkills';
import { technoPedagogyQuestions } from './technoPedagogy';
import { teamMentorshipQuestions } from './teamMentorship';
import { ethicsQuestions } from './ethics';
import { resilienceQuestions } from './resilience';
import { visionQuestions } from './vision';
import { Question } from '../../types';

/**
 * YENİ GÜN AKADEMİ | MERKEZİ AKADEMİK SORU BANKASI v16.0
 * MIA (Modular Intelligence Architecture) tam uyumlu dizilim.
 */
export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  // 01. KLİNİK MUHAKEME ETABI (Clinical Logic)
  // Bu etapta adayların teknik derinliği ve akademik yetkinliği ölçülür.
  clinical_logic: [
    ...pedagogyQuestions,       // Metodolojik Muhakeme
    ...academicSkillsQuestions, // Türkçe/Matematik Altyapısı
    ...technoPedagogyQuestions, // Dijital Adaptasyon (AAC, VR, AI)
    ...specialEducationQuestions,
    ...languageSpeechQuestions,
    ...occupationalTherapyQuestions
  ],
  
  // 02. ETİK VE VELİ DİPLOMASİSİ ETABI (Ethics Parent)
  // Profesyonel mesafe ve kurumsal bütünlük testi.
  ethics_parent: ethicsQuestions,
  
  // 03. PSİKOLOJİK DAYANIKLILIK VE EKİP ETABI (Resilience Team)
  // Stres yönetimi ve Multidisipliner liderlik yetisi.
  resilience_team: [
    ...resilienceQuestions,     // Duygusal Direnç
    ...teamMentorshipQuestions   // Takım Çalışması ve Mentorluk
  ],
  
  // 04. VİZYON VE KURUMSAL SADAKAT ETABI (Vision Loyalty)
  // Uzun vadeli projeksiyon ve kariyer uyumu.
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
