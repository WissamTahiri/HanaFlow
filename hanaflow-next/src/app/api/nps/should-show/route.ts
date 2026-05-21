import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok } from "@/lib/apiHelpers";

/**
 * GET /api/nps/should-show
 *
 * Décide côté serveur si on doit afficher le prompt NPS au user courant.
 * Évite de leaker dans le bundle client les règles (J+7 mini d'usage,
 * 90j de cooldown entre prompts).
 *
 * Renvoie { show: boolean }.
 */
const COOLDOWN_DAYS = 90;
const MIN_USAGE_DAYS = 7;

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.user.userId },
    select: { createdAt: true },
  });
  if (!user) return ok({ show: false });

  const accountAgeMs = Date.now() - user.createdAt.getTime();
  const accountAgeDays = accountAgeMs / (24 * 60 * 60 * 1000);
  if (accountAgeDays < MIN_USAGE_DAYS) return ok({ show: false });

  const lastResponse = await prisma.nPSResponse.findFirst({
    where: { userId: auth.user.userId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (!lastResponse) return ok({ show: true });

  const sinceLast = (Date.now() - lastResponse.createdAt.getTime()) / (24 * 60 * 60 * 1000);
  return ok({ show: sinceLast >= COOLDOWN_DAYS });
}

export const dynamic = "force-dynamic";
