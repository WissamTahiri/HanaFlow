import { NextRequest } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, validateBody } from "@/lib/apiHelpers";
import { verifyTotp } from "@/lib/totp";

const schema = z.object({
  password: z.string().min(1),
  code: z.string().trim().min(6).max(8),
});

/**
 * Désactive la 2FA. Demande mot de passe ET un code TOTP valide
 * pour éviter qu'un attaquant qui aurait un access token désactive la 2FA.
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
    });
    if (!user) return err("Utilisateur introuvable", 404);
    if (!user.totpEnabled || !user.totpSecret) return err("2FA non activée", 400);

    const validPassword = await argon2.verify(user.passwordHash, validated.data.password);
    if (!validPassword) return err("Mot de passe incorrect", 400);

    if (!verifyTotp(validated.data.code, user.totpSecret)) {
      return err("Code 2FA invalide", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { totpSecret: null, totpEnabled: false, totpEnabledAt: null },
    });

    return ok({ message: "2FA désactivée" });
  } catch (e) {
    console.error("[2fa/disable]", e);
    return err("Erreur serveur", 500);
  }
}
