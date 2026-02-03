import { AssessmentBattery } from '../../types';
import { advancedABAQuestions } from './questions/advancedABA';
import { academicSkillsQuestions } from './questions/academicSkills';
import { ethicsQuestions } from './questions/ethics';
import { technoPedagogyQuestions } from './questions/technoPedagogy';
import { teamMentorshipQuestions } from './questions/teamMentorship';
import { crisisLeadershipQuestions } from './questions/crisisLeadership';

/**
 * YENİ GÜN AKADEMİ | ARMS (Akademik Kaynak Yönetim Sistemi)
 * PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v23.0)
 * 
 * TASARIM PRENSİBİ: "Doğru cevap yoktur, tercih edilen uzman kimliği vardır."
 */

export const MODULAR_BATTERIES: AssessmentBattery[] = [
  {
    id: 'aba_mastery_20',
    title: 'İleri ABA ve Klinik Karar Mekanizmaları',
    description: 'Davranış analizi, veri takibi ve müdahale sadakati testi.',
    icon: '📊',
    category: 'clinical',
    questions: advancedABAQuestions
  },
  {
    id: 'academic_core_20',
    title: 'Temel Akademik Beceriler (Türkçe & Matematik)',
    description: 'Okuma-yazma hiyerarşisi ve sayısal muhakeme derinliği.',
    icon: '📖',
    category: 'academic',
    questions: academicSkillsQuestions
  },
  {
    id: 'ethics_arbitration_10',
    title: 'Etik Tahkim ve Profesyonel Mesafe',
    description: 'Sınır ihlalleri ve kurumsal entegrite analizi.',
    icon: '⚖️',
    category: 'ethics',
    questions: ethicsQuestions
  },
  {
    id: 'tech_pedagogy_10',
    title: 'Tekno-Pedagojik Adaptasyon',
    description: 'Eğitim teknolojileri ve AI entegrasyon hızı.',
    icon: '🚀',
    category: 'innovation',
    questions: technoPedagogyQuestions
  },
  {
    id: 'team_mentorship_10',
    title: 'Multidisipliner Takım ve Mentorluk',
    description: 'Ekip içi uyum ve kolektif zeka yetkinliği.',
    icon: '🤝',
    category: 'team',
    questions: teamMentorshipQuestions
  },
  {
    id: 'crisis_parent_10',
    title: 'Kriz Liderliği ve Veli Diplomasisi',
    description: 'Zorlu veli yönetimi ve kurumsal temsil gücü.',
    icon: '🔥',
    category: 'leadership',
    questions: crisisLeadershipQuestions
  }
];
