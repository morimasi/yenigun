
-- ============================================================================
-- YENİ GÜN AKADEMİ | UNIFIED ENTERPRISE GOVERNANCE DATABASE
-- VERSİYON: 22.0 (STABLE PRODUCTION - REPAIR & SYNC)
-- KAPSAM: MIA AI, ARMS, CLINICAL LAB, LMS STUDIO, COMM CENTER, NOTIFICATIONS
-- ============================================================================

-- 0. İNİSİYALİZASYON VE EKLENTİLER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bağımlılıkları temizle (Görünümler her zaman güncel kalmalı)
DROP VIEW IF EXISTS view_staff_performance_matrix CASCADE;
DROP VIEW IF EXISTS view_clinical_lab_stats CASCADE;

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 1. TABLO ŞEMALARI VE OTOMATİK MİGRASYONLAR
-- ============================================================================

-- [A] SİSTEM KONFİGÜRASYONU
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [B] ADAY HAVUZU (MIA)
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
    report JSONB,
    algo_report JSONB,
    cv_data JSONB,
    archive_category TEXT, 
    archive_note TEXT,
    admin_notes TEXT,
    reminder_note TEXT,
    interview_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [C] AKADEMİK KADRO (ARMS)
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    branch TEXT,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    report JSONB,
    archive_category TEXT,
    archive_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- @fix: SÜTUN MİGRASYON BLOĞU (Hata Veren Sütunu Garantile)
DO $$ 
BEGIN
    -- Staff tablosuna last_score ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='last_score') THEN
        ALTER TABLE staff ADD COLUMN last_score INTEGER DEFAULT 0;
    END IF;
    
    -- Eksik olabilecek diğer kolonları kontrol et
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='university') THEN
        ALTER TABLE staff ADD COLUMN university TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='department') THEN
        ALTER TABLE staff ADD COLUMN department TEXT;
    END IF;
END $$;

-- [D] EĞİTİM MÜFREDAT FABRİKASI
CREATE TABLE IF NOT EXISTS training_curricula (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    data JSONB NOT NULL,     
    status TEXT DEFAULT 'active',
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [E] EĞİTİM ATAMALARI
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

-- [F] YETKİNLİK BATARYALARI
CREATE TABLE IF NOT EXISTS staff_assessments (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL, 
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    ai_tags JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, battery_id)
);

