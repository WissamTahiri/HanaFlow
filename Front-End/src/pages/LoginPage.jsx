import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

const EyeIcon = ({ show }) => show ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const BookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const TargetIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const ChartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const AwardIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const features = [
  { icon: <BookIcon />, text: "6 modules SAP complets" },
  { icon: <TargetIcon />, text: "Simulateurs d'examen" },
  { icon: <ChartIcon />, text: "Progression persistée" },
  { icon: <AwardIcon />, text: "XP, badges et niveaux" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [error,       setError]       = useState("");
  const [submitting,  setSubmitting]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Identifiants invalides.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Connexion" description="Connecte-toi à HanaFlow pour accéder à ton espace personnel." path="/login" />

      <div className="min-h-[calc(100vh-4.5rem)] flex">

        {/* ── Panel gauche — dark branding ──────────────────── */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] bg-slate-950 px-12 py-14 relative overflow-hidden">
          {/* Glow */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-sapBlue/15 blur-[100px]" />
          </div>
          {/* Grille déco */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

          <div className="relative">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-bold tracking-display">
                <span className="text-sapAccent">Hana</span>
                <span className="text-white">Flow</span>
              </span>
            </Link>
          </div>

          <div className="relative">
            <h2 className="font-display text-4xl font-bold text-white mb-4 tracking-display leading-tight">
              Reprends là<br />où tu t'es arrêté.
            </h2>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed">
              Tes badges, ton XP et ta progression t'attendent.
            </p>
            <div className="space-y-3">
              {features.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-lg bg-sapBlue/15 text-sapAccent flex items-center justify-center flex-shrink-0">{f.icon}</span>
                  <span className="text-sm text-slate-400">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-slate-700">
            Plateforme éducative SAP · Non affilié à SAP SE
          </p>
        </div>

        {/* ── Panel droit — formulaire ───────────────────────── */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-6 py-14">
          <div className="w-full max-w-sm">

            {/* Logo mobile uniquement */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/">
                <span className="font-display text-2xl font-bold tracking-display">
                  <span className="text-sapBlue dark:text-sapAccent">Hana</span>
                  <span className="text-slate-900 dark:text-white">Flow</span>
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white tracking-display mb-2">
                Bon retour !
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pas encore de compte ?{" "}
                <Link to="/register" className="font-semibold text-sapBlue dark:text-sapAccent hover:underline">
                  S'inscrire gratuitement
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input id="email" type="email" autoComplete="email" className="input" placeholder="toi@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label htmlFor="password" className="label">Mot de passe</label>
                <div className="relative">
                  <input id="password" type={showPwd ? "text" : "password"} autoComplete="current-password"
                    className="input pr-11" placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={showPwd ? "Masquer" : "Afficher"}>
                    <EyeIcon show={showPwd} />
                  </button>
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-3 rounded-xl bg-sapBlue text-white text-sm font-bold
                           hover:bg-sapBlueDark transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                           shadow-[0_4px_14px_rgba(37,99,235,0.30)]">
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Connexion…
                  </span>
                ) : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
