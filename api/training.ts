
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

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
