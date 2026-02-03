
import { clinicalQuestions } from './clinical';
import { ethicsQuestions } from './ethics';
import { resilienceQuestions } from './resilience';
import { visionQuestions } from './vision';
import { Question } from '../../types';

/**
 * Yeni Gün Akademi | MIA Soru Bankası v12.0
 * İkilem Temelli Liyakat Sorgulama Motoru
 */
export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: clinicalQuestions, // Klinik Yeterlilik + Pedagojik Altyapı
  ethics_parent: ethicsQuestions,   // İş Etiği + Sınır + Sadakat
  resilience_team: resilienceQuestions, // Resilians + Gelişime Açıklık
  vision_loyalty: visionQuestions     // Vizyoner Projeksiyon
};
