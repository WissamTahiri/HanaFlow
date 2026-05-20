/**
 * Decks de flashcards SAP par module — curated set des concepts/T-codes/tables
 * les plus demandés en certif et entretien. Volontairement court (10-15 cartes)
 * pour pouvoir réviser un module en 5 min de pause.
 *
 * Format : front = question (concise), back = réponse (1-3 phrases max).
 * Ne PAS écrire des paragraphes — le format flashcard = recall court.
 */

export type FlashCard = {
  id: string;
  front: string;
  back: string;
  /** Tags optionnels pour grouper/filtrer plus tard (T-code, table, concept…). */
  tags?: string[];
};

export type ModuleDeck = {
  code: "fi" | "co" | "mm" | "sd" | "pp" | "ai";
  label: string;
  description: string;
  color: string; // gradient tailwind
  cards: FlashCard[];
};

export const DECKS: ModuleDeck[] = [
  {
    code: "fi",
    label: "Financial Accounting",
    description: "Comptabilité externe — GL, AP, AR, AA, clôture",
    color: "from-blue-500 to-blue-700",
    cards: [
      { id: "fi-01", front: "Quel T-code pour saisir une écriture GL manuelle ?", back: "FB50 — écriture standard sur un compte GL.", tags: ["t-code"] },
      { id: "fi-02", front: "Quelle table centralise les écritures comptables en S/4HANA ?", back: "ACDOCA — l'Universal Journal qui unifie FI et CO.", tags: ["table", "s4hana"] },
      { id: "fi-03", front: "Différence entre FI et CO ?", back: "FI = comptabilité externe (bilan, P&L légaux). CO = comptabilité interne (analyses de gestion, centres de coûts).", tags: ["concept"] },
      { id: "fi-04", front: "T-code pour facturer un fournisseur en MM ?", back: "MIRO — Logistic Invoice Verification. Génère un document FI en AP.", tags: ["t-code", "integration"] },
      { id: "fi-05", front: "Que signifie GR/IR ?", back: "Goods Receipt / Invoice Receipt — compte d'attente entre la réception et la facture fournisseur.", tags: ["concept"] },
      { id: "fi-06", front: "T-code pour la liste des postes ouverts fournisseurs ?", back: "FBL1N — affiche les postes ouverts, compensés ou tous d'un fournisseur.", tags: ["t-code"] },
      { id: "fi-07", front: "Que définit la Fiscal Year Variant ?", back: "La structure de l'exercice comptable : nombre de périodes, calendrier, durée.", tags: ["customizing"] },
      { id: "fi-08", front: "Que représente le Company Code ?", back: "L'entité légale qui produit un bilan et un compte de résultat — niveau le plus bas pour la comptabilité externe.", tags: ["org"] },
      { id: "fi-09", front: "Workflow P2P complet ?", back: "Demande d'achat → PO (ME21N) → GR (MIGO) → Invoice (MIRO) → Payment (F-58/F110).", tags: ["process"] },
      { id: "fi-10", front: "Que fait le sous-module FI-AA ?", back: "Asset Accounting — gestion du cycle de vie des immobilisations : acquisition, mise en service, amortissement, cession.", tags: ["concept"] },
      { id: "fi-11", front: "T-code pour afficher les écritures sur un compte GL ?", back: "FAGLL03 (S/4HANA) ou FBL3N (classique).", tags: ["t-code"] },
      { id: "fi-12", front: "Différence entre AP et AR ?", back: "AP = Accounts Payable (comptes fournisseurs). AR = Accounts Receivable (comptes clients).", tags: ["concept"] },
    ],
  },
  {
    code: "co",
    label: "Controlling",
    description: "Contrôle de gestion — centres de coûts, CO-PA, ordres internes",
    color: "from-indigo-500 to-indigo-700",
    cards: [
      { id: "co-01", front: "Différence centre de coût vs centre de profit ?", back: "Centre de coût = collecte des charges (analyse coût). Centre de profit = inclut revenus + charges (analyse de rentabilité).", tags: ["concept"] },
      { id: "co-02", front: "Que signifie CO-PA ?", back: "Profitability Analysis — analyse de rentabilité par segment (produit, client, région…).", tags: ["concept"] },
      { id: "co-03", front: "T-code pour créer un centre de coût ?", back: "KS01 — Create Cost Center. KS02 pour modifier, KS03 pour afficher.", tags: ["t-code"] },
      { id: "co-04", front: "À quoi sert un ordre interne (Internal Order) ?", back: "Collecter les coûts d'un événement, projet court ou activité ponctuelle, avant imputation finale sur un centre de coût.", tags: ["concept"] },
      { id: "co-05", front: "T-code pour créer un ordre interne ?", back: "KO01.", tags: ["t-code"] },
      { id: "co-06", front: "Qu'est-ce que la Controlling Area ?", back: "L'unité organisationnelle CO qui regroupe plusieurs Company Codes pour permettre des analyses cross-entités.", tags: ["org"] },
      { id: "co-07", front: "Qu'est-ce qu'un cycle d'allocation ?", back: "Répartition automatisée de coûts d'un centre vers d'autres centres selon une clé de répartition (distribution ou assessment).", tags: ["concept"] },
      { id: "co-08", front: "Distribution vs assessment ?", back: "Distribution garde le compte d'origine. Assessment regroupe sur un compte secondaire dédié.", tags: ["concept"] },
      { id: "co-09", front: "Apport de l'Universal Journal pour CO ?", back: "Plus de réconciliation FI↔CO : toute écriture est dans ACDOCA avec les attributs CO. Reporting temps réel.", tags: ["s4hana"] },
      { id: "co-10", front: "Que stocke la table COEP en ECC ?", back: "Les line items CO (centres de coût, ordres). En S/4HANA, remplacé par ACDOCA.", tags: ["table"] },
    ],
  },
  {
    code: "mm",
    label: "Sourcing & Procurement",
    description: "Achats, stocks, valorisation, P2P",
    color: "from-sky-500 to-sky-700",
    cards: [
      { id: "mm-01", front: "T-code pour créer une commande d'achat ?", back: "ME21N — Create Purchase Order. ME22N pour modifier, ME23N pour afficher.", tags: ["t-code"] },
      { id: "mm-02", front: "T-code pour la réception de marchandises ?", back: "MIGO — Goods Movement (réceptions, sorties, transferts).", tags: ["t-code"] },
      { id: "mm-03", front: "Workflow P2P standard ?", back: "PR (Purchase Requisition) → PO (ME21N) → GR (MIGO) → IR/MIRO → Payment.", tags: ["process"] },
      { id: "mm-04", front: "Table maître des articles ?", back: "MARA (general), MARC (plant), MBEW (valuation), MARD (stock).", tags: ["table"] },
      { id: "mm-05", front: "Différence Source List vs Quota Arrangement ?", back: "Source List = fournisseurs autorisés pour un matériel. Quota = répartition % entre plusieurs sources.", tags: ["concept"] },
      { id: "mm-06", front: "Qu'est-ce qu'un info record ?", back: "Lien matériel × fournisseur stockant prix, conditions, délais d'approvisionnement.", tags: ["concept"] },
      { id: "mm-07", front: "Release strategy : à quoi ça sert ?", back: "Workflow d'approbation des PR/PO selon des critères (montant, type, organisation d'achat).", tags: ["concept"] },
      { id: "mm-08", front: "Compte GR/IR : pourquoi exister ?", back: "Compte d'attente entre la réception physique (GR) et la facture fournisseur (IR) — gère les écarts.", tags: ["integration"] },
      { id: "mm-09", front: "T-code pour créer un fournisseur (business partner) ?", back: "BP en S/4HANA (Business Partner unique). XK01 en ECC.", tags: ["t-code", "s4hana"] },
      { id: "mm-10", front: "Que fait le movement type 101 ?", back: "Réception sur PO — stock entry, contre-partie GR/IR.", tags: ["concept"] },
      { id: "mm-11", front: "MRP type PD vs VB ?", back: "PD = Material Requirements Planning (déterministe). VB = Manual Reorder Point (stochastique).", tags: ["concept"] },
    ],
  },
  {
    code: "sd",
    label: "Sales & Distribution",
    description: "OTC — ventes, livraison, pricing, facturation",
    color: "from-cyan-500 to-cyan-700",
    cards: [
      { id: "sd-01", front: "T-code pour créer une commande client ?", back: "VA01 — Create Sales Order. VA02/VA03 pour modifier/afficher.", tags: ["t-code"] },
      { id: "sd-02", front: "Workflow OTC complet ?", back: "Inquiry → Quotation → Sales Order (VA01) → Delivery (VL01N) → Goods Issue → Billing (VF01).", tags: ["process"] },
      { id: "sd-03", front: "T-code pour créer une livraison ?", back: "VL01N — Create Outbound Delivery.", tags: ["t-code"] },
      { id: "sd-04", front: "T-code pour facturer un client ?", back: "VF01 — Create Billing Document. Génère le doc FI client automatiquement.", tags: ["t-code", "integration"] },
      { id: "sd-05", front: "Qu'est-ce que la condition technique de pricing ?", back: "Mécanisme qui détermine le prix d'une ligne : type de condition (prix, remise, taxe) + access sequence + tables de conditions.", tags: ["concept"] },
      { id: "sd-06", front: "Différence Sales Org / Distribution Channel / Division ?", back: "Sales Org = entité juridique vente. Distribution Channel = canal (direct, wholesale…). Division = ligne produit.", tags: ["org"] },
      { id: "sd-07", front: "Que représente le Partner Function ?", back: "Rôle d'un partenaire dans une commande : SP (Sold-to), SH (Ship-to), BP (Bill-to), PY (Payer).", tags: ["concept"] },
      { id: "sd-08", front: "Qu'est-ce qu'un schedule line ?", back: "Sous-ligne d'une position SO qui définit quantité, date de livraison et type de mouvement.", tags: ["concept"] },
      { id: "sd-09", front: "Que fait le movement type 601 ?", back: "Goods Issue — sortie de stock pour livraison client, débit COGS / crédit stock.", tags: ["concept"] },
      { id: "sd-10", front: "Différence Inquiry vs Quotation ?", back: "Inquiry = demande info, sans engagement. Quotation = offre ferme avec validité.", tags: ["concept"] },
    ],
  },
  {
    code: "pp",
    label: "Production Planning",
    description: "MRP, ordres de fab, BOM, capacités",
    color: "from-emerald-500 to-emerald-700",
    cards: [
      { id: "pp-01", front: "Que signifie MRP ?", back: "Material Requirements Planning — calcul des besoins en composants à partir de la demande et du stock.", tags: ["concept"] },
      { id: "pp-02", front: "Qu'est-ce qu'une BOM ?", back: "Bill of Materials — nomenclature : liste des composants nécessaires pour produire un article fini.", tags: ["concept"] },
      { id: "pp-03", front: "T-code pour lancer le MRP ?", back: "MD01 (total), MD02 (single material), MD03 (single material avec stock).", tags: ["t-code"] },
      { id: "pp-04", front: "Différence ordre planifié vs ordre de fabrication ?", back: "Planned Order = proposition MRP, modifiable. Production Order = ordre confirmé, lance la fabrication.", tags: ["concept"] },
      { id: "pp-05", front: "T-code pour créer une BOM ?", back: "CS01 (create), CS02 (change), CS03 (display).", tags: ["t-code"] },
      { id: "pp-06", front: "Qu'est-ce qu'une routing ?", back: "Gamme opératoire — séquence d'opérations pour fabriquer un produit, avec postes de charge et temps.", tags: ["concept"] },
      { id: "pp-07", front: "BOM explosion — c'est quoi ?", back: "Décomposition récursive d'un produit fini en sous-ensembles et composants jusqu'aux matières premières.", tags: ["concept"] },
      { id: "pp-08", front: "T-code pour confirmer une opération ?", back: "CO11N — Time Ticket Confirmation. Met à jour stock, coûts, capacité.", tags: ["t-code"] },
      { id: "pp-09", front: "Lot size MRP — types courants ?", back: "EX (exact), HB (réapprovisionnement à un point), FX (fixe). Définit comment MRP groupe les besoins.", tags: ["concept"] },
      { id: "pp-10", front: "Work center vs Resource ?", back: "Work Center = poste de charge avec capacité, opérations, coûts. Resource = équivalent en process industries (PP-PI).", tags: ["concept"] },
    ],
  },
  {
    code: "ai",
    label: "Generative AI Developer",
    description: "Joule, RAG, AI Core, prompt engineering",
    color: "from-violet-500 to-purple-700",
    cards: [
      { id: "ai-01", front: "Qu'est-ce que SAP Joule ?", back: "Copilote IA conversationnel SAP, intégré dans S/4HANA et le portfolio. Comprend le contexte business utilisateur.", tags: ["concept"] },
      { id: "ai-02", front: "Que signifie RAG ?", back: "Retrieval Augmented Generation — combine LLM + recherche dans une base de connaissances pour ancrer les réponses.", tags: ["concept"] },
      { id: "ai-03", front: "À quoi sert SAP AI Core ?", back: "Plateforme d'exécution des workloads IA dans SAP BTP — entraînement, inférence, fine-tuning, governance.", tags: ["concept"] },
      { id: "ai-04", front: "Rôle de SAP AI Launchpad ?", back: "Interface unifiée pour gérer les modèles, scénarios, exécutions et observabilité IA dans BTP.", tags: ["concept"] },
      { id: "ai-05", front: "Différence fine-tuning vs prompt engineering ?", back: "Fine-tuning = réentraîner les poids du modèle. Prompt engineering = ajuster l'input sans toucher au modèle.", tags: ["concept"] },
      { id: "ai-06", front: "Qu'est-ce qu'un vector store dans RAG ?", back: "Base de données qui stocke les embeddings (représentations vectorielles) pour faire de la recherche sémantique.", tags: ["concept"] },
      { id: "ai-07", front: "Code de la certif SAP Generative AI Developer ?", back: "C_AIG — SAP Certified Associate, Generative AI Developer.", tags: ["certif"] },
      { id: "ai-08", front: "Responsible AI chez SAP — principes clés ?", back: "Relevance, transparency, fairness, accountability. Tester biais, éviter hallucinations critiques, traçabilité des décisions.", tags: ["concept"] },
      { id: "ai-09", front: "Embedding — c'est quoi ?", back: "Représentation vectorielle d'un texte (768/1536/3072 dimensions selon modèle). Sert à mesurer la similarité sémantique.", tags: ["concept"] },
      { id: "ai-10", front: "Différence Joule (S/4HANA) vs Joule for Developers ?", back: "Joule end-user = copilote business. Joule for Devs = assistant code/ABAP intégré dans ADT et Build Code.", tags: ["concept"] },
    ],
  },
];

export function getDeck(code: string): ModuleDeck | undefined {
  return DECKS.find((d) => d.code === code.toLowerCase());
}
