import React, { useState } from "react";

const HcmQuiz = () => {
  const questions = [
    {
      id: 1,
      question:
        "Quel est l’objectif principal du module SAP HCM classique (on‑premise) ?",
      options: [
        "Gérer les stocks et la logistique",
        "Gérer le cycle de vie des employés (données perso, organisation, temps, paie)",
        "Gérer la comptabilité externe",
      ],
      answer: 1,
      explanation:
        "SAP HCM couvre la gestion administrative RH : Personnel Administration, Organizational Management, Time Management et Payroll.[web:189][web:191]",
    },
    {
      id: 2,
      question:
        "Quel sous‑module HCM gère la structure hiérarchique de l’entreprise (postes, unités orga) ?",
      options: [
        "Personnel Administration (PA)",
        "Organizational Management (OM)",
        "Time Management",
      ],
      answer: 1,
      explanation:
        "OM modélise l’organisation : unités, postes, relations hiérarchiques.[web:189]",
    },
    {
      id: 3,
      question: "Time Management dans SAP HCM sert principalement à :",
      options: [
        "Suivre les heures travaillées, absences et quotas",
        "Gérer les factures fournisseurs",
        "Planifier la production",
      ],
      answer: 0,
      explanation:
        "Time Management gère horaires, pointages, absences, quotas de congés, et prépare les données pour la paie.[web:189][web:196]",
    },
    {
      id: 4,
      question:
        "Quel est le lien clé entre Time Management et Payroll en HCM ?",
      options: [
        "La Time Evaluation transforme les données temps en éléments paie",
        "Les factures fournisseurs",
        "Les ordres de fabrication",
      ],
      answer: 0,
      explanation:
        "La Time Evaluation évalue les heures, primes, absences et génère des wage types pour la paie.[web:188][web:190][web:193]",
    },
    {
      id: 5,
      question:
        "Vrai ou Faux : dans la stratégie SAP actuelle, SuccessFactors est la solution HCM d’avenir pour S/4HANA.",
      options: ["Vrai", "Faux"],
      answer: 0,
      explanation:
        "SAP positionne SuccessFactors comme solution HCM stratégique, avec HCM for S/4HANA comme option de continuité on‑premise.[web:191][web:197][web:200]",
    },
    {
      id: 6,
      question:
        "Quel composant SuccessFactors est souvent utilisé comme core RH (master data employés) dans les scénarios cloud ?",
      options: ["Employee Central", "Learning", "Compensation"],
      answer: 0,
      explanation:
        "Employee Central est le core HR cloud, souvent intégré à S/4HANA Finance et Payroll.[web:191][web:194]",
    },
    {
      id: 7,
      question:
        "Quelle est l’intégration typique dans un scénario hybride HCM S/4HANA + SuccessFactors ?",
      options: [
        "Tout HCM reste on‑premise sans lien avec le cloud",
        "Core paie/temps on‑premise, talent & expérience dans SuccessFactors",
        "Finance héberge les données RH",
      ],
      answer: 1,
      explanation:
        "Un scénario courant : payroll/PA/Time sur HCM S/4HANA, Talent (Recruiting, Learning…) sur SuccessFactors.[web:191][web:194][web:197]",
    },
    {
      id: 8,
      question:
        "Vrai ou Faux : Joule commence à être intégré dans SuccessFactors pour des cas d’usage RH (ex : explain my pay).",
      options: ["Vrai", "Faux"],
      answer: 0,
      explanation:
        "Les releases SuccessFactors 2025 introduisent des fonctionnalités Joule pour expliquer la paie et assister les HR admins.[web:192][web:198]",
    },
    {
      id: 9,
      question:
        "Quelle combinaison est typiquement critique pour la conformité et la satisfaction des employés ?",
      options: ["FI + MM", "Time Management + Payroll intégrés", "SD + CO"],
      answer: 1,
      explanation:
        "L’intégration Temps/Paie impacte directement l’exactitude et la ponctualité des salaires.[web:188][web:190]",
    },
    {
      id: 10,
      question:
        "Quel avantage clé apporte l’intégration Time–Payroll selon les études récentes ?",
      options: [
        "Augmenter le stock de matières",
        "Réduire fortement la saisie manuelle et les erreurs de paie",
        "Supprimer le besoin de contrôles qualité",
      ],
      answer: 1,
      explanation:
        "Les études montrent une réduction importante de la saisie manuelle, des erreurs et un gain de productivité RH.[web:188][web:190]",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (qid, idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const handleSubmit = () => setSubmitted(true);
  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = questions.reduce((acc, q) => {
    const a = answers[q.id];
    return acc + (a === q.answer ? 1 : 0);
  }, 0);

  return (
    <div className="mt-8 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/70 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">
        Quiz HCM – PA/OM, Time & Payroll, SuccessFactors
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Teste ta compréhension des fondamentaux HCM on‑premise et du
        positionnement SuccessFactors.
      </p>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="border border-sapBlue/10 rounded-xl p-3">
            <p className="text-sm font-semibold mb-2">
              {q.id}. {q.question}
            </p>
            <div className="space-y-1">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                const isCorrect = q.answer === idx;
                const showColors = submitted;
                let cls =
                  "w-full text-left text-xs sm:text-sm px-3 py-1.5 rounded-full border transition-colors";

                if (!showColors) {
                  cls += selected
                    ? " border-sapBlue bg-sapBlue/10 text-sapBlue"
                    : " border-sapBlue/20 hover:border-sapBlue/60 hover:bg-sapBlue/5";
                } else if (showColors && isCorrect) {
                  cls +=
                    " border-emerald-500 bg-emerald-500/10 text-emerald-200";
                } else if (showColors && selected && !isCorrect) {
                  cls += " border-rose-500 bg-rose-500/10 text-rose-200";
                } else {
                  cls += " border-sapBlue/10";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChange(q.id, idx)}
                    className={cls}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                Explication : {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-sapBlue text-white text-sm font-semibold shadow-soft hover:bg-sapBlueDark transition-colors"
        >
          Valider mes réponses
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-sapBlue/40 text-sapBlue text-sm font-semibold hover:bg-sapBlue/5 transition-colors"
        >
          Recommencer le quiz
        </button>
        {submitted && (
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
            Score : {score} / {questions.length}
          </p>
        )}
      </div>
    </div>
  );
};

const HcmMiniProjectChecklist = () => {
  const items = [
    "Être capable d’expliquer la différence PA / OM à un RH ou un manager.",
    "Comprendre les concepts de base Time Management (horaires, absences, quotas).",
    "Décrire le flux Time → Payroll (Time Evaluation, wage types).",
    "Connaître les grandes briques SuccessFactors et la stratégie SAP HCM.",
    "Identifier 2–3 cas d’usage Joule dans SuccessFactors (explain my pay, analytics RH).",
    "Préparer 3 cas de test HCM : changement d’organisation, absence, erreur de paie.",
  ];

  const [done, setDone] = useState(Array(items.length).fill(false));
  const completed = done.filter(Boolean).length;
  const progress = Math.round((completed / items.length) * 100);

  const toggle = (idx) => {
    setDone((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  return (
    <div className="mt-8 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 bg-emerald-500/5">
      <h2 className="text-xl font-semibold mb-2">
        Mini‑projet HCM – Devenir opérationnel sur les bases RH SAP
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
        Utilise cette checklist pour structurer ton apprentissage HCM /
        SuccessFactors dans une logique de mission FI/CO/MM/SD + RH.
      </p>
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
          <span>Progression</span>
          <span>
            {completed} / {items.length} ({progress}%)
          </span>
        </div>
        <div className="h-2 rounded-full bg-emerald-500/10 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <button
              type="button"
              onClick={() => toggle(idx)}
              className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center text-[10px] ${
                done[idx]
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-emerald-500/60 bg-transparent"
              }`}
            >
              {done[idx] ? "✓" : ""}
            </button>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HcmResources = () => {
  return (
    <div className="mt-8 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/60 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">
        Ressources HCM / Time & Payroll / SuccessFactors
      </h2>
      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <li>
          Présentation{" "}
          <span className="font-semibold">
            SAP HCM Payroll & Time Management
          </span>{" "}
          (démo et overview) –{" "}
          <a
            href="https://www.scribd.com/presentation/710735690/Sap-Hcm-Demo"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir la présentation
          </a>
          .[web:186]
        </li>
        <li>
          Cours{" "}
          <span className="font-semibold">
            Business Processes in SAP HCM on S/4HANA – intégration
            SuccessFactors & HCM
          </span>{" "}
          –{" "}
          <a
            href="https://learning.sap.com/courses/business-processes-in-sap-hcm-on-s-4hana/integrating-sap-successfactors-and-sap-hcm-s-4hana"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir le cours
          </a>
          .[web:194]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            SAP SuccessFactors vs. SAP HCM for SAP S/4HANA
          </span>{" "}
          – stratégie HR de SAP et scénarios de transition –{" "}
          <a
            href="https://blog.sap-press.com/how-does-sap-successfactors-compare-to-sap-human-capital-management-for-sap-s4hana"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire l&apos;article
          </a>
          .[web:191]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            SAP HCM time management and payroll integration – streamlining
            payroll processing
          </span>{" "}
          – intégration Temps/Paie et gains de productivité –{" "}
          <a
            href="https://journalijsra.com/content/sap-hcm-time-management-and-payroll-integration-streamlining-payroll-processing"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire l&apos;article
          </a>
          .[web:190]
        </li>
        <li>
          Blog{" "}
          <span className="font-semibold">
            First Half 2025: What&apos;s New in SAP SuccessFactors HCM
          </span>{" "}
          – nouveautés SuccessFactors H1 2025 (dont Joule “explain my pay”) –{" "}
          <a
            href="https://community.sap.com/t5/human-capital-management-blog-posts-by-sap/first-half-2025-what-s-new-in-sap-successfactors-hcm/ba-p/13891011"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir les nouveautés
          </a>
          .[web:192]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            Employee Central Payroll 1H 2025 Release Overview
          </span>{" "}
          – focus sur les nouveautés Joule et AI en paie –{" "}
          <a
            href="https://www.lorenzo-datasolutions.com/employee-central-payroll-1h-2025/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire l&apos;overview
          </a>
          .[web:198]
        </li>
      </ul>
    </div>
  );
};

const HCM = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Module HCM – Human Capital Management & SuccessFactors
        </h1>
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold
    bg-emerald-500/10 text-emerald-700 dark:text-emerald-300
    border border-emerald-500/40"
          >
            Niveau : Débutant → Intermédiaire
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Découverte PA/OM, Time & Payroll et positionnement SuccessFactors.
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Le domaine HCM couvre la gestion des employés (données perso,
          organisation, temps, paie) et évolue aujourd’hui vers le cloud avec
          SAP SuccessFactors et l’IA Joule. En tant que consultant, l’enjeu est
          de comprendre à la fois le cœur HCM S/4HANA et la roadmap
          SuccessFactors.[web:191][web:197][web:194]
        </p>

        {/* Plan */}
        <div className="mb-6 border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/70 dark:bg-slate-800">
          <p className="text-xs font-semibold text-sapBlue mb-2">
            Plan de la page HCM
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 grid sm:grid-cols-2 gap-y-1">
            <li>1. Rôle de HCM & sous‑modules</li>
            <li>2. Time Management & intégration Paie</li>
            <li>3. Paie HCM & Employee Central Payroll</li>
            <li>4. SuccessFactors & scénarios hybrides</li>
            <li>5. IA & Joule dans le monde RH</li>
            <li>6. Mini‑projet & quiz HCM</li>
          </ul>
        </div>

        {/* 1. Rôle & sous-modules */}
        <h2 className="text-xl font-semibold mb-2">
          1. Rôle de SAP HCM et sous‑modules classiques
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          Historiquement, SAP HCM sur ECC/S/4HANA couvre la gestion RH
          on‑premise : PA, OM, Time, Payroll et Talent. Aujourd’hui, SAP pousse
          SuccessFactors comme suite cloud HCM, tout en maintenant une option
          HCM for S/4HANA.[web:191][web:197][web:200]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">Personnel Administration (PA)</span>{" "}
            : données administratives des employés (infotypes).[web:189]
          </li>
          <li>
            <span className="font-semibold">
              Organizational Management (OM)
            </span>{" "}
            : structure orga, postes, relations hiérarchiques.[web:189]
          </li>
          <li>
            <span className="font-semibold">Time Management</span> : horaires,
            pointages, absences, quotas.[web:189][web:196]
          </li>
          <li>
            <span className="font-semibold">Payroll</span> : calcul et versement
            des salaires, déclarations, integration FI.[web:186][web:190]
          </li>
        </ul>

        {/* 2. Time Management */}
        <h2 className="text-xl font-semibold mb-2">
          2. Time Management & intégration avec la paie
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          Time Management est critique : il traduit la réalité du temps de
          travail en éléments utilisables par la paie. L’intégration avec
          Payroll est un axe majeur de fiabilité et
          d’automatisation.[web:189][web:190][web:193]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Gestion des horaires, cycles de travail,
            plannings.[web:189][web:196]
          </li>
          <li>
            Enregistrement des présences, absences, heures
            supplémentaires.[web:189][web:196]
          </li>
          <li>
            Time Evaluation : moteur qui convertit les données temps en wage
            types pour la paie.[web:188][web:190][web:193]
          </li>
        </ul>

        {/* 3. Payroll */}
        <h2 className="text-xl font-semibold mb-2">
          3. Payroll HCM & Employee Central Payroll
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          La paie SAP peut être gérée on‑premise via SAP HCM Payroll ou dans le
          cloud via Employee Central Payroll (ECP). Les deux s’appuient sur une
          forte intégration Temps/Paie et sur des règles
          complexes.[web:186][web:190][web:198]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            HCM Payroll : schemas, rules, wage types, intégration FI pour les
            écritures de paie.[web:186][web:199]
          </li>
          <li>
            Employee Central Payroll : paie cloud, étroitement intégrée à
            Employee Central et enrichie d’innovations AI
            (Joule).![web:198][web:192]
          </li>
        </ul>

        {/* 4. SuccessFactors */}
        <h2 className="text-xl font-semibold mb-2">
          4. SAP SuccessFactors & scénarios hybrides avec S/4HANA
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          SuccessFactors est la plateforme HCM cloud de SAP (Employee Central,
          Recruiting, Onboarding, Learning, Compensation…). La tendance est de
          garder le cœur ERP dans S/4HANA et de moderniser HR dans le
          cloud.[web:191][web:197][web:194]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Scénario Talent Hybrid : core HCM on‑premise, Talent (Recruiting,
            Learning…) dans SuccessFactors.[web:194]
          </li>
          <li>
            Scénario Side‑by‑Side : Employee Central pour une partie des
            employés, HCM pour l’autre.[web:194]
          </li>
          <li>
            Intégration S/4HANA–SuccessFactors via SAP BTP et packages
            d’intégration standards.[web:191][web:197]
          </li>
        </ul>

        {/* 5. IA & Joule */}
        <h2 className="text-xl font-semibold mb-2">
          5. IA & Joule dans le contexte RH
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          Joule commence à arriver dans SuccessFactors pour assister managers et
          employés : explication de la paie, insights workforce, automatisation
          d’onboarding, etc.[web:192][web:195][web:198]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Explain‑my‑pay : Joule aide l’employé à comprendre sa fiche de paie
            (bonus, primes, déductions).[web:192][web:198]
          </li>
          <li>
            People Intelligence : analyses de composition de workforce,
            compétences, rémunération.[web:195]
          </li>
          <li>
            Onboarding assisté par IA : extraction automatique des données des
            documents, automatisation des tâches d’arrivée.[web:195]
          </li>
        </ul>

        {/* Mini-projet, quiz, ressources */}
        <HcmMiniProjectChecklist />
        <HcmQuiz />
        <HcmResources />
      </div>
    </section>
  );
};

export default HCM;
