import { Link } from "react-router-dom";
import SEO from "./SEO";

/**
 * PageLayout — Hero + wrapper réutilisable pour les pages non-modules (S/4HANA, IA&Joule, etc.)
 *
 * Props :
 *   label        — texte du badge + breadcrumb
 *   title        — titre h1
 *   description  — sous-titre
 *   accent       — couleur CSS hex pour le glow (défaut : #0F52BA)
 *   badge        — texte optionnel à droite du badge
 *   seoTitle / seoDescription / seoPath
 */
const PageLayout = ({
  label,
  title,
  description,
  accent = "#0F52BA",
  badge,
  seoTitle,
  seoDescription,
  seoPath,
  children,
}) => (
  <>
    <SEO title={seoTitle} description={seoDescription} path={seoPath} />

    <div className="min-h-[calc(100vh-4rem)]">
      {/* ── Hero dark ───────────────────────────────────── */}
      <div className="grain relative bg-slate-950 pt-20 pb-14 px-4 sm:px-6 overflow-hidden">
        {/* Glow orb */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 left-1/3 w-[500px] h-[350px] rounded-full blur-[110px] opacity-20"
            style={{ background: accent }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-5" aria-label="Fil d'Ariane">
            <Link to="/" className="hover:text-slate-300 transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-slate-400">{label}</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold border"
              style={{ background: `${accent}20`, color: accent, borderColor: `${accent}40` }}
            >
              {label}
            </span>
            {badge && <span className="text-xs text-slate-500">{badge}</span>}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-display mb-5 leading-tight">
            {title}
          </h1>
          <p className="text-slate-400 max-w-2xl text-base leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* ── Contenu ─────────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
          {children}
        </div>
      </div>
    </div>
  </>
);

export default PageLayout;
