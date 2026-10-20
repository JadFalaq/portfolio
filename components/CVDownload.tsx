'use client'

import { useId, useRef } from 'react'
import { Download, X } from 'lucide-react'
import { useLanguage, type Language } from '../contexts/LanguageContext'

interface CVDownloadProps {
  files: Record<Language, string>
  profileTitle: string
  label: string
  variant?: 'hero' | 'section' | 'footer'
}

const styles = {
  hero: 'group flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-paper/25 px-7 text-sm tracking-wide text-paper transition-colors duration-200 ease-out hover:border-accent hover:bg-accent/[0.06] hover:text-accent',
  section: 'group inline-flex min-h-[48px] max-w-full items-center gap-3 rounded-full bg-ink px-6 py-3 text-left text-sm text-paper transition-colors hover:bg-surface',
  footer: 'flex min-h-11 items-center gap-1.5 text-paper transition-colors hover:text-accent',
}

export default function CVDownload({ files, profileTitle, label, variant = 'hero' }: CVDownloadProps) {
  const { language } = useLanguage()
  const dialog = useRef<HTMLDialogElement>(null)
  const id = useId()
  const fr = language === 'fr'

  return (
    <>
      <button type="button" aria-haspopup="dialog" aria-controls={id} onClick={() => dialog.current?.showModal()} className={styles[variant]}>
        <Download size={variant === 'footer' ? 12 : 16} aria-hidden="true" />
        <span>
          {label}
          {variant === 'section' && <span className="mt-0.5 block text-xs text-accent">{profileTitle}</span>}
        </span>
      </button>
      <dialog
        ref={dialog}
        id={id}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        className="fixed inset-0 m-auto w-[90vw] max-w-md rounded-2xl border border-line bg-ink p-6 text-paper shadow-2xl backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect()
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close()
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={`${id}-title`} className="pt-2 text-xl font-semibold">{fr ? 'Choisir la langue du CV' : 'Choose your CV language'}</h2>
          <button type="button" onClick={() => dialog.current?.close()} aria-label={fr ? 'Fermer' : 'Close'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line hover:border-accent hover:text-accent">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <p id={`${id}-description`} className="mt-3 text-sm leading-relaxed text-muted">{profileTitle} · PDF</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(['fr', 'en'] as const).map((cvLanguage) => (
            <a
              key={cvLanguage}
              href={files[cvLanguage]}
              download
              hrefLang={cvLanguage}
              aria-label={`${fr ? 'Télécharger' : 'Download'} ${profileTitle} — ${cvLanguage === 'fr' ? 'Français' : 'English'} (PDF)`}
              onClick={() => dialog.current?.close()}
              className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              <span lang={cvLanguage}>{cvLanguage === 'fr' ? 'Français' : 'English'}</span>
              <Download size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </dialog>
    </>
  )
}
