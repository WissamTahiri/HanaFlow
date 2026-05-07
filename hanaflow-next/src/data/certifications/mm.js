/**
 * Contenu de la certification C_TS4MM_2023
 * SAP Certified Associate – SAP S/4HANA for Materials Management
 *
 * 7 chapitres couvrant 100% du périmètre de l'examen officiel
 * 14 leçons (2 par chapitre) — concepts, T-codes, scénarios métier
 * Quiz par chapitre + 80 questions simulateur (format examen réel)
 */

export const mmCertification = {
  id: "c-ts4mm-2023",
  code: "C_TS4MM_2023",
  name: "SAP Certified Associate – SAP S/4HANA for Materials Management",
  shortName: "SAP MM Certification",
  level: "Associate",
  examDuration: 180,
  examQuestions: 80,
  simulatorQuestions: 80,
  passingScore: 65,
  officialLink: "https://training.sap.com/certification/c_ts4mm_2023",
  color: "from-emerald-900 via-emerald-700 to-emerald-500",

  chapters: [
    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 1 — Structures organisationnelles et données de base
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch1", number: 1,
      title: "Structures organisationnelles et données de base MM",
      weight: 12, isPremium: false,
      lessons: [
        {
          id: "l1-1",
          title: "Structure organisationnelle MM : mandant, société, division",
          content: [
            "Le module MM (Materials Management) s'appuie sur une hiérarchie d'entités organisationnelles spécifiques. Comprendre cette structure est fondamental car elle conditionne où les stocks sont gérés, où les achats sont effectués et comment les coûts sont imputés.",
            "Le Mandant (Client) est le niveau le plus élevé — une instance SAP complète. En dessous vient la Société (Company Code), entité légale comptable. Le module MM introduit ensuite des niveaux supplémentaires absents dans FI.",
            "La Division (Plant) est l'entité centrale du module MM. Elle représente une unité de production, un entrepôt ou un site opérationnel. C'est à la division que sont gérés les stocks, les besoins MRP et les données techniques des articles. Une division est toujours rattachée à une société. Exemple : Division 1000 = Usine Paris, Division 2000 = Entrepôt Lyon.",
            "Le Domaine de valorisation (Valuation Area) détermine à quel niveau les stocks sont valorisés (prix). En SAP standard, le domaine de valorisation = la division. Cela signifie que le prix d'un même article peut différer selon la division.",
            "Le Magasin (Storage Location) est une subdivision de la division pour organiser physiquement les stocks : Magasin 0001 = Matières premières, Magasin 0002 = Produits finis, Magasin 0003 = Consommables. Le magasin n'a pas d'impact sur la valorisation, uniquement sur la localisation physique du stock.",
            "L'Organisation d'achats (Purchasing Organization) est responsable des négociations et des contrats fournisseurs. Elle peut être commune à plusieurs divisions (centralisée) ou spécifique à une division. Le Groupe d'acheteurs (Purchasing Group) est la personne ou équipe responsable d'une famille d'articles."
          ],
          keyConcepts: [
            { term: "Division (Plant)", definition: "Unité opérationnelle centrale de MM. Gère les stocks, les besoins MRP, les données techniques. Rattachée à une société." },
            { term: "Magasin (Storage Location)", definition: "Subdivision de la division pour localiser physiquement les stocks. Pas d'impact sur la valorisation." },
            { term: "Organisation d'achats", definition: "Responsable des négociations fournisseurs et des contrats. Peut être commune à plusieurs divisions (centralisée)." },
            { term: "Domaine de valorisation", definition: "Niveau auquel les stocks sont valorisés. = Division en standard SAP. Le prix peut varier par division." },
            { term: "Groupe d'acheteurs", definition: "Personne ou équipe responsable d'une famille d'achats. Niveau opérationnel des acheteurs." },
          ],
          tcodes: [
            { code: "SPRO", description: "Accès à l'IMG — configuration des structures organisationnelles" },
            { code: "OX10", description: "Définir les divisions" },
            { code: "OX09", description: "Définir les magasins" },
            { code: "OX01", description: "Définir les organisations d'achats" },
          ],
        },
        {
          id: "l1-2",
          title: "La fiche article (Material Master) et ses vues",
          content: [
            "La fiche article (Material Master) est la donnée de base centrale du module MM. Elle contient toutes les informations nécessaires à la gestion d'un matériau tout au long de son cycle de vie : achat, réception, stockage, production, vente. Une même fiche article peut exister dans plusieurs divisions et organisations d'achats avec des données spécifiques à chaque niveau.",
            "Les vues de la fiche article sont organisées par domaine fonctionnel. Les principales vues MM sont : Vue Achats (données de commande, unité d'achat, délai de livraison, type d'appro), Vue Comptabilité (type d'évaluation, prix standard/moyen), Vue Gestion des stocks (unité de mesure de stock, numéro de lot), Vue MRP 1/2/3/4 (paramètres de planification), Vue Qualité, Vue Ventes.",
            "Le type d'article (Material Type) conditionne les vues disponibles et les comportements comptables. Les types principaux : ROH (matière première), HALB (semi-fini), FERT (produit fini), HIBE (article consommable), DIEN (prestation de service), NLAG (article non stocké). Le type d'article détermine si l'article est valorisé en stock ou passé directement en charge.",
            "Le groupe d'articles (Material Group) classifie les articles pour les rapports et les règles d'achats. Le numéro d'article peut être interne (généré par SAP) ou externe (défini par l'entreprise). La description en langue est gérée séparément pour chaque langue système.",
            "Dans S/4HANA, la fiche article est gérée avec MM01/MM02/MM03. Des améliorations UX Fiori simplifient la création avec un formulaire guidé. Le concept de 'données de base article' reste identique à ECC mais la table de stockage est modernisée."
          ],
          keyConcepts: [
            { term: "Fiche article (Material Master)", definition: "Donnée de base centrale MM. Contient toutes les infos d'un matériau par domaine fonctionnel (vues). Commune à plusieurs modules." },
            { term: "Type d'article (Material Type)", definition: "ROH=matière première, HALB=semi-fini, FERT=produit fini, HIBE=consommable. Conditionne les vues et le comportement comptable." },
            { term: "Vue Achats", definition: "Vue de la fiche article contenant les données d'approvisionnement : délai de livraison, unité d'achat, tolérance de livraison, numéro EAN." },
            { term: "Vue MRP", definition: "Vues 1 à 4 contenant les paramètres de planification des besoins : type MRP, taille de lot, stock de sécurité, délai." },
            { term: "Groupe d'articles", definition: "Classification des articles pour reporting et règles d'achats. Exemple : MATS=Matières, EMBAL=Emballages, SERV=Services." },
          ],
          tcodes: [
            { code: "MM01", description: "Créer une fiche article" },
            { code: "MM02", description: "Modifier une fiche article" },
            { code: "MM03", description: "Afficher une fiche article" },
            { code: "MM60", description: "Rapport : fiches articles par division" },
          ],
        },
      ],
      quiz: [
        {
          id: "q1-1",
          question: "Quelle est l'entité organisationnelle centrale du module MM où sont gérés les stocks et le MRP ?",
          options: ["La société (Company Code)", "La division (Plant)", "Le magasin (Storage Location)", "L'organisation d'achats"],
          correctIndex: 1,
          explanation: "La division (Plant) est l'entité centrale de MM. C'est à ce niveau que les stocks sont gérés, que le MRP s'exécute et que les données techniques des articles sont définies. Elle est toujours rattachée à une société."
        },
        {
          id: "q1-2",
          question: "Quel est le rôle du magasin (Storage Location) dans SAP MM ?",
          options: [
            "Définir le prix de valorisation du stock",
            "Localiser physiquement les stocks dans une division, sans impact sur la valorisation",
            "Regrouper plusieurs divisions pour les achats centralisés",
            "Définir les règles de comptabilisation des mouvements de stock"
          ],
          correctIndex: 1,
          explanation: "Le magasin (Storage Location) est une subdivision de la division pour organiser physiquement le stock (ex: 0001=MP, 0002=PF). Il n'a aucun impact sur la valorisation, qui dépend du domaine de valorisation (= division en standard)."
        },
        {
          id: "q1-3",
          question: "Le type d'article FERT dans SAP correspond à :",
          options: ["Une matière première achetée", "Un produit fini fabriqué", "Un article consommable", "Une prestation de service"],
          correctIndex: 1,
          explanation: "FERT = produit fini fabriqué en interne. ROH = matière première, HALB = semi-fini, HIBE = article consommable (frais généraux), DIEN = service."
        },
        {
          id: "q1-4",
          question: "La fiche article dans SAP est organisée en :",
          options: ["Tables de base de données SQL", "Vues par domaine fonctionnel (Achats, MRP, Comptabilité, etc.)", "Documents comptables", "Bons de commande"],
          correctIndex: 1,
          explanation: "La fiche article est structurée en vues fonctionnelles : Vue Achats, Vue MRP (1 à 4), Vue Comptabilité, Vue Ventes, Vue Qualité, etc. Chaque vue contient les données propres à son domaine."
        },
        {
          id: "q1-5",
          question: "À quel niveau SAP standard valorise-t-il les stocks ?",
          options: ["Au niveau du mandant", "Au niveau de la société", "Au niveau de la division (domaine de valorisation)", "Au niveau du magasin"],
          correctIndex: 2,
          explanation: "Le domaine de valorisation équivaut à la division en SAP standard. Cela signifie que les prix des matériaux sont définis par division et peuvent différer entre divisions."
        },
        {
          id: "q1-6",
          question: "Quelle transaction SAP permet de créer une fiche article ?",
          options: ["ME21N", "MM01", "MB01", "MIGO"],
          correctIndex: 1,
          explanation: "MM01 crée une fiche article. ME21N crée un bon de commande, MB01 et MIGO sont utilisés pour les mouvements de marchandises."
        },
        {
          id: "q1-7",
          question: "L'organisation d'achats dans SAP est responsable de :",
          options: [
            "La gestion physique des stocks",
            "La planification des besoins MRP",
            "Les négociations fournisseurs, contrats et conditions d'achat",
            "La valorisation des articles en stock"
          ],
          correctIndex: 2,
          explanation: "L'organisation d'achats (Purchasing Organization) est l'entité responsable des négociations avec les fournisseurs, des contrats-cadres et des conditions d'achat. Elle peut être centralisée (commune à plusieurs divisions) ou décentralisée."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 2 — Processus d'achat Procure-to-Pay (P2P)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch2", number: 2,
      title: "Processus d'achat Procure-to-Pay (P2P)",
      weight: 20, isPremium: true,
      lessons: [
        {
          id: "l2-1",
          title: "Demande d'achat, appel d'offres et bon de commande",
          content: [
            "Le processus Procure-to-Pay (P2P) couvre l'ensemble du cycle d'achat depuis l'expression du besoin jusqu'au paiement du fournisseur. C'est l'un des flux métier les plus importants de SAP car il croise MM (achats, stock) et FI (comptabilité fournisseurs).",
            "La Demande d'Achat (Purchase Requisition / PR) est le point de départ du processus. Elle exprime un besoin interne : un service a besoin de fournitures, la production a besoin de matières. Elle peut être créée manuellement (ME51N) ou automatiquement par le MRP. La DA n'a pas d'effet comptable mais déclenche le processus d'achat.",
            "L'Appel d'Offres (Request for Quotation / RFQ) est optionnel. Il est envoyé à plusieurs fournisseurs potentiels. Les devis reçus (Quotations) sont saisis dans SAP (ME47) et comparés via la feuille de comparaison de prix (ME49). Cette étape est surtout utilisée pour les achats importants non couverts par des contrats.",
            "Le Bon de Commande (Purchase Order / PO) est le document contractuel envoyé au fournisseur sélectionné. Il est créé avec ME21N (ou ME59N en automatique depuis les DA). Le BC contient : fournisseur, articles, quantités, prix, conditions de livraison, organisation d'achats, division. Sa création n'a pas d'effet comptable immédiat — l'écriture vient lors de la réception ou de la facture.",
            "Les Contrats-cadres (Outline Agreements) permettent de prénégocier des conditions avec un fournisseur pour une période ou un volume donné. Les deux types principaux : le Contrat (Contract, ME31K) qui engage sur un volume ou un montant, et le Calendrier de livraison (Scheduling Agreement, ME31L) qui planifie des livraisons périodiques. Ces contrats rationalisent le processus d'achat en évitant de renégocier à chaque commande."
          ],
          keyConcepts: [
            { term: "Demande d'achat (PR)", definition: "Expression d'un besoin interne. Créée manuellement (ME51N) ou par MRP. Pas d'effet comptable. Déclenche le processus d'achat." },
            { term: "Bon de commande (PO)", definition: "Document contractuel vers le fournisseur. Créé avec ME21N. Pas d'effet comptable immédiat (effet à la réception ou la facture)." },
            { term: "Contrat-cadre (Contract)", definition: "Accord prénégocié avec un fournisseur sur un volume ou montant. Évite de renégocier à chaque commande. ME31K." },
            { term: "Calendrier de livraison (Scheduling Agreement)", definition: "Type de contrat-cadre avec livraisons planifiées périodiquement. Utilisé en production série. ME31L." },
            { term: "Appel d'offres (RFQ)", definition: "Demande de devis envoyée à plusieurs fournisseurs. Comparaison des offres via ME49. Optionnel dans le P2P." },
          ],
          tcodes: [
            { code: "ME51N", description: "Créer une demande d'achat" },
            { code: "ME21N", description: "Créer un bon de commande" },
            { code: "ME59N", description: "Convertir automatiquement les DA en BC" },
            { code: "ME31K", description: "Créer un contrat-cadre (Contract)" },
            { code: "ME31L", description: "Créer un calendrier de livraison (Scheduling Agreement)" },
            { code: "ME2M", description: "Rapport : bons de commande par article" },
          ],
        },
        {
          id: "l2-2",
          title: "Réception de marchandises, confirmation et intégration FI",
          content: [
            "La Réception de Marchandises (Goods Receipt / GR) enregistre l'arrivée physique des articles commandés. Elle est traitée avec la transaction MIGO (mouvement de type 101 pour une entrée contre bon de commande). La GR génère un document matière (Material Document) et une pièce comptable FI.",
            "L'écriture comptable générée par la GR est le cœur de l'intégration MM-FI. Dans SAP, lors d'une GR contre BC avec évaluation standard : Débit Compte de Stock (= valeur au prix standard) / Crédit Compte de Réception de Factures (GR/IR Account). Ce compte GR/IR (Good Receipt/Invoice Receipt) est un compte de transition qui sera soldé lors de la réception de la facture fournisseur.",
            "La Tolérance de livraison (Delivery Tolerance) définit les écarts acceptés entre la quantité commandée et la quantité reçue. Si la tolérance est dépassée, SAP bloque ou avertit. La Vérification de stock (Stock Overview, MMBE) permet de visualiser les stocks par division et magasin en temps réel.",
            "Le document matière (Material Document) créé par MIGO contient : numéro de mouvement, date, articles, quantités, valeurs, division, magasin. Il est numéroté séquentiellement et ne peut pas être modifié — seule une contre-passation (annulation) est possible.",
            "Le concept de 3-Way Match (Vérification à 3 points) est fondamental dans P2P : 1) Bon de Commande (quantité et prix commandés), 2) Réception Marchandises (quantité reçue), 3) Facture fournisseur (quantité et prix facturés). SAP compare ces 3 documents lors de la vérification de facture pour détecter les écarts."
          ],
          keyConcepts: [
            { term: "Réception de marchandises (GR)", definition: "Enregistrement de l'arrivée physique d'articles. MIGO mouvement 101. Génère document matière + pièce FI." },
            { term: "Compte GR/IR", definition: "Compte de transition entre GR (crédit) et facture (débit). Soldé lors de la vérification de facture. Assure l'intégration MM-FI." },
            { term: "Document matière (Material Document)", definition: "Pièce MM créée par tout mouvement de stock. Numéroté séquentiellement. Non modifiable, annulation uniquement." },
            { term: "3-Way Match", definition: "Comparaison Bon de Commande / Réception Marchandises / Facture lors de la vérification. Détecte les écarts de prix ou quantité." },
            { term: "MIGO", definition: "Transaction centrale pour tous les mouvements de marchandises : entrées (101, 501), sorties (201, 261), transferts (311, 303)." },
          ],
          tcodes: [
            { code: "MIGO", description: "Saisir un mouvement de marchandises (GR, sortie, transfert)" },
            { code: "MMBE", description: "Vue d'ensemble des stocks par article/division/magasin" },
            { code: "MB51", description: "Rapport : documents matières par article" },
            { code: "MB52", description: "Rapport : stocks en entrepôt par division" },
          ],
        },
      ],
      quiz: [
        {
          id: "q2-1",
          question: "Quel est l'effet comptable immédiat de la création d'un bon de commande (ME21N) ?",
          options: [
            "Débit Stock / Crédit Fournisseur",
            "Aucun effet comptable — l'écriture intervient lors de la réception",
            "Débit Charges / Crédit GR/IR",
            "Débit GR/IR / Crédit Trésorerie"
          ],
          correctIndex: 1,
          explanation: "La création d'un bon de commande n'a aucun effet comptable dans SAP. L'écriture comptable intervient lors de la réception de marchandises (MIGO) : Débit Stock / Crédit GR/IR."
        },
        {
          id: "q2-2",
          question: "Lors d'une réception de marchandises (GR) contre bon de commande au prix standard, quelle écriture SAP génère-t-il ?",
          options: [
            "Débit Fournisseur / Crédit Stock",
            "Débit Stock / Crédit GR/IR (Good Receipt/Invoice Receipt)",
            "Débit Charges d'achat / Crédit Trésorerie",
            "Débit GR/IR / Crédit Fournisseur"
          ],
          correctIndex: 1,
          explanation: "La GR génère : Débit Compte de Stock (valeur au prix standard) / Crédit Compte GR/IR. Ce compte GR/IR est un compte de transition qui sera soldé lors de la saisie de la facture fournisseur (MIRO)."
        },
        {
          id: "q2-3",
          question: "La transaction MIGO est utilisée pour :",
          options: [
            "Créer une demande d'achat",
            "Vérifier la facture fournisseur",
            "Saisir tous les mouvements de marchandises (réceptions, sorties, transferts)",
            "Créer un bon de commande"
          ],
          correctIndex: 2,
          explanation: "MIGO est la transaction centrale pour tous les mouvements de stocks : entrée contre BC (101), sortie pour consommation (201/261), transfert entre magasins (311), retour fournisseur (122), etc."
        },
        {
          id: "q2-4",
          question: "Le 3-Way Match dans le processus P2P compare :",
          options: [
            "Devis fournisseur / Contrat-cadre / Bon de commande",
            "Bon de commande / Réception marchandises / Facture fournisseur",
            "Demande d'achat / Bon de commande / Paiement",
            "Stock physique / Stock SAP / Stock comptable"
          ],
          correctIndex: 1,
          explanation: "Le 3-Way Match compare : 1) Bon de Commande (quantité/prix commandés), 2) Réception Marchandises (quantité reçue), 3) Facture (quantité/prix facturés). SAP détecte automatiquement les écarts lors de MIRO."
        },
        {
          id: "q2-5",
          question: "La transaction ME59N sert à :",
          options: [
            "Créer manuellement un bon de commande",
            "Convertir automatiquement des demandes d'achat en bons de commande",
            "Vérifier l'état des livraisons en retard",
            "Créer un calendrier de livraison"
          ],
          correctIndex: 1,
          explanation: "ME59N convertit automatiquement des demandes d'achat (DA) en bons de commande, en utilisant les sources d'approvisionnement définies (info-records, contrats). Évite la saisie manuelle des BC pour chaque DA."
        },
        {
          id: "q2-6",
          question: "Un contrat-cadre de type 'Scheduling Agreement' (calendrier de livraison) est principalement utilisé pour :",
          options: [
            "Les achats spot sans fournisseur préférentiel",
            "Les appels d'offres concurrentiels",
            "Les livraisons planifiées et régulières, typiquement en production série",
            "Les achats non récurrents de gros montants"
          ],
          correctIndex: 2,
          explanation: "Le Scheduling Agreement est un contrat-cadre avec des lignes de livraison planifiées (dates et quantités prédéfinies). Très utilisé en production série pour les composants livrés régulièrement par un fournisseur partenaire."
        },
        {
          id: "q2-7",
          question: "Le compte GR/IR (Good Receipt/Invoice Receipt) dans SAP est :",
          options: [
            "Un compte de stock permanent",
            "Un compte de transition qui est crédité à la GR et débité lors de la réception de la facture",
            "Un compte de résultat pour les écarts de prix",
            "Un compte bancaire pour les paiements fournisseurs"
          ],
          correctIndex: 1,
          explanation: "Le compte GR/IR est un compte de transition (clearing account). À la GR, il est crédité. À la réception de la facture (MIRO), il est débité. Solde = livraisons reçues non encore facturées (ou factures non encore livrées)."
        },
        {
          id: "q2-8",
          question: "Quelle transaction permet de visualiser les stocks en temps réel par division et magasin ?",
          options: ["MM03", "ME2M", "MMBE", "MB52"],
          correctIndex: 2,
          explanation: "MMBE (Material Management Balance Sheet / Stock Overview) donne une vue en temps réel des stocks par article, division, magasin et lot. MB52 liste les stocks par entrepôt mais est moins interactif."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 3 — Gestion des stocks et mouvements de marchandises
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch3", number: 3,
      title: "Gestion des stocks et mouvements de marchandises",
      weight: 18, isPremium: true,
      lessons: [
        {
          id: "l3-1",
          title: "Types de stocks, mouvements et types de mouvements",
          content: [
            "SAP distingue plusieurs types de stocks qui reflètent l'état physique ou administratif des articles. Le stock disponible (Unrestricted Use Stock) est le stock utilisable librement pour la production, la vente ou la consommation. Le stock bloqué (Blocked Stock) est un stock reçu mais non encore accepté (en cours d'inspection qualité). Le stock en contrôle qualité (QI Stock) attend la décision du service qualité.",
            "Les types de mouvements (Movement Types) sont des codes à 3 chiffres qui définissent le type d'opération sur le stock. Ils déterminent l'écriture comptable générée et le sens du mouvement. Les principaux : 101 (entrée contre BC), 122 (retour fournisseur), 201 (sortie pour centre de coûts), 261 (sortie pour ordre de fabrication), 301 (transfert entre divisions), 311 (transfert entre magasins), 501 (entrée sans BC).",
            "L'Inventaire physique (Physical Inventory) est le processus de comptage du stock réel et de mise à jour des données SAP si des écarts sont constatés. Il se déroule en 3 étapes : création du document d'inventaire (MI01), comptage physique et saisie (MI04/MI07), comptabilisation des différences (MI07). Un écart entre stock SAP et stock réel génère une écriture comptable (ajustement de stock).",
            "Les transferts de stock (Stock Transfers) permettent de déplacer des articles entre deux endroits. Transfert en un pas (1-step) : mouvement immédiat, MIGO mouvement 311 (même division) ou 301 (inter-division). Transfert en deux pas (2-step) : d'abord un prélèvement (313), puis une mise en stock (315). Le 2-step est utilisé quand on veut suivre le stock 'en transit'.",
            "Le stock spécial comprend : le stock de consignation fournisseur (article chez le client, payé à la consommation), le stock projet (affecté à un WBS ou ordre), le stock client (appartenant au client mais chez nous). Ces types de stocks sont gérés avec des indicateurs spéciaux dans MIGO."
          ],
          keyConcepts: [
            { term: "Stock libre-utilisation (Unrestricted)", definition: "Stock disponible pour utilisation immédiate. Valorisé au prix standard ou moyen. Base du calcul MRP." },
            { term: "Type de mouvement (Movement Type)", definition: "Code 3 chiffres définissant le type d'opération stock. Détermine l'écriture comptable et le sens du flux." },
            { term: "Inventaire physique", definition: "Comptage réel du stock et ajustement dans SAP si écart. 3 étapes : MI01 (document) → comptage → MI07 (comptabilisation écarts)." },
            { term: "Transfert 2-step", definition: "Prélèvement (313) puis mise en stock (315). Permet de suivre le stock 'en transit' entre deux magasins ou divisions." },
            { term: "Stock de consignation", definition: "Articles du fournisseur stockés chez le client. Payés seulement à la consommation. Gestion spéciale dans MIGO." },
          ],
          tcodes: [
            { code: "MIGO", description: "Saisir les mouvements de marchandises (toutes catégories)" },
            { code: "MI01", description: "Créer un document d'inventaire physique" },
            { code: "MI04", description: "Saisir les résultats du comptage" },
            { code: "MI07", description: "Comptabiliser les différences d'inventaire" },
            { code: "MB1A", description: "Sortie de marchandises (méthode alternative)" },
          ],
        },
        {
          id: "l3-2",
          title: "Cycle counting, valorisation des mouvements et stocks spéciaux avancés",
          content: [
            "Le Cycle Counting est une méthode d'inventaire continue qui complète l'inventaire annuel. Au lieu de compter tout le stock en une fois, les articles sont répartis en classes ABC selon leur valeur ou leur fréquence de mouvement, puis comptés selon une fréquence adaptée. Classe A (forte valeur, comptage 4-12 fois/an), classe B (valeur moyenne, 2-4 fois/an), classe C (faible valeur, 1 fois/an). Activé via la transaction MIBC et le code de cycle dans la fiche article.",
            "L'Inventaire Tournant Continu (Continuous Inventory) est une variante où les comptages sont planifiés tout au long de l'année avec un calendrier. Avantage : aucune interruption de production, charge de travail lissée. Le compteur n'a pas à connaître la quantité système (comptage à l'aveugle ou non, paramétrable).",
            "Lors d'un mouvement de stock, SAP génère plusieurs documents simultanément : un Document Matière (Material Document, table MKPF/MSEG) qui trace le flux physique ; une ou plusieurs Pièces Comptables FI (table BKPF/BSEG dans ECC, ACDOCA dans S/4HANA) pour l'impact financier ; une Pièce Contrôle de Gestion CO si centre de coûts impliqué (mouvements 201, 261). La transaction MB03 affiche un document matière avec ses pièces FI/CO liées.",
            "Les types de mouvement à connaître absolument pour la certification : 101 (entrée GR contre BC), 102 (annulation 101), 122 (retour fournisseur), 161 (retour client en magasin), 201 (sortie pour centre de coûts), 202 (annulation 201), 251 (sortie pour vente — utilisé par SD), 261 (sortie pour ordre fab), 311 (transfert magasin en 1-step), 313/315 (transfert 2-step), 411 (transfert vers stock projet), 501 (entrée sans BC), 551 (mise au rebut), 601 (sortie pour livraison client).",
            "Le stock projet (Project Stock) est un stock affecté à un WBS ou à un ordre — il n'est consommable que pour ce projet. Très utilisé dans les industries projet (BTP, défense, aéronautique). Le mouvement 411-Q transfère du stock libre vers le stock projet. Le stock client (E) appartient au client mais est physiquement dans nos entrepôts, typique du Make-to-Order. Le stock fournisseur consigné (K) reste propriété fournisseur jusqu'à consommation (mouvement spécial 411-K pour retirer du stock consigné vers stock libre lors de l'utilisation).",
            "Les blocages de stock (Stock Block) peuvent être manuels (transaction MB1B avec mouvement 344 pour bloquer, 343 pour débloquer) ou automatiques (résultat d'un contrôle qualité). Un stock bloqué reste comptabilisé dans la valeur du stock total mais ne participe pas au calcul MRP — il n'est pas considéré disponible. À la différence du stock QI (en contrôle qualité) qui peut basculer en stock libre après acceptation du contrôle (mouvement 321) ou être renvoyé fournisseur (mouvement 122)."
          ],
          keyConcepts: [
            { term: "Cycle Counting (CC)", definition: "Inventaire continu basé sur classes ABC. Articles A comptés fréquemment, C rarement. Activé via MIBC et code cycle dans fiche article." },
            { term: "Document matière (MKPF/MSEG)", definition: "Pièce MM créée à chaque mouvement. MKPF = en-tête, MSEG = lignes. Numérotation séquentielle, immuable." },
            { term: "Stock projet (Q)", definition: "Stock affecté à un WBS ou ordre. Consommable uniquement pour ce projet. Mouvement 411-Q pour affecter." },
            { term: "Stock client (E)", definition: "Stock appartenant au client mais chez nous. Make-to-Order. Géré séparément du stock libre." },
            { term: "Stock consigné (K)", definition: "Stock du fournisseur chez nous. Propriété fournisseur jusqu'à consommation. Pas de valeur dans nos comptes tant que non consommé." },
            { term: "Mouvement 311", definition: "Transfert entre magasins dans la même division, en 1-step (immédiat). Pour 2-step longue distance, utiliser 313+315." },
            { term: "Mouvement 551", definition: "Mise au rebut (Scrapping). Sortie définitive du stock avec écriture en compte de pertes. Utilisé pour articles obsolètes ou détériorés." },
          ],
          tcodes: [
            { code: "MIBC", description: "Activer le Cycle Counting et définir les classes ABC" },
            { code: "MI31", description: "Créer un document d'inventaire en masse" },
            { code: "MI24", description: "Liste de comptage à imprimer pour le terrain" },
            { code: "MB03", description: "Afficher un document matière et ses pièces comptables liées" },
            { code: "MB1B", description: "Transferts de stock (changement type de stock)" },
            { code: "MMBE", description: "Stock par article : libre, bloqué, QI, projet, client, transit" },
          ],
        },
      ],
      quiz: [
        {
          id: "q3-1",
          question: "Le type de mouvement 261 dans SAP MM correspond à :",
          options: [
            "Réception de marchandises contre bon de commande",
            "Sortie de marchandises pour un ordre de fabrication (consommation composants)",
            "Transfert entre divisions",
            "Retour fournisseur"
          ],
          correctIndex: 1,
          explanation: "Le mouvement 261 est la sortie de stock pour consommation dans un ordre de fabrication (goods issue for production order). 101 = entrée GR contre BC, 201 = sortie pour centre de coûts, 301 = transfert inter-division, 122 = retour fournisseur."
        },
        {
          id: "q3-2",
          question: "Lors d'un inventaire physique dans SAP, quelle transaction est utilisée pour comptabiliser les écarts de stock ?",
          options: ["MI01", "MI04", "MI07", "MIGO"],
          correctIndex: 2,
          explanation: "MI07 comptabilise les différences d'inventaire — c'est la dernière étape. MI01 crée le document d'inventaire, MI04 saisit les quantités comptées, MI07 comptabilise l'ajustement de stock si écart."
        },
        {
          id: "q3-3",
          question: "La différence entre un transfert 1-step et un transfert 2-step est :",
          options: [
            "Le 1-step est inter-division, le 2-step est intra-division",
            "Le 2-step permet de suivre le stock en transit (prélèvement puis mise en stock distinctes)",
            "Le 1-step nécessite une approbation, le 2-step est automatique",
            "Il n'y a pas de différence comptable entre les deux"
          ],
          correctIndex: 1,
          explanation: "Le transfert 2-step (313 + 315) permet de tracer le stock 'en transit' : d'abord prélevé de l'émetteur, puis réceptionné chez le récepteur. Utile pour les transferts longue distance. Le 1-step (311/301) est immédiat."
        },
        {
          id: "q3-4",
          question: "Le stock de consignation fournisseur signifie que :",
          options: [
            "Le stock est bloqué pour contrôle qualité",
            "Les articles appartiennent au fournisseur et sont stockés chez le client, payés à la consommation",
            "Le stock est réservé pour un client spécifique",
            "Les articles sont en cours de transit entre deux divisions"
          ],
          correctIndex: 1,
          explanation: "La consignation fournisseur : l'article est physiquement chez le client mais appartient encore au fournisseur. Le client ne le paye que lorsqu'il le consomme (mouvement MIGO spécial). Réduction du besoin en fonds de roulement."
        },
        {
          id: "q3-5",
          question: "Le stock 'bloqué' (Blocked Stock) dans SAP représente :",
          options: [
            "Un stock réservé pour la production",
            "Un stock reçu mais non encore accepté, en attente d'inspection",
            "Un stock dont le prix est bloqué pour modification",
            "Un stock excédentaire envoyé en surplus"
          ],
          correctIndex: 1,
          explanation: "Le stock bloqué contient les articles reçus (GR) mais dont la qualité n'est pas encore validée. Il ne peut pas être utilisé pour la production ou la vente. Après acceptation, il est transféré en stock libre. Après refus, il est retourné au fournisseur."
        },
        {
          id: "q3-6",
          question: "Lors d'un inventaire physique, un écart entre le stock SAP et le stock réel compté génère :",
          options: [
            "Un blocage de la division jusqu'à correction manuelle",
            "Une écriture comptable d'ajustement de stock",
            "L'annulation du dernier mouvement de stock",
            "Un message d'alerte sans impact sur les données"
          ],
          correctIndex: 1,
          explanation: "Lors de MI07, si l'écart dépasse la tolérance, SAP génère automatiquement une écriture comptable pour ajuster la valeur du stock (débit ou crédit du compte de stock avec contrepartie sur un compte d'ajustement d'inventaire)."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 4 — Évaluation des stocks et vérification de factures
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch4", number: 4,
      title: "Évaluation des stocks et vérification de factures",
      weight: 14, isPremium: true,
      lessons: [
        {
          id: "l4-1",
          title: "Prix standard vs prix moyen pondéré et vérification de facture (MIRO)",
          content: [
            "SAP propose deux méthodes de valorisation des stocks : le prix standard (Standard Price, indicateur de prix 'S') et le prix moyen mobile (Moving Average Price, indicateur 'V'). Le choix s'effectue dans la vue Comptabilité de la fiche article.",
            "Avec le prix standard, toutes les entrées en stock sont valorisées au même prix fixé dans la fiche article. Les écarts entre le prix réel (facture) et le prix standard sont comptabilisés dans des comptes d'écart de prix. Utilisé pour les produits fabriqués (FERT, HALB) dont le coût est calculé par CO-PC.",
            "Avec le prix moyen mobile (MAP), le prix se recalcule à chaque entrée en stock. Nouvel MAP = (valeur stock existant + valeur entrée) / (quantité stock + quantité entrée). Utilisé pour les matières premières achetées (ROH) dont le prix varie selon les fournisseurs et les marchés.",
            "La Vérification de Facture (Invoice Verification, MIRO) enregistre la facture fournisseur dans SAP. Elle compare la facture avec le BC et la GR (3-Way Match). Si des écarts de prix existent : avec prix standard → écart comptabilisé en compte d'écart de prix ; avec MAP → le prix moyen est recalculé (si stock suffisant) ou écart en compte de charges.",
            "L'écriture comptable de MIRO : Débit GR/IR (solde le compte de transition de la GR) / Crédit Fournisseur (crée la dette fournisseur). Si écart de prix : Débit/Crédit Compte d'écart de prix. Après MIRO, le paiement (F110 ou FB60) soldra le compte fournisseur."
          ],
          keyConcepts: [
            { term: "Prix standard (S)", definition: "Prix fixe de valorisation. Écarts réel/standard → comptes d'écart. Utilisé pour produits fabriqués (FERT/HALB)." },
            { term: "Prix moyen mobile (V / MAP)", definition: "Prix recalculé à chaque entrée. Se met à jour automatiquement. Utilisé pour matières premières achetées (ROH)." },
            { term: "MIRO", definition: "Transaction de vérification de facture fournisseur. 3-Way Match BC/GR/Facture. Génère la dette fournisseur." },
            { term: "Écart de prix", definition: "Différence entre prix facturé et prix standard. Comptabilisé en compte d'écart si prix standard. Intègre le MAP si prix moyen." },
            { term: "Compte GR/IR (solde)", definition: "Débité lors de MIRO pour solder la transition créée lors de la GR. Compte soldé = livraison reçue et facturée." },
          ],
          tcodes: [
            { code: "MIRO", description: "Saisir une facture fournisseur (vérification de facture)" },
            { code: "MIR7", description: "Afficher une facture fournisseur (sans modification)" },
            { code: "MRBR", description: "Débloquer les factures bloquées pour paiement" },
            { code: "MR11", description: "Entretien du compte GR/IR (régularisation)" },
          ],
        },
        {
          id: "l4-2",
          title: "Écarts de prix, révaluation, dépréciation et split valuation",
          content: [
            "Les Écarts de Prix (Price Differences) apparaissent lorsque le prix réel d'achat diffère du prix standard. Avec un article à prix standard (S), l'écart est immédiatement comptabilisé sur un compte d'écart (Price Difference Account). Avec un prix moyen mobile (V), l'écart modifie le MAP — sauf si le stock est insuffisant pour absorber l'écart (cas de stock négatif ou faible), où l'écart va aussi sur un compte d'écart de prix.",
            "La détermination automatique des comptes (Automatic Account Determination) est une configuration centrale : la transaction OBYC définit, pour chaque type de transaction (clé OBYC : BSX pour stocks, WRX pour GR/IR, PRD pour écarts de prix, GBB pour sorties, etc.), le compte de grand livre à mouvementer en fonction du groupe d'évaluation et du type d'article. C'est le pont essentiel entre MM et FI — un consultant MM doit comprendre ce paramétrage.",
            "La Révaluation des stocks (Material Revaluation, MR21) permet de modifier manuellement le prix d'un article. Cas typiques : ajustement à la valeur de marché, correction d'erreur, prix obsolète. La transaction génère une écriture de révaluation : Débit/Crédit Stock pour l'écart valeur × quantité, contrepartie sur compte d'écart. À ne pas confondre avec MR22 qui n'écrit pas dans la base.",
            "La Dépréciation (Lowest Value Principle / Niederstwertprinzip) est une obligation légale en clôture annuelle : les stocks doivent être valorisés au plus bas entre coût d'acquisition et valeur de marché actuelle. Les transactions MRN0 (analyse mouvement de stock), MRN1 (valeur de marché), MRN2 (rotation lente) calculent automatiquement les dépréciations. La dépréciation est ensuite comptabilisée par MR21 ou MRDD.",
            "La Split Valuation permet de valoriser le même article à des prix différents selon des critères de séparation (split). Exemples : par origine fournisseur (interne vs externe), par lot, par qualité (premier choix vs second choix). On crée des Catégories de Valorisation (Valuation Category, ex: B pour Batch, H pour Origin) et des Types de Valorisation (Valuation Type, ex: INTERN, EXTERN). Le stock est tenu et valorisé séparément pour chaque type. Activation : OMWC + vue Comptabilité de la fiche article.",
            "Les écritures comptables typiques d'un écart en MIRO avec prix standard : Débit GR/IR 1000€ (solde transition), Crédit Fournisseur 1100€ (dette), Débit Compte écart de prix 100€ (constatation de l'écart). Si le prix MAP est utilisé et stock suffisant : pas de compte d'écart, le MAP se recalcule automatiquement. Cette différence comptable est une question récurrente à l'examen."
          ],
          keyConcepts: [
            { term: "OBYC", definition: "Transaction de paramétrage de la détermination automatique des comptes MM-FI. Clés BSX (stocks), WRX (GR/IR), PRD (écarts), GBB (sorties)." },
            { term: "Compte d'écart de prix (PRD)", definition: "Compte recevant la différence prix réel / prix standard. Utilisé seulement avec prix S, ou prix V si stock insuffisant." },
            { term: "MR21 — Révaluation", definition: "Modification manuelle du prix article. Génère une écriture comptable de révaluation. Utilisée pour correction ou ajustement à la valeur de marché." },
            { term: "Dépréciation (Lowest Value)", definition: "Principe du moins-disant en clôture : stock valorisé au minimum entre coût et valeur de marché. Calculé par MRN0/MRN1/MRN2." },
            { term: "Split Valuation", definition: "Valorisation séparée d'un même article selon critères (origine, lot, qualité). Catégorie + Type. Activée par OMWC." },
            { term: "Compte BSX", definition: "Clé OBYC pour le compte de stock du grand livre. Définit l'imputation Débit lors d'une GR." },
            { term: "Compte GBB", definition: "Clé OBYC pour les contre-parties des sorties de stock (consommation). Sous-clés VBR (centre coûts), VAX (vente), AUF (ordre fab)." },
          ],
          tcodes: [
            { code: "OBYC", description: "Configuration : détermination automatique des comptes MM-FI" },
            { code: "MR21", description: "Révaluation manuelle du prix d'un article" },
            { code: "MRN0", description: "Analyse de la rotation des stocks pour dépréciation" },
            { code: "MRN1", description: "Valorisation au plus bas (valeur de marché)" },
            { code: "OMWC", description: "Configuration de la Split Valuation" },
            { code: "MR51", description: "Documents matières par article et période" },
          ],
        },
      ],
      quiz: [
        {
          id: "q4-1",
          question: "Pour quel type d'article SAP recommande-t-il généralement le prix standard (S) ?",
          options: [
            "Les matières premières achetées à prix variable",
            "Les produits finis et semi-finis fabriqués en interne",
            "Les articles de consommation courante",
            "Les services externes"
          ],
          correctIndex: 1,
          explanation: "Le prix standard est recommandé pour les produits fabriqués (FERT, HALB) car leur coût est calculé par CO-PC (calcul de coût standard). Le prix moyen mobile est préféré pour les matières premières achetées (ROH) dont le prix varie."
        },
        {
          id: "q4-2",
          question: "Avec le prix moyen mobile (MAP), que se passe-t-il lors d'une entrée en stock ?",
          options: [
            "Le prix reste identique, un écart est comptabilisé",
            "Le prix moyen est recalculé : (valeur stock + valeur entrée) / (quantité stock + quantité entrée)",
            "Le nouveau prix remplace l'ancien sans calcul",
            "Le stock est valorisé au FIFO"
          ],
          correctIndex: 1,
          explanation: "Le MAP se recalcule automatiquement à chaque entrée : nouvel MAP = (valeur stock actuel + valeur entrée) / (quantité actuelle + quantité entrante). Ainsi le stock reflète toujours le coût moyen réel des achats."
        },
        {
          id: "q4-3",
          question: "La transaction MIRO génère comme écriture comptable principale :",
          options: [
            "Débit Stock / Crédit GR/IR",
            "Débit GR/IR / Crédit Fournisseur",
            "Débit Fournisseur / Crédit Banque",
            "Débit Charges / Crédit Stock"
          ],
          correctIndex: 1,
          explanation: "MIRO génère : Débit GR/IR (solde le compte transitoire créé lors de la GR) / Crédit Fournisseur (crée la dette). Si écart de prix, une 3ème ligne : Débit/Crédit compte d'écart de prix."
        },
        {
          id: "q4-4",
          question: "MRBR est utilisée pour :",
          options: [
            "Saisir une facture fournisseur",
            "Débloquer des factures bloquées pour paiement",
            "Régulariser le compte GR/IR",
            "Afficher les mouvements de stock"
          ],
          correctIndex: 1,
          explanation: "MRBR (Release Blocked Invoices) permet de débloquer les factures bloquées automatiquement par SAP lors de MIRO (blocage pour écart de prix ou de quantité dépassant la tolérance définie)."
        },
        {
          id: "q4-5",
          question: "Le solde du compte GR/IR représente :",
          options: [
            "Les factures fournisseurs payées mais non livrées",
            "Les livraisons reçues non encore facturées, ou les factures saisies sans livraison correspondante",
            "Les écarts de prix entre prix standard et prix réel",
            "La valeur totale du stock disponible"
          ],
          correctIndex: 1,
          explanation: "Le solde GR/IR représente les 'en cours' : crédit = marchandises reçues non encore facturées ; débit = factures saisies sans GR correspondante. Ce compte doit être régulièrement analysé (MR11)."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 5 — Planification des besoins (MRP)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch5", number: 5,
      title: "Planification des besoins matières (MRP)",
      weight: 16, isPremium: true,
      lessons: [
        {
          id: "l5-1",
          title: "MRP : concepts, paramètres et exécution",
          content: [
            "Le MRP (Material Requirements Planning / Planification des besoins matières) est le processus automatique de planification des approvisionnements et de la production. Il calcule ce qu'il faut commander ou fabriquer, en quelle quantité et pour quand, afin de satisfaire les besoins à venir sans rupture de stock.",
            "Les paramètres MRP de la fiche article sont configurés dans les vues MRP 1 à 4. Le Type MRP (MRP Type) détermine le mode de planification : PD (planification des besoins standard), VB (point de réapprovisionnement), ND (pas de planification). Le paramètre de taille de lot (Lot Sizing Procedure) détermine comment SAP regroupe les besoins : EX (exact), FX (quantité fixe), MB (quantité minimale), WB (hebdomadaire), etc.",
            "Le délai de livraison prévu (Planned Delivery Time) dans la vue Achats indique le nombre de jours entre la commande et la réception. Le délai de réapprovisionnement total (Total Replenishment Lead Time) comprend aussi le délai de traitement interne. Ces délais sont critiques pour calculer les dates de commande.",
            "L'exécution du MRP peut être lancée à la division (MD01N) ou pour un article spécifique (MD03). Le MRP analyse les besoins (commandes clients, ordres de fabrication, demandes planifiées) et les disponibilités (stock, entrées planifiées) pour calculer les manques (Net Requirements). Il crée ensuite des propositions de commande (Planned Orders pour fabrication, Purchase Requisitions pour achats).",
            "La liste MRP (MD04) est l'outil de base du planificateur. Elle montre pour chaque article : les besoins (demand), les entrées planifiées (supplies) et le stock projeté dans le temps. Le planificateur peut y convertir les propositions MRP en ordres réels, reprogrammer des livraisons ou analyser des exceptions."
          ],
          keyConcepts: [
            { term: "Type MRP (MRP Type)", definition: "PD=planification standard, VB=point de réappro, ND=pas de planification. Détermine comment SAP gère cet article dans le MRP." },
            { term: "Proposition de commande (Planned Order)", definition: "Ordre créé automatiquement par le MRP pour la fabrication. Peut être converti en ordre de production par PP." },
            { term: "Demande d'achat MRP (PR)", definition: "Créée automatiquement par le MRP pour l'approvisionnement externe. Convertie en BC par les acheteurs (ME59N)." },
            { term: "Liste MRP (MD04)", definition: "Vue interactive du planificateur : besoins, stock projeté, entrées planifiées. Outil de pilotage quotidien." },
            { term: "Taille de lot (Lot Sizing)", definition: "EX=exact, FX=quantité fixe, WB=semaine. Détermine comment SAP regroupe les besoins en ordres d'approvisionnement." },
          ],
          tcodes: [
            { code: "MD01N", description: "Lancer le MRP pour une division (MRP total)" },
            { code: "MD03", description: "Lancer le MRP pour un article individuel" },
            { code: "MD04", description: "Afficher la liste MRP (vue planificateur)" },
            { code: "MD07", description: "Vue d'ensemble des stocks et besoins (liste courante)" },
            { code: "MD06", description: "Afficher les exceptions MRP (articles nécessitant action)" },
          ],
        },
        {
          id: "l5-2",
          title: "MRP Live S/4HANA, MPS, prévisions et stratégies de planification",
          content: [
            "MRP Live (transaction MD01N) est la nouvelle version du MRP introduite avec S/4HANA. Au lieu d'écrire d'abord en mémoire puis de sauvegarder en base (comme le MRP classique MD01), MRP Live exécute toute la planification directement dans HANA via des procédures stockées. Résultats : performance × 5 à 10, planification de millions d'articles en quelques minutes. Les paramètres sont conservés mais la mécanique interne est totalement différente.",
            "Le MPS (Master Production Scheduling) est une variante du MRP pour les articles stratégiques (produits finis, articles à long délai, composants critiques). Le type MRP M0/M1/M2 active le MPS. Le planificateur valide manuellement les propositions MPS avant qu'elles ne déclenchent le MRP des composants. Permet de stabiliser la production : les articles stratégiques ne sont planifiés que par exception, et leurs sous-composants suivent.",
            "Les Stratégies de Planification (Planning Strategy) déterminent la logique de couverture des besoins. Les principales : Stratégie 10 (Make-to-Stock pur — production sur prévision uniquement), Stratégie 20 (Make-to-Order — production sur commande client uniquement), Stratégie 40 (Planning with Final Assembly — prévisions + commandes consommées), Stratégie 50 (Planning without Final Assembly — semi-finis sur prévision, assemblage à la commande). Définies dans la fiche article vue MRP 3 (paramètre Strategy Group).",
            "Les Prévisions (Forecasting) sont calculées par SAP via des modèles statistiques sur l'historique de consommation. Méthodes disponibles : moyenne mobile, lissage exponentiel (1, 2 ou 3 ordres), saisonnalité, tendance. La transaction MP30/MP38 lance le forecast au niveau article. Le résultat alimente la planification basée sur la consommation (Consumption-Based Planning). À distinguer de la planification SOP (Sales & Operations Planning) qui est plus stratégique.",
            "Le Pegging (Demand-Driven Pegging dans S/4HANA) trace l'origine des besoins : le système peut afficher pour une proposition de fabrication, quel besoin client ou quelle exigence l'a déclenchée. Cette traçabilité est essentielle pour la priorisation : si un client important attend une commande, on peut suivre la chaîne d'approvisionnement amont qui en dépend. Vue accessible dans MD04 via l'icône Pegging.",
            "Les Exceptions MRP (MD06) sont des messages générés par le MRP pour signaler les situations à traiter par le planificateur : 'Avancer la livraison', 'Reculer la livraison', 'Réduire la quantité', 'Annulation possible', 'Stock négatif prévu'. Le planificateur doit les analyser quotidiennement. Chaque exception a un code (groupe d'exceptions 1-8) et une priorité. La discipline du planificateur fait la différence entre un MRP qui produit des plans réalistes et un MRP générant du bruit ignoré."
          ],
          keyConcepts: [
            { term: "MRP Live (S/4HANA)", definition: "Nouvelle version du MRP exécutée directement dans HANA via procédures stockées. Performance × 5-10. Toujours préférable au MRP classique." },
            { term: "MPS (Master Production Scheduling)", definition: "Planification dédiée aux articles stratégiques (M0/M1/M2). Validation manuelle avant déclenchement MRP des composants." },
            { term: "Stratégie 10 (MTS)", definition: "Make-to-Stock : production sur prévision pure. Stock alimenté à l'avance, ventes prélevées du stock." },
            { term: "Stratégie 20 (MTO)", definition: "Make-to-Order : production seulement sur commande client. Pas de stock anticipé. Délai client = délai production." },
            { term: "Stratégie 40", definition: "Planning with Final Assembly. Prévisions consommées par les commandes réelles. Compromis MTS/MTO le plus utilisé en industrie." },
            { term: "Pegging", definition: "Traçabilité de la chaîne besoin → approvisionnement. Permet de savoir pourquoi un ordre existe et qui en dépend." },
            { term: "Exception MRP", definition: "Message MRP signalant une situation à traiter (avancer, reculer, annuler). Visible dans MD06. Discipline planificateur clé pour MRP utile." },
          ],
          tcodes: [
            { code: "MD01N", description: "MRP Live S/4HANA — exécution division (HANA optimized)" },
            { code: "MD06", description: "Exceptions MRP par division — outil quotidien planificateur" },
            { code: "MD05", description: "Liste MRP gelée (résultat dernier run)" },
            { code: "MP30", description: "Lancer le forecast statistique sur l'historique de consommation" },
            { code: "MD61", description: "Maintenir les besoins planifiés indépendants (PIR / prévisions)" },
            { code: "MC88", description: "SOP — Sales and Operations Planning (planification stratégique)" },
          ],
        },
      ],
      quiz: [
        {
          id: "q5-1",
          question: "Le type MRP 'PD' dans la fiche article signifie :",
          options: [
            "Pas de planification (No MRP)",
            "Planification des besoins standard (standard MRP)",
            "Point de réapprovisionnement automatique",
            "Planification par programme directeur"
          ],
          correctIndex: 1,
          explanation: "PD (Planning with MRP) est le type MRP standard qui déclenche la planification des besoins. VB est le réapprovisionnement par point de commande. ND (No MRP) désactive la planification pour l'article."
        },
        {
          id: "q5-2",
          question: "La transaction MD04 permet de :",
          options: [
            "Lancer le MRP pour toute une division",
            "Afficher la liste MRP d'un article : besoins, stock projeté, entrées planifiées",
            "Créer une demande d'achat manuelle",
            "Confirmer les propositions de commande en bons de commande"
          ],
          correctIndex: 1,
          explanation: "MD04 affiche la liste MRP pour un article : elle montre dans le temps tous les besoins, les entrées planifiées et le stock projeté. C'est l'outil quotidien du planificateur pour analyser et corriger le plan."
        },
        {
          id: "q5-3",
          question: "Qu'est-ce qu'une 'Planned Order' créée par le MRP ?",
          options: [
            "Un bon de commande envoyé au fournisseur",
            "Une proposition de fabrication interne (ordre de production planifié) que PP peut convertir en ordre de production réel",
            "Une facture planifiée pour provision comptable",
            "Une réservation de stock pour une commande client"
          ],
          correctIndex: 1,
          explanation: "Une Planned Order est une proposition de fabrication créée automatiquement par le MRP. Elle est gérée dans PP : le planificateur ou PP la convertit en ordre de production réel (Production Order) quand il est prêt à lancer la fabrication."
        },
        {
          id: "q5-4",
          question: "Le délai de livraison prévu (Planned Delivery Time) dans la vue Achats de la fiche article est utilisé par le MRP pour :",
          options: [
            "Définir la période de blocage du stock",
            "Calculer la date de commande nécessaire pour recevoir l'article à temps",
            "Déterminer la fréquence du MRP",
            "Calculer le prix de valorisation"
          ],
          correctIndex: 1,
          explanation: "Le Planned Delivery Time indique combien de jours entre la commande et la réception. Le MRP décale la date de commande en arrière (date besoin - délai) pour déterminer quand il faut commander pour éviter la rupture."
        },
        {
          id: "q5-5",
          question: "La transaction MD01N lance :",
          options: [
            "Le MRP pour un seul article",
            "Le MRP pour l'ensemble d'une division",
            "L'inventaire physique",
            "La vérification de facture en masse"
          ],
          correctIndex: 1,
          explanation: "MD01N lance le MRP pour toute une division (Multi-Level MRP). MD03 lance le MRP pour un article individuel. MD01N est typiquement lancé la nuit en batch pour planifier tous les articles de la division."
        },
        {
          id: "q5-6",
          question: "La taille de lot 'EX' (Exact) dans les paramètres MRP signifie que SAP crée des propositions :",
          options: [
            "Avec une quantité fixe prédéfinie",
            "Égales exactement au besoin net calculé",
            "Regroupées par semaine",
            "Avec la quantité minimale de commande uniquement"
          ],
          correctIndex: 1,
          explanation: "La taille de lot EX (Exact Lot Size) crée des propositions d'approvisionnement pour exactement la quantité nécessaire. FX = quantité fixe prédéfinie, WB = regroupement hebdomadaire, MB = quantité minimale."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 6 — Gestion des fournisseurs et info-records
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch6", number: 6,
      title: "Gestion des fournisseurs et sources d'approvisionnement",
      weight: 12, isPremium: true,
      lessons: [
        {
          id: "l6-1",
          title: "Fiche fournisseur, info-records et liste de sources",
          content: [
            "La fiche fournisseur (Vendor Master / Business Partner) est la donnée de base centrale pour les achats. Dans S/4HANA, le fournisseur est géré comme un Business Partner (BP) avec le rôle FLVN00 (fournisseur général) ou FLVN01 (fournisseur). La fiche contient les données générales (adresse, interlocuteurs), les données comptables (groupe de comptes, conditions de paiement, compte de réconciliation FI) et les données achats (devise commande, conditions de livraison, Incoterms).",
            "L'Info-record d'achat (Purchasing Info Record / PIR, ME11) est le lien entre un fournisseur et un article. Il contient les conditions négociées pour cet article chez ce fournisseur : prix, remises, délai de livraison, tolérance. Quand un BC est créé pour cet article/fournisseur, SAP propose automatiquement les conditions de l'info-record. L'info-record est la mémoire des conditions d'achat.",
            "La Liste de Sources (Source List, ME01) indique quels fournisseurs sont autorisés à fournir un article donné dans une division donnée. Elle peut désigner une source fixe (un seul fournisseur pour cet article) ou plusieurs sources. Le MRP utilise la source list pour déterminer automatiquement quel fournisseur contacter lors de la création des DA.",
            "Les Conditions d'achat (Purchasing Conditions) permettent de définir des structures de prix complexes : prix de base, remise quantité, surcharge transport, droits de douane. Elles sont définies dans les info-records ou les contrats-cadres et sont automatiquement appliquées lors de la création des BC."
          ],
          keyConcepts: [
            { term: "Business Partner (BP)", definition: "S/4HANA unifie fournisseurs et clients dans l'objet Business Partner. Rôle FLVN00/FLVN01 pour les fournisseurs." },
            { term: "Info-record d'achat (PIR)", definition: "Conditions négociées pour un couple article/fournisseur : prix, délai, remises. Proposé automatiquement dans les BC. ME11." },
            { term: "Liste de sources (Source List)", definition: "Fournisseurs autorisés pour un article. Utilisée par le MRP pour l'affectation automatique. ME01." },
            { term: "Conditions d'achat", definition: "Structure de prix complexe : prix de base, remises, surcharges. Définies dans info-records ou contrats-cadres." },
          ],
          tcodes: [
            { code: "BP", description: "Créer/modifier un Business Partner (fournisseur dans S/4HANA)" },
            { code: "ME11", description: "Créer un info-record d'achat" },
            { code: "ME12", description: "Modifier un info-record d'achat" },
            { code: "ME01", description: "Maintenir la liste de sources pour un article" },
            { code: "ME1M", description: "Rapport : info-records par article" },
          ],
        },
        {
          id: "l6-2",
          title: "Évaluation fournisseurs, conditions d'achat et détermination de source",
          content: [
            "L'Évaluation Fournisseur (Vendor Evaluation, ME6H/ME61) est un système de notation automatique des fournisseurs sur 5 critères paramétrables : Prix (compétitivité), Qualité (taux de non-conformité), Service (respect des délais), Livraison (quantités correctes), Service externe (pour les sous-traitants). Chaque critère reçoit une note de 1 à 100. La note globale, pondérée selon des poids configurés, oriente le choix du fournisseur lors des futures commandes.",
            "La Détermination de Source (Source Determination) est le processus par lequel SAP affecte automatiquement un fournisseur à une demande d'achat. La hiérarchie des sources : 1) Quota Arrangement (répartition pourcentage entre plusieurs fournisseurs, ME01 onglet Quota), 2) Source List avec source fixe, 3) Contrats-cadres actifs, 4) Info-records valides. Si plusieurs sources sont éligibles, l'évaluation fournisseur peut servir de critère de choix. Activation : OMR0 + Source List avec indicator Source Det.",
            "Le Quota Arrangement (ME01 onglet Quota) répartit l'approvisionnement d'un article entre plusieurs fournisseurs selon des pourcentages : par exemple Fournisseur A 60%, Fournisseur B 30%, Fournisseur C 10%. SAP rééquilibre les quotas en fonction de l'historique des commandes pour respecter le ratio cumulé. Utile pour réduire le risque de dépendance à un seul fournisseur (single sourcing) ou pour partager le volume entre partenaires stratégiques.",
            "Les Conditions d'Achat (Purchasing Conditions) suivent une hiérarchie : Conditions générales du fournisseur (par devise, organisation d'achats), Conditions de l'info-record (article/fournisseur), Conditions de contrat-cadre, Conditions du BC (saisies manuellement). Les conditions plus précises remplacent les plus générales. Les types de conditions : prix de base (PB00), remise quantitative (RA01), surcharge fret (FRB1), TVA (NAVS), droits de douane.",
            "Les Tolérances Fournisseur (Vendor Tolerances) limitent les écarts acceptables : tolérance sur la quantité livrée (sur-livraison ou sous-livraison en %), tolérance sur le prix de la facture (différence prix BC vs facture). Configurées par fournisseur dans la fiche BP, elles permettent à SAP de bloquer ou alerter automatiquement en cas de dépassement. Ex : tolérance prix 5% — au-delà, MIRO bloque la facture pour validation manuelle.",
            "Les Conditions de Paiement (Terms of Payment, OBB8) définissent les délais et escomptes accordés. Code 0001 = 30 jours net, Code 0002 = 14 jours 2% / 30 jours net (escompte 2% si payé en 14 jours). Configurées dans la fiche fournisseur, elles sont automatiquement appliquées dans les BC et factures. Les escomptes saisis lors de MIRO sont automatiquement comptabilisés en compte de produits financiers (gain d'escompte) au moment du paiement par F110."
          ],
          keyConcepts: [
            { term: "Vendor Evaluation (ME6H)", definition: "Système de notation automatique fournisseurs : Prix, Qualité, Service, Livraison. Note 1-100 par critère, pondérée." },
            { term: "Quota Arrangement", definition: "Répartition pourcentage entre fournisseurs (ex: A 60%, B 40%). SAP équilibre selon historique. Réduit dépendance single-source." },
            { term: "Source Determination", definition: "Affectation auto fournisseur à DA. Hiérarchie : quota → source list → contrat → info-record. Activée par indicator Source Det." },
            { term: "Tolérance prix MIRO", definition: "Écart prix BC/facture toléré sans blocage. Au-delà, MIRO bloque pour validation. Configurée par fournisseur." },
            { term: "Conditions paiement (OBB8)", definition: "Délais et escomptes : 0001=30j net, 0002=14j 2% / 30j. Liées à fiche fournisseur, appliquées dans BC et factures." },
            { term: "Type de condition PB00", definition: "Prix de base dans les BC. Type principal de la structure de prix. Suivi par remises (RA01), majorations (FRB1)." },
            { term: "Single sourcing", definition: "Approvisionnement d'un seul fournisseur — risque de rupture. Le quota arrangement permet de diversifier intelligemment." },
          ],
          tcodes: [
            { code: "ME6H", description: "Évaluation fournisseur (notes globale et par critère)" },
            { code: "ME61", description: "Maintenir l'évaluation manuelle d'un fournisseur" },
            { code: "OBB8", description: "Configurer les conditions de paiement" },
            { code: "OMR0", description: "Configurer la détermination de source" },
            { code: "MEK1", description: "Créer une condition d'achat (prix, remise, majoration)" },
            { code: "ME1L", description: "Rapport : commandes ouvertes par fournisseur" },
          ],
        },
      ],
      quiz: [
        {
          id: "q6-1",
          question: "Dans SAP S/4HANA, la fiche fournisseur est gérée via :",
          options: [
            "La transaction FK01 (créer fournisseur)",
            "L'objet Business Partner (transaction BP)",
            "La fiche article MM01",
            "La transaction XK01"
          ],
          correctIndex: 1,
          explanation: "Dans S/4HANA, les fournisseurs et clients sont unifiés dans l'objet Business Partner (BP). Les anciennes transactions FK01/XK01 sont conservées mais délèguent à BP. Le rôle FLVN00/FLVN01 identifie un fournisseur."
        },
        {
          id: "q6-2",
          question: "L'info-record d'achat (PIR) dans SAP contient :",
          options: [
            "Les données de stock par division",
            "Les conditions négociées pour un article chez un fournisseur spécifique",
            "Les paramètres MRP de l'article",
            "Les conditions de paiement générales du fournisseur"
          ],
          correctIndex: 1,
          explanation: "L'info-record d'achat (PIR = Purchasing Info Record) stocke les conditions spécifiques article/fournisseur : prix négocié, remises, délai de livraison, tolérance. Il est automatiquement proposé lors de la création d'un BC pour ce couple."
        },
        {
          id: "q6-3",
          question: "La Source List (ME01) dans SAP MM est utilisée pour :",
          options: [
            "Lister les articles en rupture de stock",
            "Définir les fournisseurs autorisés pour approvisionner un article dans une division",
            "Lister les bons de commande ouverts",
            "Définir les magasins de stockage autorisés"
          ],
          correctIndex: 1,
          explanation: "La Source List définit quels fournisseurs (ou sources internes) sont autorisés pour un article dans une division. Le MRP l'utilise pour affecter automatiquement les DA aux bons fournisseurs lors de la conversion en BC."
        },
        {
          id: "q6-4",
          question: "Quelle transaction crée un info-record d'achat ?",
          options: ["ME21N", "ME11", "ME51N", "ME31K"],
          correctIndex: 1,
          explanation: "ME11 crée un info-record d'achat. ME21N = bon de commande, ME51N = demande d'achat, ME31K = contrat-cadre."
        },
        {
          id: "q6-5",
          question: "Quand un bon de commande est créé pour un article/fournisseur avec un info-record existant, SAP :",
          options: [
            "Ignore l'info-record et utilise le prix catalogue",
            "Propose automatiquement les conditions de l'info-record (prix, délai, remises)",
            "Bloque la commande en attente de validation de l'info-record",
            "Crée un nouvel info-record avec les nouvelles conditions saisies"
          ],
          correctIndex: 1,
          explanation: "SAP propose automatiquement les conditions de l'info-record lors de la création d'un BC : prix, remises, délai de livraison, tolérance. L'acheteur peut les accepter ou les modifier. C'est le principal intérêt de l'info-record."
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 7 — Clôture périodique MM et processus spéciaux
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch7", number: 7,
      title: "Clôture périodique MM et processus spéciaux",
      weight: 8, isPremium: true,
      lessons: [
        {
          id: "l7-1",
          title: "Clôture MM, réapprovisionnement spécial et sous-traitance",
          content: [
            "La clôture de période MM comprend plusieurs traitements obligatoires en fin de mois. Le basculement de période (MMPV) fait avancer le calendrier MM d'une période : les nouvelles périodes s'ouvrent pour les mouvements de stock. En SAP, on ne peut comptabiliser des mouvements de stock que dans les périodes ouvertes (période courante et une période précédente au maximum).",
            "La vérification du compte GR/IR (MR11) analyse le solde du compte de transition pour identifier les écarts non soldés : réceptions sans facture, factures sans réception. Ces en-cours doivent être régularisés (provision ou correction) à la clôture.",
            "La sous-traitance (Subcontracting) est un processus d'achat spécial : l'entreprise envoie des composants à un sous-traitant qui les transforme et les renvoie en produits finis. Dans SAP, la DA/BC de sous-traitance a le type d'article 'L'. Lors de la GR, les composants sont automatiquement sortis du stock de l'entreprise.",
            "Le réapprovisionnement par consommation (Consumption-Based Planning) avec point de commande (VB) est une alternative simple au MRP : quand le stock tombe sous un seuil prédéfini (Point de Commande), une DA est créée automatiquement pour un quantité fixe (Quantité de Réapprovisionnement). Utilisé pour les articles de faible valeur ou à consommation régulière.",
            "La gestion des lots (Batch Management) permet de tracer les articles par lot de fabrication ou lot de livraison fournisseur. Indispensable pour les industries pharmaceutiques, agro-alimentaires. Chaque lot a ses propres données (date de fabrication, date d'expiration, fournisseur). Les mouvements de stock indiquent le numéro de lot concerné."
          ],
          keyConcepts: [
            { term: "MMPV", definition: "Basculement de période MM. Ouvre la nouvelle période et ferme l'ancienne pour les mouvements de stock. Traitement mensuel obligatoire." },
            { term: "Sous-traitance (Subcontracting)", definition: "Achat spécial : composants envoyés à un tiers pour transformation. BC type 'L'. GR = entrée produit + sortie composants automatique." },
            { term: "Point de commande (VB)", definition: "Réappro automatique quand le stock descend sous un seuil. Alternative simple au MRP pour articles courants." },
            { term: "Gestion des lots (Batch)", definition: "Traçabilité des articles par lot de fab ou lot fournisseur. Obligatoire dans pharma/agro. Date expiration, fournisseur." },
            { term: "MR11", definition: "Régularisation du compte GR/IR en fin de période. Identifie les réceptions sans facture et factures sans réception." },
          ],
          tcodes: [
            { code: "MMPV", description: "Basculement de période MM (clôture de période)" },
            { code: "MR11", description: "Entretien compte GR/IR — régularisation fin de période" },
            { code: "MB5S", description: "Rapport : écarts compte GR/IR par article" },
            { code: "MBGR", description: "Rapport : mouvements de marchandises par raison" },
          ],
        },
        {
          id: "l7-2",
          title: "Stock Transport Order (STO), Inter-Company et flux logistiques avancés",
          content: [
            "Le Stock Transport Order (STO) est un type spécial de bon de commande pour les transferts de stock entre divisions. Il existe deux variantes : STO sans facturation (transfert physique pur, mouvement 351 ou 641 selon le scénario) et STO avec facturation (Inter-Company, lorsque les divisions appartiennent à des sociétés différentes). Le STO standard utilise le type de document UB (sans SD) ou NB (avec SD pour la livraison sortante).",
            "Le scénario STO avec SD intégré (Cross-Company STO) génère un flux logistique complet : 1) Création STO division destinatrice (ME21N type NB), 2) Création livraison sortante division émettrice (VL10B), 3) Picking et expédition (VL02N), 4) Goods Issue divisionnaire (mouvement 641 ou 643), 5) Réception division destinatrice (MIGO 101). Chaque étape génère ses propres documents et écritures comptables. C'est un sujet complexe mais récurrent à l'examen.",
            "L'Inter-Company Billing (Facturation Inter-sociétés) intervient quand le STO est entre deux sociétés différentes du groupe. Une facture inter-company (VF01 type IV) est émise par la société émettrice à la société destinatrice. Cette facture sert au reporting consolidé (élimination des marges intra-groupe) et au respect des prix de transfert (transfer pricing) imposés par les règles fiscales internationales. Configuration via OBYA et VOFM.",
            "Le Cross-Docking est un scénario logistique où la marchandise reçue est expédiée directement sans passer par le stock principal. Optimisation : réduction du temps de stockage, économie de manutention. SAP supporte le cross-docking via le Warehouse Management (WM) ou Extended Warehouse Management (EWM) avec des règles de routage spécifiques.",
            "L'External Service (Service externe, type d'article DIEN) gère les achats de prestations sans flux physique : conseil, maintenance, formation. Le BC de service utilise une structure spéciale : ligne de service avec définition d'unité (heures, jours, forfait) et limite (montant max). La réception (Service Entry Sheet, ML81N) confirme la prestation effectuée. La facture suit un flux MIRO standard. Les services sont passés en charge directement (pas de stock).",
            "Le Subcontracting Cockpit (ME2O) est un outil de pilotage de la sous-traitance qui affiche pour chaque article sous-traité : la quantité commandée au sous-traitant, les composants à lui fournir, le stock déjà chez lui (Stock at Subcontractor — type O), les besoins. Permet au planificateur de gérer les flux composants → sous-traitant et la régularisation des stocks. La transaction MIGO mouvement 541 envoie les composants au sous-traitant, 542 les récupère."
          ],
          keyConcepts: [
            { term: "Stock Transport Order (STO)", definition: "BC spécial pour transfert entre divisions. Type UB (sans SD) ou NB (avec SD). Mouvements 351, 641, 643 selon scénario." },
            { term: "Cross-Company STO", definition: "STO entre sociétés différentes. Génère facturation inter-company (VF01 type IV) pour reporting consolidé et transfer pricing." },
            { term: "Inter-Company Billing", definition: "Facture entre sociétés du groupe. Importante pour consolidation (élimination marges intra-groupe) et règles fiscales internationales." },
            { term: "Stock at Subcontractor (O)", definition: "Stock physiquement chez le sous-traitant. Reste propriété de l'entreprise. Suivi via ME2O. Mouvements 541 (envoi) / 542 (retour)." },
            { term: "Service Entry Sheet (ML81N)", definition: "Document confirmant une prestation de service externe. Équivalent de la GR pour les services. Déclenche la facture fournisseur de service." },
            { term: "Cross-Docking", definition: "Réception et expédition sans passage par stock. Optimisation logistique. Géré via WM ou EWM avec routage spécifique." },
            { term: "Type document achat UB/NB", definition: "UB = STO simple sans SD. NB = STO avec SD intégré (livraison sortante via VL10B). Choix selon besoin de gestion logistique." },
          ],
          tcodes: [
            { code: "ME21N type UB", description: "Créer un STO simple (Stock Transport Order sans SD)" },
            { code: "ME21N type NB", description: "Créer un STO avec processus SD (livraison sortante intégrée)" },
            { code: "VL10B", description: "Créer une livraison sortante depuis un STO" },
            { code: "ML81N", description: "Saisir un Service Entry Sheet (réception prestation service)" },
            { code: "ME2O", description: "Subcontracting Cockpit — pilotage des sous-traitants" },
            { code: "OBYA", description: "Configuration de la facturation inter-company (transfer pricing)" },
          ],
        },
      ],
      quiz: [
        {
          id: "q7-1",
          question: "La transaction MMPV dans SAP MM est utilisée pour :",
          options: [
            "Vérifier les factures fournisseurs en masse",
            "Ouvrir la nouvelle période MM et fermer l'ancienne (basculement de période)",
            "Planifier le MRP pour toute la division",
            "Solder les comptes GR/IR de fin de période"
          ],
          correctIndex: 1,
          explanation: "MMPV (Open and Close MM Periods) bascule le calendrier MM d'une période. Sans ce traitement, les nouveaux mouvements de stock ne peuvent pas être comptabilisés dans la nouvelle période. C'est un traitement mensuel obligatoire."
        },
        {
          id: "q7-2",
          question: "Dans un processus de sous-traitance SAP, lors de la réception du produit fini (GR) :",
          options: [
            "Seul le produit fini entre en stock, les composants restent",
            "Le produit fini entre en stock ET les composants fournis au sous-traitant sont automatiquement sortis du stock",
            "Un bon de livraison est créé automatiquement pour les composants",
            "Le sous-traitant doit confirmer la consommation manuellement"
          ],
          correctIndex: 1,
          explanation: "La GR de sous-traitance est automatique : entrée du produit fini + sortie automatique des composants envoyés au sous-traitant (mouvement 543). SAP les sort du stock de composants car ils ont été consommés par le sous-traitant."
        },
        {
          id: "q7-3",
          question: "Le type de planification MRP 'VB' (point de réapprovisionnement) crée une DA automatique :",
          options: [
            "Quand la commande client est créée",
            "Quand le niveau de stock descend sous le point de commande prédéfini",
            "Lors de l'exécution du MRP standard MD01N",
            "Quotidiennement à une heure programmée"
          ],
          correctIndex: 1,
          explanation: "Avec le type VB, SAP surveille le niveau de stock. Quand il descend sous le Point de Commande (défini dans la fiche article MRP 1), une DA est automatiquement créée pour la quantité de réapprovisionnement définie."
        },
        {
          id: "q7-4",
          question: "La gestion des lots (Batch Management) est particulièrement importante dans :",
          options: [
            "La comptabilité analytique",
            "Les industries pharmaceutiques et agro-alimentaires pour la traçabilité",
            "La gestion des immobilisations",
            "Les projets de construction"
          ],
          correctIndex: 1,
          explanation: "La gestion des lots est critique dans les industries réglementées (pharma, agro, chimie) où la traçabilité complète est obligatoire : quel lot de matière première dans quel lot de produit fini, date d'expiration, rappel de lot, etc."
        },
        {
          id: "q7-5",
          question: "MR11 dans la clôture MM périodique sert à :",
          options: [
            "Lancer le MRP de clôture",
            "Identifier et régulariser les écarts du compte GR/IR (réceptions sans facture)",
            "Générer le rapport de stock à la clôture",
            "Fermer les bons de commande expirés"
          ],
          correctIndex: 1,
          explanation: "MR11 analyse le compte GR/IR pour identifier les en-cours non soldés : marchandises reçues non encore facturées (GR sans facture) ou factures saisies sans réception correspondante. Ces positions doivent être régularisées à la clôture."
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS DU SIMULATEUR D'EXAMEN MM (40 questions)
// ═══════════════════════════════════════════════════════════════════
export const mmMockExamQuestions = [
  // — Ch1 Structures & données de base (5 questions) ─────────────
  { id:"e1", chapter:"Structures organisationnelles", question:"Quelle entité SAP MM est responsable de la gestion des stocks et du MRP ?", options:["Société (Company Code)","Division (Plant)","Organisation d'achats","Magasin (Storage Location)"], correctIndex:1, explanation:"La division est l'entité centrale MM pour les stocks et le MRP. Elle est rattachée à une société." },
  { id:"e2", chapter:"Structures organisationnelles", question:"Le magasin (Storage Location) dans SAP MM permet de :", options:["Valoriser les stocks à un prix différent par localisation","Localiser physiquement les articles dans une division sans impact sur la valorisation","Définir les règles d'achat d'une région","Regrouper plusieurs divisions pour la planification"], correctIndex:1, explanation:"Le magasin est purement logistique : il localise les stocks dans la division. La valorisation dépend du domaine de valorisation (= division)." },
  { id:"e3", chapter:"Données de base", question:"Quelle vue de la fiche article contient les paramètres de planification MRP (type MRP, taille de lot, stock de sécurité) ?", options:["Vue Achats","Vue Comptabilité","Vue MRP 1/2/3","Vue Qualité"], correctIndex:2, explanation:"Les vues MRP 1 à 4 contiennent tous les paramètres de planification : type MRP, taille de lot, délais, stock de sécurité, groupe MRP." },
  { id:"e4", chapter:"Données de base", question:"Le type d'article ROH dans SAP correspond à :", options:["Produit fini fabriqué","Semi-fini","Matière première achetée","Article consommable non stocké"], correctIndex:2, explanation:"ROH = Rohstoff = matière première. FERT = produit fini, HALB = semi-fini, HIBE = article consommable." },
  { id:"e5", chapter:"Structures organisationnelles", question:"L'organisation d'achats dans SAP est responsable de :", options:["La planification MRP","La valorisation des stocks","Les négociations fournisseurs et les contrats d'achat","La gestion physique des entrepôts"], correctIndex:2, explanation:"L'organisation d'achats négocie avec les fournisseurs, établit les contrats-cadres et définit les conditions d'achat." },
  // — Ch2 Processus P2P (8 questions) ──────────────────────────
  { id:"e6", chapter:"Processus P2P", question:"La création d'un bon de commande (ME21N) génère-t-il une écriture comptable ?", options:["Oui, débit Stock / crédit Fournisseur","Non, l'écriture intervient lors de la réception de marchandises","Oui, débit Engagements / crédit Budget","Oui, débit GR/IR / crédit Fournisseur"], correctIndex:1, explanation:"La création du BC ne génère aucune écriture comptable. L'impact comptable se produit lors de la GR (MIGO) : Débit Stock / Crédit GR/IR." },
  { id:"e7", chapter:"Processus P2P", question:"MIGO avec mouvement 101 est utilisé pour :", options:["Sortie de stock pour production","Transfert entre divisions","Réception de marchandises contre bon de commande","Inventaire physique"], correctIndex:2, explanation:"MIGO mouvement 101 = Goods Receipt against Purchase Order. C'est l'étape physique de réception dans le processus P2P." },
  { id:"e8", chapter:"Processus P2P", question:"Le compte GR/IR est crédité lors de :", options:["La création du bon de commande","La réception de marchandises (MIGO 101)","La saisie de la facture fournisseur (MIRO)","Le paiement du fournisseur"], correctIndex:1, explanation:"Le compte GR/IR est crédité lors de la GR (et débité lors de MIRO). Il représente les marchandises reçues non encore facturées." },
  { id:"e9", chapter:"Processus P2P", question:"Le 3-Way Match dans SAP compare :", options:["DA / BC / GR","BC / GR / Facture fournisseur","DA / GR / Paiement","BC / Contrat-cadre / Facture"], correctIndex:1, explanation:"Le 3-Way Match = BC (quantité/prix commandés) + GR (quantité reçue) + Facture (quantité/prix facturés). MIRO réalise automatiquement cette comparaison." },
  { id:"e10", chapter:"Processus P2P", question:"ME59N est utilisé pour :", options:["Créer manuellement un bon de commande","Convertir automatiquement des demandes d'achat en bons de commande","Créer un contrat-cadre","Afficher les BC ouverts"], correctIndex:1, explanation:"ME59N (Automatic Generation of POs) convertit automatiquement les DA en BC en utilisant les sources d'approvisionnement définies (info-records, contrats)." },
  { id:"e11", chapter:"Processus P2P", question:"Un Scheduling Agreement (ME31L) est principalement utilisé pour :", options:["Les achats spot occasionnels","Les livraisons planifiées et régulières (production série)","Les appels d'offres compétitifs","Les achats de services"], correctIndex:1, explanation:"Le Scheduling Agreement planifie des livraisons périodiques sur une période donnée. Très utilisé en production série avec des fournisseurs partenaires." },
  { id:"e12", chapter:"Processus P2P", question:"Quelle est l'écriture MIRO (réception facture fournisseur) ?", options:["Débit Stock / Crédit GR/IR","Débit GR/IR / Crédit Fournisseur","Débit Fournisseur / Crédit Banque","Débit Charges / Crédit Fournisseur"], correctIndex:1, explanation:"MIRO génère : Débit GR/IR (solde le compte transitoire) / Crédit Fournisseur (crée la dette). Si écart de prix, une ligne supplémentaire sur le compte d'écart." },
  { id:"e13", chapter:"Processus P2P", question:"MMBE dans SAP MM affiche :", options:["Les bons de commande ouverts","La vue d'ensemble des stocks par article, division et magasin","Les factures fournisseurs en attente","Les paramètres MRP de l'article"], correctIndex:1, explanation:"MMBE (Stock Overview) affiche les stocks en temps réel : stock libre, bloqué, QI, en transit, par division, magasin, lot." },
  // — Ch3 Stocks & mouvements (6 questions) ─────────────────────
  { id:"e14", chapter:"Gestion des stocks", question:"Le mouvement de type 201 dans MIGO correspond à :", options:["Réception contre BC","Sortie pour centre de coûts (consommation interne)","Transfert inter-division","Retour fournisseur"], correctIndex:1, explanation:"Mouvement 201 = Goods Issue to Cost Center. 101 = GR contre BC, 301 = transfert inter-division, 122 = retour fournisseur." },
  { id:"e15", chapter:"Gestion des stocks", question:"MI07 dans le processus d'inventaire physique est utilisé pour :", options:["Créer le document d'inventaire","Saisir les quantités comptées","Comptabiliser les écarts de stock","Afficher les résultats du comptage"], correctIndex:2, explanation:"Le processus inventaire : MI01 (créer document) → MI04 (saisir comptage) → MI07 (comptabiliser les écarts). MI07 est la dernière étape qui génère l'écriture comptable." },
  { id:"e16", chapter:"Gestion des stocks", question:"Le transfert 2-step (313 + 315) versus 1-step (311) permet de :", options:["Transférer entre deux sociétés différentes","Suivre le stock 'en transit' pendant le mouvement","Effectuer le transfert sans document comptable","Valider le transfert par deux personnes différentes"], correctIndex:1, explanation:"Le 2-step permet de suivre le stock en transit : d'abord sorti du magasin source (313), puis reçu au magasin destination (315). Utile pour les transferts longue distance." },
  { id:"e17", chapter:"Gestion des stocks", question:"Le stock de consignation fournisseur signifie :", options:["Le stock est gelé pour audit","Les articles appartiennent au fournisseur, stockés chez l'entreprise, payés à la consommation","Le stock est réservé pour un client","Le stock est en attente de contrôle qualité"], correctIndex:1, explanation:"Consignation : le fournisseur reste propriétaire jusqu'à consommation. L'entreprise ne paie que ce qu'elle consomme. Réduit le BFR." },
  { id:"e18", chapter:"Gestion des stocks", question:"Un écart lors de l'inventaire physique (MI07) génère :", options:["Un blocage de la division","Une écriture comptable d'ajustement de la valeur du stock","L'annulation du dernier mouvement","Une demande d'achat automatique"], correctIndex:1, explanation:"MI07 génère une écriture comptable : ajustement de la valeur du stock au débit ou crédit, avec contrepartie sur un compte d'ajustement d'inventaire." },
  { id:"e19", chapter:"Gestion des stocks", question:"Le stock 'en contrôle qualité' (QI Stock) dans SAP est :", options:["Un stock disponible avec restriction","Un stock en attente de décision qualité, non disponible pour production/vente","Un stock de sécurité pour les urgences","Un stock géré par CO uniquement"], correctIndex:1, explanation:"Le QI Stock est séparé du stock disponible. Il attend la décision du service qualité : usage conforme (transfert en stock libre) ou refus (retour fournisseur/rebut)." },
  // — Ch4 Évaluation & factures (5 questions) ──────────────────
  { id:"e20", chapter:"Évaluation des stocks", question:"Le prix moyen mobile (MAP) se recalcule automatiquement :", options:["Une fois par mois lors de la clôture","À chaque entrée en stock","Uniquement lors du recalcul manuel par le comptable","Lors de l'exécution du MRP"], correctIndex:1, explanation:"Le MAP est dynamique : il se recalcule à chaque entrée en stock selon la formule (valeur stock + valeur entrée) / (quantité stock + quantité entrée)." },
  { id:"e21", chapter:"Évaluation des stocks", question:"Pour les produits finis fabriqués (FERT), SAP recommande généralement :", options:["Le prix moyen mobile","Le prix standard calculé par CO-PC","Le FIFO","Le prix du marché"], correctIndex:1, explanation:"Le prix standard est recommandé pour les produits fabriqués car il est calculé par CO-PC (CK11N). Les écarts réel/standard sont suivis séparément." },
  { id:"e22", chapter:"Vérification facture", question:"MRBR est utilisée pour :", options:["Saisir une facture fournisseur","Débloquer des factures bloquées automatiquement lors de MIRO","Régulariser le compte GR/IR","Générer les paiements fournisseurs"], correctIndex:1, explanation:"MRBR débloque les factures que MIRO a automatiquement bloquées (écart de prix ou quantité > tolérance). L'acheteur ou comptable valide après vérification." },
  { id:"e23", chapter:"Vérification facture", question:"L'écriture générée par MIRO est :", options:["Débit Stock / Crédit GR/IR","Débit GR/IR / Crédit Fournisseur","Débit Fournisseur / Crédit Banque","Débit Charges / Crédit Trésorerie"], correctIndex:1, explanation:"MIRO : Débit GR/IR (solde la transition de la GR) / Crédit Fournisseur (crée la dette). Si prix facturé ≠ BC, ligne écart de prix supplémentaire." },
  { id:"e24", chapter:"Vérification facture", question:"MR11 dans la clôture MM sert à :", options:["Lancer le MRP mensuel","Régulariser et analyser les écarts du compte GR/IR","Solder les commandes d'achat clôturées","Recalculer les prix standards"], correctIndex:1, explanation:"MR11 analyse le compte GR/IR pour identifier les en-cours : livraisons sans facture ou factures sans livraison. Ces positions doivent être régularisées en fin de période." },
  // — Ch5 MRP (6 questions) ─────────────────────────────────────
  { id:"e25", chapter:"MRP", question:"MD04 permet de :", options:["Lancer le MRP pour une division","Afficher la liste MRP (besoins, stocks projetés, propositions) pour un article","Créer une demande d'achat","Convertir des propositions MRP en BC"], correctIndex:1, explanation:"MD04 (MRP List / Stock Requirements List) est la vue quotidienne du planificateur : tableau de bord des besoins, stock projeté et propositions pour un article." },
  { id:"e26", chapter:"MRP", question:"Le type MRP 'PD' signifie :", options:["Pas de planification (No MRP)","Point de réapprovisionnement automatique","Planification des besoins standard (MRP)","Planification par programme directeur de production"], correctIndex:2, explanation:"PD = Planning with MRP = planification des besoins standard. C'est le type MRP le plus courant. VB = réapprovisionnement automatique sur stock. ND = pas de planification." },
  { id:"e27", chapter:"MRP", question:"Une 'Planned Order' créée par le MRP pour un produit fabriqué est :", options:["Un bon de commande automatique vers un fournisseur","Une proposition de fabrication que PP convertit en ordre de production","Une réservation de stock pour les commandes clients","Un bon de transfert interne entre divisions"], correctIndex:1, explanation:"La Planned Order est une proposition créée par le MRP pour la fabrication interne. Elle est gérée dans PP : le module PP la convertit en Production Order (ordre de fabrication réel)." },
  { id:"e28", chapter:"MRP", question:"MD01N lance :", options:["Le MRP pour un seul article","Le MRP pour toute une division (Multi-Level MRP)","L'inventaire physique de la division","La vérification des factures en attente"], correctIndex:1, explanation:"MD01N lance le MRP multi-niveaux pour toute la division. Il planifie tous les articles MRP-actifs de la division. Généralement lancé en batch la nuit." },
  { id:"e29", chapter:"MRP", question:"La taille de lot 'FX' (Fixed Lot Size) dans les paramètres MRP signifie :", options:["SAP commande exactement le besoin net","SAP commande toujours la même quantité fixe prédéfinie","SAP regroupe les besoins par semaine","SAP ne peut pas planifier cet article"], correctIndex:1, explanation:"FX = quantité fixe : SAP crée toujours des propositions pour la même quantité (ex: palettes de 100 unités), indépendamment du besoin réel. EX = exact, WB = hebdomadaire." },
  { id:"e30", chapter:"MRP", question:"Le délai de livraison prévu (Planned Delivery Time) dans la vue Achats est utilisé par le MRP pour :", options:["Calculer la valeur du stock","Calculer la date de commande = date besoin - délai","Définir la fréquence du MRP","Calculer les surcharges de transport"], correctIndex:1, explanation:"Le MRP calcule la date de commande en reculant depuis la date besoin : date commande = date besoin - Planned Delivery Time. Ce délai est critique pour éviter les ruptures." },
  // — Ch6 Fournisseurs & sources (5 questions) ─────────────────
  { id:"e31", chapter:"Gestion fournisseurs", question:"Dans S/4HANA, les fournisseurs sont gérés via :", options:["La transaction FK01","L'objet Business Partner (transaction BP)","La fiche article MM01","La transaction XK01"], correctIndex:1, explanation:"S/4HANA unifie fournisseurs et clients dans le Business Partner (BP). FK01/XK01 sont conservées pour compatibilité mais délèguent à BP." },
  { id:"e32", chapter:"Gestion fournisseurs", question:"L'info-record d'achat (PIR, ME11) contient :", options:["Les paramètres MRP de l'article","Les conditions négociées pour un article chez un fournisseur (prix, délai, remises)","Les données générales du fournisseur (adresse, IBAN)","La liste des articles commandés précédemment"], correctIndex:1, explanation:"L'info-record stocke les conditions commerciales article/fournisseur : prix, remises, délai, tolérance. Il est automatiquement proposé lors de la création d'un BC pour ce couple." },
  { id:"e33", chapter:"Gestion fournisseurs", question:"La Source List (ME01) dans SAP MM :", options:["Liste les mouvements de stock par source","Définit les fournisseurs autorisés pour approvisionner un article","Classe les fournisseurs par note de qualité","Contient l'historique des commandes par fournisseur"], correctIndex:1, explanation:"La Source List définit pour chaque article/division quels fournisseurs (ou sources internes) sont autorisés. Le MRP l'utilise pour l'affectation automatique des DA." },
  { id:"e34", chapter:"Gestion fournisseurs", question:"Lors de la création d'un BC pour un article avec info-record existant, SAP :", options:["Bloque la commande en attente de validation","Propose automatiquement le prix et les conditions de l'info-record","Crée une nouvelle version de l'info-record","Envoie une demande de confirmation au fournisseur"], correctIndex:1, explanation:"Les conditions de l'info-record (prix, remises, délai) sont automatiquement proposées dans le BC. L'acheteur peut les accepter ou les remplacer par de nouvelles conditions." },
  { id:"e35", chapter:"Gestion fournisseurs", question:"ME31K crée :", options:["Une demande d'achat","Un bon de commande ponctuel","Un contrat-cadre (Contract)","Un info-record d'achat"], correctIndex:2, explanation:"ME31K crée un Contrat (Contract), type de contrat-cadre basé sur un volume ou montant total. ME31L crée un Scheduling Agreement (livraisons planifiées)." },
  // — Ch7 Clôture & processus spéciaux (5 questions) ───────────
  { id:"e36", chapter:"Clôture MM", question:"MMPV dans SAP MM est obligatoirement exécuté pour :", options:["Calculer les tarifs d'activité réels","Ouvrir la nouvelle période MM et permettre les mouvements de stock dans cette période","Clôturer les bons de commande expirés","Lancer l'inventaire physique annuel"], correctIndex:1, explanation:"MMPV (Maintain Period) bascule le calendrier MM : ouvre la nouvelle période, ferme l'ancienne. Sans ce traitement, les nouveaux mouvements ne peuvent pas être comptabilisés." },
  { id:"e37", chapter:"Clôture MM", question:"Dans un processus de sous-traitance SAP, lors de la GR du produit transformé :", options:["Seul le produit entre en stock","Le produit entre en stock ET les composants sont automatiquement sortis du stock","Le fournisseur doit saisir la consommation séparément","Un BC supplémentaire est créé pour les composants"], correctIndex:1, explanation:"La GR de sous-traitance génère deux mouvements simultanés : entrée du produit fini (mouvement 101) + sortie automatique des composants fournis (mouvement 543)." },
  { id:"e38", chapter:"Clôture MM", question:"Le type de planification VB (point de réapprovisionnement) déclenche une DA :", options:["Lors de l'exécution quotidienne du MRP MD01N","Quand le stock disponible descend sous le point de commande prédéfini","Lors de la réception d'une commande client","Lors de la clôture mensuelle MM"], correctIndex:1, explanation:"VB surveille le stock disponible en temps réel. Dès que le stock passe sous le point de commande (défini dans MRP 1), une DA est automatiquement créée pour la quantité de réappro." },
  { id:"e39", chapter:"Clôture MM", question:"La gestion des lots (Batch Management) est indispensable dans :", options:["La comptabilité analytique CO","Les industries pharmaceutiques et agro-alimentaires pour la traçabilité","La gestion des projets SAP PS","Le calcul des prix standards CO-PC"], correctIndex:1, explanation:"La gestion par lots est réglementairement obligatoire dans pharma/agro : traçabilité amont/aval, rappel de lot, date d'expiration, lien lot MP / lot PF." },
  { id:"e40", chapter:"Clôture MM", question:"MB5S dans SAP MM est un rapport qui affiche :", options:["Les mouvements de stock de la période","Les écarts du compte GR/IR (livraisons non facturées ou factures sans livraison)","Les articles sous le stock de sécurité","Les BC ouverts par fournisseur"], correctIndex:1, explanation:"MB5S (GR/IR Clearing Analysis) liste les positions du compte GR/IR non soldées : commandes livrées non facturées, ou factures reçues sans livraison correspondante. Complément de MR11." },
  // — Ch1 Structures (5 questions supplémentaires) ─────────────
  { id:"e41", chapter:"Structures organisationnelles", question:"Le domaine de valorisation (Valuation Area) en SAP standard est défini au niveau :", options:["Du mandant","De la société","De la division","Du magasin"], correctIndex:2, explanation:"En SAP standard, le domaine de valorisation = la division (Plant). Cela signifie qu'un même article peut avoir des prix différents selon la division qui le tient. Configuration alternative possible au niveau société mais rare." },
  { id:"e42", chapter:"Données de base", question:"La transaction MM50 sert à :", options:["Créer une fiche article complète","Compléter les vues manquantes pour des articles existants","Supprimer une fiche article","Lister les articles obsolètes"], correctIndex:1, explanation:"MM50 (List Extendable Materials) liste les articles auxquels il manque une vue à compléter. Très utile pour étendre des articles existants à de nouvelles divisions ou organisations d'achats." },
  { id:"e43", chapter:"Données de base", question:"Le numéro d'article SAP peut être :", options:["Uniquement interne (généré par SAP)","Uniquement externe (saisi par l'entreprise)","Interne ou externe selon le paramétrage du type d'article","Toujours alphanumerique de 18 caractères"], correctIndex:2, explanation:"Le paramétrage du type d'article (OMS2) définit si la numérotation est interne (auto-générée), externe (saisie manuelle) ou les deux. Permet d'adopter la convention de codification de l'entreprise." },
  { id:"e44", chapter:"Données de base", question:"Le type d'article HIBE (Hilfsbedarf) correspond à :", options:["Une matière première","Un semi-fini","Un article consommable de fonctionnement (frais généraux)","Un produit fini"], correctIndex:2, explanation:"HIBE = Hilfs- und Betriebsstoffe = articles consommables de fonctionnement (papeterie, fournitures, petit outillage). Passé directement en charges, pas valorisé en stock comme un actif." },
  { id:"e45", chapter:"Structures organisationnelles", question:"Une division (Plant) peut être rattachée à :", options:["Plusieurs sociétés simultanément","Une seule société","Aucune société (autonome)","Un mandant uniquement"], correctIndex:1, explanation:"Une division est toujours rattachée à exactement une société (Company Code). C'est ce rattachement qui détermine la comptabilité légale dans laquelle les mouvements de stock se traduisent en écritures FI." },
  // — Ch2 Processus P2P (7 questions supplémentaires) ──────────
  { id:"e46", chapter:"Processus P2P", question:"Le mouvement de type 122 dans MIGO correspond à :", options:["Réception contre BC","Retour de marchandises au fournisseur","Sortie pour ordre de fabrication","Transfert inter-divisions"], correctIndex:1, explanation:"Mouvement 122 = retour fournisseur. Annule (partiellement ou totalement) une GR antérieure. Génère écriture inverse : Crédit Stock / Débit GR/IR." },
  { id:"e47", chapter:"Processus P2P", question:"Une demande d'achat peut être créée :", options:["Uniquement manuellement par l'utilisateur","Uniquement automatiquement par le MRP","Manuellement (ME51N) ou automatiquement (par MRP, par ordre de fabrication, par projet)","Uniquement à partir d'une commande client"], correctIndex:2, explanation:"La DA peut être créée par plusieurs sources : manuellement (ME51N), automatiquement par le MRP, par les ordres de fabrication (composants externes), par les projets (PS), par les ordres de maintenance (PM)." },
  { id:"e48", chapter:"Processus P2P", question:"La transaction ME22N permet de :", options:["Créer un bon de commande","Modifier un bon de commande existant","Annuler un bon de commande","Afficher un bon de commande"], correctIndex:1, explanation:"ME22N modifie un BC. ME21N le crée, ME23N l'affiche en lecture seule. La modification d'un BC déjà partiellement réceptionné/facturé est limitée pour préserver la cohérence." },
  { id:"e49", chapter:"Processus P2P", question:"Un Service Entry Sheet (ML81N) est utilisé pour :", options:["Saisir une facture de service","Confirmer la réception d'une prestation de service externe","Créer un BC de service","Évaluer un prestataire"], correctIndex:1, explanation:"Le Service Entry Sheet (ML81N) est l'équivalent de la GR pour les services. Il confirme qu'une prestation a été effectuée selon le BC de service. Déclenche le flux de facturation MIRO." },
  { id:"e50", chapter:"Processus P2P", question:"Dans S/4HANA, la transaction MIGO peut être complétée par l'application Fiori :", options:["Post Goods Movement","Manage Material Documents","Both — Fiori est l'interface moderne pour les mouvements de stock","Aucune Fiori n'existe pour MIGO"], correctIndex:2, explanation:"S/4HANA Fiori propose 'Post Goods Movement' (MIGO simplifié) et 'Manage Material Documents' (recherche/affichage). MIGO classique reste disponible pour les utilisateurs experts." },
  { id:"e51", chapter:"Processus P2P", question:"Le rapport ME2N affiche :", options:["Les BC ouverts par fournisseur","Les BC par numéro de document","Les positions BC ouvertes par division","Les BC clôturés du mois"], correctIndex:1, explanation:"ME2N liste les BC par numéro de document. ME2L = par fournisseur, ME2M = par article, ME2K = par compte d'imputation. Famille de rapports d'analyse des achats très utile en pratique." },
  { id:"e52", chapter:"Processus P2P", question:"L'imputation comptable d'un BC pour un consommable destiné à un centre de coûts (type K) :", options:["Débit Stock à la GR","Débit Centre de coûts à la GR (passage en charge directe)","Débit Immobilisations","Débit GR/IR uniquement"], correctIndex:1, explanation:"BC type K (Cost Center) : à la GR, l'imputation est directe en charge sur le centre de coûts (Débit Charges/Centre de coûts) au lieu de Débit Stock. Pas de stock géré pour ces achats de fonctionnement." },
  // — Ch3 Stocks & mouvements (5 questions supplémentaires) ─────
  { id:"e53", chapter:"Gestion des stocks", question:"Le Cycle Counting est :", options:["Un inventaire annuel exhaustif","Un inventaire continu basé sur les classes ABC, avec fréquences différentes","Un inventaire mensuel par magasin","Un inventaire automatique sans comptage physique"], correctIndex:1, explanation:"Le Cycle Counting répartit les articles en classes ABC selon leur valeur ou rotation. Classe A comptée 4-12×/an, B 2-4×/an, C 1×/an. Lisse la charge de comptage et concentre l'effort sur les articles critiques." },
  { id:"e54", chapter:"Gestion des stocks", question:"Le mouvement 411-Q transfère :", options:["Du stock libre vers stock projet","Du stock projet vers stock libre","Du stock client vers stock libre","Du stock fournisseur vers stock libre"], correctIndex:0, explanation:"411-Q affecte du stock libre vers le stock d'un projet (WBS). 411-K transfère du stock libre depuis le stock consigné fournisseur. Les types Q (projet), E (client), K (consigné) ont leurs mouvements 411 spécifiques." },
  { id:"e55", chapter:"Gestion des stocks", question:"Le mouvement de type 551 dans SAP correspond à :", options:["Un transfert magasin","Une mise au rebut (Scrapping)","Une consommation pour ordre","Une réception sans BC"], correctIndex:1, explanation:"551 = Scrapping = mise au rebut. Sortie définitive du stock pour articles obsolètes ou détériorés. Génère écriture en compte de pertes (rebuts) au lieu de la contrepartie standard de consommation." },
  { id:"e56", chapter:"Gestion des stocks", question:"Le stock 'en transit' apparaît lors :", options:["D'un transfert 1-step (mouvement 311)","D'un transfert 2-step (entre le 313 et le 315)","De la réception d'une commande client","De l'inventaire physique"], correctIndex:1, explanation:"Le transfert 2-step crée un stock 'en transit' visible dans MMBE entre le mouvement 313 (prélèvement émetteur) et 315 (mise en stock destinataire). Le 1-step est instantané, sans phase intermédiaire." },
  { id:"e57", chapter:"Gestion des stocks", question:"Un document matière (Material Document) est :", options:["Modifiable jusqu'à la clôture mensuelle","Immuable — seule une contre-passation (annulation) est possible","Modifiable par l'utilisateur original uniquement","Modifiable avec autorisation admin"], correctIndex:1, explanation:"Tout document matière est immuable une fois créé pour préserver l'intégrité du stock et de la comptabilité. Pour corriger, on contre-passe (mouvement inverse) puis on saisit un nouveau mouvement correct." },
  // — Ch4 Évaluation (5 questions supplémentaires) ─────────────
  { id:"e58", chapter:"Évaluation des stocks", question:"La transaction OBYC sert à :", options:["Configurer les comptes de grand livre auto-déterminés pour MM-FI","Créer une fiche article","Saisir un BC","Lancer le MRP"], correctIndex:0, explanation:"OBYC est le paramétrage central de la détermination automatique des comptes MM-FI. Pour chaque clé (BSX stock, WRX GR/IR, PRD écart prix, GBB sortie), on définit le compte GL à mouvementer selon le groupe d'évaluation et le type d'article." },
  { id:"e59", chapter:"Évaluation des stocks", question:"La transaction MR21 permet de :", options:["Saisir une facture fournisseur","Réévaluer manuellement le prix d'un article (changement de valeur stock)","Créer un avoir fournisseur","Annuler une facture"], correctIndex:1, explanation:"MR21 est la révaluation manuelle d'un article : modification du prix standard ou du MAP, génération automatique d'une écriture comptable d'ajustement de la valeur du stock (Débit ou Crédit Stock, contrepartie en compte d'écart)." },
  { id:"e60", chapter:"Évaluation des stocks", question:"La Split Valuation est utilisée quand :", options:["Le même article doit être valorisé différemment selon des critères (origine, lot, qualité)","Plusieurs articles ont le même prix","On change de devise de stock","Le stock dépasse une certaine valeur"], correctIndex:0, explanation:"Split Valuation : un même numéro d'article peut avoir plusieurs valorisations distinctes selon des critères. Ex : article fabriqué en interne (INTERN) vs acheté (EXTERN) avec des prix séparés. Activé via OMWC + vue Comptabilité." },
  { id:"e61", chapter:"Vérification facture", question:"Les factures bloquées par MIRO sont libérées via :", options:["MIRO en mode correction","MRBR (Release Blocked Invoices)","FB60","MR11"], correctIndex:1, explanation:"MRBR (Release Blocked Invoices) débloque les factures que MIRO a bloquées automatiquement pour écart de prix ou quantité au-delà des tolérances. Validation par l'acheteur ou le comptable après vérification de l'écart." },
  { id:"e62", chapter:"Vérification facture", question:"L'écart de prix lors d'une MIRO en prix MAP avec stock suffisant :", options:["Est comptabilisé en compte d'écart de prix","Met à jour le MAP automatiquement (recalcul)","Bloque systématiquement la facture","N'est pas géré par SAP"], correctIndex:1, explanation:"Avec prix MAP (V) et stock suffisant pour absorber l'écart, le nouveau MAP se recalcule automatiquement intégrant la nouvelle valeur. Pas de compte d'écart. Avec prix standard (S), l'écart va toujours sur compte d'écart de prix." },
  // — Ch5 MRP (5 questions supplémentaires) ────────────────────
  { id:"e63", chapter:"MRP", question:"MRP Live dans S/4HANA :", options:["Est identique au MRP classique","Est une version moins performante","Exécute la planification directement dans HANA via procédures stockées (× 5-10 plus rapide)","N'est disponible qu'en option"], correctIndex:2, explanation:"MRP Live (MD01N) utilise les capacités HANA pour exécuter le MRP directement en mémoire via procédures stockées. Performance ×5 à 10 vs MRP classique. C'est le standard recommandé en S/4HANA." },
  { id:"e64", chapter:"MRP", question:"La stratégie de planification 20 (Make-to-Order) signifie :", options:["Production sur prévision pure","Production uniquement sur commande client","Production sur commande consommée par prévisions","Production en flux tiré"], correctIndex:1, explanation:"Stratégie 20 = MTO pur. La production démarre uniquement sur commande client. Pas de stock anticipé. Le délai client = délai production. Utilisé pour produits configurés ou customisés." },
  { id:"e65", chapter:"MRP", question:"Le MPS (Master Production Scheduling) s'applique :", options:["À tous les articles MRP","Aux articles stratégiques (produits finis, composants critiques) avec validation manuelle","Uniquement aux matières premières","Aux articles consommables"], correctIndex:1, explanation:"MPS (type MRP M0/M1/M2) cible les articles stratégiques. Le planificateur valide manuellement les propositions MPS avant déclenchement MRP des composants. Stabilise la production en évitant la nervosité du plan." },
  { id:"e66", chapter:"MRP", question:"Le Pegging dans S/4HANA permet :", options:["De bloquer du stock pour un client","De tracer la chaîne besoin → approvisionnement (origine d'une proposition)","De geler le MRP pendant la clôture","De prioriser les ordres urgents"], correctIndex:1, explanation:"Le Demand-Driven Pegging trace l'origine de chaque proposition : pour un Planned Order ou une PR, on peut afficher quel besoin client ou prévision l'a déclenché. Essentiel pour la priorisation et l'analyse d'impact." },
  { id:"e67", chapter:"MRP", question:"Une exception MRP du type 'Avancer la livraison' indique :", options:["Que le besoin a été reporté","Que la livraison planifiée arrivera trop tard et doit être avancée pour éviter la rupture","Que la quantité est trop faible","Que le fournisseur est en retard"], correctIndex:1, explanation:"Exception 'Avancer' (Reschedule In) : SAP détecte qu'une entrée planifiée arrivera après le besoin. Le planificateur doit contacter le fournisseur ou avancer la production. Visible dans MD06." },
  // — Ch6 Fournisseurs (5 questions supplémentaires) ──────────
  { id:"e68", chapter:"Gestion fournisseurs", question:"L'évaluation fournisseur (ME6H) note les fournisseurs sur :", options:["Un seul critère global","5 critères : Prix, Qualité, Service, Livraison, Service externe","2 critères : Prix et Qualité","La fréquence des commandes"], correctIndex:1, explanation:"L'évaluation fournisseur SAP comporte 5 critères paramétrables : Prix (compétitivité), Qualité (taux conformité), Service (délais), Livraison (quantités), Service externe (sous-traitants). Notes 1-100, pondérées." },
  { id:"e69", chapter:"Gestion fournisseurs", question:"Le Quota Arrangement permet de :", options:["Limiter le volume d'achat total","Répartir l'approvisionnement entre plusieurs fournisseurs selon des pourcentages","Bloquer les achats non budgétés","Imposer un fournisseur unique"], correctIndex:1, explanation:"Quota Arrangement (ME01 onglet Quota) : répartition pourcentage entre fournisseurs (ex: A 60%, B 40%). SAP rééquilibre selon historique pour respecter les ratios. Réduit la dépendance à un fournisseur unique." },
  { id:"e70", chapter:"Gestion fournisseurs", question:"Les conditions de paiement 0002 (14 jours 2% / 30 jours net) signifient :", options:["Paiement obligatoire à 14 jours","2% d'intérêts si non payé à 14 jours","Escompte 2% si payé en 14 jours, sinon paiement à 30 jours","Délai de 14 ou 30 jours au choix"], correctIndex:2, explanation:"Code 0002 = escompte commercial : si payé en 14 jours, 2% de remise sur le montant facturé. Sinon paiement plein à 30 jours. Configuré dans OBB8, lié à la fiche fournisseur, automatiquement appliqué dans MIRO." },
  { id:"e71", chapter:"Gestion fournisseurs", question:"Le type de condition PB00 dans les conditions d'achat est :", options:["Une remise quantitative","Le prix de base","Une majoration transport","La TVA"], correctIndex:1, explanation:"PB00 = Prix de base (Gross Price). Type de condition principal d'un BC. RA01 = Remise quantitative, FRB1 = Surcharge fret, NAVS = TVA. La hiérarchie de conditions définit le calcul du prix net." },
  { id:"e72", chapter:"Gestion fournisseurs", question:"La détermination automatique de source par MRP utilise en priorité :", options:["L'info-record le plus récent","Le quota arrangement, puis source list (source fixe), contrats, info-records","Le fournisseur avec la meilleure note","Le contrat-cadre actif"], correctIndex:1, explanation:"Hiérarchie source determination : 1) Quota Arrangement (répartition % entre fournisseurs), 2) Source List avec source fixe, 3) Contrats-cadres actifs, 4) Info-records valides. Le MRP affecte automatiquement le fournisseur selon cette priorité." },
  // — Ch7 Clôture & spéciaux (8 questions supplémentaires) ─────
  { id:"e73", chapter:"Clôture MM", question:"Le Stock Transport Order (STO) type UB est :", options:["Un STO avec processus SD intégré","Un STO simple sans livraison sortante SD","Un BC inter-company","Un service externe"], correctIndex:1, explanation:"STO type UB : transfert simple entre divisions sans flux SD. Mouvement direct 351 (transfert) ou 641 selon paramétrage. Type NB intègre la création d'une livraison sortante via VL10B (utilisé pour le cross-company)." },
  { id:"e74", chapter:"Clôture MM", question:"L'Inter-Company Billing intervient :", options:["À chaque mouvement entre divisions","Lors d'un STO entre deux sociétés différentes du groupe","À la fin du mois en clôture","Uniquement à la demande du contrôle de gestion"], correctIndex:1, explanation:"Inter-Company Billing (VF01 type IV) : facture entre deux sociétés du même groupe lors d'un STO cross-company. Importante pour le reporting consolidé (élimination marges intra-groupe) et le respect du transfer pricing fiscal." },
  { id:"e75", chapter:"Clôture MM", question:"La transaction ME2O (Subcontracting Cockpit) affiche :", options:["Les BC de matières premières uniquement","Pour chaque article sous-traité : composants à fournir, stock chez le sous-traitant, besoins","Les évaluations des sous-traitants","La facturation sous-traitance"], correctIndex:1, explanation:"ME2O est le tableau de bord de la sous-traitance : par BC sous-traité, on voit les composants à fournir, le stock déjà chez le sous-traitant (type O), les besoins. Le planificateur pilote ainsi les flux composants." },
  { id:"e76", chapter:"Clôture MM", question:"Le mouvement 541 dans MIGO correspond à :", options:["Une réception sans BC","Un envoi de composants au sous-traitant","Une mise au rebut","Un transfert entre divisions"], correctIndex:1, explanation:"Mouvement 541 = envoi de composants au sous-traitant (Provide to Vendor). Le stock devient 'Stock chez sous-traitant' (type O), reste propriété de l'entreprise. 542 = retour des composants non consommés. 543 = sortie auto à la GR sous-traitance." },
  { id:"e77", chapter:"Clôture MM", question:"Dans S/4HANA, la fiche fournisseur unifiée (Business Partner) :", options:["Remplace définitivement FK01/XK01","Est obligatoire pour créer un nouveau fournisseur (BP est le standard)","Coexiste avec les anciennes transactions mais BP est la voie principale","Est uniquement pour les clients"], correctIndex:2, explanation:"Dans S/4HANA, le Business Partner (transaction BP) est l'objet unifié pour fournisseurs et clients. Les anciennes transactions FK01/XK01 sont conservées pour compatibilité mais déclenchent BP en arrière-plan. BP est le standard." },
  { id:"e78", chapter:"Clôture MM", question:"Un BC type K (Cost Center) :", options:["Génère une entrée en stock à la GR","Passe directement en charge sur un centre de coûts à la GR","N'a pas d'impact comptable","Crée une immobilisation"], correctIndex:1, explanation:"BC type K : à la GR, l'imputation comptable est directement en charge sur le centre de coûts indiqué (Débit Charges centre coûts / Crédit GR/IR). Pas de stock géré. Utilisé pour les achats consommables non stockés (fournitures bureau)." },
  { id:"e79", chapter:"Clôture MM", question:"Le mouvement 543 (sortie sous-traitance) génère :", options:["Une entrée en stock chez le sous-traitant","Une sortie automatique des composants envoyés (lors de la GR du produit fini)","Un transfert entre divisions","Une mise au rebut des composants"], correctIndex:1, explanation:"543 = consommation automatique des composants chez le sous-traitant lors de la GR du produit transformé. Génère simultanément à la GR (101) du produit fini, la sortie automatique de tous les composants utilisés selon la nomenclature du produit." },
  { id:"e80", chapter:"Clôture MM", question:"L'objectif principal de MR11 dans la clôture mensuelle est :", options:["Régulariser les écarts du compte GR/IR (provisions de fin de période)","Lancer le MRP de clôture","Calculer les nouveaux prix moyens","Fermer les BC en retard"], correctIndex:0, explanation:"MR11 (Maintain GR/IR Clearing Account) régularise le compte GR/IR en fin de période : identifie les positions non soldées (livraisons sans facture, factures sans livraison) et permet leur traitement (provision comptable ou correction)." },
];
