import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody, verifyAdminPassword, rateLimit } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const bulkSchema = z.object({
  userIds: z.array(z.number().int().positive()).min(1).max(500),
  action: z.enum(["pro", "unpro", "suspend", "unsuspend", "delete"]),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(bulkSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const { userIds, action } = validated.data;

  // Step-up auth obligatoire pour TOUTE action bulk : même `pro`/`unpro` peuvent
  // affecter des centaines de comptes en un appel (fraude/abus si admin compromis).
  // Rate-limité comme /2fa/disable pour empêcher un access token admin volé de
  // brute-forcer le mot de passe via X-Confirm-Password.
  if (!(await rateLimit(`admin-stepup:${auth.user.userId}`, 5, 15 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 15 minutes.", 429);
  }
  const stepUpOk = await verifyAdminPassword(req, auth.user.userId);
  if (!stepUpOk) return err("Re-saisie du mot de passe administrateur requise", 401);

  // Empêche un admin d'agir sur lui-même via bulk
  let filtered = userIds.filter((id) => id !== auth.user.userId);
  const skippedSelf = filtered.length !== userIds.length;

  // Pour les actions destructives ou bloquantes (delete, suspend), exclure tous les
  // autres administrateurs : un admin ne peut pas supprimer/suspendre un autre admin
  // en masse — il doit d'abord le rétrograder individuellement.
  const destructive = action === "delete" || action === "suspend";
  let skippedAdmins = 0;
  if (destructive && filtered.length > 0) {
    const adminMatches = (await prisma.user.findMany({
      where: { id: { in: filtered }, role: "admin" },
      select: { id: true },
    })) as Array<{ id: number }>;
    const adminIdSet = new Set(adminMatches.map((u) => u.id));
    const before = filtered.length;
    filtered = filtered.filter((id) => !adminIdSet.has(id));
    skippedAdmins = before - filtered.length;
  }

  // Pour delete uniquement : exclure les propriétaires d'organisation B2B, sinon
  // la cascade Prisma supprime leur OrganizationMember et l'organisation devient
  // orpheline (requireOrgOwner ne trouve plus de owner) — même garde-fou que
  // DELETE /api/admin/users/[id] ligne ~165.
  let skippedOrgOwners = 0;
  if (action === "delete" && filtered.length > 0) {
    const ownerMatches = (await prisma.organizationMember.findMany({
      where: { userId: { in: filtered }, role: "owner" },
      select: { userId: true },
    })) as Array<{ userId: number }>;
    const ownerIdSet = new Set(ownerMatches.map((m) => m.userId));
    const before = filtered.length;
    filtered = filtered.filter((id) => !ownerIdSet.has(id));
    skippedOrgOwners = before - filtered.length;
  }

  if (filtered.length === 0) {
    return err(
      "Aucun utilisateur valide (vous ne pouvez pas vous inclure, cibler un autre administrateur via une action destructive en masse, ni supprimer un propriétaire d'organisation sans transfert préalable)",
      400,
    );
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
      metadata: { bulk: true, action, userIds: filtered, affected, skippedSelf, skippedAdmins, skippedOrgOwners },
      req,
    });

    return ok({ affected, action, skippedSelf, skippedAdmins, skippedOrgOwners });
  } catch (e) {
    console.error("[admin/users/bulk]", e);
    return err("Erreur serveur", 500);
  }
}
