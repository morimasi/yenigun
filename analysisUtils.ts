
import { Candidate, AlgorithmicReport, WeightedOption } from './types';
import { BRANCH_QUESTIONS } from './constants';

export const calculateAlgorithmicAnalysis = (candidate: Candidate): AlgorithmicReport => {
  const scores: Record<string, number[]> = {
    ethics: [], pedagogy: [], clinical: [], crisis: [], resilience: [], fit: []
  };
  
  const riskFlags: string[] = [];
  const patterns: string[] = [];
  let reliabilityPoints = 100;

  Object.values(BRANCH_QUESTIONS).flat().forEach(q => {
    const answer = candidate.answers[q.id];
    if (q.type === 'radio' && q.weightedOptions && typeof answer === 'string') {
      const selectedOption = q.weightedOptions.find(o => o.label === answer);
      if (selectedOption) {
        scores[selectedOption.category].push(selectedOption.weight * 100);
        if (selectedOption.weight < 0.4) {
          riskFlags.push(`Kritik Karar Riski: "${q.text.slice(0, 30)}..."`);
        }
      }
    }
  });

  const getAvg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 70;

  const ethicsScore = getAvg(scores.ethics);
  const pedagogyScore = getAvg(scores.pedagogy);
  const clinicalScore = getAvg(scores.clinical);
  const crisisScore = getAvg(scores.crisis);
  const resilienceScore = getAvg(scores.resilience);
  const fitScore = getAvg(scores.fit);

  // FAZ 4: Prediktif Algoritmalar
  const exp = candidate.experienceYears || 0;
  
  // Bağlılık Skoru: Deneyim stabilitesi ve kurumsal uyum korelasyonu
  const retentionScore = Math.round((fitScore * 0.6) + (Math.min(exp * 5, 40)));
  
  // Tükenmişlik Direnci: Duygusal direnç ve kriz yönetimi korelasyonu
  const burnoutResistance = Math.round((resilienceScore * 0.7) + (crisisScore * 0.3));

  if (exp < 2 && (clinicalScore > 90 || ethicsScore > 90)) {
    reliabilityPoints -= 20;
    patterns.push("Teorik İdealizm");
  }

  const overallScore = Math.round(
    (ethicsScore * 0.25) + 
    (clinicalScore * 0.20) + 
    (pedagogyScore * 0.15) + 
    (crisisScore * 0.15) + 
    (resilienceScore * 0.15) + 
    (fitScore * 0.10)
  );

  return {
    overallScore,
    reliabilityIndex: reliabilityPoints,
    ethicsScore,
    experienceWeight: Math.min(exp * 10, 100),
    retentionScore,
    burnoutResistance,
    ethicsBreakdown: {
      confidentiality: ethicsScore,
      boundaries: resilienceScore,
      loyalty: fitScore,
      peerSupport: pedagogyScore
    },
    crisisManagementScore: crisisScore,
    pedagogyScore,
    clinicalScore,
    resilienceScore,
    fitScore,
    detectedPatterns: patterns,
    riskFlags
  };
};
