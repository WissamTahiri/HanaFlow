import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

// ============================================================
// Sentry — monitoring des erreurs frontend (production seulement)
// ============================================================
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Ne capturer que 10% des transactions pour éviter les coûts
    tracesSampleRate: 0.1,
    // Ne pas envoyer les données personnelles
    beforeSend(event) {
      if (event.request?.url) {
        // Supprimer les query params qui pourraient contenir des tokens
        try {
          const url = new URL(event.request.url);
          url.search = "";
          event.request.url = url.toString();
        } catch {
          // URL invalide, on ne modifie pas
        }
      }
      return event;
    },
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
