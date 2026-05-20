"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import CertificateDocument from "./CertificateDocument";
import { useAuth } from "@/context/AuthContext";

interface Props {
  userName: string;
  moduleCode: string;
  moduleName: string;
  score: number;
  totalQuestions: number;
}

/**
 * Bouton de génération du certificat.
 *
 * Flow :
 *  1. POST /api/certificates/issue → persiste le cert en DB et récupère un
 *     cuid public, la date officielle d'émission, et le code certif SAP.
 *  2. Génère un PDF avec ce vrai ID + l'URL de vérification publique en bas.
 *  3. Download du blob.
 *
 * Sur erreur d'API (rate limit, score insuffisant), on affiche un message
 * inline mais NE génère PAS de PDF — pas question de produire un cert sans
 * la trace DB qui le rend vérifiable.
 */
export default function CertificateDownloadButton({ userName, moduleCode, score, totalQuestions }: Props) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) {
        setError("Session expirée — reconnecte-toi.");
        return;
      }

      const examScore = Math.round((score / totalQuestions) * 100);
      const res = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({
          moduleCode,
          examScore,
          examQuestions: totalQuestions,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Impossible d'émettre le certificat.");
        return;
      }

      const cert = data.certificate as {
        id: string;
        candidateName: string;
        moduleLabel: string;
        certCode: string | null;
        issuedAt: string;
      };

      // URL absolue de vérification publique.
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const verifyUrl = `${origin}/verifier-certificat/${cert.id}`;

      const blob = await pdf(
        <CertificateDocument
          userName={cert.candidateName}
          moduleCode={moduleCode}
          moduleName={cert.moduleLabel}
          score={score}
          totalQuestions={totalQuestions}
          certId={cert.id}
          issuedAt={cert.issuedAt}
          certCode={cert.certCode ?? undefined}
          verifyUrl={verifyUrl}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Certificat-HanaFlow-${moduleCode}-${userName?.replace(/\s+/g, "-") || "certificat"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur génération certificat:", err);
      setError("Erreur réseau, réessaie.");
    } finally {
      setLoading(false);
    }
  };

  // Mark `userName` as used (it's passed in props mais on utilise candidateName
  // de la DB pour le PDF — on garde le param pour la rétrocompat).
  void userName;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-sap-blue to-sap-blue-dark text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Génération…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Télécharger mon certificat
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
