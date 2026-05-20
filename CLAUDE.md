# CLAUDE.md

Guidance pour Claude Code travaillant sur ce repo.

## Où vit le code

**Le projet actif est dans [`hanaflow-next/`](./hanaflow-next/).** Tout nouveau travail s'y fait. La racine ne contient que de la doc.

`_archive/` contient l'ancienne implémentation React/Vite + Express (à ne pas modifier — référence uniquement, pour récupérer un composant ou retrouver une décision passée).

## Avertissement Next.js 16

`hanaflow-next/AGENTS.md` dit explicitement : *« This is NOT the Next.js you know. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. »*

Avant d'écrire du code Next.js non-trivial (API routes, middleware, layouts, server components, caching, Suspense, prisma config…), lire d'abord les docs locales :

```bash
ls hanaflow-next/node_modules/next/dist/docs/
```

## Project Overview

HanaFlow est une plateforme éducative SAP (modules FI, CO, MM, SD, HCM, PP + S/4HANA), avec simulateurs d'examens de certification, gamification, plan Pro, panel admin complet.

## Stack

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS v4
- Prisma + PostgreSQL Neon
- Argon2id + JWT (access + refresh httpOnly cookie) + TOTP 2FA
- Vitest pour les tests
- Resend pour l'email (fallback console si pas de clé) + next-pwa

## Commandes (dans `hanaflow-next/`)

```bash
npm run dev        # dev server (webpack mode, port 3000)
npm run build      # prisma generate && next build
npm start          # production server
npm test           # vitest run
npm run test:watch # vitest watch
npm run lint       # eslint
npm run db:push    # prisma db push
npm run db:studio  # prisma studio
```

## Architecture (`hanaflow-next/src/`)

```
src/
├── app/                  # App Router pages
│   ├── api/              # Route handlers
│   │   ├── auth/         # login, register, refresh, logout, me, profile, 2fa
│   │   ├── admin/        # users (+ bulk/export/[id]/impersonate/revoke-sessions),
│   │   │                 # promo-codes, audit-log, settings, stats, analytics
│   │   ├── progress/
│   │   └── promo/redeem/
│   ├── admin/            # Panel admin (users, promo-codes, audit-log, settings)
│   ├── modules-sap/      # FI, CO, MM, SD, HCM, PP
│   ├── certifications/   # Pages d'intro + /examen pour chaque module
│   ├── dashboard/, profil/, achievements/, pricing/
│   ├── s4hana/, ai-joule/, processus-metier/, roadmap/, a-propos/, contact/
│   ├── cgu/, confidentialite/, mentions-legales/
│   ├── layout.tsx        # root layout (Providers, Navbar, Footer, banners)
│   ├── providers.tsx     # AuthProvider + SubscriptionProvider + GamificationProvider
│   ├── sitemap.ts, robots.ts, not-found.tsx, error.tsx
│   └── _home.tsx         # contenu de la home (rendu par page.tsx)
├── components/           # Navbar, Footer, ModuleLayout, PageLayout,
│                         # ExamSimulatorTemplate, CertificateDocument, BadgeToast,
│                         # ImpersonationBanner, MaintenanceGate, SiteBanner,
│                         # TwoFactorSection, ProtectedRoute, etc.
├── context/              # AuthContext, SubscriptionContext, GamificationContext
├── data/certifications/  # Banques de questions par module (1000–1600 lignes)
├── hooks/useProgress.ts
├── lib/                  # prisma, auth (JWT, hashToken), audit, settings,
│                         # email (Resend), totp, apiHelpers
├── types/index.ts
├── middleware.ts         # auth middleware Next.js
└── instrumentation.ts    # hook vide (réservé pour instrumentation future)
```

## Schéma Prisma

6 modèles dans `prisma/schema.prisma` :
- `User` (id, name, email, passwordHash, role, isPro, isSuspended, totp*)
- `RefreshToken` (hashé SHA-256, expire, indexé)
- `UserProgress` (user × module, unique)
- `PromoCode` (code, usageLimit, expiresAt)
- `AdminAuditLog` (actor, action, target, metadata, ip)
- `SiteSetting` (key/value pour maintenance mode, bannière, etc.)

## Auth flow

- Access token JWT (HS256, 1h par défaut) → header `Authorization: Bearer`
- Refresh token JWT séparé (7j) → cookie httpOnly, rotaté à chaque `/api/auth/refresh`, hashé en base
- Impersonation : access token spécial 15 min émis par `/api/admin/users/[id]/impersonate`, contient `impersonatedBy` dans le payload → `ImpersonationBanner` rendu globalement quand actif

## Sécurité

- Headers via `next.config.ts` (X-Frame-Options SAMEORIGIN, nosniff, Referrer-Policy, Permissions-Policy)
- Hash passwords : Argon2id
- Validation : Zod côté serveur
- Audit log sur toutes les actions admin

## Conventions

- UI en **français** (chaînes utilisateur)
- Path alias : `@/` → `src/`
- Couleurs Tailwind custom : `sap-blue`, `sap-blue-dark`, `sap-accent`, `sap-dark`, `sap-100`, etc.
- Test files colocated : `lib/auth.ts` + `lib/auth.test.ts`
- Composants : un fichier par composant, PascalCase

## Déploiement

Vercel, auto-deploy sur `master`. `vercel.json` : framework `nextjs`, région `cdg1`.

Variables d'env requises en prod (voir `hanaflow-next/README.md`) :
`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `NEXT_PUBLIC_APP_URL`, et optionnellement `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`. Voir `hanaflow-next/.env.example`.

## Promouvoir un admin

```bash
echo "UPDATE users SET role = 'admin' WHERE email = 'ton@email.com';" | \
  npx prisma db execute --schema=prisma/schema.prisma --stdin
```
