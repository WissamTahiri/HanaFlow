"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { pdf } from "@react-pdf/renderer";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

/**
 * /certificats — page privée listant les certificats de l'utilisateur.
 *
 * Chaque cert affiche : module, score, date, URL de vérification publique,
 * et un bouton de re-téléchargement du PDF officiel.
 */

const CertificateDocument = dynamic(() => import("@/components/CertificateDocument"), { ssr: false });

type Certificate = {
  id: string;
  moduleCode: string;
  moduleLabel: string;
  certCode: string | null;
  candidateName: string;
  examScore: number;
  examQuestions: number;
  issuedAt: string;
  revokedAt: string | null;
};

function CertificatesContent() {
  const { getToken } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) {
          setError("Session expirée.");
          setLoading(false);
          return;
        }
        const res = await fetch("/api/certificates", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.message ?? "Erreur de chargement");
        } else {
          setCerts(data.certificates ?? []);
        }
      } catch {
        if (!cancelled) setError("Erreur réseau.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
            Mes certificats
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-balance">
            Tes certifications HanaFlow
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Chaque certificat dispose d&apos;un identifiant unique et d&apos;une URL de vérification publique
            que tu peux partager avec un recruteur. Re-télécharge le PDF officiel à tout moment.
          </p>
        </div>

        {loading && (
          <div className="card p-12 text-center">
            <div className="inline-block h-8 w-8 rounded-full border-4 border-sap-blue border-t-transparent animate-spin mb-3" />
            <p className="text-sm text-slate-500">Chargement de tes certificats…</p>
          </div>
        )}

        {error && !loading && (
          <div className="card p-6 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && certs.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-3">📜</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Aucun certificat pour l&apos;instant
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Passe et réussis le simulateur d&apos;examen d&apos;un module SAP pour obtenir ton premier certificat
              HanaFlow vérifiable.
            </p>
            <Link href="/certifications" className="btn-primary px-6 py-2.5">
              Voir les modules certifiants →
            </Link>
          </div>
        )}

        {!loading && certs.length > 0 && (
          <div className="space-y-4">
            {certs.map((cert, i) => (
              <CertificateCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CertificateCard({ cert, index }: { cert: Certificate; index: number }) {
  const [downloading, setDownloading] = useState(false);
  const verifyUrl = typeof window !== "undefined" ? `${window.location.origin}/verifier-certificat/${cert.id}` : `/verifier-certificat/${cert.id}`;
  const displayId = `HF-${cert.id.slice(0, 8).toUpperCase()}-${cert.id.slice(-4).toUpperCase()}`;

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const blob = await pdf(
        <CertificateDocument
          userName={cert.candidateName}
          moduleCode={cert.moduleCode}
          moduleName={cert.moduleLabel}
          score={Math.round((cert.examScore * cert.examQuestions) / 100)}
          totalQuestions={cert.examQuestions}
          certId={cert.id}
          issuedAt={cert.issuedAt}
          certCode={cert.certCode ?? undefined}
          verifyUrl={verifyUrl}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Certificat-HanaFlow-${cert.moduleCode}-${cert.candidateName.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`card p-6 ${cert.revokedAt ? "opacity-60" : ""}`}
    >
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sap-blue/10 text-sap-blue dark:bg-sap-blue/20 dark:text-sap-accent">
              {cert.moduleCode}
            </span>
            {cert.certCode && (
              <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">{cert.certCode}</span>
            )}
            {cert.revokedAt && (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                Révoqué
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{cert.moduleLabel}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Score : <span className="font-semibold text-slate-900 dark:text-white">{cert.examScore} %</span>
            <span className="mx-1.5 text-slate-300">·</span>
            Émis le{" "}
            <span className="font-medium">
              {new Date(cert.issuedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{displayId}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            onClick={downloadPdf}
            disabled={downloading || !!cert.revokedAt}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
          >
            {downloading ? "Génération…" : "Télécharger le PDF"}
          </button>
          <Link
            href={`/verifier-certificat/${cert.id}`}
            className="btn-outline px-4 py-2 text-sm"
          >
            Page publique
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function CertificatesPage() {
  return (
    <ProtectedRoute>
      <CertificatesContent />
    </ProtectedRoute>
  );
}
