
-- ============================================================================
-- YENİ GÜN AKADEMİ | KURUMSAL VERİTABANI MİMARİSİ v9.0 (FINAL GOLD MASTER)
-- ============================================================================
-- Bu şema, Vercel Postgres / PostgreSQL uyumludur.
-- Tüm modüller (Aday, Personel, AI Lab, İletişim) için optimize edilmiştir.

-- 1. EKLENTİLER (UUID Desteği)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. OTOMATİK ZAMAN DAMGASI FONKSİYONU
-- Kayıt güncellendiğinde 'updated_at' sütununu otomatik yeniler.
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TEMİZLİK (DROP TABLES) - DİKKAT: VERİLERİ SİLER
-- Foreign Key bağımlılıkları nedeniyle sıralama önemlidir.
-- ============================================================================
DROP TABLE IF EXISTS communication_logs CASCADE;
DROP TABLE IF EXISTS staff_idp CASCADE;
DROP TABLE IF EXISTS staff_assessments CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;

-- ============================================================================
-- TABLO 1: CANDIDATES (ADAY HAVUZU)
-- Başvuru sürecinin kalbidir. AI raporları ve mülakat verileri burada tutulur.
-- ============================================================================
CREATE TABLE candidates (
    id TEXT PRIMARY KEY, -- UUID veya NanoID (Frontend'den gelir)
    
    -- KİŞİSEL BİLGİLER
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT,
    marital_status TEXT,
    
    -- AKADEMİK PROFİL
    branch TEXT NOT NULL, -- Branş (Özel Eğitim, PDR vb.)
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    previous_institutions TEXT,
    
    -- YETKİNLİK & VERİ
    all_trainings JSONB DEFAULT '[]'::jsonb, -- Sertifikalar Array
    answers JSONB DEFAULT '{}'::jsonb,       -- Başvuru Formu Cevapları (Key-Value)
    cv_data JSONB,                           -- Base64 CV Dosyası {mime, data, name}
    
    -- SÜREÇ YÖNETİMİ
    status TEXT DEFAULT 'pending', -- pending, interview_scheduled, hired, rejected, archived
    interview_schedule JSONB,      -- {date, time, location}
    
    -- AI & ANALİZ ÇIKTILARI (Heavy JSONB)
    report JSONB,       -- Gemini-3 Detaylı Analiz Raporu
    algo_report JSONB,  -- Matematiksel Skorlama Raporu
    
    -- YÖNETİM NOTLARI
    admin_notes TEXT,
    reminder_note TEXT,
    
    -- ARŞİVLEME
    archive_category TEXT, -- TALENT_POOL, DISQUALIFIED, BLACK_LIST vb.
    archive_note TEXT,
    
    -- ZAMAN DAMGALARI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexler (Hızlı Arama İçin)
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_branch ON candidates(branch);
CREATE INDEX idx_candidates_archive ON candidates(archive_category);

-- Trigger Bağlantısı
CREATE TRIGGER update_candidates_modtime
BEFORE UPDATE ON candidates
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();


-- ============================================================================
-- TABLO 2: STAFF (AKADEMİK KADRO)
-- İşe alınan adaylar veya doğrudan eklenen personeller.
-- ============================================================================
CREATE TABLE staff (
    id TEXT PRIMARY KEY, -- STF-XXXX formatında
    
    -- REFERANS
    origin_candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL, -- Aday havuzundan geldiyse bağla
    
    -- KİMLİK & GİRİŞ
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL, -- Basit hash veya düz metin (Mevcut kod yapısına uygun)
    role TEXT DEFAULT 'user',    -- 'admin', 'coordinator', 'user'
    
    -- PROFİL
    branch TEXT,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    
    -- DURUM
    onboarding_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active', -- active, on_leave, terminated
    
    -- ZAMAN DAMGALARI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexler
CREATE INDEX idx_staff_email ON staff(email);

-- Trigger Bağlantısı
CREATE TRIGGER update_staff_modtime
BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();


-- ============================================================================
-- TABLO 3: STAFF_ASSESSMENTS (MODÜLER SINAVLAR)
-- Personelin çözdüğü yetkinlik bataryaları (ABA, Etik, Veli Yönetimi vb.)
-- ============================================================================
CREATE TABLE staff_assessments (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    
    battery_id TEXT NOT NULL, -- Test ID'si (örn: 'aba_advanced')
    answers JSONB NOT NULL,   -- Verilen cevaplar {soru_id: cevap_degeri}
    score INTEGER NOT NULL,   -- 0-100 arası skor
    ai_tags JSONB DEFAULT '[]'::jsonb, -- AI tarafından atanan etiketler
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Aynı personel aynı testi birden fazla kez çözebilir mi? 
    -- Şimdilik hayır, son skoru tutmak için UNIQUE constraint ekliyoruz.
    UNIQUE(staff_id, battery_id)
);


-- ============================================================================
-- TABLO 4: STAFF_IDP (BİREYSEL GELİŞİM PLANI)
-- AI (ARMS) tarafından üretilen gelişim yol haritası ve sunumlar.
-- ============================================================================
CREATE TABLE staff_idp (
    id SERIAL PRIMARY KEY,
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    
    data JSONB NOT NULL, -- Full IDP Objesi: {focusArea, roadmap, autoGeneratedPresentation...}
    is_active BOOLEAN DEFAULT TRUE, -- Aktif planı işaretler
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================================
-- TABLO 5: COMMUNICATION_LOGS (İLETİŞİM MERKEZİ)
-- Gönderilen E-posta, SMS ve WhatsApp kayıtları.
-- ============================================================================
CREATE TABLE communication_logs (
    id SERIAL PRIMARY KEY,
    
    target_id TEXT,    -- Candidate ID veya Staff ID
    target_email TEXT,
    
    channel TEXT,      -- 'email', 'whatsapp', 'sms'
    subject TEXT,
    content_preview TEXT,
    
    status TEXT,       -- 'sent', 'failed', 'pending'
    error_message TEXT,
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================================
-- TABLO 6: SYSTEM_CONFIG (GLOBAL AYARLAR)
-- Tekil satır (Singleton) olarak çalışır. AI ayarları, renkler vb.
-- ============================================================================
CREATE TABLE system_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Sadece ID=1 olabilir
    data JSONB NOT NULL, -- {institutionName, aiWeights, colors...}
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SEED DATA (BAŞLANGIÇ VERİSİ)
-- İlk kurulumda sisteme erişebilmek için Admin kullanıcısı.
-- ============================================================================

INSERT INTO staff (id, name, email, phone, password_hash, role, branch, onboarding_complete)
VALUES (
    'STF-ADMIN', 
    'Sistem Yöneticisi', 
    'admin@yenigun.com', 
    '05550000000', 
    'admin123',  -- DİKKAT: Prodüksiyonda güçlü şifre kullanılmalı
    'admin', 
    'Yönetim', 
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Varsayılan Config
INSERT INTO system_config (id, data)
VALUES (1, '{
  "institutionName": "Yeni Gün Akademi",
  "primaryColor": "#ea580c",
  "aiTone": "balanced",
  "aiWeights": {"ethics": 40, "clinical": 30, "experience": 15, "fit": 15},
  "advancedAnalytics": {
      "weights": { "clinicalDepth": 30, "ethicalIntegrity": 30, "emotionalResilience": 15, "institutionalLoyalty": 15, "learningAgility": 10 },
      "penalties": { "criticalEthicalViolation": 30, "inconsistentAnswers": 15, "lowExperienceDiscount": 0.85 },
      "thresholds": { "minHiringScore": 70, "highPotentialCutoff": 85 },
      "aiCognition": { "skepticismLevel": 60, "innovationBias": 50, "stressTestIntensity": 70 }
  },
  "interviewSettings": { "defaultDuration": 45, "defaultMeetingLink": "https://meet.google.com/new" }
}'::jsonb) ON CONFLICT (id) DO NOTHING;

