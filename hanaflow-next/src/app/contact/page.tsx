"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">
            Contact
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Contactez-nous</h1>
          <p className="text-white/80 text-base sm:text-lg">
            Question, partenariat école, demande RGPD — on vous répond généralement
            sous 48 heures ouvrées.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              E-mail
            </h3>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-sm font-medium text-sap-blue hover:underline"
            >
              {CONTACT.email}
            </a>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Réseaux
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/in/wissam-tahiri-730a47326"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-300 hover:text-sap-blue"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/WissamTahiri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-300 hover:text-sap-blue"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Aide & légal
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/cgu" className="text-slate-600 dark:text-slate-300 hover:text-sap-blue">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-slate-600 dark:text-slate-300 hover:text-sap-blue">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-slate-600 dark:text-slate-300 hover:text-sap-blue">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <div>
            <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Sujet
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/40 focus:border-sap-blue"
            >
              {SUBJECTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nom
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/40 focus:border-sap-blue"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/40 focus:border-sap-blue"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Détaillez votre demande…"
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/40 focus:border-sap-blue"
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
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Message envoyé ✓ — nous revenons vers vous sous 48 h ouvrées.
              </p>
            </div>
          ) : (
            <>
              {status === "error" && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Échec de l&apos;envoi — réessayez dans quelques minutes.
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
