
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
      error: 'DB_ERROR', 
      message: 'Veritabanı yapılandırması (POSTGRES_URL) bulunamadı. Lütfen ortam değişkenlerini kontrol edin.' 
    }), { status: 500, headers });
  }

  try {
    // Tabloyu ve Gerekli Fonksiyonları Oluştur
    // Not: Edge runtime'da her zaman çalışması güvenlidir.
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
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
        university: row.university || '',
        department: row.department || '',
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
      
      const allTrainings = JSON.stringify(body.allTrainings || []);
      const answers = JSON.stringify(body.answers || {});
      const report = JSON.stringify(body.report || null);
      const algoReport = JSON.stringify(body.algoReport || null);
      const interviewSchedule = JSON.stringify(body.interviewSchedule || null);
      const cvData = JSON.stringify(body.cvData || null);

      await sql`
        INSERT INTO candidates (
          id, name, email, phone, age, gender, branch, university, department,
          experience_years, previous_institutions, all_trainings, answers, 
          status, admin_notes, report, algo_report, interview_schedule, cv_data, updated_at
        ) VALUES (
          ${body.id}, 
          ${body.name || 'İsimsiz'}, 
          ${body.email || ''}, 
          ${body.phone || ''}, 
          ${body.age || 22}, 
          ${body.gender || 'Belirtilmemiş'},
          ${body.branch || ''}, 
          ${body.university || ''},
          ${body.department || ''},
          ${body.experienceYears || 0}, 
          ${body.previousInstitutions || ''}, 
          ${allTrainings}, 
          ${answers}, 
          ${body.status || 'pending'},
          ${body.adminNotes || null},
          ${report},
          ${algoReport},
          ${interviewSchedule},
          ${cvData}, 
          ${now}
        ) ON CONFLICT (id) DO UPDATE SET 
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          branch = EXCLUDED.branch,
          university = EXCLUDED.university,
          department = EXCLUDED.department,
          experience_years = EXCLUDED.experience_years,
          previous_institutions = EXCLUDED.previous_institutions,
          all_trainings = EXCLUDED.all_trainings,
          answers = EXCLUDED.answers,
          status = EXCLUDED.status,
          admin_notes = EXCLUDED.admin_notes,
          report = EXCLUDED.report,
          algo_report = EXCLUDED.algo_report,
          interview_schedule = EXCLUDED.interview_schedule,
          cv_data = EXCLUDED.cv_data,
          updated_at = EXCLUDED.updated_at;
      `;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      if (id) {
        await sql`DELETE FROM candidates WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }
    }

    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), { status: 405, headers });
  } catch (error: any) {
    console.error("SQL_FATAL_ERROR:", error.message);
    return new Response(JSON.stringify({ 
      error: 'DB_EXECUTION_ERROR', 
      message: `Veritabanı hatası: ${error.message}. Lütfen SQL şemasının doğru yüklendiğinden emin olun.` 
    }), { status: 500, headers });
  }
}
