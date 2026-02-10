
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store'
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    // 1. KAYDET / YAYINLA
    if (method === 'POST' && action === 'save') {
      const body = await request.json();
      await sql`
        INSERT INTO training_curricula (id, title, category, data, status, updated_at)
        VALUES (${body.id}, ${body.title}, ${body.category}, ${JSON.stringify(body)}, ${body.status || 'active'}, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET 
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          data = EXCLUDED.data,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP;
      `;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 2. TÜM KATALOĞU LİSTELE
    if (method === 'GET' && action === 'list') {
      const { rows } = await sql`
        SELECT data FROM training_curricula 
        WHERE status = 'published' 
        ORDER BY updated_at DESC
      `;
      return new Response(JSON.stringify(rows.map(r => r.data)), { status: 200, headers });
    }

    // 3. PERSONEL ATAMALARI LİSTELE
    if (method === 'GET' && action === 'get_staff_assignments') {
        const staffId = searchParams.get('staffId');
        const { rows } = await sql`
            SELECT ta.*, tc.data as plan_data, tc.title as plan_title
            FROM training_assignments ta
            JOIN training_curricula tc ON ta.plan_id = tc.id
            WHERE ta.staff_id = ${staffId}
            ORDER BY ta.assigned_at DESC
        `;
        return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    // 4. TEKİL ATAMA YAP
    if (method === 'POST' && action === 'assign') {
      const { planId, staffId } = await request.json();
      const id = `ASN-${Date.now()}-${staffId}`;
      await sql`
        INSERT INTO training_assignments (id, plan_id, staff_id, status, progress, assigned_at)
        VALUES (${id}, ${planId}, ${staffId}, 'assigned', 0, CURRENT_TIMESTAMP)
        ON CONFLICT (plan_id, staff_id) DO NOTHING;
      `;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 5. ATAMA SİL
    if (method === 'POST' && action === 'remove_assignment') {
        const { assignmentId } = await request.json();
        await sql`DELETE FROM training_assignments WHERE id = ${assignmentId}`;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
