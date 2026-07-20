import { NextRequest } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, validateBody, rateLimit } from "@/lib/apiHelpers";
import { generateTotpSecret, buildOtpAuthQrDataUrl } from "@/lib/totp";
import { encryptTotpSecret } from "@/lib/totpCrypto";

const schema = z.object({
  currentPassword: z.string().min(1),
});

/**
 * Initie l'enrôlement 2FA : génère un secret TOTP éphémère, le stocke en BDD
 * (chiffré) mais totpEnabled reste false jusqu'à la vérification du premier code.
 *
 * Exige `currentPassword` — comme /2fa/disable — pour empêcher qu'un access
 * token volé (XSS, log, device partagé…) suffise à enrôler un secret TOTP
 * contrôlé par un attaquant sur le compte de la victime.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("status" in auth) return auth;

  if (!(await rateLimit(`2fa-enroll-pwd:${auth.user.userId}`, 8, 15 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 15 minutes.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(schema, body);
  if (!validated.success) return err(validated.error, 400);

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.userId },
      select: { id: true, email: true, totpEnabled: true, passwordHash: true },
    });
    if (!user) return err("Utilisateur introuvable", 404);
    if (user.totpEnabled) return err("La 2FA est déjà activée. Désactivez-la d'abord pour la régénérer.", 400);

    const validPassword = await argon2.verify(user.passwordHash, validated.data.currentPassword);
    if (!validPassword) return err("Mot de passe incorrect", 400);

    const secret = generateTotpSecret();
    const qrDataUrl = await buildOtpAuthQrDataUrl(user.email, secret);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpSecret: encryptTotpSecret(secret),
        totpEnabled: false,
        totpEnabledAt: null,
        totpLastStep: null,
        totpBackupCodes: undefined,
      },
    });

    return ok({
      secret,
      qrDataUrl,
      issuer: "HanaFlow",
      account: user.email,
    });
  } catch (e) {
    console.error("[2fa/enroll]", e);
    return err("Erreur serveur", 500);
  }
}
