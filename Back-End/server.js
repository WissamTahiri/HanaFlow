require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const Sentry = require("@sentry/node");
const pool = require("./db/pool");

const authRoutes = require("./routes/auth");
const progressRoutes = require("./routes/progress");
const gamificationRoutes = require("./routes/gamification");
const errorHandler = require("./middleware/errorHandler");

// ============================================================
// Validation des variables critiques au démarrage
// ============================================================
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("FATAL: JWT_SECRET et JWT_REFRESH_SECRET sont requis.");
  process.exit(1);
}

// ============================================================
// Sentry — monitoring des erreurs (production)
// ============================================================
if (IS_PROD && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: NODE_ENV,
    // Ne pas envoyer les données personnelles
    beforeSend(event) {
      // Supprimer les données sensibles du contexte request
      if (event.request) {
        delete event.request.cookies;
        if (event.request.data) {
          const data = event.request.data;
          if (data.password) data.password = "[FILTERED]";
          if (data.email) data.email = "[FILTERED]";
        }
      }
      return event;
    },
  });
}

// ============================================================
// CORS
// ============================================================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origine non autorisée — ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ============================================================
// Morgan — masquage des données sensibles dans les logs
// ============================================================
// En production : format JSON structuré, sans corps de requête
// En développement : format lisible
const morganFormat = IS_PROD
  ? (tokens, req, res) => {
      return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        responseTime: tokens["response-time"](req, res) + "ms",
        // Pas d'IP ni de corps — respect de la vie privée
      });
    }
  : "dev";

// ============================================================
// Application Express
// ============================================================
const app = express();
app.set("trust proxy", 1);

// Helmet avec Content Security Policy renforcée
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],   // unsafe-inline requis pour certains emails HTML
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", ...allowedOrigins],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'none'"],
        frameAncestors: ["'none'"],                // anti-clickjacking
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: IS_PROD ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false, // désactivé pour éviter les blocages CORS légitimes
    hsts: IS_PROD
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
  morgan(morganFormat, {
    skip: (req) => req.path === "/health",
  })
);

// ============================================================
// Routes
// ============================================================

// Health check (Render)
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected", env: NODE_ENV });
  } catch {
    res.status(503).json({ status: "error", db: "unreachable" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "HanaFlow API OK", env: NODE_ENV });
});

// Routes d'authentification
app.use("/auth", authRoutes);

// Routes de progression
app.use("/progress", progressRoutes);

// Routes de gamification
app.use("/gamification", gamificationRoutes);

// ============================================================
// Gestion des erreurs (doit être en dernier)
// ============================================================
app.use(errorHandler);

// ============================================================
// Démarrage + Graceful Shutdown
// ============================================================

// On exporte l'app pour les tests (supertest) sans démarrer le serveur
module.exports = { app };

// En production/dev, on démarre le serveur normalement
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`[HanaFlow API] env=${NODE_ENV} port=${PORT} origins=${allowedOrigins.join(", ")}`);
  });

  const shutdown = (signal) => {
    console.log(`[HanaFlow API] ${signal} reçu — arrêt gracieux en cours...`);
    server.close(async () => {
      await pool.end().catch(() => {});
      console.log("[HanaFlow API] Connexions fermées. Au revoir.");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
