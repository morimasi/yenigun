
-- ============================================================================
-- YENİ GÜN AKADEMİ | KLİNİK LABORATUVAR PERSİSTENCE YAMASI (v4.0)
-- ============================================================================

CREATE TABLE IF NOT EXISTS clinical_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,
    scenario TEXT NOT NULL,
    result_data JSONB NOT NULL,
    stress_level INTEGER NOT NULL,
    is_sealed BOOLEAN DEFAULT FALSE, -- Mühürlenmiş rapor (değiştirilemez)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hızlı arama ve raporlama için indeksler
CREATE INDEX IF NOT EXISTS idx_sim_candidate ON clinical_simulations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_sim_type ON clinical_simulations(test_type);
CREATE INDEX IF NOT EXISTS idx_sim_data_jsonb ON clinical_simulations USING GIN (result_data);

-- Gelişmiş istatistik görünümü
CREATE OR REPLACE VIEW view_clinical_lab_stats AS
SELECT 
    candidate_id,
    COUNT(*) as total_simulations,
    ROUND(AVG(stress_level)) as avg_stress_resilience,
    MAX(created_at) as last_test_date
FROM clinical_simulations
GROUP BY candidate_id;
