
-- ======================================================
-- YENI GUN AKADEMI - ARMS (ACADEMIC RESONANCE SYSTEM)
-- VERITABANI MIMARISI v5.0 (DEEP PROFESSIONAL)
-- ======================================================

-- 1. GEREKLI EKLENTILERIN AKTIFLESTIRILMESI
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. OTOMATIK ZAMAN GUNCELLEME FONKSIYONU
CREATE OR REPLACE FUNCTION arms_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. ADAY YONETIM TABLOSU (CANDIDATES)
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
    cv_data JSONB DEFAULT NULL,
    admin_notes TEXT,
    reminder_note TEXT,
    archive_category TEXT,
    archive_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_arms_cand_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_arms_cand_branch ON candidates(branch);
CREATE INDEX IF NOT EXISTS idx_arms_cand_email ON candidates(email);

DROP TRIGGER IF EXISTS tr_arms_update_candidates ON candidates;
CREATE TRIGGER tr_arms_update_candidates
BEFORE UPDATE ON candidates
FOR EACH ROW EXECUTE FUNCTION arms_update_timestamp();

-- 4. AKADEMIK PERSONEL TABLOSU (STAFF)
-- Not: email ve phone UNIQUE yapılarak 'Tekil Kimlik' (Identity Singularity) sağlanmıştır.
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE, -- Telefon numarası da artık tekil olmak zorunda
    password_hash TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_arms_staff_branch ON staff(branch);
CREATE INDEX IF NOT EXISTS idx_arms_staff_email ON staff(email);

DROP TRIGGER IF EXISTS tr_arms_update_staff ON staff;
CREATE TRIGGER tr_arms_update_staff
BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE FUNCTION arms_update_timestamp();

-- 5. PERSONEL DEGERLENDIRME TABLOSU (STAFF ASSESSMENTS)
CREATE TABLE IF NOT EXISTS staff_assessments (
    id TEXT PRIMARY KEY DEFAULT (random()*1000000)::text,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    ai_tags JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_arms_ass_staff_id ON staff_assessments(staff_id);
-- Mükerrer testi önlemek için (Bir personel bir testi sadece bir kez mühürleyebilir)
CREATE UNIQUE INDEX IF NOT EXISTS idx_arms_unique_assessment ON staff_assessments(staff_id, battery_id);

-- 6. BIREYSEL GELISIM PLANI TABLOSU (STAFF IDP)
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY DEFAULT (random()*1000000)::text,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_arms_idp_active ON staff_idp(staff_id) WHERE is_active = TRUE;

-- 7. SISTEM AYARLARI TABLOSU (SYSTEM CONFIG)
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. VARSAYILAN AYARLAR
INSERT INTO system_config (id, data) 
VALUES (1, '{
    "institutionName": "Yeni Gün Akademi",
    "aiTone": "balanced",
    "aiWeights": {"ethics": 40, "clinical": 30, "experience": 15, "fit": 15},
    "automation": {"autoEmailOnSchedule": true, "requireCvUpload": true}
}'::jsonb) 
ON CONFLICT (id) DO NOTHING;

-- 9. ADMIN KULLANICISI
INSERT INTO staff (id, name, email, password_hash, branch, onboarding_complete)
VALUES ('STF-001', 'Akademik Admin', 'admin@yenigun.com', 'yenigun2024', 'Özel Eğitim', FALSE)
ON CONFLICT (id) DO NOTHING;
