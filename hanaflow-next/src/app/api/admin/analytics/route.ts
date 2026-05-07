import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  try {
    const now = new Date();
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      proUsers,
      suspendedUsers,
      adminUsers,
      signupsLast7d,
      signupsLast30d,
      activePromoCodes,
      totalPromoCodes,
      moduleProgressGroups,
      activeSessions,
      recentSignups,
      progressByDay,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isPro: true } }),
      prisma.user.count({ where: { isSuspended: true } }),
      prisma.user.count({ where: { role: "admin" } }),
      prisma.user.count({ where: { createdAt: { gte: last7d } } }),
      prisma.user.count({ where: { createdAt: { gte: last30d } } }),
      prisma.promoCode.count({ where: { isActive: true } }),
      prisma.promoCode.count(),
      prisma.userProgress.groupBy({
        by: ["module"],
        _count: { module: true },
        orderBy: { _count: { module: "desc" } },
      }),
      prisma.refreshToken.count({ where: { expiresAt: { gt: now } } }),
      prisma.user.findMany({
        select: { id: true, name: true, email: true, isPro: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      // Signups par jour sur 14 derniers jours via SQL brut
      prisma.$queryRaw<Array<{ day: Date; count: bigint }>>`
        SELECT date_trunc('day', created_at)::date AS day, COUNT(*)::bigint AS count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '14 days'
        GROUP BY day
        ORDER BY day ASC
      `,
    ]);

    // Module heatmap normalisée
    const moduleStats = moduleProgressGroups.map((g) => ({
      module: g.module,
      visits: g._count.module,
    }));

    // Signups timeline (14 derniers jours, gaps remplis avec 0)
    const signupsTimeline: Array<{ day: string; count: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toISOString().slice(0, 10);
      const found = progressByDay.find(
        (r) => new Date(r.day).toISOString().slice(0, 10) === dayStr,
      );
      signupsTimeline.push({
        day: dayStr,
        count: found ? Number(found.count) : 0,
      });
    }

    return ok({
      users: {
        total: totalUsers,
        pro: proUsers,
        free: totalUsers - proUsers - suspendedUsers,
        suspended: suspendedUsers,
        admins: adminUsers,
        signupsLast7d,
        signupsLast30d,
      },
      promo: {
        total: totalPromoCodes,
        active: activePromoCodes,
      },
      sessions: {
        active: activeSessions,
      },
      modules: moduleStats,
      recentSignups: recentSignups.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        isPro: u.isPro,
        createdAt: u.createdAt.toISOString(),
      })),
      signupsTimeline,
    });
  } catch (e) {
    console.error("[admin/analytics]", e);
    return err("Erreur serveur", 500);
  }
}
