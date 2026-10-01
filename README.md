# Bhadresh Malankiya — Engineering portfolio

A recruiter-first portfolio for full-stack, SaaS and applied AI engineering. Built with Next.js App Router, TypeScript and Tailwind CSS. The public homepage is https://bhadresh-malankiya.ascendxi.com.

## Experience

The homepage introduces the engineering profile, selected work, technical approach, authentic portrait and contact actions. Four featured case studies lead into a 14-project archive. Employer products, client delivery and founder ventures are labeled separately. The Weekend Builder memoir and field guides remain available as supporting reading.

The design uses warm off-white, dark ink and restrained bronze. Native interactive engineering layers replace the homepage's decorative WebGL model. Progressive CSS scroll effects decorate the page without hiding essential text or links. Native scrolling, reduced-motion support and ordinary document flow replace long pinned project panels.

## Development

```bash
npm ci
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

Node.js 22 is used in CI. Build and public browsing do not require SMTP configuration. Existing optional mail functionality remains in `src/lib/mailer.ts` and the visitor notification route; the old compulsory welcome dialog is no longer mounted.

## Content and components

- `src/data/profile.ts`: central contact details, canonical domain and historical profile data.
- `src/data/portfolio.ts`: curated professional identity, selected work, case studies and technology scope. This is the presentation layer over the original project records.
- `src/data/captured-screens.ts`: successfully captured anonymous public-page assets, when available.
- `src/components/ProjectGallery.tsx`: stable contain-fit images, manual thumbnails and keyboard-accessible enlargement. No autoplay or overlapping coverflow.
- `src/components/ProjectShowcase.tsx`: normal-flow featured case studies with readable contribution summaries.
- `src/app/portfolio.css` and `portfolio-polish.css`: responsive portfolio design tokens and progressive interactions. The legacy ink theme remains available to memoir/detail-guide pages.
- `src/components/MobileNav.tsx`: a small interactive navigation island; the rest of navigation remains server rendered.
- `src/app/projects/`: archive and individual case-study routes, metadata and social previews.

## Images and claims

Existing project screenshots and the original portrait are reused. New public marketing-page screenshots are labeled as marketing pages, not authenticated dashboards. Capture provenance and failures are recorded in `docs/portfolio-redesign/capture-report.json`. Restricted or failed captures are not replaced with invented product screens.

The ExtendedForms figures shown are explicitly historical portfolio-reported scale, not a live analytics feed. Employer-product technical ownership is not presented as company ownership. Internal healthcare screens are not republished by the new case-study presentation.

## Quality checks

The read-only `Portfolio quality` GitHub Actions workflow checks the locked dependency tree, ESLint, TypeScript, production build and Playwright regression tests.

```bash
npx playwright install chromium
# Start the production server in another terminal after npm run build.
node scripts/portfolio-smoke.mjs
```

Tests cover eight representative routes at six viewport widths (360, 390, 768, 1024, 1440 and 1920 pixels), heading structure, horizontal overflow, image loading, enlarged-gallery keyboard controls, focus restoration, mobile navigation and PDF download integrity. Additional checks cover reduced motion and first-image rendering without JavaScript. These are Chromium regression checks, not a claim of exhaustive cross-browser or assistive-technology certification.

Workflow artifacts include screenshots and a JSON report. Committed review evidence in `docs/portfolio-redesign/` describes the capture-stage build; the final commit's GitHub Actions result is authoritative for later changes.

## Deployment

Pushes to `main` use the existing Vercel integration. No new hosting credentials are needed. The one-time asset/dependency preparation workflow was a staging aid and is removed before production; the continuing quality workflow has read-only repository access.
