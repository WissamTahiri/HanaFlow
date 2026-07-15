import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, err, ok } from "@/lib/apiHelpers";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const jobId = parseInt(id, 10);
  if (!Number.isFinite(jobId)) return err("ID invalide", 400);

  const applications = await prisma.jobApplication.findMany({
    where: { jobListingId: jobId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return ok({ applications });
}
