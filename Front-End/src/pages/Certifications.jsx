import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/SEO.jsx";

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  { id: "fi",  code: "C_TS4FI_2023", name: "Financial Accounting",    module: "SAP FI",  accent: "#3B82F6", path: "/certifications/fi",  available: true },
  { id: "co",  code: "C_TS4CO_2023", name: "Management Accounting",   module: "SAP CO",  accent: "#8B5CF6", path: "/certifications/co",  available: true },
  { id: "mm",  code: "C_TS4MM_2023", name: "Materials Management",    module: "SAP MM",  accent: "#10B981", path: "/certifications/mm",  available: true },
  { id: "sd",  code: "C_TS4SD_2023", name: "Sales & Distribution",    module: "SAP SD",  accent: "#F59E0B", path: "/certifications/sd",  available: true },
  { id: "hcm", code: "C_THR81_2311", name: "Human Capital Mgmt",      module: "SAP HCM", accent: "#EC4899", path: "/certifications/hcm", available: true },
  { id: "pp",  code: "C_TS422_2023", name: "Production Planning",     module: "SAP PP",  accent: "#EF4444", path: "/certifications/pp",  available: true },
];

const STEPS = [
  { n: "01", title: "Étudiez les chapitres",  desc: "Contenu aligné sur le périmètre officiel de l'examen" },
  { n: "02", title: "Validez par les quiz",   desc: "Quiz par chapitre dans le format des vraies questions SAP" },
  { n: "03", title: "Simulez l'examen",       desc: "40 questions chronométrées avec résultats détaillés" },
];

const FAQ = [
  { q: "Dois-je refaire la formation sur le site de SAP ?",
    a: "Non. Les cours officiels SAP ne sont pas obligatoires. Vous passez l'examen directement sur SAP Certification Hub après votre préparation sur HanaFlow." },
  { q: "Quel est le format de l'examen officiel ?",
    a: "80 questions à choix multiples, 180 minutes, seuil de réussite à 65%. L'examen se passe en ligne (proctored) ou dans un centre de test agréé." },
  { q: "Combien coûte l'examen ?",
    a: "Un voucher d'examen SAP coûte environ 500€. Il vous donne accès à une tentative. En cas d'échec, un 2ème voucher peut être acheté." },
];

export default function Certifications() {
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cert-card", {
        opacity: 0, y: 28, stagger: 0.07, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO
        title="Certifications SAP"
        description="Préparez les certifications SAP officielles avec des cours structurés, des quiz et un simulateur d'examen."
        path="/certifications"
      />

      {/* ── Hero dark ─────────────────────────────────── */}
      <section className="grain relative bg-slate-950 pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[350px] rounded-full bg-sapBlue/15 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-sapBlue uppercase tracking-widest mb-4">Certifications</p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white tracking-display mb-5 leading-tight">
            Préparez votre<br className="hidden sm:block" /> certification SAP
          </h1>
          <p className="text-slate-400 max-w-xl text-base leading-relaxed mb-14">
            Parcours structurés, quiz par chapitre et simulateurs d'examen — pour passer votre certification en confiance.
          </p>

          {/* 3 étapes */}
          <div className="grid sm:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div key={s.n} className="flex items-start gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/8">
                <span className="font-display text-2xl font-bold text-white/20 flex-shrink-0">{s.n}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{s.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contenu ───────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

          {/* Bandeau info officiel */}
          <div className="mb-10 flex gap-3 px-5 py-4 rounded-2xl bg-sapBlue/8 border border-sapBlue/20">
            <svg className="w-5 h-5 text-sapBlue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-white">Comment ça fonctionne ?</span>{" "}
              Vous vous formez ici sur HanaFlow, puis vous vous inscrivez et passez l'examen directement sur{" "}
              <a href="https://training.sap.com/certification" target="_blank" rel="noopener noreferrer"
                className="underline text-sapBlue">SAP Training & Certification Hub</a>.
              Les cours officiels ne sont pas obligatoires.
            </p>
          </div>

          {/* Grille de certifications */}
          <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-6 tracking-tight-xl">
            Certifications disponibles
          </h2>
          <div ref={cardsRef} className="grid sm:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              cert.available ? (
                <Link key={cert.id} to={cert.path}
                  className="cert-card group relative flex flex-col bg-white dark:bg-slate-900
                             rounded-2xl border border-gray-100 dark:border-slate-800
                             hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
                             transition-all duration-300 overflow-hidden">
                  {/* Glow hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${cert.accent}10, transparent 70%)` }} />

                  {/* Header coloré */}
                  <div className="relative px-6 pt-6 pb-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-sm font-bold flex-shrink-0"
                        style={{ background: `${cert.accent}18`, color: cert.accent }}>
                        {cert.id.toUpperCase()}
                      </span>
                      <div>
                        <p className="font-display font-semibold text-slate-900 dark:text-white text-sm tracking-tight-xl">
                          {cert.name}
                        </p>
                        <p className="font-mono text-xs text-slate-400 mt-0.5">{cert.code}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                      Disponible
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="relative px-6 pb-6">
                    <div className="grid grid-cols-3 gap-3 mb-5 pt-4 border-t border-gray-100 dark:border-slate-800">
                      {[
                        { v: "80",     l: "questions" },
                        { v: "180",    l: "min" },
                        { v: "7",      l: "chapitres" },
                      ].map(({ v, l }) => (
                        <div key={l} className="text-center">
                          <p className="font-display text-xl font-bold text-slate-900 dark:text-white">{v}</p>
                          <p className="text-xs text-slate-400">{l}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Associate · Seuil 65%</span>
                      <span className="text-xs font-semibold transition-all duration-200 flex items-center gap-1"
                        style={{ color: cert.accent }}>
                        Commencer
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div key={cert.id}
                  className="cert-card flex flex-col bg-white dark:bg-slate-900 rounded-2xl
                             border border-gray-100 dark:border-slate-800 overflow-hidden opacity-50">
                  <div className="px-6 pt-6 pb-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-sm font-bold"
                        style={{ background: `${cert.accent}18`, color: cert.accent }}>
                        {cert.id.toUpperCase()}
                      </span>
                      <div>
                        <p className="font-display font-semibold text-slate-900 dark:text-white text-sm">{cert.name}</p>
                        <p className="font-mono text-xs text-slate-400 mt-0.5">{cert.code}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/20">
                      Bientôt
                    </span>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-12 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-5 tracking-tight-xl">
              Questions fréquentes
            </h3>
            <div className="space-y-5">
              {FAQ.map((item, i) => (
                <div key={i} className={`${i < FAQ.length - 1 ? "border-b border-gray-100 dark:border-slate-800 pb-5" : ""}`}>
                  <p className="font-medium text-sm text-slate-900 dark:text-white mb-1.5">{item.q}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
