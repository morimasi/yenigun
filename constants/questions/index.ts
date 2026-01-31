
import { clinicalQuestions } from './clinical';
import { ethicsQuestions } from './ethics';
import { resilienceQuestions } from './resilience';
import { visionQuestions } from './vision';
import { Question } from '../../types';

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: clinicalQuestions,
  ethics_parent: ethicsQuestions,
  resilience_team: resilienceQuestions,
  vision_loyalty: visionQuestions
};
