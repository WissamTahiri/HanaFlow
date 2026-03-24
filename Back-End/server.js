require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db/pool");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

// --- Middleware globaux ---

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Rate limiting sur les routes d'authentification (15 tentatives / 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: "Trop de tentatives, réessaie dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Règles de validation ---

const registerRules = [
  body("name").trim().notEmpty().withMessage("Le nom est requis").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Mot de passe : 8 caractères minimum"),
];

const loginRules = [
  body("email").trim().isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

// Middleware qui renvoie les erreurs de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

// --- Helpers ---

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// --- Routes ---

app.get("/", (req, res) => {
  res.json({ message: "HanaFlow API OK" });
});

// REGISTER
app.post("/auth/register", authLimiter, registerRules, validate, async (req, res) => {
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
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// LOGIN
app.post("/auth/login", authLimiter, loginRules, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    // Même message volontairement pour ne pas révéler si l'email existe
    if (!user) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const token = generateToken(user);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ME
app.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ user });
  } catch (err) {
    console.error("Me error:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`API HanaFlow en écoute sur le port ${PORT}`);
});
