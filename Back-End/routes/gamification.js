const express = require("express");
const pool = require("../db/pool");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const VALID_BADGES = [
  "welcome", "first_module", "explorer", "sap_expert",
  "lesson_fi", "lesson_co", "lesson_mm", "lesson_sd",
  "quiz_perfect", "quiz_pass",
  "exam_fi", "exam_co", "exam_mm", "exam_sd", "exam_hcm", "exam_pp", "exam_pass",
  "streak_3", "streak_7",
  "pro_member",
];

const BADGE_XP = {
  welcome: 50, first_module: 100, explorer: 150, sap_expert: 300,
  lesson_fi: 150, lesson_co: 150, lesson_mm: 150, lesson_sd: 150,
  quiz_perfect: 200, quiz_pass: 200,
  exam_fi: 300, exam_co: 300, exam_mm: 300, exam_sd: 300, exam_hcm: 300, exam_pp: 300, exam_pass: 500,
  streak_3: 100, streak_7: 250,
  pro_member: 100,
};

// Initialise la ligne gamification si elle n'existe pas encore (upsert sans modification)
async function ensureRow(userId) {
  await pool.query(
    `INSERT INTO user_gamification (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
    [userId]
  );
}

// GET /gamification — état complet de la gamification pour l'utilisateur connecté
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    await ensureRow(req.user.id);
    const result = await pool.query(
      "SELECT xp, badges, streak, last_login, quiz_pass_count FROM user_gamification WHERE user_id = $1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /gamification/event — traite un événement et met à jour XP/badges
// body: { type: "login" | "module_visit" | "lesson_complete" | "quiz_pass" | "exam_complete" | "pro_activated",
//         payload: { module?, score100?, passed?, visitedCount?, lessonCount? } }
router.post("/event", authMiddleware, async (req, res, next) => {
  const { type, payload = {} } = req.body;
  if (!type) return res.status(400).json({ message: "type requis" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await ensureRow(req.user.id);

    const { rows } = await client.query(
      "SELECT xp, badges, streak, last_login, quiz_pass_count FROM user_gamification WHERE user_id = $1 FOR UPDATE",
      [req.user.id]
    );
    let { xp, badges, streak, last_login, quiz_pass_count } = rows[0];

    const newBadges = [];
    let xpDelta = 0;

    const hasBadge = (id) => badges.includes(id);
    const award = (id) => {
      if (!hasBadge(id) && VALID_BADGES.includes(id)) {
        badges = [...badges, id];
        newBadges.push(id);
        xpDelta += BADGE_XP[id] || 0;
      }
    };

    switch (type) {
      case "login": {
        award("welcome");
        const today = new Date().toISOString().split("T")[0];
        if (!last_login || last_login.toISOString().split("T")[0] !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          const lastStr = last_login ? last_login.toISOString().split("T")[0] : null;
          streak = lastStr === yesterday ? streak + 1 : 1;
          last_login = today;
          if (streak >= 7) award("streak_7");
          else if (streak >= 3) award("streak_3");
        }
        break;
      }
      case "module_visit": {
        const count = payload.visitedCount ?? 1;
        if (count >= 1) award("first_module");
        if (count >= 3) award("explorer");
        if (count >= 6) award("sap_expert");
        break;
      }
      case "lesson_complete": {
        xpDelta += 25;
        const { module, lessonCount } = payload;
        if (lessonCount >= 5 && module) award(`lesson_${module}`);
        break;
      }
      case "quiz_pass": {
        const { score100 } = payload;
        xpDelta += score100 === 100 ? 150 : 75;
        if (score100 === 100) award("quiz_perfect");
        quiz_pass_count += 1;
        if (quiz_pass_count >= 3) award("quiz_pass");
        break;
      }
      case "exam_complete": {
        const { module, passed } = payload;
        xpDelta += passed ? 400 : 150;
        if (module) award(`exam_${module}`);
        if (passed) award("exam_pass");
        break;
      }
      case "pro_activated": {
        award("pro_member");
        break;
      }
      default:
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `type inconnu : ${type}` });
    }

    xp += xpDelta;

    await client.query(
      `UPDATE user_gamification
       SET xp = $1, badges = $2, streak = $3, last_login = $4, quiz_pass_count = $5, updated_at = NOW()
       WHERE user_id = $6`,
      [xp, badges, streak, last_login, quiz_pass_count, req.user.id]
    );

    await client.query("COMMIT");
    res.json({ xp, badges, streak, last_login, quiz_pass_count, newBadges, xpDelta });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
