"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import type { CvData } from "@/types/cv";

/**
 * /cv-builder — wizard de création de CV consultant SAP optimisé ATS.
 *
 * Flow :
 *  1. Form en 5 étapes (identity → XP → formation → skills/certifs → langues)
 *  2. POST /api/cv/optimize avec les données brutes
 *  3. Résultat : score ATS + tips + CV optimisé + bouton PDF
 *
 * Persistance : localStorage `hf_cv_draft` pour ne pas perdre la saisie au reload.
 */

// PDFDownloadLink doit être chargé côté client uniquement (utilise des APIs browser).
// Dynamic import + ssr:false évite le crash de hydration en build.
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false, loading: () => <span className="text-xs text-slate-400">Chargement du PDF…</span> },
);

const CvDocument = dynamic(() => import("@/components/CvDocument"), { ssr: false });

const STORAGE_KEY = "hf_cv_draft";

type Experience = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

type Education = {
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
};

type Certification = {
  name: string;
  code: string;
  year: string;
  issuer: string;
};

type Language = { name: string; level: string };

type FormState = {
  identity: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  targetRole: string;
  yearsExperience: number;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skillsRaw: string;
  certifications: Certification[];
  languages: Language[];
};

const EMPTY_FORM: FormState = {
  identity: { name: "", title: "", email: "", phone: "", location: "", linkedin: "" },
  targetRole: "",
  yearsExperience: 0,
  summary: "",
  experiences: [],
  education: [],
  skillsRaw: "",
  certifications: [],
  languages: [],
};

type OptimizeResponse = {
  cv: CvData & {
    atsTips: string[];
    atsScore: number;
  };
  provider: string;
};

function loadDraft(): FormState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FormState;
  } catch {
    return null;
  }
}

function saveDraft(s: FormState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // localStorage plein — on accepte
  }
}

