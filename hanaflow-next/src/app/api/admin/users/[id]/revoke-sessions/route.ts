import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) return err("ID invalide", 400);

  try {
    const result = await prisma.refreshToken.deleteMany({ where: { userId } });

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
