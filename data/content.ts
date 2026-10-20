import { profileCVs } from './cvs'
import { dentalPresentation, type ProjectPresentation } from './presentations'
import type { Language } from '../contexts/LanguageContext'
import type { ProfileId } from '../contexts/ProfileContext'

// Language-independent project facts (links, media, stack) — defined once in `projectMeta`.
export interface ProjectMeta {
  technologies: string[]
  github?: string
  demo?: string
  presentation?: ProjectPresentation
  image?: string
  /** Company logo, shown contained when there is no screenshot. */
  logo?: string
  /** In-page anchor with the full story, for work without a public repository. */
  detailsHref?: string
  year: string
  /** URL segment of the case study page (/projects/<slug>/) — featured projects only. */
  slug?: string
  /** Links a case study to its internship: contributions are read from that experience entry. */
  company?: string
  /** Built-in diagram shown instead of a screenshot (see components/AkwaPipeline). */
  diagram?: 'akwa'
}

export interface ProjectResult {
  value: string
  label: string
}

// Translated project copy. `summary`, `role` and `metric` feed the featured cards.
export interface ProjectText {
  title: string
  /** Optional split title for the featured card (short name + subtitle). */
  shortTitle?: string
  subtitle?: string
  /** One sentence on the business value, shown on the featured card. */
  businessValue?: string
  description: string
  summary?: string
  role?: string
  metric?: string
  category: string
  status: string
  // Case study fields — every one is optional and only rendered when documented.
  /** One-sentence problem statement. */
  problem?: string
  /** Verified figures only (taken from the site or the CVs). */
  results?: ProjectResult[]
  /** Not documented yet — kept in the model so they can be filled without code changes. */
  decisions?: string[]
  limitations?: string[]
}

export type Project = ProjectMeta & ProjectText & { id: string }

export interface ExperienceEntry {
  title: string
  company: string
  type: string
  period: string
  location: string
  description: string[]
  logo?: string
}

export interface EducationEntry {
  degree: string
  school: string
  period: string
  location: string
  details: string
  /** `zoom` enlarges a logo that sits in the middle of a photo. */
  logo?: { src: string; width: number; height: number; zoom?: number }
}

export interface SkillGroup {
  heading: string
  items: string[]
}

export interface LanguageItem {
  name: string
  level: string
}

export interface ProfileContent {
  navLabel: string
  title: string
  pickerDescription: string
  summary: string
  keywords: string[]
  bioQuote: string
  experience: ExperienceEntry[]
  skills: SkillGroup[]
  /** The three projects shown first for this profile, in order. */
  featuredIds: [string, string, string]
  /** Order of the remaining projects in "view all" and in the CV section. */
  projectIds: string[]
  cvFiles: Record<Language, string>
}

export interface SiteContent {
  nav: {
    profiles: string
    projects: string
    cv: string
    contact: string
    profileMenu: {
      label: string
      heading: string
      compareLabel: string
    }
  }
  hero: {
    eyebrow: string
    role: string
    description: string
    seeking: string
    location: string
    credibility: string
    ctaProjects: string
    ctaCV: string
    ctaContact: string
    selectorLabel: string
    selectorTitle: string
    videoPause: string
    videoPlay: string
  }
  profilePicker: {
    eyebrow: string
    heading: [string, string]
    description: string
    enterLabel: string
  }
  bio: {
    eyebrow: string
    tag: string
    stats: { value: string; label: string }[]
    location: string
    secondLocation: string
  }
  skillsHeading: string
  experienceHeading: string
  sections: {
    experienceEyebrow: string
    experienceIntro: string
    skillsEyebrow: string
    skillsIntro: string
    cvEyebrow: string
  }
  profileUpdates: string
  caseStudy: {
    readLabel: string
    backLabel: string
    contextLabel: string
    problemLabel: string
    roleLabel: string
    overviewLabel: string
    contributionsLabel: string
    resultsLabel: string
    stackLabel: string
    decisionsLabel: string
    limitationsLabel: string
    linksLabel: string
    experienceLink: string
    confidentialNote: string
  }
  projectsSection: {
    eyebrow: string
    heading: [string, string]
    description: string
    viewAllLabel: string
    viewLessLabel: string
    allHeading: string
    codeLabel: string
    demoLabel: string
    detailsLabel: string
    noLinkLabel: string
  }
  cv: {
    heading: string
    description: string
    downloadLabel: string
    contactHeading: string
    languagesHeading: string
    educationHeading: string
    softSkillsHeading: string
  }
  education: EducationEntry[]
  languages: LanguageItem[]
  softSkills: { title: string; description: string }[]
  contact: {
    eyebrow: string
    heading: [string, string]
    description: string
    availability: string
    form: {
      name: string
      email: string
      message: string
      submit: string
      sending: string
      success: string
      error: string
    }
  }
  footer: string
  profiles: Record<ProfileId, ProfileContent>
  projects: Record<string, Project>
}


const contactInfo = {
  email: 'jadfalaq@gmail.com',
  phones: [] as string[],
  github: 'github.com/JadFalaq',
  githubUrl: 'https://github.com/JadFalaq',
  linkedin: 'linkedin.com/in/jadfalaq',
  linkedinUrl: 'https://www.linkedin.com/in/jadfalaq',
}

const schoolLogos = {
  ensias: { src: '/ensias_logo_square.jpg', width: 512, height: 512 },
  cpge: { src: '/cpge_mohamed_v_casablanca_logo.jpeg', width: 200, height: 200 },
}

// Internship periods, defined once so every profile shows the same dates.
// NB: the CV PDFs say Jun.–Aug. 2026 for Renault Digital; the site keeps the
// Jun.–Sep. 2026 dates set in the last update until the right one is confirmed.
const periods = {
  renault: { fr: 'Juin 2026 — Septembre 2026', en: 'Jun. 2026 — Sep. 2026' },
  akwa: { fr: 'Juin 2025 — Septembre 2025', en: 'Jun. 2025 — Sep. 2025' },
}

// ---------------------------------------------------------------------------
// Shared project library (keyed by id). Each profile references a curated
// subset via `projectIds`; the full set is reachable through "view all".
// ---------------------------------------------------------------------------

const projectMeta: Record<string, ProjectMeta> = {
  cvmatcher: {
    slug: 'cvmatch',
    technologies: ['LangGraph', 'Hybrid RAG (BM25 + embeddings)', 'Azure OpenAI', 'Pydantic', 'FastAPI', 'Next.js', 'Docker', 'pytest'],
    github: 'https://github.com/JadFalaq/cv-matcher',
    demo: 'https://cv-offer-matcher.vercel.app/',
    image: '/cv_matcher_card.png',
    year: '2026',
  },
  ragchatbot: {
    slug: 'rag-strategies',
    technologies: ['LangChain', 'Azure OpenAI', 'ChromaDB', 'Unstructured', 'Pydantic', 'MMR', 'Multi-Query', 'RRF'],
    github: 'https://github.com/JadFalaq/Comparing-RAG-Strategies-Chunking-Retrieval-Ranking',
    image: '/rag_card.png',
    year: '2026',
  },
  bookpipeline: {
    slug: 'airflow-book-pipeline',
    technologies: ['Apache Airflow', 'Celery', 'Redis', 'PostgreSQL', 'Docker Compose', 'Flask', 'Hugging Face Transformers', 'FLAN-T5', 'NLLB-200', 'Coqui TTS'],
    github: 'https://github.com/JadFalaq/Pipeline-d-Ingestion-Automatis-de-Livres',
    year: '2025',
  },
  dental: {
    slug: 'snani-dental-mlops',
    technologies: ['YOLOv8 (Ultralytics)', 'DVC', 'MLflow', 'FastAPI', 'Docker', 'GitHub Actions', 'Azure Container Apps', 'React (Vite)', 'pytest'],
    github: 'https://github.com/JadFalaq/detection_dentaire_mlops',
    demo: 'https://snani.vercel.app/',
    image: '/Dantal pathologie.png',
    presentation: dentalPresentation,
    year: '2025',
  },
  pointfed: {
    slug: 'pointfed-federated-3d',
    technologies: ['PyTorch', 'PyTorch Geometric', 'FeaStNet (GNN)', 'FedAvg', 'Vertical FL', 'Knowledge Distillation'],
    github: 'https://github.com/JadFalaq/Federated-PointCloud-3D',
    image: '/3d_point.jpeg',
    year: '2026',
  },
  misinformation: {
    slug: 'arabert-medical-misinformation',
    technologies: ['AraBERT', 'Hugging Face Transformers', 'PyTorch', 'Accelerate', 'scikit-learn', 'TF-IDF (baseline)'],
    github: 'https://github.com/JadFalaq/misinformation_covid_detector_arabic',
    image: '/miss_info_detection.png',
    year: '2026',
  },
  shoplifting: {
    slug: 'amnai-shoplifting-detection',
    technologies: ['YOLO (Ultralytics)', 'DeepSORT', 'MediaPipe Pose', 'PyTorch', 'LSTM + attention', 'OpenCV'],
    github: 'https://github.com/JadFalaq/AmnAI_Vlast',
    image: '/AmnAI.png',
    year: '2025',
  },
  deeplearning: {
    slug: 'deep-learning-perceptrons-to-distillation',
    technologies: ['PyTorch', 'TensorFlow / Keras', 'YOLOv8', 'scikit-learn', 'NumPy', 'OpenCV'],
    github: 'https://github.com/JadFalaq/Deep-Learning-From-Perceptrons-to-Model-Distillation',
    image: '/distillation.png',
    year: '2026',
  },
  segmentation: {
    slug: 'unet-semantic-segmentation',
    technologies: ['PyTorch', 'U-Net', 'Self-distillation', 'NumPy', 'Pillow', 'Matplotlib'],
    github: 'https://github.com/JadFalaq/Segmentation_Image',
    image: '/segmentation_card.png',
    year: '2026',
  },
  ccsvm: {
    slug: 'chance-constrained-svm',
    technologies: ['CVXPY', 'scikit-learn', 'NumPy', 'Pandas', 'Matplotlib'],
    github: 'https://github.com/JadFalaq/Chance-Constrained-Support-Vector-Machines',
    image: '/svm.png',
    year: '2026',
  },
  audit: {
    slug: 'akwa-audit-intelligent',
    company: 'AKWA Group',
    // Card shows the first four; all confirmed in the repository (PostgreSQL is not used in the code).
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'Random Forest', 'Isolation Forest', 'Autoencoder (TensorFlow/Keras)', 'Docker'],
    github: 'https://github.com/JadFalaq/Audit-Intelligent',
    diagram: 'akwa',
    year: '2025',
  },
  speaker: {
    slug: 'speaker-recognition-radio',
    technologies: ['librosa', 'SciPy', 'scikit-learn (SVM)', 'MFCC', 'Plotly', 'Streamlit'],
    github: 'https://github.com/JadFalaq/Detection_de_locuteur_dans_les_stations_radio',
    image: '/detection de locateur.png',
    year: '2025',
  },
  motoscraper: {
    slug: 'motorcycle-import-scraper',
    technologies: ['Python', 'Selenium', 'Pandas', 'NumPy', 'Matplotlib'],
    github: 'https://github.com/JadFalaq/Profitable_Motorcycle_Import_Scraper',
    image: '/motorcycle profit.png',
    year: '2024',
  },
  renault: {
    slug: 'renault-digital-genai-qa',
    company: 'Renault Digital',
    technologies: ['Microsoft Copilot API', 'pgvector', 'unstructured.io', 'Pydantic', 'FastAPI'],
    logo: '/rdm logo.jpg',
    detailsHref: '#experience',
    year: '2026',
  },
  irrigation: {
    slug: 'smart-irrigation-system',
    technologies: ['Flutter', 'Dart', 'Firebase (Auth, Realtime DB)', 'ESP32', 'Arduino Mega', 'PlatformIO', 'C++'],
    github: 'https://github.com/JadFalaq/Smart_Irrigation_System',
    image: '/Samrt farm.png',
    year: '2025',
  },
}

