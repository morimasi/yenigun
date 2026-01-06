
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);

  // POSTGRES_URL eksikse 500 basmak yerine anlamlı bir hata dön
  if (!process.env.POSTGRES_URL) {
    return new Response(JSON.stringify({ 
      error: 'Veritabanı yapılandırması eksik.', 
      mode: 'local_only' 
    }), { 
      status: 200, // Frontend'in local modda devam etmesi için 200 dönüyoruz
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Tablo oluşturma işlemini sadece POST veya uygulama başlangıcında bir kez denemesi yeterli
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `.catch(e => {
      console.warn('Tablo oluşturma başarısız (Muhtemelen yetki hatası):', e.message);
    });

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
        timestamp: new Date(row.created_at).getTime()
      }));
      
      return new Response(JSON.stringify(candidates), { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
        } 
      });
    }

    if (method === 'POST') {
      const body = await request.json();
      await sql`
        INSERT INTO candidates (id, name, email, phone, age, branch, experience_years, previous_institutions, all_trainings, answers, status, admin_notes)
        VALUES (
          ${body.id}, 
          ${body.name}, 
          ${body.email}, 
          ${body.phone || null}, 
          ${body.age || 0},
          ${body.branch}, 
          ${body.experienceYears}, 
          ${body.previousInstitutions || ''},
          ${body.allTrainings || ''},
          ${JSON.stringify(body.answers)}, 
          ${body.status},
          ${body.adminNotes || null}
        );
      `;
      return new Response(JSON.stringify({ success: true }), { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'PATCH') {
      const body = await request.json();
      if (body.report) {
        await sql`UPDATE candidates SET report = ${JSON.stringify(body.report)}, status = ${body.status} WHERE id = ${body.id}`;
      } else if (body.interviewSchedule) {
        await sql`UPDATE candidates SET interview_schedule = ${JSON.stringify(body.interviewSchedule)}, status = ${body.status} WHERE id = ${body.id}`;
      } else if (body.adminNotes !== undefined) {
        await sql`UPDATE candidates SET admin_notes = ${body.adminNotes} WHERE id = ${body.id}`;
      } else {
        await sql`UPDATE candidates SET status = ${body.status} WHERE id = ${body.id}`;
      }
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'DELETE') {
      const id = searchParams.get('id');
      if (!id) throw new Error('Aday ID gerekli.');
      await sql`DELETE FROM candidates WHERE id = ${id}`;
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Geçersiz Metot' }), { status: 405 });

  } catch (error: any) {
    console.error('API Veritabanı Hatası:', error.message);
    return new Response(JSON.stringify({ 
      error: 'İşlem Başarısız', 
      details: error.message,
      is_db_error: true
    }), { 
      status: 200, // Yine 200 dönüyoruz ki frontend patlamasın, sadece loglasın
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
