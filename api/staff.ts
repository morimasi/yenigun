
import { sql } from '@vercel/postgres';

export const config = { runtime: 'edge' };

// Şema Tahkimatı: staff_idp tablosunu ve sütunlarını garanti altına alır
async function ensureIDPSchema() {
  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS staff_idp (
        id TEXT PRIMARY KEY,
        staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        focus_area TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Eksik sütun kontrolü (Migration bypass)
    await sql.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_idp' AND column_name='focus_area') THEN
          ALTER TABLE staff_idp ADD COLUMN focus_area TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_idp' AND column_name='status') THEN
          ALTER TABLE staff_idp ADD COLUMN status TEXT DEFAULT 'active';
        END IF;
      END $$;
    `);
  } catch (e) {
    console.error("MIA IDP Schema Repair Error:", e);
  }
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
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    // 1. LIST ALL STAFF
    if (method === 'GET' && action === 'list_all') {
      const { rows } = await sql`
        SELECT s.*, 
          (SELECT ROUND(AVG(score)) FROM staff_assessments WHERE staff_id = s.id) as last_score
        FROM staff s WHERE s.status = 'active' ORDER BY s.name ASC
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    // 2. GET FULL STAFF DETAILS
    if (method === 'GET' && action === 'get_details') {
      const staffId = searchParams.get('staffId');
      const profile = await sql`SELECT * FROM staff WHERE id = ${staffId}`;
      const assessments = await sql`SELECT * FROM staff_assessments WHERE staff_id = ${staffId} ORDER BY timestamp DESC`;
      const idp = await sql`SELECT * FROM staff_idp WHERE staff_id = ${staffId} AND status = 'active' LIMIT 1`;

      return new Response(JSON.stringify({
        profile: profile.rows[0],
        assessments: assessments.rows,
        activeIDP: idp.rows[0] ? { ...idp.rows[0].data, id: idp.rows[0].id } : null
      }), { status: 200, headers });
    }

    // 3. REGISTER STAFF
    if (method === 'POST' && action === 'register') {
      const body = await request.json();
      const id = `STF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      await sql`
        INSERT INTO staff (id, name, email, password_hash, role, branch, experience_years)
        VALUES (${id}, ${body.name}, ${body.email}, ${body.password}, ${body.role}, ${body.branch}, ${body.experience_years})
      `;
      return new Response(JSON.stringify({ success: true, id }), { status: 201, headers });
    }

    // 4. SAVE IDP (KRİTİK ONARIM)
    if (method === 'POST' && action === 'save_idp') {
      await ensureIDPSchema();
      const { staffId, data } = await request.json();
      
      if (!staffId || !data) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
      }

      const idpId = data.id || `IDP-${Date.now()}`;
      const focusArea = data.focusArea || 'Genel Gelişim';

      // Eski aktif planları arşivle
      await sql`UPDATE staff_idp SET status = 'archived' WHERE staff_id = ${staffId} AND status = 'active'`;

      // Yeni planı mühürle
      await sql`
        INSERT INTO staff_idp (id, staff_id, data, focus_area, status, updated_at)
        VALUES (${idpId}, ${staffId}, ${JSON.stringify(data)}, ${focusArea}, 'active', CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET 
          data = EXCLUDED.data, 
          focus_area = EXCLUDED.focus_area,
          status = 'active',
          updated_at = CURRENT_TIMESTAMP;
      `;
      
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    // 5. UPDATE PROFILE
    if (method === 'POST' && action === 'update_profile') {
      const body = await request.json();
      await sql`
        UPDATE staff SET 
          name = ${body.name}, 
          branch = ${body.branch}, 
          university = ${body.university}, 
          department = ${body.department},
          experience_years = ${body.experienceYears},
          onboarding_complete = TRUE
        WHERE id = ${body.id}
      `;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 6. SAVE ANALYSIS
    if (method === 'POST' && action === 'save_analysis') {
      const { staffId, report } = await request.json();
      await sql`UPDATE staff SET report = ${JSON.stringify(report)} WHERE id = ${staffId}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 7. LOGIN
    if (method === 'POST' && action === 'login') {
      const { email, password } = await request.json();
      const { rows } = await sql`SELECT * FROM staff WHERE email = ${email} AND password_hash = ${password} AND status = 'active'`;
      if (rows.length > 0) {
        return new Response(JSON.stringify({ success: true, staff: rows[0] }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ success: false, message: 'Geçersiz kimlik bilgileri' }), { status: 401, headers });
    }

  } catch (e: any) {
    console.error("MIA Staff API Critical Failure:", e);
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
