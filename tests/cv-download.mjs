import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const BASE = process.env.BASE || 'http://localhost:3100/'
const stems = ['Data_AI_Engineer', 'GenAI_Engineer', 'ML_Engineer']
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
try {
  for (const width of [390, 1440]) {
    for (const locale of ['fr-FR', 'en-US']) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, locale, reducedMotion: 'reduce' })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto(BASE, { waitUntil: 'networkidle' })
      const hero = page.locator('#hero').getByRole('button', { name: /Télécharger mon CV|Download my CV/ })
      for (const [index, stem] of stems.entries()) {
        await page.locator('#profiles').getByRole('button').nth(index).click()
        for (const language of ['fr', 'en']) {
          const filename = `CV_Jad_Falaq_Portfolio_${stem}${language === 'en' ? '_EN' : ''}.pdf`
          await hero.click()
          const modal = page.getByRole('dialog')
          assert(await modal.isVisible())
          assert.equal(await modal.locator('a[download]').count(), 2)
          const link = modal.locator(`a[hreflang=${language}]`)
          assert.equal(await link.getAttribute('href'), `/cv/${filename}`)
          const [download] = await Promise.all([page.waitForEvent('download'), link.click()])
          assert.equal(download.suggestedFilename(), filename)
          const stream = await download.createReadStream()
          const chunks = []
          for await (const chunk of stream) chunks.push(chunk)
          assert.deepEqual(Buffer.concat(chunks), await readFile(new URL(`../public/cv/${filename}`, import.meta.url)))
          assert(!await modal.isVisible())
        }
        for (const trigger of [page.locator('#cv').getByRole('button', { name: /Télécharger le CV|Download CV/ }), page.locator('footer').getByRole('button', { name: 'CV', exact: true })]) {
          await trigger.click()
          const modal = page.getByRole('dialog')
          for (const language of ['fr', 'en']) {
            assert.equal(await modal.locator(`a[hreflang=${language}]`).getAttribute('href'), `/cv/CV_Jad_Falaq_Portfolio_${stem}${language === 'en' ? '_EN' : ''}.pdf`)
          }
          for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Tab')
            assert(await modal.evaluate(dialog => dialog.contains(document.activeElement)), 'Focus stays inside the dialog')
          }
          await page.keyboard.press('Escape')
          assert(!await modal.isVisible())
          assert(await trigger.evaluate(element => element === document.activeElement), 'Focus returns to the download button')
        }
      }
      await hero.click()
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      await page.screenshot({ path: `/tmp/portfolio-cv-choice-${width}-${locale}.png` })
      assert.deepEqual(errors, [])
      console.log(`PASS ${width}px ${locale}: 3 profiles × 2 PDF languages, all 3 entry points, downloads, keyboard`)
      await page.close()
    }
  }
} finally { await browser.close() }
