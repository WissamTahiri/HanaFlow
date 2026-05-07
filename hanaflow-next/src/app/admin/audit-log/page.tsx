"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface AuditEntry {
  id: number;
  actorId: number | null;
  actorEmail: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

interface AuditResponse {
  entries: AuditEntry[];
  total: number;
  page: number;
  totalPages: number;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  "user.update":          { label: "Modif. utilisateur",     color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "user.delete":          { label: "Suppr. utilisateur",     color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  "user.password_reset":  { label: "Reset mot de passe",     color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  "user.export":          { label: "Export CSV users",       color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  "user.impersonate":     { label: "Impersonation",           color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  "promo.create":         { label: "Création promo",         color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  "promo.update":         { label: "Modif. promo",           color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "promo.delete":         { label: "Suppr. promo",           color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  "settings.update":      { label: "Modif. paramètres",      color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  "auth.admin_login":     { label: "Connexion admin",        color: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
};

export default function AuditLogPage() {
  const { token } = useAuth();
  const [data, setData] = useState<AuditResponse | null>(null);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchLog = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (actionFilter) params.set("action", actionFilter);
      const r = await fetch(`/api/admin/audit-log?${params}`, {
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
  }, [token, page, actionFilter]);

  useEffect(() => { fetchLog(); }, [fetchLog]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Journal d&apos;audit</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Trace de toutes les actions effectuées par les administrateurs
          </p>
        </div>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
        >
          <option value="">Toutes les actions</option>
          {Object.entries(ACTION_LABELS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Quand</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Acteur</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Cible</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    <div className="inline-block w-5 h-5 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : data?.entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">Aucune entrée d&apos;audit</td>
                </tr>
              ) : (
                data?.entries.map((e) => {
                  const meta = ACTION_LABELS[e.action] ?? { label: e.action, color: "bg-gray-100 text-gray-700" };
                  const expanded = expandedId === e.id;
                  return (
                    <>
                      <tr
                        key={e.id}
                        className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expanded ? null : e.id)}
                      >
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">{formatDate(e.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}>
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{e.actorEmail}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">
                          {e.targetType ? `${e.targetType}#${e.targetId}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs font-mono">{e.ipAddress ?? "—"}</td>
                      </tr>
                      {expanded && e.metadata && (
                        <tr key={`meta-${e.id}`} className="bg-gray-50 dark:bg-slate-900/40 border-b border-gray-50 dark:border-slate-700/50">
                          <td colSpan={5} className="px-4 py-3">
                            <pre className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all font-mono">
                              {JSON.stringify(e.metadata, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-slate-500">{data.total} entrées · page {data.page} / {data.totalPages}</p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md text-xs border border-gray-200 dark:border-slate-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                ←
              </button>
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
