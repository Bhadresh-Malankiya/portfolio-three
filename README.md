# The Weekend Builder

Bhadreshkumar Malankiya's portfolio & memoir site — Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + Lenis + React Three Fiber.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bhadresh-Malankiya/portfolio-three)

Zero-config: Vercel auto-detects Next.js, `npm run build` is fully static (verified — 38/38 pages), and there are no required environment variables. After deploying, turn on **Analytics** and **Speed Insights** in the Vercel project dashboard (Project → Analytics / Speed Insights → Enable) — both `@vercel/analytics` and `@vercel/speed-insights` are already wired into `src/app/layout.tsx`; they no-op until enabled.

## Structure

- `src/data/` — every piece of real content lives here as typed data, pulled from `source-material/` (the résumé and *The Weekend Builder* memoir docx). Edit these files to update copy, projects, chapters, skills, or field guides — no JSX hunting required.
  - `profile.ts` — bio, contact, headline/ticker stats, certifications
  - `chapters.ts` — the 16-chapter memoir (foreword + chapters, each with a pull-quote, era, summary, icon, and expandable body)
  - `experience.ts` — employment/founder history
  - `projects.ts` — all 13 projects (metrics, tech, narrative, motif type)
  - `skills.ts` — the stack, grouped
  - `fieldGuides.ts` — the two "written for you" chapters (DSA/interview guide, first-job guide)
  - `impact.ts` — the before/after efficiency comparisons + uniqueness badges
- `src/components/` — shared UI. Notable ones:
  - `WeekendHeatmap.tsx` — signature visual: gray weekdays, gold weekends
  - `three/HeroScene.tsx`, `three/ImpactBars.tsx`, `three/ProjectNetwork.tsx` — the three WebGL scenes (hero wireframe knot, 3D bar chart, project node network), lazy-loaded via `Scene3D.tsx` + `LazyMount.tsx` so nothing loads until it's about to be seen
  - `ParticleField.tsx` — lightweight canvas ambient motes, used sparingly (hero, journey intro)
  - `ProjectFrame.tsx` / `ProjectMotif.tsx` — the "browser chrome" placeholder + the animated per-category motif inside it (radar sweep, candlestick, ECG, map pulse, etc.)
  - `ProjectShowcase.tsx` — the cinematic scroll sequence (thumbnail grows to full-bleed, then shrinks again) for the homepage finale
  - `ImpactSection.tsx` — animated before/after efficiency bars next to the 3D bar chart
  - `ChapterCard.tsx` / `ChapterCover.tsx` / `ChapterIcon.tsx` / `ChapterRail.tsx` / `ReadingProgress.tsx` — the `/journey` reading experience
  - `DownloadsSection.tsx` — "The paper trail" on the homepage: two paper-toned cards (reusing `ChapterCover` for the ebook) with direct `download` links to the PDFs in `public/downloads/`
  - `SmoothScroll.tsx` — Lenis wrapper
  - `JsonLd.tsx` — structured-data script tag, used for Person/WebSite (root layout), Book (`/journey`), SoftwareApplication (project pages), Article (field guides)
- `src/app/` — routes: `/`, `/journey`, `/projects`, `/projects/[slug]`, `/field-guide`, `/field-guide/[slug]`, plus `sitemap.ts`, `robots.ts`, `icon.tsx`, `opengraph-image.tsx`, and a per-project `opengraph-image.tsx`

## Design system

Grayscale-first: true black/gray/white (`--color-ink`, `--color-ink-2/3`, `--color-fg`, `--color-muted`), with **gold as the one deliberate highlight** (`--color-gold` / `--color-gold-bright`) reserved for weekend/craft/CTA moments, and a neutral `--color-silver` used as the secondary alternating accent so it never competes with gold. A warm paper tone (`--color-paper*`) is the one deliberately different surface, reserved for the memoir chapter cards. Type: Fraunces (display/editorial), IBM Plex Sans (body/UI), IBM Plex Mono (labels, stats, code-flavored bits). All tokens live in `src/app/globals.css`.

Motion respects `prefers-reduced-motion` throughout — the 3D scenes freeze rotation, the heatmap/particles/counters skip their animated states, and the cinematic scroll transforms still work but without the auto-rotating flourish.

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build (fully static — safe to deploy to Vercel as-is)
npm run lint     # eslint
```

## Images

`public/images/` holds real product screenshots and a profile photo, wired up in `src/data/projects.ts` (`images: [...]`) and rendered through `ProjectGallery.tsx` (crossfading, dot-paginated, phone frame for the one mobile app) instead of the generated `ProjectMotif` for any project that has them:

- Quzo.ai, ExtendedForms.io, HelpDesk AI, ZWOPR, BPS Trading, Intuitive Surgical Dashboard, Kexy, Hey Buddy (phone frame), Rightful — real screenshots
- eBaggageDrop, WebStack, Collahead, Freelance work — no screenshots supplied, so these still render the generated motif

`profile.jpg` is used in the homepage "Who's building this" section (`AboutSection.tsx`), grayscale by default and revealing color on hover to match the site's palette.

A handful of files in `public/images/` (`lrts.jpeg`, `compassrt.jpeg`, `github-copilot.jpeg`, `placeholder-project.jpeg`, `profile_smiling.jpeg`) weren't used — they didn't clearly match a project slug, or weren't needed once a project already had its named screenshot. They're untouched in the folder if you want to point me at where they go.

## Content source

`source-material/` holds the original résumé and memoir `.docx` files this entire site was built from. They're **gitignored** — kept locally for your own records, not pushed to the (public) GitHub repo, since they're personal working documents rather than site code. If you'd rather they were public, remove the `/source-material` line from `.gitignore`.

## Downloads (résumé + ebook)

`public/downloads/*.pdf` are print-ready PDFs generated from `source-material/`'s two `.docx` files — real files, not placeholders, committed to the repo (unlike the `.docx` sources) since they're meant to be public. They're served directly via `DownloadsSection.tsx` on the homepage ("The paper trail"), each behind a plain `<a download>` link — no JS, no API route.

To regenerate them after editing the source docs (macOS, no extra installs beyond Playwright's Chromium, already a devDependency path via `npx playwright install chromium` if needed):

```bash
textutil -convert html source-material/The_Weekend_Builder.docx -output /tmp/ebook.html
textutil -convert html source-material/Bhadreshkumar_Malankiya_Resume.docx -output /tmp/resume.html
# then print each through headless Chromium (page.pdf()) to public/downloads/ —
# see the git history for the exact one-off script if you need to recreate it.
```

**Known gap:** the memoir's "A Life in Timeline / The Years, at a Glance" section (right before the Foreword) is empty in the source `.docx` itself — not a conversion artifact, the heading has no body text underneath it in the manuscript. Worth a look if that section was meant to have content.
