import type { AkwaCopy } from '../data/akwa'

interface AkwaPipelineProps {
  copy: AkwaCopy['pipeline']
  /** `panel` = vertical flow (desktop preview), `compact` = wrapped chips (small screens). */
  variant?: 'panel' | 'compact'
}

// Synthetic view of the documented pipeline (report + repository) — not a production
// architecture. Built from HTML so it stays legible and translatable; the whole figure is
// exposed to assistive tech as one image with a text alternative.
export default function AkwaPipeline({ copy, variant = 'panel' }: AkwaPipelineProps) {
  const last = copy.steps.length - 1

  if (variant === 'compact') {
    return (
      <div role="img" aria-label={copy.alt} className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {copy.sources.map((s) => (
            <span key={s} className="rounded-sm border border-accent/40 bg-accent/[0.08] px-2 py-1 font-mono text-[10px] text-paper">
              {s}
            </span>
          ))}
        </div>
        <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[11px] text-paper/85">
          {copy.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className={`rounded-full border px-2 py-0.5 ${i === 4 ? 'border-accent text-paper' : 'border-line'} ${i === last ? 'border-dashed' : ''}`}>
                {step}
              </span>
              {i < last && <span className="text-accent/70">→</span>}
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div role="img" aria-label={copy.alt} className="flex h-full flex-col justify-center gap-3 p-6 lg:p-8">
      <div className="grid grid-cols-2 gap-2">
        {copy.sources.map((s) => (
          <div key={s} className="rounded-sm border border-accent/40 bg-accent/[0.07] px-3 py-2 text-center font-mono text-[11px] text-paper">
            {s}
          </div>
        ))}
      </div>
      <ol className="relative space-y-1.5 pl-6">
        {/* Spine */}
        <span className="absolute bottom-3 left-[7px] top-1 w-px bg-gradient-to-b from-accent/70 to-accent/10" aria-hidden="true" />
        {copy.steps.map((step, i) => (
          <li key={step} className="relative">
            <span
              className={`absolute -left-6 top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full border ${
                i === 4 ? 'border-accent bg-accent' : 'border-accent/60 bg-ink'
              }`}
              aria-hidden="true"
            />
            <div
              className={`flex items-center justify-between gap-3 rounded-sm border px-3 py-2 text-[13px] ${
                i === 4 ? 'border-accent/60 bg-accent/[0.08] font-semibold text-paper' : 'border-line bg-ink/60 text-paper/85'
              } ${i === last ? 'border-dashed' : ''}`}
            >
              <span>{step}</span>
              <span className="font-mono text-[10px] text-muted">{i === last ? copy.envisaged : String(i + 1).padStart(2, '0')}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
