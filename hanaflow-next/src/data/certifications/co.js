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
  simulatorQuestions: 80,
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
        {
          id: "l3-2",
          title: "Budget, Availability Control, Investment Orders et stratégies de solde",
          content: [
            "Le Budget Management des ordres internes permet de fixer un montant maximum à respecter sur l'ordre. Le budget est saisi en montant total (KO22) ou par exercice/année. Le système peut bloquer ou avertir lors d'une imputation qui dépasserait ce budget — c'est l'Availability Control (Contrôle de Disponibilité, AVC).",
            "L'Availability Control (AVC) vérifie en temps réel chaque imputation contre le budget restant. Trois niveaux : Information (message info), Avertissement (warning), Erreur (blocage saisie). Configuration par tolérance % de consommation : ex 90% = warning, 100% = error. La transaction OPS9 paramètre les profils de tolérance par type d'ordre. Indispensable pour les projets où dépasser un budget aurait des conséquences financières.",
            "Les Investment Orders (Ordres d'investissement) sont une variante des ordres internes pour la collecte des coûts d'une immobilisation en cours de construction (CIP / Construction in Progress). Lors de la mise en service, l'ordre est soldé (KO88) vers une immobilisation finale (compte d'actif), créant ainsi l'asset master record correspondant. Ce processus relie CO et FI-AA.",
            "Les Statistical Key Figures (SKF) ne sont pas spécifiques aux ordres mais s'y appliquent : ce sont des données quantitatives (m², heures, têtes) utilisées comme clés de répartition pour la distribution/cession des coûts. Exemple : un ordre 'Foire commerciale' peut avoir un SKF 'Visiteurs' utilisé ensuite pour répartir les coûts vers les centres de coûts produits.",
            "La Règle de Solde (Settlement Rule, KSR1) définit où et comment les coûts d'un ordre sont transférés. Plusieurs récepteurs possibles : centres de coûts (POL=portion fixe), immobilisations, WBS, autres ordres. La règle peut être en pourcentage (100% vers CC1) ou en montant fixe (5000€ vers AS1, reste vers CC2). Un ordre peut avoir plusieurs lignes de règle pour des solders multi-récepteurs.",
            "Le Cycle de Solde Périodique (Periodic Settlement) versus Final Settlement : pendant la vie de l'ordre, on peut le solder périodiquement (mensuel) pour transférer les coûts au fur et à mesure. À la fin de vie (TECO/CLSD), un solde final transfère tous les coûts restants. Pour les Investment Orders, le solde final crée l'immobilisation. KO88 traite individuel, KO8G collectif (utilisé en clôture)."
          ],
          keyConcepts: [
            { term: "Availability Control (AVC)", definition: "Contrôle temps réel du budget. Profile de tolérance (info/warning/error). Bloque ou alerte à 90/100% selon config." },
            { term: "Investment Order (Ordre d'investissement)", definition: "Variante d'IO pour collecter coûts d'une immo en construction. Soldé vers une immobilisation finale lors de la mise en service." },
            { term: "Settlement Rule (KSR1)", definition: "Règle de solde de l'ordre : récepteurs (CC, immo, WBS), portions (% ou montants). Peut être multi-récepteurs." },
            { term: "Periodic vs Final Settlement", definition: "Solde périodique (mensuel) ou solde final (fin de vie). Investment Orders requièrent un solde final pour créer l'immo." },
            { term: "SKF (Statistical Key Figure)", definition: "Quantité non monétaire (m², heures, têtes). Utilisée comme clé de répartition pour distribution/cession des coûts." },
            { term: "OPS9", definition: "Configuration des profils de tolérance pour l'Availability Control. Définit les seuils warning/error par % de consommation budget." },
            { term: "KO22 / KO12", definition: "KO22 = Budget total ordre, KO12 = Saisie budget par exercice. Tous deux activent le contrôle AVC si configuré." },
          ],
          tcodes: [
            { code: "KO22", description: "Saisir le budget total d'un ordre interne" },
            { code: "OPS9", description: "Configurer les profils de tolérance pour l'Availability Control" },
            { code: "KSR1", description: "Définir la règle de solde (Settlement Rule) d'un ordre" },
            { code: "KOC4", description: "Rapport : postes réels par ordre avec budget restant" },
            { code: "KOAM", description: "Rapport : ordres avec dépassement budget" },
            { code: "KOK4", description: "Solde collectif des ordres en clôture périodique" },
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
        {
          id: "l4-2",
          title: "Transfer Pricing, Segment Reporting et reporting consolidé PCA",
          content: [
            "Le Transfer Pricing (Prix de Transfert) en SAP est la valorisation des transactions intra-groupe entre divisions ou sociétés différentes. Il permet de produire 3 vues parallèles : Vue Légale (prix réel intercompanies), Vue Groupe (prix de transfert éliminé pour la consolidation), Vue Profit Center (prix interne pour mesurer la rentabilité de chaque PC). SAP gère ces 3 vues via les Currency Types (Type 10 légal, 30 groupe, 50 profit center).",
            "Les Segments en SAP S/4HANA sont une dimension de reporting introduite avec la New GL et largement utilisée pour le reporting IFRS 8 (Segment Reporting). Un Segment regroupe plusieurs centres de profit selon une logique métier (ex: BU produit, zone géographique). Configuration : un segment par défaut peut être dérivé du centre de profit. Les rapports IFRS 8 nécessitent le segment comme dimension obligatoire.",
            "L'IFRS 8 — Segment Reporting impose aux groupes cotés de publier des résultats par segment opérationnel. SAP fournit les rapports natifs (FAGLL03H avec segment, S_ALR_87012287). La dérivation segment ↔ centre de profit doit être configurée pour permettre ce reporting automatisé. Erreur courante : oublier la dérivation et avoir des écritures sans segment, qui faussent le reporting.",
            "La Profit Center Hierarchy en S/4HANA est utilisée pour le reporting consolidé. La transaction KCH1 crée la hiérarchie standard. Chaque centre de profit doit y être rattaché. La consolidation ascendante (roll-up) est automatique dans les rapports : sélection sur un nœud parent agrège tous les enfants. Critique pour les groupes multi-niveaux (BU → division → groupe).",
            "L'Intercompany Reconciliation (réconciliation intersociétés) traite les opérations entre sociétés du même groupe : ventes intersoc, prêts intersoc. SAP propose des comptes spéciaux (Intercompany Accounts) qui doivent être réciproques entre les deux sociétés. Le programme F.2E (ICR Reconciliation) compare automatiquement et identifie les écarts. Critique pour la qualité de la consolidation finale.",
            "Le S/4HANA Group Reporting (anciennement BCS) est l'outil de consolidation natif. Il s'appuie sur ACDOCA + ACDOCU (Universal Journal Group Reporting) pour la consolidation. Élimine les opérations intra-groupe, harmonise les plans comptables, gère les retraitements IFRS. Remplace progressivement SAP BPC pour les nouvelles implémentations."
          ],
          keyConcepts: [
            { term: "Transfer Pricing (Prix de Transfert)", definition: "Valorisation des transactions intra-groupe. 3 vues : Légale (10), Groupe (30), Profit Center (50). Configuration via Currency Types." },
            { term: "Segment (IFRS 8)", definition: "Dimension de reporting pour la publication par segment opérationnel. Dérivable depuis centre de profit. Obligatoire pour groupes IFRS." },
            { term: "Intercompany Reconciliation", definition: "Réconciliation des comptes entre sociétés du groupe. F.2E identifie les écarts. Critique pour qualité consolidation." },
            { term: "S/4HANA Group Reporting", definition: "Outil natif de consolidation S/4HANA. ACDOCU = Universal Journal Group. Remplace BPC pour nouvelles implémentations." },
            { term: "Currency Type 10/30/50", definition: "10=devise locale légale, 30=devise groupe (consolidation), 50=devise centre de profit. Permet tenue parallèle des montants." },
            { term: "Profit Center Hierarchy", definition: "Structure arborescente obligatoire. Permet roll-up automatique en reporting. KCH1 pour création/modification." },
            { term: "ACDOCU", definition: "Universal Journal Group Reporting. Stocke les écritures consolidées. Pendant logique d'ACDOCA pour le groupe." },
          ],
          tcodes: [
            { code: "KEN1", description: "Configuration du Transfer Pricing (Group Currency)" },
            { code: "FAGLPCD2", description: "Document Splitting Profit Center / Segment" },
            { code: "F.2E", description: "Intercompany Reconciliation — analyse écarts intersociétés" },
            { code: "S_PL0_86000028", description: "Rapport Segment Reporting IFRS 8" },
            { code: "KCH5N", description: "Afficher la hiérarchie standard des centres de profit" },
            { code: "GR55", description: "Bibliothèque de rapports flexible (Report Painter) pour PCA" },
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
        {
          id: "l5-2",
          title: "Variants de calcul, écarts de production, Material Ledger et Actual Costing",
          content: [
            "Le Costing Variant (Variante de Calcul) configure HOW le coût est calculé. Définit : type de calcul (standard, modifié, actuel), source des prix matières (prix moyen, dernier achat, contrat), source des activités (taux planifiés/réels), date de validité. La transaction OKKN gère les variantes. Variantes typiques : PPC1 (standard cost annuel), PPC2 (calcul modifié pour simulation), PPC3 (calcul actuel pour MEC).",
            "Les Écarts de Production (Production Variances) sont la différence entre le coût standard d'un produit et son coût réel observé sur l'ordre de fabrication. SAP les classifie en catégories : Input Price Variance (prix matière différent), Input Quantity Variance (consommation différente), Resource-Usage Variance (mix activités), Lot Size Variance (taille lot différente), Mixed Price Variance. KKS1 calcule les écarts, CO88 les solde vers PA ou comptes d'écart.",
            "Le Material Ledger (ML) est l'outil de tenue du grand livre matière en multi-devises et multi-valorisations. Activé via OMX1, il complète l'Universal Journal pour le suivi des stocks. Permet : valorisation parallèle (locale, groupe, profit center), Actual Costing (recalcul du coût réel mensuel via Single-Level / Multi-Level Settlement), reporting par origine de variance.",
            "L'Actual Costing (Calcul de Coût Réel) recalcule chaque mois le coût réel des produits en consolidant tous les écarts collectés sur les ordres de fabrication, les achats et les transactions de stock. Le programme CKMLCP (Closing Cockpit ML) lance les étapes : Selection (sélection produits) → Determination of Sequence (ordre topologique) → Single-Level Price Determination → Multi-Level Price Determination → Revaluation of Consumption → Post Closing. Permet de revaloriser le stock final au coût réel, pas standard.",
            "Le Mark and Release du coût standard (CK24) est un processus en 2 étapes : 'Mark' (marquage) inscrit le nouveau coût comme 'futur' dans la fiche article — il est calculé mais pas encore actif. 'Release' (libération) bascule ce coût futur en coût standard 'actuel', appliqué aux nouvelles entrées en stock. Un seul Release par période est autorisé pour préserver la cohérence comptable. Permet de séparer le calcul du coût et son application effective.",
            "Le Profitability Analysis (CO-PA) reçoit les écarts soldés des ordres de fabrication. Le solde des écarts (CO88) ventile les écarts par caractéristique (produit, client, segment). Permet une analyse fine : 'Quel produit a généré quels écarts pour quel marché ?'. Configuration via PA Transfer Structure qui mappe les écarts CO-PC vers les value fields CO-PA."
          ],
          keyConcepts: [
            { term: "Costing Variant (OKKN)", definition: "Paramétrage du calcul de coût : type, source prix, source activités, dates. PPC1 standard, PPC2 simulation, PPC3 actuel." },
            { term: "Production Variances (KKS1)", definition: "Écarts ordre fab : prix matière, qté consommée, mix activités, taille lot. Soldés en PA ou compte écart via CO88." },
            { term: "Material Ledger (OMX1)", definition: "Grand livre matière multi-devises et multi-valo. Active Actual Costing. Complément ACDOCA pour stocks." },
            { term: "Actual Costing (CKMLCP)", definition: "Recalcul mensuel coût réel via Single-Level + Multi-Level Settlement. Revalorise stock final au coût réel constaté." },
            { term: "Mark and Release (CK24)", definition: "Marquage = coût futur, Release = coût actuel. 1 release par période. Sépare calcul et application." },
            { term: "PA Transfer Structure", definition: "Mapping écarts CO-PC → value fields CO-PA. Permet analyse écarts par caractéristique (produit, client, segment)." },
            { term: "Single-Level vs Multi-Level Settlement", definition: "Single-Level : niveau immédiat. Multi-Level : remonte la nomenclature niveau par niveau pour ventiler les écarts amont." },
          ],
          tcodes: [
            { code: "OKKN", description: "Configurer les variantes de calcul de coût (Costing Variants)" },
            { code: "KKS1", description: "Calcul individuel des écarts d'un ordre de fabrication" },
            { code: "KKS2", description: "Calcul collectif des écarts (en masse, clôture)" },
            { code: "OMX1", description: "Activer le Material Ledger pour une division" },
            { code: "CKMLCP", description: "Closing Cockpit Material Ledger — Actual Costing mensuel" },
            { code: "CKM3", description: "Material Price Analysis — analyse prix par origine" },
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
        {
          id: "l6-2",
          title: "Costing-based vs Account-based CO-PA, dérivation des caractéristiques et reporting",
          content: [
            "Deux variantes de CO-PA existent : Costing-based (basé sur calcul, classique ECC/S4) et Account-based (basé sur comptes, recommandé S/4HANA). Costing-based stocke les valeurs en value fields personnalisés (Sales Volume, Net Revenue, COGS) et permet des reportings en colonnes de marge. Account-based utilise directement les comptes GL via ACDOCA — totalement intégré, réconciliation FI-CO automatique, mais reporting plus rigide.",
            "Dans S/4HANA, l'Account-based CO-PA est le standard recommandé : il s'appuie sur ACDOCA et bénéficie du temps réel + cohérence garantie avec FI. Le Costing-based reste possible (souvent en parallèle) pour conserver les rapports legacy. Migration ECC → S/4HANA : la plupart des projets gardent les deux le temps de la transition, puis basculent.",
            "Les Caractéristiques (Characteristics, KEA5) sont les dimensions d'analyse de CO-PA : Customer (client), Product (produit), Region, Sales Channel, Sales Organization, etc. Elles peuvent être prédéfinies (transactionnelles standard) ou customisées. Plus de caractéristiques = analyses plus fines mais volume de données plus important. Compromise à trouver lors du design.",
            "La Dérivation des Caractéristiques (KEDR) automatise le remplissage des dimensions CO-PA. Exemple : à partir du client (caractéristique source), dériver la région (caractéristique cible) via la fiche client. Plusieurs étapes peuvent s'enchaîner. Ces dérivations sont critiques pour la qualité des données : sans elles, les pièces arriveraient en CO-PA sans dimensions.",
            "Les Value Fields (KEA6) sont les indicateurs monétaires de Costing-based CO-PA : Net Revenue, Cost of Goods Sold (COGS), Standard Material Cost, Variances, Customer Discount. Chaque value field reçoit ses montants depuis les flux d'origine : SD (revenus, remises), MM (COGS), CO-PC (variances). Le PA Transfer Structure (KE4I) configure le mapping flux → value fields.",
            "Le Top-Down Distribution (KEC1) ventile les coûts globaux (frais de structure non affectés directement) par caractéristiques CO-PA. Exemple : refacturer le coût du siège social aux régions selon le CA généré. Méthode similaire à l'allocation CCA mais en CO-PA. Les rapports CO-PA peuvent ainsi montrer des marges complètes incluant les coûts de structure réaffectés."
          ],
          keyConcepts: [
            { term: "Costing-based vs Account-based CO-PA", definition: "Costing = value fields personnalisés (legacy). Account = comptes GL via ACDOCA (S/4HANA recommandé). Souvent les deux en parallèle pendant migration." },
            { term: "Caractéristique (Characteristic)", definition: "Dimension d'analyse CO-PA : client, produit, région, canal. KEA5. Plus = analyses fines mais volume données." },
            { term: "Dérivation (KEDR)", definition: "Remplissage auto des caractéristiques par règles. Ex: client → région via fiche client. Critique pour qualité data." },
            { term: "Value Field (KEA6)", definition: "Indicateur monétaire CO-PA : Net Revenue, COGS, Variances. Reçoit montants des flux SD/MM/CO-PC." },
            { term: "PA Transfer Structure (KE4I)", definition: "Mapping flux origine → value fields CO-PA. Config critique pour que les écarts arrivent au bon endroit." },
            { term: "Top-Down Distribution (KEC1)", definition: "Ventilation des coûts globaux par caractéristiques. Permet marges complètes incluant frais structure." },
            { term: "Operating Concern", definition: "Plus haut niveau organisationnel CO-PA. Regroupe les sociétés analysées ensemble. Caractéristiques et value fields y sont définis." },
          ],
          tcodes: [
            { code: "KEA5", description: "Définir les caractéristiques CO-PA" },
            { code: "KEA6", description: "Définir les value fields CO-PA (Costing-based)" },
            { code: "KEDR", description: "Dérivation des caractéristiques (règles auto)" },
            { code: "KEC1", description: "Top-Down Distribution — ventilation coûts par caractéristiques" },
            { code: "KE24", description: "Analyse des pièces CO-PA (drill-down)" },
            { code: "KE4S", description: "Affichage des règles SD → CO-PA" },
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
        {
          id: "l7-2",
          title: "Méthodes d'allocation : Distribution, Assessment, Indirect Activity Allocation et Closing Cockpit",
          content: [
            "Les Méthodes d'Allocation CO sont les outils de cession et répartition des coûts entre objets CO en fin de période. Trois méthodes principales : Distribution (KSV5), Assessment (KSU5), Indirect Activity Allocation (KSC5). Chacune a une logique différente et est paramétrée via des Cycles d'Allocation contenant Sender (envoyeur), Receiver (destinataire), Tracing Factor (clé de répartition).",
            "La Distribution (Répartition primaire) transfère les coûts à leur nature analytique d'origine — le compte primaire est conservé. Exemple : un centre de coûts 'Bâtiment' reçoit 100 000€ d'électricité (compte 6061), il les répartit sur 4 centres utilisateurs au prorata des m² occupés. Chaque destinataire reçoit sa part sur le compte 6061. Utile pour conserver la traçabilité de la nature primaire (utile en analyse).",
            "L'Assessment (Cession secondaire) transfère les coûts via un compte secondaire d'allocation (Secondary Cost Element, type 42). La nature primaire est masquée derrière ce compte de cession. Exemple : centre 'Production' transfère ses 80 000€ de coûts vers les centres 'Produit A' et 'Produit B' via le compte 'CESS_PROD'. Plus utilisé que Distribution pour la flexibilité reporting et la non-pollution des comptes primaires.",
            "L'Indirect Activity Allocation (KSC5) est utilisée quand on ne peut pas mesurer directement la quantité d'activité consommée. Exemple : on sait que la maintenance a effectué 1000h au total mais on ne connaît pas la répartition par client interne. Une clé de répartition (statistical key figure ou poste consommation primaire) sert à ventiler. Comptabilisée comme une cession d'activité (compte secondaire type 43).",
            "Le Closing Cockpit S/4HANA (transaction CLOCO ou app Fiori 'Manage Closing') orchestre l'ensemble de la clôture mensuelle. Définit les tâches dans un Template (programmes ABAP, applications Fiori, contrôles), avec dépendances (tâche A doit finir avant tâche B), responsables (owners), périodicités. À chaque clôture, on instancie le template et on suit l'avancement. Indispensable pour les groupes avec clôture rapide (5-7 jours).",
            "Les étapes typiques de clôture CO mensuelle, dans l'ordre : 1) MM closing (MMPV), 2) Allocations centres de coûts (Distribution/Assessment), 3) KSII tarifs réels, 4) Material Ledger CKMLCP, 5) Solde ordres internes/fabrication (KO8G/CO88), 6) Calcul écarts production (KKS2), 7) Transfer vers CO-PA (KE21N/automatique), 8) Lock period (clôture FI). L'ordre est critique car certaines étapes consomment les résultats des précédentes."
          ],
          keyConcepts: [
            { term: "Distribution (KSV5)", definition: "Cession primaire : transfert avec compte d'origine. Conserve la nature primaire chez le receveur. Plus rare en pratique." },
            { term: "Assessment (KSU5)", definition: "Cession secondaire : via compte de cession (type 42). Masque la nature primaire. Plus utilisée pour flexibilité reporting." },
            { term: "Indirect Activity Allocation (KSC5)", definition: "Cession d'activité quand quantité non mesurable. Utilise SKF ou conso primaire comme clé. Compte secondaire type 43." },
            { term: "Cycle d'allocation", definition: "Définit Sender (envoyeur), Receiver (destinataire), Tracing Factor (clé). Exécutable périodiquement. Évolutif." },
            { term: "Closing Cockpit (CLOCO)", definition: "Orchestrateur de la clôture mensuelle. Template avec tâches, dépendances, owners. Permet clôture rapide auditée." },
            { term: "Tracing Factor", definition: "Clé de répartition d'un cycle : SKF (m², têtes), poste réel, fixe. Détermine comment le sender répartit vers receivers." },
            { term: "Secondary Cost Element type 42 vs 43", definition: "Type 42 = Assessment (cession coûts). Type 43 = Internal Activity Allocation (cession activité). Comptes CO uniquement, pas dans plan FI." },
          ],
          tcodes: [
            { code: "KSV5", description: "Exécuter un cycle de Distribution (cession primaire)" },
            { code: "KSU5", description: "Exécuter un cycle d'Assessment (cession secondaire)" },
            { code: "KSC5", description: "Exécuter une Indirect Activity Allocation" },
            { code: "KSV1 / KSU1", description: "Créer un cycle de Distribution / Assessment" },
            { code: "CLOCO", description: "Closing Cockpit S/4HANA — orchestration clôture" },
            { code: "S_ALR_87013611", description: "Rapport centre de coûts plan/réel/écart standard" },
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
  // ─── Questions complémentaires (exam-41 à exam-80) ─────────────────
  // Ch1 — Vue d'ensemble (+4 questions)
  { id: "exam-41", chapter: "Vue d'ensemble CO", question: "Le périmètre de contrôle de gestion (Controlling Area) :", options: ["Est facultatif en SAP", "Regroupe une ou plusieurs sociétés pour permettre l'imputation des coûts CO", "Est lié à un seul mandant uniquement", "Remplace la société dans S/4HANA"], correctIndex: 1, explanation: "Le Controlling Area regroupe des sociétés pour le reporting CO transversal. Une société doit y être assignée pour bénéficier des fonctionnalités CO. Il définit la devise CO et le plan opérationnel partagé." },
  { id: "exam-42", chapter: "Vue d'ensemble CO", question: "Quelle table contient les écritures CO dans SAP ECC ?", options: ["BSEG", "ACDOCA", "COEP / COBK", "FAGLFLEXA"], correctIndex: 2, explanation: "Dans ECC, les écritures CO étaient stockées dans COBK (en-tête) + COEP (lignes). Dans S/4HANA, ces tables sont remplacées par ACDOCA (Universal Journal) qui unifie FI et CO." },
  { id: "exam-43", chapter: "Vue d'ensemble CO", question: "Le concept de 'Cost Element' (nature de coût) en S/4HANA est :", options: ["Une table séparée comme dans ECC", "Une catégorie particulière de comptes GL (Cost Element type 1 = primaire, 11 = revenu, 42 = secondaire assessment)", "Remplacé par les centres de coûts", "Géré uniquement dans CO-PA"], correctIndex: 1, explanation: "Dans S/4HANA, les Cost Elements ne sont plus une table séparée — ils sont des comptes GL avec un attribut 'Cost Element Category'. Type 1 = compte primaire imputable CO, Type 11 = revenu, Type 42 = compte secondaire d'assessment." },
  { id: "exam-44", chapter: "Vue d'ensemble CO", question: "Le 'Document Splitting' du Universal Journal en S/4HANA permet :", options: ["De diviser une facture en plusieurs paiements", "De ventiler chaque écriture sur les dimensions (segment, profit center) pour des bilans/P&L par dimension", "De séparer le journal en 12 mois", "De fractionner les BC"], correctIndex: 1, explanation: "Le Document Splitting ventile chaque ligne d'écriture sur les dimensions de reporting (segment, profit center, business area), permettant de produire des bilans et P&L partiels. Configuré dans la nouvelle compta GL." },
  // Ch2 — Centres de coûts (+5 questions)
  { id: "exam-45", chapter: "Centres de coûts (CCA)", question: "La transaction KS01 sert à :", options: ["Créer un centre de profit", "Créer un centre de coûts (Cost Center)", "Créer un ordre interne", "Saisir une activité"], correctIndex: 1, explanation: "KS01 crée un centre de coûts. KE51 = profit center, KO01 = ordre interne, KL01 = activité. La logique SAP : KS = Cost Center." },
  { id: "exam-46", chapter: "Centres de coûts (CCA)", question: "L'Activity Type (type d'activité) en CCA représente :", options: ["Un produit fabriqué", "Une nature de prestation interne d'un centre de coûts (ex: heure machine, heure de MOD)", "Un compte GL", "Un ordre de fabrication"], correctIndex: 1, explanation: "Activity Type = nature d'activité d'un centre de coûts (heures machine, heures de MOD, kg traités). Tarifié (€/heure) et imputable aux ordres de production via Activity Allocation. KL01/KL02 pour création/modif." },
  { id: "exam-47", chapter: "Centres de coûts (CCA)", question: "Le tarif planifié d'une activité est saisi via :", options: ["KP06", "KP26", "KS01", "KSII"], correctIndex: 1, explanation: "KP26 saisit le tarif (€/heure) planifié d'une activité par centre de coûts et version. KP06 saisit les coûts plan, KSII calcule les tarifs réels en clôture." },
  { id: "exam-48", chapter: "Centres de coûts (CCA)", question: "Le 'Reposting' (KB11N) en CCA permet :", options: ["De solder un centre de coûts", "De déplacer une écriture saisie sur un centre incorrect vers le bon (correction analytique pure, sans impact FI)", "De créer un nouveau centre de coûts", "De budgétiser un centre"], correctIndex: 1, explanation: "KB11N = Reposting de coûts CO uniquement (pas de modification FI). Permet de corriger une imputation analytique sans toucher la pièce comptable FI d'origine. Préserve l'audit trail." },
  { id: "exam-49", chapter: "Centres de coûts (CCA)", question: "La Hiérarchie Standard des centres de coûts est :", options: ["Optionnelle", "Obligatoire — chaque centre de coûts doit y être rattaché", "Configurable via OB52", "Réservée aux groupes consolidés"], correctIndex: 1, explanation: "La hiérarchie standard est obligatoire en CO. Chaque centre de coûts doit y appartenir. Permet le reporting consolidé ascendant (roll-up) et la définition des cycles d'allocation par groupe." },
  // Ch3 — Ordres internes (+5 questions)
  { id: "exam-50", chapter: "Ordres internes (IO)", question: "Un ordre interne en statut 'CRTD' :", options: ["Peut recevoir des coûts", "Ne peut pas recevoir de coûts — il faut le libérer (REL) d'abord", "Est définitivement clôturé", "Ne peut pas être modifié"], correctIndex: 1, explanation: "Statut CRTD (Created) : ordre créé mais pas opérationnel. Doit passer en REL (Released) pour accepter les imputations de coûts. Cycle de vie : CRTD → REL → TECO → CLSD." },
  { id: "exam-51", chapter: "Ordres internes (IO)", question: "Un Investment Order (Ordre d'investissement) :", options: ["Est un ordre statistique", "Collecte les coûts d'une immobilisation en construction, soldé vers une immo finale lors de la mise en service", "Ne peut pas être budgétisé", "Est exclu du Settlement"], correctIndex: 1, explanation: "Investment Order = variante d'IO pour les CIP (Construction in Progress). Lors de la mise en service, KO88 solde les coûts vers une immobilisation finale (asset master), créant ainsi l'actif." },
  { id: "exam-52", chapter: "Ordres internes (IO)", question: "L'Availability Control (AVC) sur un ordre :", options: ["Vérifie la disponibilité des composants en stock", "Vérifie en temps réel chaque imputation contre le budget restant et bloque/avertit selon les seuils configurés", "Lance un inventaire physique", "Calcule la disponibilité produit pour les ventes"], correctIndex: 1, explanation: "AVC (Availability Control) = contrôle budget temps réel. À chaque imputation, vérifie la consommation cumulée vs budget. Selon profil OPS9 : info, warning ou error blocking au seuil défini (souvent 90%/100%)." },
  { id: "exam-53", chapter: "Ordres internes (IO)", question: "La Settlement Rule (KSR1) d'un ordre interne :", options: ["Définit le budget", "Définit où et comment sont transférés les coûts collectés (récepteurs : CC, immo, WBS, autres ordres ; portions % ou montants)", "Définit les autorisations", "Définit la durée de vie"], correctIndex: 1, explanation: "Settlement Rule (KSR1) : règle de solde de l'ordre. Définit récepteurs (centre coûts, immobilisation, WBS, autre ordre), portions (%, montants fixes). Peut être multi-récepteurs. Critique pour le solde KO88." },
  { id: "exam-54", chapter: "Ordres internes (IO)", question: "KO88 vs KO8G :", options: ["Identiques", "KO88 = solde individuel d'un ordre, KO8G = solde collectif (en masse) utilisé en clôture périodique", "KO8G crée des ordres", "KO88 affiche un rapport"], correctIndex: 1, explanation: "KO88 traite un ordre à la fois (saisie manuelle). KO8G en masse selon critères (en clôture mensuelle). Tous deux utilisent la Settlement Rule définie par ordre." },
  // Ch4 — Centres de profit / PCA (+6 questions)
  { id: "exam-55", chapter: "Centres de profit (PCA)", question: "Différence centre de profit / centre de coûts ?", options: ["Aucune", "Centre de profit collecte coûts ET produits (vue P&L), centre de coûts collecte uniquement les coûts", "Centre de profit dans FI", "Centre de coûts dans CO-PA"], correctIndex: 1, explanation: "Profit Center = vue P&L (coûts + produits, calcul résultat opérationnel). Cost Center = coûts seulement. Le profit center est dérivable depuis le cost center, pas l'inverse." },
  { id: "exam-56", chapter: "Centres de profit (PCA)", question: "Dans S/4HANA, les rapports PCA :", options: ["Sont disponibles seulement après job de clôture nightly", "Sont en temps réel grâce à ACDOCA (chaque pièce porte le profit center)", "Nécessitent un export vers BW", "Ne fonctionnent pas en S/4HANA"], correctIndex: 1, explanation: "ACDOCA contient la dimension profit center pour chaque écriture. Reports temps réel sans pré-traitement. Énorme amélioration vs ECC où PCA était dans des tables séparées synchronisées." },
  { id: "exam-57", chapter: "Centres de profit (PCA)", question: "Le Transfer Pricing en SAP supporte combien de vues parallèles ?", options: ["1 (légale uniquement)", "3 vues : Légale (Currency Type 10), Groupe (30), Profit Center (50)", "2 vues : locale + groupe", "Illimité"], correctIndex: 1, explanation: "SAP gère 3 vues simultanées via Currency Types : 10 = devise locale légale, 30 = devise groupe (consolidation, élimination des marges intra-groupe), 50 = devise profit center (rentabilité interne)." },
  { id: "exam-58", chapter: "Centres de profit (PCA)", question: "Le Segment IFRS 8 en SAP :", options: ["Est un type de société", "Est une dimension de reporting obligatoire pour IFRS 8 (Segment Reporting), souvent dérivée du profit center", "Est uniquement pour la TVA", "Remplace le profit center"], correctIndex: 1, explanation: "Segment = dimension IFRS 8 Operating Segments. Obligatoire pour groupes cotés. Souvent dérivée du profit center via configuration. Présente dans ACDOCA pour reporting natif." },
  { id: "exam-59", chapter: "Centres de profit (PCA)", question: "L'Intercompany Reconciliation (F.2E) :", options: ["Lance la consolidation", "Compare les opérations entre sociétés du groupe et identifie les écarts pour qualité de la consolidation", "Crée des ordres internes", "Solde les centres de profit"], correctIndex: 1, explanation: "F.2E (ICR) compare les comptes intersociétés réciproques entre les sociétés du groupe. Identifie les écarts (montants, devises, dates). Étape clé avant la consolidation pour éviter les distorsions." },
  { id: "exam-60", chapter: "Centres de profit (PCA)", question: "Le S/4HANA Group Reporting (ex-BCS) :", options: ["Est un module externe", "Est l'outil natif de consolidation S/4HANA, basé sur ACDOCA + ACDOCU", "Remplace SAP HANA", "Est limité aux PME"], correctIndex: 1, explanation: "S/4HANA Group Reporting (anciennement BCS — Business Consolidation) consolide les comptes groupe directement sur ACDOCA + ACDOCU. Élimine les opérations intra-groupe, harmonise plans comptables. Remplace BPC pour les nouvelles implémentations." },
  // Ch5 — CO-PC (+5 questions)
  { id: "exam-61", chapter: "Calcul de coût (CO-PC)", question: "Le coût standard d'un produit fabriqué est calculé via :", options: ["MM01", "CK11N (individuel) ou CK40N (en masse)", "CO88", "F-02"], correctIndex: 1, explanation: "CK11N = calcul de coût individuel d'un matériau. CK40N = Product Cost Run en masse (annuel typiquement). Utilisent BOM (matières) + Routing (gamme) pour calculer le coût matières + transformation." },
  { id: "exam-62", chapter: "Calcul de coût (CO-PC)", question: "Mark and Release (CK24) en 2 étapes :", options: ["Crée 2 versions de coût", "Mark = inscrit le nouveau coût comme 'futur' (calculé pas appliqué), Release = bascule en coût standard 'actuel' applicable aux nouvelles entrées", "Solde et libère un ordre", "Marque le matériau comme libéré pour la vente"], correctIndex: 1, explanation: "Mark = saisie technique du coût futur (sans effet comptable immédiat). Release = activation officielle qui bascule le futur en actuel. Permet de découpler le calcul du coût et son application — important pour la cohérence comptable." },
  { id: "exam-63", chapter: "Calcul de coût (CO-PC)", question: "Les Production Variances (Écarts de Production) sont calculées par :", options: ["MIRO", "KKS1 (individuel) ou KKS2 (collectif)", "KSII", "F.05"], correctIndex: 1, explanation: "KKS1/KKS2 calculent les écarts d'un ordre de fabrication : Input Price, Input Quantity, Resource-Usage, Lot Size, Mixed Price. CO88 ensuite solde ces écarts vers CO-PA ou compte d'écart." },
  { id: "exam-64", chapter: "Calcul de coût (CO-PC)", question: "Le Material Ledger (ML) :", options: ["Est obligatoire dans toutes les implémentations", "Permet la valorisation parallèle multi-devises et l'Actual Costing (recalcul mensuel coût réel). Activé via OMX1", "Remplace BSEG", "Est uniquement pour le reporting"], correctIndex: 1, explanation: "ML (Material Ledger) : tenue parallèle des stocks en plusieurs devises/valorisations. Activation OMX1. Permet l'Actual Costing (CKMLCP) qui recalcule mensuellement le coût réel sur la base des écarts collectés." },
  { id: "exam-65", chapter: "Calcul de coût (CO-PC)", question: "L'Actual Costing (CKMLCP) :", options: ["Lance le calcul du coût standard annuel", "Recalcule le coût réel mensuel des produits en consolidant les écarts (Single-Level + Multi-Level Settlement)", "Lance le MRP", "Solde les centres de coûts"], correctIndex: 1, explanation: "CKMLCP (Closing Cockpit Material Ledger) orchestre l'Actual Costing : Selection → Determination Sequence → Single-Level → Multi-Level → Revaluation Consumption → Post Closing. Permet de revaloriser le stock final au coût réel constaté." },
  // Ch6 — CO-PA (+5 questions)
  { id: "exam-66", chapter: "CO-PA Profitability", question: "Costing-based vs Account-based CO-PA :", options: ["Identiques", "Costing = value fields legacy (ECC). Account = comptes GL via ACDOCA, recommandé S/4HANA", "Account-based n'existe plus", "Costing-based est plus performant"], correctIndex: 1, explanation: "Costing-based = stockage en value fields personnalisés (Net Revenue, COGS, Variances). Account-based = utilise comptes GL directement via ACDOCA. S/4HANA recommande Account-based pour cohérence FI-CO automatique. Souvent les deux en parallèle pendant migration." },
  { id: "exam-67", chapter: "CO-PA Profitability", question: "Les Caractéristiques (KEA5) en CO-PA :", options: ["Sont les comptes GL", "Sont les dimensions d'analyse : client, produit, région, canal de vente, etc.", "Sont les ordres de fabrication", "Sont les exercices fiscaux"], correctIndex: 1, explanation: "Characteristics CO-PA = dimensions d'analyse des marges. Standards (Customer, Product, Sales Org) ou customisées. Plus de characteristics = analyses fines mais volume plus important. Trade-off à arbitrer." },
  { id: "exam-68", chapter: "CO-PA Profitability", question: "La Dérivation (KEDR) en CO-PA :", options: ["Crée un nouveau client", "Remplit automatiquement les caractéristiques par règles (ex: client → région via fiche client)", "Calcule la TVA", "Lance le MRP"], correctIndex: 1, explanation: "KEDR = règles de dérivation automatique des caractéristiques. Critique pour qualité des données : sans dérivation, les pièces arriveraient en CO-PA sans dimensions complètes. Plusieurs étapes en cascade possibles." },
  { id: "exam-69", chapter: "CO-PA Profitability", question: "Le PA Transfer Structure (KE4I) :", options: ["Configure le transfert de fichiers", "Mappe les flux d'origine (SD, MM, CO-PC variances) vers les value fields CO-PA", "Définit la hiérarchie", "Configure les autorisations"], correctIndex: 1, explanation: "PA Transfer Structure = mapping critique : flux SD (revenus, remises), flux MM (COGS), écarts CO-PC → value fields CO-PA. Sans config correcte, les écarts arrivent au mauvais endroit ou pas du tout." },
  { id: "exam-70", chapter: "CO-PA Profitability", question: "Le Top-Down Distribution (KEC1) :", options: ["Lance le MRP top-down", "Ventile les coûts globaux (frais structure non affectés) par caractéristiques CO-PA, ex: refacturer siège aux régions selon CA", "Solde les ordres", "Lance la consolidation"], correctIndex: 1, explanation: "Top-Down Distribution permet de ventiler des coûts globaux (frais de siège, services centraux) sur les dimensions CO-PA. Permet d'avoir des marges complètes incluant les coûts de structure réaffectés. Essentiel pour le pilotage." },
  // Ch7 — Clôture & Allocations (+10 questions)
  { id: "exam-71", chapter: "Clôture CO", question: "Distribution (KSV5) vs Assessment (KSU5) :", options: ["Identiques", "Distribution = transfert primaire (compte d'origine conservé). Assessment = transfert secondaire via compte de cession (compte primaire masqué)", "Distribution est obsolète", "Assessment ne fonctionne plus en S/4"], correctIndex: 1, explanation: "Distribution conserve la nature primaire chez le receveur (utile traçabilité). Assessment transfère via un compte secondaire de cession (type 42) — masque le primaire mais plus flexible reporting. Assessment plus utilisé en pratique." },
  { id: "exam-72", chapter: "Clôture CO", question: "L'Indirect Activity Allocation (KSC5) est utilisée quand :", options: ["On connaît exactement les quantités d'activité consommées", "On ne peut pas mesurer directement les activités consommées et on utilise une clé de répartition (SKF, conso primaire)", "On lance la consolidation", "On crée un cycle"], correctIndex: 1, explanation: "Indirect Activity Allocation : on sait que la maintenance a fait 1000h au total mais on ne sait pas comment répartir entre clients internes. Une clé de répartition (statistical key figure ou poste primaire) ventile. Compte secondaire type 43." },
  { id: "exam-73", chapter: "Clôture CO", question: "Les Secondary Cost Elements en CO :", options: ["Sont dans le plan comptable FI", "Sont des comptes CO uniquement (type 42 Assessment, 43 Internal Activity Allocation), absents du plan FI", "Sont obsolètes", "Sont les comptes de la caisse"], correctIndex: 1, explanation: "Secondary Cost Elements = comptes CO uniquement utilisés pour les cessions internes. Type 42 = Assessment, type 43 = Internal Activity Allocation. Absents du plan comptable FI car n'existent qu'en analytique." },
  { id: "exam-74", chapter: "Clôture CO", question: "Le Closing Cockpit (CLOCO) en S/4HANA :", options: ["Est un cockpit d'avion", "Orchestrer l'ensemble des tâches de clôture mensuelle avec dépendances, owners, statuts. Template instancié à chaque clôture", "Lance uniquement le MRP", "Est limité à FI"], correctIndex: 1, explanation: "Closing Cockpit (CLOCO ou app Fiori 'Manage Closing') est l'orchestrateur multi-modules. Template avec tâches (programmes, apps Fiori), dépendances (A avant B), owners. Indispensable pour clôture rapide auditée (5-7 jours)." },
  { id: "exam-75", chapter: "Clôture CO", question: "L'ordre standard des étapes de clôture CO mensuelle :", options: ["Solde ordres → MRP → KSII", "MM closing → Allocations CC → KSII tarifs réels → ML CKMLCP → Solde ordres → Calcul écarts → Transfer CO-PA", "FI close en premier", "Aucun ordre prescrit"], correctIndex: 1, explanation: "Ordre critique : MM (MMPV) → Allocations CC (Distribution/Assessment) → KSII (tarifs réels) → ML (CKMLCP) → Solde ordres (KO8G/CO88) → KKS2 écarts → Transfer CO-PA. Certaines étapes consomment résultats des précédentes." },
  { id: "exam-76", chapter: "Clôture CO", question: "KSII calcule :", options: ["Les écarts de production", "Les tarifs d'activité réels en comparant coûts réels et quantités d'activité réelles", "Le coût standard", "Les variances MIRO"], correctIndex: 1, explanation: "KSII = recalcul des tarifs d'activité réels en clôture. Compare les coûts réels collectés sur le centre de coûts aux quantités d'activité réellement consommées. Permet d'ajuster la valorisation des prestations internes." },
  { id: "exam-77", chapter: "Clôture CO", question: "Les Production Variances soldées par CO88 vont :", options: ["Vers la trésorerie", "Vers CO-PA (analyse rentabilité) ou compte d'écart selon configuration", "Vers MM", "Vers les fournisseurs"], correctIndex: 1, explanation: "CO88 solde les écarts des ordres de fabrication. Selon paramétrage : vers CO-PA via PA Transfer Structure (analyse fine par caractéristique), ou vers compte d'écart de prix en GL. CO-PA est la cible privilégiée pour analyse." },
  { id: "exam-78", chapter: "Clôture CO", question: "Le 'Roll-up des écarts' dans Material Ledger :", options: ["Empile les écarts mensuels", "Propage les écarts depuis les matières premières vers les semi-finis et produits finis dans la nomenclature (Multi-Level Settlement)", "Annule les écarts", "Roll-up des comptes GL"], correctIndex: 1, explanation: "Multi-Level Settlement remonte la nomenclature : un écart sur matière première impacte le coût du semi-fini, qui impacte celui du produit fini. Permet une revalorisation cohérente sur toute la chaîne de valeur." },
  { id: "exam-79", chapter: "Clôture CO", question: "Le Cycle d'Allocation contient :", options: ["Uniquement le receveur", "Sender (envoyeur), Receiver (destinataire), Tracing Factor (clé de répartition)", "Uniquement la clé", "Le compte GL uniquement"], correctIndex: 1, explanation: "Cycle d'allocation (Distribution KSV1, Assessment KSU1) contient : Sender (CC source), Receiver (CC destinataires), Tracing Factor (SKF, poste réel, fixe). Exécutable périodiquement. Évolutif." },
  { id: "exam-80", chapter: "Clôture CO", question: "Le Tracing Factor d'un cycle :", options: ["Est toujours fixe", "Est la clé de répartition : SKF (m², têtes), montants réels d'un poste, ou portion fixe", "Est calculé par le MRP", "Est égal au montant total"], correctIndex: 1, explanation: "Tracing Factor = règle de répartition. Types : SKF (m² occupés, nb employés), montant réel d'un poste GL (consommation primaire), portion fixe. Détermine comment le sender répartit ses coûts vers les receivers." },
];
