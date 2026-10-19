import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '../data/content'

interface FeaturedProjectCardProps {
  project: Project
  index: number
  /** `lead` = large editorial card (first featured project), `compact` = the two others. */
  variant: 'lead' | 'compact'
  labels: {
    code: string
    demo: string
    caseStudy: string
    problem: string
    confidential: string
  }
}

// Reading order is the same in both variants: problem → contribution → result → stack.
export default function FeaturedProjectCard({ project, index, variant, labels }: FeaturedProjectCardProps) {
  const lead = variant === 'lead'
  const number = String(index + 1).padStart(2, '0')
  const results = project.results?.slice(0, lead ? 3 : 2)
  const caseHref = project.slug ? `/projects/${project.slug}/` : undefined
  const ghostLink =
    'inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors duration-200 ease-out hover:border-accent hover:text-accent'

  const media = project.image ? (
    <div className={`relative overflow-hidden bg-surface ${lead ? 'aspect-[16/10] md:aspect-auto md:min-h-full' : 'aspect-[16/9]'}`}>
      <Image
        src={project.image}
        alt=""
        fill
        sizes={lead ? '(max-width: 768px) 100vw, 55vw' : '(max-width: 768px) 100vw, 50vw'}
        // Lead visual shown whole (slides and diagrams stay legible); compact ones are cropped.
        className={`card-media opacity-90 ${lead ? 'object-contain p-4 sm:p-6' : 'object-cover'}`}
      />
      {!lead && <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />}
    </div>
  ) : null

  const header = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
      <span className="text-accent">{number}</span>
      <span className="h-px w-5 bg-accent/60" />
      <span>{project.category}</span>
      <span aria-hidden="true">·</span>
      <span>{project.year}</span>
    </div>
  )

  const body = (
    <div className={`flex flex-1 flex-col ${lead ? 'p-6 sm:p-8 lg:p-10' : 'p-6 sm:p-7'}`}>
      {header}
      <div className="mt-4 flex items-start gap-4">
        {!project.image && project.logo && (
          <div className="relative aspect-[2/1] w-24 shrink-0 overflow-hidden rounded-md bg-white shadow-[0_0_0_1px_rgb(var(--accent)_/_0.45)] sm:w-28">
            <Image src={project.logo} alt="" fill sizes="112px" className="object-cover" />
          </div>
        )}
        <h3 className={`font-display leading-tight text-paper ${lead ? 'text-[clamp(1.75rem,3vw,2.5rem)]' : 'text-2xl'}`}>
          {project.title}
        </h3>
      </div>
      {project.role && <p className="mt-2 text-xs font-semibold text-paper/75">{project.role}</p>}

      {project.problem && (
        <p className={`mt-4 leading-relaxed text-paper/85 ${lead ? 'max-w-xl text-[15px]' : 'text-sm'}`}>
          <span className="sr-only">{labels.problem} : </span>
          {project.problem}
        </p>
      )}
      {(lead || !project.problem) && (
        <p className={`mt-3 leading-relaxed text-muted ${lead ? 'max-w-xl text-sm' : 'text-sm'}`}>{project.summary ?? project.description}</p>
      )}

      {results && results.length > 0 ? (
        <dl className={`mt-6 grid gap-4 border-t border-line pt-5 ${lead ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
          {results.map((r) => (
            <div key={r.label}>
              <dt className="sr-only">{r.label}</dt>
              <dd className={`font-display leading-none text-gold ${lead ? 'text-3xl' : 'text-2xl'}`}>{r.value}</dd>
              <dd className="mt-1.5 text-xs leading-snug text-muted">{r.label}</dd>
            </div>
          ))}
        </dl>
      ) : project.metric ? (
        <p className="mt-6 border-l-2 border-accent pl-3 font-mono text-[12px] leading-snug text-paper">{project.metric}</p>
      ) : null}

      {!project.image && project.detailsHref && <p className="mt-5 text-xs italic text-muted">{labels.confidential}</p>}

      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
        {project.technologies.slice(0, lead ? 5 : 4).map((tech) => (
          <li key={tech} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-paper/70">
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
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
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={ghostLink} aria-label={`${labels.code} — ${project.title}`}>
            <Github size={13} aria-hidden="true" /> {labels.code}
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className={ghostLink} aria-label={`${labels.demo} — ${project.title}`}>
            {labels.demo} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  )

  return (
    <article
      className={`card-lift group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-ink ${
        lead && media ? 'md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]' : ''
      }`}
    >
      {media}
      {body}
    </article>
  )
}
