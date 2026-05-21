import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok } from "@/lib/apiHelpers";

/**
 * GET /api/admin/feedback
 *
 * Liste paginée des feedbacks pour l'admin inbox.
 * Query params : status (new/read/archived/all), page (1-based), pageSize.
 */
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "all";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20", 10)));

  const where = status !== "all" ? { status } : undefined;

  const [items, total, counts] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.feedback.count({ where }),
    prisma.feedback.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const statusCounts: Record<string, number> = { new: 0, read: 0, archived: 0 };
  counts.forEach((c) => {
    statusCounts[c.status] = c._count._all;
  });

  return ok({
    items,
    total,
    page,
    pageSize,
    statusCounts,
  });
}

export const dynamic = "force-dynamic";
