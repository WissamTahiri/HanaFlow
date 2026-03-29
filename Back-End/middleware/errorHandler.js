const IS_PROD = process.env.NODE_ENV === "production";

// Middleware global de gestion des erreurs (doit être déclaré en dernier dans server.js)
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Erreur CORS
  if (err.message && err.message.startsWith("CORS:")) {
    return res.status(403).json({ message: err.message });
  }

  const status = err.status || err.statusCode || 500;
  const message = IS_PROD ? "Erreur serveur" : err.message;

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}: ${err.message}`);

  res.status(status).json({ message });
};

module.exports = errorHandler;
