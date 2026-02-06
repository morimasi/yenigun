
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP & NÖRAL MÜFREDAT MASTER VERİTABANI
-- VERSİYON: 20.0 (MULTIMODAL PRODUCTION READY)
-- ============================================================================

-- 0. TEMİZLİK PROTOKOLÜ (Sadece Görünümler - Mevcut veriye dokunulmaz)
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
-- 2. ANA TABLO YAPILARI (IF NOT EXISTS)
-- ============================================================================

-- [A] GLOBAL SİSTEM YAPILANDIRMASI
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [B] ADAY HAVUZU (MIA AI ANALİZLERİ)
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT DEFAULT 'Belirtilmemiş',
    marital_status TEXT DEFAULT 'Bekar',
    branch TEXT,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    previous_institutions TEXT,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    answers JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'pending',
    report JSONB,          -- AI Detaylı Analiz
    algo_report JSONB,     -- Algoritmik Skorlar
    cv_data JSONB,         -- Base64 Belge
    archive_category TEXT, 
    archive_note TEXT,
    admin_notes TEXT,
    reminder_note TEXT,
    interview_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [C] AKADEMİK KADRO (ARMS MERKEZİ)
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
    report JSONB,
    archive_category TEXT,
    archive_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [D] EĞİTİM MÜFREDAT FABRİKASI (MULTIMODAL STUDIO)
CREATE TABLE IF NOT EXISTS training_curricula (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- CLINICAL, ETHICS, ORIENTATION
    data JSONB NOT NULL,     -- Slaytlar, Quiz, AI Config hepsi burada
    status TEXT DEFAULT 'active',
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [E] EĞİTİM ATAMALARI VE LMS TAKİBİ
CREATE TABLE IF NOT EXISTS training_assignments (
    id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES training_curricula(id) ON DELETE CASCADE,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'assigned', -- assigned, in_progress, completed
    progress INTEGER DEFAULT 0,
    score INTEGER,                  -- Quiz skoru
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(plan_id, staff_id)
);

-- [F] PERSONEL YETKİNLİK SINAVLARI (BATARYALAR)
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

-- [G] BİREYSEL GELİŞİM PLANLARI (IDP)
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    focus_area TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [H] KLİNİK LABORATUVAR (SİLENMİŞ SİMÜLASYONLAR)
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

-- [I] SİSTEM BİLDİRİMLERİ (REAL-TIME ALERTS)
CREATE TABLE IF NOT EXISTS system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [J] İLETİŞİM LOGLARI
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
-- 3. SCHEMA MIGRATIONS & TAHKİMAT (Eksik Sütun Onarımı)
-- ============================================================================

DO $$ 
BEGIN
    -- Candidates Tahkimat
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS archive_category TEXT;
    
    -- Veri Sanitizasyonu: Geçersiz kategorileri mühürle
    UPDATE candidates SET archive_category = 'DISQUALIFIED' 
    WHERE archive_category IS NOT NULL 
    AND archive_category NOT IN ('CANDIDATE_POOL', 'DISQUALIFIED', 'BLACK_LIST', 'STAFF_HISTORY', 'TRAINING_LIBRARY', 'PERFORMANCE_SNAPSHOT', 'STRATEGIC_PLAN', 'CLINICAL_CASE_STUDY', 'HIRED_CONTRACTED', 'TALENT_POOL_ANALYTICS');

    -- Kısıtlamayı (Constraint) ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'check_archive_cat') THEN
        ALTER TABLE candidates ADD CONSTRAINT check_archive_cat CHECK (archive_category IN ('CANDIDATE_POOL', 'DISQUALIFIED', 'BLACK_LIST', 'STAFF_HISTORY', 'TRAINING_LIBRARY', 'PERFORMANCE_SNAPSHOT', 'STRATEGIC_PLAN', 'CLINICAL_CASE_STUDY', 'HIRED_CONTRACTED', 'TALENT_POOL_ANALYTICS'));
    END IF;

    -- Staff Tahkimat
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS university TEXT;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS department TEXT;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;

    -- Training Curricula Tahkimat
    ALTER TABLE training_curricula ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
END $$;

-- ============================================================================
-- 4. ANALİTİK GÖRÜNÜMLER (VIEWS)
-- ============================================================================

CREATE OR REPLACE VIEW view_staff_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.report,
    (SELECT ROUND(AVG(score)) FROM staff_assessments WHERE staff_id = s.id) as avg_assessment_score,
    (SELECT ROUND(AVG(score)) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as avg_training_score,
    (SELECT COUNT(*) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as completed_trainings_count,
    (SELECT MAX(timestamp) FROM staff_assessments WHERE staff_id = s.id) as last_activity
FROM staff s
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.report;

-- ============================================================================
-- 5. PERFORMANS İNDEKSLERİ (GIN & HIZLANDIRICILAR)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_curricula_data_gin ON training_curricula USING GIN (data);
CREATE INDEX IF NOT EXISTS idx_notif_unread ON system_notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_sim_candidate ON clinical_simulations(candidate_id);

-- ============================================================================
-- 6. OTOMATİK GÜNCELLEME TETİKLEYİCİLERİ
-- ============================================================================
DROP TRIGGER IF EXISTS trg_candidates_modtime ON candidates;
CREATE TRIGGER trg_candidates_modtime BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_staff_modtime ON staff;
CREATE TRIGGER trg_staff_modtime BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_curricula_modtime ON training_curricula;
CREATE TRIGGER trg_curricula_modtime BEFORE UPDATE ON training_curricula FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- 7. SEED DATA (AÇILIŞ PROTOKOLÜ)
-- ============================================================================

-- [A] Root Admin
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- [B] Global Config v20
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Akademi",
  "lastUpdated": 1715420000000,
  "weightMatrix": { "clinicalExpertise": 30, "ethicalIntegrity": 30, "emotionalResilience": 15, "institutionalLoyalty": 10, "learningAgility": 10, "academicPedagogy": 5 },
  "riskEngine": { "criticalEthicalViolationPenalty": 40, "inconsistentAnswerPenalty": 20, "lowExperienceDiscountFactor": 0.85, "jobHoppingPenalty": 15 },
  "aiPersona": { "skepticismLevel": 70, "innovationBias": 50, "stressTestIntensity": 80, "detailedReporting": true },
  "systemSettings": { "minHiringScore": 75, "highPotentialCutoff": 90, "autoRejectBelowScore": 40, "defaultMeetingLink": "https://meet.google.com/new" }
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;

-- [C] Başlangıç Bildirimi
INSERT INTO system_notifications (type, severity, title, message)
VALUES ('SYSTEM_ALERT', 'SUCCESS', 'V20.0 Çekirdek Aktif', 'Nöral Müfredat Fabrikası ve Multimodal Stüdyo şeması başarıyla mühürlendi.')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SON: MASTER SCHEMA v20.0 KURULUMU TAMAMLANDI.
-- ============================================================================
