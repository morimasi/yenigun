
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

/**
 * Yeni Gün Özel Eğitim - Neon Cloud Veri Katmanı
 * Bu fonksiyon DATABASE_URL (veya POSTGRES_URL) ortam değişkenini otomatik kullanır.
 */
export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);

  try {
    // 1. Şema Kontrolü ve Tablo Oluşturma
    // Bu kısım veritabanı boşsa otomatik tablo oluşturur.
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        branch TEXT,
        experience_years INTEGER,
        answers JSONB,
        status TEXT DEFAULT 'pending',
        interview_schedule JSONB,
        report JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `.catch(e => console.error('Database Initialization Error:', e));

    // 2. Veri Okuma (GET)
    if (method === 'GET') {
      const { rows } = await sql`SELECT * FROM candidates ORDER BY created_at DESC;`;
      const candidates = rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        branch: row.branch,
        experienceYears: row.experience_years,
        answers: row.answers,
        status: row.status,
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

    // 3. Yeni Başvuru Kaydı (POST)
    if (method === 'POST') {
      const body = await request.json();
      await sql`
        INSERT INTO candidates (id, name, email, phone, branch, experience_years, answers, status)
        VALUES (
          ${body.id}, 
          ${body.name}, 
          ${body.email}, 
          ${body.phone || null}, 
          ${body.branch}, 
          ${body.experienceYears}, 
          ${JSON.stringify(body.answers)}, 
          ${body.status}
        );
      `;
      return new Response(JSON.stringify({ success: true, message: "Kayıt Buluta Mühürlendi" }), { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Veri Güncelleme (PATCH) - AI Raporu veya Mülakat Planı
    if (method === 'PATCH') {
      const body = await request.json();
      if (body.report) {
        await sql`UPDATE candidates SET report = ${JSON.stringify(body.report)}, status = ${body.status} WHERE id = ${body.id}`;
      } else if (body.interviewSchedule) {
        await sql`UPDATE candidates SET interview_schedule = ${JSON.stringify(body.interviewSchedule)}, status = ${body.status} WHERE id = ${body.id}`;
      } else {
        await sql`UPDATE candidates SET status = ${body.status} WHERE id = ${body.id}`;
      }
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. Kayıt Silme (DELETE)
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
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Veritabanı Bağlantı Hatası', 
      details: error.message,
      isCloudError: true 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
