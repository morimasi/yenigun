
-- ============================================================================
-- YENİ GÜN AKADEMİ | ULTIMATE UNIFIED ENTERPRISE DATABASE SCHEMA
-- VERSİYON: 32.0 (UNIVERSAL EXPORT & AUDIT EDITION)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DENETİM İZİ (AUDIT TRAIL) TABLOSU
CREATE TABLE IF NOT EXISTS export_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
    entity_id TEXT NOT NULL,         -- Aday ID, Personel ID veya Eğitim ID
    entity_type TEXT NOT NULL,       -- CANDIDATE, STAFF, TRAINING, INVENTORY, ARCHIVE
    export_format TEXT NOT NULL,     -- PDF, PRINT, PPTX, CSV, PUBLISH
    document_title TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLO TAHKİMATLARI
DO $$ 
BEGIN
    -- Yayınlanma durumu takibi
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='is_published') THEN
        ALTER TABLE candidates ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='training_curricula' AND column_name='published_at') THEN
        ALTER TABLE training_curricula ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 3. ANALİTİK DENETİM GÖRÜNÜMÜ (ERROR FIX: DROP BEFORE CREATE)
DROP VIEW IF EXISTS view_export_audit_log;
CREATE OR REPLACE VIEW view_export_audit_log AS
SELECT 
    el.created_at as "Tarih",
    s.name as "İşlemi Yapan",
    el.document_title as "Belge Başlığı",
    el.export_format as "Format",
    el.entity_type as "Modül"
FROM export_logs el
LEFT JOIN staff s ON el.staff_id = s.id
ORDER BY el.created_at DESC;

-- INDEXING
CREATE INDEX IF NOT EXISTS idx_export_logs_entity ON export_logs(entity_id, entity_type);

-- NOTIFICATION
INSERT INTO system_notifications (type, severity, title, message)
VALUES ('SYSTEM_ALERT', 'SUCCESS', 'V32.0 Evrensel Export Aktif', 'Tüm kurumsal modüller için yayın ve denetim entegrasyonu tamamlandı.')
ON CONFLICT DO NOTHING;
