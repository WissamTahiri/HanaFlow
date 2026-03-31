export default function PageLoader() {
  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center"
      role="status"
      aria-label="Chargement en cours"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-sap-blue/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sap-blue animate-spin" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-linear-to-br from-sap-blue to-sap-blue-dark
                          flex items-center justify-center text-[9px] font-bold text-white">
            HF
          </div>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">HanaFlow</span>
        </div>
      </div>
    </div>
  );
}
