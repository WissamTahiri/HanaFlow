import Link from "next/link";
import { prisma } from "@/lib/prisma";

/**
 * /verifier-certificat/[id] — page PUBLIQUE de vérification.
 *
 * Server Component. Pas d'auth requise. Affiche le statut du certificat
 * (valide / inexistant / révoqué) et les infos non-sensibles pour qu'un
 * recruteur puisse confirmer l'authenticité.
 *
 * Le proxy.ts ne gate PAS ce prefix donc accessible sans login.
 */

export const dynamic = "force-dynamic";

type VerifyResult =
  | { valid: true; cert: CertData }
  | { valid: false; reason: "not_found" }
  | { valid: false; reason: "revoked"; cert: CertData; revokedAt: Date; revokedReason: string | null };

type CertData = {
  id: string;
  candidateName: string;
  moduleCode: string;
  moduleLabel: string;
  certCode: string | null;
  examScore: number;
  examQuestions: number;
  issuedAt: Date;
};

async function verifyCertificate(id: string): Promise<VerifyResult> {
  if (!id || id.length > 64) return { valid: false, reason: "not_found" };
  const cert = await prisma.completionCertificate.findUnique({
    where: { id },
    select: {
      id: true,
      candidateName: true,
      moduleCode: true,
      moduleLabel: true,
      certCode: true,
      examScore: true,
      examQuestions: true,
      issuedAt: true,
      revokedAt: true,
      revokedReason: true,
    },
  });
  if (!cert) return { valid: false, reason: "not_found" };
  if (cert.revokedAt) {
    return {
      valid: false,
      reason: "revoked",
      cert: cert as CertData,
      revokedAt: cert.revokedAt,
      revokedReason: cert.revokedReason,
    };
  }
  return { valid: true, cert: cert as CertData };
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await verifyCertificate(id);
  const displayId = `HF-${id.slice(0, 8).toUpperCase()}-${id.slice(-4).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-extrabold tracking-tight mb-6">
            <span className="text-sap-blue dark:text-sap-accent">Hana</span>
            <span className="text-slate-900 dark:text-white">Flow</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Vérification de certificat
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{displayId}</p>
        </div>

        {result.valid && <ValidCert cert={result.cert} />}
        {!result.valid && result.reason === "not_found" && <NotFound />}
        {!result.valid && result.reason === "revoked" && (
          <RevokedCert cert={result.cert} revokedAt={result.revokedAt} revokedReason={result.revokedReason} />
        )}

        <div className="mt-10 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            HanaFlow est une plateforme de formation et préparation aux certifications SAP.
            Les certificats HanaFlow attestent d&apos;une préparation rigoureuse mais ne se
            substituent pas à la certification officielle SAP correspondante.
          </p>
          <Link href="/" className="inline-block mt-4 text-sm text-sap-blue dark:text-sap-accent hover:underline">
            Découvrir HanaFlow →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ValidCert({ cert }: { cert: CertData }) {
  return (
    <div className="card overflow-hidden border-0">
      <div className="bg-linear-to-br from-emerald-500 to-emerald-700 text-white p-6 text-center">
        <div className="inline-flex h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center mb-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold mb-1">Certificat valide</h2>
        <p className="text-emerald-100 text-sm">Authentifié par HanaFlow</p>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
        <Row label="Candidat" value={cert.candidateName} bold />
        <Row label="Formation" value={cert.moduleLabel} />
        <Row
          label="Module SAP"
          value={`${cert.moduleCode}${cert.certCode ? ` · ${cert.certCode}` : ""}`}
          mono
        />
        <Row label="Score obtenu" value={`${cert.examScore} % (${Math.round((cert.examScore * cert.examQuestions) / 100)} / ${cert.examQuestions})`} />
        <Row
          label="Émis le"
          value={new Date(cert.issuedAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
      </div>
    </div>
  );
}

function RevokedCert({ cert, revokedAt, revokedReason }: { cert: CertData; revokedAt: Date; revokedReason: string | null }) {
  return (
    <div className="card overflow-hidden border-0">
      <div className="bg-linear-to-br from-rose-500 to-rose-700 text-white p-6 text-center">
        <div className="inline-flex h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center mb-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold mb-1">Certificat révoqué</h2>
        <p className="text-rose-100 text-sm">Ce certificat n&apos;est plus valide</p>
      </div>
      <div className="p-6 sm:p-8 space-y-5">
        <Row label="Candidat" value={cert.candidateName} bold />
        <Row label="Module" value={`${cert.moduleCode} — ${cert.moduleLabel}`} />
        <Row
          label="Révoqué le"
          value={new Date(revokedAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
        {revokedReason && <Row label="Motif" value={revokedReason} />}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="card p-10 text-center">
      <div className="inline-flex h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Certificat introuvable</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        Aucun certificat ne correspond à cet identifiant. Vérifie l&apos;URL ou demande au candidat de te
        re-partager le lien officiel généré par HanaFlow.
      </p>
    </div>
  );
}

function Row({ label, value, bold, mono }: { label: string; value: string; bold?: boolean; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:w-1/3 shrink-0">
        {label}
      </span>
      <span
        className={`text-sm text-slate-900 dark:text-white sm:flex-1 sm:text-right ${bold ? "font-bold text-base" : ""} ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
