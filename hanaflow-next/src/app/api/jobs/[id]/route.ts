import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err, ok } from "@/lib/apiHelpers";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const jobId = parseInt(id, 10);
  if (!Number.isFinite(jobId)) return err("ID invalide", 400);

  const job = await prisma.jobListing.findFirst({
    where: {
      id: jobId,
      isPublished: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: {
      id: true, title: true, companyName: true, moduleCode: true, seniority: true,
      location: true, workMode: true, contractType: true, description: true,
      isFeatured: true, createdAt: true,
    },
  });
  if (!job) return err("Annonce introuvable", 404);

  return ok({ job });
}

export const dynamic = "force-dynamic";
