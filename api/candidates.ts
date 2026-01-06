
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
    return new Response(JSON.stringify({ error: 'DATABASE_NOT_CONFIGURED' }), { status: 200, headers });
  }

  try {
    // Şema güncellemesi: cv_data eklendi
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        age INTEGER,
        branch TEXT,
        experience_years INTEGER,
        previous_institutions TEXT,
        all_trainings TEXT,
        answers JSONB,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        interview_schedule JSONB,
        report JSONB,
        cv_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `.catch(e => console.warn('Schema check warning:', e.message));

    if (method === 'GET') {
      const { rows } = await sql`SELECT * FROM candidates ORDER BY created_at DESC;`;
      const candidates = rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        age: row.age,
        branch: row.branch,
        experienceYears: row.experience_years,
        previousInstitutions: row.previous_institutions,
        allTrainings: row.all_trainings,
        answers: row.answers,
        status: row.status,
        adminNotes: row.admin_notes,
        interviewSchedule: row.interview_schedule,
        report: row.report,
        cvData: row.cv_data,
        timestamp: new Date(row.created_at).getTime()
      }));
      return new Response(JSON.stringify(candidates), { status: 200, headers });
    }

    if (method === 'POST') {
      const body = await request.json();
      await sql`
        INSERT INTO candidates (id, name, email, phone, age, branch, experience_years, previous_institutions, all_trainings, answers, status, cv_data)
        VALUES (
          ${body.id}, ${body.name}, ${body.email}, ${body.phone}, ${body.age}, 
          ${body.branch}, ${body.experienceYears}, ${body.previousInstitutions}, 
          ${body.allTrainings}, ${JSON.stringify(body.answers)}, ${body.status},
          ${JSON.stringify(body.cvData || null)}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          status = EXCLUDED.status,
          cv_data = EXCLUDED.cv_data;
      `;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    if (method === 'PATCH') {
      const body = await request.json();
      if (body.report) {
        await sql`UPDATE candidates SET report = ${JSON.stringify(body.report)}, status = ${body.status} WHERE id = ${body.id}`;
      } else if (body.interviewSchedule) {
        await sql`UPDATE candidates SET interview_schedule = ${JSON.stringify(body.interviewSchedule)}, status = ${body.status} WHERE id = ${body.id}`;
      } else {
        await sql`UPDATE candidates SET status = ${body.status}, admin_notes = ${body.adminNotes || null} WHERE id = ${body.id}`;
      }
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      await sql`DELETE FROM candidates WHERE id = ${id}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), { status: 405, headers });

  } catch (error: any) {
    console.error('Database Operation Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}
