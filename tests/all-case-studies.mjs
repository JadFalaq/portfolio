// Every project's case study: routes, content hygiene, SEO, links, i18n, responsive, keyboard.
// Same setup as e2e.mjs: server running, then `npm run test:all-case-studies` (BASE / CHROME_PATH optional).
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const BASE = process.env.BASE || 'http://localhost:3000/'
const results = []
const ok = (name, pass, info = '') => {
  results.push({ name, pass })
  if (!pass || process.env.VERBOSE) console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? '  — ' + info : ''}`)
}

// Slugs and GitHub URLs straight from the data file (single source of truth).
const content = readFileSync(new URL('../data/content.ts', import.meta.url), 'utf8')
const meta = content.slice(content.indexOf('const projectMeta'), content.indexOf('const projectsFr'))
const projects = [...meta.matchAll(/\n  (\w+): \{\n([\s\S]*?)\n  \},/g)].map(([, id, body]) => ({
  id,
  slug: body.match(/slug: '([^']+)'/)?.[1],
  github: body.match(/github: '([^']+)'/)?.[1],
}))
const PLACEHOLDERS = /lorem ipsum|coming soon|à compléter|to be completed|data unavailable|\bTODO\b|\bTBD\b|placeholder/i

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' },
)

ok('every project has a slug', projects.length === 15 && projects.every((p) => p.slug), `${projects.filter((p) => p.slug).length}/${projects.length}`)

// 1. Each case study, FR and EN, desktop and mobile.
for (const locale of ['fr-FR', 'en-US']) {
  for (const w of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, locale, reducedMotion: 'reduce' })
    for (const p of projects) {
      const page = await ctx.newPage()
      const errors = []
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      page.on('pageerror', (e) => errors.push(String(e)))
      const tag = `[${locale.slice(0, 2)} ${w}] ${p.slug}`
      const res = await page.goto(new URL(`/projects/${p.slug}/`, BASE).toString(), { waitUntil: 'networkidle' })
      await page.waitForTimeout(150)
      const info = await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        h2: document.querySelectorAll('main h2').length,
        text: document.body.innerText,
        title: document.title,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        sw: document.documentElement.scrollWidth,
        iw: innerWidth,
        emptyLinks: [...document.querySelectorAll('a')].filter((a) => !a.getAttribute('href') || a.getAttribute('href') === '#').length,
        unsafeBlank: [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener/.test(a.rel)).length,
        brokenImages: [...document.querySelectorAll('main img')].filter((i) => i.complete && i.naturalWidth === 0).length,
        github: [...document.querySelectorAll('a[href^="https://github.com"]')].map((a) => a.href),
        figures: document.querySelectorAll('[role="img"]').length,
        labelledFigures: [...document.querySelectorAll('[role="img"]')].filter((d) => (d.getAttribute('aria-label') || '').length > 40).length,
      }))
      ok(`${tag}: 200, one h1, sections`, res.status() === 200 && info.h1 === 1 && info.h2 >= 3, `h2=${info.h2}`)
      ok(`${tag}: no placeholder`, !PLACEHOLDERS.test(info.text))
      ok(`${tag}: SEO title + canonical`, info.title.includes('Jad Falaq') && info.canonical.endsWith(`/projects/${p.slug}/`))
      ok(`${tag}: no horizontal scroll`, info.sw <= info.iw, `${info.sw}/${info.iw}`)
      ok(`${tag}: links valid`, info.emptyLinks === 0 && info.unsafeBlank === 0)
      ok(`${tag}: images load`, info.brokenImages === 0)
      ok(`${tag}: GitHub matches data`, p.github ? info.github.some((h) => h.startsWith(p.github)) : info.github.length === 0, p.github || 'none')
      ok(`${tag}: no console errors`, errors.length === 0, errors[0])
      ok(`${tag}: every diagram has a text alternative`, info.figures === info.labelledFigures, `${info.labelledFigures}/${info.figures}`)
      if (locale === 'en-US' && w === 1440) ok(`${tag}: English labels`, /Back to projects/i.test(info.text) && !/Retour aux projets/i.test(info.text))
      await page.close()
    }
    await ctx.close()
  }
}

// 2. Every card on the home page (featured + "view all", three profiles) points to an existing case study.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const seen = new Set()
  for (const i of [0, 1, 2]) {
    await page.evaluate(() => scrollTo(0, 0))
    await page.locator('#profiles').getByRole('button').nth(i).click()
    await page.waitForTimeout(300)
    const toggle = page.getByRole('button', { name: /Voir tous mes projets/ })
    await toggle.click()
    await page.waitForTimeout(300)
    const hrefs = await page.locator('#projects a[href^="/projects/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    hrefs.forEach((h) => seen.add(h))
    const cards = await page.locator('#all-projects h3 + div > div').count()
    const cardLinks = await page.locator('#all-projects a[href^="/projects/"]').count()
    ok(`profile ${i}: every "view all" card links to its case study`, cardLinks >= cards && cards > 0, `${cardLinks}/${cards}`)
    await page.getByRole('button', { name: /Masquer les autres projets/ }).click()
  }
  const expected = new Set(projects.map((p) => `/projects/${p.slug}/`))
  const missing = [...expected].filter((h) => !seen.has(h))
  ok('all 15 case studies reachable from the home page', missing.length === 0, missing.join(' ') || `${seen.size} linked`)
  for (const h of seen) {
    const res = await page.request.get(new URL(h, BASE).toString())
    ok(`card link ${h} → 200`, res.status() === 200)
  }
  await ctx.close()
}

// 3. Responsive sweep on a sample of pages (long tables, diagrams, dedicated AKWA page).
for (const slug of ['snani-dental-mlops', 'cvmatch', 'arabert-medical-misinformation', 'akwa-audit-intelligent']) {
  for (const w of [320, 375, 430, 768, 1024]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, locale: 'fr-FR', reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.goto(new URL(`/projects/${slug}/`, BASE).toString(), { waitUntil: 'networkidle' })
    const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }))
    ok(`[${w}] ${slug}: no horizontal scroll`, sw <= iw, `${sw}/${iw}`)
    await ctx.close()
  }
}

// 4. Keyboard: the first tab stops on a case study are the back link and the language toggle, with a visible ring.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(new URL('/projects/cvmatch/', BASE).toString(), { waitUntil: 'networkidle' })
  const stops = []
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab')
    stops.push(await page.evaluate(() => ({ t: (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent || '').trim().slice(0, 24), ring: getComputedStyle(document.activeElement).outlineStyle !== 'none' })))
  }
  ok('keyboard: back link first, focus ring visible', /Retour aux projets/.test(stops[0].t) && stops.every((s) => s.ring), stops.map((s) => s.t).join(' › '))
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Enter')
  await page.waitForURL(/\/#projects$/)
  ok('keyboard: back link returns to #projects', true)
  ok('unknown slug → 404', (await page.goto(new URL('/projects/does-not-exist/', BASE).toString())).status() === 404)
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
