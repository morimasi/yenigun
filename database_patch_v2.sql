
-- ============================================================================
-- YENİ GÜN AKADEMİ | VERİTABANI SAĞLIK VE PERFORMANS YAMASI (v2.1)
-- ============================================================================

-- 1. PERFORMANS: JSONB kolonları üzerinde derinlemesine arama için GIN indeksleri
-- Bu indeksler, AI'nın sertifika ve yetkinlik bazlı filtrelemeleri anında yapmasını sağlar.
CREATE INDEX IF NOT EXISTS idx_candidates_report_jsonb ON candidates USING GIN (report);
CREATE INDEX IF NOT EXISTS idx_candidates_trainings_jsonb ON candidates USING GIN (all_trainings);
CREATE INDEX IF NOT EXISTS idx_staff_assessments_answers_jsonb ON staff_assessments USING GIN (answers);

-- 2. TAHKİMAT: Staff tablosunda eksik olabilecek akademik kolonların garantilenmesi
-- Bazı eski sürümlerde bu kolonlar eksik kalmış olabilir.
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
END $$;

-- 3. ANALİTİK: Personel başarı ortalamasını anlık hesaplamak için bir VIEW
-- Admin panelindeki ArmsDashboard yükünü hafifletir.
CREATE OR REPLACE VIEW view_staff_performance_matrix AS
SELECT 
    s.id,
    s.name,
    s.branch,
    COUNT(sa.id) as total_tests,
    ROUND(AVG(sa.score)) as global_merit_score,
    MAX(sa.timestamp) as last_activity
FROM staff s
LEFT JOIN staff_assessments sa ON s.id = sa.staff_id
GROUP BY s.id, s.name, s.branch;

-- 4. GÜVENLİK: İletişim logları için zaman aşımı (Opsiyonel - Veri temizliği)
-- 1 yıldan eski gönderim kayıtlarını temizlemek isterseniz bu alanı kullanabilirsiniz.
-- DELETE FROM communication_logs WHERE timestamp < NOW() - INTERVAL '1 year';
