import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, rateLimit, validateBody } from "@/lib/apiHelpers";
import { BADGES } from "@/lib/gamification";
import { getGamification } from "@/lib/gamificationServer";

/**
 * POST /api/gamification/migrate — import one-shot de l'ancienne progression
 * localStorage vers la DB, pour les comptes créés avant la migration serveur.
 *
 * Garde-fous anti-triche :
 *  - ne s'applique QUE si l'état serveur est vierge (0 XP, 0 badge) ;
 *  - seuls les IDs de badges du catalogue sont acceptés ;
 *  - l'XP n'est jamais pris du client : il est recalculé comme la somme des
 *    XP des badges importés (l'XP « libre » des leçons/quiz locaux est perdu,
 *    c'est le prix d'un import non falsifiable).
 */

const inputSchema = z.object({
  badges: z.array(z.string().max(40)).max(BADGES.length),
  streak: z.number().int().min(0).max(3650).optional(),
});

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  if (!(await rateLimit(`gamification-migrate:${auth.user.userId}`, 3, 60 * 60 * 1000))) {
    return err("Trop de tentatives de migration.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const current = await getGamification(auth.user.userId);
  if (current.totalXp > 0 || current.badges.length > 0) {
    // Déjà migré ou progression serveur existante : no-op idempotent.
    return ok({ gamification: current, migrated: false });
  }

  const validIds = new Set(BADGES.map((b) => b.id));
  const badges = [...new Set(validated.data.badges)].filter((id) => validIds.has(id));
  const totalXp = badges.reduce(
    (sum, id) => sum + (BADGES.find((b) => b.id === id)?.xp ?? 0),
    0,
  );
  const streak = Math.min(validated.data.streak ?? 0, 365);

  const row = await prisma.userGamification.update({
    where: { userId: auth.user.userId },
    data: {
      totalXp,
      badges,
      streakCurrent: streak,
      streakBest: streak,
      lastActivityAt: streak > 0 ? new Date() : null,
    },
  });

  return ok({
    gamification: {
      totalXp: row.totalXp,
      badges: row.badges,
      streakCurrent: row.streakCurrent,
      streakBest: row.streakBest,
      quizPassCount: row.quizPassCount,
    },
    migrated: badges.length > 0,
  });
}
