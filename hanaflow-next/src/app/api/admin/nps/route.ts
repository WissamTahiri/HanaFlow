import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok } from "@/lib/apiHelpers";

/**
 * GET /api/admin/nps
 *
 * Stats NPS pour l'admin dashboard. Calcule :
 *  - Distribution des scores 0-10
 *  - Score NPS officiel : % promoters (9-10) - % detractors (0-6)
 *  - Total réponses
 *  - 20 derniers commentaires non-vides
 */
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const allResponses = await prisma.nPSResponse.findMany({
    orderBy: { createdAt: "desc" },
    take: 1000, // safety cap
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const total = allResponses.length;
  const distribution: Record<number, number> = {};
  for (let i = 0; i <= 10; i++) distribution[i] = 0;
  let promoters = 0;
  let detractors = 0;
  let passives = 0;
  for (const r of allResponses) {
    distribution[r.score] = (distribution[r.score] ?? 0) + 1;
    if (r.score >= 9) promoters++;
    else if (r.score <= 6) detractors++;
    else passives++;
  }
  const nps = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

  const recentComments = allResponses
    .filter((r) => r.comment && r.comment.trim().length > 0)
    .slice(0, 20);

  return ok({
    nps,
    total,
    promoters,
    passives,
    detractors,
    distribution,
    recentComments,
  });
}

export const dynamic = "force-dynamic";
