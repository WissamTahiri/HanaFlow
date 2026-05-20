# Tests e2e Playwright

## Setup local

```bash
npm install                    # installe @playwright/test
npx playwright install --with-deps chromium webkit
```

## Lancer

```bash
npm run e2e            # tous les tests, headless
npm run e2e:ui         # mode UI interactif (debug)
npm run e2e:debug      # avec inspecteur
```

## Pré-requis

Les tests créent et suppriment des users en DB via `/api/auth/register`. Il faut donc :

- une `DATABASE_URL` valide (généralement la même que dev — surtout pas la prod)
- les variables `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- `RESEND_API_KEY` peut rester vide (les emails partent en console.log et les
  tests ne les vérifient pas par email — uniquement par token DB)

## Conventions

- Chaque test crée son propre user via un email unique `e2e-<uuid>@hanaflow.test`
- À la fin du test, le user est supprimé en DB pour ne pas polluer
- Les tests ne dépendent JAMAIS l'un de l'autre (ordre random possible)

## Couverture actuelle

- `signup-login.spec.ts` — inscription + connexion + logout
- `password-reset.spec.ts` — flow forgot/reset password
- `2fa.spec.ts` — enroll TOTP + login avec code + backup code
- `paywall.spec.ts` — gating des examens Pro
