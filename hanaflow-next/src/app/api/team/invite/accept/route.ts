import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import { requireAuth, ok, err, validateBody, rateLimit, getClientIp } from "@/lib/apiHelpers";

const schema = z.object({
  token: z.string().min(16).max(256),
});

/** Conflit d'écriture / deadlock sérialisable → rejouable une fois. */
function isWriteConflict(e: unknown): boolean {
  return !!e && typeof e === "object" && (e as { code?: string }).code === "P2034";
}

/**
 * Accepte une invitation d'équipe. L'utilisateur doit être connecté avec
 * l'adresse email exacte à laquelle l'invitation a été envoyée (pas de
 * création de compte automatique : s'il n'a pas de compte, il doit d'abord
 * s'inscrire avec cet email puis revenir consommer le lien).
 */
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("status" in auth) return auth;

  const ip = getClientIp(req);
  if (!(await rateLimit(`team-invite-accept:${ip}`, 20, 60 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 1 heure.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(schema, body);
  if (!validated.success) return err(validated.error, 400);

  const tokenHash = hashToken(validated.data.token);
  const invite = await prisma.organizationInvite.findUnique({
    where: { tokenHash },
    include: { organization: true },
  });

  if (!invite || invite.acceptedAt) return err("Lien d'invitation invalide ou déjà utilisé.", 400);
  if (invite.expiresAt < new Date()) return err("Cette invitation a expiré — demande-en une nouvelle.", 400);
  if (invite.email.toLowerCase() !== auth.user.email.toLowerCase()) {
    return err(`Ce lien est associé à ${invite.email} — connecte-toi avec cette adresse.`, 403);
  }
  if (!invite.organization.isActive) return err("Cette organisation est désactivée.", 403);

  const existingMembership = await prisma.organizationMember.findUnique({ where: { userId: auth.user.userId } });
  if (existingMembership) return err("Tu fais déjà partie d'une organisation.", 400);

  // Le comptage des sièges et la création du membre sont dans UNE transaction
  // SERIALIZABLE (+ retry sur conflit) : sans ça, deux invités qui acceptent
  // au même instant sur le dernier siège disponible peuvent tous les deux
  // passer le check avant que l'un des deux n'écrive, et l'org dépasse son
  // seatLimit.
  let seatsFull = false;
  for (let attempt = 0; ; attempt++) {
    try {
      await prisma.$transaction(
        async (tx) => {
          const membersCount = await tx.organizationMember.count({ where: { organizationId: invite.organizationId } });
          if (membersCount >= invite.organization.seatLimit) {
            seatsFull = true;
            return;
          }
          await tx.organizationMember.create({
            data: { organizationId: invite.organizationId, userId: auth.user.userId, role: "member" },
          });
          await tx.organizationInvite.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } });
          await tx.user.update({ where: { id: auth.user.userId }, data: { isPro: true } });
        },
        { isolationLevel: "Serializable" },
      );
      break;
    } catch (e) {
      if (attempt === 0 && isWriteConflict(e)) continue;
      throw e;
    }
  }

  if (seatsFull) return err("Cette organisation a atteint sa limite de sièges.", 400);

  return ok({ message: `Bienvenue dans l'équipe ${invite.organization.name} !`, organizationName: invite.organization.name });
}
