import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  newOwnerUserId: z.number().int(),
});

/**
 * Transfère la propriété d'une organisation à un membre existant. Seule voie
 * de récupération si l'owner doit être supprimé/retiré — sans ça,
 * `requireOrgOwner` ne retrouve plus jamais personne pour gérer l'équipe
 * (voir garde dans admin/users/[id] DELETE).
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const orgId = parseInt(id, 10);
  if (!Number.isFinite(orgId)) return err("ID invalide", 400);

  const body = await req.json().catch(() => null);
  const validated = validateBody(schema, body);
  if (!validated.success) return err(validated.error, 400);
  const { newOwnerUserId } = validated.data;

  const newOwner = await prisma.organizationMember.findUnique({ where: { userId: newOwnerUserId } });
  if (!newOwner || newOwner.organizationId !== orgId) {
    return err("Ce compte ne fait pas partie de cette organisation.", 400);
  }
  if (newOwner.role === "owner") return err("Ce membre est déjà propriétaire.", 400);

  await prisma.$transaction([
    prisma.organizationMember.updateMany({
      where: { organizationId: orgId, role: "owner" },
      data: { role: "member" },
    }),
    prisma.organizationMember.update({
      where: { userId: newOwnerUserId },
      data: { role: "owner" },
    }),
  ]);

  await logAudit({
    actor: auth.user,
    action: "org.update",
    targetType: "organization",
    targetId: orgId,
    metadata: { transferOwnerTo: newOwnerUserId },
    req,
  });

  return ok({ message: "Propriété transférée." });
}
