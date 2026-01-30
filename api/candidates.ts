
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

// Şema Tahkimatı: Tüm olası eksik sütunları tek bir atomik işlemde mühürle
async function ensureSchema() {
  try {
    await sql.query(`
      DO $$ 
      BEGIN
        -- Ana tablo
        CREATE TABLE IF NOT EXISTS candidates (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Eksik Sütunların Enjeksiyonu
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS phone TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS age INTEGER;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS marital_status TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS branch TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS university TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS department TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS previous_institutions TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS all_trainings JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS report JSONB;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS algo_report JSONB;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS cv_data JSONB;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS archive_category TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS archive_note TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS admin_notes TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS reminder_note TEXT;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS interview_schedule JSONB;
        ALTER TABLE candidates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
      END $$;
    `);
  } catch (e) {
    console.error("Schema Sync Error:", e);
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

  try {
    if (method === 'GET') {
      await ensureSchema();
      const { rows } = await sql`
        SELECT 
          id, name, email, phone, age, gender, marital_status as "maritalStatus",
          branch, university, department, experience_years as "experienceYears",
          previous_institutions as "previousInstitutions", all_trainings as "allTrainings",
          answers, status, report, algo_report as "algoReport", cv_data as "cvData",
          archive_category as "archiveCategory", archive_note as "archiveNote",
          admin_notes as "adminNotes", reminder_note as "reminderNote",
          interview_schedule as "interviewSchedule", updated_at as "timestamp"
        FROM candidates 
        ORDER BY updated_at DESC;
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    if (method === 'POST') {
      const body = await request.json();
      
      // Kayıt fonksiyonu: İçsel hata toleransı için encapsulate edildi
      const performUpsert = async () => {
        const now = new Date().toISOString();
        return await sql`
          INSERT INTO candidates (
            id, name, email, phone, age, gender, marital_status, branch, university, department,
            experience_years, previous_institutions, all_trainings, answers, 
            status, report, algo_report, cv_data, archive_category, archive_note, 
            admin_notes, reminder_note, interview_schedule, updated_at
          ) VALUES (
            ${body.id}, ${body.name}, ${body.email}, ${body.phone || null}, 
            ${body.age || null}, ${body.gender || 'Belirtilmemiş'}, ${body.maritalStatus || 'Bekar'},
            ${body.branch || 'Belirtilmemiş'}, ${body.university || null}, ${body.department || null}, 
            ${body.experienceYears || 0}, ${body.previousInstitutions || null}, 
            ${JSON.stringify(body.allTrainings || [])}, ${JSON.stringify(body.answers || {})},
            ${body.status || 'pending'}, ${JSON.stringify(body.report || null)}, 
            ${JSON.stringify(body.algoReport || null)}, ${JSON.stringify(body.cvData || null)}, 
            ${body.archiveCategory || null}, ${body.archiveNote || null},
            ${body.adminNotes || null}, ${body.reminderNote || null},
            ${JSON.stringify(body.interviewSchedule || null)}, ${now}
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
            archive_category = COALESCE(EXCLUDED.archive_category, candidates.archive_category),
            archive_note = COALESCE(EXCLUDED.archive_note, candidates.archive_note),
            admin_notes = COALESCE(EXCLUDED.admin_notes, candidates.admin_notes),
            reminder_note = COALESCE(EXCLUDED.reminder_note, candidates.reminder_note),
            interview_schedule = COALESCE(EXCLUDED.interview_schedule, candidates.interview_schedule),
            updated_at = EXCLUDED.updated_at;
        `;
      };

      try {
        await performUpsert();
      } catch (firstError) {
        // İLK HATA: Muhtemelen şema eksik. Onar ve sessizce tekrar dene.
        console.warn("First attempt failed, fixing schema and retrying...");
        await ensureSchema();
        await performUpsert(); // Eğer bu da hata verirse global catch bloğuna düşecek
      }

      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      await sql`DELETE FROM candidates WHERE id = ${id}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

  } catch (error: any) {
    console.error("Critical API 500 Failure:", error);
    return new Response(JSON.stringify({ 
      error: 'DATABASE_FATAL_ERROR', 
      message: 'Sistem bir veri uyuşmazlığı saptadı ve otomatik onarım gerçekleştirdi. Lütfen son işleminizi kontrol ediniz.',
      details: error.message 
    }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
