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

HanaFlow est une plateforme éducative SAP (modules FI, CO, MM, SD, PP + IA générative,
plus pages S/4HANA / AI Joule), avec :
- **Apprentissage** : cours par module, quiz de chapitre, simulateurs d'examens de
  certification, flashcards à **répétition espacée (SM-2)**.
- **IA carrière** : tuteur SAP conversationnel, CV builder, mock interview noté,
  roadmap d'apprentissage personnalisée (tout via `lib/ai.ts`).
- **Certification** : émission de certificats PDF + vérification publique par URL.
- **Gamification serveur** : XP, badges, streak (source de vérité en base).
- **Growth** : widget feedback, prompt NPS, témoignages publics.
- Plan Pro (codes promo), panel admin complet.

## Stack

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS v4
- Prisma + PostgreSQL Neon
- Argon2id + JWT (access + refresh httpOnly cookie) + TOTP 2FA + vérification email
- **IA** : `@google/genai` (Gemini, primary) + `groq-sdk` (Llama 3.3 70B, fallback)
- **PDF** : `@react-pdf/renderer` (certificats, CV)
- Vitest (unit, colocalisé) + Playwright (`e2e/`)
- Resend pour l'email (fallback console si pas de clé) + Serwist (PWA)

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
│   │   ├── auth/         # login, register, refresh, logout, me, profile, 2fa,
│   │   │                 # forgot/reset-password, verify-email, resend-verification
│   │   ├── admin/        # users (+ bulk/export/[id]/impersonate/revoke-sessions),
│   │   │                 # promo-codes, audit-log, settings, stats, analytics,
│   │   │                 # feedback, nps, testimonials
│   │   ├── tutor/chat/           # tuteur SAP (generateText)
│   │   ├── interview/            # start + grade (mock interview, generateJSON)
│   │   ├── cv/optimize/          # CV builder IA
│   │   ├── roadmap/generate/     # roadmap perso IA
│   │   ├── quiz/                 # submit + attempts (quiz de chapitre)
│   │   ├── gamification/         # route + event + migrate (XP/badges serveur)
│   │   ├── certificates/         # route + issue + verify/[id]
│   │   ├── feedback/, nps/ (+ should-show), testimonials/
│   │   ├── progress/
│   │   └── promo/redeem/
│   ├── admin/            # Panel admin : users, promo-codes, audit-log, settings,
│   │                     # feedback, nps, testimonials
│   ├── modules-sap/      # fi, co, mm, sd, pp, ai
│   ├── certifications/   # Pages d'intro + /examen par module + comparer
│   ├── flashcards/       # révision espacée SM-2 (+ [code])
│   ├── cv-builder/, entretien/, roadmap-personnalisee/   # outils IA carrière
│   ├── certificats/, verifier-certificat/[id]/           # certifs + vérif publique
│   ├── dashboard/, profil/, achievements/, pricing/, stats/, ecoles/
│   ├── s4hana/, ai-joule/, processus-metier/, roadmap/, a-propos/, contact/
│   ├── login/, register/, forgot-password/, reset-password/, verify-email/
│   ├── cgu/, confidentialite/, mentions-legales/
│   ├── layout.tsx        # root layout (Providers, Navbar, Footer, banners)
│   ├── providers.tsx     # AuthProvider + SubscriptionProvider + GamificationProvider
│   ├── sitemap.ts, robots.ts, not-found.tsx, error.tsx
│   └── _home.tsx         # contenu de la home (rendu par page.tsx)
├── components/           # Navbar, Footer, ModuleLayout, PageLayout,
│                         # ExamSimulatorTemplate, CertificateDocument, CvDocument,
│                         # TutorChat, FeedbackWidget, NPSPrompt, TestimonialsSection,
│                         # ProGate, ProPaywall, BadgeToast, QuizHistorySection,
│                         # ImpersonationBanner, MaintenanceGate, SiteBanner, etc.
├── context/              # AuthContext, SubscriptionContext, GamificationContext
├── config/               # stats.ts (chiffres marketing, vérifiés par stats.test.ts),
│                         # contact.ts
├── data/                 # cert-catalog.json (codes SAP officiels, prix, passing score),
│                         # flashcards.ts, certifications/*.js (banques de questions)
├── hooks/                # useProgress, useCountUp, useInView, useReducedMotion
├── lib/                  # prisma, auth (JWT/hash) + serverAuth + apiHelpers,
│                         # ai (Gemini→Groq fallback), gamificationServer, sm2,
│                         # audit, settings, email, totp + totpCrypto, certAccess,
│                         # certCodes, passwordBreach, emailVerification
├── types/                # index.ts, cv.ts
├── middleware.ts         # auth middleware Next.js
└── instrumentation.ts    # hook vide (réservé pour instrumentation future)
```

## Schéma Prisma

~16 modèles dans `prisma/schema.prisma` :
- `User` — + `totp*` (secret chiffré AES-GCM, anti-replay, backup codes),
  `pwdChangedAt` (invalide les access tokens émis avant), `emailVerifiedAt`
- `RefreshToken`, `PasswordResetToken`, `EmailVerificationToken` — tous hashés SHA-256
- `UserProgress` (user × module, unique)
- `UserGamification` — XP / badges / streak (source de vérité serveur, 1 ligne/user)
- `QuizAttempt` — historique quiz de chapitre + examens (`kind = quiz | exam`)
- `CompletionCertificate` — ID `cuid` (pas d'autoincrement, ne révèle pas le volume),
  1 par user × module, révocable
- `Feedback`, `NPSResponse`, `Testimonial` — growth (feedback widget, NPS, social proof)
- `PromoCode` (code, usageLimit, expiresAt)
- `AdminAuditLog` (actor, action, target, metadata, ip)
- `SiteSetting` (key/value : maintenance mode, bannière, etc.)

## Couche IA (`lib/ai.ts`)

Abstraction unique pour tous les appels LLM. **Ne jamais instancier `GoogleGenAI` ou
`Groq` directement dans une route** — tout passe par ce module pour bénéficier du
fallback uniforme.

- **Gemini primary** (`gemini-2.0-flash-lite`) → **fallback Groq** (`llama-3.3-70b-versatile`)
  automatique sur rate-limit / auth error / 5xx.
- `generateJSON` : output structuré validé par Zod (roadmap, interview) — schéma Gemini
  natif, dérivé en JSON Schema injecté au prompt pour Groq.
- `generateText` : chat libre multi-turn (tuteur SAP).
- Erreurs typées via `aiError` / `isAiError` (kind : rate_limit | auth | no_provider | …)
  pour que les routes choisissent le code HTTP.

## Auth flow

- Access token JWT (HS256, 1h par défaut) → header `Authorization: Bearer`
- Refresh token JWT séparé (7j) → cookie httpOnly, rotaté à chaque `/api/auth/refresh`, hashé en base
- Impersonation : access token spécial 15 min émis par `/api/admin/users/[id]/impersonate`, contient `impersonatedBy` dans le payload → `ImpersonationBanner` rendu globalement quand actif
- Changer de mot de passe met à jour `pwdChangedAt` → invalide tous les access tokens encore vivants émis avant (vérifié dans `serverAuth`/`apiHelpers`)
- Vérification d'email à l'inscription (`emailVerifiedAt`) ; `EmailVerificationBanner` tant que non confirmé
- Séparation client/serveur : `lib/auth.ts` (JWT/hash, isomorphe) vs `lib/serverAuth.ts` + `lib/apiHelpers.ts` (garde-fous côté route)

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
- **Chiffres marketing** (nb modules, questions, chapitres…) : jamais hardcodés dans une
  page → toujours depuis `config/stats.ts` (`HANAFLOW_STATS`), sinon `stats.test.ts` casse
- **Codes/catalogue de certif** : source unique `data/cert-catalog.json` (codes SAP,
  prix, passing score) — aligner tout code cert dessus

## Déploiement

Vercel, auto-deploy sur `master`. `vercel.json` : framework `nextjs`, région `cdg1`.

Variables d'env requises en prod (voir `hanaflow-next/README.md`) :
`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `NEXT_PUBLIC_APP_URL`, et optionnellement `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `TOTP_ENCRYPTION_KEY` (chiffre les secrets TOTP), `GEMINI_API_KEY` + `GROQ_API_KEY` (features IA ; sans clé, les routes IA renvoient `no_provider`), `GEMINI_MODEL`/`GROQ_MODEL` (override). Voir `hanaflow-next/.env.example`.

## Promouvoir un admin

```bash
echo "UPDATE users SET role = 'admin' WHERE email = 'ton@email.com';" | \
  npx prisma db execute --schema=prisma/schema.prisma --stdin
```
