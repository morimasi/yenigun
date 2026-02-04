
-- ============================================================================
-- YENİ GÜN AKADEMİ | MIA & ARMS FULLSTACK VERİTABANI MİMARİSİ (v12.0 - AKADEMİ ÖZEL)
-- ============================================================================
-- Bu dosya tüm modülleri (Intake, Lab, ARMS, Studio, IDP) kapsayan "Master" dosyadır.
-- PostgreSQL / Vercel Postgres ortamları için tam uyumludur.
-- ============================================================================

-- 1. EKLENTİ VE FONKSİYONLAR
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 2. SİSTEM VE KONFİGÜRASYON KATMANI
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL, -- Global parametreler, AI mizaç ayarları, kurum bilgileri
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. ADAY YÖNETİM KATMANI (CANDIDATE INTAKE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT DEFAULT 'Belirtilmemiş',
    marital_status TEXT DEFAULT 'Bekar',
    branch TEXT NOT NULL, -- Branş (Özel Eğitim, DKT, Ergo vb.)
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    previous_institutions TEXT,
    all_trainings JSONB DEFAULT '[]'::jsonb, -- Alınan sertifikalar
    answers JSONB DEFAULT '{}'::jsonb, -- Liyakat matrisi cevapları
    status TEXT DEFAULT 'pending', -- pending, interview_scheduled, rejected, hired, archived
    report JSONB, -- Gemini-3 AI Analiz Raporu (Full Matrix)
    algo_report JSONB, -- Algoritmik Skorlama Sonuçları
    cv_data JSONB, -- Base64 Belge Verisi ve Meta
    archive_category TEXT, -- TALENT_POOL, BLACK_LIST, HIRED_CONTRACTED vb.
    archive_note TEXT,
    admin_notes TEXT,
    reminder_note TEXT,
    interview_schedule JSONB, -- {date, time, link}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GIN Indeksleri (JSONB İçerisinde Derin Arama İçin)
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_cand_trainings_gin ON candidates USING GIN (all_trainings);

-- ============================================================================
-- 4. PERSONEL VE AKADEMİK KAYNAK KATMANI (ARMS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY, -- Personel Sicil No
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL, -- Başvuru kökeni
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff', -- admin, staff, mentor
    branch TEXT,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    report JSONB, -- Güncel Liyakat ve Gelişim Raporu
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active', -- active, archived, on_leave
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Eski veritabanlarında kolon eksikse ekle (Migration Logic)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='university') THEN
        ALTER TABLE staff ADD COLUMN university TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='department') THEN
        ALTER TABLE staff ADD COLUMN department TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='experience_years') THEN
        ALTER TABLE staff ADD COLUMN experience_years INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='onboarding_complete') THEN
        ALTER TABLE staff ADD COLUMN onboarding_complete BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='report') THEN
        ALTER TABLE staff ADD COLUMN report JSONB DEFAULT NULL;
    END IF;
END $$;

-- Tetikleyiciler
DROP TRIGGER IF EXISTS trg_candidates_upd ON candidates;
CREATE TRIGGER trg_candidates_upd BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_staff_upd ON staff;
CREATE TRIGGER trg_staff_upd BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- 5. KLİNİK LABORATUVAR VE SİMÜLASYON (LAB)
-- ============================================================================

CREATE TABLE IF NOT EXISTS clinical_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL, -- DMP_STRESS, ETHICAL_DILEMMA vb.
    scenario TEXT NOT NULL, -- AI tarafından üretilen kurgu
    result_data JSONB NOT NULL, -- Nöral sapma skorları, micro-behavior tahminleri
    stress_level INTEGER NOT NULL,
    is_sealed BOOLEAN DEFAULT FALSE, -- Rapor mühürlendi mi?
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. GELİŞİM VE EĞİTİM TAKİP (IDP & ASSESSMENT)
-- ============================================================================

CREATE TABLE IF NOT EXISTS staff_assessments (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL, -- ABA_MASTERY, ACADEMIC_CORE vb.
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    ai_tags JSONB DEFAULT '[]'::jsonb, -- Örn: growth_mindset, risk_averse
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, battery_id)
);

CREATE TABLE IF NOT EXISTS staff_idp (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL, -- {focusArea, roadmap, milestones, recommendedTrainings}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. KURUMSAL İLETİŞİM VE KAYIT (NOTIFICATION)
-- ============================================================================

CREATE TABLE IF NOT EXISTS communication_logs (
    id SERIAL PRIMARY KEY,
    target_id TEXT, -- Aday veya Personel ID
    target_email TEXT,
    channel TEXT, -- email, whatsapp, sms
    subject TEXT,
    content_preview TEXT,
    status TEXT DEFAULT 'pending', -- sent, failed
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. ANALİTİK GÖRÜNÜMLER (VIEWS)
-- ============================================================================

-- Personel Liyakat ve Gelişim İzleme Panosu
CREATE OR REPLACE VIEW view_arms_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.role,
    s.report as current_ai_report,
    COUNT(sa.id) as total_tests_taken,
    ROUND(AVG(sa.score)) as global_merit_score,
    (SELECT data FROM staff_idp WHERE staff_id = s.id AND is_active = TRUE LIMIT 1) as active_development_plan,
    MAX(sa.timestamp) as last_activity
FROM staff s
LEFT JOIN staff_assessments sa ON s.id = sa.staff_id
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.role, s.report;

-- Aday Havuzu Stratejik Analiz Görünümü
CREATE OR REPLACE VIEW view_talent_pool_analytics AS
SELECT 
    branch,
    COUNT(*) as total_candidates,
    ROUND(AVG((report->>'score')::numeric)) as avg_ai_score,
    COUNT(*) FILTER (WHERE (report->>'score')::numeric > 85) as hipo_count, -- High Potential
    COUNT(*) FILTER (WHERE status = 'rejected') as rejection_rate
FROM candidates
WHERE status != 'archived' OR archive_category = 'TALENT_POOL'
GROUP BY branch;

-- ============================================================================
-- 9. BAŞLANGIÇ VERİSİ (SEED)
-- ============================================================================

-- Varsayılan Admin (admin123)
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Global Konfigürasyon v12
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Akademi",
  "aiTone": "academic",
  "advancedAnalytics": {
      "weights": { 
          "clinicalDepth": 30, 
          "ethicalIntegrity": 30, 
          "emotionalResilience": 15, 
          "institutionalLoyalty": 10, 
          "learningAgility": 15 
      },
      "penalties": { 
          "criticalEthicalViolation": 40, 
          "inconsistentAnswers": 20, 
          "lowExperienceDiscount": 0.85 
      },
      "thresholds": { 
          "minHiringScore": 75, 
          "highPotentialCutoff": 90 
      },
      "aiCognition": { 
          "skepticismLevel": 75, 
          "innovationBias": 60, 
          "stressTestIntensity": 85 
      }
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SON: Veritabanı Tahkimatı Tamamlandı.
-- ============================================================================
