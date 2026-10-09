import type { Language } from '../contexts/LanguageContext'
import type { ProfileId } from '../contexts/ProfileContext'

export interface Project {
  title: string
  description: string
  technologies: string[]
  github?: string
  image?: string
  category: string
  status: string
  year: string
}

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
  projectIds: string[]
  cvFile: string
}

export interface SiteContent {
  nav: {
    profiles: string
    projects: string
    cv: string
    contact: string
  }
  hero: {
    eyebrow: string
    headline: [string, string, string]
    description: string
    ctaProjects: string
    ctaCV: string
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
  }
  skillsHeading: string
  experienceHeading: string
  projectsSection: {
    eyebrow: string
    heading: [string, string]
    description: string
    viewAllLabel: string
    viewLessLabel: string
    codeLabel: string
    noLinkLabel: string
  }
  cv: {
    heading: string
    description: string
    downloadLabel: string
    contactHeading: string
    languagesHeading: string
    educationHeading: string
    certificationsHeading: string
    softSkillsHeading: string
  }
  education: EducationEntry[]
  languages: LanguageItem[]
  certifications: { title: string; place: string; date: string }[]
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
  phones: ['+33 7 45 50 31 19'],
  github: 'github.com/JadFalaq',
  githubUrl: 'https://github.com/JadFalaq',
  linkedin: 'linkedin.com/in/jadfalaq',
  linkedinUrl: 'https://www.linkedin.com/in/jadfalaq',
}

// ---------------------------------------------------------------------------
// Shared project library (keyed by id). Each profile references a curated
// subset via `projectIds`; the full set is reachable through "view all".
// ---------------------------------------------------------------------------

