
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
    // 1. GET ALL UNREAD NOTIFICATIONS
    if (method === 'GET' && action === 'list') {
      const { rows } = await sql`
        SELECT id, type, severity, title, message, is_read as "isRead", metadata, 
               EXTRACT(EPOCH FROM created_at) * 1000 as "createdAt"
        FROM system_notifications 
        ORDER BY created_at DESC 
        LIMIT 50;
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    // 2. MARK AS READ
    if (method === 'POST' && action === 'mark_read') {
      const { id } = await request.json();
      if (id === 'ALL') {
        await sql`UPDATE system_notifications SET is_read = TRUE WHERE is_read = FALSE`;
      } else {
        await sql`UPDATE system_notifications SET is_read = TRUE WHERE id = ${id}`;
      }
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // 3. LOG NEW NOTIFICATION (INTERNAL USE)
    if (method === 'POST' && action === 'create') {
      const { type, severity, title, message, metadata } = await request.json();
      await sql`
        INSERT INTO system_notifications (type, severity, title, message, metadata)
        VALUES (${type}, ${severity}, ${title}, ${message}, ${JSON.stringify(metadata || {})});
      `;
      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
