import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth, ok, err, rateLimit, validateBody } from "@/lib/apiHelpers";
import { applyGamificationEvent } from "@/lib/gamificationServer";

/**
 * POST /api/gamification/event — applique un événement de gamification.
 *
 * Le client déclare un type d'événement, le serveur applique des règles
 * fixes (pas d'XP arbitraire). Les quiz/examens passent par
 * /api/quiz/submit qui enregistre aussi la tentative.
 */

const inputSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("login") }),
  z.object({ type: z.literal("module_visit") }),
  z.object({
    type: z.literal("lesson_complete"),
    module: z.enum(["fi", "co", "mm", "sd", "pp", "ai"]),
    lessonCount: z.number().int().min(0).max(50),
  }),
  z.object({ type: z.literal("pro_activated") }),
]);

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("status" in auth) return auth;

  if (!(await rateLimit(`gamification:${auth.user.userId}`, 120, 60 * 60 * 1000))) {
    return err("Trop d'événements, réessaie plus tard.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const { state, newBadges } = await applyGamificationEvent(auth.user.userId, validated.data);
  return ok({ gamification: state, newBadges });
}
