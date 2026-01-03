
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);

  try {
    // GET: Tüm adayları listele
    if (method === 'GET') {
      const { rows } = await sql`SELECT * FROM candidates ORDER BY created_at DESC;`;
      // Postgres sütun isimlerini (snake_case) frontend tiplerine (camelCase) dönüştür
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
      return new Response(JSON.stringify(candidates), { status: 200 });
    }

    // POST: Yeni aday kaydet
    if (method === 'POST') {
      const body = await request.json();
      await sql`
        INSERT INTO candidates (id, name, email, phone, branch, experience_years, answers, status)
        VALUES (${body.id}, ${body.name}, ${body.email}, ${body.phone}, ${body.branch}, ${body.experienceYears}, ${JSON.stringify(body.answers)}, ${body.status});
      `;
      return new Response(JSON.stringify({ message: 'Success' }), { status: 201 });
    }

    // PATCH: Aday güncelle (Rapor veya Durum)
    if (method === 'PATCH') {
      const body = await request.json();
      if (body.report) {
        await sql`
          UPDATE candidates 
          SET report = ${JSON.stringify(body.report)}, status = ${body.status}
          WHERE id = ${body.id};
        `;
      } else if (body.interviewSchedule) {
        await sql`
          UPDATE candidates 
          SET interview_schedule = ${JSON.stringify(body.interviewSchedule)}, status = ${body.status}
          WHERE id = ${body.id};
        `;
      } else {
        await sql`
          UPDATE candidates 
          SET status = ${body.status}
          WHERE id = ${body.id};
        `;
      }
      return new Response(JSON.stringify({ message: 'Updated' }), { status: 200 });
    }

    // DELETE: Aday sil
    if (method === 'DELETE') {
      const id = searchParams.get('id');
      if (!id) return new Response('ID Required', { status: 400 });
      await sql`DELETE FROM candidates WHERE id = ${id};`;
      return new Response(JSON.stringify({ message: 'Deleted' }), { status: 200 });
    }

    return new Response('Method Not Allowed', { status: 405 });
  } catch (error: any) {
    console.error('Database Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
