
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const method = request.method;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });

  if (method === 'POST') {
    try {
      const { username, password } = await request.json();

      // DB AUTH CHECK (Role MUST be admin)
      // Not: username parametresini email veya name ile eşleştirebiliriz.
      // Basitlik adına, 'admin' kullanıcısı özel bir username gibi davranır veya email ile kontrol edilir.
      
      const { rows } = await sql`
        SELECT id, name, role FROM staff 
        WHERE (email = ${username} OR name = 'Sistem Yöneticisi') -- 'admin' girişi için name veya email
        AND password_hash = ${password}
        AND role = 'admin'
        LIMIT 1;
      `;

      if (rows.length > 0) {
        const user = rows[0];
        const sessionToken = btoa(`session_${user.id}_${Date.now()}`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          token: sessionToken,
          user: { name: user.name, role: user.role },
          expires: Date.now() + (24 * 60 * 60 * 1000)
        }), { status: 200, headers });
      }

      // Legacy/Fallback check removed for security. DB is mandatory.
      return new Response(JSON.stringify({ success: false, error: 'KİMLİK_HATASI', message: 'Yetkisiz erişim veya hatalı şifre.' }), { status: 401, headers });
    } catch (e: any) {
      console.error("Auth DB Error:", e);
      return new Response(JSON.stringify({ error: 'DB_CONNECTION_ERROR', details: e.message }), { status: 500, headers });
    }
  }

  return new Response(null, { status: 405 });
}
