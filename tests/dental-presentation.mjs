import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.BASE || 'http://localhost:3100/'
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
try {
  for (const width of [390, 1440]) {
    for (const locale of ['fr-FR', 'en-US']) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, locale, reducedMotion: 'reduce' })
      page.setDefaultTimeout(15000)
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
      const viewer = () => page.locator('section[aria-roledescription]').filter({ has: page.locator('img[src*="/dental-presentation/"]') }).first()
      const checkSlide = async number => {
        const filename = `page-${String(number).padStart(2, '0')}.webp`
        const img = viewer().locator('img')
        await img.evaluate(image => image.decode())
        const currentSrc = await img.evaluate(image => image.currentSrc)
        assert.equal(new URL(currentSrc).pathname, `/dental-presentation/${filename}`)
        const actual = await page.evaluate(async src => Array.from(new Uint8Array(await (await fetch(src)).arrayBuffer())), currentSrc)
        const expected = await readFile(new URL(`../public/dental-presentation/${filename}`, import.meta.url))
        assert.deepEqual(Buffer.from(actual), expected)
        assert.match(await img.getAttribute('alt'), new RegExp(`${number} / 24$`))
        return img.screenshot()
      }
      const checkNavigation = async () => {
        await viewer().scrollIntoViewIfNeeded()
        const previous = viewer().getByRole('button', { name: /Page précédente|Previous page/ })
        const next = viewer().getByRole('button', { name: /Page suivante|Next page/ })
        assert(await previous.isDisabled())
        const first = await checkSlide(1)
        await next.click()
        assert.notDeepEqual(await checkSlide(2), first, 'The preview must actually change')
        await next.press('ArrowRight')
        await checkSlide(3)
        await previous.click()
        await checkSlide(2)
      }
      // The catalog uses a stretched case-study link: carousel controls must stay independent.
      await page.goto(base, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: /Voir tous mes projets|View all my projects/ }).click()
      await checkNavigation()
      assert.equal(new URL(page.url()).pathname, '/')
      // The ML profile also shows Snani as a featured project.
      await page.locator('#profiles').getByRole('button').nth(2).click()
      await checkNavigation()
      await page.goto(new URL('/projects/snani-dental-mlops/', base).href, { waitUntil: 'networkidle' })
      await checkNavigation()
      const next = viewer().getByRole('button', { name: /Page suivante|Next page/ })
      for (let i = 2; i < 24; i++) await next.click()
      await checkSlide(24)
      assert(await next.isDisabled())
      const rows = page.locator('#results tbody tr')
      assert.equal(await rows.count(), 6)
      assert.deepEqual(await rows.nth(1).locator('th,td').allTextContents(), ['Champion', 'test', '0.860', '0.467', '0.422', '0.211'])
      assert.deepEqual(await rows.nth(5).locator('th,td').allTextContents(), ['Candidate', 'external', '0.757', '0.383', '0.332', '0.160'])
      assert((await page.locator('body').innerText()).includes(locale === 'fr-FR' ? 'français et en arabe' : 'French and Arabic'))
      assert(await page.locator('a[href="https://snani.vercel.app/"]').count() > 0)
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      const download = page.locator('a[download]')
      const pdf = await page.request.get(new URL(await download.getAttribute('href'), base).href)
      assert.equal(pdf.status(), 200)
      assert((await pdf.body()).subarray(0, 5).equals(Buffer.from('%PDF-')))
      assert.deepEqual(errors, [])
      await viewer().scrollIntoViewIfNeeded()
      await page.screenshot({ path: `/tmp/snani-portfolio-${width}-${locale}.png` })
      console.log(`PASS Snani ${width}px ${locale}: catalog, featured, 24 slides, case study, metrics, PDF`)
      await page.close()
    }
  }
} finally {
  await browser.close()
}
