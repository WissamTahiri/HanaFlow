import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }
    if (password && password.length < 8) {
      return setError("Le mot de passe doit contenir au moins 8 caractères.");
    }
    if (!name.trim()) {
      return setError("Le nom ne peut pas être vide.");
    }

    const updates = {};
    if (name !== user?.name) updates.name = name.trim();
    if (password) updates.password = password;

    if (Object.keys(updates).length === 0) {
      return setError("Aucune modification détectée.");
    }

    setLoading(true);
    try {
      await updateProfile(updates);
      setSuccess("Profil mis à jour avec succès !");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Mon profil" description="Modifiez vos informations personnelles sur HanaFlow." path="/profil" />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto space-y-6">

          {/* Navigation retour */}
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-sapBlue hover:underline">
            ← Retour au dashboard
          </Link>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Mon profil</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Modifie ton nom ou ton mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sapBlue/50"
                />
              </div>

              {/* Email (lecture seule) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-400 text-sm cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié.</p>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Nouveau mot de passe <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Laisser vide pour ne pas changer"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sapBlue/50"
                />
              </div>

              {/* Confirmation */}
              {password && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sapBlue/50"
                  />
                </div>
              )}

              {/* Messages */}
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-sapBlue text-white rounded-lg font-medium text-sm hover:bg-sapBlueDark transition-colors disabled:opacity-50"
              >
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
