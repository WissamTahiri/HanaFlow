# HanaFlow

Plateforme éducative SAP — apprends les modules FI, CO, MM, SD, HCM, PP et S/4HANA, de zéro à consultant certifié.

> Le code actif vit dans [`hanaflow-next/`](./hanaflow-next/). Une ancienne implémentation React/Vite + Express est conservée dans `_archive/` pour référence (voir « Historique » plus bas).

## Stack

- **Framework** : Next.js 16 (App Router, TypeScript)
- **UI** : React 19, Tailwind CSS v4, motion/react
- **Base de données** : Neon PostgreSQL + Prisma ORM
- **Auth** : JWT (access + refresh httpOnly), Argon2id, TOTP 2FA optionnel
- **Email** : Resend (fallback console si non configuré)
- **PWA** : `next-pwa` (installable mobile)
- **Déploiement** : Vercel (région `cdg1`)

## Fonctionnalités

- 6 modules SAP avec cours structurés (FI, CO, MM, SD, HCM, PP)
- Pages S/4HANA, SAP AI Joule, processus métier, roadmap consultant
- 6 simulateurs d'examens de certification avec corrections détaillées
- Certificats PDF téléchargeables (`@react-pdf/renderer`)
- Gamification : XP, badges, niveaux 1–10
- Dashboard personnalisé avec progression
- Plan Pro activable par codes promo
- Panel admin : utilisateurs (bulk, export, impersonation, revoke sessions), codes promo, audit log, paramètres site, analytics
- Mode maintenance & bannière site pilotables depuis l'admin
- 2FA TOTP optionnel pour les comptes
- Dark mode avec persistance + anti-flash

## Démarrage local

```bash
cd hanaflow-next
npm install
cp .env.example .env   # éditer .env avec tes vraies valeurs Neon + JWT
npx prisma db push
npx prisma generate
npm run dev
```

App disponible sur `http://localhost:3000`.

## Tests

```bash
cd hanaflow-next
npm test          # Vitest run
npm run test:watch
```

Couverture actuelle : `auth.ts`, `apiHelpers.ts`, `totp.ts`.

## Documentation détaillée

- [`hanaflow-next/README.md`](./hanaflow-next/README.md) — README technique de l'app
- [`hanaflow-next/AGENTS.md`](./hanaflow-next/AGENTS.md) — avertissement sur Next.js 16 (breaking changes vs versions antérieures)

## Historique

Avant la migration Next.js, HanaFlow était une SPA React/Vite + API Express. Ce code est archivé dans `_archive/Front-End` et `_archive/Back-End` (avec ses propres `PROGRESS.md`, `SECURITY.md`, `DEPLOIEMENT.md`, etc. qui n'ont **pas** été mis à jour pour la nouvelle stack). À consulter uniquement pour récupérer un composant ou comprendre une décision passée.
