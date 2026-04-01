"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 bg-gray-50 dark:bg-sap-dark">
      <div className="text-center max-w-lg">
        <p className="text-6xl mb-6">⚠️</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Une erreur s&apos;est produite
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Quelque chose s&apos;est mal passé. Tu peux réessayer ou retourner à l&apos;accueil.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="btn-primary w-full sm:w-auto justify-center py-3"
          >
            Réessayer
          </button>
          <Link href="/" className="btn-outline w-full sm:w-auto justify-center py-3">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
