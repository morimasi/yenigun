
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP VE KLİNİK ZEKA VERİTABANI MİMARİSİ (FULL v10.5)
-- ============================================================================
-- Bu script "Idempotent" yapıdadır; hata vermeden defalarca çalıştırılabilir.
-- Mevcut verileri korur, sadece eksik yapıları tamamlar.
-- ============================================================================

-- 1. EKLENTİLER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ZAMAN GÜNCELLEME FONKSİYONU (CREATE OR REPLACE hatayı önler)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TABLO 1: SYSTEM_CONFIG (Global Ayarlar & AI Mizaç)
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLO 2: CANDIDATES (Akademik Aday Havuzu & MIA Raporları)
-- ============================================================================
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT DEFAULT 'Belirtilmemiş',
    marital_status TEXT DEFAULT 'Bekar',
    branch TEXT NOT NULL,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    previous_institutions TEXT,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    answers JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'pending',
    report JSONB,
    algo_report JSONB,
    cv_data JSONB,
    archive_category TEXT,
    archive_note TEXT,
    admin_notes TEXT,
    reminder_note TEXT,
    interview_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexler (Sadece yoksa oluşturulur)
CREATE INDEX IF NOT EXISTS idx_cand_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_cand_report_jsonb ON candidates USING GIN (report);

-- Tetikleyici (Her seferinde temizleyip kurmak en güvenli yoldur)
DROP TRIGGER IF EXISTS trg_candidates_modtime ON candidates;
CREATE TRIGGER trg_candidates_modtime 
BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- TABLO 3: STAFF (Akademik Kadro)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    branch TEXT,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
DROP TRIGGER IF EXISTS trg_staff_modtime ON staff;
CREATE TRIGGER trg_staff_modtime 
BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- TABLO 4: STAFF_ASSESSMENTS (Klinik Yetkinlik Bataryaları)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_assessments (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    ai_tags JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, battery_id)
);

CREATE INDEX IF NOT EXISTS idx_assessment_battery ON staff_assessments(battery_id);

-- ============================================================================
-- TABLO 5: STAFF_IDP (Bireysel Gelişim Planları)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_idp (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLO 6: COMMUNICATION_LOGS (İletişim Arşivi)
-- ============================================================================
CREATE TABLE IF NOT EXISTS communication_logs (
    id SERIAL PRIMARY KEY,
    target_id TEXT,
    target_email TEXT,
    channel TEXT,
    subject TEXT,
    content_preview TEXT,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ANALİTİK GÖRÜNÜMLER (VIEWS)
-- ============================================================================
CREATE OR REPLACE VIEW view_staff_performance AS
SELECT 
    s.id,
    s.name,
    s.branch,
    COUNT(sa.id) as total_tests,
    ROUND(AVG(sa.score)) as avg_score,
    MAX(sa.timestamp) as last_activity
FROM staff s
LEFT JOIN staff_assessments sa ON s.id = sa.staff_id
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch;

-- ============================================================================
-- SEED DATA & INITIALIZATION
-- ============================================================================

-- 1. Varsayılan Admin (Şifre: admin123) - Mevcutsa dokunmaz
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 2. Başlangıç Konfigürasyonu - Mevcutsa dokunmaz
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Akademi",
  "aiTone": "balanced",
  "aiWeights": {"ethics": 40, "clinical": 30, "experience": 15, "fit": 15},
  "advancedAnalytics": {
      "weights": { "clinicalDepth": 30, "ethicalIntegrity": 30, "emotionalResilience": 15, "institutionalLoyalty": 15, "learningAgility": 10 },
      "penalties": { "criticalEthicalViolation": 30, "inconsistentAnswers": 15, "lowExperienceDiscount": 0.85 },
      "thresholds": { "minHiringScore": 70, "highPotentialCutoff": 85 },
      "aiCognition": { "skepticismLevel": 60, "innovationBias": 50, "stressTestIntensity": 70 }
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
