import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, rateLimit, validateBody } from "@/lib/apiHelpers";
import { applyGamificationEvent } from "@/lib/gamificationServer";

/**
 * POST /api/quiz/submit — enregistre une tentative de quiz de chapitre ou de
 * simulateur d'examen, puis applique l'événement de gamification associé
 * (XP + badges) côté serveur. Une seule requête depuis le client.
 */

const inputSchema = z.object({
  moduleCode: z.enum(["fi", "co", "mm", "sd", "pp", "ai"]),
  kind: z.enum(["quiz", "exam"]),
  /** ID du chapitre pour kind=quiz (ex: "ch3"). */
  chapterId: z.string().max(20).optional(),
  /** Score en pourcentage 0-100. */
  score: z.number().int().min(0).max(100),
  questionsTotal: z.number().int().min(1).max(200),
});

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  if (!(await rateLimit(`quiz-submit:${auth.user.userId}`, 60, 60 * 60 * 1000))) {
    return err("Trop de soumissions, réessaie plus tard.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { moduleCode, kind, chapterId, score, questionsTotal } = validated.data;

  const attempt = await prisma.quizAttempt.create({
    data: { userId: auth.user.userId, moduleCode, kind, chapterId: chapterId ?? null, score, questionsTotal },
    select: { id: true, attemptedAt: true },
  });

  const { state, newBadges } = await applyGamificationEvent(
    auth.user.userId,
    kind === "quiz"
      ? { type: "quiz_pass", scorePct: score }
      : { type: "exam_complete", module: moduleCode, passed: score >= 65 },
  );

  return ok({ attempt, gamification: state, newBadges });
}
