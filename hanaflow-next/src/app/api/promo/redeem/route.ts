import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, validateBody, rateLimit, getClientIp } from "@/lib/apiHelpers";
import { getPublicSettings } from "@/lib/settings";
import { sendEmail, templates } from "@/lib/email";

const redeemSchema = z.object({
  code: z.string().trim().min(1).toUpperCase(),
});

export async function POST(req: NextRequest) {
  const settings = await getPublicSettings();
  if (!settings.promoCodesEnabled) {
    return err("Les codes promo sont temporairement désactivés.", 403);
  }

  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  // Anti-brute-force des codes promo : 8 tentatives / IP / 15 min,
  // 5 tentatives / user / heure (le code uppercase est devinable par dictionnaire).
  const ip = getClientIp(req);
  if (!(await rateLimit(`promo:ip:${ip}`, 8, 15 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 15 minutes.", 429);
  }
  if (!(await rateLimit(`promo:user:${auth.user.userId}`, 5, 60 * 60 * 1000))) {
    return err("Trop de tentatives sur ce compte, réessaie dans 1 heure.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(redeemSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const promoCode = await prisma.promoCode.findUnique({
    where: { code: validated.data.code },
  });

  if (!promoCode || !promoCode.isActive) return err("Code invalide ou expiré", 400);
  if (promoCode.expiresAt && promoCode.expiresAt < new Date()) return err("Code expiré", 400);

  const user = await prisma.user.findUnique({ where: { id: auth.user.userId } });
  if (!user) return err("Utilisateur introuvable", 404);
  if (user.isPro) return err("Tu es déjà Pro !", 400);

  // Incrémentation atomique avec garde sur usageLimit (résistante aux courses).
  const updateWhere: {
    id: number;
    isActive: boolean;
    usageCount?: { lt: number };
  } = { id: promoCode.id, isActive: true };
  if (promoCode.usageLimit !== null) {
    updateWhere.usageCount = { lt: promoCode.usageLimit };
  }

  const result = await prisma.promoCode.updateMany({
    where: updateWhere,
    data: { usageCount: { increment: 1 } },
  });

  if (result.count === 0) {
    return err("Ce code a atteint sa limite d'utilisation", 400);
  }

  // Si l'activation Pro échoue, on rollback l'incrément pour ne pas brûler un usage.
  try {
    await prisma.user.update({ where: { id: auth.user.userId }, data: { isPro: true } });
  } catch (e) {
    await prisma.promoCode
      .update({ where: { id: promoCode.id }, data: { usageCount: { decrement: 1 } } })
      .catch(() => {});
    throw e;
  }

  const tpl = templates.proActivated(user.name);
  void sendEmail({ to: user.email, ...tpl });

  return ok({ message: "Code activé ! Tu es maintenant Pro." });
}
