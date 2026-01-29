
import { Candidate, AlgorithmicReport, AIReport, GlobalConfig } from './types';
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

/**
 * Gelişmiş Algoritmik Hesaplama Motoru
 * Config üzerinden gelen hassas ağırlıkları ve ceza katsayılarını kullanır.
 */
export const calculateAlgorithmicAnalysis = (candidate: Candidate, config?: GlobalConfig): AlgorithmicReport => {
  const scores: Record<string, number[]> = {
    ethics: [], pedagogy: [], clinical: [], crisis: [], resilience: [], fit: [], loyalty: [], formality: []
  };
  
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];

  const answers = candidate.answers || {};

  // Default değerler (Eğer config yoksa veya yeni yapıya geçilmediyse)
  const weights = config?.advancedAnalytics?.weights || {
    clinicalDepth: 25,
    ethicalIntegrity: 30,
    emotionalResilience: 20,
    institutionalLoyalty: 10,
    learningAgility: 15
  };

  const penalties = config?.advancedAnalytics?.penalties || {
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
        Object.entries(selectedOption.weights).forEach(([cat, weight]) => {
          const numericWeight = Number(weight);
          if (scores[cat]) scores[cat].push(numericWeight * 100);
        });

        // Kritik Etik İhlal Kontrolü
        if (selectedOption.weights.ethics && Number(selectedOption.weights.ethics) < 0.4) {
          riskFlags.push(`Kritik Etik Sınır İhlali Riski: ${q.id}`);
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
  
  // Alt Skor Hesaplamaları
  const retentionScore = Math.round((loyaltyScore * 0.7) + (fitScore * 0.3));
  const burnoutResistance = Math.round((resilienceScore * 0.8) + (clinicalScore * 0.2));

  // Tutarsızlık Kontrolü (Deneyim yüksek ama klinik bilgi düşükse)
  if (exp > 5 && clinicalScore < 50) {
    reliabilityPoints -= penalties.inconsistentAnswers;
    riskFlags.push("Deneyim/Yetkinlik Uyumsuzluğu");
  }

  // Deneyim İndirimi (Junior koruması veya cezası)
  let expMultiplier = 1;
  if (exp < 2) expMultiplier = penalties.lowExperienceDiscount;

  // Ağırlıklı Ortalama Hesaplama (Total Score)
  // Config'den gelen ağırlıklar toplamı 100 olmayabilir, normalize etmiyoruz, kullanıcı ayarı esastır.
  // Ancak toplam ağırlığa bölerek normalize etmek daha güvenlidir.
  const totalWeight = Object.values(weights).reduce((a,b) => a+b, 0) || 100;

  let rawScore = (
    (ethicsScore * weights.ethicalIntegrity) + 
    (clinicalScore * weights.clinicalDepth) + 
    (resilienceScore * weights.emotionalResilience) + 
    (fitScore * weights.institutionalLoyalty) +
    (agilityScore * weights.learningAgility)
  ) / totalWeight;

  // Çarpanları Uygula
  rawScore = rawScore * expMultiplier;

  // Reliability puanı üzerinden son kesinti
  if (reliabilityPoints < 80) {
      rawScore = rawScore * (reliabilityPoints / 100);
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
    riskFlags
  };
};
