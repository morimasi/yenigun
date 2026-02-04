
import { Candidate, AlgorithmicReport, GlobalConfig, Branch } from './types';
import { BRANCH_QUESTIONS } from './constants';
import { BRANCH_CATEGORY_MULTIPLIERS } from './constants/taxonomy';

export const calculateAlgorithmicAnalysis = (candidate: Candidate, config: GlobalConfig): AlgorithmicReport => {
  const branch = candidate.branch as Branch;
  const multipliers = BRANCH_CATEGORY_MULTIPLIERS[branch] || {};
  
  // Ham skorların toplanacağı havuz
  const scores: Record<string, number[]> = {
    ethics: [], pedagogy: [], clinical: [], resilience: [], fit: [], loyalty: [], agility: []
  };
  
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];
  const answers = candidate.answers || {};

  // 1. CONFIG MODÜLLERİNİ YÜKLE (Default değerler yerine config'den gelenler)
  const weights = config.weightMatrix || { 
    clinicalExpertise: 30, ethicalIntegrity: 30, emotionalResilience: 15, 
    institutionalLoyalty: 10, learningAgility: 10, academicPedagogy: 5 
  };
  
  const penalties = config.riskEngine || { 
    criticalEthicalViolationPenalty: 40, inconsistentAnswerPenalty: 20, 
    lowExperienceDiscountFactor: 0.85 
  };

  // 2. CEVAP ANALİZİ
  Object.values(BRANCH_QUESTIONS).flat().forEach(q => {
    const answer = answers[q.id];
    if (q.type === 'radio' && q.weightedOptions && typeof answer === 'string') {
      const selectedOption = q.weightedOptions.find(o => o.label === answer);
      if (selectedOption) {
        // Branş override kontrolü
        const activeWeights = (selectedOption.branchOverrides && selectedOption.branchOverrides[branch]) 
          ? selectedOption.branchOverrides[branch] 
          : selectedOption.weights;

        Object.entries(activeWeights).forEach(([cat, weight]) => {
          const numericWeight = Number(weight);
          const multiplier = multipliers[cat] || 1.0;
          
          // Kategori Eşleştirme (Taxonomy -> Score Pool)
          if (cat === 'workEthics' || cat === 'integrity') scores.ethics.push(numericWeight * 100 * multiplier);
          else if (cat === 'clinical' || cat === 'technicalExpertise') scores.clinical.push(numericWeight * 100 * multiplier);
          else if (cat === 'pedagogicalAnalysis' || cat === 'academicSkills') scores.pedagogy.push(numericWeight * 100 * multiplier);
          else if (cat === 'sustainability' || cat === 'emotionalResilience') scores.resilience.push(numericWeight * 100 * multiplier);
          else if (cat === 'institutionalLoyalty' || cat === 'team_player') scores.loyalty.push(numericWeight * 100 * multiplier);
          else if (cat === 'developmentOpenness' || cat === 'learningAgility') scores.agility.push(numericWeight * 100 * multiplier);
        });

        // Etik İhlal Kontrolü (Risk Engine)
        if (activeWeights.workEthics && Number(activeWeights.workEthics) < 0.3) {
          riskFlags.push(`Kritik Etik İhlal: ${q.text.substring(0, 30)}...`);
          reliabilityPoints -= penalties.criticalEthicalViolationPenalty;
        }
      }
    }
  });

  // 3. ORTALAMALAR
  const getAvg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 50; // Nötr başlangıç

  const ethicsScore = getAvg(scores.ethics);
  const clinicalScore = getAvg(scores.clinical);
  const resilienceScore = getAvg(scores.resilience);
  const loyaltyScore = getAvg(scores.loyalty);
  const agilityScore = getAvg(scores.agility);
  const pedagogyScore = getAvg(scores.pedagogy);

  // 4. TUTARLILIK KONTROLLERİ (Risk Engine)
  const exp = candidate.experienceYears || 0;
  
  // Deneyimli ama klinik skoru düşükse -> Tutarsızlık cezası
  if (exp > 5 && clinicalScore < 50) {
    reliabilityPoints -= penalties.inconsistentAnswerPenalty;
    riskFlags.push("Deneyim/Yetkinlik Tutarsızlığı");
  }

  // Junior indirimi
  let finalMultiplier = 1;
  if (exp < 2) {
      finalMultiplier = penalties.lowExperienceDiscountFactor; 
      riskFlags.push("Junior Deneyim İndirimi Uygulandı");
  }

  // 5. AĞIRLIKLI SKOR HESABI (Weight Matrix)
  // Toplam ağırlığı dinamik hesapla (Config'den 100 gelmeyebilir, normalize et)
  const totalConfigWeight = (Object.values(weights) as number[]).reduce((a, b) => a + b, 0) || 100;

  let rawScore = (
    (clinicalScore * weights.clinicalExpertise) +
    (ethicsScore * weights.ethicalIntegrity) +
    (resilienceScore * weights.emotionalResilience) +
    (loyaltyScore * weights.institutionalLoyalty) +
    (agilityScore * weights.learningAgility) +
    (pedagogyScore * weights.academicPedagogy)
  ) / totalConfigWeight;

  // 6. FİNAL KALİBRASYON
  rawScore = rawScore * finalMultiplier;

  // Güvenilirlik puanı çok düştüyse genel skoru aşağı çek
  if (reliabilityPoints < 70) {
      rawScore = rawScore * (reliabilityPoints / 100);
      riskFlags.push("Düşük Güvenilirlik Endeksi Nedeniyle Skor Bastırıldı");
  }

  return {
    overallScore: Math.min(100, Math.max(0, Math.round(rawScore))),
    reliabilityIndex: Math.max(0, reliabilityPoints),
    ethicsScore,
    experienceWeight: Math.min(exp * 10, 100),
    retentionScore: loyaltyScore,
    burnoutResistance: resilienceScore,
    fitScore: Math.round((loyaltyScore + agilityScore) / 2),
    riskFlags,
    branchComplianceScore: Math.round((clinicalScore + pedagogyScore) / 2)
  };
};
    