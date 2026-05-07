// ── Certification SAP HCM — C_THR81_2311 ─────────────────────────────────────

export const hcmCertification = {
  id: "hcm",
  title: "SAP HCM — C_THR81_2311",
  description: "Maîtrisez la gestion des ressources humaines dans SAP : structures organisationnelles, données employés, gestion du temps, paie et développement des talents.",
  duration: "180 minutes",
  questions: 80,
  passingScore: 65,
  color: "from-purple-600 to-violet-800",
  chapters: [
    {
      id: "ch1",
      title: "Structures organisationnelles HCM",
      isPremium: false,
      lessons: [
        {
          id: "l1-1",
          title: "Enterprise Structure en SAP HCM",
          content: `La structure d'entreprise SAP HCM est le squelette sur lequel repose toute la gestion des ressources humaines. Elle se compose de plusieurs niveaux hiérarchiques imbriqués.

**Client (Mandant)** : Le niveau le plus élevé. Toutes les données partagées à ce niveau sont disponibles dans tout le système. Dans la réalité, un client correspond souvent à un groupe d'entreprises.

**Company Code (Société)** : Unité comptable indépendante avec propre bilan. Liée au module FI. Une société peut avoir plusieurs zones de paie.

**Personnel Area (Périmètre du personnel)** : Unité organisationnelle spécifique HCM liée à une société. Elle représente généralement un site géographique ou une division. Transaction : SPRO > Enterprise Structure > Definition > Human Capital Management > Define Personnel Area.

**Personnel Subarea (Sous-périmètre du personnel)** : Subdivision du Personnel Area. Contrôle des paramètres locaux : calendriers de paie, règles d'absences, horaires de travail. C'est à ce niveau que sont définis les groupements de temps (Time Management groupings).

**Exemple concret** :
- Client 100 : Groupe ABC International
- Société 1000 : ABC France SAS
- Personnel Area 1010 : Site de Paris
- Personnel Subarea 1011 : Production Paris / 1012 : Administration Paris`
        },
        {
          id: "l1-2",
          title: "Employee Group et Employee Subgroup",
          content: `Ces deux niveaux définissent la classification des employés indépendamment de leur localisation.

**Employee Group (Groupe de salariés)** : Classification large des employés. Exemples typiques :
- 1 : Actifs
- 2 : Retraités
- 3 : Prestataires externes

**Employee Subgroup (Sous-groupe de salariés)** : Subdivision plus fine. Contrôle des règles de paie (schemas et règles de calcul), des plages de paie (Payroll Area), des profils d'autorisation et des modalités du temps de travail.

**Payroll Area (Zone de paie)** : Regroupe les employés soumis au même calendrier de paie (mensuel, bimensuel, hebdomadaire). Défini au niveau du sous-groupe. Transaction PU03 pour afficher les paramètres de zone de paie.

**Groupements critiques pour le Temps** :
Le sous-périmètre et le sous-groupe définissent ensemble les Work Schedule Rules (règles d'horaires), les groupements d'absence et de présence, et les règles d'arrondi.

**Configuration** : SPRO > Personnel Management > Personnel Administration > Organizational Data > Employee Group / Employee Subgroup`
        },
        {
          id: "l1-3",
          title: "Organizational Management (OM)",
          content: `L'Organizational Management est le module qui gère la structure fonctionnelle de l'entreprise, distincte de la structure administrative.

**Objets OM principaux** :
- **O (Organizational Unit)** : Service, département, direction
- **S (Position)** : Poste spécifique dans un service (ex: Responsable Paie Paris)
- **C (Job)** : Famille de postes (ex: Responsable Paie — générique)
- **P (Person)** : Employé physique
- **A (Work Center)** : Lieu de travail physique

**Relations clés** :
- A008 : "est titulaire de" (Person → Position)
- A003 : "appartient à" (Position → Org Unit)
- A007 : "est décrit par" (Position → Job)

**Intégration PA-OM** : Quand un employé est recruté via PA40, le système peut automatiquement associer la personne à une position OM. Ce lien est contrôlé par le paramètre PLOGI ORGA dans la table T77S0.

**Transactions OM** :
- PPOME : Affichage/modification de la structure organisationnelle
- PPOCE : Créer/modifier les unités organisationnelles
- PP01 : Maintien des objets OM

**Plan de version** : Les structures OM sont versionnées (01 = Plan actif). On peut créer des scénarios futurs dans d'autres versions.`
        },
        {
          id: "l1-4",
          title: "Intégration des structures et Infotype 0001",
          content: `L'Infotype 0001 "Affectation organisationnelle" est l'infotype central qui relie un employé à toutes les structures SAP HCM.

**Champs clés de l'IT0001** :
- Company Code : Société employeur
- Personnel Area : Périmètre du personnel
- Personnel Subarea : Sous-périmètre
- Employee Group : Groupe de salariés
- Employee Subgroup : Sous-groupe
- Payroll Area : Zone de paie
- Org Unit (OM) : Service OM
- Position (OM) : Poste OM
- Job (OM) : Emploi générique
- Cost Center (CO) : Centre de coûts

**Contrôle d'autorisation** : Les accès aux données des employés sont contrôlés par les objets P_ORGIN (données maîtres) et P_ORGXX. Les profils sont assignés en fonction des Personnel Area/Subarea et des combinaisons Groupe/Sous-groupe.

**Importance pour la paie** : Le sous-périmètre et le sous-groupe déterminent le schema de paie qui sera exécuté lors du Payroll Run. Une mauvaise configuration de l'IT0001 peut entraîner l'application d'un mauvais schema de paie.`
        }
      ],
      quiz: [
        {
          question: "Quel niveau de la structure HCM contrôle les règles d'absences et les horaires de travail locaux ?",
          options: ["Company Code", "Personnel Area", "Personnel Subarea", "Employee Group"],
          correctIndex: 2,
          explanation: "Le Personnel Subarea (sous-périmètre) est le niveau qui contrôle les paramètres locaux comme les calendriers, les règles d'absences et les horaires de travail."
        },
        {
          question: "Quel est l'objet OM qui représente un poste générique applicable à plusieurs services ?",
          options: ["O (Org Unit)", "S (Position)", "C (Job)", "P (Person)"],
          correctIndex: 2,
          explanation: "C (Job/Emploi) représente une famille de postes générique. S (Position) est le poste spécifique dans un service particulier."
        },
        {
          question: "Dans quel infotype trouve-t-on l'affectation d'un employé à sa société, son périmètre et sa zone de paie ?",
          options: ["IT0000", "IT0001", "IT0002", "IT0007"],
          correctIndex: 1,
          explanation: "L'Infotype 0001 'Affectation organisationnelle' centralise tous les liens structurels de l'employé : société, périmètre, zone de paie, service OM, poste OM."
        },
        {
          question: "Quelle transaction SAP permet d'afficher et modifier la structure organisationnelle en mode graphique ?",
          options: ["PA20", "PPOME", "PU03", "PE01"],
          correctIndex: 1,
          explanation: "PPOME (Organisation & Staffing) est la transaction principale pour visualiser et modifier la structure organisationnelle de manière graphique."
        },
        {
          question: "Quel paramètre dans la table T77S0 contrôle l'intégration entre PA et OM ?",
          options: ["PLOGI EVNTS", "PLOGI ORGA", "PLOGI PRELI", "PLOGI WFEAT"],
          correctIndex: 1,
          explanation: "PLOGI ORGA dans la table T77S0 contrôle si l'intégration PA-OM est active, permettant l'affectation automatique d'une personne à une position lors du recrutement."
        }
      ]
    },
    {
      id: "ch2",
      title: "Données de base des employés et Infotypes",
      isPremium: true,
      lessons: [
        {
          id: "l2-1",
          title: "Concept des Infotypes",
          content: `Les Infotypes sont le cœur du module PA (Personnel Administration). Chaque Infotype stocke un type spécifique d'information RH avec une période de validité.

**Structure d'un Infotype** :
- Numéro : 4 chiffres (IT0001, IT0002…)
- Date de début / Date de fin : Validité temporelle
- Sous-type (Subtype) : Subdivision d'un Infotype (ex: IT0006 subtype 1 = Adresse principale)

**Infotypes fondamentaux** :
| IT | Nom | Contenu |
|---|---|---|
| 0000 | Actions | Historique des mouvements RH |
| 0001 | Affectation organisationnelle | Structure + OM |
| 0002 | Données personnelles | Nom, date de naissance, nationalité |
| 0006 | Adresses | Domicile, travail |
| 0007 | Horaires planifiés | Work Schedule Rule |
| 0008 | Rémunération de base | Salaire, classe, échelon |
| 0009 | Informations bancaires | IBAN, BIC |

**Opérations CRUD sur les Infotypes** :
- **Insert (ins)** : Crée un nouvel enregistrement sans modifier l'historique
- **Change (chg)** : Modifie avec délimitation de l'ancien enregistrement
- **Copy (cop)** : Copie avec nouvelle date de début
- **Delete (del)** : Suppression physique

**Transactions** : PA20 (Affichage), PA30 (Maintien direct), PA40 (Actions)`
        },
        {
          id: "l2-2",
          title: "Actions RH — PA40",
          content: `Les Actions personnelles (IT0000) permettent d'exécuter des séquences prédéfinies de modifications d'Infotypes lors d'événements RH.

**Types d'actions standard** :
- **01 - Hiring** : Embauche d'un nouvel employé. Déclenche la création des IT0001, IT0002, IT0007, IT0008, etc.
- **12 - Transfer** : Mutation vers un autre service/périmètre
- **25 - Leave of Absence** : Congé sans solde
- **30 - Termination** : Départ (démission, licenciement)
- **52 - Retirement** : Retraite

**Screen Sequences** : Pour chaque type d'action, un enchaînement d'écrans est défini dans la customisation (Feature IGMOD, table T588M). Cela permet de présenter les Infotypes dans le bon ordre lors d'une action.

**Reason for Action (IT0000 subtype)** : Chaque action a un motif (ex: pour Termination : 01=Démission, 02=Licenciement économique, etc.)

**Fast Entry** : La transaction PA42 permet la saisie rapide de plusieurs employés pour la même action.

**Statut de l'employé** : L'IT0000 stocke le statut (actif, suspendu, retraité) via le champ MASSN/MASSG. Ce statut est crucial pour les processus de paie.`
        },
        {
          id: "l2-3",
          title: "Rémunération de base — Infotype 0008",
          content: `L'Infotype 0008 "Rémunération de base" stocke les éléments salariaux permanents de l'employé.

**Structure de l'IT0008** :
- **Pay Scale Type** : Type de grille salariale (convention collective)
- **Pay Scale Area** : Zone géographique de la grille
- **Pay Scale Group** : Classe/coefficient
- **Pay Scale Level** : Échelon dans la classe
- **Annual Salary / Monthly Salary** : Salaire global
- **Wage Types** : Types de salaire (ex: /001 = Salaire de base)

**Types de salaire (Wage Types)** :
- Commencent par une lettre + 3 chiffres (ex: M001 = Salaire mensuel de base)
- Les types commençant par "/" sont des types techniques (calculés)
- Les types commençant par "M" sont souvent des types Dialog (saisis manuellement)

**Pay Scale Reclassification** : SAP permet d'automatiser les progressions d'échelon via le report RPLPOC00.

**Indirect Valuation** : Le salaire peut être valorisé indirectement depuis une table de grille salariale (T510) plutôt que saisi manuellement. Méthode B = indirect depuis table, Méthode C = indirect avec modification.`
        }
      ],
      quiz: [
        {
          question: "Quelle transaction est utilisée pour exécuter des Actions personnelles RH comme l'embauche ?",
          options: ["PA20", "PA30", "PA40", "PPOME"],
          correctIndex: 2,
          explanation: "PA40 est la transaction dédiée aux Actions personnelles. Elle déclenche un enchaînement prédéfini d'Infotypes selon le type d'action (embauche, mutation, départ, etc.)."
        },
        {
          question: "Que permet l'opération 'Change' sur un Infotype ?",
          options: [
            "Crée un nouvel enregistrement sans toucher l'historique",
            "Modifie l'enregistrement en délimitant l'ancien",
            "Supprime physiquement l'enregistrement",
            "Copie l'enregistrement avec une nouvelle date de début"
          ],
          correctIndex: 1,
          explanation: "L'opération Change modifie un Infotype en délimitant automatiquement l'enregistrement précédent à la veille de la date de début du nouveau, préservant ainsi l'historique."
        },
        {
          question: "Dans l'IT0008, comment s'appelle la méthode où le salaire est automatiquement valorisé depuis une table de grille sans saisie manuelle ?",
          options: ["Méthode A", "Méthode B (Indirect Valuation)", "Méthode C", "Méthode D"],
          correctIndex: 1,
          explanation: "La méthode B d'Indirect Valuation permet au système de récupérer automatiquement le montant depuis la table de grille T510 en fonction du Pay Scale Group/Level."
        },
        {
          question: "Quel Infotype contient les coordonnées bancaires (IBAN) d'un employé ?",
          options: ["IT0006", "IT0008", "IT0009", "IT0010"],
          correctIndex: 2,
          explanation: "L'IT0009 'Bank Details' contient les informations bancaires de l'employé (IBAN, BIC, banque) utilisées pour le virement du salaire."
        },
        {
          question: "Quelle transaction permet l'affichage en lecture seule des Infotypes d'un employé ?",
          options: ["PA30", "PA40", "PA20", "PA42"],
          correctIndex: 2,
          explanation: "PA20 est la transaction d'affichage en lecture seule. PA30 permet le maintien direct, PA40 les actions et PA42 la saisie rapide multi-employés."
        }
      ]
    },
    {
      id: "ch3",
      title: "Gestion du temps (Time Management)",
      isPremium: true,
      lessons: [
        {
          id: "l3-1",
          title: "Horaires de travail et Work Schedule",
          content: `La gestion du temps SAP s'appuie sur un système d'horaires structuré en plusieurs niveaux.

**Daily Work Schedule (DWS)** : Définit les heures de travail d'une journée type (début, fin, pause). Ex : DWS "NORM" = 8h00-17h00 avec 1h de pause.

**Period Work Schedule (PWS)** : Séquence de DWS sur une période (semaine, quinzaine). Ex : PWS "WORK" = NORM/NORM/NORM/NORM/NORM/OFF/OFF pour une semaine 5j.

**Work Schedule Rule (WSR)** : Combinaison d'un PWS avec des paramètres d'application (date de début du cycle, règles d'arrondi). Stockée dans l'IT0007 de l'employé.

**Public Holiday Calendar** : Calendrier des jours fériés. Affecté au Personnel Subarea. Intégré automatiquement dans le Work Schedule.

**Employee Subgroup Grouping for Work Schedule** : Permet d'assigner des ensembles de WSR différents selon le type d'employé (cadre vs non-cadre).

**Transactions** :
- SCAL : Gestion des calendriers des jours fériés
- PT60 : Time Leveling (correction des écarts)
- TM01/TM04 : Time Manager's Workplace (saisie du temps)`
        },
        {
          id: "l3-2",
          title: "Absences, présences et quotas",
          content: `**Absence Types (IT2001)** : Types d'absences (congés payés, maladie, RTT…). Chaque type est lié à des règles de décompte et d'impact paie.

**Attendance Types (IT2002)** : Présences hors horaires (heures supplémentaires déclarées, astreintes).

**Absence Quotas (IT2006)** : Droits à congés. Définit le solde disponible pour chaque type d'absence.
- Alimentation : manuelle, automatique (report RPTQTA00) ou via Time Evaluation
- Décompte : à chaque saisie d'absence de type concerné

**Attendance Quotas (IT2007)** : Contingents d'heures supplémentaires autorisées.

**CATS (Cross-Application Time Sheet)** : Feuille de temps inter-applications. Permet aux employés de saisir eux-mêmes leurs temps projet/activités. Intégré CO-PA, PS, MM.
- CAT2 : Saisie feuille de temps CATS
- CAT6 : Validation par le manager
- CAT7 : Transfert vers HR

**Time Evaluation (Évaluation du temps)** : Report RPTIME00 qui traite les données brutes de pointage pour calculer les heures effectives, les heures sup, les quotas, les primes. Basé sur des schemas TM (Time Management Schemas).`
        },
        {
          id: "l3-3",
          title: "Intégration Temps-Paie",
          content: `La gestion du temps alimente directement la paie via des mécanismes précis.

**Time Wage Types** : Lors de la Time Evaluation, les heures calculées sont converties en types de salaire spécifiques (ex: heures suppl. → type M400).

**Time Cluster (Cluster B2)** : Les résultats de la Time Evaluation sont stockés dans des clusters de données internes. Le programme de paie lit ces clusters pour intégrer les données temps.

**Import dans la paie** : La règle TIMTYPES dans le schema de paie importe les données temps. Sans Time Evaluation active, les données IT2001/IT2002 sont directement lues.

**Negative vs Positive Time Recording** :
- **Négatif** : On ne saisit que les écarts par rapport à l'horaire planifié (absences). Système le plus courant.
- **Positif** : Pointage complet de toutes les présences (nécessite un système de badges).

**Cumuls temps** : Les quotas d'absences utilisés sont accumulés dans des compteurs (Absence Counters) qui peuvent déclencher des alertes ou bloquer des absences supplémentaires.`
        }
      ],
      quiz: [
        {
          question: "Quel objet SAP définit les heures de début et de fin d'une journée de travail standard ?",
          options: ["Work Schedule Rule", "Period Work Schedule", "Daily Work Schedule", "Employee Subgroup Grouping"],
          correctIndex: 2,
          explanation: "Le Daily Work Schedule (DWS) définit les paramètres d'une journée de travail type : heure de début, heure de fin, durée des pauses et nombre d'heures planifiées."
        },
        {
          question: "Quel Infotype contient les droits à congés (solde disponible) d'un employé ?",
          options: ["IT2001", "IT2002", "IT2006", "IT2007"],
          correctIndex: 2,
          explanation: "IT2006 'Absence Quotas' contient les droits à congés de l'employé. IT2001 contient les absences déclarées, IT2002 les présences déclarées, IT2007 les contingents de présences."
        },
        {
          question: "Quel report SAP HCM est exécuté pour alimenter automatiquement les quotas d'absences ?",
          options: ["RPTIME00", "RPTQTA00", "RPLPOC00", "RGUGBR00"],
          correctIndex: 1,
          explanation: "RPTQTA00 est le report d'alimentation des quotas d'absences. RPTIME00 est le report de Time Evaluation (traitement des pointages)."
        },
        {
          question: "Dans quel cluster les résultats de la Time Evaluation sont-ils stockés pour être lus par la paie ?",
          options: ["Cluster B1", "Cluster B2", "Cluster RX", "Cluster PC"],
          correctIndex: 1,
          explanation: "Le Cluster B2 stocke les résultats de la Time Evaluation (heures, primes, types de salaire temps) qui sont ensuite lus par le programme de paie."
        },
        {
          question: "Quelle transaction est utilisée par un employé pour saisir sa feuille de temps CATS ?",
          options: ["PT60", "CAT2", "TM01", "CAT6"],
          correctIndex: 1,
          explanation: "CAT2 est la transaction de saisie de la feuille de temps CATS par l'employé. CAT6 est la validation manager, CAT7 le transfert vers HR, PT60 le Time Leveling."
        }
      ]
    },
    {
      id: "ch4",
      title: "Paie SAP (Payroll)",
      isPremium: true,
      lessons: [
        {
          id: "l4-1",
          title: "Payroll Control Record et cycle de paie",
          content: `Le Payroll Control Record (Enregistrement de contrôle de paie) est l'élément central qui pilote le cycle de paie pour chaque zone de paie.

**États du Payroll Control Record** :
1. **Released for Payroll** : La paie est ouverte, les données peuvent être modifiées et la paie peut être lancée
2. **Released for Correction** : Des corrections peuvent être apportées aux données maîtres pendant la période
3. **Payroll Completed** : La paie est terminée et validée
4. **After Exit** : Après la clôture, avant l'archivage

**Transaction PU01** : Maintien du Payroll Control Record. Permet de passer d'un état à l'autre.

**Payroll Period** : La période de paie est définie dans le Control Record (mois/année ou semaine/année selon la zone).

**Payroll Schema** : Programme principal qui contient toutes les règles de calcul de la paie. Pour SAP France, le schema standard est X000 ou F000. Accessible via PE01.

**Off-Cycle Payroll** : Paie hors cycle normal (avance sur salaire, correction rétroactive, solde de tout compte). Transaction PUOC_xx.`
        },
        {
          id: "l4-2",
          title: "Wage Types et calcul de la paie",
          content: `**Wage Types (Types de salaire)** : Éléments atomiques de la paie. Chaque élément de rémunération est un type de salaire.

**Classification** :
- **Primary Wage Types** : Saisis directement (IT0008, IT0014, IT0015)
- **Technical Wage Types** : Calculés par le schema (commencent par /)
  - /001 : Total brut
  - /559 : Montant net à payer
  - /101 : Cotisations patronales totales

**IT0014 — Éléments de salaire récurrents** : Pour les primes ou retenues répétitives à durée limitée.

**IT0015 — Éléments de salaire non récurrents** : Pour les primes ponctuelles (prime exceptionnelle, acompte).

**Wage Type Processing Class** : Contrôle le traitement d'un type de salaire dans le schema (accumulation, cumuls, impact cotisations).

**Payroll Schema — Structure** :
- Fonctions principales : WPBP (Work Place Basic Pay), KGENAU (calcul génération absences), TE (Time Evaluation), ZULAG (primes)
- Résultat stocké dans Cluster RX et Cluster PC (résultats paie)

**Retroactive Accounting** : Si des données sont modifiées dans le passé, SAP calcule automatiquement les différences et les régularise dans la prochaine paie.`
        },
        {
          id: "l4-3",
          title: "Clôture de paie et post-traitements",
          content: `Après le calcul de paie, plusieurs étapes de post-traitement sont nécessaires.

**Posting to Accounting (FI Posting)** : Transfert des résultats de paie vers FI/CO. Transaction PC00_MXX_CIPE. Génère des documents comptables dans FI.

**Payment Run** : Génération des virements bancaires. Crée un fichier SEPA ou envoie vers le module FI-AP. Transaction PC00_M99_DKON.

**Payslip (Bulletin de paie)** : Génération des bulletins de paie. Transaction PC00_MXX_CEDT. Format configurable via SmartForms ou Adobe Forms.

**Remittance Statements** : Déclarations aux organismes (URSSAF, retraite, prévoyance). Générées via des reports spécifiques au pays (Localisation France).

**Year-End Activities** :
- Génération des attestations fiscales (déclaration annuelle de revenus)
- Report RPLQST00 : Statistiques de paie
- Archivage des résultats via PA_ARCHIVE

**Simulation de paie** : Il est possible de simuler la paie sans la valider définitivement. Transaction PC00_M99_CALC avec flag "Simulation". Utile pour vérifier l'impact d'un changement avant application.`
        }
      ],
      quiz: [
        {
          question: "Quel est l'état du Payroll Control Record qui permet à la fois de modifier les données maîtres ET de lancer le calcul de paie ?",
          options: ["Payroll Completed", "Released for Correction", "Released for Payroll", "After Exit"],
          correctIndex: 2,
          explanation: "L'état 'Released for Payroll' est l'état principal qui permet à la fois les modifications de données et l'exécution du calcul de paie."
        },
        {
          question: "Quel type de salaire technique représente le montant net à payer à l'employé ?",
          options: ["/001", "/101", "/559", "/560"],
          correctIndex: 2,
          explanation: "/559 est le type de salaire technique qui cumule le montant net à payer (après déduction de toutes les cotisations). /001 = total brut, /101 = cotisations patronales."
        },
        {
          question: "Dans quel Infotype saisit-on une prime ponctuelle non répétitive ?",
          options: ["IT0008", "IT0014", "IT0015", "IT0267"],
          correctIndex: 2,
          explanation: "IT0015 'Additional Payments' est utilisé pour les éléments de salaire non récurrents comme les primes exceptionnelles. IT0014 est pour les éléments récurrents à durée limitée."
        },
        {
          question: "Quelle transaction est utilisée pour transférer les résultats de paie vers la comptabilité FI ?",
          options: ["PC00_M99_DKON", "PC00_MXX_CIPE", "PC00_MXX_CEDT", "PUOC_XX"],
          correctIndex: 1,
          explanation: "PC00_MXX_CIPE (ou son équivalent localisé) transfère les résultats de paie vers FI/CO. PC00_M99_DKON = virements, PC00_MXX_CEDT = bulletins de paie."
        },
        {
          question: "Que se passe-t-il si des données rétroactives sont modifiées après la clôture d'une période de paie ?",
          options: [
            "SAP bloque la modification",
            "La modification est ignorée",
            "SAP recalcule automatiquement les différences lors de la prochaine paie (Retroactive Accounting)",
            "L'employé doit saisir une correction manuelle"
          ],
          correctIndex: 2,
          explanation: "SAP HCM gère automatiquement la régularisation rétroactive (Retroactive Accounting) : les différences sont calculées et intégrées dans la prochaine paie sans intervention manuelle."
        }
      ]
    },
    {
      id: "ch5",
      title: "Recrutement et Onboarding",
      isPremium: true,
      lessons: [
        {
          id: "l5-1",
          title: "Processus de recrutement SAP",
          content: `Le module Recrutement SAP (E-Recruiting ou Recruitment classique) gère le cycle de vie complet des candidatures.

**Recrutement classique (PA-RC)** :
Objets principaux :
- **Vacancy (Poste vacant)** : Lié à une position OM. Transaction PB10.
- **Advertisement** : Annonce d'offre d'emploi
- **Applicant (Candidat)** : IT4000 (Données de base candidat)

**Étapes du processus** :
1. Création du poste vacant (PB10)
2. Publication de l'annonce
3. Réception des candidatures (PB20 - Saisie candidat)
4. Présélection et tri
5. Convocation aux entretiens
6. Décision d'embauche
7. Transfert en employé (PB40)

**Applicant Infotypes** :
- IT4000 : Données de base candidat
- IT4001 : Affectation au poste
- IT4002 : CV/Formation
- IT4003 : Éducation

**SAP SuccessFactors Recruiting** : La solution cloud moderne qui remplace le recrutement classique. Gestion des jobs boards, ATS complet, portail candidats.

**Transfer to HR Master Data** : La transaction PB40 transfère un candidat retenu vers PA, créant les Infotypes de base (IT0001, IT0002, etc.) de façon automatique.`
        },
        {
          id: "l5-2",
          title: "Position Management et planification des effectifs",
          content: `**Position Management** : Gestion des postes (S) dans la structure OM. Un poste peut être :
- **Occupied** : Titulaire en poste
- **Vacant** : Sans titulaire
- **Obsolete** : Poste supprimé

**Headcount Planning** : Planification des effectifs en lien avec le budget. SAP BPC ou SAP Analytics Cloud permettent la planification intégrée.

**FTE (Full Time Equivalent)** : Équivalent temps plein. Un poste peut avoir un pourcentage de dotation (ex: 0.5 FTE pour un mi-temps). Configuré dans la relation entre Person et Position.

**Succession Planning** : Gestion des remplaçants potentiels pour les postes clés. Stocké comme relations OM entre objets S et P.

**Onboarding** : Processus d'intégration du nouvel embauché.
- SAP HCM classique : Géré via les actions PA40 + checklists manuelles
- SAP SuccessFactors Onboarding : Portail dédié avec tâches automatisées, documents, formations obligatoires

**New Hire Checklist** : Actions à réaliser avant/après l'arrivée (badge, accès IT, formation obligatoire, documents légaux).`
        }
      ],
      quiz: [
        {
          question: "Quelle transaction est utilisée pour créer un poste vacant dans le recrutement classique SAP ?",
          options: ["PA40", "PB10", "PB20", "PB40"],
          correctIndex: 1,
          explanation: "PB10 est utilisé pour créer et gérer les postes vacants. PB20 est la saisie des candidatures, PB40 le transfert d'un candidat retenu vers les données employé."
        },
        {
          question: "Quel Infotype contient les données de base d'un candidat dans le recrutement classique ?",
          options: ["IT0001", "IT4000", "IT4001", "IT0002"],
          correctIndex: 1,
          explanation: "IT4000 contient les données de base du candidat (nom, coordonnées, source). Les Infotypes candidats commencent par IT4xxx, à ne pas confondre avec les Infotypes employés IT0xxx."
        },
        {
          question: "Qu'est-ce qu'un FTE (Full Time Equivalent) dans le contexte du Position Management ?",
          options: [
            "Le salaire à temps plein d'un poste",
            "La durée contractuelle minimale",
            "L'équivalent temps plein exprimant le taux de dotation d'un poste",
            "Le nombre de candidats pour un poste"
          ],
          correctIndex: 2,
          explanation: "FTE (Full Time Equivalent) exprime le taux de dotation d'un poste. Un poste à 0.5 FTE correspond à un mi-temps. Cela permet de calculer les effectifs en équivalents temps plein."
        },
        {
          question: "Quelle solution SAP moderne remplace le recrutement classique (PA-RC) ?",
          options: ["SAP HR Forms", "SAP SuccessFactors Recruiting", "SAP E-Recruiting On-Premise", "SAP Talent Advisor"],
          correctIndex: 1,
          explanation: "SAP SuccessFactors Recruiting est la solution cloud ATS (Applicant Tracking System) qui remplace progressivement le module de recrutement classique on-premise PA-RC."
        }
      ]
    },
    {
      id: "ch6",
      title: "Formation, Développement & Talents",
      isPremium: true,
      lessons: [
        {
          id: "l6-1",
          title: "Training & Event Management",
          content: `Le module Training & Event Management (PE) gère le catalogue de formations et les inscriptions des employés.

**Objets principaux** :
- **Course Group (D)** : Regroupement de formations (ex: "Formations SAP")
- **Course Type (L)** : Type de formation générique (ex: "Formation SAP HCM Base")
- **Course (E)** : Instance de formation avec dates et lieu précis
- **Resource (R)** : Salle, formateur, matériel

**Processus de formation** :
1. Définition du catalogue (PPOM/LSO_PVCT)
2. Création des sessions (LSO_PVPE)
3. Inscription des participants (LSO_PVFL ou Manager Self-Service)
4. Suivi des présences (LSO_PVAT)
5. Évaluation de la formation (Kirkpatrick)

**Transactions** :
- PSVP : Affichage du catalogue
- PSV2 : Création de sessions
- PSV3 : Inscriptions
- LSO_RHXCOU0 : Rapports formation

**SAP SuccessFactors Learning** : Solution cloud pour la gestion des formations (LMS). Remplace T&E Management on-premise.

**Mandatory Training** : Formations obligatoires assignées automatiquement selon le poste/service. Suivi des compliances.`
        },
        {
          id: "l6-2",
          title: "Qualification Catalog et Development Plans",
          content: `**Qualifications (OOQA)** : Compétences, diplômes, certifications. Stockées comme objets Q dans l'OM, liés aux Persons (P) avec un niveau de maîtrise.

**Qualification Catalog** : Arborescence des compétences de l'entreprise. Transaction OOQA.

**Profil de qualifications d'un employé** : Stocké dans IT0024 (Qualifications). Contient compétence + niveau + date d'obtention.

**Requirement Profiles** : Profil de qualifications requises pour un Job ou une Position. Permet la comparaison avec les profils employés.

**Development Plans** : Plans de développement individuels. Objectifs de développement, compétences à développer, formations recommandées.

**SAP SuccessFactors** :
- **Succession & Development** : Gestion des plans de succession pour les postes clés
- **Performance & Goals** : Gestion des objectifs individuels et des entretiens d'évaluation
- **Calibration** : Sessions de calibration des performances
- **Talent Cards** : Vue 360° du profil talent d'un employé

**Nine-Box Grid** : Outil d'analyse combinant Performance (x) et Potential (y) pour identifier les High Potentials, les performeurs stables et les collaborateurs à risque.`
        }
      ],
      quiz: [
        {
          question: "Dans le Training & Event Management, quel objet représente une instance concrète de formation avec dates et lieu ?",
          options: ["Course Group (D)", "Course Type (L)", "Course (E)", "Resource (R)"],
          correctIndex: 2,
          explanation: "Course (E) est l'instance concrète de formation avec ses dates, son lieu et ses participants. Course Type (L) est le modèle générique, Course Group (D) le regroupement catalogue."
        },
        {
          question: "Quel Infotype contient les qualifications et compétences d'un employé ?",
          options: ["IT0022", "IT0024", "IT0130", "IT4002"],
          correctIndex: 1,
          explanation: "IT0024 'Qualifications' stocke les compétences, certifications et qualifications de l'employé avec leur niveau de maîtrise et la date d'obtention."
        },
        {
          question: "À quoi sert le Nine-Box Grid dans la gestion des talents ?",
          options: [
            "Organiser les sessions de formation en 9 catégories",
            "Analyser les employés selon leur Performance et leur Potentiel",
            "Définir 9 niveaux de qualification",
            "Planifier 9 étapes d'onboarding"
          ],
          correctIndex: 1,
          explanation: "La Nine-Box Grid croise Performance (axe X) et Potential (axe Y) pour positionner chaque employé dans l'une des 9 cases. Outil clé pour identifier les High Potentials et planifier les successions."
        },
        {
          question: "Quelle solution SAP SuccessFactors remplace le Training & Event Management on-premise ?",
          options: ["SAP SuccessFactors Recruiting", "SAP SuccessFactors Learning", "SAP SuccessFactors Onboarding", "SAP SuccessFactors Performance"],
          correctIndex: 1,
          explanation: "SAP SuccessFactors Learning (LMS - Learning Management System) remplace le module Training & Event Management on-premise pour la gestion des formations dans le cloud."
        }
      ]
    },
    {
      id: "ch7",
      title: "Clôture de période et sujets avancés",
      isPremium: true,
      lessons: [
        {
          id: "l7-1",
          title: "Period-End Processing et archivage",
          content: `La clôture de période en SAP HCM implique plusieurs étapes séquentielles.

**Séquence de clôture mensuelle** :
1. Validation de la Time Evaluation (RPTIME00)
2. Lancement du calcul de paie (PC00_M99_CALC)
3. Vérification des erreurs (PC00_M99_CLST)
4. Passage en Payroll Completed
5. Posting vers FI/CO (PC00_MXX_CIPE)
6. Génération des paiements (PC00_M99_DKON)
7. Génération des bulletins (PC00_MXX_CEDT)
8. Déclarations sociales (DUCS, DSN en France)

**DSN (Déclaration Sociale Nominative)** : Déclaration mensuelle obligatoire en France. Remplace la DADS-U. Générée à partir des résultats de paie SAP.

**Archivage** :
- Les données paie sont archivées via le report PA_ARCHIVE
- Les clusters RX et PC peuvent être archivés après délai légal
- Transaction SARA pour la gestion des archives

**Fiscal Year-End** : Génération des attestations fiscales, récapitulatifs annuels, déclarations aux impôts.`
        },
        {
          id: "l7-2",
          title: "Concurrent Employment et sujets spéciaux",
          content: `**Concurrent Employment (Emplois multiples)** : Gestion d'un employé ayant plusieurs contrats simultanés dans le même groupe.

Configuration nécessaire : Activation dans T77S0 (PLOGI PRELI). L'employé possède un numéro de personne unique mais plusieurs numéros de personnel.

**Global Employment** : Gestion des expatriés et employés travaillant dans plusieurs pays simultanément. Complexité accrue pour la paie et les cotisations.

**Personnel Number Ranges** : Plages de numéros pour les employés. Configuration SPRO > Number Ranges.

**HR Authorization Concept** :
- P_ORGIN : Objet d'autorisation principal pour les données maîtres
- PERNR : Autorisation par numéro de personnel
- Roles standards : SAP_HR_PA_ALL_EMP, SAP_HR_OM_DISPLAY

**HR Renewal / SAP HXM** : L'évolution de SAP HCM vers la solution hybride : noyau SAP HCM on-premise + extensions SuccessFactors cloud. HR Renewal apporte une interface SAP Fiori pour les processus RH.

**SAP Fiori Apps for HCM** :
- My Paystubs : Consultation bulletins de paie
- Manage Workforce : Vue manager
- Time and Attendance : Saisie du temps
- Employee Self-Service (ESS) / Manager Self-Service (MSS)`
        }
      ],
      quiz: [
        {
          question: "Quelle déclaration sociale mensuelle obligatoire en France est générée à partir de la paie SAP ?",
          options: ["DADS-U", "DADSU-IT", "DSN (Déclaration Sociale Nominative)", "DUCS EDI"],
          correctIndex: 2,
          explanation: "La DSN (Déclaration Sociale Nominative) est la déclaration mensuelle obligatoire en France depuis 2017. Elle a remplacé la DADS-U et est générée à partir des résultats de paie SAP."
        },
        {
          question: "Quel paramètre dans T77S0 active la gestion des emplois multiples (Concurrent Employment) ?",
          options: ["PLOGI ORGA", "PLOGI EVNTS", "PLOGI PRELI", "PLOGI WFEAT"],
          correctIndex: 2,
          explanation: "PLOGI PRELI dans la table T77S0 active le Concurrent Employment, permettant à un employé d'avoir plusieurs contrats simultanés avec un numéro de personne commun."
        },
        {
          question: "Quel objet d'autorisation SAP HCM contrôle l'accès aux données maîtres des employés ?",
          options: ["S_TCODE", "P_ORGIN", "HR_AUTH", "PA_ACCESS"],
          correctIndex: 1,
          explanation: "P_ORGIN est l'objet d'autorisation principal pour les données maîtres HR. Il contrôle l'accès aux Infotypes selon la combinaison Company Code, Personnel Area, Employee Group, etc."
        },
        {
          question: "Dans la séquence de clôture de paie, quelle étape vient immédiatement après le calcul de paie ?",
          options: [
            "Génération des bulletins",
            "Posting vers FI/CO",
            "Vérification des erreurs et passage en Payroll Completed",
            "Génération des paiements"
          ],
          correctIndex: 2,
          explanation: "Après le calcul (PC00_M99_CALC), on vérifie les erreurs et valide en passant à l'état 'Payroll Completed'. Le posting FI/CO, les paiements et les bulletins suivent ensuite."
        },
        {
          question: "Qu'est-ce que SAP HXM (Human Experience Management) ?",
          options: [
            "Une nouvelle transaction pour les bulletins de paie",
            "L'approche hybride combinant SAP HCM on-premise et SAP SuccessFactors cloud",
            "Un module de formation SAP remplaçant T&E",
            "Un système d'archivage des données RH"
          ],
          correctIndex: 1,
          explanation: "SAP HXM est la stratégie hybride de SAP : un noyau HCM on-premise pour la paie et l'administration, complété par les solutions cloud SuccessFactors pour la gestion des talents et l'expérience employé."
        }
      ]
    }
  ]
};

