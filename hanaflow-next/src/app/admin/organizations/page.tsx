"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Organization {
  id: number;
  name: string;
  seatLimit: number;
  isActive: boolean;
  createdAt: string;
  _count: { members: number };
  members: Array<{ user: { name: string; email: string } }>;
}

export default function AdminOrganizationsPage() {
  const { token } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", seatLimit: "10", ownerEmail: "" });

  const fetchOrgs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch("/api/admin/organizations", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const d = await r.json();
      if (!r.ok) setError(d.message ?? "Erreur");
      else setOrgs(d.organizations);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrgs(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const createOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !form.name.trim() || !form.ownerEmail.trim()) return;
    setError("");
    try {
      const r = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          seatLimit: parseInt(form.seatLimit, 10) || 10,
          ownerEmail: form.ownerEmail.trim(),
        }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setOrgs((prev) => [{ ...d.organization, _count: { members: 1 }, members: [{ user: { name: "", email: form.ownerEmail } }] }, ...prev]);
      setForm({ name: "", seatLimit: "10", ownerEmail: "" });
      setShowForm(false);
    } catch {
      setError("Erreur réseau");
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    if (!token) return;
    setActionLoading(id);
    try {
      const r = await fetch(`/api/admin/organizations/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !isActive }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, isActive: d.organization.isActive } : o)));
    } catch {
      setError("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteOrg = async (id: number, name: string) => {
    if (!confirm(`Supprimer l'organisation "${name}" ? Tous ses membres perdront le Pro.`)) return;
    if (!token) return;
    setActionLoading(id);
    try {
      const r = await fetch(`/api/admin/organizations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!r.ok) { const d = await r.json(); setError(d.message ?? "Erreur"); return; }
      setOrgs((prev) => prev.filter((o) => o.id !== id));
    } catch {
      setError("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organisations (équipes B2B)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Crée une organisation après validation d&apos;un contrat &quot;Sur devis&quot; — le owner gère ensuite ses sièges depuis /team.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sap-blue text-white rounded-lg text-sm font-semibold hover:bg-sap-blue/90 transition-colors"
        >
          {showForm ? "Annuler" : "+ Créer une organisation"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={createOrg} className="mb-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nom de l&apos;organisation *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Cabinet Dupont Conseil"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email du propriétaire *</label>
            <input
              required
              type="email"
              value={form.ownerEmail}
              onChange={(e) => setForm((f) => ({ ...f, ownerEmail: e.target.value }))}
              placeholder="manager@entreprise.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/50"
            />
            <p className="text-[11px] text-slate-400 mt-1">Doit déjà avoir un compte HanaFlow.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nombre de sièges</label>
            <input
              type="number"
              min="1"
              value={form.seatLimit}
              onChange={(e) => setForm((f) => ({ ...f, seatLimit: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/50"
            />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-sap-blue text-white rounded-lg text-sm font-semibold hover:bg-sap-blue/90 transition-colors"
            >
              Créer l&apos;organisation
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-5 h-5 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orgs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Aucune organisation créée</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Organisation</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Propriétaire</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Sièges</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Statut</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{o.name}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{o.members[0]?.user.email ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">{o._count.members} / {o.seatLimit}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        o.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400"
                      }`}>
                        {o.isActive ? "Active" : "Désactivée"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {actionLoading === o.id ? (
                          <div className="w-4 h-4 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <button
                              onClick={() => toggleActive(o.id, o.isActive)}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                o.isActive
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {o.isActive ? "Désactiver" : "Réactiver"}
                            </button>
                            <button
                              onClick={() => deleteOrg(o.id, o.name)}
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
