
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP & NÖRAL MÜFREDAT MASTER VERİTABANI
-- VERSİYON: 17.0 (ULTIMATE UNIFIED RELEASE)
-- KAPSAM: MIA AI, ARMS, KLİNİK LABORATUVAR, LMS HUB, COMM CENTER
-- ============================================================================

-- 0. ANALİTİK TEMİZLİK (Görünümleri yenilemek için CASCADE kullanımı)
DROP VIEW IF EXISTS view_staff_performance_matrix CASCADE;
DROP VIEW IF EXISTS view_clinical_lab_stats CASCADE;

-- 1. ÇEKİRDEK YAPILANDIRMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 2. ANA TABLO YAPILARI (Idempotent - IF NOT EXISTS)
-- ============================================================================

-- A. Global Sistem Yapılandırması
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- B. Aday Havuzu (MIA AI Destekli)
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- C. Akademik Kadro (ARMS)
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- D. Eğitim Müfredat Fabrikası
CREATE TABLE IF NOT EXISTS training_curricula (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- E. Eğitim Atamaları (LMS)
CREATE TABLE IF NOT EXISTS training_assignments (
    id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES training_curricula(id) ON DELETE CASCADE,
    staff_id TEXT NOT NULL,
    status TEXT DEFAULT 'assigned',
    progress INTEGER DEFAULT 0,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_id, staff_id)
);

-- F. Personel Yetkinlik Sınavları
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

-- G. Bireysel Gelişim Planları (IDP - Nöral Müfredat)
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    focus_area TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- H. Klinik Laboratuvar (Stres Simülasyonları)
CREATE TABLE IF NOT EXISTS clinical_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,
    scenario TEXT NOT NULL,
    result_data JSONB NOT NULL,
    stress_level INTEGER NOT NULL,
    is_sealed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- I. İletişim Logları (Bildirim Merkezi)
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
-- 3. SCHEMA MIGRATION (Eksik Kolonları Veri Kaybetmeden Tamamla)
-- ============================================================================

DO $$ 
BEGIN
    -- Candidates Migrations
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS age INTEGER;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'Belirtilmemiş';
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS branch TEXT;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS university TEXT;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS department TEXT;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS report JSONB;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS algo_report JSONB;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS cv_data JSONB;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS archive_category TEXT;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS archive_note TEXT;
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS interview_schedule JSONB;

    -- Staff Migrations
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS branch TEXT;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'staff';
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS report JSONB;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS university TEXT;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS department TEXT;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS phone TEXT;

    -- Training Assignments Migrations
    ALTER TABLE training_assignments ADD COLUMN IF NOT EXISTS score INTEGER;
    ALTER TABLE training_assignments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
END $$;

-- ============================================================================
-- 4. ANALİTİK GÖRÜNÜMLER VE İNDEKSLER
-- ============================================================================

CREATE VIEW view_staff_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.report,
    (SELECT ROUND(AVG(score)) FROM staff_assessments WHERE staff_id = s.id) as avg_assessment_score,
    (SELECT ROUND(AVG(score)) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as avg_training_score,
    (SELECT COUNT(*) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as completed_trainings_count,
    MAX(sa.timestamp) as last_activity
FROM staff s
LEFT JOIN staff_assessments sa ON s.id = sa.staff_id
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.report;

-- Hızlandırıcı GIN İndeksleri
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_sim_result_gin ON clinical_simulations USING GIN (result_data);
CREATE INDEX IF NOT EXISTS idx_idp_data_gin ON staff_idp USING GIN (data);

-- ============================================================================
-- 5. TETİKLEYİCİLER (IDEMPOTENT)
-- ============================================================================
DROP TRIGGER IF EXISTS trg_candidates_modtime ON candidates;
CREATE TRIGGER trg_candidates_modtime BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_staff_modtime ON staff;
CREATE TRIGGER trg_staff_modtime BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_idp_modtime ON staff_idp;
CREATE TRIGGER trg_idp_modtime BEFORE UPDATE ON staff_idp FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- 6. SEED DATA (Açılış Ayarları)
-- ============================================================================
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Özel Eğitim Akademi",
  "weightMatrix": { "clinicalExpertise": 30, "ethicalIntegrity": 30, "emotionalResilience": 15, "institutionalLoyalty": 10, "learningAgility": 10, "academicPedagogy": 5 },
  "riskEngine": { "criticalEthicalViolationPenalty": 40, "inconsistentAnswerPenalty": 20, "lowExperienceDiscountFactor": 0.85, "jobHoppingPenalty": 15 },
  "aiPersona": { "skepticismLevel": 70, "innovationBias": 50, "stressTestIntensity": 80, "detailedReporting": true },
  "systemSettings": { "minHiringScore": 75, "highPotentialCutoff": 90, "autoRejectBelowScore": 40, "defaultMeetingLink": "https://meet.google.com/new" }
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- ============================================================================
-- SON: MASTER SCHEMA v17.0 KURULUMU TAMAMLANDI.
-- ============================================================================
