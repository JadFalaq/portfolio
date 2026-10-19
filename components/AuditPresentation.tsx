'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { akwaPresentation } from '../data/akwa'

export default function AuditPresentation({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage()
  const [page, setPage] = useState(1)
  const fr = language === 'fr'
  const title = fr ? 'Présentation Audit Intelligent' : 'Intelligent Audit presentation'
  const button = 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-30'

  return (
    <section
      aria-label={title}
      aria-roledescription={fr ? 'diaporama' : 'slideshow'}
      className="overflow-hidden rounded-lg border border-line bg-ink"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          setPage((current) => Math.min(akwaPresentation.pages, Math.max(1, current + (event.key === 'ArrowRight' ? 1 : -1))))
        }
      }}
    >
      <a
        href={`${akwaPresentation.href}#page=${page}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title} — ${fr ? 'ouvrir la page' : 'open page'} ${page} (${fr ? 'nouvel onglet' : 'new tab'})`}
        className="relative block aspect-video bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2"
      >
        <Image
          key={page}
          src={`/audit-presentation/page-${String(page).padStart(2, '0')}.webp`}
          alt={`${title} — ${fr ? 'diapositive' : 'slide'} ${page} / ${akwaPresentation.pages}`}
          fill
          unoptimized
          loading="eager"
          sizes={compact ? '(max-width: 1023px) 90vw, 30vw' : '(max-width: 768px) 90vw, 944px'}
          className="object-contain"
        />
      </a>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface px-3 py-2">
        <div className="flex items-center gap-2">
          <button type="button" className={button} disabled={page === 1} onClick={() => setPage((current) => current - 1)} aria-label={fr ? 'Page précédente' : 'Previous page'}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <span aria-live="polite" aria-atomic="true" className="min-w-[4rem] text-center font-mono text-xs tabular-nums text-paper">
            {page} / {akwaPresentation.pages}
          </span>
          <button type="button" className={button} disabled={page === akwaPresentation.pages} onClick={() => setPage((current) => current + 1)} aria-label={fr ? 'Page suivante' : 'Next page'}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
        <a href={akwaPresentation.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-xs text-paper/80 hover:text-accent">
          {compact ? 'PDF' : fr ? 'Ouvrir le PDF' : 'Open PDF'} <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
