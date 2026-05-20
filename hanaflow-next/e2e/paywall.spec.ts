import { test, expect } from "@playwright/test";
import { makeUser, deleteUserByEmail, promoteToPro } from "./helpers/user";

test.describe("paywall : accès examen Pro", () => {
  const free = makeUser("free");
  const pro = makeUser("pro");

  test.beforeAll(async ({ request }) => {
    await request.post("/api/auth/register", {
      data: { name: free.name, email: free.email, password: free.password },
    });
    await request.post("/api/auth/register", {
      data: { name: pro.name, email: pro.email, password: pro.password },
    });
    await promoteToPro(pro.email);
  });

  test.afterAll(async () => {
    await deleteUserByEmail(free.email);
    await deleteUserByEmail(pro.email);
  });

  test("user free voit la paywall sur /certifications/fi/examen", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(free.email);
    await page.getByLabel(/mot de passe/i).fill(free.password);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto("/certifications/fi/examen");
    // Le composant ProPaywall doit s'afficher
    await expect(page.getByText(/pro/i).first()).toBeVisible();
    // Pas de questions d'examen rendues
    await expect(page.getByText(/q 1\//i)).not.toBeVisible();
  });

  test("user pro peut démarrer l'examen FI", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(pro.email);
    await page.getByLabel(/mot de passe/i).fill(pro.password);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto("/certifications/fi/examen");
    // Page de démarrage du simulateur visible
    await expect(page.getByRole("button", { name: /démarrer/i })).toBeVisible();
  });
});
