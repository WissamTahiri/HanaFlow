import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type E2EUser = {
  email: string;
  password: string;
  name: string;
};

/**
 * Génère un user fictif unique pour un test. Préfix `e2e-` pour identifier
 * facilement les comptes test en DB et faire un cleanup global si besoin.
 */
export function makeUser(role: string = "test"): E2EUser {
  const id = randomUUID().slice(0, 8);
  return {
    email: `e2e-${role}-${id}@hanaflow.test`,
    password: "Test1234!",
    name: `E2E ${role} ${id}`,
  };
}

/**
 * Supprime un user (et toute sa cascade : sessions, progress, tokens) par email.
 * À appeler dans afterEach. Idempotent — pas d'erreur si l'user n'existe pas.
 */
export async function deleteUserByEmail(email: string): Promise<void> {
  await prisma.user.deleteMany({ where: { email: email.toLowerCase() } });
}

/**
 * Marque un user comme Pro directement en DB. Sert à tester les flows Pro
 * sans avoir à passer par un code promo.
 */
export async function promoteToPro(email: string): Promise<void> {
  await prisma.user.updateMany({
    where: { email: email.toLowerCase() },
    data: { isPro: true },
  });
}

/**
 * Récupère le token de reset password généré pour un user. Utile pour les tests
 * du flow forgot-password sans avoir à parser un email.
 */
export async function getLatestResetToken(userEmail: string): Promise<{ tokenHash: string } | null> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail.toLowerCase() },
    select: { id: true },
  });
  if (!user) return null;
  return prisma.passwordResetToken.findFirst({
    where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: { tokenHash: true },
  });
}

export { prisma };
