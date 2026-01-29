
export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  try {
    const { targetEmail, targetPhone, targetName, channel, subject, body } = await request.json();

    if (channel === 'email') {
      if (!RESEND_API_KEY) throw new Error("Email provider not configured.");
      
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Yeni Gün Akademi <onboarding@resend.dev>',
          to: [targetEmail],
          subject: subject || 'Kurumsal Bilgilendirme',
          html: `<div style="font-family:sans-serif; color:#333; padding:20px;">${body.replace(/\n/g, '<br/>')}</div>`,
        }),
      });
      if (!res.ok) throw new Error("Email sending failed via provider.");
    }

    if (channel === 'sms') {
      // Bu bölüm yerel SMS gateway entegrasyonu için placeholder'dır.
      console.log(`[SMS SIMULATION] To: ${targetPhone}, Content: ${body}`);
      await new Promise(r => setTimeout(r, 500)); // Simüle gecikme
    }

    if (channel === 'whatsapp') {
      // WhatsApp API için webhook veya doğrudan API çağrısı
      console.log(`[WA SIMULATION] To: ${targetPhone}, Content: ${body}`);
      // İpucu: Client tarafında deep link de kullanılabilir ancak merkezi yapı için API tercih edilir.
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
