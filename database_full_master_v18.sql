
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP & NÖRAL MÜFREDAT MASTER VERİTABANI
-- VERSİYON: 18.0 (UNIFIED VAULT EDITION)
-- ============================================================================

-- [Önceki tablo oluşturma mantıkları korunur...]

-- ARŞİV KATEGORİLERİ İÇİN GÜNCEL KONTROL (Kayıtların silinmek yerine kategorize edilmesi için)
ALTER TABLE candidates DROP CONSTRAINT IF EXISTS check_archive_cat;
ALTER TABLE candidates ADD CONSTRAINT check_archive_cat CHECK (
    archive_category IN (
        'CANDIDATE_POOL', 
        'DISQUALIFIED', 
        'BLACK_LIST', 
        'STAFF_HISTORY', 
        'TRAINING_LIBRARY', 
        'PERFORMANCE_SNAPSHOT', 
        'STRATEGIC_PLAN', 
        'CLINICAL_CASE_STUDY'
    )
);

-- PERSONEL İÇİN ARŞİVLEME DESTEĞİ
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='archive_category') THEN
        ALTER TABLE staff ADD COLUMN archive_category TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='archive_note') THEN
        ALTER TABLE staff ADD COLUMN archive_note TEXT;
    END IF;
END $$;

-- MÜFREDATLAR İÇİN ARŞİVLEME DURUMU
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='training_curricula' AND column_name='status') THEN
        ALTER TABLE training_curricula ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='training_curricula' AND column_name='archive_category') THEN
        ALTER TABLE training_curricula ADD COLUMN archive_category TEXT;
    END IF;
END $$;

-- İSTATİSTİKLER İÇİN ARŞİV İNDEKSİ
CREATE INDEX IF NOT EXISTS idx_archive_search ON candidates(archive_category, status) WHERE status = 'archived';

-- SEED DATA UPDATE
INSERT INTO system_notifications (type, severity, title, message)
VALUES ('SYSTEM_ALERT', 'SUCCESS', 'Arşiv v2.0 Aktif', 'Kurumsal bellek kasası v18.0 şemasına başarıyla mühürlendi.')
ON CONFLICT DO NOTHING;
