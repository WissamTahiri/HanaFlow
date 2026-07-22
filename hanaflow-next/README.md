# HanaFlow

Plateforme éducative SAP — apprends les modules FI, CO, MM, SD, PP et IA générative de zéro à consultant certifié.

## Stack technique

- **Framework** : Next.js 16 App Router (TypeScript)
- **Styles** : Tailwind CSS v4
- **Base de données** : Neon PostgreSQL + Prisma ORM
- **Auth** : JWT (argon2id) + refresh tokens httpOnly + vérification de fraîcheur token + TOTP 2FA optionnel
- **IA** : Groq (`openai/gpt-oss-120b`) — voir `src/lib/ai.ts`
- **Analytics** : PostHog, config minimale — voir `src/lib/analytics.ts`
- **Email** : Resend (fallback console si non configuré)
- **PWA** : Serwist (installable sur mobile)
- **Déploiement** : Vercel

## Fonctionnalités

- 6 modules SAP : FI, CO, MM, SD, PP, IA générative
- 6 simulateurs d'examens SAP, notés côté serveur, avec corrections
- Quiz de chapitre et flashcards à répétition espacée (SM-2)
- Système de certification avec PDF téléchargeable et vérification publique
- Suite carrière IA : tuteur SAP, CV builder ATS, mock interview noté, roadmap personnalisée
- Passerelle emploi : annonces SAP, candidature avec le CV généré par l'IA
- Offre équipe B2B : organisations, sièges, invitations, dashboard agrégé
- Gamification : XP, badges, niveaux (1–10), source de vérité serveur
- Dashboard de progression personnalisé
- Panel admin : gestion users, organisations, offres d'emploi, codes promo, feedback, NPS, témoignages, stats
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
| `NEXT_PUBLIC_APP_URL` | URL publique du site (ex: `http://localhost:3000` en dev) |
| `TOTP_ENCRYPTION_KEY` | Chiffre les secrets 2FA — sans elle, stockés en clair (à éviter en prod) |
| `GROQ_API_KEY` | Requis pour le tuteur SAP, CV builder, mock interview, roadmap |
| `GROQ_MODEL` | Optionnel — défaut `openai/gpt-oss-120b` |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | Optionnel — analytics (voir `src/lib/analytics.ts`) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Optionnel — rate-limiting distribué (sinon fallback mémoire) |
| `RESEND_API_KEY` | Optionnel — clé Resend pour l'envoi d'emails |
| `RESEND_FROM_EMAIL` | Optionnel — adresse expéditeur |
| `ADMIN_NOTIFICATION_EMAIL` | Optionnel — destinataire des alertes admin |

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
│   ├── api/            # API Routes (auth, admin, team, jobs, IA, gamification...)
│   ├── admin/          # Panel admin (/admin)
│   ├── modules-sap/    # Pages modules SAP (FI, CO, MM, SD, PP, IA générative)
│   ├── certifications/ # Simulateurs d'examens
│   ├── team/, emplois/ # Offre équipe B2B, passerelle emploi
│   ├── roadmap/, entretien/, cv-builder/  # Suite carrière IA
│   └── ...
├── components/         # Composants réutilisables (dont AnalyticsProvider)
├── context/            # React Contexts (Auth, Subscription, Gamification)
├── hooks/              # Hooks personnalisés
├── lib/                # Prisma, auth, API helpers, ai.ts (Groq), analytics.ts (PostHog)
└── types/              # Types TypeScript
```
