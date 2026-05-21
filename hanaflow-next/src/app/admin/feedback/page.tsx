"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

type Feedback = {
  id: number;
  userId: number | null;
  context: string | null;
  goodWhat: string | null;
  improveWhat: string | null;
  status: string;
  ipAddress: string | null;
  createdAt: string;
  contactEmail: string | null;
  user: { id: number; name: string; email: string } | null;
};

type Response = {
  items: Feedback[];
  total: number;
  page: number;
  pageSize: number;
  statusCounts: { new: number; read: number; archived: number };
};

const STATUS_FILTERS = [
  { value: "new", label: "Nouveau" },
  { value: "read", label: "Lu" },
  { value: "archived", label: "Archivé" },
  { value: "all", label: "Tous" },
];

export default function AdminFeedbackPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<Response | null>(null);
  const [filter, setFilter] = useState("new");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const r = await fetch(`/api/admin/feedback?status=${filter}&page=${page}`, {
        headers: { Authorization: `Bearer ${token ?? ""}` },
        credentials: "include",
      });
      const d = await r.json();
      if (r.ok) setData(d);
    } finally {
      setLoading(false);
    }
  }, [filter, page, getToken]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: number, status: string) => {
    const token = await getToken();
    await fetch(`/api/admin/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Feedback</h1>
        <p className="text-sm text-slate-500 mt-1">
          Voix des utilisateurs envoyée via le widget flottant.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-sap-blue text-white"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700"
            }`}
          >
            {f.label}
            {data && f.value !== "all" && (
              <span className="ml-2 text-xs opacity-70">
                {data.statusCounts[f.value as "new" | "read" | "archived"]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : !data || data.items.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-10 text-center">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm text-slate-500">Aucun feedback pour ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((f) => (
            <div
              key={f.id}
              className={`bg-white dark:bg-slate-800 border rounded-xl p-4 ${
                f.status === "new" ? "border-sap-blue/40 shadow-soft" : "border-gray-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {f.user ? (
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{f.user.name}</span>
                    ) : (
                      <span className="text-sm font-semibold text-slate-500 italic">Anonyme</span>
                    )}
                    {f.user && (
                      <span className="text-xs text-slate-500">{f.user.email}</span>
                    )}
                    {f.contactEmail && !f.user && (
                      <span className="text-xs text-slate-500">{f.contactEmail}</span>
                    )}
                    {f.status === "new" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sap-blue text-white uppercase tracking-wider">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {new Date(f.createdAt).toLocaleString("fr-FR")}
                    {f.context && (
                      <>
                        <span className="mx-1.5">·</span>
                        <span className="font-mono">{f.context}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {f.status !== "read" && (
                    <button onClick={() => updateStatus(f.id, "read")} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200">
                      Marquer lu
                    </button>
                  )}
                  {f.status !== "archived" && (
                    <button onClick={() => updateStatus(f.id, "archived")} className="text-xs px-2 py-1 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                      Archiver
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {f.goodWhat && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                      Ce qui marche bien
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{f.goodWhat}</p>
                  </div>
                )}
                {f.improveWhat && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                      À améliorer
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{f.improveWhat}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {data.total > data.pageSize && (
            <div className="flex items-center justify-between pt-4 text-sm">
              <span className="text-slate-500">
                {(data.page - 1) * data.pageSize + 1}-{Math.min(data.page * data.pageSize, data.total)} sur {data.total}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={data.page * data.pageSize >= data.total}
                  className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