const projectsFr: Record<string, Project> = {
  ragchatbot: {
    title: 'Comparatif de stratégies RAG',
    description: "Chatbot RAG sur Azure OpenAI (gpt-4.1-mini, text-embedding-3-small) comparant plusieurs stratégies de retrieval — vectoriel, hybride, multi-query, reranking — en modes Simple et Agentic RAG, avec métriques de performance affichées pour chaque stratégie.",
    technologies: ['Azure OpenAI', 'ChromaDB', 'RAG', 'Multi-Query', 'RRF'],
    github: 'https://github.com/JadFalaq/Comparing-RAG-Strategies-Chunking-Retrieval-Ranking',
    category: 'IA Générative & RAG',
    status: 'Projet académique',
    year: '2026',
  },
  jobpilot: {
    title: 'JobPilot — Copilote de candidature IA',
    description: "Système multi-agents LangGraph avec état et mémoire : analyse une offre d'emploi au regard d'un CV, recherche l'entreprise, rédige une lettre de motivation argumentée et anticipe les questions d'entretien. Tracé et évalué en CI, déployé sur Azure.",
    technologies: ['LangGraph', 'LangChain', 'Azure OpenAI', 'ReAct', 'LangSmith'],
    github: 'https://github.com/JadFalaq/JobPilot-AI',
    category: 'Agents IA & Orchestration',
    status: 'Déployé sur Azure',
    year: '2026',
  },
  graphrag: {
    title: 'Matching candidats–offres sur graphe de connaissances',
    description: "Système de matching explicable entre candidats et offres d'emploi, construit sur un graphe de connaissances Neo4j : pondération des compétences en Cypher, retrieval sémantique et explications générées par LLM sur la compatibilité et les écarts.",
    technologies: ['Neo4j', 'Cypher', 'LangChain', 'FastAPI', 'Streamlit'],
    category: 'Knowledge Graphs & GraphRAG',
    status: 'Projet académique',
    year: '2026',
  },
  dental: {
    title: 'Détection de pathologies dentaires',
    description: "Modèle de détection d'objets (YOLOv8s) identifiant 7 catégories de pathologies dentaires sur 1 808 radiographies panoramiques (24 888 annotations), avec un rappel priorisé pour l'usage clinique. Industrialisé en service API conteneurisé avec pipeline MLOps complet (DVC, MLflow) et CI/CD, déployé en continu sur Railway et Vercel.",
    technologies: ['YOLOv8', 'MLOps', 'DVC', 'MLflow', 'Docker', 'CI/CD'],
    github: 'https://github.com/JadFalaq/detection_dentaire_mlops',
    image: '/Dantal pathologie.png',
    category: 'Computer Vision & MLOps',
    status: 'Déployé en continu',
    year: '2025',
  },
  misinformation: {
    title: 'Détection de désinformation médicale en arabe',
    description: "Fine-tuning d'AraBERT sur le sous-ensemble ArCOV19-Rumors pour détecter la désinformation médicale dans des tweets arabes, avec déduplication, pondération de la perte, arrêt anticipé et seuil optimisé — 87% d'accuracy et 0,87 de F1 macro.",
    technologies: ['AraBERT', 'Hugging Face', 'NLP', 'PyTorch'],
    github: 'https://github.com/JadFalaq/misinformation_covid_detector_arabic',
    image: '/miss_info_detection.png',
    category: 'NLP & Fine-tuning',
    status: 'Projet personnel',
    year: '2026',
  },
  shoplifting: {
    title: "Détection de vol à l'étalage",
    description: 'Système de détection en temps réel de comportements suspects sur vidéos de surveillance (précision ≈ 80%). Pipeline combinant YOLO (détection), DeepSORT (tracking), MediaPipe Pose (33 landmarks) et un modèle LSTM pour l\'analyse comportementale temporelle.',
    technologies: ['YOLO', 'DeepSORT', 'MediaPipe', 'LSTM'],
    github: 'https://github.com/JadFalaq/AmnAI_Vlast',
    image: '/AmnAI.png',
    category: 'Computer Vision',
    status: 'Projet personnel',
    year: '2025',
  },
  audit: {
    title: "Audit Intelligent — Détection d'anomalies comptables",
    description: "Pipeline de machine learning de bout en bout conçu pendant mon stage chez AKWA Group pour détecter et classifier les transactions manquantes. Comparaison de 5 modèles — Random Forest atteignant 98% de précision et un F1-score de 85%, appliqué sur plus de 6 millions d'enregistrements SQL avec intégration ERP automatisée.",
    technologies: ['Scikit-learn', 'Random Forest', 'SVM', 'Feature Engineering'],
    github: 'https://github.com/JadFalaq/Audit-Intelligent',
    image: '/anomalies detection.png',
    category: 'Data & Machine Learning',
    status: 'Stage — AKWA Group',
    year: '2025',
  },
  speaker: {
    title: 'Reconnaissance de locuteur sur canal radio dégradé',
    description: "Système d'identification de locuteur robuste en environnement radio dégradé (SNR 10-15 dB), atteignant 86,98% de précision sur 50 agents. Extraction de caractéristiques MFCC et spectrales (140 features), classification par SVM (noyau RBF) avec interface Streamlit temps réel.",
    technologies: ['SVM', 'MFCC', 'Streamlit'],
    github: 'https://github.com/JadFalaq/Detection_de_locuteur_dans_les_stations_radio',
    image: '/detection de locateur.png',
    category: 'Signal Processing & ML',
    status: 'Projet personnel',
    year: '2025',
  },
  irrigation: {
    title: "Système d'irrigation intelligent",
    description: "Plateforme de gestion d'irrigation à distance (application Flutter, Firebase, architecture IoT ESP32/Arduino). Modèle de machine learning prédisant la durée et le moment optimal d'arrosage à partir de données historiques (humidité du sol, température).",
    technologies: ['Flutter', 'Firebase', 'ESP32', 'Arduino'],
    github: 'https://github.com/JadFalaq/Smart_Irrigation_System',
    image: '/Samrt farm.png',
    category: 'IoT & Machine Learning',
    status: 'Projet personnel',
    year: '2025',
  },
  motoscraper: {
    title: 'Web Scraping & Analyse — Import de motos rentables',
    description: "Outil de web scraping en Python collectant les annonces de motos d'occasion en Europe, estimant les coûts d'importation vers le Maroc (achat, transport, taxes) et identifiant les modèles les plus rentables à revendre.",
    technologies: ['Python', 'Web Scraping', 'Pandas'],
    github: 'https://github.com/JadFalaq/Profitable_Motorcycle_Import_Scraper',
    image: '/motorcycle profit.png',
    category: 'Data Engineering',
    status: 'Projet personnel',
    year: '2024',
  },
  freinage: {
    title: 'Système de freinage automatique pour le wheeling',
    description: "Système embarqué déclenchant automatiquement le frein en cas de déséquilibre de la moto. Projet technique combinant électronique embarquée, détection en temps réel et programmation, réalisé dans le cadre du TIPE en classe préparatoire.",
    technologies: ['Python', 'Électronique embarquée', 'Capteurs'],
    image: '/projet2.png',
    category: 'Systèmes embarqués',
    status: 'Projet académique (TIPE)',
    year: '2023',
  },
}

