
import { Candidate, AlgorithmicReport, AIReport } from './types';
import { BRANCH_QUESTIONS } from './constants';

/**
 * Aday verilerinin ve AI raporunun birbirleriyle tutarlılığını denetleyen 
 * "Data Integrity Shield" (Veri Bütünlüğü Kalkanı) motoru.
 */
export const verifyCandidateIntegrity = (candidate: Candidate): { score: number, issues: string[], status: 'valid' | 'compromised' | 'warning' } => {
  const issues: string[] = [];
  let integrityScore = 100;

  // 1. Temel varlık kontrolü
  if (!candidate || !candidate.report || !candidate.algoReport) {
    return { score: 0, issues: ["Analiz henüz tamamlanmadı veya veriler eksik."], status: 'warning' };
  }

  const ai = candidate.report;
  const algo = candidate.algoReport;

  // 2. Yapısal bütünlük kontrolü
  if (!ai.deepAnalysis) {
     return { score: 10, issues: ["AI raporunda yapısal matris verisi bulunamadı."], status: 'compromised' };
  }

  // 3. Skor Tutarlılığı Kontrolü (AI vs Algorithmic)
  const scoreDiff = Math.abs((ai.score || 0) - (algo.overallScore || 0));
  if (scoreDiff > 25) {
    integrityScore -= 30;
    issues.push(`AI Klinik Görüşü ile Matematiksel Skor arasında yüksek sapma (%${scoreDiff.toFixed(1)}). Adayın cevapları çelişkili veya manipülatif olabilir.`);
  }

  // 4. Deneyim - Yetkinlik Doğrulaması
  if ((candidate.experienceYears || 0) < 2 && (ai.score || 0) > 90) {
    integrityScore -= 20;
    issues.push("Düşük deneyim yılına rağmen olağandışı yüksek AI liyakat skoru. (Potansiyel Sosyal Maskeleme tespiti)");
  }

  // 5. Etik Sınır Denetimi
  if ((ai.integrityIndex || 0) < 50 && (ai.socialMaskingScore || 0) > 60) {
    integrityScore -= 25;
    issues.push("Düşük dürüstlük endeksi ile yüksek maskeleme skoru arasında korelasyon hatası. Aday testi manipüle etmiş olabilir.");
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

  const answers = candidate.answers || {};

  Object.values(BRANCH_QUESTIONS).flat().forEach(q => {
    const answer = answers[q.id];
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
