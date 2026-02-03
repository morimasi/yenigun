
import { Candidate, AlgorithmicReport, GlobalConfig, Branch } from './types';
import { BRANCH_QUESTIONS } from './constants';
import { BRANCH_CATEGORY_MULTIPLIERS } from './constants/taxonomy';

export const calculateAlgorithmicAnalysis = (candidate: Candidate, config?: GlobalConfig): AlgorithmicReport => {
  const branch = candidate.branch as Branch;
  const multipliers = BRANCH_CATEGORY_MULTIPLIERS[branch] || {};
  
  const scores: Record<string, number[]> = {
    ethics: [], pedagogy: [], clinical: [], resilience: [], fit: [], loyalty: [], 
    agility: [], team: [], academicSkills: []
  };
  
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];
  const answers = candidate.answers || {};

  const weights: any = config?.advancedAnalytics?.weights || {
    clinicalDepth: 20,
    ethicalIntegrity: 20,
    emotionalResilience: 15,
    institutionalLoyalty: 10,
    learningAgility: 15,
    academicPedagogy: 10,
    teamLeadership: 10 // Yeni ağırlık katmanı
  };

  const penalties: any = config?.advancedAnalytics?.penalties || {
    criticalEthicalViolation: 25,
    inconsistentAnswers: 10,
    lowExperienceDiscount: 0.9
  };

  // Tüm Branş Sorularını Tara
  const allQs = Object.values(BRANCH_QUESTIONS).flat();
  
  allQs.forEach(q => {
    const answer = answers[q.id];
    if (q.type === 'radio' && q.weightedOptions && typeof answer === 'string') {
      const selectedOption = q.weightedOptions.find(o => o.label === answer);
      if (selectedOption) {
        const activeWeights = (selectedOption.branchOverrides && selectedOption.branchOverrides[branch]) 
          ? selectedOption.branchOverrides[branch] 
          : selectedOption.weights;

        Object.entries(activeWeights).forEach(([cat, weight]) => {
          const numericWeight = Number(weight);
          const multiplier = multipliers[cat] || 1.0;
          
          // Kategori Normalizasyonu (MIA Mapping)
          let target = cat;
          if (cat === 'workEthics') target = 'ethics';
          if (cat === 'technicalExpertise') target = 'clinical';
          if (cat === 'pedagogicalAnalysis') target = 'pedagogy';
          if (cat === 'sustainability') target = 'resilience';
          if (cat === 'developmentOpenness') target = 'agility';
          if (cat === 'team_player' || cat === 'leadership') target = 'team';
          if (cat === 'institutionalLoyalty') target = 'loyalty';

          if (scores[target]) {
            scores[target].push(numericWeight * 100 * multiplier);
          }
        });

        // Kritik Etik İhlal Kontrolü
        if (activeWeights.workEthics && Number(activeWeights.workEthics) < 0.2) {
          riskFlags.push(`Kritik Etik Sapma: ${q.id}`);
          reliabilityPoints -= penalties.criticalEthicalViolation;
        }
      }
    }
  });

  const getAvg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 70;

  const ethicsScore = getAvg(scores.ethics);
  const clinicalScore = getAvg(scores.clinical);
  const resilienceScore = getAvg(scores.resilience);
  const fitScore = getAvg(scores.fit);
  const loyaltyScore = getAvg(scores.loyalty);
  const agilityScore = getAvg(scores.agility);
  const teamScore = getAvg(scores.team);
  const academicScore = getAvg(scores.academicSkills);

  const exp = candidate.experienceYears || 0;
  const experienceWeight = Math.min(exp * 10, 100);
  
  // Kompozit Skorlar
  const retentionScore = Math.round((loyaltyScore * 0.6) + (fitScore * 0.4));
  const burnoutResistance = Math.round((resilienceScore * 0.7) + (clinicalScore * 0.3));

  let expMultiplier = exp < 2 ? penalties.lowExperienceDiscount : 1;

  const totalWeight = Object.values(weights).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number || 100;

  let rawScore = (
    (ethicsScore * (weights.ethicalIntegrity || 20)) + 
    (clinicalScore * (weights.clinicalDepth || 20)) + 
    (resilienceScore * (weights.emotionalResilience || 15)) + 
    (agilityScore * (weights.learningAgility || 15)) +
    (teamScore * (weights.teamLeadership || 10)) +
    (loyaltyScore * (weights.institutionalLoyalty || 10)) +
    (academicScore * (weights.academicPedagogy || 10))
  ) / totalWeight;

  rawScore = rawScore * expMultiplier;

  if (reliabilityPoints < 80) {
      rawScore = rawScore * (reliabilityPoints / 100);
  }

  return {
    overallScore: Math.min(100, Math.max(0, Math.round(rawScore))),
    reliabilityIndex: Math.max(0, reliabilityPoints),
    ethicsScore,
    experienceWeight,
    retentionScore,
    burnoutResistance,
    fitScore,
    riskFlags,
    branchComplianceScore: Math.round((clinicalScore + ethicsScore + academicScore + agilityScore) / 4)
  };
};
