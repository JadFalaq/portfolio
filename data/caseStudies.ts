import type { Language } from '../contexts/LanguageContext'

// ---------------------------------------------------------------------------
// Case studies for every portfolio project except AKWA (dedicated page, data/akwa.ts).
// Each claim is traced in docs/case-study-audit.md (repository + commit reviewed).
// Text is bilingual inline (`b(fr, en)`) so shared facts — numbers, names — are written once.
// Sections are optional: nothing is rendered when a project has no documented content.
// ---------------------------------------------------------------------------

export type L = Record<Language, string>
const b = (fr: string, en: string): L => ({ fr, en })

export interface FlowNode {
  label: L
  detail?: L
  kind?: 'source' | 'process' | 'model' | 'output' | 'infra'
  /** Consecutive nodes with the same group render side by side. */
  group?: string
}

export interface Metric {
  value: string
  label: L
  /** Split, protocol or caveat — always shown next to the number. */
  context: L
  source: string
}

export interface CaseStudyData {
  /** Kind of work, shown in the hero facts. */
  context: L
  challenge: L[]
  solution: L
  architecture?: { title?: L; nodes: FlowNode[]; alt: L; note?: L }
  implementation: { title: L; items: { title: L; text: L; source?: string }[] }
  decisions?: { title: L; text: L; source?: string }[]
  results?: {
    intro?: L
    metrics?: Metric[]
    table?: { caption: L; columns: L[]; rows: string[][]; source: string }
    note?: L
  }
  limitations: L[]
  nextSteps?: L[]
  /** Sources reviewed (shown in the page footer). */
  sources: string[]
}

