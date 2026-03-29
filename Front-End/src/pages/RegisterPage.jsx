import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const perks = [
  "Accès à tous les modules SAP",
  "Dashboard de progression",
  "Roadmap personnalisée",
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
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
      <SEO title="Créer un compte" description="Rejoins HanaFlow gratuitement pour accéder aux modules SAP et suivre ta progression." path="/register" />

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-sapDark px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sapBlue to-sapBlueDark
                              flex items-center justify-center text-sm font-bold text-white shadow-soft">
                HF
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">HanaFlow</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Rejoindre HanaFlow</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gratuit, sans carte bancaire.
            </p>
          </div>

          {/* Perks */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {perks.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full font-medium">
                <CheckIcon /> {p}
              </span>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-8">

            {error && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <span className="text-red-500 mt-0.5 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </span>
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="label">Nom complet</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className="input"
                  placeholder="Wissam Tahiri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="label">Adresse email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input"
                  placeholder="toi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Mot de passe
                  <span className="ml-2 text-xs font-normal text-slate-400">8 caractères min, 1 lettre + 1 chiffre</span>
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary justify-center py-3 text-base"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Création en cours...
                  </span>
                ) : "Créer mon compte — Gratuit"}
              </button>
            </form>

            <p className="mt-5 text-sm text-center text-slate-500 dark:text-slate-400">
              Déjà un compte ?{" "}
              <Link to="/login" className="font-semibold text-sapBlue dark:text-sapAccent hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
            En créant un compte, tu acceptes nos conditions d'utilisation.
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
