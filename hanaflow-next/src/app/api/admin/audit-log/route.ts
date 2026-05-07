import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") ?? "50")));
  const action = searchParams.get("action")?.trim();
  const actorId = searchParams.get("actorId")?.trim();
  const targetType = searchParams.get("targetType")?.trim();

  const where: Record<string, unknown> = {};
  if (action) where.action = action;
  if (actorId && /^\d+$/.test(actorId)) where.actorId = parseInt(actorId);
  if (targetType) where.targetType = targetType;

  try {
    const [entries, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.adminAuditLog.count({ where }),
    ]);

    return ok({
      entries: entries.map((e) => ({
        id: e.id,
        actorId: e.actorId,
        actorEmail: e.actorEmail,
        action: e.action,
        targetType: e.targetType,
        targetId: e.targetId,
        metadata: e.metadata,
        ipAddress: e.ipAddress,
        createdAt: e.createdAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return err("Erreur serveur", 500);
  }
}
