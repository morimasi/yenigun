
-- ... (Previous SQL Structure remains the same until SEED DATA)

-- ============================================================================
-- 9. BAŞLANGIÇ VERİSİ (SEED) - GÜNCELLENMİŞ VERSİYON
-- ============================================================================

-- Varsayılan Admin
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Global Konfigürasyon v13 (MODÜLER YAPI)
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Akademi",
  "lastUpdated": 1715420000000,
  
  "weightMatrix": {
    "clinicalExpertise": 30,
    "ethicalIntegrity": 30,
    "emotionalResilience": 15,
    "institutionalLoyalty": 10,
    "learningAgility": 10,
    "academicPedagogy": 5
  },
  
  "riskEngine": {
    "criticalEthicalViolationPenalty": 40,
    "inconsistentAnswerPenalty": 20,
    "lowExperienceDiscountFactor": 0.85,
    "jobHoppingPenalty": 15
  },
  
  "aiPersona": {
    "skepticismLevel": 70,
    "innovationBias": 50,
    "stressTestIntensity": 80,
    "detailedReporting": true
  },
  
  "systemSettings": {
    "minHiringScore": 75,
    "highPotentialCutoff": 90,
    "interviewDurationMinutes": 45,
    "autoRejectBelowScore": 40,
    "defaultMeetingLink": "https://meet.google.com/new"
  }
}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- SON: Veritabanı Tahkimatı Tamamlandı.
-- ============================================================================
