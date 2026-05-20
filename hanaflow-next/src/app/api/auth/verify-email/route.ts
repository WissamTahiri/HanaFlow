import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import { validateBody, err, ok, rateLimit, getClientIp } from "@/lib/apiHelpers";

const schema = z.object({
  token: z.string().min(16).max(256),
});

/**
 * Consomme un token de vérification d'email. À usage unique.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!(await rateLimit(`verify-email:${ip}`, 20, 60 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 1 heure.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(schema, body);
  if (!validated.success) return err(validated.error, 400);

  const tokenHash = hashToken(validated.data.token);

  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, emailVerifiedAt: true } } },
  });

  if (!record) return err("Lien invalide ou expiré", 400);
  if (record.expiresAt < new Date()) {
    return err("Lien expiré — demande un nouveau lien depuis ton profil.", 400);
  }

  // Idempotent : si déjà vérifié, on supprime juste le token et on renvoie 200.
  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } }),
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerifiedAt: record.user.emailVerifiedAt ?? new Date() },
    }),
  ]);

  return ok({ message: "Email confirmé ✓", verified: true });
}
