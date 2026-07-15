import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOrgOwner, ok, err } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

/**
 * Dashboard d'équipe pour le owner — uniquement des agrégats par membre
 * (score moyen, certificats obtenus, XP, dernière activité). Jamais le détail
 * des réponses individuelles d'un quiz : ça reste privé à chaque membre.
 */
export async function GET(req: NextRequest) {
  const auth = await requireOrgOwner(req);
  if ("status" in auth) return auth;

  const organization = await prisma.organization.findUnique({
    where: { id: auth.organizationId },
    include: {
      members: {
        orderBy: { joinedAt: "asc" },
        select: {
          role: true,
          joinedAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
      invites: {
        where: { acceptedAt: null },
        orderBy: { createdAt: "desc" },
        select: { id: true, email: true, expiresAt: true, createdAt: true },
      },
    },
  });
  if (!organization) return err("Organisation introuvable", 404);

  const memberIds = organization.members.map((m) => m.user.id);

  const [certCounts, quizAgg, gamification] = await Promise.all([
    prisma.completionCertificate.groupBy({
      by: ["userId"],
      where: { userId: { in: memberIds }, revokedAt: null },
      _count: { _all: true },
    }),
    prisma.quizAttempt.groupBy({
      by: ["userId"],
      where: { userId: { in: memberIds }, kind: "exam" },
      _avg: { score: true },
      _count: { _all: true },
    }),
    prisma.userGamification.findMany({
      where: { userId: { in: memberIds } },
      select: { userId: true, totalXp: true, lastActivityAt: true },
    }),
  ]);

  const certByUser = new Map(certCounts.map((c) => [c.userId, c._count._all]));
  const quizByUser = new Map(quizAgg.map((q) => [q.userId, { avg: q._avg.score, attempts: q._count._all }]));
  const gamByUser = new Map(gamification.map((g) => [g.userId, g]));

  const members = organization.members.map((m) => ({
    userId: m.user.id,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
    joinedAt: m.joinedAt,
    certificatesCount: certByUser.get(m.user.id) ?? 0,
    avgExamScore: Math.round(quizByUser.get(m.user.id)?.avg ?? 0),
    examAttempts: quizByUser.get(m.user.id)?.attempts ?? 0,
    xp: gamByUser.get(m.user.id)?.totalXp ?? 0,
    lastActivityAt: gamByUser.get(m.user.id)?.lastActivityAt ?? null,
  }));

  return ok({
    organization: {
      id: organization.id,
      name: organization.name,
      seatLimit: organization.seatLimit,
      isActive: organization.isActive,
      seatsUsed: organization.members.length + organization.invites.length,
    },
    members,
    pendingInvites: organization.invites,
  });
}
