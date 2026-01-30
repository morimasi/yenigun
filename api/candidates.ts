
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

async function initializeDatabase() {
  try {
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
        experience_years INTEGER DEFAULT 0,
        previous_institutions TEXT,
        all_trainings JSONB DEFAULT '[]'::jsonb,
        answers JSONB DEFAULT '{}'::jsonb,
        status TEXT DEFAULT 'pending',
        report JSONB,
        algo_report JSONB,
        cv_data JSONB,
        archive_category TEXT,
        archive_note TEXT,
        reminder_note TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // Eksik kolonları her ihtimale karşı ekle (Self-healing)
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS reminder_note TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS report JSONB;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS algo_report JSONB;`;
  } catch (e) {
    console.error("DB Init Failure:", e);
  }
}

export default async function handler(request: Request) {
  const { method } = request;
  const { searchParams } = new URL(request.url);

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  await initializeDatabase();

  try {
    if (method === 'GET') {
      const { rows } = await sql`
        SELECT 
          id, name, branch, status, experience_years as "experienceYears",
          COALESCE(report, '{}'::jsonb) as report,
          updated_at
        FROM candidates 
        ORDER BY updated_at DESC;
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    if (method === 'POST') {
      const body = await request.json();
      const now = new Date().toISOString();
      
      // EMAIL tabanlı çakışma yönetimi (ID bazlı değil, çünkü ID her seferinde rastgele üretiliyor)
      await sql`
        INSERT INTO candidates (
          id, name, email, phone, age, gender, branch, university, department,
          experience_years, previous_institutions, all_trainings, answers, 
          status, report, algo_report, cv_data, archive_category, archive_note, updated_at
        ) VALUES (
          ${body.id}, 
          ${body.name}, 
          ${body.email}, 
          ${body.phone ?? null}, 
          ${body.age ?? null}, 
          ${body.gender ?? 'Belirtilmemiş'},
          ${body.branch}, 
          ${body.university ?? null}, 
          ${body.department ?? null}, 
          ${body.experienceYears ?? 0}, 
          ${body.previousInstitutions ?? null}, 
          ${JSON.stringify(body.allTrainings || [])}, 
          ${JSON.stringify(body.answers || {})},
          ${body.status || 'pending'}, 
          ${JSON.stringify(body.report || null)}, 
          ${JSON.stringify(body.algoReport || null)},
          ${JSON.stringify(body.cvData || null)}, 
          ${body.archiveCategory ?? null}, 
          ${body.archiveNote ?? null}, 
          ${now}
        ) 
        ON CONFLICT (email) DO UPDATE SET 
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          branch = EXCLUDED.branch,
          status = EXCLUDED.status, 
          report = COALESCE(EXCLUDED.report, candidates.report), 
          algo_report = COALESCE(EXCLUDED.algo_report, candidates.algo_report), 
          updated_at = EXCLUDED.updated_at,
          archive_category = EXCLUDED.archive_category, 
          archive_note = EXCLUDED.archive_note;
      `;

      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      await sql`DELETE FROM candidates WHERE id = ${id}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

  } catch (error: any) {
    console.error("Critical API 500:", error);
    return new Response(JSON.stringify({ error: 'DATABASE_WRITE_ERROR', details: error.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
