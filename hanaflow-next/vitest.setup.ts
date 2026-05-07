// Variables d'environnement injectées AVANT l'import des modules testés.
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-32chars-minimum-please";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "test-refresh-secret-32chars-minimum";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
