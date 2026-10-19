'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowUpRight, Lock } from 'lucide-react'
import type { Project } from '../data/content'

interface ProjectCardProps {
  project: Project
  index: number
  codeLabel: string
  demoLabel: string
  noLinkLabel: string
  /** Drawn visual (e.g. a pipeline diagram) used when the project has no screenshot. */
  visual?: React.ReactNode
}

export default function ProjectCard({ project, index, codeLabel, demoLabel, noLinkLabel, visual }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, '0')

  const CardInner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-surface md:aspect-auto md:h-full md:min-h-[22rem]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="card-media object-cover opacity-85"
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

      <div className="relative flex flex-col justify-center px-6 pb-6 pt-2 md:px-12 md:py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{project.status}</p>
        <h3 className="mt-3 font-display text-2xl leading-tight text-paper md:text-[2.1rem]">
          {project.title}
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-[15px]">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
          {project.technologies.map((tech) => (
            <span key={tech} className="font-mono text-[11px] text-paper/50">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          {project.github ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80 transition-colors group-hover:text-accent">
              {codeLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <Lock size={11} />
              {noLinkLabel}
            </span>
          )}
          {project.demo && (
            // Sits above the stretched GitHub link so it stays clickable on its own.
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold relative z-10 ml-5 mr-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em]"
            >
              {demoLabel}
              <ArrowUpRight size={13} />
            </a>
          )}
          {project.github && (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-accent transition-colors duration-200 ease-out group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
              <ArrowUpRight size={16} />
            </span>
          )}
        </div>
      </div>
    </>
  )

  const className =
    'card-lift card-flat group relative block h-full overflow-hidden bg-ink hover:bg-surface focus-within:bg-surface md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div className={className}>
        {project.github && (
          // Stretched link: the whole card opens the repo without nesting the demo link inside an <a>.
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={project.title}
            className="absolute inset-0 z-[5]"
          />
        )}
        {CardInner}
      </div>
    </motion.div>
  )
}
