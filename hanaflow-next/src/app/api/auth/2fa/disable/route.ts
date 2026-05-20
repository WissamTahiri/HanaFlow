import { NextRequest } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, validateBody, rateLimit, getClientIp } from "@/lib/apiHelpers";
import { verifyTotpWithStep } from "@/lib/totp";
import { decryptTotpSecret, consumeBackupCode } from "@/lib/totpCrypto";

const schema = z.object({
  password: z.string().min(1),
  code: z.string().trim().min(6).max(20),
});

/**
 * Désactive la 2FA. Exige mot de passe ET un code TOTP valide (ou un code de
 * récupération) — empêche qu'un access token volé suffise à désactiver la 2FA.
 */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  if (!(await rateLimit(`2fa-disable:${auth.user.userId}`, 5, 15 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 15 minutes.", 429);
  }
  const ip = getClientIp(req);
  if (!(await rateLimit(`2fa-disable:ip:${ip}`, 15, 15 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 15 minutes.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(schema, body);
  if (!validated.success) return err(validated.error, 400);

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.userId },
    });
    if (!user) return err("Utilisateur introuvable", 404);
    if (!user.totpEnabled || !user.totpSecret) return err("2FA non activée", 400);

    const validPassword = await argon2.verify(user.passwordHash, validated.data.password);
    if (!validPassword) return err("Mot de passe incorrect", 400);

    const plainSecret = decryptTotpSecret(user.totpSecret);
    const step = verifyTotpWithStep(validated.data.code, plainSecret);

    // Anti-replay : refuse un step déjà consommé
    if (step !== null && user.totpLastStep !== null && step <= user.totpLastStep) {
      return err("Code 2FA déjà utilisé. Attendez 30 secondes et réessayez.", 400);
    }

    let backupCodeUsed = false;
    if (step === null) {
      // Le code TOTP n'a pas matché → on tente comme code de récupération
      const stored = Array.isArray(user.totpBackupCodes)
        ? (user.totpBackupCodes as string[])
        : null;
      if (!stored) return err("Code 2FA invalide", 400);
      const remaining = consumeBackupCode(validated.data.code, stored);
      if (!remaining) return err("Code 2FA invalide", 400);
      backupCodeUsed = true;
      // (on désactive juste après, donc inutile de persister `remaining`)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpSecret: null,
        totpEnabled: false,
        totpEnabledAt: null,
        totpLastStep: null,
        totpBackupCodes: undefined,
      },
    });

    return ok({ message: "2FA désactivée", backupCodeUsed });
  } catch (e) {
    console.error("[2fa/disable]", e);
    return err("Erreur serveur", 500);
  }
}
