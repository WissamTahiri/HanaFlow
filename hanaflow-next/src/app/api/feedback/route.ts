import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  getAuthUser,
  rateLimit,
  getClientIp,
  err,
  ok,
  validateBody,
} from "@/lib/apiHelpers";

/**
 * POST /api/feedback
 *
 * Soumission d'un feedback via le widget flottant. Auth optionnelle :
 *  - Si user connecté, on enregistre userId.
 *  - Sinon, anonyme. On garde l'IP pour rate-limit.
 *
 * Rate-limit : 5 par heure par IP (anti-spam basique). Pas de captcha pour
 * V1 — si abus, on durcit ou on ajoute hCaptcha.
 */

const inputSchema = z
  .object({
    context: z.string().max(200).optional(),
    goodWhat: z.string().max(2000).optional(),
    improveWhat: z.string().max(2000).optional(),
    contactEmail: z.string().email().max(255).optional(),
  })
  .refine((d) => (d.goodWhat?.trim() || d.improveWhat?.trim()), {
    message: "Au moins un des deux champs doit être rempli",
  });

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!(await rateLimit(`feedback:ip:${ip}`, 5, 60 * 60 * 1000))) {
    return err("Trop de feedbacks depuis cette IP. Réessaie dans une heure.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const user = getAuthUser(req);

  await prisma.feedback.create({
    data: {
      userId: user?.userId ?? null,
      context: validated.data.context,
      goodWhat: validated.data.goodWhat?.trim() || null,
      improveWhat: validated.data.improveWhat?.trim() || null,
      contactEmail: validated.data.contactEmail || null,
      ipAddress: ip,
    },
  });

  return ok({ message: "Feedback enregistré. Merci !" });
}
