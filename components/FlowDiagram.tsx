import type { Language } from '../contexts/LanguageContext'
import type { FlowNode, L } from '../data/caseStudies'

// Vertical flow of the components actually present in a project (see docs/case-study-audit.md).
// Plain HTML so it wraps on small screens; exposed to assistive tech as one image with `alt`.
// Nodes sharing a `group` render side by side (parallel branches).
export default function FlowDiagram({ nodes, alt, language }: { nodes: FlowNode[]; alt: L; language: Language }) {
  const rows: FlowNode[][] = []
  for (const node of nodes) {
    const last = rows[rows.length - 1]
    if (node.group && last && last[0].group === node.group) last.push(node)
    else rows.push([node])
  }

  const tone: Record<NonNullable<FlowNode['kind']>, string> = {
    source: 'border-accent/50 bg-accent/[0.08]',
    process: 'border-line bg-ink/70',
    model: 'border-accent/60 bg-accent/[0.05]',
    output: 'border-dashed border-paper/30 bg-transparent',
    infra: 'border-line bg-surface/70',
  }

  return (
    <div role="img" aria-label={alt[language]} className="rounded-sm border border-line bg-surface/40 p-4 sm:p-6">
      {rows.map((row, i) => (
        <div key={i}>
          {i > 0 && <div className="mx-auto h-5 w-px bg-accent/50" aria-hidden="true" />}
          <div className={`grid gap-2 ${row.length === 2 ? 'sm:grid-cols-2' : row.length >= 3 ? 'sm:grid-cols-3' : ''}`}>
            {row.map((n) => (
              <div key={n.label.en} className={`rounded-sm border px-3 py-2.5 text-center ${tone[n.kind ?? 'process']}`}>
                <p className="text-sm font-medium text-paper">{n.label[language]}</p>
                {n.detail && <p className="mt-0.5 font-mono text-[11px] leading-snug text-muted">{n.detail[language]}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
