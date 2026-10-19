import type { Language } from '../contexts/LanguageContext'

// ---------------------------------------------------------------------------
// AKWA Group — Intelligent Audit case study.
//
// Sources (every figure below is traceable):
//   [R]  Internship report "Rapport_PFA_Jad_Falaq_Audit_Intelligent.pdf" (44 p.)
//        Tables 3.4–3.5 (label counts), 3.7 (selected variables), 3.8–3.12
//        (classification reports), §3.3.4 (invoice-level aggregation),
//        §3.4.1 (80/20 split), §3.4.5 (deployment discussion), §3.5 (limits).
//   [P]  Project presentation (28 slides) — slide 7 (data period).
//   [C]  github.com/JadFalaq/Audit-Intelligent — RandomForestClassifier.py
//        (n_estimators=200, class_weight='balanced'), LogisticRegression.py /
//        SVM.py (class_weight='balanced'), KNeighborsClassifier.py (StandardScaler).
//
// Not used on purpose: Table 3.13 (TP/FP/TN/FN). Its counts do not reconcile with
// Table 3.11 (they give precision 0.88 / accuracy 0.97 vs 0.93 / 0.98), so no
// confusion matrix is derived from it.
// ---------------------------------------------------------------------------

export interface ModelRow {
  name: string
  family: string
  /** Class "Missing" (1) — from the model's own classification report. */
  recall: number
  precision: number
  f1: number
  macroRecall: number
  /** Number of "Missing" invoices in that run's test set. */
  support: number
  source: string
}

// Same values in both languages (numbers and table references).
export const akwaModels: ModelRow[] = [
  { name: 'Logistic Regression', family: 'linear', recall: 0.8, precision: 0.19, f1: 0.31, macroRecall: 0.73, support: 2815, source: '3.8' },
  { name: 'SVM (LinearSVC)', family: 'margin', recall: 0.49, precision: 0.17, f1: 0.26, macroRecall: 0.63, support: 2815, source: '3.9' },
  { name: 'Decision Tree', family: 'tree', recall: 0.82, precision: 0.82, f1: 0.82, macroRecall: 0.9, support: 2829, source: '3.10' },
  { name: 'Random Forest', family: 'ensemble', recall: 0.78, precision: 0.93, f1: 0.85, macroRecall: 0.89, support: 2829, source: '3.11' },
  { name: 'K-Nearest Neighbors', family: 'distance', recall: 0.71, precision: 0.72, f1: 0.71, macroRecall: 0.84, support: 2815, source: '3.12' },
]

// Random Forest classification report — Table 3.11.
export const akwaRandomForest = {
  present: { precision: 0.98, recall: 0.99, f1: 0.99, support: 29020 },
  missing: { precision: 0.93, recall: 0.78, f1: 0.85, support: 2829 },
  accuracy: 0.98,
  macroRecall: 0.89,
  testSize: 31849,
}

export interface AkwaCopy {
  /** Synthetic pipeline shown on the project card (not a production architecture). */
  pipeline: { sources: string[]; steps: string[]; alt: string; envisaged: string }
  eyebrow: string
  title: string
  subtitle: string
  lead: string
  facts: { label: string; value: string }[]
  githubLabel: string
  backLabel: string
  presentationLabel: string
  nav: { id: string; label: string }[]
  challenge: { title: string; paragraphs: string[]; note: { title: string; text: string } }
  data: {
    title: string
    intro: string
    sources: { name: string; role: string; detail: string }[]
    flowAlt: string
    labeling: string
    figures: { value: string; label: string; source: string }[]
  }
  crisp: { title: string; intro: string; steps: { name: string; text: string; status: 'done' | 'discussed' }[]; done: string; discussed: string }
  prep: { title: string; steps: { name: string; text: string; source: string }[] }
  experiments: {
    title: string
    intro: string
    columns: { model: string; recall: string; precision: string; f1: string; macro: string }
    footnote: string
    unsupervisedTitle: string
    unsupervised: string
    chartAlt: string
  }
  evaluation: {
    title: string
    intro: string
    classPresent: string
    classMissing: string
    headers: { cls: string; precision: string; recall: string; f1: string; support: string }
    accuracy: string
    macroRecall: string
    testSet: string
    callout: string
    noMatrix: string
  }
  decisions: { title: string; items: { title: string; text: string; source: string }[] }
  outcomes: { title: string; measuredTitle: string; measured: string[]; limitsTitle: string; limits: string[] }
  presentation: { title: string; text: string; read: string; download: string; meta: string }
  sourcesTitle: string
  sources: string
}

