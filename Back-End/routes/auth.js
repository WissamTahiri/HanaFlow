const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const pool = require("../db/pool");
const authMiddleware = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const IS_PROD = process.env.NODE_ENV === "production";

// ============================================================
// Rate limiting
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
// Règles de validation
// ============================================================
const registerRules = [
  body("name").trim().notEmpty().withMessage("Le nom est requis").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Mot de passe : 8 caractères minimum"),
];

const loginRules = [
  body("email").trim().isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

const profileRules = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Le nom ne peut pas être vide")
    .isLength({ max: 100 }),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Nouveau mot de passe : 8 caractères minimum"),
];

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

const cookieOptions = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? "none" : "lax",
  maxAge: parseRefreshExpiry(JWT_REFRESH_EXPIRES_IN),
  path: "/",
};

// ============================================================
// Routes
// ============================================================

// POST /auth/register
router.post("/register", authLimiter, registerRules, validate, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const password_hash = await bcrypt.hash(password, 10);
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
router.post("/login", authLimiter, loginRules, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
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
router.patch("/profile", authMiddleware, profileRules, validate, async (req, res, next) => {
  try {
    const { name, password } = req.body;
    if (!name && !password) {
      return res.status(400).json({ message: "Rien à mettre à jour" });
    }

    const updates = [];
    const values = [];
    let idx = 1;

    if (name) { updates.push(`name = $${idx++}`); values.push(name); }
    if (password) {
      updates.push(`password_hash = $${idx++}`);
      values.push(await bcrypt.hash(password, 10));
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
