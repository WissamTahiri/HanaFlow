import type { NextRequest } from "next/server";
import { prisma } from "./prisma";
import type { JwtPayload } from "./auth";

export type AuditAction =
  | "user.update"
  | "user.delete"
  | "user.password_reset"
  | "user.export"
  | "user.impersonate"
  | "promo.create"
  | "promo.update"
  | "promo.delete"
  | "settings.update"
  | "auth.admin_login";

interface AuditEntry {
  actor: JwtPayload;
  action: AuditAction;
  targetType?: string;
  targetId?: string | number;
  metadata?: Record<string, unknown>;
  req?: NextRequest;
}

export async function logAudit({
  actor,
  action,
  targetType,
  targetId,
  metadata,
  req,
}: AuditEntry): Promise<void> {
  const ipAddress =
    req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req?.headers.get("x-real-ip") ??
    null;

  try {
    await prisma.adminAuditLog.create({
      data: {
        actorId: actor.userId,
        actorEmail: actor.email,
        action,
        targetType: targetType ?? null,
        targetId: targetId !== undefined ? String(targetId) : null,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        ipAddress,
      },
    });
  } catch (error) {
    // Audit log ne doit jamais bloquer une action admin — on log silencieusement
    console.error("[audit] Failed to write audit log:", error);
  }
}
