import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const patchSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),
  seatLimit: z.number().int().min(1).max(500).optional(),
  isActive: z.boolean().optional(),
});

function parseId(id: string) {
  const n = parseInt(id, 10);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const orgId = parseId(id);
  if (orgId === null) return err("ID invalide", 400);

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      members: {
        orderBy: { joinedAt: "asc" },
        select: {
          role: true,
          joinedAt: true,
          user: { select: { id: true, name: true, email: true, isPro: true, isSuspended: true } },
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

  return ok({ organization });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const orgId = parseId(id);
  if (orgId === null) return err("ID invalide", 400);

  const body = await req.json().catch(() => null);
  const validated = validateBody(patchSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { data } = validated;
  if (Object.keys(data).length === 0) return err("Aucun champ à mettre à jour", 400);

  try {
    const organization = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.update({ where: { id: orgId }, data });
      // Activer/désactiver une organisation doit synchroniser le Pro de ses
      // membres dans les deux sens (ex: client qui ne paie plus, puis
      // régularise) — cohérent avec l'invariant "isPro toujours à jour".
      if (data.isActive === false || data.isActive === true) {
        const memberIds = (
          await tx.organizationMember.findMany({ where: { organizationId: orgId }, select: { userId: true } })
        ).map((m) => m.userId);
        if (memberIds.length > 0) {
          await tx.user.updateMany({ where: { id: { in: memberIds } }, data: { isPro: data.isActive } });
        }
      }
      return org;
    });

    await logAudit({
      actor: auth.user,
      action: "org.update",
      targetType: "organization",
      targetId: orgId,
      metadata: { changes: data },
      req,
    });

    return ok({ organization });
  } catch {
    return err("Organisation introuvable", 404);
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const orgId = parseId(id);
  if (orgId === null) return err("ID invalide", 400);

  try {
    await prisma.$transaction(async (tx) => {
      const memberIds = (
        await tx.organizationMember.findMany({ where: { organizationId: orgId }, select: { userId: true } })
      ).map((m) => m.userId);
      if (memberIds.length > 0) {
        await tx.user.updateMany({ where: { id: { in: memberIds } }, data: { isPro: false } });
      }
      // Cascade Prisma supprime members/invites liés.
      await tx.organization.delete({ where: { id: orgId } });
    });

    await logAudit({
      actor: auth.user,
      action: "org.delete",
      targetType: "organization",
      targetId: orgId,
      req,
    });

    return ok({ message: "Organisation supprimée" });
  } catch {
    return err("Organisation introuvable", 404);
  }
}
