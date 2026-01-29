
import { sql } from '@vercel/postgres';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  try {
    // Body'de targetId (CandidateID) bekliyoruz
    const { targetId, targetEmail, targetPhone, targetName, channel, subject, body } = await request.json();
    let status = 'pending';
    let errorMessage = null;

    if (channel === 'email') {
      if (!RESEND_API_KEY) {
        status = 'failed';
        errorMessage = 'Email provider config missing';
      } else {
        try {
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
          
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Email failed");
          }
          status = 'sent';
        } catch (e: any) {
          status = 'failed';
          errorMessage = e.message;
        }
      }
    } else {
      // SMS / WhatsApp Simulation
      console.log(`[${channel.toUpperCase()} SIM] To: ${targetPhone}, Content: ${body}`);
      status = 'sent'; 
    }

    // DATABASE LOGGING
    if (targetId) {
      await sql`
        INSERT INTO communication_logs (
          target_id, target_email, channel, subject, content_preview, status, error_message
        ) VALUES (
          ${targetId}, ${targetEmail}, ${channel}, ${subject}, ${body.substring(0, 200)}, ${status}, ${errorMessage}
        )
      `;
    }

    if (status === 'failed') {
      return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
