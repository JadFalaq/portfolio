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
        { title: b('Confidentialité et limites de service', 'Privacy and service limits'), text: b('Le dépôt documente la suppression des images temporaires après analyse, des fichiers limités à 15 Mo, un CORS restreint et une limite de 10 requêtes/minute et 100/heure par IP. Le conteneur s’exécute sans privilèges root.', 'The repository documents deletion of temporary images after analysis, a 15 MB upload limit, restricted CORS and limits of 10 requests/minute and 100/hour per IP. The container runs as a non-root user.'), source: 'docs/deployment.md' },
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
        { value: '11 + 5', label: b('tests unitaires + intégration', 'unit + integration tests'), context: b('bilan présenté à la soutenance ; le workflow actuel contient aussi des contrôles de sécurité', 'counts reported in the presentation; the current workflow also includes security checks'), source: 'Présentation p. 19, 22 · cd-service.yml' },
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
