
import { Candidate, AlgorithmicReport, Branch } from './types';

/**
 * Yeni Gün Akademi - Deterministik Analiz Motoru v1.0
 * Bu motor, AI servislerinden bağımsız olarak aday verilerini matematiksel olarak işler.
 */
export const calculateAlgorithmicAnalysis = (candidate: Candidate): AlgorithmicReport => {
  let ethicsPoints = 0;
  let crisisPoints = 0;
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];
  const patterns: string[] = [];

  const answers = candidate.answers;

  // 1. Klinik Etik Analizi (Örnek eşleme)
  if (answers['emergency_order'] === 'Müdürle odasında teknik verilerle tartışır, ikna edemezsem "ortak bir dilde" gerçeği yumuşatarak sunarım.') ethicsPoints += 25;
  if (answers['assessment_clash'] === 'Yönetime etik çekincelerimi bildirip, sorumluluğun onlarda olduğunu belirten bir rapor hazırlarım.') ethicsPoints += 25;
  if (answers['colleague_error'] === 'Kurum yönetimine resmi olarak bildiririm; çocuk güvenliği arkadaşlıktan öndedir.') ethicsPoints += 25;
  if (answers['parent_bribe'] === 'Durumu derhal yönetime bildiririm; bu durum hem etik hem de kurumsal güvenlik ihlalidir.') ethicsPoints += 25;

  // 2. Kriz ve Önceliklendirme Analizi
  if (answers['prioritization_1'] === 'Öğrenciyi (Güvenli bir alandaysa kısa süre kendi haline bırakarak).') crisisPoints += 40;
  if (answers['prioritization_1'] === 'Hiçbirini ihmal etmem; hepsini aynı anda idare ederim (Gerçekçi olmayan maskeleme).') {
    crisisPoints += 10;
    reliabilityPoints -= 20;
    riskFlags.push("Gerçekçi olmayan profesyonel maskeleme (Omnipotans eğilimi)");
  }

  // 3. Deneyim Ağırlığı (Logaritmik Yaklaşım)
  const experienceWeight = Math.min(Math.log2(candidate.experienceYears + 1) * 25, 100);

  // 4. Tutarlılık Kontrolü (Cross-Check)
  if (candidate.experienceYears > 10 && crisisPoints < 20) {
    reliabilityPoints -= 15;
    riskFlags.push("Kıdem-Beceri Uyuşmazlığı: Yüksek kıdeme rağmen düşük kriz yönetimi");
  }

  // 5. Eğitim Çeşitliliği Analizi
  const trainingCount = (candidate.allTrainings.match(/,/g) || []).length + 1;
  const trainingScore = Math.min(trainingCount * 15, 100);

  // Pattern Tespiti
  if (ethicsPoints > 70) patterns.push("Yüksek Etik Standart");
  if (crisisPoints > 30) patterns.push("Saha Adaptasyon Kabiliyeti");
  if (reliabilityPoints < 70) patterns.push("Düşük Yanıt Güvenilirliği");

  const overallScore = Math.round(
    (ethicsPoints * 0.35) + 
    (crisisPoints * 0.25) + 
    (experienceWeight * 0.20) + 
    (trainingScore * 0.20)
  );

  return {
    overallScore,
    reliabilityIndex: reliabilityPoints,
    ethicsScore: ethicsPoints,
    crisisManagementScore: crisisPoints,
    experienceWeight: Math.round(experienceWeight),
    detectedPatterns: patterns,
    riskFlags
  };
};
