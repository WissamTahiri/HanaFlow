"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface PromoCode {
  id: number;
  code: string;
  description: string | null;
  isActive: boolean;
  usageLimit: number | null;
  usageCount: number;
  createdAt: string;
  expiresAt: string | null;
}

export default function AdminPromoCodesPage() {
  const { token } = useAuth();
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    code: "",
    description: "",
    usageLimit: "",
    expiresAt: "",
  });

  const fetchCodes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch("/api/admin/promo-codes", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const d = await r.json();
      if (!r.ok) setError(d.message ?? "Erreur");
      else setCodes(d.codes);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCodes(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const createCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !form.code.trim()) return;
    setError("");
    try {
      const body: Record<string, unknown> = { code: form.code.trim() };
      if (form.description.trim()) body.description = form.description.trim();
      if (form.usageLimit) body.usageLimit = parseInt(form.usageLimit);
      if (form.expiresAt) body.expiresAt = new Date(form.expiresAt).toISOString();

      const r = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setCodes((prev) => [d.code, ...prev]);
      setForm({ code: "", description: "", usageLimit: "", expiresAt: "" });
      setShowForm(false);
    } catch {
      setError("Erreur réseau");
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    if (!token) return;
    setActionLoading(id);
    try {
      const r = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !isActive }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setCodes((prev) => prev.map((c) => (c.id === id ? d.code : c)));
    } catch {
      setError("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteCode = async (id: number, code: string) => {
    if (!confirm(`Supprimer le code "${code}" ?`)) return;
    if (!token) return;
    setActionLoading(id);
    try {
      const r = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!r.ok) { const d = await r.json(); setError(d.message ?? "Erreur"); return; }
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Codes Promo</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sap-blue text-white rounded-lg text-sm font-semibold hover:bg-sap-blue/90 transition-colors"
        >
          {showForm ? "Annuler" : "+ Créer un code"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form onSubmit={createCode} className="mb-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Code *</label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="EX: HANAFLOW2025"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Code de lancement..."
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Limite d&apos;utilisation</label>
            <input
              type="number"
              min="1"
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              placeholder="Illimité"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Expiration</label>
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/50"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-sap-blue text-white rounded-lg text-sm font-semibold hover:bg-sap-blue/90 transition-colors"
            >
              Créer le code
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-5 h-5 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : codes.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Aucun code promo créé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Utilisation</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Expiration</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Statut</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-sap-blue dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-xs">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-[180px] truncate">
                      {c.description ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
                      {c.usageCount} / {c.usageLimit ?? "∞"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        c.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400"
                      }`}>
                        {c.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {actionLoading === c.id ? (
                          <div className="w-4 h-4 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <button
                              onClick={() => toggleActive(c.id, c.isActive)}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                c.isActive
                                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
                                  : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {c.isActive ? "Désactiver" : "Activer"}
                            </button>
                            <button
                              onClick={() => deleteCode(c.id, c.code)}
                              className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
