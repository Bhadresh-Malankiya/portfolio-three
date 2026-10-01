# Portfolio redesign

## Direction
Recruiter-first introduction, warm editorial surfaces, clear case studies and accessible progressive interaction. The original memoir and field-guide detail routes remain available. The homepage no longer mounts decorative WebGL scenes, Lenis, automatic welcome dialogs or floating contact/download controls.

## Content and ownership
`src/data/portfolio.ts` is the presentation layer over historical source records. Employer products are distinguished from founder ventures. Reported ExtendedForms metrics are labeled historical, not live. VocalXI is included without representing planned calling integrations as shipped. Internal healthcare screenshots are withheld. No fabricated dashboard images are used.

## Screenshots
Existing product screenshots are preserved. `scripts/capture-public.mjs` captures only anonymous allowlisted public pages and writes a provenance report. Marketing screenshots are explicitly labeled. A failed capture must remain recorded as a failure; it is not replaced with an invented product image. Sources and capture times are in `capture-report.json` when captures are completed.

## Tests
The read-only `Portfolio quality` workflow runs ESLint, TypeScript, production build and Playwright browser checks. The browser script covers eight routes at six widths (360–1920px), gallery keyboard interaction, focus restoration, mobile navigation, PDF download integrity, reduced-motion and no-JavaScript first-image rendering. Test results and screenshots are saved as workflow artifacts. A report committed alongside captured assets applies to the tree tested in that capture run; use the final commit's workflow status for the final result.

## Assets and motion
`ProjectGallery.tsx` renders a stable image without autoplay or measurement gating. Images use contain-fit proportions and keyboard-accessible enlargement. Scroll effects are progressive CSS-only decoration. Essential content is never hidden until an animation executes. The existing portrait is used unchanged.

## Maintenance
Update the typed project content instead of hardcoding new claims into components. Add captions for new product screenshots. Keep the first screenshot representative and recognizable at small sizes. Do not reintroduce overlapping automatic carousels, nested interactive controls, compulsory modals or long pinned sections.

The one-time capture/update workflow is a staging aid and is removed before production. The ongoing quality workflow requires read-only repository access.
