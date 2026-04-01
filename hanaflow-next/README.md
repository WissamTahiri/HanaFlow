# HanaFlow

Plateforme éducative SAP — apprends les modules FI, CO, MM, SD, HCM, PP et S/4HANA de zéro à consultant certifié.

## Stack technique

- **Framework** : Next.js 16 App Router (TypeScript)
- **Styles** : Tailwind CSS v4
- **Base de données** : Neon PostgreSQL + Prisma ORM
- **Auth** : JWT (argon2id) + refresh tokens httpOnly
- **Analytics** : PostHog
- **Error tracking** : Sentry
- **PWA** : next-pwa (installable sur mobile)
- **Déploiement** : Vercel

## Fonctionnalités

- 6 modules SAP : FI, CO, MM, SD, HCM, PP
- 6 simulateurs d'examens SAP avec corrections
- Système de certification avec PDF téléchargeable
- Gamification : XP, badges, niveaux (1–10)
- Dashboard de progression personnalisé
- Panel admin : gestion users, codes promo, stats
- Codes promo pour activer le plan Pro
- Dark mode
- PWA installable

## Installation

```bash
git clone https://github.com/WissamTahiri/HanaFlow.git
cd HanaFlow/hanaflow-next
npm install
```

Copier les variables d'environnement :

```bash
cp .env.example .env
# Remplir les valeurs dans .env
```

Initialiser la base de données :

```bash
npx prisma db push
npx prisma generate
```

Lancer en développement :

```bash
npm run dev
```

## Variables d'environnement

Voir `.env.example` pour la liste complète.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL poolée Neon PostgreSQL |
| `DIRECT_URL` | URL directe Neon PostgreSQL (migrations) |
| `JWT_SECRET` | Secret pour les access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | Secret pour les refresh tokens (min 32 chars) |
| `NEXT_PUBLIC_APP_URL` | URL publique du site |
| `NEXT_PUBLIC_POSTHOG_KEY` | Clé PostHog analytics |
| `SENTRY_AUTH_TOKEN` | Token Sentry error tracking |

## Déploiement

Le projet est déployé sur Vercel avec auto-deploy sur la branche `master`.

```bash
git push origin master  # déclenche un déploiement automatique
```

## Créer un compte admin

Après avoir créé un compte sur le site :

```bash
echo "UPDATE users SET role = 'admin' WHERE email = 'ton@email.com';" | \
  npx prisma db execute --schema=prisma/schema.prisma --stdin
```

## Structure du projet

```
src/
├── app/
│   ├── api/            # API Routes (auth, admin, promo)
│   ├── admin/          # Panel admin (/admin)
│   ├── modules-sap/    # Pages modules SAP (FI, CO, MM, SD, HCM, PP)
│   ├── certifications/ # Simulateurs d'examens
│   └── ...
├── components/         # Composants réutilisables
├── context/            # React Contexts (Auth, Subscription, Gamification)
├── hooks/              # Hooks personnalisés
├── lib/                # Prisma, auth, API helpers
└── types/              # Types TypeScript
```
