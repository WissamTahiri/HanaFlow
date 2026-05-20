import { NextRequest } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, validateBody, rateLimit } from "@/lib/apiHelpers";
import { verifyTotpWithStep } from "@/lib/totp";
import { decryptTotpSecret, generateBackupCodes } from "@/lib/totpCrypto";

/**
 * POST /api/auth/2fa/backup-codes
 * Régénère 10 nouveaux codes de récupération à usage unique.
 * Invalide les anciens. Exige mot de passe + code TOTP valide.
 *
 * GET — renvoie uniquement le NOMBRE de codes restants (jamais les codes en clair).
 */
const schema = z.object({
  password: z.string().min(1),
  code: z.string().trim().min(6).max(8),
});

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  if (!(await rateLimit(`2fa-backup:${auth.user.userId}`, 5, 60 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 1 heure.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(schema, body);
  if (!validated.success) return err(validated.error, 400);

  try {
    const user = await prisma.user.findUnique({ where: { id: auth.user.userId } });
    if (!user) return err("Utilisateur introuvable", 404);
    if (!user.totpEnabled || !user.totpSecret) return err("2FA non activée", 400);

    const validPwd = await argon2.verify(user.passwordHash, validated.data.password);
    if (!validPwd) return err("Mot de passe incorrect", 400);

    const plainSecret = decryptTotpSecret(user.totpSecret);
    const step = verifyTotpWithStep(validated.data.code, plainSecret);
    if (step === null) return err("Code 2FA invalide", 400);
    if (user.totpLastStep !== null && step <= user.totpLastStep) {
      return err("Code 2FA déjà utilisé. Attendez 30 secondes.", 400);
    }

    const { plain, hashed } = generateBackupCodes();
    await prisma.user.update({
      where: { id: user.id },
      data: { totpBackupCodes: hashed, totpLastStep: step },
    });

    return ok({
      backupCodes: plain,
      warning: "Anciens codes invalidés. Notez ces nouveaux codes maintenant.",
    });
  } catch (e) {
    console.error("[2fa/backup-codes POST]", e);
    return err("Erreur serveur", 500);
  }
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.user.userId },
    select: { totpEnabled: true, totpBackupCodes: true },
  });
  if (!user) return err("Utilisateur introuvable", 404);

  const codes = Array.isArray(user.totpBackupCodes) ? (user.totpBackupCodes as string[]) : [];
  return ok({
    enabled: user.totpEnabled,
    remaining: codes.length,
  });
}
