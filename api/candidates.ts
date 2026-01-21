import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store, max-age=0'
  };

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (!process.env.POSTGRES_URL) {
    return new Response(JSON.stringify({ error: 'DB_ERROR', message: 'DB URL Eksik' }), { status: 500, headers });
  }

  try {
    // Tablo ve Kolon Kontrolleri
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        age INTEGER,
        gender TEXT,
        branch TEXT,
        experience_years INTEGER,
        previous_institutions TEXT,
        all_trainings JSONB DEFAULT '[]'::jsonb,
        answers JSONB DEFAULT '{}'::jsonb,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        report JSONB,
        algo_report JSONB,
        interview_schedule JSONB,
        cv_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (method === 'GET') {
      const { rows } = await sql`SELECT * FROM candidates ORDER BY updated_at DESC;`;
      const candidates = rows.map(row => ({
        id: row.id,
        name: row.name || 'İsimsiz',
        email: row.email || '',
        phone: row.phone || '',
        age: row.age || 0,
        gender: row.gender || 'Belirtilmemiş',
        branch: row.branch || '',
        experienceYears: row.experience_years || 0,
        previousInstitutions: row.previous_institutions || '',
        allTrainings: row.all_trainings || [],
        answers: row.answers || {},
        status: row.status || 'pending',
        adminNotes: row.admin_notes || '',
        interviewSchedule: row.interview_schedule || null,
        report: row.report || null,
        algoReport: row.algo_report || null,
        cvData: row.cv_data || null,
        timestamp: new Date(row.updated_at || row.created_at || Date.now()).getTime()
      }));
      return new Response(JSON.stringify(candidates), { status: 200, headers });
    }

    if (method === 'POST') {
      const body = await request.json();
      const now = new Date().toISOString();
      await sql`
        INSERT INTO candidates (
          id, name, email, phone, age, gender, branch, experience_years, 
          previous_institutions, all_trainings, answers, status, cv_data, updated_at
        ) VALUES (
          ${body.id}, ${body.name}, ${body.email}, ${body.phone}, ${body.age}, ${body.gender},
          ${body.branch}, ${body.experienceYears}, ${body.previousInstitutions}, 
          ${JSON.stringify(body.allTrainings || [])}, ${JSON.stringify(body.answers || {})}, ${body.status},
          ${JSON.stringify(body.cvData || null)}, ${now}
        ) ON CONFLICT (id) DO UPDATE SET 
          name = EXCLUDED.name, email = EXCLUDED.email, updated_at = ${now};
      `;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    if (method === 'PATCH') {
      const body = await request.json();
      const now = new Date().toISOString();
      await sql`
        UPDATE candidates SET 
          status = ${body.status},
          admin_notes = ${body.adminNotes || null},
          report = ${body.report ? JSON.stringify(body.report) : null},
          algo_report = ${body.algoReport ? JSON.stringify(body.algoReport) : null},
          interview_schedule = ${body.interviewSchedule ? JSON.stringify(body.interviewSchedule) : null},
          cv_data = ${body.cvData ? JSON.stringify(body.cvData) : null},
          updated_at = ${now}
        WHERE id = ${body.id}
      `;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      if (id) {
        await sql`DELETE FROM candidates WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }
    }

    return new Response(JSON.stringify({ error: 'M_NOT_A' }), { status: 405, headers });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'DB_ERROR', message: error.message }), { status: 500, headers });
  }
}