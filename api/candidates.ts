
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('Authorization');

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, max-age=0'
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  if (method === 'GET' || method === 'DELETE') {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), { status: 401, headers });
    }
  }

  try {
    // Tablo şeması kontrolü ve ilklendirme
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
        reminder_note TEXT,
        report JSONB DEFAULT NULL,
        algo_report JSONB DEFAULT NULL,
        interview_schedule JSONB DEFAULT NULL,
        cv_data JSONB DEFAULT NULL,
        archive_category TEXT,
        archive_note TEXT,
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
        reminderNote: row.reminder_note || '',
        archiveCategory: row.archive_category,
        archiveNote: row.archive_note,
        report: row.report,
        algoReport: row.algo_report,
        cvData: row.cv_data,
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

      // 1. ADAY GÜNCELLEMESİ
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
          cv_data = EXCLUDED.cv_data, archive_category = EXCLUDED.archive_category, 
          archive_note = EXCLUDED.archive_note, updated_at = EXCLUDED.updated_at;
      `;

      // 2. OTOMATİK PERSONEL ATAMA (AUTO-COMMISSIONING)
      // Eğer aday "HIRED_CONTRACTED" olarak işaretlendiyse, onu Staff tablosuna da ekle.
      if (body.status === 'archived' && body.archiveCategory === 'HIRED_CONTRACTED') {
        const staffId = `STF-${body.id.toUpperCase().substring(0, 6)}`; // Benzersiz Staff ID türet
        const defaultPassword = 'yenigun2024'; // İlk giriş şifresi

        await sql`
          INSERT INTO staff (
            id, name, email, phone, password_hash, branch, university, department,
            experience_years, all_trainings, onboarding_complete, status, created_at, updated_at
          ) VALUES (
            ${staffId}, ${body.name}, ${body.email}, ${body.phone}, ${defaultPassword}, 
            ${body.branch}, ${body.university}, ${body.department}, ${body.experienceYears},
            ${allTrainings}, FALSE, 'active', ${now}, ${now}
          )
          ON CONFLICT (email) DO NOTHING; -- E-posta zaten varsa işlem yapma (Idempotency)
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
    return new Response(JSON.stringify({ error: 'DB_ERROR', message: error.message }), { status: 500, headers });
  }
}
