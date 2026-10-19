// Functional + responsive checks for the portfolio.
// Usage: `npm run build && npm start` in one terminal, then `npm run test:e2e`.
// Uses an already-installed Chrome (no browser download): set CHROME_PATH to
// point at another Chromium-based binary, BASE to test another URL (e.g. a preview).
import { chromium } from 'playwright-core'

const BASE = process.env.BASE || 'http://localhost:3000/'
const OUT = process.env.OUT
const results = []
const ok = (name, pass, info = '') => {
  results.push({ name, pass, info })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? '  — ' + info : ''}`)
}

const EXPECT = {
  'data-ai': { cv: '/CV_Jad_Falaq_DataAI_FR.pdf', featured: ['Audit Intelligent', 'Renault Digital', "Pipeline automatisé"] },
  genai: { cv: '/CV_Jad_Falaq_GenAI_FR.pdf', featured: ['Renault Digital', 'cvmatch', 'Stratégies RAG'] },
  mlops: { cv: '/CV_Jad_Falaq_MLOps_FR.pdf', featured: ['Détection de pathologies dentaires', 'Audit Intelligent', 'désinformation médicale'] },
}
const LABELS = { 'data-ai': 0, genai: 1, mlops: 2 }

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' },
)

// 1. Responsive: no horizontal overflow, hero screenshot at each width.
for (const w of [320, 375, 390, 430, 768, 1024, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, locale: 'fr-FR', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }))
  ok(`no horizontal scroll @${w}px`, sw <= iw, `scrollWidth=${sw} innerWidth=${iw}`)
  const h1 = await page.locator('h1').boundingBox()
  ok(`h1 fits @${w}px`, h1 && h1.x >= 0 && h1.x + h1.width <= w, JSON.stringify(h1 && { x: Math.round(h1.x), w: Math.round(h1.width) }))
  for (const name of ['Explorer mes projets', 'Télécharger mon CV', 'Me contacter']) {
    const box = await page.getByRole('link', { name: new RegExp(name) }).first().boundingBox()
    ok(`CTA "${name}" ≥44px tall @${w}px`, box && box.height >= 44, box ? `h=${Math.round(box.height)}` : 'missing')
  }
  if (OUT) await page.screenshot({ path: `${OUT}/pw_hero_${w}.png` })
  await page.locator('#projects').scrollIntoViewIfNeeded()
  await page.evaluate(() => document.getElementById('projects').scrollIntoView())
  await page.waitForTimeout(300)
  if (OUT && [375, 768, 1440].includes(w)) await page.screenshot({ path: `${OUT}/pw_projects_${w}.png`, fullPage: false })
  await ctx.close()
}

// 2. Profile → featured projects → CV, at desktop and mobile.
for (const w of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, locale: 'fr-FR', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const selector = page.locator('#profiles')
  for (const [id, exp] of Object.entries(EXPECT)) {
    const btn = selector.getByRole('button').nth(LABELS[id])
    await btn.click()
    await page.waitForTimeout(450)
    ok(`[${w}] ${id}: selector aria-pressed`, (await btn.getAttribute('aria-pressed')) === 'true')
    ok(`[${w}] ${id}: html[data-profile]`, (await page.evaluate(() => document.documentElement.dataset.profile)) === id)
    const cvHref = await page.getByRole('link', { name: /Télécharger mon CV/ }).first().getAttribute('href')
    ok(`[${w}] ${id}: hero CV link`, cvHref === exp.cv, cvHref)
    const res = await page.request.get(new URL(cvHref, BASE).toString())
    ok(`[${w}] ${id}: CV served as PDF`, res.status() === 200 && res.headers()['content-type'] === 'application/pdf')
    const titles = await page.locator('#projects article h3').allTextContents()
    ok(`[${w}] ${id}: exactly 3 featured`, titles.length === 3, titles.length + '')
    ok(`[${w}] ${id}: featured order`, exp.featured.every((f, i) => titles[i]?.includes(f)), titles.join(' | '))
    const emptyLinks = await page.locator('#projects article a').evaluateAll((as) => as.filter((a) => !a.getAttribute('href')).length)
    ok(`[${w}] ${id}: no empty featured links`, emptyLinks === 0)
    const cvSection = await page.locator('#cv a[download]').getAttribute('href')
    ok(`[${w}] ${id}: CV section link`, cvSection === exp.cv, cvSection)
  }

  // View all projects.
  const toggle = page.getByRole('button', { name: /Voir tous mes projets/ })
  const label = await toggle.textContent()
  await toggle.click()
  await page.waitForTimeout(300)
  const others = await page.locator('#all-projects h3 + div > div').count()
  const total = Number(label.match(/\((\d+)\)/)?.[1])
  ok(`[${w}] view all shows every project`, others + 3 === total && total === 14, `others=${others} total=${total}`)
  ok(`[${w}] toggle aria-expanded`, (await page.getByRole('button', { name: /Masquer les autres projets/ }).getAttribute('aria-expanded')) === 'true')

  // Persistence after refresh (last selected = mlops).
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  ok(`[${w}] profile persists after reload`, (await page.evaluate(() => document.documentElement.dataset.profile)) === 'mlops')
  // Back to a previous selection.
  await selector.getByRole('button').nth(0).click()
  await page.waitForTimeout(300)
  ok(`[${w}] back to data-ai`, (await page.evaluate(() => document.documentElement.dataset.profile)) === 'data-ai')

  // CTA anchors land below the fixed nav.
  for (const [name, target] of [['Explorer mes projets', 'projects'], ['Me contacter', 'contact']]) {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.getByRole('link', { name: new RegExp(name) }).first().click()
    // Wait for the smooth scroll to settle.
    let prev = -1
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(150)
      const y = await page.evaluate(() => window.scrollY)
      if (y === prev) break
      prev = y
    }
    const top = await page.evaluate((t) => document.getElementById(t).getBoundingClientRect().top, target)
    const navH = await page.evaluate(() => document.querySelector('nav').getBoundingClientRect().height)
    ok(`[${w}] CTA "${name}" scrolls to #${target}`, Math.abs(top) < 120 && top >= navH - 2, `top=${Math.round(top)} nav=${Math.round(navH)}`)
  }

  if (w === 390) {
    await page.evaluate(() => window.scrollTo(0, 0))
    const menuBtn = page.getByRole('button', { name: 'Menu' })
    await menuBtn.click()
    await page.waitForTimeout(400)
    ok('[390] menu opens (aria-expanded)', (await menuBtn.getAttribute('aria-expanded')) === 'true')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    ok('[390] Escape closes menu', (await menuBtn.getAttribute('aria-expanded')) === 'false')
    await menuBtn.click()
    await page.waitForTimeout(400)
    await page.locator('#mobile-menu a', { hasText: 'Contact' }).click()
    await page.waitForTimeout(600)
    ok('[390] menu link closes menu', (await menuBtn.getAttribute('aria-expanded')) === 'false')
  }
  await ctx.close()
}

