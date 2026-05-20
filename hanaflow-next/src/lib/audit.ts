import type { NextRequest } from "next/server";
import { prisma } from "./prisma";
import type { JwtPayload } from "./auth";
import { getClientIp } from "./apiHelpers";

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

// Limites : ces seuils protègent à la fois la lisibilité de l'audit et la DB.
// Un bulk de 500 user IDs sérialisé reste ~6 KB, en-dessous de la limite — mais
// les metadata arbitraires sont coupées avant insertion.
const MAX_METADATA_BYTES = 8 * 1024; // 8 KB par entrée
const MAX_ARRAY_LEN = 100; // tronque les arrays au-delà
const MAX_STRING_LEN = 2000; // tronque les strings au-delà

/**
 * Sanitise et borne la taille de metadata avant insertion en DB.
 *  - Strings : coupées à MAX_STRING_LEN avec suffixe "…(N more chars)"
 *  - Arrays : tronquées à MAX_ARRAY_LEN avec un dernier élément "+N more"
 *  - Si la sérialisation dépasse MAX_METADATA_BYTES, on remplace par un stub
 *    qui résume le contenu sans le détailler.
 */
function sanitizeMetadata(meta: Record<string, unknown>): Record<string, unknown> {
  const truncate = (val: unknown): unknown => {
    if (typeof val === "string") {
      if (val.length > MAX_STRING_LEN) {
        return val.slice(0, MAX_STRING_LEN) + `…(${val.length - MAX_STRING_LEN} more chars)`;
      }
      return val;
    }
    if (Array.isArray(val)) {
      if (val.length > MAX_ARRAY_LEN) {
        return [
          ...val.slice(0, MAX_ARRAY_LEN).map(truncate),
          `+${val.length - MAX_ARRAY_LEN} more`,
        ];
      }
      return val.map(truncate);
    }
    if (val && typeof val === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        out[k] = truncate(v);
      }
      return out;
    }
    return val;
  };

  const truncated = truncate(meta) as Record<string, unknown>;
  // Garde-fou final sur la taille sérialisée
  const json = JSON.stringify(truncated);
  if (json.length > MAX_METADATA_BYTES) {
    return {
      _truncated: true,
      _originalKeys: Object.keys(meta),
      _sizeBytes: json.length,
      _note: `metadata > ${MAX_METADATA_BYTES} bytes → contenu remplacé pour préserver la DB`,
    };
  }
  return truncated;
}

export async function logAudit({
  actor,
  action,
  targetType,
  targetId,
  metadata,
  req,
}: AuditEntry): Promise<void> {
  const ipAddress = req ? getClientIp(req) : null;

  try {
    await prisma.adminAuditLog.create({
      data: {
        actorId: actor.userId,
        actorEmail: actor.email,
        action,
        targetType: targetType ?? null,
        targetId: targetId !== undefined ? String(targetId) : null,
        metadata: metadata
          ? (sanitizeMetadata(metadata) as Parameters<typeof prisma.adminAuditLog.create>[0]["data"]["metadata"])
          : undefined,
        ipAddress,
      },
    });
  } catch (error) {
    // Audit log ne doit jamais bloquer une action admin — on log silencieusement
    console.error("[audit] Failed to write audit log:", error);
  }
}
