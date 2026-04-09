import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/SEO";
import { useMagneticButton } from "../hooks/useMagneticButton";

gsap.registerPlugin(ScrollTrigger);

/* ─── Icônes ──────────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ─── Données ──────────────────────────────────────────────── */
const modules = [
  { code: "FI",  name: "Financial Accounting", path: "/modules-sap/fi",  accent: "#3B82F6", desc: "Comptabilité générale, clients, fournisseurs, états financiers", size: "large" },
  { code: "CO",  name: "Controlling",          path: "/modules-sap/co",  accent: "#8B5CF6", desc: "Centres de coûts, CO-PA, marge analytique", size: "small" },
  { code: "MM",  name: "Materials Mgmt",       path: "/modules-sap/mm",  accent: "#10B981", desc: "Achats, stocks, MRP, Procure-to-Pay", size: "small" },
  { code: "SD",  name: "Sales & Distribution", path: "/modules-sap/sd",  accent: "#F59E0B", desc: "Devis, commandes, livraisons, Order-to-Cash", size: "medium" },
  { code: "HCM", name: "Human Capital Mgmt",   path: "/modules-sap/hcm", accent: "#EC4899", desc: "RH, paie, temps, organisation", size: "medium" },
  { code: "PP",  name: "Production Planning",  path: "/modules-sap/pp",  accent: "#EF4444", desc: "Ordres de fabrication, MRP II, atelier", size: "small" },
];

const marqueeItems = [
  "FI — Finance", "CO — Controlling", "MM — Materials", "SD — Sales",
  "HCM — HR", "PP — Production", "S/4HANA", "AI Joule", "Fiori UX",
  "Universal Journal", "MRP", "Procure-to-Pay", "Order-to-Cash",
];

const stats = [
  { value: 6,    suffix: "",   label: "Modules SAP" },
  { value: 240,  suffix: "+",  label: "Concepts couverts" },
  { value: 100,  suffix: "%",  label: "Gratuit" },
  { value: 40,   suffix: "+",  label: "Exercices & quiz" },
];

const perks = [
  "Contenu rédigé par un consultant SAP",
  "S/4HANA & AI Joule couverts",
  "Roadmap personnalisée",
  "Simulateurs d'examen",
];

