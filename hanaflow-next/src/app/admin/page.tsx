"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  proUsers: number;
  suspendedUsers: number;
  totalPromoCodes: number;
  activePromoCodes: number;
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.message) setError(d.message);
        else setStats(d);
      })
      .catch(() => setError("Erreur réseau"));
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Utilisateurs" value={stats.totalUsers} color="text-slate-900 dark:text-white" />
            <StatCard label="Comptes Pro" value={stats.proUsers} sub={`${Math.round((stats.proUsers / (stats.totalUsers || 1)) * 100)}% des utilisateurs`} color="text-amber-500" />
            <StatCard label="Suspendus" value={stats.suspendedUsers} color="text-red-500" />
            <StatCard label="Codes promo" value={stats.totalPromoCodes} color="text-slate-900 dark:text-white" />
            <StatCard label="Codes actifs" value={stats.activePromoCodes} color="text-green-500" />
          </div>

          <div className="flex gap-3">
            <Link href="/admin/users" className="inline-flex items-center gap-2 px-4 py-2 bg-sap-blue text-white rounded-lg text-sm font-semibold hover:bg-sap-blue/90 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.874M9 20H4v-2a4 4 0 015-3.874M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 11-6 0 3 3 0 016 0zM3 10a3 3 0 116 0 3 3 0 01-6 0z" /></svg>
              Gérer les utilisateurs
            </Link>
            <Link href="/admin/promo-codes" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              Gérer les codes promo
            </Link>
          </div>
        </>
      ) : (
        !error && (
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-4 h-4 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
            Chargement...
          </div>
        )
      )}
    </div>
  );
}
