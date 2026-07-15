import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, err, ok, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const patchSchema = z.object({
  status: z.enum(["new", "reviewed", "contacted", "rejected"]),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const appId = parseInt(id, 10);
  if (!Number.isFinite(appId)) return err("ID invalide", 400);

  const body = await req.json().catch(() => null);
  const validated = validateBody(patchSchema, body);
  if (!validated.success) return err(validated.error, 400);

  try {
    const application = await prisma.jobApplication.update({
      where: { id: appId },
      data: { status: validated.data.status },
    });

    await logAudit({
      actor: auth.user,
      action: "job.application.status_update",
      targetType: "job_application",
      targetId: appId,
      metadata: { status: validated.data.status },
      req,
    });

    return ok({ application });
  } catch {
    return err("Candidature introuvable", 404);
  }
}
