import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, validateBody } from "@/lib/apiHelpers";

const redeemSchema = z.object({
  code: z.string().trim().min(1).toUpperCase(),
});

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(redeemSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const promoCode = await prisma.promoCode.findUnique({
    where: { code: validated.data.code },
  });

  if (!promoCode || !promoCode.isActive) return err("Code invalide ou expiré", 400);
  if (promoCode.expiresAt && promoCode.expiresAt < new Date()) return err("Code expiré", 400);
  if (promoCode.usageLimit !== null && promoCode.usageCount >= promoCode.usageLimit) {
    return err("Ce code a atteint sa limite d'utilisation", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: auth.user.userId } });
  if (!user) return err("Utilisateur introuvable", 404);
  if (user.isPro) return err("Tu es déjà Pro !", 400);

  await prisma.$transaction([
    prisma.user.update({ where: { id: auth.user.userId }, data: { isPro: true } }),
    prisma.promoCode.update({ where: { id: promoCode.id }, data: { usageCount: { increment: 1 } } }),
  ]);

  return ok({ message: "Code activé ! Tu es maintenant Pro." });
}
