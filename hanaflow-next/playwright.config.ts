import { defineConfig, devices } from "@playwright/test";

/**
 * Config Playwright pour les e2e HanaFlow.
 *
 * - Lance auto le `npm run dev` si pas déjà sur le port 3000
 * - 2 navigateurs : chromium (rapide pour CI) + webkit (pour attraper les
 *   bizarreries Safari, qui touchent surtout les cookies cross-site et la
 *   gestion des dates)
 * - Mode trace = retain-on-failure : on garde la trace seulement quand un test
 *   plante, pas sur chaque run (coûte cher en disque)
 */
export default defineConfig({
  testDir: "./e2e",
  // Échec rapide en CI (1 retry max) ; localement pas de retry pour voir
  // tout de suite ce qui foire
  retries: process.env.CI ? 1 : 0,
  // Pas de parallélisme par défaut : les tests touchent la DB partagée, on
  // veut éviter les races. Si plus tard chaque test a sa propre fixture user,
  // remettre `fullyParallel: true` + `workers: undefined`
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Force le locale FR pour matcher l'UI
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit",   use: { ...devices["Desktop Safari"] } },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Force NODE_ENV à test pour que les routes ne soient pas en prod (PWA off, etc.)
    env: { NODE_ENV: "development" },
  },
});
