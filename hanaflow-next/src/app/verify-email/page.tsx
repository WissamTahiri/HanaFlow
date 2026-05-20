"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyEmailInner() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  // État initial dérivé du token → évite un setState synchrone dans l'effect
  const [state, setState] = useState<"loading" | "ok" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(token ? "" : "Lien invalide.");

  useEffect(() => {
    if (!token) return;
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        const d = await r.json();
        if (r.ok) {
          setState("ok");
          setMessage(d.message ?? "Email confirmé.");
        } else {
          setState("error");
          setMessage(d.message ?? "Lien invalide ou expiré.");
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Erreur réseau, réessaie plus tard.");
      });
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-sap-dark px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-8 space-y-4">
          {state === "loading" && (
            <>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Vérification en cours…</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Merci de patienter quelques secondes.</p>
            </>
          )}
          {state === "ok" && (
            <>
              <div className="text-emerald-600 dark:text-emerald-400 text-4xl">✓</div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{message}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ton email est confirmé. Tu peux maintenant utiliser toutes les fonctionnalités.
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-5 py-2.5 bg-sap-blue text-white rounded-xl text-sm font-semibold hover:bg-sap-blue-dark"
              >
                Aller au dashboard →
              </Link>
            </>
          )}
          {state === "error" && (
            <>
              <div className="text-red-500 text-4xl">✕</div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Échec de la vérification</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Si le lien est expiré, demande un nouveau email depuis ton profil après connexion.
              </p>
              <Link
                href="/login"
                className="inline-block text-sm font-semibold text-sap-blue hover:underline"
              >
                Aller à la connexion →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
