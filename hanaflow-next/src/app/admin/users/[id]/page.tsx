"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const MODULES = [
  { id: "fi",  label: "FI — Financial Accounting" },
  { id: "co",  label: "CO — Controlling" },
  { id: "mm",  label: "MM — Materials Management" },
  { id: "sd",  label: "SD — Sales & Distribution" },
  { id: "hcm", label: "HCM — Human Capital" },
  { id: "pp",  label: "PP — Production Planning" },
];

interface UserDetail {
  id: number;
  name: string;
  email: string;
  role: string;
  isPro: boolean;
  isSuspended: boolean;
  createdAt: string;
  progress: { module: string; visitedAt: string }[];
  _count: { refreshTokens: number };
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, user: me } = useAuth();
  const [data, setData] = useState<UserDetail | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const [editName, setEditName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!token) return;
    setError("");
    try {
      const r = await fetch(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setData(d.user);
      setEditName(d.user.name);
    } catch {
      setError("Erreur réseau");
    }
  }, [id, token]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const patch = async (body: Record<string, unknown>, successMsg: string) => {
    if (!token || !data) return;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const r = await fetch(`/api/admin/users/${data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setInfo(successMsg);
      await fetchUser();
    } catch {
      setError("Erreur réseau");
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError("Le mot de passe doit faire 8 caractères minimum");
      return;
    }
    await patch(
      { password: newPassword },
      `Mot de passe réinitialisé. L'utilisateur a été déconnecté de toutes ses sessions.`,
    );
    setNewPassword("");
    setShowResetForm(false);
  };

  const handleDelete = async () => {
    if (!data || !token) return;
    if (!confirm(`Supprimer définitivement ${data.name} (${data.email}) ? Cette action est irréversible.`)) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/users/${data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!r.ok) { const d = await r.json(); setError(d.message ?? "Erreur"); setBusy(false); return; }
      router.push("/admin/users");
    } catch {
      setError("Erreur réseau");
      setBusy(false);
    }
  };

  if (!data && !error) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <div className="w-4 h-4 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
        Chargement...
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
        <Link href="/admin/users" className="text-sm text-sap-blue hover:underline">← Retour</Link>
      </div>
    );
  }

  if (!data) return null;

  const visitedMap = new Map(data.progress.map((p) => [p.module, p.visitedAt]));
  const progressCount = data.progress.length;
  const isSelf = me?.id === data.id;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/users" className="text-xs text-sap-blue hover:underline">← Liste des utilisateurs</Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{data.name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{data.email}</p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}
      {info && <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">{info}</div>}

      {/* Identité */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Identité</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">ID</p>
            <p className="font-mono text-slate-900 dark:text-white">#{data.id}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Inscription</p>
            <p className="text-slate-900 dark:text-white">{new Date(data.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sessions actives</p>
            <p className="text-slate-900 dark:text-white">{data._count.refreshTokens}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Modules visités</p>
            <p className="text-slate-900 dark:text-white">{progressCount} / {MODULES.length}</p>
          </div>
        </div>

        <div className="mt-5 flex gap-2 items-end">
          <div className="flex-1">
            <label htmlFor="user-name" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Renommer</label>
            <input
              id="user-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
            />
          </div>
          <button
            disabled={busy || editName.trim() === data.name || editName.trim().length === 0}
            onClick={() => patch({ name: editName.trim() }, "Nom mis à jour")}
            className="px-4 py-2 bg-sap-blue text-white text-sm font-semibold rounded-lg hover:bg-sap-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enregistrer
          </button>
        </div>
      </section>

      {/* Statut & rôle */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Statut & rôle</h2>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={busy}
            onClick={() => patch({ isPro: !data.isPro }, data.isPro ? "Pro retiré" : "Pro activé")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              data.isPro
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-gray-100 text-slate-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {data.isPro ? "✓ Pro — retirer" : "Activer Pro"}
          </button>

          <button
            disabled={busy || isSelf}
            onClick={() => patch({ isSuspended: !data.isSuspended }, data.isSuspended ? "Compte réactivé" : "Compte suspendu")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${
              data.isSuspended
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            {data.isSuspended ? "Réactiver" : "Suspendre"}
          </button>

          {!isSelf && (
            <button
              disabled={busy}
              onClick={() => patch(
                { role: data.role === "admin" ? "student" : "admin" },
                data.role === "admin" ? "Privilèges admin retirés" : "Privilèges admin accordés",
              )}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                data.role === "admin"
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
                  : "bg-gray-100 text-slate-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {data.role === "admin" ? "✓ Admin — retirer" : "Promouvoir admin"}
            </button>
          )}
        </div>
      </section>

      {/* Reset password */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Mot de passe</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Réinitialise le mot de passe. Toutes les sessions actives seront déconnectées.
        </p>
        {!showResetForm ? (
          <button
            onClick={() => setShowResetForm(true)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-slate-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300"
          >
            Réinitialiser le mot de passe
          </button>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe (min. 8 car.)"
              className="flex-1 min-w-[220px] px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
            />
            <button
              disabled={busy}
              onClick={handleResetPassword}
              className="px-3 py-2 bg-sap-blue text-white text-sm font-semibold rounded-lg hover:bg-sap-blue-dark transition-colors disabled:opacity-40"
            >
              Confirmer
            </button>
            <button
              onClick={() => { setShowResetForm(false); setNewPassword(""); setError(""); }}
              className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Annuler
            </button>
          </div>
        )}
      </section>

      {/* Progression */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Progression modules SAP</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {MODULES.map((m) => {
            const visited = visitedMap.has(m.id);
            const visitedAt = visitedMap.get(m.id);
            return (
              <div
                key={m.id}
                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border ${
                  visited
                    ? "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-900/10"
                    : "border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{m.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {visited
                      ? `Vu le ${new Date(visitedAt!).toLocaleDateString("fr-FR")}`
                      : "Non visité"}
                  </p>
                </div>
                <span className={`text-xs font-semibold flex-shrink-0 ${visited ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                  {visited ? "✓" : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Zone dangereuse */}
      {!isSelf && (
        <section className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/40 p-5">
          <h2 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2 uppercase tracking-wider">Zone dangereuse</h2>
          <p className="text-xs text-red-700/80 dark:text-red-400/80 mb-4">
            La suppression du compte est définitive. Toutes les données associées seront perdues.
          </p>
          <button
            disabled={busy}
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
          >
            Supprimer ce compte
          </button>
        </section>
      )}
    </div>
  );
}
