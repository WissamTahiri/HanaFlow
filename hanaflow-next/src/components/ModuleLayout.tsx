"use client";

import { motion } from "motion/react";
import Link from "next/link";
import TutorChat from "@/components/TutorChat";

type TutorModuleCode = "fi" | "co" | "mm" | "sd" | "pp" | "ai";
const TUTOR_MODULES: readonly TutorModuleCode[] = ["fi", "co", "mm", "sd", "pp", "ai"];

interface ModuleLayoutProps {
  code: string;
  title: string;
  description: string;
  gradient: string;
  badge?: string;
  children: React.ReactNode;
}

const ModuleLayout = ({
  code,
  title,
  description,
  gradient,
  badge,
  children,
}: ModuleLayoutProps) => {
  const tutorCode = TUTOR_MODULES.find((c) => c === code.toLowerCase());
  return (
  <div className="min-h-[calc(100vh-4rem)]">
    {/* Hero */}
    <div className={`bg-linear-to-br ${gradient} text-white`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-xs text-white/60 mb-6" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-white/90 transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/modules-sap" className="hover:text-white/90 transition-colors">Modules SAP</Link>
          <span>/</span>
          <span className="text-white/90">{code}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/30 backdrop-blur-sm">
              {code}
            </span>
            {badge && (
              <span className="text-xs text-white/70">{badge}</span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>
    </div>

    {/* Contenu */}
    <div className="bg-sap-gray-light dark:bg-sap-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {children}
      </div>
    </div>

    {/* Tuteur IA — réservé aux utilisateurs connectés (le widget se masque seul sinon) */}
    {tutorCode && <TutorChat moduleCode={tutorCode} moduleName={title} />}
  </div>
  );
};

export default ModuleLayout;
