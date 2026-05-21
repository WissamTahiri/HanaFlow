import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  rateLimit,
  getClientIp,
  err,
  ok,
  validateBody,
} from "@/lib/apiHelpers";

/**
 * POST /api/nps
 *
 * Soumission d'une réponse au prompt NPS. Auth requise — pas d'NPS anonyme.
 * Un user peut soumettre plusieurs fois mais on cap à 1 / 30 jours via
 * rate-limit pour éviter le span.
 */

const inputSchema = z.object({
  score: z.number().int().min(0).max(10),
  comment: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const ip = getClientIp(req);
  // 1 soumission tous les 30j (largement)
  if (!(await rateLimit(`nps:user:${auth.user.userId}`, 1, 30 * 24 * 60 * 60 * 1000))) {
    return err("Tu as déjà soumis ton NPS récemment. Merci !", 429);
  }
  if (!(await rateLimit(`nps:ip:${ip}`, 5, 60 * 60 * 1000))) {
    return err("Trop de soumissions depuis cette IP.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  await prisma.nPSResponse.create({
    data: {
      userId: auth.user.userId,
      score: validated.data.score,
      comment: validated.data.comment?.trim() || null,
    },
  });

  return ok({ message: "Merci pour ton retour !" });
}
