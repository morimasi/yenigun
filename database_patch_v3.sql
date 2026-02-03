
-- ============================================================================
-- YENİ GÜN AKADEMİ | PERSONEL ANALİZ PERSİSTENCE YAMASI (v3.1)
-- ============================================================================

-- 1. TAHKİMAT: Staff tablosuna AI analizlerini saklamak için JSONB kolonu ekle
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='report') THEN
        ALTER TABLE staff ADD COLUMN report JSONB DEFAULT NULL;
    END IF;
END $$;

-- 2. İNDEKSLEME: Analitik sorguların hızlandırılması
CREATE INDEX IF NOT EXISTS idx_staff_report_jsonb ON staff USING GIN (report);

-- 3. GÜNCELLEME: view_staff_performance_matrix'in genişletilmesi
CREATE OR REPLACE VIEW view_staff_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.report, -- AI Raporu view üzerinden de erişilebilir
    COUNT(sa.id) as total_tests,
    ROUND(AVG(sa.score)) as global_merit_score,
    MAX(sa.timestamp) as last_activity
FROM staff s
LEFT JOIN staff_assessments sa ON s.id = sa.staff_id
GROUP BY s.id, s.name, s.branch, s.report;
