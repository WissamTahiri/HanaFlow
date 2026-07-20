import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) return err("ID invalide", 400);

  try {
    const [result] = await prisma.$transaction([
      prisma.refreshToken.deleteMany({ where: { userId } }),
      // Invalide aussi les access tokens JWT déjà émis (voir checkTokenFreshness
      // dans apiHelpers) : supprimer les refresh tokens seuls ne coupe que le
      // renouvellement futur, pas l'access token en cours de validité.
      prisma.user.update({
        where: { id: userId },
        data: { sessionsRevokedAt: new Date() },
      }),
    ]);

    await logAudit({
      actor: auth.user,
      action: "user.update",
      targetType: "user",
      targetId: userId,
      metadata: { revokedSessions: result.count },
      req,
    });

    return ok({ revoked: result.count });
  } catch (e) {
    console.error("[revoke-sessions]", e);
    return err("Erreur serveur", 500);
  }
}
