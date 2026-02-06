
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP & NÖRAL MÜFREDAT MASTER VERİTABANI
-- VERSİYON: 19.0 (ENTERPRISE GOVERNANCE EDITION)
-- KAPSAM: MIA AI, ARMS, KLİNİK LABORATUVAR, LMS HUB, COMM CENTER, NOTIFICATIONS
-- ============================================================================

-- 0. ÖN HAZIRLIK VE TEMİZLİK
-- Bağımlılıkları temizlemek için CASCADE kullanılır.
DROP VIEW IF EXISTS view_staff_performance_matrix CASCADE;
DROP VIEW IF EXISTS view_clinical_lab_stats CASCADE;
DROP VIEW IF EXISTS view_candidate_merit_summary CASCADE;

-- 1. ÇEKİRDEK FONKSİYONLAR VE EKLENTİLER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 2. ANA TABLO YAPILARI (MODÜLER MİMARİ)
-- ============================================================================

-- [A] GLOBAL SİSTEM YAPILANDIRMASI
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [B] ADAY HAVUZU (MIA AI DESTEKLİ)
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

-- [C] AKADEMİK KADRO (ARMS)
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

-- [D] EĞİTİM MÜFREDAT FABRİKASI
CREATE TABLE IF NOT EXISTS training_curricula (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    data JSONB NOT NULL,
    status TEXT DEFAULT 'active',
    archive_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [E] EĞİTİM ATAMALARI (LMS HUB)
CREATE TABLE IF NOT EXISTS training_assignments (
    id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES training_curricula(id) ON DELETE CASCADE,
    staff_id TEXT NOT NULL,
    status TEXT DEFAULT 'assigned',
    progress INTEGER DEFAULT 0,
    score INTEGER,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(plan_id, staff_id)
);

-- [F] PERSONEL YETKİNLİK SINAVLARI
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

-- [G] BİREYSEL GELİŞİM PLANLARI (IDP - NÖRAL MÜFREDAT)
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    focus_area TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [H] KLİNİK LABORATUVAR (STRES SİMÜLASYONLARI)
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

-- [I] SİSTEM BİLDİRİMLERİ (REAL-TIME SIGNALS)
CREATE TABLE IF NOT EXISTS system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,         -- NEW_CANDIDATE, INTERVIEW_DUE, etc.
    severity TEXT NOT NULL,     -- INFO, SUCCESS, WARNING, CRITICAL
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [J] İLETİŞİM ARŞİVİ (COMM CENTER)
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
-- 3. KRİTİK VERİ SANİTİZASYONU VE KISITLAMA ONARIMI (SQLSTATE 23514 FIX)
-- ============================================================================

-- Kısıtlama eklenmeden önce geçersiz tüm kategorileri 'DISQUALIFIED' olarak temizle
UPDATE candidates 
SET archive_category = 'DISQUALIFIED' 
WHERE archive_category IS NOT NULL 
AND archive_category NOT IN (
    'CANDIDATE_POOL', 'DISQUALIFIED', 'BLACK_LIST', 'STAFF_HISTORY', 
    'TRAINING_LIBRARY', 'PERFORMANCE_SNAPSHOT', 'STRATEGIC_PLAN', 
    'CLINICAL_CASE_STUDY', 'HIRED_CONTRACTED', 'TALENT_POOL_ANALYTICS'
);

-- Temizlik sonrası kısıtlamayı (Constraint) güvenle mühürle
ALTER TABLE candidates DROP CONSTRAINT IF EXISTS check_archive_cat;
ALTER TABLE candidates ADD CONSTRAINT check_archive_cat CHECK (
    archive_category IN (
        'CANDIDATE_POOL', 'DISQUALIFIED', 'BLACK_LIST', 'STAFF_HISTORY', 
        'TRAINING_LIBRARY', 'PERFORMANCE_SNAPSHOT', 'STRATEGIC_PLAN', 
        'CLINICAL_CASE_STUDY', 'HIRED_CONTRACTED', 'TALENT_POOL_ANALYTICS'
    )
);

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
    MAX(sa.timestamp) as last_activity
FROM staff s
LEFT JOIN staff_assessments sa ON s.id = sa.staff_id
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.report;

-- ============================================================================
-- 5. PERFORMANS İNDEKSLERİ (GIN & BTREE)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_cand_email_search ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_notif_unread ON system_notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_sim_candidate ON clinical_simulations(candidate_id);

-- ============================================================================
-- 6. TETİKLEYİCİLER (TRIGGERS)
-- ============================================================================
DROP TRIGGER IF EXISTS trg_candidates_modtime ON candidates;
CREATE TRIGGER trg_candidates_modtime BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_staff_modtime ON staff;
CREATE TRIGGER trg_staff_modtime BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_idp_modtime ON staff_idp;
CREATE TRIGGER trg_idp_modtime BEFORE UPDATE ON staff_idp FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- 7. BAŞLANGIÇ VERİSİ (SEED DATA)
-- ============================================================================

-- [A] Root Admin Hesabı
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- [B] Global Konfigürasyon v19
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

-- [C] Sistem Selamlama Bildirimi
INSERT INTO system_notifications (type, severity, title, message)
VALUES ('SYSTEM_ALERT', 'SUCCESS', 'V19.0 Şema Mühürlendi', 'Master veritabanı tüm kurumsal modülleri kapsayacak şekilde başarıyla güncellendi.')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SON: MASTER SCHEMA v19.0 KURULUMU TAMAMLANDI.
-- ============================================================================
