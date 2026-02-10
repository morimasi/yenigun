
-- ============================================================================
-- YENİ GÜN AKADEMİ | ULTIMATE UNIFIED ENTERPRISE DATABASE SCHEMA
-- VERSİYON: 29.0 (PLATINUM EDITION - PUBLISH & EXPORT CENTER)
-- ============================================================================

-- 0. İNİSİYALİZASYON
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bağımlı görünümleri temizle (Hata payını sıfırlamak için)
DROP VIEW IF EXISTS view_staff_performance_matrix CASCADE;
DROP VIEW IF EXISTS view_institutional_health_check CASCADE;
DROP VIEW IF EXISTS view_clinical_lab_summary CASCADE;

-- Otomatik Zaman Damgası Fonksiyonu
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 1. SİSTEM ÇEKİRDEĞİ (PARAMETRELER VE BİLDİRİMLER)
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,         -- NEW_CANDIDATE, CRITICAL_RISK, PUBLISH_EVENT
    severity TEXT NOT NULL,     -- INFO, SUCCESS, WARNING, CRITICAL
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. ADAY VE PERSONEL TABLOLARI (PUBLISH DESTEKLİ)
-- ============================================================================

CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    branch TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    report JSONB,
    algo_report JSONB,
    cv_data JSONB,
    archive_category TEXT,
    archive_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    branch TEXT,
    report JSONB,
    archive_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. AKADEMİ HUB (LMS & NEURAL CONTENT ENGINE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS training_curricula (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    data JSONB NOT NULL,               -- Multimodal slaytlar ve grafikler
    status TEXT DEFAULT 'published',   -- draft, published, archived
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_assignments (
    id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES training_curricula(id) ON DELETE CASCADE,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'assigned',
    progress INTEGER DEFAULT 0,
    score INTEGER,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(plan_id, staff_id)
);

-- ============================================================================
-- 4. ANALİTİK GÖRÜNÜMLER (BUSINESS INTELLIGENCE)
-- ============================================================================

-- [A] Personel Liyakat ve Başarı Matrisi
CREATE VIEW view_staff_performance_matrix AS
SELECT 
    s.id, s.name, s.branch, s.report as ai_report,
    (SELECT ROUND(AVG(score)) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as avg_lms_score,
    (SELECT COUNT(*) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as completed_trainings
FROM staff s WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.report;

-- [B] Kurumsal Sağlık ve Akademik Doluluk (Stratejik Export Verisi)
CREATE VIEW view_institutional_health_check AS
SELECT 
    (SELECT COUNT(*) FROM candidates WHERE status = 'pending') as active_applications,
    (SELECT COUNT(*) FROM staff WHERE status = 'active') as active_staff_count,
    (SELECT COUNT(*) FROM training_curricula WHERE status = 'published') as published_trainings,
    (SELECT ROUND(AVG(score)) FROM (SELECT score FROM training_assignments WHERE status = 'completed') sub) as institutional_merit_avg;

-- ============================================================================
-- 5. TAHKİMAT VE İNDEKSLER
-- ============================================================================

-- Arşiv Kategorisi Doğrulama (Publish Studio Güvenliği)
ALTER TABLE candidates DROP CONSTRAINT IF EXISTS check_archive_cat;
ALTER TABLE candidates ADD CONSTRAINT check_archive_cat CHECK (
    archive_category IN (
        'CANDIDATE_POOL', 'HIRED_CONTRACTED', 'DISQUALIFIED', 'BLACK_LIST', 
        'TALENT_POOL_ANALYTICS', 'STRATEGIC_PLAN', 'CLINICAL_CASE_STUDY'
    )
);

CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);

-- SEED DATA
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete)
VALUES ('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO system_notifications (type, severity, title, message)
VALUES ('SYSTEM_ALERT', 'SUCCESS', 'V29.0 Platinum Mühürlendi', 'Publish & Export merkezi için veritabanı tahkimatı tamamlandı.')
ON CONFLICT DO NOTHING;
