# Guide de déploiement — HanaFlow

Déploiement complet de HanaFlow en production : base de données Neon, backend Render, frontend Vercel.

> **Durée estimée :** 30–45 minutes la première fois.

---

## Vue d'ensemble

```
Utilisateur → Vercel (React) → Render (Express API) → Neon (PostgreSQL)
```

---

## Étape 1 — Créer la base de données sur Neon

**Neon** est une base PostgreSQL cloud gratuite. Aucune installation requise.

1. Va sur [https://neon.tech](https://neon.tech) et clique **Sign Up** (tu peux te connecter avec GitHub)
2. Clique **New Project**
3. Donne un nom à ton projet : `hanaflow`
4. Sélectionne la région la plus proche (ex: `eu-central-1` pour l'Europe)
5. Clique **Create project**
6. Tu arrives sur le dashboard. Clique sur **Connection string**
7. Sélectionne le type **Node.js** dans le menu déroulant
8. Copie l'URL — elle ressemble à :
   ```
   postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
9. **Garde cette URL de côté**, tu en auras besoin plus tard.

> Si l'URL se termine par `?sslmode=require`, remplace-le par `?sslmode=verify-full` pour une connexion plus sécurisée.

---

## Étape 2 — Exécuter les migrations (créer les tables)

Avant de déployer, il faut créer les tables dans Neon.

1. Dans ton projet `Back-End`, crée un fichier `.env` (copie `.env.example`) :
   ```
   DATABASE_URL=postgresql://user:password@...neon.tech/neondb?sslmode=verify-full
   JWT_SECRET=... (générer avec la commande ci-dessous)
   JWT_REFRESH_SECRET=... (générer avec la commande ci-dessous)
   ```

2. Génère tes secrets JWT dans un terminal :
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Exécute cette commande **deux fois** — une pour `JWT_SECRET`, une pour `JWT_REFRESH_SECRET`.

3. Dans le dossier `Back-End`, lance la migration :
   ```bash
   cd Back-End
   npm install
   npm run migrate
   ```
   Tu dois voir : `✅ Migration 001`, `✅ Migration 002`, `✅ Migration 003`

4. Pour vérifier, retourne sur le dashboard Neon → **Tables** — tu dois voir `users`, `refresh_tokens`, `user_progress`.

---

## Étape 3 — Déployer le backend sur Render

**Render** héberge l'API Node.js gratuitement.

### 3.1 Créer un compte Render

1. Va sur [https://render.com](https://render.com) et clique **Get Started for Free**
2. Connecte-toi avec GitHub (recommandé — ça lie automatiquement tes repos)

### 3.2 Créer le service web

1. Dans le dashboard Render, clique **New +** → **Web Service**
2. Clique **Connect a repository** → sélectionne `WissamTahiri/HanaFlow`
3. Si le repo n'apparaît pas, clique **Configure account** → autorise Render à accéder à ce repo

4. Configure le service :
   - **Name** : `hanaflow-api`
   - **Region** : `Frankfurt (EU Central)` (ou la plus proche)
   - **Branch** : `master`
   - **Root Directory** : `Back-End`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free`

5. Clique **Create Web Service** (ne pas encore ajouter les variables d'env — on le fait à l'étape suivante)

### 3.3 Configurer les variables d'environnement sur Render

Une fois le service créé, va dans **Environment** → **Add Environment Variable** et ajoute :

| Clé | Valeur |
|-----|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | L'URL Neon (étape 1) |
| `JWT_SECRET` | Ton secret JWT (64+ chars) |
| `JWT_REFRESH_SECRET` | Ton autre secret JWT (64+ chars) |
| `JWT_EXPIRES_IN` | `1h` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `ALLOWED_ORIGINS` | *(à remplir après l'étape 4 avec l'URL Vercel)* |

> **Note :** `PORT` est injecté automatiquement par Render — ne pas le définir.

6. Clique **Save Changes** — Render va redémarrer et déployer le backend.

### 3.4 Vérifier le déploiement backend

Une fois le déploiement terminé (2–3 minutes), Render t'affiche une URL :
```
https://hanaflow-api.onrender.com
```

Ouvre `https://hanaflow-api.onrender.com/health` dans ton navigateur — tu dois voir :
```json
{ "status": "ok", "db": "connected", "env": "production" }
```

**Copie cette URL** (`https://hanaflow-api.onrender.com`) — tu en auras besoin pour le frontend.

---

## Étape 4 — Déployer le frontend sur Vercel

**Vercel** héberge l'application React gratuitement et détecte Vite automatiquement.

### 4.1 Créer un compte Vercel

1. Va sur [https://vercel.com](https://vercel.com) et clique **Sign Up**
2. Connecte-toi avec GitHub

### 4.2 Importer le projet

1. Dans le dashboard Vercel, clique **Add New...** → **Project**
2. Sélectionne le repo `WissamTahiri/HanaFlow`
3. Clique **Import**

### 4.3 Configurer le projet

Vercel va détecter automatiquement que c'est un projet Vite.

- **Framework Preset** : Vite *(déjà sélectionné)*
- **Root Directory** : Clique **Edit** et saisis `Front-End`
- **Build Command** : `npm run build` *(déjà rempli)*
- **Output Directory** : `dist` *(déjà rempli)*

### 4.4 Ajouter les variables d'environnement

Clique **Environment Variables** et ajoute :

| Clé | Valeur |
|-----|--------|
| `VITE_API_URL` | `https://hanaflow-api.onrender.com` (l'URL Render de l'étape 3) |

### 4.5 Déployer

Clique **Deploy**. Vercel va builder et déployer (1–2 minutes).

Une fois terminé, Vercel t'affiche une URL :
```
https://hanaflow.vercel.app
```
(ou similaire — Vercel génère un nom automatiquement)

**Copie cette URL** — tu en as besoin pour configurer CORS sur Render.

---

## Étape 5 — Connecter le backend et le frontend (CORS)

Le backend doit autoriser les requêtes venant du frontend Vercel.

1. Retourne dans le dashboard Render → ton service `hanaflow-api`
2. Va dans **Environment** → cherche `ALLOWED_ORIGINS`
3. Mets à jour la valeur :
   ```
   https://hanaflow.vercel.app,http://localhost:5173
   ```
   (remplace `hanaflow.vercel.app` par ta vraie URL Vercel)
4. Clique **Save Changes** — Render redémarre automatiquement.

---

## Étape 6 — (Optionnel) Configurer Sentry

Sentry envoie des alertes en cas d'erreur en production.

1. Va sur [https://sentry.io](https://sentry.io) → **Sign Up** (gratuit)
2. Crée un projet **Node.js** (backend) → copie le DSN
3. Crée un projet **React** (frontend) → copie le DSN
4. Sur Render → **Environment** : ajoute `SENTRY_DSN` avec le DSN Node.js
5. Sur Vercel → **Settings** → **Environment Variables** : ajoute `VITE_SENTRY_DSN` avec le DSN React

---

## Checklist finale de production

Vérifie chaque point avant de considérer le déploiement terminé.

### Base de données
- [ ] Les 3 tables existent sur Neon : `users`, `refresh_tokens`, `user_progress`
- [ ] La connexion SSL est active (`sslmode=verify-full`)

### Backend (Render)
- [ ] `GET /health` retourne `{ "status": "ok", "db": "connected" }`
- [ ] `NODE_ENV=production` est défini
- [ ] `JWT_SECRET` et `JWT_REFRESH_SECRET` sont définis (64+ chars chacun)
- [ ] `DATABASE_URL` pointe vers Neon
- [ ] `ALLOWED_ORIGINS` contient l'URL Vercel de production

### Frontend (Vercel)
- [ ] La page d'accueil se charge correctement
- [ ] L'inscription fonctionne (crée un compte avec un vrai email)
- [ ] La connexion fonctionne
- [ ] Le dashboard affiche la progression
- [ ] Les pages SAP (FI, CO, MM, SD, HCM, PP) sont accessibles
- [ ] `VITE_API_URL` pointe vers l'URL Render de production

### Sécurité
- [ ] L'URL de l'API est en HTTPS (pas HTTP)
- [ ] Les cookies sont bien `Secure; HttpOnly` (vérifiable dans DevTools → Application → Cookies)
- [ ] `npm audit` retourne 0 vulnérabilité sur les deux projets

---

## Mettre à jour l'application après un changement

Vercel et Render se déploient automatiquement à chaque `git push` sur la branche `master` :

```bash
git add .
git commit -m "Ma modification"
git push origin master
# → Render et Vercel redéploient automatiquement
```

---

## Dépannage

| Problème | Cause probable | Solution |
|----------|---------------|----------|
| `/health` retourne `db: "unreachable"` | `DATABASE_URL` incorrect | Vérifier l'URL Neon dans les env vars Render |
| Erreur CORS dans la console navigateur | `ALLOWED_ORIGINS` incorrect | Ajouter l'URL Vercel dans `ALLOWED_ORIGINS` sur Render |
| `FATAL: JWT_SECRET` au démarrage | Variable manquante | Ajouter `JWT_SECRET` dans les env vars Render |
| Page blanche sur Vercel | Mauvais `Root Directory` | Vérifier que le Root Directory est bien `Front-End` |
| Login échoue en prod | `VITE_API_URL` incorrect | Vérifier que la variable pointe vers l'URL Render HTTPS |
| Cookie non envoyé | `sameSite` / `secure` | Vérifier que les deux domaines sont en HTTPS |

---

*Dernière mise à jour : 2026-03-28*
