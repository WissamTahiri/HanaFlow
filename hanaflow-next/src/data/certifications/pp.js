// SAP PP (Production Planning) — C_TS422_2023
// 7 chapitres, contenu pédagogique, 40 questions simulateur

export const ppCertification = {
  id: "pp",
  code: "C_TS422_2023",
  title: "SAP Certified Application Associate – SAP S/4HANA Production Planning and Manufacturing",
  shortName: "SAP PP",
  description:
    "Maîtrisez la planification de production et la fabrication dans SAP S/4HANA : structures organisationnelles, MRP, ordres de fabrication, gestion d'atelier et intégrations.",
  duration: 180,
  questions: 80,
  passingScore: 65,
  color: "from-rose-600 to-rose-800",

  chapters: [
    // ─── Chapitre 1 — Structures organisationnelles PP (gratuit) ───
    {
      id: "ch1",
      title: "Structures organisationnelles PP",
      isPremium: false,
      lessons: [
        {
          id: "ch1-l1",
          title: "Mandant, Société et Site",
          content: `**Vue d'ensemble des structures PP**

La planification de production SAP repose sur une hiérarchie organisationnelle rigoureuse qui conditionne tous les flux de fabrication.

**Mandant (Client)**
Niveau le plus élevé — isole complètement les données entre entités distinctes. Les paramètres PP définis au niveau mandant s'appliquent à toutes les sociétés.

**Société (Company Code)**
Entité juridique et comptable. Chaque fabrication génère des écritures comptables liées à la société.

**Site (Plant)**
Unité centrale en PP. C'est au niveau du site que sont définis :
- Les données MRP des articles
- Les postes de charge et centres de coûts
- Les stocks et mouvements de marchandises
- Les calendriers d'usine

**Magasin (Storage Location)**
Subdivision du site pour la gestion physique des stocks. Un article peut avoir des stocks dans plusieurs magasins d'un même site.

**Zone MRP**
Subdivision du site ou d'un magasin pour affiner la planification des besoins. Permet de planifier indépendamment des parties du site.

**Relations clés**
- Un mandant contient plusieurs sociétés
- Une société peut couvrir plusieurs sites
- Un site appartient à une seule société
- Les ordres de fabrication sont créés au niveau du site`,
        },
        {
          id: "ch1-l2",
          title: "Données de base PP : article, nomenclature, gamme",
          content: `**Les trois piliers des données de base PP**

Toute planification de production repose sur trois types de données de base essentiels.

**Fiche article (Material Master)**
La fiche article PP contient les vues spécifiques à la production :
- **Vue MRP 1** : type MRP, contrôleur MRP, taille de lot
- **Vue MRP 2** : délais, stocks de sécurité, stratégie de planification
- **Vue MRP 3** : disponibilité, ATP
- **Vue Travail en cours** : paramètres de fabrication

Types d'articles PP courants :
| Type | Description | Exemples |
|---|---|---|
| FERT | Produit fini | Produit vendu au client |
| HALB | Semi-fini | Sous-ensemble fabriqué |
| ROH | Matière première | Composant acheté |
| VERP | Emballage | Carton, palette |

**Nomenclature (BOM — Bill of Materials)**
Liste structurée des composants nécessaires à la fabrication :
- **Nomenclature de production** : pour les ordres de fabrication
- **Nomenclature de vente** : pour les kits vendus
- **Nomenclature alternative** : variantes selon lot/site
- Peut être à plusieurs niveaux (assemblage → sous-assemblage → composants)

**Gamme (Routing)**
Séquence d'opérations de fabrication :
- Chaque opération est associée à un **poste de charge**
- Définit les **temps** : préparation, machine, main-d'œuvre
- Peut inclure des **contrôles qualité** (inspection points)
- Le **temps de défilement** (lead time) est calculé à partir de la gamme`,
        },
        {
          id: "ch1-l3",
          title: "Postes de charge et centres de coûts",
          content: `**Postes de charge (Work Centers)**

Un poste de charge représente une ressource de production (machine, ligne, équipe) où s'exécutent les opérations de la gamme.

**Données clés d'un poste de charge**
- **Capacité** : disponibilité en heures (par équipe, par semaine)
- **Formules de calcul** : temps de préparation, temps machine, temps main-d'œuvre
- **Valeurs de référence** : utilisation, rendement
- **Centre de coûts** : lien avec la comptabilité analytique (CO)
- **Activité de coûts** : type d'activité pour le calcul des coûts standards

**Types de postes de charge**
- Machine individuelle
- Ligne de production (capacité collective)
- Ressource humaine (opérateur, équipe)
- Sous-traitant externe

**Lien avec CO-PC (Product Costing)**
Chaque opération de la gamme sur un poste de charge génère :
- Un prélèvement sur le **centre de coûts** associé
- Un coût valorisé via le **type d'activité** (tarif horaire)
- Ces coûts remontent dans le **coût de revient** du produit fini

**Planification des capacités**
Le poste de charge définit sa capacité en heures disponibles. Le MRP et le lancement d'ordres tiennent compte de ces capacités pour éviter la surcharge.`,
        },
      ],
      quiz: [
        {
          question: "Quel est le niveau organisationnel central pour la planification de production SAP ?",
          options: ["Mandant", "Société", "Site", "Magasin"],
          correctIndex: 2,
          explanation: "Le site (Plant) est l'unité centrale en PP — c'est à ce niveau que sont définis les données MRP, les postes de charge, les stocks et les calendriers.",
        },
        {
          question: "Quel type d'article SAP correspond à un produit fini fabriqué et vendu ?",
          options: ["ROH", "HALB", "FERT", "VERP"],
          correctIndex: 2,
          explanation: "FERT (Fertigfabrikat en allemand) désigne un produit fini — fabriqué en interne et vendu aux clients.",
        },
        {
          question: "Quelle vue de la fiche article contient le type MRP et la taille de lot ?",
          options: ["Vue Vente", "Vue MRP 1", "Vue MRP 3", "Vue Travail en cours"],
          correctIndex: 1,
          explanation: "La vue MRP 1 contient les paramètres fondamentaux de planification : type MRP, contrôleur MRP et taille de lot.",
        },
        {
          question: "Qu'est-ce qu'une nomenclature (BOM) dans SAP PP ?",
          options: [
            "La séquence d'opérations de fabrication",
            "La liste des postes de charge d'un site",
            "La liste structurée des composants nécessaires à la fabrication",
            "Le calendrier d'usine du site",
          ],
          correctIndex: 2,
          explanation: "La nomenclature (BOM) liste tous les composants nécessaires pour fabriquer un article, avec leurs quantités et unités.",
        },
      ],
    },

    // ─── Chapitre 2 — Planification des besoins (MRP) ───
    {
      id: "ch2",
      title: "Planification des besoins matières (MRP)",
      isPremium: true,
      lessons: [
        {
          id: "ch2-l1",
          title: "Concepts et types MRP",
          content: `**MRP — Material Requirements Planning**

Le MRP est le moteur central de SAP PP. Il calcule les besoins en composants et propose des ordres d'approvisionnement ou de fabrication.

**Principes du MRP**
1. Analyse des **besoins bruts** (commandes clients, prévisions, besoins indépendants)
2. Soustraction du **stock disponible** et des entrées planifiées
3. Calcul des **besoins nets**
4. Génération de **propositions de planification** (ordres planifiés, demandes d'achat)
5. **Éclatement** de la nomenclature pour les composants

**Types de MRP**
| Type | Code | Description |
|---|---|---|
| MRP classique | MRP | Planification basée sur les besoins |
| CBP (Consommation) | VB | Réapprovisionnement par point de commande |
| Planification prévisionnelle | VV | Basée sur les prévisions de consommation |
| Sans planification | ND | Article non planifié automatiquement |

**Paramètres MRP clés (vue MRP 1)**
- **Type MRP** : méthode de planification
- **Contrôleur MRP** : responsable de la planification
- **Taille de lot** : comment regrouper les besoins (ex, lot fixe, lot pour lot)
- **Délai de réapprovisionnement** : temps nécessaire pour produire ou acheter`,
        },
        {
          id: "ch2-l2",
          title: "Lancement MRP et résultats",
          content: `**Lancement du MRP**

Le MRP peut être lancé de différentes façons selon le périmètre souhaité.

**Modes de lancement**
- **MRP total (MDBT)** : planifie tous les articles de tous les sites
- **MRP par site (MD01)** : planifie un site complet
- **MRP par article (MD02)** : planifie un article spécifique
- **MRP interactif (MD43)** : planification manuelle avec simulation

**Modes de traitement**
| Mode | Description |
|---|---|
| 1 | Régénératif — recalcul complet |
| 2 | Variation nette — traite uniquement les modifications |
| 3 | Variation nette avec horizon de planification |

**Résultats du MRP**
Après le lancement, le MRP génère :
- **Ordres planifiés** (Planned Orders) : propositions de fabrication interne
- **Demandes d'achat** (Purchase Requisitions) : pour les composants achetés
- **Messages d'exception** : alertes sur les retards, excès, etc.

**Liste MRP (MD04)**
La transaction MD04 affiche le tableau de bord MRP d'un article :
- Stocks actuels et futurs
- Besoins (commandes clients, ordres de fabrication)
- Entrées planifiées (ordres planifiés, commandes d'achat)
- Stock disponible simulé ligne par ligne`,
        },
        {
          id: "ch2-l3",
          title: "Stratégies de planification",
          content: `**Stratégies de planification SAP PP**

La stratégie de planification détermine comment les besoins indépendants (prévisions) et les besoins dépendants (commandes clients) interagissent.

**Principales stratégies**

**Stratégie 10 — Fabrication sur stock (MTS — Make-to-Stock)**
- La production est déclenchée par des **prévisions**
- Le stock produit est disponible pour n'importe quelle commande client
- Idéal pour les produits standardisés à forte rotation
- La commande client consomme le stock, pas la prévision

**Stratégie 20 — MTS avec consommation de prévision**
- La commande client **consomme la prévision** (évite les doublons)
- Meilleure gestion des niveaux de stock prévus

**Stratégie 40 — Assemblage à la commande (ATO — Assemble-to-Order)**
- Les composants sont fabriqués sur prévision
- L'assemblage final est déclenché par la commande client
- Bon compromis délai / personnalisation

**Stratégie 50 — Fabrication à la commande (MTO — Make-to-Order)**
- Chaque commande client génère un **ordre de fabrication dédié**
- Pas de stock partagé entre commandes
- Idéal pour produits sur-mesure

**Stratégie 60 — MTO sans assemblage final**
- Variante de la stratégie 50 pour gestion spécifique des coûts`,
        },
      ],
      quiz: [
        {
          question: "Quelle transaction SAP affiche le tableau de bord MRP (besoins/stocks) d'un article ?",
          options: ["MD01", "MD02", "MD04", "MDBT"],
          correctIndex: 2,
          explanation: "MD04 (Liste MRP) affiche la situation détaillée d'un article : stocks, besoins et entrées planifiées ligne par ligne.",
        },
        {
          question: "Quelle stratégie de planification correspond à la fabrication sur stock déclenchée par des prévisions ?",
          options: ["Stratégie 20", "Stratégie 40", "Stratégie 10", "Stratégie 50"],
          correctIndex: 2,
          explanation: "La stratégie 10 (Make-to-Stock) lance la production sur la base de prévisions, indépendamment des commandes clients.",
        },
        {
          question: "Qu'est-ce qu'un ordre planifié dans SAP PP ?",
          options: [
            "Un ordre de fabrication confirmé et lancé en atelier",
            "Une proposition de fabrication générée par le MRP",
            "Une demande d'achat pour un composant externe",
            "Un ordre de transfert entre magasins",
          ],
          correctIndex: 1,
          explanation: "Un ordre planifié est une proposition générée par le MRP — il doit être converti en ordre de fabrication pour être lancé en atelier.",
        },
        {
          question: "Dans quelle stratégie les commandes clients consomment-elles directement les prévisions (évitant les doublons) ?",
          options: ["Stratégie 10", "Stratégie 20", "Stratégie 50", "Stratégie 60"],
          correctIndex: 1,
          explanation: "La stratégie 20 (MTS avec consommation) permet à la commande client de consommer la prévision correspondante, évitant ainsi une double planification.",
        },
      ],
    },

    // ─── Chapitre 3 — Ordres de fabrication ───
    {
      id: "ch3",
      title: "Ordres de fabrication",
      isPremium: true,
      lessons: [
        {
          id: "ch3-l1",
          title: "Cycle de vie d'un ordre de fabrication",
          content: `**Cycle de vie d'un ordre de fabrication (Production Order)**

Un ordre de fabrication (OF) passe par plusieurs statuts depuis sa création jusqu'à sa clôture.

**Statuts système**
| Statut | Code | Description |
|---|---|---|
| Créé | CRTD | OF créé, pas encore libéré |
| Libéré | REL | OF autorisé pour la production |
| Partiellement confirmé | PCNF | Certaines opérations confirmées |
| Confirmé | CNF | Toutes les opérations confirmées |
| Livré partiellement | PDLV | Entrée marchandises partielle |
| Livré | DLV | Entrée marchandises complète |
| Clôturé techniquement | TECO | Clôture technique, solde de l'OF |

**Étapes principales**

**1. Création (CO01)**
- À partir d'un ordre planifié (converti via MD04 ou CO40)
- Directement en CO01
- Nomenclature et gamme sont copiées dans l'OF

**2. Libération (CO02)**
- Rend l'OF disponible pour la production
- Déclenche le **contrôle de disponibilité** des composants
- Génère les **fiches suiveuses** (impressions atelier)

**3. Prélèvement des composants (MB1A / MIGO)**
- Mouvement de marchandises 261 : prélèvement pour OF
- Débite le stock et crédite l'OF

**4. Confirmations (CO11N)**
- Saisie des quantités produites et des temps réels
- Génère des **écarts** vs les données standards

**5. Entrée marchandises (MB31 / MIGO)**
- Mouvement 101 : réception de l'OF en stock
- Valorisation au **coût standard** du produit

**6. Clôture technique et règlement (KO88)**
- Solde les écarts de coûts vers le centre de coûts ou le compte de résultat`,
        },
        {
          id: "ch3-l2",
          title: "Confirmations et gestion de l'atelier",
          content: `**Confirmations d'ordres de fabrication**

La confirmation (CO11N) est l'acte par lequel l'atelier signale l'avancement de la production.

**Types de confirmation**
- **Confirmation partielle** : pour une opération ou une quantité partielle
- **Confirmation finale** : déclare l'opération ou l'OF terminé
- **Confirmation automatique** : paramétrée dans la gamme pour certaines opérations simples

**Données saisies lors de la confirmation**
- Quantité produite (conforme / rebutstandardreject)
- Temps réels (préparation, machine, main-d'œuvre)
- Dates de début et fin réelles
- Cause de rebut (si applicable)

**Gestion des rebuts**
Le rebut (scrap) peut être saisi à la confirmation :
- **Rebut composant** : quantité de matière consommée en plus
- **Rebut opération** : quantité produite déclarée comme rebutée
- Impact sur les coûts et les besoins MRP suivants

**Gestion d'atelier — PP-SFC (Shop Floor Control)**
SAP PP-SFC permet de piloter finement l'atelier :
- **Fiches suiveuses** (shop papers) : documents physiques pour l'atelier
- **Tableau de charge** (CM01) : visualisation capacités vs charge
- **Ordres prévisionnels** : planification capacitaire avant conversion

**Intégration QM**
Des **points d'inspection** peuvent être définis dans la gamme pour déclencher des contrôles qualité à des étapes clés de la fabrication.`,
        },
        {
          id: "ch3-l3",
          title: "Coûts des ordres de fabrication",
          content: `**Valorisation et coûts des ordres de fabrication**

Chaque ordre de fabrication accumule des coûts réels qui sont comparés aux coûts standards.

**Coûts standards vs coûts réels**

**Coût standard** (calculé à l'avance via CK11N/CK40N) :
- Coût des composants (selon prix standard des matières)
- Coût des opérations (temps gamme × tarif horaire du poste de charge)
- Frais généraux (overhead)

**Coûts réels** (accumulés pendant la fabrication) :
- Prélèvements composants réels (quantités × prix)
- Confirmations d'activités (temps réels × tarif)
- Écarts dus aux variations de prix ou de quantité

**Types d'écarts**
| Type | Cause |
|---|---|
| Écart de prix | Prix réel ≠ prix standard |
| Écart de quantité | Consommation réelle ≠ quantité standard |
| Écart d'activité | Temps réel ≠ temps standard gamme |
| Écart de lot | Coûts fixes sur petits lots |

**Règlement (Settlement — KO88)**
En fin de période, les écarts de l'OF sont réglés (soldés) vers :
- Un **centre de coûts** (pour les écarts structurels)
- Le **compte de résultat** (PA — Profitability Analysis)
- Un **ordre CO interne**

**Rapport d'analyse des coûts (KKBC_ORD)**
Permet de comparer coûts planifiés, coûts cibles et coûts réels de l'OF.`,
        },
      ],
      quiz: [
        {
          question: "Quel mouvement de marchandises MIGO correspond au prélèvement de composants pour un ordre de fabrication ?",
          options: ["Mouvement 101", "Mouvement 201", "Mouvement 261", "Mouvement 311"],
          correctIndex: 2,
          explanation: "Le mouvement 261 (Goods Issue for Production Order) débite le stock de composants et crédite l'ordre de fabrication.",
        },
        {
          question: "Quelle transaction SAP permet de saisir les confirmations d'opérations d'un ordre de fabrication ?",
          options: ["CO01", "CO11N", "CO40", "MD04"],
          correctIndex: 1,
          explanation: "CO11N est la transaction standard pour saisir les confirmations d'opérations (quantités produites, temps réels) sur un ordre de fabrication.",
        },
        {
          question: "Que se passe-t-il lors de la libération d'un ordre de fabrication ?",
          options: [
            "L'OF est clôturé techniquement",
            "Les composants sont automatiquement prélevés",
            "Le contrôle de disponibilité des composants est déclenché",
            "L'OF est réglé vers le centre de coûts",
          ],
          correctIndex: 2,
          explanation: "La libération (REL) déclenche le contrôle de disponibilité des composants et rend l'OF disponible pour la production en atelier.",
        },
        {
          question: "Vers quoi les écarts de coûts d'un ordre de fabrication sont-ils réglés en fin de période ?",
          options: [
            "Vers le stock du produit fini uniquement",
            "Vers le compte bancaire de la société",
            "Vers un centre de coûts, le compte de résultat (PA) ou un ordre CO",
            "Vers la nomenclature de l'article",
          ],
          correctIndex: 2,
          explanation: "Le règlement (KO88) solde les écarts de l'OF vers un centre de coûts, le compte de résultat (PA) ou un ordre CO interne selon le paramétrage.",
        },
      ],
    },

    // ─── Chapitre 4 — Planification capacitaire ───
    {
      id: "ch4",
      title: "Planification capacitaire",
      isPremium: true,
      lessons: [
        {
          id: "ch4-l1",
          title: "Concepts de capacité et types",
          content: `**Planification capacitaire dans SAP PP**

La planification capacitaire permet de vérifier que les ressources de production peuvent absorber la charge prévue.

**Types de capacité**
- **Capacité machine** : disponibilité horaire d'une machine
- **Capacité main-d'œuvre** : disponibilité des opérateurs
- **Capacité de stockage** : espace disponible dans une zone
- **Capacité collective** : regroupement de machines similaires

**Données de capacité d'un poste de charge**
- **Durée de travail** : heures par équipe
- **Nombre d'équipes** : 1×8h, 2×8h, 3×8h (cycle 24h)
- **Taux d'utilisation** : pourcentage de disponibilité effective (ex. 80%)
- **Rendement** : efficacité productive (ex. 90%)
- **Calendrier usine** : jours ouvrés, jours fériés

**Capacité disponible**
= Durée de travail × Nombre de shifts × Taux d'utilisation × Rendement

**Charge (Load)**
Chaque opération d'un ordre planifié ou de fabrication génère une charge sur le poste de charge selon les temps définis dans la gamme.

**Taux de charge**
= Charge / Capacité disponible × 100%
Un taux > 100% indique une surcharge (bottleneck).`,
        },
        {
          id: "ch4-l2",
          title: "Leveling et optimisation capacitaire",
          content: `**Évaluation et lissage de charge**

**Transactions de planification capacitaire**
| Transaction | Description |
|---|---|
| CM01 | Vue centre de travail — charge vs capacité |
| CM04 | Liste des surcharges par poste |
| CM05 | Évaluation capacitaire détaillée |
| CM21 | Table de planification capacitaire |

**Vues d'analyse**
- **Vue graphique** : histogramme charge/capacité par période
- **Vue tabulaire** : chiffres détaillés par ordre et opération
- **Vue de répartition** : décomposition par ordre de fabrication

**Lissage (Capacity Leveling)**
Lorsqu'un poste est en surcharge, plusieurs actions sont possibles :
- **Décaler** les ordres dans le temps (avancer ou reculer)
- **Scinder** un ordre en plusieurs lots plus petits
- **Réaffecter** à un poste de charge alternatif
- **Heures supplémentaires** : augmenter la capacité disponible temporairement
- **Sous-traitance** : externaliser une partie de la charge

**Planification capacitaire à terme infini vs fini**
- **Terme infini** (MRP standard) : ignore les contraintes de capacité
- **Terme fini** (PP-CRP) : planifie en tenant compte des capacités disponibles
- Le **séquençage** (PP-SFC) optimise l'ordre de passage des OF`,
        },
        {
          id: "ch4-l3",
          title: "Intégration PP-CO pour les coûts de capacité",
          content: `**Lien entre capacité PP et coûts CO**

La planification capacitaire n'est pas seulement opérationnelle — elle a des implications directes sur la comptabilité analytique.

**Tarifs d'activité (Activity Rates)**
Chaque poste de charge est associé à un **centre de coûts** et un **type d'activité** (ex. "Heures machine", "Heures main-d'œuvre").

Le tarif d'activité est calculé :
= Coûts planifiés du centre de coûts / Activité planifiée

**Impact sur les coûts produits**
- Les temps gamme × tarifs d'activité constituent les **coûts de conversion** du produit
- Une mauvaise planification capacitaire (surcharge chronique) entraîne :
  - Des heures supplémentaires non planifiées (coûts supplémentaires)
  - Des écarts d'activité en fin de période

**Calcul de coût de revient standard (CK11N)**
Lors du calcul du coût standard, SAP utilise :
- Les quantités de la **nomenclature** × prix standards des composants
- Les temps de la **gamme** × tarifs des postes de charge

**Analyse des écarts capacitaires**
En fin de période, CO analyse :
- **Écart de volume** : capacité non utilisée (sous-absorption)
- **Écart d'efficacité** : temps réels vs temps standards
- Ces écarts sont visibles dans les rapports CO (KSB1, KKBC_ORD)`,
        },
      ],
      quiz: [
        {
          question: "Quelle transaction SAP affiche la charge vs la capacité disponible d'un poste de charge ?",
          options: ["MD04", "CO11N", "CM01", "CK11N"],
          correctIndex: 2,
          explanation: "CM01 (Centre de travail — Charge) affiche un histogramme comparant la charge planifiée à la capacité disponible du poste de charge.",
        },
        {
          question: "Comment est calculée la capacité disponible d'un poste de charge ?",
          options: [
            "Nombre d'équipes uniquement",
            "Durée de travail × Shifts × Taux d'utilisation × Rendement",
            "Coûts planifiés / Tarif horaire",
            "Nombre d'ordres planifiés × Temps moyen",
          ],
          correctIndex: 1,
          explanation: "La capacité disponible combine la durée de travail, le nombre d'équipes, le taux d'utilisation et le rendement du poste.",
        },
        {
          question: "Quelle approche de planification tient compte des contraintes de capacité disponible ?",
          options: [
            "MRP à terme infini",
            "MRP régénératif",
            "Planification à terme fini (PP-CRP)",
            "Stratégie 10",
          ],
          correctIndex: 2,
          explanation: "La planification à terme fini (PP-CRP — Capacity Requirements Planning) planifie en respectant les capacités disponibles, contrairement au MRP standard (terme infini).",
        },
        {
          question: "Quel écart CO résulte d'une sous-utilisation chronique de la capacité d'un centre de coûts ?",
          options: ["Écart de prix", "Écart de quantité", "Écart de volume (sous-absorption)", "Écart de lotissement"],
          correctIndex: 2,
          explanation: "L'écart de volume (sous-absorption) survient quand l'activité réelle est inférieure à l'activité planifiée, laissant des coûts fixes non absorbés.",
        },
      ],
    },

    // ─── Chapitre 5 — Kanban et fabrication répétitive ───
    {
      id: "ch5",
      title: "Kanban et fabrication répétitive",
      isPremium: true,
      lessons: [
        {
          id: "ch5-l1",
          title: "Kanban SAP PP",
          content: `**Kanban dans SAP PP**

Le Kanban est un système de réapprovisionnement à la demande (pull system) qui évite la surproduction.

**Principe du Kanban**
- Les conteneurs (kanbans) circulent entre un **point d'approvisionnement** (source) et un **point de consommation** (sink)
- Quand un conteneur est vide, un signal est envoyé pour le remplir
- Pas de planification centralisée — le flux est tiré par la consommation réelle

**Types de Kanban SAP**
| Type | Description |
|---|---|
| Kanban classique | Réapprovisionnement d'un magasin depuis un autre |
| Kanban de production | Déclenche un ordre de fabrication interne |
| Kanban fournisseur | Déclenche une commande d'achat |
| Kanban one-card | Un seul signal pour les flux très réguliers |

**Données de base Kanban**
- **Boucle Kanban** : lien entre point d'approvisionnement et point de consommation
- **Nombre de conteneurs** : calculé selon le temps de cycle et la consommation
- **Quantité par conteneur** : taille du lot Kanban
- **Tableau Kanban (PKBC)** : vue graphique des statuts (VIDE / EN COURS / PLEIN)

**Avantages**
- Réduction du stock en cours (WIP)
- Simplicité opérationnelle — pas d'ordres de fabrication complexes
- Réactivité immédiate aux variations de demande`,
        },
        {
          id: "ch5-l2",
          title: "Fabrication répétitive (REM)",
          content: `**Fabrication répétitive — Repetitive Manufacturing (REM)**

La fabrication répétitive est adaptée à la production en série de produits standardisés sur des lignes dédiées.

**Caractéristiques REM**
- Pas d'ordres de fabrication individuels — utilise des **ordres prévisionnels** (run schedule quantities)
- Production en **flux continu** sur une ligne de fabrication
- Confirmation simplifiée par **backflush** (prélèvement automatique des composants)
- Idéal pour : automobiles, électronique grand public, emballages

**Données de base spécifiques REM**
- **Profil REM** : paramètre le comportement de la fabrication répétitive
- **Ligne de production** : ressource principale (poste de charge de type "ligne")
- **Version de fabrication** : combinaison nomenclature + gamme valide pour un produit/ligne

**Backflush**
Le backflush automatise les prélèvements composants lors de la confirmation :
- À la déclaration de fin d'opération, les composants sont automatiquement prélevés
- Réduit la saisie manuelle en atelier
- Paramétrable par composant dans la nomenclature (indicateur de backflush)

**Transactions REM**
| Transaction | Description |
|---|---|
| MF50 | Tableau de planification REM |
| MFBF | Confirmation REM (backflush) |
| MF60 | Actualisation REM |`,
        },
      ],
      quiz: [
        {
          question: "Quel est le principe fondamental du système Kanban ?",
          options: [
            "Pousser la production selon le MRP",
            "Tirer la production à partir de la consommation réelle (pull system)",
            "Planifier en fonction des prévisions à 12 mois",
            "Lancer des ordres de fabrication hebdomadaires",
          ],
          correctIndex: 1,
          explanation: "Le Kanban est un système pull — c'est la consommation réelle qui déclenche le réapprovisionnement, évitant la surproduction.",
        },
        {
          question: "Quelle transaction SAP affiche le tableau Kanban avec les statuts des conteneurs ?",
          options: ["MD04", "CM01", "PKBC", "MFBF"],
          correctIndex: 2,
          explanation: "PKBC (Tableau de bord Kanban) affiche graphiquement tous les conteneurs d'une boucle avec leurs statuts (VIDE, EN COURS, PLEIN).",
        },
        {
          question: "Qu'est-ce que le backflush dans la fabrication répétitive SAP ?",
          options: [
            "Un type d'écart de coûts",
            "Le prélèvement automatique des composants lors de la confirmation de fabrication",
            "Un mouvement de retour de marchandises vers le fournisseur",
            "La clôture technique d'un ordre de fabrication",
          ],
          correctIndex: 1,
          explanation: "Le backflush prélève automatiquement les composants lors de la déclaration de production, évitant la saisie manuelle des prélèvements.",
        },
        {
          question: "Pour quel type de production la fabrication répétitive (REM) est-elle le plus adaptée ?",
          options: [
            "Production sur commande unitaire (ingénierie à la commande)",
            "Projets de construction longue durée",
            "Production en série de produits standardisés sur lignes dédiées",
            "Gestion des articles de négoce sans fabrication",
          ],
          correctIndex: 2,
          explanation: "La fabrication répétitive convient à la production en série continue sur lignes dédiées (automobiles, électronique), où les ordres individuels seraient trop lourds.",
        },
      ],
    },

    // ─── Chapitre 6 — Sous-traitance et gestion des versions ───
    {
      id: "ch6",
      title: "Sous-traitance et versions de fabrication",
      isPremium: true,
      lessons: [
        {
          id: "ch6-l1",
          title: "Sous-traitance dans SAP PP",
          content: `**Sous-traitance PP/MM**

La sous-traitance (subcontracting) permet de confier une opération ou la totalité d'un ordre de fabrication à un prestataire externe.

**Types de sous-traitance**
- **Sous-traitance totale** : tout le produit est fabriqué par le sous-traitant
- **Sous-traitance partielle** : une ou plusieurs opérations de la gamme sont externalisées
- **Prêt de composants** : les composants sont envoyés au sous-traitant (stock en dépôt)

**Processus de sous-traitance (MM-SUS)**
1. **Commande d'achat** de type "sous-traitance" (ME21N)
2. Les **composants** à fournir sont listés dans la commande
3. **Envoi des composants** au sous-traitant (mouvement 541 — stock en dépôt)
4. **Réception** du produit transformé (mouvement 101 + 543 — prélèvement automatique)
5. **Facturation** du prestataire (MIRO)

**Opération externe dans la gamme**
Pour la sous-traitance d'une opération spécifique :
- La gamme contient une **opération de type externe**
- Associée à un **centre de coûts externe** ou à un fournisseur
- Génère automatiquement une demande d'achat lors de la libération de l'OF

**Stock en dépôt fournisseur**
Les composants envoyés restent dans le **stock SAP** jusqu'à la réception du produit transformé. Cela permet le suivi et la valorisation comptable.`,
        },
        {
          id: "ch6-l2",
          title: "Versions de fabrication",
          content: `**Versions de fabrication (Production Versions)**

Une version de fabrication définit la combinaison valide d'une nomenclature et d'une gamme pour fabriquer un article donné.

**Utilité des versions de fabrication**
- Un article peut avoir **plusieurs versions** (lignes de production différentes, procédés alternatifs)
- Chaque version est valable sur une **plage de validité** (dates de/à)
- Le MRP ou le planificateur choisit la version à utiliser

**Données d'une version de fabrication**
| Champ | Description |
|---|---|
| Numéro de version | Identifiant (ex. 0001, 0002) |
| Description | Ex. "Ligne A — process standard" |
| Nomenclature alternative | Numéro de la BOM à utiliser |
| Gamme alternative | Numéro du groupe/contre-référence gamme |
| Taille de lot min/max | Plage de quantités valide pour cette version |
| Dates de validité | Période d'application |

**Version et fabrication répétitive**
Dans la fabrication répétitive (REM), la version de fabrication est **obligatoire** — elle associe l'article à sa ligne de production et ses données de base.

**Sélection automatique de la version**
Le MRP peut sélectionner automatiquement la version en fonction :
- De la quantité à produire (min/max lot)
- Des dates de validité
- Du taux de charge des lignes`,
        },
      ],
      quiz: [
        {
          question: "Quel mouvement SAP transfère des composants vers le stock en dépôt fournisseur lors de la sous-traitance ?",
          options: ["Mouvement 101", "Mouvement 261", "Mouvement 541", "Mouvement 311"],
          correctIndex: 2,
          explanation: "Le mouvement 541 transfère les composants du stock propre vers le stock en dépôt du sous-traitant, sans sortie comptable définitive.",
        },
        {
          question: "À quoi sert une version de fabrication dans SAP PP ?",
          options: [
            "Définir les prix standards des articles",
            "Associer une nomenclature et une gamme spécifiques pour la fabrication d'un article",
            "Créer des ordres de fabrication en lot",
            "Contrôler la disponibilité des composants",
          ],
          correctIndex: 1,
          explanation: "Une version de fabrication lie une nomenclature alternative et une gamme alternative pour définir un procédé de fabrication spécifique (ligne, process).",
        },
        {
          question: "Dans quel cas la version de fabrication est-elle obligatoire dans SAP PP ?",
          options: [
            "Pour tous les ordres de fabrication sans exception",
            "Uniquement pour les produits de type HALB",
            "Dans la fabrication répétitive (REM)",
            "Pour la sous-traitance totale uniquement",
          ],
          correctIndex: 2,
          explanation: "La version de fabrication est obligatoire dans la fabrication répétitive (REM) car elle associe l'article à sa ligne de production dédiée.",
        },
        {
          question: "Comment une opération externe dans une gamme déclenche-t-elle l'approvisionnement sous-traitance ?",
          options: [
            "Elle génère automatiquement une demande d'achat lors de la libération de l'OF",
            "Elle crée un transfert de stock automatique",
            "Elle envoie un email au fournisseur",
            "Elle clôture automatiquement l'ordre de fabrication",
          ],
          correctIndex: 0,
          explanation: "Lors de la libération d'un OF, une opération de type externe génère automatiquement une demande d'achat pour déclencher la sous-traitance.",
        },
      ],
    },

    // ─── Chapitre 7 — Intégrations et clôture de période ───
    {
      id: "ch7",
      title: "Intégrations PP et clôture de période",
      isPremium: true,
      lessons: [
        {
          id: "ch7-l1",
          title: "Intégrations PP-MM, PP-SD, PP-CO",
          content: `**Intégrations de SAP PP avec les autres modules**

SAP PP est étroitement intégré avec MM, SD et CO pour assurer la cohérence des flux.

**PP ↔ MM (Materials Management)**
- Le MRP génère des **demandes d'achat** pour les composants achetés (traitement par MM)
- Les **prélèvements de composants** (mouvement 261) débitent les stocks MM
- Les **réceptions de sous-traitance** (mouvement 101) alimentent les stocks MM
- Les **prix standards** des matières premières (MM) impactent les coûts des OF (PP)

**PP ↔ SD (Sales & Distribution)**
- Les **commandes clients** (SD) génèrent des besoins indépendants qui alimentent le MRP (PP)
- Les stratégies MTO (make-to-order) créent des OF liés à des commandes clients spécifiques
- La **vérification de disponibilité (ATP)** en SD consulte les stocks et les OF planifiés en PP
- Les **livraisons** (SD) puisent dans le stock de produits finis produit par PP

**PP ↔ CO (Controlling)**
- Les OF accumulent des **coûts réels** (composants + activités poste de charge)
- Ces coûts sont comparés aux **coûts standards** calculés en CO-PC
- Les **écarts** sont réglés vers CO en fin de période (KO88)
- La **sous-absorption capacitaire** apparaît dans les rapports CO (KKBC_ORD)

**PP ↔ PM (Plant Maintenance)**
- Les **pannes machines** (PM) peuvent affecter la disponibilité des postes de charge (PP)
- Les ordres de maintenance génèrent des **besoins pièces détachées** (MM)`,
        },
        {
          id: "ch7-l2",
          title: "Clôture de période PP",
          content: `**Activités de clôture de période en PP**

La clôture de période PP implique plusieurs étapes pour solder les ordres et calculer les écarts.

**Séquence de clôture**

**1. Confirmer et livrer tous les ordres (avant clôture)**
- S'assurer que toutes les confirmations sont saisies (CO11N)
- Vérifier que toutes les entrées marchandises sont enregistrées (MB31)

**2. Clôture technique des OF terminés (CO02 / COHVPI)**
- Statut TECO : empêche toute nouvelle saisie sur l'OF
- Les écarts sont "gelés" à leur valeur finale

**3. Calcul des écarts (KKS2 / KKAO)**
- SAP calcule les écarts entre coûts cibles et coûts réels
- Types : prix, quantité, lot, activité, structure

**4. Règlement des ordres (KO88 / CO88)**
- Les écarts sont réglés vers leur destinataire (centre de coûts, PA)
- Les comptes en-cours (WIP) sont soldés

**5. Clôture comptable de la période (MM — MMPV)**
- Fermeture de la période MM pour empêcher les mouvements antidatés
- Ouverture de la période suivante

**Rapports de clôture utiles**
| Transaction | Description |
|---|---|
| KKBC_ORD | Analyse coûts OF (plan/réel/écart) |
| COOIS | Vue d'ensemble des ordres de fabrication |
| MB52 | Stock par magasin/article |
| KSB1 | Pièces justificatives CO par centre de coûts |`,
        },
        {
          id: "ch7-l3",
          title: "PP dans S/4HANA : nouveautés",
          content: `**SAP PP dans S/4HANA — Évolutions clés**

S/4HANA apporte des changements significatifs à la planification de production.

**MRP Live (S/4HANA)**
- Remplacement du MRP classique par **pMRP (Production Planning run)**
- Tourne **in-memory** sur la base de données HANA → performances drastiquement améliorées
- Planification quasi temps-réel possible
- Transaction : **/SAPAPO/MRP_MONI** ou via le Fiori Launchpad

**Embedded PP/DS (Advanced Planning)**
S/4HANA embarque nativement PP/DS (anciennement APO-PP/DS) :
- Planification à terme fini intégrée dans S/4HANA
- Séquençage optimisé des ordres sur les postes de charge
- Gestion des contraintes capacitaires en temps réel

**Simplifications S/4HANA PP**
- **Suppression des tables MRP redondantes** — données unifiées dans MARC/MDKP
- **Fiche article simplifiée** — certaines vues MRP consolidées
- **Intégration Fiori** — applications tactiles pour l'atelier :
  - "Manage Production Orders"
  - "Confirm Production Operations"
  - "Monitor Production Orders"

**Digital Manufacturing (SAP DM)**
Extension cloud pour la gestion fine de l'atelier :
- Instructions de travail digitales
- Traçabilité en temps réel
- Intégration IoT (capteurs machine)
- Connexion avec SAP S/4HANA PP via APIs`,
        },
      ],
      quiz: [
        {
          question: "Comment les commandes clients SD alimentent-elles la planification PP ?",
          options: [
            "En créant directement des ordres de fabrication",
            "En générant des besoins indépendants qui alimentent le MRP",
            "En déclenchant automatiquement des prélèvements de composants",
            "En clôturant les ordres de fabrication terminés",
          ],
          correctIndex: 1,
          explanation: "Les commandes clients SD créent des besoins indépendants qui sont pris en compte par le MRP pour planifier la production (surtout en stratégie MTO).",
        },
        {
          question: "Quelle est la nouveauté majeure du MRP dans SAP S/4HANA ?",
          options: [
            "Le MRP est supprimé et remplacé par le Kanban uniquement",
            "Le MRP Live tourne in-memory sur HANA pour une planification quasi temps-réel",
            "Le MRP fonctionne uniquement en mode variation nette",
            "Les ordres planifiés sont remplacés par des demandes d'achat automatiques",
          ],
          correctIndex: 1,
          explanation: "MRP Live dans S/4HANA exploite la base de données HANA in-memory pour planifier en quasi temps réel, avec des performances nettement supérieures au MRP classique.",
        },
        {
          question: "Quelle transaction effectue le règlement des écarts d'un ordre de fabrication en fin de période ?",
          options: ["CO11N", "MD04", "CO88 / KO88", "CK11N"],
          correctIndex: 2,
          explanation: "CO88 (ou KO88 pour les ordres individuels) règle les écarts accumulés sur l'OF vers leur destinataire CO (centre de coûts, PA, ordre CO).",
        },
        {
          question: "Qu'est-ce que PP/DS Embedded dans SAP S/4HANA ?",
          options: [
            "Un module de gestion des fournisseurs sous-traitants",
            "La planification à terme fini intégrée nativement dans S/4HANA (ex APO-PP/DS)",
            "Un tableau de bord Kanban pour l'atelier",
            "Un outil de calcul de coût standard",
          ],
          correctIndex: 1,
          explanation: "PP/DS Embedded intègre nativement dans S/4HANA la planification à terme fini avec séquençage optimisé, anciennement disponible uniquement via APO.",
        },
        {
          question: "Quel mouvement de marchandises enregistre la réception en stock d'un produit fini fabriqué ?",
          options: ["Mouvement 261", "Mouvement 541", "Mouvement 101", "Mouvement 311"],
          correctIndex: 2,
          explanation: "Le mouvement 101 (Goods Receipt for Production Order — MB31) enregistre l'entrée du produit fini en stock, valorisé au coût standard.",
        },
        {
          question: "Quelle transaction affiche une vue d'ensemble de tous les ordres de fabrication et leur statut ?",
          options: ["MD04", "COOIS", "CM01", "KKBC_ORD"],
          correctIndex: 1,
          explanation: "COOIS (Production Order Information System) fournit une liste complète des ordres de fabrication avec tous leurs statuts, dates et données.",
        },
      ],
    },
  ],
};

