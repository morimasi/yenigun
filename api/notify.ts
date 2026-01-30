
import { sql } from '@vercel/postgres';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // ENV DEĞİŞKENLERİ
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;

  try {
    const { targetId, targetEmail, targetPhone, targetName, channel, subject, body } = await request.json();
    let status = 'pending';
    let errorMessage = null;

    // --- CHANNEL: EMAIL (RESEND) ---
    if (channel === 'email') {
      if (!RESEND_API_KEY) {
        console.warn("[MIA SIMULATION] Email Provider Config Missing. Logging only.");
        status = 'sent'; // Demo için başarılı sayıyoruz
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
    } 
    
    // --- CHANNEL: SMS & WHATSAPP (TWILIO) ---
    else if (channel === 'sms' || channel === 'whatsapp') {
      if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_NUMBER) {
        console.warn(`[MIA SIMULATION] ${channel.toUpperCase()} Provider Config Missing. Logging only.`);
        console.log(`To: ${targetPhone}, Content: ${body}`);
        status = 'sent'; // Demo için başarılı sayıyoruz
      } else {
        try {
          // Telefon numarası formatı temizleme
          const cleanPhone = targetPhone.replace(/\s/g, '').replace(/^0/, '+90');
          const to = channel === 'whatsapp' ? `whatsapp:${cleanPhone}` : cleanPhone;
          const from = channel === 'whatsapp' ? `whatsapp:${TWILIO_NUMBER}` : TWILIO_NUMBER;

          const params = new URLSearchParams();
          params.append('To', to);
          params.append('From', from);
          params.append('Body', body);

          const auth = btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`);

          const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
          });

          if (!res.ok) {
            const errData = await res.text(); // Twilio XML/JSON dönebilir
            throw new Error(`Twilio Error: ${res.statusText}`);
          }
          
          status = 'sent';
        } catch (e: any) {
          console.error("Twilio API Error:", e);
          status = 'failed';
          errorMessage = e.message;
        }
      }
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
