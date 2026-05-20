import { test, expect } from "@playwright/test";
import { hashToken } from "../src/lib/auth";
import { makeUser, deleteUserByEmail, prisma } from "./helpers/user";
import crypto from "crypto";

test.describe("password reset flow", () => {
  const u = makeUser("reset");

  test.beforeAll(async ({ request }) => {
    // Créer le user via l'API publique
    const res = await request.post("/api/auth/register", {
      data: { name: u.name, email: u.email, password: u.password },
    });
    expect(res.ok()).toBeTruthy();
  });

  test.afterAll(async () => {
    await deleteUserByEmail(u.email);
  });

  test("forgot → reset → login avec nouveau mdp", async ({ page, request }) => {
    // 1) Demande de reset
    const forgotRes = await request.post("/api/auth/forgot-password", {
      data: { email: u.email },
    });
    expect(forgotRes.ok()).toBeTruthy();

    // 2) Récupère le token brut : on injecte un token connu en DB pour pouvoir
    //    le réutiliser (le `forgot` envoie un email avec un raw token qu'on ne
    //    peut pas intercepter sans serveur SMTP de test).
    //    On supprime le token réel et on en pose un nous-mêmes.
    const user = await prisma.user.findUnique({ where: { email: u.email.toLowerCase() } });
    expect(user).not.toBeNull();
    await prisma.passwordResetToken.deleteMany({ where: { userId: user!.id } });

    const rawToken = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: user!.id,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    // 3) Reset via la page
    await page.goto(`/reset-password?token=${rawToken}`);
    await page.getByLabel(/nouveau mot de passe/i).fill("NewPwd1234!");
    await page.getByLabel(/confirmer/i).fill("NewPwd1234!");
    await page.getByRole("button", { name: /définir/i }).click();
    await expect(page.getByText(/mis à jour/i)).toBeVisible({ timeout: 5000 });

    // 4) Login avec le nouveau mdp
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(u.email);
    await page.getByLabel(/mot de passe/i).fill("NewPwd1234!");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("rejette un token déjà utilisé", async ({ request }) => {
    const user = await prisma.user.findUnique({ where: { email: u.email.toLowerCase() } });
    const rawToken = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: user!.id,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        usedAt: new Date(), // déjà consommé
      },
    });

    const res = await request.post("/api/auth/reset-password", {
      data: { token: rawToken, password: "Another1234!" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch(/déjà utilisé/i);
  });
});