const fr: AkwaCopy = {
  pipeline: {
    sources: ['Afriware', 'JD Edwards · F0911 / F03B11'],
    steps: ['Extraction & rapprochement', 'Nettoyage & sélection de variables', 'Regroupement par facture & labels', '5 modèles supervisés comparés', 'Random Forest · factures manquantes', 'Aide à la décision d’audit'],
    alt: 'Pipeline du projet : les données Afriware et JD Edwards sont rapprochées, nettoyées, regroupées par facture et étiquetées ; cinq modèles supervisés sont comparés ; le Random Forest détecte les factures manquantes ; l’usage visé est l’aide à la décision des auditeurs.',
    envisaged: 'envisagé',
  },
  eyebrow: 'DATA & MACHINE LEARNING / AKWA GROUP / 2025',
  title: 'Audit Intelligent',
  subtitle: 'Détection d’anomalies comptables',
  lead: 'Machine learning pour repérer les transactions comptables présentes dans Afriware mais absentes de JD Edwards.',
  facts: [
    { label: 'Entreprise', value: 'AKWA Group — DSI, pôle Data' },
    { label: 'Type', value: 'Stage de fin d’année' },
    { label: 'Période', value: 'Juin — septembre 2025' },
    { label: 'Domaine', value: 'Data Engineering & Machine Learning' },
    { label: 'Méthodologie', value: 'CRISP-DM' },
  ],
  githubLabel: 'Code sur GitHub',
  backLabel: 'Retour aux projets',
  presentationLabel: 'Présentation du projet',
  nav: [
    { id: 'challenge', label: 'Défi' },
    { id: 'data', label: 'Données' },
    { id: 'method', label: 'Méthode' },
    { id: 'experiments', label: 'Modèles' },
    { id: 'evaluation', label: 'Évaluation' },
    { id: 'limits', label: 'Limites' },
  ],
  challenge: {
    title: 'Le défi',
    paragraphs: [
      'Chaque facture émise dans Afriware doit se retrouver dans la comptabilité JD Edwards : dans le grand livre (F0911) et dans les comptes clients (F03B11).',
      'Certaines transactions présentes dans Afriware n’apparaissent dans aucun des deux fichiers JDE. Ces écarts compliquent le rapprochement comptable et le travail des auditeurs, qui procèdent habituellement par échantillonnage.',
      'L’objectif : identifier ces transactions manquantes de façon systématique, sur l’ensemble des données et non sur un échantillon.',
    ],
    note: {
      title: 'Écarts de rapprochement ≠ fraude',
      text: 'Le modèle signale des transactions absentes de JDE. Une absence peut venir d’un délai de transfert, d’une erreur de format ou d’une irrégularité : la qualification reste du ressort des auditeurs. Aucune fraude confirmée n’est détectée en tant que telle.',
    },
  },
  data: {
    title: 'Trois sources, une cible',
    intro: 'Transactions d’une société du groupe, du début de l’année 2025 au 14 juillet 2025.',
    sources: [
      { name: 'Afriware', role: 'Facturation', detail: 'Factures et lignes : type, client, montants HT/TTC, taxes, centre analytique, compte produit, dates.' },
      { name: 'JDE_F0911', role: 'Grand livre général', detail: 'Écritures comptables issues de l’ERP Oracle JD Edwards.' },
      { name: 'JDE_F03B11', role: 'Comptes clients', detail: 'Factures et état de règlement côté JD Edwards.' },
    ],
    flowAlt:
      'Schéma : chaque transaction Afriware est rapprochée de JDE_F0911 et de JDE_F03B11. Deux indicateurs en résultent (in_jde911, in_jde311). Une transaction absente des deux fichiers est étiquetée « Manquante » ; les autres « Présente ».',
    labeling: 'Une transaction est étiquetée « Manquante » lorsqu’elle est absente à la fois de F0911 et de F03B11. Les deux rapprochements donnent exactement le même nombre d’absences.',
    figures: [
      { value: '482 672', label: 'lignes de transactions Afriware', source: 'Tab. 3.4' },
      { value: '49 846', label: 'lignes absentes de JDE', source: 'Tab. 3.4–3.5' },
      { value: '14 069', label: 'factures manquantes après regroupement', source: '§3.3.4' },
    ],
  },
  crisp: {
    title: 'Méthodologie CRISP-DM',
    intro: 'Le projet suit les six étapes de CRISP-DM. Les cinq premières ont été réalisées ; le déploiement a été étudié sous l’angle de ses implications pour l’audit, sans mise en production.',
    steps: [
      { name: 'Business Understanding', text: 'Définir l’écart à détecter avec la DSI et le service JDE.', status: 'done' },
      { name: 'Data Understanding', text: 'Explorer les trois fichiers, leurs colonnes et la répartition des classes.', status: 'done' },
      { name: 'Data Preparation', text: 'Nettoyer, sélectionner les variables, regrouper au niveau facture, construire les labels.', status: 'done' },
      { name: 'Modeling', text: 'Entraîner et régler cinq modèles supervisés ; tester deux approches non supervisées.', status: 'done' },
      { name: 'Evaluation', text: 'Comparer les modèles sur la classe minoritaire et le rappel macro.', status: 'done' },
      { name: 'Deployment', text: 'Usage envisagé : liste des transactions à contrôler en priorité pour les auditeurs.', status: 'discussed' },
    ],
    done: 'Réalisé',
    discussed: 'Étudié, non déployé',
  },
  prep: {
    title: 'Préparation des données',
    steps: [
      { name: 'Contrôle qualité', text: 'Aucune valeur manquante détectée ; suppression des doublons.', source: 'Rapport §3.3' },
      { name: 'Sélection de variables', text: 'Matrice de corrélation : CodeClient, CompteProduit et CentreAnalyse retenus, avec NumFacture comme clé.', source: 'Tab. 3.7' },
      { name: 'Regroupement par facture', text: 'Montants HT, TTC et taxes additionnés par facture : 49 846 lignes manquantes → 14 069 factures, cohérence vérifiée.', source: '§3.3.4' },
      { name: 'Construction des labels', text: 'Indicateurs in_jde911 et in_jde311 issus du rapprochement ; cible « Manquante » si absente des deux.', source: '§3.3' },
      { name: 'Découpage train / test', text: '80 % / 20 % avec une graine aléatoire fixée ; découpage stratifié pour LR, SVM, KNN et Decision Tree.', source: '§3.4.1 + code' },
      { name: 'Mise à l’échelle', text: 'StandardScaler pour les modèles sensibles aux distances (KNN).', source: 'Code' },
    ],
  },
  experiments: {
    title: 'Cinq modèles supervisés comparés',
    intro: 'Chaque modèle a été réglé puis évalué sur un jeu de test séparé. Le critère de sélection du rapport est le rappel macro, adapté aux classes déséquilibrées.',
    columns: { model: 'Modèle', recall: 'Rappel « Manquante »', precision: 'Précision', f1: 'F1', macro: 'Rappel macro' },
    footnote:
      'Valeurs des rapports de classification (tableaux 3.8 à 3.12). LR, SVM et KNN ont été évalués sur un découpage stratifié (2 815 factures manquantes en test), Decision Tree et Random Forest sur 2 829 : les comparaisons restent indicatives.',
    unsupervisedTitle: 'Approches non supervisées',
    unsupervised:
      'Isolation Forest et un autoencodeur ont été testés. Ils se sont révélés peu pertinents ici, en raison du volume de données et du faible ratio d’anomalies ; le rapport ne leur attribue pas de métriques.',
    chartAlt: 'Graphique en barres du F1 et du rappel de la classe « Manquante » pour les cinq modèles.',
  },
  evaluation: {
    title: 'Évaluation du Random Forest',
    intro: 'Rapport de classification sur le jeu de test (tableau 3.11).',
    classPresent: 'Présente (0)',
    classMissing: 'Manquante (1)',
    headers: { cls: 'Classe', precision: 'Précision', recall: 'Rappel', f1: 'F1', support: 'Support' },
    accuracy: 'Accuracy globale',
    macroRecall: 'Rappel macro',
    testSet: 'factures dans le jeu de test',
    callout:
      'L’accuracy globale doit être interprétée avec prudence dans un problème de classes déséquilibrées. Le rappel et le F1-score de la classe des transactions manquantes sont essentiels pour évaluer l’efficacité opérationnelle du modèle : ici, 78 % des factures manquantes sont retrouvées, et 93 % des alertes sont justes.',
    noMatrix:
      'Pas de matrice de confusion publiée : les comptes disponibles dans le rapport (tableau 3.13) proviennent d’une autre exécution que ce rapport de classification.',
  },
  decisions: {
    title: 'Décisions techniques et compromis',
    items: [
      { title: 'Classification supervisée', text: 'Le rapprochement avec JDE fournit des labels fiables pour chaque transaction : le problème se pose comme une classification binaire plutôt qu’une recherche d’anomalies inconnues.', source: '§2.1, §3.3' },
      { title: 'Cinq familles d’algorithmes', text: 'Linéaire, marge, arbre, ensemble et distance : comparer des biais différents avant de choisir, plutôt que présupposer un modèle.', source: '§2.1' },
      { title: 'Rappel macro comme critère', text: 'Avec environ 9 % de factures manquantes dans le test, une accuracy élevée ne prouve rien ; le rappel macro pèse autant la classe minoritaire que la majoritaire.', source: '§3.4.2' },
      { title: 'Pondération des classes', text: 'class_weight="balanced" pour la régression logistique, le SVM et le Random Forest (200 arbres). Le KNN ne le permet pas, ce qui explique en partie sa sensibilité au déséquilibre.', source: 'Code + §3.4.3' },
      { title: 'Pourquoi Random Forest est mis en avant', text: 'Meilleur F1 (0,85) et meilleure précision (0,93) sur la classe « Manquante » : moins de fausses alertes à traiter. Le Decision Tree retrouve un peu plus de factures manquantes (rappel 0,82, rappel macro 0,90) au prix de plus de faux positifs : c’est un compromis, pas une domination.', source: 'Tab. 3.10–3.11' },
    ],
  },
  outcomes: {
    title: 'Résultats et limites',
    measuredTitle: 'Mesuré',
    measured: [
      'Random Forest : F1 de 0,85 et rappel de 0,78 sur la classe « Manquante », accuracy de 0,98 (31 849 factures en test).',
      'Les modèles à base d’arbres (Decision Tree, Random Forest) dominent les modèles linéaires et le KNN sur ce jeu de données.',
      'Les approches non supervisées testées n’ont pas été retenues.',
    ],
    limitsTitle: 'Limites',
    limits: [
      'Classes déséquilibrées : 22 % des factures manquantes du test ne sont pas détectées (faux négatifs).',
      'Une seule période (début 2025 → 14 juillet 2025) : la généralisation à d’autres périodes n’a pas été testée.',
      'Les différences de format entre Afriware et JDE peuvent créer des erreurs de correspondance.',
      'Les alertes doivent être validées par les auditeurs ; aucun déploiement industriel n’est démontré.',
    ],
  },
  presentation: {
    title: 'Présentation du projet',
    text: 'Support de soutenance : problématique, données, méthodologie CRISP-DM, modèles et résultats d’évaluation.',
    read: 'Consulter la présentation',
    download: 'Télécharger le PDF',
    meta: 'PDF · 28 diapositives',
  },
  sourcesTitle: 'Sources',
  sources: 'Rapport de stage (44 p.), présentation de soutenance et dépôt GitHub du projet. Aucune donnée financière réelle n’est reproduite sur cette page.',
}

