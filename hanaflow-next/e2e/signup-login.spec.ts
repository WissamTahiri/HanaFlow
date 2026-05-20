import { test, expect } from "@playwright/test";
import { makeUser, deleteUserByEmail } from "./helpers/user";

test.describe("signup → login → logout", () => {
  const u = makeUser("signup");

  test.afterAll(async () => {
    await deleteUserByEmail(u.email);
  });

  test("crée un compte et atterrit sur le dashboard", async ({ page }) => {
    await page.goto("/register");

    await page.getByLabel(/nom/i).fill(u.name);
    await page.getByLabel(/email/i).fill(u.email);
    await page.getByLabel(/mot de passe/i).first().fill(u.password);

    await page.getByRole("button", { name: /créer/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(u.name).first()).toBeVisible();
  });

  test("logout puis re-login avec les mêmes credentials", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(u.email);
    await page.getByLabel(/mot de passe/i).fill(u.password);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // Logout via cookie clear (UI peut varier — ce flow est plus robuste)
    await page.context().clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);

    // Re-login
    await page.getByLabel(/email/i).fill(u.email);
    await page.getByLabel(/mot de passe/i).fill(u.password);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("rejette un mauvais mot de passe", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(u.email);
    await page.getByLabel(/mot de passe/i).fill("WrongPassword1");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page.getByText(/identifiants invalides/i)).toBeVisible();
  });
});
