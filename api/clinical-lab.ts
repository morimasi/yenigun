
import { sql } from '@vercel/postgres';

export const config = { runtime: 'edge' };

async function ensureLabSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS clinical_simulations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
      test_type TEXT NOT NULL,
      scenario TEXT NOT NULL,
      result_data JSONB NOT NULL,
      stress_level INTEGER NOT NULL,
      is_sealed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export default async function handler(request: Request) {
  const method = request.method;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    await ensureLabSchema();

    if (method === 'POST' && action === 'save') {
      const { candidateId, testType, scenario, resultData, stressLevel } = await request.json();
      const { rows } = await sql`
        INSERT INTO clinical_simulations (candidate_id, test_type, scenario, result_data, stress_level)
        VALUES (${candidateId}, ${testType}, ${scenario}, ${JSON.stringify(resultData)}, ${stressLevel})
        RETURNING id;
      `;
      return new Response(JSON.stringify({ success: true, id: rows[0].id }), { status: 201, headers });
    }

    if (method === 'GET' && action === 'history') {
      const candidateId = searchParams.get('candidateId');
      const { rows } = await sql`
        SELECT * FROM clinical_simulations 
        WHERE candidate_id = ${candidateId} 
        ORDER BY created_at DESC;
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
