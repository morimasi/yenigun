
-- ============================================================================
-- YENİ GÜN AKADEMİ | ULTIMATE UNIFIED ENTERPRISE DATABASE SCHEMA
-- VERSİYON: 25.0 (CONSOLIDATED PRODUCTION RELEASE)
-- GÜNCELLEME: Nöral Müfredat Yayıncılığı ve Klinik Otopsi Desteği
-- ============================================================================

-- 0. İNİSİYALİZASYON VE EKLENTİLER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bağımlılıkları temizlemek için CASCADE kullanımı (Görünümler yenilenir)
DROP VIEW IF EXISTS view_staff_performance_matrix CASCADE;
DROP VIEW IF EXISTS view_clinical_lab_stats CASCADE;
DROP VIEW IF EXISTS view_institutional_health_index CASCADE;

-- Otomatik Zaman Damgası Fonksiyonu
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 1. SİSTEM ÇEKİRDEĞİ (CONFIG & LOGS)
-- ============================================================================

-- [A] Global Sistem Yapılandırması (MIA Çekirdek Parametreleri)
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL, -- Ağırlık matrisleri, risk eşikleri, AI personası
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [B] Sistem Bildirimleri (Admin Sinyal Merkezi)
CREATE TABLE IF NOT EXISTS system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,         -- NEW_CANDIDATE, CRITICAL_RISK, SYSTEM_ALERT
    severity TEXT NOT NULL,     -- INFO, SUCCESS, WARNING, CRITICAL
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [C] İletişim Arşivi (Veli ve Personel Yazışma Geçmişi)
CREATE TABLE IF NOT EXISTS communication_logs (
    id SERIAL PRIMARY KEY,
    target_id TEXT,             -- Candidate ID veya Staff ID
    target_email TEXT,
    channel TEXT,               -- email, whatsapp, sms
    subject TEXT,
    content_preview TEXT,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. AKADEMİK ADAY VE İK HAVUZU (MIA RECRUITMENT)
-- ============================================================================

-- [D] Aday Dosyaları (Liyakat Filtresi)
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
    answers JSONB DEFAULT '{}'::jsonb, -- Mülakat yanıtları
    status TEXT DEFAULT 'pending',     -- pending, interview_scheduled, rejected, hired, archived
    report JSONB,                      -- Gemini AI Detaylı Liyakat Raporu
    algo_report JSONB,                 -- Algoritmik Skor Matrisi
    cv_data JSONB,                     -- Optimize edilmiş belge verisi
    archive_category TEXT,             -- HIRED_CONTRACTED, BLACK_LIST, DISQUALIFIED
    archive_note TEXT,
    admin_notes TEXT,
    interview_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. KURUMSAL KADRO VE GELİŞİM (ARMS & IDP)
-- ============================================================================

-- [E] Akademik Kadro (Aktif Uzmanlar)
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff',         -- admin, staff, mentor
    branch TEXT,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    last_score INTEGER DEFAULT 0,      -- En son sınav başarısı
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',      -- active, archived, on_leave
    report JSONB,                      -- Personel Klinik Profili (AI)
    archive_category TEXT,
    archive_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [F] Personel Yetkinlik Sınavları (Klinik Otopsi)
CREATE TABLE IF NOT EXISTS staff_assessments (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL,          -- aba_mastery, ethics_v2 etc.
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    ai_tags JSONB DEFAULT '[]'::jsonb, -- 'analytical', 'empathy_weak' etc.
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, battery_id)
);

-- [G] Bireysel Gelişim Planları (Neural IDP)
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL,               -- Curriculum, Roadmap, Milestones
    focus_area TEXT,
    status TEXT DEFAULT 'active',      -- active, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. AKADEMİ HUB (LMS & NEURAL PRODUCTION)
-- ============================================================================

