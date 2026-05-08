import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "HanaFlow <noreply@hanaflow.app>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? null;

const client = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Envoi d'email. Si RESEND_API_KEY n'est pas configurée, fallback en log console.
 * Ne jette jamais — l'email ne doit pas bloquer le flux principal.
 */
export async function sendEmail({ to, subject, html, text }: EmailParams): Promise<{ ok: boolean; id?: string; reason?: string }> {
  if (!client) {
    console.log(`[email:console] To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`[email:console] Subject: ${subject}`);
    console.log(`[email:console] ${text ?? html.replace(/<[^>]*>/g, "")}`);
    return { ok: false, reason: "no_resend_key" };
  }

  try {
    const result = await client.emails.send({ from: FROM_EMAIL, to, subject, html, text });
    if (result.error) {
      console.error("[email] Resend error:", result.error);
      return { ok: false, reason: result.error.message };
    }
    return { ok: true, id: result.data?.id };
  } catch (e) {
    console.error("[email] Send failed:", e);
    return { ok: false, reason: String(e) };
  }
}

/* ─── Templates HTML simples ────────────────────────────────────────── */

const wrap = (innerHtml: string) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>HanaFlow</title></head>
<body style="margin:0;padding:32px;background:#F8FAFC;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0F172A;">
  <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
    <p style="font-size:20px;font-weight:800;color:#2563EB;margin:0 0 24px 0;letter-spacing:-0.01em;">HanaFlow</p>
    ${innerHtml}
    <p style="font-size:12px;color:#94A3B8;margin-top:32px;border-top:1px solid #E2E8F0;padding-top:16px;">
      Vous recevez ce message car vous avez un compte sur HanaFlow.
    </p>
  </div>
</body></html>`;

export const templates = {
  welcome: (name: string) => ({
    subject: "Bienvenue sur HanaFlow",
    html: wrap(`
      <h1 style="font-size:22px;margin:0 0 16px 0;">Bienvenue ${name} 👋</h1>
      <p style="line-height:1.6;color:#334155;">
        Ton compte HanaFlow est créé. Tu peux maintenant accéder à l'ensemble des modules SAP
        (FI, CO, MM, SD, HCM, PP) et suivre ta progression.
      </p>
      <p style="margin-top:24px;">
        <a href="https://hanaflow.vercel.app/dashboard" style="display:inline-block;padding:12px 20px;background:#2563EB;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">
          Accéder à mon espace →
        </a>
      </p>
    `),
    text: `Bienvenue ${name} sur HanaFlow ! Connecte-toi sur https://hanaflow.vercel.app/dashboard`,
  }),

  passwordReset: (name: string) => ({
    subject: "Mot de passe réinitialisé",
    html: wrap(`
      <h1 style="font-size:22px;margin:0 0 16px 0;">Mot de passe réinitialisé</h1>
      <p style="line-height:1.6;color:#334155;">
        Bonjour ${name}, ton mot de passe HanaFlow vient d'être réinitialisé par un administrateur.
      </p>
      <p style="line-height:1.6;color:#334155;">
        Toutes tes sessions actives ont été déconnectées. Connecte-toi avec ton nouveau mot de passe pour récupérer l'accès.
      </p>
      <p style="margin-top:24px;">
        <a href="https://hanaflow.vercel.app/login" style="display:inline-block;padding:12px 20px;background:#2563EB;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">
          Se connecter →
        </a>
      </p>
      <p style="font-size:13px;color:#64748B;margin-top:24px;">
        Si tu n'as pas demandé cette réinitialisation, contacte-nous immédiatement.
      </p>
    `),
  }),

  accountSuspended: (name: string) => ({
    subject: "Compte suspendu",
    html: wrap(`
      <h1 style="font-size:22px;margin:0 0 16px 0;">Compte temporairement suspendu</h1>
      <p style="line-height:1.6;color:#334155;">
        Bonjour ${name}, ton compte HanaFlow a été suspendu par un administrateur.
        Tu n'as plus accès à la plateforme jusqu'à réactivation.
      </p>
      <p style="line-height:1.6;color:#334155;">
        Pour toute question, contacte-nous via la page de contact.
      </p>
    `),
  }),

  proActivated: (name: string) => ({
    subject: "Plan Pro activé !",
    html: wrap(`
      <h1 style="font-size:22px;margin:0 0 16px 0;">Bienvenue dans Pro 🎉</h1>
      <p style="line-height:1.6;color:#334155;">
        Bonjour ${name}, ton plan Pro est maintenant actif. Tu as accès à l'ensemble des chapitres
        de certifications, aux simulateurs d'examen et aux contenus premium.
      </p>
      <p style="margin-top:24px;">
        <a href="https://hanaflow.vercel.app/certifications" style="display:inline-block;padding:12px 20px;background:#2563EB;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">
          Découvrir les certifications →
        </a>
      </p>
    `),
  }),

  adminNewSignup: (newUser: { name: string; email: string }) => ({
    subject: `Nouveau compte : ${newUser.name}`,
    html: wrap(`
      <h1 style="font-size:18px;margin:0 0 16px 0;">Nouvel utilisateur inscrit</h1>
      <p style="line-height:1.6;color:#334155;"><strong>${newUser.name}</strong> (${newUser.email})</p>
      <p style="margin-top:24px;">
        <a href="https://hanaflow.vercel.app/admin/users" style="display:inline-block;padding:10px 16px;background:#2563EB;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
          Voir dans l'admin →
        </a>
      </p>
    `),
  }),
};

export function getAdminEmail(): string | null {
  return ADMIN_EMAIL;
}
