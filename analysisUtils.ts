
import { Candidate, AlgorithmicReport, Branch } from './types';

/**
 * Yeni Gün Akademi - Deterministik Analiz Motoru v4.0 (Professional)
 */
export const calculateAlgorithmicAnalysis = (candidate: Candidate): AlgorithmicReport => {
  let ethicsPoints = 0;
  let crisisPoints = 0;
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];
  const patterns: string[] = [];

  const answers = candidate.answers;

  // 1. ETİK & SINIR ANALİZİ
  if (answers['parent_bribe'] === 'Durumu derhal yönetime bildiririm; bu durum hem etik hem de kurumsal güvenlik ihlalidir.') {
    ethicsPoints += 30;
    patterns.push("Etik Sınır Hassasiyeti");
  } else {
    reliabilityPoints -= 15;
    riskFlags.push("Sınır İhlali Riski: Kurumsal hiyerarşiyi baypas etme eğilimi.");
  }

  if (answers['colleague_error'] === 'Kurum yönetimine resmi olarak bildiririm; çocuk güvenliği arkadaşlıktan öndedir.') {
    ethicsPoints += 30;
    patterns.push("Çocuk Koruma Önceliği");
  }

  // 2. KRİZ & ÖNCELİKLENDİRME (Maskeleme Kontrolü)
  if (answers['prioritization_1'] === 'Öğrenciyi (Güvenli bir alandaysa kısa süre kendi haline bırakarak).') {
    crisisPoints += 40;
  } else if (answers['prioritization_1'] === 'Hiçbirini ihmal etmem; hepsini aynı anda idare ederim (Gerçekçi olmayan maskeleme).') {
    reliabilityPoints -= 35;
    riskFlags.push("Bilişsel Dürüstlük: Gerçek dışı mükemmeliyetçilik sergiliyor.");
  }

  // 3. TECRÜBE VE EĞİTİM KORELASYONU
  const experienceYears = candidate.experienceYears || 0;
  const trainingKeywords = ['aba', 'pecs', 'floortime', 'denver', 'wisc', 'm-chat', 'ote', 'toddil'];
  let trainingHits = 0;
  trainingKeywords.forEach(kw => {
    if (candidate.allTrainings?.toLowerCase().includes(kw)) trainingHits++;
  });

  // Kıdemli olup eğitim beyanı zayıf olanlar
  if (experienceYears > 10 && trainingHits < 2) {
    riskFlags.push("Mesleki Statiklik: Uzun deneyime rağmen güncel eğitim eksiği.");
  }

  // 4. TUTARLILIK ANALİZİ (Cross-Check)
  if (experienceYears < 2 && ethicsPoints > 85) {
    patterns.push("Teorik Etik Olgunluk");
  }

  const overallScore = Math.round(
    (ethicsPoints * 0.4) + 
    (crisisPoints * 0.3) + 
    (Math.min(experienceYears * 10, 100) * 0.15) + 
    (Math.min(trainingHits * 25, 100) * 0.15)
  );

  if (overallScore > 85) patterns.push("Yüksek Potansiyelli Uzman");
  if (reliabilityPoints < 60) patterns.push("Detaylı Sorgulama Gerektiren Aday");

  return {
    overallScore,
    reliabilityIndex: Math.max(0, reliabilityPoints),
    ethicsScore: ethicsPoints,
    crisisManagementScore: crisisPoints,
    experienceWeight: Math.min(experienceYears * 10, 100),
    detectedPatterns: [...new Set(patterns)],
    riskFlags
  };
};