const projectsEn: Record<string, Project> = {
  ragchatbot: {
    title: 'Comparing RAG Strategies',
    description: 'RAG chatbot on Azure OpenAI (gpt-4.1-mini, text-embedding-3-small) comparing several retrieval strategies — vector, hybrid, multi-query, reranking — in Simple and Agentic RAG modes, with performance metrics displayed for each strategy.',
    technologies: ['Azure OpenAI', 'ChromaDB', 'RAG', 'Multi-Query', 'RRF'],
    github: 'https://github.com/JadFalaq/Comparing-RAG-Strategies-Chunking-Retrieval-Ranking',
    category: 'Generative AI & RAG',
    status: 'Academic project',
    year: '2026',
  },
  jobpilot: {
    title: 'JobPilot — AI Application Copilot',
    description: 'A stateful, multi-agent LangGraph system that analyzes a job offer against a CV, researches the company, writes a grounded cover letter and predicts interview questions. Traced and evaluated in CI, deployed on Azure.',
    technologies: ['LangGraph', 'LangChain', 'Azure OpenAI', 'ReAct', 'LangSmith'],
    github: 'https://github.com/JadFalaq/JobPilot-AI',
    category: 'AI Agents & Orchestration',
    status: 'Deployed on Azure',
    year: '2026',
  },
  graphrag: {
    title: 'Candidate–Offer Matching on a Knowledge Graph',
    description: 'Explainable candidate-to-job matching system built on a Neo4j knowledge graph: skill weighting in Cypher, semantic retrieval and LLM-generated explanations of fit and gaps.',
    technologies: ['Neo4j', 'Cypher', 'LangChain', 'FastAPI', 'Streamlit'],
    category: 'Knowledge Graphs & GraphRAG',
    status: 'Academic project',
    year: '2026',
  },
  dental: {
    title: 'Dental Pathology Detection',
    description: 'Object detection model (YOLOv8s) identifying 7 categories of dental pathologies across 1,808 panoramic radiographs (24,888 annotations), prioritizing recall for clinical use. Industrialized into a containerized API service with a complete MLOps pipeline (DVC, MLflow) and CI/CD, continuously deployed on Railway and Vercel.',
    technologies: ['YOLOv8', 'MLOps', 'DVC', 'MLflow', 'Docker', 'CI/CD'],
    github: 'https://github.com/JadFalaq/detection_dentaire_mlops',
    image: '/Dantal pathologie.png',
    category: 'Computer Vision & MLOps',
    status: 'Continuously deployed',
    year: '2025',
  },
  misinformation: {
    title: 'Arabic Medical Misinformation Detector',
    description: 'Fine-tuned AraBERT on the ArCOV19-Rumors subset to detect medical misinformation in Arabic tweets, with deduplication, weighted loss, early stopping and threshold tuning — 87% accuracy and 0.87 macro F1.',
    technologies: ['AraBERT', 'Hugging Face', 'NLP', 'PyTorch'],
    github: 'https://github.com/JadFalaq/misinformation_covid_detector_arabic',
    image: '/miss_info_detection.png',
    category: 'NLP & Fine-tuning',
    status: 'Personal project',
    year: '2026',
  },
  shoplifting: {
    title: 'Shoplifting Detection',
    description: 'Real-time detection system for suspicious behavior in surveillance videos (≈80% accuracy). Pipeline combining YOLO (detection), DeepSORT (tracking), MediaPipe Pose (33 landmarks) and an LSTM model for temporal behavior analysis.',
    technologies: ['YOLO', 'DeepSORT', 'MediaPipe', 'LSTM'],
    github: 'https://github.com/JadFalaq/AmnAI_Vlast',
    image: '/AmnAI.png',
    category: 'Computer Vision',
    status: 'Personal project',
    year: '2025',
  },
  audit: {
    title: 'Intelligent Audit — Accounting Anomaly Detection',
    description: 'End-to-end machine learning pipeline built during my internship at AKWA Group to detect and classify missing transactions. Compared 5 models — Random Forest reaching 98% accuracy and an 85% F1-score — applied across more than 6 million SQL records with automated ERP integration.',
    technologies: ['Scikit-learn', 'Random Forest', 'SVM', 'Feature Engineering'],
    github: 'https://github.com/JadFalaq/Audit-Intelligent',
    image: '/anomalies detection.png',
    category: 'Data & Machine Learning',
    status: 'Internship — AKWA Group',
    year: '2025',
  },
  speaker: {
    title: 'Speaker Recognition on a Degraded Radio Channel',
    description: 'Robust speaker identification system for degraded radio environments (SNR 10-15 dB), achieving 86.98% accuracy across 50 speakers. MFCC and spectral feature extraction (140 features); SVM classification (RBF kernel) with a real-time Streamlit interface.',
    technologies: ['SVM', 'MFCC', 'Streamlit'],
    github: 'https://github.com/JadFalaq/Detection_de_locuteur_dans_les_stations_radio',
    image: '/detection de locateur.png',
    category: 'Signal Processing & ML',
    status: 'Personal project',
    year: '2025',
  },
  irrigation: {
    title: 'Smart Irrigation System',
    description: 'Remote irrigation management platform (Flutter application, Firebase, ESP32/Arduino IoT architecture). Machine learning model predicting optimal watering duration and timing from historical data (soil moisture, temperature).',
    technologies: ['Flutter', 'Firebase', 'ESP32', 'Arduino'],
    github: 'https://github.com/JadFalaq/Smart_Irrigation_System',
    image: '/Samrt farm.png',
    category: 'IoT & Machine Learning',
    status: 'Personal project',
    year: '2025',
  },
  motoscraper: {
    title: 'Web Scraping & Analysis — Profitable Motorcycle Import',
    description: 'Python web scraping tool collecting used motorcycle listings across Europe, estimating import costs to Morocco (purchase, shipping, taxes), and identifying the most profitable models to resell.',
    technologies: ['Python', 'Web Scraping', 'Pandas'],
    github: 'https://github.com/JadFalaq/Profitable_Motorcycle_Import_Scraper',
    image: '/motorcycle profit.png',
    category: 'Data Engineering',
    status: 'Personal project',
    year: '2024',
  },
  freinage: {
    title: 'Automatic Braking System for Wheeling',
    description: 'Embedded system automatically triggering the brake when the motorcycle loses balance. Technical project combining embedded electronics, real-time detection and programming, carried out as part of the TIPE research project during preparatory classes.',
    technologies: ['Python', 'Embedded Electronics', 'Sensors'],
    image: '/projet2.png',
    category: 'Embedded Systems',
    status: 'Academic project (TIPE)',
    year: '2023',
  },
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
  },
  hero: {
    eyebrow: 'JAD FALAQ / PROMOTION ENSIAS 2027',
    headline: ['Trois profils.', 'Un seul', 'ingénieur.'],
    description: "Étudiant ingénieur en IA à l'ENSIAS, je conçois des pipelines de données, des systèmes d'IA générative et des modèles de machine learning — et je les mets en production. À la recherche d'un stage de fin d'études de 6 mois à partir de janvier 2027.",
    ctaProjects: 'Voir les projets',
    ctaCV: 'Voir mon CV',
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
      { value: '11', label: 'Projets réalisés' },
    ],
    location: 'Grenoble, France',
  },
  skillsHeading: 'Compétences techniques',
  experienceHeading: 'Expérience professionnelle',
  projectsSection: {
    eyebrow: '03 / PREUVES',
    heading: ['Projets', 'sélectionnés.'],
    description: 'Les projets les plus pertinents pour ce profil. Le reste est à un clic.',
    viewAllLabel: 'Voir tous les projets',
    viewLessLabel: 'Revenir à la sélection',
    codeLabel: 'Code',
    noLinkLabel: 'Dépôt privé',
  },
  cv: {
    heading: 'Curriculum Vitae',
    description: "Chaque profil a son propre CV, recadré sur les expériences et projets les plus pertinents.",
    downloadLabel: 'Télécharger le CV',
    contactHeading: 'Contact',
    languagesHeading: 'Langues',
    educationHeading: 'Formation',
    certificationsHeading: 'Certifications & Événements',
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
  certifications: [
    { title: 'ASEAI 2026 — African Fall School on Software Engineering & AI', place: 'ENSIAS, Rabat', date: 'Septembre 2026' },
    { title: 'NVIDIA DLI Workshop — Rapid Application Development with LLMs', place: 'hessian.AI (en ligne)', date: 'Novembre 2025' },
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
          period: 'Juin 2026 — Août 2026',
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
          period: 'Juin 2025 — Septembre 2025',
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
      projectIds: ['ragchatbot', 'graphrag', 'dental', 'audit', 'irrigation'],
      cvFile: '/CV_Jad_Falaq_DataAI_FR.pdf',
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
          period: 'Juin 2026 — Août 2026',
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
          period: 'Juin 2025 — Septembre 2025',
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
      projectIds: ['ragchatbot', 'jobpilot', 'misinformation', 'dental'],
      cvFile: '/CV_Jad_Falaq_GenAI_FR.pdf',
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
          period: 'Juin 2026 — Août 2026',
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
          period: 'Juin 2025 — Septembre 2025',
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
      projectIds: ['dental', 'shoplifting', 'misinformation', 'jobpilot'],
      cvFile: '/CV_Jad_Falaq_MLOps_FR.pdf',
    },
  },
  projects: projectsFr,
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
  },
  hero: {
    eyebrow: 'JAD FALAQ / ENSIAS CLASS OF 2027',
    headline: ['Three profiles.', 'One', 'engineer.'],
    description: "I'm an AI engineering student at ENSIAS. I build data pipelines, generative AI systems and machine learning models — and ship them to production. Looking for a 6-month final-year internship starting January 2027.",
    ctaProjects: 'View projects',
    ctaCV: 'View my CV',
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
      { value: '11', label: 'Delivered projects' },
    ],
    location: 'Grenoble, France',
  },
  skillsHeading: 'Technical skills',
  experienceHeading: 'Professional experience',
  projectsSection: {
    eyebrow: '03 / PROOF',
    heading: ['Selected', 'projects.'],
    description: 'The projects most relevant to this profile. Everything else is one click away.',
    viewAllLabel: 'View all projects',
    viewLessLabel: 'Back to selection',
    codeLabel: 'Code',
    noLinkLabel: 'Private repository',
  },
  cv: {
    heading: 'Curriculum Vitae',
    description: 'Each profile has its own CV, reframed around its most relevant experience and projects.',
    downloadLabel: 'Download CV',
    contactHeading: 'Contact',
    languagesHeading: 'Languages',
    educationHeading: 'Education',
    certificationsHeading: 'Certifications & Events',
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
  certifications: [
    { title: 'ASEAI 2026 — African Fall School on Software Engineering & AI', place: 'ENSIAS, Rabat', date: 'September 2026' },
    { title: 'NVIDIA DLI Workshop — Rapid Application Development with LLMs', place: 'hessian.AI (online)', date: 'November 2025' },
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
          period: 'Jun. 2026 — Aug. 2026',
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
          period: 'Jun. 2025 — Sep. 2025',
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
      projectIds: ['ragchatbot', 'graphrag', 'dental', 'audit', 'irrigation'],
      cvFile: '/CV_Jad_Falaq_DataAI_EN.pdf',
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
          period: 'Jun. 2026 — Aug. 2026',
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
          period: 'Jun. 2025 — Sep. 2025',
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
      projectIds: ['ragchatbot', 'jobpilot', 'misinformation', 'dental'],
      cvFile: '/CV_Jad_Falaq_GenAI_EN.pdf',
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
          period: 'Jun. 2026 — Aug. 2026',
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
          period: 'Jun. 2025 — Sep. 2025',
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
      projectIds: ['dental', 'shoplifting', 'misinformation', 'jobpilot'],
      cvFile: '/CV_Jad_Falaq_MLOps_EN.pdf',
    },
  },
  projects: projectsEn,
}

export const siteContent: Record<Language, SiteContent> = { fr, en }
export const contact = contactInfo
