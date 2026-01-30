
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

async function initializeDatabase() {
  try {
    // 1. Ana tabloyu oluştur (Eğer yoksa)
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        age INTEGER,
        gender TEXT,
        marital_status TEXT,
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
        interview_schedule JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // 2. Eksik sütunları tek tek ve güvenli bir şekilde ekle (Self-healing)
    // Sütun ekleme işlemlerini tekil sorgular olarak gönderiyoruz
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS phone TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS age INTEGER;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS marital_status TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS university TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS department TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS previous_institutions TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS all_trainings JSONB DEFAULT '[]'::jsonb;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS report JSONB;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS algo_report JSONB;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS cv_data JSONB;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS archive_category TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS archive_note TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS reminder_note TEXT;`;
    await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS interview_schedule JSONB;`;

  } catch (e) {
    console.error("Critical: Database Schema Sync Failure", e);
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

  // Her istekte şemayı doğrula (Gerekliyse)
  await initializeDatabase();

  try {
    if (method === 'GET') {
      const { rows } = await sql`
        SELECT 
          id, name, email, phone, age, gender, marital_status as "maritalStatus",
          branch, university, department, experience_years as "experienceYears",
          previous_institutions as "previousInstitutions", all_trainings as "allTrainings",
          answers, status, report, algo_report as "algoReport", cv_data as "cvData",
          archive_category as "archiveCategory", archive_note as "archiveNote",
          interview_schedule as "interviewSchedule", updated_at as "timestamp"
        FROM candidates 
        ORDER BY updated_at DESC;
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    if (method === 'POST') {
      const body = await request.json();
      const now = new Date().toISOString();
      
      // Veritabanı mühürleme işlemi
      await sql`
        INSERT INTO candidates (
          id, name, email, phone, age, gender, marital_status, branch, university, department,
          experience_years, previous_institutions, all_trainings, answers, 
          status, report, algo_report, cv_data, archive_category, archive_note, 
          interview_schedule, updated_at
        ) VALUES (
          ${body.id}, 
          ${body.name}, 
          ${body.email}, 
          ${body.phone || null}, 
          ${body.age || null}, 
          ${body.gender || 'Belirtilmemiş'}, 
          ${body.maritalStatus || 'Bekar'},
          ${body.branch}, 
          ${body.university || null}, 
          ${body.department || null}, 
          ${body.experienceYears || 0}, 
          ${body.previousInstitutions || null}, 
          ${JSON.stringify(body.allTrainings || [])}, 
          ${JSON.stringify(body.answers || {})},
          ${body.status || 'pending'}, 
          ${JSON.stringify(body.report || null)}, 
          ${JSON.stringify(body.algoReport || null)}, 
          ${JSON.stringify(body.cvData || null)}, 
          ${body.archiveCategory || null}, 
          ${body.archiveNote || null}, 
          ${JSON.stringify(body.interviewSchedule || null)}, 
          ${now}
        ) 
        ON CONFLICT (email) DO UPDATE SET 
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          age = EXCLUDED.age,
          gender = EXCLUDED.gender,
          marital_status = EXCLUDED.marital_status,
          branch = EXCLUDED.branch,
          university = EXCLUDED.university,
          department = EXCLUDED.department,
          experience_years = EXCLUDED.experience_years,
          previous_institutions = EXCLUDED.previous_institutions,
          all_trainings = EXCLUDED.all_trainings,
          answers = EXCLUDED.answers,
          status = EXCLUDED.status, 
          report = COALESCE(EXCLUDED.report, candidates.report), 
          algo_report = COALESCE(EXCLUDED.algo_report, candidates.algo_report), 
          cv_data = COALESCE(EXCLUDED.cv_data, candidates.cv_data),
          interview_schedule = COALESCE(EXCLUDED.interview_schedule, candidates.interview_schedule),
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
    console.error("Critical API Error:", error);
    return new Response(JSON.stringify({ 
      error: 'DATABASE_WRITE_ERROR', 
      message: 'Veritabanı mühürleme hatası. Şema otomatik olarak onarıldı, lütfen işlemi tekrar deneyiniz.',
      details: error.message 
    }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
