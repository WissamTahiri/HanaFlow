import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok } from "@/lib/apiHelpers";

/**
 * GET /api/quiz/attempts — historique des tentatives du user connecté.
 * Query params optionnels : ?module=fi&kind=exam&limit=20
 * Renvoie aussi le meilleur score par module × kind (pour les pages module).
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("status" in auth) return auth;

  const { searchParams } = new URL(req.url);
  const moduleCode = searchParams.get("module") ?? undefined;
  const kind = searchParams.get("kind") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

  const where = {
    userId: auth.user.userId,
    ...(moduleCode ? { moduleCode } : {}),
    ...(kind ? { kind } : {}),
  };

  const [attempts, best] = await Promise.all([
    prisma.quizAttempt.findMany({
      where,
      orderBy: { attemptedAt: "desc" },
      take: limit,
      select: { id: true, moduleCode: true, kind: true, chapterId: true, score: true, questionsTotal: true, attemptedAt: true },
    }),
    prisma.quizAttempt.groupBy({
      by: ["moduleCode", "kind"],
      where: { userId: auth.user.userId },
      _max: { score: true },
      _count: { id: true },
    }),
  ]);

  return ok({
    attempts,
    best: best.map((b) => ({ moduleCode: b.moduleCode, kind: b.kind, bestScore: b._max.score, attempts: b._count.id })),
  });
}
