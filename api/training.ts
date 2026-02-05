
import { sql } from '@vercel/postgres';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    // 1. ŞEMA TAHKİMATI
    await sql`
      CREATE TABLE IF NOT EXISTS training_curricula (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS training_assignments (
        id TEXT PRIMARY KEY,
        plan_id TEXT REFERENCES training_curricula(id) ON DELETE CASCADE,
        staff_id TEXT NOT NULL,
        status TEXT DEFAULT 'assigned',
        progress INTEGER DEFAULT 0,
        score INTEGER,
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE
      );
    `;

    // 2. AKSİYONLAR
    if (method === 'POST' && action === 'save') {
      const body = await request.json();
      await sql`
        INSERT INTO training_curricula (id, title, category, data, updated_at)
        VALUES (${body.id}, ${body.title}, ${body.category}, ${JSON.stringify(body)}, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET 
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          data = EXCLUDED.data,
          updated_at = CURRENT_TIMESTAMP;
      `;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    if (method === 'GET' && action === 'list') {
      const { rows } = await sql`SELECT data FROM training_curricula ORDER BY updated_at DESC`;
      return new Response(JSON.stringify(rows.map(r => r.data)), { status: 200, headers });
    }

    if (method === 'POST' && action === 'assign') {
      const { planId, staffIds } = await request.json();
      for (const sid of staffIds) {
        const id = `ASN-${Date.now()}-${sid}`;
        await sql`
          INSERT INTO training_assignments (id, plan_id, staff_id)
          VALUES (${id}, ${planId}, ${sid})
          ON CONFLICT DO NOTHING;
        `;
      }
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    if (method === 'GET' && action === 'get_assignments') {
      const planId = searchParams.get('planId');
      const { rows } = await sql`
        SELECT a.*, s.name as staff_name 
        FROM training_assignments a
        JOIN staff s ON a.staff_id = s.id
        WHERE a.plan_id = ${planId}
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    if (method === 'GET' && action === 'get_staff_assignments') {
      const staffId = searchParams.get('staffId');
      const { rows } = await sql`
        SELECT a.*, c.title as plan_title, c.category as plan_category, c.data as plan_data
        FROM training_assignments a
        JOIN training_curricula c ON a.plan_id = c.id
        WHERE a.staff_id = ${staffId}
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    if (method === 'POST' && action === 'update_progress') {
       const { assignmentId, progress, status, score } = await request.json();
       const completedAt = status === 'completed' ? new Date().toISOString() : null;
       await sql`
         UPDATE training_assignments 
         SET progress = ${progress}, status = ${status}, score = ${score || null}, completed_at = ${completedAt}
         WHERE id = ${assignmentId}
       `;
       return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
