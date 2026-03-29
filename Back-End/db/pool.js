const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("ERREUR : DATABASE_URL manquant dans .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL requis sur Neon/Render, désactivé en local
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Erreur pool PostgreSQL :", err.message);
});

module.exports = pool;