const projectsFr: Record<string, ProjectText> = {
  cvmatcher: {
    title: 'cvmatch — Adapter son CV à une offre, compétence par compétence',
    description: "Outil agentique LangGraph qui confronte un CV à une offre : pour chaque compétence demandée, il retrouve la preuve dans le CV (RAG hybride BM25 + embeddings, fusion RRF), la classe (visible, cachée, implicite, absente), calcule un score et propose des reformulations sans jamais inventer d'expérience. Principe « le LLM propose, le code vérifie » : citations contrôlées mot pour mot, score calculé en code, validation humaine (interrupt). API FastAPI en streaming (SSE), site Next.js, 125 tests pytest, CI GitHub Actions et image Docker pour Azure Container Apps.",
    problem: "Adapter un CV à une offre sans jamais inventer d'expérience : chaque compétence demandée doit s'appuyer sur une preuve dans le CV.",
    results: [{ value: "125", label: "tests pytest" }, { value: "CI", label: "GitHub Actions, image Docker" }],
    summary: "Agent LangGraph qui confronte un CV à une offre compétence par compétence : RAG hybride (BM25 + embeddings, RRF), citations vérifiées mot pour mot, score calculé en code et validation humaine — sans jamais inventer d'expérience.",
    metric: "125 tests pytest · CI GitHub Actions",
    category: 'IA Agentique & RAG',
    status: 'Démo en ligne',
  },
  ragchatbot: {
    title: 'Stratégies RAG : chunking, retrieval et ranking',
    description: "Implémentation pas à pas d'un pipeline RAG sur Azure OpenAI et ChromaDB, en comparant les stratégies à chaque étape : découpage (par caractères, sémantique, agentique par LLM), recherche (similarité, seuil de score, MMR, multi-query) et fusion des classements (Reciprocal Rank Fusion). Inclut une génération conversationnelle tenant compte de l'historique et un RAG multimodal (Unstructured, descriptions de tableaux et d'images par le LLM).",
    problem: "Comparer, étape par étape, les stratégies de chunking, de retrieval et de classement d'un pipeline RAG.",
    summary: "Pipeline RAG sur Azure OpenAI et ChromaDB qui compare les stratégies à chaque étape : chunking (caractères, sémantique, agentique), retrieval (seuil de score, MMR, multi-query) et fusion des classements (RRF), plus un RAG multimodal.",
    category: 'IA Générative & RAG',
    status: 'Projet académique',
  },
  bookpipeline: {
    title: "Pipeline automatisé d'ingestion et de traitement de livres",
    description: 'Pipeline orchestré par Apache Airflow (CeleryExecutor, Redis, PostgreSQL, Docker Compose) qui découvre et analyse des livres PDF/EPUB, puis appelle un service ML Flask : résumés à plusieurs niveaux et plus de 20 questions-réponses par livre (FLAN-T5), traduction en français et en arabe (NLLB-200) et synthèse vocale (Coqui TTS, gTTS). Le dynamic task mapping crée une branche par livre pour l’analyse, les résumés et les questions-réponses.',
    problem: "Transformer automatiquement des livres PDF/EPUB en résumés, questions-réponses, traductions et audio.",
    results: [{ value: "≥ 20", label: "paires Q&A par livre (garanti par le service)" }],
    summary: "Pipeline Apache Airflow (CeleryExecutor, Redis, PostgreSQL, Docker Compose) qui découvre et analyse des livres PDF/EPUB, analyse chaque livre dans sa propre branche (dynamic task mapping) et appelle un service ML : résumés, questions-réponses, traduction et synthèse vocale.",
    category: 'Data Engineering & GenAI',
    status: 'Projet académique',
  },
  dental: {
    title: 'Snani — Comprendre sa radio dentaire',
    shortTitle: 'Snani',
    subtitle: 'Détection dentaire & MLOps',
    role: 'Projet académique · Computer Vision, MLOps & expérience utilisateur',
    description: "Une application en français et en arabe qui aide les personnes non techniques à comprendre leur radio panoramique : zones repérées sur l’image, explications simples et image annotée à partager avec leur dentiste. En coulisses : YOLOv8s, données versionnées avec DVC, expériences MLflow, API FastAPI conteneurisée et CI/CD vers Azure Container Apps et Vercel.",
    problem: "Transformer un détecteur de signes dentaires en un service reproductible et une interface compréhensible sans connaissances médicales ou techniques.",
    businessValue: "De la radio aux explications : Snani rend les résultats lisibles et partageables pour préparer l’échange avec un dentiste.",
    results: [{ value: '0,422', label: 'mAP50 sur test · modèle Champion' }, { value: '86 %', label: 'précision sur test' }, { value: '46,7 %', label: 'rappel sur test' }],
    summary: "Un pipeline MLOps de bout en bout et une application accessible : 1 808 radiographies, 7 familles de signes, YOLOv8s, DVC, MLflow, FastAPI, Docker et Snani en français/arabe.",
    metric: 'mAP50 0,422 · précision 0,860 · rappel 0,467 (test)',
    category: 'Computer Vision & MLOps',
    status: 'Démo publique · projet académique',
  },
  pointfed: {
    title: 'PointFed3D — Apprentissage fédéré sur nuages de points 3D',
    description: "Classification de nuages de points 3D (ShapeNet via CAP3D, 50 classes) avec le réseau de graphes FeaStNet, en implémentant cinq stratégies : entraînement centralisé, FedAvg codé à la main sur 4 clients en IID et non-IID, fédération verticale (géométrie et couleur détenues par deux entités, sans partage de données brutes) et distillation vers un élève réduit. Les résultats à pleine échelle restent à mesurer.",
    category: 'Federated Learning & 3D',
    status: 'Projet académique',
  },
  misinformation: {
    title: 'Détection de désinformation médicale en arabe',
    description: "Fine-tuning d'AraBERT (bert-base-arabertv02) sur ArCOV19-Rumors pour détecter la désinformation médicale dans des tweets arabes : normalisation du texte arabe, déduplication (617 doublons retirés), seuil de décision optimisé et analyse d'erreurs — 0,869 d'accuracy et de F1 macro sur 297 tweets de test. Une baseline TF-IDF fait aussi bien sur ce jeu de données.",
    problem: "Détecter la désinformation médicale dans des tweets arabes (corpus ArCOV19-Rumors).",
    results: [{ value: "0,869", label: "accuracy (297 tweets de test)" }, { value: "0,869", label: "F1 macro, même test" }],
    summary: "Fine-tuning d'AraBERT sur ArCOV19-Rumors : normalisation, déduplication, seuil de décision optimisé et analyse d'erreurs, comparé honnêtement à une baseline TF-IDF.",
    metric: "0,869 d'accuracy · F1 macro 0,869 (297 tweets)",
    category: 'NLP & Fine-tuning',
    status: 'Projet personnel',
  },
  shoplifting: {
    title: "AmnAI — Détection de vol à l'étalage",
    description: 'Système de détection en temps réel de comportements suspects sur vidéos de surveillance. Pipeline YOLO (détection de personnes), DeepSORT (suivi), MediaPipe Pose (landmarks) et extraction de features comportementales (vitesse, main vers poche ou sac, posture), classées par un LSTM bidirectionnel avec attention ou par un mode heuristique, avec alertes en surimpression.',
    category: 'Computer Vision',
    status: 'Projet personnel',
  },
  deeplearning: {
    title: 'Deep Learning : du perceptron à la distillation',
    description: "Cinq projets progressifs : MLP sur données cliniques (84,8 % d'accuracy sur la maladie cardiaque) et détection de fraude bancaire (ROC-AUC 0,90), convolutions 1D/2D/3D codées à la main en NumPy sur signaux biomédicaux, triage de radiographies (CNN et VGG16 à 93 %, YOLOv8n 24× plus rapide que Faster R-CNN) et distillation de connaissances (KD, Attention Transfer, FitNets, RKD) vers un modèle de 7 539 paramètres.",
    category: 'Deep Learning',
    status: 'Projet académique',
  },
  segmentation: {
    title: 'Segmentation sémantique avec U-Net',
    description: "Segmentation sémantique de scènes urbaines sur Cityscapes : exploration du dataset, U-Net de référence en PyTorch (chargement des données, transformations conjointes image/masque, métriques mIoU et pixel accuracy à partir de la matrice de confusion) et expérimentation d'une variante entraînée par auto-distillation.",
    category: 'Computer Vision',
    status: 'Projet académique',
  },
  ccsvm: {
    title: 'SVM à contraintes probabilistes',
    description: 'Étude des SVM sous incertitude : formulations primale (SOCP) et duale, version moindres carrés, optimisation bilevel et trilevel des hyperparamètres (C, a, p) et analyse de la généralisation (dimension VC, complexité de Rademacher, biais-variance). Appliqué à la classification binaire, multiclasse (One-vs-Rest, One-vs-One) et à la régression SVR probabiliste sur Breast Cancer, Seeds et Diabetes.',
    category: 'Machine Learning & Optimisation',
    status: 'Projet académique',
  },
  audit: {
    title: "Audit Intelligent — Détection d'anomalies comptables",
    shortTitle: "Audit Intelligent",
    subtitle: "Détection d'anomalies comptables",
    description: "Pipeline de machine learning conçu pendant mon stage chez AKWA Group, selon CRISP-DM, pour détecter les transactions présentes dans Afriware mais absentes de JD Edwards (F0911 et F03B11). Rapprochement de trois sources, regroupement au niveau facture, comparaison de cinq modèles supervisés (régression logistique, SVM, arbre de décision, Random Forest, KNN) ; Isolation Forest et autoencodeur testés puis écartés. Random Forest : F1 de 0,85 et rappel de 0,78 sur la classe des factures manquantes, accuracy de 0,98.",
    problem: "Détection de transactions présentes dans Afriware mais absentes des systèmes comptables JD Edwards, au moyen d'un pipeline de préparation et d'évaluation de modèles de machine learning.",
    businessValue: "Objectif métier : aider les auditeurs à repérer les écarts de rapprochement entre systèmes comptables, sur l'ensemble des données plutôt que sur un échantillon.",
    results: [{ value: "98 %", label: "accuracy globale" }, { value: "85 %", label: "F1-score, classe « Manquante »" }, { value: "78 %", label: "rappel, classe « Manquante »" }],
    role: "AKWA Group · Stage ML & Data Engineering",
    metric: "F1 0,85 · rappel 0,78 (classe « Manquante »)",
    category: 'Data & Machine Learning',
    status: 'Stage — AKWA Group',
  },
  speaker: {
    title: 'Reconnaissance de locuteur sur canal radio dégradé',
    description: "Identification de locuteur robuste pour des communications radio de police : simulation d'un canal P25 (filtrage passe-bande, bruit contrôlé par SNR, compression dynamique) sur des voix VoxCeleb, augmentation par SNR, extraction de features MFCC, deltas et spectrales, classification SVM (noyau RBF, grid search) — 86,98 % d'accuracy sur 50 agents — et interface Streamlit d'identification en temps réel.",
    category: 'Signal Processing & ML',
    status: 'Projet personnel',
  },
  motoscraper: {
    title: 'Web Scraping & Analyse — Import de motos rentables',
    description: "Outil Python qui scrape les annonces de motos d'occasion en Europe (LeParking) et au Maroc (Avito) avec Selenium, interroge le portail web de la douane marocaine (automatisé avec Selenium) pour obtenir la valeur taxable, calcule la marge d'importation de chaque annonce et visualise la distribution des marges par modèle en chandeliers.",
    category: 'Data Engineering',
    status: 'Projet personnel',
  },
  irrigation: {
    title: "Système d'irrigation intelligent",
    description: "Application mobile Flutter de pilotage d'irrigation multi-zones en temps réel, reliée à un ESP32 et un Arduino Mega via Firebase Realtime Database : commandes sécurisées (une seule zone active, machine à états côté Arduino), plannings d'arrosage, historique et statistiques de consommation d'eau, authentification Firebase et Google Sign-In.",
    category: 'IoT & Mobile',
    status: 'Projet personnel',
  },
  renault: {
    title: "Renault Digital — Agents LLM & RAG pour la QA",
    description: "Chaîne d'ingestion de plus de 400 PDF (OCR des tableaux et images, découpage par structure, retrieval MMR sur pgvector) alimentant un RAG, et système multi-agents LLM (Requirement Analyzer, Test Design) qui transforme des exigences en tickets Jira et scénarios Gherkin, validés par un humain à chaque étape.",
    problem: "Rédiger les tickets Jira et les scénarios Gherkin à partir des exigences prenait 10 à 20 minutes par exigence à l'équipe QA.",
    results: [{ value: "85 %", label: "des générations acceptées sans modification" }, { value: "10–20 → 1–2 min", label: "de rédaction par exigence" }, { value: "400+", label: "PDF ingérés dans le RAG" }],
    category: "Stage — Renault Digital",
    status: "Mis en production en interne",
    role: "Stagiaire Ingénieur IA — Quality Engineering",
    metric: "85 % des générations acceptées sans modification",
  },
}

