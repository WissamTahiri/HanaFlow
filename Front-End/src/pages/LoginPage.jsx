import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-sapDark">
      <div className="w-full max-w-md bg-sapCard border border-white/5 rounded-2xl p-6 shadow-soft">
        <h1 className="text-xl font-semibold text-white mb-2">Connexion</h1>
        <p className="text-xs text-sapMuted mb-6">
          Connecte-toi pour accéder à ton espace HanaFlow.
        </p>

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-sapMuted mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg bg-sapDark border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sapBlue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-sapMuted mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full rounded-lg bg-sapDark border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sapBlue"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-sapBlue hover:bg-sapBlueDark disabled:opacity-50 text-white text-sm font-semibold py-2.5 transition"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-sapMuted text-center">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-sapBlue hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
