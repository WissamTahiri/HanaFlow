"use client";

import { useState } from "react";

/**
 * Formulaire de demande de démo écoles/entreprises.
 * Réutilise POST /api/feedback (auth optionnelle, rate-limité, inbox admin) :
 * la demande arrive dans /admin/feedback avec le contexte "/ecoles".
 */
export default function DemoRequestForm() {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [students, setStudents] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "/ecoles — demande de démo",
          improveWhat: [
            `Demande de démo établissement`,
            `Nom : ${name}`,
            `Établissement : ${school}`,
            `Nombre d'étudiants : ${students || "non précisé"}`,
            message ? `Message : ${message}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
          contactEmail: email,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center">
        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-1">
          Demande envoyée ✓
        </p>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Merci ! Nous revenons vers vous sous 48 h ouvrées.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sap-blue/40 focus:border-sap-blue";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Votre nom *
          </span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Marie Dupont" />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Établissement *
          </span>
          <input required value={school} onChange={(e) => setSchool(e.target.value)} className={inputClass} placeholder="IUT de Lyon, ESN…" />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Email professionnel *
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="m.dupont@univ.fr"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Nombre d&apos;étudiants
          </span>
          <input value={students} onChange={(e) => setStudents(e.target.value)} className={inputClass} placeholder="ex : 25" />
        </label>
      </div>
      <label className="block">
        <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
          Votre besoin (optionnel)
        </span>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
          placeholder="Modules visés, calendrier, contraintes…"
        />
      </label>
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Échec de l&apos;envoi — réessayez dans quelques minutes ou écrivez-nous directement par email.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 rounded-xl bg-sap-blue text-white font-bold text-sm hover:bg-sap-blue-dark transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande de démo"}
      </button>
    </form>
  );
}