const projectsEn: Record<string, ProjectText> = {
  cvmatcher: {
    title: 'cvmatch — Tailoring a CV to a Job Offer, Skill by Skill',
    description: 'Agentic LangGraph tool that checks a CV against a job offer: for every required skill it retrieves the evidence in the CV (hybrid BM25 + embeddings RAG, RRF fusion), classifies it (visible, hidden, implicit, absent), computes a score and suggests rewrites without ever inventing experience. Built on “the LLM proposes, the code verifies”: citations checked word for word, score computed in code, human validation (interrupt). Streaming FastAPI API (SSE), Next.js front end, 125 pytest tests, GitHub Actions CI and a Docker image for Azure Container Apps.',
    problem: "Tailor a CV to a job offer without ever inventing experience: every required skill must be backed by evidence in the CV.",
    results: [{ value: "125", label: "pytest tests" }, { value: "CI", label: "GitHub Actions, Docker image" }],
    summary: "LangGraph agent that checks a CV against a job offer skill by skill: hybrid RAG (BM25 + embeddings, RRF), citations verified word for word, score computed in code and human validation — never inventing experience.",
    metric: "125 pytest tests · GitHub Actions CI",
    category: 'Agentic AI & RAG',
    status: 'Live demo',
  },
  ragchatbot: {
    title: 'RAG Strategies: Chunking, Retrieval & Ranking',
    description: 'Step-by-step implementation of a RAG pipeline on Azure OpenAI and ChromaDB, comparing strategies at every stage: chunking (character-based, semantic, LLM-driven agentic), retrieval (similarity, score threshold, MMR, multi-query) and rank fusion (Reciprocal Rank Fusion). Includes history-aware conversational generation and multimodal RAG (Unstructured, LLM descriptions of tables and images).',
    problem: "Compare, stage by stage, the chunking, retrieval and ranking strategies of a RAG pipeline.",
    summary: "RAG pipeline on Azure OpenAI and ChromaDB comparing strategies at every stage: chunking (character, semantic, agentic), retrieval (score threshold, MMR, multi-query) and rank fusion (RRF), plus multimodal RAG.",
    category: 'Generative AI & RAG',
    status: 'Academic project',
  },
  bookpipeline: {
    title: 'Automated Book Ingestion & Processing Pipeline',
    description: 'Apache Airflow pipeline (CeleryExecutor, Redis, PostgreSQL, Docker Compose) that discovers and parses PDF/EPUB books, then calls a Flask ML service: multi-level summaries and 20+ question-answer pairs per book (FLAN-T5), French and Arabic translation (NLLB-200) and text-to-speech (Coqui TTS, gTTS). Dynamic task mapping creates one branch per book for parsing, summaries and Q&A.',
    problem: "Automatically turn PDF/EPUB books into summaries, Q&A, translations and audio.",
    results: [{ value: "≥ 20", label: "Q&A pairs per book (enforced by the service)" }],
    summary: "Apache Airflow pipeline (CeleryExecutor, Redis, PostgreSQL, Docker Compose) that discovers and parses PDF/EPUB books, handles each book in its own branch (dynamic task mapping) and calls an ML service: summaries, Q&A, translation and text-to-speech.",
    category: 'Data Engineering & GenAI',
    status: 'Academic project',
  },
  dental: {
    title: 'Snani — Understanding your dental X-ray',
    shortTitle: 'Snani',
    subtitle: 'Dental detection & MLOps',
    role: 'Academic project · Computer Vision, MLOps & user experience',
    description: 'A French and Arabic application that helps non-technical users understand panoramic dental X-rays: highlighted findings, plain-language explanations and an annotated image to share with a dentist. Behind it: YOLOv8s, DVC-versioned data, MLflow experiments, a containerised FastAPI API and CI/CD to Azure Container Apps and Vercel.',
    problem: 'Turn a dental finding detector into a reproducible service and an interface that requires no medical or technical knowledge.',
    businessValue: 'From X-rays to explanations: Snani makes results understandable and shareable to support a conversation with a dentist.',
    results: [{ value: '0.422', label: 'test mAP50 · Champion model' }, { value: '86%', label: 'test precision' }, { value: '46.7%', label: 'test recall' }],
    summary: 'An end-to-end MLOps pipeline and an accessible application: 1,808 X-rays, 7 finding categories, YOLOv8s, DVC, MLflow, FastAPI, Docker and Snani in French/Arabic.',
    metric: 'mAP50 0.422 · precision 0.860 · recall 0.467 (test)',
    category: 'Computer Vision & MLOps',
    status: 'Public demo · academic project',
  },
  pointfed: {
    title: 'PointFed3D — Federated Learning on 3D Point Clouds',
    description: "3D point cloud classification (ShapeNet via CAP3D, 50 classes) with the FeaStNet graph network, implementing five strategies: centralised training, hand-written FedAvg over 4 clients in IID and non-IID, vertical federation (geometry and colour held by two parties, no raw data shared) and distillation into a smaller student. Full-scale results remain to be measured.",
    category: 'Federated Learning & 3D',
    status: 'Academic project',
  },
  misinformation: {
    title: 'Arabic Medical Misinformation Detector',
    description: "Fine-tuned AraBERT (bert-base-arabertv02) on ArCOV19-Rumors to detect medical misinformation in Arabic tweets: Arabic text normalisation, deduplication (617 duplicates removed), tuned decision threshold and error analysis — 0.869 accuracy and macro F1 on 297 test tweets. A TF-IDF baseline does as well on this dataset.",
    problem: "Detect medical misinformation in Arabic tweets (ArCOV19-Rumors corpus).",
    results: [{ value: "0.869", label: "accuracy (297 test tweets)" }, { value: "0.869", label: "macro F1, same test" }],
    summary: "AraBERT fine-tuned on ArCOV19-Rumors: normalisation, deduplication, tuned decision threshold and error analysis, honestly compared with a TF-IDF baseline.",
    metric: "0.869 accuracy · macro F1 0.869 (297 tweets)",
    category: 'NLP & Fine-tuning',
    status: 'Personal project',
  },
  shoplifting: {
    title: 'AmnAI — Shoplifting Detection',
    description: 'Real-time detection of suspicious behavior in surveillance videos. Pipeline of YOLO (person detection), DeepSORT (tracking), MediaPipe Pose (landmarks) and behavioral feature extraction (speed, hand-to-pocket or bag, posture), classified by a bidirectional LSTM with attention or a heuristic mode, with on-screen alerts.',
    category: 'Computer Vision',
    status: 'Personal project',
  },
  deeplearning: {
    title: 'Deep Learning: From Perceptrons to Model Distillation',
    description: 'Five progressive projects: MLPs on clinical data (84.8% accuracy on heart disease) and bank fraud detection (0.90 ROC-AUC), 1D/2D/3D convolutions hand-coded in NumPy on biomedical signals, chest X-ray triage (CNN and VGG16 at 93%, YOLOv8n 24× faster than Faster R-CNN) and knowledge distillation (KD, Attention Transfer, FitNets, RKD) into a 7,539-parameter model.',
    category: 'Deep Learning',
    status: 'Academic project',
  },
  segmentation: {
    title: 'Semantic Segmentation with U-Net',
    description: 'Semantic segmentation of urban scenes on Cityscapes: dataset exploration, a baseline U-Net in PyTorch (data loading, joint image/mask transforms, mIoU and pixel accuracy from the confusion matrix) and experiments with a self-distillation variant.',
    category: 'Computer Vision',
    status: 'Academic project',
  },
  ccsvm: {
    title: 'Chance-Constrained Support Vector Machines',
    description: 'Study of SVMs under uncertainty: primal (SOCP) and dual formulations, least-squares variant, bilevel and trilevel hyperparameter optimization (C, a, p) and generalization analysis (VC dimension, Rademacher complexity, bias-variance). Applied to binary and multiclass classification (One-vs-Rest, One-vs-One) and probabilistic SVR on Breast Cancer, Seeds and Diabetes.',
    category: 'Machine Learning & Optimization',
    status: 'Academic project',
  },
  audit: {
    title: "Intelligent Audit — Accounting Anomaly Detection",
    shortTitle: "Intelligent Audit",
    subtitle: "Accounting Anomaly Detection",
    description: "Machine learning pipeline built during my internship at AKWA Group, following CRISP-DM, to detect transactions present in Afriware but missing from JD Edwards (F0911 and F03B11). Reconciliation of three sources, invoice-level grouping, comparison of five supervised models (logistic regression, SVM, decision tree, Random Forest, KNN); Isolation Forest and an autoencoder tested then set aside. Random Forest: F1 of 0.85 and recall of 0.78 on the missing-invoice class, accuracy of 0.98.",
    problem: "Detecting transactions present in Afriware but missing from the JD Edwards accounting systems, through a data preparation and machine learning evaluation pipeline.",
    businessValue: "Business goal: help auditors spot reconciliation gaps between accounting systems, across all the data rather than a sample.",
    results: [{ value: "98%", label: "overall accuracy" }, { value: "85%", label: "F1-score, “Missing” class" }, { value: "78%", label: "recall, “Missing” class" }],
    role: "AKWA Group · ML & Data Engineering Internship",
    metric: "F1 0.85 · recall 0.78 (“Missing” class)",
    category: 'Data & Machine Learning',
    status: 'Internship — AKWA Group',
  },
  speaker: {
    title: 'Speaker Recognition on a Degraded Radio Channel',
    description: 'Robust speaker identification for police radio communications: P25 channel simulation (band-pass filtering, SNR-controlled noise, dynamic compression) on VoxCeleb voices, SNR augmentation, MFCC, delta and spectral features, SVM classification (RBF kernel, grid search) — 86.98% accuracy across 50 speakers — and a real-time Streamlit identification interface.',
    category: 'Signal Processing & ML',
    status: 'Personal project',
  },
  motoscraper: {
    title: 'Web Scraping & Analysis — Profitable Motorcycle Import',
    description: 'Python tool that scrapes used motorcycle listings in Europe (LeParking) and Morocco (Avito) with Selenium, queries the Moroccan customs web portal (automated with Selenium) for the taxable value, computes the import margin of each listing and plots the margin distribution per model as candlesticks.',
    category: 'Data Engineering',
    status: 'Personal project',
  },
  irrigation: {
    title: 'Smart Irrigation System',
    description: 'Flutter mobile app for real-time multi-zone irrigation control, connected to an ESP32 and an Arduino Mega through Firebase Realtime Database: safe commands (one active zone at a time, state machine on the Arduino), watering schedules, history and water-usage statistics, Firebase Auth and Google Sign-In.',
    category: 'IoT & Mobile',
    status: 'Personal project',
  },
  renault: {
    title: "Renault Digital — LLM Agents & RAG for QA",
    description: "Ingestion pipeline of 400+ PDFs (OCR of tables and images, structure-aware chunking, MMR retrieval on pgvector) feeding a RAG, and a multi-agent LLM system (Requirement Analyzer, Test Design) turning requirements into Jira tickets and Gherkin scenarios, with human validation at each step.",
    problem: "Writing Jira tickets and Gherkin scenarios from requirements took the QA team 10 to 20 minutes per requirement.",
    results: [{ value: "85%", label: "of generations accepted without edits" }, { value: "10–20 → 1–2 min", label: "writing time per requirement" }, { value: "400+", label: "PDFs ingested into the RAG" }],
    category: "Internship — Renault Digital",
    status: "Deployed internally",
    role: "AI Engineer Intern — Quality Engineering",
    metric: "85% of generations accepted without edits",
  },
}

