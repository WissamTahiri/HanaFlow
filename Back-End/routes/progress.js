const express = require("express");
const pool = require("../db/pool");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Modules SAP valides
const VALID_MODULES = ["fi", "co", "mm", "sd", "hcm", "pp"];

// GET /progress — Récupère la progression de l'utilisateur connecté
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT module, visited_at FROM user_progress WHERE user_id = $1 ORDER BY visited_at ASC",
      [req.user.id]
    );
    res.json({ progress: result.rows });
  } catch (err) {
    next(err);
  }
});

// POST /progress/:module — Marque un module comme visité
router.post("/:module", authMiddleware, async (req, res, next) => {
  try {
    const { module } = req.params;

    if (!VALID_MODULES.includes(module.toLowerCase())) {
      return res.status(400).json({ message: "Module invalide" });
    }

    // INSERT OR UPDATE (upsert) : met à jour visited_at si déjà visité
    await pool.query(
      `INSERT INTO user_progress (user_id, module)
       VALUES ($1, $2)
       ON CONFLICT (user_id, module) DO UPDATE SET visited_at = NOW()`,
      [req.user.id, module.toLowerCase()]
    );

    res.json({ message: "Progression enregistrée", module });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
