// Interaction-quality checks (premium interactions pass). Same setup as e2e.mjs:
// server running, then `npm run test:interactions` (BASE / CHROME_PATH optional).
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
const ctxFor = (opts = {}) => browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', ...opts })

// 1. Hero without JavaScript: content painted and fully opaque.
{
  const ctx = await ctxFor({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(1200) // longest CSS entrance: 300ms delay + 450ms
  const r = await page.evaluate(() => {
    const op = (el) => Number(getComputedStyle(el).opacity)
    const h1 = document.querySelector('h1')
    const ctas = [...document.querySelectorAll('#hero a')].filter((a) => /Explorer mes projets|Télécharger mon CV|Me contacter/.test(a.textContent))
    return { h1: h1 && h1.textContent.includes('Jad Falaq'), heroOpacity: Math.min(...[...document.querySelectorAll('#hero .hero-rise')].map(op)), ctas: ctas.length }
  })
  ok('no-JS: h1 with name rendered', r.h1)
  ok('no-JS: hero fully visible', r.heroOpacity === 1, `min opacity=${r.heroOpacity}`)
  ok('no-JS: 3 CTAs present', r.ctas === 3)
  await ctx.close()
}

// 2. Reduced motion: hero visible at the very first frame, no transitions on cards.
{
  const ctx = await ctxFor({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  const r = await page.evaluate(() => ({
    anim: [...document.querySelectorAll('.hero-rise')].every((el) => getComputedStyle(el).animationName === 'none'),
    opacity: Math.min(...[...document.querySelectorAll('.hero-rise')].map((el) => Number(getComputedStyle(el).opacity))),
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
  }))
  ok('reduced motion: no hero animation', r.anim)
  ok('reduced motion: hero opaque immediately', r.opacity === 1)
  ok('reduced motion: no smooth scroll', r.scroll === 'auto', r.scroll)
  await ctx.close()
}

// 3. Desktop hover / keyboard focus on featured cards; profile switch is immediate.
{
  const ctx = await ctxFor()
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const card = page.locator('#projects article').first()
  await card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  await card.hover()
  await page.waitForTimeout(400)
  const hover = await card.evaluate((el) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
    const img = el.querySelector('.card-media')
    const s = img ? new DOMMatrixReadOnly(getComputedStyle(img).transform).a : 1
    return { ty: m.m42, scale: s, border: getComputedStyle(el).borderTopColor }
  })
  ok('hover: card lifts ≤3px', hover.ty < 0 && hover.ty >= -3, `ty=${hover.ty}`)
  ok('hover: image zoom ≤1.02', hover.scale > 1 && hover.scale <= 1.0201, `scale=${hover.scale.toFixed(3)}`)
  const td = await card.evaluate((el) => getComputedStyle(el).transitionDuration)
  ok('hover: transition 200–250ms', td.split(',').every((d) => parseFloat(d) >= 0.2 && parseFloat(d) <= 0.25), td)

  await page.mouse.move(5, 5)
  await card.locator('a').first().focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await page.waitForTimeout(300)
  const focusBorder = await card.evaluate((el) => getComputedStyle(el).borderTopColor)
  const restBorder = await page.locator('#projects article').nth(2).evaluate((el) => getComputedStyle(el).borderTopColor)
  ok('keyboard: focus-within accentuates border', focusBorder !== restBorder, `${focusBorder} vs ${restBorder}`)

  // Profile switch: new titles in the DOM synchronously, never below 40% opacity.
  await page.evaluate(() => scrollTo(0, 0))
  const selector = page.getByRole('group', { name: 'Choisir un profil' })
  await selector.getByRole('button').nth(1).click()
  const swap = await page.evaluate(() => {
    const art = document.querySelector('#projects article')
    return { title: art.querySelector('h3').textContent, opacity: Number(getComputedStyle(art.parentElement).opacity) }
  })
  ok('profile switch: new featured content immediately', swap.title.includes('Renault'), swap.title)
  ok('profile switch: content never hidden', swap.opacity >= 0.4, `opacity=${swap.opacity}`)
  await page.waitForTimeout(400)
  const ind = await selector.locator('button[aria-pressed="true"] span[aria-hidden="true"].absolute').count()
  ok('profile switch: animated indicator on active button', ind === 1)

  // Section indicator follows the scroll.
  await page.evaluate(() => document.getElementById('contact').scrollIntoView({ behavior: 'instant' }))
  await page.waitForTimeout(500)
  const current = await page.locator('nav a[aria-current="location"]').allTextContents()
  ok('nav: aria-current on active section', current.length === 1 && current[0] === 'Contact', JSON.stringify(current))
  await ctx.close()
}

// 4. Touch devices: no hover lift.
{
  const ctx = await ctxFor({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const card = page.locator('#projects article').first()
  await card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  await card.locator('h3').tap()
  await page.waitForTimeout(400)
  const ty = await card.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42)
  ok('touch: no hover lift', ty === 0, `ty=${ty}`)
  await ctx.close()
}

// 5. Layout stability: cumulative layout shift during load + profile switches.
for (const w of [390, 1440]) {
  const ctx = await ctxFor({ viewport: { width: w, height: 900 } })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    window.__cls = 0
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value })).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const cls = await page.evaluate(() => window.__cls)
  ok(`CLS on load @${w}px < 0.1`, cls < 0.1, cls.toFixed(4))
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
