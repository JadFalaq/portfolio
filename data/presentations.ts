import type { Language } from '../contexts/LanguageContext'

export interface ProjectPresentation {
  href: string
  cover: string
  slides: string
  pages: number
  title: Record<Language, string>
}

export const auditPresentation: ProjectPresentation = {
  href: '/presentation_audit_intelligent.pdf',
  cover: '/audit-presentation/page-01.webp',
  slides: '/audit-presentation',
  pages: 28,
  title: { fr: 'Présentation Audit Intelligent', en: 'Intelligent Audit presentation' },
}

export const dentalPresentation: ProjectPresentation = {
  href: "/Industrialisation d'un Système de Détection de Pathologies Dentaires — Approche MLOps.pdf",
  cover: '/dental-presentation/page-01.webp',
  slides: '/dental-presentation',
  pages: 24,
  title: { fr: 'Présentation Snani — Détection dentaire & MLOps', en: 'Snani presentation — Dental detection & MLOps' },
}
