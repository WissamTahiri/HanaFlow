"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Analytics {
  users: { total: number; pro: number; free: number; suspended: number; admins: number; signupsLast7d: number; signupsLast30d: number };
  promo: { total: number; active: number };
  sessions: { active: number };
  modules: { module: string; visits: number }[];
  recentSignups: { id: number; name: string; email: string; isPro: boolean; createdAt: string }[];
  signupsTimeline: { day: string; count: number }[];
}

const MODULE_LABELS: Record<string, string> = {
  fi:  "FI — Finance",
  co:  "CO — Controlling",
  mm:  "MM — Materials",
  sd:  "SD — Sales",
  hcm: "HCM — Human Capital",
  pp:  "PP — Production",
};

function StatCard({ label, value, sub, color = "text-slate-900 dark:text-white" }: { label: string; value: number | string; sub?: string; color?: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function TimelineChart({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((d) => {
        const h = (d.count / max) * 100;
        const dt = new Date(d.day);
        const dayLabel = dt.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group" title={`${dayLabel} : ${d.count} inscription${d.count > 1 ? "s" : ""}`}>
            <div className="w-full bg-sap-blue/15 dark:bg-sap-blue/30 rounded-t-md relative" style={{ height: `${Math.max(h, 4)}%`, minHeight: "4px" }}>
              <div className="absolute inset-0 bg-sap-blue rounded-t-md transition-opacity opacity-80 group-hover:opacity-100" />
              {d.count > 0 && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-sap-blue dark:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {d.count}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ModuleHeatmap({ modules }: { modules: { module: string; visits: number }[] }) {
  if (modules.length === 0) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">Aucune visite enregistrée pour l&apos;instant.</p>;
  }
  const max = Math.max(...modules.map((m) => m.visits));
  return (
    <div className="space-y-2">
      {modules.map((m) => {
        const pct = max > 0 ? (m.visits / max) * 100 : 0;
        return (
          <div key={m.module} className="flex items-center gap-3">
            <div className="w-32 text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">
              {MODULE_LABELS[m.module] ?? m.module.toUpperCase()}
            </div>
            <div className="flex-1 h-7 bg-gray-100 dark:bg-slate-700 rounded-md overflow-hidden relative">
              <div className="h-full bg-linear-to-r from-sap-blue to-sap-blue-dark rounded-md transition-all" style={{ width: `${pct}%` }} />
              <span className="absolute inset-0 flex items-center px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-100">
                {m.visits} visite{m.visits > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/analytics", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.message) setError(d.message);
        else setData(d);
      })
      .catch(() => setError("Erreur réseau"));
  }, [token]);

  if (error) {
    return (
      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <div className="w-4 h-4 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
        Chargement des analytics…
      </div>
    );
  }

  const proRate = data.users.total > 0 ? Math.round((data.users.pro / data.users.total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mis à jour à l&apos;instant
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Utilisateurs" value={data.users.total} sub={`${data.users.admins} admin · ${data.users.suspended} suspendu${data.users.suspended > 1 ? "s" : ""}`} />
        <StatCard label="Comptes Pro" value={data.users.pro} sub={`${proRate}% des utilisateurs`} color="text-emerald-500" />
        <StatCard label="Inscrits (7j)" value={data.users.signupsLast7d} sub={`${data.users.signupsLast30d} sur 30 jours`} color="text-sap-blue" />
        <StatCard label="Sessions actives" value={data.sessions.active} sub="Refresh tokens valides" />
      </div>

      {/* Timeline + modules heatmap */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Inscriptions — 14 jours</h2>
            <span className="text-xs text-slate-400">Quotidien</span>
          </div>
          <TimelineChart data={data.signupsTimeline} />
          <div className="flex justify-between mt-2 text-[10px] text-slate-400">
            <span>{new Date(data.signupsTimeline[0]?.day ?? "").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
            <span>aujourd&apos;hui</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top modules visités</h2>
            <span className="text-xs text-slate-400">Tous temps</span>
          </div>
          <ModuleHeatmap modules={data.modules} />
        </div>
      </div>

      {/* Recent signups + Pro/Free distribution */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Inscriptions récentes</h2>
            <Link href="/admin/users" className="text-xs text-sap-blue hover:underline">Voir tous →</Link>
          </div>
          {data.recentSignups.length === 0 ? (
            <p className="text-sm text-slate-400">Aucune inscription récente.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-slate-700">
              {data.recentSignups.map((u) => (
                <li key={u.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/admin/users/${u.id}`} className="text-sm font-medium text-slate-900 dark:text-white hover:text-sap-blue truncate block">
                      {u.name}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {u.isPro && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Pro
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Répartition statuts</h2>
          <div className="space-y-3">
            {[
              { label: "Pro", value: data.users.pro, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
              { label: "Gratuit", value: data.users.free, color: "bg-sap-blue", text: "text-sap-blue dark:text-blue-300" },
              { label: "Suspendu", value: data.users.suspended, color: "bg-red-500", text: "text-red-600 dark:text-red-400" },
              { label: "Admin", value: data.users.admins, color: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" },
            ].map((s) => {
              const pct = data.users.total > 0 ? (s.value / data.users.total) * 100 : 0;
              return (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{s.label}</span>
                    <span className={`text-xs font-bold ${s.text}`}>{s.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Codes promo actifs</span>
              <span className="font-bold text-sap-blue">{data.promo.active} / {data.promo.total}</span>
            </div>
            <Link href="/admin/promo-codes" className="text-xs text-sap-blue hover:underline">Gérer →</Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Raccourcis</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/users" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-sap-blue text-white hover:bg-sap-blue-dark transition-colors">
            Gérer les utilisateurs
          </Link>
          <Link href="/admin/promo-codes" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            Codes promo
          </Link>
          <Link href="/admin/audit-log" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            Journal d&apos;audit
          </Link>
          <Link href="/admin/settings" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            Paramètres
          </Link>
        </div>
      </div>
    </div>
  );
}
