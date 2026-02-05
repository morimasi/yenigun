
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP & NÖRAL MÜFREDAT MASTER VERİTABANI
-- VERSİYON: 16.0 (FINAL ENTERPRISE RELEASE)
-- MODÜLLER: ADAY HAVUZU, ARMS PERSONEL, KLİNİK LAB, MULTIMODAL STUDIO
-- ============================================================================

-- 1. EKLENTİLER VE FONKSİYONLAR
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 2. SİSTEM KONFİGÜRASYONU (Global Parametrik Motor)
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL, -- Weight matrix, risk engine settings, AI persona
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. ADAY HAVUZU (MIA - Modular Intelligence Architecture)
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
    status TEXT DEFAULT 'pending', -- 'pending', 'interview_scheduled', 'rejected', 'hired', 'archived'
    report JSONB,          -- MIA AI Detaylı Analiz Raporu
    algo_report JSONB,     -- Algoritmik Skorlama Sonuçları
    cv_data JSONB,         -- Base64 CV ve Metadata
    archive_category TEXT, -- 'TALENT_POOL', 'DISQUALIFIED', 'HIRED_CONTRACTED' vb.
    archive_note TEXT,
    admin_notes TEXT,
    reminder_note TEXT,
    interview_schedule JSONB, -- Date, Time, Location
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cand_branch ON candidates(branch);
CREATE INDEX IF NOT EXISTS idx_cand_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);

-- ============================================================================
-- 4. AKADEMİK KADRO (ARMS - Personel Dosyaları)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff', -- 'admin', 'staff', 'mentor'
    branch TEXT,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active', -- 'active', 'archived', 'on_leave'
    report JSONB, -- Personelin sürekli güncellenen nöral profili
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);

-- ============================================================================
-- 5. KLİNİK YETKİNLİK SINAVLARI (Assessment Batteries)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_assessments (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL, -- 'aba_mastery_20', 'ethics_10' vb.
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    ai_tags JSONB DEFAULT '[]'::jsonb, -- AI tespitleri (örn: 'risk_averse')
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, battery_id)
);

-- ============================================================================
-- 6. BİREYSEL GELİŞİM PLANLARI (IDP - Nöral Müfredat)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL, -- Focus area, roadmap, milestones, manual curriculum
    focus_area TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. KLİNİK LABORATUVAR (Nöral Kriz Simülasyonları)
-- ============================================================================
CREATE TABLE IF NOT EXISTS clinical_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL, -- 'DMP_STRESS', 'ETHICAL_DILEMMA'
    scenario TEXT NOT NULL,
    result_data JSONB NOT NULL, -- AI Deep Trace çıktısı
    stress_level INTEGER NOT NULL,
    is_sealed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. MULTIMODAL EĞİTİM STUDIO (Müfredat Fabrikası)
-- ============================================================================
CREATE TABLE IF NOT EXISTS training_curricula (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'ORIENTATION', 'CLINICAL', 'ETHICS'
    data JSONB NOT NULL, -- Multimodal slides, elements (image prompts, symbols), quiz data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_assignments (
    id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES training_curricula(id) ON DELETE CASCADE,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'assigned', -- 'assigned', 'in_progress', 'completed'
    progress INTEGER DEFAULT 0, -- 0-100
    score INTEGER, -- Quiz sonucu
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(plan_id, staff_id)
);

-- ============================================================================
-- 9. İLETİŞİM MERKEZİ VE LOGLAR
-- ============================================================================
CREATE TABLE IF NOT EXISTS communication_logs (
    id SERIAL PRIMARY KEY,
    target_id TEXT,
    target_email TEXT,
    channel TEXT, -- 'email', 'whatsapp', 'sms'
    subject TEXT,
    content_preview TEXT,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 10. ANALİTİK GÖRÜNÜMLER (VIEWS)
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
-- 11. TETİKLEYİCİLER (TRIGGERS)
-- ============================================================================
CREATE TRIGGER trg_candidates_modtime BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_staff_modtime BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_idp_modtime BEFORE UPDATE ON staff_idp FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_curricula_modtime BEFORE UPDATE ON training_curricula FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- 12. SEED DATA (BAŞLANGIÇ YAPILANDIRMASI)
-- ============================================================================

-- Admin Hesabı
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Global Parametreler
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Akademi",
  "weightMatrix": { "clinicalExpertise": 30, "ethicalIntegrity": 30, "emotionalResilience": 15, "institutionalLoyalty": 10, "learningAgility": 10, "academicPedagogy": 5 },
  "riskEngine": { "criticalEthicalViolationPenalty": 40, "inconsistentAnswerPenalty": 20, "lowExperienceDiscountFactor": 0.85, "jobHoppingPenalty": 15 },
  "aiPersona": { "skepticismLevel": 70, "innovationBias": 50, "stressTestIntensity": 80, "detailedReporting": true },
  "systemSettings": { "minHiringScore": 75, "highPotentialCutoff": 90, "autoRejectBelowScore": 40, "defaultMeetingLink": "https://meet.google.com/new" }
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- ============================================================================
-- SON: MASTER SCHEMA TASARIMI TAMAMLANDI.
-- ============================================================================
