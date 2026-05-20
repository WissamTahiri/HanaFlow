import { NextRequest } from "next/server";
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import { validateBody, err, ok, rateLimit, getClientIp } from "@/lib/apiHelpers";
import { checkPasswordBreached } from "@/lib/passwordBreach";

const schema = z.object({
  token: z.string().min(16).max(256),
  password: z
    .string()
    .min(8, "Mot de passe : 8 caractères minimum")
    .max(128)
    .regex(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

/**
 * Consomme un token de reset à usage unique et change le mot de passe.
 * - Token hashé en DB → on hash le clair reçu et on compare.
 * - Tx atomique : mark usedAt + update password + revoke all sessions.
 * - Rejette les tokens expirés, déjà utilisés, ou liés à un compte suspendu.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!(await rateLimit(`reset-pwd:ip:${ip}`, 10, 60 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 1 heure.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(schema, body);
  if (!validated.success) return err(validated.error, 400);

  const tokenHash = hashToken(validated.data.token);

  const reset = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, isSuspended: true } } },
  });

  if (!reset) return err("Lien invalide ou expiré", 400);
  if (reset.usedAt) return err("Ce lien a déjà été utilisé", 400);
  if (reset.expiresAt < new Date()) return err("Lien expiré, refais une demande", 400);
  if (reset.user.isSuspended) return err("Compte suspendu, contacte le support", 403);

  const breach = await checkPasswordBreached(validated.data.password);
  if (breach.breached) {
    return err(
      `Ce mot de passe figure dans une fuite connue (${breach.count} occurrences). Choisis-en un autre.`,
      400,
    );
  }

  const passwordHash = await argon2.hash(validated.data.password, { type: argon2.argon2id });

  try {
    await prisma.$transaction([
      prisma.passwordResetToken.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash, pwdChangedAt: new Date() },
      }),
      // Toutes les sessions actives sont invalidées
      prisma.refreshToken.deleteMany({ where: { userId: reset.userId } }),
    ]);
  } catch (e) {
    console.error("[reset-password]", e);
    return err("Erreur lors de la mise à jour", 500);
  }

  return ok({ message: "Mot de passe mis à jour. Tu peux te connecter." });
}
