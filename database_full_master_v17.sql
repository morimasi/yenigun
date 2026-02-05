
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL ERP & NÖRAL MÜFREDAT MASTER VERİTABANI
-- VERSİYON: 17.1 (NOTIFICATION UPDATE)
-- ============================================================================

-- [Existing table creation logic...]

-- J. SİSTEM BİLDİRİMLERİ (Admin Real-Time Alerts)
CREATE TABLE IF NOT EXISTS system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,         -- NEW_CANDIDATE, INTERVIEW_DUE, CONFIG_CHANGE, SYSTEM_ALERT
    severity TEXT NOT NULL,     -- INFO, SUCCESS, WARNING, CRITICAL
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notif_unread ON system_notifications(is_read) WHERE is_read = FALSE;

-- [Rest of the file remains the same...]
-- (Keep previous tables: system_config, candidates, staff, training_curricula, etc.)
-- Ensure the seed data includes initial notifications if needed
INSERT INTO system_notifications (type, severity, title, message)
VALUES ('SYSTEM_ALERT', 'SUCCESS', 'MIA Signal Hub Aktif', 'Admin bildirim merkezi v1.0 başarıyla devreye alındı.')
ON CONFLICT DO NOTHING;
