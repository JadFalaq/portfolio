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
        "Une offre liste des exigences ; un CV contient des preuves, souvent formulées avec d'autres mots (« apprentissage profond » au lieu de « deep learning »). Les ATS et les recruteurs pressés cherchent pourtant les termes exacts de l'offre.",
        'A job offer lists requirements; a CV contains evidence, often in different words (“apprentissage profond” instead of “deep learning”). ATS and busy recruiters still look for the offer’s exact terms.',
      ),
      b(
        "Demander à un LLM « mon CV correspond-il ? » ne suffit pas : il peut citer une preuve qui n'existe pas, se tromper de statut ou ajouter un chiffre dans une reformulation. L'outil doit aider à reformuler sans jamais inventer d'expérience.",
        'Asking an LLM “does my CV match?” is not enough: it can cite evidence that does not exist, mislabel a status or add a figure to a rewrite. The tool must help rephrase without ever inventing experience.',
      ),
    ],
    solution: b(
      "Un graphe LangGraph analyse l'offre, indexe le CV, puis évalue chaque compétence en parallèle : il retrouve les passages du CV qui la prouvent, demande un verdict au LLM et le confronte à des contrôles déterministes. Chaque compétence reçoit un statut (visible, cachée, implicite, absente) et, si possible, une reformulation de la ligne existante. Le score est calculé en code, et le candidat valide les reformulations avant le bilan final. Principe : le LLM propose, le code vérifie.",
      'A LangGraph graph parses the offer, indexes the CV, then assesses each skill in parallel: it retrieves the CV passages that prove it, asks the LLM for a verdict and checks it with deterministic rules. Each skill gets a status (visible, hidden, implicit, absent) and, when possible, a rewrite of the existing line. The score is computed in code, and the candidate approves the rewrites before the final report. Principle: the LLM proposes, the code verifies.',
    ),
    architecture: {
      nodes: [
        { label: b("Offre d'emploi", 'Job offer'), detail: b('≤ 8 000 caractères', '≤ 8,000 characters'), kind: 'source', group: 'in' },
        { label: b('CV', 'CV'), detail: b('PDF ≤ 5 pages, Markdown ou texte', 'PDF ≤ 5 pages, Markdown or text'), kind: 'source', group: 'in' },
        { label: b('parse_offer ⟲ verify_exhaustivity', 'parse_offer ⟲ verify_exhaustivity'), detail: b('« que manque-t-il ? » — 2 relectures max', '“what is missing?” — up to 2 re-reads'), kind: 'model', group: 'p1' },
        { label: b('index_cv', 'index_cv'), detail: b('découpage par section et par bloc · index BM25 (+ embeddings)', 'section/block chunking · BM25 index (+ embeddings)'), kind: 'process', group: 'p1' },
        { label: b('normalize_requirements', 'normalize_requirements'), detail: b('référentiel de 60 compétences FR/EN · dédoublonnage', '60-skill FR/EN taxonomy · deduplication'), kind: 'process' },
        { label: b('Send : une branche par compétence', 'Send: one branch per skill'), detail: b('retrieve (top-4, RRF) → judge ⟲ verify — 3 essais max', 'retrieve (top-4, RRF) → judge ⟲ verify — max 3 tries'), kind: 'model' },
        { label: b('aggregate → summarize', 'aggregate → summarize'), detail: b('scores, reformulations, mots-clés et lacunes calculés en code', 'scores, rewrites, keywords and gaps computed in code'), kind: 'process' },
        { label: b('human_review (interrupt)', 'human_review (interrupt)'), detail: b('le candidat coche les reformulations', 'the candidate ticks the rewrites'), kind: 'output', group: 'out' },
        { label: b('finalize → bilan', 'finalize → report'), detail: b('score final · Markdown', 'final score · Markdown'), kind: 'output', group: 'out' },
      ],
      alt: b(
        "Graphe LangGraph : l'offre est extraite puis relue jusqu'à deux fois pour trouver les compétences oubliées, pendant que le CV est découpé et indexé ; les compétences sont normalisées puis évaluées en parallèle par un sous-graphe retrieve → judge → verify qui renvoie au juge un retour d'erreur jusqu'à trois fois ; les résultats sont agrégés en code, le candidat valide les reformulations, puis le bilan final est produit.",
        'LangGraph graph: the offer is extracted then re-read up to twice to catch missed skills while the CV is chunked and indexed; skills are normalised then assessed in parallel by a retrieve → judge → verify sub-graph that sends error feedback back to the judge up to three times; results are aggregated in code, the candidate approves rewrites, then the final report is produced.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Quatre statuts, arbitrés par le code', 'Four statuses, decided by code'), text: b("Visible : le CV emploie le terme exact de l'offre. Cachée : il prouve la compétence avec d'autres mots. Implicite : elle se déduit d'un outil (FastAPI → API REST). Absente : aucune preuve. « Visible » ou « cachée » n'est jamais laissé au LLM : le code vérifie si le terme exact figure dans la preuve.", 'Visible: the CV uses the offer’s exact term. Hidden: it proves the skill in other words. Implicit: it follows from a tool (FastAPI → REST API). Absent: no evidence. “Visible” vs “hidden” is never left to the LLM: code checks whether the exact term is in the evidence.'), source: 'verification.py' },
        { title: b('Garde-fous contre les inventions', 'Guards against invention'), text: b("Une citation doit exister mot pour mot dans un extrait du CV. Un « absent » est rejeté si le terme figure dans le CV, et l'extrait manquant est ajouté pour le juge. Une reformulation est rejetée si elle ajoute un chiffre, une compétence du référentiel absente de la ligne, si elle omet le terme de l'offre ou si elle fait plus du double de la longueur d'origine.", 'A citation must exist word for word in a CV excerpt. An “absent” is rejected if the term appears in the CV, and the missing excerpt is added for the judge. A rewrite is rejected if it adds a number or a taxonomy skill absent from the line, omits the offer’s term, or is more than twice the original length.'), source: 'verification.py' },
        { title: b('Boucle agentique et repli prudent', 'Agentic loop and safe fallback'), text: b("Un verdict rejeté repart au juge avec la liste précise des erreurs. Après 3 essais : citation introuvable → compétence « absente, à vérifier » ; « absent » contredit par le texte → preuve lexicale retenue ; reformulation invalide → supprimée. Une compétence en échec côté fournisseur ne bloque pas l'analyse.", 'A rejected verdict goes back to the judge with the exact list of errors. After 3 tries: citation not found → skill “absent, to review”; “absent” contradicted by the text → lexical evidence kept; invalid rewrite → dropped. A skill failing on the provider side does not block the analysis.'), source: 'graph.py, verification.py' },
        { title: b('RAG hybride', 'Hybrid RAG'), text: b("BM25 implémenté à la main (toujours actif, hors ligne), embeddings optionnels, fusion par Reciprocal Rank Fusion (k = 60). La requête de chaque compétence est enrichie des synonymes et des déclencheurs implicites du référentiel ; le juge ne voit que les 4 extraits retrouvés.", 'Hand-written BM25 (always on, offline), optional embeddings, Reciprocal Rank Fusion (k = 60). Each skill query is expanded with taxonomy synonyms and implicit triggers; the judge only sees the 4 retrieved excerpts.'), source: 'retrieval.py' },
        { title: b('Score déterministe', 'Deterministic score'), text: b("Exigence indispensable ×3, souhaitée ×1. Crédit actuel : visible 1, cachée 0,6, implicite 0,3. Crédit potentiel après reformulation valide : 1 et 0,85. Trois scores (actuel, potentiel, final selon les reformulations cochées) ; mots-clés suggérés uniquement pour des compétences déjà prouvées.", 'Required skill ×3, nice-to-have ×1. Current credit: visible 1, hidden 0.6, implicit 0.3. Potential credit after a valid rewrite: 1 and 0.85. Three scores (current, potential, final from ticked rewrites); keywords suggested only for skills already proven.'), source: 'config.py, scoring.py' },
        { title: b('Un LLM, plusieurs fournisseurs', 'One LLM interface, several providers'), text: b("Interface unique à sorties structurées (Pydantic) pour Azure OpenAI, OpenAI, Anthropic, Ollama et un LLM factice à règles. Les erreurs fatales (clé, droits) arrêtent l'analyse ; les sorties invalides sont réessayées.", 'One structured-output interface (Pydantic) for Azure OpenAI, OpenAI, Anthropic, Ollama and a rule-based fake LLM. Fatal errors (key, permissions) stop the analysis; invalid outputs are retried.'), source: 'llm.py, fake_llm.py' },
        { title: b('API et site', 'API and site'), text: b("FastAPI : avancement en direct par Server-Sent Events, score et bilan recalculés sans LLM à chaque case cochée. Site Next.js : dépôt du CV, progression compétence par compétence, reformulations à cocher, bilan Markdown téléchargeable.", 'FastAPI: live progress over Server-Sent Events, score and report recomputed without the LLM on every tick. Next.js site: CV upload, skill-by-skill progress, rewrites to tick, downloadable Markdown report.'), source: 'api.py, web/' },
        { title: b('Démo publique sous contrôle', 'Public demo under control'), text: b("Chaque analyse coûte 20 à 50 appels LLM : tailles d'entrée bornées, 5 analyses par heure et par visiteur, 100 par jour, CORS restreint, clé API optionnelle, aucun CV journalisé. Image Docker non-root avec healthcheck.", 'Each analysis costs 20–50 LLM calls: bounded input sizes, 5 analyses per hour per visitor, 100 per day, restricted CORS, optional API key, no CV ever logged. Non-root Docker image with a healthcheck.'), source: 'limits.py, api.py, Dockerfile' },
      ],
    },
    decisions: [
      { title: b('Le score n’est jamais demandé au LLM', 'The score is never asked of the LLM'), text: b('Le LLM juge la couverture ; le chiffre est une somme pondérée en code : reproductible, auditable, testable.', 'The LLM judges coverage; the number is a weighted sum in code: reproducible, auditable, testable.'), source: 'scoring.py' },
      { title: b('Vérifier plutôt que faire confiance', 'Verify rather than trust'), text: b('Chaque sortie du LLM passe par des contrôles textuels avant d’entrer dans le rapport ; une erreur renvoie au juge un retour précis plutôt qu’un nouvel essai aveugle.', 'Every LLM output goes through textual checks before entering the report; an error sends precise feedback to the judge rather than a blind retry.'), source: 'verification.py' },
      { title: b('BM25 d’abord, embeddings en option', 'BM25 first, embeddings optional'), text: b('Sur un document aussi court qu’un CV, la recherche lexicale suffit souvent et fonctionne hors ligne ; les embeddings s’ajoutent par fusion de rangs.', 'On a document as short as a CV, lexical search often suffices and works offline; embeddings are added through rank fusion.'), source: 'retrieval.py, README' },
      { title: b('LLM factice pour tester la plomberie', 'Fake LLM to test the plumbing'), text: b('Tout le graphe (RAG, boucles, score, API) est testé hors ligne, sans clé ni coût, y compris en CI.', 'The whole graph (RAG, loops, score, API) is tested offline, with no key or cost, including in CI.'), source: 'fake_llm.py, tests/' },
      { title: b('États sérialisables', 'Serialisable state'), text: b('Les états du graphe ne contiennent que du JSON : la validation humaine peut être reprise avec n’importe quel checkpointer.', 'Graph state holds only JSON: the human review can be resumed with any checkpointer.'), source: 'graph.py' },
    ],
    results: {
      metrics: [
        { value: '125', label: b('tests collectés — 124 réussis, 1 ignoré', 'tests collected — 124 passed, 1 skipped'), context: b('relancés hors ligne avec le LLM factice ; 13 fichiers (boucles agentiques, garde-fous, propriétés, API)', 're-run offline with the fake LLM; 13 files (agentic loops, guardrails, properties, API)'), source: 'pytest' },
        { value: '60', label: b('compétences dans le référentiel', 'skills in the taxonomy'), context: b('IA, data, MLOps — synonymes FR/EN et déclencheurs implicites', 'AI, data, MLOps — FR/EN synonyms and implicit triggers'), source: 'taxonomy_default.py' },
        { value: '3 jobs', label: b('CI GitHub Actions', 'GitHub Actions CI'), context: b('pytest sur Python 3.10 et 3.12, build du site, build de l’image Docker', 'pytest on Python 3.10 and 3.12, site build, Docker image build'), source: '.github/workflows/ci.yml' },
      ],
      note: b(
        "Aucune métrique de qualité n'est publiée. Le protocole d'évaluation est implémenté (cas synthétiques à vérité connue, perturbation d'un vrai CV, précision/rappel d'extraction, taux de citations inventées, corrélation de Spearman du score, baselines TF-IDF et « un seul prompt »), mais le README indique qu'il n'a pas encore été lancé avec un vrai LLM.",
        'No quality metric is published. The evaluation protocol is implemented (synthetic cases with known truth, perturbation of a real CV, extraction precision/recall, invented-citation rate, Spearman correlation of the score, TF-IDF and “single prompt” baselines), but the README states it has not yet been run with a real LLM.',
      ),
    },
    limitations: [
      b('Jamais évalué contre un vrai LLM ni de vrais embeddings (README).', 'Never evaluated against a real LLM or real embeddings (README).'),
      b('Le juge ne voit que les 4 extraits retrouvés ; un « absent » est revérifié sur tout le CV, mais pas les autres statuts.', 'The judge only sees the 4 retrieved excerpts; an “absent” is re-checked on the whole CV, the other statuses are not.'),
      b('Le statut « implicite » reste subjectif ; les contrôles de reformulation attrapent chiffres et outils inventés, pas toutes les dérives de sens.', 'The “implicit” status remains subjective; rewrite checks catch invented numbers and tools, not every shift in meaning.'),
      b('Référentiel modeste (60 compétences) ; compteurs de débit en mémoire, valables pour une seule instance ; PDF à deux colonnes parfois extraits dans le désordre.', 'Modest taxonomy (60 skills); in-memory rate counters, valid for a single instance; two-column PDFs sometimes extracted out of order.'),
    ],
    nextSteps: [
      b('Lancer l’évaluation avec un vrai fournisseur et publier les résultats.', 'Run the evaluation with a real provider and publish the results.'),
      b('Checkpointer SQLite/Postgres pour reprendre une validation interrompue ; traces LangSmith ; référentiel ESCO.', 'SQLite/Postgres checkpointer to resume an interrupted review; LangSmith traces; ESCO taxonomy.'),
    ],
    sources: ['README.md', 'src/cvmatch/ (graph, verification, retrieval, scoring, llm, api, limits, ingestion, taxonomy)', 'evaluation/', 'tests/ (13 files, 125 tests)', 'web/', '.github/workflows/ci.yml', 'Dockerfile'],
  },

  // -------------------------------------------------------------------------
  ragchatbot: {
    context: b("Projet d'apprentissage — implémentations pas à pas", 'Learning project — step-by-step implementations'),
    challenge: [
      b(
        "Un pipeline RAG enchaîne une série de choix : comment découper, comment rechercher, comment classer les passages. Chaque choix change ce que le LLM voit, mais l'effet est difficile à percevoir tant qu'on n'implémente pas les variantes une par une sur les mêmes données.",
        'A RAG pipeline chains a series of choices: how to chunk, how to retrieve, how to rank passages. Each choice changes what the LLM sees, but the effect is hard to grasp until the variants are implemented one by one on the same data.',
      ),
      b(
        "Les documents réels ne sont pas que du texte : un article scientifique contient des tableaux, des figures et des formules que la recherche textuelle ignore.",
        'Real documents are not just text: a scientific paper holds tables, figures and formulas that text search ignores.',
      ),
    ],
    solution: b(
      "Onze scripts numérotés et un notebook construisent un RAG sur Azure OpenAI et ChromaDB, puis remplacent une brique à la fois : trois découpages, quatre stratégies de recherche, une fusion des classements, une génération qui tient compte de la conversation et une chaîne multimodale sur PDF. Le corpus est fixe : cinq fiches d'entreprises (Google, Microsoft, Nvidia, SpaceX, Tesla) et l'article « Attention Is All You Need ».",
      'Eleven numbered scripts and a notebook build a RAG on Azure OpenAI and ChromaDB, then swap one block at a time: three chunkers, four retrieval strategies, rank fusion, history-aware generation and a multimodal PDF chain. The corpus is fixed: five company files (Google, Microsoft, Nvidia, SpaceX, Tesla) and the “Attention Is All You Need” paper.',
    ),
    architecture: {
      nodes: [
        { label: b('Corpus', 'Corpus'), detail: b('5 fiches texte · 1 PDF scientifique', '5 text files · 1 scientific PDF'), kind: 'source' },
        { label: b('Découpage', 'Chunking'), detail: b('caractères · récursif · sémantique · agentique (LLM) · par titre', 'character · recursive · semantic · agentic (LLM) · by title'), kind: 'process' },
        { label: b('Embeddings Azure OpenAI → ChromaDB', 'Azure OpenAI embeddings → ChromaDB'), detail: b('index HNSW, distance cosinus, persisté sur disque', 'HNSW index, cosine distance, persisted on disk'), kind: 'infra' },
        { label: b('Similarité top-k', 'Top-k similarity'), kind: 'process', group: 'r' },
        { label: b('Seuil de score', 'Score threshold'), kind: 'process', group: 'r' },
        { label: b('MMR', 'MMR'), detail: b('k 3 · fetch_k 10 · λ 0,5', 'k 3 · fetch_k 10 · λ 0.5'), kind: 'process', group: 'r' },
        { label: b('Multi-query → RRF', 'Multi-query → RRF'), detail: b('3 reformulations · fusion k = 60', '3 rewrites · fusion k = 60'), kind: 'process' },
        { label: b('Génération Azure OpenAI', 'Azure OpenAI generation'), detail: b('réponse limitée aux documents · historique de conversation', 'answer limited to documents · conversation history'), kind: 'model' },
      ],
      alt: b(
        "Pipeline : le corpus est découpé selon plusieurs stratégies, vectorisé par Azure OpenAI dans ChromaDB, interrogé par similarité, seuil de score ou MMR, éventuellement avec plusieurs reformulations fusionnées par RRF, puis passé au LLM qui répond uniquement à partir des documents retrouvés.",
        'Pipeline: the corpus is chunked with several strategies, embedded by Azure OpenAI into ChromaDB, queried by similarity, score threshold or MMR, optionally with several rewrites fused by RRF, then passed to the LLM, which answers only from the retrieved documents.',
      ),
    },
    implementation: {
      title: b('Les étapes implémentées', 'Implemented steps'),
      items: [
        { title: b('Ingestion', 'Ingestion'), text: b("Chargement des fichiers, découpage en morceaux de 800 caractères sans chevauchement, embeddings Azure OpenAI par lots de 16 avec 5 reprises automatiques, index Chroma en distance cosinus. L'index existant est réutilisé plutôt que recalculé.", 'File loading, 800-character chunks without overlap, Azure OpenAI embeddings in batches of 16 with 5 automatic retries, Chroma index with cosine distance. An existing index is reused instead of recomputed.'), source: '1_ingestion_pipeline.py' },
        { title: b('Réponse fondée sur les documents', 'Document-grounded answer'), text: b("Le prompt impose de répondre uniquement à partir des 5 passages retrouvés, et de dire explicitement quand l'information manque.", 'The prompt requires answering only from the 5 retrieved passages, and saying explicitly when the information is missing.'), source: '3_answer_generation.py' },
        { title: b('Conversation', 'Conversation'), text: b("Avant chaque recherche, le LLM réécrit la nouvelle question pour qu'elle soit autonome en tenant compte de l'historique ; la recherche porte sur cette version, la réponse garde le fil de la conversation.", 'Before each search, the LLM rewrites the new question to be standalone given the history; retrieval runs on that version, and the answer keeps the conversation thread.'), source: '4_history_aware_generation.py' },
        { title: b('Trois familles de découpage', 'Three chunking families'), text: b("Par caractères puis récursif (paragraphes, lignes, phrases, mots) à 100 caractères ; sémantique, avec coupure quand la distance entre phrases dépasse le 70ᵉ percentile ; agentique, où le LLM place lui-même des marqueurs de coupure autour de 200 caractères.", 'Character-based then recursive (paragraphs, lines, sentences, words) at 100 characters; semantic, splitting when sentence distance exceeds the 70th percentile; agentic, where the LLM places split markers itself around 200 characters.'), source: '5–7_*.py' },
        { title: b('Recherche', 'Retrieval'), text: b('Top-k par similarité, seuil de similarité minimale, puis MMR, qui sélectionne 3 passages parmi 10 candidats en équilibrant pertinence et diversité.', 'Top-k similarity, minimum similarity threshold, then MMR, which picks 3 passages out of 10 candidates balancing relevance and diversity.'), source: '2_*.py, 9_retrieval_methods.py' },
        { title: b('Multi-query et fusion RRF', 'Multi-query and RRF'), text: b("Le LLM produit 3 reformulations (sortie structurée Pydantic) ; chaque reformulation récupère 5 passages ; une Reciprocal Rank Fusion écrite à la main (1/(60 + rang)) fusionne les listes et fait remonter les passages trouvés par plusieurs requêtes.", 'The LLM produces 3 rewrites (Pydantic structured output); each rewrite retrieves 5 passages; a hand-written Reciprocal Rank Fusion (1/(60 + rank)) merges the lists and promotes passages found by several queries.'), source: '10–11_*.py' },
        { title: b('RAG multimodal sur PDF', 'Multimodal PDF RAG'), text: b("Unstructured découpe l'article en mode haute résolution (7 images, 4 tableaux conservés en HTML) puis en 33 chunks par titre. Les chunks qui contiennent tableaux ou images sont résumés par le LLM pour devenir cherchables ; la réponse finale reçoit texte, tableaux et images.", 'Unstructured parses the paper in high-resolution mode (7 images, 4 tables kept as HTML) then into 33 title-based chunks. Chunks containing tables or images are summarised by the LLM to become searchable; the final answer receives text, tables and images.'), source: '8_multi_modal_rag.ipynb' },
      ],
    },
    decisions: [
      { title: b('Une brique à la fois', 'One block at a time'), text: b("Chaque script ne change qu'un élément du pipeline sur le même corpus, pour isoler son effet.", 'Each script changes only one element of the pipeline on the same corpus, to isolate its effect.') },
      { title: b('Rendre cherchables les tableaux et figures', 'Make tables and figures searchable'), text: b("Plutôt que d'indexer du HTML ou des images brutes, le contenu mixte est converti en description textuelle avant les embeddings, tout en conservant l'original pour la réponse.", 'Instead of indexing raw HTML or images, mixed content is turned into a text description before embedding, while the original is kept for the answer.'), source: '8_multi_modal_rag.ipynb' },
    ],
    results: {
      metrics: [
        { value: '33', label: b('chunks multimodaux', 'multimodal chunks'), context: b("issus de l'article, dont 7 images et 4 tableaux détectés", 'from the paper, with 7 images and 4 tables detected'), source: '8_multi_modal_rag.ipynb (outputs)' },
      ],
      note: b(
        "Comparaison qualitative uniquement : les questions de test sont rédigées, mais aucune métrique de recherche (précision@k, fidélité de la réponse) n'est calculée ni versionnée.",
        'Qualitative comparison only: test questions are written, but no retrieval metric (precision@k, answer faithfulness) is computed or versioned.',
      ),
    },
    limitations: [
      b("Pas d'évaluation chiffrée des stratégies : on ne peut pas dire laquelle est la meilleure sur ce corpus.", 'No quantified evaluation of the strategies: there is no way to tell which one is best on this corpus.'),
      b('Corpus très petit ; scripts pédagogiques indépendants plutôt qu’une application.', 'Very small corpus; standalone teaching scripts rather than an application.'),
      b("Dans le notebook multimodal, les consignes de résumé ne sont ajoutées au prompt que lorsque le chunk contient un tableau.", 'In the multimodal notebook, the summary instructions are only added to the prompt when the chunk contains a table.'),
    ],
    nextSteps: [b('Mesurer chaque stratégie sur les questions synthétiques déjà rédigées (synthetic_questions.txt).', 'Measure each strategy on the synthetic questions already written (synthetic_questions.txt).')],
    sources: ['README.md', '1_ingestion_pipeline.py … 11_reciprocal_rank_fusion.py', '8_multi_modal_rag.ipynb (code and outputs)', 'requirements.txt'],
  },

  // -------------------------------------------------------------------------
  bookpipeline: {
    context: b('Projet académique — cours de systèmes distribués', 'Academic project — distributed systems course'),
    challenge: [
      b(
        "Transformer automatiquement des livres PDF ou EPUB en résumés à plusieurs niveaux, questions-réponses, traductions et audio, pour plusieurs livres à la fois, sans intervention manuelle et en gardant une trace de chaque exécution.",
        'Automatically turn PDF or EPUB books into multi-level summaries, Q&A, translations and audio, for several books at once, without manual work and with a record of every run.',
      ),
      b(
        "Les modèles de langage sont lourds à charger : les faire tourner dans les workers de l'orchestrateur rendrait le pipeline lent et fragile.",
        'Language models are heavy to load: running them inside the orchestrator’s workers would make the pipeline slow and brittle.',
      ),
    ],
    solution: b(
      "Deux services séparés. Apache Airflow, conteneurisé avec CeleryExecutor, orchestre un DAG qui découvre les livres, les analyse et crée une branche par livre. Un service ML Flask, lancé à part, exécute les modèles Hugging Face et la synthèse vocale. Les tâches s'échangent des références de fichiers plutôt que les données elles-mêmes ; chaque exécution est rangée dans son propre dossier puis validée.",
      'Two separate services. Apache Airflow, containerised with CeleryExecutor, orchestrates a DAG that discovers books, parses them and creates one branch per book. A separate Flask ML service runs the Hugging Face models and text-to-speech. Tasks exchange file references rather than the data itself; each run is stored in its own folder, then validated.',
    ),
    architecture: {
      nodes: [
        { label: b('data/books/', 'data/books/'), detail: b('PDF, EPUB', 'PDF, EPUB'), kind: 'source' },
        { label: b('discover_books → parse_book', 'discover_books → parse_book'), detail: b('.expand() : une instance par livre · détection de chapitres', '.expand(): one instance per book · chapter detection'), kind: 'process' },
        { label: b('Résumés de chapitres', 'Chapter summaries'), kind: 'model', group: 't' },
        { label: b('Résumés 2 pages · 1 paragraphe', '2-page · 1-paragraph summaries'), kind: 'model', group: 't' },
        { label: b('Questions-réponses', 'Q&A'), detail: b('≥ 20 paires', '≥ 20 pairs'), kind: 'model', group: 't' },
        { label: b('Traduction FR / AR', 'FR / AR translation'), detail: b('tâche unique, livres traités à la suite', 'single task, books processed in turn'), kind: 'model', group: 'tr' },
        { label: b('Synthèse vocale (FR)', 'Text-to-speech (FR)'), kind: 'model', group: 'tr' },
        { label: b('validate_outputs', 'validate_outputs'), detail: b('outputs/<livre>/<exécution>/', 'outputs/<book>/<run>/'), kind: 'output' },
        { label: b('Service ML Flask', 'Flask ML service'), detail: b('FLAN-T5 · NLLB-200 · Coqui YourTTS / gTTS', 'FLAN-T5 · NLLB-200 · Coqui YourTTS / gTTS'), kind: 'infra' },
        { label: b('Airflow (Docker Compose)', 'Airflow (Docker Compose)'), detail: b('webserver · scheduler · worker Celery · Redis · PostgreSQL · Flower', 'webserver · scheduler · Celery worker · Redis · PostgreSQL · Flower'), kind: 'infra' },
      ],
      alt: b(
        "DAG Airflow : les livres sont découverts puis analysés, une branche par livre ; dans chaque branche, résumés et questions-réponses sont demandés au service ML Flask ; une tâche de traduction puis une tâche de synthèse vocale traitent ensuite les livres à la suite ; une validation vérifie les fichiers produits. Airflow tourne sous Docker Compose, le service ML à part.",
        'Airflow DAG: books are discovered then parsed, one branch per book; in each branch, summaries and Q&A are requested from the Flask ML service; a translation task then a text-to-speech task process the books in turn; a validation step checks the produced files. Airflow runs under Docker Compose, the ML service separately.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Orchestration', 'Orchestration'), text: b("Docker Compose : PostgreSQL, Redis, webserver, scheduler, worker Celery, triggerer et Flower pour suivre les workers. DAG déclenché à la main, une seule exécution à la fois, 2 reprises automatiques espacées de 5 minutes.", 'Docker Compose: PostgreSQL, Redis, webserver, scheduler, Celery worker, triggerer and Flower to monitor workers. Manually triggered DAG, one run at a time, 2 automatic retries 5 minutes apart.'), source: 'docker-compose.yml, DAG' },
        { title: b('Une branche par livre', 'One branch per book'), text: b("L'analyse, les quatre générations et la validation utilisent le dynamic task mapping (.expand) : Airflow crée autant d'instances que de livres découverts. Traduction et synthèse vocale passent par des Task Groups qui récupèrent toutes les sorties et traitent les livres à la suite.", 'Parsing, the four generation tasks and validation use dynamic task mapping (.expand): Airflow creates one instance per discovered book. Translation and text-to-speech go through Task Groups that collect all outputs and process the books in turn.'), source: 'DAG' },
        { title: b('Lecture des livres', 'Book parsing'), text: b("PDF lus avec pdfplumber, avec repli sur PyPDF2 en cas d'échec ; EPUB avec ebooklib et BeautifulSoup. Chapitres détectés par motifs (« chapter 3 », « part 2 », titres en majuscules) ; à défaut, découpage en segments de 3 000 caractères.", 'PDFs read with pdfplumber, falling back to PyPDF2 on failure; EPUBs with ebooklib and BeautifulSoup. Chapters detected by patterns (“chapter 3”, “part 2”, uppercase titles); otherwise split into 3,000-character segments.'), source: 'utils/book_parser.py' },
        { title: b('Références de fichiers dans XCom', 'File references in XCom'), text: b("Chaque tâche écrit sa sortie (JSON, texte, WAV) dans outputs/<livre>/<exécution>/ et ne passe à la suivante qu'une référence vers ce fichier : la base de métadonnées d'Airflow ne transporte pas les livres.", 'Each task writes its output (JSON, text, WAV) under outputs/<book>/<run>/ and only passes a reference to that file to the next task: Airflow’s metadata database never carries the books.'), source: 'utils/io.py' },
        { title: b('Service ML', 'ML service'), text: b("API Flask (/summarize, /qa/generate, /translate, /tts, /health). Textes longs découpés en morceaux de 2 000 caractères, résumés puis résumés à nouveau. Modèles chargés une fois et mis en cache, GPU détecté automatiquement, demi-précision et option 8 bits.", 'Flask API (/summarize, /qa/generate, /translate, /tts, /health). Long texts split into 2,000-character chunks, summarised then summarised again. Models loaded once and cached, GPU auto-detected, half precision and an 8-bit option.'), source: 'ml_service/app.py, pipelines/' },
        { title: b('Génération', 'Generation'), text: b("FLAN-T5 : trois styles de résumé (puces par chapitre, 2 pages, 1 paragraphe) ; questions générées en alternant cinq formulations de prompt, puis réponses générées à partir du texte. NLLB-200 (600M distillé) pour le français et l'arabe ; Coqui YourTTS, avec gTTS en repli.", 'FLAN-T5: three summary styles (per-chapter bullets, 2 pages, 1 paragraph); questions generated by cycling five prompt phrasings, then answers generated from the text. NLLB-200 (distilled 600M) for French and Arabic; Coqui YourTTS, with gTTS as a fallback.'), source: 'pipelines/seq2seq_prompt.py, translator.py, tts_engine.py' },
        { title: b('Robustesse', 'Robustness'), text: b("Client HTTP avec délai de 5 minutes et 3 essais à attente exponentielle ; contrôle de santé du service avant les résumés ; tâche finale qui liste les fichiers attendus manquants pour chaque livre.", 'HTTP client with a 5-minute timeout and 3 retries with exponential backoff; service health check before summarising; final task listing the missing expected files for each book.'), source: 'utils/ml_client.py, utils/io.py' },
      ],
    },
    decisions: [
      { title: b('Les modèles hors d’Airflow', 'Models outside Airflow'), text: b('Airflow orchestre, le service ML calcule : les workers restent légers et les modèles ne sont chargés qu’une fois.', 'Airflow orchestrates, the ML service computes: workers stay light and models are loaded only once.') },
      { title: b('Des références plutôt que des données', 'References rather than data'), text: b('Passer des chemins de fichiers dans XCom évite de surcharger la base de métadonnées et garde chaque sortie consultable sur disque.', 'Passing file paths through XCom avoids overloading the metadata database and keeps every output inspectable on disk.') },
      { title: b('Une exécution, un dossier', 'One run, one folder'), text: b('Les sorties sont rangées par livre et par identifiant d’exécution, avec un fichier de métadonnées : deux exécutions ne s’écrasent jamais.', 'Outputs are stored per book and per run id, with a metadata file: two runs never overwrite each other.') },
    ],
    results: {
      metrics: [
        { value: '≥ 20', label: b('paires Q&A demandées par livre', 'Q&A pairs requested per book'), context: b('minimum imposé par le service, qui complète si besoin — pas une mesure de qualité', 'minimum enforced by the service, which tops up if needed — not a quality measure'), source: 'ml_service/app.py' },
        { value: '5–15 min', label: b('par livre', 'per book'), context: b('ordre de grandeur rapporté dans le rapport, sans protocole de mesure', 'order of magnitude reported in the project report, without a measurement protocol'), source: 'Rapport_Projet_Book_Pipeline.md §6.2' },
      ],
      note: b('La qualité des résumés, des questions et des traductions n’est mesurée par aucune métrique.', 'The quality of summaries, questions and translations is not measured by any metric.'),
    },
    limitations: [
      b('Traduction et synthèse vocale ne sont pas parallélisées par livre : une tâche unique traite les livres à la suite.', 'Translation and text-to-speech are not parallelised per book: a single task processes the books in turn.'),
      b("En cas d'échec d'une génération, le service insère une question générique : le minimum de 20 paires peut être atteint avec du remplissage.", 'When a generation fails, the service inserts a generic question: the 20-pair minimum can be reached with filler.'),
      b('Service ML lancé localement, hors des conteneurs Airflow ; aucun test automatisé.', 'ML service run locally, outside the Airflow containers; no automated tests.'),
    ],
    nextSteps: [b('Mapper aussi traduction et synthèse vocale par livre, et mesurer la qualité des résumés (ROUGE, relecture humaine).', 'Also map translation and text-to-speech per book, and measure summary quality (ROUGE, human review).')],
    sources: ['README.md', 'docker-compose.yml', 'airflow/dags/exercise2_books_ingestion.py', 'airflow/utils/ (book_parser, io, ml_client)', 'ml_service/ (app, config, pipelines)', 'Rapport_Projet_Book_Pipeline.md'],
  },

  // -------------------------------------------------------------------------
  dental: {
    context: b('Projet académique MLOps · application Snani pour le grand public', 'Academic MLOps project · Snani application for non-technical users'),
    challenge: [
      b('Une radio panoramique est difficile à comprendre sans accompagnement. Un résultat de détection composé de classes techniques, de coordonnées et de scores ne répond pas à la question de l’utilisateur : que montre mon image et que dois-je faire vérifier ?', 'A panoramic X-ray is difficult to understand without guidance. Detection classes, coordinates and scores do not answer the user’s question: what does my image show and what should I discuss with my dentist?'),
      b('Le second défi est de sortir du notebook : rendre les données reproductibles, comparer les modèles, tracer la sélection du Champion et servir le même checkpoint dans une API testée et conteneurisée.', 'The second challenge is moving beyond a notebook: reproducible data, model comparison, traceable Champion selection and the same checkpoint served through a tested, containerised API.'),
    ],
    solution: b('Deux volets complémentaires : une chaîne MLOps de la donnée au service, et Snani, une interface en français et en arabe qui transforme les détections en signes expliqués simplement. L’utilisateur importe sa radio ou essaie un exemple, visualise les zones repérées, lit les explications et peut partager une image annotée avec son dentiste.', 'Two complementary layers: an MLOps pipeline from data to serving, and Snani, a French and Arabic interface that turns detections into plain-language findings. Users upload an X-ray or try an example, inspect highlighted areas, read explanations and share an annotated image with a dentist.'),
    architecture: {
      nodes: [
        { label: b('1 808 radiographies', '1,808 X-rays'), detail: b('24 888 annotations nettoyées · DVC', '24,888 cleaned annotations · DVC'), kind: 'source' },
        { label: b('Préparation', 'Preparation'), detail: b('audit · remapping 14 → 7 classes', 'audit · 14 → 7 class remapping'), kind: 'process' },
        { label: b('YOLOv8s & MLflow', 'YOLOv8s & MLflow'), detail: b('3 variantes · évaluation eval / test / external', '3 variants · eval / test / external evaluation'), kind: 'model' },
        { label: b('Registre de modèles', 'Model registry'), detail: b('Champion / Candidate / Archived · alias stable', 'Champion / Candidate / Archived · stable alias'), kind: 'infra' },
        { label: b('CI/CD GitHub Actions', 'GitHub Actions CI/CD'), detail: b('tests · build Docker · intégration · GHCR', 'tests · Docker build · integration · GHCR'), kind: 'infra' },
        { label: b('API FastAPI', 'FastAPI API'), detail: b('Azure Container Apps · 0–1 réplique', 'Azure Container Apps · 0–1 replica'), kind: 'output', group: 'service' },
        { label: b('Snani', 'Snani'), detail: b('React / Vercel · français & arabe · mobile', 'React / Vercel · French & Arabic · mobile'), kind: 'output', group: 'service' },
      ],
      alt: b('Des radiographies versionnées avec DVC alimentent un entraînement YOLOv8s suivi dans MLflow. Le Champion est intégré à une image Docker testée par GitHub Actions, servie sur Azure Container Apps et consommée par Snani sur Vercel pour produire des résultats expliqués et partageables.', 'DVC-versioned X-rays feed YOLOv8s training tracked in MLflow. The Champion is packaged in a Docker image tested by GitHub Actions, served on Azure Container Apps and used by Snani on Vercel to produce understandable, shareable results.'),
      note: b('Architecture actuelle d’après docs/deployment.md. La présentation conserve l’étape antérieure Railway + Vercel ; le dépôt documente désormais Azure Container Apps + Vercel.', 'Current architecture from docs/deployment.md. The presentation retains the earlier Railway + Vercel setup; the repository now documents Azure Container Apps + Vercel.'),
    },
    implementation: {
      title: b('De la donnée à une expérience compréhensible', 'From data to an understandable experience'),
      items: [
        { title: b('Données reproductibles', 'Reproducible data'), text: b('Pipeline DVC inspect → prepare → stats. Les 1 808 images sont conservées ; 3 annotations invalides sont retirées, laissant 24 888 annotations. Les 14 classes d’origine sont regroupées en 7 familles de signes, dont les soins déjà réalisés et les implants.', 'DVC pipeline: inspect → prepare → stats. All 1,808 images are retained; 3 invalid annotations are removed, leaving 24,888 annotations. The original 14 classes are grouped into 7 finding categories, including existing treatments and implants.'), source: 'Présentation p. 7–8 · README.md' },
        { title: b('Expériences traçables', 'Traceable experiments'), text: b('YOLOv8s pré-entraîné, résolution 832 px et trois variantes comparées sur eval, test et external. MLflow conserve configurations, checkpoints et métriques ; le registre YAML identifie le Champion et son checkpoint stable.', 'Pretrained YOLOv8s, 832 px resolution and three variants compared on eval, test and external. MLflow tracks configurations, checkpoints and metrics; a YAML registry identifies the Champion and its stable checkpoint.'), source: 'Présentation p. 12, 14–15 · configs/model_registry.yaml' },
        { title: b('Importer sans connaissances techniques', 'Upload without technical knowledge'), text: b('Import par fichier, glisser-déposer ou appareil photo, avec un exemple pour découvrir le parcours. Luminosité et contraste sont ajustables ; les paramètres du modèle sont présentés comme niveau de détail et sensibilité, dans des options avancées.', 'File upload, drag and drop or camera input, with an example to explore the flow. Brightness and contrast are adjustable; model settings are presented as detail level and sensitivity inside advanced options.'), source: 'frontend/src/i18n/fr.js · README.md' },
        { title: b('Comprendre et partager', 'Understand and share'), text: b('Les zones détectées sont reliées à des explications en français ou en arabe, des niveaux de certitude et des conseils de suivi. L’image annotée peut être téléchargée ou partagée avec un dentiste ; les résultats simulés sont explicitement signalés en mode démo.', 'Detected regions are linked to French or Arabic explanations, confidence levels and follow-up guidance. The annotated image can be downloaded or shared with a dentist; simulated results are explicitly labelled in demo mode.'), source: 'frontend/src/components/ResultsPanel.jsx · frontend/src/report.js' },
        { title: b('Service conteneurisé et testé', 'Containerised and tested service'), text: b('FastAPI expose /health, /model-info et /predict. L’image Docker CPU embarque le Champion ; GitHub Actions exécute les tests, construit l’image, teste le conteneur et publie sur GHCR. Le déploiement automatique Azure dépend de la configuration des identifiants ; un script de déploiement est aussi fourni.', 'FastAPI exposes /health, /model-info and /predict. The CPU Docker image includes the Champion; GitHub Actions runs tests, builds the image, tests the container and publishes to GHCR. Automatic Azure deployment depends on configured credentials; a deployment script is also provided.'), source: '.github/workflows/cd-service.yml · docs/deployment.md' },
        { title: b('Confidentialité et limites de service', 'Privacy and service limits'), text: b('Le dépôt documente la suppression des images temporaires après analyse, des fichiers limités à 15 Mo, un CORS restreint et une limite de 10 requêtes/minute et 100/heure par IP. Les requêtes trop lourdes sont rejetées avant le parsing multipart (411/413), les images au-delà de 40 mégapixels refusées et les paramètres bornés (422). Le conteneur s’exécute sans privilèges root et /docs est désactivé en production.', 'The repository documents deletion of temporary images after analysis, a 15 MB upload limit, restricted CORS and limits of 10 requests/minute and 100/hour per IP. Oversized requests are rejected before multipart parsing (411/413), images above 40 megapixels are refused and parameters are bounded (422). The container runs as a non-root user and /docs is disabled in production.'), source: 'docs/deployment.md · src/detection_dentaire/serving/api.py' },
      ],
    },
    decisions: [
      { title: b('Un Champion choisi sur plusieurs partitions', 'A Champion chosen across splits'), text: b('La baseline obtient le meilleur compromis eval/test et un rappel supérieur sur test. Le Candidate améliore légèrement la mAP50 externe (0,332 contre 0,325), mais reste moins bon sur test (0,407 contre 0,422).', 'The baseline provides the best eval/test trade-off and higher test recall. The Candidate slightly improves external mAP50 (0.332 vs 0.325), but performs worse on test (0.407 vs 0.422).'), source: 'Présentation p. 14 · configs/model_registry.yaml' },
      { title: b('Séparer le moteur ML du langage utilisateur', 'Separate the ML engine from user language'), text: b('Les classes de détection restent stables côté API ; Snani les traduit en explications, niveaux de certitude et actions lisibles. Les réglages techniques restent accessibles dans les options avancées.', 'Detection classes remain stable in the API; Snani translates them into readable explanations, confidence levels and actions. Technical settings remain available through advanced options.'), source: 'frontend/src/i18n/fr.js · frontend/src/components/ResultsPanel.jsx' },
      { title: b('Éteindre le service au repos', 'Scale the service down when idle'), text: b('Azure Container Apps est configuré de 0 à 1 réplique. Le frontend ne réveille l’API qu’au chargement d’une radio et explique le démarrage à froid de 30 à 60 secondes, au lieu d’annoncer une latence immédiate garantie.', 'Azure Container Apps is configured for 0–1 replica. The frontend wakes the API only when an X-ray is loaded and explains the 30–60 second cold start, rather than promising instant latency.'), source: 'docs/deployment.md' },
    ],
    results: {
      intro: b('Mesures du tableau 4.2 de la présentation (page PDF 14). Les scores décrivent une détection d’objets sur des partitions expérimentales ; ils ne mesurent pas la fiabilité d’un diagnostic pour un patient.', 'Measurements from Table 4.2 of the presentation (PDF page 14). These scores describe object detection on experimental splits; they do not measure diagnostic reliability for an individual patient.'),
      metrics: [
        { value: '1 808', label: b('radiographies conservées', 'X-rays retained'), context: b('corpus total, toutes partitions de l’audit', 'total corpus across audited splits'), source: 'Présentation p. 7–8' },
        { value: '24 888', label: b('annotations nettoyées', 'cleaned annotations'), context: b('3 annotations invalides supprimées ; 7 classes finales', '3 invalid annotations removed; 7 final classes'), source: 'Présentation p. 7–8' },
        { value: '1,19 GB', label: b('image Docker CPU', 'CPU Docker image'), context: b('taille rapportée dans la présentation, contre 3,74 GB pour l’ancienne image', 'size reported in the presentation, vs 3.74 GB for the earlier image'), source: 'Présentation p. 19' },
        { value: '11 + 5', label: b('tests unitaires + intégration', 'unit + integration tests'), context: b('bilan présenté à la soutenance ; le dépôt compte aujourd’hui 18 fonctions de test unitaire et le workflow ajoute des contrôles de sécurité sur le conteneur', 'counts reported in the presentation; the repository now has 18 unit test functions and the workflow adds security checks on the container'), source: 'Présentation p. 19, 22 · tests/ · cd-service.yml' },
      ],
      table: {
        caption: b('Champion et Candidate — comparaison par partition', 'Champion and Candidate — comparison by split'),
        columns: [b('Modèle', 'Model'), b('Partition', 'Split'), b('Précision', 'Precision'), b('Rappel', 'Recall'), b('mAP50', 'mAP50'), b('mAP50–95', 'mAP50–95')],
        rows: [
          ['Champion', 'eval', '0.695', '0.393', '0.325', '0.136'],
          ['Champion', 'test', '0.860', '0.467', '0.422', '0.211'],
          ['Champion', 'external', '0.682', '0.383', '0.325', '0.146'],
          ['Candidate', 'eval', '0.689', '0.368', '0.313', '0.138'],
          ['Candidate', 'test', '0.894', '0.441', '0.407', '0.199'],
          ['Candidate', 'external', '0.757', '0.383', '0.332', '0.160'],
        ],
        source: 'Présentation PDF p. 14 · tableau 4.2',
      },
      note: b('Sur test, une précision de 0,860 s’accompagne d’un rappel de 0,467 : beaucoup de signes annotés restent manqués. La mAP50 est de 0,325 sur external. Les 86 % de précision ne sont donc ni une accuracy globale ni une probabilité de diagnostic correct.', 'On test, precision of 0.860 comes with recall of 0.467: many annotated findings are still missed. External mAP50 is 0.325. The 86% precision is neither overall accuracy nor a probability of a correct diagnosis.'),
    },
    limitations: [
      b('Aucune validation clinique par des praticiens : Snani est une aide à la compréhension issue d’un projet académique, à confronter à l’examen d’un dentiste.', 'No clinical validation by practitioners: Snani is an understanding aid from an academic project, to be checked against a dentist’s examination.'),
      b('Rappel limité et variations entre cabinets : un résultat sans signe détecté ne garantit pas l’absence de problème.', 'Limited recall and variation between clinics: a result with no detected findings does not guarantee the absence of a problem.'),
      b('Les 7 classes regroupent aussi des traitements et dispositifs déjà présents ; elles ne représentent pas 7 maladies.', 'The 7 classes also include existing treatments and devices; they do not represent 7 diseases.'),
      b('Démarrage à froid de 30 à 60 secondes. La résolution de 832 px limite aussi les détails disponibles pour les petites lésions.', '30–60 second cold start. The 832 px resolution also limits the detail available for small lesions.'),
    ],
    nextSteps: [
      b('Enrichir le corpus et tester des résolutions de 1 024 à 1 280 px, sans présumer du gain de performance.', 'Expand the corpus and test 1,024–1,280 px resolutions without assuming a performance gain.'),
      b('Évaluer la compréhension des explications par des utilisateurs et organiser une validation avec des chirurgiens-dentistes.', 'Evaluate how well users understand the explanations and organise validation with dental practitioners.'),
      b('Ajouter un suivi de latence, de disponibilité et de dérive des données.', 'Add latency, availability and data-drift monitoring.'),
    ],
    sources: ['Présentation MLOps (24 pages), p. 7–8, 12, 14–15, 19, 22–23', 'README.md', 'configs/model_registry.yaml', 'docs/deployment.md', '.github/workflows/cd-service.yml', 'frontend/src/i18n/fr.js', 'frontend/src/components/ResultsPanel.jsx', 'frontend/src/report.js'],
  },

  // -------------------------------------------------------------------------
  misinformation: {
    context: b('Projet personnel — NLP arabe', 'Personal project — Arabic NLP'),
    challenge: [
      b(
        'Repérer la désinformation médicale dans des tweets arabes liés au COVID-19 (sous-ensemble tweet_verification d’ArCOV19-Rumors). Le texte est très bruité : dialectes, diacritiques, emojis, URL et mentions.',
        'Spot medical misinformation in Arabic COVID-19 tweets (tweet_verification subset of ArCOV19-Rumors). The text is very noisy: dialects, diacritics, emojis, URLs and mentions.',
      ),
      b(
        'Le corpus est petit (3 584 tweets) et contient beaucoup de doublons : sans précaution, un même tweet peut se retrouver à la fois dans l’entraînement et dans le test, ce qui gonfle les scores.',
        'The corpus is small (3,584 tweets) and contains many duplicates: without care, the same tweet can land in both training and test, inflating scores.',
      ),
    ],
    solution: b(
      'Une chaîne de classification binaire complète : normalisation arabe, déduplication avant le découpage, fine-tuning d’AraBERTv02 avec perte pondérée par classe et arrêt anticipé, puis seuil de décision réglé sur la validation. Une baseline TF-IDF sert de point de comparaison honnête.',
      'A complete binary classification pipeline: Arabic normalisation, deduplication before splitting, AraBERTv02 fine-tuning with a class-weighted loss and early stopping, then a decision threshold tuned on validation. A TF-IDF baseline provides an honest point of comparison.',
    ),
    architecture: {
      nodes: [
        { label: b('ArCOV19-Rumors', 'ArCOV19-Rumors'), detail: b('tweet_verification · 3 584 tweets', 'tweet_verification · 3,584 tweets'), kind: 'source' },
        { label: b('Normalisation arabe', 'Arabic normalisation'), detail: b('diacritiques, URL, mentions, emojis, variantes de caractères', 'diacritics, URLs, mentions, emojis, character variants'), kind: 'process' },
        { label: b('Déduplication', 'Deduplication'), detail: b('617 doublons retirés → 2 967', '617 duplicates removed → 2,967'), kind: 'process' },
        { label: b('Split stratifié 80/10/10', 'Stratified 80/10/10 split'), detail: b('2 373 / 297 / 297 · graine 42', '2,373 / 297 / 297 · seed 42'), kind: 'process' },
        { label: b('AraBERTv02', 'AraBERTv02'), detail: b('5 époques · lr 2e-5 · 128 tokens', '5 epochs · lr 2e-5 · 128 tokens'), kind: 'model', group: 'm' },
        { label: b('Baseline TF-IDF', 'TF-IDF baseline'), detail: b('unigrammes + bigrammes · régression logistique', 'unigrams + bigrams · logistic regression'), kind: 'model', group: 'm' },
        { label: b('Seuil 0,70 · analyse d’erreurs', '0.70 threshold · error analysis'), kind: 'output' },
      ],
      alt: b(
        'Pipeline NLP : tweets ArCOV19-Rumors normalisés, dédupliqués puis découpés de façon stratifiée ; AraBERTv02 fine-tuné et comparé à une baseline TF-IDF ; seuil de décision réglé à 0,70 sur la validation.',
        'NLP pipeline: ArCOV19-Rumors tweets normalised, deduplicated then split with stratification; AraBERTv02 fine-tuned and compared with a TF-IDF baseline; decision threshold tuned to 0.70 on validation.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Prétraitement arabe', 'Arabic preprocessing'), text: b('Suppression des diacritiques, URL, mentions, emojis et ponctuation, normalisation des variantes de caractères courantes. Le préprocesseur officiel AraBERT est appliqué ensuite s’il est installé.', 'Removes diacritics, URLs, mentions, emojis and punctuation, and normalises common character variants. The official AraBERT preprocessor is applied afterwards when installed.'), source: 'src/preprocessing.py' },
        { title: b('Déduplication avant le découpage', 'Deduplication before splitting'), text: b('Les doublons sont retirés sur le couple (texte prétraité, label) avant le split stratifié, pour limiter les fuites entre entraînement et test : 617 lignes retirées, soit 17,2 % du corpus.', 'Duplicates are dropped on the (preprocessed text, label) pair before the stratified split, to limit leakage between training and test: 617 rows removed, 17.2% of the corpus.'), source: 'src/train.py · COMPARATIVE_REPORT.md' },
        { title: b('Fine-tuning robuste', 'Robust fine-tuning'), text: b('AdamW (weight decay 0,01), 100 pas de warmup, dropout 0,3, perte d’entropie croisée pondérée par la fréquence des classes et arrêt anticipé (patience 2) sur la perte de validation. En cas de mémoire GPU insuffisante, l’entraînement relance avec un batch plus petit ; le run publié a tourné sur CPU avec un batch de 8.', 'AdamW (weight decay 0.01), 100 warmup steps, dropout 0.3, cross-entropy weighted by class frequency and early stopping (patience 2) on validation loss. On GPU out-of-memory, training restarts with a smaller batch; the published run used the CPU with a batch of 8.'), source: 'config.yaml · src/train.py · final_report.txt' },
        { title: b('Seuil de décision réglé', 'Tuned decision threshold'), text: b('Une grille de 0,30 à 0,70 par pas de 0,02 est évaluée sur la validation à partir des probabilités de la classe « fiable ». La meilleure valeur, 0,70, est ensuite appliquée au test.', 'A grid from 0.30 to 0.70 in 0.02 steps is evaluated on validation using the probabilities of the “reliable” class. The best value, 0.70, is then applied to test.'), source: 'src/improve_threshold.py' },
        { title: b('Outillage d’expérience', 'Experiment tooling'), text: b('Scripts séparés pour la baseline TF-IDF (30 000 features, régression logistique équilibrée), l’analyse d’erreurs, la comparaison de modèles et des exécutions multi-graines, plus une CLI de prédiction sur un texte.', 'Separate scripts for the TF-IDF baseline (30,000 features, balanced logistic regression), error analysis, model comparison and multi-seed runs, plus a CLI to predict on a single text.'), source: 'src/baseline_tfidf.py · src/improve_*.py · src/multi_seed_runner.py · src/predict.py' },
      ],
    },
    decisions: [
      { title: b('Publier la baseline même quand elle gagne', 'Report the baseline even when it wins'), text: b('Sur le même test de 359 tweets, la baseline TF-IDF (0,908) dépasse AraBERT (0,894). Le résultat est gardé tel quel plutôt que de ne montrer que le transformer.', 'On the same 359-tweet test set, the TF-IDF baseline (0.908) beats AraBERT (0.894). The result is kept as is rather than showing only the transformer.'), source: 'COMPARATIVE_REPORT.md · baseline_report.txt' },
      { title: b('Préférer un test propre à un meilleur score', 'Prefer a clean test over a better score'), text: b('La déduplication fait baisser le score de 0,894 à 0,869, mais elle mesure mieux la généralisation à des tweets jamais vus.', 'Deduplication lowers the score from 0.894 to 0.869, but it measures generalisation to unseen tweets more faithfully.'), source: 'COMPARATIVE_REPORT.md' },
    ],
    results: {
      intro: b('Chiffres des rapports d’évaluation versionnés dans le dépôt. Les deux tableaux ne portent pas sur le même jeu de test.', 'Figures from the evaluation reports versioned in the repository. The two tables do not use the same test set.'),
      metrics: [
        { value: '0.869', label: b('accuracy', 'accuracy'), context: b('modèle final, 297 tweets de test, après déduplication, seuil 0,70', 'final model, 297 test tweets, after deduplication, threshold 0.70'), source: 'final_report.txt' },
        { value: '0.869', label: b('F1 macro', 'macro F1'), context: b('même jeu de test', 'same test set'), source: 'final_report.txt' },
        { value: '0.918', label: b('rappel « désinformation »', '“misinformation” recall'), context: b('135 tweets faux sur 147 repérés ; précision 0,833 sur cette classe', '135 of 147 false tweets caught; precision 0.833 on that class'), source: 'final_report.txt' },
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
        "Sur ce jeu de données, la baseline TF-IDF fait légèrement mieux qu'AraBERT avant déduplication. Après déduplication, AraBERT descend à 0,869 ; la baseline n'a pas été réévaluée sur ce nouveau jeu de test, donc les deux chiffres ne se comparent pas directement.",
        'On this dataset, the TF-IDF baseline does slightly better than AraBERT before deduplication. After deduplication, AraBERT drops to 0.869; the baseline was not re-evaluated on that new test set, so the two figures are not directly comparable.',
      ),
    },
    limitations: [
      b('Petit jeu de données (2 967 tweets) et un seul découpage de test publié ; le script multi-graines existe mais aucun résultat agrégé n’est versionné.', 'Small dataset (2,967 tweets) and a single published test split; the multi-seed script exists but no aggregated result is versioned.'),
      b('Le gain d’AraBERT sur une baseline lexicale n’est pas démontré ici.', 'AraBERT’s gain over a lexical baseline is not demonstrated here.'),
      b('Le seuil retenu (0,70) est la borne haute de la grille testée : l’optimum pourrait se trouver au-delà.', 'The selected threshold (0.70) is the upper bound of the tested grid: the optimum could lie beyond it.'),
      b('La déduplication est exacte sur le texte prétraité : les quasi-doublons (retweets légèrement modifiés) peuvent encore traverser les splits.', 'Deduplication is exact on preprocessed text: near-duplicates (slightly edited retweets) can still cross splits.'),
    ],
    nextSteps: [
      b('Réévaluer la baseline sur le jeu dédupliqué et agréger les exécutions multi-graines.', 'Re-evaluate the baseline on the deduplicated set and aggregate the multi-seed runs.'),
      b('Étendre la grille de seuils au-delà de 0,70 et tester une déduplication approximative.', 'Extend the threshold grid beyond 0.70 and test near-duplicate detection.'),
    ],
    sources: ['README.md', 'config.yaml', 'src/train.py', 'src/preprocessing.py', 'src/improve_threshold.py', 'src/baseline_tfidf.py', 'models/final_report.txt', 'improvements/COMPARATIVE_REPORT.md'],
  },

  // -------------------------------------------------------------------------
  pointfed: {
    context: b('Mini-projet académique — apprentissage fédéré', 'Academic mini-project — federated learning'),
    challenge: [
      b(
        "Entraîner un classifieur de nuages de points 3D quand les données ne peuvent pas être centralisées : soit réparties entre clients (fédération horizontale), soit séparées par type d'attribut entre deux entités (fédération verticale).",
        'Train a 3D point-cloud classifier when data cannot be centralised: either split across clients (horizontal federation) or split by attribute type between two parties (vertical federation).',
      ),
      b(
        'Il faut aussi mesurer ce que coûte la fédération par rapport à un entraînement centralisé, en particulier quand chaque client ne voit qu’une partie des classes.',
        'The cost of federation versus centralised training also has to be measured, especially when each client only sees some of the classes.',
      ),
    ],
    solution: b(
      'Le dépôt implémente avec FeaStNet (réseau de convolution sur graphe) cinq configurations : centralisée, FedAvg codé à la main en IID et non-IID sur 4 clients, fédération verticale (géométrie XYZ d’un côté, couleurs RGB de l’autre) et distillation vers un élève réduit. Toutes partagent la même configuration YAML et un script de comparaison.',
      'The repository implements five configurations with FeaStNet (graph convolution network): centralised, hand-written FedAvg on 4 clients in IID and non-IID, vertical federation (XYZ geometry on one side, RGB colours on the other) and distillation into a smaller student. All share the same YAML configuration and a comparison script.',
    ),
    architecture: {
      nodes: [
        { label: b('ShapeNet via CAP3D', 'ShapeNet via CAP3D'), detail: b('50 classes · 1 024 points · split 70/15/15', '50 classes · 1,024 points · 70/15/15 split'), kind: 'source' },
        { label: b('Graphe k-NN + FeaStConv', 'k-NN graph + FeaStConv'), detail: b('enseignant [64, 128, 256] · élève [32, 64, 64]', 'teacher [64, 128, 256] · student [32, 64, 64]'), kind: 'model' },
        { label: b('FedAvg (4 clients, 20 rondes)', 'FedAvg (4 clients, 20 rounds)'), detail: b('IID · non-IID par domaine', 'IID · non-IID by domain'), kind: 'process', group: 'fl' },
        { label: b('Fédération verticale', 'Vertical federation'), detail: b('XYZ / RGB → embeddings concaténés', 'XYZ / RGB → concatenated embeddings'), kind: 'process', group: 'fl' },
        { label: b('Distillation', 'Distillation'), detail: b('τ = 4, α = 0,5', 'τ = 4, α = 0.5'), kind: 'process', group: 'fl' },
        { label: b('Comparaison', 'Comparison'), detail: b('rapports JSON · tableau récapitulatif · analyse croisée par client', 'JSON reports · summary table · per-client cross analysis'), kind: 'output' },
      ],
      alt: b(
        'Schéma : nuages de points ShapeNet traités par un réseau FeaStNet ; trois scénarios — FedAvg horizontal sur quatre clients, fédération verticale entre géométrie et couleur, distillation vers un élève réduit — puis comparaison des rapports.',
        'Diagram: ShapeNet point clouds processed by a FeaStNet network; three scenarios — horizontal FedAvg over four clients, vertical federation between geometry and colour, distillation into a smaller student — then report comparison.',
      ),
    },
    implementation: {
      title: b('Méthodes implémentées', 'Implemented methods'),
      items: [
        { title: b('FeaStNet enseignant et élève', 'FeaStNet teacher and student'), text: b('Trois couches FeaStConv sur un graphe k-NN construit à la volée sur XYZ (k = 16 pour l’enseignant, 12 pour l’élève), pooling global moyenne + max concaténés, puis classifieur dense. Enseignant : 883 250 paramètres ; élève : 114 620.', 'Three FeaStConv layers on a k-NN graph built on the fly from XYZ (k = 16 for the teacher, 12 for the student), concatenated global mean + max pooling, then a dense classifier. Teacher: 883,250 parameters; student: 114,620.'), source: 'src/feastnet_fl/models/feastnet.py · README.md' },
        { title: b('FedAvg à la main', 'Hand-written FedAvg'), text: b('Agrégation clé par clé du state_dict, pondérée par la taille des partitions, y compris les moyennes et variances de BatchNorm. Les tenseurs entiers (compteurs de batch) sont repris du plus gros client.', 'Key-by-key state_dict aggregation weighted by partition size, including BatchNorm means and variances. Integer tensors (batch counters) are taken from the largest client.'), source: 'src/feastnet_fl/federated/fedavg.py' },
        { title: b('Scénario non-IID par domaine', 'Non-IID scenario by domain'), text: b('Chaque client reçoit un domaine exclusif (mobilier, transport, technologie, domestique) ; un script évalue ensuite le modèle global sur les classes que chaque client n’a jamais vues.', 'Each client gets an exclusive domain (furniture, transport, technology, household); a script then evaluates the global model on the classes each client never saw.'), source: 'README.md · src/feastnet_fl/evaluation/cross_client.py' },
        { title: b('Fédération verticale', 'Vertical federation'), text: b('L’entité A encode XYZ avec FeaStConv, l’entité B encode RGB avec un MLP ; seuls les embeddings de 128 dimensions sont envoyés au serveur, qui les concatène et renvoie les gradients aux encodeurs.', 'Party A encodes XYZ with FeaStConv, party B encodes RGB with an MLP; only the 128-dim embeddings reach the server, which concatenates them and sends gradients back to the encoders.'), source: 'src/feastnet_fl/federated/vfl.py' },
        { title: b('Distillation', 'Distillation'), text: b('Perte (1 − α)·CE + α·τ²·KL sur les logits adoucis de l’enseignant figé, avec un script de balayage de τ et α.', 'Loss (1 − α)·CE + α·τ²·KL on the frozen teacher’s softened logits, with a sweep script over τ and α.'), source: 'src/feastnet_fl/distillation/losses.py · scripts/sweep_distillation.py' },
      ],
    },
    decisions: [
      { title: b('Coder FedAvg plutôt qu’utiliser un framework', 'Write FedAvg rather than use a framework'), text: b('L’agrégation tient en une fonction lisible, ce qui rend explicite le traitement des buffers de BatchNorm, un point souvent ignoré.', 'Aggregation fits in one readable function, which makes the handling of BatchNorm buffers explicit — a point often overlooked.'), source: 'src/feastnet_fl/federated/fedavg.py' },
      { title: b('Des configurations par budget de calcul', 'Configurations per compute budget'), text: b('Sept fichiers YAML vont du test « ultra rapide » sur CPU (64 points, 2 époques) à l’expérience complète, avec les mêmes scripts.', 'Seven YAML files range from an “ultra quick” CPU check (64 points, 2 epochs) to the full experiment, using the same scripts.'), source: 'configs/*.yaml' },
    ],
    limitations: [
      b(
        "Aucun résultat mesuré n’est publié ici. Les chiffres du README (82,54 % en centralisé, etc.) et les rapports outputs/full sont écrits par un script de résultats simulés (outputs/generate_mock_results.py). Le seul run réel versionné est le test ultra rapide sur CPU : 2 % d’accuracy sur 50 classes, soit le hasard. Il vérifie que la chaîne s’exécute, pas qu’elle apprend.",
        'No measured result is published here. The README figures (82.54% centralised, etc.) and the outputs/full reports are written by a simulated-results script (outputs/generate_mock_results.py). The only real versioned run is the ultra-quick CPU check: 2% accuracy on 50 classes, i.e. chance. It shows the pipeline runs, not that it learns.',
      ),
      b('Le package feastnet_fl.data (chargement, splits, partitions) est exclu par le .gitignore : le dépôt seul ne permet pas de relancer les expériences.', 'The feastnet_fl.data package (loading, splits, partitions) is excluded by .gitignore: the repository alone cannot rerun the experiments.'),
      b('Fédération simulée sur une seule machine, sans coût de communication réel ; une seule graine.', 'Federation simulated on one machine, with no real communication cost; a single seed.'),
      b('Confidentialité du VFL fondée sur le pooling, sans confidentialité différentielle ni agrégation sécurisée.', 'VFL privacy relies on pooling, with no differential privacy or secure aggregation.'),
    ],
    nextSteps: [
      b('Versionner le package data, exécuter les cinq configurations à pleine échelle et remplacer les rapports simulés par les rapports réels.', 'Version the data package, run the five configurations at full scale and replace the simulated reports with real ones.'),
      b('Ajouter plusieurs graines et mesurer le volume échangé par ronde.', 'Add several seeds and measure the volume exchanged per round.'),
    ],
    sources: ['README.md', 'configs/*.yaml', 'src/feastnet_fl/', 'scripts/', 'outputs/generate_mock_results.py', 'outputs/ultra_quick_cpu/reports/comparison_summary.md'],
  },

  // -------------------------------------------------------------------------
  shoplifting: {
    context: b('Projet personnel — vision par ordinateur', 'Personal project — computer vision'),
    challenge: [
      b(
        'Repérer en temps réel des comportements suspects sur une caméra de surveillance standard, sans dépendre de la détection de petits objets (un article glissé dans une poche est rarement visible).',
        'Spot suspicious behaviour in real time on a standard surveillance camera, without relying on small-object detection (an item slipped into a pocket is rarely visible).',
      ),
      b(
        'Le système doit tourner sur un GPU grand public (GTX 1650) et suivre plusieurs personnes à la fois, chacune avec son propre historique.',
        'The system has to run on a consumer GPU (GTX 1650) and follow several people at once, each with their own history.',
      ),
    ],
    solution: b(
      'Un pipeline 100 % comportemental : détection des personnes, suivi avec un identifiant stable, extraction de la pose, features de mouvement et de gestes par personne, puis classification par un score heuristique (sans entraînement) ou par un LSTM bidirectionnel avec attention entraîné sur des vidéos étiquetées.',
      'A fully behavioural pipeline: person detection, tracking with a stable ID, pose extraction, per-person motion and gesture features, then classification by a heuristic score (no training) or a bidirectional LSTM with attention trained on labelled videos.',
    ),
    architecture: {
      nodes: [
        { label: b('Flux vidéo', 'Video stream'), detail: b('webcam ou fichier', 'webcam or file'), kind: 'source' },
        { label: b('YOLO26n (Ultralytics)', 'YOLO26n (Ultralytics)'), detail: b('personnes uniquement · conf 0,5 · 640 px', 'people only · conf 0.5 · 640 px'), kind: 'model' },
        { label: b('DeepSORT', 'DeepSORT'), detail: b('un identifiant par personne · max_age 90 frames', 'one ID per person · max_age 90 frames'), kind: 'process' },
        { label: b('MediaPipe Pose', 'MediaPipe Pose'), detail: b('landmarks dans la boîte de chaque personne', 'landmarks inside each person’s box'), kind: 'model' },
        { label: b('10 features par frame', '10 features per frame'), detail: b('5 mouvement · 4 gestes · 1 total', '5 motion · 4 gestures · 1 total'), kind: 'process' },
        { label: b('Score heuristique', 'Heuristic score'), kind: 'model', group: 'clf' },
        { label: b('BiLSTM + attention', 'BiLSTM + attention'), detail: b('séquences de 60 frames', '60-frame sequences'), kind: 'model', group: 'clf' },
        { label: b('Alertes en surimpression', 'On-screen alerts'), detail: b('normal · suspect · critique', 'normal · suspicious · critical'), kind: 'output' },
      ],
      alt: b(
        "Pipeline : la vidéo passe par YOLO26n (personnes), DeepSORT (suivi), MediaPipe Pose (squelette) ; dix features comportementales par frame sont classées par un score heuristique ou un LSTM bidirectionnel avec attention, qui déclenche des alertes à l'écran.",
        'Pipeline: video goes through YOLO26n (people), DeepSORT (tracking), MediaPipe Pose (skeleton); ten behavioural features per frame are classified by a heuristic score or a bidirectional LSTM with attention, which raises on-screen alerts.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Détection et suivi', 'Detection and tracking'), text: b('YOLO26n ne garde que la classe « personne » de COCO. DeepSORT confirme un track après 3 détections et le conserve environ 3 secondes hors champ, avec un seuil d’apparence cosinus de 0,4.', 'YOLO26n keeps only the COCO “person” class. DeepSORT confirms a track after 3 detections and keeps it about 3 seconds off-screen, with a 0.4 cosine appearance threshold.'), source: 'config.py · detector.py · tracker.py' },
        { title: b('Gestes calculés à partir de la pose', 'Gestures computed from pose'), text: b('Main près de la hanche (poche), main vers l’épaule opposée (sac), buste penché au-delà de 25°, mouvements rapides de la tête (regard furtif). S’y ajoutent vitesse moyenne, écart-type, vitesse max et temps immobile sur une fenêtre de 90 frames.', 'Hand near the hip (pocket), hand towards the opposite shoulder (bag), torso bent beyond 25°, quick head movements (furtive glances). Added to these: mean speed, standard deviation, max speed and idle time over a 90-frame window.'), source: 'behavior_analyzer.py' },
        { title: b('Deux modes de classification', 'Two classification modes'), text: b('Le mode heuristique additionne des points par geste et par anomalie de vitesse (fuite rapide, immobilité, nervosité) pour obtenir un score sur 100. Le mode LSTM encode chaque frame, applique un BiLSTM à 2 couches (64 unités) puis une attention simple qui pondère les moments critiques.', 'The heuristic mode adds points per gesture and per speed anomaly (rapid escape, idleness, nervousness) to produce a score out of 100. The LSTM mode encodes each frame, applies a 2-layer BiLSTM (64 units) then a simple attention that weights critical moments.'), source: 'behavior_classifier.py' },
        { title: b('Entraînement', 'Training'), text: b('Extraction de séquences par fenêtre glissante à 50 % de recouvrement sur deux dossiers de vidéos (vol / normal), split stratifié 70/15/15, perte BCE pondérée, Adam et ReduceLROnPlateau, sauvegarde du meilleur modèle sur la perte de validation.', 'Sliding-window sequence extraction with 50% overlap from two video folders (shoplifting / normal), stratified 70/15/15 split, weighted BCE loss, Adam and ReduceLROnPlateau, saving the best model on validation loss.'), source: 'train_model.py' },
        { title: b('Outils de diagnostic', 'Diagnostic tools'), text: b('Démo sur une vidéo, visualisation des features en surimpression et script de vérification de l’installation (CUDA, modèles, dépendances).', 'Single-video demo, on-screen feature visualisation and an installation-check script (CUDA, models, dependencies).'), source: 'demo.py · visualize_features.py · test_installation.py' },
      ],
    },
    decisions: [
      { title: b('Analyser le comportement plutôt que l’objet', 'Analyse behaviour rather than the object'), text: b('Les gestes et la trajectoire restent observables même quand l’article volé ne l’est pas, et ils s’obtiennent avec des modèles légers.', 'Gestures and trajectory stay observable even when the stolen item does not, and they come from lightweight models.'), source: 'README.md · PROJET_COMPLET.md' },
      { title: b('Un mode sans entraînement', 'A mode with no training'), text: b('Le score heuristique permet de tester toute la chaîne avant d’avoir un jeu de vidéos étiquetées, puis de basculer vers le LSTM depuis config.py.', 'The heuristic score lets the whole chain be tested before a labelled video set exists, then switched to the LSTM from config.py.'), source: 'config.py' },
    ],
    limitations: [
      b('Aucune métrique mesurée n’est versionnée : les fourchettes de la documentation (65–75 % en heuristique, 80–92 % en LSTM) et les FPS annoncés sont des attentes, sans protocole ni résultat de test publié.', 'No measured metric is versioned: the documentation’s ranges (65–75% heuristic, 80–92% LSTM) and the stated FPS are expectations, with no protocol or published test result.'),
      b('Le split se fait au niveau des séquences, qui se recouvrent à 50 % : des fenêtres d’une même vidéo peuvent se retrouver en entraînement et en test, ce qui surestimerait l’accuracy. Un split par vidéo serait nécessaire.', 'The split is done at sequence level, and sequences overlap by 50%: windows from the same video can land in both training and test, which would overestimate accuracy. A per-video split is needed.'),
      b('Les compteurs de gestes s’accumulent sur toute la durée du track : le score heuristique augmente avec le temps passé à l’écran, indépendamment du comportement.', 'Gesture counters accumulate over the whole track: the heuristic score grows with time on screen, regardless of behaviour.'),
      b('Pas de test sur des images réelles de vidéosurveillance ; les biais (angle de caméra, foule, occlusions) ne sont pas évalués.', 'Not tested on real surveillance footage; biases (camera angle, crowds, occlusions) are not evaluated.'),
    ],
    nextSteps: [
      b('Découper par vidéo, publier les métriques de test et une matrice de confusion.', 'Split by video, publish test metrics and a confusion matrix.'),
      b('Normaliser les compteurs de gestes par durée et mesurer les FPS réels du pipeline complet.', 'Normalise gesture counters by duration and measure the full pipeline’s real FPS.'),
    ],
    sources: ['README.md', 'config.py', 'behavior_analyzer.py', 'behavior_classifier.py', 'train_model.py', 'PROJET_COMPLET.md'],
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
        { title: b('MLP — trois problèmes supervisés', 'MLP — three supervised problems'), text: b('Régression énergétique à deux sorties (R² de 0,994 en chauffage et 0,979 en climatisation), classification à 30 classes et détection de fraude déséquilibrée avec pos_weight ≈ 3,18. Pour le multiclasse, un test de surapprentissage volontaire (100 % sur 500 patients) montre que le modèle apprend, mais que les données n’ont pas de signal exploitable.', 'Two-output energy regression (R² of 0.994 for heating and 0.979 for cooling), 30-class classification and imbalanced fraud detection with pos_weight ≈ 3.18. For the multiclass task, a deliberate overfitting test (100% on 500 patients) shows the model can learn, but the data carries no usable signal.'), source: 'MLP_Supervised_Learning' },
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
      b('Les enseignants de la distillation n’ont pas été fine-tunés sur la tâche cible (ResNet-50 à 33,96 % sur MNIST 3 classes, VGG-16 à 30,28 % sur CIFAR-10 4 classes, proches du hasard) : l’apport de la KD n’est pas démontrable. Les pertes KD, AT, FitNets et RKD sont en revanche implémentées et vérifiées.', 'The distillation teachers were not fine-tuned on the target task (ResNet-50 at 33.96% on 3-class MNIST, VGG-16 at 30.28% on 4-class CIFAR-10, close to chance): the KD benefit cannot be shown. The KD, AT, FitNets and RKD losses are, however, implemented and checked.'),
      b('Les détecteurs COCO de la partie triage ne reconnaissent pas de lésions : leur comparaison porte uniquement sur la vitesse et l’effet des seuils.', 'The COCO detectors in the triage part do not recognise lesions: their comparison covers only speed and threshold behaviour.'),
    ],
    nextSteps: [
      b('Fine-tuner chaque enseignant avant de relancer la distillation, puis terminer le fine-tuning VGG16/ResNet50 et le U-Net.', 'Fine-tune each teacher before rerunning distillation, then finish VGG16/ResNet50 fine-tuning and the U-Net.'),
    ],
    sources: ['README.md', 'Heart_Disease_MLP/README.md', 'MLP_Supervised_Learning/*/README.md', 'Convolutions_From_Scratch/README.md', 'Medical_Image_Triage/README.md', 'Knowledge_Distillation/README.md'],
  },

  // -------------------------------------------------------------------------
  segmentation: {
    context: b('Projet académique — segmentation sémantique', 'Academic project — semantic segmentation'),
    challenge: [
      b('Segmenter des scènes urbaines pixel par pixel sur Cityscapes (19 classes d’évaluation, images 2 048 × 1 024) et tester si une auto-distillation par têtes auxiliaires améliore un U-Net de référence.', 'Segment urban scenes pixel by pixel on Cityscapes (19 evaluation classes, 2,048 × 1,024 images) and test whether self-distillation through auxiliary heads improves a reference U-Net.'),
      b('Les classes sont très déséquilibrées : sur un échantillon de 200 masques, la végétation compte plus de 63 millions de pixels, le train environ 18 000.', 'Classes are highly imbalanced: on a 200-mask sample, vegetation covers over 63 million pixels, trains about 18,000.'),
    ],
    solution: b(
      'Trois notebooks : exploration du dataset et conversion des labelIds vers les 19 trainIds (255 = ignoré), U-Net de référence de 31 M de paramètres en entrée 256 × 512, puis une variante à deux têtes auxiliaires dont les prédictions intermédiaires sont guidées par la tête principale. Les deux modèles sont évalués sur les 500 images de validation à partir d’une matrice de confusion.',
      'Three notebooks: dataset exploration and conversion of labelIds to the 19 trainIds (255 = ignored), a 31M-parameter reference U-Net at 256 × 512 input, then a variant with two auxiliary heads whose intermediate predictions are guided by the main head. Both models are evaluated on the 500 validation images from a confusion matrix.',
    ),
    architecture: {
      nodes: [
        { label: b('Cityscapes', 'Cityscapes'), detail: b('2 975 train · 500 val · 1 525 test', '2,975 train · 500 val · 1,525 test'), kind: 'source' },
        { label: b('Encodage des masques', 'Mask encoding'), detail: b('labelIds → 19 trainIds · 255 ignoré', 'labelIds → 19 trainIds · 255 ignored'), kind: 'process' },
        { label: b('Transformations conjointes', 'Joint transforms'), detail: b('image et masque · 256 × 512 · normalisation ImageNet', 'image and mask · 256 × 512 · ImageNet normalisation'), kind: 'process' },
        { label: b('U-Net de référence', 'Reference U-Net'), detail: b('31 038 803 paramètres', '31,038,803 parameters'), kind: 'model', group: 'm' },
        { label: b('U-Net auto-distillé', 'Self-distilled U-Net'), detail: b('+ 2 têtes auxiliaires · CE + KD + Dice', '+ 2 auxiliary heads · CE + KD + Dice'), kind: 'model', group: 'm' },
        { label: b('Évaluation', 'Evaluation'), detail: b('matrice de confusion · mIoU · IoU par classe', 'confusion matrix · mIoU · per-class IoU'), kind: 'output' },
      ],
      alt: b(
        'Pipeline : images Cityscapes et masques convertis en 19 classes, redimensionnés ensemble en 256 × 512, puis un U-Net de référence et une variante auto-distillée évalués par matrice de confusion.',
        'Pipeline: Cityscapes images and masks converted to 19 classes, resized together to 256 × 512, then a reference U-Net and a self-distilled variant evaluated through a confusion matrix.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Exploration des données', 'Data exploration'), text: b('Vérification des paires image/annotation par split et par ville (3 villes en validation), taille constante des images, distribution des pixels par classe et visualisation d’exemples.', 'Checks image/annotation pairs per split and per city (3 cities in validation), constant image size, per-class pixel distribution and example visualisation.'), source: 'dataset_visualisation.ipynb' },
        { title: b('U-Net de référence', 'Reference U-Net'), text: b('Encodeur à 4 descentes (64 → 1 024 canaux) et décodeur symétrique avec skip connections, BatchNorm et ReLU ; les formes de chaque étage sont vérifiées dans le notebook.', 'Encoder with 4 downsampling stages (64 → 1,024 channels) and a symmetric decoder with skip connections, BatchNorm and ReLU; each stage’s shape is checked in the notebook.'), source: 'model_unet_baseline.ipynb' },
        { title: b('Auto-distillation', 'Self-distillation'), text: b('Deux têtes auxiliaires sur les étages 128 et 256 canaux, remises à la résolution de sortie. La perte combine entropie croisée principale, poids 0,3 pour les têtes auxiliaires, distillation KL (poids 0,05) et Dice.', 'Two auxiliary heads on the 128- and 256-channel stages, upsampled to output resolution. The loss combines main cross-entropy, weight 0.3 for auxiliary heads, KL distillation (weight 0.05) and Dice.'), source: 'unet_selfdistill.ipynb' },
        { title: b('Métriques', 'Metrics'), text: b('Matrice de confusion 19 × 19 accumulée sur toute la validation en ignorant les pixels 255, puis IoU par classe, mIoU et pixel accuracy.', '19 × 19 confusion matrix accumulated over the whole validation set, ignoring 255 pixels, then per-class IoU, mIoU and pixel accuracy.'), source: 'model_unet_baseline.ipynb' },
      ],
    },
    results: {
      intro: b('Sorties exécutées des notebooks, sur les 500 images de validation.', 'Executed notebook outputs, on the 500 validation images.'),
      metrics: [
        { value: '0.284', label: b('mIoU — U-Net de référence', 'mIoU — reference U-Net'), context: b('validation ; pixel accuracy 0,822', 'validation; pixel accuracy 0.822'), source: 'model_unet_baseline.ipynb (outputs)' },
        { value: '0.080', label: b('mIoU — variante auto-distillée', 'mIoU — self-distilled variant'), context: b('validation ; pixel accuracy 0,482', 'validation; pixel accuracy 0.482'), source: 'unet_selfdistill.ipynb (outputs)' },
      ],
      table: {
        caption: b('IoU par classe du U-Net de référence (extrait)', 'Reference U-Net per-class IoU (excerpt)'),
        columns: [b('Classe', 'Class'), b('IoU', 'IoU')],
        rows: [
          ['vegetation', '0.754'],
          ['car', '0.695'],
          ['sidewalk', '0.627'],
          ['sky', '0.578'],
          ['person', '0.246'],
          ['wall / fence', '0.003 / 0.000'],
          ['rider, truck, train, motorcycle', '0.000'],
        ],
        source: 'model_unet_baseline.ipynb (outputs)',
      },
      note: b('Le modèle apprend les grandes surfaces mais rate les classes rares : quatre classes sont à zéro. L’auto-distillation n’a pas amélioré le modèle dans cette expérience ; sa pixel accuracy (0,48) indique plutôt un entraînement qui n’a pas convergé.', 'The model learns large surfaces but misses rare classes: four classes are at zero. Self-distillation did not improve the model in this experiment; its pixel accuracy (0.48) points to training that did not converge.'),
    },
    limitations: [
      b('Le code d’entraînement, les modules src/ (dataset, modèles, pertes, métriques) et les checkpoints ne sont pas publiés : les deux notebooks ne sont pas reproductibles en l’état.', 'The training code, the src/ modules (dataset, models, losses, metrics) and the checkpoints are not published: neither notebook is reproducible as is.'),
      b('mIoU de référence faible pour Cityscapes, entraîné à résolution réduite (256 × 512).', 'Low reference mIoU for Cityscapes, trained at reduced resolution (256 × 512).'),
      b('Une seule exécution par modèle, sans courbes d’entraînement versionnées pour comprendre l’échec de la variante.', 'One run per model, with no versioned training curves to explain the variant’s failure.'),
    ],
    nextSteps: [
      b('Publier src/ et les scripts d’entraînement, ajouter une pondération ou une perte focalisée pour les classes rares.', 'Publish src/ and the training scripts, add class weighting or a focal loss for rare classes.'),
      b('Relancer l’auto-distillation à partir d’un modèle de référence convergé et comparer à budget égal.', 'Rerun self-distillation from a converged reference model and compare at equal budget.'),
    ],
    sources: ['README.md', 'dataset_visualisation.ipynb', 'model_unet_baseline.ipynb', 'unet_selfdistill.ipynb (executed outputs)'],
  },

  // -------------------------------------------------------------------------
  ccsvm: {
    context: b('Travaux pratiques académiques — optimisation (ENSIAS, cours SVM with Random Variables)', 'Academic coursework — optimisation (ENSIAS, SVM with Random Variables course)'),
    challenge: [
      b('Étudier les SVM quand les mesures sont incertaines : chaque contrainte de classification ou de régression ne doit être satisfaite qu’avec une probabilité p, quelle que soit la loi exacte du bruit.', 'Study SVMs when measurements are uncertain: each classification or regression constraint only needs to hold with probability p, whatever the exact noise distribution.'),
      b('Il faut ensuite choisir ensemble C, p et un troisième hyperparamètre (pondération des classes a ou largeur de bande ε), puis vérifier que le modèle obtenu résiste vraiment à de nouvelles mesures bruitées.', 'C, p and a third hyperparameter (class weighting a or band width ε) then have to be chosen together, and the resulting model has to be checked against genuinely new noisy measurements.'),
    ],
    solution: b(
      'Quatre notebooks formulent les SVM à contraintes probabilistes comme des problèmes coniques du second ordre (SOCP) via l’inégalité de Cantelli, les résolvent en primal et en dual avec CVXPY, choisissent les hyperparamètres par optimisation bilevel ou trilevel et évaluent chaque modèle sur des données re-mesurées. Chaque TP relie les résultats à la dimension VC, à la complexité de Rademacher et au compromis biais–variance.',
      'Four notebooks formulate chance-constrained SVMs as second-order cone programs (SOCP) through Cantelli’s inequality, solve them in primal and dual form with CVXPY, choose hyperparameters by bilevel or trilevel optimisation and evaluate each model on re-measured data. Each lab connects results to VC dimension, Rademacher complexity and the bias–variance trade-off.',
    ),
    architecture: {
      nodes: [
        { label: b('Données incertaines', 'Uncertain data'), detail: b('moyenne + covariance par individu', 'mean + covariance per sample'), kind: 'source' },
        { label: b('Contrainte de Cantelli', 'Cantelli constraint'), detail: b('κ(p) = √(p / (1 − p))', 'κ(p) = √(p / (1 − p))'), kind: 'process' },
        { label: b('SOCP primal / dual', 'Primal / dual SOCP'), detail: b('CVXPY · dualité vérifiée', 'CVXPY · duality checked'), kind: 'model' },
        { label: b('Optimisation multiniveau', 'Multilevel optimisation'), detail: b('niveau 2 : (C, a ou ε) · niveau 1 : p', 'level 2: (C, a or ε) · level 1: p'), kind: 'process' },
        { label: b('Test sur re-mesures', 'Test on re-measurements'), detail: b('erreur avec et sans bruit', 'error with and without noise'), kind: 'output' },
        { label: b('Théorie de la généralisation', 'Generalisation theory'), detail: b('VC · Rademacher · biais–variance', 'VC · Rademacher · bias–variance'), kind: 'output' },
      ],
      alt: b(
        'Démarche : des données décrites par une moyenne et une covariance donnent une contrainte de Cantelli, résolue comme un SOCP en primal et en dual ; une optimisation multiniveau choisit les hyperparamètres, puis le modèle est testé sur des re-mesures et analysé par la théorie de la généralisation.',
        'Approach: data described by a mean and covariance yields a Cantelli constraint, solved as a primal and dual SOCP; multilevel optimisation picks the hyperparameters, then the model is tested on re-measurements and analysed with generalisation theory.',
      ),
    },
    implementation: {
      title: b('Travaux pratiques', 'Coursework'),
      items: [
        { title: b('TP1 — données simulées', 'TP1 — simulated data'), text: b('SVC probabiliste sur 100 individus ayant chacun 10 à 30 réalisations, en bruit gaussien puis uniforme. Le dual est vérifié contre le primal, la version moindres carrés est comparée, et un bootstrap confirme que la probabilité exigée est respectée (0,998 observée pour p = 0,9).', 'Probabilistic SVC on 100 samples with 10–30 realisations each, under Gaussian then uniform noise. The dual is checked against the primal, the least-squares version is compared, and a bootstrap confirms the required probability holds (0.998 observed for p = 0.9).'), source: 'TP1_SVC_probabiliste_simule.ipynb' },
        { title: b('TP2 — Breast Cancer', 'TP2 — Breast Cancer'), text: b('SVC linéaire sur 10 mesures avec leur erreur standard. Le trilevel retient p = 0,7, C = 0,1 et a = 2 (erreurs sur les tumeurs malignes pénalisées deux fois plus). Les plus petits poids vont aux variables les plus bruitées (symétrie, dimension fractale) : une sélection de variables guidée par le bruit.', 'Linear SVC on 10 measurements with their standard error. The trilevel picks p = 0.7, C = 0.1 and a = 2 (errors on malignant tumours penalised twice as much). The smallest weights go to the noisiest variables (symmetry, fractal dimension): noise-guided feature selection.'), source: 'TP2_SVC_lineaire_BreastCancer.ipynb' },
        { title: b('TP3 — Seeds multiclasse', 'TP3 — Seeds multiclass'), text: b('One-vs-Rest et One-vs-One sur 210 grains, incertitude estimée par voisinage dans le seul jeu de développement (pas de fuite vers le test). Validation croisée à 5 plis aux deux niveaux ; analyse par la dimension de Natarajan et une borne de marge multiclasse.', 'One-vs-Rest and One-vs-One on 210 grains, uncertainty estimated by neighbourhood within the development set only (no leakage into test). 5-fold cross-validation at both levels; analysis with Natarajan dimension and a multiclass margin bound.'), source: 'TP3_SVC_multiclasse_Seeds.ipynb' },
        { title: b('TP4 — SVR Diabetes', 'TP4 — SVR Diabetes'), text: b('SVR probabiliste à bande ε sur 442 patients. Le trilevel retient p = 0,3, C = 10 et ε = 0,5, cohérent avec la règle de Cherkassky & Ma (ε ≈ 0,30). Les coefficients des variables les plus incertaines (IMC, pression, triglycérides) sont réduits.', 'Probabilistic ε-band SVR on 442 patients. The trilevel picks p = 0.3, C = 10 and ε = 0.5, consistent with the Cherkassky & Ma rule (ε ≈ 0.30). Coefficients of the most uncertain variables (BMI, blood pressure, triglycerides) are reduced.'), source: 'TP4_SVR_probabiliste_Diabetes.ipynb' },
      ],
    },
    decisions: [
      { title: b('Cantelli plutôt qu’une hypothèse gaussienne', 'Cantelli rather than a Gaussian assumption'), text: b('Sur données réelles la loi du bruit est inconnue ; l’inégalité de Cantelli donne une garantie valable pour toute loi de moyenne et de variance données, au prix d’un κ plus grand.', 'On real data the noise distribution is unknown; Cantelli’s inequality gives a guarantee for any distribution with given mean and variance, at the cost of a larger κ.'), source: 'TP2 §1' },
      { title: b('Choisir p sur données bruitées', 'Choose p on noisy data'), text: b('Le niveau supérieur minimise l’erreur sur des re-mesures simulées, pas sur les données propres : sinon il retiendrait toujours p = 0, c’est-à-dire le SVM classique.', 'The upper level minimises error on simulated re-measurements, not on clean data: otherwise it would always pick p = 0, i.e. the classical SVM.'), source: 'TP2 §3 · TP3 §3' },
    ],
    results: {
      intro: b('Sorties exécutées des notebooks, sur les jeux de test jamais utilisés pour le réglage. « Test bruité » : erreur moyenne sur des re-mesures simulées des individus de test.', 'Executed notebook outputs, on test sets never used for tuning. “Noisy test”: mean error on simulated re-measurements of test samples.'),
      metrics: [
        { value: '5.8 % vs 18.1 %', label: b('erreur sur re-mesures — Seeds', 'error on re-measurements — Seeds'), context: b('PC-SVC contre SVM classique, même erreur sans bruit (4,8 %, 2 grains sur 42)', 'PC-SVC vs classical SVM, same noise-free error (4.8%, 2 of 42 grains)'), source: 'TP3 §5' },
        { value: '7.75 % vs 9.1 %', label: b('erreur sur re-mesures — Breast Cancer', 'error on re-measurements — Breast Cancer'), context: b('même erreur sans bruit (7,9 %) ; sensibilité 92,9 % contre 95,2 %', 'same noise-free error (7.9%); sensitivity 92.9% vs 95.2%'), source: 'TP2 §5' },
      ],
      table: {
        caption: b('Modèle probabiliste contre modèle classique, sur le test', 'Probabilistic vs classical model, on test'),
        columns: [b('TP', 'Lab'), b('Mesure', 'Measure'), b('Sans bruit', 'Noise-free'), b('Sur re-mesures', 'On re-measurements')],
        rows: [
          ['TP2 Breast Cancer', 'err. PC-SVC / SVM', '0.079 / 0.079', '0.0775 / 0.0911'],
          ['TP3 Seeds (OvR)', 'err. PC-SVC / SVM', '0.048 / 0.048', '0.0583 / 0.1814'],
          ['TP4 Diabetes', 'RMSE PC-SVR / SVR (σ)', '0.738 / 0.744', '0.777 / 0.803'],
        ],
        source: 'TP2 §5 · TP3 §5 · TP4 §5',
      },
      note: b('À erreur égale sur données propres, la contrainte probabiliste rend les modèles nettement plus robustes aux nouvelles mesures. Le gain est faible en régression : sur Diabetes, R² reste à 0,348, la cible étant très bruitée.', 'At equal error on clean data, the probabilistic constraint makes models markedly more robust to new measurements. The gain is small in regression: on Diabetes, R² stays at 0.348 because the target is very noisy.'),
    },
    limitations: [
      b('Travail d’étude sur de petits jeux de données (42 à 114 individus de test) : les écarts portent sur quelques individus.', 'Study work on small datasets (42 to 114 test samples): differences come down to a few samples.'),
      b('Sur Breast Cancer et Diabetes l’incertitude des mesures est donnée ou estimée, et les re-mesures sont simulées à partir d’elle : la robustesse est évaluée sous le modèle de bruit supposé.', 'On Breast Cancer and Diabetes the measurement uncertainty is given or estimated, and re-measurements are simulated from it: robustness is assessed under the assumed noise model.'),
      b('Modèles linéaires uniquement ; les bornes de généralisation calculées sont souvent vides avec si peu de données.', 'Linear models only; the generalisation bounds computed are often vacuous with so little data.'),
    ],
    sources: ['README.md', 'TP1_SVC_probabiliste_simule.ipynb', 'TP2_SVC_lineaire_BreastCancer.ipynb', 'TP3_SVC_multiclasse_Seeds.ipynb', 'TP4_SVR_probabiliste_Diabetes.ipynb (executed outputs)'],
  },

  // -------------------------------------------------------------------------
  speaker: {
    context: b('Projet personnel — traitement du signal', 'Personal project — signal processing'),
    challenge: [
      b(
        "Identifier un locuteur dans des communications radio de police, où le canal coupe les fréquences, ajoute du bruit et compresse la dynamique.",
        'Identify a speaker in police radio communications, where the channel cuts frequencies, adds noise and compresses dynamics.',
      ),
      b(
        'Aucun corpus radio étiqueté n’est disponible : il faut fabriquer des conditions proches du terrain à partir de voix propres.',
        'No labelled radio corpus is available: field-like conditions have to be built from clean voices.',
      ),
    ],
    solution: b(
      'Un pipeline qui dégrade des voix VoxCeleb à travers un canal radio simulé (passe-bande 300–3 000 Hz, bruit à SNR contrôlé, écrêtage doux), double les données avec deux niveaux de SNR, résume chaque extrait de 3 s en 140 features acoustiques et entraîne un SVM à noyau RBF. Une interface Streamlit identifie le locuteur segment par segment et affiche spectrogramme et MFCC.',
      'A pipeline that degrades VoxCeleb voices through a simulated radio channel (300–3,000 Hz band-pass, noise at controlled SNR, soft clipping), doubles the data with two SNR levels, summarises each 3 s clip into 140 acoustic features and trains an RBF-kernel SVM. A Streamlit interface identifies the speaker segment by segment and shows the spectrogram and MFCCs.',
    ),
    architecture: {
      nodes: [
        { label: b('VoxCeleb', 'VoxCeleb'), detail: b('50 locuteurs (« agents ») · extraits de 3 s à 16 kHz', '50 speakers (“agents”) · 3 s clips at 16 kHz'), kind: 'source' },
        { label: b('Canal radio simulé', 'Simulated radio channel'), detail: b('Butterworth ordre 8 · 300–3 000 Hz · bruit · tanh', 'order-8 Butterworth · 300–3,000 Hz · noise · tanh'), kind: 'process' },
        { label: b('Augmentation SNR', 'SNR augmentation'), detail: b('10 dB et 15 dB → 2×', '10 dB and 15 dB → 2×'), kind: 'process' },
        { label: b('140 features', '140 features'), detail: b('MFCC + Δ + ΔΔ, contraste spectral, centroïde, bande, ZCR', 'MFCC + Δ + ΔΔ, spectral contrast, centroid, bandwidth, ZCR'), kind: 'process' },
        { label: b('SVM RBF', 'RBF SVM'), detail: b('C = 33 · γ = 0,0045', 'C = 33 · γ = 0.0045'), kind: 'model' },
        { label: b('Interface Streamlit', 'Streamlit interface'), detail: b('identification par segment · analyse du signal', 'per-segment identification · signal analysis'), kind: 'output' },
      ],
      alt: b(
        'Pipeline : voix VoxCeleb passées dans un canal radio simulé à deux niveaux de SNR, 140 features acoustiques, SVM à noyau RBF, interface Streamlit.',
        'Pipeline: VoxCeleb voices passed through a simulated radio channel at two SNR levels, 140 acoustic features, RBF-kernel SVM, Streamlit interface.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Sélection des agents', 'Agent selection'), text: b('Exploration de VoxCeleb puis sélection de 50 locuteurs disposant d’au moins 200 extraits, avec un test de la simulation sur quelques agents avant de traiter l’ensemble.', 'VoxCeleb exploration then selection of 50 speakers with at least 200 clips, with a simulation test on a few agents before processing the whole set.'), source: 'explore_dataset.py · selection_agents.py · config.py' },
        { title: b('Simulation du canal', 'Channel simulation'), text: b('Filtre passe-bande Butterworth d’ordre 8 (bande téléphonique 300–3 000 Hz), bruit blanc dosé pour atteindre le SNR visé, écrêtage doux par tanh pour imiter la compression, puis normalisation.', 'Order-8 Butterworth band-pass filter (300–3,000 Hz telephone band), white noise scaled to the target SNR, tanh soft clipping to imitate compression, then normalisation.'), source: 'radio_simulation.py' },
        { title: b('Features robustes', 'Robust features'), text: b('20 MFCC avec leurs dérivées première et seconde, contraste spectral, centroïde, largeur de bande et taux de passage par zéro, chacun résumé par sa moyenne et son écart-type.', '20 MFCCs with their first and second derivatives, spectral contrast, centroid, bandwidth and zero-crossing rate, each summarised by mean and standard deviation.'), source: 'feature_extraction.py' },
        { title: b('Entraînement', 'Training'), text: b('Standardisation, split stratifié 70/15/15 par agent, SVM RBF ; un script GridSearchCV à 5 plis affine C et γ. Le modèle, le scaler et l’encodeur de labels sont sauvegardés pour l’interface.', 'Standardisation, 70/15/15 split stratified by agent, RBF SVM; a 5-fold GridSearchCV script tunes C and γ. The model, scaler and label encoder are saved for the interface.'), source: 'train_model.py · train_model_gridsearch.py' },
      ],
    },
    results: {
      metrics: [
        { value: '86.98 %', label: b('accuracy de test', 'test accuracy'), context: b('2 250 échantillons, 50 agents ; validation 86,89 %, entraînement 92,15 %', '2,250 samples, 50 agents; validation 86.89%, training 92.15%'), source: 'Documentation/rapport_detection_locuteur.pdf' },
      ],
      note: b(
        "Chaque extrait existe en deux versions (10 dB et 15 dB) et le découpage est aléatoire au niveau des échantillons : les deux versions d'un même extrait peuvent se trouver l'une en entraînement, l'autre en test. Ce score est donc probablement optimiste.",
        'Each clip exists in two versions (10 dB and 15 dB) and the split is random at sample level: the two versions of the same clip can land one in training and the other in test. This score is therefore likely optimistic.',
      ),
    },
    limitations: [
      b('Fuite probable entre entraînement et test (voir ci-dessus) ; un découpage par extrait, voire par vidéo, serait plus fiable.', 'Likely train/test leakage (see above); splitting by clip, or even by video, would be more reliable.'),
      b('Canal radio simulé, pas d’enregistrements radio réels. La compression est un écrêtage tanh : les paramètres d’attaque et de relâchement déclarés dans config.py ne sont pas utilisés.', 'Simulated radio channel, no real radio recordings. Compression is tanh clipping: the attack and release parameters declared in config.py are not used.'),
      b('La recherche d’hyperparamètres versionnée ne teste que deux valeurs de C et une de γ, autour d’un réglage déjà choisi.', 'The versioned hyperparameter search tests only two values of C and one of γ, around an already chosen setting.'),
      b('Identification en ensemble fermé : un locuteur inconnu sera toujours attribué à l’un des 50 agents.', 'Closed-set identification: an unknown speaker is always assigned to one of the 50 agents.'),
    ],
    nextSteps: [
      b('Découper par vidéo VoxCeleb, réévaluer, puis tester sur des SNR non vus à l’entraînement.', 'Split by VoxCeleb video, re-evaluate, then test on SNRs unseen in training.'),
      b('Comparer à des embeddings de locuteur pré-entraînés (x-vectors, ECAPA) et ajouter un rejet des locuteurs inconnus.', 'Compare with pretrained speaker embeddings (x-vectors, ECAPA) and add rejection of unknown speakers.'),
    ],
    sources: ['README.md', 'reconnaisance_locuteur/config.py', 'radio_simulation.py', 'feature_extraction.py', 'train_model*.py', 'Documentation/rapport_detection_locuteur.pdf'],
  },

  // -------------------------------------------------------------------------
  motoscraper: {
    context: b('Projet de fin d’année — data', 'Year-end project — data'),
    challenge: [
      b(
        "Savoir si importer une moto d'occasion d'Europe au Maroc est rentable demande de croiser trois sources : le prix de l'annonce, le montant calculé par la douane marocaine et le prix du marché local.",
        'Knowing whether importing a used motorcycle from Europe to Morocco pays off requires combining three sources: the listing price, the amount computed by Moroccan customs and the local market price.',
      ),
      b(
        'Aucune de ces sources n’offre d’API : le simulateur de la douane, en particulier, impose de choisir marque, modèle et date de mise en circulation dans une interface web.',
        'None of these sources offers an API: the customs simulator, in particular, requires picking make, model and registration date in a web interface.',
      ),
    ],
    solution: b(
      "Un script Python piloté par Selenium collecte les annonces LeParking pour un modèle et un pays, ne garde que les motos de moins de 5 ans, remplit le simulateur de droits du portail douane.gov.ma pour chacune, puis cherche sur Avito le prix moyen du même modèle et de la même année. Il calcule enfin la marge brute et la rentabilité de chaque annonce et les trace en graphique.",
      'A Selenium-driven Python script collects LeParking listings for a model and a country, keeps only motorcycles under 5 years old, fills the douane.gov.ma duty simulator for each, then looks up on Avito the average price of the same model and year. Finally it computes each listing’s gross margin and profitability and plots them.',
    ),
    architecture: {
      nodes: [
        { label: b('LeParking', 'LeParking'), detail: b('annonces Europe · filtre < 5 ans', 'Europe listings · < 5-year filter'), kind: 'source', group: 's' },
        { label: b('Portail douane.gov.ma', 'douane.gov.ma portal'), detail: b('simulateur de droits · marque, modèle, date', 'duty simulator · make, model, date'), kind: 'source', group: 's' },
        { label: b('Avito', 'Avito'), detail: b('moyenne de 10 annonces max · même année', 'average of up to 10 listings · same year'), kind: 'source', group: 's' },
        { label: b('Selenium + Pandas', 'Selenium + Pandas'), detail: b('rapprochement des noms de modèles · cache par modèle et année', 'model-name matching · cache per model and year'), kind: 'process' },
        { label: b('Marge brute et rentabilité', 'Gross margin and profitability'), detail: b('CSV + graphique en chandeliers', 'CSV + candlestick chart'), kind: 'output' },
      ],
      alt: b(
        'Pipeline : annonces LeParking, montant du simulateur de la douane et prix Avito sont collectés avec Selenium, rapprochés avec Pandas, puis transformés en marge brute par annonce.',
        'Pipeline: LeParking listings, the customs simulator amount and Avito prices are collected with Selenium, matched with Pandas, then turned into a gross margin per listing.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Annonces européennes', 'European listings'), text: b('Pour la marque, le modèle, le pays et le nombre de pages saisis, le script lit prix, kilométrage, lieu, lien et année, reconstitue une date de mise en circulation et écarte les motos de plus de 5 ans. Les doublons sont retirés sur le lien.', 'For the make, model, country and page count entered, the script reads price, mileage, location, link and year, rebuilds a registration date and drops motorcycles older than 5 years. Duplicates are removed on the link.'), source: 'import_moto.py' },
        { title: b('Automatisation du portail douanier', 'Customs portal automation'), text: b('Navigation dans le calcul des droits : choix de la marque, du modèle par correspondance de texte, puis de l’année, du mois et du jour dans le calendrier, et lecture du montant en dirhams. Les noms de modèles sont rapprochés de la liste des modèles extraite au préalable du même portail (tous_les_modeles.csv), par normalisation et inclusion.', 'Navigates the duty calculator: picks the make, the model by text match, then year, month and day in the calendar, and reads the amount in dirhams. Model names are matched to the model list previously extracted from the same portal (tous_les_modeles.csv), through normalisation and substring inclusion.'), source: 'import_moto.py · modeles_de_motos.py' },
        { title: b('Prix du marché marocain', 'Moroccan market price'), text: b('Recherche Avito filtrée sur l’année, moyenne des 10 premières annonces ; le résultat est réutilisé pour les annonces de même modèle et même année afin de limiter les requêtes.', 'Avito search filtered by year, average of the first 10 listings; the result is reused for listings with the same model and year to limit requests.'), source: 'import_moto.py' },
        { title: b('Calcul et visualisation', 'Computation and visualisation'), text: b('Marge brute = prix moyen Maroc − (prix d’achat + montant douanier) ; rentabilité = marge / coût total. Graphique en chandeliers par annonce, vert si la marge est positive.', 'Gross margin = average Moroccan price − (purchase price + customs amount); profitability = margin / total cost. Candlestick chart per listing, green when the margin is positive.'), source: 'import_moto.py' },
      ],
    },
    results: {
      intro: b('Run versionné : Yamaha MT-09 et MT-09 SP proposées en Espagne.', 'Versioned run: Yamaha MT-09 and MT-09 SP listed in Spain.'),
      metrics: [
        { value: '5 / 83', label: b('annonces avec une marge brute positive', 'listings with a positive gross margin'), context: b('Yamaha MT-09 / MT-09 SP en Espagne', 'Yamaha MT-09 / MT-09 SP in Spain'), source: 'resultats_analyse_rentabilite.csv' },
        { value: '−20.9 %', label: b('rentabilité médiane', 'median profitability'), context: b('de −30,1 % à +10,0 % selon l’annonce', 'from −30.1% to +10.0% depending on the listing'), source: 'resultats_analyse_rentabilite.csv' },
      ],
      note: b('Sur cet échantillon, importer est rarement rentable : l’outil sert justement à le vérifier avant d’acheter.', 'On this sample, importing is rarely profitable: the tool exists precisely to check that before buying.'),
    },
    limitations: [
      b('Dépend de la structure HTML de trois sites (sélecteurs CSS générés sur Avito) : un changement de mise en page casse la collecte. CAPTCHA sur certains sites, contourné manuellement selon le rapport.', 'Depends on the HTML structure of three sites (generated CSS selectors on Avito): a layout change breaks collection. CAPTCHAs on some sites, handled manually according to the report.'),
      b('Marge brute hors transport, homologation et frais annexes ; le prix Maroc est une moyenne de prix affichés, pas de prix de vente.', 'Gross margin excludes transport, homologation and ancillary fees; the Moroccan price is an average of asking prices, not sale prices.'),
      b('Un seul modèle et un seul pays dans le résultat versionné ; script interactif (saisies clavier) et chemin ChromeDriver Windows codé en dur.', 'A single model and a single country in the versioned result; interactive script (keyboard input) and a hard-coded Windows ChromeDriver path.'),
    ],
    nextSteps: [
      b('Ajouter les coûts de transport et d’homologation, et passer les paramètres en ligne de commande pour lancer plusieurs modèles et pays.', 'Add transport and homologation costs, and move parameters to the command line to run several models and countries.'),
    ],
    sources: ['README.md', 'import_moto.py', 'modeles_de_motos.py', 'resultats_analyse_rentabilite.csv', 'Documentation et Rapport/rapport_pfa_jad_falaq.pdf'],
  },

  // -------------------------------------------------------------------------
  irrigation: {
    context: b('Projet personnel — IoT et mobile', 'Personal project — IoT and mobile'),
    challenge: [
      b(
        "Piloter l'irrigation de six zones et d'un bassin depuis un téléphone, en sécurité : une seule vanne ouverte à la fois, une pompe qui ne démarre jamais sur une vanne fermée, et un retour d'état fiable vers l'application.",
        'Control irrigation of six zones and a tank from a phone, safely: one valve open at a time, a pump that never starts against a closed valve, and reliable status feedback to the app.',
      ),
      b(
        'Le système doit aussi rester utilisable sur place, avec des boutons physiques, sans dépendre du réseau.',
        'The system also has to stay usable on site, with physical buttons, without depending on the network.',
      ),
    ],
    solution: b(
      "Une architecture en trois couches : l'application Flutter écrit des commandes dans Firebase Realtime Database ; un ESP32 les écoute et les traduit en messages texte sur une liaison série ; un Arduino Mega pilote les relais de 6 vannes, de la pompe principale et de la pompe du bassin à l'aide de machines à états non bloquantes, puis renvoie journal et état à l'ESP32, qui les republie dans Firebase.",
      'A three-layer architecture: the Flutter app writes commands to Firebase Realtime Database; an ESP32 listens and turns them into text messages over a serial link; an Arduino Mega drives the relays of 6 valves, the main pump and the tank pump through non-blocking state machines, then sends logs and status back to the ESP32, which republishes them to Firebase.',
    ),
    architecture: {
      nodes: [
        { label: b('Application Flutter', 'Flutter app'), detail: b('Firebase Auth · Google Sign-In · Provider · FL Chart', 'Firebase Auth · Google Sign-In · Provider · FL Chart'), kind: 'source' },
        { label: b('Firebase Realtime Database', 'Firebase Realtime Database'), detail: b('commandes · zones · plannings · historique · journal', 'commands · zones · schedules · history · logs'), kind: 'infra' },
        { label: b('ESP32 (PlatformIO)', 'ESP32 (PlatformIO)'), detail: b('stream des commandes → protocole série', 'command stream → serial protocol'), kind: 'process' },
        { label: b('Arduino Mega', 'Arduino Mega'), detail: b('machines à états · boutons physiques · STATUS', 'state machines · physical buttons · STATUS'), kind: 'process' },
        { label: b('Relais actifs bas', 'Active-low relays'), detail: b('6 vannes · pompe · pompe du bassin', '6 valves · pump · tank pump'), kind: 'output' },
      ],
      alt: b(
        "Architecture : l'application Flutter écrit dans Firebase Realtime Database ; l'ESP32 lit les commandes et les transmet par liaison série à l'Arduino Mega, qui pilote les relais des vannes et des pompes et renvoie son état.",
        'Architecture: the Flutter app writes to Firebase Realtime Database; the ESP32 reads commands and forwards them over serial to the Arduino Mega, which drives the valve and pump relays and reports its status.',
      ),
    },
    implementation: {
      title: b('Implémentation', 'Implementation'),
      items: [
        { title: b('Application mobile', 'Mobile app'), text: b('Écrans Accueil, Bassin, Planning, Statistiques et Paramètres, gestion des zones (nom, durée), connexion Google. Un Provider écoute en temps réel zones, pompe, bassin, mode automatique, état et journal, et signale les commandes en attente de confirmation.', 'Home, Tank, Schedule, Statistics and Settings screens, zone management (name, duration), Google sign-in. A Provider listens in real time to zones, pump, tank, automatic mode, status and logs, and flags commands awaiting confirmation.'), source: 'app flutter/lib/' },
        { title: b('Passerelle ESP32', 'ESP32 gateway'), text: b('Initialise l’arbre Firebase, écoute le nœud des commandes, envoie à l’Arduino des messages comme ZONE3:ON, AUTO:START, BASIN:OFF ou SETTIME2:30, supprime chaque commande traitée et publie les lignes de journal reçues avec un horodatage.', 'Initialises the Firebase tree, listens to the commands node, sends the Arduino messages such as ZONE3:ON, AUTO:START, BASIN:OFF or SETTIME2:30, deletes each processed command and publishes the log lines it receives with a timestamp.'), source: 'esp_32/main.cpp' },
        { title: b('Séquences sûres côté Arduino', 'Safe sequences on the Arduino'), text: b('Une zone ne s’ouvre que si aucune autre vanne n’est ouverte. La vanne s’ouvre avant la pompe et se ferme après elle (1 s par défaut, réglable à distance). Le mode automatique parcourt les zones une à une avec une durée propre à chacune, sans delay() bloquant, grâce à millis().', 'A zone opens only if no other valve is open. The valve opens before the pump and closes after it (1 s by default, remotely adjustable). Automatic mode steps through zones one by one with its own duration for each, without blocking delay(), using millis().'), source: 'arduino_mega/arduino_mega_esp32__1_.ino' },
        { title: b('Commande locale', 'Local control'), text: b('Six boutons de zone et un bouton AUTO, avec anti-rebond, pilotent les mêmes machines à états que les commandes distantes ; une requête STATUS? renvoie l’état de la pompe, du mode automatique et des six vannes.', 'Six zone buttons and an AUTO button, debounced, drive the same state machines as remote commands; a STATUS? request returns the state of the pump, the automatic mode and the six valves.'), source: 'arduino_mega/arduino_mega_esp32__1_.ino' },
      ],
    },
    decisions: [
      { title: b('Séparer réseau et puissance', 'Separate networking from power control'), text: b('L’ESP32 gère le Wi-Fi et Firebase ; l’Arduino Mega garde la logique de sécurité des relais. Une coupure réseau n’empêche pas la commande par boutons.', 'The ESP32 handles Wi-Fi and Firebase; the Arduino Mega keeps the relay safety logic. A network outage does not prevent button control.'), source: 'esp_32/main.cpp · arduino_mega/*.ino' },
      { title: b('Un protocole série lisible', 'A readable serial protocol'), text: b('Des commandes texte d’une ligne facilitent le débogage au moniteur série et sur simulateur.', 'One-line text commands make debugging easy on the serial monitor and in a simulator.'), source: 'arduino_mega/*.ino' },
    ],
    limitations: [
      b('Aucune mesure publiée (fiabilité, latence, tests sur le terrain).', 'No published measurement (reliability, latency, field tests).'),
      b('Pas de capteur dans le firmware versionné : l’irrigation est commandée par durée, pas par humidité du sol. Les litres affichés sont estimés à partir de la durée (0,5 L/s fixe), pas mesurés.', 'No sensor in the versioned firmware: irrigation is driven by duration, not soil moisture. The litres shown are estimated from duration (fixed 0.5 L/s), not measured.'),
      b('Les plannings sont enregistrés dans Firebase, mais aucun code versionné ne les déclenche automatiquement.', 'Schedules are stored in Firebase, but no versioned code triggers them automatically.'),
      b('Configuration Wi-Fi et Firebase codée en dur dans le firmware, pour un seul compte administrateur.', 'Wi-Fi and Firebase configuration hard-coded in the firmware, for a single administrator account.'),
    ],
    nextSteps: [
      b('Ajouter capteurs d’humidité et débitmètre, et exécuter les plannings côté ESP32 pour qu’ils fonctionnent sans l’application.', 'Add moisture sensors and a flow meter, and run schedules on the ESP32 so they work without the app.'),
      b('Sortir la configuration du code et ajouter un provisioning Wi-Fi.', 'Move configuration out of the code and add Wi-Fi provisioning.'),
    ],
    sources: ['README.md', 'app flutter/lib/', 'esp_32/main.cpp', 'arduino_mega/arduino_mega_esp32__1_.ino'],
  },
}
