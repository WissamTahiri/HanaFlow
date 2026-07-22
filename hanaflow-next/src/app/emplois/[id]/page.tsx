"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProGate from "@/components/ProGate";
import type { CvData } from "@/types/cv";
import { trackEvent } from "@/lib/analytics";

type Job = {
  id: number;
  title: string;
  companyName: string | null;
  moduleCode: string | null;
  seniority: string | null;
  location: string | null;
  workMode: string | null;
  contractType: string | null;
  description: string;
  isFeatured: boolean;
  createdAt: string;
};

const WORK_MODE_LABELS: Record<string, string> = { remote: "Remote", hybrid: "Hybride", onsite: "Sur site" };
const CONTRACT_LABELS: Record<string, string> = { cdi: "CDI", cdd: "CDD", freelance: "Freelance" };
const SENIORITY_LABELS: Record<string, string> = { junior: "Junior", confirmed: "Confirmé", senior: "Senior" };
const OPTIMIZED_STORAGE_KEY = "hf_cv_optimized";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(async (r) => {
        if (!r.ok) { setNotFound(true); return; }
        const d = await r.json();
        setJob(d.job);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-sap-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Offre introuvable</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Elle a peut-être été pourvue ou retirée entre-temps.
          </p>
          <Link href="/emplois" className="text-sap-blue font-semibold hover:underline">← Retour aux offres</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link href="/emplois" className="inline-flex items-center gap-1.5 text-sm font-medium text-sap-blue hover:underline mb-6">
          ← Toutes les offres
        </Link>

        <div className="card p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-sap-blue/10 text-sap-blue font-extrabold text-lg flex items-center justify-center">
              {(job.companyName ?? job.title).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{job.title}</h1>
                {job.isFeatured && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 uppercase tracking-wider">
                    À la une
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {job.companyName ?? "Entreprise confidentielle"}{job.location ? ` · ${job.location}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-6">
            {job.moduleCode && (
              <span className="text-xs font-bold px-2 py-1 rounded-lg bg-sap-blue/10 text-sap-blue">{job.moduleCode}</span>
            )}
            {job.seniority && (
              <span className="text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                {SENIORITY_LABELS[job.seniority] ?? job.seniority}
              </span>
            )}
            {job.workMode && (
              <span className="text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                {WORK_MODE_LABELS[job.workMode] ?? job.workMode}
              </span>
            )}
            {job.contractType && (
              <span className="text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                {CONTRACT_LABELS[job.contractType] ?? job.contractType}
              </span>
            )}
          </div>

          <div className="h-px bg-gray-100 dark:bg-slate-700 mb-6" />

          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
            {job.description}
          </div>
        </div>

        <ProGate
          featureName="Postuler avec ton CV IA"
          featureDescription="La candidature en un clic utilise le CV optimisé ATS généré par notre IA — un vrai avantage face aux autres candidats."
          perks={[
            "CV optimisé ATS déjà prêt (via CV Builder)",
            "Candidature transmise en un clic, sans ressaisie",
            "Suivi du statut depuis ton profil",
          ]}
        >
          <ApplySection jobId={job.id} jobTitle={job.title} />
        </ProGate>
      </div>
    </div>
  );
}

function ApplySection({ jobId, jobTitle }: { jobId: number; jobTitle: string }) {
  const { getToken } = useAuth();
  // ProGate ne rend cette section qu'une fois le statut Pro résolu côté client
  // (jamais pendant le SSR) — l'initialiseur paresseux peut donc lire
  // localStorage directement sans passer par un effet.
  const [cv] = useState<CvData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(OPTIMIZED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "already">("idle");
  const [error, setError] = useState("");

  const apply = async () => {
    if (!cv) return;
    setStatus("sending");
    setError("");
    trackEvent("job_application_started", { jobId });
    try {
      const token = await getToken();
      const r = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
        credentials: "include",
        body: JSON.stringify({ cv, message: message.trim() || undefined }),
      });
      const d = await r.json();
      if (!r.ok) {
        if (r.status === 400 && /déjà postulé/i.test(d.message ?? "")) { setStatus("already"); return; }
        setError(d.message ?? "Erreur"); setStatus("error"); return;
      }
      setStatus("sent");
    } catch {
      setError("Erreur réseau"); setStatus("error");
    }
  };

  if (!cv) {
    return (
      <div className="card p-6 sm:p-7 text-center">
        <p className="font-bold text-slate-900 dark:text-white mb-1.5">Aucun CV IA prêt à l&apos;envoi</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-sm mx-auto">
          Crée ton CV optimisé ATS avant de postuler à &quot;{jobTitle}&quot; — ça prend quelques minutes.
        </p>
        <Link href="/cv-builder" className="btn-primary">
          Créer mon CV IA →
        </Link>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="card p-6 sm:p-7 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 font-bold">
          ✓
        </div>
        <p className="font-bold text-slate-900 dark:text-white mb-1">Candidature envoyée</p>
        <Link href="/profil" className="text-sm text-sap-blue font-semibold hover:underline">Suivre son statut depuis mon profil →</Link>
      </div>
    );
  }
  if (status === "already") {
    return (
      <div className="card p-6 sm:p-7 text-center text-slate-500 dark:text-slate-400">
        Tu as déjà postulé à cette offre.
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-7">
      <p className="font-bold text-slate-900 dark:text-white mb-0.5">Postuler à cette offre</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Avec le CV de <strong className="text-slate-700 dark:text-slate-300">{cv.identity.name}</strong> ({cv.identity.title}).
      </p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={1000}
        placeholder="Message optionnel (motivation, disponibilité…)"
        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white mb-3 min-h-[80px]"
      />
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <button
        onClick={apply}
        disabled={status === "sending"}
        className="btn-primary w-full"
      >
        {status === "sending" ? "Envoi…" : "Envoyer ma candidature →"}
      </button>
    </div>
  );
}
