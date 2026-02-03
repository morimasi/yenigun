
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
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    // 1. SAVE NEW SIMULATION
    if (method === 'POST' && action === 'save') {
      const { candidateId, testType, scenario, resultData, stressLevel } = await request.json();
      const { rows } = await sql`
        INSERT INTO clinical_simulations (candidate_id, test_type, scenario, result_data, stress_level)
        VALUES (${candidateId}, ${testType}, ${scenario}, ${JSON.stringify(resultData)}, ${stressLevel})
        RETURNING id;
      `;
      return new Response(JSON.stringify({ success: true, id: rows[0].id }), { status: 201, headers });
    }

    // 2. GET HISTORY FOR CANDIDATE
    if (method === 'GET' && action === 'history') {
      const candidateId = searchParams.get('candidateId');
      const { rows } = await sql`
        SELECT * FROM clinical_simulations 
        WHERE candidate_id = ${candidateId} 
        ORDER BY created_at DESC;
      `;
      return new Response(JSON.stringify(rows), { status: 200, headers });
    }

    // 3. SEAL SIMULATION (MAKE READ-ONLY)
    if (method === 'POST' && action === 'seal') {
      const { simId } = await request.json();
      await sql`UPDATE clinical_simulations SET is_sealed = TRUE WHERE id = ${simId}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
  return new Response(null, { status: 405 });
}
