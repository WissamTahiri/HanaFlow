/**
 * Contenu de la certification C_TS4FI_2023
 * SAP Certified Associate – SAP S/4HANA for Financial Accounting Associates
 *
 * Structure :
 * - 7 chapitres couvrant 100% du périmètre de l'examen officiel
 * - Leçons avec contenu pédagogique, concepts clés, T-codes
 * - Quiz de chapitre (8-10 questions chacun)
 * - 40 questions pour le simulateur d'examen (format réel)
 */

export const fiCertification = {
  id: "c-ts4fi-2023",
  code: "C_TS4FI_2023",
  name: "SAP Certified Associate – SAP S/4HANA for Financial Accounting",
  shortName: "SAP FI Certification",
  level: "Associate",
  examDuration: 180,       // minutes (examen réel)
  examQuestions: 80,       // questions (examen réel)
  simulatorQuestions: 40,  // questions disponibles dans notre simulateur
  passingScore: 65,        // % minimum pour réussir
  officialLink: "https://training.sap.com/certification/c_ts4fi_2023",
  color: "from-blue-900 via-blue-700 to-blue-500",

  chapters: [
    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 1 — Vue d'ensemble SAP S/4HANA Finance
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch1",
      number: 1,
      title: "Vue d'ensemble SAP S/4HANA Finance",
      weight: 8,
      isPremium: false,
      lessons: [
        {
          id: "l1-1",
          title: "Architecture SAP S/4HANA et Universal Journal",
          content: [
            "SAP S/4HANA est la 4ème génération de l'ERP de SAP, conçu pour fonctionner exclusivement sur la base de données en mémoire SAP HANA. Cette architecture \"In-Memory\" permet des traitements analytiques et transactionnels en temps réel, là où l'ancien système ECC nécessitait des batch jobs nocturnes.",
            "La révolution principale de S/4HANA Finance est le Universal Journal, stocké dans la table ACDOCA. Avant S/4HANA, les données financières étaient fragmentées dans plusieurs tables : BKPF/BSEG pour la comptabilité (FI), COBK/COEP pour le contrôle de gestion (CO), ANEP/ANEA pour les immobilisations (AA). Chaque module avait ses propres tables et une réconciliation périodique était nécessaire.",
            "Avec le Universal Journal, toutes ces dimensions — comptabilité financière, contrôle de gestion, comptabilité analytique, gestion des matières — sont enregistrées simultanément dans une seule table ACDOCA. Il n'y a plus de réconciliation FI-CO : les données sont cohérentes par construction.",
            "En pratique, cela signifie qu'une seule écriture comptable (par exemple, une facture fournisseur) génère automatiquement et simultanément les lignes FI (grand livre), CO (centres de coût), AA (si actif concerné) dans la même transaction. Le reporting en temps réel est immédiat sans attendre des agrégats ou des jobs de nuit."
          ],
          keyConcepts: [
            { term: "SAP HANA", definition: "Base de données en mémoire (In-Memory) de SAP. Traitement temps réel des données analytiques et transactionnelles." },
            { term: "Universal Journal (ACDOCA)", definition: "Table centrale de S/4HANA qui unifie FI, CO, AA, ML en une seule source de vérité. Remplace BKPF/BSEG+CO." },
            { term: "SAP ECC", definition: "Ancienne génération de SAP (ERP Central Component). Remplacée par S/4HANA. Données financières fragmentées dans plusieurs tables." },
            { term: "Réconciliation FI-CO", definition: "Processus qui n'existe plus dans S/4HANA grâce au Universal Journal. En ECC, les postes FI et CO devaient être régulièrement réconciliés." },
            { term: "In-Memory Computing", definition: "Technologie où les données sont stockées dans la RAM plutôt que sur disque. Vitesse de traitement 10 000× supérieure." },
          ],
          tcodes: [
            { code: "FB01", description: "Saisir une pièce comptable" },
            { code: "FB03", description: "Afficher une pièce comptable" },
            { code: "S_ALR_87012284", description: "Bilan et compte de résultat" },
          ],
        },
        {
          id: "l1-2",
          title: "Structure organisationnelle de SAP FI",
          content: [
            "SAP est organisé selon une hiérarchie d'entités organisationnelles. Comprendre cette structure est fondamental car elle détermine où et comment les données sont enregistrées dans le système.",
            "Le Mandant (Client) est le niveau le plus haut. C'est une instance SAP complète et autonome. Dans une installation typique, on a un mandant de production (ex: 100), un mandant de test (110) et un mandant de développement (120). Les données d'un mandant ne sont pas visibles depuis un autre mandant.",
            "La Société (Company Code) représente l'entité légale comptable. C'est à ce niveau qu'on tient la comptabilité légale : bilan, compte de résultat, grand livre. Une multinationale peut avoir une société par pays (ex: 1000=France, 2000=Allemagne, 3000=USA). Chaque société a sa propre devise de société, son propre plan comptable et son propre exercice comptable.",
            "Le Périmètre de contrôle de gestion (Controlling Area) regroupe une ou plusieurs sociétés pour le reporting analytique. Il est utilisé par le module CO. Une société doit être assignée à un périmètre pour que les coûts soient imputés.",
            "L'exercice comptable (Fiscal Year) définit la période comptable. Il peut être calendaire (janvier à décembre) ou décalé (ex: avril à mars comme en Grande-Bretagne). Il est divisé en périodes de comptabilisation (généralement 12 périodes + 4 périodes spéciales pour les écritures de clôture)."
          ],
          keyConcepts: [
            { term: "Mandant (Client)", definition: "Plus haut niveau organisationnel SAP. Instance indépendante avec ses propres données maître et paramètres. Ex: 100=Production." },
            { term: "Société (Company Code)", definition: "Entité légale comptable. Unité minimale de comptabilité indépendante. Tient son propre bilan et compte de résultat." },
            { term: "Périmètre de contrôle (Controlling Area)", definition: "Regroupe des sociétés pour le reporting CO. Doit être assigné pour l'imputation des coûts." },
            { term: "Exercice comptable (Fiscal Year)", definition: "Période annuelle de référence comptable. Calendaire ou décalé selon les obligations légales du pays." },
            { term: "Période de comptabilisation", definition: "Subdivision de l'exercice (généralement 1 mois). Contrôle quand les pièces peuvent être saisies (OB52)." },
            { term: "Devise de société", definition: "Devise de référence pour la comptabilité légale d'une société. Toutes les pièces sont converties dans cette devise." },
          ],
          tcodes: [
            { code: "OB52", description: "Gérer les périodes comptables ouvertes/fermées" },
            { code: "OBY6", description: "Copier des données de paramétrage société" },
            { code: "SPRO", description: "Accès à l'IMG (configuration SAP)" },
          ],
        },
      ],
      quiz: [
        {
          id: "q1-1",
          question: "Quel est le nom de la table centrale du Universal Journal dans SAP S/4HANA ?",
          options: ["BKPF", "BSEG", "ACDOCA", "FAGLFLEXT"],
          correctIndex: 2,
          explanation: "ACDOCA est la table du Universal Journal introduite avec SAP S/4HANA. Elle remplace la combinaison BKPF (en-tête de pièce) + BSEG (lignes de pièce) en unifiant FI, CO, AA et ML dans une seule table.",
        },
        {
          id: "q1-2",
          question: "Quelle est la principale innovation du Universal Journal par rapport à SAP ECC ?",
          options: [
            "Il supprime la comptabilité fournisseurs",
            "Il unifie FI, CO et AA en une seule source de données sans réconciliation",
            "Il ne supporte plus les devises étrangères",
            "Il remplace le plan comptable par des centres de coût",
          ],
          correctIndex: 1,
          explanation: "Le Universal Journal (ACDOCA) enregistre simultanément les dimensions FI, CO et AA dans une seule table. La réconciliation FI-CO n'est plus nécessaire car les données sont cohérentes par construction.",
        },
        {
          id: "q1-3",
          question: "Dans SAP, quel objet organisationnel représente l'entité légale comptable qui tient son propre bilan ?",
          options: ["Le mandant", "La division", "La société (Company Code)", "Le périmètre de contrôle"],
          correctIndex: 2,
          explanation: "La société (Company Code) est l'unité minimale de comptabilité légale indépendante dans SAP. Elle tient son propre bilan, compte de résultat et grand livre.",
        },
        {
          id: "q1-4",
          question: "Quel est le rôle du mandant (Client) dans SAP ?",
          options: [
            "Il représente une filiale de l'entreprise",
            "C'est le plus haut niveau organisationnel, indépendant, avec ses propres données",
            "Il correspond à un centre de coût",
            "Il est équivalent à une société comptable",
          ],
          correctIndex: 1,
          explanation: "Le mandant est le niveau le plus élevé dans SAP. Chaque mandant est une instance complète et indépendante. Les données ne sont pas partagées entre mandants (sauf certaines données de paramétrage).",
        },
        {
          id: "q1-5",
          question: "La transaction FB03 permet de :",
          options: [
            "Saisir une pièce comptable",
            "Afficher une pièce comptable",
            "Annuler une pièce comptable",
            "Comptabiliser une facture fournisseur",
          ],
          correctIndex: 1,
          explanation: "FB03 est la transaction d'affichage de pièce comptable (FB = Financial Accounting Basis, 03 = display). FB01 = créer, FB08 = contrepasser.",
        },
        {
          id: "q1-6",
          question: "Un exercice comptable (Fiscal Year) dans SAP FI peut être :",
          options: [
            "Uniquement calendaire (janvier à décembre)",
            "Calendaire ou décalé selon les obligations légales du pays",
            "Uniquement décalé (ex: avril à mars)",
            "Défini librement par l'utilisateur au moment de la saisie",
          ],
          correctIndex: 1,
          explanation: "L'exercice comptable peut être calendaire (jan-déc) ou décalé selon les exigences légales du pays (ex: avril-mars au Royaume-Uni). Il est configuré dans le paramétrage SAP.",
        },
        {
          id: "q1-7",
          question: "Combien de périodes spéciales peut-on avoir en plus des 12 périodes standard dans un exercice SAP FI ?",
          options: ["2 périodes spéciales", "4 périodes spéciales", "6 périodes spéciales", "Aucune — seules les 12 périodes standard existent"],
          correctIndex: 1,
          explanation: "SAP FI permet jusqu'à 4 périodes spéciales (13, 14, 15, 16) en plus des 12 périodes standard. Elles sont utilisées pour les écritures d'audit et de clôture annuelle après la fermeture des 12 périodes normales.",
        },
        {
          id: "q1-8",
          question: "Quel avantage principal la technologie In-Memory de SAP HANA apporte-t-elle pour la comptabilité ?",
          options: [
            "Elle réduit le coût des licences SAP",
            "Elle permet le reporting financier en temps réel sans batch jobs nocturnes",
            "Elle supprime le besoin d'un plan comptable",
            "Elle automatise la création des pièces comptables",
          ],
          correctIndex: 1,
          explanation: "SAP HANA stocke les données en RAM. Cela permet d'exécuter des analyses et rapports financiers en temps réel, éliminant le besoin de jobs de nuit pour agréger les données (comme les totaux de comptes dans FAGLFLEXT en ECC).",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 2 — Comptabilité Générale (GL Accounting)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch2",
      number: 2,
      title: "Comptabilité Générale (General Ledger)",
      weight: 24,
      isPremium: true,
      lessons: [
        {
          id: "l2-1",
          title: "Plan comptable et données maître des comptes GL",
          content: [
            "Le plan comptable (Chart of Accounts) est le répertoire de tous les comptes GL disponibles pour une société. Dans SAP, un plan comptable est défini au niveau mandant et est ensuite assigné à une ou plusieurs sociétés. Cela permet à plusieurs sociétés de partager le même plan comptable.",
            "Il existe trois types de plans comptables dans SAP : le plan comptable opérationnel (utilisé pour les transactions courantes), le plan comptable de pays (pour respecter les obligations légales locales, ex: PCGR France) et le plan comptable de groupe (pour la consolidation). Une société doit avoir un plan comptable opérationnel obligatoire, les deux autres sont optionnels.",
            "Un compte GL (General Ledger Account) contient deux niveaux de données : les données de plan comptable (numéro, libellé, type de compte) et les données de société (devise, gestion par solde ou par ligne de poste, groupe de compte). La transaction FS00 permet de gérer les deux niveaux simultanément.",
            "Les comptes GL peuvent être de type bilan (actif/passif — solde reporté d'un exercice à l'autre) ou de type résultat (charges/produits — solde remis à zéro en fin d'exercice avec report en capitaux propres). Un autre paramètre important est la gestion par ligne de poste (Postings displayed individually) versus par solde uniquement (Balance Only).",
            "Les comptes collectifs (Reconciliation Accounts) sont des comptes GL spéciaux liés aux clients ou fournisseurs. Tout mouvement sur un compte client/fournisseur est automatiquement reporté sur le compte GL de rapprochement correspondant. On ne peut pas saisir directement sur un compte collectif."
          ],
          keyConcepts: [
            { term: "Plan comptable opérationnel", definition: "Liste des comptes GL utilisés pour les transactions courantes. Assigné aux sociétés. Obligatoire." },
            { term: "Plan comptable de groupe", definition: "Permet la consolidation multi-sociétés. Chaque compte opérationnel peut être mappé vers un compte de groupe." },
            { term: "Compte GL (General Ledger)", definition: "Compte du grand livre. Enregistre tous les mouvements financiers d'une nature donnée (ex: banque, TVA, charges)." },
            { term: "Compte collectif (Reconciliation Account)", definition: "Compte GL spécial recevant automatiquement les mouvements clients ou fournisseurs. Ne peut pas être saisi directement." },
            { term: "Gestion par ligne de poste", definition: "Paramètre de compte GL permettant de voir chaque pièce individuellement (vs gestion par solde uniquement)." },
          ],
          tcodes: [
            { code: "FS00", description: "Créer/modifier/afficher un compte GL (données plan comptable + société)" },
            { code: "OBD4", description: "Définir les groupes de comptes GL" },
            { code: "OB13", description: "Créer un plan comptable" },
            { code: "FSP0", description: "Données de plan comptable uniquement" },
            { code: "FSS0", description: "Données de société uniquement" },
          ],
        },
        {
          id: "l2-2",
          title: "Saisie et gestion des pièces comptables",
          content: [
            "Une pièce comptable (Accounting Document) est l'enregistrement de toute transaction financière dans SAP FI. Elle est immuable une fois validée : pour la corriger, on doit la contrepasser (reverse) et saisir une nouvelle pièce.",
            "Chaque pièce comptable contient un en-tête (date de pièce, date de comptabilisation, type de pièce, société, devise, référence, texte d'en-tête) et des lignes de poste (numéro de compte, montant débit ou crédit, affectation, texte, centre de coût, etc.). La somme des débits doit toujours égaler la somme des crédits.",
            "Le type de pièce (Document Type) détermine le type de transaction : SA pour les écritures GL, KR pour les factures fournisseurs, KZ pour les paiements fournisseurs, DR pour les factures clients, DZ pour les encaissements. Chaque type de pièce utilise une plage de numéros dédiée.",
            "La transaction FB50 est utilisée pour les saisies GL directes (journal entries) — typiquement pour les provisions, les régularisations ou les écritures de régularisation. F-02 est l'ancien écran de saisie avec un écran structuré. Pour les factures fournisseurs (sans commande), on utilise FB60. Pour les factures clients (directes FI), on utilise FB70.",
            "La contrepassation d'une pièce (FB08) génère une pièce miroir avec les montants inversés, annulant l'effet de l'original. Dans S/4HANA, on peut aussi utiliser la contrepassation \"negative posting\" (postings with minus signs) pour ne pas gonfler les volumes de transactions."
          ],
          keyConcepts: [
            { term: "Type de pièce (Document Type)", definition: "Identifiant à 2 caractères qui classe la pièce comptable (SA=GL, KR=facture fourn., KZ=paiement fourn., DR=facture client)." },
            { term: "Date de pièce vs date de comptabilisation", definition: "Date de pièce = date de la facture originale. Date de comptabilisation = date à laquelle l'écriture entre dans les livres (détermine la période)." },
            { term: "Contrepassation (Reversal)", definition: "Annulation d'une pièce par création d'une pièce miroir inversée. La pièce originale reste visible mais est marquée comme contrepassée." },
            { term: "Clé de comptabilisation (Posting Key)", definition: "Code à 2 chiffres déterminant le côté (débit/crédit) et le type de compte. Ex: 40=débit GL, 50=crédit GL, 31=crédit fournisseur." },
          ],
          tcodes: [
            { code: "FB50", description: "Saisir une écriture GL (journal entry sans référence MM/SD)" },
            { code: "F-02", description: "Saisie comptable avec écran structuré (ancien écran)" },
            { code: "FB60", description: "Saisir une facture fournisseur (sans commande d'achat)" },
            { code: "FB70", description: "Saisir une facture client (directe FI)" },
            { code: "FB08", description: "Contrepasser une pièce comptable" },
            { code: "FBL3N", description: "Afficher les lignes de poste d'un compte GL" },
            { code: "FB03", description: "Afficher une pièce comptable" },
          ],
        },
      ],
      quiz: [
        {
          id: "q2-1",
          question: "Quelle transaction permet de créer et gérer un compte GL (données plan comptable + données société) en une seule transaction ?",
          options: ["FB01", "FS00", "FBL3N", "OB13"],
          correctIndex: 1,
          explanation: "FS00 est la transaction centrale pour la gestion des comptes GL dans SAP. Elle permet d'accéder aux données du plan comptable (FSP0) et aux données de société (FSS0) depuis un seul écran.",
        },
        {
          id: "q2-2",
          question: "Dans SAP FI, quels sont les deux types de plans comptables obligatoirement distincts ?",
          options: [
            "Plan comptable fournisseur et plan comptable client",
            "Plan comptable opérationnel et plan comptable de groupe",
            "Plan comptable fiscal et plan comptable légal",
            "Plan comptable national et plan comptable IFRS",
          ],
          correctIndex: 1,
          explanation: "Le plan comptable opérationnel est obligatoire et utilisé pour les transactions courantes. Le plan comptable de groupe est optionnel et sert à la consolidation. Le plan comptable de pays est une troisième option pour les besoins légaux locaux.",
        },
        {
          id: "q2-3",
          question: "Qu'est-ce qu'un compte collectif (Reconciliation Account) dans SAP FI ?",
          options: [
            "Un compte GL qui reçoit automatiquement tous les mouvements clients ou fournisseurs",
            "Un compte partagé entre plusieurs sociétés",
            "Un compte hors bilan pour les engagements",
            "Un compte temporaire pour les virements internes",
          ],
          correctIndex: 0,
          explanation: "Le compte collectif est un compte GL lié à des tiers (clients ou fournisseurs). Chaque mouvement sur un compte client/fournisseur est automatiquement reporté sur ce compte GL. On ne peut pas y saisir directement.",
        },
        {
          id: "q2-4",
          question: "Quelle transaction utilise-t-on pour saisir une écriture GL simple (provision, régularisation) dans SAP FI ?",
          options: ["FB60", "FB70", "FB50", "MIRO"],
          correctIndex: 2,
          explanation: "FB50 est la transaction pour les écritures GL directes (journal entries). FB60 = facture fournisseur, FB70 = facture client, MIRO = facture fournisseur avec référence à une commande d'achat.",
        },
        {
          id: "q2-5",
          question: "La règle fondamentale d'équilibre d'une pièce comptable dans SAP est :",
          options: [
            "Toutes les lignes doivent être de même montant",
            "La somme des débits doit égaler la somme des crédits",
            "Il doit y avoir au minimum 3 lignes de saisie",
            "Chaque ligne doit avoir un centre de coût",
          ],
          correctIndex: 1,
          explanation: "Une pièce comptable SAP doit toujours être équilibrée : somme des débits = somme des crédits. SAP ne permettra pas la validation d'une pièce déséquilibrée.",
        },
        {
          id: "q2-6",
          question: "Le type de pièce 'KR' dans SAP FI correspond à :",
          options: [
            "Un paiement fournisseur",
            "Une facture fournisseur",
            "Une facture client",
            "Une écriture GL",
          ],
          correctIndex: 1,
          explanation: "KR (Kreditor Rechnung = facture fournisseur en allemand). KZ = paiement fournisseur (Kreditor Zahlung). DR = facture client (Debitor Rechnung). DZ = paiement client. SA = écriture GL.",
        },
        {
          id: "q2-7",
          question: "La transaction FBL3N permet de :",
          options: [
            "Créer un compte GL",
            "Afficher les lignes de poste d'un compte GL",
            "Comptabiliser une facture fournisseur",
            "Exécuter la clôture mensuelle",
          ],
          correctIndex: 1,
          explanation: "FBL3N affiche la liste des lignes de poste (items) d'un compte GL. On peut filtrer par postes ouverts, soldés, ou tous. FBL1N = lignes fournisseurs, FBL5N = lignes clients.",
        },
        {
          id: "q2-8",
          question: "Pour annuler une pièce comptable dans SAP FI, on utilise :",
          options: [
            "FB01 avec les montants négatifs",
            "FB08 pour contrepasser (reverse) la pièce",
            "FS00 pour supprimer le compte",
            "OB52 pour fermer la période",
          ],
          correctIndex: 1,
          explanation: "FB08 contrepasse une pièce en créant une pièce miroir avec les montants inversés. La pièce originale reste visible et les deux sont liées. On ne peut pas supprimer une pièce validée dans SAP.",
        },
        {
          id: "q2-9",
          question: "Quelle est la différence entre la date de pièce et la date de comptabilisation dans SAP FI ?",
          options: [
            "Elles sont toujours identiques dans SAP S/4HANA",
            "La date de pièce est la date du document original, la date de comptabilisation détermine la période comptable",
            "La date de comptabilisation est toujours postérieure d'un mois à la date de pièce",
            "La date de pièce s'applique aux fournisseurs, la date de comptabilisation aux clients",
          ],
          correctIndex: 1,
          explanation: "La date de pièce correspond à la date de la facture ou du document original. La date de comptabilisation (posting date) détermine dans quelle période comptable l'écriture sera enregistrée — c'est elle qui compte pour les rapports financiers.",
        },
        {
          id: "q2-10",
          question: "Dans SAP S/4HANA, que se passe-t-il lorsqu'on valide une pièce FI avec une affectation à un centre de coût ?",
          options: [
            "L'écriture est enregistrée en FI uniquement, le CO est mis à jour par un batch nocturne",
            "L'écriture est enregistrée simultanément dans FI et CO grâce au Universal Journal",
            "Le système demande une confirmation manuelle en CO",
            "L'écriture reste en statut brouillon en attendant la validation CO",
          ],
          correctIndex: 1,
          explanation: "Grâce au Universal Journal (ACDOCA), une pièce FI avec affectation CO est enregistrée simultanément dans les deux modules en une seule transaction. Il n'y a plus de réconciliation FI-CO dans S/4HANA.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 3 — Comptabilité Fournisseurs (Accounts Payable)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch3",
      number: 3,
      title: "Comptabilité Fournisseurs (Accounts Payable)",
      weight: 16,
      isPremium: true,
      lessons: [
        {
          id: "l3-1",
          title: "Données maître fournisseurs et processus P2P",
          content: [
            "Dans SAP S/4HANA, la gestion des fournisseurs est basée sur le concept de Business Partner (BP). Le Business Partner remplace les anciennes transactions FK01/FK02/FK03. Un même BP peut avoir plusieurs rôles : fournisseur comptable (rôle FLVN01), partenaire achat (FLVN00), etc.",
            "Les données d'un fournisseur sont organisées en trois niveaux : données générales (au niveau mandant : nom, adresse, langue, banque), données comptables (au niveau société : compte collectif de rapprochement, conditions de paiement, mode de paiement) et données achat (au niveau organisation achat : incoterms, devise d'achat, groupe d'acheteurs).",
            "Le compte collectif de rapprochement (Reconciliation Account) est crucial : il s'agit d'un compte GL qui reçoit automatiquement tous les mouvements comptables du fournisseur. Chaque débit ou crédit sur le compte fournisseur est simultanément reporté sur ce compte GL. C'est ce qui permet de retrouver le solde fournisseur dans le grand livre.",
            "Le processus Purchase-to-Pay (P2P) suit la chaîne : Demande d'achat (ME51N) → Commande d'achat (ME21N) → Entrée marchandise (MIGO) → Réception facture (MIRO) → Paiement (F110). Ce processus intègre les modules MM (logistique) et FI (comptabilité)."
          ],
          keyConcepts: [
            { term: "Business Partner (BP)", definition: "Concept unifié dans S/4HANA remplaçant les fiches fournisseurs (FK01) et clients (FD01). Un BP peut avoir plusieurs rôles." },
            { term: "Processus P2P (Purchase-to-Pay)", definition: "Cycle complet de l'achat au paiement : demande → commande → réception → facture → paiement." },
            { term: "Compte collectif fournisseur", definition: "Compte GL recevant automatiquement tous les mouvements fournisseurs. Paramétré dans les données comptables du BP fournisseur." },
            { term: "Conditions de paiement", definition: "Paramètre définissant les délais de paiement (ex: 30 jours net, 10 jours avec 2% d'escompte). Valorisées dans la fiche fournisseur ou la facture." },
          ],
          tcodes: [
            { code: "BP", description: "Gérer les Business Partners (fournisseurs et clients)" },
            { code: "FK01", description: "Créer un fournisseur (ancienne transaction, remplacée par BP)" },
            { code: "FK03", description: "Afficher un fournisseur" },
            { code: "FBL1N", description: "Afficher les lignes de poste fournisseurs" },
          ],
        },
        {
          id: "l3-2",
          title: "Saisie de factures et paiements fournisseurs",
          content: [
            "Il existe deux façons principales de saisir une facture fournisseur dans SAP FI. La saisie directe (sans commande d'achat) utilise FB60 : on sélectionne le fournisseur, le montant, la TVA et le(s) compte(s) de charge à débiter. Cette méthode est utilisée pour les dépenses générales (loyers, honoraires, abonnements).",
            "La saisie avec référence à une commande d'achat utilise MIRO (Logistics Invoice Verification). Le système propose automatiquement les montants et les comptes en se basant sur la commande d'achat et l'entrée marchandise. Le rapprochement peut être à 2 voies (facture vs commande) ou à 3 voies (facture vs commande vs entrée marchandise — 3-way match). Ce dernier est la pratique recommandée pour un contrôle interne robuste.",
            "Le traitement automatique des paiements (Automatic Payment Run) est exécuté via la transaction F110. Le processus se déroule en plusieurs étapes : paramétrage de la proposition (dates, sociétés, fournisseurs concernés), génération de la proposition de paiement, contrôle et modification si nécessaire, exécution et génération des ordres de virement, impression des supports de paiement.",
            "Le lettrage (Clearing) est l'opération qui rapproche une facture ouverte avec son paiement, soldant les deux postes. La transaction F-44 permet le lettrage manuel. Le lettrage automatique est proposé par F110 lors du paiement. Un poste lettré n'apparaît plus dans la liste des postes ouverts (FBL1N avec filtre 'Open Items')."
          ],
          keyConcepts: [
            { term: "MIRO (Logistics Invoice Verification)", definition: "Transaction pour saisir les factures fournisseurs liées à une commande d'achat. Effectue le rapprochement 2 ou 3 voies." },
            { term: "Rapprochement 3 voies (3-way match)", definition: "Contrôle entre la facture, la commande d'achat et l'entrée marchandise. Pratique de contrôle interne recommandée." },
            { term: "Payment Run (F110)", definition: "Traitement automatique des paiements. Propose, contrôle et exécute les paiements fournisseurs selon les échéances." },
            { term: "Lettrage (Clearing)", definition: "Rapprochement d'une facture ouverte avec son paiement. Solde les deux postes qui disparaissent de la liste des postes ouverts." },
            { term: "Blocage de paiement", definition: "Indicateur sur la facture ou la fiche fournisseur empêchant le paiement automatique. Code B=Bloqué, R=En vérification." },
          ],
          tcodes: [
            { code: "FB60", description: "Saisir une facture fournisseur (sans commande d'achat)" },
            { code: "MIRO", description: "Vérification et comptabilisation facture fournisseur (avec commande)" },
            { code: "F110", description: "Traitement automatique des paiements (Payment Run)" },
            { code: "F-44", description: "Lettrage manuel des postes fournisseurs" },
            { code: "FBL1N", description: "Liste des lignes de poste fournisseurs" },
            { code: "MIR4", description: "Afficher un document MIRO" },
          ],
        },
      ],
      quiz: [
        {
          id: "q3-1",
          question: "Quelle transaction est utilisée pour saisir une facture fournisseur liée à une commande d'achat dans SAP ?",
          options: ["FB60", "MIRO", "F110", "FB70"],
          correctIndex: 1,
          explanation: "MIRO (Logistics Invoice Verification) est la transaction pour les factures fournisseurs avec référence à une commande d'achat. FB60 est utilisé pour les factures sans commande (saisie directe FI).",
        },
        {
          id: "q3-2",
          question: "La transaction F110 dans SAP FI est utilisée pour :",
          options: [
            "Afficher les soldes fournisseurs",
            "Créer des fiches fournisseurs",
            "Exécuter le traitement automatique des paiements (Payment Run)",
            "Lettrer manuellement les postes fournisseurs",
          ],
          correctIndex: 2,
          explanation: "F110 est la transaction du Payment Run (programme de paiement automatique). Elle propose, contrôle et exécute les paiements fournisseurs et clients selon les conditions de paiement et les échéances.",
        },
        {
          id: "q3-3",
          question: "Le lettrage (Clearing) d'un poste fournisseur consiste à :",
          options: [
            "Créer une nouvelle facture",
            "Rapprocher une facture ouverte avec son paiement, soldant les deux postes",
            "Bloquer un fournisseur pour paiement",
            "Transférer le solde fournisseur en GL",
          ],
          correctIndex: 1,
          explanation: "Le lettrage (clearing) est l'opération qui relie une facture à son paiement, soldant les deux postes ouverts. Après lettrage, les postes n'apparaissent plus dans FBL1N avec filtre 'postes ouverts'.",
        },
        {
          id: "q3-4",
          question: "Dans SAP S/4HANA, quel concept remplace les transactions FK01/FD01 pour la gestion des fournisseurs et clients ?",
          options: ["Company Code", "Business Partner (BP)", "Controlling Area", "Cost Center"],
          correctIndex: 1,
          explanation: "SAP S/4HANA a introduit le Business Partner (BP) comme objet unifié pour gérer les fournisseurs et clients. La transaction BP remplace FK01 (créer fournisseur) et FD01 (créer client).",
        },
        {
          id: "q3-5",
          question: "Qu'est-ce que le rapprochement à 3 voies (3-way match) dans le processus P2P ?",
          options: [
            "Rapprochement entre la facture, le client et le fournisseur",
            "Rapprochement entre la facture, la commande d'achat et l'entrée marchandise",
            "Rapprochement entre trois factures du même fournisseur",
            "Rapprochement entre la facture, le paiement et le relevé bancaire",
          ],
          correctIndex: 1,
          explanation: "Le 3-way match vérifie la cohérence entre (1) la facture reçue, (2) la commande d'achat et (3) l'entrée marchandise (Good Receipt). C'est une bonne pratique de contrôle interne pour éviter les paiements indus.",
        },
        {
          id: "q3-6",
          question: "La transaction FBL1N dans SAP FI permet de :",
          options: [
            "Créer un fournisseur",
            "Afficher les lignes de poste fournisseurs (ouverts, soldés, ou tous)",
            "Saisir une facture fournisseur",
            "Exécuter le paiement automatique",
          ],
          correctIndex: 1,
          explanation: "FBL1N (Financial Accounting Balance Line 1 N=many) affiche les lignes de poste fournisseurs. On peut filtrer par postes ouverts, soldés ou tous. L'équivalent pour les clients est FBL5N, pour le GL c'est FBL3N.",
        },
        {
          id: "q3-7",
          question: "Dans le contexte du compte collectif fournisseur, quelle affirmation est correcte ?",
          options: [
            "On peut saisir directement sur un compte collectif via FB50",
            "Le compte collectif reçoit automatiquement les mouvements fournisseurs sans saisie manuelle",
            "Le compte collectif est optionnel pour les fournisseurs",
            "Il peut y avoir un seul compte collectif pour tous les fournisseurs d'une société",
          ],
          correctIndex: 1,
          explanation: "Le compte collectif reçoit automatiquement et simultanément tous les mouvements du compte fournisseur dans le grand livre. On ne peut pas y saisir directement (SAP bloque la saisie). Il est obligatoire pour chaque fournisseur.",
        },
        {
          id: "q3-8",
          question: "Le processus Purchase-to-Pay (P2P) dans SAP suit quel ordre ?",
          options: [
            "Facture → Commande → Entrée marchandise → Paiement",
            "Demande d'achat → Commande → Entrée marchandise → Facture → Paiement",
            "Commande → Paiement → Livraison → Facture",
            "Facture → Paiement → Commande → Livraison",
          ],
          correctIndex: 1,
          explanation: "Le processus P2P suit la logique métier : (1) Demande d'achat (ME51N), (2) Commande d'achat (ME21N), (3) Entrée marchandise/réception (MIGO), (4) Facture fournisseur (MIRO), (5) Paiement (F110).",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 4 — Comptabilité Clients (Accounts Receivable)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch4",
      number: 4,
      title: "Comptabilité Clients (Accounts Receivable)",
      weight: 16,
      isPremium: true,
      lessons: [
        {
          id: "l4-1",
          title: "Données maître clients et processus O2C",
          content: [
            "Les données maître clients suivent la même logique que les fournisseurs : elles sont gérées via le Business Partner (BP) dans S/4HANA. Un client a des données générales (mandant), des données comptables (société) et des données SD (organisation commerciale).",
            "Les données comptables du client comprennent le compte collectif de rapprochement (Accounts Receivable reconciliation account), les conditions de paiement, la tolérance de paiement, la gestion des relances (dunning procedure) et la limite de crédit (credit limit).",
            "Le processus Order-to-Cash (O2C) suit la chaîne : Commande client (VA01, module SD) → Livraison (VL01N) → Facturation SD (VF01) → Encaissement (F-28) → Lettrage. La facture SD génère automatiquement une pièce FI (débit client, crédit produit et TVA). L'intégration SD-FI est automatique.",
            "La gestion du risque crédit est une composante importante de la comptabilité clients. SAP FI-AR permet de définir des limites de crédit par client, de paramétrer des procédures de relance automatique (Dunning) et de générer des relevés de compte clients."
          ],
          keyConcepts: [
            { term: "Processus O2C (Order-to-Cash)", definition: "Cycle complet de la commande à l'encaissement : commande client → livraison → facturation → paiement → lettrage." },
            { term: "Procédure de relance (Dunning)", definition: "Processus automatique d'envoi de lettres de relance aux clients ayant des postes ouverts en retard. Paramétré par niveaux d'escalade." },
            { term: "Limite de crédit (Credit Limit)", definition: "Montant maximum d'encours autorisé pour un client. Déclenche un blocage livraison si dépassé." },
            { term: "Tolérance de paiement", definition: "Écart accepté entre le montant payé et le montant dû pour le lettrage automatique (ex: ±0,01€)." },
          ],
          tcodes: [
            { code: "BP", description: "Gérer les Business Partners (clients et fournisseurs)" },
            { code: "FD03", description: "Afficher un client (ancienne transaction)" },
            { code: "FBL5N", description: "Afficher les lignes de poste clients" },
            { code: "F150", description: "Exécuter la procédure de relance (Dunning Run)" },
          ],
        },
        {
          id: "l4-2",
          title: "Facturation client et encaissements",
          content: [
            "Dans SAP, les factures clients peuvent être créées de deux façons. La voie SD (recommandée pour les ventes de produits/services) utilise VF01 qui génère automatiquement la pièce FI correspondante. La voie FI directe utilise FB70 pour des factures sans référence SD (ex: refacturation interne, pénalités).",
            "L'encaissement d'un paiement client est enregistré via F-28 (saisie d'un encaissement entrant). On saisit le montant reçu, le compte banque débité, et on sélectionne les postes clients à lettrer. SAP propose automatiquement les factures ouvertes correspondant au montant.",
            "Les avoirs clients (Credit Memos) sont utilisés pour annuler partiellement ou totalement une facture. En FI direct : FB75 (avoir client). Via SD : créer un document d'avoir SD (VA01 avec type d'ordre RE). L'avoir réduit le solde ouvert du client.",
            "La transaction F.32 permet le lettrage automatique de masse des postes clients (pour les paiements déjà enregistrés sur le compte bancaire mais pas encore lettrés). F-32 est le lettrage manuel client interactif.",
            "Les relances clients (Dunning) sont gérées via F150. La procédure de relance définit les niveaux d'escalade (1=rappel, 2=lettre de relance, 3=mise en demeure) et les intérêts de retard applicables. F150 génère les courriers automatiquement."
          ],
          keyConcepts: [
            { term: "VF01", description: "Transaction SD pour créer une facture client. Génère automatiquement la pièce FI correspondante." },
            { term: "F-28", description: "Transaction pour enregistrer un encaissement client entrant et lettrer les postes ouverts." },
            { term: "Avoir client (Credit Memo)", description: "Document annulant partiellement ou totalement une facture client. Réduit le solde dû." },
            { term: "Lettrage (Clearing)", description: "Rapprochement d'une facture avec son encaissement. Les deux postes sont soldés." },
          ],
          tcodes: [
            { code: "FB70", description: "Saisir une facture client (directe FI, sans référence SD)" },
            { code: "VF01", description: "Créer une facture SD (intégration automatique avec FI)" },
            { code: "F-28", description: "Enregistrer un encaissement client" },
            { code: "FBL5N", description: "Afficher les lignes de poste clients" },
            { code: "F-32", description: "Lettrage manuel des postes clients" },
            { code: "F150", description: "Exécuter le programme de relance (Dunning Run)" },
          ],
        },
      ],
      quiz: [
        {
          id: "q4-1",
          question: "La transaction F-28 dans SAP FI est utilisée pour :",
          options: [
            "Saisir une facture client",
            "Enregistrer un encaissement client entrant",
            "Créer un avoir client",
            "Bloquer un compte client",
          ],
          correctIndex: 1,
          explanation: "F-28 (Incoming Payments) enregistre les paiements reçus des clients. On saisit le montant, le compte bancaire et on sélectionne les factures ouvertes à lettrer.",
        },
        {
          id: "q4-2",
          question: "Le processus O2C (Order-to-Cash) implique l'intégration de quels modules SAP ?",
          options: ["FI et MM", "FI et SD (Sales & Distribution)", "FI et CO", "FI et HCM"],
          correctIndex: 1,
          explanation: "O2C intègre SD (pour la commande client, la livraison et la facturation) avec FI (pour la comptabilisation automatique de la facture et l'enregistrement du paiement). C'est l'intégration SD-FI.",
        },
        {
          id: "q4-3",
          question: "Quelle transaction permet d'afficher les lignes de poste clients dans SAP FI ?",
          options: ["FBL1N", "FBL3N", "FBL5N", "FBL7N"],
          correctIndex: 2,
          explanation: "FBL5N affiche les lignes de poste clients (5=Debitoren en allemand). FBL1N = fournisseurs (1=Kreditoren), FBL3N = comptes GL (3=Sachkonten).",
        },
        {
          id: "q4-4",
          question: "Un avoir client (Credit Memo) dans SAP FI sert à :",
          options: [
            "Créer une nouvelle facture supplémentaire",
            "Annuler partiellement ou totalement une facture client déjà émise",
            "Enregistrer un acompte client",
            "Bloquer les livraisons futures",
          ],
          correctIndex: 1,
          explanation: "L'avoir client (Credit Memo) réduit le montant dû par le client. Il est utilisé pour les retours marchandise, les remises accordées après facturation ou les corrections de factures.",
        },
        {
          id: "q4-5",
          question: "La procédure de relance (Dunning) dans SAP FI permet de :",
          options: [
            "Calculer automatiquement les intérêts bancaires",
            "Envoyer automatiquement des lettres de relance aux clients en retard de paiement",
            "Bloquer automatiquement tous les comptes clients inactifs",
            "Générer les factures clients périodiques",
          ],
          correctIndex: 1,
          explanation: "La procédure de relance (Dunning) génère automatiquement des courriers de relance pour les clients ayant des postes ouverts en retard. Elle est paramétrée par niveaux d'escalade (rappel → relance → mise en demeure).",
        },
        {
          id: "q4-6",
          question: "Quelle transaction SD génère automatiquement une pièce comptable FI lors de la facturation client ?",
          options: ["VA01 (commande client)", "VL01N (livraison)", "VF01 (facture SD)", "ME21N (commande achat)"],
          correctIndex: 2,
          explanation: "VF01 crée la facture SD et génère simultanément la pièce FI correspondante (débit compte client, crédit compte produit + TVA). C'est l'intégration automatique SD→FI.",
        },
        {
          id: "q4-7",
          question: "La limite de crédit client dans SAP est utilisée pour :",
          options: [
            "Définir la remise maximale accordée au client",
            "Contrôler l'encours client et bloquer les livraisons en cas de dépassement",
            "Paramétrer le mode de paiement préféré",
            "Calculer les intérêts de retard",
          ],
          correctIndex: 1,
          explanation: "La limite de crédit définit le montant maximum d'encours autorisé pour un client. Si dépassée, SAP peut bloquer la livraison ou la facturation selon le paramétrage (gestion du risque crédit).",
        },
        {
          id: "q4-8",
          question: "Pour saisir directement une facture client en FI (sans référence SD), on utilise :",
          options: ["VF01", "FB70", "F-28", "FBL5N"],
          correctIndex: 1,
          explanation: "FB70 permet de saisir une facture client directement en FI sans passer par SD. Utile pour les refacturations internes, les pénalités ou les situations sans processus commercial.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 5 — Comptabilité des Immobilisations (Asset Accounting)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch5",
      number: 5,
      title: "Comptabilité des Immobilisations (Asset Accounting)",
      weight: 12,
      isPremium: true,
      lessons: [
        {
          id: "l5-1",
          title: "Données maître et acquisitions d'immobilisations",
          content: [
            "La comptabilité des immobilisations (Asset Accounting, FI-AA) gère le cycle de vie complet des actifs immobilisés : de l'acquisition jusqu'à la cession. Chaque immobilisation est définie par une fiche maître (Asset Master Record) qui contient les informations descriptives et les paramètres de valorisation.",
            "La classe d'immobilisation (Asset Class) est un paramètre central. Elle détermine le compte GL d'immobilisation associé, les zones d'évaluation applicables, les méthodes d'amortissement par défaut et la durée de vie par défaut. Exemples de classes : matériel informatique, véhicules, constructions, brevets.",
            "Les zones d'évaluation (Depreciation Areas) permettent d'évaluer une immobilisation selon plusieurs référentiels comptables simultanément : comptabilité locale (GAAP), IFRS, fiscale. Chaque zone peut avoir sa propre méthode et durée d'amortissement. SAP calcule et comptabilise automatiquement les amortissements dans chaque zone.",
            "Pour acquérir une immobilisation via une commande d'achat, le processus passe par MM (ME21N → MIGO → MIRO). La comptabilisation en AA est automatique lors de la réception facture MIRO. Pour une acquisition directe sans commande, on utilise F-90 (débit compte d'immobilisation, crédit fournisseur ou compte de charge)."
          ],
          keyConcepts: [
            { term: "Classe d'immobilisation", definition: "Catégorie groupant des immobilisations de même nature. Détermine les comptes GL, méthodes et durées d'amortissement par défaut." },
            { term: "Zone d'évaluation (Depreciation Area)", definition: "Référentiel comptable parallèle pour une immobilisation (ex: IFRS, fiscal, local GAAP). Chaque zone peut avoir des paramètres différents." },
            { term: "Durée d'utilisation (Useful Life)", definition: "Durée en années sur laquelle l'immobilisation est amortie. Paramètre de la fiche immobilisation." },
            { term: "Valeur brute vs VNC", definition: "Valeur brute = coût historique d'acquisition. VNC (Valeur Nette Comptable) = valeur brute - amortissements cumulés." },
          ],
          tcodes: [
            { code: "AS01", description: "Créer une fiche immobilisation" },
            { code: "AS02", description: "Modifier une fiche immobilisation" },
            { code: "AS03", description: "Afficher une fiche immobilisation" },
            { code: "F-90", description: "Acquisition d'immobilisation (saisie directe FI)" },
            { code: "AW01N", description: "Asset Explorer : afficher les valeurs et mouvements d'une immobilisation" },
          ],
        },
        {
          id: "l5-2",
          title: "Amortissements et cessions",
          content: [
            "L'amortissement est la répartition du coût d'une immobilisation sur sa durée de vie utile. Dans SAP FI-AA, les amortissements sont calculés automatiquement selon les paramètres de la fiche immobilisation et sont comptabilisés par le programme AFAB.",
            "Les principales méthodes d'amortissement sont : linéaire (même montant chaque période, ex: 1000€/an sur 5 ans = 200€/an), dégressif (pourcentage appliqué à la VNC, donne un amortissement plus élevé les premières années), ou selon unités de production (amortissement proportionnel à l'utilisation).",
            "AFAB est exécuté périodiquement (généralement chaque mois lors de la clôture). Il peut être exécuté en mode test (pour vérifier les montants sans comptabiliser), en mode planifié (pour la première exécution de la période) ou en mode répétitif (si une erreur doit être corrigée et AFAB réexécuté).",
            "La cession (retirement) d'une immobilisation intervient quand elle est vendue, détruite ou mise au rebut. SAP génère automatiquement les écritures : sortie de la valeur brute et des amortissements cumulés, comptabilisation de la plus-value ou moins-value. La mise au rebut (scrap, ABAVN) est la cession sans produit de cession. La cession avec vente utilise F-92 ou ABAON.",
            "Le transfert d'immobilisation (ABUMN) est utilisé quand une immobilisation change de classe, de centre de coût ou de société. Un transfert intra-société déplace l'immobilisation entre entités organisationnelles sans sortie du bilan."
          ],
          keyConcepts: [
            { term: "AFAB", definition: "Programme de traitement des amortissements. Calcule et comptabilise les dotations aux amortissements périodiquement." },
            { term: "Amortissement linéaire", definition: "Méthode d'amortissement : même montant chaque période sur toute la durée de vie. Plus simple et la plus courante." },
            { term: "Amortissement dégressif", definition: "Pourcentage appliqué à la VNC résiduelle. Donne des dotations plus élevées en début de vie et plus faibles en fin." },
            { term: "Mise au rebut (ABAVN)", definition: "Cession d'immobilisation sans produit de vente (destruction, rebut). SAP comptabilise la perte résiduelle." },
            { term: "AW01N (Asset Explorer)", definition: "Transaction permettant de voir tous les mouvements, valeurs et amortissements d'une immobilisation de façon synthétique." },
          ],
          tcodes: [
            { code: "AFAB", description: "Exécuter le traitement des amortissements (mensuel)" },
            { code: "ABAVN", description: "Mise au rebut (scrap) d'une immobilisation" },
            { code: "ABAON", description: "Cession d'immobilisation avec produit de vente" },
            { code: "ABUMN", description: "Transfert d'immobilisation inter-classe ou inter-société" },
            { code: "AR01", description: "Générer le registre des immobilisations" },
          ],
        },
      ],
      quiz: [
        {
          id: "q5-1",
          question: "La transaction AS01 dans SAP FI est utilisée pour :",
          options: [
            "Afficher une immobilisation",
            "Créer une fiche immobilisation (Asset Master Record)",
            "Comptabiliser un amortissement",
            "Céder une immobilisation",
          ],
          correctIndex: 1,
          explanation: "AS01 crée la fiche maître d'une immobilisation (Asset = AS, 01 = create). AS02 = modifier, AS03 = afficher. C'est l'équivalent de FS00 pour les comptes GL.",
        },
        {
          id: "q5-2",
          question: "La valeur nette comptable (VNC) d'une immobilisation est calculée comme :",
          options: [
            "Coût d'acquisition + amortissements cumulés",
            "Coût d'acquisition - amortissements cumulés",
            "Prix de marché actuel",
            "Valeur de remplacement estimée",
          ],
          correctIndex: 1,
          explanation: "VNC (Net Book Value / NBV) = Coût historique d'acquisition - Amortissements cumulés. Elle représente la valeur résiduelle comptable de l'immobilisation à une date donnée.",
        },
        {
          id: "q5-3",
          question: "La transaction AFAB dans SAP FI est utilisée pour :",
          options: [
            "Créer une immobilisation",
            "Afficher les amortissements futurs",
            "Exécuter le traitement périodique des amortissements",
            "Céder une immobilisation",
          ],
          correctIndex: 2,
          explanation: "AFAB (Asset Accounting Fixed Assets) exécute le programme de calcul et comptabilisation des amortissements. Il est généralement exécuté mensuellement lors de la clôture comptable.",
        },
        {
          id: "q5-4",
          question: "Qu'est-ce qu'une zone d'évaluation (Depreciation Area) dans SAP AA ?",
          options: [
            "La localisation physique de l'immobilisation",
            "Un référentiel comptable parallèle permettant d'évaluer l'immobilisation selon plusieurs normes (IFRS, fiscal, local)",
            "Le centre de coût auquel l'immobilisation est affectée",
            "La plage de numéros d'immobilisation autorisée",
          ],
          correctIndex: 1,
          explanation: "Une zone d'évaluation permet d'amortir une même immobilisation selon plusieurs référentiels comptables simultanément. Par exemple, une immobilisation peut avoir une durée de 5 ans en IFRS et 3 ans en droit fiscal local.",
        },
        {
          id: "q5-5",
          question: "La transaction ABAVN dans SAP FI-AA correspond à :",
          options: [
            "La création d'une immobilisation",
            "La mise au rebut (scrap) d'une immobilisation sans produit de cession",
            "Le transfert d'une immobilisation entre classes",
            "Le calcul d'amortissement spécial",
          ],
          correctIndex: 1,
          explanation: "ABAVN (Asset Retirement by Scrapping) comptabilise la mise au rebut d'une immobilisation sans produit de vente. SAP génère les écritures de sortie du bilan et de comptabilisation de la perte résiduelle.",
        },
        {
          id: "q5-6",
          question: "L'amortissement linéaire dans SAP FI-AA signifie :",
          options: [
            "L'amortissement varie chaque année selon la valeur résiduelle",
            "Le même montant d'amortissement est calculé chaque période sur la durée de vie",
            "L'amortissement est calculé sur le prix de marché actuel",
            "Aucun amortissement n'est appliqué en première année",
          ],
          correctIndex: 1,
          explanation: "L'amortissement linéaire (Straight-Line Method) divise le coût d'acquisition par la durée de vie. On obtient le même montant d'amortissement chaque période, ce qui simplifie la planification financière.",
        },
        {
          id: "q5-7",
          question: "AW01N (Asset Explorer) est utilisé pour :",
          options: [
            "Créer des classes d'immobilisations",
            "Voir de façon synthétique tous les mouvements, valeurs et amortissements d'une immobilisation",
            "Exécuter le programme d'amortissement",
            "Générer le registre des immobilisations",
          ],
          correctIndex: 1,
          explanation: "AW01N (Asset Workbench) permet d'explorer une fiche immobilisation avec toutes ses valeurs, mouvements et amortissements planifiés. C'est l'outil principal pour analyser une immobilisation en détail.",
        },
        {
          id: "q5-8",
          question: "Lors d'une cession d'immobilisation avec plus-value, SAP FI-AA :",
          options: [
            "Ne génère aucune écriture automatiquement",
            "Génère automatiquement les écritures de sortie d'actif et de plus-value",
            "Nécessite une saisie manuelle de toutes les écritures",
            "Ignore la plus-value qui doit être saisie séparément",
          ],
          correctIndex: 1,
          explanation: "SAP FI-AA génère automatiquement les écritures lors d'une cession : sortie de la valeur brute, annulation des amortissements cumulés, et comptabilisation de la plus ou moins-value selon la différence entre VNC et prix de cession.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 6 — Gestion de Trésorerie (Bank Accounting)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch6",
      number: 6,
      title: "Gestion de Trésorerie (Bank Accounting)",
      weight: 8,
      isPremium: true,
      lessons: [
        {
          id: "l6-1",
          title: "Configuration bancaire et rapprochement",
          content: [
            "La gestion bancaire dans SAP FI repose sur la notion de banque maison (House Bank). Une banque maison représente l'établissement bancaire avec lequel l'entreprise travaille. À chaque banque maison correspond un ou plusieurs comptes bancaires (Account IDs), chacun ayant un compte GL associé.",
            "La configuration des banques maison se fait via FI12. Pour chaque banque, on saisit les coordonnées bancaires (IBAN, BIC/SWIFT, numéro de compte) et on les associe à un compte GL dans le grand livre. Ce compte GL est débité lors des encaissements et crédité lors des décaissements.",
            "Le relevé bancaire électronique (Electronic Bank Statement) est importé dans SAP via la transaction FF67 ou automatiquement via FEBAN. SAP supporte plusieurs formats standards : MT940 (format SWIFT international), CAMT.053 (format XML ISO 20022 de plus en plus répandu en Europe), BAI2 (format américain).",
            "Le rapprochement bancaire (Bank Reconciliation) consiste à vérifier que les mouvements enregistrés dans SAP correspondent exactement au relevé bancaire réel. Le programme FEBP (Post Electronic Bank Statement) tente de lettrer automatiquement les transactions SAP avec les lignes du relevé bancaire. Les exceptions non lettrées automatiquement sont traitées manuellement.",
            "La gestion de trésorerie (Cash Management) dans SAP FI-TR permet de suivre les liquidités disponibles et les prévisions de flux de trésorerie. La transaction FF7A affiche la situation de trésorerie (cash position) : soldes bancaires actuels + encaissements/décaissements attendus."
          ],
          keyConcepts: [
            { term: "Banque maison (House Bank)", definition: "Établissement bancaire de l'entreprise configuré dans SAP (FI12). Associé à un compte GL." },
            { term: "MT940 / CAMT.053", definition: "Formats de relevés bancaires électroniques. MT940 = format SWIFT, CAMT.053 = format XML ISO 20022 (standard européen actuel)." },
            { term: "FEBP (Post Electronic Bank Statement)", definition: "Programme SAP qui tente de lettrer automatiquement les lignes du relevé bancaire avec les transactions SAP." },
            { term: "Cash Position (FF7A)", definition: "Vue en temps réel des soldes bancaires et des flux de trésorerie attendus à court terme." },
          ],
          tcodes: [
            { code: "FI12", description: "Configurer les banques maison (House Banks)" },
            { code: "FF67", description: "Saisir et traiter un relevé bancaire manuellement" },
            { code: "FEBP", description: "Comptabiliser automatiquement un relevé bancaire électronique" },
            { code: "FF7A", description: "Afficher la situation de trésorerie (Cash Position)" },
            { code: "FEBAN", description: "Importer des relevés bancaires électroniques" },
          ],
        },
      ],
      quiz: [
        {
          id: "q6-1",
          question: "La transaction FI12 dans SAP FI est utilisée pour :",
          options: [
            "Saisir une écriture bancaire",
            "Configurer les données des banques maison (House Banks)",
            "Effectuer un virement externe",
            "Afficher le solde de trésorerie",
          ],
          correctIndex: 1,
          explanation: "FI12 permet de configurer les banques maison : coordonnées bancaires (IBAN, BIC), numéros de compte et association avec les comptes GL. C'est la configuration de base pour tout traitement bancaire dans SAP.",
        },
        {
          id: "q6-2",
          question: "Le format CAMT.053 dans SAP FI correspond à :",
          options: [
            "Un format propriétaire SAP pour les relevés bancaires",
            "Le format XML ISO 20022 pour les relevés bancaires, standard européen actuel",
            "Le format américain BAI2",
            "Un format PDF de relevé bancaire",
          ],
          correctIndex: 1,
          explanation: "CAMT.053 est le format XML basé sur la norme ISO 20022, de plus en plus utilisé en Europe pour les relevés bancaires électroniques. Il remplace progressivement MT940 (format SWIFT).",
        },
        {
          id: "q6-3",
          question: "La transaction FEBP dans SAP FI sert à :",
          options: [
            "Créer un compte bancaire maison",
            "Comptabiliser automatiquement les lignes d'un relevé bancaire électronique",
            "Planifier les paiements futurs",
            "Générer un rapport de trésorerie mensuel",
          ],
          correctIndex: 1,
          explanation: "FEBP (Post Electronic Bank Statement) est le programme de traitement automatique des relevés bancaires. Il tente de lettrer chaque ligne du relevé avec les transactions SAP existantes selon des règles de rapprochement configurées.",
        },
        {
          id: "q6-4",
          question: "Dans SAP Cash Management, que montre la transaction FF7A ?",
          options: [
            "La localisation des coffres-forts de l'entreprise",
            "La situation de trésorerie : soldes bancaires actuels et flux attendus à court terme",
            "Le solde comptable du grand livre banque",
            "La limite de découvert autorisée par la banque",
          ],
          correctIndex: 1,
          explanation: "FF7A (Cash Position) affiche les soldes bancaires actuels et intègre les flux de trésorerie attendus (paiements planifiés, encaissements attendus). C'est un outil clé pour la gestion de la liquidité à court terme.",
        },
        {
          id: "q6-5",
          question: "Une banque maison (House Bank) dans SAP FI représente :",
          options: [
            "Un fournisseur bancaire externe à l'entreprise",
            "La banque de l'entreprise avec laquelle elle travaille, associée à un compte GL",
            "Un compte bancaire client",
            "Un type de paiement spécial pour les banques étrangères",
          ],
          correctIndex: 1,
          explanation: "Une House Bank est l'établissement bancaire de l'entreprise configuré dans SAP. Chaque compte bancaire est associé à un compte GL qui enregistre les mouvements comptables correspondants.",
        },
        {
          id: "q6-6",
          question: "Le rapprochement bancaire dans SAP consiste à :",
          options: [
            "Créer de nouveaux comptes bancaires dans SAP",
            "Vérifier la concordance entre les mouvements SAP et le relevé bancaire, puis lettrer les postes correspondants",
            "Transférer automatiquement des fonds entre banques",
            "Calculer les frais bancaires mensuels",
          ],
          correctIndex: 1,
          explanation: "Le rapprochement bancaire compare les transactions enregistrées dans SAP avec le relevé bancaire de la banque. FEBP automatise ce processus en lettrant les correspondances et en isolant les écarts à traiter manuellement.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 7 — Opérations de Clôture (Closing Operations)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch7",
      number: 7,
      title: "Opérations de Clôture",
      weight: 16,
      isPremium: true,
      lessons: [
        {
          id: "l7-1",
          title: "Clôture mensuelle et annuelle",
          content: [
            "La clôture mensuelle (Period-End Closing) est l'ensemble des traitements comptables exécutés à la fin de chaque période pour s'assurer que les comptes reflètent fidèlement la situation financière. Dans SAP FI, cette clôture suit un ordre précis de traitements.",
            "L'ordre recommandé pour la clôture mensuelle est : (1) Fermeture des périodes MM (MMPV — empêcher de nouvelles entrées marchandise dans l'ancienne période), (2) Calcul et comptabilisation des amortissements (AFAB), (3) Réévaluation des postes en devises étrangères (F.05), (4) Comptabilisation des provisions (accruals) et régularisations (deferrals), (5) Lettrage des postes inter-sociétés, (6) Fermeture des périodes FI (OB52 — bloquer la période aux saisies), (7) Génération des états financiers.",
            "La réévaluation des devises étrangères (F.05 — Foreign Currency Valuation) évalue les postes ouverts libellés en devises étrangères au taux de change de fin de période. Elle génère des écritures d'écart de change (positives ou négatives). Ces écritures sont automatiquement contrepassées au début de la période suivante.",
            "La clôture annuelle inclut en plus : le report des soldes (FAGLGVTR — balance carryforward) qui reporte les soldes des comptes de bilan sur le nouvel exercice et vide les comptes de résultat vers le compte de report à nouveau (retained earnings). C'est l'opération qui 'ferme' l'exercice comptable.",
            "Les provisions et régularisations (accruals/deferrals) sont des écritures permettant de rattacher les charges et produits à la bonne période, même si le document légal (facture) n'est pas encore reçu ou ne concerne qu'une partie de la période. Dans S/4HANA, l'Accrual Engine peut automatiser ces traitements."
          ],
          keyConcepts: [
            { term: "Réévaluation des devises (F.05)", definition: "Évalue les postes ouverts en devise étrangère au taux de change de clôture. Génère des écarts de change. Contrepassée au début de période suivante." },
            { term: "Report des soldes (FAGLGVTR)", definition: "Clôture annuelle : reporte les soldes de bilan au nouvel exercice. Vide les comptes de résultat vers le retained earnings." },
            { term: "OB52", definition: "Transaction pour ouvrir/fermer les périodes comptables FI. Contrôle quand les pièces peuvent être saisies dans chaque période." },
            { term: "Provisions (Accruals)", definition: "Charges estimées rattachées à une période mais non encore facturées. Comptabilisées pour respecter le principe de rattachement des charges." },
          ],
          tcodes: [
            { code: "F.05", description: "Réévaluation des postes en devises étrangères (Foreign Currency Valuation)" },
            { code: "FAGLGVTR", description: "Report des soldes de fin d'exercice (Balance Carryforward)" },
            { code: "OB52", description: "Ouvrir/fermer les périodes comptables FI" },
            { code: "MMPV", description: "Fermer la période comptable MM (logistique)" },
            { code: "F.16", description: "Ancienne transaction de report de solde (remplacée par FAGLGVTR en New GL)" },
          ],
        },
        {
          id: "l7-2",
          title: "Reporting financier dans SAP FI",
          content: [
            "SAP FI propose un ensemble de transactions standard pour générer les états financiers légaux et de gestion. Ces rapports utilisent les données du Universal Journal (ACDOCA) et sont disponibles en temps réel dans S/4HANA.",
            "La transaction S_ALR_87012284 génère le bilan (Balance Sheet) et le compte de résultat (P&L). L'utilisateur sélectionne la société, l'exercice et la période, et le rapport s'affiche avec les soldes des comptes regroupés selon la structure définie dans le plan comptable.",
            "Pour les rapports de lignes de poste détaillées, on utilise : FBL3N (lignes GL), FBL1N (lignes fournisseurs), FBL5N (lignes clients). Ces rapports permettent de filtrer par société, exercice, compte, date et statut (ouvert/lettré).",
            "Dans SAP S/4HANA, les outils de reporting ont été enrichis avec SAP Fiori (interface web) et l'intégration avec SAP Analytics Cloud (SAC) pour des tableaux de bord avancés. La transaction FAGLL03H est la nouvelle version S/4HANA de FBL3N avec plus de fonctionnalités.",
            "La déclaration de TVA dans SAP FI utilise les transactions S_ALR_87012357 (rapport de TVA) ou F.12 (programme de régularisation TVA). La TVA collectée et déductible sont automatiquement comptabilisées lors des saisies de factures si les codes TVA sont correctement paramétrés."
          ],
          keyConcepts: [
            { term: "S_ALR_87012284", definition: "Transaction de reporting financier standard : bilan et compte de résultat. Utilise les structures de bilan définies dans le plan comptable." },
            { term: "Hiérarchie de rapports (Financial Statement Version)", definition: "Structure de regroupement des comptes GL pour l'affichage des états financiers (bilan, P&L). Configurable dans SAP." },
            { term: "FAGLL03H", definition: "Nouvelle transaction S/4HANA pour les lignes de poste GL (remplace FBL3N avec interface Fiori améliorée)." },
            { term: "SAP Analytics Cloud (SAC)", definition: "Solution de BI cloud de SAP s'intégrant avec S/4HANA pour des tableaux de bord financiers avancés en temps réel." },
          ],
          tcodes: [
            { code: "S_ALR_87012284", description: "Bilan (Balance Sheet) et Compte de résultat (P&L)" },
            { code: "S_ALR_87012249", description: "Rapport de grand livre (compte GL détaillé)" },
            { code: "FAGLL03H", description: "Lignes de poste GL (version S/4HANA Fiori de FBL3N)" },
            { code: "S_ALR_87012357", description: "Rapport de déclaration de TVA" },
            { code: "FAGLB03", description: "Afficher les soldes d'un compte GL" },
          ],
        },
      ],
      quiz: [
        {
          id: "q7-1",
          question: "Quel est l'ordre correct des premières étapes de la clôture mensuelle dans SAP FI ?",
          options: [
            "Générer les rapports → Provisions → Amortissements → Fermer les périodes",
            "Fermer période MM → Amortissements (AFAB) → Réévaluation devises (F.05) → Provisions",
            "Ouvrir la période suivante → Contrepasser les provisions → Amortissements",
            "Lettrage inter-sociétés → Réévaluation → Fermer période MM → Amortissements",
          ],
          correctIndex: 1,
          explanation: "L'ordre recommandé commence par fermer la période MM (empêcher nouveaux mouvements logistiques), puis les amortissements AA (AFAB), puis la réévaluation devises (F.05), puis les provisions et régularisations, puis la fermeture des périodes FI (OB52).",
        },
        {
          id: "q7-2",
          question: "La transaction F.05 dans SAP FI est utilisée pour :",
          options: [
            "Saisir les provisions manuellement",
            "Exécuter la réévaluation des postes en devises étrangères",
            "Effectuer le report des soldes annuels",
            "Générer la déclaration de TVA",
          ],
          correctIndex: 1,
          explanation: "F.05 (Foreign Currency Valuation) évalue les postes ouverts en devise étrangère au taux de change de fin de période, générant des écritures d'écart de change. Ces écritures sont contrepassées en début de période suivante.",
        },
        {
          id: "q7-3",
          question: "La transaction FAGLGVTR dans SAP FI S/4HANA est utilisée pour :",
          options: [
            "Calculer les amortissements de fin d'exercice",
            "Effectuer le report des soldes (Balance Carryforward) en fin d'exercice",
            "Fermer les périodes comptables",
            "Générer le bilan annuel",
          ],
          correctIndex: 1,
          explanation: "FAGLGVTR (Balance Carryforward dans le New GL / S/4HANA) reporte les soldes des comptes de bilan au nouvel exercice et vide les comptes de résultat vers le compte de report à nouveau (retained earnings). C'est l'opération de clôture annuelle fondamentale.",
        },
        {
          id: "q7-4",
          question: "La transaction S_ALR_87012284 génère :",
          options: [
            "La liste des fournisseurs avec leurs soldes",
            "Le bilan (Balance Sheet) et le compte de résultat (P&L)",
            "Le tableau des amortissements d'immobilisations",
            "La liste des transactions bancaires",
          ],
          correctIndex: 1,
          explanation: "S_ALR_87012284 est la transaction standard pour les états financiers légaux dans SAP FI : bilan et compte de résultat. Elle utilise la structure de bilan (Financial Statement Version) définie dans le plan comptable.",
        },
        {
          id: "q7-5",
          question: "La transaction OB52 dans SAP FI est utilisée pour :",
          options: [
            "Créer une nouvelle société",
            "Contrôler quelles périodes comptables sont ouvertes ou fermées aux saisies",
            "Générer automatiquement les écritures de clôture",
            "Archiver les données financières de l'exercice",
          ],
          correctIndex: 1,
          explanation: "OB52 (Posting Period Variant) contrôle les périodes ouvertes/fermées pour chaque type de pièce. C'est le verrou qui empêche les saisies dans une période clôturée tout en gardant ouverte la période courante.",
        },
        {
          id: "q7-6",
          question: "Les provisions (Accruals) dans SAP FI sont utilisées pour :",
          options: [
            "Bloquer les paiements fournisseurs",
            "Rattacher les charges et produits à la bonne période même si la facture n'est pas encore reçue",
            "Reporter les soldes d'un exercice à l'autre",
            "Calculer les amortissements non planifiés",
          ],
          correctIndex: 1,
          explanation: "Les provisions respectent le principe comptable de rattachement (matching principle) : une charge doit être enregistrée dans la période où elle est consommée, même si la facture arrive plus tard. Exemple : provision pour congés payés, intérêts courus.",
        },
        {
          id: "q7-7",
          question: "Qu'est-ce que la 'réévaluation des devises étrangères' (F.05) produit comme écritures ?",
          options: [
            "Des écritures permanentes modifiant définitivement les soldes",
            "Des écritures d'écart de change qui sont contrepassées automatiquement au début de la période suivante",
            "Des écritures de cession d'immobilisations en devises",
            "Des provisions pour risque de change irrécupérables",
          ],
          correctIndex: 1,
          explanation: "F.05 génère des écritures d'ajustement temporaires (écarts de change latents). Ces écritures sont marquées pour contrepassation automatique au début de la période suivante, afin de ne pas impacter le bilan cumulé.",
        },
        {
          id: "q7-8",
          question: "Dans SAP S/4HANA, quelle transaction remplace FBL3N pour les lignes de poste GL avec une interface Fiori améliorée ?",
          options: ["FAGLL03H", "FBL3N2", "S4FBL3N", "ACDOCA_DISPLAY"],
          correctIndex: 0,
          explanation: "FAGLL03H est la transaction S/4HANA pour les lignes de poste GL, avec une interface Fiori. Elle offre plus de colonnes, de filtres et de possibilités de drill-down que l'ancienne FBL3N.",
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// SIMULATEUR D'EXAMEN — 40 questions distribuées sur tous les chapitres
// Distribution proportionnelle aux pondérations réelles de l'examen
// ═══════════════════════════════════════════════════════════════════════
export const fiMockExamQuestions = [
  // Ch1 — Vue d'ensemble (8% → ~3 questions)
  {
    id: "exam-1",
    chapter: "Vue d'ensemble SAP S/4HANA Finance",
    question: "Quel est le nom de la table centrale du Universal Journal dans SAP S/4HANA ?",
    options: ["BKPF", "BSEG", "ACDOCA", "FAGLFLEXT"],
    correctIndex: 2,
    explanation: "ACDOCA est la table du Universal Journal. Elle remplace BKPF+BSEG (FI) et unifie toutes les dimensions financières en S/4HANA.",
  },
  {
    id: "exam-2",
    chapter: "Vue d'ensemble SAP S/4HANA Finance",
    question: "Dans SAP, quel objet organisationnel représente l'entité légale comptable qui tient son propre bilan ?",
    options: ["Le mandant", "La division", "La société (Company Code)", "Le périmètre de contrôle"],
    correctIndex: 2,
    explanation: "La société (Company Code) est l'unité minimale de comptabilité légale. Elle tient son propre bilan et compte de résultat.",
  },
  {
    id: "exam-3",
    chapter: "Vue d'ensemble SAP S/4HANA Finance",
    question: "Combien de périodes spéciales peut-on configurer en plus des 12 périodes standard dans SAP FI ?",
    options: ["2", "4", "6", "12"],
    correctIndex: 1,
    explanation: "SAP FI permet jusqu'à 4 périodes spéciales (13-16) utilisées pour les écritures d'audit et de clôture annuelle.",
  },
  // Ch2 — Comptabilité Générale (24% → ~10 questions)
  {
    id: "exam-4",
    chapter: "Comptabilité Générale",
    question: "Quelle transaction permet de créer et gérer un compte GL (données plan comptable + données société) ?",
    options: ["FB01", "FS00", "FBL3N", "OB13"],
    correctIndex: 1,
    explanation: "FS00 est la transaction centrale pour la gestion des comptes GL dans SAP.",
  },
  {
    id: "exam-5",
    chapter: "Comptabilité Générale",
    question: "Qu'est-ce qu'un compte collectif (Reconciliation Account) dans SAP FI ?",
    options: [
      "Un compte GL qui reçoit automatiquement tous les mouvements clients ou fournisseurs",
      "Un compte partagé entre plusieurs sociétés",
      "Un compte hors bilan pour les engagements",
      "Un compte temporaire pour les virements",
    ],
    correctIndex: 0,
    explanation: "Le compte collectif reçoit automatiquement et simultanément tous les mouvements du compte tiers dans le grand livre. On ne peut pas y saisir directement.",
  },
  {
    id: "exam-6",
    chapter: "Comptabilité Générale",
    question: "La règle fondamentale d'équilibre d'une pièce comptable SAP est :",
    options: [
      "Toutes les lignes doivent être de même montant",
      "La somme des débits doit égaler la somme des crédits",
      "Il doit y avoir au minimum 3 lignes de saisie",
      "Chaque ligne doit avoir un centre de coût",
    ],
    correctIndex: 1,
    explanation: "Une pièce comptable SAP doit toujours être équilibrée. SAP ne permet pas la validation d'une pièce déséquilibrée.",
  },
  {
    id: "exam-7",
    chapter: "Comptabilité Générale",
    question: "Le type de pièce 'SA' dans SAP FI correspond à :",
    options: ["Facture fournisseur", "Paiement fournisseur", "Écriture GL", "Facture client"],
    correctIndex: 2,
    explanation: "SA = écriture GL (Sachkonten = comptes GL en allemand). KR = facture fournisseur, KZ = paiement fournisseur, DR = facture client, DZ = paiement client.",
  },
  {
    id: "exam-8",
    chapter: "Comptabilité Générale",
    question: "Quelle transaction utilise-t-on pour saisir une écriture GL directe (provision, régularisation) ?",
    options: ["FB60", "FB70", "FB50", "MIRO"],
    correctIndex: 2,
    explanation: "FB50 est pour les écritures GL directes (journal entries). FB60 = facture fournisseur, FB70 = facture client, MIRO = facture fournisseur avec commande.",
  },
  {
    id: "exam-9",
    chapter: "Comptabilité Générale",
    question: "La transaction FBL3N permet de :",
    options: [
      "Créer un compte GL",
      "Afficher les lignes de poste d'un compte GL",
      "Comptabiliser une facture fournisseur",
      "Exécuter la clôture mensuelle",
    ],
    correctIndex: 1,
    explanation: "FBL3N affiche les lignes de poste (items) d'un compte GL. FBL1N = fournisseurs, FBL5N = clients.",
  },
  {
    id: "exam-10",
    chapter: "Comptabilité Générale",
    question: "La différence entre la date de pièce et la date de comptabilisation est :",
    options: [
      "Elles sont toujours identiques dans S/4HANA",
      "La date de pièce est la date du document original, la date de comptabilisation détermine la période",
      "La date de comptabilisation est toujours antérieure à la date de pièce",
      "La date de pièce s'applique aux fournisseurs uniquement",
    ],
    correctIndex: 1,
    explanation: "La date de pièce = date du document source (facture). La date de comptabilisation = date qui détermine la période comptable dans laquelle l'écriture est enregistrée.",
  },
  {
    id: "exam-11",
    chapter: "Comptabilité Générale",
    question: "Pour annuler une pièce comptable dans SAP FI, on utilise :",
    options: ["FB01 avec des montants négatifs", "FB08 pour contrepasser la pièce", "FS00 pour supprimer le compte", "OB52 pour fermer la période"],
    correctIndex: 1,
    explanation: "FB08 contrepasse une pièce en créant une pièce miroir avec les montants inversés. On ne peut pas supprimer une pièce validée dans SAP.",
  },
  {
    id: "exam-12",
    chapter: "Comptabilité Générale",
    question: "Dans SAP S/4HANA, que se passe-t-il lors de la validation d'une pièce FI avec affectation à un centre de coût ?",
    options: [
      "L'écriture est enregistrée en FI uniquement, CO est mis à jour par batch nocturne",
      "L'écriture est enregistrée simultanément dans FI et CO grâce au Universal Journal",
      "Le système demande une confirmation manuelle en CO",
      "L'écriture reste en brouillon 24h",
    ],
    correctIndex: 1,
    explanation: "Grâce au Universal Journal (ACDOCA), FI et CO sont enregistrés simultanément. Il n'y a plus de réconciliation FI-CO dans S/4HANA.",
  },
  {
    id: "exam-13",
    chapter: "Comptabilité Générale",
    question: "Quels sont les deux niveaux de données d'un compte GL dans SAP ?",
    options: [
      "Niveau mandant et niveau organisation achat",
      "Données de plan comptable et données de société",
      "Données fournisseur et données client",
      "Données analytiques et données légales",
    ],
    correctIndex: 1,
    explanation: "Un compte GL a des données au niveau du plan comptable (libellé, type de compte) et des données spécifiques à chaque société (devise, gestion par ligne de poste, groupe de rapports).",
  },
  // Ch3 — Comptabilité Fournisseurs (16% → ~6 questions)
  {
    id: "exam-14",
    chapter: "Comptabilité Fournisseurs",
    question: "Quelle transaction est utilisée pour saisir une facture fournisseur liée à une commande d'achat ?",
    options: ["FB60", "MIRO", "F110", "FB70"],
    correctIndex: 1,
    explanation: "MIRO (Logistics Invoice Verification) traite les factures avec référence à une commande d'achat. FB60 est pour les factures sans commande.",
  },
  {
    id: "exam-15",
    chapter: "Comptabilité Fournisseurs",
    question: "La transaction F110 est utilisée pour :",
    options: [
      "Afficher les soldes fournisseurs",
      "Créer des fiches fournisseurs",
      "Exécuter le traitement automatique des paiements (Payment Run)",
      "Lettrer manuellement les postes fournisseurs",
    ],
    correctIndex: 2,
    explanation: "F110 est le Payment Run. Il propose, contrôle et exécute les paiements fournisseurs selon les conditions de paiement et les échéances.",
  },
  {
    id: "exam-16",
    chapter: "Comptabilité Fournisseurs",
    question: "Le processus Purchase-to-Pay (P2P) suit quel ordre ?",
    options: [
      "Facture → Commande → Entrée marchandise → Paiement",
      "Demande d'achat → Commande → Entrée marchandise → Facture → Paiement",
      "Commande → Paiement → Livraison → Facture",
      "Facture → Paiement → Commande → Livraison",
    ],
    correctIndex: 1,
    explanation: "P2P : Demande d'achat (ME51N) → Commande (ME21N) → Réception (MIGO) → Facture (MIRO) → Paiement (F110).",
  },
  {
    id: "exam-17",
    chapter: "Comptabilité Fournisseurs",
    question: "Le rapprochement à 3 voies (3-way match) dans MIRO vérifie :",
    options: [
      "Facture + client + fournisseur",
      "Facture + commande d'achat + entrée marchandise",
      "Trois factures du même fournisseur",
      "Facture + paiement + relevé bancaire",
    ],
    correctIndex: 1,
    explanation: "Le 3-way match contrôle la cohérence entre la facture reçue, la commande d'achat correspondante et l'entrée marchandise (réception physique).",
  },
  {
    id: "exam-18",
    chapter: "Comptabilité Fournisseurs",
    question: "La transaction FBL1N dans SAP FI permet de :",
    options: [
      "Créer un fournisseur",
      "Afficher les lignes de poste fournisseurs",
      "Saisir une facture fournisseur",
      "Exécuter le paiement automatique",
    ],
    correctIndex: 1,
    explanation: "FBL1N (1 = Kreditoren/fournisseurs) affiche les lignes de poste fournisseurs : postes ouverts, soldés ou tous.",
  },
  {
    id: "exam-19",
    chapter: "Comptabilité Fournisseurs",
    question: "Dans SAP S/4HANA, quel concept remplace FK01 pour la gestion des fournisseurs ?",
    options: ["Company Code", "Business Partner (BP)", "Controlling Area", "Asset Class"],
    correctIndex: 1,
    explanation: "SAP S/4HANA utilise le Business Partner (BP) comme objet unifié pour fournisseurs et clients, remplaçant FK01 et FD01.",
  },
  // Ch4 — Comptabilité Clients (16% → ~6 questions)
  {
    id: "exam-20",
    chapter: "Comptabilité Clients",
    question: "La transaction F-28 dans SAP FI est utilisée pour :",
    options: [
      "Saisir une facture client",
      "Enregistrer un encaissement client entrant",
      "Créer un avoir client",
      "Bloquer un compte client",
    ],
    correctIndex: 1,
    explanation: "F-28 (Incoming Payments) enregistre les paiements reçus des clients et permet le lettrage des postes ouverts.",
  },
  {
    id: "exam-21",
    chapter: "Comptabilité Clients",
    question: "Le processus O2C (Order-to-Cash) intègre quels modules SAP ?",
    options: ["FI et MM", "FI et SD", "FI et CO", "FI et HCM"],
    correctIndex: 1,
    explanation: "O2C intègre SD (commande, livraison, facturation) avec FI (comptabilisation facture, encaissement). C'est l'intégration SD-FI.",
  },
  {
    id: "exam-22",
    chapter: "Comptabilité Clients",
    question: "Quelle transaction permet d'afficher les lignes de poste clients ?",
    options: ["FBL1N", "FBL3N", "FBL5N", "FBL7N"],
    correctIndex: 2,
    explanation: "FBL5N (5 = Debitoren/clients) affiche les lignes de poste clients.",
  },
  {
    id: "exam-23",
    chapter: "Comptabilité Clients",
    question: "La procédure de relance (Dunning) dans SAP FI permet de :",
    options: [
      "Calculer automatiquement les intérêts bancaires",
      "Envoyer automatiquement des courriers de relance aux clients en retard",
      "Bloquer automatiquement les comptes clients inactifs",
      "Générer des factures clients périodiques",
    ],
    correctIndex: 1,
    explanation: "La procédure Dunning génère automatiquement les courriers de relance avec niveaux d'escalade (rappel → relance → mise en demeure). Transaction F150.",
  },
  {
    id: "exam-24",
    chapter: "Comptabilité Clients",
    question: "La transaction VF01 dans SAP crée :",
    options: [
      "Une commande client SD",
      "Une facture SD avec comptabilisation automatique en FI",
      "Un encaissement client",
      "Une livraison client",
    ],
    correctIndex: 1,
    explanation: "VF01 crée la facture SD et génère automatiquement la pièce FI (débit client, crédit produit + TVA). C'est l'intégration SD→FI.",
  },
  {
    id: "exam-25",
    chapter: "Comptabilité Clients",
    question: "Pour saisir directement une facture client en FI sans référence SD, on utilise :",
    options: ["VF01", "FB70", "F-28", "FBL5N"],
    correctIndex: 1,
    explanation: "FB70 saisit une facture client directement en FI. Utilisé pour les refacturations internes ou situations sans processus SD.",
  },
  // Ch5 — Immobilisations (12% → ~5 questions)
  {
    id: "exam-26",
    chapter: "Comptabilité des Immobilisations",
    question: "La transaction AS01 dans SAP FI est utilisée pour :",
    options: [
      "Afficher une immobilisation",
      "Créer une fiche immobilisation",
      "Comptabiliser un amortissement",
      "Céder une immobilisation",
    ],
    correctIndex: 1,
    explanation: "AS01 = Create Asset (AS + 01). AS02 = modifier, AS03 = afficher.",
  },
  {
    id: "exam-27",
    chapter: "Comptabilité des Immobilisations",
    question: "La valeur nette comptable (VNC) est calculée comme :",
    options: [
      "Coût d'acquisition + amortissements cumulés",
      "Coût d'acquisition - amortissements cumulés",
      "Prix de marché actuel",
      "Valeur de remplacement estimée",
    ],
    correctIndex: 1,
    explanation: "VNC = Coût historique - Amortissements cumulés. Elle représente la valeur résiduelle comptable.",
  },
  {
    id: "exam-28",
    chapter: "Comptabilité des Immobilisations",
    question: "La transaction AFAB dans SAP FI est utilisée pour :",
    options: [
      "Créer une immobilisation",
      "Afficher les amortissements futurs",
      "Exécuter le traitement périodique des amortissements",
      "Céder une immobilisation",
    ],
    correctIndex: 2,
    explanation: "AFAB exécute le programme de calcul et comptabilisation des amortissements. Exécuté mensuellement lors de la clôture.",
  },
  {
    id: "exam-29",
    chapter: "Comptabilité des Immobilisations",
    question: "La transaction ABAVN dans SAP FI-AA correspond à :",
    options: [
      "La création d'une immobilisation",
      "La mise au rebut (scrap) sans produit de cession",
      "Le transfert entre classes d'immobilisations",
      "Le calcul d'un amortissement spécial",
    ],
    correctIndex: 1,
    explanation: "ABAVN (Asset Retirement by Scrapping) met au rebut une immobilisation sans produit de vente.",
  },
  {
    id: "exam-30",
    chapter: "Comptabilité des Immobilisations",
    question: "L'amortissement linéaire signifie :",
    options: [
      "L'amortissement varie selon la VNC résiduelle",
      "Le même montant d'amortissement chaque période sur la durée de vie",
      "L'amortissement est calculé sur le prix de marché",
      "Aucun amortissement en première année",
    ],
    correctIndex: 1,
    explanation: "Amortissement linéaire = même montant chaque période = coût d'acquisition / durée de vie.",
  },
  // Ch6 — Trésorerie (8% → ~3 questions)
  {
    id: "exam-31",
    chapter: "Gestion de Trésorerie",
    question: "La transaction FI12 dans SAP FI est utilisée pour :",
    options: [
      "Saisir une écriture bancaire",
      "Configurer les banques maison (House Banks)",
      "Effectuer un virement externe",
      "Afficher le solde de trésorerie",
    ],
    correctIndex: 1,
    explanation: "FI12 configure les banques maison : coordonnées bancaires, numéros de compte, association avec les comptes GL.",
  },
  {
    id: "exam-32",
    chapter: "Gestion de Trésorerie",
    question: "La transaction FEBP dans SAP FI sert à :",
    options: [
      "Créer un compte bancaire maison",
      "Comptabiliser automatiquement les lignes d'un relevé bancaire électronique",
      "Planifier les paiements futurs",
      "Générer un rapport de trésorerie mensuel",
    ],
    correctIndex: 1,
    explanation: "FEBP automatise le rapprochement et la comptabilisation des relevés bancaires électroniques.",
  },
  {
    id: "exam-33",
    chapter: "Gestion de Trésorerie",
    question: "La transaction FF7A dans SAP Cash Management affiche :",
    options: [
      "La localisation des coffres-forts",
      "La situation de trésorerie : soldes et flux attendus",
      "Le solde comptable du grand livre banque uniquement",
      "La limite de découvert bancaire",
    ],
    correctIndex: 1,
    explanation: "FF7A (Cash Position) montre les soldes bancaires actuels et intègre les flux de trésorerie attendus à court terme.",
  },
  // Ch7 — Clôture (16% → ~7 questions)
  {
    id: "exam-34",
    chapter: "Opérations de Clôture",
    question: "La transaction F.05 dans SAP FI exécute :",
    options: [
      "La saisie des provisions",
      "La réévaluation des postes en devises étrangères",
      "Le report des soldes annuels",
      "La déclaration de TVA",
    ],
    correctIndex: 1,
    explanation: "F.05 (Foreign Currency Valuation) évalue les postes ouverts en devise étrangère au taux de clôture et génère des écritures d'écart de change contrepassées en début de période suivante.",
  },
  {
    id: "exam-35",
    chapter: "Opérations de Clôture",
    question: "La transaction FAGLGVTR est utilisée pour :",
    options: [
      "Calculer les amortissements de fin d'exercice",
      "Effectuer le report des soldes en fin d'exercice (Balance Carryforward)",
      "Fermer les périodes comptables",
      "Générer le bilan annuel",
    ],
    correctIndex: 1,
    explanation: "FAGLGVTR reporte les soldes des comptes de bilan au nouvel exercice et vide les comptes de résultat vers le retained earnings. C'est la clôture annuelle fondamentale.",
  },
  {
    id: "exam-36",
    chapter: "Opérations de Clôture",
    question: "La transaction OB52 contrôle :",
    options: [
      "La création de nouvelles sociétés",
      "Quelles périodes comptables sont ouvertes ou fermées aux saisies",
      "La génération automatique des écritures de clôture",
      "L'archivage des données financières",
    ],
    correctIndex: 1,
    explanation: "OB52 (Posting Period Variant) est le verrou qui contrôle les périodes ouvertes/fermées pour chaque type de pièce.",
  },
  {
    id: "exam-37",
    chapter: "Opérations de Clôture",
    question: "La transaction S_ALR_87012284 génère :",
    options: [
      "La liste des fournisseurs",
      "Le bilan et le compte de résultat",
      "Le tableau des amortissements",
      "La liste des transactions bancaires",
    ],
    correctIndex: 1,
    explanation: "S_ALR_87012284 génère les états financiers standards : bilan et compte de résultat.",
  },
  {
    id: "exam-38",
    chapter: "Opérations de Clôture",
    question: "Quel est le premier traitement à effectuer lors d'une clôture mensuelle SAP FI ?",
    options: [
      "Calculer les amortissements (AFAB)",
      "Fermer la période MM (MMPV) avant tout autre traitement",
      "Générer les états financiers",
      "Saisir les provisions",
    ],
    correctIndex: 1,
    explanation: "Fermer la période MM (MMPV) en premier empêche toute nouvelle entrée marchandise dans la période à clôturer, garantissant l'intégrité des données logistiques avant les traitements comptables.",
  },
  {
    id: "exam-39",
    chapter: "Opérations de Clôture",
    question: "Les écritures de réévaluation de devises générées par F.05 sont :",
    options: [
      "Permanentes et modifient définitivement les soldes",
      "Temporaires et contrepassées automatiquement au début de la période suivante",
      "Optionnelles et peuvent être ignorées",
      "Saisies manuellement par le comptable",
    ],
    correctIndex: 1,
    explanation: "F.05 génère des écritures d'ajustement temporaires (écarts de change latents) marquées pour contrepassation automatique au début de la période suivante.",
  },
  {
    id: "exam-40",
    chapter: "Opérations de Clôture",
    question: "Dans SAP S/4HANA, la transaction FAGLL03H remplace :",
    options: ["AFAB", "FBL3N", "F.05", "OB52"],
    correctIndex: 1,
    explanation: "FAGLL03H est la version S/4HANA / Fiori de FBL3N pour afficher les lignes de poste GL, avec une interface améliorée.",
  },
];
