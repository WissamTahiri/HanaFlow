"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type NPSData = {
  nps: number;
  total: number;
  promoters: number;
  passives: number;
  detractors: number;
  distribution: Record<number, number>;
  recentComments: Array<{
    id: number;
    score: number;
    comment: string;
    createdAt: string;
    user: { name: string; email: string } | null;
  }>;
};

export default function AdminNPSPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<NPSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const r = await fetch("/api/admin/nps", {
          headers: { Authorization: `Bearer ${token ?? ""}` },
          credentials: "include",
        });
        const d = await r.json();
        if (r.ok && !cancelled) setData(d);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken]);

  if (loading) return <p className="text-sm text-slate-400">Chargement…</p>;
  if (!data || data.total === 0) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">NPS</h1>
        <p className="text-sm text-slate-500 mb-6">Net Promoter Score — qualité de la relation utilisateur.</p>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-10 text-center">
          <p className="text-3xl mb-2">📊</p>
          <p className="text-sm text-slate-500">Aucune réponse NPS pour l&apos;instant.</p>
          <p className="text-xs text-slate-400 mt-2">Le prompt s&apos;affiche aux users après J+7 d&apos;usage, max 1× par 90j.</p>
        </div>
      </div>
    );
  }

  const max = Math.max(1, ...Object.values(data.distribution));
  const npsColor =
    data.nps >= 50 ? "from-emerald-500 to-emerald-700" :
    data.nps >= 30 ? "from-amber-500 to-amber-600" :
    data.nps >= 0  ? "from-orange-500 to-orange-600" :
                     "from-rose-500 to-rose-700";

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">NPS</h1>
      <p className="text-sm text-slate-500 mb-6">Net Promoter Score — qualité de la relation utilisateur.</p>

      {/* Score principal */}
      <div className={`card overflow-hidden border-0 mb-6 bg-linear-to-br ${npsColor} text-white`}>
        <div className="p-8 sm:p-10 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-2">Score NPS global</p>
          <p className="text-6xl font-extrabold mb-2">{data.nps > 0 ? "+" : ""}{data.nps}</p>
          <p className="text-sm text-white/85">
            sur {data.total} réponse{data.total > 1 ? "s" : ""}
          </p>
          <p className="text-xs text-white/70 mt-3 max-w-md mx-auto">
            {data.nps >= 50 ? "Excellent — promoteurs largement majoritaires." :
             data.nps >= 30 ? "Bon — relation solide mais améliorable." :
             data.nps >= 0  ? "Moyen — il faut écouter les détracteurs." :
                              "À traiter en urgence — plus de détracteurs que de promoteurs."}
          </p>
        </div>
      </div>

      {/* Promoters / Passives / Detractors */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatBox label="Promoteurs (9-10)" value={data.promoters} color="text-emerald-600 dark:text-emerald-400" />
        <StatBox label="Passifs (7-8)" value={data.passives} color="text-amber-600 dark:text-amber-400" />
        <StatBox label="Détracteurs (0-6)" value={data.detractors} color="text-rose-600 dark:text-rose-400" />
      </div>

      {/* Distribution histogramme */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-bold mb-4">Distribution des scores</h2>
        <div className="flex items-end gap-1 h-32">
          {Array.from({ length: 11 }).map((_, i) => {
            const count = data.distribution[i] ?? 0;
            const heightPct = (count / max) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] font-bold text-slate-500">{count}</div>
                <div
                  className={`w-full rounded-t transition-all ${
                    i <= 6 ? "bg-rose-400" : i <= 8 ? "bg-amber-400" : "bg-emerald-500"
                  }`}
                  style={{ height: `${heightPct}%`, minHeight: count > 0 ? "4px" : "0" }}
                />
                <div className="text-[10px] text-slate-400 font-mono">{i}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent comments */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold mb-1">Commentaires récents</h2>
        <p className="text-xs text-slate-500 mb-4">20 derniers commentaires non vides.</p>
        {data.recentComments.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Aucun commentaire pour l&apos;instant.</p>
        ) : (
          <div className="space-y-3">
            {data.recentComments.map((c) => (
              <div key={c.id} className="border-l-4 border-sap-blue/30 pl-3 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    c.score >= 9 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                    c.score >= 7 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                                   "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                  }`}>{c.score}/10</span>
                  <span className="text-xs text-slate-500">{c.user?.name ?? "Utilisateur"}</span>
                  <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{c.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}
