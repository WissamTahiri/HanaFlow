"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { CvData } from "@/types/cv";

type Application = {
  id: number;
  status: "new" | "reviewed" | "contacted" | "rejected";
  createdAt: string;
  message: string | null;
  cvSnapshot: CvData;
  user: { id: number; name: string; email: string };
};

const STATUS_LABELS: Record<Application["status"], string> = {
  new: "Nouvelle", reviewed: "Vue", contacted: "Contacté", rejected: "Rejetée",
};
const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as Application["status"][];

export default function AdminJobApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const r = await fetch(`/api/admin/jobs/${id}/applications`, {
        headers: { Authorization: `Bearer ${token ?? ""}` },
        credentials: "include",
      });
      const d = await r.json();
      if (r.ok) setApplications(d.applications ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (appId: number, status: Application["status"]) => {
    const token = await getToken();
    await fetch(`/api/admin/jobs/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
  };

  return (
    <div className="max-w-4xl">
      <Link href="/admin/jobs" className="text-sm text-sap-blue hover:underline mb-4 inline-block">← Retour aux annonces</Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Candidatures</h1>

      {loading ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : applications.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-10 text-center text-slate-500 text-sm">
          Aucune candidature pour cette offre.
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{a.user.name}</p>
                  <p className="text-xs text-slate-400">{a.user.email}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(a.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <select
                  value={a.status}
                  onChange={(e) => updateStatus(a.id, e.target.value as Application["status"])}
                  className="text-xs px-2 py-1.5 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              {a.message && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 italic">&ldquo;{a.message}&rdquo;</p>
              )}
              <button
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                className="mt-3 text-xs text-sap-blue hover:underline"
              >
                {expanded === a.id ? "Masquer le CV" : "Voir le CV"}
              </button>
              {expanded === a.id && <CvPreview cv={a.cvSnapshot} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CvPreview({ cv }: { cv: CvData }) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 text-sm space-y-3">
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{cv.identity.name} — {cv.identity.title}</p>
        <p className="text-xs text-slate-400">{cv.identity.email}{cv.identity.phone ? ` · ${cv.identity.phone}` : ""}</p>
      </div>
      {cv.summary && <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{cv.summary}</p>}
      {cv.experiences.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Expériences</p>
          {cv.experiences.map((exp, i) => (
            <p key={i} className="text-xs text-slate-600 dark:text-slate-300">
              {exp.title} — {exp.company} ({exp.startDate}{exp.current ? " — présent" : exp.endDate ? ` — ${exp.endDate}` : ""})
            </p>
          ))}
        </div>
      )}
      {(cv.skills.sap?.length ?? 0) > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Compétences SAP</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{cv.skills.sap?.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