-- [H] Eğitim Müfredat Kasası (Academy Vault)
CREATE TABLE IF NOT EXISTS training_curricula (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,            -- CLINICAL, ETHICS, ORIENTATION, MANAGEMENT
    data JSONB NOT NULL,               -- Slaytlar, Multimodal Elementler, Quizler
    status TEXT DEFAULT 'active',      -- active, archived, draft, published
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [I] Eğitim Atamaları ve LMS Takibi
CREATE TABLE IF NOT EXISTS training_assignments (
    id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES training_curricula(id) ON DELETE CASCADE,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'assigned',    -- assigned, in_progress, completed
    progress INTEGER DEFAULT 0,        -- %0 - 100
    score INTEGER,                     -- Eğitim sonu sınav skoru
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(plan_id, staff_id)
);

-- ============================================================================
-- 5. KLİNİK LABORATUVAR (SIMULATION & STRESS TEST)
-- ============================================================================

-- [J] Klinik Simülasyon Kayıtları (Deep Trace)
CREATE TABLE IF NOT EXISTS clinical_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,           -- DMP_STRESS, ETHICAL_DILEMMA etc.
    scenario TEXT NOT NULL,
    result_data JSONB NOT NULL,        -- Bilişsel çelişki, dominant duygu, karar yolu
    stress_level INTEGER NOT NULL,
    is_sealed BOOLEAN DEFAULT FALSE,   -- Mühürlenmiş rapor (değiştirilemez)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. PERFORMANS İNDEKSLERİ VE TAHKİMAT
-- ============================================================================

-- JSONB Üzerinde Derin Arama İndeksleri (Hızlandırıcılar)
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_curricula_data_gin ON training_curricula USING GIN (data);
CREATE INDEX IF NOT EXISTS idx_sim_result_gin ON clinical_simulations USING GIN (result_data);

-- Hızlı Filtreleme İndeksleri
CREATE INDEX IF NOT EXISTS idx_staff_active_search ON staff(status, branch) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_notif_unread ON system_notifications(is_read) WHERE is_read = FALSE;

-- Arşiv Kategorisi Kısıtlaması (Constraint)
ALTER TABLE candidates DROP CONSTRAINT IF EXISTS check_archive_cat;
ALTER TABLE candidates ADD CONSTRAINT check_archive_cat CHECK (
    archive_category IN (
        'CANDIDATE_POOL', 'HIRED_CONTRACTED', 'DISQUALIFIED', 'BLACK_LIST', 
        'STAFF_HISTORY', 'TALENT_POOL_ANALYTICS', 'TRAINING_LIBRARY', 
        'PERFORMANCE_SNAPSHOT', 'STRATEGIC_PLAN', 'CLINICAL_CASE_STUDY'
    )
);

-- ============================================================================
-- 7. ANALİTİK GÖRÜNÜMLER (BUSINESS INTELLIGENCE)
-- ============================================================================

-- Personel Liyakat Matrisi (Dashboard Verisi)
CREATE OR REPLACE VIEW view_staff_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.report as ai_report,
    (SELECT ROUND(AVG(score)) FROM staff_assessments WHERE staff_id = s.id) as avg_exam_score,
    (SELECT ROUND(AVG(score)) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as avg_lms_score,
    (SELECT COUNT(*) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as completed_trainings,
    (SELECT MAX(timestamp) FROM staff_assessments WHERE staff_id = s.id) as last_activity
FROM staff s
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.report;

-- ============================================================================
-- 8. OTOMATİK TETİKLEYİCİLER (TRIGGERS)
-- ============================================================================
DROP TRIGGER IF EXISTS trg_candidates_modtime ON candidates;
CREATE TRIGGER trg_candidates_modtime BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_staff_modtime ON staff;
CREATE TRIGGER trg_staff_modtime BEFORE UPDATE ON staff FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_curricula_modtime ON training_curricula;
CREATE TRIGGER trg_curricula_modtime BEFORE UPDATE ON training_curricula FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- 9. BAŞLANGIÇ VERİSİ (SEED DATA)
-- ============================================================================

-- [A] Kurumsal Admin Hesabı (Root)
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

-- [B] Global Konfigürasyon v25.0
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Özel Eğitim Akademi",
  "lastUpdated": 1715420000000,
  "weightMatrix": {
    "clinicalExpertise": 35,
    "ethicalIntegrity": 30,
    "emotionalResilience": 15,
    "institutionalLoyalty": 10,
    "learningAgility": 5,
    "academicPedagogy": 5
  },
  "riskEngine": {
    "criticalEthicalViolationPenalty": 50,
    "inconsistentAnswerPenalty": 25,
    "lowExperienceDiscountFactor": 0.85,
    "jobHoppingPenalty": 20
  },
  "aiPersona": {
    "skepticismLevel": 75,
    "innovationBias": 60,
    "stressTestIntensity": 85,
    "detailedReporting": true
  },
  "systemSettings": {
    "minHiringScore": 75,
    "highPotentialCutoff": 90,
    "autoRejectBelowScore": 40,
    "defaultMeetingLink": "https://meet.google.com/new"
  }
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;

-- [C] Sistem Selamlama Bildirimi
INSERT INTO system_notifications (type, severity, title, message)
VALUES ('SYSTEM_ALERT', 'SUCCESS', 'V25.0 Ultimate Unified Devreye Alındı', 'Veritabanı çekirdeği tüm akademik ve operasyonel modülleri kapsayacak şekilde mühürlendi.')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SON: MASTER SCHEMA v25.0 KURULUMU TAMAMLANDI.
-- ============================================================================
