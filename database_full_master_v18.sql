
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP & NÖRAL MÜFREDAT MASTER VERİTABANI
-- VERSİYON: 18.1 (RECOVERY & SANITIZATION EDITION)
-- ============================================================================

-- [Önceki tablo oluşturma mantıkları korunur...]

-- 1. VERİ SANİTİZASYONU (KRİTİK): 
-- Yeni kısıtlama eklenmeden önce, mevcut satırlardaki geçersiz kategorileri temizliyoruz.
-- Bu adım SQLSTATE 23514 hatasını engeller.
UPDATE candidates 
SET archive_category = 'DISQUALIFIED' 
WHERE archive_category IS NOT NULL 
AND archive_category NOT IN (
    'CANDIDATE_POOL', 
    'DISQUALIFIED', 
    'BLACK_LIST', 
    'STAFF_HISTORY', 
    'TRAINING_LIBRARY', 
    'PERFORMANCE_SNAPSHOT', 
    'STRATEGIC_PLAN', 
    'CLINICAL_CASE_STUDY',
    'HIRED_CONTRACTED',
    'TALENT_POOL_ANALYTICS'
);

-- 2. ARŞİV KATEGORİLERİ İÇİN GÜNCEL KONTROL
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
        'CLINICAL_CASE_STUDY',
        'HIRED_CONTRACTED',
        'TALENT_POOL_ANALYTICS'
    )
);

-- 3. PERSONEL İÇİN ARŞİVLEME DESTEĞİ
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='archive_category') THEN
        ALTER TABLE staff ADD COLUMN archive_category TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='archive_note') THEN
        ALTER TABLE staff ADD COLUMN archive_note TEXT;
    END IF;
END $$;

-- 4. MÜFREDATLAR İÇİN ARŞİVLEME DURUMU
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='training_curricula' AND column_name='status') THEN
        ALTER TABLE training_curricula ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='training_curricula' AND column_name='archive_category') THEN
        ALTER TABLE training_curricula ADD COLUMN archive_category TEXT;
    END IF;
END $$;

-- 5. İSTATİSTİKLER İÇİN ARŞİV İNDEKSİ
CREATE INDEX IF NOT EXISTS idx_archive_search ON candidates(archive_category, status) WHERE status = 'archived';

-- 6. SEED DATA UPDATE
INSERT INTO system_notifications (type, severity, title, message)
VALUES ('SYSTEM_ALERT', 'SUCCESS', 'Arşiv v2.1 Onarıldı', 'Kurumsal bellek kasası veri sanitizasyonu ile v18.1 şemasına başarıyla mühürlendi.')
ON CONFLICT DO NOTHING;
