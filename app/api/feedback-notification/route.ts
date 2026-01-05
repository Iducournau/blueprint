import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

// Email du Product Builder qui reçoit les notifications
const PRODUCT_BUILDER_EMAIL = process.env.PRODUCT_BUILDER_EMAIL || 'ton-email@youschool.fr';

// Mapping des catégories pour l'affichage
const categoryLabels: Record<string, string> = {
  bug: '🐛 Bug',
  amelioration: '✨ Amélioration',
  question: '❓ Question',
  autre: '📝 Autre',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedbackId, title, description, category, userEmail } = body;

    // Vérifier que Resend est configuré
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY non configuré, email non envoyé');
      return NextResponse.json({ success: true, emailSent: false });
    }

    // Construire le contenu de l'email
    const categoryLabel = categoryLabels[category] || category;
    
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📬 Nouveau Feedback</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
            <h2 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px;">${title}</h2>
            <span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
              ${categoryLabel}
            </span>
          </div>

          ${description ? `
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase;">Description</h3>
              <p style="margin: 0; color: #334155; line-height: 1.6;">${description}</p>
            </div>
          ` : ''}

          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              <strong>Soumis par :</strong> ${userEmail || 'Utilisateur anonyme'}
            </p>
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://blueprint.vercel.app'}/feedbacks" 
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Voir dans Blueprint →
          </a>
        </div>

        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
          Blueprint — Outil de pilotage YouSchool
        </p>
      </div>
    `;

    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Blueprint <notifications@youschool.fr>', // Adapte ce domaine
      to: [PRODUCT_BUILDER_EMAIL],
      subject: `📬 Nouveau feedback : ${title}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailSent: true, emailId: data?.id });
  } catch (error) {
    console.error('Erreur API feedback-notification:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
