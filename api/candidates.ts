
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
    return new Response(JSON.stringify({ 
      error: 'DATABASE_NOT_CONFIGURED',
      message: 'POSTGRES_URL bulunamadı.'
    }), { status: 500, headers });
  }

  try {
    // Şema Güncelleme: algo_report ve diğer eksik alanları zorunlu olarak ekle
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        age INTEGER,
        gender TEXT,
        branch TEXT,
        experience_years INTEGER,
        previous_institutions TEXT,
        all_trainings TEXT,
        answers JSONB,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        interview_schedule JSONB,
        report JSONB,
        algo_report JSONB,
        cv_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `.catch(e => console.error('Schema Sync Error:', e.message));

    // Eksik sütunlar için tekil migrationlar
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS algo_report JSONB;`.catch(() => {});
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender TEXT;`.catch(() => {});
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`.catch(() => {});

    if (method === 'GET') {
      const { rows } = await sql`SELECT * FROM candidates ORDER BY updated_at DESC LIMIT 500;`;
      const candidates = rows.map(row => ({
        id: row.id,
        name: row.name || 'İsimsiz Aday',
        email: row.email || '',
        phone: row.phone || '',
        age: row.age || 0,
        gender: row.gender || 'Belirtilmemiş',
        branch: row.branch || '',
        experienceYears: row.experience_years || 0,
        previousInstitutions: row.previous_institutions || '',
        allTrainings: row.all_trainings || '',
        answers: row.answers || {},
        status: row.status || 'pending',
        adminNotes: row.admin_notes || '',
        interviewSchedule: row.interview_schedule || null,
        report: row.report || null,
        algoReport: row.algo_report || null,
        cvData: row.cv_data || null,
        timestamp: new Date(row.updated_at || row.created_at).getTime()
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
        )
        VALUES (
          ${body.id}, ${body.name}, ${body.email}, ${body.phone}, ${body.age}, ${body.gender},
          ${body.branch}, ${body.experienceYears}, ${body.previousInstitutions}, 
          ${body.allTrainings}, ${JSON.stringify(body.answers)}, ${body.status},
          ${JSON.stringify(body.cvData || null)}, ${now}
        )
      `;
      return new Response(JSON.stringify({ success: true, timestamp: new Date(now).getTime() }), { status: 201, headers });
    }

    if (method === 'PATCH') {
      const body = await request.json();
      const now = new Date().toISOString();
      
      if (body.report) {
        await sql`
          UPDATE candidates SET 
            report = ${JSON.stringify(body.report)}, 
            algo_report = ${JSON.stringify(body.algoReport || null)}, 
            status = ${body.status}, 
            updated_at = ${now} 
          WHERE id = ${body.id}
        `;
      } else if (body.interviewSchedule) {
        await sql`UPDATE candidates SET interview_schedule = ${JSON.stringify(body.interviewSchedule)}, status = ${body.status}, updated_at = ${now} WHERE id = ${body.id}`;
      } else {
        await sql`UPDATE candidates SET status = ${body.status}, admin_notes = ${body.adminNotes || null}, updated_at = ${now} WHERE id = ${body.id}`;
      }
      return new Response(JSON.stringify({ success: true, timestamp: new Date(now).getTime() }), { status: 200, headers });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      if (id) {
        await sql`DELETE FROM candidates WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ error: 'MISSING_ID' }), { status: 400, headers });
    }

    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), { status: 405, headers });

  } catch (error: any) {
    console.error('Kritik DB Hatası:', error.message);
    return new Response(JSON.stringify({ 
      error: 'DATABASE_ERROR', 
      message: error.message 
    }), { status: 500, headers });
  }
}
