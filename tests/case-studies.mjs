// V2 checks: featured layout, case study pages, selector hint, i18n.
// Same setup as e2e.mjs: server running, then `npm run test:case-studies`.
import { chromium } from 'playwright-core'

const BASE = process.env.BASE || 'http://localhost:3000/'
const results = []
const ok = (name, pass, info = '') => {
  results.push({ name, pass })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? '  — ' + info : ''}`)
}
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' },
)
const PLACEHOLDERS = /lorem ipsum|à compléter|to be completed|todo|tbd|placeholder/i

// 1. Featured layout: one lead card spanning the row, two compact ones; every card links to its case study.
for (const w of [1440, 768, 390, 320]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, locale: 'fr-FR', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const selector = page.locator('#profiles')
  for (const i of [0, 1, 2]) {
    await selector.getByRole('button').nth(i).click()
    await page.waitForTimeout(300)
    const cards = await page.locator('#projects article').evaluateAll((els) =>
      els.map((el) => ({ w: el.getBoundingClientRect().width, links: [...el.querySelectorAll('a')].map((a) => a.getAttribute('href')) })),
    )
    ok(`[${w}] profile ${i}: 3 featured cards`, cards.length === 3)
    // Editorial index: rows share one width; the sticky preview only exists on large screens.
    const sameWidth = cards.every((c) => Math.abs(c.w - cards[0].w) < 2)
    const preview = await page.locator('#projects [aria-hidden="true"] .sticky').isVisible()
    ok(`[${w}] profile ${i}: index rows aligned`, sameWidth, cards.map((c) => Math.round(c.w)).join('/'))
    ok(`[${w}] profile ${i}: preview only on large screens`, preview === (w >= 1024))
    ok(`[${w}] profile ${i}: every card links to a case study`, cards.every((c) => c.links.some((h) => /^\/projects\/[a-z0-9-]+\/$/.test(h || ''))))
    ok(`[${w}] profile ${i}: no empty link`, cards.every((c) => c.links.every((h) => h && h !== '#')))
  }
  const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }))
  ok(`[${w}] no horizontal scroll (home)`, sw <= iw)
  await ctx.close()
}

// 2. Case study pages: reachable from the card, 200, documented content only, FR/EN.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const hrefs = new Set()
  const selector = page.locator('#profiles')
  for (const i of [0, 1, 2]) {
    await selector.getByRole('button').nth(i).click()
    await page.waitForTimeout(300)
    for (const h of await page.locator('#projects article a[href^="/projects/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))) hrefs.add(h)
  }
  ok('7 distinct case studies linked across profiles', hrefs.size === 7, [...hrefs].join(' '))

  for (const href of hrefs) {
    const res = await page.goto(new URL(href, BASE).toString(), { waitUntil: 'networkidle' })
    const info = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      text: document.body.innerText,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      title: document.title,
      sw: document.documentElement.scrollWidth,
      iw: innerWidth,
    }))
    ok(`${href}: 200 + single h1`, res.status() === 200 && info.h1 === 1)
    ok(`${href}: no placeholder text`, !PLACEHOLDERS.test(info.text))
    ok(`${href}: canonical + title`, info.canonical.endsWith(href) && info.title.includes('Jad Falaq'), info.canonical)
  }

  // Navigation from a card and back.
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await selector.getByRole('button').nth(1).click()
  await page.waitForTimeout(300)
  await page.locator('#projects article').first().getByRole('link', { name: /Lire l'étude de cas/ }).click()
  await page.waitForURL(/\/projects\/renault-digital-genai-qa\/$/)
  ok('card CTA opens the case study', true)
  ok('Renault case study: confidentiality note, no screenshot', await page.evaluate(() => document.body.innerText.includes('confidentialité') && !document.querySelector('main img[alt*="Agents"]')))
  ok('Renault case study: contributions from the experience entry', (await page.locator('main li').count()) >= 4)
  await page.getByRole('link', { name: /Retour aux projets/ }).click()
  await page.waitForURL(/\/#projects$/)
  ok('back link returns to #projects with profile kept', (await page.evaluate(() => document.documentElement.dataset.profile)) === 'genai')
  ok('hero has no profile selector (video + profile only)', (await page.locator('#hero button[aria-pressed]').count()) === 0)
  ok('unknown slug → 404', (await page.goto(new URL('/projects/unknown-project/', BASE).toString())).status() === 404)
  await ctx.close()
}

// 3. English: labels translated on home and case study.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(new URL('/projects/snani-dental-mlops/', BASE).toString(), { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const text = await page.evaluate(() => document.body.innerText)
  ok('EN case study: English labels', /Back to projects/i.test(text) && /Technologies/i.test(text) && !/Retour aux projets/i.test(text))
  const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }))
  ok('EN case study @390: no horizontal scroll', sw <= iw)
  await page.goto(BASE, { waitUntil: 'networkidle' })
  ok('EN home: case study CTA translated', (await page.getByRole('link', { name: /Read the case study/ }).count()) === 3)
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
