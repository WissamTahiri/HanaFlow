"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("8 caractères minimum.");
    if (password !== confirm) return setError("Les mots de passe ne correspondent pas.");
    setSubmitting(true);
    try {
      const r = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message ?? "Erreur");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Nouveau mot de passe</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choisis un mot de passe fort. Toutes tes sessions actives seront déconnectées.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-8">
          {!token ? (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              Lien invalide. Refais une demande depuis la page <Link href="/forgot-password" className="underline">mot de passe oublié</Link>.
            </p>
          ) : done ? (
            <div className="text-center space-y-3">
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Mot de passe mis à jour ✓
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Redirection vers la page de connexion…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="password" className="label">Nouveau mot de passe</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">
                  8 caractères min, au moins une lettre et un chiffre. Pas dans une fuite connue.
                </p>
              </div>
              <div>
                <label htmlFor="confirm" className="label">Confirmer</label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !password || !confirm}
                className="w-full btn-primary justify-center py-3 text-base"
              >
                {submitting ? "Mise à jour…" : "Définir le nouveau mot de passe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
