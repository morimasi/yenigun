
import { Candidate, AlgorithmicReport, AIReport, GlobalConfig, Branch } from './types';
import { BRANCH_QUESTIONS } from './constants';
import { BRANCH_CATEGORY_MULTIPLIERS } from './constants/taxonomy';

/**
 * Gelişmiş Algoritmik Hesaplama Motoru v10.0
 * Faz 3: Branş spesifik ağırlıklandırma ve dinamik multiplier sistemi entegre edildi.
 */
export const calculateAlgorithmicAnalysis = (candidate: Candidate, config?: GlobalConfig): AlgorithmicReport => {
  const branch = candidate.branch as Branch;
  const multipliers = BRANCH_CATEGORY_MULTIPLIERS[branch] || {};
  
  // @fix Added developmentOpenness to the initial scores map to ensure valid access during calculation
  const scores: Record<string, number[]> = {
    ethics: [], pedagogy: [], clinical: [], crisis: [], resilience: [], fit: [], loyalty: [], formality: [], developmentOpenness: []
  };
  
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];

  const answers = candidate.answers || {};

  const weights: any = config?.advancedAnalytics?.weights || {
    clinicalDepth: 25,
    ethicalIntegrity: 30,
    emotionalResilience: 20,
    institutionalLoyalty: 10,
    learningAgility: 15
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
        // Branş bazlı override var mı kontrol et?
        const activeWeights = (selectedOption.branchOverrides && selectedOption.branchOverrides[branch]) 
          ? selectedOption.branchOverrides[branch] 
          : selectedOption.weights;

        Object.entries(activeWeights).forEach(([cat, weight]) => {
          const numericWeight = Number(weight);
          // Multiplier'ı burada uygula
          const multiplier = multipliers[cat] || 1.0;
          if (scores[cat]) scores[cat].push(numericWeight * 100 * multiplier);
        });

        // Kritik Etik İhlal Kontrolü
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
  const agilityScore = getAvg(scores.developmentOpenness || []);

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

  // @fix Ensured numeric casting for weights summation to fix unknown operator errors
  const totalWeight = (Object.values(weights).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number) || 100;

  // @fix Applied explicit numeric casting to weights properties to resolve arithmetic operation errors on unknown types
  let rawScore = (
    (ethicsScore * (weights.ethicalIntegrity as number)) + 
    (clinicalScore * (weights.clinicalDepth as number)) + 
    (resilienceScore * (weights.emotionalResilience as number)) + 
    (fitScore * (weights.institutionalLoyalty as number)) +
    (agilityScore * (weights.learningAgility as number))
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
    branchComplianceScore: Math.round((clinicalScore + ethicsScore) / 2) // Branş Uyum Skoru
  };
};

/**
 * Aday verilerinin ve AI raporunun birbirleriyle tutarlılığını denetleyen 
 * "Data Integrity Shield"
 */
export const verifyCandidateIntegrity = (candidate: Candidate): { score: number, issues: string[], status: 'valid' | 'compromised' | 'warning' } => {
  const issues: string[] = [];
  let integrityScore = 100;

  if (!candidate || !candidate.report || !candidate.algoReport) {
    return { score: 0, issues: ["Analiz henüz tamamlanmadı."], status: 'warning' };
  }

  const ai = candidate.report;
  const algo = candidate.algoReport;

  if (!ai.deepAnalysis) {
     return { score: 10, issues: ["Nöral matris verisi eksik."], status: 'compromised' };
  }

  const scoreDiff = Math.abs((ai.score || 0) - (algo.overallScore || 0));
  if (scoreDiff > 25) {
    integrityScore -= 30;
    issues.push(`AI Görüşü ile Algoritmik Skor arasında Branş Sapması (%${scoreDiff.toFixed(1)}).`);
  }

  let status: 'valid' | 'compromised' | 'warning' = 'valid';
  if (integrityScore < 50) status = 'compromised';
  else if (integrityScore < 80) status = 'warning';

  return { score: integrityScore, issues, status };
};
