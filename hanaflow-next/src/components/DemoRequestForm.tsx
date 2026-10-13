"use client";

import { useState } from "react";

/**
 * Formulaire de demande de démo — partagé entre /ecoles et /entreprises,
 * avec un vocabulaire adapté à chaque public via `segment`.
 * Réutilise POST /api/feedback (auth optionnelle, rate-limité, inbox admin) :
 * la demande arrive dans /admin/feedback avec un contexte "/ecoles" ou
 * "/entreprises" (l'API n'a pas de champ dédié "type" — on l'encode dans
 * `context`, qui est juste un texte libre côté modèle Feedback).
 */
type Segment = "ecole" | "entreprise";

const COPY: Record<
  Segment,
  {
    context: string;
    requestLabel: string;
    orgLabel: string;
    orgPlaceholder: string;
    emailPlaceholder: string;
    countLabel: string;
    countPlaceholder: string;
    countFieldLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
  }
> = {
  ecole: {
    context: "/ecoles — demande de démo",
    requestLabel: "Demande de démo établissement",
    orgLabel: "Établissement *",
    orgPlaceholder: "IUT de Lyon, ESN…",
    emailPlaceholder: "m.dupont@univ.fr",
    countLabel: "étudiants",
    countPlaceholder: "ex : 25",
    countFieldLabel: "Nombre d'étudiants",
    messagePlaceholder: "Modules visés, calendrier, contraintes…",
    submitLabel: "Envoyer ma demande de démo",
  },
  entreprise: {
    context: "/entreprises — demande de devis",
    requestLabel: "Demande de devis entreprise",
    orgLabel: "Entreprise *",
    orgPlaceholder: "Nom de la société",
    emailPlaceholder: "m.dupont@entreprise.com",
    countLabel: "consultants",
    countPlaceholder: "ex : 8",
    countFieldLabel: "Nombre de consultants à former",
    messagePlaceholder: "Modules visés, calendrier, équipe concernée…",
    submitLabel: "Envoyer ma demande de devis",
  },
};

export default function DemoRequestForm({ segment = "ecole" }: { segment?: Segment }) {
  const copy = COPY[segment];
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [count, setCount] = useState("");
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
          context: copy.context,
          improveWhat: [
            copy.requestLabel,
            `Nom : ${name}`,
            `${copy.orgLabel.replace(" *", "")} : ${org}`,
            `${copy.countFieldLabel} : ${count || "non précisé"}`,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="label">Votre nom *</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Marie Dupont" />
        </label>
        <label className="block">
          <span className="label">{copy.orgLabel}</span>
          <input required value={org} onChange={(e) => setOrg(e.target.value)} className="input" placeholder={copy.orgPlaceholder} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="label">Email professionnel *</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder={copy.emailPlaceholder}
          />
        </label>
        <label className="block">
          <span className="label">Nombre de {copy.countLabel}</span>
          <input value={count} onChange={(e) => setCount(e.target.value)} className="input" placeholder={copy.countPlaceholder} />
        </label>
      </div>
      <label className="block">
        <span className="label">Votre besoin (optionnel)</span>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input"
          placeholder={copy.messagePlaceholder}
        />
      </label>
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Échec de l&apos;envoi — réessayez dans quelques minutes ou écrivez-nous directement par email.
        </p>
      )}
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
        {status === "sending" ? "Envoi en cours…" : copy.submitLabel}
      </button>
    </form>
  );
}
