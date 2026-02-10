
-- ============================================================================
-- YENİ GÜN AKADEMİ | ULTIMATE UNIFIED ENTERPRISE DATABASE SCHEMA
-- VERSİYON: 31.0 (EXPORT AUDIT & COMPLIANCE EDITION)
-- ============================================================================

-- 0. İNİSİYALİZASYON
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bağımlı görünümleri temizle
DROP VIEW IF EXISTS view_export_audit_log CASCADE;
DROP VIEW IF EXISTS view_staff_performance_matrix CASCADE;

-- 1. DÖKÜMAN İHRACAT LOGLARI (Güvenlik ve Denetim Katmanı)
CREATE TABLE IF NOT EXISTS export_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
    entity_id TEXT NOT NULL,         -- Hangi aday veya personel?
    entity_type TEXT NOT NULL,       -- CANDIDATE, STAFF, TRAINING
    export_format TEXT NOT NULL,     -- PDF, PRINT, PPTX, CSV
    document_title TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLO TAHKİMATI (Eksik Kolonlar)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='is_published') THEN
        ALTER TABLE candidates ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='training_curricula' AND column_name='published_at') THEN
        ALTER TABLE training_curricula ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 3. ANALİTİK GÖRÜNÜMLER
-- [A] Döküman Trafiği Denetimi
CREATE VIEW view_export_audit_log AS
SELECT 
    el.created_at as "Tarih",
    s.name as "İşlemi Yapan",
    el.document_title as "Döküman",
    el.export_format as "Format",
    el.entity_type as "Kategori"
FROM export_logs el
LEFT JOIN staff s ON el.staff_id = s.id
ORDER BY el.created_at DESC;

-- [B] Personel Liyakat Matrisi (Genişletilmiş)
CREATE VIEW view_staff_performance_matrix AS
SELECT 
    s.id, s.name, s.branch, s.report as ai_report,
    (SELECT COUNT(*) FROM export_logs WHERE entity_id = s.id) as total_document_exports,
    (SELECT ROUND(AVG(score)) FROM training_assignments WHERE staff_id = s.id AND status = 'completed') as avg_lms_score
FROM staff s WHERE s.status = 'active'
GROUP BY s.id, s.name, s.branch, s.report;

-- 4. İNDEKSLEME
CREATE INDEX IF NOT EXISTS idx_export_logs_entity ON export_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_export_logs_staff ON export_logs(staff_id);

-- SEED NOTIFICATION
INSERT INTO system_notifications (type, severity, title, message)
VALUES ('SYSTEM_ALERT', 'SUCCESS', 'V31.0 Platinum Mühürlendi', 'Döküman denetim ve yayın trafiği takip sistemi aktif hale getirildi.')
ON CONFLICT DO NOTHING;
