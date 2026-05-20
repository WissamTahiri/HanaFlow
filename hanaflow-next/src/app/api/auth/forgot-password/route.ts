import { NextRequest } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import { validateBody, err, ok, rateLimit, getClientIp } from "@/lib/apiHelpers";
import { sendEmail, templates } from "@/lib/email";

const schema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
});

const RESET_TTL_MS = 60 * 60 * 1000; // 1h
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

/**
 * Demande de réinitialisation de mot de passe.
 * Anti-énumération : on renvoie TOUJOURS 200 + même message, qu'un compte
 * existe ou non. L'email n'est envoyé que si le compte existe vraiment.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!(await rateLimit(`forgot:ip:${ip}`, 5, 60 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 1 heure.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(schema, body);
  if (!validated.success) return err(validated.error, 400);

  // Rate-limit par email aussi : évite qu'un attaquant qui connaît une liste
  // d'emails ne déclenche le flow + email pour chacun.
  if (!(await rateLimit(`forgot:email:${validated.data.email}`, 3, 60 * 60 * 1000))) {
    // Toujours le même message pour ne pas signaler la limitation.
    return ok({ message: "Si un compte existe pour cette adresse, un email a été envoyé." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: validated.data.email },
      select: { id: true, name: true, email: true, isSuspended: true },
    });

    // Pas d'envoi si compte inexistant ou suspendu — mais on garde la même réponse.
    if (user && !user.isSuspended) {
      // Invalide les éventuels tokens précédents pour ce user
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

      const rawToken = crypto.randomBytes(32).toString("hex");
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(rawToken),
          expiresAt: new Date(Date.now() + RESET_TTL_MS),
          ipAddress: ip,
        },
      });

      const resetUrl = `${APP_URL}/reset-password?token=${rawToken}`;
      const tpl = templates.passwordResetRequest(user.name, resetUrl);
      void sendEmail({ to: user.email, ...tpl });
    }
  } catch (e) {
    console.error("[forgot-password]", e);
    // Ne JAMAIS révéler l'erreur côté client → reste sur le message générique.
  }

  return ok({ message: "Si un compte existe pour cette adresse, un email a été envoyé." });
}
