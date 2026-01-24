
import { Candidate, AlgorithmicReport, AIReport } from './types';
import { BRANCH_QUESTIONS } from './constants';

/**
 * Aday verilerinin ve AI raporunun birbirleriyle tutarlılığını denetleyen 
 * "Data Integrity Shield" (Veri Bütünlüğü Kalkanı) motoru.
 */
export const verifyCandidateIntegrity = (candidate: Candidate): { score: number, issues: string[], status: 'valid' | 'compromised' | 'warning' } => {
  const issues: string[] = [];
  let integrityScore = 100;

  if (!candidate.report || !candidate.algoReport) {
    return { score: 0, issues: ["Analiz henüz tamamlanmadı."], status: 'warning' };
  }

  const ai = candidate.report;
  const algo = candidate.algoReport;

  // Güvenli Erişim: deepAnalysis mevcut mu?
  if (!ai.deepAnalysis || typeof ai.deepAnalysis !== 'object') {
    return { score: 10, issues: ["Kritik Hata: AI raporunda yapısal matris verisi bulunamadı."], status: 'compromised' };
  }

  // 1. Skor Tutarlılığı Kontrolü (AI vs Algorithmic)
  const scoreDiff = Math.abs(ai.score - algo.overallScore);
  if (scoreDiff > 25) {
    integrityScore -= 25;
    issues.push("AI Muhakemesi ile Algoritmik Veri arasında yüksek sapma tespit edildi.");
  }

  // 2. Deneyim - Yetkinlik Doğrulaması
  if (candidate.experienceYears < 2 && ai.score > 90) {
    integrityScore -= 20;
    issues.push("Düşük deneyim yılına rağmen olağandışı yüksek liyakat skoru (Bilişsel Çelişki).");
  }

  // 3. Etik Sınır Denetimi
  if (ai.integrityIndex < 40 && ai.socialMaskingScore < 30) {
    integrityScore -= 15;
    issues.push("Düşük dürüstlük endeksi ile düşük maskeleme skoru mantıksal olarak çelişiyor.");
  }

  // 4. Derin Analiz Kapsam Kontrolü (Hata onarılan bölge)
  const segments = Object.keys(ai.deepAnalysis);
  if (segments.length < 8) {
    integrityScore -= 20;
    issues.push("Boyutsal matris analizinde eksik veri katmanları bulundu. Veri bütünlüğü düşük.");
  }

  let status: 'valid' | 'compromised' | 'warning' = 'valid';
  if (integrityScore < 50) status = 'compromised';
  else if (integrityScore < 80) status = 'warning';

  return { score: integrityScore, issues, status };
};

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
        Object.entries(selectedOption.weights).forEach(([cat, weight]) => {
          const numericWeight = Number(weight);
          if (scores[cat]) scores[cat].push(numericWeight * 100);
        });

        if (selectedOption.weights.ethics && Number(selectedOption.weights.ethics) < 0.4) {
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

  const exp = candidate.experienceYears || 0;
  const experienceWeight = Math.min(exp * 10, 100);
  const retentionScore = Math.round((loyaltyScore * 0.7) + (fitScore * 0.3));
  const burnoutResistance = Math.round((resilienceScore * 0.8) + (clinicalScore * 0.2));

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
