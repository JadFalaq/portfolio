import type { Language } from '../contexts/LanguageContext'
import type { ProfileId } from '../contexts/ProfileContext'

// Language-independent project facts (links, media, stack) — defined once in `projectMeta`.
export interface ProjectMeta {
  technologies: string[]
  github?: string
  demo?: string
  image?: string
  /** Company logo, shown contained when there is no screenshot. */
  logo?: string
  /** In-page anchor with the full story, for work without a public repository. */
  detailsHref?: string
  year: string
}

// Translated project copy. `summary`, `role` and `metric` feed the featured cards.
export interface ProjectText {
  title: string
  description: string
  summary?: string
  role?: string
  metric?: string
  category: string
  status: string
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
  cvFile: string
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
    headline: [string, string, string]
    description: string
    credibility: string
    availability: string[]
    ctaProjects: string
    ctaCV: string
    ctaContact: string
    selectorLabel: string
    statNumber: string
    statLabel: string
    statSub: string
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
  phones: ['+33 7 45 50 31 19', '+212 6 05 98 23 57'],
  github: 'github.com/JadFalaq',
  githubUrl: 'https://github.com/JadFalaq',
  linkedin: 'linkedin.com/in/jadfalaq',
  linkedinUrl: 'https://www.linkedin.com/in/jadfalaq',
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
    technologies: ['LangGraph', 'Hybrid RAG (BM25 + embeddings)', 'Azure OpenAI', 'Pydantic', 'FastAPI', 'Next.js', 'Docker', 'pytest'],
    github: 'https://github.com/JadFalaq/cv-matcher',
    demo: 'https://cv-offer-matcher.vercel.app/',
    image: '/cv_matcher_card.png',
    year: '2026',
  },
  ragchatbot: {
    technologies: ['LangChain', 'Azure OpenAI', 'ChromaDB', 'Unstructured', 'Google Cloud Vision', 'Pydantic', 'MMR', 'Multi-Query', 'RRF'],
    github: 'https://github.com/JadFalaq/Comparing-RAG-Strategies-Chunking-Retrieval-Ranking',
    image: '/rag_card.png',
    year: '2026',
  },
  bookpipeline: {
    technologies: ['Apache Airflow', 'Celery', 'Redis', 'PostgreSQL', 'Docker Compose', 'Flask', 'Hugging Face Transformers', 'FLAN-T5', 'NLLB-200', 'Coqui TTS'],
    github: 'https://github.com/JadFalaq/Pipeline-d-Ingestion-Automatis-de-Livres',
    year: '2025',
  },
  dental: {
    technologies: ['YOLOv8 (Ultralytics)', 'DVC', 'MLflow', 'FastAPI', 'Docker', 'GitHub Actions', 'Azure Container Apps', 'React (Vite)', 'pytest'],
    github: 'https://github.com/JadFalaq/detection_dentaire_mlops',
    demo: 'https://snani.vercel.app/',
    image: '/Dantal pathologie.png',
    year: '2025',
  },
  pointfed: {
    technologies: ['PyTorch', 'PyTorch Geometric', 'FeaStNet (GNN)', 'FedAvg', 'Vertical FL', 'Knowledge Distillation'],
    github: 'https://github.com/JadFalaq/Federated-PointCloud-3D',
    image: '/3d_point.jpeg',
    year: '2026',
  },
  misinformation: {
    technologies: ['AraBERT', 'Hugging Face Transformers', 'PyTorch', 'Accelerate', 'scikit-learn', 'TF-IDF (baseline)'],
    github: 'https://github.com/JadFalaq/misinformation_covid_detector_arabic',
    image: '/miss_info_detection.png',
    year: '2026',
  },
  shoplifting: {
    technologies: ['YOLO (Ultralytics)', 'DeepSORT', 'MediaPipe Pose', 'PyTorch', 'LSTM + attention', 'OpenCV'],
    github: 'https://github.com/JadFalaq/AmnAI_Vlast',
    image: '/AmnAI.png',
    year: '2025',
  },
  deeplearning: {
    technologies: ['PyTorch', 'TensorFlow / Keras', 'YOLOv8', 'scikit-learn', 'NumPy', 'OpenCV'],
    github: 'https://github.com/JadFalaq/Deep-Learning-From-Perceptrons-to-Model-Distillation',
    image: '/distillation.png',
    year: '2026',
  },
  segmentation: {
    technologies: ['PyTorch', 'U-Net', 'Self-distillation', 'NumPy', 'Pillow', 'Matplotlib'],
    github: 'https://github.com/JadFalaq/Segmentation_Image',
    image: '/segmentation_card.png',
    year: '2026',
  },
  ccsvm: {
    technologies: ['CVXPY', 'scikit-learn', 'NumPy', 'Pandas', 'Matplotlib'],
    github: 'https://github.com/JadFalaq/Chance-Constrained-Support-Vector-Machines',
    image: '/svm.png',
    year: '2026',
  },
  audit: {
    technologies: ['Scikit-learn', 'Random Forest', 'Isolation Forest', 'Autoencoder (TensorFlow)', 'Pandas', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/JadFalaq/Audit-Intelligent',
    image: '/anomalies detection.png',
    year: '2025',
  },
  speaker: {
    technologies: ['librosa', 'SciPy', 'scikit-learn (SVM)', 'MFCC', 'Plotly', 'Streamlit'],
    github: 'https://github.com/JadFalaq/Detection_de_locuteur_dans_les_stations_radio',
    image: '/detection de locateur.png',
    year: '2025',
  },
  motoscraper: {
    technologies: ['Python', 'Selenium', 'Pandas', 'NumPy', 'Matplotlib'],
    github: 'https://github.com/JadFalaq/Profitable_Motorcycle_Import_Scraper',
    image: '/motorcycle profit.png',
    year: '2024',
  },
  renault: {
    technologies: ['Microsoft Copilot API', 'pgvector', 'unstructured.io', 'Pydantic', 'FastAPI'],
    logo: '/rdm logo.jpg',
    detailsHref: '#experience',
    year: '2026',
  },
  irrigation: {
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
    summary: "Agent LangGraph qui confronte un CV à une offre compétence par compétence : RAG hybride (BM25 + embeddings, RRF), citations vérifiées mot pour mot, score calculé en code et validation humaine — sans jamais inventer d'expérience.",
    metric: "125 tests pytest · CI GitHub Actions",
    category: 'IA Agentique & RAG',
    status: 'Démo en ligne',
  },
  ragchatbot: {
    title: 'Stratégies RAG : chunking, retrieval et ranking',
    description: "Implémentation pas à pas d'un pipeline RAG sur Azure OpenAI et ChromaDB, en comparant les stratégies à chaque étape : découpage (par caractères, sémantique, agentique par LLM), recherche (similarité, seuil de score, MMR, multi-query) et fusion des classements (Reciprocal Rank Fusion). Inclut une génération conversationnelle tenant compte de l'historique et un RAG multimodal (Unstructured, Google Cloud Vision).",
    summary: "Pipeline RAG sur Azure OpenAI et ChromaDB qui compare les stratégies à chaque étape : chunking (caractères, sémantique, agentique), retrieval (seuil de score, MMR, multi-query) et fusion des classements (RRF), plus un RAG multimodal.",
    category: 'IA Générative & RAG',
    status: 'Projet académique',
  },
  bookpipeline: {
    title: "Pipeline automatisé d'ingestion et de traitement de livres",
    description: 'Pipeline orchestré par Apache Airflow (CeleryExecutor, Redis, PostgreSQL, Docker Compose) qui découvre et analyse des livres PDF/EPUB, puis appelle un service ML Flask : résumés à plusieurs niveaux et plus de 20 questions-réponses par livre (FLAN-T5), traduction en français et en arabe (NLLB-200) et synthèse vocale (Coqui TTS, gTTS). Le dynamic task mapping traite chaque livre en parallèle.',
    summary: "Pipeline Apache Airflow (CeleryExecutor, Redis, PostgreSQL, Docker Compose) qui découvre et analyse des livres PDF/EPUB, les traite en parallèle (dynamic task mapping) et appelle un service ML : résumés, questions-réponses, traduction et synthèse vocale.",
    category: 'Data Engineering & GenAI',
    status: 'Projet académique',
  },
  dental: {
    title: 'Détection de pathologies dentaires — MLOps',
    description: 'Détecteur YOLOv8 de 7 catégories de pathologies dentaires (remappées depuis 14 classes) sur radiographies panoramiques, évalué sur un jeu de validation, de test et un jeu externe. Pipeline MLOps complet : données versionnées avec DVC, expériences suivies dans MLflow, registre de modèles (champion/candidat), API FastAPI conteneurisée et interface React. CI/CD GitHub Actions avec tests pytest et déploiement sur Azure Container Apps et Vercel.',
    summary: "Détecteur YOLOv8 de 7 catégories de pathologies dentaires sur radiographies panoramiques, industrialisé : données versionnées (DVC), suivi d'expériences et registre de modèles (MLflow), API FastAPI conteneurisée, CI/CD et déploiement continu sur Azure.",
    metric: "Précision 86 % · 1 808 radiographies",
    category: 'Computer Vision & MLOps',
    status: 'Déployé en continu',
  },
  pointfed: {
    title: 'PointFed3D — Apprentissage fédéré sur nuages de points 3D',
    description: "Classification de nuages de points 3D (ShapeNet via CAP3D, 50 classes) avec le réseau de graphes FeaStNet, en comparant cinq stratégies : entraînement centralisé (82,5 % d'accuracy), FedAvg codé à la main sur 4 clients en IID (79,8 %) et non-IID, fédération verticale (géométrie et couleur détenues par deux entités, sans partage de données brutes) et distillation vers un élève 7,7× plus léger (+5,5 points par rapport au même élève sans distillation).",
    category: 'Federated Learning & 3D',
    status: 'Projet académique',
  },
  misinformation: {
    title: 'Détection de désinformation médicale en arabe',
    description: "Fine-tuning d'AraBERT (bert-base-arabertv02) sur ArCOV19-Rumors pour détecter la désinformation médicale dans des tweets arabes : normalisation du texte arabe, déduplication, seuil de décision optimisé, analyse d'erreurs et comparaison à une baseline TF-IDF — 87 % d'accuracy et 0,87 de F1 macro sur le jeu de test.",
    summary: "Fine-tuning d'AraBERT sur ArCOV19-Rumors pour détecter la désinformation médicale dans des tweets arabes : normalisation, déduplication, seuil de décision optimisé, analyse d'erreurs et comparaison à une baseline TF-IDF.",
    metric: "87 % d'accuracy · F1 macro 0,87",
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
    description: "Pipeline de machine learning de bout en bout conçu pendant mon stage chez AKWA Group, suivant la méthode CRISP-DM, pour détecter les transactions présentes dans Afriware mais absentes de l'ERP JDE. Comparaison de modèles supervisés (régression logistique, SVM, arbre de décision, Random Forest, KNN) et non supervisés (Isolation Forest, autoencodeur) — Random Forest retenu, atteignant 98 % d'accuracy et un F1-score de 85 %, appliqué sur plus de 6 millions d'enregistrements SQL.",
    summary: "Pipeline ML de bout en bout (CRISP-DM) qui détecte les transactions présentes dans Afriware mais absentes de l'ERP JDE, sur plus de 6 millions d'enregistrements SQL. Cinq modèles supervisés et deux non supervisés comparés avant de retenir un Random Forest.",
    role: "Stagiaire ML & Data Engineer — équipe Data",
    metric: "98 % d'accuracy · F1 85 %",
    category: 'Data & Machine Learning',
    status: 'Stage — AKWA Group',
  },
  speaker: {
    title: 'Reconnaissance de locuteur sur canal radio dégradé',
    description: "Identification de locuteur robuste pour des communications radio de police : simulation d'un canal P25 (filtrage passe-bande, bruit contrôlé par SNR, compression dynamique) sur des voix VoxCeleb, augmentation par SNR, extraction de features MFCC, deltas et spectrales, classification SVM (noyau RBF, grid search) — 86,98 % de précision sur 50 agents — et interface Streamlit d'identification en temps réel.",
    category: 'Signal Processing & ML',
    status: 'Projet personnel',
  },
  motoscraper: {
    title: 'Web Scraping & Analyse — Import de motos rentables',
    description: "Outil Python qui scrape les annonces de motos d'occasion en Europe (LeParking) et au Maroc (Avito) avec Selenium, interroge l'API de la douane marocaine pour obtenir la valeur taxable, calcule la marge d'importation de chaque annonce et visualise la distribution des marges par modèle en chandeliers.",
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
    summary: "LangGraph agent that checks a CV against a job offer skill by skill: hybrid RAG (BM25 + embeddings, RRF), citations verified word for word, score computed in code and human validation — never inventing experience.",
    metric: "125 pytest tests · GitHub Actions CI",
    category: 'Agentic AI & RAG',
    status: 'Live demo',
  },
  ragchatbot: {
    title: 'RAG Strategies: Chunking, Retrieval & Ranking',
    description: 'Step-by-step implementation of a RAG pipeline on Azure OpenAI and ChromaDB, comparing strategies at every stage: chunking (character-based, semantic, LLM-driven agentic), retrieval (similarity, score threshold, MMR, multi-query) and rank fusion (Reciprocal Rank Fusion). Includes history-aware conversational generation and multimodal RAG (Unstructured, Google Cloud Vision).',
    summary: "RAG pipeline on Azure OpenAI and ChromaDB comparing strategies at every stage: chunking (character, semantic, agentic), retrieval (score threshold, MMR, multi-query) and rank fusion (RRF), plus multimodal RAG.",
    category: 'Generative AI & RAG',
    status: 'Academic project',
  },
  bookpipeline: {
    title: 'Automated Book Ingestion & Processing Pipeline',
    description: 'Apache Airflow pipeline (CeleryExecutor, Redis, PostgreSQL, Docker Compose) that discovers and parses PDF/EPUB books, then calls a Flask ML service: multi-level summaries and 20+ question-answer pairs per book (FLAN-T5), French and Arabic translation (NLLB-200) and text-to-speech (Coqui TTS, gTTS). Dynamic task mapping processes every book in parallel.',
    summary: "Apache Airflow pipeline (CeleryExecutor, Redis, PostgreSQL, Docker Compose) that discovers and parses PDF/EPUB books, processes them in parallel (dynamic task mapping) and calls an ML service: summaries, Q&A, translation and text-to-speech.",
    category: 'Data Engineering & GenAI',
    status: 'Academic project',
  },
  dental: {
    title: 'Dental Pathology Detection — MLOps',
    description: 'YOLOv8 detector for 7 dental pathology categories (remapped from 14 classes) on panoramic radiographs, evaluated on validation, test and external splits. Full MLOps pipeline: data versioned with DVC, experiments tracked in MLflow, model registry (champion/candidate), containerized FastAPI service and React front end. GitHub Actions CI/CD with pytest and deployment to Azure Container Apps and Vercel.',
    summary: "YOLOv8 detector for 7 dental pathology categories on panoramic X-rays, industrialized: versioned data (DVC), experiment tracking and model registry (MLflow), containerized FastAPI service, CI/CD and continuous deployment on Azure.",
    metric: "86% precision · 1,808 X-rays",
    category: 'Computer Vision & MLOps',
    status: 'Continuously deployed',
  },
  pointfed: {
    title: 'PointFed3D — Federated Learning on 3D Point Clouds',
    description: '3D point cloud classification (ShapeNet via CAP3D, 50 classes) with the FeaStNet graph network, comparing five strategies: centralized training (82.5% accuracy), hand-written FedAvg over 4 clients with IID (79.8%) and non-IID data, vertical federation (geometry and color held by two parties, no raw data shared) and distillation into a 7.7× smaller student (+5.5 points over the same student without distillation).',
    category: 'Federated Learning & 3D',
    status: 'Academic project',
  },
  misinformation: {
    title: 'Arabic Medical Misinformation Detector',
    description: 'Fine-tuned AraBERT (bert-base-arabertv02) on ArCOV19-Rumors to detect medical misinformation in Arabic tweets: Arabic text normalization, deduplication, tuned decision threshold, error analysis and comparison with a TF-IDF baseline — 87% accuracy and 0.87 macro F1 on the test set.',
    summary: "AraBERT fine-tuned on ArCOV19-Rumors to detect medical misinformation in Arabic tweets: normalization, deduplication, tuned decision threshold, error analysis and comparison with a TF-IDF baseline.",
    metric: "87% accuracy · 0.87 macro F1",
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
    title: 'Intelligent Audit — Accounting Anomaly Detection',
    description: 'End-to-end machine learning pipeline built during my internship at AKWA Group, following CRISP-DM, to detect transactions present in Afriware but missing from the JDE ERP. Compared supervised models (logistic regression, SVM, decision tree, Random Forest, KNN) and unsupervised ones (Isolation Forest, autoencoder) — the selected Random Forest reached 98% accuracy and an 85% F1-score, applied across more than 6 million SQL records.',
    summary: "End-to-end ML pipeline (CRISP-DM) detecting transactions present in Afriware but missing from the JDE ERP, across more than 6 million SQL records. Five supervised and two unsupervised models compared before selecting a Random Forest.",
    role: "ML & Data Engineer Intern — Data team",
    metric: "98% accuracy · 85% F1",
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
    description: 'Python tool that scrapes used motorcycle listings in Europe (LeParking) and Morocco (Avito) with Selenium, queries the Moroccan customs API for the taxable value, computes the import margin of each listing and plots the margin distribution per model as candlesticks.',
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
    category: "Internship — Renault Digital",
    status: "Deployed internally",
    role: "AI Engineer Intern — Quality Engineering",
    metric: "85% of generations accepted without edits",
  },
}

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
    role: "Élève-ingénieur à l'ENSIAS — IA, Data Engineering & MLOps",
    headline: ['Trois profils.', 'Un seul', 'ingénieur.'],
    description: "Je conçois des solutions d'IA appliquées à des problèmes métier, de l'ingestion des données au déploiement : agents LLM, systèmes RAG, pipelines de données et machine learning.",
    credibility: 'Stages : Renault Digital (2026) · AKWA Group (2025)',
    availability: ['Stage PFE · 6 mois', 'Dès janvier 2027', 'France · mobilité nationale'],
    ctaProjects: 'Explorer mes projets',
    ctaCV: 'Télécharger mon CV',
    ctaContact: 'Me contacter',
    selectorLabel: 'Choisir un profil',
    statNumber: '03',
    statLabel: 'PROFILS À EXPLORER',
    statSub: 'Même socle technique',
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
      { value: '14', label: 'Projets réalisés' },
    ],
    location: 'Grenoble, France',
    secondLocation: 'Casablanca, Maroc',
  },
  skillsHeading: 'Compétences techniques',
  experienceHeading: 'Expérience professionnelle',
  projectsSection: {
    eyebrow: '03 / PREUVES',
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
    description: "Chaque profil a son propre CV, recadré sur les expériences et projets les plus pertinents.",
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
      location: 'Rabat, Maroc',
      details: "Apprentissage automatique et profond (réseaux de neurones, reinforcement learning), apprentissage statistique et probabiliste. Big Data et systèmes distribués, ingénierie des données, séries temporelles, traitement multimédia (texte, image).",
    },
    {
      degree: 'Classes Préparatoires aux Grandes Écoles (CPGE) — Mathématiques-Physique',
      school: 'CPGE Mohammed V',
      period: 'Septembre 2022 — Juin 2024',
      location: 'Casablanca, Maroc',
      details: "Mathématiques appliquées, sciences de l'ingénieur et programmation Python. Préparation aux concours des grandes écoles d'ingénieurs.",
    },
  ],
  languages: [
    { name: 'Français', level: 'Langue maternelle' },
    { name: 'Anglais', level: 'Bilingue' },
    { name: 'Arabe', level: 'Langue maternelle' },
    { name: 'Espagnol', level: 'B1' },
  ],
  softSkills: [
    { title: 'Organisation & Travail en équipe', description: 'Responsable logistique du Forum Club ENSIAS (rencontres entreprises–étudiants)' },
    { title: 'Autonomie & Résolution de problèmes', description: "Solution IA livrée en production sous contraintes d'accès et de confidentialité" },
  ],
  contact: {
    eyebrow: '04 / CONTACT',
    heading: ['Construisons', 'quelque chose.'],
    description: "Pipelines de données, systèmes d'IA générative ou modèles de machine learning — si le problème est réel, je veux en discuter.",
    availability: 'Disponible pour un stage de fin d\'études à partir de janvier 2027',
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
            "Agents IA & Génération de tests : conception et mise en production d'un système multi-agents LLM (Requirement Analyzer Agent, Test Design Agent) transformant des exigences en tickets Jira et scénarios Gherkin, avec validation humaine à chaque étape. POC sur Copilot Studio et Power Platform, puis reconstruction full-stack (FastAPI, React/TypeScript). Plus de 100 tickets Jira et 50 scénarios Gherkin générés, rédaction passée de 10–20 min à 1–2 min par exigence, adopté par une équipe QA de 6 personnes.",
            "RAG & Ingestion documentaire : mise en place sur l'API Microsoft Copilot d'un RAG (similarité cosinus, top-5) alimenté par une chaîne d'ingestion de plus de 400 PDF : OCR des tableaux et images (unstructured.io), découpage par structure de document et retrieval MMR sur pgvector. Masquage DLP (Presidio, spaCy) avant chaque appel LLM.",
            "Évaluation & monitoring : génération en JSON validé par schémas Pydantic, puis rendu Gherkin déterministe contrôlé par le parseur officiel Cucumber. Calibration empirique du seuil de similarité (0,72) et tableau de bord qualité, avec 85% des générations acceptées sans modification.",
            "Automatisation QA : génération des fichiers Smoke/TNR sur SharePoint et reporting dans Teams (Power Automate), déployés en interne.",
          ],
        },
        {
          title: 'ML & Data Engineer — Équipe Data',
          company: 'AKWA Group',
          type: 'Stage',
          period: periods.akwa.fr,
          location: 'Casablanca, Maroc',
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
      cvFile: '/CV_Jad_Falaq_DataAI_FR.pdf',
      featuredIds: ['audit', 'renault', 'bookpipeline'],
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
            "Agents IA & Génération de tests : conception et mise en production d'un système multi-agents LLM (Requirement Analyzer Agent, Test Design Agent) transformant des exigences en tickets Jira et scénarios Gherkin, avec validation humaine à chaque étape (human-in-the-loop). POC sur Copilot Studio et Power Platform, puis reconstruction full-stack (FastAPI, React/TypeScript). Plus de 100 tickets Jira et 50 scénarios Gherkin générés, rédaction passée de 10–20 min à 1–2 min par exigence, adopté par une équipe QA de 6 personnes.",
            "RAG & Ingestion documentaire : mise en place sur l'API Microsoft Copilot d'un RAG (similarité cosinus, top-5) alimenté par une chaîne d'ingestion de plus de 400 PDF (Confluence, anciennes user stories et tickets Jira) : OCR des tableaux et images (unstructured.io), découpage par structure de document et retrieval MMR sur pgvector. Masquage DLP (Presidio, spaCy) avant chaque appel LLM.",
            "Évaluation & monitoring : génération en JSON validé par schémas Pydantic, puis rendu Gherkin déterministe contrôlé par le parseur officiel Cucumber, éliminant les erreurs de syntaxe du LLM. Calibration du seuil de similarité (0,72), optimisation de la consommation de tokens et tableau de bord qualité (85% des générations acceptées sans modification) ; 296 tests automatisés (pytest) et documentation technique des 9 modules.",
            "Automatisation QA : génération des fichiers Smoke/TNR et reporting Teams (Power Automate), formation de l'ingénieur à la reprise manuelle.",
          ],
        },
        {
          title: 'ML & Data Engineer — Équipe Data',
          company: 'AKWA Group',
          type: 'Stage',
          period: periods.akwa.fr,
          location: 'Casablanca, Maroc',
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
      cvFile: '/CV_Jad_Falaq_GenAI_FR.pdf',
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
            "Agents IA & Génération de tests : conception et mise en production d'un système multi-agents LLM (Requirement Analyzer Agent, Test Design Agent) transformant des exigences en tickets Jira et scénarios Gherkin, avec validation humaine à chaque étape. POC sur Copilot Studio et Power Platform, puis reconstruction full-stack (FastAPI, React/TypeScript). Plus de 100 tickets Jira et 50 scénarios Gherkin générés, rédaction passée de 10–20 min à 1–2 min par exigence, adopté par une équipe QA de 6 personnes.",
            "RAG & Ingestion documentaire : mise en place sur l'API Microsoft Copilot d'un RAG (similarité cosinus, top-5) alimenté par une chaîne d'ingestion de plus de 400 PDF : OCR des tableaux et images (unstructured.io), découpage par structure de document et retrieval MMR sur pgvector. Masquage DLP (Presidio, spaCy) avant chaque appel LLM.",
            "Évaluation & monitoring : génération en JSON validé par schémas Pydantic, puis rendu Gherkin déterministe contrôlé par le parseur officiel Cucumber. Calibration empirique du seuil de similarité (0,72) et tableau de bord qualité, avec 85% des générations acceptées sans modification.",
            "Automatisation QA : génération des fichiers Smoke/TNR sur SharePoint et reporting dans Teams (Power Automate), déployés en interne.",
          ],
        },
        {
          title: 'ML & Data Engineer — Équipe Data',
          company: 'AKWA Group',
          type: 'Stage',
          period: periods.akwa.fr,
          location: 'Casablanca, Maroc',
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
      cvFile: '/CV_Jad_Falaq_MLOps_FR.pdf',
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
    role: 'AI engineering student at ENSIAS — AI, Data Engineering & MLOps',
    headline: ['Three profiles.', 'One', 'engineer.'],
    description: 'I build AI solutions for real business problems, from data ingestion to deployment: LLM agents, RAG systems, data pipelines and machine learning.',
    credibility: 'Internships: Renault Digital (2026) · AKWA Group (2025)',
    availability: ['6-month final-year internship', 'From January 2027', 'France · open to relocation'],
    ctaProjects: 'Explore my projects',
    ctaCV: 'Download my CV',
    ctaContact: 'Contact me',
    selectorLabel: 'Choose a profile',
    statNumber: '03',
    statLabel: 'PROFILES TO EXPLORE',
    statSub: 'Same technical foundation',
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
      { value: '14', label: 'Delivered projects' },
    ],
    location: 'Grenoble, France',
    secondLocation: 'Casablanca, Morocco',
  },
  skillsHeading: 'Technical skills',
  experienceHeading: 'Professional experience',
  projectsSection: {
    eyebrow: '03 / PROOF',
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
    description: 'Each profile has its own CV, reframed around its most relevant experience and projects.',
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
      location: 'Rabat, Morocco',
      details: 'Machine & Deep Learning (neural networks, reinforcement learning), statistical and probabilistic learning. Big Data and distributed systems, data engineering, time series, multimedia processing (text, image).',
    },
    {
      degree: 'Preparatory Classes for the Grandes Écoles (CPGE) — Mathematics-Physics',
      school: 'CPGE Mohammed V',
      period: 'September 2022 — June 2024',
      location: 'Casablanca, Morocco',
      details: 'Applied mathematics, engineering sciences and Python programming. Preparation for competitive entrance exams to top engineering schools.',
    },
  ],
  languages: [
    { name: 'French', level: 'Native' },
    { name: 'English', level: 'Bilingual' },
    { name: 'Arabic', level: 'Native' },
    { name: 'Spanish', level: 'B1' },
  ],
  softSkills: [
    { title: 'Organization & Teamwork', description: 'Logistics lead of the ENSIAS Forum Club (company–student meetings)' },
    { title: 'Autonomy & Problem Solving', description: 'Delivered an AI solution to production under access and confidentiality constraints' },
  ],
  contact: {
    eyebrow: '04 / CONTACT',
    heading: ["Let's build", 'something real.'],
    description: "Data pipelines, generative AI systems or machine learning models — if the problem is real, I'd like to hear about it.",
    availability: 'Available for a final-year internship starting January 2027',
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
            'AI Agents & Test Generation: designed and deployed to production a multi-agent LLM system (Requirement Analyzer Agent, Test Design Agent) turning requirements into Jira tickets and Gherkin scenarios, with human validation at each step. POC on Copilot Studio and Power Platform, then full-stack rebuild (FastAPI, React/TypeScript). 100+ Jira tickets and 50 Gherkin scenarios generated, writing time cut from 10–20 min to 1–2 min per requirement, adopted by a 6-person QA team.',
            'RAG & Document Ingestion: built a RAG on the Microsoft Copilot API (cosine similarity, top-5) fed by an ingestion pipeline of 400+ PDFs: OCR of tables and images (unstructured.io), document-structure chunking and MMR retrieval on pgvector. DLP masking (Presidio, spaCy) before every LLM call.',
            'Evaluation & Monitoring: JSON generation validated by Pydantic schemas, then deterministic Gherkin rendering checked by the official Cucumber parser. Similarity threshold calibration (0.72) and quality dashboard, with 85% of generations accepted without edits.',
            'QA Automation: generation of Smoke/regression test files on SharePoint and Teams reporting (Power Automate), deployed internally.',
          ],
        },
        {
          title: 'ML & Data Engineer — Data Team',
          company: 'AKWA Group',
          type: 'Internship',
          period: periods.akwa.en,
          location: 'Casablanca, Morocco',
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
      cvFile: '/CV_Jad_Falaq_DataAI_EN.pdf',
      featuredIds: ['audit', 'renault', 'bookpipeline'],
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
            'AI Agents & Test Generation: designed and deployed to production a multi-agent LLM system (Requirement Analyzer Agent, Test Design Agent) turning requirements into Jira tickets and Gherkin scenarios, with human validation at each step (human-in-the-loop). POC on Copilot Studio and Power Platform, then full-stack rebuild (FastAPI, React/TypeScript). 100+ Jira tickets and 50 Gherkin scenarios generated, writing time cut from 10–20 min to 1–2 min per requirement, adopted by a 6-person QA team.',
            'RAG & Document Ingestion: built a RAG on the Microsoft Copilot API (cosine similarity, top-5) fed by an ingestion pipeline of 400+ PDFs (Confluence, past user stories and Jira tickets): OCR of tables and images (unstructured.io), document-structure chunking and MMR retrieval on pgvector. DLP masking (Presidio, spaCy) before every LLM call.',
            'Evaluation & Monitoring: JSON generation validated by Pydantic schemas, then deterministic Gherkin rendering checked by the official Cucumber parser, eliminating LLM syntax errors. Similarity threshold calibration (0.72), token usage optimization and quality dashboard (85% of generations accepted without edits); 296 automated tests (pytest) and technical documentation of the 9 modules.',
            'QA Automation: generation of Smoke/regression test files and Teams reporting (Power Automate); trained the engineer on the manual fallback.',
          ],
        },
        {
          title: 'ML & Data Engineer — Data Team',
          company: 'AKWA Group',
          type: 'Internship',
          period: periods.akwa.en,
          location: 'Casablanca, Morocco',
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
      cvFile: '/CV_Jad_Falaq_GenAI_EN.pdf',
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
            'AI Agents & Test Generation: designed and deployed to production a multi-agent LLM system (Requirement Analyzer Agent, Test Design Agent) turning requirements into Jira tickets and Gherkin scenarios, with human validation at each step. POC on Copilot Studio and Power Platform, then full-stack rebuild (FastAPI, React/TypeScript). 100+ Jira tickets and 50 Gherkin scenarios generated, writing time cut from 10–20 min to 1–2 min per requirement, adopted by a 6-person QA team.',
            'RAG & Document Ingestion: built a RAG on the Microsoft Copilot API (cosine similarity, top-5) fed by an ingestion pipeline of 400+ PDFs: OCR of tables and images (unstructured.io), document-structure chunking and MMR retrieval on pgvector. DLP masking (Presidio, spaCy) before every LLM call.',
            'Evaluation & Monitoring: JSON generation validated by Pydantic schemas, then deterministic Gherkin rendering checked by the official Cucumber parser. Similarity threshold calibration (0.72) and quality dashboard, with 85% of generations accepted without edits.',
            'QA Automation: generation of Smoke/regression test files on SharePoint and Teams reporting (Power Automate), deployed internally.',
          ],
        },
        {
          title: 'ML & Data Engineer — Data Team',
          company: 'AKWA Group',
          type: 'Internship',
          period: periods.akwa.en,
          location: 'Casablanca, Morocco',
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
      cvFile: '/CV_Jad_Falaq_MLOps_EN.pdf',
      featuredIds: ['dental', 'audit', 'misinformation'],
    },
  },
  projects: withMeta(projectsEn),
}

export const siteContent: Record<Language, SiteContent> = { fr, en }
export const contact = contactInfo
