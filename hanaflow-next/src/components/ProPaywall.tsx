import Link from "next/link";

// Server component — paywall affiché aux non-Pro qui tentent d'accéder à un
// simulateur d'examen. Aucune question ne fait partie du bundle de cette page.
export default function ProPaywall({ certPath }: { certPath: string }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-sap-dark flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center max-w-md">
        <div className="h-14 w-14 bg-sap-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Simulateur d&apos;examen — Accès Pro
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          Le simulateur d&apos;examen est réservé aux membres Pro. Active le plan Pro pour accéder à toutes les questions et corrections détaillées.
        </p>
        <Link
          href="/pricing"
          className="block w-full py-2.5 bg-sap-blue text-white rounded-xl font-semibold text-sm hover:bg-sap-blue-dark transition-colors"
        >
          Passer en Pro
        </Link>
        <Link
          href={certPath}
          className="block mt-3 text-sm text-slate-500 hover:text-sap-blue transition-colors"
        >
          ← Retour aux chapitres
        </Link>
      </div>
    </div>
  );
}
