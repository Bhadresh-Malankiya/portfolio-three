# October 2026 creative refresh

Internal handoff for the current portfolio refresh, recorded 12 October 2026. This document supplements the earlier redesign notes; the existing README, reports and captures remain intact. In particular, the earlier README describes a previous direction without homepage WebGL or Lenis. The current implementation deliberately uses both, with reduced-motion alternatives.

## Direction

The portfolio now reads as a sequence of distinct spaces rather than repeated glass cards. The opening is a dark, full-width workshop; selected projects have their own product colours and device stages; the person behind the work appears in a warm-paper field journal; client feedback occupies a cobalt listening room; the last section is a large typographic invitation.

IBM Plex Sans carries the main typography, IBM Plex Mono provides small functional labels, and Fraunces supplies occasional handwritten-feeling emphasis. Chartreuse is a small signal colour, not a replacement for readable text contrast. The motion supports entry, product focus and transitions. It does not autoplay the reviews or project screenshot galleries.

Creative research references: Bruno Simon, Dennis Snellenberg and Lusion. These informed the emphasis on an immersive entrance, intentional scroll choreography and different visual treatments across the story. No source code, model files or visual assets were imported from those portfolios.

## Current section sequence

1. **From a question to a working product** — `Hero.tsx` uses “Ideas don’t ship themselves.” above a folded-paper model that becomes a small twin-engine aircraft in `three/PaperPlaneScene.tsx`. The same wing geometry morphs continuously, with a one-time banked arrival and a short speed-line burst in the middle act. Scrolling on large screens moves through question, build and ship; chapter buttons provide direct control, including mobile and reduced-motion modes. The detailed aperture image and zoom have been removed from the hero.
2. **Selected work** — `DeviceGallery.tsx`, `three/DeviceScene.tsx` and `ProductScenery.tsx` provide separate laptop and phone chapters. Project screens, short explanations and background motifs change together. Device visibility, framing and screen transitions are handled independently so changing a screenshot does not remount the entire device.
3. **The rest of the work** — `WorkArchive.tsx` is a compact stack of project folders linking to the full index. The homepage concentrates on Quzo (architecture and AI), VocalXI (founder ownership), ExtendedForms (scale and leadership), and Hey Buddy (mobile). The project index opens with the same three web products; other projects remain accessible without receiving another large featured slot.
4. **The person behind the build** — `LifePanel.tsx` presents the actual portrait as a cobalt-and-paper collage, a single expandable career timeline, four large linked impact figures and a visible six-part expertise index.
5. **After the handover** — `ClientReviews.tsx` presents three existing Upwork quotes in a large manual spotlight, with previous/next buttons and keyboard-operable review tabs. Quote text remains unchanged.
6. **Take something with you** — `DownloadsSection.tsx` retains the existing book and résumé files while fitting the new editorial presentation.
7. **The next chapter** — `ContactCTA.tsx` closes with the large “Let’s build.” email link and a résumé download. `Nav.tsx` uses stronger foreground contrast and a translucent dark background over the hero.

## Persistent guide

`FloatingContactCard.tsx` now presents a small cartoon engineer from `three/BuilderAvatar.tsx`. Six moods accompany section changes, with short optional contextual notes and a reading-progress indicator. Hover, keyboard focus or tap reveals the existing real portrait and CV. Escape and the close control restore focus; outside interaction dismisses the card. Reduced motion renders a static character, and unavailable WebGL falls back to the portrait. Project, memoir and field-guide routes each have their own label.

## Project pages

`ProjectCaseStudy.tsx` and `src/data/project-themes.ts` give each case study its own palette, graphical motif and concise narrative sequence. `src/app/projects/[slug]/page.tsx` mounts this presentation. `ProjectGallery.tsx` retains real project imagery with enlargement controls. `ProjectIndex.tsx`, `ProjectCard.tsx` and `src/app/projects/page.tsx` carry the visual language into the filterable index.

Project-specific themes include the warm voice-product palette for VocalXI, lilac assessment graphics for Quzo, green forms graphics for ExtendedForms, and a jewellery-oriented treatment for JewelXI. These are presentation themes, not new product or performance claims. The source of profile and project facts remains the existing typed data, including `src/data/portfolio.ts`.

Quzo additionally includes `QuzoArchitecture.tsx`: three selectable request paths, separate Forms/Exams modular monoliths, Redis and distinct configuration/response stores. The user confirmed that core modules and Redis are implemented; autoscaling and replicas are planned. The diagram labels these states separately, treats HA standby as planned, and makes no measured concurrency or uptime claim. Engineering notes explain cache invalidation, replica lag, database write limits and scaling prerequisites.

## Asset provenance

