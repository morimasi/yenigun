
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

// Yardımcı: Undefined değerleri null'a çevirir
const sanitize = (val: any) => (val === undefined ? null : val);

// Şema Tahkimatı: Tablo yoksa tam şema ile oluştur, varsa eksikleri tamamla.
async function ensureSchema() {
  try {
    // 1. Ana Tabloyu (Eğer yoksa) TAM SÜTUNLARLA oluştur.
    // Bu, "ALTER" komutlarına olan bağımlılığı azaltır ve ilk kurulumu sağlamlaştırır.
    // @fix: Changed sql.query to tagged template literal sql`...` to fix 'query' property missing error on VercelPool.
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
        admin_notes TEXT,
        reminder_note TEXT,
        interview_schedule JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Mevcut tablolar için "Schema Migration" (Eksik sütunları ekle)
    // Bu blok, tablo önceden varsa ve yeni sütunlar eklenmişse çalışır.
    // @fix: Changed sql.query to tagged template literal sql`...` to fix 'query' property missing error on VercelPool.
    await sql`
      DO $$ 
      BEGIN
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
    `;
  } catch (e) {
    console.error("Schema Sync Error:", e);
    throw new Error("Veritabanı şema senkronizasyonu başarısız oldu.");
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
      // Okuma işleminden önce şemayı garantiye al
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
      const now = new Date().toISOString();

      // Veri Sanitizasyonu: Undefined hatalarını önle
      const id = sanitize(body.id);
      const name = sanitize(body.name);
      const email = sanitize(body.email);
      const phone = sanitize(body.phone);
      const age = sanitize(body.age);
      const gender = sanitize(body.gender || 'Belirtilmemiş');
      const maritalStatus = sanitize(body.maritalStatus || 'Bekar');
      const branch = sanitize(body.branch || 'Belirtilmemiş');
      const university = sanitize(body.university);
      const department = sanitize(body.department);
      const experienceYears = typeof body.experienceYears === 'number' ? body.experienceYears : 0;
      const previousInstitutions = sanitize(body.previousInstitutions);
      
      // JSON Alanları: Stringify edilmeli
      const allTrainings = JSON.stringify(body.allTrainings || []);
      const answers = JSON.stringify(body.answers || {});
      const status = sanitize(body.status || 'pending');
      const report = body.report ? JSON.stringify(body.report) : null;
      const algoReport = body.algoReport ? JSON.stringify(body.algoReport) : null;
      const cvData = body.cvData ? JSON.stringify(body.cvData) : null;
      const interviewSchedule = body.interviewSchedule ? JSON.stringify(body.interviewSchedule) : null;
      
      const archiveCategory = sanitize(body.archiveCategory);
      const archiveNote = sanitize(body.archiveNote);
      const adminNotes = sanitize(body.adminNotes);
      const reminderNote = sanitize(body.reminderNote);

      // Kayıt fonksiyonu
      const performUpsert = async () => {
        return await sql`
          INSERT INTO candidates (
            id, name, email, phone, age, gender, marital_status, branch, university, department,
            experience_years, previous_institutions, all_trainings, answers, 
            status, report, algo_report, cv_data, archive_category, archive_note, 
            admin_notes, reminder_note, interview_schedule, updated_at
          ) VALUES (
            ${id}, ${name}, ${email}, ${phone}, ${age}, ${gender}, ${maritalStatus},
            ${branch}, ${university}, ${department}, ${experienceYears}, ${previousInstitutions}, 
            ${allTrainings}, ${answers}, ${status}, ${report}, ${algoReport}, ${cvData}, 
            ${archiveCategory}, ${archiveNote}, ${adminNotes}, ${reminderNote},
            ${interviewSchedule}, ${now}
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
        console.warn("İlk kayıt denemesi başarısız, şema onarımı başlatılıyor...", firstError);
        // Hata durumunda şemayı onarmayı dene ve tekrar et
        await ensureSchema();
        await performUpsert();
      }

      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      if (!id) throw new Error("ID parameter missing");
      await sql`DELETE FROM candidates WHERE id = ${id}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

  } catch (error: any) {
    console.error("Critical API Failure:", error);
    // Hata detayını istemciye daha açık döndür
    return new Response(JSON.stringify({ 
      error: 'DATABASE_ERROR', 
      message: 'Veritabanı işlemi başarısız oldu.',
      details: error.message 
    }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
