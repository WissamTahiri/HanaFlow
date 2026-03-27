// Variables d'environnement injectées avant chaque suite de tests
// (évite de dépendre du .env local)
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-jest-hanaflow-minimum-64-chars-long-padding-here-ok";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-jest-hanaflow-64-chars-padding-here-ok-!!";
process.env.JWT_EXPIRES_IN = "1h";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";
process.env.ALLOWED_ORIGINS = "http://localhost:5173";
process.env.PORT = "5001";
