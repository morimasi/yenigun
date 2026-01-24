
-- ===========================================================================
-- YENİ GÜN AKADEMİ: KLİNİK LİYAKAT VE AKADEMİK ANALİZ SİSTEMİ
-- FULLSTACK VERİTABANI ŞEMASI (V5.1 PRO - FIXED VERSION)
-- ===========================================================================

-- 1. GEREKLİ UZANTILAR
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SİSTEM KONFİGÜRASYONU (Singleton Table)
-- Uygulama tarafındaki GlobalConfig tipini 'data' JSONB kolonunda saklar.
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Sadece tek satır (Singleton)
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ADAYLAR (Core Matrix Table)
-- api/candidates.ts dosyası ile %100 uyumlu kolon yapısı
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT,
    branch TEXT NOT NULL,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    previous_institutions TEXT,
    
    -- Akademik ve Klinik Veri Kümeleri
    all_trainings JSONB DEFAULT '[]'::jsonb,
    answers JSONB DEFAULT '{}'::jsonb,
    
    -- Raporlar ve Analizler
    report JSONB DEFAULT NULL,
    algo_report JSONB DEFAULT NULL,
    interview_schedule JSONB DEFAULT NULL,
    
    -- Durum ve Takip
    status TEXT NOT NULL DEFAULT 'pending', 
    admin_notes TEXT,
    reminder_note TEXT,
    
    -- Dosya Verisi (CV/Belge)
    cv_data JSONB DEFAULT NULL,
    
    -- Zaman Damgaları
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. YÖNETİCİ KİMLİK DOĞRULAMA
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, 
    role TEXT DEFAULT 'admin',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. LİYAKAT DENETİM LOGLARI (Audit Trail)
CREATE TABLE IF NOT EXISTS merit_audit_logs (
    id SERIAL PRIMARY KEY,
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- ANALYSIS_RUN, STATUS_CHANGE, INTERVIEW_SCHEDULED
    model_name TEXT, 
    meta_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. İNDEKSLER (Performans Optimizasyonu)
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_branch ON candidates(branch);
CREATE INDEX IF NOT EXISTS idx_candidates_updated_at ON candidates(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_report_gin ON candidates USING GIN (report);

-- 7. OTOMATİK GÜNCELLEME TETİKLEYİCİSİ
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_candidates_updated_at
BEFORE UPDATE ON candidates
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_config_updated_at
BEFORE UPDATE ON system_config
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- 8. VARSAYILAN VERİLER (Initial Seeding)
-- ÖNEMLİ: Hata veren kolonlar JSONB objesi içine (data kolonu) taşındı.
INSERT INTO system_config (id, data) 
VALUES (1, '{
    "institutionName": "Yeni Gün Akademi",
    "primaryColor": "#ea580c",
    "accentColor": "#0f172a",
    "aiTone": "balanced",
    "aiPersona": {"skepticism": 50, "empathy": 50, "formality": 70},
    "aiWeights": {"ethics": 40, "clinical": 30, "experience": 15, "fit": 15},
    "automation": {"autoEmailOnSchedule": true, "requireCvUpload": true, "allowMultipleApplications": false},
    "interviewSettings": {"defaultDuration": 45, "bufferTime": 15, "autoStatusAfterInterview": false, "defaultMeetingLink": "https://meet.google.com/new"},
    "notificationEmail": "info@yenigun.com",
    "lastUpdated": 1704067200000
}'::jsonb) 
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- Örnek Admin Girişi (Kullanıcı: admin / Şifre Hash'i Uygulama Tarafından Yönetilir)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', 'hashed_password_here') 
ON CONFLICT (username) DO NOTHING;
