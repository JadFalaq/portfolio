'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Github, Languages as LanguagesIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { siteContent, getExperienceFor, getProjectBySlug } from '../data/content'

// Bullets from the experience entries start with "Label : text" — keep the label visible.
function Bullet({ text }: { text: string }) {
  const m = text.match(/^([^:]{3,60}?)\s?:\s/)
  return m ? (
    <>
      <strong className="font-semibold text-paper">{m[1]}</strong> — {text.slice(m[0].length)}
    </>
  ) : (
    <>{text}</>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-10 md:grid-cols-[200px_1fr] md:gap-10">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{label}</h2>
      <div>{children}</div>
    </section>
  )
}

// Only documented sections are rendered: nothing is filled in to look complete.
export default function CaseStudy({ slug }: { slug: string }) {
  const { language, toggleLanguage } = useLanguage()
  const t = siteContent[language]
  const project = getProjectBySlug(language, slug)
  if (!project) return null
  const experience = project.company ? getExperienceFor(language, project.company) : undefined
  const l = t.caseStudy

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-10">
          <Link
            href="/#projects"
            className="group inline-flex min-h-[44px] items-center gap-2 text-sm text-muted transition-colors duration-200 ease-out hover:text-paper"
          >
            <ArrowLeft size={16} aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
            {l.backLabel}
          </Link>
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
            className="flex min-h-[44px] items-center gap-1.5 font-mono text-[11px] tracking-[0.15em] text-muted transition-colors duration-200 ease-out hover:text-accent"
          >
            <LanguagesIcon size={13} aria-hidden="true" />
            {language === 'fr' ? 'FR' : 'EN'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-14 md:px-10 md:pt-20">
        <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          {project.category} · {project.year} · {project.status}
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.02] tracking-[-0.01em]">{project.title}</h1>
        {project.role && <p className="mt-4 text-sm font-semibold text-paper/80">{project.role}</p>}
        {project.problem && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">{project.problem}</p>}

        {project.image ? (
          <div className="mt-12 overflow-hidden rounded-sm border border-line bg-surface">
            <Image
              src={project.image}
              alt={project.title}
              width={1600}
              height={1000}
              sizes="(max-width: 1024px) 100vw, 960px"
              className="h-auto max-h-[32rem] w-full object-contain"
              priority
            />
          </div>
        ) : project.logo ? (
          <div className="mt-12 flex flex-col items-start gap-5 rounded-sm border border-line bg-surface/50 p-6 sm:flex-row sm:items-center">
            <div className="relative aspect-[2/1] w-40 shrink-0 overflow-hidden rounded-md bg-white shadow-[0_0_0_1px_rgb(var(--accent)_/_0.45)]">
              <Image src={project.logo} alt={project.company ?? ''} fill sizes="160px" className="object-cover" />
            </div>
            {project.detailsHref && <p className="text-sm italic text-muted">{l.confidentialNote}</p>}
          </div>
        ) : null}

        {project.results && project.results.length > 0 && (
          <dl className="mt-12 grid gap-6 sm:grid-cols-3">
            {project.results.map((r) => (
              <div key={r.label} className="border-l-2 border-accent/60 pl-4">
                <dt className="sr-only">{r.label}</dt>
                <dd className="font-display text-4xl leading-none text-gold">{r.value}</dd>
                <dd className="mt-2 text-sm leading-snug text-muted">{r.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-14">
          <Block label={l.overviewLabel}>
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{project.description}</p>
          </Block>

          {experience && (
            <Block label={l.contributionsLabel}>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                {experience.company} · {experience.period} · {experience.location}
              </p>
              <ul className="mt-5 max-w-2xl space-y-4">
                {experience.description.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[15px] leading-relaxed text-muted">
                    <span className="mt-[0.7em] h-px w-4 shrink-0 bg-accent/70" aria-hidden="true" />
                    <span>
                      <Bullet text={item} />
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/#experience" className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm text-paper underline-offset-4 hover:text-accent hover:underline">
                {l.experienceLink} <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </Block>
          )}

          <Block label={l.stackLabel}>
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li key={tech} className="rounded-full border border-line px-3 py-1 text-xs text-paper/80">
                  {tech}
                </li>
              ))}
            </ul>
          </Block>

          {project.decisions && project.decisions.length > 0 && (
            <Block label={l.decisionsLabel}>
              <ul className="max-w-2xl list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
                {project.decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </Block>
          )}

          {project.limitations && project.limitations.length > 0 && (
            <Block label={l.limitationsLabel}>
              <ul className="max-w-2xl list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
                {project.limitations.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </Block>
          )}

          {(project.github || project.demo) && (
            <Block label={l.linksLabel}>
              <div className="flex flex-wrap gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line px-5 text-sm text-paper transition-colors duration-200 ease-out hover:border-accent hover:text-accent"
                  >
                    <Github size={15} aria-hidden="true" /> {t.projectsSection.codeLabel}
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-sm font-semibold"
                  >
                    {t.projectsSection.demoLabel} <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </Block>
          )}
        </div>
      </main>
    </div>
  )
}
