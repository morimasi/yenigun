
import { Candidate, AlgorithmicReport } from './types';
import { BRANCH_QUESTIONS } from './constants';

export const calculateAlgorithmicAnalysis = (candidate: Candidate): AlgorithmicReport => {
  const scores: Record<string, number[]> = {
    ethics: [], pedagogy: [], clinical: [], crisis: [], resilience: [], fit: [], loyalty: [], formality: []
  };
  
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];

  Object.values(BRANCH_QUESTIONS).flat().forEach(q => {
    const answer = candidate.answers[q.id];
    if (q.type === 'radio' && q.weightedOptions && typeof answer === 'string') {
      const selectedOption = q.weightedOptions.find(o => o.label === answer);
      if (selectedOption) {
        // Vektörel ağırlıkları ilgili kategorilere dağıt
        Object.entries(selectedOption.weights).forEach(([cat, weight]) => {
          if (scores[cat]) scores[cat].push(weight * 100);
        });

        // Kritik risk tespiti
        if (selectedOption.weights.ethics && selectedOption.weights.ethics < 0.4) {
          riskFlags.push(`Kritik Etik Sınır İhlali Riski: ${q.id}`);
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

  // Deneyim-Liyakat Korelasyonu
  const exp = candidate.experienceYears || 0;
  const experienceWeight = Math.min(exp * 10, 100);

  // Prediktif Bağlılık ve Direnç
  const retentionScore = Math.round((loyaltyScore * 0.7) + (fitScore * 0.3));
  const burnoutResistance = Math.round((resilienceScore * 0.8) + (clinicalScore * 0.2));

  // Tutarlılık Kontrolü (Anomaly Detection)
  if (exp > 5 && clinicalScore < 50) {
    reliabilityPoints -= 15;
    riskFlags.push("Deneyim/Yetkinlik Uyumsuzluğu");
  }

  const overallScore = Math.round(
    (ethicsScore * 0.30) + 
    (clinicalScore * 0.25) + 
    (resilienceScore * 0.20) + 
    (fitScore * 0.15) + 
    (loyaltyScore * 0.10)
  );

  return {
    overallScore,
    reliabilityIndex: reliabilityPoints,
    ethicsScore,
    experienceWeight,
    retentionScore,
    burnoutResistance,
    fitScore,
    riskFlags
  };
};
