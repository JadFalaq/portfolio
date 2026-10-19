import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseStudy from '../../../components/CaseStudy'
import { caseStudySlugs, getProjectBySlug } from '../../../data/content'
import { akwaCaseStudy } from '../../../data/akwa'

export const dynamicParams = false

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }))
}

// Metadata uses the French copy, like the home page (lang="fr" by default).
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug('fr', slug)
  if (!project) return {}
  const akwa = slug === 'akwa-audit-intelligent' ? akwaCaseStudy.fr : undefined
  const title = akwa ? `${akwa.title} — ${akwa.subtitle} (AKWA Group) | Jad Falaq` : `${project.title} | Jad Falaq`
  const description = akwa?.lead ?? project.problem ?? project.summary ?? project.description
  return {
    title,
    description,
    alternates: { canonical: `/projects/${slug}/` },
    openGraph: { title, description, url: `/projects/${slug}/`, type: 'article' },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getProjectBySlug('fr', slug)) notFound()
  return <CaseStudy slug={slug} />
}
