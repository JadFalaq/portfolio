'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '../data/content'

interface FeaturedShowcaseProps {
  projects: Project[]
  labels: {
    code: string
    demo: string
    caseStudy: string
    problem: string
    confidential: string
  }
}

// Editorial index: the three featured projects as numbered rows (all content always
// visible), plus — on large screens — a sticky preview of the row being hovered or focused.
export default function FeaturedShowcase({ projects, labels }: FeaturedShowcaseProps) {
  const [active, setActive] = useState(0)
  const current = projects[active] ?? projects[0]

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
      <ol className="border-t border-line">
        {projects.map((project, index) => (
          <li key={project.id}>
            <Row
              project={project}
              index={index}
              active={index === active}
              onActivate={() => setActive(index)}
              labels={labels}
            />
          </li>
        ))}
      </ol>

      {/* Decorative preview: the same information is in the rows, so it is hidden from AT. */}
      <div className="hidden lg:block" aria-hidden="true">
        <div className="sticky top-28">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line bg-surface">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`absolute inset-0 transition-[opacity,transform] duration-[250ms] ease-out ${
                  index === active ? 'scale-100 opacity-100' : 'scale-[1.02] opacity-0'
                }`}
              >
                <Preview project={project} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            <span>{current.category}</span>
            <span className="flex gap-1.5">
              {projects.map((p, i) => (
                <span
                  key={p.id}
                  className={`h-1 rounded-full transition-[width,background-color] duration-[250ms] ease-out ${
                    i === active ? 'w-6 bg-accent' : 'w-1.5 bg-paper/25'
                  }`}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  project,
  index,
  active,
  onActivate,
  labels,
}: {
  project: Project
  index: number
  active: boolean
  onActivate: () => void
  labels: FeaturedShowcaseProps['labels']
}) {
  const caseHref = project.slug ? `/projects/${project.slug}/` : undefined
  const results = project.results?.slice(0, 3)
  const link =
    'inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors duration-200 ease-out hover:border-accent hover:text-accent'

  return (
    <article
      onMouseEnter={onActivate}
      onFocus={onActivate}
      data-active={active}
      className="group relative border-b border-line py-8 pl-6 transition-colors duration-[250ms] ease-out data-[active=true]:bg-paper/[0.02] sm:pl-8 md:py-10"
    >
      {/* Accent rail: grows on the active row. */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-8 w-[2px] rounded-full bg-accent transition-[height,opacity] duration-[250ms] ease-out md:top-10 ${
          active ? 'h-12 opacity-100' : 'h-4 opacity-40'
        }`}
      />

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span className={`transition-colors duration-200 ${active ? 'text-accent' : ''}`}>{String(index + 1).padStart(2, '0')}</span>
        <span>{project.category}</span>
        <span aria-hidden="true">·</span>
        <span>{project.year}</span>
      </div>

      <h3
        className={`mt-3 text-[clamp(1.375rem,2.4vw,1.875rem)] font-semibold leading-tight tracking-[-0.025em] text-paper transition-transform duration-[250ms] ease-out ${
          active ? 'lg:translate-x-1' : ''
        }`}
      >
        {project.title}
      </h3>
      {project.role && <p className="mt-1.5 text-xs font-medium text-paper/70">{project.role}</p>}

      {/* Small screens: the visual sits in the row (no side preview). */}
      {project.image && (
        <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-sm border border-line bg-surface lg:hidden">
          <Preview project={project} />
        </div>
      )}

      {project.problem && (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
          <span className="sr-only">{labels.problem} : </span>
          {project.problem}
        </p>
      )}

      {results && results.length > 0 ? (
        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {results.map((r) => (
            <div key={r.label} className="min-w-[7rem]">
              <dt className="sr-only">{r.label}</dt>
              <dd className="text-xl font-semibold tracking-[-0.02em] text-paper">{r.value}</dd>
              <dd className="mt-0.5 max-w-[12rem] text-xs leading-snug text-muted">{r.label}</dd>
            </div>
          ))}
        </dl>
      ) : project.metric ? (
        <p className="mt-5 font-mono text-[12px] text-paper">{project.metric}</p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-2">
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
function Preview({ project }: { project: Project }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
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
