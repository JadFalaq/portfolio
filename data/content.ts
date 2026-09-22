import type { Language } from '../contexts/LanguageContext'

export interface Project {
  title: string
  description: string
  technologies: string[]
  github?: string
  image?: string
}

export interface ExperienceEntry {
  title: string
  company: string
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

export interface SiteContent {
  nav: {
    hero: string
    about: string
    skills: string
    experience: string
    projects: string
    cv: string
    contact: string
  }
  hero: {
    role: string
    tagline: string
    ctaWork: string
    ctaCV: string
  }
  about: {
    heading: string
    paragraph1: string
    paragraph2: string
    locationLabel: string
    badgeLabel: string
    stats: {
      accuracy: string
      models: string
      datasets: string
    }
  }
  skillsHeading: string
  skills: { name: string; level: number }[]
  skillGroupsHeading: string
  experienceHeading: string
  projectsHeading: string
  projects: Project[]
  experiencePro: ExperienceEntry[]
  education: EducationEntry[]
  cv: {
    heading: string
    downloadLabel: string
    contactHeading: string
    languagesHeading: string
    technicalSkillsHeading: string
    experienceProHeading: string
    projectsHeading: string
    educationHeading: string
    languages: LanguageItem[]
    skillGroups: SkillGroup[]
  }
  contact: {
    heading: string
    subheading: string
    paragraph: string
    location: string
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
}

const contactInfo = {
  email: 'jadfalaq@gmail.com',
  phones: ['+212 6 05 98 23 57', '+33 7 45 50 31 19'],
  github: 'github.com/JadFalaq',
  githubUrl: 'https://github.com/JadFalaq',
  linkedin: 'linkedin.com/in/jadfalaq',
  linkedinUrl: 'https://linkedin.com/in/jadfalaq',
}

const fr: SiteContent = {
  nav: {
    hero: 'Accueil',
    about: 'À propos',
    skills: 'Compétences',
    experience: 'Expérience',
    projects: 'Projets',
    cv: 'CV',
    contact: 'Contact',
  },
  hero: {
    role: 'AI Engineer | Data Science | ML | Computer Vision',
    tagline: "Concevoir des systèmes d'IA qui quittent le notebook pour répondre, de façon fiable, à des besoins réels.",
    ctaWork: 'Voir mes projets',
    ctaCV: 'Voir mon CV',
  },
  about: {
    heading: 'À propos de moi',
    paragraph1: "Étudiant ingénieur en dernière année à l'ENSIAS, filière Ingénierie en Intelligence Artificielle (2IA), diplôme attendu en juin 2027. Convaincu qu'un système d'intelligence artificielle ne prend son sens que lorsqu'il quitte le notebook pour répondre, de façon fiable, à un besoin réel.",
    paragraph2: "À la recherche d'un stage de fin d'études (PFE) en AI Engineering à partir de janvier 2027. Formé par des projets concrets — de la détection d'anomalies à grande échelle chez AKWA Group à la conception d'un système multi-agents IA en production chez Renault Digital Maroc.",
    locationLabel: 'Basé à Casablanca, Maroc',
    badgeLabel: 'Étudiant Ingénieur IA @ ENSIAS',
    stats: {
      accuracy: 'Précision du modèle',
      models: 'Modèles IA développés',
      datasets: 'Datasets traités',
    },
  },
  skillsHeading: 'Compétences & Expertise',
  skills: [
    { name: 'Machine Learning', level: 95 },
    { name: 'Deep Learning (PyTorch)', level: 90 },
    { name: 'Computer Vision (YOLO, DeepSORT)', level: 90 },
    { name: 'MLOps (Docker, CI/CD, MLflow)', level: 85 },
    { name: 'NLP & LLM (RAG, LangChain)', level: 82 },
    { name: 'Python', level: 95 },
    { name: 'Traitement du signal', level: 85 },
    { name: 'SQL & Data Engineering', level: 85 },
  ],
  skillGroupsHeading: 'Boîte à outils',
  experienceHeading: 'Expérience Professionnelle',
  projectsHeading: 'Projets Phares',
  projects: [
    {
      title: 'Détection de pathologies dentaires (MLOps)',
      description: "Modèle de détection d'objets (YOLOv8s) identifiant 7 catégories de pathologies dentaires sur 1 808 radiographies panoramiques (24 888 annotations), avec un rappel priorisé pour l'usage clinique (précision 86%, rappel 47%, mAP50 42%). Industrialisé en service API conteneurisé avec un pipeline MLOps complet (DVC, MLflow) et CI/CD, déployé en continu sur Railway et Vercel.",
      technologies: ['YOLOv8', 'MLOps', 'DVC', 'MLflow', 'CI/CD', 'Docker'],
      github: 'https://github.com/JadFalaq/detection_dentaire_mlops',
      image: '/Dantal pathologie.png',
    },
    {
      title: 'Détection de vol à l\'étalage (Computer Vision)',
      description: 'Système de détection en temps réel de comportements suspects sur vidéos de surveillance (précision ≈ 80%). Pipeline combinant YOLO (détection), DeepSORT (tracking), MediaPipe Pose (33 landmarks) et un modèle LSTM pour l\'analyse comportementale temporelle.',
      technologies: ['YOLO', 'DeepSORT', 'MediaPipe', 'LSTM', 'Computer Vision'],
      github: 'https://github.com/JadFalaq/AmnAI_Vlast',
      image: '/AmnAI.png',
    },
    {
      title: 'Reconnaissance de locuteur (Signal Processing & ML)',
      description: "Système d'identification de locuteur robuste en environnement radio dégradé (SNR 10-15 dB), atteignant 86,98% de précision sur 50 agents. Extraction de caractéristiques MFCC et spectrales (140 features), classification par SVM (noyau RBF) avec interface Streamlit temps réel.",
      technologies: ['SVM', 'MFCC', 'Traitement du signal', 'Streamlit'],
      github: 'https://github.com/JadFalaq/Reconnaissance_locuteur_canal_radio',
      image: '/detection de locateur.png',
    },
    {
      title: "Système d'irrigation intelligent (IoT & Machine Learning)",
      description: "Plateforme de gestion d'irrigation à distance (application Flutter, Firebase, architecture IoT ESP32/Arduino). Modèle de machine learning prédisant la durée et le moment optimal d'arrosage à partir de données historiques (humidité du sol, température), en aide à la décision pour l'agriculteur.",
      technologies: ['Flutter', 'Firebase', 'ESP32', 'Arduino', 'Machine Learning'],
      github: 'https://github.com/JadFalaq/Smart_Irrigation_System',
      image: '/Samrt farm.png',
    },
    {
      title: 'Détection de désinformation médicale en arabe (NLP)',
      description: "Fine-tuning d'AraBERT (aubmindlab/bert-base-arabertv02) sur le sous-ensemble ArCOV19-Rumors pour détecter si un tweet arabe contient de la désinformation médicale ou une information fiable. Pipeline complet : normalisation du texte arabe, entraînement avec splits stratifiés, évaluation (matrice de confusion, courbes de perte) et prédiction en ligne de commande.",
      technologies: ['AraBERT', 'Hugging Face', 'NLP', 'PyTorch', 'Python'],
      github: 'https://github.com/JadFalaq/misinformation_covid_detector_arabic',
      image: '/miss_info_detection.png',
    },
    {
      title: "Audit Intelligent - Détection d'anomalies comptables",
      description: "Pipeline de machine learning de bout en bout conçu pendant mon stage chez AKWA Group pour détecter et classifier les transactions manquantes. Comparaison de 5 modèles (Random Forest, SVM, Decision Tree, KNN, Régression Logistique) — Random Forest atteignant 98% de précision et un F1-score de 85%, appliqué sur plus de 6 millions d'enregistrements.",
      technologies: ['Python', 'Scikit-learn', 'Random Forest', 'SVM', 'Feature Engineering'],
      github: 'https://github.com/JadFalaq/Audit-Intelligent',
      image: '/anomalies detection.png',
    },
    {
      title: 'Web Scraping & Analyse - Import de motos rentables',
      description: "Outil de web scraping en Python collectant les annonces de motos d'occasion en Europe, estimant les coûts d'importation vers le Maroc (achat, transport, taxes) et identifiant les modèles les plus rentables à revendre.",
      technologies: ['Python', 'Web Scraping', 'Pandas', 'Data Analysis'],
      github: 'https://github.com/JadFalaq/Profitable_Motorcycle_Import_Scraper',
      image: '/motorcycle profit.png',
    },
    {
      title: 'Système de freinage automatique pour le wheeling (TIPE)',
      description: "Système embarqué déclenchant automatiquement le frein en cas de déséquilibre de la moto. Projet technique combinant électronique embarquée, détection en temps réel et programmation, réalisé dans le cadre du TIPE en classe préparatoire.",
      technologies: ['Python', 'Électronique embarquée', 'Capteurs', 'Temps réel'],
      image: '/projet2.png',
    },
  ],
  experiencePro: [
    {
      title: 'Stagiaire Ingénieur IA – Équipe Quality Engineering',
      company: 'Renault Digital Maroc',
      period: 'Juin 2026 – Août 2026',
      location: 'Casablanca, Maroc',
      description: [
        "Conçu et développé un système multi-agents IA (3 agents) transformant des besoins métier en langage naturel en tickets Jira/GitLab, scénarios Gherkin et user stories, avec validation humaine à chaque étape.",
        "Implémenté un pipeline RAG (embeddings Ollama, similarité cosinus, calibration du seuil de pertinence) et une couche d'anonymisation des données (Presidio, spaCy) avec inférence LLM 100% locale pour la confidentialité.",
        "Automatisé (Copilot Studio / Power Automate) la génération hebdomadaire des fichiers de suivi sur SharePoint, avec gestion des erreurs et notifications Teams en temps réel — utilisée chaque semaine par l'équipe QA en production.",
      ],
      logo: '/rdm logo.jpg',
    },
    {
      title: 'Stagiaire Data / Machine Learning',
      company: 'AKWA Group',
      period: 'Juin 2025 – Septembre 2025',
      location: 'Casablanca, Maroc',
      description: [
        "Conçu un pipeline de machine learning de bout en bout pour détecter et classifier les transactions manquantes : prétraitement, ingénierie des variables, modélisation et évaluation.",
        "Comparé 5 modèles (Régression Logistique, SVM, Decision Tree, Random Forest, KNN) — Random Forest atteignant 98% de précision globale et un F1-score de 85% sur la détection des transactions manquantes.",
        "Collaboré avec l'équipe Data pour automatiser la détection et l'intégration ERP des transactions manquantes sur plus de 6 millions d'enregistrements.",
      ],
      logo: '/Akwa.jpg',
    },
  ],
  education: [
    {
      degree: "Diplôme d'Ingénieur - Intelligence Artificielle (2IA)",
      school: "ENSIAS - École Nationale Supérieure d'Informatique et d'Analyse des Systèmes",
      period: 'Septembre 2025 – Juin 2027',
      location: 'Rabat, Maroc',
      details: 'Matières clés : Deep Learning, Machine Learning, Vision par Ordinateur, Online Learning, Traitement du Signal, NLP, Agents Intelligents, MLOps, Déploiement de modèles ML/IA, Bases de données et Big Data.',
    },
    {
      degree: 'Classe préparatoire - Filière Mathématiques-Physique (MP)',
      school: 'CPGE Mohammed V',
      period: 'Septembre 2022 – Juin 2024',
      location: 'Casablanca, Maroc',
      details: "Formation intensive en mathématiques, physique et chimie ; préparation aux concours des grandes écoles d'ingénieurs marocaines.",
    },
  ],
  cv: {
    heading: 'Curriculum Vitae',
    downloadLabel: 'Télécharger CV (PDF)',
    contactHeading: 'Contact',
    languagesHeading: 'Langues',
    technicalSkillsHeading: 'Compétences Techniques',
    experienceProHeading: 'Expérience Professionnelle',
    projectsHeading: 'Projets Réalisés',
    educationHeading: 'Formation',
    languages: [
      { name: 'Arabe', level: 'Natif' },
      { name: 'Français', level: 'Courant' },
      { name: 'Anglais', level: 'Courant' },
    ],
    skillGroups: [
      {
        heading: 'Machine Learning & Deep Learning',
        items: ['PyTorch', 'Scikit-learn', 'XGBoost', 'YOLO', 'DeepSORT', 'MediaPipe', 'LSTM', 'SVM', 'CNN', 'GNN', 'Federated Learning', 'Online Learning', 'Manifold Learning', 'Classification', "Détection d'anomalies"],
      },
      {
        heading: 'IA Générative & Agents',
        items: ['RAG', 'LangChain', 'LangGraph', 'NLP', 'LLM (Ollama)', 'Modèles OpenAI (GPT)', 'Hugging Face', 'Embeddings', 'Prompt Engineering', 'spaCy', 'Presidio', 'Modèles Transformer pré-entraînés'],
      },
      {
        heading: 'Data & Traitement du Signal',
        items: ['Python', 'NumPy', 'Pandas', 'SQL', 'MFCC', 'Extraction de features spectrales', 'Feature Engineering', 'Séries temporelles', 'Évaluation précision-rappel'],
      },
      {
        heading: 'MLOps & Déploiement',
        items: ['Docker', 'Docker Compose', 'MLflow', 'DVC', 'CI/CD', 'Airflow', 'FastAPI', 'REST APIs', 'GitHub Actions', 'Streamlit'],
      },
      {
        heading: 'Outils, Bases de données & IoT',
        items: ['Git', 'Big Data', 'PostgreSQL/Supabase', 'NoSQL', 'MongoDB', 'Vector Database', 'Flutter', 'Firebase', 'ESP32', 'Arduino'],
      },
    ],
  },
  contact: {
    heading: 'Me Contacter',
    subheading: 'Travaillons Ensemble',
    paragraph: "Je suis toujours intéressé par de nouvelles opportunités et des projets IA passionnants. Que vous ayez une question ou simplement envie de dire bonjour, je ferai de mon mieux pour vous répondre !",
    location: 'Casablanca, Maroc',
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
}

const en: SiteContent = {
  nav: {
    hero: 'Home',
    about: 'About',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    cv: 'CV',
    contact: 'Contact',
  },
  hero: {
    role: 'AI Engineer | Data Science | ML | Computer Vision',
    tagline: 'Building AI systems that move beyond the notebook to reliably solve real-world problems.',
    ctaWork: 'View My Work',
    ctaCV: 'View my CV',
  },
  about: {
    heading: 'About Me',
    paragraph1: 'Final-year engineering student at ENSIAS, Artificial Intelligence Engineering program (2IA), graduating in June 2027. Convinced that an AI system only becomes meaningful once it moves beyond the notebook to reliably address a real-world need.',
    paragraph2: 'Currently seeking a final-year graduation internship (PFE) in AI Engineering starting January 2027. Shaped by hands-on projects — from large-scale anomaly detection at AKWA Group to building a production multi-agent AI system at Renault Digital Maroc.',
    locationLabel: 'Based in Casablanca, Morocco',
    badgeLabel: 'AI Engineering Student @ ENSIAS',
    stats: {
      accuracy: 'Model Accuracy',
      models: 'AI Models Built',
      datasets: 'Datasets Processed',
    },
  },
  skillsHeading: 'Skills & Expertise',
  skills: [
    { name: 'Machine Learning', level: 95 },
    { name: 'Deep Learning (PyTorch)', level: 90 },
    { name: 'Computer Vision (YOLO, DeepSORT)', level: 90 },
    { name: 'MLOps (Docker, CI/CD, MLflow)', level: 85 },
    { name: 'NLP & LLM (RAG, LangChain)', level: 82 },
    { name: 'Python', level: 95 },
    { name: 'Signal Processing', level: 85 },
    { name: 'SQL & Data Engineering', level: 85 },
  ],
  skillGroupsHeading: 'Toolbox',
  experienceHeading: 'Professional Experience',
  projectsHeading: 'Featured Projects',
  projects: [
    {
      title: 'Dental Pathology Detection (MLOps)',
      description: 'Object detection model (YOLOv8s) identifying 7 categories of dental pathologies across 1,808 panoramic radiographs (24,888 annotations), prioritizing recall for clinical use (86% precision, 47% recall, 42% mAP50). Industrialized into a containerized API service with a complete MLOps pipeline (DVC, MLflow) and CI/CD, continuously deployed on Railway and Vercel.',
      technologies: ['YOLOv8', 'MLOps', 'DVC', 'MLflow', 'CI/CD', 'Docker'],
      github: 'https://github.com/JadFalaq/detection_dentaire_mlops',
      image: '/Dantal pathologie.png',
    },
    {
      title: 'Shoplifting Detection (Computer Vision)',
      description: 'Real-time detection system for suspicious behavior in surveillance videos (≈80% accuracy). Pipeline combining YOLO (detection), DeepSORT (tracking), MediaPipe Pose (33 landmarks), and an LSTM model for temporal behavior analysis.',
      technologies: ['YOLO', 'DeepSORT', 'MediaPipe', 'LSTM', 'Computer Vision'],
      github: 'https://github.com/JadFalaq/AmnAI_Vlast',
      image: '/AmnAI.png',
    },
    {
      title: 'Speaker Recognition (Signal Processing & ML)',
      description: 'Robust speaker identification system for degraded radio environments (SNR 10-15 dB), achieving 86.98% accuracy across 50 speakers. MFCC and spectral feature extraction (140 features); SVM classification (RBF kernel) with a real-time Streamlit interface.',
      technologies: ['SVM', 'MFCC', 'Signal Processing', 'Streamlit'],
      github: 'https://github.com/JadFalaq/Reconnaissance_locuteur_canal_radio',
      image: '/detection de locateur.png',
    },
    {
      title: 'Smart Irrigation System (IoT & Machine Learning)',
      description: 'Remote irrigation management platform (Flutter application, Firebase, ESP32/Arduino IoT architecture). Machine learning model predicting optimal watering duration and timing from historical data (soil moisture, temperature), supporting farmer decision-making.',
      technologies: ['Flutter', 'Firebase', 'ESP32', 'Arduino', 'Machine Learning'],
      github: 'https://github.com/JadFalaq/Smart_Irrigation_System',
      image: '/Samrt farm.png',
    },
    {
      title: 'Arabic Medical Misinformation Detector (NLP)',
      description: 'Fine-tuned AraBERT (aubmindlab/bert-base-arabertv02) on the ArCOV19-Rumors tweet_verification subset to detect whether an Arabic tweet contains medical misinformation or reliable information. Full pipeline: Arabic text normalization, stratified-split training, evaluation (confusion matrix, loss curves), and command-line prediction.',
      technologies: ['AraBERT', 'Hugging Face', 'NLP', 'PyTorch', 'Python'],
      github: 'https://github.com/JadFalaq/misinformation_covid_detector_arabic',
      image: '/miss_info_detection.png',
    },
    {
      title: 'Intelligent Audit - Accounting Anomaly Detection',
      description: "End-to-end machine learning pipeline built during my internship at AKWA Group to detect and classify missing transactions. Compared 5 models (Random Forest, SVM, Decision Tree, KNN, Logistic Regression) — Random Forest reaching 98% accuracy and an 85% F1-score, applied across more than 6 million records.",
      technologies: ['Python', 'Scikit-learn', 'Random Forest', 'SVM', 'Feature Engineering'],
      github: 'https://github.com/JadFalaq/Audit-Intelligent',
      image: '/anomalies detection.png',
    },
    {
      title: 'Web Scraping & Analysis - Profitable Motorcycle Import',
      description: 'Python web scraping tool collecting used motorcycle listings across Europe, estimating import costs to Morocco (purchase, shipping, taxes), and identifying the most profitable models to resell.',
      technologies: ['Python', 'Web Scraping', 'Pandas', 'Data Analysis'],
      github: 'https://github.com/JadFalaq/Profitable_Motorcycle_Import_Scraper',
      image: '/motorcycle profit.png',
    },
    {
      title: 'Automatic Braking System for Wheeling (TIPE)',
      description: 'Embedded system automatically triggering the brake when the motorcycle loses balance. Technical project combining embedded electronics, real-time detection, and programming, carried out as part of the TIPE research project during my preparatory classes.',
      technologies: ['Python', 'Embedded Electronics', 'Sensors', 'Real-time Systems'],
      image: '/projet2.png',
    },
  ],
  experiencePro: [
    {
      title: 'AI Engineer Intern – Quality Engineering Team',
      company: 'Renault Digital Maroc',
      period: 'Jun 2026 – Aug 2026',
      location: 'Casablanca, Morocco',
      description: [
        'Designed and developed a multi-agent AI system (3 agents) converting natural-language business requirements into Jira/GitLab tickets, Gherkin scenarios, and user stories, with human validation at each step.',
        'Implemented a RAG pipeline (Ollama embeddings, cosine similarity, empirical relevance-threshold calibration) and a data anonymization layer (Presidio, spaCy) with 100% local LLM inference for confidentiality.',
        'Automated (Copilot Studio / Power Automate) the weekly generation of SharePoint tracking files, with full error handling and real-time Teams notifications — used weekly by the QA team in production.',
      ],
      logo: '/rdm logo.jpg',
    },
    {
      title: 'Data / Machine Learning Intern',
      company: 'AKWA Group',
      period: 'Jun 2025 – Sep 2025',
      location: 'Casablanca, Morocco',
      description: [
        'Designed an end-to-end machine learning pipeline to detect and classify missing transactions: preprocessing, feature engineering, modeling, and evaluation.',
        'Tested and compared 5 models (Logistic Regression, SVM, Decision Tree, Random Forest, KNN) — Random Forest reaching 98% overall accuracy and an 85% F1-score on missing transaction detection.',
        'Collaborated with the Data team to automate detection and ERP integration of missing transactions across more than 6 million records.',
      ],
      logo: '/Akwa.jpg',
    },
  ],
  education: [
    {
      degree: 'Engineering Degree - Artificial Intelligence (2IA)',
      school: "ENSIAS - École Nationale Supérieure d'Informatique et d'Analyse des Systèmes",
      period: 'Sep 2025 – Jun 2027',
      location: 'Rabat, Morocco',
      details: 'Key courses: Deep Learning, Machine Learning, Computer Vision, Online Learning, Signal Processing, NLP, Intelligent Agents, MLOps, ML/AI Model Deployment, Databases and Big Data.',
    },
    {
      degree: 'Preparatory Classes - Mathematics-Physics Track (MP)',
      school: 'CPGE Mohammed V',
      period: 'Sep 2022 – Jun 2024',
      location: 'Casablanca, Morocco',
      details: "Intensive training in mathematics, physics, and chemistry; preparation for competitive entrance exams to Morocco's top engineering schools.",
    },
  ],
  cv: {
    heading: 'Curriculum Vitae',
    downloadLabel: 'Download CV (PDF)',
    contactHeading: 'Contact',
    languagesHeading: 'Languages',
    technicalSkillsHeading: 'Technical Skills',
    experienceProHeading: 'Professional Experience',
    projectsHeading: 'Projects',
    educationHeading: 'Education',
    languages: [
      { name: 'Arabic', level: 'Native' },
      { name: 'French', level: 'Fluent' },
      { name: 'English', level: 'Fluent' },
    ],
    skillGroups: [
      {
        heading: 'Machine Learning & Deep Learning',
        items: ['PyTorch', 'Scikit-learn', 'XGBoost', 'YOLO', 'DeepSORT', 'MediaPipe', 'LSTM', 'SVM', 'CNN', 'GNN', 'Federated Learning', 'Online Learning', 'Manifold Learning', 'Classification', 'Anomaly Detection'],
      },
      {
        heading: 'Generative AI & Agents',
        items: ['RAG', 'LangChain', 'LangGraph', 'NLP', 'LLM (Ollama)', 'OpenAI Models (GPT)', 'Hugging Face', 'Embeddings', 'Prompt Engineering', 'spaCy', 'Presidio', 'Pretrained Transformer Models'],
      },
      {
        heading: 'Data & Signal Processing',
        items: ['Python', 'NumPy', 'Pandas', 'SQL', 'MFCC', 'Spectral Feature Extraction', 'Feature Engineering', 'Time Series', 'Precision-Recall Evaluation'],
      },
      {
        heading: 'MLOps & Deployment',
        items: ['Docker', 'Docker Compose', 'MLflow', 'DVC', 'CI/CD', 'Airflow', 'FastAPI', 'REST APIs', 'GitHub Actions', 'Streamlit'],
      },
      {
        heading: 'Tools, Databases & IoT',
        items: ['Git', 'Big Data', 'PostgreSQL/Supabase', 'NoSQL', 'MongoDB', 'Vector Database', 'Flutter', 'Firebase', 'ESP32', 'Arduino'],
      },
    ],
  },
  contact: {
    heading: 'Get In Touch',
    subheading: "Let's Work Together",
    paragraph: "I'm always interested in new opportunities and exciting AI projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    location: 'Casablanca, Morocco',
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
}

export const siteContent: Record<Language, SiteContent> = { fr, en }
export const contact = contactInfo
