
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('Authorization');

  // STRICT CACHE CONTROL HEADERS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  if (method === 'GET' || method === 'DELETE') {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), { status: 401, headers });
    }
  }

  try {
    if (method === 'GET') {
      const id = searchParams.get('id');

      // DETAY SORGUSU (Tekil Aday - Full Data)
      if (id) {
        const { rows } = await sql`SELECT * FROM candidates WHERE id = ${id}`;
        if (rows.length === 0) return new Response(JSON.stringify({ error: 'NOT_FOUND' }), { status: 404, headers });
        
        const candidate = rows[0];
        return new Response(JSON.stringify({
            ...candidate,
            timestamp: new Date(candidate.updated_at || candidate.created_at).getTime()
        }), { status: 200, headers });
      }

      // LISTE SORGUSU (Optimized - No BLOBs)
      const { rows } = await sql`
        SELECT 
          id, name, email, phone, age, gender, branch, university, department,
          experience_years, previous_institutions, status, archive_category,
          updated_at, created_at,
          (report->>'score')::int as score,
          (cv_data IS NOT NULL) as has_cv
        FROM candidates 
        ORDER BY updated_at DESC;
      `;

      const candidates = rows.map(row => ({
        id: row.id,
        name: row.name || 'İsimsiz',
        email: row.email || '',
        phone: row.phone || '',
        age: row.age || 0,
        branch: row.branch || '',
        experienceYears: row.experience_years || 0,
        status: row.status || 'pending',
        archiveCategory: row.archive_category,
        report: row.score ? { score: row.score } : null,
        hasCv: row.has_cv,
        timestamp: new Date(row.updated_at || row.created_at || Date.now()).getTime()
      }));
      
      return new Response(JSON.stringify(candidates), { status: 200, headers });
    }

    if (method === 'POST') {
      const body = await request.json();
      const now = new Date().toISOString();
      
      const allTrainings = JSON.stringify(body.allTrainings || []);
      const answers = JSON.stringify(body.answers || {});
      const report = body.report ? JSON.stringify(body.report) : null;
      const algoReport = body.algoReport ? JSON.stringify(body.algoReport) : null;
      const cvData = body.cvData ? JSON.stringify(body.cvData) : null;

      await sql`
        INSERT INTO candidates (
          id, name, email, phone, age, gender, branch, university, department,
          experience_years, previous_institutions, all_trainings, answers, 
          status, admin_notes, reminder_note, report, algo_report, cv_data, 
          archive_category, archive_note, updated_at
        ) VALUES (
          ${body.id}, ${body.name}, ${body.email}, ${body.phone}, ${body.age}, ${body.gender},
          ${body.branch}, ${body.university}, ${body.department}, ${body.experienceYears}, 
          ${body.previousInstitutions}, ${allTrainings}, ${answers}, ${body.status},
          ${body.adminNotes}, ${body.reminderNote}, ${report}, ${algoReport}, ${cvData}, 
          ${body.archiveCategory}, ${body.archiveNote}, ${now}
        ) ON CONFLICT (id) DO UPDATE SET 
          name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, age = EXCLUDED.age, 
          gender = EXCLUDED.gender, branch = EXCLUDED.branch, university = EXCLUDED.university, 
          department = EXCLUDED.department, experience_years = EXCLUDED.experience_years, 
          previous_institutions = EXCLUDED.previous_institutions, all_trainings = EXCLUDED.all_trainings, 
          answers = EXCLUDED.answers, status = EXCLUDED.status, admin_notes = EXCLUDED.admin_notes, 
          reminder_note = EXCLUDED.reminder_note, report = EXCLUDED.report, algo_report = EXCLUDED.algo_report, 
          cv_data = CASE WHEN EXCLUDED.cv_data IS NOT NULL THEN EXCLUDED.cv_data ELSE candidates.cv_data END, 
          archive_category = EXCLUDED.archive_category, 
          archive_note = EXCLUDED.archive_note, updated_at = EXCLUDED.updated_at;
      `;

      if (body.status === 'archived' && body.archiveCategory === 'HIRED_CONTRACTED') {
        const staffId = `STF-${body.id.toUpperCase().substring(0, 6)}`;
        const defaultPassword = 'yenigun2024';

        await sql`
          INSERT INTO staff (
            id, origin_candidate_id, name, email, phone, password_hash, role, branch, 
            university, department, experience_years, all_trainings, onboarding_complete, status, updated_at
          ) VALUES (
            ${staffId}, ${body.id}, ${body.name}, ${body.email}, ${body.phone}, ${defaultPassword}, 
            'user', ${body.branch}, ${body.university}, ${body.department}, ${body.experienceYears},
            ${allTrainings}, FALSE, 'active', ${now}
          )
          ON CONFLICT (email) DO UPDATE SET
            branch = EXCLUDED.branch,
            origin_candidate_id = EXCLUDED.origin_candidate_id,
            updated_at = EXCLUDED.updated_at;
        `;
      }

      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      if (id) {
        await sql`DELETE FROM candidates WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }
    }

    return new Response(JSON.stringify({ error: 'INVALID_METHOD' }), { status: 405, headers });
  } catch (error: any) {
    console.error("Candidate API Error:", error);
    return new Response(JSON.stringify({ error: 'DB_ERROR', message: error.message }), { status: 500, headers });
  }
}