// ── Questions examen simulé (40 questions) ────────────────────────────────────
export const hcmMockExamQuestions = [
  // Chapitre 1 — Structures organisationnelles
  {
    id: 1,
    question: "Quel niveau de la structure SAP HCM est spécifique au module HR et n'existe pas dans FI ou MM ?",
    options: ["Company Code", "Personnel Area", "Plant", "Client"],
    correctIndex: 1,
    explanation: "Le Personnel Area (Périmètre du personnel) est une entité spécifique au module SAP HCM. Company Code, Plant et Client existent dans d'autres modules.",
    chapter: "ch1"
  },
  {
    id: 2,
    question: "Un employé appartient à l'Employee Subgroup 'U2'. À quel niveau cela influence-t-il directement le calcul de sa paie ?",
    options: [
      "Il détermine la langue des bulletins de paie",
      "Il détermine le schema de paie et la Payroll Area applicables",
      "Il détermine uniquement les autorisations SAP",
      "Il n'a aucun impact sur la paie"
    ],
    correctIndex: 1,
    explanation: "L'Employee Subgroup (sous-groupe de salariés) détermine directement le schema de paie appliqué et la Payroll Area (zone de paie) à laquelle appartient l'employé.",
    chapter: "ch1"
  },
  {
    id: 3,
    question: "Quelle relation OM définit qu'une position 'appartient à' une unité organisationnelle ?",
    options: ["A008", "A003", "A007", "B002"],
    correctIndex: 1,
    explanation: "La relation A003 'appartient à' (belongs to) relie une Position (S) à son Organizational Unit (O). A008 = 'est titulaire de' (Person → Position), A007 = 'est décrit par' (Position → Job).",
    chapter: "ch1"
  },
  {
    id: 4,
    question: "Un consultant SAP doit vérifier la version active du plan organisationnel. Quelle valeur de version correspond au Plan actif ?",
    options: ["Version 00", "Version 01", "Version 99", "Version A1"],
    correctIndex: 1,
    explanation: "La version 01 correspond toujours au Plan actif (Active Plan) dans SAP OM. Les autres versions sont utilisées pour des scénarios de planification ou des simulations.",
    chapter: "ch1"
  },
  {
    id: 5,
    question: "Quel est l'impact d'une mauvaise affectation du Personnel Subarea dans l'IT0001 d'un employé ?",
    options: [
      "Aucun impact — c'est un champ purement informatif",
      "Seul l'affichage du nom du service change",
      "Les règles d'absences, horaires et jours fériés incorrects sont appliqués",
      "Le bulletin de paie n'est plus généré"
    ],
    correctIndex: 2,
    explanation: "Le Personnel Subarea contrôle les règles d'absences, les horaires de travail et le calendrier des jours fériés. Une mauvaise valeur entraîne l'application de règles incorrectes pour l'employé.",
    chapter: "ch1"
  },
  {
    id: 6,
    question: "Combien d'objets distincts peut-on identifier dans la liste suivante : Service IT, Responsable IT (générique), Directeur Technique Dupont, Responsable IT Paris (poste) ?",
    options: ["1 objet O, 1 objet C, 1 objet P, 1 objet S", "2 objets O, 1 objet C, 1 objet P", "1 objet O, 2 objets C, 1 objet P", "2 objets O, 2 objets S"],
    correctIndex: 0,
    explanation: "Service IT = O (Org Unit), Responsable IT générique = C (Job), Directeur Technique Dupont = P (Person), Responsable IT Paris = S (Position). Chacun est un objet OM distinct.",
    chapter: "ch1"
  },
  // Chapitre 2 — Données de base et Infotypes
  {
    id: 7,
    question: "Un employé demande une correction de son adresse domicile datant de 3 mois. Quelle opération Infotype doit être utilisée ?",
    options: ["Insert", "Change avec délimitation rétroactive", "Delete et recréer", "Copy"],
    correctIndex: 1,
    explanation: "Change avec une date de début rétroactive délimite l'enregistrement incorrect et crée un nouveau record correct à la date souhaitée, tout en préservant l'historique.",
    chapter: "ch2"
  },
  {
    id: 8,
    question: "Quelle transaction permet d'initier l'embauche d'un nouvel employé et déclenche la séquence de création des Infotypes ?",
    options: ["PA20", "PA30", "PA40 avec action type 01", "PPOME"],
    correctIndex: 2,
    explanation: "PA40 avec l'action type 01 (Hiring) déclenche l'enchaînement prédéfini des écrans Infotypes nécessaires à l'embauche d'un nouvel employé.",
    chapter: "ch2"
  },
  {
    id: 9,
    question: "Quel Infotype contient les informations sur la classe de salaire et l'échelon d'un employé dans la grille de rémunération ?",
    options: ["IT0007", "IT0008", "IT0014", "IT0015"],
    correctIndex: 1,
    explanation: "IT0008 'Basic Pay' contient le Pay Scale Group (classe), le Pay Scale Level (échelon), le Pay Scale Type et Area, ainsi que les types de salaire de base.",
    chapter: "ch2"
  },
  {
    id: 10,
    question: "Un manager souhaite simplement consulter les données d'un employé sans les modifier. Quelle transaction utilise-t-il ?",
    options: ["PA30", "PA40", "PA20", "PA42"],
    correctIndex: 2,
    explanation: "PA20 est la transaction d'affichage en lecture seule des données Infotypes. Elle ne permet aucune modification et est sécurisée par les profils d'autorisation.",
    chapter: "ch2"
  },
  {
    id: 11,
    question: "La méthode d'Indirect Valuation 'B' dans l'IT0008 signifie que :",
    options: [
      "Le salaire est saisi manuellement par le gestionnaire RH",
      "Le salaire est calculé automatiquement par le schema de paie",
      "Le salaire est récupéré automatiquement depuis la table de grille salariale T510",
      "Le salaire est copié depuis l'employé précédent sur le même poste"
    ],
    correctIndex: 2,
    explanation: "La méthode B 'Indirect Valuation' récupère automatiquement le montant depuis la table T510 en fonction du Pay Scale Group et Level, sans nécessiter de saisie manuelle du montant.",
    chapter: "ch2"
  },
  {
    id: 12,
    question: "Quelle fonctionnalité permet de réaliser la même action RH (ex: transfert) sur plusieurs employés simultanément ?",
    options: ["PA40 avec sélection multiple", "PA42 (Fast Entry)", "PPOME en mode liste", "PA30 en mode groupe"],
    correctIndex: 1,
    explanation: "PA42 (Fast Entry) permet d'exécuter la même action sur plusieurs employés en séquence rapide, idéal pour les transferts collectifs ou les changements de taux lors d'une revalorisation.",
    chapter: "ch2"
  },
  // Chapitre 3 — Gestion du temps
  {
    id: 13,
    question: "Un employé travaille du lundi au vendredi de 9h à 18h avec 1h de pause. Quel objet SAP définit précisément ces paramètres ?",
    options: ["Work Schedule Rule", "Period Work Schedule", "Daily Work Schedule", "Employee Subgroup Grouping"],
    correctIndex: 2,
    explanation: "Le Daily Work Schedule (DWS) définit les paramètres d'une journée de travail : heure de début (9h), heure de fin (18h), durée de pause (1h) = 8h de travail effectif.",
    chapter: "ch3"
  },
  {
    id: 14,
    question: "Quel est l'avantage principal du Time Recording négatif par rapport au positif ?",
    options: [
      "Il est plus précis pour le calcul des heures supplémentaires",
      "Il ne nécessite de saisir que les écarts par rapport à l'horaire planifié, réduisant les saisies",
      "Il intègre automatiquement les données CATS",
      "Il permet l'archivage automatique des données"
    ],
    correctIndex: 1,
    explanation: "Le Time Recording négatif ne nécessite de saisir que les absences et anomalies. Cela réduit considérablement le volume de saisies par rapport au positif qui requiert le pointage complet.",
    chapter: "ch3"
  },
  {
    id: 15,
    question: "Une employée a utilisé 5 jours de congés sur un quota de 25 jours. Quel Infotype reflète ce solde restant de 20 jours ?",
    options: ["IT2001", "IT2002", "IT2006", "IT0007"],
    correctIndex: 2,
    explanation: "IT2006 'Absence Quotas' contient le droit total et le solde restant pour chaque type d'absence. Les 5 jours d'absence saisis via IT2001 ont débité ce quota automatiquement.",
    chapter: "ch3"
  },
  {
    id: 16,
    question: "Quel report SAP génère les types de salaire pour les heures supplémentaires à partir des données de pointage ?",
    options: ["RPTQTA00", "RPTIME00 (Time Evaluation)", "RPLPOC00", "PC00_M99_CALC"],
    correctIndex: 1,
    explanation: "RPTIME00 (Time Evaluation) traite les données de pointage brutes, calcule les heures supplémentaires selon les règles configurées et génère les Time Wage Types correspondants pour la paie.",
    chapter: "ch3"
  },
  {
    id: 17,
    question: "Un projet nécessite que les développeurs saisissent leurs temps par activité CO. Quelle solution SAP est la plus appropriée ?",
    options: ["IT2002 (Présences)", "IT2001 (Absences)", "CATS (Cross-Application Time Sheet)", "IT0007 Work Schedule"],
    correctIndex: 2,
    explanation: "CATS (Cross-Application Time Sheet) est la solution SAP dédiée à la saisie des temps par activité/projet, avec intégration CO-PA, PS et MM. Bien plus adaptée que les Infotypes temps simples.",
    chapter: "ch3"
  },
  {
    id: 18,
    question: "Dans quel objet technique de stockage les résultats de la Time Evaluation sont-ils conservés pour être lus par la paie ?",
    options: ["Table T510", "Cluster B2", "Cluster RX", "Table PCL2"],
    correctIndex: 1,
    explanation: "Les résultats de la Time Evaluation sont stockés dans le Cluster B2. La paie lit ce cluster lors de l'exécution du schema pour intégrer les données temps (heures sup, primes, etc.).",
    chapter: "ch3"
  },
  // Chapitre 4 — Paie
  {
    id: 19,
    question: "Avant de pouvoir modifier les données d'un employé en vue de la prochaine paie, quel état doit avoir le Payroll Control Record ?",
    options: ["Payroll Completed", "Released for Payroll", "After Exit", "Released for Correction"],
    correctIndex: 1,
    explanation: "'Released for Payroll' est l'état qui permet à la fois les modifications de données maîtres et l'exécution du calcul de paie. C'est l'état de travail normal.",
    chapter: "ch4"
  },
  {
    id: 20,
    question: "Quel type de salaire technique accumule la totalité du salaire brut dans le résultat de paie ?",
    options: ["/001", "/003", "/101", "/559"],
    correctIndex: 0,
    explanation: "/001 est le type de salaire technique qui cumule le total du salaire brut. /559 = net à payer, /101 = cotisations patronales totales.",
    chapter: "ch4"
  },
  {
    id: 21,
    question: "Un employé a reçu une prime exceptionnelle unique de 2000€. Dans quel Infotype cette prime doit-elle être saisie ?",
    options: ["IT0008 (Rémunération de base)", "IT0014 (Éléments récurrents)", "IT0015 (Éléments non récurrents)", "IT0267 (Valeur additionnelle)"],
    correctIndex: 2,
    explanation: "IT0015 'Additional Payments' est conçu pour les éléments de salaire non récurrents (une seule fois). IT0014 est pour les éléments répétitifs sur une période définie.",
    chapter: "ch4"
  },
  {
    id: 22,
    question: "Après validation du calcul de paie, quelle transaction transfère les résultats vers la comptabilité générale ?",
    options: ["PC00_M99_DKON", "PC00_MXX_CEDT", "PC00_MXX_CIPE", "PU01"],
    correctIndex: 2,
    explanation: "PC00_MXX_CIPE (CIPE = Create Posting Run) transfère les charges salariales vers FI/CO, générant les documents comptables. PC00_M99_DKON = virements, PC00_MXX_CEDT = bulletins.",
    chapter: "ch4"
  },
  {
    id: 23,
    question: "La Retroactive Accounting SAP intervient automatiquement quand :",
    options: [
      "Un employé est muté dans un autre pays",
      "Des données ayant un impact sur la paie sont modifiées dans une période déjà clôturée",
      "Le Payroll Control Record est en état 'Payroll Completed'",
      "La paie est lancée en mode simulation"
    ],
    correctIndex: 1,
    explanation: "La Retroactive Accounting se déclenche automatiquement quand des données passées (salaire, absences, etc.) sont modifiées après la clôture. SAP recalcule les différences et les inclut dans la prochaine paie.",
    chapter: "ch4"
  },
  {
    id: 24,
    question: "Quelle transaction permet de simuler la paie sans créer d'enregistrements définitifs ?",
    options: ["PC00_M99_CALC en mode Test", "PU01 Simulation", "PC00_M99_CALC avec flag Simulation", "PUOC_XX"],
    correctIndex: 2,
    explanation: "PC00_M99_CALC avec le flag 'Simulation' activé effectue tous les calculs sans écrire de résultats définitifs. Permet de vérifier l'impact des changements avant validation.",
    chapter: "ch4"
  },
  // Chapitre 5 — Recrutement
  {
    id: 25,
    question: "Dans quel ordre logique se déroule le processus de recrutement classique SAP ?",
    options: [
      "PB20 → PB10 → PB40",
      "PB10 (poste vacant) → PB20 (candidature) → PB40 (transfert employé)",
      "PB40 → PB10 → PB20",
      "PA40 → PB10 → PB20"
    ],
    correctIndex: 1,
    explanation: "Le processus logique est : PB10 (créer poste vacant) → PB20 (recevoir et saisir candidatures) → PB40 (transférer le candidat retenu en employé avec création des Infotypes).",
    chapter: "ch5"
  },
  {
    id: 26,
    question: "Quelle est la principale différence entre un Job (C) et une Position (S) dans SAP OM ?",
    options: [
      "Le Job a un titulaire, la Position est générique",
      "La Position est le poste spécifique dans un service, le Job est le modèle générique réutilisable",
      "Le Job correspond à un contrat de travail, la Position au service",
      "Il n'y a pas de différence fonctionnelle"
    ],
    correctIndex: 1,
    explanation: "Job (C) est le modèle générique (ex: 'Comptable') applicable à plusieurs services. Position (S) est le poste spécifique dans un service précis (ex: 'Comptable Paris - FI'). Une Position 'est décrite par' un Job.",
    chapter: "ch5"
  },
  {
    id: 27,
    question: "Qu'est-ce que la transaction PB40 permet de réaliser ?",
    options: [
      "Créer une annonce de recrutement sur le portail",
      "Saisir une nouvelle candidature",
      "Transférer les données d'un candidat retenu vers les données maîtres employé",
      "Archiver les dossiers de candidature refusés"
    ],
    correctIndex: 2,
    explanation: "PB40 'Transfer to HR Master Data' transfère automatiquement les données saisies pour un candidat (IT4000, IT4002, etc.) vers les Infotypes employé (IT0001, IT0002, etc.).",
    chapter: "ch5"
  },
  {
    id: 28,
    question: "Quelle solution SAP est recommandée pour un nouveau projet de recrutement aujourd'hui ?",
    options: [
      "PA-RC (Recrutement classique on-premise)",
      "SAP SuccessFactors Recruiting (cloud)",
      "Développement spécifique ABAP",
      "SAP E-Recruiting version 3.0"
    ],
    correctIndex: 1,
    explanation: "SAP SuccessFactors Recruiting est la solution recommandée par SAP pour les nouveaux projets. Le recrutement classique PA-RC est en maintenance uniquement et n'évolue plus.",
    chapter: "ch5"
  },
  // Chapitre 6 — Formation et Développement
  {
    id: 29,
    question: "Un formateur doit créer une nouvelle session de formation pour le mois prochain. Quelle transaction utilise-t-il dans T&E Management ?",
    options: ["PSVP", "PSV2", "PSV3", "LSO_RHXCOU0"],
    correctIndex: 1,
    explanation: "PSV2 permet de créer et gérer les sessions de formation (Course instances). PSVP = affichage catalogue, PSV3 = inscriptions, LSO_RHXCOU0 = rapports.",
    chapter: "ch6"
  },
  {
    id: 30,
    question: "Quel Infotype contient les qualifications et certifications d'un employé avec leur niveau de maîtrise ?",
    options: ["IT0023", "IT0024", "IT0130", "IT4002"],
    correctIndex: 1,
    explanation: "IT0024 'Qualifications' est l'Infotype qui stocke les compétences de l'employé avec le niveau atteint et la date d'obtention/d'expiration.",
    chapter: "ch6"
  },
  {
    id: 31,
    question: "Dans une session de calibration des talents, la Nine-Box place un employé en position 'High Performance / Low Potential'. Quelle interprétation est correcte ?",
    options: [
      "Employé à promouvoir en priorité",
      "Employé performant sur son poste actuel mais peu d'évolution vers des responsabilités supérieures",
      "Employé en difficulté devant être licencié",
      "Employé nouvellement embauché"
    ],
    correctIndex: 1,
    explanation: "High Performance / Low Potential indique un 'Solid Performer' efficace sur son poste mais dont le potentiel d'évolution vers des niveaux supérieurs est limité. Objectif : fidéliser et stabiliser.",
    chapter: "ch6"
  },
  {
    id: 32,
    question: "Quelle est la différence entre un Requirement Profile et un Qualification Profile dans SAP OM ?",
    options: [
      "Il n'y a pas de différence",
      "Le Requirement Profile liste les compétences requises pour un Job/Position, le Qualification Profile celles d'un employé",
      "Le Requirement Profile concerne la formation, le Qualification Profile la paie",
      "Le Qualification Profile est pour les managers, le Requirement Profile pour les employés"
    ],
    correctIndex: 1,
    explanation: "Requirement Profile = compétences exigées pour occuper un Job ou une Position (attaché aux objets C ou S). Qualification Profile = compétences réellement détenues par un employé (attaché à l'objet P via IT0024).",
    chapter: "ch6"
  },
  // Chapitre 7 — Clôture et sujets avancés
  {
    id: 33,
    question: "Dans la séquence de clôture mensuelle de paie, quelle étape doit obligatoirement précéder le lancement du calcul ?",
    options: [
      "Génération des bulletins de paie",
      "Validation de la Time Evaluation (RPTIME00)",
      "Posting vers FI/CO",
      "Génération de la DSN"
    ],
    correctIndex: 1,
    explanation: "La Time Evaluation (RPTIME00) doit être validée avant le calcul de paie car la paie lit les résultats du Cluster B2 pour intégrer les données temps (heures sup, primes, absences valorisées).",
    chapter: "ch7"
  },
  {
    id: 34,
    question: "Un groupe français utilise SAP HCM. Quelle déclaration réglementaire mensuelle doit être générée à partir des résultats de paie ?",
    options: ["DADS-U", "DUCS standard", "DSN (Déclaration Sociale Nominative)", "BRC mensuelle"],
    correctIndex: 2,
    explanation: "La DSN (Déclaration Sociale Nominative) est obligatoire en France depuis 2017 pour toutes les entreprises. Elle remplace la DADS-U et est générée mensuellement à partir des résultats de paie SAP.",
    chapter: "ch7"
  },
  {
    id: 35,
    question: "Qu'est-ce que le Concurrent Employment dans SAP HCM ?",
    options: [
      "Deux salariés partageant le même poste",
      "Un employé ayant plusieurs numéros de personnel actifs simultanément dans le même client",
      "Un emploi à temps partiel sur deux sociétés différentes",
      "La gestion des intérimaires et prestataires"
    ],
    correctIndex: 1,
    explanation: "Le Concurrent Employment permet à une même personne physique d'avoir plusieurs numéros de personnel (contrats) actifs simultanément dans le même client SAP, avec une gestion unifiée via un numéro de personne commun.",
    chapter: "ch7"
  },
  {
    id: 36,
    question: "Quelle application SAP Fiori permet à un employé de consulter son bulletin de paie en self-service ?",
    options: ["Time and Attendance", "My Paystubs", "Manage Workforce", "Employee Profile"],
    correctIndex: 1,
    explanation: "'My Paystubs' est l'application Fiori permettant à un employé de consulter et télécharger ses bulletins de paie directement depuis son navigateur ou mobile, sans passer par SA38.",
    chapter: "ch7"
  },
  {
    id: 37,
    question: "L'objet d'autorisation P_ORGIN en SAP HCM contrôle l'accès en fonction de :",
    options: [
      "La transaction SAP uniquement (T-Code)",
      "La combinaison Personnel Area, Employee Group/Subgroup et types d'Infotypes autorisés",
      "Le rôle du manager dans l'arbre OM",
      "La plage de numéros de personnel"
    ],
    correctIndex: 1,
    explanation: "P_ORGIN (Personnel Authorization: Protected) contrôle l'accès aux données RH selon la combinaison de Personnel Area, Personnel Subarea, Employee Group, Employee Subgroup et les Infotypes autorisés en lecture/écriture.",
    chapter: "ch7"
  },
  {
    id: 38,
    question: "Quelle est la stratégie de SAP pour la gestion RH aujourd'hui (SAP HXM) ?",
    options: [
      "Migration totale vers SAP S/4HANA HR sans SuccessFactors",
      "Maintien exclusif du core HCM on-premise sans évolution",
      "Approche hybride : core HCM on-premise pour la paie + extensions SuccessFactors cloud pour les talents",
      "Abandon de la paie locale au profit d'un module paie cloud universel"
    ],
    correctIndex: 2,
    explanation: "SAP HXM (Human Experience Management) est l'approche hybride de SAP : le core HCM on-premise gère la paie et l'administration locale (complexité réglementaire), complété par SuccessFactors pour la gestion des talents et l'expérience employé.",
    chapter: "ch7"
  },
  {
    id: 39,
    question: "Lors de l'archivage des résultats de paie, quelle transaction SAP est utilisée pour gérer les objets d'archivage ?",
    options: ["PA_ARCHIVE directement", "SARA (Archive Administration)", "PC00_M99_ARCH", "SE16 avec sélection cluster"],
    correctIndex: 1,
    explanation: "SARA (Archive Administration) est la transaction centrale SAP pour gérer tous les objets d'archivage, y compris les données HR (PA_ARCHIVE). Elle pilote les phases d'écriture, de suppression et de relecture d'archive.",
    chapter: "ch7"
  },
  {
    id: 40,
    question: "Un employé expatrié travaille 6 mois en France et 6 mois en Allemagne pour le même groupe. Quelle fonctionnalité SAP HCM gère cette situation ?",
    options: [
      "Concurrent Employment",
      "Personnel Transfer simple (IT0001)",
      "Global Employment",
      "Double Infotype 0001"
    ],
    correctIndex: 2,
    explanation: "Le Global Employment gère les situations d'expatriation où un employé travaille dans plusieurs pays. Il permet une gestion distincte de la paie par pays (home/host company) tout en maintenant la cohérence du profil global.",
    chapter: "ch7"
  },
  // ─── Questions complémentaires (41 à 80) ─────────────────
  // Ch1 — Structures (+5)
  { id: 41, chapter: "ch1", question: "L'Enterprise Structure HCM comprend :", options: ["Société + Centre coûts", "Company Code + Personnel Area + Personnel Subarea", "Mandant uniquement", "Plant + Storage Location"], correctIndex: 1, explanation: "L'Enterprise Structure HCM = Company Code (légal) + Personnel Area (PA - site géographique) + Personnel Subarea (PSA - sous-localité avec règles spécifiques : conventions collectives, jours fériés)." },
  { id: 42, chapter: "ch1", question: "Le Personnel Subarea (PSA) :", options: ["Est égal au PA", "Sous-divise le PA pour gérer des règles locales : conventions collectives, calendriers, RPT (Public Holiday Calendar)", "Est facultatif", "Remplace le PA"], correctIndex: 1, explanation: "PSA permet la granularité fine : un PA Paris peut avoir des PSAs avec règles différentes (conv. collective Métallurgie vs Bureaux). Influence calcul paie, gestion temps, autorisations." },
  { id: 43, chapter: "ch1", question: "L'Employee Group définit :", options: ["Le département", "La catégorie générale (1=actif, 2=retraité, 3=externe). Influence l'éligibilité aux schémas de paie et infotypes", "Le centre de coûts", "L'org unit"], correctIndex: 1, explanation: "Employee Group : catégorie générale (1=Active, 2=Retiree, 3=Early Retiree, 9=External). Combiné avec Employee Subgroup, détermine schemas paie applicables et personnels disponibles." },
  { id: 44, chapter: "ch1", question: "L'Employee Subgroup combiné à l'Employee Group :", options: ["N'a aucun impact", "Détermine les caractéristiques détaillées : statut (cadre/non), schéma paie, calendrier de travail, droits congés", "Est uniquement informatif", "Définit le manager"], correctIndex: 1, explanation: "EG/ESG est la pierre angulaire du paramétrage HCM : détermine schémas paie, types d'absences, time management, quotas, infotypes accessibles. Cohabitation EG=1 + ESG=U2 (cadre) ≠ EG=1 + ESG=N1 (non-cadre)." },
  { id: 45, chapter: "ch1", question: "L'Org Management (OM) :", options: ["Est égal à PA", "Modélise la structure organisationnelle : Org Units, Positions, Jobs, Persons. Permet org chart et reporting hiérarchique", "Est obsolète", "Gère uniquement la paie"], correctIndex: 1, explanation: "OM : modèle objet de l'org. Org Units (départements), Positions (postes vacants/occupés), Jobs (description génériques), Persons. Relationships entre objets (S→S manager, S↔O appartient à). PPOME = transaction de gestion." },
  // Ch2 — Personnel Admin (+6)
  { id: 46, chapter: "ch2", question: "Un Infotype dans SAP HCM :", options: ["Est un type de paie", "Est une unité d'information sur un employé (0001 Org Assignment, 0002 Personal Data, 0006 Address, 0008 Pay Basic)", "Est obsolète", "Est un type de contrat"], correctIndex: 1, explanation: "Infotype = unité de données employé. Numéroté (0001 Org Assignment, 0002 Personal Data, 0006 Adresses, 0008 Basic Pay, 2001 Absences). Chaque infotype a son écran de saisie et historisation par dates." },
  { id: 47, chapter: "ch2", question: "Le Personnel Action (Action de personnel) :", options: ["Crée un infotype seul", "Enchaîne plusieurs infotypes pour un événement (Hiring, Termination, Transfer). Garantit cohérence des données", "Est facultatif", "Remplace l'infotype"], correctIndex: 1, explanation: "Personnel Action (PA40) : guide l'utilisateur dans la séquence d'infotypes à mettre à jour pour un événement (Hiring crée 0000+0001+0002+0006+0008+...). Garantit la cohérence et exhaustivité." },
  { id: 48, chapter: "ch2", question: "PA30 vs PA40 :", options: ["Identiques", "PA30 = maintenance d'infotypes individuels. PA40 = exécution d'une Personnel Action multi-infotypes", "PA30 supprime", "PA40 affiche"], correctIndex: 1, explanation: "PA30 (Maintain HR Master Data) : modifier un infotype à la fois. PA40 (Personnel Actions) : exécuter une action complète qui enchaîne plusieurs infotypes selon le type d'action configuré." },
  { id: 49, chapter: "ch2", question: "Le Validity Period (Période de Validité) d'un infotype :", options: ["Est sans intérêt", "Définit dates début/fin de la version de l'infotype. Permet historisation : modification crée nouvelle version, anciennes conservées", "Empêche modification", "Bloque l'employé"], correctIndex: 1, explanation: "Validity Period : tout infotype a Begin/End Date. Modification crée une nouvelle ligne avec nouvelle période. Anciennes versions conservées (audit trail). Critère de sélection lors de la lecture." },
  { id: 50, chapter: "ch2", question: "L'Infotype 0001 (Org Assignment) :", options: ["Données personnelles", "Affecte l'employé à : Company Code, PA, PSA, EG, ESG, Org Unit, Position, Cost Center. Pierre angulaire", "Adresse", "Salaire"], correctIndex: 1, explanation: "IT 0001 = pivot RH/finance/orga. Détermine où l'employé est rattaché légalement (CC), géographiquement (PA), administrativement (EG/ESG), organisationnellement (Org Unit, Position), comptablement (Cost Center)." },
  { id: 51, chapter: "ch2", question: "L'Infotype 0008 (Basic Pay) :", options: ["Adresse", "Stocke le salaire de base + wage types récurrents. Référence du calcul de paie", "Données bancaires", "Absences"], correctIndex: 1, explanation: "IT 0008 = salaire de base et éléments récurrents (primes fixes, indemnités). Wage Types (M001 Salaire base, M120 13ème mois, etc.). Référence pour calcul paie. Mise à jour lors de promotions, augmentations." },
  // Ch3 — Time Management (+6)
  { id: 52, chapter: "ch3", question: "Le Work Schedule Rule (Règle d'horaire de travail) :", options: ["Est égale au calendrier", "Définit le planning de travail récurrent : nb heures/jour, jours travaillés, pauses. Codée par EG/ESG/PSA", "Est obsolète", "Définit la paie"], correctIndex: 1, explanation: "Work Schedule Rule : génère le planning théorique de travail. Combine Daily Work Schedule (heures/pauses) + Period Work Schedule (rotation jours). Codée pour chaque population (cadres jour, équipes 3x8, etc.)." },
  { id: 53, chapter: "ch3", question: "L'Infotype 2001 (Absences) :", options: ["Salaire", "Saisit les absences : type (CP, RTT, maladie), dates, jours impactés. Décompte automatique sur les Quotas", "Adresse", "Org assignment"], correctIndex: 1, explanation: "IT 2001 enregistre les absences avec leur type. SAP calcule l'impact sur le planning et déduit automatiquement les jours du Quota correspondant (IT 2006 Absence Quota). Cohérence garantie." },
  { id: 54, chapter: "ch3", question: "L'Absence Quota (Quota d'absence, IT 2006) :", options: ["Est égal aux heures supp", "Stocke les droits à absence : congés payés acquis, RTT, autres. Mis à jour automatiquement par la génération de quotas", "Bloque les absences", "Est manuel"], correctIndex: 1, explanation: "IT 2006 = compteur de droits à absence. Pour chaque type (CP, RTT) : solde au début, droits acquis, déductions, solde restant. Régénéré périodiquement par programmes batch." },
  { id: 55, chapter: "ch3", question: "Le Time Evaluation (Évaluation du Temps, RPTIME00) :", options: ["Est manuel", "Programme qui évalue les temps saisis (pointages, absences) par rapport au planning théorique. Calcule heures sup, déduit absences, met à jour quotas", "Crée des employés", "Lance la paie"], correctIndex: 1, explanation: "RPTIME00 (Time Evaluation) : moteur de calcul des temps. Compare réel vs théorique, génère les Time Wage Types (heures normales, sup, malus). Alimente la paie. Configurable par schéma de temps (TM00, TM04 selon population)." },
  { id: 56, chapter: "ch3", question: "Le Public Holiday Calendar (RPT) :", options: ["Inutilisé", "Défini par PSA/Pays. Liste les jours fériés pris en compte par la Time Evaluation pour ne pas compter ces jours comme travaillés", "Est égal au calendrier paie", "Est obsolète"], correctIndex: 1, explanation: "Holiday Calendar : référentiel jours fériés. Affecté par PSA. Time Evaluation l'utilise pour exclure jours fériés du planning théorique et appliquer les majorations salariales correspondantes (jour férié travaillé)." },
  { id: 57, chapter: "ch3", question: "Une Substitution (Substitution de planning, IT 2003) :", options: ["Remplace l'employé", "Modifie temporairement le planning d'un employé pour un évènement (changement équipe, surcroît activité)", "Lance la paie", "Crée une absence"], correctIndex: 1, explanation: "Substitution (IT 2003) : modification ponctuelle du Work Schedule (changement équipe pour 1 semaine). Évite de modifier la règle d'horaire en permanence. Propagée à la Time Evaluation pour calcul correct." },
  // Ch4 — Payroll (+6)
  { id: 58, chapter: "ch4", question: "Le Payroll Driver (Programme de paie) :", options: ["Saisit la paie", "Programme spécifique au pays (RPCALCx0 — RPCALCF0 France, RPCALCD0 Allemagne) qui exécute le calcul de paie", "Crée employé", "Affiche bulletin"], correctIndex: 1, explanation: "Payroll Driver = moteur de calcul de paie. Spécifique au pays (RPCALCF0 France, RPCALCD0 Allemagne, RPCALCG0 Grande-Bretagne). Lit IT 0008, applique le schéma de paie, génère les résultats (RT, CRT)." },
  { id: 59, chapter: "ch4", question: "Le Payroll Schema (Schéma de Paie) :", options: ["Liste des employés", "Suite ordonnée d'instructions (functions et PCRs) qui calcule la paie. Spécifique au pays. Modifiable via PE01", "Bulletin de paie", "Calendrier"], correctIndex: 1, explanation: "Payroll Schema (ex: F000 France) : structure de calcul, séquence d'opérations. Inclut PCRs (Personnel Calculation Rules) qui appliquent les règles métier. Customisable mais complexe — nécessite consultant paie expert." },
  { id: 60, chapter: "ch4", question: "Une PCR (Personnel Calculation Rule) :", options: ["Est obsolète", "Règle de calcul micro dans le schéma : 'Si IT-statut = X alors WT-Y = Z'. Logique conditionnelle de calcul", "Liste règles", "Calcule TVA"], correctIndex: 1, explanation: "PCR = règle de calcul atomique. Syntaxe basée sur opérations (ADDDB, MULTI, RTE). Exemple : 'Si jour férié alors heure normale × 2 = WT prime férié'. Construit la logique métier complexe par briques." },
  { id: 61, chapter: "ch4", question: "Le Wage Type (Type de Salaire) :", options: ["Égal au compte GL", "Élément de paie : un montant + une catégorie. Standard (M001=salaire base) ou customisé (Z*). Stocké dans Results Table (RT)", "Est l'IBAN", "Est l'employé"], correctIndex: 1, explanation: "Wage Type = chaque élément qui compose la paie : salaire base, primes, retenues, cotisations. Numéroté (M001, M120) ou customisé (Z*). Stocké en RT (Results Table) après calcul. Cumulé en CRT (Cumulated)." },
  { id: 62, chapter: "ch4", question: "Le Cluster (Cluster de Paie) PCL2/PCL4 :", options: ["Cluster de serveurs", "Tables de stockage des résultats de paie : PCL2 (RT, BT, CRT) et PCL4 (modifications). Format binaire optimisé", "Inutile", "Liste employés"], correctIndex: 1, explanation: "PCL2 contient les résultats de paie (RT - Results Table avec wage types, BT - Bank Transfer, CRT - Cumulated Results). PCL4 trace les changements. Format binaire (cluster) — accès via PC00_M99_CIPC ou PC_PAYRESULT." },
  { id: 63, chapter: "ch4", question: "La Payroll Area (Zone de Paie) :", options: ["Égal au PA", "Regroupe les employés payés ensemble selon même périodicité et calendrier (mensuels, hebdo). Pilote la planification du run paie", "Est obsolète", "Égal à Company Code"], correctIndex: 1, explanation: "Payroll Area : groupe d'employés payés simultanément (Mensuels Cadres, Hebdo Ouvriers). Détermine la période de paie courante, le calendrier de paie. Run de paie déclenché par Payroll Area." },
  // Ch5 — Talent Management / Org (+4)
  { id: 64, chapter: "ch5", question: "Le Talent Management Suite SAP :", options: ["Égal à HCM", "Module dédié : Recruiting (e-Recruiting/SuccessFactors), Performance, Learning, Compensation, Succession Planning", "Inexistant", "Égal à OM"], correctIndex: 1, explanation: "Talent Management = couvre tout le cycle de vie talent : Recruitment (sourcing→hire), Performance Management (objectifs, reviews), Learning Management (formations), Compensation (revues salariales), Succession (plans relève). Souvent SuccessFactors en cloud." },
  { id: 65, chapter: "ch5", question: "Job vs Position vs Person :", options: ["Identiques", "Job = description générique (ex: 'Software Engineer'). Position = poste réel (ex: 'SE Marketing #2'). Person = personne occupant la position", "Job paye", "Position obsolète"], correctIndex: 1, explanation: "Hiérarchie OM : Job (modèle générique avec compétences requises) → Position (instance précise rattachée à Org Unit) → Person (l'employé occupant la Position). Permet planification stratégique : 'on a 50 SE jobs, 45 occupied'." },
  { id: 66, chapter: "ch5", question: "PPOME / PPOM_OLD :", options: ["Programmes de paie", "Transactions Org Management : modèle visuel de l'organisation, création d'Org Units, Positions, relations", "Sont obsolètes", "Listent employés"], correctIndex: 1, explanation: "PPOME (Manage Organization and Staffing) : interface graphique drag-and-drop pour modifier l'org. PPOM_OLD : version classique. Permet création/modification Org Units, Positions, affectation Persons." },
  { id: 67, chapter: "ch5", question: "L'Authorization Profile en HCM :", options: ["Égal au rôle GL", "Gère l'accès aux données employés sensibles : autorisation par PA/PSA, par EG/ESG, par infotype. Critique RGPD", "Est inutilisé", "Égal au login"], correctIndex: 1, explanation: "Authorization Profile HCM : configuration fine. Authorization Object P_ORGIN (PA/PSA), P_PERNR (mes employés), P_INFO_T (infotypes). Critique pour RGPD : un manager ne doit voir que ses subordonnés directs, pas la paie de l'org entière." },
  // Ch6 — Reporting (+5)
  { id: 68, chapter: "ch6", question: "Le Logical Database PNP en HCM :", options: ["Inexistante", "Base logique pour reporting HCM. Sélection par PA/PSA/employee group/period. Utilisée par les rapports SAP standards (RPLMIT00 etc.)", "Est SQL natif", "Obsolète"], correctIndex: 1, explanation: "Logical Database PNP : abstraction qui simplifie l'accès aux données HCM dans les programmes ABAP. Filtre automatique selon période, autorisations. Tous les rapports HCM standards (RPL*, RPP*) y sont basés." },
  { id: 69, chapter: "ch6", question: "L'application Fiori 'My Inbox' pour les managers :", options: ["Mail interne", "Approuve les demandes RH (congés, modifs employés) avec workflow SAP. Selon délégation", "Lance la paie", "Stocke les données"], correctIndex: 1, explanation: "My Inbox / SAP Fiori : workflow centralisé. Manager voit demandes en attente d'approbation (CP/RTT, modifs adresse, demandes formation). Approve/reject mobile-friendly. Workflow ESS/MSS." },
  { id: 70, chapter: "ch6", question: "ESS/MSS (Employee/Manager Self-Service) :", options: ["Obsolète", "Portail self-service : ESS pour employés (saisie congés, modif adresse, accès bulletins). MSS pour managers (approbation, reporting équipe)", "Inutile", "Égal à PA30"], correctIndex: 1, explanation: "ESS = Employee Self-Service (saisie autonome employé : adresse, congé, bénéfices). MSS = Manager Self-Service (gestion équipe : approbation absences, augmentations, reporting). Réduit charge admin RH ~50%." },
  { id: 71, chapter: "ch6", question: "Le Reporting standard HCM :", options: ["Lancé manuellement", "Programmes RPL* (lists), RPP* (payroll reporting), RPT* (time). Variants pour standardiser, ALV pour interactivité", "Inexistant", "Obsolète"], correctIndex: 1, explanation: "Conventions de nommage : RPL* (List Reports HR Master Data), RPP* (Payroll), RPT* (Time). Output ALV interactif (tri, filtre, export Excel). Variants permettent de sauvegarder critères de sélection récurrents." },
  { id: 72, chapter: "ch6", question: "Les KPIs RH dans S/4HANA :", options: ["Inexistants", "Apps Fiori 'HR Analytics' : turnover rate, time-to-hire, headcount, absentéisme. Real-time depuis SuccessFactors si intégré", "Manuel uniquement", "Excel seulement"], correctIndex: 1, explanation: "Apps Fiori HR Analytics S/4HANA + SuccessFactors People Analytics : KPIs temps réel (turnover, time-to-hire, training completion, headcount evolution). Powered by HANA pour calcul instantané." },
  // Ch7 — Compliance / Global (+8)
  { id: 73, chapter: "ch7", question: "Le RGPD impacte HCM par :", options: ["N'a pas d'impact", "Obligation : minimisation données, durée de conservation limitée, droit accès/effacement. Configuration retention policy", "Augmente la sécurité auto", "Égal à RPSEC"], correctIndex: 1, explanation: "RGPD HCM : conserver uniquement données nécessaires, durée limitée (souvent 5 ans après départ), droit d'accès (export profil), droit à l'effacement, registres de traitement. Configuration ILM (Information Lifecycle Management)." },
  { id: 74, chapter: "ch7", question: "Le Global Employment :", options: ["Obsolète", "Gère les expatriés / employés multi-pays : home/host company, contrats parallèles, paie distincte par pays mais profil unifié", "Égal à PA", "Limité au siège"], correctIndex: 1, explanation: "Global Employment : un même employé peut être 'envoyé' dans une autre société/pays. Home Company (origine) garde le contrat principal, Host Company gère localement. Paies distinctes mais profil personnel unique." },
  { id: 75, chapter: "ch7", question: "L'audit de paie (Payroll Audit) :", options: ["Inutile", "Vérifie : conformité réglementaire, exactitude des calculs, séparation des tâches (SOX-compliance), traçabilité changements infotypes", "Manuel uniquement", "Égal à reporting"], correctIndex: 1, explanation: "Payroll Audit : régulier (interne) et externe (commissaires aux comptes). Vérifie SOX : qui peut modifier IT 0008 ? Logs des changements ? Réconciliation paie ↔ FI ? Mise à jour des taux fiscaux ? Cumulés cotisations correctes ?" },
  { id: 76, chapter: "ch7", question: "L'intégration HCM ↔ FI :", options: ["Manuelle", "Programme RPCIPE00 / Posting Run : la paie génère les écritures comptables (charges, dettes sociales). Selon les Wage Types et leur compte GL", "Inexistante", "Limitée au reporting"], correctIndex: 1, explanation: "Posting Run (PC00_M99_CIPE) : génère les écritures FI à partir des résultats de paie. Mapping Wage Type → Compte GL. Charges salariales sur compte 64*, charges sociales sur 645*, dettes sur 421*/431*. Posté en GL." },
  { id: 77, chapter: "ch7", question: "Le Time Sheet (CATS) :", options: ["Saisie manuelle de paie", "Cross-Application Time Sheet : saisie centralisée des temps par les employés (projets, ordres). Alimente Time Mgmt + CO + PS", "Obsolète", "Limité aux cadres"], correctIndex: 1, explanation: "CATS : saisie unifiée des temps. L'employé impute heures sur projets (PS), ordres (CO), centres de coûts. Alimente HCM Time Mgmt + CO (réimputation analytique) + PS (suivi projet). Apps Fiori 'My Timesheet' simplifient la saisie." },
  { id: 78, chapter: "ch7", question: "Le Personnel Cost Planning (PCP) :", options: ["Inutilisé", "Planifie les coûts de personnel futurs : prévision masse salariale, simulation augmentations, comparaison budget vs réel. Outil HRP", "Égal à BPC", "Obsolète"], correctIndex: 1, explanation: "PCP : module HCM-PCP. Planification budgétaire RH : simulation hausse de 3%, intégration nouveaux embauchés, prévision charges sociales, comparaison budget vs réel. Sortie : intégration BPC ou rapports CO." },
  { id: 79, chapter: "ch7", question: "Le passage HCM → SuccessFactors :", options: ["Pas de migration possible", "Stratégie SAP : core HR migré vers SuccessFactors Cloud (Employee Central). Hybride avec on-prem possible (replication via SAP-CPI)", "HCM disparaît demain", "Obligatoire"], correctIndex: 1, explanation: "Roadmap SAP : SuccessFactors Employee Central remplace progressivement HCM on-prem pour le Core HR. Hybride courant : core HR sur SuccessFactors, paie reste on-prem (ECP - Employee Central Payroll), réplication via SAP CPI." },
  { id: 80, chapter: "ch7", question: "L'employee lifecycle (Cycle de vie employé) :", options: ["Limité au recrutement", "Hire → Onboarding → Performance → Development → Compensation → Off-boarding. Couvre par Talent Management + Personnel Admin", "Égal à la paie", "Manuel"], correctIndex: 1, explanation: "Employee Lifecycle complet : Hire (recrutement) → Onboarding (intégration) → Performance (évaluation continue) → Development (formation, promotion) → Compensation (révision salariale) → Off-boarding (départ ordonné). Couvert par modules Talent Management + Personnel Admin + ESS/MSS." }
];
