# HanaFlow

Plateforme éducative SAP — apprends les modules FI, CO, MM, SD, PP et IA générative, de zéro à consultant certifié.

> Le code actif vit dans [`hanaflow-next/`](./hanaflow-next/). Une ancienne implémentation React/Vite + Express est conservée dans `_archive/` pour référence (voir « Historique » plus bas).

## Stack

- **Framework** : Next.js 16 (App Router, TypeScript)
- **UI** : React 19, Tailwind CSS v4, motion/react
- **Base de données** : Neon PostgreSQL + Prisma ORM
- **Auth** : JWT (access + refresh httpOnly, vérification de fraîcheur du token), Argon2id, TOTP 2FA optionnel
- **IA** : Groq (`openai/gpt-oss-120b`) — tuteur SAP, CV builder ATS, mock interview noté, roadmap personnalisée
- **Analytics** : PostHog (config minimale — pas d'autocapture, pas de cookie, voir `/confidentialite`)
- **Email** : Resend (fallback console si non configuré)
- **PWA** : Serwist (installable mobile)
- **Déploiement** : Vercel (région `cdg1`)

## Fonctionnalités

- 6 modules SAP avec cours structurés (FI, CO, MM, SD, PP, IA générative)
- Pages S/4HANA, SAP AI Joule, processus métier, roadmap consultant
- 6 simulateurs d'examens de certification, notés côté serveur, avec corrections détaillées
- Certificats PDF téléchargeables et vérifiables publiquement (`@react-pdf/renderer`)
- Flashcards à répétition espacée (SM-2)
- Suite carrière IA : tuteur SAP conversationnel, CV builder ATS, mock interview noté, roadmap personnalisée
- Passerelle emploi : annonces SAP, candidature en un clic avec le CV généré par l'IA
- Offre équipe B2B : comptes d'organisation, sièges, invitations, dashboard de progression agrégé
- Gamification : XP, badges, niveaux 1–10 (source de vérité serveur)
- Dashboard personnalisé avec progression
- Plan Pro activable par codes promo
- Panel admin : utilisateurs (bulk, export, impersonation, revoke sessions), organisations, offres d'emploi, codes promo, audit log, feedback, NPS, témoignages, paramètres site, analytics
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
