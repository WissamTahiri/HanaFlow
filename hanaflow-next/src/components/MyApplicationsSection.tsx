"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type Application = {
  id: number;
  status: "new" | "reviewed" | "contacted" | "rejected";
  createdAt: string;
  jobListing: { id: number; title: string; companyName: string | null };
};

const STATUS_LABELS: Record<Application["status"], string> = {
  new: "Envoyée", reviewed: "Vue par le recruteur", contacted: "Contacté·e", rejected: "Non retenue",
};
const STATUS_COLORS: Record<Application["status"], string> = {
  new: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  contacted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300",
};

/**
 * Historique des candidatures emploi (profil). Ne rend rien si l'utilisateur
 * n'a jamais postulé — évite d'encombrer le profil pour la majorité des users.
 */
export default function MyApplicationsSection() {
  const { token, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/jobs/my-applications", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok && !cancelled) setApplications((await res.json()).applications);
      } catch { /* silencieux */ }
      finally { if (!cancelled) setLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated, token]);

  if (!loaded || applications.length === 0) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Mes candidatures</h2>
        <Link href="/emplois" className="text-xs text-sap-blue hover:underline">Voir les offres →</Link>
      </div>
      <div className="space-y-2">
        {applications.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 dark:border-slate-700/50 last:border-0">
            <div className="min-w-0">
              <Link href={`/emplois/${a.jobListing.id}`} className="text-sm font-semibold text-slate-900 dark:text-white hover:text-sap-blue truncate block">
                {a.jobListing.title}
              </Link>
              <p className="text-xs text-slate-400">
                {a.jobListing.companyName} · {new Date(a.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <span className={`shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[a.status]}`}>
              {STATUS_LABELS[a.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
