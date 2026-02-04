
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP VE NÖRAL MÜFREDAT VERİTABANI (v15.1 - FINAL)
-- ============================================================================
-- BU ŞEMA, "NEURAL CURRICULUM STUDIO" VE "CLINICAL LAB" MODÜLLERİNİ DESTEKLER.
-- Idempotent yapıdadır: Hata vermeden defalarca çalıştırılabilir.
-- ============================================================================

-- 1. EKLENTİLER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. FONKSİYONLAR
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TABLO 1: SYSTEM_CONFIG (Global Ayarlar & AI Mizaç)
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLO 2: CANDIDATES (Akademik Aday Havuzu & MIA Raporları)
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
    status TEXT DEFAULT 'pending',
    report JSONB,          -- AI Detaylı Analiz Raporu
    algo_report JSONB,     -- Algoritmik Skorlama
    cv_data JSONB,         -- Base64 CV (Optimize edilmiş)
    archive_category TEXT, -- Arşivlenme Nedeni (HIRED, BLACKLIST vs.)
    archive_note TEXT,
    admin_notes TEXT,
    reminder_note TEXT,
    interview_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Derin Arama İndeksleri
CREATE INDEX IF NOT EXISTS idx_cand_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_cand_branch ON candidates(branch);
CREATE INDEX IF NOT EXISTS idx_cand_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);

-- ============================================================================
-- TABLO 3: STAFF (Akademik Kadro & Profil)
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
    all_trainings JSONB DEFAULT '[]'::jsonb,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    report JSONB, -- Personelin AI tarafından oluşturulan "Klinik Profili"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MIGRATION: 'staff' tablosu için eksik kolon kontrolü (Schema Drift Koruması)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='status') THEN
        ALTER TABLE staff ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='role') THEN
        ALTER TABLE staff ADD COLUMN role TEXT DEFAULT 'staff';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='onboarding_complete') THEN
        ALTER TABLE staff ADD COLUMN onboarding_complete BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='report') THEN
        ALTER TABLE staff ADD COLUMN report JSONB;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);

-- ============================================================================
-- TABLO 4: STAFF_ASSESSMENTS (Klinik Yetkinlik Bataryaları - Sınavlar)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_assessments (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL, -- Örn: 'aba_mastery_20'
    answers JSONB NOT NULL,   -- Verilen cevaplar
    score INTEGER NOT NULL,   -- 0-100
    ai_tags JSONB DEFAULT '[]'::jsonb, -- AI'ın tespit ettiği etiketler (Örn: 'risk_averse')
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, battery_id) -- Her batarya bir personel için tekil (sonuç güncellenir)
);

-- ============================================================================
-- TABLO 5: STAFF_IDP (Bireysel Gelişim Planı - NÖRAL MÜFREDAT)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY, -- 'IDP-XXXX' formatında
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    
    -- MÜFREDAT VERİSİ (JSONB)
    -- İçerik: curriculum (modules -> units), roadmap, milestones
    data JSONB NOT NULL, 
    
    focus_area TEXT, -- Hızlı erişim için ana odak (Örn: "Kriz Yönetimi")
    status TEXT DEFAULT 'active', -- 'active', 'archived', 'draft'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MIGRATION: 'staff_idp' tablosu için eksik kolon kontrolü
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_idp' AND column_name='status') THEN
        ALTER TABLE staff_idp ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_idp' AND column_name='focus_area') THEN
        ALTER TABLE staff_idp ADD COLUMN focus_area TEXT;
    END IF;
END $$;

-- JSONB içindeki müfredat başlıklarında arama yapabilmek için
CREATE INDEX IF NOT EXISTS idx_idp_data_gin ON staff_idp USING GIN (data);
CREATE INDEX IF NOT EXISTS idx_idp_staff_active ON staff_idp(staff_id) WHERE status = 'active';

-- ============================================================================
-- TABLO 6: CLINICAL_SIMULATIONS (Nöral Laboratuvar Sonuçları)
-- ============================================================================
CREATE TABLE IF NOT EXISTS clinical_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL, -- Örn: 'DMP_STRESS'
    scenario TEXT NOT NULL,
    result_data JSONB NOT NULL, -- AI Analiz Çıktısı (Deep Trace)
    stress_level INTEGER NOT NULL,
    is_sealed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sim_candidate ON clinical_simulations(candidate_id);

-- ============================================================================
-- TABLO 7: COMMUNICATION_LOGS (İletişim Arşivi)
-- ============================================================================
CREATE TABLE IF NOT EXISTS communication_logs (
    id SERIAL PRIMARY KEY,
    target_id TEXT,
    target_email TEXT,
    channel TEXT, -- 'email', 'whatsapp'
    subject TEXT,
    content_preview TEXT,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- GÖRÜNÜMLER (VIEWS) - ANALİTİK MOTORU İÇİN
-- ============================================================================

-- 1. PERSONEL PERFORMANS MATRİSİ
-- Admin panelinde "Liyakat Ortalaması" gibi metrikleri anlık hesaplar.
-- View yapısı değiştiğinde (kolon ekleme/çıkarma) önce düşürülmesi gerekir.
DROP VIEW IF EXISTS view_staff_performance_matrix;

CREATE OR REPLACE VIEW view_staff_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.role,
    s.report,
    COUNT(sa.id) as total_tests_taken,
    ROUND(AVG(COALESCE(sa.score, 0))) as global_merit_score,
    MAX(sa.timestamp) as last_activity_date,
    (SELECT COUNT(*) FROM staff_idp WHERE staff_id = s.id AND status = 'active') as has_active_idp
FROM staff s
LEFT JOIN staff_assessments sa ON s.id = sa.staff_id
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.role, s.report;

-- ============================================================================
-- TEMİZLİK VE TETİKLEYİCİLER
-- ============================================================================

DROP TRIGGER IF EXISTS trg_candidates_modtime ON candidates;
CREATE TRIGGER trg_candidates_modtime BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_staff_modtime ON staff;
CREATE TRIGGER trg_staff_modtime BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_idp_modtime ON staff_idp;
CREATE TRIGGER trg_idp_modtime BEFORE UPDATE ON staff_idp FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- SEED DATA (BAŞLANGIÇ VERİLERİ)
-- ============================================================================

-- Admin Hesabı (Mevcut değilse ekle)
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Varsayılan Ayarlar
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Akademi",
  "aiTone": "academic",
  "weightMatrix": { "clinicalExpertise": 30, "ethicalIntegrity": 30, "emotionalResilience": 15, "institutionalLoyalty": 10, "learningAgility": 10, "academicPedagogy": 5 },
  "systemSettings": { "minHiringScore": 75, "highPotentialCutoff": 90, "autoRejectBelowScore": 40 }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
