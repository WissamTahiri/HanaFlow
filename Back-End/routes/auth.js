const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { z } = require("zod");
const rateLimit = require("express-rate-limit");

const pool = require("../db/pool");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const IS_PROD = process.env.NODE_ENV === "production";

// ============================================================
// Rate limiting — authentification (brute force protection)
// ============================================================
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 15;

const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  message: { message: "Trop de tentatives, réessaie dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================
// Schémas Zod — validation stricte des entrées
// ============================================================
const nameField = z.string().trim().min(1, "Le nom est requis").max(100, "Nom trop long");

const emailField = z
  .string()
  .trim()
  .email("Email invalide")
  .max(255, "Email trop long")
  .transform((v) => v.toLowerCase());

// Mot de passe : 8 chars min, au moins 1 lettre et 1 chiffre
const passwordField = z
  .string()
  .min(8, "Mot de passe : 8 caractères minimum")
  .max(128, "Mot de passe trop long")
  .regex(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

const registerSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
});

const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Mot de passe requis"),
});

const profileSchema = z
  .object({
    name: nameField.optional(),
    password: passwordField.optional(),
  })
  .refine((d) => d.name || d.password, { message: "Rien à mettre à jour" });

// Middleware Zod générique
const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const msg = result.error.issues[0]?.message || "Données invalides";
    return res.status(400).json({ message: msg });
  }
  req.body = result.data; // remplace req.body par les données transformées/nettoyées
  next();
};

// ============================================================
// Helpers — Tokens
// ============================================================
const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const generateRefreshToken = () => crypto.randomBytes(64).toString("hex");
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const parseRefreshExpiry = (str) => {
  const match = str.match(/^(\d+)([dhm])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const [, n, unit] = match;
  const units = { d: 86400000, h: 3600000, m: 60000 };
  return parseInt(n) * units[unit];
};

const saveRefreshToken = async (userId, rawToken) => {
  const hash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + parseRefreshExpiry(JWT_REFRESH_EXPIRES_IN));
  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [userId, hash, expiresAt]
  );
};

// Options cookie refresh token
const cookieOptions = {
  httpOnly: true,                          // Inaccessible depuis JS (protection XSS)
  secure: IS_PROD,                         // HTTPS uniquement en production
  sameSite: IS_PROD ? "none" : "lax",      // Cross-site pour Vercel ↔ Render
  maxAge: parseRefreshExpiry(JWT_REFRESH_EXPIRES_IN),
  path: "/",
};

// ============================================================
// Routes
// ============================================================

// POST /auth/register
router.post("/register", authLimiter, validateBody(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Argon2id : algorithme recommandé 2024 (gagnant du Password Hashing Competition)
    const password_hash = await argon2.hash(password, { type: argon2.argon2id });
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, password_hash]
    );
    const user = result.rows[0];

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    await saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({ user, token: accessToken });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post("/login", authLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    // Même message pour email inexistant et mauvais mdp (évite l'énumération d'emails)
    const validPassword = user && (await argon2.verify(user.password_hash, password));
    if (!user || !validPassword) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    await saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/refresh
router.post("/refresh", async (req, res, next) => {
  const rawToken = req.cookies?.refreshToken;
  if (!rawToken) return res.status(401).json({ message: "Refresh token manquant" });

  try {
    const hash = hashToken(rawToken);
    const result = await pool.query(
      `SELECT rt.*, u.id as uid, u.name, u.email, u.role
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1 AND rt.expires_at > NOW()`,
      [hash]
    );

    const row = result.rows[0];
    if (!row) {
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(401).json({ message: "Refresh token invalide ou expiré" });
    }

    // Rotation : suppression de l'ancien, création d'un nouveau
    await pool.query("DELETE FROM refresh_tokens WHERE token_hash = $1", [hash]);

    const user = { id: row.uid, name: row.name, email: row.email, role: row.role };
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();
    await saveRefreshToken(user.id, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    res.json({ token: newAccessToken, user });
  } catch (err) {
    next(err);
  }
});

// POST /auth/logout
router.post("/logout", async (req, res, next) => {
  try {
    const rawToken = req.cookies?.refreshToken;
    if (rawToken) {
      const hash = hashToken(rawToken);
      await pool.query("DELETE FROM refresh_tokens WHERE token_hash = $1", [hash]);
    }
    res.clearCookie("refreshToken", cookieOptions);
    res.json({ message: "Déconnecté avec succès" });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PATCH /auth/profile
router.patch("/profile", authMiddleware, validateBody(profileSchema), async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (name) { updates.push(`name = $${idx++}`); values.push(name); }
    if (password) {
      updates.push(`password_hash = $${idx++}`);
      values.push(await argon2.hash(password, { type: argon2.argon2id }));
    }

    values.push(req.user.id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${idx} RETURNING id, name, email, role`,
      values
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
