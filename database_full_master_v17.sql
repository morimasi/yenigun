-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP & NÖRAL MÜFREDAT MASTER VERİTABANI
-- VERSİYON: 17.0 (ULTIMATE UNIFIED RELEASE)
-- KAPSAM: MIA AI, ARMS, KLİNİK LABORATUVAR, LMS HUB, COMM CENTER
-- ============================================================================

-- 0. TEMİZLİK PROTOKOLÜ (Eski görünümleri yenilemek için)
DROP VIEW IF EXISTS view_staff_performance_matrix CASCADE;
DROP VIEW IF EXISTS view_clinical_lab_stats CASCADE;

-- 1. ÇEKİRDEK YAPILANDIRMA VE EKLENTİLER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Otomatik zaman güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 2. ANA TABLO YAPILARI
-- ============================================================================

-- A. GLOBAL SİSTEM YAPILANDIRMASI (Ağırlık Matrisi & AI Kişiliği)
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- B. ADAY HAVUZU (MIA AI Destekli Başvuru Yönetimi)
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
    status TEXT DEFAULT 'pending', -- pending, hired, rejected, archived
    report JSONB,                  -- AI Derin Analiz Raporu
    algo_report JSONB,             -- Algoritmik Skorlama Sonucu
    cv_data JSONB,                 -- Base64 Belge Verisi
    archive_category TEXT,         -- HIRED_CONTRACTED, DISQUALIFIED, BLACK_LIST
    archive_note TEXT,
    admin_notes TEXT,
    reminder_note TEXT,
    interview_schedule JSONB,      -- {date, time}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- C. AKADEMİK KADRO (ARMS - Personel Dosyaları)
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff',     -- admin, staff, mentor
    branch TEXT,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',  -- active, archived, suspended
    report JSONB,                  -- Personelin MIA Gelişim Dosyası
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- D. EĞİTİM MÜFREDAT FABRİKASI (LMS Master)
CREATE TABLE IF NOT EXISTS training_curricula (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,        -- CLINICAL, ETHICS, ORIENTATION, MANAGEMENT
    data JSONB NOT NULL,           -- Slides, Quizzes, Multimodal Elements
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- E. EĞİTİM ATAMALARI VE İLERLEME (LMS Tracker)
CREATE TABLE IF NOT EXISTS training_assignments (
    id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES training_curricula(id) ON DELETE CASCADE,
    staff_id TEXT NOT NULL,
    status TEXT DEFAULT 'assigned', -- assigned, in_progress, completed
    progress INTEGER DEFAULT 0,     -- 0-100
    score INTEGER,                  -- Quiz skoru
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(plan_id, staff_id)
);

-- F. PERSONEL YETKİNLİK SINAVLARI (Assessment Batteris)
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

-- G. BİREYSEL GELİŞİM PLANLARI (IDP - Nöral Müfredat)
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL,            -- Roadmap, Modules, Goals
    focus_area TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- H. KLİNİK LABORATUVAR (Stres Simülasyonları & Deep Trace)
CREATE TABLE IF NOT EXISTS clinical_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,       -- DMP_STRESS, ETHICAL_CONFLICT
    scenario TEXT NOT NULL,
    result_data JSONB NOT NULL,    -- AI Analiz Çıktısı
    stress_level INTEGER NOT NULL,
    is_sealed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- I. İLETİŞİM LOGLARI (Bildirim Merkezi Arşivi)
CREATE TABLE IF NOT EXISTS communication_logs (
    id SERIAL PRIMARY KEY,
    target_id TEXT,
    target_email TEXT,
    channel TEXT,                  -- email, whatsapp, sms
    subject TEXT,
    content_preview TEXT,
    status TEXT DEFAULT 'pending', -- sent, failed
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. ANALİTİK GÖRÜNÜMLER (BUSINESS INTELLIGENCE)
-- ============================================================================

-- Personel Liyakat ve Gelişim Matrisi View
CREATE OR REPLACE VIEW view_staff_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.role,
    s.report,
    (SELECT ROUND(AVG(score)) FROM staff_assessments WHERE staff_id = s.id) as global_assessment_avg,
    (SELECT ROUND(AVG(score)) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as lms_success_rate,
    (SELECT COUNT(*) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as total_trainings_finished,
    MAX(sa.timestamp) as last_activity
FROM staff s
LEFT JOIN staff_assessments sa ON s.id = sa.staff_id
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.role, s.report;

-- ============================================================================
-- 4. PERFORMANS İNDEKSLERİ (JSONB OPTIMIZATION)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_cand_branch ON candidates(branch);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_sim_result_gin ON clinical_simulations USING GIN (result_data);
CREATE INDEX IF NOT EXISTS idx_idp_data_gin ON staff_idp USING GIN (data);
CREATE INDEX IF NOT EXISTS idx_curricula_data_gin ON training_curricula USING GIN (data);

-- ============================================================================
-- 5. TETİKLEYİCİLER (TIMEKEEPING)
-- ============================================================================
DROP TRIGGER IF EXISTS trg_candidates_modtime ON candidates;
CREATE TRIGGER trg_candidates_modtime BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_staff_modtime ON staff;
CREATE TRIGGER trg_staff_modtime BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_idp_modtime ON staff_idp;
CREATE TRIGGER trg_idp_modtime BEFORE UPDATE ON staff_idp FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_curricula_modtime ON training_curricula;
CREATE TRIGGER trg_curricula_modtime BEFORE UPDATE ON training_curricula FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- 6. BAŞLANGIÇ VERİSİ (SEED DATA)
-- ============================================================================

-- Varsayılan Admin Hesabı
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Global Konfigürasyon (Ağırlık Matrisi v17)
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Özel Eğitim Akademi",
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
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- ============================================================================
-- SON: MASTER SCHEMA v17.0 KURULUMU TAMAMLANDI.
-- ============================================================================
