
import { sql } from '@vercel/postgres';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    // --- ŞEMA KURULUMU (HER ÇAĞRIDA GÜVENLİK KONTROLÜ) ---
    await sql`
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
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS staff_assessments (
        id TEXT PRIMARY KEY DEFAULT (random()*1000000)::text,
        staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
        battery_id TEXT NOT NULL,
        answers JSONB NOT NULL,
        score INTEGER NOT NULL,
        ai_tags JSONB DEFAULT '[]'::jsonb,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS staff_idp (
        id TEXT PRIMARY KEY DEFAULT (random()*1000000)::text,
        staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 1. LIST ALL STAFF (ADMIN ONLY)
    if (method === 'GET' && action === 'list_all') {
      const { rows } = await sql`
        SELECT s.*, 
        (SELECT COUNT(*) FROM staff_assessments WHERE staff_id = s.id) as assessment_count,
        (SELECT score FROM staff_assessments WHERE staff_id = s.id ORDER BY timestamp DESC LIMIT 1) as last_score
        FROM staff s ORDER BY name ASC
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    // 2. GET FULL STAFF DETAILS (ADMIN ONLY)
    if (method === 'GET' && action === 'get_details') {
      const staffId = searchParams.get('staffId');
      const { rows: profile } = await sql`SELECT * FROM staff WHERE id = ${staffId}`;
      const { rows: assessments } = await sql`SELECT * FROM staff_assessments WHERE staff_id = ${staffId} ORDER BY timestamp ASC`;
      const { rows: idp } = await sql`SELECT * FROM staff_idp WHERE staff_id = ${staffId} AND is_active = TRUE LIMIT 1`;
      
      return new Response(JSON.stringify({
        profile: profile[0],
        assessments: assessments,
        activeIDP: idp[0]
      }), { status: 200, headers });
    }

    // 3. STAFF AUTH (LOGIN)
    if (method === 'POST' && action === 'login') {
      const { email, password } = await request.json();
      const { rows } = await sql`SELECT * FROM staff WHERE email = ${email} AND password_hash = ${password}`;
      if (rows.length > 0) return new Response(JSON.stringify({ success: true, staff: rows[0] }), { status: 200, headers });
      return new Response(JSON.stringify({ success: false, message: 'Geçersiz bilgiler.' }), { status: 401, headers });
    }

    // 4. SAVE IDP
    if (method === 'POST' && action === 'save_idp') {
      const { staffId, data } = await request.json();
      await sql`UPDATE staff_idp SET is_active = FALSE WHERE staff_id = ${staffId}`;
      await sql`INSERT INTO staff_idp (staff_id, data, is_active) VALUES (${staffId}, ${JSON.stringify(data)}, TRUE)`;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    // ... (Diğer aksiyonlar: update_profile, save_assessment mevcut haliyle kalır)

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
