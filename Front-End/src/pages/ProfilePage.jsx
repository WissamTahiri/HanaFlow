import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../hooks/useProgress";
import { useSubscription } from "../context/SubscriptionContext";
import SEO from "../components/SEO";

/* ─── Icônes ──────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ─── Objectifs SAP ───────────────────────────────────────── */
const LEARNING_GOALS = [
  { value: "fi",        label: "Consultant SAP FI",    accent: "#3B82F6" },
  { value: "co",        label: "Consultant SAP CO",    accent: "#8B5CF6" },
  { value: "mm",        label: "Consultant SAP MM",    accent: "#10B981" },
  { value: "sd",        label: "Consultant SAP SD",    accent: "#F59E0B" },
  { value: "hcm",       label: "Consultant SAP HCM",   accent: "#EC4899" },
  { value: "pp",        label: "Consultant SAP PP",    accent: "#EF4444" },
  { value: "s4hana",    label: "Architecte S/4HANA",   accent: "#06B6D4" },
  { value: "developer", label: "Développeur ABAP/BTP", accent: "#14B8A6" },
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { visitedCount, totalModules } = useProgress();
  const { isPro, plan, downgradeToFree } = useSubscription();
  const navigate = useNavigate();

  const [name,            setName]            = useState(user?.name || "");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd,         setShowPwd]         = useState(false);
  const [success,         setSuccess]         = useState("");
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);

  const [goal, setGoal] = useState(
    () => localStorage.getItem("hanaflow_learning_goal") || ""
  );

  const selectGoal = (value) => {
    const next = goal === value ? "" : value;
    setGoal(next);
    localStorage.setItem("hanaflow_learning_goal", next);
  };

  const fiLessonsCompleted = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hanaflow_fi_lessons") || "[]");
      return Array.isArray(saved) ? saved.length : 0;
    } catch { return 0; }
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (password && password !== confirmPassword) return setError("Les mots de passe ne correspondent pas.");
    if (password && password.length < 8) return setError("Le mot de passe doit contenir au moins 8 caractères.");
    if (!name.trim()) return setError("Le nom ne peut pas être vide.");
    const updates = {};
    if (name !== user?.name) updates.name = name.trim();
    if (password) updates.password = password;
    if (Object.keys(updates).length === 0) return setError("Aucune modification détectée.");
    setLoading(true);
    try {
      await updateProfile(updates);
      setSuccess("Profil mis à jour avec succès !");
      setPassword(""); setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  const activeGoal = LEARNING_GOALS.find((g) => g.value === goal);

  return (
    <>
      <SEO title="Mon profil" description="Modifiez vos informations personnelles sur HanaFlow." path="/profil" />

      {/* ── Hero dark ─────────────────────────────────── */}
      <div className="grain relative bg-slate-950 pt-20 pb-24 px-4 sm:px-6 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full bg-sapBlue/15 blur-[100px]" />
        </div>

        <div className="relative max-w-2xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8">
            ← Retour au dashboard
          </Link>

          {/* Carte profil flottante */}
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0 border border-white/15"
              style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}>
              {initials}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white tracking-display">{user?.name}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
              {activeGoal && (
                <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                  style={{ background: `${activeGoal.accent}18`, color: activeGoal.accent, borderColor: `${activeGoal.accent}40` }}>
                  {activeGoal.label}
                </span>
              )}
            </div>
            <div className="ml-auto">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                isPro ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-white/8 text-slate-400 border border-white/10"
              }`}>
                {isPro ? <><StarIcon /> Pro</> : "Gratuit"}
              </span>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { v: visitedCount,                                            l: "Modules visités" },
              { v: fiLessonsCompleted,                                      l: "Leçons FI" },
              { v: `${Math.round((visitedCount / totalModules) * 100)}%`,  l: "Progression" },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-white/5 border border-white/8">
                <span className="font-display text-2xl font-bold text-white">{v}</span>
                <span className="text-xs text-slate-500 mt-0.5">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contenu ───────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-slate-950 px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto -mt-10 space-y-5">

          {/* Objectif d'apprentissage */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-1 tracking-tight-xl">
              Objectif d'apprentissage
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Quel profil SAP vises-tu ?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LEARNING_GOALS.map((g) => (
                <button key={g.value} onClick={() => selectGoal(g.value)}
                  className={`relative flex flex-col items-center text-center px-3 py-3 rounded-xl border text-xs font-medium
                               transition-all hover:-translate-y-0.5 ${
                    goal === g.value
                      ? "border-current shadow-sm"
                      : "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                  }`}
                  style={goal === g.value ? { background: `${g.accent}18`, color: g.accent, borderColor: `${g.accent}40` } : {}}>
                  {goal === g.value && (
                    <span className="absolute top-1.5 right-1.5 opacity-70"><CheckIcon /></span>
                  )}
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-slate-400"><EditIcon /></span>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white tracking-tight-xl">
                Informations personnelles
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nom complet</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={user?.email || ""} disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700
                             bg-gray-50 dark:bg-slate-800 text-gray-400 text-sm cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">L'adresse email ne peut pas être modifiée.</p>
              </div>
              <div>
                <label className="label">
                  Nouveau mot de passe <span className="text-slate-400 font-normal">(optionnel)</span>
                </label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Laisser vide pour ne pas changer"
                    className="input pr-11" />
                  {password && (
                    <button type="button" onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <EyeIcon open={showPwd} />
                    </button>
                  )}
                </div>
                {password && <p className="text-xs text-slate-400 mt-1">8 caractères minimum.</p>}
              </div>
              {password && (
                <div>
                  <label className="label">Confirmer le mot de passe</label>
                  <input type={showPwd ? "text" : "password"} value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} className="input" />
                </div>
              )}

              {error   && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
              {success && <p className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">{success}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-sapBlue text-white rounded-xl font-medium text-sm
                           hover:bg-sapBlueDark transition-colors disabled:opacity-50
                           shadow-[0_4px_14px_rgba(15,82,186,0.25)]">
                {loading ? "Enregistrement…" : "Enregistrer les modifications"}
              </button>
            </form>
          </div>

          {/* Plan & abonnement */}
          <div className={`rounded-2xl border p-6 ${
            isPro
              ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 dark:from-amber-900/10 dark:to-orange-900/10 dark:border-amber-700/40"
              : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={isPro ? "text-amber-500" : "text-slate-400"}><ZapIcon /></span>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white tracking-tight-xl">Mon abonnement</h2>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  {isPro ? "Plan Pro" : "Plan Gratuit"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {isPro
                    ? "Accès illimité à toutes les certifications et contenus premium."
                    : "Accès au chapitre 1 de la certification FI. Passe à Pro pour tout débloquer."
                  }
                </p>
              </div>
              {isPro ? (
                <button onClick={downgradeToFree}
                  className="text-sm text-slate-400 hover:text-red-500 transition-colors hover:underline flex-shrink-0">
                  Rétrograder
                </button>
              ) : (
                <button onClick={() => navigate("/pricing")}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5
                             bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl
                             hover:from-amber-600 hover:to-orange-600 transition-colors shadow-sm">
                  <StarIcon /> Passer à Pro
                </button>
              )}
            </div>

            {!isPro && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "7 chapitres FI complets (C_TS4FI_2023)",
                  "Simulateur d'examen 40 questions",
                  "Quiz par chapitre avec corrections",
                  "Certifications CO, MM, SD (à venir)",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-sapBlue mt-0.5 flex-shrink-0"><CheckIcon /></span>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