- **`public/images/engineers-aperture.webp`** is a retained, currently unused decorative image from the earlier hero: a chrome-and-glass architectural aperture. It was produced with the built-in image-generation tool and converted from its native output to WebP for the page. It is visual atmosphere, not a photograph of an actual installation or a project screenshot.
- **`public/images/profile.png`** remains the user's existing portrait. Its new borders, orbit lines, labels and print treatment are native HTML/CSS/SVG decoration; the person's likeness was not regenerated.
- The laptop and phone are **procedural Three.js devices**, constructed in `src/components/three/DeviceScene.tsx`. They are MacBook- and iPhone-inspired geometry, not downloaded Apple CAD assets. No external 3D model files or additional external-model licences were introduced. Proportions now follow the 2024 14-inch M4 Pro MacBook Pro and iPhone 16 Pro; official dimensions, product-photo references, native texture sizes and approximation limits are recorded in `device-reference.md`.
- The paper plane and cartoon guide are original procedural Three.js geometry, with no external model assets. The guide is a stylized character, not an exact likeness. Existing real project screenshots and downloadable PDFs remain in use.

## Styling and animation ownership

- `src/app/hero-story.css`: opening narrative, plane theatre and responsive chapter controls.
- `src/app/companion.css`: persistent cartoon guide, chapter indicator and profile card.
- `src/app/exhibition.css`: work stages, archive and overarching exhibition presentation.
- `src/app/human-story.css`: scoped paper journal, cobalt reviews and contact finale.
- `src/app/project-worlds.css`: project-specific case studies and project index presentation.
- `src/app/quzo-architecture.css`: architecture map, request paths and responsive engineering notes.
- `src/lib/device-framing.ts`: camera fitting and safe model bounds.
- `src/lib/device-choreography.ts`: scroll pose and project timing.
- `scripts/device-framing-test.mjs`: framing and choreography regression checks.
- `src/app/layout.tsx` and `src/app/page.tsx`: imports and section composition.

Keep device objects mounted when swapping screens. Keep texture loading and screenshot changes isolated from model geometry, camera fitting and the outer scene boundary. Keep camera fitting based on the entire animation envelope, not just one attractive still frame.

## Review record

The root implementation review used the browser at **1440 × 1000**, **390 × 844** and **1920 × 1080**. It covered device stages and transitions, the timeline, review controls, a case-study screenshot gallery modal and project-index filters. The portrait and review layouts were included in the mobile pass. These are checks at the stated viewport sizes, not a claim of coverage for every device or browser.

Current lint, TypeScript and device-framing checks passed before the final production build. The framing suite checked **36,360 projected corners across 15 viewport ratios**. The human sections also passed targeted ESLint and diff checks during integration. Their timeline controls expose expanded state, review tabs support arrow keys/Home/End, visible focus states remain available, and decorative portrait movement is disabled with reduced motion. Final release validation belongs to the root task's completed build and browser results.

The subsequent hero-and-guide pass reviewed **1440 × 1000**, **1440 × 800**, **768 × 950** and **390 × 844**. It checked all three opening chapters, successful 3D loading, guide context after navigation, mobile card bounds, Tab order, Escape focus restoration and the CV link. A false WebGL fallback event and narrow-screen control overlap were found and fixed during that pass. The existing smoke suite now contains regressions for these behaviors; the browser CLI suite was not run in this pass.

## Content guardrails

Keep MB Systems at **2020–2022**. Retain **400K+ ExtendedForms users**, **10M+ online exams**, **10+ developers managed**, and experience scaling products **from 10 to 100,000 users**. The last figure is not a concurrent-user claim. Keep founder work distinct from employer products, preserve the actual Upwork quotes, and do not use generated product images or decorative metrics as evidence.

## Device, flight and architecture refinement

The integrated refinement was reviewed at 1440 × 1000, 1265 × 720 and 390 × 844. A browser-only morph-target initialization error was fixed by constructing each wing Mesh with its geometry, and readiness now follows a successful draw. Actual rendering of the paper and aircraft, mobile chapter selection, profile-card dismissal/CV access, laptop/phone screens and Quzo request-path selection were checked. The initial hardware blur was removed. A mobile display/glass depth conflict was fixed with camera clipping planes fitted to the hardware bounds and a small screen depth bias; dedicated depth-separation checks were added. Guide notes moved above the avatar and desktop project controls reserve room for the companion. Architecture technical text was enlarged and switches to a stacked layout below 1160 px. No global horizontal overflow was found on the mobile checks.

Lint, TypeScript, production build and all 36,360 device-framing checks passed. The smoke script was updated for the curated project order, shorter hero narrative and architecture journeys; its CLI runner was not executed in this pass. Existing GitHub dependency-audit findings remain a separate release-check limitation.
