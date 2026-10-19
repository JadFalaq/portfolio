'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '../data/content'
import AuditPresentation from './AuditPresentation'
import PresentationViewer from './PresentationViewer'

interface ProjectCardProps {
  project: Project
  index: number
  codeLabel: string
  demoLabel: string
  noLinkLabel: string
  caseStudyLabel: string
  /** Drawn visual (e.g. a pipeline diagram) used when the project has no screenshot. */
  visual?: React.ReactNode
}

export default function ProjectCard({ project, index, codeLabel, demoLabel, caseStudyLabel, visual }: ProjectCardProps) {
  const caseHref = project.slug ? `/projects/${project.slug}/` : undefined
  const number = String(index + 1).padStart(2, '0')

  const CardInner = (
    <>
      {project.presentation ? (
        <div className="relative z-10 p-3"><PresentationViewer key={project.id} presentation={project.presentation} compact /></div>
      ) : project.diagram === 'akwa' ? (
        <div className="relative z-10 p-3"><AuditPresentation compact /></div>
      ) : (
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="card-media object-contain p-3"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : visual ? (
          <div className="absolute inset-0 overflow-hidden pt-12">{visual}</div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgb(var(--accent)_/_0.12),transparent_60%)]">
            <span className="font-display text-8xl italic text-accent/25">{number}</span>
          </div>
        )}
        {/* Fades the image into the text column: downward on mobile, rightward on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent md:bg-gradient-to-l md:via-transparent" />
        {/* Top scrim keeps the category label legible on light screenshots */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink/85 to-transparent" />
        <div className="absolute left-5 top-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/80">
          <span className="text-accent">{number}</span>
          <span className="h-px w-6 bg-accent/60" />
          <span>{project.category}</span>
        </div>
        <span className="absolute right-5 top-5 font-mono text-[10px] tracking-[0.2em] text-paper/60">{project.year}</span>
      </div>

      )}

      <div className="relative flex flex-col justify-center flex-1 px-6 pb-6 pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{project.status}</p>
        <h3 className="mt-3 font-display text-2xl leading-tight text-paper md:text-[1.65rem]">
          {project.title}
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-[15px]">{project.problem ?? project.description}</p>

        <div className="mb-6 mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
          {project.technologies.map((tech) => (
            <span key={tech} className="font-mono text-[11px] text-paper/50">
              {tech}
            </span>
          ))}
        </div>

        {/* Links sit above the stretched case-study link so each stays clickable on its own. */}
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-4">
          {caseHref && (
            <span className="mr-auto inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors duration-200 group-hover:text-accent">
              {caseStudyLabel}
              <ArrowRight size={13} aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </span>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${codeLabel} — ${project.title}`}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line px-3.5 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <Github size={13} aria-hidden="true" /> {codeLabel}
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${demoLabel} — ${project.title}`}
              className="btn-gold inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 font-mono text-[11px] uppercase tracking-[0.15em]"
            >
              {demoLabel} <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </>
  )

  const className =
    'card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/40 transition-colors hover:border-accent/50 focus-within:border-accent/50'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div className={className}>
        {caseHref && (
          // Stretched link: the whole card opens the case study (GitHub/demo buttons sit above it).
          <Link href={caseHref} aria-label={`${caseStudyLabel} — ${project.title}`} className="absolute inset-0 z-[5]" />
        )}
        {CardInner}
      </div>
    </motion.div>
  )
}
