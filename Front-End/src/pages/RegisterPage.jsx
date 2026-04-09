import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

const testimonial = {
  text: "HanaFlow m'a permis de comprendre les intégrations FI/CO en quelques heures — ce que j'avais du mal à saisir depuis des semaines.",
  author: "Étudiant M2 Finance",
};

const CheckCircleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const GraduationIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const MapIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);
const AwardIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const perks = [
  { icon: <CheckCircleIcon />, text: "100% gratuit pour commencer" },
  { icon: <GraduationIcon />, text: "Simulateurs d'examen SAP" },
  { icon: <MapIcon />, text: "Roadmap consultant personnalisée" },
  { icon: <AwardIcon />, text: "Gamification — XP & badges" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Erreur lors de la création du compte.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Créer un compte" description="Rejoins HanaFlow gratuitement pour accéder aux modules SAP." path="/register" />

      <div className="min-h-[calc(100vh-4.5rem)] flex">

        {/* ── Panel gauche — dark branding ──────────────────── */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] bg-slate-950 px-12 py-14 relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/4 right-0 w-[350px] h-[350px] rounded-full bg-sapAccent/10 blur-[100px]" />
            <div className="absolute bottom-1/4 left-0 w-[250px] h-[250px] rounded-full bg-sapBlue/15 blur-[80px]" />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

          <div className="relative">
            <Link to="/">
              <span className="font-display text-2xl font-bold tracking-display">
                <span className="text-sapAccent">Hana</span>
                <span className="text-white">Flow</span>
              </span>
            </Link>
          </div>

          <div className="relative space-y-8">
            <div>
              <h2 className="font-display text-4xl font-bold text-white mb-4 tracking-display leading-tight">
                Lance ta carrière<br />SAP aujourd'hui.
              </h2>
              <div className="space-y-3">
                {perks.map((p) => (
                  <div key={p.text} className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-lg bg-sapAccent/15 text-sapAccent flex items-center justify-center flex-shrink-0">{p.icon}</span>
                    <span className="text-sm text-slate-400">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="border border-white/8 rounded-2xl p-5 bg-white/3">
              <p className="text-sm text-slate-300 leading-relaxed mb-3 italic">
                "{testimonial.text}"
              </p>
              <p className="text-xs text-slate-600">— {testimonial.author}</p>
            </div>
          </div>

          <p className="relative text-xs text-slate-700">
            Plateforme éducative SAP · Non affilié à SAP SE
          </p>
        </div>

        {/* ── Panel droit — formulaire ───────────────────────── */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-6 py-14">
          <div className="w-full max-w-sm">

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
                Créer un compte
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Déjà inscrit ?{" "}
                <Link to="/login" className="font-semibold text-sapBlue dark:text-sapAccent hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="label">Nom complet</label>
                <input id="name" type="text" autoComplete="name" className="input" placeholder="Wissam Tahiri"
                  value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label htmlFor="email" className="label">Email</label>
                <input id="email" type="email" autoComplete="email" className="input" placeholder="toi@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Mot de passe
                  <span className="ml-1.5 text-xs font-normal text-slate-400">8 car. min, 1 lettre + 1 chiffre</span>
                </label>
                <input id="password" type="password" autoComplete="new-password" className="input" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
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
                    Création…
                  </span>
                ) : "Créer mon compte — Gratuit"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-600">
              En créant un compte, tu acceptes nos{" "}
              <span className="underline underline-offset-2 cursor-pointer">conditions d'utilisation</span>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
