import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const bulkSchema = z.object({
  userIds: z.array(z.number().int().positive()).min(1).max(500),
  action: z.enum(["pro", "unpro", "suspend", "unsuspend", "delete"]),
});

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(bulkSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const { userIds, action } = validated.data;

  // Empêche un admin d'agir sur lui-même via bulk
  const filtered = userIds.filter((id) => id !== auth.user.userId);
  const skippedSelf = filtered.length !== userIds.length;

  if (filtered.length === 0) {
    return err("Aucun utilisateur valide (vous ne pouvez pas vous inclure dans une action en masse)", 400);
  }

  try {
    let affected = 0;
    if (action === "pro" || action === "unpro") {
      const result = await prisma.user.updateMany({
        where: { id: { in: filtered } },
        data: { isPro: action === "pro" },
      });
      affected = result.count;
    } else if (action === "suspend" || action === "unsuspend") {
      const result = await prisma.user.updateMany({
        where: { id: { in: filtered } },
        data: { isSuspended: action === "suspend" },
      });
      affected = result.count;
      // Si suspension : invalider les sessions actives
      if (action === "suspend") {
        await prisma.refreshToken.deleteMany({ where: { userId: { in: filtered } } });
      }
    } else if (action === "delete") {
      const result = await prisma.user.deleteMany({ where: { id: { in: filtered } } });
      affected = result.count;
    }

    await logAudit({
      actor: auth.user,
      action: action === "delete" ? "user.delete" : "user.update",
      metadata: { bulk: true, action, userIds: filtered, affected, skippedSelf },
      req,
    });

    return ok({ affected, action, skippedSelf });
  } catch (e) {
    console.error("[admin/users/bulk]", e);
    return err("Erreur serveur", 500);
  }
}
