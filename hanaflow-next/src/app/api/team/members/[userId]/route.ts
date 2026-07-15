import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOrgOwner, ok, err } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ userId: string }> }) {
  const auth = await requireOrgOwner(req);
  if ("status" in auth) return auth;

  const { userId } = await ctx.params;
  const targetUserId = parseInt(userId, 10);
  if (!Number.isFinite(targetUserId)) return err("ID invalide", 400);

  const member = await prisma.organizationMember.findUnique({ where: { userId: targetUserId } });
  if (!member || member.organizationId !== auth.organizationId) {
    return err("Ce membre ne fait pas partie de ton organisation.", 404);
  }
  if (member.role === "owner") {
    return err("Impossible de retirer le propriétaire de l'équipe.", 400);
  }

  await prisma.$transaction([
    prisma.organizationMember.delete({ where: { userId: targetUserId } }),
    prisma.user.update({ where: { id: targetUserId }, data: { isPro: false } }),
  ]);

  await logAudit({
    actor: auth.user,
    action: "org.member.remove",
    targetType: "organization",
    targetId: auth.organizationId,
    metadata: { removedUserId: targetUserId },
    req,
  });

  return ok({ message: "Membre retiré de l'équipe." });
}
