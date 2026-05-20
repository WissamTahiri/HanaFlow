import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok } from "@/lib/apiHelpers";

/**
 * GET /api/certificates
 *
 * Liste les certificats de completion de l'utilisateur courant, triés du
 * plus récent au plus ancien.
 */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const certs = await prisma.completionCertificate.findMany({
    where: { userId: auth.user.userId },
    orderBy: { issuedAt: "desc" },
  });

  return ok({ certificates: certs });
}

// On force la dynamicité — un cert peut être révoqué entre deux appels,
// pas question de servir du cache.
export const dynamic = "force-dynamic";
