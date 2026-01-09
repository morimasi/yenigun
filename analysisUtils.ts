
import { Candidate, AlgorithmicReport, Branch } from './types';

/**
 * Yeni Gün Akademi - Deterministik Analiz Motoru v3.0 (Ozel Mode)
 * Bu motor, AI'nın "sezgisel" tahminlerine karşı "matematiksel" bir denge kurar.
 * 15 yıllık sektör tecrübesi üzerine kurgulanmış puanlama matrisleri içerir.
 */
export const calculateAlgorithmicAnalysis = (candidate: Candidate): AlgorithmicReport => {
  let ethicsPoints = 0;
  let crisisPoints = 0;
  let reliabilityPoints = 100;
  const riskFlags: string[] = [];
  const patterns: string[] = [];

  const answers = candidate.answers;

  // 1. KLİNİK ETİK & SINIR ANALİZİ (Ağırlık: %35)
  // emergency_order: Otorite ile etik arasındaki denge
  if (answers['emergency_order'] === 'Müdürle odasında teknik verilerle tartışır, ikna edemezsem "ortak bir dilde" gerçeği yumuşatarak sunarım.') {
    ethicsPoints += 25;
    patterns.push("Diplomatik Etik");
  } else if (answers['emergency_order'] === 'Veliye gerçeği söylerim; etik ilkelerim iş güvenliğimden önce gelir.') {
    ethicsPoints += 20;
    patterns.push("Kıdemli Dürüstlük");
  }

  // parent_bribe: Rüşvet ve profesyonel sınır testi
  if (answers['parent_bribe'] === 'Durumu derhal yönetime bildiririm; bu durum hem etik hem de kurumsal güvenlik ihlalidir.') {
    ethicsPoints += 25;
    patterns.push("Yüksek Kurumsal Sadakat");
  }

  // colleague_error: Mesleki dayanışma vs Çocuk güvenliği
  if (answers['colleague_error'] === 'Kurum yönetimine resmi olarak bildiririm; çocuk güvenliği arkadaşlıktan öndedir.') {
    ethicsPoints += 25;
  }

  // assessment_clash: Veri manipülasyonu direnci
  if (answers['assessment_clash'] === 'Yönetime etik çekincelerimi bildirip, sorumluluğun onlarda olduğunu belirten bir rapor hazırlarım.') {
    ethicsPoints += 25;
  }

  // 2. KRİZ YÖNETİMİ & ÖNCELİKLENDİRME (Ağırlık: %25)
  if (answers['prioritization_1'] === 'Öğrenciyi (Güvenli bir alandaysa kısa süre kendi haline bırakarak).') {
    crisisPoints += 40;
    patterns.push("Çocuk Odaklı Önceliklendirme");
  } else if (answers['prioritization_1'] === 'Hiçbirini ihmal etmem; hepsini aynı anda idare ederim (Gerçekçi olmayan maskeleme).') {
    crisisPoints += 10;
    reliabilityPoints -= 30; // Maskeleme tespiti: Güven düşürülür
    riskFlags.push("Maskeleme Eğilimi: Gerçekçi olmayan süper-insan profili çiziyor.");
  }

  // 3. DENEYİM VE EĞİTİM DERİNLİĞİ (Ağırlık: %40)
  // Deneyim puanı logaritmik olarak artar (10 yıldan sonrası plato yapar)
  const experienceScore = Math.min(Math.log2(candidate.experienceYears + 1) * 30, 100);
  
  // Eğitim çeşitliliği (virgülle ayrılmış metin analizi)
  const trainingKeywords = ['aba', 'pecs', 'floortime', 'denver', 'wisc', 'm-chat', 'ote', 'toddil'];
  let trainingHits = 0;
  trainingKeywords.forEach(kw => {
    if (candidate.allTrainings.toLowerCase().includes(kw)) trainingHits++;
  });
  const trainingScore = Math.min(trainingHits * 20, 100);

  // 4. TUTARLILIK & ÇAPRAZ KONTROL (CROSS-CHECK)
  // Yüksek kıdem olup kriz sorularında hata yapanlar
  if (candidate.experienceYears > 8 && crisisPoints < 30) {
    reliabilityPoints -= 20;
    riskFlags.push("Kıdem/Performans Çelişkisi: Yüksek kıdeme rağmen zayıf saha refleksi.");
  }

  // Eğitim beyanının dürüstlük testi (textarea sorularındaki kelime yoğunluğu ile)
  if (trainingHits > 4 && (answers['failure_report']?.toString().length || 0) < 50) {
    reliabilityPoints -= 15;
    riskFlags.push("Teknik Sığlık: Yüksek eğitim beyanına rağmen düşük analiz derinliği.");
  }

  // FINAL SKOR HESAPLAMA
  const overallScore = Math.round(
    (ethicsPoints * 0.35) + 
    (crisisPoints * 0.25) + 
    (experienceScore * 0.20) + 
    (trainingScore * 0.20)
  );

  // Genel Pattern Ekleme
  if (overallScore > 80) patterns.push("Elit Uzman Profili");
  if (ethicsPoints > 90) patterns.push("Etik Referans Aday");
  if (reliabilityPoints < 60) patterns.push("Kritik Güven Riski");

  return {
    overallScore,
    reliabilityIndex: Math.max(0, reliabilityPoints),
    ethicsScore: ethicsPoints,
    crisisManagementScore: crisisPoints,
    experienceWeight: Math.round(experienceScore),
    detectedPatterns: [...new Set(patterns)], // Benzersiz patternler
    riskFlags
  };
};
