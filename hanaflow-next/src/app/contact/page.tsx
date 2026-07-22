"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { CONTACT } from "@/config/contact";
import { useAuth } from "@/context/AuthContext";

const SUBJECTS = [
  { value: "general", label: "Question générale" },
  { value: "support", label: "Support technique" },
  { value: "school", label: "Demande école / partenariat" },
  { value: "billing", label: "Abonnement / facturation" },
  { value: "data", label: "Demande RGPD (accès, suppression)" },
  { value: "other", label: "Autre" },
];

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.29 6.84 9.63.5.1.68-.22.68-.49 0-.24-.01-1.02-.01-1.85-2.78.61-3.37-1.21-3.37-1.21-.45-1.17-1.11-1.48-1.11-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.19C22 6.58 17.52 2 12 2z"/>
  </svg>
);

const SUBJECT_HINTS: Record<string, string> = {
  general: "Une question sur les modules, le contenu ou le fonctionnement du site.",
  support: "Bug, problème de connexion, erreur d'affichage — précisez votre navigateur si possible.",
  school: "Vous représentez un établissement et souhaitez discuter d'un accès groupe.",
  billing: "Question sur le plan Pro, un paiement ou une facture.",
  data: "Accès, rectification ou suppression de vos données personnelles (RGPD).",
  other: "Décrivez votre demande, on vous redirige vers la bonne personne.",
};

export default function Contact() {
  const { token } = useAuth();
  const [subject, setSubject] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Soumission via /api/feedback (inbox admin en DB) plutôt qu'un mailto :
  // fonctionne sans client mail configuré et sans dépendre d'une boîte
  // contact@ encore en cours de mise en place.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const subjectLabel = SUBJECTS.find((s) => s.value === subject)?.label ?? subject;
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          context: `/contact — ${subjectLabel}`,
          improveWhat: `Nom : ${name}\n${message}`,
          contactEmail: email,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-sap-dark">
      <div className="bg-linear-to-br from-sap-blue-dark via-sap-blue to-sap-400 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-6" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-white/90 transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white/90">Contact</span>
          </nav>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/30 backdrop-blur-sm">
              Contact
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Une question ? Écrivez-nous.</h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed mb-5">
            Support, partenariat école, demande RGPD — décrivez votre besoin, on lit tout
            personnellement.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 border border-white/25 backdrop-blur-sm">
            <ClockIcon />
            Réponse sous 48 heures ouvrées
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              E-mail direct
            </h3>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-sm font-medium text-sap-blue hover:underline break-all"
            >
              {CONTACT.email}
            </a>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Réseaux
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-sap-blue hover:underline"
                >
                  <LinkedInIcon /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-sap-blue hover:underline"
                >
                  <GitHubIcon /> GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Aide & légal
            </h3>
            {/* Traitement secondaire volontaire : liens internes de navigation,
                à distinguer des actions externes (LinkedIn/GitHub) ci-dessus,
                qui restent en style primaire (font-semibold text-sap-blue). */}
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/a-propos" className="text-slate-600 dark:text-slate-300 hover:text-sap-blue transition-colors">
                  À propos de HanaFlow
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="text-slate-600 dark:text-slate-300 hover:text-sap-blue transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-slate-600 dark:text-slate-300 hover:text-sap-blue transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-slate-600 dark:text-slate-300 hover:text-sap-blue transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <div>
            <label htmlFor="subject" className="label">
              Sujet
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input cursor-pointer"
            >
              {SUBJECTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <AnimatePresence mode="wait">
              <motion.p
                key={subject}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
              >
                {SUBJECT_HINTS[subject]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="label">
                Nom
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="email" className="label">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="label">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Détaillez votre demande…"
              className="input resize-y"
            />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            En envoyant ce message vous acceptez que vos données soient utilisées pour
            répondre à votre demande, dans les conditions définies par notre{" "}
            <Link href="/confidentialite" className="text-sap-blue hover:underline">
              politique de confidentialité
            </Link>.
          </p>

          {status === "sent" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3.5"
            >
              <span className="text-emerald-600 dark:text-emerald-400 mt-0.5"><CheckIcon /></span>
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Message envoyé
                </p>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
                  Nous revenons vers vous sous 48 h ouvrées à l&apos;adresse indiquée.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setName("");
                    setEmail("");
                    setMessage("");
                    setSubject("general");
                  }}
                  className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {status === "error" && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Échec de l&apos;envoi — réessayez dans quelques minutes, ou écrivez directement à{" "}
                  <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a>.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary px-6 py-2.5 disabled:opacity-60"
              >
                {status === "sending" ? "Envoi en cours…" : "Envoyer le message →"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
