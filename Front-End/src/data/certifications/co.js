/**
 * Contenu de la certification C_TS4CO_2023
 * SAP Certified Associate – SAP S/4HANA for Management Accounting
 *
 * Structure :
 * - 7 chapitres couvrant 100% du périmètre de l'examen officiel
 * - Leçons avec contenu pédagogique, concepts clés, T-codes
 * - Quiz de chapitre (7-9 questions chacun)
 * - 40 questions pour le simulateur d'examen (format réel)
 */

export const coCertification = {
  id: "c-ts4co-2023",
  code: "C_TS4CO_2023",
  name: "SAP Certified Associate – SAP S/4HANA for Management Accounting",
  shortName: "SAP CO Certification",
  level: "Associate",
  examDuration: 180,
  examQuestions: 80,
  simulatorQuestions: 40,
  passingScore: 65,
  officialLink: "https://training.sap.com/certification/c_ts4co_2023",
  color: "from-indigo-900 via-indigo-700 to-indigo-500",

  chapters: [
    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 1 — Vue d'ensemble CO et données de base
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch1",
      number: 1,
      title: "Vue d'ensemble CO et données de base",
      weight: 10,
      isPremium: false,
      lessons: [
        {
          id: "l1-1",
          title: "Architecture du module CO dans S/4HANA",
          content: [
            "Le module CO (Controlling) est le module de contrôle de gestion de SAP. Il permet de piloter la performance interne de l'entreprise : coûts, marges, rentabilité. Contrairement à FI (comptabilité financière légale), CO est un module interne dont les données ne sont pas publiées aux tiers.",
            "Dans SAP S/4HANA, CO et FI partagent la même table ACDOCA (Universal Journal). Cette intégration totale signifie qu'il n'y a plus de réconciliation FI-CO comme en SAP ECC. Chaque écriture FI génère simultanément une écriture CO, et vice versa. Les données sont cohérentes en temps réel.",
            "CO est organisé autour de plusieurs composants complémentaires : CCA (Cost Center Accounting / Comptabilité par centres de coûts), IO (Internal Orders / Ordres internes), PCA (Profit Center Accounting / Comptabilité des centres de profit), CO-PC (Product Costing / Calcul de coût du produit), CO-PA (Profitability Analysis / Analyse de la rentabilité) et ML (Material Ledger / Comptabilité matière pour l'évaluation réelle).",
            "Le périmètre de contrôle de gestion (Controlling Area) est la structure organisationnelle centrale de CO. Il regroupe une ou plusieurs sociétés FI. Tous les objets CO (centres de coûts, ordres, etc.) appartiennent à un périmètre. Une affectation société-périmètre est obligatoire pour que les coûts remontent dans CO.",
            "La version CO est un autre concept fondamental. Elle permet de gérer plusieurs jeux de données simultanément : version 0 (réel), version 1 (plan budget annuel), version 2 (plan révisé), etc. La comparaison plan/réel s'effectue entre ces versions."
          ],
          keyConcepts: [
            { term: "Controlling (CO)", definition: "Module SAP de contrôle de gestion interne. Pilote coûts, marges et rentabilité. Données non publiées aux tiers (contraire de FI)." },
            { term: "Périmètre de contrôle (Controlling Area)", definition: "Structure organisationnelle CO regroupant une ou plusieurs sociétés. Tous les objets CO lui appartiennent. Paramètre OKKS." },
            { term: "Version CO", definition: "Permet de gérer simultanément réel (v0), plan annuel (v1), plan révisé (v2). Indispensable pour l'analyse plan/réel." },
            { term: "Intégration FI-CO", definition: "Totale dans S/4HANA via ACDOCA. Chaque pièce FI génère simultanément une écriture CO. Plus de réconciliation comme en ECC." },
            { term: "Objet CO", definition: "Récepteur de coûts dans CO : centre de coûts, ordre interne, centre de profit, élément OTP, etc." },
          ],
          tcodes: [
            { code: "OKKS", description: "Définir le périmètre de contrôle actif" },
            { code: "OKKP", description: "Paramétrage du périmètre de contrôle" },
            { code: "OKEON", description: "Afficher la structure de l'entreprise CO" },
          ],
        },
        {
          id: "l1-2",
          title: "Plan comptable analytique et données de base CO",
          content: [
            "Les types de coûts (Cost Elements) sont les données de base qui classifient les coûts dans CO. Dans S/4HANA, les types de coûts primaires sont directement liés aux comptes du grand livre FI (G/L Account). La distinction ECC entre 'compte FI' et 'type de coût primaire' disparaît : un seul objet est utilisé.",
            "Les types de coûts primaires représentent les charges et produits qui viennent de FI : salaires (compte 641XXX), matières consommées (compte 601XXX), amortissements (compte 681XXX). Les types de coûts secondaires (catégorie 21, 41, 42, 43) sont internes à CO et n'ont pas de pendant en FI : ils représentent les déversements entre centres de coûts, les surcharges calculées, les imputations d'activité.",
            "Le groupe de types de coûts (Cost Element Group) permet de regrouper des types de coûts pour les rapports et les règles de répartition. Par exemple, un groupe 'Charges de personnel' peut regrouper tous les comptes de 641000 à 649999.",
            "Les hiérarchies standard sont des structures arborescentes essentielles en CO. Chaque objet CO (centre de coûts, centre de profit) doit appartenir à une hiérarchie standard. Elle définit comment les données se consolident vers le haut pour les rapports. La hiérarchie standard des centres de coûts est définie par périmètre."
          ],
          keyConcepts: [
            { term: "Type de coût primaire", definition: "Correspond à un compte FI. Dans S/4HANA, compte FI = type de coût primaire. Exemples : salaires, matières, amortissements." },
            { term: "Type de coût secondaire", definition: "Purement interne à CO (pas de compte FI). Utilisé pour répartitions (cat. 42), imputations d'activité (cat. 43), surcharges (cat. 41)." },
            { term: "Groupe de types de coûts", definition: "Regroupement de types de coûts pour rapports et règles. Exemple : groupe 'Personnel' = comptes 641000 à 649999." },
            { term: "Hiérarchie standard", definition: "Structure arborescente obligatoire pour les centres de coûts et de profit. Permet la consolidation ascendante dans les rapports." },
            { term: "Centre de coûts (Cost Center)", definition: "Unité organisationnelle CO collectant les coûts. Peut représenter un département, une équipe, une machine." },
          ],
          tcodes: [
            { code: "FS00", description: "Créer/modifier un compte G/L (= type de coût en S/4HANA)" },
            { code: "KA01", description: "Créer un type de coût secondaire" },
            { code: "KAH1", description: "Créer un groupe de types de coûts" },
            { code: "KS01", description: "Créer un centre de coûts" },
            { code: "OKEON", description: "Afficher/modifier la hiérarchie standard des centres de coûts" },
          ],
        },
      ],
      quiz: [
        {
          id: "q1-1",
          question: "Dans SAP S/4HANA, où sont stockées simultanément les données FI et CO ?",
          options: ["Dans les tables BKPF/BSEG pour FI et COBK/COEP pour CO", "Dans la table ACDOCA (Universal Journal)", "Dans deux bases de données séparées synchronisées", "Dans la table FAGLFLEXA"],
          correctIndex: 1,
          explanation: "Dans S/4HANA, le Universal Journal (table ACDOCA) unifie FI, CO, AA et ML dans une seule table. Il n'y a plus de réconciliation FI-CO comme en ECC."
        },
        {
          id: "q1-2",
          question: "Quel objet SAP regroupe une ou plusieurs sociétés pour le contrôle de gestion ?",
          options: ["La société (Company Code)", "Le périmètre de contrôle de gestion (Controlling Area)", "Le groupe d'entreprises (Company)", "Le domaine de consolidation"],
          correctIndex: 1,
          explanation: "Le périmètre de contrôle de gestion (Controlling Area) est la structure organisationnelle centrale du module CO. Il regroupe une ou plusieurs sociétés FI et tous les objets CO lui appartiennent."
        },
        {
          id: "q1-3",
          question: "Quelle est la différence entre un type de coût primaire et un type de coût secondaire ?",
          options: [
            "Le primaire est pour les charges, le secondaire pour les produits",
            "Le primaire correspond à un compte FI, le secondaire est purement interne à CO",
            "Le primaire est planifié, le secondaire est réel",
            "Le primaire est obligatoire, le secondaire est optionnel"
          ],
          correctIndex: 1,
          explanation: "Un type de coût primaire correspond directement à un compte FI (charges ou produits). Un type de coût secondaire est purement interne à CO et n'a pas de pendant FI : il sert aux répartitions, imputations d'activité et surcharges."
        },
        {
          id: "q1-4",
          question: "Quelle version CO est conventionnellement utilisée pour les données réelles ?",
          options: ["Version 1", "Version 0", "Version 100", "Version REE"],
          correctIndex: 1,
          explanation: "La version 0 est la version standard pour les données réelles dans CO. Les versions 1, 2, 3... sont utilisées pour les différents scénarios de planification (budget annuel, plan révisé, etc.)."
        },
        {
          id: "q1-5",
          question: "Dans SAP S/4HANA, la création d'un compte G/L crée automatiquement :",
          options: [
            "Un ordre interne",
            "Un type de coût primaire (la distinction ECC n'existe plus)",
            "Un centre de profit",
            "Un poste de planification"
          ],
          correctIndex: 1,
          explanation: "Dans S/4HANA, la distinction entre 'compte G/L FI' et 'type de coût primaire CO' disparaît. Un compte G/L est directement utilisé comme type de coût dans CO. La transaction FS00 gère les deux."
        },
        {
          id: "q1-6",
          question: "Quelle est la fonction de la hiérarchie standard des centres de coûts ?",
          options: [
            "Elle définit l'ordre de traitement des pièces comptables",
            "Elle est obligatoire et permet la consolidation ascendante des coûts dans les rapports",
            "Elle détermine l'autorisation des utilisateurs",
            "Elle définit les règles de répartition des coûts"
          ],
          correctIndex: 1,
          explanation: "La hiérarchie standard est obligatoire pour chaque périmètre de contrôle. Chaque centre de coûts doit y appartenir. Elle permet de consolider les coûts vers le haut pour les rapports agrégés."
        },
        {
          id: "q1-7",
          question: "Quel composant CO est dédié à l'analyse de la rentabilité par segment de marché ?",
          options: ["CCA (Cost Center Accounting)", "IO (Internal Orders)", "CO-PA (Profitability Analysis)", "PCA (Profit Center Accounting)"],
          correctIndex: 2,
          explanation: "CO-PA (Profitability Analysis / Analyse de la rentabilité) analyse la rentabilité par segments de marché : produit, client, région, canal de distribution. À distinguer de PCA qui analyse par unité organisationnelle interne."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 2 — Comptabilité par centres de coûts (CCA)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch2",
      number: 2,
      title: "Comptabilité par centres de coûts (CCA)",
      weight: 18,
      isPremium: true,
      lessons: [
        {
          id: "l2-1",
          title: "Centres de coûts : création, hiérarchies et planification",
          content: [
            "Un centre de coûts (Cost Center) est l'objet CO le plus fondamental. Il représente une unité de responsabilité où des coûts sont collectés : un département RH, une machine de production, un service informatique. Chaque centre de coûts appartient à un périmètre de contrôle et à une catégorie (Administration, Production, Ventes, etc.).",
            "Les données de base d'un centre de coûts incluent : le nom et la description, la catégorie (détermine les types d'activités autorisés), le responsable (Person Responsible), la hiérarchie d'appartenance (Standard Hierarchy), et la période de validité. Les centres de coûts sont créés avec KS01 et modifiés avec KS02.",
            "La planification des coûts primaires dans CCA s'effectue avec la transaction KP06. On saisit les montants planifiés par centre de coûts et type de coût pour une version et une période donnée. Cette planification sert de référence pour l'analyse des écarts plan/réel.",
            "Les types d'activités (Activity Types) représentent les prestations qu'un centre de coûts fournit à d'autres : heures de machine, heures de main-d'œuvre directe, kWh d'électricité. Chaque type d'activité a un tarif planifié. L'imputation de l'activité (transaction KB21N) transfère le coût du centre de coûts fournisseur vers le récepteur via un type de coût secondaire (catégorie 43).",
            "La planification des activités (KP26) définit la quantité planifiée d'activité qu'un centre de coûts doit fournir. Combinée avec la planification des coûts (KP06), elle permet de calculer le tarif planifié d'activité = coûts planifiés / quantité d'activité planifiée. Ce tarif est utilisé pour imputer les activités réelles."
          ],
          keyConcepts: [
            { term: "Centre de coûts (Cost Center)", definition: "Unité de responsabilité collectant des coûts dans CO. Catégories : production, administration, ventes, R&D, etc." },
            { term: "Type d'activité (Activity Type)", definition: "Prestation d'un centre de coûts : heures machine, MOD, kWh. Valorisé par un tarif planifié. Imputation via type de coût cat. 43." },
            { term: "Tarif d'activité", definition: "Coût planifié par unité d'activité = coûts planifiés ÷ quantité d'activité planifiée. Calculé avec KSPI ou KSS2." },
            { term: "Planification KP06", definition: "Saisie des coûts primaires planifiés par centre de coûts / type de coût / version / période." },
            { term: "Imputation d'activité (KB21N)", definition: "Enregistrement de la consommation d'activité. Transfère les coûts du centre fournisseur vers le récepteur via type de coût cat. 43." },
          ],
          tcodes: [
            { code: "KS01/KS02", description: "Créer/modifier un centre de coûts" },
            { code: "KP06", description: "Saisir la planification des coûts primaires" },
            { code: "KP26", description: "Saisir la planification des activités" },
            { code: "KB21N", description: "Saisir une imputation d'activité réelle" },
            { code: "KSH1", description: "Créer un groupe de centres de coûts" },
          ],
        },
        {
          id: "l2-2",
          title: "Répartitions et cycles de déversement",
          content: [
            "Les répartitions (Allocations) permettent de redistribuer des coûts collectés dans un centre de coûts vers d'autres objets CO. Il existe deux méthodes principales : l'affectation (Assessment) et la distribution (Distribution).",
            "La distribution (cycle KSV5) transfère les coûts en conservant le type de coût d'origine. Si le centre de coûts IT a des frais de téléphone (compte 626000), la distribution vers les départements récepteurs garde le compte 626000. Cela permet une traçabilité totale des types de charges.",
            "L'affectation (assessment, cycle KSU5) collecte les coûts d'un centre émetteur et les déverse vers les récepteurs via un type de coût secondaire de catégorie 42 (Assessment Cost Element). L'origine détaillée des charges est perdue : on ne sait plus si c'est du téléphone ou de l'électricité, juste que ça vient du centre IT. Utilisé quand la granularité du type de coût n'est pas importante.",
            "Les cycles de déversement définissent les règles de répartition : quel centre émetteur, quels récepteurs, quelle clé de répartition (surface, effectifs, chiffre d'affaires, pourcentages fixes). Un cycle peut avoir plusieurs segments, chaque segment définissant une règle différente.",
            "Dans SAP S/4HANA, les déversements s'exécutent en temps réel ou en mode période. La transaction FAGLGA35 (ou KSU5/KSV5) déclenche le calcul. En cas d'erreur, on peut contre-passer (reverse) le cycle et le réexécuter avec des données corrigées.",
            "Les surcharges (overhead rates) sont une autre méthode d'imputation : on applique un pourcentage ou un montant fixe sur certains coûts directs pour imputer les charges indirectes. Configurées dans les feuilles de calcul de surcharges (Costing Sheets) et imputées via KGI2."
          ],
          keyConcepts: [
            { term: "Distribution (KSV5)", definition: "Répartition conservant le type de coût d'origine. Traçabilité totale. Exemple : frais IT répartis par département en gardant le compte 626000." },
            { term: "Affectation / Assessment (KSU5)", definition: "Répartition via type de coût secondaire cat. 42. Perd la granularité d'origine. Utilisé pour simplifier quand le détail n'est pas nécessaire." },
            { term: "Cycle de déversement", definition: "Ensemble de règles définissant émetteurs, récepteurs et clés de répartition. Peut avoir plusieurs segments." },
            { term: "Clé de répartition", definition: "Base du calcul : % fixe, surface (m²), effectifs (ETP), CA, quantité consommée. Détermine la quote-part de chaque récepteur." },
            { term: "Surcharge (Overhead Rate)", definition: "Taux appliqué sur des coûts directs pour imputer les charges indirectes. Configuré dans Costing Sheet, imputé via KGI2." },
          ],
          tcodes: [
            { code: "KSV1/KSV5", description: "Créer / Exécuter un cycle de distribution" },
            { code: "KSU1/KSU5", description: "Créer / Exécuter un cycle d'affectation (assessment)" },
            { code: "FAGLGA35", description: "Déversements en temps réel (S/4HANA)" },
            { code: "KGI2", description: "Imputer les surcharges de frais généraux" },
            { code: "KSPI", description: "Calculer les tarifs d'activité planifiés" },
          ],
        },
      ],
      quiz: [
        {
          id: "q2-1",
          question: "Quelle transaction permet de saisir les coûts primaires planifiés dans un centre de coûts ?",
          options: ["KP26", "KP06", "KB21N", "KSU5"],
          correctIndex: 1,
          explanation: "KP06 permet de saisir la planification des coûts primaires par centre de coûts, type de coût, version et période. KP26 est pour la planification des quantités d'activités."
        },
        {
          id: "q2-2",
          question: "Quelle est la différence principale entre une distribution et une affectation (assessment) ?",
          options: [
            "La distribution est planifiée, l'affectation est réelle",
            "La distribution conserve le type de coût d'origine, l'affectation utilise un type de coût secondaire cat. 42",
            "La distribution est mensuelle, l'affectation est annuelle",
            "La distribution est obligatoire, l'affectation est optionnelle"
          ],
          correctIndex: 1,
          explanation: "La distribution (KSV5) transfère les coûts en conservant le type de coût original, permettant la traçabilité. L'affectation (KSU5) regroupe tous les coûts dans un type de coût secondaire de catégorie 42, simplifiant le reporting mais perdant le détail."
        },
        {
          id: "q2-3",
          question: "Un type d'activité dans CO-CCA représente :",
          options: [
            "Un compte de charges du grand livre",
            "Une prestation fournie par un centre de coûts (heures machine, MOD, etc.)",
            "Une clé de répartition pour les cycles de déversement",
            "Un groupe de centres de coûts"
          ],
          correctIndex: 1,
          explanation: "Un type d'activité représente une prestation mesurable qu'un centre de coûts fournit à d'autres objets CO : heures de machine, heures de main-d'œuvre directe, kWh. Il est valorisé par un tarif planifié."
        },
        {
          id: "q2-4",
          question: "Comment est calculé le tarif planifié d'un type d'activité ?",
          options: [
            "Coûts réels ÷ quantités réelles de la période précédente",
            "Coûts planifiés ÷ quantité d'activité planifiée",
            "Coûts planifiés × coefficient de surcharge",
            "Prix du marché pour la prestation équivalente"
          ],
          correctIndex: 1,
          explanation: "Le tarif planifié = coûts planifiés du centre (KP06) ÷ quantités d'activité planifiées (KP26). La transaction KSPI calcule et mémorise ce tarif automatiquement."
        },
        {
          id: "q2-5",
          question: "Quelle catégorie de type de coût secondaire est utilisée pour les imputations d'activité ?",
          options: ["Catégorie 21 (compte de résultat interne)", "Catégorie 41 (surcharge)", "Catégorie 42 (assessment)", "Catégorie 43 (imputation d'activité)"],
          correctIndex: 3,
          explanation: "La catégorie 43 est réservée aux types de coûts secondaires utilisés pour les imputations d'activité (Activity Allocation). La catégorie 42 est pour les assessments/affectations, la 41 pour les surcharges."
        },
        {
          id: "q2-6",
          question: "Lors de l'exécution d'un cycle d'affectation (KSU5), que se passe-t-il si une erreur est détectée après exécution ?",
          options: [
            "Il est impossible d'annuler, il faut ouvrir un ticket SAP",
            "On peut contre-passer le cycle, corriger les données, puis le réexécuter",
            "Il faut modifier manuellement chaque pièce CO créée",
            "Il faut clôturer la période et relancer en période suivante"
          ],
          correctIndex: 1,
          explanation: "Les cycles d'affectation et de distribution peuvent être contre-passés (Reverse) en cas d'erreur. Après correction des données maître ou des règles, on relance l'exécution."
        },
        {
          id: "q2-7",
          question: "La transaction KB21N est utilisée pour :",
          options: [
            "Créer un centre de coûts",
            "Planifier les coûts d'un centre de coûts",
            "Saisir une imputation d'activité réelle",
            "Exécuter un cycle de répartition"
          ],
          correctIndex: 2,
          explanation: "KB21N permet de saisir manuellement une imputation d'activité réelle. Elle enregistre la consommation d'un type d'activité et transfère les coûts du centre fournisseur vers le récepteur via un type de coût secondaire cat. 43."
        },
        {
          id: "q2-8",
          question: "Qu'est-ce qu'une surcharge (overhead rate) dans CO-CCA ?",
          options: [
            "Un taux d'intérêt appliqué aux coûts en retard",
            "Un pourcentage ou montant fixe appliqué sur des coûts directs pour imputer des charges indirectes",
            "Le taux de change utilisé pour la conversion des devises",
            "Le taux de TVA sur les prestations internes"
          ],
          correctIndex: 1,
          explanation: "Une surcharge est un taux (% ou montant) configuré dans une Costing Sheet et appliqué sur certains coûts directs (base) pour imputer automatiquement des charges indirectes (frais généraux). Imputée via KGI2."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 3 — Ordres internes (Internal Orders / IO)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch3",
      number: 3,
      title: "Ordres internes (IO)",
      weight: 12,
      isPremium: true,
      lessons: [
        {
          id: "l3-1",
          title: "Ordres internes : types, création et cycle de vie",
          content: [
            "Les ordres internes (Internal Orders) sont des objets CO utilisés pour collecter et contrôler les coûts d'une tâche, d'un événement ou d'un projet spécifique, avec une durée de vie limitée. Exemples : coûts d'une foire commerciale, entretien d'une machine, développement d'un prototype.",
            "Contrairement aux centres de coûts (permanents), les ordres internes ont un début et une fin. Ils permettent un contrôle budgétaire précis sur une activité définie. Un ordre interne peut être soldé (settled) vers un centre de coûts, un actif, ou un autre objet CO en fin de vie.",
            "Les types d'ordres (Order Types) déterminent le comportement de l'ordre : gestion des budgets (avec ou sans), catégorie d'ordre (statistique ou réel), règle de solde (settlement rule). Chaque ordre interne est créé avec un type d'ordre qui pré-paramètre ces réglages.",
            "Le cycle de vie d'un ordre interne passe par plusieurs statuts : CRTD (créé), REL (libéré/released - peut recevoir des coûts), TECO (techniquement clôturé), CLSD (clôturé définitivement). Seuls les ordres en statut REL acceptent les imputations de coûts.",
            "Les ordres statistiques (Statistical Orders) collectent les coûts en parallèle d'un vrai récepteur CO (centre de coûts). Ils ne reçoivent pas les coûts 'réellement' : l'ordre statistique et le centre de coûts sont tous deux crédités. Ils permettent un reporting analytique supplémentaire sans changer le flux de coûts réels."
          ],
          keyConcepts: [
            { term: "Ordre interne (Internal Order)", definition: "Objet CO temporaire pour collecter les coûts d'une activité définie. Soldé vers d'autres objets CO en fin de vie." },
            { term: "Type d'ordre (Order Type)", definition: "Paramètre l'ordre : gestion budgets, catégorie, règle de solde par défaut. Exemples : maintenance, marketing, R&D." },
            { term: "Solde d'ordre (Settlement)", definition: "Transfert des coûts d'un ordre vers un objet récepteur (CC, actif, WBS) en fin de période ou fin de vie. Transaction KO88." },
            { term: "Ordre statistique", definition: "Collecte les coûts en parallèle du vrai récepteur. Utile pour un reporting complémentaire sans impact sur le flux de coûts réels." },
            { term: "Statut d'ordre", definition: "CRTD → REL (peut recevoir des coûts) → TECO (clôture technique) → CLSD. Seul REL accepte les imputations." },
          ],
          tcodes: [
            { code: "KO01/KO02", description: "Créer/modifier un ordre interne" },
            { code: "KO88", description: "Solder un ordre interne (individuel)" },
            { code: "KO8G", description: "Solder des ordres internes (collectif)" },
            { code: "KO12", description: "Saisir un budget sur un ordre interne" },
            { code: "KOB1", description: "Rapport : postes réels d'un ordre interne" },
          ],
        },
      ],
      quiz: [
        {
          id: "q3-1",
          question: "Quelle est la principale différence entre un ordre interne et un centre de coûts ?",
          options: [
            "Les centres de coûts sont dans CO, les ordres internes dans FI",
            "Les ordres internes sont temporaires avec un début/fin, les centres de coûts sont permanents",
            "Les ordres internes ne peuvent pas recevoir de coûts réels",
            "Les centres de coûts ne peuvent pas être planifiés"
          ],
          correctIndex: 1,
          explanation: "Les centres de coûts sont des structures permanentes (départements, machines). Les ordres internes ont une durée de vie limitée et sont créés pour une activité spécifique (foire, projet, maintenance). Ils sont soldés vers d'autres objets en fin de vie."
        },
        {
          id: "q3-2",
          question: "Un ordre interne en statut 'CRTD' peut-il recevoir des imputations de coûts ?",
          options: [
            "Oui, dès sa création",
            "Non, il faut d'abord le libérer (statut REL)",
            "Oui, mais seulement des coûts planifiés",
            "Non, il faut d'abord le clôturer techniquement (TECO)"
          ],
          correctIndex: 1,
          explanation: "Seuls les ordres en statut REL (Released/Libéré) peuvent recevoir des imputations de coûts réels. Un ordre en statut CRTD (Créé) doit être libéré via la fonction de changement de statut avant de pouvoir collecter des coûts."
        },
        {
          id: "q3-3",
          question: "La transaction KO88 sert à :",
          options: [
            "Créer un ordre interne",
            "Saisir le budget d'un ordre interne",
            "Solder un ordre interne (transférer ses coûts vers un récepteur)",
            "Afficher les postes réels d'un ordre"
          ],
          correctIndex: 2,
          explanation: "KO88 sert à solder un ordre interne individuel : elle transfère les coûts collectés vers les récepteurs définis dans la règle de solde (centre de coûts, immobilisation, WBS). KO8G est la version collective."
        },
        {
          id: "q3-4",
          question: "Qu'est-ce qu'un ordre interne statistique ?",
          options: [
            "Un ordre sans budget défini",
            "Un ordre qui collecte les coûts en parallèle d'un vrai récepteur CO, sans impact réel sur le flux de coûts",
            "Un ordre utilisé uniquement pour les statistiques de production",
            "Un ordre en statut TECO"
          ],
          correctIndex: 1,
          explanation: "Un ordre statistique collecte les coûts en double : sur l'ordre ET sur le vrai récepteur CO (centre de coûts). Il ne 'reçoit' pas vraiment les coûts mais les enregistre en parallèle pour un reporting analytique complémentaire."
        },
        {
          id: "q3-5",
          question: "Le type d'ordre (Order Type) détermine :",
          options: [
            "La devise de l'ordre",
            "Le comportement de l'ordre : gestion des budgets, règle de solde par défaut, catégorie",
            "Le centre de coûts récepteur lors du solde",
            "La hiérarchie à laquelle appartient l'ordre"
          ],
          correctIndex: 1,
          explanation: "Le type d'ordre pré-paramètre le comportement de tous les ordres créés sous ce type : gestion budgétaire (avec/sans), catégorie (statistique/réel), règle de solde par défaut. C'est la 'template' de l'ordre interne."
        },
        {
          id: "q3-6",
          question: "Dans quel ordre les statuts d'un ordre interne se succèdent-ils normalement ?",
          options: [
            "REL → CRTD → TECO → CLSD",
            "CRTD → REL → TECO → CLSD",
            "CRTD → TECO → REL → CLSD",
            "REL → TECO → CRTD → CLSD"
          ],
          correctIndex: 1,
          explanation: "Le cycle de vie normal est : CRTD (créé) → REL (libéré, peut recevoir des coûts) → TECO (clôture technique, plus de nouvelles imputations) → CLSD (clôturé définitivement, soldé)."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 4 — Comptabilité des centres de profit (PCA)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch4",
      number: 4,
      title: "Comptabilité des centres de profit (PCA)",
      weight: 14,
      isPremium: true,
      lessons: [
        {
          id: "l4-1",
          title: "Centres de profit et comptabilité des centres de profit",
          content: [
            "Un centre de profit (Profit Center) est une unité organisationnelle de CO représentant un secteur d'activité ou une zone géographique dont on veut mesurer la rentabilité. Contrairement aux centres de coûts (collect uniquement les coûts), les centres de profit collectent AUSSI les produits. On peut ainsi calculer un résultat opérationnel par centre de profit.",
            "Dans SAP S/4HANA, PCA est totalement intégré dans le Universal Journal. Chaque pièce comptable contient la dimension 'Profit Center'. La dérivation du centre de profit se fait automatiquement depuis d'autres objets CO : le centre de coûts d'imputation détermine le centre de profit, le matériau ou le client peut aussi dériver le centre de profit.",
            "Le groupe de centres de profit (Profit Center Group) permet de structurer les centres de profit en hiérarchie pour les rapports. La hiérarchie standard est obligatoire. On peut avoir : Groupe 'Europe' contenant 'France' et 'Allemagne', chacun contenant leurs centres de profit locaux.",
            "Les produits financiers et les bilans peuvent être segmentés par centre de profit dans S/4HANA. Cette fonctionnalité, appelée Document Splitting (découpage de documents), permet d'avoir des bilans partiels par centre de profit. Le paramétrage du découpage détermine comment les comptes de bilan sont affectés aux centres de profit.",
            "Le reporting de PCA produit des comptes de résultats par centre de profit (KE5Z, S_ALR_87013340). Dans S/4HANA, ces rapports sont disponibles en temps réel sans traitement de clôture préalable grâce à ACDOCA."
          ],
          keyConcepts: [
            { term: "Centre de profit (Profit Center)", definition: "Unité organisationnelle CO mesurant la rentabilité : collecte coûts ET produits. Différent du centre de coûts (coûts seuls)." },
            { term: "Dérivation du centre de profit", definition: "Attribution automatique du centre de profit à une pièce depuis d'autres objets : centre de coûts, matériau, compte client." },
            { term: "Document Splitting", definition: "Découpage des pièces comptables pour affecter les comptes de bilan aux centres de profit. Permet des bilans partiels par CP." },
            { term: "Hiérarchie standard PCA", definition: "Structure arborescente obligatoire regroupant tous les centres de profit. Permet la consolidation pour les rapports." },
            { term: "Groupe de centres de profit", definition: "Regroupement de centres de profit pour les rapports et les règles. Peut représenter régions, lignes de produits, etc." },
          ],
          tcodes: [
            { code: "KE51/KE52", description: "Créer/modifier un centre de profit" },
            { code: "KCH1", description: "Créer un groupe de centres de profit" },
            { code: "KE5Z", description: "Rapport compte de résultat par centre de profit" },
            { code: "3KEH", description: "Règles de substitution / dérivation centre de profit" },
            { code: "FAGL3KEH", description: "Paramétrer le découpage de documents (Document Splitting)" },
          ],
        },
      ],
      quiz: [
        {
          id: "q4-1",
          question: "Quelle est la différence fondamentale entre un centre de profit et un centre de coûts ?",
          options: [
            "Les centres de profit sont dans FI, les centres de coûts sont dans CO",
            "Un centre de profit collecte coûts ET produits (vision P&L), un centre de coûts collecte uniquement des coûts",
            "Les centres de profit sont permanents, les centres de coûts sont temporaires",
            "Un centre de profit correspond à une société légale, un centre de coûts à un département"
          ],
          correctIndex: 1,
          explanation: "Un centre de profit est conçu pour mesurer la rentabilité : il collecte les coûts ET les produits, permettant de calculer un résultat opérationnel. Un centre de coûts ne collecte que des coûts."
        },
        {
          id: "q4-2",
          question: "Comment SAP S/4HANA détermine-t-il généralement le centre de profit d'une pièce comptable ?",
          options: [
            "L'utilisateur le saisit manuellement pour chaque pièce",
            "Par dérivation automatique depuis d'autres objets : centre de coûts, matériau, contrat",
            "Il est toujours pris depuis la société",
            "Il est défini dans la règle de solde de l'ordre interne"
          ],
          correctIndex: 1,
          explanation: "Dans S/4HANA, le centre de profit est dérivé automatiquement depuis d'autres objets CO : le centre de coûts détermine le centre de profit associé, un matériau peut avoir un centre de profit par défaut, etc. La saisie manuelle est possible mais rare."
        },
        {
          id: "q4-3",
          question: "Le 'Document Splitting' en PCA permet de :",
          options: [
            "Diviser une facture fournisseur en plusieurs pièces comptables",
            "Affecter les comptes de bilan (actif/passif) aux centres de profit pour des bilans partiels",
            "Séparer les données plan des données réelles",
            "Diviser les périodes comptables en sous-périodes"
          ],
          correctIndex: 1,
          explanation: "Le Document Splitting (découpage de documents) permet d'affecter les lignes de bilan (créances, dettes, stocks) aux centres de profit. Cela permet d'établir des bilans partiels par centre de profit, pas seulement des comptes de résultat."
        },
        {
          id: "q4-4",
          question: "Dans SAP S/4HANA, quand les rapports PCA (comptes de résultat par centre de profit) sont-ils disponibles ?",
          options: [
            "Seulement après exécution du job de clôture mensuelle",
            "En temps réel grâce au Universal Journal (ACDOCA)",
            "Seulement après le téléchargement dans BW/BI",
            "Une fois par semaine lors de la consolidation"
          ],
          correctIndex: 1,
          explanation: "Grâce au Universal Journal (ACDOCA) dans S/4HANA, toutes les pièces contiennent la dimension centre de profit. Les rapports PCA sont disponibles en temps réel sans traitement de clôture préalable."
        },
        {
          id: "q4-5",
          question: "Quelle transaction crée un centre de profit dans SAP ?",
          options: ["KS01", "KE51", "KO01", "CE81"],
          correctIndex: 1,
          explanation: "KE51 crée un centre de profit. KS01 crée un centre de coûts, KO01 crée un ordre interne. La logique de numérotation SAP : KS = cost center, KE = profit center, KO = order."
        },
        {
          id: "q4-6",
          question: "La hiérarchie standard des centres de profit est :",
          options: [
            "Optionnelle, créée uniquement si nécessaire pour les rapports",
            "Obligatoire : chaque centre de profit doit appartenir à la hiérarchie standard",
            "Remplacée dans S/4HANA par les segments",
            "La même que la hiérarchie standard des centres de coûts"
          ],
          correctIndex: 1,
          explanation: "La hiérarchie standard est obligatoire pour les centres de profit (comme pour les centres de coûts). Chaque centre de profit doit y être intégré. Elle permet la consolidation ascendante dans les rapports."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 5 — Calcul de coût du produit (CO-PC)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch5",
      number: 5,
      title: "Calcul de coût du produit (CO-PC)",
      weight: 20,
      isPremium: true,
      lessons: [
        {
          id: "l5-1",
          title: "Product Costing : calcul standard et structure de coûts",
          content: [
            "Le calcul de coût du produit (CO-PC / Product Costing) détermine le coût de fabrication d'un produit fini ou semi-fini. Il est indispensable pour l'évaluation des stocks, la fixation des prix de vente et le calcul des marges par produit.",
            "Le coût standard (Standard Cost) est la méthode privilégiée dans SAP. Il est calculé une fois par an (ou plus fréquemment) et mémorisé dans la fiche article. Toutes les entrées en stock de produits fabriqués sont valorisées au coût standard. Les écarts entre le coût standard et le coût réel sont suivis dans des comptes d'écart.",
            "La structure de coûts (Cost Component Structure) ventile le coût d'un produit selon ses composants : matières premières, main-d'œuvre directe, frais machine, surcharges. Cette structure permet un reporting 'exploded bill of costs' : on sait exactement d'où vient chaque centime du coût du produit.",
            "Le calcul de coût part de la Nomenclature (Bill of Materials / BOM) et du Gamme de fabrication (Routing). La BOM liste les matières premières et composants nécessaires. Le gamme liste les opérations de production et les centres de travail utilisés. À partir de ces deux structures, CO-PC calcule automatiquement le coût du produit.",
            "La transaction CK11N lance le calcul de coût pour un matériau. CK40N lance un calcul en masse (Product Cost Run). Après vérification, CK24 marque le coût calculé comme nouveau prix standard dans la fiche article."
          ],
          keyConcepts: [
            { term: "Coût standard (Standard Cost)", definition: "Coût de référence calculé périodiquement et mémorisé dans la fiche article. Valorise les entrées en stock. Les écarts réel/standard sont suivis." },
            { term: "Structure de coûts (Cost Component Structure)", definition: "Ventilation du coût en composants : matières, MOD, frais machine, surcharges. Permet l'analyse détaillée d'où vient chaque coût." },
            { term: "BOM (Bill of Materials / Nomenclature)", definition: "Liste des matières premières et composants nécessaires pour fabriquer un produit. Base du calcul CO-PC pour les coûts matières." },
            { term: "Gamme (Routing)", definition: "Séquence des opérations de fabrication et centres de travail associés. Détermine les coûts de transformation (MOD, machines)." },
            { term: "CK11N / CK40N", definition: "CK11N : calcul de coût individuel. CK40N : calcul en masse (Product Cost Run) pour plusieurs matériaux." },
            { term: "CK24", definition: "Marque le nouveau coût standard calculé et le libère dans la fiche article comme prix standard futur puis actuel." },
          ],
          tcodes: [
            { code: "CK11N", description: "Calculer le coût standard d'un matériau" },
            { code: "CK40N", description: "Lancer un calcul de coût en masse (Product Cost Run)" },
            { code: "CK24", description: "Marquer et libérer le coût standard calculé" },
            { code: "KKBC_RUN", description: "Rapport de résultats du Product Cost Run" },
            { code: "CO88", description: "Solder les ordres de fabrication" },
          ],
        },
      ],
      quiz: [
        {
          id: "q5-1",
          question: "Quelle est la méthode d'évaluation des stocks de produits fabriqués privilégiée dans SAP ?",
          options: [
            "Le coût moyen pondéré (Moving Average Price)",
            "Le coût standard (Standard Cost)",
            "Le FIFO (First In, First Out)",
            "Le coût de remplacement"
          ],
          correctIndex: 1,
          explanation: "Le coût standard est la méthode privilégiée pour les produits fabriqués dans SAP. Il est calculé périodiquement, mémorisé dans la fiche article et utilisé pour valoriser toutes les entrées en stock. Les écarts entre réel et standard sont suivis séparément."
        },
        {
          id: "q5-2",
          question: "La transaction CK11N sert à :",
          options: [
            "Créer un centre de travail (Work Center)",
            "Calculer le coût standard d'un matériau individuel",
            "Solder un ordre de fabrication",
            "Libérer le budget de production"
          ],
          correctIndex: 1,
          explanation: "CK11N lance le calcul du coût standard pour un matériau individuel. Le système utilise la BOM et le gamme pour calculer les coûts matières et de transformation. CK40N est la version en masse."
        },
        {
          id: "q5-3",
          question: "Quelles sont les deux structures de données principales utilisées par CO-PC pour calculer le coût d'un produit fabriqué ?",
          options: [
            "La fiche article et la liste de prix",
            "La nomenclature (BOM) et le gamme de fabrication (Routing)",
            "Le centre de profit et le centre de coûts",
            "Le plan comptable et la hiérarchie d'activités"
          ],
          correctIndex: 1,
          explanation: "CO-PC utilise la BOM (nomenclature) pour les coûts matières/composants, et le Routing (gamme) pour les coûts de transformation (heures machine, MOD par opération). Ces deux structures sont le point de départ du calcul de coût."
        },
        {
          id: "q5-4",
          question: "La structure de coûts (Cost Component Structure) permet de :",
          options: [
            "Définir la hiérarchie organisationnelle de CO",
            "Ventiler le coût d'un produit par composants : matières, MOD, surcharges, etc.",
            "Structurer la nomenclature en niveaux",
            "Définir les règles de découpage de documents"
          ],
          correctIndex: 1,
          explanation: "La Cost Component Structure ventile le coût total d'un produit en composants analytiques : matières premières, main-d'œuvre directe, frais machine, surcharges de frais généraux. Elle permet de voir exactement d'où vient chaque centime du coût."
        },
        {
          id: "q5-5",
          question: "Après CK11N (calcul) et vérification, quelle transaction finalise le nouveau coût standard dans la fiche article ?",
          options: ["CK40N", "CK24", "KP06", "CO88"],
          correctIndex: 1,
          explanation: "CK24 marque (Mark) le coût standard calculé comme future valeur et le libère (Release) dans la fiche article comme prix standard actuel. Ce processus en deux étapes est nécessaire avant que les nouvelles entrées en stock soient valorisées au nouveau standard."
        },
        {
          id: "q5-6",
          question: "Où sont enregistrés les écarts entre le coût standard et le coût réel de fabrication ?",
          options: [
            "Directement dans le coût standard, qui est recalculé à chaque entrée",
            "Dans des comptes d'écart spécifiques (Variance Accounts)",
            "Dans les postes d'ordre de fabrication sans valeur",
            "Ils sont ignorés car le standard est toujours juste"
          ],
          correctIndex: 1,
          explanation: "Dans SAP, les entrées en stock sont toujours au coût standard. Si le coût réel diffère, l'écart est comptabilisé dans des comptes d'écart spécifiques. Ces écarts (price variance, quantity variance, etc.) sont analysés lors de la clôture."
        },
        {
          id: "q5-7",
          question: "La transaction CO88 est utilisée pour :",
          options: [
            "Calculer le coût standard en masse",
            "Solder les ordres de fabrication (transférer les écarts réel/standard)",
            "Libérer le budget de production",
            "Créer des centres de travail"
          ],
          correctIndex: 1,
          explanation: "CO88 sert à solder les ordres de fabrication : elle calcule et comptabilise les écarts entre le coût réel de l'ordre et la valeur au coût standard. Ces écarts sont transférés vers des comptes de résultat ou d'analyse."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 6 — Analyse de la rentabilité (CO-PA)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch6",
      number: 6,
      title: "Analyse de la rentabilité (CO-PA)",
      weight: 14,
      isPremium: true,
      lessons: [
        {
          id: "l6-1",
          title: "CO-PA : analyse de la rentabilité par segment de marché",
          content: [
            "CO-PA (Profitability Analysis) analyse la rentabilité de l'entreprise selon des dimensions externes : produit, client, canal de distribution, région, secteur. C'est la vision 'marché' de la rentabilité, par opposition à PCA qui donne une vision 'organisationnelle interne'.",
            "Il existe deux types de CO-PA dans SAP : CO-PA basé sur les coûts (Costing-Based CO-PA) et CO-PA basé sur les comptes (Account-Based CO-PA). Dans S/4HANA, SAP recommande l'Account-Based CO-PA car il est totalement intégré dans ACDOCA et élimine les problèmes de réconciliation avec FI.",
            "Les caractéristiques (Characteristics) sont les dimensions d'analyse : MATNR (article), KNDNR (client), BRSCH (secteur), LAND1 (pays), VRTNR (représentant). Chaque vente est ventilée selon ces caractéristiques. Le paramétrage CO-PA définit quelles caractéristiques sont actives.",
            "Les valeurs (Value Fields) sont les indicateurs financiers : chiffre d'affaires, remises, coût des marchandises vendues, marge. Dans le Costing-Based CO-PA, ces valeurs sont définies indépendamment des comptes FI. Dans l'Account-Based CO-PA, elles correspondent directement aux comptes G/L.",
            "L'alimentation de CO-PA se fait principalement lors de la facturation SD (VF01). Le Condition Value Transfer transfère les composants de prix (prix, remises, frais de port) vers les Value Fields CO-PA. Un schéma de transfert (PA Transfer Structure) mappe chaque condition SD vers le Value Field correspondant."
          ],
          keyConcepts: [
            { term: "CO-PA coûts (Costing-Based)", definition: "CO-PA avec ses propres Value Fields indépendants de FI. Nécessite une réconciliation. Remplacé progressivement par Account-Based." },
            { term: "CO-PA comptes (Account-Based)", definition: "CO-PA directement intégré dans ACDOCA. Recommandé dans S/4HANA. Pas de réconciliation FI-CO-PA nécessaire." },
            { term: "Caractéristique (Characteristic)", definition: "Dimension d'analyse CO-PA : client, article, pays, canal, représentant. Détermine la granularité de l'analyse de rentabilité." },
            { term: "Valeur (Value Field)", definition: "Indicateur financier en CO-PA coûts : CA, remises, COGS, marge. Dans Account-Based : correspond à un compte G/L." },
            { term: "PA Transfer Structure", definition: "Règle de mapping conditions SD → Value Fields CO-PA. Définit comment les composants de prix alimentent l'analyse de rentabilité." },
          ],
          tcodes: [
            { code: "KEA0", description: "Paramétrer le système opérationnel CO-PA" },
            { code: "KE21N", description: "Saisir manuellement une pièce CO-PA" },
            { code: "KE30", description: "Rapport CO-PA : analyse de rentabilité" },
            { code: "KE4I", description: "Définir le PA Transfer Structure (mapping SD → CO-PA)" },
            { code: "KE1S", description: "Imputer les coûts de production vers CO-PA" },
          ],
        },
      ],
      quiz: [
        {
          id: "q6-1",
          question: "Quelle est la différence entre CO-PA et PCA (Profit Center Accounting) ?",
          options: [
            "CO-PA est pour les grandes entreprises, PCA pour les PME",
            "CO-PA analyse la rentabilité par dimensions de marché (client, produit), PCA par unités organisationnelles internes",
            "CO-PA est dans S/4HANA, PCA est dans SAP ECC uniquement",
            "CO-PA traite les coûts, PCA traite les produits"
          ],
          correctIndex: 1,
          explanation: "CO-PA offre une vision externe de la rentabilité par dimensions de marché (produit, client, région). PCA offre une vision interne par unités organisationnelles (centres de profit = divisions, régions d'entreprise). Les deux sont complémentaires."
        },
        {
          id: "q6-2",
          question: "Quel type de CO-PA SAP recommande-t-il dans S/4HANA ?",
          options: [
            "Le CO-PA basé sur les coûts (Costing-Based), car plus détaillé",
            "Le CO-PA basé sur les comptes (Account-Based), car intégré dans ACDOCA sans réconciliation",
            "Les deux sont équivalents dans S/4HANA",
            "Aucun — CO-PA est remplacé par PCA dans S/4HANA"
          ],
          correctIndex: 1,
          explanation: "SAP recommande l'Account-Based CO-PA dans S/4HANA car il est directement intégré dans ACDOCA. Il élimine les problèmes de réconciliation entre FI et CO-PA que pose le Costing-Based CO-PA."
        },
        {
          id: "q6-3",
          question: "Dans CO-PA, les 'caractéristiques' (characteristics) représentent :",
          options: [
            "Les indicateurs financiers : CA, marges, coûts",
            "Les dimensions d'analyse : client, article, pays, canal de distribution",
            "Les types de coûts secondaires utilisés dans l'analyse",
            "Les règles de mapping depuis les conditions SD"
          ],
          correctIndex: 1,
          explanation: "Les caractéristiques sont les dimensions selon lesquelles on analyse la rentabilité : article (MATNR), client (KUNNR), pays (LAND1), canal de distribution. Ce sont les 'axes' de l'analyse."
        },
        {
          id: "q6-4",
          question: "Comment CO-PA est-il principalement alimenté depuis le processus commercial ?",
          options: [
            "Par les imputations manuelles KB21N",
            "Lors de la facturation SD (VF01), via le PA Transfer Structure",
            "Lors du calcul de coût standard CK11N",
            "Par les cycles de répartition KSU5"
          ],
          correctIndex: 1,
          explanation: "CO-PA est alimenté principalement lors de la facturation SD (VF01). Le PA Transfer Structure définit comment les composants de prix (prix de vente, remises, frais de port) sont transférés dans les Value Fields CO-PA."
        },
        {
          id: "q6-5",
          question: "La transaction KE30 sert à :",
          options: [
            "Paramétrer le système opérationnel CO-PA",
            "Lancer une analyse de rentabilité CO-PA (rapport)",
            "Créer un segment de marché",
            "Saisir manuellement une pièce CO-PA"
          ],
          correctIndex: 1,
          explanation: "KE30 lance les rapports d'analyse de rentabilité CO-PA. On sélectionne les caractéristiques (client, article, période) et les indicateurs (CA, marge) pour obtenir l'analyse souhaitée."
        },
        {
          id: "q6-6",
          question: "Qu'est-ce qu'un 'PA Transfer Structure' dans CO-PA ?",
          options: [
            "La hiérarchie des segments de marché",
            "Le mapping entre les conditions SD et les Value Fields CO-PA",
            "La structure des comptes de résultat par segment",
            "Le tableau de bord des KPIs CO-PA"
          ],
          correctIndex: 1,
          explanation: "Le PA Transfer Structure est la règle de mapping qui associe chaque condition de prix SD (prix, remise client, remise produit) à un Value Field CO-PA correspondant. C'est ce qui permet à CO-PA de recevoir les données détaillées de facturation."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 7 — Clôture périodique CO et Actual Costing
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch7",
      number: 7,
      title: "Clôture périodique CO et Actual Costing",
      weight: 12,
      isPremium: true,
      lessons: [
        {
          id: "l7-1",
          title: "Clôture périodique CO et Material Ledger",
          content: [
            "La clôture périodique CO regroupe l'ensemble des traitements à exécuter en fin de mois pour arrêter les données de contrôle de gestion : calcul des tarifs d'activité réels, déversements des centres de coûts, solde des ordres internes et de fabrication, transfert vers CO-PA.",
            "Le calcul des tarifs d'activité réels (KSII) compare les coûts réels aux quantités d'activité réelles et recalcule un tarif réel. Des écarts par rapport aux tarifs planifiés sont calculés et peuvent être comptabilisés. Ce recalcul 'ajuste' la valeur des activités consommées aux coûts réels.",
            "Le Material Ledger (Comptabilité matière) est une fonctionnalité de CO-PC qui calcule le coût moyen périodique réel des matières (Actual Costing). Il collecte tous les mouvements de stock de la période avec leurs coûts réels, puis calcule un prix moyen réel (Actual Price). Ce prix peut ensuite être utilisé pour réévaluer les stocks.",
            "L'Actual Costing avec le Material Ledger suit les écarts de prix sur toute la chaîne de valeur : depuis les matières premières achetées jusqu'aux produits finis vendus. Les écarts remontent (roll-up) de niveau en niveau dans la nomenclature.",
            "La séquence de clôture CO typique est : 1. Imputations d'activité réelles (KB21N) 2. Calcul tarifs réels (KSII) 3. Cycles de déversement (KSU5/KSV5) 4. Solde ordres internes (KO8G) 5. Solde ordres fabrication (CO88) 6. Clôture ML (CKMLCP) 7. Transfert CO-PA."
          ],
          keyConcepts: [
            { term: "Clôture périodique CO", definition: "Séquence de traitements de fin de mois : tarifs réels, déversements, solde ordres, ML, CO-PA. Arrête les données du contrôle de gestion." },
            { term: "Tarif d'activité réel (KSII)", definition: "Recalcul du tarif après la période avec les coûts réels réels/quantités réelles. Génère des écarts vs tarif planifié." },
            { term: "Material Ledger (ML)", definition: "Module de CO-PC calculant le coût moyen réel des matières sur la période. Prérequis pour l'Actual Costing." },
            { term: "Actual Costing", definition: "Valorisation des stocks au coût réel moyen périodique (vs coût standard). Calcule le 'vrai' coût de revient sur la période." },
            { term: "Roll-up des écarts", definition: "Propagation ascendante des écarts de coût depuis les matières premières vers les produits finis dans la nomenclature." },
          ],
          tcodes: [
            { code: "KSII", description: "Calculer les tarifs d'activité réels" },
            { code: "CKMLCP", description: "Exécuter la clôture du Material Ledger (Actual Costing)" },
            { code: "CKMLCPAVR", description: "Calculer le prix réel moyen dans ML" },
            { code: "KO8G", description: "Solder les ordres internes en masse" },
            { code: "CO88", description: "Solder les ordres de fabrication en masse" },
          ],
        },
      ],
      quiz: [
        {
          id: "q7-1",
          question: "La transaction KSII sert à :",
          options: [
            "Calculer le coût standard des produits finis",
            "Calculer les tarifs d'activité réels en fin de période",
            "Exécuter la clôture du Material Ledger",
            "Solder les ordres de fabrication"
          ],
          correctIndex: 1,
          explanation: "KSII calcule les tarifs d'activité réels en comparant les coûts réels aux quantités d'activité réelles. Les écarts vs tarifs planifiés sont calculés et peuvent être comptabilisés pour ajuster la valeur des activités consommées."
        },
        {
          id: "q7-2",
          question: "Quelle est la différence entre le coût standard et l'Actual Costing (Material Ledger) ?",
          options: [
            "Le coût standard est calculé mensuellement, l'Actual Costing annuellement",
            "Le coût standard est un prix de référence fixe, l'Actual Costing calcule le coût réel moyen sur la période",
            "Le coût standard est dans CO-PC, l'Actual Costing est dans FI",
            "Il n'y a pas de différence dans S/4HANA"
          ],
          correctIndex: 1,
          explanation: "Le coût standard est calculé périodiquement (souvent annuellement) et reste fixe pendant la période. L'Actual Costing (Material Ledger) calcule le coût réel moyen effectivement encourU sur la période, incluant toutes les variations de prix."
        },
        {
          id: "q7-3",
          question: "Quelle est la transaction principale pour exécuter la clôture du Material Ledger ?",
          options: ["CO88", "KSII", "CKMLCP", "KO8G"],
          correctIndex: 2,
          explanation: "CKMLCP (Cockpit de clôture du Material Ledger) est la transaction centrale pour exécuter la clôture ML. Elle comprend plusieurs étapes : calcul du prix réel, revalorisation des stocks, etc."
        },
        {
          id: "q7-4",
          question: "Dans quelle ordre ces étapes de clôture CO doivent-elles être exécutées ?",
          options: [
            "CO88 → KSII → KSU5 → KO8G → CKMLCP",
            "KSII → KSU5 → KO8G → CO88 → CKMLCP",
            "CKMLCP → CO88 → KSII → KSU5 → KO8G",
            "KO8G → CO88 → KSU5 → KSII → CKMLCP"
          ],
          correctIndex: 1,
          explanation: "La séquence correcte : KSII (tarifs réels) → KSU5/KSV5 (cycles déversements) → KO8G (solde ordres internes) → CO88 (solde ordres fabrication) → CKMLCP (clôture ML). Le ML est toujours en dernier car il dépend de tous les autres traitements."
        },
        {
          id: "q7-5",
          question: "Le 'roll-up' des écarts dans le Material Ledger signifie :",
          options: [
            "La consolidation des données CO vers FI",
            "La propagation ascendante des écarts de coût depuis les matières premières vers les produits finis",
            "Le report des écarts non soldés sur la période suivante",
            "Le calcul des surcharges de frais généraux"
          ],
          correctIndex: 1,
          explanation: "Le roll-up propage les écarts de coût vers le haut dans la chaîne de valeur. Si une matière première coûte plus cher que prévu, cet écart remonte dans le coût du composant qui l'utilise, puis dans le coût du produit fini qui contient ce composant."
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS DU SIMULATEUR D'EXAMEN (40 questions)
// Distribuées proportionnellement aux poids des chapitres
// ═══════════════════════════════════════════════════════════════════
export const coMockExamQuestions = [
  // — Chapitre 1 : Vue d'ensemble (4 questions, 10%) ─────────────
  {
    id: "exam-1",
    chapter: "Vue d'ensemble CO",
    question: "Dans SAP S/4HANA, comment sont stockées simultanément les données FI et CO ?",
    options: ["Dans des tables séparées BKPF/BSEG et COBK/COEP", "Dans le Universal Journal (table ACDOCA)", "Dans deux instances SAP synchronisées", "Dans la table FAGLFLEXA uniquement"],
    correctIndex: 1,
    explanation: "Le Universal Journal (ACDOCA) unifie FI, CO, AA et ML dans une seule table dans S/4HANA. La réconciliation FI-CO d'ECC n'existe plus.",
  },
  {
    id: "exam-2",
    chapter: "Vue d'ensemble CO",
    question: "Quelle version CO est conventionnellement utilisée pour les données du budget annuel ?",
    options: ["Version 0", "Version 1", "Version 99", "Version ACT"],
    correctIndex: 1,
    explanation: "La version 0 est pour les données réelles. La version 1 est conventionnellement le budget annuel. Les versions 2, 3... sont pour les plans révisés.",
  },
  {
    id: "exam-3",
    chapter: "Vue d'ensemble CO",
    question: "Un type de coût secondaire de catégorie 43 est utilisé pour :",
    options: ["Les assessments entre centres de coûts", "Les imputations d'activité (Activity Allocations)", "Les surcharges de frais généraux", "Les transferts vers CO-PA"],
    correctIndex: 1,
    explanation: "Catégorie 43 = imputations d'activité. Catégorie 42 = assessments. Catégorie 41 = surcharges (overhead). Ces catégories sont purement internes à CO, sans pendant en FI.",
  },
  {
    id: "exam-4",
    chapter: "Vue d'ensemble CO",
    question: "La transaction OKKS sert à :",
    options: ["Créer un centre de coûts", "Définir le périmètre de contrôle actif pour la session", "Lancer la clôture CO", "Calculer les tarifs d'activité"],
    correctIndex: 1,
    explanation: "OKKS permet à un utilisateur de définir le périmètre de contrôle actif pour sa session. Toutes les transactions CO utilisent ensuite ce périmètre comme contexte organisationnel.",
  },
  // — Chapitre 2 : CCA (7 questions, 18%) ────────────────────────
  {
    id: "exam-5",
    chapter: "CCA",
    question: "La transaction KP06 permet de :",
    options: ["Créer un centre de coûts", "Saisir la planification des coûts primaires dans un centre de coûts", "Exécuter un cycle d'affectation", "Calculer les tarifs d'activité planifiés"],
    correctIndex: 1,
    explanation: "KP06 est la transaction de planification des coûts primaires : on saisit les montants budgétés par centre de coûts, type de coût, version et période.",
  },
  {
    id: "exam-6",
    chapter: "CCA",
    question: "Lors d'un cycle de distribution (KSV5), les coûts sont transférés :",
    options: ["Vers CO-PA via le PA Transfer Structure", "En conservant le type de coût d'origine", "Via un type de coût secondaire de catégorie 42", "Sans modifier le solde du centre émetteur"],
    correctIndex: 1,
    explanation: "La distribution (KSV5) conserve le type de coût d'origine : si on distribue des frais téléphone (626000), les récepteurs voient aussi du 626000. C'est la différence clé avec l'assessment qui regroupe tout en type de coût secondaire cat. 42.",
  },
  {
    id: "exam-7",
    chapter: "CCA",
    question: "KB21N est utilisée pour :",
    options: ["Créer un type d'activité", "Saisir manuellement une imputation d'activité réelle", "Planifier les quantités d'activité", "Définir le tarif d'un type d'activité"],
    correctIndex: 1,
    explanation: "KB21N enregistre la consommation réelle d'un type d'activité. Elle crée une pièce CO qui crédite le centre fournisseur et débite le récepteur (autre centre de coûts, ordre, etc.).",
  },
  {
    id: "exam-8",
    chapter: "CCA",
    question: "KP26 est la transaction de :",
    options: ["Planification des coûts primaires", "Planification des quantités d'activité", "Planification des coûts de surcharge", "Planification du budget annuel"],
    correctIndex: 1,
    explanation: "KP26 permet de saisir la quantité d'activité planifiée par centre de coûts et type d'activité. Combinée avec KP06 (coûts), elle permet de calculer le tarif d'activité planifié via KSPI.",
  },
  {
    id: "exam-9",
    chapter: "CCA",
    question: "Quelle est la formule du tarif d'activité planifié ?",
    options: ["Coûts réels ÷ quantités planifiées", "Coûts planifiés ÷ quantités d'activité planifiées", "Coûts planifiés × taux de surcharge", "Prix du marché × coefficient d'efficience"],
    correctIndex: 1,
    explanation: "Tarif planifié = coûts planifiés (KP06) ÷ quantités d'activité planifiées (KP26). La transaction KSPI calcule et mémorise ce tarif automatiquement.",
  },
  {
    id: "exam-10",
    chapter: "CCA",
    question: "Un cycle d'assessment utilise un type de coût secondaire de catégorie :",
    options: ["41 (Overhead)", "42 (Assessment)", "43 (Activity Allocation)", "21 (Internal Settlement)"],
    correctIndex: 1,
    explanation: "Les assessments utilisent des types de coûts secondaires de catégorie 42. Cela permet de regrouper tous les coûts du centre émetteur sous un seul type de coût, simplifiant le reporting des récepteurs.",
  },
  {
    id: "exam-11",
    chapter: "CCA",
    question: "KGI2 est la transaction utilisée pour :",
    options: ["Créer un cycle de répartition", "Imputer les surcharges de frais généraux (overhead rates)", "Calculer les tarifs réels", "Solder les centres de coûts"],
    correctIndex: 1,
    explanation: "KGI2 impute les surcharges configurées dans les Costing Sheets sur les objets CO concernés. Elle applique les taux de surcharge (% ou montant) définis sur les coûts de base.",
  },
  // — Chapitre 3 : IO (5 questions, 12%) ─────────────────────────
  {
    id: "exam-12",
    chapter: "Ordres internes",
    question: "Quel statut un ordre interne doit-il avoir pour pouvoir recevoir des imputations de coûts ?",
    options: ["CRTD (Créé)", "REL (Libéré)", "TECO (Techniquement clôturé)", "CLSD (Clôturé)"],
    correctIndex: 1,
    explanation: "Seul un ordre en statut REL (Released) peut recevoir des imputations. CRTD signifie créé mais pas encore activé. TECO bloque les nouvelles imputations. CLSD est la clôture définitive.",
  },
  {
    id: "exam-13",
    chapter: "Ordres internes",
    question: "La transaction KO88 sert à :",
    options: ["Créer un ordre interne", "Solder un ordre interne individuel", "Modifier le statut d'un ordre", "Afficher le budget d'un ordre"],
    correctIndex: 1,
    explanation: "KO88 sert au solde individuel d'un ordre interne : elle transfère les coûts collectés vers les objets récepteurs définis dans la règle de solde. KO8G est la version collective (plusieurs ordres).",
  },
  {
    id: "exam-14",
    chapter: "Ordres internes",
    question: "Un ordre interne statistique (Statistical Order) :",
    options: [
      "Reçoit les coûts réels et les transmet directement à CO-PA",
      "Collecte les coûts en parallèle d'un vrai récepteur CO, sans impacter le flux réel",
      "Est un ordre dont le budget est estimé statistiquement",
      "Est un ordre qui ne peut pas être soldé"
    ],
    correctIndex: 1,
    explanation: "Un ordre statistique collecte les coûts en 'miroir' d'un vrai récepteur CO. Les deux objets sont crédités, mais l'ordre statistique ne reçoit pas 'vraiment' les coûts. C'est un outil de reporting analytique complémentaire.",
  },
  {
    id: "exam-15",
    chapter: "Ordres internes",
    question: "La 'règle de solde' (Settlement Rule) d'un ordre interne définit :",
    options: [
      "Le budget maximum autorisé",
      "Les récepteurs et les clés de répartition lors du solde",
      "Les types de coûts autorisés sur l'ordre",
      "La période de validité de l'ordre"
    ],
    correctIndex: 1,
    explanation: "La règle de solde définit vers quels objets récepteurs (centres de coûts, actifs, WBS) et selon quelle répartition (%) les coûts de l'ordre seront transférés lors de l'exécution du solde.",
  },
  {
    id: "exam-16",
    chapter: "Ordres internes",
    question: "Le type d'ordre (Order Type) dans les ordres internes sert à :",
    options: [
      "Définir la devise de l'ordre",
      "Pré-paramétrer le comportement des ordres (gestion budget, règle de solde, catégorie)",
      "Déterminer le centre de profit de l'ordre",
      "Définir la hiérarchie d'appartenance"
    ],
    correctIndex: 1,
    explanation: "Le type d'ordre est la 'template' des ordres internes. Il pré-paramètre : gestion budgétaire (avec/sans dépassement), catégorie (statistique/réel), règle de solde par défaut.",
  },
  // — Chapitre 4 : PCA (5 questions, 14%) ────────────────────────
  {
    id: "exam-17",
    chapter: "PCA",
    question: "Comment un centre de profit est-il typiquement dérivé sur une pièce comptable dans S/4HANA ?",
    options: [
      "Il est toujours saisi manuellement par le comptable",
      "Par dérivation automatique depuis d'autres objets : centre de coûts, matériau, etc.",
      "Il est pris depuis les paramètres de la société",
      "Il est défini dans le type d'opération MM"
    ],
    correctIndex: 1,
    explanation: "Dans S/4HANA, le centre de profit est dérivé automatiquement. Exemple : le centre de coûts d'imputation a un centre de profit associé dans ses données de base. Un matériau peut aussi avoir un centre de profit par défaut.",
  },
  {
    id: "exam-18",
    chapter: "PCA",
    question: "La transaction KE51 crée :",
    options: ["Un cycle CO-PA", "Un centre de profit", "Un groupe de centres de profit", "Un segment de marché CO-PA"],
    correctIndex: 1,
    explanation: "KE51 crée un centre de profit. KE52 le modifie. KCH1 crée un groupe de centres de profit.",
  },
  {
    id: "exam-19",
    chapter: "PCA",
    question: "Le 'Document Splitting' en PCA permet de :",
    options: [
      "Diviser les gros montants en plusieurs petites pièces",
      "Affecter les postes de bilan aux centres de profit pour des bilans partiels",
      "Générer automatiquement des pièces CO depuis FI",
      "Séparer les pièces réelles des pièces statistiques"
    ],
    correctIndex: 1,
    explanation: "Le Document Splitting permet d'affecter les lignes de bilan (créances, dettes, stocks) aux centres de profit, permettant d'établir des bilans partiels par centre de profit en complément des comptes de résultat.",
  },
  {
    id: "exam-20",
    chapter: "PCA",
    question: "La hiérarchie standard des centres de profit est :",
    options: [
      "Optionnelle dans S/4HANA",
      "Obligatoire — chaque centre de profit doit lui appartenir",
      "Identique à la hiérarchie des centres de coûts",
      "Définie au niveau de la société, pas du périmètre CO"
    ],
    correctIndex: 1,
    explanation: "Comme pour les centres de coûts, la hiérarchie standard des centres de profit est obligatoire. Tout centre de profit doit être intégré dans cette structure arborescente pour la consolidation dans les rapports.",
  },
  {
    id: "exam-21",
    chapter: "PCA",
    question: "La transaction KE5Z produit :",
    options: [
      "Le bilan par centre de profit",
      "Le compte de résultat par centre de profit",
      "La liste des segments CO-PA",
      "Le rapport de solde des ordres"
    ],
    correctIndex: 1,
    explanation: "KE5Z est un rapport PCA affichant le compte de résultat (P&L) par centre de profit. Il compare coûts et produits pour calculer le résultat analytique de chaque centre de profit.",
  },
  // — Chapitre 5 : CO-PC (8 questions, 20%) ──────────────────────
  {
    id: "exam-22",
    chapter: "CO-PC",
    question: "Le coût standard d'un produit fabriqué est calculé à partir de :",
    options: [
      "L'historique des coûts réels de la période précédente",
      "La nomenclature (BOM) et le gamme de fabrication (Routing)",
      "Le prix d'achat de la matière première principale",
      "Le tarif horaire des opérateurs de production"
    ],
    correctIndex: 1,
    explanation: "CO-PC utilise la BOM pour les coûts matières/composants et le Routing pour les coûts de transformation (heures machine, MOD). Ces deux structures sont le point de départ du calcul via CK11N.",
  },
  {
    id: "exam-23",
    chapter: "CO-PC",
    question: "CK11N sert à :",
    options: [
      "Solder les ordres de fabrication",
      "Calculer le coût standard d'un matériau individuel",
      "Libérer le budget de production",
      "Créer la nomenclature d'un produit"
    ],
    correctIndex: 1,
    explanation: "CK11N (Costing Run individuel) calcule le coût standard pour un matériau. CK40N est la version en masse. Après vérification, CK24 marque et libère le nouveau standard dans la fiche article.",
  },
  {
    id: "exam-24",
    chapter: "CO-PC",
    question: "CK24 est utilisé pour :",
    options: [
      "Calculer le coût standard",
      "Marquer et libérer le coût standard calculé dans la fiche article",
      "Créer les données de base du calcul de coût",
      "Fermer la période de calcul"
    ],
    correctIndex: 1,
    explanation: "CK24 finalise le cycle de calcul de coût en deux étapes : 'Mark' (marque le nouveau prix futur dans la fiche article) puis 'Release' (active le nouveau prix comme prix standard actuel). Les nouvelles entrées en stock utilisent ensuite ce tarif.",
  },
  {
    id: "exam-25",
    chapter: "CO-PC",
    question: "Les entrées en stock de produits fabriqués sont valorisées à quel prix dans SAP ?",
    options: [
      "Au coût réel de l'ordre de fabrication",
      "Au coût standard mémorisé dans la fiche article",
      "Au prix du marché à la date d'entrée",
      "Au coût moyen pondéré des matières premières"
    ],
    correctIndex: 1,
    explanation: "Dans SAP, les entrées en stock de produits fabriqués (contre-passation ordre de fabrication) sont valorisées au coût standard. Les écarts entre le coût réel de l'ordre et le standard sont comptabilisés séparément dans des comptes d'écart.",
  },
  {
    id: "exam-26",
    chapter: "CO-PC",
    question: "La Cost Component Structure (structure de coûts) dans CO-PC sert à :",
    options: [
      "Définir la hiérarchie organisationnelle de CO",
      "Ventiler le coût d'un produit par composants : matières, MOD, surcharges",
      "Définir les règles d'évaluation des stocks",
      "Paramétrer les cycles de répartition"
    ],
    correctIndex: 1,
    explanation: "La Cost Component Structure décompose le coût total d'un produit en composants analytiques : matières premières, main-d'œuvre directe, frais machine, surcharges. Cela permet d'analyser l'origine de chaque centime du coût de revient.",
  },
  {
    id: "exam-27",
    chapter: "CO-PC",
    question: "CO88 est la transaction pour :",
    options: [
      "Calculer le coût standard en masse",
      "Solder les ordres de fabrication (calculer et comptabiliser les écarts réel/standard)",
      "Créer un ordre de fabrication",
      "Libérer le budget de production"
    ],
    correctIndex: 1,
    explanation: "CO88 sert au solde des ordres de fabrication en masse. Elle calcule l'écart entre le coût réel de l'ordre et le coût standard des entrées en stock, puis comptabilise cet écart dans des comptes dédiés.",
  },
  {
    id: "exam-28",
    chapter: "CO-PC",
    question: "Que se passe-t-il si le coût réel d'un ordre de fabrication diffère du coût standard lors du solde ?",
    options: [
      "Le coût standard est recalculé automatiquement",
      "L'écart est comptabilisé dans des comptes d'écart spécifiques",
      "L'entrée en stock est annulée et recréée au coût réel",
      "Un message d'erreur bloque le solde"
    ],
    correctIndex: 1,
    explanation: "Les entrées en stock restent au coût standard. L'écart (réel - standard) est calculé lors du solde (CO88) et comptabilisé dans des comptes d'écart. Ces écarts sont analysés pour identifier les dérives par rapport aux standards.",
  },
  {
    id: "exam-29",
    chapter: "CO-PC",
    question: "Le Routing (Gamme de fabrication) est utilisé dans CO-PC pour déterminer :",
    options: [
      "Les matières premières et composants nécessaires",
      "Les coûts de transformation : opérations, centres de travail, heures machine et MOD",
      "Le prix de vente cible du produit",
      "Les règles de découpage de documents"
    ],
    correctIndex: 1,
    explanation: "Le Routing liste les opérations de fabrication avec leurs centres de travail associés. CO-PC utilise ces données pour calculer les coûts de transformation : heures machine × tarif, heures MOD × tarif salaire.",
  },
  // — Chapitre 6 : CO-PA (5 questions, 14%) ──────────────────────
  {
    id: "exam-30",
    chapter: "CO-PA",
    question: "Quel type de CO-PA est recommandé par SAP dans S/4HANA ?",
    options: [
      "Le Costing-Based CO-PA car plus détaillé",
      "L'Account-Based CO-PA car intégré dans ACDOCA sans réconciliation",
      "Les deux sont nécessaires en parallèle",
      "CO-PA est remplacé par PCA dans S/4HANA"
    ],
    correctIndex: 1,
    explanation: "SAP recommande l'Account-Based CO-PA dans S/4HANA. Il est directement intégré dans ACDOCA, élimine les réconciliations FI-COPA et permet un reporting temps réel cohérent.",
  },
  {
    id: "exam-31",
    chapter: "CO-PA",
    question: "Les 'caractéristiques' (Characteristics) dans CO-PA représentent :",
    options: [
      "Les indicateurs financiers : CA, marges, COGS",
      "Les dimensions d'analyse : client, produit, pays, canal",
      "Les règles de mapping des conditions SD",
      "Les types de coûts secondaires utilisés"
    ],
    correctIndex: 1,
    explanation: "Les caractéristiques sont les axes d'analyse en CO-PA : client, article, pays, canal de distribution. Elles permettent de segmenter l'analyse de rentabilité selon n'importe quelle combinaison de dimensions.",
  },
  {
    id: "exam-32",
    chapter: "CO-PA",
    question: "Le PA Transfer Structure dans CO-PA définit :",
    options: [
      "La hiérarchie des segments de marché",
      "Le mapping entre les conditions SD et les Value Fields CO-PA lors de la facturation",
      "Les règles de consolidation vers FI",
      "Le plan comptable analytique CO-PA"
    ],
    correctIndex: 1,
    explanation: "Le PA Transfer Structure mappe chaque condition de prix SD (prix de vente, remise client, remise article, surcharge) vers le Value Field CO-PA correspondant. C'est le pont entre les prix SD et l'analyse de rentabilité.",
  },
  {
    id: "exam-33",
    chapter: "CO-PA",
    question: "KE30 sert à :",
    options: [
      "Paramétrer le système opérationnel CO-PA",
      "Exécuter un rapport d'analyse de rentabilité CO-PA",
      "Saisir une pièce CO-PA manuelle",
      "Définir les caractéristiques CO-PA"
    ],
    correctIndex: 1,
    explanation: "KE30 lance les rapports CO-PA (Profitability Report). On sélectionne les caractéristiques (client, article, période) et les indicateurs (CA, marge, COGS) pour analyser la rentabilité par segment.",
  },
  {
    id: "exam-34",
    chapter: "CO-PA",
    question: "CO-PA est principalement alimenté lors de :",
    options: [
      "La création de la commande client (VA01)",
      "La facturation SD (VF01)",
      "La livraison (VL01N)",
      "La planification commerciale (SOP)"
    ],
    correctIndex: 1,
    explanation: "CO-PA est alimenté principalement lors de la facturation SD. La création de la facture (VF01) transfère les composants de prix via le PA Transfer Structure vers les Value Fields CO-PA.",
  },
  // — Chapitre 7 : Clôture périodique (6 questions, 12%) ─────────
  {
    id: "exam-35",
    chapter: "Clôture CO",
    question: "KSII dans la clôture CO périodique permet de :",
    options: [
      "Exécuter les cycles d'affectation",
      "Calculer les tarifs d'activité réels pour la période",
      "Solder les ordres de fabrication",
      "Fermer les périodes comptables"
    ],
    correctIndex: 1,
    explanation: "KSII recalcule les tarifs d'activité réels en divisant les coûts réels du centre par les quantités d'activité réelles. Les écarts vs tarifs planifiés peuvent être comptabilisés.",
  },
  {
    id: "exam-36",
    chapter: "Clôture CO",
    question: "Le Material Ledger (Comptabilité matière) est nécessaire pour :",
    options: [
      "Calculer les coûts planifiés des produits",
      "Calculer le coût réel moyen périodique des matières (Actual Costing)",
      "Gérer les stocks en temps réel",
      "Calculer les amortissements des immobilisations"
    ],
    correctIndex: 1,
    explanation: "Le Material Ledger collecte tous les mouvements de stock avec leurs coûts réels pour calculer un prix moyen réel sur la période (Actual Price). Ce prix peut réévaluer les stocks au 'vrai' coût de revient.",
  },
  {
    id: "exam-37",
    chapter: "Clôture CO",
    question: "Dans la séquence de clôture CO, CKMLCP doit être exécuté :",
    options: [
      "En premier, avant tous les autres traitements CO",
      "En dernier, après les déversements, soldes d'ordres et CO88",
      "En même temps que les cycles de répartition",
      "Avant les imputations d'activité KB21N"
    ],
    correctIndex: 1,
    explanation: "CKMLCP (clôture Material Ledger) doit être exécuté en dernier dans la séquence de clôture CO, car il dépend de tous les autres traitements : tarifs réels (KSII), déversements (KSU5), soldes d'ordres (KO8G, CO88).",
  },
  {
    id: "exam-38",
    chapter: "Clôture CO",
    question: "Le 'roll-up' des écarts dans le Material Ledger consiste à :",
    options: [
      "Regrouper les écarts de toutes les sociétés du périmètre",
      "Propager les écarts de coût des matières premières vers les produits finis dans la chaîne de valeur",
      "Reporter les écarts non soldés sur la période suivante",
      "Consolider les écarts CO-PA vers FI"
    ],
    correctIndex: 1,
    explanation: "Le roll-up propage ascendantem les écarts. Si une matière première coûte plus cher que son standard, cet écart remonte dans le coût du composant qui l'utilise, puis dans le coût du produit fini. Cela donne le 'vrai' coût de revient à chaque niveau.",
  },
  {
    id: "exam-39",
    chapter: "Clôture CO",
    question: "La transaction KO8G sert à :",
    options: [
      "Calculer les tarifs d'activité réels",
      "Solder les ordres internes en masse (collectif)",
      "Solder les ordres de fabrication",
      "Exécuter la clôture du Material Ledger"
    ],
    correctIndex: 1,
    explanation: "KO8G est la version collective de KO88 pour les ordres internes : elle sert à solder plusieurs ordres internes en une seule exécution. CO88 est l'équivalent pour les ordres de fabrication.",
  },
  {
    id: "exam-40",
    chapter: "Clôture CO",
    question: "Quelle est la principale différence entre la clôture CO et la clôture FI ?",
    options: [
      "La clôture CO est mensuelle, la clôture FI est annuelle",
      "La clôture CO arrête les données de contrôle de gestion interne, la clôture FI produit les états légaux",
      "La clôture CO est automatique, la clôture FI est manuelle",
      "La clôture CO ne nécessite pas l'approbation du directeur financier"
    ],
    correctIndex: 1,
    explanation: "La clôture CO (tarifs réels, déversements, solde ordres, ML) arrête les données analytiques internes. La clôture FI (balance de vérification, bilan, compte de résultat légal, FAGLGVTR) produit les états financiers publiés. Les deux sont complémentaires.",
  },
];