export const caseStudies: Record<string, CaseStudyData> = {
  // -------------------------------------------------------------------------
  renault: {
    context: b('Stage — Renault Digital (interne, confidentiel)', 'Internship — Renault Digital (internal, confidential)'),
    challenge: [
      b(
        "L'équipe QA rédigeait à la main les tickets Jira et les scénarios Gherkin à partir des exigences : 10 à 20 minutes par exigence.",
        'The QA team wrote Jira tickets and Gherkin scenarios by hand from requirements: 10 to 20 minutes per requirement.',
      ),
      b(
        'Les sources utiles (pages Confluence, anciennes user stories, tickets) étaient dispersées dans des PDF, et contenaient des données à protéger avant tout appel à un LLM.',
        'Useful sources (Confluence pages, past user stories, tickets) were scattered across PDFs and contained data to protect before any LLM call.',
      ),
    ],
    solution: b(
      "Un système à deux agents LLM — analyse des exigences, puis conception des tests — alimenté par un RAG sur plus de 400 PDF. Les sorties sont validées par schéma puis rendues en Gherkin de façon déterministe, avec une validation humaine à chaque étape. Un premier POC sur Copilot Studio a précédé une reconstruction en FastAPI et React/TypeScript.",
      'A two-agent LLM system — requirement analysis, then test design — fed by a RAG over 400+ PDFs. Outputs are schema-validated then rendered to Gherkin deterministically, with human validation at every step. A first POC on Copilot Studio preceded a rebuild in FastAPI and React/TypeScript.',
    ),
    architecture: {
      nodes: [
        { label: b('400+ PDF', '400+ PDFs'), detail: b('Confluence, user stories, tickets Jira', 'Confluence, user stories, Jira tickets'), kind: 'source' },
        { label: b('Ingestion', 'Ingestion'), detail: b('OCR tableaux/images (unstructured.io), découpage par structure', 'table/image OCR (unstructured.io), structure-aware chunking'), kind: 'process' },
        { label: b('Index vectoriel', 'Vector index'), detail: b('pgvector · retrieval MMR', 'pgvector · MMR retrieval'), kind: 'infra' },
        { label: b('Masquage DLP', 'DLP masking'), detail: b('Presidio, spaCy — avant chaque appel LLM', 'Presidio, spaCy — before every LLM call'), kind: 'process' },
        { label: b('Requirement Analyzer Agent', 'Requirement Analyzer Agent'), kind: 'model', group: 'agents' },
        { label: b('Test Design Agent', 'Test Design Agent'), kind: 'model', group: 'agents' },
        { label: b('JSON validé (Pydantic)', 'Validated JSON (Pydantic)'), detail: b('rendu Gherkin déterministe, parseur Cucumber', 'deterministic Gherkin rendering, Cucumber parser'), kind: 'process' },
        { label: b('Validation humaine', 'Human validation'), kind: 'output', group: 'out' },
        { label: b('Tickets Jira · scénarios Gherkin', 'Jira tickets · Gherkin scenarios'), kind: 'output', group: 'out' },
      ],
      alt: b(
        "Schéma : plus de 400 PDF sont ingérés (OCR, découpage) dans un index pgvector ; après masquage DLP, deux agents (analyse des exigences, conception des tests) produisent un JSON validé par Pydantic, rendu en Gherkin et contrôlé par le parseur Cucumber, puis validé par un humain avant création des tickets Jira.",
        'Diagram: 400+ PDFs are ingested (OCR, chunking) into a pgvector index; after DLP masking, two agents (requirement analysis, test design) produce Pydantic-validated JSON, rendered to Gherkin and checked by the Cucumber parser, then validated by a human before Jira tickets are created.',
      ),
      note: b(
        "Vue synthétique construite uniquement à partir des éléments déjà décrits dans l'expérience. Aucun schéma interne n'est reproduit.",
        'Synthetic view built only from elements already described in the experience. No internal diagram is reproduced.',
      ),
    },
    implementation: {
      title: b('Ce qui a été construit', 'What was built'),
      items: [
        { title: b('Agents et génération', 'Agents and generation'), text: b('Deux agents spécialisés transforment une exigence en tickets Jira et en scénarios Gherkin ; un humain valide à chaque étape.', 'Two specialised agents turn a requirement into Jira tickets and Gherkin scenarios; a human validates at every step.') },
        { title: b('RAG documentaire', 'Document RAG'), text: b("RAG sur l'API Microsoft Copilot (similarité cosinus, top-5) ; seuil de similarité calibré empiriquement à 0,72.", 'RAG on the Microsoft Copilot API (cosine similarity, top-5); similarity threshold calibrated empirically at 0.72.') },
        { title: b('Fiabilité des sorties', 'Output reliability'), text: b('Le LLM produit du JSON validé par schémas Pydantic ; le Gherkin est rendu en code et contrôlé par le parseur officiel Cucumber, ce qui élimine les erreurs de syntaxe du LLM.', 'The LLM produces JSON validated by Pydantic schemas; Gherkin is rendered in code and checked by the official Cucumber parser, removing LLM syntax errors.') },
        { title: b('Qualité logicielle', 'Software quality'), text: b('296 tests automatisés (pytest) et documentation technique des 9 modules.', '296 automated tests (pytest) and technical documentation of the 9 modules.') },
        { title: b('Automatisation QA', 'QA automation'), text: b('Fichiers Smoke/TNR générés sur SharePoint et reporting Teams via Power Automate.', 'Smoke/regression files generated on SharePoint and Teams reporting via Power Automate.') },
      ],
    },
    decisions: [
      { title: b('Le LLM ne rédige pas le Gherkin', 'The LLM does not write Gherkin'), text: b('Générer du JSON contraint puis rendre le Gherkin en code rend la syntaxe vérifiable et déterministe.', 'Generating constrained JSON and rendering Gherkin in code makes the syntax checkable and deterministic.') },
      { title: b('Masquage avant le LLM', 'Masking before the LLM'), text: b('Les données sensibles sont masquées (Presidio, spaCy) avant chaque appel, pas après.', 'Sensitive data is masked (Presidio, spaCy) before every call, not after.') },
      { title: b('Humain dans la boucle', 'Human in the loop'), text: b("Chaque étape est validée par l'équipe QA : le système assiste, il ne publie pas seul.", 'Every step is validated by the QA team: the system assists, it does not publish on its own.') },
    ],
    results: {
      metrics: [
        { value: '85 %', label: b('des générations acceptées sans modification', 'of generations accepted without edits'), context: b('tableau de bord qualité interne', 'internal quality dashboard'), source: 'experience' },
        { value: '10–20 → 1–2 min', label: b('de rédaction par exigence', 'writing time per requirement'), context: b('avant / après, déclaré par l’équipe', 'before / after, reported by the team'), source: 'experience' },
        { value: '100+ / 50', label: b('tickets Jira / scénarios Gherkin générés', 'Jira tickets / Gherkin scenarios generated'), context: b('pendant le stage, équipe QA de 6 personnes', 'during the internship, 6-person QA team'), source: 'experience' },
      ],
      note: b('Chiffres issus du stage ; aucune donnée interne n’est publiée.', 'Figures from the internship; no internal data is published.'),
    },
    limitations: [
      b('Projet interne : ni code, ni captures, ni documents publiés.', 'Internal project: no code, screenshots or documents published.'),
      b('Les gains de temps sont des mesures internes, non reproductibles hors de l’entreprise.', 'Time savings are internal measurements, not reproducible outside the company.'),
    ],
    sources: ['portfolio experience entry (Renault Digital, 2026)'],
  },

  // -------------------------------------------------------------------------
  cvmatcher: {
    context: b('Projet personnel — démo en ligne', 'Personal project — live demo'),
    challenge: [
      b(
        "Une offre liste des exigences, un CV contient des preuves — souvent formulées avec d'autres mots. Les ATS et les recruteurs pressés cherchent les termes exacts de l'offre.",
        'A job offer lists requirements, a CV contains evidence — often phrased differently. ATS and busy recruiters look for the offer’s exact terms.',
      ),
      b(
        "Un LLM seul peut inventer une preuve, se tromper de statut ou halluciner un chiffre : il faut un système qui aide à reformuler sans jamais inventer d'expérience.",
        'An LLM alone can invent evidence, mislabel a status or hallucinate a figure: the system must help rephrase without ever inventing experience.',
      ),
    ],
    solution: b(
      "Pour chaque compétence de l'offre, cvmatch retrouve la preuve dans le CV, la classe en quatre statuts (visible, cachée, implicite, absente), calcule un score en code et propose des reformulations des propres lignes du candidat. Principe central : le LLM propose, le code vérifie.",
      'For every skill in the offer, cvmatch retrieves the evidence in the CV, classifies it into four statuses (visible, hidden, implicit, absent), computes a score in code and suggests rewrites of the candidate’s own lines. Core principle: the LLM proposes, the code verifies.',
    ),
    architecture: {
      nodes: [
        { label: b("Offre d'emploi", 'Job offer'), kind: 'source', group: 'in' },
        { label: b('CV (pdf / md / txt)', 'CV (pdf / md / txt)'), kind: 'source', group: 'in' },
        { label: b('parse_offer ⟲ verify_exhaustivity', 'parse_offer ⟲ verify_exhaustivity'), detail: b('relance si des compétences manquent', 'retries if skills are missing'), kind: 'model', group: 'p1' },
        { label: b('index_cv', 'index_cv'), detail: b('chunks · BM25 + embeddings optionnels', 'chunks · BM25 + optional embeddings'), kind: 'process', group: 'p1' },
        { label: b('Send : une branche par compétence', 'Send: one branch per skill'), detail: b('retrieve (top-4, RRF) → judge ⟲ verify (3 essais max)', 'retrieve (top-4, RRF) → judge ⟲ verify (max 3 tries)'), kind: 'model' },
        { label: b('aggregate → summarize', 'aggregate → summarize'), detail: b('score calculé en code', 'score computed in code'), kind: 'process' },
        { label: b('human_review (interrupt)', 'human_review (interrupt)'), kind: 'output', group: 'out' },
        { label: b('finalize → bilan', 'finalize → report'), kind: 'output', group: 'out' },
      ],
      alt: b(
        "Graphe LangGraph : l'offre est analysée avec une boucle de contrôle d'exhaustivité, le CV est indexé ; chaque compétence est évaluée en parallèle par un sous-graphe retrieve → judge → verify qui reboucle jusqu'à trois fois ; les résultats sont agrégés, le score est calculé en code, puis l'utilisateur valide avant le bilan.",
        'LangGraph graph: the offer is parsed with an exhaustiveness check loop, the CV is indexed; each skill is assessed in parallel by a retrieve → judge → verify sub-graph that loops up to three times; results are aggregated, the score is computed in code, then the user validates before the report.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Garde-fous déterministes', 'Deterministic guardrails'), text: b("Une citation doit exister mot pour mot dans le CV ; « visible » vs « cachée » est tranché par le code ; un verdict « absent » est rejeté si le terme figure dans les extraits ; une reformulation ne peut ajouter ni chiffre ni outil.", 'A citation must exist word for word in the CV; “visible” vs “hidden” is decided by code; an “absent” verdict is rejected if the term appears in the excerpts; a rewrite cannot add numbers or tools.'), source: 'verification.py' },
        { title: b('RAG hybride', 'Hybrid RAG'), text: b('Pour chaque compétence, 4 extraits retrouvés par BM25 (+ embeddings si configurés), fusion RRF, requête enrichie de synonymes FR/EN et de déclencheurs implicites.', 'For each skill, 4 excerpts retrieved with BM25 (+ embeddings if configured), RRF fusion, query enriched with FR/EN synonyms and implicit triggers.'), source: 'retrieval.py, config.py' },
        { title: b('Sorties structurées', 'Structured outputs'), text: b('Chaque réponse LLM est validée par un schéma Pydantic.', 'Every LLM response is validated by a Pydantic schema.'), source: 'schemas.py' },
        { title: b('API et site', 'API and site'), text: b('FastAPI avec streaming SSE, site Next.js, CLI ; garde-fous d’usage (taille d’entrée, PDF ≤ 5 pages, quotas par heure et par jour, CORS, clé API optionnelle).', 'FastAPI with SSE streaming, Next.js site, CLI; usage guards (input size, PDF ≤ 5 pages, hourly/daily quotas, CORS, optional API key).'), source: 'api.py, limits.py' },
        { title: b('CI', 'CI'), text: b('GitHub Actions : pytest sur Python 3.10 et 3.12 avec un LLM factice, build du site, build de l’image Docker.', 'GitHub Actions: pytest on Python 3.10 and 3.12 with a fake LLM, site build, Docker image build.'), source: '.github/workflows/ci.yml' },
      ],
    },
    decisions: [
      { title: b('Score calculé en code', 'Score computed in code'), text: b('Jamais par le LLM : reproductible, auditable, testable.', 'Never by the LLM: reproducible, auditable, testable.') },
      { title: b('Le juge ne voit que les extraits', 'The judge only sees excerpts'), text: b('Limiter le contexte aux extraits retrouvés réduit les inventions ; un « absent » est malgré tout revérifié sur tout le CV.', 'Restricting context to retrieved excerpts limits invention; an “absent” is still re-checked against the whole CV.') },
      { title: b('LLM factice pour les tests', 'Fake LLM for tests'), text: b('Toute la plomberie (RAG, boucles, score) est testée hors ligne, sans clé ni coût.', 'All the plumbing (RAG, loops, score) is tested offline, with no key and no cost.') },
    ],
    results: {
      metrics: [
        { value: '125', label: b('tests collectés — 124 réussis, 1 ignoré', 'tests collected — 124 passed, 1 skipped'), context: b('exécutés le 19/10/2026 hors ligne (LLM factice), en 12,9 s', 'run on 2026-10-19 offline (fake LLM), in 12.9 s'), source: 'pytest' },
      ],
      note: b(
        "Aucune métrique de qualité n'est publiée : le README indique que le système n'a pas encore été évalué avec un vrai LLM. Le protocole d'évaluation (cas synthétiques, baselines TF-IDF et « un seul prompt ») est implémenté mais ses résultats ne sont pas versionnés.",
        'No quality metric is published: the README states the system has not yet been evaluated with a real LLM. The evaluation protocol (synthetic cases, TF-IDF and “single prompt” baselines) is implemented but its results are not versioned.',
      ),
    },
    limitations: [
      b('Jamais évalué contre un vrai LLM ni de vrais embeddings (README).', 'Never evaluated against a real LLM or real embeddings (README).'),
      b('Le statut « implicite » reste subjectif : la validation humaine est là pour ça.', 'The “implicit” status remains subjective: human validation is there for that.'),
      b('Référentiel d’environ 60 compétences IA/data/MLOps ; compteurs de débit en mémoire (une seule instance).', 'Taxonomy of about 60 AI/data/MLOps skills; in-memory rate counters (single instance).'),
      b('Les PDF à deux colonnes peuvent être extraits dans le désordre.', 'Two-column PDFs can be extracted out of order.'),
    ],
    nextSteps: [
      b('Lancer l’évaluation avec un vrai fournisseur et publier les résultats.', 'Run the evaluation with a real provider and publish the results.'),
      b('Checkpointer SQLite/Postgres pour reprendre une validation interrompue ; traces LangSmith.', 'SQLite/Postgres checkpointer to resume an interrupted review; LangSmith traces.'),
    ],
    sources: ['README.md', 'src/cvmatch/*.py', 'tests/ (125)', '.github/workflows/ci.yml', 'Dockerfile'],
  },

  // -------------------------------------------------------------------------
  ragchatbot: {
    context: b("Projet d'apprentissage — implémentations pas à pas", 'Learning project — step-by-step implementations'),
    challenge: [
      b(
        "Un pipeline RAG enchaîne des choix — découpage, recherche, classement — dont l'effet est difficile à percevoir sans les implémenter un par un.",
        'A RAG pipeline chains choices — chunking, retrieval, ranking — whose effect is hard to grasp without implementing them one by one.',
      ),
    ],
    solution: b(
      "Onze scripts et un notebook construisent un RAG sur Azure OpenAI et ChromaDB, puis remplacent une brique à la fois pour comparer les stratégies sur un même petit corpus (cinq fiches d'entreprises et l'article « Attention Is All You Need »).",
      'Eleven scripts and a notebook build a RAG on Azure OpenAI and ChromaDB, then swap one building block at a time to compare strategies on the same small corpus (five company files and the “Attention Is All You Need” paper).',
    ),
    architecture: {
      nodes: [
        { label: b('Documents', 'Documents'), detail: b('5 fichiers texte + 1 PDF', '5 text files + 1 PDF'), kind: 'source' },
        { label: b('Découpage', 'Chunking'), detail: b('caractères · sémantique · agentique (LLM)', 'character · semantic · agentic (LLM)'), kind: 'process' },
        { label: b('Embeddings Azure OpenAI → ChromaDB', 'Azure OpenAI embeddings → ChromaDB'), kind: 'infra' },
        { label: b('Recherche', 'Retrieval'), detail: b('similarité · seuil de score · MMR · multi-query', 'similarity · score threshold · MMR · multi-query'), kind: 'process' },
        { label: b('Fusion RRF (k = 60)', 'RRF fusion (k = 60)'), kind: 'process' },
        { label: b('Génération', 'Generation'), detail: b("réponse fondée sur le contexte · prise en compte de l'historique", 'context-grounded answer · history-aware'), kind: 'model' },
      ],
      alt: b(
        'Pipeline : documents découpés selon trois stratégies, vectorisés dans ChromaDB, recherchés par similarité, seuil, MMR ou multi-query, fusionnés par RRF, puis passés au LLM pour une réponse fondée sur le contexte.',
        'Pipeline: documents chunked with three strategies, embedded into ChromaDB, retrieved by similarity, threshold, MMR or multi-query, fused with RRF, then passed to the LLM for a context-grounded answer.',
      ),
    },
    implementation: {
      title: b('Étapes implémentées', 'Implemented steps'),
      items: [
        { title: b('Ingestion et recherche', 'Ingestion and retrieval'), text: b('Chargement, découpage, embeddings Azure OpenAI, persistance ChromaDB ; recherche top-k (k = 5).', 'Loading, chunking, Azure OpenAI embeddings, ChromaDB persistence; top-k retrieval (k = 5).'), source: '1–2_*.py' },
        { title: b('Génération', 'Generation'), text: b("Réponse contrainte au contexte retrouvé, puis version tenant compte de l'historique de conversation.", 'Answer constrained to the retrieved context, then a conversation-history-aware version.'), source: '3–4_*.py' },
        { title: b('Trois découpages', 'Three chunkers'), text: b('Par caractères (taille fixe), sémantique (ruptures de sens), agentique (le LLM décide des frontières).', 'Character-based (fixed size), semantic (meaning breaks), agentic (the LLM decides boundaries).'), source: '5–7_*.py' },
        { title: b('Recherche avancée', 'Advanced retrieval'), text: b('Seuil de similarité, MMR pour la diversité, multi-query (reformulations par le LLM) et Reciprocal Rank Fusion.', 'Similarity threshold, MMR for diversity, multi-query (LLM rewrites) and Reciprocal Rank Fusion.'), source: '9–11_*.py' },
        { title: b('RAG multimodal', 'Multimodal RAG'), text: b('Extraction de texte, tableaux et images de PDF (Unstructured, Google Cloud Vision) et chunks enrichis.', 'Extraction of text, tables and images from PDFs (Unstructured, Google Cloud Vision) and enriched chunks.'), source: '8_multi_modal_rag.ipynb' },
      ],
    },
    limitations: [
      b("Comparaison qualitative : aucun jeu d'évaluation ni métrique de retrieval (précision@k, fidélité) n'est versionné.", 'Qualitative comparison: no evaluation set or retrieval metric (precision@k, faithfulness) is versioned.'),
      b('Corpus très petit ; scripts pédagogiques indépendants plutôt qu’une application.', 'Very small corpus; standalone teaching scripts rather than an application.'),
    ],
    nextSteps: [b('Mesurer chaque stratégie sur les questions synthétiques déjà rédigées (synthetic_questions.txt).', 'Measure each strategy on the synthetic questions already written (synthetic_questions.txt).')],
    sources: ['README.md', '1_ingestion_pipeline.py … 11_reciprocal_rank_fusion.py', '8_multi_modal_rag.ipynb'],
  },

  // -------------------------------------------------------------------------
  bookpipeline: {
    context: b('Projet académique (exercice orchestration)', 'Academic project (orchestration exercise)'),
    challenge: [
      b(
        'Transformer automatiquement des livres PDF/EPUB en résumés, questions-réponses, traductions et audio, en traitant plusieurs livres sans intervention manuelle.',
        'Automatically turn PDF/EPUB books into summaries, Q&A, translations and audio, processing several books without manual work.',
      ),
    ],
    solution: b(
      "Un DAG Apache Airflow découvre les livres et lance un traitement par livre via le dynamic task mapping. Les étapes appellent un service ML Flask séparé, qui exécute les modèles Hugging Face et Coqui TTS. Chaque exécution est versionnée dans son propre dossier de sortie.",
      'An Apache Airflow DAG discovers books and launches one processing branch per book with dynamic task mapping. Steps call a separate Flask ML service that runs the Hugging Face and Coqui TTS models. Each run is versioned in its own output folder.',
    ),
    architecture: {
      nodes: [
        { label: b('data/books/', 'data/books/'), detail: b('PDF, EPUB', 'PDF, EPUB'), kind: 'source' },
        { label: b('discover_books → parse_book', 'discover_books → parse_book'), detail: b('.expand() : une instance par livre', '.expand(): one instance per book'), kind: 'process' },
        { label: b('Résumés', 'Summaries'), detail: b('chapitres · 2 pages · 1 paragraphe', 'chapters · 2 pages · 1 paragraph'), kind: 'model', group: 'tasks' },
        { label: b('Questions-réponses', 'Q&A'), detail: b('≥ 20 paires', '≥ 20 pairs'), kind: 'model', group: 'tasks' },
        { label: b('Traduction FR / AR → TTS', 'FR / AR translation → TTS'), kind: 'model', group: 'tasks' },
        { label: b('Service ML Flask', 'Flask ML service'), detail: b('FLAN-T5 · NLLB-200 · Coqui TTS / gTTS', 'FLAN-T5 · NLLB-200 · Coqui TTS / gTTS'), kind: 'infra' },
        { label: b('validate_outputs', 'validate_outputs'), detail: b('outputs/<livre>/<horodatage>/', 'outputs/<book>/<timestamp>/'), kind: 'output' },
      ],
      alt: b(
        'DAG Airflow : les livres sont découverts puis analysés, une branche par livre ; résumés, questions-réponses, traductions et synthèse vocale sont demandés à un service ML Flask ; les sorties sont validées et rangées par livre et par exécution.',
        'Airflow DAG: books are discovered then parsed, one branch per book; summaries, Q&A, translations and text-to-speech are requested from a Flask ML service; outputs are validated and stored per book and per run.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Orchestration', 'Orchestration'), text: b('Docker Compose : PostgreSQL, Redis, webserver, scheduler, worker Celery, triggerer, Flower. Déclenchement manuel, 2 reprises automatiques espacées de 5 min.', 'Docker Compose: PostgreSQL, Redis, webserver, scheduler, Celery worker, triggerer, Flower. Manual trigger, 2 automatic retries 5 min apart.'), source: 'docker-compose.yml, DAG' },
        { title: b('Parallélisme par livre', 'Per-book parallelism'), text: b('Dynamic task mapping (.expand) et Task Groups pour gérer les dépendances entre tâches mappées.', 'Dynamic task mapping (.expand) and Task Groups to handle dependencies between mapped tasks.'), source: 'DAG' },
        { title: b('Service ML', 'ML service'), text: b("API Flask (/summarize, /qa/generate, /translate, /tts, /health) ; découpage des textes longs en morceaux de 2 000 caractères ; modèles configurables par variables d'environnement.", 'Flask API (/summarize, /qa/generate, /translate, /tts, /health); long texts split into 2,000-character chunks; models configurable through environment variables.'), source: 'ml_service/app.py, config.py' },
        { title: b('Contrôle des sorties', 'Output checks'), text: b('Une tâche finale vérifie les fichiers générés ; le service complète la génération si moins de 20 paires Q&A sont produites.', 'A final task checks the generated files; the service tops up generation when fewer than 20 Q&A pairs are produced.'), source: 'DAG, app.py' },
      ],
    },
    decisions: [
      { title: b('Modèles hors d’Airflow', 'Models outside Airflow'), text: b('Le service ML tourne à part : Airflow orchestre, il ne charge pas les modèles dans ses workers.', 'The ML service runs separately: Airflow orchestrates, it does not load models in its workers.') },
    ],
    results: {
      metrics: [
        { value: '≥ 20', label: b('paires Q&A par livre', 'Q&A pairs per book'), context: b('garanti par conception (paramètre min_questions), pas une mesure de qualité', 'guaranteed by design (min_questions parameter), not a quality measure'), source: 'ml_service/app.py' },
        { value: '5–15 min', label: b('par livre', 'per book'), context: b('ordre de grandeur rapporté dans le rapport, sans protocole de mesure', 'order of magnitude reported in the project report, without a measurement protocol'), source: 'Rapport_Projet_Book_Pipeline.md §6.2' },
      ],
    },
    limitations: [
      b('Qualité des résumés et traductions non évaluée par une métrique.', 'Summary and translation quality not evaluated with a metric.'),
      b('Service ML exécuté localement, hors des conteneurs Airflow.', 'ML service run locally, outside the Airflow containers.'),
    ],
    sources: ['README.md', 'docker-compose.yml', 'airflow/dags/exercise2_books_ingestion.py', 'ml_service/*', 'Rapport_Projet_Book_Pipeline.md'],
  },

  // -------------------------------------------------------------------------
  dental: {
    context: b('Projet académique MLOps — démo en ligne', 'Academic MLOps project — live demo'),
    challenge: [
      b(
        'Détecter des pathologies dentaires sur radiographies panoramiques, et surtout rendre le modèle reproductible, traçable et déployable : données versionnées, expériences suivies, sélection du modèle explicite.',
        'Detect dental pathologies on panoramic X-rays — and above all make the model reproducible, traceable and deployable: versioned data, tracked experiments, explicit model selection.',
      ),
    ],
    solution: b(
      "Un pipeline en trois couches : données (audit, remapping de 14 vers 7 classes cliniques, DVC), modélisation (YOLOv8s, MLflow, registre Champion/Candidate), service (API FastAPI conteneurisée, CD GitHub Actions, frontend React « Snani »).",
      'A three-layer pipeline: data (audit, 14 → 7 clinical classes, DVC), modelling (YOLOv8s, MLflow, Champion/Candidate registry), service (containerised FastAPI API, GitHub Actions CD, “Snani” React frontend).',
    ),
    architecture: {
      nodes: [
        { label: b('1 808 radiographies', '1,808 X-rays'), detail: b('24 888 annotations · DVC', '24,888 annotations · DVC'), kind: 'source' },
        { label: b('Préparation', 'Preparation'), detail: b('contrôle qualité · remapping 14 → 7 classes', 'quality checks · 14 → 7 class remapping'), kind: 'process' },
        { label: b('Entraînement YOLOv8s', 'YOLOv8s training'), detail: b('3 variantes · suivi MLflow', '3 variants · MLflow tracking'), kind: 'model', group: 'm' },
        { label: b('Évaluation eval / test / external', 'Evaluation eval / test / external'), kind: 'process', group: 'm' },
        { label: b('Registre', 'Registry'), detail: b('Champion · Candidate · Archived (alias stable)', 'Champion · Candidate · Archived (stable alias)'), kind: 'infra' },
        { label: b('CD GitHub Actions', 'GitHub Actions CD'), detail: b('tests → image → tests d’intégration → ghcr.io', 'tests → image → integration tests → ghcr.io'), kind: 'infra' },
        { label: b('API FastAPI', 'FastAPI API'), detail: b('Azure Container Apps (0–1 réplique)', 'Azure Container Apps (0–1 replica)'), kind: 'output', group: 'srv' },
        { label: b('Frontend Snani', 'Snani frontend'), detail: b('React (Vite) · Vercel', 'React (Vite) · Vercel'), kind: 'output', group: 'srv' },
      ],
      alt: b(
        "Pipeline MLOps : 1 808 radiographies versionnées avec DVC sont auditées et remappées en 7 classes ; trois variantes YOLOv8s sont entraînées et suivies dans MLflow, évaluées sur trois partitions ; le Champion est servi par une API FastAPI construite et testée par la CD, déployée sur Azure Container Apps, et utilisée par le frontend Snani sur Vercel.",
        'MLOps pipeline: 1,808 X-rays versioned with DVC are audited and remapped into 7 classes; three YOLOv8s variants are trained and tracked in MLflow, evaluated on three splits; the Champion is served by a FastAPI API built and tested by CD, deployed on Azure Container Apps and used by the Snani frontend on Vercel.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Données', 'Data'), text: b('Audit structurel (3 annotations invalides filtrées), 7 classes finales : caries, pathologie périapicale, os parodontal, dent incluse, pathologie radiculaire, dent traitée, implant/dispositif.', 'Structural audit (3 invalid annotations filtered), 7 final classes: caries, periapical pathology, periodontal bone, impacted tooth, root pathology, treated tooth, implant/device.'), source: 'docs/dataset.md, deck' },
        { title: b('Entraînement', 'Training'), text: b('YOLOv8s pré-entraîné COCO ; seule augmentation : flip horizontal (une radio retournée verticalement n’a pas de sens clinique) ; 74 paramètres tracés par run.', 'YOLOv8s pretrained on COCO; only augmentation: horizontal flip (a vertically flipped X-ray has no clinical meaning); 74 parameters logged per run.'), source: 'configs/train.yaml, deck' },
        { title: b('Registre', 'Registry'), text: b('Promotion Champion/Candidate en CLI, sans modifier le code du service, via un alias de checkpoint stable.', 'Champion/Candidate promotion via CLI, without changing service code, through a stable checkpoint alias.'), source: 'configs/model_registry.yaml' },
        { title: b('Service sécurisé', 'Hardened service'), text: b('CORS restreint, 10 req/min et 100 req/h par IP, fichiers ≤ 15 Mo, paramètres bornés, /docs désactivé en image, utilisateur non-root, aucune radio conservée.', 'Restricted CORS, 10 req/min and 100 req/h per IP, files ≤ 15 MB, bounded parameters, /docs disabled in the image, non-root user, no X-ray kept.'), source: 'docs/deployment.md' },
        { title: b('CD', 'CD'), text: b('Tests unitaires, build de l’image Docker, tests d’intégration sur le conteneur (dont POST /predict sur une vraie radio), publication sur ghcr.io.', 'Unit tests, Docker image build, integration tests on the container (including POST /predict on a real X-ray), publication to ghcr.io.'), source: '.github/workflows/cd-service.yml' },
      ],
    },
    decisions: [
      { title: b('Champion = baseline', 'Champion = baseline'), text: b('Meilleur compromis sur eval et test, et rappel supérieur : manquer une anomalie est plus grave qu’un faux positif. Le Candidate, meilleur sur external, reste comparable.', 'Best compromise on eval and test, and higher recall: missing an anomaly is worse than a false positive. The Candidate, better on external, stays available for comparison.'), source: 'model_registry.yaml, deck' },
      { title: b('Coût au repos nul', 'Zero idle cost'), text: b('L’API passe à 0 réplique au repos et n’est réveillée que lorsqu’un visiteur charge une radio (démarrage à froid de 30 à 60 s).', 'The API scales to 0 replicas when idle and only wakes when a visitor loads an X-ray (30–60 s cold start).'), source: 'docs/deployment.md' },
    ],
    results: {
      intro: b('Modèle Champion (yolov8s_7classes_baseline), par partition — tableau 4.2 de la présentation du projet.', 'Champion model (yolov8s_7classes_baseline), per split — Table 4.2 of the project presentation.'),
      table: {
        caption: b('Résultats par partition', 'Results per split'),
        columns: [b('Partition', 'Split'), b('Précision', 'Precision'), b('Rappel', 'Recall'), b('mAP50', 'mAP50'), b('mAP50-95', 'mAP50-95')],
        rows: [
          ['eval', '0.695', '0.393', '0.325', '0.136'],
          ['test', '0.860', '0.467', '0.422', '0.211'],
          ['external', '0.682', '0.383', '0.325', '0.146'],
        ],
        source: 'Table 4.2',
      },
      note: b(
        'La précision élevée sur test (0,86) s’accompagne d’un rappel de 0,47 : plus de la moitié des lésions ne sont pas détectées. Le rapport qualifie ces performances de « modestes » (corpus limité).',
        'The high test precision (0.86) comes with a recall of 0.47: more than half of the lesions are missed. The report calls this performance “modest” (limited corpus).',
      ),
    },
    limitations: [
      b('mAP50 de 0,32 à 0,42 selon la partition : performances modestes, corpus limité.', 'mAP50 of 0.32 to 0.42 depending on the split: modest performance, limited corpus.'),
      b('Aucune validation clinique : projet académique, pas un dispositif médical.', 'No clinical validation: academic project, not a medical device.'),
      b('Démarrage à froid de 30 à 60 s sur la démo publique.', '30–60 s cold start on the public demo.'),
    ],
    nextSteps: [
      b('Enrichir le corpus et tester des résolutions de 1 024 à 1 280 px.', 'Grow the corpus and test 1,024–1,280 px resolutions.'),
      b('Tableau de bord de monitoring (temps de réponse, dérive).', 'Monitoring dashboard (latency, drift).'),
    ],
    sources: ['README.md', 'docs/*.md', 'configs/*.yaml', '.github/workflows/*.yml', 'Documentation/ (deck, slides 7 & 11)'],
  },

  // -------------------------------------------------------------------------
  misinformation: {
    context: b('Projet personnel — NLP', 'Personal project — NLP'),
    challenge: [
      b(
        'Repérer la désinformation médicale dans des tweets arabes (corpus ArCOV19-Rumors), une langue où les outils sont moins nombreux et le texte très bruité (dialectes, diacritiques, emojis).',
        'Spot medical misinformation in Arabic tweets (ArCOV19-Rumors corpus), a language with fewer tools and very noisy text (dialects, diacritics, emojis).',
      ),
    ],
    solution: b(
      "Fine-tuning d'AraBERT (bert-base-arabertv02) avec normalisation arabe, découpage stratifié, déduplication et seuil de décision réglé, comparé à une baseline TF-IDF.",
      'Fine-tuning AraBERT (bert-base-arabertv02) with Arabic normalisation, stratified splits, deduplication and a tuned decision threshold, compared with a TF-IDF baseline.',
    ),
    architecture: {
      nodes: [
        { label: b('ArCOV19-Rumors', 'ArCOV19-Rumors'), detail: b('tweet_verification · 3 584 tweets', 'tweet_verification · 3,584 tweets'), kind: 'source' },
        { label: b('Normalisation arabe', 'Arabic normalisation'), detail: b('diacritiques, URL, mentions, emojis, variantes de caractères', 'diacritics, URLs, mentions, emojis, character variants'), kind: 'process' },
        { label: b('Déduplication', 'Deduplication'), detail: b('617 doublons retirés → 2 967', '617 duplicates removed → 2,967'), kind: 'process' },
        { label: b('Fine-tuning AraBERTv02', 'AraBERTv02 fine-tuning'), detail: b('5 époques · lr 2e-5 · max 128 tokens', '5 epochs · lr 2e-5 · max 128 tokens'), kind: 'model', group: 'm' },
        { label: b('Baseline TF-IDF', 'TF-IDF baseline'), kind: 'model', group: 'm' },
        { label: b('Seuil 0,70 · analyse d’erreurs', '0.70 threshold · error analysis'), kind: 'output' },
      ],
      alt: b(
        'Pipeline NLP : tweets ArCOV19-Rumors normalisés et dédupliqués, AraBERTv02 fine-tuné et comparé à une baseline TF-IDF, seuil de décision réglé à 0,70.',
        'NLP pipeline: ArCOV19-Rumors tweets normalised and deduplicated, AraBERTv02 fine-tuned and compared with a TF-IDF baseline, decision threshold tuned to 0.70.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Entraînement robuste', 'Robust training'), text: b('Découpage stratifié train/validation/test (2 373 / 297 / 297), graine 42, réessai automatique avec un batch plus petit en cas de mémoire GPU insuffisante.', 'Stratified train/validation/test split (2,373 / 297 / 297), seed 42, automatic retry with a smaller batch on GPU out-of-memory.'), source: 'train.py, final_report.txt' },
        { title: b('Améliorations mesurées', 'Measured improvements'), text: b('Scripts dédiés : déduplication, optimisation du seuil, analyse d’erreurs, exécutions multi-graines, baseline TF-IDF.', 'Dedicated scripts: deduplication, threshold optimisation, error analysis, multi-seed runs, TF-IDF baseline.'), source: 'src/improve_*.py' },
      ],
    },
    results: {
      metrics: [
        { value: '0.869', label: b('accuracy', 'accuracy'), context: b('modèle final, 297 tweets de test, après déduplication, seuil 0,70', 'final model, 297 test tweets, after deduplication, threshold 0.70'), source: 'final_report.txt' },
        { value: '0.869', label: b('F1 macro', 'macro F1'), context: b('même jeu de test', 'same test set'), source: 'final_report.txt' },
      ],
      table: {
        caption: b('Avant déduplication, même jeu de test (359 tweets)', 'Before deduplication, same test set (359 tweets)'),
        columns: [b('Modèle', 'Model'), b('Accuracy', 'Accuracy'), b('F1 macro', 'Macro F1')],
        rows: [
          ['AraBERTv02 (seuil 0.50)', '0.894', '0.894'],
          ['TF-IDF baseline', '0.908', '0.908'],
        ],
        source: 'COMPARATIVE_REPORT.md, baseline_report.txt',
      },
      note: b(
        "Sur ce jeu de données, la baseline TF-IDF fait légèrement mieux qu'AraBERT avant déduplication. Après déduplication (moins de fuites entre doublons), AraBERT descend à 0,869 ; la baseline n'a pas été réévaluée sur ce nouveau jeu de test.",
        'On this dataset, the TF-IDF baseline does slightly better than AraBERT before deduplication. After deduplication (fewer leaks between duplicates), AraBERT drops to 0.869; the baseline was not re-evaluated on that new test set.',
      ),
    },
    limitations: [
      b('Petit jeu de données (2 967 tweets) : un seul découpage de test publié.', 'Small dataset (2,967 tweets): a single published test split.'),
      b('Le gain d’AraBERT sur une baseline lexicale n’est pas démontré ici.', 'AraBERT’s gain over a lexical baseline is not demonstrated here.'),
    ],
    nextSteps: [b('Réévaluer la baseline sur le jeu dédupliqué ; agréger les exécutions multi-graines.', 'Re-evaluate the baseline on the deduplicated set; aggregate the multi-seed runs.')],
    sources: ['README.md', 'config.yaml', 'models/final_report.txt', 'improvements/*'],
  },

  // -------------------------------------------------------------------------
  pointfed: {
    context: b('Mini-projet académique — apprentissage fédéré', 'Academic mini-project — federated learning'),
    challenge: [
      b(
        "Entraîner un classifieur de nuages de points 3D quand les données ne peuvent pas être centralisées : soit réparties entre clients (fédération horizontale), soit séparées par type d'attribut entre deux entités (fédération verticale).",
        'Train a 3D point-cloud classifier when data cannot be centralised: either split across clients (horizontal federation) or split by attribute type between two parties (vertical federation).',
      ),
    ],
    solution: b(
      'Le dépôt implémente avec FeaStNet (réseau de graphes) cinq configurations : centralisée, FedAvg codé à la main en IID et non-IID sur 4 clients, fédération verticale (géométrie XYZ d’un côté, couleurs RGB de l’autre) et distillation vers un élève réduit.',
      'The repository implements five configurations with FeaStNet (graph network): centralised, hand-written FedAvg on 4 clients in IID and non-IID, vertical federation (XYZ geometry on one side, RGB colours on the other) and distillation into a smaller student.',
    ),
    architecture: {
      nodes: [
        { label: b('ShapeNet via CAP3D', 'ShapeNet via CAP3D'), detail: b('50 classes · 1 024 points · split 70/15/15', '50 classes · 1,024 points · 70/15/15 split'), kind: 'source' },
        { label: b('Graphe k-NN + FeaStConv', 'k-NN graph + FeaStConv'), detail: b('enseignant [64, 128, 256] · élève [32, 64, 64]', 'teacher [64, 128, 256] · student [32, 64, 64]'), kind: 'model' },
        { label: b('FedAvg (4 clients, 20 rondes)', 'FedAvg (4 clients, 20 rounds)'), detail: b('IID · non-IID par domaine', 'IID · non-IID by domain'), kind: 'process', group: 'fl' },
        { label: b('Fédération verticale', 'Vertical federation'), detail: b('XYZ / RGB → embeddings concaténés', 'XYZ / RGB → concatenated embeddings'), kind: 'process', group: 'fl' },
        { label: b('Distillation', 'Distillation'), detail: b('τ = 4, α = 0,5', 'τ = 4, α = 0.5'), kind: 'process', group: 'fl' },
      ],
      alt: b(
        'Schéma : nuages de points ShapeNet traités par un réseau FeaStNet ; trois scénarios — FedAvg horizontal sur quatre clients, fédération verticale entre géométrie et couleur, distillation vers un élève réduit.',
        'Diagram: ShapeNet point clouds processed by a FeaStNet network; three scenarios — horizontal FedAvg over four clients, vertical federation between geometry and colour, distillation into a smaller student.',
      ),
    },
    implementation: {
      title: b('Méthodes implémentées', 'Implemented methods'),
      items: [
        { title: b('FedAvg à la main', 'Hand-written FedAvg'), text: b('Agrégation pondérée par la taille des partitions, y compris des statistiques de BatchNorm.', 'Aggregation weighted by partition size, including BatchNorm statistics.') },
        { title: b('Fédération verticale', 'Vertical federation'), text: b('Chaque entité encode sa modalité (FeaStConv pour XYZ, MLP pour RGB) ; seul l’embedding de 128 dimensions circule, et les gradients reviennent aux encodeurs.', 'Each party encodes its modality (FeaStConv for XYZ, MLP for RGB); only the 128-dim embedding is exchanged, and gradients flow back to the encoders.') },
        { title: b('Distillation', 'Distillation'), text: b('Perte combinant entropie croisée et divergence KL sur les logits adoucis de l’enseignant figé.', 'Loss combining cross-entropy and KL divergence on the frozen teacher’s softened logits.') },
      ],
    },
    limitations: [
      b(
        "Résultats non publiés ici : les chiffres de référence du README sont produits par un script de résultats simulés (outputs/generate_mock_results.py) et les exécutions réelles versionnées sont des essais rapides. Les performances à pleine échelle restent à mesurer.",
        'Results not published here: the README’s headline figures are produced by a simulated-results script (outputs/generate_mock_results.py) and the real versioned runs are quick trials. Full-scale performance remains to be measured.',
      ),
      b('Fédération simulée sur une seule machine, sans coût de communication réel ; une seule graine.', 'Federation simulated on one machine, with no real communication cost; a single seed.'),
      b('Confidentialité du VFL fondée sur le pooling, sans confidentialité différentielle ni agrégation sécurisée.', 'VFL privacy relies on pooling, with no differential privacy or secure aggregation.'),
    ],
    nextSteps: [b('Exécuter les cinq configurations à pleine échelle et versionner les rapports réels.', 'Run the five configurations at full scale and version the real reports.')],
    sources: ['README.md', 'configs/*.yaml', 'outputs/ (reports, generate_mock_results.py)'],
  },

  // -------------------------------------------------------------------------
  shoplifting: {
    context: b('Projet personnel — vision par ordinateur', 'Personal project — computer vision'),
    challenge: [
      b(
        'Repérer en temps réel des comportements suspects sur une caméra de surveillance standard, sans dépendre de la détection de petits objets.',
        'Spot suspicious behaviour in real time on a standard surveillance camera, without relying on small-object detection.',
      ),
    ],
    solution: b(
      'Un pipeline comportemental : détection des personnes, suivi avec un identifiant stable, extraction de la pose, calcul de features de mouvement et de gestes, puis classification par une règle heuristique ou un LSTM bidirectionnel avec attention.',
      'A behavioural pipeline: person detection, tracking with a stable ID, pose extraction, motion and gesture features, then classification by a heuristic rule or a bidirectional LSTM with attention.',
    ),
    architecture: {
      nodes: [
        { label: b('Flux vidéo', 'Video stream'), kind: 'source' },
        { label: b('YOLO (Ultralytics)', 'YOLO (Ultralytics)'), detail: b('détection des personnes', 'person detection'), kind: 'model' },
        { label: b('DeepSORT', 'DeepSORT'), detail: b('un identifiant par personne', 'one ID per person'), kind: 'process' },
        { label: b('MediaPipe Pose', 'MediaPipe Pose'), detail: b('landmarks', 'landmarks'), kind: 'model' },
        { label: b('Features comportementales', 'Behavioural features'), detail: b('vitesse, temps immobile, main → poche/sac, posture', 'speed, idle time, hand → pocket/bag, posture'), kind: 'process' },
        { label: b('Heuristique', 'Heuristic'), kind: 'model', group: 'clf' },
        { label: b('BiLSTM + attention', 'BiLSTM + attention'), kind: 'model', group: 'clf' },
        { label: b('Alertes en surimpression', 'On-screen alerts'), kind: 'output' },
      ],
      alt: b(
        "Pipeline : la vidéo passe par YOLO (personnes), DeepSORT (suivi), MediaPipe Pose (squelette) ; des features comportementales sont classées par une heuristique ou un LSTM bidirectionnel avec attention, qui déclenche des alertes à l'écran.",
        'Pipeline: video goes through YOLO (people), DeepSORT (tracking), MediaPipe Pose (skeleton); behavioural features are classified by a heuristic or a bidirectional LSTM with attention, which raises on-screen alerts.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Modules séparés', 'Separate modules'), text: b('detector, tracker, behavior_analyzer, behavior_classifier et utilitaires ; configuration centralisée pour basculer entre heuristique et LSTM.', 'detector, tracker, behavior_analyzer, behavior_classifier and utilities; central configuration to switch between heuristic and LSTM.'), source: 'config.py, *.py' },
        { title: b('Entraînement', 'Training'), text: b('Script d’entraînement sur deux dossiers de vidéos (vol / normal) qui extrait des séquences de features puis entraîne le LSTM.', 'Training script on two video folders (shoplifting / normal) that extracts feature sequences then trains the LSTM.'), source: 'train_model.py' },
        { title: b('Diagnostic', 'Diagnostics'), text: b('Scripts de démonstration, de visualisation des features et de vérification de l’installation.', 'Demo, feature-visualisation and installation-check scripts.'), source: 'demo.py, visualize_features.py' },
      ],
    },
    limitations: [
      b('Aucune métrique publiée : le rapport donne des fourchettes (80–92 % pour le LSTM) sur des vidéos simulées, sans protocole ni jeu de test versionné.', 'No published metric: the report gives ranges (80–92% for the LSTM) on simulated videos, with no protocol or versioned test set.'),
      b('Pas de jeu de données réel de vidéosurveillance ; usage réel non testé.', 'No real surveillance dataset; real-world use not tested.'),
    ],
    sources: ['README.md', '*.py', 'Documentation/Rapport_AmnAI.pdf'],
  },

  // -------------------------------------------------------------------------
  deeplearning: {
    context: b('Série de projets académiques', 'Series of academic projects'),
    challenge: [
      b(
        "Comprendre le deep learning de l'intérieur, du perceptron aux techniques de compression, en mesurant à chaque étape ce qui marche et ce qui ne marche pas.",
        'Understand deep learning from the inside, from the perceptron to compression techniques, measuring at each step what works and what does not.',
      ),
    ],
    solution: b(
      'Cinq projets progressifs : MLP sur données tabulaires, convolutions codées à la main en NumPy, triage de radiographies (classification et détection), puis distillation de connaissances vers des modèles embarquables.',
      'Five progressive projects: MLPs on tabular data, convolutions hand-coded in NumPy, chest X-ray triage (classification and detection), then knowledge distillation into embeddable models.',
    ),
    implementation: {
      title: b('Les cinq projets', 'The five projects'),
      items: [
        { title: b('MLP — maladie cardiaque', 'MLP — heart disease'), text: b('Gestion des valeurs manquantes (1 759), MLP 21 → 32 → 16 → 2 (1 266 paramètres) comparé à un modèle linéaire et à un réseau plus profond.', 'Missing-value handling (1,759), MLP 21 → 32 → 16 → 2 (1,266 parameters) compared with a linear model and a deeper network.'), source: 'Heart_Disease_MLP' },
        { title: b('MLP — trois problèmes supervisés', 'MLP — three supervised problems'), text: b('Régression énergétique, classification multiclasse et détection de fraude.', 'Energy regression, multiclass classification and fraud detection.'), source: 'MLP_Supervised_Learning' },
        { title: b('Convolutions from scratch', 'Convolutions from scratch'), text: b('Convolutions 1D, 2D et 3D en NumPy sur un ECG, une radio et une IRM (filtres de Sobel, coupes).', '1D, 2D and 3D convolutions in NumPy on an ECG, an X-ray and an MRI (Sobel filters, slices).'), source: 'Convolutions_From_Scratch' },
        { title: b('Triage de radiographies', 'X-ray triage'), text: b('CNN et VGG16 gelé pour la pneumonie ; IoU et NMS codés et testés ; comparaison de vitesse de détecteurs COCO.', 'CNN and frozen VGG16 for pneumonia; IoU and NMS coded and tested; speed comparison of COCO detectors.'), source: 'Medical_Image_Triage' },
        { title: b('Distillation', 'Distillation'), text: b('KD, Attention Transfer, FitNets et RKD sur MNIST (élève de 7 539 paramètres) et CIFAR-10.', 'KD, Attention Transfer, FitNets and RKD on MNIST (7,539-parameter student) and CIFAR-10.'), source: 'Knowledge_Distillation' },
      ],
    },
    results: {
      metrics: [
        { value: '84.8 %', label: b('accuracy — maladie cardiaque', 'accuracy — heart disease'), context: b('184 patients de test ; rappel 0,91 sur les malades ; linéaire : 72,8 %', '184 test patients; recall 0.91 on sick patients; linear: 72.8%'), source: 'Heart_Disease_MLP/README.md' },
        { value: '0.903', label: b('ROC-AUC — fraude bancaire', 'ROC-AUC — bank fraud'), context: b('rappel 84,5 %, précision 60,2 % sur la classe à risque', 'recall 84.5%, precision 60.2% on the risk class'), source: 'Bank_Fraud_Detection/README.md' },
        { value: '93.2–93.3 %', label: b('accuracy — pneumonie', 'accuracy — pneumonia'), context: b('CNN de base et VGG16 gelé', 'baseline CNN and frozen VGG16'), source: 'Medical_Image_Triage/README.md' },
        { value: '243 vs 5 881 ms', label: b('YOLOv8n vs Faster R-CNN', 'YOLOv8n vs Faster R-CNN'), context: b('vitesse seule, CPU, 20 radios, détecteurs COCO sans sens clinique', 'speed only, CPU, 20 X-rays, COCO detectors with no clinical meaning'), source: 'Medical_Image_Triage/README.md' },
      ],
      note: b(
        'Les échecs sont documentés : le modèle multiclasse ne dépasse pas le hasard (3,2 % contre 3,3 %), et sur CIFAR-10 l’élève seul (81,8 %) fait mieux que l’élève distillé (76,5 %).',
        'Failures are documented: the multiclass model does no better than chance (3.2% vs 3.3%), and on CIFAR-10 the student alone (81.8%) beats the distilled student (76.5%).',
      ),
    },
    limitations: [
      b('Triage partiel : fine-tuning de VGG16/ResNet50 et entraînement complet du U-Net non menés à terme.', 'Partial triage: VGG16/ResNet50 fine-tuning and full U-Net training not completed.'),
      b('Enseignant MNIST mal entraîné (33,96 %) : l’apport de la distillation n’y est pas démontrable.', 'Poorly trained MNIST teacher (33.96%): distillation’s benefit cannot be shown there.'),
    ],
    sources: ['README.md', 'sub-project READMEs and notebooks'],
  },

  // -------------------------------------------------------------------------
  segmentation: {
    context: b('Projet académique — segmentation', 'Academic project — segmentation'),
    challenge: [
      b('Segmenter des scènes urbaines pixel par pixel (Cityscapes) et tester si une auto-distillation améliore un U-Net de référence.', 'Segment urban scenes pixel by pixel (Cityscapes) and test whether self-distillation improves a reference U-Net.'),
    ],
    solution: b(
      'Trois notebooks : exploration du dataset, U-Net de référence en PyTorch (chargement, transformations conjointes image/masque, métriques depuis la matrice de confusion), puis variante auto-distillée.',
      'Three notebooks: dataset exploration, reference U-Net in PyTorch (loading, joint image/mask transforms, metrics from the confusion matrix), then a self-distilled variant.',
    ),
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Données', 'Data'), text: b('Images leftImg8bit et annotations fines gtFine de Cityscapes, préparation des masques.', 'Cityscapes leftImg8bit images and gtFine fine annotations, mask preparation.'), source: 'dataset_visualisation.ipynb' },
        { title: b('Métriques', 'Metrics'), text: b('mIoU et pixel accuracy calculés à partir de la matrice de confusion.', 'mIoU and pixel accuracy computed from the confusion matrix.'), source: 'model_unet_baseline.ipynb' },
      ],
    },
    results: {
      metrics: [
        { value: '0.284', label: b('mIoU — U-Net de référence', 'mIoU — reference U-Net'), context: b('validation ; pixel accuracy 0,822', 'validation; pixel accuracy 0.822'), source: 'model_unet_baseline.ipynb (outputs)' },
        { value: '0.080', label: b('mIoU — variante auto-distillée', 'mIoU — self-distilled variant'), context: b('validation ; pixel accuracy 0,482', 'validation; pixel accuracy 0.482'), source: 'unet_selfdistill.ipynb (outputs)' },
      ],
      note: b('L’auto-distillation n’a pas amélioré le modèle dans cette expérience.', 'Self-distillation did not improve the model in this experiment.'),
    },
    limitations: [
      b('Le notebook d’auto-distillation dépend de modules src/ et de checkpoints non publiés : non reproductible en l’état.', 'The self-distillation notebook depends on unpublished src/ modules and checkpoints: not reproducible as is.'),
      b('mIoU de référence encore faible pour Cityscapes.', 'Reference mIoU still low for Cityscapes.'),
    ],
    sources: ['README.md', '*.ipynb (executed outputs)'],
  },

  // -------------------------------------------------------------------------
  ccsvm: {
    context: b('Travaux pratiques académiques — optimisation', 'Academic coursework — optimisation'),
    challenge: [
      b('Étudier les SVM quand les données sont incertaines : les contraintes de classification ne doivent être satisfaites qu’avec une probabilité donnée.', 'Study SVMs when data is uncertain: classification constraints only need to hold with a given probability.'),
    ],
    solution: b(
      'Quatre notebooks formulent et résolvent des SVM à contraintes probabilistes avec CVXPY, choisissent leurs hyperparamètres par optimisation multiniveau et relient les résultats à la théorie de la généralisation.',
      'Four notebooks formulate and solve chance-constrained SVMs with CVXPY, choose hyperparameters by multilevel optimisation and connect results to generalisation theory.',
    ),
    implementation: {
      title: b('Travaux pratiques', 'Coursework'),
      items: [
        { title: b('TP1 — données simulées', 'TP1 — simulated data'), text: b('SVC probabiliste en cas gaussien et uniforme, optimisation bilevel.', 'Probabilistic SVC with Gaussian and uniform noise, bilevel optimisation.') },
        { title: b('TP2 — Breast Cancer', 'TP2 — Breast Cancer'), text: b('SVC linéaire sur mesures médicales bruitées, bornes VC.', 'Linear SVC on noisy medical measurements, VC bounds.') },
        { title: b('TP3 — Seeds', 'TP3 — Seeds'), text: b('Multiclasse One-vs-Rest et One-vs-One.', 'Multiclass One-vs-Rest and One-vs-One.') },
        { title: b('TP4 — Diabetes', 'TP4 — Diabetes'), text: b('SVR probabiliste à bande ε, sélection multiniveau de C, ε et p.', 'Probabilistic ε-band SVR, multilevel selection of C, ε and p.') },
      ],
    },
    limitations: [b('Travail d’étude : les notebooks rapportent des bornes théoriques et des erreurs, pas un modèle destiné à un usage applicatif.', 'Study work: the notebooks report theoretical bounds and errors, not a model meant for an application.')],
    sources: ['README.md', 'TP1–TP4 notebooks'],
  },

  // -------------------------------------------------------------------------
  speaker: {
    context: b('Projet personnel — traitement du signal', 'Personal project — signal processing'),
    challenge: [
      b(
        "Identifier un locuteur dans des communications radio de police, où le canal coupe les fréquences, ajoute du bruit et compresse la dynamique.",
        'Identify a speaker in police radio communications, where the channel cuts frequencies, adds noise and compresses dynamics.',
      ),
    ],
    solution: b(
      'Un pipeline qui simule un canal radio P25 sur des voix VoxCeleb, augmente les données par niveaux de SNR, extrait des features acoustiques robustes et entraîne un SVM, avec une interface Streamlit de démonstration.',
      'A pipeline that simulates a P25 radio channel on VoxCeleb voices, augments data across SNR levels, extracts robust acoustic features and trains an SVM, with a Streamlit demo interface.',
    ),
    architecture: {
      nodes: [
        { label: b('VoxCeleb', 'VoxCeleb'), detail: b('50 locuteurs (« agents »)', '50 speakers (“agents”)'), kind: 'source' },
        { label: b('Simulation canal P25', 'P25 channel simulation'), detail: b('passe-bande · bruit (SNR) · compression', 'band-pass · noise (SNR) · compression'), kind: 'process' },
        { label: b('Features', 'Features'), detail: b('MFCC, deltas, contraste spectral, ZCR', 'MFCC, deltas, spectral contrast, ZCR'), kind: 'process' },
        { label: b('SVM (noyau RBF)', 'SVM (RBF kernel)'), detail: b('grid search', 'grid search'), kind: 'model' },
        { label: b('Interface Streamlit', 'Streamlit interface'), kind: 'output' },
      ],
      alt: b(
        'Pipeline : voix VoxCeleb passées dans un canal radio P25 simulé, features MFCC et spectrales, SVM à noyau RBF, interface Streamlit.',
        'Pipeline: VoxCeleb voices passed through a simulated P25 radio channel, MFCC and spectral features, RBF-kernel SVM, Streamlit interface.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Construction du dataset', 'Dataset construction'), text: b('Sélection de 50 agents, plusieurs versions de chaque enregistrement à différents SNR.', 'Selection of 50 agents, several versions of each recording at different SNRs.'), source: 'selection_agents.py, dataset_construction.py' },
        { title: b('Entraînement', 'Training'), text: b('Découpage 70/15/15 stratifié par agent, SVM RBF, recherche d’hyperparamètres, rapport par agent.', '70/15/15 split stratified by agent, RBF SVM, hyperparameter search, per-agent report.'), source: 'train_model*.py' },
      ],
    },
    results: {
      metrics: [
        { value: '86.98 %', label: b('accuracy de test', 'test accuracy'), context: b('2 250 échantillons, 50 agents ; validation 86,89 %, entraînement 92,15 %', '2,250 samples, 50 agents; validation 86.89%, training 92.15%'), source: 'Documentation/rapport (OCR)' },
      ],
      note: b(
        "L'augmentation par SNR est faite avant un découpage aléatoire non groupé : des versions bruitées d'un même enregistrement peuvent se trouver à la fois en entraînement et en test. Ce score est donc probablement optimiste.",
        'SNR augmentation happens before a non-grouped random split: noisy versions of the same recording can end up in both training and test. This score is therefore likely optimistic.',
      ),
    },
    limitations: [
      b('Fuite possible entre entraînement et test (voir ci-dessus) ; un découpage par enregistrement ou par vidéo serait plus fiable.', 'Possible train/test leakage (see above); splitting by recording or by video would be more reliable.'),
      b('Canal radio simulé, pas d’enregistrements radio réels.', 'Simulated radio channel, no real radio recordings.'),
    ],
    sources: ['README.md', 'reconnaisance_locuteur/*.py', 'Documentation/rapport_detection_locuteur.pdf'],
  },

  // -------------------------------------------------------------------------
  motoscraper: {
    context: b('Projet de fin d’année — data', 'Year-end project — data'),
    challenge: [
      b(
        "Savoir si importer une moto d'occasion d'Europe au Maroc est rentable demande de croiser trois sources : le prix de l'annonce, la valeur taxable en douane et le prix du marché local.",
        'Knowing whether importing a used motorcycle from Europe to Morocco pays off requires combining three sources: the listing price, the customs taxable value and the local market price.',
      ),
    ],
    solution: b(
      "Un script Python automatise la collecte : annonces européennes (LeParking), valeur taxable via le portail web de la douane marocaine, prix moyen sur Avito, puis calcul de la marge brute de chaque annonce et graphique par modèle.",
      'A Python script automates collection: European listings (LeParking), taxable value through the Moroccan customs web portal, average price on Avito, then each listing’s gross margin and a chart per model.',
    ),
    architecture: {
      nodes: [
        { label: b('LeParking', 'LeParking'), detail: b('annonces Europe (pays choisi)', 'Europe listings (chosen country)'), kind: 'source', group: 's' },
        { label: b('Portail douane.gov.ma', 'douane.gov.ma portal'), detail: b('valeur taxable', 'taxable value'), kind: 'source', group: 's' },
        { label: b('Avito', 'Avito'), detail: b('prix moyen au Maroc', 'average price in Morocco'), kind: 'source', group: 's' },
        { label: b('Selenium + Pandas', 'Selenium + Pandas'), detail: b('rapprochement des modèles, filtrage < 5 ans', 'model matching, < 5-year filter'), kind: 'process' },
        { label: b('Marge brute et rentabilité', 'Gross margin and profitability'), detail: b('CSV + graphique en chandeliers', 'CSV + candlestick chart'), kind: 'output' },
      ],
      alt: b(
        'Pipeline : annonces LeParking, valeur taxable du portail des douanes et prix Avito sont collectés avec Selenium, rapprochés avec Pandas, puis transformés en marge brute par annonce.',
        'Pipeline: LeParking listings, customs portal taxable values and Avito prices are collected with Selenium, matched with Pandas, then turned into a gross margin per listing.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Scraping multi-sources', 'Multi-source scraping'), text: b('Selenium (attentes explicites, navigation entre pages) sur trois sites, rapprochement approximatif des noms de modèles.', 'Selenium (explicit waits, pagination) on three sites, fuzzy matching of model names.'), source: 'import_moto.py' },
        { title: b('Calcul', 'Computation'), text: b('Marge brute = prix Maroc − (prix d’achat + droits) ; export CSV et visualisation par modèle.', 'Gross margin = Moroccan price − (purchase price + duties); CSV export and per-model chart.'), source: 'import_moto.py' },
      ],
    },
    results: {
      metrics: [
        { value: '5 / 83', label: b('annonces avec une marge brute positive', 'listings with a positive gross margin'), context: b('Yamaha MT-09 / MT-09 SP en Espagne ; rentabilité médiane −20,9 %', 'Yamaha MT-09 / MT-09 SP in Spain; median profitability −20.9%'), source: 'resultats_analyse_rentabilite.csv' },
      ],
      note: b('Sur cet échantillon, importer est rarement rentable : l’outil sert justement à le vérifier avant d’acheter.', 'On this sample, importing is rarely profitable: the tool exists precisely to check that before buying.'),
    },
    limitations: [
      b('CAPTCHA sur certains sites, contourné par une solution manuelle (rapport).', 'CAPTCHAs on some sites, handled with a manual workaround (report).'),
      b('Dépend de la structure HTML des sites ; marge brute hors frais annexes.', 'Depends on the sites’ HTML structure; gross margin excludes ancillary costs.'),
    ],
    sources: ['README.md', 'import_moto.py', 'resultats_*.csv', 'Documentation et Rapport/rapport_pfa_jad_falaq.pdf'],
  },

  // -------------------------------------------------------------------------
  irrigation: {
    context: b('Projet personnel — IoT et mobile', 'Personal project — IoT and mobile'),
    challenge: [
      b(
        "Piloter l'irrigation de plusieurs zones depuis un téléphone, en sécurité : une seule zone active à la fois, des commandes validées, un historique de la consommation.",
        'Control irrigation of several zones from a phone, safely: one active zone at a time, validated commands, a history of water use.',
      ),
    ],
    solution: b(
      "Une application Flutter écrit les commandes dans Firebase Realtime Database ; un ESP32 les relaie par liaison série à un Arduino Mega, qui pilote les relais via une machine à états.",
      'A Flutter app writes commands to Firebase Realtime Database; an ESP32 relays them over serial to an Arduino Mega, which drives the relays through a state machine.',
    ),
    architecture: {
      nodes: [
        { label: b('Application Flutter', 'Flutter app'), detail: b('Firebase Auth · Google Sign-In · Provider · FL Chart', 'Firebase Auth · Google Sign-In · Provider · FL Chart'), kind: 'source' },
        { label: b('Firebase Realtime Database', 'Firebase Realtime Database'), detail: b('commandes, plannings, historique', 'commands, schedules, history'), kind: 'infra' },
        { label: b('ESP32 (PlatformIO)', 'ESP32 (PlatformIO)'), detail: b('lecture des commandes, capteurs', 'reads commands, sensors'), kind: 'process' },
        { label: b('Arduino Mega', 'Arduino Mega'), detail: b('liaison série · machine à états', 'serial link · state machine'), kind: 'process' },
        { label: b('Relais · pompes / électrovannes', 'Relays · pumps / valves'), kind: 'output' },
      ],
      alt: b(
        "Architecture : l'application Flutter écrit dans Firebase Realtime Database ; l'ESP32 lit les commandes et les transmet par liaison série à l'Arduino Mega, qui pilote les relais des pompes et électrovannes.",
        'Architecture: the Flutter app writes to Firebase Realtime Database; the ESP32 reads commands and forwards them over serial to the Arduino Mega, which drives the pump and valve relays.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Application', 'App'), text: b('Écrans Accueil, Bassin, Planning, Statistiques et Paramètres ; plannings par zone et historique d’arrosage.', 'Home, Tank, Schedule, Statistics and Settings screens; per-zone schedules and watering history.'), source: 'app flutter/' },
        { title: b('Sécurité des commandes', 'Command safety'), text: b('Une seule zone active à la fois, validation des commandes, machine à états côté Arduino.', 'One active zone at a time, command validation, state machine on the Arduino side.'), source: 'README, arduino_mega/*.ino' },
      ],
    },
    limitations: [b('Aucune mesure publiée (fiabilité, latence, consommation réelle d’eau).', 'No published measurement (reliability, latency, actual water usage).')],
    sources: ['README.md', 'app flutter/', 'esp_32/main.cpp', 'arduino_mega/*.ino'],
  },
}
