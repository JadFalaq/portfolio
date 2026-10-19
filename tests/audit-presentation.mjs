import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const base = process.env.BASE || 'http://localhost:3100'
console.log('Starting browser checks')
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
try {
  for (const width of [390, 1440]) {
    for (const locale of ['fr-FR', 'en-US']) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, locale, reducedMotion: 'reduce' })
      console.log(`Checking ${width}px ${locale}`)
      page.setDefaultTimeout(15000)
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      for (const route of ['/', '/projects/akwa-audit-intelligent/']) {
        await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' })
        const viewer = page.locator('section[aria-roledescription]').filter({ has: page.locator('img[src*="audit-presentation"]') }).first()
        await viewer.scrollIntoViewIfNeeded()
        const previous = viewer.getByRole('button', { name: /Page précédente|Previous page/ })
        const next = viewer.getByRole('button', { name: /Page suivante|Next page/ })
        assert(await previous.isDisabled())
        await next.click()
        assert.match(await viewer.locator('img').getAttribute('alt'), /2 \/ 28/)
        await next.press('ArrowRight')
        assert.match(await viewer.locator('img').getAttribute('alt'), /3 \/ 28/)
        await previous.click()
        assert.match(await viewer.locator('a').first().getAttribute('href'), /#page=2$/)
        if (route !== '/') {
          for (let i = 2; i < 28; i++) await next.click()
          assert(await next.isDisabled())
          assert.match(await viewer.locator('img').getAttribute('alt'), /28 \/ 28/)
        }
        await viewer.locator('img').evaluate((image) => Promise.race([image.decode(), new Promise((_, reject) => setTimeout(() => reject(new Error('Slide failed to load')), 15000))]))
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      }
      assert.deepEqual(errors, [])
      console.log(`PASS presentation: ${width}px, ${locale}, home + case study`)
      await page.close()
    }
  }
  const response = await browser.newContext()
  const pdf = await response.request.get(new URL('/presentation_audit_intelligent.pdf', base).href)
  assert.equal(pdf.status(), 200)
  assert((await pdf.body()).subarray(0, 5).equals(Buffer.from('%PDF-')))
  for (let i = 1; i <= 28; i++) {
    const slide = await response.request.get(new URL(`/audit-presentation/page-${String(i).padStart(2, '0')}.webp`, base).href)
    assert.equal(slide.status(), 200)
  }
  console.log('PASS PDF + 28 slide assets')
  await response.close()
} finally {
  await browser.close()
}
