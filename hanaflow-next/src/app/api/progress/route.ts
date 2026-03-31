import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err } from "@/lib/apiHelpers";

const VALID_MODULES = ["fi", "co", "mm", "sd", "hcm", "pp"];

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const progress = await prisma.userProgress.findMany({
    where: { userId: auth.user.userId },
    orderBy: { visitedAt: "asc" },
    select: { module: true, visitedAt: true },
  });

  return ok({ progress });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const module = (body?.module as string)?.toLowerCase();

  if (!module || !VALID_MODULES.includes(module)) {
    return err("Module invalide", 400);
  }

  await prisma.userProgress.upsert({
    where: { userId_module: { userId: auth.user.userId, module } },
    create: { userId: auth.user.userId, module },
    update: { visitedAt: new Date() },
  });

  return ok({ message: "Progression enregistrée", module });
}
