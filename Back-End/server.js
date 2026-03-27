require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const pool = require("./db/pool");

const authRoutes = require("./routes/auth");
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
// Application Express
// ============================================================
const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
  morgan(IS_PROD ? "combined" : "dev", {
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
