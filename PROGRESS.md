# Plan de Progression - HanaFlow
> Source de vérité pour le suivi de l'implémentation. Lire ce fichier EN PREMIER à chaque reprise.
> Dernière mise à jour : 2026-03-28

---

## État Global
- **Étapes complétées** : 12/12 ✅ + Audit sécurité ✅
- **Statut** : **PRODUCTION READY** 🚀

---

## Étape 1 : Analyser l'architecture actuelle
**[✓] Statut : Complétée**

**Description :** Auditer l'ensemble du projet pour identifier les problèmes bloquants et les dettes techniques avant toute modification.

**Problèmes identifiés :**
- 🔴 CRITIQUE : `.env` avec vraies credentials Neon PostgreSQL potentiellement dans git history
- 🔴 CRITIQUE : Deux systèmes de routing coexistent (`App.jsx` avec 4 routes vs `Router.jsx` avec 14 routes) — `Router.jsx` n'est PAS utilisé
- 🔴 CRITIQUE : `App.jsx` n'utilise pas `Router.jsx` → les 11 pages SAP (FI, CO, MM, SD, HCM, PP, etc.) sont inaccessibles
- 🟠 MAJEUR : Dossier `Front-End/HanaFlow/` imbriqué (artefact de migration Vite — à supprimer)
- 🟠 MAJEUR : Alias `@components`, `@pages`, etc. déclarés dans `jsconfig.json` mais absents de `vite.config.js` → ne fonctionnent pas au build
- 🟠 MAJEUR : CORS fixé à `localhost:5173` → le déploiement Render/Vercel sera bloqué
- 🟡 MOYEN : Pages SAP très larges (23-29 KB chacune) chargées de manière synchrone → pas de lazy loading
- 🟡 MOYEN : Aucune page 404 custom
- 🟡 MOYEN : Token JWT expire en 1h sans refresh token
- 🟡 MOYEN : Aucun test configuré
- 🟡 MOYEN : Aucun linter (ESLint) configuré
- 🟡 MOYEN : `react-helmet-async` absent (SEO incomplet)
- 🟡 MOYEN : Pas de `vercel.json` ni `render.yaml`
- 🟢 INFO : Backend PostgreSQL (Neon) déjà opérationnel — la migration DB est faite
- 🟢 INFO : Packages de sécurité déjà installés (helmet, express-rate-limit, express-validator)
- 🟢 INFO : Structure séparation frontend/backend correcte

**Notes :** L'analyse révèle que la base est solide mais plusieurs problèmes bloquent la production.

---

## Étape 2 : Corriger le routing et la structure des dossiers
**[✓] Statut : Complétée**

**Description :** Fusionner `Router.jsx` dans `App.jsx`, rendre accessibles toutes les pages SAP, corriger les alias Vite, supprimer le dossier imbriqué `Front-End/HanaFlow/`.

**Fichiers à modifier :**
- `Front-End/src/App.jsx` → intégrer toutes les routes de `Router.jsx`
- `Front-End/vite.config.js` → ajouter les alias `@components`, `@pages`, etc.
- `Front-End/src/routes/Router.jsx` → supprimer (fusionné dans App.jsx)

**Fichiers à supprimer :**
- `Front-End/HanaFlow/` (dossier Vite imbriqué inutile)

**Aucune dépendance à ajouter.**

---

## Étape 3 : Sécuriser les credentials et configurer les variables d'environnement
**[✓] Statut : Complétée**

**Description :** Auditer le git history pour les credentials exposés, mettre à jour `.gitignore`, et créer des fichiers `.env.example` propres pour Vercel et Render.

**Actions :**
- Vérifier si `.env` est dans l'historique git et le purger si nécessaire
- Mettre à jour `.env.example` avec toutes les variables requises en production
- Créer `Front-End/.env.example` avec `VITE_API_URL`
- Documenter les variables à configurer sur Vercel et Render

**Fichiers à créer/modifier :**
- `Back-End/.env.example` (complet pour production)
- `Front-End/.env.example` (complet pour production)

---

## Étape 4 : Configurer CORS et sécurité pour la production
**[✓] Statut : Complétée**

**Description :** Mettre à jour la configuration CORS du backend pour accepter l'URL de production Vercel en plus de localhost. Renforcer les headers de sécurité.

**Fichiers à modifier :**
- `Back-End/server.js` → CORS multi-origines via variable `ALLOWED_ORIGINS`
- `Back-End/.env.example` → documenter `ALLOWED_ORIGINS`

**Aucune dépendance à ajouter** (helmet et cors déjà installés).

---

## Étape 5 : Authentification complète (Refresh Token + profil utilisateur)
**[✓] Statut : Complétée**

**Description :** Ajouter un système de refresh token (JWT à longue durée stocké en httpOnly cookie) pour éviter les déconnexions toutes les heures. Ajouter route PATCH `/auth/profile` pour la mise à jour du profil.

**Fichiers à modifier :**
- `Back-End/server.js` → routes refresh token + update profile
- `Back-End/db/migrations/002_add_refresh_tokens.sql` → table refresh_tokens (à créer)
- `Front-End/src/context/AuthContext.jsx` → gestion du refresh automatique

