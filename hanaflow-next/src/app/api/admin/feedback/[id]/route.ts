import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, err, ok, validateBody } from "@/lib/apiHelpers";

const patchSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});

/**
 * PATCH /api/admin/feedback/[id]
 *
 * Marque un feedback comme lu / archivé. Pas de delete pour garder
 * l'historique (utile pour les patterns long terme).
 */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const fbId = parseInt(id, 10);
  if (!Number.isFinite(fbId)) return err("ID invalide", 400);

  const body = await req.json().catch(() => null);
  const validated = validateBody(patchSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const updated = await prisma.feedback.update({
    where: { id: fbId },
    data: { status: validated.data.status },
  });

  return ok({ feedback: updated });
}
