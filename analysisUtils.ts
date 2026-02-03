
import { Candidate, AlgorithmicReport, GlobalConfig, Branch } from './types';
import { BRANCH_QUESTIONS } from './constants';
import { BRANCH_CATEGORY_MULTIPLIERS } from './constants/taxonomy';

export const calculateAlgorithmicAnalysis = (candidate: Candidate, config?: GlobalConfig): AlgorithmicReport => {
  const branch = candidate.branch as Branch;
  const multipliers = BRANCH_CATEGORY_MULTIPLIERS[branch] || {};
  
  const scores: Record<string, number[]> = {
    ethics: [], pedagogy: [], clinical: [], crisis: [], resilience: [], fit: [], loyalty: [], formality: [], developmentOpenness: [],
    academicSkills: [] // Yeni Klinik Parametre
  };
  
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];
  const answers = candidate.answers || {};

  const weights: any = config?.advancedAnalytics?.weights || {
    clinicalDepth: 25,
    ethicalIntegrity: 25,
    emotionalResilience: 15,
    institutionalLoyalty: 10,
    learningAgility: 10,
    academicPedagogy: 15 // Yeni Ağırlık Katmanı
  };

  const penalties: any = config?.advancedAnalytics?.penalties || {
    criticalEthicalViolation: 25,
    inconsistentAnswers: 10,
    lowExperienceDiscount: 0.9
  };

  // Cevapların Analizi
  Object.values(BRANCH_QUESTIONS).flat().forEach(q => {
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
          
          // Kategori mapping
          let targetCat = cat;
          if (cat === 'pedagogicalAnalysis') targetCat = 'pedagogy';
          if (cat === 'workEthics') targetCat = 'ethics';
          if (cat === 'technicalExpertise') targetCat = 'clinical';
          
          if (scores[targetCat]) scores[targetCat].push(numericWeight * 100 * multiplier);
          else if (cat === 'academicSkills') scores.academicSkills.push(numericWeight * 100 * multiplier);
        });

        if (activeWeights.ethics && Number(activeWeights.ethics) < 0.4) {
          riskFlags.push(`Branş Etiği İhlal Riski: ${q.id}`);
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
  const agilityScore = getAvg(scores.developmentOpenness);
  const academicScore = getAvg(scores.academicSkills); // Yeni Skor

  const exp = candidate.experienceYears || 0;
  const experienceWeight = Math.min(exp * 10, 100);
  
  const retentionScore = Math.round((loyaltyScore * 0.7) + (fitScore * 0.3));
  const burnoutResistance = Math.round((resilienceScore * 0.8) + (clinicalScore * 0.2));

  if (exp > 5 && clinicalScore < 50) {
    reliabilityPoints -= penalties.inconsistentAnswers;
    riskFlags.push("Branş Deneyimi/Yetkinlik Uyumsuzluğu");
  }

  let expMultiplier = 1;
  if (exp < 2) expMultiplier = penalties.lowExperienceDiscount;

  const totalWeight = Object.values(weights).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number || 100;

  let rawScore = (
    (ethicsScore * (weights.ethicalIntegrity || 25)) + 
    (clinicalScore * (weights.clinicalDepth || 25)) + 
    (resilienceScore * (weights.emotionalResilience || 15)) + 
    (fitScore * (weights.institutionalLoyalty || 10)) +
    (agilityScore * (weights.learningAgility || 10)) +
    (academicScore * (weights.academicPedagogy || 15))
  ) / totalWeight;

  rawScore = rawScore * (expMultiplier as number);

  if ((reliabilityPoints as number) < 80) {
      rawScore = rawScore * ((reliabilityPoints as number) / 100);
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  return {
    overallScore,
    reliabilityIndex: Math.max(0, reliabilityPoints),
    ethicsScore,
    experienceWeight,
    retentionScore,
    burnoutResistance,
    fitScore,
    riskFlags,
    branchComplianceScore: Math.round((clinicalScore + ethicsScore + academicScore) / 3)
  };
};