// Public projects (experience-only entries such as Renault Digital excluded).
const projectCount = Object.values(projectMeta).filter((m) => !m.detailsHref).length

function withMeta(texts: Record<string, ProjectText>): Record<string, Project> {
  return Object.fromEntries(
    Object.entries(texts).map(([id, text]) => [id, { id, ...projectMeta[id], ...text }]),
  )
}

// ---------------------------------------------------------------------------
// FR
// ---------------------------------------------------------------------------

const fr: SiteContent = {
  nav: {
    profiles: 'Profils',
    projects: 'Projets',
    cv: 'CV',
    contact: 'Contact',
    profileMenu: {
      label: 'Profil',
      heading: 'Choisissez la version du portfolio',
      compareLabel: 'Comparer les 3 profils',
    },
  },
  hero: {
    eyebrow: 'PROMOTION ENSIAS 2027',
    role: "Élève-ingénieur en intelligence artificielle à l'ENSIAS",
    description: "Je conçois des systèmes d'IA appliqués à des problèmes métier, de la donnée au déploiement : pipelines de données, IA générative, machine learning et MLOps.",
    seeking: "À la recherche d'un stage PFE",
    location: '',
    credibility: 'Stages : Renault Digital (2026) · AKWA Group (2025)',
    ctaProjects: 'Explorer mes projets',
    ctaCV: 'Télécharger mon CV',
    ctaContact: 'Me contacter',
    selectorLabel: 'Choisir un profil',
    selectorTitle: 'Trois profils. Un seul ingénieur.',
    videoPause: 'Mettre la vidéo en pause',
    videoPlay: 'Lire la vidéo',
  },
  profilePicker: {
    eyebrow: '01 / PROFILS',
    heading: ['Choisissez', "l'angle qui vous intéresse."],
    description: "Un même socle d'ingénierie, mis au service de trois métiers différents.",
    enterLabel: 'Explorer ce profil',
  },
  bio: {
    eyebrow: '02 / À PROPOS',
    tag: "L'INGÉNIEUR DERRIÈRE LE PROFIL",
    stats: [
      { value: '2027', label: 'Diplôme ENSIAS' },
      { value: '03', label: 'Profils professionnels' },
      { value: String(projectCount).padStart(2, '0'), label: 'Projets réalisés' },
    ],
    location: '',
    secondLocation: '',
  },
  skillsHeading: 'Compétences techniques',
  experienceHeading: 'Expérience professionnelle',
  sections: {
    experienceEyebrow: '03 / EXPÉRIENCE',
    experienceIntro: 'Deux stages en entreprise, des systèmes livrés et utilisés.',
    skillsEyebrow: '05 / COMPÉTENCES',
    skillsIntro: 'La boîte à outils mobilisée pour ce profil.',
    cvEyebrow: '06 / CV',
  },
  profileUpdates: 'Adapte les projets phares, les compétences et le CV',
  caseStudy: {
    readLabel: "Lire l'étude de cas",
    backLabel: 'Retour aux projets',
    contextLabel: 'Contexte',
    problemLabel: 'Problème',
    roleLabel: 'Rôle',
    overviewLabel: 'Solution',
    contributionsLabel: 'Contributions',
    resultsLabel: 'Résultats',
    stackLabel: 'Technologies',
    decisionsLabel: 'Décisions techniques',
    limitationsLabel: 'Limites',
    linksLabel: 'Liens',
    experienceLink: "Voir l'expérience complète",
    confidentialNote: 'Projet interne : aucune capture ni donnée métier publiée, par confidentialité.',
  },
  projectsSection: {
    eyebrow: '04 / PROJETS',
    heading: ['Projets', 'phares.'],
    description: 'Les trois projets les plus représentatifs de ce profil. Tous les autres restent à un clic.',
    viewAllLabel: 'Voir tous mes projets',
    viewLessLabel: 'Masquer les autres projets',
    allHeading: 'Tous les autres projets',
    codeLabel: 'Code',
    demoLabel: 'Démo',
    detailsLabel: "Voir l'expérience",
    noLinkLabel: 'Dépôt privé',
  },
  cv: {
    heading: 'Curriculum Vitae',
    description: "Chaque profil a son propre CV. Choisissez la version française ou anglaise au moment du téléchargement.",
    downloadLabel: 'Télécharger le CV',
    contactHeading: 'Contact',
    languagesHeading: 'Langues',
    educationHeading: 'Formation',
    softSkillsHeading: 'Soft Skills',
  },
  education: [
    {
      degree: "Diplôme d'Ingénieur d'État — Ingénierie de l'Intelligence Artificielle (2IA)",
      school: 'ENSIAS — École Nationale Supérieure d\'Informatique et d\'Analyse des Systèmes',
      period: 'Septembre 2024 — Juin 2027',
      location: '',
      logo: schoolLogos.ensias,
      details: "Apprentissage automatique et profond (réseaux de neurones, reinforcement learning), apprentissage statistique et probabiliste. Big Data et systèmes distribués, ingénierie des données, séries temporelles, traitement multimédia (texte, image).",
    },
    {
      degree: 'Classes Préparatoires aux Grandes Écoles (CPGE) — Mathématiques-Physique',
      school: 'CPGE Mohammed V',
      period: 'Septembre 2022 — Juin 2024',
      location: '',
      logo: schoolLogos.cpge,
      details: "Mathématiques appliquées, sciences de l'ingénieur et programmation Python. Préparation aux concours des grandes écoles d'ingénieurs.",
    },
  ],
  languages: [
    { name: 'Français', level: 'Langue maternelle' },
    { name: 'Arabe', level: 'Langue maternelle' },
    { name: 'Anglais', level: 'Bilingue' },
  ],
  softSkills: [
    { title: 'Organisation & Travail en équipe', description: 'Responsable logistique du Forum Club ENSIAS (rencontres entreprises–étudiants)' },
    { title: 'Autonomie & Résolution de problèmes', description: "Solution IA livrée en production sous contraintes d'accès et de confidentialité" },
  ],
  contact: {
    eyebrow: '07 / CONTACT',
    heading: ['Construisons', 'quelque chose.'],
    description: "Pipelines de données, systèmes d'IA générative ou modèles de machine learning — si le problème est réel, je veux en discuter.",
    availability: 'À la recherche d’un stage PFE',
    form: {
      name: 'Votre nom',
      email: 'Votre email',
      message: 'Votre message',
      submit: 'Envoyer le message',
      sending: 'Envoi en cours...',
      success: 'Message envoyé ! Je vous répondrai bientôt.',
      error: "Une erreur s'est produite. Réessayez ou écrivez-moi directement à " + contactInfo.email,
    },
  },
  footer: '© 2026 Jad Falaq. Tous droits réservés.',
  profiles: {
    'data-ai': {
      navLabel: 'Data & IA',
      title: 'Data & AI Engineer',
      pickerDescription: "Pipelines de données, intégration ERP et IA générative — de la donnée brute à la décision automatisée.",
      summary: "Data & AI Engineer, élève-ingénieur en dernière année d'Ingénierie de l'IA à l'ENSIAS, avec des expériences chez Renault Digital et AKWA Group. Spécialisé en pipelines de données, intégration ERP, Machine Learning et IA générative. Profil hybride Data Engineering / IA, orienté automatisation de bout en bout, gouvernance des données et transformation digitale des processus.",
      keywords: ['Data Engineering', 'Machine Learning', 'GenAI', 'RAG', 'ETL'],
      bioQuote: "La donnée pose la question. Le pipeline la rend fiable. L'IA y répond.",
      experience: [
        {
          title: 'Stagiaire Ingénieur IA — Quality Engineering',
          company: 'Renault Digital',
          type: 'Stage',
          period: periods.renault.fr,
          location: 'Casablanca, Maroc',
          logo: '/rdm logo.jpg',
          description: [
            "Agentic AI & Automatisation des workflows : conception et livraison d'une plateforme IA human-in-the-loop qui transforme des exigences en langage naturel et des entrées multimodales (PDF, images) en spécifications structurées, scénarios de test Gherkin et tickets Jira approuvés après revue. Évolution d'un prototype Microsoft Copilot Studio / Power Platform vers une solution full-stack (FastAPI, React/TypeScript, Azure OpenAI/Ollama). Au service d'une équipe QA de 6 ingénieurs : plus de 100 tickets Jira et 50 scénarios Gherkin générés, temps de rédaction réduit de 10–20 min à 1–2 min par exigence.",
            "RAG & Génération contextuelle : pipeline RAG few-shot à base d'embeddings qui retrouve les générations QA déjà approuvées (similarité cosinus, top-k configurable, seuil de similarité de 0,72). Traitement de documents multimodaux et masquage des données sensibles avec Presidio/spaCy, pour des échanges avec le LLM plus pertinents et plus confidentiels.",
            "Fiabilité des LLM & Quality Engineering : pipeline de validation en plusieurs étapes combinant schémas Pydantic, rendu Gherkin déterministe, validation par le parseur officiel Cucumber et points d'approbation humaine. Historique des générations, workflows de régénération et suivi qualité, avec un taux d'acceptation au premier passage de 85% rapporté pour les livrables générés.",
            "Automatisation QA : génération des fichiers Smoke/TNR sur SharePoint et reporting dans Teams (Power Automate), déployés en interne.",
          ],
        },
        {
          title: 'ML & Data Engineer — Équipe Data',
          company: 'AKWA Group',
          type: 'Stage',
          period: periods.akwa.fr,
          location: '',
          logo: '/Akwa.jpg',
          description: [
            "Data Engineering & Intégration ERP : automatisation, en collaboration avec l'équipe Data, de la détection et de l'intégration dans l'ERP des transactions manquantes sur plus de 6 millions d'enregistrements SQL.",
            "Machine Learning & Détection d'anomalies : conception d'un pipeline ML de bout en bout (prétraitement, feature engineering, modélisation, évaluation) pour la détection et la classification des transactions manquantes.",
            "Modélisation & Évaluation : comparaison de 5 algorithmes (régression logistique, SVM, arbre de décision, Random Forest, KNN) — Random Forest retenu, atteignant 98% d'accuracy et 85% de F1-score.",
          ],
        },
      ],
      skills: [
        { heading: 'Data Engineering & BI', items: ['SQL', 'ETL', 'Pandas', 'Kafka', 'Power BI', 'unstructured.io', 'OCR', 'Déduplication', 'Intégration ERP'] },
        { heading: 'Bases de données', items: ['PostgreSQL', 'pgvector', 'MongoDB', 'Neo4j', 'SQLite', 'SQLAlchemy', 'Chroma'] },
        { heading: 'IA Générative & RAG', items: ['Azure OpenAI', 'Microsoft Copilot API', 'LangChain', 'LangGraph', 'Systèmes multi-agents', 'Chunking', 'Embeddings', 'Recherche hybride', 'MMR', 'RRF'] },
        { heading: 'Machine Learning & Deep Learning', items: ['Scikit-learn', 'PyTorch', 'Feature Engineering', 'YOLOv8', 'Fine-tuning Transformers (AraBERT)'] },
        { heading: 'MLOps & Déploiement', items: ['MLflow', 'DVC', 'Docker', 'Git', 'GitHub Actions', 'Azure', 'Cloudflare'] },
        { heading: 'Back-end & Automatisation', items: ['Python', 'FastAPI', 'Pydantic', 'REST APIs', 'Power Automate', 'Power Platform', 'SharePoint'] },
      ],
      projectIds: ['audit', 'dental', 'cvmatcher', 'shoplifting', 'motoscraper', 'irrigation', 'segmentation', 'deeplearning', 'misinformation', 'speaker'],
      cvFiles: profileCVs['data-ai'],
      featuredIds: ['audit', 'renault', 'dental'],
    },
    genai: {
      navLabel: 'IA Générative',
      title: 'Ingénieur IA Générative',
      pickerDescription: 'IA agentique, RAG et systèmes multi-agents — intégrer les LLM dans des processus métier réels.',
      summary: "Ingénieur IA Générative, élève-ingénieur en dernière année d'Ingénierie de l'IA à l'ENSIAS, avec des expériences chez Renault Digital et AKWA Group. Spécialisé en IA agentique, RAG, systèmes multi-agents et intégration de LLM en entreprise. Profil hybride IA générative / métier, orienté automatisation des processus QA, gouvernance des données sensibles et mise en production.",
      keywords: ['LLM', 'RAG', 'Agentic AI', 'MLOps', 'Développement full-stack'],
      bioQuote: "Le langage pose la question. Le RAG apporte la preuve. L'agent agit.",
      experience: [
        {
          title: 'Stagiaire Ingénieur IA — Quality Engineering',
          company: 'Renault Digital',
          type: 'Stage',
          period: periods.renault.fr,
          location: 'Casablanca, Maroc',
          logo: '/rdm logo.jpg',
          description: [
            "Agentic AI & Automatisation des workflows : conception et livraison d'une plateforme IA human-in-the-loop qui transforme des exigences en langage naturel et des entrées multimodales (PDF, images) en spécifications structurées, scénarios de test Gherkin et tickets Jira approuvés après revue. Évolution d'un prototype Microsoft Copilot Studio / Power Platform vers une solution full-stack (FastAPI, React/TypeScript, Azure OpenAI/Ollama). Au service d'une équipe QA de 6 ingénieurs : plus de 100 tickets Jira et 50 scénarios Gherkin générés, temps de rédaction réduit de 10–20 min à 1–2 min par exigence.",
            "RAG & Génération contextuelle : pipeline RAG few-shot à base d'embeddings qui retrouve les générations QA déjà approuvées (similarité cosinus, top-k configurable, seuil de similarité de 0,72). Traitement de documents multimodaux et masquage des données sensibles avec Presidio/spaCy, pour des échanges avec le LLM plus pertinents et plus confidentiels.",
            "Fiabilité des LLM & Quality Engineering : pipeline de validation en plusieurs étapes combinant schémas Pydantic, rendu Gherkin déterministe, validation par le parseur officiel Cucumber et points d'approbation humaine. Historique des générations, workflows de régénération et suivi qualité, avec un taux d'acceptation au premier passage de 85% rapporté pour les livrables générés.",
            "Automatisation QA : génération des fichiers Smoke/TNR sur SharePoint et reporting dans Teams (Power Automate), déployés en interne.",
          ],
        },
        {
          title: 'ML & Data Engineer — Équipe Data',
          company: 'AKWA Group',
          type: 'Stage',
          period: periods.akwa.fr,
          location: '',
          logo: '/Akwa.jpg',
          description: [
            "ML & Données à grande échelle : conception d'un pipeline ML de bout en bout (prétraitement, feature engineering, modélisation, évaluation) détectant les transactions manquantes sur plus de 6 millions d'enregistrements SQL, avec intégration ERP automatisée.",
            "Évaluation de modèles : comparaison de 5 algorithmes (régression logistique, SVM, arbre de décision, Random Forest, KNN) — Random Forest retenu, atteignant 98% d'accuracy et 85% de F1-score.",
          ],
        },
      ],
      skills: [
        { heading: 'LLM & Prompt Engineering', items: ['System prompts', 'Few-shot', 'Sorties structurées (JSON, Pydantic)', 'Tool calling', 'SDK OpenAI & Anthropic', 'Azure OpenAI', 'Microsoft Copilot API'] },
        { heading: 'Orchestration & Agents', items: ['LangChain', 'LangGraph', 'Agents ReAct', 'Systèmes multi-agents', 'Human-in-the-loop'] },
        { heading: 'RAG & Ingestion documentaire', items: ['unstructured.io', 'OCR', 'Chunking', 'Embeddings', 'Similarité cosinus', 'pgvector', 'Chroma', 'Recherche hybride', 'Multi-query', 'RRF', 'MMR', 'Reranking'] },
        { heading: 'Production & Back-end', items: ['Python', 'TypeScript', 'C#', 'Node.js', 'FastAPI', 'Pydantic', 'SQLAlchemy', 'pytest', 'React', 'Firebase', 'Supabase'] },
        { heading: 'LLMOps & Évaluation', items: ['LangSmith', 'Langfuse', 'Métriques RAG', 'Calibration de seuils', 'DLP (Presidio)'] },
        { heading: 'ML, Deep Learning & MLOps', items: ['Scikit-learn', 'PyTorch', 'YOLOv8', 'Computer Vision', 'MLflow', 'DVC', 'Docker', 'GitHub Actions', 'Azure', 'Cloudflare'] },
      ],
      projectIds: ['cvmatcher', 'ragchatbot', 'bookpipeline', 'misinformation', 'dental', 'deeplearning'],
      cvFiles: profileCVs['genai'],
      featuredIds: ['renault', 'cvmatcher', 'ragchatbot'],
    },
    mlops: {
      navLabel: 'ML Engineer',
      title: 'Ingénieur Machine Learning & MLOps',
      pickerDescription: "Machine learning, computer vision et MLOps — de l'entraînement au modèle fiable en production.",
      summary: "Ingénieur Machine Learning & MLOps, élève-ingénieur en dernière année d'Ingénierie de l'IA à l'ENSIAS, avec des expériences chez Renault Digital et AKWA Group. Spécialisé en Machine Learning, Computer Vision, MLOps et déploiement de modèles. Profil hybride Machine Learning / Ops, orienté industrialisation des modèles, fiabilité en production et intégration ERP.",
      keywords: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'MLOps', 'Data Engineering'],
      bioQuote: 'Le modèle pose la question. Les tests la valident. La prod la tient dans la durée.',
      experience: [
        {
          title: 'Stagiaire Ingénieur IA — Quality Engineering',
          company: 'Renault Digital',
          type: 'Stage',
          period: periods.renault.fr,
          location: 'Casablanca, Maroc',
          logo: '/rdm logo.jpg',
          description: [
            "Agentic AI & Automatisation des workflows : conception et livraison d'une plateforme IA human-in-the-loop qui transforme des exigences en langage naturel et des entrées multimodales (PDF, images) en spécifications structurées, scénarios de test Gherkin et tickets Jira approuvés après revue. Évolution d'un prototype Microsoft Copilot Studio / Power Platform vers une solution full-stack (FastAPI, React/TypeScript, Azure OpenAI/Ollama). Au service d'une équipe QA de 6 ingénieurs : plus de 100 tickets Jira et 50 scénarios Gherkin générés, temps de rédaction réduit de 10–20 min à 1–2 min par exigence.",
            "RAG & Génération contextuelle : pipeline RAG few-shot à base d'embeddings qui retrouve les générations QA déjà approuvées (similarité cosinus, top-k configurable, seuil de similarité de 0,72). Traitement de documents multimodaux et masquage des données sensibles avec Presidio/spaCy, pour des échanges avec le LLM plus pertinents et plus confidentiels.",
            "Fiabilité des LLM & Quality Engineering : pipeline de validation en plusieurs étapes combinant schémas Pydantic, rendu Gherkin déterministe, validation par le parseur officiel Cucumber et points d'approbation humaine. Historique des générations, workflows de régénération et suivi qualité, avec un taux d'acceptation au premier passage de 85% rapporté pour les livrables générés.",
            "Automatisation QA : génération des fichiers Smoke/TNR sur SharePoint et reporting dans Teams (Power Automate), déployés en interne.",
          ],
        },
        {
          title: 'ML & Data Engineer — Équipe Data',
          company: 'AKWA Group',
          type: 'Stage',
          period: periods.akwa.fr,
          location: '',
          logo: '/Akwa.jpg',
          description: [
            "Machine Learning & Détection d'anomalies : conception d'un pipeline ML de bout en bout (prétraitement, feature engineering, modélisation, évaluation) pour la détection et la classification des transactions manquantes.",
            "Modélisation & Évaluation : comparaison de 5 algorithmes (régression logistique, SVM, arbre de décision, Random Forest, KNN) — Random Forest retenu, atteignant 98% d'accuracy et 85% de F1-score.",
            "Data Engineering & Intégration ERP : automatisation, en collaboration avec l'équipe Data, de la détection et de l'intégration dans l'ERP des transactions manquantes sur plus de 6 millions d'enregistrements SQL.",
          ],
        },
      ],
      skills: [
        { heading: 'Machine Learning', items: ['Régression', 'SVM', 'Random Forest', 'XGBoost', 'KNN', 'Clustering', 'Manifold Learning', 'Online Learning', 'Reinforcement Learning'] },
        { heading: 'Deep Learning', items: ['CNN', 'LSTM', 'Transformers', 'GNN', 'Fine-tuning (AraBERT)'] },
        { heading: 'Bibliothèques', items: ['NumPy', 'Pandas', 'Scikit-learn', 'XGBoost', 'PyTorch', 'Hugging Face', 'OpenCV', 'Ultralytics (YOLOv8)', 'MediaPipe', 'Matplotlib'] },
        { heading: 'Données & Modalités', items: ['Séries temporelles', 'Image', 'Signal', 'Vidéo', 'Nuages de points 3D', 'Computer Vision'] },
        { heading: 'MLOps & CI/CD', items: ['MLflow', 'DVC', 'Airflow', 'Docker', 'Git', 'GitHub Actions', 'pytest'] },
        { heading: 'Serving, Data & Cloud', items: ['Python', 'FastAPI', 'Pydantic', 'REST APIs', 'SQL', 'PostgreSQL', 'Azure'] },
      ],
      projectIds: ['dental', 'pointfed', 'shoplifting', 'deeplearning', 'misinformation', 'segmentation', 'speaker', 'audit', 'ccsvm'],
      cvFiles: profileCVs['mlops'],
      featuredIds: ['dental', 'audit', 'misinformation'],
    },
  },
  projects: withMeta(projectsFr),
}

