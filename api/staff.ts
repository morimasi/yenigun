
import { sql } from '@vercel/postgres';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    // --- OTOMATİK ŞEMA KURULUMU (SELF-HEALING) ---
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

    // 1. STAFF AUTH (LOGIN)
    if (method === 'POST' && searchParams.get('action') === 'login') {
      const { email, password } = await request.json();
      const { rows } = await sql`SELECT * FROM staff WHERE email = ${email} AND password_hash = ${password}`;
      
      if (rows.length > 0) {
        return new Response(JSON.stringify({ success: true, staff: rows[0] }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ success: false, message: 'Geçersiz sicil bilgileri.' }), { status: 401, headers });
    }

    // 2. SAVE/UPDATE PROFILE
    if (method === 'POST' && searchParams.get('action') === 'update_profile') {
      const data = await request.json();
      await sql`
        UPDATE staff SET 
          name = ${data.name}, branch = ${data.branch}, university = ${data.university}, 
          department = ${data.department}, experience_years = ${data.experienceYears}, 
          all_trainings = ${JSON.stringify(data.allTrainings)}, 
          onboarding_complete = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${data.id}
      `;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 3. SAVE ASSESSMENT RESULT
    if (method === 'POST' && searchParams.get('action') === 'save_assessment') {
      const { staffId, batteryId, answers, score, aiTags } = await request.json();
      await sql`
        INSERT INTO staff_assessments (staff_id, battery_id, answers, score, ai_tags)
        VALUES (${staffId}, ${batteryId}, ${JSON.stringify(answers)}, ${score}, ${JSON.stringify(aiTags)})
      `;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    // 4. GET STAFF DATA
    if (method === 'GET') {
      const staffId = searchParams.get('staffId');
      const { rows: staffRows } = await sql`SELECT * FROM staff WHERE id = ${staffId}`;
      const { rows: assessments } = await sql`SELECT * FROM staff_assessments WHERE staff_id = ${staffId} ORDER BY timestamp DESC`;
      
      return new Response(JSON.stringify({ 
        profile: staffRows[0], 
        assessments: assessments 
      }), { status: 200, headers });
    }

  } catch (error: any) {
    console.error("Staff API Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
