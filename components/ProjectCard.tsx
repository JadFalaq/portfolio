'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowUpRight, Lock } from 'lucide-react'
import type { Project } from '../data/content'

interface ProjectCardProps {
  project: Project
  index: number
  codeLabel: string
  noLinkLabel: string
}

export default function ProjectCard({ project, index, codeLabel, noLinkLabel }: ProjectCardProps) {
  const CardInner = (
    <>
      <div className="flex items-center justify-between px-6 pt-5 font-mono text-[11px] uppercase tracking-wider text-muted">
        <span>{String(index + 1).padStart(2, '0')} / {project.category}</span>
        <span>{project.year}</span>
      </div>

      <div className="relative mt-4 aspect-[16/10] mx-6 overflow-hidden border border-line bg-white/[0.03]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-5xl text-white/10">{String(index + 1).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{project.status}</p>
        <h3 className="mt-2 font-mono text-xl font-semibold leading-snug text-paper md:text-2xl">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          {project.github ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-paper">
              {codeLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
              <Lock size={12} />
              {noLinkLabel}
            </span>
          )}
          {project.github && <ArrowUpRight size={18} className="text-accent" />}
        </div>
      </div>
    </>
  )

  const className = 'group block border border-line bg-ink transition-colors hover:border-accent/50'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
    >
      {project.github ? (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {CardInner}
        </a>
      ) : (
        <div className={className}>{CardInner}</div>
      )}
    </motion.div>
  )
}