-- [G] BİREYSEL GELİŞİM PLANLARI (IDP)
CREATE TABLE IF NOT EXISTS staff_idp (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    focus_area TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [H] KLİNİK LABORATUVAR
CREATE TABLE IF NOT EXISTS clinical_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,
    scenario TEXT NOT NULL,
    result_data JSONB NOT NULL,
    stress_level INTEGER NOT NULL,
    is_sealed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [I] SİSTEM BİLDİRİMLERİ
CREATE TABLE IF NOT EXISTS system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [J] İLETİŞİM ARŞİVİ
CREATE TABLE IF NOT EXISTS communication_logs (
    id SERIAL PRIMARY KEY,
    target_id TEXT,
    target_email TEXT,
    channel TEXT, 
    subject TEXT,
    content_preview TEXT,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. VERİ SANİTİZASYONU VE TAHKİMAT
-- ============================================================================

-- Arşiv kısıtlaması eklenmeden önce geçersiz verileri temizle
UPDATE candidates 
SET archive_category = 'DISQUALIFIED' 
WHERE archive_category IS NOT NULL 
AND archive_category NOT IN (
    'CANDIDATE_POOL', 'HIRED_CONTRACTED', 'DISQUALIFIED', 'BLACK_LIST', 
    'STAFF_HISTORY', 'TALENT_POOL_ANALYTICS', 'TRAINING_LIBRARY', 
    'PERFORMANCE_SNAPSHOT', 'STRATEGIC_PLAN', 'CLINICAL_CASE_STUDY'
);

ALTER TABLE candidates DROP CONSTRAINT IF EXISTS check_archive_cat;
ALTER TABLE candidates ADD CONSTRAINT check_archive_cat CHECK (
    archive_category IN (
        'CANDIDATE_POOL', 'HIRED_CONTRACTED', 'DISQUALIFIED', 'BLACK_LIST', 
        'STAFF_HISTORY', 'TALENT_POOL_ANALYTICS', 'TRAINING_LIBRARY', 
        'PERFORMANCE_SNAPSHOT', 'STRATEGIC_PLAN', 'CLINICAL_CASE_STUDY'
    )
);

-- ============================================================================
-- 3. PERFORMANS İNDEKSLERİ (GIN)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_cand_report_gin ON candidates USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_staff_report_gin ON staff USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_curricula_data_gin ON training_curricula USING GIN (data);
CREATE INDEX IF NOT EXISTS idx_notif_unread ON system_notifications(is_read) WHERE is_read = FALSE;

-- ============================================================================
-- 4. ANALİTİK GÖRÜNÜMLER (VIEWS)
-- ============================================================================
CREATE OR REPLACE VIEW view_staff_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.report,
    (SELECT ROUND(AVG(score)) FROM staff_assessments WHERE staff_id = s.id) as avg_exam_score,
    (SELECT ROUND(AVG(score)) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as avg_lms_score,
    MAX(sa.timestamp) as last_activity
FROM staff s
LEFT JOIN staff_assessments sa ON s.id = sa.staff_id
WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.report;

-- ============================================================================
-- 5. SEED DATA (ÖRNEK ADAY VE PERSONEL VERİLERİ)
-- ============================================================================

-- [A] SİSTEM KONFİGÜRASYONU
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Özel Eğitim Akademi",
  "weightMatrix": { "clinicalExpertise": 35, "ethicalIntegrity": 25, "emotionalResilience": 15, "institutionalLoyalty": 10, "learningAgility": 10, "academicPedagogy": 5 },
  "riskEngine": { "criticalEthicalViolationPenalty": 50, "inconsistentAnswerPenalty": 25, "lowExperienceDiscountFactor": 0.8, "jobHoppingPenalty": 20 },
  "aiPersona": { "skepticismLevel": 80, "innovationBias": 60, "stressTestIntensity": 90, "detailedReporting": true },
  "systemSettings": { "minHiringScore": 75, "highPotentialCutoff": 88, "autoRejectBelowScore": 40 }
}'::jsonb) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- [B] ÖRNEK ADAYLAR
INSERT INTO candidates (id, name, email, branch, university, experience_years, status, report)
VALUES 
('CAN-001', 'Zeynep Aksoy', 'zeynep.aksoy@email.com', 'Dil ve Konuşma Terapisi', 'Hacettepe Üniversitesi', 4, 'interview_scheduled', 
 '{ "score": 84, "integrityIndex": 92, "summary": "Klinik müdahale hızı yüksek, etik sınırları çok net bir aday.", "deepAnalysis": { "workEthics": { "score": 95, "status": "OPTIMAL" } } }'::jsonb),
('CAN-002', 'Murat Yıldız', 'murat.yildiz@email.com', 'Özel Eğitim', 'Anadolu Üniversitesi', 7, 'pending',
 '{ "score": 62, "integrityIndex": 70, "summary": "Deneyimli ancak geleneksel yöntemlere aşırı bağlı, inovasyon direnci var.", "deepAnalysis": { "developmentOpenness": { "score": 40, "status": "RISK" } } }'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- [C] ÖRNEK PERSONEL
INSERT INTO staff (id, name, email, password_hash, role, branch, onboarding_complete, last_score)
VALUES 
('STF-ROOT', 'Sistem Yöneticisi', 'admin@yenigun.com', 'admin123', 'admin', 'Yönetim', TRUE, 100),
('STF-001', 'Elif Demir', 'elif.demir@yenigun.com', 'elif2024', 'staff', 'Ergoterapi', TRUE, 89),
('STF-002', 'Caner Tekin', 'caner.tekin@yenigun.com', 'caner2024', 'staff', 'Psikoloji', TRUE, 76)
ON CONFLICT (email) DO NOTHING;

-- [D] SİSTEM BİLDİRİMLERİ
INSERT INTO system_notifications (type, severity, title, message)
VALUES 
('SYSTEM_ALERT', 'SUCCESS', 'V22.0 Master Onarıldı', 'Hatalı tablo sütunları onarıldı ve akademik liyakat matrisi senkronize edildi.'),
('NEW_CANDIDATE', 'INFO', 'Yeni Başvuru: Zeynep Aksoy', 'MIA Analiz Motoru aday dosyasını %84 liyakatle mühürledi.')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SON: MASTER SCHEMA v22.0 KURULUMU VE ONARIMI TAMAMLANDI.
-- ============================================================================
