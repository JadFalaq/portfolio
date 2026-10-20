'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '../data/content'
import type { AkwaCopy } from '../data/akwa'
import AuditPresentation from './AuditPresentation'
import PresentationViewer from './PresentationViewer'

interface FeaturedShowcaseProps {
  projects: Project[]
  /** Copy for built-in diagrams (projects with `diagram`). */
  diagrams: { akwa: AkwaCopy['pipeline'] }
  labels: {
    code: string
    demo: string
    caseStudy: string
    problem: string
    confidential: string
  }
}

// Each project keeps its visual, evidence and links together at every viewport size.
// Below lg the cards become a swipeable row so the section stays one screen tall.
export default function FeaturedShowcase({ projects, diagrams, labels }: FeaturedShowcaseProps) {
  return (
    <ol className="relative -mx-5 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-px-5 px-5 pb-3 [scrollbar-width:none] md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:grid lg:snap-none lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
      {projects.map((project, index) => (
        <li key={project.id} className="w-[86%] min-w-0 shrink-0 snap-start sm:w-[60%] lg:w-auto">
          <Row project={project} index={index} diagrams={diagrams} labels={labels} />
        </li>
      ))}
    </ol>
  )
}

function Row({
  project,
  index,
  diagrams,
  labels,
}: {
  project: Project
  index: number
  diagrams: FeaturedShowcaseProps['diagrams']
  labels: FeaturedShowcaseProps['labels']
}) {
  const caseHref = project.slug ? `/projects/${project.slug}/` : undefined
  const results = project.results?.slice(0, 3)
  const link =
    'inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors duration-200 ease-out hover:border-accent hover:text-accent'

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/60 p-4 transition-colors duration-200 hover:border-accent/50 focus-within:border-accent/50 sm:p-6"
    >
      {project.presentation ? (
        <div className="mb-4 sm:mb-6"><PresentationViewer key={project.id} presentation={project.presentation} compact /></div>
      ) : project.diagram === 'akwa' ? (
        <div className="mb-4 sm:mb-6"><AuditPresentation compact /></div>
      ) : (
        <div className="relative mb-4 h-44 overflow-hidden sm:mb-6 sm:h-64 rounded-lg border border-line bg-ink">
          <Preview project={project} diagrams={diagrams} />
        </div>
      )}

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span className="text-accent">{String(index + 1).padStart(2, '0')}</span>
        <span>{project.category}</span>
        <span aria-hidden="true">·</span>
        <span>{project.year}</span>
      </div>

      <h3 className="mt-2 text-lg font-semibold leading-tight sm:mt-3 tracking-[-0.025em] text-paper sm:text-2xl">
        {project.shortTitle ?? project.title}
        {project.subtitle && <span className="mt-1 block text-[0.7em] font-medium italic tracking-[-0.01em] text-paper/70">{project.subtitle}</span>}
      </h3>
      {project.role && <p className="mt-1.5 text-xs font-medium text-paper/70">{project.role}</p>}

      {project.problem && (
        <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-relaxed text-muted sm:mt-4 sm:line-clamp-none sm:text-[15px]">
          <span className="sr-only">{labels.problem} : </span>
          {project.problem}
        </p>
      )}
      {project.businessValue && <p className="mt-2 hidden max-w-xl sm:block text-sm leading-relaxed text-paper/80">{project.businessValue}</p>}

      {results && results.length > 0 ? (
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 sm:mt-5 sm:gap-x-8 sm:gap-y-3">
          {results.map((r) => (
            <div key={r.label} className="min-w-[7rem]">
              <dt className="sr-only">{r.label}</dt>
              <dd className="text-lg font-semibold sm:text-xl tracking-[-0.02em] text-paper">{r.value}</dd>
              <dd className="mt-0.5 max-w-[12rem] text-xs leading-snug text-muted">{r.label}</dd>
            </div>
          ))}
        </dl>
      ) : project.metric ? (
        <p className="mt-5 font-mono text-[12px] text-paper">{project.metric}</p>
      ) : null}

      <ul className="mb-4 mt-4 flex flex-wrap gap-1.5 sm:mb-6 sm:mt-5" aria-label="Technologies">
        {project.technologies.slice(0, 4).map((tech) => (
          <li key={tech} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-paper/70">
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-4 sm:pt-5">
        {caseHref && (
          <Link
            href={caseHref}
            className="group/case inline-flex min-h-[44px] items-center gap-2 rounded-full bg-paper px-5 text-[13px] font-semibold text-ink transition-colors duration-200 ease-out hover:bg-accent"
          >
            {labels.caseStudy}
            <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-200 ease-out group-hover/case:translate-x-1" />
          </Link>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={link} aria-label={`${labels.code} — ${project.title}`}>
            <Github size={13} aria-hidden="true" /> {labels.code}
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className={link} aria-label={`${labels.demo} — ${project.title}`}>
            {labels.demo} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
        {!project.image && project.detailsHref && <span className="text-xs italic text-muted">{labels.confidential}</span>}
      </div>
    </article>
  )
}

// Real visual when there is one; otherwise a typographic panel built from verified data
// (logo, headline result, stack) — no invented illustration.
function Preview({ project, diagrams }: { project: Project; diagrams: FeaturedShowcaseProps['diagrams'] }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(max-width: 1023px) 90vw, 30vw"
        className="object-contain p-4"
      />
    )
  }
  const lead = project.results?.[0]
  return (
    <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_80%_10%,rgb(var(--accent)_/_0.16),transparent_60%)] p-6 sm:p-8">
      {project.logo ? (
        <div className="relative aspect-[2/1] w-32 overflow-hidden rounded-md bg-white shadow-[0_0_0_1px_rgb(var(--accent)_/_0.4)]">
          <Image src={project.logo} alt="" fill sizes="128px" className="object-cover" />
        </div>
      ) : (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{project.category}</span>
      )}
      {lead && (
        <div>
          <p className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-gold">{lead.value}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">{lead.label}</p>
        </div>
      )}
      <p className="font-mono text-[11px] leading-relaxed text-paper/60">{project.technologies.slice(0, 4).join('  ·  ')}</p>
    </div>
  )
}