// 3. Keyboard: focus reaches the hero CTAs and selector, focus ring visible.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const seen = []
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab')
    seen.push(await page.evaluate(() => {
      const el = document.activeElement
      const cs = getComputedStyle(el)
      return { label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30), outline: cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px' }
    }))
  }
  const labels = seen.map((s) => s.label)
  ok('keyboard reaches "Explorer mes projets"', labels.some((l) => l.includes('Explorer mes projets')))
  ok('keyboard reaches the profile selector', labels.some((l) => l.includes('Data & IA')))
  ok('focus ring visible on every tab stop', seen.every((s) => s.outline), labels.join(' › '))
  if (OUT) await page.screenshot({ path: `${OUT}/pw_focus.png` })
  await ctx.close()
}

// 4. English locale renders the EN CV.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const selector = page.locator('#profiles')
  for (const [i, file] of ['DataAI', 'GenAI', 'MLOps'].entries()) {
    await selector.getByRole('button').nth(i).click()
    await page.waitForTimeout(300)
    const href = await page.getByRole('link', { name: /Download my CV/ }).first().getAttribute('href')
    const res = await page.request.get(new URL(href, BASE).toString())
    ok(`EN: ${file} CV link + PDF`, href === `/CV_Jad_Falaq_${file}_EN.pdf` && res.headers()['content-type'] === 'application/pdf', href)
  }
  ok('EN: html lang=en', (await page.evaluate(() => document.documentElement.lang)) === 'en')
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
