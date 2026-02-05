
import { sql } from '@vercel/postgres';

export const config = { runtime: 'edge' };

// YARDIMCI: Staff Tablosu Şema Kontrolü (Self-Healing)
async function ensureStaffSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      origin_candidate_id TEXT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'staff',
      branch TEXT,
      university TEXT,
      department TEXT,
      experience_years INTEGER DEFAULT 0,
      all_trainings JSONB DEFAULT '[]'::jsonb,
      onboarding_complete BOOLEAN DEFAULT FALSE,
      status TEXT DEFAULT 'active',
      report JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  // Eksik Kolon Migrasyonu
  await sql`
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='status') THEN
            ALTER TABLE staff ADD COLUMN status TEXT DEFAULT 'active';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='role') THEN
            ALTER TABLE staff ADD COLUMN role TEXT DEFAULT 'staff';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff' AND column_name='report') THEN
            ALTER TABLE staff ADD COLUMN report JSONB;
        END IF;
    END $$;
  `;
}

// YARDIMCI: IDP (Müfredat) Tablosu Şema Kontrolü
async function ensureIDPSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS staff_idp (
        id TEXT PRIMARY KEY,
        staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        focus_area TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  // Eksik Kolon Migrasyonu
  await sql`
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_idp' AND column_name='status') THEN
            ALTER TABLE staff_idp ADD COLUMN status TEXT DEFAULT 'active';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_idp' AND column_name='focus_area') THEN
            ALTER TABLE staff_idp ADD COLUMN focus_area TEXT;
        END IF;
    END $$;
  `;
}

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    // 1. LIST ALL STAFF
    if (method === 'GET' && action === 'list_all') {
      await ensureStaffSchema(); // Şema kontrolü
      const { rows } = await sql`
        SELECT 
            s.id, 
            s.name, 
            s.branch, 
            s.role, 
            s.email, 
            s.phone, 
            s.experience_years, 
            s.university,
            s.department,
            s.report,
            (SELECT ROUND(AVG(COALESCE(sa.score, 0))) FROM staff_assessments sa WHERE sa.staff_id = s.id) as last_score,
            (SELECT MAX(sa.timestamp) FROM staff_assessments sa WHERE sa.staff_id = s.id) as last_activity_date,
            (SELECT COUNT(*) FROM staff_idp idp WHERE idp.staff_id = s.id AND idp.status = 'active') as has_active_idp
        FROM staff s
        WHERE s.status = 'active'
        ORDER BY last_activity_date DESC NULLS LAST;
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    // 2. GET FULL STAFF DETAILS
    if (method === 'GET' && action === 'get_details') {
      const staffId = searchParams.get('staffId');
      await ensureIDPSchema(); // IDP tablosunu garantiye al
      
      const [profileRes, assessRes, idpRes] = await Promise.all([
          sql`SELECT * FROM staff WHERE id = ${staffId}`,
          sql`CREATE TABLE IF NOT EXISTS staff_assessments (id SERIAL PRIMARY KEY, staff_id TEXT, battery_id TEXT, answers JSONB, score INTEGER, ai_tags JSONB, timestamp TIMESTAMP DEFAULT NOW());`, // Assessments tablosu yoksa hata vermesin diye inline check
          sql`SELECT * FROM staff_idp WHERE staff_id = ${staffId} AND status = 'active' LIMIT 1`
      ]);

      // Assessment sorgusunu tabloyu oluşturduktan sonra yap
      const realAssessRes = await sql`SELECT * FROM staff_assessments WHERE staff_id = ${staffId} ORDER BY timestamp DESC`;

      const profile = profileRes.rows[0];
      const activeIDPRecord = idpRes.rows[0];
      
      let activeIDP = null;
      if (activeIDPRecord) {
          activeIDP = {
              id: activeIDPRecord.id,
              staffId: activeIDPRecord.staff_id,
              status: activeIDPRecord.status,
              createdAt: new Date(activeIDPRecord.created_at).getTime(),
              updatedAt: new Date(activeIDPRecord.updated_at).getTime(),
              ...activeIDPRecord.data
          };
      }
      
      return new Response(JSON.stringify({
        profile: profile,
        assessments: realAssessRes.rows,
        activeIDP: activeIDP
      }), { status: 200, headers });
    }

    // 3. ARCHIVE STAFF
    if (method === 'POST' && action === 'archive') {
      const staffId = searchParams.get('staffId');
      await sql`UPDATE staff SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ${staffId}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 3.1. BULK ARCHIVE
    if (method === 'POST' && action === 'bulk_archive') {
      const { ids } = await request.json();
      if (!Array.isArray(ids) || ids.length === 0) return new Response(JSON.stringify({ error: 'No IDs' }), { status: 400 });

      for (const id of ids) {
         await sql`UPDATE staff SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
      }
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 3.2. UPDATE PROFILE
    if (method === 'POST' && action === 'update_profile') {
        const { id, name, branch, experience_years, university, department } = await request.json();
        await ensureStaffSchema();
        
        await sql`
            UPDATE staff SET 
            name = ${name}, 
            branch = ${branch}, 
            experience_years = ${experience_years},
            university = ${university || null},
            department = ${department || null},
            onboarding_complete = TRUE,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 4. SAVE AI ANALYSIS
    if (method === 'POST' && action === 'save_analysis') {
      const { staffId, report } = await request.json();
      await ensureStaffSchema();
      await sql`UPDATE staff SET report = ${JSON.stringify(report)}, updated_at = CURRENT_TIMESTAMP WHERE id = ${staffId}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 5. LOGIN
    if (method === 'POST' && action === 'login') {
      const { email, password } = await request.json();
      await ensureStaffSchema(); // Tablo yoksa oluştur
      const { rows } = await sql`SELECT * FROM staff WHERE email = ${email} AND password_hash = ${password} AND status = 'active'`;
      
      if (rows.length > 0) {
        const staff = rows[0];
        // Assessments tablosunu da garantiye al
        await sql`CREATE TABLE IF NOT EXISTS staff_assessments (id SERIAL PRIMARY KEY, staff_id TEXT, battery_id TEXT, answers JSONB, score INTEGER, ai_tags JSONB, timestamp TIMESTAMP DEFAULT NOW());`;
        
        const { rows: completed } = await sql`SELECT battery_id FROM staff_assessments WHERE staff_id = ${staff.id}`;
        const completedBatteryIds = completed.map(c => c.battery_id);
        
        return new Response(JSON.stringify({ 
          success: true, 
          staff: { ...staff, completedBatteries: completedBatteryIds } 
        }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ success: false, message: 'Kimlik doğrulanamadı.' }), { status: 401, headers });
    }

    // 5.1 REGISTER (ADMIN)
    if (method === 'POST' && action === 'register') {
        const { name, email, branch, experience_years, role, password } = await request.json();
        
        await ensureStaffSchema(); // Kritik: Tablo yoksa oluşturur

        const newId = `STF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        try {
            await sql`
                INSERT INTO staff (id, name, email, password_hash, role, branch, experience_years, status)
                VALUES (${newId}, ${name}, ${email}, ${password}, ${role || 'staff'}, ${branch}, ${experience_years || 0}, 'active')
            `;
            return new Response(JSON.stringify({ success: true, id: newId }), { status: 201, headers });
        } catch (dbError: any) {
            if (dbError.code === '23505') {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: 'DUPLICATE_EMAIL', 
                    message: 'Bu e-posta adresi sistemde zaten kayıtlı.' 
                }), { status: 409, headers });
            }
            throw dbError; 
        }
    }

    // 6. SAVE ASSESSMENT
    if (method === 'POST' && action === 'save_assessment') {
      const { staffId, batteryId, answers, score, aiTags } = await request.json();
      
      // Tabloyu oluştur (Eğer yoksa)
      await sql`
        CREATE TABLE IF NOT EXISTS staff_assessments (
            id SERIAL PRIMARY KEY,
            staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
            battery_id TEXT NOT NULL,
            answers JSONB NOT NULL,
            score INTEGER NOT NULL,
            ai_tags JSONB DEFAULT '[]'::jsonb,
            timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(staff_id, battery_id)
        );
      `;

      await sql`
        INSERT INTO staff_assessments (staff_id, battery_id, answers, score, ai_tags, timestamp)
        VALUES (${staffId}, ${batteryId}, ${JSON.stringify(answers)}, ${score}, ${JSON.stringify(aiTags)}, CURRENT_TIMESTAMP)
        ON CONFLICT (staff_id, battery_id) DO UPDATE SET answers = EXCLUDED.answers, score = EXCLUDED.score, timestamp = CURRENT_TIMESTAMP;
      `;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    // 7. SAVE IDP (GÜNCELLENDİ: HATA KORUMALI)
    if (method === 'POST' && action === 'save_idp') {
      try {
          const { staffId, data } = await request.json();
          if(!staffId || !data) throw new Error("Eksik veri: staffId veya data yok.");

          // 1. Tablo ve Şema Güvenliği (Self-Healing)
          await ensureIDPSchema();

          const idpId = data.id || `IDP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
          const focusArea = data.focusArea || 'Genel Gelişim';

          // 2. Önceki aktif planları arşivle
          await sql`UPDATE staff_idp SET status = 'archived' WHERE staff_id = ${staffId} AND status = 'active' AND id != ${idpId}`;
          
          // 3. Yeni planı kaydet veya güncelle
          await sql`
            INSERT INTO staff_idp (id, staff_id, data, focus_area, status, updated_at)
            VALUES (${idpId}, ${staffId}, ${JSON.stringify(data)}, ${focusArea}, 'active', CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO UPDATE SET 
                data = EXCLUDED.data, 
                focus_area = EXCLUDED.focus_area,
                status = 'active',
                updated_at = CURRENT_TIMESTAMP
          `;
          
          return new Response(JSON.stringify({ success: true }), { status: 201, headers });
      } catch (error: any) {
          console.error("Save IDP Error:", error);
          return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers });
      }
    }

  } catch (error: any) {
    console.error("Staff API Global Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message || 'Veritabanı hatası' }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
