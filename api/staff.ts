
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
    // 1. LIST ALL STAFF (ADMIN ONLY)
    if (method === 'GET' && action === 'list_all') {
      const { rows } = await sql`
        SELECT s.*, 
        (SELECT COUNT(*) FROM staff_assessments WHERE staff_id = s.id) as assessment_count,
        (SELECT score FROM staff_assessments WHERE staff_id = s.id ORDER BY timestamp DESC LIMIT 1) as last_score
        FROM staff s ORDER BY created_at DESC
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    // 2. GET FULL STAFF DETAILS
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

    // 3. SAVE AI ANALYSIS (REPORT) - NEW ACTION
    if (method === 'POST' && action === 'save_analysis') {
      const { staffId, report } = await request.json();
      await sql`
        UPDATE staff SET 
        report = ${JSON.stringify(report)},
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ${staffId}
      `;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 4. STAFF AUTH (LOGIN)
    if (method === 'POST' && action === 'login') {
      const { email, password } = await request.json();
      const { rows } = await sql`SELECT * FROM staff WHERE email = ${email} AND password_hash = ${password}`;
      
      if (rows.length > 0) {
        const staff = rows[0];
        const { rows: completed } = await sql`SELECT battery_id FROM staff_assessments WHERE staff_id = ${staff.id}`;
        const completedBatteryIds = completed.map(c => c.battery_id);
        
        return new Response(JSON.stringify({ 
          success: true, 
          staff: { ...staff, completedBatteries: completedBatteryIds } 
        }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ success: false, message: 'Geçersiz bilgiler.' }), { status: 401, headers });
    }

    // 5. STAFF REGISTRATION
    if (method === 'POST' && action === 'register') {
      const body = await request.json();
      const staffId = `STF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const now = new Date().toISOString();
      try {
        await sql`
          INSERT INTO staff (id, name, email, password_hash, branch, university, department, experience_years, all_trainings, onboarding_complete, status, created_at, updated_at)
          VALUES (${staffId}, ${body.name}, ${body.email}, ${body.password}, ${body.branch}, ${body.university}, ${body.department}, ${body.experienceYears}, ${JSON.stringify(body.allTrainings || [])}, FALSE, 'active', ${now}, ${now})
        `;
        return new Response(JSON.stringify({ success: true, staffId }), { status: 201, headers });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, message: 'Kayıt hatası.' }), { status: 500, headers });
      }
    }

    // 6. SAVE ASSESSMENT
    if (method === 'POST' && action === 'save_assessment') {
      const { staffId, batteryId, answers, score, aiTags } = await request.json();
      await sql`
        INSERT INTO staff_assessments (staff_id, battery_id, answers, score, ai_tags, timestamp)
        VALUES (${staffId}, ${batteryId}, ${JSON.stringify(answers)}, ${score}, ${JSON.stringify(aiTags)}, CURRENT_TIMESTAMP)
      `;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    // 7. UPDATE PROFILE
    if (method === 'POST' && action === 'update_profile') {
        const body = await request.json();
        await sql`
            UPDATE staff SET 
            name = ${body.name}, branch = ${body.branch}, university = ${body.university}, 
            department = ${body.department}, experience_years = ${body.experienceYears},
            all_trainings = ${JSON.stringify(body.allTrainings)}, onboarding_complete = TRUE, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${body.id}
        `;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 8. SAVE IDP
    if (method === 'POST' && action === 'save_idp') {
      const { staffId, data } = await request.json();
      await sql`UPDATE staff_idp SET is_active = FALSE WHERE staff_id = ${staffId}`;
      await sql`INSERT INTO staff_idp (staff_id, data, is_active) VALUES (${staffId}, ${JSON.stringify(data)}, TRUE)`;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
