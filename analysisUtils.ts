
import { Candidate, AlgorithmicReport, Branch } from './types';

/**
 * Yeni Gün Akademi - Stratejik Analiz Motoru v6.0
 * Deterministik dürüstlük ve profesyonel tutarlılık denetimi.
 */
export const calculateAlgorithmicAnalysis = (candidate: Candidate): AlgorithmicReport => {
  let ethicsPoints = 0;
  let crisisPoints = 0;
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];
  const patterns: string[] = [];

  const answers = candidate.answers;
  const exp = candidate.experienceYears || 0;
  const trainings = candidate.allTrainings?.toLowerCase() || '';
  
  // 1. DÜRÜSTLÜK & MANTIK DENETİMİ (CV CROSS-CHECK)
  const advancedKeywords = ['aba', 'denver', 'wisc', 'floortime', 'disleksi', 'otizm', 'pecs'];
  const trainingCount = advancedKeywords.filter(kw => trainings.includes(kw)).length;

  // Tutarsızlık: Düşük deneyime rağmen çok fazla ileri düzey eğitim beyanı
  if (exp < 2 && trainingCount > 4) {
    reliabilityPoints -= 30;
    riskFlags.push("İstisnai Eğitim Yoğunluğu: Düşük kıdeme rağmen beyan edilen sertifika sayısı hayatın olağan akışıyla çelişiyor (CV Şişirme Riski).");
  }

  // Tutarsızlık: Yüksek deneyime rağmen branşın temel eğitimlerinin eksikliği
  if (exp > 10 && trainingCount < 1) {
    reliabilityPoints -= 15;
    riskFlags.push("Mesleki Statiklik: Uzun deneyim süresine rağmen güncel metodolojik eğitim beyanı bulunmuyor.");
  }

  // 2. KRİZ YÖNETİMİ & MASKELER
  const priorityAns = answers['prioritization_1'] as string;
  if (priorityAns?.includes('Hiçbirini ihmal etmem')) {
    reliabilityPoints -= 25;
    riskFlags.push("Maskeleme Belirtisi: İnsani sınırları kabul etmeyen, gerçekçi olmayan 'mükemmeliyetçi' yaklaşım tespiti.");
  } else if (priorityAns?.includes('Öğrenciyi')) {
    crisisPoints += 50;
    patterns.push("Analitik Önceliklendirme");
  }

  // 3. ETİK SINIRLAR
  const bribeAns = answers['parent_bribe'] as string;
  if (bribeAns?.includes('yönetime bildiririm')) {
    ethicsPoints += 50;
    patterns.push("Yüksek Kurumsal Aidiyet");
  } else {
    reliabilityPoints -= 20;
    riskFlags.push("Sınır İhlali Eğilimi: Bireysel inisiyatifi kurumsal etik kuralların önünde tutma eğilimi.");
  }

  // 4. BRANŞ SPESİFİK ANALİZ
  if (candidate.branch === Branch.OzelEgitim && !trainings.includes('otizm') && !trainings.includes('aba')) {
    riskFlags.push("Branş Eksikliği: Özel eğitim branşında temel kabul edilen metodolojik (ABA/Otizm) donanım eksiği.");
  }

  const overallScore = Math.round(
    (ethicsPoints * 0.4) + 
    (crisisPoints * 0.3) + 
    (Math.min(exp * 8, 100) * 0.1) + 
    (reliabilityPoints * 0.2)
  );

  return {
    overallScore,
    reliabilityIndex: Math.max(0, reliabilityPoints),
    ethicsScore: ethicsPoints,
    crisisManagementScore: crisisPoints,
    experienceWeight: Math.min(exp * 10, 100),
    detectedPatterns: [...new Set(patterns)],
    riskFlags
  };
};
