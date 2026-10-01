import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.PORTFOLIO_TEST_URL || 'http://localhost:3000';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ headless: true });
const findings = [];
const errors = [];
const routes = ['/', '/projects', '/projects/extendedforms-io', '/projects/quzo-ai', '/projects/vocalxi', '/projects/hey-buddy', '/journey', '/field-guide'];
try {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${width}: ${error.message}`));
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response?.status(), 200, `${route} returns 200`);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1, `${route}: one h1`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `${width}px ${route}: no horizontal overflow`);
      const bounds = await page.locator('h1').boundingBox();
      assert.ok(bounds && bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= width + 1, `${route}: heading fits viewport`);
      if (route === '/' || route.startsWith('/projects')) {
        const hiddenContent = await page.locator('h1').evaluate(el => getComputedStyle(el).opacity === '0' || getComputedStyle(el).visibility === 'hidden');
        assert.equal(hiddenContent, false, `${route}: main heading is visible`);
      }
      if ([390, 1440].includes(width) && ['/', '/projects', '/projects/quzo-ai', '/projects/hey-buddy'].includes(route)) {
        const name = route === '/' ? 'home' : route.replaceAll('/', '-').slice(1);
        await page.screenshot({ path: `test-results/${name}-${width}.png`, fullPage: true });
      }
      findings.push({ width, route, status: response.status(), horizontalOverflow: overflow });
    }
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/projects/quzo-ai', { waitUntil: 'networkidle' });
  const openButton = page.getByRole('button', { name: 'Enlarge Quzo.ai screenshot', exact: true });
  await openButton.click();
  assert.equal(await page.locator('dialog[open]').count(), 1, 'enlarged viewer opens');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0, 'Escape closes enlarged viewer');
  assert.equal(await openButton.evaluate(el => el === document.activeElement), true, 'gallery focus restores');
  await page.getByRole('button', { name: /Show Quzo.ai screenshot 3:/ }).click();
  assert.equal(await page.getByRole('button', { name: /Show Quzo.ai screenshot 3:/ }).getAttribute('aria-current'), 'true');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('.pf-mobile-menu summary').click();
  await page.locator('.pf-mobile-menu-panel').getByRole('link', { name: 'Work', exact: true }).click();
  assert.equal(await page.locator('.pf-mobile-menu').getAttribute('open'), null, 'mobile anchor closes navigation');
  const resume = await context.request.get(base + '/downloads/Bhadreshkumar-malankiya-resume-full.pdf');
  assert.equal(resume.status(), 200, 'resume downloads');
  assert.ok((await resume.body()).subarray(0, 5).toString() === '%PDF-', 'resume is a PDF');
  await context.close();

  for (const options of [{ javaScriptEnabled: false }, { reducedMotion: 'reduce' }]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
    const p = await ctx.newPage();
    await p.goto(base, { waitUntil: 'networkidle' });
    assert.ok(await p.getByRole('heading', { level: 1 }).isVisible(), 'heading works without motion/JavaScript');
    assert.ok(await p.getByRole('link', { name: 'View selected work' }).isVisible(), 'CTA works without motion/JavaScript');
    await p.goto(base + '/projects/quzo-ai', { waitUntil: 'networkidle' });
    const screen = p.locator('.pf-gallery-media img').first();
    await screen.scrollIntoViewIfNeeded();
    await p.waitForFunction(() => { const img = document.querySelector('.pf-gallery-media img'); return img && img.complete && img.naturalWidth > 0; });
    findings.push({ mode: options, screenshotLoaded: true });
    await ctx.close();
  }
  assert.deepEqual(errors, [], 'No browser runtime errors');
  console.log(JSON.stringify({ passed: true, checks: findings.length, findings, runtimeErrors: errors }, null, 2));
  await writeFile('test-results/report.json', JSON.stringify({ passed: true, findings, runtimeErrors: errors }, null, 2));
} finally { await browser.close(); }
