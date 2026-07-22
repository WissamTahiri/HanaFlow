import type { Metadata } from "next";
import Link from "next/link";
import { HANAFLOW_STATS } from "@/config/stats";
import { prisma } from "@/lib/prisma";
import DemoRequestForm from "./DemoRequestForm";

// Même seuil que la home : en dessous, un compteur d'inscrits dessert plus
// qu'il ne rassure un public B2B qui évalue la traction de la plateforme.
const USER_COUNT_DISPLAY_THRESHOLD = 20;

const CheckIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export const metadata: Metadata = {
  title: "Pour les écoles et entreprises",
  description:
    "Formez vos étudiants ou consultants SAP avec HanaFlow : 6 modules S/4HANA, simulateurs d'examen, certificats vérifiables en ligne. Offre écoles et entreprises sur devis.",
};

const PROBLEMS = [
  {
    n: "01",
    title: "Les formations officielles coûtent cher",
    desc: "Un parcours SAP Learning Hub ou une formation certifiante officielle se chiffre en milliers d'euros par étudiant — difficile à financer pour une promotion entière.",
  },
  {
    n: "02",
    title: "Peu de ressources en français",
    desc: "L'essentiel du contenu SAP de qualité est en anglais. Vos étudiants décrochent avant d'avoir compris les fondamentaux.",
  },
  {
    n: "03",
    title: "Pas de pratique au format examen",
    desc: "Lire un support ne prépare pas au QCM chronométré de la certification. Sans entraînement réaliste, le taux d'échec explose.",
  },
];

const FEATURES_AVAILABLE = [
  `${HANAFLOW_STATS.modules} modules SAP S/4HANA complets (FI, CO, MM, SD, PP, IA générative)`,
  `${HANAFLOW_STATS.chapitres} chapitres structurés avec quiz de validation à chaque étape`,
  `${HANAFLOW_STATS.questionsExamen} questions d'examen au format officiel, corrections détaillées`,
  "Certificats de réussite PDF vérifiables en ligne (lien public anti-fraude)",
];

const FEATURES_ROADMAP = [
  "Suivi de progression individuel par étudiant",
  "Tableau de bord enseignant par promotion",
  "Facturation établissement (TVA, mandat administratif)",
];

const ClipboardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const RocketIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 00-4 10c0 2 .5 3.5 1 5l3-1.5 3 1.5c.5-1.5 1-3 1-5a15.3 15.3 0 00-4-10z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 16.5c-1.5.5-2.5 1.5-3 4 2.5-.5 3.5-1.5 4-3M15 16.5c1.5.5 2.5 1.5 3 4-2.5-.5-3.5-1.5-4-3" />
    <circle cx="12" cy="9" r="1.5" />
  </svg>
);

const STEPS = [
  {
    n: "1",
    icon: ClipboardIcon,
    title: "Vous décrivez votre besoin",
    desc: "Nombre d'étudiants, modules ciblés, durée du programme — via le formulaire ci-dessous ou un échange direct.",
  },
  {
    n: "2",
    icon: ClockIcon,
    title: "Nous chiffrons sous 48h",
    desc: "Devis avec palier dégressif selon la taille de la promotion, sans engagement à la démonstration.",
  },
  {
    n: "3",
    icon: RocketIcon,
    title: "Vos étudiants sont opérationnels",
    desc: "Comptes provisionnés, accès immédiat aux 6 modules, suivi de leur progression pendant tout le programme.",
  },
];

const FAQ = [
  {
    q: "Le contenu correspond-il aux certifications SAP officielles ?",
    a: "Oui. Les simulateurs reprennent le format, le nombre de questions et le barème des examens de certification S/4HANA réels — pas un résumé de cours généraliste.",
  },
  {
    q: "Peut-on tester avant de s'engager pour une promotion entière ?",
    a: "Oui. La démonstration donne accès à la plateforme complète sans engagement ni carte bancaire, pour valider le contenu avant toute décision budgétaire.",
  },
  {
    q: "Comment se passe la facturation pour un établissement public ?",
    a: "Nous nous adaptons aux contraintes administratives (bon de commande, mandat, TVA) — à préciser lors de l'échange sur devis.",
  },
];

