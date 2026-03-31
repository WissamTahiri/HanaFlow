/**
 * Contenu de la certification C_TS4SD_2023
 * SAP Certified Associate – SAP S/4HANA for Sales and Distribution
 *
 * 7 chapitres · leçons · quiz · 40 questions simulateur
 */

export const sdCertification = {
  id: "c-ts4sd-2023",
  code: "C_TS4SD_2023",
  name: "SAP Certified Associate – SAP S/4HANA for Sales and Distribution",
  shortName: "SAP SD Certification",
  level: "Associate",
  examDuration: 180,
  examQuestions: 80,
  simulatorQuestions: 40,
  passingScore: 65,
  officialLink: "https://training.sap.com/certification/c_ts4sd_2023",
  color: "from-purple-900 via-purple-700 to-purple-500",

  chapters: [
    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 1 — Structures organisationnelles SD
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch1", number: 1,
      title: "Structures organisationnelles SD",
      weight: 12, isPremium: false,
      lessons: [
        {
          id: "l1-1",
          title: "Division de vente, canal de distribution et secteur d'activité",
          content: [
            "Le module SD (Sales and Distribution) repose sur une structure organisationnelle propre qui s'imbrique dans la hiérarchie SAP globale. La maîtrise de ces entités est indispensable car elles conditionnent où les commandes sont saisies, quels prix s'appliquent et comment les livraisons sont effectuées.",
            "La Division de vente (Sales Organization) est l'entité centrale SD. Elle représente une unité commerciale responsable de la vente et de la distribution de marchandises. Elle est rattachée à une société comptable (Company Code). Exemple : Division de vente 1000 = Ventes France, 2000 = Ventes Export.",
            "Le Canal de distribution (Distribution Channel) définit la voie par laquelle les produits arrivent au client : vente directe, vente au détail, internet, grossiste. Il permet d'avoir des prix et des conditions commerciales différents selon le canal. Exemple : 10 = Vente directe, 20 = Vente au détail.",
            "Le Secteur d'activité (Division) regroupe des produits ou services similaires. Il ne faut pas le confondre avec la Division MM (Plant). En SD, le secteur d'activité permet de structurer le reporting commercial. Exemple : 00 = Toutes divisions (cross-division), 01 = Produits A, 02 = Services.",
            "Le Domaine commercial (Sales Area) est la combinaison des trois entités : Division de vente + Canal de distribution + Secteur d'activité. C'est l'élément de base de toute transaction SD. Un client est créé pour un domaine commercial donné, une commande est saisie dans un domaine commercial. Exemple : 1000 / 10 / 00 = Ventes France / Direct / Tous produits.",
            "En S/4HANA, la structure organisationnelle SD reste identique à ECC. Les transactions de configuration sont accessibles via SPRO → Structure de l'entreprise → Définition → Logistique — Ventes."
          ],
          keyConcepts: [
            { term: "Division de vente (Sales Org)", definition: "Entité centrale SD rattachée à une société. Responsable de la vente et de la distribution. Conditionne les conditions commerciales et la facturation." },
            { term: "Canal de distribution", definition: "Voie par laquelle les produits arrivent au client (direct, détail, internet…). Permet des prix différenciés par canal." },
            { term: "Secteur d'activité (Division SD)", definition: "Groupement de produits/services similaires pour le reporting. ≠ Division MM (Plant). Peut être 00 (cross-division)." },
            { term: "Domaine commercial (Sales Area)", definition: "Combinaison unique Division de vente + Canal de distribution + Secteur d'activité. Clé de toute transaction SD." },
          ],
          tcodes: [
            { code: "SPRO", description: "Customizing IMG — structures organisationnelles SD" },
            { code: "OVX5", description: "Définir les divisions de vente" },
            { code: "OVXI", description: "Définir les canaux de distribution" },
            { code: "OVX3", description: "Créer les domaines commerciaux (assignations)" },
          ],
        },
        {
          id: "l1-2",
          title: "Points d'expédition et intégration organisationnelle SD-MM",
          content: [
            "Au-delà des entités purement commerciales, le module SD s'articule avec des entités logistiques issues de MM et de la gestion de l'entrepôt pour traiter les livraisons physiques.",
            "Le Point d'expédition (Shipping Point) est l'entité organisationnelle responsable du traitement des livraisons. Il représente un quai de chargement, une porte d'entrepôt ou un site d'expédition. La détermination automatique du point d'expédition dépend : de la division (Plant) de livraison, du groupe de chargement (article) et des conditions d'expédition (client). Exemple : Point d'expédition 0001 = Quai Nord, 0002 = Quai Express.",
            "La Division de livraison (Plant) dans SD est la division MM d'où les marchandises sont expédiées. Elle peut être déterminée automatiquement depuis la fiche article ou la fiche client, ou saisie manuellement dans la commande. C'est à ce niveau que sont gérés les stocks qui seront livrés.",
            "L'Organisation commerciale (Sales Organization) est assignée à une société comptable. La division de livraison est assignée à une société et à un code de valorisation. Cette double assignation garantit la cohérence entre les flux logistiques et financiers.",
            "En S/4HANA, le concept de 'domaine de vente étendu' (Extended Sales Area) permet une plus grande flexibilité dans la gestion multi-société. L'intégration avec SAP EWM (Extended Warehouse Management) remplace progressivement WM classique pour la gestion des entrepôts."
          ],
          keyConcepts: [
            { term: "Point d'expédition", definition: "Entité organisationnelle gérant les livraisons physiques (quai, porte). Déterminé automatiquement via règles customizing (plant + groupe chargement + cond. expédition)." },
            { term: "Groupe de chargement", definition: "Attribut de la fiche article (vue Ventes: Général/Plant) utilisé pour la détermination automatique du point d'expédition." },
            { term: "Conditions d'expédition", definition: "Attribut de la fiche client (vue données commerciales) utilisé pour la détermination du point d'expédition." },
            { term: "Division de livraison", definition: "Division MM depuis laquelle les marchandises sont physiquement expédiées. Peut différer de la division de vente." },
          ],
          tcodes: [
            { code: "OVL2", description: "Définir les points d'expédition" },
            { code: "OVL3", description: "Assigner les points d'expédition aux divisions" },
            { code: "OVXG", description: "Assigner les divisions de vente aux sociétés" },
          ],
        },
      ],
      quiz: [
        {
          id: "q1-1",
          question: "Qu'est-ce qu'un domaine commercial (Sales Area) dans SAP SD ?",
          options: [
            "La combinaison Division de vente + Canal de distribution + Secteur d'activité",
            "La combinaison Société + Division MM + Organisation d'achats",
            "La combinaison Division de vente + Point d'expédition + Secteur d'activité",
            "La combinaison Canal de distribution + Division MM + Secteur d'activité",
          ],
          correctIndex: 0,
          explanation: "Le domaine commercial (Sales Area) est la combinaison unique de trois entités : Division de vente (Sales Org) + Canal de distribution + Secteur d'activité (Division SD). C'est la clé de toute transaction SD.",
        },
        {
          id: "q1-2",
          question: "Quelle entité organisationnelle est responsable du traitement physique des livraisons en SAP SD ?",
          options: [
            "La division de vente",
            "Le canal de distribution",
            "Le point d'expédition",
            "Le secteur d'activité",
          ],
          correctIndex: 2,
          explanation: "Le point d'expédition (Shipping Point) est l'entité organisationnelle SD responsable du traitement physique des livraisons. Il est déterminé automatiquement en fonction de la division, du groupe de chargement de l'article et des conditions d'expédition du client.",
        },
        {
          id: "q1-3",
          question: "La Division de vente (Sales Organization) est directement rattachée à quelle entité SAP ?",
          options: [
            "Au mandant",
            "À la société comptable (Company Code)",
            "À la division MM (Plant)",
            "Au domaine de valorisation",
          ],
          correctIndex: 1,
          explanation: "La Division de vente est rattachée à une Société comptable (Company Code). Cette assignation garantit que les revenus de vente sont comptabilisés dans la bonne entité légale.",
        },
        {
          id: "q1-4",
          question: "Lequel de ces éléments NE fait PAS partie du domaine commercial (Sales Area) ?",
          options: [
            "Division de vente",
            "Canal de distribution",
            "Point d'expédition",
            "Secteur d'activité",
          ],
          correctIndex: 2,
          explanation: "Le domaine commercial est formé par Division de vente + Canal de distribution + Secteur d'activité. Le point d'expédition est une entité organisationnelle SD distincte, pas un composant du domaine commercial.",
        },
        {
          id: "q1-5",
          question: "La détermination automatique du point d'expédition repose sur quels éléments ? (choisir la meilleure réponse)",
          options: [
            "Division de vente + Canal de distribution + Secteur d'activité",
            "Division MM (Plant) + Groupe de chargement + Conditions d'expédition",
            "Division MM (Plant) + Organisation d'achats + Secteur d'activité",
            "Point d'expédition + Groupe de chargement + Division de vente",
          ],
          correctIndex: 1,
          explanation: "La détermination automatique du point d'expédition dépend de trois éléments : la Division MM (Plant) de livraison, le Groupe de chargement (de la fiche article, vue ventes) et les Conditions d'expédition (de la fiche client). Ces trois éléments sont configurés dans la table de détermination du customizing.",
        },
        {
          id: "q1-6",
          question: "Qu'est-ce que le canal de distribution (Distribution Channel) en SAP SD ?",
          options: [
            "L'entité qui définit le lieu physique d'expédition des marchandises",
            "La voie par laquelle les produits arrivent au client, permettant des prix différenciés",
            "La division interne responsable d'un groupe de produits",
            "Le code qui identifie la société comptable dans SD",
          ],
          correctIndex: 1,
          explanation: "Le canal de distribution définit la voie par laquelle les produits parviennent au client (vente directe, détail, internet, grossiste…). Il permet de différencier les prix, les remises et les conditions commerciales selon le canal utilisé.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 2 — Données de base SD
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch2", number: 2,
      title: "Données de base clients et articles SD",
      weight: 14, isPremium: true,
      lessons: [
        {
          id: "l2-1",
          title: "La fiche client et ses niveaux de données",
          content: [
            "La fiche client (Customer Master) est la donnée de base centrale de SD. Elle stocke toutes les informations nécessaires à la relation commerciale. Contrairement à la fiche article, la fiche client est structurée en trois niveaux distincts qui correspondent aux différentes perspectives fonctionnelles.",
            "Le niveau Données générales contient les informations indépendantes de toute entité organisationnelle : nom, adresse, numéro de téléphone, numéro de TVA intracommunautaire, langue. Ces données sont partagées par tous les modules SAP. Exemple : Dun & Bradstreet number, Industry sector.",
            "Le niveau Données de la société (Company Code data) contient les données comptables spécifiques à une société : compte de régularisation (Reconciliation Account), modalités de paiement, groupe de tolérance. Ces données sont utilisées par le module FI pour la comptabilité clients.",
            "Le niveau Données du domaine commercial (Sales Area data) contient les données commerciales spécifiques au domaine commercial : groupe de clients (pour la détermination des prix), liste de prix, devise, incoterms, représentant commercial, conditions d'expédition. C'est ce niveau qui détermine comment la commande sera traitée.",
            "En S/4HANA, le concept de Business Partner (BP) remplace les transactions séparées de création client FI (FK01) et client SD (VD01). La transaction BP permet de gérer toutes les vues en un seul endroit. Les anciens T-codes XD01/VD01 continuent de fonctionner mais sont des 'façades' vers BP.",
            "Il est important de distinguer XD01 (créer client avec données générales + société + domaine commercial), VD01 (créer/étendre données domaine commercial uniquement) et FD01 (créer/étendre données société/comptables uniquement)."
          ],
          keyConcepts: [
            { term: "Données générales client", definition: "Niveau indépendant de toute org. : nom, adresse, TVA, langue. Partagé par tous les modules. Ex : créé au niveau mandant." },
            { term: "Données domaine commercial", definition: "Données commerciales spécifiques au Sales Area : groupe client, liste de prix, incoterms, conditions d'expédition. Clé pour la détermination des prix et livraisons." },
            { term: "Groupe de clients", definition: "Attribut de la fiche client (domaine commercial) utilisé dans la procédure tarifaire pour déterminer les remises clients spécifiques." },
            { term: "Business Partner (BP)", definition: "Concept S/4HANA unifiant les vues FI et SD du client/fournisseur. Remplace les transactions séparées XD01/FD01/VD01. Transactions héritées fonctionnent encore." },
            { term: "Incoterms", definition: "Règles internationales définissant le partage des risques et des coûts de transport entre vendeur et acheteur. Stockés dans les données de domaine commercial." },
          ],
          tcodes: [
            { code: "BP", description: "Business Partner — gestion unifiée client/fournisseur (S/4HANA)" },
            { code: "XD01", description: "Créer un client (données générales + société + domaine commercial)" },
            { code: "VD01", description: "Créer/étendre un client pour un domaine commercial" },
            { code: "FD01", description: "Créer/étendre un client pour une société (données comptables)" },
            { code: "VD03", description: "Afficher les données d'un client" },
          ],
        },
        {
          id: "l2-2",
          title: "Vues commerciales de la fiche article et fiche info client-article",
          content: [
            "La fiche article possède des vues spécifiques au module SD qui complètent les vues MM vues au chapitre précédent. Ces vues contiennent les données nécessaires à la vente et à la livraison.",
            "La vue Ventes : Organisation commerciale 1 contient : unité de vente (Sales Unit), groupe d'articles (Material Group), groupe de produit hiérarchique, indicateur de référence de valeur, compte de résultat (Account Assignment Group). La vue Ventes : Organisation commerciale 2 contient les conditions de livraison, les conditions d'expédition, le type d'item proposé.",
            "La vue Ventes : Général/Division (Sales: General/Plant) contient des données au niveau division : groupe de chargement (Loading Group) crucial pour la détermination du point d'expédition, disponibilité à la vente (Availability Check), groupe de transport. C'est ici que se trouve l'indicateur de vérification de disponibilité.",
            "La Fiche info client-article (Customer-Material Info Record) — transaction VD51 — permet de stocker des données spécifiques à la relation entre un client et un article : numéro d'article client, description client de l'article, tolérance de livraison spécifique, délai de livraison convenu. SAP utilise cette fiche en priorité lors de la saisie d'une commande.",
            "La Hiérarchie client (Customer Hierarchy) permet de structurer les clients en arborescence (siège → filiales) pour appliquer des remises hiérarchiques. Elle est gérée via la transaction VDH1.",
            "L'enregistrement des conditions (Condition Records — VK11) permet de stocker les prix et remises par client, par groupe de clients, par article, ou par combinaison. Ces enregistrements alimentent la procédure tarifaire lors de la création d'une commande."
          ],
          keyConcepts: [
            { term: "Vue Ventes: Org. commerciale 1", definition: "Contient l'unité de vente, le groupe d'articles SD, le compte d'imputation (Account Assignment Group) pour la détermination de compte de résultat." },
            { term: "Vue Ventes: Général/Division", definition: "Contient le groupe de chargement (→ détermination point d'expédition), le type de vérification de disponibilité, le groupe de transport." },
            { term: "Fiche info client-article (KNMT)", definition: "Données spécifiques à la relation client-article : numéro article client, tolérance de livraison. Consultée en priorité lors de la saisie d'une commande." },
            { term: "Enregistrement de condition (Condition Record)", definition: "Stocke les valeurs de prix, remises, taxes pour une combinaison donnée (client, article, groupe…). Créé avec VK11, consulté par la procédure tarifaire." },
          ],
          tcodes: [
            { code: "MM01", description: "Créer fiche article (inclut vues SD)" },
            { code: "VD51", description: "Créer fiche info client-article" },
            { code: "VK11", description: "Créer enregistrement de condition (prix/remises)" },
            { code: "VK12", description: "Modifier enregistrement de condition" },
            { code: "VDH1", description: "Créer/modifier hiérarchie client" },
          ],
        },
      ],
      quiz: [
        {
          id: "q2-1",
          question: "En S/4HANA, quelle transaction est recommandée pour créer un client en remplacement de XD01/VD01/FD01 ?",
          options: [
            "MM01",
            "BP (Business Partner)",
            "VA01",
            "ME21N",
          ],
          correctIndex: 1,
          explanation: "En S/4HANA, la transaction BP (Business Partner) est la méthode recommandée pour créer et gérer les clients et fournisseurs. Elle unifie les vues FI et SD. Les transactions XD01/VD01/FD01 fonctionnent encore mais sont des façades vers BP.",
        },
        {
          id: "q2-2",
          question: "Dans quelle vue de la fiche article se trouve le groupe de chargement, utilisé pour la détermination du point d'expédition ?",
          options: [
            "Vue Achats",
            "Vue Comptabilité",
            "Vue Ventes : Général/Division",
            "Vue MRP 1",
          ],
          correctIndex: 2,
          explanation: "Le groupe de chargement se trouve dans la vue 'Ventes : Général/Division' de la fiche article. Il est l'un des trois paramètres (avec la division MM et les conditions d'expédition du client) utilisés pour la détermination automatique du point d'expédition.",
        },
        {
          id: "q2-3",
          question: "Quel est le rôle de la fiche info client-article (Customer-Material Info Record) ?",
          options: [
            "Stocker les informations de credit management du client",
            "Stocker les données spécifiques à la relation entre un client et un article (ex: numéro article client)",
            "Définir les prix de vente pour un article donné",
            "Gérer la hiérarchie des clients dans SAP SD",
          ],
          correctIndex: 1,
          explanation: "La fiche info client-article (KNMT, transaction VD51) stocke des données spécifiques à la relation client-article : numéro d'article du client, description client, tolérances de livraison. Elle est consultée en priorité lors de la saisie d'une commande.",
        },
        {
          id: "q2-4",
          question: "Le niveau 'Données du domaine commercial' de la fiche client contient quel type d'information ?",
          options: [
            "Le compte de régularisation (reconciliation account) et les modalités de paiement FI",
            "Le nom, l'adresse et le numéro de TVA du client",
            "Le groupe de clients, les incoterms, les conditions d'expédition",
            "Les numéros de comptes bancaires du client",
          ],
          correctIndex: 2,
          explanation: "Le niveau 'Données du domaine commercial' contient les informations commerciales spécifiques au Sales Area : groupe de clients (pour les prix), incoterms, conditions d'expédition, liste de prix, représentant commercial. Ce niveau est utilisé lors de la détermination des prix et de la livraison.",
        },
        {
          id: "q2-5",
          question: "Quelle transaction permet de créer des enregistrements de conditions (prix, remises) en SAP SD ?",
          options: [
            "VD01",
            "VA01",
            "VK11",
            "VL01N",
          ],
          correctIndex: 2,
          explanation: "VK11 est la transaction pour créer des enregistrements de conditions (Condition Records) — prix, remises, suppléments, taxes. VK12 permet de les modifier, VK13 de les afficher.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 3 — Traitement des commandes de vente (O2C)
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch3", number: 3,
      title: "Traitement des commandes de vente (Order-to-Cash)",
      weight: 20, isPremium: true,
      lessons: [
        {
          id: "l3-1",
          title: "Le cycle Order-to-Cash et les types de documents de vente",
          content: [
            "Le processus Order-to-Cash (O2C) est le flux central du module SD. Il couvre l'ensemble des étapes depuis la réception d'une demande client jusqu'à l'encaissement du paiement. Chaque étape génère un document SAP qui référence le précédent grâce au contrôle de copie (Copy Control).",
            "Les étapes du processus O2C standard : 1) Demande de prix (Inquiry — IN) → 2) Devis (Quotation — QT) → 3) Commande de vente (Sales Order — OR) → 4) Document de livraison (Outbound Delivery — LF) → 5) Sortie de marchandises (Post Goods Issue — PGI) → 6) Facture (Billing Document — F2) → 7) Paiement client (FI).",
            "Les types de documents de vente déterminent le comportement de la commande. Types standard : OR (Standard Order), QT (Quotation), IN (Inquiry), CS (Cash Sale), RO (Rush Order), RE (Returns), CR (Credit Memo Request), DR (Debit Memo Request). Le type de document est défini dans le customizing (VOV8).",
            "La catégorie de poste (Item Category) détermine le comportement de chaque ligne de commande : si elle génère un besoin, si elle est pertinente pour la livraison, si elle est pertinente pour la facturation. La catégorie de poste standard est TAN (Standard Item). Elle est déterminée automatiquement en fonction du type de commande + groupe de catégorie de poste de la fiche article.",
            "La ligne de planification (Schedule Line) contient les données de quantité et de date confirmées. La catégorie de ligne de planification détermine si un mouvement de stock est déclenché lors de la livraison (CP pour stock déterministe, CB pour consommation sur stock).",
            "La vérification de disponibilité (Availability Check — ATP : Available-to-Promise) vérifie si la quantité demandée peut être livrée à la date souhaitée. Elle tient compte du stock disponible, des entrées prévues (commandes d'achat, OFs) et des sorties prévues (autres commandes). Le résultat est une date de confirmation dans la ligne de planification."
          ],
          keyConcepts: [
            { term: "Cycle O2C (Order-to-Cash)", definition: "Demande de prix → Devis → Commande → Livraison → PGI → Facture → Paiement. Chaque document référence le précédent via le Copy Control." },
            { term: "Type de document de vente", definition: "Détermine le comportement de la commande (type de flux, catégories de postes proposées, partenaires). Ex : OR=commande standard, RE=retour, CR=demande d'avoir." },
            { term: "Catégorie de poste (Item Category)", definition: "Détermine le comportement de chaque ligne : pertinence livraison, pertinence facturation, vérif. dispo. Déterminée automatiquement : type document + groupe catégorie poste article." },
            { term: "Vérification disponibilité (ATP)", definition: "Vérifie si la quantité demandée peut être livrée à la date voulue. Considère stock + entrées prévues – sorties prévues. Confirme une date dans la ligne de planification." },
            { term: "Contrôle de copie (Copy Control)", definition: "Configuration qui définit comment les données se transfèrent d'un document à l'autre (commande → livraison → facture). Défini par type de document source et cible." },
          ],
          tcodes: [
            { code: "VA01", description: "Créer une commande de vente" },
            { code: "VA02", description: "Modifier une commande de vente" },
            { code: "VA03", description: "Afficher une commande de vente" },
            { code: "VA05", description: "Liste des commandes de vente" },
            { code: "VOV8", description: "Configurer les types de documents de vente" },
            { code: "VOV7", description: "Configurer les catégories de postes" },
          ],
        },
        {
          id: "l3-2",
          title: "Transfert des besoins et blocages de commande",
          content: [
            "Le Transfert des besoins (Transfer of Requirements — ToR) est le mécanisme par lequel une commande de vente communique ses besoins au module MM/PP pour déclencher l'approvisionnement ou la production. Lors de la sauvegarde d'une commande, SAP crée un besoin indépendant dans MRP si l'article est planifié.",
            "Les blocages de livraison et de facturation peuvent être positionnés automatiquement ou manuellement sur une commande. Blocage de livraison : empêche la création d'une livraison. Blocage de facturation : empêche la facturation mais pas la livraison. Exemple : une commande retournée (RE) a un blocage de facturation par défaut.",
            "La Gestion du crédit (Credit Management) peut bloquer automatiquement une commande si le client dépasse sa limite de crédit. Le gestionnaire crédit reçoit une alerte et peut libérer ou refuser la commande via VKM3 (libérer commandes bloquées crédit).",
            "Les documents de réclamation constituent une partie importante du processus SD. Les Retours (Returns — RE) : le client renvoie des marchandises. Le flux est : commande de retour → livraison de retour → réception de marchandises → avoir. La Demande d'avoir (Credit Memo Request — CR) : correction de prix sans retour physique. La Demande de débit (Debit Memo Request — DR) : correction en faveur de la société.",
            "Le processus de retour en S/4HANA est amélioré avec le 'Manage Customer Returns' Fiori app qui offre une vue unifiée du flux de retour incluant la qualité de la marchandise retournée et le motif de retour."
          ],
          keyConcepts: [
            { term: "Transfert des besoins (ToR)", definition: "Mécanisme qui communique les besoins issus d'une commande de vente vers MRP/PP pour déclenchement de l'approvisionnement ou la production." },
            { term: "Blocage de livraison", definition: "Empêche la création d'une livraison pour la commande. Peut être positionné manuellement ou automatiquement (ex: crédit dépassé)." },
            { term: "Retour client (RE)", definition: "Commande de retour → livraison de retour → réception marchandises (mouvement 651/653) → avoir. Flux inverse du O2C standard." },
            { term: "Demande d'avoir (CR)", definition: "Credit Memo Request. Correction de prix en faveur du client sans retour physique. Génère un avoir (credit memo) après libération." },
            { term: "Gestion du crédit", definition: "Contrôle automatique de la limite de crédit client. Bloque la commande si dépassement. Libération via VKM3." },
          ],
          tcodes: [
            { code: "VKM3", description: "Libérer commandes bloquées pour dépassement de crédit" },
            { code: "FD32", description: "Modifier la limite de crédit d'un client" },
            { code: "VA14L", description: "Liste des commandes avec blocage de livraison" },
          ],
        },
        {
          id: "l3-3",
          title: "Partenaires, textes et procédures d'incomplétude",
          content: [
            "La procédure de partenaires (Partner Determination) définit quels partenaires commerciaux sont associés à une commande et dans quels rôles. Les rôles standard : SP (Sold-to Party — donneur d'ordre), SH (Ship-to Party — destinataire de la livraison), BP (Bill-to Party — destinataire de la facture), PY (Payer — payeur). Ces rôles peuvent être partagés par un même client ou séparés.",
            "La procédure d'incomplétude (Incompletion Procedure) définit les champs obligatoires d'une commande. Si un champ requis est manquant, la commande est marquée comme incomplète et ne peut pas être livrée ni facturée. La transaction V.02 liste les documents incomplets.",
            "Les textes de vente permettent de transmettre des informations textuelles d'un document à l'autre (commande → livraison → facture → impression). Des procédures de détermination de textes configurent leur transfert automatique.",
            "La procédure de sortie (Output Determination) détermine quels messages sont envoyés lors des différentes étapes : confirmation de commande (BA00), bon de livraison (LD00), facture (RD00). Les sorties peuvent être imprimées, envoyées par EDI, par email ou par fax.",
            "En S/4HANA, les sorties (outputs) évoluent vers le framework 'BRF+ Output Management' et les Fiori apps permettent de gérer les communications clients de façon plus moderne (email HTML, portail client)."
          ],
          keyConcepts: [
            { term: "Rôle partenaire SP / SH / BP / PY", definition: "SP=Sold-to (donneur ordre), SH=Ship-to (destinataire livraison), BP=Bill-to (destinataire facture), PY=Payer (payeur). Peuvent être différents clients ou le même." },
            { term: "Procédure d'incomplétude", definition: "Liste des champs obligatoires d'une commande. Un document incomplet ne peut pas être livré ni facturé. Liste via V.02." },
            { term: "Sortie (Output)", definition: "Message généré à une étape du processus : confirmation commande (BA00), bon de livraison (LD00), facture (RD00). Envoyé par impression, EDI, email." },
          ],
          tcodes: [
            { code: "V.02", description: "Liste des documents de vente incomplets" },
            { code: "VV11", description: "Créer enregistrement de condition pour les sorties (outputs)" },
            { code: "VA02", description: "Modifier commande — onglet Sorties pour voir les messages" },
          ],
        },
      ],
      quiz: [
        {
          id: "q3-1",
          question: "Dans le processus O2C standard, dans quel ordre ces étapes se déroulent-elles ?",
          options: [
            "Commande → Facture → Livraison → PGI → Paiement",
            "Commande → Livraison → PGI → Facture → Paiement",
            "Livraison → Commande → PGI → Facture → Paiement",
            "Commande → PGI → Livraison → Facture → Paiement",
          ],
          correctIndex: 1,
          explanation: "Le processus O2C standard est : Commande de vente → Livraison (création du document de livraison) → Post Goods Issue (PGI — sortie physique des stocks) → Facture → Paiement client. La facturation intervient après la PGI.",
        },
        {
          id: "q3-2",
          question: "Qu'est-ce que la catégorie de poste (Item Category) dans une commande de vente SAP SD ?",
          options: [
            "Le type de document de vente utilisé (OR, RE, CR...)",
            "Un paramètre déterminant le comportement d'une ligne de commande (pertinence livraison, facturation)",
            "La catégorie d'article de la fiche article (ROH, FERT, DIEN...)",
            "Le canal de distribution associé à la commande",
          ],
          correctIndex: 1,
          explanation: "La catégorie de poste (ex: TAN pour poste standard) détermine le comportement de chaque ligne de commande : est-elle pertinente pour la livraison ? pour la facturation ? déclenche-t-elle une vérif. de dispo ? Elle est déterminée automatiquement à partir du type de document + groupe de catégorie de poste de la fiche article.",
        },
        {
          id: "q3-3",
          question: "Quelle transaction permet de libérer des commandes de vente bloquées pour dépassement de limite de crédit ?",
          options: [
            "VA02",
            "FD32",
            "VKM3",
            "V.02",
          ],
          correctIndex: 2,
          explanation: "VKM3 est la transaction pour libérer les commandes de vente bloquées par la gestion du crédit. FD32 sert à définir/modifier la limite de crédit d'un client. V.02 liste les documents incomplets.",
        },
        {
          id: "q3-4",
          question: "Dans le processus de retour client, quel est le mouvement de stock déclenché lors de la réception de la marchandise retournée ?",
          options: [
            "Mouvement 101 (entrée marchandise sur commande d'achat)",
            "Mouvement 601 (sortie marchandise sur livraison)",
            "Mouvement 651 ou 653 (retour client)",
            "Mouvement 261 (consommation pour ordre de fabrication)",
          ],
          correctIndex: 2,
          explanation: "Lors d'un retour client, la réception de la marchandise génère le mouvement 651 (retour sur livraison de retour, stock en contrôle qualité) ou 653 (transfert vers stock de vente utilisable). Ces mouvements sont spécifiques au processus de retour SD.",
        },
        {
          id: "q3-5",
          question: "Quel est le rôle du partenaire 'SH' (Ship-to Party) dans une commande de vente SAP SD ?",
          options: [
            "Le client qui passe la commande et est responsable du paiement",
            "Le destinataire physique de la livraison (peut différer du donneur d'ordre)",
            "Le destinataire de la facture",
            "Le représentant commercial assigné à la commande",
          ],
          correctIndex: 1,
          explanation: "SH (Ship-to Party) est le destinataire physique de la livraison. Il peut être différent du SP (Sold-to Party — donneur d'ordre) quand le client commande pour plusieurs sites de livraison. L'adresse SH est utilisée pour le bon de livraison.",
        },
        {
          id: "q3-6",
          question: "Qu'est-ce que le Transfert des besoins (Transfer of Requirements) en SAP SD ?",
          options: [
            "Le transfert des données d'une commande vers la livraison via le Copy Control",
            "Le mécanisme communiquant les besoins d'une commande de vente vers MRP/PP pour approvisionnement ou production",
            "Le transfert des enregistrements de conditions vers la procédure tarifaire",
            "La communication des données client entre SD et FI",
          ],
          correctIndex: 1,
          explanation: "Le Transfert des besoins (ToR) est le mécanisme par lequel une commande de vente communique ses besoins à MRP/PP. Cela déclenche l'approvisionnement ou la production pour satisfaire la demande client à la date confirmée.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 4 — Livraisons et expédition
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch4", number: 4,
      title: "Livraisons et gestion des expéditions",
      weight: 16, isPremium: true,
      lessons: [
        {
          id: "l4-1",
          title: "Création de livraison, picking et emballage",
          content: [
            "Le document de livraison (Outbound Delivery) est créé à partir d'une commande de vente. Il déclenche les opérations logistiques : picking, emballage, chargement et expédition. La création de livraison peut être faite individuellement (VL01N) ou en masse via la liste de livraisons à créer (VL10C/VL10D).",
            "Les critères de création de livraison sont : la date de livraison demandée, le point d'expédition (déterminé automatiquement), et les délais configurés (délai de préparation, délai de chargement). La date de prélèvement (Picking Date) est calculée en reculant les délais depuis la date de livraison.",
            "Le Picking consiste à prélever physiquement les marchandises dans l'entrepôt selon les quantités indiquées dans la livraison. Dans le WM classique, le picking crée un ordre de transfert (Transfer Order). Dans SAP EWM (S/4HANA), il crée un ordre de prélèvement. La quantité prélevée est saisie dans la livraison (VL02N, onglet Picking).",
            "L'Emballage (Packing) dans SAP SD permet de regrouper les positions de livraison dans des unités de manutention (Handling Units — HU) : palettes, cartons, conteneurs. Il est optionnel sauf si l'article est géré en unités de manutention. La transaction VL02N permet de gérer l'emballage.",
            "La Vérification de disponibilité au moment de la livraison permet de confirmer les quantités disponibles pour la livraison. En cas de stock insuffisant, une livraison partielle peut être créée si le client l'autorise (paramètre 'Livraisons partielles' dans la fiche client)."
          ],
          keyConcepts: [
            { term: "Document de livraison (Outbound Delivery)", definition: "Document logistique créé depuis une commande. Déclenche picking, emballage, expédition. Type LF (standard). Créé via VL01N ou VL10C en masse." },
            { term: "Picking", definition: "Prélèvement physique des marchandises selon les quantités de la livraison. Crée un ordre de transfert (WM) ou ordre de prélèvement (EWM). Quantité saisie dans VL02N." },
            { term: "Unité de manutention (Handling Unit)", definition: "Palette, carton, conteneur regroupant des positions de livraison. Gérée lors de l'emballage. Peut avoir un numéro de série/lot." },
            { term: "Date de prélèvement", definition: "Calculée en reculant les délais de préparation et chargement depuis la date de livraison souhaitée. Détermine quand le picking doit commencer." },
          ],
          tcodes: [
            { code: "VL01N", description: "Créer une livraison de sortie" },
            { code: "VL02N", description: "Modifier une livraison (picking, emballage, PGI)" },
            { code: "VL10C", description: "Créer des livraisons en masse depuis commandes de vente" },
            { code: "VL06O", description: "Monitor des livraisons de sortie" },
          ],
        },
        {
          id: "l4-2",
          title: "Sortie de marchandises (Post Goods Issue) et intégration avec FI/MM",
          content: [
            "La Sortie de marchandises (Post Goods Issue — PGI) est l'étape clé du processus de livraison. Elle déclenche simultanément plusieurs événements : mouvement de stock (601 — sortie marchandise), mise à jour de la valeur du stock dans MM, et génération d'une écriture comptable en FI.",
            "Impact comptable de la PGI : un mouvement 601 est généré, réduisant le stock de la division de livraison. En parallèle, une écriture comptable automatique est générée : Débit 'Coût des ventes' (compte COGS), Crédit 'Stock' (compte bilan). Cette écriture est basée sur la détermination de compte automatique (OBYC en MM).",
            "La PGI peut être effectuée directement depuis VL02N ou via des transactions de traitement en masse (VL06G — confirmer PGI). Après la PGI, la livraison est verrouillée et ne peut plus être modifiée. Une annulation de PGI (mouvement 602) est possible avant facturation.",
            "La gestion des numéros de série et de lots (Batch/Serial Number Management) peut être requise lors de la PGI. Pour les articles gérés par lot, le lot doit être sélectionné avant la PGI. Pour les articles gérés par numéro de série, chaque numéro de série doit être assigné à la position de livraison.",
            "En S/4HANA, la PGI s'intègre avec SAP EWM pour le processus de confirmation de sortie d'entrepôt. La traçabilité est améliorée avec les nouvelles fonctions de gestion des numéros de série et des substances dangereuses."
          ],
          keyConcepts: [
            { term: "Post Goods Issue (PGI)", definition: "Étape clé de la livraison. Déclenche : mouvement stock 601, mise à jour valeur stock MM, écriture comptable FI (Débit COGS / Crédit Stock). Rend la livraison non modifiable." },
            { term: "Mouvement 601", definition: "Sortie de marchandises sur livraison de vente. Généré lors de la PGI. Réduit le stock de la division de livraison." },
            { term: "Mouvement 602", description: "Annulation de la PGI (contre-passation du mouvement 601). Possible avant facturation." },
            { term: "Gestion par lots (Batch Management)", definition: "Si l'article est géré par lot, le lot doit être sélectionné lors du picking ou avant la PGI. La traçabilité des lots est maintenue tout au long du processus." },
          ],
          tcodes: [
            { code: "VL02N", description: "Modifier livraison — effectuer la PGI (Post Goods Issue)" },
            { code: "VL06G", description: "Confirmer les PGI en masse (goods issue monitor)" },
            { code: "MB51", description: "Rapport des mouvements de stock (inclut mouvements 601/602)" },
          ],
        },
      ],
      quiz: [
        {
          id: "q4-1",
          question: "Quel mouvement de stock est généré lors de la sortie de marchandises (Post Goods Issue) sur une livraison de vente ?",
          options: [
            "Mouvement 101",
            "Mouvement 261",
            "Mouvement 601",
            "Mouvement 701",
          ],
          correctIndex: 2,
          explanation: "Le mouvement 601 est le mouvement standard de sortie de marchandises sur livraison de vente (Post Goods Issue). Il réduit le stock de la division de livraison et génère simultanément une écriture comptable en FI.",
        },
        {
          id: "q4-2",
          question: "Quelle transaction permet de créer une livraison de sortie individuellement dans SAP SD ?",
          options: [
            "VA01",
            "VF01",
            "VL01N",
            "VL10C",
          ],
          correctIndex: 2,
          explanation: "VL01N crée une livraison de sortie individuellement. VL10C crée des livraisons en masse depuis une liste de commandes. VF01 crée des factures. VA01 crée des commandes de vente.",
        },
        {
          id: "q4-3",
          question: "Quelle écriture comptable est générée lors de la Post Goods Issue (PGI) ?",
          options: [
            "Débit Client / Crédit Chiffre d'affaires",
            "Débit Stock / Crédit Compte de régularisation",
            "Débit Coût des ventes (COGS) / Crédit Stock",
            "Débit Compte de tiers / Crédit Banque",
          ],
          correctIndex: 2,
          explanation: "La PGI génère l'écriture : Débit 'Coût des ventes' (COGS) / Crédit 'Stock'. Cette écriture reflète la sortie du stock au prix de revient. L'écriture de chiffre d'affaires (Débit Client / Crédit CA) est générée plus tard lors de la facturation.",
        },
        {
          id: "q4-4",
          question: "Qu'est-ce que le picking dans le processus de livraison SAP SD ?",
          options: [
            "La sélection automatique du point d'expédition pour la livraison",
            "Le prélèvement physique des marchandises dans l'entrepôt selon les quantités de la livraison",
            "La validation finale de la sortie de marchandises du stock",
            "La création automatique des documents de transport",
          ],
          correctIndex: 1,
          explanation: "Le picking est le prélèvement physique des marchandises dans l'entrepôt selon les quantités indiquées dans le document de livraison. Dans WM classique, il crée un ordre de transfert. Dans EWM, il crée un ordre de prélèvement. Les quantités prélevées sont confirmées dans VL02N.",
        },
        {
          id: "q4-5",
          question: "Après la Post Goods Issue (PGI), que se passe-t-il avec le document de livraison ?",
          options: [
            "Il est automatiquement supprimé du système",
            "Il devient non modifiable — une annulation (mouvement 602) est possible avant facturation",
            "Il peut encore être modifié pour corriger les quantités livrées",
            "Il est automatiquement converti en facture",
          ],
          correctIndex: 1,
          explanation: "Après la PGI, le document de livraison est verrouillé et ne peut plus être modifié. Si une correction est nécessaire, il faut annuler la PGI (mouvement 602) avant de pouvoir modifier la livraison. L'annulation n'est possible que si la facture n'a pas encore été créée.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 5 — Facturation et intégration FI
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch5", number: 5,
      title: "Facturation et intégration comptable",
      weight: 14, isPremium: true,
      lessons: [
        {
          id: "l5-1",
          title: "Documents de facturation et processus de facturation",
          content: [
            "La facturation (Billing) est l'étape finale du processus O2C côté logistique. Elle génère le document de facturation SD et déclenche l'écriture comptable en FI. La facturation intervient après la Post Goods Issue pour les livraisons de marchandises physiques.",
            "Les types de documents de facturation principaux : F2 (Facture standard), RE (Avoir — Credit Memo), L2 (Facture inter-sociétés), IV (Facture inter-divisions). Le type de document de facturation est déterminé par le Copy Control depuis la livraison ou la commande.",
            "La Liste des factures à créer (Billing Due List — VF04) liste tous les documents prêts à être facturés. Elle permet la facturation en masse. Les critères de sélection incluent : domaine commercial, point d'expédition, plage de dates. Les documents sont regroupés en une seule facture selon les critères de regroupement.",
            "Les critères de regroupement de facturation déterminent quand plusieurs livraisons peuvent être regroupées en une seule facture : même client payeur, même devise, même division de vente, même incoterms. Si un critère diffère, des factures séparées sont créées.",
            "La facturation inter-sociétés (Intercompany Billing) gère le cas où la société de vente (qui prend la commande) et la société de livraison (qui expédie) sont différentes. SAP génère deux factures : une facture externe au client et une facture inter-sociétés entre les deux sociétés."
          ],
          keyConcepts: [
            { term: "Document de facturation (F2)", definition: "Document SD de facturation standard. Généré après la PGI. Déclenche l'écriture comptable en FI (Débit Client / Crédit Chiffre d'affaires)." },
            { term: "Billing Due List (VF04)", definition: "Liste des documents prêts à être facturés. Permet la facturation en masse. Regroupe les livraisons selon les critères de regroupement." },
            { term: "Critères de regroupement", definition: "Paramètres qui doivent être identiques pour regrouper plusieurs livraisons en une seule facture : client payeur, devise, division de vente, incoterms." },
            { term: "Avoir (Credit Memo)", definition: "Document de facturation négatif créé depuis une demande d'avoir (CR). Corrige une facture précédente en faveur du client." },
          ],
          tcodes: [
            { code: "VF01", description: "Créer un document de facturation" },
            { code: "VF02", description: "Modifier un document de facturation" },
            { code: "VF03", description: "Afficher un document de facturation" },
            { code: "VF04", description: "Billing Due List — facturation en masse" },
            { code: "VF11", description: "Annuler un document de facturation" },
          ],
        },
        {
          id: "l5-2",
          title: "Détermination de compte et comptabilisation en FI",
          content: [
            "Lors de la sauvegarde d'un document de facturation, SAP déclenche automatiquement la comptabilisation en FI. Cette comptabilisation est entièrement automatisée grâce à la Détermination de compte de résultat (Revenue Account Determination).",
            "L'écriture comptable standard d'une facture SD : Débit Compte client (AR — Accounts Receivable), Crédit Compte de chiffre d'affaires (Revenue account). Des comptes supplémentaires peuvent être touchés : compte de taxe sur les ventes, compte de fret, compte de remises.",
            "La détermination du compte de chiffre d'affaires repose sur une combinaison de critères : Groupe de comptes de résultat (Account Assignment Group de la fiche article), Groupe de comptes clients (Account Assignment Group de la fiche client), Domaine commercial. La configuration se fait dans VKOA.",
            "Si la comptabilisation échoue (compte non trouvé, période comptable fermée), la facture est bloquée pour comptabilisation. Le statut de comptabilisation est visible dans la facture (VF02). La retransfer vers FI se fait via VF02 → Comptabilisation ou en masse via VFX3.",
            "En S/4HANA, la comptabilisation SD en FI s'intègre avec le Universal Journal (ACDOCA). Les données analytiques (centre de profit, segment) sont transmises en temps réel depuis la commande SD."
          ],
          keyConcepts: [
            { term: "Revenue Account Determination", definition: "Détermine automatiquement le compte de chiffre d'affaires lors de la facturation. Basé sur : groupe de comptes article + groupe de comptes client + domaine commercial. Configuré dans VKOA." },
            { term: "Écriture comptable facture SD", definition: "Débit Compte client (AR) / Crédit Compte de chiffre d'affaires. Comptes supplémentaires selon les conditions tarifaires (taxe, remises, fret)." },
            { term: "Blocage de comptabilisation", definition: "Si la comptabilisation FI échoue, la facture est bloquée. Correction via VF02 ou retransfert en masse via VFX3." },
          ],
          tcodes: [
            { code: "VKOA", description: "Configurer la détermination des comptes de résultat SD" },
            { code: "VFX3", description: "Retransférer en FI les factures bloquées pour comptabilisation" },
            { code: "VF02", description: "Modifier facture — retransférer vers FI si bloquée" },
          ],
        },
      ],
      quiz: [
        {
          id: "q5-1",
          question: "Quelle écriture comptable est générée lors de la création d'une facture SD (document F2) ?",
          options: [
            "Débit Coût des ventes / Crédit Stock",
            "Débit Compte client (AR) / Crédit Compte chiffre d'affaires",
            "Débit Banque / Crédit Compte client",
            "Débit Stock / Crédit Compte de régularisation",
          ],
          correctIndex: 1,
          explanation: "La création d'une facture SD génère l'écriture : Débit Compte client (AR — Accounts Receivable) / Crédit Compte de chiffre d'affaires (Revenue). L'écriture de coût des ventes (Débit COGS / Crédit Stock) a déjà été générée lors de la PGI.",
        },
        {
          id: "q5-2",
          question: "Quelle transaction affiche la liste des documents prêts à être facturés (Billing Due List) ?",
          options: [
            "VF01",
            "VF04",
            "VL06O",
            "VA05",
          ],
          correctIndex: 1,
          explanation: "VF04 est la Billing Due List — elle liste tous les documents (livraisons, commandes) prêts à être facturés. Elle permet la facturation en masse avec regroupement automatique selon les critères de regroupement.",
        },
        {
          id: "q5-3",
          question: "Où est configurée la détermination automatique des comptes de chiffre d'affaires lors de la facturation SD ?",
          options: [
            "OBYC (Automatic Account Determination MM)",
            "VKOA (Revenue Account Determination SD)",
            "OB40 (Automatic Postings FI)",
            "V/08 (Pricing Procedure)",
          ],
          correctIndex: 1,
          explanation: "VKOA est la transaction de configuration de la détermination de compte de résultat SD (Revenue Account Determination). Elle définit quel compte de chiffre d'affaires est utilisé selon la combinaison groupe de comptes article + groupe de comptes client + domaine commercial.",
        },
        {
          id: "q5-4",
          question: "Dans quelles circonstances plusieurs livraisons peuvent-elles être regroupées en une seule facture ?",
          options: [
            "Toujours, si elles proviennent du même point d'expédition",
            "Si elles partagent les mêmes critères de regroupement : même client payeur, même devise, même division de vente",
            "Uniquement si elles ont le même numéro de commande de vente",
            "Toujours, si elles ont la même date de PGI",
          ],
          correctIndex: 1,
          explanation: "Le regroupement de facturation repose sur des critères définis dans le Copy Control : même client payeur (PY), même devise, même division de vente, mêmes incoterms, etc. Si un critère diffère entre deux livraisons, elles génèrent des factures séparées.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 6 — Détermination des prix et conditions
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch6", number: 6,
      title: "Détermination des prix et technique de conditions",
      weight: 14, isPremium: true,
      lessons: [
        {
          id: "l6-1",
          title: "Technique de conditions : types, tables et procédures tarifaires",
          content: [
            "La technique de conditions (Condition Technique) est le mécanisme qui détermine automatiquement les prix, remises, taxes et suppléments dans une commande de vente. Elle repose sur quatre éléments : les types de conditions, les tables de conditions, les séquences d'accès et les procédures tarifaires.",
            "Le Type de condition (Condition Type) définit la nature d'un élément de prix : PR00 = prix de base, K007 = remise client, K005 = remise article, MWST = taxe sur la valeur ajoutée, KF00 = supplément de fret. Chaque type de condition a un paramètre de calcul (montant fixe, pourcentage, par unité).",
            "La Table de condition (Condition Table) définit les clés de recherche pour les enregistrements de conditions. Exemple : Table 305 = Division de vente / Canal de distribution / Client / Article. Les valeurs stockées dans VK11 correspondent à des combinaisons de ces clés.",
            "La Séquence d'accès (Access Sequence) définit l'ordre de recherche des tables pour un type de condition. SAP cherche de la plus spécifique à la plus générale. Exemple pour PR00 : 1) Article spécifique client → 2) Liste de prix + article → 3) Article seul. La première valeur trouvée est utilisée.",
            "La Procédure tarifaire (Pricing Procedure) est la liste ordonnée de tous les types de conditions appliqués à une commande : prix de base, remises, taxes, fret. Elle est déterminée par la combinaison Division de vente + Canal de distribution + Groupe de procédure tarifaire (client) + Indicateur de procédure (article)."
          ],
          keyConcepts: [
            { term: "Type de condition", definition: "Définit la nature d'un élément tarifaire : PR00=prix base, K007=remise client %, K005=remise article, MWST=TVA. Paramètre de calcul : montant fixe, %, par unité." },
            { term: "Séquence d'accès", definition: "Ordre de recherche dans les tables de conditions : du plus spécifique (client+article) au plus général (article seul). Première valeur trouvée = appliquée." },
            { term: "Procédure tarifaire", definition: "Liste ordonnée de tous les types de conditions d'une commande. Déterminée par : Division de vente + Canal de distribution + Groupe tarifaire client + Indicateur tarifaire article." },
            { term: "Enregistrement de condition", definition: "Valeur stockée dans une table de conditions pour une combinaison de clés (client, article, période). Créé/modifié via VK11/VK12." },
          ],
          tcodes: [
            { code: "V/06", description: "Configurer les types de conditions (Condition Types)" },
            { code: "V/07", description: "Configurer les séquences d'accès" },
            { code: "V/08", description: "Configurer les procédures tarifaires" },
            { code: "VK11", description: "Créer enregistrements de conditions" },
            { code: "VK13", description: "Afficher enregistrements de conditions" },
          ],
        },
        {
          id: "l6-2",
          title: "Conditions manuelles, remises et gestion des prix spéciaux",
          content: [
            "Certaines conditions peuvent être saisies manuellement dans une commande de vente. Le paramètre 'Manuel' du type de condition détermine si la valeur peut être modifiée par l'utilisateur. Les conditions manuelles obligatoires doivent être saisies sinon la commande est incomplète.",
            "Les Remises de fin d'année (Rebates) sont gérées dans SAP SD via les accords de remise (Rebate Agreements). Contrairement aux remises immédiates, les remises de fin d'année s'accumulent tout au long de la période d'accord et sont versées en fin de période sous forme d'avoir. Configuration : VB01 (créer accord de remise).",
            "La gestion des prix en devises étrangères est automatiquement gérée : SAP convertit le prix en devise de la commande selon le taux de change configuré. Le type de taux de change (M=cours moyen, B=cours acheteur) est défini dans les paramètres de la commande.",
            "Les Listes de prix (Price Lists) permettent de maintenir des tarifs standardisés applicables à des groupes de clients. Une liste de prix est référencée dans la fiche client (données domaine commercial) et utilisée par la séquence d'accès.",
            "En S/4HANA, la gestion tarifaire évolue avec SAP Pricing Engine basé sur BRF+ pour les règles complexes, et les Fiori apps pour la maintenance des prix (Manage Prices, Create Sales Conditions) facilitent la gestion quotidienne des tarifs."
          ],
          keyConcepts: [
            { term: "Accord de remise (Rebate Agreement)", definition: "Remise de fin d'année accumulée sur une période. S'applique rétroactivement sur le CA réalisé. Versée en avoir en fin de période. Géré via VB01/VB02." },
            { term: "Liste de prix", definition: "Tarif standardisé associé à un groupe de clients. Référencée dans la fiche client, utilisée dans la séquence d'accès pour la détermination du prix de base." },
            { term: "Condition manuelle", definition: "Type de condition modifiable par l'utilisateur dans la commande. Peut être obligatoire (commande incomplète si non saisie) ou optionnel." },
          ],
          tcodes: [
            { code: "VB01", description: "Créer un accord de remise (Rebate Agreement)" },
            { code: "VB02", description: "Modifier un accord de remise" },
            { code: "VB(0", description: "Traiter les règlements de remises de fin d'année" },
          ],
        },
      ],
      quiz: [
        {
          id: "q6-1",
          question: "Quel type de condition standard représente le prix de base dans SAP SD ?",
          options: [
            "K007",
            "MWST",
            "PR00",
            "KF00",
          ],
          correctIndex: 2,
          explanation: "PR00 est le type de condition standard pour le prix de base (Base Price) en SAP SD. K007 est la remise client en %, MWST est la taxe sur la valeur ajoutée, KF00 est le supplément de fret.",
        },
        {
          id: "q6-2",
          question: "Qu'est-ce que la séquence d'accès (Access Sequence) dans la technique de conditions SD ?",
          options: [
            "L'ordre dans lequel les types de conditions sont appliqués dans la procédure tarifaire",
            "L'ordre de recherche dans les tables de conditions, du plus spécifique au plus général",
            "La séquence d'autorisation pour modifier les prix dans une commande",
            "L'ordre de création des documents dans le cycle O2C",
          ],
          correctIndex: 1,
          explanation: "La séquence d'accès définit l'ordre de recherche dans les tables de conditions, du plus spécifique au plus général. Exemple pour PR00 : d'abord client+article (spécifique), puis liste de prix+article, puis article seul. La première valeur trouvée est appliquée.",
        },
        {
          id: "q6-3",
          question: "Comment est déterminée la procédure tarifaire dans une commande de vente SAP SD ?",
          options: [
            "Par le type de document de vente uniquement",
            "Par la Division de vente + Canal de distribution + Groupe tarifaire client + Indicateur tarifaire article",
            "Par la Division de vente + le type d'article + le groupe de clients",
            "Par le domaine commercial + la catégorie de poste",
          ],
          correctIndex: 1,
          explanation: "La procédure tarifaire est déterminée par la combinaison de : Division de vente + Canal de distribution + Groupe de procédure tarifaire (attribut de la fiche client, données domaine commercial) + Indicateur de procédure tarifaire (attribut de la fiche article, vue ventes).",
        },
        {
          id: "q6-4",
          question: "Quelle est la différence principale entre une remise immédiate et un accord de remise (Rebate) en SAP SD ?",
          options: [
            "La remise immédiate s'applique ligne par ligne, l'accord de remise s'applique sur l'en-tête de commande",
            "La remise immédiate réduit le prix dans chaque facture, l'accord de remise s'accumule et est versé en avoir en fin de période",
            "La remise immédiate nécessite une approbation manuelle, l'accord de remise est automatique",
            "Il n'y a pas de différence, les deux réduisent le montant de la facture",
          ],
          correctIndex: 1,
          explanation: "La remise immédiate (K007, K005…) réduit directement le prix dans chaque facture. L'accord de remise (Rebate Agreement) s'accumule au fil des transactions sur toute la période de l'accord et est finalement versé sous forme d'avoir en fin de période contractuelle.",
        },
        {
          id: "q6-5",
          question: "Quelle transaction permet de créer des enregistrements de prix et remises (Condition Records) en SAP SD ?",
          options: [
            "V/08",
            "VK11",
            "VD51",
            "VA01",
          ],
          correctIndex: 1,
          explanation: "VK11 est la transaction pour créer des enregistrements de conditions (Condition Records) — prix, remises, taxes. V/08 configure les procédures tarifaires. VD51 crée des fiches info client-article.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 7 — Gestion du crédit et fonctions spéciales
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch7", number: 7,
      title: "Gestion du crédit, sorties et fonctions spéciales",
      weight: 10, isPremium: true,
      lessons: [
        {
          id: "l7-1",
          title: "Gestion du crédit client en SAP SD",
          content: [
            "La gestion du crédit (Credit Management) dans SAP SD permet de contrôler l'exposition financière envers les clients en définissant des limites de crédit et en bloquant automatiquement les commandes ou livraisons dépassant ces limites.",
            "Les deux approches de gestion du crédit en SAP SD : le Credit Management classique (module FI-AR, configuration via OVA8) et le SAP Credit Management (module FSCM — Financial Supply Chain Management) disponible depuis SAP ECC 6.0 et amélioré en S/4HANA.",
            "La limite de crédit est définie au niveau du client dans FD32 (Credit Management — Change). Elle peut être définie à plusieurs niveaux : par société, par groupe de crédit. La vérification peut s'effectuer à la commande, à la livraison ou aux deux.",
            "Lorsqu'une commande dépasse la limite de crédit, elle peut être bloquée automatiquement (statut 'B' pour Bloqué). Les commandes bloquées sont visibles dans VKM1 (liste de toutes les commandes bloquées crédit) et libérables dans VKM3. Les gestionnaires crédit peuvent approuver ou rejeter.",
            "En S/4HANA, SAP Credit Management (FSCM) offre des fonctions avancées : scoring de crédit, intégration avec des agences de notation externes, workflow d'approbation, tableau de bord crédit. La transaction UKM_BP remplace FD32 pour la gestion des limites FSCM."
          ],
          keyConcepts: [
            { term: "Limite de crédit", definition: "Montant maximal d'exposition autorisé pour un client. Défini dans FD32. La vérification peut se faire à la commande et/ou à la livraison." },
            { term: "VKM1 / VKM3", definition: "VKM1 = liste de toutes les commandes bloquées pour crédit. VKM3 = libérer les commandes bloquées pour crédit (après analyse du gestionnaire crédit)." },
            { term: "SAP Credit Management (FSCM)", definition: "Module avancé S/4HANA pour la gestion du crédit : scoring, notation externe, workflow approbation. Remplace le Credit Management classique FI-AR." },
            { term: "Groupe de crédit", definition: "Regroupe les clients pour la gestion de crédit. Plusieurs clients peuvent partager une limite de crédit commune (ex: un groupe et ses filiales)." },
          ],
          tcodes: [
            { code: "FD32", description: "Modifier la limite de crédit d'un client (Credit Management classique)" },
            { code: "VKM1", description: "Liste des documents bloqués pour contrôle de crédit" },
            { code: "VKM3", description: "Libérer les documents de vente bloqués pour crédit" },
            { code: "F.31", description: "Rapport de gestion du crédit client" },
          ],
        },
        {
          id: "l7-2",
          title: "Gestion des sorties (Output Management) et processus spéciaux SD",
          content: [
            "La Gestion des sorties (Output Management) détermine et gère les communications générées par les documents SD : confirmation de commande, bon de livraison, facture, rappels. Les sorties sont définies par des types de messages (Message Types) et déterminées automatiquement par des enregistrements de conditions.",
            "Les types de messages standards SD : BA00 (confirmation de commande), LD00 (bon de livraison), RD00 (facture), KRML (rappel de livraison). La sortie peut être transmise par impression, EDI (IDOC), email, fax ou télécopie selon le partenaire de traitement (Medium).",
            "Les Processus de vente spéciaux incluent : la Vente en consignation (client garde les marchandises chez lui, facturation lors de la consommation réelle — types KONS), la Vente au comptant/Vente directe (Cash Sale — CS, facture immédiate à la commande), la Commande urgente (Rush Order — RO, livraison créée automatiquement).",
            "La Gestion des gammes de produits (Product Listing/Exclusion) permet de définir pour chaque client les articles autorisés (listing) ou interdits (exclusion) à la vente. Ces règles sont vérifiées lors de la saisie de la commande.",
            "En S/4HANA, le Output Management évolue vers SAP Business Technology Platform (BTP) avec des canaux de communication modernes (email HTML, portail client Ariba, EDI amélioré). Les Fiori apps 'Manage Output Parameters' et 'Schedule Output Jobs' simplifient la gestion quotidienne des sorties."
          ],
          keyConcepts: [
            { term: "Type de message (Output Type)", definition: "Définit le type de communication SD : BA00=confirmation commande, LD00=bon de livraison, RD00=facture. Déterminé par des enregistrements de conditions." },
            { term: "Vente en consignation", definition: "Marchandises chez le client, facturation à la consommation. Types de documents spécifiques KONS (remplissage), CONS (prélèvement), CORI (retour), KORR (règlement)." },
            { term: "Cash Sale (CS)", definition: "Vente au comptant : facture générée immédiatement lors de la commande. Livraison créée automatiquement. Pas de poste client ouvert en FI." },
            { term: "Product Listing/Exclusion", definition: "Règles définissant les articles autorisés (listing) ou interdits (exclusion) pour chaque client. Vérifiées lors de la saisie de la commande." },
          ],
          tcodes: [
            { code: "VV11", description: "Créer enregistrement de condition pour Output (sorties)" },
            { code: "V/40", description: "Configurer les procédures de sortie (Output Determination)" },
            { code: "VB21", description: "Créer listes d'articles (Product Listing)" },
            { code: "VB31", description: "Créer exclusions d'articles (Product Exclusion)" },
          ],
        },
      ],
      quiz: [
        {
          id: "q7-1",
          question: "Quelle transaction permet de libérer les commandes de vente bloquées par la gestion du crédit ?",
          options: [
            "FD32",
            "VKM1",
            "VKM3",
            "VA02",
          ],
          correctIndex: 2,
          explanation: "VKM3 permet de libérer les commandes de vente bloquées pour dépassement de limite de crédit. VKM1 liste les documents bloqués. FD32 modifie la limite de crédit d'un client.",
        },
        {
          id: "q7-2",
          question: "Dans le processus de vente en consignation, à quel moment la facturation est-elle déclenchée ?",
          options: [
            "Lors de la création de la commande de consignation",
            "Lors de la livraison des marchandises chez le client",
            "Lors de la consommation réelle des marchandises par le client",
            "À la fin de chaque mois calendaire",
          ],
          correctIndex: 2,
          explanation: "Dans la vente en consignation, les marchandises sont livrées chez le client mais restent la propriété du vendeur. La facturation n'intervient que lors du prélèvement de consignation (CONS), c'est-à-dire quand le client consomme/utilise réellement les marchandises.",
        },
        {
          id: "q7-3",
          question: "Quel type de message Output SD est utilisé pour la confirmation de commande ?",
          options: [
            "LD00",
            "RD00",
            "BA00",
            "KRML",
          ],
          correctIndex: 2,
          explanation: "BA00 est le type de message standard pour la confirmation de commande (Order Confirmation). LD00 est pour le bon de livraison, RD00 pour la facture, KRML pour les rappels de livraison.",
        },
        {
          id: "q7-4",
          question: "Que permet la fonction 'Product Exclusion' dans SAP SD ?",
          options: [
            "Exclure certains articles de la procédure tarifaire automatique",
            "Définir des articles interdits à la vente pour un client spécifique",
            "Bloquer des articles dont le stock est insuffisant",
            "Exclure des articles de la vérification de disponibilité ATP",
          ],
          correctIndex: 1,
          explanation: "Product Exclusion permet de définir des articles interdits à la vente pour un client spécifique. Si un utilisateur tente de saisir un article exclu pour ce client, SAP génère un message d'erreur. À l'inverse, Product Listing définit les seuls articles autorisés pour un client.",
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// QUESTIONS SIMULATEUR D'EXAMEN — 40 questions
// ═══════════════════════════════════════════════════════════════════════════
export const sdMockExamQuestions = [
  // Chapitre 1 — Structures organisationnelles SD
  {
    id: "exam-1",
    chapter: "Structures organisationnelles SD",
    question: "Quelle entité organisationnelle est la combinaison de Division de vente + Canal de distribution + Secteur d'activité ?",
    options: ["Zone de vente", "Domaine commercial (Sales Area)", "Organisation commerciale", "Groupe de vente"],
    correctIndex: 1,
    explanation: "Le Domaine commercial (Sales Area) est la combinaison unique des trois entités : Division de vente + Canal de distribution + Secteur d'activité. C'est la clé de référence de toute transaction SD.",
  },
  {
    id: "exam-2",
    chapter: "Structures organisationnelles SD",
    question: "La Division de vente (Sales Organization) est directement rattachée à :",
    options: ["Au mandant", "À la société comptable (Company Code)", "À la division MM (Plant)", "Au domaine de valorisation"],
    correctIndex: 1,
    explanation: "La Division de vente est rattachée à une Société comptable (Company Code), garantissant que les revenus commerciaux sont comptabilisés dans la bonne entité légale.",
  },
  {
    id: "exam-3",
    chapter: "Structures organisationnelles SD",
    question: "La détermination automatique du point d'expédition repose sur :",
    options: [
      "Division de vente + Canal de distribution + Secteur d'activité",
      "Division MM (Plant) + Groupe de chargement + Conditions d'expédition",
      "Client + Article + Division de vente",
      "Point d'expédition + Division MM + Type de livraison",
    ],
    correctIndex: 1,
    explanation: "La détermination du point d'expédition utilise : Division MM (Plant) + Groupe de chargement (fiche article, vue Ventes Général/Plant) + Conditions d'expédition (fiche client, données domaine commercial).",
  },
  {
    id: "exam-4",
    chapter: "Structures organisationnelles SD",
    question: "En SAP SD, le Secteur d'activité (Division) est :",
    options: [
      "Synonyme de Division MM (Plant)",
      "Un regroupement de produits/services similaires pour le reporting commercial",
      "L'entité responsable de la négociation des prix fournisseurs",
      "Le niveau auquel sont gérés les stocks SD",
    ],
    correctIndex: 1,
    explanation: "Le Secteur d'activité (Division SD) regroupe des produits ou services similaires pour le reporting commercial. Il ne faut pas le confondre avec la Division MM (Plant) qui est une entité logistique.",
  },
  // Chapitre 2 — Données de base
  {
    id: "exam-5",
    chapter: "Données de base SD",
    question: "En S/4HANA, quelle transaction remplace XD01/VD01/FD01 pour la gestion unifiée des clients ?",
    options: ["MM01", "BP (Business Partner)", "ME21N", "F-02"],
    correctIndex: 1,
    explanation: "En S/4HANA, la transaction BP (Business Partner) est la méthode recommandée pour créer et gérer clients et fournisseurs de façon unifiée. Les anciennes transactions fonctionnent encore comme façades.",
  },
  {
    id: "exam-6",
    chapter: "Données de base SD",
    question: "Le groupe de chargement (Loading Group) utilisé pour la détermination du point d'expédition se trouve dans quelle vue de la fiche article ?",
    options: ["Vue Achats", "Vue Comptabilité 1", "Vue Ventes : Général/Division", "Vue MRP 1"],
    correctIndex: 2,
    explanation: "Le groupe de chargement se trouve dans la vue 'Ventes : Général/Division' de la fiche article. Il est l'un des trois critères (avec la division MM et les conditions d'expédition client) pour la détermination automatique du point d'expédition.",
  },
  {
    id: "exam-7",
    chapter: "Données de base SD",
    question: "La Fiche info client-article (KNMT) est créée avec quelle transaction ?",
    options: ["VK11", "VD51", "MM01", "XD01"],
    correctIndex: 1,
    explanation: "VD51 est la transaction pour créer une fiche info client-article (Customer-Material Info Record — KNMT). Elle stocke des données spécifiques à la relation client-article : numéro article client, tolérance de livraison.",
  },
  {
    id: "exam-8",
    chapter: "Données de base SD",
    question: "Le niveau 'Données de la société' de la fiche client contient :",
    options: [
      "Le groupe de clients, les incoterms et les conditions d'expédition",
      "Le nom, l'adresse et le numéro de TVA",
      "Le compte de régularisation (Reconciliation Account) et les modalités de paiement FI",
      "Le point d'expédition et le groupe de transport",
    ],
    correctIndex: 2,
    explanation: "Le niveau 'Données de la société' (Company Code data) contient les données comptables : compte de régularisation (qui lie le compte client au grand livre FI), modalités de paiement, groupe de tolérance. Ces données sont utilisées par FI-AR.",
  },
  {
    id: "exam-9",
    chapter: "Données de base SD",
    question: "Quelle transaction permet de créer des enregistrements de prix et remises en SAP SD ?",
    options: ["VD01", "VA01", "VK11", "VL01N"],
    correctIndex: 2,
    explanation: "VK11 crée des enregistrements de conditions (Condition Records) — prix, remises, suppléments, taxes pour des combinaisons de clés données (client, article, liste de prix…).",
  },
  // Chapitre 3 — Commandes de vente O2C
  {
    id: "exam-10",
    chapter: "Traitement des commandes de vente (O2C)",
    question: "Dans le processus O2C standard, l'ordre correct des étapes est :",
    options: [
      "Commande → Facture → Livraison → PGI",
      "Livraison → Commande → PGI → Facture",
      "Commande → Livraison → PGI → Facture",
      "Commande → PGI → Livraison → Facture",
    ],
    correctIndex: 2,
    explanation: "L'ordre O2C standard est : Commande de vente → Document de livraison (créé depuis la commande) → Post Goods Issue (PGI — sortie physique du stock) → Facture → Paiement.",
  },
  {
    id: "exam-11",
    chapter: "Traitement des commandes de vente (O2C)",
    question: "Qu'est-ce que la vérification de disponibilité (ATP — Available-to-Promise) ?",
    options: [
      "Une vérification de la limite de crédit du client avant création de la commande",
      "Une vérification confirmant si la quantité demandée peut être livrée à la date souhaitée",
      "Une vérification des autorisations utilisateur pour la création de commandes",
      "Une vérification du solde du compte client en FI avant facturation",
    ],
    correctIndex: 1,
    explanation: "ATP (Available-to-Promise) vérifie si la quantité demandée peut être livrée à la date souhaitée, en tenant compte du stock disponible, des entrées prévues et des sorties déjà planifiées. Le résultat est une date confirmée dans la ligne de planification.",
  },
  {
    id: "exam-12",
    chapter: "Traitement des commandes de vente (O2C)",
    question: "Le type de document de vente OR correspond à :",
    options: ["Offre/Devis", "Retour client", "Commande de vente standard", "Commande urgente"],
    correctIndex: 2,
    explanation: "OR est le type de document standard pour une commande de vente normale (Standard Order). QT = Devis, RE = Retour client, RO = Rush Order (commande urgente).",
  },
  {
    id: "exam-13",
    chapter: "Traitement des commandes de vente (O2C)",
    question: "Quelle transaction liste les documents de vente incomplets en SAP SD ?",
    options: ["VA05", "V.02", "VKM1", "VA14L"],
    correctIndex: 1,
    explanation: "V.02 (ou VUA0 en S/4HANA) liste les documents de vente incomplets — ceux qui manquent de champs obligatoires définis dans la procédure d'incomplétude. Ces documents ne peuvent pas être livrés ni facturés.",
  },
  {
    id: "exam-14",
    chapter: "Traitement des commandes de vente (O2C)",
    question: "Dans une commande de vente, quel rôle partenaire reçoit la facture (Bill-to Party) ?",
    options: ["SP", "SH", "BP", "PY"],
    correctIndex: 2,
    explanation: "BP (Bill-to Party) est le destinataire de la facture. SP = Sold-to Party (donneur d'ordre), SH = Ship-to Party (destinataire de la livraison), PY = Payer (responsable du paiement — peut différer du destinataire de la facture).",
  },
  {
    id: "exam-15",
    chapter: "Traitement des commandes de vente (O2C)",
    question: "Quel est le flux d'un retour client standard en SAP SD ?",
    options: [
      "Commande de retour (RE) → PGI → Avoir (Credit Memo)",
      "Commande de retour (RE) → Livraison de retour → Réception marchandises → Avoir",
      "Commande de retour (RE) → Avoir → Livraison de retour",
      "Avoir (Credit Memo Request) → Commande de retour → Livraison",
    ],
    correctIndex: 1,
    explanation: "Le flux de retour client standard est : Commande de retour (RE) → Livraison de retour (créée depuis la commande) → Réception des marchandises (mouvement 651/653) → Avoir (Credit Memo). L'avoir est créé après la réception physique.",
  },
  // Chapitre 4 — Livraisons
  {
    id: "exam-16",
    chapter: "Livraisons et gestion des expéditions",
    question: "Quelle transaction crée une livraison de sortie individuellement en SAP SD ?",
    options: ["VA01", "VF01", "VL01N", "VL10C"],
    correctIndex: 2,
    explanation: "VL01N crée une livraison de sortie individuellement (en spécifiant le point d'expédition et la commande source). VL10C crée des livraisons en masse. VF01 crée des factures.",
  },
  {
    id: "exam-17",
    chapter: "Livraisons et gestion des expéditions",
    question: "Quel mouvement de stock est généré lors de la Post Goods Issue (PGI) sur une livraison de sortie ?",
    options: ["Mouvement 101", "Mouvement 261", "Mouvement 601", "Mouvement 701"],
    correctIndex: 2,
    explanation: "Le mouvement 601 est le mouvement standard de sortie de marchandises sur livraison de vente (PGI). Il réduit le stock de la division de livraison et génère simultanément une écriture comptable FI.",
  },
  {
    id: "exam-18",
    chapter: "Livraisons et gestion des expéditions",
    question: "Après la Post Goods Issue (PGI), le document de livraison :",
    options: [
      "Peut être modifié librement pour corriger les quantités",
      "Est automatiquement supprimé après comptabilisation",
      "Est verrouillé — une annulation (mvt 602) est possible avant facturation",
      "Est automatiquement converti en facture",
    ],
    correctIndex: 2,
    explanation: "Après la PGI, le document de livraison est verrouillé. Pour corriger des erreurs, il faut annuler la PGI (mouvement 602) avant de modifier. L'annulation n'est possible que si la facture n'a pas encore été créée.",
  },
  {
    id: "exam-19",
    chapter: "Livraisons et gestion des expéditions",
    question: "Quelle écriture comptable est générée lors de la PGI ?",
    options: [
      "Débit Client / Crédit Chiffre d'affaires",
      "Débit Coût des ventes (COGS) / Crédit Stock",
      "Débit Stock / Crédit Compte de régularisation",
      "Débit Banque / Crédit Compte client",
    ],
    correctIndex: 1,
    explanation: "La PGI génère l'écriture : Débit 'Coût des ventes' (COGS) / Crédit 'Stock'. Cette écriture reflète la sortie du stock au coût de revient. L'écriture client/chiffre d'affaires est générée plus tard lors de la facturation.",
  },
  {
    id: "exam-20",
    chapter: "Livraisons et gestion des expéditions",
    question: "Quelle transaction permet de surveiller l'ensemble des livraisons de sortie (Delivery Monitor) ?",
    options: ["VL01N", "VL02N", "VL06O", "VF04"],
    correctIndex: 2,
    explanation: "VL06O est le moniteur des livraisons de sortie (Outbound Delivery Monitor). Il liste toutes les livraisons et permet de filtrer par statut (à préparer, à livrer, PGI à effectuer). VL01N crée, VL02N modifie une livraison.",
  },
  // Chapitre 5 — Facturation
  {
    id: "exam-21",
    chapter: "Facturation et intégration comptable",
    question: "Quelle transaction affiche la liste des documents prêts à être facturés (Billing Due List) ?",
    options: ["VF01", "VF04", "VL06O", "VA05"],
    correctIndex: 1,
    explanation: "VF04 est la Billing Due List — elle liste tous les documents (livraisons, commandes) prêts à être facturés et permet la facturation en masse avec regroupement automatique.",
  },
  {
    id: "exam-22",
    chapter: "Facturation et intégration comptable",
    question: "Quelle écriture comptable génère la création d'une facture SD (F2) ?",
    options: [
      "Débit Coût des ventes / Crédit Stock",
      "Débit Compte client (AR) / Crédit Compte chiffre d'affaires",
      "Débit Banque / Crédit Compte client",
      "Débit Stock / Crédit Compte de régularisation",
    ],
    correctIndex: 1,
    explanation: "La création d'une facture SD génère : Débit Compte client (AR) / Crédit Compte de chiffre d'affaires. L'écriture de coût des ventes a déjà été générée lors de la PGI.",
  },
  {
    id: "exam-23",
    chapter: "Facturation et intégration comptable",
    question: "Où est configurée la détermination automatique des comptes de chiffre d'affaires lors de la facturation SD ?",
    options: ["OBYC", "VKOA", "OB40", "V/08"],
    correctIndex: 1,
    explanation: "VKOA configure la Revenue Account Determination SD — la détermination automatique des comptes de chiffre d'affaires lors de la facturation, basée sur le groupe de comptes article + groupe de comptes client + domaine commercial.",
  },
  {
    id: "exam-24",
    chapter: "Facturation et intégration comptable",
    question: "Quelle transaction permet d'annuler un document de facturation SD ?",
    options: ["VF02", "VF11", "VFX3", "VA02"],
    correctIndex: 1,
    explanation: "VF11 annule un document de facturation SD. L'annulation génère un document de contre-passation et annule les écritures comptables FI associées. VF02 modifie une facture existante. VFX3 retransfère les factures bloquées vers FI.",
  },
  {
    id: "exam-25",
    chapter: "Facturation et intégration comptable",
    question: "Pour que plusieurs livraisons soient regroupées en une seule facture, elles doivent avoir :",
    options: [
      "Le même numéro de commande de vente",
      "La même date de PGI",
      "Les mêmes critères de regroupement : client payeur, devise, division de vente, incoterms",
      "Le même point d'expédition",
    ],
    correctIndex: 2,
    explanation: "Le regroupement de facturation repose sur des critères de regroupement configurés dans le Copy Control : même client payeur (PY), même devise, même division de vente, mêmes incoterms. Si un critère diffère, des factures séparées sont créées.",
  },
  // Chapitre 6 — Pricing
  {
    id: "exam-26",
    chapter: "Détermination des prix et technique de conditions",
    question: "Quel type de condition standard représente le prix de base en SAP SD ?",
    options: ["K007", "MWST", "PR00", "KF00"],
    correctIndex: 2,
    explanation: "PR00 est le type de condition standard pour le prix de base (Base Price). K007 = remise client %, MWST = TVA, KF00 = supplément fret.",
  },
  {
    id: "exam-27",
    chapter: "Détermination des prix et technique de conditions",
    question: "La procédure tarifaire (Pricing Procedure) est déterminée par :",
    options: [
      "Le type de document de vente uniquement",
      "Division de vente + Canal de distribution + Groupe tarifaire client + Indicateur tarifaire article",
      "La Division MM + le type d'article + le groupe de clients",
      "Le domaine commercial + la catégorie de poste",
    ],
    correctIndex: 1,
    explanation: "La procédure tarifaire est déterminée par : Division de vente + Canal de distribution + Groupe de procédure tarifaire (fiche client, données domaine commercial) + Indicateur de procédure tarifaire (fiche article, vue ventes).",
  },
  {
    id: "exam-28",
    chapter: "Détermination des prix et technique de conditions",
    question: "Qu'est-ce que la séquence d'accès (Access Sequence) dans la technique de conditions SD ?",
    options: [
      "L'ordre des types de conditions dans la procédure tarifaire",
      "L'ordre de recherche dans les tables de conditions, du plus spécifique au plus général",
      "La séquence d'autorisation pour modifier les prix",
      "L'ordre de création des documents O2C",
    ],
    correctIndex: 1,
    explanation: "La séquence d'accès définit l'ordre de recherche dans les tables de conditions : du plus spécifique au plus général. Exemple : client+article d'abord, puis liste de prix+article, puis article seul. La première valeur trouvée est appliquée.",
  },
  {
    id: "exam-29",
    chapter: "Détermination des prix et technique de conditions",
    question: "Qu'est-ce qu'un accord de remise (Rebate Agreement) en SAP SD ?",
    options: [
      "Une remise immédiate appliquée sur chaque ligne de commande",
      "Un accord dont les remises s'accumulent sur une période et sont versées en avoir en fin de période",
      "Un accord commercial définissant les incoterms avec le client",
      "Un accord de prix fixe négocié pour l'année",
    ],
    correctIndex: 1,
    explanation: "Un Rebate Agreement est un accord de remise dont les montants s'accumulent tout au long de la période contractuelle (basé sur le CA réalisé) et sont finalement versés sous forme d'avoir en fin de période. Différent des remises immédiates (K007/K005).",
  },
  {
    id: "exam-30",
    chapter: "Détermination des prix et technique de conditions",
    question: "Quelle transaction configure les procédures tarifaires en SAP SD ?",
    options: ["VK11", "V/08", "VKOA", "OVA8"],
    correctIndex: 1,
    explanation: "V/08 configure les procédures tarifaires (Pricing Procedures) — la liste ordonnée de tous les types de conditions appliqués dans une commande. VK11 crée des enregistrements de conditions. VKOA configure la détermination des comptes de résultat.",
  },
  // Chapitre 7 — Crédit et fonctions spéciales
  {
    id: "exam-31",
    chapter: "Gestion du crédit, sorties et fonctions spéciales",
    question: "Quelle transaction permet de libérer les commandes bloquées par la gestion du crédit ?",
    options: ["FD32", "VKM1", "VKM3", "VA02"],
    correctIndex: 2,
    explanation: "VKM3 libère les commandes de vente bloquées par la gestion du crédit. VKM1 liste les documents bloqués. FD32 modifie la limite de crédit d'un client.",
  },
  {
    id: "exam-32",
    chapter: "Gestion du crédit, sorties et fonctions spéciales",
    question: "Quel type de message Output SD est utilisé pour la confirmation de commande ?",
    options: ["LD00", "RD00", "BA00", "KRML"],
    correctIndex: 2,
    explanation: "BA00 est le type de message standard pour la confirmation de commande. LD00 = bon de livraison, RD00 = facture, KRML = rappel de livraison.",
  },
  {
    id: "exam-33",
    chapter: "Gestion du crédit, sorties et fonctions spéciales",
    question: "Dans la vente en consignation SAP SD, à quel moment la facturation est-elle déclenchée ?",
    options: [
      "Lors de la livraison des marchandises chez le client",
      "Lors de la consommation/prélèvement réel des marchandises par le client",
      "À la création de la commande de consignation",
      "À la fin de chaque mois",
    ],
    correctIndex: 1,
    explanation: "Dans la vente en consignation, la facturation n'est déclenchée qu'au moment du prélèvement de consignation (CONS) — quand le client consomme/utilise réellement les marchandises. La livraison initiale (KONS) ne génère pas de facture.",
  },
  {
    id: "exam-34",
    chapter: "Gestion du crédit, sorties et fonctions spéciales",
    question: "Quelle transaction définit/modifie la limite de crédit d'un client dans le Credit Management classique ?",
    options: ["VKM3", "OVA8", "FD32", "UKM_BP"],
    correctIndex: 2,
    explanation: "FD32 modifie les données de gestion du crédit d'un client dans le Credit Management classique (FI-AR), incluant la limite de crédit. UKM_BP est utilisé pour SAP Credit Management (FSCM) en S/4HANA.",
  },
  // Questions transversales et intégration
  {
    id: "exam-35",
    chapter: "Structures organisationnelles SD",
    question: "Combien d'entités composent le domaine commercial (Sales Area) ?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
    explanation: "Le domaine commercial est composé de 3 entités : Division de vente (Sales Org) + Canal de distribution + Secteur d'activité (Division SD).",
  },
  {
    id: "exam-36",
    chapter: "Traitement des commandes de vente (O2C)",
    question: "Le Transfert des besoins (Transfer of Requirements) dans SAP SD permet de :",
    options: [
      "Transférer les données de la commande vers la livraison via le Copy Control",
      "Communiquer les besoins d'une commande de vente vers MRP/PP pour approvisionnement ou production",
      "Transférer les enregistrements de conditions vers la procédure tarifaire",
      "Transférer les données clients entre SD et FI",
    ],
    correctIndex: 1,
    explanation: "Le Transfert des besoins (ToR) est le mécanisme par lequel les besoins d'une commande de vente sont communiqués au module MM/PP pour déclencher l'approvisionnement ou la production.",
  },
  {
    id: "exam-37",
    chapter: "Données de base SD",
    question: "Dans quelle vue de la fiche article se trouve l'Account Assignment Group (groupe d'imputation) utilisé pour la détermination de compte de résultat lors de la facturation ?",
    options: [
      "Vue Comptabilité 1",
      "Vue Ventes : Organisation commerciale 1",
      "Vue MRP 1",
      "Vue Achats",
    ],
    correctIndex: 1,
    explanation: "L'Account Assignment Group (groupe d'imputation) qui pilote la détermination du compte de chiffre d'affaires se trouve dans la vue 'Ventes : Organisation commerciale 1' de la fiche article.",
  },
  {
    id: "exam-38",
    chapter: "Livraisons et gestion des expéditions",
    question: "Quel est le rôle du groupe de chargement dans SAP SD ?",
    options: [
      "Il définit la méthode de conditionnement (palette, carton) pour l'emballage",
      "Il est utilisé avec la division MM et les conditions d'expédition pour déterminer automatiquement le point d'expédition",
      "Il définit le groupe de transporteurs autorisés pour la livraison",
      "Il détermine la capacité de chargement du quai d'expédition",
    ],
    correctIndex: 1,
    explanation: "Le groupe de chargement (Loading Group), attribut de la fiche article (vue Ventes Général/Plant), est utilisé conjointement avec la division MM et les conditions d'expédition du client pour la détermination automatique du point d'expédition.",
  },
  {
    id: "exam-39",
    chapter: "Facturation et intégration comptable",
    question: "En SAP S/4HANA, lors de la facturation SD, les données analytiques (centre de profit, segment) sont transmises vers :",
    options: [
      "Un document CO séparé (ordre interne ou centre de coûts)",
      "Le Universal Journal (ACDOCA) en temps réel",
      "Un fichier d'interface batch traité de nuit",
      "Le module CO-PA uniquement (Compte de résultat analytique)",
    ],
    correctIndex: 1,
    explanation: "En S/4HANA, la facturation SD s'intègre directement avec le Universal Journal (ACDOCA). Toutes les données analytiques (centre de profit, segment, division) sont enregistrées dans ACDOCA en temps réel, éliminant les réconciliations périodiques FI-CO.",
  },
  {
    id: "exam-40",
    chapter: "Détermination des prix et technique de conditions",
    question: "Dans la technique de conditions, quel élément définit l'ordre de recherche des enregistrements de prix, du plus spécifique au plus général ?",
    options: [
      "Le type de condition (Condition Type)",
      "La table de conditions (Condition Table)",
      "La séquence d'accès (Access Sequence)",
      "La procédure tarifaire (Pricing Procedure)",
    ],
    correctIndex: 2,
    explanation: "La séquence d'accès définit l'ordre de recherche dans les tables de conditions, du plus spécifique au plus général. SAP applique la première valeur trouvée. Exemple pour PR00 : client+article → liste de prix+article → article seul.",
  },
];
