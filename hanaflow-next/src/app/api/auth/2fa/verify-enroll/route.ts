import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, validateBody, rateLimit } from "@/lib/apiHelpers";
import { verifyTotpWithStep } from "@/lib/totp";
import { decryptTotpSecret, generateBackupCodes } from "@/lib/totpCrypto";

const schema = z.object({
  code: z.string().trim().min(6).max(8),
});

/**
 * Confirme l'enrôlement 2FA : vérifie le 1er code TOTP, active totpEnabled,
 * et renvoie 10 codes de récupération à usage unique (à montrer UNE seule fois
 * à l'utilisateur — on ne stocke que leur hash).
 */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  if (!(await rateLimit(`2fa-enroll:${auth.user.userId}`, 8, 10 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 10 minutes.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(schema, body);
  if (!validated.success) return err(validated.error, 400);

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.userId },
      select: { id: true, totpSecret: true, totpEnabled: true },
    });
    if (!user || !user.totpSecret) return err("Aucun enrôlement en cours", 400);
    if (user.totpEnabled) return err("2FA déjà activée", 400);

    const plainSecret = decryptTotpSecret(user.totpSecret);
    const step = verifyTotpWithStep(validated.data.code, plainSecret);
    if (step === null) {
      return err("Code invalide. Vérifiez votre app d'authentification.", 400);
    }

    const { plain, hashed } = generateBackupCodes();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpEnabled: true,
        totpEnabledAt: new Date(),
        totpLastStep: step,
        totpBackupCodes: hashed,
      },
    });

    return ok({
      enabled: true,
      message: "2FA activée avec succès",
      backupCodes: plain,
      warning: "Notez ces codes maintenant : ils ne seront plus affichés. Chaque code n'est utilisable qu'une seule fois.",
    });
  } catch (e) {
    console.error("[2fa/verify-enroll]", e);
    return err("Erreur serveur", 500);
  }
}
