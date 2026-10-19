'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check, CircleDashed, Github, Languages as LanguagesIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { getExperienceFor, siteContent, type Project } from '../data/content'
import type { CaseStudyData, L } from '../data/caseStudies'
import FlowDiagram from './FlowDiagram'

const LABELS = {
  challenge: { fr: 'Le défi', en: 'The challenge' },
  solution: { fr: 'La solution', en: 'Solution overview' },
  architecture: { fr: 'Architecture', en: 'System architecture' },
  decisions: { fr: 'Décisions techniques', en: 'Technical decisions' },
  results: { fr: 'Résultats', en: 'Results & evaluation' },
  limitations: { fr: 'Limites', en: 'Challenges & limitations' },
  next: { fr: 'Suites possibles', en: 'Next steps' },
  links: { fr: 'Code et démo', en: 'Repository & demo' },
  context: { fr: 'Contexte', en: 'Context' },
  year: { fr: 'Année', en: 'Year' },
  stack: { fr: 'Technologies', en: 'Technologies' },
  role: { fr: 'Rôle', en: 'Role' },
  sources: { fr: 'Sources examinées', en: 'Sources reviewed' },
  contributions: { fr: 'Contributions détaillées', en: 'Detailed contributions' },
  fullExperience: { fr: 'Voir l’expérience complète', en: 'See the full experience' },
} as const

