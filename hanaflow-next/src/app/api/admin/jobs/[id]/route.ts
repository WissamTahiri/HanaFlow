import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, err, ok, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const patchSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  companyName: z.string().max(150).nullable().optional(),
  moduleCode: z.enum(["FI", "CO", "MM", "SD", "PP", "AI"]).nullable().optional(),
  seniority: z.enum(["junior", "confirmed", "senior"]).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  workMode: z.enum(["remote", "hybrid", "onsite"]).nullable().optional(),
  contractType: z.enum(["cdi", "cdd", "freelance"]).nullable().optional(),
  description: z.string().min(20).max(5000).optional(),
  externalUrl: z.string().url().max(2000).nullable().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const jobId = parseInt(id, 10);
  if (!Number.isFinite(jobId)) return err("ID invalide", 400);

  const body = await req.json().catch(() => null);
  const validated = validateBody(patchSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { expiresAt, ...rest } = validated.data;

  try {
    const updated = await prisma.jobListing.update({
      where: { id: jobId },
      data: { ...rest, ...(expiresAt !== undefined ? { expiresAt: expiresAt ? new Date(expiresAt) : null } : {}) },
    });

    await logAudit({
      actor: auth.user,
      action: "job.update",
      targetType: "job_listing",
      targetId: jobId,
      metadata: { changes: Object.keys(validated.data) },
      req,
    });

    return ok({ job: updated });
  } catch {
    return err("Annonce introuvable", 404);
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const jobId = parseInt(id, 10);
  if (!Number.isFinite(jobId)) return err("ID invalide", 400);

  try {
    await prisma.jobListing.delete({ where: { id: jobId } });
    await logAudit({ actor: auth.user, action: "job.delete", targetType: "job_listing", targetId: jobId, req });
    return ok({ message: "Annonce supprimée" });
  } catch {
    return err("Annonce introuvable", 404);
  }
}
