import { test, expect } from "@playwright/test";
import { generateCurrentCode } from "../src/lib/totp";
import { decryptTotpSecret } from "../src/lib/totpCrypto";
import { makeUser, deleteUserByEmail, prisma } from "./helpers/user";

test.describe("2FA enroll → login → backup code", () => {
  const u = makeUser("2fa");

  test.beforeAll(async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: { name: u.name, email: u.email, password: u.password },
    });
    expect(res.ok()).toBeTruthy();
  });

  test.afterAll(async () => {
    await deleteUserByEmail(u.email);
  });

  test("enroll 2FA et login avec code TOTP", async ({ page, request }) => {
    // Login pour obtenir le token
    const loginRes = await request.post("/api/auth/login", {
      data: { email: u.email, password: u.password },
    });
    const { token } = await loginRes.json();

    // Démarrer l'enroll
    const enrollRes = await request.post("/api/auth/2fa/enroll", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { secret } = await enrollRes.json();
    expect(secret).toBeTruthy();

    // Confirmer avec un code valide
    const code = generateCurrentCode(secret);
    const verifyRes = await request.post("/api/auth/2fa/verify-enroll", {
      headers: { Authorization: `Bearer ${token}` },
      data: { code },
    });
    const verifyBody = await verifyRes.json();
    expect(verifyBody.enabled).toBe(true);
    expect(verifyBody.backupCodes).toHaveLength(10);

    // Nouveau login : doit demander 2FA
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(u.email);
    await page.getByLabel(/mot de passe/i).fill(u.password);
    await page.getByRole("button", { name: /se connecter/i }).click();

    // Récupère le secret depuis la DB (chiffré) pour générer un code frais
    const userInDb = await prisma.user.findUnique({
      where: { email: u.email.toLowerCase() },
      select: { totpSecret: true },
    });
    const liveSecret = decryptTotpSecret(userInDb!.totpSecret!);
    // Attendre la fenêtre de 30s suivante pour éviter le replay (totpLastStep)
    await page.waitForTimeout(31_000);
    const freshCode = generateCurrentCode(liveSecret);

    await page.getByLabel(/code de vérification/i).fill(freshCode);
    await page.getByRole("button", { name: /vérifier|se connecter/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("rejette un code TOTP déjà consommé (anti-replay)", async ({ request }) => {
    // Récupère le secret + génère un code
    const userInDb = await prisma.user.findUnique({
      where: { email: u.email.toLowerCase() },
      select: { totpSecret: true, totpLastStep: true },
    });
    const secret = decryptTotpSecret(userInDb!.totpSecret!);
    const code = generateCurrentCode(secret);

    // Premier login OK
    const r1 = await request.post("/api/auth/login", {
      data: { email: u.email, password: u.password, totpCode: code },
    });
    expect(r1.ok()).toBeTruthy();

    // Deuxième login avec le même code → doit échouer
    const r2 = await request.post("/api/auth/login", {
      data: { email: u.email, password: u.password, totpCode: code },
    });
    expect(r2.status()).toBe(401);
    const body = await r2.json();
    expect(body.message).toMatch(/déjà utilisé|invalides/i);
  });
});
