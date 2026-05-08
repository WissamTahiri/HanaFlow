import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, validateBody } from "@/lib/apiHelpers";
import { verifyTotp } from "@/lib/totp";

const schema = z.object({
  code: z.string().trim().min(6).max(8),
});

/**
 * Confirme l'enrôlement 2FA : vérifie le 1er code TOTP, active totpEnabled.
 */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

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

    if (!verifyTotp(validated.data.code, user.totpSecret)) {
      return err("Code invalide. Vérifiez votre app d'authentification.", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { totpEnabled: true, totpEnabledAt: new Date() },
    });

    return ok({ enabled: true, message: "2FA activée avec succès" });
  } catch (e) {
    console.error("[2fa/verify-enroll]", e);
    return err("Erreur serveur", 500);
  }
}
