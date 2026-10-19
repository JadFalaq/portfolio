'use client'

import Link from 'next/link'
import { ArrowDownToLine, ArrowLeft, ArrowUpRight, Check, CircleDashed, FileText, Github, Languages as LanguagesIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { akwaCaseStudy, akwaModels, akwaPresentation, akwaRandomForest } from '../data/akwa'

const GITHUB = 'https://github.com/JadFalaq/Audit-Intelligent'

function Section({ id, index, title, children }: { id: string; index: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-14 md:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{String(index).padStart(2, '0')}</p>
      <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight tracking-[-0.03em] text-paper">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Source({ children }: { children: React.ReactNode }) {
  return <span className="ml-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-muted">[{children}]</span>
}

// Horizontal bar for a 0–1 score; the value is always printed, never conveyed by length alone.
function Bar({ value, strong = false, label }: { value: number; strong?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs text-muted">{label}</span>
      <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-paper/10">
        <span className={`absolute inset-y-0 left-0 rounded-full ${strong ? 'bg-accent' : 'bg-paper/40'}`} style={{ width: `${value * 100}%` }} />
      </span>
      <span className="w-10 shrink-0 text-right font-mono text-xs text-paper">{value.toFixed(2)}</span>
    </div>
  )
}

export default function AkwaCaseStudy() {
  const { language, toggleLanguage } = useLanguage()
  const c = akwaCaseStudy[language]
  const rf = akwaRandomForest
  const fmt = (n: number) => n.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 md:px-10">
          <Link
            href="/#projects"
            className="group inline-flex min-h-[44px] items-center gap-2 text-sm text-muted transition-colors duration-200 ease-out hover:text-paper"
          >
            <ArrowLeft size={16} aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
            {c.backLabel}
          </Link>
          <nav aria-label={c.title} className="hidden items-center gap-5 md:flex">
            {c.nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-[13px] text-muted transition-colors duration-200 hover:text-paper">
                {n.label}
              </a>
            ))}
          </nav>
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
        <div className="pb-12 pt-12 md:pt-16">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            {c.eyebrow}
          </p>
          <h1 className="mt-5 text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-[1] tracking-[-0.045em]">
            {c.title}
            <span className="mt-2 block text-[0.55em] font-medium italic tracking-[-0.02em] text-paper/75">{c.subtitle}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">{c.lead}</p>

          <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-line py-5 sm:grid-cols-2 lg:grid-cols-5">
            {c.facts.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{f.label}</dt>
                <dd className="mt-1 text-sm text-paper">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-accent"
            >
              <Github size={15} aria-hidden="true" /> {c.githubLabel}
              <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            {akwaPresentation && (
              <a
                href="#presentation"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line px-5 text-sm text-paper transition-colors duration-200 ease-out hover:border-accent hover:text-accent"
              >
                <FileText size={15} aria-hidden="true" /> {c.presentationLabel}
              </a>
            )}
          </div>
        </div>

        {/* 01 — Challenge */}
        <Section id="challenge" index={1} title={c.challenge.title}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="space-y-4 text-[15px] leading-relaxed text-muted">
              {c.challenge.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <aside className="self-start rounded-sm border border-accent/30 bg-accent/[0.05] p-5">
              <p className="text-sm font-semibold text-paper">{c.challenge.note.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.challenge.note.text}</p>
            </aside>
          </div>
        </Section>

        {/* 02 — Data */}
        <Section id="data" index={2} title={c.data.title}>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
            {c.data.intro}
            <Source>{language === 'fr' ? 'Présentation, diapo 7' : 'Presentation, slide 7'}</Source>
          </p>

          {/* Reconciliation diagram */}
          <figure className="mt-8">
            <div role="img" aria-label={c.data.flowAlt} className="rounded-sm border border-line bg-surface/50 p-5 sm:p-7">
              <div className="mx-auto max-w-sm rounded-sm border border-accent/50 bg-accent/[0.08] px-4 py-3 text-center">
                <p className="font-semibold text-paper">{c.data.sources[0].name}</p>
                <p className="text-xs text-muted">{c.data.sources[0].role}</p>
              </div>
              <div className="mx-auto h-6 w-px bg-accent/50" aria-hidden="true" />
              <div className="grid gap-3 sm:grid-cols-2">
                {c.data.sources.slice(1).map((s, i) => (
                  <div key={s.name} className="rounded-sm border border-line bg-ink/70 px-4 py-3 text-center">
                    <p className="font-mono text-sm text-paper">{s.name}</p>
                    <p className="text-xs text-muted">{s.role}</p>
                    <p className="mt-2 font-mono text-[11px] text-accent">{i === 0 ? 'in_jde911' : 'in_jde311'}</p>
                  </div>
                ))}
              </div>
              <div className="mx-auto h-6 w-px bg-accent/50" aria-hidden="true" />
              <div className="mx-auto max-w-md rounded-sm border border-dashed border-accent/60 px-4 py-3 text-center text-sm text-paper">
                {c.data.labeling}
              </div>
            </div>
          </figure>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {c.data.sources.map((s) => (
              <div key={s.name} className="rounded-sm border border-line p-5">
                <p className="font-mono text-sm text-paper">{s.name}</p>
                <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-accent">{s.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.detail}</p>
              </div>
            ))}
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            {c.data.figures.map((f) => (
              <div key={f.label} className="border-l-2 border-accent/60 pl-4">
                <dt className="sr-only">{f.label}</dt>
                <dd className="text-3xl font-semibold tracking-[-0.03em] text-paper">{f.value}</dd>
                <dd className="mt-1 text-sm text-muted">
                  {f.label}
                  <Source>{f.source}</Source>
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* 03 — CRISP-DM + preparation */}
        <Section id="method" index={3} title={c.crisp.title}>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{c.crisp.intro}</p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.crisp.steps.map((s, i) => (
              <li
                key={s.name}
                className={`rounded-sm border p-4 ${s.status === 'done' ? 'border-line bg-surface/40' : 'border-dashed border-paper/25'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {s.status === 'done' ? <Check size={12} aria-hidden="true" /> : <CircleDashed size={12} aria-hidden="true" />}
                    {s.status === 'done' ? c.crisp.done : c.crisp.discussed}
                  </span>
                </div>
                <p className="mt-2 font-semibold text-paper">{s.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>

          <h3 className="mt-14 text-lg font-semibold tracking-[-0.02em] text-paper">{c.prep.title}</h3>
          <ol className="relative mt-6 space-y-5 border-l border-line pl-6">
            {c.prep.steps.map((s, i) => (
              <li key={s.name} className="relative">
                <span className="absolute -left-[31px] top-0.5 flex h-[13px] w-[13px] items-center justify-center rounded-full border border-accent bg-ink" aria-hidden="true">
                  <span className="h-[5px] w-[5px] rounded-full bg-accent" />
                </span>
                <p className="text-sm font-semibold text-paper">
                  <span className="mr-2 font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  {s.name}
                  <Source>{s.source}</Source>
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* 04 — Experiments */}
        <Section id="experiments" index={4} title={c.experiments.title}>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{c.experiments.intro}</p>

          <div className="mt-8 overflow-x-auto rounded-sm border border-line">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="border-b border-line bg-surface/60 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-normal">{c.experiments.columns.model}</th>
                  <th scope="col" className="px-4 py-3 text-right font-normal">{c.experiments.columns.recall}</th>
                  <th scope="col" className="px-4 py-3 text-right font-normal">{c.experiments.columns.precision}</th>
                  <th scope="col" className="px-4 py-3 text-right font-normal">{c.experiments.columns.f1}</th>
                  <th scope="col" className="px-4 py-3 text-right font-normal">{c.experiments.columns.macro}</th>
                </tr>
              </thead>
              <tbody>
                {akwaModels.map((m) => {
                  const rfRow = m.name === 'Random Forest'
                  return (
                    <tr key={m.name} className={`border-b border-line last:border-b-0 ${rfRow ? 'bg-accent/[0.06]' : ''}`}>
                      <th scope="row" className="px-4 py-3 font-medium text-paper">
                        {m.name}
                        {rfRow && <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-accent"><span aria-hidden="true">★</span><span className="sr-only">{language === 'fr' ? '(modèle mis en avant)' : '(highlighted model)'}</span></span>}
                        <span className="block font-mono text-[10px] text-muted">Tab. {m.source}</span>
                      </th>
                      <td className="px-4 py-3 text-right font-mono text-paper">{m.recall.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono text-paper">{m.precision.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono text-paper">{m.f1.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono text-paper">{m.macroRecall.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* F1 vs recall on the minority class — values printed next to every bar. */}
          <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2" role="group" aria-label={c.experiments.chartAlt}>
            {akwaModels.map((m) => (
              <div key={m.name}>
                <p className="mb-2 text-sm text-paper">{m.name}</p>
                <div className="space-y-1.5">
                  <Bar label="F1" value={m.f1} strong={m.name === 'Random Forest'} />
                  <Bar label={language === 'fr' ? 'Rappel' : 'Recall'} value={m.recall} strong={m.name === 'Random Forest'} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">{c.experiments.footnote}</p>

          <div className="mt-10 rounded-sm border border-line p-5">
            <p className="text-sm font-semibold text-paper">{c.experiments.unsupervisedTitle}</p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              {c.experiments.unsupervised}
              <Source>{language === 'fr' ? 'Rapport §3.6' : 'Report §3.6'}</Source>
            </p>
          </div>
        </Section>

        {/* 05 — Evaluation */}
        <Section id="evaluation" index={5} title={c.evaluation.title}>
          <p className="text-[15px] text-muted">{c.evaluation.intro}</p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <div className="rounded-sm border border-accent/40 bg-accent/[0.05] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">{c.evaluation.classMissing}</p>
                <div className="mt-5 space-y-3">
                  <Bar label={c.evaluation.headers.recall} value={rf.missing.recall} strong />
                  <Bar label={c.evaluation.headers.precision} value={rf.missing.precision} strong />
                  <Bar label="F1" value={rf.missing.f1} strong />
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs text-muted">{c.evaluation.accuracy}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-paper">{rf.accuracy.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">{c.evaluation.macroRecall}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-paper">{rf.macroRecall.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">{c.evaluation.testSet}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-paper">{fmt(rf.testSize)}</dd>
                </div>
              </dl>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[22rem] text-left text-sm">
                <caption className="sr-only">{c.evaluation.intro}</caption>
                <thead className="border-b border-line font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th scope="col" className="py-2 pr-3 font-normal">{c.evaluation.headers.cls}</th>
                    <th scope="col" className="py-2 pr-3 text-right font-normal">{c.evaluation.headers.precision}</th>
                    <th scope="col" className="py-2 pr-3 text-right font-normal">{c.evaluation.headers.recall}</th>
                    <th scope="col" className="py-2 pr-3 text-right font-normal">{c.evaluation.headers.f1}</th>
                    <th scope="col" className="py-2 text-right font-normal">{c.evaluation.headers.support}</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {[
                    [c.evaluation.classPresent, rf.present],
                    [c.evaluation.classMissing, rf.missing],
                  ].map(([name, r]) => {
                    const row = r as typeof rf.present
                    return (
                      <tr key={name as string} className="border-b border-line">
                        <th scope="row" className="py-3 pr-3 font-sans font-medium text-paper">{name as string}</th>
                        <td className="py-3 pr-3 text-right text-paper">{row.precision.toFixed(2)}</td>
                        <td className="py-3 pr-3 text-right text-paper">{row.recall.toFixed(2)}</td>
                        <td className="py-3 pr-3 text-right text-paper">{row.f1.toFixed(2)}</td>
                        <td className="py-3 text-right text-muted">{fmt(row.support)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="mt-6 rounded-sm border-l-2 border-accent pl-4 text-sm leading-relaxed text-paper/85">{c.evaluation.callout}</p>
              <p className="mt-4 text-xs leading-relaxed text-muted">{c.evaluation.noMatrix}</p>
            </div>
          </div>
        </Section>

        {/* 06 — Decisions */}
        <Section id="decisions" index={6} title={c.decisions.title}>
          <div className="grid gap-4 md:grid-cols-2">
            {c.decisions.items.map((d, i) => (
              <div key={d.title} className={`rounded-sm border border-line p-5 ${i === c.decisions.items.length - 1 ? 'md:col-span-2' : ''}`}>
                <p className="font-semibold text-paper">
                  {d.title}
                  <Source>{d.source}</Source>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 07 — Results & limits */}
        <Section id="limits" index={7} title={c.outcomes.title}>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                <Check size={13} aria-hidden="true" /> {c.outcomes.measuredTitle}
              </h3>
              <ul className="mt-4 space-y-3">
                {c.outcomes.measured.map((m) => (
                  <li key={m} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/80">
                <CircleDashed size={13} aria-hidden="true" /> {c.outcomes.limitsTitle}
              </h3>
              <ul className="mt-4 space-y-3">
                {c.outcomes.limits.map((m) => (
                  <li key={m} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-[0.6em] h-px w-3 shrink-0 bg-paper/40" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Presentation — only once publication has been approved (akwaPresentation set). */}
        {akwaPresentation && (
          <section id="presentation" className="scroll-mt-24 border-t border-line py-14">
            <div className="flex flex-col gap-6 rounded-sm border border-line bg-surface/40 p-6 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={akwaPresentation.cover} alt="" loading="lazy" width={240} height={135} className="w-full max-w-[15rem] rounded-sm border border-line" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-paper">{c.presentation.title}</h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{c.presentation.meta}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.presentation.text}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={akwaPresentation.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-accent"
                  >
                    <FileText size={15} aria-hidden="true" /> {c.presentation.read}
                  </a>
                  <a
                    href={akwaPresentation.href}
                    download
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line px-5 text-sm text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    <ArrowDownToLine size={15} aria-hidden="true" /> {c.presentation.download}
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="border-t border-line pt-8 text-xs leading-relaxed text-muted">
          <span className="font-mono uppercase tracking-[0.15em] text-paper/70">{c.sourcesTitle} — </span>
          {c.sources}
        </footer>
      </main>
    </div>
  )
}
