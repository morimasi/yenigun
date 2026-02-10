
import { sql } from '@vercel/postgres';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { staffId, entityId, entityType, exportFormat, documentTitle, metadata } = await request.json();

    await sql`
      INSERT INTO export_logs (staff_id, entity_id, entity_type, export_format, document_title, metadata)
      VALUES (${staffId || 'SYSTEM'}, ${entityId}, ${entityType}, ${exportFormat}, ${documentTitle}, ${JSON.stringify(metadata || {})});
    `;

    // Eğer yayınlama işlemiyse adayın durumunu güncelle
    if (exportFormat === 'PUBLISH' && entityType === 'CANDIDATE') {
      await sql`UPDATE candidates SET is_published = TRUE WHERE id = ${entityId}`;
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
