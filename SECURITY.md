# Sécurité — HanaFlow

Ce document décrit les mesures de sécurité mises en place dans HanaFlow et comment les configurer.

---

## 1. Authentification & Gestion des sessions

### JWT (JSON Web Tokens)

| Élément | Implémentation |
|---------|----------------|
| Algorithme | HS256 (HMAC-SHA256) |
| Durée d'accès | 1h (configurable via `JWT_EXPIRES_IN`) |
| Durée refresh | 7j (configurable via `JWT_REFRESH_EXPIRES_IN`) |
| Stockage refresh | Cookie `httpOnly; Secure; SameSite` |
| Rotation | Oui — chaque `/auth/refresh` invalide l'ancien token |
| Révocation | Oui — table `refresh_tokens` en base (hash SHA-256) |

Les refresh tokens ne sont **jamais** stockés en clair. Seul leur hash SHA-256 est conservé en base de données.

### Secrets JWT

Générer des secrets cryptographiquement sûrs :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Exécuter deux fois : une pour `JWT_SECRET`, une pour `JWT_REFRESH_SECRET`. Ils doivent être **différents**.

---

## 2. Hachage des mots de passe — Argon2id

**Algorithme utilisé : Argon2id** (gagnant du Password Hashing Competition 2015, recommandé OWASP 2024).

- Résistant aux attaques GPU/ASIC
- Paramètres par défaut de la librairie `argon2` (mémoire 64 MB, parallélisme 4)
- Jamais de bcrypt ou MD5/SHA pour les mots de passe

**Politique de mots de passe :**
- Minimum 8 caractères
- Maximum 128 caractères (prévention des attaques DoS via hash de mots de passe longs)
- Au moins 1 lettre et 1 chiffre
- Validé côté serveur via Zod (ne pas faire confiance au client)

---

## 3. Validation des entrées — Zod

Toutes les entrées utilisateur sont validées avec **Zod** avant tout traitement :

- `POST /auth/register` : name, email, password
- `POST /auth/login` : email, password
- `PATCH /auth/profile` : name (optionnel), password (optionnel)

Les données sont **normalisées** après validation (email en minuscules, trim des espaces).

---

## 4. Protection contre les attaques par force brute

**express-rate-limit** est appliqué sur toutes les routes d'authentification :

- 15 tentatives maximum par fenêtre de 15 minutes (configurable)
- Par IP source (avec `trust proxy` pour les proxies Render)
- Message d'erreur générique (ne révèle pas si l'email existe)
- En-têtes `RateLimit-*` standard (RFC 6585)

---

## 5. Headers de sécurité HTTP — Helmet

**Helmet.js** configure automatiquement les headers suivants :

| Header | Valeur | Protection |
|--------|--------|------------|
| `Content-Security-Policy` | Voir ci-dessous | XSS, injection |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `X-Frame-Options` | `DENY` | Clickjacking |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | HTTPS forcé (prod) |
| `Referrer-Policy` | `no-referrer` | Fuite de referer |
| `X-XSS-Protection` | `0` (désactivé — CSP est plus efficace) | — |

### Content Security Policy (CSP)

```
default-src 'self'
script-src  'self'
style-src   'self' 'unsafe-inline'
img-src     'self' data: https:
connect-src 'self' [origines autorisées]
font-src    'self' https: data:
object-src  'none'
media-src   'none'
frame-src   'none'
frame-ancestors 'none'
base-uri    'self'
form-action 'self'
upgrade-insecure-requests (production uniquement)
```

---

## 6. CORS

Seules les origines listées dans `ALLOWED_ORIGINS` peuvent accéder à l'API.

```env
# Exemple
ALLOWED_ORIGINS=https://hanaflow.vercel.app,http://localhost:5173
```

- `credentials: true` requis pour les cookies httpOnly
- Les méthodes autorisées sont explicitement listées

---

## 7. Protection des données — Logs

Les logs Morgan **ne contiennent jamais** :
- Adresses IP des utilisateurs
- Corps des requêtes (mots de passe, emails)
- Cookies ou tokens

En production, les logs sont en format JSON structuré. Sentry filtre également les données sensibles avant envoi.

---

## 8. Monitoring des erreurs — Sentry

Sentry est initialisé **uniquement en production** (`NODE_ENV=production`).

**Données filtrées avant envoi à Sentry :**
- Cookies de la requête
- Champs `password` et `email` du corps de requête
- Query parameters des URLs (peuvent contenir des tokens)

Configuration :
```env
# Backend
SENTRY_DSN=https://xxx@oyyy.ingest.sentry.io/zzz

# Frontend
VITE_SENTRY_DSN=https://xxx@oyyy.ingest.sentry.io/zzz
```

---

## 9. Conformité OWASP Top 10 (2021)

| # | Risque | Statut | Mesure |
|---|--------|--------|--------|
| A01 | Broken Access Control | ✅ Couvert | JWT middleware, routes protégées, ProtectedRoute |
| A02 | Cryptographic Failures | ✅ Couvert | Argon2id, HTTPS forcé (HSTS), cookies Secure |
| A03 | Injection | ✅ Couvert | Requêtes paramétrées (`$1, $2`), Zod validation |
| A04 | Insecure Design | ✅ Couvert | Rotation refresh tokens, hash SHA-256, rate limiting |
| A05 | Security Misconfiguration | ✅ Couvert | Helmet CSP, CORS strict, variables d'env validées |
| A06 | Vulnerable Components | ✅ Couvert | `npm audit` — 0 vulnérabilité (vérifier régulièrement) |
| A07 | Auth Failures | ✅ Couvert | Rate limiting, message générique, httpOnly cookies |
| A08 | Software Integrity Failures | ✅ Couvert | Package-lock.json, pas de CDN externe |
| A09 | Logging Failures | ✅ Couvert | Morgan + Sentry, logs sans PII |
| A10 | SSRF | ✅ N/A | Aucune requête HTTP sortante initiée par l'utilisateur |

---

## 10. Dépendances — audit de sécurité

Vérifier régulièrement :

```bash
# Backend
cd Back-End && npm audit

# Frontend
cd Front-End && npm audit
```

État actuel : **0 vulnérabilité** sur les deux projets.

---

## 11. Variables d'environnement critiques

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `JWT_SECRET` | Oui | Secret JWT (min 64 chars aléatoires) |
| `JWT_REFRESH_SECRET` | Oui | Secret refresh token (différent de JWT_SECRET) |
| `DATABASE_URL` | Oui | URL PostgreSQL avec `sslmode=verify-full` |
| `ALLOWED_ORIGINS` | Oui (prod) | Origines CORS autorisées |
| `SENTRY_DSN` | Non | DSN Sentry (monitoring production) |

---

## 12. Signaler une vulnérabilité

Si vous découvrez une faille de sécurité, ne pas créer d'issue publique. Contacter directement les mainteneurs.

---

*Dernière mise à jour : 2026-03-28*
