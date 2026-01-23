
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

      // Üretim ortamında bu bilgiler environment variable'da tutulmalıdır.
      const ADMIN_USER = "admin";
      const ADMIN_PASS = "yenigun2024";

      if (username === ADMIN_USER && password === ADMIN_PASS) {
        // Basit bir session token (Gerçek senaryoda JWT veya DB tabanlı session önerilir)
        const sessionToken = btoa(`session_${Date.now()}_${Math.random()}`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          token: sessionToken,
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24 saat
        }), { status: 200, headers });
      }

      return new Response(JSON.stringify({ success: false, error: 'KİMLİK_HATASI', message: 'Hatalı kullanıcı adı veya şifre.' }), { status: 401, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'AUTH_ERROR' }), { status: 500, headers });
    }
  }

  return new Response(null, { status: 405 });
}
