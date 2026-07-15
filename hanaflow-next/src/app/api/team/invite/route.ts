import { NextRequest } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import { requireOrgOwner, ok, err, validateBody, rateLimit } from "@/lib/apiHelpers";
import { sendEmail, templates } from "@/lib/email";
import { logAudit } from "@/lib/audit";

const inviteSchema = z.object({
  email: z.string().trim().email().max(255).transform((v) => v.toLowerCase()),
});

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

export async function POST(req: NextRequest) {
  const auth = await requireOrgOwner(req);
  if ("status" in auth) return auth;

  if (!(await rateLimit(`team-invite:${auth.user.userId}`, 20, 60 * 60 * 1000))) {
    return err("Trop d'invitations envoyées, réessaie dans 1 heure.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inviteSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { email } = validated.data;

  const organization = await prisma.organization.findUnique({
    where: { id: auth.organizationId },
    include: { _count: { select: { members: true, invites: true } } },
  });
  if (!organization) return err("Organisation introuvable", 404);
  if (!organization.isActive) return err("Cette organisation est désactivée.", 403);

  const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existingUser) {
    const alreadyMember = await prisma.organizationMember.findUnique({ where: { userId: existingUser.id } });
    if (alreadyMember) return err("Cette personne fait déjà partie d'une organisation.", 400);
  }

  // Comptage des sièges pris (membres + invitations en attente, hors celle
  // qu'on va remplacer pour cet email). Pas de garde atomique nécessaire ICI :
  // c'est une action manuelle du owner (un seul acteur). La vraie course
  // multi-client est côté acceptation (team/invite/accept/route.ts), qui elle
  // recompte dans une transaction Serializable.
  const pendingInvites = await prisma.organizationInvite.count({
    where: { organizationId: organization.id, acceptedAt: null, email: { not: email } },
  });
  if (organization._count.members + pendingInvites + 1 > organization.seatLimit) {
    return err(`Limite de ${organization.seatLimit} sièges atteinte.`, 400);
  }

  const raw = crypto.randomBytes(32).toString("hex");
  await prisma.$transaction([
    prisma.organizationInvite.deleteMany({ where: { organizationId: organization.id, email, acceptedAt: null } }),
    prisma.organizationInvite.create({
      data: {
        organizationId: organization.id,
        email,
        tokenHash: hashToken(raw),
        invitedBy: auth.user.userId,
        expiresAt: new Date(Date.now() + INVITE_TTL_MS),
      },
    }),
  ]);

  const inviteUrl = `${APP_URL}/team/join?token=${raw}`;
  void sendEmail({ to: email, ...templates.teamInvite(organization.name, inviteUrl) });

  await logAudit({
    actor: auth.user,
    action: "org.invite.send",
    targetType: "organization",
    targetId: organization.id,
    metadata: { email },
    req,
  });

  return ok({ message: "Invitation envoyée." });
}
