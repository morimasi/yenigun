
-- ... (Mevcut tabloların devamına ekle)

-- 9. PERSONEL (KADROLU ÖĞRETMENLER)
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    branch TEXT NOT NULL,
    university TEXT,
    department TEXT,
    experience_years INTEGER DEFAULT 0,
    all_trainings JSONB DEFAULT '[]'::jsonb,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. PERSONEL DEĞERLENDİRME SONUÇLARI (PERİYODİK ANALİZ)
CREATE TABLE IF NOT EXISTS staff_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    battery_id TEXT NOT NULL, -- assessmentData içindeki modül ID'si
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    ai_tags JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. PERSONEL IDP (BİREYSEL GELİŞİM PLANLARI)
CREATE TABLE IF NOT EXISTS staff_idp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
    data JSONB NOT NULL, -- Roadmap, Gaps, Trainings vb.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İNDEKSLER
CREATE INDEX IF NOT EXISTS idx_staff_branch ON staff(branch);
CREATE INDEX IF NOT EXISTS idx_staff_assessments_staff_id ON staff_assessments(staff_id);
