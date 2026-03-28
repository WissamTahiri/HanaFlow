# HanaFlow

Plateforme éducative SAP — apprends les modules FI, CO, MM, SD, HCM et PP ainsi que S/4HANA.

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 18, Vite 6, Tailwind CSS, React Router v6 |
| Backend | Express.js 5, Node.js |
| Base de données | PostgreSQL (Neon cloud) |
| Authentification | JWT (HS256) + refresh tokens httpOnly |
| Hachage | Argon2id |
| Validation | Zod |
| Monitoring | Sentry |
| Déploiement | Vercel (frontend) + Render (backend) |

## Architecture

```
HanaFlow/
├── Front-End/          # Application React (Vite)
│   ├── src/
│   │   ├── pages/      # Pages de l'app (FI, CO, MM, SD, HCM, PP…)
│   │   ├── components/ # Composants réutilisables (Navbar, SEO, ProtectedRoute…)
│   │   ├── context/    # AuthContext — état auth global
│   │   ├── hooks/      # useProgress — suivi de progression
│   │   └── config/     # api.js — URL backend
│   ├── vercel.json     # Config déploiement Vercel
│   └── vite.config.js  # Build + alias de chemins + Vitest
│
├── Back-End/           # API Express
│   ├── routes/         # auth.js, progress.js
│   ├── middleware/     # auth.js, errorHandler.js
│   ├── db/             # pool.js, migrate.js, migrations/
│   ├── tests/          # Tests Jest + Supertest
│   ├── server.js       # Point d'entrée
│   └── render.yaml     # Config déploiement Render
│
├── SECURITY.md         # Documentation sécurité
├── DEPLOIEMENT.md      # Guide déploiement pas-à-pas
└── PROGRESS.md         # Suivi d'implémentation
```

## Développement local

### Prérequis

- Node.js 18+
- Un compte [Neon](https://neon.tech) (PostgreSQL cloud gratuit)

### 1. Cloner le projet

```bash
git clone git@github.com:WissamTahiri/HanaFlow.git
cd HanaFlow
```

### 2. Configurer le backend

```bash
cd Back-End
cp .env.example .env
# Remplir .env avec tes vraies valeurs (voir section Variables d'environnement)
npm install
npm run migrate   # Créer les tables en base
npm run dev       # Démarre sur http://localhost:5000
```

### 3. Configurer le frontend

```bash
cd Front-End
cp .env.example .env
# .env : VITE_API_URL=http://localhost:5000
npm install
npm run dev       # Démarre sur http://localhost:5173
```

## Variables d'environnement

### Backend (`Back-End/.env`)

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NODE_ENV` | Oui | `development` ou `production` |
| `PORT` | Non | Port du serveur (défaut : 5000) |
| `DATABASE_URL` | Oui | URL PostgreSQL Neon avec `sslmode=verify-full` |
| `JWT_SECRET` | Oui | Secret aléatoire 64+ caractères |
| `JWT_REFRESH_SECRET` | Oui | Secret différent de JWT_SECRET |
| `JWT_EXPIRES_IN` | Non | Durée access token (défaut : `1h`) |
| `JWT_REFRESH_EXPIRES_IN` | Non | Durée refresh token (défaut : `7d`) |
| `ALLOWED_ORIGINS` | Oui (prod) | Origines CORS autorisées (séparées par virgule) |
| `SENTRY_DSN` | Non | DSN Sentry pour le monitoring en production |

Générer des secrets JWT :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend (`Front-End/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL de l'API backend (ex: `http://localhost:5000`) |
| `VITE_SENTRY_DSN` | DSN Sentry frontend (optionnel) |

## Tests

### Backend (Jest + Supertest)

```bash
cd Back-End
npm test          # Lance les 12 tests
npm run test:watch  # Mode watch
```

### Frontend (Vitest + Testing Library)

```bash
cd Front-End
npm test          # Lance les tests
npm run test:watch  # Mode watch
```

## Déploiement

Voir [DEPLOIEMENT.md](./DEPLOIEMENT.md) pour le guide complet pas-à-pas.

- **Frontend** → [Vercel](https://vercel.com) (détecte Vite automatiquement)
- **Backend** → [Render](https://render.com) (configuré via `render.yaml`)
- **Base de données** → [Neon](https://neon.tech) (PostgreSQL serverless)

## Routes API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| `GET` | `/health` | — | Health check (Render) |
| `POST` | `/auth/register` | — | Inscription |
| `POST` | `/auth/login` | — | Connexion |
| `POST` | `/auth/refresh` | Cookie | Renouveler l'access token |
| `POST` | `/auth/logout` | Cookie | Déconnexion |
| `GET` | `/auth/me` | JWT | Profil de l'utilisateur connecté |
| `PATCH` | `/auth/profile` | JWT | Modifier nom ou mot de passe |
| `GET` | `/progress` | JWT | Modules visités par l'utilisateur |
| `POST` | `/progress/:module` | JWT | Marquer un module comme visité |

Modules SAP valides : `fi`, `co`, `mm`, `sd`, `hcm`, `pp`

## Sécurité

Voir [SECURITY.md](./SECURITY.md) pour la documentation complète.

Points clés :
- Mots de passe hashés avec **Argon2id**
- Refresh tokens stockés en **httpOnly cookie** (inaccessible depuis JavaScript)
- **CSP** (Content Security Policy) stricte via Helmet
- Rate limiting : 15 tentatives / 15 min sur les routes auth
- 0 vulnérabilité (`npm audit` à jour sur les deux projets)
