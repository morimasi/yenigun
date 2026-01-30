
-- ======================================================
-- YENI GUN AKADEMI - ARMS (ACADEMIC RESONANCE SYSTEM)
-- VERITABANI MIMARISI v7.0 (FULL SYNC)
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

-- 3. ADAY YONETIM TABLOSU (GUNCEL)
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT,
    marital_status TEXT,
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
    interview_schedule JSONB,
    cv_data JSONB,
    admin_notes TEXT,
    reminder_note TEXT,
    archive_category TEXT,
    archive_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MIGRATION: EKSİK SÜTUNLARI ZORLA EKLE (Tablo varsa bile çalışır)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='marital_status') THEN
        ALTER TABLE candidates ADD COLUMN marital_status TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='age') THEN
        ALTER TABLE candidates ADD COLUMN age INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='gender') THEN
        ALTER TABLE candidates ADD COLUMN gender TEXT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_arms_cand_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_arms_cand_email ON candidates(email);

DROP TRIGGER IF EXISTS tr_arms_update_candidates ON candidates;
CREATE TRIGGER tr_arms_update_candidates
BEFORE UPDATE ON candidates
FOR EACH ROW EXECUTE FUNCTION arms_update_timestamp();

-- 4. AKADEMIK PERSONEL TABLOSU
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user', 
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

DROP TRIGGER IF EXISTS tr_arms_update_staff ON staff;
CREATE TRIGGER tr_arms_update_staff
BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE FUNCTION arms_update_timestamp();

-- 5. SISTEM AYARLARI
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
