"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Phase = "idle" | "enrolling" | "verifying" | "disabling" | "showing-codes" | "regenerating";

export default function TwoFactorSection() {
  const { user, token } = useAuth();
  const [phase, setPhase] = useState<Phase>("idle");
  const [secret, setSecret] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [remainingCodes, setRemainingCodes] = useState<number | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!user?.totpEnabled || !token) return;
    fetch("/api/auth/2fa/backup-codes", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setRemainingCodes(d.remaining);
      })
      .catch(() => {});
  }, [user?.totpEnabled, token]);

  if (!user) return null;
  const isEnabled = user.totpEnabled === true;

  const reset = () => {
    setPhase("idle");
    setSecret("");
    setQrDataUrl("");
    setCode("");
    setPassword("");
    setError("");
    setInfo("");
    setBackupCodes([]);
    setAcknowledged(false);
  };

  const startEnroll = async () => {
    setBusy(true); setError(""); setInfo("");
    try {
      const r = await fetch("/api/auth/2fa/enroll", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setSecret(d.secret);
      setQrDataUrl(d.qrDataUrl);
      setPhase("enrolling");
    } catch {
      setError("Erreur réseau");
    } finally {
      setBusy(false);
    }
  };

  const verifyEnroll = async () => {
    if (code.length < 6) return;
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/auth/2fa/verify-enroll", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      // Affiche les codes de récupération AVANT de finir
      setBackupCodes(d.backupCodes ?? []);
      setPhase("showing-codes");
      setCode("");
      setSecret("");
      setQrDataUrl("");
    } catch {
      setError("Erreur réseau");
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    if (code.length < 6 || password.length === 0) return;
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, password }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setInfo("2FA désactivée");
      reset();
      window.location.reload();
    } catch {
      setError("Erreur réseau");
    } finally {
      setBusy(false);
    }
  };

  const regenerate = async () => {
    if (code.length < 6 || password.length === 0) return;
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/auth/2fa/backup-codes", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, password }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setBackupCodes(d.backupCodes ?? []);
      setRemainingCodes((d.backupCodes ?? []).length);
      setPhase("showing-codes");
      setCode("");
      setPassword("");
    } catch {
      setError("Erreur réseau");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Authentification à deux facteurs (2FA)</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sécurise ton compte avec un code à 6 chiffres généré par une app (Google Authenticator, Authy, 1Password…).
          </p>
        </div>
        <span className={`flex-shrink-0 inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
          isEnabled
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
        }`}>
          {isEnabled ? "Activée" : "Désactivée"}
        </span>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}
      {info && <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">{info}</div>}

      {phase === "idle" && (
        <div className="space-y-3">
          {!isEnabled ? (
            <button
              onClick={startEnroll}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-sap-blue text-white text-sm font-semibold hover:bg-sap-blue-dark transition-colors disabled:opacity-40"
            >
              Activer la 2FA
            </button>
          ) : (
            <>
              {remainingCodes !== null && (
                <div className={`p-3 rounded-lg text-sm ${
                  remainingCodes <= 2
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
                    : "bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300"
                }`}>
                  <strong>{remainingCodes}</strong> code{remainingCodes > 1 ? "s" : ""} de récupération restant{remainingCodes > 1 ? "s" : ""}.
                  {remainingCodes <= 2 && " Régénère-en pour ne pas te retrouver bloqué."}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPhase("regenerating")}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Régénérer codes de récupération
                </button>
                <button
                  onClick={() => setPhase("disabling")}
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 text-sm font-semibold transition-colors"
                >
                  Désactiver la 2FA
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {phase === "enrolling" && (
        <div className="space-y-4">
          <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-decimal pl-5">
            <li>Ouvre ton app d&apos;authentification (Google Authenticator, Authy, 1Password…)</li>
            <li>Scanne le QR code ci-dessous OU saisis le secret manuellement</li>
            <li>Entre le code à 6 chiffres généré pour valider</li>
          </ol>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR code 2FA" className="w-48 h-48 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white p-2 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Secret manuel</p>
              <code className="block text-sm font-mono bg-gray-50 dark:bg-slate-900 p-3 rounded-lg break-all">{secret}</code>
              <button
                onClick={() => navigator.clipboard?.writeText(secret)}
                className="mt-2 text-xs text-sap-blue hover:underline"
              >
                Copier le secret
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Code de vérification (6 chiffres)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full max-w-[200px] px-4 py-2.5 text-center tracking-[0.4em] font-mono text-lg rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
              placeholder="••••••"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={verifyEnroll}
              disabled={busy || code.length < 6}
              className="px-4 py-2 rounded-lg bg-sap-blue text-white text-sm font-semibold hover:bg-sap-blue-dark transition-colors disabled:opacity-40"
            >
              {busy ? "Vérification…" : "Activer"}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {phase === "showing-codes" && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
              ⚠️ Sauvegarde ces codes maintenant
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Chaque code n&apos;est utilisable qu&apos;une seule fois. Ils te permettent de te connecter
              si tu perds ton téléphone. Ils ne seront plus jamais affichés.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm">
            {backupCodes.map((c) => (
              <div key={c} className="text-slate-900 dark:text-slate-100 select-all">{c}</div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigator.clipboard?.writeText(backupCodes.join("\n"))}
              className="px-3 py-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Copier tous
            </button>
            <button
              onClick={() => {
                const blob = new Blob([`Codes de récupération HanaFlow — ${new Date().toLocaleDateString("fr-FR")}\n\n${backupCodes.join("\n")}\n`], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `hanaflow-backup-codes-${new Date().toISOString().slice(0, 10)}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Télécharger (.txt)
            </button>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5"
            />
            J&apos;ai sauvegardé mes codes de récupération dans un endroit sûr.
          </label>

          <button
            onClick={() => { reset(); window.location.reload(); }}
            disabled={!acknowledged}
            className="px-4 py-2 rounded-lg bg-sap-blue text-white text-sm font-semibold hover:bg-sap-blue-dark transition-colors disabled:opacity-40"
          >
            Terminé
          </button>
        </div>
      )}

      {(phase === "disabling" || phase === "regenerating") && (
        <div className="space-y-3 max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {phase === "disabling"
              ? "Pour désactiver la 2FA, confirme avec ton mot de passe et un code valide."
              : "Pour régénérer les codes, confirme avec ton mot de passe et un code TOTP valide."}
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Mot de passe</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              {phase === "disabling" ? "Code 2FA ou code de récupération" : "Code 2FA (6 chiffres)"}
            </label>
            <input
              type="text"
              inputMode={phase === "regenerating" ? "numeric" : "text"}
              pattern={phase === "regenerating" ? "[0-9]*" : undefined}
              maxLength={phase === "disabling" ? 12 : 6}
              value={code}
              onChange={(e) => setCode(phase === "regenerating" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value.slice(0, 12))}
              className="w-full px-3 py-2 text-center tracking-[0.2em] font-mono rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
              placeholder={phase === "disabling" ? "123456 ou abcde-fghij" : "••••••"}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={phase === "disabling" ? disable : regenerate}
              disabled={busy || code.length < 6 || password.length === 0}
              className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-40 ${
                phase === "disabling" ? "bg-red-600 hover:bg-red-700" : "bg-sap-blue hover:bg-sap-blue-dark"
              }`}
            >
              {busy ? "…" : phase === "disabling" ? "Désactiver la 2FA" : "Régénérer"}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
