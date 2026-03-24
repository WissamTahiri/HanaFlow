import React from "react";

const APropos = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        {/* Titre */}
        <h1 className="text-2xl sm:3xl font-bold mb-3">
          À propos – HanaFlow & moi
        </h1>

        {/* Badge niveau */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold
            bg-purple-500/10 text-purple-700 dark:text-purple-300
            border border-purple-500/40"
          >
            Niveau : Tous niveaux
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Présentation du projet HanaFlow et de mon profil de futur consultant
            SAP.
          </span>
        </div>

        {/* 1. A propos de HanaFlow */}
        <h2 className="text-xl font-semibold mb-2">
          1. HanaFlow – Mon laboratoire de consultant SAP S/4HANA
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          HanaFlow est un site pédagogique que j&apos;ai conçu pour structurer
          ma montée en compétences sur SAP S/4HANA, comme si je préparais une
          vraie mission chez un client. Chaque module (FI, CO, MM, SD, HCM, PP)
          est présenté avec le vocabulaire clé, les processus métiers et
          l&apos;intégration avec les autres domaines.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          L&apos;objectif du site est double : d&apos;un côté, me servir de base
          de révision pour mes études et mes futures certifications SAP ; de
          l&apos;autre, montrer à un recruteur comment je raisonne sur un
          système SAP complet, du P2P au O2C jusqu&apos;au R2R.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          HanaFlow ne remplace pas les formations officielles SAP, mais les
          complète avec mon propre regard de consultant junior : mini‑quiz,
          checklists “prêt pour la mission”, ressources récentes, roadmap par
          profil (finance, supply chain, ventes, tech) et un module dédié à
          l&apos;IA avec Joule.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6">
          À terme, je veux que HanaFlow devienne un vrai bac à sable de
          consultant : un endroit où je peux tester des idées (prompts Joule par
          module, cas pratiques, nouvelles fonctionnalités) et garder une trace
          claire de tout ce que j&apos;apprends sur l&apos;écosystème SAP.
        </p>

        {/* Petit séparateur */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-sapBlue/30 to-transparent mb-6" />

        {/* 2. A propos de toi */}
        <h2 className="text-xl font-semibold mb-2">
          2. À propos de moi – Wissam Tahiri
        </h2>

        <h3 className="text-sm sm:text-base font-semibold mb-1">
          Mon parcours
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          Je m&apos;appelle Wissam Tahiri et je suis actuellement en formation
          Bac+5 en informatique, en alternance comme technicien support IT à
          Paris. J&apos;ai une base solide en développement (Java, web,
          WordPress), en modélisation UML et en support utilisateur, que je mets
          progressivement au service du monde SAP.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          En parallèle de mes études, je me spécialise sur S/4HANA avec un focus
          sur les modules FI, MM, SD et CO, tout en m&apos;intéressant à
          l&apos;IA générative dans l&apos;écosystème SAP (Joule, intégrations,
          cas d&apos;usage métier).
        </p>

        <h3 className="text-sm sm:text-base font-semibold mb-1">
          Ce que je construis avec HanaFlow
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          Avec HanaFlow, je construis un véritable portfolio SAP : chaque page
          représente un module ou un processus métier, documenté comme si je
          devais l&apos;expliquer à un client ou à un key user. J&apos;y ajoute
          des quiz, des mini‑projets et des ressources à jour pour
          m&apos;entraîner à penser “comme un consultant” plutôt que comme un
          simple technicien.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Je combine ce travail avec mon expérience de support IT : comprendre
          les besoins métiers, vulgariser les concepts techniques, documenter
          clairement et garder une approche très orientée résolution de
          problèmes.
        </p>

        <h3 className="text-sm sm:text-base font-semibold mb-1">
          Ce que je cherche
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          À court terme, je cherche à contribuer à des projets S/4HANA sur les
          processus P2P, O2C et R2R, en particulier autour de FI/CO, MM et SD.
          Mon objectif est de devenir consultant fonctionnel SAP S/4HANA,
          capable de naviguer entre la finance, la supply chain et les sujets
          d&apos;IA embarquée comme Joule.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Si mon profil et HanaFlow vous parlent, je serais ravi d&apos;échanger
          autour de vos besoins projets, de mes axes de progression, ou
          simplement de la meilleure manière de démarrer une carrière de
          consultant SAP aujourd&apos;hui.
        </p>
      </div>
    </section>
  );
};

export default APropos;
