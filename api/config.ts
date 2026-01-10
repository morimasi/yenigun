
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const method = request.method;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store, max-age=0'
  };

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (!process.env.POSTGRES_URL) {
    return new Response(JSON.stringify({ error: 'DB_NOT_CONFIGURED' }), { status: 500, headers });
  }

  try {
    // Tek satırlık konfigürasyon tablosu
    await sql`
      CREATE TABLE IF NOT EXISTS system_config (
        id INTEGER PRIMARY KEY DEFAULT 1,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (method === 'GET') {
      const { rows } = await sql`SELECT data FROM system_config WHERE id = 1;`;
      if (rows.length === 0) {
        return new Response(JSON.stringify(null), { status: 200, headers });
      }
      return new Response(JSON.stringify(rows[0].data), { status: 200, headers });
    }

    if (method === 'POST') {
      const body = await request.json();
      await sql`
        INSERT INTO system_config (id, data, updated_at)
        VALUES (1, ${JSON.stringify(body)}, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), { status: 405, headers });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}