**Dépendances à ajouter :**
- `cookie-parser` (backend) pour lire les httpOnly cookies

---

## Étape 6 : Optimiser le frontend pour Vercel
**[✓] Statut : Complétée**

**Description :** Configurer Vite pour le code splitting et lazy loading des pages SAP. Créer `vercel.json` pour le routing SPA. Optimiser le build (chunks, assets).

**Fichiers à créer/modifier :**
- `Front-End/vercel.json` → SPA rewrites
- `Front-End/vite.config.js` → `build.rollupOptions` chunking + lazy loading
- `Front-End/src/App.jsx` → `React.lazy()` + `Suspense` pour les pages lourdes

**Bénéfice attendu :** Réduction du bundle initial de ~150KB (6 pages SAP × 25KB).

---

## Étape 7 : Optimiser le backend pour Render
**[✓] Statut : Complétée**

**Description :** Créer `render.yaml` pour le déploiement automatique. Configurer les logs structurés (JSON). Ajouter un endpoint `/health` pour le health check Render. Configurer le graceful shutdown.

**Fichiers à créer/modifier :**
- `Back-End/render.yaml` → configuration Render
- `Back-End/server.js` → endpoint `/health`, logs structurés, graceful shutdown

**Dépendances à ajouter :**
- `morgan` (HTTP request logger)

---

## Étape 8 : API robuste — Validation, routes, gestion d'erreurs
**[✓] Statut : Complétée**

**Description :** Centraliser la gestion des erreurs. Ajouter des routes manquantes (mot de passe oublié, liste des modules). Améliorer les messages d'erreur. Ajouter middleware de logging.

**Fichiers à créer/modifier :**
- `Back-End/middleware/errorHandler.js` → handler global d'erreurs
- `Back-End/middleware/auth.js` → middleware JWT extrait de server.js
- `Back-End/routes/auth.js` → routes auth extraites de server.js
- `Back-End/server.js` → refactoring avec les nouveaux modules

---

## Étape 9 : SEO et accessibilité frontend
**[✓] Statut : Complétée**

**Description :** Installer `react-helmet-async` pour les meta tags dynamiques. Créer un composant `SEO.jsx` utilisé sur chaque page. Vérifier que le sitemap est correct. Ajouter une page 404 custom.

**Fichiers à créer/modifier :**
- `Front-End/src/components/SEO.jsx` → meta tags dynamiques
- `Front-End/src/pages/NotFound.jsx` → page 404 custom
- `Front-End/src/App.jsx` → route `*` vers NotFound
- `Front-End/scripts/generate-sitemap.cjs` → vérifier/mettre à jour

**Dépendances à ajouter :**
- `react-helmet-async` (frontend)

---

## Étape 10 : Ajouter les tests
**[✓] Statut : Complétée**

**Description :** Configurer Vitest pour le frontend et Jest + Supertest pour le backend. Écrire des tests essentiels pour l'authentification et les composants critiques.

**Fichiers à créer :**
- `Back-End/tests/auth.test.js` → tests API auth (register, login, me)
- `Front-End/src/tests/AuthContext.test.jsx` → tests contexte auth
- `Front-End/vitest.config.js` → config Vitest

**Dépendances à ajouter :**
- Backend : `jest`, `supertest`
- Frontend : `vitest`, `@testing-library/react`, `@testing-library/jest-dom`

---

## Étape 11 : Fonctionnalités manquantes prioritaires
**[✓] Statut : Complétée**

**Description :** Implémenter les fonctionnalités clés qui font d'une plateforme éducative une vraie application : progression de l'utilisateur, favoris, page dashboard enrichie.

**Fonctionnalités à ajouter :**
- Tracking de progression par module (quelle page a été visitée)
- Dashboard avec progression visuelle
- Page de profil utilisateur (modification nom/mot de passe)

**Fichiers à créer :**
- `Back-End/db/migrations/003_add_progress.sql`
- `Back-End/routes/progress.js`
- `Front-End/src/pages/ProfilePage.jsx`
- `Front-End/src/pages/DashboardPage.jsx` → enrichi avec progression

---

## Étape 12 : Documentation et déploiement final
**[✓] Statut : Complétée**

**Description :** Créer un `README.md` complet avec instructions de déploiement Vercel + Render. Créer un guide de déploiement pas-à-pas. Vérifier la checklist finale.

**Fichiers à créer :**
- `README.md` → documentation complète
- `DEPLOIEMENT.md` → guide pas-à-pas Vercel + Render
- Checklist finale de production

---

## Notes Générales
- Le backend utilise déjà **Neon PostgreSQL** (cloud) — pas besoin de configurer une BDD locale
- La migration `001_create_users.sql` est déjà prête
- L'UI est entièrement en **français**
- Les couleurs SAP custom (`sapBlue`, `sapBlueDark`, `sapGrayLight`) sont dans `tailwind.config.js`
- Déploiement cible : **Vercel** (frontend) + **Render** (backend)
