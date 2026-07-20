import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const createSchema = z.object({
  name: z.string().trim().min(2).max(150),
  seatLimit: z.number().int().min(1).max(500),
  ownerEmail: z.string().trim().email().max(255).transform((v) => v.toLowerCase()),
});

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("status" in auth) return auth;

  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { members: true } },
        members: {
          where: { role: "owner" },
          select: { user: { select: { name: true, email: true } } },
          take: 1,
        },
      },
    });
    return ok({ organizations });
  } catch {
    return err("Erreur serveur", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(createSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { data } = validated;

  const owner = await prisma.user.findUnique({ where: { email: data.ownerEmail } });
  if (!owner) {
    return err("Le futur propriétaire doit déjà avoir un compte HanaFlow (demande-lui de s'inscrire d'abord).", 400);
  }

  const existingMembership = await prisma.organizationMember.findUnique({ where: { userId: owner.id } });
  if (existingMembership) {
    return err("Cet utilisateur fait déjà partie d'une organisation.", 400);
  }

  try {
    const organization = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: data.name, seatLimit: data.seatLimit },
      });
      await tx.organizationMember.create({
        data: { organizationId: org.id, userId: owner.id, role: "owner" },
      });
      await tx.user.update({ where: { id: owner.id }, data: { isPro: true } });
      return org;
    });

    await logAudit({
      actor: auth.user,
      action: "org.create",
      targetType: "organization",
      targetId: organization.id,
      metadata: { name: organization.name, ownerEmail: data.ownerEmail, seatLimit: data.seatLimit },
      req,
    });

    return ok({ organization }, 201);
  } catch {
    return err("Erreur serveur", 500);
  }
}
