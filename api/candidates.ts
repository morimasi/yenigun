
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

async function initializeDatabase() {
  try {
    // Ana tablo ve kolonların varlığını garanti et
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        age INTEGER,
        gender TEXT,
        branch TEXT,
        university TEXT,
        department TEXT,
        experience_years INTEGER,
        previous_institutions TEXT,
        all_trainings JSONB DEFAULT '[]'::jsonb,
        answers JSONB DEFAULT '{}'::jsonb,
        status TEXT DEFAULT 'pending',
        report JSONB,
        algo_report JSONB,
        interview_schedule JSONB,
        cv_data JSONB,
        admin_notes TEXT,
        reminder_note TEXT,
        archive_category TEXT,
        archive_note TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // Gerekli kolonların sonradan eklenmesi (Migration)
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS archive_category TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS archive_note TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS report JSONB;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS algo_report JSONB;`;
  } catch (e) {
    console.error("DB Init Error:", e);
  }
}

export default async function handler(request: Request) {
  const { method } = request;
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('Authorization');

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  // Her istekte tabloyu kontrol et (Cold start koruması)
  await initializeDatabase();

  try {
    if (method === 'GET') {
      const id = searchParams.get('id');

      if (id) {
        const { rows } = await sql`SELECT * FROM candidates WHERE id = ${id}`;
        if (rows.length === 0) return new Response(JSON.stringify({ error: 'NOT_FOUND' }), { status: 404, headers });
        return new Response(JSON.stringify(rows[0]), { status: 200, headers });
      }

      // Liste sorgusunda NULL değerlere karşı COALESCE kullan
      const { rows } = await sql`
        SELECT 
          id, name, branch, status, experience_years as "experienceYears",
          COALESCE(report, '{}'::jsonb) as report,
          updated_at
        FROM candidates 
        ORDER BY updated_at DESC;
      `;
      
      const sanitizedRows = rows.map(r => ({
        ...r,
        timestamp: new Date(r.updated_at).getTime(),
        report: r.report && r.report.score ? { score: r.report.score } : null
      }));

      return new Response(JSON.stringify(sanitizedRows), { status: 200, headers });
    }

    if (method === 'POST') {
      const body = await request.json();
      const now = new Date().toISOString();
      
      await sql`
        INSERT INTO candidates (
          id, name, email, phone, age, gender, branch, university, department,
          experience_years, previous_institutions, all_trainings, answers, 
          status, report, algo_report, cv_data, archive_category, archive_note, updated_at
        ) VALUES (
          ${body.id}, ${body.name}, ${body.email}, ${body.phone}, ${body.age}, ${body.gender},
          ${body.branch}, ${body.university}, ${body.department}, ${body.experienceYears}, 
          ${body.previousInstitutions}, ${JSON.stringify(body.allTrainings || [])}, ${JSON.stringify(body.answers || {})},
          ${body.status}, ${JSON.stringify(body.report || null)}, ${JSON.stringify(body.algoReport || null)},
          ${JSON.stringify(body.cvData || null)}, ${body.archiveCategory}, ${body.archiveNote}, ${now}
        ) ON CONFLICT (id) DO UPDATE SET 
          status = EXCLUDED.status, report = EXCLUDED.report, 
          algo_report = EXCLUDED.algo_report, updated_at = EXCLUDED.updated_at,
          archive_category = EXCLUDED.archive_category, archive_note = EXCLUDED.archive_note;
      `;

      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      await sql`DELETE FROM candidates WHERE id = ${id}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

  } catch (error: any) {
    console.error("API 500 Error:", error);
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: error.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