// ─── Questions simulateur d'examen PP (40 questions) ───
export const ppMockExamQuestions = [
  // Ch1 — Structures organisationnelles (6 questions)
  {
    id: "pp-e1",
    chapter: "ch1",
    question: "Quel est le niveau organisationnel central pour la planification de production dans SAP ?",
    options: ["Mandant", "Société", "Site (Plant)", "Zone MRP"],
    correctIndex: 2,
    explanation: "Le site est l'unité centrale PP — toutes les données MRP, postes de charge et stocks sont définis à ce niveau.",
  },
  {
    id: "pp-e2",
    chapter: "ch1",
    question: "Quel type d'article SAP représente un semi-fini fabriqué en interne et utilisé comme composant ?",
    options: ["FERT", "ROH", "HALB", "VERP"],
    correctIndex: 2,
    explanation: "HALB (Halbfabrikat) désigne un semi-fini — fabriqué en interne et utilisé comme composant dans un produit de niveau supérieur.",
  },
  {
    id: "pp-e3",
    chapter: "ch1",
    question: "Qu'est-ce qu'une gamme (Routing) dans SAP PP ?",
    options: [
      "La liste des composants d'un produit fini",
      "La séquence d'opérations de fabrication avec temps et postes de charge",
      "Le plan d'approvisionnement annuel",
      "La liste des fournisseurs homologués",
    ],
    correctIndex: 1,
    explanation: "La gamme définit les étapes de fabrication : séquence d'opérations, postes de charge associés et temps (préparation, machine, main-d'œuvre).",
  },
  {
    id: "pp-e4",
    chapter: "ch1",
    question: "Quelle vue de la fiche article contient les paramètres de délai de réapprovisionnement et de stock de sécurité ?",
    options: ["Vue MRP 1", "Vue MRP 2", "Vue MRP 3", "Vue Travail en cours"],
    correctIndex: 1,
    explanation: "La vue MRP 2 contient les paramètres de délais (planned delivery time, GR processing time) et les stocks de sécurité.",
  },
  {
    id: "pp-e5",
    chapter: "ch1",
    question: "À quoi sert un poste de charge (Work Center) dans SAP PP ?",
    options: [
      "Définir les prix d'achat des composants",
      "Regrouper les commandes clients par région",
      "Représenter une ressource de production où s'exécutent les opérations de gamme",
      "Gérer les congés des employés",
    ],
    correctIndex: 2,
    explanation: "Un poste de charge représente une ressource (machine, ligne, équipe) avec sa capacité disponible, ses formules de temps et son lien avec CO.",
  },
  {
    id: "pp-e6",
    chapter: "ch1",
    question: "Quel est l'impact d'une nomenclature à plusieurs niveaux dans le MRP ?",
    options: [
      "Seul le niveau 0 (produit fini) est planifié",
      "Le MRP éclate les besoins niveau par niveau jusqu'aux composants de base",
      "Les sous-assemblages ne sont jamais planifiés automatiquement",
      "Cela désactive la stratégie de planification",
    ],
    correctIndex: 1,
    explanation: "Le MRP éclate la nomenclature niveau par niveau — les besoins en produit fini génèrent des besoins en sous-assemblages, puis en composants.",
  },

  // Ch2 — MRP (6 questions)
  {
    id: "pp-e7",
    chapter: "ch2",
    question: "Quelle transaction SAP lance le MRP pour un site entier ?",
    options: ["MD02", "MD01", "MDBT", "MD04"],
    correctIndex: 1,
    explanation: "MD01 lance le MRP pour un site complet. MDBT le fait en traitement de fond pour tous les sites. MD02 est pour un article spécifique.",
  },
  {
    id: "pp-e8",
    chapter: "ch2",
    question: "Quelle est la différence entre le mode MRP 'régénératif' et le mode 'variation nette' ?",
    options: [
      "Le mode régénératif est plus rapide que la variation nette",
      "Le mode régénératif recalcule tout, la variation nette traite uniquement les modifications depuis le dernier MRP",
      "La variation nette recalcule toujours toutes les données",
      "Les deux modes produisent exactement les mêmes résultats",
    ],
    correctIndex: 1,
    explanation: "Le mode régénératif (mode 1) recalcule tous les articles. La variation nette (mode 2) ne traite que les articles ayant eu des modifications, ce qui est plus rapide.",
  },
  {
    id: "pp-e9",
    chapter: "ch2",
    question: "Dans la stratégie 40 (Assemble-to-Order), que se passe-t-il à la réception d'une commande client ?",
    options: [
      "Tous les composants sont achetés à la commande",
      "Les composants sont fabriqués sur prévision, l'assemblage final est déclenché par la commande",
      "L'OF est créé sans aucune prévision préalable",
      "Le stock de produit fini existant est systématiquement utilisé",
    ],
    correctIndex: 1,
    explanation: "En stratégie 40 (ATO), les composants sont préparés sur prévision, mais l'assemblage final est déclenché par la commande client, réduisant le délai tout en personnalisant.",
  },
  {
    id: "pp-e10",
    chapter: "ch2",
    question: "Qu'est-ce que la taille de lot 'EX' (lot pour lot) dans les paramètres MRP ?",
    options: [
      "Une taille de lot fixe de 100 unités",
      "La planification produit exactement la quantité du besoin net, sans arrondi",
      "Un lot regroupant tous les besoins de la semaine",
      "Un lot calculé selon le coût économique (Wilson)",
    ],
    correctIndex: 1,
    explanation: "EX (Exact lot) — le MRP produit exactement la quantité du besoin net. Pas de stock résiduel mais pas d'économie d'échelle non plus.",
  },
  {
    id: "pp-e11",
    chapter: "ch2",
    question: "Quels éléments génèrent des besoins bruts dans le MRP ?",
    options: [
      "Uniquement les commandes clients confirmées",
      "Commandes clients, prévisions, besoins de projets et ordres de fabrication de niveau supérieur",
      "Uniquement les prévisions de vente",
      "Uniquement les stocks de sécurité",
    ],
    correctIndex: 1,
    explanation: "Les besoins bruts proviennent de toutes les sources : commandes clients, prévisions, besoins de projets (PS) et besoins dépendants des OF de niveau supérieur.",
  },
  {
    id: "pp-e12",
    chapter: "ch2",
    question: "Que représente le 'délai de défilement' (lead time) dans la planification MRP ?",
    options: [
      "La durée de transport entre le fournisseur et le site",
      "Le temps total de fabrication d'un produit de la première à la dernière opération",
      "La durée de traitement d'une demande d'achat",
      "Le délai de paiement fournisseur",
    ],
    correctIndex: 1,
    explanation: "Le délai de défilement est le temps total pour fabriquer un produit — calculé à partir des temps de la gamme et des délais de composants.",
  },

  // Ch3 — Ordres de fabrication (6 questions)
  {
    id: "pp-e13",
    chapter: "ch3",
    question: "Dans quel ordre se déroulent les étapes principales d'un ordre de fabrication ?",
    options: [
      "Libération → Création → Prélèvement → Confirmation → Entrée marchandises",
      "Création → Libération → Prélèvement → Confirmation → Entrée marchandises",
      "Création → Prélèvement → Libération → Entrée marchandises → Confirmation",
      "Confirmation → Création → Libération → Prélèvement",
    ],
    correctIndex: 1,
    explanation: "L'ordre correct est : Création (CO01) → Libération (REL) → Prélèvement composants (mv. 261) → Confirmations (CO11N) → Entrée marchandises (mv. 101).",
  },
  {
    id: "pp-e14",
    chapter: "ch3",
    question: "Quel mouvement de marchandises MIGO enregistre la réception du produit fini fabriqué en stock ?",
    options: ["Mouvement 261", "Mouvement 101", "Mouvement 201", "Mouvement 541"],
    correctIndex: 1,
    explanation: "Le mouvement 101 (MB31) enregistre l'entrée du produit fini en stock depuis l'ordre de fabrication, valorisé au coût standard.",
  },
  {
    id: "pp-e15",
    chapter: "ch3",
    question: "Quel est le statut système d'un OF libéré pour la production ?",
    options: ["CRTD", "REL", "CNF", "TECO"],
    correctIndex: 1,
    explanation: "REL (Released) indique que l'OF a été libéré — il est disponible pour la production et les prélèvements sont autorisés.",
  },
  {
    id: "pp-e16",
    chapter: "ch3",
    question: "Comment SAP valorise-t-il les coûts standards d'un ordre de fabrication ?",
    options: [
      "Au coût réel des composants au moment de la création",
      "Selon les quantités BOM × prix standards + temps gamme × tarifs activité",
      "Au prix moyen mobile des 12 derniers mois",
      "Selon le prix de vente du produit fini",
    ],
    correctIndex: 1,
    explanation: "Le coût standard est calculé via CK11N : quantités BOM × prix standards des matières + temps gamme × tarifs horaires des postes de charge (via CO).",
  },
  {
    id: "pp-e17",
    chapter: "ch3",
    question: "Que génère la transaction CO11N dans SAP PP ?",
    options: [
      "La création d'un ordre de fabrication",
      "La confirmation des opérations (quantités produites, temps réels)",
      "Le règlement des écarts de coûts",
      "Le contrôle de disponibilité des composants",
    ],
    correctIndex: 1,
    explanation: "CO11N permet de saisir les confirmations d'opérations : quantités produites, rebuts éventuels et temps réels (préparation, machine, main-d'œuvre).",
  },
  {
    id: "pp-e18",
    chapter: "ch3",
    question: "Qu'est-ce que la clôture technique (TECO) d'un ordre de fabrication ?",
    options: [
      "La suppression définitive de l'OF de la base de données",
      "Le gel de l'OF pour empêcher de nouvelles saisies, les écarts sont fixés pour le règlement",
      "La conversion de l'OF en demande d'achat",
      "La libération de l'OF pour la production en atelier",
    ],
    correctIndex: 1,
    explanation: "La clôture technique (TECO) gèle l'OF — plus aucune saisie n'est possible. Les écarts peuvent alors être calculés et réglés en clôture de période.",
  },

  // Ch4 — Planification capacitaire (6 questions)
  {
    id: "pp-e19",
    chapter: "ch4",
    question: "Quel est le taux de charge d'un poste de charge ?",
    options: [
      "Le nombre d'heures travaillées par équipe",
      "La charge planifiée divisée par la capacité disponible × 100%",
      "Le coût horaire du poste multiplié par le rendement",
      "La somme des temps de préparation de tous les OF",
    ],
    correctIndex: 1,
    explanation: "Taux de charge = (Charge planifiée / Capacité disponible) × 100%. Un taux > 100% signifie une surcharge (bottleneck).",
  },
  {
    id: "pp-e20",
    chapter: "ch4",
    question: "Quelle transaction affiche un histogramme de charge vs capacité disponible par poste de charge ?",
    options: ["MD04", "CO11N", "CM01", "KSB1"],
    correctIndex: 2,
    explanation: "CM01 (Poste de charge — Vue charge) affiche un histogramme comparant charge planifiée et capacité disponible sur une période.",
  },
  {
    id: "pp-e21",
    chapter: "ch4",
    question: "Quelle action peut résorber une surcharge capacitaire sur un poste de charge ?",
    options: [
      "Augmenter le stock de sécurité du produit fini",
      "Décaler des ordres dans le temps, sous-traiter ou réaffecter à un poste alternatif",
      "Augmenter le délai de réapprovisionnement dans la fiche article",
      "Changer la stratégie de planification de 10 à 50",
    ],
    correctIndex: 1,
    explanation: "Pour résorber une surcharge, on peut décaler des OF, les scinder, les réaffecter à des postes alternatifs, ou sous-traiter une partie de la charge.",
  },
  {
    id: "pp-e22",
    chapter: "ch4",
    question: "Quelle est la différence entre la planification à terme infini et à terme fini ?",
    options: [
      "Terme infini planifie sans tenir compte des capacités, terme fini respecte les contraintes",
      "Terme infini donne des résultats plus précis",
      "Terme fini ignore les stocks de sécurité",
      "Il n'y a pas de différence fonctionnelle",
    ],
    correctIndex: 0,
    explanation: "Le MRP standard planifie à terme infini (ignore les capacités). La planification à terme fini (PP-CRP/PP-DS) tient compte des capacités disponibles.",
  },
  {
    id: "pp-e23",
    chapter: "ch4",
    question: "Comment le tarif d'activité d'un poste de charge est-il calculé dans SAP CO ?",
    options: [
      "Prix d'achat de la machine / durée d'amortissement",
      "Coûts planifiés du centre de coûts / activité planifiée",
      "Salaire brut des opérateurs × coefficient de charges sociales",
      "Tarif fixé manuellement par le contrôleur de gestion uniquement",
    ],
    correctIndex: 1,
    explanation: "Le tarif d'activité = Coûts planifiés du centre de coûts / Quantité d'activité planifiée. Il est calculé dans CO lors de la planification des coûts.",
  },
  {
    id: "pp-e24",
    chapter: "ch4",
    question: "Qu'est-ce que l'écart de volume en comptabilité analytique PP ?",
    options: [
      "La différence entre le prix standard et le prix réel des composants",
      "La différence entre les temps réels et les temps standards de la gamme",
      "Les coûts fixes non absorbés dus à une sous-utilisation de la capacité",
      "La différence de quantité entre la BOM et les prélèvements réels",
    ],
    correctIndex: 2,
    explanation: "L'écart de volume (ou sous-absorption) représente les coûts fixes non couverts quand l'activité réelle est inférieure à l'activité planifiée.",
  },

  // Ch5 — Kanban et fabrication répétitive (4 questions)
  {
    id: "pp-e25",
    chapter: "ch5",
    question: "Quel est le statut d'un conteneur Kanban qui vient d'être consommé et attend réapprovisionnement ?",
    options: ["PLEIN", "EN COURS", "VIDE", "BLOQUÉ"],
    correctIndex: 2,
    explanation: "Quand un conteneur Kanban est consommé, il passe au statut VIDE — ce signal déclenche le réapprovisionnement (OF, commande, transfert).",
  },
  {
    id: "pp-e26",
    chapter: "ch5",
    question: "Dans la fabrication répétitive (REM), qu'est-ce que le backflush ?",
    options: [
      "Un retour de composants au fournisseur",
      "La confirmation d'opérations avec prélèvement automatique des composants",
      "Un type d'ordre de fabrication spécifique au flux tiré",
      "La clôture automatique des OF en fin de mois",
    ],
    correctIndex: 1,
    explanation: "Le backflush automatise les prélèvements de composants lors de la confirmation de production — pas besoin de saisie manuelle des sorties de stock.",
  },
  {
    id: "pp-e27",
    chapter: "ch5",
    question: "Quelle transaction SAP est utilisée pour la confirmation REM avec backflush ?",
    options: ["CO11N", "MFBF", "MB1A", "PKBC"],
    correctIndex: 1,
    explanation: "MFBF (Backflush REM) est la transaction spécifique à la confirmation en fabrication répétitive avec prélèvement automatique des composants.",
  },
  {
    id: "pp-e28",
    chapter: "ch5",
    question: "Pour quel type de flux industriel le Kanban est-il le plus approprié ?",
    options: [
      "Production sur commande unitaire avec forte variabilité",
      "Flux réguliers avec des consommations prévisibles et stables",
      "Fabrication de prototypes et produits innovants",
      "Gestion des projets pluriannuels",
    ],
    correctIndex: 1,
    explanation: "Le Kanban fonctionne mieux pour les flux réguliers et stables — il n'est pas adapté à une demande très variable ou imprévisible.",
  },

  // Ch6 — Sous-traitance et versions (4 questions)
  {
    id: "pp-e29",
    chapter: "ch6",
    question: "Quel mouvement SAP enregistre la consommation des composants lors de la réception d'un ordre de sous-traitance ?",
    options: ["Mouvement 101 uniquement", "Mouvement 543 (automatique lors du 101)", "Mouvement 261 manuel", "Mouvement 311"],
    correctIndex: 1,
    explanation: "Lors de la réception d'une commande de sous-traitance (mv. 101), le mouvement 543 est généré automatiquement pour prélever les composants du stock en dépôt.",
  },
  {
    id: "pp-e30",
    chapter: "ch6",
    question: "Dans quel cas une version de fabrication est-elle OBLIGATOIRE dans SAP PP ?",
    options: [
      "Pour tous les ordres de fabrication sans exception",
      "Dans la fabrication répétitive (REM) uniquement",
      "Pour les articles achetés (ROH)",
      "Pour les produits de négoce (HAWA)",
    ],
    correctIndex: 1,
    explanation: "La version de fabrication est obligatoire en fabrication répétitive (REM) — elle lie l'article à sa ligne de production et à ses données de base spécifiques.",
  },
  {
    id: "pp-e31",
    chapter: "ch6",
    question: "Comment une opération externe dans une gamme déclenche-t-elle la sous-traitance ?",
    options: [
      "En envoyant automatiquement un email au fournisseur",
      "En générant une demande d'achat lors de la libération de l'OF",
      "En créant automatiquement une commande d'achat confirmée",
      "En transférant le stock vers le fournisseur sans action supplémentaire",
    ],
    correctIndex: 1,
    explanation: "À la libération de l'OF, une opération de type externe génère une demande d'achat — le service achats la traite pour créer la commande de sous-traitance.",
  },
  {
    id: "pp-e32",
    chapter: "ch6",
    question: "Qu'est-ce qu'une version de fabrication dans SAP PP ?",
    options: [
      "Une révision de la nomenclature après une modification produit",
      "La combinaison nomenclature + gamme valide pour fabriquer un article sur une ligne",
      "Un historique des prix de revient d'un produit",
      "Un scénario de simulation MRP alternatif",
    ],
    correctIndex: 1,
    explanation: "Une version de fabrication associe une nomenclature alternative et une gamme alternative pour définir un procédé de fabrication spécifique à une ligne ou un procédé.",
  },

  // Ch7 — Intégrations et clôture (8 questions)
  {
    id: "pp-e33",
    chapter: "ch7",
    question: "Comment SAP PP et SD s'intègrent-ils pour la vérification de disponibilité (ATP) ?",
    options: [
      "SD crée des OF directement sans passer par PP",
      "SD consulte les stocks et les entrées planifiées PP pour confirmer les délais de livraison",
      "PP envoie des alertes email à SD en cas de rupture",
      "SD et PP n'interagissent pas directement",
    ],
    correctIndex: 1,
    explanation: "La vérification de disponibilité (ATP) en SD consulte les stocks, les OF en cours et les OF planifiés PP pour confirmer ou proposer une date de livraison réaliste.",
  },
  {
    id: "pp-e34",
    chapter: "ch7",
    question: "Quelle transaction génère des demandes d'achat pour les composants planifiés par le MRP ?",
    options: [
      "MD01 (MRP) génère automatiquement des demandes d'achat pour les articles achetés",
      "ME21N crée manuellement toutes les demandes d'achat",
      "CO01 génère les demandes d'achat lors de la création de l'OF",
      "MB31 crée les demandes d'achat lors de la réception",
    ],
    correctIndex: 0,
    explanation: "Le MRP (MD01/MD02) génère automatiquement des demandes d'achat pour les composants à source externe (articles MM), qui sont ensuite traitées par les acheteurs.",
  },
  {
    id: "pp-e35",
    chapter: "ch7",
    question: "Quelle est l'innovation principale de MRP Live dans SAP S/4HANA ?",
    options: [
      "Il remplace entièrement le Kanban",
      "Il planifie in-memory sur HANA pour une planification quasi temps-réel",
      "Il supprime le besoin de gammes et nomenclatures",
      "Il automatise toutes les confirmations d'OF",
    ],
    correctIndex: 1,
    explanation: "MRP Live exploite la technologie in-memory de HANA pour offrir une planification quasi temps-réel avec des performances nettement supérieures au MRP classique.",
  },
  {
    id: "pp-e36",
    chapter: "ch7",
    question: "Dans quelle séquence correcte doit-on effectuer les activités de clôture de période PP ?",
    options: [
      "Règlement → Clôture technique → Calcul des écarts",
      "Clôture technique → Calcul des écarts → Règlement (CO88)",
      "Calcul des écarts → Règlement → Clôture technique",
      "Règlement → Calcul des écarts → Clôture technique",
    ],
    correctIndex: 1,
    explanation: "L'ordre correct est : 1) Clôture technique (TECO) pour geler l'OF, 2) Calcul des écarts (KKS2), 3) Règlement (CO88) pour solder les écarts.",
  },
  {
    id: "pp-e37",
    chapter: "ch7",
    question: "Quelle transaction fournit un rapport complet des coûts planifiés, cibles et réels d'un ordre de fabrication ?",
    options: ["MD04", "COOIS", "KKBC_ORD", "CM01"],
    correctIndex: 2,
    explanation: "KKBC_ORD (Analyse des coûts d'ordres de fabrication) compare coûts planifiés, coûts cibles et coûts réels, avec décomposition des écarts par type.",
  },
  {
    id: "pp-e38",
    chapter: "ch7",
    question: "Qu'est-ce que PP/DS Embedded dans SAP S/4HANA ?",
    options: [
      "Un module de gestion des fournisseurs pour la sous-traitance",
      "La planification à terme fini intégrée nativement dans S/4HANA",
      "Un tableau de bord Kanban pour l'atelier",
      "Un outil d'analyse de coûts standards",
    ],
    correctIndex: 1,
    explanation: "PP/DS Embedded intègre nativement dans S/4HANA la planification à terme fini avec séquençage optimisé — anciennement disponible uniquement dans APO.",
  },
  {
    id: "pp-e39",
    chapter: "ch7",
    question: "Quel impact a une panne machine (PM) sur la planification PP ?",
    options: [
      "Aucun impact — PP et PM sont totalement indépendants",
      "Réduction de la capacité disponible du poste de charge concerné",
      "Annulation automatique de tous les OF en cours",
      "Déclenchement automatique d'une commande de sous-traitance",
    ],
    correctIndex: 1,
    explanation: "Une panne machine réduit la capacité disponible du poste de charge dans PP — le planificateur doit alors réorganiser la charge (décaler, sous-traiter, etc.).",
  },
  {
    id: "pp-e40",
    chapter: "ch7",
    question: "Quelle application Fiori SAP S/4HANA permet de gérer et confirmer les ordres de fabrication depuis une tablette en atelier ?",
    options: [
      "Manage Purchase Orders",
      "Confirm Production Operations",
      "Monitor Financial Documents",
      "Approve Purchase Requisitions",
    ],
    correctIndex: 1,
    explanation: "'Confirm Production Operations' est l'application Fiori S/4HANA qui permet à l'opérateur de saisir les confirmations directement depuis une tablette ou un terminal atelier.",
  },
];
