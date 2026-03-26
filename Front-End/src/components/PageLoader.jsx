const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-sapBlue border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Chargement...</p>
    </div>
  </div>
);

export default PageLoader;
