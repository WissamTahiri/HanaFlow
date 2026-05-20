"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const r = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message ?? "Erreur");
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur réseau, réessaie plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-sap-dark px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Mot de passe oublié</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Saisis l&apos;email associé à ton compte. Tu recevras un lien pour choisir un nouveau mot de passe.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-8">
          {done ? (
            <div className="text-center space-y-3">
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Email envoyé (si le compte existe)
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Vérifie ta boîte de réception. Le lien est valable 1 heure et ne peut servir qu&apos;une fois.
              </p>
              <Link
                href="/login"
                className="inline-block text-sm font-semibold text-sap-blue hover:underline"
              >
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="email" className="label">Adresse email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input"
                  placeholder="toi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !email}
                className="w-full btn-primary justify-center py-3 text-base"
              >
                {submitting ? "Envoi en cours…" : "Envoyer le lien"}
              </button>
              <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                <Link href="/login" className="font-semibold text-sap-blue hover:underline">
                  ← Retour à la connexion
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
