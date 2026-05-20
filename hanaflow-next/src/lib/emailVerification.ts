import "server-only";
import crypto from "crypto";
import { prisma } from "./prisma";
import { hashToken } from "./auth";
import { sendEmail, templates } from "./email";

const VERIFY_TTL_MS = 48 * 60 * 60 * 1000; // 48h
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

/**
 * Émet un nouveau token de vérification d'email pour un user.
 * Invalide tous les tokens précédents. Envoie l'email (best-effort).
 */
export async function issueEmailVerification(user: { id: number; name: string; email: string }): Promise<void> {
  await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });

  const raw = crypto.randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + VERIFY_TTL_MS),
    },
  });

  const verifyUrl = `${APP_URL}/verify-email?token=${raw}`;
  const tpl = templates.emailVerification(user.name, verifyUrl);
  void sendEmail({ to: user.email, ...tpl });
}
