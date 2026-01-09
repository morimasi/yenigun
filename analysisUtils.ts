
import { Candidate, AlgorithmicReport, Branch } from './types';

/**
 * Yeni Gün Akademi - Gelişmiş Deterministik Analiz Motoru v5.0 (Professional)
 * Bu motor, aday beyanları arasındaki mantıksal boşlukları ve istatistiksel sapmaları yakalar.
 */
export const calculateAlgorithmicAnalysis = (candidate: Candidate): AlgorithmicReport => {
  let ethicsPoints = 0;
  let crisisPoints = 0;
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];
  const patterns: string[] = [];

  const answers = candidate.answers;
  const experienceYears = candidate.experienceYears || 0;
  const trainingsRaw = candidate.allTrainings?.toLowerCase() || '';
  
  // 1. EĞİTİM YOĞUNLUĞU VE DENEYİM KORELASYONU (Tutarsızlık Tespiti)
  const trainingKeywords = ['aba', 'pecs', 'floortime', 'denver', 'wisc', 'm-chat', 'ote', 'toddil', 'disleksi', 'otizm', 'artikülasyon'];
  const trainingHits = trainingKeywords.filter(kw => trainingsRaw.includes(kw)).length;

  // Analiz: Çok az deneyime rağmen çok fazla "üst düzey" sertifika beyanı (Teorik doygunluk veya şişirme CV)
  if (experienceYears < 2 && trainingHits > 5) {
    reliabilityPoints -= 25;
    riskFlags.push("Bilişsel Çelişki: Düşük deneyime rağmen olağandışı yüksek sertifika beyanı. (Şişirilmiş CV riski)");
  }

  // Analiz: Yüksek deneyime rağmen sıfır güncel sertifika (Mesleki körelme)
  if (experienceYears > 12 && trainingHits < 1) {
    riskFlags.push("Mesleki Statiklik: Uzun hizmet süresine rağmen güncel metodolojik eğitim eksiği.");
  }

  // 2. ETİK & SINIR ANALİZİ (Senaryo Bazlı)
  if (answers['parent_bribe'] === 'Durumu derhal yönetime bildiririm; bu durum hem etik hem de kurumsal güvenlik ihlalidir.') {
    ethicsPoints += 30;
    patterns.push("Kritik Etik Bilinç");
  } else {
    reliabilityPoints -= 20;
    riskFlags.push("Etik Sınır İhlali Eğilimi: Bireysel inisiyatifi kurumsal hiyerarşinin önünde tutuyor.");
  }

  if (answers['colleague_error'] === 'Kurum yönetimine resmi olarak bildiririm; çocuk güvenliği arkadaşlıktan öndedir.') {
    ethicsPoints += 30;
    patterns.push("Çocuk Odaklılık");
  }

  // 3. KRİZ YÖNETİMİ & MASKELEME ANALİZİ
  if (answers['prioritization_1'] === 'Öğrenciyi (Güvenli bir alandaysa kısa süre kendi haline bırakarak).') {
    crisisPoints += 40;
  } else if (answers['prioritization_1'] === 'Hiçbirini ihmal etmem; hepsini aynı anda idare ederim (Gerçekçi olmayan maskeleme).') {
    reliabilityPoints -= 40;
    riskFlags.push("Maskeleme Tespiti: Gerçekçi olmayan mükemmeliyetçilik sergileyerek zayıf yönlerini gizliyor.");
  }

  // 4. BRANŞ VE SERTİFİKA UYUMU
  const isSpecialist = candidate.branch === Branch.OzelEgitim || candidate.branch === Branch.Psikolog;
  if (isSpecialist && !trainingsRaw.includes('aba') && !trainingsRaw.includes('otizm')) {
    patterns.push("Temel Metodoloji Eksiği");
  }

  // SKOR HESAPLAMA (Ağırlıklı Ortalama)
  const overallScore = Math.round(
    (ethicsPoints * 0.35) + 
    (crisisPoints * 0.30) + 
    (Math.min(experienceYears * 8, 100) * 0.15) + 
    (Math.min(trainingHits * 20, 100) * 0.20)
  );

  if (overallScore > 80 && reliabilityPoints > 75) patterns.push("A+ Potansiyel Uzman");
  if (reliabilityPoints < 60) patterns.push("Yüksek Riskli Aday");

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
