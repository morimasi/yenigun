
-- ===========================================================================
-- YENİ GÜN AKADEMİ: KLİNİK LİYAKAT VE AKADEMİK ANALİZ SİSTEMİ
-- FULLSTACK VERİTABANI ŞEMASI (V5.0 PRO)
-- ===========================================================================

-- 1. UZANTILARIN AKTİFLEŞTİRİLMESİ (Arama performansı için)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SİSTEM KONFİGÜRASYONU (Singleton Table)
-- Kurumsal kimlik, AI Persona ve Ağırlık parametrelerini saklar.
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Sadece tek satır olabilir
    institution_name TEXT NOT NULL DEFAULT 'Yeni Gün Akademi',
    primary_color TEXT DEFAULT '#ea580c',
    accent_color TEXT DEFAULT '#0f172a',
    data JSONB NOT NULL DEFAULT '{
        "aiTone": "balanced",
        "aiPersona": {"skepticism": 50, "empathy": 50, "formality": 70},
        "aiWeights": {"ethics": 40, "clinical": 30, "experience": 15, "fit": 15},
        "automation": {"autoEmailOnSchedule": true, "requireCvUpload": true},
        "interviewSettings": {"defaultDuration": 45, "bufferTime": 15}
    }'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ADAYLAR (Core Matrix Table)
-- Adayın akademik DNA'sını ve tüm süreç geçmişini tutar.
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY, -- Uygulama tarafında üretilen unik ID
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT,
    branch TEXT NOT NULL, -- Branş bazlı filtreleme için kritik
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    previous_institutions TEXT,
    
    -- Akademik ve Klinik Veri Kümeleri (JSONB)
    all_trainings JSONB DEFAULT '[]'::jsonb,
    answers JSONB DEFAULT '{}'::jsonb, -- Form cevapları
    
    -- AI ve Algoritmik Analiz Raporları
    report JSONB DEFAULT NULL, -- Gemini tarafından üretilen derin analiz
    algo_report JSONB DEFAULT NULL, -- analysisUtils.ts tarafından üretilen skorlar
    
    -- Durum ve Takip
    status TEXT NOT NULL DEFAULT 'pending', -- pending, interview_scheduled, rejected, hired, withdrawn
    admin_notes TEXT,
    reminder_note TEXT, -- Kısa takip notları
    
    -- Mülakat Planlama
    interview_schedule JSONB DEFAULT NULL, -- {date, time, method, location, link}
    
    -- Dosya Verisi (Base64 saklama alanı)
    cv_data JSONB DEFAULT NULL,
    
    -- Zaman Damgaları
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. YÖNETİCİ KİMLİK DOĞRULAMA (Admin Panel Access)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Uygulama tarafında hashlenerek saklanır
    role TEXT DEFAULT 'admin',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. LİYAKAT DENETİM LOGLARI (Audit Trail)
-- Hangi adayın analizi ne zaman yapıldı? Hangi AI modeli kullanıldı?
CREATE TABLE IF NOT EXISTS merit_audit_logs (
    id SERIAL PRIMARY KEY,
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- ANALYSIS_RUN, STATUS_CHANGE, INTERVIEW_SCHEDULED
    model_name TEXT, -- örn: gemini-3-flash-preview
    meta_data JSONB, -- O anki config ağırlıklarını saklamak için
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. İNDEKSLER (Performans Optimizasyonu)
-- Hızlı arama ve sıralama için
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_branch ON candidates(branch);
CREATE INDEX IF NOT EXISTS idx_candidates_updated_at ON candidates(updated_at DESC);
-- JSONB içindeki skorlara hızlı erişim için GIN indeksi
CREATE INDEX IF NOT EXISTS idx_candidates_report_gin ON candidates USING GIN (report);

-- 7. OTOMATİK GÜNCELLEME TETİKLEYİCİSİ (Updated At Trigger)
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
INSERT INTO system_config (id, institution_name) 
VALUES (1, 'Yeni Gün Akademi') 
ON CONFLICT (id) DO NOTHING;

-- Örnek Admin (Giriş için: admin / yenigun2024 - Hash simülasyonu)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', 'hashed_password_here') 
ON CONFLICT (username) DO NOTHING;
