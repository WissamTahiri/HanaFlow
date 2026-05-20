import "server-only";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { hashToken } from "./auth";

export interface ServerUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isPro: boolean;
  isSuspended: boolean;
}

/**
 * Récupère l'utilisateur authentifié côté serveur à partir du cookie refreshToken.
 * Renvoie null si le cookie est absent, invalide, expiré, ou si l'user est suspendu.
 *
 * Note : on n'utilise pas l'access token (Authorization header) ici car il n'est
 * envoyé que pour les routes API et stocké côté client. Pour les Server Components,
 * seul le cookie refreshToken httpOnly est accessible.
 */
export async function getServerUser(): Promise<ServerUser | null> {
  let rawToken: string | undefined;
  try {
    const store = await cookies();
    rawToken = store.get("refreshToken")?.value;
  } catch {
    return null;
  }

  if (!rawToken) return null;

  try {
    const tokenHash = hashToken(rawToken);
    const stored = (await prisma.refreshToken.findFirst({
      where: { tokenHash, expiresAt: { gt: new Date() } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isPro: true,
            isSuspended: true,
          },
        },
      },
    })) as { user: ServerUser } | null;

    if (!stored?.user) return null;
    if (stored.user.isSuspended) return null;
    return stored.user;
  } catch {
    return null;
  }
}

export async function requireServerUser(): Promise<ServerUser> {
  const user = await getServerUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
