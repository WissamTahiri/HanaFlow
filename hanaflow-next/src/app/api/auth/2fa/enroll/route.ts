import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err } from "@/lib/apiHelpers";
import { generateTotpSecret, buildOtpAuthQrDataUrl } from "@/lib/totp";

/**
 * Initie l'enrôlement 2FA : génère un secret TOTP éphémère, le stocke en BDD
 * (mais totpEnabled reste false jusqu'à la vérification du premier code).
 */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.userId },
      select: { id: true, email: true, totpEnabled: true },
    });
    if (!user) return err("Utilisateur introuvable", 404);
    if (user.totpEnabled) return err("La 2FA est déjà activée. Désactivez-la d'abord pour la régénérer.", 400);

    const secret = generateTotpSecret();
    const qrDataUrl = await buildOtpAuthQrDataUrl(user.email, secret);

    await prisma.user.update({
      where: { id: user.id },
      data: { totpSecret: secret, totpEnabled: false, totpEnabledAt: null },
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
