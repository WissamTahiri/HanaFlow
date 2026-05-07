"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isPro: boolean;
  isSuspended: boolean;
  createdAt: string;
}

interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const { token, user: me } = useAuth();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const r = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const d = await r.json();
      if (!r.ok) setError(d.message ?? "Erreur");
      else setData(d);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, [token, page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const patchUser = async (id: number, patch: Partial<Pick<AdminUser, "isPro" | "isSuspended" | "role">>) => {
    if (!token) return;
    setActionLoading(id);
    try {
      const r = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(patch),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setData((prev) =>
        prev
          ? { ...prev, users: prev.users.map((u) => (u.id === id ? d.user : u)) }
          : prev
      );
    } catch {
      setError("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (id: number, name: string) => {
    if (!confirm(`Supprimer définitivement ${name} ?`)) return;
    if (!token) return;
    setActionLoading(id);
    try {
      const r = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!r.ok) { const d = await r.json(); setError(d.message ?? "Erreur"); return; }
      setData((prev) => prev ? { ...prev, users: prev.users.filter((u) => u.id !== id), total: prev.total - 1 } : prev);
    } catch {
      setError("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  };

  const exportCsv = async () => {
    if (!token) return;
    try {
      const r = await fetch("/api/admin/users/export", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setError(d.message ?? "Échec export");
        return;
      }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = r.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? `hanaflow-users.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Erreur réseau");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Utilisateurs</h1>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher par nom ou email..."
          className="flex-1 px-4 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/50"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Nom</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Rôle</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Statut</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Inscrit</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <div className="inline-block w-5 h-5 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : data?.users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">Aucun utilisateur trouvé</td>
                </tr>
              ) : (
                data?.users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{u.name}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.isPro && (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Pro
                          </span>
                        )}
                        {u.isSuspended && (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Suspendu
                          </span>
                        )}
                        {!u.isPro && !u.isSuspended && (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400">
                            Free
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1 flex-wrap">
                        {actionLoading === u.id ? (
                          <div className="w-4 h-4 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Link
                              href={`/admin/users/${u.id}`}
                              className="px-2.5 py-1 rounded-md text-xs font-medium bg-sap-blue/10 text-sap-blue hover:bg-sap-blue/20 dark:bg-sap-blue/20 dark:text-blue-300 transition-colors"
                            >
                              Détails
                            </Link>
                            <button
                              onClick={() => patchUser(u.id, { isPro: !u.isPro })}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                u.isPro
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {u.isPro ? "Retirer Pro" : "Passer Pro"}
                            </button>
                            <button
                              onClick={() => patchUser(u.id, { isSuspended: !u.isSuspended })}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                u.isSuspended
                                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                              }`}
                            >
                              {u.isSuspended ? "Réactiver" : "Suspendre"}
                            </button>
                            {me?.id !== u.id && (
                              <button
                                onClick={() => deleteUser(u.id, u.name)}
                                className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                              >
                                Supprimer
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-slate-500">{data.total} utilisateurs</p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md text-xs border border-gray-200 dark:border-slate-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                ←
              </button>
              <span className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400">{page} / {data.totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-3 py-1 rounded-md text-xs border border-gray-200 dark:border-slate-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
