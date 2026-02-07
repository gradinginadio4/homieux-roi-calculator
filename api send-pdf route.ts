import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const translations: any = {
  fr: {
    subject: 'Votre analyse ROI - Homieux Media',
    cta: 'Réserver mon appel de 30 min',
    ctaUrl: 'https://calendly.com/homieuxmedia/discovery-call-gratuit-discutons-de-vos-defis',
  },
  nl: {
    subject: 'Uw ROI-analyse - Homieux Media',
    cta: 'Plan mijn 30 minuten gesprek',
    ctaUrl: 'https://calendly.com/homieuxmedia/discovery-call-gratuit-discutons-de-vos-defis',
  },
  en: {
    subject: 'Your ROI Analysis - Homieux Media',
    cta: 'Book my 30-minute call',
    ctaUrl: 'https://calendly.com/homieuxmedia/discovery-call-gratuit-discutons-de-vos-defis',
  },
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('fr-BE').format(Math.round(n))
}

export async function POST(req: Request) {
  try {
    const { to, lang, data } = await req.json()
    const t = translations[lang] || translations.fr

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #00008B 0%, #1a1a9c 100%); color: white; padding: 30px; text-align: center; border-radius: 16px 16px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f8f9fa; padding: 30px; }
    .total-box { background: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px; border-left: 4px solid #ED51C2; }
    .total-amount { font-size: 32px; font-weight: bold; color: #00008B; }
    .detail-box { background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #00008B; }
    .detail-box.green { border-left-color: #10b981; }
    .detail-box.amber { border-left-color: #f59e0b; }
    .label { font-size: 12px; color: #666; text-transform: uppercase; }
    .value { font-size: 20px; font-weight: bold; color: #00008B; }
    .cta-button { display: inline-block; background: #ff7a59; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>💰 Votre analyse ROI</h1>
  </div>
  <div class="content">
    <p>Bonjour,</p>
    <p>Voici votre analyse personnalisée basée sur vos données.</p>
    <div class="total-box">
      <div class="total-amount">${formatNumber(data.totalGains)} €</div>
      <div>+${data.profitPercent.toFixed(1)}% de rentabilité supplémentaire</div>
    </div>
    <div class="detail-box green">
      <div class="label">Optimisation marge</div>
      <div class="value">${formatNumber(data.marginGain)} €</div>
    </div>
    <div class="detail-box">
      <div class="label">Réduction saturation</div>
      <div class="value">${formatNumber(data.saturationReduction)} €</div>
      <div style="font-size: 14px; color: #666;">${formatNumber(data.heuresSaved)} heures récupérées</div>
    </div>
    <div class="detail-box amber">
      <div class="label">Économie énergie</div>
      <div class="value">${formatNumber(data.energySave)} €</div>
    </div>
    <center>
      <a href="${t.ctaUrl}" class="cta-button">${t.cta}</a>
    </center>
  </div>
  <div class="footer">
    <p>Outil créé avec ❤️ par Homieux Media à Bruxelles</p>
    <p>Des questions ? Répondez à cet email.</p>
    <p><strong>gradinginadio4@gmail.com</strong></p>
  </div>
</body>
</html>
    `

    const { data: emailData, error } = await resend.emails.send({
      from: 'Homieux Media <onboarding@resend.dev>',
      to: [to],
      subject: t.subject,
      html: htmlContent,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: emailData?.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