function Section({ id, index, title, children }: { id: string; index: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-12 md:py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{String(index).padStart(2, '0')}</p>
      <h2 className="mt-3 text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-tight tracking-[-0.03em] text-paper">{title}</h2>
      <div className="mt-7">{children}</div>
    </section>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="ml-2 inline font-mono text-[10px] uppercase tracking-[0.12em] text-muted [overflow-wrap:anywhere]">[{children}]</span>
}

// Bullets from experience entries start with "Label : text" — keep the label visible.
function Lead({ text }: { text: string }) {
  const m = text.match(/^([^:]{3,60}?)\s?:\s/)
  return m ? (
    <>
      <strong className="font-semibold text-paper">{m[1]}</strong> — {text.slice(m[0].length)}
    </>
  ) : (
    <>{text}</>
  )
}

export default function CaseStudyTemplate({ project, data }: { project: Project; data: CaseStudyData }) {
  const { language, toggleLanguage } = useLanguage()
  const t = siteContent[language]
  const tr = (l: L) => l[language]
  const lab = (k: keyof typeof LABELS) => LABELS[k][language]
  const experience = project.company ? getExperienceFor(language, project.company) : undefined

  // Sections are numbered in the order they actually appear.
  let n = 0
  const next = () => ++n

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 md:px-10">
          <Link
            href="/#projects"
            className="group inline-flex min-h-[44px] items-center gap-2 text-sm text-muted transition-colors duration-200 ease-out hover:text-paper"
          >
            <ArrowLeft size={16} aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
            {t.caseStudy.backLabel}
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

      <main className="mx-auto max-w-5xl px-5 pb-24 md:px-10">
        {/* Hero */}
        <div className="pb-10 pt-12 md:pt-16">
          <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            {project.category} · {project.year}
          </p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{project.title}</h1>
          {project.problem && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">{project.problem}</p>}

          <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-line py-5 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{lab('context')}</dt>
              <dd className="mt-1 text-sm text-paper">{tr(data.context)}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{lab('year')}</dt>
              <dd className="mt-1 text-sm text-paper">{project.year}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{lab('stack')}</dt>
              <dd className="mt-1 text-sm text-paper">{project.technologies.slice(0, 4).join(' · ')}</dd>
            </div>
            {project.role && (
              <div className="sm:col-span-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{lab('role')}</dt>
                <dd className="mt-1 text-sm text-paper">{project.role}</dd>
              </div>
            )}
          </dl>

          {(project.github || project.demo) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-accent"
                >
                  <Github size={15} aria-hidden="true" /> GitHub
                  <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line px-5 text-sm text-paper transition-colors duration-200 ease-out hover:border-accent hover:text-accent"
                >
                  {t.projectsSection.demoLabel} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          )}

          {!project.image && project.detailsHref && (
            <p className="mt-6 max-w-2xl rounded-sm border border-line bg-surface/50 px-4 py-3 text-sm italic text-muted">{t.caseStudy.confidentialNote}</p>
          )}

          {project.image && (
            <div className="mt-10 overflow-hidden rounded-sm border border-line bg-surface">
              <Image
                src={project.image}
                alt={project.title}
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 960px"
                className="h-auto max-h-[30rem] w-full object-contain"
                priority
              />
            </div>
          )}
        </div>

        <Section id="challenge" index={next()} title={lab('challenge')}>
          <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted">
            {data.challenge.map((p) => (
              <p key={p.en}>{tr(p)}</p>
            ))}
          </div>
        </Section>

        <Section id="solution" index={next()} title={lab('solution')}>
          <p className="max-w-3xl text-[15px] leading-relaxed text-paper/85">{tr(data.solution)}</p>
        </Section>

        {data.architecture && (
          <Section id="architecture" index={next()} title={data.architecture.title ? tr(data.architecture.title) : lab('architecture')}>
            <FlowDiagram nodes={data.architecture.nodes} alt={data.architecture.alt} language={language} />
            {data.architecture.note && <p className="mt-4 text-xs leading-relaxed text-muted">{tr(data.architecture.note)}</p>}
          </Section>
        )}

        <Section id="implementation" index={next()} title={tr(data.implementation.title)}>
          <ol className="grid gap-4 md:grid-cols-2">
            {data.implementation.items.map((it, i) => (
              <li key={it.title.en} className="min-w-0 rounded-sm border border-line p-5">
                <p className="font-semibold text-paper">
                  <span className="mr-2 font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  {tr(it.title)}
                  {it.source && <Tag>{it.source}</Tag>}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{tr(it.text)}</p>
              </li>
            ))}
          </ol>

          {experience && (
            <div className="mt-8">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">{lab('contributions')}</h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                {experience.company} · {experience.period}
              </p>
              <ul className="mt-4 max-w-3xl space-y-3">
                {experience.description.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-[0.65em] h-px w-3 shrink-0 bg-accent/70" aria-hidden="true" />
                    <span>
                      <Lead text={item} />
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/#experience" className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm text-paper underline-offset-4 hover:text-accent hover:underline">
                {lab('fullExperience')} <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}
        </Section>

        {data.decisions && data.decisions.length > 0 && (
          <Section id="decisions" index={next()} title={lab('decisions')}>
            <div className="grid gap-4 md:grid-cols-2">
              {data.decisions.map((d) => (
                <div key={d.title.en} className="min-w-0 rounded-sm border border-line p-5">
                  <p className="font-semibold text-paper">
                    {tr(d.title)}
                    {d.source && <Tag>{d.source}</Tag>}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{tr(d.text)}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.results && (
          <Section id="results" index={next()} title={lab('results')}>
            {data.results.intro && <p className="max-w-3xl text-[15px] leading-relaxed text-muted">{tr(data.results.intro)}</p>}
            {data.results.metrics && (
              <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.results.metrics.map((m) => (
                  <div key={m.label.en} className="border-l-2 border-accent/60 pl-4">
                    <dt className="sr-only">{tr(m.label)}</dt>
                    <dd className="text-3xl font-semibold tracking-[-0.03em] text-paper">{m.value}</dd>
                    <dd className="mt-1 text-sm text-paper/85">{tr(m.label)}</dd>
                    <dd className="mt-1 text-xs leading-snug text-muted">
                      {tr(m.context)}
                      <Tag>{m.source}</Tag>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {data.results.table && (
              <div className="mt-8 overflow-x-auto rounded-sm border border-line">
                <table className="w-full min-w-[30rem] text-left text-sm">
                  <caption className="px-4 pt-3 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {tr(data.results.table.caption)} <Tag>{data.results.table.source}</Tag>
                  </caption>
                  <thead className="border-b border-line font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    <tr>
                      {data.results.table.columns.map((c, i) => (
                        <th key={c.en} scope="col" className={`px-4 py-3 font-normal ${i > 0 ? 'text-right' : ''}`}>
                          {tr(c)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.table.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-line last:border-b-0">
                        {row.map((cell, i) =>
                          i === 0 ? (
                            <th key={i} scope="row" className="px-4 py-3 font-medium text-paper">
                              {cell}
                            </th>
                          ) : (
                            <td key={i} className="px-4 py-3 text-right font-mono text-paper">
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {data.results.note && <p className="mt-6 max-w-3xl border-l-2 border-accent pl-4 text-sm leading-relaxed text-paper/85">{tr(data.results.note)}</p>}
          </Section>
        )}

        <Section id="limitations" index={next()} title={lab('limitations')}>
          <ul className="max-w-3xl space-y-3">
            {data.limitations.map((l) => (
              <li key={l.en} className="flex gap-3 text-sm leading-relaxed text-muted">
                <CircleDashed size={14} className="mt-0.5 shrink-0 text-paper/50" aria-hidden="true" />
                {tr(l)}
              </li>
            ))}
          </ul>
        </Section>

        {data.nextSteps && data.nextSteps.length > 0 && (
          <Section id="next" index={next()} title={lab('next')}>
            <ul className="max-w-3xl space-y-3">
              {data.nextSteps.map((s) => (
                <li key={s.en} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <Check size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  {tr(s)}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <footer className="border-t border-line pt-8 text-xs leading-relaxed text-muted">
          <span className="font-mono uppercase tracking-[0.15em] text-paper/70">{lab('sources')} — </span>
          {data.sources.join(' · ')}
        </footer>
      </main>
    </div>
  )
}
