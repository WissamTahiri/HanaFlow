/**
 * Contenu de la certification C_TS4MM_2023
 * SAP Certified Associate – SAP S/4HANA for Materials Management
 *
 * 7 chapitres · leçons · quiz · 40 questions simulateur
 */

export const mmCertification = {
  id: "c-ts4mm-2023",
  code: "C_TS4MM_2023",
  name: "SAP Certified Associate – SAP S/4HANA for Materials Management",
  shortName: "SAP MM Certification",
  level: "Associate",
  examDuration: 180,
  examQuestions: 80,
  simulatorQuestions: 40,
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
];
