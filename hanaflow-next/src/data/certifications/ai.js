/**
 * Contenu de la certification C_AIG_2404
 * SAP Certified Associate – Generative AI Developer
 *
 * Structure :
 * - 5 chapitres couvrant 100% du périmètre de l'examen officiel
 * - Leçons avec contenu pédagogique, concepts clés, outils SAP
 * - Quiz de chapitre
 * - 30 questions pour le simulateur d'examen
 *
 * Périmètre officiel (sap.com/learning) :
 *  - SAP AI Core & SAP AI Launchpad (~30 %)
 *  - LLM fundamentals & prompt engineering (~25 %)
 *  - Joule architecture & integration S/4HANA (~20 %)
 *  - RAG, embeddings, vector stores (~15 %)
 *  - Responsible AI, ethics, governance (~10 %)
 */

export const aiCertification = {
  id: "c-aig-2404",
  code: "C_AIG_2404",
  name: "SAP Certified Associate – Generative AI Developer",
  shortName: "SAP Generative AI Developer",
  level: "Associate",
  examDuration: 120,        // minutes (examen réel, format pratique)
  examQuestions: 60,
  simulatorQuestions: 30,
  passingScore: 65,
  officialLink: "https://learning.sap.com/certifications/sap-certified-associate-sap-generative-ai-developer",
  color: "from-violet-600 via-purple-700 to-fuchsia-700",

  chapters: [
    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 1 — Fondamentaux IA Générative & LLMs
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch1",
      title: "Fondamentaux IA Générative & LLMs",
      isPremium: false,
      lessons: [
        {
          id: "l1-1",
          title: "Anatomie d'un LLM",
          content: `Un **Large Language Model (LLM)** est un réseau de neurones profond entraîné sur d'énormes corpus de texte pour prédire le prochain token étant donné un contexte. C'est la fondation de toute l'IA générative moderne (GPT, Claude, Gemini, Llama, Mistral).

**Architecture Transformer** : tous les LLMs production utilisent l'architecture Transformer (introduite par Google en 2017). Composants clés :
- **Tokens** : unités de texte (≈ ¾ de mot en moyenne). "Tokenization" = découpage du texte en tokens.
- **Embeddings** : chaque token est converti en vecteur de dimension fixe (768, 1536, 3072…). C'est l'espace où la similarité sémantique devient mesurable.
- **Attention** : mécanisme qui pondère l'influence de chaque token précédent sur la prédiction du suivant.
- **Layers** : empilement de blocs Transformer (12, 32, 96+ couches selon la taille du modèle).

**Modes d'inférence** :
- **Completion / chat** : générer une réponse à partir d'un prompt
- **Embedding** : extraire la représentation vectorielle d'un texte (RAG, recherche, classification)
- **Function/tool calling** : générer un appel structuré vers une API externe

**Limites fondamentales** :
- **Hallucinations** : le LLM invente des faits convaincants. C'est inhérent au modèle statistique — il prédit ce qui est plausible, pas ce qui est vrai.
- **Context window** : limité (32K, 128K, 1M tokens selon le modèle). Au-delà, le modèle "oublie" le début.
- **Cutoff date** : connaissance figée à la date d'entraînement. D'où l'intérêt de RAG.`
        },
        {
          id: "l1-2",
          title: "Embeddings et espace sémantique",
          content: `Un **embedding** est un vecteur numérique de dimension fixe qui représente le sens d'un texte. C'est le pont entre langage et géométrie : des phrases qui parlent du même sujet ont des vecteurs proches dans l'espace.

**Modèles d'embedding courants** :
- OpenAI text-embedding-3-small (1536 dim) / text-embedding-3-large (3072 dim)
- Google text-embedding-004 (768 dim)
- Cohere embed-multilingual-v3 (1024 dim)
- Sentence-Transformers all-MiniLM-L6-v2 (384 dim, open-source)

**Mesure de similarité** : cosine similarity. Score entre -1 et 1. > 0.8 = très similaire, < 0.3 = peu lié.

**Use cases** :
- **Recherche sémantique** : "Comment configurer FI ?" trouve "Tutoriel paramétrage Financial Accounting" même sans match exact
- **Classification** : assigner un texte à la catégorie dont les exemples sont les plus proches
- **Clustering** : grouper des documents par similarité
- **RAG** : récupérer les passages pertinents pour répondre à une question

**Stockage** : les embeddings vivent dans des **vector stores** (Pinecone, Weaviate, Qdrant, pgvector). Indexation HNSW ou IVF pour la recherche approximative rapide à grande échelle.

**Côté SAP** : SAP HANA Cloud Vector Engine permet de stocker et chercher des embeddings directement dans la base SAP (pas besoin de vector DB séparée).`
        },
        {
          id: "l1-3",
          title: "Tokenization et coût d'inférence",
          content: `La **tokenization** détermine combien coûte un appel LLM en argent et en latence.

**Règles de pouce** :
- 1 token ≈ 4 caractères en anglais
- 1 token ≈ 3-5 caractères en français (un peu plus dense)
- 1 000 tokens ≈ 750 mots ≈ 1 page A4
- Le code source = plus de tokens par caractère (caractères spéciaux, indentation)

**Pricing typique** (free tier + paid en 2026) :
- Gemini Flash : ~$0.075 / 1M input, ~$0.30 / 1M output
- GPT-4o-mini : ~$0.15 / 1M input, ~$0.60 / 1M output
- Claude Haiku 4.5 : ~$0.25 / 1M input, ~$1.25 / 1M output

**Optimisations** :
- **Prompt caching** : les providers cachent un préfixe stable (system + tools). Re-demander avec le même préfixe coûte ~10x moins cher.
- **Compression** : retirer les exemples redondants, raccourcir les noms de variables, utiliser des abréviations dans le prompt
- **Structured output** : forcer un JSON court plutôt qu'un texte libre verbeux
- **Streaming** : ne change pas le coût mais améliore la latence perçue`,
        },
      ],
      quiz: [
        { id: "q1-1", question: "Quel est le rôle des embeddings dans un système RAG ?", options: ["Stocker les réponses générées", "Représenter le sens des textes sous forme de vecteurs", "Compresser le modèle LLM", "Chiffrer les données utilisateur"], correctIndex: 1, explanation: "Les embeddings transforment le texte en vecteurs numériques. La similarité cosinus entre vecteurs mesure la proximité sémantique, ce qui permet la recherche par sens dans le RAG." },
        { id: "q1-2", question: "Qu'est-ce qu'une hallucination en IA générative ?", options: ["Une panne du modèle", "Le modèle invente des faits convaincants mais faux", "Une censure automatique", "Un dépassement de tokens"], correctIndex: 1, explanation: "Les hallucinations sont inhérentes aux LLMs : ils prédisent ce qui est statistiquement plausible, pas ce qui est vrai. RAG et grounding aident à réduire le risque." },
        { id: "q1-3", question: "Combien de tokens représentent environ 750 mots en français ?", options: ["~250", "~500", "~1000", "~3000"], correctIndex: 2, explanation: "Règle de pouce : 1 token ≈ 4 caractères en anglais, un peu plus en français. 750 mots ≈ 1 000 tokens." },
        { id: "q1-4", question: "Qu'est-ce qui distingue le mode 'embedding' du mode 'completion' d'un LLM ?", options: ["Embedding = pas de génération, extraction vectorielle uniquement ; completion = génération de texte", "Aucune différence", "Embedding produit des images", "Completion utilise plus de paramètres"], correctIndex: 0, explanation: "Le mode embedding renvoie un vecteur de représentation, pas du texte. C'est utilisé pour la recherche sémantique, le clustering et le RAG." },
        { id: "q1-5", question: "Que stocke SAP HANA Cloud Vector Engine ?", options: ["Des fichiers vidéo", "Des embeddings et permet la recherche par similarité", "Des sauvegardes incrémentales", "Des logs applicatifs"], correctIndex: 1, explanation: "SAP HANA Cloud Vector Engine est l'intégration native de stockage et recherche de vecteurs dans HANA, évitant le besoin d'une vector DB tierce." }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 2 — SAP AI Core & SAP AI Launchpad
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch2",
      title: "SAP AI Core & SAP AI Launchpad",
      isPremium: true,
      lessons: [
        {
          id: "l2-1",
          title: "Architecture SAP AI Core",
          content: `**SAP AI Core** est le runtime d'exécution des workloads IA dans SAP BTP (Business Technology Platform). Il fournit l'infrastructure, l'orchestration et la gouvernance.

**Concepts clés** :
- **Resource Group** : isolation logique des ressources (un par projet ou par tenant)
- **Scenario** : définition d'un cas d'usage IA (training, serving, fine-tuning)
- **Executable** : référence à un container Docker exécutant le code IA
- **Configuration** : combinaison Scenario + Executable + paramètres
- **Deployment** : instance live d'une configuration (URL servable)
- **Execution** : run unique d'un training (≠ deployment qui est persistant)

**Generative AI Hub** (intégré à AI Core) : couche d'abstraction unifiée qui expose les LLMs des principaux fournisseurs (OpenAI Azure, Google Vertex, AWS Bedrock, Anthropic, et modèles open-source) avec une seule API et facturation centralisée.

**SDK** : sap-ai-sdk (JavaScript/TypeScript), sap-genai-hub-sdk (Python). Permet d'appeler les LLMs depuis une app sans gérer les clés provider directement.`
        },
        {
          id: "l2-2",
          title: "SAP AI Launchpad",
          content: `**SAP AI Launchpad** est l'interface web unifiée pour gérer le cycle de vie complet des modèles IA. Pendant AI Core fournit le runtime, Launchpad fournit l'UX de gouvernance.

**Modules principaux** :
- **ML Operations** : suivi des deployments, métriques, logs, alerts
- **Generative AI Hub** : playground pour tester les prompts sur différents modèles, gestion des **Prompt Templates** et **Orchestration Pipelines**
- **AI API Connections** : gestion des resource groups et clés provider
- **Workspaces** : isolation par équipe/projet

**Prompt Templates** : système de gestion versionnée des prompts (équivalent à git pour les prompts). Permet le déploiement contrôlé, A/B testing, rollback.

**Orchestration** : pipelines no-code pour chaîner LLM + RAG + content filter + masquage de données + grounding. Au lieu de coder cette logique dans l'app, on la déclare dans Launchpad.

**Observability** : tous les appels LLM sont tracés (input, output, tokens, coût, latence). Indispensable pour le ROI et la sécurité.`
        },
        {
          id: "l2-3",
          title: "Déploiement d'un modèle générique via AI Core",
          content: `Flow type pour exposer GPT-4 dans une app SAP via AI Core :

**1. Provisionner AI Core dans BTP** : sub-account → service "ai-core" → plan extended (génératif).

**2. Créer un Resource Group** dans AI Core (ex: "production").

**3. Configurer la connexion provider** : ajouter la clé API OpenAI (ou Anthropic, Google) au resource group via Launchpad → Generative AI Hub.

**4. Créer une Configuration** sur le scénario "foundation-models" pointant vers le modèle souhaité (ex: gpt-4o, claude-3-5-sonnet).

**5. Déployer** : Launchpad génère une URL stable du type \`https://api.ai.<region>.hana.ondemand.com/v2/inference/deployments/<id>/chat/completions\`.

**6. Consommer depuis l'app** : SDK ou REST direct. Auth via XSUAA (JWT BTP) — pas de clé API en clair dans le code app.

**Avantages vs appel direct provider** :
- Facturation centralisée par SAP (un seul contrat)
- Audit & compliance (logs centralisés)
- Switch provider sans changer le code app (Generative AI Hub abstrait l'interface)
- Quotas par resource group
- Data residency dans le tenant BTP`
        },
      ],
      quiz: [
        { id: "q2-1", question: "Quel composant de SAP AI Core sert d'instance live d'un modèle servable ?", options: ["Resource Group", "Scenario", "Executable", "Deployment"], correctIndex: 3, explanation: "Le Deployment est l'instance live d'une Configuration. Il expose une URL et consomme des ressources en continu, contrairement à l'Execution qui est un run unique." },
        { id: "q2-2", question: "À quoi sert le Generative AI Hub dans SAP AI Core ?", options: ["Stocker les fichiers utilisateur", "Abstraire les LLMs de plusieurs providers derrière une API unique avec facturation centralisée", "Compiler du code ABAP", "Authentifier les utilisateurs BTP"], correctIndex: 1, explanation: "Generative AI Hub est une couche d'abstraction qui expose les LLMs (OpenAI, Google, Anthropic, open-source) via une API unifiée. SAP facture, audite et gouverne pour le client." },
        { id: "q2-3", question: "Dans SAP AI Launchpad, à quoi servent les Prompt Templates ?", options: ["Stocker les credentials provider", "Gérer les prompts de manière versionnée avec déploiement contrôlé", "Compiler le code Python", "Backup automatique"], correctIndex: 1, explanation: "Les Prompt Templates sont un système de gestion versionnée des prompts (similaire à git). Ils permettent A/B testing, déploiement progressif et rollback." },
        { id: "q2-4", question: "Quelle authentification est utilisée pour appeler un deployment AI Core depuis une app BTP ?", options: ["Basic Auth", "API Key statique", "JWT XSUAA", "OAuth1"], correctIndex: 2, explanation: "Les apps BTP utilisent XSUAA (la solution OAuth2/JWT de SAP). Aucune clé API n'apparaît dans le code app — la sécurité passe par le tenant BTP." },
        { id: "q2-5", question: "Quel objet AI Core isole les ressources d'un projet ou tenant ?", options: ["Deployment", "Resource Group", "Executable", "Scenario"], correctIndex: 1, explanation: "Le Resource Group isole logiquement les ressources (configurations, deployments, connexions provider). Pattern classique : un par projet ou par tenant client." }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 3 — Joule architecture & intégration S/4HANA
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch3",
      title: "Joule architecture & intégration S/4HANA",
      isPremium: true,
      lessons: [
        {
          id: "l3-1",
          title: "Qu'est-ce que Joule ?",
          content: `**Joule** est le copilote IA conversationnel intégré au portfolio SAP. Lancé en septembre 2023, déployé en GA progressive dans S/4HANA Cloud, SuccessFactors, Ariba, Concur, et Business AI.

**Différenciateurs vs ChatGPT/Copilot** :
- **Context-aware** : Joule connaît l'utilisateur connecté, son rôle, son entreprise, ses données S/4HANA
- **Action capability** : Joule peut exécuter des transactions (créer une PO, mettre à jour un master data) avec confirmation utilisateur
- **Vendor-grounded** : les réponses sont ancrées dans les docs SAP officielles et les données du tenant client
- **Compliance-by-design** : pas de data leak vers les modèles externes, audit complet, respect data residency

**Personas de Joule** :
- **Joule for end-users** : copilote business dans S/4HANA Cloud (créer une vente, regarder un KPI…)
- **Joule for developers** : assistant code dans ADT (ABAP Development Tools) et SAP Build — équivalent SAP de GitHub Copilot
- **Joule for admins** : copilote opérationnel pour configuration, monitoring, troubleshooting système`
        },
        {
          id: "l3-2",
          title: "Architecture technique de Joule",
          content: `Joule n'est pas un modèle propriétaire — c'est une **couche d'orchestration** au-dessus de plusieurs LLMs externes (Google, OpenAI Azure, Anthropic).

**Stack** :
1. **UI Layer** : widget chat dans S/4HANA / Fiori launchpad
2. **Joule Service** : orchestrateur côté BTP qui parse l'intent
3. **AI Core / Generative AI Hub** : appelle le LLM approprié selon la tâche
4. **Skill Engine** : exécute les actions (transactions SAP, recherches, RAG sur docs SAP)
5. **Grounding Service** : injecte le contexte tenant (rôle user, master data, permissions)
6. **Audit & Compliance** : log centralisé, masquage PII

**Skills** : chaque capacité métier est packagée en "skill" (ex: "create-sales-order", "get-aged-payables-report"). Les skills sont sécurisées par les autorisations standard S/4HANA — un user ne peut faire via Joule que ce qu'il peut déjà faire via Fiori.

**Custom Skills** : depuis Q4 2024, les clients peuvent créer leurs propres skills via SAP Build et les exposer dans Joule. Permet d'étendre le copilote au métier spécifique d'un client.`
        },
        {
          id: "l3-3",
          title: "Intégration Joule × S/4HANA",
          content: `Joule est exposé dans S/4HANA Cloud Public Edition GA depuis Q4 2024, et dans Private Edition en GA depuis 2025.

**Use cases business prouvés** :
- **Finance** : "Quel est mon DSO ce mois-ci ?", "Génère un rapport de clôture FI pour mars"
- **Sales** : "Crée une commande client pour Renault, produit 1000 unités SKU-123", "Quel client a la plus grosse créance en retard ?"
- **Procurement** : "Compare les 3 derniers prix d'achat de l'article MAT-001 chez nos fournisseurs"
- **HR** : "Quels sont les congés en attente dans mon équipe ?", "Programme l'entretien annuel de Sophie Dupont"

**Prérequis technique** : un tenant BTP avec AI Core (extended plan) lié au tenant S/4HANA. Activation par licence SAP — pas free.

**Limitations actuelles** (2026) :
- Pas de support multi-tenant complet en Private Edition
- Custom Skills uniquement via SAP Build (pas de SDK générique)
- Pas de support full-voice (typing only)

**Sécurité** : Joule respecte les autorisations PFCG et les Field-Level Security S/4HANA. Une question qui retournerait des données auxquelles l'user n'a pas accès renvoie "Désolé, tu n'as pas l'autorisation".`
        },
      ],
      quiz: [
        { id: "q3-1", question: "Joule est-il un modèle LLM propriétaire SAP ?", options: ["Oui, entraîné from scratch par SAP", "Non, c'est une couche d'orchestration au-dessus de LLMs externes (Google, OpenAI Azure, Anthropic)", "C'est un fork de Llama", "C'est un fine-tune de GPT-4"], correctIndex: 1, explanation: "Joule est une couche d'orchestration. Le calcul est délégué à des LLMs externes via Generative AI Hub. La valeur SAP est dans le contexte, l'action, la sécurité et l'audit." },
        { id: "q3-2", question: "Qu'est-ce qu'une 'Skill' dans Joule ?", options: ["Un fichier de configuration", "Une capacité métier exécutable (créer une PO, sortir un rapport…), packagée et soumise aux autorisations SAP standard", "Un type de licence", "Un format de PDF"], correctIndex: 1, explanation: "Une Skill encapsule une action concrète. Elle est gouvernée par les autorisations PFCG : Joule ne peut faire que ce que l'utilisateur peut déjà faire dans Fiori." },
        { id: "q3-3", question: "Quel persona Joule cible les développeurs ABAP ?", options: ["Joule for end-users", "Joule for developers (assistant code dans ADT et SAP Build)", "Joule for admins", "Aucun"], correctIndex: 1, explanation: "Joule for developers est le pendant SAP de GitHub Copilot : suggestions de code ABAP, refactoring, génération de tests dans ADT et SAP Build." },
        { id: "q3-4", question: "Comment Joule respecte-t-il les autorisations utilisateur ?", options: ["Toutes les données sont accessibles", "Via les autorisations PFCG et Field-Level Security standard S/4HANA", "Via un système IAM séparé", "Via une whitelist de mots-clés"], correctIndex: 1, explanation: "Joule applique exactement le même modèle d'autorisation que Fiori. Si l'user ne peut pas voir un champ via la transaction, Joule ne peut pas non plus." },
        { id: "q3-5", question: "Quel composant injecte le contexte tenant (rôle user, master data) dans les prompts Joule ?", options: ["AI Launchpad", "Le Grounding Service", "Le Skill Engine", "ABAP RAP"], correctIndex: 1, explanation: "Le Grounding Service est responsable d'enrichir le prompt avec les données contextuelles du tenant. C'est ce qui rend Joule different d'un chatbot générique." }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 4 — RAG, embeddings, vector stores
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch4",
      title: "RAG, embeddings et vector stores",
      isPremium: true,
      lessons: [
        {
          id: "l4-1",
          title: "Pipeline RAG complet",
          content: `**RAG (Retrieval Augmented Generation)** = injecter du contexte récupéré d'une base de connaissances dans le prompt d'un LLM. Résout le problème du cutoff et des hallucinations en ancrant les réponses sur des sources vérifiables.

**Pipeline standard** (ingestion + query) :

**Ingestion (one-shot ou incrémental)** :
1. **Loaders** : extraction du texte depuis PDF, HTML, Word, Markdown, Confluence…
2. **Chunking** : découpe en passages de ~500-1500 tokens avec un overlap de 10-20 % pour préserver le contexte
3. **Embedding** : chaque chunk passé à un modèle d'embedding (text-embedding-3-small, text-embedding-004…)
4. **Indexing** : vecteurs stockés dans le vector store avec leur metadata (source, page, date, permissions)

**Query (à chaque question user)** :
1. **Embedding de la question** avec le MÊME modèle qu'à l'ingestion
2. **Similarity search** : top-K plus proches vecteurs (typiquement K=3 à 10)
3. **Re-ranking** (optionnel mais recommandé) : re-scorer les K résultats avec un modèle plus précis (cross-encoder, Cohere Rerank…)
4. **Prompt assembly** : construction du prompt système avec les passages récupérés + question user
5. **LLM completion** : génération de la réponse ancrée
6. **Citation** : afficher à l'user les sources utilisées (URLs, n° de page…)`
        },
        {
          id: "l4-2",
          title: "Vector stores comparés",
          content: `**Choix d'un vector store** dépend du volume, latence cible, ops, et budget.

**Options principales** :
- **pgvector (Postgres)** : extension Postgres native. Simple à opérer, déjà dans la stack existante. Limites : indexation IVF, performance dégrade au-delà de quelques millions de vecteurs.
- **SAP HANA Cloud Vector Engine** : intégration native dans HANA Cloud. Recommandé en environnement SAP — pas de second système à opérer, pas de data leak.
- **Pinecone** : SaaS managé, scaling automatique. Le plus mature pour grosses volumétries. Coût mensuel.
- **Weaviate, Qdrant, Milvus** : open-source, self-hosted ou cloud. Indexation HNSW de série, riche en filtres metadata.

**Indexation** :
- **Brute force (Flat)** : exact mais O(N) — OK jusqu'à ~10K vecteurs
- **IVF (Inverted File)** : partition l'espace en clusters. Bon compromis.
- **HNSW (Hierarchical Navigable Small World)** : graphe multi-niveau. Le plus rapide pour les recherches approximatives à grande échelle. Plus de mémoire.

**Métriques** :
- **Recall@K** : % des K vrais voisins retournés. Cible 0.95+ pour usage prod.
- **Latence p99** : doit rester sous 100 ms pour une UX fluide.`
        },
        {
          id: "l4-3",
          title: "Patterns avancés : Hybrid Search, Agentic RAG",
          content: `Le RAG vanilla a des limites. Patterns modernes en 2025-2026 :

**Hybrid Search** : combine vector similarity (sémantique) et BM25/keyword (lexical). Capture à la fois "le sens" et "le mot exact". Utile pour les codes produits, T-codes SAP, références juridiques — quand un terme exact compte autant que le concept.

**Re-ranking** : récupérer top-50 par vector + re-scorer avec un cross-encoder (modèle qui prend (query, doc) ensemble) pour ne garder que top-5. Améliore precision sans exploser le coût.

**Query rewriting** : avant la recherche, demander au LLM de reformuler/clarifier la question user. "C'est quoi le T-code pour les factures ?" devient "Quel T-code SAP permet de saisir une facture fournisseur dans le module FI ?".

**Multi-step / Agentic RAG** : le LLM décide quelles searches lancer, dans quel ordre, et quand il a assez d'info pour répondre. Plus puissant mais plus cher et lent.

**Self-RAG / Reflection** : le LLM vérifie après coup que sa réponse est bien grounded sur les sources, et corrige si besoin.

**Côté SAP** : la majorité de Joule fonctionne en RAG sur les docs SAP officielles. Les custom skills permettent d'étendre vers les docs internes du client.`
        },
      ],
      quiz: [
        { id: "q4-1", question: "Quelle est la première étape du pipeline d'ingestion RAG ?", options: ["L'embedding", "Le chunking", "Le loading (extraction texte depuis PDF/HTML/etc.)", "L'indexation"], correctIndex: 2, explanation: "L'ordre est : loading (extraction) → chunking → embedding → indexing. Sans extraction, rien à embedder." },
        { id: "q4-2", question: "Pourquoi appliquer le MÊME modèle d'embedding à l'ingestion et à la query ?", options: ["Pour économiser la latence", "Pour que les vecteurs vivent dans le même espace et soient comparables", "Pour respecter le contrat de support", "Pour faire des économies"], correctIndex: 1, explanation: "Deux modèles d'embedding produisent des espaces vectoriels différents. Une cosine similarity entre vecteurs de modèles différents n'a aucun sens." },
        { id: "q4-3", question: "Quel vector store est natif et recommandé en environnement SAP ?", options: ["Pinecone", "Weaviate", "SAP HANA Cloud Vector Engine", "Redis Stack"], correctIndex: 2, explanation: "SAP HANA Cloud Vector Engine est l'intégration native — pas de second système, pas de data leak, gouvernance unifiée avec le reste du tenant SAP." },
        { id: "q4-4", question: "Qu'est-ce que Hybrid Search ?", options: ["Combiner vector similarity (sémantique) et BM25/keyword (lexical)", "Utiliser plusieurs LLMs", "Mixer données structurées et non structurées", "Cacher partiellement le prompt"], correctIndex: 0, explanation: "Hybrid Search combine recherche sémantique et lexicale. Utile quand un mot exact (T-code, référence) compte autant que le concept." },
        { id: "q4-5", question: "À quoi sert le re-ranking dans RAG ?", options: ["Augmenter la latence", "Re-scorer le top-N initial avec un modèle plus précis pour ne garder que les meilleurs", "Trier alphabétiquement", "Compresser les vecteurs"], correctIndex: 1, explanation: "Le re-ranking utilise un cross-encoder qui voit (query, doc) ensemble — bien plus précis qu'un bi-encoder mais plus cher. On l'applique seulement sur le top-N initial." }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CHAPITRE 5 — Prompt engineering & Responsible AI
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ch5",
      title: "Prompt engineering & Responsible AI",
      isPremium: true,
      lessons: [
        {
          id: "l5-1",
          title: "Techniques de prompt engineering",
          content: `Le prompt engineering est l'art d'écrire des instructions qui maximisent la qualité d'une réponse LLM. C'est encore un mix de science et d'artisanat en 2026.

**Techniques fondamentales** :
- **Zero-shot** : demander directement sans exemple. Marche bien pour les tâches simples.
- **Few-shot** : donner 2-5 exemples avant la vraie tâche. Améliore la qualité sur les tâches structurées (extraction, classification).
- **Chain-of-Thought (CoT)** : demander explicitement de raisonner étape par étape ("Think step by step"). Améliore la résolution de problèmes logiques.
- **Role play** : "Tu es un consultant SAP senior…" — calibre le ton et la profondeur attendue.
- **Structured output** : forcer un JSON, XML, ou format spécifique. Indispensable pour intégration en code.
- **Negative prompting** : préciser ce qu'on NE veut PAS ("Pas de marketing fluff", "Pas de mention de prix").

**System vs User message** :
- **System** : instructions stables (rôle, format, contraintes). Caché à l'user final.
- **User** : la question/tâche du moment. Variable.

**Order matters** : le LLM accorde plus de poids à la fin du prompt (recency bias). Mettre les instructions critiques en bas, après les exemples.`
        },
        {
          id: "l5-2",
          title: "Responsible AI : les 5 principes SAP",
          content: `SAP a publié son **Code de conduite IA** en 2018 (un des premiers acteurs enterprise). Les 5 principes guident toutes les implémentations IA dans le portfolio SAP.

**1. Relevance** : l'IA n'est utilisée que si elle apporte une valeur métier claire. Pas d'IA "for the sake of AI". Critère : peut-on mesurer l'impact ?

**2. Transparency** : les utilisateurs savent quand ils interagissent avec une IA. Joule s'identifie systématiquement. Les décisions sensibles (recrutement, crédit) doivent être explicables.

**3. Fairness** : tester et atténuer les biais. Exemple : un système qui filtre les CV doit être audité pour ne pas pénaliser des groupes démographiques. SAP fournit des outils de fairness assessment.

**4. Accountability** : il y a toujours un humain responsable d'une décision IA en bout de chaîne. L'IA propose, l'humain décide (notamment pour les actions à fort impact).

**5. Security & privacy** : data residency, no-train-on-data par défaut, audit complet, gestion des PII (Personally Identifiable Information).

**Réglementaire** : EU AI Act (entré en vigueur 2024). Classification des systèmes IA en risk levels : minimal, limited, high, unacceptable. SAP fournit des templates de conformité pour les systèmes "high risk" (RH, crédit, infra critique).`
        },
      ],
      quiz: [
        { id: "q5-1", question: "Quelle technique consiste à donner quelques exemples avant la tâche ?", options: ["Zero-shot", "Few-shot", "Chain-of-Thought", "Self-consistency"], correctIndex: 1, explanation: "Few-shot prompting fournit 2-5 exemples pour calibrer le LLM sur le format attendu. Très efficace pour les tâches structurées (extraction, classification)." },
        { id: "q5-2", question: "Quel principe Responsible AI SAP exige qu'un humain reste responsable d'une décision IA ?", options: ["Relevance", "Transparency", "Fairness", "Accountability"], correctIndex: 3, explanation: "Accountability impose qu'un humain soit responsable en bout de chaîne. L'IA propose, l'humain décide — surtout pour les actions à fort impact." },
        { id: "q5-3", question: "Que classe l'EU AI Act ?", options: ["Les LLMs par taille", "Les systèmes IA par niveau de risque (minimal, limited, high, unacceptable)", "Les datasets par licence", "Les providers par certification"], correctIndex: 1, explanation: "L'EU AI Act classifie les systèmes IA par risk level. Les systèmes 'high risk' (RH, crédit, infra critique) sont les plus régulés." },
        { id: "q5-4", question: "Qu'est-ce que Chain-of-Thought (CoT) ?", options: ["Une chaîne d'appels LLM", "Demander explicitement au LLM de raisonner étape par étape", "Un type de fine-tuning", "Une stratégie de cache"], correctIndex: 1, explanation: "CoT améliore la résolution de problèmes logiques en demandant au LLM d'exposer son raisonnement avant de conclure. 'Think step by step' suffit souvent." },
        { id: "q5-5", question: "Quelle est la différence entre System message et User message ?", options: ["System est en anglais, User dans la langue de l'app", "System = instructions stables (rôle, format), User = la question/tâche du moment", "System est gratuit, User payant", "Aucune différence"], correctIndex: 1, explanation: "Le System message contient les instructions stables (souvent cachées à l'user final). Le User message est la question variable du moment." }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// SIMULATEUR D'EXAMEN — 30 questions format C_AIG
// ═══════════════════════════════════════════════════════════════════════════
export const aiMockExamQuestions = [
  // Bloc 1 — Fondamentaux LLMs (6 questions)
  { id: 1, chapter: "Fondamentaux LLMs", question: "Quelle architecture neuronale est à la base de tous les LLMs modernes ?", options: ["LSTM", "Transformer", "CNN", "RBM"], correctIndex: 1, explanation: "L'architecture Transformer (Vaswani et al. 2017) est la base de GPT, Claude, Gemini, Llama. Mécanisme d'attention au cœur." },
  { id: 2, chapter: "Fondamentaux LLMs", question: "Que représente un embedding ?", options: ["Le mot d'origine", "Un vecteur numérique représentant le sens d'un texte", "Une image vectorielle", "Un hash sécurisé"], correctIndex: 1, explanation: "Un embedding est un vecteur de dimension fixe (768, 1536, 3072…) qui place le texte dans un espace sémantique mesurable." },
  { id: 3, chapter: "Fondamentaux LLMs", question: "Approximativement, combien de tokens dans 1000 mots de texte français ?", options: ["~250", "~500", "~1300", "~5000"], correctIndex: 2, explanation: "1 token ≈ 4 caractères → 1000 mots ≈ 5000-6000 caractères ≈ 1250-1500 tokens." },
  { id: 4, chapter: "Fondamentaux LLMs", question: "Quelle métrique mesure la similarité entre deux embeddings ?", options: ["Distance Manhattan", "Cosine similarity", "Distance Levenshtein", "BLEU score"], correctIndex: 1, explanation: "Cosine similarity est le standard. Score entre -1 et 1, > 0.8 = très proche." },
  { id: 5, chapter: "Fondamentaux LLMs", question: "Qu'est-ce qu'une hallucination LLM ?", options: ["Un bug du modèle", "Le modèle invente un fait convaincant mais faux", "Un timeout", "Une censure"], correctIndex: 1, explanation: "Hallucinations = LLM produit un contenu plausible mais factuellement faux. Inhérent au mécanisme probabiliste — pas un bug mais une feature à mitiger." },
  { id: 6, chapter: "Fondamentaux LLMs", question: "Quelle est la limitation principale d'un context window ?", options: ["La langue", "Au-delà de N tokens, le modèle 'oublie' le début", "Le coût", "La sécurité"], correctIndex: 1, explanation: "Context window = quantité de tokens que le modèle peut traiter en un seul appel (32K, 128K, 1M selon modèle). Au-delà, attention dilue." },

  // Bloc 2 — SAP AI Core / Launchpad (8 questions)
  { id: 7, chapter: "AI Core", question: "Quel objet AI Core représente une instance live d'un modèle servable ?", options: ["Scenario", "Configuration", "Deployment", "Resource Group"], correctIndex: 2, explanation: "Deployment = instance live. Différent de l'Execution qui est un run de training unique." },
  { id: 8, chapter: "AI Core", question: "Quel composant abstrait les LLMs externes avec une API unifiée ?", options: ["AI Launchpad", "Generative AI Hub", "BTP Cockpit", "HANA Cloud"], correctIndex: 1, explanation: "Generative AI Hub donne accès à OpenAI Azure, Google Vertex, Anthropic, open-source via une seule API. Facturation et gouvernance centralisées." },
  { id: 9, chapter: "AI Core", question: "Quelle authentification utilise un app BTP appelant un deployment AI Core ?", options: ["API Key statique", "JWT XSUAA", "Basic Auth", "Aucune"], correctIndex: 1, explanation: "BTP utilise XSUAA (OAuth2/JWT). Pas de clé API en clair dans le code app." },
  { id: 10, chapter: "AI Core", question: "À quoi sert un Resource Group dans AI Core ?", options: ["Stocker les logs", "Isoler logiquement les ressources d'un projet/tenant", "Configurer le réseau", "Limiter le CPU"], correctIndex: 1, explanation: "Resource Group = isolation logique. Pattern : un par projet ou par client tenant." },
  { id: 11, chapter: "AI Core", question: "Que permet AI Launchpad côté UX ?", options: ["Compiler ABAP", "Gérer prompts versionnés, monitoring deployments, playground multi-modèles", "Provisionner SAP HANA", "Migrer ECC → S/4"], correctIndex: 1, explanation: "AI Launchpad = interface web de governance pour le cycle de vie IA. Inclut Generative AI Hub, ML Ops, Prompt Templates." },
  { id: 12, chapter: "AI Core", question: "Vrai ou Faux : les credentials des providers (OpenAI, Anthropic) sont saisis directement dans le code app ?", options: ["Vrai", "Faux — ils sont stockés au niveau du Resource Group d'AI Core"], correctIndex: 1, explanation: "Faux. Les credentials sont gérés par AI Core / Launchpad. L'app ne voit jamais la clé provider — uniquement le token XSUAA." },
  { id: 13, chapter: "AI Core", question: "Quel SDK SAP permet d'appeler les LLMs depuis du code JavaScript/TypeScript ?", options: ["sap-cap-sdk", "sap-ai-sdk", "sap-ui5", "sap-fiori-sdk"], correctIndex: 1, explanation: "sap-ai-sdk (Node.js/TS). Équivalent Python : sap-genai-hub-sdk." },
  { id: 14, chapter: "AI Core", question: "Quel pattern permet le déploiement contrôlé/versionné des prompts ?", options: ["Git submodules", "Prompt Templates dans AI Launchpad", "ABAP includes", "Custom fields"], correctIndex: 1, explanation: "Prompt Templates = système versionné de gestion des prompts. Permet A/B testing et rollback sans toucher au code." },

  // Bloc 3 — Joule (6 questions)
  { id: 15, chapter: "Joule", question: "Joule utilise quel(s) LLM(s) sous-jacent(s) ?", options: ["Un modèle propriétaire SAP", "Des LLMs externes via Generative AI Hub (OpenAI Azure, Google, Anthropic)", "Llama uniquement", "Aucun, c'est du regex"], correctIndex: 1, explanation: "Joule = orchestrateur. Délègue le calcul à des LLMs externes via Generative AI Hub. Valeur SAP = contexte + skills + sécurité." },
  { id: 16, chapter: "Joule", question: "Qu'est-ce qu'une Joule Skill ?", options: ["Une licence", "Une capacité métier exécutable (créer PO, sortir rapport) gouvernée par les autorisations SAP", "Un fichier de config", "Un format PDF"], correctIndex: 1, explanation: "Skill = action concrète encapsulée. Soumise aux autorisations PFCG standard : un user ne peut faire via Joule que ce qu'il peut faire via Fiori." },
  { id: 17, chapter: "Joule", question: "Joule for Developers est l'équivalent SAP de quel outil grand public ?", options: ["Google Docs", "GitHub Copilot", "Slack", "Notion AI"], correctIndex: 1, explanation: "Joule for Developers = assistant code dans ADT et SAP Build. Suggestions ABAP, refactoring, génération de tests." },
  { id: 18, chapter: "Joule", question: "Comment Joule respecte-t-il les permissions d'un utilisateur ?", options: ["Toutes les données accessibles", "Via PFCG et Field-Level Security S/4HANA standard", "Whitelist manuelle", "Via firewall réseau"], correctIndex: 1, explanation: "Joule applique le même modèle d'autorisation que Fiori. Pas de bypass — un user ne voit via Joule que ce qu'il voit dans les transactions." },
  { id: 19, chapter: "Joule", question: "Quel service Joule injecte le contexte tenant (rôle user, master data) dans les prompts ?", options: ["AI Launchpad", "Grounding Service", "Skill Engine", "BTP Cockpit"], correctIndex: 1, explanation: "Grounding Service enrichit le prompt avec le contexte tenant : c'est ce qui différencie Joule d'un chatbot générique." },
  { id: 20, chapter: "Joule", question: "Prérequis technique pour activer Joule dans S/4HANA Cloud ?", options: ["Aucun, c'est gratuit", "Tenant BTP avec AI Core (extended plan) + licence Joule", "Migration ECC obligatoire", "ABAP custom"], correctIndex: 1, explanation: "Joule nécessite un tenant BTP avec AI Core en plan 'extended' (génératif) + licence Joule séparée — pas inclus en standard." },

  // Bloc 4 — RAG (5 questions)
  { id: 21, chapter: "RAG", question: "Ordre correct du pipeline d'ingestion RAG ?", options: ["embedding → loading → chunking → indexing", "loading → chunking → embedding → indexing", "indexing → chunking → loading → embedding", "chunking → loading → embedding → indexing"], correctIndex: 1, explanation: "Loading (extraction texte) → Chunking (découpage en passages) → Embedding (vectorisation) → Indexing (stockage)." },
  { id: 22, chapter: "RAG", question: "Pourquoi un overlap entre chunks ?", options: ["Réduire le stockage", "Préserver le contexte au passage d'un chunk à l'autre", "Sécuriser les données", "Économiser des tokens"], correctIndex: 1, explanation: "Overlap (10-20 %) évite de couper une phrase importante exactement à la frontière entre 2 chunks. Améliore la qualité du retrieval." },
  { id: 23, chapter: "RAG", question: "Quel vector store est natif en environnement SAP ?", options: ["Pinecone", "Redis Stack", "SAP HANA Cloud Vector Engine", "Elasticsearch"], correctIndex: 2, explanation: "SAP HANA Cloud Vector Engine = intégré dans HANA Cloud. Pas de second système à opérer, gouvernance unifiée." },
  { id: 24, chapter: "RAG", question: "Quel pattern combine recherche sémantique (vector) ET lexicale (BM25/keyword) ?", options: ["Hybrid Search", "Federated Search", "Fuzzy Search", "Hybrid Cloud"], correctIndex: 0, explanation: "Hybrid Search est essentiel quand un mot exact (T-code, code produit, référence juridique) compte autant que le concept." },
  { id: 25, chapter: "RAG", question: "Quel modèle ré-évalue le top-N initial pour ne garder que les meilleurs résultats ?", options: ["Tokenizer", "Cross-encoder (re-ranker)", "Auto-encoder", "Transformer décodeur"], correctIndex: 1, explanation: "Cross-encoder voit (query, doc) ensemble — bien plus précis qu'un bi-encoder. On le réserve au top-N pour limiter le coût." },

  // Bloc 5 — Prompt eng + Responsible AI (5 questions)
  { id: 26, chapter: "Prompt Engineering", question: "Technique qui demande explicitement au LLM de raisonner étape par étape ?", options: ["Few-shot", "Chain-of-Thought (CoT)", "Zero-shot", "Negative prompting"], correctIndex: 1, explanation: "CoT améliore la résolution de problèmes logiques. 'Think step by step' suffit souvent à déclencher." },
  { id: 27, chapter: "Prompt Engineering", question: "Différence System vs User message ?", options: ["Aucune", "System = instructions stables (rôle, format), souvent cachées ; User = question/tâche du moment, variable", "System est gratuit", "Encodage différent"], correctIndex: 1, explanation: "System contient le contexte stable de l'app, caché à l'user final. User contient la question du moment." },
  { id: 28, chapter: "Responsible AI", question: "Lequel des 5 principes SAP Responsible AI exige une explicabilité des décisions sensibles ?", options: ["Relevance", "Transparency", "Fairness", "Accountability"], correctIndex: 1, explanation: "Transparency = les users savent quand ils interagissent avec une IA, et les décisions sensibles (recrutement, crédit) doivent être explicables." },
  { id: 29, chapter: "Responsible AI", question: "Que classe l'EU AI Act ?", options: ["Les LLMs par taille", "Les systèmes IA par niveau de risque (minimal/limited/high/unacceptable)", "Les datasets par licence", "Les certifications"], correctIndex: 1, explanation: "EU AI Act = classification par risk level. Les systèmes 'high risk' (RH, crédit, infra critique) sont les plus régulés." },
  { id: 30, chapter: "Responsible AI", question: "Quel principe assure qu'un humain reste responsable d'une décision IA ?", options: ["Relevance", "Transparency", "Fairness", "Accountability"], correctIndex: 3, explanation: "Accountability = il y a toujours un humain responsable en bout de chaîne. L'IA propose, l'humain décide pour les actions à fort impact." }
];
