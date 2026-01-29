
-- ======================================================
-- YENI GUN AKADEMI - ARMS (ACADEMIC RESONANCE SYSTEM)
-- VERITABANI MIMARISI v6.1 (MIGRATION PATCHED)
-- ======================================================

-- 1. GEREKLI EKLENTILER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ZAMANLAYICI FONKSIYON
CREATE OR REPLACE FUNCTION arms_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. ADAY YONETIM TABLOSU
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    branch TEXT NOT NULL,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    previous_institutions TEXT,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    answers JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'pending',
    report JSONB DEFAULT NULL,
    algo_report JSONB DEFAULT NULL,
    interview_schedule JSONB DEFAULT NULL,
    cv_data JSONB DEFAULT NULL, -- DİKKAT: Performans için liste sorgularında hariç tutulmalı
    admin_notes TEXT,
    reminder_note TEXT,
    archive_category TEXT,
    archive_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_arms_cand_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_arms_cand_branch ON candidates(branch);
CREATE INDEX IF NOT EXISTS idx_arms_cand_created ON candidates(created_at DESC);

DROP TRIGGER IF EXISTS tr_arms_update_candidates ON candidates;
CREATE TRIGGER tr_arms_update_candidates
BEFORE UPDATE ON candidates
FOR EACH ROW EXECUTE FUNCTION arms_update_timestamp();

-- 4. AKADEMIK PERSONEL TABLOSU
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL, -- Traceability Link
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user', -- 'admin', 'coordinator', 'user'
    branch TEXT NOT NULL,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MIGRATION: EĞER TABLO ESKİYSE EKSİK SÜTUNLARI EKLE
ALTER TABLE staff ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE staff ADD COLUMN IF NOT EXISTS origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_arms_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_arms_staff_email ON staff(email);

DROP TRIGGER IF EXISTS tr_arms_update_staff ON staff;
CREATE TRIGGER tr_arms_update_staff
BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE FUNCTION arms_update_timestamp();

-- 5. PERSONEL DEGERLENDIRME TABLOSU
CREATE TABLE IF NOT EXISTS staff_assessments (
    id TEXT PRIMARY KEY DEFAULT (uuid_generate_v4())::text,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    ai_tags JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_arms_unique_assessment ON staff_assessments(staff_id, battery_id);

-- 6. BIREYSEL GELISIM PLANI (IDP)
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY DEFAULT (uuid_generate_v4())::text,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ILETISIM LOGLARI (YENI)
CREATE TABLE IF NOT EXISTS communication_logs (
    id TEXT PRIMARY KEY DEFAULT (uuid_generate_v4())::text,
    target_id TEXT, -- Candidate ID or Staff ID
    target_email TEXT,
    channel TEXT NOT NULL, -- 'email', 'whatsapp', 'sms'
    subject TEXT,
    content_preview TEXT,
    status TEXT NOT NULL, -- 'sent', 'failed', 'pending'
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comm_target ON communication_logs(target_id);

-- 8. SISTEM AYARLARI
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ADMIN VE AYAR SEEDING
INSERT INTO system_config (id, data) 
VALUES (1, '{
    "institutionName": "Yeni Gün Akademi",
    "aiTone": "balanced",
    "aiWeights": {"ethics": 40, "clinical": 30, "experience": 15, "fit": 15},
    "automation": {"autoEmailOnSchedule": true, "requireCvUpload": true}
}'::jsonb) 
ON CONFLICT (id) DO NOTHING;

-- Default Admin (Güvenlik için role eklendi)
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ADMIN', 'Sistem Yöneticisi', 'admin@yenigun.com', 'yenigun2024', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO UPDATE SET role = 'admin';