export default async function EcolesPage() {
  let userCount: number | null = null;
  try {
    const count = await prisma.user.count();
    if (count >= USER_COUNT_DISPLAY_THRESHOLD) userCount = count;
  } catch {
    // DB indisponible → on rend la page sans le compteur.
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-sap-dark">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-blue-900 to-sap-blue text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-[3fr_2fr] gap-10 md:gap-8 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-5 tracking-wide">
              Écoles · Universités · Entreprises
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 text-balance leading-tight">
              Formez vos étudiants SAP avec une plateforme clé en main
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl mb-9 text-pretty">
              Cours structurés en français, simulateurs d&apos;examen au format officiel et certificats
              vérifiables en ligne — pour une fraction du coût des formations officielles.
            </p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <a
                href="#demande-demo"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-sap-blue-dark font-bold hover:bg-blue-50 transition-colors"
              >
                Demander une démo →
              </a>
              <a
                href="#comment-ca-marche"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/35 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Voir comment ça marche
              </a>
            </div>
          </div>
          <dl className="grid grid-cols-3 md:grid-cols-1 gap-4 md:gap-6 md:border-l md:border-white/15 md:pl-8 border-t md:border-t-0 border-white/15 pt-8 md:pt-0">
            <div>
              <dt className="sr-only">Modules SAP</dt>
              <dd className="text-2xl sm:text-3xl font-extrabold">{HANAFLOW_STATS.modules}</dd>
              <p className="text-xs text-white/60 mt-1">modules S/4HANA</p>
            </div>
            <div>
              <dt className="sr-only">Questions d'examen</dt>
              <dd className="text-2xl sm:text-3xl font-extrabold">{HANAFLOW_STATS.questionsExamen}</dd>
              <p className="text-xs text-white/60 mt-1">questions d&apos;examen</p>
            </div>
            <div>
              <dt className="sr-only">Réponse sous 48h ouvrées</dt>
              <dd className="text-2xl sm:text-3xl font-extrabold">48h</dd>
              <p className="text-xs text-white/60 mt-1">délai de réponse au devis</p>
            </div>
          </dl>
        </div>
      </section>

      {/* Problème / solution */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-sap-blue mb-2">Le constat</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Pourquoi la préparation SAP classique ne suffit pas
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="card p-6 hover:border-sap-blue/30 transition-colors"
              >
                <span className="block text-sm font-extrabold text-sap-blue/50 mb-3 tabular-nums">
                  {p.n}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="py-16 sm:py-20 bg-sap-gray-light dark:bg-slate-950/40 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-sap-blue mb-2">Le processus</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Comment ça marche
            </h2>
          </div>

          <div className="relative grid sm:grid-cols-3 gap-6">
            {/* Ligne de progression reliant les 3 étapes (desktop uniquement) */}
            <div
              className="hidden sm:block absolute top-8 left-[calc(100%/6)] right-[calc(100%/6)] h-px bg-gradient-to-r from-sap-blue/70 via-sap-blue/40 to-sap-blue/70"
              aria-hidden
            />

            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="relative card p-6 pt-7 hover:border-sap-blue/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sap-blue text-white shadow-[0_6px_16px_rgba(37,99,235,0.35)]">
                      <Icon />
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-sap-blue/30 text-[10px] font-extrabold text-sap-blue tabular-nums">
                        {s.n}
                      </span>
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">{s.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-sap-blue mb-2">Le contenu</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              Ce que votre établissement obtient
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Les fonctionnalités marquées « accès anticipé » sont co-construites avec nos premiers
              établissements partenaires — rejoignez le programme pour orienter la feuille de route.
            </p>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
            Disponible aujourd&apos;hui
          </p>
          <ul className="card divide-y divide-gray-100 dark:divide-slate-700 mb-8">
            {FEATURES_AVAILABLE.map((label) => (
              <li key={label} className="flex items-start gap-3 px-5 py-4">
                <span
                  className="shrink-0 mt-0.5 h-6 w-6 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                >
                  <CheckIcon />
                </span>
                <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Sur la feuille de route
          </p>
          <ul className="divide-y divide-gray-100 dark:divide-slate-700 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/30">
            {FEATURES_ROADMAP.map((label) => (
              <li key={label} className="flex items-start gap-3 px-5 py-4">
                <span
                  className="shrink-0 mt-0.5 h-6 w-6 rounded-full border-2 border-sap-blue/30 bg-sap-blue/10 dark:bg-sap-blue/20"
                  aria-hidden
                />
                <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {label}
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sap-blue/10 text-sap-blue dark:bg-sap-blue/20">
                    Accès anticipé
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Tarification <strong className="text-slate-900 dark:text-white">sur devis</strong>, avec des
            paliers dégressifs selon la taille de la promotion — réponse sous 48h ouvrées, sans
            engagement à la démo. Voir aussi{" "}
            <Link href="/pricing" className="text-sap-blue hover:underline">
              nos tarifs individuels
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="card group px-5 py-4">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-slate-900 dark:text-white">
                  {item.q}
                  <span className="shrink-0 text-sap-blue transition-transform duration-200 group-open:rotate-45 text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / formulaire */}
      <section id="demande-demo" className="py-16 sm:py-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-3">
            Demander une démo
          </h2>
          {userCount !== null && (
            <p className="text-xs font-semibold text-sap-blue text-center mb-3">
              {userCount}+ apprenants déjà inscrits sur HanaFlow
            </p>
          )}
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