// ---------------------------------------------------------------------------
// EN
// ---------------------------------------------------------------------------

const en: SiteContent = {
  nav: {
    profiles: 'Profiles',
    projects: 'Projects',
    cv: 'CV',
    contact: 'Contact',
    profileMenu: {
      label: 'Profile',
      heading: 'Choose your version of the portfolio',
      compareLabel: 'Compare the 3 profiles',
    },
  },
  hero: {
    eyebrow: 'ENSIAS CLASS OF 2027',
    role: 'Artificial intelligence engineering student at ENSIAS',
    description: 'I build AI systems for real business problems, from data to deployment: data pipelines, generative AI, machine learning and MLOps.',
    seeking: 'Looking for a final-year internship (PFE)',
    location: '',
    credibility: 'Internships: Renault Digital (2026) · AKWA Group (2025)',
    ctaProjects: 'Explore my projects',
    ctaCV: 'Download my CV',
    ctaContact: 'Contact me',
    selectorLabel: 'Choose a profile',
    selectorTitle: 'Three profiles. One engineer.',
    videoPause: 'Pause the video',
    videoPlay: 'Play the video',
  },
  profilePicker: {
    eyebrow: '01 / PROFILES',
    heading: ['Choose the angle', 'that matters to you.'],
    description: 'One engineering foundation, applied to three different roles.',
    enterLabel: 'Enter profile',
  },
  bio: {
    eyebrow: '02 / ABOUT',
    tag: 'THE ENGINEER BEHIND THE PROFILE',
    stats: [
      { value: '2027', label: 'ENSIAS graduation' },
      { value: '03', label: 'Professional profiles' },
      { value: String(projectCount).padStart(2, '0'), label: 'Delivered projects' },
    ],
    location: '',
    secondLocation: '',
  },
  skillsHeading: 'Technical skills',
  experienceHeading: 'Professional experience',
  sections: {
    experienceEyebrow: '03 / EXPERIENCE',
    experienceIntro: 'Two industry internships, systems delivered and in use.',
    skillsEyebrow: '05 / SKILLS',
    skillsIntro: 'The toolkit used for this profile.',
    cvEyebrow: '06 / CV',
  },
  profileUpdates: 'Updates the featured projects, skills and CV',
  caseStudy: {
    readLabel: 'Read the case study',
    backLabel: 'Back to projects',
    contextLabel: 'Context',
    problemLabel: 'Problem',
    roleLabel: 'Role',
    overviewLabel: 'Solution',
    contributionsLabel: 'Contributions',
    resultsLabel: 'Results',
    stackLabel: 'Technologies',
    decisionsLabel: 'Technical decisions',
    limitationsLabel: 'Limitations',
    linksLabel: 'Links',
    experienceLink: 'See the full experience',
    confidentialNote: 'Internal project: no screenshots or business data published, for confidentiality.',
  },
  projectsSection: {
    eyebrow: '04 / SELECTED WORK',
    heading: ['Featured', 'projects.'],
    description: 'The three projects that best represent this profile. Everything else is one click away.',
    viewAllLabel: 'View all my projects',
    viewLessLabel: 'Hide other projects',
    allHeading: 'All other projects',
    codeLabel: 'Code',
    demoLabel: 'Demo',
    detailsLabel: 'See the experience',
    noLinkLabel: 'Private repository',
  },
  cv: {
    heading: 'Curriculum Vitae',
    description: 'Each profile has its own CV. Choose French or English when downloading.',
    downloadLabel: 'Download CV',
    contactHeading: 'Contact',
    languagesHeading: 'Languages',
    educationHeading: 'Education',
    softSkillsHeading: 'Soft Skills',
  },
  education: [
    {
      degree: 'State Engineering Degree — Artificial Intelligence Engineering (2IA)',
      school: "ENSIAS — École Nationale Supérieure d'Informatique et d'Analyse des Systèmes",
      period: 'September 2024 — June 2027',
      location: '',
      logo: schoolLogos.ensias,
      details: 'Machine & Deep Learning (neural networks, reinforcement learning), statistical and probabilistic learning. Big Data and distributed systems, data engineering, time series, multimedia processing (text, image).',
    },
    {
      degree: 'Preparatory Classes for the Grandes Écoles (CPGE) — Mathematics-Physics',
      school: 'CPGE Mohammed V',
      period: 'September 2022 — June 2024',
      location: '',
      logo: schoolLogos.cpge,
      details: 'Applied mathematics, engineering sciences and Python programming. Preparation for competitive entrance exams to top engineering schools.',
    },
  ],
  languages: [
    { name: 'French', level: 'Native' },
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Bilingual' },
  ],
  softSkills: [
    { title: 'Organization & Teamwork', description: 'Logistics lead of the ENSIAS Forum Club (company–student meetings)' },
    { title: 'Autonomy & Problem Solving', description: 'Delivered an AI solution to production under access and confidentiality constraints' },
  ],
  contact: {
    eyebrow: '07 / CONTACT',
    heading: ["Let's build", 'something real.'],
    description: "Data pipelines, generative AI systems or machine learning models — if the problem is real, I'd like to hear about it.",
    availability: 'Looking for a final-year internship (PFE)',
    form: {
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      submit: 'Send Message',
      sending: 'Sending...',
      success: "Message sent! I'll get back to you soon.",
      error: 'Something went wrong. Please try again or email me directly at ' + contactInfo.email,
    },
  },
  footer: '© 2026 Jad Falaq. All rights reserved.',
  profiles: {
    'data-ai': {
      navLabel: 'Data & AI',
      title: 'Data & AI Engineer',
      pickerDescription: 'Data pipelines, ERP integration and generative AI — from raw data to automated decisions.',
      summary: 'Data & AI Engineer, final-year AI engineering student at ENSIAS, with experience at Renault Digital and AKWA Group. Specialized in data pipelines, ERP integration, Machine Learning and generative AI. Hybrid Data Engineering / AI profile, focused on end-to-end automation, data governance and digital transformation of processes.',
      keywords: ['Data Engineering', 'Machine Learning', 'GenAI', 'RAG', 'ETL'],
      bioQuote: 'Data asks the question. The pipeline makes it reliable. AI answers it.',
      experience: [
        {
          title: 'AI Engineer Intern — Quality Engineering',
          company: 'Renault Digital',
          type: 'Internship',
          period: periods.renault.en,
          location: 'Casablanca, Morocco',
          logo: '/rdm logo.jpg',
          description: [
            "Agentic AI & Workflow Automation: architected and delivered a human-in-the-loop AI platform transforming natural-language requirements and multimodal inputs (PDFs, images) into structured specifications, Gherkin test scenarios and review-approved Jira tickets. Evolved a Microsoft Copilot Studio / Power Platform prototype into a full-stack solution (FastAPI, React/TypeScript, Azure OpenAI/Ollama). Supported a 6-engineer QA team, generating 100+ Jira tickets and 50+ Gherkin scenarios, while reducing drafting time from 10–20 minutes to 1–2 minutes per requirement.",
            "RAG & Context-Aware Generation: implemented an embedding-based few-shot RAG pipeline retrieving previously approved QA generations using cosine similarity, configurable top-k retrieval and a 0.72 similarity threshold. Developed multimodal document-processing capabilities and integrated Presidio/spaCy for sensitive-data masking, improving the contextual relevance and privacy of LLM interactions.",
            "LLM Reliability & Quality Engineering: engineered a multi-stage validation pipeline combining Pydantic schema enforcement, deterministic Gherkin rendering, official Cucumber parser validation and human approval gates. Implemented generation history, regeneration workflows and quality monitoring, with a reported 85% first-pass acceptance rate for AI-generated deliverables.",
            "QA Automation: generation of Smoke/regression test files on SharePoint and Teams reporting (Power Automate), deployed internally.",
          ],
        },
        {
          title: 'ML & Data Engineer — Data Team',
          company: 'AKWA Group',
          type: 'Internship',
          period: periods.akwa.en,
          location: '',
          logo: '/Akwa.jpg',
          description: [
            'Data Engineering & ERP Integration: automated, with the Data team, the detection and ERP integration of missing transactions across 6M+ SQL records.',
            'Machine Learning & Anomaly Detection: built an end-to-end ML pipeline (preprocessing, feature engineering, modeling, evaluation) to detect and classify missing transactions.',
            'Modeling & Evaluation: compared 5 algorithms (logistic regression, SVM, decision tree, Random Forest, KNN) — the selected Random Forest reached 98% accuracy and 85% F1-score.',
          ],
        },
      ],
      skills: [
        { heading: 'Data Engineering & BI', items: ['SQL', 'ETL', 'Pandas', 'Kafka', 'Power BI', 'unstructured.io', 'OCR', 'Deduplication', 'ERP integration'] },
        { heading: 'Databases', items: ['PostgreSQL', 'pgvector', 'MongoDB', 'Neo4j', 'SQLite', 'SQLAlchemy', 'Chroma'] },
        { heading: 'Generative AI & RAG', items: ['Azure OpenAI', 'Microsoft Copilot API', 'LangChain', 'LangGraph', 'Multi-agent systems', 'Chunking', 'Embeddings', 'Hybrid search', 'MMR', 'RRF'] },
        { heading: 'Machine Learning & Deep Learning', items: ['Scikit-learn', 'PyTorch', 'Feature Engineering', 'YOLOv8', 'Transformer fine-tuning (AraBERT)'] },
        { heading: 'MLOps & Deployment', items: ['MLflow', 'DVC', 'Docker', 'Git', 'GitHub Actions', 'Azure', 'Cloudflare'] },
        { heading: 'Back-end & Automation', items: ['Python', 'FastAPI', 'Pydantic', 'REST APIs', 'Power Automate', 'Power Platform', 'SharePoint'] },
      ],
      projectIds: ['audit', 'dental', 'cvmatcher', 'shoplifting', 'motoscraper', 'irrigation', 'segmentation', 'deeplearning', 'misinformation', 'speaker'],
      cvFiles: profileCVs['data-ai'],
      featuredIds: ['audit', 'renault', 'dental'],
    },
    genai: {
      navLabel: 'Generative AI',
      title: 'Generative AI Engineer',
      pickerDescription: 'Agentic AI, RAG and multi-agent systems — wiring LLMs into real business processes.',
      summary: 'Generative AI Engineer, final-year AI engineering student at ENSIAS, with experience at Renault Digital and AKWA Group. Specialized in agentic AI, RAG, multi-agent systems and enterprise LLM integration. Hybrid generative AI / business profile, focused on QA process automation, sensitive data governance and production deployment.',
      keywords: ['LLM', 'RAG', 'Agentic AI', 'MLOps', 'Full-stack Development'],
      bioQuote: 'Language asks the question. RAG brings the evidence. The agent acts.',
      experience: [
        {
          title: 'AI Engineer Intern — Quality Engineering',
          company: 'Renault Digital',
          type: 'Internship',
          period: periods.renault.en,
          location: 'Casablanca, Morocco',
          logo: '/rdm logo.jpg',
          description: [
            "Agentic AI & Workflow Automation: architected and delivered a human-in-the-loop AI platform transforming natural-language requirements and multimodal inputs (PDFs, images) into structured specifications, Gherkin test scenarios and review-approved Jira tickets. Evolved a Microsoft Copilot Studio / Power Platform prototype into a full-stack solution (FastAPI, React/TypeScript, Azure OpenAI/Ollama). Supported a 6-engineer QA team, generating 100+ Jira tickets and 50+ Gherkin scenarios, while reducing drafting time from 10–20 minutes to 1–2 minutes per requirement.",
            "RAG & Context-Aware Generation: implemented an embedding-based few-shot RAG pipeline retrieving previously approved QA generations using cosine similarity, configurable top-k retrieval and a 0.72 similarity threshold. Developed multimodal document-processing capabilities and integrated Presidio/spaCy for sensitive-data masking, improving the contextual relevance and privacy of LLM interactions.",
            "LLM Reliability & Quality Engineering: engineered a multi-stage validation pipeline combining Pydantic schema enforcement, deterministic Gherkin rendering, official Cucumber parser validation and human approval gates. Implemented generation history, regeneration workflows and quality monitoring, with a reported 85% first-pass acceptance rate for AI-generated deliverables.",
            "QA Automation: generation of Smoke/regression test files on SharePoint and Teams reporting (Power Automate), deployed internally.",
          ],
        },
        {
          title: 'ML & Data Engineer — Data Team',
          company: 'AKWA Group',
          type: 'Internship',
          period: periods.akwa.en,
          location: '',
          logo: '/Akwa.jpg',
          description: [
            'Large-scale ML & Data: built an end-to-end ML pipeline (preprocessing, feature engineering, modeling, evaluation) detecting missing transactions across 6M+ SQL records, with automated ERP integration.',
            'Model Evaluation: compared 5 algorithms (logistic regression, SVM, decision tree, Random Forest, KNN) — the selected Random Forest reached 98% accuracy and 85% F1-score.',
          ],
        },
      ],
      skills: [
        { heading: 'LLM & Prompt Engineering', items: ['System prompts', 'Few-shot', 'Structured outputs (JSON, Pydantic)', 'Tool calling', 'OpenAI & Anthropic SDKs', 'Azure OpenAI', 'Microsoft Copilot API'] },
        { heading: 'Orchestration & Agents', items: ['LangChain', 'LangGraph', 'ReAct agents', 'Multi-agent systems', 'Human-in-the-loop'] },
        { heading: 'RAG & Document Ingestion', items: ['unstructured.io', 'OCR', 'Chunking', 'Embeddings', 'Cosine similarity', 'pgvector', 'Chroma', 'Hybrid search', 'Multi-query', 'RRF', 'MMR', 'Reranking'] },
        { heading: 'Production & Back-end', items: ['Python', 'TypeScript', 'C#', 'Node.js', 'FastAPI', 'Pydantic', 'SQLAlchemy', 'pytest', 'React', 'Firebase', 'Supabase'] },
        { heading: 'LLMOps & Evaluation', items: ['LangSmith', 'Langfuse', 'RAG metrics', 'Threshold calibration', 'DLP (Presidio)'] },
        { heading: 'ML, Deep Learning & MLOps', items: ['Scikit-learn', 'PyTorch', 'YOLOv8', 'Computer Vision', 'MLflow', 'DVC', 'Docker', 'GitHub Actions', 'Azure', 'Cloudflare'] },
      ],
      projectIds: ['cvmatcher', 'ragchatbot', 'bookpipeline', 'misinformation', 'dental', 'deeplearning'],
      cvFiles: profileCVs['genai'],
      featuredIds: ['renault', 'cvmatcher', 'ragchatbot'],
    },
    mlops: {
      navLabel: 'ML Engineer',
      title: 'Machine Learning & MLOps Engineer',
      pickerDescription: 'Machine learning, computer vision and MLOps — from training to a reliable model in production.',
      summary: 'Machine Learning & MLOps Engineer, final-year AI engineering student at ENSIAS, with experience at Renault Digital and AKWA Group. Specialized in Machine Learning, Computer Vision, MLOps and model deployment. Hybrid Machine Learning / Ops profile, focused on model industrialization, production reliability and ERP integration.',
      keywords: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'MLOps', 'Data Engineering'],
      bioQuote: 'The model asks the question. Tests validate it. Production makes it last.',
      experience: [
        {
          title: 'AI Engineer Intern — Quality Engineering',
          company: 'Renault Digital',
          type: 'Internship',
          period: periods.renault.en,
          location: 'Casablanca, Morocco',
          logo: '/rdm logo.jpg',
          description: [
            "Agentic AI & Workflow Automation: architected and delivered a human-in-the-loop AI platform transforming natural-language requirements and multimodal inputs (PDFs, images) into structured specifications, Gherkin test scenarios and review-approved Jira tickets. Evolved a Microsoft Copilot Studio / Power Platform prototype into a full-stack solution (FastAPI, React/TypeScript, Azure OpenAI/Ollama). Supported a 6-engineer QA team, generating 100+ Jira tickets and 50+ Gherkin scenarios, while reducing drafting time from 10–20 minutes to 1–2 minutes per requirement.",
            "RAG & Context-Aware Generation: implemented an embedding-based few-shot RAG pipeline retrieving previously approved QA generations using cosine similarity, configurable top-k retrieval and a 0.72 similarity threshold. Developed multimodal document-processing capabilities and integrated Presidio/spaCy for sensitive-data masking, improving the contextual relevance and privacy of LLM interactions.",
            "LLM Reliability & Quality Engineering: engineered a multi-stage validation pipeline combining Pydantic schema enforcement, deterministic Gherkin rendering, official Cucumber parser validation and human approval gates. Implemented generation history, regeneration workflows and quality monitoring, with a reported 85% first-pass acceptance rate for AI-generated deliverables.",
            "QA Automation: generation of Smoke/regression test files on SharePoint and Teams reporting (Power Automate), deployed internally.",
          ],
        },
        {
          title: 'ML & Data Engineer — Data Team',
          company: 'AKWA Group',
          type: 'Internship',
          period: periods.akwa.en,
          location: '',
          logo: '/Akwa.jpg',
          description: [
            'Machine Learning & Anomaly Detection: built an end-to-end ML pipeline (preprocessing, feature engineering, modeling, evaluation) to detect and classify missing transactions.',
            'Modeling & Evaluation: compared 5 algorithms (logistic regression, SVM, decision tree, Random Forest, KNN) — the selected Random Forest reached 98% accuracy and 85% F1-score.',
            'Data Engineering & ERP Integration: automated, with the Data team, the detection and ERP integration of missing transactions across 6M+ SQL records.',
          ],
        },
      ],
      skills: [
        { heading: 'Machine Learning', items: ['Regression', 'SVM', 'Random Forest', 'XGBoost', 'KNN', 'Clustering', 'Manifold Learning', 'Online Learning', 'Reinforcement Learning'] },
        { heading: 'Deep Learning', items: ['CNN', 'LSTM', 'Transformers', 'GNN', 'Fine-tuning (AraBERT)'] },
        { heading: 'Libraries', items: ['NumPy', 'Pandas', 'Scikit-learn', 'XGBoost', 'PyTorch', 'Hugging Face', 'OpenCV', 'Ultralytics (YOLOv8)', 'MediaPipe', 'Matplotlib'] },
        { heading: 'Data & Modalities', items: ['Time series', 'Image', 'Signal', 'Video', '3D point clouds', 'Computer Vision'] },
        { heading: 'MLOps & CI/CD', items: ['MLflow', 'DVC', 'Airflow', 'Docker', 'Git', 'GitHub Actions', 'pytest'] },
        { heading: 'Serving, Data & Cloud', items: ['Python', 'FastAPI', 'Pydantic', 'REST APIs', 'SQL', 'PostgreSQL', 'Azure'] },
      ],
      projectIds: ['dental', 'pointfed', 'shoplifting', 'deeplearning', 'misinformation', 'segmentation', 'speaker', 'audit', 'ccsvm'],
      cvFiles: profileCVs['mlops'],
      featuredIds: ['dental', 'audit', 'misinformation'],
    },
  },
  projects: withMeta(projectsEn),
}

export const siteContent: Record<Language, SiteContent> = { fr, en }
export const contact = contactInfo

// ---------------------------------------------------------------------------
// Case studies (/projects/<slug>/)
// ---------------------------------------------------------------------------

export const caseStudySlugs = Object.values(projectMeta)
  .map((m) => m.slug)
  .filter((slug): slug is string => Boolean(slug))

export function getProjectBySlug(language: Language, slug: string): Project | undefined {
  return Object.values(siteContent[language].projects).find((p) => p.slug === slug)
}

// Internship contributions come from the experience entries themselves (no copy):
// the most detailed variant across the three profiles is used.
export function getExperienceFor(language: Language, company: string): ExperienceEntry | undefined {
  const entries = Object.values(siteContent[language].profiles)
    .flatMap((profile) => profile.experience)
    .filter((exp) => exp.company === company)
  return entries.sort((a, b) => b.description.join('').length - a.description.join('').length)[0]
}
