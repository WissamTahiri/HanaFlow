const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- Mock de la base de données ---
// On remplace db/pool par un faux qui renvoie des données contrôlées
jest.mock("../db/pool", () => ({
  query: jest.fn(),
  end: jest.fn().mockResolvedValue(undefined),
}));

const pool = require("../db/pool");
const { app } = require("../server");

// Utilitaire : génère un vrai hash bcrypt pour les tests
const makeHash = (pw) => bcrypt.hashSync(pw, 1); // cost=1 pour la vitesse en tests

// Utilitaire : génère un token JWT de test valide
const makeToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

// ============================================================
describe("GET /health", () => {
  it("retourne status ok quand la DB répond", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ "?column?": 1 }] });

    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.db).toBe("connected");
  });

  it("retourne 503 si la DB est hors ligne", async () => {
    pool.query.mockRejectedValueOnce(new Error("DB down"));

    const res = await request(app).get("/health");
    expect(res.status).toBe(503);
    expect(res.body.status).toBe("error");
  });
});

// ============================================================
describe("POST /auth/register", () => {
  it("inscrit un nouvel utilisateur et retourne un token", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // email inexistant
      .mockResolvedValueOnce({             // INSERT réussi
        rows: [{ id: 1, name: "Wissam", email: "w@test.com", role: "student" }],
      })
      .mockResolvedValueOnce({ rows: [] }); // saveRefreshToken

    const res = await request(app).post("/auth/register").send({
      name: "Wissam",
      email: "w@test.com",
      password: "motdepasse123",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("w@test.com");
    expect(res.body.user.password_hash).toBeUndefined(); // jamais exposé
  });

  it("rejette si l'email est déjà utilisé", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // email existant

    const res = await request(app).post("/auth/register").send({
      name: "Wissam",
      email: "existing@test.com",
      password: "motdepasse123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email déjà utilisé");
  });

  it("rejette si le mot de passe est trop court", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Wissam",
      email: "w@test.com",
      password: "court",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/8 caractères/);
  });

  it("rejette si l'email est invalide", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Wissam",
      email: "pas-un-email",
      password: "motdepasse123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Email invalide/);
  });
});

// ============================================================
describe("POST /auth/login", () => {
  it("connecte un utilisateur avec les bons identifiants", async () => {
    const hash = makeHash("motdepasse123");
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 1, name: "Wissam", email: "w@test.com", role: "student", password_hash: hash }],
      })
      .mockResolvedValueOnce({ rows: [] }); // saveRefreshToken

    const res = await request(app).post("/auth/login").send({
      email: "w@test.com",
      password: "motdepasse123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("w@test.com");
  });

  it("rejette un mauvais mot de passe", async () => {
    const hash = makeHash("motdepasse123");
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: "w@test.com", password_hash: hash }],
    });

    const res = await request(app).post("/auth/login").send({
      email: "w@test.com",
      password: "mauvaismdp",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Identifiants invalides");
  });

  it("ne révèle pas si l'email n'existe pas (même message)", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // email inconnu

    const res = await request(app).post("/auth/login").send({
      email: "inconnu@test.com",
      password: "motdepasse123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Identifiants invalides"); // même message = bonne pratique sécurité
  });
});

// ============================================================
describe("GET /auth/me", () => {
  it("retourne le profil avec un token valide", async () => {
    const token = makeToken({ id: 1, email: "w@test.com" });
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, name: "Wissam", email: "w@test.com", role: "student" }],
    });

    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("w@test.com");
  });

  it("retourne 401 sans token", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token manquant");
  });

  it("retourne 401 avec un token invalide", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer token.bidon.invalide");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token invalide ou expiré");
  });
});
