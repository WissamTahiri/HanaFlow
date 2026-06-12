import type { Metadata } from "next";
import Link from "next/link";
import { HANAFLOW_STATS } from "@/config/stats";
import DemoRequestForm from "./DemoRequestForm";

export const metadata: Metadata = {
  title: "Pour les écoles et entreprises",
  description:
    "Formez vos étudiants ou consultants SAP avec HanaFlow : 6 modules S/4HANA, simulateurs d'examen, certificats vérifiables en ligne. Offre écoles et entreprises sur devis.",
};

const PROBLEMS = [
  {
    title: "Les formations officielles coûtent cher",
    desc: "Un parcours SAP Learning Hub ou une formation certifiante officielle se chiffre en milliers d'euros par étudiant — difficile à financer pour une promotion entière.",
  },
  {
    title: "Peu de ressources en français",
    desc: "L'essentiel du contenu SAP de qualité est en anglais. Vos étudiants décrochent avant d'avoir compris les fondamentaux.",
  },
  {
    title: "Pas de pratique au format examen",
    desc: "Lire un support ne prépare pas au QCM chronométré de la certification. Sans entraînement réaliste, le taux d'échec explose.",
  },
];

const FEATURES = [
  { label: `${HANAFLOW_STATS.modules} modules SAP S/4HANA complets (FI, CO, MM, SD, PP, IA générative)`, available: true },
  { label: `${HANAFLOW_STATS.chapitres} chapitres structurés avec quiz de validation à chaque étape`, available: true },
  { label: `${HANAFLOW_STATS.questionsExamen} questions d'examen au format officiel, corrections détaillées`, available: true },
  { label: "Certificats de réussite PDF vérifiables en ligne (lien public anti-fraude)", available: true },
  { label: "Suivi de progression individuel par étudiant", available: false },
  { label: "Tableau de bord enseignant par promotion", available: false },
  { label: "Facturation établissement (TVA, mandat administratif)", available: false },
];

export default function EcolesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-sap-dark">
      {/* Hero */}
      <section className="bg-linear-to-br from-slate-900 via-blue-900 to-sap-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-5">
            Écoles · Universités · Entreprises
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 text-balance">
            Formez vos étudiants SAP avec une plateforme clé en main
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Cours structurés en français, simulateurs d&apos;examen au format officiel et certificats
            vérifiables en ligne — pour une fraction du coût des formations officielles.
          </p>
          <a
            href="#demande-demo"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-sap-blue-dark font-bold hover:bg-blue-50 transition-colors"
          >
            Demander une démo →
          </a>
        </div>
      </section>

      {/* Problème / solution */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
            Le problème que nous résolvons
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-4">
            Ce que votre établissement obtient
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-10">
            Les fonctionnalités marquées « accès anticipé » sont co-construites avec nos premiers
            établissements partenaires — rejoignez le programme pour orienter la feuille de route.
          </p>
          <ul className="space-y-4">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <span
                  className={`shrink-0 mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    f.available
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                  }`}
                  aria-hidden
                >
                  {f.available ? "✓" : "⏳"}
                </span>
                <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {f.label}
                  {!f.available && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      Accès anticipé
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Tarification <strong className="text-slate-900 dark:text-white">sur devis</strong> selon la
            taille de la promotion — voir aussi{" "}
            <Link href="/pricing" className="text-sap-blue hover:underline">
              nos tarifs individuels
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA / formulaire */}
      <section id="demande-demo" className="py-16 sm:py-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-3">
            Demander une démo
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
            Réponse sous 48 h ouvrées. Vous pouvez aussi passer par le{" "}
            <Link href="/contact" className="text-sap-blue hover:underline">
              formulaire de contact
            </Link>
            .
          </p>
          <DemoRequestForm />
        </div>
      </section>
    </div>
  );
}
