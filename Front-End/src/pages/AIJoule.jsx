import React from "react";

const AIJoule = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          IA & Joule – Assistant Business AI de SAP
        </h1>
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold
    bg-purple-500/10 text-purple-700 dark:text-purple-300
    border border-purple-500/40"
          >
            Niveau : Tous niveaux
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Vue d’ensemble de l’IA Joule et des cas d’usage par module SAP.
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Joule est l’assistant d’IA générative de SAP, intégré au cloud SAP
          (S/4HANA Cloud, BTP, SuccessFactors, etc.). Il expose des agents IA
          métiers pour la finance, la supply chain, les achats, les RH et
          d’autres fonctions, en s’appuyant sur les données SAP temps réel.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          1. Ce que fait Joule concrètement
        </h2>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          <li>
            <span className="font-semibold">Assistant conversationnel</span>{" "}
            intégré dans Fiori et les apps SAP : tu poses une question en
            langage naturel, Joule va chercher et combine les données
            pertinentes dans S/4HANA et BTP.
          </li>
          <li>
            <span className="font-semibold">Agents IA spécialisés</span>{" "}
            (finance, achats, supply chain, RH, etc.) qui automatisent des
            tâches comme la validation de factures, l’analyse de variance, la
            détection d’anomalies.
          </li>
          <li>
            <span className="font-semibold">
              Requêtes et rapports temps réel
            </span>{" "}
            sur les données FI/CO, ventes, stocks, RH, en s’appuyant sur SAP
            HANA et le Business Data Cloud.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          2. Joule & S/4HANA Finance : cas usage
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-2">
          Dans la Finance, Joule se connecte aux modules FI, CO et CO‑PA pour
          répondre à des questions de type CFO/contrôleur en quelques secondes
          plutôt qu’en heures de reporting manuel.
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          <li>
            <span className="font-semibold">Reporting instantané</span> :
            “Montre-moi le profit du trimestre par région VS budget”, “Explique
            les écarts majeurs sur l’EBITDA”.
          </li>
          <li>
            <span className="font-semibold">Close plus rapide</span> : accès
            direct aux indicateurs de clôture, identification des postes
            bloquants, suivi des tâches de closing.
          </li>
          <li>
            <span className="font-semibold">Automatisation FI</span> : aide à la
            validation de factures, rapprochements, contrôle de cohérence,
            détection de transactions inhabituelles.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          3. Joule, agents IA et roadmap
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-2">
          SAP pousse une stratégie d’“agents Joule” : des systèmes
          semi‑autonomes basés sur des LLMs, préconfigurés ou personnalisés via
          Joule Studio.
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          <li>
            Objectif de plusieurs centaines d’use cases IA intégrés dans S/4HANA
            et les autres solutions SAP, avec environ 400 cas d’usages embarqués
            ciblés pour 2025.
          </li>
          <li>
            Joule Studio permet aux clients de construire leurs propres agents
            (skills) alignés sur leurs processus et données, en s’appuyant sur
            SAP Build et BTP.
          </li>
          <li>
            Joule devient progressivement omniprésent dans l’UX SAP (Fiori,
            Copilot Microsoft 365, etc.), pour suivre l’utilisateur dans
            différents outils.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 mt-6">
          5. Ressources pour suivre l’actualité IA & Joule
        </h2>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 space-y-2 mb-2">
          <li>
            Page officielle{" "}
            <span className="font-semibold">
              Joule de SAP – Assistant d&apos;IA
            </span>{" "}
            (FR) –{" "}
            <a
              href="https://www.sap.com/france/products/artificial-intelligence/ai-assistant.html"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
            >
              découvrir Joule
            </a>
          </li>
          <li>
            Article d&apos;analyse{" "}
            <span className="font-semibold">
              SAP&apos;s AI Copilot Joule: Implications for Finance
            </span>{" "}
            (use cases Finance / contrôleurs) –{" "}
            <a
              href="https://sapinsider.org/analyst-insights/saps-ai-copilot-joule-implications-for-finance/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
            >
              lire l&apos;analyse
            </a>
          </li>
          <li>
            Guide{" "}
            <span className="font-semibold">
              SAP AI Joule with Generative AI – The Ultimate Guide
            </span>{" "}
            (fonctionnement, cas d&apos;usage, intégration S/4HANA) –{" "}
            <a
              href="https://nav-it.com/sap-ai-joule-driving-collaborative-productivity-in-the-intelligent-enterprise/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
            >
              lire le guide
            </a>
          </li>
          <li>
            Article communautaire{" "}
            <span className="font-semibold">
              SAP S/4HANA Finance integration and Use case with SAP Joule
            </span>{" "}
            (exemples concrets FICO + Joule) –{" "}
            <a
              href="https://community.sap.com/t5/financial-management-blog-posts-by-members/sap-s4-hana-finance-integration-and-use-case-with-sap-joule/ba-p/13864939"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
            >
              voir les use cases
            </a>
          </li>
          <li>
            Article en français{" "}
            <span className="font-semibold">
              SAP renforce son assistant GenAI Joule
            </span>{" "}
            (actualité, roadmap) –{" "}
            <a
              href="https://www.lemondeinformatique.fr/actualites/lire-sap-renforce-son-assistant-genai-joule-93972.html"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
            >
              lire l&apos;article
            </a>
          </li>
        </ul>

      </div>
    </section>
  );
};

export default AIJoule;
