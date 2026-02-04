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
        FROM staff s 
        WHERE status = 'active'
        ORDER BY created_at DESC
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    // 2. GET FULL STAFF DETAILS
    if (method === 'GET' && action === 'get_details') {
      const staffId = searchParams.get('staffId');
      const { rows: profile } = await sql`SELECT * FROM staff WHERE id = ${staffId}`;
      const { rows: assessments } = await sql`SELECT * FROM staff_assessments WHERE staff_id = ${staffId} ORDER BY timestamp DESC`;
      const { rows: idp } = await sql`SELECT * FROM staff_idp WHERE staff_id = ${staffId} AND is_active = TRUE LIMIT 1`;
      
      return new Response(JSON.stringify({
        profile: profile[0],
        assessments: assessments,
        activeIDP: idp[0]
      }), { status: 200, headers });
    }

    // 3. ARCHIVE STAFF (SINGLE)
    if (method === 'POST' && action === 'archive') {
      const staffId = searchParams.get('staffId');
      await sql`UPDATE staff SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ${staffId}`;
      
      const { rows } = await sql`SELECT * FROM staff WHERE id = ${staffId}`;
      const s = rows[0];
      await sql`
        INSERT INTO candidates (id, name, email, branch, status, archive_category, archive_note, report)
        VALUES (${s.id}, ${s.name}, ${s.email}, ${s.branch}, 'archived', 'STAFF_HISTORY', 'Kurumsal kadrodan arşive mühürlendi.', ${JSON.stringify(s.report || {})})
        ON CONFLICT (email) DO UPDATE SET status = 'archived', archive_category = 'STAFF_HISTORY';
      `;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 3.1. BULK ARCHIVE (NEW)
    if (method === 'POST' && action === 'bulk_archive') {
      const { ids } = await request.json();
      if (!Array.isArray(ids) || ids.length === 0) return new Response(JSON.stringify({ error: 'No IDs provided' }), { status: 400 });

      // Transaction-like approach (Sequential for safety in Vercel Postgres)
      for (const id of ids) {
         await sql`UPDATE staff SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
         // Arşiv kopyası oluştur
         const { rows } = await sql`SELECT * FROM staff WHERE id = ${id}`;
         if (rows.length > 0) {
             const s = rows[0];
             await sql`
                INSERT INTO candidates (id, name, email, branch, status, archive_category, archive_note, report)
                VALUES (${s.id}, ${s.name}, ${s.email}, ${s.branch}, 'archived', 'STAFF_HISTORY', 'Toplu işlem ile arşive mühürlendi.', ${JSON.stringify(s.report || {})})
                ON CONFLICT (email) DO UPDATE SET status = 'archived', archive_category = 'STAFF_HISTORY';
             `;
         }
      }
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 3.2. UPDATE PROFILE (NEW)
    if (method === 'POST' && action === 'update_profile') {
        const { id, name, email, branch, experience_years } = await request.json();
        await sql`
            UPDATE staff SET 
            name = ${name}, 
            email = ${email}, 
            branch = ${branch}, 
            experience_years = ${experience_years},
            updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 4. SAVE AI ANALYSIS (REPORT)
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

    // 5. STAFF AUTH (LOGIN) & REGISTER
    if (method === 'POST' && action === 'login') {
      const { email, password } = await request.json();
      const { rows } = await sql`SELECT * FROM staff WHERE email = ${email} AND password_hash = ${password} AND status = 'active'`;
      
      if (rows.length > 0) {
        const staff = rows[0];
        const { rows: completed } = await sql`SELECT battery_id FROM staff_assessments WHERE staff_id = ${staff.id}`;
        const completedBatteryIds = completed.map(c => c.battery_id);
        
        return new Response(JSON.stringify({ 
          success: true, 
          staff: { ...staff, completedBatteries: completedBatteryIds } 
        }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ success: false, message: 'Kimlik doğrulanamadı.' }), { status: 401, headers });
    }

    if (method === 'POST' && action === 'register') {
        const { name, email, branch, experience_years, role, password } = await request.json();
        const newId = `STF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        await sql`
            INSERT INTO staff (id, name, email, password_hash, role, branch, experience_years, status)
            VALUES (${newId}, ${name}, ${email}, ${password}, ${role || 'staff'}, ${branch}, ${experience_years || 0}, 'active')
            ON CONFLICT (email) DO NOTHING
        `;
        return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    // 6. SAVE ASSESSMENT
    if (method === 'POST' && action === 'save_assessment') {
      const { staffId, batteryId, answers, score, aiTags } = await request.json();
      await sql`
        INSERT INTO staff_assessments (staff_id, battery_id, answers, score, ai_tags, timestamp)
        VALUES (${staffId}, ${batteryId}, ${JSON.stringify(answers)}, ${score}, ${JSON.stringify(aiTags)}, CURRENT_TIMESTAMP)
        ON CONFLICT (staff_id, battery_id) DO UPDATE SET answers = EXCLUDED.answers, score = EXCLUDED.score, timestamp = CURRENT_TIMESTAMP;
      `;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    // 7. SAVE IDP
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