/* ─── Composant Marquee ────────────────────────────────────── */
function Marquee() {
  const track = useRef(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const tween = gsap.to(el, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="overflow-hidden border-y border-white/8 py-3 bg-white/3">
      <div ref={track} className="flex gap-10 whitespace-nowrap w-max">
        {items.map((item, i) => (
          <span key={i} className="text-xs font-medium text-slate-400 uppercase tracking-widest flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-sapBlue inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Composant Counter animé ──────────────────────────────── */
function AnimatedCounter({ value, suffix }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration: 1.8,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
      onUpdate: () => {
        el.textContent = Math.round(obj.val) + suffix;
      },
    });
    return () => tween.kill();
  }, [value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─── Page principale ──────────────────────────────────────── */
export default function Home() {
  const heroRef     = useRef(null);
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef      = useRef(null);
  const badgeRef    = useRef(null);

  const magPrimary   = useMagneticButton(0.35);
  const magSecondary = useMagneticButton(0.25);

  /* Animation GSAP hero au montage */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current, { opacity: 0, y: 16, duration: 0.6 })
        .from(
          titleRef.current.querySelectorAll(".word"),
          { opacity: 0, y: 40, stagger: 0.08, duration: 0.7 },
          "-=0.2"
        )
        .from(subtitleRef.current, { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(ctaRef.current.children, { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 }, "-=0.3");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* Animation scroll — module cards */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bento-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 80%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  /* Animation scroll — features */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-item", {
        opacity: 0,
        x: -20,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 80%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const titleWords = ["Maîtrise", "SAP", "S/4HANA", "de zéro", "à consultant"];

  return (
    <>
      <SEO
        title="HanaFlow"
        description="Master SAP Learning Platform — Apprends FI, CO, MM, SD, HCM, PP et S/4HANA avec une plateforme éducative premium."
        path="/"
      />

      {/* ══════════════════════════════════════════════
          HERO — dark, glow, grain
      ══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="grain relative overflow-hidden bg-slate-950 min-h-[92vh] flex flex-col justify-center"
      >
        {/* Glow orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-sapBlue/20 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-sapAccent/15 blur-[100px]" />
        </div>

        {/* Grille décorative */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          {/* Badge */}
          <div ref={badgeRef} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/12 text-xs font-medium text-slate-300 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Plateforme SAP éducative — Gratuit
            </span>
          </div>

          {/* Titre animé mot par mot */}
          <h1
            ref={titleRef}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-none tracking-display"
          >
            {titleWords.map((word, i) => (
              <span key={i} className="word inline-block mr-[0.25em] last:mr-0">
                {word === "S/4HANA" ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapBlue to-sapAccent">
                    {word}
                  </span>
                ) : word === "consultant" ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapAccent to-emerald-400">
                    {word}
                  </span>
                ) : word}
              </span>
            ))}
          </h1>

          {/* Sous-titre */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed"
          >
            La plateforme de référence pour apprendre les modules SAP, comprendre S/4HANA
            et construire une carrière de consultant.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/modules-sap"
              ref={magPrimary.ref}
              onMouseMove={magPrimary.onMouseMove}
              onMouseLeave={magPrimary.onMouseLeave}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl
                         bg-white text-slate-900 text-sm font-bold
                         hover:bg-slate-100 transition-colors active:scale-[0.98]
                         shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Explorer les modules SAP
              <ArrowRight />
            </Link>
            <Link
              to="/register"
              ref={magSecondary.ref}
              onMouseMove={magSecondary.onMouseMove}
              onMouseLeave={magSecondary.onMouseLeave}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl
                         border border-white/20 text-white text-sm font-semibold
                         hover:bg-white/8 hover:border-white/40 transition-colors"
            >
              Créer un compte — Gratuit
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-6 flex-wrap">
            {perks.map((p) => (
              <span key={p} className="flex items-center gap-2 text-xs text-slate-500">
                <span className="text-emerald-400"><CheckIcon /></span>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════════════ */}
      <div className="bg-slate-950">
        <Marquee />
      </div>

      {/* ══════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl sm:text-5xl font-bold gradient-text mb-2 tracking-display">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BENTO GRID — modules
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          {/* Header section */}
          <div className="mb-14">
            <p className="text-xs font-semibold text-sapBlue uppercase tracking-widest mb-3">Curriculum</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-display">
              6 modules SAP couverts
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl">
              Des fiches complètes sur chaque module fonctionnel, avec les flux, les tables clés et les intégrations inter-modules.
            </p>
          </div>

          {/* Bento grid asymétrique */}
          <div className="bento-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">

            {/* FI — grande card (2 colonnes × 2 rangées) */}
            <Link
              to={modules[0].path}
              className="bento-card lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between"
              style={{ "--accent": modules[0].accent }}
            >
              <div aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 30% 40%, ${modules[0].accent}18, transparent 70%)` }}
              />
              <div>
                <span
                  className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-6 uppercase tracking-wider"
                  style={{ background: `${modules[0].accent}22`, color: modules[0].accent }}
                >
                  {modules[0].code}
                </span>
                <h3 className="font-display text-3xl font-bold text-white mb-3 tracking-tight-xl">
                  {modules[0].name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                  {modules[0].desc}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold transition-all duration-200"
                style={{ color: modules[0].accent }}>
                Explorer le module <ArrowRight />
              </div>
            </Link>

            {/* CO, MM, SD, HCM, PP — cards normales */}
            {modules.slice(1).map((m) => (
              <Link
                key={m.code}
                to={m.path}
                className="bento-card group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 flex flex-col justify-between"
              >
                <div aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 60% 30%, ${m.accent}14, transparent 70%)` }}
                />
                <div>
                  <span
                    className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold mb-4 uppercase tracking-wider"
                    style={{ background: `${m.accent}18`, color: m.accent }}
                  >
                    {m.code}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-1.5 tracking-tight-xl">
                    {m.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {m.desc}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200"
                  style={{ color: m.accent }}>
                  Voir <ArrowRight />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/modules-sap"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-700
                         text-sm font-semibold text-slate-600 dark:text-slate-300
                         hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Voir tous les modules <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES — liste horizontale
      ══════════════════════════════════════════════ */}
      <section className="features-section py-20 sm:py-28 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Texte gauche */}
          <div>
            <p className="text-xs font-semibold text-sapBlue uppercase tracking-widest mb-3">Pourquoi HanaFlow</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-display">
              Tout ce qu'il faut<br />pour réussir SAP
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
              Une plateforme pensée pour les consultants juniors et les étudiants qui veulent apprendre SAP sérieusement — pas juste survoler les concepts.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sapBlue text-white text-sm font-bold hover:bg-sapBlueDark transition-colors"
            >
              Commencer gratuitement <ArrowRight />
            </Link>
          </div>

          {/* Liste features droite */}
          <div className="space-y-4">
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, title: "Contenu structuré par module", desc: "Chaque module SAP est découpé en chapitres progressifs — du fondamental aux cas d'usage avancés." },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, title: "Simulateurs d'examen réalistes", desc: "40 questions par module au format SAP officiel. Entraîne-toi avant le vrai examen." },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: "Suivi de progression persisté", desc: "XP, badges et avancement sauvegardés en base — accessibles depuis n'importe quel appareil." },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>, title: "Roadmap consultant personnalisée", desc: "Finance, Supply Chain, RH ou IA — une roadmap adaptée à ton profil cible." },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>, title: "S/4HANA & AI Joule", desc: "Au-delà des modules classiques — architecture HANA, Universal Journal, Fiori, IA intégrée." },
            ].map((f) => (
              <div key={f.title} className="feature-item flex gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-sapBlue/30 transition-colors cursor-pointer">
                <span className="flex-shrink-0 h-10 w-10 rounded-xl bg-sapBlue/10 text-sapBlue flex items-center justify-center">{f.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA FINAL — dark avec glow
      ══════════════════════════════════════════════ */}
      <section className="grain py-20 sm:py-28 px-4 sm:px-6 bg-slate-950 relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-sapBlue/20 blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-white mb-6 tracking-display">
            Commence gratuitement<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapBlue to-sapAccent">
              aujourd'hui
            </span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
            Crée ton compte, accède à tous les modules SAP et suis ta progression vers une carrière de consultant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                         bg-white text-slate-900 text-sm font-bold
                         hover:bg-slate-100 transition-all active:scale-[0.98]
                         shadow-[0_0_40px_rgba(255,255,255,0.12)]"
            >
              Créer mon compte — Gratuit <ArrowRight />
            </Link>
            <Link
              to="/modules-sap"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                         border border-white/20 text-white text-sm font-semibold
                         hover:bg-white/8 hover:border-white/40 transition-all"
            >
              Explorer sans compte
            </Link>
          </div>

          <div className="gradient-line mt-16" />
          <p className="mt-6 text-xs text-slate-600">
            Aucune carte bancaire requise · Accès immédiat · 6 modules SAP complets
          </p>
        </div>
      </section>
    </>
  );
}
