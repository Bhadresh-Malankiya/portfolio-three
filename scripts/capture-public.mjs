// One-time anonymous capture of explicitly allowlisted PUBLIC marketing pages.
// No credentials, private dashboards, paywalls or sign-up actions are used.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const output = 'public/images/captured';
await mkdir(output, { recursive: true });
await mkdir('docs/portfolio-redesign', { recursive: true });
const browser = await chromium.launch();
const report = [];
const captured = {};
const allowed = [
  { slug: 'vocalxi', url: 'https://vocalxi.com', host: 'vocalxi.com', title: /vocalxi/i, label: 'VocalXI' },
  { slug: 'extendedforms-io', url: 'https://extendedforms.io', host: 'extendedforms.io', title: /extended\s*forms/i, label: 'ExtendedForms' },
];
try {
  for (const item of allowed) {
    const images = [], imageCaptions = [];
    for (const size of [{ name: 'desktop', width: 1440, height: 960 }, { name: 'mobile', width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const page = await context.newPage();
      try {
        const response = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        assert.ok(response?.ok(), 'Public page must load successfully');
        const resolved = new URL(page.url());
        assert.ok(resolved.hostname === item.host || resolved.hostname === `www.${item.host}`, 'Do not follow off-site redirects');
        await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
        await page.evaluate(() => document.fonts.ready);
        // Decline optional analytics using the public UI, never accept tracking.
        const decline = page.getByRole('button', { name: 'Decline analytics', exact: true });
        if (await decline.isVisible()) {
          await decline.click();
          await decline.waitFor({ state: 'hidden' });
        }
        const title = await page.title();
        const text = await page.locator('body').innerText();
        assert.ok(item.title.test(title + ' ' + text.slice(0, 3000)), 'Expected product identity must be present');
        assert.ok(!/just a moment|verify you are human|access denied/i.test(title), 'Do not capture access-control challenges');
        assert.ok(text.length > 200, 'Do not publish an empty or error page');
        const name = `${item.slug}-${size.name}.webp`;
        const buffer = await page.screenshot({ fullPage: false, animations: 'disabled' });
        await sharp(buffer).webp({ quality: 88 }).toFile(`${output}/${name}`);
        const path = `/images/captured/${name}`;
        images.push(path);
        imageCaptions.push(`${item.label} public website · ${size.name} capture. Marketing page, not an authenticated product dashboard.`);
        report.push({ project: item.slug, source: page.url(), capturedAt: new Date().toISOString(), width: size.width, height: size.height, path, visibility: 'anonymous public page', type: 'marketing-page screenshot', consent: 'optional analytics declined when offered', title, status: 'captured' });
      } catch (error) {
        report.push({ project: item.slug, source: item.url, viewport: size.name, status: 'not captured', reason: String(error.message) });
      } finally { await context.close(); }
    }
    if (images.length) captured[item.slug] = { images, imageCaptions };
  }
} finally { await browser.close(); }

await writeFile('src/data/captured-screens.ts', `// Generated from anonymous public pages. See docs/portfolio-redesign/capture-report.json.\nexport const capturedScreens: Record<string, { images: string[]; imageCaptions: string[] }> = ${JSON.stringify(captured, null, 2)};\n`);
const path = 'src/data/portfolio.ts';
let source = await readFile(path, 'utf8');
if (!source.includes('import { capturedScreens }')) source = `import { capturedScreens } from "@/data/captured-screens";\n${source}`;
const marker = 'export const selectedWork =';
assert.ok(source.includes(marker), 'Expected curated-data marker must exist');
if (!source.includes('// Apply captured public screens')) source = source.replace(marker, `// Apply captured public screens while retaining existing product screenshots.\nfor (const project of portfolioProjects) {\n  const publicScreens = capturedScreens[project.slug];\n  if (publicScreens) {\n    const originalImages = project.images ?? [];\n    const originalCaptions = originalImages.map((_, index) => project.imageCaptions?.[index] ?? project.name + " — existing product screen " + (index + 1) + ".");\n    project.images = [...originalImages, ...publicScreens.images];\n    project.imageCaptions = [...originalCaptions, ...publicScreens.imageCaptions];\n  }\n}\n\n${marker}`);
await writeFile(path, source);
await writeFile('docs/portfolio-redesign/capture-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ capturedProjects: Object.keys(captured), results: report }, null, 2));
