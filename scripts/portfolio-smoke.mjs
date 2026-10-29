import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.PORTFOLIO_TEST_URL || "http://localhost:3000";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({ headless: true });
const findings = [];
const errors = [];
const routes = [
  "/",
  "/projects",
  "/projects/extendedforms-io",
  "/projects/quzo-ai",
  "/projects/vocalxi",
  "/projects/hey-buddy",
  "/field-guide",
];
const guideLabels = {
  "/": "The beginning",
  "/projects": "More to explore",
  "/field-guide": "For your journey",
};

async function assertCompanionRendered(page, message) {
  // Canvas presence alone misses the regression where its fallback side effect
  // permanently replaced a successfully mounted avatar with the portrait.
  await page.waitForFunction(() => {
    const canvas = document.querySelector(".companion-model canvas");
    return canvas && canvas.width > 0 && canvas.height > 0
      && !document.querySelector(".companion-fallback");
  });
  assert.equal(await page.locator(".companion-model canvas").count(), 1, message);
  assert.equal(await page.locator(".companion-fallback").count(), 0, `${message}: first 3D frame is ready`);
}

try {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(`${width}: ${error.message}`));
    for (const route of routes) {
      const response = await page.goto(base + route, {
        waitUntil: "networkidle",
      });
      assert.equal(response?.status(), 200, `${route} returns 200`);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("h1").count(), 1, `${route}: one h1`);
      const expectedGuide = guideLabels[route] ?? "Inside the work";
      await page.waitForFunction(
        (label) => document.querySelector(".builder-companion")?.getAttribute("data-section-label") === label,
        expectedGuide,
      );
      assert.equal(
        await page.locator(".builder-companion").getAttribute("data-section-label"),
        expectedGuide,
        `${width}px ${route}: companion describes the current page`,
      );
      assert.equal(await page.locator(".companion-chapter").count(), 0, "the guide has no persistent bottom chat label");
      if (route === "/" && [390, 1440].includes(width)) {
        await assertCompanionRendered(page, `${width}px: actual 3D companion renders`);
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      assert.equal(
        overflow,
        false,
        `${width}px ${route}: no horizontal overflow`,
      );
      const bounds = await page.locator("h1").boundingBox();
      assert.ok(
        bounds &&
          bounds.width > 0 &&
          bounds.x >= 0 &&
          bounds.x + bounds.width <= width + 1,
        `${route}: heading fits viewport`,
      );
      if (route === "/" || route.startsWith("/projects")) {
        const hiddenContent = await page
          .locator("h1")
          .evaluate(
            (el) =>
              getComputedStyle(el).opacity === "0" ||
              getComputedStyle(el).visibility === "hidden",
          );
        assert.equal(hiddenContent, false, `${route}: main heading is visible`);
      }
      if (
        [390, 1440].includes(width) &&
        ["/", "/projects", "/projects/quzo-ai", "/projects/hey-buddy"].includes(
          route,
        )
      ) {
        // A full-page capture otherwise misses lazy images below the viewport.
        await page.locator("img").evaluateAll((images) =>
          images.forEach((image) => {
            image.loading = "eager";
          }),
        );
        await page.waitForFunction(
          () => Array.from(document.images).every((image) => image.complete),
          { timeout: 30000 },
        );
        const broken = await page
          .locator("img")
          .evaluateAll((images) =>
            images
              .filter((image) => image.naturalWidth === 0)
              .map((image) => image.getAttribute("src")),
          );
        assert.deepEqual(
          broken,
          [],
          `${route}: all public screenshots and portrait load`,
        );
        const name =
          route === "/" ? "home" : route.replaceAll("/", "-").slice(1);
        await page.screenshot({
          path: `test-results/${name}-${width}.png`,
          fullPage: true,
        });
      }
      findings.push({
        width,
        route,
        status: response.status(),
        horizontalOverflow: overflow,
      });
    }
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base + "/projects/quzo-ai", { waitUntil: "networkidle" });
  const openButton = page.getByRole("button", {
    name: "Enlarge Quzo.ai screenshot",
    exact: true,
  });
  await openButton.click();
  assert.equal(
    await page.locator("dialog[open]").count(),
    1,
    "enlarged viewer opens",
  );
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator("dialog[open]").count(),
    0,
    "Escape closes enlarged viewer",
  );
  assert.equal(
    await openButton.evaluate((el) => el === document.activeElement),
    true,
    "gallery focus restores",
  );
  await page.locator(".gallery-contact-sheet summary").click();
  await page
    .getByRole("button", { name: /Show Quzo.ai screenshot 3:/ })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: /Show Quzo.ai screenshot 3:/ })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelectorAll('.chapter-device[data-scene-ready="true"]').length === 2);
  assert.equal(await page.locator(".chapter-device").evaluateAll(stages => stages.every(stage => stage.getBoundingClientRect().top > innerHeight)), true, "both device scenes are warmed before visitors leave the hero");
  const desktopGuide = page.getByRole("button", { name: "Meet Bhadresh — profile and CV", exact: true });
  const desktopCard = page.getByRole("dialog", { name: "Bhadresh’s profile card", exact: true });
  await desktopGuide.hover();
  await desktopCard.waitFor({ state: "visible" });
  await desktopGuide.click();
  assert.equal(await desktopGuide.getAttribute("aria-expanded"), "true", "clicking an already-hovered guide pins its card instead of closing it");
  await desktopGuide.click();
  await desktopCard.waitFor({ state: "hidden" });
  assert.equal(await desktopGuide.getAttribute("aria-expanded"), "false", "second explicit click closes a pinned card");
  const openingStory = page.getByRole("group", { name: "Explore the opening story", exact: true });
  await openingStory.getByRole("button", { name: /Make the pieces work/ }).click();
  await page.waitForFunction(() => document.querySelector("#hero")?.getAttribute("data-act") === "1");
  await page.getByRole("heading", { name: "Then, something that works.", exact: true }).waitFor();
  assert.equal(await openingStory.getByRole("button", { name: /Make the pieces work/ }).getAttribute("aria-pressed"), "true", "desktop chapter control scrolls to the build act");
  assert.equal(await page.locator(".flight-narrative h2").textContent(), "Then, something that works.", "build act presents its story");
  await openingStory.getByRole("button", { name: /Put it in the world/ }).click();
  await page.waitForFunction(() => document.querySelector("#hero")?.getAttribute("data-act") === "2");
  await page.getByRole("heading", { name: "Finally, out in the world.", exact: true }).waitFor();
  assert.equal(await page.locator(".flight-narrative h2").textContent(), "Finally, out in the world.", "ship act presents its story");
  await openingStory.getByRole("button", { name: /Find the question/ }).click();
  await page.waitForFunction(() => document.querySelector("#hero")?.getAttribute("data-act") === "0");
  await page.getByRole("button", { name: "01 Quzo.ai", exact: true }).click();
  await page.waitForFunction(
    () =>
      document
        .querySelector("#work .chapter-selector button:nth-child(1)")
        ?.getAttribute("aria-pressed") === "true",
  );
  const quzoScreens = page.getByRole("group", {
    name: "Quzo.ai screenshots",
    exact: true,
  });
  await quzoScreens
    .getByRole("button", { name: "Screen 2", exact: true })
    .click();
  assert.ok(
    (await page
      .getByRole("button", { name: "Screen 2", exact: true })
      .getAttribute("aria-pressed")) === "true",
    "laptop screen selector works",
  );
  await page
    .getByRole("button", { name: "Enlarge Quzo.ai screenshot", exact: true })
    .click();
  assert.ok(
    await page
      .getByRole("dialog", { name: "Quzo.ai screenshot viewer" })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog[open]").count(), 0);
  // Switching to the non-scroll layout must clear the desktop exit transform.
  await page.getByRole("link", { name: "Next: mobile", exact: true }).click();
  await page
    .getByRole("button", { name: "02 Hey Buddy", exact: true })
    .click();
  await page.waitForFunction(
    () =>
      document.querySelector("#mobile-work .device-canvas")?.dataset.ready ===
      "true",
  );
  await page.getByRole("link", { name: "about()", exact: true }).click();
  await page.waitForFunction(
    () =>
      document.querySelector("#mobile-work .device-render-stage")?.style.opacity ===
      "0",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll(".device-render-stage")).every(
      (el) =>
        getComputedStyle(el).opacity === "1" &&
        getComputedStyle(el).transform === "none",
    ),
  );
  assert.equal(
    await page.locator(".device-canvas canvas").count(),
    2,
    "both visited scenes remain mounted",
  );
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".flight-heading").evaluate(el => getComputedStyle(el).opacity), "1", "mobile hero remains visible without a pinned scroll range");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator("#mobile-navigation")
    .getByRole("link", { name: "work()", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .getAttribute("aria-expanded"),
    "false",
    "mobile anchor closes navigation",
  );
  await page.getByRole("link", { name: "Next: mobile", exact: true }).click();
  await page
    .getByRole("button", { name: "02 Hey Buddy", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "One tag. A way to connect.", exact: true })
    .waitFor();
  assert.ok(
    await page
      .getByRole("region", { name: "Mobile project showcase" })
      .isVisible(),
    "phone has a separate section",
  );
  await page
    .getByRole("button", { name: "Enlarge Hey Buddy screenshot", exact: true })
    .click();
  assert.ok(
    await page
      .getByRole("dialog", { name: "Hey Buddy screenshot viewer" })
      .isVisible(),
    "phone screenshot opens",
  );
  await page.keyboard.press("Escape");
  for (const file of [
    "/downloads/Bhadreshkumar-malankiya-resume-full.pdf",
    "/downloads/bhadreshkumar-malankiya-resume.pdf",
    "/downloads/bhadresh-malankiya-resume.pdf",
  ]) {
    const download = await context.request.get(base + file);
    assert.equal(download.status(), 200, `${file} downloads`);
    assert.ok((await download.body()).subarray(0, 5).toString() === "%PDF-", `${file} is a PDF`);
  }
  await context.close();

  const architecturePage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  architecturePage.on("pageerror", (error) => errors.push(`architecture: ${error.message}`));
  await architecturePage.goto(base + "/projects/quzo-ai#quzo-architecture", { waitUntil: "networkidle" });
  const architecture = architecturePage.locator("#quzo-architecture");
  assert.equal(await architecture.getAttribute("data-journey"), "exam", "architecture opens on the submission path");
  await architecture.getByRole("button", { name: /Exam-start surge/ }).click();
  assert.equal(await architecture.locator('.qarch-node-pool [data-mode="serving"]').count(), 3, "surge illustrates additional exam capacity");
  assert.match(await architecture.locator(".qarch-pool-note").innerText(), /planned/, "illustrated extra capacity is not presented as shipped");
  await architecture.getByRole("button", { name: /Scale back/ }).click();
  assert.equal(await architecture.locator('.qarch-node-pool [data-mode="draining"]').count(), 1, "scale-in drains an instance before removal");
  await architecture.getByRole("button", { name: /Configure/ }).click();
  assert.equal(await architecture.getAttribute("data-journey"), "configure", "configuration path can be selected");
  assert.equal(await architecture.locator(".qarch-form-data").getAttribute("data-lit"), "true", "configuration highlights durable form storage");
  await architecture.getByRole("button", { name: /Review results/ }).click();
  assert.equal(await architecture.locator(".qarch-route.route-report-read").getAttribute("data-lit"), "true", "reports highlight their separate read route");
  await architecture.getByText("Open the engineering notes", { exact: true }).click();
  assert.ok(await architecture.getByRole("heading", { name: "Where are the limits?", exact: true }).isVisible(), "engineering tradeoffs are accessible");
  await architecturePage.setViewportSize({ width: 390, height: 844 });
  await architecture.getByRole("button", { name: /Run an exam/ }).click();
  await architecture.getByRole("button", { name: /Exam-start surge/ }).click();
  assert.ok(await architecturePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "architecture fits a narrow mobile viewport");
  await architecturePage.close();

  // A real touch context prevents mouse-hover timing from pretending to test taps.
  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const touchPage = await touchContext.newPage();
  touchPage.on("pageerror", (error) => errors.push(`touch companion: ${error.message}`));
  await touchPage.goto(base, { waitUntil: "networkidle" });
  await assertCompanionRendered(touchPage, "touch: actual 3D companion renders");
  const touchChapters = touchPage.getByRole("group", { name: "Explore the opening story", exact: true });
  await touchChapters.getByRole("button", { name: /Make the pieces work/ }).tap();
  await touchPage.waitForFunction(() => document.querySelector("#hero")?.getAttribute("data-act") === "1");
  assert.equal(await touchChapters.getByRole("button", { name: /Make the pieces work/ }).getAttribute("aria-pressed"), "true", "mobile hero chapter works without a pinned scroll range");
  await touchChapters.getByRole("button", { name: /Put it in the world/ }).tap();
  await touchPage.waitForFunction(() => document.querySelector("#hero")?.getAttribute("data-act") === "2");
  await touchPage.getByRole("heading", { name: "Finally, out in the world.", exact: true }).waitFor();
  assert.equal(await touchPage.locator(".flight-narrative h2").textContent(), "Finally, out in the world.", "mobile hero updates its story");
  const companionTrigger = touchPage.getByRole("button", { name: "Meet Bhadresh — profile and CV", exact: true });
  const identityCard = touchPage.getByRole("dialog", { name: "Bhadresh’s profile card", exact: true });
  await companionTrigger.tap();
  await identityCard.waitFor({ state: "visible" });
  assert.equal(await companionTrigger.getAttribute("aria-expanded"), "true", "first touch opens the ID card");
  const cardBounds = await identityCard.boundingBox();
  assert.ok(cardBounds && cardBounds.x >= 0 && cardBounds.y >= 72 && cardBounds.x + cardBounds.width <= 390 && cardBounds.y + cardBounds.height <= 844, "mobile ID card fits below navigation and within the viewport");
  const cardCV = identityCard.getByRole("link", { name: /Take my CV/ });
  assert.equal(await cardCV.getAttribute("href"), "/downloads/bhadreshkumar-malankiya-resume.pdf", "ID card links to the downloadable CV");
  assert.equal(await cardCV.getAttribute("download"), "Bhadreshkumar-Malankiya-Resume.pdf", "ID card provides a download filename");
  const cardPDF = await touchContext.request.get(new URL(await cardCV.getAttribute("href"), base).href);
  assert.equal(cardPDF.status(), 200, "ID card CV is reachable");
  assert.equal((await cardPDF.body()).subarray(0, 5).toString(), "%PDF-", "ID card CV is a real PDF");
  await companionTrigger.tap();
  await identityCard.waitFor({ state: "hidden" });
  assert.equal(await companionTrigger.getAttribute("aria-expanded"), "false", "second touch closes the ID card");
  await companionTrigger.tap();
  await identityCard.waitFor({ state: "visible" });
  await touchPage.keyboard.press("Tab");
  assert.equal(await identityCard.getByRole("button", { name: "Close profile card", exact: true }).evaluate((el) => el === document.activeElement), true, "Tab reaches the ID card actions from its trigger");
  await touchPage.keyboard.press("Escape");
  await identityCard.waitFor({ state: "hidden" });
  assert.equal(await companionTrigger.evaluate((el) => el === document.activeElement), true, "Escape restores focus to the companion");
  assert.equal(await companionTrigger.getAttribute("aria-expanded"), "false", "Escape does not immediately reopen the focused card");
  findings.push({ mode: "touch", heroChapters: true, companionCanvas: true, profileCard: true, cvDownload: true });
  await touchContext.close();

  for (const options of [
    { javaScriptEnabled: false },
    { reducedMotion: "reduce" },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      ...options,
    });
    const p = await ctx.newPage();
    await p.goto(base, { waitUntil: "networkidle" });
    assert.ok(
      await p.getByRole("heading", { level: 1 }).isVisible(),
      "heading works without motion/JavaScript",
    );
    if (options.reducedMotion === "reduce") {
      await assertCompanionRendered(p, "reduced motion: static 3D companion remains available");
      await p.getByRole("button", { name: "Meet Bhadresh — profile and CV", exact: true }).click();
      const reducedCard = p.getByRole("dialog", { name: "Bhadresh’s profile card", exact: true });
      await reducedCard.waitFor({ state: "visible" });
      assert.ok(await reducedCard.getByRole("link", { name: /Take my CV/ }).isVisible(), "reduced motion keeps the companion CV action available");
      await p.keyboard.press("Escape");
      await reducedCard.waitFor({ state: "hidden" });
    }
    assert.ok(
      await p.getByRole("link", { name: "Explore all 15 projects" }).isVisible(),
      "CTA works without motion/JavaScript",
    );
    await p.goto(base + "/projects/quzo-ai", { waitUntil: "networkidle" });
    const screen = p.locator(".gallery-stage img").first();
    await screen.scrollIntoViewIfNeeded();
    await p.waitForFunction(() => {
      const img = document.querySelector(".gallery-stage img");
      return img && img.complete && img.naturalWidth > 0;
    });
    findings.push({ mode: options, screenshotLoaded: true });
    await ctx.close();
  }
  assert.deepEqual(errors, [], "No browser runtime errors");
  console.log(
    JSON.stringify(
      {
        passed: true,
        checks: findings.length,
        findings,
        runtimeErrors: errors,
      },
      null,
      2,
    ),
  );
  await writeFile(
    "test-results/report.json",
    JSON.stringify({ passed: true, findings, runtimeErrors: errors }, null, 2),
  );
} finally {
  await browser.close();
}
