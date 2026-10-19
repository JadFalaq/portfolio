import Image from 'next/image'
import { ArrowDown, ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '../data/content'

interface FeaturedProjectCardProps {
  project: Project
  index: number
  codeLabel: string
  demoLabel: string
  detailsLabel: string
}

// Compact card for a profile's three featured projects: context, role, one verified
// metric and at most five tags — the long description lives in the full project list.
export default function FeaturedProjectCard({ project, index, codeLabel, demoLabel, detailsLabel }: FeaturedProjectCardProps) {
  const number = String(index + 1).padStart(2, '0')
  const linkClass =
    'inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors hover:border-accent hover:text-accent'

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-line bg-ink transition-colors duration-500 hover:border-accent/40">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-80 saturate-[0.85] transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:saturate-100"
          />
        ) : project.logo ? (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgb(var(--accent)_/_0.18),transparent_65%)]">
            <div className="relative aspect-[2/1] w-[72%] overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgb(var(--accent)_/_0.55),0_20px_45px_-12px_rgb(var(--accent)_/_0.5)] transition-transform duration-700 group-hover:scale-[1.04]">
              <Image src={project.logo} alt="" fill sizes="(max-width: 768px) 70vw, 25vw" className="object-cover" />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgb(var(--accent)_/_0.14),transparent_60%)]">
            <span className="font-display text-7xl italic text-accent/30">{number}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ink/85 to-transparent" />
        <div className="absolute left-5 top-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/85">
          <span className="text-accent">{number}</span>
          <span className="h-px w-5 bg-accent/60" />
          <span>{project.category}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          {project.status} · {project.year}
        </p>
        <h3 className="mt-3 font-display text-2xl leading-tight text-paper">{project.title}</h3>
        {project.role && <p className="mt-2 text-xs font-semibold text-paper/75">{project.role}</p>}
        <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary ?? project.description}</p>

        {project.metric && (
          <p className="mt-5 border-l-2 border-accent pl-3 font-mono text-[12px] leading-snug text-paper">{project.metric}</p>
        )}

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.slice(0, 5).map((tech) => (
            <li key={tech} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-paper/70">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={`${codeLabel} — ${project.title}`}>
              <Github size={13} /> {codeLabel}
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${demoLabel} — ${project.title}`}
              className="btn-gold inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.15em]"
            >
              {demoLabel} <ArrowUpRight size={13} />
            </a>
          )}
          {project.detailsHref && (
            <a href={project.detailsHref} className={linkClass}>
              {detailsLabel} <ArrowDown size={13} />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
