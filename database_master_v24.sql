
-- ============================================================================
-- YENİ GÜN AKADEMİ | AKADEMİK ERP & NÖRAL MÜFREDAT MASTER VERİTABANI
-- VERSİYON: 24.1 (ULTIMATE ENTERPRISE RELEASE)
-- KAPSAM: MIA AI, ARMS, KLİNİK LABORATUVAR, LMS HUB, BİLDİRİM MERKEZİ
-- ============================================================================

-- 0. TEMİZLİK VE HAZIRLIK
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Zaman damgası otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 1. SİSTEM VE KONFİGÜRASYON (SİNİR MERKEZİ)
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL, -- Ağırlık Matrisi, AI Mizaç, Limitler
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. ADAY YÖNETİMİ (MIA AI PIPELINE)
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
    all_trainings JSONB DEFAULT '[]'::jsonb, -- Sertifika listesi
    answers JSONB DEFAULT '{}'::jsonb,       -- Mülakat cevapları
    status TEXT DEFAULT 'pending',           -- pending, interview_scheduled, rejected, archived
    report JSONB,                            -- MIA AI Derin Analiz Raporu
    algo_report JSONB,                       -- Sayısal Liyakat Skoru
    cv_data JSONB,                           -- CV Meta verileri
    archive_category TEXT,                   -- HIRED_CONTRACTED, BLACK_LIST, etc.
    archive_note TEXT,
    admin_notes TEXT,
    interview_schedule JSONB,                -- Tarih ve Saat
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cand_branch ON candidates(branch);
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);

-- ============================================================================
-- 3. PERSONEL YÖNETİMİ (ARMS - ACADEMIC RESOURCE MGMT)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY, -- 'STF-XXXX'
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff',          -- admin, staff, mentor
    branch TEXT NOT NULL,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',       -- active, archived, suspended
    report JSONB,                       -- Personelin güncel "Klinik Profili"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);

-- ============================================================================
-- 4. EĞİTİM VE MÜFREDAT (LMS HUB)
-- ============================================================================
-- A. Müfredat Kütüphanesi
CREATE TABLE IF NOT EXISTS training_curricula (
    id TEXT PRIMARY KEY, -- 'CUR-XXXX'
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- CLINICAL, ETHICS, ORIENTATION
    data JSONB NOT NULL,    -- Slaytlar, Multimodal elementler, Quizler
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- B. Eğitim Atamaları ve İlerleme
CREATE TABLE IF NOT EXISTS training_assignments (
    id TEXT PRIMARY KEY, -- 'ASN-XXXX'
    plan_id TEXT REFERENCES training_curricula(id) ON DELETE CASCADE,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'assigned', -- assigned, in_progress, completed
    progress INTEGER DEFAULT 0,      -- 0-100
    score INTEGER,                  -- Final Quiz skoru
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(plan_id, staff_id)
);

-- ============================================================================
-- 5. YETKİNLİK VE TEST LABORATUVARI
-- ============================================================================
-- A. Personel Liyakat Sınavları (ABA, Etik, Pedagoji)
CREATE TABLE IF NOT EXISTS staff_assessments (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL, 
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    ai_tags JSONB DEFAULT '[]'::jsonb, -- AI tarafından saptanan mizaç etiketleri
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, battery_id)
);

-- B. Klinik Laboratuvar (Stres Simülasyonları)
CREATE TABLE IF NOT EXISTS clinical_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL, -- DMP_STRESS, ETHICAL_DILEMMA
    scenario TEXT NOT NULL,
    result_data JSONB NOT NULL, -- Deep Trace analizi
    stress_level INTEGER NOT NULL,
    is_sealed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. BİREYSEL GELİŞİM PLANLARI (IDP - NÖRAL MÜFREDAT)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY, -- 'IDP-XXXX'
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL, -- Roadmap, Milestones, Custom Curriculum
    focus_area TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. İLETİŞİM VE BİLDİRİM KAYITLARI
-- ============================================================================
CREATE TABLE IF NOT EXISTS communication_logs (
    id SERIAL PRIMARY KEY,
    target_id TEXT,
    target_email TEXT,
    channel TEXT, -- email, whatsapp, sms
    subject TEXT,
    content_preview TEXT,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. ANALİTİK GÖRÜNÜMLER (BUSINESS INTELLIGENCE)
-- ============================================================================
CREATE OR REPLACE VIEW view_staff_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.role,
    s.report,
    (SELECT ROUND(AVG(score)) FROM staff_assessments WHERE staff_id = s.id) as avg_merit_score,
    (SELECT COUNT(*) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as certificates_earned,
    (SELECT MAX(timestamp) FROM staff_assessments WHERE staff_id = s.id) as last_activity
FROM staff s
WHERE s.status = 'active';

-- ============================================================================
-- 9. TETİKLEYİCİLER (DATABASE INTEGRITY)
-- ============================================================================
CREATE TRIGGER trg_candidates_update BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trg_staff_update BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trg_curricula_update BEFORE UPDATE ON training_curricula FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trg_idp_update BEFORE UPDATE ON staff_idp FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

-- ============================================================================
-- 10. SEED DATA (İLK KURULUM)
-- ============================================================================
-- ROOT ADMIN
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- SİSTEM AYARLARI v24.1
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
-- MASTER SCHEMA KURULUMU TAMAMLANDI.
-- ============================================================================