function CvBuilderContent() {
  const { getToken } = useAuth();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [step, setStep] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [phase, setPhase] = useState<"form" | "optimizing" | "result">("form");
  const [result, setResult] = useState<OptimizeResponse["cv"] | null>(null);
  const [error, setError] = useState("");

  // Charge le draft localStorage au mount.
  // setState dans useEffect : nécessaire pour bridger localStorage (SSR-incompatible)
  // avec le state React qui évolue ensuite via les inputs utilisateur.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const draft = loadDraft();
    if (draft) setForm({ ...EMPTY_FORM, ...draft, identity: { ...EMPTY_FORM.identity, ...draft.identity } });
    setHasLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persiste chaque modification
  useEffect(() => {
    if (hasLoaded) saveDraft(form);
  }, [form, hasLoaded]);

  const TOTAL_STEPS = 5;
  const progressPct = phase === "result" ? 100 : Math.round(((step + 1) / TOTAL_STEPS) * 100);

  // Validation par étape
  const canContinue = (() => {
    switch (step) {
      case 0:
        return !!(form.identity.name && form.identity.email && form.identity.title && form.targetRole);
      case 1:
        return form.experiences.length === 0 || form.experiences.every((e) => e.title && e.company && e.startDate);
      case 2:
        return form.education.length === 0 || form.education.every((e) => e.degree && e.school);
      case 3:
        return true; // skills + certifs optionnels
      case 4:
        return true;
      default:
        return false;
    }
  })();

  const optimize = async () => {
    setError("");
    setPhase("optimizing");
    try {
      const token = await getToken();
      if (!token) {
        setError("Session expirée — reconnecte-toi.");
        setPhase("form");
        return;
      }
      const payload = {
        ...form,
        // Clean entries that are partially filled
        experiences: form.experiences.filter((e) => e.title && e.company),
        education: form.education.filter((e) => e.degree && e.school),
        certifications: form.certifications.filter((c) => c.name),
        languages: form.languages.filter((l) => l.name && l.level),
      };
      const r = await fetch("/api/cv/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message ?? "Erreur d'optimisation");
        setPhase("form");
        return;
      }
      setResult(d.cv);
      setPhase("result");
    } catch {
      setError("Erreur réseau, réessaie.");
      setPhase("form");
    }
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setStep(0);
    setResult(null);
    setPhase("form");
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
            CV Builder IA · ATS-friendly
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-balance">
            Génère un CV consultant SAP qui passe les filtres ATS
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Saisis ton parcours, l&apos;IA réécrit chaque ligne avec action verbs, T-codes officiels et
            structure JD-friendly. PDF prêt à uploader sur LinkedIn, Welcome to the Jungle, Hellowork.
          </p>
        </div>

        {/* Progress */}
        {phase !== "result" && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Étape {step + 1} / {TOTAL_STEPS}
              </span>
              <span className="text-slate-400">{progressPct} %</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sap-blue transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ─────── FORM ─────── */}
          {phase === "form" && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="card p-6 sm:p-8"
            >
              {step === 0 && <Step0 form={form} setForm={setForm} />}
              {step === 1 && <StepExperience form={form} setForm={setForm} />}
              {step === 2 && <StepEducation form={form} setForm={setForm} />}
              {step === 3 && <StepSkills form={form} setForm={setForm} />}
              {step === 4 && <StepLanguages form={form} setForm={setForm} />}

              {error && <p className="text-sm text-red-600 dark:text-red-400 mt-4">{error}</p>}

              <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-5 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2 disabled:opacity-30"
                >
                  ← Précédent
                </button>

                {step < TOTAL_STEPS - 1 ? (
                  <button
                    onClick={() => canContinue && setStep((s) => s + 1)}
                    disabled={!canContinue}
                    className="btn-primary px-5 py-2 text-sm disabled:opacity-40"
                  >
                    Suivant →
                  </button>
                ) : (
                  <button
                    onClick={optimize}
                    disabled={!canContinue}
                    className="btn-primary px-6 py-2.5 text-sm disabled:opacity-40"
                  >
                    Optimiser avec l&apos;IA →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ─────── OPTIMIZING ─────── */}
          {phase === "optimizing" && (
            <motion.div
              key="optimizing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card p-12 text-center"
            >
              <div className="inline-block h-12 w-12 rounded-full border-4 border-sap-blue border-t-transparent animate-spin mb-4" />
              <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Optimisation en cours...
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                L&apos;IA réécrit ton CV pour les ATS. ~10-15 secondes.
              </p>
            </motion.div>
          )}

          {/* ─────── RESULT ─────── */}
          {phase === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score */}
              <div className="card p-8 bg-linear-to-br from-sap-blue-dark to-sap-blue text-white border-0">
                <div className="flex items-center gap-6">
                  <div className="shrink-0 h-24 w-24 rounded-2xl bg-white/15 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold">{result.atsScore}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/70">/ 100</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-white/70 mb-1">Score ATS</p>
                    <p className="text-lg font-bold mb-1">
                      {result.atsScore >= 80
                        ? "Excellent — prêt à envoyer"
                        : result.atsScore >= 60
                          ? "Bon — quelques améliorations possibles"
                          : "À retravailler avec les conseils ci-dessous"}
                    </p>
                    <p className="text-sm text-white/85">
                      Optimisé pour {result.identity.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* ATS Tips */}
              {result.atsTips.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-sap-blue dark:text-sap-accent mb-4">
                    Conseils pour passer à 90+
                  </h3>
                  <ul className="space-y-2.5">
                    {result.atsTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-sap-blue/10 dark:bg-sap-blue/20 text-sap-blue dark:text-sap-accent flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CV Preview (text) */}
              <CvPreview cv={result} />

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <PDFDownloadLink
                  document={<CvDocument cv={result} />}
                  fileName={`CV-${result.identity.name.replace(/\s+/g, "-")}.pdf`}
                  className="btn-primary px-6 py-3"
                >
                  {({ loading }) => (loading ? "Préparation du PDF…" : "Télécharger le PDF →")}
                </PDFDownloadLink>
                <button onClick={() => setPhase("form")} className="btn-outline px-6 py-3">
                  Modifier le CV
                </button>
                <button
                  onClick={reset}
                  className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-4 py-3"
                >
                  Recommencer à zéro
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// FORM STEPS
// ════════════════════════════════════════════════════════════════════

type StepProps = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
};

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-slate-400 mt-1">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sap-blue/40";

function Step0({ form, setForm }: StepProps) {
  const setIdentity = (k: keyof FormState["identity"], v: string) =>
    setForm((f) => ({ ...f, identity: { ...f.identity, [k]: v } }));
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Identité & objectif</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Le strict minimum pour démarrer. Tu peux toujours revenir éditer.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nom complet *">
          <input className={inputCls} value={form.identity.name} onChange={(e) => setIdentity("name", e.target.value)} placeholder="Wissam Tahiri" />
        </Field>
        <Field label="Titre actuel *" hint="Ex. Consultant SAP FI · Senior">
          <input className={inputCls} value={form.identity.title} onChange={(e) => setIdentity("title", e.target.value)} />
        </Field>
        <Field label="Email *">
          <input className={inputCls} type="email" value={form.identity.email} onChange={(e) => setIdentity("email", e.target.value)} />
        </Field>
        <Field label="Téléphone">
          <input className={inputCls} value={form.identity.phone} onChange={(e) => setIdentity("phone", e.target.value)} placeholder="+33 6 ..." />
        </Field>
        <Field label="Localisation">
          <input className={inputCls} value={form.identity.location} onChange={(e) => setIdentity("location", e.target.value)} placeholder="Paris, France" />
        </Field>
        <Field label="LinkedIn">
          <input className={inputCls} value={form.identity.linkedin} onChange={(e) => setIdentity("linkedin", e.target.value)} placeholder="linkedin.com/in/..." />
        </Field>
        <Field label="Poste visé *" hint="Ce que tu cherches. L'IA optimise tout autour de ça.">
          <input className={inputCls} value={form.targetRole} onChange={(e) => setForm((f) => ({ ...f, targetRole: e.target.value }))} placeholder="Consultant SAP FI/CO senior" />
        </Field>
        <Field label="Années d'expérience SAP">
          <input className={inputCls} type="number" min={0} max={50} value={form.yearsExperience} onChange={(e) => setForm((f) => ({ ...f, yearsExperience: parseInt(e.target.value || "0", 10) }))} />
        </Field>
      </div>
    </div>
  );
}

function StepExperience({ form, setForm }: StepProps) {
  const add = () =>
    setForm((f) => ({
      ...f,
      experiences: [...f.experiences, { title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }],
    }));
  const update = (i: number, k: keyof Experience, v: string | boolean) =>
    setForm((f) => ({
      ...f,
      experiences: f.experiences.map((exp, idx) => (idx === i ? { ...exp, [k]: v } : exp)),
    }));
  const remove = (i: number) => setForm((f) => ({ ...f, experiences: f.experiences.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Expérience professionnelle</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Décris chaque poste en quelques phrases — l&apos;IA les réécrit en bullets avec action verbs et T-codes SAP.
      </p>
      <div className="space-y-4">
        {form.experiences.map((exp, i) => (
          <div key={i} className="border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Expérience {i + 1}</span>
              <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <Field label="Poste *">
                <input className={inputCls} value={exp.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Consultant SAP FI" />
              </Field>
              <Field label="Entreprise *">
                <input className={inputCls} value={exp.company} onChange={(e) => update(i, "company", e.target.value)} placeholder="Capgemini" />
              </Field>
              <Field label="Lieu">
                <input className={inputCls} value={exp.location} onChange={(e) => update(i, "location", e.target.value)} placeholder="Paris" />
              </Field>
              <Field label="Période *" hint="Ex. 03/2022 – 09/2024">
                <div className="flex gap-2 items-center">
                  <input className={inputCls} value={exp.startDate} onChange={(e) => update(i, "startDate", e.target.value)} placeholder="03/2022" />
                  <span className="text-xs text-slate-400">à</span>
                  <input
                    className={inputCls}
                    value={exp.current ? "Présent" : exp.endDate}
                    disabled={exp.current}
                    onChange={(e) => update(i, "endDate", e.target.value)}
                    placeholder="09/2024"
                  />
                </div>
                <label className="flex items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-400">
                  <input type="checkbox" checked={exp.current} onChange={(e) => update(i, "current", e.target.checked)} />
                  Poste actuel
                </label>
              </Field>
            </div>
            <Field label="Missions et réalisations" hint="Cite T-codes, modules, chiffres si possible. L'IA fera des bullets propres.">
              <textarea
                className={`${inputCls} min-h-[100px] resize-y`}
                value={exp.description}
                onChange={(e) => update(i, "description", e.target.value)}
                placeholder="Implémentation FI sur S/4HANA pour 12 sociétés. Paramétrage GL, AP, AR. Migration depuis ECC, animation des ateliers Fit-to-Standard. Réduction du cycle de clôture de 8 à 3 jours."
              />
            </Field>
          </div>
        ))}
        <button onClick={add} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-400 hover:border-sap-blue/50 hover:text-sap-blue dark:hover:text-sap-accent transition-colors">
          + Ajouter une expérience
        </button>
      </div>
    </div>
  );
}

function StepEducation({ form, setForm }: StepProps) {
  const add = () =>
    setForm((f) => ({
      ...f,
      education: [...f.education, { degree: "", school: "", location: "", startDate: "", endDate: "" }],
    }));
  const update = (i: number, k: keyof Education, v: string) =>
    setForm((f) => ({ ...f, education: f.education.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)) }));
  const remove = (i: number) => setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. Formation</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Diplômes et formations principales.</p>
      <div className="space-y-4">
        {form.education.map((edu, i) => (
          <div key={i} className="border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Formation {i + 1}</span>
              <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Diplôme *">
                <input className={inputCls} value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} placeholder="Master Finance d'entreprise" />
              </Field>
              <Field label="École / Université *">
                <input className={inputCls} value={edu.school} onChange={(e) => update(i, "school", e.target.value)} placeholder="Paris-Dauphine" />
              </Field>
              <Field label="Lieu">
                <input className={inputCls} value={edu.location} onChange={(e) => update(i, "location", e.target.value)} />
              </Field>
              <Field label="Période">
                <div className="flex gap-2 items-center">
                  <input className={inputCls} value={edu.startDate} onChange={(e) => update(i, "startDate", e.target.value)} placeholder="2018" />
                  <span className="text-xs text-slate-400">à</span>
                  <input className={inputCls} value={edu.endDate} onChange={(e) => update(i, "endDate", e.target.value)} placeholder="2020" />
                </div>
              </Field>
            </div>
          </div>
        ))}
        <button onClick={add} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-400 hover:border-sap-blue/50 hover:text-sap-blue dark:hover:text-sap-accent transition-colors">
          + Ajouter une formation
        </button>
      </div>
    </div>
  );
}

function StepSkills({ form, setForm }: StepProps) {
  const addCert = () =>
    setForm((f) => ({ ...f, certifications: [...f.certifications, { name: "", code: "", year: "", issuer: "" }] }));
  const updateCert = (i: number, k: keyof Certification, v: string) =>
    setForm((f) => ({
      ...f,
      certifications: f.certifications.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)),
    }));
  const removeCert = (i: number) => setForm((f) => ({ ...f, certifications: f.certifications.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">4. Compétences & certifications</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">L&apos;IA catégorise tes skills (SAP / technique / méthodo / soft).</p>

      <Field label="Compétences (en vrac)" hint="Modules SAP, T-codes, outils, langages, méthodologies, soft skills. Liste libre, séparée par virgules ou retours à la ligne.">
        <textarea
          className={`${inputCls} min-h-[140px] resize-y`}
          value={form.skillsRaw}
          onChange={(e) => setForm((f) => ({ ...f, skillsRaw: e.target.value }))}
          placeholder="SAP FI, CO, MM, S/4HANA Cloud, ABAP, ACDOCA, MIRO, FB50, Fiori, Activate, Agile, animation atelier client, reporting comité de pilotage..."
        />
      </Field>

      <div className="mt-6">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Certifications SAP</p>
        <div className="space-y-3">
          {form.certifications.map((c, i) => (
            <div key={i} className="border border-gray-200 dark:border-slate-700 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400">Certif {i + 1}</span>
                <button onClick={() => removeCert(i)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <input className={inputCls} value={c.name} onChange={(e) => updateCert(i, "name", e.target.value)} placeholder="SAP Certified Associate — Financial Accounting" />
                <input className={inputCls} value={c.code} onChange={(e) => updateCert(i, "code", e.target.value)} placeholder="C_TS4FI_2601" />
                <input className={inputCls} value={c.year} onChange={(e) => updateCert(i, "year", e.target.value)} placeholder="2025" />
                <input className={inputCls} value={c.issuer} onChange={(e) => updateCert(i, "issuer", e.target.value)} placeholder="SAP SE" />
              </div>
            </div>
          ))}
          <button onClick={addCert} className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-400 hover:border-sap-blue/50 transition-colors">
            + Ajouter une certification
          </button>
        </div>
      </div>
    </div>
  );
}

function StepLanguages({ form, setForm }: StepProps) {
  const add = () => setForm((f) => ({ ...f, languages: [...f.languages, { name: "", level: "" }] }));
  const update = (i: number, k: keyof Language, v: string) =>
    setForm((f) => ({ ...f, languages: f.languages.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)) }));
  const remove = (i: number) => setForm((f) => ({ ...f, languages: f.languages.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5. Langues & résumé</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Dernière étape avant l&apos;optimisation IA.</p>

      <Field label="Résumé professionnel (optionnel)" hint="Si vide, l'IA le génère à partir du reste.">
        <textarea
          className={`${inputCls} min-h-[100px] resize-y`}
          value={form.summary}
          onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          placeholder="Consultant SAP FI senior avec 8 ans d'XP dans le secteur retail. Spécialiste S/4HANA migration..."
        />
      </Field>

      <div className="mt-6">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Langues</p>
        <div className="space-y-2">
          {form.languages.map((lang, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input className={inputCls} value={lang.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="Anglais" />
              <input className={inputCls} value={lang.level} onChange={(e) => update(i, "level", e.target.value)} placeholder="C1 / Courant" />
              <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700 px-2">×</button>
            </div>
          ))}
          <button onClick={add} className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-400 hover:border-sap-blue/50 transition-colors">
            + Ajouter une langue
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// CV PREVIEW (HTML)
// ════════════════════════════════════════════════════════════════════

function CvPreview({ cv }: { cv: CvData }) {
  return (
    <div className="card p-8 bg-white dark:bg-slate-800">
      <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-4">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{cv.identity.name}</h2>
        <p className="text-sm text-sap-blue dark:text-sap-accent font-medium mt-1">{cv.identity.title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {[cv.identity.email, cv.identity.phone, cv.identity.location, cv.identity.linkedin].filter(Boolean).join(" · ")}
        </p>
      </div>

      <Section title="Profil">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{cv.summary}</p>
      </Section>

      {cv.experiences.length > 0 && (
        <Section title="Expérience professionnelle">
          <div className="space-y-4">
            {cv.experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{exp.title}</h4>
                  <span className="text-xs text-slate-500">{exp.startDate} — {exp.current ? "Présent" : exp.endDate}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {exp.company}{exp.location ? `  ·  ${exp.location}` : ""}
                </p>
                <ul className="space-y-1 ml-4">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-sm text-slate-700 dark:text-slate-300 list-disc leading-relaxed">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {(cv.skills.sap?.length || cv.skills.technical?.length || cv.skills.methods?.length || cv.skills.soft?.length) ? (
        <Section title="Compétences">
          <div className="space-y-2">
            {cv.skills.sap && cv.skills.sap.length > 0 && <SkillRow label="SAP" items={cv.skills.sap} />}
            {cv.skills.technical && cv.skills.technical.length > 0 && <SkillRow label="Technique" items={cv.skills.technical} />}
            {cv.skills.methods && cv.skills.methods.length > 0 && <SkillRow label="Méthodologies" items={cv.skills.methods} />}
            {cv.skills.soft && cv.skills.soft.length > 0 && <SkillRow label="Savoir-faire" items={cv.skills.soft} />}
          </div>
        </Section>
      ) : null}

      {cv.certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="space-y-1">
            {cv.certifications.map((c, i) => (
              <li key={i} className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold">{c.name}</span>
                {c.code ? <span className="font-mono text-xs text-sap-blue dark:text-sap-accent ml-2">{c.code}</span> : null}
                {c.year ? <span className="text-xs text-slate-500 ml-2">({c.year})</span> : null}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {cv.education.length > 0 && (
        <Section title="Formation">
          <ul className="space-y-2">
            {cv.education.map((e, i) => (
              <li key={i}>
                <div className="flex items-baseline justify-between flex-wrap gap-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{e.degree}</span>
                  {(e.startDate || e.endDate) && <span className="text-xs text-slate-500">{e.startDate ?? ""} — {e.endDate ?? ""}</span>}
                </div>
                <p className="text-xs text-slate-500">{e.school}{e.location ? `  ·  ${e.location}` : ""}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {cv.languages.length > 0 && (
        <Section title="Langues">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {cv.languages.map((l, i) => (
              <li key={i} className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold">{l.name}</span> — <span className="text-slate-500">{l.level}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-sap-blue dark:text-sap-accent mb-2">{title}</h3>
      {children}
    </div>
  );
}

function SkillRow({ label, items }: { label: string; items: string[] }) {
  return (
    <p className="text-sm">
      <span className="font-semibold text-slate-900 dark:text-white">{label} : </span>
      <span className="text-slate-700 dark:text-slate-300">{items.join(" · ")}</span>
    </p>
  );
}

export default function CvBuilderPage() {
  return (
    <ProtectedRoute>
      <CvBuilderContent />
    </ProtectedRoute>
  );
}
