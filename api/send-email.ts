
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Sadece POST metoduna izin verilir' }), { status: 405 });
  }

  // Çevresel değişkenden API anahtarını alıyoruz
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  try {
    const { to, candidateName, date, time, location } = await request.json();

    if (!RESEND_API_KEY) {
      console.error("HATA: RESEND_API_KEY tanımlanmamış.");
      // Eğer anahtar yoksa simülasyona devam et ya da hata dön
      return new Response(JSON.stringify({ error: 'E-posta servisi yapılandırılmamış.' }), { status: 500 });
    }

    const emailHtml = `
      <div style="font-family: 'Plus Jakarta Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05);">
        <div style="background-color: #0f172a; padding: 50px 40px; text-align: center;">
          <h1 style="color: #ea580c; margin: 0; font-size: 28px; letter-spacing: 4px; font-weight: 900; text-transform: uppercase;">YENİ GÜN AKADEMİ</h1>
          <p style="color: #64748b; font-size: 11px; margin-top: 12px; text-transform: uppercase; letter-spacing: 4px; font-weight: 700;">Geleceği Birlikte İnşa Ediyoruz</p>
        </div>
        <div style="padding: 50px 40px; background-color: #ffffff;">
          <p style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 20px;">Sayın ${candidateName},</p>
          <p style="line-height: 1.8; color: #475569; font-size: 16px;">Akademi kurulumuz tarafından yapılan ön değerlendirme sonucunda, uzmanlık alanınızdaki yetkinliklerinizi daha yakından tanımak adına sizinle bir mülakat gerçekleştirmek istiyoruz.</p>
          
          <div style="background-color: #f8fafc; border-radius: 24px; padding: 35px; margin: 40px 0; border: 1px solid #f1f5f9;">
            <h4 style="margin: 0 0 20px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #ea580c; font-weight: 800;">Mülakat Randevu Bilgileri</h4>
            <p style="margin: 12px 0; font-size: 15px; color: #1e293b;"><strong>📅 Tarih:</strong> ${date}</p>
            <p style="margin: 12px 0; font-size: 15px; color: #1e293b;"><strong>⏰ Saat:</strong> ${time}</p>
            <p style="margin: 12px 0; font-size: 15px; color: #1e293b;"><strong>📍 Konum:</strong> ${location}</p>
          </div>
          
          <p style="line-height: 1.8; color: #475569; font-size: 15px;">Mülakat saatinden 10 dakika önce kurumumuzda bulunmanız, tanışma sürecimizin verimliliği açısından önemlidir.</p>
          
          <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #f8fafc; text-align: center;">
            <p style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Bu bir sistem bilgilendirmesidir. Yanıtlamayınız.</p>
          </div>
        </div>
      </div>
    `;

    // RESEND API ÇAĞRISI
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Yeni Gün Akademi <onboarding@resend.dev>', // Alan adı doğrulanınca burayı değiştirin
        to: [to],
        subject: 'Mülakat Davetiyesi - Yeni Gün Akademi',
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'E-posta gönderilemedi.');
    }

    return new Response(JSON.stringify({ success: true, message: 'E-posta başarıyla gönderildi.', id: data.id }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Resend API Hatası:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