const en: AkwaCopy = {
  pipeline: {
    sources: ['Afriware', 'JD Edwards · F0911 / F03B11'],
    steps: ['Extraction & reconciliation', 'Cleaning & feature selection', 'Invoice-level grouping & labels', '5 supervised models compared', 'Random Forest · missing invoices', 'Audit decision support'],
    alt: 'Project pipeline: Afriware and JD Edwards data are reconciled, cleaned, grouped per invoice and labeled; five supervised models are compared; Random Forest detects missing invoices; the intended use is decision support for auditors.',
    envisaged: 'envisaged',
  },
  eyebrow: 'DATA & MACHINE LEARNING / AKWA GROUP / 2025',
  title: 'Intelligent Audit',
  subtitle: 'Accounting Anomaly Detection',
  lead: 'Machine learning for detecting accounting transactions missing between Afriware and JD Edwards.',
  facts: [
    { label: 'Company', value: 'AKWA Group — IT department, Data team' },
    { label: 'Type', value: 'Year-end internship' },
    { label: 'Period', value: 'June — September 2025' },
    { label: 'Domain', value: 'Data Engineering & Machine Learning' },
    { label: 'Methodology', value: 'CRISP-DM' },
  ],
  githubLabel: 'Code on GitHub',
  backLabel: 'Back to projects',
  presentationLabel: 'Project presentation',
  nav: [
    { id: 'challenge', label: 'Challenge' },
    { id: 'data', label: 'Data' },
    { id: 'method', label: 'Method' },
    { id: 'experiments', label: 'Models' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'limits', label: 'Limits' },
  ],
  challenge: {
    title: 'The challenge',
    paragraphs: [
      'Every invoice issued in Afriware should appear in the JD Edwards accounting: in the general ledger (F0911) and in accounts receivable (F03B11).',
      'Some transactions present in Afriware appear in neither JDE file. These gaps complicate reconciliation and the auditors’ work, which usually relies on sampling.',
      'The goal: identify those missing transactions systematically, across all the data rather than a sample.',
    ],
    note: {
      title: 'Reconciliation gaps ≠ fraud',
      text: 'The model flags transactions missing from JDE. A gap can come from a transfer delay, a format error or an irregularity: qualifying it remains the auditors’ job. No confirmed fraud is detected as such.',
    },
  },
  data: {
    title: 'Three sources, one target',
    intro: 'Transactions of one group company, from early 2025 to 14 July 2025.',
    sources: [
      { name: 'Afriware', role: 'Invoicing', detail: 'Invoices and lines: type, customer, net/gross amounts, taxes, cost center, product account, dates.' },
      { name: 'JDE_F0911', role: 'General ledger', detail: 'Accounting entries from the Oracle JD Edwards ERP.' },
      { name: 'JDE_F03B11', role: 'Accounts receivable', detail: 'Invoices and payment status on the JD Edwards side.' },
    ],
    flowAlt:
      'Diagram: each Afriware transaction is matched against JDE_F0911 and JDE_F03B11, producing two flags (in_jde911, in_jde311). A transaction missing from both files is labeled “Missing”; the others “Present”.',
    labeling: 'A transaction is labeled “Missing” when it is absent from both F0911 and F03B11. Both reconciliations produce exactly the same number of gaps.',
    figures: [
      { value: '482,672', label: 'Afriware transaction lines', source: 'Tab. 3.4' },
      { value: '49,846', label: 'lines missing from JDE', source: 'Tab. 3.4–3.5' },
      { value: '14,069', label: 'missing invoices after grouping', source: '§3.3.4' },
    ],
  },
  crisp: {
    title: 'CRISP-DM methodology',
    intro: 'The project follows the six CRISP-DM stages. The first five were carried out; deployment was studied in terms of its implications for audit, without going to production.',
    steps: [
      { name: 'Business Understanding', text: 'Define the gap to detect with the IT department and the JDE team.', status: 'done' },
      { name: 'Data Understanding', text: 'Explore the three files, their columns and the class distribution.', status: 'done' },
      { name: 'Data Preparation', text: 'Clean, select variables, group at invoice level, build the labels.', status: 'done' },
      { name: 'Modeling', text: 'Train and tune five supervised models; test two unsupervised approaches.', status: 'done' },
      { name: 'Evaluation', text: 'Compare models on the minority class and macro recall.', status: 'done' },
      { name: 'Deployment', text: 'Intended use: a list of transactions for auditors to check first.', status: 'discussed' },
    ],
    done: 'Done',
    discussed: 'Studied, not deployed',
  },
  prep: {
    title: 'Data preparation',
    steps: [
      { name: 'Quality checks', text: 'No missing values found; duplicates removed.', source: 'Report §3.3' },
      { name: 'Feature selection', text: 'Correlation matrix: CodeClient, CompteProduit and CentreAnalyse kept, with NumFacture as the key.', source: 'Tab. 3.7' },
      { name: 'Invoice-level grouping', text: 'Net, gross and tax amounts summed per invoice: 49,846 missing lines → 14,069 invoices, consistency verified.', source: '§3.3.4' },
      { name: 'Label construction', text: 'in_jde911 and in_jde311 flags from the reconciliation; target “Missing” when absent from both.', source: '§3.3' },
      { name: 'Train / test split', text: '80% / 20% with a fixed random seed; stratified split for LR, SVM, KNN and Decision Tree.', source: '§3.4.1 + code' },
      { name: 'Scaling', text: 'StandardScaler for distance-sensitive models (KNN).', source: 'Code' },
    ],
  },
  experiments: {
    title: 'Five supervised models compared',
    intro: 'Each model was tuned and evaluated on a held-out test set. The report’s selection criterion is macro recall, suited to imbalanced classes.',
    columns: { model: 'Model', recall: '“Missing” recall', precision: 'Precision', f1: 'F1', macro: 'Macro recall' },
    footnote:
      'Values from the classification reports (Tables 3.8 to 3.12). LR, SVM and KNN were evaluated on a stratified split (2,815 missing invoices in test), Decision Tree and Random Forest on 2,829: comparisons are indicative.',
    unsupervisedTitle: 'Unsupervised approaches',
    unsupervised:
      'Isolation Forest and an autoencoder were tested. They proved of little relevance here, given the data volume and the low anomaly ratio; the report does not assign them metrics.',
    chartAlt: 'Bar chart of F1 and recall on the “Missing” class for the five models.',
  },
  evaluation: {
    title: 'Random Forest evaluation',
    intro: 'Classification report on the test set (Table 3.11).',
    classPresent: 'Present (0)',
    classMissing: 'Missing (1)',
    headers: { cls: 'Class', precision: 'Precision', recall: 'Recall', f1: 'F1', support: 'Support' },
    accuracy: 'Overall accuracy',
    macroRecall: 'Macro recall',
    testSet: 'invoices in the test set',
    callout:
      'Overall accuracy must be read with care in an imbalanced problem. Recall and F1 on the missing-transaction class are what measure the model’s operational value: here 78% of missing invoices are found, and 93% of alerts are correct.',
    noMatrix:
      'No confusion matrix is published: the counts available in the report (Table 3.13) come from a different run than this classification report.',
  },
  decisions: {
    title: 'Technical decisions & trade-offs',
    items: [
      { title: 'Supervised classification', text: 'Reconciliation with JDE provides reliable labels for every transaction, so the task is framed as binary classification rather than a search for unknown anomalies.', source: '§2.1, §3.3' },
      { title: 'Five algorithm families', text: 'Linear, margin, tree, ensemble and distance-based: compare different biases before choosing, instead of assuming a model.', source: '§2.1' },
      { title: 'Macro recall as the criterion', text: 'With about 9% missing invoices in the test set, high accuracy proves nothing; macro recall weighs the minority class as much as the majority one.', source: '§3.4.2' },
      { title: 'Class weighting', text: 'class_weight="balanced" for logistic regression, SVM and Random Forest (200 trees). KNN does not support it, which partly explains its sensitivity to imbalance.', source: 'Code + §3.4.3' },
      { title: 'Why Random Forest is highlighted', text: 'Best F1 (0.85) and best precision (0.93) on the “Missing” class: fewer false alerts to process. Decision Tree finds slightly more missing invoices (recall 0.82, macro recall 0.90) at the cost of more false positives — a trade-off, not a clean win.', source: 'Tab. 3.10–3.11' },
    ],
  },
  outcomes: {
    title: 'Results & limitations',
    measuredTitle: 'Measured',
    measured: [
      'Random Forest: F1 of 0.85 and recall of 0.78 on the “Missing” class, accuracy of 0.98 (31,849 invoices in test).',
      'Tree-based models (Decision Tree, Random Forest) outperform linear models and KNN on this dataset.',
      'The unsupervised approaches tested were not retained.',
    ],
    limitsTitle: 'Limitations',
    limits: [
      'Imbalanced classes: 22% of the missing invoices in the test set are not detected (false negatives).',
      'A single period (early 2025 → 14 July 2025): generalization to other periods was not tested.',
      'Format differences between Afriware and JDE can cause matching errors.',
      'Alerts must be validated by auditors; no industrial deployment is demonstrated.',
    ],
  },
  presentation: {
    title: 'Project presentation',
    text: 'Defense slides: problem, data, CRISP-DM methodology, models and evaluation results.',
    read: 'View the presentation',
    download: 'Download PDF',
    meta: 'PDF · 28 slides',
  },
  sourcesTitle: 'Sources',
  sources: 'Internship report (44 p.), defense presentation and the project’s GitHub repository. No real financial data is reproduced on this page.',
}

export const akwaCaseStudy: Record<Language, AkwaCopy> = { fr, en }

// Published presentation (anonymized copy). Stays null until the owner approves
// publication — the section and its buttons are not rendered while it is null.
export const akwaPresentation: { href: string; cover: string } | null = null
